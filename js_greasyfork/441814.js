// ==UserScript==
// @name         哔哩哔哩轻量化
// @namespace    https://ez118.github.io/
// @version      3.8
// @description  哔哩哔哩播放器轻量化工具
// @author       ZZY_WISU
// @match        *://*.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @license      GPLv3
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/441814/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%BD%BB%E9%87%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/441814/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%BD%BB%E9%87%8F%E5%8C%96.meta.js
// ==/UserScript==

/* 存储初始化 */
if(GM_getValue('IfNewPlayer') == null || GM_getValue('IfNewPlayer') == undefined){ GM_setValue('IfNewPlayer', true); }

/* 配置开始 */

var EmbedPlayerUrl = GM_getValue('IfNewPlayer') ? "https://www.bilibili.com/blackboard/html5mobileplayer.html?" : "https://www.bilibili.com/blackboard/webplayer/activity-embed-other-old.html?";

var VideoDetail = ""; /* 用于记录当前视频简介的变量 */
var VideoTitle = ""; /* 用于记录当前视频标题的变量 */
var VideoAid = ""; /* 用于记录当前视频aid的变量（bvid不记录，api使用aid的较多） */
/* 配置结束 */


function GetAjax(url,func) {
    GM_xmlhttpRequest({
        method: "GET", url: url, data:"",
        headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
        onload: function(response){func(response.responseText);}, onerror: function(response){alert("[错误]\n请求失败");}
    });
}

function $GET(name){
    var reg = new RegExp('(^|&)'+name+'=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) { return unescape(r[2]); }
    return "";
}

function GetRedirect(){
    /* 通过普通播放页链接获取aid或bvid */
    var str = window.location.href;
    str = str.replace("/s/", "/");
    if(str.indexOf("?") !== -1){}else{ str += "?";}
    str = str.split("/")[4].replace(str.substring(str.lastIndexOf("?")), "").replace("/", "");
    if(str[1] == "v"){
        return {"type":"aid", "id":str.replace("av", "")};
    } else {
        return {"type":"bvid", "id":str};
    }
}

function ShowVideoReplies(content){
    /* 向网页插入html元素，实现展示评论内容 */

    content = content.replace(/\[.*?\]/g,"").replace(/\r?\n/g,'<br/>').replace(/\【/g, "<b>【").replace(/\】/g, "】</b>");

    GM_addStyle(`.userscript-bilibili-replies-close { width:100%; border-radius:12px; background:#f25d8e; color:#FFF; padding:8px; border:none; margin:5px 0 5px 0; }
                 .userscript-bilibili-replies-hide { word-wrap:break-word; width:25%; height:100%; overflow-x:auto; background:#FFFFFFCC; color:#000; padding:10px; border:1px solid #CCC; line-height:20px; font-size:15px; position:fixed; top:0px; right:calc(-25% + 5px); bottom:0px; z-index:999; transition:all 0.3s; }
                 .userscript-bilibili-replies-hide:hover { right:0%; }
                 .userscript-bilibili-replies-show { word-wrap:break-word; width:25%; height:100%; overflow-x:auto; background:#FFFFFFCC; color:#000; padding:10px; border:1px solid #CCC; line-height:20px; font-size:15px; position:fixed; top:0px; right:0%; bottom:0px; z-index:999; }
                 .userscript-bilibili-reptitle { font-size:20px; font-weight:bold; margin-bottom:10px; color:#FFFFFF; background-color:#000000;}`);

    let MDiv = document.createElement('div');
    document.body.appendChild(MDiv);
    MDiv.setAttribute("class", "userscript-bilibili-replies-show");
    MDiv.setAttribute("id", "userscript-bilibili-replies");

    MDiv.innerHTML = `<b class="userscript-bilibili-reptitle">&nbsp;视频详情&nbsp;</b><br/>` + VideoDetail.replace(/\r?\n/g,'<br/>') + `<br/><hr/>
        <b class="userscript-bilibili-reptitle">&nbsp;视频评论&nbsp;</b><br/>` + content + `<br/>
        <button onclick='document.getElementById("userscript-bilibili-replies").remove()' class="userscript-bilibili-replies-close">关闭浏览栏</button><br/><br/>`;

    setTimeout(function(){
        document.getElementById('userscript-bilibili-replies').setAttribute('class','userscript-bilibili-replies-hide');
    }, 3000);
}

function GetVideoReplies(aid){
    /* 获取评论内容 */
    GetAjax("https://api.bilibili.com/x/v2/reply?jsonp=jsonp&pn=1&type=1&sort=2&oid=" + aid, function(result){
        result = JSON.parse(result);
        if(result.code == 0){
            let UserShow = "";

            (result.data.replies).forEach((item, index) => {
                UserShow += "【" + item.member.uname + "】 " + item.content.message + "\n";
            })

            ShowVideoReplies(UserShow);
        } else {
            alert("【提示】评论获取失败");
        }
    });
}



let menu1 = GM_registerMenuCommand('查看视频详情&评论', function () {
    /* 查看视频详情&评论菜单 */

    let url = window.location.href;

    if(url.includes("bilibili.com/blackboard/webplayer/") || url.includes("bilibili.com/blackboard/html5mobileplayer")){
        /* 如果是播放页，那么执行获取评论的函数 */
        GetVideoReplies(VideoAid);
    } else {
        /* 如果不是，则向用户提示： */
        alert("【提示】不支持的页面（若误判请反馈）");
    }
}, 'R');


let menu2 = GM_registerMenuCommand('在PC客户端中查看', function () {
    /* 在BiliBili客户端中查看视频菜单功能 */

    let url = window.location.href;

    if(url.includes("bilibili.com/video/")){
        /* 如果不是目标页面 */
        alert("【提示】不支持的页面（若误判请反馈）");
    } else if(url.includes("bilibili.com/blackboard/webplayer/") || url.includes("bilibili.com/blackboard/html5mobileplayer")) {
        /* 如果是轻量播放器，则直接使用页面加载时存储的aid创建链接 */
        location.href = "bilibili://video/" + VideoAid;
    }
}, 'O');

let menu3 = GM_registerMenuCommand('更改视频播放器', function () {
    /* 让用户决定是否使用新版播放器 */

    var test_value = confirm("【请选择】\n请选择是否使用新版播放器\n（“确定”使用新版(推荐)，“取消”使用旧版）");
    if(test_value) { GM_setValue('IfNewPlayer', true); }
    else { GM_setValue('IfNewPlayer', false); }
}, 'S');



(function() {
    'use strict';

    var url = window.location.href;

    if(url.includes("bilibili.com/video/")){
        /* 如果当前页面为普通播放页 */
        let cb = GetRedirect();
        top.location.href = EmbedPlayerUrl + cb.type + "=" + cb.id + "&page=1&danmaku=0";
    } else if(url.includes("bilibili.com/blackboard/webplayer/") || url.includes("bilibili.com/blackboard/html5mobileplayer")) {
        /* 推荐的播放器 */

        /* 获取视频标题和详情文本，方便后续获取，减少后续请求所用时长 */
        let DataStr = "";
        if($GET("bvid") != ""){ DataStr = "bvid=" + $GET("bvid"); }
        else { DataStr = "aid=" + $GET("aid"); }
        GetAjax("https://api.bilibili.com/x/web-interface/view?" + DataStr, function(aid){
            aid = JSON.parse(aid);
            try{
                VideoDetail = aid.data.desc;
                VideoTitle = aid.data.title;
                VideoAid = aid.data.aid;
            } catch {
                console.log("[USERSCRIPT/哔哩哔哩轻量化] 视频信息获取失败");
            }
        });

        /* 删除播放器多余控件，更改视频标题 */
        setTimeout(function() {
            try{
                document.getElementsByClassName("bilibili-player-video-sendjumpbar")[0].remove();
                document.getElementsByClassName("bilibili-player-video-pause-panel-container-qrcode")[0].remove();
                document.getElementsByTagName("title")[0].innerText = VideoTitle + "_哔哩哔哩_bilibili";
            } catch { }
        }, 3000);
    } else if(url.includes("player.bilibili.com/player")) {
        /* 烦人的新播放器 */

        /* 获取视频标题和详情文本，方便后续获取，减少后续请求所用时长 */
        let DataStr = "";
        if($GET("bvid") != ""){ DataStr = "bvid=" + $GET("bvid"); }
        else { DataStr = "aid=" + $GET("aid"); }
        GetAjax("https://api.bilibili.com/x/web-interface/view?" + DataStr, function(aid){
            aid = JSON.parse(aid);
            try{
                VideoDetail = aid.data.desc;
                VideoTitle = aid.data.title;
                VideoAid = aid.data.aid;
            } catch {
                console.log("[USERSCRIPT/哔哩哔哩轻量化] 视频信息获取失败");
            }
        });

        /* 删除播放器多余控件，更改视频标题 */
        setTimeout(function() {
            document.getElementsByClassName("bpx-player-relation-button")[0].remove();
            document.getElementsByClassName("bpx-player-inputbar-mask")[0].remove();
            document.getElementsByClassName("bpx-player-enter-button")[0].remove();
            GM_addStyle(".bpx-player-video-wrap video{pointer-events: none!important;}");
            //document.getElementsByClassName("bpx-player-dialog-area")[0].remove();
            document.getElementsByTagName("title")[0].innerText = VideoTitle + "_哔哩哔哩_bilibili";
            //document.querySelectorAll("*")
            document
                .getElementsByClassName("bpx-player-video-perch")
                .forEach(node =>
                    node.addEventListener(
                        "click",
                        event => event.stopImmediatePropagation(),
                        true
                    )
                );
        }, 3000);
    }
})();
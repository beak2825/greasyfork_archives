// ==UserScript==
// @name         破解立知(Lite)
// @namespace    https://ez118.github.io/
// @version      2.2
// @description  立知课堂破解工具精简版（由上海市某中学的多位青年于2022上海疫情风控时期共同开发、支持、调试和维护）
// @author       ZZY_WISU
// @match        https://*.imlizhi.com/slive/pc/*
// @match        https://easilive.seewo.com/*
// @license      GNU GPLv3
// @icon         https://edu.seewo.com/res/head/1/default.png
// @run-at document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/443417/%E7%A0%B4%E8%A7%A3%E7%AB%8B%E7%9F%A5%28Lite%29.user.js
// @updateURL https://update.greasyfork.org/scripts/443417/%E7%A0%B4%E8%A7%A3%E7%AB%8B%E7%9F%A5%28Lite%29.meta.js
// ==/UserScript==


/*   自定义部分   */

//var api = "https://s.imlizhi.com/slive/pc/enow/thumbnail/api/v1/courseware";
var api = "https://s2.imlizhi.com/slive/pc/enow/thumbnail/api/v1/courseware";

//对接官方接口

var ReaderUrl = "https://easilive.seewo.com/ZZY_WISU/";
//课件浏览器的链接

var MaxPageNum = 200;
//用于储存最大课件页面数量

/*以上为自定义部分*/


/* 以下为菜单设定 */
function OpenExplorer(cid, title, ver) {
    window.open(ReaderUrl + "@" + cid + "@" + ver + "@" + encodeURI(title));
}
function GetReplayList(){
    /*获取回放的课件列表*/
    var uid = window.location.href.split("?")[1].split("&")[0].split("=")[1];
    var ServerTime = new Date().getTime();
    var xhttp = null;

    if (window.XMLHttpRequest){ xhttp = new XMLHttpRequest(); }
    else if (window.ActiveXObject){ xhttp = new ActiveXObject('Microsoft.XMLHTTP'); }

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let jstr = eval("(" + this.responseText + ")");
            if (jstr.error_code == 0){
                let OPStr = "";
                for (var i = 0; i <= 10; i ++) {
                    try{
                        OPStr += (i + 1) + ". " + jstr.data.capsuleDetail.cwList[i].cwName + "\n";
                    } catch(e){}
                }
                let k = prompt("请选择需要打开的课件（填数字编号）\n" + OPStr, "1");
                OpenExplorer(jstr.data.capsuleDetail.cwList[k - 1].cwId, jstr.data.capsuleDetail.cwList[k - 1].cwName, jstr.data.capsuleDetail.cwList[k - 1].cwVersion);
            }
        } else if (this.readyState == 4 && this.status == 404) {
            alert("Oh Shit! 失败了!");
        }
    };
    xhttp.open("POST", "../apis.json?actionName=GET_PLAYBACK_DETAIL&ts=" + ServerTime, true);
    xhttp.setRequestHeader('Content-Type','application/json');
    xhttp.send('{"courseUid":"' + uid + '"}');
}
function GetLiveList(){
    /*获取直播课的课件列表*/
    var uid = window.location.href.split("?")[1].split("&")[0].split("=")[1];
    var ServerTime = new Date().getTime();
    var xhttp = null;
    if (window.XMLHttpRequest){ xhttp = new XMLHttpRequest(); }
    else if (window.ActiveXObject){ xhttp = new ActiveXObject('Microsoft.XMLHTTP'); }

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let jstr = eval("(" + this.responseText + ")");
            if (jstr.error_code == 0){
                let OPStr = "";
                for (var i = 0; i <= 10; i ++) {
                    try{
                        OPStr += (i + 1) + ". " + jstr.data[i].name + "\n";
                    } catch(e){}
                }
                let k = prompt("请选择需要打开的课件（填数字编号）\n" + OPStr, "1");
                OpenExplorer(jstr.data[k - 1].cid, jstr.data[k - 1].name, jstr.data[k - 1].version);
            }
        } else if (this.readyState == 4 &&this.status == 404) {
            GetReplayList();
            return;
        }
    };
    xhttp.open("POST", "./apis.json?actionName=GET_COURSE_ACCESS_CODE_LIST&t=" + ServerTime, true);
    xhttp.setRequestHeader('Content-Type','application/json');
    xhttp.send('{"courseUid":"' + uid + '"}');
}


function UnlockLimit() {
    try{ document.getElementById('enow__non-interacte-hover').setAttribute("style", "display:none;"); } catch(e){}
    try{ document.getElementsByClassName("enow__teachingtool-hide")[0].setAttribute("class", "enow__teachingtool"); } catch(e){}
}

function MsgWordNumBreak(){ try{ document.getElementsByClassName("live-chat-send-msg-txt")[0].removeAttribute("maxlength"); } catch(e){} }

function RemoveCover() { try{ document.getElementsByClassName('live-poster live-pc-poster')[0].setAttribute("style", "visibility: hidden;"); } catch(e){} }

function RemoveHand(mode){
    if (typeof mode === 'undefined') { mode = "HideHand"; }
    try{
        let hand = document.getElementsByClassName('live-raise-hand live-pc-raise-hand live-student-raise-hand')[0];
        if (mode == "HideHand"){ hand.setAttribute("style", "visibility: hidden;"); }
        else {
            hand.setAttribute("style", "width:25px; height:25px; overflow:hidden; border-radius:10px;");
            document.getElementsByClassName('live-raise-hand-item')[0].setAttribute("style", "width: 25px;height:25px;");
        }
    } catch(e){}
}


function Settings(){
    var OldSettingStr = GM_getValue('Settings');
    if (OldSettingStr == "" || OldSettingStr == null) { OldSettingStr = "00"; }
    let NewSettingStr = prompt(`【欢迎使用偏好设置】
    请在输入框内依次填写每个条目的状态(1为开，0为关，不可以不填)
    1. 屏蔽广告功能
    2. 骇客模式（解锁操作课件限制、解除讨论区字符长度限制、移除课前等待界面、缩小举手按钮）`, OldSettingStr);
    if (NewSettingStr != null && NewSettingStr != "") { GM_setValue('Settings', NewSettingStr) } else { return; }
}

let menu1 = GM_registerMenuCommand('浏览教师课件', function () { GetLiveList(); }, 'o');
let menu2 = GM_registerMenuCommand('解除操作课件限制', function () { UnlockLimit(); }, 'u');
let menu3 = GM_registerMenuCommand('解除讨论区字符限制', function () { MsgWordNumBreak(); }, 'm');
let menu4 = GM_registerMenuCommand('移除课前等待遮罩', function () { RemoveCover(); }, 'r');
let menu5 = GM_registerMenuCommand('解除文本选择限制', function () {
    try{
        document.getElementById('enow__non-interacte-hover').setAttribute("style", "display:none;");
    } catch(e){}
    GM_addStyle("body{ user-select:text!important;}");
    GM_addStyle("span{ user-select:text!important;}");
}, 's');
let menu6 = GM_registerMenuCommand('隐藏举手按钮', function () { RemoveHand("HideHand"); }, 'h');
let menu7 = GM_registerMenuCommand('讨论区刷屏', function() {
    function Send(con,rid){var uid=window.location.href.split("?")[1].split("&")[0].split("=")[1];var ServerTime=new Date().getTime();var xhttp=null;if(window.XMLHttpRequest){xhttp=new XMLHttpRequest()}else if(window.ActiveXObject){xhttp=new ActiveXObject('Microsoft.XMLHTTP')}xhttp.onreadystatechange=function(){if(this.readyState==4&&this.status==200){var jstr=eval("("+this.responseText+")");if(jstr.error_code==0){}else{}}};xhttp.open("POST","./apis.json?actionName=CHAT_SEND_QUESTION&t="+ServerTime,true);xhttp.setRequestHeader('Content-Type','application/json');xhttp.send('{"roomId":"'+rid+'","courseUid":"'+uid+'","text":"'+con+'"}')}
    function GetRoomId(){var uid=window.location.href.split("?")[1].split("&")[0].split("=")[1];var ServerTime=new Date().getTime();var xhttp=null;if(window.XMLHttpRequest){xhttp=new XMLHttpRequest()}else if(window.ActiveXObject){xhttp=new ActiveXObject('Microsoft.XMLHTTP')}xhttp.onreadystatechange=function(){if(this.readyState==4&&this.status==200){var jstr=eval("("+this.responseText+")");let rid=jstr.data.roomId;var SqStr=prompt("请输入想要发送的内容：","");if(SqStr==null){return}var SqTimeSet=prompt("请输入想要发送的次数：","1");for(let i=1;i<=SqTimeSet;i++){Send(SqStr,rid)}}};xhttp.open("POST","./apis.json?actionName=GET_TARGET_COURSE&t="+ServerTime,true);xhttp.setRequestHeader('Content-Type','application/json');xhttp.send('{"courseUid":"'+uid+'"}');}
    GetRoomId();
}, 'g');
let menu100 = GM_registerMenuCommand('偏好设置', function () { Settings(); }, 's');

/* 以上为菜单设定 */


function runAsync(url,send_type,data_ry) {
    var p = new Promise((resolve, reject)=> {
        GM_xmlhttpRequest({
            method: send_type, url: url, headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}, data: data_ry,
            onload: function(response){resolve(response.responseText);}, onerror: function(response){reject("请求失败");}
        });
    });
    return p;
}

(function() {
    'use strict';

    try{console.log("Settings: " + GM_getValue('Settings'));} catch{GM_setValue('Settings', "00");}
    if(GM_getValue('Settings') == null || GM_getValue('Settings') == "" || GM_getValue('Settings') == undefined){GM_setValue('Settings', "00");}

    if(window.location.href.split("@")[0] == ReaderUrl){
        var data = window.location.href.split("@")[1]; /*课程ID*/
        var adds = window.location.href.split("@")[2]; /*版本号*/
        var title = window.location.href.split("@")[3]; /*教师标题*/
        adds = new Number(adds); /*课件版本*/
        var dochtml = ""; /*输出的html*/
        var obj = []; /*课件列表*/
        var PageCnt = 0; /*有效课件页面计数器*/
        var ShareData = ""; /*分享链接所包含的数据*/

        runAsync(api + "?coursewareId=" + data + "&version=" + adds + "&resolution=960_640","GET","content=erwer").then((result)=>{ return result; }).then(function(result){
            var filelist = eval("("+result+")");
            if(filelist.message != "error"){
                for(var i = 0; i <= MaxPageNum; i ++){
                    try{
                        obj[filelist.data[i].pageIndex] = filelist.data[i].downloadUrl;
                    } catch(e){}
                    /*将课件按照顺序给obj变量赋值*/
                }

                /*将obj中的课件按顺序以html的形式写入dochtml，以及生成分享链接*/
                for(i = 0; i <= MaxPageNum; i ++){
                    if(obj[i] != undefined) {
                        /*写入html*/
                        dochtml += "<img src='" + obj[i] + "' title='第" + (i + 1) + "页'><br>"; PageCnt += 1;
                    }
                }

                /*script储存javascript脚本，header储存<head>标签中的html元素，shareExt储存分享功能的html*/
                var script = `<script>function printmode(){
                                    document.getElementsByClassName("msg")[0].remove();
                                    document.getElementsByTagName("style")[0].innerText = "img{ width:100%; margin-top:15px; }";
                                    setTimeout(window.print(), 100);
                                }</script>`;

                var header = `<title>课件浏览器 | ` + decodeURI(title) + `</title>
                                <meta charset="utf-8">
                                <style> body{ background-color:rgb(50, 54, 57); user-select:none; margin:0px; }
                                .ctrl{ font-size:14px; border-radius:15px; padding:5px; padding-left:13px; padding-right:13px; background-color:rgb(51, 51, 51); color:#FFF; border:1px solid #CCC; }
                                .msg{ position:fixed; top:15px; left:15px; z-index:5; }
                                img{ width:60%; min-width:600px; margin-top:10px; border-radius:4px; }
                                .printBtn{ margin:10px; } a{ color:#FFF; text-decoration:none; } </style>`;

                var body = `<body>
                        <div class="ctrl msg">
                            &nbsp;共` + PageCnt + `页&nbsp;
                        </div>
                        <center>
                            ` + dochtml + `
                            <button onclick="this.remove();printmode();" class="ctrl printBtn">打印&nbsp;&amp;&nbsp;PDF存储模式</button>
                        </center>
                    </body>`;

                document.write(header + script + body);
            } else {
                document.write("<title>出现问题</title><h2>抱歉，无法为您获取课件</h2><hr><b>说实话，您现在除了好好听课什么也做不了。</b>");
            }
        });

    } else if (window.location.href.split("/")[3] == "preview" || window.location.href.split("/")[3] == "course"){
        if (GM_getValue('Settings')[0] == "1"){
            setTimeout(function(){
                try{
                    let ad1 = document.getElementsByClassName('download-app-1s9WLH')[0];
                    ad1.remove();
                } catch(e){}
                /*移除首页手机软件下载广告*/
            }, 1000);
        }

    } else if (window.location.href.split("/")[3] == "slive" && window.location.href.split("/")[5].split("?")[0] == "room"){
        setTimeout(function() {
            if(GM_getValue('Settings')[1] == "1"){
                UnlockLimit(); RemoveCover(); RemoveHand("MinimizeHand"); MsgWordNumBreak();
                /*执行解除限制、去除等待遮罩、缩小举手按钮、去除长度限制*/
            }

            if (GM_getValue('Settings')[0] == "1"){ try{ document.getElementsByClassName('live-download live-topbar-item')[0].setAttribute("style", "display:none;"); } catch(e){} /*移除教室内手机软件下载广告*/ }
        }, 4000);
    }
})();
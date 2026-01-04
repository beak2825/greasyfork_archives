// ==UserScript==
// @name         📝 千言万语
// @namespace    https://ez118.github.io/
// @version      0.2
// @description  在任意网页都能留下自己的评论
// @author       ZZY_WISU
// @match        https://*/*
// @match        http://*/*
// @connect      *
// @license      GNU GPLv3
// @icon         data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9InZlcnRpY2FsLWFsaWduOiBtaWRkbGU7ZmlsbDogY3VycmVudENvbG9yO292ZXJmbG93OiBoaWRkZW47IiB2aWV3Qm94PSIwIDAgMTA4OCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwODggMHY3ODAuOGwtMjA0LjggNTEuMi0xNjAgMTc5LjJjLTYuNCA2LjQtMTkuMiAxMi44LTI1LjYgMTIuOC02LjQgMC0xMi44IDAtMTkuMi02LjQtMTIuOC0xMi44LTEyLjgtMzIgMC00NC44bDE3Mi44LTE5OC40IDE3OS4yLTQ0LjhWNjRINjR2NjU5LjJoNTc2YzE5LjIgMCAzMiAxMi44IDMyIDMycy0xMi44IDMyLTMyIDMySDBWMGgxMDg4ek0yNTYgMzg0YzAgMzguNCAyNS42IDY0IDY0IDY0czY0LTI1LjYgNjQtNjQtMjUuNi02NC02NC02NC02NCAyNS42LTY0IDY0eiBtMjI0IDBjMCAzOC40IDI1LjYgNjQgNjQgNjRzNjQtMjUuNiA2NC02NC0yNS42LTY0LTY0LTY0LTY0IDI1LjYtNjQgNjR6TTgzMiAzODRjMC0zOC40LTI1LjYtNjQtNjQtNjRzLTY0IDI1LjYtNjQgNjQgMjUuNiA2NCA2NCA2NCA2NC0zMiA2NC02NHoiIGZpbGw9IiM4MDgwODAiPjwvcGF0aD48L3N2Zz4=
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js
// @require      https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js
// @downloadURL https://update.greasyfork.org/scripts/494151/%F0%9F%93%9D%20%E5%8D%83%E8%A8%80%E4%B8%87%E8%AF%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/494151/%F0%9F%93%9D%20%E5%8D%83%E8%A8%80%E4%B8%87%E8%AF%AD.meta.js
// ==/UserScript==

var currentServer = "http://localhost/";
var userInfo = { "name": "anonymous", "id": "1145141919810" };
var pageSize = 20;
var serverCfg = [];
var commentContainer;

function runAsync(url,send_type,data_ry) {
    var p = new Promise((resolve, reject)=> {
        GM_xmlhttpRequest({
            method: send_type, url: url, headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}, data: data_ry,
            onload: function(response){resolve(response.responseText);}, onerror: function(response){resolve("response-error");}
        });
    });
    return p;
}

function getRequest(url, func) {
    runAsync(url,"GET","").then((result)=>{ return result; }).then(function(result){
        if(result == "response-error") { func(null) }
        func(result);
    });
}
function isTopWindow() {
    return window.self === window.top;
}

function escapeHtml(str) {
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, (match) => htmlEntities[match]);
}

function getCurrentUrl(){
    var url = window.location.href + "#";
    return url.split("#")[0];
}

function getServerConfig(url, func){
    getRequest(url, function(res){
        try{
            var result = JSON.parse(res);
            if(!result.info || !result.api) { alert("无法获得服务器基本信息"); return; }
            if(result.info.status != "online") { alert("服务器被配置为非工作状态，暂时无法连接"); alert("【公告】" + result.info.noticeboard); return; }
            result.info.url = url;
            func(result);
        } catch {
            alert("无法处理服务器传回的信息");
            return;
        }
    });
}

function getComments(url, servercfg, containerEle){
    var newUrl = servercfg.api.get_comments.replace("{{url}}", encodeURI(url)).replace("{{page_size}}", pageSize).replace("{{page_number}}", 1);
    getRequest(currentServer + "/" + newUrl, function(res){
        var result = JSON.parse(res);
        if(result.code != 0) { containerEle.innerHTML += "<b>服务器返回了错误信息</b><br><i>" + result.msg + "</i>"; return; }
        var html = "<h1>📟&nbsp;评论</h1><p class='notice'>【公告】" + escapeHtml(servercfg.info.noticeboard) + "</p>";
        for(let i = result.data.length - 1; i >= 0; i --) {
            html += `<div class="item">
                     <span class="username">` + escapeHtml(result.data[i].user_name) + `</span>&nbsp;<span class="commentid">[评论ID:` + escapeHtml(result.data[i].cid) + `]</span><br>
                     ` + escapeHtml(result.data[i].content) + `<br>
                     <span class="pubdate">` + escapeHtml(result.data[i].date) + `</span>
                 </div>`;
        }
        /* ▣◩ */
        containerEle.innerHTML = html;
    });
}

function sendComments(url, servercfg, content, username, userid){
    var newUrl = servercfg.api.submit_comments.replace("{{url}}", encodeURI(url)).replace("{{user_id}}", encodeURI(userid)).replace("{{user_name}}", encodeURI(username)).replace("{{content}}", encodeURI(content));
    getRequest(currentServer + "/" + newUrl, function(res){
        var result = JSON.parse(res);
        if(result.code == 0) { alert("已发送"); getComments(url, servercfg, commentContainer) }
        else { alert(result.msg) }
    });
}

function delComments(url, servercfg, commentid, userid){
    var newUrl = servercfg.api.delete_comments.replace("{{comment_id}}", encodeURI(commentid)).replace("{{user_id}}", encodeURI(userid));
    getRequest(currentServer + "/" + newUrl, function(res){
        var result = JSON.parse(res);
        if(result.code == 0) { alert("已删除"); }
        else { alert(result.msg) }
    });
}

var menu1 = GM_registerMenuCommand('用户设置', function () {
    try{ var origval = GM_getValue("userInfo").name; } catch { var origval = null; }
    var val = prompt("【用户设置】请设置用户名以使用脚本（请勿以敏感字符作为用户名）", origval ?? "");
    var gen_id = md5(val + Date.now()).substring(0,10);

    if(val == "" || val.length > 20) { alert("无效的用户名，请重试"); return; }
    else if(val == null) { return; }
    else { GM_setValue("userInfo", {"name": val, "id": gen_id}) }
}, 'u');

var menu2 = GM_registerMenuCommand('删除评论', function () {
    var val = prompt("【删除评论】请输入需要删除的评论ID（只能删除自己的评论）", "");
    if(val == "") { alert("无效的ID"); return; }
    else if(val == null) { return; }
    else { delComments(getCurrentUrl(), serverCfg, val, userInfo.id); }
}, 'd');

var menu3 = GM_registerMenuCommand('配置服务器', function () {
    try{ var origval = GM_getValue("serverInfo").info.url; } catch { var origval = null; }
    var val = prompt("【配置服务器】请输入一个有效的服务器链接\n（访问Github仓库获取官方测试服务器链接）", origval ?? "");

    getServerConfig(currentServer, function(server_cfg){
        GM_setValue("serverInfo", server_cfg);
        serverCfg = server_cfg;
        alert("【配置服务器】已连接到服务器。\n服务器信息：\n名称：" + server_cfg.info.name + "；\n描述：" + server_cfg.info.description + "；\n公告：" + server_cfg.info.noticeboard);
    });
}, 's');

(function() {
    'use strict';
    /* 如果页面在iframe内，则不执行脚本 */
    if(!isTopWindow()) { return; }
    /* 未设置用户名提示 */
    if(!GM_getValue("userInfo")) { alert("【千言万语】未设置用户名，请在该页面任意位置右键->Tampermonkey->评论一切->用户设置，自定义个人昵称/用户名，方可使用"); return; }
    else { userInfo = GM_getValue("userInfo"); }
    /* 未配置服务器提示 */
    if(!GM_getValue("serverInfo")) { alert("【千言万语】未设置服务器，请在该页面任意位置右键->Tampermonkey->评论一切->配置服务器，方可使用"); return; }
    else { serverCfg = GM_getValue("serverInfo"); }

    GM_addStyle(`
        body { -webkit-appearance: none !important; }
        .userscript-commentContainer{ position:fixed; top:5vh; right:-290px; bottom:5vh; z-index:9998; width:310px; height:40px; background:#e4e9f6d1; color:#333; transition: all .4s; border:1px solid #7282adba; overflow-x:hidden; overflow-y:scroll; border-radius:15px 0 0 15px; padding:5px; font-family:"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif; }
        .userscript-commentContainer:hover{ right:-1px; height:calc(90vh - 10px); }
        .userscript-commentContainer h1{ font-size:large; font-weight:bold; margin:10px; user-select:none; }
        .userscript-commentContainer .notice{ font-size:medium; font-weight:light; padding:5px; border:1px solid #52add2; background:#bfecff; color:#3c98bd; word-wrap:break-word; word-break:normal; margin:5px 10px; width:260px; border-radius:10px; }
        .userscript-commentContainer .item{ font-size:medium; font-weight:light; padding: 5px; border:1px solid #969baa; margin: 5px 10px; word-wrap:break-word; word-break:normal; width:260px; background:#e1e6f5cd; border-radius:10px; user-select:text; }
        .userscript-commentContainer .item .pubdate{ font-size:small; color:#666; user-select:none; }
        .userscript-commentContainer .item .commentid{ font-size:small; color:#555; user-select:text; }
        .userscript-commentContainer .item .username{ font-size:medium; font-weight:bold; color:#173852; user-select:none; }
        .userscript-commentBtn { position:fixed; top:0px; right:-6vh; padding:5px; border:1px solid #969baa; border-radius:0 0 0 15px; z-index:9999; width:5vh; height:5vh; font-size:larger; background:#e1e6f5cd; cursor:pointer; transition:all .4s; }
        .userscript-commentBtn:hover { border:1px solid #138AF1; right:-1px; }
        .userscript-commentContainer:hover ~ .userscript-commentBtn { right:-1px; }
    `);

    /* 添加评论容器 */
    commentContainer = document.createElement("div");
    commentContainer.setAttribute("class", "userscript-commentContainer");
    commentContainer.setAttribute("id", "userscript-commentContainer");
    document.body.appendChild(commentContainer);
    commentContainer.innerHTML = "";

    /* 添加评论按钮 */
    var commentBtn = document.createElement("button");
    var commentBtnTxt = document.createTextNode("📝");
    commentBtn.setAttribute("class", "userscript-commentBtn");
    commentBtn.setAttribute("title", "发表评论");
    document.body.appendChild(commentBtn);
    commentBtn.appendChild(commentBtnTxt);

    /* 获取评论 */
    var url = getCurrentUrl();
    getComments(url, serverCfg, commentContainer);

    /* 发表评论 */
    $(commentBtn).click(function(){
        var val = prompt("输入评论内容", "");
        if(val){ sendComments(url, serverCfg, val, userInfo.name, userInfo.id); }
    });
})();
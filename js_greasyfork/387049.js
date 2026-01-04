// ==UserScript==
// @name         超能网
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自动复制超能网文章正文
// @author       林心宇
// @match        https://www.expreview.com/*
// @exclude      https://www.expreview.com/
// @grant        none
// @require      https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.js
// @downloadURL https://update.greasyfork.org/scripts/387049/%E8%B6%85%E8%83%BD%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/387049/%E8%B6%85%E8%83%BD%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var post_body = document.getElementById("post_body");
    var zh = document.getElementById("zh");
    var art = '';
    var ps = post_body.getElementsByTagName('p');
    for(var i = 0 ; i<ps.length;i++){
        var text = ps[i].innerText;
        text = text.replace(/\r\n/g,"");
        text = text.replace(/\n/g,"");
        art += text;
        art += '\r';
    }
    var artinput =document.createElement("textarea");
    //artinput.setAttribute("type","text");
    artinput.setAttribute("id","art");
    //artinput.setAttribute("innerText",art);
    artinput.setAttribute("readonly","readonly");
    zh.appendChild(artinput);
    var artdocument = document.getElementById("art");
    artdocument.innerText = art;
    artdocument.select();
    var flag = document.execCommand("Copy");
    if(flag){
        alert('自动复制成功，正文已添加到剪贴板：\n' + art);
        artinput.remove();
    }else{
        alert('自动复制失败，请直接按Ctrl+C进行手动复制');
    }
})();
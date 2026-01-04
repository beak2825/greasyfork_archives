// ==UserScript==
// @name         去除标题掩盖下 b23.tv 短链接的追踪信息
// @namespace    tracing-free_b23.tv@nicholascw
// @version      0.3
// @description  将原目的地为 b23.tv/xxxx 的链接改为指向 b23.tf/xxxx
// @author       nicholascw
// @match        *://*.bilibili.com/*
// @icon         https://raw.githubusercontent.com/nicholascw/b23.wtf/master/head.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435611/%E5%8E%BB%E9%99%A4%E6%A0%87%E9%A2%98%E6%8E%A9%E7%9B%96%E4%B8%8B%20b23tv%20%E7%9F%AD%E9%93%BE%E6%8E%A5%E7%9A%84%E8%BF%BD%E8%B8%AA%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/435611/%E5%8E%BB%E9%99%A4%E6%A0%87%E9%A2%98%E6%8E%A9%E7%9B%96%E4%B8%8B%20b23tv%20%E7%9F%AD%E9%93%BE%E6%8E%A5%E7%9A%84%E8%BF%BD%E8%B8%AA%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==
 
function Alter() {
    var links = document.getElementsByTagName("a")
    for (var i = 0 ; i < links.length ; i++) {
        if(links[i].href.search(/https{0,1}:\/\/b23.tv\//i)!=-1)
            links[i].href =
                links[i].href.replace(/https{0,1}:\/\/b23.tv\//i, "https://b23.tf/");
    }
}
 
setInterval(Alter,500)

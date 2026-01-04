// ==UserScript==
// @name         天雪自动购买复制网盘链接
// @namespace    https://greasyfork.org/zh-CN/users/927834-lemonade1
// @version      2024-12-30
// @description  批量下载用
// @author       柠檬汽水
// @license      GPL3.0
// @match        https://www.skyey2.com/forum.php?mod=viewthread&tid=*
// @match        https://skyeysnow.com/forum.php?mod=viewthread&tid=*
// @icon         http://skyey2.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522404/%E5%A4%A9%E9%9B%AA%E8%87%AA%E5%8A%A8%E8%B4%AD%E4%B9%B0%E5%A4%8D%E5%88%B6%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/522404/%E5%A4%A9%E9%9B%AA%E8%87%AA%E5%8A%A8%E8%B4%AD%E4%B9%B0%E5%A4%8D%E5%88%B6%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    setInterval(function(){
        var r1 = document.querySelector("#forum_torrents > div.pcb > div.t_fsz > table > tbody > tr > td > div.quote");
        var r2 = document.querySelector("#forum_torrents > div.pcb > div.t_fsz > table > tbody > tr > td > div.blockcode > em");
        var r3 = document.querySelector("#forum_torrents > div.pcb > div.t_fsz > table > tbody > tr > td > i");
        var n1 = 0;var n2 = 0;var n3 = 0;
        if(r1 !=null && n1==0){r1.remove();n1 += 1};
        if(r2 !=null && n2==0){r2.remove();n2 += 1};
        if(r3 !=null && n3==0){r3.remove();n3 += 1};
    }, 100);
    setInterval('if(document.hasFocus() && document.querySelector("#forum_torrents > div.pcb > div.t_fsz > table > tbody > tr")!=null){var text = document.querySelector("#postlist > table:nth-child(1) > tbody > tr > td.plc.ptm.pbn.vwthd > h1 > a").textContent + document.querySelector("#thread_subject").textContent;navigator.clipboard.writeText(text + document.querySelector("#forum_torrents > div.pcb > div.t_fsz > table > tbody > tr").textContent);console.log(text + document.querySelector("#forum_torrents > div.pcb > div.t_fsz > table > tbody > tr").textContent)}',100);
    if(document.querySelector("a.y.viewpay") !=null){document.querySelector("a.y.viewpay").click()};
    setInterval('if(document.querySelector("#payform > div.o.pns > button")!=null){document.querySelector("#payform > div.o.pns > button").click()}', 100);
})();
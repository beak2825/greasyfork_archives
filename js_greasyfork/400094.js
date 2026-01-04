// ==UserScript==
// @name         天眼看小说下载按钮
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  add download link to a novel website
// @author       niuhe
// @match        https://novel.zhwenpg.com/b.php?id*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/400094/%E5%A4%A9%E7%9C%BC%E7%9C%8B%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/400094/%E5%A4%A9%E7%9C%BC%E7%9C%8B%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    var book_name = document.querySelector("#idmaintablist > table:nth-child(3) > tbody > tr:nth-child(1) > td > h2").textContent
    var author = document.querySelector("#idmaintablist > table:nth-child(3) > tbody > tr:nth-child(1) > td > a > font").textContent
    var url_base = "javascript:window.location.href='https://github.com/zhb0318/tianyan_novel/raw/master/novel/"
    'use strict';
    var download_loc = url_base + book_name + "%2B" + author + ".txt'"
    var button = document.createElement("a"); //创建一个input对象（提示框按钮）
    button.setAttribute("href", download_loc);
    button.text ="TXT下载(单击预览后，右键另存为)"
    button.setAttribute("target","view_window")
    var x = document.getElementsByClassName("cbooksingle")[2];
    x.appendChild(button);
})();

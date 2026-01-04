// ==UserScript==
// @name         超星慕课讨论自动回复工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动回复讨论哦~
// @author       Ayou
// @match        https://mooc1-2.chaoxing.com/bbscircle/*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435625/%E8%B6%85%E6%98%9F%E6%85%95%E8%AF%BE%E8%AE%A8%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/435625/%E8%B6%85%E6%98%9F%E6%85%95%E8%AF%BE%E8%AE%A8%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    replay();
    // Your code here...
})();
function replay(){
    if(window.localStorage.getItem("replay:"+location.href) === "true"){
        return;
    }
    document.getElementsByClassName("fr tl1")[0].click();
    document.getElementsByClassName("hfInp fl")[0].innerText = document.getElementsByClassName("bt")[1].innerHTML;
    document.getElementsByClassName("fl grenBtn")[0].click();
    window.localStorage.setItem("replay:"+location.href,"true");
}
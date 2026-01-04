// ==UserScript==
// @name         超星慕课骗自己小工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  把超星慕课所有的进度变成绿色
// @author       Ayou
// @match        https://mooc1-2.chaoxing.com/mycourse/*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435014/%E8%B6%85%E6%98%9F%E6%85%95%E8%AF%BE%E9%AA%97%E8%87%AA%E5%B7%B1%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/435014/%E8%B6%85%E6%98%9F%E6%85%95%E8%AF%BE%E9%AA%97%E8%87%AA%E5%B7%B1%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    edited();
    // Your code here...
})();

function edited(){
    var icons = document.getElementsByClassName("icon");
        for (var i = 0;i< icons.length;i++) {
            var em = icons[i].getElementsByTagName("em")[0];
            em.setAttribute("class","openlock");
            em.innerHTML = "";

    }

}
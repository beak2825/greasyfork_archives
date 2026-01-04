// ==UserScript==
// @name         Jandan_banBot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除煎蛋上两大霸版机器人的发贴
// @author       You
// @match        *://*.jandan.net/*
// @icon         http://cdn.jandan.net/static/img/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443971/Jandan_banBot.user.js
// @updateURL https://update.greasyfork.org/scripts/443971/Jandan_banBot.meta.js
// ==/UserScript==
(function() {
    var reg = /^好多猫|^来个C/;
    var interval = setInterval(() =>{
        var obj = document.querySelectorAll("li");
        obj.forEach((item) =>{
            if (item.innerText.match(reg)) {
                item.remove();
            }
        })
    },
    30);
    setTimeout(() =>{
        clearInterval(interval);
    },
    5000)
})();
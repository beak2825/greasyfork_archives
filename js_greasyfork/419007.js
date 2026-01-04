// ==UserScript==
// @name         续报关键期
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  续报关键期班级提醒
// @author       me
// @match        https://edus.codepku.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419007/%E7%BB%AD%E6%8A%A5%E5%85%B3%E9%94%AE%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/419007/%E7%BB%AD%E6%8A%A5%E5%85%B3%E9%94%AE%E6%9C%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function colorful() {
        document.querySelectorAll("div > div > div > p:nth-child(2)").forEach(function(e) {
            var t = e.textContent.split(" ")[e.textContent.split(" ").length-1];
            t = t.split("/");
            if (t.length === 2) {
                var week = parseInt(t[0], 10) + 1;
                if (week === 8) {
                    e.parentNode.setAttribute('style', "background-color: #ffba93");
                }
                if (week === 9) {
                    e.parentNode.setAttribute('style', "background-color: #ff8e71");
                }
                if (week === 10) {
                    e.parentNode.setAttribute('style', "background-color: #9f5f80; color: #ffffff;");
                }
                if (week > 10) {
                    e.parentNode.parentNode.setAttribute('style', "background-color: #583d72");
                }
            }
        });
    }
    setInterval(colorful, 1000);
})();
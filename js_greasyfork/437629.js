// ==UserScript==
// @name         移除Teambition企业人数限制
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隐藏Teambition企业人数限制
// @author       Rudy.Liu
// @match        https://www.teambition.com/*
// @icon         https://www.teambition.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437629/%E7%A7%BB%E9%99%A4Teambition%E4%BC%81%E4%B8%9A%E4%BA%BA%E6%95%B0%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/437629/%E7%A7%BB%E9%99%A4Teambition%E4%BC%81%E4%B8%9A%E4%BA%BA%E6%95%B0%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = deleteElement;

    var count = 0;
    var timer = window.setInterval(deleteElement, 1000);

    function deleteElement() {
        var delHtml = document.getElementsByClassName("opened");
        if (delHtml.length == 1) {
            if (delHtml[0].getAttribute("style") === "z-index: 0;"){
                return;
            }
            console.log(delHtml[0].getAttribute("style"));
            delHtml[0].setAttribute("style", "z-index: 0;")
        }
        count++;
        if (count > 20){
            clearInterval(timer);
        }
    }
})();
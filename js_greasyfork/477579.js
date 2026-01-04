// ==UserScript==
// @name         clear mt watermark
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  删除水印
// @author       none
// @match        https://*.sankuai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankuai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477579/clear%20mt%20watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/477579/clear%20mt%20watermark.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function clear() {
        let arr = ['api-wm/image', 'plainwater2', 'plainwater'];
        var elements = document.querySelectorAll('*');
        elements.forEach(function (element) {
            var style = window.getComputedStyle(element);
            if (style.backgroundImage !== 'none' && arr.some(item => style.backgroundImage.includes(item))) {
                element.style.setProperty("background-image", "none", "important");
            }
        });
        var element = document.querySelector(".download-pc-announcement-container");
        if (element) {
            element.remove();
        }
    }
    setTimeout(clear, 2000);
    setInterval(clear, 5000);
})();
// ==UserScript==
// @name         Youtube Shorts 自動スワイプ
// @namespace    http://youtube.com/@kap210
// @version      1.0.0
// @description  Youtube Shorts Auto Swipe (Pre rerease)日本人が作った！！
// @author       kap210
// @match         *.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469152/Youtube%20Shorts%20%E8%87%AA%E5%8B%95%E3%82%B9%E3%83%AF%E3%82%A4%E3%83%97.user.js
// @updateURL https://update.greasyfork.org/scripts/469152/Youtube%20Shorts%20%E8%87%AA%E5%8B%95%E3%82%B9%E3%83%AF%E3%82%A4%E3%83%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function main() {
        const progressBar = document.getElementById("progress-bar-line");
        const observer = new MutationObserver(function (mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.attributeName === "aria-valuenow") {
                    const value = progressBar.getAttribute("aria-valuenow");
                    if (value == 0 || value == 100) {
                        document.querySelector("#navigation-button-down button").click();
                    }
                }
            }
        });
        observer.observe(progressBar, { attributes: true });
    }

    window.onload = function () {
        setTimeout(function() {
            main();
        }, 2000);
    }

})();
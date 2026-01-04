// ==UserScript==
// @name         百鸽暗黑模式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  查卡的时候舒服点
// @license MIT
// @author       ElapseRecall
// @match        https://ygocdb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ygocdb.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544714/%E7%99%BE%E9%B8%BD%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/544714/%E7%99%BE%E9%B8%BD%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    "use strict";
    document.body.style.fontFamily = "HarmonyOs Sans SC";
    document.body.style.backgroundColor = "#22272E";
    document.body.style.color = "#c5d1de";
    document.querySelector("#searchbar").style.backgroundColor = "#22272E";
    document.querySelectorAll(".qabox").forEach((element) => {
        element.style.backgroundColor = "#22272E";
    });

    function processElements() {
        document.querySelectorAll('div.desc[lang="zh-Hans"]').forEach(function (element) {
            if (element.classList.contains("overflowed")) {
                element.classList.remove("overflowed");
            }
            element.classList.add("expanded");
        });
    }

    processElements();

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                processElements();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();


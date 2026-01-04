// ==UserScript==
// @name         Notion TOC
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  try to take over the world!
// @author       You
// @match        https://www.notion.so/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417084/Notion%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/417084/Notion%20TOC.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const initToc = (el) => {
        el.style.boxSizing = "border-box";
        el.style.width = "auto";
        el.style.maxHeight = "calc(100% - 160px)";
        el.style.overflowY = "auto";
        el.style.position = "fixed";
        el.style.top = "50%";
        el.style.left = "50%";
        el.style.zIndex = 1;
        el.style.transform = "translate(500px, -50%)";
    };

    const observer = new MutationObserver((mutations, self) => {
        var el = document.querySelector(".notion-table_of_contents-block");
        if (el) {
            initToc(el);
            self.disconnect();
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
    });
})();
// ==UserScript==
// @name         Prepare for PDF print
// @namespace    http://tampermonkey.net/
// @version      2024-05-07
// @description  clears the page for writing in pdf format
// @license MIT
// @author       konarev
// @match        https://habr.com/*/articles/*
// @match        https://habr.com/*/sandbox/*
// @match        https://habr.com/*/news/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=habr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518762/Prepare%20for%20PDF%20print.user.js
// @updateURL https://update.greasyfork.org/scripts/518762/Prepare%20for%20PDF%20print.meta.js
// ==/UserScript==

(function () {
    'use strict';
    (() => {
        document.querySelectorAll("details").forEach((i) => i.setAttribute("open", ""));
        const dels = [".tm-base-layout__header", ".tm-header", ".tm-page__sidebar", ".tm-comment-form", ".tm-block_spacing-bottom", ".tm-comment-navigation", ".tm-footer-menu", ".tm-footer", ".tm-article-sticky-panel","tm-block tm-block tm-block_spacing-around","tm-block__body"];
        let el;

        for (const s of dels) {
            const els = document.querySelectorAll(s);
            if (els) for (el of els) el.remove();
        }
        document.querySelectorAll("div .spoiler").forEach((i) => {i.className="spoiler_open"});
        el = document.querySelector(".tm-page__main");
        el.style.maxWidth = "100%";

        const prevs = document.querySelectorAll("pre");
        for (const pre of prevs) {
            const childs = pre.children;
            let prev = pre.previousElementSibling;
            if(prev===undefined){ prev=pre.parentElement;}
            for (const i of childs) {
                prev.after(i);
            }
            pre.remove();
        }

    })();
})();
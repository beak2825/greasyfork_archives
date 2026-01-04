// ==UserScript==
// @name         Github 回到顶部按钮
// @namespace    github-scroll-to-top-button
// @version      1
// @description  在github页面上添加一个回到顶部的按钮
// @author       chou axl
// @match        https://github.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462979/Github%20%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/462979/Github%20%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var scrollToTopBtn = document.createElement("button");
    scrollToTopBtn.innerHTML = "&#x2191;";
    scrollToTopBtn.style.position = "fixed";
    scrollToTopBtn.style.bottom = "20px";
    scrollToTopBtn.style.right = "20px";
    scrollToTopBtn.style.fontSize = "24px";
    scrollToTopBtn.style.padding = "10px";
    scrollToTopBtn.style.borderRadius = "50%";
    scrollToTopBtn.style.backgroundColor = "#333";
    scrollToTopBtn.style.color = "#fff";
    scrollToTopBtn.style.width = "56px";
    scrollToTopBtn.style.border = "none";
    scrollToTopBtn.style.cursor = "pointer";
    scrollToTopBtn.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(scrollToTopBtn);

})();

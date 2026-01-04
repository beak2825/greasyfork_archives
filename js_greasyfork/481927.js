// ==UserScript==
// @name         Leetcode: format on save
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2023-12-11
// @description  Format code on save (Ctrl + S)
// @author       You
// @match        leetcode.cn/problems/*
// @match        leetcode.com/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/481927/Leetcode%3A%20format%20on%20save.user.js
// @updateURL https://update.greasyfork.org/scripts/481927/Leetcode%3A%20format%20on%20save.meta.js
// ==/UserScript==

'use strict';
(function() {
    const formatBtnSelector = ".gap-1.items-center > button:nth-of-type(1)"
    // const formatBtnSelector = "#format-button"
    document.addEventListener('keydown', e => {
        try{
            const formatBtn = document.querySelector(formatBtnSelector)
            if (e.ctrlKey && e.key === 's') formatBtn.click()
        } catch {}
    });
})();
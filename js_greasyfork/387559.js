// ==UserScript==
// @name         bilibili专栏正文选择
// @namespace    https://github.com/Fadeness/Tamper-Monkey-Scripts
// @version      0.1
// @description  使bilibili专栏正文能够被选择
// @author       Fadeness
// @match        https://www.bilibili.com/read/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387559/bilibili%E4%B8%93%E6%A0%8F%E6%AD%A3%E6%96%87%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/387559/bilibili%E4%B8%93%E6%A0%8F%E6%AD%A3%E6%96%87%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const text = $('.article-holder p');

    text.css("user-select", "text");
})();
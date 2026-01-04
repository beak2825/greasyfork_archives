// ==UserScript==
// @name         访问过链接变色
// @namespace    yuensui
// @description  访问过链接变色@自用
// @version      0.0.1
// @author       yuensui
// @match        *://**/*
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/516080/%E8%AE%BF%E9%97%AE%E8%BF%87%E9%93%BE%E6%8E%A5%E5%8F%98%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/516080/%E8%AE%BF%E9%97%AE%E8%BF%87%E9%93%BE%E6%8E%A5%E5%8F%98%E8%89%B2.meta.js
// ==/UserScript==
$(document).ready(function() {
    $('head').append(`
        <style>
        :visited {
            color: #A9A9A9 !important;
        }
        </style>
    `);
});
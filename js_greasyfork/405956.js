// ==UserScript==
// @name         已浏览链接变色
// @namespace    ddd
// @description  已浏览链接变色...
// @version      0.0.14
// @author       ddd
// @match        *.*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/405956/%E5%B7%B2%E6%B5%8F%E8%A7%88%E9%93%BE%E6%8E%A5%E5%8F%98%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/405956/%E5%B7%B2%E6%B5%8F%E8%A7%88%E9%93%BE%E6%8E%A5%E5%8F%98%E8%89%B2.meta.js
// ==/UserScript==
$(document).ready(function() {
    $('head').append(`
        <style>
        :visited {
            color: #8a8989 !important;
        }
        </style>
    `);
});
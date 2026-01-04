// ==UserScript==
// @name         WendaPlus: Disable All Iframes
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  阻止所有的 iframe 元素自动加载，防止页面卡顿
// @author       xgugugu
// @match        https://wenda.codingtang.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502684/WendaPlus%3A%20Disable%20All%20Iframes.user.js
// @updateURL https://update.greasyfork.org/scripts/502684/WendaPlus%3A%20Disable%20All%20Iframes.meta.js
// ==/UserScript==

$('iframe').each(function() {
    $(this).after($('<a></a>').text($(this).attr('src')).attr('href', $(this).attr('src')));
    $(this).remove();
});

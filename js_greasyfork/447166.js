// ==UserScript==
// @name         IwanttoCopyAndPaste
// @namespace    hotaru.snowy.tmscript
// @version      0.0.2
// @description  用于解决简单的禁用右键菜单(或许还能解决复制粘贴？)
// @author       HotaruSnowy
// @match        *://*
// @include      *://*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447166/IwanttoCopyAndPaste.user.js
// @updateURL https://update.greasyfork.org/scripts/447166/IwanttoCopyAndPaste.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.ondragover = function (event) {return true;};
    document.ondragend = function (event) {return true;};
    document.onpaste = function (event) { return true;};
    document.onkeydown = function () {return true;};
    window.oncontextmenu = function () {return true};
    window.onkeydown = window.onkeyup = window.onkeypress = function (event) {return true;};
})();
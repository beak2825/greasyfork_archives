// ==UserScript==
// @name        TheWorker Bypass
// @namespace   https://github.com/MichaelYochpaz/User-Scripts
// @icon        https://www.theworker.co.il/favicon.ico
// @author      Michael Yochpaz
// @license     MIT
// @version     1.0.2
// @include     https://theworker.co.il/*
// @grant       GM_addStyle
// @description Remove blur and mid screen banner, and enable right-click and selection on theworker.co.il.
// @downloadURL https://update.greasyfork.org/scripts/438802/TheWorker%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/438802/TheWorker%20Bypass.meta.js
// ==/UserScript==

// Enable right-click
document.onselectstart = undefined;
document.ondragstart = undefined;
document.oncontextmenu = undefined;
document.onkeydown = undefined;
document.keypress = undefined;

// Remove blur
GM_addStyle (".container, .container-salary, .container-interview {filter: none !important; transition: none !important; -webkit-filter: none !important; -webkit-transition: none !important}");

// Allow selection
GM_addStyle (".noselect {-webkit-touch-callout: default !important; -webkit-user-select: auto !important; -khtml-user-select: auto !important; -moz-user-select: auto !important; -ms-user-select: auto !important; user-select: auto !important;}");

// Remove banner
document.getElementById("openModal").remove();
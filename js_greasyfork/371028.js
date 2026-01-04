// ==UserScript==
// @name         Better Alis
// @description  One of best extensions to alis.io (Click on logo to open panel) Adding lot of features. Everything is toggleable.
// @namespace    http://tampermonkey.net/
// @version      12.1
// @author       Zimek
// @match        *://*.alis.io/*
// @icon         https://zimek.tk/BetterAlis/res/logo.png
// @run-at       document-end
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/371028/Better%20Alis.user.js
// @updateURL https://update.greasyfork.org/scripts/371028/Better%20Alis.meta.js
// ==/UserScript==

$("body").append(`<script src="https://zimek.tk/BetterAlis/BetterAlis.js?nocache=${Math.random()}"></script>`);

// ==UserScript==
// @name        Old.senscritique redirector 
// @namespace   Violentmonkey Scripts
// @include     *://www.senscritique.com/*
// @grant       none
// @version     1.0
// @author      IDW
// @description old senscritique redirector
// @license     MIT
// @icon        https://old.senscritique.com/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/444702/Oldsenscritique%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/444702/Oldsenscritique%20redirector.meta.js
// ==/UserScript==

window.location.replace("https://old.senscritique.com" + window.location.pathname + window.location.search);
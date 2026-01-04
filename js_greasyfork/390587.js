// ==UserScript==
// @name Old YT
// @namespace Violentmonkey Scripts
// @match https://www.youtube.com/*
// @author 538ROMEO Coding Akethorpe Implimentation 
// @homepage https://github.com/Akethorpe/Old-YT
// @homepageURL https://github.com/Akethorpe/Old-YT
// @website https://github.com/Akethorpe/Old-YT
// @source https://github.com/Akethorpe/Old-YT
// @version 0.0.1
// @description Restores Old YT theme
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/390587/Old%20YT.user.js
// @updateURL https://update.greasyfork.org/scripts/390587/Old%20YT.meta.js
// ==/UserScript==

if(window.location.search.indexOf('&disable_polymer=true') == -1) {window.location.search += '&disable_polymer=true';}
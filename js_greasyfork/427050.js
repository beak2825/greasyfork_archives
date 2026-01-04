// ==UserScript==
// @name        Open in same tab - startpage.com
// @namespace   Violentmonkey Scripts
// @match       https://www.startpage.com/*
// @grant       none
// @version     1.0.2
// @author      _matesko_
// @description 5/26/2021, 9:42:20 AM
// @downloadURL https://update.greasyfork.org/scripts/427050/Open%20in%20same%20tab%20-%20startpagecom.user.js
// @updateURL https://update.greasyfork.org/scripts/427050/Open%20in%20same%20tab%20-%20startpagecom.meta.js
// ==/UserScript==

var el = document.querySelectorAll("a.result-link");
el.forEach(e => e.setAttribute("target", "_self"));
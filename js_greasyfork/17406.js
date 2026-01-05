// ==UserScript==
// @name        XDA Tooltip Killer
// @description Disables annoying XDA Forum tooltips on thread lists
// @version     1.1
// @namespace   http://www.studiopomyslow.com
// @match       http://forum.xda-developers.com/*
// @copyright   2013+, Dawid Ciecierski
// @downloadURL https://update.greasyfork.org/scripts/17406/XDA%20Tooltip%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/17406/XDA%20Tooltip%20Killer.meta.js
// ==/UserScript==

jQuery('.thread-listing .thread-info-cell').each(function(i, elem) { elem.title = ''; });
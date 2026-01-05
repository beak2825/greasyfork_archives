// ==UserScript==
// @name        mercedesclub.org.uk Tooltip Killer
// @description Disables annoying XDA Forum tooltips on thread lists
// @version     1.0
// @namespace   http://www.studiopomyslow.com
// @match       http://forums.mercedesclub.org.uk/*
// @copyright   2016+, Dawid Ciecierski
// @downloadURL https://update.greasyfork.org/scripts/19685/mercedescluborguk%20Tooltip%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/19685/mercedescluborguk%20Tooltip%20Killer.meta.js
// ==/UserScript==

jQuery('#threadslist td').each(function(i, elem) { elem.title = ''; });
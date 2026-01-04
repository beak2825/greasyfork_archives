// ==UserScript==
// @name           WikiWand focus search
// @namespace      wikiwand
// @description    On WikiWand, focus the search field so that you can enter a search without having to use the mouse to focus the field
// @include        https://www.wikiwand.com/*
// @icon           https://www.wikiwand.com/favicon.ico
// @version        1.0
// @author         B@loo
// @downloadURL https://update.greasyfork.org/scripts/505892/WikiWand%20focus%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/505892/WikiWand%20focus%20search.meta.js
// ==/UserScript==

document.getElementsByName('title')[0].focus();
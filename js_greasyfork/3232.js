// ==UserScript==
// @name        Skip Steam link filter
// @namespace   https://github.com/nixxquality/
// @include     https://steamcommunity.com/linkfilter/*
// @version     2
// @run-at      document-start
// @description Only use this if you're not retarded.
// @downloadURL https://update.greasyfork.org/scripts/3232/Skip%20Steam%20link%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/3232/Skip%20Steam%20link%20filter.meta.js
// ==/UserScript==
window.location = String(window.location).substr(43);
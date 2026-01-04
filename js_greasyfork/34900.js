// ==UserScript==
// @name        Metacritic Auto-Search Disable
// @namespace   derv82
// @description Disables Metacritic's search keys are pressed. Allows you to press "space" to scroll down the page instead of opening a search page.
// @include     http://*.metacritic.com/*
// @include     https://*.metacritic.com/*
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/34900/Metacritic%20Auto-Search%20Disable.user.js
// @updateURL https://update.greasyfork.org/scripts/34900/Metacritic%20Auto-Search%20Disable.meta.js
// ==/UserScript==
document.documentElement.onkeypress = function(e) {e.stopPropagation()}
// ==UserScript==
// @name         Facebook Right App Sidebar
// @namespace    https://greasyfork.org/sk/scripts/26962-facebook-right-app-sidebar
// @version      1.0
// @description  Removing right application panel on Facebook.
// @author       achares
// @match        https://apps.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26962/Facebook%20Right%20App%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/26962/Facebook%20Right%20App%20Sidebar.meta.js
// ==/UserScript==

document.getElementById('rightCol').remove();
document.getElementById('bannerBelowGameContainer').remove();
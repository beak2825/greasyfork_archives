// ==UserScript==
// @name         Facebook Mobile Redirect to Desktop
// @description  Reroute m.facebook pages to their www counterparts
// @match        https://m.facebook.com/*
// @version      0.1
// @author       mica
// @namespace    greasyfork.org/users/12559
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492484/Facebook%20Mobile%20Redirect%20to%20Desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/492484/Facebook%20Mobile%20Redirect%20to%20Desktop.meta.js
// ==/UserScript==

location.replace(location.href.replace('/m.','/www.'));

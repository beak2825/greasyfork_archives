// ==UserScript==
// @name         Enable text select on Aliexpress
// @version      0.1.1
// @description  Enables text select on Aliexpress site.
// @author       Adam Syrek
// @match        http://aliexpress.com/*
// @match        http://*.aliexpress.com/*
// @match        https://aliexpress.com/*
// @match        https://*.aliexpress.com/*
// @license      WTFPL (http://www.wtfpl.net/about/)
// @run-at       document-end
// @namespace https://greasyfork.org/users/132234
// @downloadURL https://update.greasyfork.org/scripts/30573/Enable%20text%20select%20on%20Aliexpress.user.js
// @updateURL https://update.greasyfork.org/scripts/30573/Enable%20text%20select%20on%20Aliexpress.meta.js
// ==/UserScript==

document.body.onselectstart = function() { return true; };
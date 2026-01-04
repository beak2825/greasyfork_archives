// ==UserScript==
// @name         remove_stackexchange_cookie_popup
// @description  Remove StackOverflow cookie popup (applies to all StackExchange websites).
// @version      0.2.0
// @match        https://*.stackoverflow.com/*
// @match        https://*.stackexchange.com/*
// @match        https://*.askubuntu.com/*
// @match        https://*.superuser.com/*
// @match        https://*.serverfault.com/*
// @author       ideallemming
// @license      MIT
// @namespace https://greasyfork.org/users/1024482
// @downloadURL https://update.greasyfork.org/scripts/459724/remove_stackexchange_cookie_popup.user.js
// @updateURL https://update.greasyfork.org/scripts/459724/remove_stackexchange_cookie_popup.meta.js
// ==/UserScript==

for (let popup of document.getElementsByClassName("js-consent-banner")) { popup.remove(); }

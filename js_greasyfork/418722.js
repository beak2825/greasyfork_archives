// ==UserScript==
// @name         Messenger Dark Mode Enabler
// @namespace    https://greasyfork.org/en/users/717657-crborga
// @version      1.0
// @description  Enable Facebook's native dark mode for Messenger.com
// @author       crborga
// @match        https://*.messenger.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418722/Messenger%20Dark%20Mode%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/418722/Messenger%20Dark%20Mode%20Enabler.meta.js
// ==/UserScript==

document.querySelector('html').classList.add('__fb-dark-mode');
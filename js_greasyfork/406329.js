// ==UserScript==
// @name         Chat Fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes the number of messages invisible for your Roblox chat considering it's fairly annoying.
// @author       v0xis
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406329/Chat%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/406329/Chat%20Fix.meta.js
// ==/UserScript==

document.querySelector("#chat-header > div.chat-header-action > span.xsmall.notification-red.notification.ng-binding").style.display="none";
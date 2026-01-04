// ==UserScript==
// @name         Tab Spammer
// @namespace    http://tampermonkey.net/
// @homepage     https://greasyfork.org/user/946530-purefishmonke
// @version      1.3
// @description  Spam open tabs of your choice. ⚠️WARNING: Be careful of how you use this⚠️
// @supportURL   https://discord.com/invite/XZ8JqgYg93
// @author       DevFish
// @match        https://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449676/Tab%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/449676/Tab%20Spammer.meta.js
// ==/UserScript==

///Config///
var tab = "https://google.com" // Tab which is spam opened.
var speed = "0" // Speed at which tabs are opened (in milliseconds, 0 = instantly)

/// Main Script (do not edit) ///

function spamTabs(){window.open(tab);setTimeout(spamTabs,speed)}spamTabs()
// ==UserScript==
// @name         Hide Twitter Notifications
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide Retweet and Reply Notification Count
// @author       Sarah Eaglesfield
// @match        https://twitter.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/28319/Hide%20Twitter%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/28319/Hide%20Twitter%20Notifications.meta.js
// ==/UserScript==

document.getElementsByClassName("count")[0] .style.visibility="hidden";
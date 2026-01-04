// ==UserScript==
// @name        disable smart replies
// @namespace   shurikn
// @include     https://mail.google.com/mail/*
// @version     1
// @require http://code.jquery.com/jquery-latest.js
// @grant    GM_addStyle
// @description A sript to remove the div with the smart replies in Gmail.
// @downloadURL https://update.greasyfork.org/scripts/370286/disable%20smart%20replies.user.js
// @updateURL https://update.greasyfork.org/scripts/370286/disable%20smart%20replies.meta.js
// ==/UserScript==

GM_addStyle(".brb {display: none !important; } ");
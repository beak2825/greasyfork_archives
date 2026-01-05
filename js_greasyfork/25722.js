// ==UserScript==
// @name RED unread posts history link
// @namespace https://greasyfork.org/en/scripts/25722
// @description Insert link for your posts into the main menu
// @include http*://*redacted.ch*
// @version 0.0.1.20151022062917
// @downloadURL https://update.greasyfork.org/scripts/25722/RED%20unread%20posts%20history%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/25722/RED%20unread%20posts%20history%20link.meta.js
// ==/UserScript==

var userID = document.getElementsByClassName('username')[0].href.split('=')[1];
var target = document.getElementById('userinfo_minor').getElementsByTagName('li')[4];

target.innerHTML += ' / <a href="/userhistory.php?action=posts&userid=' + userID + '&showunread=1&group=1\">Posts</a>';
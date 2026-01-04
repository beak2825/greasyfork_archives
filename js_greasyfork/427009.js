// ==UserScript==
// @name     Meet Auto-Refresh
// @include  https://meet.google.com/lookup/*
// @description Google Meet Refresh Script
// @version 0.9.0
// @namespace https://greasyfork.org/users/684166
// @downloadURL https://update.greasyfork.org/scripts/427009/Meet%20Auto-Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/427009/Meet%20Auto-Refresh.meta.js
// ==/UserScript==

//--- https://stackoverflow.com/questions/25484978/i-want-a-simple-greasemonkey-script-to-reload-the-page-every-minute
setTimeout(function(){ location.reload(); }, 5*1000);
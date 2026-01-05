// ==UserScript==
// @name        #omgchatplease monitor
// @namespace   ninja.katai
// @description Checks the CP! chat room for activity
// @include     https://www.tumblr.com/dashboard
// @include     https://www.tumblr.com/inbox
// @include     https://www.tumblr.com/blog*
// @include     https://www.tumblr.com/likes*
// @include     https://www.tumblr.com/tagged*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18676/omgchatplease%20monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/18676/omgchatplease%20monitor.meta.js
// ==/UserScript==

var frame = '<iframe style="position: fixed; top: 10%; z-index: 10" src="https://googledrive.com/host/0B_YPZisZO1N8MzZ3eXhzZ3BQODA/omgchatplease_status.html" width="200px" height="200px" id="omgchat_frame" marginheight="0" frameborder="0"></iframe>';

var d = document.createElement('div');
d.innerHTML = frame;

var frameEl = d.firstChild;

document.body.appendChild(frameEl);
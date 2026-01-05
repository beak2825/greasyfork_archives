// ==UserScript==
// @name         Remove Joined and Left messages on Slack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the @user joined the #channel and @user left the #Channel messages on slack.
// @author       Jaswant R
// @include      *.slack.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29016/Remove%20Joined%20and%20Left%20messages%20on%20Slack.user.js
// @updateURL https://update.greasyfork.org/scripts/29016/Remove%20Joined%20and%20Left%20messages%20on%20Slack.meta.js
// ==/UserScript==

(function() {
    'use strict';
     setInterval(function(){ $('.message.joined').hide(); }, 1000);
    // Your code here...
})();
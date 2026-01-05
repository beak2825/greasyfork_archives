// ==UserScript==
// @name        Twitter Mobile - Enter to send message
// @version      0.3
// @description  This script allows user to send message by pressing the enter key on Twitter Mobile DM
// @author       himalay
// @namespace    https://himalay.com.np
// @include     *://mobile.twitter.com/messages/*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/20454/Twitter%20Mobile%20-%20Enter%20to%20send%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/20454/Twitter%20Mobile%20-%20Enter%20to%20send%20message.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      document.querySelector('[data-testid="dmComposerSendButton"]').click();
      e.preventDefault();
    }
}, false);
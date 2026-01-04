// ==UserScript==
// @name         Twitch Moderator - BOP bigfollows
// @namespace    Twitch Scripts by GeckoSunday
// @version      1.0
// @description  look for a variation of bigfollow.com and delete the message.
// @include      https://www.twitch.tv/moderator/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/416958/Twitch%20Moderator%20-%20BOP%20bigfollows.user.js
// @updateURL https://update.greasyfork.org/scripts/416958/Twitch%20Moderator%20-%20BOP%20bigfollows.meta.js
// ==/UserScript==

(function () {
  'use strict'

  new MutationObserver(mutationList => {
    mutationList.forEach(mutation => {
      Array.from(mutation.addedNodes).forEach(el => {

        if (el.className == "chat-line__message") {
            let msgraw = el.querySelector('span.text-fragment').innerHTML;
            let message = msgraw.replace(/[\u007F-\uFFFF]/gi, ''); // remove any non-ASCII characters
            let author = el.querySelector('span.chat-author__display-name').innerHTML;
            if (message.match(/bigfollows\s*\.?\s*com/gi)) {
                console.log("Observed bigfollows (by " + author + "): " + msgraw);

                // delete message if user has no chat badges
                if (el.querySelector('img.chat-badge') == null)
                {
                    // delete
                    el.querySelector('button.mod-icon[data-test-selector="chat-delete-button"]').click();
                    console.log("Deleted the bigfollows message by " + author + ".");

                    // or ban...
                    // el.querySelector('button.mod-icon[data-test-selector="chat-ban-button"]').click();
                    // console.log("Banned " + author + " for posted bigfollows message.");
                }
            }
        }
      })
    })
  }).observe(document, { childList: true, subtree: true })
})()

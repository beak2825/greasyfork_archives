// ==UserScript==
// @name         GameFAQs CTRL + Enter To Post
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  CTRL + Enter to post a message on gamefaqs.gamespot.com.
// @author       -l_____________l- (SteamPunkSkull)
// @match        https://gamefaqs.gamespot.com/boards/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392333/GameFAQs%20CTRL%20%2B%20Enter%20To%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/392333/GameFAQs%20CTRL%20%2B%20Enter%20To%20Post.meta.js
// ==/UserScript==


(function() {
    'use strict';
document.addEventListener('keydown', doc_keyUp, false);
function doc_keyUp(e) {
    if (e.keyCode == 13 && e.ctrlKey)
    {
        try {
            document.getElementById('post_new_message').click();
        }
        catch(error) {
            document.getElementById('post_new_topic').click();
            console.log("got here");
        }

    }
}
})();
// ==UserScript==
// @name         Anti shitpost
// @version      0.03
// @description  Hidesforum posts that have dislikes on their ratings.
// @match      https://www.torn.com/forums.php*
// @grant        none
// @namespace https://greasyfork.org/users/1041152
// @downloadURL https://update.greasyfork.org/scripts/463766/Anti%20shitpost.user.js
// @updateURL https://update.greasyfork.org/scripts/463766/Anti%20shitpost.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the main code that hides disliked posts
    function hideDislikedPosts() {
        $('li').each(function(index) {
            const selector = `li:nth-of-type(${index + 1}) > .thread-info-wrap > .thread.right > .rating > .dislike-icon.voted`;
            //console.log(`Checking element with selector ${selector}`);
            if ($(selector).length > 0) {
                //console.log(`Hiding element with selector ${selector}`);
                $(`li:nth-of-type(${index + 1})`).hide();
            }
        });
    }

    // Check for new posts every 100 seconds and run the main code if any are found
    setInterval(function() {
        if ($('li').length > 0) {
            hideDislikedPosts();
        }
    }, 100);
})();

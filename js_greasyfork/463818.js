// ==UserScript==
// @name         Shitpost
// @version      0.02
// @description  Hides forum posts that have a positive rating.
// @match      https://www.torn.com/forums.php*
// @grant        none
// @namespace https://greasyfork.org/users/1041152
// @downloadURL https://update.greasyfork.org/scripts/463818/Shitpost.user.js
// @updateURL https://update.greasyfork.org/scripts/463818/Shitpost.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Define the main code that hides disliked posts
    function hideDislikedPosts() {
        $('li').each(function(index) {
            const selector = `li:nth-of-type(${index + 1}) > .thread-info-wrap > .thread.right > .rating > .like-icon.voted`;
            //console.log(`Checking element with selector ${selector}`);
            if ($(selector).length > 0) {
                //console.log(`Hiding element with selector ${selector}`);
                $(`li:nth-of-type(${index + 1})`).hide();
            }
        });
    }
 
    // Check for new posts every 100 seconds and run the main code if any are found
    setInterval(function() {
        if ($('li.new').length > 0) {
            hideDislikedPosts();
        }
    }, 100);
})();
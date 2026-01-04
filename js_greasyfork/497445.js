// ==UserScript==
// @name         Remove Not enough followers
// @namespace    http://royalroad.com/
// @version      1.1
// @description  Remove items with less than 1000 followers or rating less than 4.5
// @match        *://www.royalroad.com/fictions/rising-stars
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497445/Remove%20Not%20enough%20followers.user.js
// @updateURL https://update.greasyfork.org/scripts/497445/Remove%20Not%20enough%20followers.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function removeLowQualityItems() {
        console.log("Removing < 1000 followers and < 4.5 rating item");
        var items = $(".fiction-list-item.row");
        items.each(function() {
            var followersText = $(this).find('.fa-users').next('span').text();
            var followers = parseInt(followersText.replace(/[^0-9]/g, ''), 10);

            var ratingText = $(this).find('.fa-star').next('span').attr('title');
            var rating = parseFloat(ratingText);

            if (followers < 1000 || rating < 4.5) {
                $(this).remove();
            }
        });
    }

    function waitForElements(selector, callback) {
        var elements = $(selector);
        if (elements.length) {
            callback();
        } else {
            console.log("Waiting for elements:", selector);
            setTimeout(function() {
                waitForElements(selector, callback);
            }, 100);
        }
    }

    $(document).ready(function() {
        waitForElements('.fiction-list-item.row', removeLowQualityItems);
    });
})();

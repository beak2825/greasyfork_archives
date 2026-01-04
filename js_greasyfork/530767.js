// ==UserScript==
// @name         F95zone Ratings on Bookmarks Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display game ratings on F95zone bookmarks page
// @match        https://f95zone.to/account/bookmarks*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530767/F95zone%20Ratings%20on%20Bookmarks%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/530767/F95zone%20Ratings%20on%20Bookmarks%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // When the document is ready...
    $(document).ready(function() {
        // Loop through each bookmark list item.
        // In our case, each bookmark is an <li> with the class "block-row"
        $('ol.listPlain > li.block-row').each(function() {
            var $bookmarkItem = $(this);
            // Find the thread title link within this bookmark item.
            var $titleLink = $bookmarkItem.find('.contentRow-title a').first();
            if (!$titleLink.length) return; // If no title link is found, skip

            // Get the thread URL from the href attribute.
            var threadUrl = $titleLink.attr('href');
            if (!threadUrl) return;

            // Create a placeholder element where the rating will be displayed.
            var $ratingSpan = $('<span class="thread-rating" style="margin-left: 5px; color: #888;"></span>');
            // Insert it immediately after the title link.
            $titleLink.after($ratingSpan);

            // Use jQuery's AJAX to load the thread page.
            $.ajax({
                url: threadUrl,
                method: 'GET',
                success: function(response) {
                    // Create a temporary container and set its HTML to the response.
                    var $tempDiv = $('<div></div>').html(response);
                    // Look for the element with the rating info.
                    var $ratingElem = $tempDiv.find('[data-xf-init="rating"]');
                    if ($ratingElem.length) {
                        // Get the value from the data-initial-rating attribute.
                        var rating = $ratingElem.attr('data-initial-rating');
                        if (rating !== undefined) {
                            $ratingSpan.text('[Rating: ' + rating + ']');
                        } else {
                            $ratingSpan.text('[No rating]');
                        }
                    } else {
                        $ratingSpan.text('[Rating not found]');
                    }
                },
                error: function() {
                    $ratingSpan.text('[Error loading rating]');
                }
            });
        });
    });
})();

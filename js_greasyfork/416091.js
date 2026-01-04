// ==UserScript==
// @name         Reddit spoiler blur remover
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Remove all blur on spoiler images while keeping the NSFW setting. Supports external images too.
// @author       violhain
// @match        https://*.reddit.com/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/416091/Reddit%20spoiler%20blur%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/416091/Reddit%20spoiler%20blur%20remover.meta.js
// ==/UserScript==

// Prevents script to load twice as Reddit uses iframes
if (window.top != window.self) { return false; }

(function() {
    'use strict';
    /* globals $ */

    $(document).ready(function() {
        console.log('Spoiler reveal activated');

        const reveal = () => {
            $('div.Post').each(function() {
                // Ignore NSFW posts
                if (!$(this).text().match(/nsfw/)) {
                    // Click on the spoiler reveal on individual posts
                    $(this).find('button:contains("spoiler")').parent().siblings('a').find('*').click();
                    let postImg = $(this).find('img[alt="Post image"]');
                    // Checks if the post is a spoiler
                    if (postImg.attr('src') && postImg.attr('src').match(/blur/)) {
                        // Checks if the image is external, replace the image without blur
                        if ($(this).find('a.styled-outbound-link').attr('href') && $(this).find('a.styled-outbound-link').attr('href').match(/\.(jpg|png)$/).length > 0) {
                            postImg.attr('src', $(this).find('a.styled-outbound-link').attr('href'));
                        } else {
                            postImg.attr('src', postImg.attr('src').replace('/preview','/i'));
                        }
                        // Remove blur CSS filter + fix dimensions
                        postImg.css('filter','none').css('width','auto').css('height','auto');
                    }
                }
            });
        }

        reveal();
        window.onscroll = function(ev) {
            reveal();
        };
    });

})();
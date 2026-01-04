// ==UserScript==
// @name         Hide YouTube Shorts
// @namespace    https://www.taylrr.co.uk/
// @version      0.3
// @description  Hides YouTube Shorts videos from showing across the YouTube website.
// @author       taylor8294
// @match        https://www.youtube.com/
// @match        https://www.youtube.com/feed/subscriptions*
// @match        https://www.youtube.com/feed/explore*
// @match        https://www.youtube.com/feed/trending*
// @match        https://www.youtube.com/results*
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/shorts*
// @icon         https://i.ytimg.com/an/r0deIusKuMOsUobj89aPZA/featured_channel.jpg?v=60f4dc70
// @grant        none
// @license      GPLv3
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/437721/Hide%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/437721/Hide%20YouTube%20Shorts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.pathname.toLowerCase().startsWith('/shorts/')){
        window.location.href = window.location.origin+'/watch?v='+window.location.pathname.replace(/^\/shorts\//g,'')+window.location.search.replace(/^\?/g,'&')
    } else {
        let removeShorts = function(){
            // Explore and Trending
            Array.from(document.querySelectorAll('h2.ytd-reel-shelf-renderer')).filter(h2 => h2.textContent.includes('Shorts')).forEach(h2 => {
                if(h2.closest('ytd-reel-shelf-renderer')){
                    h2.closest('ytd-reel-shelf-renderer').remove()
                } else h2.closest('ytd-item-section-renderer')?.remove()
            })
            Array.from(document.querySelectorAll('a.ytd-thumbnail[href^="/shorts"]')).forEach(a => a.closest('ytd-video-renderer')?.remove() )
            Array.from(document.querySelectorAll('#video-title.ytd-video-renderer')).forEach(a => /\#shorts?/.test(a.innerText.toLowerCase()) ? a.closest('ytd-video-renderer')?.remove() : null)
            Array.from(document.querySelectorAll('#description-text.ytd-video-renderer')).forEach(yfs => /\#shorts?/.test(yfs.innerText.toLowerCase()) ? yfs.closest('ytd-video-renderer')?.remove() : null )

            // Search
            Array.from(document.querySelectorAll('.title-and-badge.ytd-video-renderer')).forEach(h3 => /\#shorts?/.test(h3.innerText.toLowerCase()) ? h3.closest('ytd-video-renderer')?.remove() : null)
            Array.from(document.querySelectorAll('.metadata-snippet-container.ytd-video-renderer')).forEach(div => /\#shorts?/.test(div.innerText.toLowerCase()) ? div.closest('ytd-video-renderer')?.remove() : null)

            // Recommended
            Array.from(document.querySelectorAll('#video-title.ytd-compact-video-renderer')).forEach(span => /\#shorts?/.test(span.innerText.toLowerCase()) ? span.closest('ytd-compact-video-renderer')?.remove() : null)

            // Subscriptions and Home
            Array.from(document.querySelectorAll('h2.ytd-rich-shelf-renderer')).filter(h2 => h2.textContent.includes('Shorts')).forEach(h2 => h2.closest('ytd-rich-section-renderer')?.remove())

            // Side menu
            Array.from(document.querySelectorAll('ytd-guide-entry-renderer')).filter(el => el.textContent.includes('Shorts')).forEach(el => el?.remove())
        }

        document.arrive('ytd-reel-shelf-renderer, ytd-item-section-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-rich-section-renderer, ytd-guide-entry-renderer', function () {
            removeShorts();
            console.log("[removeShorts called]");
        });

        removeShorts()
    }
})();

// ==UserScript==
// @name        Youtube Auto Quality
// @version     1.0
// @grant       none
// @match       https://www.youtube.com/*
// @run-at      document-start
// @author      RexOmni
// @description Adjusts YouTube quality when not focused
// @no-frames
// @namespace https://greasyfork.org/users/48806
// @downloadURL https://update.greasyfork.org/scripts/371115/Youtube%20Auto%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/371115/Youtube%20Auto%20Quality.meta.js
// ==/UserScript==

/* Acceptable qulaities
'auto'
'highres'  // 8k or 'original'
'hd2880'
'hd2160'
'hd1440'
'hd1080'
'hd720'
'large'
'medium'
'small'
'tiny'

if the one you chose is not available it will choose the better one
*/

const FOCUSEDQUALITY = 'hd720';
const HIDDENQUALITY = 'tiny';

(function(){
    'use strict';

    document.addEventListener('DOMContentLoaded', function(){
        // Handle page visibility change
        document.addEventListener("visibilitychange", function(){
            if (document.visibilityState == 'hidden') {
                document.getElementById("movie_player").setPlaybackQualityRange(HIDDENQUALITY);
            } else if (document.visibilityState == 'visible') {
                document.getElementById("movie_player").setPlaybackQualityRange(FOCUSEDQUALITY);
            }
        }, false);
    })

})();

console.log('YAQ: LOADED');
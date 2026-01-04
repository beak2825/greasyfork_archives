// ==UserScript==
// @name         twitter no media
// @namespace    https://greasyfork.org/en/scripts/506662-posts
// @version      1.1
// @description  text-only twitter feed
// @license      MIT
// @author       You
// @match        https://x.com/home
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531602/twitter%20no%20media.user.js
// @updateURL https://update.greasyfork.org/scripts/531602/twitter%20no%20media.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let comb = function() {
        let timeline = document.querySelector('[aria-label="Home timeline"]');

        if(timeline == null) {
            return true;
        }

        Object.entries(timeline.querySelectorAll("article")).reduce(function(res, item) {

            let article_location = item[1].getBoundingClientRect();

            if(article_location > 1000 && article_location.y * 2 < window.scrollY) {
                item[1].remove();
            }

            let img = item[1].querySelector('[data-testid="tweetPhoto"]') || item[1].querySelector('[data-testid="card.wrapper"]');
            if(img != null) {
                img.remove();
            }

            let videoPlayer = item[1].querySelector('[data-testid="videoPlayer"]');
            if(videoPlayer != null) {
                videoPlayer.remove();
            }

            return true;

        }, true);

        return true;
    };

    setInterval(comb, 500);


})();
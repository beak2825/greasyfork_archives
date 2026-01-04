// ==UserScript==
// @name         Hide Twitter Promotion Tweets
// @namespace    https://github.com/julyrunt/userscripts/blob/main/Hide%20Twitter%20Promotion%20Tweets/Hide%20Twitter%20Promotion%20Tweets.js
// @version      1.0.2
// @description  Check and hide tweets containing promotional icons every 0.5 seconds.
// @author       julyrunt
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474017/Hide%20Twitter%20Promotion%20Tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/474017/Hide%20Twitter%20Promotion%20Tweets.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hidePromotionTweets() {
        let count = 0;
        const articles = document.querySelectorAll('article');

        articles.forEach(article => {
            if (article.style.display == 'none') {
                return;
            }

            const paths = article.querySelectorAll('path');
            let containsPromotion = false;

            paths.forEach(path => {
                if (path.getAttribute('d') == 'M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z') {
                    containsPromotion = true;
                }
            });

            if (containsPromotion) {
                article.style.display = 'none';
                count += 1;
            }
        });

        if (count > 0) {
            console.log(`hide ${count} promotion tweets`);
        };
    }

    const interval = 500; // 0.5 seconds
    setInterval(hidePromotionTweets, interval);
})();

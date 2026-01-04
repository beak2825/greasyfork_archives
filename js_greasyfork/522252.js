// ==UserScript==
// @name         FuckRedditAds - Hide ads on Reddit feed and in threads
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide ads on Reddit feed and in threads
// @author       John Doe
// @match        *://www.reddit.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522252/FuckRedditAds%20-%20Hide%20ads%20on%20Reddit%20feed%20and%20in%20threads.user.js
// @updateURL https://update.greasyfork.org/scripts/522252/FuckRedditAds%20-%20Hide%20ads%20on%20Reddit%20feed%20and%20in%20threads.meta.js
// ==/UserScript==

(function() {
    function hideAds () {
        let adsOnMainFeed = document.querySelectorAll('shreddit-ad-post')
        let adsOnThread = document.querySelectorAll('shreddit-dynamic-ad-link')

        for (let i = 0; i < adsOnMainFeed.length; i++) {
            adsOnMainFeed[i].style.display = 'none';
        }

        for (let i = 0; i < adsOnThread.length; i++) {
            adsOnThread[i].style.display = 'none';
        }
    }

    setInterval(hideAds, 2000)
})();
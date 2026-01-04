// ==UserScript==
// @name         GatherSubs for Reddit
// @namespace    https://xvicario.us/scripts/
// @version      1.0.0
// @description  Gather which subreddits you are subscribed to
// @author       XVicarious AKA Brian Maurer
// @match        https://www.reddit.com/*
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35300/GatherSubs%20for%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/35300/GatherSubs%20for%20Reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if (window.location.href === 'https://www.reddit.com/subreddits/mine') {
        var subreddits = $('.subscription-box').find('a').attr('href');
        var subs = subreddits.split('/');
        subs = subs[subs.length - 1];
        subs = subs.split('+');
        Cookies.set('xvSubs', JSON.stringify(subs));
        //window.location.href = 'https://www.reddit.com/r/' + subs[0];
        alert('We are good to go!');
    } else {
        // get our subreddits
        var subs = JSON.parse(Cookies.get('xvSubs'));
        if ($('div.subButtons .option.add.active')) { // if the subreddit isn't subscribed
            $('div.subButtons').find('.option.add').click(); // subscribe to it
        }
        var currentIndex = subs.indexOf(window.location.href.split('/')[4]); // get the current subreddit we are on
        if (currentIndex < subs.length - 1) { // if we aren't on the last subreddit
            window.location.href = 'https://www.reddit.com/r/' + subs[currentIndex+1]; // go to the next one
        }
    }
})();
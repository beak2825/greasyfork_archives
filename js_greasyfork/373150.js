// ==UserScript==
// @name             Nextdoor - remove sponsored posts
// @namespace        https://greasyfork.org/users/30701-justins83-waze
// @version          0.1
// @description      Removes sponsored posts
// @author           JustinS83
// @include          https://nextdoor.com/news_feed*
// @grant            none
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/373150/Nextdoor%20-%20remove%20sponsored%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/373150/Nextdoor%20-%20remove%20sponsored%20posts.meta.js
// ==/UserScript==

/* ecmaVersion 2017 */
/* global $ */
/* eslint curly: ["warn", "multi-or-nest"] */

(function() {
    'use strict';

    function init(){
        if($('.feed-container > div > div > div.post-container').length > 0)
            $('.feed-container > div > div > div.post-container').remove();

        var observer = new MutationObserver(function(mutations) {
               mutations.forEach(function(mutation) {
                   debugger;
                   if (mutation.addedNodes.length > 0) $('.feed-container > div > div > div.post-container').remove();
               });
           });

        observer.observe($('.feed-container > div > div')[3], { childList: true});
    }

    setTimeout(init, 500);
})();
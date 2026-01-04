// ==UserScript==
// @name         Use explicit new.reddit search, but redirect back to 'user-preference'.reddit for results
// @namespace    http://tampermonkey.net/
// @version      2024-05-21
// @description  The explicit 'new.' subdomain for reddit will always load the reddit redesign, even if the user's preference is for old. Which is great for using the new search (which has exclusively available filtering features) but annoying to then have to switch back. This script allow for using the redesign's search and then immediately putting you back into your user-preferenced reddit domain.
// @author       You
// @match        https://new.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/487273/Use%20explicit%20newreddit%20search%2C%20but%20redirect%20back%20to%20%27user-preference%27reddit%20for%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/487273/Use%20explicit%20newreddit%20search%2C%20but%20redirect%20back%20to%20%27user-preference%27reddit%20for%20results.meta.js
// ==/UserScript==

var redirecting = false;

function applyRedirectIfNecessary() {
    var url = document.location.href;
    if(!url.includes("type=sr") && !url.includes("type=user") && !redirecting){
        redirecting=true;
        let dest = document.location.href.replace("new.","www.")+"?redirectedFromOldRedditByTampermonkeyScript=true";
        // Re-add the nsfw:yes flag to the search, since we're going back to old reddit
        if(dest.includes("reddit.com/search")){
            dest = dest.replace("q=","q=nsfw:yes ")
        }
        document.location=dest;
    }
}

(function() {
    'use strict';

    setInterval(applyRedirectIfNecessary,1000);
})();

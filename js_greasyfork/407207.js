// ==UserScript==

// @name        ad free youtube grid
// @namespace   youtube_grid_kboudy
// @description hides the lame new format top level youtube ads
// @version     1.6
// @run-at      document-start
// @match       https://www.youtube.com/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/407207/ad%20free%20youtube%20grid.user.js
// @updateURL https://update.greasyfork.org/scripts/407207/ad%20free%20youtube%20grid.meta.js
// ==/UserScript==

let interval = null;
let counter = 0;

const hideTopLevelAdContent = () => {
    const homeFeedAds = document.getElementsByTagName("ytd-display-ad-renderer");
    const searchResultAds = document.getElementsByTagName("ytd-promoted-sparkles-text-search-renderer");
    const newBannerAds = document.getElementsByTagName("ytd-search-pyv-renderer");
    const ads = [...homeFeedAds,...searchResultAds,...newBannerAds];
    counter++;
    if (ads && ads.length > 0)
    {
        clearInterval(interval);
        for (const a of ads)
        {
            a.parentElement.parentElement.style.display="none";
        }
    }
    else if (counter === 30)
    {
        clearInterval(interval);
    }
}

hideTopLevelAdContent();
interval = setInterval(function(){
    hideTopLevelAdContent();
},100);

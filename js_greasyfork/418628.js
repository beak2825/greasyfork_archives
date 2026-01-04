// ==UserScript==

// @name        hide market dashboard posts
// @namespace   twitter_kboudy
// @description hides sven's market dashboard tweets
// @include     https://twitter.com/*
// @include     https://twitter.com
// @version     3.0
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/418628/hide%20market%20dashboard%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/418628/hide%20market%20dashboard%20posts.meta.js
// ==/UserScript==

function hideMarketDashboardTweets(){
    const posts = document.getElementsByTagName("article");
    if (posts)
    {
        for (const p of posts)
        {
            const text = p.textContent;
            if (text)
            {
                if ((text.includes("Sven Henrich") && text.includes("Market Dashboard")) ||
                    (text.includes("Sven Henrich") && text.includes("Market Video")))
                {
                    let el = p;
                    while (el.className)
                    {
                        el = el.parentElement;
                    }

                    el.style.display="none";
                }
            }
        }
    }
}

hideMarketDashboardTweets();
setInterval(function(){
    hideMarketDashboardTweets();
},1000);
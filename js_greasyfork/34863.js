// ==UserScript==
// @name        Twitter - filter tweets
// @namespace   valacar-twitter
// @author      valacar
// @description Twitter filter
// @include     https://twitter.com/
// @include     https://twitter.com/*/lists/*
// @include     https://twitter.com/hashtag/*
// @version     0.1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34863/Twitter%20-%20filter%20tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/34863/Twitter%20-%20filter%20tweets.meta.js
// ==/UserScript==

// TODO: make these lowercase? change to regex?
var filterList = [
"#HealthyLiving",
"#BeautifulMind",
"smoothie",
"Smoothie",
"Nutri Ninja",
"go.learn4",
"Immersion Blender",
"#appliances",
"#kitchen",
"#Blender #Uses",
"KitchenAid",
];

function appendStyle(cssString)
{
    "use strict";
    let head = document.getElementsByTagName("head")[0];
    if (head)
    {
        let style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.textContent = cssString;
        head.appendChild(style);
        return style;
    }
    return null;
}

appendStyle(`
    [badtweet] {display: none;}
`);

// console.log("starting");

// var timeLineEl = document.querySelector("#timeline");
// if (timeLineEl) { console.log("::: Found timeline"); }

function filterTweets()
{
    "use strict";

    var streamItemsEl = document.querySelectorAll(".stream-item");
    // if (streamItemsEl) {
    //     console.log("::: Found stream-item class [%d]", streamItemsEl.length);
    // } else {
    //     console.log("::: Can't find stream-item class");
    // }

    for (let streamItem of streamItemsEl) {
        var tweetTextEl = streamItem.querySelector(".tweet-text");
        if (tweetTextEl) {
            let tweetTextContent = tweetTextEl.textContent;
            // filter here
            for (let filter of filterList)
            {
                // TODO: regex instead? 
                if (tweetTextContent.indexOf(filter) !== -1) {
                    console.log(":: Found bad tweet: %s", filter);
                    streamItem.setAttribute("badtweet", "badtweet");
                }
            }
            console.log(tweetTextContent);
        }
    }
}

// TODO: do something better than polling
setInterval(function() { "use strict"; filterTweets(); }, 2000);

// console.log("ending");

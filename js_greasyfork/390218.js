// ==UserScript==
// @name  Block Murdoch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script will block websites owned by Rupert Murdoch.
// @author       You
// @match *://*.news.com.au/*
// @match *://*.foxnews.com/*
// @match *://*.foxnewsgo.com/*
// @match *://*.foxbusiness.com/*
// @match *://*.foxsports.com/*
// @match *://*.thetimes.co.uk/*
// @match *://*.thesundaytimes.co.uk/*
// @match *://*.thesun.co.uk/*
// @match *://*.news.co.uk/*
// @match *://*.dowjones.com/*
// @match *://*.nypost.com/*
// @match *://*.harpercollins.com/*
// @match *://*.amplify.com/*
// @match *://*.newsamerica.com/*
// @match *://*.smartsource.com/*
// @match *://*.storyful.com/*
// @match *://*.theaustralian.com.au/*
// @match *://*.foxsports.com.au/*
// @match *://*.foxsportspulse.com/*
// @match *://*.businessspectator.com.au/*
// @match *://*.eurekareport.com.au/*
// @match *://*.vogue.com.au/*
// @match *://*.taste.com.au/*
// @match *://*.kidspot.com.au/*
// @match *://*.bodyandsoul.com.au/*
// @match *://*.homelife.com.au/*
// @match *://*.dailytelegraph.com.au/*
// @match *://*.couriermail.com.au/*
// @match *://*.heraldsun.com.au/*
// @match *://*.adelaidenow.com.au/*
// @match *://*.perthnow.com.au/*
// @match *://*.ntnews.com.au/*
// @match *://*.themercury.com.au/*
// @match *://*.townsvillebulletin.com.au/*
// @match *://*.cairnspost.com.au/*
// @match *://*.goldcoastbulletin.com.au/*
// @match *://*.hgeelongadvertiser.com.au/*
// @match *://*.geelongadvertiser.com.au/*
// @match *://*.weeklytimesnow.com.au/*
// @match *://*.whereilive.com.au/*
// @match *://*.moshtix.com.au/*
// @match *://*.foxtix.com.au/*
// @match *://*.getprice.com.au/*
// @match *://*.shopferret.com.au/*
// @match *://*.realcommercial.com.au/*
// @match *://*.wego.com.au/*
// @match *://*.learningseat.com.au/*
// @match *://*.stocksinvalue.com.au/*
// @match *://*.traderoo.com.au/*
// @match *://*.careerone.com.au/*
// @match *://*.carsguide.com.au/*
// @match *://*.realestate.com.au/*
// @match *://*.realcommercial.com.au/*
// @match *://news.com.au/*
// @match *://foxnews.com/*
// @match *://foxnewsgo.com/*
// @match *://foxsports.com/*
// @match *://foxbusiness.com/*
// @match *://thetimes.co.uk/*
// @match *://thesundaytimes.co.uk/*
// @match *://thesun.co.uk/*
// @match *://news.co.uk/*
// @match *://dowjones.com/*
// @match *://nypost.com/*
// @match *://harpercollins.com/*
// @match *://amplify.com/*
// @match *://newsamerica.com/*
// @match *://smartsource.com/*
// @match *://storyful.com/*
// @match *://theaustralian.com.au/*
// @match *://foxsports.com.au/*
// @match *://foxsportspulse.com/*
// @match *://businessspectator.com.au/*
// @match *://eurekareport.com.au/*
// @match *://vogue.com.au/*
// @match *://taste.com.au/*
// @match *://kidspot.com.au/*
// @match *://bodyandsoul.com.au/*
// @match *://homelife.com.au/*
// @match *://dailytelegraph.com.au/*
// @match *://couriermail.com.au/*
// @match *://heraldsun.com.au/*
// @match *://adelaidenow.com.au/*
// @match *://perthnow.com.au/*
// @match *://ntnews.com.au/*
// @match *://themercury.com.au/*
// @match *://townsvillebulletin.com.au/*
// @match *://cairnspost.com.au/*
// @match *://goldcoastbulletin.com.au/*
// @match *://hgeelongadvertiser.com.au/*
// @match *://geelongadvertiser.com.au/*
// @match *://weeklytimesnow.com.au/*
// @match *://whereilive.com.au/*
// @match *://moshtix.com.au/*
// @match *://foxtix.com.au/*
// @match *://getprice.com.au/*
// @match *://shopferret.com.au/*
// @match *://realcommercial.com.au/*
// @match *://wego.com.au/*
// @match *://learningseat.com.au/*
// @match *://stocksinvalue.com.au/*
// @match *://traderoo.com.au/*
// @match *://careerone.com.au/*
// @match *://carsguide.com.au/*
// @match *://realestate.com.au/*
// @match *://realcommercial.com.au/*
// @run-at document-start


// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390218/Block%20Murdoch.user.js
// @updateURL https://update.greasyfork.org/scripts/390218/Block%20Murdoch.meta.js
// ==/UserScript==

(function() {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                [].slice.call(mutation.addedNodes)
                    .forEach(function(node) {
                    node.parentNode.removeChild(node);
                });
            }
        });
    });

    // pass in the target node, as well as the observer options
    observer.observe(document, {
        childList: true,
        subtree: true,
        characterData: true
    });
    alert(document.domain.concat(" is blocked."));
})();
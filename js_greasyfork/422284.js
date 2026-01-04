// ==UserScript==
// @name Silent Facebook
// @namespace github.com/openstyles/stylus
// @version 1.0.4
// @description This makes Facebook a peaceful place to live by removing distractions. In particular, it disables the feed on the main page and links to marketplace, videos and gaming. Easy to adjust (e.g. to reenable some of the features).
// @author Piotr Suwara
// @grant GM_addStyle
// @run-at document-start
// @match *://*.facebook.com/*
// @downloadURL https://update.greasyfork.org/scripts/422284/Silent%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/422284/Silent%20Facebook.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Disables news feed on the main page */
    div[data-pagelet="FeedUnit_0"],
    div[data-pagelet="FeedUnit_0"] ~ div,
    
    /* Disables ads on the main page */
    a[aria-label="Advertiser"],
    a[aria-label="Advertiser"] ~ div,
    
    /* If uncommented, disables news feed on the main page */
    /*div[data-pagelet="GroupsFeed_0"],
    div[data-pagelet="GroupsFeed_0"] ~ div,*/
    
    /* Disables stories on the main page */
    div[aria-label="Stories"],
    
    /* Disables video chat on the main page */
    div[data-pagelet^="VideoChatHomeUnit"],
    
    /* Disables FB Watch (which sometimes adds the number of notifications to the label)... */
    a[aria-label^="Watch"],
    
    /* One may disable FB Watch completely by uncommenting these: */
    /*div[aria-label="Shortcuts within Facebook Watch"],
    div[aria-label="Videos on Facebook Watch"],*/
    
    /* Disables Games link */
    a[aria-label="Gaming"],
    
    /* One may disable Gaming completely by uncommenting this: */
    /*div[aria-label="Gaming"],*/
    
    /* Disables Marketplace link */
    a[aria-label="Marketplace"]
    
    /* One may disable Marketplace completely by uncommenting these: */
    /*div[aria-label="Collection of Marketplace items"],
    div[aria-label="Marketplace sidebar"]*/
    {
        display: none;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

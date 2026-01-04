// ==UserScript==
// @name         Replace sonic subreddit icon
// @namespace    https://i.redd.it
// @version      1.0
// @description  Replace sonic subreddit icon with different icon
// @match        *://*/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/463265/Replace%20sonic%20subreddit%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/463265/Replace%20sonic%20subreddit%20icon.meta.js
// ==/UserScript==
//the icon url may change over time. change this define bellow when the subreddit icon changes
var oldiconurl = "https://styles.redditmedia.com/t5_2rh21/styles/communityIcon_huuid381hora1.png?width=256&v=enabled&s=fc372fda7b0e83611279f9cff3ed8a6e51e24fba";

//you can use whatever replacement icon you want by changing this url
var newiconurl = "https://styles.redditmedia.com/t5_5azuui/styles/communityIcon_aerz7zhxddq91.png?width=256&v=enabled&s=36ce05428ea8b7b601fc2964e1d656da3721e261";
(function() {
    'use strict';
    function replaceImageURLs() {
        // Get all images on the page
        var images = document.getElementsByTagName("img");
        // Loop through each image
        for (var i = 0; i < images.length; i++) {
            var src = images[i].src;
            if (src.includes(oldiconurl)) {
                var newSrc = src.replace(oldiconurl,newiconurl);
                images[i].src = newSrc;
            }
        }
    }
    var observer = new MutationObserver(replaceImageURLs);
    var options = {childList: true, subtree: true, attributes: true};
    observer.observe(document.body, options);
})();
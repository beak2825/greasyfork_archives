// ==UserScript==
// @name          InkBunny Smart Image Opener
// @description   Automatically open images in full size on InkBunny
// @version       0.0.4
// @author        Lourie Parker
// @license MIT
// @match         https://*inkbunny.net/s/*
// @require       http://cdn.jsdelivr.net/jquery/2.1.3/jquery.min.js
// @grant    none
// @namespace https://greasyfork.org/users/941226
// @downloadURL https://update.greasyfork.org/scripts/508475/InkBunny%20Smart%20Image%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/508475/InkBunny%20Smart%20Image%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script began its work.");
    // Try to catch the full image URL.
    const linkElement = document.querySelector('a[href*="metapix.net/files/full"]');
    const linkHref = linkElement.href;
        if (linkHref) {
        console.log("Direct image URL found.");
        }

    // Check if the page opened through the post (contains #pictop)
    if (location.hash.includes('pictop')) {
        console.log("The #pictop tag found, moving to the direct link.");
        window.location.href = linkHref; // Open direct URL
        return;
    }

    // Check if the post is multipage post.
    const element = document.querySelector('img[title="page 2"]'); // Seek for title = "page 2"
    if (element) {
        console.log("Post is multipage post. Adding the #multipage tag.");
        location.hash = 'multipage'; // Add the #multipage tag to prevent redirecting.
    }

    // Check if not #multipage post, go to direct URL.
    if (!location.hash.includes('multipage')) {
        console.log("This is the single image post. Redirecting.");
        window.location.href = linkHref; // Open direct URL
        return;
    }
    console.log("Redirect had not been made. The page contains #multipage tag or the direct link not found.");
    }
)();
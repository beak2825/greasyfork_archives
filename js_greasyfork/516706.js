// ==UserScript==
// @name         Rewrite MetArt Network Links
// @description  Rewrites all gallery/movie links so they go to the original studio's page
// @namespace    https://greasyfork.org/users/1393919
// @version      1.0
// @license      MIT
// @match        *://www.metartnetwork.net/archive/*
// @match        *://www.metartnetwork.net/movies/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516706/Rewrite%20MetArt%20Network%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/516706/Rewrite%20MetArt%20Network%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Find all anchor elements on the page
    var anchors = document.querySelectorAll('.gallery_image_cell_container > a');
    // Loop through each anchor element
    anchors.forEach((anchor) => {
        // Get the href and src attributes of the anchor's child image element
        var href = anchor.href;
        var imgSrc = anchor.querySelector('img').src;
  
        // Check if the href contains "metartnetwork.net" and the imgSrc contains "thumb="
        if (href.includes('metartnetwork.net') && imgSrc.includes('thumb=')) {
            // Get the domain from the thumb query parameter
            var thumbParam = new URLSearchParams(imgSrc.split('?')[1]).get('thumb');
            var thumbHostname = new URL(thumbParam).hostname.replace("static.", "www.");
            // Replace the domain in the href with the thumb domain
            var newHref = href.replace('www.metartnetwork.net', thumbHostname);
            // Update the href attribute of the anchor
            anchor.href = newHref;
            anchor.target = "_blank";

            const parentEl = anchor.parentElement.parentElement
            parentEl.querySelectorAll('div.gallery_information > a').forEach((el) => el.href = el.href.replace('www.metartnetwork.net', thumbHostname));
            
        }
    })
})();

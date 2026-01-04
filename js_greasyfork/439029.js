// ==UserScript==
// @name        Letterboxd Short Review Culler
// @version     1.0.2
// @author      @stalkerhumanoid
// @license     MIT
// @description Hides reviews on Letterboxd that are less than a minimum number of characters (with the default being 150)
// @match       *://letterboxd.com/*
// @namespace   https://github.com/stalkerhumanoid
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/439029/Letterboxd%20Short%20Review%20Culler.user.js
// @updateURL https://update.greasyfork.org/scripts/439029/Letterboxd%20Short%20Review%20Culler.meta.js
// ==/UserScript==

const CHARACTER_MINIMUM = 150;

function cullReviews() {
    console.log('culling...');
    try {
        const reviews = document.getElementsByClassName('film-detail');
        for (const review of reviews) {
            const reviewBody = review.getElementsByClassName('film-detail-content')[0].getElementsByClassName('body-text')[0].textContent;
            if (reviewBody.length < CHARACTER_MINIMUM) {
                console.log('Removing: ' + reviewBody);
                review.style.display = 'none';
            }
        }
    } catch (error) {
        console.log(error);
    }
    console.log('done');
}

console.log('"Letterboxd Short Review Culler" starting!');
cullReviews();
setTimeout(cullReviews, 1000);
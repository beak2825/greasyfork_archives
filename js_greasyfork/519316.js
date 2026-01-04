// ==UserScript==
// @name         AOTY Short Review Nuker
// @namespace    https://albumoftheyear.org
// @version      2024-11-29
// @description  hi, code modified from Letterboxd Short Review Culler, https://greasyfork.org/en/scripts/439029-letterboxd-short-review-culler
// @author       magomago
// @match        https://www.albumoftheyear.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=albumoftheyear.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519316/AOTY%20Short%20Review%20Nuker.user.js
// @updateURL https://update.greasyfork.org/scripts/519316/AOTY%20Short%20Review%20Nuker.meta.js
// ==/UserScript==

const CHARACTER_MINIMUM = 150;

function nukeReviews() {
    console.log('Nuking these annoying reviews...');
    try {
        const reviews = document.getElementsByClassName('albumReviewRow');
        for (const review of reviews) {
            const reviewBody = review.getElementsByClassName('albumReviewText')[0].textContent;
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

console.log('"AOTY Short Review Nuker" starting!');
nukeReviews();
setTimeout(nukeReviews, 1000);
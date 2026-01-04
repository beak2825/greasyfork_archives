// ==UserScript==
// @name         Hanime: Likes and Dislikes as Percentages + Star Rating
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  replaces the amount of Likes and Dislikes with a Percentage, also adds a Star Rating that maps the Like Ratio to 0 to 5 stars
// @author       Stray
// @match        https://hanime.tv/videos/hentai/*
// @icon         https://hanime.tv/favicon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480057/Hanime%3A%20Likes%20and%20Dislikes%20as%20Percentages%20%2B%20Star%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/480057/Hanime%3A%20Likes%20and%20Dislikes%20as%20Percentages%20%2B%20Star%20Rating.meta.js
// ==/UserScript==

// GLOBAL VARIABLES
const RATIO_PRECISION = 1; // number of decimal places
const STAR_PRECISION = 2;
const MIN_LIKE_RATIO = 80;
const MAX_LIKE_RATIO = 100;
const MIN_STARS = 0;
const MAX_STARS = 5;
const STAR_INDEX = 2;

// Wait for page to finish loading
window.addEventListener('load', function() {
    'use strict';

    // Get Ratio Percentages
    const like_ratio = getLikeRatio();
    const dislike_ratio = getDislikeRatio();

    // Format the Ratios for Easy Reading
    const formatted_like_ratio = like_ratio.toFixed(RATIO_PRECISION) + '%';
    const formatted_dislike_ratio = dislike_ratio.toFixed(RATIO_PRECISION) + '%';

    // Replace Like/Dislike Text
    document.getElementsByClassName("hvpabb-text")[0].innerText = formatted_like_ratio;
    document.getElementsByClassName("hvpabb-text")[1].innerText = formatted_dislike_ratio;

    // Get Star Rating
    const star_rating = getStarRating(like_ratio);

    // Copy the Likes Element as a template
    let star_spanElement = document.getElementsByClassName("tooltip tooltip--top")[0].cloneNode(true);

    // Modify the new Element a little
    star_spanElement.querySelector('.hvpabb-text').textContent = star_rating.toFixed(STAR_PRECISION);
    star_spanElement.querySelector('.icon.mdi.mdi-heart.grey--text').classList.replace('mdi-heart', 'mdi-star');

    // Insert the Element right after the Likes/Dislikes
    let containerDiv = document.getElementsByClassName("actions flex row justify-right align-right")[0];
    let referenceElement = containerDiv.children[STAR_INDEX];
    containerDiv.insertBefore(star_spanElement, referenceElement);

});

function getLikeRatio(){
    let likes = document.getElementsByClassName("hvpabb-text")[0].innerText;
    let dislikes = document.getElementsByClassName("hvpabb-text")[1].innerText;
    likes = likes.endsWith('K') ? parseFloat(likes) * 1000 : parseFloat(likes);
    dislikes = dislikes.endsWith('K') ? parseFloat(dislikes) * 1000 : parseFloat(dislikes);
    const like_ratio = (likes / (likes + dislikes)) * 100;
    return like_ratio;
}

function getDislikeRatio(){
    let likes = document.getElementsByClassName("hvpabb-text")[0].innerText;
    let dislikes = document.getElementsByClassName("hvpabb-text")[1].innerText;
    likes = likes.endsWith('K') ? parseFloat(likes) * 1000 : parseFloat(likes);
    dislikes = dislikes.endsWith('K') ? parseFloat(dislikes) * 1000 : parseFloat(dislikes);
    const dislike_ratio = (dislikes / (likes + dislikes)) * 100;
    return dislike_ratio;
}

function getStarRating(like_ratio){
    const star_rating = map_range(like_ratio, MIN_LIKE_RATIO, MAX_LIKE_RATIO, MIN_STARS, MAX_STARS)
    return star_rating;
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
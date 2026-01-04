// ==UserScript==
// @name         Brainly v2.0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://brainly.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393860/Brainly%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/393860/Brainly%20v20.meta.js
// ==/UserScript==
function removePost(e) {
    e.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
}

function checkRating(rating) {
  let value = parseInt(rating.innerText);
  return value >= 4;
}

function filterRatings() {
    if (document.querySelectorAll("div[class='sg-rate-box__rate']").length === 0) {
        console.log('No answers to check.');
    }
    else {
        var Listings = [...document.querySelectorAll("div[class='sg-rate-box__rate']")].map(listing => {
        if (parseInt(listing.innerText) < 4 && parseInt(listing.innerText) != 0) {
            removePost(listing);
            console.log(`${listing} being removed`);
        }
        else {
          return parseInt(listing.innerText);
        }
    });
    console.log(Listings);
    }
}


(function() {
    'use strict';
    filterRatings();
})();
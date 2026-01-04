// ==UserScript==
// @name        Internet Archive Full Reviews
// @version     1.1.0
// @description Display full reviews for items on archive.org
// @include     https://archive.org/details/*
// @run-at      document-idle
// @grant       none
// @license     CC0
// @namespace https://greasyfork.org/users/1468843
// @downloadURL https://update.greasyfork.org/scripts/535700/Internet%20Archive%20Full%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/535700/Internet%20Archive%20Full%20Reviews.meta.js
// ==/UserScript==
 
// copyright / licence:   CC0 1.0 Universal (Public Domain)
 
// Run as an anonymous function so we can exit early if no "reviews" object exists
(function(){
 
if (! document.getElementById('reviews'))
    return;

const reviews_component = document.querySelector('ia-reviews');
if (reviews_component) {
    reviews_component.displayReviewsByDefault = true;
    return;
}
 
// Show the list of reviews
var review_elements = document.getElementById("reviews").getElementsByClassName("details-reviews-list");
for (var i = 0; i < review_elements.length; i++)
    review_elements[i].style = "";
 
// Expand each review by showing the full review, hiding the preview, and hiding
// the button the minimise the expanded review
var reviews = document.getElementById("reviews").getElementsByClassName("aReview");
for (var i = 0; i < reviews.length; i++) {
    var previews = reviews[i].getElementsByClassName("truncated-msg");
    for (var j = 0; j < previews.length; j++)
        previews[j].style = "display: none";
    var remainders = reviews[i].getElementsByClassName("remainder");
    for (var j = 0; j < remainders.length; j++)
        remainders[j].style = "";
    var less_btn = reviews[i].getElementsByClassName("review-less-btn");
    for (var j = 0; j < less_btn.length; j++)
        less_btn[j].style = "display: none";
}
 
// Hide the button to expand the full reviews (since we've already done that!)
var display_buttons = document.getElementsByClassName("display-reviews-msg");
for (var i = 0; i < display_buttons.length; i++)
    display_buttons[i].style = "display: none";
 
})();
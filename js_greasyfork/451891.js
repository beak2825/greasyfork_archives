// ==UserScript==
// @name        Letterboxd - No Negative Reviews
// @description Hides reviews with under a certain amount of stars.
// @version     1.0.0
// @grant       none
// @namespace   petracoding
// @include     https://letterboxd.com/*
// @include     http://letterboxd.com/*
// @downloadURL https://update.greasyfork.org/scripts/451891/Letterboxd%20-%20No%20Negative%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/451891/Letterboxd%20-%20No%20Negative%20Reviews.meta.js
// ==/UserScript==

// OPTIONS:
const minRatingToShow = 6; // in half stars. 1 full star = 2. 5 full stars = 10. Example: minRating = 6 means at least 3 stars
const hideReviewsWithoutRating = false; // true or false

// SCRIPT:
setTimeout(() => {
  hideReviews();
  document.addEventListener("scroll", hideReviews);
}, 1000);

function hideReviews() {
  const reviewElements = getReviewElements();
  [...reviewElements].forEach((reviewEl) => {
    if (toHide(reviewEl)) {
      reviewEl.style.display = "none";
    }
  });
}

function getReviewElements() {
  const reviewElementClassSelector = ".film-detail, .review-tile";
  if (document.querySelector(".my-own-page:not(.activity)") || document.querySelector(".film-viewing-info-wrapper")) {
    // own profile or review page = return none
    return [];
  } else if (document.querySelector("#film-page-wrapper")) {
    // film detail page
    let reviewElements = [];
    const popularSection = document.querySelector("#popular-reviews");
    if (popularSection) {
      reviewElements.push(...popularSection.querySelectorAll(reviewElementClassSelector));
    }
    const recentSection = document.querySelector("#recent-reviews");
    if (recentSection) {
      reviewElements.push(...recentSection.querySelectorAll(reviewElementClassSelector));
    }
    const friendSection = document.querySelector("#popular-reviews-with-friends");
    if (friendSection) {
      reviewElements.push(...friendSection.querySelectorAll(reviewElementClassSelector));
    }
    return reviewElements;
  } else {
    // return all
    return document.querySelectorAll(reviewElementClassSelector);
  }
}

function toHide(reviewEl) {
  const isLiked = reviewEl.querySelector(".-like.-liked");
  if (isLiked) return false;
  const ratingEl = reviewEl.querySelector(".rating");
  if (!ratingEl) return hideReviewsWithoutRating;
  const rating = getRating(ratingEl);
  if (rating < minRatingToShow) {
    return true;
  } else {
    return false;
  }
}

function getRating(el) {
  const cls = el.classList;
  if (cls.contains("rated-1")) return 1;
  if (cls.contains("rated-2")) return 2;
  if (cls.contains("rated-3")) return 3;
  if (cls.contains("rated-4")) return 4;
  if (cls.contains("rated-5")) return 5;
  if (cls.contains("rated-6")) return 6;
  if (cls.contains("rated-7")) return 7;
  if (cls.contains("rated-8")) return 8;
  if (cls.contains("rated-9")) return 9;
  if (cls.contains("rated-10")) return 10;
  return 0;
}

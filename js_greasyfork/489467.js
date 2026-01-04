// ==UserScript==
// @name     RateYourMusic - No Negative Reviews
// @description Hides reviews with under a certain amount of stars.
// @version  1.0.0
// @grant    none
// @namespace   petracoding
// @include  https://rateyourmusic.com/*
// @include  http://rateyourmusic.com/*
// @downloadURL https://update.greasyfork.org/scripts/489467/RateYourMusic%20-%20No%20Negative%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/489467/RateYourMusic%20-%20No%20Negative%20Reviews.meta.js
// ==/UserScript==

// OPTIONS:
const minRatingToShow = 6; // in half stars. 1 full star = 2. 5 full stars = 10. Example: minRating = 6 means at least 3 stars
const alsoHideBadCatalogLines = true;
// Bonus:
const hideRatingCompletelyWhenBad = true;
const hideListsWhenBad = true;
const hideCommentsWhenBad = true;
const hideDiscussionWhenBad = true;

// SCRIPT:

addEventListener("DOMContentLoaded", () => {
  hideReviews();

  [...document.querySelectorAll("[onclick]")].forEach((onC) => {
    onC.addEventListener("click", () => {
      setTimeout(() => {
        hideReviews();
      }, 500);
      setTimeout(() => {
        hideReviews();
      }, 1000);
    });
  });

  if (hideRatingCompletelyWhenBad || hideListsWhenBad || hideCommentsWhenBad) {
    const avgRatingEl = document.querySelector(".section_main_info .avg_rating");
    if (avgRatingEl) {
      const rating = parseInt(avgRatingEl.innerHTML.trim());
      if (rating < minRatingToShow) {
        if (hideRatingCompletelyWhenBad) {
          avgRatingEl.innerHTML = "?";
          const ratingStatsEl = document.querySelector(".catalog_stats");
          if (ratingStatsEl) ratingStatsEl.style.display = "none";
        }
        if (hideListsWhenBad) {
          const listsEl = document.querySelector(".section_lists");
          if (listsEl) listsEl.style.display = "none";
        }
        if (hideCommentsWhenBad) {
          const commentsEl = document.querySelector(".section_comments");
          if (commentsEl) commentsEl.style.display = "none";
        }
        if (hideDiscussionWhenBad) {
          const discussionEl = document.querySelector(".page_object_section_discussion");
          if (discussionEl) discussionEl.style.display = "none";
        }
      }
    }
  }
});

function hideReviews() {
  const cssSelector = alsoHideBadCatalogLines ? ".section_reviews .review, .catalog_line" : ".section_reviews .review";
  const reviewElements = document.querySelectorAll(cssSelector);
  [...reviewElements].forEach((reviewEl) => {
    if (toHide(reviewEl)) {
      reviewEl.style.display = "none";
    }
  });
}

function toHide(reviewEl) {
  const ratingEl = reviewEl.querySelector(".review_rating img, .catalog_rating img");
  if (!ratingEl) return 99;
  const starAltText = ratingEl.getAttribute("alt");
  const rating = getRating(starAltText);
  if (rating < minRatingToShow) {
    return true;
  } else {
    return false;
  }
}

function getRating(text) {
  if (text.includes("0.5")) return 1;
  if (text.includes("1.0")) return 2;
  if (text.includes("1.5")) return 3;
  if (text.includes("2.0")) return 4;
  if (text.includes("2.5")) return 5;
  if (text.includes("3.0")) return 6;
  if (text.includes("3.5")) return 7;
  if (text.includes("4.0")) return 8;
  if (text.includes("4.5")) return 9;
  if (text.includes("5.0")) return 10;
  return 99;
}

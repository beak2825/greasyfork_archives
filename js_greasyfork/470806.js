// ==UserScript==
// @name        Goodreads - No Negative Reviews
// @version     2.0.0
// @author      petracoding
// @namespace   petracoding
// @grant       none
// @license     MIT
// @include  		https://www.goodreads.com/*
// @include  		http://www.goodreads.com/*
// @include  		https://goodreads.com/*
// @include  		http://goodreads.com/*
// @description Hides book reviews under a certain amount of stars
// @downloadURL https://update.greasyfork.org/scripts/470806/Goodreads%20-%20No%20Negative%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/470806/Goodreads%20-%20No%20Negative%20Reviews.meta.js
// ==/UserScript==


// SETTINGS:


/* *** Hiding Bad Reviews *** */

  // How many stars (at least) should a review have for it to be SHOWN? (Default: 3)
  const minRatingToShow = 3; 

  // Hide bad reviews of unread books?
  const hideReviewsOfUnreadBooks = true; // true or false

	// Hide your friends' reviews too?
	const hideReviewsOfFriends = true; // true or false

	// Hide reviews without a star rating?
	const hideReviewsWithoutStarRating = false; // true or false



/* *** Hiding Good Reviews *** */

  // Hide positive reviews of books you dislike?
  const hideGoodReviewsOfBooksIDislike = false; // true or false

  // How many stars (at most) do you give books you dislike?
  const maxRatingOfBooksIDislike = 2;



/* *** Misc. Options: *** */

  // Hide the "Community Reviews" overview?
  const hideReviewOverview = false; // true or false

  // Hide images in reviews?
  const hideImagesInReviews = false; // true or false








// DO NOT CHANGE ANYTHING BELOW HERE.

const wrapper = document.querySelector(".ReviewsList");
let hideGoodReviewsInstead = false;

if (wrapper) {
  const isBookRead = checkIfBookIsRead();
	if (!hideReviewsOfUnreadBooks && !isBookRead) return;
  
  const isDisliked = checkIfBookIsDisliked();
	if (hideGoodReviewsOfBooksIDislike && isDisliked) {
   	 hideGoodReviewsInstead = true;
  }
  
  addCSS();
  searchForReviews();
  
  if (hideReviewOverview) {
   	 doHideReviewOverview();
  }

  setTimeout(() => {
    searchForReviews();
    document.addEventListener("scroll", searchForReviews);
  }, 1000);
}

function addCSS() {
  var styleSheet = document.createElement("style");
  styleSheet.setAttribute("type", "text/css");
  document.head.appendChild(styleSheet);
  styleSheet.innerText = `.no-negative-reviews-hidden { height: 0 !important; overflow: hidden; }` + (hideImagesInReviews ? `.ReviewText__content .gr-hostedUserImg { display: none !important; }` : ``);
}



// Functionality:


function searchForReviews() {
  const reviewElements = document.querySelectorAll(".ReviewCard:not(.no-negative-reviews-done)");
  
  if (reviewElements.length > 0) {
    hideReviews(reviewElements);
  }
  
  if (hideReviewsOfFriends) {
   	doHideReviewsOfFriends();
  }
}


function hideReviews(reviewEls) {
  [...reviewEls].forEach((reviewEl) => {
    if (shouldReviewBeHidden(reviewEl)) {
      reviewEl.classList.add("no-negative-reviews-hidden");
    }
    reviewEl.classList.add("no-negative-reviews-done");
  });
  reviewCount = 0;
  searchForReviews();
}


function doHideReviewOverview() {
 	const overviewEl = document.querySelector(".ReviewsSectionStatistics");
  if (overviewEl) {
    overviewEl.style.display = "none";
  }
}


function doHideReviewsOfFriends() {
  const friendReviews = document.querySelectorAll(".ShelvingSocialSignalCard");
  [...friendReviews].forEach(reviewEl => {
    if (shouldReviewBeHidden(reviewEl))  {
      reviewEl.style.display = "none";
    }
  });
}




// Helpers:


function shouldReviewBeHidden(reviewEl) {
  if (!reviewEl) return false;
  
  // do not hide liked reviews
  const isLiked = reviewEl.querySelector(".SocialFooter__action .Button--active");
  if (isLiked) return false;
  
  // (don't) hide reviews form friends
  if (!hideReviewsOfFriends) {
   	const isByFriend =  reviewEl.querySelector('.FollowButton [aria-label*="Friends"]');
    if (isByFriend) return false;
  }
  
  // (don't) hide reviews without star rating
  const ratingWrapper = reviewEl.querySelector(".RatingStars");
  if (!ratingWrapper) {
   	return hideReviewsWithoutStarRating; 
  }
  
  const rating = ratingWrapper.querySelectorAll(".RatingStar__fill:first-child").length;
  
  if (hideGoodReviewsInstead) {
    if (rating > maxRatingOfBooksIDislike) {
      return true;
    } else {
      return false;
    }
  } else {
    if (rating < minRatingToShow) {
      return true;
    } else {
      return false;
    }
  }
}

function checkIfBookIsRead() {
  const el1 = document.querySelector(".BookActions");
  if (!el1) return false;
  const el2 = el1.querySelector(".BookActions__button:first-child");
  if (!el2) return false;
  const el3 = el2.querySelector(".Button");
  if (!el3) return false;
  const label = el3.getAttribute("aria-label").replace("Shelved as '", "").replace("'. Tap to edit shelf for this book", "").toLowerCase();
  if (label == 'read' || label == 'currently reading') {
   return true; 
  }
  return false;
}

function checkIfBookIsDisliked() {
  const el1 = document.querySelector(".BookActions");
  if (!el1) return false;
  const ratingWrapper = el1.querySelector(".BookRatingStars");
  if (!ratingWrapper) return false;
  const rating  = ratingWrapper.querySelectorAll(".RatingStar__fill--selectable:first-child").length;
  if (rating == 0) {
    return false;
  }
  if (rating <= maxRatingOfBooksIDislike) {
   return true; 
  }
  return false;
}
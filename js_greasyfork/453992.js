// ==UserScript==
// @name        Goodreads Bookpage
// @description This UserScript aims to bring a better experience to the new Goodreads Bookpage by resizing and repositioning the elements on the page. Based on tripu's Wider Goodreads.
// @namespace   https://greasyfork.org/en/scripts/453992-goodreads-bookpage
// @version     0.7
// @match       https://goodreads.com/*book/*
// @match       https://www.goodreads.com/*book/*
// @license     MIT
// @supportURL  -
// @author      Estherflails
// @downloadURL https://update.greasyfork.org/scripts/453992/Goodreads%20Bookpage.user.js
// @updateURL https://update.greasyfork.org/scripts/453992/Goodreads%20Bookpage.meta.js
// ==/UserScript==

console.debug('[Goodreads Bookpage] Start');

(() => {
    'use strict';
    if (document && document.getElementsByTagName && document.createElement) {
        var head = document.getElementsByTagName('head');
        if (head && 1 === head.length) {
            const style = document.createElement('style');
            head = head[0];
            style.innerText = `
:root {
--color-background-body-base: #e3dedd;
}
.BookPage__gridContainer {
  margin-right: 2;
}


.BookPage__leftColumn {
  transform:translate(-30%, 0%);
}
.Sticky {
  top: 1rem !important;
  position: relative !important;
}
.BookPage .BookPage__bookCover {
  width: 70%;
}
.BookActions {
  width: 70%;
}
.Button--medium {
  height: 3rem;
  font-size: 90%;
}


.BookPage__rightColumn {
  position: relative;
  overflow: visible;
  margin-left: 0;
  transform:translate(-10%, 0%);
}
.BookPage__mainContent {
  width:55%;
}
.Text__title1 {
  font-size: 2rem;
  line-height: 3rem;
}
.Text__title3 {
  font-size: 1.7rem;
  line-height: 2.8rem;
}
.BookPageMetadataSection__contributor {
  margin: 0rem 0;
}
.RatingStars {
  width: 90%;
  transform:translate(0%, 6%);
}
.TruncatedContent__text--large {
  width: 130%;
}
.BookPageMetadataSection__ratingStats {
  margin-bottom: 0rem;
}
.RatingStatistics__rating {
  font-size: 2rem;
}
.Divider--largeMargin {
  margin: 1rem 0;
}


.BookPage__reviewsSection {
  transform:translate(-34%, 0%);
  width:80%;
}
.ReviewsSection__header {
  transform:translate(+34%, 0%);
}

.Text__title2 {
  font-size: 1.7rem;
}
.MyReviewCardCarousel__header {
  margin-bottom: 1rem;
}
.MyReviewCard__content {
  padding-bottom: 0rem;
}
.MyReviewCardCarousel {
  margin-top: 0rem;
}
.WriteReviewCTA__hero {
  width: 70%;
  margin-bottom: 0rem;
}
.WriteReviewCTA__message--leftAligned {
  font-size:1.6rem;
}
.MyReviewCard__row {
  justify-content: left;
}
.Button--large {
  height: 3rem;
  padding: 0 3.2rem;
  font-size: 1.7rem;
}
.MyReviewCard__tags {
  padding-bottom: 0rem;
}

.WriteReviewCTA {
  padding: 0rem 0;
}
.WriteReviewCTA__message {
  font-size: 1.6rem;
}


.ReviewsSection__listHeader {
  margin: 1rem 0;
}
.ReviewsList__listHeader {
  margin: 1rem 0;
}
.Alert--informational {
  padding: 10px;
  width: 130%;
}
.ReviewsSectionStatistics__histogram {
  width: 50%;
}
.RatingsHistogram__container {
  border-radius: 1rem;
  padding: 1rem 1rem;
}
.ReviewFilters__filterControl {
  width: 100%;
}


.ReviewsList {
  width: 80%
}
.TruncatedContent__gradientOverlay {
  width: 130%;
}


.BookPage__relatedTopContent {
  width: 45%;
  position: absolute;
  top: 1rem;
  left: 63%;
}
.DynamicCarousel__innerContainer {
  width: 100% !important;
}
.BookCard__title {
  font-size: 1.3rem;
}
.BookCard__authorName {
  font-size: 1.3rem;
}
.AverageRating__ratingsCount {
  transform:translate(-100%, 80%);
}
.DynamicCarousel__itemsArea {
  padding: 1rem 0 1rem 1.2rem;
  margin-bottom: 1rem;
  margin-left: -1.2rem;
}
.DynamicCarousel__item {
  margin-right: 2rem;
  max-width:8rem;
}


.BookDetails {
  width: 33%;
  position: absolute;
  top: 150rem;
  left: 63%;
}
.MoreInformation__statistics {
  margin: 1rem 0;
}


.BookDiscussions__list {
  padding-top: 1rem;
  width:60%;
}
.DiscussionCard__icon {
  width: clamp(3rem, 6vw, 6rem);
  height: clamp(3rem, 6vw, 6rem);
}
.DiscussionCard__stats {
  font-size: clamp(2rem, 2vw, 2rem);
}


.BookPage__relatedBottomContent {
  width: 35%;
  position: absolute;
  top: 50rem;
  left: 65%;
}
.CollectionCard__card {
  height: 10rem;
}
.Text__h3 {
  font-size: 1.2rem;
}
.CollectionCard__bookCover {
  min-width: 2.2rem;
  margin-right: 0.5rem;
}
            `;
            head.appendChild(style);
            console.debug('[Goodreads Bookpage] ✓ Done');
        } else {
            console.debug('[Goodreads Bookpage] ✗ No head');
        }
    } else {
        console.debug('[Goodreads Bookpage] ✗ No document');
    }
})();

console.debug('[Goodreads Bookpage] End');

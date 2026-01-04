// ==UserScript==
// @name     IMDb Page Cleaner
// @version  1.0.1
// @author   Devin
// @description  Remove unnecessary information from IMDb & rearrange the layout
// @grant    none
// @match    https://www.imdb.com/title/tt*
// @namespace CosmicTowel42
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/444255/IMDb%20Page%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/444255/IMDb%20Page%20Cleaner.meta.js
// ==/UserScript==

'use strict';

function removeNode(node) {
  if (Array.isArray(node)) {
    node.forEach(n => removeNode(n));
  } else if (node) {
    try {
      node.remove();
    } catch (e) {
      console.warn('IMDb Page Cleaner: attempt to remove node failed.');
    }
  }
}

function removeSections() {
  const boxOffice = document.querySelectorAll("[data-testid='BoxOffice']")[0];
  const news = document.querySelectorAll("[data-testid='News']")[0];
  const contribution = document.querySelectorAll("[data-testid='contribution']")[0];
  const techSpec = document.querySelectorAll("[data-testid='TechSpecs']")[0];
  const popularity = document.querySelectorAll("[data-testid='hero-rating-bar__popularity']")[0];
  const rightPane = document.querySelector('div.sc-f2e21260-0.cSzXBj.ipc-page-grid__item.ipc-page-grid__item--span-1');
  const headerWatchOptions = document.querySelector('div.sc-10602b09-5.kBrxsq');
  const editorial = [...document.querySelectorAll("[data-testid='main-column-editorial-single']")]; // can be many such sections
  const tvEpisodeHighlight = document.querySelectorAll("[data-testid='DynamicFeature_Episodes']")[0]; // only for tv shows
  const proLink = document.getElementById('ProUpsellLink'); // imdb pro link in the header
  let suggestionsWatchOptions = [];  // section: More Like This
  try{
    suggestionsWatchOptions = [...document.querySelectorAll("[data-testid='MoreLikeThis']")[0].getElementsByClassName('ipc-poster-card__actions')];
  } catch(e) {
    console.log('IMDb Page Cleaner: "More like this" section not found. Nothing to worry.');
  }

  // makse sure to add nodes to this array
  const nodesToRemove = [boxOffice, news, contribution, techSpec, rightPane, editorial, tvEpisodeHighlight, headerWatchOptions, proLink, popularity, suggestionsWatchOptions];
  nodesToRemove.forEach(node => removeNode(node));
}

function modifyLayout() {
  const userReviews = document.querySelectorAll("[data-testid='UserReviews']")[0];
  const video = document.querySelectorAll("[data-testid='videos-section']")[0];
  const photos = document.querySelectorAll("[data-testid='Photos']")[0];
  const cast = document.querySelectorAll("[data-testid='title-cast']")[0];

  // Change:  move user review just below the header
  if (userReviews) {
    // node before which to insert the user reviews
    const parentNode = video || photos || cast;
    if (!parentNode) {
      console.warn('GM script: no video or photo or cast section found. Exiting.');
      return;
    }

    userReviews.remove();
    parentNode.before(userReviews);
  
    // expand user review
    userReviews.getElementsByClassName('ipc-overflowText-overlay')[0].click();
  }

  // Change:  rearrange videos and photos sections. Place them below cast section
  if (video) {
    video.remove();
    cast.after(video);
  }
  if (photos) {
    photos.remove();
    cast.after(photos);
  }
}

function changeReviewUrl(){
  const userReviews = document.querySelectorAll("[data-testid='UserReviews']")[0];
  const currentUrl = userReviews.getElementsByClassName('ipc-title-link-wrapper')[0];
  const modifiedUrl = currentUrl.href.split('reviews?')[0] + 'reviews?sort=reviewVolume&dir=desc&ratingFilter=0';
  currentUrl.href = modifiedUrl; 
  
}

(() => {
  modifyLayout();
  removeSections();
  changeReviewUrl();
})();


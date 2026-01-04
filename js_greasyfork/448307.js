// ==UserScript==
// @name         Link ratings to ads
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Turn article numbers into links to the corresponding listing on the Ricardo.ch user's evaluations page.
// @author       Coaxial
// @match        https://www.ricardo.ch/*/shop/*/ratings*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ricardo.ch
// @grant        none
// @homepage     https://github.com/coaxial/tampermonkey-scripts
// @downloadURL https://update.greasyfork.org/scripts/448307/Link%20ratings%20to%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/448307/Link%20ratings%20to%20ads.meta.js
// ==/UserScript==

"use strict";

// This script turns article numbers on the reviews page into links to the
// actual listings.
// It works by waiting for the reviews and dates to load, then looking for the
// elements containing the article numbers, and adding anchors to the article
// numbers.
// The script needs to accomodate two scenarios:
// - when the user first accesses the review page
// - when the user is on the review pages and uses the paginator to see the
//   next chunk of reviews
//
// First access to the review page:
// In this scenario, the webapp typically loads the reviews along with the page
// but without the review dates. Dates are added separately a little later,
// except when they're loaded with the rest of the page with no delay.
// For some reason I can't understand, loading the dates sometimes removes and
// recreates the article number element for each review... So we need to wait
// for the dates to have loaded and for the article number elements to have
// been removed and added again before we can transform them.
// Whether the dates are loaded later or instantly is random, so the script
// needs to accomodate both possibilities.
// To detect the async adding of dates to the page, we observe
// `reviewsDateContainer` for mutations. When the date loads, a `p` element
// will be added to the div. This is our cue for enhancing the article number
// through the mutation handler `dateLoadedHandler`.
// In case the dates were loaded with the page, the MutationObserver will not
// trigger and the handler won't run. As such, we also need to check if the
// dates are already present. If they are, we add the links right away and
// disconnect the `datesLoadObserver` as it isn't needed anymore.
//
// Flipping through review pages:
// Once the page has loaded, the user can flip through review pages using the
// paginator at the bottom.
// From empirical testing, it appears that the dates are instantly shown when
// flipping through pages (probably because they all get loaded in the
// browser's memory but only displayed in chunks?)
// In this case, we observe the `reviewsRootContainer` for nodes added as this
// will occur when a new reviews chunk is displayed.
// Once the new chunk is loaded, we can transform the article numbers again.
//
// CSS is hard:
// For some unexplained reason, the elements containing the review dates are
// set with margin and padding that cancel each other out visually but causes
// an issue where the date element overlaps the article number. This makes the
// article number impossible to click because it comes before the date element
// in the DOM and is therefore below the date element's padding. That is the
// purpose for the `fixCSS` function, which runs after the date elements are
// loaded.

// Find all elements containing the reviews' dates.
const dateElements = () => {
  // Array.prototype.join only inserts between elements but doesn't prepend.
  const dateElClasses = `.${["jss89", "jss119", "jss99"].join(".")}`;

  return [...document.querySelectorAll(dateElClasses)];
};

// Find all elements containing the reviews' article number.
const articleNumberElements = () => {
  // reviews are within `p` elements, but not all `p` are reviews.
  return [...document.querySelectorAll("p")].filter((e) =>
    new RegExp("(N° d'article|Art.-Nr.|No.-art.) [0-9]+", "g").test(e.innerText)
  );
};

// Fix margins and padding so the article numbers are clickable.
// NOTE: elements should be dates, not article numbers.
const fixCSS = (elements) => {
  // Remove useless negative margins so that the item number isn't covered by
  // another element and is clickable.
  elements.forEach((el) => {
    el.parentElement.style["padding-top"] = 0;
    el.parentElement.style["padding-left"] = 0;
    el.parentElement.parentElement.style["margin-top"] = 0;
    el.parentElement.parentElement.style["margin-left"] = 0;
  });
};

// Add links to the given articleNumElements
const addLinks = (articleNumElements) => {
  articleNumElements.forEach((el) => {
    // Match current page language to link to the item in the corresponding
    // language.
    // The language is embedded in the current page's URL.
    const lang = location.toString().match(/(fr|de|it|en)/)[0];
    const artNum = el.innerText.match(/[0-9]+/g);
    const anchor = document.createElement("a");
    anchor.href = `/${lang}/a/${artNum}/`;
    anchor.innerText = artNum;
    el.innerText = el.innerText.replace(artNum, "");
    el.insertAdjacentElement("beforeEnd", anchor);
  });
};

// Use this element to detect page changes, when the user clicks the paginator.
const reviewsRootContainer = () => {
  const classes = [
    "MuiPaper-root",
    "MuiPaper-elevation",
    "MuiPaper-rounded",
    "MuiPaper-elevation1",
    "MuiCard-root",
    "MuiGrid-root",
    "MuiGrid-item",
  ];
  return document.querySelector(`.${classes.join(".")}`).parentElement
    .parentElement;
};

// Use this element to find the reviews *when the page is first loaded*, and
// the dates are added (which occurs after the reviews are displayed).
// Once the page is loaded and the user pages through the reviews table, we'll
// use another element to detect page changes.
const reviewsDateContainer = document.querySelector(
  "[data-testid=ratings] hr"
).parentElement;

// This runs when the page is first loaded and the dates have arrived.
const dateLoadedHandler = (mutationList, observer) => {
  // Just to be sure this didn't trigger but the dates haven't been populated
  // for some reason.
  if (dateElements().length > 0) {
    addLinks(articleNumberElements());
    fixCSS(dateElements());
    // This observer is only useful for the initial page load. After that, we
    // can detect when the user pages through the reviews.
    // Disconnect this observer to avoid duplicate triggers (the page change
    // observer will also trigger then.)
    observer.disconnect();
  }
};

// This runs when the user pages through the reviews using the paginator below
// the reviews.
const paginatorHandler = (mutationList, observer) => {
  // When changing pages, the reviews are all removed first. Then the next page
  // of reviews is added.
  // Only run when the next page of reviews is added since there is nothing to
  // do when they're removed anyway.
  const mutationAddedNewReviews = mutationList[0].addedNodes.length > 0;

  if (mutationAddedNewReviews) {
    addLinks(articleNumberElements());
    fixCSS(dateElements());
  }
};

const datesLoadObserver = new MutationObserver(dateLoadedHandler);
const paginatorObserver = new MutationObserver(paginatorHandler);
datesLoadObserver.observe(reviewsDateContainer, {
  childList: true,
  subtree: true,
});
paginatorObserver.observe(reviewsRootContainer(), {
  childList: true,
});

// In case dates were populated right away, without triggering the observer.
const checkForEarlyDates = () => {
  if (dateElements().length > 0) {
    // We don't need to wait for dates, they're already here. This also avoids
    // triggering the callback when paging through the reviews and adding the
    // links.
    datesLoadObserver.disconnect();
    addLinks(articleNumberElements());
    fixCSS(dateElements());
  }
};

checkForEarlyDates();

// ==UserScript==
// @name         glassdoor-paywall-free
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Remove annoying paywall from glassdoor :)
// @author       https://github.com/KamilKoso
// @match        https://www.glassdoor.com/*
// @icon         https://www.google.com/s2/favicons?domain=glassdoor.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493084/glassdoor-paywall-free.user.js
// @updateURL https://update.greasyfork.org/scripts/493084/glassdoor-paywall-free.meta.js
// ==/UserScript==

const observer = new MutationObserver(clearPage);

// add here elements that should be removed
const elementsToClear = ["div#HardsellOverlay", "div.ModalContainer", "div#LoginModal", "div.review-details_showMoreButton__x_JZx"];

// add here elements that has display: none on them but shouldn't
const elementsToDisplay = ["div#EmpLinksWrapper"];

function clearPage() {
  let elemsToClear = document.querySelectorAll(elementsToClear);
  elemsToClear.forEach((elem) => {
    elem.remove();
  });

  let elemsToShow = document.querySelectorAll(elementsToDisplay);
  elemsToShow.forEach((elem) => {
    elem.setAttribute("style", "display: initial !important;");
  });

  unwrapReviews();
  fixScroll();
}

function fixScroll() {
  document.body.style.overflow = null;
  document.body.style.position = null;
}

function unwrapReviews() {
  let collapsedElementClass = "review-details_isCollapsed__5mhq_";
  let elems = document.querySelectorAll(`.${collapsedElementClass}`);
  elems.forEach((elem) => {
    elem.classList.remove(collapsedElementClass);
  });
}

(function () {
  observer.observe(document.body, { subtree: true, childList: true });
})();

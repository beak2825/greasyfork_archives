// ==UserScript==
// @name         Fix Pagination Arrows
// @namespace    pamasich-kbin
// @version      1.0
// @description  Fixes the pagination arrows (previous/next page) not behaving correctly in some views.
// @author       Pamasich
// @match        https://kbin.social/*
// @match        https://kbin.earth/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491709/Fix%20Pagination%20Arrows.user.js
// @updateURL https://update.greasyfork.org/scripts/491709/Fix%20Pagination%20Arrows.meta.js
// ==/UserScript==
 
/*
    This script fixes an issue where the pagination arrows (which can be clicked to go to the 
    next/previous page) don't behave correctly in some views. This issue has been observed on
    profiles and the All Content view, but this script fixes it anywhere else it might occur too.

    The issue that happens in those views is that both arrows always behave as if they're on the
    first page. The previous page arrow will always be disabled, while the next page arrow always
    points to page 2.
*/

function setup () {
    /** @type {HTMLElement} */
    const leftArrow = document.querySelector(`span.pagination__item--previous-page`);
    /** @type {HTMLElement} */
    const rightArrow = document.querySelector("a.pagination__item--next-page");
    /** @type {Number} */
    const currentPage = Number(window.location.search?.slice(3)) ?? 1;
    
    // everything is correct for the first page, so no need to change anything there
    if (currentPage > 1) {
        // The left arrow query specifically looks for an uninteractable one. If it is found
        // past page 1, that means it needs to be fixed. There's no other conditions needed.
        if (leftArrow) {
            leftArrow.style.display = "none";
            leftArrow.before(createClickable(leftArrow, currentPage-1, "prev"));
        }
        if (rightArrow && isNextPageWrong(rightArrow, currentPage)) {
            if (isThisLastPage(rightArrow, currentPage)) {
                disable(rightArrow);
            } else {
                rightArrow.setAttribute("href", buildUrl(currentPage+1));
            }
        }
    }
}

/**
 * Disables an arrow, making it non-clickable.
 * @param {HTMLElement} elem
 */
function disable (elem) {
    elem.style.color = "var(--kbin-meta-text-color)";
    elem.style.fontWeight = "400";
    elem.classList.add("pagination__item--disabled");
    elem.removeAttribute("href");
}

/**
 * The left arrow remains uninteractable when this bug happens, regardless of page. This
 * function creates a clickable element to replace it with.
 * @param {HTMLElement} original
 * @param {Number} page What page the new interactable arrow should point to
 * @param {String} role The value for the rel attribute
 * @returns {HTMLElement}
 */
function createClickable (original, page, role) {
    const newElement = document.createElement("a");
    newElement.classList = original.classList;
    newElement.classList.remove("pagination__item--disabled");
    newElement.textContent = original.textContent;
    newElement.setAttribute("href", buildUrl(page));
    newElement.setAttribute("rel", role);
    return newElement;
}

/**
 * Checks whether the current page is the last one.
 * @returns {Boolean}
 */
function isThisLastPage (rightArrow, currentPage) {
    const lastPage = rightArrow.previousElementSibling.textContent;
    return lastPage == currentPage;
}

/**
 * Checks if the right arrow points to the correct page. Or rather, the wrong one.
 * @returns {Boolean}
 */
function isNextPageWrong (rightArrow, currentPage) {
    const actualUrl = rightArrow.getAttribute("href");
    const expectedUrl = buildUrl(currentPage+1);
    return actualUrl != expectedUrl;
}

/**
 * Constructs the correct full URL for one of the arrows.
 * @param {Number} page
 * @returns {String}
 */
function buildUrl (page) {
    return `${window.location.pathname}?p=${page}`;
}

setup();

const observer = new MutationObserver((mutations) => {
    // ensure the observer only triggers if the user navigated via turbo mode
    if (mutations.some((mutation) => Array.from(mutation.addedNodes).some((node) => node.nodeName == "BODY"))) setup();
});
// observing the entire document because of turbo mode
observer.observe(document, { childList: true, subtree: true });
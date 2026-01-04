// ==UserScript==
// @name         YouTube - Recommend certain Categories only on home page
// @namespace    http://tampermonkey.net/
// @version      1.0.11
// @description  Selects desired categories on Youtube Homepage and hides undesired ones. To minimise distraction and increase productivity.
// @author       lookjaklook
// @match        *://*.youtube.com
// @match        *://*.youtube.com/
// @match        *://*.youtube.com/?*
// @match        *://youtube.com
// @match        *://youtube.com/
// @match        *://youtube.com/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455248/YouTube%20-%20Recommend%20certain%20Categories%20only%20on%20home%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/455248/YouTube%20-%20Recommend%20certain%20Categories%20only%20on%20home%20page.meta.js
// ==/UserScript==

var categories = ['programming', 'development', 'computer science',
                  'electronic circuits', 'physics',
                  'mathematics', 'algorithms',
                  'python', 'c++']; // Here you can choose the categories you wish to see and to be chosen automatically

/*=== Main functionality that runs at start ===*/

main();

/*=== Main functionality functions ===*/
function main() {
    console.log('YOUTUBE_CATEGORIES: started');

    hideHomeRecommendedContent(true);
    removeAllIrrelevantCategoriesFromDom({runAgainAfterMillisec: 100});
    makeSureToSwitchCategoryFromDefaultToDesired({runAgainAfterMillisec: 1000});
}


function removeAllIrrelevantCategoriesFromDom({runAgainAfterMillisec, turnOffDebug}) {
    waitForElm('yt-chip-cloud-chip-renderer, ytm-chip-cloud-chip-renderer').then((domResult) => {
        const allCategoriesDomArr = domResult.multiple;
        const hiddenCategoryNames = [];

        allCategoriesDomArr.forEach((categoryDom) => {
            const categoryName = normalizeName(categoryDom.innerText);
            let isCategoryRelevant = false;

            categories.some((category) => {
                const relevantCategoryName = normalizeName(category);
                isCategoryRelevant = categoryName.includes(relevantCategoryName);

                return isCategoryRelevant;
            });

            categoryDom.style.display = (isCategoryRelevant ? '' : 'none');

            if (!isCategoryRelevant)
                hiddenCategoryNames.push(categoryName);
        });

        if (!turnOffDebug)
            console.log(`YOUTUBE_CATEGORIES: hidden categories: ${hiddenCategoryNames}`);

        if (runAgainAfterMillisec)
            setTimeout(function() {removeAllIrrelevantCategoriesFromDom({runAgainAfterMillisec: runAgainAfterMillisec, turnOffDebug: true})}, runAgainAfterMillisec);
    });
}


var isStartedCategorySwitch = false;
function makeSureToSwitchCategoryFromDefaultToDesired({runAgainAfterMillisec}) {
    waitForElm(getSelectedCategoryDomCssSelectorStr()).then((domResult) => {
        if (runAgainAfterMillisec)
            setTimeout(() =>
                       makeSureToSwitchCategoryFromDefaultToDesired({runAgainAfterMillisec: runAgainAfterMillisec}),
                       runAgainAfterMillisec);

        let isDefaultCategorySelected;
        const selectedCategoryDomArr = domResult.multiple;

        if (selectedCategoryDomArr.length < 1 || isStartedCategorySwitch)
            return;

        isDefaultCategorySelected = true;

        Array.from(selectedCategoryDomArr).some((selectedCategoryDom) => {
            const selectedCategoryName = normalizeName(selectedCategoryDom.innerText);
            isDefaultCategorySelected = (selectedCategoryName === 'all');

            return (!isDefaultCategorySelected);
        });

        if (!isDefaultCategorySelected)
            return;

        console.log('YOUTUBE_CATEGORIES: current category is "all", switching category');

        startCategorySwitch();
    })
}


var currSelectedCategory;
function startCategorySwitch() {
    if (isStartedCategorySwitch)
        return;

    currSelectedCategory = null;
    isStartedCategorySwitch = true;
    hideHomeRecommendedContent(true);
    selectRandomRecommendedCategoryUntilSucceed();
}


function selectRandomRecommendedCategoryUntilSucceed() {
    const categorySelectionInterval = setInterval(selectUnselectedCategory, 10)

    function selectUnselectedCategory() {
        if (currSelectedCategory && isSelectedCategoryNameMatches(currSelectedCategory))
            return;

        let desiredCategory;

        do {
            desiredCategory = normalizeName(categories.random());
        } while (isSelectedCategoryNameMatches(desiredCategory));

        if (isSelectedCategoryNameMatches(desiredCategory))
            return;

        currSelectedCategory = desiredCategory;
        const isDesiredCategorySelected = selectCategory(desiredCategory).isCategoryFoundAndClicked;

        if (!isDesiredCategorySelected) {
            currSelectedCategory = null;
            return;
        }

        const timeUntilOldCategoryContentIsReplacedByNew = 2000;
        setTimeout(() => hideHomeRecommendedContent(false), timeUntilOldCategoryContentIsReplacedByNew);
        isStartedCategorySwitch = false;
        clearInterval(categorySelectionInterval);
    }
}


function selectCategory(category) {
    const returnObject = {isCategoryFoundAndClicked: true};
    const xpathTextLowerCase = "translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')";
    const xpathCategoryForDesktop = '//yt-chip-cloud-chip-renderer[contains(' + xpathTextLowerCase + ', "' + category + '")]';
    const xpathCategoryForMobile = xpathCategoryForDesktop.replace('//yt-', '//ytm-');
    let categoryDom = getElementByXpath(xpathCategoryForDesktop);

    if (!categoryDom)
        categoryDom = getElementByXpath(xpathCategoryForMobile);

    if (categoryDom) {
        categoryDom.click();
        console.log(`YOUTUBE_CATEGORIES: clicked on desired category "${category}"`);
        returnObject.isCategoryFoundAndClicked = true;
    }
    else
        returnObject.isCategoryFoundAndClicked = false;

    return returnObject;
}

function isSelectedCategoryNameMatches(categoryName) {
    const selectedCategoryDomArr = getSelectedCategoryDomArr();

    selectedCategoryDomArr.forEach((selectedCategoryDom) => {
        const selectedCategoryName = normalizeName(selectedCategoryDom.innerText);

        if (selectedCategoryName.includes(categoryName))
            return true;
    });

    return false;
}

function hideHomeRecommendedContent(isHide) {
    waitForElm('ytd-two-column-browse-results-renderer #contents, .rich-grid-renderer-contents').then((domResult) => {
        const homeContentDom = domResult.single;

        homeContentDom.style.visibility = isHide ? 'hidden' : '';
    });
}

function getSelectedCategoryDomArr() {
    return document.querySelectorAll(getSelectedCategoryDomCssSelectorStr());
}

function getSelectedCategoryDomCssSelectorStr() {
    return 'yt-chip-cloud-chip-renderer.iron-selected, ytm-chip-cloud-chip-renderer.selected';
}

/*=== Extensions ===*/

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve({single: document.querySelector(selector), multiple: document.querySelectorAll(selector)});
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve({single: document.querySelector(selector), multiple: document.querySelectorAll(selector)});
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function normalizeName(text) {
    return text.toLowerCase().trim();
}

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}
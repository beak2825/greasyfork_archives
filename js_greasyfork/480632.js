// ==UserScript==
// @name     [BROKEN] Show Amazon Questions button + context menu
// @author   u/iNeedAProperAccount
// @description Creates a "Show questions" button for Amazon. Once clicked it opens a new tab of the questions.
//              It also creates an "Open Questions tab" context menu entry, which also when clicked opens a new tab of the questions.
//              Thanks to u/CaptSkinny, u/lilgeeky, u/Sanpete_in_Utah and u/TTum.
//              How it looks like:
//              https://i.imgur.com/mZSLDun.png
//              https://i.imgur.com/GHmUuEM.png
//              Original thread at: https://old.reddit.com/r/AmazonVine/comments/14aynxt/are_product_question_and_answer_sections_gone/
// @version  0.6
// @license  MIT
// @match    *://*.amazon.com/*
// @match    *://*.amazon.ca/*
// @match    *://*.amazon.com.mx/*
// @match    *://*.amazon.co.uk/*
// @match    *://*.amazon.fr/*
// @match    *://*.amazon.de/*
// @match    *://*.amazon.es/*
// @match    *://*.amazon.it/*
// @match    *://*.amazon.nl/*
// @match    *://*.amazon.se/*
// @match    *://*.amazon.pl/*
// @match    *://*.amazon.com.tr/*
// @match    *://*.amazon.ae/*
// @match    *://*.amazon.sa/*
// @match    *://*.amazon.co.jp/*
// @match    *://*.amazon.in/*
// @match    *://*.amazon.sg/*
// @match    *://*.amazon.com.au/*
// @match    *://*.amazon.com.br/*
// @icon     https://www.google.com/s2/favicons?sz=64&domain=amazon.ca
// @grant    GM_registerMenuCommand
// @namespace https://greasyfork.org/users/877912
// @downloadURL https://update.greasyfork.org/scripts/480632/%5BBROKEN%5D%20Show%20Amazon%20Questions%20button%20%2B%20context%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/480632/%5BBROKEN%5D%20Show%20Amazon%20Questions%20button%20%2B%20context%20menu.meta.js
// ==/UserScript==

const PRODUCT_TITLE_SELECTOR = "span#productTitle";
const REGEX_PATTERN = "^(http[s]?://[^/]+)/(?:.+?/)?(?:dp|gp/product|asin)/(?:.+?/)?([a-zA-Z0-9]{10})(?:[/?]|$)";

function getQuestionsUrl() {
    try {
        const url = document.URL;
        const regex = new RegExp(REGEX_PATTERN, "i");
        const matches = url.match(regex);

        if (matches) {
            const scheme_and_host = matches[1];
            const asin = matches[2];
            if (scheme_and_host && asin) {
                return `${scheme_and_host}/ask/questions/asin/${asin}`;
            }
        }
    } catch (error) {
        console.error("Error in getQuestionsUrl:", error);
    }
}

function contextOpenQuestionsTab() {
    try {
        const questions_url = getQuestionsUrl();
        if (questions_url) {
            window.open(questions_url, '_blank');
        }
    } catch (error) {
        console.error("Error in contextOpenQuestionsTab:", error);
    }
}

function openQuestionsTab() {
    try {
        const questions_url = getQuestionsUrl();

        if (questions_url) {
            const productTitle = document.querySelector(PRODUCT_TITLE_SELECTOR);

            if (productTitle) {
                const button = document.createElement("button");
                button.innerHTML = "Show Questions";
                button.style.margin = '0.2rem 0.2rem 0.2rem 0rem';
                button.style.fontSize = '0.9rem';
                button.addEventListener("click", function () {
                    window.open(questions_url, '_blank');
                });

                const brElement = document.createElement("br");
                productTitle.parentNode.insertBefore(brElement, productTitle.nextSibling);

                productTitle.parentNode.insertBefore(button, brElement.nextSibling);

                const brAfter = document.createElement("br");
                productTitle.parentNode.insertBefore(brAfter, button.nextSibling);

                GM_registerMenuCommand("Open Questions tab", contextOpenQuestionsTab, "a");
            }
        }
    } catch (error) {
        console.error("Error in openQuestionsTab:", error);
    }
}

const observer = new MutationObserver(function (mutations) {
    try {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const addedNode = mutation.addedNodes[i];
                    if (addedNode.nodeType === 1 && addedNode.matches && addedNode.matches(PRODUCT_TITLE_SELECTOR)) {
                        openQuestionsTab();
                        break;
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error in MutationObserver:", error);
    }
});

const observerConfig = {
    childList: true,
    subtree: true
};

try {
    observer.observe(document.body, observerConfig);
    openQuestionsTab();
} catch (error) {
    console.error("Error in script initialization:", error);
}
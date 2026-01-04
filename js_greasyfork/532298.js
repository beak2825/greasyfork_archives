// ==UserScript==
// @name         X/Twitter home timeline image only
// @version      0.1.0
// @description  X/Twitterのホームタイムラインに画像だけ表示する
// @author       Azuki
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @namespace    https://greasyfork.org/users/1441951
// @downloadURL https://update.greasyfork.org/scripts/532298/XTwitter%20home%20timeline%20image%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/532298/XTwitter%20home%20timeline%20image%20only.meta.js
// ==/UserScript==
/*jshint esversion: 11 */

(function() {
    'use strict';

    const initialCSS = `
        [data-testid="cellInnerDiv"] {
            visibility: hidden;
        }
    `;
    const styleElem = document.createElement('style');
    styleElem.textContent = initialCSS;
    document.head.appendChild(styleElem);

    function filterTweetCell(cell) {

        if (cell.querySelector('div > div > button[role="button"].css-175oi2r.r-1777fci.r-1pl7oy7.r-13qz1uu.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l')) {
            cell.style.visibility = "visible";
            cell.style.display = "";
            return true;
        }

        const images = cell.querySelectorAll("img[src^='https://pbs.twimg.com/media/']");
        const isTweetPhoto = (img) => img.parentElement && img.parentElement.dataset.testid === 'tweetPhoto';

        const validImages = Array.from(images)
            .filter(img => (
                !img.closest("div[tabindex='0'][role='link']") &&
                !img.closest("div[data-testid='previewInterstitial']") &&
                isTweetPhoto(img)
            ));

        if (validImages.length > 0) {
            cell.style.visibility = "visible";
            cell.style.display = "";

            const tweetTextElement = cell.querySelector('div[data-testid="tweetText"]');
            if (tweetTextElement) {
                tweetTextElement.style.display = 'none';
            }
            cell.dataset.processed = "true";
            return true;
        } else {
            cell.style.display = "none";
            return false;
        }
    }

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cell = entry.target;
                if (!cell.dataset.processed) {
                    const hasImage = filterTweetCell(cell);
                    if (hasImage) {
                        observer.unobserve(cell);
                    }
                }
            }
        });
    }, {
        root: null,
        rootMargin: "300px 0px 300px 0px",
        threshold: 0.1
    });

    function processTweets() {
        const tweetCells = document.querySelectorAll('[data-testid="cellInnerDiv"]');
        tweetCells.forEach(cell => {
            if (!cell.dataset.processed) {
                observer.observe(cell);
            }
        });
    }

    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === "attributes" && mutation.attributeName === "src") {
                const img = mutation.target;
                const cell = img.closest('[data-testid="cellInnerDiv"]');

                if (cell) {
                    filterTweetCell(cell);
                }
            }
        });
    });

    function observeImagesInCell(cell) {
        const images = cell.querySelectorAll('img');
        images.forEach(img => mutationObserver.observe(img, { attributes: true, attributeFilter: ['src'] }));
    }

    const tweetMutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches('[data-testid="cellInnerDiv"]')) {
                    observeImagesInCell(node);
                }
            });
        });
        setTimeout(processTweets, 200);
    });

    document.querySelectorAll('[data-testid="cellInnerDiv"]').forEach(observeImagesInCell);

    tweetMutationObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        setTimeout(processTweets, 500);
    });
    processTweets();

})();
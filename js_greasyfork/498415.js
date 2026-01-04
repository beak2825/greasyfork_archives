// ==UserScript==
// @name         Metacritic Style Ratings for RateYourMusic
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Converts album ratings on RateYourMusic to a Metacritic-style 0-100 scale
// @author       https://greasyfork.org/users/1320826-polachek
// @match        https://rateyourmusic.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498415/Metacritic%20Style%20Ratings%20for%20RateYourMusic.user.js
// @updateURL https://update.greasyfork.org/scripts/498415/Metacritic%20Style%20Ratings%20for%20RateYourMusic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertToPercent(rating) {
        return Math.round(rating * 20);
    }

    function getColorClass(rating) {
        if (rating <= 39) return 'red';
        if (rating <= 60) return 'orange';
        return 'green';
    }

    const styleMap = {
        '.track_rating_avg': { width: '20px', height: '20px', fontSize: '12px' },
        '.disco_avg_rating': { float: 'right', marginTop: '7px', marginLeft: '18px', marginRight: '22px' },
        '.newreleases_stat.newreleases_avg_rating_stat': { marginRight: '24px' },
        '.page_charts_section_charts_item_details_average_num': { width: '50px', height: '50px', fontSize: '25px', marginLeft: '13px', marginRight: '13px' },
        '.avg_rating': { width: '50px', height: '50px', fontSize: '25px' },
        '.page_features_secondary_metadata_rating_final': { width: '50px', height: '50px', fontSize: '25px' }
    };

    function processRatingElements() {
        const selectors = [
            '.avg_rating',
            '.avg_rating_friends',
            '.disco_avg_rating',
            '.page_features_secondary_metadata_rating_final',
            '.newreleases_stat.newreleases_avg_rating_stat',
            '.component_discography_item_details_average',
            '.page_charts_section_charts_item_details_average_num',
            '.track_rating_avg'
        ];

        selectors.forEach(selector => {
            const ratingElements = document.querySelectorAll(selector);

            ratingElements.forEach(el => {
                // Evita processar múltiplas vezes
                if (el.nextSibling && el.nextSibling.classList && el.nextSibling.classList.contains('color-square')) {
                    return;
                }

                const ratingValue = parseFloat(el.textContent.trim());
                if (!isNaN(ratingValue)) {
                    const convertedRating = convertToPercent(ratingValue);
                    const colorClass = getColorClass(convertedRating);

                    const colorSquare = document.createElement('div');
                    colorSquare.className = `color-square ${colorClass}`;
                    colorSquare.textContent = convertedRating;

                    const styles = styleMap[selector];
                    if (styles) {
                        Object.entries(styles).forEach(([prop, val]) => {
                            colorSquare.style[prop] = val;
                        });
                    }

                    el.parentNode.insertBefore(colorSquare, el.nextSibling);
                    el.style.display = 'none';
                }
            });
        });
    }

    GM_addStyle(`
        .color-square {
            width: 30px;
            height: 30px;
            padding: 2px 5px;
            border-radius: 3px;
            font-weight: bold;
            font-size: 16px;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 5px;
            margin-bottom: 5px;
        }
        .color-square.red {
            background-color: red;
        }
        .color-square.orange {
            background-color: orange;
        }
        .color-square.green {
            background-color: green;
        }
        .max_rating {
            display: none;
        }
    `);

    const observer = new MutationObserver(processRatingElements);

    processRatingElements();
    observer.observe(document.body, { childList: true, subtree: true });
})();
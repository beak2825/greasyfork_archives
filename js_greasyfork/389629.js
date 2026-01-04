// ==UserScript==
// @name         Netflix display IMDb ratings
// @namespace    driver8.net
// @version      0.2.1
// @description  Add a display of IMDb ratings below movie and show titles while browsing Netflix.
// @author       driver8, TeluguGameboy
// @match        *://*.netflix.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://greasyfork.org/scripts/390115-imdb-utility-library-api/code/IMDb%20Utility%20Library%20(API).js?version=733074
// @connect      omdbapi.com
// @connect      imdb.com
// @downloadURL https://update.greasyfork.org/scripts/389629/Netflix%20display%20IMDb%20ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/389629/Netflix%20display%20IMDb%20ratings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('hi netflix');

    const pending = new Set(),
          MAX_RESULT_AGE = 30;

    // Adds CSS which displays the score in a circular div.
    function addDiv(movieOrShowTitle, data) {
        // Makes sure that we only add the div once.
        if (document.getElementById(data.id)) return;

        const el = document.querySelector('.bob-title');
        if (el && el.textContent.trim() === movieOrShowTitle) {
            // Styling the div to be red, circluar, and have large white text.
            const div = document.createElement("div");
            div.classList.add('imdb-rating');
            div.dataset.title = movieOrShowTitle;
            div.textContent = data.rating;
            div.id = data.id;

            el.parentNode.insertBefore(div, el.nextSibling);
        }
    }

    // This function gets the data from imdb and calls the function to display it.
    function getIMDbScore(movieOrShowTitle) {
        var data = GM_getValue(movieOrShowTitle);

        let age_check = true;
        try {
            age_check = Date.now() - new Date(data.dateFetched).getTime() < MAX_RESULT_AGE * 24 * 60 * 60 * 1000; // Update data for results older than X days
        } catch (e) {
            age_check = false;
        }
        if (data instanceof Object && data.hasOwnProperty('rating') && age_check) {
            console.log('EXISTS', data);
            addDiv(movieOrShowTitle, data);
        } else if (pending.has(movieOrShowTitle)) {
            // Do nothing
            //console.log(movieOrShowTitle, 'pending');
        } else {
            console.log(movieOrShowTitle, 'starting');
            pending.add(movieOrShowTitle);

            // Use IMDb Utility Library function to get the data
            getImdbInfoFromTitle(movieOrShowTitle).then((data) => {
                console.log('got data', data);
                GM_setValue(movieOrShowTitle, data);
                addDiv(movieOrShowTitle, data);
            }).catch((err) => {
                console.log(`Error getting data for ${movieOrShowTitle}: ${err}`);
            });
        }
    }

    // Main code!
    // Allows extension to observe changes to the dom.
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    // Define an observer that looks for a specific change.
    var observer = new MutationObserver(function(mutations, observer) {
        let titleEl = document.querySelector('.bob-title');
        if (titleEl) {
            let movieOrShowTitle = titleEl.textContent.trim(),
                ratingDiv = document.querySelector('.imdb-rating');

            // If a div exists for this title, do nothing
            if (!(ratingDiv && ratingDiv.dataset.title && ratingDiv.dataset.title === movieOrShowTitle)) {
                // Display score by getting imdb score and adding to dom.
                getIMDbScore(movieOrShowTitle);
            }
        }
    });

    // Define what element should be observed by the observer and what types of mutations trigger the callback.
    var target = document; // document.querySelector(".mainView");
    observer.observe(target, {
        subtree: true,
        childList: true
    });

    GM_addStyle(
`
.imdb-rating {
width: 36px;
height: 28px;
line-height: 29px;
border-radius: 18%;
background: #f5c518;
color: black;
text-align: center;
font-size: 18px;
font-weight: bold;
`
    );

})();
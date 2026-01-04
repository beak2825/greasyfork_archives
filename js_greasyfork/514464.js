// ==UserScript==
// @name         Inoreader Article Sort By Popularity Button
// @version      20241028
// @description  Add a button to sort all articles by their popularity score in descending order.
// @author       jamesdeluk
// @match        https://www.inoreader.com/*
// @grant        none
// @namespace https://greasyfork.org/users/242246
// @downloadURL https://update.greasyfork.org/scripts/514464/Inoreader%20Article%20Sort%20By%20Popularity%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/514464/Inoreader%20Article%20Sort%20By%20Popularity%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parseScore(scoreText) {
        var score = 0;
        if (scoreText.includes('k')) {
            score = parseFloat(scoreText.replace('k', '')) * 1000;
        } else if (scoreText.includes('M')) {
            score = parseFloat(scoreText.replace('M', '')) * 1000000;
        } else {
            score = parseFloat(scoreText);
        }
        return score;
    }

    function sortArticlesByScore() {
        // Select the container that holds all article headers
        var articlesContainer = document.querySelector('#reader_pane'); // Adjust the selector if necessary

        if (!articlesContainer) return;

        // Select all article headers
        var articleHeaders = Array.from(articlesContainer.querySelectorAll('.ar'));

        // Sort the article headers by their popularity score in descending order
        articleHeaders.sort((a, b) => {
            var scoreA = parseScore(a.querySelector('.popularity_score_span')?.innerText || '0');
            var scoreB = parseScore(b.querySelector('.popularity_score_span')?.innerText || '0');
            return scoreB - scoreA;
        });

        // Remove all article headers from the container
        articleHeaders.forEach(header => articlesContainer.removeChild(header));

        // Append the sorted article headers back to the container
        articleHeaders.forEach(header => articlesContainer.appendChild(header));

        // Ensure #no_more_div is the last element
        ensureNoMoreDivLast();
    }

    function addSortButton() {
        const sortButton = document.createElement('button');
        sortButton.id = 'sb_rp_sort';
        sortButton.textContent = 'Sort';
        sortButton.className = 'btn btn-sm btn-outline-text';
        sortButton.title = 'Sort';

        // // Add click event to the sort button
        sortButton.addEventListener('click', sortArticlesByScore);

        return sortButton;

    }

    function ensureSortButton() {
        const toolbar = document.querySelector('.nav.nav-toolbar.mx-0.justify-content-end');
        if (toolbar && !document.getElementById('sb_rp_sort')) {
            const sortButton = addSortButton();
            const listItem = document.createElement('li');
            listItem.className = 'nav-item ml-2';
            listItem.appendChild(sortButton);
            toolbar.insertBefore(listItem, toolbar.children[1]);
        }
    }

    function ensureNoMoreDivLast() {
        var readerPane = document.getElementById('reader_pane');
        var noMoreDiv = document.getElementById('no_more_div');
        if (readerPane && noMoreDiv && noMoreDiv.nextSibling) {
            readerPane.appendChild(noMoreDiv);
        }
    }

    function init() {
        ensureSortButton();
        ensureNoMoreDivLast();

        // Use MutationObserver to ensure the button persists and #no_more_div stays last
        var observer = new MutationObserver(() => {
            ensureSortButton();
            ensureNoMoreDivLast();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Run the function to add the sort button and ensure #no_more_div is last on page load
    window.addEventListener('load', init);
})();

// ==UserScript==
// @name         Goodreads, show only the standalones in lists
// @version      0.2
// @description  Add a checkbox to Goodreads list pages that allows you to hide books that belong to series
// @author       anothershm
// @match        *://*.goodreads.com/review/list/*
// @grant       GM_setValue
// @grant       GM_getValue
// @license     MIT
// @namespace https://greasyfork.org/users/1206936
// @downloadURL https://update.greasyfork.org/scripts/478563/Goodreads%2C%20show%20only%20the%20standalones%20in%20lists.user.js
// @updateURL https://update.greasyfork.org/scripts/478563/Goodreads%2C%20show%20only%20the%20standalones%20in%20lists.meta.js
// ==/UserScript==

(function() {
'use strict';
    const createCheckbox = () => {
        var newDiv = document.createElement('div');
        newDiv.innerHTML = '<input type="checkbox" id="showCore" name="showcb"> <label for="showCore">Show only standalones</label>';
        newDiv.style.display = 'inline';
        newDiv.style.paddingLeft = '10px';
        return newDiv;
    };

    function showStandalone(show) {
        var allBooks = Array.from(document.querySelectorAll('.bookalike'));
        if (!show) {
            allBooks.forEach((el) => { el.hidden = false; });
        } else {
            var booksFromSeries = allBooks.filter((el) => {
                const pattern = /\(.*#(\d+)\)/; // Regular expression to match text with "#number" pattern
                return el.querySelector('.title').innerHTML.match(pattern)
            });
            if (booksFromSeries.length !== allBooks.length) {
                booksFromSeries.forEach((el) => { el.hidden = true; });
            }
        }
    }

    const init = () => {
        const newDiv = createCheckbox();
        document.querySelector('#controls').appendChild(newDiv);
        var cb = newDiv.firstChild;
        cb.checked = GM_getValue('gr_showStandalone', false);
        showStandalone(cb.checked);
        cb.addEventListener('change', (evt) => {
            showStandalone(cb.checked);
            GM_setValue('gr_showStandalone', cb.checked);
        });
   };

    init();
})();
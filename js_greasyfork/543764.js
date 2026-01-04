// ==UserScript==
// @name        Text Selection & Google Search
// @namespace   select_text_and_Google Search
// @version     1.0
// @description Displays a Google search button for selected text on the page.
// @author      hskrch
// @match       *://*/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/543764/Text%20Selection%20%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/543764/Text%20Selection%20%20Google%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createSearchButton() {
        const searchButton = document.createElement('div');
        searchButton.textContent = 'G';
        searchButton.style.cssText = `
            position: absolute;
            width: 30px;
            height: 30px;
            background-color: #5eb4ed;
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
            font-family: Arial, sans-serif;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
            z-index: 2147483647;
            display: none;
        `;
        document.body.appendChild(searchButton);
      return searchButton;
    }

    function showSearchButton(x, y) {
        searchButton.style.left = `${x + 25}px`;
        searchButton.style.top = `${y + 10}px`;
        searchButton.style.display = 'block';
    }

    function hideSearchButton() {
        searchButton.style.display = 'none';
    }

  	function searchWithGoogle(searchWord) {
        const encWord = encodeURIComponent(searchWord);
      	const url = 'https://www.google.com/search?q=' + encWord;
        window.open(url, '_blank');
    }

    const searchButton = createSearchButton();
    let searchWord = '';

    searchButton.addEventListener('click', () => {
        //console.log(`searchButton pressed. Word: ${searchWord}`);
        hideSearchButton();
        if (searchWord)
            searchWithGoogle(searchWord);
    });

    document.addEventListener('mouseup', (e) => {
        const selText = window.getSelection().toString();
        if (selText.length > 0 && e.target !== searchButton) {
        	  //console.log(`Text selected: ${selText}`);
            searchWord = selText;
            showSearchButton(e.pageX, e.pageY);
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (e.target !== searchButton)
            hideSearchButton();
    });

    document.addEventListener('scroll', () => {
        hideSearchButton();
    });
})();
// ==UserScript==
// @name         FR: Dragon Search
// @namespace    https://greasyfork.org/users/547396
// @description  Adds dragon search button to auction house to easily find the dragon(s) you are looking for
// @author       https://greasyfork.org/users/547396
// @match        *://*.flightrising.com/auction-house/buy/*/dragons?*
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @grant        none
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/425958/FR%3A%20Dragon%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/425958/FR%3A%20Dragon%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const parentContainer = document.getElementById('ah-content'),
          searchOptions = parentContainer.getElementsByClassName('ah-sep-container')[0],
          currentURL = window.location.href;

    appendButton();

    function appendButton() {
        const searchButton = document.createElement('a');

        searchButton.innerText = 'Dragon Search';
        searchButton.classList.add('anybutton');
        searchButton.classList.add('redbutton');
        searchButton.style.marginLeft = '50%';
        searchButton.href = parseParms( currentURL );
        searchOptions.appendChild(searchButton);
    }

    function parseParms( currentURL ) {
        const url = new URL(currentURL),
              searchPathname = '/search/dragons?',
              destination = url.origin + searchPathname,
              searchParams = new URLSearchParams(url.search);

        let newObj = {},
            newURLParams;

        for (const [currParam, paramVal] of searchParams.entries()) {
            let keyStr = currParam.replace('d_', '');
            keyStr = keyStr.replace('eye','eyetype');

            newObj[keyStr] = paramVal;
        }

        newURLParams = new URLSearchParams(newObj);
        newURLParams.append('sort','id_desc');
        newURLParams.append('progen','0');

        return destination + newURLParams;
    }

})();
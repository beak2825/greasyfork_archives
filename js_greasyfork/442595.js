// ==UserScript==
// @name         Neopets: Search Closet and Safety Deposit Box
// @author       https://greasyfork.org/users/547396
// @namespace    https://greasyfork.org/users/547396
// @description  Checking if you have something in your closet and/or sdb? Simply type the keyword in the search box to open up both and cut down your clicks.
// @match        *://*.neopets.com/*
// @grant        none
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/442595/Neopets%3A%20Search%20Closet%20and%20Safety%20Deposit%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/442595/Neopets%3A%20Search%20Closet%20and%20Safety%20Deposit%20Box.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const body = document.getElementsByClassName('container')[0]||document.getElementById('main'),
          searchBox = document.createElement('form'),
          searchHeading = document.createElement('form'),
          searchButton = document.createElement('button'),
          searchBar = document.createElement('input');

    searchBox.setAttribute('id','searchBox');
    searchBar.setAttribute('placeholder','wearable name');
    //searchButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20px" viewBox="0 0 512 512"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"/></svg>';
    searchButton.innerText = 'Search';

    searchBox.appendChild(searchBar);
    searchBox.appendChild(searchButton);
    body.appendChild(searchBox);

    searchButton.addEventListener('click', searchItems);

    function searchItems( e ) {
        e.preventDefault();
        let searchKey = searchBar.value;

        goToUrl('new', 'safetydeposit', searchKey);
        goToUrl('current', 'closet', searchKey);
    }

    function goToUrl(windowType, parm, val) {
        let siteOrigin = window.location.origin,
            buildUrl = `${siteOrigin}/${parm}.phtml?obj_name=${val}`;

        if ( windowType == 'new' ) {
            window.open(buildUrl, '_blank');
        } else {
            window.location.href = buildUrl;
        }
    }

    // styles
    var testStyles = `#searchBox { position: fixed; bottom: 2.5rem; right: 1.5rem; background: #28262d; padding: .75rem; border-radius: .5rem; z-index:999; font-family: 'Arial', sans-serif; }
    #searchBox input { width: auto; margin-right: 0.5rem; }
    #searchBox h4 { width: 130px; margin-right: 0.5rem; }
    #searchBox input, #searchBox button { line-height: 1.5rem; padding: .25rem .5rem; color: #111; }
    #searchBox button { background: #13b965;border: none;border-radius: 0.25rem;font-weight: bold;text-transform: uppercase;font-size: .75rem;padding: 0.35rem 0.5rem;letter-spacing: 0.5px; }
    `;


    const style = document.createElement( 'style' ),
          cssNode = document.createTextNode( testStyles );

        style.appendChild( cssNode );
        body.appendChild( style );



})();
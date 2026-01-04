// ==UserScript==
// @name         FlightRising Bond
// @author       https://greasyfork.org/en/users/547396
// @description  Auto bond with familiars
// @namespace    https://greasyfork.org/users/547396
// @match        https://www1.flightrising.com/dragon/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flightrising.com
// @grant        none
// @version      0.3
// @downloadURL https://update.greasyfork.org/scripts/452247/FlightRising%20Bond.user.js
// @updateURL https://update.greasyfork.org/scripts/452247/FlightRising%20Bond.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* settings */
    const enable = true,
          goNext = localStorage.getItem( 'ndbgo' ),
          myID = '499309', // your user id
          endTab = '1783304'; // tab you want the script to automatically stop at (ie. sales tabs)


    /* elements */
    const bondBtn = document.getElementById('dragon-profile-button-bond') || undefined,
          nextBtn = document.getElementById('dragon-profile-dragon-next') || undefined,
          breadcrumbs = document.getElementsByClassName('breadcrumbs')[0],
          lairType = breadcrumbs.getElementsByTagName('a')[1].innerText,
          lairTab = breadcrumbs.getElementsByTagName('a')[1].href.split('/')[4],
          stopTab = breadcrumbs.getElementsByTagName('a')[1].href.split('/')[5],
          runScript = (myID == lairTab && enable) ? renderMenu() : false;


    function renderMenu() {
        let startBtn = document.createElement('button'),
          stopBtn = document.createElement('button');

        breadcrumbs.appendChild(stopBtn);
        breadcrumbs.appendChild(startBtn);
        startBtn.innerText = 'Start';
        stopBtn.innerText = 'Stop';
        startBtn.classList.add('anybutton');
        startBtn.classList.add('redbutton');
        stopBtn.classList.add('anybutton');
        stopBtn.classList.add('redbutton');

        startBtn.addEventListener('click', startInit);
        stopBtn.addEventListener('click', stopIt);

        // styles
        const sheet = new CSSStyleSheet();
        sheet.replaceSync('.breadcrumbs button { float: right; margin-right: 1rem; padding: 5px 15px !important; }');
        document.adoptedStyleSheets = [sheet];

        // run script
        init();
    }

    function startInit() {
        localStorage.setItem( 'ndbgo', 'true' );

        // pass in trigger so page doesn't need to be refreshed
        let triggerNext = true;
        init( triggerNext );
    }

    function stopIt() {
        localStorage.setItem( 'ndbgo', 'false' );
    }

    function init( triggerNext ) {
        if(bondBtn) {
            bondBtn.click();
        }

        // auto stop at hibden or end tab
        if (lairType !== 'Lair' || stopTab == endTab) {
            console.log('stop');
            localStorage.setItem( 'ndbgo', 'false' );
        }

        if ((goNext == 'true' || triggerNext == true) && lairType == 'Lair') {
            // randomize next in seconds
            setTimeout( function() {
                nextBtn.click();
            }, getRndInteger(900, 1500));
        }


    };

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

})();
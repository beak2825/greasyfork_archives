// ==UserScript==
// @name         FR - AH - Dragon History Scraper
// @author       https://greasyfork.org/users/547396
// @namespace    https://greasyfork.org/users/547396
// @description  Grabs dragon information (name, id, selling price) from recent history > sold page
// @match        *://*.flightrising.com/auction-house/activity/history*
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @grant        none
// @version      0.2
// @downloadURL https://update.greasyfork.org/scripts/427264/FR%20-%20AH%20-%20Dragon%20History%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/427264/FR%20-%20AH%20-%20Dragon%20History%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const container = document.getElementById('ah-content'),
          sheetID = '11XNGTLYWCOqoDzjlpbFxB2BEMrF2dHAzibPQcGEB6sU'; // replace with your sheet id (/d/<sheet-id>/edit)

    init();

    // initialize
    function init() {
        appendStyles();
        createBar();
    }

    function createBar() {
        let dataBox = document.createElement('div'),
            dataClipboard = document.createElement('textarea'),
            copyBtn = document.createElement('button'),
            returnMessage = document.createElement('div'),
            dataTitle = document.createElement('strong'),
            sheetLink = document.createElement('a');

        dataTitle.innerText = 'Dragon Scraper';
        copyBtn.innerText = 'COPY';
        sheetLink.href = 'https://docs.google.com/spreadsheets/d/' + sheetID + '/edit';
        sheetLink.innerText = 'Sheet →';
        sheetLink.target = '_blank';
        dataBox.classList.add('dataBox');
        returnMessage.setAttribute('id', 'dataMessage');
        dataClipboard.setAttribute('id', 'dataClipboard');
        dataBox.appendChild(dataTitle);
        dataBox.appendChild(dataClipboard);
        dataBox.appendChild(returnMessage);
        dataBox.appendChild(copyBtn);
        dataBox.appendChild(sheetLink);
        container.appendChild(dataBox);

        dataClipboard.value = generateData();
        copyBtn.addEventListener('click', copyToClipboard);
    }

    function generateData() {
        const listings = container.querySelectorAll('.ah-listing-row'),
              dragonData = [];

         for ( let row of listings ) {

             if ( row.getAttribute('data-listing-dragonid') !== '' ) {
                 let dragonInfo = row.getElementsByClassName('ah-listing-itemname')[0].parentNode.innerText,
                     sellingInfo = row.getElementsByClassName('ah-listing-currency')[0],
                     sellingPrice = sellingInfo.getElementsByClassName('ah-listing-cost')[0].innerText,
                     currencyIcon = sellingInfo.getElementsByClassName('ah-listing-currency-icon')[0],
                     currencyName = currencyIcon.src.split('/').pop().split('icon_').pop().split('.')[0];

                 dragonData.push( dragonInfo + ' ' + sellingPrice + ' ' + currencyName );
             }
         }

        return dragonData.join('\n')
    }

    function copyToClipboard() {
        let dataInput = document.getElementById('dataClipboard');

        dataInput.select();
        dataInput.setSelectionRange(0, 99999); // ??
        document.execCommand('copy');

        success('Copied to clipboard');
    }

    function success( message ) {
        let success = document.getElementById('dataMessage');

        success.innerText = message;

        setTimeout( function() {
            success.innerText = '';
        }, 1000 );
    }

    function appendStyles() {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync('.dataBox {padding: 1rem; background: #b275ef; position: fixed; top: 0; left: 0; font-family:monospace;} #dataClipboard{display: block; width: 250px; height: 100px; font-size: 8pt; outline: none;} .dataBox a{color: #fff; padding: 5px 15px; margin-left: 1rem;}.dataBox a:hover,.dataBox a:focus{color:#000;}.dataBox button{background:#8052ae; border:none; outline:none; padding: 5px 15px; font-family:monospace; color: #fff; }.dataBox button:hover{background:#9059c7;} #dataMessage{line-height: 1; padding: 5px 0; font-size: 7pt; letter-spacing: 0.5px;} .dataBox strong{display: block; margin-bottom: 5px; font-size: 12pt;}');
    document.adoptedStyleSheets = [sheet];
    }

})();
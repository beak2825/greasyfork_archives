// ==UserScript==
// @name         new stylish scorrimento pagina successiva figuccio
// @namespace    https://greasyfork.org/users/237458
// @version      0.5
// @description  autoclick pagina successiva
// @author       figuccio
// @match        https://*userstyles.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=userstyles.org
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460869/new%20stylish%20scorrimento%20pagina%20successiva%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/460869/new%20stylish%20scorrimento%20pagina%20successiva%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = window.jQuery;
$(window).scroll(function() {
     if($(window).scrollTop() + $(window).height() == $(document).height()) {
 // Find the next page button using its data-stylish attribute
    var nextPageButton = document.querySelector('button[data-stylish="next-page-button"]');

    if (nextPageButton) {
        // Simulate a click on the next page button
        nextPageButton.click();

    }

 }

   });
     })();

/////////////////////////
GM_addStyle(`
    /*####----BROWSER SCROLL BAR----####*/
    ::-webkit-scrollbar {
        background:#303134!important;
        border-left: 1px solid #1A1A1A !important; width:17px!important;
    }
    ::-webkit-scrollbar-thumb {
        background-color:!important;
        border-radius:px!important;
        border:1px solid !important;
    }
    /* Pulsanti sotto freccine su e giu */
    ::-webkit-scrollbar-button {
        background-color:#777777;
    }
    /* Freccia nera sopra */
    ::-webkit-scrollbar-button:vertical:decrement {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgFDgo6IB/FRgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAc0lEQVQoz+XRoQ2DYBiE4YfUkEDqEfW1TNA5EFUdAM0aTNEpSKqwKAZogkJgmpDUgPkFqFa3py757r1PHP+jEgPqb4ELGizocf0EnHDHO0ALHjhvQ4eNT3BDgSPmcE8RoQ1lOyhHhRgjXpjCtwwdnr864go2lhOp4XYeZgAAAABJRU5ErkJggg==)!important;
        background-size: cover!important;
        background-repeat: no-repeat!important;
    }
    /* Freccia nera sotto */
    ::-webkit-scrollbar-button:vertical:increment {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgFDgUlKo/UfAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAaUlEQVQoz+XPsQmDUAAE0NfHFdI7gZ1kEmdI6Q6WTuEUQiZIl8o0CYGAvYUg3+aXitZ6zcFxx91xbOR44oMO78jfqGdLoQQVekwYEPBHictaW4pHNAeMaHDdmlngFUMtbnv/1fjh7iSYAfRHFgTlUa3mAAAAAElFTkSuQmCC)!important;
        background-size: cover!important;
        background-repeat: no-repeat!important;
    }
`);

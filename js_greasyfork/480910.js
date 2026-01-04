// ==UserScript==
// @name         GC - AIO Kad Link Sorted
// @namespace    https://greasyfork.org/en/users/1202961-13ulbasaur
// @version      0.1
// @description  Makes the link to the kadoatery in the AIO sidebar link to the sorted version.
// @author       Twiggies
// @match        https://www.grundos.cafe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/480910/GC%20-%20AIO%20Kad%20Link%20Sorted.user.js
// @updateURL https://update.greasyfork.org/scripts/480910/GC%20-%20AIO%20Kad%20Link%20Sorted.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Look for the kad button in the aio sidebar.
    const kadButton = document.querySelector('#aio_sidebar a[href="/games/kadoatery/"]')
    if (kadButton != undefined && kadButton != null) {
        //Change the url to the sorted version.
        kadButton.setAttribute('href','/games/kadoatery/?sort=True')
    }
})();
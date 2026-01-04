// ==UserScript==
// @name         Internet Archive Pdf Download Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  generate a button for borrowed Internet Archive books.
// @author       BA
// @match        https://archive.org/details/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447027/Internet%20Archive%20Pdf%20Download%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/447027/Internet%20Archive%20Pdf%20Download%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';


     window.addEventListener('load', () => {
    addButton('Download PDF', downloadAcsmFn)
    })

    function addButton(text, onclick, cssObj) {

        const button = document.createElement('button')
        const titleEl = document.getElementById("IABookReaderMessageWrapper");
        titleEl.appendChild(button)
        button.innerHTML = text;
        button.onclick = onclick;
        return button
    }

    function downloadAcsmFn() {

        const currentUrl = document.URL
        const urlPartRaw = [...currentUrl.match(/org\/details\/(.*)/)]
        if (urlPartRaw.length > 0) {
        const identifier = urlPartRaw[1].split("/")[0];
        const acsmUrl = "https://archive.org/services/loans/loan/?action=media_url&identifier=" + identifier + "&format=pdf&redirect=1";
        window.open(acsmUrl, '_blank');
        }

    }


})();
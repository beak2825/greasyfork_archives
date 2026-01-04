// ==UserScript==
// @name         Amazon eBook "Download & transfer via USB" easy device click
// @namespace    MKScripts
// @version      1.3
// @description  When downloading Amazon eBooks ("Content & Devices" -> "Books" -> "More actions" -> "Download & transfer via USB") you can now click in the whole box of the device instead of just the little radio button
// @author       MKScripts
// @grant        none
// @match        https://www.amazon.*/*
// @match        https://www.amazon.*/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.ca/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.co.jp/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.co.uk/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.com.au/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.com.br/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.com.mx/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.com/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.de/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.es/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.fr/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.in/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.it/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.nl/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.sa/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.se/hz/mycd/digital-console/contentlist/*
// @match        https://www.amazon.sg/hz/mycd/digital-console/contentlist/*
// @downloadURL https://update.greasyfork.org/scripts/486613/Amazon%20eBook%20%22Download%20%20transfer%20via%20USB%22%20easy%20device%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/486613/Amazon%20eBook%20%22Download%20%20transfer%20via%20USB%22%20easy%20device%20click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add click event listener to the document body for event delegation
    document.body.addEventListener('click', function (event) {
      // Check if the clicked element is an <li> or if it's a <div> within an <li>
      var isActionListItem = (event.target.tagName === 'LI' && event.target.querySelector('input[type="radio"]')) ||
                             (event.target.tagName === 'DIV' && event.target.closest('li') && event.target.closest('li').querySelector('input[type="radio"]'));

      if (isActionListItem) {
        // Find the radio button within the clicked LI or the closest LI
        var radioButton = (event.target.tagName === 'LI') ? event.target.querySelector('input[type="radio"]') : event.target.closest('li').querySelector('input[type="radio"]');

        // Check the radio button if it exists
        if (radioButton) {
          // Simulate a click event on the radio button
          radioButton.click();
        }
      }
    });

})();
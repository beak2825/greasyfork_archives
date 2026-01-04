// ==UserScript==
// @name         ArkhamDB Dynamic Title
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Update the title of ArkhamDB deck pages to include the first 30 characters of the deck name.
// @author       Chr1Z
// @match        https://*.arkhamdb.com/deck/*
// @icon         https://i.imgur.com/T3vHgln.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513055/ArkhamDB%20Dynamic%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/513055/ArkhamDB%20Dynamic%20Title.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Function to trim the deck name and update the title
  function updateDocumentTitle(deckName) {
    deckName = deckName.trim();

    if (deckName.length > 30) {
      deckName = deckName.substring(0, 30) + '...';
    }

    document.title = deckName + ' · ArkhamDB';
  }

  function updateTitleForView() {
    var deckNameElement = document.querySelector('#wrapper .main.container h1');
    if (deckNameElement) {
      var deckName = deckNameElement.textContent;
      updateDocumentTitle(deckName);
    }
  }

  function updateTitleForEdit() {
    var deckNameInput = document.querySelector('input.decklist-name');
    if (deckNameInput) {
      var deckName = deckNameInput.value;
      updateDocumentTitle(deckName);

      // Update title as user types
      deckNameInput.addEventListener('input', function () {
        var newDeckName = deckNameInput.value;
        updateDocumentTitle(newDeckName);
      });
    }
  }

  // Check if the user is viewing or editing a deck and run the appropriate function
  if (window.location.href.includes('/deck/view/')) {
    window.addEventListener('load', updateTitleForView);
  } else if (window.location.href.includes('/deck/edit/')) {
    window.addEventListener('load', updateTitleForEdit);
  }

})();
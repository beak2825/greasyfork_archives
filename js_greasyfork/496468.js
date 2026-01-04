// ==UserScript==
// @name         Filter Gmail shortcut
// @namespace    https://stojanow.com/
// @version      0.2.0
// @description  Filter Gmail messages by pressing \"alt+g\"
// @author       Piotr Stojanow (https://github.com/psto/)
// @license      MIT
// @homepageURL  https://github.com/psto/userscript-clean-copy-url
// @supportURL   https://github.com/psto/userscript-clean-copy-url
// @match        *://mail.google.com/*
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📩</text></svg>
// @downloadURL https://update.greasyfork.org/scripts/496468/Filter%20Gmail%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/496468/Filter%20Gmail%20shortcut.meta.js
// ==/UserScript==

(function() {
  'use strict'

  function handleKeyPress(event) {
    // Check if the alt+g keys are pressed
    if (event.altKey && event.code === 'KeyG') {
      const main = document.querySelector('div[role=main]');
      const emailElements = main.querySelectorAll('tr')

      // Filter out selected email rows
      let selectedEmailRows = Array.from(emailElements).filter((row) => {
        const tdElements = row.querySelectorAll('td');

        const hasAriaChecked = Array.from(tdElements).some((td) => {
          const isChecked = td.querySelector('div[aria-checked]')

          if (isChecked) {
            return isChecked.getAttribute('aria-checked') === 'true'
          }
        });

        const hasEmailSpan = row.querySelector('span[email]');

        return hasAriaChecked && hasEmailSpan;
      });

      // When filtering from an opened email, select the element containing the email
      if (selectedEmailRows.length === 0) {
        selectedEmailRows.push(emailElements[1])
      }

      let emails = []

      // Extract email addresses from the selected rows
      selectedEmailRows.filter((emailRow) => {
        const emailElement = emailRow.querySelector('td span[email]')
        const emailAddress = emailElement.getAttribute('email');
        emails.push(encodeURIComponent(emailAddress))
      })

      const searchUrl = `https://mail.google.com/mail/u/0/#search/from:(${emails.join(' OR ')})`;

      // Navigate to the Gmail search results page
      window.location.href = searchUrl;
    }
  }

  document.addEventListener('keydown', handleKeyPress);
})();

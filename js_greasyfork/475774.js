// ==UserScript==
// @name        Age-calculator - stashdb.org (fixed)
// @namespace   Violentmonkey Scripts
// @match       https://stashdb.org/performers/*
// @grant       none
// @version     1.2
// @author      Yahigod
// @license     MIT
// @description Adds performer age at scene date after DOM settles
// @downloadURL https://update.greasyfork.org/scripts/475774/Age-calculator%20-%20stashdborg%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/475774/Age-calculator%20-%20stashdborg%20%28fixed%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let observerTimer;
  const timeoutDuration = 900; // ms of no DOM changes before running
  let isScriptRunning = false;

  // --- Mutation observer with debounce ---
  const mutationObserver = new MutationObserver(() => {
    clearTimeout(observerTimer);
    observerTimer = setTimeout(runScriptIfNoMutations, timeoutDuration);
  });

  const body = document.querySelector('body');
  if (body) {
    mutationObserver.observe(body, { childList: true, subtree: true });
  }

  // Initial delayed attempt
  observerTimer = setTimeout(runScriptIfNoMutations, timeoutDuration);

  function runScriptIfNoMutations() {
    if (isScriptRunning) return;

    // Stop observer while we modify DOM
    mutationObserver.disconnect();
    isScriptRunning = true;

    try {
      // ---------------- YOUR ORIGINAL CODE (with minimal fixes) ----------------
      (function() {
        'use strict';

        // Function to calculate age
        function calculateAge(birthdate, sceneDate) {
          const birthDate = new Date(birthdate);
          const sceneDateObject = new Date(sceneDate);

          const ageInMilliseconds = sceneDateObject - birthDate;
          const ageInYears = ageInMilliseconds / (365 * 24 * 60 * 60 * 1000);

          const birthYear = birthDate.getFullYear();
          const sceneYear = sceneDateObject.getFullYear();

          const birthMonth = birthDate.getMonth();
          const sceneMonth = sceneDateObject.getMonth();

          const birthDay = birthDate.getDate();
          const sceneDay = sceneDateObject.getDate();

          let years = sceneYear - birthYear;
          let months = sceneMonth - birthMonth;
          let days = sceneDay - birthDay;

          if (days < 0) {
            months -= 1;
            days += 30; // Assuming an average of 30 days per month
          }

          if (months < 0) {
            years -= 1;
            months += 12;
          }

          let ageText = '';

          if (years > 0) {
            ageText += `${years}y `;
          }

          if (months > 0) {
            ageText += `${months}m `;
          }

          if (days > 0) {
            ageText += `${days}d `;
          }

          ageText += 'old';

          return ageText.trim();
        }

        // Extract and print birthdates
        const rows = document.querySelectorAll('tr');
        let birthdate;

        for (const row of rows) {
          const cells = row.querySelectorAll('td');

          if (cells.length == 2) {
            const birthdateCell = cells[0].textContent.trim();
            if (birthdateCell === "Birthdate") {
              // ✅ FIX #1: extract ONLY the ISO date even if the cell is polluted
              const match = cells[1].textContent.match(/\d{4}-\d{2}-\d{2}/);
              birthdate = match ? match[0] : undefined;
            }
          }
        }

        if (!birthdate) return; // can't do anything without a valid birthdate

        // Add age next to each date in SceneCard elements
        const sceneCards = document.querySelectorAll('.SceneCard.card');

        for (const sceneCard of sceneCards) {
          const dateStrong = sceneCard.querySelector('.card-footer strong');

          if (!dateStrong) continue;

          // ✅ FIX #2: prevent duplicates (looks for our tag)
          const footer = dateStrong.parentElement;
          if (footer && footer.querySelector('.age-calculator-age')) {
            continue;
          }

          const dateText = dateStrong.textContent.trim();
          const age = calculateAge(birthdate, dateText);

          // ✅ FIX #3: don't insert junk results like just "old"
          if (!/\d/.test(age)) continue;

          // ✅ FIX #4: put age UNDER the date with a real line break
          dateStrong.insertAdjacentHTML(
            'afterend',
            `<br><span class="age-calculator-age">${age}</span>`
          );
        }
      })();
      // ------------------------------------------------------------------------
    } catch (e) {
      console.error('[Age-calculator]', e);
    } finally {
      // Reconnect observer
      if (body) {
        mutationObserver.observe(body, { childList: true, subtree: true });
      }
      isScriptRunning = false;
    }
  }
})();

// ==UserScript==
// @name         Bootlegging Auto Genre Select
// @namespace   DieselBladeScripts.ARS
// @version      1.2.1
// @description  Automatic genre selection for Bootlegging
// @license     GPLv3
// @author       DieselBlade [1701621], Hemicopter [2780600]
// @match        https://www.torn.com/page.php?sid=crimes*
// @match        https://torn.com/page.php?sid=crimes*
// @grant        unsafeWindow
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/531715/Bootlegging%20Auto%20Genre%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/531715/Bootlegging%20Auto%20Genre%20Select.meta.js
// ==/UserScript==

const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
const win = isTampermonkeyEnabled ? unsafeWindow : window;
const {fetch: originalFetch} = win;

win.fetch = async (...args) => {
  const response = args.length == 2 ? await originalFetch(args[0], args[1]) : await originalFetch(args[0]);
  let url = args[0];
  if(typeof url === "object") url = url.url;
  if (url.includes('crimesData')) {
    crimesMain(response.clone()).catch(console.error);
  }
  return response;
};

async function crimesMain(res) {
  const crimesData = await res.json();
  const crimeType = crimesData?.DB?.currentUserStatistics?.[1]?.value;

  if (crimeType === 'Counterfeiting') {
    counterfeiting(crimesData.DB);
  } else {
    console.log(crimesData);
  }
}

async function counterfeiting(db) {
  const { generalInfo, currentUserStats, crimesByType } = db;
  const CDs = {
    have: generalInfo.CDs,
    sold: {
      1: currentUserStats.CDType1Sold,
      2: currentUserStats.CDType2Sold,
      3: currentUserStats.CDType3Sold,
      4: currentUserStats.CDType4Sold,
      5: currentUserStats.CDType5Sold,
      6: currentUserStats.CDType6Sold,
      7: currentUserStats.CDType7Sold,
      8: currentUserStats.CDType8Sold
    },
    genres: {
      'Action': '1',
      'Comedy': '2',
      'Drama': '3',
      'Fantasy': '4',
      'Horror': '5',
      'Romance': '6',
      'Thriller': '7',
      'Sci-Fi': '8'
    }
  };

  const currentQueue = crimesByType?.['0']?.additionalInfo?.currentQueue || [];
  currentQueue.forEach(cdID => CDs.have[cdID] += 1);

  const observer = new MutationObserver(() => {
    const genreButtons = document.querySelectorAll('button[class^=genreStock]');
    if (genreButtons.length > 0) {
      updateGenreButtons(CDs);
      observer.disconnect();
    }
  });

  observer.observe(document, { childList: true, subtree: true });
}

function updateGenreButtons(CDs) {
    const GREEN_HSL = 120; // Green for excess copies
    const RED_HSL = 0; // Red for biggest shortages

    const totalHave = sumValues(CDs.have);
    const totalSold = sumValues(CDs.sold);

    let maxShortage = 0; // Track the worst shortage
    let selectedButton = null; // Track which button should be clicked

    // First pass: Determine the maximum shortage
    document.querySelectorAll('button[class^=genreStock]').forEach((genreButton) => {
        const genre = genreButton.getAttribute('aria-label').split(' - ')[0].replace('Copying ', '');
        const typeID = CDs.genres[genre];
        const target = Math.floor((CDs.sold[typeID] / totalSold) * totalHave);
        const diff = target - CDs.have[typeID]; // Positive means more are needed, negative means excess
        if (diff > maxShortage) {
            maxShortage = diff; // Store the highest shortage
            selectedButton = genreButton; // Store the button with the highest shortage
        }
    });

    // Second pass: Apply colors based on shortage severity
    document.querySelectorAll('button[class^=genreStock]').forEach((genreButton) => {
        const genre = genreButton.getAttribute('aria-label').split(' - ')[0].replace('Copying ', '');
        const typeID = CDs.genres[genre];
        const target = Math.floor((CDs.sold[typeID] / totalSold) * totalHave);
        const diff = target - CDs.have[typeID]; // Positive means more are needed, negative means excess

        let h;
        if (diff > 0) {
            // Shortage: scale from red (0) to neutral
            h = RED_HSL + (1 - diff / maxShortage) * (GREEN_HSL - RED_HSL);
        } else {
            // Excess: Make it green
            h = GREEN_HSL;
        }

        genreButton.style.backgroundColor = `hsl(${h}, 100%, 90%)`;

        // Ensure text remains readable
        genreButton.style.color = "#888"; // Ensure button text is dark grey

        // Update the "copying" text color
        const statusText = genreButton.querySelector('.statusText___fRZso');
        if (statusText) {
            statusText.style.color = "#888";
        }

        // Update the text for how many more are needed or if there are excess copies
        const existingDiffText = genreButton.querySelector('.diffText');
        if (existingDiffText) {
            existingDiffText.remove();
        }

        const diffText = document.createElement('div');
        diffText.className = 'diffText';
        diffText.textContent = diff > 0 ? `${diff} more needed` : 'Excess copies';
        diffText.style.color = "#888"; // Ensure text remains readable
        genreButton.appendChild(diffText);
    });

    // Select the button with the biggest shortage
    if (selectedButton) {
        setTimeout(() => {
            selectedButton.click(); // Programmatically click the button
        }, 100); // Small delay to ensure UI updates before clicking
    }
}

function sumValues(obj) {
  return Object.values(obj).reduce((a, b) => a + b, 0);
}


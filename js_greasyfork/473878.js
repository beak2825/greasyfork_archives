// ==UserScript==
// @name         TC Bootlegging Plus
// @namespace    Phantom Scripting
// @version      0.8
// @description  Tools to help with Bootlegging
// @license      AGPLv3
// @author       ErrorNullTag
// @match        *https://www.torn.com/loader.php?sid=crimes*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/473878/TC%20Bootlegging%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/473878/TC%20Bootlegging%20Plus.meta.js
// ==/UserScript==

//=====================================================
//Acceptable Use Policy for All Phantom Scripting Scripts
//Version 1.0
//Last Updated: 9/17/2023
//=====================================================

//Introduction:
//-------------
//This Acceptable Use Policy ("Policy") outlines the acceptable and unacceptable uses
//of All Phantom Scripting Scripts ("Software"). This Policy applies to all users of the
//Software, including but not limited to contributors, developers, and end-users.
//By using the Software, you agree to abide by this Policy, as well as any other terms and
//conditions imposed by Phantom Scripting.

//Acceptable Use:
//---------------
//The Software is intended for usage in-game as it's stated usage on the download page for the software.
//Users are encouraged to use the Software for its intended purposes, and any use beyond this
//should be consistent with the principles of integrity, respect, and legality.

//Unacceptable Use:
//-----------------
//By using the Software, you agree not to:

//1. Use the Software for any illegal or unauthorized purpose, including but not limited to violating
//any local, state, or international laws.
//2. Use the Software for malicious gains, including but not limited to hacking, spreading malware,
//or engaging in activities that harm or exploit others.
//3. Alter, modify, or use the Software in a way that is inconsistent with its intended purpose,
//as described in official documentation, without explicit permission from Phantom Scripting.
//4. Use the Software to infringe upon the copyrights, trademarks, or other intellectual property
//rights of others.
//5. Use the Software to harass, abuse, harm, or discriminate against individuals or groups,
//based on race, religion, gender, sexual orientation, or any other characteristic.
//6. Use the Software to spam or engage in phishing activities.

//Consequences of Unacceptable Use:
//---------------------------------
//Phantom Scripting reserves the right to take any actions deemed appropriate for violations of this
//Policy, which may include:

//1. Temporary or permanent revocation of access to the Software.
//2. Moderative actions against the individual or entity in violation of this Policy.
//3. Public disclosure of the violation, to both Game Staff and the userbase.

//Amendments:
//-----------
//Phantom Scripting reserves the right to modify this Policy at any time.
//Users are encouraged to regularly review this Policy to ensure they are aware of any changes.

//Contact Information:
//---------------------
//For any questions regarding this Policy, please contact ErrorNullTag on Discord.

//=====================================================

const originalFetch = fetch;

unsafeWindow.fetch = async (input, init) => {
  const response = await originalFetch(input, init);
  if (input.includes('crimesData')) {
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
      addGuideBox();
      observer.disconnect();
    }
  });

  observer.observe(document, { childList: true, subtree: true });
}

function updateGenreButtons(CDs) {
    const GREEN_HSL = 120;
    const RED_HSL = 0;

    const totalHave = sumValues(CDs.have);
    const totalSold = sumValues(CDs.sold);

    document.querySelectorAll('button[class^=genreStock]').forEach((genreButton) => {
        const genre = genreButton.getAttribute('aria-label').split(' - ')[0].replace('Copying ', '');
        const typeID = CDs.genres[genre];
        const target = Math.floor((CDs.sold[typeID] / totalSold) * totalHave);
        const proportion = CDs.have[typeID] / target;

        let h;
        if (proportion <= 1) {
            h = RED_HSL + proportion * (GREEN_HSL - RED_HSL);
        } else {
            h = GREEN_HSL - (proportion - 1) * (GREEN_HSL - RED_HSL);
            h = Math.max(h, RED_HSL);
        }
        h = Math.min(h, GREEN_HSL);

        genreButton.style.backgroundColor = `hsl(${h}, 100%, 90%)`;

        const existingDiffText = genreButton.querySelector('.diffText');
        if (existingDiffText) {
            existingDiffText.remove();
        }

        const diff = target - CDs.have[typeID];
        const diffText = document.createElement('div');
        diffText.className = 'diffText'; // Add a class to the diffText for easy selection
        diffText.textContent = diff > 0 ? `${diff} more needed` : 'Excess copies';
        genreButton.appendChild(diffText);
    });
}


function sumValues(obj) {
  return Object.values(obj).reduce((a, b) => a + b, 0);
}

function addGuideBox() {
  const guideBox = document.createElement("div");
  guideBox.style.position = "fixed";
  guideBox.style.top = "10px";
  guideBox.style.right = "10px";
  guideBox.style.backgroundColor = "#333";
  guideBox.style.padding = "10px";
  guideBox.style.border = "2px solid gold";
  guideBox.style.zIndex = "9999";
  guideBox.style.borderRadius = "5px";

  const title = document.createElement("h2");
  title.textContent = "Phantom Scripting";
  title.style.color = "gold";
  title.style.marginBottom = "10px";
  guideBox.appendChild(title);

  const explanation = document.createElement("p");
  explanation.innerHTML = `
    <strong>Color Guide:</strong>
    <br><span style="background-color:hsl(120, 100%, 90%); display:inline-block; width:16px; height:16px; margin-right:4px;"></span> Perfect quantity.
    <br><span style="background-color:hsl(0, 100%, 90%); display:inline-block; width:16px; height:16px; margin-right:4px;"></span> Too few or too many of this genre.
  `;
  explanation.style.color = "white";
  guideBox.appendChild(explanation);

  document.body.appendChild(guideBox);
}


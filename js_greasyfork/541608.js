// ==UserScript==
// @name         Alliance highlighter
// @namespace    ShittyTornAllianceHighlighter
// @version      3
// @description  display user faction's allegiance
// @author       Jeyno
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @license     MIT
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/541608/Alliance%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/541608/Alliance%20highlighter.meta.js
// ==/UserScript==

// mentions     https://www.torn.com/forums.php#/p=threads&f=9&t=16386190&b=0&a=0&to=24504774

let fulllist;
let factionname;

//Retrieve alliance name
function findAllianceByFactionName(data, factionNameToFind) {
  function searchChildren(children, allianceName) {
    for (const item of children) {
      if (item.name.trim().toLowerCase() === factionNameToFind.trim().toLowerCase()) {
        return allianceName;
      }

      if (item.children && item.children.length > 0) {
        const result = searchChildren(item.children, allianceName);
        if (result) return result;
      }
    }
    return null;
  }

  for (const alliance of data.alliances) {
    const result = searchChildren(alliance.children, alliance.name);
    if (result) return result;
  }

  return null;
}

//Retrieve index of all alliances and their factions
function getJSON() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://raw.githubusercontent.com/Marches0/torn-public/refs/heads/master/factions/alliances/factionAlliances.json',
      onload: function(response) {
        if (response.status === 200) {
          const data = JSON.parse(response.responseText);
          resolve(data);

        } else {
          reject(`Failed to load JSON, status: ${response.status}`);
        }
      },
      onerror: function(err) {
        reject(err);
      }
    });
  });
}

//Get faction name of user of current page
function getFactionName() {
    const container = document.querySelector('.profile-container.basic-info');
    if (!container) return false;
    const infoTable = container.querySelector('ul.info-table');
    if (!infoTable) return false;
    const liItems = infoTable.querySelectorAll('li');
    if (liItems.length < 3) return false;
    const targetLi = liItems[2];
    const divsInLi = targetLi.querySelectorAll('div');
    if (divsInLi.length < 2) return false;
    const userInfoDiv = divsInLi[1];
    const firstSpan = userInfoDiv.querySelector('span');
    if (!firstSpan) return false;
    if (firstSpan.textContent.trim() === "N/A") return false;
    const anchor = firstSpan.querySelector('a');
    if (!anchor) return false;
    return anchor.textContent.trim();
}

function getUrlParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
}

function getFactionNameFromFactionPage() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const factionDiv = document.querySelector('.faction-profile > div');
      console.log(factionDiv);
      if (!factionDiv) {
        resolve(false);
        return;
      }

      const clone = factionDiv.cloneNode(true);
      const span = clone.querySelector('span');
      if (span) span.remove();

      const factionName = clone.textContent.trim();
      resolve(factionName || false);
    }, 500);
  });
}



(async function() {
  'use strict';
  const url = window.location.href;

  if (url.includes("https://www.torn.com/profiles.php")) {
  try {
    fulllist = await getJSON();
    factionname = await getFactionName();
    if(factionname === false) {console.log("User not in faction");return;} else {console.log(`User in faction: ${factionname}`)};

    const alliance = findAllianceByFactionName(fulllist, factionname);
    if (alliance) {
      console.log(`Faction "${factionname}" belongs to alliance "${alliance}"`);
        setTimeout(() => {
          const targetDiv = document.getElementById("skip-to-content");
          if (targetDiv && alliance) {
              targetDiv.innerHTML += ` (${alliance})`;
targetDiv.insertAdjacentHTML('afterend', `
  <span style="white-space: nowrap;">
    <a href="https://www.torn.com/forums.php#/p=threads&f=9&t=16380940&b=0&a=0&to=24400103"
      style="all: unset; display: inline; margin: 0; padding: 0; color: rgb(116, 192, 252); cursor: pointer;font-size: 22px">
      ?
    </a>
  </span>
`);
          }
        }, 100);

    } else {
      console.log(`Faction "${factionname}" not found in any alliance.`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  } //end of user page
  else if (url.includes("https://www.torn.com/factions.php")) {
    const idParam = getUrlParam('ID');
    const factionsH4 = document.querySelector('#factions > div > h4');
    fulllist = await getJSON();
    factionname = await getFactionNameFromFactionPage();
      console.log(factionname);

    // Append ID if ID param exists
    if (idParam) {
        factionsH4.textContent += ` - ${idParam}`;
    }

    const alliance = await findAllianceByFactionName(fulllist, factionname);
    if (alliance) {
        setTimeout(() => {
            factionsH4.insertAdjacentHTML('beforeend', ` - <span style="white-space: nowrap;">(<a href="https://www.torn.com/forums.php#/p=threads&f=9&t=16380940&b=0&a=0&to=24400103" style="all: unset; display: inline; margin: 0; padding: 0; color: rgb(116, 192, 252); cursor: pointer;">${alliance}</a>)</span>`);
        }, 100);
    }
  } //end of faction page

})();

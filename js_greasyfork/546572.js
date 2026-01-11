// ==UserScript==
// @name        OC Success Scraper
// @namespace   finally.torn.ocsuccess
// @match       https://www.torn.com/factions.php*
// @version     1.7
// @author      finally [2060206]
// @description Saves & Fetches OC Success Chances for faction members
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @connect     torn.seintz.com
// @downloadURL https://update.greasyfork.org/scripts/546572/OC%20Success%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/546572/OC%20Success%20Scraper.meta.js
// ==/UserScript==
 
let API_KEY = "INSERT_KEY_HERE";
if (API_KEY.length == 16) {
  localStorage.setItem("finally.torn.ocsuccess.api", API_KEY);
}
else {
  const key = localStorage.getItem("finally.torn.ocsuccess.api");
  if (key && key.length == 16) {
    API_KEY = key;
  }
}

GM_addStyle(`
.__ocsuccess_info {
  width: 100%;
  font-weight: bold;
}
.__ocsuccess_info table {
  width: 100%;
}

.__ocsuccess_info a {
  color: var(--oc-slot-menu-text);
  cursor: pointer;
  text-decoration: none;
}

.__ocsuccess_info a:hover {
  color: var(--oc-slot-menu-text-hover);
}

.__ocsuccess_info td {
  padding: 2px !important;
}

.__ocsuccess_green {
  color: var(--oc-slot-success-green-text);
}

.__ocsuccess_orange {
  color: var(--oc-slot-success-orange-text);
}

.__ocsuccess_red {
  color: var(--oc-slot-success-red-text);
}

button:hover:has(.__ocsuccess_info) {
  border-top-right-radius: 0;
}

button:hover > .__ocsuccess_info {
  display: block;
}
`);

let _ownPlayerId = 0;
function ownPlayerId() {
  _ownPlayerId = _ownPlayerId || Number(document.querySelector("script[playerid]")?.getAttribute("playerid")) || 0
  return _ownPlayerId;
}
let _ownPlayerName = "";
function ownPlayerName() {
  _ownPlayerName = _ownPlayerName || document.querySelector("script[playername]")?.getAttribute("playername") || "";
  return _ownPlayerName;
}

const _knownPositions = {};
const _playerNames = {};
function loadOCPositions() {
  if (API_KEY.length !== 16) return;

  GM_xmlhttpRequest({
    method: "GET",
    url: `https://torn.seintz.com/api/ocsuccess/${API_KEY}`,
    onload: (response) => {
      try {
        const json = JSON.parse(response.responseText);
        Object.keys(json).forEach(title => {
          Object.keys(json[title]).forEach(position => {
            json[title][position].forEach(([playerId, playerName, success, ocId]) => {
              _playerNames[playerId] = playerName;
              if (_knownPositions[`${title}_${position}_${playerId}`]?.ocId > ocId) return;
              _knownPositions[`${title}_${position}_${playerId}`] = {
                ocId: ocId,
                success: success,
              };
            });
          });
        });
      }
      catch(e) {
        console.error(e);
      }
    }
  });
}
loadOCPositions();

let _saveBuffer = {};
let _saveTimeout = null;
function saveOCPosition(ocId, title, position, playerId, playerName, success) {
  if (_knownPositions[`${title}_${position}_${playerId}`]?.ocId >= ocId) {
    return;
  }

  _knownPositions[`${title}_${position}_${playerId}`] = {
    ocId,
    success,
  };
  _playerNames[playerId] = playerName;
  _saveBuffer[`${title}_${position}_${playerId}`] = [ocId, title, position, playerId, success];

  if (API_KEY.length !== 16) return;

  if (_saveTimeout) clearTimeout(_saveTimeout);
  _saveTimeout = setTimeout(() => {
    _saveTimeout = null;
    GM_xmlhttpRequest({
      method: "POST",
      url: `https://torn.seintz.com/api/ocsuccess/${API_KEY}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(Object.values(_saveBuffer)),
      onload: (response) => {
        try {
          const json = JSON.parse(response.responseText);
          if (json.error) {
            console.error(json.error);
          }
        }
        catch(e) {
          console.error(e);
        }
      }
    });
    _saveBuffer = {};
  }, 1000);
}

function handleOC(node) {
  if (!node) return;

  const ocId = Number(node.dataset.ocId);
  if (!ocId) return;

  const title = node.querySelector("p[class*='panelTitle']")?.innerHTML;
  if (!title) return;

  node.querySelectorAll("div[class*='success']:has(button[class^='slotHeader_'])").forEach((node) => {
    const position = String(node.querySelector("[class*='title']")?.innerHTML.replace(/\s\#\d+$/g, ""));
    if (!position) return;

    const successChance = Number(node.querySelector("[class*='successChance']")?.innerHTML);
    if (!successChance) return;

    const playerId = Number(node.querySelector("a[href^='/profiles.php?XID=']")?.href.replace(/[^\d]/g, "")) || ownPlayerId();
    const playerName = node.querySelector(".honor-text:not(.honor-text-svg)")?.innerHTML || ownPlayerName();

    saveOCPosition(ocId, title, position, playerId, playerName, successChance);
  });
}

function handleTooltip(node) {
  if (!node) return;
  if (node.classList.contains("__ocsuccess")) return;

  node.classList.add("__ocsuccess");

  const title = String(document.querySelector("[class*='scenario']:has(+ div [class*='slotHeader']:hover > [class*='title']) [class*='panelTitle']")?.innerHTML);
  const position = String(document.querySelector("[class*='slotHeader']:hover > [class*='title']")?.innerHTML.replace(/\s\#\d+$/g, ""));
  const sectionClass = Array.from(node.querySelector("[class*='section']")?.classList).find(c => c.startsWith("section"));
  if (!title || !position || !sectionClass) return;

  const allSuccessChances = Object.keys(_knownPositions)
    .filter(key => key.startsWith(`${title}_${position}_`))
    .map(key => {
      return [key.split("_")[2], _knownPositions[key].success];
    });

  const successInfo = document.createElement("div");
  successInfo.className = `${sectionClass} __ocsuccess_info`;
  successInfo.innerHTML = `
    <table>
      <tr>
      ${
        allSuccessChances
          .sort((a, b) => b[1] - a[1])
          .map(([playerId, successChance]) => {
            let c = "__ocsuccess_red";
            if (successChance >= 75) c = "__ocsuccess_green";
            else if (successChance >= 50) c = "__ocsuccess_orange";
            return `<td><a href="/profiles.php?XID=${playerId}">${_playerNames[playerId]}</a></td><td class="${c}">${successChance}</td>`;
          })
          .join("</tr><tr>")
      }
      </tr>
    </table>`;
  node.appendChild(successInfo);
}

new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const addedNode of mutation.addedNodes) {
      if (addedNode.dataset?.ocId) {
        handleOC(addedNode);
      }

      addedNode.querySelector && handleTooltip(addedNode.querySelector("div[aria-label*='Checkpoint pass rate']"));
    }
  }
}).observe(document.body, { childList: true, subtree: true });
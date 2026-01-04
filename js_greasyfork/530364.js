// ==UserScript==
// @name         match data importer
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  imports match data from compatible exports
// @author       Hendrik Steinmetz
// @match        https://homecourt.vcc.heimspiel.de/01_admin/spiele/*
// @match        https://homecourt.vcc.heimspiel.de/01_admin/spiele/spiel_aktionen.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heimspiel.de
// @grant        GM_addStyle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/530364/match%20data%20importer.user.js
// @updateURL https://update.greasyfork.org/scripts/530364/match%20data%20importer.meta.js
// ==/UserScript==

let btn = document.createElement("button");
btn.id = "floatingButton";
btn.textContent = "Import";
btn.onclick = () => {
  document.getElementById("popup-body").value = "";
  document.querySelector("#customPopup").style.display = "block";
};

function triggerImport() {
  document.querySelector("#loadingSpinner").style.display = "block";
  const json = document.getElementById("popup-body").value;
  if (json) {
    const report = JSON.parse(json);
    if (!report) {
      document.querySelector("#loading-spinner").style.display = "none";
    }

    const homeTable = document.querySelectorAll("table")[0];
    const awayTable = document.querySelectorAll("table")[1];
    fillTable(
      homeTable,
      report.players?.filter((p) => p.home) ?? [],
      report.events.substitutions?.filter((sub) => sub.home) ?? [],
      report.events.cards?.filter((card) => card.home) ?? [],
      report.source
    );
    fillTable(
      awayTable,
      report.players?.filter((p) => !p.home) ?? [],
      report.events.substitutions?.filter((sub) => !sub.home) ?? [],
      report.events.cards?.filter((card) => !card.home) ?? [],
      report.source
    );
  }
  document.querySelector("#loadingSpinner").style.display = "none";
}

/**
 * @param table {HTMLTableElement}
 */
function fillTable(table, playerData, subData, cardData, source) {
  const mappedPlayers = [];
  const rowArray = Array.from(table.rows);
  for (let i = 3; i < table.rows.length - 1; i++) {
    const currentRow = rowArray[i];
    const cells = Array.from(currentRow.cells);

    const numberCell = cells[0];
    const nameShortCell = cells[1];
    const fullNameCell = cells[2];
    const startingCell = cells[4];
    const benchCell = cells[6];

    const subOnCell = cells[8];
    const subOnMinuteCell = cells[9];
    const subOnAddedCell = cells[10];

    const subOffCell = cells[12];
    const subOffMinuteCell = cells[13];
    const subOffAddedCell = cells[14];

    const yellowCell = cells[16];
    const yellowMinuteCell = cells[17];
    const yellowAddedCell = cells[18];

    const yellowRedCell = cells[20];
    const yellowRedMinuteCell = cells[21];
    const yellowRedAddedCell = cells[22];

    const redCell = cells[24];
    const redMinuteCell = cells[25];
    const redAddedCell = cells[26];

    const checkCell = (cell) => (cell.querySelector("input").checked = true);
    const uncheckCell = (cell) => (cell.querySelector("input").checked = false);
    const setCellValue = (cell, val) =>
      (cell.querySelector("input").value = val);

    const numberInput = numberCell.querySelector("input");
    if (!numberInput) {
      console.log("Number input null for", currentRow);
      continue;
    }

    let searchName = fullNameCell.innerText;
    if (source && source === "soccerway" && nameShortCell.innerText.includes(" ") && nameShortCell.innerText.includes(",")) {
      searchName =
        nameShortCell.innerText.split(" ")[1].charAt(0) + ". " + nameShortCell.innerText.split(" ")[0];
      searchName = searchName.replaceAll(",", "");
    }
    const player = findPlayer(
      playerData,
      numberInput.value,
      searchName
    );
    if (!player) {
      uncheckCell(startingCell);
      uncheckCell(benchCell);
      continue;
    }

    let playerId = player.id;

    if (!player.sub) {
      checkCell(startingCell);
      uncheckCell(benchCell);
    } else if (player.sub) {
      uncheckCell(startingCell);
      checkCell(benchCell);
    }

    if (playerWasSubbedOn(playerId, subData)) {
      const substitution = subData.find((sub) => sub.on === playerId);
      checkCell(subOnCell);
      checkCell(benchCell);
      setCellValue(subOnMinuteCell, substitution.minute);
      setCellValue(subOnAddedCell, substitution.added ?? "");
    }

    if (playerWasSubbedOff(playerId, subData)) {
      const substitution = subData.find((sub) => sub.off === playerId);
      checkCell(subOffCell);
      setCellValue(subOffMinuteCell, substitution.minute);
      setCellValue(subOffAddedCell, substitution.added ?? "");
      if (!playerWasSubbedOn(playerId, subData)) {
        checkCell(startingCell);
      }
    }

    const cardEvents = cardData.filter((p) => p.id === playerId);
    if (cardEvents.length > 0) {
      cardEvents.forEach((event) => {
        if (event.card === "yellow") {
          checkCell(yellowCell);
          setCellValue(yellowMinuteCell, event.minute);
          setCellValue(yellowAddedCell, event.added ?? "");
        } else if (event.card === "yellow-red") {
          checkCell(yellowRedCell);
          setCellValue(yellowRedMinuteCell, event.minute);
          setCellValue(yellowRedAddedCell, event.added ?? "");
        } else if (event.card === "red") {
          checkCell(redCell);
          setCellValue(redMinuteCell, event.minute);
          setCellValue(redAddedCell, event.added ?? "");
        }
      });
    }

    mappedPlayers.push(playerId);
    playerData = playerData.filter((p) => p.id !== playerId);
  }
  const unmapped = playerData.filter((p) => !mappedPlayers.includes(p.id));
  const list = document.createElement("ul");

  let container = document.getElementById("unmappedPlayersContainer");
  if (!container) {
    container = document.createElement("div", {
      id: "unmappedPlayersContainer",
    });
    container.style.marginTop = "10px";
    const caption = document.createElement("strong");
    caption.innerText =
      "The following players from the match report could not be found in the table:";
    container.appendChild(caption);
  }

  unmapped.forEach((p) => {
    const item = document.createElement("li");
    item.innerText = `${p.number} - ${p.name}`;
    list.appendChild(item);
  });
  container.appendChild(list);

  table.insertAdjacentElement("afterend", container);
}

/**
 * Finds players based on number and name:
 * - if no player with number is found: name is used
 * - if multiple with same number: use most similar name
 */
// TODO clean up and make more efficient
// ONLY ONE similarity computation per filter
// -> add as key and sort by
//
// one list filtered by number and one by name
// if only one in number list: return if sim > 0.5
// else if many in number list: sort by sim return first if sim > 0.5
// else if no number or none in number list: return first of name search if sim > 0.5
// return null
function findPlayer(players, number, nameFull) {
  console.log("Searching player:", nameFull, number)
  const playersByNumber = players.filter(
    (player) => parseInt(player.number) === parseInt(number)
  );
  nameFull = nameFull.toLowerCase();
  const firstName = nameFull.split(" ")[0];

  const similiarityThreshold = 0.6;

  // ONLY ONE PLAYER FOUND OR NUMBER WAS SUPPLIED
  if (playersByNumber.length === 1 || !number) {
    if (
      number &&
      similarity(
        playersByNumber[0].name,
        //playersByNumber[0].name.split(" ")[0].toLowerCase(),
        nameFull
      ) > similiarityThreshold
    ) {
      return playersByNumber[0];
    }

    const playersByName = players.filter((p) =>
      similarity(p.name.toLowerCase(), nameFull)
    );
    if (playersByName.length === 0) return null;

    playersByName.sort(
      (a, b) =>
        similarity(b.name.toLowerCase(), nameFull) -
        similarity(a.name.toLowerCase(), nameFull)
    );
    const firstScore = similarity(
      playersByName[0].name.toLowerCase(),
      nameFull
    );

    if (firstScore > similiarityThreshold) {
      return playersByName[0];
    }
  }

  // MULTIPLE PLAYERS WITH SAME NUMBER FOUND => return highest similarity
  if (playersByNumber.length > 1) {
    playersByNumber.sort(
      (a, b) =>
        similarity(b.name.toLowerCase(), nameFull) -
        similarity(a.name.toLowerCase(), nameFull)
    );
    const firstScore = similarity(
      playersByNumber[0].name.toLowerCase(),
      nameFull
    );

    if (firstScore > similiarityThreshold) {
      return playersByNumber[0];
    }
  }

  // NO PLAYER FOUND WITH NUMBER => search by name
  if (playersByNumber.length === 0) {
    console.log(players, number, nameFull);
    const nameSearch = players.filter(
      (p) => similarity(p.name.toLowerCase(), nameFull) > similiarityThreshold
    );
    nameSearch.sort(
      (a, b) =>
        similarity(b.name.toLowerCase(), nameFull) -
        similarity(a.name.toLowerCase(), nameFull)
    );

    console.log("similarity search result", nameSearch);

    if (nameSearch.length === 0) {
      console.log("PLAYER NOT FOUND", nameFull);
      return null;
    }

    const firstScore = similarity(nameSearch[0].name.toLowerCase(), nameFull);

    return firstScore > similiarityThreshold ? nameSearch[0] : null;
  }

  return null;
}

function playerWasSubbedOn(playerId, subData) {
  return subData.filter((sub) => sub.on === playerId).length > 0;
}
function playerWasSubbedOff(playerId, subData) {
  return subData.filter((sub) => sub.off === playerId).length > 0;
}

let popup = document.createElement("div");
popup.id = "customPopup";
popup.innerHTML = `
<div class="popup-content">
  <h2 id="popup-title">Import</h2>
  <textarea id="popup-body"></textarea>
  <div id="loadingSpinner" class="spinner"></div>
  <button id="closePopup">Close</button>
  <button id="importBtn">Start import</button>
</div>
`;

document.addEventListener("click", function (event) {
  if (event.target.id === "closePopup") {
    document.getElementById("customPopup").style.display = "none";
  }
  if (event.target.id === "importBtn") {
    triggerImport();
  }
});

GM_addStyle(`
        #floatingButton {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #007BFF;
            color: white;
            font-size: 16px;
            font-weight: bold;
            border: none;
            border-radius: 10px;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            z-index: 9999;
            transition: background-color 0.3s ease, transform 0.2s ease;
        }
        #floatingButton:hover {
            background-color: #0056b3;
            transform: scale(1.1);
        }
        #customPopup {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            width: 50%;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            z-index: 10000;
        }
        #popup-title {
            text-align: center;
        }
        #popup-body {
            border: 1px solid #ccc;
            width: 100%;
            height: 120px;
            padding: 5px;
            font-size: 14px;
            border: none;
            resize: none;
            background: #f8f8f8;
            outline: none;
        }
        #closePopup {
            margin-top: 10px;
            padding: 8px 16px;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #closePopup:hover {
            background-color: #c82333;
        }
        #importBtn {
            margin-top: 10px;
            margin-left: 10px;
            padding: 8px 16px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #importBtn:hover {
            background-color: #0056b3;
        }
        .spinner {
            display: none;
            margin: 10px auto;
            width: 40px;
            height: 40px;
            border: 4px solid rgba(0, 0, 0, 0.2);
            border-top: 4px solid #007BFF;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `);
document.body.appendChild(btn);
document.body.appendChild(popup);

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

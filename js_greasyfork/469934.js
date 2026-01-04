// ==UserScript==
// @name         GT7 TT Statistics
// @namespace    http://www.romeyke.de
// @version      2.1
// @description  Displays a popup with additional statistics for GT7 time trials and enables time trial sneak preview
// @match        https://www.gran-turismo.com/*/gt7/sportmode/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469934/GT7%20TT%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/469934/GT7%20TT%20Statistics.meta.js
// ==/UserScript==

(function () {
  "use strict";
  doSneakPreview();
  doStats();
})();

function doStats() {
  // Create the Stats link element
  const statsLink = document.createElement("a");
  statsLink.innerHTML = "Stats";
  statsLink.style.color = "red";
  statsLink.style.cursor = "pointer";
  statsLink.className = "mainNavLink";
  statsLink.addEventListener("click", function (e) {
    e.preventDefault();
    // Extract event number from the URL
    const urlSegments = window.location.pathname.split("/");
    let eventNumber = null;
    for (let i = 0; i < urlSegments.length; i++) {
      if (urlSegments[i] === "event" && i < urlSegments.length - 1) {
        eventNumber = urlSegments[i + 1];
        break;
      }
    }
    if (eventNumber) {
      showStatsPopup(eventNumber);
    }
  });

  // Find the parent div with class "mainNavRoot" and append the Stats link
  const mainNavRootDiv = document.querySelector(".mainNavRoot");
  if (mainNavRootDiv) {
    mainNavRootDiv.appendChild(statsLink);
  }
}

// Function to show the stats popup
async function showStatsPopup(eventNumber) {
  // Create the popup element
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "black";
  popup.style.color = "white";
  popup.style.padding = "20px";
  popup.style.border = "1px solid black";
  popup.style.zIndex = "9999";
  popup.style.width = "800px";
  popup.style.height = "600px";
  popup.style.overflow = "auto";

  // Create the close button
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "Close";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.padding = "5px";
  closeButton.style.cursor = "pointer";
  closeButton.addEventListener("click", function () {
    document.body.removeChild(popup);
  });
  // Append the popup to the document body
  document.body.appendChild(popup);
  popup.appendChild(closeButton);

  // Create the headline
  const headline = document.createElement("h2");
  headline.innerHTML = "Please wait, loading data ...";
  popup.appendChild(headline);

  const { gold, silver, bronze, worldRecord, totalPlayers } =
    await retrieveData(eventNumber);

  headline.innerHTML = `World Record: ${formatTime(
    worldRecord
  )} (of ${totalPlayers.toLocaleString()} players)`;

  // Create the table
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";

  const tableHead = document.createElement("thead");
  tableHead.style.backgroundColor = "grey";
  const tableBody = document.createElement("tbody");

  // Create the table headers
  const headers = ["Reward", "Time", "Players", "%"];
  const headerRow = document.createElement("tr");
  for (let header of headers) {
    const headerCell = document.createElement("th");
    headerCell.innerHTML = header;
    headerCell.style.textAlign = "left";
    headerCell.style.border = "1px solid white";
    headerCell.style.padding = "10px";
    headerRow.appendChild(headerCell);
  }
  tableHead.appendChild(headerRow);
  tableBody.appendChild(
    addRow("Gold", gold.time, gold.ranking, gold.percent, "#FFD700")
  );
  tableBody.appendChild(
    addRow("Silver", silver.time, silver.ranking, silver.percent, "#C0C0C0")
  );
  tableBody.appendChild(
    addRow("Bronze", bronze.time, bronze.ranking, bronze.percent, "#CD7F32")
  );

  // Append the close button, headline, and table to the popup
  table.appendChild(tableHead);
  table.appendChild(tableBody);
  popup.appendChild(table);
}

function addRow(reward, time, players, percentage, color) {
  const row = document.createElement("tr");
  row.appendChild(addCell(reward, color));
  row.appendChild(addCell(time, color));
  row.appendChild(addCell(players.toLocaleString(), color));
  row.appendChild(addCell(percentage, color));
  return row;
}

function addCell(cellData, color) {
  const cell = document.createElement("td");
  cell.innerHTML = cellData;
  cell.style.border = "1px solid white";
  cell.style.backgroundColor = color;
  cell.style.padding = "10px";
  return cell;
}

async function retrieveData(eventNumber) {
  const params = await fetch(
    `https://web-api.gt7.game.gran-turismo.com/event/get_parameter`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_id: +eventNumber }),
    }
  ).then((response) => response.json());
  const board_id = params.result.online.ranking_id;
  const pages = [];
  const firstPage = await getPage(board_id, 0, pages);
  const lastPageNumber = firstPage.result.total - 1;
  const lastPage = await getPage(board_id, lastPageNumber, pages);
  const highScore = firstPage.result.list[0].score;
  const totalPlayers =
    lastPage.result.list[lastPage.result.list.length - 1].display_rank;
  const bronzeMultiplier = eventNumber == "10131" ? 1.2 : 1.1;
  const bronzeScore = Math.floor(highScore * bronzeMultiplier);
  const bronzeRanking = await getRanking(
    board_id,
    bronzeScore,
    lastPageNumber,
    pages
  );
  const silverScore = Math.floor(highScore * 1.05);
  const silverRanking = await getRanking(
    board_id,
    silverScore,
    lastPageNumber,
    pages
  );
  const goldMultiplier = ["9289", "11908"].includes(eventNumber) ? 1.01 : 1.03;
  const goldScore = Math.floor(highScore * goldMultiplier);
  const goldRanking = await getRanking(
    board_id,
    goldScore,
    lastPageNumber,
    pages
  );
  return {
    worldRecord: highScore,
    totalPlayers,
    gold: {
      time: formatTime(goldScore),
      ranking: goldRanking,
      percent: ((goldRanking / totalPlayers) * 100).toFixed(1),
    },
    silver: {
      time: formatTime(silverScore),
      ranking: silverRanking,
      percent: ((silverRanking / totalPlayers) * 100).toFixed(1),
    },
    bronze: {
      time: formatTime(bronzeScore),
      ranking: bronzeRanking,
      percent: ((bronzeRanking / totalPlayers) * 100).toFixed(1),
    },
  };
}

async function getRanking(board_id, targetScore, lastPageNumber, pages) {
  let lowerBound = 0;
  let upperBound = lastPageNumber;
  let ranking;
  while (ranking === undefined) {
    const pageNumber = Math.floor((lowerBound + upperBound) / 2);
    const response = await getPage(board_id, pageNumber, pages);
    const firstScore = response.result.list[0].score;
    const lastScore =
      response.result.list[response.result.list.length - 1].score;
    if (targetScore < firstScore) {
      upperBound = Math.max(pageNumber - 1, lowerBound);
    }
    if (targetScore > lastScore) {
      lowerBound = Math.min(pageNumber + 1, upperBound);
    }
    if (targetScore >= firstScore && targetScore <= lastScore) {
      ranking = response.result.list.find((item) => item.score >= targetScore);
    }
  }
  return ranking.display_rank;
}

async function getPage(board_id, page, existingPages) {
  if (existingPages[page]) {
    return existingPages[page];
  }
  const result = await fetch(
    "https://web-api.gt7.game.gran-turismo.com/ranking/get_list_by_page",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ board_id, page }),
    }
  ).then((res) => res.json());
  existingPages[page] = result;
  return result;
}

function formatTime(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const millisecondsFormatted = (milliseconds % 1000)
    .toFixed(0)
    .padStart(3, "0");

  return `${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}.${millisecondsFormatted}`;
}

function doSneakPreview() {
  function waitForDOMAndRun(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback(); // DOM already ready
    }
  }

  waitForDOMAndRun(() => {
    const observer = new MutationObserver(() => {
      const success = checkAndInject();
      if (success) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });

  function addSneakPreview(originalNode, newElement) {
    const cloned = originalNode.cloneNode(true);
    cloned.style.border = "3px solid gold";
    cloned.style.backgroundColor = "rgb(255,248,229, 0.2)";
    cloned.style.position = "relative";
    cloned.style.marginTop = "16px";

    const image = cloned.querySelector("img");
    if (image) {
      image.src = newElement.imageName;
    }
    const date = cloned.querySelector("dd");
    if (date) {
        date.textContent = `${formatDate(newElement.startTime)} - ${formatDate(newElement.endTime)}`
    }
    const a = cloned.querySelector("a");
    if (a) {
        a.href=`/gb/gt7/sportmode/event/${newElement.eventNumber}/`;
    }

    const label = document.createElement("div");
    label.textContent = "Sneak Preview";
    label.style.position = "absolute";
    label.style.top = "8px";
    label.style.left = "8px";
    label.style.padding = "2px 6px";
    label.style.backgroundColor = "gold";
    label.style.color = "#000";
    label.style.fontWeight = "bold";
    label.style.borderRadius = "4px";
    label.style.fontSize = "12px";

    cloned.appendChild(label);
    originalNode.parentNode.insertBefore(cloned, originalNode);
  }

  function formatDate(isoString) {
  const date = new Date(isoString);

  const day = date.getDate(); // no leading zero
  const month = date.getMonth() + 1; // months are 0-based
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0'); // zero-padded

  return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  function checkAndInject() {
    const headers = Array.from(document.querySelectorAll("h1 span"));
    const timeTrialHeader = headers.find(
      (el) => el.textContent.trim() === "Online Time Trials"
    );

    if (!timeTrialHeader) return false;

    const container = timeTrialHeader.closest("div")?.querySelector("div");
    const firstChallenge = container?.querySelector(".FsZTOg");

    if (!firstChallenge) return false;

    
    const API_URL = "https://home.romeyke.de:35043/api/sneak-preview";
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        data?.forEach(element => {
          addSneakPreview(firstChallenge, element);
        });
      })
      .catch(console.error);
    
    return true;
  }
}

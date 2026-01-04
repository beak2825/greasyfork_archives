// ==UserScript==
// @name         Nitro Type - Top Team Requirements Table
// @namespace    https://github.com/rickstaa/nitro-type-top-team-requirements-table
// @version      1.1.1
// @description  Display top team races and points requirements for weekly and season leaderboards on Nitro Type team pages.
// @author       Rick Staa
// @match        *://*.nitrotype.com/team/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473674/Nitro%20Type%20-%20Top%20Team%20Requirements%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/473674/Nitro%20Type%20-%20Top%20Team%20Requirements%20Table.meta.js
// ==/UserScript==

/**
 * Fetches team stats from the NitroType API or from local storage.
 * @param {number} teamPageTag - The tag of the team to fetch stats for.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the
 * team stats. Uses cached stats if they are less than 20 minutes old.
 */
const fetchTeamStats = async (teamPageTag) => {
  try {
    const teamStats = JSON.parse(localStorage.getItem("teamStats"));
    if (teamStats && Date.now() - teamStats.timestamp < 20 * 60 * 1000) {
      // Use the cached team stats if they are less than 20 minutes old.
      return teamStats.data;
    } else {
      // Retrieve the team stats from the NitroType API.
      const response = await fetch(
        `https://www.nitrotype.com/api/v2/teams/${teamPageTag}`
      );

      // Throw an error if the response is not successful.
      if (!response.ok) {
        throw new Error(`Failed to fetch team stats: ${response.status}`);
      }

      // Parse the response body as JSON and store it in local storage.
      const data = await response.json();
      localStorage.setItem(
        "teamStats",
        JSON.stringify({ data, timestamp: Date.now() })
      );

      // Return the team stats.
      return data;
    }
  } catch (error) {
    console.error(`Error fetching team stats: ${error}`);
    throw error;
  }
};

/**
 * Fetches the season leaderboard from the NitroType API.
 * @returns {Promise<Array>} - A promise that resolves to an array of leaderboard
 * scores. Uses cached scores if they are less than 20 minutes old.
 */
const getSeasonLeaderBoardInfoStats = async () => {
  try {
    const leaderboardInfo = JSON.parse(
      localStorage.getItem("seasonLeaderboardInfo")
    );
    if (
      leaderboardInfo &&
      Date.now() - leaderboardInfo.timestamp < 20 * 60 * 1000
    ) {
      // Use the cached leaderboard info if it is less than 20 minutes old.
      return leaderboardInfo.seasonLeaderboardInfo;
    } else {
      // Retrieve the season leaderboard from the NitroType API.
      const response = await fetch(
        "https://www.nitrotype.com/api/v2/leaderboards?time=season"
      );

      // Throw an error if the response is not successful.
      if (!response.ok) {
        throw new Error(
          `Failed to fetch season leaderboard: ${response.status}`
        );
      }

      // Parse the response body as JSON and store it in local storage.
      const { results } = await response.json();
      localStorage.setItem(
        "seasonLeaderboardInfo",
        JSON.stringify({
          seasonLeaderboardInfo: results.scores,
          timestamp: Date.now(),
        })
      );

      // Return the season leaderboard.
      return results.scores;
    }
  } catch (error) {
    console.error(`Error fetching season leaderboard: ${error}`);
    throw error;
  }
};

/**
 *  Fetches the weekly leaderboard from the NitroType API.
 * @returns {Promise<Array>} - A promise that resolves to an array of leaderboard
 * scores. Uses cached scores if they are less than 20 minutes old.
 */
const getWeeklyLeaderBoardInfoStats = async () => {
  try {
    const leaderboardInfo = JSON.parse(
      localStorage.getItem("weeklyLeaderboardInfo")
    );
    if (
      leaderboardInfo &&
      Date.now() - leaderboardInfo.timestamp < 20 * 60 * 1000
    ) {
      // Use the cached leaderboard info if it is less than 20 minutes old.
      return leaderboardInfo.weeklyLeaderboardInfo;
    } else {
      // Retrieve the season leaderboard from the NitroType API.
      const response = await fetch(
        "https://www.nitrotype.com/api/v2/leaderboards?time=weekly"
      );

      // Throw an error if the response is not successful.
      if (!response.ok) {
        throw new Error(
          `Failed to fetch weekly leaderboard: ${response.status}`
        );
      }

      // Parse the response body as JSON and store it in local storage.
      const { results } = await response.json();
      localStorage.setItem(
        "weeklyLeaderboardInfo",
        JSON.stringify({
          weeklyLeaderboardInfo: results.scores,
          timestamp: Date.now(),
        })
      );

      // Return the season leaderboard.
      return results.scores;
    }
  } catch (error) {
    console.error(`Error fetching season leaderboard: ${error}`);
    throw error;
  }
};

/**
 * Wait for an element to be available in the DOM.
 * @param {string} selector - The selector to wait for.
 * @returns {Promise<Element>} - A promise that resolves to the element.
 */
const waitForElm = (selector) => {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          const element = document.querySelector(selector);
          if (element) {
            observer.disconnect();
            resolve(element);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const element = document.querySelector(selector);
    if (element) {
      observer.disconnect();
      resolve(element);
    }
  });
};

/**
 * Userscript entry point.
 */
(async function () {
  "use strict";

  // Get the team ID from the URL.
  const teamPageTag = window.location.href.split("/")[4];

  // Return if user is not on its own team page.
  const userTeamTAG = JSON.parse(
    JSON.parse(localStorage.getItem("persist:nt")).user
  ).tag;
  if (userTeamTAG !== teamPageTag) {
    return;
  }

  // Get the team stats from the NitroType API.
  let memberCount;
  let seasonRaces;
  try {
    const { results } = await fetchTeamStats(teamPageTag);
    memberCount = results.info.members;
    seasonRaces = results.stats.find((stat) => stat.board === "season")?.played;
  } catch (error) {
    console.error(`Error retrieving team stats: ${error}`);
  }

  // Retrieve current season information.
  const seasonInfo = NTGLOBALS.ACTIVE_SEASONS.find((s) => {
    const now = Date.now();
    return now >= s.startStamp * 1e3 && now <= s.endStamp * 1e3;
  });
  const DAYS_LEFT_IN_SEASON =
    Math.abs(seasonInfo.endStamp * 1000 - Date.now()) / (1000 * 60 * 60 * 24);

  // Retrieve the weekly and season leaderboards from the NitroType API.
  let weeklyLeaderBoardInfo, seasonLeaderBoardInfo;
  try {
    weeklyLeaderBoardInfo = await getWeeklyLeaderBoardInfoStats();
    weeklyLeaderBoardInfo = weeklyLeaderBoardInfo.map(({ played, points }) => ({
      played,
      points,
    }));

    seasonLeaderBoardInfo = await getSeasonLeaderBoardInfoStats();
    seasonLeaderBoardInfo = seasonLeaderBoardInfo.map(({ played, points }) => ({
      played,
      points,
    }));
  } catch (error) {
    console.error(`Error retrieving leaderboard info: ${error}`);
  }

  // Define the table data for the weekly and season views.
  const weeklyTopInfo = {
    top1: weeklyLeaderBoardInfo[0],
    top3: weeklyLeaderBoardInfo[2],
    top10: weeklyLeaderBoardInfo[9],
    top50: weeklyLeaderBoardInfo[49],
    top100: weeklyLeaderBoardInfo[99],
  };
  const seasonTopInfo = {
    top1: seasonLeaderBoardInfo[0],
    top3: seasonLeaderBoardInfo[2],
    top10: seasonLeaderBoardInfo[9],
    top50: seasonLeaderBoardInfo[49],
    top100: seasonLeaderBoardInfo[99],
  };

  // Calculate required daily member races for the weekly leaderboard.
  for (const [key, value] of Object.entries(weeklyTopInfo)) {
    weeklyTopInfo[key].dailyMemberRaces = Math.ceil(
      value.played / 7 / memberCount
    );
  }

  // Calculate required daily member races for the season leaderboard.
  for (const [key, value] of Object.entries(seasonTopInfo)) {
    seasonTopInfo[key].dailyMemberRaces = Math.ceil(
      (value.played - seasonRaces) / DAYS_LEFT_IN_SEASON / memberCount
    );
  }

  /**
   * Creates a `tbody` element containing the table rows for the top team requirements table.
   * @param {Object} topInfo - The top team requirements data.
   * @returns {HTMLTableSectionElement} The `tbody` element containing the table rows.
   */
  const createTopTeamRequirementsTableBody = (topInfo) => {
    // Create a `tbody` element to hold the table rows.
    const topInfoTableBody = document.createElement("tbody");
    topInfoTableBody.className =
      "table-body table-body--leaderboard--requirements";

    // Add all the top team requirements to the table body.
    for (const [key, value] of Object.entries(topInfo)) {
      // Create a table row (`tr`) element for each entry in the `topInfo` object.
      const topInfoTableBodyRow = document.createElement("tr");
      topInfoTableBodyRow.className = "table-row";

      // Cad the top position keys to the table row.
      const topColumn = document.createElement("td");
      topColumn.className = "table-cell tac table-cell--place";
      topColumn.setAttribute("colspan", "2");
      const topTextDiv = document.createElement("div");
      topTextDiv.className = "mhc";
      const topTextSpan = document.createElement("span");
      topTextSpan.className = "h4 tc-ts";
      topTextSpan.innerText = key.replace("top", "");
      topTextDiv.appendChild(topTextSpan);
      topColumn.appendChild(topTextDiv);
      topInfoTableBodyRow.appendChild(topColumn);

      // Add the number of races played to the table row.
      const racesColumn = document.createElement("td");
      racesColumn.className = "table-cell table-cell-races";
      racesColumn.setAttribute("colspan", "3");
      racesColumn.innerText = value.played.toLocaleString();
      topInfoTableBodyRow.appendChild(racesColumn);

      // Add number of points earned to the table row.
      const pointsColumn = document.createElement("td");
      pointsColumn.className = "table-cell table-cell--points";
      pointsColumn.setAttribute("colspan", "3");
      pointsColumn.innerText = value.points.toLocaleString();
      topInfoTableBodyRow.appendChild(pointsColumn);

      // Add required daily member races to the table row.
      const dailyMemberRacesColumn = document.createElement("td");
      dailyMemberRacesColumn.className = "table-cell table-cell--points";
      dailyMemberRacesColumn.setAttribute("colspan", "3");
      dailyMemberRacesColumn.innerText =
        value.dailyMemberRaces.toLocaleString();
      topInfoTableBodyRow.appendChild(dailyMemberRacesColumn);

      // Add the table row to the `tbody` element
      topInfoTableBody.appendChild(topInfoTableBodyRow);
    }

    // Return the `tbody` element
    return topInfoTableBody;
  };

  /**
   * Creates a tooltip for the top team requirements table.
   * @returns {HTMLDivElement} The `div` element containing the tooltip.
   */
  const createTableTooltip = () => {
    const tableTooltipDiv = document.createElement("div");
    tableTooltipDiv.className = "split well well--b well--s";
    const tableToolTipSplit = document.createElement("div");
    tableToolTipSplit.className = "split-cell";
    const tableToolTipUl = document.createElement("ul");
    tableToolTipUl.className = "list list--inline";
    const tableToolTipLiWeekly = document.createElement("li");
    tableToolTipLiWeekly.className = "list-item";

    // Create weekly button.
    const tableToolTipButtonWeekly = document.createElement("button");
    tableToolTipButtonWeekly.className = "link link--s link--i";
    tableToolTipButtonWeekly.textContent = "Weekly";
    tableToolTipLiWeekly.appendChild(tableToolTipButtonWeekly);
    tableToolTipUl.appendChild(tableToolTipLiWeekly);
    tableToolTipSplit.appendChild(tableToolTipUl);

    // Add separator.
    const tableToolTipSeparator = document.createElement("li");
    tableToolTipSeparator.className = "list-item bor";
    tableToolTipSeparator.textContent = "\u00A0";
    tableToolTipUl.appendChild(tableToolTipSeparator);
    tableToolTipUl.className = "list list--inline";

    // Create season button.
    const tableToolTipLiSeason = document.createElement("li");
    tableToolTipLiSeason.className = "list-item";
    const tableToolTipButtonSeason = document.createElement("button");
    tableToolTipButtonSeason.className = "link link--s link--h";
    tableToolTipButtonSeason.textContent = "Season";
    tableToolTipLiSeason.appendChild(tableToolTipButtonSeason);
    tableToolTipUl.appendChild(tableToolTipLiSeason);

    // Add the buttons to the tooltip.
    tableToolTipSplit.appendChild(tableToolTipUl);
    tableTooltipDiv.appendChild(tableToolTipSplit);

    // Attach event listeners to the season button.
    tableToolTipButtonSeason.addEventListener("click", (event) => {
      // Change button style to active.
      event.target.classList.toggle("link--h");
      event.target.classList.toggle("link--i");
      tableToolTipButtonWeekly.classList.toggle("link--h");
      tableToolTipButtonWeekly.classList.toggle("link--i");

      // Retrieve the table body.
      const tableBody = document.querySelector(
        ".table-body--leaderboard--requirements"
      );

      // Update the table body if it exists.
      if (tableBody) {
        tableBody.parentNode.replaceChild(
          createTopTeamRequirementsTableBody(seasonTopInfo),
          tableBody
        );
      }

      // Retrieve table footer span.
      const tableFooterSpan = document.querySelector(
        ".table-footer--leaderboard--requirements--span"
      );

      // Update the table footer span if it exists.
      if (tableFooterSpan) {
        tableFooterSpan.innerText = `* Estimation was calculated for ${memberCount} members and ${seasonRaces} season races.`;
      }
    });

    // Attach event listeners to the season button.
    tableToolTipButtonWeekly.addEventListener("click", (event) => {
      // Change button style to active.
      event.target.classList.toggle("link--h");
      event.target.classList.toggle("link--i");
      tableToolTipButtonSeason.classList.toggle("link--h");
      tableToolTipButtonSeason.classList.toggle("link--i");

      // Retrieve the table body.
      const tableBody = document.querySelector(
        ".table-body--leaderboard--requirements"
      );

      // Update the table body if it exists.
      if (tableBody) {
        tableBody.parentNode.replaceChild(
          createTopTeamRequirementsTableBody(weeklyTopInfo),
          tableBody
        );
      }

      // Retrieve table footer span.
      const tableFooterSpan = document.querySelector(
        ".table-footer--leaderboard--requirements--span"
      );

      // Update the table footer span if it exists.
      if (tableFooterSpan) {
        tableFooterSpan.innerText = `* Estimation was calculated for ${memberCount} members.`;
      }
    });

    return tableTooltipDiv;
  };

  /**
   * Create a table to show the top team requirements for the given topInfo.
   * @param {object} topInfo The top team requirements data to display.
   * @returns  {HTMLTableElement} The `table` element containing the top team requirements.
   */
  const createTopTeamRequirementsTable = (topInfo) => {
    const table = document.createElement("table");
    table.className = "table table--l table--striped table--leaderboard";

    // Create the table header element and its row.
    const header = document.createElement("thead");
    header.className = "table-head";
    const headerRow = document.createElement("tr");
    headerRow.className = "table-row";

    // Create the top position header.
    const topPositionHeader = document.createElement("th");
    topPositionHeader.className = "table-cell table-cell--top";
    topPositionHeader.innerText = "Top";
    topPositionHeader.setAttribute("colspan", "2");
    topPositionHeader.style.textAlign = "center";

    // Create the races header.
    const racesHeader = document.createElement("th");
    racesHeader.className = "table-cell table-cell--races";
    racesHeader.innerText = "Races";
    racesHeader.setAttribute("colspan", "3");

    // Create the points header .
    const pointsHeader = document.createElement("th");
    pointsHeader.className = "table-cell table-cell--points";
    pointsHeader.innerText = "Points";
    pointsHeader.setAttribute("colspan", "3");

    // Create the daily member races header.
    const dailyMemberRacesHeader = document.createElement("th");
    dailyMemberRacesHeader.className = "table-cell table-cell--points";
    dailyMemberRacesHeader.innerHTML = "Daily Member Races";
    dailyMemberRacesHeader.setAttribute("colspan", "3");

    // Add table elements to the table.
    headerRow.appendChild(topPositionHeader);
    headerRow.appendChild(racesHeader);
    headerRow.appendChild(pointsHeader);
    headerRow.appendChild(dailyMemberRacesHeader);
    header.appendChild(headerRow);
    table.appendChild(header);

    // Create the table body element and add it to the table element.
    const body = createTopTeamRequirementsTableBody(topInfo);
    table.appendChild(body);

    // Create the table footer element.
    const footer = document.createElement("tfoot");
    footer.className = "table-foot";
    const footerRow = document.createElement("tr");
    footerRow.className = "table-row";
    const footerCell = document.createElement("td");
    footerCell.className = "table-cell tar prm";
    footerCell.setAttribute("colspan", "11");
    const footerCellSpan = document.createElement("span");
    footerCellSpan.className =
      "tsxs tc-ts tsi table-footer--leaderboard--requirements--span";
    footerCellSpan.innerText = `* Estimation was calculated for ${memberCount} members.`;

    // Add the table footer to the table.
    footerCell.appendChild(footerCellSpan);
    footerRow.appendChild(footerCell);
    footer.appendChild(footerRow);
    table.appendChild(footer);

    // Return the table element.
    return table;
  };

  /**
   * Create the top team requirements widget.
   * @param {object} topInfo the top team requirements data.
   * @returns {HTMLDivElement} The `div` element containing the top team requirements widget.
   */
  const createTopTeamRequirementsWidget = (topInfo) => {
    const topTeamRequirementsTable = createTopTeamRequirementsTable(topInfo);

    const topTeamRequirementsWidget = document.createElement("div");
    topTeamRequirementsWidget.className = "row row--o well well--b well--l";
    const topInfoTitle = document.createElement("h3");
    topInfoTitle.className = "mbs";
    topInfoTitle.innerText = "Top Team Requirements";
    topTeamRequirementsWidget.appendChild(topInfoTitle);
    const topInfoTableTooltip = createTableTooltip();
    topTeamRequirementsWidget.appendChild(topInfoTableTooltip);
    topTeamRequirementsWidget.appendChild(topTeamRequirementsTable);
    return topTeamRequirementsWidget;
  };

  // Get the container div for the tables and the leaderboard table div.
  const tablesContainerDiv = await waitForElm(".well--p.well--l_p");
  const leaderboardTableDiv = document.querySelector(
    ".table--leaderboard"
  )?.parentElement;

  // Insert the top team requirements table if the leaderboard container and table exist.
  if (tablesContainerDiv && leaderboardTableDiv) {
    tablesContainerDiv.insertBefore(
      createTopTeamRequirementsWidget(weeklyTopInfo),
      leaderboardTableDiv.nextSibling
    );
  } else {
    console.error("Could not find the container div or leaderboard table div.");
  }
})();

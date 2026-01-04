// ==UserScript==
// @name         Nitro Type XP Tracker
// @version      3.8
// @description  Tracks and estimates hourly XP rate in Nitro Type races
// @author       TensorFlow - Dvorak
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.1/dexie.min.js
// @require https://update.greasyfork.org/scripts/501960/1418069/findReact.js
// @require https://update.greasyfork.org/scripts/501961/1418070/CreateLogger.js
// @require https://update.greasyfork.org/scripts/501962/1418071/drawXpPieChart.js
// @license      MIT
// @namespace https://greasyfork.org/users/1331131-tensorflow-dvorak
// @downloadURL https://update.greasyfork.org/scripts/500719/Nitro%20Type%20XP%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/500719/Nitro%20Type%20XP%20Tracker.meta.js
// ==/UserScript==

/* globals Dexie, findReact, createLogger, drawXpPieChart */

const logging = createLogger("Nitro Type XP Tracker");

// Config storage
const db = new Dexie("XPTracker");
db.version(31).stores({
  races: "++id, timestamp, xp, placement, accuracy, wampus, friends, goldBonus, speed, other",
  totalXp: "key, value",
  session: "key, value"
});
db.open().catch(function (e) {
  logging.error("Init")("Failed to open up the config database", e);
});

// Initialize variables for XP tracking
let xpAtStartOfRace = 0;
let totalXpEarned = 0;
let raceStartTime = 0;
let firstRaceStartTime = null;
let drawerOpen = true;

const xpCategories = {
  "placement": 0,
  "accuracy": 0,
  "wampus": 0,
  "friends": 0,
  "goldBonus": 0,
  "speed": 0,
  "other": 0
};

const cumulativeXpCategories = {
  "placement": 0,
  "accuracy": 0,
  "wampus": 0,
  "friends": 0,
  "goldBonus": 0,
  "speed": 0,
  "other": 0
};

function createXpInfoUI() {
  let xpInfoContainer = document.getElementById("xp-info-container");
  if (!xpInfoContainer) {
    xpInfoContainer = document.createElement("div");
    xpInfoContainer.id = "xp-info-container";
    xpInfoContainer.style.zIndex = "1000";
    xpInfoContainer.style.backgroundColor = "rgba(34, 34, 34, 0.9)";
    xpInfoContainer.style.color = "#fff";
    xpInfoContainer.style.padding = "20px";
    xpInfoContainer.style.fontFamily = "'Roboto', sans-serif";
    xpInfoContainer.style.fontSize = "16px";
    xpInfoContainer.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
    xpInfoContainer.style.position = "fixed";
    xpInfoContainer.style.top = "20px";
    xpInfoContainer.style.right = "0px";
    xpInfoContainer.style.width = "300px";
    xpInfoContainer.style.transition = "right 0.3s ease-in-out";
    xpInfoContainer.innerHTML = `
        <div id="xp-drawer-tab" style="position: absolute; top: 0; left: -40px; width: 40px; height: 100%; background-color: rgba(34, 34, 34, 0.9); border-radius: 10px 0 0 10px; cursor: pointer;"></div>
        <h3 style="margin-top: 0; font-size: 18px; text-align: center;">XP Meter</h3>
        <table style="width: 100%; margin-top: 10px;">
          <tr>
            <td>Total XP Earned:</td>
            <td id='total-xp-earned'>0</td>
          </tr>
          <tr>
            <td>Estimated Hourly XP:</td>
            <td id='hourly-xp-rate'>0</td>
          </tr>
          <tr>
            <td>Average XP per Race:</td>
            <td id='avg-xp-per-race'>0</td>
          </tr>
          <tr>
            <td>Races in Last Hour:</td>
            <td id='races-last-hour'>0</td>
          </tr>
          <tr>
            <td>Estimated Hourly Races:</td>
            <td id='hourly-races-rate'>0</td>
          </tr>
        </table>
        <button id="reset-xp-tracker" style="margin-top: 10px; padding: 8px 15px; width: 100%; background-color: #ff4d4d; border: none; color: #fff; border-radius: 5px; cursor: pointer;">Reset</button>
        <canvas id="xpPieChart" style="margin-top: 20px;" width="300" height="300"></canvas> <!-- Updated width and height -->
    `;
    document.body.appendChild(xpInfoContainer);

    // Add event listener for drawer tab
    document.getElementById("xp-drawer-tab").addEventListener("click", toggleDrawer);

    // Add event listener for reset button
    document.getElementById("reset-xp-tracker").addEventListener("click", resetXpTracker);

    // Draw initial pie chart
    drawXpPieChart();
  }
}

function toggleDrawer() {
  const xpInfoContainer = document.getElementById("xp-info-container");
  if (xpInfoContainer.style.right === "0px") {
    xpInfoContainer.style.right = "-320px";
    drawerOpen = false;
  } else {
    xpInfoContainer.style.right = "0px";
    drawerOpen = true;
  }
}

async function loadSessionData() {
  logging.info("LoadSessionData")("Loading session data...");

  const totalXpResult = await db.totalXp.get("totalXpEarned");
  if (totalXpResult) {
    totalXpEarned = totalXpResult.value;
    document.getElementById('total-xp-earned').textContent = formatNumber(totalXpEarned);
  } else {
    totalXpEarned = 0;
  }
  logging.info("Total XP Earned")(totalXpEarned);

  const firstRaceStartTimeResult = await db.session.get("firstRaceStartTime");
  if (firstRaceStartTimeResult) {
    firstRaceStartTime = firstRaceStartTimeResult.value;
  } else {
    firstRaceStartTime = Date.now();
    await db.session.put({ key: "firstRaceStartTime", value: firstRaceStartTime });
  }
  logging.info("First Race Start Time")(new Date(firstRaceStartTime).toLocaleString());

  updateHourlyXpRate();
}

async function updateXpInfo() {
  const raceEndTime = Date.now();
  const currentXp = getCurrentXp();
  const xpEarned = currentXp - xpAtStartOfRace;
  totalXpEarned += xpEarned;

  logging.info("XP Earned This Race")(xpEarned);
  logging.info("Total XP Earned")(totalXpEarned);

  // Save race data
  const reactFiberNode = getReactFiberNode();
  const categorizedXp = categorizeXp(reactFiberNode.state.rewards);

  await db.races.add({
    timestamp: raceEndTime,
    xp: xpEarned,
    placement: categorizedXp.placement,
    accuracy: categorizedXp.accuracy,
    wampus: categorizedXp.wampus,
    friends: categorizedXp.friends,
    goldBonus: categorizedXp.goldBonus,
    speed: categorizedXp.speed,
    other: categorizedXp.other
  });

  await db.totalXp.put({ key: "totalXpEarned", value: totalXpEarned });

  // Update the XP categories
  Object.keys(categorizedXp).forEach(category => {
    xpCategories[category] += categorizedXp[category];
  });

  // Update cumulative XP categories for the last hour
  const currentTime = Date.now();
  const oneHourAgo = currentTime - (60 * 60 * 1000);
  const recentRaces = await db.races.where("timestamp").above(oneHourAgo).toArray();

  cumulativeXpCategories.placement = recentRaces.reduce((acc, race) => acc + race.placement, 0);
  cumulativeXpCategories.accuracy = recentRaces.reduce((acc, race) => acc + race.accuracy, 0);
  cumulativeXpCategories.wampus = recentRaces.reduce((acc, race) => acc + race.wampus, 0);
  cumulativeXpCategories.friends = recentRaces.reduce((acc, race) => acc + race.friends, 0);
  cumulativeXpCategories.goldBonus = recentRaces.reduce((acc, race) => acc + race.goldBonus, 0);
  cumulativeXpCategories.speed = recentRaces.reduce((acc, race) => acc + race.speed, 0);
  cumulativeXpCategories.other = recentRaces.reduce((acc, race) => acc + race.other, 0);

  // Draw updated pie chart
  drawXpPieChart();

  // Update the hourly XP rate
  updateHourlyXpRate();

  // Prepare for the next race
  raceStartTime = Date.now();
  xpAtStartOfRace = getCurrentXp();
}

function getReactFiberNode() {
  const xpElements = document.getElementsByClassName("raceResults-reward-xp tar tss");
  if (xpElements.length > 0) {
    const lastXpElement = xpElements[xpElements.length - 1];
    const reactFiberNode = findReact(lastXpElement);
    if (reactFiberNode) {
      return reactFiberNode;
    }
  }
  return null;
}

function getCurrentXp() {
  const xpElements = document.getElementsByClassName("raceResults-reward-xp tar tss");
  if (xpElements.length > 0) {
    const lastXpElement = xpElements[xpElements.length - 1];
    const reactFiberNode = findReact(lastXpElement);
    if (reactFiberNode) {
      logging.debug("React Fiber XP Rewards")(reactFiberNode.state.rewards);
      const totalXp = reactFiberNode.state.rewards.reduce((acc, reward) => acc + reward.experience, 0);
      return totalXp;
    }
  }
  return 0; // Default value if XP element is not found
}

function categorizeXp(rewards) {
  const categories = {
    "placement": 0,
    "accuracy": 0,
    "wampus": 0,
    "friends": 0,
    "goldBonus": 0,
    "speed": 0,
    "other": 0
  };

  rewards.forEach(reward => {
    const xp = reward.experience;
    if (reward.label.includes("Place")) {
      categories.placement += xp;
    } else if (reward.label.includes("Accuracy")) {
      categories.accuracy += xp;
    } else if (reward.label.includes("Wampus")) {
      categories.wampus += xp;
    } else if (reward.label.includes("Friends")) {
      categories.friends += xp;
    } else if (reward.label.includes("Gold Bonus")) {
      categories.goldBonus += xp;
    } else if (reward.label.includes("Speed")) {
      categories.speed += xp;
    } else {
      categories.other += xp;
    }
  });

  return categories;
}

async function updateHourlyXpRate() {
  const currentTime = Date.now();
  const oneHourAgo = currentTime - (60 * 60 * 1000);

  const recentRaces = await db.races.where("timestamp").above(oneHourAgo).toArray();
  const racesCount = recentRaces.length;

  if (racesCount > 0) {
    const totalPlacementXp = recentRaces.reduce((acc, race) => acc + race.placement, 0);
    const totalAccuracyXp = recentRaces.reduce((acc, race) => acc + race.accuracy, 0);
    const totalWampusXp = recentRaces.reduce((acc, race) => acc + race.wampus, 0);
    const totalFriendsXp = recentRaces.reduce((acc, race) => acc + race.friends, 0);
    const totalGoldBonusXp = recentRaces.reduce((acc, race) => acc + race.goldBonus, 0);
    const totalSpeedXp = recentRaces.reduce((acc, race) => acc + race.speed, 0);
    const totalOtherXp = recentRaces.reduce((acc, race) => acc + race.other, 0);
    const totalXp = totalPlacementXp + totalAccuracyXp + totalWampusXp + totalFriendsXp + totalGoldBonusXp + totalSpeedXp + totalOtherXp;

    const firstRecentRaceTime = recentRaces[0].timestamp;
    const totalDurationInMinutes = (currentTime - firstRecentRaceTime) / 1000 / 60; // in minutes
    const xpPerMinute = totalXp / totalDurationInMinutes;
    const projectedHourlyXpRate = xpPerMinute * 60; // Projected XP for 60 minutes

    const totalRaceTime = recentRaces.reduce((acc, race, index, array) => {
      if (index === 0) return acc;
      return acc + (array[index].timestamp - array[index - 1].timestamp);
    }, 0);

    const avgRaceTime = totalRaceTime / (racesCount - 1) / 1000; // in seconds
    const avgXpPerRace = totalXp / racesCount; // Average XP per race
    const estimatedHourlyRaces = 60 / (avgRaceTime / 60); // Estimated races per hour

    document.getElementById('hourly-xp-rate').textContent = formatNumber(Math.round(projectedHourlyXpRate));
    document.getElementById('avg-xp-per-race').textContent = formatNumber(avgXpPerRace.toFixed(2));
    document.getElementById('hourly-races-rate').textContent = formatNumber(Math.round(estimatedHourlyRaces));

    // Update the XP categories
    xpCategories.placement = totalPlacementXp / racesCount;
    xpCategories.accuracy = totalAccuracyXp / racesCount;
    xpCategories.wampus = totalWampusXp / racesCount;
    xpCategories.friends = totalFriendsXp / racesCount;
    xpCategories.goldBonus = totalGoldBonusXp / racesCount;
    xpCategories.speed = totalSpeedXp / racesCount;
    xpCategories.other = totalOtherXp / racesCount;

    // Update cumulative XP categories for the last hour
    cumulativeXpCategories.placement = totalPlacementXp;
    cumulativeXpCategories.accuracy = totalAccuracyXp;
    cumulativeXpCategories.wampus = totalWampusXp;
    cumulativeXpCategories.friends = totalFriendsXp;
    cumulativeXpCategories.goldBonus = totalGoldBonusXp;
    cumulativeXpCategories.speed = totalSpeedXp;
    cumulativeXpCategories.other = totalOtherXp;

    // Draw updated pie chart
    drawXpPieChart();
  } else {
    document.getElementById('hourly-xp-rate').textContent = "0";
    document.getElementById('avg-xp-per-race').textContent = "0";
    document.getElementById('hourly-races-rate').textContent = "0";
  }

  document.getElementById('races-last-hour').textContent = formatNumber(racesCount);
}

async function resetXpTracker() {
  await db.races.clear();
  await db.totalXp.clear();
  await db.session.clear();

  totalXpEarned = 0;
  xpCategories.placement = 0;
  xpCategories.accuracy = 0;
  xpCategories.wampus = 0;
  xpCategories.friends = 0;
  xpCategories.goldBonus = 0;
  xpCategories.speed = 0;
  xpCategories.other = 0;

  cumulativeXpCategories.placement = 0;
  cumulativeXpCategories.accuracy = 0;
  cumulativeXpCategories.wampus = 0;
  cumulativeXpCategories.friends = 0;
  cumulativeXpCategories.goldBonus = 0;
  cumulativeXpCategories.speed = 0;
  cumulativeXpCategories.other = 0;

  firstRaceStartTime = Date.now();

  document.getElementById('total-xp-earned').textContent = "0";
  document.getElementById('hourly-xp-rate').textContent = "0";
  document.getElementById('races-last-hour').textContent = "0";
  document.getElementById('avg-xp-per-race').textContent = "0";
  document.getElementById('hourly-races-rate').textContent = "0";

  // Draw updated pie chart
  drawXpPieChart();

  await db.session.put({ key: "firstRaceStartTime", value: firstRaceStartTime });
  logging.info("Reset")("XP Tracker has been reset");
}

function initializeXpTracker() {
  createXpInfoUI();

  const raceContainer = document.getElementById("raceContainer");

  if (raceContainer) {
    const resultObserver = new MutationObserver(([mutation], observer) => {
      for (const node of mutation.addedNodes) {
        if (node.classList?.contains("race-results")) {
          logging.info("Update")("Race Results received");

          // Update XP info at the end of the race
          updateXpInfo();

          observer.observe(raceContainer, { childList: true, subtree: true });
          break;
        }
      }
    });
    resultObserver.observe(raceContainer, { childList: true, subtree: true });
  } else {
    logging.error("Init")("Race container not found, retrying...");
    setTimeout(initializeXpTracker, 1000);
  }
}

window.addEventListener("load", async () => {
  createXpInfoUI();
  await loadSessionData();
  initializeXpTracker();

  // Start a new race session
  raceStartTime = Date.now();
  xpAtStartOfRace = getCurrentXp();
});

// Utility function to format timestamp
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toString();
}

// Utility function to format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
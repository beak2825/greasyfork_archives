// ==UserScript==
// @name         qol.zed
// @namespace    qol.zed.zero.nao
// @version      1.7.4
// @description  qol updates for zed.city
// @author       root
// @match        https://www.zed.city/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/526352/qolzed.user.js
// @updateURL https://update.greasyfork.org/scripts/526352/qolzed.meta.js
// ==/UserScript==

let data = {};
let forumData = {};
let vehicleInventory = {};
let optimalInventory;
let weaponDurability = 100;
let csrfToken = localStorage.getItem("root-csrf-token") || "";

if (!localStorage.getItem("root-saved-timers")) {
  localStorage.setItem("root-saved-timers", JSON.stringify({}));
}
if (!localStorage.getItem("root-xp-display")) {
  localStorage.setItem("root-xp-display", "true");
}
if (!localStorage.getItem("root-market-data")) {
  localStorage.setItem("root-market-data", JSON.stringify({}));
}
if (!localStorage.getItem("root-exploration-data")) {
  localStorage.setItem("root-exploration-data", JSON.stringify({}));
}
if (!localStorage.getItem("root-gym-data")) {
  localStorage.setItem("root-gym-data", JSON.stringify([]));
}

let market_data = JSON.parse(localStorage.getItem("root-market-data"));

let store_items = {};
let current_inventory = {};
let limit;
let current_location = "City";

const ENERGY = "⚡";
const RAD = "☢";
const XP = "🏆";
const RAID = "🛡️";
const FURNACE = "🔥";
const RTOWER = "🗼";
const JUNKSTORE = "🛒";
const BOOSTER = "🍫";

const SEARCH = "🔍";
const TOGGLE = "🔃";

const ITEM_LIMIT = 360;
const TIMER_THRESHOLD = 10 * 60; // 10 minutes

const symbols = {
  energy: ENERGY,
  rad: RAD,
  xp: XP,
  raid: RAID,
  furnace: FURNACE,
  radio_tower: RTOWER,
  junk: JUNKSTORE,
  booster: BOOSTER,
};

const LOCATION_EXPLORATION_ID = {
  "Fuel Depot": 0,
  "Reclaim Zone": 1,
  "The Reserve": 2,
  "Military Base": 3,
  "Demolition Site": 4,
  "Construction Yard": 5,
};

(function () {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this._interceptedURL = url;
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    this.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        try {
          const response = JSON.parse(this.responseText);
          const eventData = { url: this._interceptedURL, response };

          // Dispatch a custom event for other scripts
          window.dispatchEvent(
            new CustomEvent("xhrIntercepted", { detail: eventData }),
          );
        } catch (e) {
          console.error("Error processing intercepted response:", e);
        }
      }
    });

    return originalSend.apply(this, arguments);
  };
})();

window.addEventListener("xhrIntercepted", function (e) {
  const { url, response } = e.detail;
  if (url.includes("getStats")) {
    data = response;
    updateDisplay();
  } else if (url.includes("store_id")) {
    limit = response.limits?.limit || 0;
    let limitLeft = response.limits?.limit_left || 0;
    limit = limit - limitLeft;
    insertItemLimit(limit);
    if (url.includes("junk")) {
      handleJunkStore(response);
    }
    handleNPCStore(response);
  } else if (url.includes("getForum")) {
    handleForumData(response);
  } else if (url.includes("getStronghold")) {
    handleStronghold(response);
  } else if (url.includes("getRadioTower")) {
    handleRadioTower(response);
  } else if (url.includes("loadItems")) {
    handleWeaponDurability(response);
    calculateNetworth(response);
    handleVehicleInventory(response);
  } else if (url.includes("getMarket") && !url.includes("getMarketUser")) {
    saveMarketPrices(response);
  } else if (url.includes("getRoom")) {
    handleGetRoom(response);
    saveExplorationData(response);
  } else if (url.includes("getLocation")) {
    handleLocation(response);
  } else if (url.includes("startJob")) {
    handleStartJob(response);
  } else if (url.includes("getRecipes")) {
    handlegetRecipes(response);
  } else if (url.includes("getRadioTower")) {
    handleRadioTower(response);
  } else if (url.includes("csrfToken")) {
    handleCsrfToken(response);
  }
});

function handleCsrfToken(response) {
  console.log("Handling CSRF Token");
  csrfToken = response.token;
  localStorage.setItem("root-csrf-token", csrfToken);
}

function createTimerDiv(name, link, timeLeft) {
  const div = document.createElement("a");
  div.href = link;
  div.innerText = symbols[name] || name;
  div.className = `${name}-root`;
  div.title = name.toUpperCase();
  const timeLeftDiv = document.createElement("div");
  timeLeftDiv.id = `${name}TimeLeft`;
  timeLeftDiv.className = "timer";
  timeLeftDiv.timeLeft = timeLeft;
  timeLeftDiv.innerText = getDayHourMinute(timeLeft);
  timeLeftDiv.style.cursor = "pointer";
  div.appendChild(timeLeftDiv);

  return div;
}

function updateDisplay() {
  const energyBar = document.querySelector("div.main-stat:nth-child(1)");
  const radBar = document.querySelector("div.rad");
  const moraleBar = document.querySelector("div.morale");
  const lifeBar = document.querySelector("div.life");
  const money = document.querySelector(".stat-money");
  const xpIcon = document.querySelector(
    ".q-col-gutter-md > div:nth-child(3) > div:nth-child(1)",
  );
  if (!(energyBar && radBar && moraleBar && lifeBar && xpIcon && money)) {
    setTimeout(updateDisplay, 200);
    return;
  }
  let dataContainer = document.getElementById("dataContainer");
  if (!dataContainer) {
    dataContainer = document.createElement("div");
    dataContainer.id = "dataContainer";
    dataContainer.style = `
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin: 0 auto;
    background-color: rgba(9, 10, 11);
    font-family: Oswald,sans-serif;
    font-size: 15px;
    padding-left: 5px;
    padding-right: 5px;
`;
    document
      .querySelector(".q-toolbar > div:nth-child(1)")
      .parentElement.insertAdjacentElement("afterend", dataContainer);
  }
  let energyMax = data.membership ? 150 : 100;
  let energyRegenRate = data.membership ? 0.5 : 1 / 3;
  let radMax = data.stats.max_rad;
  let radRegenRate = 1 / 5;

  let energyLeft = energyMax - data.energy - 5;
  let radLeft = radMax - data.rad - 1;

  let energyTimeLeft =
    (energyLeft / energyRegenRate) * 60 + data.energy_regen || 0;
  let radTimeLeft = (radLeft / radRegenRate) * 60 + data.rad_regen || 0;

  let energyLeftDiv = document.getElementById("energyTimeLeft");
  if (energyLeftDiv) {
    energyLeftDiv.textContent = getDayHourMinute(energyTimeLeft);
    energyLeftDiv.timeLeft = energyTimeLeft;
  } else {
    const energyDiv = createTimerDiv(
      "energy",
      "/stronghold/1781362",
      energyTimeLeft,
    );
    dataContainer.appendChild(energyDiv);
  }

  let radLeftDiv = document.getElementById("radTimeLeft");
  if (radLeftDiv) {
    radLeftDiv.textContent = getDayHourMinute(radTimeLeft);
    radLeftDiv.timeLeft = radTimeLeft;
  } else {
    const radDiv = createTimerDiv("rad", "/scavenge", radTimeLeft);
    dataContainer.appendChild(radDiv);
  }

  let xpEnd = Math.round(data.xp_end);
  let xpNow = Math.round(data.experience);

  if ($("#xpData").length > 0) {
    $("#xpData").text(`${symbols.xp} ${xpEnd - xpNow}`);
  } else {
    const xpData = document.createElement("div");
    xpData.id = "xpData";
    xpData.className = "xp-root";
    xpData.innerHTML = `${symbols.xp} ${xpEnd - xpNow} <span id='xpCurrentHigh'>[${xpNow}/${xpEnd}]</span>`;
    xpData.title = "XP";
    dataContainer.appendChild(xpData);

    const currentDisplay = localStorage.getItem("root-xp-display") == "true";
    if (currentDisplay) {
      $("#xpCurrentHigh").css("display", "inline");
    } else {
      $("#xpCurrentHigh").css("display", "none");
    }

    xpData.addEventListener("click", () => {
      $("#xpCurrentHigh").css(
        "display",
        $("#xpCurrentHigh").css("display") == "none" ? "inline" : "none",
      );
      localStorage.setItem(
        "root-xp-display",
        $("#xpCurrentHigh").css("display") == "none" ? "false" : "true",
      );
    });
  }

  data.raid_cooldown = data.raid_cooldown || -1;
  let raidTimeLeft = getDayHourMinute(data.raid_cooldown);
  let raidTimeLeftDiv = document.getElementById("raidTimeLeft");
  if (raidTimeLeftDiv) {
    raidTimeLeftDiv.textContent = raidTimeLeft;
    raidTimeLeftDiv.timeLeft = data.raid_cooldown;
  } else {
    const raidDiv = createTimerDiv("raid", "/raids", data.raid_cooldown);
    dataContainer.appendChild(raidDiv);
  }

  // add booster
  const booserCd = data.booster_cooldown || -1;

  let boosterTimeLeft = document.getElementById("boosterTimeLeft");
  if (boosterTimeLeft) {
    boosterTimeLeft.textContent = getDayHourMinute(booserCd);
    boosterTimeLeft.timeLeft = booserCd;
  } else {
    const boosterDiv = createTimerDiv("booster", "/inventory", booserCd);
    dataContainer.appendChild(boosterDiv);
  }

  addAdditionalTimers(dataContainer);
  addOtherTimersDropDown(dataContainer);
}

function addAdditionalTimers(dataContainer) {
  const savedTimers = JSON.parse(localStorage.getItem("root-saved-timers"));
  const currentTime = new Date();
  for (const timer in savedTimers) {
    const finishTimeinSeconds = savedTimers[timer].finishTimeinSeconds * 1;
    const timeLeft = Math.round(
      (finishTimeinSeconds - currentTime.getTime()) / 1000,
    );
    const link = savedTimers[timer].url;
    let timerLeftDiv = document.getElementById(timer + "TimeLeft");
    if (timerLeftDiv) {
      timerLeftDiv.timeLeft = timeLeft;
    } else {
      const additionalTimerDiv = createTimerDiv(timer, link, timeLeft);
      dataContainer.appendChild(additionalTimerDiv);
    }
  }
}

function getDayHourMinute(seconds) {
  if (seconds <= 0) {
    return "00:00";
  }

  let time = [];
  let days = Math.floor(seconds / 86400);
  seconds -= days * 86400;
  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  days = days ? (days < 10 ? "0" + days : days) : "00";
  hours = hours ? (hours < 10 ? "0" + hours : hours) : "00";
  minutes = minutes ? (minutes < 10 ? "0" + minutes : minutes) : "00";
  seconds = seconds ? (seconds < 10 ? "0" + seconds : seconds) : "00";

  if (days != "00" || time.length > 0) {
    time.push(days);
  }
  if (hours != "00" || time.length > 0) {
    time.push(hours);
  }
  if (minutes != "00" || time.length > 0) {
    time.push(minutes);
  }
  if (seconds != "00" || time.length > 0) {
    time.push(seconds);
  }

  return time.join(":");
}

function updateTimerValues() {
  const savedTimers = JSON.parse(localStorage.getItem("root-saved-timers"));
  const currentTime = new Date();
  for (const timer in savedTimers) {
    const element = document.querySelector("#" + timer + "TimeLeft");
    if (!element) continue;
    const finishTimeinSeconds = savedTimers[timer].finishTimeinSeconds * 1;
    const timeLeft = Math.round(
      (finishTimeinSeconds - currentTime.getTime()) / 1000,
    );
    element.timeLeft = timeLeft;
  }
}

function updateTimers() {
  //console.log("updateTimers");
  document.querySelectorAll(".timer").forEach((timer) => {
    if (timer.timeLeft * 1 <= -1) {
      //console.log("Found timer with timeLeft <= -1");
      timer.classList.add("alert");
      return;
    }
    //console.log("Updating timer with timeLeft", timer.timeLeft);
    const timeLeft = timer.timeLeft - 1;
    timer.timeLeft = timeLeft;

    if (timeLeft <= TIMER_THRESHOLD) {
      timer.classList.add("alert");
    } else {
      timer.classList.remove("alert");
    }
    if (timeLeft == 0) {
      timer.timeLeft = -1;
      const timerType = timer.id.replace("TimeLeft", "");
      let message = "";
      let link = "";
      const timerName = timerType.replaceAll("_", " ");

      if (timerType == "energy") {
        message = "Energy is full!";
        link = "/stronghold/1781362";
      } else if (timerType == "rad") {
        message = "Rad is full!";
        link = "/scavenge";
      } else if (timerType == "raid") {
        message = "Raid timer is up!";
        link = "/raids";
      } else if (timerType == "furnace") {
        message = "Furnace is empty!";
        link = "/stronghold/1781365";
      } else if (timerType == "radio_tower") {
        message = "Radio Tower has refreshed!";
        link = "/stronghold/1781367";
      } else if (timerType == "junk") {
        message = "Junk store buy is ready!";
        link = "/store/junk";
      } else if (timerType == "booster") {
        message = "Booster Cooldown is empty!";
        link = "/inventory";
      } else {
        message = `${timerName} is up!`;
      }
      sendNotification("Zed City [root]", message, link);
    }
    timer.innerText = getDayHourMinute(timeLeft);
  });
}

function sendNotification(title, body, link) {
  if (!("Notification" in window)) {
    // console.log("This browser does not support desktop notification");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const notification = new Notification(title, {
          body: body,
          icon: "https://www.google.com/s2/favicons?sz=64&domain=zed.city",
        });
        notification.onclick = () => {
          window.open(link);
          notification.close();
        };
      }
    });
  }
}

function insertItemLimit(n) {
  const element = document.querySelector(".text-h4");
  if (element) {
    if ($("#itemLimit").length > 0) {
      $("#itemLimit").text(` [ ${n} / ${ITEM_LIMIT} ]`);
    } else {
      element.innerHTML += `<div id="itemLimit"> [ ${n} / ${ITEM_LIMIT} ]</div>`;
    }

    element.style.color = n < ITEM_LIMIT ? "#00ff00" : "#ff0000";
  } else {
    setTimeout(insertItemLimit, 100, n);
  }
}

function updateMembership() {
  const tooltip = document.querySelector(".q-tooltip");
  if (!tooltip || !tooltip.textContent.includes("Membership")) {
    setTimeout(updateMembership, 300);
    return;
  }

  if (document.querySelector("#membershipTimer")) {
    document.querySelector("#membershipTimer").remove();
  }
  const membershipTimer = document.createElement("div");
  membershipTimer.id = "membershipTimer";
  membershipTimer.className = "timer full-width justify-center";
  membershipTimer.timeLeft = data.membership_expire;
  membershipTimer.innerText = getDayHourMinute(membershipTimer.timeLeft);
  tooltip.appendChild(membershipTimer);
}

setInterval(updateTimers, 1000);

const style = document.createElement("style");
style.innerHTML = `
  .timer {
    color: white;
    font-weight: bold;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    text-decoration: none !important;
    display: inline-block;
    width: 60px;
    text-align: center;
  }

  .energy-root {
    color: #ffb74d;
  }
  .rad-root {
    color: #66bb6a;
  }
  .xp-root {
    color: #9A57CC;
  }
  .raid-root {
    color: #f04949;
  }

  a {
    text-decoration: none;
  }

  .alert {
    color: red;
  font-size: 20px;
  font-weight: bold;
  }


  .arrow-menu {
    position: relative;
  }

  .menu-options {
      position: absolute;
      z-index: 100;
      margin-top: 5px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      width: 200px;
      background: black;
      right: 0;
    }

    .menu-item {
      padding: 12px 15px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: background-color 0.2s;
      overflow: auto;

      .timer {
        float: right;
      }
    }

    .menu-item:last-child {
      border-bottom: none;
    }

    .menu-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
        }

  .exploration-data-container {
    background: #3d474a;
    font-family: ZedFont, sans-serif;
    font-size: 18px;
  }

  .warning {
    position: absolute;
    left:0;
    background-color: #ff4242;
    border-radius: 5px;
    z-index: 999999999;
    height: 48px;
    padding: 14px;
    margin: 10px;
    transition: bottom 1s ease-out, opacity 0.5s ease-in-out;
  }

  .profit-div {
    font-family: Oswald;
  }

  li {
    overflow: auto;
  }

  

`;
document.head.appendChild(style);

function waitForElement(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
}

function forumUpdate() {
  // console.log("forum update");
  if (!window.location.href.includes("/forum")) {
    return;
  }
  $(".username:not([processed])").each(function () {
    const username = $(this).text();
    // console.log(username);
    if (forumData[username]) {
      $(this).wrap(`<a href="/profile/${forumData[username].userId}"></a>`);
    }
    $(this).attr("processed", true);
  });
  $(".forum-username:not([processed])").each(function () {
    const username = $(this).text();
    if (forumData[username]) {
      $(this).wrap(`<a href="/profile/${forumData[username].userId}"></a>`);
    }
    $(this).attr("processed", true);
  });
  setTimeout(forumUpdate, 1000);
}

function handleForumData(response) {
  // console.log("handling forum data");
  if (response.topics) {
    for (const topic of response.topics) {
      const authorID = topic.author.id;
      const author = topic.author.username;
      if (!forumData[author]) {
        forumData[author] = {
          userId: authorID,
        };
      }
      if (topic.reply_user) {
        const replyUserID = topic.reply_user.id;
        const replyUser = topic.reply_user.username;
        if (!forumData[replyUser]) {
          forumData[replyUser] = {
            userId: replyUserID,
          };
        }
      }
    }
  }
  if (response.posts) {
    for (const post of response.posts) {
      const authorID = post.author.id;
      const author = post.author.username;
      if (!forumData[author]) {
        forumData[author] = {
          userId: authorID,
        };
      }
    }
  }

  if (response.topic) {
    const authorID = response.topic.author.id;
    const author = response.topic.author.username;
    if (!forumData[author]) {
      forumData[author] = {
        userId: authorID,
      };
    }
  }
}

function checkPage() {
  if (window.location.href.includes("/forum")) {
    forumUpdate();
  } else if (window.location.href.includes("/stronghold/1781362")) {
    maxGymVal();
  }
}

function handleStronghold(response) {
  for (const strongholdId in response.stronghold) {
    const stronghold = response.stronghold[strongholdId];
    const codename = stronghold.codename;
    if (codename == "furnace") {
      const inProgress = stronghold.in_progress;
      if (!inProgress) {
        const savedTimers = JSON.parse(
          localStorage.getItem("root-saved-timers"),
        );
        savedTimers["furnace"] = {
          finishTimeinSeconds: -1,
          url: window.location.href,
        };
        localStorage.setItem("root-saved-timers", JSON.stringify(savedTimers));

        return;
      }

      const totalItems = stronghold?.items["item_requirement-1"]?.quantity;
      const timeEach =
        stronghold?.items["item_requirement-bp"]?.vars?.wait_time;
      const quantityEach =
        stronghold?.items["item_requirement-bp"]?.vars?.items?.[
          "item_requirement-1"
        ]?.qty;
      const completedSoFar = stronghold.iterationsPassed || 0;
      const currentTimeLeft = stronghold.timeLeft;

      if (timeEach && quantityEach && currentTimeLeft && totalItems) {
        const iterationsLeft = totalItems / quantityEach - completedSoFar - 1;
        const waitTimeLeft = timeEach * iterationsLeft + currentTimeLeft;
        const currenTime = new Date();
        const finishTimeinSeconds = currenTime.getTime() + waitTimeLeft * 1000;

        const savedTimers = JSON.parse(
          localStorage.getItem("root-saved-timers"),
        );
        savedTimers["furnace"] = {
          finishTimeinSeconds: finishTimeinSeconds,
          url: window.location.href,
        };
        localStorage.setItem("root-saved-timers", JSON.stringify(savedTimers));
      }
    }
  }
  updateTimerValues();
}

function handleRadioTower(response) {
  const expire = response.expire;
  if (expire) {
    const currenTime = new Date();
    const finishTimeinSeconds = currenTime.getTime() + expire * 1000;

    const savedTimers = JSON.parse(localStorage.getItem("root-saved-timers"));
    savedTimers["radio_tower"] = {
      finishTimeinSeconds: finishTimeinSeconds,
      url: window.location.href,
    };
    localStorage.setItem("root-saved-timers", JSON.stringify(savedTimers));
  }
  updateTimerValues();

  handleRadioTowerValues(response);
}

function handleJunkStore(response) {
  const expire = response.limits?.reset_time;
  if (expire) {
    const currenTime = new Date();
    const finishTimeinSeconds = currenTime.getTime() + expire * 1000;

    const savedTimers = JSON.parse(localStorage.getItem("root-saved-timers"));
    savedTimers["junk"] = {
      finishTimeinSeconds: finishTimeinSeconds,
      url: window.location.href,
    };
    localStorage.setItem("root-saved-timers", JSON.stringify(savedTimers));
  }
  updateTimerValues();
}

function updateServerTime() {
  if ($(".server-time").length == 0) {
    setTimeout(updateServerTime, 1000);
    return;
  }
  const serverTime = document.querySelector(".server-time");
  serverTime.style.whiteSpace = "nowrap";
  if (serverTime) {
    const logo_body = document.querySelector(".logo-body");
    logo_body.appendChild(serverTime);
  }
}

updateServerTime();

// Gym value prefill
function maxGymVal() {
  if ($("input").length < 4 || !data.energy) {
    setTimeout(maxGymVal, 1000);
    return;
  }
  const energy = data.energy;
  const iterations = energy / 5;

  $("input:not('processed')").each(function () {
    this.value = iterations;
    this.dispatchEvent(new Event("input"), { bubbles: true });
    $(this).attr("processed", true);
  });
}

// calls appropriate functions based on url
async function handleURL() {
  setTimeout(async function () {
    let url = window.location.href;

    // console.log("handling url", url);
    if (url.includes("/forum")) {
      forumUpdate();
    } else if (url.includes("/stronghold/1781362")) {
      maxGymVal();
    } else if (url.includes("inventory")) {
      handleInventory();
      if (data.exploring) {
        showOptimalInventory();
      }
    } else if (url.includes("explore")) {
      display_exploration_data();
      checkVehicleInventoryWeight();
    } else if (url.includes("hunt")) {
      const latestLoadItems = await getLatestLoadItems();
      handleWeaponDurability(latestLoadItems);
      checkWeaponDurability();
    } else if (url.includes("scavenge/")) {
      //setTimeout(fixScavengeBar, 3000);
    }
  }, 500);
}

let url = window.location.href;
window.addEventListener("hashchange", handleURL);
window.addEventListener("popstate", handleURL);

const originalPushState = history.pushState;
history.pushState = function (...args) {
  originalPushState.apply(this, args);
  handleURL();
};

const originalReplaceState = history.replaceState;
history.replaceState = function (...args) {
  originalReplaceState.apply(this, args);
  handleURL();
};

// Store element states
const elementStates = new Map();

// Configure the elements you want to watch
const elementsToWatch = [];

// Function to check a single element
function checkElement(config) {
  const url = config.url;
  if (url && !window.location.href.includes(url)) {
    return;
  }

  const element = document.querySelector(config.selector);
  const isFound = element?.textContent === config.text;
  const wasPresent = elementStates.get(config.selector);

  if (isFound && !wasPresent) {
    // Element has appeared

    // console.log(config.text + " appeared!");
    elementStates.set(config.selector, true);
    config.callback();
  } else if (!isFound && wasPresent) {
    // Element has disappeared
    // console.log(config.text + " disappeared!");
    elementStates.set(config.selector, false);
  }
}
//
// Create observer that checks all elements
const observer = new MutationObserver(() => {
  elementsToWatch.forEach(checkElement);
});

// Start observing
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

// Example of how to add a new element to watch later:
function addElementToWatch(selector, text, url, callback) {
  elementsToWatch.push({ selector, text, url, callback });
  elementStates.set(selector, false);
}

addElementToWatch(".text-bold", "Membership Expires", "", () => {
  if (!data.membership) {
    return;
  }
  // console.log("updating membership");
  updateMembership();
});

// market price
addElementToWatch(".title div", "Create Listing", "/market-listings", () => {
  insertPrice();
});

// store qty
addElementToWatch(
  ".text-negative > span:nth-child(2) > span:nth-child(1)",
  "Cancel",
  "store/",
  () => {
    // console.log("store qty appeared!");
    insertQty();
  },
);

// furnace max items
addElementToWatch(
  "div.col-xs-6:nth-child(2) > button:nth-child(1) > span:nth-child(2) > span:nth-child(1)",
  "Craft",
  "/stronghold/1781365",
  () => {
    maxFurnaceVal();
  },
);

function handleInventory() {
  // console.log("handling inventory");
  if ($(".q-px-xs").length == 0) {
    setTimeout(handleInventory, 100);
    return;
  }

  if (!localStorage.getItem("root-itemworth")) {
    return;
  }
  // console.log("handling inventory");
  let itemworth = localStorage.getItem("root-itemworth");
  itemworth = Math.round(itemworth).toLocaleString();
  itemworth = "$" + itemworth;

  if ($("#root-itemworth").length > 0) {
    $("#root-itemworth").html(
      `<div id="root-itemworth"><span>Networth: </span><span id="networth">${itemworth}</span></div>`,
    );
  } else {
    const itemworthData = `<div id="root-itemworth"><span>Networth: </span><span id="networth">${itemworth}</span></div>`;
    $(".zed-grid").prepend(itemworthData);
  }
}

function calculateNetworth(response) {
  let networth = 0;
  if (response.items) {
    for (const item of response.items) {
      const itemName = item.name;
      const itemQuantity = item.quantity;
      if (market_data[itemName]) {
        const itemPrice = market_data[itemName];
        const itemValue = itemPrice * itemQuantity;
        networth += itemValue;
      }
    }
  }
  localStorage.setItem("root-itemworth", networth);
}

function addItemWorth() {
  $(".q-item__label:not([processed])").each(function () {
    const itemName = $(this).text();
    $(this).attr("processed", true);
    if (market_data[itemName]) {
      const itemPrice = market_data[itemName];
      const itemValue = itemPrice * store_items[itemName];
      $(this).append(`<div id="itemWorth">[${itemValue}]</div>`);
    }
  });
}

function saveMarketPrices(response) {
  const currrentPrices = JSON.parse(localStorage.getItem("root-market-data"));

  // keep track of the cheapest item
  let lowestPrice = Infinity;
  let cheapestItem = "";

  // keep track of the biggest price drop
  let biggestPriceDrop = 0;
  let biggestPriceDropItem = "";
  let prevPrice = 0;
  let newPrice = 0;

  for (const item of response.items) {
    const name = item.name;
    const price = item.market_price;
    let prevPriceTemp = currrentPrices[name];

    if (prevPriceTemp) {
      const currentDiff = prevPriceTemp - price;
      if (currentDiff > biggestPriceDrop) {
        biggestPriceDrop = currentDiff;
        biggestPriceDropItem = name;
        newPrice = price;
        prevPrice = prevPriceTemp;
      }
    }

    market_data[name] = price;
    if (price - lowestPrice < 0) {
      lowestPrice = price;
      cheapestItem = name;
    }
  }
  localStorage.setItem("root-market-data", JSON.stringify(market_data));

  // insert data about lowest item to the page

  console.log("Adding cheapest item to page");
  console.log(cheapestItem, lowestPrice);
  insertCheapItemsData(
    cheapestItem,
    lowestPrice,
    biggestPriceDrop,
    biggestPriceDropItem,
    prevPrice,
    newPrice,
  );
}

function insertCheapItemsData(
  cheapestItem,
  lowestPrice,
  biggestPriceDrop,
  biggestPriceDropItem,
  prevPrice,
  newPrice,
) {
  const element = document.querySelector(".q-px-xs > div:nth-child(2)");
  if (element) {
    // Check if cheapest item div already exists
    if ($("#cheapestItem").length > 0) {
      $("#cheapestItem").html(
        `<span>Cheapest Item: </span><span id="cheapestItemName">${cheapestItem}</span><span id="cheapestItemPrice"> [${lowestPrice}]</span>`,
      );
    } else {
      const cheapestItemData = `<div id="cheapestItem" style="cursor: pointer; color: green;"><span>Cheapest Item: </span><span id="cheapestItemName">${cheapestItem}</span><span id="cheapestItemPrice"> [${lowestPrice}]</span></div>`;
      element.innerHTML += cheapestItemData;
    }

    // Check if biggest price drop div already exists
    if (biggestPriceDrop > 0) {
      prevPrice = "$" + prevPrice.toLocaleString();
      newPrice = "$" + newPrice.toLocaleString();
      biggestPriceDrop = "$" + biggestPriceDrop.toLocaleString();
      if ($("#biggestPriceDropItem").length > 0) {
        $("#biggestPriceDropItem").html(
          `<span>Biggest Price Drop: </span><span id="biggestDropItemName">${biggestPriceDropItem}</span><span id="biggestDropPrice"> ${prevPrice} -> ${newPrice} [${biggestPriceDrop}]</span>`,
        );
      } else {
        const biggestDropData = `<div id="biggestPriceDropItem" style="cursor: pointer; color: blue;"><span>Biggest Price Drop: </span><span id="biggestDropItemName">${biggestPriceDropItem}</span><span id="biggestDropPrice"> ${prevPrice} -> ${newPrice} [${biggestPriceDrop}]</span></div>`;
        element.innerHTML += biggestDropData;
      }
    }

    // First, add data-item attributes and class to both divs
    $("#cheapestItem").attr("data-item", cheapestItem).addClass("itemSearch");
    $("#biggestPriceDropItem")
      .attr("data-item", biggestPriceDropItem)
      .addClass("itemSearch");

    // Remove any existing click handlers for the class
    $(".itemSearch").off("click");

    // Add a single event handler for all items with the itemSearch class
    $(".itemSearch").on("click", function () {
      const itemName = $(this).attr("data-item");
      const input = element.parentElement.querySelector("input");
      input.value = itemName;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  } else {
    // If element is not found yet, try again after a delay
    setTimeout(function () {
      insertCheapItemsData(
        cheapestItem,
        lowestPrice,
        biggestPriceDrop,
        biggestPriceDropItem,
        prevPrice,
        newPrice,
      );
    }, 500);
  }
}
function handleNPCStore(response) {
  limit = response.limits?.limit || 0;
  let limitLeft = response.limits?.limit_left || 0;
  limit = limit - limitLeft;
  // console.log(limit);

  for (const item of response.storeItems) {
    const name = item.name;
    const quantity = item.quantity;
    store_items[name] = quantity;
  }
  for (const item of response.userItems) {
    const name = item.name;
    const quantity = item.quantity;
    current_inventory[name] = quantity;
  }
}

function insertPrice() {
  if ($(".q-py-sm > div:nth-child(1)").length == 0) {
    setTimeout(insertPrice, 100);
    return;
  }

  const itemName = document.querySelector(
    ".q-py-sm > div:nth-child(1)",
  ).textContent;
  if (market_data[itemName]) {
    const price = market_data[itemName];
    const priceElementParet = document.querySelector(".zed-money-input");

    if (!priceElementParet) {
      setTimeout(insertPrice, 300);
      return;
    }
    const priceElement = priceElementParet.querySelector("input");

    if (!priceElement) {
      setTimeout(insertPrice, 100);
      return;
    }
    priceElement.value = price - 1;
    priceElement.dispatchEvent(new Event("input", { bubbles: true }));
    $(
      ".zed-money-input > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > i:nth-child(1)",
    ).css("color", "#da5aec");
  }
}

function insertQty() {
  const subtextElement = document.querySelector("div.grid-cont:nth-child(1)");
  const quantityElement = subtextElement.querySelector("input");
  const itemName = document.querySelector(
    ".small-modal > div:nth-child(1)",
  ).textContent;

  if (!quantityElement || !itemName) {
    console.log("quantity element: ", quantityElement);
    console.log("item name: ", itemName);
    setTimeout(insertQty, 500);
    return;
  }

  const quantity = Math.min(ITEM_LIMIT - limit, store_items[itemName] || 0);
  const isBuying = document
    .querySelector(
      "div.text-center:nth-child(2) > button:nth-child(1) > span:nth-child(2) > span:nth-child(1)",
    )
    .textContent.includes("Buy");
  if (isBuying) {
    quantityElement.value = quantity;
  } else {
    const inventoryQuantity = current_inventory[itemName] || 0;
    quantityElement.value = inventoryQuantity;
  }
  quantityElement.dispatchEvent(new Event("input", { bubbles: true }));
}

function maxFurnaceVal() {
  const container = document.querySelector(".small-modal");
  const inputElement = container.querySelector("input");
  if (!inputElement) {
    setTimeout(maxFurnaceVal, 100);
    return;
  }
  inputElement.value = 9999999;
  inputElement.dispatchEvent(new Event("input", { bubbles: true }));
}

function handleGetRoom(response) {
  const respawn_times = [];
  if (response.npcs) {
    for (const npc of response.npcs) {
      const respawn_time = npc.vars.respawn_time;
      if (respawn_time - 0 > 0) {
        respawn_times.push(respawn_time);
      }
    }
  }

  if (respawn_times.length > 0) {
    addRespawnTime(respawn_times);
  }
}

function addRespawnTime(respawn_times) {
  const elements = document.querySelectorAll(".defeated-text");
  if (elements.length == 0) {
    setTimeout(addRespawnTime, 100, respawn_times);
    return;
  }

  for (let i = 0; i < elements.length; i++) {
    const respawn_time = respawn_times[i];
    if (respawn_time) {
      if (elements[i].querySelector(".timer")) {
        elements[i].querySelector(".timer").remove();
      }

      const newTimer = document.createElement("div");
      newTimer.timeLeft = respawn_time;
      newTimer.className = "timer";
      newTimer.innerText = getDayHourMinute(respawn_time);
      newTimer.style.marginLeft = "10px";
      elements[i].appendChild(newTimer);
    }
  }
}

function scavengeButton() {
  const scavengeBtnStyle = document.createElement("style");
  scavengeBtnStyle.innerHTML = `
    button[data-cy="scavenge-btn"] {
          position: fixed;
          transform: translateX(-50%);
          left: 50%;
          top: 70%;
      }

      @media (max-width: 450px) {
          button[data-cy="scavenge-btn"] {
              top: 80%;
          }
      }
`;

  document.head.appendChild(scavengeBtnStyle);
}

function handleVehicleInventory(response) {
  if (current_location == "City") return;
  const vehicle_items = response.vehicle_items;
  if (!vehicle_items) return;
  market_data = JSON.parse(localStorage.getItem("root-market-data"));

  for (const item of vehicle_items) {
    const item_name = item.name;
    const item_quantity = item.quantity;
    const item_weight = item.vars.weight;

    if (market_data[item_name]) {
      vehicleInventory[item_name] = {
        amount: item_quantity,
        weight: item_weight,
        val: market_data[item_name],
      };
    }
  }

  optimalInventory = optimalItemsExploring(vehicleInventory, 20);
}

function optimalItemsExploring(itemsDict, capacity) {
  // Define a scaling factor to convert decimal weights to integers
  const SCALE_FACTOR = 100; // Allows for 2 decimal places

  // Scale capacity to an integer
  const scaledCapacity = Math.floor(capacity * SCALE_FACTOR);

  // Convert the problem to a standard 0/1 knapsack by "unpacking" items
  const items = [];
  const weights = [];
  const itemKeys = [];
  const originalIndices = []; // To track which original item each unpacked item belongs to

  let index = 0;
  for (const [key, details] of Object.entries(itemsDict)) {
    const { val, amount, weight } = details;

    // Handle fractional amounts (e.g., 0.5 units)
    const unitsToAdd = amount >= 1 ? Math.floor(amount) : 1;

    // For each unit of this item (up to amount), add as a separate item
    for (let i = 0; i < unitsToAdd; i++) {
      items.push(val);
      // Scale the weight to an integer
      weights.push(Math.floor(weight * SCALE_FACTOR));
      itemKeys.push(key);
      originalIndices.push(index);
    }
    index++;
  }

  const itemsCount = items.length;
  let optimalTable = Array.from({ length: itemsCount + 1 }, () =>
    Array(scaledCapacity + 1).fill(0),
  );

  // Fill the dynamic programming table
  for (let i = 1; i <= itemsCount; i++) {
    for (let j = 0; j <= scaledCapacity; j++) {
      if (weights[i - 1] <= j) {
        optimalTable[i][j] = Math.max(
          optimalTable[i - 1][j],
          optimalTable[i - 1][j - weights[i - 1]] + items[i - 1],
        );
      } else {
        optimalTable[i][j] = optimalTable[i - 1][j];
      }
    }
  }

  // Reconstruct the solution
  const selectedItemsWithDuplicates = [];
  let remainingCapacity = scaledCapacity;

  for (let i = itemsCount; i >= 1; i--) {
    if (
      optimalTable[i][remainingCapacity] >
      optimalTable[i - 1][remainingCapacity]
    ) {
      selectedItemsWithDuplicates.push({
        key: itemKeys[i - 1],
        weight: weights[i - 1] / SCALE_FACTOR, // Convert back to decimal for output
      });
      remainingCapacity -= weights[i - 1];
    }
  }

  // Count occurrences of each selected item
  const selectedItemsCounts = {};
  let totalWeight = 0;

  for (const item of selectedItemsWithDuplicates) {
    selectedItemsCounts[item.key] = (selectedItemsCounts[item.key] || 0) + 1;
    totalWeight += item.weight;
  }

  // Convert to array format with counts
  const selectedItems = Object.entries(selectedItemsCounts).map(
    ([item, count]) => ({
      item,
      count,
    }),
  );

  return {
    maxValue: optimalTable[itemsCount][scaledCapacity],
    selectedItems: selectedItems,
    selectedItemsRaw: selectedItemsWithDuplicates.reverse(), // For debugging
    totalWeight: totalWeight, // Show the actual used weight
  };
}

function showOptimalInventory() {
  optimalInventory = optimalInventory;
  if (!optimalInventory) {
    return;
  }
  const optimalItems = {};
  for (const item of optimalInventory.selectedItems) {
    optimalItems[item.item] = item.count;
  }
  document.querySelectorAll(".q-item__label").forEach((item) => {
    const itemName = item.innerText.split("\n")[0];
    const amt = optimalItems[itemName] || 0;
    const currentAmt =
      item.parentElement.parentElement
        .querySelector(".item-qty")
        ?.innerText.replace("x", "") || 1;
    const span = item.querySelector("span") ?? document.createElement("span");
    span.innerText = `Amt: [${amt}]`;
    span.style.float = "right";
    span.style.color = amt - currentAmt < 0 || amt == 0 ? "red" : "green";
    item.appendChild(span);
  });

  if (window.location.href.includes("inventory")) {
    setTimeout(showOptimalInventory, 1000);
  }
}

function handleLocation(response) {
  current_location = response.name;
}

function saveExplorationData(response) {
  const savedExplorationDataAll = JSON.parse(
    localStorage.getItem("root-exploration-data"),
  );
  const savedExplorationData = savedExplorationDataAll[current_location] || {};
  const npcs = savedExplorationData.npcs || {};
  const gates = savedExplorationData.gates || {};
  const scavenge = savedExplorationData.scavenge || {};
  const current_time = new Date();

  for (const npc of response.npcs) {
    const npc_name = npc.name;
    const np_code = npc.id;
    const life = npc.vars.life;
    const max_life = npc.vars.max_life;
    const respawn_time_left = npc.vars.respawn_time;
    const respawn_time = current_time.getTime() + respawn_time_left * 1000;
    const push_data = {
      name: npc_name,
      life: life,
      max_life: max_life,
      respawn_time: respawn_time,
    };
    npcs[np_code] = push_data;
  }

  for (const gate of response.gates) {
    const gate_code = gate.id;
    const gate_name = gate.name;
    const gate_unlocked = gate.vars.unlocked || false;
    const gate_unlock_time = gate.vars.unlock_time || 0;
    const gate_unlocked_till = current_time.getTime() + gate_unlock_time * 1000;
    const required_items = {};
    for (const item_key in gate.items) {
      const item = gate.items[item_key];
      const item_name = item.name;
      const item_quantity = item.req_qty;
      required_items[item_name] = item_quantity;
    }
    const gate_data = {
      name: gate_name,
      unlocked: gate_unlocked,
      gate_unlock_time: gate_unlocked_till,
      required_items: required_items,
    };
    gates[gate_code] = gate_data;
  }

  const scavenge_invalid = [
    "Fuel Pumps",
    "Foundation Pit",
    "Bulk Goods Lockup",
    "Scrap Pile",
    "Warm Springs",
    "Red River",
    "Grand Lake",
  ];
  for (const scavengeD of response.scavenge) {
    const scavenge_code = scavengeD.id;
    const scavenge_name = scavengeD.name;

    if (scavenge_invalid.includes(scavenge_name)) {
      continue;
    }

    const scavenge_cooldown = scavengeD.vars.cooldown;
    const scavenge_cooldown_end = scavenge_cooldown
      ? current_time.getTime() + scavenge_cooldown * 1000
      : -1;
    const scavenge_push_data = {
      name: scavenge_name,
      cooldown: scavenge_cooldown,
      cooldown_end: scavenge_cooldown_end,
    };
    scavenge[scavenge_code] = scavenge_push_data;
  }

  const exploration_data = JSON.parse(
    localStorage.getItem("root-exploration-data"),
  );
  exploration_data[current_location] = {
    npcs: npcs,
    gates: gates,
    scavenge: scavenge,
  };

  localStorage.setItem(
    "root-exploration-data",
    JSON.stringify(exploration_data),
  );
}

function display_exploration_data() {
  const locations = document.querySelectorAll(".job-name:not([processed])");
  if (locations.length == 0) {
    setTimeout(display_exploration_data, 1000);
    return;
  }

  const exploration_data = JSON.parse(
    localStorage.getItem("root-exploration-data"),
  );

  if (!exploration_data) {
    return;
  }

  for (const location of locations) {
    const locationName = location.textContent.trim();
    console.log(locationName);
    if (!exploration_data[locationName]) {
      continue;
    }

    const locationData = exploration_data[locationName];

    // Create the main container
    const container = document.createElement("div");
    container.className = "exploration-data-container";

    // Process NPCs
    container.appendChild(createNPCSection(locationData.npcs, locationName));

    // Process Gates
    container.appendChild(createGatesSection(locationData.gates, locationName));

    // Process Scavenge Points
    //container.appendChild(
    //  createScavengeSection(locationData.scavenge, locationName),
    //);

    // Append the container to the parent
    const parent = $(location).parents("div[class^='job-cont']")[0];
    $(parent).append(container);
    location.setAttribute("processed", true);
  }
}

function createNPCSection(npcs, locationName) {
  const section = document.createElement("div");

  // Check if NPCs exist and determine if they're in array or object format
  if (
    !npcs ||
    (typeof npcs === "object" && Object.keys(npcs).length === 0) ||
    (Array.isArray(npcs) && npcs.length === 0)
  ) {
    const noNPCs = document.createElement("p");
    noNPCs.textContent = "No NPCs available";
    section.appendChild(noNPCs);
    return section;
  }

  // Create table
  const table = document.createElement("table");

  // Create table header
  const headerRow = document.createElement("tr");
  const headers = ["Name", "Life", "Max Life", "Respawn Time"];

  // Use "Index" instead of "ID" for array-based data
  if (Array.isArray(npcs)) {
    headers[0] = "Index";
  }

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  // Create table rows
  // Handle object format (like in Fuel Depot)
  for (const id in npcs) {
    const npc = npcs[id];
    const row = document.createElement("tr");

    // Name
    const nameCell = document.createElement("td");
    nameCell.textContent = npc.name;
    row.appendChild(nameCell);

    // Life
    const lifeCell = document.createElement("td");
    lifeCell.textContent = npc.life;
    row.appendChild(lifeCell);

    // Max Life
    const maxLifeCell = document.createElement("td");
    maxLifeCell.textContent = npc.max_life;
    row.appendChild(maxLifeCell);

    // Respawn Time
    const respawnCell = document.createElement("td");
    const timerDiv = document.createElement("div");
    timerDiv.className = "timer";
    if (npc.respawn_time) {
      const currentTime = new Date();
      timerDiv.timeLeft = Math.round(
        (npc.respawn_time - currentTime.getTime()) / 1000,
      );
      timerDiv.innerText = getDayHourMinute(timerDiv.timeLeft);
      respawnCell.appendChild(timerDiv);
    } else {
      respawnCell.textContent = "N/A";
    }
    row.appendChild(respawnCell);

    table.appendChild(row);
  }

  section.appendChild(table);
  return section;
}

function createGatesSection(gates, locationName) {
  const section = document.createElement("div");

  // Check if gates exist and determine if they're in array or object format
  if (
    !gates ||
    (typeof gates === "object" && Object.keys(gates).length === 0) ||
    (Array.isArray(gates) && gates.length === 0)
  ) {
    const noGates = document.createElement("p");
    noGates.textContent = "No gates available";
    section.appendChild(noGates);
    return section;
  }

  // Create table
  const table = document.createElement("table");

  // Create table header
  const headerRow = document.createElement("tr");
  const headers = ["Name", "Unlocked", "Gate Unlock Time", "Required Items"];

  // Use "Index" instead of "ID" for array-based data
  if (Array.isArray(gates)) {
    headers[0] = "Index";
  }

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  // Create table rows
  // Handle object format
  for (const id in gates) {
    const gate = gates[id];
    const row = document.createElement("tr");

    // Name
    const nameCell = document.createElement("td");
    nameCell.textContent = gate.name;
    row.appendChild(nameCell);

    // Unlocked
    const unlockedCell = document.createElement("td");
    unlockedCell.textContent = gate.unlocked ? "Yes" : "No";
    row.appendChild(unlockedCell);

    // Gate Unlock Time
    const unlockTimeCell = document.createElement("td");
    const timerDiv = document.createElement("div");
    timerDiv.className = "timer";
    if (gate.gate_unlock_time) {
      const currentTime = new Date();
      timerDiv.timeLeft = Math.round(
        (gate.gate_unlock_time - currentTime.getTime()) / 1000,
      );
      timerDiv.innerText = getDayHourMinute(timerDiv.timeLeft);
      unlockTimeCell.appendChild(timerDiv);
    } else {
      unlockTimeCell.textContent = "N/A";
    }
    row.appendChild(unlockTimeCell);

    // Required Items
    const requiredItemsCell = document.createElement("td");
    if (gate.required_items && Object.keys(gate.required_items).length > 0) {
      const requiredItems = [];
      for (const item in gate.required_items) {
        requiredItems.push(`${item} (${gate.required_items[item]})`);
      }
      requiredItemsCell.textContent = requiredItems.join(", ");
    } else {
      requiredItemsCell.textContent = "None";
    }
    row.appendChild(requiredItemsCell);

    table.appendChild(row);
  }

  section.appendChild(table);
  return section;
}

function createScavengeSection(scavengePoints, locationName) {
  const section = document.createElement("div");

  // Check if scavenge points exist and determine if they're in array or object format
  if (
    !scavengePoints ||
    (typeof scavengePoints === "object" &&
      Object.keys(scavengePoints).length === 0) ||
    (Array.isArray(scavengePoints) && scavengePoints.length === 0)
  ) {
    const noScavenge = document.createElement("p");
    noScavenge.textContent = "No scavenge points available";
    section.appendChild(noScavenge);
    return section;
  }

  // Create table
  const table = document.createElement("table");

  // Create table header
  const headerRow = document.createElement("tr");
  const headers = ["ID", "Name", "Cooldown", "Cooldown End"];

  // Use "Index" instead of "ID" for array-based data
  if (Array.isArray(scavengePoints)) {
    headers[0] = "Index";
  }

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  // Create table rows
  // Handle object format
  for (const id in scavengePoints) {
    const point = scavengePoints[id];
    const row = document.createElement("tr");

    // ID
    const idCell = document.createElement("td");
    idCell.textContent = id;
    row.appendChild(idCell);

    // Name
    const nameCell = document.createElement("td");
    nameCell.textContent = point.name;
    row.appendChild(nameCell);

    // Cooldown
    const cooldownCell = document.createElement("td");
    cooldownCell.textContent = point.cooldown || "N/A";
    row.appendChild(cooldownCell);

    // Cooldown End
    const cooldownEndCell = document.createElement("td");
    if (point.cooldown_end && point.cooldown_end > 0) {
      cooldownEndCell.textContent = new Date(
        point.cooldown_end,
      ).toLocaleString();
    } else {
      cooldownEndCell.textContent = "N/A";
    }
    row.appendChild(cooldownEndCell);

    table.appendChild(row);
  }

  section.appendChild(table);
  return section;
}

function addOtherTimersDropDown(dataContainer) {
  let arrowMenu = document.getElementById("arrow-menu");
  if (arrowMenu) {
    arrowMenu.remove();
  }

  const currentTime = new Date();
  arrowMenu = document.createElement("div");
  arrowMenu.id = "arrow-menu";
  arrowMenu.className = "arrow-menu";
  arrowMenu.style.cursor = "pointer";
  arrowMenu.innerHTML = "<span id='arrow'>▼</span>";

  menuOptions = document.createElement("div");
  menuOptions.className = "menu-options";
  menuOptions.id = "menu-options";
  menuOptions.style.display = "none";

  const exploration_data = JSON.parse(
    localStorage.getItem("root-exploration-data"),
  );

  for (const location in exploration_data) {
    const locationData = exploration_data[location];
    const scavenge = locationData.scavenge || {};
    if (scavenge) {
      for (const scavengeD in scavenge) {
        const scavengeData = scavenge[scavengeD];
        let timeLeft = Math.round(
          (scavengeData.cooldown_end - currentTime.getTime()) / 1000,
        );
        if (timeLeft < 0) {
          timeLeft = -1;
        }

        const option = document.createElement("div");
        option.className = "menu-item";
        option.textContent = scavengeData.name;
        const scavengeNameSpacesRemoved = scavengeData.name.replaceAll(
          " ",
          "_",
        );
        option.addEventListener("click", function () {
          if (LOCATION_EXPLORATION_ID[location]) {
            //console.log("Clicked on ", location);
            window.location.href = `/explore/${LOCATION_EXPLORATION_ID[location]}`;
          }
        });
        const timer = document.createElement("div");
        timer.className = "timer menu-item-timer";
        timer.id = scavengeNameSpacesRemoved + "TimeLeft";
        timer.timeLeft = timeLeft;
        timer.innerText = getDayHourMinute(timer.timeLeft);
        option.appendChild(timer);
        menuOptions.appendChild(option);
      }
    }
  }
  arrowMenu.addEventListener("click", function () {
    const isVisible = menuOptions.style.display === "block";
    menuOptions.style.display = isVisible ? "none" : "block";
    document.getElementById("arrow").innerHTML = isVisible ? "▼" : "▲";
  });

  arrowMenu.appendChild(menuOptions);
  dataContainer.appendChild(arrowMenu);
}

function handleStartJob(response) {
  console.log("Handling Start Job");
  if (response.error) {
    return;
  }
  const job_codename = response.job.codename;
  if (
    job_codename.startsWith("job_fuel_depot_fuel_trader") ||
    job_codename.startsWith("job_vault_lockbox") ||
    job_codename.startsWith("job_demolition_site")
  ) {
    handleExplorationTrade(response);
  } else if (job_codename.startsWith("gym")) {
    trackGymGains(response);
  }
}

function handleExplorationTrade(response) {
  console.log("Handling Exploration Trade");
  const exploration_data = JSON.parse(
    localStorage.getItem("root-exploration-data"),
  );

  const currentTime = new Date();
  const job_name = response.job.name;
  const job_id = response.job.id;
  const wait_time = response.job.vars.cooldown;
  const wait_time_end = currentTime.getTime() + wait_time * 1000;

  exploration_data[current_location].scavenge[job_id] = {
    name: job_name,
    cooldown: wait_time,
    cooldown_end: wait_time_end,
  };
  localStorage.setItem(
    "root-exploration-data",
    JSON.stringify(exploration_data),
  );
  updateDisplay();
}

function handleWeaponDurability(response) {
  console.log("Handling Weapon Durability");
  const weaponDurabilityNew = response.equip?.primary?.vars?.condition || -1;
  weaponDurability = weaponDurabilityNew * 1;
}

function checkWeaponDurability() {
  console.log("Checking Weapon Durability");
  if (weaponDurability == -1) {
    showWarning("Weapon is not equipped!");
  } else if (weaponDurability - 30 < 0) {
    showWarning("Weapon is low on durability!");
  }
}

function showWarning(message) {
  console.log("Showing Warning");
  if ($(".warning").length > 0 && $(".warning").text() == message) return;
  const warningDiv = document.createElement("div");
  warningDiv.className = "warning";
  warningDiv.innerText = message;
  warningDiv.style.opacity = 0; // Initially hide the element
  warningDiv.style.bottom = "-10px"; // Position it at the bottom
  document.body.appendChild(warningDiv);
  setTimeout(() => {
    warningDiv.style.bottom = "35px"; // Animate it to the top
    warningDiv.style.opacity = "1"; // Show it
    setTimeout(function () {
      removeWarning(warningDiv);
    }, 5000); // Remove it after 5 seconds
  }, 200);
}

function removeWarning(warningDiv) {
  warningDiv.style.bottom = "-50px";
  warningDiv.style.opacity = "0";

  setTimeout(() => {
    warningDiv.remove();
  }, 1000);
}

function checkWeaponDurabilityChange(response) {}

function getExpectedNUmberOfHuntsWithDurability(response) {}

async function getLatestLoadItems() {
  console.log("Getting Latest Load Items");
  const response = await $.ajax({
    url: "https://api.zed.city/loadItems",
    method: "GET",
    dataType: "json",
    xhrFields: { withCredentials: true },
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });
  return response;
}

async function getUserSearch(query) {
  console.log("Getting User Search");
  const response = await $.ajax({
    url: "https://api.zed.city/getUsers",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      descending: false,
      filter: query,
      page: 1,
    }),
    dataType: "json",
    xhrFields: { withCredentials: true },
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });
  return response.users;
}

function addSearchBar() {
  console.log("Adding Search Bar");
  const parent = document.querySelector("div.q-gutter-xs:nth-child(5)");

  if (!parent) {
    setTimeout(addSearchBar, 100);
    return;
  }
  // Create overlay background
  const overlay = document.createElement("div");
  overlay.className = "search-overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "none",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "100",
  });

  // Create search container
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";
  Object.assign(searchContainer.style, {
    width: "50%",
    maxWidth: "500px",
    backgroundColor: "rgba(9, 10, 11, 0.8)",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  });

  // Create search bar
  const searchBar = document.createElement("input");
  searchBar.type = "text";
  searchBar.placeholder = "User Search";
  searchBar.className = "search-bar";
  searchBar.disabled = true;
  Object.assign(searchBar.style, {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "10px",
  });

  const switchModeButton = document.createElement("button");
  switchModeButton.innerText = "Switch " + TOGGLE;
  switchModeButton.className = "search-bar-button";
  Object.assign(switchModeButton.style, {
    color: "white",
    background: "none",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "10px",
  });
  searchContainer.appendChild(switchModeButton);

  // Create results container
  const resultsContainer = document.createElement("div");
  resultsContainer.className = "search-bar-results";
  Object.assign(resultsContainer.style, {
    maxHeight: "300px",
    overflowY: "auto",
  });

  // Create results list
  const ul = document.createElement("ul");
  ul.className = "search-bar-results-list";
  Object.assign(ul.style, {
    listStyle: "none",
    padding: "0",
    margin: "0",
  });
  // Create search button and icon
  const searchIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  searchIcon.setAttribute("width", "20");
  searchIcon.setAttribute("height", "20");
  searchIcon.setAttribute("viewBox", "0 0 60 60");
  searchIcon.innerHTML = `
    <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" stroke-width="4"/>
    <path d="M45 45 L60 60" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  `;
  const searchButton = document.createElement("button");
  searchButton.className = "search-bar-button";
  searchButton.appendChild(searchIcon);
  Object.assign(searchButton.style, {
    color: "white",
    background: "none",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  });

  // Assemble the components
  resultsContainer.appendChild(ul);
  searchContainer.appendChild(searchBar);
  searchContainer.appendChild(resultsContainer);
  overlay.appendChild(searchContainer);
  document.body.appendChild(overlay);

  // Add event listeners
  searchBar.addEventListener("input", function () {
    if (searchBar.disabled) return;
    const query = searchBar.value.toLowerCase();
    if (query.length > 0) {
      const searchMode = searchBar.getAttribute("searchMode") || "users";
      //console.log(searchMode);
      if (searchMode === "users") {
        // Changed from > 3 to > 0 to show results immediately
        console.log("Searching users");
        getUserSearch(query).then((response) => {
          parseUsers(response, ul);
        });
      } else if (searchMode === "market") {
        console.log("Searching market");
        marketSearch(query, ul);
      }
    }
  });

  searchButton.addEventListener("click", function () {
    searchBar.disabled = false;
    searchBar.value = "";
    overlay.style.display = "flex";
    searchBar.focus(); // Automatically focus the search input
  });
  // Close when clicking outside the search container
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      overlay.style.display = "none";
      searchBar.value = "";
      ul.innerHTML = "";
      searchBar.disabled = true;
    }
  });

  switchModeButton.addEventListener("click", function () {
    const currentMode = searchBar.getAttribute("searchMode") || "users";
    if (currentMode === "users") {
      searchBar.setAttribute("searchMode", "market");
      searchBar.placeholder = "Market Search";
      searchBar.value = "";
      ul.innerHTML = "";
    } else {
      searchBar.setAttribute("searchMode", "users");
      searchBar.placeholder = "User Search";
      searchBar.value = "";
      ul.innerHTML = "";
    }
  });

  // prepend search button to the parent element
  parent.prepend(searchButton);
}

function parseUsers(users, ul) {
  console.log("Parsing Users");
  // Clear previous results
  ul.innerHTML = "";

  if (users.length === 0) {
    // Display a message when no users are found
    const noResults = document.createElement("li");
    noResults.className = "no-results";
    noResults.innerText = "No users found";
    Object.assign(noResults.style, {
      padding: "12px",
      textAlign: "center",
      color: "#666",
      borderBottom: "1px solid #eee",
    });
    ul.appendChild(noResults);
    return;
  }

  // Create result items for each user
  for (const user of users) {
    const li = document.createElement("li");
    li.className = "user-result-item";
    Object.assign(li.style, {
      padding: "10px",
      borderBottom: "1px solid #eee",
      cursor: "pointer",
      transition: "background-color 0.2s",
    });

    const a = document.createElement("a");
    a.href = `/profile/${user.id}`;
    a.innerText = user.username;
    Object.assign(a.style, {
      textDecoration: "none",
      color: "white",
      display: "block",
      width: "100%",
      height: "100%",
    });

    // Add hover effect
    li.addEventListener("mouseover", function () {
      this.style.backgroundColor = "#333";
    });

    li.addEventListener("mouseout", function () {
      this.style.backgroundColor = "transparent";
    });

    li.appendChild(a);
    ul.appendChild(li);
  }
}

addSearchBar();

// add trade value to kitchen
//  - ammo bench
//  - weapon bench
//  - crafting bench
//  - armor bench

const recipes = {};
function handlegetRecipes(response) {
  console.log("Handling Recipes");
  for (const recipe of response.items) {
    const recipeName = recipe.name.replace(" Blueprint", "");
    const unlocked = recipe.vars.has_recipe;
    if (!unlocked) {
      continue;
    }

    const outputs = [];
    const items_required = [];

    if (recipe.vars?.items) {
      for (const itemr in recipe.vars.items) {
        const item = recipe.vars.items[itemr];
        const item_name = item.name;
        const item_qty = item.req_qty;

        const obj = {
          name: item_name,
          quantity: item_qty,
        };
        items_required.push(obj);
      }
    }

    if (recipe.vars?.output) {
      for (const itemr in recipe.vars.output) {
        const item = recipe.vars.output[itemr];
        const item_name = item.name;
        const item_qty = item.quantity;

        const obj = {
          name: item_name,
          quantity: item_qty,
        };
        outputs.push(obj);
      }
    }

    recipes[recipeName] = {
      items_required: items_required,
      outputs: outputs,
    };
  }

  if (window.location.href.includes("1781367")) {
    // radio tower
    setTimeout(displayRadioTowerValues, 500);
  } else {
    setTimeout(displayRecipeValues, 500);
  }
}

function displayRecipeValues() {
  console.log("Display Recipes Values");
  const itemsDiv = document.querySelectorAll(".q-item__label");
  if (itemsDiv.length == 0) {
    if (window.location.href.includes("/stronghold/")) {
      setTimeout(displayRecipeValues, 500);
    }
    return;
  }

  itemsDiv.forEach((item) => {
    const itemName = item.innerText;
    if (recipes[itemName]) {
      const [cost, output, profit] = calculateCostOutput(recipes[itemName]);

      const innerHTML = `${cost.toLocaleString()} → ${output.toLocaleString()}  [${profit.toLocaleString()}]`;
      const profitDiv = document.createElement("div");
      profitDiv.innerHTML = innerHTML;
      profitDiv.style.color = profit > 0 ? "green" : "red";
      profitDiv.className = "profit-div";
      item.appendChild(profitDiv);
    }
  });
}

function calculateCostOutput(recipe) {
  console.log("Calculating Cost Output");
  const items_required = recipe.items_required;
  const outputs = recipe.outputs;
  let cost = 0;
  let output = 0;

  for (const item of items_required) {
    const itemName = item.name;
    const itemQuantity = item.quantity;
    const price = market_data[itemName] || 0;
    cost += price * itemQuantity;
  }

  for (const item of outputs) {
    const itemName = item.name;
    const itemQuantity = item.quantity || 1;
    const price = market_data[itemName] || 0;
    output += price * itemQuantity;
  }
  const profit = output - cost;
  return [cost, output, profit];
}

const radioTowerTrades = {};
function displayRadioTowerValues() {
  console.log("Displaying Radio Tower Values");
  //console.log(radioTowerTrades);

  const columns = getTradeContainers();
  if (columns.length == 0) {
    if (window.location.href.includes("/stronghold/")) {
      setTimeout(displayRadioTowerValues, 500);
      return;
    }
  }
  //console.log(columns);
  if (columns.length == 0) {
    return;
  }

  for (let columnNo = 0; columnNo < columns.length; columnNo++) {
    const column = columns[columnNo];
    //console.log(column);
    const tradeName = "Trade " + columnNo;
    if (radioTowerTrades[tradeName]) {
      const [cost, output, profit] = calculateCostOutput(
        radioTowerTrades[tradeName],
      );

      const innerHTML = `${cost.toLocaleString()} → ${output.toLocaleString()}  [${profit.toLocaleString()}]`;
      const profitDiv = document.createElement("div");
      profitDiv.innerHTML = innerHTML;
      profitDiv.style.color = profit > 0 ? "green" : "red";
      profitDiv.style.position = "absolute";
      profitDiv.className = "profit-div";
      column.appendChild(profitDiv);
    }
  }
}

function getTradeContainers() {
  const containers = document.querySelectorAll("button");
  const relevantContainers = [];

  containers.forEach((container) => {
    if (container.innerText.includes("TRADE")) {
      const parent = container.parentElement;
      relevantContainers.push(parent);
    }
  });
  return relevantContainers;
}

function handleRadioTowerValues(response) {
  console.log("Handling Radio Tower Values");
  let index = 0;
  for (const trade of response.items) {
    const tradeName = "Trade " + index;

    const outputs = [];
    const items_required = [];

    if (trade.vars?.items) {
      for (const itemr in trade.vars.items) {
        const item = trade.vars.items[itemr];
        const item_name = item.name;
        const item_qty = item.req_qty;

        const obj = {
          name: item_name,
          quantity: item_qty,
        };
        items_required.push(obj);
      }
    }

    if (trade.vars?.output) {
      for (const itemr in trade.vars.output) {
        const item = trade.vars.output[itemr];
        const item_name = item.name;
        const item_qty = item.quantity;

        const obj = {
          name: item_name,
          quantity: item_qty,
        };
        outputs.push(obj);
      }
    }

    radioTowerTrades[tradeName] = {
      items_required: items_required,
      outputs: outputs,
    };
    index++;
  }

  setTimeout(displayRadioTowerValues, 500);
}

function checkVehicleInventoryWeight() {
  const vehicleInventoryWeight = data.vehicle?.vars?.weight || 0;
  if (vehicleInventoryWeight - 12 > 0) {
    showWarning("Vehicle Inventory is high!");
  }
}

function sortBySimilarity(referenceString, stringList) {
  function calculateSimilarity(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    if (s2.startsWith(s1) || s1.startsWith(s2)) {
      return (
        1 -
        Math.abs(s1.length - s2.length) / Math.max(s1.length, s2.length) +
        0.5
      ); // Stronger weight for prefix
    }

    const shorter = s1.length < s2.length ? s1 : s2;
    const longer = s1.length < s2.length ? s2 : s1;

    const words = longer.split(/\s+/);
    const initials = words.map((word) => word[0]).join("");

    if (shorter.length <= initials.length && initials.includes(shorter)) {
      return 0.9; // Increased weight for matching initials
    }

    function levenshteinDistance(a, b) {
      if (a.length < b.length) return levenshteinDistance(b, a);
      if (b.length === 0) return a.length;
      let previousRow = Array.from({ length: b.length + 1 }, (_, i) => i);
      for (let i = 0; i < a.length; i++) {
        let currentRow = [i + 1];
        for (let j = 0; j < b.length; j++) {
          const insertions = previousRow[j + 1] + 1;
          const deletions = currentRow[j] + 1;
          const substitutions = previousRow[j] + (a[i] !== b[j] ? 1 : 0);
          currentRow.push(Math.min(insertions, deletions, substitutions));
        }
        previousRow = currentRow;
      }
      return previousRow[previousRow.length - 1];
    }

    const maxLength = Math.max(s1.length, s2.length);
    const distance = levenshteinDistance(s1, s2);
    return 1 - distance / maxLength;
  }

  return [...stringList].sort(
    (a, b) =>
      calculateSimilarity(referenceString, b) -
      calculateSimilarity(referenceString, a),
  );
}

function marketSearch(query, ul) {
  const sortedResults = sortBySimilarity(query, Object.keys(market_data)).slice(
    0,
    5,
  );
  //console.log(sortedResults);
  parseMarketSearchData(sortedResults, ul);
}

function parseMarketSearchData(marketList, ul) {
  console.log("Parsing marketList");
  //console.log(marketList);
  // Clear previous results
  ul.innerHTML = "";

  if (marketList.length === 0) {
    // Display a message when no marketList are found
    const noResults = document.createElement("li");
    noResults.className = "no-results";
    noResults.innerText = "No marketList found";
    Object.assign(noResults.style, {
      padding: "12px",
      textAlign: "center",
      color: "#666",
      borderBottom: "1px solid #eee",
    });
    ul.appendChild(noResults);
    return;
  }

  for (const marketItem of marketList) {
    const marketPrice = market_data[marketItem];

    //console.log(marketItem, marketPrice);
    const li = document.createElement("li");
    li.className = "user-result-item";
    Object.assign(li.style, {
      padding: "10px",
      borderBottom: "1px solid #eee",
      cursor: "pointer",
      transition: "background-color 0.2s",
    });

    const a = document.createElement("a");
    a.href = `/market`;
    a.innerText = marketItem;
    Object.assign(a.style, {
      textDecoration: "none",
      color: "white",
      display: "block",
      width: "100%",
      height: "100%",
    });

    const priceDiv = document.createElement("div");
    priceDiv.innerText = `$${marketPrice.toLocaleString()}`;
    priceDiv.style.float = "right";
    a.appendChild(priceDiv);

    // Add hover effect
    li.addEventListener("mouseover", function () {
      this.style.backgroundColor = "#333";
    });

    li.addEventListener("mouseout", function () {
      this.style.backgroundColor = "transparent";
    });

    li.appendChild(a);
    ul.appendChild(li);
  }
}

// - add market junkstore optimal buying helper
// - add lowest price items on the market

function trackGymGains(response) {
  const rootGymData = JSON.parse(localStorage.getItem("root-gym-data"));
  const outcome = response.outcome;
  const newState = response.reactive_items_qty;
  const gain = outcome.rewards.gain;
  const statType = outcome.rewards.skill;
  const initialStat = data.stats[statType];

  const difData = {
    energy: 0,
    morale: 0,
    experience: 0,
    gain: gain,
    initial_morale: 0,
    initial_stat: initialStat,
    statType: statType,
  };

  for (const item of newState) {
    const itemName = item.codename.includes("xp")
      ? "experience"
      : item.codename;
    const itemQuantity = item.quantity;
    const oldQuantity = data[itemName] || 0;
    difData[itemName] = Math.abs(itemQuantity - oldQuantity);
    if (itemName === "morale") {
      difData.initial_morale = data.morale;
    }
    console.log(`Gained ${gain} using ${difData[itemName]} ${itemName}`);
  }
  rootGymData.push(difData);
  localStorage.setItem("root-gym-data", JSON.stringify(rootGymData));
  console.log(difData);
}
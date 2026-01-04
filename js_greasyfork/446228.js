// ==UserScript==
// @name         WK Distraction Blocker
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  Block certain websites until you do your reviews
// @author       Gorbit99
// @match        */*
// @icon         https://www.google.com/s2/favicons?domain=wanikani.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @run-at       document-end
// @require      https://greasyfork.org/scripts/441792-cidwwa/code/CIDWWA.js?version=1060343
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446228/WK%20Distraction%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/446228/WK%20Distraction%20Blocker.meta.js
// ==/UserScript==

/*global $, GM_getValue, GM_setValue, GM_getResourceText*/

(function() {
  "use strict";

  let blockButton;
  let progressIndicator;
  let previousItem;

  const defaultSettings = {
    condition: "reviews-left",
    reviewsLeft: 0,
    dailyLimit: 50,
    goalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    blockedSites: [
      "youtube.com",
    ],
    apiToken: "",
  };

  let settings;

  function loadSettings() {
    settings = JSON.parse(GM_getValue("settings", "{}"));
    for (let key in defaultSettings) {
      settings[key] ??= defaultSettings[key];
    }
  }

  loadSettings();

  settings.goalDate = new Date(settings.goalDate);

  if (location.host === "www.wanikani.com"
    || location.host === "preview.wanikani.com") {
    if (document.querySelector(".sitemap__avatar")) {
      handleWK();
    } else {
      insertProgressCounter();
      updateProgressCounter();
      hookWKEvents();
    }
  } else {
    checkIfShouldBlock();
  }

  function handleWK() {
    createWKModal();
    injectWKStyle();
    fillWKValues();
    insertProgressCounter();
    updateProgressCounter();
    hookWKEvents();
  }

  function createWKModal() {
    blockButton = window.createButton({
      englishText: "Block",
      japaneseText: "ブロック",
      color: "#a00",
      hoverColor: "#c00",
    });

    const modal = window.createModal({
      title: "Distraction Blocker",
    });

    blockButton.onTurnOn(() => modal.open());
    blockButton.onTurnOff(() => modal.close());
    modal.onClose(() => blockButton.setState(false));

    modal.setContent(`
      <div class="[ dblocker ][ settings ]">
        <h5>Blocked sites:</h5>
        <textarea id="dblocker-blocked" class="[ dblocker ][ blocked-sites ]">
        </textarea>
        <h5>Conditions:</h5>
        <div class="[ dblocker ][ condition-group ]">
          <div class="[ dblocker ][ condition-container ]">
            <input type="radio" 
              name="dblocker-condition" 
              value="reviews-left"
              id="dblocker-rleft"
            />
            <label for="dblocker-rleft">
              Until at most
              <input type="numeric" id="dblocker-rleft-number"/>
              reviews remain
            </label>
          </div>

          <div class="[ dblocker ][ condition-container ]">
            <input type="radio" 
              name="dblocker-condition" 
              value="daily-limit" 
              id="dblocker-dlimit"
            />
            <label for="dblocker-dlimit">
              Until 
              <input type="numeric" id="dblocker-dlimit-number"/>
              reviews were completed
            </label>
          </div>

          <div class="[ dblocker ][ condition-container ]">
            <input type="radio" 
              name="dblocker-condition" 
              value="goal" 
              id="dblocker-goal"
            />
            <label for="dblocker-goal">
              I want to get rid of my reviews by 
              <input 
                type="date" 
                id="dblocker-goal-date" 
                class="[ dblocker ][ date ]"
              />
              (at least 
              <span class="[ dblocker ][ goal-average ]">0</span>
              daily reviews)
            </label>
          </div>
        </div>
        <h5>API Token:</h5>
        <input id="dblocker-api-token" />
      </div>
    `);
  }

  function injectWKStyle() {
    const styleElem = document.createElement("style");
    styleElem.innerHTML = `
    .dblocker.settings {
      display: flex;
      flex-direction: column;
      width: 400px;
    }

    .dblocker.condition-group {
      border: 1px solid black;
      border-radius: 10px;
      width: 100%;
      padding: 5%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .dblocker.condition-container {
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: baseline;
    }

    .dblocker.condition-container > label > input {
      width: 5ch;
    }

    .dblocker.condition-container > label > .date {
      width: 15ch;
    }

    .dblocker.blocked-sites {
      width: 100%;
      resize: vertical;
      box-sizing: border-box;
      height: 10em;
    }

    .dblocker.progress-indicator {
      margin-left: 20px;
      color: #fff;
      opacity: 0.5;
    }
    `;

    document.head.append(styleElem);
  }

  function fillWKValues() {
    const blockedSites = document.querySelector("#dblocker-blocked");
    blockedSites.value = settings.blockedSites.join("\n");
    const conditions = document.querySelectorAll("[name=dblocker-condition]");
    [...conditions]
      .find((condition) => condition.value == settings.condition)
      .checked = true;

    const rleftNumber = document.querySelector("#dblocker-rleft-number");
    rleftNumber.value = settings.reviewsLeft;
    const dlimitNumber = document.querySelector("#dblocker-dlimit-number");
    dlimitNumber.value = settings.dailyLimit;

    const goalDate = document.querySelector("#dblocker-goal-date");
    goalDate.value = settings.goalDate.toISOString().split("T")[0];
    const minDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2);
    goalDate.min = minDate.toISOString().split("T")[0];

    const apiToken = document.querySelector("#dblocker-api-token");
    apiToken.value = settings.apiToken;

    updateGoalAverage();
  }

  async function updateGoalAverage() {
    const goalNumber = document.querySelector(".goal-average");
    const reviewsPerDay = await getDailyGoalAverage();
    goalNumber.textContent = reviewsPerDay;
  }

  async function getDailyGoalAverage() {
    const dateStr = settings.goalDate.toISOString();

    const assignmentResponse =
      await makeApiRequest(`assignments?available_before=${dateStr}`);
    const reviewsByThen = assignmentResponse.total_count;

    const daysUntil =
      Math.floor((settings.goalDate - new Date()) / 1000 / 24 / 60 / 60);

    const reviewsPerDay = Math.round(reviewsByThen / daysUntil);
    return reviewsPerDay;
  }

  function hookWKEvents() {
    if (document.querySelector(".sitemap__avatar")) {
      const blockedSites = document.querySelector("#dblocker-blocked");
      blockedSites.addEventListener("change", () => {
        settings.blockedSites = blockedSites.value.split("\n");
        saveSettings();
      });
      const conditions = document.querySelectorAll("[name=dblocker-condition]");
      [...conditions]
        .forEach((condition) => condition.addEventListener("change", () => {
          settings.condition = condition.value;
          saveSettings();
        }));

      const rleftNumber = document.querySelector("#dblocker-rleft-number");
      rleftNumber.addEventListener("change", () => {
        settings.reviewsLeft = parseInt(rleftNumber.value);
        if (isNaN(settings.reviewsLeft)) {
          rleftNumber.value = "0";
          settings.reviewsLeft = 0;
        }
        saveSettings();
      });
      const dlimitNumber = document.querySelector("#dblocker-dlimit-number");
      dlimitNumber.addEventListener("change", () => {
        settings.dailyLimit = parseInt(dlimitNumber.value);
        if (isNaN(settings.dailyLimit)) {
          dlimitNumber.value = "0";
          settings.dailyLimit = 0;
        }
        saveSettings();
      });
      const goalDate = document.querySelector("#dblocker-goal-date");
      goalDate.addEventListener("change", () => {
        settings.goalDate = new Date(goalDate.value);
        saveSettings();
        updateGoalAverage();
      });

      const apiToken = document.querySelector("#dblocker-api-token");
      apiToken.addEventListener("change", () => {
        settings.apiToken = apiToken.value;
        saveSettings();
      });
    } else if (location.href.endsWith("review/session")) {
      $.jStorage.listenKeyChange("currentItem", () => {
        if (!previousItem) {
          previousItem = $.jStorage.get("currentItem");
          return;
        }
        let prefix = "r";
        if (previousItem.type === "Kanji") {
          prefix = "k";
        } else if (previousItem.type === "Vocabulary") {
          prefix = "v";
        }
        const jStorageId = prefix + previousItem.id;
        if ($.jStorage.get(jStorageId) === null) {
          updateProgressCounter();
        }
      });
    }
  }

  function saveSettings() {
    GM_setValue("settings", JSON.stringify(settings));
    updateProgressCounter();
  }

  function insertProgressCounter() {
    if (blockButton) {
      progressIndicator = blockButton.attachSubtext();
    } else if (location.href.endsWith("review/session")) {
      const statsContainer = document.querySelector("#stats");

      statsContainer.insertAdjacentHTML("afterbegin", `
        <span class="[ dblocker ][ progress-indicator-container ]">
          Block:
          <span class="[ dblocker ][ progress-indicator ]"></span>
        </span>
      `);
      progressIndicator = statsContainer.querySelector(".progress-indicator");
    }
  }

  async function updateProgressCounter() {
    const goal = await getConditionGoal();
    const progress = await getConditionProgress();

    progressIndicator.innerHTML = `${progress} / ${goal}`;
  }

  async function checkIfShouldBlock() {
    if (!settings.blockedSites.find((site) =>
      site === "*" || location.host.includes(site))
    ) {
      return;
    }

    const goal = await getConditionGoal();
    const progress = await getConditionProgress();
    if (goal > progress) {
      block();
    }
  }

  async function getConditionGoal() {
    switch (settings.condition) {
      case "reviews-left":
        return getReviewsLeftGoal();
      case "daily-limit":
        return getDailyLimitGoal();
      case "goal":
        return getDecreaseGoal();
    }
  }

  async function getConditionProgress() {
    switch (settings.condition) {
      case "reviews-left":
        return getReviewsLeftProgress();
      case "daily-limit":
        return getDailyLimitProgress();
      case "goal":
        return getDecreaseProgress();
    }
  }

  async function getReviewsLeftGoal() {
    const reviewData =
      await makeApiRequest("assignments?immediately_available_for_review=true");
    return reviewData.total_count;
  }

  async function getDailyLimitGoal() {
    return settings.dailyLimit;
  }

  async function getDecreaseGoal() {
    return await getDailyGoalAverage();
  }

  async function getReviewsLeftProgress() {
    return settings.reviewsLeft;
  }

  async function getDailyLimitProgress() {
    return getReviewsFromToday();
  }

  async function getDecreaseProgress() {
    return getReviewsFromToday();
  }

  async function getReviewsFromToday() {
    const dayStart = new Date();
    dayStart.setHours(0);
    dayStart.setMinutes(0);
    dayStart.setSeconds(0);
    dayStart.setMilliseconds(0);
    const reviewData =
      await makeApiRequest(`reviews?updated_after=${dayStart.toISOString()}`);
    return reviewData.total_count;
  }

  function block() {
    location.href = "https://wanikani.com/review/session";
  }

  async function makeApiRequest(endpoint) {
    const res = await fetch(`https://api.wanikani.com/v2/${endpoint}`, {
      headers: {
        "Authorization": `Bearer ${settings.apiToken}`,
      }
    });
    return await res.json();
  }
})();

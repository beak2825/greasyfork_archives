// ==UserScript==
// @name         Session Info
// @namespace    https://greasyfork.org/users/1331131-tensorflow-dvorak
// @version      2024-10-26
// @description  Race data
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @require      https://update.greasyfork.org/scripts/501960/1418069/findReact.js
// @license      MIT
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let sessionStartTime;
  let raceTimes = [];
  let averageWPM = 0;
  let cardColor = localStorage.getItem("nt_cardColor") || "#1a1a2e";
  let buttonColor = localStorage.getItem("nt_buttonColor") || "#5a67d8";

  function initializeSessionData() {
    const persistData = localStorage.getItem("persist:nt");
    if (persistData) {
      const parsedData = JSON.parse(JSON.parse(persistData).user);
      sessionStartTime =
        parseInt(localStorage.getItem("sessionStartTime")) || Date.now();
      raceTimes = JSON.parse(localStorage.getItem("raceTimes")) || [];
      averageWPM = parsedData.avgSpeed || 0;

      if (!localStorage.getItem("sessionStartTime")) {
        localStorage.setItem("sessionStartTime", sessionStartTime);
      }

      return parsedData.sessionRaces || 0;
    }
    return 0;
  }

  let sessionRaces = initializeSessionData();

  function createPostRaceInfo() {
    const dashElement = document.querySelector(".dash");
    const settingsElement = document.querySelector(
      ".nitro-monkey__settings-container"
    );

    if (dashElement && settingsElement) {
      const postRaceContainer = document.createElement("div");
      postRaceContainer.classList.add("nitro-monkey__pr-container");

      postRaceContainer.style.display = "flex";
      postRaceContainer.style.justifyContent = "center";
      postRaceContainer.style.alignItems = "center";
      postRaceContainer.style.padding = "0.5rem";
      postRaceContainer.style.backgroundColor = cardColor;
      postRaceContainer.style.borderRadius = "8px";
      postRaceContainer.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
      postRaceContainer.style.width = "auto";
      postRaceContainer.style.height = "fit-content";
      postRaceContainer.style.color = "#e0e0e0";
      postRaceContainer.style.fontSize = "0.9rem";
      postRaceContainer.style.marginBottom = "1rem";

      postRaceContainer.innerHTML = `
        <table style="width: auto; border-collapse: collapse; font-size: 0.9rem;">
          <tbody>
            <tr>
              <td style="padding: 0.4rem; text-align: left; color: #a0a0a0;">Session Races:</td>
              <td id="sessionValue" style="padding: 0.4rem; text-align: right;">${sessionRaces}</td>
            </tr>
            <tr>
              <td style="padding: 0.4rem; text-align: left; color: #a0a0a0;">Races/hr:</td>
              <td id="hourlyRaces" style="padding: 0.4rem; text-align: right;">${calculateRacesLastHour()}</td>
            </tr>
            <tr>
              <td style="padding: 0.4rem; text-align: left; color: #a0a0a0;">Est. Races/hr:</td>
              <td id="estimatedRaces" style="padding: 0.4rem; text-align: right;">${
                localStorage.getItem("estimatedRaces") || 0
              }</td>
            </tr>
            <tr>
              <td style="padding: 0.4rem; text-align: left; color: #a0a0a0;">Average WPM:</td>
              <td id="averageWPM" style="padding: 0.4rem; text-align: right;">${averageWPM}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: center; padding: 0.5rem;">
                <button id="resetButton" style="padding: 0.3rem 0.8rem; font-size: 0.85rem; border: none; border-radius: 5px; background-color: ${buttonColor}; color: #1a1a2e; cursor: pointer;">Reset</button>
              </td>
            </tr>
          </tbody>
        </table>
      `;

      settingsElement.insertBefore(
        postRaceContainer,
        settingsElement.firstChild
      );

      document
        .getElementById("resetButton")
        .addEventListener("click", resetSessionData);

      return true;
    }
    return false;
  }

  const getTypedCharacterCount = () => {
    return document.querySelectorAll(".dash-letter.is-correct.is-typed")
      ?.length;
  };

  const getTotalCharacters = () => {
    return document.querySelectorAll(".dash-letter").length - 1;
  };

  function calculateRacesLastHour() {
    const oneHourAgo = Date.now() - 1000 * 60 * 60;

    const recentRaces = raceTimes.filter(
      (raceTime) => raceTime.timestamp >= oneHourAgo
    );

    return recentRaces.length;
  }

  function calculateEstimatedRacesPerHour() {
    if (raceTimes.length === 0) return 0;

    const avgRaceTimeInHours =
      raceTimes.reduce((a, b) => a + b.duration, 0) /
      raceTimes.length /
      (1000 * 60 * 60);
    const estimatedRacesPerHour = (1 / avgRaceTimeInHours).toFixed(1);

    localStorage.setItem("estimatedRaces", estimatedRacesPerHour);
    return estimatedRacesPerHour;
  }

  function resetSessionData() {
    sessionStartTime = Date.now();
    raceTimes = [];

    document.getElementById("estimatedRaces").textContent = 0;
    document.getElementById("hourlyRaces").textContent = 0;

    localStorage.setItem("sessionStartTime", sessionStartTime);
    localStorage.setItem("raceTimes", JSON.stringify(raceTimes));
    localStorage.setItem("estimatedRaces", 0);

    console.log("Session data reset.");
  }

  const updateSessionInfo = () => {
    const typedCharacters = getTypedCharacterCount();
    const totalCharactersInRace = getTotalCharacters();

    if (
      typedCharacters === totalCharactersInRace &&
      totalCharactersInRace > 0
    ) {
      const currentTime = Date.now();

      const persistData = localStorage.getItem("persist:nt");
      if (persistData) {
        const parsedPersistData = JSON.parse(persistData);
        const user = JSON.parse(parsedPersistData.user);
        sessionRaces = user.sessionRaces = (user.sessionRaces || 0) + 1;
        averageWPM = user.avgSpeed || 0;
        parsedPersistData.user = JSON.stringify(user);
        localStorage.setItem("persist:nt", JSON.stringify(parsedPersistData));
      }

      const raceDuration =
        currentTime -
        (raceTimes.length > 0
          ? raceTimes[raceTimes.length - 1].timestamp
          : sessionStartTime);
      raceTimes.push({ timestamp: currentTime, duration: raceDuration });
      localStorage.setItem("raceTimes", JSON.stringify(raceTimes));

      raceTimes = raceTimes.filter(
        (race) => race.timestamp >= Date.now() - 1000 * 60 * 60
      );

      document.getElementById("sessionValue").textContent = sessionRaces;
      document.getElementById("averageWPM").textContent = averageWPM;

      document.getElementById("hourlyRaces").textContent =
        calculateRacesLastHour();

      const estimatedRaces = calculateEstimatedRacesPerHour();
      document.getElementById("estimatedRaces").textContent = estimatedRaces;

      clearInterval(updateUI);
      console.log(
        "Race Complete. Session Races:",
        sessionRaces,
        "Average WPM:",
        averageWPM
      );
    }
  };

  const interval = setInterval(() => {
    if (createPostRaceInfo()) {
      clearInterval(interval);
    }
  }, 500);

  const updateUI = setInterval(() => {
    updateSessionInfo();
  }, 500);
})();

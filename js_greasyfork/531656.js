// ==UserScript==
// @name         statsModifierDisplay
// @namespace    statsModifierDisplay.zero.nao
// @version      0.2
// @description  display stats modifiers
// @author       nao [2669774]
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/531656/statsModifierDisplay.user.js
// @updateURL https://update.greasyfork.org/scripts/531656/statsModifierDisplay.meta.js
// ==/UserScript==

(function () {
  let displayDiv;
  let userId;
  const oldFetch = window.fetch;
  window.fetch = async function (url, args) {
    if (url.includes("loader.php?sid=attackData")) {
      logger("Intercepted fetch request");
      let response = await oldFetch(url, args);
      const clonedResponse = response.clone();

      let json = await clonedResponse.json();
      userId = json.DB?.attackerUser?.userID;
      const modifiers = json.DB?.attackerUser.statsModifiers;
      const effects = json.DB?.currentTemporaryEffects;
      if (modifiers) {
        updateModifierDisplay(modifiers, effects);
      }
      return response;
    }
    return oldFetch(url, args);
  };

  function updateModifierDisplay(modifierData, effectData) {
    if (!displayDiv) {
      displayDiv = document.createElement("div");
      displayDiv.className = "stat-modifier-display";
      document.body.appendChild(displayDiv);
      const style = document.createElement("style");
      style.textContent = `
        .stat-modifier-display {
            position: fixed;
            top: 50%;
            transform: translateY(-50%);
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 200px;
            text-align: right;
            z-index: 1000000;
        }
        .stat-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            margin-bottom: 5px;
        }
        .stat-label {
            flex-grow: 1;
            text-align: left;
        }
        .stat-value {
            font-weight: bold;
            min-width: 50px;
            text-align: right;
        }

        .tooltip {
            display: none;
            position: absolute;
            top: 0;
            right: 100%;
            margin-left: 5px;
            background: #333;
            color: white;
            padding: 5px;
            border-radius: 3px;
            white-space: nowrap;
            font-size: 12px;
            z-index: 10;
        }

        .effect-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            margin-top: 15px;
            margin-bottom: 5px;
        }
        .effect-title {
            flex-grow: 1;
            text-align: left;
        }
        .effect-timer {
            font-weight: bold;
            min-width: 50px;
            text-align: right;
        }

    `;
      document.head.appendChild(style);
    }

    displayDiv.innerHTML = ""; // Clear previous content

    Object.entries(modifierData).forEach(([stat, data]) => {
      const statContainer = document.createElement("div");
      statContainer.className = "stat-container";

      const totalModifier = data.value * 1;

      // Determine glow color based on value
      let glowColor =
        totalModifier > 0
          ? "rgba(0, 255, 0, 0.8)"
          : totalModifier < 0
            ? "rgba(255, 0, 0, 0.8)"
            : "rgba(128, 128, 128, 0.8)";

      // Create the stat label
      const statLabel = document.createElement("span");
      statLabel.textContent = `${stat.charAt(0).toUpperCase() + stat.slice(1)}:`;
      statLabel.className = "stat-label";

      // Create the modifier value
      const statValue = document.createElement("span");
      statValue.textContent = `${totalModifier > 0 ? "+" : ""}${totalModifier}%`;
      statValue.className = "stat-value";
      statValue.style.textShadow = `0 0 8px ${glowColor}`;

      // Create the tooltip
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.innerHTML = data.legend.join("<br>"); // Show detailed modifiers

      // Show tooltip on hover
      statValue.addEventListener("mouseenter", () => {
        tooltip.style.display = "block";
      });
      statValue.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });

      statContainer.appendChild(statLabel);
      statContainer.appendChild(statValue);
      statContainer.appendChild(tooltip);
      displayDiv.appendChild(statContainer);
    });

    logger("Updating effects");
    logger(effectData);
    if (!effectData) return;
    const userEffects = effectData[userId];
    if (userEffects) {
      userEffects.forEach((effect) => {
        const effectContainer = document.createElement("div");
        effectContainer.className = "effect-container";

        const effectTitle = document.createElement("span");
        effectTitle.className = "effect-title";
        effectTitle.textContent = effect.title + " ";

        const timer = document.createElement("span");
        timer.className = "timer";
        timer.setAttribute("timeLeft", effect.timeLeft);
        timer.innerText = getDayHourMinute(effect.timeLeft);

        effectContainer.appendChild(effectTitle);
        effectContainer.appendChild(timer);
        displayDiv.appendChild(effectContainer);

        // creae tooltip
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.innerHTML = effect.desc;
        effectContainer.appendChild(tooltip);

        // Start countdown for the timer
        const countdown = setInterval(() => {
          let timeLeft = parseInt(timer.getAttribute("timeLeft"));
          if (timeLeft > 0) {
            timeLeft--;
            timer.setAttribute("timeLeft", timeLeft);
            timer.innerText = getDayHourMinute(timeLeft);
          } else {
            clearInterval(countdown);
            timer.textContent = "00:00";
          }
        }, 1000);
      });
    }
  }

  function logger(msg) {
    const currentDate = new Date();
    const scriptName = "StatModifiers";
    console.log(`${currentDate.toLocaleString()} ${scriptName}:`, msg);
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
})();
// ==UserScript==
// @name         qol.zed-test
// @namespace    qol-test.zed.zero.nao
// @version      0.9
// @description  qol updates for zed.city
// @author       root
// @match        https://www.zed.city/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/526915/qolzed-test.user.js
// @updateURL https://update.greasyfork.org/scripts/526915/qolzed-test.meta.js
// ==/UserScript==

let data = {};

const ENERGY = "";
const RAD = "";
const XP = "";
const RAID = "";

const ITEM_LIMIT = 360;

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
    let limit = response.limits?.limit || 0;
    let limitLeft = response.limits?.limit_left || 0;
    limit = limit - limitLeft;
    insertItemLimit(limit);
  }
});

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

  const dataContainer = document.createElement("div");
  dataContainer.id = "dataContainer";
  dataContainer.style = `
    display: flex;
    flex-direction: row;
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
  if ($("#dataContainer").length > 0) {
    $("#dataContainer").remove();
  }
  document
    .querySelector(".q-toolbar > div:nth-child(1)")
    .parentElement.insertAdjacentElement("afterend", dataContainer);

  let energyMax = data.membership ? 150 : 100;
  let energyRegenRate = data.membership ? 0.5 : 1 / 3;
  let radMax = data.skills.max_rad;
  let radRegenRate = 1 / 5;

  let energyLeft = energyMax - data.energy - 5;
  let radLeft = radMax - data.rad - 1;

  let energyTimeLeft =
    (energyLeft / energyRegenRate) * 60 + data.energy_regen || 0;
  let radTimeLeft = (radLeft / radRegenRate) * 60 + data.rad_regen || 0;

  if ($("#energyTimeLeft").length > 0) {
    $("#energyTimeLeft").text(getDayHourMinute(energyTimeLeft));
  } else {
    const energyLink = document.createElement("a");
    energyLink.href = "/stronghold/1781362";
    energyLink.innerText = "Energy: ";
    energyLink.className = "energy-root";
    const energyLeft = document.createElement("div");
    energyLeft.id = "energyTimeLeft";
    energyLeft.className = "timer";
    energyLeft.timeLeft = energyTimeLeft;
    energyLeft.innerText = getDayHourMinute(energyTimeLeft);
    energyLeft.style.cursor = "pointer";

    dataContainer.appendChild(energyLink);
    energyLink.appendChild(energyLeft);
  }

  if ($("#radTimeLeft").length > 0) {
    $("#radTimeLeft").text(getDayHourMinute(radTimeLeft));
  } else {
    const radLink = document.createElement("a");
    radLink.href = "/scavenge";
    radLink.innerText = "Rad: ";
    radLink.className = "rad-root";
    const radLeft = document.createElement("div");
    radLeft.id = "radTimeLeft";
    radLeft.className = "timer";
    radLeft.timeLeft = radTimeLeft;
    radLeft.innerText = getDayHourMinute(radTimeLeft);
    radLeft.style.cursor = "pointer";

    dataContainer.appendChild(radLink);
    radLink.appendChild(radLeft);
  }

  let xpEnd = Math.round(data.xp_end);
  let xpNow = Math.round(data.experience);

  if ($("#xpData").length > 0) {
    $("#xpData").text(`xp: ${xpEnd - xpNow}`);
  } else {
    const xpData = document.createElement("div");
    xpData.id = "xpData";
    xpData.className = "xp-root";
    xpData.innerText = `xp: ${xpEnd - xpNow} [${xpNow}/${xpEnd}]`;
    dataContainer.appendChild(xpData);
  }

  if (data.raid_cooldown) {
    const raidTimeLeft = getDayHourMinute(data.raid_cooldown);
    if ($("#raidTimeLeft").length > 0) {
      $("#raidTimeLeft").text(raidTimeLeft);
    } else {
      const raidLink = document.createElement("a");
      raidLink.href = "/raids";
      raidLink.innerText = "RAID: ";
      raidLink.className = "raid-root";
      const raidTimeLeft = document.createElement("div");
      raidTimeLeft.className = "timer";
      raidTimeLeft.timeLeft = data.raid_cooldown;
      raidTimeLeft.id = "raidTimeLeft";
      raidTimeLeft.innerText = getDayHourMinute(data.raid_cooldown);
      raidTimeLeft.style.cursor = "pointer";

      dataContainer.appendChild(raidLink);
      raidLink.appendChild(raidTimeLeft);
    }
  }

  if (data.membership) {
    waitForElement(".fa-star").then((element) => {
      element.parentElement.addEventListener("mouseenter", () => {
        updateMembership();
      });
    });
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

function updateTimers() {
  document.querySelectorAll(".timer").forEach((timer) => {
    const timeLeft = timer.timeLeft - 1;
    timer.timeLeft = timeLeft;

    if (timeLeft == 0) {
      const timerType = timer.id.replace("TimeLeft", "");
      let message = "";
      let link = "";

      if (timerType == "energy") {
        message = "Energy is full!";
        link = "/stronghold/1781362";
      } else if (timerType == "rad") {
        message = "Rad is full!";
        link = "/scavenge";
      } else if (timerType == "raid") {
        message = "Raid timer is up!";
        link = "/raids";
      }
      sendNotification("Zed City [root]", message, link);
    }
    timer.innerText = getDayHourMinute(timeLeft);
  });
}

function sendNotification(title, body, link) {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
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
  if (!tooltip) {
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

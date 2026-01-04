// ==UserScript==
// @name         MouseHunt - Birthday Map Color Coder 2021
// @author       Vinnie, Blende & Tran Situ (tsitu), in59te
// @version      1.111
// @description  Color codes mice on birthday maps according to decorations // & cheese. Based off tsitu's work.
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @namespace    https://greasyfork.org/en/scripts/397287-mousehunt-birthday-map-color-coder-2020
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @downloadURL https://update.greasyfork.org/scripts/397287/MouseHunt%20-%20Birthday%20Map%20Color%20Coder%202021.user.js
// @updateURL https://update.greasyfork.org/scripts/397287/MouseHunt%20-%20Birthday%20Map%20Color%20Coder%202021.meta.js
// ==/UserScript==

const mixingMice = [
  "Force Fighter Blue",
  "Force Fighter Green",
  "Force Fighter Pink",
  "Force Fighter Red",
  "Force Fighter Yellow",
  "Super FighterBot MegaSupreme",
];

const breakMice = [
  "Breakdancer",
  "Fete Fromager",
  "Dance Party",
  "El Flamenco",
  "Para Para Dancer"
];

const pumpMice = [
  "Reality Restitch",
  "Time Punk",
  "Time Tailor",
  "Time Thief",
    "Space Party-Time Plumber"
];

const qaMice = [
  "Cupcake Candle Thief",
  "Cupcake Cutie",
  "Sprinkly Sweet Cupcake Cook",
  "Cupcake Camo",
  "Cupcake Runner"
];

const bossMice = [
  "Vincent, The Magnificent"
];

const sbMice = [
  "Cheesy Party"
];

const factoryMice = [
  "Factory Technician"
];

const standardMice = [
  "Birthday",
  "Buckethead",
  "Present",
  "Pintail",
  "Dinosuit",
  "Sleepwalker",
  "Terrible Twos"
];

const birthdayMaps = [
  "Rare Birthday Treasure Chest",
  "Birthday Treasure Chest",
  "Rare Gilded Birthday Treasure Chest",
  "Gilded Birthday Treasure Chest",
  "Rare Gilded Birthday Treasure Chest",
];

function colorize() {
  let mixingColor = "#c97c49"; // brown-ish
  let mixingCount = 0;
  let breakColor = "#f06a60"; // red
  let breakCount = 0;
  let pumpColor = "#5ae031"; // green
  let pumpCount = 0;
  let qaColor = "#4fcaf0"; // blue
  let qaCount = 0;
  let bossColor = "#cd87ff"; // light purple
  let bossCount = 0;
  let sbColor = "#66ffff"; // teal-ish
  let sbCount = 0;
  let standardColor = "#afa500"; // mountain dew-ish
  let standardCount = 0;
  let factoryColor = "#e6e6ff";
  let factoryCount = 0;
  const greyColor = "#949494";

  const isChecked =
    localStorage.getItem("highlightPref") === "uncaught-only" ? true : false;
  const isCheckedStr = isChecked ? "checked" : "";

  if (
    document.querySelectorAll(".treasureMapView-goals-group-goal").length === 0
  ) {
    return;
  }

  document.querySelectorAll(".treasureMapView-goals-group-goal").forEach(el => {
    el.querySelector("span").style = "color: black; font-size: 11px;";

    const mouseName = el.querySelector(".treasureMapView-goals-group-goal-name")
      .textContent;

    if (mixingMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = mixingColor;
      if (el.className.indexOf(" complete ") < 0) {
        mixingCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (breakMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = breakColor;
      if (el.className.indexOf(" complete ") < 0) {
        breakCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (pumpMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = pumpColor;
      if (el.className.indexOf(" complete ") < 0) {
        pumpCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (qaMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = qaColor;
      if (el.className.indexOf(" complete ") < 0) {
        qaCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (bossMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = bossColor;
      if (el.className.indexOf(" complete ") < 0) {
        bossCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (sbMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = sbColor;
      if (el.className.indexOf(" complete ") < 0) {
        sbCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (factoryMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = factoryColor;
      if (el.className.indexOf(" complete ") < 0) {
        factoryCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (standardMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = standardColor;
      if (el.className.indexOf(" complete ") < 0) {
        standardCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    }
  });

  mixingColor = mixingCount > 0 ? mixingColor : greyColor;
  breakColor = breakCount > 0 ? breakColor : greyColor;
  pumpColor = pumpCount > 0 ? pumpColor : greyColor;
  qaColor = qaCount > 0 ? qaColor : greyColor;
  bossColor = bossCount > 0 ? bossColor : greyColor;
  sbColor = sbCount > 0 ? sbColor : greyColor;
  factoryColor = factoryCount > 0 ? factoryColor : greyColor;
  standardColor = standardCount > 0 ? standardColor : greyColor;

  // Remove existing birthday Map related elements before proceeding
  document.querySelectorAll(".tsitu-birthday-map").forEach(el => el.remove());

  const masterDiv = document.createElement("div");
  masterDiv.className = "tsitu-birthday-map";
  masterDiv.style =
    "display: inline-flex; margin-bottom: 10px; width: 100%; text-align: center; line-height: 1.5; overflow: hidden";
  const spanStyle =
    "; width: auto; padding: 5px; font-weight: bold; font-size: 12.5px";

  const mixingSpan = document.createElement("span");
  mixingSpan.style = "background-color: " + mixingColor + spanStyle;
  mixingSpan.innerHTML = "Mixing<br>" + mixingCount;

  const breakSpan = document.createElement("span");
  breakSpan.style = "background-color: " + breakColor + spanStyle;
  breakSpan.innerHTML = "Break<br>" + breakCount;

  const pumpSpan = document.createElement("span");
  pumpSpan.style = "background-color: " + pumpColor + spanStyle;
  pumpSpan.innerHTML = "Pump<br>" + pumpCount;

  const qaSpan = document.createElement("span");
  qaSpan.style = "background-color: " + qaColor + spanStyle;
  qaSpan.innerHTML = "QA<br>" + qaCount;

  const vinnieSpan = document.createElement("span");
  vinnieSpan.style = "background-color: " + bossColor + spanStyle;
  vinnieSpan.innerHTML = "Vinnie<br>" + bossCount;

  const sbSpan = document.createElement("span");
  sbSpan.style = "background-color: " + sbColor + spanStyle;
  sbSpan.innerHTML = "SB+<br>" + sbCount;

  const factorySpan = document.createElement("span");
  factorySpan.style = "background-color: " + factoryColor + spanStyle;
  factorySpan.innerHTML = "Factory Charm<br>" + factoryCount;

  const standardSpan = document.createElement("span");
  standardSpan.style = "background-color: " + standardColor + spanStyle;
  standardSpan.innerHTML = "Standard<br>" + standardCount;

  // Highlight uncaught only feature
  const highlightLabel = document.createElement("label");
  highlightLabel.htmlFor = "tsitu-highlight-box";
  highlightLabel.innerText = "Highlight uncaught mice only";

  const highlightBox = document.createElement("input");
  highlightBox.type = "checkbox";
  highlightBox.name = "tsitu-highlight-box";
  highlightBox.style.verticalAlign = "middle";
  highlightBox.checked = isChecked;
  highlightBox.addEventListener("click", function() {
    if (highlightBox.checked) {
      localStorage.setItem("highlightPref", "uncaught-only");
    } else {
      localStorage.setItem("highlightPref", "all");
    }
    colorize();
  });

  const highlightDiv = document.createElement("div");
  highlightDiv.className = "tsitu-birthday-map";
  highlightDiv.style =
    "margin-bottom: 5px; width: 35%; border: 1px dotted black";
  highlightDiv.appendChild(highlightBox);
  highlightDiv.appendChild(highlightLabel);

  // Assemble masterDiv
  masterDiv.appendChild(mixingSpan);
  masterDiv.appendChild(breakSpan);
  masterDiv.appendChild(pumpSpan);
  masterDiv.appendChild(qaSpan);
  masterDiv.appendChild(vinnieSpan);
  masterDiv.appendChild(sbSpan);
  masterDiv.appendChild(factorySpan);
  masterDiv.appendChild(standardSpan);

  // Inject into DOM
  const insertEl = document.querySelector(
    ".treasureMapView-leftBlock .treasureMapView-block-content"
  );
  if (
    insertEl &&
    document.querySelector(
      ".treasureMapRootView-header-navigation-item.tasks.active"
    )
  ) {
    insertEl.insertAdjacentElement("afterbegin", highlightDiv);
    insertEl.insertAdjacentElement("afterbegin", masterDiv);
  }

  // "Goals" button
  document.querySelector("[data-type='show_goals']").onclick = function() {
    colorize();
  };
}

// Listen to XHRs, opening a map always at least triggers board.php
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function() {
    this.addEventListener("load", function () {
        const mapEl = document.querySelector(".treasureMapView-mapMenu-rewardName");
    if (mapEl) {
      const mapName = mapEl.textContent;
      if (mapName && birthdayMaps.indexOf(mapName) > -1) {
        colorize();
      }
    }
  });
  originalOpen.apply(this, arguments);
};

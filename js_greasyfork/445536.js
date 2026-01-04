// ==UserScript==
// @name         MouseHunt - QCGT Map Colour Coder
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Color codes mice on qcgt maps according to type
// @author       Crisal
// @match        https://www.mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/*
// @include      http://apps.facebook.com/mousehunt/*
// @include	 https://apps.facebook.com/mousehunt/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445536/MouseHunt%20-%20QCGT%20Map%20Colour%20Coder.user.js
// @updateURL https://update.greasyfork.org/scripts/445536/MouseHunt%20-%20QCGT%20Map%20Colour%20Coder.meta.js
// ==/UserScript==

const betrioMice = [
  "Ignatia",
  "Smoldersnap",
  "Bearded Elder",
];

const cinderbrutMice = [
  "Bruticus, the Blazing",
  "Cinderstorm",
];

const cqMice = [
  "Rubble Rouser",
  "Rubble Rummager",
  "Tiny Toppler",
  "Ore Chipper",
  "Chip Chiseler",
  "Grampa Golem",
  "Nachore Golem",
  "Fiery Crusher",
];

const friendsMice = [
  "Fuzzy Drake",
  "Rambunctious Rain Rumbler",
  "Horned Cork Hoarder",
  "Cork Defender",
  "Burly Bruiser",
];

const bossMice = [
  "Inferna, The Engulfed",
  "Nachous, The Molten",
  "Queen Quesada",
  "Emberstone Scaled",
  "Corkataur",
];

const kssMice = [
  "Stormsurge, the Vile Tempest",
  "Kalor'ignis of the Geyser"
];

const ppMice = [
  "Old Spice Collector",
  "Spice Farmer",
  "Spice Sovereign",
  "Spice Raider",
  "Granny Spice",
  "Spice Finder",
  "Spice Seer",
  "Spice Reaper"
];

const pressureMice = [
  "Pyrehyde",
  "Steam Sailor",
  "Vaporior",
  "Warming Wyvern",
];

const qrMice = [
  "Pump Raider",
  "Tiny Saboteur",
  "Sleepy Merchant"
];

const sizzlemildMice = [
  "Sizzle Pup",
  "Mild Spicekin"
];

const corkyMice = [
  "Corky, the Collector"
];

const ccMice = [
  "Croquet Crusher"
];


const qcgtMaps = [
  "Queso Canyon Grand Tour Treasure Chest",
  "Rare Queso Canyon Grand Tour Treasure Chest",
];

function colorize() {
  let betrioColor = "#c97c49"; // brown-ish
  let betrioCount = 0;
  let cinderbrutColor = "#f06a60"; // red
  let cinderbrutCount = 0;
  let cqColor = "#5ae031"; // green
  let cqCount = 0;
  let friendsColor = "#4fcaf0"; // blue
  let friendsCount = 0;
  let bossColor = "#cd87ff"; // light purple
  let bossCount = 0;
  let kssColor = "#66ffff"; // teal-ish
  let kssCount = 0;
  let ppColor = "#afa500"; // mountain dew-ish
  let ppCount = 0;
  let pressureColor = "#e6e6ff";
  let pressureCount = 0;
  let qrColor = "#ffa500"; // orange
  let qrCount = 0;
  let sizzlemildColor = "#ffffe0"; // yellow
  let sizzlemildCount = 0;
  let corkyColor = "#58cf6f"; // Corky
  let corkyCount = 0;
  let ccColor = "#ab95b8"; // Croquet
  let ccCount = 0;
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

    if (qrMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = qrColor;
      if (el.className.indexOf(" complete ") < 0) {
        qrCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (ppMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = ppColor;
      if (el.className.indexOf(" complete ") < 0) {
        ppCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (cqMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = cqColor;
      if (el.className.indexOf(" complete ") < 0) {
        cqCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (friendsMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = friendsColor;
      if (el.className.indexOf(" complete ") < 0) {
        friendsCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (pressureMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = pressureColor;
      if (el.className.indexOf(" complete ") < 0) {
        pressureCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (sizzlemildMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = sizzlemildColor;
      if (el.className.indexOf(" complete ") < 0) {
        sizzlemildCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (betrioMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = betrioColor;
      if (el.className.indexOf(" complete ") < 0) {
        betrioCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (cinderbrutMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = cinderbrutColor;
      if (el.className.indexOf(" complete ") < 0) {
        cinderbrutCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
     } else if (kssMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = kssColor;
      if (el.className.indexOf(" complete ") < 0) {
        kssCount++;
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
    }
      else if (corkyMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = corkyColor;
      if (el.className.indexOf(" complete ") < 0) {
        corkyCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    }

      else if (ccMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = ccColor;
      if (el.className.indexOf(" complete ") < 0) {
        ccCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    }
  });

  betrioColor = betrioCount > 0 ? betrioColor : greyColor;
  cinderbrutColor = cinderbrutCount > 0 ? cinderbrutColor : greyColor;
  cqColor = cqCount > 0 ? cqColor : greyColor;
  friendsColor = friendsCount > 0 ? friendsColor : greyColor;
  bossColor = bossCount > 0 ? bossColor : greyColor;
  kssColor = kssCount > 0 ? kssColor : greyColor;
  ppColor = ppCount > 0 ? ppColor : greyColor;
  pressureColor = pressureCount > 0 ? pressureColor : greyColor;
  qrColor = qrCount > 0 ? qrColor : greyColor;
  sizzlemildColor = sizzlemildCount > 0 ? sizzlemildColor : greyColor;
  corkyColor = corkyCount > 0 ? corkyColor : greyColor;
  ccColor = ccCount > 0 ? ccColor : greyColor;

  // Remove existing birthday Map related elements before proceeding
  document.querySelectorAll(".tsitu-birthday-map").forEach(el => el.remove());

  const masterDiv = document.createElement("div");
  masterDiv.className = "tsitu-birthday-map";
  masterDiv.style =
    "display: inline-flex; margin-bottom: 10px; width: 100%; text-align: center; line-height: 1.5; overflow: hidden";
  const spanStyle =
    "; width: auto; padding: 5px; font-weight: bold; font-size: 12.5px";

  const qrSpan = document.createElement("span");
  qrSpan.style = "background-color: " + qrColor + spanStyle;
  qrSpan.innerHTML = "QR<br>" + qrCount;

  const ppSpan = document.createElement("span");
  ppSpan.style = "background-color: " + ppColor + spanStyle;
  ppSpan.innerHTML = "PP<br>" + ppCount;

  const cqSpan = document.createElement("span");
  cqSpan.style = "background-color: " + cqColor + spanStyle;
  cqSpan.innerHTML = "CQ<br>" + cqCount;

  const friendsSpan = document.createElement("span");
  friendsSpan.style = "background-color: " + friendsColor + spanStyle;
  friendsSpan.innerHTML = "Cork<br>" + friendsCount;

  const pressureSpan = document.createElement("span");
  pressureSpan.style = "background-color: " + pressureColor + spanStyle;
  pressureSpan.innerHTML = "Pressure<br>" + pressureCount;

  const sizzlemildSpan = document.createElement("span");
  sizzlemildSpan.style = "background-color: " + sizzlemildColor + spanStyle;
  sizzlemildSpan.innerHTML = "Sizz/M<br>" + sizzlemildCount;

  const betrioSpan = document.createElement("span");
  betrioSpan.style = "background-color: " + betrioColor + spanStyle;
  betrioSpan.innerHTML = "BE<br>" + betrioCount;

  const cinderbrutSpan = document.createElement("span");
  cinderbrutSpan.style = "background-color: " + cinderbrutColor + spanStyle;
  cinderbrutSpan.innerHTML = "Cin/B<br>" + cinderbrutCount;

  const kssSpan = document.createElement("span");
  kssSpan.style = "background-color: " + kssColor + spanStyle;
  kssSpan.innerHTML = "KSS<br>" + kssCount;

  const bossSpan = document.createElement("span");
  bossSpan.style = "background-color: " + bossColor + spanStyle;
  bossSpan.innerHTML = "Boss<br>" + bossCount;

  const corkySpan = document.createElement("span");
  corkySpan.style = "background-color: " + corkyColor + spanStyle;
  corkySpan.innerHTML = "Corky<br>" + corkyCount;

  const ccSpan = document.createElement("span");
  ccSpan.style = "background-color: " + ccColor + spanStyle;
  ccSpan.innerHTML = "CC<br>" + ccCount;

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
  masterDiv.appendChild(qrSpan);
  masterDiv.appendChild(ccSpan);
  masterDiv.appendChild(ppSpan);
  masterDiv.appendChild(cqSpan);
  masterDiv.appendChild(friendsSpan);
  masterDiv.appendChild(pressureSpan);
  masterDiv.appendChild(sizzlemildSpan);
  masterDiv.appendChild(betrioSpan);
  masterDiv.appendChild(cinderbrutSpan);
  masterDiv.appendChild(kssSpan);
  masterDiv.appendChild(bossSpan);
  masterDiv.appendChild(corkySpan);

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
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", function () {
      const chestEl = document.querySelector(
        ".treasureMapView-mapMenu-rewardName"
      );

      // 2019: Nice/Naughty List descriptors present in HUD, not so in 2020
      // 2020: "2018-2020 [Rare] Nice Treasure Chest" & "2020 [Rare] Naughty Treasure Chest"
      if (chestEl) {
        const chestName = chestEl.textContent;
        if (
          chestName &&
          (chestName.indexOf("Queso Canyon Grand Tour Treasure Chest") >= 0)
        ) {
          colorize();
        }
      }
    });
    originalOpen.apply(this, arguments);
  };
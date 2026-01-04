// ==UserScript==
// @name         MouseHunt - Sky Pirate Map Color Coder
// @author       Anon, special thanks to Tran Situ (tsitu) for the base script
// @namespace    
// @version      1.2
// @description  Color codes mice on pirate maps according to areas & cheese
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/419939/MouseHunt%20-%20Sky%20Pirate%20Map%20Color%20Coder.user.js
// @updateURL https://update.greasyfork.org/scripts/419939/MouseHunt%20-%20Sky%20Pirate%20Map%20Color%20Coder.meta.js
// ==/UserScript==

//v1.0: Changes from GWH Color Coder [08-Jan-2021]:
//sport --> launchpad
//toy --> lai
//ornament --> oneskypirate
//snow --> twoskypirate
//fireworks --> arcane
//glazy --> forgotten
//pecan --> hydro
//sb --> shadowMice
//standard --> draconic
//lisc --> law
//winter --> physical
//add --> tactical
//add --> richard

//v1.1 [09-Jan-2021]:
// Changed Physical color to orange, from dark purple
// Changed Shadow color to dark blue-grey, from grey
// Added Sky Dancer to Arcane Mice pool
// Confirmed script works for 4-men & 5-men maps
// Changed T1 to P1 for Tier 1 Pirates
// Changed T2 to P2 for Tier 2 Pirates


const launchpadMice = [
"Cloud Miner",
"Launchpad Labourer",
"Sky Greaser",
"Skydiver"
];

const laiMice = [
"Daydreamer",
"Kite Flyer",
"Warden of Fog",
"Warden of Wind",
"Warden of Frost",
"Warden of Rain"
];

const oneskypirateMice = [
"Suave Pirate",
"Cutthroat Pirate",
"Cutthroat Cannoneer"
];

const twoskypirateMice = [
"Admiral Cloudbeard",
"Mairitime Pirate",
"Scarlet Revenger"
];

const arcaneMice = [
"Sky Glass Glazier",
"Sky Glass Sorcerer",
"Sky Dancer",
"Sky Highborne",
"Paragon of Arcane"
];

const forgottenMice = [
"Cumulost",
"Spheric Diviner",
"Spry Sky Explorer",
"Spry Sky Seer",
"Paragon of Forgotten"
];

const hydroMice = [
"Cute Cloud Conjurer",
"Mist Maker",
"Nimbomancer",
"Sky Surfer",
"Paragon of Water"
];

const shadowMice = [
"Astrological Astronomer",
"Overcaster",
"Shadow Sage",
"Stratocaster",
"Paragon of Shadow"
];

const draconicMice = [
"Dragonbreather",
"Lancer Guard",
"Regal Spearman",
"Tiny Dragonfly",
"Paragon of Dragons"
];

const lawMice = [
"Agent M",
"Devious Gentleman",
"Lawbender",
"Stack of Thieves",
"Paragon of the Lawless"
];

const physicalMice = [
"Ground Gavaleer",
"Herc",
"Sky Squire",
"Sky Swordsman",
"Paragon of Strength"
];

const tacticalMice = [
"Captain Cloudkicker",
"Gyrologer",
"Seasoned Islandographer",
"Worried Wayfinder",
"Paragon of Tactics"
];

const richardMice = [
"Richard the Rich"
];

function colorize() {
  let launchpadColor = "#D7FFFF"// light blue
  let launchpadCount = 0;
  let laiColor = "#FF00B0"; // hot pink
  let laiCount = 0;
  let oneskypirateColor = "#5ae031"; // green
  let oneskypirateCount = 0;
  let twoskypirateColor = "#338838"; // darker green
  let twoskypirateCount = 0;
  let arcaneColor = "#cd87ff"; // light purple
  let arcaneCount = 0;
  let forgottenColor = "#B300CD"; // purple
  let forgottenCount = 0;
  let hydroColor = "#4fcaf0"; // blue
  let hydroCount = 0;
  let shadowColor = "#616287"; // dark blue-grey
  let shadowCount = 0;
  let draconicColor = "#FF1E00"; // red
  let draconicCount = 0;
  let lawColor = "#afa500"; // mountain dew-ish
  let lawCount = 0;
  let physicalColor = "#FF8300"; // orange
  let physicalCount = 0;
  let tacticalColor = "#c97c49"; // brown-ish
  let tacticalCount = 0;
  let richardColor = "#ffff66"; // yellow
  let richardCount = 0;


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

    if (launchpadMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = launchpadColor;
      if (el.className.indexOf(" complete ") < 0) {
        launchpadCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (laiMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = laiColor;
      if (el.className.indexOf(" complete ") < 0) {
        laiCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (oneskypirateMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = oneskypirateColor;
      if (el.className.indexOf(" complete ") < 0) {
        oneskypirateCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (twoskypirateMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = twoskypirateColor;
      if (el.className.indexOf(" complete ") < 0) {
        twoskypirateCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (arcaneMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = arcaneColor;
      if (el.className.indexOf(" complete ") < 0) {
        arcaneCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (forgottenMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = forgottenColor;
      if (el.className.indexOf(" complete ") < 0) {
        forgottenCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (hydroMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = hydroColor;
      if (el.className.indexOf(" complete ") < 0) {
        hydroCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (shadowMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = shadowColor;
      if (el.className.indexOf(" complete ") < 0) {
        shadowCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (draconicMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = draconicColor;
      if (el.className.indexOf(" complete ") < 0) {
        draconicCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (lawMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = lawColor;
      if (el.className.indexOf(" complete ") < 0) {
        lawCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (physicalMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = physicalColor;
      if (el.className.indexOf(" complete ") < 0) {
        physicalCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (tacticalMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = tacticalColor;
      if (el.className.indexOf(" complete ") < 0) {
        tacticalCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (richardMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = richardColor;
      if (el.className.indexOf(" complete ") < 0) {
        richardCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    }
  });

  launchpadColor = launchpadCount > 0 ? launchpadColor : greyColor;
  laiColor = laiCount > 0 ? laiColor : greyColor;
  oneskypirateColor = oneskypirateCount > 0 ? oneskypirateColor : greyColor;
  twoskypirateColor = twoskypirateCount > 0 ? twoskypirateColor : greyColor;
  arcaneColor = arcaneCount > 0 ? arcaneColor : greyColor;
  forgottenColor = forgottenCount > 0 ? forgottenColor : greyColor;
  hydroColor = hydroCount > 0 ? hydroColor : greyColor;
  shadowColor = shadowCount > 0 ? shadowColor : greyColor;
  draconicColor = draconicCount > 0 ? draconicColor : greyColor;
  lawColor = lawCount > 0 ? lawColor : greyColor;
  physicalColor = physicalCount > 0 ? physicalColor : greyColor;
  tacticalColor = tacticalCount > 0 ? tacticalColor : greyColor;
  richardColor = richardCount > 0 ? richardColor : greyColor;

  // Remove existing Pirate Map related elements before proceeding
  document.querySelectorAll(".tsitu-pirate-map").forEach(el => el.remove());

  const masterDiv = document.createElement("div");
  masterDiv.className = "tsitu-pirate-map";
  masterDiv.style =
    "display: inline-flex; margin-bottom: 10px; width: 100%; text-align: center; line-height: 1.5; overflow: hidden";
  const spanStyle =
    "; width: auto; padding: 5px; font-weight: bold; font-size: 12.75px; text-shadow: 0px 0px 11px white";

  const launchpadSpan = document.createElement("span");
  launchpadSpan.style = "background-color: " + launchpadColor + spanStyle;
  launchpadSpan.innerHTML = "Pad<br>" + launchpadCount;

  const laiSpan = document.createElement("span");
  laiSpan.style = "background-color: " + laiColor + spanStyle;
  laiSpan.innerHTML = "LAI<br>" + laiCount;

  const oneskypirateSpan = document.createElement("span");
  oneskypirateSpan.style = "background-color: " + oneskypirateColor + spanStyle;
  oneskypirateSpan.innerHTML = "P1<br>" + oneskypirateCount;

  const twoskypirateSpan = document.createElement("span");
  twoskypirateSpan.style = "background-color: " + twoskypirateColor + spanStyle;
  twoskypirateSpan.innerHTML = "P2<br>" + twoskypirateCount;

  const arcaneSpan = document.createElement("span");
  arcaneSpan.style = "background-color: " + arcaneColor + spanStyle;
  arcaneSpan.innerHTML = "Arca<br>" + arcaneCount;

  const forgottenSpan = document.createElement("span");
  forgottenSpan.style = "background-color: " + forgottenColor + spanStyle;
  forgottenSpan.innerHTML = "Forg<br>" + forgottenCount;

  const hydroSpan = document.createElement("span");
  hydroSpan.style = "background-color: " + hydroColor + spanStyle;
  hydroSpan.innerHTML = "Hyd<br>" + hydroCount;

  const shadowSpan = document.createElement("span");
  shadowSpan.style = "background-color: " + shadowColor + spanStyle;
  shadowSpan.innerHTML = "Shad<br>" + shadowCount;

  const draconicSpan = document.createElement("span");
  draconicSpan.style = "background-color: " + draconicColor + spanStyle;
  draconicSpan.innerHTML = "Drag<br>" + draconicCount;

  const lawSpan = document.createElement("span");
  lawSpan.style = "background-color: " + lawColor + spanStyle;
  lawSpan.innerHTML = "Law<br>" + lawCount;

  const physicalSpan = document.createElement("span");
  physicalSpan.style = "background-color: " + physicalColor + spanStyle;
  physicalSpan.innerHTML = "Phy<br>" + physicalCount;

  const tacticalSpan = document.createElement("span");
  tacticalSpan.style = "background-color: " + tacticalColor + spanStyle;
  tacticalSpan.innerHTML = "Tact<br>" + tacticalCount;

  const richardSpan = document.createElement("span");
  richardSpan.style = "background-color: " + richardColor + spanStyle;
  richardSpan.innerHTML = "Rich<br>" + richardCount;

  // Highlight uncaught only feature
  const highlightLabel = document.createElement("label");
  highlightLabel.htmlFor = "tsitu-highlight-box";
  highlightLabel.innerText = "Highlight uncaught mice only";

  const highlightBox = document.createElement("input");
  highlightBox.type = "checkbox";
  highlightBox.name = "tsitu-highlight-box";
  highlightBox.style.verticalAlign = "middle";
  highlightBox.checked = isChecked;
  highlightBox.addEventListener("click", function () {
    if (highlightBox.checked) {
      localStorage.setItem("highlightPref", "uncaught-only");
    } else {
      localStorage.setItem("highlightPref", "all");
    }
    colorize();
  });

  const highlightDiv = document.createElement("div");
  highlightDiv.className = "tsitu-pirate-map";
  highlightDiv.style = "float: right; position: relative; z-index: 1";
  highlightDiv.appendChild(highlightBox);
  highlightDiv.appendChild(highlightLabel);

  // Assemble masterDiv
  masterDiv.appendChild(launchpadSpan);
  masterDiv.appendChild(laiSpan);
  masterDiv.appendChild(oneskypirateSpan);
  masterDiv.appendChild(twoskypirateSpan);
  masterDiv.appendChild(arcaneSpan);
  masterDiv.appendChild(forgottenSpan);
  masterDiv.appendChild(hydroSpan);
  masterDiv.appendChild(shadowSpan);
  masterDiv.appendChild(draconicSpan);
  masterDiv.appendChild(lawSpan);
  masterDiv.appendChild(physicalSpan);
  masterDiv.appendChild(tacticalSpan);
  masterDiv.appendChild(richardSpan);

  // Inject into DOM
  const insertEl = document.querySelector(
    ".treasureMapView-leftBlock .treasureMapView-block-content"
  );
  if (
    insertEl &&
    document.querySelector(
      ".treasureMapRootView-header-navigation-item.tasks.active" // On "Active Maps"
    )
  ) {
    insertEl.insertAdjacentElement("afterbegin", highlightDiv);
    insertEl.insertAdjacentElement("afterbegin", masterDiv);
  }

  // "Goals" button
  document.querySelector("[data-type='show_goals']").onclick = function () {
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
    // Adapted from GWH Map Color Coder, ^ comment from tsitu
    if (chestEl) {
      const chestName = chestEl.textContent;
      if (
        chestName &&
        (chestName.indexOf("Sky Pirate Treasure Chest") >= 0)
      ) {
        colorize();
      }
    }
  });
  originalOpen.apply(this, arguments);
};
// ==UserScript==
// @name         MouseHunt - GWH Map Color Coder
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      1.3
// @description  Color codes mice on GWH maps according to decorations & cheese
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/393710/MouseHunt%20-%20GWH%20Map%20Color%20Coder.user.js
// @updateURL https://update.greasyfork.org/scripts/393710/MouseHunt%20-%20GWH%20Map%20Color%20Coder.meta.js
// ==/UserScript==

const sportMice = [
  "Sporty Ski Instructor",
  "Young Prodigy Racer",
  "Toboggan Technician",
  "Free Skiing",
  "Nitro Racer",
  "Rainbow Racer",
  "Double Black Diamond Racer",
  "Black Diamond Racer"
];

const toyMice = [
  "Nutcracker",
  "Toy",
  "Slay Ride",
  "Squeaker Claws",
  "Destructoy",
  "Toy Tinkerer",
  "Mad Elf",
  "Elf"
];

const ornamentalMice = [
  "Christmas Tree",
  "Stocking",
  "Candy Cane",
  "Ornament",
  "Missile Toe",
  "Wreath Thief",
  "Ribbon",
  "Snowglobe"
];

const snowMice = [
  "Snow Fort",
  "Snowball Hoarder",
  "S.N.O.W. Golem",
  "Snow Sorceress",
  "Reinbo",
  "Tundra Huntress",
  "Snowblower",
  "Snow Boulder"
];

const fireworksMice = [
  "Frightened Flying Fireworks",
  "New Year's",
  "Party Head"
];

const glazyMice = ["Glazy", "Joy"];

const pecanMice = [
  "Borean Commander",
  "Builder",
  "Frigid Foreman",
  "Glacia Ice Fist",
  "Great Winter Hunt Impostor",
  "Iceberg Sculptor",
  "Naughty Nougat",
  "Nice Knitting",
  "Ridiculous Sweater",
  "Shorts-All-Year",
  "Snow Golem Jockey",
  "Snow Scavenger",
  "Stuck Snowball"
];

const sbMice = [
  "Mouse of Winter Future",
  "Mouse of Winter Past",
  "Mouse of Winter Present",
  "Scrooge"
];

const standardMice = [
  "Confused Courier",
  "Gingerbread",
  "Greedy Al",
  "Hoarder",
  "Miser",
  "Present",
  "Triple Lutz"
];

const liscMice = ["Snow Golem Architect"];

const winterMice = ["Snowflake"];

function colorize() {
  let sportColor = "#c97c49"; // brown-ish
  let sportCount = 0;
  let toyColor = "#f06a60"; // red
  let toyCount = 0;
  let ornamentalColor = "#5ae031"; // green
  let ornamentalCount = 0;
  let snowColor = "#4fcaf0"; // blue
  let snowCount = 0;
  let fireworksColor = "#cd87ff"; // light purple
  let fireworksCount = 0;
  let glazyColor = "#ff9966"; // orange
  let glazyCount = 0;
  let pecanColor = "#ffff66"; // yellow
  let pecanCount = 0;
  let sbColor = "#66ffff"; // teal-ish
  let sbCount = 0;
  let standardColor = "#afa500"; // mountain dew-ish
  let standardCount = 0;
  let liscColor = "#6a62ad"; // medium purple
  let liscCount = 0;
  let winterColor = "#338838"; // darker green
  let winterCount = 0;
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

    if (sportMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = sportColor;
      if (el.className.indexOf(" complete ") < 0) {
        sportCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (toyMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = toyColor;
      if (el.className.indexOf(" complete ") < 0) {
        toyCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (ornamentalMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = ornamentalColor;
      if (el.className.indexOf(" complete ") < 0) {
        ornamentalCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (snowMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = snowColor;
      if (el.className.indexOf(" complete ") < 0) {
        snowCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (fireworksMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = fireworksColor;
      if (el.className.indexOf(" complete ") < 0) {
        fireworksCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (glazyMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = glazyColor;
      if (el.className.indexOf(" complete ") < 0) {
        glazyCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (pecanMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = pecanColor;
      if (el.className.indexOf(" complete ") < 0) {
        pecanCount++;
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
    } else if (standardMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = standardColor;
      if (el.className.indexOf(" complete ") < 0) {
        standardCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (liscMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = liscColor;
      if (el.className.indexOf(" complete ") < 0) {
        liscCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (winterMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = winterColor;
      if (el.className.indexOf(" complete ") < 0) {
        winterCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    }
  });

  sportColor = sportCount > 0 ? sportColor : greyColor;
  toyColor = toyCount > 0 ? toyColor : greyColor;
  ornamentalColor = ornamentalCount > 0 ? ornamentalColor : greyColor;
  snowColor = snowCount > 0 ? snowColor : greyColor;
  fireworksColor = fireworksCount > 0 ? fireworksColor : greyColor;
  glazyColor = glazyCount > 0 ? glazyColor : greyColor;
  pecanColor = pecanCount > 0 ? pecanColor : greyColor;
  sbColor = sbCount > 0 ? sbColor : greyColor;
  standardColor = standardCount > 0 ? standardColor : greyColor;
  liscColor = liscCount > 0 ? liscColor : greyColor;
  winterColor = winterCount > 0 ? winterColor : greyColor;

  // Remove existing GWH Map related elements before proceeding
  document.querySelectorAll(".tsitu-gwh-map").forEach(el => el.remove());

  const masterDiv = document.createElement("div");
  masterDiv.className = "tsitu-gwh-map";
  masterDiv.style =
    "display: inline-flex; margin-bottom: 10px; width: 100%; text-align: center; line-height: 1.5; overflow: hidden";
  const spanStyle =
    "; width: auto; padding: 5px; font-weight: bold; font-size: 12.75px; text-shadow: 0px 0px 11px white";

  const sportSpan = document.createElement("span");
  sportSpan.style = "background-color: " + sportColor + spanStyle;
  sportSpan.innerHTML = "Sport<br>" + sportCount;

  const toySpan = document.createElement("span");
  toySpan.style = "background-color: " + toyColor + spanStyle;
  toySpan.innerHTML = "Toy<br>" + toyCount;

  const ornamentalSpan = document.createElement("span");
  ornamentalSpan.style = "background-color: " + ornamentalColor + spanStyle;
  ornamentalSpan.innerHTML = "Orna<br>" + ornamentalCount;

  const snowSpan = document.createElement("span");
  snowSpan.style = "background-color: " + snowColor + spanStyle;
  snowSpan.innerHTML = "Snow<br>" + snowCount;

  const fireworksSpan = document.createElement("span");
  fireworksSpan.style = "background-color: " + fireworksColor + spanStyle;
  fireworksSpan.innerHTML = "Fire<br>" + fireworksCount;

  const glazySpan = document.createElement("span");
  glazySpan.style = "background-color: " + glazyColor + spanStyle;
  glazySpan.innerHTML = "Glazy<br>" + glazyCount;

  const pecanSpan = document.createElement("span");
  pecanSpan.style = "background-color: " + pecanColor + spanStyle;
  pecanSpan.innerHTML = "Pecan<br>" + pecanCount;

  const sbSpan = document.createElement("span");
  sbSpan.style = "background-color: " + sbColor + spanStyle;
  sbSpan.innerHTML = "SB+<br>" + sbCount;

  const standardSpan = document.createElement("span");
  standardSpan.style = "background-color: " + standardColor + spanStyle;
  standardSpan.innerHTML = "Basic<br>" + standardCount;

  const liscSpan = document.createElement("span");
  liscSpan.style = "background-color: " + liscColor + spanStyle;
  liscSpan.innerHTML = "LISC<br>" + liscCount;

  const winterSpan = document.createElement("span");
  winterSpan.style = "background-color: " + winterColor + spanStyle;
  winterSpan.innerHTML = "Winter<br>" + winterCount;

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
  highlightDiv.className = "tsitu-gwh-map";
  highlightDiv.style = "float: right; position: relative; z-index: 1";
  highlightDiv.appendChild(highlightBox);
  highlightDiv.appendChild(highlightLabel);

  // Assemble masterDiv
  masterDiv.appendChild(sportSpan);
  masterDiv.appendChild(toySpan);
  masterDiv.appendChild(ornamentalSpan);
  masterDiv.appendChild(snowSpan);
  masterDiv.appendChild(fireworksSpan);
  masterDiv.appendChild(glazySpan);
  masterDiv.appendChild(pecanSpan);
  masterDiv.appendChild(sbSpan);
  masterDiv.appendChild(standardSpan);
  masterDiv.appendChild(liscSpan);
  masterDiv.appendChild(winterSpan);

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
    if (chestEl) {
      const chestName = chestEl.textContent;
      if (
        chestName &&
        (chestName.indexOf("Nice Treasure Chest") >= 0 ||
          chestName.indexOf("Naughty Treasure Chest") >= 0)
      ) {
        colorize();
      }
    }
  });
  originalOpen.apply(this, arguments);
};

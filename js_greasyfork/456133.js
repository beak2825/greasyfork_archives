// ==UserScript==
// @name         MouseHunt - GWH 2022 Naughty/Nice map colour coder
// @author       in59te
// @namespace    https://greasyfork.org/en/users/739524-in59te
// @version      1.0
// @description  Colour codes mice on Naughty/Nice maps according to type
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/456133/MouseHunt%20-%20GWH%202022%20NaughtyNice%20map%20colour%20coder.user.js
// @updateURL https://update.greasyfork.org/scripts/456133/MouseHunt%20-%20GWH%202022%20NaughtyNice%20map%20colour%20coder.meta.js
// ==/UserScript==

const standardMice = [
	"Candy Cane",
	"Toboggan Technician",
	"Young Prodigy Racer",
	"Nice Knitting",
	"Shorts-All-Year",
  "Scrooge",
  "Mouse of Winter Future",
  "Mouse of Winter Past",
  "Mouse of Winter Present",
  "Gingerbread",
  "Greedy Al",
  "Missile Toe",
  "Snowglobe",
  "Confused Courier",
  "Snowblower",
  "Frigid Foreman",
  "Miser",
  "Hoarder"
];

const bothMice = [
  "Wreath Thief",
  "Snowball Hoarder",
  "Nitro Racer",
  "Double Black Diamond Racer",
  "Rainbow Racer",
  "Free Skiing",
  "Snow Golem Jockey",
  "Great Giftnapper",
  "Ol King Coal",
  "Sporty Ski Instructor",
  "Black Diamond Racer",
  "Snow Boulder",
  "Frightened Flying Fireworks",
  "Elf",
  "Toy Tinkerer",
  "Christmas Tree",
  "Nutcracker",
  "Ornament",
  "Stocking",
  "Destructoy",
  "Mad Elf",
  "Ridiculous Sweater",
  "Present",
  "Snow Golem Architect",
  "Toy",
  "Party Head",
  "Builder",
  "Slay Ride",
  "Squeaker Claws",
  "Snow Sorceress",
  "S.N.O.W. Golem",
  "Tundra Huntress",
  "Great Winter Hunt Impostor",
  "Naughty Nougat",
  "Iceberg Sculptor",
  "Reinbo",
  "Glacia Ice Fist",
  "Borean Commander",
  "Snow Fort",
  "New Year's"
];

const PPMice = [
    "Triple Lutz",
    "Ribbon",
    "Builder"
];

const glazyMice = [
  "Glazy", 
  "Joy",
  "Snowflake"
];

const bossMouse = [
  "Frost King"
]

function colorize() {

  let stdColor = "#fff935"; // yellow
  let stdCount = 0;
  let bothColor = "#fff4ad"; // slightly brighter yellow :pepela:
  let bothCount = 0;
  let ppColor = "#ba6900"; // brown 
  let ppCount = 0;
  let glazyColor = "#f9a645"; // orange
  let glazyCount = 0;
  let bossColor = "#575757"; // dark grey
  let bossCount = 0;
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

    if (standardMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = stdColor;
      if (el.className.indexOf(" complete ") < 0) {
        stdCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (bothMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = bothColor;
      if (el.className.indexOf(" complete ") < 0) {
        bothCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (PPMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = ppColor;
      if (el.className.indexOf(" complete ") < 0) {
        ppCount++;
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
    } else if (bossMouse.indexOf(mouseName) > -1) {
      el.style.backgroundColor = bossColor;
      if (el.className.indexOf(" complete ") < 0) {
        bossCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    }
  });

  stdColor = stdCount > 0 ? stdColor : greyColor;
  bothColor = bothCount > 0 ? bothColor : greyColor;
  ppColor = ppCount > 0 ? ppColor : greyColor;
  glazyColor = glazyCount > 0 ? glazyColor : greyColor;
  bossColor = bossCount > 0 ? bossColor : greyColor;

  // Remove existing GWH Map related elements before proceeding
  document.querySelectorAll(".tsitu-gwh-map").forEach(el => el.remove());

  const masterDiv = document.createElement("div");
  masterDiv.className = "tsitu-gwh-map";
  masterDiv.style =
    "display: inline-flex; margin-bottom: 10px; width: 100%; text-align: center; line-height: 1.5; overflow: hidden";
  const spanStyle =
    "; width: auto; padding: 5px; font-weight: bold; font-size: 12.75px; text-shadow: 0px 0px 11px white";

  const stdSpan = document.createElement("span");
  stdSpan.classList.add("stdSpan");
  stdSpan.style = "background-color: " + stdColor + spanStyle;
  stdSpan.innerHTML = "Std<br>" + stdCount;

  const bothSpan = document.createElement("span");
  bothSpan.classList.add("bothSpan");
  bothSpan.style = "background-color: " + bothColor + spanStyle;
  bothSpan.innerHTML = "GPP/PP<br>" + bothCount;

  const ppSpan = document.createElement("span");
  ppSpan.classList.add("ppSpan");
  ppSpan.style = "background-color: " + ppColor + spanStyle;
  ppSpan.innerHTML = "PP<br>" + ppCount;

  const glazySpan = document.createElement("span");
  glazySpan.classList.add("glazySpan");
  glazySpan.style = "background-color: " + glazyColor + spanStyle;
  glazySpan.innerHTML = "GPP<br>" + glazyCount;

  const bossSpan = document.createElement("span");
  bossSpan.classList.add("bossSpan");
  bossSpan.style = "background-color: " + bossColor + spanStyle;
  bossSpan.innerHTML = "Boss<br>" + bossCount;

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
  masterDiv.appendChild(stdSpan);
  masterDiv.appendChild(bothSpan);
  masterDiv.appendChild(ppSpan);
  masterDiv.appendChild(glazySpan);
  masterDiv.appendChild(bossSpan);

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

    if (chestEl) {
      const chestName = chestEl.textContent;
      if (
        chestName &&
        ((chestName.indexOf("Naughty") >= 0) ||
        (chestName.indexOf("Nice") >= 0))
      ) {
        colorize();
      }
    }
  });
  originalOpen.apply(this, arguments);
};
// ==UserScript==
// @name         MouseHunt - GWH 2021 Naughty/Nice map colour coder
// @author       in59te
// @namespace    https://greasyfork.org/en/users/739524-in59te
// @version      1.2
// @description  Color codes mice on Naughty/Nice maps according to type
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/436714/MouseHunt%20-%20GWH%202021%20NaughtyNice%20map%20colour%20coder.user.js
// @updateURL https://update.greasyfork.org/scripts/436714/MouseHunt%20-%20GWH%202021%20NaughtyNice%20map%20colour%20coder.meta.js
// ==/UserScript==

const standardMice = [
	"Confused Courier",
	"Gingerbread",
	"Hoarder",
	"Present",
	"Triple Lutz",
	"Miser",
	"Greedy Al"
];

const sbMice = [
    "Mouse of Winter Future",
	"Mouse of Winter Past",
	"Mouse of Winter Present",
	"Scrooge"
];

const PPMice = [
    "Borean Commander",
    "Builder",
    "Frigid Foreman",
    "Glacia Ice Fist",
    "Iceberg Sculptor",
    "Nice Knitting",
    "Ridiculous Sweater",
    "Snow Golem Jockey",
    "Snow Scavenger",
    "Great Giftnapper",
    "Great Winter Hunt Impostor",
    "Shorts-All-Year",
    "Stuck Snowball",
    "Naughty Nougat"
];

const winterMice = [
  "Snowflake"
];

const liscMice = [
  "Snow Golem Architect"
];

const glazyMice = [
  "Glazy", 
  "Joy"
];

const winterSportsMice = [
  "Sporty Ski Instructor",
  "Young Prodigy Racer",
  "Toboggan Technician",
  "Free Skiing",
  "Nitro Racer",
  "Rainbow Racer",
  "Double Black Diamond Racer",
  "Black Diamond Racer"
];

const toysMice = [
  "Nutcracker",
  "Toy",
  "Slay Ride",
  "Squeaker Claws",
  "Destructoy",
  "Toy Tinkerer",
  "Mad Elf",
  "Elf"
];

const ornamentsMice = [
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

const bossMouse = [
  "Ol' King Coal"
]

function colorize() {

  let stdColor = "#fff935"; // yellow
  let stdCount = 0;
  let sbColor = "#fff4ad"; // slightly brighter yellow :pepela:
  let sbCount = 0;
  let ppColor = "#ba6900"; // brown 
  let ppCount = 0;
  let winterColor = "#dedede"; // light grey
  let winterCount = 0;
  let liscColor = "#5d9fce"; // blue
  let liscCount = 0;
  let glazyColor = "#f9a645"; // orange
  let glazyCount = 0;
  let winterSportsColor = "#9370db"; // purple
  let winterSportsCount = 0;
  let toysColor = "#e74f4e"; // red
  let toysCount = 0;
  let ornamentsColor = "#32cd32"; // green
  let ornamentsCount = 0;
  let snowColor = "#a5dce6"; // light blue
  let snowCount = 0;
  let fireworksColor = "#ee82ee"; // pink
  let fireworksCount = 0;
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
    } else if (sbMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = sbColor;
      if (el.className.indexOf(" complete ") < 0) {
        sbCount++;
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
    } else if (winterMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = winterColor;
      if (el.className.indexOf(" complete ") < 0) {
        winterCount++;
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
    } else if (glazyMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = glazyColor;
      if (el.className.indexOf(" complete ") < 0) {
        glazyCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (winterSportsMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = winterSportsColor;
      if (el.className.indexOf(" complete ") < 0) {
        winterSportsCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (toysMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = toysColor;
      if (el.className.indexOf(" complete ") < 0) {
        toysCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (ornamentsMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = ornamentsColor;
      if (el.className.indexOf(" complete ") < 0) {
        ornamentsCount++;
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
  sbColor = sbCount > 0 ? sbColor : greyColor;
  ppColor = ppCount > 0 ? ppColor : greyColor;
  winterColor = winterCount > 0 ? winterColor : greyColor;
  liscColor = liscCount > 0 ? liscColor : greyColor;
  glazyColor = glazyCount > 0 ? glazyColor : greyColor;
  winterSportsColor = winterSportsCount > 0 ? winterSportsColor : greyColor;
  toysColor = toysCount > 0 ? toysColor : greyColor;
  ornamentsColor = ornamentsCount > 0 ? ornamentsColor : greyColor;
  snowColor = snowCount > 0 ? snowColor : greyColor;
  fireworksColor = fireworksCount > 0 ? fireworksColor : greyColor;
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

  const sbSpan = document.createElement("span");
  sbSpan.classList.add("sbSpan");
  sbSpan.style = "background-color: " + sbColor + spanStyle;
  sbSpan.innerHTML = "SB<br>" + sbCount;

  const ppSpan = document.createElement("span");
  ppSpan.classList.add("ppSpan");
  ppSpan.style = "background-color: " + ppColor + spanStyle;
  ppSpan.innerHTML = "PP<br>" + ppCount;

  const winterSpan = document.createElement("span");
  winterSpan.classList.add("winterSpan");
  winterSpan.style = "background-color: " + winterColor + spanStyle;
  winterSpan.innerHTML = "Wint<br>" + winterCount;

  const liscSpan = document.createElement("span");
  liscSpan.classList.add("liscSpan");
  liscSpan.style = "background-color: " + liscColor + spanStyle;
  liscSpan.innerHTML = "LISC<br>" + liscCount;

  const glazySpan = document.createElement("span");
  glazySpan.classList.add("glazySpan");
  glazySpan.style = "background-color: " + glazyColor + spanStyle;
  glazySpan.innerHTML = "GPP<br>" + glazyCount;

  const winterSportsSpan = document.createElement("span");
  winterSportsSpan.classList.add("winterSportsSpan");
  winterSportsSpan.style = "background-color: " + winterSportsColor + spanStyle;
  winterSportsSpan.innerHTML = "Sport<br>" + winterSportsCount;

  const toysSpan = document.createElement("span");
  toysSpan.classList.add("toysSpan");
  toysSpan.style = "background-color: " + toysColor + spanStyle;
  toysSpan.innerHTML = "Toy<br>" + toysCount;

  const ornamentsSpan = document.createElement("span");
  ornamentsSpan.classList.add("ornamentsSpan");
  ornamentsSpan.style = "background-color: " + ornamentsColor + spanStyle;
  ornamentsSpan.innerHTML = "Orna<br>" + ornamentsCount;

  const snowSpan = document.createElement("span");
  snowSpan.classList.add("snowSpan");
  snowSpan.style = "background-color: " + snowColor + spanStyle;
  snowSpan.innerHTML = "Snow<br>" + snowCount;

  const fireworksSpan = document.createElement("span");
  fireworksSpan.classList.add("fireworksSpan");
  fireworksSpan.style = "background-color: " + fireworksColor + spanStyle;
  fireworksSpan.innerHTML = "Fire<br>" + fireworksCount;

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
  masterDiv.appendChild(sbSpan);
  masterDiv.appendChild(ppSpan);
  masterDiv.appendChild(winterSpan);
  masterDiv.appendChild(liscSpan);
  masterDiv.appendChild(glazySpan);
  masterDiv.appendChild(winterSportsSpan);
  masterDiv.appendChild(toysSpan);
  masterDiv.appendChild(ornamentsSpan);
  masterDiv.appendChild(snowSpan);
  masterDiv.appendChild(fireworksSpan);
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

// ==UserScript==
// @name         MouseHunt - Hween 2021 Trick/Treat map colour coder
// @author       in59te & Warden Slayer
// @namespace    https://greasyfork.org/en/users/739524-in59te
// @version      1.5
// @description  Color codes mice on trick/treat maps according to type
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/433865/MouseHunt%20-%20Hween%202021%20TrickTreat%20map%20colour%20coder.user.js
// @updateURL https://update.greasyfork.org/scripts/433865/MouseHunt%20-%20Hween%202021%20TrickTreat%20map%20colour%20coder.meta.js
// ==/UserScript==

const standardMice = [
    "Grey Recluse",
    "Cobweb",
    "Teenage Vampire",
    "Zombot Unipire",
    "Candy Cat",
    "Candy Goblin",
    "Shortcut",
    "Tricky Witch",
    "Sugar Rush"
];
const jackoMice = [
    "Spirit Light",
    "Gourdborg",
    "Pumpkin Hoarder",
    "Trick",
    "Treat",
    "Wild Chainsaw",
    "Maize Harvester"
];
const boneMice = [
    "Creepy Marionette",
    "Dire Lycan",
    "Grave Robber",
    "Hollowhead",
    "Mousataur Priestess",
    "Sandmouse",
    "Titanic Brain-Taker",
    "Tomb Exhumer"
];
const pgMice = [
    "Admiral Arrrgh",
    "Captain Cannonball",
    "Ghost Pirate Queen",
    "Gourd Ghoul",
    "Scorned Pirate",
    "Spectral Butler",
    "Spectral Swashbuckler"
];
const screamMice = [
    "Baba Gaga",
    "Bonbon Gummy Globlin",
    "Hollowed",
    "Hollowed Minion",
    "Swamp Thang"
];

const hunterColor = ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"];
var numHunters = 0;
function hunterColorize() {
    document.querySelectorAll(".treasureMapRootView-subTab:not(.active)")[0].click(); //swap between Goals and Hunters
    let hunters = document.querySelectorAll(".treasureMapView-componentContainer");
    const list_of_cheese = [];
    for (let i = 0; i < hunters.length; i++) {
      list_of_cheese.push(hunters[i].children[2].title);
    }
    //console.log(list_of_cheese);
    numHunters = hunters.length;
    document.querySelectorAll(".treasureMapRootView-subTab:not(.active)")[0].click();
  
    for (let i = 0; i < numHunters; i++) {
        if (list_of_cheese[i] == "Monterey Jack-O-Lantern") {
            hunterColor[i] = "#f9a645";
        }
        else if (list_of_cheese[i] == "Bonefort Cheese") {
            hunterColor[i] = "#bfbfbf";
        }
        else if (list_of_cheese[i] == "Polter-Geitost") {
            hunterColor[i] = "#5d9fce";
        }
        else if (list_of_cheese[i] == "Scream Cheese") {
            hunterColor[i] = "#5ae031";
        }
        else {
            hunterColor[i] = "#fff935";
        }
    }
    //console.log(hunterColor);
}

function colorize() {

  let stdColor = "#fff935"; // yellow
  let stdCount = 0;
  let boneColor = "#bfbfbf"; // white
  let boneCount = 0;
  let screamColor = "#5ae031"; // green
  let screamCount = 0;
  let pgColor = "#5d9fce"; // blue
  let pgCount = 0;
  let jackoColor = "#f9a645"; // orange
  let jackoCount = 0;
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
    } else if (jackoMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = jackoColor;
      if (el.className.indexOf(" complete ") < 0) {
        jackoCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (boneMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = boneColor;
      if (el.className.indexOf(" complete ") < 0) {
        boneCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (screamMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = screamColor;
      if (el.className.indexOf(" complete ") < 0) {
        screamCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (pgMice.indexOf(mouseName) > -1) {
      el.style.backgroundColor = pgColor;
      if (el.className.indexOf(" complete ") < 0) {
        pgCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    }
  });

  stdColor = stdCount > 0 ? stdColor : greyColor;
  jackoColor = jackoCount > 0 ? jackoColor : greyColor;
  boneColor = boneCount > 0 ? boneColor : greyColor;
  pgColor = pgCount > 0 ? pgColor : greyColor;
  screamColor = screamCount > 0 ? screamColor : greyColor;

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

  const jackoSpan = document.createElement("span");
  jackoSpan.classList.add("jackoSpan");
  jackoSpan.style = "background-color: " + jackoColor + spanStyle;
  jackoSpan.innerHTML = "Jack<br>" + jackoCount;

  const boneSpan = document.createElement("span");
  boneSpan.classList.add("boneSpan");
  boneSpan.style = "background-color: " + boneColor + spanStyle;
  boneSpan.innerHTML = "Bone<br>" + boneCount;

  const pgSpan = document.createElement("span");
  pgSpan.classList.add("pgSpan");
  pgSpan.style = "background-color: " + pgColor + spanStyle;
  pgSpan.innerHTML = "PG<br>" + pgCount;

  const screamSpan = document.createElement("span");
  screamSpan.classList.add("screamSpan");
  screamSpan.style = "background-color: " + screamColor + spanStyle;
  screamSpan.innerHTML = "Scream<br>" + screamCount;

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
    hunterColorize();
    colorize();
  });

  const highlightDiv = document.createElement("div");
  highlightDiv.className = "tsitu-gwh-map";
  highlightDiv.style = "float: right; position: relative; z-index: 1";
  highlightDiv.appendChild(highlightBox);
  highlightDiv.appendChild(highlightLabel);

  // Assemble masterDiv
  masterDiv.appendChild(stdSpan);
  masterDiv.appendChild(jackoSpan);
  masterDiv.appendChild(boneSpan);
  masterDiv.appendChild(pgSpan);
  masterDiv.appendChild(screamSpan);

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

  var canvas = [];
  var div = document.getElementsByClassName("treasureMapView-hunter-wrapper mousehuntTooltipParent");

  for (var i=0; i<div.length; i++){
    canvas[i] = document.createElement('canvas');
    canvas[i].id = "hunter-canvas";
    canvas[i].style = "; bottom: 0px; left: 0px; position: absolute; width: 15px; height: 15px; background: " + hunterColor[i] + "; border: 1px solid black";
    div[i].appendChild(canvas[i]);
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
        ((chestName.indexOf("Halloween") >= 0) ||
        (chestName.indexOf("Undead") >= 0))
      ) {
        hunterColorize();
        colorize();
      }
    }
  });
  originalOpen.apply(this, arguments);
};

//Warden added this (waves)
$(document).on('click', '.stdSpan', function() {
  hg.utils.TrapControl.setBait(114).go();
});
$(document).on('click', '.jackoSpan', function() {
  hg.utils.TrapControl.setBait(3305).go();
});
$(document).on('click', '.boneSpan', function() {
  hg.utils.TrapControl.setBait(3306).go();
});
$(document).on('click', '.pgSpan', function() {
  hg.utils.TrapControl.setBait(3307).go();
});
$(document).on('click', '.screamSpan', function() {
  hg.utils.TrapControl.setBait(3308).go();
});

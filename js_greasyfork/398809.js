// ==UserScript==
// @name         MouseHunt - QG Color Coder 2020 with mapping features
// @author       Vinnie, Blende & Tran Situ (tsitu), Limerence
// @version      1.0.6
// @description  Color codes mice on qg maps according to decorations & cheese. Plagiarism is good. 
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @namespace    https://greasyfork.org/en/scripts/397287-mousehunt-birthday-map-color-coder-2020
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @grant    GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/398809/MouseHunt%20-%20QG%20Color%20Coder%202020%20with%20mapping%20features.user.js
// @updateURL https://update.greasyfork.org/scripts/398809/MouseHunt%20-%20QG%20Color%20Coder%202020%20with%20mapping%20features.meta.js
// ==/UserScript==

const Bland = [
    "Chip Chiseler",
    "Tiny Toppler",
    "Spice Seer",
    "Old Spice Collector",
    "Fuzzy Drake",
];

const Mild = [
    "Spice Farmer",
    "Granny Spice",
    "Ore Chipper",
    "Rubble Rummager",
    "Cork Defender",
    "Steam Sailor",
];

const Medium = [
    "Spice Finder",
    "Spice Sovereign",
    "Nachore Golem",
    "Rubble Rouser",
    "Warming Wyvern",
    "Burly Bruiser",
];

const Hot = [
  "Grampa Golem",
  "Fiery Crusher",
  "Spice Reaper",
  "Spice Raider",
    "Vaporior",
    "Horned Cork Hoarder",

];

const Flaming = [
    "Inferna, The Engulfed",
    "Nachous, The Molten",
    "Rambunctious Rain Rumbler",
    "Pyrehyde",
    "Rambunctious Rain Rumbler"
];

const Wildfire = [
    "Corkataur",
    "Queen Quesada",
    "Emberstone Scaled"
];

const QR = [
    "Croquet Crusher",
    "Pump Raider",
    "Tiny Saboteur",
    "Sleepy Merchant",
];

const Croquet = [
    "Croquet Crusher",
    ]
// const standardMice = [
//     "Birthday",
//     "Buckethead",
//     "Present",
//     "Pintail",
//     "Dinosuit",
//     "Sleepwalker",
//     "Terrible Twos"
// ];

const CQ = [
    "Chip Chiseler",
    "Tiny Toppler",
    "Ore Chipper",
    "Rubble Rummager",
    "Nachore Golem",
    "Rubble Rouser",
    "Grampa Golem",
    "Fiery Crusher",
    ]

const PP = [
    "Spice Seer",
	"Old Spice Collector",
	"Spice Farmer",
	"Granny Spice",
	"Spice Finder",
	"Spice Sovereign",
	"Spice Reaper",
	"Spice Raider",
    ]

const CC = [
    "Fuzzy Drake",
    "Cork Defender",
    "Burly Bruiser",
    "Horned Cork Hoarder",
    "Rambunctious Rain Rumbler",
    ]
const pressure = [
    "Steam Sailor",
    "Warming Wyvern",
    "Vaporior",
    "Pyrehyde",
    ]
const qgMaps = [
  "Queso Canyon Grand Tour Treasure Map",
  "Rare Queso Canyon Grand Tour Treasure Map",
];

function generate(){
    console.log("generating");
    let output = "LF Sniper";
    let croquet_present = false;
    let QR_count = 0;
    let qr_per_mouse = 0;
    let pp_count = 0;
    let pp_per_mouse = 8;
    let cq_count = 0;
    let cq_per_mouse = 10;
    let cc_count = 0;
    let cc_per_mouse = 10;
    let has_corky = false;
    let has_corkataur = false;
    let pressure_count = 0;
    let pressure_per_mouse = 15;
    let has_ember = false;
    let has_small = false;
    let has_medium = false;
    let has_large = false;
    let has_epic = false;
    let has_brut = false;
  document.querySelectorAll(".treasureMapView-goals-group-goal").forEach(el => {
    el.querySelector("span").style = "color: black; font-size: 11px;";

    const mouseName = el.querySelector(".treasureMapView-goals-group-goal-name").textContent;
      if (QR.indexOf(mouseName) > -1) {
          if (el.className.indexOf(" complete ") < 0) {
              QR_count += 1;
          }
      }

      if (Croquet.indexOf(mouseName) > -1) {
          if (el.className.indexOf(" complete ") < 0) {
              croquet_present = true;
              console.log("croquet present");
          }
      }
      if (PP.indexOf(mouseName) > -1) {
          if (el.className.indexOf(" complete ") < 0) {
              pp_count += 1;
          }
      }
      if (CQ.indexOf(mouseName) > -1) {
          if (el.className.indexOf(" complete ") < 0) {
              cq_count += 1;
          }
      }
      if (CC.indexOf(mouseName) > -1) {
          if (el.className.indexOf(" complete ") < 0) {
              cc_count += 1;
          }
      }
      if (pressure.indexOf(mouseName) > -1) {
          if (el.className.indexOf(" complete ") < 0) {
              pressure_count += 1;
          }
      }
      if (mouseName == "Emberstone Scaled"){
          if (el.className.indexOf(" complete ") < 0) has_ember = true;
      }
      if (mouseName == "Corkataur") {
          if (el.className.indexOf(" complete ") < 0) has_corkataur = true;
      }
      if (mouseName == "Corky, the Collector") {
          if (el.className.indexOf(" complete ") < 0) has_corky = true;
      }
      if (mouseName == "Sizzle Pup"){
          if (el.className.indexOf(" complete ") < 0) has_small = true;
  }
      if (mouseName == "Bearded Elder"){
          if (el.className.indexOf(" complete ") < 0) has_medium = true;
      }
      if (mouseName == "Cinderstorm"){
          if (el.className.indexOf(" complete ") < 0) has_large = true;
      }
      if (mouseName == "Bruticus, the Blazing"){
          if (el.className.indexOf(" complete ") < 0) has_brut = true;
      }
      if (mouseName == "Kalor'ignis of the Geyser"){
          if (el.className.indexOf(" complete ") < 0) has_epic = true;
      }
  });
    if (QR_count) output += "\nQR";
    if (croquet_present) output += " and Croquet";
   // if (QR_count) output += QR_count * qr_per_mouse;
    if (pp_count) {
        //output += ("\nPP");
    }
    if (cq_count) {
        output += ("\nCQ");
    }
    if (cc_count) {
        output += ("\nCork Collectors");
    }
    if (has_corkataur) output += " Corkataur";
    if (has_corky) output += " Corky";
    if (pressure_count) {
        output += ("\nPressure");
    }
    if (has_ember) output += " Ember";
    if (has_small) output += "\nSmall";
    if (has_medium) output += "\nMedium";
    if (has_large) output += "\nCinder";
    if (has_brut) output += "Brut";
    if (has_epic) output += "\nKSS";
   // if (pp_count) output.append("\n PP");
    GM_setClipboard(output);
    alert("copied to clipboard");
}

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

    if (Bland.indexOf(mouseName) > -1) {
      el.style.backgroundColor = mixingColor;
      if (el.className.indexOf(" complete ") < 0) {
        mixingCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (Mild.indexOf(mouseName) > -1) {
      el.style.backgroundColor = breakColor;
      if (el.className.indexOf(" complete ") < 0) {
        breakCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (Medium.indexOf(mouseName) > -1) {
      el.style.backgroundColor = pumpColor;
      if (el.className.indexOf(" complete ") < 0) {
        pumpCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (Hot.indexOf(mouseName) > -1) {
      el.style.backgroundColor = qaColor;
      if (el.className.indexOf(" complete ") < 0) {
        qaCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (Flaming.indexOf(mouseName) > -1) {
      el.style.backgroundColor = bossColor;
      if (el.className.indexOf(" complete ") < 0) {
        bossCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (Wildfire.indexOf(mouseName) > -1) {
      el.style.backgroundColor = sbColor;
      if (el.className.indexOf(" complete ") < 0) {
        sbCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (QR.indexOf(mouseName) > -1) {
      el.style.backgroundColor = factoryColor;
      if (el.className.indexOf(" complete ") < 0) {
        factoryCount++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } //       else if (standardMice.indexOf(mouseName) > -1) {
//       el.style.backgroundColor = standardColor;
//       if (el.className.indexOf(" complete ") < 0) {
//         standardCount++;
//       } else {
//         if (isChecked) el.style.backgroundColor = "white";
      //}
    //}
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
  mixingSpan.innerHTML = "Bland<br>" + mixingCount;

  const breakSpan = document.createElement("span");
  breakSpan.style = "background-color: " + breakColor + spanStyle;
  breakSpan.innerHTML = "Mild<br>" + breakCount;

  const pumpSpan = document.createElement("span");
  pumpSpan.style = "background-color: " + pumpColor + spanStyle;
  pumpSpan.innerHTML = "Medium<br>" + pumpCount;

  const qaSpan = document.createElement("span");
  qaSpan.style = "background-color: " + qaColor + spanStyle;
  qaSpan.innerHTML = "Hot<br>" + qaCount;

  const vinnieSpan = document.createElement("span");
  vinnieSpan.style = "background-color: " + bossColor + spanStyle;
  vinnieSpan.innerHTML = "Flaming<br>" + bossCount;

  const newButtonSpan = document.createElement("button");
    newButtonSpan.style = "background-color: " + standardColor + spanStyle;
    newButtonSpan.style.cursor = "pointer";
    newButtonSpan.style.fontSize = "9px";
    newButtonSpan.style.padding = "2px";
    newButtonSpan.style.margin = "0px 5px 5px 10px";
    newButtonSpan.style.textShadow = "none";
    newButtonSpan.style.display = "inline-block";
    newButtonSpan.innerHTML = "generate<br>";
    newButtonSpan.addEventListener("click", function() {
        generate();
      })


//   const sbSpan = document.createElement("span");
//   sbSpan.style = "background-color: " + sbColor + spanStyle;
//   sbSpan.innerHTML = "Wildfire<br>" + sbCount;

//   const factorySpan = document.createElement("span");
//   factorySpan.style = "background-color: " + factoryColor + spanStyle;
//   factorySpan.innerHTML = "Factory Charm<br>" + factoryCount;

//   const standardSpan = document.createElement("span");
//   standardSpan.style = "background-color: " + standardColor + spanStyle;
//   standardSpan.innerHTML = "Standard<br>" + standardCount;

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
    masterDiv.appendChild(newButtonSpan);

//   masterDiv.appendChild(sbSpan);
//   masterDiv.appendChild(factorySpan);
//   masterDiv.appendChild(standardSpan);

  // Inject into DOM
  const insertEl = document.querySelector(
    ".treasureMapView-leftBlock .treasureMapView-block-content"
  );
  if (
    insertEl &&
    document.querySelector(
      ".treasureMapManagerView-header-navigation-item.tasks.active"
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
  this.addEventListener("load", function() {
    const mapEl = document.querySelector(
      ".treasureMapManagerView-task.active .treasureMapManagerView-task-name"
    );
    if (mapEl) {
      const mapName = mapEl.textContent;
      if (mapName && qgMaps.indexOf(mapName) > -1) {
        colorize();
      }
    }
  });
  originalOpen.apply(this, arguments);
};

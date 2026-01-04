// ==UserScript==
// @name         MouseHunt - Slayer Colour Coder + Snipe Price Calculator 2021
// @author       Chromatical
// @version      1.1.6
// @description  Color codes slayer mice + calculates snipe prices
// @match        https://www.mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/*
// @namespace    http://tampermonkey.net/
// @include	 http://apps.facebook.com/mousehunt/*
// @include	 https://apps.facebook.com/mousehunt/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423383/MouseHunt%20-%20Slayer%20Colour%20Coder%20%2B%20Snipe%20Price%20Calculator%202021.user.js
// @updateURL https://update.greasyfork.org/scripts/423383/MouseHunt%20-%20Slayer%20Colour%20Coder%20%2B%20Snipe%20Price%20Calculator%202021.meta.js
// ==/UserScript==

const rmdPrice = 275;

const mouseList =[ //-----------------change snipe price here---------------------
    {name:"Adominable Snow", price: 5},
    {name:"Absolute Acolyte", price: 15},
    {name:"Acolyte", price: 65},
    {name:"Aged", price: 5},
    {name:"Ancient of the Deep", price: 60},
    {name:"Ascended Elder", price: 15},
    {name:"Assassin", price: 120},
    {name:"Balack the Banished", price: 100},
    {name:"Big Bad Behemoth Burroughs", price: 30},
    {name:"Big Bad Burroughs", price: 80},
    {name:"Black Widow", price: 200},
    {name:"Blacksmith", price: 15},
    {name:"Bruticus, the Blazing", price: 20},
    {name:"Bulwark of Ascent", price: 15},
    {name:"Captain Croissant", price: 5},
    {name:"Carmine the Apothecary", price: 10},
    {name:"Centaur Ranger", price: 30},
    {name:"Chess Master", price: 20},
    {name:"Chitinous", price: 5},
    {name:"Chrono", price: 200},
    {name:"Corkataur", price: 25},
    {name:"Crystal Behemoth", price: 30},
    {name:"Cursed Librarian", price: 10},
    {name:"Cyclops Barbarian", price: 30},
    {name:"Dark Magi", price: 330},
    {name:"Dawn Guardian", price: 10},
    {name:"Deep", price: 500},
    {name:"Derr Chieftain", price: 10},
    {name:"Diamondhide", price: 400},
    {name:"Dojo Sensei", price: 10},
    {name:"Draconic Warden", price: 20},
    {name:"Dragon", price: 10},
    {name:"Elder", price: 5},
    {name:"Elub Chieftain", price: 10},
    {name:"Emberstone Scaled", price: 25},
    {name:"Extreme Everysports", price: 5},
    {name:"Fetid Swamp", price:5},
    {name:"Ful'Mina, The Mountain Queen", price: 5},
    {name:"Gargantuamouse", price: 25},
    {name:"Goliath Field", price: 10},
    {name:"Grand Master of the Dojo", price: 5},
    {name:"Grandfather", price: 10},
    {name:"Huntereater", price: 60},
    {name:"Icewing", price: 200},
    {name:"Inferna, The Engulfed", price: 5},
    {name:"Jurassic", price: 5},
    {name:"Kalor'ignis of the Geyser", price: 5},
    {name:"King Grub", price: 60},
    {name:"King Scarab", price: 350},
    {name:"Leviathan", price: 50},
    {name:"Lycan", price: 10},
    {name:"M400", price: 300},
    {name:"Mage Weaver", price: 15},
    {name:"Magma Carrier", price: 10},
    {name:"Manaforge Smith", price: 370},
    {name:"Master of the Dojo", price: 20},
    {name:"Menace of the Rift", price: 20},
    {name:"Mole", price: 30},
    {name:"Monster", price: 10},
    {name:"Monster of the Meteor", price: 10},
    {name:"Monstrous Abomination", price: 20},
    {name:"Monstrous Black Widow", price: 10},
    {name:"Mousevina Von Vermin", price: 5},
    {name:"Mystic King", price: 200},
    {name:"Nachous, The Molten", price: 5},
    {name:"Nerg Chieftain", price: 10},
    {name:"Paladin Weapon Master", price: 370},
    {name:"Paragon of Arcane", price: 280},
    {name:"Paragon of Dragons", price: 280},
    {name:"Paragon of Forgotten", price: 280},
    {name:"Paragon of Shadow", price: 280},
    {name:"Paragon of Strength", price: 280},
    {name:"Paragon of Tactics", price: 280},
    {name:"Paragon of the Lawless", price: 280},
    {name:"Paragon of Water", price: 280},
    {name:"Primal", price: 5},
    {name:"Pyrehyde", price: 10},
    {name:"Queen Quesada", price: 10},
    {name:"Retired Minotaur", price: 330},
    {name:"Shade of the Eclipse", price: 20},
    {name:"Shattered Carmine", price: 330},
    {name:"Silth", price: 65},
    {name:"Soul Binder", price: 375},
    {name:"Squeaken", price: 50},
    {name:"Stonework Warrior", price: 5},
    {name:"Stormsurge, the Vile Tempest", price: 15},
    {name:"Supreme Sensei", price: 10},
    {name:"Technic King", price: 200},
    {name:"The Total Eclipse", price: 20},
    {name:"Theurgy Warden", price: 10},
    {name:"Tri-dra", price: 30},
    {name:"Tritus", price: 80},
    {name:"Twisted Carmine", price: 10},
    {name:"Warmonger", price: 350},
    {name:"Whelpling", price: 10},
    {name:"Zurreal the Eternal", price: 200},
    {name:"The Menace", price: 50},
    {name:"Molten Midas", price: 20},
    {name:"Eclipse", price: 5}
]

var mice500_list = [];
var mice400_list = [];
var mice300_list = [];
var mice200_list = [];
var mice100_list = [];
var mice0_list = [];

     //Creates List
    for (var i = 0; i < mouseList.length; i++){
        if (mouseList[i].price >= 500) {mice500_list.push(mouseList[i].name);}
        else if (mouseList[i].price >= 400) {mice400_list.push(mouseList[i].name);}
        else if (mouseList[i].price >= 300) {mice300_list.push(mouseList[i].name);}
        else if (mouseList[i].price >= 200) {mice200_list.push(mouseList[i].name);}
        else if (mouseList[i].price >= 100) {mice100_list.push(mouseList[i].name);}
        else {mice0_list.push(mouseList[i].name);}
    }


const slayerMaps = [
    {name: "Easy Slayer Treasure Chest", leech: 250},
    {name: "Rare Easy Slayer Treasure Chest",leech: 250},
    {name: "Medium Slayer Treasure Chest", leech: 380},
    {name: "Rare Medium Slayer Treasure Chest", leech: 380},
    {name: "Hard Slayer Treasure Chest", leech: 530},
    {name: "Rare Hard Slayer Treasure Chest", leech:530},
    {name: "Elaborate Slayer Treasure Chest", leech: 780},
    {name: "Rare Elaborate Slayer Treasure Chest", leech: 780},
    {name: "Arduous Slayer Treasure Chest", leech: 1275},
    {name: "Rare Arduous Slayer Treasure Chest", leech: 1275},
    {name: "Elite Slayer Treasure Chest", leech: 1775},
    {name: "Rare Elite Slayer Tresure Chest", leech: 1775}
];

function colorize() {
  let mice500Color = "#c97c49"; // brown-ish
  let mice500Count = 0;
  let mice400Color = "#f06a60"; // red
  let mice400Count = 0;
  let mice300Color = "#5ae031"; // green
  let mice300Count = 0;
  let mice200Color = "#4fcaf0"; // blue
  let mice200Count = 0;
  let mice100Color = "#cd87ff"; // light purple
  let mice100Count = 0;
  let mice0Color = "#66ffff"; // teal-ish
  let mice0Count = 0;
  const greyColor = "#949494";
  const whiteColor = "#FFFFFF";

  const isChecked =
    localStorage.getItem("highlightPref") === "uncaught-only" ? true : false;
  const isCheckedStr = isChecked ? "checked" : "";

  if (
    document.querySelectorAll(".treasureMapView-goals-group-goal").length === 0
  ) {
    return;
  }

  var snipe_price = 0;

  document.querySelectorAll(".treasureMapView-goals-group-goal").forEach(el => {
    el.querySelector("span").style = "color: black; font-size: 11px;";

    const mouseName = el.querySelector(".treasureMapView-goals-group-goal-name")
      .textContent;

    if (mice500_list.indexOf(mouseName) > -1) {
      el.style.backgroundColor = mice500Color;
      if (el.className.indexOf(" complete ") < 0) {
        mice500Count++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (mice400_list.indexOf(mouseName) > -1) {
      el.style.backgroundColor = mice400Color;
      if (el.className.indexOf(" complete ") < 0) {
        mice400Count++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (mice300_list.indexOf(mouseName) > -1) {
      el.style.backgroundColor = mice300Color;
      if (el.className.indexOf(" complete ") < 0) {
        mice300Count++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (mice200_list.indexOf(mouseName) > -1) {
      el.style.backgroundColor = mice200Color;
      if (el.className.indexOf(" complete ") < 0) {
        mice200Count++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    } else if (mice100_list.indexOf(mouseName) > -1) {
      el.style.backgroundColor = mice100Color;
      if (el.className.indexOf(" complete ") < 0) {
        mice100Count++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
     } else if (mice0_list.indexOf(mouseName) > -1) {
      el.style.backgroundColor = mice0Color;
      if (el.className.indexOf(" complete ") < 0) {
        mice0Count++;
      } else {
        if (isChecked) el.style.backgroundColor = "white";
      }
    }
      var mouseNamePrice = mouseList.filter(function(x){
          return x.name == mouseName;
      })
       snipe_price = snipe_price + mouseNamePrice[0].price
      ;
  });

  const currentMap = document.querySelectorAll(".treasureMapView-mapMenu-rewardName")[0].innerText //Declares map type
  var map_Type_Price = slayerMaps.filter(function(y){
          return y.name == currentMap;
      })
  var own_Chest_Price = snipe_price + rmdPrice - (map_Type_Price[0].leech * 4)
  console.log(snipe_price);
  console.log(own_Chest_Price);

  mice500Color = mice500Count > 0 ? mice500Color : greyColor;
  mice400Color = mice400Count > 0 ? mice400Color : greyColor;
  mice300Color = mice300Count > 0 ? mice300Color : greyColor;
  mice200Color = mice200Count > 0 ? mice200Color : greyColor;
  mice100Color = mice100Count > 0 ? mice100Color : greyColor;
  mice0Color = mice0Count > 0 ? mice0Color : greyColor;

  // Remove existing birthday Map related elements before proceeding
  document.querySelectorAll(".tsitu-birthday-map").forEach(el => el.remove());

  const masterDiv = document.createElement("div");
  masterDiv.className = "tsitu-birthday-map";
  masterDiv.style =
    "display: inline-flex; margin-bottom: 10px; width: 100%; text-align: center; line-height: 1.5; overflow: hidden";
  const spanStyle =
    "; width: auto; padding: 5px; font-weight: bold; font-size: 12.5px";

  const mice500Span = document.createElement("span");
  mice500Span.style = "background-color: " + mice500Color + spanStyle;
  mice500Span.innerHTML = ">500<br>" + mice500Count;

  const mice400Span = document.createElement("span");
  mice400Span.style = "background-color: " + mice400Color + spanStyle;
  mice400Span.innerHTML = "400<br>" + mice400Count;

  const mice300Span = document.createElement("span");
  mice300Span.style = "background-color: " + mice300Color + spanStyle;
  mice300Span.innerHTML = "300<br>" + mice300Count;

  const mice200Span = document.createElement("span");
  mice200Span.style = "background-color: " + mice200Color + spanStyle;
  mice200Span.innerHTML = "200<br>" + mice200Count;

  const mice100Span = document.createElement("span");
  mice100Span.style = "background-color: " + mice100Color + spanStyle;
  mice100Span.innerHTML = "100<br>" + mice100Count;

  const mice0Span = document.createElement("span");
  mice0Span.style = "background-color: " + mice0Color + spanStyle;
  mice0Span.innerHTML = "<100<br>" + mice0Count;

  const priceSpan = document.createElement("span");
  priceSpan.style = "background-color: " + whiteColor + spanStyle;
  priceSpan.innerHTML = "Total Snipe Price<br>" + snipe_price;

  const chestSpan = document.createElement("span");
  chestSpan.style = "background-color: " + whiteColor + spanStyle;
  chestSpan.innerHTML = "Cost of Your Chest<br>" + own_Chest_Price;

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
  masterDiv.appendChild(mice500Span);
  masterDiv.appendChild(mice400Span);
  masterDiv.appendChild(mice400Span);
  masterDiv.appendChild(mice300Span);
  masterDiv.appendChild(mice200Span);
  masterDiv.appendChild(mice100Span);
  masterDiv.appendChild(mice0Span);
  masterDiv.appendChild(priceSpan);
  masterDiv.appendChild(chestSpan);

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
          (chestName.indexOf("Slayer Treasure Chest") >= 0)
        ) {
          colorize();
        }
      }
    });
    originalOpen.apply(this, arguments);
  };
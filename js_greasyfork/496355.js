// ==UserScript==
// @name         MouseHunt - School of Sorcery Map Colourer
// @author       tsitu & Leppy & Neb & kuh & in59te & Warden Slayer
// @namespace    https://greasyfork.org/en/users/967077-maidenless
// @version      1.0.4
// @description  Color codes mice on School of Sorcery maps according to type. Max ML shown per group and AR shown individually.
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/496355/MouseHunt%20-%20School%20of%20Sorcery%20Map%20Colourer.user.js
// @updateURL https://update.greasyfork.org/scripts/496355/MouseHunt%20-%20School%20of%20Sorcery%20Map%20Colourer.meta.js
// ==/UserScript==
// Credits:
// tsitu - Provided the original code.
// in59te - Improved the original code.  We use his version as the starting point.
// Warden Slayer - Implemented bait changes.
// Kuhmann, Leppy and Neb - Maintenance and QA
// tmrj2222 - Provided code to sort the mice by groups.
// and anyone else we may have missed :peepolove:


const displayMinLuck = false; // Will display minluck for the group of mouse in advanced view iff true.
const displayAR = true; // Will display the AR for each uncaught mouse in advanced view iff true.
const displayHunterCheese = false; // Will display which group of mouse the hunter if attempting iff true.
let assignBaitChange = false; // Avoid the bait change event being registered more than once.
const ARwarningText = "AR for School of Sorcery mice might be inaccurate.";

// If the chest name contains any of the following as a substring, enable the colour coder.
const chestKeywords = [
    "Sorcery",
];

// name, AR - per UNIX 1670418873

const OutsideSB = [
];
const OutsideAAC = [
];
const OutsideMMC = [
];
const OutsideBoss = [
    ["Hall Monitor","100%"]
];
const ArcaneArtsSB = [
    ["Perpetual Detention", "32.07%"],
    ["Broomstick Bungler", "38.89%"],
    ["Misfortune Teller","29.04%"]
];
const ArcaneArtsAAC = [
    ["Arcana Overachiever","40.94%"],
    ["Invisible Fashionista","44.38%"],
    ["Enchanted Chess Club Champion","14.68%"]
];
const ArcaneArtsMMC = [
    ["Illustrious Illusionist","39%"],
    ["Featherlight","45.66%"],
    ["Constructively Critical Artist","15.35%"]
];
const ArcaneArtsBoss = [
    ["Arcane Master Sorcerer","100%"]
];
const ShadowSciencesSB = [
    ["Mixing Mishap","29.27%"],
    ["Uncoordinated Cauldron Carrier","38.78%"],
    ["Bookworm","29.27%"]
];
const ShadowSciencesAAC = [
    ["Classroom Keener","40.87%"],
    ["Audacious Alchemist","44.2%"],
    ["Prestigious Prestidigitator","14.93%"]
];
const ShadowSciencesMMC = [
    ["Classroom Disrupter","39.77%"],
    ["Teleporting Truant","44.98%"],
    ["Magical Multitasker","15.25%"]
];
const ShadowSciencesBoss = [
    ["Shadow Master Sorcerer","100%"]
];
const FinalExamShadowSB = [
    ["Cheat Sheet Conjurer","11.28%"]
];
const FinalExamShadowAAC = [
    ["Celestial Summoner","9.49%"]
];
const FinalExamShadowMMC = [
    ["Data Devourer","10.36%"]
];
const FinalExamShadowBoss = [
    ["Mythical Master Sorcerer","100%"]
]
const FinalExamArcaneSB = [
    ["Sleep Starved Scholar","10.06%"]
];
const FinalExamArcaneAAC = [
    ["Class Clown","9.83%"]
];
const FinalExamArcaneMMC = [
    ["Tyrannical Thaumaturge","10.09%"]
];
const FinalExamArcaneBoss = [
    ["Mythical Master Sorcerer","100%"]
]


// group location, mice, minimum luck, bait, bait ID, color
const miceGroups = [

    ["FinalExamArcane", FinalExamArcaneSB, 107, "Std", 0, "#ffabab"],
    ["FinalExamArcane", FinalExamArcaneAAC, 132, "AAC", 0, "#ff8282"],
    ["FinalExamArcane", FinalExamArcaneMMC, 160, "MMC", 0, "#ff5858"],
    ["FinalExamArcane", FinalExamArcaneBoss, 183, "Boss", 0, "#754BAC"],
    ["FinalExamShadow", FinalExamShadowSB, 107, "Std", 0, "#b2bbf2"],
    ["FinalExamShadow", FinalExamShadowAAC, 132, "AAC", 0, "#8b9aeb"],
    ["FinalExamShadow", FinalExamShadowMMC, 160, "MMC", 0, "#6578e5"],
    ["FinalExamShadow", FinalExamShadowBoss, 183, "Boss", 0, "#754BAC"],
    ["Arcane", ArcaneArtsSB, 96, "Std", 0, "#b5d09f"],
    ["Arcane", ArcaneArtsAAC, 118, "AAC", 0, "#8fb86e"],
    ["Arcane", ArcaneArtsMMC, 136, "MMC", 0, "#6aa13e"],
    ["Arcane", ArcaneArtsBoss, 142, "Boss", 0, "#45890e"],
    ["Shadow", ShadowSciencesSB, 96, "Std", 0, "#f2b2eb"],
    ["Shadow", ShadowSciencesAAC, 118, "AAC", 0, "#eb8be2"],
    ["Shadow", ShadowSciencesMMC, 136, "MMC", 0, "#e565d8"],
    ["Shadow", ShadowSciencesBoss, 142, "Boss", 0, "#de3ece"],

];

class Mouse {
    constructor(name, AR) {
        this.name = name;
        this.AR = AR;
    }
}

class MiceGroup {
    constructor(name, minluck, cheese, baitId, color) {
        this.name = name;
        this.id = (name + cheese).replace(/[^a-zA-Z0-9]/g,'')
        this.mice = [];
        this.minluck = minluck;
        this.cheese = cheese;
        this.baitId = baitId;
        this.color = color;
        this.count = 0;
    }

    add(mouse) {
        this.mice.push(mouse);
    }

    hasMouse(name) {
        for (let i = 0; i < this.mice.length; i++) {
            if (this.mice[i].name == name) {
                return true;
            }
        }
        return false;
    }

    getAR(name) {
        for (let i = 0; i < this.mice.length; i++) {
            if (this.mice[i].name == name) {
                return this.mice[i].AR;
            }
        }
        return "0.00%";
    }
}

let allMiceGroups = []; // This contains all info about the various group of mice.
let miceNameDict = {}; // If displayAR == true, we are forced to modify the <span> element's text to mouse name + AR, so we need to be able to go back to the original mouse name.

let simpleView = true; // Toggle between simple and advanced view


function initialise() {
    // Avoid initialising more than once as the script can be called multiple times by other plug-in.
    if (allMiceGroups.length > 0) {
        sortGoals();
        return;
    }

    // Populate allMiceGroups from miceGroups
    for (let i = 0; i < miceGroups.length; i++) {
        let miceGroup = new MiceGroup(
            miceGroups[i][0],
            miceGroups[i][2],
            miceGroups[i][3],
            miceGroups[i][4],
            miceGroups[i][5]
        );
        for (let j = 0; j < miceGroups[i][1].length; j++) {
            miceGroup.add(new Mouse(miceGroups[i][1][j][0], miceGroups[i][1][j][1]));
        }
        allMiceGroups.push(miceGroup);
    }
    sortGoals();
}

function addAr(mouseSpan, mouseName, miceGroup) {
    const mouseNameWithAr = mouseName + " (" + miceGroup.getAR(mouseName) + ")";
    //console.log("checking " + mouseNameWithAr + " in dict: " + (mouseNameWithAr in miceNameDict));
    if (!(mouseNameWithAr in miceNameDict)) {
        miceNameDict[mouseNameWithAr] = mouseName;
    }
    mouseSpan.querySelector(".treasureMapView-goals-group-goal-name").querySelector("span").firstChild .textContent = mouseNameWithAr;
}

function removeAr(mouseSpan, mouseName) {
    mouseSpan.querySelector(".treasureMapView-goals-group-goal-name").querySelector("span").firstChild .textContent = mouseName;
}

const defaultColor = miceGroups[0][5];
const hunterColor = [defaultColor, defaultColor, defaultColor, defaultColor, defaultColor];
var numHunters = 0;

function getCheeseColor(cheese) {
    for (let i = 0; i < allMiceGroups.length; i++) {
        if (allMiceGroups[i].cheese == cheese) {
            return allMiceGroups[i].color;
        }
    }
    return defaultColor; // return the default color if no matching cheese.
}

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
        hunterColor[i] = getCheeseColor(list_of_cheese[i]);
    }
    //console.log(hunterColor);
}

function colorize() {
    const greyColor = "#949494";

    const isChecked = !simpleView;
    const isCheckedStr = isChecked ? "checked" : "";
    //console.log(isCheckedStr);

    if (
        document.querySelectorAll(".treasureMapView-goals-group-goal").length === 0
    ) {
        return;
    }

    for (let i = 0; i < allMiceGroups.length; i++) {
        allMiceGroups[i].count = 0;
    }

    /*
    for (const key of Object.keys(miceNameDict)) {
        console.log(key + ": " + miceNameDict[key])
    }
    */

    const mapMiceSet = new Set()

    document.querySelectorAll(".treasureMapView-goals-group-goal").forEach(el => {
        el.querySelector("span").style = "color: black;";
        let mouseName = el.querySelector(".treasureMapView-goals-group-goal-name").querySelector("span").firstChild .textContent;
        // Fix up the mouse name if we added AR info in.
        if (mouseName in miceNameDict) {
            mouseName = miceNameDict[mouseName];
        }

        // sometimes mice get duplicated.
        if (mapMiceSet.has(mouseName)) {
            //console.log(mouseName + " duplicated");
            return;
        }

        //console.log(mouseName + " is new");
        mapMiceSet.add(mouseName);

        for (let i = 0; i < allMiceGroups.length; i++) {
            if (allMiceGroups[i].hasMouse(mouseName)) {
                el.style.backgroundColor = allMiceGroups[i].color;
                if (el.className.indexOf(" complete ") < 0) {
                    allMiceGroups[i].count++;
                    if (displayAR && !simpleView) {
                        addAr(el, mouseName, allMiceGroups[i]);
                    } else {
                        removeAr(el, mouseName)
                    }
                    // early out once the mouse is found.
                    break;
                } else {
                    if (isChecked) el.style.backgroundColor = "white";
                }
            }
        }
    });

    //console.log(document.querySelectorAll(".treasureMapView-goals-group-goal").length);

    /*for (let i = 0; i < allMiceGroups.length; i++) {
        console.log(allMiceGroups[i].name + " " + allMiceGroups[i].cheese + " " + allMiceGroups[i].count);
    }*/

    // Remove existing tsitu-map-div related elements before proceeding
    document.querySelectorAll(".tsitu-map-div").forEach(el => el.remove());

    const masterDivHeader = document.createElement("div");
    masterDivHeader.className = "tsitu-map-div";
    masterDivHeader.style =
        "display: inline-flex; margin-bottom: 0px; width: 100%; text-align: center; line-height: 1.25; overflow: hidden";
    const masterDivRow1 = document.createElement("div");
    masterDivRow1.className = "tsitu-map-div";
    masterDivRow1.style =
        "display: inline-flex; margin-bottom: 0px; width: 100%; text-align: center; line-height: 1.25; overflow: hidden";
    const masterDivRow2 = document.createElement("div");
    masterDivRow2.className = "tsitu-map-div";
    masterDivRow2.style =
        "display: inline-flex; margin-bottom: 0px; width: 100%; text-align: center; line-height: 1.25; overflow: hidden";
    const spanStyle =
          "; width: auto; padding: 5px; width: 45px; color: black; font-weight: bold; font-size: 12.75px; text-shadow: 0px 0px 11px white";

    const spans1 = [];
    const spans2 = [];

    for (let i = 0; i < 16; i++) {
        const newSpan = document.createElement("span");
        newSpan.classList.add(allMiceGroups[i].id + "Span");
        if (allMiceGroups[i].count > -1) {
            newSpan.style = "background-color: " + allMiceGroups[i].color + spanStyle;
        }
        else {
            newSpan.style = "background-color: " + greyColor + spanStyle;
        }
        newSpan.innerHTML = "";
        if (displayMinLuck && !simpleView) {
            newSpan.innerHTML = newSpan.innerHTML + "<br> ML: " + allMiceGroups[i].minluck;
            newSpan.innerHTML = newSpan.innerHTML + "<br> Mice: " + allMiceGroups[i].count;
        } else {
            newSpan.innerHTML = newSpan.innerHTML + allMiceGroups[i].count;
        }

       if (i < 8) {
            spans1.push(newSpan);
       } else {
            spans2.push(newSpan);
       }
    }

    const ARDiv = document.createElement("div");
    ARDiv.className = "tsitu-map-div";
    ARDiv.style =
        "display: inline-flex; margin-bottom: 10px; width: 100%; text-align: left; line-height: 1.25; overflow: hidden";
    const ARStyle =
          "width: auto; padding: 0px; font-weight: bold; font-size: 11px";

    const ARwarning = document.createElement("span");
    ARwarning.innerHTML = ARwarningText;
    ARwarning.style = ARStyle;
    if (displayAR && !simpleView) {ARDiv.appendChild(ARwarning);}

    // Simple vs Advanced View
    const highlightLabel = document.createElement("label");
    highlightLabel.htmlFor = "tsitu-highlight-box";
    highlightLabel.innerText = "Advanced view";

    const highlightBox = document.createElement("input");
    highlightBox.type = "checkbox";
    highlightBox.name = "tsitu-highlight-box";
    highlightBox.style.verticalAlign = "middle";
    highlightBox.checked = isChecked;
    highlightBox.addEventListener("click", function () {
        if (highlightBox.checked) {
            simpleView = false;
        } else {
            simpleView = true;
        }
        if (displayHunterCheese) {
            hunterColorize();
        }
        colorize();
    });

    const highlightDiv = document.createElement("div");
    highlightDiv.className = "tsitu-map-div";
    highlightDiv.style = "float: right; position: relative; z-index: 1";
    highlightDiv.appendChild(highlightBox);
    highlightDiv.appendChild(highlightLabel);

    // Assemble masterDiv
     const headerSpanLoactionStyle =
          "; width: auto; padding: 5px; color: black; width: 60px; font-size: 9px; text-shadow: 0px 0px 11px white";
     const headerSpanGroupStyle =
          "; width: auto; padding: 5px; color: black; width: 45px; font-size: 9px; text-shadow: 0px 0px 11px white";

    const aacColor = greyColor//"#2E6309"
    const mmcColor = greyColor//"#465996"

    for (let i = 0; i < 2; i++) {
        {
            const newSpan = document.createElement("span");
            newSpan.classList.add("Header1Span");
            newSpan.style = "background-color: " + greyColor + headerSpanLoactionStyle;
            newSpan.innerHTML = "Location";
            masterDivHeader.appendChild(newSpan);
        }
        {
            const newSpan = document.createElement("span");
            newSpan.classList.add("Header2Span");
            newSpan.style = "background-color: " + greyColor + headerSpanGroupStyle;
            newSpan.innerHTML = "Std";
            masterDivHeader.appendChild(newSpan);
        }
        {
            const newSpan = document.createElement("span");
            newSpan.classList.add("Header3Span");
            newSpan.style = "background-color: " + aacColor + headerSpanGroupStyle;
            newSpan.innerHTML = "AAC";
            masterDivHeader.appendChild(newSpan);
        }
        {
            const newSpan = document.createElement("span");
            newSpan.classList.add("Header4Span");
            newSpan.style = "background-color: " + mmcColor + headerSpanGroupStyle;
            newSpan.innerHTML = "MMC";
            masterDivHeader.appendChild(newSpan);
        }
        {
            const newSpan = document.createElement("span");
            newSpan.classList.add("Header6Span");
            newSpan.style = "background-color: " + greyColor + headerSpanGroupStyle;
            newSpan.innerHTML = "Boss";
            masterDivHeader.appendChild(newSpan);
        }
    }
    {
        const newSpan = document.createElement("span");
        newSpan.classList.add("FinalExamArcaneSpan");
        newSpan.style = "background-color: " + greyColor + headerSpanLoactionStyle;
        newSpan.innerHTML = "Final Exam - Arcane";
        masterDivRow1.appendChild(newSpan);
    }
    for (let i = 0; i < 4; i++) {
        masterDivRow1.appendChild(spans1[i]);
    }
    {
        const newSpan = document.createElement("span");
        newSpan.classList.add("FinalExamShadowSpan");
        newSpan.style = "background-color: " + greyColor + headerSpanLoactionStyle;
        newSpan.innerHTML = "Final Exam - Shadow";
        masterDivRow1.appendChild(newSpan);
    }
    for (let i = 4; i < 8; i++) {
        masterDivRow1.appendChild(spans1[i]);
    }
    {
        const newSpan = document.createElement("span");
        newSpan.classList.add("ArcaneSpan");
        newSpan.style = "background-color: " + greyColor + headerSpanLoactionStyle;
        newSpan.innerHTML = "Arcane";
        masterDivRow2.appendChild(newSpan);
    }
    for (let i = 0; i < 4; i++) {
        masterDivRow2.appendChild(spans2[i]);
    }
    {
        const newSpan = document.createElement("span");
        newSpan.classList.add("ShadowSpan");
        newSpan.style = "background-color: " + greyColor + headerSpanLoactionStyle;
        newSpan.innerHTML = "Shadow";
        masterDivRow2.appendChild(newSpan);
    }
    for (let i = 4; i < 8; i++) {
        masterDivRow2.appendChild(spans2[i]);
    }

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
        insertEl.insertAdjacentElement("afterbegin", ARDiv);
        insertEl.insertAdjacentElement("afterbegin", masterDivRow2);
        insertEl.insertAdjacentElement("afterbegin", masterDivRow1);
        insertEl.insertAdjacentElement("afterbegin", masterDivHeader);
    }

    var canvas = [];
    var div = document.getElementsByClassName("treasureMapView-hunter-wrapper mousehuntTooltipParent");

    if (displayHunterCheese) {
        for (var i=0; i<div.length; i++){
            canvas[i] = document.createElement('canvas');
            canvas[i].id = "hunter-canvas";
            canvas[i].style = "; bottom: 0px; left: 0px; position: absolute; width: 15px; height: 15px; background: " + hunterColor[i] + "; border: 1px solid black";
            div[i].appendChild(canvas[i]);
        }
    }

    // "Goals" button
    document.querySelector("[data-type='show_goals']").onclick = function () {
        colorize();
    };

    if (assignBaitChange) {
        // Avoid assigning the event more than once.
        assignBaitChange = false;
        for (let i = 0; i < allMiceGroups.length; i++) {
            if (allMiceGroups[i].count > 0) {
                //console.log(allMiceGroups[i].id + " " + allMiceGroups[i].cheese + " " + allMiceGroups[i].count);
                //Warden added this (waves)
                $(document).on('click', '.' + allMiceGroups[i].id + 'Span', function() {
                    hg.utils.TrapControl.setBait(allMiceGroups[i].baitId).go();
                });
            }
        }
    }
}


// Credit to @tmrj2222 for the code
function sortGoals() {

    const parentGoals = document.querySelector(".treasureMapView-goals-group-goal-padding").parentElement.parentElement;
    const childrenArray = Array.from(parentGoals.children);
    childrenArray.sort((a, b) => {
            let orderA = -1;
            let orderB = -1;

        const nameA = a.querySelector("span").firstChild.textContent;
        const nameB = b.querySelector("span").firstChild.textContent;

        for (let i = 0; i < allMiceGroups.length; i++) {
            if (allMiceGroups[i].hasMouse(nameA)) {
                orderA = i;
                //console.log(nameA + " - " + orderA );
                break;
            }
        }
        for (let i = 0; i < allMiceGroups.length; i++) {
            if (allMiceGroups[i].hasMouse(nameB)) {
                orderB = i;
                break;
            }
        }
            return orderA - orderB;
        });
   while (parentGoals.firstChild) {
            parentGoals.removeChild(parentGoals.firstChild);
   }
   childrenArray.forEach(child => parentGoals.appendChild(child));

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
                chestName && chestKeywords.some(v => chestName.includes(v))
            ) {
                initialise();
                if (displayHunterCheese) {
                    hunterColorize();
                }
                colorize();
            }
        }
    });
    originalOpen.apply(this, arguments);
};

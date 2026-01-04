// ==UserScript==
// @name         MouseHunt - Hween 2022 Trick/Treat map colour coder
// @author       tsitu & Leppy & in59te & Warden Slayer
// @namespace    https://greasyfork.org/en/users/967077-maidenless
// @version      1.1.6
// @description  Color codes mice on trick/treat maps according to type. Max ML shown per group and AR shown individually.
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/453027/MouseHunt%20-%20Hween%202022%20TrickTreat%20map%20colour%20coder.user.js
// @updateURL https://update.greasyfork.org/scripts/453027/MouseHunt%20-%20Hween%202022%20TrickTreat%20map%20colour%20coder.meta.js
// ==/UserScript==
// Credits:
// tsitu - Provided the original code.
// in59te - Improved the original code.  We use his version as the starting point.
// Warden Slayer - Implemented bait changes.
// Kuhmann, Leppy and Neb - Maintenance and QA
// tmrj2222 - Provided code to sort the mice by groups.
// and anyone else we may have missed :peepolove:

const displayMinLuck = true; // Will display minluck for the group of mouse iff true.
const displayAR = true; // Will display the AR for each uncaught mouse iff true.
const displayHunterCheese = true; // Will display which group of mouse the hunter if attempting iff true.
let assignBaitChange = true; // Avoid the bait change event being registered more than once.

// If the chest name contains any of hte following as a substring, enable the colour coder.
const chestKeywords = [
    "Halloween",
    "Undead",
];

// name, AR
const standardMice = [
    ["Candy Cat", "9.02%"],
    ["Candy Goblin", "9.23%"],
    ["Cobweb", "9.74%"],
    ["Grey Recluse", "9.88%"],
    ["Shortcut", "20.30%"],
    ["Sugar Rush", "7.60%"],
    ["Teenage Vampire", "8.79%"],
    ["Tricky Witch", "15.40%"],
    ["Zombot Unipire", "10.04%"],
];
const jackoMice = [
    ["Gourdborg", "7.90%"],
    ["Maize Harvester", "19.94%"],
    ["Pumpkin Hoarder", "25.50%"],
    ["Spirit Light", "11.97%"],
    ["Treat", "14.84%"],
    ["Trick", "14.85%"],
    ["Wild Chainsaw", "5.00%"],
];
const boneMice = [
    ["Creepy Marionette", "9.91%"],
    ["Dire Lycan", "14.96%"],
    ["Grave Robber", "4.99%"],
    ["Hollowhead", "19.68%"],
    ["Mousataur Priestess", "9.94%"],
    ["Sandmouse", "20.62%"],
    ["Titanic Brain-Taker", "14.78%"],
    ["Tomb Exhumer", "5.12%"],
];
const pgMice = [
    ["Admiral Arrrgh", "4.92%"],
    ["Captain Cannonball", "22.63%"],
    ["Ghost Pirate Queen", "4.97%"],
    ["Gourd Ghoul", "10.06%"],
    ["Scorned Pirate", "21.66%"],
    ["Spectral Butler", "13.98%"],
    ["Spectral Swashbuckler", "21.78%"],
];
const screamMice = [
    ["Baba Gaga", "15.15%"],
    ["Bonbon Gummy Globlin", "20.65%"],
    ["Hollowed", "19.65%"],
    ["Hollowed Minion", "24.90%"],
    ["Swamp Thang", "19.65%"],
];

// group name, mice, minimum luck, bait, bait ID, color
const miceGroups = [
    ["Std", standardMice, 40, "", 114, "#D7BDE2"], // light purple
    ["Jack", jackoMice, 40, "Monterey Jack-O-Lantern", 3305, "#F8C471"], // orange
    ["Bone", boneMice, 45, "Bonefort Cheese", 3306, "#E6B0AA"], // red
    ["Polter", pgMice, 45, "Polter-Geitost", 3307, "#A9CCE3"], // blue
    ["Scream", screamMice, 45, "Scream Cheese", 3308, "#AED581"], // green
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

function initialise() {
    // Avoid initialising more than once as the script can be called multiple times by other plug-in.
    if (allMiceGroups.length > 0) {
        //sortGoals();
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
}

function addAr(mouseSpan, mouseName, miceGroup) {
    const mouseNameWithAr = mouseName + " (" + miceGroup.getAR(mouseName) + ")";
    //console.log("checking " + mouseNameWithAr + " in dict: " + (mouseNameWithAr in miceNameDict));
    if (!(mouseNameWithAr in miceNameDict)) {
        miceNameDict[mouseNameWithAr] = mouseName;
    }
    mouseSpan.querySelector(".treasureMapView-goals-group-goal-name").querySelector("span").firstChild .textContent = mouseNameWithAr;
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
    document.querySelectorAll(".treasureMapRootView-subTab[data-type='manage_allies']")[0].click(); //Click on Hunters tab
    let hunters = document.querySelectorAll(".treasureMapView-componentContainer");
    const list_of_cheese = [];
    for (let i = 0; i < hunters.length; i++) {
        list_of_cheese.push(hunters[i].children[2].title);
    }
    //console.log(list_of_cheese);
    numHunters = hunters.length;
    document.querySelectorAll(".treasureMapRootView-subTab[data-type='show_goals']")[0].click(); //Click on Goals tab


    for (let i = 0; i < numHunters; i++) {
        hunterColor[i] = getCheeseColor(list_of_cheese[i]);
    }
    //console.log(hunterColor);
}

function colorize() {
    const greyColor = "#949494";

    const isChecked =
          localStorage.getItem("highlightPref") === "uncaught-only" ? true : false;
    const isCheckedStr = isChecked ? "checked" : "";

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

    document.querySelectorAll(".treasureMapView-goals-group-goal").forEach(el => {
        let mouseName = el.querySelector(".treasureMapView-goals-group-goal-name").querySelector("span").firstChild .textContent;
        // Fix up the mouse name if we added AR info in.
        if (mouseName in miceNameDict) {
            mouseName = miceNameDict[mouseName];
        }
        //console.log(mouseName);

        for (let i = 0; i < allMiceGroups.length; i++) {
            if (allMiceGroups[i].hasMouse(mouseName)) {
                el.style.backgroundColor = allMiceGroups[i].color;
                if (el.className.indexOf(" complete ") < 0) {
                    allMiceGroups[i].count++;
                    if (displayAR) {
                        addAr(el, mouseName, allMiceGroups[i]);
                    }
                } else {
                    if (isChecked) el.style.backgroundColor = "white";
                }
            }
        }
    });

    /*
    for (let i = 0; i < allMiceGroups.length; i++) {
        console.log(allMiceGroups[i].name + " " + allMiceGroups[i].cheese + " " + allMiceGroups[i].count);
    }*/

    // Remove existing tsitu-map-div related elements before proceeding
    document.querySelectorAll(".tsitu-map-div").forEach(el => el.remove());

    const masterDiv = document.createElement("div");
    masterDiv.className = "tsitu-map-div";
    masterDiv.style =
        "display: inline-flex; margin-bottom: 10px; width: 100%; text-align: center; line-height: 1.5; overflow: hidden";
    const spanStyle =
          "; width: auto; padding: 5px; font-weight: bold; font-size: 12.75px; text-shadow: 0px 0px 11px white";

    const spans = [];

    for (let i = 0; i < allMiceGroups.length; i++) {
        const newSpan = document.createElement("span");
        newSpan.classList.add(allMiceGroups[i].name + "Span");
        if (allMiceGroups[i].count > 0) {
            newSpan.style = "background-color: " + allMiceGroups[i].color + spanStyle;
        }
        else {
            newSpan.style = "background-color: " + greyColor + spanStyle;
        }
        newSpan.innerHTML = allMiceGroups[i].name;
        if (displayMinLuck) {
            newSpan.innerHTML = newSpan.innerHTML + " (" + allMiceGroups[i].minluck + ")";
        }
        newSpan.innerHTML = newSpan.innerHTML + "<br>" + allMiceGroups[i].count;
        spans.push(newSpan);
    }

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
    for (let i = 0; i < spans.length; i++) {
        masterDiv.appendChild(spans[i]);
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
        insertEl.insertAdjacentElement("afterbegin", masterDiv);
    }

    var canvas = [];
    var div = document.getElementsByClassName("treasureMapView-hunter-wrapper"); //MH improved removes mousehuntTooltipParent class??

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
            //Warden added this (waves)
            $(document).on('click', '.' + allMiceGroups[i].name + 'Span', function() {
                hg.utils.TrapControl.setBait(allMiceGroups[i].baitId).go();
            });
        }
    }

    sortGoals();
}

// Credit to @tmrj2222 for the code
function sortGoals() {
    //const regex = / \(\d+\.\d+%?\)$/;
    const parentGoals = document.querySelector(".treasureMapView-goals-group-goal-padding").parentElement.parentElement;
    //console.log(parentGoals.textContent);

    const childrenArray = Array.from(parentGoals.children);
    //console.log("before sorting");
    //console.log(childrenArray);
    childrenArray.sort((a, b) => {
        let orderA = -1;
        let orderB = -1;

        //const nameA = a.querySelector("span").firstChild.textContent.replace(regex, '');
        //const nameB = b.querySelector("span").firstChild.textContent.replace(regex, '');
        const nameA = displayAR ? miceNameDict[a.querySelector("span").firstChild.textContent] : a.querySelector("span").firstChild.textContent;
        const nameB = displayAR ? miceNameDict[b.querySelector("span").firstChild.textContent] : b.querySelector("span").firstChild.textContent;

        //console.log('nameA == ' + nameA);
        //console.log('nameB == ' + nameB);

        for (let i = 0; i < allMiceGroups.length; i++) {
            if (allMiceGroups[i].hasMouse(nameA)) {
                orderA = i;
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

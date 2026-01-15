// ==UserScript==
// @name         MouseHunt - GWH 2022 Nice/Naughty map colour coder
// @author       tsitu & Leppy & Neb & in59te & Warden Slayer
// @namespace    https://greasyfork.org/en/users/967077-maidenless
// @version      1.1.9
// @description  Color codes mice on Nice/Naughty maps according to type. Max ML shown per group and AR shown individually. ARs given for standard cheese assume SB, if Gouda is relevant the ARs are given as ([Gouda] | [SB]). ARs given for (G)PP are given as ([PP] | [GPP]).
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/456151/MouseHunt%20-%20GWH%202022%20NiceNaughty%20map%20colour%20coder.user.js
// @updateURL https://update.greasyfork.org/scripts/456151/MouseHunt%20-%20GWH%202022%20NiceNaughty%20map%20colour%20coder.meta.js
// ==/UserScript==

// Credit to the minluck and mice population prepared by Seli and Neb.

const displayMinLuck = true; // Will display minluck for the group of mouse in advanced view iff true.
const displayAR = true; // Will display the AR for each uncaught mouse in advanced view iff true.
const displayHunterCheese = false; // Will display which group of mouse the hunter if attempting iff true.
let assignBaitChange = true; // Avoid the bait change event being registered more than once.
const ARwarningText = "ARs assume SB, if Gouda is relevant the ARs are given as ([Gouda] | [SB]).<br>ARs given for (G)PP are given as ([PP] | [GPP]).";

// If the chest name contains any of the following as a substring, enable the colour coder.
const chestKeywords = [
    "Nice",
    "Naughty",
    "New Year's",
];

// name, AR - per UNIX 1768326260
// ARs given for standard cheese assume SB, if Gouda is relevant the ARs are given as "[Gouda] | [SB]"
// ARs given for (G)PP are given as "[PP] | [GPP]"

const standardAnyMice = [
    ["Hoarder", "25.82% | 21.09%"], //lowest currently known sb AR%, some areas may be better
];
const ppAnyMice = [
    ["Snowflake", "3.00% | 4.86%"], //lowest currently known, some areas may be better
    ["Stuck Snowball", "4.91% | 4.95%"], //lowest currently known, some areas may be better
];
const gppAnyMice = [
    ["Glazy", "4.86%"], //lowest currently known, some areas may be better
    ["Joy", "6.04%"], //lowest currently known, some areas may be better
];
const bossMice = [
    ["Frost King", "special"],
];
const standardHillMice = [
    ["Candy Cane", "23.12% | 19.93%"],
    ["Nice Knitting", "14.33% | 9.56%"],
    ["Shorts-All-Year", "10.04% | 4.93%"],
    ["Snow Scavenger", "7.97% | 7.12%"],
    ["Toboggan Technician", "9.87% | 7.77%"],
    ["Young Prodigy Racer", "21.64% | 16.81%"],
];
const ppHillMice = [
    ["Triple Lutz", "5.03%"],
];
const ppGppHillMice = [
    ["Black Diamond Racer", "19.93% | 9.99%"],
    ["Double Black Diamond Racer", "3.98% | 3.86%"],
    ["Free Skiing", "3.91% | 3.93%"],
    ["Great Giftnapper", "2.94% | 3.05%"],
    ["Nitro Racer", "4.08% | 5.05%"],
    ["Ol' King Coal", "2.00% | 2.01%"],
    ["Rainbow Racer", "1.91% | 2.05%"],
    ["Snow Boulder", "6.60% | 9.86%"],
    ["Snow Golem Jockey", "9.67% | 7.99%"],
    ["Snowball Hoarder", "7.65% | 11.99%"],
    ["Sporty Ski Instructor", "12.75% | 9.86%"],
    ["Wreath Thief", "10.03% | 7.60%"],
    ["Frightened Flying Fireworks", "11.88% | 9.91%"],
];
const standardWorkshopMice = [
    ["Gingerbread", "21.46% | 16.40%"],
    ["Greedy Al", "10.32% | 10.04%"],
    ["Mouse of Winter Future", "14.56% | 9.88%"],
    ["Mouse of Winter Past", "10.05% | 8.67%"],
    ["Mouse of Winter Present", "23.71% | 20.11%"],
];
const sbWorkshopMice = [
    ["Scrooge", "7.87%"],
];
const ppWorkshopMice = [
    ["Ribbon", "4.95%"],
];
const ppGppWorkshopMice = [
    ["Christmas Tree", "10.16% | 7.67%"],
    ["Destructoy", "7.06% | 9.97%"],
    ["Elf", "17.10% | 8.52%"],
    ["Mad Elf", "1.98% | 2.04%"],
    ["Nutcracker", "3.92% | 4.08%"],
    ["Ornament", "4.07% | 4.03%"],
    ["Present", "10.23% | 7.77%"],
    ["Ridiculous Sweater", "7.95% | 9.79%"],
    ["Snow Golem Architect", "4.03% | 4.99%"],
    ["Stocking", "3.96% | 3.77%"],
    ["Toy", "6.58% | 9.80%"],
    ["Toy Tinkerer", "8.23% | 4.95%"],
    ["Party Head", "7.98% | 11.11%"],
];
const standardFortressMice = [
    ["Confused Courier", "15.17% | 9.80%"],
    ["Frigid Foreman", "10.12% | 10.03%"],
    ["Miser", "14.29% | 10.10%"],
    ["Missile Toe", "14.94% | 14.76%"],
    ["Snowblower", "14.11% | 10.06%"],
    ["Snowglobe", "20.39% | 9.33%"],
];
const ppFortressMice = [
    ["Builder", "6.29%"],
];
const ppGppFortressMice = [
    ["Borean Commander", "8.96% | 8.13%"],
    ["Glacia Ice Fist", "10.02% | 5.93%"],
    ["Great Winter Hunt Impostor", "6.92% | 13.83%"],
    ["Iceberg Sculptor", "3.95% | 2.97%"],
    ["Naughty Nougat", "3.89% | 4.08%"],
    ["Reinbo", "16.50% | 3.63%"],
    ["S.N.O.W. Golem", "3.99% | 4.40%"],
    ["Slay Ride", "8.00% | 9.66%"],
    ["Snow Fort", "7.66% | 8.87%"],
    ["Snow Sorceress", "7.47% | 8.04%"],
    ["Squeaker Claws", "4.11% | 4.04%"],
    ["Tundra Huntress", "1.91% | 2.09%"],
    ["New Year's", "11.86% | 10.70%"],
];

// group name, mice, minimum luck, bait, bait ID, color
const miceGroups = [
    ["Any<br>Standard", standardAnyMice, 10, "", 114, "#B6D7A8"],
    ["Any<br>PP", ppAnyMice, 24, "", 2522, "#93C47D"],
    ["Any<br>GPP", gppAnyMice, 1, "", 2733 , "#6AA84F "],
    ["Hill<br>Standard", standardHillMice, 33, "", 114, "#FCE5CD"],
    ["Hill<br>PP", ppHillMice, 12, "", 2522, "#F6B26B"],
    ["Hill<br>PP/GPP", ppGppHillMice, 38, "", 2522, "#F9CB9C"],
    ["Workshop<br>Standard", standardWorkshopMice, 35, "", 114, "#F4CCCC"],
    ["Workshop<br>SB", sbWorkshopMice, 33, "", 114, "#"],
    ["Workshop<br>PP", ppWorkshopMice, 8, "", 2522, "#E06666"],
    ["Workshop<br>PP/GPP", ppGppWorkshopMice, 44, "", 2522, "#EA9999"],
    ["Fortress<br>Standard", standardFortressMice, 38, "", 114, "#C9DAF8"],
    ["Fortress<br>PP", ppFortressMice, 17, "", 2522, "#3C78D8"],
    ["Fortress<br>PP/GPP", ppGppFortressMice, 53, "", 2522, "#6FA8DC"],
    ["Fortress<br>Boss", bossMice, 30, "", 114, "#7095E4"],
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
        this.id = name.replace(/[^a-zA-Z0-9]/g,'')
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

    const masterDiv = document.createElement("div");
    masterDiv.className = "tsitu-map-div";
    masterDiv.style =
        "display: inline-flex; margin-bottom: 5px; width: 100%; text-align: center; line-height: 1.25; overflow: hidden";
    const spanStyle =
          "; width: auto; padding: 5px; color: black; font-weight: bold; font-size: 12.75px; text-shadow: 0px 0px 11px white";

    const spans = [];

    for (let i = 0; i < allMiceGroups.length; i++) {
        const newSpan = document.createElement("span");
        newSpan.classList.add(allMiceGroups[i].id + "Span");
        if (allMiceGroups[i].count > 0) {
            newSpan.style = "background-color: " + allMiceGroups[i].color + spanStyle;
        }
        else {
            newSpan.style = "background-color: " + greyColor + spanStyle;
        }
        newSpan.innerHTML = allMiceGroups[i].name;
        if (displayMinLuck && !simpleView) {
            newSpan.innerHTML = newSpan.innerHTML + "<br> ML: " + allMiceGroups[i].minluck;
            newSpan.innerHTML = newSpan.innerHTML + "<br> Mice: " + allMiceGroups[i].count;
        } else {
            newSpan.innerHTML = newSpan.innerHTML + "<br>" + allMiceGroups[i].count;
        }
        if (allMiceGroups[i].count > 0) {
            spans.push(newSpan);
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
        insertEl.insertAdjacentElement("afterbegin", ARDiv);
        insertEl.insertAdjacentElement("afterbegin", masterDiv);
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

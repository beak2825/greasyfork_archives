// ==UserScript==
// @name         MouseHunt - Draconic Depths Map Colourer
// @author       tsitu & Leppy & Neb & kuh & in59te & Warden Slayer
// @namespace    https://greasyfork.org/en/users/967077-maidenless
// @version      1.0.3
// @description  Color codes mice on Draconic Depths maps according to type. Max ML shown per group and AR shown individually.
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/509039/MouseHunt%20-%20Draconic%20Depths%20Map%20Colourer.user.js
// @updateURL https://update.greasyfork.org/scripts/509039/MouseHunt%20-%20Draconic%20Depths%20Map%20Colourer.meta.js
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
const ARwarningText = "AR for Draconic Depths mice might be inaccurate.";

// If the chest name contains any of the following as a substring, enable the colour coder.
const chestKeywords = [
    "Draconic Depths",
];

// name, AR - per UNIX 1670418873

const ROutside = [
    ["Squire Sizzleton","16.48%"],
    ["Torchbearer Tinderhelm","44.87%"],
    ["Colonel Crisp","38.64%"]
];
const RZero = [
    ["Flamina Cinderbreath","60.19%"],
    ["Crematio Scorchworth","25.91%"]
];
const R100 = [  
    ["Incendarius the Unquenchable","29.72%"],
    ["Combustius Furnaceheart","28.19%"]
];
const R750 = [
    ["Sulfurious the Raging Inferno","40.16%"]
];
const GOutside = [
    ["Goopus Dredgemore","16.67%"],
    ["Noxio Sludgewell","44.84%"],
    ["Dreck Grimehaven","38.49%"]
]
const GZero = [
    ["Malignus Vilestrom","25.49%"],
    ["Venomona Festerbloom","59.77%"]
];
const G100 = [
    ["Belchazar Banewright","33.75%"],
    ["Pestilentia the Putrid","29.94%"]
];
const G750 = [
    ["Corrupticus the Blight Baron","39.27%"]
];
const BOutside = [
    ["Frostnip Icebound","14.18%"],
    ["Blizzara Winterosa","45.66%"],
    ["Iciclesius the Defender","41.8%"]
]
const BZero = [
    ["Rimeus Polarblast","24.7%"],
    ["Frigidocius Coldshot","60.79%"]
];
const B100 = [
    ["Avalancheus the Glacial","29.59%"],
    ["Chillandria Permafrost","33.11%"],
];
const B750 = [
    ["Arcticus the Biting Frost","39.12%"]
];
const EleOutside = [
    ["Tranquilia Protecticus","100%"]
]
const EleZero = [
    ["Absolutia Harmonius","64.2%"],
    ["Magnatius Majestica","56.52%"]
];
const Ele100 = [
    ["Supremia Magnificus","29.51%"],
    ["Three'amat the Mother of Dragons","30.77%"]
];
const Ele750 = [
    ["Mythical Dragon Emperor","39.72%"]
];


// group location, mice, minimum luck, bait, bait ID, color
const miceGroups = [

    ["Fire", ROutside, 110, "Std", 0, "#ffabab"],
    ["Fire", RZero, 146, "Std", 0, "#ff8282"],
    ["Fire", R100, 163, "Fiery", 0, "#ff5858"],
    ["Fire", R750, 220, "Fiery", 0, "#eb4c4c"],
    ["Poison", GOutside, 110, "Std", 0, "#b5d09f"],
    ["Poison", GZero, 146, "Std", 0, "#8fb86e"],
    ["Poison", G100, 160, "Poisonous", 0, "#6aa13e"],
    ["Poison", G750, 220, "Poisonous", 0, "#45890e"],
    ["Ice", BOutside, 110, "Std", 0, "#b2bbf2"],
    ["Ice", BZero, 146, "Std", 0, "#8b9aeb"],
    ["Ice", B100, 160, "Icy", 0, "#6578e5"],
    ["Ice", B750, 220, "Icy", 0, "#5567c9"],
    ["Elemental", EleOutside, 80, "Std", 0, "#f2b2eb"],
    ["Elemental", EleZero, 173, "Std", 0, "#eb8be2"],
    ["Elemental", Ele100, 179, "EEC", 0, "#e565d8"],
    ["Elemental", Ele750, 273, "EEC", 0, "#de3ece"],

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
            newSpan.innerHTML = "Type";
            masterDivHeader.appendChild(newSpan);
        }
        {
            const newSpan = document.createElement("span");
            newSpan.classList.add("Header2Span");
            newSpan.style = "background-color: " + greyColor + headerSpanGroupStyle;
            newSpan.innerHTML = "Outside";
            masterDivHeader.appendChild(newSpan);
        }
        {
            const newSpan = document.createElement("span");
            newSpan.classList.add("Header3Span");
            newSpan.style = "background-color: " + aacColor + headerSpanGroupStyle;
            newSpan.innerHTML = "Zero";
            masterDivHeader.appendChild(newSpan);
        }
        {
            const newSpan = document.createElement("span");
            newSpan.classList.add("Header4Span");
            newSpan.style = "background-color: " + mmcColor + headerSpanGroupStyle;
            newSpan.innerHTML = "100+";
            masterDivHeader.appendChild(newSpan);
        }
        {
            const newSpan = document.createElement("span");
            newSpan.classList.add("Header6Span");
            newSpan.style = "background-color: " + greyColor + headerSpanGroupStyle;
            newSpan.innerHTML = "750+";
            masterDivHeader.appendChild(newSpan);
        }
    }
    {
        const newSpan = document.createElement("span");
        newSpan.classList.add("FireSpan");
        newSpan.style = "background-color: " + greyColor + headerSpanLoactionStyle;
        newSpan.innerHTML = "Fire";
        masterDivRow1.appendChild(newSpan);
    }
    for (let i = 0; i < 4; i++) {
        masterDivRow1.appendChild(spans1[i]);
    }
    {
        const newSpan = document.createElement("span");
        newSpan.classList.add("PoisonSpan");
        newSpan.style = "background-color: " + greyColor + headerSpanLoactionStyle;
        newSpan.innerHTML = "Poison";
        masterDivRow1.appendChild(newSpan);
    }
    for (let i = 4; i < 8; i++) {
        masterDivRow1.appendChild(spans1[i]);
    }
    {
        const newSpan = document.createElement("span");
        newSpan.classList.add("IceSpan");
        newSpan.style = "background-color: " + greyColor + headerSpanLoactionStyle;
        newSpan.innerHTML = "Ice";
        masterDivRow2.appendChild(newSpan);
    }
    for (let i = 0; i < 4; i++) {
        masterDivRow2.appendChild(spans2[i]);
    }
    {
        const newSpan = document.createElement("span");
        newSpan.classList.add("ElementalSpan");
        newSpan.style = "background-color: " + greyColor + headerSpanLoactionStyle;
        newSpan.innerHTML = "Elemental";
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

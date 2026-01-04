// ==UserScript==
// @name         MouseHunt HUD Backgroundifier
// @author       LethalVision
// @version      0.4.1
// @description  Change the background of (almost) everything on mousehuntgame.com (But why? What possessed you to seek this out?)
// @include	http://mousehuntgame.com/*
// @include	https://mousehuntgame.com/*
// @include	http://www.mousehuntgame.com/*
// @include	https://www.mousehuntgame.com/*
// @grant        none
// @namespace    https://greasyfork.org/en/users/683695-lethalvision
// @downloadURL https://update.greasyfork.org/scripts/434115/MouseHunt%20HUD%20Backgroundifier.user.js
// @updateURL https://update.greasyfork.org/scripts/434115/MouseHunt%20HUD%20Backgroundifier.meta.js
// ==/UserScript==

// localStorage tag - changing this will break saved preferences!
const TAG = "HUD_BCKGRNDFR";

// Dark mode palette
// TODO: make these customizable?
const DARK_BG_COLOR = "#333333";
const DARK_HL_COLOR = "#494949";
const DARK_TEXT_COLOR = "#EEEEEE";
const DARK_LINK_COLOR = "#99B9FF";

var preferences = {
    hudUrl: "",
    backUrl: "",
    leftUrl: "",
    rightUrl: "",
    statOpacity: 1,
    hudOpacity: 1,
    statShadow: false,
    darkMode: false
};

function init() {
    var loadedPref = window.localStorage.getItem(TAG);
    if (loadedPref){
        try{
            loadedPref = JSON.parse(loadedPref);
            preferences.hudUrl = loadedPref.hudUrl;
            preferences.backUrl = loadedPref.backUrl;
            preferences.leftUrl = loadedPref.leftUrl;
            preferences.rightUrl = loadedPref.rightUrl;
            preferences.statOpacity = loadedPref.statOpacity;
            preferences.hudOpacity = loadedPref.hudOpacity;
            preferences.statShadow = loadedPref.statShadow;
            preferences.darkMode = loadedPref.darkMode;
            console.log("Backgroundifier preferences loaded");
        } catch (err) {
            console.log('Preference parse error: ' + err);
        }
    }
    addListener();
    addButton();
    updateAll();
    setTimeout(function(){
        fixFbBanner();
    }, 600);
}

// stuff preferences into the localStorage
function savePreferences() {
    var jsonString = JSON.stringify(preferences);
    window.localStorage.setItem(TAG, jsonString);
}

function addListener() {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("load", function() {
            if ( this.responseURL === "https://www.mousehuntgame.com/managers/ajax/pages/page.php" ||
               this.responseURL === "https://www.mousehuntgame.com/managers/ajax/pages/preferences.php") {
                addButton();
                updateAll();
            }
        });
        originalOpen.apply(this, arguments);
    };
}

// === SMOKE AND MIRRORS HERE ===
// add button to bring up the settings
function addButton() {
    if (document.getElementById("hudBtn")) {
        // if button already exists
        return;
    }
    const div = document.createElement("div");
    div.className = "hudBtn-container";
    div.style.position = "absolute";
    div.style.bottom = "5px";
    div.style.right = "7px"

    const hudBtn = document.createElement("button");
    hudBtn.id = "hudBtn";
    hudBtn.textContent = "!";
    hudBtn.style.width = "20px"
    hudBtn.style.height = "20px"
    hudBtn.style.opacity = "0.5"
    hudBtn.onclick = function(){renderBox();}

    div.appendChild(hudBtn);
    const hudContainer = document.getElementsByClassName("headsUpDisplayView");
    if (!hudContainer || hudContainer.length != 1) {
        // hudContainer can't be found or the length is unexpected
        return;
    }
    hudContainer[0].insertAdjacentElement("afterend",div);
}

// render the almighty Tsitu's Floating Box
function renderBox(){return new Promise((resolve, reject) => {
    // clear all open boxes
    document
     .querySelectorAll("#hud-options")
     .forEach(el=> el.remove())

    const div = document.createElement("div");
    div.id = "hud-options";
    div.style.backgroundColor = "#F5F5F5";
    div.style.position = "fixed";
    div.style.zIndex = "9999";

    div.style.left = "35vw";
    div.style.top = "55vh";

    div.style.border = "solid 3px #696969";
    div.style.borderRadius = "20px";
    div.style.padding = "10px";
    div.style.textAlign = "left";
    div.style.minWidth = "207px";

    const buttonDiv = document.createElement("div");
    buttonDiv.style.float= "right";
    buttonDiv.style.textAlign = "right";
    const closeButton = document.createElement("button", {
        id: "close-button"
    });
    closeButton.textContent = "x";
    closeButton.onclick = function () {
    document.body.removeChild(div);
    };
    closeButton.style.marginRight = "5px"

    const titleDiv = document.createElement("div")
    titleDiv.id = "hud-optionsheader";
    titleDiv.textContent = "HUD Backgroundifier";
    titleDiv.style.width = "75%";
    titleDiv.style.float= "left";
    titleDiv.style.textAlign = "left";
    titleDiv.style.fontSize = "12px"
    titleDiv.style.fontWeight = "bold";
    titleDiv.style.marginLeft = "5px";

    const urlDiv = document.createElement("div")
    urlDiv.className = "clear"
    urlDiv.textContent = "Image URLs";
    urlDiv.style.fontWeight = "bold";
    urlDiv.style.textAlign = "left";
    urlDiv.style.marginTop = "5px";
    urlDiv.style.marginLeft = "5px";

    var urlTable = document.createElement('table');
    urlTable.style.textAlign = "left";
    urlTable.style.borderSpacing = "1em 0";
    urlTable.style.paddingTop = "5px"

    var topRow = urlTable.insertRow();
    topRow.style.height = "24px";
    var topDesc = topRow.insertCell(0);
    topDesc.appendChild(document.createTextNode("HUD background:"));
    // set width once and the rest should follow
    topDesc.style.width = "35%"
    var urlInput = document.createElement('input');
    urlInput.id = "urlInput";
    urlInput.style.width = "95%";
    urlInput.value = preferences.hudUrl;
    urlInput.onchange = function(){
        checkAndLoadImage("hud", urlInput.value);
    }
    topRow.insertCell(1).appendChild(urlInput);

    var backRow = urlTable.insertRow();
    backRow.style.height = "24px";
    var backDesc = backRow.insertCell(0);
    backDesc.appendChild(document.createTextNode("Camp background:"));
    var backInput = document.createElement('input');
    backInput.id = "backInput";
    backInput.style.width = "95%";
    backInput.value = preferences.backUrl;
    backInput.onchange = function(){
        checkAndLoadImage("back", backInput.value);
    }
    backRow.insertCell(1).appendChild(backInput);

    var leftRow = urlTable.insertRow();
    leftRow.style.height = "24px";
    var leftDesc = leftRow.insertCell(0);
    leftDesc.appendChild(document.createTextNode("Left screen background:"));
    var leftInput = document.createElement('input');
    leftInput.id = "leftInput";
    leftInput.style.width = "95%";
    leftInput.value = preferences.leftUrl;
    leftInput.onchange = function(){
        checkAndLoadImage("left", leftInput.value);
    }
    leftRow.insertCell(1).appendChild(leftInput);

    var rightRow = urlTable.insertRow();
    rightRow.style.height = "24px";
    var rightDesc = rightRow.insertCell(0);
    rightDesc.appendChild(document.createTextNode("Right screen background:"));
    var rightInput = document.createElement('input');
    rightInput.id = "rightInput";
    rightInput.style.width = "95%";
    rightInput.value = preferences.rightUrl;
    rightInput.onchange = function(){
        checkAndLoadImage("right", rightInput.value);
    }
    rightRow.insertCell(1).appendChild(rightInput);

    const opDiv = document.createElement("div")
    opDiv.textContent = "Transparency Settings";
    opDiv.style.fontWeight = "bold";
    opDiv.style.textAlign = "left";
    opDiv.style.marginTop = "5px";
    opDiv.style.marginLeft = "5px";

    var opTable = document.createElement('table');
    opTable.style.textAlign = "left";
    opTable.style.borderSpacing = "1em 0";
    opTable.style.paddingTop = "5px"

    var statOpRow = opTable.insertRow();
    statOpRow.style.height = "24px";
    var statDesc = statOpRow.insertCell(0);
    statDesc.appendChild(document.createTextNode("Hunter Stats:"));
    // set width once and the rest should follow
    statDesc.style.width = "20%"
    var statSlider = document.createElement('input');
    statSlider.id = "statSlider";
    statSlider.type = "range"
    statSlider.style.width = "95%";
    statSlider.style.verticalAlign = "middle";
    // this is where I should use some fancy function to handle the conversion for each slider instead of just copy/pasting it twice
    // but it's 3AM and I'm in physical pain
    statSlider.value = preferences.statOpacity*100;
    statSlider.onchange = function(){
        preferences.statOpacity = statSlider.value/100.0;
        updateOpacity()
    }
    statOpRow.insertCell(1).appendChild(statSlider);

    var hudOpRow = opTable.insertRow();
    hudOpRow.style.height = "24px";
    var hudDesc = hudOpRow.insertCell(0);
    hudDesc.appendChild(document.createTextNode("Location HUD:"));
    // set width once and the rest should follow
    hudDesc.style.width = "20%"
    var hudSlider = document.createElement('input');
    hudSlider.id = "hudSlider";
    hudSlider.type = "range"
    hudSlider.style.width = "95%";
    hudSlider.style.verticalAlign = "middle";
    hudSlider.value = preferences.hudOpacity*100;
    hudSlider.onchange = function(){
        preferences.hudOpacity = hudSlider.value/100.0;
        updateOpacity()
    }
    hudOpRow.insertCell(1).appendChild(hudSlider);

    const miscDiv = document.createElement("div")
    miscDiv.textContent = "Misc Settings";
    miscDiv.style.fontWeight = "bold";
    miscDiv.style.textAlign = "Left";
    miscDiv.style.marginTop = "5px";
    miscDiv.style.marginLeft = "5px";

    var shadowLabel = document.createElement("label");
    shadowLabel.textContent = "Darken hunter stat background";
    shadowLabel.style.textAlign = "left";
    shadowLabel.style.marginLeft = "10px";
    var shadowCheckbox = document.createElement('input');
    shadowCheckbox.id = "shadowCheckbox";
    shadowCheckbox.style.height = "24px";
    shadowCheckbox.style.verticalAlign = "middle";
    shadowCheckbox.type = "checkbox"
    shadowCheckbox.checked = preferences.statShadow;
    shadowCheckbox.onchange = function(){
        preferences.statShadow = shadowCheckbox.checked;
        updateShadow();
    }
    shadowLabel.appendChild(shadowCheckbox);

    var darkLabel = document.createElement("label");
    darkLabel.textContent = "Dark Mode (experimental)";
    darkLabel.style.textAlign = "left";
    darkLabel.style.marginLeft = "10px";
    var darkCheckbox = document.createElement('input');
    darkCheckbox.id = "darkCheckbox";
    darkCheckbox.style.height = "24px";
    darkCheckbox.style.verticalAlign = "middle";
    darkCheckbox.type = "checkbox"
    darkCheckbox.checked = preferences.darkMode;
    darkCheckbox.onchange = function(){
        preferences.darkMode = darkCheckbox.checked;
        updateDarkMode();
    }
    darkLabel.appendChild(darkCheckbox);

    buttonDiv.appendChild(closeButton);
    div.appendChild(titleDiv);
    div.appendChild(buttonDiv)
    div.appendChild(urlDiv);
    div.appendChild(urlTable);
    div.appendChild(opDiv);
    div.appendChild(opTable);
    div.appendChild(miscDiv);
    div.appendChild(shadowLabel);
    div.appendChild(darkLabel);
    document.body.appendChild(div);
    // why does this exist
    dragElement(div);
    resolve();
})}

// === Tsitu's drag magic functions ===
// no seriously this should be a library or something
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// === Main logic ===

// the whole script boils down to calling this function a million times
// so don't touch this
function modifyElement(element, portion, value){
    var replaceElem;
    // check if it's a HTMLCollection/NodeList/Array/whatever
    if (element.length) {
        if (element.length == 0) {
            // silently skip empty containers
            return;
        }
        // unpack with RECURSION
        for (var i=0; i<element.length; i++) modifyElement(element[i], portion, value);
        return;
    }
    // single element
    replaceElem = element;
    try {
        replaceElem.style[portion] = value;
    } catch (err) {
        // very spammy so for now this will just silently consume errors
        // TODO: debug mode logging?
        //console.log('modifyElement error: ' + err);
    }
}

async function checkAndLoadImage(portion, url) {
    var imgUrl;
    if (url){
        // check if url is a valid image
        let imgPromise = new Promise(function(resolve) {
            try{
                var img = new Image();
                img.onload = function(){
                    resolve(this.width != 0 && this.height != 0)
                };
                img.src = url;
            } catch (error) {
                console.error(error.stack);
                resolve(false);
            }
        });
        var validImage = await imgPromise;
        imgUrl = validImage ? url : "";
    } else {
        imgUrl = "";
    }
    switch(portion) {
        case "hud":
            preferences.hudUrl = imgUrl;
            break;
        case "back":
            preferences.backUrl = imgUrl;
            break;
        case "left":
            preferences.leftUrl = imgUrl;
            break;
        case "right":
            preferences.rightUrl = imgUrl;
            break;
        default:
            console.log("checkAndLoadImage(): invalid portion");
    }
    savePreferences();
    updateImg(portion);
}

// Update HUD background
function updateImg(portion) {
    var target;
    var bgString;
    var url;
    // set the variables
    // YEAH HARDCODING
    switch(portion) {
        case "hud":
            target = document.getElementsByClassName("mousehuntHud-marbleDrawer");
            bgString = `url(https://www.mousehuntgame.com/images/ui/hud/mousehuntHudPedestal.gif?asset_cache_version=2) -37px 0 no-repeat,
        url(https://www.mousehuntgame.com/images/ui/hud/mousehuntHudPedestal.gif?asset_cache_version=2) 723px 0 no-repeat,
        url(${preferences.hudUrl}) bottom center / 100%`;
            url = preferences.hudUrl;
            break;
        case "back":
            target = document.getElementById("mousehuntContainer");
            bgString = `url(${preferences.backUrl}) repeat-y center / 100%`;
            // special handling for journal back - it should only be applied on the camp page.
            if (window.location.href.includes("camp.php")) {
                url = preferences.backUrl;
            } else {
                url = "";
            }
            break;
        case "left":
            target = document.getElementsByClassName("pageFrameView-column left");
            bgString = `url(${preferences.leftUrl})`;
            url = preferences.leftUrl;
            break;
        case "right":
            target = document.getElementsByClassName("pageFrameView-column right");
            bgString = `url(${preferences.rightUrl})`;
            url = preferences.rightUrl;
            break;
        default:
            updateImg("hud");
            updateImg("back");
            updateImg("left");
            updateImg("right");
            return;
    }
    // actually replace stuff
    if (url) {
        modifyElement(target, "background", bgString);
    } else {
        modifyElement(target, "background", "");
    }
}

// update transparency
function updateOpacity() {
    savePreferences();
    const statsElem = document.getElementsByClassName("headsUpDisplayView-stats");
    const hudElem = document.getElementsByClassName("hudLocationContent");

    modifyElement(statsElem, "opacity", preferences.statOpacity);
    modifyElement(hudElem, "opacity", preferences.hudOpacity);
}

// update stat shading
function updateShadow() {
    savePreferences();
    const statsElem = document.getElementsByClassName("headsUpDisplayView-stats");
    if (preferences.statShadow) {
        // set background to black with 0.3 opacity
        modifyElement(statsElem, "backgroundColor", "rgba(0, 0, 0, 0.30)");
    } else {
        modifyElement(statsElem, "backgroundColor", "");
    }
}

// experimental dark mode
function updateDarkMode() {
    savePreferences();
    const darkBgArray = [document.getElementById("overlayContainer"), document.getElementsByClassName("pageFrameView-contentContainer"),
                         document.getElementsByClassName("mousehuntHeaderView"),document.getElementsByClassName("pageSidebarView")];
    const whiteBgArray = [document.getElementById("mousehuntContainer"),
                          document.getElementsByClassName("mousehuntHeaderView-newsTicker"), document.getElementsByClassName("ticker")];
    const textArray = [document.getElementsByClassName("pageSidebarView-user"), document.getElementsByClassName("pageSidebarView-block-description"),
                       document.getElementsByClassName("communityGroupView-ad-groupDescription"), document.getElementsByClassName("pageSidebarView-title"),
                       document.querySelectorAll(".scoreboardRelativeRankingTableView-table th"),
                       document.querySelectorAll(".scoreboardRelativeRankingTableView-table td:first-child"),
                       document.querySelectorAll(".scoreboardRelativeRankingTableView-table td:last-child")];
    const linkArray = [document.querySelectorAll(".pageFrameView-footer-links a"), document.querySelectorAll(".pageSidebarView-user a"),
                       document.querySelectorAll(".communityGroupView-ad a"), document.querySelectorAll(".scoreboardRelativeRankingTableView-table a")];
    const hlArray = document.querySelectorAll(".scoreboardRelativeRankingTableView-table .highlight");
    const tables = document.getElementsByClassName("scoreboardRelativeRankingTableView-table");

    if (preferences.darkMode) {
        // recolor backgrounds
        darkBgArray.forEach(element => modifyElement(element, "backgroundColor", DARK_BG_COLOR));
        whiteBgArray.forEach(element => modifyElement(element, "backgroundColor", "white"));
        textArray.forEach(element => modifyElement(element, "color", DARK_TEXT_COLOR));
        linkArray.forEach(element => modifyElement(element, "color", DARK_LINK_COLOR));
        modifyElement(document.getElementsByClassName("pageFrameView-column left"), "borderRightColor", DARK_BG_COLOR);
        modifyElement(document.getElementsByClassName("pageFrameView-column right"), "borderLeftColor", DARK_BG_COLOR);
        modifyElement(document.getElementsByClassName("pageSidebarView-user"), "borderBottom", `5px solid ${DARK_BG_COLOR}`);
        modifyElement(hlArray, "backgroundColor", DARK_HL_COLOR);
        modifyElement(tables, "borderBottom", "2px solid #ddedff");
    } else {
        // clear all
        darkBgArray.forEach(element => modifyElement(element, "backgroundColor", ""));
        whiteBgArray.forEach(element => modifyElement(element, "backgroundColor", ""));
        textArray.forEach(element => modifyElement(element, "color", ""));
        linkArray.forEach(element => modifyElement(element, "color", ""));
        modifyElement(document.getElementsByClassName("pageFrameView-column left"), "borderRightColor", "");
        modifyElement(document.getElementsByClassName("pageFrameView-column right"), "borderLeftColor", "");
        modifyElement(document.getElementsByClassName("pageSidebarView-user"), "borderBottom", "");
        modifyElement(hlArray, "backgroundColor", "");
        modifyElement(tables, "borderBottom", "");
    }
}

function fixFbBanner(){
    // FINALLY, A WORTHY OPPONENT
    // OUR BATTLE WILL BE LEGENDARY!
    modifyElement(document.getElementsByClassName("fb-page fb_iframe_widget"), "borderBottom", "1px solid #ebedf0");
    modifyElement(document.getElementsByClassName("fb-page fb_iframe_widget"), "height", "100%");
}

function updateAll() {
    updateImg();
    updateOpacity();
    updateShadow();
    updateDarkMode();
    fixFbBanner()
}
// start the script
init();

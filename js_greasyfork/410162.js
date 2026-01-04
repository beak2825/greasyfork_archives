// ==UserScript==
// @name         MouseHunt Custom Themes
// @author       LethalVision
// @version      1.2.3
// @description  Change your hunter's journal to use custom themes (only works locally)
// @include	http://mousehuntgame.com/*
// @include	https://mousehuntgame.com/*
// @include	http://www.mousehuntgame.com/*
// @include	https://www.mousehuntgame.com/*
// @grant        none
// @namespace    https://greasyfork.org/en/users/683695-lethalvision
// @downloadURL https://update.greasyfork.org/scripts/410162/MouseHunt%20Custom%20Themes.user.js
// @updateURL https://update.greasyfork.org/scripts/410162/MouseHunt%20Custom%20Themes.meta.js
// ==/UserScript==

const TAG = "CUST_THEME"
var topUrl = "";
var midUrl = "";
var botUrl = "";
// true = tile mid image, false = stretch
const tileMid = true;

const defaultThemes = {
    "None":{description:"None", links:[]},
    "VR":{description:"Valour Rift by wayew",
         links:["https://cdn.discordapp.com/attachments/487964004162207745/751107541764800672/non_UU_theme.png",
               "https://cdn.discordapp.com/attachments/487964004162207745/748804207171207238/middle_non_UU.png",
               "https://cdn.discordapp.com/attachments/487964004162207745/748804197306073149/bottom_non_UU.png"]},
    "VR_A":{description:"Valour Rift (animated) by wayew & Wellker",
         links:["https://cdn.discordapp.com/attachments/487964004162207745/748810922642112583/lightning_non_UU_gif_cut.gif",
               "https://cdn.discordapp.com/attachments/487964004162207745/748804207171207238/middle_non_UU.png",
               "https://cdn.discordapp.com/attachments/487964004162207745/748804197306073149/bottom_non_UU.png"]},
    "UU":{description:"Ultimate Umbra by wayew",
          links:["https://cdn.discordapp.com/attachments/487964004162207745/748528376750407750/top.png",
                 "https://cdn.discordapp.com/attachments/487964004162207745/756163238768410644/UU_theme_mid.png",
                 "https://cdn.discordapp.com/attachments/487964004162207745/748569283591798864/bottom.png"]},
    "UU_A":{description:"Ultimate Umbra (animated) by wayew & Wellker",
            links:["https://cdn.discordapp.com/attachments/487964004162207745/748572650237853736/UU_theme_top_gif.gif",
                   "https://cdn.discordapp.com/attachments/487964004162207745/756163238768410644/UU_theme_mid.png",
                   "https://cdn.discordapp.com/attachments/487964004162207745/748569283591798864/bottom.png"]},
    "CT_A":{description:"Crystal Theme (animated) by Wellker",
            links:["https://cdn.discordapp.com/attachments/487964004162207745/749338680295948428/Crystal_Theme_Top.gif",
                   "https://cdn.discordapp.com/attachments/487964004162207745/756164045291389029/Crystal_theme_middle.png",
                   "https://cdn.discordapp.com/attachments/487964004162207745/749332702188142693/Crystal_theme_bot.png"]},
    "SH":{description:"Shrine Theme by Wellker",
            links:["https://cdn.discordapp.com/attachments/487964004162207745/898641949676957706/Sacred_shrine_top.png",
                   "https://cdn.discordapp.com/attachments/487964004162207745/898642019956711434/Shrine_mid.png",
                   "https://cdn.discordapp.com/attachments/487964004162207745/898642043239272580/shrine_bottom.png"]},
    "SH_A":{description:"Shrine Theme (animated) by Wellker",
            links:["https://cdn.discordapp.com/attachments/487964004162207745/898641930269892638/Sacred_Shrine_top_Animated.gif",
                   "https://cdn.discordapp.com/attachments/487964004162207745/898642019956711434/Shrine_mid.png",
                   "https://cdn.discordapp.com/attachments/487964004162207745/898642043239272580/shrine_bottom.png"]},
    "Custom":{description:"Custom", links:[]}
};

const imgSizes = {
    top:{width:0, height:0, loaded:false},
    mid:{width:0, height:0, loaded:false},
    bot:{width:0, height:0, loaded:false}
};

var preferences = {
    selection: "None",
    topUrl: "",
    midUrl: "",
    botUrl: ""
};

function init() {
    var loadedPref = window.localStorage.getItem(TAG);
    if (loadedPref){
        try{
            loadedPref = JSON.parse(loadedPref);
            console.log('Loaded preference: ' + loadedPref.selection);
            preferences.selection = loadedPref.selection;
            preferences.topUrl = loadedPref.topUrl;
            preferences.midUrl = loadedPref.midUrl;
            preferences.botUrl = loadedPref.botUrl;
        } catch (err) {
            console.log('Preference parse error: ' + err);
        }
    }
    addListener();
    loadUrls(preferences.selection);
}

function loadUrls(selection) {
    if (selection == "Custom"){
        topUrl = preferences.topUrl;
        midUrl = preferences.midUrl;
        botUrl = preferences.botUrl;
        loadImageSize("top", topUrl);
        loadImageSize("mid", midUrl);
        loadImageSize("bot", botUrl);
    } else if (defaultThemes.hasOwnProperty(selection) && defaultThemes[selection].links.length == 3){
        topUrl = defaultThemes[selection].links[0];
        midUrl = defaultThemes[selection].links[1];
        botUrl = defaultThemes[selection].links[2];
        loadImageSize("top", topUrl);
        loadImageSize("mid", midUrl);
        loadImageSize("bot", botUrl);
    } else {
        topUrl = "";
        midUrl = "";
        botUrl = "";
        // no need to load theme
    }
}

function addListener() {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("load", function() {
            if ( this.responseURL === "https://www.mousehuntgame.com/managers/ajax/pages/page.php") {
                updateTheme();
                updateSelector();
            } else if (this.responseURL === "https://www.mousehuntgame.com/managers/ajax/users/journal_theme.php") {
                updateSelector();
                updateCheckboxes();
                // add interface on first load
                addInterface(true);
            }
        });
        originalOpen.apply(this, arguments);
    };
}

function loadImageSize(portion, url){
    if (url == null || url.length == 0){
        return;
    }
    var img = new Image();
    img.onload = function(){
        setSize(portion, this.width, this.height);
    };
    img.src = url;
}

function setSize(portion, width, height){
    console.log(`${portion}: ${width}, ${height}`);
    switch(portion){
        case "top":
            imgSizes.top.width = width;
            imgSizes.top.height = height;
            imgSizes.top.loaded = true;
            break;
        case "mid":
            imgSizes.mid.width = width;
            imgSizes.mid.height = height;
            imgSizes.mid.loaded = true;
            break;
        case "bot":
            imgSizes.bot.width = width;
            imgSizes.bot.height = height;
            imgSizes.bot.loaded = true;
            break;
        default:
            console.log(`setSize unrecognized portion: ${portion}`);
            return;
    }
    if (imgSizes.top.loaded && imgSizes.mid.loaded && imgSizes.bot.loaded) {
        // all images loaded successfully, apply to theme
        updateTheme();
    }
}

function updateSelector(){
    var updateLink = function(link){
        if (link.getAttribute('attached')){
            // check if the link is already tagged
            return;
        }
        link.addEventListener("click", function(){
            updateCheckboxes();
            addInterface(true);
        });
        // tag the link
        link.setAttribute('attached', true);
    };
     // append new event to all links that bring up the theme selector
    [].forEach.call(document.getElementsByClassName('campPage-tabs-journal-theme'), updateLink);
    [].forEach.call(document.getElementsByClassName('journalContainer-selectTheme'), updateLink);
}

function updateCheckboxes() {
    // get those pesky checkboxes
    // this reapplies the onclick modification on the checkboxes after a short delay as the entire theme selector seems to be recreated upon clicking the checkboxes
    var checkboxes = document.getElementsByClassName('journalThemeSelectorView-filter');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].getElementsByTagName("input")[0].onclick = function(){
            setTimeout(function(){
                updateCheckboxes();
                addInterface(false);
            }, 50);
        };
    }
}

function addInterface(forceTab){
    // make sure the theme selector exists
    var parent = document.getElementsByClassName('journalThemeSelectorView-tagContainer');
    if (parent.length == 0){
        return;
    } else {
        parent = parent[0];
    }

    // force tab to "General" if there is an active custom theme
    if (forceTab && preferences.selection != "None"){
        var tabs = document.getElementsByClassName('mousehuntTabHeader');
        for (var i = 0; i < tabs.length; i++) {
            // find and click the "General" tab
            if (tabs[i].getAttribute("data-tab") == "misc") {
                tabs[i].onclick();
            }
        }
    }

    if (document.getElementById('customThemeMain')){
        // if the mainDiv already exists, exit
        return;
    }

    const mainDiv = document.createElement('div');
    mainDiv.id = "customThemeMain";

    // setup title
    var titleDiv = document.createElement('div');
    titleDiv.innerHTML = "<b>Custom Themes</b>";
    titleDiv.style.height = "17px";

    // a horizontal line. Was this really necessary? Nope.
    // it's here anyway so y'all better appreciate it
    var lineDiv = document.createElement('div');
    lineDiv.style.height = "1px";
    lineDiv.style.backgroundColor = "black";

    var descDiv = document.createElement('div');
    descDiv.innerHTML = "Apply custom themes to your Hunter's Journal. Note that these changes are local - only you can see this!";
    descDiv.style.height = "34px";
    descDiv.style.marginTop = "3px";
    descDiv.style.marginRight = "3px";

    mainDiv.appendChild(titleDiv);
    mainDiv.appendChild(lineDiv);
    mainDiv.appendChild(descDiv);

    // setup selector
    var themeDiv = document.createElement('div');
    themeDiv.style.height = "24px";
    var themeSelect = document.createElement('select');
    themeSelect.id = "selectTheme";
    themeSelect.style.width = "75%"
    // iterate through defaultThemes to add options to select
    for (var key in defaultThemes) {
        if (defaultThemes.hasOwnProperty(key)) {
            themeSelect.options[themeSelect.options.length] = new Option(defaultThemes[key].description, key);
        }
    }
    // set current option to selected theme
    themeSelect.value = preferences.selection;
    themeSelect.onchange = function() {
        var customDiv = document.getElementById('customDiv')
        if (document.getElementById('selectTheme').value == "Custom") {
            customDiv.style.display = "block";
        } else {
            customDiv.style.display = "none";
        }
    }
    themeDiv.appendChild(themeSelect);
    mainDiv.appendChild(themeDiv);

    // setup input UI for Custom themes
    var customDiv = document.createElement('div');
    customDiv.id = "customDiv";
    customDiv.style.marginTop = "10px";
    customDiv.style.marginBottom = "10px";

    var detailDiv = document.createElement('div');
    detailDiv.style.height = "34px";
    detailDiv.innerHTML = "Set images for your custom theme here: images must be provided as URLs, <i>local images will not work.</i>";
    customDiv.appendChild(detailDiv);

    var warningDiv = document.createElement('div');
    warningDiv.style.height = "34px";
    warningDiv.innerHTML = "<b>Please check that the URLs link to images before loading them!</b>".fontcolor("red");
    customDiv.appendChild(warningDiv);

    var customTable = document.createElement('table');
    customTable.style.width = "100%";
    descDiv.style.marginRight = "3px";
    customDiv.appendChild(customTable);

    var topRow = customTable.insertRow();
    topRow.style.height = "24px";
    var topDesc = topRow.insertCell(0);
    topDesc.appendChild(document.createTextNode("Top"));
    // set width once and the rest should follow
    topDesc.style.width = "20%"
    var topUrlInput = document.createElement('input');
    topUrlInput.id = "topInput";
    topUrlInput.style.width = "95%";
    topUrlInput.value = preferences.topUrl;
    topRow.insertCell(1).appendChild(topUrlInput);

    var midRow = customTable.insertRow();
    midRow.style.height = "24px";
    midRow.insertCell(0).appendChild(document.createTextNode("Middle"));
    var midUrlInput = document.createElement('input');
    midUrlInput.id = "midInput";
    midUrlInput.style.width = "95%";
    midUrlInput.value = preferences.midUrl;
    midRow.insertCell(1).appendChild(midUrlInput);

    var botRow = customTable.insertRow();
    botRow.style.height = "24px";
    botRow.insertCell(0).appendChild(document.createTextNode("Bottom"));
    var botUrlInput = document.createElement('input');
    botUrlInput.id = "botInput";
    botUrlInput.style.width = "95%";
    botUrlInput.value = preferences.botUrl;
    botRow.insertCell(1).appendChild(botUrlInput);

    mainDiv.appendChild(customDiv);

    // setup buttons
    var buttonDiv = document.createElement("div");
    buttonDiv.style.marginTop = "5px";

    var loadButton = document.createElement("button");
    loadButton.textContent = "Load Theme";
    loadButton.onclick = savePreferences;
    buttonDiv.appendChild(loadButton);

    var clearButton = document.createElement("button");
    clearButton.textContent = "Clear Preferences";
    clearButton.style.marginLeft = "5px";
    clearButton.onclick = clearPreferences;
    buttonDiv.appendChild(clearButton);

    mainDiv.appendChild(buttonDiv);

    // add the whole UI to theme dialog
    parent.appendChild(mainDiv);

    // trigger onchange on themeSelect to set the display attribute correctly on first load
    themeSelect.onchange();
}

function savePreferences() {
    var selectorElem = document.getElementById('selectTheme');
    var selectValue = selectorElem.value;
    // store preference
    preferences.selection = selectValue;
    if (selectValue == "Custom") {
        preferences.topUrl = document.getElementById('topInput').value;
        preferences.midUrl = document.getElementById('midInput').value;
        preferences.botUrl = document.getElementById('botInput').value;
    }
    var jsonString = JSON.stringify(preferences);
    window.localStorage.setItem(TAG, jsonString);
    window.location.reload(false);
}

function clearPreferences() {
    localStorage.removeItem(TAG);
    window.location.reload(false);
}

function updateJournal(journalElem, url, imgSize) {
    // calculate proper height
    var elemWidth = journalElem.clientWidth;
    var elemHeight = journalElem.clientHeight;
    if (elemWidth == 0 || elemHeight == 0){
        return;
    }
    var newHeight = parseInt(imgSize.height * ((elemWidth*1.0)/ imgSize.width));
    //console.log(`newHeight ${journalElem.className}: ${newHeight}px`);

    journalElem.style.height = `${newHeight}px`;
    journalElem.style.backgroundImage = `url('${url}')`;
    // use automatic height
    journalElem.style.backgroundSize = "100% auto";
}

function updateTheme() {
    if (imgSizes.top.width == 0 || imgSizes.top.height == 0 ||
        imgSizes.mid.width == 0 || imgSizes.mid.height == 0 ||
        imgSizes.bot.width == 0 || imgSizes.bot.height == 0){
        // skip update if image load failed for any of the images
        return;
    }
    // "Set Journal Theme" container on camp page
    var campJournalLinks = document.getElementsByClassName("journal-detailLinkContainer");
    // "Set Journal Theme" container on own profile page (it looks broken as of MouseHunt v3.2-86955, will probably be fixed soon - and break this script again.)
    var profileJournalLinks = document.getElementsByClassName("campPage-tabs-journal-link-container");
    if (campJournalLinks.length == 0 && profileJournalLinks.length == 0 && !window.location.href.includes("journal.php")) {
        // proceed if "Set Journal Theme" is found or on "journal.php", skip update otherwise
        // i.e. don't update theme on other people's profiles
        return;
    }

    var themeTop = document.getElementById('journalContainer').children[0];
    var themeMid = document.getElementById('journalContainer').children[1];
    var themeBot = document.getElementById('journalContainer').children[2];

    updateJournal(themeTop, topUrl, imgSizes.top);
    updateJournal(themeBot, botUrl, imgSizes.bot);
    // manually update mid as it needs to be handled differently
    themeMid.style.backgroundColor = "#F2F2F2";
    themeMid.style.backgroundImage = `url('${midUrl}')`;
    if (tileMid){
        themeMid.style.backgroundSize = "100% auto"
    } else {
        themeMid.style.backgroundSize = "100% 100%";
    }
}

function addEvent(element, eventName, fn) {
    if (element.addEventListener){
        element.addEventListener(eventName, fn, false);
    }
    else if (element.attachEvent){
        element.attachEvent('on' + eventName, fn);
    }
}

// init script on load, use addEvent to preserve onLoad events
//addEvent(window, 'load', function(){ init() });
init();

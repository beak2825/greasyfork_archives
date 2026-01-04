// ==UserScript==
// @name         Torn Healers
// @namespace    FoaR`en
// @version      0.8
// @description  Display only valid members to revive.
// @author       FoaR`en
// @homepage     https://greasyfork.org/en/scripts/407784-torn-healers
// @match        https://www.torn.com/factions.php?step=profile&ID=*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/407784/Torn%20Healers.user.js
// @updateURL https://update.greasyfork.org/scripts/407784/Torn%20Healers.meta.js
// ==/UserScript==
'use strict';


// local storage pre-ID
const storageLBL = 'rev_fac:';
// Elements IDs
const warModeID = 'war-mode';
const descID = 'fac-desc-cb';
const warID = 'fac-war-cb';
const bannerID = 'fac-banner-cb';
const autoRefreshID = 'fac-page-cb';
const hospitalTimeID = 'fac-hosp-text';

// Options: Offline, Online, Idle
const showPlayers = ['Online'];
const showPlayerAtStatus = 'Hospital';

// Faster access to classes in document
const factionBody = document.getElementById('factions');

// Get player list
(function searchPlayers() {
    setTimeout(function() {
        var list = factionBody.getElementsByClassName('members-list');
        var players = list[0].children[1].children; // Changed last update
        if(players.length <= 1) {
            searchPlayers();
        } else {
            createButtons();
            if (Number(localStorage.getItem(storageLBL + warModeID))) {
                showValidPlayers(players);
                loadSettings();
                list[0].children[0].getElementsByClassName('table-cell position')[0].innerHTML = 'Hospital Time';
            }
        }
    }, 100);
})();

// show only player that valid to display
function showValidPlayers(players) {
    var i;
    var len = players.length;
    var playersAvailable = len;
    for(i = 0; i < len; i++) {
        if (!isValidPlayer(players[i])) {
            hideElement(players[i], true);
            playersAvailable--;
        }
    }
    // Refresh the page if needed
    if (Number(localStorage.getItem(storageLBL + autoRefreshID)) && playersAvailable < 1) {
        location.reload();
    }
}

// return true if the player status is as required
function isValidPlayer(player) {
    var minHospTime = localStorage.getItem(storageLBL + hospitalTimeID);
    var isValid = false;
    var playerActivity = player.getElementsByClassName('iconShow')[0];
    var playerStatus = player.getElementsByClassName('status')[0];
    if (playerStatus.innerText.indexOf(showPlayerAtStatus) != -1) {
        // See if the player is online\idle\offline and hospital time is above the requested to hide\display him
        isValid = showPlayers.some((value) => {
            return playerActivity.title.indexOf(value) != -1;
        }) && getHospTime(player) > minHospTime;
    }
    return isValid;
}

function hideBanner(toHide) {
    hideElement(factionBody.getElementsByClassName('faction-info-wrap another-faction')[0], toHide);
}

function hideWar(toHide) {
    hideElement(document.getElementById('war-react-root'), toHide);
}

function hideDescription(toHide) {
    hideElement(factionBody.getElementsByClassName('title-black m-top10 title-toggle tablet top-round faction-title active')[0], toHide); // Desc title
    hideElement(factionBody.getElementsByClassName('cont-gray10 bottom-round cont-toggle faction-description text-a-center')[0], toHide); // Desc it self
}

// show/hide a specific element
function hideElement(element, hide) {
    if (hide == true) {
    element.style.display = 'none';
    } else {
    element.style.display = 'block';
    }
}

// Get hosp time of a player - 6am didn't sleep yet, don't know what I'm doing
function getHospTime(player) {
    // Get time in minutes
    var icons = player.getElementsByClassName('big svg')[1];
    var startIndex = icons.innerHTML.indexOf("data-time='") + "data-time='".length;
    var endIndex = icons.innerHTML.indexOf("'", startIndex);
    var timeInMinutes = icons.innerHTML.slice(startIndex, endIndex) / 60;
    // Update the time in the list
    player.getElementsByClassName('table-cell position')[0].innerHTML = Math.ceil(timeInMinutes) + " Minutes";

    return Number(timeInMinutes);
}

// Load settings from local storage to show/hide elements
function loadSettings() {
    if (Number(localStorage.getItem(storageLBL + bannerID))) {
        hideBanner(true);
    } else {
        hideBanner(false);
    }
    if (Number(localStorage.getItem(storageLBL + warID))) {
        hideWar(true);
    } else {
        hideWar(false);
    }
    if (Number(localStorage.getItem(storageLBL + descID))) {
        hideDescription(true);
    } else {
        hideDescription(false);
    }
}


// Create all the top buttons to hide/show elements on click
function createButtons() {
    var body = document.getElementById("skip-to-content");
    body.innerHTML = '';

    // Create the war checkbox
    var warModeBtn = createButton(warModeID, false, "War Mode:");
    body.appendChild(warModeBtn);

    if (Number(localStorage.getItem(storageLBL + warModeID))) {

        // Create the auto refresh checkbox
        var pageRefreshBtn = createButton(autoRefreshID, false, "AUTO REFRESH:");
        pageRefreshBtn.alt = 'this is alt text';

        // Banner - Create banner button
        var facBannerBtn = createCheckBox(bannerID, true);
        var facBannerLabel = createLabel("HIDE FACTION BANNER:");
        facBannerLabel.appendChild(facBannerBtn);

        // War - Create War button
        var facWarBtn = createCheckBox(warID, true);
        var facWarLabel = createLabel("HIDE FACTION WAR:");
        facWarLabel.appendChild(facWarBtn);

        // Description - Create Description button
        var facDescBtn = createCheckBox(descID, true);
        var facDescLabel = createLabel("HIDE FACTION DESC:");
        facDescLabel.appendChild(facDescBtn);

        // None - Group all the buttons into one element
        var settingsMenu = document.createElement('div');
        settingsMenu.style = "padding:0 14px; max-height: 0; overflow: hidden; transition: max-height 0.2s ease-out; background-color: #efefef;";
        settingsMenu.appendChild(facBannerLabel);
        settingsMenu.appendChild(facWarLabel);
        settingsMenu.appendChild(facDescLabel);


        // Settings - Create a button to show/hide all the settings
        var col = document.createElement('Button');
        col.style = "color: #333; cursor: pointer; padding: 14px; border: none; outline: none; display: block; background-color: #f2f2f2;";
        col.innerHTML = 'Settings';
        col.addEventListener('click', function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight != '0px'){
                content.style.maxHeight = '0px';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });


        if (!localStorage.getItem(storageLBL + hospitalTimeID)) {
            localStorage.setItem(storageLBL + hospitalTimeID, 60);
        }
        var hospTimeInput = createButton(hospitalTimeID, false, );
        hospTimeInput.style.padding = '12px'; //fixed padding
        hospTimeInput.innerHTML = "Min Hospital time: <input type='text' size='1' value='" + localStorage.getItem(storageLBL + hospitalTimeID) + "'></input> Mins";
        hospTimeInput.onkeyup = function() { console.log(this.children[0]); localStorage.setItem(storageLBL + hospitalTimeID, this.children[0].value) };


        // Add element to the website - ORDER MATTER
        body.appendChild(pageRefreshBtn);
        body.appendChild(hospTimeInput);
        body.appendChild(col);
        body.appendChild(settingsMenu);
    }

}

// Create a checkbox element with a specific ID
function createCheckBox(radioID, isFunction) {
    var radioBtn = document.createElement("input");
    radioBtn.type = "checkbox";
    radioBtn.id = radioID;
    radioBtn.size = 3;
    radioBtn.style.color = "black";
    // Add save event
    radioBtn.addEventListener("click", function() {
        localStorage.setItem(storageLBL + this.id, Number(this.checked));
    });
    // add dynamic events if possible
    if (isFunction) {
        radioBtn.addEventListener("click", createRadioEvent);
    }
    // Get the correct state for the checkbox
    if (Number(localStorage.getItem(storageLBL + radioID))) {
        radioBtn.checked = true;
    } else {
        radioBtn.checked = false;
    }

    return radioBtn;
}

function createButton(id, isFunction, text) {
    var button = createCheckBox(id, isFunction);
    var label = document.createElement('Div');
    label.innerHTML = "<Label style='color:#333; font-size:20px'>" + id + "</Label>";
    label.style = "color: #333; padding: 14px; display: inline-block; margin-top: -20px; background-color: #f2f2f2;";
    label.innerHTML = text;
    label.appendChild(button);
    return label;
}

// Create a label element
function createLabel(text) {
    var label = document.createElement("div");
    label.innerHTML = "<Label style='color:#333; font-size:20px'>" + text + "</Label>";
    return label;
}

// Create an event click to the checkbox
function createRadioEvent() {
    var funcToRun = getFunctionToRun(this.id);
    if (funcToRun != undefined) {
        if(this.checked) {
            funcToRun(true);
        } else {
            funcToRun(false);
        }
    }
}

// Get the correct function to hide/show the correct element
function getFunctionToRun(id) {
    switch(id) {
        case descID:
            return hideDescription;
        case warID:
            return hideWar;
        case bannerID:
            return hideBanner;
        default:
            return null;
    }
}
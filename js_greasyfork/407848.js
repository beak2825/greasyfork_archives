// ==UserScript==
// @name         Advance search reviver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Help you reviver faster players from the advance search in-game
// @author       FoaR`en
// @match        https://www.torn.com/page.php?sid=UserList*
// @start-at     document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407848/Advance%20search%20reviver.user.js
// @updateURL https://update.greasyfork.org/scripts/407848/Advance%20search%20reviver.meta.js
// ==/UserScript==
'use strict';

const storageLBL = 'rev_adv:';
const revModeID = 'rev-mode';
const autoRefreshID = 'auto-ref-cb';
const hospitalTimeID = 'hosp-time-txt';

// Options: Offline, Online, Idle
const showPlayers = ['Online'];

// ON START
createSidebar();
if (Number(localStorage.getItem(storageLBL + revModeID))) {
    console.log('Reviver mode activated');
    isPlayerListLoaded();
}


// Check if the player list is loaded
function isPlayerListLoaded() {
    setTimeout(function() {
        var list = document.getElementsByClassName('userlist-wrapper')[0];
        if (list) {
            var players = list.children[1].children;
            if (list.children[2]) {
                if (Number(localStorage.getItem(storageLBL + autoRefreshID))) {
                    location.reload();
                }
            } else if(players[0].className === 'last') {
                console.log('Loading...');
                isPlayerListLoaded();
            } else {
                console.log('Loaded');
                showValidPlayers(players);
                list.children[0].getElementsByClassName('level')[0].innerHTML = 'Hospital';
            }
        } else {
                console.log('Body not found, try again.');
                isPlayerListLoaded();
        }
    }, 100);
}

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
    console.log(playersAvailable + ' players are shown');
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

    isValid = (showPlayers.some((value) => {
        return playerActivity.title.indexOf(value) != -1;
    })) &&
        (getHospTime(player) > minHospTime);

    return isValid;
}

// Get hosp time of a player - 6am didn't sleep yet, don't know what I'm doing
function getHospTime(player) {
    // Get time in minutes
    var icons = player.getElementsByClassName('big svg')[1];
    var startIndex = icons.innerHTML.indexOf("data-time='") + "data-time='".length;
    var endIndex = icons.innerHTML.indexOf("'", startIndex);
    var timeInMinutes = icons.innerHTML.slice(startIndex, endIndex) / 60;

    // Update the time in the list
    player.getElementsByClassName('level')[0].innerHTML = Math.ceil(timeInMinutes) + " min";

    return Number(timeInMinutes);
}

// show/hide a specific element
function hideElement(element, hide) {
    if (hide === true) {
    element.style.display = 'none';
    } else {
    element.style.display = 'block';
    }
}



// -----------------------
//       Visuality
// -----------------------

// Create the sidebar to use this tool
function createSidebar() {
    const style = `
<style>
  .rv-sidebar {
    position:fixed;
    top:0;
    z-index: 1500000;
    width: 20%;
    margin: 6px;
    background: transparent;
  }
  .rv-sidebar-header {
    border: 4px solid #212121;
    border-radius: 12px;
    padding: 12px;
    width: 100%;
    text-align: center;
    font-size: 18px;
    background-color: #333;
  }
  .rv-sidebar-cb {
    color: white;
    padding: 8px;
  }
  .rv-sidebar-label {
    color: #333;
    font-size: 20px;
  }
  .rv-checkbox {
    color: black;
    transform: scale(1.5);
    transform-origin: left;
  }
</style>

<div class="rv-sidebar">
</div>`;

    var styleSideBar = document.createElement('div');
    styleSideBar.innerHTML = style;
    styleSideBar.setAttribute('id', 'itemMarketQuickBuyContainer');
    if (!document.body || document.body.style.visibility == 'hidden') {
        location.reload();
    }
    document.body.appendChild(styleSideBar);

    var sideBar = document.createElement('div');
    sideBar.setAttribute('class', 'rv-sidebar-header');
    styleSideBar.children[1].appendChild(sideBar);

    var revModeCB = createCBElement(revModeID, "Reviver Mode: ");
    sideBar.appendChild(revModeCB);

    if (Number(localStorage.getItem(storageLBL + revModeID))) {

        // Create the auto refresh checkbox
        var pageRefreshCB = createCBElement(autoRefreshID, "Auto Refresh: ");

        // Create hosp time input
        if (!localStorage.getItem(storageLBL + hospitalTimeID)) {
            localStorage.setItem(storageLBL + hospitalTimeID, 60);
        }
        var hospTimeInput = createCBElement(hospitalTimeID, '');
        hospTimeInput.innerHTML = "Min Hospital time: <input type='text' size='1' value='" + localStorage.getItem(storageLBL + hospitalTimeID) + "'></input> mins";
        hospTimeInput.onkeyup = function() { localStorage.setItem(storageLBL + hospitalTimeID, this.children[0].value); };

        sideBar.appendChild(pageRefreshCB);
        sideBar.appendChild(hospTimeInput);
    }

    console.log ('sidebar - done');
}

// Creating a new custom CheckBox element with functionality
function createCBElement(id, text) {
    var button = createCheckBox(id);
    var label = document.createElement('Div');
    label.setAttribute('class', 'rv-sidebar-cb');
    label.innerHTML = text;
    label.appendChild(button);
    return label;
}

// Creating a new custom checBox
function createCheckBox(checkBoxID) {
    var newCB = document.createElement("input");
    newCB.setAttribute('id', checkBoxID);
    newCB.setAttribute('class', 'rv-checkbox');
    newCB.type = "checkbox";

    // Add save event
    newCB.addEventListener("click", function() {
        localStorage.setItem(storageLBL + this.id, Number(this.checked));
        location.reload();
    });

    // Get the correct state for the checkbox
    if (Number(localStorage.getItem(storageLBL + checkBoxID))) {
        newCB.checked = true;
    } else {
        newCB.checked = false;
    }

    return newCB;
}
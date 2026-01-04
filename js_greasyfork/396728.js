// ==UserScript==
// @name         Idlescape Helper
// @namespace
// @version      1.0.1
// @description  A gathering of QoL features to help players.
// @author       kinks
// @homepageURL  https://github.com/kinkey/idlescape-helper
// @include      http://*idlescape.com/*
// @include      https://*idlescape.com/*
// @grant        none
// @namespace https://greasyfork.org/users/448335
// @downloadURL https://update.greasyfork.org/scripts/396728/Idlescape%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/396728/Idlescape%20Helper.meta.js
// ==/UserScript==

function addStyle(selector, style) {
    let styles = document.styleSheets;
    let url = window.location.href;
    let urlPattern = url.substring(0, url.length - 4) + "static/css/main";

    for (let i = 0; i < styles.length; i++) {
        if ((!!styles[i].href) && styles[i].href.includes(urlPattern)) {
            styles[i].addRule(selector, style, styles[i].rules.length);
        }
    }
}

function updateTitleBar() {
    let title = document.querySelector('.skill-levels-total-combat .status-action div').innerText.replace('Status: ', '')

    if (title === 'Idling') {
        title = '!!! IDLING !!!';
    }

    document.title = '[> ' + title + ' <]';
}

setInterval(updateTitleBar, 3000);

let navBar = 'navbar1';
let sellDisabled = false;
let noFoodSoundEnabled = false;
let noResourceSoundEnabled = false;

let audioContext;

let foodBeepInterval;
let resourceBeepInterval;

addStyle(navBar, "grid-template-columns: 1fr 1fr 1fr .2fr .2fr .4fr .4fr .3fr .3fr .2fr");

let sellDisableInnerHtml = '<button class=\"new-buttons disable-sell-button\">Disable Sell</button>';
let foodSoundEnableInnerHtml = '<button class=\"new-buttons enable-sound-notification\">Enable No Food Beep</button>';
let resNotifInnerHtml = '<button class=\"new-buttons resources-notification-button\">Enable Missing Resource Beep</button>';
//let newGoldInnerHtml = '<button class=\"new-buttons gold-gained-button\">Enable Gold Gain Beep</button>';

let disableSellButtonContainer = document.createElement('div');
disableSellButtonContainer.innerHTML = sellDisableInnerHtml;
document.getElementsByClassName(navBar)[0].appendChild(disableSellButtonContainer);

let enableSoundNoFood = document.createElement('div');
enableSoundNoFood.innerHTML = foodSoundEnableInnerHtml;
document.getElementsByClassName(navBar)[0].appendChild(enableSoundNoFood);

let enableSoundNoResource = document.createElement('div');
enableSoundNoResource.innerHTML = resNotifInnerHtml;
document.getElementsByClassName(navBar)[0].appendChild(enableSoundNoResource);

/*
let goldGainNotification = document.createElement('div');
goldGainNotification.innerHTML = newGoldInnerHtml;
document.getElementsByClassName(navBar)[0].appendChild(goldGainNotification);
*/

let disableSellButton = function () {
    if (sellDisabled) {
        alert('Sell Button already disabled. To enable please refresh the page');
    } else {
        sellDisabled = true;
        disableSellButtonContainer.innerHTML = "SELL DISABLED";
        addStyle(".item-dialogue-button-div .sell-button", "display:none");
        alert('Sell Button disabled. Please refresh page to enable it again');
    }
};

function beep(vol, freq, duration) {
    let oscillator = audioContext.createOscillator();
    let gain = audioContext.createGain();
    oscillator.connect(gain);
    oscillator.frequency.value = freq;
    oscillator.type = "sine";
    gain.connect(audioContext.destination);
    gain.gain.value = vol * 0.01;
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration * 0.001)
}

let noFood = function () {
    let emptySlots = document.querySelectorAll('.combat-empty-slot').length;
    if (emptySlots >= 25) {
        console.log("beeping");
        beep(15, 550, 100);
    }
};

let noResource = function () {
    let heatElement = document.getElementById("heat");

    let heatValue;
    if (heatElement.innerHTML.includes('K')) {
        heatValue = parseInt(heat.innerHTML) * 1000;
    } else if (heat.innerHTML.includes('M')) {
        heatValue = parseInt(heat.innerHTML) * 1000000;
    } else {
        heatValue = parseInt(heat.innerHTML);
    }

    let isPresentationPresent = document.querySelectorAll('div[role="presentation"]').length > 0 ? true : false;

    if (heatValue < 1000 || isPresentationPresent) {
        beep(20, 350, 1500);
    }
};

function activateFoodMissingSound() {
    if (noFoodSoundEnabled) {
        noFoodSoundEnabled = false;
        alert('Disabling beeping.');
        clearInterval(foodBeepInterval);
        enableSoundNoFood.innerHTML = foodSoundEnableInnerHtml;
    } else {
        if(audioContext == null) {
            audioContext = new AudioContext();
        }
        noFoodSoundEnabled = true;
        alert('Beeping enabled. Please click this button again to disable it.');
        enableSoundNoFood.innerHTML = "<button>Food Beep ENABLED</button>";
        foodBeepInterval = setInterval(noFood, 10000);
    }
}

function activateResourceMissingSound() {
    if (noResourceSoundEnabled) {
        noResourceSoundEnabled = false;
        alert('Disabling beeping.');
        clearInterval(resourceBeepInterval);
        enableSoundNoResource.innerHTML = resNotifInnerHtml;
    } else {
        if(audioContext == null) {
            audioContext = new AudioContext();
        }
        noResourceSoundEnabled = true;
        alert('Beeping enabled. Please click this button again to disable it.');
        enableSoundNoResource.innerHTML = "<button>Resource Beep ENABLED</button>";
        resourceBeepInterval = setInterval(noResource, 20000);
    }
}

disableSellButtonContainer.addEventListener('click', disableSellButton, false);
enableSoundNoFood.addEventListener('click', activateFoodMissingSound, false);
enableSoundNoResource.addEventListener('click', activateResourceMissingSound, false);
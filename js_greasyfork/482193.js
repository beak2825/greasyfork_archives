// ==UserScript==
// @name         CT-Access
// @namespace    tornpaws.uk
// @version      0.5
// @description  Help with Christmas Town accessibility
// @author       lonerider543
// @match        https://www.torn.com/christmas_town*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482193/CT-Access.user.js
// @updateURL https://update.greasyfork.org/scripts/482193/CT-Access.meta.js
// ==/UserScript==

var msg = new SpeechSynthesisUtterance();
var synth = window.speechSynthesis;

const movementKeys = [37,38,39,40,65,68,83,87];
const thudSound = new Audio("https://www.tornpaws.uk/media/thud.mp3");
thudSound.volume = 0.3;
var lastSound = parseInt(Date.now()/1000);
var currentLocation;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.onkeydown = function(event) {
    uniKeyCode(event);
};

function speak(words) {
    msg = new SpeechSynthesisUtterance(words);
    msg.rate = 1.7; //speech speed - range: 0 to 10
    //look into console to see all available voices/languages
    msg.voice = synth.getVoices()[0];

    //speaking trigger
    synth.cancel(); //cut previous voice short
    synth.speak(msg);
    // console.log(msg.text);
}

function locationCheck() {
    let newLocation = $(".position___SwkRn").text();
    return currentLocation == newLocation;
}

function updateLocation() {
    currentLocation = $(".position___SwkRn").text();
}

function thud() {
    let now = parseInt(Date.now()/1000);
    let diff = now - lastSound;
    if (diff >= 1) {
        lastSound = now;
        thudSound.play();
    }
}

function uniKeyCode(event) {
    var key = event.which || event.keyCode;

    // Movement Keys - Read out area status text
    if (movementKeys.includes(key)) {
        sleep(500).then(() => {
            if (locationCheck()) {
                thud();
                return;
            } else {
                updateLocation();
            }

            let text = $(".status-area-container").find(".paragraph").text();
            speak(text);
        });

    // C key - Read out coordinates
    } else if (key == 67) {
        let coords = $(".position___SwkRn").text();
        let text = `${coords.replace("-","negative ").replace(",", " ")}`;
        speak(text);

    // V key - Read out nearby items/chests from CT Helper Script
    } else if (key == 86) {
        let script = $(".hardyNearbyItems");
        let script2 = $(".hardyNearbyChests");

        if (script.length == 0 || script2.length == 0) {
            speak("Cannot find CT Helper script");
            return;
        }

        let items = $(".hardyNearbyItems").find(".content > p");
        let chests = $(".hardyNearbyChests").find(".content > p");

        if (items.length == 0 && chests.length == 0) {
            speak("No nearby items or chests");
            return;
        }

        let itemsChestsText = "";
        if (items.length > 0) {
            itemsChestsText += items.length > 1 ? `${items.length} items,` : '1 item,'

            items.each(function(index) {
                let itemText = $(this).text().trim().replace(",","").replace("-","negative ");
                itemsChestsText += ` ${itemText}.`
            });
        }

        if (chests.length > 0) {
            itemsChestsText += chests.length > 1 ? `${chests.length} chests,` : '1 chest,'

            chests.each(function(index) {
                let chestText = $(this).text().trim().replace(",","").replace("-","negative ");
                itemsChestsText += ` ${chestText}.`
            });
        }

        speak(itemsChestsText);
    }
}

// Initialise location
sleep(250).then(() => {updateLocation();});
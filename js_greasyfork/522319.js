// ==UserScript==
// @name        LoveSpouseEOS
// @namespace   Violentmonkey Scripts
// @match       *://milovana.com/webteases/showtease.php
// @match       *://milovana.com/eos/editor/*
// @match       *://eosscript.com/*
// @grant       GM.xmlHttpRequest
// @version     0.1
// @author      ChrisHolm
// @license     GPLv3
// @description 29.12.2024, 15:42:30
// @downloadURL https://update.greasyfork.org/scripts/522319/LoveSpouseEOS.user.js
// @updateURL https://update.greasyfork.org/scripts/522319/LoveSpouseEOS.meta.js
// ==/UserScript==

//
// This script will look for valid tags on Milovana pages and initiate the coresponding vibes on your lovespouse toy
// The script relies on a http server running on a computer which has a BLE connection to your lovespouse toy
// and sends the commands via a post call.and
// You can use every server you like but easiest way is using the lovespouse python script published with this monkeyscript.
// It is based on the ButtEOS monkey script by cfs6t08p
//


// this is the url which is called to control the toy
// calls will be made as POST call containg the parameters duration, mode, submode
var lsurl = "http://localhost:8080/lovespouse";
// Used mode for giving vibes, maybe depending on your toy it can be shock1, shock2, telescope
var vibemode= 'shock1';


// function to send http request for vibes
// m = mode, l = level
function vibe(m, l) {
  GM.xmlHttpRequest({
    method: "POST",
    url: lsurl,
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ 'mode' : m, 'submode' : l}),
    //onload: function(response) { console.log(response); }
  });
}

// prase the page and look for valid tags to start vibes for
if(document.getElementById("eosContainer")) {
  let eos = document.getElementById("eosContainer");
  let lastBPM = 0;
  let toy_mode = 'shock1';
  let toy_submode = '0'; // 0 = off
  let toy_duration = 1; // in seconds

  // scan page for toy commands and send http request to toyserver
  setInterval(() => {
    let now = Date.now();

    // the Label of the notification in EOS editor must be like Vibes: <no of mode>, where no of mode is between 1 and 9
    let vibePath = ".//div[contains(text(),'Vibes:')]";
    let vibeNotification = document.evaluate(vibePath, eos, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let newVibe = toy_submode;

    if(vibeNotification) {
      newVibe = parseInt(vibeNotification.textContent.slice(7));
    } else {
      newVibe = 0; // off
    }

    if((newVibe != toy_submode) && !(Number.isNaN(newVibe) && Number.isNaN(toy_submode))) {
      vibeLevel = newVibe;

      if(Number.isNaN(vibeLevel) || vibeLevel > 10 || vibeLevel < 0) {
        console.error("Invalid vibrator level: \"" + vibeLevel + "\"");
        vibe(vibemode, 0);
        toy_submode=0;
      } else {
        vibe(vibemode, vibeLevel);
        toy_submode = vibeLevel;
      }
    }

     // the Label of the notification in EOS editor must be like Beat: <bpm>, where bpm is the number of beats per minute
    let bpmPath = ".//div[contains(text(),'Beat:')]";
    let bpmNotification = document.evaluate(bpmPath, eos, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let bpm = lastBPM;

    if(bpmNotification) {
      bpm = parseInt(bpmNotification.textContent.slice(6));
    } else {
      bpm = 0;
    }

    if((bpm != lastBPM) && !(Number.isNaN(bpm) && Number.isNaN(lastBPM))) {

      if(Number.isNaN(bpm) || bpm < 0 || bpm > 300) {
        console.error("Invalid BPM: \"" + bpm + "\"");
        vibe('bpm',0);
        lastBPM=0;
      } else {
        vibe('bpm', bpm);
        lastBPM=bpm;
      }
    }

  }, 50); // end of setInterval
} // end if eosContainer


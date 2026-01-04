// ==UserScript==
// @name        WatchStatus - glowforge.com
// @namespace   Violentmonkey Scripts
// @match       https://app.glowforge.com/designs/*
// @grant       none
// @version     1.1
// @author      -
// @description 1/27/2021, 8:47:24 PM
// @downloadURL https://update.greasyfork.org/scripts/420772/WatchStatus%20-%20glowforgecom.user.js
// @updateURL https://update.greasyfork.org/scripts/420772/WatchStatus%20-%20glowforgecom.meta.js
// ==/UserScript==

//If you try really hard you can write javascript like python...
//At least now that there's async/await...

const sleep = ms => new Promise(res => setTimeout(res, ms));
pb_api_key="";

function pushAlert(msg){
    fetch('https://api.pushbullet.com/v2/pushes', {
        method: 'POST',
        headers: {
            'Access-Token': pb_api_key,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"body":msg,"title":"Glowforge","type":"note","channel_tag":"jkw-696"})
    });
}

function convertTime(input, separator) {
    function pad(input) {return input < 10 ? "0" + input : input;};
    return [
        pad(Math.floor(input / 3600)),
        pad(Math.floor(input % 3600 / 60)),
        pad(Math.floor(input % 60)),
    ].join(typeof separator !== 'undefined' ?  separator : ':' );
}

async function watchStatus() {
  timeEstimate="";
  while (true) {
    if (window.document.getElementsByClassName('PrintCountdownTimer').length){
      break
    }
    console.log("Waiting for print start...");
    await sleep(1000);
  }
  while (true) {
    if (timeEstimate===""){
      timeEstimate = window.document.getElementsByClassName('PrintCountdownTimer')[0].textContent;
      start = Math.floor(Date.now() / 1000)
    }
    name = window.document.getElementsByClassName('name-editor')[0].getElementsByTagName('input')[0].value;
    timeleft = window.document.getElementsByClassName('PrintCountdownTimer')[0].textContent;
    console.log(timeleft);

    if (timeleft === "00:00"){
      seconds = Math.floor(Date.now() / 1000)-start;
      realTime = converTime(seconds, ":");
      pushAlert(name+" is finished!\n\n"+"Times\nEstimate: "+timeEstimate+" - Actual: "+realTime);
      break;
    }
    
    await sleep(1000);
  }
}
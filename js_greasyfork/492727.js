// ==UserScript==
// @name        Revcut, Nightfaucet, Inlinks ~ Automatic
// @namespace   Violentmonkey Scripts
// @match       https://121989.xyz/*
// @match       https://redirect.techanalyzer.eu/*
// @match       https://845265.xyz/*
// @grant       none
// @version     1.0
// @author      leenox_Uzer
// @description 4/16/2024, 3:30:23 PM
// @downloadURL https://update.greasyfork.org/scripts/492727/Revcut%2C%20Nightfaucet%2C%20Inlinks%20~%20Automatic.user.js
// @updateURL https://update.greasyfork.org/scripts/492727/Revcut%2C%20Nightfaucet%2C%20Inlinks%20~%20Automatic.meta.js
// ==/UserScript==

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to format milliseconds into minutes and seconds
function formatTime(milliseconds) {
    let minutes = Math.floor(milliseconds / 60000);
    let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// Update the document content to show the timer output
function magic(duration, actualBypassLink) {
    let remainingTime = duration;

    let updateInterval = setInterval(() => {
        document.documentElement.innerHTML = "<h1>Time remaining: " + formatTime(remainingTime) + "</h1>";
        remainingTime -= 1000;
        if (remainingTime <= 0) {
            clearInterval(updateInterval);
            document.documentElement.innerHTML = "<h1>Timer has finished! Now go forth and enjoy freedom!</h1>";
            document.documentElement.innerHTML += "Redirecting to - " + `<a rel="nofollow" onclick="window.open('${actualBypassLink}', '_self')" >` + actualBypassLink + "</button>";
            //window.location.host = siteDestination;
        }
    }, 1000);
}



window.addEventListener('load', function() {
  // Default time to wait (with additional random seconds)
  let threeMinutes = (3 * 60 * 1000);
  threeMinutes += (1000 * Math.floor(Math.random() * 21));
  let twoMinutes = 2 * 60 * 1000;
  twoMinutes += (1000 * Math.floor(Math.random() * 11));

  switch(window.location.host) {
    case "121989.xyz": // revcut.net (REVCUT)
      magic(threeMinutes, `https://revcut.net${window.location.pathname}`);
      break;
    case "redirect.techanalyzer.eu": // short.nightfaucet.me (SHORTFAUCET)
      magic(twoMinutes, `https://short.nightfaucet.me${window.location.pathname}`);
      break;
    case "845265.xyz": // inlinks.online (INLINKS)
      magic(twoMinutes, `https://inlinks.online${window.location.pathname}`);
      break;
  }

}, false)

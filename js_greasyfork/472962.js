// ==UserScript==
// @name         Free PixelPlace Player Tracker
// @description  Provides all free users of pixelplace with a Player Tracking feature! There are no hidden tricks.
// @version      1.0.3
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/1150187
// @downloadURL https://update.greasyfork.org/scripts/472962/Free%20PixelPlace%20Player%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/472962/Free%20PixelPlace%20Player%20Tracker.meta.js
// ==/UserScript==


/*

AT THE CURRENT MOMENT THE SCRIPT ONLY WORKS ON /7, FUTURE PLANS WILL EXTEND TO MORE CANVASES


KIND PIXELPLACE USER,
THIS SCRIPT CONNECTS TO AN EXTERNAL WEBSITE.
YOUR ACCOUNT INFO, IS NOT SHARED. THERE IS NO DATA ABOUT YOU SENT.

THE ONLY DATA THAT CAN BE GATHERED BY THE SERVER IS YOUR IP ADDRESS.
IP ADDRESSES ARE STORED IN MEMORY FOR CONNECTION LIMIT, AND DELETED AS SOON AS YOU STOP USING THE SCRIPT/PIXELPLACE.

ABSOLUTELY NO INFO IS SAVED ON THE SERVER SIDE.
*/


alert("Script is currently under maintenance. This script will be back online soon!");

var numberToRgbMap = {"0":"255,255,255","1":"196,196,196","2":"136,136,136","3":"85,85,85","4":"34,34,34","5":"0,0,0","6":"0,102,0","7":"34,177,76","8":"2,190,1","9":"81,225,25","10":"148,224,68","11":"251,255,91","12":"229,217,0","13":"230,190,12","14":"229,149,0","15":"160,106,66","16":"153,83,13","17":"99,60,31","18":"107,0,0","19":"159,0,0","20":"229,0,0","21":"255,57,4","22":"187,79,0","23":"255,117,95","24":"255,196,159","25":"255,223,204","26":"255,167,209","27":"207,110,228","28":"236,8,236","29":"130,0,128","30":"81,0,255","31":"2,7,99","32":"0,0,234","33":"4,75,255","34":"101,131,207","35":"180,180,255","36":"192,192,192","37":"255,191,191","38":"255,223,229","39":"0,54,56","40":"71,112,80","41":"152,251,152","42":"255,112,0","43":"206,41,57","44":"255,65,106","45":"125,38,205","46":"51,0,119","47":"0,91,161","49":"27,116,0"}

Object.defineProperty(window.console, 'log', {
  configurable: false,
  enumerable: true,
  writable: false,
  value: console.log
});


const userTrackerMap = {};
const trackerUpdateInterval = 5000;
console.log("Opening a Web Socket!");

const mysocket = new WebSocket('wss://de4lua.art:2083');

mysocket.addEventListener('message', function (event) {
  const message = event.data;

  if (message.startsWith("1")) {
    const idAndUsername = message.substring(1);
    const parts = idAndUsername.split('_');

    if (parts.length >= 2) {
      const id = parts[1];
      const username = parts[0];

      if (!userTrackerMap[id]) {
        const tracker = createTrackerElement(username);
        userTrackerMap[id] = { element: tracker, lastUpdate: Date.now() };
        appendTracker(tracker);
      } else {
        userTrackerMap[id].lastUpdate = Date.now();
      }
    }
  } else {
    const pixelData = JSON.parse(event.data);
    for (const pixel of pixelData) {
      const x = pixel[0];
      const y = pixel[1];
      const col = pixel[2];
      const id = pixel[3];

        if (!userTrackerMap[id]) {
            mysocket.send(`1${id}`);
        } else {
            const trackerElement = userTrackerMap[id].element;
            trackerElement.style.left = (x+1) + 'px';
            trackerElement.style.top = (y+1) + 'px';
            userTrackerMap[id].lastUpdate = Date.now();
            var [r,g,b] = numberToRgbMap[col].split(",");
            trackerElement.style.borderColor = `rgb(${r},${g},${b})`;
        }
    }
  }

  for (const userId in userTrackerMap) {
    if (Date.now() - userTrackerMap[userId].lastUpdate > trackerUpdateInterval) {
      removeTracker(userId);
    }
  }
});

function createTrackerElement(username) {
  const trackerElement = document.createElement('div');
  trackerElement.className = 'track open-profile';
  trackerElement.style = 'display: block; border-color: rgb(255, 255, 255);';
  trackerElement.setAttribute('data-profile', username);
  trackerElement.textContent = username;
  return trackerElement;
}

function appendTracker(trackerElement) {
  const paintingMoveElement = document.getElementById('painting-move');
  if (paintingMoveElement) {
    paintingMoveElement.appendChild(trackerElement);
  }
}

function removeTracker(userId) {
  if (userTrackerMap[userId] && userTrackerMap[userId].element) {
    userTrackerMap[userId].element.remove();
    delete userTrackerMap[userId];
  }
}
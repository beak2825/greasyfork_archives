// ==UserScript==
// @name         ColabHelper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A helper to start and terminate the colab session
// @author       You
// @match        https://colab.research.google.com/drive/*
// @icon         https://www.google.com/s2/favicons?domain=colab.research.google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429818/ColabHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/429818/ColabHelper.meta.js
// ==/UserScript==

var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="startButton" type="button">Start</button>  <button id="closeButton" type="button">Close</button>';
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("startButton").addEventListener (
    "click", startButtonClickAction, false
);

document.getElementById ("closeButton").addEventListener (
    "click", endButtonClickAction, false
);

function startButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.
    */
    var zNode = document.createElement ('p');
    document.getElementById ("myContainer").appendChild (zNode);
    document.querySelector("colab-run-button").click();
}

function endButtonClickAction (zEvent) {
    end();
}

//Sleep function
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//End function
const end = async () => {
    //Click on menu button
    document.querySelector("#top-toolbar > colab-connect-button").shadowRoot.querySelector("#connect").click();
    await sleep(500);

    //Click on manage sessions
    document.querySelector("colab-usage-display").shadowRoot.querySelector("div paper-button").click();
    await sleep(2000);

    //Click on terminate session
    //document.querySelector("body > colab-dialog > paper-dialog > colab-sessions-dialog").shadowRoot.querySelector("div.dialog-main-content > div.sessions-content.layout.vertical > div.dialog-table > colab-session > div.button-action-column > paper-icon-button").click()
    document.querySelector("body > colab-dialog > paper-dialog > colab-sessions-dialog").shadowRoot.querySelector("div.dialog-main-content > div.sessions-content.layout.vertical > div.dialog-table > colab-session > div.button-action-column > paper-button").click();
    await sleep(1000);

    //Click on okay buttom if prompted
    try {
      document.querySelector("#ok").click();
      // await sleep(1000);
    }
    catch(err) {
      console.log('No okay button')
    }

    document.querySelector("body > colab-dialog > paper-dialog > colab-sessions-dialog").shadowRoot.querySelector("paper-button.dismiss").click()
    await sleep(1000);
    //document.querySelector("colab-usage-display").shadowRoot.querySelector("div paper-button").click();
}





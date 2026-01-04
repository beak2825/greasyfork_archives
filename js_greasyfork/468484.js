// ==UserScript==
// @name         [udit] chatgpt continue generating button automatic press
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically presses "continue generating" button in ChatGPT every 5 seconds.
// @author       You
// @match        https://chat.openai.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468484/%5Budit%5D%20chatgpt%20continue%20generating%20button%20automatic%20press.user.js
// @updateURL https://update.greasyfork.org/scripts/468484/%5Budit%5D%20chatgpt%20continue%20generating%20button%20automatic%20press.meta.js
// ==/UserScript==

function clickContinueGeneratingButton() {
    var buttons = document.getElementsByTagName('button');
    for (var i = 0; i < buttons.length; i++) {
        var buttonText = buttons[i].textContent.trim();
        if (buttonText === 'Continue generating') {
            buttons[i].click();
            break;
        }
    }
}

window.addEventListener('load', function() {
    setInterval(clickContinueGeneratingButton, 5000); // Executes every 5 seconds (5000 milliseconds)
}, false);

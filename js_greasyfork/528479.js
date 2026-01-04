// ==UserScript==
// @name         Ferge2.io Coin Attempt
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Attempt to get coins in Ferge2.io (very difficult)
// @author       You
// @match        https://ferge2.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ferge2.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528479/Ferge2io%20Coin%20Attempt.user.js
// @updateURL https://update.greasyfork.org/scripts/528479/Ferge2io%20Coin%20Attempt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Ferge2.io Coin Attempt userscript loaded.");

    // Listen for messages sent by the game (this might not work directly)
    // This can be very useful if there is a way to get feedback from the game
    const originalSendMessage = window.unityInstance ? window.unityInstance.SendMessage : null;
    if (originalSendMessage) {
        window.unityInstance.SendMessage = function(object, method, message) {
            console.log("Intercepted Unity Message:", { object, method, message });
            // You could add logic here to try to intercept coin-related messages,
            // but this would require extensive reverse engineering of the game.
            originalSendMessage.call(window.unityInstance, object, method, message);
        };
    }


    // This is how you would find a way to interact with DOM elements.
    // However, since the game's UI is in Unity, there are no useful elements here.
    const someElement = document.querySelector(".whiteText");
    if (someElement) {
        console.log("Found an element:", someElement);
        // You could do things like:
        // someElement.textContent = "Modified by userscript!";
        // someElement.addEventListener("click", () => console.log("Element clicked!"));
    }

    //add a div to the document
    var myDiv = document.createElement('div');
    myDiv.style.position = 'fixed';
    myDiv.style.top = '10px';
    myDiv.style.left = '10px';
    myDiv.style.backgroundColor = 'white';
    myDiv.style.color = 'black';
    myDiv.style.padding = '10px';
    myDiv.style.border = '2px solid black';
    myDiv.style.zIndex = '9999'; // Ensure it's on top
    myDiv.textContent = 'This is a test from the userscript.';

    document.body.appendChild(myDiv);
})();
// ==UserScript==
// @name         Auto and hotkey re-roll
// @namespace    http://tampermonkey.net/
// @version      2024-11-08
// @description  Either manually or automatically re-roll bot replies.
// @author       You
// @match        https://www.figgs.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=figgs.ai
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516453/Auto%20and%20hotkey%20re-roll.user.js
// @updateURL https://update.greasyfork.org/scripts/516453/Auto%20and%20hotkey%20re-roll.meta.js
// ==/UserScript==

(function() {
    'use strict';
        let intervalId;

        document.querySelector('body').addEventListener("keydown", (event) => {

        if (event.key === "F1") { //Start creating new messages
              if (!intervalId) {
                  intervalId = setInterval(reroll, 5000);
              }
        }

        if (event.key === "F2") { //Stop creating new messages
            clearInterval(intervalId);
            intervalId = null;
        }

        if (event.key === "Dead") { //Create one new message
            reroll();
        }
    });

    function reroll() {
        document.querySelector('[aria-label="reroll bot message"]').click();
    }

})();
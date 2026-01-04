// ==UserScript==
// ==UserScript==
// @name        Stop being lazy
// @description Stops you from using AI and keeps you motivated to work yourself.
// @license     MIT
// @namespace   Violentmonkey Scripts
// @match       https://chatgpt.com/
// @match       https://chatgpt.com/*
// @grant       none
// @version     1.0
// @author      Alimad Corporations
// @description 6/19/2025, 9:48:21 AM
// @downloadURL https://update.greasyfork.org/scripts/539946/Stop%20being%20lazy.user.js
// @updateURL https://update.greasyfork.org/scripts/539946/Stop%20being%20lazy.meta.js
// ==/UserScript==

let submitButton;

function findSubmitButton() {
    let btn = document.getElementById("composer-submit-button");
    if (btn && btn !== submitButton) {
        submitButton = btn.cloneNode(true);
        btn.replaceWith(submitButton);

        submitButton.onclick = function() {
            document.body.innerHTML = '<div class="flex h-full w-full flex-col items-center justify-center gap-4"><h2>Go do something yourself, lazy man</h2><button onclick="" class="btn relative btn-secondary"><div class="flex items-center justify-center">Ok I\'ll try</div></button></div>';
        };

        console.log("Workin");
    }

    let textarea = document.getElementById("prompt-textarea");
    if (textarea && !textarea.dataset.enterHooked) {
        textarea.dataset.enterHooked = "true";
        textarea.addEventListener("keydown", function(e) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitButton?.click();
            }
        });
    }
}

setInterval(findSubmitButton, 1000);

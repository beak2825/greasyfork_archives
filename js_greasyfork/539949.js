// ==UserScript==
// ==UserScript==
// @name        Stop being lazy
// @description Stops you from using AI and keeps you motivated to work yourself.
// @license     MIT
// @namespace   MadScript
// @match       https://chatgpt.com/
// @match       https://chatgpt.com/*
// @grant       none
// @version     1.1
// @author      Alimad Corporations
// @description 6/19/2025, 9:48:21 AM
// @downloadURL https://update.greasyfork.org/scripts/539949/Stop%20being%20lazy.user.js
// @updateURL https://update.greasyfork.org/scripts/539949/Stop%20being%20lazy.meta.js
// ==/UserScript==

let submitButton;

let messages = {
  "Go do something yourself, lazy man": "Ok I'll try",
  "Stop AI from taking your job by taking AI's job":
    "Ok I'll try:::::https://www.youtu.be/=co7b8Y71BlE",
  "If you keep asking AI to keep doing stuff for you like this, you are stopping yourself from actually learning and having fun":
    "Ok I'll stop:::::https://www.youtube.com/watch?v=Tfv2F36isJE",
  "Would you agree to say explicitly that 'This project was made with the help of AI' in your project?":
    "Ok I'll try and stop",
};
let index = Math.floor(Math.random() * 4);

function disable() {
  let keys = Object.keys(messages);
  let message = keys[index];
  let [buttonNote, url] = messages[message].split(":::::");
  document.body.innerHTML = `
      <div class="flex h-full w-full flex-col items-center justify-center gap-4">
        <h2>${message}</h2>
        <a href='${url}'><button class="btn relative btn-secondary">
          <div class="flex items-center justify-center">${buttonNote}</div>
        </button></a>
      </div>`;
}

function findSubmitButton() {
  let btn = document.getElementById("composer-submit-button");
  if (btn && btn !== submitButton) {
    submitButton = btn.cloneNode(true);
    btn.replaceWith(submitButton);

    submitButton.onclick = function () {
      disable();
      setTimeout(disable, 1500); // redisable bcz sometimes the site tries to recover the conversation
    };

    console.log("Workin");
  }

  let textarea = document.getElementById("prompt-textarea");
  if (textarea && !textarea.dataset.enterHooked) {
    textarea.dataset.enterHooked = "true";
    textarea.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        disable();
        setTimeout(disable, 1500);
      }
    });
  }
}

setInterval(findSubmitButton, 1000);

// Written by Muhammad Ali

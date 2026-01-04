// ==UserScript==
// @name         Moodle Copy
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Copies the current question to clipboard in the moodle quiz. Make sure to change the @match statement to your quiz website.
// @author       Anonim Arı
// @match        https://ayva.itu.edu.tr/mod/quiz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.tr
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464834/Moodle%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/464834/Moodle%20Copy.meta.js
// ==/UserScript==

(function () {
  "use strict";

  document.addEventListener(
    "contextmenu",
    (e) => {
      e.returnValue = true;
      e.stopPropagation && e.stopPropagation();
    },
    true
  );

  const element = document.querySelector(
    'form > div > div > div[class="content"]'
  );

  if (!element) return console.log("Element not found");

  function createButton() {
    const button = document.createElement("button");
    const art = `¯\\_(ツ)_/¯`;
    button.textContent = art;
    button.style = `
    bottom: 0px;
    right: 0px;
    position: fixed;
    color: white;
    z-index: 2147483647;
    padding: 10px;
    font-size: 25px;
    text-align: center;
    font-family: monospace;
    width: 200px;
    height: 253px;
    background-repeat: no-repeat;
    background-size: contain;

    background: black;
    `;
    return button;
  }

  const button = createButton();

  function chad() {
    button.style.backgroundImage =
      "url(https://media.tenor.com/MKpqR-aLLzYAAAAM/pov-you.gif)";
    button.innerText = "";
  }

  function clipboard(text) {
    const item = new ClipboardItem({
      "text/plain": new Blob([text], { type: "text/plain" }),
    });

    navigator.clipboard
      .write([item])
      .then(() => {
        chad();
        alert("Text copied to clipboard!");
      })
      .catch((error) => {
        alert("Error while copying! " + error);
      });
  }

  button.addEventListener("click", function () {
    clipboard(element.innerText);
  });
  document.body.appendChild(button);
})();

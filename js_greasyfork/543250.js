// ==UserScript==
// @name         Nitro Type Jammed Keys (Advanced Lockout)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Disables random key inputs + blocks DOM injections during race with animated GUI
// @author       Internet Typer
// @match        https://www.nitrotype.com/race
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543250/Nitro%20Type%20Jammed%20Keys%20%28Advanced%20Lockout%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543250/Nitro%20Type%20Jammed%20Keys%20%28Advanced%20Lockout%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let jammedKey = null;
  let cooldown = 0;

  // GUI Setup (floating upper-middle)
  const gui = document.createElement("div");
  gui.id = "jammed-keys-gui";
  Object.assign(gui.style, {
    position: "fixed",
    top: "20%",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#222",
    border: "2px solid crimson",
    borderRadius: "10px",
    padding: "10px 18px",
    fontSize: "20px",
    color: "white",
    fontFamily: "Orbitron, sans-serif",
    zIndex: "9999",
    display: "none",
    textAlign: "center",
    boxShadow: "0 0 12px crimson",
    opacity: "0.95"
  });
  document.body.appendChild(gui);

  // Trigger random jam every 10s
  setInterval(() => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    jammedKey = letters[Math.floor(Math.random() * letters.length)];
    cooldown = 5;

    gui.textContent = `🔒 JAMMED KEY: ${jammedKey} (${cooldown}s)`;
    gui.style.display = "block";

    const countdown = setInterval(() => {
      cooldown--;
      gui.textContent = `🔒 JAMMED KEY: ${jammedKey} (${cooldown}s)`;
      if (cooldown <= 0) {
        clearInterval(countdown);
        jammedKey = null;
        gui.style.display = "none";
      }
    }, 1000);
  }, 10000);

  // Intercept key events
  const blockEvent = (e) => {
    if (jammedKey && e.key && e.key.toUpperCase() === jammedKey) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  };

  window.addEventListener("keydown", blockEvent, true);
  window.addEventListener("keypress", blockEvent, true);
  window.addEventListener("keyup", blockEvent, true);
  window.addEventListener("beforeinput", blockEvent, true);
  window.addEventListener("textInput", blockEvent, true);
  window.addEventListener("paste", (e) => {
    if (jammedKey && e.clipboardData) {
      const pasted = e.clipboardData.getData("text");
      if (pasted.toUpperCase().includes(jammedKey)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }
  }, true);

  // MutationObserver: clean injected characters
  const observer = new MutationObserver(() => {
    const inputBox = document.querySelector("input.inputText");
    if (inputBox && jammedKey) {
      inputBox.value = inputBox.value.replace(new RegExp(jammedKey, "ig"), "");
    }
  });

  const observeTarget = setInterval(() => {
    const inputBox = document.querySelector("input.inputText");
    if (inputBox) {
      clearInterval(observeTarget);
      observer.observe(inputBox, { attributes: true, childList: false, subtree: false, characterData: true });
      inputBox.addEventListener("input", () => {
        if (jammedKey) {
          inputBox.value = inputBox.value.replace(new RegExp(jammedKey, "ig"), "");
        }
      });
    }
  }, 500);
})();

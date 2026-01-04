// ==UserScript==
// @name        Whatsapp Web Spammer
// @namespace   @ProdByGR
// @match       https://web.whatsapp.com/*
// @grant       none
// @version     1.1
// @author      @ProdByGR
// @description A userscript that adds a Spam button to WhatsApp Web interface allowing you to send repeated messages with customizable count and timing.
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527466/Whatsapp%20Web%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/527466/Whatsapp%20Web%20Spammer.meta.js
// ==/UserScript==
 
const MESSAGE_PROMT = "Escriba el mensaje:";
const COUNT_PROMT = "Cuántos mensajes quiere enviar:";
const INTERVAL_PROMT = "Cuánto tiempo entre cada mensaje:";
 
function start() {
  const message = prompt(MESSAGE_PROMT);
  if (message === null) return;
 
  const count = prompt(COUNT_PROMT);
  if (count === null) return;
 
  const interval = prompt(INTERVAL_PROMT, "450");
  if (interval === null) return;
 
  const countNum = parseInt(count);
  const intervalNum = parseInt(interval);
 
  if (isNaN(countNum) || isNaN(intervalNum)) {
    alert("Por favor, ingrese números válidos");
    return;
  }
 
  for (let i = 0; i < countNum; i++) {
    setTimeout(() => {
      sendMessage(message);
    }, i * intervalNum);
  }
}
 
async function sendMessage(message) {
  const main = document.querySelector("#main");
 
  main.querySelector(`div._ak1r`).focus();
  await document.execCommand("insertText", false, message);
 
  setTimeout(() => {
    const iconSend =
      main.querySelector('[data-testid="send"]') ||
      main.querySelector('[data-icon="send"]');
    iconSend.click();
  }, 100);
}
 
function addButtonIfNotExists(inputDiv) {
  const existingButton = inputDiv.querySelector("#spam-btn");
  if (existingButton) return;
 
  inputDiv.style.alignItems = "center";
 
  const button = document.createElement("button");
  button.id = "spam-btn";
  button.type = "button";
  button.textContent = "Spam";
  button.style.zIndex = "1000";
  button.style.fontWeight = "bold";
  button.style.padding = "5px 10px";
  button.style.backgroundColor = "#2a3942";
  button.style.color = "#8696a0";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
 
  button.addEventListener("click", start);
 
  inputDiv.appendChild(button);
}
 
function setupObserver() {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        const inputDiv = document.querySelector("div._ak1r");
        if (inputDiv) {
          addButtonIfNotExists(inputDiv);
          observer.disconnect();
        }
      }
    }
  });
 
  const mainContainer = document.querySelector("#main");
  if (mainContainer) {
    observer.observe(mainContainer, {
      childList: true,
      subtree: true,
    });
  }
}
 
window.addEventListener("load", () => {
  setupObserver();
});
 
VM.observe(document.body, () => {
  const inputDiv = document.querySelector("div._ak1r");
  if (inputDiv) {
    setupObserver();
  }
  return false;
});
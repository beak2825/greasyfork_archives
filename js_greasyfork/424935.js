// ==UserScript==
// @name        Google Meet Push-to-Talk
// @namespace   dev.josephgeis.gmptt
// @author      Joseph Geis
// @homepageURL https://josephgeis.dev/
// @description Makes Space into a Push-to-Talk button, makes Shift a PTT for the camera, and makes Enter a shortcut to the chat window.
// @license     MIT
// @version     1.0.2
// @grant       none
// @include     https://meet.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/424935/Google%20Meet%20Push-to-Talk.user.js
// @updateURL https://update.greasyfork.org/scripts/424935/Google%20Meet%20Push-to-Talk.meta.js
// ==/UserScript==

window.microphoneKey = localStorage.getItem('GMPTT_microphoneKey');
if (window.microphoneKey == null) {
  localStorage.setItem('GMPTT_microphoneKey', " ");
  window.microphoneKey = " ";
}

window.cameraKey = localStorage.getItem('GMPTT_cameraKey');
if (window.cameraKey == null) {
  localStorage.setItem('GMPTT_cameraKey', "Shift");
  window.cameraKey = "Shift";
}

window.chatKey = localStorage.getItem('GMPTT_chatKey');
if (window.chatKey == null) {
  localStorage.setItem('GMPTT_chatKey', "Enter");
  window.chatKey = "Enter";
}

function chatHasFocus() {
  return document.querySelector("[id=bfTqV]") === document.activeElement;
}


function microphoneMute(e) {
  if (e.key != window.microphoneKey || chatHasFocus()) return;
  
  let unmute = document.querySelector("[data-is-muted='true'][aria-label*='microphone'][role=button]");
  const mute = document.querySelector("[data-is-muted='false'][aria-label*='microphone'][role=button]");
  
  if (e.type === "keydown") unmute.click();
  if (e.type === "keyup") mute.click();
}

function cameraMute(e) {
  if (e.key != window.cameraKey || chatHasFocus()) return;
  
  const unmute = document.querySelector("[data-is-muted='true'][aria-label*='camera'][role=button]");
  const mute = document.querySelector("[data-is-muted='false'][aria-label*='camera'][role=button]");
  
  if (e.type === "keydown") unmute.click();
  if (e.type === "keyup") mute.click();
}

function chatWindow(e) {
  if (e.key != window.chatKey || chatHasFocus()) return;
  
  const chatMenuButton = document.querySelector("button[aria-label*='Chat']");
  chatMenuButton.click();
}

window.addEventListener("keydown", microphoneMute);
window.addEventListener("keyup", microphoneMute);

window.addEventListener("keydown", cameraMute);
window.addEventListener("keyup", cameraMute);

window.addEventListener("keydown", chatWindow);
window.addEventListener("keyup", chatWindow);


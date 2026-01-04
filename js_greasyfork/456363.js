// ==UserScript==
// @name        Roll20 Sandbox Restarter
// @namespace   Violentmonkey Scripts
// @match       https://app.roll20.net/campaigns/scripts/*
// @grant       none
// @version     1.0
// @author      Lexaire
// @description Restarts your API sandbox if it crashes. Leave open your Mod (API) Scripts page while you play and this will automatically restart it if there are errors.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456363/Roll20%20Sandbox%20Restarter.user.js
// @updateURL https://update.greasyfork.org/scripts/456363/Roll20%20Sandbox%20Restarter.meta.js
// ==/UserScript==

function hasErrors() {
  return $("#errorlock:visible").length !== 0;
}

function restartSandbox() {
  $(".restartsandbox")[0].click();
}

function showStopWatch() {
  $("#sandboxstopicon").show();
}

function hideStopWatch() {
  $("#sandboxstopicon").hide();
}

function checkForErrors() {
  showStopWatch();
  console.log("Sandbox Restarter: Checking for errors");
  if (hasErrors()) {
    console.log("Restarting sandbox...");
    restartSandbox();
    setTimeout(checkForErrors, 5000);
  } else {
    setTimeout(checkForErrors, 2000);
  }
  setTimeout(hideStopWatch, 300);
}

$('.preview').after("<div style='color:red; font-weight:bold'>Sandbox Restarter is watching for errors.<span id='sandboxstopicon'>⏱️</div></div>");
checkForErrors();

// ==UserScript==
// @name         LaunchPad Unlocker
// @description  Enables the questions for LaunchPad videos without having to watch the entire video
// @namespace    ipodtouch0218/Launchpad
// @version      1.0.0
// @include      *://www.macmillanhighered.com/launchpad/*
// @downloadURL https://update.greasyfork.org/scripts/421205/LaunchPad%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/421205/LaunchPad%20Unlocker.meta.js
// ==/UserScript==

//Is ran every time the document changes.
var callback = function(mutationsList, observer) {
  var iframe = document.getElementById("document-body-iframe")
  for (var i = 0; ; i++) {
  	var button = iframe.contentDocument.getElementById("open_sequence_button_" + i)
    if (button == null) break;
    button.removeAttribute("disabled")
    button.setAttribute("aria-disabled", "false")
    button.classList.remove("ui-button-disabled")
    button.classList.remove("ui-state-disabled")
  }
}

//Initiate the DOM observer to run "callback" every time it changes.
var observer = new MutationObserver(callback)
var config = { attributes: false, childList: true, subtree: true }
observer.observe(document, config)
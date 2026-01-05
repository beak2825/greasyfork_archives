// ==UserScript==
// @name         TF2Center Auto-pre-ready
// @namespace    http://Sk1LLb0X.cf/
// @version      0.3
// @description  lazyness
// @author       Sk1LLb0X
// @match        *://tf2center.com/lobbies/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13530/TF2Center%20Auto-pre-ready.user.js
// @updateURL https://update.greasyfork.org/scripts/13530/TF2Center%20Auto-pre-ready.meta.js
// ==/UserScript==

function check() {
  var min = $("div.countitround_seconds > div.countitround_counter > div.countitround_minutes_count").text();
  var sec = $("div.countitround_seconds > div.countitround_counter > div.countitround_seconds_count").text();

  if(min === "" && sec === "" && $("#pre-ready-button").length) {
    $("#pre-ready-button").click();
  }
}

check();
setInterval(function() {
  check();
}, 4000);
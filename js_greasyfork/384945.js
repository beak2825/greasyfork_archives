// ==UserScript==
// @name         zombs.io Anti TC Kurt Messages Lags
// @namespace    -
// @version      0.1
// @description  Press Letter K To Delete Messages Lags If its Too much.
// @author       You
// @match        *://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384945/zombsio%20Anti%20TC%20Kurt%20Messages%20Lags.user.js
// @updateURL https://update.greasyfork.org/scripts/384945/zombsio%20Anti%20TC%20Kurt%20Messages%20Lags.meta.js
// ==/UserScript==

function keyDownF(e) {
  switch (e.keyCode) {
      case 75:
      RMsg();
      R2Msg();
      break;
  }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", keyDownF);
    } else {
        window.addEventListener("keydown", keyDownF);
    }
}, 0);

var dltm = null;
function RMsg() {
  clearInterval(dltm);
  if (dltm !== null) {
    dltm = null;
  } else {
    dltm = setInterval(function() {
      rm = document.getElementsByClassName('hud-chat-message');
      for (var i = 0; i < rm.length; i++) {
        var rems = rm[i];
        rems.remove();
      }
    }, 0);
  }
}

function R2Msg() {
  var remove = document.getElementById("Msg");
  if (remove.innerHTML == "DELETE MESSAGES LAGS OFF") {
    remove.innerHTML = "DELETE MESSAGES LAGS ON";
  } else {
    remove.innerHTML = "DELETE MESSAGES LAGS OFF";
  }
}
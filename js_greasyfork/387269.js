// ==UserScript==
// @name         zombs.io Anti Diss 2.0
// @namespace    -
// @version      0.2
// @description  hit letter K
// @author       LOLOL
// @match        *://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387269/zombsio%20Anti%20Diss%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/387269/zombsio%20Anti%20Diss%2020.meta.js
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
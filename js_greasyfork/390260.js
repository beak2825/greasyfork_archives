// ==UserScript==
// @name         Close Mesingge Hack By:İntikam Reis.
// @namespace    -
// @version      0.1
// @description  Press Letter K To Delete Messages Lags If its Too much.
// @author       İntikam...
// @match        *://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390260/Close%20Mesingge%20Hack%20By%3A%C4%B0ntikam%20Reis.user.js
// @updateURL https://update.greasyfork.org/scripts/390260/Close%20Mesingge%20Hack%20By%3A%C4%B0ntikam%20Reis.meta.js
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
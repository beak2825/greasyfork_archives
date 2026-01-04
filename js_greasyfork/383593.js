// ==UserScript==
// @name         L key.
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383593/L%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/383593/L%20key.meta.js
// ==/UserScript==

window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

function keyDown(e) {
  switch (e.keyCode) {
      case 219:
      speedLeave();
      speedLeave2();
      break;
      case 89:
      accept();
      stopAccept();
      break;
  }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", keyDown);
    } else {
        window.addEventListener("keydown", keyDown);
    }
}, 0);
var Leave = null;

function speedLeave() {
  clearInterval(Leave);
  if (Leave !== null) {
    Leave = null;
  } else {
    Leave = setInterval(function() {
Game.currentGame.network.sendRpc({ "name": "LeaveParty" })
      for (var i = 0; i < Leave.length; i++) {
        var Leave = Leave[i];
      }
    }, 0); // SPEED FOR RUN
  }
}

function speedLeave2() {
  var change5 = document.getElementById("rwp");
  if (change5.innerHTML == "SPEED RUN OFF") {
    change5.innerHTML = "SPEED RUN ON";
  } else {
    change5.innerHTML = "SPEED RUN OFF";
  }
}

var timer = null;

function speed(e) {
    switch (e.keyCode) {
        case 89:
            if (timer == null) {
                timer = setInterval(function() {
document.getElementsByClassName("hud-party-visibility is-private")[0].click();
},0);
            } else {
                clearInterval(timer);
                timer = null;
            }
            break;
    }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", speed);
    } else {
        window.addEventListener("keydown", speed);
    }
}, 0);
var partyspam = null;

function accept() {
  clearInterval(partyspam);
  if (partyspam !== null) {
    partyspam = null;
  } else {
    partyspam = setInterval(function() {
      partys = document.getElementsByClassName('hud-party-linkl');
      for (var i = 0; i < partys.length; i++) {
        var link = partys[i];
        link.click();
      }
      confirm = document.getElementsByClassName('btn btn-green hud-confirmation-accept');
      for (var i2 = 0; i2 < confirm.length; i2++) {
        var accept = confirm[i2];
        accept.click();
      }
    },1);
  }
}
function stopAccept() {
  var change6 = document.getElementById("sap");
  var change7 = document.getElementsByClassName("newpartydiv")[0];
  if (change6.innerHTML == "confirm OFF") {
    change6.innerHTML = "confirm  ON";
    change7.innerHTML = "confirm ON";
  } else {
    change6.innerHTML = "confirm OFF";
    change7.innerHTML = "confirm OFF";
  }
}
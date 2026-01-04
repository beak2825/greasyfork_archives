// ==UserScript==
// @name         Spam 01
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hehehe
// @author       Faqdex
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520220/Spam%2001.user.js
// @updateURL https://update.greasyfork.org/scripts/520220/Spam%2001.meta.js
// ==/UserScript==
'use strict';

function spam(t) {
  var formControls = document.getElementsByClassName("form-control");
  for (var i = 0; i < formControls.length; i++) {
    formControls[i].value = t;
  }

  var submitButtons = document.getElementsByClassName("chatattop-button");
  for (var j = 0; j < submitButtons.length; j++) {
    submitButtons[j].click();
  }
}

function btn(t, e, n, i, u) {
    var d = document.createElement(n);
    return d.style.position = "Fixed", d.style.top = t + "px", d.style.right = e + "px", d.innerHTML = i, d.style.zIndex = "99999999", d.onclick = u, document.body.appendChild(d), d
}
var i = 1,
    timer, message, interval, input = btn(8, 8, "textarea", "", function() {});
input.id = "input", input.placeholder = "Message for spam";
var input2 = btn(62, 8, "input", "", function() {});
input2.id = "input2", input2.placeholder = "Speed";
var start = btn(94, 8, "button", "Start", function() {
        message = document.getElementById("input").value, interval = Number(document.getElementById("input2").value), document.getElementById("input").disabled = !0, document.getElementById("input2").disabled = !0, timer = setInterval(function() {
            spam(message)
        }, interval)
    }),
    stop = btn(94, 75, "button", "Stop", function() {
        clearInterval(timer), document.getElementById("input").disabled = !1, document.getElementById("input2").disabled = !1
    }),
    txt = btn(100, 130, "span", "made by tubers", function() {
        window.open("https://discord.gg/N7ftkcRn")
    });
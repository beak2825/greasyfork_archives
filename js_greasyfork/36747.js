// ==UserScript==
// @name         Duckduckgo - Quick bang
// @namespace    https://openuserjs.org/users/cuzi
// @description  Skip one unnecessary page load and inmediately go to the bang search result on Enter  
// @license      MIT
// @copyright    2017, cuzi (https://openuserjs.org/users/cuzi)
// @version      2
// @include      https://duckduckgo.com/*
// @include      https://start.duckduckgo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36747/Duckduckgo%20-%20Quick%20bang.user.js
// @updateURL https://update.greasyfork.org/scripts/36747/Duckduckgo%20-%20Quick%20bang.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author       cuzi
// ==/OpenUserJS==

"use strict";

const bangUrl = "https://duckduckgo.com/bang.js";
var input;

function load(s) {
  var req = new XMLHttpRequest();
  req.responseType = "json";
  req.open("GET", bangUrl, true);
  req.onload = function () {
    let arr = req.response;
    for (let i = 0; i < arr.length; i++) {
      localStorage.setItem(arr[i]["t"], arr[i]["u"]);
    }
    bang(s);
  };
  req.send(null);
}

function bang(s) {
  try {
    if (!localStorage.getItem("g")) {
      return load(s);
    }
    let m = s.match(/(.*)\!(\w+)(\s*.*)/);
    let t = m[2];
    let q = encodeURIComponent(m[1] + m[3]);
    let u = localStorage.getItem(t);
    document.location.replace(u.replace("{{{s}}}", q));
  }
  catch (e) {
    document.querySelector("input[type=submit]").click();
  }
}

function onsubmit(ev) {
  if (input.value.indexOf("!") !== -1) {
    bang(input.value);
  } else {
    document.querySelector("input[type=submit]").click();
  }
}

(function () {
  input = document.querySelector("input[name=q]");
  if (input) {
    input.addEventListener("keydown", function (ev) {
      if (ev.keyCode === 13) {
        ev.preventDefault();
        return onsubmit.call(this, ev);
      }
    });
  }
})();

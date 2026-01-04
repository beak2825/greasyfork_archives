// ==UserScript==
// @name         TopZhanChangeScore
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://top.zhan.com/toefl/listen/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418582/TopZhanChangeScore.user.js
// @updateURL https://update.greasyfork.org/scripts/418582/TopZhanChangeScore.meta.js
// ==/UserScript==

(function () {
  "use strict";
  window.addEventListener("load", () => {
    addButton("changeScore", changeScore);
  });

  function addButton(text, onclick, cssObj) {
    cssObj = cssObj || {
      position: "absolute",
      bottom: "10%",
      left: "45%",
      "z-index": 15,
      color: "#F72670",
      background: "#2ecc71",
    };
    let button = document.createElement("button"),
      btnStyle = button.style;
    document.body.appendChild(button);
    button.innerHTML = text;
    button.onclick = onclick;
    Object.keys(cssObj).forEach((key) => (btnStyle[key] = cssObj[key]));
    return button;
  }

  function changeScore() {
    var score = 27;
    document.getElementsByClassName("sbq state1")[0].style = "left: 86.77003%";
    document.getElementsByClassName("shk")[0].style = "width: 90%";
    document.getElementsByClassName(
      "js_listen_score font-big"
    )[0].innerHTML = score;
    document.querySelector(
      "body > div.wrap.zhan > div.main.zhan-main.main-single > div > div.floatlayer.single-listen > div > p > i.font-big.js_listen_score"
    ).innerHTML = score;
    alert("Change Successly!");
  }

  // Your code here...
})();

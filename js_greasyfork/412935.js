// ==UserScript==
// @name        Naruto Arena Fullscreen
// @description Allows Naruto Arena to run in full screen. Supports mobile.
// @version     1
// @namespace   https://greasyfork.org/users/694202
// @grant       none
// @include     https://naruto-arena.net/*/selection
// @include     https://naruto-arena.net/*/battle
// @downloadURL https://update.greasyfork.org/scripts/412935/Naruto%20Arena%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/412935/Naruto%20Arena%20Fullscreen.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.textContent = `
  body > *:not(#root):not(#cursor):not(#shuri) {
    display: none !important;
  }

  body {
    width: 100vw;
    height: 100vh;
  }

  #root {
    top: 50%;
    left: 50%;
  }
`;

var head = document.querySelector("head");
head.appendChild(style);

var body = document.querySelector("body");
var root = document.querySelector("#root");

function scale() {
  var scale = Math.min(
    body.offsetWidth / root.offsetWidth,
    body.offsetHeight / root.offsetHeight
  );
  
  root.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
}

window.onresize = scale;
scale();
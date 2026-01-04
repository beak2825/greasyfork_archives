// ==UserScript==
// @name         PUBVN Keyboard control
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  PUBVN Keyboard control with left and right arrow
// @author       You
// @match        http://pubvn.net/bar/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pubvn.net
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/471176/PUBVN%20Keyboard%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/471176/PUBVN%20Keyboard%20control.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function onKeyAction(action) {
    if (window.self !== window.top) {
      const btn = document.querySelector(
        action === "next" ? ".vjs-forward-control" : ".vjs-rewind-control"
      );
      btn.click();
      return;
    }
    const iframe = document.getElementById("container");
    const btn = iframe.contentWindow.document.querySelector(
      action === "next" ? ".vjs-forward-control" : ".vjs-rewind-control"
    );
    btn.click();
  }
  document.onkeydown = function (event) {
    switch (event.keyCode) {
      case 37:
        onKeyAction("prev");
        break;
      case 39:
        onKeyAction("next");
        break;
    }
  };
  var origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    console.log("request started!");
    // Check request contains "vasibanip.php", if yes, block it
    if (arguments[1].indexOf("vasibanip.php") > -1) {
      console.log("blocked");
      return;
    }
    origOpen.apply(this, arguments);
  };
  const style = `#player {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: black;
    width: 100% !important;
    height: 100% !important;
    max-height: 100% !important;
    max-width: 100% !important;
  }
  #player iframe {
    width: 80vw;
    height: 90vh;
  }`;
  const styleEl = document.createElement("style");
  styleEl.innerHTML = style;
  document.body.appendChild(styleEl);
})();
// ==UserScript==
// @name         Fjern Ekstrabladet overlay
// @namespace    https://hamdenkloge.dk/
// @downloadUrl  https://hamdenkloge.dk/code/eb.js
// @version      0.8
// @description  Fjerner irriterende overlay på Ekstrabladet, når man benytter ad-blocker
// @author       stallemanden
// @match        https://ekstrabladet.dk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372293/Fjern%20Ekstrabladet%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/372293/Fjern%20Ekstrabladet%20overlay.meta.js
// ==/UserScript==

(function () {

  var xx = document.querySelectorAll("div");

  for (var i = 0; i < xx.length; i++) {
    if (xx[i].style.zIndex == "997979") {
      xx[i].remove();
    }
  }
})();
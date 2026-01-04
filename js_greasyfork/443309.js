// ==UserScript==
// @name     Hide ads on onvista.de
// @match    https://www.onvista.de/*
// @license GPL-v3
// @namespace https://github.com/philippludwig
// @description Hide the ads on onvista.de
// @version  1
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/443309/Hide%20ads%20on%20onvistade.user.js
// @updateURL https://update.greasyfork.org/scripts/443309/Hide%20ads%20on%20onvistade.meta.js
// ==/UserScript==

window.onload = function() {
  window.setTimeout(function() {
    divs = document.getElementsByTagName("div");

    for(var i=0; i<divs.length; i++) {
      var height = divs[i].clientHeight;
      var width = divs[i].clientWidth;
      if (width == 974 && height == 270) {
        divs[i].hidden = true;
      }
      if (width == 300 && height == 571) {
        divs[i].hidden = true;
      }
    }
  }, 100);
};

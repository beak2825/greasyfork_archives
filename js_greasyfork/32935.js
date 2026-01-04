// ==UserScript==
// @name        Anti-Adblock-Harassment-for-golem.de
// @namespace   anti-adblock-harassment-for-golem-de
// @description This script makes the pages of golem.de usable again for people with adblockers installed.
// @include     http://www.golem.de/*
// @include     http://forum.golem.de/*
// @include     https://www.golem.de/*
// @include     https://forum.golem.de/*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32935/Anti-Adblock-Harassment-for-golemde.user.js
// @updateURL https://update.greasyfork.org/scripts/32935/Anti-Adblock-Harassment-for-golemde.meta.js
// ==/UserScript==

var className       = "formatted";
var identifyingText = "ADBLOCKER ERKANNT"

//adblocker warning is not present on load; injected at a later point in time
theInterval = window.setInterval(main, 100);

function main() {
  var rootWrapper = document.getElementsByTagName("article");

  if (rootWrapper.length != 0) {
    elem = rootWrapper[0];
    style = window.getComputedStyle(elem);
    filter = style.getPropertyValue("filter");

    // If the article has been blurred
    if (filter.substring(0, 4).toLowerCase() == "blur") {
      elem.style = "background-color: #fff";

      elem.parentNode.removeChild(elem.nextSibling);

      //harassment is removed, so stop scanning
      clearInterval(theInterval);
    }
  }
}

// ==UserScript==
// @name         Toggle Sidebar
// @namespace    http://tampermonkey.net/
// @version      2024-12-10
// @description  Hides the dang side bar
// @author       mdawe
// @match        https://oldschool.runescape.wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=runescape.wiki
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520282/Toggle%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/520282/Toggle%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const toggleSideBar = () => {
      if (document.getElementById("mw-panel").style.display === "none") {
        document.getElementById("content").style.marginLeft = "11em";
        document.getElementById("mw-panel").style.display = "block";
      } else {
        document.getElementById("mw-panel").style.display = "none";
        document.getElementById("content").style.marginLeft = "0px";
      }
    };

    const button = document.createElement("button");
    button.addEventListener('click', toggleSideBar);
    button.appendChild(document.createTextNode("Toggle Sidebar"));
    button.style.cssText = "border:none;margin-top:3.1em;height:40px;padding:0 0.75em;font-size:0.8125em;"
    document.getElementById("mw-head").prepend(button);
})();
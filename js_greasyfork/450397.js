// ==UserScript==
// @name         JSFiddle: open in JavaScript tab
// @namespace    https://github.com/marcodallagatta/userscripts/raw/main/jsfiddle-open-js-tab
// @version      2022.08.28.12.16
// @description  Defaults to the JavaScript tab in JSFiddle. Tiny, but tiny savings compound!
// @author       Marco Dalla Gatta
// @match        https://jsfiddle.net/*
// @icon         https://icons.duckduckgo.com/ip2/jsfiddle.net.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450397/JSFiddle%3A%20open%20in%20JavaScript%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/450397/JSFiddle%3A%20open%20in%20JavaScript%20tab.meta.js
// ==/UserScript==

(function () {
  "use strict";

  window.addEventListener("load", function () {

      const tabs = document.querySelectorAll("#tabs > ul > .tabItem");

      tabs.forEach((tab, index) => {
        if (index === 1) {
          tab.classList.add("active");
        } else {
          tab.classList.remove("active");
        }
      });

      const screens = document.querySelectorAll('.tabsContainer .tabCont');

      screens.forEach((screen, index) => {
        if (index !== 1) {
          screen.classList.add("hidden");
        } else {
          screen.classList.remove("hidden");
        }
      });

    }, false);

})();

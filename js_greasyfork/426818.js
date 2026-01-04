// ==UserScript==
// @name         blitz doc light theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  blitz doc
// @author       You
// @match        https://blitzjs.com/*
// @icon         https://www.google.com/s2/favicons?domain=blitzjs.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426818/blitz%20doc%20light%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/426818/blitz%20doc%20light%20theme.meta.js
// ==/UserScript==

"use strict";
(function () {
  window.addEventListener("load", () => {
    if (localStorage.getItem("theme") === "light") {
      document.getElementsByTagName("html")[0].classList.remove("dark");
    }
  });
})();
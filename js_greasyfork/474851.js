// ==UserScript==
// @name         Debloat Letterboxd
// @namespace    https://greasyfork.org/en/users/1169041-jothi-prasath
// @version      1.1
// @description  Removes Ads and banners
// @author       Jothi Prasath
// @homepage     https://github.com/jothi-prasath/userscripts
// @supportURL   https://github.com/jothi-prasath/userscripts/issues/new
// @match        https://letterboxd.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474851/Debloat%20Letterboxd.user.js
// @updateURL https://update.greasyfork.org/scripts/474851/Debloat%20Letterboxd.meta.js
// ==/UserScript==

(function () {
  // Removes Banner in home
  var elements = document.getElementsByClassName("banner");
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }

  // Removes remove ads text
  var elements = document.getElementsByClassName("upgrade-kicker");
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
})();

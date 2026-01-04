// ==UserScript==
// @name         Brute Force McGrawHill - Canvas Instructure
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      0.1
// @description  Brute Force McGrawHill external assignments "If your assignment hasn't launched, click the button below".
// @author       hacker09
// @match        https://*.mheducation.com/*
// @icon         https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465977/Brute%20Force%20McGrawHill%20-%20Canvas%20Instructure.user.js
// @updateURL https://update.greasyfork.org/scripts/465977/Brute%20Force%20McGrawHill%20-%20Canvas%20Instructure.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector("button.button--check-my-work").click();
  document.querySelector("span.l-relative.worksheet--input_response.NU > input").value = "increase";

  //document.querySelectorAll('div.worksheet--multiple-choice-radio').forEach
})();
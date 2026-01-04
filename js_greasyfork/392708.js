// ==UserScript==
// @name        ching
// @namespace    https://www.pt-motors.tw/reg5da349e95a911.htm
// @version      0.6
// @description  test.
// @author       You
// @match      https://www.pt-motors.tw/reg5da349e95a911.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392708/ching.user.js
// @updateURL https://update.greasyfork.org/scripts/392708/ching.meta.js
// ==/UserScript==
(function() {
  localStorage.clear();
  console.log("clear");
  setTimeout(function() {window.location.reload()}, Math.floor(Math.random()*600000));
})();
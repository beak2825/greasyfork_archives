// ==UserScript==
// @name        Pluralsight True Continuous Play
// @description Auto play next module after the end of the current module.
// @author      Flandre
// @include     https://app.pluralsight.com/*
// @version     1
// @namespace   https://greasyfork.org/users/686309-flandre-x
// @downloadURL https://update.greasyfork.org/scripts/411095/Pluralsight%20True%20Continuous%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/411095/Pluralsight%20True%20Continuous%20Play.meta.js
// ==/UserScript==

setInterval(function () {
  try {
    var button = document.querySelector('div.player-modal.is-active button[data-css-176v989].u-full-width');
    button && button.click();
  } catch (e) {
    console.log(e);
  }
}, 5000);
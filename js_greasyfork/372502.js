// ==UserScript==
// @name         I_FollowYou
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Follow
// @author       gavelweb
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372502/I_FollowYou.user.js
// @updateURL https://update.greasyfork.org/scripts/372502/I_FollowYou.meta.js
// ==/UserScript==

window.addEventListener('DOMContentLoaded', function() {
  setInterval(function() {
    var elArrButtons = [];
    var filterArrButtons = [];
    elArrButtons = document.getElementsByClassName('L3NKy');
    for (var c = 0; c <= elArrButtons.length - 1; c++) {
      var x = elArrButtons[c].classList;
      x = x.value.split(" ");
      if (x[6] != '_8A5w5') {
        filterArrButtons.push(elArrButtons[c]);
      }
    }
    for (var x = 0; x <= filterArrButtons.length - 1; x++) {
      var df = filterArrButtons[x].classList;
      df = df.value.split(" ");
      simulateCliks(filterArrButtons[x], "click");
    }
  }, 10000);

});

function simulateCliks(el, evntType) {
  if (el.fireEvent) {
    el.fireEvent('on' + evntType);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(evntType, true, false);
    el.dispatchEvent(evObj);
  }
}
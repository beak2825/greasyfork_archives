// ==UserScript==
// @name        prev-next-shortcut
// @namespace   Violentmonkey Scripts
// @match       https://www.javatpoint.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 1/4/2023, 5:05:21 pm
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463101/prev-next-shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/463101/prev-next-shortcut.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Your code here...
  let nxt = document.querySelector('#bottomnextup a');
  let prev = document.querySelector('#bottomnextup a+a');

  function KeyPress(e) {
    var evtobj = window.event ? event : e;
    if (evtobj.keyCode == 39 && evtobj.ctrlKey) {
      console.log('Ctrl + -->');
      nxt.click();
    } else if (evtobj.keyCode == 37 && evtobj.ctrlKey) {
      console.log('Ctrl + <--');
      prev.click();
    }
  }

  document.onkeydown = KeyPress;
})();

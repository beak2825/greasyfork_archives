// ==UserScript==
// @name         Udacity "Next" clicker (Nanodegree program)
// @namespace    https://openuserjs.org/users/uzbek
// @licence      MIT
// @copyright    2021, Uzbek (https://openuserjs.org/users/uzbek)
// @version      1.1.1
// @description  Don't tire yourself by pressing the Next button! You should only press "s" button.
// @author       Uzbek
// @match        https://classroom.udacity.com/nanodegrees/nd*/*
// @icon         https://visualpharm.com/assets/890/Hacker-595b40b75ba036ed117d616b.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436149/Udacity%20%22Next%22%20clicker%20%28Nanodegree%20program%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436149/Udacity%20%22Next%22%20clicker%20%28Nanodegree%20program%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  document.body.onkeypress = function (e) {
    if (e.code == 'KeyS') {
      sPressed();
    }
  };
})();

function sPressed() {
  if (document.querySelectorAll('.vds-modal').length > 0) {
    let elem = document.querySelectorAll(".vds-modal .vds-button.vds-button--primary");
    if (elem.length > 0) {
      elem[0].click();
      setTimeout(sPressed, 2000);
    }
    else {
      alert('No next button');
    }
  }
  else {
    let elem = document.querySelectorAll("._main--footer-container--3vC-_>button.vds-button.vds-button--secondary");
    if (elem.length > 0) {
      elem[0].click();
      setTimeout(sPressed, 2000);
    }
    else {
      let elem2 = document.querySelector('.index--lesson-card--mwX1V ._lesson-expanded--actions--KkY9y button.vds-button');
      if (elem2) {
        elem2.click();
        setTimeout(sPressed, 2000);
      }
      else {
        alert('No next button');
      }
    }
  }
}

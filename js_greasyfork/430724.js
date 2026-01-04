// ==UserScript==
// @name         Ad-Skipper for Prime Video
// @namespace    https://github.com/morishita4632
// @version      2.0
// @description  Automatically click the "skip" button on Prime Video
// @author       Theta
// @match        https://www.amazon.co.jp/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.co.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430724/Ad-Skipper%20for%20Prime%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/430724/Ad-Skipper%20for%20Prime%20Video.meta.js
// ==/UserScript==


(async function () {
  'use strict';

  let id, count;

  count = 0;

  id = setInterval(func, 200);

  function func() {
    let elem = document.getElementsByClassName('f11v6oas f10h1wbs f1rzw3s8 f164wq86')[0];
    if (elem) count++;

    if (count < 5) {
      console.log(count, elem);
    } else if (count < 10) {
      console.log(count, elem, "click");
      elem.children[0].click();
      count += 5;
    } else if (count < 100) {
      count++;
      console.log(count, elem);
    } else {
      count = 0;
    }
  }

})();
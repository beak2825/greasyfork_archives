// ==UserScript==
// @name         show the quantity of Quora answers
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Show the quantity of Quora answers.
// @author       You
// @match        https://www.quora.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quora.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464807/show%20the%20quantity%20of%20Quora%20answers.user.js
// @updateURL https://update.greasyfork.org/scripts/464807/show%20the%20quantity%20of%20Quora%20answers.meta.js
// ==/UserScript==

(function() {
    'use strict';

  var checkExist = setInterval(function() {
      var showAns = document.querySelector('.q-inlineBlock.qu-width--16.qu-height--16.qu-ml--tiny');
      if(showAns){
         showAns.click();
          clearInterval(checkExist);
       }
      var extendedlist = document.querySelectorAll('.q-text.qu-dynamicFontSize--small.qu-color--gray_dark');
      var ansNode = extendedlist[1];
      var anserNum = ansNode.innerHTML;
      console.log("#quora:"+ anserNum);
      var showAnwNum = document.createElement("div");
      showAnwNum.innerHTML = anserNum;
      let nodeinsertTo = document.querySelector(".q-flex.qu-alignItems--center.qu-py--small.qu-justifyContent--space-between");
      nodeinsertTo.insertBefore(showAnwNum, nodeinsertTo.lastElementChild);
      showAns.click();
   }, 1000);
})();
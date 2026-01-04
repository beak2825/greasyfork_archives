// ==UserScript==
// @name         Leetcode problem enumerator
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Enumerates leetcode problems in company problem sets
// @author       Someone
// @match        https://leetcode.com/company/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539252/Leetcode%20problem%20enumerator.user.js
// @updateURL https://update.greasyfork.org/scripts/539252/Leetcode%20problem%20enumerator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    setInterval(function() {
      let questions = document.getElementsByClassName('ellipsis line-clamp-1')
      for(let i = 0; i < questions.length; ++i){
          let expected = `[Q${i+1}] `
          if(questions[i].innerText[0] !== '['){
              questions[i].innerText = expected + questions[i].innerText
          } else if(!(questions[i].innerText.startsWith(expected))) {
              questions[i].innerText = questions[i].innerText.replace(/\[[^\]]+\]/, expected);
          }
      }
    }, 1000);
})();
// ==UserScript==
// @name         Toefl KMF mask remove
// @version      1
// @description  Remove Toefl KMF mask and IP restriction
// @match        https://toefl.kmf.com/*
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1295998
// @downloadURL https://update.greasyfork.org/scripts/493961/Toefl%20KMF%20mask%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/493961/Toefl%20KMF%20mask%20remove.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
      document.getElementsByClassName("practice-container js-practice-container")[0].classList.remove("blur");
      var shieldBoxList = document.getElementsByClassName("shield-box js-shield-box");
      shieldBoxList[0].parentNode.removeChild(shieldBoxList[0]);
    },5000);
})();
// ==UserScript==
// @name        Wanikani Breeze Dark
// @namespace   blacktide
// @description Wanikani Breeze Dark CSS theme enabled via Greasy Fork
// @version     1.3.18
// @match       https://www.wanikani.com/*
// @match       https://preview.wanikani.com/*
// @run-at      document-start
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/453010/Wanikani%20Breeze%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/453010/Wanikani%20Breeze%20Dark.meta.js
// ==/UserScript==

(function() {
    function addCss(fileName) {
      var head = document.head;
      var link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = fileName;
      head.appendChild(link);
    }
    
    addCss('https://valeth.gitlab.io/wanikani-breeze-dark/wanikani_breeze_dark.user.css');
})();
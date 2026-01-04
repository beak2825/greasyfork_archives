// ==UserScript==
// @name         Gechun LIN Helper
// @version      0.1.0
// @description  corolho
// @author       lucassilvas1
// @match        http*://www.mturkcontent.com/dynamic/hit*
// @grant        GM_addStyle
// jshint        esversion: 8
// @namespace https://greasyfork.org/users/846945
// @downloadURL https://update.greasyfork.org/scripts/443542/Gechun%20LIN%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/443542/Gechun%20LIN%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const ads = document.querySelectorAll(".outerbox");
  if (ads.length) {
    const goodHints = [
      "donat",
      "chip in",
      "double",
      "gift",
      "give",
      "contribute",
      "rush",
      "raise",
      "fund",
    ];

    const badHints = [
      "sign up",
      "petition",
      "survey",
      "poll",
      "quiz",
      "join me",
      "take the pledge",
      "pledge to vote",
      "register now",
      "add your name",
      "learn more",
      "vote for",
      "food",
      "water",
    ];

    function addStyles() {
      GM_addStyle(".good-hint{color:green;}.bad-hint{color:orangered}");
    }

    function highlightKeywords(html) {
      for (const hint of goodHints) {
        html = html.replace(RegExp(hint, "i"), "<b class='good-hint'>$&</b>");
      }
      for (const hint of badHints) {
        html = html.replace(RegExp(hint, "i"), "<b class='bad-hint'>$&</b>");
      }
      return html;
    }

    function getInnerHTML(element) {
      for (const child of [...element.children]) {
        getInnerHTML(child);
      }
      element.innerHTML = highlightKeywords(element.innerHTML);
    }

    function run() {
      addStyles();
      for (const ad of ads) getInnerHTML(ad);
    }

    run();
  }
})();

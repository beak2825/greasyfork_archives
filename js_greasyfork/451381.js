// ==UserScript==
// @name         MAL Overall Rating Fix
// @version      1
// @author       ateks
// @namespace    https://greasyfork.org/users/959296
// @description  Puts the overall ratings of reviews back to the top.
// @match        https://myanimelist.net/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451381/MAL%20Overall%20Rating%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/451381/MAL%20Overall%20Rating%20Fix.meta.js
// ==/UserScript==

(function() {
  "use strict";
    function container(score) {
      var temp = document.createElement("template");
      temp.innerHTML = "<div class='floatRightHeader'><a>Overall Rating</a>: " + score + "</div>";
      return temp.content.firstChild;
    }
    var reviews = document.querySelectorAll(".review-element");
    reviews.forEach((review) => {
      var header = review.querySelector(".tags");
      var score = review.querySelector(".rating > .num").textContent;
      header.appendChild(container(score));
    })
})();
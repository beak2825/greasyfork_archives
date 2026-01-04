// ==UserScript==
// @name         smilies
// @namespace    -
// @version      0.3
// @description  -
// @author       -
// @match        https://devcore.fun/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=devcore.fun
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485901/smilies.user.js
// @updateURL https://update.greasyfork.org/scripts/485901/smilies.meta.js
// ==/UserScript==

(function () {
  "use strict";
  if (
    window.location.pathname.startsWith("/chatbox/") ||
    window.location.pathname.startsWith("/forums/-/list")
  ) {
    $("img.smilie").on("click", function (event) {
      var ed = document
        .querySelector("form[action='/chatbox/submit']")
        .querySelector("input");
      ed.value = ed.value + " " + event.target.getAttribute("alt") + " ";
    });
  } else {
    $("img.smilie").on("click", function (el) {
      var ed = document
        .querySelector(".message--quickReply")
        .querySelector("p");

      ed.insertAdjacentHTML("beforeend", " " + event.target.outerHTML + " ");
      var index = ed.innerHTML.lastIndexOf("<br>");
      if (index !== -1) {
        ed.innerHTML =
          ed.innerHTML.substring(0, index) + ed.innerHTML.substring(index + 4);
      }
    });
  }
})();

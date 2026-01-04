// ==UserScript==
// @name         Word Count
// @namespace    http://tampermonkey.net/
// @version      2024-01-24
// @description  Count the words on mdn pages.
// @author       You
// @match        https://developer.mozilla.org/en-US/docs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485545/Word%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/485545/Word%20Count.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var Elements = document.querySelectorAll("p,a");
  var totalLength = 0;

  for (var i = 0; i < Elements.length; i++) {
    totalLength += Elements[i].textContent.split(" ").length;
  }

  var div = document.createElement("div");

  div.innerHTML = totalLength;
  div.style.position = "fixed";
  div.style.right = "20px";
  div.style.bottom = "20px";
  div.style.padding = "10px";
  div.style.backgroundColor = "#f0f0f0";
  div.style.borderRadius = "5px";

  document.body.appendChild(div);
})();

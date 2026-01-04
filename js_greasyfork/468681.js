// ==UserScript==
// @name         Kbin: Move comment box to top
// @match        https://kbin.social/*
// @match        https://fedia.io/*
// @match        https://karab.in/*
// @version      1.0
// @description  Moves the comment box at the bottom of a comment thread to the top of the page.
// @author       Timwi
// @namespace    https://greasyfork.org/en/users/1098822-timwi
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468681/Kbin%3A%20Move%20comment%20box%20to%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/468681/Kbin%3A%20Move%20comment%20box%20to%20top.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Find the comment-add box
  var commentAdd = document.getElementById('comment-add');

  // Move it up
  var insertBef = document.getElementById('options');
  insertBef.parentNode.insertBefore(commentAdd, insertBef);
})();

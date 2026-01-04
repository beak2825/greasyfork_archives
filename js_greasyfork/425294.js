// ==UserScript==
// @name   Github search open in new tab
// @namespace  bethropolis.github
// @match  https://github.com/search?*
// @version  1.0
// @homepage https://greasyfork.org/en/scripts/425294-github-search-open-in-new-tab
// @description open search results in new tab.
// @license MIT
// @copyright 2021, Jav_bethro (https://github.com/bethropolis)
// @downloadURL https://update.greasyfork.org/scripts/425294/Github%20search%20open%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/425294/Github%20search%20open%20in%20new%20tab.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let a = document.querySelectorAll(".repo-list")
  a.forEach(function (ca) {
    ca.querySelector('a').setAttribute('target', '_blank')
  })
  // Your code here...
})();
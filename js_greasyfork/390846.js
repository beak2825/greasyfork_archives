// ==UserScript==
// @name         Scroll to download kurogaze
// @namespace    https://greasyfork.org/en/users/158832
// @version      0.3
// @description  try to make your life easier!
// @author       Riztard
// @match        https://www.kurogaze.in/*indonesia*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390846/Scroll%20to%20download%20kurogaze.user.js
// @updateURL https://update.greasyfork.org/scripts/390846/Scroll%20to%20download%20kurogaze.meta.js
// ==/UserScript==

(function () {
  'use strict';

  setTimeout(func, 3000);

  function func() {

    var el = document.getElementsByClassName('dl-box')[0];
    el.scrollIntoView(false);
    window.scrollBy(0, 200)
  }
})();

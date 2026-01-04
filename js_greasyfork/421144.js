// ==UserScript==
// @name         Empty user info and function bar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       chunyi.mo
// @match        https://blog.51cto.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421144/Empty%20user%20info%20and%20function%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/421144/Empty%20user%20info%20and%20function%20bar.meta.js
// ==/UserScript==

(function() {
  'use strict';
   const timer = setInterval(() => {
    const pageContentLeft = document.querySelector(".page-content-left");
    const pageContentRight = document.querySelector(".page-content-right");
    const functionBar = document.querySelector(".page-content-right .function-bar");
    if (pageContentLeft && pageContentRight && functionBar) {
      pageContentLeft.style.display = 'none';
      pageContentRight.style.width = 'auto';
      functionBar.style.display = 'none'
      clearInterval(timer);
    }
   }, 10)
})();
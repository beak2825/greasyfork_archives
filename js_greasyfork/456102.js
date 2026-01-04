// ==UserScript==
// @name         网站去除变黑效果
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  网站去除变黑效果111
// @author       You1
// @match        *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none1
// @downloadURL https://update.greasyfork.org/scripts/456102/%E7%BD%91%E7%AB%99%E5%8E%BB%E9%99%A4%E5%8F%98%E9%BB%91%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/456102/%E7%BD%91%E7%AB%99%E5%8E%BB%E9%99%A4%E5%8F%98%E9%BB%91%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==
// @license MIT

(function() {
    'use strict';

    // Your code here...
    setInterval(function () {
  document.querySelectorAll("*").forEach(function (e) {
    var s = getComputedStyle(e);
    e.style.setProperty(
      "filter",
      s.filter && s.filter.replace(/grayscale\(.*?\)/g, "grayscale(0)"),
      "important"
    );
    e.style.setProperty(
      "-webkit-filter",
      s.webkitFilter &&
        s.webkitFilter.replace(/grayscale\(.*?\)/g, "grayscale(0)"),
      "important"
    );
  });
}, 0);
})();
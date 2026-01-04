// ==UserScript==
// @name         阻止新标签页打开
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       logeast
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406497/%E9%98%BB%E6%AD%A2%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/406497/%E9%98%BB%E6%AD%A2%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  const removeATarget = () => {
    [...document.querySelectorAll("a")].map((item) => {
      item.target = "_self";
    });
  };

  ["load", "hashchange"].forEach((item) => {
    window.addEventListener(item, removeATarget);
    document.getElementById('taw').remove();
  });
})();

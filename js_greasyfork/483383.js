
// ==UserScript==
// @name         更改網頁文字顏色2.0
// @namespace    http://tampermonkey.net/
// @version      2023-12-29
// @description  be made by jay13345
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mit.edu
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483383/%E6%9B%B4%E6%94%B9%E7%B6%B2%E9%A0%81%E6%96%87%E5%AD%97%E9%A1%8F%E8%89%B220.user.js
// @updateURL https://update.greasyfork.org/scripts/483383/%E6%9B%B4%E6%94%B9%E7%B6%B2%E9%A0%81%E6%96%87%E5%AD%97%E9%A1%8F%E8%89%B220.meta.js
// ==/UserScript==

(function() {
    'use strict';

     let colors = ["black", "gray", "purple", "green", "blue", "yellow", "red", "original"];
let index = 0;
function changeTextColor() {
  document.body.style.color = colors[index];
  index = (index + 1) % colors.length;
}
document.addEventListener("keydown", function(event) {
  if (event.code === "KeyR") {
    changeTextColor();
  }
});
})();
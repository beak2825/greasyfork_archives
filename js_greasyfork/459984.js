// ==UserScript==
// @name        change_intput_password_to_text
// @namespace   Violentmonkey Scripts
// @include     *
// @grant       none
// @version     0.0.1
// @author      liudonghua123
// @description 5/25/2021, 11:02:03 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459984/change_intput_password_to_text.user.js
// @updateURL https://update.greasyfork.org/scripts/459984/change_intput_password_to_text.meta.js
// ==/UserScript==

(function changeInputPasswordToText() {
  for(const input of document.querySelectorAll("input[type='password']")) {
    console.info(`change input type from password to text for input`, input)
    input.type = 'text';
  }
})()
// ==UserScript==
// @name         BIT-Programming-Jump to result
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  提交之后自动单击“查看结果”
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/YDX-2147483647/BIT-enhanced/issues
// @author       Y.D.X.
// @match        https://lexue.bit.edu.cn/mod/programming/submit.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471014/BIT-Programming-Jump%20to%20result.user.js
// @updateURL https://update.greasyfork.org/scripts/471014/BIT-Programming-Jump%20to%20result.meta.js
// ==/UserScript==

(function () {
  'use strict'
  function jump_to_result () {
    const button = document.querySelector('a[href^=result]')
    if (button) {
      button.click()
    }
  }
  window.setInterval(jump_to_result, 1000)
})()

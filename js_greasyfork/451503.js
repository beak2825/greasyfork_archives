// ==UserScript==
// @name         ptt年齡認証按鈕自動點選
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自動點選ptt年齡認証鈕
// @author       You
// @match        https://www.ptt.cc/ask/over18?*
// @grant        none
// @icon         https://term.ptt.cc/assets/logo_connect.c8fa42175331bab52f24fd5e64cf69bb.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451503/ptt%E5%B9%B4%E9%BD%A1%E8%AA%8D%E8%A8%BC%E6%8C%89%E9%88%95%E8%87%AA%E5%8B%95%E9%BB%9E%E9%81%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/451503/ptt%E5%B9%B4%E9%BD%A1%E8%AA%8D%E8%A8%BC%E6%8C%89%E9%88%95%E8%87%AA%E5%8B%95%E9%BB%9E%E9%81%B8.meta.js
// ==/UserScript==

(async function() {
document.getElementsByClassName("btn-big")[0].click();;
})();
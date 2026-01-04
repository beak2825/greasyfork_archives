// ==UserScript==
// @name         google search 自動點開[工具]
// @namespace    https://greasyfork.org/users/110545
// @version      0.2
// @description  在搜尋結果畫面自動點開[工具]
// @author       x94fujo6
// @match        https://www.google.com/search?*
// @exclude      https://www.google.com/search?*&tbs=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432194/google%20search%20%E8%87%AA%E5%8B%95%E9%BB%9E%E9%96%8B%5B%E5%B7%A5%E5%85%B7%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/432194/google%20search%20%E8%87%AA%E5%8B%95%E9%BB%9E%E9%96%8B%5B%E5%B7%A5%E5%85%B7%5D.meta.js
// ==/UserScript==

(function() {
    window.onload = () => [...document.querySelectorAll("div")].filter(e => e.textContent == "工具" && !e.childElementCount).shift()?.click()
})();
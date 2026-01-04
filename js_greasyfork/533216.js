// ==UserScript==
// @name         预警标签添加文字
// @namespace    http://tampermonkey.net/
// @version      2025-04-18-002
// @description  猜不到用在哪里吧！
// @author       You
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scopus.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533216/%E9%A2%84%E8%AD%A6%E6%A0%87%E7%AD%BE%E6%B7%BB%E5%8A%A0%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/533216/%E9%A2%84%E8%AD%A6%E6%A0%87%E7%AD%BE%E6%B7%BB%E5%8A%A0%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
setInterval(() => {
    for (const s of document.querySelectorAll("span.scolor-sos")) {
        if (!s.dataset.txt) {
            s.dataset.txt="预警"
            var newTextNode = document.createElement("span")
            newTextNode.style.color = "red"
            newTextNode.textContent = "预警 " + s.title.split(/《|》|预警/)[1] //title.indexOf("预警"))
            newTextNode.className = "sos-text"
            s.appendChild(newTextNode);
        }
    }
},100)
})();
// ==UserScript==
// @name         片单辅助
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://jingyan.baidu.com/showlist/add
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390643/%E7%89%87%E5%8D%95%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/390643/%E7%89%87%E5%8D%95%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    let style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(".v-select-item[_v-4a243f72]{padding:5px 0;overflow:inherit;}"));
    let head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
})();
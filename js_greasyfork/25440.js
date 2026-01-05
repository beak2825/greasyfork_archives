// ==UserScript==
// @name         华文细黑字体
// @version      2.1
// @description  修改默认字体为 STHeiti
// @author       Boyden
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/25440/%E5%8D%8E%E6%96%87%E7%BB%86%E9%BB%91%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/25440/%E5%8D%8E%E6%96%87%E7%BB%86%E9%BB%91%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==
(function() {
    var font =document.createElement("style");
    font.type="text/css";
    font.innerHTML = "*{font-family:STXihei!important}";
    var html = document.getElementsByTagName("head");
    if (html!==null)
    	html[0].appendChild(font);
})();
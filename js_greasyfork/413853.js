// ==UserScript==
// @name         remove-gaoding-watermark
// @namespace    remote-gaoding-watermark
// @version      1.4
// @description  移除搞定设计水印
// @author       sertraline
// @match        https://www.gaoding.com/design*
// @match        https://www.gaoding.com/odyssey/design*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413853/remove-gaoding-watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/413853/remove-gaoding-watermark.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode(".editor-watermark{filter: opacity(0)!important;}");
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
    console.log("水印已去除")
    // Your code here...
})();
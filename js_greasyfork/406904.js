// ==UserScript==
// @name         Highlight Clicked button
// @namespace    http://tampermonkey.net/sftec
// @version      0.3
// @description  it will highlight a tags you clicked.
// @author       sftec
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/406904/Highlight%20Clicked%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/406904/Highlight%20Clicked%20button.meta.js
// ==/UserScript==

(function() {
var style = document.createElement("style");
style.type = "text/css";
var text = document.createTextNode("a:visited,a:active,a:hover{color:#800000!important;}");
style.appendChild(text);
var head = document.getElementsByTagName("head")[0];
head.appendChild(style);
})();
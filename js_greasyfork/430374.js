// ==UserScript==
// @name         bybt css
// @namespace    http://tampermonkey.net/sftec
// @version      0.1
// @description  it will highlight a tags you clicked.
// @author       sftec
// @match        https://www.bybt.com/*
// @downloadURL https://update.greasyfork.org/scripts/430374/bybt%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/430374/bybt%20css.meta.js
// ==/UserScript==

(function() {
var style = document.createElement("style");
style.type = "text/css";
var text = document.createTextNode(".chart-gui-wrapper,.theme-dark .chart-gui-wrapper{background-image:none!important;}.logo img,.bybt-chart-logo{display:none!important;}");
style.appendChild(text);
var head = document.getElementsByTagName("head")[0];
head.appendChild(style);
})();
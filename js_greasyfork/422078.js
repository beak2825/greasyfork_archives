// ==UserScript==
// @name         Cytube-unspoiler
// @namespace    https://greasyfork.org/en/users/739378-hufihgfskhgkfukjhg
// @version      2
// @description  Makes spoilered text in cytube chat permanently visible (grey).
// @author       (You)
// @match        https://cytu.be/r/*
// @match        https://cytube.xyz/r/*
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422078/Cytube-unspoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/422078/Cytube-unspoiler.meta.js
// ==/UserScript==

var cssStyle = document.createElement('style');
cssStyle.type = 'text/css';
var rules = document.createTextNode(".spoiler{color: #777}");
cssStyle.appendChild(rules);
document.getElementsByTagName("head")[0].appendChild(cssStyle);

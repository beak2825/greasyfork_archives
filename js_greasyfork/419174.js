// ==UserScript==
// @name         My_one
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       Ljs
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419174/My_one.user.js
// @updateURL https://update.greasyfork.org/scripts/419174/My_one.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var html = '<div id="html">\n' +
        '<button onclick="S()">三角形面积</button>\n' +
        '</div>';
    var node = document.createElement('div');
    node.innerHTML = html;
    document.body.appendChild(node);
})();

function S() {

}
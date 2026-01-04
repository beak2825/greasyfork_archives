// ==UserScript==
// @name         自动适配手机浏览器宽度
// @description  Automatically resizes the page to fit the browser window
// @match        *://*/*
// @version      1
// @grant        none
// @namespace https://greasyfork.org/users/13961
// @downloadURL https://update.greasyfork.org/scripts/464612/%E8%87%AA%E5%8A%A8%E9%80%82%E9%85%8D%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/464612/%E8%87%AA%E5%8A%A8%E9%80%82%E9%85%8D%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.innerHTML = '* { max-width: 100% !important; }';
    document.getElementsByTagName('head')[0].appendChild(style);
})();
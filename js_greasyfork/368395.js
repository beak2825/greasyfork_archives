// ==UserScript==
// @name         灰度查看
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将网站变成灰白瑟
// @author       You
// @include     http*
// @include     ftp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368395/%E7%81%B0%E5%BA%A6%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/368395/%E7%81%B0%E5%BA%A6%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var element = document.body;
    element.style.filter = "grayscale(100%)";
})();

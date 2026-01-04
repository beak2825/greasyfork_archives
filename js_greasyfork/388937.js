// ==UserScript==
// @name         网页护眼壁纸
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为网页增加一个好看、护眼的壁纸
// @author       吉王义昊
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388937/%E7%BD%91%E9%A1%B5%E6%8A%A4%E7%9C%BC%E5%A3%81%E7%BA%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/388937/%E7%BD%91%E9%A1%B5%E6%8A%A4%E7%9C%BC%E5%A3%81%E7%BA%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var huyanbeijinguserjsbyjwyh=document.createElement("div");
    huyanbeijinguserjsbyjwyh.style="z-index: -999;position: fixed;transform: translate(-4%,-4%);background-position: 50%;transition-property: background-image,background-color;filter: blur(20px);height: calc(100% + 80px);width: calc(100% + 80px);background-image: url(https://ufile.ahgygl.com/userjs/huyanuserjsbyjwyh/green.jpg);";
    document.body.insertBefore(huyanbeijinguserjsbyjwyh,document.body.firstChild);
})();
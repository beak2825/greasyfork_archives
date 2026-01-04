// ==UserScript==
// @name         樱花转AGE
// @namespace    http://tampermonkey.net/
// @version      0.42
// @description  跳转age观看动漫
// @author       You
// @match        http://www.yinghuacd.com/v/*
// @icon         https://www.google.com/s2/favicons?doma。in=yhdm.so
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433439/%E6%A8%B1%E8%8A%B1%E8%BD%ACAGE.user.js
// @updateURL https://update.greasyfork.org/scripts/433439/%E6%A8%B1%E8%8A%B1%E8%BD%ACAGE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let name = document.querySelector("body > div:nth-child(2) > div.gohome.l > h1 > a")
    name.href = "https://www.agemys.net/search?query="+name.innerText
    name.setAttribute('style',"color:red;")
    // Your code here...
})();
// ==UserScript==
// @name         屏蔽百度云
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       SONES117
// @include      https://www.baidu.com/
// @include      https://www.baidu.com/*
// @match        http://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/403057/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/403057/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E4%BA%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("test");
    document.getElementById('lg').style.opacity=0;
    document.getElementById('lg').style.pointerEvents="none"
})();
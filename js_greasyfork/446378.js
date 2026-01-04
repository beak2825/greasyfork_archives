// ==UserScript==
// @name        低端影视去广告
// @namespace   Violentmonkey Scripts
// @match       https://ddrk.me/*
// @grant       none
// @version     1.0
// @author      datehoer
// @license MIT
// @description 等待页面加载完成后会自动删除广告，两段非常简单的js代码。
// @downloadURL https://update.greasyfork.org/scripts/446378/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/446378/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if(document.querySelector('#iaujwnefhw') != null){
        document.querySelector('#iaujwnefhw').innerHTML='';
    }
    if(document.querySelector('#sajdhfbjwhe') != null){
      document.querySelector('#sajdhfbjwhe').innerHTML='';
    }
    // Your code here...
})();
// ==UserScript==
// @name         去除google广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除googleAD
// @author       Remember
// @grant        none
// @license           AGPL License
// @include           *://m.v.qq.com/x/cover/*
// @downloadURL https://update.greasyfork.org/scripts/447217/%E5%8E%BB%E9%99%A4google%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/447217/%E5%8E%BB%E9%99%A4google%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // google-auto-placed
    const earr=[...document.getElementsByClassName('google-auto-placed'),...document.getElementsByClassName('adsbygoogle')];
    if(earr.length){
        earr.forEach(el=>{
             el.parentNode.removeChild(el);
        })
    }
})();
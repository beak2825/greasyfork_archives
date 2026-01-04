// ==UserScript==
// @name         remove m in wikipedia
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  remove m in wikipedia url
// @author       You
// @match        *://*.m.wikipedia.org/*
// @match        *://zh.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/451986/remove%20m%20in%20wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/451986/remove%20m%20in%20wikipedia.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(location.href.search('\bm\b') !== -1){
    location.href = location.href.replace('\.m','')
    }
    if(location.href.search('\/wiki\/') !== -1){
    location.href = location.href.replace('wiki\/','zh-cn\/')
    }
    if(location.href.search('\/zh\/') !== -1){
    location.href = location.href.replace('zh\/','zh-cn\/')
    }
     // Your code here...
})();
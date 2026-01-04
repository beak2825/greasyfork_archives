// ==UserScript==
// @name         hggardreplaceimg
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  修正hggard突破不显示
// @author       You
// @match        *://hggard.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393158/hggardreplaceimg.user.js
// @updateURL https://update.greasyfork.org/scripts/393158/hggardreplaceimg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const imgs =document.querySelectorAll("img");
    imgs.forEach((img)=>{
    if(/gmgard\.com/.test(img.src)){
            let index = 0
             img.src =img.src.replace(/gmgard\.com/,'hggard.com');
        if(img.getAttribute('data-src'))
              img.setAttribute('data-src',img.getAttribute('data-src').replace(/gmgard\.com/,'hggard.com'));

    }
    });

    // Your code here...
})();
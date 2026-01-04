// ==UserScript==
// @name         to zhangxinxu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  致张鑫旭，我自己家雇个女仆帮我拆快递跟你有何相干？
// @author       You
// @match        https://www.zhangxinxu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhangxinxu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442444/to%20zhangxinxu.user.js
// @updateURL https://update.greasyfork.org/scripts/442444/to%20zhangxinxu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const els = document.querySelector('body').children
    for(let i = 0; i < els.length; i++) {
        if(els[i].tagName.match(/.{4}-.{1}/)) {
            els[i].style.display = 'none'
        }
    }
})();
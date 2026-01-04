// ==UserScript==
// @name         vlr修改旗帜
// @namespace    http://tampermonkey.net/
// @version      2024-04-06
// @description  修改部分旗帜图案
// @author       You
// @match        https://www.vlr.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vlr.gg
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/491776/vlr%E4%BF%AE%E6%94%B9%E6%97%97%E5%B8%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/491776/vlr%E4%BF%AE%E6%94%B9%E6%97%97%E5%B8%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let flags = document.querySelectorAll('.mod-tw')
    for (let element of flags) {
        // 对当前元素进行操作
        console.log(element)
        element.classList.remove("mod-tw")
        element.classList.add("mod-cn")
    }
    let delay = setInterval(wait,500)
    function wait() {
        if (flags.length != 0) {
            clearInterval(delay);
            //console.log(flags)
            for (let element of flags) {
                // 对当前元素进行操作
                element.classList.remove("mod-tw")
                element.classList.add("mod-cn")
            }
        }
    }
})();
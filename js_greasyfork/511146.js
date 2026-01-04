// ==UserScript==
// @name         col漫画去广告
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  col漫画去广告beta版
// @author       You
// @match        https://www.colamanga.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511146/col%E6%BC%AB%E7%94%BB%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/511146/col%E6%BC%AB%E7%94%BB%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.open = null
    let timer = setInterval(()=>{
        document.querySelectorAll('a')?.forEach(a => {
            if(!a.innerText){
                a?.remove()
            }
        })
        document.querySelectorAll('iframe')?.forEach(a => {
            a?.remove()
        })
    },50)
    setTimeout(() => clearInterval(timer), 120000)
    // Your code here...
})();
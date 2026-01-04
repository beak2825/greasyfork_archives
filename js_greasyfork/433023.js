// ==UserScript==
// @name         去除bukaivip广告
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  去除bukaivip上的广告
// @author       simple-ice
// @match			*://*.bukaivip2.com/*
// @icon         https://www.google.com/s2/favicons?domain=bukaivip2.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/433023/%E5%8E%BB%E9%99%A4bukaivip%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/433023/%E5%8E%BB%E9%99%A4bukaivip%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const clearDom = () => {
        setTimeout(() => {
            const arr = ['HMRichBox', 'HMimageright', 'HMimageleft']
            arr.forEach(cur => {
                // const ele = cur === '.container' ? $('.container')[2] : document.getElementById(cur)
                const ele = document.getElementById(cur)
                ele && $(ele).ready(() => {
                    ele.style.setProperty('display', 'none', 'important');
                })
            })
        }, 700)
    }
    clearDom()
    window.onload = function() {
        clearDom()
    }
})();
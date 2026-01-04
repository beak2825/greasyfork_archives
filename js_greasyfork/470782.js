// ==UserScript==
// @name         馒头优化
// @namespace    https://biandan.me
// @version      0.1
// @description  优化馒头列表页的图片预览
// @author       BianDan
// @match        *://kp.m-team.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=m-team.cc
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470782/%E9%A6%92%E5%A4%B4%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/470782/%E9%A6%92%E5%A4%B4%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style')
    style.type = 'text/css'
    style.innerText = `
    .hover-thumbnail img {
        width: 100% !important;
        height: auto !important;
    }
    `
    document.body.appendChild(style)

    Array.from(document.querySelectorAll('img[alt*=thumbnail]')).forEach(f => {
        f.addEventListener('mouseover', () => {
            setTimeout(() => {
                Array.from(document.querySelectorAll('div[id*=tid_]')).forEach(i => {
                    if (!i.dataset['isSet']) {
                        i.classList.add('hover-thumbnail')
                        i.dataset['isSet'] = '1'
                        i.style.transform = 'translate(40px, 40px)'
                        i.style.width = '600px'
                    }
                })
            }, 0)
        })
    })
})();
// ==UserScript==
// @name         acfun一键5蕉
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  视频和文章稿件，单击香蕉图标相当于点击五蕉按钮
// @author       星雨漂流
// @match        https://www.acfun.cn/v/*
// @match        https://www.acfun.cn/a/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438280/acfun%E4%B8%80%E9%94%AE5%E8%95%89.user.js
// @updateURL https://update.greasyfork.org/scripts/438280/acfun%E4%B8%80%E9%94%AE5%E8%95%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const interval = setInterval(()=>{
        let el
        if (location.href.indexOf('/v/')!== -1) {
             el = document.querySelector('.action-area').querySelector('.banana')
        } else {
           el = document.querySelector('#article-operation')
        }
        if (el) {
            clearInterval(interval)
            el.onclick= ()=>{
                el.querySelector('.div-banana').querySelectorAll('span')[4].click()
            }
        }
    }, 500)
    })();
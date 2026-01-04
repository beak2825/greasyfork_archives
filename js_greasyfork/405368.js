// ==UserScript==
// @name         es6文档子目录定位
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://es6.ruanyifeng.com/#docs/generator-async
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405368/es6%E6%96%87%E6%A1%A3%E5%AD%90%E7%9B%AE%E5%BD%95%E5%AE%9A%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/405368/es6%E6%96%87%E6%A1%A3%E5%AD%90%E7%9B%AE%E5%BD%95%E5%AE%9A%E4%BD%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setPosition() {
        const target = document.querySelector('#content-toc')
        if(!target) return
        if(target.style.position === 'fixed') {
            // return clearInterval(timer01)
        }
        target.setAttribute('style', 'position: fixed;left: 930px;top: 10%;width: 200px; ')
    }
    const timer01 = setInterval(() => {
        setPosition()
    }, 500)
})();
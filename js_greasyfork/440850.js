// ==UserScript==
// @name         HTML5 for arXiv
// @namespace    http://tampermonkey.net/
// @version      0.1
// @name:zh-CN   HTML5 for arXiv
// @description  An extension that makes html5 source available in arxiv.org based on the amazing ar5iv project.
// @description:zh-cn 更便捷的访问HTML5论文！
// @author       AnCoSONG
// @license      MIT
// @match        https://arxiv.org/abs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440850/HTML5%20for%20arXiv.user.js
// @updateURL https://update.greasyfork.org/scripts/440850/HTML5%20for%20arXiv.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setup() {
        try {
            var prefix = location.pathname
            var ul = document.querySelector('.full-text ul')
            var li = document.createElement('li')
            var a = document.createElement('a')
            a.href = 'https://ar5iv.org' + prefix
            a.innerText = 'HTML5(ar5iv)'
            a.className = 'abs-button'
            a.target = '_blank'
            li.appendChild(a)
            ul.appendChild(li)
        }catch(e) {
            console.log('error happened, skip.\n', e)
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup)
    } else {
        setup()
    }
})();
// ==UserScript==
// @name         Academus link for arXiv
// @version      0.1
// @description  An extension that makes html (Academus) source available in arxiv.org, inspired by "HTML5 for arXiv"
// @author       fankaidev
// @license      MIT
// @match        https://arxiv.org/abs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @grant        none
// @namespace https://greasyfork.org/users/1276521
// @downloadURL https://update.greasyfork.org/scripts/492586/Academus%20link%20for%20arXiv.user.js
// @updateURL https://update.greasyfork.org/scripts/492586/Academus%20link%20for%20arXiv.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setup() {
        try {
            var id = location.pathname.split('/').pop()
            var ul = document.querySelector('.full-text ul')
            var li = document.createElement('li')
            var a = document.createElement('a')
            a.href = 'https://academ.us/article/' + id
            a.innerText = 'Academus'
            a.className = 'abs-button'
            a.target = '_blank'
            li.appendChild(a)
            ul.insertBefore(li,ul.children[0])
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
// ==UserScript==
// @name         一键复制公式
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Click to copy equation in Wikipedia and Zhihu
// @author       flaribbit
// @match        http://*.wikipedia.org/*
// @match        https://*.wikipedia.org/*
// @match        http://www.wikiwand.com/*
// @match        https://www.wikiwand.com/*
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://blog.csdn.net/*/article/*
// @match        https://scikit-learn.org.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495834/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%85%AC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/495834/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%85%AC%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const host = document.location.host;
    const el = document.createElement('style');
    el.innerText = '@keyframes aniclick{0%{background:#03A9F400}20%{background:#03A9F47F}100%{background:#03A9F400}}';
    document.head.appendChild(el);
    const clearAnimation = function () {
        this.style.animation = '';
    }
    if (host.search('wikipedia') >= 0) {
        const copyTex = function () {
            navigator.clipboard.writeText('$' + this.alt + '$');
            this.style.animation = 'aniclick .4s';
        }
        const eqs = document.querySelectorAll('.mwe-math-fallback-image-inline, .mwe-math-fallback-image-display');
        for (let i = 0; i < eqs.length; i++) {
            eqs[i].onclick = copyTex;
            eqs[i].addEventListener('animationend', clearAnimation);
            eqs[i].title = '点击即可复制公式';
        }
    } else if (host.search('wikiwand') >= 0){
        const copyTex = function () {
            const tex = this.getElementsByTagName('math')[0].getAttribute("alttext");
            navigator.clipboard.writeText('$' + tex + '$');
            this.style.animation = 'aniclick .4s';
        }
        const check_equations = (mutationList, observer) => {
            const eqs = document.querySelectorAll('.mwe-math-element');
            for (let i = 0; i < eqs.length; i++) {
                eqs[i].onclick = copyTex;
                eqs[i].addEventListener('animationend', clearAnimation);
                eqs[i].title = '点击即可复制公式';
            }
        }
        const targetNode = document.getElementsByTagName('article')[0];
        const config = { attributes: false, childList: true, subtree: true };
        const observer = new MutationObserver(check_equations);
        observer.observe(targetNode, config);
    } else if (host.search('zhihu') >= 0) {
        const copyTex = function () {
            navigator.clipboard.writeText('$' + this.getAttribute('data-tex') + '$');
            this.style.animation = 'aniclick .4s';
        }
        const check_equations = function () {
            if (document.visibilityState == 'visible') {
                const eqs = document.querySelectorAll('.ztext-math');
                for (let i = 0; i < eqs.length; i++) {
                    eqs[i].onclick = copyTex;
                    eqs[i].addEventListener('animationend', clearAnimation);
                    eqs[i].title = '点击即可复制公式';
                }
            }
        }
        if (document.location.href.search('question') >= 0) {
            setInterval(check_equations, 1000);
        } else {
            check_equations();
        }
    } else if (host.search('blog.csdn') >= 0) {
        const copyTex = function () {
            navigator.clipboard.writeText('$' + this.querySelector('annotation').textContent.trim() + '$');
            this.style.animation = 'aniclick .4s';
        }
        const eqs = document.querySelectorAll('.katex');
        for (let i = 0; i < eqs.length; i++) {
            eqs[i].onclick = copyTex;
            eqs[i].addEventListener('animationend', clearAnimation);
            eqs[i].title = '点击即可复制公式';
        }
    } else if (host.search('scikit-learn.org.cn') >= 0) {
        const copyTex = function () {
            navigator.clipboard.writeText('$' + this.getAttribute('data-formula').trim() + '$');
            this.style.animation = 'aniclick .4s';
        }
        const eqs = document.querySelectorAll('.block-equation');
        for (let i = 0; i < eqs.length; i++) {
            eqs[i].onclick = copyTex;
            eqs[i].addEventListener('animationend', clearAnimation);
            eqs[i].title = '点击即可复制公式';
        }
    }
})();
// ==UserScript==
// @name                Zhihu: Hide Garbage
// @name:zh-CN          知乎: 隐藏垃圾
// @description         Hide spam content under Zhihu questions.
// @description:zh-CN   隐藏 知乎 问题下的垃圾内容。
// @author              dawn-lc
// @namespace           https://github.com/dawn-lc
// @license             MIT
// @icon                https://static.zhihu.com/heifetz/favicon.ico
// @match               *://*.zhihu.com/question/*
// @grant               none
// @version             1.0.4
// @downloadURL https://update.greasyfork.org/scripts/535361/Zhihu%3A%20Hide%20Garbage.user.js
// @updateURL https://update.greasyfork.org/scripts/535361/Zhihu%3A%20Hide%20Garbage.meta.js
// ==/UserScript==
(function() {
    function debounce(fn, delay, { immediate = false } = {}) {
        let timer = null;
        const debounced = function(...args) {
            const callNow = immediate && !timer;
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                timer = null;
                if (!immediate) {
                    fn.apply(this, args);
                }
            }, delay);
            if (callNow) {
                fn.apply(this, args);
            }
        };
        debounced.cancel = () => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        };
        return debounced;
    }
    window.addEventListener("scroll", debounce(() => {
        [...document.querySelectorAll('.List-item')].filter(i => i.querySelector('[class*="KfeCollection"]') != null).forEach(i => i.style.setProperty('display', 'none'));
        [...document.querySelectorAll('.Pc-word-new')].forEach(i => i.style.setProperty('display', 'none'));
    }, 1000));
})();
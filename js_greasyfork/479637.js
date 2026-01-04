// ==UserScript==
// @name         v2ex 新标签打开
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  默认使用新标签打开v2ex，而不是在原有网页中打开
// @author       Wangji@sgidi.com
// @match        https://www.v2ex.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479637/v2ex%20%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/479637/v2ex%20%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==
function createProcess() {
    let timer = null;
    return () => {
        if (timer) {
            console.log('clearTimer')
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            const arr = Array.from(document.querySelectorAll('.topic-link:not([data-done])'))
            arr.forEach(anchor => {
                const href = anchor.getAttribute('href')
                if (!href) return;
                anchor.setAttribute
                anchor.setAttribute('target', '_blank')
                anchor.setAttribute('data-done', 1)
            })
        }, 800)
    }
}
const process = createProcess()

(function() {
    const answersDom = document.querySelector('#Main')
    if (!answersDom) {
        console.log('answer dom not exist!')
        return;
    }
    process()
    const observer = new MutationObserver(function() {
        console.log('observer worked')
        process()
    });
    observer.observe(answersDom, {
        childList: true,
        subtree: true
    });
})();
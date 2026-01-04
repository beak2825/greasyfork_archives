// ==UserScript==
// @name         知乎-忽略全部邀请
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  忽略全部邀请
// @author       CodeHz
// @match        https://www.zhihu.com/question/invited*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367740/%E7%9F%A5%E4%B9%8E-%E5%BF%BD%E7%95%A5%E5%85%A8%E9%83%A8%E9%82%80%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/367740/%E7%9F%A5%E4%B9%8E-%E5%BF%BD%E7%95%A5%E5%85%A8%E9%83%A8%E9%82%80%E8%AF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const host = document.querySelector('.zm-invite-list')
    const btn = document.createElement('span')
    btn.className = 'zg-btn-white zg-right'
    btn.style.cursor = 'pointer'
    btn.textContent = '忽略全部邀请'
    btn.onclick = () => {
        Array.from(document.querySelectorAll('[name=ignore]')).forEach(x => x.click())
    }
    host.appendChild(btn)
    console.log(btn)
})();
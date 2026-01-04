// ==UserScript==
// @name         我不是人类
// @namespace    http://example.com/
// @version      0.1
// @description  遇到 Cloudflare 的验证码时重定向到空白页，不继续加载网页。
// @author       MisakaMikoto
// @match        https://*/*
// @match        http://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431033/%E6%88%91%E4%B8%8D%E6%98%AF%E4%BA%BA%E7%B1%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/431033/%E6%88%91%E4%B8%8D%E6%98%AF%E4%BA%BA%E7%B1%BB.meta.js
// ==/UserScript==

(() => {
    const intervalId = setInterval(() => {
        const elements = document.getElementsByTagName('h1');
        if (elements.length === 0) {
            return;
        }
        if (elements[0].innerHTML === 'One more step') {
            const userSelect = confirm('该页面需要先做不友好验证码，是否不继续浏览？This website must to resolve a not human friendly captcha, do you want to leave?');
            if (userSelect) {
                location.href = 'about:blank';
            }
        }
    }, 100);
    setTimeout(() => {
        clearInterval(intervalId);
    }, 10000);
})();

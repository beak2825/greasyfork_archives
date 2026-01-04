// ==UserScript==
// @name         重定向QQ的链接拦截
// @namespace    http://tampermonkey.net/
// @version      2025-07-08
// @author       zmal
// @description  提前重定向 QQ 的链接跳转，避免被sb QQ拦截
// @match        https://c.pc.qq.com/ios.html*
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542005/%E9%87%8D%E5%AE%9A%E5%90%91QQ%E7%9A%84%E9%93%BE%E6%8E%A5%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/542005/%E9%87%8D%E5%AE%9A%E5%90%91QQ%E7%9A%84%E9%93%BE%E6%8E%A5%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() {
    const href = location.href;

    const urlParamIndex = href.indexOf('url=');
    if (urlParamIndex === -1) return;

    const start = urlParamIndex + 4;
    let end = href.indexOf('&', start);
    end = end === -1 ? href.length : end;

    const encodedUrl = href.substring(start, end);

    try {
        const decodedUrl = decodeURIComponent(encodedUrl);

        const cleanUrl = decodedUrl.endsWith('.html/')
        ? decodedUrl.slice(0, -1)
        : decodedUrl;


        location.replace(cleanUrl);
    } catch(e) {
        console.debug('URL解码失败:', e.message);
    }
})();
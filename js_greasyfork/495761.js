// ==UserScript==
// @name         CSDN Allow Copy
// @namespace    http://tampermonkey.net/
// @version      2024-05-20
// @description  移除CSDN复制限制
// @author       Mushr00mZhang
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495761/CSDN%20Allow%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/495761/CSDN%20Allow%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 创建style标签，添加用户选择样式。
    const style = document.createElement('style');
    style.innerHTML = `
body #content_views pre {
  user-select: auto;
}
body #content_views pre code {
  user-select: auto;
}
`;
    document.head.appendChild(style);
    if (window.$) {
        window.$("#content_views").unbind("copy");
    }
    window.csdn.copyright.textData = '';
})();
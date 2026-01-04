// ==UserScript==
// @name         解除所谓的安全提示跳转
// @namespace    https://lab.wsl.moe
// @version      0.1
// @description  遇到所谓的“外部链接安全提示”页面直接跳转
// @author       MisakaMikoto
// @match        https://www.oschina.net/action/GoToLink?*
// @match        https://link.zhihu.com/?*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426022/%E8%A7%A3%E9%99%A4%E6%89%80%E8%B0%93%E7%9A%84%E5%AE%89%E5%85%A8%E6%8F%90%E7%A4%BA%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/426022/%E8%A7%A3%E9%99%A4%E6%89%80%E8%B0%93%E7%9A%84%E5%AE%89%E5%85%A8%E6%8F%90%E7%A4%BA%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        console.log('Query variable %s not found', variable);
    }

    const website = location.host + location.pathname;
    let targetUrl = '';

    switch (website) {
        case 'www.oschina.net/action/GoToLink':
            targetUrl = getQueryVariable('url');
            break;
        case 'link.zhihu.com/':
            targetUrl = getQueryVariable('target');
            break;
    }

    const link = document.createElement('a');
    link.setAttribute('rel', 'noreferrer noopener nofollow');
    link.href = targetUrl;
    link.click();
})();
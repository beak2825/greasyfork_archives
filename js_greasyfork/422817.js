// ==UserScript==
// @name         修复Safari-iqiyi网页全屏失效
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Jeffrey.Deng
// @supportURL   https://imcoder.site/u/center/sendLetter?chatuid=1016726508048
// @homepageURL  https://imcoder.site
// @weibo        http://weibo.com/3983281402
// @match        https://www.iqiyi.com/v_*.html*
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/422817/%E4%BF%AE%E5%A4%8DSafari-iqiyi%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%A4%B1%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/422817/%E4%BF%AE%E5%A4%8DSafari-iqiyi%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%A4%B1%E6%95%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addGlobalStyle = GM_addStyle || function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('html')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
        return style;
    };

    setTimeout(function () {
        addGlobalStyle(
            //'.iqp-player.iqp-web-screen {' +
            //'     display: unset;' +
            //'}' +
            '.iqp-player[data-player-hook="container"] {' +
            '     display: unset;' +
            '}'
        );
    }, 1700);
})();
// ==UserScript==
// @name         网站彩色恢复
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  屏蔽国内网站的黑白特效
// @license      MIT
// @author       Azu機
// @match        *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455735/%E7%BD%91%E7%AB%99%E5%BD%A9%E8%89%B2%E6%81%A2%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/455735/%E7%BD%91%E7%AB%99%E5%BD%A9%E8%89%B2%E6%81%A2%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var domain = document.domain;
    switch(domain) {
        case 'weibo.com': {
            document.getElementsByClassName('grayTheme').forEach(element => {element.classList.remove('grayTheme')});
            break;
        }
        case 'bilibili.com': {
            document.getElementsByTagName('html')[0].classList.remove('gray');
            break;
        }
        default: break;
    }
})();
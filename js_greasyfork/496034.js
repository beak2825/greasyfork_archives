// ==UserScript==
// @name         强制替换默认字体 | 微软雅黑版
// @description  BlinkMacSystemFont / -apple-system 替换为微软雅黑 | 需要本地安装微软雅黑 | 有的大厂前端是不是以为大家都有钱买Mac啊😅
// @version      1.1.2
// @license      WTFPL
// @author       Joseph Chris <joseph@josephcz.xyz>
// @namespace    https://github.com/baobao1270/util-scripts/blob/main/tampermonkey/replace-default-font#all-microsoft-yahei
// @homepageURL  https://github.com/baobao1270/util-scripts/blob/main/tampermonkey/replace-default-font
// @supportURL   mailto:tampermonkey-support@josephcz.xyz
// @compatible   firefox
// @compatible   safari
// @include      *
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/496034/%E5%BC%BA%E5%88%B6%E6%9B%BF%E6%8D%A2%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93%20%7C%20%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/496034/%E5%BC%BA%E5%88%B6%E6%9B%BF%E6%8D%A2%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93%20%7C%20%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91%E7%89%88.meta.js
// ==/UserScript==

(function() {
    (function() {
        'use strict';
        GM_addStyle(`
            @font-face {
                font-family: '-apple-system';
                src: local('Microsoft YaHei');
            }
            @font-face {
                font-family: 'BlinkMacSystemFont';
                src: local('Microsoft YaHei');
            }
        `);
    })();
})();

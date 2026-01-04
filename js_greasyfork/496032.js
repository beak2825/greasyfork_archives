// ==UserScript==
// @name         强制替换默认字体 | 自动版
// @description  根据系统自动切换 | Windows -apple-system 替换为微软雅黑 | macOS 微软雅黑替换为苹方简体 | 需要安装对应字体
// @version      1.1.2
// @license      WTFPL
// @author       Joseph Chris <joseph@josephcz.xyz>
// @namespace    https://github.com/baobao1270/util-scripts/blob/main/tampermonkey/replace-default-font#auto
// @homepageURL  https://github.com/baobao1270/util-scripts/blob/main/tampermonkey/replace-default-font
// @supportURL   mailto:tampermonkey-support@josephcz.xyz
// @compatible   firefox
// @compatible   safari
// @include      *
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/496032/%E5%BC%BA%E5%88%B6%E6%9B%BF%E6%8D%A2%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93%20%7C%20%E8%87%AA%E5%8A%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/496032/%E5%BC%BA%E5%88%B6%E6%9B%BF%E6%8D%A2%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93%20%7C%20%E8%87%AA%E5%8A%A8%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const platform = navigator.platform.toLocaleLowerCase();
    console.log("[自动使用系统字体] 当前平台", platform);

    if (platform.indexOf("win") >= 0) GM_addStyle(`
        @font-face {
            font-family: '-apple-system';
            src: local('Microsoft YaHei');
        }
        @font-face {
            font-family: 'BlinkMacSystemFont';
            src: local('Microsoft YaHei');
        }
    `);

    if (platform.indexOf("mac") >= 0) GM_addStyle(`
        @font-face {
            font-family: 'MicrosoftYaHei';
            src: local('PingFang SC');
        }
        @font-face {
            font-family: 'Microsoft YaHei';
            src: local('PingFang SC');
        }
        @font-face {
            font-family: 'Microsoft YaHei UI';
            src: local('PingFang SC');
        }
    `);
})();

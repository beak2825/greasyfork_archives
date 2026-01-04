// ==UserScript==
// @name         显示滚动条-Always Show Scrollbars
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解决Edge无法显示显示滚动条
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502394/%E6%98%BE%E7%A4%BA%E6%BB%9A%E5%8A%A8%E6%9D%A1-Always%20Show%20Scrollbars.user.js
// @updateURL https://update.greasyfork.org/scripts/502394/%E6%98%BE%E7%A4%BA%E6%BB%9A%E5%8A%A8%E6%9D%A1-Always%20Show%20Scrollbars.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styleContent = `
        * {
            scrollbar-width: auto !important;
        }

        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }

        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 6px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(styleContent));
    document.head.appendChild(styleElement);
})();

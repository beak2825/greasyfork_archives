// ==UserScript==
// @name         滚动条美化
// @namespace    https://blog.csdn.net/2402_82985523?spm=1000.2115.3001.5343
// @version      1.0
// @description  美化滚动条
// @author       Neatsuki
// @match *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/488249/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/488249/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        ::-webkit-scrollbar {
            width: 7px;
        }
        ::-webkit-scrollbar-track {
            background: #e1e1f9;
        }
        ::-webkit-scrollbar-thumb {
            background: #a2a2eb;
            border-radius: 6px;
        }
    `;
    document.head.appendChild(style);
})();
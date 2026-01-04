// ==UserScript==
// @name         滚动条样式美化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简约风滚动条样式
// @author       Deng Yuxi
// @match        http*://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445068/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E6%A0%B7%E5%BC%8F%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/445068/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E6%A0%B7%E5%BC%8F%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
        const style = document.createElement("style");
        style.innerHTML = `
        ::-webkit-scrollbar {
            width: 8px;
        }
        /* 滚动槽 */
        ::-webkit-scrollbar-track {
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.06);
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
        }
        /* 滚动块 */
        ::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.05);
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.15);
        }`;
        document.head.appendChild(style);
})();
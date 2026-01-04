// ==UserScript==
// @name         点击链接在新标签页打开
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使得网页内所有链接点击之后在新标签页中打开
// @license      MIT
// @author       pump_dev
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502057/%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/502057/%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function(event) {
        // 检查点击目标是否是<a>标签
        if (event.target.nodeName === 'A') {
            event.preventDefault();
            window.open(event.target.href, '_blank');
        }
    });
})();
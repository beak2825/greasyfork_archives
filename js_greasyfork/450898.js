// ==UserScript==
// @name         去你大爷的百家号
// @icon         https://www.baidu.com/favicon.ico
// @version      0.1
// @description  移除搜索结果中的百家号
// @author       CuSO4
// @match        https://www.baidu.com/*
// @grant        none
// @license      GPLv3
// @namespace https://greasyfork.org/users/955575
// @downloadURL https://update.greasyfork.org/scripts/450898/%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%E7%99%BE%E5%AE%B6%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/450898/%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%E7%99%BE%E5%AE%B6%E5%8F%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.addEventListener('DOMSubtreeModified', function () {
        setTimeout(function () {
            let count = 0;
            let result = document.querySelectorAll(".result");
            let resultOp = document.querySelectorAll(".result-op");
            for (let i = 0; i < result.length; i++) {
                let mu = result[i].attributes.getNamedItem('mu');
                if (mu !== null && mu.value.includes('baijiahao')) { result[i].remove(); count++; }
            }
            for (let i = 0; i < resultOp.length; i++) {
                let mu = resultOp[i].attributes.getNamedItem('mu');
                if (mu !== null && mu.value.includes('baijiahao')) { resultOp[i].remove(); count++; }
            }
            if (count !== 0) {
                console.log('删除了' + count + '个百家号结果，好耶！');
            }
        }, 300);
    });
})();
// ==UserScript==
// @name         对分易会员绕过
// @namespace    http://tampermonkey.net/
// @version      2025-04-14
// @description  劫持 indexOf 返回值 为 ['s0','s1'] 且参数是 UserVipType 强制返回 1
// @author       风前絮
// @match        https://www.duifene.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532765/%E5%AF%B9%E5%88%86%E6%98%93%E4%BC%9A%E5%91%98%E7%BB%95%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/532765/%E5%AF%B9%E5%88%86%E6%98%93%E4%BC%9A%E5%91%98%E7%BB%95%E8%BF%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalIndexOf = Array.prototype.indexOf;
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        // 检查是否为 ['s0','s1']
        if (
            this.length === 2 &&
            this.includes('s0') &&
            this.includes('s1')
        ) {
            return 1; // 强制返回 1
        }
        // 其他情况正常返回
        return originalIndexOf.call(this, searchElement, fromIndex);
    };
})();
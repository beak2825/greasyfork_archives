// ==UserScript==
// @name         强制新版迅雷远程
// @namespace    https://about.me/huxim
// @version      0.1
// @description  强制使用新版迅雷远程
// @include      http://yuancheng.xunlei.com/
// @author       huxim

// @downloadURL https://update.greasyfork.org/scripts/27507/%E5%BC%BA%E5%88%B6%E6%96%B0%E7%89%88%E8%BF%85%E9%9B%B7%E8%BF%9C%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/27507/%E5%BC%BA%E5%88%B6%E6%96%B0%E7%89%88%E8%BF%85%E9%9B%B7%E8%BF%9C%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.location.href = window.location.href.replace('http://yuancheng.xunlei.com', 'http://yuancheng.xunlei.com/3');
})();
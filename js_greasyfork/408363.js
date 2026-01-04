// ==UserScript==
// @name         Open in new Tab 新标签页打开搜索结果
// @namespace    Gallen
// @version         0.0.1
// @include         *://*.google.com/s*
// @include         *://*.baidu.com/s*
// @description   新标签页打开搜索结果
// @author          Gallen
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/408363/Open%20in%20new%20Tab%20%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/408363/Open%20in%20new%20Tab%20%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function makeNewTab(node) {
        node.setAttribute('target', '_blank');
    }

    Array.from(document.querySelectorAll('#search a')).forEach(node => {
        makeNewTab(node);
    });
    Array.from(document.querySelectorAll('#content_left a')).forEach(node => {
        makeNewTab(node);
    });
})();
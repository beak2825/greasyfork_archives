// ==UserScript==
// @name         全局工具集
// @namespace    GlobalTools.user.js
// @version      1.1
// @description  全局工具集，包含禁止浏览器自动添加搜索引擎
// @author       RichieMay
// @grant        none
// @include      *
// @downloadURL https://update.greasyfork.org/scripts/410242/%E5%85%A8%E5%B1%80%E5%B7%A5%E5%85%B7%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/410242/%E5%85%A8%E5%B1%80%E5%B7%A5%E5%85%B7%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function DisableAddSearchEngines() {
        [].forEach.call(document.querySelectorAll('[type="application/opensearchdescription+xml"]'), function(openSearch) {
            openSearch.remove();
        });
    }

    DisableAddSearchEngines();
})();
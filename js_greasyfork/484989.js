// ==UserScript==
// @name         修改嘉立创开源广场的链接为新建标签页打开
// @namespace    http://mepuru.info:12345
// @version      114.514
// @description  修改嘉立创开源广场的链接为新建标签页打开默认识别<div class="search-content">下的内容其余部分不受影响
// @author       Maple
// @match        *://*.u.lceda.cn/*
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/484989/%E4%BF%AE%E6%94%B9%E5%98%89%E7%AB%8B%E5%88%9B%E5%BC%80%E6%BA%90%E5%B9%BF%E5%9C%BA%E7%9A%84%E9%93%BE%E6%8E%A5%E4%B8%BA%E6%96%B0%E5%BB%BA%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/484989/%E4%BF%AE%E6%94%B9%E5%98%89%E7%AB%8B%E5%88%9B%E5%BC%80%E6%BA%90%E5%B9%BF%E5%9C%BA%E7%9A%84%E9%93%BE%E6%8E%A5%E4%B8%BA%E6%96%B0%E5%BB%BA%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function printSuccessMessage() {
        var date = new Date();
        console.log('[' + date.toISOString() + '] 执行成功！');
    }
    var div = document.querySelector('div.search-content');
    if (div) {
        var links = div.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            if (links[i].href) {
                links[i].target = '_blank';
                links[i].addEventListener('click', printSuccessMessage);
            }
        }
    }
})();
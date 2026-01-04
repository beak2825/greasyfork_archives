// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try
// @author       You
// @match        *://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469064/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/469064/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 选择要删除的元素
    var elementsToDelete = document.querySelectorAll('div.ColumnPageHeader-Wrapper, header.Sticky.MobileAppHeader, div.Sticky.RichContent-actions.is-fixed.is-bottom');

    // 创建一个文档片段，用于批量删除元素
    var fragment = document.createDocumentFragment();

    // 将要删除的元素添加到文档片段
    for (var i = 0; i < elementsToDelete.length; i++) {
        var element = elementsToDelete[i];
        fragment.appendChild(element);
    }

    // 批量删除文档片段中的元素
    fragment.parentNode.removeChild(fragment);
})();
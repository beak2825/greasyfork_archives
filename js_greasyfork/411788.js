// ==UserScript==
// @name         划词解析URLDecode
// @version      1.0.1
// @description  划词自动解析URLDecode
// @author       yan
// @match        https://*.aliyun.com/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/294947
// @downloadURL https://update.greasyfork.org/scripts/411788/%E5%88%92%E8%AF%8D%E8%A7%A3%E6%9E%90URLDecode.user.js
// @updateURL https://update.greasyfork.org/scripts/411788/%E5%88%92%E8%AF%8D%E8%A7%A3%E6%9E%90URLDecode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 鼠标事件：防止选中的文本消失；显示、隐藏解析图标
    document.addEventListener('mouseup', function (e) {
        var text = window.getSelection().toString().trim();
        if (text && isURLDecode(text)) {
            replaceSelectedText(decodeURIComponent(text));
        }
    });

    function isURLDecode(str) {
        str = str.replace(/[\r\n\s]/g, '');
        if (str ==='' || str.trim() ===''||str.indexOf("%")==-1){ return false; }
        try {
            return encodeURIComponent(decodeURIComponent(str)) == str;
        } catch (err) {
            return false;
        }
    }

    function replaceSelectedText(replacementText) {
        var sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(replacementText));
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            range.text = replacementText;
        }
    }

})();

// ==UserScript==
// @name         字数统计浮层
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license 	 MIT
// @description  在网页上选中文字时，通过浮层显示字数
// @author       shanhai2049
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512940/%E5%AD%97%E6%95%B0%E7%BB%9F%E8%AE%A1%E6%B5%AE%E5%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/512940/%E5%AD%97%E6%95%B0%E7%BB%9F%E8%AE%A1%E6%B5%AE%E5%B1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建浮层元素
    const floatDiv = document.createElement('div');
    floatDiv.style.cssText = 'position: absolute; z-index: 1000; padding: 5px; background: white; border: 1px solid black; border-radius: 4px; font-size: 12px; display: none;';
    document.body.appendChild(floatDiv);

    document.addEventListener('mouseup', function(e) {
        const selectedText = window.getSelection().toString();
        if (selectedText.length > 0) {
            floatDiv.textContent = `字符数: ${selectedText.length}`;
            floatDiv.style.display = 'block';
            floatDiv.style.left = `${e.pageX- 80}px` ;
            floatDiv.style.top = `${e.pageY+15}px`;
        } else {
            floatDiv.style.display = 'none';
        }
    });
})();

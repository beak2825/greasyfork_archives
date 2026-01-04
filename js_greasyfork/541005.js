// ==UserScript==
// @name         Remove trailing spaces when selecting text
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically remove trailing spaces when double clicking selected text
// @author       Devol
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541005/Remove%20trailing%20spaces%20when%20selecting%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/541005/Remove%20trailing%20spaces%20when%20selecting%20text.meta.js
// ==/UserScript==

/**
 * 优化双击选中的文本范围，自动排除单词后的空格
 * @param {Event} event - 双击事件对象（未直接使用，但保留以备扩展）@license
 */
function handleDoubleClickSelection(event) {
  const selection = window.getSelection();

  
  if (selection.rangeCount === 0 || selection.rangeCount > 1) {
    return;
  }

  const range = selection.getRangeAt(0);
  const selectedText = range.toString();

  
  const matches = selectedText.match(/^[\w\u4e00-\u9fa5，。！？、；：""'']+(\s+)$/);
  if (!matches || !matches[1]) {
    return;
  }

  
  const trailingSpaceCount = matches[1].length;

  
  const newRange = range.cloneRange();
  newRange.setEnd(range.endContainer, range.endOffset - trailingSpaceCount);

  
  selection.removeAllRanges();
  selection.addRange(newRange);
}

// 添加事件监听（使用 passive 模式提升滚动性能）
document.addEventListener('dblclick', handleDoubleClickSelection, {
  passive: true,
  capture: false
})();
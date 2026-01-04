// ==UserScript==
// @name         选中即复制
// @namespace    http://tampermonkey/net/
// @version      1.2
// @description  选中文本后自动复制到剪贴板中
// @match        *://*/*
// @author       Techwb.cn
// @grant        GM_setClipboard
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/460251/%E9%80%89%E4%B8%AD%E5%8D%B3%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/460251/%E9%80%89%E4%B8%AD%E5%8D%B3%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

document.addEventListener('mouseup', async function(e) {
  var selection = window.getSelection().toString();
  // 如果有选中文本，则复制到剪贴板中
  if (selection !== '') {
    const clipboardContent = await navigator.clipboard.readText();
    // 只有剪贴板中没有内容或剪贴板中的内容与选中文本不相同才执行选中复制命令
    if (clipboardContent === '' || clipboardContent !== selection) {
      GM_setClipboard(selection);
    }
  }
});

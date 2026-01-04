// ==UserScript==
// @name         脚本之家允许复制
// @namespace    allowCopy
// @version      1.1.0
// @description  脚本之家允许复制。
// @author       111502
// @license      GPL
// @match        *://www.jb51.net/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.deleteValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.0/dist/jquery.min.js
// @run-at 		 document-end
// @downloadURL https://update.greasyfork.org/scripts/485615/%E8%84%9A%E6%9C%AC%E4%B9%8B%E5%AE%B6%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/485615/%E8%84%9A%E6%9C%AC%E4%B9%8B%E5%AE%B6%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  $('.jb51code').css('user-select', 'auto');
  $('.jb51code .codetool').text('复制');
  $('.jb51code').click(function() {
    var textToCopy = $($('.jb51code')[0]).find('table tr td.code').text(); 
    var tempInput = $('<textarea>'); // 创建一个临时输入框元素
    $('body').append(tempInput); // 将临时输入框添加到页面中
    tempInput.val(textToCopy).select(); // 设置临时输入框的值并选中文本
    document.execCommand('copy'); // 复制文本到剪贴板
    tempInput.remove(); // 移除临时输入框
  });
})()

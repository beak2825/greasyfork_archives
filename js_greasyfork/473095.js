// ==UserScript==
// @name        拖拽链接或文本以新建标签页方式打开
// @namespace   http://tampermonkey.net/
// @description  鼠标拖拽，拖拽链接将会以新建标签页的形式打开，选择文字后使用鼠标拖拽将会新建标签页搜索
// @description:en  Drag and drop with the mouse. The drag and drop link will open in the form of a new tab. After selecting text, drag and drop with the mouse to create a new tab search
// @match       *://*/*
// @version     1.0
// @author      Liao Brant
// @grant       none
// @grant       window.onload
// @run-at      document-body
// @description 2023/8/15 08:57:29
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/473095/%E6%8B%96%E6%8B%BD%E9%93%BE%E6%8E%A5%E6%88%96%E6%96%87%E6%9C%AC%E4%BB%A5%E6%96%B0%E5%BB%BA%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%96%B9%E5%BC%8F%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/473095/%E6%8B%96%E6%8B%BD%E9%93%BE%E6%8E%A5%E6%88%96%E6%96%87%E6%9C%AC%E4%BB%A5%E6%96%B0%E5%BB%BA%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%96%B9%E5%BC%8F%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

function main() {
  const HESITANT_TIME = 1500;
  const ERROR_HREF = ['javascript:void(0);', 'javascript:void(0)'];

  let hesitant = false;

  // 监听所有元素的拖拽事件
  document.addEventListener('drag', function() {
    setTimeout(() => {
      hesitant = true;
    }, HESITANT_TIME);
  });

  // 监听所有元素的拖拽结束事件
  document.addEventListener('dragend', function(event) {
    if (hesitant) {
      hesitant = false;
      return;
    };

    const target = event.target;
    if (target.tagName === 'A') {
      if (target.href && !ERROR_HREF.includes(target.href)) {
        console.log(`元素拖拽结束，即将跳转至：${target.href}`);
        window.open(target.href);
      }
    } else {
      const str = window.getSelection().getRangeAt(0).toString();
      window.open(`https://cn.bing.com/search?q=${str}`);
    }
  });
}

(function () {
  'use strict';
  window.onload = main();
})();
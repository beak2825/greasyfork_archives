// ==UserScript==
// @name         MEST Keyboard Shortcuts
// @namespace    joyings.com.cn
// @version      0.1.4
// @description  fast switch input fields
// @author       zmz125000
// @match        http://*/mest/*
// @icon         http://www.google.com/s2/favicons?domain=openwrt.org
// @grant        none
// @license      MIT
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/455220/MEST%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/455220/MEST%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Your code here...
  document.onkeydown = function (e) {
    let sbtn = null;
    if ($('button:contains("查询")')[0]) {
      sbtn = $('button:contains("查询")')[0];
    } else if ($('button:contains("搜索")')[0]) {
      sbtn = $('button:contains("搜索")')[0];
    } else if ($('button:contains("搜 索")')[0]) {
      sbtn = $('button:contains("搜 索")')[0];
    }
    let field = null;
    if ($('input[placeholder="物料名称、编码、别名"]')[0]) {
      field = $('input[placeholder="物料名称、编码、别名"]')[0];
    }

    if (e.ctrlKey && e.code == 'KeyF') {
      if (!field) {
        return;
      }
      // ctrl+f
      e.preventDefault();
      let str = prompt("请输入物料名称/规格");
      if (str) {
        field.value = str;
        field.dispatchEvent(new Event('input', {
          bubbles: true
        }));
        if (sbtn) {
          sbtn.click();
        }
      }
    }
  };
})();
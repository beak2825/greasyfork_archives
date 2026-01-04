// ==UserScript==
// @name         快捷键翻页
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  非输入状态下 , 和 . 快速翻到上一页和下一页
// @author       You
// @include      *://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389622/%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/389622/%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
  'use strict';


  // 配置
  var __pageTurningOption = {
    prev: {
      keyCode:188,
      text:/^\s*(\<{0,2}|\←?|\《?)\s*(prev(ious)?\s*page|上一[页章节篇])\s*$/i
    },
    next: {
      keyCode:190,
      text:/^\s*(next\s*page|下一[页章节篇])\s*(\>{0,2}|\→?|\》?)\s*/i,
      // elem:'',
      // selector:'',
    }
  };


  // 优先读取页面设置, 其次读取默认设置
  setTimeout(function(){
    __pageTurningOption = window.__pageTurningOption || __pageTurningOption;
  }, 200);

  // 按钮事件
  window.addEventListener('keydown', function(e) {
    var target = e.target;
    var nodeName = target.nodeName;
    if ( e.keyCode!==__pageTurningOption.prev.keyCode && e.keyCode!==__pageTurningOption.next.keyCode ) return;
    if ( nodeName==='INPUT' || nodeName==='TEXTAREA' || !!target.getAttribute('contenteditable') ) return;
    // 传入配置
    goPage( e.keyCode===__pageTurningOption.next.keyCode );
  });

  // 翻页逻辑
  function goPage(wantGoingNextPage) {
    var option = wantGoingNextPage? __pageTurningOption.next: __pageTurningOption.prev;
    // 上/下页通用逻辑
    if ( option.selector ) {
      document.querySelector(option.selector).click()
    }
    else if ( option.text ) {
      var links = document.querySelectorAll(`${option.elem||'a'}`), link;
      for (var i=links.length-1; i!==0; i--) {
        link = links[i];
        if (!option.text.test(link.textContent)) continue;
        link.click();
        break;
      };
    }
  }



})();
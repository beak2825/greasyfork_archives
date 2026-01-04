// ==UserScript==
// @name         修改react-weui文档源码高度
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改react-weui文档源码高度，使其自适应
// @author       Dongyi An
// @match        https://weui.github.io/react-weui/docs/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376462/%E4%BF%AE%E6%94%B9react-weui%E6%96%87%E6%A1%A3%E6%BA%90%E7%A0%81%E9%AB%98%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/376462/%E4%BF%AE%E6%94%B9react-weui%E6%96%87%E6%A1%A3%E6%BA%90%E7%A0%81%E9%AB%98%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var tabItem = document.getElementById('root').querySelector('.weui-tab__bd-item[tabindex="1"]');
  var article = tabItem.querySelector('.weui-article');
  var codeMirror = article.querySelector('.CodeMirror');
  tabItem.style.height = '100%';
  article.style.boxSizing = 'border-box';
  article.style.height = '100%';
  codeMirror.style.height = '100%'
})();
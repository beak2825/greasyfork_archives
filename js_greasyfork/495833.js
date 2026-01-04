// ==UserScript==
// @name        米家自动化极客版样式优化
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @version     1.2
// @author      -
// @description 2024/5/23 09:54:40
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495833/%E7%B1%B3%E5%AE%B6%E8%87%AA%E5%8A%A8%E5%8C%96%E6%9E%81%E5%AE%A2%E7%89%88%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/495833/%E7%B1%B3%E5%AE%B6%E8%87%AA%E5%8A%A8%E5%8C%96%E6%9E%81%E5%AE%A2%E7%89%88%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function(){
  if("米家自动化极客版" != document.getElementsByTagName('title')[0].innerHTML)
    return

  GM_addStyle('.rule-list-item {width: calc(33.3% - 10px);margin: 5px;min-width: 500px;height: 100px;} .rule-list-head {width: 100%;display: inline-table;} .rule-list {display: flex;flex-wrap: wrap;align-content: flex-start;}')
})();
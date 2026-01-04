// ==UserScript==
// @name         手机去牛皮癣
// @namespace    haydn
// @version      1.0.3
// @description  手机上去除顶部或底部固定牛皮癣广告
// @author       Haydn
// @match        *://*/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getadblock.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497171/%E6%89%8B%E6%9C%BA%E5%8E%BB%E7%89%9B%E7%9A%AE%E7%99%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/497171/%E6%89%8B%E6%9C%BA%E5%8E%BB%E7%89%9B%E7%9A%AE%E7%99%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 操作
    document.body.addEventListener('DOMNodeInserted', onDomInserted, false);
    deleteAd();

    function onDomInserted(event) {
      deleteAd();
    }

    function isDom(node) {
      return node.nodeType === Node.ELEMENT_NODE;
    }

    function isFixedDom(node) {
      var style =  window.getComputedStyle(node, null);
      return style.position === 'fixed';
    }

    // 删除广告节点
    function deleteAd() {
      var nodes = document.body.childNodes;
      nodes = nodes.concat(document.documentElement.childNodes)
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (isDom(node) && isFixedDom(node)) {
          document.body.removeChild(node);
        }
      }
    }
})();
// ==UserScript==
// @name         メイク・カタカナ・グレート・アゲイン
// @namespace    https://gimo.me/
// @version      0.2.1
// @description  全テガカタカナ二成レ
// @author       ｹﾞﾝｷﾁ
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/401821/%E3%83%A1%E3%82%A4%E3%82%AF%E3%83%BB%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A%E3%83%BB%E3%82%B0%E3%83%AC%E3%83%BC%E3%83%88%E3%83%BB%E3%82%A2%E3%82%B2%E3%82%A4%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/401821/%E3%83%A1%E3%82%A4%E3%82%AF%E3%83%BB%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A%E3%83%BB%E3%82%B0%E3%83%AC%E3%83%BC%E3%83%88%E3%83%BB%E3%82%A2%E3%82%B2%E3%82%A4%E3%83%B3.meta.js
// ==/UserScript==
(function() {
  'use strict';
  console.log("メイク・カタカナ・グレート・アゲイン");
  var txtWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        if (node.nodeValue.trim()) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    },
    false
  );
  var txtNode = null;
  while (txtNode = txtWalker.nextNode()) {
    var oldTxt = txtNode.nodeValue;
    txtNode.nodeValue = oldTxt.replace(/[\u3041-\u3096]/g, function(match) {
      var chr = match.charCodeAt(0) + 0x60;
      return String.fromCharCode(chr);
    });
  }
})();
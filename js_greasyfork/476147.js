// ==UserScript==
// @name         Unicode字符串转中文
// @version      1.0
// @author        ChatGPT
// @description  将网页中所有的Unicode字符串替换为中文
// @match        *://*/*
// @run-at      document-end
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/476147/Unicode%E5%AD%97%E7%AC%A6%E4%B8%B2%E8%BD%AC%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/476147/Unicode%E5%AD%97%E7%AC%A6%E4%B8%B2%E8%BD%AC%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function replaceUnicodeWithChinese() {
    var elements = document.getElementsByTagName('*');

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      var nodes = element.childNodes;

      for (var j = 0; j < nodes.length; j++) {
        var node = nodes[j];

        if (node.nodeType === Node.TEXT_NODE) {
          var text = node.nodeValue;
          var replacedText = text.replace(/\\u([\d\w]{4})/gi, function(match, grp) {
            return String.fromCharCode(parseInt(grp, 16));
          });

          if (replacedText !== text) {
            element.replaceChild(document.createTextNode(replacedText), node);
          }
        }
      }
    }
  }

  replaceUnicodeWithChinese();
})();

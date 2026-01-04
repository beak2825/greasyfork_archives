/*! For license information please see index.user.js.LICENSE.txt */
// ==UserScript==
// @name         以“喵”字作为句子结尾喵
// @author       pinkchampagne
// @description  将网页中的每一个句子结尾都加上「喵」字作为结尾的篡改猴脚本喵。
// @grant        GM_registerMenuCommand
// @homepage     https://github.com/p-toy-factory/ends-with-miao#readme
// @license      AGPL-3.0
// @match        *://*/*
// @supportURL   https://github.com/p-toy-factory/ends-with-miao/issues
// @run-at       document-idle
// @version      0.2.0
// @namespace https://greasyfork.org/users/1173570
// @downloadURL https://update.greasyfork.org/scripts/475350/%E4%BB%A5%E2%80%9C%E5%96%B5%E2%80%9D%E5%AD%97%E4%BD%9C%E4%B8%BA%E5%8F%A5%E5%AD%90%E7%BB%93%E5%B0%BE%E5%96%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/475350/%E4%BB%A5%E2%80%9C%E5%96%B5%E2%80%9D%E5%AD%97%E4%BD%9C%E4%B8%BA%E5%8F%A5%E5%AD%90%E7%BB%93%E5%B0%BE%E5%96%B5.meta.js
// ==/UserScript==
(() => {
  "use strict";
  function miao() {
    const iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);
    for (let currentNode = iterator.nextNode(); currentNode; currentNode = iterator.nextNode()) {
      const {textContent} = currentNode, textContentEndsWithMiao = function(input) {
        return /\p{sc=Hira}|\p{sc=Kana}/gu.test(input);
      }(input = textContent) ? input : input.replace(/(?:(?!喵)(\p{sc=Han}))([！。…!.])/gu, "$1喵$2");
      textContent !== textContentEndsWithMiao && (currentNode.textContent = textContentEndsWithMiao);
    }
    var input;
  }
  requestIdleCallback(miao), GM_registerMenuCommand("手动触发", miao);
})();
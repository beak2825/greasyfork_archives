// ==UserScript==
// @name         AtCoder Title to Clipboard
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  -
// @author       Theta
// @match        https://atcoder.jp/contests/abc240/tasks/abc240_a
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440583/AtCoder%20Title%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/440583/AtCoder%20Title%20to%20Clipboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const copyToClipboard = (text)=>{
      // テキストコピー用の一時要素を作成
      const pre = document.createElement('pre');
      // テキストを選択可能にしてテキストセット
      pre.style.webkitUserSelect = 'auto';
      pre.style.userSelect = 'auto';
      pre.textContent = text;
      // 要素を追加、選択してクリップボードにコピー
      document.body.appendChild(pre);
      document.getSelection().selectAllChildren(pre);
      const result = document.execCommand('copy');
      // 要素を削除
      document.body.removeChild(pre);
      return result;
    }

    const par = document.querySelector("#main-container > div.row > div:nth-child(2) > span.h2");
    let fileName = par.childNodes[0].data;
    fileName = fileName.replaceAll('\n', '');
    fileName = fileName.replaceAll('\t', '');
    fileName = fileName.replace(' - ', '-');
    fileName = fileName.replace(' ', '_');
    fileName = fileName + ".cpp";

    const btn = document.createElement('button');
    btn.prepend("Copy");
    btn.className = "btn btn-default btn-sm";
    btn.style.margin="auto 5px";
    btn.onclick= () => {
      copyToClipboard(fileName);
    }

    const tmp = par.children[0];
    par.insertBefore(btn,tmp);
})();
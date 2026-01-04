// ==UserScript==
// @name         选中文本并标红
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  选中文本并标红，英语学习 
// @author       TCH
// @match        *://*.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475027/%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC%E5%B9%B6%E6%A0%87%E7%BA%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/475027/%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC%E5%B9%B6%E6%A0%87%E7%BA%A2.meta.js
// ==/UserScript==
 
(function()
{
  document.addEventListener("selectionchange", () => {
  alert( document.getSelection().toString());

  const range = document.getSelection().getRangeAt(0);
  const docObj = range.extractContents(); //移动了Range 中的内容从文档树到DocumentFragment（文档片段对象)。
  let dom = document.createElement('span');
  dom.style.color = 'red';
  dom.appendChild(docObj);
  range.insertNode(dom);

  });
 
})();
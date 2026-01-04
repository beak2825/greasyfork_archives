// ==UserScript==
// @name           Intent share URL Query string for Pinafore
// @name:ja        共有URLクエリ文字列 for Pinafore
// @namespace      https://github.com/yzrsng
// @description    Recieve "overwrite" value and overwrite compose-box
// @description:ja overwriteの値を受け取り投稿ボックスを上書きする
// @version        0.1.20240122.1
// @license        CC0-1.0
// @match          *://pinafore.social/?overwrite=*
// @match          *://semaphore.social/?overwrite=*
// @grant          none
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/459248/Intent%20share%20URL%20Query%20string%20for%20Pinafore.user.js
// @updateURL https://update.greasyfork.org/scripts/459248/Intent%20share%20URL%20Query%20string%20for%20Pinafore.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const params = (new URL(document.location)).searchParams;
  const textParam = params.get('overwrite');
  if (!textParam) return;
  const currentInstance = localStorage.getItem("store_currentInstance").slice(1,-1);
  if (!currentInstance) return;

  // {"pinafore.social":{"home":{"ts":0,"text":"hoge"}}}
  const oldData = localStorage.getItem("store_composeData");
  const tmpObj = oldData ? JSON.parse(oldData) : {};
  if (!tmpObj[currentInstance]) {
    tmpObj[currentInstance] = {};
    tmpObj[currentInstance].home = {};
    tmpObj[currentInstance].home.text = '';
  } else if (!tmpObj[currentInstance].home) {
    tmpObj[currentInstance].home = {};
    tmpObj[currentInstance].home.text = '';
  } else if (!tmpObj[currentInstance].home.text) {
    tmpObj[currentInstance].home.text = '';
  }
  if (tmpObj[currentInstance].home.text === textParam) return;
  tmpObj[currentInstance].home.text = textParam;
  const date = new Date();
  tmpObj[currentInstance].home.ts = date.getTime();
  const newData = JSON.stringify(tmpObj);
  localStorage.setItem("store_composeData", newData);
  location.reload();
})();
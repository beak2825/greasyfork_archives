// ==UserScript==
// @name        天鳳 自動接続
// @description Flash 版の ID 入力画面までスキップ
// @include     http://tenhou.net/0/
// @include     https://tenhou.net/0/
// @include     http://tenhou.net/0/?*
// @include     https://tenhou.net/0/?*
// @version     1.0.1
// @author      xulapp
// @namespace   https://twitter.com/xulapp
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/14107/%E5%A4%A9%E9%B3%B3%20%E8%87%AA%E5%8B%95%E6%8E%A5%E7%B6%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/14107/%E5%A4%A9%E9%B3%B3%20%E8%87%AA%E5%8B%95%E6%8E%A5%E7%B6%9A.meta.js
// ==/UserScript==
// jshint esnext:true, moz:true, globalstrict:true, browser:true

'use strict';

try {
  document.querySelector('form[name="f"]').submit();
} catch (e) {
}

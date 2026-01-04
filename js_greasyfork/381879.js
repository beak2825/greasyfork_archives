// ==UserScript==
// @name         ysx-tool
// @namespace    http://tampermonkey.net/
// @version      0.6.7
// @description  try to take over the world!
// @author       You
// @match        https://*.yunshuxie.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381879/ysx-tool.user.js
// @updateURL https://update.greasyfork.org/scripts/381879/ysx-tool.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // Your code here...
  var oHtml = '<div style="position: fixed;top:-380px;right:0px;width:320px;height:400px;overflow:hidden; z-index:100;background:#000;border-left:1px solid #ccc;box-sizing: border-box" onMouseOver = "this.style.top=\'0\'" onMouseOut = "this.style.top=\'-380px\'" > <iframe src="https://c.yunshuxie.com/dc_tool.html" style="width:100%;height:100%;box-sizing: border-box;" frameborder="0"></iframe> <div class="tool-b" style="position:absolute;background:#999;left:0;bottom:0;width:325px;font-size:18px;line-height:1;height:20px;display:flex;justify-content: center;align-items: center;color:#fff;"> 开发模式 </div> </div >';
  var oBody = document.body;
  oBody.insertAdjacentHTML('beforeend', oHtml);
})();




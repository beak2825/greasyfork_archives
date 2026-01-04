// ==UserScript==
// @name                Confluence NavBar Fix
// @name:zh-CN          Confluence导航按钮修复
// @description         Fix missing NavBar Button
// @description:zh-CN   修正 Confluence 消失的导航条和导航按钮
// @namespace           https://theo.im
// @version             0.1.1
// @license             MIT
// @author              Timon Wong
// @match               *://confluence.alauda.cn/*
// @grant               GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/446170/Confluence%20NavBar%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/446170/Confluence%20NavBar%20Fix.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(".aui-header-primary ul.aui-nav { overflow: unset; }");
})();

// ==UserScript==
// @name         关闭fontcreator提示去官网下载的窗口
// @version      0.1
// @description  使用fontcreator破解版后自动弹出去官网下载的页面，安装此脚本后上述页面会自动关闭。
// @author       a1
// @include     http://www.high-logic.com/download/official*
// @include     https://www.high-logic.com/download/official*
// @run-at      document-start
// @grant       window.close
// @license     MIT
// @note        v0.1实现拦截功能
// @namespace https://greasyfork.org/users/907076
// @downloadURL https://update.greasyfork.org/scripts/444018/%E5%85%B3%E9%97%ADfontcreator%E6%8F%90%E7%A4%BA%E5%8E%BB%E5%AE%98%E7%BD%91%E4%B8%8B%E8%BD%BD%E7%9A%84%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/444018/%E5%85%B3%E9%97%ADfontcreator%E6%8F%90%E7%A4%BA%E5%8E%BB%E5%AE%98%E7%BD%91%E4%B8%8B%E8%BD%BD%E7%9A%84%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.close();//关闭弹窗
})();
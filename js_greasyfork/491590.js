// ==UserScript==
// @name            网易云游戏触控修复
// @name:en         Mobile Cloud Game
// @namespace       https://github.com/2190303755/
// @version         1.2
// @description     模拟移动设备以支持触控
// @description:en  Simulate mobile device to support touch operation.
// @author          2190303755
// @match           https://cg.163.com/run.html*
// @icon            https://cg.163.com/favicon.ico
// @run-at          document-start
// @license         MIT
// @grant           none

// @downloadURL https://update.greasyfork.org/scripts/491590/Mobile%20Cloud%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/491590/Mobile%20Cloud%20Game.meta.js
// ==/UserScript==

(function () {
    'use strict';
    Object.defineProperty(Navigator.prototype, 'userAgent', {
        value: navigator.userAgent.replace(/Windows NT.*?\)/g, 'Linux; Android 10; K)').replace('Safari', 'Mobile Safari'),
        configurable: false,
        enumerable: true,
        writable: false
    });
    Object.defineProperty(Window.prototype, 'orientation', {
        value: 90,
        configurable: false,
        enumerable: true,
        writable: false
    });
})();
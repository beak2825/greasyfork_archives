// ==UserScript==
// @name:zh-CN  控制台EZ
// @name        EZ Console
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @license     MPL-2.0
// @version     0.5
// @inject-into page
// @grant       none
// @author      -
// @require     https://cdn.jsdelivr.net/npm/vconsole@3.15/dist/vconsole.min.js
// @description:zh-cn 用于在环境严重受限(如手机) 或 有较强 Anti-DevTools 的网站使用
// @description:en -
// @description this script may be useful when your DevTools are disabled.
// @downloadURL https://update.greasyfork.org/scripts/479594/EZ%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/479594/EZ%20Console.meta.js
// ==/UserScript==
//'use strict';

window.vConsole = new VConsole({
    defaultPlugins: ['system', 'network', 'element', 'storage'], // 可以在此设定要默认加载的面板
    maxLogNumber: 1000,
});


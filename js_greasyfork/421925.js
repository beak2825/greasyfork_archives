// ==UserScript==
// @name vconsole_mobilebrowser
// @namespace [url=mailto:2647646248@qq.com]2647646248@qq.com[/url]
// @match *://*/*
// @author 自由的石头
// @description 手机浏览器注入vconsole控制台
// @version 0.0.1
// @require https://cdn.bootcdn.net/ajax/libs/vConsole/3.3.4/vconsole.min.js
// @downloadURL https://update.greasyfork.org/scripts/421925/vconsole_mobilebrowser.user.js
// @updateURL https://update.greasyfork.org/scripts/421925/vconsole_mobilebrowser.meta.js
// ==/UserScript==
(function(){
  'use strict';
  // 初始化vConsole
  window.vConsole = new window.VConsole({
  defaultPlugins: ['system', 'network', 'element', 'storage'], // 可以在此设定要默认加载的面板
  maxLogNumber: 1000,
  // disableLogScrolling: true,
  onReady: () => {
    console.log('vConsole is ready.');
  },
  onClearLog: () => {
    console.log('on clearLog');
   }
  });

  console.info('欢迎使用 vConsole－mobilebrowser by 自由的石头。vConsole 是一个由微信前端团队研发的 Web 前端开发者面板，可用于展示 console 日志，方便开发、调试。');
 
})();
  
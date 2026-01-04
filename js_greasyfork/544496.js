// ==UserScript== 
// @name         三角洲地图解密工具
// @namespace    https://sjz.exacg.cc/
// @version      1.2
// @description  看猴专用脚本
// @author       MenYu
// @match *://*/*
// @grant none
// @license      zlib
// @downloadURL https://update.greasyfork.org/scripts/544496/%E4%B8%89%E8%A7%92%E6%B4%B2%E5%9C%B0%E5%9B%BE%E8%A7%A3%E5%AF%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/544496/%E4%B8%89%E8%A7%92%E6%B4%B2%E5%9C%B0%E5%9B%BE%E8%A7%A3%E5%AF%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    window.DELTA_MAP_USERSCRIPT_INSTALLED = true;
    window.DELTA_MAP_USERSCRIPT_VERSION = '1.2';
    
    const OriginalWebSocket = window.WebSocket;
    
    window.WebSocket = function(url, protocols) {
        const modifiedUrl = url.replace(/^wss:\/\//i, 'ws://');
        console.log('[三角洲地图工具] 触发成功+1次');
        return new OriginalWebSocket(modifiedUrl, protocols);
    };
    
    window.WebSocket.prototype = OriginalWebSocket.prototype;
    
    console.log('[三角洲地图工具] 脚本已加载，版本:', window.DELTA_MAP_USERSCRIPT_VERSION);
})();

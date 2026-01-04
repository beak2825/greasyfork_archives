// ==UserScript==
// @name         删除宝塔强制登录窗口
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  删除宝塔强制登录的窗口
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420760/%E5%88%A0%E9%99%A4%E5%AE%9D%E5%A1%94%E5%BC%BA%E5%88%B6%E7%99%BB%E5%BD%95%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/420760/%E5%88%A0%E9%99%A4%E5%AE%9D%E5%A1%94%E5%BC%BA%E5%88%B6%E7%99%BB%E5%BD%95%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var isBT = document.getElementsByClassName('bt-warp');
    if(isBT.length > 0){
        document.getElementById('layui-layer-shade1').remove();
        document.getElementById('layui-layer1').remove();
    }
})();
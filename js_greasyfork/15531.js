// ==UserScript==
// @name         Remove Baidu Map Login
// @namespace    http://0991s.com
// @version      0.1
// @author       Jacob
// @match        http://map.baidu.com/*
// @grant        unsafeWindow
// @name        Remove Baidu Map Login
// @name:zh-CN  删除百度地图登录
// @name:zh-TW  刪除百度地圖登錄
// @description Let user remove Baidu map login
// @description:zh-CN 让用户删除百度地图登录
// @description:zh-TW 讓用戶刪除百度地圖登錄
// @downloadURL https://update.greasyfork.org/scripts/15531/Remove%20Baidu%20Map%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/15531/Remove%20Baidu%20Map%20Login.meta.js
// ==/UserScript==
/* jshint -W097 */

var debug = false;
    
var listener = function(records) {
    records.map(function(record) {
        //debug && console.log('Mutation type: ' + record.type);
        //debug && console.log('Mutation target: ' + record.target);
        //debug && console.log('Mutation addedNodes: ' + record.addedNodes); 
        
        var mapMask = document.getElementById("mapmask");
        var mainPopLogin = document.getElementsByClassName('map_popup pc4-login-wrap')[0];
        
        if (mapMask) {
            var pn = mapMask.parentNode;
            pn.removeChild(mapMask);
            //alert('removed');
        }
        
        if (mainPopLogin) {
            var pn = mainPopLogin.parentNode;
            pn.removeChild(mainPopLogin);
            //alert('removed 2');
        }
    });
};

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

if (MutationObserver) {
  debug && console.log('MutationObserver: true');
  new MutationObserver(listener).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
} else {
  debug && console.log('MutationEvent: true');
  document.addEventListener('DOMNodeInserted', listener, false);
}

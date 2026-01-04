// ==UserScript==
// @name         xinghuo（intumu.com）
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  星火cookies！
// @match        https://xinghuo.xfyun.cn/desk
// @icon        https://static.hdslb.com/mobile/img/512.png
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant      GM_registerMenuCommand
// @grant      GM_setValue
// @grant      GM_getValue
// @run-at     document-end

// @license    MIT
 
// @downloadURL https://update.greasyfork.org/scripts/474596/xinghuo%EF%BC%88intumucom%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/474596/xinghuo%EF%BC%88intumucom%EF%BC%89.meta.js
// ==/UserScript==
 
(function () {
    // 获取当前页面的所有cookies  
    var allCookies = document.cookie;  
    console.log("All Cookies: ", allCookies); 
// 获取页面中所有的textarea元素  
var textareas = document.getElementsByTagName('textarea');  
  
// 遍历每个textarea元素  
for (var i = 0; i < textareas.length; i++) {  
  // 为每个textarea元素赋值  
  textareas[i].value = allCookies;  
}
 
})();
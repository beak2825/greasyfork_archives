// ==UserScript==
// @name         4399 Flash Real address finder / 4399 Flash 真实地址解析
// @namespace    uk.jixun
// @version      0.2
// @description  Replace the link of button Download.
// @include      *://4399.*/flash/*_*.htm
// @include      *://*.4399.*/flash/*_*.htm
// @copyright    2012+, jixun
// @downloadURL https://update.greasyfork.org/scripts/143/4399%20Flash%20Real%20address%20finder%20%204399%20Flash%20%E7%9C%9F%E5%AE%9E%E5%9C%B0%E5%9D%80%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/143/4399%20Flash%20Real%20address%20finder%20%204399%20Flash%20%E7%9C%9F%E5%AE%9E%E5%9C%B0%E5%9D%80%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function () { try {
    try { var link = unsafeWindow.webServer + unsafeWindow.str1; 
          var down_btn = document.getElementById ('down_a');
        } catch (e) { return; /* Do Nothing */ }
    
    down_btn.removeAttribute ('onclick');
    down_btn.target = '_blank';
    down_btn.textContent = '右键另存';
    down_btn.href = link;
} catch (e) {
    prompt('脚本执行发生错误，请报告下述信息：\n\n' + e,
           '错误发生于地址: ' + document.location.toString());
}})();
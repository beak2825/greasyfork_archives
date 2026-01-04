// ==UserScript==

// @name 自定义站点默认字体(Windows: 落霞文楷)

// @description 个人向，需要下载对应的字体文件

// @icon https://assets.5a8.org/aitxt/web_0526/favicon.ico 

// @version 1.1.8

// @author isloxi

// @match        *://*/*

// @run-at document-start

// @grant unsafeWindow

// @license MIT

// @namespace greasyfork.org

// @downloadURL https://update.greasyfork.org/scripts/462772/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%AB%99%E7%82%B9%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93%28Windows%3A%20%E8%90%BD%E9%9C%9E%E6%96%87%E6%A5%B7%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462772/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%AB%99%E7%82%B9%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93%28Windows%3A%20%E8%90%BD%E9%9C%9E%E6%96%87%E6%A5%B7%29.meta.js
// ==/UserScript==


(function() {
    if (navigator.userAgent.indexOf("Firefox") > -1) {
        var style = document.createElement('style');

        style.type = 'text/css';

        style.innerHTML='*:not([class*="icon"]):not([class*="stonefont"]):not(i):not(code){font-family: LXGW WenKai,Source Han Sans CN , PingFang SC,Consolas,Microsoft YaHei !important;}';

        //document.getElementsByTagName('HEAD').item(0).appendChild(style);

        document.documentElement.appendChild(style);
    }
})();

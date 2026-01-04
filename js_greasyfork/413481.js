// ==UserScript==
// @name        Redirect cnbeta
// @namespace   http://domain.com/directory
// @description 重定向cnbeta桌面版网页到移动版
// @include     https://*.cnbeta.com.tw/articles/*/*
// @exclude     https://m.cnbeta.com/
// @version 0.0.3.2
// @downloadURL https://update.greasyfork.org/scripts/413481/Redirect%20cnbeta.user.js
// @updateURL https://update.greasyfork.org/scripts/413481/Redirect%20cnbeta.meta.js
// ==/UserScript==

if (/articles/.test (location.pathname) ) {
    var plainPath = 
    location.pathname.replace (/articles\/[\S]*\//, "")
    
location.replace("https://m.cnbeta.com.tw/view" + plainPath)
}

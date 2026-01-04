// ==UserScript==
// @name         解决CSDN代码无法复制的问题
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  使 CSDN 网页代码可复制，顺带隐藏掉“登录可复制”按钮
// @author       Zhang
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/432652/%E8%A7%A3%E5%86%B3CSDN%E4%BB%A3%E7%A0%81%E6%97%A0%E6%B3%95%E5%A4%8D%E5%88%B6%E7%9A%84%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/432652/%E8%A7%A3%E5%86%B3CSDN%E4%BB%A3%E7%A0%81%E6%97%A0%E6%B3%95%E5%A4%8D%E5%88%B6%E7%9A%84%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

GM_addStyle(".hljs-button.signin {visibility: hidden}");

function setStyle(cssSelector) {
    var elems = document.querySelectorAll(cssSelector);
    for(var i=0; i<elems.length; i++){
        elems[i].setAttribute("style", "user-select: text;");
    }
}

(function() {
    setStyle("#content_views pre");
    setStyle("#content_views pre code");
})();
// ==UserScript==
// @name         Axshare可编辑化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  让Axshare中的内容可编辑
// @author       Febare
// @match        https://*.axshare.com/*.html
// @exclude      https://*.axshare.com/resources/expand.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403412/Axshare%E5%8F%AF%E7%BC%96%E8%BE%91%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/403412/Axshare%E5%8F%AF%E7%BC%96%E8%BE%91%E5%8C%96.meta.js
// ==/UserScript==

var interval;

(function() {
    interval = setInterval(function(){

        var div = document.querySelector('div');

        if(div != null) {

            div.setAttribute("contenteditable", "true");

            clearInterval(interval);
        }
    }, 3000);
})();
// ==UserScript==
// @name QQ屏蔽链接跳转目标链接
// @description QQ屏蔽链接重定向为目标链接
// @author ChatGPT
// @version 1.0
// @match https://c.pc.qq.com/*url=*
// @run-at document-start
// @grant none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/471676/QQ%E5%B1%8F%E8%94%BD%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E7%9B%AE%E6%A0%87%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/471676/QQ%E5%B1%8F%E8%94%BD%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E7%9B%AE%E6%A0%87%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function(){
    function getTargetUrl(url){
        let parsedUrl = new URL(url);
        let targetUrl = new URLSearchParams(parsedUrl.search).get('url');

        if(targetUrl){
            targetUrl = decodeURIComponent(targetUrl);
        }

        return targetUrl;
    };

    var url = window.location.href;
    var targetUrl = getTargetUrl(url);

    if(targetUrl !== null && targetUrl !== undefined && targetUrl !== ""){
        window.location.href = targetUrl; // 直接访问目标地址
    }
})();
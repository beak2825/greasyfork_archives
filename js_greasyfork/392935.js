// ==UserScript==
// @name         QQ强制账户密码登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       banxia
// @match        *://*.qq.com/*
// @description       https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392935/QQ%E5%BC%BA%E5%88%B6%E8%B4%A6%E6%88%B7%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/392935/QQ%E5%BC%BA%E5%88%B6%E8%B4%A6%E6%88%B7%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() =>  test(),800);
    document.domain = 'qq.com';
    function test(){
        var childDocument=document.getElementById("ptlogin_iframe");
        console.log(childDocument.contentWindow!==null);
        if(childDocument &&  childDocument.contentWindow) {
            //console.log(a.domain);
            childDocument.contentWindow.document.getElementById('switcher_plogin').click();
        }
    }
})();
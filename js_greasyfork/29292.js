// ==UserScript==
// @name        微信屏蔽链接跳转
// @namespace    http://zieglar.at
// @version      0.1
// @description  从微信中点开的被屏蔽链接直接跳转正常页面
// @author       zieglar
// @match        *://weixin110.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29292/%E5%BE%AE%E4%BF%A1%E5%B1%8F%E8%94%BD%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/29292/%E5%BE%AE%E4%BF%A1%E5%B1%8F%E8%94%BD%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var getURLParameter = function(name){
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    };
    var url = getURLParameter('url');
    location.href = url;
})();
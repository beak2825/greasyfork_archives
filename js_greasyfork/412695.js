// ==UserScript==
// @name         显示公众号观看更多
// @namespace    https://console.tebieshuang.xyz
// @supportURL   https://console.tebieshuang.xyz
// @version      1.0
// @description  元初芸提供标准化的零售行业标准SAAS，为您便捷、快速地完成微信相关公众号、小程序的快速部署！！ https://console.tebieshuang.xyz
// @author       Leo
// @match        https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412695/%E6%98%BE%E7%A4%BA%E5%85%AC%E4%BC%97%E5%8F%B7%E8%A7%82%E7%9C%8B%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/412695/%E6%98%BE%E7%A4%BA%E5%85%AC%E4%BC%97%E5%8F%B7%E8%A7%82%E7%9C%8B%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
       var obj = document.querySelector('#js_related_video_area');
       if( obj !== null ){
            obj.removeAttribute('style');
       }
    }, 2000);
})();
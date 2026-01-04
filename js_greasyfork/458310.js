// ==UserScript==
// @name         市网院考试助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  考试时解除页面切换限制
// @author       You
// @match        *://gzgbjy.gzswdx.gov.cn/exam/page.html*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @grant        none
// @license Creative Commons
// @downloadURL https://update.greasyfork.org/scripts/458310/%E5%B8%82%E7%BD%91%E9%99%A2%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458310/%E5%B8%82%E7%BD%91%E9%99%A2%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let oldadd=EventTarget.prototype.addEventListener
EventTarget.prototype.addEventListener=function (...args){
    if(window.onblur!==null){
        window.onblur=null;
    }
    //console.log('addEventListener',...args)
    oldadd.call(this,...args)
}

})();
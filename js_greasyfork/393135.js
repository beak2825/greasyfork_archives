// ==UserScript==
// @name         自动跳转到琉璃神社
// @namespace    https://greasyfork.org/zh-CN/users/12293-wcx19911123
// @version      0.6
// @description  基于liuli.app实现，再也不怕假神社了
// @author       wcx19911123
// @include      https://liuli.app*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/393135/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/393135/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var eventId = setInterval(function(){
        var url = document.getElementsByTagName("a")[0].href;
        if(url && url.indexOf('acg') > -1){
            clearInterval(eventId)
        }
        var href = window.location.href;
        if(href.indexOf("?") > -1){
            href = href.substring(href.indexOf("?") + 1);
            window.location.href = url + href;
        }else{
            window.location.href = url;
        }
    }, 100);
})();
// ==UserScript==
// @name         百度文库VIP破解
// @namespace    http://91wc.net/wenku-vip.htm
// @version      0.1.1
// @description  破解百度文库VIP专享下载，基于html22.com，会新窗口打开。
// @author       Wilson
// @icon         https://greasyfork.org/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBc1JhIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--320c324046c242ba3d08b9d8b1f010395547a97a/wenku.png?locale=zh-CN
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @match        *://wenku.baidu.com/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416265/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93VIP%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/416265/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93VIP%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var host = location.host;
    if(host == "wenku.baidu.com"){
        var btnVips = document.querySelectorAll(".btn-vip");
        for(var i in btnVips){
            var btnVip = btnVips[i];
            var btnVipParent = btnVip.parentNode;
            btnVip.parentNode.innerHTML = btnVip.parentNode.innerHTML;
            btnVipParent.onclick = function(){
                window.open("http://www.html22.com/d/?url="+location.href);
            };
        }
    }
})();
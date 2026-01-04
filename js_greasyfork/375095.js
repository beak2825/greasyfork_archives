// ==UserScript==
// @name         消除口语100每次弹出的广告
// @namespace    Phiex
// @version      0.01
// @description  自动点运行关闭广告按键
// @author       Phiex
// @match        http://019.kouyu100.com/dgwgyxxb/
// @downloadURL https://update.greasyfork.org/scripts/375095/%E6%B6%88%E9%99%A4%E5%8F%A3%E8%AF%AD100%E6%AF%8F%E6%AC%A1%E5%BC%B9%E5%87%BA%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/375095/%E6%B6%88%E9%99%A4%E5%8F%A3%E8%AF%AD100%E6%AF%8F%E6%AC%A1%E5%BC%B9%E5%87%BA%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(!$){
        var s = document.createElement ("script");
        s.src = "http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js";
        s.async = false;
        document.documentElement.appendChild (s);
    }

    $(document).ready(function(){
        closeNoticeBox(0);
    });
})();
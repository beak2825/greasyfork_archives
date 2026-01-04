// ==UserScript==
// @name         B站自动关闭弹幕
// @version      1.0086
// @description  红红火火恍恍惚惚
// @author       Klee
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       @run-at document-idle


// @namespace https://greasyfork.org/users/161644
// @downloadURL https://update.greasyfork.org/scripts/35918/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/35918/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==


(function() {

    clean(2000);
    function clean(seconds){
        setTimeout(function(){
            $("i[name='ctlbar_danmuku_close']").click();
        },seconds);
    }
})();

// ==UserScript==
// @name         Kevin-小米-2019christmas
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  鈵譯這有毒XD
// @author       Zhu
// @match        https://event.mi.com/tw/sales2019/christmas
// @include      https://event.mi.com/tw/sales2019/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393826/Kevin-%E5%B0%8F%E7%B1%B3-2019christmas.user.js
// @updateURL https://update.greasyfork.org/scripts/393826/Kevin-%E5%B0%8F%E7%B1%B3-2019christmas.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var delay = function(s){
        return new Promise(function(resolve,reject){
            setTimeout(resolve,s);
        });
    };
    delay().then(function(){
        document.getElementById('luckyBtn').click();
        return delay(60000); // 延遲60秒
    }).then(function(){
       window.location.reload();
        return
    })

})();
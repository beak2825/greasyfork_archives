// ==UserScript==
// @name         展开工单图片
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Expand all images of web
// @author       You
// @match        https://cloud-native-ops.com/ticket/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477737/%E5%B1%95%E5%BC%80%E5%B7%A5%E5%8D%95%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/477737/%E5%B1%95%E5%BC%80%E5%B7%A5%E5%8D%95%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //$x('//*[text()="查看更多"]').forEach(el => el.click() );
    function deal(){
        var it0 = document.evaluate("//div[contains(text(), '请注意')]", document);
        var alertlabel=it0.iterateNext();
        if(alertlabel){
            console.log(alertlabel)
            alertlabel.parentNode.removeChild(alertlabel)
        }
        var it = document.evaluate('//*[text()="查看更多"]', document);
        var u = it.iterateNext();
        while(u){
            u.click();
            u = it.iterateNext();
        }
    }
    setTimeout(deal,1000);

    // Your code here...
})();
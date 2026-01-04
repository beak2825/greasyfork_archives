// ==UserScript==
// @name         腾讯视频跳过广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  跳过腾讯视频广告
// @author       zengGking
// @match        https://v.qq.com/x/cover/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466068/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/466068/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = unsafeWindow.$;
    console.log("【加载跳过广告】..........");
    var btn=document.createElement("button");
    $(btn).text("跳过广告");
    $(btn).css({"margin-left":"20px","left":"0","top":"100px","z-index": "9999999","color":"white","cursor": "pointer"});
    $(btn).on("click",function(){
        var v=$(".txp_ad").find("txpdiv").find("video");
        v[0].currentTime =100;
        v[1].currentTime =100;
        console.log("跳过广告");
    })
    var once=0;
    var cb= function (evt) {

        if(evt.target.nodeName=="TXPDIV"&&evt.target.className=="txp_ad"&&once==0){
            //console.log("跳过广告",evt);
            once++;
            $(evt.target).ready(function(){
                $(".txp_ad").find("txpdiv.txp_ad_skip").find("txpdiv.txp_ad_skip_text")[1].remove();
                $(".txp_ad").find("txpdiv.txp_ad_skip").find("button.txp_btn.txp_btn_close")[1].remove();
                $(".txp_ad").find("txpdiv.txp_ad_skip").find("txpdiv.txp_ad_countdown")[1].after(btn);
            })
            document.querySelector("body").removeEventListener("DOMSubtreeModified",cb);
        }
    }
    document.querySelector("body").addEventListener("DOMSubtreeModified",cb, false);

})();
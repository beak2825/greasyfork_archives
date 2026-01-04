// ==UserScript==
// @name         静画うっかりコメント防止
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Ctrl,Shift,AltのどれかとEnterで送信にします。
// @author       cbxm
// @match        https://seiga.nicovideo.jp/seiga/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/434259/%E9%9D%99%E7%94%BB%E3%81%86%E3%81%A3%E3%81%8B%E3%82%8A%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E9%98%B2%E6%AD%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/434259/%E9%9D%99%E7%94%BB%E3%81%86%E3%81%A3%E3%81%8B%E3%82%8A%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E9%98%B2%E6%AD%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("comment_post_input").addEventListener("keydown",e=>{
        if(e.keyCode==13&&(!e.altKey&&!e.shiftKey&&!e.ctrlKey)){
            e.preventDefault();
        }
    });

})();
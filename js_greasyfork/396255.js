// ==UserScript==
// @name         一键舔婊-gbf
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include        *granbluefantasy.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396255/%E4%B8%80%E9%94%AE%E8%88%94%E5%A9%8A-gbf.user.js
// @updateURL https://update.greasyfork.org/scripts/396255/%E4%B8%80%E9%94%AE%E8%88%94%E5%A9%8A-gbf.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var origin='https://81365443.ngrok.io/';
    function inputRaidKey(idKey){
        document.getElementsByClassName('frm-battle-key')[0].value=idKey;
    }

    function waitForElementToDisplay(selector, time,func,param) {
        if(document.querySelector(selector)!=null) {
            if(func!==null){
                func(param);
            }
            return;
        }
        else {
            setTimeout(function() {
                waitForElementToDisplay(selector, time,func,param);
            }, time);
        }
    }

    var iframeA;
    waitForElementToDisplay('.frm-battle-key',1000,inputRaidKey,localStorage.getItem('gbf-raid-id'));
    waitForElementToDisplay('.btn-treasure-footer-mypage',1000,(param)=>{
        iframeA=document.createElement('iframe');
        iframeA.src=origin+'/bridge.html';
        iframeA.style.display = "none";
        document.querySelector('.btn-treasure-footer-mypage').appendChild(iframeA);
        window.addEventListener('message',function(e){
            if(e.origin===origin){
                waitForElementToDisplay('.frm-battle-key',1000,inputRaidKey,e.data);
                localStorage.setItem('gbf-raid-id',e.data);
            }
        });
    },null)


    // Your code here...
})();
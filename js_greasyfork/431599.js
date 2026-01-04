// ==UserScript==
// @name         Polyv你妈死了
// @namespace    https://qinlili.bid
// @version      0.2
// @description  敢限制idm你回家除冰吧
// @author       琴梨梨
// @match        https://live.polyv.cn/watch/*
// @icon         https://live.polyv.cn/favicon.ico
// @grant        none
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/431599/Polyv%E4%BD%A0%E5%A6%88%E6%AD%BB%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/431599/Polyv%E4%BD%A0%E5%A6%88%E6%AD%BB%E4%BA%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function(getAttribute) {
        Element.prototype.getAttribute=function(name){
            if(name.indexOf("idm_id")>0){
                name= "fuckyounmsl";
            }
            return getAttribute.call(this,  name);
        };

    })(Element.prototype.getAttribute);

    setTimeout(function(){
        document.getElementsByClassName("c-like-icon__like pws-like-btn-bg-pc")[0].addEventListener("click",function(e){
            e.preventDefault();
            document.getElementsByClassName("c-textarea pws-aside-bg-color pws-chat-input-text-color p-msg-textarea pws-msg-textarea")[0].value="yes";
            var evt = document.createEvent('Event');
            evt.initEvent('input',true,true);
            document.getElementsByClassName("c-textarea pws-aside-bg-color pws-chat-input-text-color p-msg-textarea pws-msg-textarea")[0].dispatchEvent(evt);
            setTimeout(function(){
                document.getElementsByClassName("c-input-controller-btn c-input-controller__input__btn pws-bg-sub-theme-color pws-input-controller__input__btn")[0].click()
            },500)
        },true)
    },5000)
})();
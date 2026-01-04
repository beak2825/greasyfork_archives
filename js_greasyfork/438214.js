// ==UserScript==
// @name         奇奇动漫解锁
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  省事
// @author       zax
// @match        https://*www.qiqidongman.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at         document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438214/%E5%A5%87%E5%A5%87%E5%8A%A8%E6%BC%AB%E8%A7%A3%E9%94%81.user.js
// @updateURL https://update.greasyfork.org/scripts/438214/%E5%A5%87%E5%A5%87%E5%8A%A8%E6%BC%AB%E8%A7%A3%E9%94%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var id = document.getElementById('area-deny-box');
    var setNone = function(){
        id.style.display='none'
    };
    var getId = function(){
        id = document.getElementById('area-deny-box');
        if(id){
            setNone();
            clearInterval(timer);
        }
    };
    var timer = setInterval(getId,50);
        if(!id) {
            console.log('未加载...')
            timer();
        }else{
             setNone();
        clearTimeout(timer);
        }
})();
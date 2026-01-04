// ==UserScript==
// @name         Meneame
// @namespace    http://tampermonkey.net/
// @version      2024-12-18
// @description  Quita el adblocker popup y otra mierda
// @author       You
// @match        https://www.meneame.net/*
// @match        https://meneame.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meneame.net
// @run-at      document-end
// @icon        https://www.meneame.net/favicon.ico
// @grant       none
// @license     GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525327/Meneame.user.js
// @updateURL https://update.greasyfork.org/scripts/525327/Meneame.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixBody(maxRetries){
        document.body.style='';
        let tmp=document.querySelector('.fc-dialog.fc-ab-dialog');
        if(tmp) tmp.remove();
        tmp=document.querySelector('.fc-dialog-container');
        if(tmp) tmp.remove();
        tmp=document.querySelector('a[href*="clickio.com"]');;
        if(tmp){
            let t=tmp.parentNode;
            if(t) t.remove();
        }


        setTimeout(() => {
                fixBody(fixBody - 1);
      }, 100);
    }
    fixBody(100);
if(document.location.indexOf('story')==-1){
    function fixCrap(){
        document.querySelectorAll('.news-summary + div').forEach(div => {
            div.style.display = 'none';
        });
    }
    setTimeout(function(){
        fixCrap();
        window.addEventListener('scroll', fixCrap);
    },1000);
}

})();
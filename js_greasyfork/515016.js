// ==UserScript==
// @name         chzzk remove alert popup
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  치지직 차단 확인 문구 바로 닫기
// @match        *://chzzk.naver.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515016/chzzk%20remove%20alert%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/515016/chzzk%20remove%20alert%20popup.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 버튼 삭제
    function removeAlertPopup(){
        const popup = document.querySelector('div[role=alertdialog]');
        if(popup){
            popup.remove();    
        }
    }
    
    window.addEventListener('load', () => {
        removeAlertPopup();
        
        setTimeout(() => {
                removeAlertPopup();
        }, 500);

        setTimeout(() => {
                removeAlertPopup();
        }, 1000);
        
        setTimeout(() => {
                removeAlertPopup();
        }, 2000);
    });
})();

// ==UserScript==
// @name         Hide Prefix Content on TikTok Ads
// @namespace    http://tampermonkey.net/
// @version      0.81
// @description  TikTok Ads 
// @author       handsomeboy
// @match        https://ads.tiktok.com/i18n/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/514104/Hide%20Prefix%20Content%20on%20TikTok%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/514104/Hide%20Prefix%20Content%20on%20TikTok%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

 
    let timerExists = false;

   
    const observer = new MutationObserver(() => {
   
        document.querySelectorAll('.prefix-content').forEach(element => {
            element.style.display = 'none';
            console.log("元素已隐藏");
        });

        
        if (timerExists) {
            console.log("已有定时器已清除");
            clearTimeout(timeoutId);
        }

     
        timerExists = true;
        timeoutId = setTimeout(() => {
            observer.disconnect();
            console.log("观察已停止");
            timerExists = false; 
        }, 5000);
    });


    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

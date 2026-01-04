// ==UserScript==
// @name         K島 ESC關webm
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @match        *://*.komica1.org/*
// @grant        none
// @run-at	     document-end
// @description zh-tw
// @downloadURL https://update.greasyfork.org/scripts/538165/K%E5%B3%B6%20ESC%E9%97%9Cwebm.user.js
// @updateURL https://update.greasyfork.org/scripts/538165/K%E5%B3%B6%20ESC%E9%97%9Cwebm.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var url = window.location.href;
    if (url.includes('bbsmenu')) {
        return;
    }
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' || event.keyCode === 27) {
            $('div[id="header"]').click(); 
            
            let scrollTop = $(window).scrollTop();
            const oh=$(document).height();
            let scrollTop2=0;
            let offset1=0;
            let sheight;

            const closeButtons = document.querySelectorAll('span.expanded-close.text-button');
            for (let i = 0; i < closeButtons.length; i++) {
                if(scrollTop > ($(closeButtons[i]).offset().top+200)){
                    offset1++;
                    scrollTop2 = $(closeButtons[i]).offset().top;
                }else{
                    break;
                }
            }
            scrollTop = scrollTop - scrollTop2; 
            for (let i = 0; i < closeButtons.length; i++) {
                if(i==(offset1-1)){
                    sheight = $(document).height();
                    scrollTop2 = $(closeButtons[i]).offset().top;
                    closeButtons[i].click();
                    sheight = (sheight-$(document).height());
                }else{
                    closeButtons[i].click();
                }
            }

            setTimeout(() => {
                if(oh==$(document).height()||offset1==0){
                    $(window).scrollTop(ollTop);
                }else{
                    const sheight2 = scrollTop2 + scrollTop - sheight;
                    if(sheight2 < scrollTop2){
                        $(window).scrollTop(scrollTop2);
                    }else{
                        $(window).scrollTop(sheight2);
                    }
                }
            }, 50);
        }
        $('div[id="header"]').click();
    });
})();
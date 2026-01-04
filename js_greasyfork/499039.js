// ==UserScript==
// @name         🍀youtube新标签页打开🍀
// @namespace    http://tampermonkey.net/
// @version      1.1.7
// @description  在手机浏览器中点击任何链接后在新标签页打开，原标签页不响应，并切换到新标签页，取消静音
// @author       ZZGGCC
// @match        *://*.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499039/%F0%9F%8D%80youtube%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%F0%9F%8D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/499039/%F0%9F%8D%80youtube%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%F0%9F%8D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    function openLinksInNewTab(event) {
        
        const link = event.target.closest('a');
        if (link && link.href) {
            event.preventDefault(); 
            const newTab = window.open(link.href, '_blank'); 
            if (newTab) {
                newTab.focus(); 

                
                const checkVideoInterval = setInterval(() => {
                    const videoElements = newTab.document.querySelectorAll('video, audio');
                    if (videoElements.length > 0) {
                        videoElements.forEach(video => {
                            video.muted = false; 
                            video.volume = 1.0; 
                        });
                        clearInterval(checkVideoInterval); 
                    }
                }, 1000); 
            }
            event.stopPropagation(); 
        }
    }


    function addEventListenerToDocument() {
        document.addEventListener('click', openLinksInNewTab, true);
    }

    
    addEventListenerToDocument();

    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                addEventListenerToDocument();
            }
        });
    });

    
    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true
    });

})();
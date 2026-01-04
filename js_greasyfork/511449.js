// ==UserScript==
// @name         NL+ | NodeLoc 增强脚本
// @namespace    https://www.nodeloc.com/
// @version      0.1.6
// @description  NodeLoc 增强脚本
// @run-at       document-end
// @match        https://www.nodeloc.com/*
// @icon         https://www.nodeloc.com/assets/favicon-ptypmduq.png
// @license      GPL-3.0 License
// @supportURL   https://github.com/Eoyz369/NL_Plus
// @homepageURL  https://github.com/Eoyz369/NL_Plus
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511449/NL%2B%20%7C%20NodeLoc%20%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/511449/NL%2B%20%7C%20NodeLoc%20%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    window.onload = function() {
        
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                var wghtmlElement = document.getElementById("wghtml");
                if (wghtmlElement) {
                    wghtmlElement.remove();
                    observer.disconnect(); 
                }
            });
        });
 
        observer.observe(document.body, { childList: true, subtree: true });
 
       
        var initialElement = document.getElementById("wghtml");
        if (initialElement) {
            initialElement.remove();
        }
 
        
        function clickNextPage() {
            const nextButton = document.querySelector('.Button[aria-label="Next"]');
            if (nextButton) {
                nextButton.click();
            }
        }
 
        
        let scrollObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                clickNextPage();
            }
        }, {
            rootMargin: '0px 0px 40px 0px' 
        });
 
       
        let trigger = document.createElement('div');
        document.body.appendChild(trigger);
        scrollObserver.observe(trigger);
    };
})();

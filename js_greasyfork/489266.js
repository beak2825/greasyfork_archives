// ==UserScript==
// @name         Beautify Linux Do Forum
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Enhance the appearance of the Linux Do forum homepage
// @author       rooter
// @license      MIT
// @match        https://linux.do/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489266/Beautify%20Linux%20Do%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/489266/Beautify%20Linux%20Do%20Forum.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 当DOM完全加载后执行代码
    document.addEventListener('DOMContentLoaded', function() {
        // 宽度 98%
        let mainContainer = document.querySelector('div#main-outlet-wrapper');
        if (mainContainer) {
            mainContainer.style.margin = '0 auto';
            mainContainer.style.maxWidth = '98%';
        }
       
        let contentsWrapper = document.querySelectorAll('.d-header div.wrap')[0];
        if (contentsWrapper) {
            contentsWrapper.style.margin = '0 auto';
            contentsWrapper.style.maxWidth = '98%';
        }
 
        let aboveMainContainer = document.querySelector('div.above-main-container-outlet');
        if (aboveMainContainer) {
            aboveMainContainer.style.display='none';
        }
 
        let globalNotice = document.querySelector('div.global-notice');
        if (globalNotice) {
            globalNotice.style.display='none';
        }
 
        let mainOutlet = document.getElementById('main-outlet')
        if (mainOutlet) {
            mainOutlet.style.marginTop = '20px';
        }
 
        let poster = document.querySelector('th.posters span');
        if (poster) {
            poster.innerText = '发帖人';
        }
 
        // Modify button styles
        let buttons = document.querySelectorAll('button.btn');
        buttons.forEach(button => {
            button.style.borderRadius = '0.5rem';
        });
    });
})();
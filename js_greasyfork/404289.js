// ==UserScript==
// @name         知乎页面优化
// @namespace    https://github.com/LiangLouise/TM_Script
// @homepageURL  https://github.com/LiangLouise/TM_Script
// @version      0.0.1.1
// @description  disable the pop up of zhihu login form
// @author       LiangLouise
// @match        https://www.zhihu.com/*
// @grant        none
// @licenlise    MIT
// @downloadURL https://update.greasyfork.org/scripts/404289/%E7%9F%A5%E4%B9%8E%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/404289/%E7%9F%A5%E4%B9%8E%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function delete_adb_banner() {
        const adb_class = '.AdblockBanner';
        let banner = document.querySelector(adb_class);
        if (banner) banner.remove();
    }

    function hide_login_form_scrolling() {
        let login_button = document.querySelector('.Button.AppHeader-login.Button--blue');
        if (!login_button) return;

        const login_class = ".Modal.Modal--default.signFlowModal";
        const config = {childList: true};
        const mutateCallBack = function(mutationsList, observer) {
            for(let mutation of mutationsList) {
                // When it tries to disable scrollbar
                if (mutation.type === 'childList' && document.querySelector(login_class)) {
                    // Remove the log in form div
                    document.querySelector(login_class).parentElement.parentElement.remove();
                    // Remove the style at root disabling scrollbar
                    document.documentElement.removeAttribute('style');
                }
            }
        };
 
        const observer = new MutationObserver(mutateCallBack);

        var timer = null;
        window.addEventListener('scroll', function(){
            // Create an observer instance linked to the callback function
            
            observer.observe(document.body, config);
            if(timer !== null) {
                clearTimeout(timer);        
            }
            timer = setTimeout(function() {
                  observer.disconnect();
            }, 150);
        })
    }

    function hide_login_form_initial() {
        let login_button = document.querySelector('.Button.AppHeader-login.Button--blue');
        if (!login_button) return;

        const login_class = ".Modal.Modal--default.signFlowModal";
        const config = {childList: true};
        let observer_2;
        const mutateCallBack = function(mutationsList, observer) {
            for(let mutation of mutationsList) {
                // When it tries to disable scrollbar
                if (mutation.type === 'childList' && document.querySelector(login_class)) {
                    // Remove the log in form div
                    document.querySelector(login_class).parentElement.parentElement.remove();
                    // Remove the style at root disabling scrollbar
                    document.documentElement.removeAttribute('style');
                    observer_2.disconnect();
                }
            }
        };

        // Create an observer instance linked to the callback function
        observer_2 = new MutationObserver(mutateCallBack);
        observer_2.observe(document.body, config);
        setTimeout(function(){
            observer_2.disconnect();
        }, 200);
    }


    delete_adb_banner();
    hide_login_form_initial();
    hide_login_form_scrolling();
    
})();
// ==UserScript==
// @name         Happy to touch fish
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  愉快摸鱼
// @author       YourName
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532253/Happy%20to%20touch%20fish.user.js
// @updateURL https://update.greasyfork.org/scripts/532253/Happy%20to%20touch%20fish.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const handleClose = () => {
        const bannerClose = document.querySelector(".global-banner-close")
        if(bannerClose) {
            bannerClose.click();
            console.log("action")
        };
    }

    function callback(mutationList, observer) {
      mutationList.forEach((mutation) => {
        handleClose()
      });
    }
    
    const observerOptions = {
        childList: true,
        attributes: false,
        subtree: true,
    }
    window.onload = () => {
        const container = document.querySelector(".top-banners-container");
        if(container) {
            const observer = new MutationObserver(callback);
            observer.observe(container, observerOptions);
            handleClose()
            console.log("init")
        }
    }
})();
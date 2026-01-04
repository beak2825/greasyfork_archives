// ==UserScript==
// @name         Bilibili隐藏播放过程中弹出的自动登录(Bilibili Hide Login)
// @namespace    赵怡然(&chatgpt)
// @version      1.0
// @description  Automatically clicks the login button and hides the mini mask on Bilibili video pages with a 1-second delay
// @match        *://www.bilibili.com/video/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468551/Bilibili%E9%9A%90%E8%97%8F%E6%92%AD%E6%94%BE%E8%BF%87%E7%A8%8B%E4%B8%AD%E5%BC%B9%E5%87%BA%E7%9A%84%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%28Bilibili%20Hide%20Login%29.user.js
// @updateURL https://update.greasyfork.org/scripts/468551/Bilibili%E9%9A%90%E8%97%8F%E6%92%AD%E6%94%BE%E8%BF%87%E7%A8%8B%E4%B8%AD%E5%BC%B9%E5%87%BA%E7%9A%84%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%28Bilibili%20Hide%20Login%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Watch for mutations in the document
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Check if the login button is now available
                var loginButton = document.getElementsByClassName("header-login-entry")[0];
                if (loginButton) {
                    // Disconnect the observer
                    observer.disconnect();

                    // Click the login button
                    loginButton.click();

                    // Hide the mini mask with a 1-second delay
                    setTimeout(function() {
                        var miniMask = document.getElementsByClassName("bili-mini-mask")[0];
                        if (miniMask) {
                            miniMask.style.display = "none";
                        }
                    }, 1000); // Delay of 1 second (1000 milliseconds)
                }
            });
        });

        // Start observing the document for mutations
        observer.observe(document, { childList: true, subtree: true });
    });
})();
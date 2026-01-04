// ==UserScript==
// @name         Messenger Dark
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  messenger.com
// @author       You
// @match        https://*.messenger.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=messenger.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478337/Messenger%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/478337/Messenger%20Dark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {

        const elements = document.querySelectorAll("*[class*='__fb-light-mode']");
        for (const element of elements) {
            element.classList.replace("__fb-light-mode", "__fb-dark-mode");
        }

        const observer = new MutationObserver((mutations) => {
            const elements = document.querySelectorAll("*[class*='__fb-light-mode']");
            for (const element of elements) {
                element.classList.replace("__fb-light-mode", "__fb-dark-mode");
            }
        });

        observer.observe(document, {
            attributes: true,
            childList: true,
            subtree: true
        });

    };

    document.addEventListener("async", function() {
        const elements = document.querySelectorAll("*[class*='__fb-light-mode']");
        for (const element of elements) {
            element.classList.replace("__fb-light-mode", "__fb-dark-mode");
        }

    });

    document.ajaxComplete(function() {
        const elements = document.querySelectorAll("*[class*='__fb-light-mode']");
        for (const element of elements) {
            element.classList.replace("__fb-light-mode", "__fb-dark-mode");
        }
    });



})();
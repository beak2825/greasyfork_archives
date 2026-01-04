// ==UserScript==
// @name         Artstation Show Mature Content
// @version      1.1.3
// @description  Show mature-content on Artstation without login.
// @author       Wizzergod
// @match        https://www.artstation.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=artstation.com
// @license      MIT
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM.xmlHttpRequest
// @grant        GM.getResourceUrl
// @grant        GM.openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_openInTab
// @grant        GM_notification
// @run-at       document-idle
// @connect      www.artstation.com
// @connect      artstation.com
// @namespace    Artstation
// @downloadURL https://update.greasyfork.org/scripts/483367/Artstation%20Show%20Mature%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/483367/Artstation%20Show%20Mature%20Content.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Helper function to remove classes from elements
    const removeClassFromElements = (elements, className) => {
        elements.forEach((element) => {
            if (element) {
                element.classList.remove(className);
            }
        });
    };

    // Main function to process and unblur mature content
    const processMatureContent = () => {
        const elementsToRemoveClasses = [
            { className: 'img-blur', elements: document.getElementsByClassName('img-blur') },
            { className: 'mature-content', elements: document.getElementsByClassName('mature-content') },
            { className: 'matureContent', elements: document.getElementsByClassName('matureContent') },
            { className: 'matureContent-blur', elements: document.getElementsByClassName('matureContent-blur') },
            { className: 'has-matureContent', elements: document.getElementsByClassName('has-matureContent') },
            { className: 'matureContent-container', elements: document.getElementsByClassName('matureContent-container') },
        ];

        // Remove unwanted classes
        elementsToRemoveClasses.forEach(({ className, elements }) => {
            removeClassFromElements(Array.from(elements), className);
        });

        // Remove specific elements
        Array.from(document.getElementsByClassName('mature-content-label')).forEach((div) => div?.remove());
    };

    // Add event listeners for processing on load and scroll
    window.addEventListener('load', () => {
        processMatureContent();
        window.addEventListener('scroll', processMatureContent);
    });

    // GM_addStyle
    GM_addStyle(`
        .matureContent-container, .mature-content, .img-blur, .mature-content-label,
        div.mature-content-label, .matureContent, .matureContent-blur, .has-matureContent {
            display: none !important;
        }
    `);
})();


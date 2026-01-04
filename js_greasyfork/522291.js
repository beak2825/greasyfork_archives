// ==UserScript==
// @name         u校园增加时长
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  注意看使用说明
// @author       HenryW
// @match        https://ucontent.unipus.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522291/u%E6%A0%A1%E5%9B%AD%E5%A2%9E%E5%8A%A0%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/522291/u%E6%A0%A1%E5%9B%AD%E5%A2%9E%E5%8A%A0%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const max_lesson_nums = 32;
    let randomClickTimeout = null;
    
    

    // Function to close the popup
    function closePopup() {
        const interval = setInterval(() => {
            try {
                const closeButton = document.querySelector(".dialog-header-pc--close-yD7oN");
                if (closeButton) {
                    closeButton.click();
                    console.log("Popup close button clicked.");
                }

                const dialogButton = document.querySelector("div.dialog-header-pc--dialog-header-2qsXD")?.parentElement?.querySelector("button");
                if (dialogButton) {
                    dialogButton.click();
                    console.log("Dialog button clicked.");
                }

                // Check if popup is closed
                if (!document.querySelector(".dialog-header-pc--close-yD7oN") && 
                    !document.querySelector("div.dialog-header-pc--dialog-header-2qsXD")) {
                    clearInterval(interval);
                    console.log("Popup closed successfully.");
                }
            } catch (error) {
                console.error("Error attempting to close popup:", error);
            }
        }, 500); // Check every 500ms
    }

    // Function to monitor and click .ant-btn-primary
    function monitorPrimaryButton() {
        const interval = setInterval(() => {
            try {
                const primaryButton = document.querySelector(".ant-btn-primary");
                if (primaryButton) {
                    primaryButton.click();
                    console.log("Primary button clicked.");
                    clearInterval(interval);
                }
            } catch (error) {
                console.error("Error attempting to click primary button:", error);
            }
        }, 500); // Check every 500ms
    }

    // Function to randomly click elements
    function randomClick() {
        const elements = Array.from(document.querySelectorAll(".pc-menu-node-name"));
        if (elements.length > max_lesson_nums) {
            const first = elements.slice(0, max_lesson_nums);
            const randomIndex = Math.floor(Math.random() * first.length);
            first[randomIndex].click();
            console.log(`Clicked element at index ${randomIndex}`);
        } else {
            console.warn(`Less than ${max_lesson_nums} elements found.`);
        }
    }

    // Function to start the random click loop
    function startRandomClickLoop() {
        if (randomClickTimeout) {
            clearTimeout(randomClickTimeout);
        }

        const randomInterval = Math.floor(Math.random() * (4 * 60 * 1000 - 1 * 60 * 1000) + 1 * 60 * 1000); // 1-4 minutes in ms
        console.log(`Next click in ${randomInterval / 1000} seconds.`);

        randomClickTimeout = setTimeout(() => {
            randomClick();
            startRandomClickLoop(); // Restart the loop
        }, randomInterval);
    }

    // Observe URL changes
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            console.log("URL changed to", location.href);
            lastUrl = location.href;

            closePopup();
            monitorPrimaryButton();
            startRandomClickLoop();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();

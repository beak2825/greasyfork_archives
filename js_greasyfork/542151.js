// ==UserScript==
// @name         Twitch 廣告封鎖提示自動消除腳本
// @name:en      Twitch Adblock Warning Auto-Remover
// @name:zh-CN   Twitch 广告屏蔽警告自动移除脚本
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自動隱藏 Twitch 上「請關閉廣告封鎖軟體」的提示及其背景疊層，讓您能順暢觀看直播，同時不影響播放控制項。
// @description:zh-CN   自动隐藏 Twitch 上弹出的“请关闭广告屏蔽软件”警告，并尝试保留播放控件。
// @description:en  Automatically hides the "Please disable ad blocker" warning on Twitch, attempting to preserve player controls.
// @match        https://www.twitch.tv/*
// @author       オーウェル緑 using Gemini
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542151/Twitch%20%E5%BB%A3%E5%91%8A%E5%B0%81%E9%8E%96%E6%8F%90%E7%A4%BA%E8%87%AA%E5%8B%95%E6%B6%88%E9%99%A4%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/542151/Twitch%20%E5%BB%A3%E5%91%8A%E5%B0%81%E9%8E%96%E6%8F%90%E7%A4%BA%E8%87%AA%E5%8B%95%E6%B6%88%E9%99%A4%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define CSS selectors for the ad warning elements to be hidden.
    // To avoid accidentally hiding player controls, these selectors are more precise.
    // If the script stops working, please use F12 Developer Tools to inspect and update these selectors.
    const selectorsToHide = [
        // This is the most direct data attribute for adblock warnings, if used, it's the most precise target.
        '[data-a-target="ad-block-warning"]',

        // This is the main content container for the ad warning message, based on the HTML structure you provided.
        // It contains text, buttons, etc.
        '.Layout-sc-1xcs6mc-0.boHJDp',

        // This is the dark background overlay for the ad warning, which usually appears with the ad warning content.
        // Its class names include 'player-overlay-background' and 'darkness-3', which seem specific to this warning's background.
        '.Layout-sc-1xcs6mc-0.bmlSdB.player-overlay-background.player-overlay-background--darkness-3'
    ];

    /**
     * Attempts to hide the specified element.
     * @param {string} selector - The CSS selector of the element to find and hide.
     */
    function hideElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            // Enhance hiding effect: set display, opacity, and visibility simultaneously.
            // Use !important to try and override Twitch's own styles.
            element.style.setProperty('display', 'none', 'important');
            element.style.setProperty('opacity', '0', 'important');
            element.style.setProperty('visibility', 'hidden', 'important');
            console.log(`Twitch Warning: Element '${selector}' hidden (enhanced hiding)`);
            return true; // Indicates element was found and hidden
        }
        return false; // Indicates element was not found
    }

    /**
     * Checks for and hides all defined ad warning elements.
     * Returns true if any elements were found and hidden.
     */
    function checkAndHideWarnings() {
        let hiddenCount = 0;
        for (const selector of selectorsToHide) {
            if (hideElement(selector)) {
                hiddenCount++;
            }
        }
        return hiddenCount > 0;
    }

    // Use MutationObserver to listen for changes in the DOM tree.
    // This is because ad warnings might not be present when the page loads, but are injected dynamically.
    const observer = new MutationObserver((mutationsList, observerInstance) => {
        // Attempt to check and hide warnings every time the DOM changes.
        // We keep it observing continuously to handle warnings that might appear multiple times on Twitch pages.
        checkAndHideWarnings();
    });

    // Configure the observer to watch for changes in child nodes and subtree of the entire document.body.
    // childList: Observe additions or removals of child nodes.
    // subtree: Observe changes in all descendant nodes.
    observer.observe(document.body, { childList: true, subtree: true });

    // Also perform an immediate check when the page loads, in case the warning is present before the observer starts.
    window.addEventListener('load', checkAndHideWarnings);
    // Consider also triggering on DOMContentLoaded for elements that might exist earlier.
    document.addEventListener('DOMContentLoaded', checkAndHideWarnings);

    console.log('Twitch Adblock Warning Auto-Remover script started.');

})();
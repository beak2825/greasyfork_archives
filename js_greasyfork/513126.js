// ==UserScript==
// @name         【自分用】自動スクロール
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically scrolls down the page with a toggle button to turn it on/off.
// @author       You
// @match        http://plus-nao.com/forests/TbPlusnaoproductdirectories*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513126/%E3%80%90%E8%87%AA%E5%88%86%E7%94%A8%E3%80%91%E8%87%AA%E5%8B%95%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/513126/%E3%80%90%E8%87%AA%E5%88%86%E7%94%A8%E3%80%91%E8%87%AA%E5%8B%95%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button to toggle scrolling
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle Scroll';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '1000';
    document.body.appendChild(toggleButton);

    // Scroll speed settings
    const scrollSpeed = 100; // Time in milliseconds
    let isScrolling = false;
    let scrollInterval;

    // Function to start scrolling
    function startScrolling() {
        isScrolling = true;
        scrollInterval = setInterval(() => {
            window.scrollBy(0, 1000); // Scroll down by 1000 pixels
        }, scrollSpeed);
    }

    // Function to stop scrolling
    function stopScrolling() {
        isScrolling = false;
        clearInterval(scrollInterval);
    }

    // Toggle button click event
    toggleButton.addEventListener('click', () => {
        if (isScrolling) {
            stopScrolling();
            toggleButton.textContent = 'Start Scroll';
        } else {
            startScrolling();
            toggleButton.textContent = 'Stop Scroll';
        }
    });

    // Start scrolling by default
    startScrolling();
})();

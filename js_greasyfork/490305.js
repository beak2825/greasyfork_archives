// ==UserScript==
// @name         无图模式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  无图模式一键切换显示或者隐藏模式，方便摸鱼
// @author       Your name
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490305/%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/490305/%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button to toggle visibility
    const toggleButton = document.createElement('button');
    toggleButton.innerText = '隐藏';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '9999';
    document.body.appendChild(toggleButton);

    // Function to hide images and videos
    function hideImagesAndVideos() {
        const elements = document.querySelectorAll('img, video');
        elements.forEach(element => {
            element.style.display = 'none';
        });
        toggleButton.innerText = '显示';
    }

    // Function to show images and videos
    function showImagesAndVideos() {
        const elements = document.querySelectorAll('img, video');
        elements.forEach(element => {
            element.style.display = '';
        });
        toggleButton.innerText = '隐藏';
    }

    // Toggle visibility when button clicked
    let isVisible = true;
    toggleButton.addEventListener('click', function() {
        if (isVisible) {
            hideImagesAndVideos();
            isVisible = false;
        } else {
            showImagesAndVideos();
            isVisible = true;
        }
    });
})();
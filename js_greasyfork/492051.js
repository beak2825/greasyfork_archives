// ==UserScript==
// @name         Twitter SafeView: Auto-Blur with Hover Reveal
// @namespace    http://hhtjim.com/
// @version      1.1.5
// @description  自动打码推特所有图片(包含视频预览)，悬停时才显示完整清晰图像，避免黄图泛滥的尴尬。Automatically blurs all images and displays full clear images only when hovering.
// @author       Hootrix
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/492051/Twitter%20SafeView%3A%20Auto-Blur%20with%20Hover%20Reveal.user.js
// @updateURL https://update.greasyfork.org/scripts/492051/Twitter%20SafeView%3A%20Auto-Blur%20with%20Hover%20Reveal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const debounceDelay = 100; // milliseconds

    // Debounce function to limit the rate of execution
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }


    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', debounce(function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateImageBlur();
    }, debounceDelay));


    document.addEventListener('scroll', debounce(function(e) {
        updateImageBlur();
    }, debounceDelay));


    // Function to check if the mouse is over the element
    function isMouseOverElement(element) {
        const rect = element.getBoundingClientRect();
        return mouseX > rect.left && mouseX < rect.right && mouseY > rect.top && mouseY < rect.bottom;
    }

    // Function to update image blur
    function updateImageBlur() {
        // console.log('updateImageBlur')
        //列表
        document.querySelectorAll('article[data-testid="tweet"]').forEach(function(tweetDiv) {
            // Apply or remove blur based on mouse position
            if (isMouseOverElement(tweetDiv)) {
                closeBlur(tweetDiv)
            } else {
                applyBlur(tweetDiv)
            }
            
        });
    }

    // Apply blur to the div and nested img
    const applyBlur = (document) => {
        // 推文
        document.querySelectorAll('div[data-testid="tweetPhoto"], div[data-testid="card.layoutLarge.media"]').forEach(function(div) {
            div.style.filter = 'blur(8px)';
            const img = div.querySelector('img');
            if (img) img.style.filter = 'blur(8px)';
        });
    };
    const closeBlur = (document) => {
        document.querySelectorAll('div[data-testid="tweetPhoto"], div[data-testid="card.layoutLarge.media"]').forEach(function(div) {
            div.style.filter = '';
            const img = div.querySelector('img');
            if (img) img.style.filter = '';
        });
    };

    // Observe for changes in the document
    const observer = new MutationObserver(debounce(function() {
            updateImageBlur();
        },debounceDelay));


    // Configuration of the observer
    const config = { childList: true, subtree: true };

    // var target = document.querySelector('section[aria-labelledby="accessible-list-1"]')
    var target = document.body

    // Start observing the target node for configured mutations
    if(target){
        observer.observe(target, config);
    }

    // Initial application of blur to images
    updateImageBlur();
})();

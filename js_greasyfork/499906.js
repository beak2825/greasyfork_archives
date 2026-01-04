// ==UserScript==
// @name         百度云盘网页保存框尺寸优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  调整网页保存框元素尺寸的大小
// @match        https://pan.baidu.com/s/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499906/%E7%99%BE%E5%BA%A6%E4%BA%91%E7%9B%98%E7%BD%91%E9%A1%B5%E4%BF%9D%E5%AD%98%E6%A1%86%E5%B0%BA%E5%AF%B8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/499906/%E7%99%BE%E5%BA%A6%E4%BA%91%E7%9B%98%E7%BD%91%E9%A1%B5%E4%BF%9D%E5%AD%98%E6%A1%86%E5%B0%BA%E5%AF%B8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to adjust the size of the specific element, its tree structure, and center the dialog
    function adjustElementAndTreeSizeAndCenter() {
        const dialogElement = document.querySelector('.dialog-fileTreeDialog');
        const treeContainer = document.querySelector('.file-tree-container');

        if (dialogElement) {
            const newWidth = 800;
            const newHeight = 800;

            dialogElement.style.width = newWidth + 'px';  // Set the desired width
            dialogElement.style.height = newHeight + 'px'; // Set the desired height
            dialogElement.style.position = 'fixed'; // Use fixed positioning to enable centering

            // Calculate the top and left values to center the dialog
            const left = (window.innerWidth - newWidth) / 2;
            const top = (window.innerHeight - newHeight) / 2;
            dialogElement.style.left = left + 'px';
            dialogElement.style.top = top + 'px';

            console.log('Dialog element size adjusted and centered');
        } else {
            console.log('Dialog element not found');
        }

        if (treeContainer) {
            treeContainer.style.height = '650px';  // Adjust the tree container height
            treeContainer.style.overflowY = 'auto'; // Ensure it can scroll if content overflows
            console.log('Tree container size adjusted');
        } else {
            console.log('Tree container not found');
        }
    }

    // Adjust the element size and center it when the page is fully loaded
    window.addEventListener('load', adjustElementAndTreeSizeAndCenter);

    // Adjust the element size and center it when the window is resized
    window.addEventListener('resize', adjustElementAndTreeSizeAndCenter);

    // Optionally, you can adjust the size again when the user interacts with the page
    document.addEventListener('click', adjustElementAndTreeSizeAndCenter);
})();

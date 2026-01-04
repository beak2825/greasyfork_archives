// ==UserScript==
// @name         自动展开知识星球帖子+替换图片为原图显示
// @namespace    https://axutongxue.com/
// @version      0.1
// @license      MIT
// @description  知识星球：阿虚的问答社区
// @author       阿虚同学
// @match        https://wx.zsxq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487795/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E5%B8%96%E5%AD%90%2B%E6%9B%BF%E6%8D%A2%E5%9B%BE%E7%89%87%E4%B8%BA%E5%8E%9F%E5%9B%BE%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/487795/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E5%B8%96%E5%AD%90%2B%E6%9B%BF%E6%8D%A2%E5%9B%BE%E7%89%87%E4%B8%BA%E5%8E%9F%E5%9B%BE%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to simulate a mouse click event
    function simulateClick(element) {
        var evt = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(evt);
    }

    // Function to click all elements with the 'showAll' class
    function clickAllShowAll() {
        var elements = document.querySelectorAll('p.showAll');
        elements.forEach(function(el) {
            simulateClick(el);
        });
    }

    // Run the click function when the page loads
    window.addEventListener('load', function() {
        // Wait a bit for elements to load (adjust the timeout as necessary)
        setTimeout(clickAllShowAll, 2000); // Waits for 2 seconds
    });

      // Function to replace the src attribute of images with the href of the corresponding original image links
    function replaceImageSrc() {
        // Select all the containers
        var containers = document.querySelectorAll('.image-container');
        containers.forEach(function(container) {
            // For each container, find the image and the link
            var image = container.querySelector('img.image');
            var link = container.querySelector('a.original-image');
            // If both the image and the link exist, replace the image's src with the link's href
            if (image && link && link.href) {
                image.src = link.href;
            }
        });
    }

    // Run the replace function when the page loads
    window.addEventListener('load', replaceImageSrc);

    // If the content is dynamically loaded, you might need to run the function after a certain interval
    setInterval(replaceImageSrc, 5000); // Runs every 5 seconds
})();

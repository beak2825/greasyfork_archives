// ==UserScript==
// @name         Jira Image Linker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a hyperlink to image tags in Jira comments
// @author       Zetaphor
// @match        https://jira.ipgaxis.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484466/Jira%20Image%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/484466/Jira%20Image%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let interval = null;

    function wrapImagesInLinks() {
        const imageWraps = document.querySelectorAll('.image-wrap');

        imageWraps.forEach(imageWrap => {
            const imageTag = imageWrap.querySelector('img');

            if (imageTag) {
                const imageSource = imageTag.getAttribute('src');
                const imageLink = document.createElement('a');
                imageLink.href = imageSource;
                imageLink.target = '_blank';

                imageWrap.replaceChild(imageLink, imageTag);
                imageLink.appendChild(imageTag);
            }
        });
    }

    function observeDOM() {
        const targetNode = document.querySelector('.activity-comment');

        if (targetNode) {
            clearInterval(interval);
            wrapImagesInLinks();
        } else {
            setTimeout(observeDOM, 1000);
        }
    }

    interval = setInterval(observeDOM, 1000);
})();

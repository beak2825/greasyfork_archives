// ==UserScript==
// @name         lonely bilibili
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove some contents
// @author       You
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472779/lonely%20bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/472779/lonely%20bilibili.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.style.backgroundColor = 'white';

        // Configuration: Add the CSS selectors for the elements you want to prevent
    const selectorsToPrevent = ['#comment', '#danmukuBox'];

    // Function to remove the specified element
    const removeElement = (element) => {
        if (element) {
            element.remove();
        }
    };

    let elementsToDelete = ['#comment', '#v_tag', '#danmukuBox', '#reco_list', '.ad-report.video-card-ad-small', '.ad-report',
                            '#right-bottom-banner', '#activity_vote', '.pop-live-small-mode', '.bpx-player-sending-area'];

    // Function to observe DOM mutations
    const removeCommentElement = () => {

        elementsToDelete.forEach(function(elementId) {
        var element = document.querySelector(elementId);
            if (element) {
                element.remove();
            }
        });
    };

    function modifyElementStyleWithDelay() {
        setTimeout(function() {
            var element = document.querySelector('.video-sections-content-list');
            if (element) {
                element.style.height = 'auto';
                element.style.maxHeight = 'none';
            }
            let element2 = document.querySelector('#viewbox_report');
            if (element2) {
                element2.style.height = 'auto';
            }
        }, 2000); // Delay in milliseconds (3 seconds)
    }


    // Run the function to remove the comment element
    setTimeout(removeCommentElement, 1500);
    setTimeout(removeCommentElement, 3000);
    // setTimeout(removeCommentElement, 5000);
    modifyElementStyleWithDelay();

})();
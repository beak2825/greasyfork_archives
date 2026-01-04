// ==UserScript==
// @name         Skip Copyright in ZJU Classroom
// @namespace    http://tampermonkey.net/
// @version      2024-04-06
// @description  this script speed up the video loading by skipping Copyright video in ZJU Classroom
// @author       You
// @match        https://classroom.zju.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491759/Skip%20Copyright%20in%20ZJU%20Classroom.user.js
// @updateURL https://update.greasyfork.org/scripts/491759/Skip%20Copyright%20in%20ZJU%20Classroom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to dispatch an 'ended' event
    function dispatchEndedEvent(target) {
        // Create and dispatch the 'ended' event
        Promise.resolve().then(() => {
            const event = new Event('ended');
            target.dispatchEvent(event);
            //console.log('Ended event dispatched on #copy-right-video');
        });
    }

    // MutationObserver callback function
    function observerCallback(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    // Check if the added node is the target element or contains the target element
                    if (node.id === 'copy-right-video') {
                        dispatchEndedEvent(node);
                        observer.disconnect(); // Stop observing after the event is dispatched
                    } else if (node.querySelector) {
                        const targetElement = node.querySelector('#copy-right-video');
                        if (targetElement) {
                            dispatchEndedEvent(targetElement);
                            observer.disconnect(); // Stop observing after the event is dispatched
                        }
                    }
                });
            }
        }
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(observerCallback);

    // Start observing the document body for added nodes
    observer.observe(document.getElementById("app"), { childList: true, subtree: true });

})();

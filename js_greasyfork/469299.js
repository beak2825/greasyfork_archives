// ==UserScript==
// @name         开放大学视频快过
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将视频播放速度加快16倍，并解除网页失焦后视频暂停的限制
// @author       luxi78
// @match        https://lms.ouchn.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469299/%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/469299/%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set video playback speed
    function setVideoSpeed() {
        const videos = document.getElementsByTagName('video');
        for(let i = 0; i < videos.length; i++) {
            videos[i].playbackRate = 16;
        }
    }

    // Function to remove all onblur events
    function removeOnBlur() {
        const allElements = document.getElementsByTagName('*');
        for(let i = 0; i < allElements.length; i++) {
            allElements[i].onblur = null;
        }
    }

    // Overwrite addEventListener to prevent adding new blur event listeners
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(eventName, eventHandler) {
        if (eventName !== 'blur') {
            originalAddEventListener.call(this, eventName, eventHandler);
        }
    };

    // Run the functions
    setVideoSpeed();
    removeOnBlur();

    // Run the functions every 5 seconds to handle dynamically loaded content
    setInterval(function() {
        setVideoSpeed();
        removeOnBlur();
    }, 1000);
})();

// ==UserScript==
// @name         jable.tv视频播放控制
// @name:en      Jable TV Video Player Controller
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  为 Android Pad 上的 Jable TV 添加视频控件和手势支持
// @description:en Add video controls and gesture support to Jable TV on Android Pad
// @author       Adam
// @match        https://jable.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538653/jabletv%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/538653/jabletv%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add custom controls
    function addCustomControls(videoElement) {
        const controlDiv = document.createElement('div');
        controlDiv.style.position = 'absolute';
        controlDiv.style.bottom = '10px';
        controlDiv.style.left = '50%';
        controlDiv.style.transform = 'translateX(-50%)';
        controlDiv.style.width = '20%';
        controlDiv.style.height = '50px';
        controlDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        controlDiv.style.display = 'flex';
        controlDiv.style.justifyContent = 'space-between';
        controlDiv.style.alignItems = 'center';
        controlDiv.style.zIndex = '1000';
        controlDiv.style.touchAction = 'none'; // Prevent default touch actions

        // Left button: Rewind 5 seconds
        const rewindButton = document.createElement('button');
        rewindButton.textContent = '<<';
        rewindButton.style.backgroundColor = 'transparent';
        rewindButton.style.color = 'white';
        rewindButton.style.border = 'none';
        rewindButton.style.fontSize = '20px';
        rewindButton.addEventListener('click', () => {
            videoElement.currentTime -= 5;
        });

        // Center button: Play/Pause
        const playPauseButton = document.createElement('button');
        playPauseButton.textContent = '⏯️';
        playPauseButton.style.backgroundColor = 'transparent';
        playPauseButton.style.color = 'white';
        playPauseButton.style.border = 'none';
        playPauseButton.style.fontSize = '24px';
        playPauseButton.addEventListener('click', () => {
            if (videoElement.paused) {
                videoElement.play();
            } else {
                videoElement.pause();
            }
        });

        // Right button: Forward 5 seconds
        const forwardButton = document.createElement('button');
        forwardButton.textContent = '>>';
        forwardButton.style.backgroundColor = 'transparent';
        forwardButton.style.color = 'white';
        forwardButton.style.border = 'none';
        forwardButton.style.fontSize = '20px';
        forwardButton.addEventListener('click', () => {
            videoElement.currentTime += 5;
        });

        controlDiv.appendChild(rewindButton);
        controlDiv.appendChild(playPauseButton);
        controlDiv.appendChild(forwardButton);

        document.body.appendChild(controlDiv);

        return controlDiv;
    }

    // Function to handle touch gestures for fast forward and rewind
    function setupGestureControl(videoElement, controlDiv) {
        let startX, startY;

        controlDiv.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        }, { passive: true });

        controlDiv.addEventListener('touchend', (event) => {
            const endX = event.changedTouches[0].clientX;
            const endY = event.changedTouches[0].clientY;

            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Check if the swipe was mostly horizontal
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 50) { // Swipe right to fast forward
                    videoElement.currentTime += 5;
                } else if (deltaX < -50) { // Swipe left to rewind
                    videoElement.currentTime -= 5;
                }
            }
        }, { passive: true });
    }

    // Make the control bar draggable
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Wait for the video element to load
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const videoElement = document.querySelector('video');
                if (videoElement) {
                    observer.disconnect();

                    const controlDiv = addCustomControls(videoElement);
                    setupGestureControl(videoElement, controlDiv);
                    makeDraggable(controlDiv);
                    videoElement.preload = 'auto';

                    break;
                }
            }
        }
    });
    
    function updateTitleStyles() {
        // 获取所有带有 .video-img-box .title 类的元素
        let titles = document.querySelectorAll('.video-img-box .title');
 
        titles.forEach(function(title) {
            title.style.whiteSpace = 'normal';
        });
    }

    observer.observe(document.body, { childList: true, subtree: true });
 
    // 初始执行一次，以处理页面加载时的元素
    updateTitleStyles();
})();

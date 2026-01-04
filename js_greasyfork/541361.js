// ==UserScript==
// @name         Video Player Control Tool 视频播放控制工具 - 改
// @namespace    http://tampermonkey.net/
// @version      2.2kai
// @description  视频播放全屏锁屏防误触，同时提供视频控制（快进，暂停，后退）
// @author       Hui Fei 会飞 / Sndream
// @match        *://*.bilibili.com/*
// @exclude-match *://manga.bilibili.com/*
// @match        *://*.youku.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.iq.com/*
// @match        *://v.qq.com/*
// @match        *://*.tudou.com/*
// @match        *://*.youtube.com/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/541361/Video%20Player%20Control%20Tool%20%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E6%8E%A7%E5%88%B6%E5%B7%A5%E5%85%B7%20-%20%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/541361/Video%20Player%20Control%20Tool%20%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E6%8E%A7%E5%88%B6%E5%B7%A5%E5%85%B7%20-%20%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // // Bilibili AVI switch
    // const switchToAV1 = () => {
    //     const radioInputs = document.querySelectorAll('input[type="radio"][name="bui-radio3"]');
    //     for (const radioInput of radioInputs) {
    //         if (radioInput.value === '3') {
    //             radioInput.click();
    //             break;
    //         }
    //     }
    // };
    // const observer = new MutationObserver(switchToAV1);
    // observer.observe(document.body, { childList: true, subtree: true });

    const lockButtonHideDelay = 3000; // 3 seconds delay for button hide
    let hideButtonTimeout;
    let isLocked = false;
    let fullscreenElement = null;
    let video = null;

    // Create the key-shaped lock element
    const lockButton = createButton('🔓︎', 0);
    lockButton.id = 'lockButton';
    lockButton.style.right = '180px';
    lockButton.style.cursor = 'pointer';
    lockButton.style.zIndex = '99999';
    lockButton.style.display = 'none'; // Initially hidden
    setLockButtonIcon(0);
    document.body.appendChild(lockButton);

    // Create control buttons
    const fastForwardButton = createButton('⏩︎', 39); // Right Arrow key
    fastForwardButton.style.right = '240px';
    fastForwardButton.style.display = 'none'; // Initially hidden
    document.body.appendChild(fastForwardButton);

    const playPauseButton = createButton('⏯︎', 32); // Space key
    playPauseButton.style.right = '300px';
    playPauseButton.style.display = 'none'; // Initially hidden
    document.body.appendChild(playPauseButton);

    const rewindButton = createButton('⏪︎', 37); // Left Arrow key
    rewindButton.style.right = '360px';
    rewindButton.style.display = 'none'; // Initially hidden
    document.body.appendChild(rewindButton);

    function triggerKeyEvent(element, keyCode, eventType) {
        const event = new KeyboardEvent(eventType, {
            bubbles: true,
            cancelable: true,
            keyCode: keyCode
        });
        element.dispatchEvent(event);
    }

    function createButton(label, keyCode) {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.position = 'fixed';
        button.style.zIndex = 9999;
        button.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        button.style.color = 'rgba(255, 255, 255, 0.7)';
        button.style.border = '0px';
        button.style.padding = '0px';
        button.style.borderRadius = '0px';
        button.style.width = '60px';
        button.style.height = '36px';
        button.style.top = '4px';
        button.style.fontSize = '30px';
        button.style.fontFamily = 'monospace';
        if (keyCode > 0) {
            button.addEventListener('mousedown', () => triggerKeyEvent(video, keyCode, 'keydown'));
            button.addEventListener('mouseup', () => triggerKeyEvent(video, keyCode, 'keyup'));
            // for touchscreen device
            button.addEventListener('touchstart', (event) => {
                event.preventDefault();
                triggerKeyEvent(video, keyCode, 'keydown');
            });

            button.addEventListener('touchend', (event) => {
                event.preventDefault();
                triggerKeyEvent(video, keyCode, 'keyup');
            });
        }
        return button;
    }

    // Lock Screen Button Click Event
    lockButton.addEventListener('click', function(event) {
        if (isLocked) {
            isLocked = false;
            setLockButtonIcon(0);
            document.body.style.pointerEvents = 'auto'; // Enable click events for the page.
            fastForwardButton.style.pointerEvents = 'auto';
            playPauseButton.style.pointerEvents = 'auto';
            rewindButton.style.pointerEvents = 'auto';
            hidePlayButton()
        } else {
            isLocked = true;
            setLockButtonIcon(1);
            document.body.style.pointerEvents = 'none'; // Disable click events for the entire page.
            lockButton.style.pointerEvents = 'auto'; // Enable click events for the key.
            fastForwardButton.style.pointerEvents = 'auto';
            playPauseButton.style.pointerEvents = 'auto';
            rewindButton.style.pointerEvents = 'auto';
            showPlayButton()
        }
    });

    function setLockButtonIcon(locked) {
        if (locked == 0) {
            lockButton.style.color = 'gray'; // Unlocked state.
            lockButton.textContent = '🔓︎';
        } else {
            lockButton.style.color = 'rgba(255, 255, 255, 0.7)'; // Locked State
            lockButton.textContent = '🔒︎';
        }
    }

    function hidePlayButton() {
        fastForwardButton.style.display = 'none';
        playPauseButton.style.display = 'none';
        rewindButton.style.display = 'none';
    }
    function hideLockButton() {
        lockButton.style.display = 'none';
    }
    function hideAllButton() {
        hideLockButton();
        hidePlayButton();
    }


    function showPlayButton() {
        fastForwardButton.style.display = 'block';
        playPauseButton.style.display = 'block';
        rewindButton.style.display = 'block';
    }

    function showLockButton() {
        lockButton.style.display = 'block';
    }
    function showAllButton() {
        showLockButton();
        showPlayButton();
    }

    function resetHideButtonTimer() {
        clearTimeout(hideButtonTimeout);
        hideButtonTimeout = setTimeout(hideAllButton, lockButtonHideDelay);
    }

    // Fullscreen change event
    document.addEventListener('fullscreenchange', function(event) {
        fullscreenElement = document.fullscreenElement;
        video = document.querySelector('video');
        if (fullscreenElement) {
            fullscreenElement.appendChild(lockButton);
            fullscreenElement.appendChild(fastForwardButton);
            fullscreenElement.appendChild(playPauseButton);
            fullscreenElement.appendChild(rewindButton);
            showLockButton();
            resetHideButtonTimer();
        } else {
            document.body.appendChild(lockButton);
            document.body.appendChild(fastForwardButton);
            document.body.appendChild(playPauseButton);
            document.body.appendChild(rewindButton);
            hideAllButton();
            clearTimeout(hideButtonTimeout);

            if (isLocked) {
                isLocked = false;
                setLockButtonIcon(0);
                document.body.style.pointerEvents = 'auto';
            }
        }
    });

    // Mouse move event
    document.addEventListener('mousemove', function() {
        if (fullscreenElement) {
            if (isLocked) {
                showAllButton();
            } else {
                showLockButton();
            }
            resetHideButtonTimer();
        }
    });

    // Touch start event (for touchscreen devices)
    document.addEventListener('touchstart', function() {
        if (fullscreenElement) {
            if (isLocked) {
                showAllButton();
            } else {
                showLockButton();
            }
            resetHideButtonTimer();
        }
    });

    // Block Context Menu (Right click)
    document.addEventListener('contextmenu', function(e) {
        if (fullscreenElement) {
            if (isLocked) {
                e.preventDefault();
                return false;
            }
        }
    });
})();

// ==UserScript==
// @name:zh-tw      OMG遊戲速度控制器
// @name            OMG Game Speed Controller
// @namespace       com.sherryyue.omggamespeedcontroller
// @version         0.12
// @description:zh-tw   調整嵌入網頁的遊戲速度，提供一個滑動條、重置按鈕和暫停按鈕，並更新 window.forceSpeed
// @description         Adjust game speed with a slider, reset button, and pause button, update window.forceSpeed
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @include         *://*:7456/*
// @match           *://*.ssgaka.com/*
// @include         *://7sz*.com/*
// @include         *://*.7sz*.com/*
// @exclude         *://*/history/*
// @exclude         *://*/history2/*
// @exclude         *://*/review/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/507004/OMG%20Game%20Speed%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/507004/OMG%20Game%20Speed%20Controller.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // Existing UI container setup
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50px';
    container.style.right = '-220px';
    container.style.width = '200px';
    container.style.height = 'auto';
    container.style.background = 'rgba(255, 255, 255, 0.9)';
    container.style.padding = '10px';
    container.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
    container.style.zIndex = '10000';
    container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    container.style.transition = 'right 0.3s ease';
    container.style.cursor = 'pointer';
    container.style.boxSizing = 'content-box';
    // Toggle button setup
    const toggleButton = document.createElement('div');
    toggleButton.style.position = 'absolute';
    toggleButton.style.top = '0';
    toggleButton.style.left = '-20px';
    toggleButton.style.width = '20px';
    toggleButton.style.height = '100%';
    toggleButton.style.background = '#007AFF';
    toggleButton.style.borderRadius = '12px 0 0 12px';
    toggleButton.style.display = 'flex';
    toggleButton.style.alignItems = 'center';
    toggleButton.style.justifyContent = 'center';
    toggleButton.style.color = '#fff';
    toggleButton.textContent = '◀';
    toggleButton.style.fontSize = '16px';
    toggleButton.style.cursor = 'pointer';
    container.appendChild(toggleButton);
    // Label and speed display setup
    const labelContainer = document.createElement('div');
    labelContainer.style.display = 'flex';
    labelContainer.style.justifyContent = 'space-between';
    labelContainer.style.alignItems = 'center';
    labelContainer.style.marginBottom = '5px';
    const label = document.createElement('span');
    label.textContent = 'Game Speed:';
    label.style.fontWeight = 'bold';
    const speedDisplay = document.createElement('span');
    speedDisplay.textContent = '1x';
    speedDisplay.style.marginLeft = '10px';
    speedDisplay.style.fontSize = '14px';
    labelContainer.appendChild(label);
    labelContainer.appendChild(speedDisplay);
    // Speed slider setup
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0.2';
    slider.max = '20';
    slider.step = 'any';
    slider.style.width = '100%';
    slider.value = '7.176';
    function toLogScale(value) {
        return Math.pow(10, (value - 0.2) / 20 * (Math.log10(20) - Math.log10(0.2)) + Math.log10(0.2));
    }
    function formatSpeedDisplay(speed) {
        return speed >= 1 ? speed.toFixed(0) + 'x' : '' + (+speed.toFixed(1)) + 'x';
    }
    // Speed adjustment function
    function adjustGameSpeed(speed) {
        // @ts-ignore
        window.forceSpeed = speed;
        speedDisplay.textContent = formatSpeedDisplay(speed);
    }
    slider.addEventListener('input', function () {
        const logValue = toLogScale(parseFloat(slider.value));
        adjustGameSpeed(logValue);
    });
    // Create a container for the buttons (flex layout)
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.marginTop = '10px';
    // Reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset to 1x';
    resetButton.style.backgroundColor = '#007AFF';
    resetButton.style.color = '#fff';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '8px';
    resetButton.style.padding = '5px 10px';
    resetButton.style.cursor = 'pointer';
    resetButton.style.fontSize = '14px';
    resetButton.style.flexGrow = '2'; // Larger width for longer text
    resetButton.style.marginRight = '5px'; // Adds a small gap between buttons
    resetButton.addEventListener('click', function () {
        slider.value = '7.176';
        adjustGameSpeed(1);
    });
    // Pause button
    const pauseButton = document.createElement('button');
    pauseButton.textContent = 'Pause';
    pauseButton.style.backgroundColor = '#FF4500';
    pauseButton.style.color = '#fff';
    pauseButton.style.border = 'none';
    pauseButton.style.borderRadius = '8px';
    pauseButton.style.padding = '5px 10px';
    pauseButton.style.cursor = 'pointer';
    pauseButton.style.fontSize = '14px';
    pauseButton.style.flexGrow = '1'; // Smaller width for shorter text
    pauseButton.addEventListener('click', function () {
        adjustGameSpeed(0);
    });
    // Append buttons to the button container
    buttonContainer.appendChild(resetButton);
    buttonContainer.appendChild(pauseButton);
    // Append elements to the container
    container.appendChild(labelContainer);
    container.appendChild(slider);
    container.appendChild(buttonContainer);
    document.body.appendChild(container);
    // Toggle button for collapsing/expanding
    toggleButton.addEventListener('click', function () {
        if (container.style.right === '0px') {
            container.style.right = '-220px';
            toggleButton.textContent = '◀';
        }
        else {
            container.style.right = '0px';
            toggleButton.textContent = '▶';
        }
    });
    // Draggable logic for vertical movement only
    let isDragging = false;
    let offsetY = 0;
    toggleButton.addEventListener('mousedown', function (event) {
        isDragging = true;
        offsetY = event.clientY - container.getBoundingClientRect().top;
        document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', function (event) {
        if (isDragging) {
            let newTop = event.clientY - offsetY;
            if (newTop < 0)
                newTop = 0;
            if (newTop + container.offsetHeight > window.innerHeight) {
                newTop = window.innerHeight - container.offsetHeight;
            }
            container.style.top = `${newTop}px`;
        }
    });
    document.addEventListener('mouseup', function () {
        isDragging = false;
        document.body.style.userSelect = '';
    });
})();

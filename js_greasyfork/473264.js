// ==UserScript==
// @name         Video Speed Controller for phone
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Add a video speed controller to webpages with videos.
// @author       Cool
// @match        *://*/*
// @grant        GM_addStyle
// @license MIT
//
// @downloadURL https://update.greasyfork.org/scripts/473264/Video%20Speed%20Controller%20for%20phone.user.js
// @updateURL https://update.greasyfork.org/scripts/473264/Video%20Speed%20Controller%20for%20phone.meta.js
// ==/UserScript==


(function () {
    'use strict';
    // Add a button to control video speed
    const speedButton = document.createElement('div');
    speedButton.id = 'videoSpeedButton';
    speedButton.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        background: rgba(0, 0, 0, 0.3);
        color: white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 99999;
        font-size: 12px;
    `;
    const speedBTN_text = document.createElement('span');
    speedBTN_text.id = 'videoSpeedButton_text';
    speedBTN_text.textContent = "1.0x";
    speedButton.appendChild(speedBTN_text);

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    speedButton.addEventListener('mousedown', handleDragStart);
    speedButton.addEventListener('touchstart', handleDragStart);

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove, {
        passive: false
    });

    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);

    function handleDragStart(e) {
        e.preventDefault();
        isDragging = true;
        const {
            clientX,
            clientY
        } = e.touches ? e.touches[0] : e;
        const rect = speedButton.getBoundingClientRect();
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
    }

    function handleDragMove(e) {
        if (isDragging) {
            e.preventDefault();
            const {
                clientX,
                clientY
            } = e.touches ? e.touches[0] : e;
            const x = clientX - offsetX;
            const y = clientY - offsetY;
            speedButton.style.left = `${x}px`;
            speedButton.style.top = `${y}px`;
        }
    }

    function handleDragEnd() {
        isDragging = false;
    }

    // Define video playback speeds
    const playbackSpeeds = [1.0, 1.25, 1.5, 2.0, 2.5, 3.0, 4.0, 'Close'];

    let speedList = document.createElement('ul');
    speedList.style.cssText = `
        position: absolute;
        display: none;
        top: 0;
        left: 0;
        width: 45px;
        list-style: none;
        background: rgba(0, 0, 0, 0.8);
        padding: 2px;
        border-radius: 3px;
        text-align: center;
    `;

    playbackSpeeds.forEach(speed => {
        const listItem = document.createElement('li');
        listItem.style.padding = '5px';
        listItem.style.cursor = 'pointer';
        listItem.textContent = speed === 'Close' ? 'Close' : speed.toFixed(2) + 'x';

        const listItem_chosen = ()=>{
          if (speed === 'Close') {
                  speedButton.style.display = "none"
              } else {
                  document.querySelectorAll('video').forEach(video => {
                      video.playbackRate = speed;
                  });
                  speedBTN_text.textContent = speed.toFixed(2) + 'x';
              }
              speedList.style.display = "none"
        }

        listItem.addEventListener('click', listItem_chosen);
        listItem.addEventListener('touchstart', listItem_chosen);

        speedList.appendChild(listItem);
    });

    speedButton.appendChild(speedList);
    const display_menus = (e) => {
        if (!speedList.contains(e.target) && speedList.style.display === "none")
            speedList.style.display = "block"
      }
    speedButton.addEventListener('click', display_menus);
    speedButton.addEventListener('touchstart', display_menus);

    document.body.appendChild(speedButton);
})();

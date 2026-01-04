// ==UserScript==
// @name                Bilibili 自动宽屏
// @name:zh-CN          Bilibili 自动宽屏
// @name:zh-TW          Bilibili 自動寬螢幕
// @name:en             Bilibili Auto Wide Screen
// @namespace           https://github.com/Zomby7e/public-stuff/blob/master/user-script/bilibili-auto-wide-screen.user.js
// @version             1.2.0
// @description         Bilibili Auto Wide Screen / Bilibili 播放页面自动宽屏
// @description:zh-cn   添加一个新的「自动宽屏」按钮在 Bilibili 播放页面
// @description:zh-tw   添加一個新的「自动宽屏」按鈕在 Bilibili 播放頁面
// @description:en      Add an "Auto Wide Screen" to bilibili
// @match               https://www.bilibili.com/video/*
// @author              Zomby7e
// @icon                data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant               GM_setValue
// @grant               GM_getValue
// @license             WTFPL
// @downloadURL https://update.greasyfork.org/scripts/502334/Bilibili%20%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/502334/Bilibili%20%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

/*
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                     Version 2, December 2004
 *
 *  Copyright (C) 2024 Zomby7e <zomby7e@gmail.com>
 *  Everyone is permitted to copy and distribute verbatim or modified
 *  copies of this license document, and changing it is allowed as long
 *  as the name is changed.
 *
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *    TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 *
 */

// ---- Browser storage varribles ----
// isAutoWideScreen  -- Defined if video page will be auto set to wide screen

// ---- Global varribles in this script ----
let playerControlContainer = null;                        // Element, it contains the "auto wide screen mode" button
let isAutoWideScreen = true;                              // Boolean, if not set, it will be true by default
let autoWideScreenButton = document.createElement('div'); // It will be added in `playerControlContainer`, starts with "自动宽屏"

// Entry, start here
(function() {
    'use strict';
    getLocalValues();
    initElements();
    isAutoWideScreen && checkWideScreenButtonElement();
    checkPlayerControllerElement();
    customShortcutKeys();
})();

// get storaged local values
function getLocalValues() {
    isAutoWideScreen = GM_getValue('isAutoWideScreen', true);
}

// Initialize all elements that needs to be inserted into the DOM
function initElements(){
    let textContent = "自动宽屏: ";
    textContent += isAutoWideScreen ? '开': '关';
    autoWideScreenButton.textContent = textContent;
    autoWideScreenButton.style.color = 'hsla(0, 0%, 100%, .8)';
    autoWideScreenButton.style.fontFamily = '-apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif';
    autoWideScreenButton.style.marginRight = '2em';
    autoWideScreenButton.style.fontSize = '14px';
    autoWideScreenButton.style.fontWeight = 'bold';
    autoWideScreenButton.style.cursor = 'pointer';
    autoWideScreenButton.style.userSelect = 'none';
    autoWideScreenButton.style.webkitUserSelect = 'none'; // For WebKit browsers
    autoWideScreenButton.style.mozUserSelect = 'none';    // For Mozilla browsers
    autoWideScreenButton.style.msUserSelect = 'none';
    autoWideScreenButton.onclick = function() {
        isAutoWideScreen = !isAutoWideScreen;
        const newTextContent = isAutoWideScreen? "自动宽屏: 开": "自动宽屏: 关";
        autoWideScreenButton.textContent = newTextContent;
        GM_setValue('isAutoWideScreen', isAutoWideScreen);
    };
}

// Get wide screen button element
function checkWideScreenButtonElement() {
    const element = document.querySelector("div.bpx-player-ctrl-btn-icon.bpx-player-ctrl-wide-enter > span")
    if (element) {
        ChangeWideScreenMode()
    } else {
        setTimeout(checkWideScreenButtonElement, 50)
    }
}

function ChangeWideScreenMode() {
    document.querySelector("div.bpx-player-ctrl-btn-icon.bpx-player-ctrl-wide-enter > span").click()
}

function checkPlayerControllerElement() {
    const element = document.querySelector('.bpx-player-control-bottom-right')
    if (element) {
        playerControlContainer = document.querySelector('.bpx-player-control-bottom-right');
        addAutoWideScreenButton(playerControlContainer);
    } else {
        setTimeout(checkWideScreenButtonElement, 50)
    }
}

// Add auto theater button
function addAutoWideScreenButton(targetElement) {
    if (targetElement) {
      // Insert the new div as the first child of the target element
      targetElement.insertBefore(autoWideScreenButton, targetElement.firstChild);
  } else {
      console.log('Player control container not found');
  }
}

// Enable custom shortcut keys
function customShortcutKeys() {
    // Press "T" to change wide screen mode like youtube theater mode
    document.addEventListener('keydown', function(event) {
        // Check if the key pressed is 'T' or 't'
        if (event.key === 'T' || event.key === 't') {
            ChangeWideScreenMode();
        }
    });
}

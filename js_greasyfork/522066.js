// ==UserScript==
// @name         点击静音
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  点击静音、网页静音、视频静音
// @author       你
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522066/%E7%82%B9%E5%87%BB%E9%9D%99%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/522066/%E7%82%B9%E5%87%BB%E9%9D%99%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function generateUniqueId() {
        return 'mute-button-' + Math.random().toString(36).substr(2, 9);
    }

    if (document.getElementById('mute-button-container')) {
        return; // 页面上已经有按钮，直接退出
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'mute-button-container';
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '10px';
    buttonContainer.style.right = '10px';
    buttonContainer.style.zIndex = '9999';

    const button = document.createElement('button');
    button.id = generateUniqueId(); 
    button.innerText = '点击静音';
    button.style.backgroundColor = '#ff5733';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '20px';
    button.style.padding = '10px 20px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    buttonContainer.appendChild(button);

    document.body.appendChild(buttonContainer);

    let isMuted = false;

    // 静音功能
    function mutePage() {
        isMuted = true;
        button.innerText = '点击恢复';
        document.querySelectorAll('audio, video').forEach(el => el.muted = true);
    }

    function unmutePage() {
        isMuted = false;
        button.innerText = '点击静音';
        document.querySelectorAll('audio, video').forEach(el => el.muted = false);
    }

    button.addEventListener('click', function() {
        if (isMuted) {
            unmutePage();
        } else {
            mutePage();
        }
    });

    function checkMutedStatus() {
        const videos = document.querySelectorAll('audio, video');
        if (videos.length > 0) {
            const anyMuted = Array.from(videos).some(v => v.muted);
            if (anyMuted) {
                isMuted = true;
                button.innerText = '点击恢复';
            } else {
                isMuted = false;
                button.innerText = '点击静音';
            }
        }
    }

    setInterval(checkMutedStatus, 1000);

})();

// ==UserScript==
// @name         Youtube1倍2倍切り替え(数字表示)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Execute UserScript
// @author       Your Name
// @include      youtube.com 
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529942/Youtube1%E5%80%8D2%E5%80%8D%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88%28%E6%95%B0%E5%AD%97%E8%A1%A8%E7%A4%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529942/Youtube1%E5%80%8D2%E5%80%8D%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88%28%E6%95%B0%E5%AD%97%E8%A1%A8%E7%A4%BA%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const button = document.createElement('div');
    button.style.position = 'fixed';
    button.style.top = '15px';
    button.style.left = '180px';
    button.style.width = '30px';
    button.style.height = '30px';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '10000';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.color = 'white';
    button.style.fontSize = '16px';
    button.style.fontWeight = 'bold';
    button.innerText = '1';

    function updateButtonText() {
        const v = document.querySelector('video');
        if (v) {
            button.innerText = v.playbackRate.toFixed(0);
        }
    }

    button.addEventListener('click', () => {
        const v = document.querySelector('video');
        if (v) {
            v.playbackRate = (v.playbackRate === 1) ? 2 : 1;
            updateButtonText();
        }
    });

    document.body.appendChild(button);
    
    const observer = new MutationObserver(updateButtonText);
    observer.observe(document.body, { childList: true, subtree: true });
})();
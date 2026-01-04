// ==UserScript==
// @name         Youtube1倍2倍切り替え(モバイル用)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Execute UserScript
// @author       Your Name
// @match        https://m.youtube.com/* 
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529159/Youtube1%E5%80%8D2%E5%80%8D%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88%28%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529159/Youtube1%E5%80%8D2%E5%80%8D%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88%28%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('div');
    button.style.position = 'fixed';
    button.style.top = '15px';
    button.style.left = '150px';
    button.style.width = '25px';
    button.style.height = '25px';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '10000';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';

    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.style.width = '20px';
        line.style.height = '3px';
        line.style.backgroundColor = 'white';
        line.style.margin = '2px 0';
        button.appendChild(line);
    }

    button.addEventListener('click', () => {
javascript:(function(){
    var v = document.querySelector('video');
    if (v) v.playbackRate = (v.playbackRate === 1) ? 2 : 1;
})();
    });

    document.body.appendChild(button);
})();
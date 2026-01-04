// ==UserScript==
// @name         DOWNSUBリンクからChatGPTに要約
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Execute UserScript
// @author       Your Name
// @match        https://subtitle.downsub.com/* 
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529689/DOWNSUB%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%8B%E3%82%89ChatGPT%E3%81%AB%E8%A6%81%E7%B4%84.user.js
// @updateURL https://update.greasyfork.org/scripts/529689/DOWNSUB%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%8B%E3%82%89ChatGPT%E3%81%AB%E8%A6%81%E7%B4%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('div');
    button.style.position = 'fixed';
    button.style.top = '15px';
    button.style.left = '130px';
    button.style.width = '100px';
    button.style.height = '100px';
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
javascript:(function(){ var currentUrl = window.location.href; var summaryText = '以下のリンクはYoutubeの字幕です。これをもとに動画を要約してください\n ' + currentUrl; var textArea = document.createElement('textarea'); textArea.value = summaryText; document.body.appendChild(textArea); textArea.select(); document.execCommand('copy'); document.body.removeChild(textArea); window.location.href = 'https://chatgpt.com/'; })();
    });

    document.body.appendChild(button);
})();
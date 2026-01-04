// ==UserScript==
// @name         DOWNSUB字幕コピー
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Execute UserScript
// @author       Your Name
// @include      https://subtitle.downsub.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529687/DOWNSUB%E5%AD%97%E5%B9%95%E3%82%B3%E3%83%94%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/529687/DOWNSUB%E5%AD%97%E5%B9%95%E3%82%B3%E3%83%94%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('div');
    button.style.position = 'fixed';
    button.style.top = '15px';
    button.style.left = '15px';
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
javascript:(function() {
    var subtitles = document.body.innerText;
    var textarea = document.createElement("textarea");
    textarea.value = subtitles;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("字幕をコピーしました！");
})();
    });

    document.body.appendChild(button);
})();
// ==UserScript==
// @name         DOWNSUB日本語までスクロール
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Execute UserScript
// @author       Your Name
// @include      https://downsub.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529690/DOWNSUB%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%81%BE%E3%81%A7%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/529690/DOWNSUB%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%81%BE%E3%81%A7%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('div');
    button.style.position = 'fixed';
    button.style.top = '15px';
    button.style.left = '60px';
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
javascript:(function() {
    var keyword = 'Japanese';
    var bodyText = document.body.innerText;
    if (bodyText.includes(keyword)) {
        alert('"' + keyword + '" が見つかりました！');
        window.find(keyword);
    } else {
        alert('"' + keyword + '" は見つかりませんでした。');
    }
})();
    });

    document.body.appendChild(button);
})();
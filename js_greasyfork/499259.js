// ==UserScript==
// @name         Generic URL ID Manipulator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract ID from various URLs, display it, and enable keyboard navigation
// @author       You
// @match        https://*/*
// @match        http://*/*
// @license      LGPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499259/Generic%20URL%20ID%20Manipulator.user.js
// @updateURL https://update.greasyfork.org/scripts/499259/Generic%20URL%20ID%20Manipulator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 提取URL中的ID
    function extractIdFromUrl(url) {
        // 正则表达式可以根据需要调整以匹配不同网站的ID格式
        const idMatch = url.match(/(\d+)\.(html|jsp|php|aspx?|do|action|servlet|cfm|py|pl)(\?.*)?(#.*)?$/);
        return idMatch ? parseInt(idMatch[1], 10) : null;
    }

    // 显示ID在页面右下角
    function displayId(id) {
        const displayDivId = 'tampermonkey-id-display';
        let displayElement = document.getElementById(displayDivId);

        if (!displayElement) {
            displayElement = document.createElement('div');
            displayElement.id = displayDivId;
            displayElement.style.position = 'fixed';
            displayElement.style.bottom = '10px';
            displayElement.style.right = '10px';
            displayElement.style.fontSize = '36px';
            displayElement.style.color = 'orange';
            document.body.appendChild(displayElement);
        }

        if (id !== null) {
            displayElement.textContent = id;
            displayElement.style.display = 'block';
        } else {
            displayElement.style.display = 'none';
        }
    }

    // 根据当前ID和新ID构建新的URL
    function buildNewUrl(currentUrl, newId) {
        // 根据网站的不同，构建新URL的逻辑可能有所不同
        const urlParts = currentUrl.split('/');
        const lastPart = urlParts.pop();
        const fileExtensionMatch = lastPart.match(/(\.\w+)(\?.*)?(#.*)?$/);
        if (fileExtensionMatch) {
            urlParts.push(newId + fileExtensionMatch[0]);
        }
        return urlParts.join('/');
    }

    // 跳转至新页面
    function navigate(direction) {
        const currentUrl = window.location.href;
        const currentId = extractIdFromUrl(currentUrl);

        if (currentId !== null) {
            const newId = direction === 'right' ? currentId + 1 : currentId - 1;
            const newUrl = buildNewUrl(currentUrl, newId);
            window.location.href = newUrl;
        }
    }

    // 绑定键盘事件
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'ArrowRight') {
            navigate('right');
        } else if (event.ctrlKey && event.key === 'ArrowLeft') {
            navigate('left');
        }
    });

    // 初始化
    const id = extractIdFromUrl(window.location.href);
    displayId(id);
})();
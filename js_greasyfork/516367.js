// ==UserScript==
// @name         提取图片 by GPT && Leizingyiu
// @namespace    http://tampermonkey.net/
// @version      20241108
// @description  Display all images in an overlay when pressing Alt+S, close with Alt+W
// @match        *://*/*
// @author      Leizingyiu
// @license     GNU AGPLv3 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516367/%E6%8F%90%E5%8F%96%E5%9B%BE%E7%89%87%20by%20GPT%20%20Leizingyiu.user.js
// @updateURL https://update.greasyfork.org/scripts/516367/%E6%8F%90%E5%8F%96%E5%9B%BE%E7%89%87%20by%20GPT%20%20Leizingyiu.meta.js
// ==/UserScript==

javascript: console.log(`提取图片 by GPT && Leizingyiu
Last modified : "2024/11/08 16:52:18"
`);


function keyToRun() {
    document.addEventListener('keydown', (event) => {
        if (event.altKey && event.shiftKey && (event.code === 'KeyA')) {
            createOverlay(); // Alt+S 显示覆盖层
        }
        if (event.altKey && event.shiftKey && (event.code === 'KeyQ')) {
            removeOverlay(); // Alt+W 关闭覆盖层
        }
    });
}

var overlay = null;

function createOverlay() {
    'use strict';

    overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.zIndex = '9999';
    overlay.style.overflowY = 'auto';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.padding = '20px';
    overlay.style.color = '#fff';

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.position = 'fixed';
    closeButton.style.top = '20px';
    closeButton.style.right = '20px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.fontSize = '16px';
    closeButton.style.backgroundColor = '#ff5c5c';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.borderRadius = '5px';
    closeButton.onclick = () => document.body.removeChild(overlay);
    overlay.appendChild(closeButton);

    const imagesContainer = document.createElement('div');
    imagesContainer.style.display = 'flex';
    imagesContainer.style.flexWrap = 'wrap';
    imagesContainer.style.gap = '10px';
    imagesContainer.style.justifyContent = 'center';
    overlay.appendChild(imagesContainer);

    function addImageToContainer(src) {
        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = '200px';
        img.style.maxHeight = '200px';
        img.style.objectFit = 'contain';
        img.style.border = '2px solid #fff';
        imagesContainer.appendChild(img);
    }

    document.querySelectorAll('img').forEach(img => {
        if (img.src) addImageToContainer(img.src);
    });

    document.querySelectorAll('*').forEach(element => {
        const bgImage = window.getComputedStyle(element).backgroundImage;
        if (bgImage && bgImage.startsWith('url(')) {
            const url = bgImage.slice(5, -2);
            addImageToContainer(url);
        }
    });

    document.querySelectorAll('svg').forEach(svg => {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        addImageToContainer(svgUrl);
    });

    document.body.appendChild(overlay);
}

// 移除覆盖层函数
function removeOverlay() {
    console.log('removeOverlay');
    if (overlay) {
        document.body.removeChild(overlay);
        overlay = null;
    }
}







window.addEventListener('hashchange', function () {
    keyToRun();
});

window.addEventListener('popstate', function (event) {
    keyToRun();
});

keyToRun();





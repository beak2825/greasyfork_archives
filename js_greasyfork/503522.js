// ==UserScript==
// @name         视频进度条拉到尾端
// @namespace    none
// @version      1.2
// @description  将视频进度条移至末尾，绕过基于进度的限制。
// @author       AMin
// @match        *://*/*
// @grant        none
// @license      Proprietary
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/503522/%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E6%9D%A1%E6%8B%89%E5%88%B0%E5%B0%BE%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/503522/%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E6%9D%A1%E6%8B%89%E5%88%B0%E5%B0%BE%E7%AB%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const manipulateProgressBar = () => {
        const video = document.querySelector('video');
        if (!video) return;

        const originalTime = video.currentTime;
        video.currentTime = video.duration - 2;
        setTimeout(() => video.currentTime = originalTime, 900);
    };

    const createButton = () => {
        const button = document.createElement('button');
        Object.assign(button.style, {
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            opacity: '0.85',
            zIndex: '10000'
        });
        button.textContent = '视频置为最后';
        button.onclick = manipulateProgressBar;
        document.body.appendChild(button);
    };

    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('video')) {
            createButton();
            obs.disconnect();
        }
    });

    document.querySelector('video') ? createButton() : observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
// ==UserScript==
// @name         Threads-Volume
// @namespace    threadsVolume
// @version      1.3.0
// @description  Set your Threads videos default volumes
// @description:zh-TW 設定 Threads 的音量
// @description:zh-CN 设定 Threads 的音量
// @author       Lin_tsen
// @match        *://*.threads.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=threads.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534078/Threads-Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/534078/Threads-Volume.meta.js
// ==/UserScript==

console.log("threadsVolumeCustomize");

window.addEventListener('load', () => {
    if (!localStorage.getItem('defaultVolume')) {
        localStorage.setItem('defaultVolume', 0.2);
    }

    const findVolumeDiv = () => {
        const targetElement = document.querySelector('header') || document.body;
        if (!targetElement) return;

        const volumeDiv = document.createElement('div');
        volumeDiv.id = 'volumeDiv';
        volumeDiv.style.display = 'flex';
        volumeDiv.style.alignItems = 'center';
        volumeDiv.style.justifyContent = 'space-between';
        volumeDiv.style.padding = '8px 12px';
        volumeDiv.style.borderRadius = '8px';
        volumeDiv.style.cursor = 'pointer';
        volumeDiv.style.position = 'fixed';
        volumeDiv.style.top = '10px';
        volumeDiv.style.right = '10px';
        volumeDiv.style.zIndex = '9999';
        volumeDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
        volumeDiv.style.maxHeight = '3vh';
        volumeDiv.style.color = 'white'; // 數字白色，無背景

        const volumeTextContainer = document.createElement('div');
        volumeTextContainer.style.overflow = 'hidden';

        const volumeText = document.createElement('span');
        volumeText.id = 'volumeText';
        volumeText.style.paddingLeft = '10px';
        volumeText.textContent = 'Volume';

        const volumeSelectorContainer = document.createElement('div');
        volumeSelectorContainer.style.display = 'flex';
        volumeSelectorContainer.style.alignItems = 'center';

        const volumeSelectorText = document.createElement('span');
        volumeSelectorText.textContent = Math.round(localStorage.getItem('defaultVolume') * 100 || 20); // 顯示整數
        volumeSelectorText.style.marginLeft = '10px';
        volumeSelectorText.style.fontSize = '14px';
        volumeSelectorText.style.minWidth = '30px'; // 保持寬度一致
        volumeSelectorText.style.textAlign = 'center';

        const volumeSelectorInput = document.createElement('input');
        volumeSelectorInput.type = 'range';
        volumeSelectorInput.value = localStorage.getItem('defaultVolume') * 100 || 20;
        volumeSelectorInput.min = 0;
        volumeSelectorInput.max = 100;
        volumeSelectorInput.step = 1; // 只顯示整數
        volumeSelectorInput.style.display = 'none';
        volumeSelectorInput.style.cursor = 'ew-resize';
        volumeSelectorInput.style.width = '100px'; // 滑桿寬度

        volumeSelectorInput.addEventListener('input', () => {
            let volumeValue = Math.round(volumeSelectorInput.value); // 取整數
            volumeSelectorText.textContent = volumeValue;
            localStorage.setItem('defaultVolume', volumeValue / 100);
        });

        // hover 效果
        volumeDiv.addEventListener('mouseenter', () => {
            volumeDiv.style.backgroundColor = '#1A1A1A';
            volumeText.style.color = 'white';
        });
        volumeDiv.addEventListener('mouseleave', () => {
            volumeDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
            volumeText.style.color = '';
        });

        let showVolumeSlider = false;
        volumeDiv.addEventListener('click', (event) => {
            event.stopPropagation();
            showVolumeSlider = !showVolumeSlider;
            volumeSelectorInput.style.display = showVolumeSlider ? 'block' : 'none';
        });

        volumeSelectorContainer.appendChild(volumeSelectorText);
        volumeSelectorContainer.appendChild(volumeSelectorInput);

        volumeDiv.appendChild(volumeTextContainer);
        volumeDiv.appendChild(volumeSelectorContainer);
        volumeTextContainer.appendChild(volumeText);

        targetElement.appendChild(volumeDiv);
    };

    setInterval(() => {
        if (!document.getElementById('volumeDiv')) {
            findVolumeDiv();
        }
    }, 1000);

    const setVolumeForVideos = () => {
        const defaultVolume = parseFloat(localStorage.getItem('defaultVolume'));
        const videos = document.getElementsByTagName('video');
        for (let i = 0; i < videos.length; i++) {
            videos[i].volume = defaultVolume;
        }
    };

    setVolumeForVideos();

    new MutationObserver(() => {
        setVolumeForVideos();
    }).observe(document.body, { childList: true, subtree: true });

});


//"I never sleep today, I sleep tomorrow"
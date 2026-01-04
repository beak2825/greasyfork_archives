// ==UserScript==
// @name         站点图片调整和链接优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adjusts image sizes and link behavior on Exoticaz.to and PTTime.org
// @match        https://exoticaz.to/*
// @match        https://www.pttime.org/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503254/%E7%AB%99%E7%82%B9%E5%9B%BE%E7%89%87%E8%B0%83%E6%95%B4%E5%92%8C%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/503254/%E7%AB%99%E7%82%B9%E5%9B%BE%E7%89%87%E8%B0%83%E6%95%B4%E5%92%8C%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS styles
    GM_addStyle(`
    #sizeAdjuster {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9998;
        background-color: #333;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        width: 50px;
        height: 50px;
    }
    #sizeAdjuster:hover {
        width: 200px;
        border-radius: 25px;
    }
    #sizeIcon {
        background-color: #444;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: transform 0.3s ease;
        flex-shrink: 0;
        font-size: 18px; /* Ensures consistent size */
        color: #fff;
    }
    #sizeSlider {
        width: 100px;
        margin-left: 15px;
        display: none;
        font-size: 14px; /* Consistent text size */
    }
    #sizeAdjuster:hover #sizeSlider {
        display: block;
    }
    #sizeValue {
        color: #fff;
        margin-left: 10px;
        font-family: Arial, sans-serif;
        font-size: 14px; /* Consistent text size */
        display: none;
    }
    #sizeAdjuster:hover #sizeValue {
        display: block;
    }
    #settingsPopup {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #333;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0,0,0,0.2);
        z-index: 9999;
        font-family: Arial, sans-serif;
        font-size: 14px; /* Ensures consistent text size throughout popup */
    }
    #settingsPopup input[type="number"] {
        width: 100px;
        padding: 5px;
        margin: 10px 0;
        background-color: #444;
        color: #fff;
        border: none;
        border-radius: 5px;
        font-size: 14px; /* Consistent input text size */
    }
    #settingsPopup button {
        background-color: #444;
        font-size: 14px; /* Consistent button text size */
        color: #fff;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    #settingsPopup button:hover {
        background-color: #555;
    }
    #overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        z-index: 9997;
    }
`);


    // Create and add the size adjuster
    const adjuster = document.createElement('div');
    adjuster.id = 'sizeAdjuster';
    adjuster.innerHTML = `
        <div id="sizeIcon">🖼️</div>
        <input type="range" id="sizeSlider" min="64" max="500" value="300">
        <span id="sizeValue">300px</span>
    `;
    document.body.appendChild(adjuster);

    // Create and add the settings popup
    const settingsPopup = document.createElement('div');
    settingsPopup.id = 'settingsPopup';
    settingsPopup.innerHTML = `
        <label for="defaultSize">Default Image Size (px):</label>
        <input type="number" id="defaultSize" min="64" max="500" value="300">
        <button id="saveSettings">Save</button>
    `;
    document.body.appendChild(settingsPopup);

    // Create and add the overlay
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    document.body.appendChild(overlay);

    // Function to modify links and images
    function modifyElements(imageSize) {
        const currentDomain = window.location.hostname;

        if (currentDomain === 'exoticaz.to') {
            const divs = document.querySelectorAll('div.mb-1');
            divs.forEach(div => {
                const anchor = div.querySelector('a.torrent-link');
                if (anchor) {
                    anchor.setAttribute('target', '_blank');
                }
            });

            const imageContainers = document.querySelectorAll('div.screen-image.d-inline-block.float-left.mr-1');
            imageContainers.forEach(container => {
                const img = container.querySelector('img');
                if (img) {
                    img.style.width = `${imageSize}px`;
                    img.style.height = 'auto';
                }
            });
        } else if (currentDomain === 'www.pttime.org') {
            const images = document.querySelectorAll('td.torrentimg img');
            images.forEach(img => {
                img.setAttribute('height', imageSize);
                img.style.width = 'auto';
            });
        }
    }

    // Load saved size or use default
    let defaultSize = localStorage.getItem('imageSize') || 300;
    let currentSize = defaultSize;
    document.getElementById('defaultSize').value = defaultSize;
    document.getElementById('sizeSlider').value = defaultSize;
    document.getElementById('sizeValue').textContent = `${defaultSize}px`;

    // Initial run
    modifyElements(currentSize);

    // Use a MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(() => modifyElements(currentSize));
    observer.observe(document.body, { childList: true, subtree: true });

    // Event listener for slider
    document.getElementById('sizeSlider').addEventListener('input', function() {
        currentSize = this.value;
        document.getElementById('sizeValue').textContent = `${currentSize}px`;
        modifyElements(currentSize);
    });

    // Event listener for icon click
    document.getElementById('sizeIcon').addEventListener('click', (e) => {
        e.stopPropagation();
        settingsPopup.style.display = 'block';
        overlay.style.display = 'block';
    });

    // Event listener for save button
    document.getElementById('saveSettings').addEventListener('click', () => {
        defaultSize = document.getElementById('defaultSize').value;
        localStorage.setItem('imageSize', defaultSize);
        currentSize = defaultSize;
        document.getElementById('sizeSlider').value = defaultSize;
        document.getElementById('sizeValue').textContent = `${defaultSize}px`;
        modifyElements(currentSize);
        settingsPopup.style.display = 'none';
        overlay.style.display = 'none';
    });

    // Event listener for overlay (to close popup when clicking outside)
    overlay.addEventListener('click', () => {
        settingsPopup.style.display = 'none';
        overlay.style.display = 'none';
    });
})();
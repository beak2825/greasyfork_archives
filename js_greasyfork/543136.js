// ==UserScript==
// @name         Spread Bullets Not Hate
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Press ALT+P to open menu. Scatter zone indicator for Diep.io, refer to each tank's "Bullet Scatter Rate" in https://diepwiki.io/#/tanks/
// @author       Discord: anuryx. (Github: XyrenTheCoder)
// @match        *://*.diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543136/Spread%20Bullets%20Not%20Hate.user.js
// @updateURL https://update.greasyfork.org/scripts/543136/Spread%20Bullets%20Not%20Hate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const images = [
        'https://ik.imagekit.io/as7ksk9qe/aim_20250720142252.png', // Red Zone (3x Spread)
        'https://ik.imagekit.io/as7ksk9qe/aim_20250720142257.png', // Yellow Zone (1x Spread)
        'https://ik.imagekit.io/as7ksk9qe/aim_20250720152421.png', // Green Zone (0.3x Spread)
        'https://ik.imagekit.io/as7ksk9qe/aim_20250720142241.png', // Spread (Light Mode)
        'https://ik.imagekit.io/as7ksk9qe/aim_20250720142244.png', // Spread (Dark Mode)
        'https://ik.imagekit.io/as7ksk9qe/aim_20250720145559.png', // Penta (Light Mode)
        'https://ik.imagekit.io/as7ksk9qe/aim_20250720145554.png'  // Penta (Dark Mode)
    ];

    const baseImg = document.createElement('img');
    baseImg.src = images[0];
    baseImg.style.position = 'fixed';
    baseImg.style.top = '50%';
    baseImg.style.left = '50%';
    baseImg.style.width = '100%';
    baseImg.style.height = '100%';
    baseImg.style.transform = 'translate(-50%, -50%)';
    baseImg.style.pointerEvents = 'none';
    baseImg.style.zIndex = 999;
    baseImg.style.display = 'none';
    document.body.appendChild(baseImg);

    const overlayImg = document.createElement('img');
    overlayImg.src = images[3];
    overlayImg.style.position = 'fixed';
    overlayImg.style.top = '50%';
    overlayImg.style.left = '50%';
    overlayImg.style.width = '100%';
    overlayImg.style.height = '100%';
    overlayImg.style.transform = 'translate(-50%, -50%)';
    overlayImg.style.pointerEvents = 'none';
    overlayImg.style.zIndex = 1000;
    overlayImg.style.display = 'none';
    document.body.appendChild(overlayImg);

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = 1001;
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    container.style.padding = '15px';
    container.style.borderRadius = '10px';
    container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    container.style.color = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '15px';
    container.style.display = 'none';
    container.style.flexDirection = 'column';
    document.body.appendChild(container);

    let isDarkMode = false;
    let isOverlayVisible = false;
    let isPentaMode = false;

    const zoneSection = document.createElement('div');
    zoneSection.style.borderBottom = 'solid 1px #444';
    zoneSection.style.paddingBottom = '10px';
    zoneSection.style.marginBottom = '10px';
    container.appendChild(zoneSection);

    const label = document.createElement('div');
    label.innerText = 'Scatter Zone Indicator by A-76 (DC: anuryx.)';
    label.style.fontWeight = 'bold';
    label.style.fontSize = '15px';
    label.style.color = '#BC13FE';
    label.style.marginBottom = '10px';
    zoneSection.appendChild(label);

    const zoneLabel = document.createElement('div');
    zoneLabel.innerText = 'Select Scatter Zone Size:';
    zoneLabel.style.fontSize = '12px';
    zoneLabel.style.fontWeight = 'bold';
    zoneLabel.style.margin = '5px';
    zoneSection.appendChild(zoneLabel);

    const zoneButtons = [
        { text: 'Red Zone (±15deg, 0.3x)', index: 0 },
        { text: 'Yellow Zone (±5deg, 1x)', index: 1 },
        { text: 'Green Zone (±1.5deg, 3x)', index: 2 }
    ];

    zoneButtons.forEach(zone => {
        const button = document.createElement('button');
        button.innerText = zone.text;
        button.style.margin = '5px 0';
        button.style.padding = '10px 15px';
        button.style.color = 'white';
        button.style.fontSize = '10px';
        button.style.backgroundColor = '#08103A';
        button.style.border = 'solid 1px #5BA2C6';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s';

        button.onmouseover = () => {
            button.style.backgroundColor = '#7EA5C4';
        };

        button.onmouseout = () => {
            button.style.backgroundColor = '#08103A';
        };

        button.onclick = () => {
            baseImg.src = images[zone.index];
            overlayImg.src = isPentaMode ? (isDarkMode ? images[6] : images[5]) : (isDarkMode ? images[4] : images[3]);
        };

        zoneSection.appendChild(button);
    });

    const sliderContainer = document.createElement('div');
    sliderContainer.style.margin = '5px';
    container.appendChild(sliderContainer);

    const opacityLabel = document.createElement('label');
    opacityLabel.innerText = 'Adjust Opacity:';
    opacityLabel.style.color = 'white';
    opacityLabel.style.margin = '10px';
    opacityLabel.style.fontSize = '12px';
    opacityLabel.style.lineHeight = '12px';
    sliderContainer.appendChild(opacityLabel);

    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.min = '0';
    opacitySlider.max = '1';
    opacitySlider.step = '0.1';
    opacitySlider.value = '1';
    opacitySlider.style.margin = '5px';
    opacitySlider.style.backgroundColor = '#B0E0E6';

    opacitySlider.oninput = () => {
        const opacityValue = opacitySlider.value;
        baseImg.style.opacity = opacityValue;
        overlayImg.style.opacity = opacityValue;
    };

    sliderContainer.appendChild(opacitySlider);

    const zoneFooter = document.createElement('div');
    zoneFooter.innerText = '(Refer to [Modernised Diep Wiki] by Clever Yeti || https://diepwiki.io/)';
    zoneFooter.style.fontSize = '10px';
    zoneFooter.style.color = '#666666';
    zoneFooter.style.margin = '5px';
    zoneSection.appendChild(zoneFooter);

    const otherButtonsSection = document.createElement('div');
    otherButtonsSection.style.display = 'flex';
    otherButtonsSection.style.flexDirection = 'column';
    container.appendChild(otherButtonsSection);

    const toggleBaseImageButton = document.createElement('button');
    toggleBaseImageButton.innerText = 'Toggle Scatter Zone Highlight';
    toggleBaseImageButton.style.margin = '5px 0';
    toggleBaseImageButton.style.padding = '10px 15px';
    toggleBaseImageButton.style.color = 'white';
    toggleBaseImageButton.style.fontSize = '10px';
    toggleBaseImageButton.style.backgroundColor = '#08103A';
    toggleBaseImageButton.style.border = 'solid 1px #BC13FE';
    toggleBaseImageButton.style.borderRadius = '5px';
    toggleBaseImageButton.style.cursor = 'pointer';
    toggleBaseImageButton.style.transition = 'background-color 0.3s';

    toggleBaseImageButton.onmouseover = () => {
        toggleBaseImageButton.style.backgroundColor = '#880FB8';
    };

    toggleBaseImageButton.onmouseout = () => {
        toggleBaseImageButton.style.backgroundColor = '#08103A';
    };

    toggleBaseImageButton.onclick = () => {
        baseImg.style.display = baseImg.style.display === 'none' ? 'block' : 'none';
    };

    otherButtonsSection.appendChild(toggleBaseImageButton);

    const toggleOverlayButton = document.createElement('button');
    toggleOverlayButton.innerText = 'Toggle Spread/Penta Zone';
    toggleOverlayButton.style.margin = '5px 0';
    toggleOverlayButton.style.padding = '10px 15px';
    toggleOverlayButton.style.color = 'white';
    toggleOverlayButton.style.fontSize = '10px';
    toggleOverlayButton.style.backgroundColor = '#08103A';
    toggleOverlayButton.style.border = 'solid 1px #BD46FC';
    toggleOverlayButton.style.borderRadius = '2px';
    toggleOverlayButton.style.cursor = 'pointer';
    toggleOverlayButton.style.transition = 'background-color 0.3s';

    toggleOverlayButton.onmouseover = () => {
        toggleOverlayButton.style.backgroundColor = '#8635BB';
    };

    toggleOverlayButton.onmouseout = () => {
        toggleOverlayButton.style.backgroundColor = '#08103A';
    };

    toggleOverlayButton.onclick = () => {
        isOverlayVisible = !isOverlayVisible;
        overlayImg.style.display = isOverlayVisible ? 'block' : 'none';
    };

    otherButtonsSection.appendChild(toggleOverlayButton);

    const darkModeButton = document.createElement('button');
    darkModeButton.innerText = 'Toggle Dark Mode';
    darkModeButton.style.margin = '5px 0';
    darkModeButton.style.padding = '10px 15px';
    darkModeButton.style.color = 'white';
    darkModeButton.style.fontSize = '10px';
    darkModeButton.style.backgroundColor = '#08103A';
    darkModeButton.style.border = 'solid 1px #BF79FA';
    darkModeButton.style.borderRadius = '5px';
    darkModeButton.style.cursor = 'pointer';
    darkModeButton.style.transition = 'background-color 0.3s';

    darkModeButton.onmouseover = () => {
        darkModeButton.style.backgroundColor = '#835ABE';
    };

    darkModeButton.onmouseout = () => {
        darkModeButton.style.backgroundColor = '#08103A';
    };

    darkModeButton.onclick = () => {
        isDarkMode = !isDarkMode;
        overlayImg.src = isPentaMode ? (isDarkMode ? images[6] : images[5]) : (isDarkMode ? images[4] : images[3]);
        darkModeButton.innerText = isDarkMode ? 'Switch to Light Mode' : 'Toggle Dark Mode';
        if (isOverlayVisible) {
            overlayImg.style.display = 'block';
        }
    };

    otherButtonsSection.appendChild(darkModeButton);

    const pentaModeButton = document.createElement('button');
    pentaModeButton.innerText = 'Toggle Penta Mode';
    pentaModeButton.style.margin = '5px 0';
    pentaModeButton.style.padding = '10px 15px';
    pentaModeButton.style.color = 'white';
    pentaModeButton.style.fontSize = '10px';
    pentaModeButton.style.backgroundColor = '#08103A';
    pentaModeButton.style.border = 'solid 1px #C0ABF8';
    pentaModeButton.style.borderRadius = '5px';
    pentaModeButton.style.cursor = 'pointer';
    pentaModeButton.style.transition = 'background-color 0.3s';

    pentaModeButton.onmouseover = () => {
        pentaModeButton.style.backgroundColor = '#8180C1';
    };

    pentaModeButton.onmouseout = () => {
        pentaModeButton.style.backgroundColor = '#08103A';
    };

    pentaModeButton.onclick = () => {
        isPentaMode = !isPentaMode;
        overlayImg.src = isPentaMode ? (isDarkMode ? images[6] : images[5]) : (isDarkMode ? images[4] : images[3]);
        pentaModeButton.innerText = isPentaMode ? 'Switch to Spread Mode' : 'Toggle Penta Mode';
        if (isOverlayVisible) {
            overlayImg.style.display = 'block';
        }
    };

    otherButtonsSection.appendChild(pentaModeButton);

    const toggleImagesButton = document.createElement('button');
    toggleImagesButton.innerText = 'Show/Hide All';
    toggleImagesButton.style.margin = '5px 0';
    toggleImagesButton.style.padding = '10px 15px';
    toggleImagesButton.style.color = 'white';
    toggleImagesButton.style.fontSize = '10px';
    toggleImagesButton.style.backgroundColor = '#08103A';
    toggleImagesButton.style.border = 'solid 1px #C1DEF6';
    toggleImagesButton.style.borderRadius = '5px';
    toggleImagesButton.style.cursor = 'pointer';
    toggleImagesButton.style.transition = 'background-color 0.3s';

    toggleImagesButton.onmouseover = () => {
        toggleImagesButton.style.backgroundColor = '#7EA5C4';
    };

    toggleImagesButton.onmouseout = () => {
        toggleImagesButton.style.backgroundColor = '#08103A';
    };

    toggleImagesButton.onclick = () => {
        const isVisible = baseImg.style.display === 'block';
        baseImg.style.display = isVisible ? 'none' : 'block';
        overlayImg.style.display = isVisible ? 'none' : 'block';
    };

    otherButtonsSection.appendChild(toggleImagesButton);

    document.addEventListener('keydown', (event) => {
        if (event.altKey && event.key === 'p') {
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
        }
    });

    document.addEventListener('mousemove', (event) => {
        const { clientX, clientY } = event;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        baseImg.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        overlayImg.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    });
})();

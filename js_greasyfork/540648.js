// ==UserScript==
// @name         Gartic.io Custom Background
// @namespace    http://tampermonkey.net/
// @version      1.25
// @description  This userscript let you customize your own gartic.io background
// @author       arcticrevurne
// @icon         https://em-content.zobj.net/source/twitter/408/fox_1f98a.png
// @match        *://*.gartic.io/*
// @license      MIT
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540648/Garticio%20Custom%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/540648/Garticio%20Custom%20Background.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultBackgroundColor = '#241500';
    const oldDefaultOrange = '#FF9800';

    function injectCustomCss() {
        const style = document.createElement('style');
        style.id = 'gartic-custom-styles';
        style.textContent = `
            #background::before {
                content: none !important;
                background-image: none !important;
                display: none !important;
                opacity: 0 !important;
            }
            body {
                background-color: ${defaultBackgroundColor} !important;
            }
        `;
        document.head.appendChild(style);
    }

    function applyCustomBackground(value) {
        const body = document.querySelector('body');
        if (body) {
            if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
                body.style.backgroundImage = `url('${value}')`;
                body.style.backgroundSize = 'cover';
                body.style.backgroundRepeat = 'no-repeat';
                body.style.backgroundAttachment = 'fixed';
                body.style.backgroundPosition = 'center center';
                body.style.removeProperty('background-color');
            } else {
                body.style.backgroundImage = 'none';
                body.style.setProperty('background-color', value, 'important');
            }
        }
    }

    function resetBackground() {
        const body = document.querySelector('body');
        if (body) {
            body.style.backgroundImage = '';
            body.style.removeProperty('background-color');
        }
        localStorage.removeItem('gartic_custom_background');
    }

    function showNotification(message, isError = false) {
        const notificationArea = document.getElementById('gartic-bg-notification');
        if (!notificationArea) return;

        notificationArea.textContent = message;
        notificationArea.style.opacity = '1';
        notificationArea.style.backgroundColor = isError ? '#FF5722' : '#4CAF50';
        notificationArea.style.color = '#FFFFFF';
        notificationArea.style.padding = '8px';
        notificationArea.style.borderRadius = '4px';
        notificationArea.style.marginBottom = '10px';
        notificationArea.style.textAlign = 'center';

        setTimeout(() => {
            notificationArea.style.opacity = '0';
            notificationArea.style.padding = '0';
            notificationArea.style.marginBottom = '0';
        }, 3000);
    }

    function createSettingsMenu() {
        if (document.getElementById('gartic-custom-bg-menu')) {
            return;
        }

        const menuContainer = document.createElement('div');
        menuContainer.id = 'gartic-custom-bg-menu';
        menuContainer.style.position = 'fixed';
        menuContainer.style.backgroundColor = '#FFFFFF';
        menuContainer.style.border = '1px solid #FF9800';
        menuContainer.style.borderRadius = '6px';
        menuContainer.style.padding = '18px';
        menuContainer.style.zIndex = '99999';
        menuContainer.style.display = 'none';
        menuContainer.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)';
        menuContainer.style.color = '#444444';
        menuContainer.style.fontFamily = 'Arial, sans-serif';
        menuContainer.style.maxWidth = '300px';
        menuContainer.style.width = '90%'; // Tetap pakai ini agar responsif di layar kecil
        menuContainer.style.boxSizing = 'border-box'; // Penting untuk padding dan border tidak menambah lebar

        const menuTitle = document.createElement('h3');
        menuTitle.textContent = 'Customise Background';
        menuTitle.style.marginBottom = '18px';
        menuTitle.style.color = '#FB8C00';
        menuTitle.style.textAlign = 'center';
        menuTitle.style.fontSize = '1.1em';
        menuTitle.style.fontWeight = '600';
        menuContainer.appendChild(menuTitle);

        const notificationArea = document.createElement('div');
        notificationArea.id = 'gartic-bg-notification';
        notificationArea.style.opacity = '0';
        notificationArea.style.transition = 'opacity 0.3s ease-in-out, padding 0.3s ease-in-out, margin-bottom 0.3s ease-in-out';
        notificationArea.style.overflow = 'hidden';
        notificationArea.style.maxHeight = '50px';
        menuContainer.appendChild(notificationArea);

        const fileInputLabel = document.createElement('label');
        fileInputLabel.textContent = 'Select Image File:';
        fileInputLabel.style.display = 'block';
        fileInputLabel.style.marginBottom = '6px';
        fileInputLabel.style.fontWeight = 'bold';
        fileInputLabel.style.fontSize = '0.9em';
        menuContainer.appendChild(fileInputLabel);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/jpeg, image/png, image/gif';
        fileInput.style.width = '100%'; // Atur lebar ke 100% dari parent (menuContainer)
        fileInput.style.padding = '8px 0';
        fileInput.style.marginBottom = '15px';
        fileInput.style.backgroundColor = 'transparent';
        fileInput.style.border = 'none';
        fileInput.style.color = '#444444';
        fileInput.style.cursor = 'pointer';
        fileInput.style.fontSize = '0.9em';
        fileInput.style.boxSizing = 'border-box'; // Pastikan padding tidak membuat lebar melebihi 100%
        menuContainer.appendChild(fileInput);

        const divider = document.createElement('hr');
        divider.style.borderColor = '#FFCC80';
        divider.style.margin = '18px 0';
        menuContainer.appendChild(divider);

        const inputUrlLabel = document.createElement('label');
        inputUrlLabel.textContent = 'Or Enter Image URL or Hex Colour:';
        inputUrlLabel.style.display = 'block';
        inputUrlLabel.style.marginBottom = '6px';
        inputUrlLabel.style.fontWeight = 'bold';
        inputUrlLabel.style.fontSize = '0.9em';
        menuContainer.appendChild(inputUrlLabel);

        const imageUrlInput = document.createElement('input');
        imageUrlInput.type = 'text';
        imageUrlInput.placeholder = 'e.g., #FF9800 or https://example.com/image.jpg';
        imageUrlInput.style.width = '100%'; // Atur lebar ke 100% dari parent (menuContainer)
        imageUrlInput.style.padding = '9px';
        imageUrlInput.style.marginBottom = '20px';
        imageUrlInput.style.backgroundColor = '#FFF3E0';
        imageUrlInput.style.border = '1px solid #FFB74D';
        imageUrlInput.style.borderRadius = '4px';
        imageUrlInput.style.color = '#444444';
        imageUrlInput.style.fontSize = '0.9em';
        imageUrlInput.style.boxSizing = 'border-box'; // Pastikan padding dan border tidak membuat lebar melebihi 100%
        menuContainer.appendChild(imageUrlInput);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.gap = '10px';
        menuContainer.appendChild(buttonContainer);

        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply';
        applyButton.style.flexGrow = '1';
        applyButton.style.backgroundColor = '#FF9800';
        applyButton.style.color = '#FFFFFF';
        applyButton.style.border = 'none';
        applyButton.style.padding = '10px 15px';
        applyButton.style.borderRadius = '5px';
        applyButton.style.cursor = 'pointer';
        applyButton.style.fontWeight = 'bold';
        applyButton.style.fontSize = '0.9em';
        applyButton.style.transition = 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease';
        applyButton.onmouseover = () => { applyButton.style.backgroundColor = '#F57C00'; applyButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)'; };
        applyButton.onmouseout = () => { applyButton.style.backgroundColor = '#FF9800'; applyButton.style.boxShadow = 'none'; };
        applyButton.onmousedown = () => applyButton.style.transform = 'scale(0.98)';
        applyButton.onmouseup = () => applyButton.style.transform = 'scale(1)';

        applyButton.onclick = () => {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onloadend = function() {
                    const dataUrl = reader.result;
                    applyCustomBackground(dataUrl);
                    localStorage.setItem('gartic_custom_background', dataUrl);
                    showNotification('Background from file applied successfully!');
                };
                reader.onerror = function() {
                    showNotification('Failed to read file.', true);
                };
                reader.readAsDataURL(file);
            } else {
                const url = imageUrlInput.value.trim();
                if (url) {
                    applyCustomBackground(url);
                    localStorage.setItem('gartic_custom_background', url);
                    showNotification('Background from URL or colour applied successfully!');
                } else {
                    showNotification('Please select an image file or enter an image URL or hex colour.', true);
                }
            }
            fileInput.value = '';
            imageUrlInput.value = '';
        };
        buttonContainer.appendChild(applyButton);

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.style.flexGrow = '1';
        resetButton.style.backgroundColor = '#FFB74D';
        resetButton.style.color = '#444444';
        resetButton.style.border = 'none';
        resetButton.style.padding = '10px 15px';
        resetButton.style.borderRadius = '5px';
        resetButton.style.cursor = 'pointer';
        resetButton.style.fontWeight = 'bold';
        resetButton.style.fontSize = '0.9em';
        resetButton.style.transition = 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease';
        resetButton.onmouseover = () => { resetButton.style.backgroundColor = '#FFA726'; resetButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)'; };
        resetButton.onmouseout = () => { resetButton.style.backgroundColor = '#FFB74D'; resetButton.style.boxShadow = 'none'; };
        resetButton.onmousedown = () => resetButton.style.transform = 'scale(0.98)';
        resetButton.onmouseup = () => resetButton.style.transform = 'scale(1)';

        resetButton.onclick = () => {
            resetBackground();
            imageUrlInput.value = '';
            fileInput.value = '';
            showNotification('Background has been reset to default.');
        };
        buttonContainer.appendChild(resetButton);

        document.body.appendChild(menuContainer);

        const menuToggleButton = document.createElement('button');
        menuToggleButton.textContent = '🖼️';
        menuToggleButton.id = 'gartic-custom-bg-toggle';
        menuToggleButton.classList.add('gartic-userscript-button-left');

        menuToggleButton.style.position = 'fixed';
        menuToggleButton.style.left = '15px';
        menuToggleButton.style.top = '15px';
        menuToggleButton.style.backgroundColor = '#FF9800';
        menuToggleButton.style.color = '#FFFFFF';
        menuToggleButton.style.border = 'none';
        menuToggleButton.style.padding = '8px 14px';
        menuToggleButton.style.borderRadius = '5px';
        menuToggleButton.style.cursor = 'pointer';
        menuToggleButton.style.zIndex = '100000';
        menuToggleButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.15)';
        menuToggleButton.style.fontWeight = 'bold';
        menuToggleButton.style.fontSize = '0.9em';
        menuToggleButton.style.transition = 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease';
        menuToggleButton.onmouseover = () => { menuToggleButton.style.backgroundColor = '#F57C00'; menuToggleButton.style.boxShadow = '0 3px 7px rgba(0,0,0,0.2)'; };
        menuToggleButton.onmouseout = () => { menuToggleButton.style.backgroundColor = '#FF9800'; menuToggleButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.15)'; };
        menuToggleButton.onmousedown = () => menuToggleButton.style.transform = 'scale(0.98)';
        menuToggleButton.onmouseup = () => menuToggleButton.style.transform = 'scale(1)';

        menuToggleButton.onclick = (event) => {
            event.stopPropagation();
            if (menuContainer.style.display === 'none') {
                menuContainer.style.display = 'block';
                const toggleRect = menuToggleButton.getBoundingClientRect();
                menuContainer.style.left = `${toggleRect.right + 15}px`;
                menuContainer.style.top = `${toggleRect.top}px`;

                if (parseFloat(menuContainer.style.top) < 5) {
                    menuContainer.style.top = '5px';
                }
                if (parseFloat(menuContainer.style.top) + menuContainer.offsetHeight > window.innerHeight - 5) {
                    menuContainer.style.top = `${window.innerHeight - menuContainer.offsetHeight - 5}px`;
                }

                imageUrlInput.value = '';
                fileInput.value = '';
                notificationArea.style.opacity = '0';
                notificationArea.style.padding = '0';
                notificationArea.style.marginBottom = '0';
            } else {
                menuContainer.style.display = 'none';
            }
        };
        document.body.appendChild(menuToggleButton);

        document.addEventListener('click', (event) => {
            if (menuContainer.style.display === 'block' &&
                !menuContainer.contains(event.target) &&
                !menuToggleButton.contains(event.target)) {
                menuContainer.style.display = 'none';
            }
        });
    }

    // Fungsi ini akan menerapkan gaya awal dan menangani background yang tersimpan.
    // CSS bawaan untuk menu userscript kita akan diatur secara inline di createSettingsMenu
    // untuk memastikan tidak ada konflik dengan theme selector.
    injectCustomCss();

    let savedBackground = localStorage.getItem('gartic_custom_background');
    if (!savedBackground || savedBackground === oldDefaultOrange) {
        applyCustomBackground(defaultBackgroundColor);
        localStorage.setItem('gartic_custom_background', defaultBackgroundColor);
    } else {
        applyCustomBackground(savedBackground);
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        const garticCoreElement = document.querySelector('.main-menu') || document.querySelector('.game-container') || document.body;

        if (garticCoreElement) {
            createSettingsMenu();
            observer.disconnect();
        } else if (document.body && !document.getElementById('gartic-custom-bg-menu')) {
            setTimeout(() => {
                if (!document.getElementById('gartic-custom-bg-menu')) {
                    createSettingsMenu();
                }
            }, 1000);
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('gartic-custom-bg-menu')) {
            setTimeout(createSettingsMenu, 1500);
        }
    });

})();
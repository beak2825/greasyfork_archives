// ==UserScript==
// @name         Torn Custom Background
// @namespace    https://torn.com/
// @version      1.27
// @description  Custom background with picture frame icon popup and transparency control
// @author       Skin-Tin
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546213/Torn%20Custom%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/546213/Torn%20Custom%20Background.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Load saved background and transparency
    const savedUrl = localStorage.getItem('tornWebBgUrl') || '';
    const savedOpacity = localStorage.getItem('tornWebBgOpacity') || '0.8';
    const bgDivId = 'torn-custom-bg-element';
    const frameIconId = 'torn-custom-bg-icon';

    // Create persistent background element
    function createBackgroundElement() {
        let bgDiv = document.getElementById(bgDivId);
        if (!bgDiv) {
            bgDiv = document.createElement('div');
            bgDiv.id = bgDivId;
            Object.assign(bgDiv.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                zIndex: '-100',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                pointerEvents: 'none',
                opacity: savedOpacity
            });
            document.body.appendChild(bgDiv);
        }
        return bgDiv;
    }

    // Apply background
    function setBackground(url, opacity = savedOpacity) {
        const bgDiv = document.getElementById(bgDivId) || createBackgroundElement();
        if (url) {
            bgDiv.style.backgroundImage = `url(${url})`;
            bgDiv.style.opacity = opacity;
        } else {
            bgDiv.style.backgroundImage = '';
        }
    }

    // Create floating frame icon
    function createFrameIcon() {
        let frameIcon = document.getElementById(frameIconId);
        if (frameIcon) return frameIcon;

        frameIcon = document.createElement('div');
        frameIcon.id = frameIconId;
        frameIcon.innerHTML = '🖼️';
        Object.assign(frameIcon.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            fontSize: '24px',
            cursor: 'pointer',
            opacity: '0.7',
            transition: 'opacity 0.3s',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
        });

        frameIcon.addEventListener('mouseenter', () => {
            frameIcon.style.opacity = '1';
        });

        document.body.appendChild(frameIcon);
        return frameIcon;
    }

    // Create settings popup
    function createPopup() {
        const popupId = 'torn-custom-bg-popup';
        let popup = document.getElementById(popupId);
        if (popup) return popup;

        popup = document.createElement('div');
        popup.id = popupId;
        Object.assign(popup.style, {
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            zIndex: '9998',
            width: '300px',
            backgroundColor: 'rgba(30, 30, 35, 0.95)',
            border: '1px solid #444',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
            display: 'none',
            backdropFilter: 'blur(5px)'
        });

        // Title
        const title = document.createElement('h3');
        title.textContent = 'Custom Background';
        Object.assign(title.style, {
            marginTop: '0',
            color: '#ddd',
            fontSize: '18px',
            borderBottom: '1px solid #444',
            paddingBottom: '10px'
        });
        popup.appendChild(title);

        // Input container
        const inputContainer = document.createElement('div');
        inputContainer.style.margin = '15px 0';

        // URL input
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Paste image URL here';
        input.value = savedUrl;
        Object.assign(input.style, {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#1a1a1a',
            border: '1px solid #444',
            color: '#fff',
            borderRadius: '4px'
        });
        inputContainer.appendChild(input);

        // Transparency slider
        const transparencyContainer = document.createElement('div');
        transparencyContainer.style.marginBottom = '15px';
        
        const transparencyLabel = document.createElement('label');
        transparencyLabel.textContent = 'Transparency:';
        Object.assign(transparencyLabel.style, {
            display: 'block',
            color: '#ddd',
            marginBottom: '5px'
        });
        transparencyContainer.appendChild(transparencyLabel);
        
        const transparencySlider = document.createElement('input');
        transparencySlider.type = 'range';
        transparencySlider.min = '0';
        transparencySlider.max = '1';
        transparencySlider.step = '0.05';
        transparencySlider.value = savedOpacity;
        Object.assign(transparencySlider.style, {
            width: '100%',
            height: '5px',
            borderRadius: '5px',
            outline: 'none'
        });
        transparencyContainer.appendChild(transparencySlider);
        
        const transparencyValue = document.createElement('span');
        transparencyValue.textContent = Math.round(savedOpacity * 100) + '%';
        Object.assign(transparencyValue.style, {
            display: 'inline-block',
            marginLeft: '10px',
            color: '#ddd',
            width: '40px'
        });
        transparencyContainer.appendChild(transparencyValue);
        
        transparencySlider.addEventListener('input', () => {
            transparencyValue.textContent = Math.round(transparencySlider.value * 100) + '%';
        });
        
        inputContainer.appendChild(transparencyContainer);

        // Button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        // Apply button
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply';
        Object.assign(applyButton.style, {
            flex: '1',
            padding: '8px',
            backgroundColor: '#2c89d9',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
        });

        // Clear button
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear';
        Object.assign(clearButton.style, {
            flex: '1',
            padding: '8px',
            backgroundColor: '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        });

        buttonContainer.appendChild(applyButton);
        buttonContainer.appendChild(clearButton);
        inputContainer.appendChild(buttonContainer);
        popup.appendChild(inputContainer);

        // Preview
        const previewTitle = document.createElement('div');
        previewTitle.textContent = 'Preview:';
        Object.assign(previewTitle.style, {
            color: '#aaa',
            marginTop: '10px',
            marginBottom: '5px'
        });
        popup.appendChild(previewTitle);

        const previewImg = document.createElement('img');
        Object.assign(previewImg.style, {
            maxWidth: '100%',
            maxHeight: '150px',
            border: '1px solid #333',
            borderRadius: '4px',
            display: savedUrl ? 'block' : 'none',
            opacity: savedOpacity
        });
        previewImg.src = savedUrl || '';
        popup.appendChild(previewImg);

        // Update preview opacity when slider changes
        transparencySlider.addEventListener('input', () => {
            previewImg.style.opacity = transparencySlider.value;
        });

        // Close button
        const closeButton = document.createElement('div');
        closeButton.textContent = '×';
        Object.assign(closeButton.style, {
            position: 'absolute',
            top: '10px',
            right: '15px',
            color: '#aaa',
            fontSize: '24px',
            cursor: 'pointer',
            lineHeight: '1'
        });
        closeButton.addEventListener('click', () => {
            popup.style.display = 'none';
            document.getElementById(frameIconId).style.opacity = '0.7';
        });
        popup.appendChild(closeButton);

        // Event listeners
        input.addEventListener('input', () => {
            const val = input.value.trim();
            previewImg.style.display = val ? 'block' : 'none';
            if (val) previewImg.src = val;
        });

        applyButton.addEventListener('click', () => {
            const url = input.value.trim();
            const opacity = transparencySlider.value;
            if (url) {
                localStorage.setItem('tornWebBgUrl', url);
                localStorage.setItem('tornWebBgOpacity', opacity);
                setBackground(url, opacity);
                applyButton.textContent = '✓ Applied!';
                setTimeout(() => {
                    applyButton.textContent = 'Apply';
                    popup.style.display = 'none';
                    document.getElementById(frameIconId).style.opacity = '0.7';
                }, 1500);
            }
        });

        clearButton.addEventListener('click', () => {
            input.value = '';
            transparencySlider.value = '0.8';
            transparencyValue.textContent = '80%';
            localStorage.removeItem('tornWebBgUrl');
            localStorage.removeItem('tornWebBgOpacity');
            setBackground('');
            previewImg.style.display = 'none';
            clearButton.textContent = '✓ Cleared!';
            setTimeout(() => {
                clearButton.textContent = 'Clear';
                popup.style.display = 'none';
                document.getElementById(frameIconId).style.opacity = '0.7';
            }, 1500);
        });

        document.body.appendChild(popup);
        return popup;
    }

    // Initialize
    function init() {
        createBackgroundElement();
        setBackground(savedUrl, savedOpacity);
        const frameIcon = createFrameIcon();
        let popup = null;

        frameIcon.addEventListener('mouseleave', () => {
            if (!popup || popup.style.display === 'none') {
                frameIcon.style.opacity = '0.7';
            }
        });

        frameIcon.addEventListener('click', () => {
            popup = popup || createPopup();
            popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
            frameIcon.style.opacity = popup.style.display === 'block' ? '1' : '0.7';
        });

        // Ensure background stays on top during navigation
        document.addEventListener('spa:page-change', () => {
            setBackground(localStorage.getItem('tornWebBgUrl') || '', localStorage.getItem('tornWebBgOpacity') || '0.8');
        });
    }

    // Start when elements are available
    if (document.body) {
        init();
    } else {
        const observer = new MutationObserver(() => {
            if (document.body) {
                observer.disconnect();
                init();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }
})();
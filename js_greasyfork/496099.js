// ==UserScript==
// @name         Vadapav Utils
// @namespace    ff-utils@vadapav
// @version      1.0
// @description  Utility to enhance Vadapav experience
// @author       im.nbn
// @match        *://*.vadapav.mov/*
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496099/Vadapav%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/496099/Vadapav%20Utils.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const defaultSettings = {
      openInIcon: '↗',
      copyIcon: '🔗',
      downloadIcon: '↓',
      checkIcon: '✔︎',
      urlOpenerPrefix: 'iina://open?url=',
      horizontalIcon: '↔',
      verticalIcon: '↕',
      autoOpenIn: false,
      linkSeparator: '\n',
      containerOrientation: 'vertical',
    };

    let openInIcon = localStorage.getItem('openInIcon') || defaultSettings.openInIcon;
    let copyIcon = localStorage.getItem('copyIcon') || defaultSettings.copyIcon;
    let downloadIcon = localStorage.getItem('downloadIcon') || defaultSettings.downloadIcon;
    let urlOpenerPrefix = localStorage.getItem('urlOpenerPrefix') || defaultSettings.urlOpenerPrefix;
    let autoOpenIn = localStorage.getItem('autoOpenIn') === 'true';
    let linkSeparator = localStorage.getItem('linkSeparator') || defaultSettings.linkSeparator;
    let containerOrientation = localStorage.getItem('containerOrientation') || defaultSettings.containerOrientation;

    let isOpenInMode = false;

    function toggleOpenerLinks(forceEnable) {
        isOpenInMode = forceEnable !== undefined ? forceEnable : !isOpenInMode;

        document.querySelectorAll('a.file-entry.wrap').forEach(anchor => {
            if (isOpenInMode) {
                if (!anchor.href.startsWith(urlOpenerPrefix)) {
                    anchor.href = `${urlOpenerPrefix}${anchor.href}`;
                }
            } else {
                if (anchor.href.startsWith(urlOpenerPrefix)) {
                    anchor.href = anchor.href.replace(urlOpenerPrefix, '');
                }
            }
        });

        openinButton.style.backgroundColor = isOpenInMode ? '#28a745' : '#666';
    }

    function copyLinksToClipboard() {
        const links = Array.from(document.querySelectorAll('a.file-entry.wrap'))
            .map(anchor => anchor.href.replace(urlOpenerPrefix, ''))
            .join(linkSeparator);

        const textarea = document.createElement('textarea');
        textarea.value = links;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        animateButton(copyButton, defaultSettings.checkIcon); 
    }

    function downloadAllFiles() {
        document.querySelectorAll('a.file-entry.wrap').forEach(anchor => {
            const link = document.createElement('a');
            link.href = anchor.href.replace(urlOpenerPrefix, '');
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        animateButton(downloadAllButton, defaultSettings.checkIcon);
    }

    function animateButton(button, symbol) {
        const originalContent = button.innerHTML;
        button.classList.add('rotate-icon');
        setTimeout(() => {
            button.innerHTML = symbol;
            button.style.backgroundColor = '#28a745';
            button.classList.remove('rotate-icon');
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.style.backgroundColor = '#666';
            }, 1000);
        }, 500);
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .button-bounce {
            transition: transform 0.2s ease-in-out;
        }

        .button-bounce:hover {
            transform: scale(1.1);
        }

        .rotate-icon {
            animation: rotate 0.5s linear;
        }

        @keyframes rotate {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .draggable {
            cursor: move;
        }

        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            cursor: move;
            z-index: 1;
            display: none;
        }

        label {
            user-select: none;
        }
    `;
    document.head.appendChild(style);

    const container = createContainer('containerTop', 'containerLeft', '10000');
    const buttonStyle = `
        background-color: #666;
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
        font-size: 16px;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s;
    `;

    const openinButton = createButton(openInIcon, buttonStyle, 'Toggle Opener', () => toggleOpenerLinks());
    const copyButton = createButton(copyIcon, buttonStyle, 'Copy links to clipboard', copyLinksToClipboard);
    const downloadAllButton = createButton(downloadIcon, buttonStyle, 'Download all files', downloadAllFiles);
    const editButton = createButton('✎', buttonStyle, 'Edit settings', toggleSettings);

    container.append(openinButton, copyButton, downloadAllButton, editButton);
    document.body.appendChild(container);

    let settingsContainer;

    function toggleSettings() {
        if (settingsContainer) {
            document.body.removeChild(settingsContainer);
            settingsContainer = null;
            editButton.innerHTML = '✎'; 
        } else {
            settingsContainer = createSettingsContainer();
            document.body.appendChild(settingsContainer);
            editButton.innerHTML = '✖';
            makeDraggable(settingsContainer, 'settingsContainerTop', 'settingsContainerLeft');
            initializeSettingsContainerPosition(settingsContainer);
        }
    }

    function createButton(innerHTML, style, title, onClick) {
        const button = document.createElement('button');
        button.innerHTML = innerHTML;
        button.style = style;
        button.classList.add('button-bounce');
        button.title = title;
        button.onclick = onClick;
        return button;
    }

    function createContainer(topKey, leftKey, zIndex) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = localStorage.getItem(topKey) || '50px';
        container.style.left = localStorage.getItem(leftKey) || 'calc(100% - 60px)';
        container.style.zIndex = zIndex;
        container.style.backgroundColor = '#444';
        container.style.border = '1px solid #555';
        container.style.padding = '10px 15px';
        container.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.5)';
        container.style.borderRadius = '10px';
        container.style.display = 'flex';
        container.style.flexDirection = containerOrientation === 'vertical' ? 'column' : 'row';
        container.style.gap = '10px';
        container.classList.add('draggable');
        makeDraggable(container, topKey, leftKey);
        return container;
    }

    function createSettingsContainer() {
        const settingsContainer = document.createElement('div');
        settingsContainer.style.position = 'fixed';
        settingsContainer.style.top = localStorage.getItem('settingsContainerTop') || '100px';
        settingsContainer.style.left = localStorage.getItem('settingsContainerLeft') || 'calc(100% - 280px)';
        settingsContainer.style.zIndex = '10001';
        settingsContainer.style.backgroundColor = '#444';
        settingsContainer.style.border = '1px solid #555';
        settingsContainer.style.padding = '20px';
        settingsContainer.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.5)';
        settingsContainer.style.borderRadius = '10px';
        settingsContainer.style.display = 'flex';
        settingsContainer.style.flexDirection = 'column';
        settingsContainer.style.gap = '10px';

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        settingsContainer.appendChild(overlay);

        const inputStyle = `
            background-color: white;
            border: 1px solid #ccc;
            padding: 8px;
            font-size: 14px;
            border-radius: 5px;
            width: 100%;
            box-sizing: border-box;
        `;

        settingsContainer.append(
            createInput('text', openInIcon, 'OpenIn Icon', inputStyle, val => openInIcon = val),
            createInput('text', copyIcon, 'Copy Icon', inputStyle, val => copyIcon = val),
            createInput('text', downloadIcon, 'Download Icon', inputStyle, val => downloadIcon = val),
            createInput('text', urlOpenerPrefix, 'iina://open?url=', inputStyle, val => urlOpenerPrefix = val),
            createAutoOpenInLabel(),
            createSeparatorLabel(inputStyle),
            createOrientationButton(buttonStyle),
            createSaveButton(buttonStyle)
        );

        return settingsContainer;
    }

    function createInput(type, value, placeholder, style, onChange) {
        const input = document.createElement('input');
        input.type = type;
        input.value = value;
        input.placeholder = placeholder;
        input.style = style;
        input.oninput = () => onChange(input.value);
        return input;
    }

    function createAutoOpenInLabel() {
        const autoOpenInLabel = document.createElement('label');
        const autoOpenInCheckbox = document.createElement('input');
        autoOpenInCheckbox.type = 'checkbox';
        autoOpenInCheckbox.checked = autoOpenIn;
        autoOpenInLabel.style = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        autoOpenInLabel.appendChild(autoOpenInCheckbox);
        autoOpenInLabel.appendChild(document.createTextNode('Auto apply opener prefix'));

        autoOpenInCheckbox.onchange = () => {
            autoOpenIn = autoOpenInCheckbox.checked;
            localStorage.setItem('autoOpenIn', autoOpenIn);
            toggleOpenerLinks(autoOpenIn);
        };

        return autoOpenInLabel;
    }

function createSeparatorLabel(inputStyle) {
    const separatorLabel = document.createElement('label');
    const separatorSelect = document.createElement('select');
    const separatorOptions = [
        { value: '\n', label: 'New Line (\\n)' },
        { value: ',', label: 'Comma (,)' },
        { value: ';', label: 'Semi-Colon (;)' },
        { value: 'custom', label: 'Custom' }
    ];

    separatorOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.label;
        if (linkSeparator === option.value) {
            opt.selected = true;
        }
        separatorSelect.appendChild(opt);
    });

    const customSeparatorInput = document.createElement('input');
    customSeparatorInput.type = 'text';
    customSeparatorInput.placeholder = 'Custom Separator';
    customSeparatorInput.style = inputStyle;
    customSeparatorInput.value = linkSeparator;

    separatorSelect.onchange = () => {
        if (separatorSelect.value === 'custom') {
            customSeparatorInput.style.display = 'block';
            linkSeparator = customSeparatorInput.value;
        } else {
            customSeparatorInput.style.display = 'none';
            linkSeparator = separatorSelect.value;
        }
        localStorage.setItem('linkSeparator', linkSeparator);
    };

    customSeparatorInput.oninput = () => {
        linkSeparator = customSeparatorInput.value;
        localStorage.setItem('linkSeparator', linkSeparator);
    };

    if (linkSeparator !== '\n' && linkSeparator !== ',' && linkSeparator !== ';') {
        separatorSelect.value = 'custom';
        customSeparatorInput.style.display = 'block';
    } else {
        customSeparatorInput.style.display = 'none';
    }

    separatorLabel.style = `
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    `;
    separatorLabel.appendChild(document.createTextNode('Link Separator for download'));
    separatorLabel.appendChild(separatorSelect);
    separatorLabel.appendChild(customSeparatorInput);

    return separatorLabel;
}

    function createOrientationButton(buttonStyle) {
        const toggleOrientationButton = createButton(
            containerOrientation === 'vertical' ? defaultSettings.verticalIcon : defaultSettings.horizontalIcon,
            buttonStyle,
            'Toggle Orientation',
            () => {
                toggleOrientation();
                toggleOrientationButton.innerHTML = containerOrientation === 'vertical' ? defaultSettings.verticalIcon : defaultSettings.horizontalIcon;
            }
        );
        return toggleOrientationButton;
    }

    function createSaveButton(buttonStyle) {
        const saveButton = document.createElement('button');
        saveButton.innerHTML = 'Save';
        saveButton.style = `
            background-color: #28a745;
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
            font-size: 16px;
            border-radius: 5px;
        `;
        saveButton.onclick = () => {
            localStorage.setItem('openInIcon', openInIcon);
            localStorage.setItem('copyIcon', copyIcon);
            localStorage.setItem('downloadIcon', downloadIcon);
            localStorage.setItem('urlOpenerPrefix', urlOpenerPrefix);

            openinButton.innerHTML = openInIcon;
            copyButton.innerHTML = copyIcon;
            downloadAllButton.innerHTML = downloadIcon;

            document.body.removeChild(settingsContainer);
            settingsContainer = null; 
            editButton.innerHTML = '✎'; 
        };

        return saveButton;
    }

    function toggleOrientation() {
        containerOrientation = containerOrientation === 'vertical' ? 'horizontal' : 'vertical';
        container.style.flexDirection = containerOrientation === 'vertical' ? 'column' : 'row';

        const containerRect = container.getBoundingClientRect();
        if (containerRect.right > window.innerWidth) {
            container.style.left = (window.innerWidth - containerRect.width) + 'px';
        }
        if (containerRect.bottom > window.innerHeight) {
            container.style.top = (window.innerHeight - containerRect.height) + 'px';
        }

        localStorage.setItem('containerOrientation', containerOrientation);
        localStorage.setItem('containerTop', container.style.top);
        localStorage.setItem('containerLeft', container.style.left);
    }

    function makeDraggable(element, topKey, leftKey) {
        let offsetX = 0, offsetY = 0, initialMouseX = 0, initialMouseY = 0;

        element.onmousedown = function (e) {
            if (['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
                return;
            }
            e.preventDefault();

            initialMouseX = e.clientX;
            initialMouseY = e.clientY;
            offsetX = initialMouseX - element.getBoundingClientRect().left;
            offsetY = initialMouseY - element.getBoundingClientRect().top;

            document.onmousemove = function (e) {
                e.preventDefault();
                const newMouseX = e.clientX;
                const newMouseY = e.clientY;

                let newTop = newMouseY - offsetY;
                let newLeft = newMouseX - offsetX;

                if (newTop < 0) newTop = 0;
                if (newLeft < 0) newLeft = 0;
                if (newTop + element.clientHeight > window.innerHeight) {
                    newTop = window.innerHeight - element.clientHeight;
                }
                if (newLeft + element.clientWidth > window.innerWidth) {
                    newLeft = window.innerWidth - element.clientWidth;
                }

                element.style.top = newTop + 'px';
                element.style.left = newLeft + 'px';

                localStorage.setItem(topKey, element.style.top);
                localStorage.setItem(leftKey, element.style.left);
            };

            document.onmouseup = function () {
                document.onmouseup = null;
                document.onmousemove = null;
            };
        };
    }

    function initializeSettingsContainerPosition(settingsContainer) {
        const settingsLeftPercent = localStorage.getItem('settingsContainerLeftPercent') || 'calc(100% - 280px)';
        const settingsTopPercent = localStorage.getItem('settingsContainerTopPercent') || '100px';
        settingsContainer.style.left = `${settingsLeftPercent}%`;
        settingsContainer.style.top = `${settingsTopPercent}%`;
    }

    if (autoOpenIn) {
        toggleOpenerLinks(true);
    }

    window.addEventListener('resize', () => {
        const containerLeftPercent = localStorage.getItem('containerLeftPercent');
        const containerTopPercent = localStorage.getItem('containerTopPercent');

        if (containerLeftPercent !== null && containerTopPercent !== null) {
            container.style.left = `${containerLeftPercent}%`;
            container.style.top = `${containerTopPercent}%`;
        }

        const settingsLeftPercent = localStorage.getItem('settingsContainerLeftPercent');
        const settingsTopPercent = localStorage.getItem('settingsContainerTopPercent');

        if (settingsContainer && settingsLeftPercent !== null && settingsTopPercent !== null) {
            settingsContainer.style.left = `${settingsLeftPercent}%`;
            settingsContainer.style.top = `${settingsTopPercent}%`;
        }

        keepWithinBounds(container);
        if (settingsContainer) {
            keepWithinBounds(settingsContainer);
        }
    });

    function keepWithinBounds(element) {
        const rect = element.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            element.style.left = (window.innerWidth - rect.width) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            element.style.top = (window.innerHeight - rect.height) + 'px';
        }
    }

    container.addEventListener('mouseup', saveContainerPosition);
    if (settingsContainer) {
        settingsContainer.addEventListener('mouseup', saveSettingsContainerPosition);
    }

    function saveContainerPosition() {
        const containerRect = container.getBoundingClientRect();
        const containerLeftPercent = (containerRect.left / window.innerWidth) * 100;
        const containerTopPercent = (containerRect.top / window.innerHeight) * 100;

        localStorage.setItem('containerLeftPercent', containerLeftPercent);
        localStorage.setItem('containerTopPercent', containerTopPercent);
    }

    function saveSettingsContainerPosition() {
        if (settingsContainer) {
            const settingsRect = settingsContainer.getBoundingClientRect();
            const settingsLeftPercent = (settingsRect.left / window.innerWidth) * 100;
            const settingsTopPercent = (settingsRect.top / window.innerHeight) * 100;

            localStorage.setItem('settingsContainerLeftPercent', settingsLeftPercent);
            localStorage.setItem('settingsContainerTopPercent', settingsTopPercent);
        }
    }

    if (autoOpenIn) {
        toggleOpenerLinks(true);
    }

    makeDraggable(container, 'containerTop', 'containerLeft');
    container.addEventListener('mouseup', saveContainerPosition);
    if (settingsContainer) {
        makeDraggable(settingsContainer, 'settingsContainerTop', 'settingsContainerLeft');
        settingsContainer.addEventListener('mouseup', saveSettingsContainerPosition);
    }

    window.addEventListener('resize', () => {
        const containerLeftPercent = localStorage.getItem('containerLeftPercent');
        const containerTopPercent = localStorage.getItem('containerTopPercent');

        if (containerLeftPercent !== null && containerTopPercent !== null) {
            container.style.left = `${containerLeftPercent}%`;
            container.style.top = `${containerTopPercent}%`;
        }

        const settingsLeftPercent = localStorage.getItem('settingsContainerLeftPercent');
        const settingsTopPercent = localStorage.getItem('settingsContainerTopPercent');

        if (settingsContainer && settingsLeftPercent !== null && settingsTopPercent !== null) {
            settingsContainer.style.left = `${settingsLeftPercent}%`;
            settingsContainer.style.top = `${settingsTopPercent}%`;
        }

        keepWithinBounds(container);
        if (settingsContainer) {
            keepWithinBounds(settingsContainer);
        }
    });

    function keepWithinBounds(element) {
        const rect = element.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            element.style.left = (window.innerWidth - rect.width) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            element.style.top = (window.innerHeight - rect.height) + 'px';
        }
    }

    if (settingsContainer) {
        initializeSettingsContainerPosition(settingsContainer);
    }
})();


// ==UserScript==
// @name         Mega.nz Link Combiner and Opener
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Автоэкстрактор ссылок mega.nz for LOLZteam
// @author       @ezbooz || zelenka.guru/ezbooz

// @match        https://zelenka.guru/forums/media-leaks18/*
// @match        https://lolz.live/forums/media-leaks18/*
// @match        https://lolz.guru/forums/media-leaks18/*

// @match        https://zelenka.guru/threads/*
// @match        https://lolz.live/threads/*
// @match        https://lolz.guru/threads/*

// @grant        GM_setValue
// @grant        GM_getValue


// @downloadURL https://update.greasyfork.org/scripts/519677/Meganz%20Link%20Combiner%20and%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/519677/Meganz%20Link%20Combiner%20and%20Opener.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const megaKeyPattern = /\b[\w-]{11,}\b/g;
    let autoOpenMode = GM_getValue('autoOpenMode', false);
    let openInNewWindow = GM_getValue('openInNewWindow', true);
    const domain = window.location.hostname;
    const requiredSections = ["Слив фотографий 18+", "Photo leaks 18+"];
    const sectionLink = document.querySelector("#pageDescription a");

    if (domain.includes('zelenka.guru') || domain.includes('lolz.live') || domain.includes('lolz.guru')) {
        if (window.location.href.includes('media-leaks18')) {
            createModeSwitchButtons();
        }
    }
    if (!sectionLink || !requiredSections.includes(sectionLink.textContent.trim())) {
        return;
    }



    function extractMegaLinksAndKeys() {
        const containers = document.querySelectorAll('.messageContent');
        const results = [];

        containers.forEach(container => {
            const links = container.querySelectorAll('a[href*="mega.nz"]');
            links.forEach(link => {
                const url = link.href;
                const textKeys = container.textContent.match(megaKeyPattern) || [];

                if (textKeys.length > 0) {
                    textKeys.forEach(key => {
                        const combinedUrl = `${url}#${key}`;

                        results.push({ combinedUrl: combinedUrl });
                    });
                }
            });
        });

        return results;
    }

    function showSidebar(results) {
        if (results.length === 0) return;

        const uniqueResults = [];
        const seenUrls = new Set();

        results.forEach(item => {
            if (!seenUrls.has(item.combinedUrl)) {
                uniqueResults.push(item);
                seenUrls.add(item.combinedUrl);
            }
        });

        if (uniqueResults.length === 0) return;

        const sidebar = document.createElement('div');
        sidebar.id = 'mega-sidebar';

        const style = document.createElement('style');
        style.textContent = `
            #mega-sidebar {
                position: fixed;
                top: 20%;
                right: 2%;
                transform: translateY(-50%);
                width: 280px;
                background: #1e1e1e;
                color: #fff;
                font-family: 'Arial', sans-serif;
                font-size: 14px;
                border-radius: 5px;
                box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
                z-index: 10000;
                padding: 10px;
            }
            #mega-sidebar-header {
                font-size: 23px;
                font-weight: bold;
                margin-bottom: 10px;
                text-align: center;
                border-bottom: 1px solid #444;
                padding-bottom: 10px;
            }
            .mega-sidebar-item {
                margin-bottom: 10px;
                background: #2a2a2a;
                border-radius: 5px;
                border: 1px solid #444;
                padding: 5px;
            }
            .mega-sidebar-item a {
                display: inline-block;
                padding: 5px 10px;
                background: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 12px;
                text-align: center;
            }
            .mega-sidebar-item a:hover {
                background: #0056b3;
            }
            #mega-sidebar-close {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #dc3545;
                color: #fff;
                font-size: 8px;
                border: none;
                border-radius: 5px;
                padding: 5px 10px;
                cursor: pointer;
            }
            #mega-sidebar-close:hover {
                background: #a71d2a;
            }
            .mega-sidebar-item span {
                word-wrap: break-word;
                display: block;
                margin-bottom: 5px;
                font-size: 13px;
            }
            #mode-switch {
                margin-top: 10px;
                padding: 5px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);

        const header = document.createElement('div');
        header.id = 'mega-sidebar-header';
        header.textContent = 'LINK GENERATOR';

        const closeButton = document.createElement('button');
        closeButton.id = 'mega-sidebar-close';
        closeButton.textContent = 'X';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(sidebar);
            document.head.removeChild(style);
        });

        const modeSwitch = document.createElement('div');
        modeSwitch.id = 'mode-switch';
        const label = document.createElement('label');
        label.textContent = 'Режим автооткрытия ссылок: ';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = autoOpenMode;
        checkbox.addEventListener('change', () => {
            autoOpenMode = checkbox.checked;
            GM_setValue('autoOpenMode', autoOpenMode);
            if (autoOpenMode) {
                openLinksAutomatically(results);
            }
        });

        label.appendChild(checkbox);
        modeSwitch.appendChild(label);

        const spacer = document.createElement('div');
        spacer.style.marginBottom = '10px';
        modeSwitch.appendChild(spacer);

        const openModeLabel = document.createElement('label');
        openModeLabel.textContent = 'Открывать в новом окне: ';
        const openModeCheckbox = document.createElement('input');
        openModeCheckbox.type = 'checkbox';
        openModeCheckbox.checked = openInNewWindow;
        openModeCheckbox.addEventListener('change', () => {
            openInNewWindow = openModeCheckbox.checked;
            GM_setValue('openInNewWindow', openInNewWindow);
            updateLinksTarget();
        });

        openModeLabel.appendChild(openModeCheckbox);
        modeSwitch.appendChild(openModeLabel);

        sidebar.appendChild(closeButton);
        sidebar.appendChild(header);
        sidebar.appendChild(modeSwitch);

        uniqueResults.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'mega-sidebar-item';

            const linkText = document.createElement('span');
            linkText.textContent = item.combinedUrl;

            const openButton = document.createElement('a');
            openButton.href = item.combinedUrl;
            openButton.target = openInNewWindow ? '_blank' : '_self';
            openButton.textContent = 'Открыть ссылку';
            openButton.addEventListener('click', (event) => {
                if (autoOpenMode) {
                    event.preventDefault();
                    if (openInNewWindow) {
                        window.open(item.combinedUrl, '_blank');
                    } else {
                        window.location.replace(item.combinedUrl);
                    }
                }
            });

            itemDiv.appendChild(linkText);
            itemDiv.appendChild(openButton);
            sidebar.appendChild(itemDiv);
        });

        document.body.appendChild(sidebar);

        if (autoOpenMode) {
            openLinksAutomatically(results);
        }
    }

    function openLinksAutomatically(results) {
        results.forEach(item => {
            if (openInNewWindow) {
                window.open(item.combinedUrl, '_blank');
            } else {
                window.location.replace(item.combinedUrl);
            }
        });
    }

    function createModeSwitchButtons() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '100px';
        container.style.right = '80px';
        container.style.zIndex = 10000;
        container.style.backgroundColor = '#444';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';

        const autoOpenLabel = document.createElement('label');
        autoOpenLabel.textContent = 'Автооткрытие ссылок:';
        const autoOpenCheckbox = document.createElement('input');
        autoOpenCheckbox.type = 'checkbox';
        autoOpenCheckbox.checked = autoOpenMode;
        autoOpenCheckbox.addEventListener('change', () => {
            autoOpenMode = autoOpenCheckbox.checked;
            GM_setValue('autoOpenMode', autoOpenMode);
            if (autoOpenMode) {
                openLinksAutomatically(extractMegaLinksAndKeys());
            }
        });
        autoOpenLabel.style.marginBottom = '10px';
        autoOpenLabel.appendChild(autoOpenCheckbox);
        container.appendChild(autoOpenLabel);

        const openModeLabel = document.createElement('label');
        openModeLabel.textContent = 'Открывать в новом окне:';
        const openModeCheckbox = document.createElement('input');
        openModeCheckbox.type = 'checkbox';
        openModeCheckbox.checked = openInNewWindow;
        openModeCheckbox.addEventListener('change', () => {
            openInNewWindow = openModeCheckbox.checked;
            GM_setValue('openInNewWindow', openInNewWindow);
            updateLinksTarget();
        });

        openModeLabel.appendChild(openModeCheckbox);
        container.appendChild(openModeLabel);

        document.body.appendChild(container);
    }

    function updateLinksTarget() {
        const links = document.querySelectorAll('.mega-sidebar-item a');
        links.forEach(link => {
            link.target = openInNewWindow ? '_blank' : '_self';
        });
    }

    window.addEventListener('load', () => {
        const results = extractMegaLinksAndKeys();
        if (results.length > 0) {
            showSidebar(results);
        }
    });
})();
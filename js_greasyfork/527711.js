// ==UserScript==
// @name         GoFile Bypass
// @version      1.0
// @description  GoFile Link Bypass
// @author       GameDrive.Org
// @match        *://gofile.io/*
// @icon         https://www.google.com/s2/favicons?domain=gofile.io
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/527711/GoFile%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/527711/GoFile%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('GoFile Link Extractor script is running...');

    let jsonData = null;
    let hasPermission = localStorage.getItem('gofile_open_permission') === 'true';

    const originalConsoleLog = console.log;
    console.log = function(...args) {
        originalConsoleLog.apply(console, args);
        args.forEach(arg => {
            if (typeof arg === 'object' && arg.status === 'ok' && arg.data && arg.data.children) {
                jsonData = arg;
                console.log = originalConsoleLog;
                useCapturedData();
            }
        });
    };

    function useCapturedData() {
        if (jsonData) {
            const links = Object.values(jsonData.data.children)
                .filter(item => item.type === 'file' && item.link)
                .map(item => item.link);
            displayLinks(links);
        }
    }

    function displayLinks(links) {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #181818;
            color: #fff;
            padding: 18px;
            border-radius: 12px;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.6);
            width: 90%;
            max-width: 450px;
            font-family: Arial, sans-serif;
            text-align: center;
            z-index: 9999;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Download Links';
        title.style.marginTop = '0';
        title.style.color = '#f8f9fa';
        container.appendChild(title);

        const textarea = document.createElement('textarea');
        textarea.value = links.join('\n');
        textarea.style.cssText = `
            width: 100%;
            background: #222;
            color: #ddd;
            border: none;
            border-radius: 8px;
            padding: 10px;
            min-height: 140px;
            font-size: 13px;
            resize: vertical;
            outline: none;
            transition: 0.3s;
        `;
        container.appendChild(textarea);

        function createButton(text, bgColor, hoverColor, onClick) {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.cssText = `
                width: auto;
                padding: 8px 16px;
                margin: 8px;
                border: none;
                border-radius: 6px;
                background: ${bgColor};
                color: #fff;
                font-size: 14px;
                cursor: pointer;
                transition: 0.3s;
            `;
            button.addEventListener('mouseenter', () => button.style.background = hoverColor);
            button.addEventListener('mouseleave', () => button.style.background = bgColor);
            button.addEventListener('click', onClick);
            return button;
        }

        const copyButton = createButton('Copy Links', '#007bff', '#0056b3', () => {
            navigator.clipboard.writeText(textarea.value).then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => copyButton.textContent = 'Copy Links', 2000);
            });
        });
        container.appendChild(copyButton);

        const openAllButton = createButton('Open All', '#28a745', '#218838', () => {
            if (!hasPermission) {
                if (confirm('Are you sure you want to open all links in new tabs?')) {
                    hasPermission = true;
                    localStorage.setItem('gofile_open_permission', 'true');
                } else {
                    return;
                }
            }
            links.forEach(link => window.open(link, '_blank'));
        });
        container.appendChild(openAllButton);

        const closeButton = createButton('Close', '#dc3545', '#a71d2a', () => document.body.removeChild(container));
        container.appendChild(closeButton);

        const footer = document.createElement('p');
        footer.textContent = 'Powered by GameDrive.Org';
        footer.style.cssText = `
            font-size: 12px;
            margin-top: 12px;
            color: #ffffff;
        `;
        container.appendChild(footer);

        document.body.appendChild(container);
    }
})();
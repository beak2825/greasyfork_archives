// ==UserScript==
// @name         Lucida Downloader
// @description  Download music from Spotify, Qobuz, Tidal, Soundcloud, Deezer, Amazon Music and Yandex Music via Lucida. Adds download buttons and floating button.
// @icon         https://raw.githubusercontent.com/afkarxyz/misc-scripts/refs/heads/main/lucida/lucida.png
// @version      2.0
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/misc-scripts/
// @supportURL   https://github.com/afkarxyz/misc-scripts/issues
// @license      MIT
// @match        https://open.spotify.com/*
// @match        https://listen.tidal.com/*
// @match        https://music.yandex.com/*
// @match        https://music.amazon.com/*
// @match        https://www.deezer.com/*
// @match        https://soundcloud.com/*
// @match        https://www.qobuz.com/*
// @match        https://lucida.to/*
// @match        https://lucida.su/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534039/Lucida%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/534039/Lucida%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DOMAINS = ['lucida.to', 'lucida.su'];

    const BASE_URL = 'https://raw.githubusercontent.com/afkarxyz/misc-scripts/refs/heads/main/lucida/';

    const LOGO_SVG = `<svg xml:space="preserve" width="48" height="28" viewBox="0 0 213.86 126.117" xmlns="http://www.w3.org/2000/svg"><g style="display:inline" transform="translate(-92.77 -153.171)"><ellipse class="st17" cx="199.7" cy="211.95" rx="103.93" ry="51" style="fill:#f42e8d;stroke:#fff;stroke-width:6;stroke-miterlimit:10"/><ellipse class="st18" cx="199.97" cy="211.95" rx="93.24" ry="41" style="fill:#f42e8d;stroke:#fff;stroke-width:3;stroke-miterlimit:10"/></g><path class="st19" style="fill:#fff;stroke:#fff;stroke-width:6;stroke-miterlimit:10" transform="translate(-92.77 -153.171)" d="M216.68 222.27v-8.79l2.1-2.21 5.4.25v10.75zM248.83 222.27v-8.79l2.1-2.21 5.4.25v10.75z"/><path class="st19" style="fill:#fff;stroke:#fff;stroke-width:6;stroke-miterlimit:10" transform="translate(-92.77 -153.171)" d="M216.68 223.56v-8.79l2.1-2.21 5.4.25v10.75zM125.12 237.48v-54.5l3.78-4.75h9.47v59.25zM139.86 204.18l3.75-3.28h7.36l-.18 16.25h9.01l.28-16.25h9.53l.25 36.58h-30zM171.18 204.4l3.65-3.5h23.6v12.19l-15.25.21v10.47l15.25-.05v13.76h-27.25zM199.97 200.9h12.5v36.59h-12.5z"/><path class="st19" style="fill:#fff;stroke:#fff;stroke-width:6;stroke-miterlimit:10" d="m214.09 204.41 4-3.51h14.44l-.25-17.14 3-5.53h9.92l.14 22.67v36.58h-31.25zM251.42 200.9h19.99l.25 4.25 3.49-4.25h6.35v36.58H247l-.25-32.08zM116.91 237.48v-54.5l3.78-4.75h9.47v59.25zM131.64 204.18l3.75-3.28h7.36l-.18 16.25h9.01l.29-16.25h9.52l.25 36.58h-30zM162.97 204.4l3.64-3.5h23.61v12.19l-15.25.21v10.47l15.25-.05v13.76h-27.25zM191.76 200.9h12.5v36.59h-12.5z" transform="translate(-92.77 -153.171)"/><path class="st19" style="fill:#fff;stroke:#fff;stroke-width:6;stroke-miterlimit:10" d="m205.88 204.41 4-3.51h14.43l-.25-17.14 3-5.53h9.93l.14 22.67v36.58h-31.25zM243.21 200.9h19.99l.24 4.25 3.5-4.25h6.34v36.58h-34.5l-.25-32.08zM162.97 204.4l3.64-3.5h23.61v12.19l-15.25.21v10.47l15.25-.05v13.76h-27.25zM131.64 204.18l3.75-3.28h7.36l-.18 16.25h9.01l.29-16.25h9.52l.25 36.58h-30z" transform="translate(-92.77 -153.171)"/><g transform="translate(-92.77 -153.171)"><path class="st19" style="fill:#fff;stroke:#fff;stroke-width:6;stroke-miterlimit:10" d="M216.68 222.27v-8.79l2.1-2.21 5.4.25v10.75zM248.83 222.27v-8.79l2.1-2.21 5.4.25v10.75z"/><path class="st19" style="fill:#fff;stroke:#fff;stroke-width:6;stroke-miterlimit:10" d="M216.68 223.56v-8.79l2.1-2.21 5.4.25v10.75z"/><circle class="st21" cx="279.8" cy="173.88" r="4.56" style="stroke:#fff;stroke-width:6;stroke-miterlimit:10"/><path class="st21" style="stroke:#fff;stroke-width:6;stroke-miterlimit:10" d="m132.88 255.72 2.83 4.71 5.1-1.26-3.34 4.17 2.83 4.71-4.9-2.13-3.35 4.17.32-5.49-4.91-2.14 5.1-1.25z"/><circle class="st21" cx="199.97" cy="236.84" r="5.62" style="stroke:#fff;stroke-width:6;stroke-miterlimit:10"/><ellipse class="st21" cx="184.25" cy="245.48" rx="3.38" ry="3.14" style="stroke:#fff;stroke-width:6;stroke-miterlimit:10"/><path class="st21" style="stroke:#fff;stroke-width:6;stroke-miterlimit:10" d="M216.68 223.77v-8.79l2.1-2.21 5.4.25v10.75zM248.83 223.77v-8.79l2.1-2.21 5.4.25v10.75zM194.48 175.23l4.06 3.92 4.72-2.6-2.21 5.03 4.06 3.92-5.43-.82-2.22 5.02-1.14-5.52-5.43-.82 4.73-2.6z"/></g><path class="st22" d="M21.66 110.899c-6.48-10.44 27.24-43.11 75.33-72.98 48.09-29.87 86.75-41.62 93.23-31.18 6.48 10.44-21.67 39.11-69.76 68.98-48.09 29.87-92.32 45.62-98.8 35.18z" style="fill:none;stroke:#fff;stroke-width:6;stroke-miterlimit:10"/><path class="st7" style="stroke:#000;stroke-width:3;stroke-miterlimit:10" d="M125.12 237.48v-54.5l3.78-4.75h9.47v59.25zM139.86 204.18l3.75-3.28h7.36l-.18 16.25h9.01l.28-16.25h9.53l.25 36.58h-30zM171.18 204.4l3.65-3.5h23.6v12.19l-15.25.21v10.47l15.25-.05v13.76h-27.25zM199.97 200.9h12.5v36.59h-12.5zM214.09 204.41l4-3.51h14.44l-.25-17.14 3-5.53h9.92l.14 22.67v36.58h-31.25zM251.42 200.9h19.99l.25 4.25 3.49-4.25h6.35v36.58H247l-.25-32.08z" transform="translate(-92.77 -153.171)"/><path class="st23" style="fill:#fff;stroke:#000;stroke-width:3;stroke-miterlimit:10" transform="translate(-92.77 -153.171)" d="m131.64 204.18 3.75-3.28h7.36l-.18 16.25h9.01l.29-16.25h9.52l.25 36.58h-30zM162.97 204.4l3.64-3.5h23.61v12.19l-15.25.21v10.47l15.25-.05v13.76h-27.25z"/><path class="st23" style="fill:#fff;stroke:#000;stroke-width:3;stroke-miterlimit:10" d="M98.99 47.729h12.5v36.59h-12.5z"/><path class="st23" style="fill:#fff;stroke:#000;stroke-width:3;stroke-miterlimit:10" transform="translate(-92.77 -153.171)" d="m205.88 204.41 4-3.51h14.43l-.25-17.14 3-5.53h9.93l.14 22.67v36.58h-31.25zM243.21 200.9h19.99l.24 4.25 3.5-4.25h6.34v36.58h-34.5l-.25-32.08z"/><circle class="st7" cx="190.62" cy="7.149" r="2.38" style="stroke:#000;stroke-width:3;stroke-miterlimit:10"/><circle class="st7" cx="187.03" cy="20.709" r="4.56" style="stroke:#000;stroke-width:3;stroke-miterlimit:10"/><path class="st7" style="stroke:#000;stroke-width:3;stroke-miterlimit:10" transform="translate(-92.77 -153.171)" d="m132.88 255.72 2.83 4.71 5.1-1.26-3.34 4.17 2.83 4.71-4.9-2.13-3.35 4.17.32-5.49-4.91-2.14 5.1-1.25z"/><circle class="st7" cx="107.2" cy="83.669" r="5.62" style="stroke:#000;stroke-width:3;stroke-miterlimit:10"/><ellipse class="st7" cx="91.48" cy="92.309" rx="3.38" ry="3.14" style="stroke:#000;stroke-width:3;stroke-miterlimit:10"/><path class="st7" style="stroke:#000;stroke-width:3;stroke-miterlimit:10" transform="translate(-92.77 -153.171)" d="m194.48 175.23 4.06 3.92 4.72-2.6-2.21 5.03 4.06 3.92-5.43-.82-2.22 5.02-1.14-5.52-5.43-.82 4.73-2.6zM248.83 223.77v-8.79l2.1-2.21 5.4.25v10.75zM216.68 223.77v-8.79l2.1-2.21 5.4.25v10.75z"/><path class="st9" d="M21.66 110.899c-6.48-10.44 27.24-43.11 75.33-72.98 48.09-29.87 86.75-41.62 93.23-31.18 6.48 10.44-21.67 39.11-69.76 68.98-48.09 29.87-92.32 45.62-98.8 35.18z" style="fill:none;stroke:#000;stroke-width:3;stroke-miterlimit:10"/><path class="st23" style="fill:#fff;stroke:#000;stroke-width:3;stroke-miterlimit:10" transform="translate(-92.77 -153.171)" d="m162.97 204.4 3.64-3.5h23.61v12.19l-15.25.21v10.47l15.25-.05v13.76h-27.25zM131.64 204.18l3.75-3.28h7.36l-.18 16.25h9.01l.29-16.25h9.52l.25 36.58h-30zM116.91 237.48v-54.5l3.78-4.75h9.47v59.25z"/></svg>`;
    
    const SERVICES = {
        '': { name: 'Disabled', icon: '' },
        'spotify': { 
            name: 'Spotify',
            icon: `${BASE_URL}spotify.png`
        },
        'qobuz': {
            name: 'Qobuz',
            icon: `${BASE_URL}qobuz.png`
        },
        'tidal': {
            name: 'Tidal',
            icon: `${BASE_URL}tidal.svg`
        },
        'soundcloud': {
            name: 'Soundcloud',
            icon: `${BASE_URL}soundcloud.ico`
        },
        'deezer': {
            name: 'Deezer',
            icon: `${BASE_URL}deezer.ico`
        },
        'amazon': {
            name: 'Amazon Music',
            icon: `${BASE_URL}amazon.png`
        },
        'yandex': {
            name: 'Yandex Music',
            icon: `${BASE_URL}yandex.png`
        }
    };

    GM_addStyle(`
        .lucida-modal *,
        .lucida-modal *::before,
        .lucida-modal *::after {
            all: initial;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
            font-weight: normal !important;
            font-size: 14px !important;
            color: #333;
        }
    
        .lucida-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-weight: normal;
        }
        
        .lucida-modal {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            max-width: 90%;
            color: #333;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-weight: normal !important;
        }
        
        .lucida-modal h2 {
            margin: 0 0 20px;
            color: #f42e8d;
            font-size: 18px !important;
            font-weight: 600 !important;
            line-height: 1.4;
        }
        
        .lucida-modal .preference-group {
            margin-bottom: 20px;
            color: #333;
        }
        
        .lucida-modal label {
            display: block;
            margin-top: 20px;
            margin-bottom: 8px;
            font-weight: 600 !important;
            font-size: 14px !important;
            color: #333;
        }

        .lucida-modal .header {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }

        .lucida-modal .header img {
            width: 64px;
            height: 64px;
            object-fit: contain;
        }

        .lucida-modal .header h2 {
            margin: 0;
        }
    
        .lucida-modal .preference-group label:first-child {
            margin-top: 0;
        }
        
        .lucida-modal select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            width: 100%;
            padding: 8px 32px 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E") calc(100% - 12px) center no-repeat;
            cursor: pointer;
            font-size: 14px !important;
            color: #333;
        }
        
        .lucida-modal select:hover {
            border-color: #f42e8d;
        }
        
        .lucida-modal select:focus {
            outline: none;
            border-color: #f42e8d;
            box-shadow: 0 0 0 2px rgba(244, 46, 141, 0.2);
        }
    
        .custom-options {
            scrollbar-width: thin;
            scrollbar-color: #f42e8d #f0f0f0;
            font-size: 14px !important;
        }
    
        .custom-options::-webkit-scrollbar {
            width: 8px;
        }
    
        .custom-options::-webkit-scrollbar-track {
            background: #f0f0f0;
            border-radius: 4px;
        }
    
        .custom-options::-webkit-scrollbar-thumb {
            background: #f42e8d;
            border-radius: 4px;
        }
    
        .custom-options::-webkit-scrollbar-thumb:hover {
            background: #d41d7a;
        }
        
        .service-select-wrapper {
            position: relative;
            margin-bottom: 15px;
        }
        
        .custom-select {
            width: 100%;
            padding: 8px 32px 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E") calc(100% - 12px) center no-repeat;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
            font-size: 14px !important;
            color: #333;
        }
    
        .custom-select span {
            font-size: 14px !important;
            color: #333;
        }
        
        .custom-select:hover {
            border-color: #f42e8d;
        }
        
        .custom-options {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-top: 4px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .custom-options.show {
            display: block;
        }
        
        .service-option {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            font-weight: normal !important;
            font-size: 14px !important;
            color: #333;
        }
    
        .service-option span {
            font-size: 14px !important;
            color: #333;
        }
        
        .service-option:hover {
            background-color: #f5f5f5;
        }
        
        .service-option img,
        .custom-select img {
            width: 16px;
            height: 16px;
            object-fit: contain;
        }
        
        .lucida-modal .buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }
        
        .lucida-modal button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
            font-size: 14px !important;
        }
        
        .lucida-modal .save-btn {
            background: linear-gradient(135deg, #f42e8d, #b91c68);
            color: white;
        }
        
        .lucida-modal .save-btn:hover {
            background: linear-gradient(135deg, #ff3d9c, #d02077);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(244, 46, 141, 0.4);
        }
        
        .lucida-modal .save-btn:active {
            transform: translateY(0);
            box-shadow: 0 1px 4px rgba(244, 46, 141, 0.4);
        }
        
        .lucida-modal .cancel-btn {
            background: #eee;
            color: #333;
        }
        
        .lucida-modal .cancel-btn:hover {
            background: #ddd;
            color: #333;
            transform: translateY(-1px);
        }
        
        .lucida-modal .cancel-btn:active {
            transform: translateY(0);
        }
    
        .floating-button {
            position: fixed;
            width: 80px;
            height: 80px;
            background-color: transparent;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: move;
            z-index: 9999;
            opacity: 0.3;
            transition: opacity 0.3s ease;
            border: none;
        }
    
        .floating-button:hover {
            opacity: 1;
        }
    
        .floating-button svg {
            width: 48px;
            height: auto;
            cursor: pointer;
        }
    
        [role='grid'] {
            margin-left: 50px;
        }
    
        [data-testid="tracklist-row"] {
            position: relative;
        }
    
        [role="presentation"] > * {
            contain: unset;
        }
    
        .btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 0;
            position: relative;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f42e8d, #b91c68);
        }
    
        .btn:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
    
        .btn .icon {
            width: 50%;
            height: 50%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="%23ffffff" d="M222.2 319.2c.5 .5 1.1 .8 1.8 .8s1.4-.3 1.8-.8L350.2 187.3c1.2-1.2 1.8-2.9 1.8-4.6c0-3.7-3-6.7-6.7-6.7L288 176c-8.8 0-16-7.2-16-16l0-120c0-4.4-3.6-8-8-8l-80 0c-4.4 0-8 3.6-8 8l0 120c0 8.8-7.2 16-16 16l-57.3 0c-3.7 0-6.7 3-6.7 6.7c0 1.7 .7 3.3 1.8 4.6L222.2 319.2zM224 352c-9.5 0-18.6-3.9-25.1-10.8L74.5 209.2C67.8 202 64 192.5 64 182.7c0-21.4 17.3-38.7 38.7-38.7l41.3 0 0-104c0-22.1 17.9-40 40-40l80 0c22.1 0 40 17.9 40 40l0 104 41.3 0c21.4 0 38.7 17.3 38.7 38.7c0 9.9-3.8 19.3-10.5 26.5L249.1 341.2c-6.5 6.9-15.6 10.8-25.1 10.8zM32 336l0 96c0 26.5 21.5 48 48 48l288 0c26.5 0 48-21.5 48-48l0-96c0-8.8 7.2-16 16-16s16 7.2 16 16l0 96c0 44.2-35.8 80-80 80L80 512c-44.2 0-80-35.8-80-80l0-96c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>');
        }
    
        [data-testid="tracklist-row"] .btn {
            position: absolute;
            top: 50%;
            right: 100%;
            margin-top: -20px;
            margin-right: 10px;
        }
    
        .N7GZp8IuWPJvCPz_7dOg .btn {
            width: 24px;
            height: 24px;
            transform-origin: center;
            position: absolute;
            top: 50%;
            right: 100%;
            margin-top: -12px !important;
            margin-right: 10px;
        }
    
        .N7GZp8IuWPJvCPz_7dOg .btn .icon {
            transform: scale(0.85);
            width: 65%;
            height: 65%;
        }
    `);

    function createServiceOption(value, service) {
        const option = document.createElement('div');
        option.className = 'service-option';
        option.dataset.value = value;
    
        if (service.icon) {
            const img = document.createElement('img');
            img.src = service.icon;
            img.alt = service.name;
            img.style.display = 'none';
            
            img.onload = () => {
                img.style.display = 'inline';
            };
            
            option.appendChild(img);
        }
    
        const span = document.createElement('span');
        span.textContent = service.name;
        option.appendChild(span);
        
        return option;
    }
    
    function updateCustomSelect(customSelect, value) {
        const service = SERVICES[value];
        let content = `<span>${service.name}</span>`;
        
        if (service.icon) {
            const img = new Image();
            img.src = service.icon;
            img.style.display = 'none';
            
            img.onload = () => {
                img.style.display = 'inline';
                customSelect.querySelector('img')?.style.setProperty('display', 'inline');
            };
            
            content = `<img src="${service.icon}" alt="${service.name}" style="display: none;"><span>${service.name}</span>`;
        }
        
        customSelect.innerHTML = content;
    }
    
    function createPreferencesModal() {
        const existingModal = document.querySelector('.lucida-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }
    
        const modalHTML = `
            <div class="lucida-modal-overlay">
                <div class="lucida-modal">
                    <div class="header">
                        <h2>Lucida Preferences</h2>
                        <img src="${BASE_URL}lucida.svg" alt="Lucida Icon" class="lucida-icon" style="cursor: pointer; margin-left: auto; display: none;">
                    </div>
                    <div class="preference-group">
                        <label for="domain-select">Domain</label>
                        <select id="domain-select">
                            <option value="random">Random</option>
                            <option value="lucida.to">Lucida.to</option>
                            <option value="lucida.su">Lucida.su</option>
                        </select>
                        
                        <label for="service-select">Service Resolver</label>
                        <select id="service-select">
                            <option value="">Disabled</option>
                            <option value="spotify">Spotify</option>
                            <option value="qobuz">Qobuz</option>
                            <option value="tidal">Tidal</option>
                            <option value="soundcloud">Soundcloud</option>
                            <option value="deezer">Deezer</option>
                            <option value="amazon">Amazon Music</option>
                            <option value="yandex">Yandex Music</option>
                        </select>
                        
                        <label for="format-select">Download Format</label>
                        <select id="format-select">
                            <option value="original">Original Format (Highest Quality)</option>
                            <option value="flac">FLAC</option>
                            <option value="mp3">MP3</option>
                            <option value="ogg-vorbis">OGG Vorbis</option>
                            <option value="opus">Opus</option>
                            <option value="m4a-aac">M4A AAC</option>
                            <option value="wav">WAV</option>
                            <option value="bitcrush">Bitcrush</option>
                        </select>
    
                        <div id="quality-settings-container" style="display: none; margin-top: 20px;">
                            <label for="quality-select" style="margin-top: 0;">Quality Settings</label>
                            <select id="quality-select"></select>
                        </div>
    
                        <label for="auto-download-select">Auto Download</label>
                        <select id="auto-download-select">
                            <option value="enabled">Enabled</option>
                            <option value="disabled">Disabled</option>
                        </select>
    
                        <label for="float-select">Float Icon</label>
                        <select id="float-select">
                            <option value="enabled">Enabled</option>
                            <option value="disabled">Disabled</option>
                        </select>
                    </div>
                    <div class="buttons">
                        <button class="cancel-btn">Cancel</button>
                        <button class="save-btn">Save</button>
                    </div>
                </div>
            </div>
        `;
    
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);
    
        const domainSelect = document.getElementById('domain-select');
        const serviceSelect = document.getElementById('service-select');
        const floatSelect = document.getElementById('float-select');
        const formatSelect = document.getElementById('format-select');
        const qualityContainer = document.getElementById('quality-settings-container');
        const qualitySelect = document.getElementById('quality-select');
        const autoDownloadSelect = document.getElementById('auto-download-select');
        const lucidaIcon = document.querySelector('.lucida-icon');
    
        lucidaIcon.onload = () => {
            lucidaIcon.style.display = 'inline';
        };
    
        lucidaIcon.onerror = () => {
            lucidaIcon.style.display = 'none';
        };
    
        lucidaIcon.addEventListener('click', () => {
            const domainPref = GM_getValue('domainPreference', 'random');
            let domain = domainPref === 'random' 
                ? DOMAINS[Math.floor(Math.random() * DOMAINS.length)]
                : domainPref;
            window.open(`https://${domain}/stats`, '_blank');
        });
    
        // Set saved values
        if (domainSelect) domainSelect.value = GM_getValue('domainPreference', 'random');
        if (serviceSelect) serviceSelect.value = GM_getValue('targetService', '');
        if (floatSelect) floatSelect.value = GM_getValue('floatIconEnabled', 'enabled');
        if (formatSelect) formatSelect.value = GM_getValue('formatPreference', 'original');
        if (autoDownloadSelect) autoDownloadSelect.value = GM_getValue('autoDownloadEnabled', 'enabled');
    
        function updateQualityOptions(format) {
            qualitySelect.innerHTML = '';
            
            switch(format) {
                case 'flac':
                    qualitySelect.innerHTML = '<option value="16">16-bit 44.1kHz</option>';
                    qualityContainer.style.display = 'block';
                    break;
                case 'mp3':
                case 'ogg-vorbis':
                case 'm4a-aac':
                    qualitySelect.innerHTML = `
                        <option value="320">320kb/s</option>
                        <option value="256">256kb/s</option>
                        <option value="192">192kb/s</option>
                        <option value="128">128kb/s</option>
                    `;
                    qualityContainer.style.display = 'block';
                    break;
                case 'opus':
                    qualitySelect.innerHTML = `
                        <option value="320">320kb/s</option>
                        <option value="256">256kb/s</option>
                        <option value="192">192kb/s</option>
                        <option value="128">128kb/s</option>
                        <option value="96">96kb/s</option>
                        <option value="64">64kb/s</option>
                    `;
                    qualityContainer.style.display = 'block';
                    break;
                default:
                    qualityContainer.style.display = 'none';
            }
        }
    
        updateQualityOptions(formatSelect.value);
        if (qualitySelect) {
            qualitySelect.value = GM_getValue('qualityPreference', '320');
        }
    
        formatSelect.addEventListener('change', () => {
            updateQualityOptions(formatSelect.value);
        });
    
        // Save button handler
        const saveBtn = document.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                if (domainSelect && serviceSelect && floatSelect && formatSelect && 
                    qualitySelect && autoDownloadSelect) {
                    GM_setValue('domainPreference', domainSelect.value);
                    GM_setValue('targetService', serviceSelect.value);
                    GM_setValue('floatIconEnabled', floatSelect.value);
                    GM_setValue('formatPreference', formatSelect.value);
                    GM_setValue('qualityPreference', qualitySelect.value);
                    GM_setValue('autoDownloadEnabled', autoDownloadSelect.value);
                    
                    const floatingButton = document.querySelector('.floating-button');
                    if (floatingButton) {
                        floatingButton.style.display = floatSelect.value === 'enabled' ? 'flex' : 'none';
                    }
                }
                document.querySelector('.lucida-modal-overlay').remove();
            });
        }
    
        // Cancel button handler
        const cancelBtn = document.querySelector('.cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                document.querySelector('.lucida-modal-overlay').remove();
            });
        }
    
        // Modal overlay click handler
        const modalOverlay = document.querySelector('.lucida-modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    modalOverlay.remove();
                }
            });
        }
    }

    function autoSelectFormat() {
        if (!window.location.hostname.includes('lucida.')) return;

        const selectFormatAndQuality = () => {
            const convertSelect = document.getElementById('convert');
            if (!convertSelect) return;

            const format = GM_getValue('formatPreference', 'original');
            const quality = GM_getValue('qualityPreference', '320');

            convertSelect.value = format;
            convertSelect.dispatchEvent(new Event('change', { bubbles: true }));

            const observer = new MutationObserver((mutations, obs) => {
                const downsettingSelect = document.getElementById('downsetting');
                if (downsettingSelect) {
                    downsettingSelect.value = quality;
                    downsettingSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    obs.disconnect();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        };

        if (document.getElementById('convert')) {
            selectFormatAndQuality();
        }

        const pageObserver = new MutationObserver((mutations) => {
            if (document.getElementById('convert')) {
                selectFormatAndQuality();
            }
        });

        pageObserver.observe(document.body, { childList: true, subtree: true });
    }

    function autoDownload() {
        if (!window.location.hostname.includes('lucida.')) return;
        if (GM_getValue('autoDownloadEnabled', 'enabled') !== 'enabled') return;

        const clickDownloadButton = () => {
            const button = document.querySelector('.d1-track button') || 
                          document.querySelector('button[class*="download-button"]');
            
            if (button) {
                button.click();
            }
        };

        const observer = new MutationObserver((mutations) => {
            clickDownloadButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        clickDownloadButton();
    }
    
    function setupMenuCommand() {
        try {
            GM_registerMenuCommand('Lucida Preferences', () => {
                console.log('Opening preferences modal...');
                createPreferencesModal();
            });
        } catch (error) {
            console.error('Error registering menu command:', error);
        }
    }
    
    function openInLucida(trackUrl) {
        const currentUrl = encodeURIComponent(trackUrl || window.location.href);
        const prefs = getPreferences();
        
        let domain = prefs.domainPreference === 'random' 
            ? DOMAINS[Math.floor(Math.random() * DOMAINS.length)]
            : prefs.domainPreference;
        
        let url = `https://${domain}/?url=${currentUrl}&country=auto`;
        if (prefs.targetService) {
            url += `&to=${prefs.targetService}`;
        }
        
        window.open(url, '_blank');
    }
    
    const getPreferences = () => ({
        targetService: GM_getValue('targetService', ''),
        domainPreference: GM_getValue('domainPreference', 'random')
    });
    
    function addButton(el) {
        const button = document.createElement('button');
        button.className = 'btn';
        
        const icon = document.createElement('div');
        icon.className = 'icon';
        
        button.appendChild(icon);
        el.appendChild(button);
        
        return button;
    }
    
    function addNowPlayingButton() {
        const downloadButton = document.createElement('button');
        downloadButton.className = 'Lucida-Button-sc-1dqy6lx-0 dmdXQN';
        downloadButton.innerHTML = '<span aria-hidden="true" class="IconWrapper__Wrapper-sc-16usrgb-0 hYdsxw"><svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 448 512" class="Svg-sc-ytk21e-0 dYnaPI" width="24" height="24" fill="currentColor"><path d="M114.2 192L224 302 333.8 192 280 192c-13.3 0-24-10.7-24-24l0-120-64 0 0 120c0 13.3-10.7 24-24 24l-53.8 0zM224 352c-11.5 0-22.5-4.6-30.6-12.7L77.6 223.2C68.9 214.5 64 202.7 64 190.4c0-25.6 20.8-46.4 46.4-46.4l33.6 0 0-96c0-26.5 21.5-48 48-48l64 0c26.5 0 48 21.5 48 48l0 96 33.6 0c25.6 0 46.4 20.8 46.4 46.4c0 12.3-4.9 24.1-13.6 32.8L254.6 339.3c-8.1 8.1-19.1 12.7-30.6 12.7zM48 344l0 80c0 22.1 17.9 40 40 40l272 0c22.1 0 40-17.9 40-40l0-80c0-13.3 10.7-24 24-24s24 10.7 24 24l0 80c0 48.6-39.4 88-88 88L88 512c-48.6 0-88-39.4-88-88l0-80c0-13.3 10.7-24 24-24s24 10.7 24 24z"/></svg></span>';
    
        downloadButton.style.cssText = 'background:transparent;border:none;color:#f42e8d;cursor:pointer;padding:8px;margin:0 4px;transition:transform .2s ease';
    
        downloadButton.onmouseover = () => downloadButton.style.transform = 'scale(1.1)';
        downloadButton.onmouseout = () => downloadButton.style.transform = 'scale(1)';
    
        downloadButton.onclick = () => {
            const link = document.querySelector('a[href*="spotify:track:"]');
            if (link) {
                const match = link.getAttribute('href').match(/spotify:track:([a-zA-Z0-9]+)/);
                if (match) {
                    const trackUrl = `https://open.spotify.com/track/${match[1]}`;
                    openInLucida(trackUrl);
                }
            }
        };
    
        const container = document.querySelector('.snFK6_ei0caqvFI6As9Q')?.querySelector('.deomraqfhIAoSB3SgXpu');
        if (container && !container.querySelector('.Lucida-Button-sc-1dqy6lx-0')) {
            container.appendChild(downloadButton);
        }
    }

    function animate() {
        const currentUrl = window.location.href;
        const urlParts = currentUrl.split('/');
        const type = urlParts[3];
    
        addNowPlayingButton();
    
        if (type === 'track') {
            const actionBarRow = document.querySelector('.eSg4ntPU2KQLfpLGXAww[data-testid="action-bar-row"]');
            if (actionBarRow && !actionBarRow.hasButtons) {
                const downloadButton = addButton(actionBarRow);
                downloadButton.onclick = function() {
                    const spotifyId = urlParts[4].split('?')[0];
                    openInLucida(`https://open.spotify.com/track/${spotifyId}`);
                }
                actionBarRow.hasButtons = true;
            }
        }
    
        if (type === 'artist') {
            const tracks = document.querySelectorAll('[role="gridcell"]');
            tracks.forEach(track => {
                if (!track.hasButtons) {
                    const downloadButton = addButton(track);
                    downloadButton.onclick = function() {
                        const btn = track.querySelector('[data-testid="more-button"]');
                        if (btn) {
                            btn.click();
                            setTimeout(() => {
                                const highlightEl = document.querySelector('#context-menu a[href*="highlight"]');
                                if (highlightEl) {
                                    const highlight = highlightEl.href.match(/highlight=(.+)/)[1];
                                    document.dispatchEvent(new MouseEvent('mousedown'));
                                    const spotifyId = highlight.split(':')[2];
                                    openInLucida(`https://open.spotify.com/track/${spotifyId}`);
                                }
                            }, 1);
                        }
                    }
                    track.hasButtons = true;
                }
            });
        }
    
        if (type === 'album' || type === 'playlist' || type === 'track') {
            const tracks = document.querySelectorAll('[data-testid="tracklist-row"]');
            tracks.forEach(track => {
                if (!track.hasButtons) {
                    const downloadButton = addButton(track);
                    downloadButton.onclick = function() {
                        const trackLink = track.querySelector('a[href^="/track"]');
                        if (trackLink) {
                            openInLucida(trackLink.href);
                        } else {
                            const btn = track.querySelector('[data-testid="more-button"]');
                            if (btn) {
                                btn.click();
                                setTimeout(() => {
                                    const highlightEl = document.querySelector('#context-menu a[href*="highlight"]');
                                    if (highlightEl) {
                                        const highlight = highlightEl.href.match(/highlight=(.+)/)[1];
                                        document.dispatchEvent(new MouseEvent('mousedown'));
                                        const spotifyId = highlight.split(':')[2];
                                        openInLucida(`https://open.spotify.com/track/${spotifyId}`);
                                    }
                                }, 1);
                            }
                        }
                    }
                    track.hasButtons = true;
                }
            });
        }
    }
    
    function animateLoop() {
        if (window.location.hostname === 'open.spotify.com') {
            animate();
        }
        requestAnimationFrame(animateLoop);
    }
    
    const button = document.createElement('button');
    button.className = 'floating-button';
    button.innerHTML = LOGO_SVG;
    
    const savedPosition = {
        left: GM_getValue('buttonLeft', '20'),
        top: GM_getValue('buttonTop', '20')
    };
    
    button.style.left = savedPosition.left + 'px';
    button.style.top = savedPosition.top + 'px';
    
    let isDragging = false;
    let startX, startY;
    
    button.addEventListener('mousedown', e => {
        if (e.target.tagName.toLowerCase() !== 'svg') {
            isDragging = true;
            startX = e.clientX - button.offsetLeft;
            startY = e.clientY - button.offsetTop;
        }
    });
    
    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        
        let left = e.clientX - startX;
        let top = e.clientY - startY;
        
        left = Math.max(0, Math.min(window.innerWidth - button.offsetWidth, left));
        top = Math.max(0, Math.min(window.innerHeight - button.offsetHeight, top));
        
        button.style.left = left + 'px';
        button.style.top = top + 'px';
    });
    
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const SNAP = 20;
        const rect = button.getBoundingClientRect();
        
        if (rect.left < SNAP) button.style.left = '0px';
        if (rect.top < SNAP) button.style.top = '0px';
        if (window.innerWidth - rect.right < SNAP) button.style.left = (window.innerWidth - rect.width) + 'px';
        if (window.innerHeight - rect.bottom < SNAP) button.style.top = (window.innerHeight - rect.height) + 'px';
    
        GM_setValue('buttonLeft', button.style.left.replace('px', ''));
        GM_setValue('buttonTop', button.style.top.replace('px', ''));
    });
    
    button.addEventListener('click', e => {
        if (e.target.closest('svg')) {
            openInLucida();
        }
    });
    
    const isLucidaDomain = window.location.hostname.includes('lucida.');
    
    if (GM_getValue('floatIconEnabled', 'enabled') === 'disabled' || isLucidaDomain) {
        button.style.display = 'none';
    }
    
    document.body.appendChild(button);
    setupMenuCommand();
    requestAnimationFrame(animateLoop);
    autoSelectFormat();
    autoDownload();
})();
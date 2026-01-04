// ==UserScript==
// @name         HiAnime Dark Theme
// @namespace    hiDT
// @version      2.22
// @description  Apply dark theme with visible buttons, fixed background, remove Spotlight, and remove deslide-wrap
// @author       Jet
// @match        *://hianimez.to/*
// @match        *://hianime.nz/*
// @match        *://hianime.bz/*
// @match        *://hianime.pe/*
// @icon         https://www.crunchyroll.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/521199/HiAnime%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/521199/HiAnime%20Dark%20Theme.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const darkThemeCSS = `
        body {
            background-color: #121212;
            color: #1ABDBB;
            font-family: 'Arial', sans-serif;
        }

        a {
            color: #1ABDBB;
        }

        a:hover {
            color: #33B8C8;
        }

        button, .button, .menu-item, .anime-card, .card {
            background-color: #333;
            color: #1ABDBB;
            padding: 10px 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none; /* Remove border */
            border-radius: 12px;
        }

        button:hover, .button:hover, .menu-item:hover, .anime-card:hover, .card:hover {
            background-color: #444;
            box-shadow: 0 0 0 4px #33B8C8 inset; /* Change shadow color on hover */
        }

        input, textarea, select {
            background-color: #222;
            color: #1ABDBB;
            border: none; /* Remove border */
            padding: 8px 12px;
            border-radius: 8px;
        }

        input:focus, textarea:focus, select:focus {
            box-shadow: 0 0 0 2px #33B8C8 inset; /* Change shadow color on focus */
            outline: none;
        }

        img, .anime-card img {
            border-radius: 8px;
            border: none; /* Remove border */
        }

        .d_w-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        #header, .header, .navbar {
            background-color: #1c1c1c;
            padding: 10px 20px;
            border-radius: 10px;
        }

        .sidebar {
        background-color: #222;
        border-radius: 10px;
        padding: 15px;
        position: fixed;
        left: -300px; /* Sidebar now slides in from the left */
        top: 0;
        width: 250px;
        height: 100%;
        transition: all 0.3s ease;
        z-index: 9999;
        opacity: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        }

        .sidebar.open {
            left: 0; /* Sidebar slides in fully */
        }

        .sidebar .hst-item {
            margin-bottom: 20px;
        }

        .sidebar .hst-icon {
            color: #1ABDBB;
            font-size: 24px;
        }

        .sidebar .hst-item .description {
            color: #ccc;
            font-size: 12px;
        }

        footer, .footer-wrapper {
            background-color: #1c1c1c;
            color: #999;
            padding: 10px 20px;
            text-align: center;
            border-radius: 10px;
        }

        .anime-card, .card {
            background-color: #333;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease;
        }

        .anime-card:hover, .card:hover {
            transform: scale(1.05);
        }

        .swiper-slide {
            background-color: #333;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }

        /* Hide spotlight */
        .deslide-item .desi-sub-text:contains('Spotlight'),
        .deslide-item .tick-item:contains('Spotlight') {
            display: none !important;
        }

        .deslide-wrap {
            display: none !important;
        }

        .fixed {
            background-color: transparent !important;
        }

        .three-dots {
            font-size: 30px;
            cursor: pointer;
            color: #1ABDBB;
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
        }

        .select-anime-name {
            background-color: #333;
            border-radius: 8px;
            color: #1ABDBB;
            margin-top: auto; /* Push it to the bottom */
        }

        /* Ensure sidebar is focusable and accessible */
        .sidebar a, .sidebar button {
            outline: none;
        }

        .sidebar a:focus, .sidebar button:focus {
            box-shadow: 0 0 0 3px #33B8C8 inset; /* Highlight focused elements */
        }
         #user-buttons {
            position: fixed;
            bottom: 20px;
            left: 20px;
            display: flex;
            gap: 10px;
            z-index: 10000;
        }

        #user-buttons button {
            padding: 10px 15px;
            background-color: #1ABDBB;
            color: #121212;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }

        #user-buttons button:hover {
            background-color: #33B8C8;
        }
     #popup {
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: #1ABDBB;
            padding: 15px 20px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
            z-index: 10001;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        #popup.show {
            opacity: 1;
            pointer-events: auto;
            transform: translateX(-50%) translateY(-10px);
        }

        .continue-watching-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 10px;
            padding: 5px;
            background-color: #222;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
            width: 250px; /* Adjusted width */
        }

        }
        .continue-watching-title {
            color: #1ABDBB;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .continue-watching-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            color: inherit;
        }
        .continue-watching-poster {
            width: 150px;
            height: 200px;
            border-radius: 8px;
            margin-bottom: 5px;
        }
        .continue-watching-episode {
            font-size: 14px;
            color: #ccc;
        }

        .film-name {
            font-size: 18px;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.innerHTML = darkThemeCSS;
    document.head.appendChild(styleElement);

    async function fetchContinueWatchingItem() {
        try {
            const response = await fetch('https://hianime.to/user/continue-watching');
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const firstItem = doc.querySelector('.flw-item');

            if (firstItem) {
                return firstItem.outerHTML;
            } else {
                console.error('No .flw-item found');
            }
        } catch (error) {
            console.error('Error fetching the continue watching item:', error);
        }
        return '';
    }

    async function createContinueWatchingContainer(side) {
        const itemHTML = await fetchContinueWatchingItem();
        if (!itemHTML) return;

        const container = document.createElement('div');
        container.className = 'continue-watching-container';
        container.innerHTML = `
            <div class="continue-watching-title">Continue Watching</div>
            ${itemHTML}
        `;

        const parent = document.querySelector('.d_w-icon').parentElement;
        if (side === 'left') {
            parent.insertBefore(container, document.querySelector('.d_w-icon'));
        } else if (side === 'right') {
            parent.appendChild(container);
        }
    }

    createContinueWatchingContainer('left'); // Sidebar is on the left
    createContinueWatchingContainer('right'); // Optional right container if needed


    (function() {
        const discussion = document.getElementById('discussion');
        const dWIcon = document.querySelector('.d_w-icon');

        if (discussion && dWIcon) {
            discussion.style.position = 'relative';
            dWIcon.style.position = 'absolute';
            dWIcon.style.top = '50%';
            dWIcon.style.left = '50%';
            dWIcon.style.transform = 'translate(-50%, -50%)';
        }

    })();


        function showPopup(message) {
            let popup = document.querySelector('#popup');
            if (!popup) {
                popup = document.createElement('div');
                popup.id = 'popup';
                document.body.appendChild(popup);
            }
            popup.textContent = message;
            popup.classList.add('show');
            setTimeout(() => popup.classList.remove('show'), 3000);
        }

        ['.deslide-wrap', '.d_w-list', '.zrg-title', '.zrg-list', '.header-setting', '.hs-toggles']
            .forEach(selector => {
                const element = document.querySelector(selector);
                if (element) element.remove();
            });
    })();

    const deslideWrapElement = document.querySelector('.deslide-wrap');
    if (deslideWrapElement) {
        deslideWrapElement.remove();
    }

    const dwlistElement = document.querySelector('.d_w-list');
    if (dwlistElement) {
        dwlistElement.remove();
    }

    const zrgTitleElement = document.querySelector('.zrg-title');
    if (zrgTitleElement) {
        zrgTitleElement.remove();
    }

    const zrgListElement = document.querySelector('.zrg-list');
    if (zrgListElement) {
        zrgListElement.remove();
    }

    const headerSettingElement = document.querySelector('.header-setting');
    if (headerSettingElement) {
        headerSettingElement.remove();
    }

    const hsTogglesElement = document.querySelector('.hs-toggles');
    if (hsTogglesElement) {
        hsTogglesElement.remove();
    }

    if (window.location.href.includes('/user/profile')) {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'user-buttons';

        const copyIdButton = document.createElement('button');
        copyIdButton.textContent = 'Copy ID';
        copyIdButton.addEventListener('click', () => {
            showPopup('This feature is not yet supported! Check back later!');
        });

        const profileButton = document.createElement('button');
        profileButton.textContent = 'Profile';
        profileButton.addEventListener('click', () => {
            window.location.href = 'https://hianime.to/community/my-zone';
        });

        buttonContainer.appendChild(copyIdButton);
        buttonContainer.appendChild(profileButton);
        document.body.appendChild(buttonContainer);
    }

    function showPopup(message) {
        let popup = document.querySelector('#popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'popup';
            document.body.appendChild(popup);
        }

        popup.textContent = message;
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000);
    }

    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');
    sidebar.innerHTML = `
        <div class="hst-item">
            <a href="https://hianime.to/watch2gether" target="_blank" class="hst-link">
                <div class="hst-icon"><i class="zicon zicon-20 zicon-live"></i></div>
                <div class="description">Watch Parties</div>
            </a>
        </div>
        <div class="hst-item">
            <a href="https://hianime.to/random" target="_blank" class="hst-link">
                <div class="hst-icon"><i class="fas fa-random"></i></div>
                <div class="description">Random Anime</div>
            </a>
        </div>
        <div class="hst-item">
            <a href="https://hianime.to/community/board" target="_blank" class="hst-link">
                <div class="hst-icon"><i class="fas fa-comments"></i></div>
                <div class="description">Community</div>
            </a>
        </div>
        <div class="hst-item" data-toggle="tooltip" title="" data-original-title="Select language of anime name to display.">
                    <div class="select-anime-name toggle-lang"><span class="en">EN</span><span class="jp">JP</span></div>
                    <div class="name"><span>Anime Name</span></div>
                </div>
    `;
    document.body.appendChild(sidebar);

    const threeDotsButton = document.createElement('div');
    threeDotsButton.classList.add('three-dots');
    threeDotsButton.innerHTML = '...';
    document.body.appendChild(threeDotsButton);


    threeDotsButton.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

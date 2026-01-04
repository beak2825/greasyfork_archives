// ==UserScript==
// @name         Darkmode
// @namespace    http://tampermonkey.net/
// @version      prerelease-3.0
// @description  Adds a button to enable/disable darkmode
// @author       guildedbird
// @match        https://pixelplace.io/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530651/Darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/530651/Darkmode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const disableOceanColor = false;
    const darkOceanColor = "rgba(20, 20, 20, 1)";
    const defaultOceanColor = "rgba(204, 204, 204, 0)";
    const style = "cover";

    function updateDarkMode() {
        const isDarkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true' ? true : false;

        if (isDarkModeEnabled) {
            darkModeElement.classList.add('selected');
            document.body.classList.add('darkmode');
            if (!disableOceanColor) {
                changeOceanColor(darkOceanColor);
            }
        } else {
            darkModeElement.classList.remove('selected');
            document.body.classList.remove('darkmode');
            if (!disableOceanColor) {
                changeOceanColor(defaultOceanColor);
            }
        }
    }

    function changeOceanColor(color) {
        if (disableOceanColor) return;
        const painting = document.querySelector('#painting');
        if (painting) {
            painting.style.backgroundColor = color;
        }
    }

    function darkModeOcean() {
        const canvas = document.getElementById("canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] === 204 && data[i + 1] === 204 && data[i + 2] === 204) {
                data[i + 3] = 0;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    function canvasWait() {
        if (!document.getElementById("canvas")) {
            setTimeout(canvasWait, 100);
        } else {
            darkModeOcean();
        }
    }
    canvasWait();

    const css = ` #painting { position: absolute; display: flex; align-items: center; justify-content: center; top: 0; left: 0; cursor: move; background-size: ${style}; background-position: center; background-repeat: no-repeat; margin: 0; height: 100vh; overflow: hidden; }
    .darkmode #chat .messages .row a:hover[style="color:#000000"] { text-shadow: 1px 1px 1px #00000025; filter: brightness(0) saturate(100%) invert(97%) sepia(85%) saturate(12%) hue-rotate(184deg) brightness(103%) contrast(103%); } .darkmode #chat .messages .row a:hover[style="color:#222222"] { text-shadow: 1px 1px 1px #00000025; filter: brightness(0) saturate(100%) invert(97%) sepia(85%) saturate(12%) hue-rotate(184deg) brightness(103%) contrast(103%);`;
    const styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.appendChild(document.createTextNode(css));
    document.head.appendChild(styleElement);

    const modalContent = document.querySelector('#modals .box[data-id="main"] .box-content[data-id="tools"] div form');

    const darkModeElement = document.createElement('a');
    darkModeElement.href = '#';
    darkModeElement.classList.add('input-checkbox');
    darkModeElement.setAttribute('data-name', 'tools-enable-darkmode');

    darkModeElement.innerHTML =
        `<div>
            <div class="input">
                <div></div>
            </div>
        </div>
        <div>
            <div class="header">Enable darkmode</div>
            <div class="content">
                Changes the menu theme to darkmode
            </div>
        </div>`;

    const formChildren = modalContent.children;
    if (formChildren.length >= 10) {
        modalContent.insertBefore(darkModeElement, formChildren[9]);
    } else {
        modalContent.appendChild(darkModeElement);
    }

    updateDarkMode();

    darkModeElement.addEventListener('click', function() {
        darkModeElement.classList.toggle('selected');
        const isDarkModeNowEnabled = darkModeElement.classList.contains('selected');
        localStorage.setItem('darkModeEnabled', isDarkModeNowEnabled.toString());
        updateDarkMode();

        setTimeout(() => {
            const notifications = document.querySelector('#notification');
            if (!notifications) return;

            const existingNotification = notifications.querySelector('.box');
            if (existingNotification) existingNotification.remove();

            const notification = document.createElement('div');
            notification.className = isDarkModeNowEnabled ? 'box success' : 'box warning';
            notification.innerHTML =
                `<div class="icon"></div>
                <div class="content">
                    <div class="title">Tools</div>
                    <div class="description">Darkmode ${isDarkModeNowEnabled ? 'enabled' : 'disabled'}</div>
                </div>`;

            notifications.appendChild(notification);
            setTimeout(() => {
                notification.style.transition = 'opacity 1s';
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 1000);
            }, 6000);
        });
    });

    document.querySelector('#container #copyright').innerHTML = "<span title='Click to read Terms, Copyright & more (script made by @guildedbird)'>www.pixelplace.io</span>";

    GM_addStyle(`
        .darkmode #loader, .darkmode #loader-canvas{
        background: url('https://i.imgur.com/v9kRnaf.png') no-repeat right bottom,
        linear-gradient(to bottom, rgba(50,50,50,1), rgba(20,20,20,1));
        background-size: 5%;
        }
        .darkmode #modals .box[data-id=main], .darkmode #social, .darkmode #modals .box, body {
        background-color: #161616 !important;
        background-image: linear-gradient(to bottom, rgba(30,30,30,1), rgba(20,20,20,1));
        border: 1px solid #4b4949;
        }
        .darkmode .box-x {
        background-color: #161616 !important;
        background-image: linear-gradient(to bottom, rgba(30,30,30,1), rgba(20,20,20,1));
        border: 1px solid #4b4949;
        }
        wrapper * {
        background-color: #161616 !important;
        background-image: linear-gradient(to bottom, rgba(30,30,30,1), rgba(20,20,20,1));
        border: 1px solid #4b4949;
        }
        .darkmode .box-x > .box-content-x {
        color: #ffffff !important;
        }
        .darkmode #modals .box[data-id=main] a {
        color: #ffffff;
        }
        .darkmode .btn, .darkmode button, .darkmode .prem-item .gift-item, .darkmode #menu-buttons-right-bottom > a, .darkmode #menu-buttons-right-bottom > a > .notification-bubble.green, .darkmode #modals .box .close, .darkmode #chat .buttons a, .darkmode #profile .box-x .close, .modx .box-x .close, .darkmode #guild .box-x .close, .darkmode #onlineUsers .box-x .close, .darkmode #item .box-x .close, .darkmode #checkout-method .box-x .close, .darkmode #coin-island .box-x .close, .darkmode #gold-rush .box-x .close, .darkmode #pixel-lottery .box-x .close, .darkmode #daily-reward .box-x .close{
        background-color: #3b3b3b;
        }
        .darkmode #painting-grid {
        background-image: linear-gradient(to right, #3b3b3b 1px,transparent 1px),linear-gradient(to bottom, #3b3b3b 1px,transparent 1px) !important;
        }
        .darkmode .btn:hover, .darkmode button:hover, .darkmode .prem-item .darkmode .gift-item:hover, .darkmode #menu-buttons-right-bottom > a:hover, .darkmode #modals .box .close:hover, .darkmode #chat .buttons a:hover, .darkmode #more-colors-below:hover, .darkmode #more-colors-above:hover{
        background-color: #4b4b4b;
        }
        .darkmode #menu-buttons > a:hover, .darkmode #menu-buttons-right-top > a:hover, .darkmode .favorite-btn.active:hover, .darkmode .favorite-btn.filled:hover, .darkmode .more-content-below:hover, .darkmode #menu-buttons-bottom > a:hover, .darkmode #menu-buttons-right-bottom > a:hover, .darkmode #more-colors-below:hover, .darkmode #more-colors-above:hover {
        background-color: #3b3b3b !important;
        }
        .darkmode .painting a, .darkmode .bold.text-center .followers, .darkmode .profile-name a, .darkmode #profile .box-x .box-content-x .user-avatar .edit-user-avatar a, #guild .edit-guild-emblem, .darkmode #guild .open-profile{
        color: #8b8b8b;
        }
        .darkmode .painting a:hover, .darkmode .bold.text-center .followers:hover, .darkmode .darkmode .profile-name a:hover, .darkmode #profile .box-x .box-content-x .user-avatar .edit-user-avatar a:hover{
        color: #9b9b9b;
        }
        .darkmode .c-loader-inner {
        background-color: #6b6b6b;
        }
        .darkmode #guild .box-x .box-content-x div form button{
        background-color: #8b8b8b !important;
        }
        .darkmode #profile .edit-user-avatar, .darkmode #profile .text-center .display-block{
        color: #8b8b8b !important;
        }
        .darkmode #tools, .darkmode #warTimer .box, .darkmode #menu-buttons-right-top > a, .darkmode #menu-buttons > a, .darkmode .favorite-btn.active, .darkmode .favorite-btn.filled, .darkmode .more-content-below, .darkmode #menu-buttons-bottom > a, .darkmode #menu-buttons-right-bottom > a, .darkmode #more-colors-below, .darkmode #more-colors-above{
        background-color: #2b2b2b !important;
        }
        .darkmode #modals .box-content[data-id=top] div form#painting-list {
        background-color: transparent !important;
        }
        .darkmode .box-sub-menu li.selected a, .darkmode .box-sub-menu li.selected a {
        background-color: transparent !important;
        color: #9c9c9c !important;
        }
        .darkmode #modals a:hover{
        color: #3b3b3b !important;
        }
        .darkmode #chat .messages .row .user:unstyled:hover{
        border-bottom: 1px solid #757575 !important;
        }
        .darkmode #social .tabs-list a.active {
        border-bottom: 1px solid #757575 !important;
        }
        .darkmode #modals .box > .box-menu li.selected a {
        color: #9c9c9c !important;
        background-color: #282828 !important;
        }
        .darkmode .prem-coins:hover .buy-item, .darkmode .prem-item:hover .buy-item {
        filter: brightness(1.25) !important;
        }
        .darkmode #modals .box > .box-sub-menu li a:hover{
        border-bottom: 1px solid #757575 !important;
        }
        .darkmode #modals .box > .box-menu{
        background-color: #000000 !important;
        border-top: 1px solid #4b4949 !important;
        }
        .darkmode #modals .box > .box-menu li a {
        background-color: #00000000 !important;
        }
        .darkmode #modals .box > .box-content h1, .darkmode .prem-box .left > div, .darkmode .prem-box .right > div, .darkmode #blog .article .category, .darkmode #social .tabs-list a, .darkmode #social .list table td a, .darkmode #modals .box > .box-header, .darkmode #modals .box > .box-menu li a{
        color: #ffffff;
        }
        .darkmode #loader .text, .darkmode #loader-canvas .text{
        color: #ffffff; !important;
        }
        .darkmode .c-loader{
        border: 4px solid #ffffff;
        }
        .darkmode #modals .box > .box-content, .darkmode #social .list{
        scrollbar-color: #8f8f8f #00000000 !important;
        }
        #modals .box > .box-content .inline-checkbox input[type="checkbox"]:checked:before {
        background-color: #3b3b3b;
        border: 1px solid #3b3b3b;
        }
        .darkmode #chat .tabs > a:hover{
        color: #ffffff !important;
        }
        #timemachine {
        background-color: rgb(0 0 0 / 75%);
        border-bottom: 2px dashed rgba(255, 255, 255, 0.75)
        }
        #timemachine > div b, #timemachine > div .inf, #timemachine > div .timestamp, #timemachine .check, .request-row .username{
        color: white
        }
    `);

    const makeDraggable = (element, handle) => {
    let offsetX = 0, offsetY = 0, isDragging = false;

    const mouseMoveHandler = (e) => {
        if (!isDragging) return;
        element.style.position = 'absolute';
        element.style.left = `${e.clientX - offsetX}px`;
        element.style.top = `${e.clientY - offsetY}px`;
        handle.style.cursor = 'grabbing';
    };

    const mouseUpHandler = () => {
        isDragging = false;
        handle.style.cursor = 'grab';
        document.body.style.userSelect = '';

        sessionStorage.setItem('toolsLeft', element.style.left);
        sessionStorage.setItem('toolsTop', element.style.top);
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    const mouseDownHandler = (e) => {
        sessionStorage.removeItem('toolsLeft');
        sessionStorage.removeItem('toolsTop');

        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);

        document.body.style.userSelect = 'none';
    };

    handle.style.cursor = 'grab';
    handle.addEventListener('mousedown', mouseDownHandler);
};

const waitForElement = (selector, callback) => {
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval);
            callback(element);
        }
    }, 100);
};

sessionStorage.removeItem('toolsLeft');
sessionStorage.removeItem('toolsTop');

waitForElement('#tools', (tools) => {
    const handle = document.createElement('div');
    handle.style.position = 'absolute';
    handle.style.top = '40px';
    handle.style.right = '-35px';
    handle.style.width = '20px';
    handle.style.height = '20px';
    handle.style.padding = '12px';
    handle.style.background = '#2b2b2b';
    handle.style.border = '2px solid #fff';
    handle.style.borderRadius = '15px';
    handle.style.cursor = 'grab';
    handle.style.display = 'flex';
    handle.style.alignItems = 'center';
    handle.style.justifyContent = 'center';
    handle.style.zIndex = '1000';
    handle.style.boxShadow = '0px 0px 5px 0px rgba(0, 0, 0, 0.75)';
    handle.title = 'Drag Me!';

    const img = document.createElement('img');
    img.src = 'https://i.imgur.com/DDjMbDW.png';
    img.alt = 'Drag Icon';
    img.style.width = '18px';
    img.style.height = '18px';
    img.style.pointerEvents = 'none';

    handle.appendChild(img);

    const closeHandle = handle.cloneNode(true);
    closeHandle.style.top = '6px';
    closeHandle.style.right = '-35px';

    closeHandle.style.background = '#2b2b2b';
    closeHandle.title = 'Close UI';

    const closeImg = document.createElement('img');
    closeImg.src = 'https://pixelplace.io/img/icons/x-modal.svg';
    closeImg.alt = 'Close Icon';
    closeImg.style.width = '16px';
    closeImg.style.height = '16px';
    closeImg.style.pointerEvents = 'none';

    closeHandle.innerHTML = '';
    closeHandle.appendChild(closeImg);

closeHandle.addEventListener('click', () => {

    const paintingOwnerToolsLink = document.querySelector('a[title="Painting Owner Tools"]');
    if (paintingOwnerToolsLink) {
        paintingOwnerToolsLink.click();
    }
});

    const savedLeft = sessionStorage.getItem('toolsLeft');
    const savedTop = sessionStorage.getItem('toolsTop');
    tools.style.position = 'absolute';
    if (savedLeft && savedTop) {
        tools.style.left = savedLeft;
        tools.style.top = savedTop;
    }

    tools.style.position = 'absolute';
    tools.appendChild(closeHandle);
    tools.appendChild(handle);

    makeDraggable(tools, handle);

    const observer = new MutationObserver(() => {
        const display = getComputedStyle(tools).display;
        if (display !== 'none') {
            const newLeft = sessionStorage.getItem('toolsLeft');
            const newTop = sessionStorage.getItem('toolsTop');
            if (newLeft && newTop) {
                tools.style.left = newLeft;
                tools.style.top = newTop;
            }
        }
    });
    observer.observe(tools, { attributes: true, attributeFilter: ['style'] });
});
})();
// ==UserScript==
// @name         Enhanced VRChat Website Tools
// @namespace    http://tampermonkey.net/
// @version      2024-04-10
// @description  Modern UI overlay with improved avatar search and tools
// @author       Snoofz
// @match        https://vrchat.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vrchat.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532401/Enhanced%20VRChat%20Website%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/532401/Enhanced%20VRChat%20Website%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Icon paths using Font Awesome paths
    const iconMaps = {
        "star": "M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z",
        "world": "M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z",
        "home": "M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z",
        "search": "M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z",
        "cogwheel": "M308.5 135.3c7.1-6.3 9.9-16.2 6.2-25c-2.3-5.3-4.8-10.5-7.6-15.5L304 89.4c-3-5-6.3-9.9-9.8-14.6c-5.7-7.6-15.7-10.1-24.7-7.1l-28.2 9.3c-10.7-8.8-23-16-36.2-20.9L199 27.1c-1.9-9.3-9.1-16.7-18.5-17.8C173.9 8.4 167.2 8 160.4 8h-.7c-6.8 0-13.5 .4-20.1 1.2c-9.4 1.1-16.6 8.6-18.5 17.8L115 56.1c-13.3 5-25.5 12.1-36.2 20.9L50.5 67.8c-9-3-19-.5-24.7 7.1c-3.5 4.7-6.8 9.6-9.9 14.6l-3 5.3c-2.8 5-5.3 10.2-7.6 15.6c-3.7 8.7-.9 18.6 6.2 25l22.2 19.8C32.6 161.9 32 168.9 32 176s.6 14.1 1.7 20.9L11.5 216.7c-7.1 6.3-9.9 16.2-6.2 25c2.3 5.3 4.8 10.5 7.6 15.6l3 5.2c3 5.1 6.3 9.9 9.9 14.6c5.7 7.6 15.7 10.1 24.7 7.1l28.2-9.3c10.7 8.8 23 16 36.2 20.9l6.1 29.1c1.9 9.3 9.1 16.7 18.5 17.8c6.7 .8 13.5 1.2 20.4 1.2s13.7-.4 20.4-1.2c9.4-1.1 16.6-8.6 18.5-17.8l6.1-29.1c13.3-5 25.5-12.1 36.2-20.9l28.2 9.3c9 3 19 .5 24.7-7.1c3.5-4.7 6.8-9.5 9.8-14.6l3.1-5.4c2.8-5 5.3-10.2 7.6-15.5c3.7-8.7 .9-18.6-6.2-25l-22.2-19.8c1.1-6.8 1.7-13.8 1.7-20.9s-.6-14.1-1.7-20.9l22.2-19.8zM112 176a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM504.7 500.5c6.3 7.1 16.2 9.9 25 6.2c5.3-2.3 10.5-4.8 15.5-7.6l5.4-3.1c5-3 9.9-6.3 14.6-9.8c7.6-5.7 10.1-15.7 7.1-24.7l-9.3-28.2c8.8-10.7 16-23 20.9-36.2l29.1-6.1c9.3-1.9 16.7-9.1 17.8-18.5c.8-6.7 1.2-13.5 1.2-20.4s-.4-13.7-1.2-20.4c-1.1-9.4-8.6-16.6-17.8-18.5L583.9 307c-5-13.3-12.1-25.5-20.9-36.2l9.3-28.2c3-9 .5-19-7.1-24.7c-4.7-3.5-9.6-6.8-14.6-9.9l-5.3-3c-5-2.8-10.2-5.3-15.6-7.6c-8.7-3.7-18.6-.9-25 6.2l-19.8 22.2c-6.8-1.1-13.8-1.7-20.9-1.7s-14.1 .6-20.9 1.7l-19.8-22.2c-6.3-7.1-16.2-9.9-25-6.2c-5.3 2.3-10.5 4.8-15.6 7.6l-5.2 3c-5.1 3-9.9 6.3-14.6 9.9c-7.6 5.7-10.1 15.7-7.1 24.7l9.3 28.2c-8.8 10.7-16 23-20.9 36.2L315.1 313c-9.3 1.9-16.7 9.1-17.8 18.5c-.8 6.7-1.2 13.5-1.2 20.4s.4 13.7 1.2 20.4c1.1 9.4 8.6 16.6 17.8 18.5l29.1 6.1c5 13.3 12.1 25.5 20.9 36.2l-9.3 28.2c-3 9-.5 19 7.1 24.7c4.7 3.5 9.5 6.8 14.6 9.8l5.4 3.1c5 2.8 10.2 5.3 15.5 7.6c8.7 3.7 18.6 .9 25-6.2l19.8-22.2c6.8 1.1 13.8 1.7 20.9 1.7s14.1-.6 20.9-1.7l19.8 22.2zM464 304a48 48 0 1 1 0 96 48 48 0 1 1 0-96z",
        "shield": "M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z",
        "envelope": "M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z",
        "user": "M256 288A144 144 0 1 0 256 0a144 144 0 1 0 0 288zm-94.7 32C72.7 320 0 392.7 0 481.3c0 17 13.8 30.7 30.7 30.7H481.3c17 0 30.7-13.8 30.7-30.7C512 392.7 439.3 320 350.7 320H161.3z",
        "times": "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
    };

    // WebSocket setup
    let ws = null;
    let messageCount = 0;
    let displayName = "";
    let trustRankColor = "";
    let trustRankName = "";

    // CSS for the new UI
    const modalCSS = `
    .vrc-tools-modal {
        position: fixed;
        top: 100px;
        left: 100px;
        width: 800px;
        background-color: #1a1a1a;
        border-radius: 8px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
        z-index: 9999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #f0f0f0;
        overflow: hidden;
        resize: both;
        min-width: 400px;
        min-height: 300px;
        max-width: 1200px;
        max-height: 800px;
        border: 1px solid #333;
    }
    .vrc-tools-header {
        background-color: #2a2a2a;
        padding: 12px 20px;
        cursor: move;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #333;
    }
    .vrc-tools-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #fff;
    }
    .vrc-tools-close {
        background: none;
        border: none;
        color: #aaa;
        font-size: 20px;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        border-radius: 50%;
        transition: background-color 0.2s;
    }
    .vrc-tools-close:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
    }
    .vrc-tools-tabs {
        display: flex;
        background-color: #2a2a2a;
        border-bottom: 1px solid #333;
    }
    .vrc-tools-tab {
        padding: 12px 20px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s, background-color 0.2s;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .vrc-tools-tab.active {
        opacity: 1;
        background-color: #333;
        border-bottom: 2px solid #5865f2;
    }
    .vrc-tools-tab:hover:not(.active) {
        opacity: 0.9;
        background-color: #333;
    }
    .vrc-tools-tab-icon {
        width: 16px;
        height: 16px;
    }
    .vrc-tools-content {
        padding: 20px;
        height: calc(100% - 120px);
        overflow-y: auto;
    }
    .vrc-tools-tab-content {
        display: none;
        height: 100%;
    }
    .vrc-tools-tab-content.active {
        display: block;
    }
    .vrc-tools-search-container {
        margin-bottom: 20px;
    }
    .vrc-tools-search-input {
        width: 100%;
        padding: 10px 15px;
        border-radius: 5px;
        border: 1px solid #444;
        background-color: #222;
        color: #fff;
        font-size: 16px;
        outline: none;
        transition: border-color 0.2s;
    }
    .vrc-tools-search-input:focus {
        border-color: #5865f2;
    }
    .vrc-tools-btn {
        background-color: #5865f2;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
        margin-right: 10px;
        margin-bottom: 10px;
    }
    .vrc-tools-btn:hover {
        background-color: #4752c4;
    }
    .vrc-tools-btn.secondary {
        background-color: #4f545c;
    }
    .vrc-tools-btn.secondary:hover {
        background-color: #5d6269;
    }
    .vrc-tools-btn.danger {
        background-color: #ed4245;
    }
    .vrc-tools-btn.danger:hover {
        background-color: #c03537;
    }
    .vrc-tools-avatar-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    .vrc-tools-avatar-card {
        background-color: #2a2a2a;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
        border: 1px solid #333;
    }
    .vrc-tools-avatar-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    }
    .vrc-tools-avatar-thumbnail {
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
        display: block;
    }
    .vrc-tools-avatar-info {
        padding: 15px;
    }
    .vrc-tools-avatar-name {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .vrc-tools-avatar-author {
        margin: 0;
        font-size: 14px;
        color: #aaa;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .vrc-tools-avatar-actions {
        display: flex;
        margin-top: 10px;
        gap: 8px;
    }
    .vrc-tools-avatar-btn {
        flex: 1;
        padding: 6px 0;
        font-size: 13px;
        background-color: #36393f;
        border: none;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    .vrc-tools-avatar-btn:hover {
        background-color: #40444b;
    }
    .vrc-tools-avatar-btn.primary {
        background-color: #5865f2;
    }
    .vrc-tools-avatar-btn.primary:hover {
        background-color: #4752c4;
    }
    .vrc-tools-settings-section {
        margin-bottom: 30px;
    }
    .vrc-tools-settings-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 15px;
        color: #fff;
        border-bottom: 1px solid #333;
        padding-bottom: 10px;
    }
    .vrc-tools-settings-option {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
    }
    .vrc-tools-settings-label {
        flex: 1;
        font-size: 15px;
    }
    .vrc-tools-settings-description {
        color: #aaa;
        font-size: 13px;
        margin-top: 5px;
    }
    /* Chat styles */
    .vrc-tools-chat-container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .vrc-tools-chat-log {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        background-color: #2a2a2a;
        border-radius: 8px;
        margin-bottom: 15px;
    }
    .vrc-tools-chat-message {
        margin-bottom: 10px;
        line-height: 1.5;
    }
    .vrc-tools-chat-input-container {
        display: flex;
        gap: 10px;
    }
    .vrc-tools-chat-input {
        flex: 1;
        padding: 12px 15px;
        border-radius: 5px;
        border: 1px solid #444;
        background-color: #222;
        color: #fff;
        font-size: 16px;
        outline: none;
    }
    .vrc-tools-chat-input:focus {
        border-color: #5865f2;
    }
    .vrc-tools-chat-send {
        padding: 0 20px;
        background-color: #5865f2;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .vrc-tools-chat-send:hover {
        background-color: #4752c4;
    }
    /* Toggle button styles */
    .vrc-tools-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: #5865f2;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
        z-index: 9998;
        transition: background-color 0.2s;
    }
    .vrc-tools-toggle:hover {
        background-color: #4752c4;
    }
    .vrc-tools-toggle svg {
        width: 24px;
        height: 24px;
    }
    /* Loading indicator */
    .vrc-tools-loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
    }
    .vrc-tools-spinner {
        border: 4px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        border-top: 4px solid #5865f2;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    /* Toast notification */
    .vrc-tools-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2a2a2a;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 350px;
        border-left: 4px solid #5865f2;
        animation: slideIn 0.3s ease-out forwards;
    }
    .vrc-tools-toast.error {
        border-left-color: #ed4245;
    }
    .vrc-tools-toast.success {
        border-left-color: #43b581;
    }
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .vrc-tools-toast-icon {
        flex-shrink: 0;
    }
    .vrc-tools-toast-content {
        flex: 1;
    }
    .vrc-tools-toast-title {
        font-weight: 600;
        margin-bottom: 5px;
    }
    .vrc-tools-toast-close {
        background: none;
        border: none;
        color: #aaa;
        cursor: pointer;
        padding: 0;
        font-size: 18px;
        transition: color 0.2s;
    }
    .vrc-tools-toast-close:hover {
        color: white;
    }
    `;

    async function fetchWorldData() {
        try {
            // This would normally fetch from the API, but we'll use the provided data
            const response = await fetch("https://vrchat.com/api/1/worlds?avatarSpecific=false&maxUnityVersion=2022.3.22f1&releaseStatus=public&organization=vrchat&sort=shuffle&featured=false&tag=system_approved&order=descending&n=50&offset=0");
            const data = await response.json();

            return data;
        } catch (error) {
            console.error("Error fetching world data:", error);
            return [];
        }
    }

    // Function to display worlds in the World grid
    function displayWorlds(worlds, worldGrid) {
        worldGrid.innerHTML = '';

        if (worlds.length === 0) {
            worldGrid.innerHTML = '<p>No worlds found.</p>';
            return;
        }

        worlds.forEach(world => {
            const card = document.createElement('div');
            card.className = 'vrc-tools-avatar-card';

            const img = document.createElement('img');
            img.className = 'vrc-tools-avatar-thumbnail';
            img.src = world.thumbnailImageUrl || world.imageUrl || 'https://via.placeholder.com/300?text=No+Image';
            img.alt = world.name;

            const info = document.createElement('div');
            info.className = 'vrc-tools-avatar-info';

            const name = document.createElement('h4');
            name.className = 'vrc-tools-avatar-name';
            name.textContent = world.name;

            const author = document.createElement('p');
            author.className = 'vrc-tools-avatar-author';
            author.textContent = `By: ${world.authorName}`;

            const details = document.createElement('p');
            details.style.fontSize = '12px';
            details.style.color = '#aaa';
            details.textContent = `Capacity: ${world.capacity} | Favorites: ${world.favorites}`;

            const actions = document.createElement('div');
            actions.className = 'vrc-tools-avatar-actions';

            const viewButton = document.createElement('button');
            viewButton.className = 'vrc-tools-avatar-btn primary';
            viewButton.textContent = 'View World';
            viewButton.addEventListener('click', () => {
                window.open(`https://vrchat.com/home/world/${world.id}`, '_blank');
            });

            actions.appendChild(viewButton);

            info.appendChild(name);
            info.appendChild(author);
            info.appendChild(details);
            info.appendChild(actions);

            card.appendChild(img);
            card.appendChild(info);

            worldGrid.appendChild(card);
        });
    }

    // Create and inject the CSS
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = modalCSS;
        document.head.appendChild(style);
    }

    // Create SVG icon
    function createSVGIcon(pathData, className = '') {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
        svg.setAttribute("role", "presentation");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("viewBox", "0 0 512 512");

        if (className) {
            svg.setAttribute("class", className);
        }

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "currentColor");
        path.setAttribute("d", pathData);

        svg.appendChild(path);
        return svg;
    }

    let worldSearchInput;

    // Create the modal
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'vrc-tools-modal';
        modal.style.display = 'none';

        // Create the header
        const header = document.createElement('div');
        header.className = 'vrc-tools-header';

        const title = document.createElement('h2');
        title.className = 'vrc-tools-title';
        title.textContent = 'VRChat Enhanced Tools';

        const closeButton = document.createElement('button');
        closeButton.className = 'vrc-tools-close';
        closeButton.appendChild(createSVGIcon(iconMaps["times"]));

        header.appendChild(title);
        header.appendChild(closeButton);

        // Create tabs
        const tabs = document.createElement('div');
        tabs.className = 'vrc-tools-tabs';

        const tabsConfig = [
            { id: 'avatars', title: 'Avatar Search', icon: 'search' },
            { id: 'chat', title: 'Live Chat', icon: 'envelope' },
            { id: 'world', title: 'World Browser', icon: 'world' },
            { id: 'settings', title: 'Settings', icon: 'cogwheel' }
        ];

        tabsConfig.forEach((tabConfig, index) => {
            const tab = document.createElement('div');
            tab.className = 'vrc-tools-tab' + (index === 0 ? ' active' : '');
            tab.dataset.tab = tabConfig.id;

            tab.appendChild(createSVGIcon(iconMaps[tabConfig.icon], 'vrc-tools-tab-icon'));

            const tabTitle = document.createElement('span');
            tabTitle.textContent = tabConfig.title;
            tab.appendChild(tabTitle);

            tabs.appendChild(tab);
        });

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'vrc-tools-content';

        // Create tab contents
        const avatarsContent = document.createElement('div');
        avatarsContent.className = 'vrc-tools-tab-content active';
        avatarsContent.dataset.tab = 'avatars';

        const chatContent = document.createElement('div');
        chatContent.className = 'vrc-tools-tab-content';
        chatContent.dataset.tab = 'chat';

        const worldContent = document.createElement('div');
        worldContent.className = 'vrc-tools-tab-content';
        worldContent.dataset.tab = 'world';

        const settingsContent = document.createElement('div');
        settingsContent.className = 'vrc-tools-tab-content';
        settingsContent.dataset.tab = 'settings';

        // Avatar Search Content
        const searchContainer = document.createElement('div');
        searchContainer.className = 'vrc-tools-search-container';

        const searchInput = document.createElement('input');
        searchInput.className = 'vrc-tools-search-input';
        searchInput.type = 'text';
        searchInput.placeholder = 'Search avatars by name...';

        searchContainer.appendChild(searchInput);

        const searchButtonContainer = document.createElement('div');
        searchButtonContainer.style.marginTop = '15px';
        searchButtonContainer.style.display = 'flex';
        searchButtonContainer.style.flexWrap = 'wrap';

        const searchButton = document.createElement('button');
        searchButton.className = 'vrc-tools-btn';
        searchButton.textContent = 'Search';

        const clearButton = document.createElement('button');
        clearButton.className = 'vrc-tools-btn secondary';
        clearButton.textContent = 'Clear';

        searchButtonContainer.appendChild(searchButton);
        searchButtonContainer.appendChild(clearButton);

        const avatarGrid = document.createElement('div');
        avatarGrid.className = 'vrc-tools-avatar-grid';

        avatarsContent.appendChild(searchContainer);
        avatarsContent.appendChild(searchButtonContainer);
        avatarsContent.appendChild(avatarGrid);

        // Chat Content
        const chatContainer = document.createElement('div');
        chatContainer.className = 'vrc-tools-chat-container';

        const chatLog = document.createElement('div');
        chatLog.className = 'vrc-tools-chat-log';
        chatLog.id = 'chatLog';

        const chatInputContainer = document.createElement('div');
        chatInputContainer.className = 'vrc-tools-chat-input-container';

        const chatInput = document.createElement('input');
        chatInput.className = 'vrc-tools-chat-input';
        chatInput.id = 'chatInput';
        chatInput.type = 'text';
        chatInput.placeholder = 'Type your message...';

        const chatSendButton = document.createElement('button');
        chatSendButton.className = 'vrc-tools-chat-send';
        chatSendButton.textContent = 'Send';

        chatInputContainer.appendChild(chatInput);
        chatInputContainer.appendChild(chatSendButton);

        chatContainer.appendChild(chatLog);
        chatContainer.appendChild(chatInputContainer);

        chatContent.appendChild(chatContainer);

        // World Browser Content
        const worldSearchContainer = document.createElement('div');
        worldSearchContainer.className = 'vrc-tools-search-container';

        worldSearchInput = document.createElement('input');
        worldSearchInput.className = 'vrc-tools-search-input';
        worldSearchInput.type = 'text';
        worldSearchInput.placeholder = 'Search worlds by name...';

        worldSearchContainer.appendChild(worldSearchInput);

        window.worldGrid = document.createElement('div');
        worldGrid.className = 'vrc-tools-avatar-grid';
        worldGrid.innerHTML = '<div class="vrc-tools-loading"><div class="vrc-tools-spinner"></div></div>';

        worldContent.appendChild(worldSearchContainer);
        worldContent.appendChild(worldGrid);

        // Settings Content
        const settingsSection = document.createElement('div');
        settingsSection.className = 'vrc-tools-settings-section';

        const settingsTitle = document.createElement('h3');
        settingsTitle.className = 'vrc-tools-settings-title';
        settingsTitle.textContent = 'General Settings';

        const settingsOption1 = document.createElement('div');
        settingsOption1.className = 'vrc-tools-settings-option';

        const settingsLabel1 = document.createElement('div');
        settingsLabel1.className = 'vrc-tools-settings-label';
        settingsLabel1.textContent = 'Enable notifications';

        const settingsDescription1 = document.createElement('div');
        settingsDescription1.className = 'vrc-tools-settings-description';
        settingsDescription1.textContent = 'Show notifications for chat messages and friend requests';

        settingsLabel1.appendChild(settingsDescription1);

        const settingsToggle1 = document.createElement('input');
        settingsToggle1.type = 'checkbox';
        settingsToggle1.checked = true;

        settingsOption1.appendChild(settingsLabel1);
        settingsOption1.appendChild(settingsToggle1);

        const settingsOption2 = document.createElement('div');
        settingsOption2.className = 'vrc-tools-settings-option';

        const settingsLabel2 = document.createElement('div');
        settingsLabel2.className = 'vrc-tools-settings-label';
        settingsLabel2.textContent = 'Dark mode';

        const settingsDescription2 = document.createElement('div');
        settingsDescription2.className = 'vrc-tools-settings-description';
        settingsDescription2.textContent = 'Enable dark mode interface';

        settingsLabel2.appendChild(settingsDescription2);

        const settingsToggle2 = document.createElement('input');
        settingsToggle2.type = 'checkbox';
        settingsToggle2.checked = true;

        settingsOption2.appendChild(settingsLabel2);
        settingsOption2.appendChild(settingsToggle2);

        settingsSection.appendChild(settingsTitle);
        settingsSection.appendChild(settingsOption1);
        settingsSection.appendChild(settingsOption2);

        settingsContent.appendChild(settingsSection);

        // Append all tab contents to content container
        contentContainer.appendChild(avatarsContent);
        contentContainer.appendChild(chatContent);
        contentContainer.appendChild(worldContent);
        contentContainer.appendChild(settingsContent);

        // Assemble the modal
        modal.appendChild(header);
        modal.appendChild(tabs);
        modal.appendChild(contentContainer);

        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'vrc-tools-toggle';
        toggleButton.appendChild(createSVGIcon(iconMaps["star"]));

        // Append to document
        document.body.appendChild(modal);
        document.body.appendChild(toggleButton);

        // Add event listeners
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        toggleButton.addEventListener('click', () => {
            modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
        });

        // Tab switching
        tabs.querySelectorAll('.vrc-tools-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.querySelectorAll('.vrc-tools-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const tabId = tab.dataset.tab;

                if (tabId === 'world') {
                    const worldGrid = document.querySelector('.vrc-tools-tab-content[data-tab="world"] .vrc-tools-avatar-grid');
                    worldGrid.innerHTML = '<div class="vrc-tools-loading"><div class="vrc-tools-spinner"></div></div>';

                    // Display a toast notification to show the source of the data
                    showToast('Loading Worlds', 'Fetching worlds from VRChat API: /api/1/worlds with system_approved tag', 'info');

                    fetchWorldData().then(worlds => {
                        displayWorlds(worlds, worldGrid);
                    }).catch(error => {
                        worldGrid.innerHTML = '<p>Error loading worlds. Please try again.</p>';
                        console.error("Error loading worlds:", error);
                    });
                }

                contentContainer.querySelectorAll('.vrc-tools-tab-content').forEach(content => {
                    if (content.dataset.tab === tabId) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });

        // Make modal draggable
        makeDraggable(modal, header);

        // Add chat functionality
        setupChat(chatInput, chatSendButton, chatLog);

        // Add avatar search functionality
        setupAvatarSearch(searchInput, searchButton, clearButton, avatarGrid);

        return modal;
    }

    // Make an element draggable by its header
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // Get mouse position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // Call function on cursor move
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calculate new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Set the element's new position
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Setup chat functionality
    function setupChat(chatInput, chatSendButton, chatLog) {
        // Connect to WebSocket
        if (!ws) {
            ws = new WebSocket('wss://piano.ourworldofpixels.com');

            ws.addEventListener("open", () => {
                ws.send(JSON.stringify([{
                    "m": "hi"
                }]));

                // Show a toast notification
                showToast('Chat Connected', 'Successfully connected to the chat server.', 'success');
            });

            ws.addEventListener("message", (e) => {
                try {
                    const data = JSON.parse(e.data)[0];

                    if (data.m === "hi") {
                        ws.send(JSON.stringify([{
                            m: "ch",
                            _id: "vrchat-tools",
                            set: undefined
                        }]));

                        // Keep connection alive
                        setInterval(() => {
                            ws.send(JSON.stringify([{
                                m: "t",
                                e: Date.now()
                            }]));
                        }, 20000);
                    }

                    if (data.m === "n" && data.n[0].n === "customChat") {
                        const chatData = JSON.parse(data.n[1].n);

                        const username = chatData.username;
                        const msg = chatData.msg;
                        const rankName = chatData.rankName;
                        const rankColor = chatData.rankColor;

                        if (msg && msg !== "") {
                            addChatMessage(rankName, rankColor, username, msg);
                        }
                    }
                } catch (error) {
                    console.error("WebSocket error:", error);
                }
            });

            ws.addEventListener("error", (e) => {
                showToast('Connection Error', 'Failed to connect to chat server. Please try again later.', 'error');
                console.error("WebSocket error:", e);
            });

            ws.addEventListener("close", () => {
                console.log("WebSocket closed");
            });
        }

        // Send message function
        function sendChatMessage() {
            const message = chatInput.value.trim();
            if (!message) return;

            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify([{
                    m: "n",
                    t: Date.now(),
                    n: [{
                        n: "customChat",
                        v: 0
                    }, {
                        n: JSON.stringify({
                            username: displayName,
                            msg: message,
                            rankName: trustRankName,
                            rankColor: trustRankColor
                        }),
                        d: 10,
                        v: 20
                    }]
                }]));

                addChatMessage(trustRankName, trustRankColor, displayName, message);
                chatInput.value = "";
            } else {
                showToast('Not Connected', 'Chat is not connected. Please try refreshing the page.', 'error');
            }
        }

        // Add message to chat log
        function addChatMessage(rankName, rankColor, username, message) {
            const messageElement = document.createElement('div');
            messageElement.className = 'vrc-tools-chat-message';

            const rankSpan = document.createElement('span');
            rankSpan.style.color = rankColor;
            rankSpan.style.fontWeight = 'bold';
            rankSpan.textContent = `[${rankName}] `;

            const nameSpan = document.createElement('span');
            nameSpan.style.color = '#800080';
            nameSpan.style.fontWeight = 'bold';
            nameSpan.textContent = `${username}: `;

            const messageSpan = document.createElement('span');
            messageSpan.textContent = message;

            messageElement.appendChild(rankSpan);
            messageElement.appendChild(nameSpan);
            messageElement.appendChild(messageSpan);

            chatLog.appendChild(messageElement);
            chatLog.scrollTop = chatLog.scrollHeight;

            // Limit chat messages
            while (chatLog.childNodes.length > 50) {
                chatLog.removeChild(chatLog.firstChild);
            }
        }

        // Add event listeners
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });

        chatSendButton.addEventListener('click', sendChatMessage);
    }

    // Setup avatar search functionality
    function setupAvatarSearch(searchInput, searchButton, clearButton, avatarGrid) {
        // Search function
        async function searchAvatars() {
            const searchTerm = searchInput.value.trim();
            if (!searchTerm) return;

            avatarGrid.innerHTML = '<div class="vrc-tools-loading"><div class="vrc-tools-spinner"></div></div>';

            try {
                const avatars = await fetchAndParseAvatarData(searchTerm);
                displayAvatars(JSON.parse(avatars));
            } catch (error) {
                avatarGrid.innerHTML = '<p>Error searching avatars. Please try again.</p>';
                console.error("Search error:", error);
            }
        }

        // Display avatars in grid
        function displayAvatars(avatars) {
            avatarGrid.innerHTML = '';

            if (avatars.length === 0) {
                avatarGrid.innerHTML = '<p>No avatars found matching your search.</p>';
                return;
            }

            avatars.forEach(avatar => {
                const card = document.createElement('div');
                card.className = 'vrc-tools-avatar-card';

                const img = document.createElement('img');
                img.className = 'vrc-tools-avatar-thumbnail';
                img.src = avatar.imageUrl || 'https://via.placeholder.com/300?text=No+Image';
                img.alt = avatar.avatarName;

                const info = document.createElement('div');
                info.className = 'vrc-tools-avatar-info';

                const name = document.createElement('h4');
                name.className = 'vrc-tools-avatar-name';
                name.textContent = avatar.avatarName;

                const author = document.createElement('p');
                author.className = 'vrc-tools-avatar-author';
                author.textContent = `By: ${avatar.authorName}`;

                const actions = document.createElement('div');
                actions.className = 'vrc-tools-avatar-actions';

                const viewButton = document.createElement('button');
                viewButton.className = 'vrc-tools-avatar-btn';
                viewButton.textContent = 'View';
                viewButton.addEventListener('click', () => {
                    window.open(`https://vrchat.com/home/avatar/${avatar.avatarId}`, '_blank');
                });

                const downloadButton = document.createElement('button');
                downloadButton.className = 'vrc-tools-avatar-btn primary';
                downloadButton.textContent = 'VRCA';
                downloadButton.addEventListener('click', () => {
                    if (avatar.vrcaUrl) {
                        window.open(avatar.vrcaUrl, '_blank');
                    } else {
                        showToast('Not Available', 'VRCA file is not available for this avatar.', 'error');
                    }
                });

                actions.appendChild(viewButton);
                actions.appendChild(downloadButton);

                info.appendChild(name);
                info.appendChild(author);
                info.appendChild(actions);

                card.appendChild(img);
                card.appendChild(info);

                avatarGrid.appendChild(card);
            });
        }

        // Add event listeners
        searchButton.addEventListener('click', searchAvatars);

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchAvatars();
            }
        });

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            avatarGrid.innerHTML = '';
        });
    }

    // Show toast notification
    function showToast(title, message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `vrc-tools-toast ${type}`;

        const iconPath = type === 'success' ? iconMaps["star"] :
                        type === 'error' ? iconMaps["times"] : iconMaps["world"];

        const icon = createSVGIcon(iconPath, 'vrc-tools-toast-icon');

        const content = document.createElement('div');
        content.className = 'vrc-tools-toast-content';

        const titleElement = document.createElement('div');
        titleElement.className = 'vrc-tools-toast-title';
        titleElement.textContent = title;

        const messageElement = document.createElement('div');
        messageElement.textContent = message;

        const closeButton = document.createElement('button');
        closeButton.className = 'vrc-tools-toast-close';
        closeButton.appendChild(createSVGIcon(iconMaps["times"]));

        content.appendChild(titleElement);
        content.appendChild(messageElement);

        toast.appendChild(icon);
        toast.appendChild(content);
        toast.appendChild(closeButton);

        document.body.appendChild(toast);

        closeButton.addEventListener('click', () => {
            toast.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.style.animation = 'slideOut 0.3s forwards';
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }
        }, 5000);
    }

    // Fetch user data from VRChat API
    async function fetchUserData() {
        try {
            const response = await fetch("https://vrchat.com/api/1/auth/user", {
                headers: {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const user = await response.json();
            displayName = user.displayName;

            // Determine trust rank
            const tags = user.tags;

            if (tags.includes("admin_moderator")) {
                trustRankColor = "#FF0000";
                trustRankName = "Administrator";
            } else if (tags.includes("system_trust_veteran") && tags.includes("system_trust_trusted")) {
                trustRankColor = "#800080";
                trustRankName = "Trusted";
            } else if (tags.includes("system_trust_trusted") && tags.includes("system_trust_known") && !tags.includes("system_trust_basic")) {
                trustRankColor = "#FFD700";
                trustRankName = "Known";
            } else if (tags.includes("system_trust_basic") && tags.includes("system_trust_known")) {
                trustRankColor = "#90EE90";
                trustRankName = "User";
            } else if (tags.includes("system_trust_basic")) {
                trustRankColor = "#ADD8E6";
                trustRankName = "New User";
            } else {
                trustRankColor = "#F5F5F5";
                trustRankName = "Visitor";
            }

            return user;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    }

    // Initialize the extension
    async function init() {
        injectCSS();

        // Fetch user data
        await fetchUserData();

        // Create and add toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'vrc-tools-toggle';
        toggleBtn.title = 'VRChat Enhanced Tools';
        toggleBtn.appendChild(createSVGIcon(iconMaps["star"]));
        document.body.appendChild(toggleBtn);

        // Create modal (initially hidden)
        const modal = createModal();

        // Add click event to toggle button
        toggleBtn.addEventListener('click', () => {
            modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
        });
    }

    // Wait for page to load
    window.addEventListener('load', () => {
        // Only run on VRChat website
        if (window.location.hostname === 'vrchat.com') {
            setTimeout(init, 2000); // Delay to ensure page is fully loaded
        }
    });

    async function fetchAndParseAvatarData(searchName) {
        try {
            const url = 'https://raw.githubusercontent.com/Snoofz/Snowly-VRC-Tools/main/JxLN772OoP.json';
            const response = await fetch(url);
            const data = await response.json();

            const filteredAvatars = data.filter(avatar =>
                                                avatar.avatarName.toLowerCase().includes(searchName.toLowerCase())
                                               );

            const avatarData = filteredAvatars.map(avatar => ({
                imageUrl: avatar.thumbnailUrl,
                avatarName: avatar.avatarName,
                avatarId: avatar.avatarId,
                avatarDescription: `Wearer: ${avatar.wearer}, Stealer: ${avatar.stealer}`,
                vrcaUrl: avatar.vrca,
                authorName: avatar.authorName
            }));

            return JSON.stringify(avatarData, null, 2);
        } catch (error) {
            console.error('Error fetching or parsing data:', error);
        }
    }

    function parseHTMLToJSON(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const results = [];

        const avatarCards = doc.querySelectorAll('.card-dark');
        avatarCards.forEach(card => {
            const name = card.querySelector('.card-text').textContent.trim();
            const description = card.querySelector('.card-text.text-break').textContent.trim();
            const id = card.querySelector('.card-text.text-muted').textContent.trim();
            const author = card.querySelector('.text-muted').nextElementSibling.textContent.trim();
            const thumbnail = card.querySelector('.card-img-top').src;

            const avatar = {
                name: name,
                description: description,
                id: id,
                author: author,
                thumbnail: thumbnail
            };

            results.push(avatar);
        });

        return JSON.stringify(results, null, 2);
    }

    function fetchUserLocation(username) {
        fetch("https://vrchat.com/api/1/users/usr_afcc65d6-fc6f-4fbd-b1a6-d57db556a7b4", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://vrchat.com/home/user/usr_afcc65d6-fc6f-4fbd-b1a6-d57db556a7b4",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(res => res.json()).then(json => {
            if (json.location == "offline" || json.location == "private") {

            }
        });
    }
})();
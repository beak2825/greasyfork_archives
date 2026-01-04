// ==UserScript==
// @name         Enhanced Danbooru Tag Exporter
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Export multiple tags from Danbooru's page to .txt files with flexible naming options, ordered export(descending/ascending)
// @author       iMrdx
// @match        https://danbooru.donmai.us/*
// @grant        GM_download
// @grant        GM.addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      Apache License
// @icon         https://cdn.donmai.us/sample/d2/4d/__hatsune_miku_vocaloid_drawn_by_icon_315__sample-d24d819e95764ab46d5cb147294bb941.jpg
// @downloadURL https://update.greasyfork.org/scripts/518979/Enhanced%20Danbooru%20Tag%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/518979/Enhanced%20Danbooru%20Tag%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DELAY = 2000;
    const THEME_KEY = 'danbooru-exporter-theme';

    // Core functionality
    const escapeBracketsAndFormatTags = (tag) =>
        tag.replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/_/g, " ");

    const sortAndFormatTags = (post) => {
        const tags = {
            artist: post.tag_string_artist ? post.tag_string_artist.split(" ") : [],
            copyright: post.tag_string_copyright ? post.tag_string_copyright.split(" ") : [],
            character: post.tag_string_character ? post.tag_string_character.split(" ") : [],
            general: post.tag_string_general ? post.tag_string_general.split(" ") : []
        };

        const formattedSections = Object.entries(tags)
            .filter(([, tagArray]) => tagArray.length > 0)
            .map(([category, tagArray]) => ({
                category,
                formatted: tagArray.map(escapeBracketsAndFormatTags).join(", ")
            }))
            .map(section => section.formatted);

        return formattedSections.join(", ");
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Enhanced fetch function with progress tracking
    async function fetchTagsDescending(startPage, endPage, namingOption, isDescending = true, progressCallback) {
        let currentPage = startPage;
        let postCounter = 1;
        const totalPages = Math.abs(endPage - startPage) + 1;
        let processedPages = 0;

        while (isDescending ? currentPage >= endPage : currentPage <= endPage) {
            console.log(`Fetching page ${currentPage}...`);
            processedPages++;
            progressCallback((processedPages / totalPages) * 100);

            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set("page", currentPage);
            const url = `${window.location.origin}/posts.json?${urlParams.toString()}&limit=20&order=id_${isDescending ? "desc" : "asc"}`;

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const posts = await response.json();

                if (posts.length === 0) {
                    console.log("No more posts found.");
                    break;
                }
for (const post of posts) {
                    const postId = post.id;
                    const formattedTags = sortAndFormatTags(post);

                    let fileName;
                    switch (namingOption) {
                        case "Post ID":
                            fileName = `${postId}.txt`;
                            break;
                        case "Post ID with Tags":
                            fileName = `${postId}_${formattedTags.replace(/, /g, "_").replace(/ /g, "_")}.txt`;
                            break;
                        case "Number from Latest":
                            fileName = `(${postCounter}).txt`;
                            break;
                        case "Number from Oldest":
                            const totalPosts = Math.abs(startPage - endPage + 1) * 20;
                            fileName = `(${totalPosts - postCounter + 1}).txt`;
                            break;
                        default:
                            fileName = `post_${postId}.txt`;
                    }

                    GM_download({
                        url: `data:text/plain;charset=utf-8,${encodeURIComponent(formattedTags)}`,
                        name: fileName,
                        saveAs: false
                    });

                    console.log(`Saved tags for post ${postId} to ${fileName}`);
                    postCounter++;
                }

                await sleep(DELAY);
                currentPage += isDescending ? -1 : 1;

            } catch (error) {
                console.error(`Error processing page ${currentPage}:`, error);
                showNotification('error', `Error processing page ${currentPage}: ${error.message}`);
                break;
            }
        }

        showNotification('success', 'Tag export complete!');
        progressCallback(100);
    }

    // Enhanced notification system with new styling
    function showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `exporter-notification ${type}`;
        notification.innerHTML = `
            <i class="fa ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Enhanced theme management with transition effects
    function toggleTheme() {
        const container = document.getElementById('tag-exporter-ui');
        const isDark = container.classList.toggle('dark-theme');
        GM_setValue(THEME_KEY, isDark);
        return isDark;
    }

    // Enhanced UI creation with new layout
    const createUI = () => {
        const container = document.createElement('div');
        container.id = "tag-exporter-ui";
        container.className = GM_getValue(THEME_KEY, false) ? 'dark-theme' : '';

        container.innerHTML = `
            <div id="exporter-header">
                <div class="header-left">
                    <h3><i class="fa fa-tags"></i> Tag Exporter</h3>
                    <span class="version-badge">v2.0.1</span>
                </div>
                <div class="header-right">
                    <button id="theme-toggle" class="icon-button" title="Toggle Theme">
                        <i class="fa fa-moon"></i>
                    </button>
                    <button id="minimize-button" class="icon-button" title="Minimize">
                        <i class="fa fa-minus"></i>
                    </button>
                </div>
            </div>
            <div id="exporter-body">
                <div class="input-group">
                    <label for="start-page">Start Page</label>
                    <input type="number" id="start-page" min="1" placeholder="Enter start page">
                </div>
                <div class="input-group">
                    <label for="end-page">End Page</label>
                    <input type="number" id="end-page" min="1" placeholder="Enter end page">
                </div>
                <div class="input-group">
                    <label for="naming-option">File Naming</label>
                    <select id="naming-option">
                        <option value="Post ID">Post ID</option>
                        <option value="Post ID with Tags">Post ID with Tags</option>
                        <option value="Number from Latest">Number from Latest</option>
                        <option value="Number from Oldest">Number from Oldest</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="order-option">Order</label>
                    <select id="order-option">
                        <option value="Descending">Descending</option>
                        <option value="Ascending">Ascending</option>
                    </select>
                </div>
                <div class="progress-container hidden">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <span class="progress-text">0%</span>
                </div>
                <button id="export-button" class="pulse">
                    <i class="fa fa-download"></i>
                    <span>Export Tags</span>
                </button>
            </div>
        `;

        document.body.appendChild(container);
        initializeEventListeners();
    };
// Event listeners initialization
    function initializeEventListeners() {
        const container = document.getElementById('tag-exporter-ui');
        const minimizeButton = document.querySelector('#minimize-button');
        const exporterBody = document.querySelector('#exporter-body');
        const exportButton = document.querySelector('#export-button');
        const themeToggle = document.querySelector('#theme-toggle');
        const header = document.querySelector('#exporter-header');

        minimizeButton.addEventListener('click', () => {
            const isMinimized = exporterBody.classList.toggle('hidden');
            minimizeButton.innerHTML = isMinimized ?
                '<i class="fa fa-plus"></i>' :
                '<i class="fa fa-minus"></i>';
            container.classList.toggle('minimized');
        });

        themeToggle.addEventListener('click', () => {
            const isDark = toggleTheme();
            themeToggle.innerHTML = isDark ?
                '<i class="fa fa-sun"></i>' :
                '<i class="fa fa-moon"></i>';
        });

        // Enhanced drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.closest('#exporter-header')) {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                isDragging = true;
                container.style.transition = 'none';
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                setTranslate(currentX, currentY, container);
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            container.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        // Export functionality with enhanced feedback
        exportButton.addEventListener('click', async () => {
            const startPage = parseInt(document.querySelector('#start-page').value, 10);
            const endPage = parseInt(document.querySelector('#end-page').value, 10);
            const namingOption = document.querySelector('#naming-option').value;
            const isDescending = document.querySelector('#order-option').value === 'Descending';

            if (isNaN(startPage) || isNaN(endPage) || startPage < 1 || endPage < 1) {
                showNotification('error', 'Please enter valid page numbers.');
                return;
            }

            const progressContainer = document.querySelector('.progress-container');
            const progressBar = document.querySelector('.progress-fill');
            const progressText = document.querySelector('.progress-text');

            progressContainer.classList.remove('hidden');
            exportButton.disabled = true;
            exportButton.classList.remove('pulse');

            try {
                await fetchTagsDescending(startPage, endPage, namingOption, isDescending, (percent) => {
                    progressBar.style.width = `${percent}%`;
                    progressText.textContent = `${Math.round(percent)}%`;
                });
            } catch (error) {
                showNotification('error', 'Export failed: ' + error.message);
            } finally {
                exportButton.disabled = false;
                exportButton.classList.add('pulse');
                setTimeout(() => {
                    progressContainer.classList.add('hidden');
                    progressBar.style.width = '0%';
                    progressText.textContent = '0%';
                }, 2000);
            }
        });
    }

    // Enhanced styles with glassmorphism and animations
    GM.addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

        #tag-exporter-ui {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 340px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            font-family: 'Poppins', sans-serif;
            z-index: 10000;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255, 255, 255, 0.18);
        }

        #tag-exporter-ui.dark-theme {
            background: rgba(45, 45, 45, 0.85);
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.08);
        }

        #tag-exporter-ui.minimized {
            width: 220px;
        }

        #exporter-header {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            padding: 16px 20px;
            border-radius: 16px 16px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dark-theme #exporter-header {
            background: linear-gradient(135deg, #388E3C, #2E7D32);
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .header-left h3 {
            color: white;
            font-size: 16px;
            font-weight: 600;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .version-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            color: white;
        }

        #exporter-body {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .input-group label {
            color: #555;
            font-size: 13px;
            font-weight: 500;
            margin-left: 2px;
        }

        .dark-theme .input-group label {
            color: #ddd;
        }

        input, select {
            padding: 10px 14px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            font-size: 14px;
            font-family: 'Poppins', sans-serif;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            transition: all 0.2s;
        }

        .dark-theme input,
        .dark-theme select {
            background: rgba(60, 60, 60, 0.9);
            border-color: rgba(255, 255, 255, 0.1);
            color: #fff;
        }

        input:focus, select:focus {
            border-color: #4CAF50;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
            outline: none;
        }

        .icon-button {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .icon-button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
        }

        #export-button {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            font-family: 'Poppins', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s;
        }

        #export-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
        }

        #export-button:disabled {
            background: linear-gradient(135deg, #ccc, #bbb);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .dark-theme #export-button:disabled {
            background: linear-gradient(135deg, #555, #444);
        }

        .progress-container {
            background: rgba(245, 245, 245, 0.9);
            border-radius: 8px;
            padding: 2px;
            position: relative;
            height: 24px;
            transition: all 0.3s;
        }

        .dark-theme .progress-container {
            background: rgba(60, 60, 60, 0.9);
        }

        .progress-bar {
            width: 100%;
            height: 100%;
            background: rgba(240, 240, 240, 0.9);
            border-radius: 6px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            transition: width 0.3s ease;
            border-radius: 6px;
        }

        .progress-text {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            font-weight: 500;
            color: #666;
        }

        .dark-theme .progress-text {
            color: #fff;
        }

        .exporter-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 14px 20px;
            border-radius: 12px;
            color: white;
            font-size: 14px;
            z-index: 10001;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            font-family: 'Poppins', sans-serif;
        }

        .exporter-notification.success {
            background: rgba(76, 175, 80, 0.95);
        }

        .exporter-notification.error {
            background: rgba(244, 67, 54, 0.95);
        }

        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
            }
        }

        .pulse {
            animation: pulse 2s infinite;
        }

        .hidden {
            display: none !important;
        }
    `);

    // Initialize the UI
    createUI();
})();
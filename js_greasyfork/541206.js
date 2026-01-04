// ==UserScript==
// @name         SubsPlease New Show Tracker & Enhancer 🌟
// @namespace    http://tampermonkey.net/
// @version      19.3
// @description  Highlights new anime releases on SubsPlease with color-coded episodes, thumbnail previews, enhanced download buttons, and direct search links to Nyaa and MyAnimeList
// @author       Zotikus1001
// @license      MIT
// @match        https://subsplease.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541206/SubsPlease%20New%20Show%20Tracker%20%20Enhancer%20%F0%9F%8C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/541206/SubsPlease%20New%20Show%20Tracker%20%20Enhancer%20%F0%9F%8C%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Only run on main page
    const currentURL = window.location.href;
    if (currentURL.includes('/shows/') ||
        currentURL.includes('/schedule/') ||
        currentURL.includes('/xdcc/') ||
        !currentURL.match(/https:\/\/subsplease\.org\/?$/)) {
        return;
    }

    // Styles
    const styles = `
        /* Episode 01 Highlight */
        .release-item.episode-01-highlight {
            border-radius: 8px !important;
            border: none !important;
            transform: scale(1.01) !important;
            transition: all 0.3s ease !important;
            position: relative !important;
            z-index: 1000 !important;
            margin: 3px !important;
            padding: 8px !important;
        }

        .release-item.episode-01-highlight:hover {
            transform: scale(1.03) !important;
        }

        .release-item.episode-01-highlight a {
            color: #000 !important;
            font-weight: bold !important;
        }

        .release-item.episode-01-highlight::before {
            display: none !important;
        }

        /* Thumbnail overlay badge */
        .new-episode-thumbnail-badge {
            position: absolute !important;
            left: 8px !important;
            top: 8px !important;
            background: rgba(255, 71, 87, 0.95) !important;
            color: white !important;
            padding: 3px 8px !important;
            border-radius: 12px !important;
            font-size: 9px !important;
            font-weight: bold !important;
            border: 2px solid white !important;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) !important;
            z-index: 999999 !important;
            pointer-events: none !important;
            animation: fade-in-out 2s ease-in-out infinite alternate !important;
        }

        .release-item.not-interested-show {
            position: relative !important;
        }

        @keyframes fade-in-out {
            0% { opacity: 0.8; transform: scale(1); }
            100% { opacity: 1; transform: scale(1.05); }
        }

        /* Subsequent Episodes */
        .release-item.episode-02-highlight {
            border-radius: 6px !important;
            border: none !important;
            box-shadow: 0 0 8px currentColor !important;
            transform: scale(1.005) !important;
            transition: all 0.3s ease !important;
            z-index: 999 !important;
            margin: 2px !important;
            padding: 6px !important;
        }

        .release-item.episode-03-highlight {
            border-radius: 4px !important;
            border: none !important;
            box-shadow: 0 0 5px currentColor !important;
            transition: all 0.3s ease !important;
            z-index: 998 !important;
            margin: 2px !important;
            padding: 4px !important;
        }

        .release-item.episode-other-highlight {
            border-radius: 3px !important;
            border: none !important;
            box-shadow: 0 0 3px currentColor !important;
            transition: all 0.3s ease !important;
            z-index: 997 !important;
            margin: 2px !important;
            padding: 2px !important;
        }

        .release-item.episode-02-highlight a,
        .release-item.episode-03-highlight a,
        .release-item.episode-other-highlight a {
            color: #000 !important;
            font-weight: bold !important;
        }

        .release-item.episode-02-highlight:hover,
        .release-item.episode-03-highlight:hover,
        .release-item.episode-other-highlight:hover {
            transform: scale(1.02) !important;
            filter: brightness(1.1) !important;
        }

        /* Lower version styling */
        .release-item.lower-version {
            opacity: 0.4 !important;
            filter: grayscale(0.6) !important;
            transform: scale(0.98) !important;
            border-style: dashed !important;
        }

        .release-item.lower-version::after {
            content: "⚠️ OLD" !important;
            position: absolute !important;
            top: 2px !important;
            left: 2px !important;
            background: rgba(255, 152, 0, 0.8) !important;
            color: white !important;
            padding: 1px 4px !important;
            border-radius: 3px !important;
            font-size: 8px !important;
            font-weight: bold !important;
            z-index: 1001 !important;
        }

        /* Dynamic thumbnail container */
        .episode-thumbnail-container {
            float: left !important;
            margin-right: 12px !important;
            margin-top: 4px !important;
            margin-bottom: 4px !important;
        }

        .episode-thumbnail {
            max-width: 104px !important;
            max-height: 78px !important;
            object-fit: contain !important;
            border-radius: 4px !important;
            opacity: 0.8 !important;
            transition: all 0.3s ease !important;
            border: 1px solid rgba(255,255,255,0.3) !important;
            display: block !important;
            cursor: pointer !important;
        }

        .episode-thumbnail:hover {
            opacity: 1 !important;
            transform: scale(1.05) !important;
            border: 2px solid rgba(255,255,255,0.8) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        }

        .episode-thumbnail-placeholder {
            max-width: 104px !important;
            max-height: 78px !important;
            width: 58px !important;
            height: 78px !important;
            background: rgba(255,255,255,0.05) !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
            border-radius: 4px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: rgba(255,255,255,0.3) !important;
            font-size: 10px !important;
            font-weight: bold !important;
            transition: all 0.3s ease !important;
        }

        .episode-thumbnail-placeholder:hover {
            background: rgba(255,255,255,0.08) !important;
            border-color: rgba(255,255,255,0.4) !important;
            color: rgba(255,255,255,0.5) !important;
        }

        .release-item.has-thumbnail {
            min-height: 90px !important;
            overflow: hidden !important;
        }

        .release-item.has-thumbnail::after {
            content: "" !important;
            display: table !important;
            clear: both !important;
        }

        /* Enhanced button styling */
        .badge-wrapper a,
        .badge-wrapper span {
            color: white !important;
            padding: 4px 8px !important;
            margin: 2px !important;
            border-radius: 4px !important;
            text-decoration: none !important;
            font-weight: bold !important;
            font-size: 11px !important;
            text-align: center !important;
            display: inline-block !important;
            vertical-align: middle !important;
            box-sizing: border-box !important;
            transition: all 0.2s ease !important;
            min-width: 50px !important;
            height: 24px !important;
            line-height: 16px !important;
            position: relative !important;
        }

        .badge-wrapper a[href*="480p"] {
            background: #28a745 !important;
            color: white !important;
            padding: 4px 4px 4px 22px !important;
            min-width: 60px !important;
        }

        .badge-wrapper a[href*="480p"]:hover {
            background: #218838 !important;
            transform: scale(1.05) !important;
        }

        .badge-wrapper a[href*="480p"]::before {
            content: "📱 " !important;
            position: absolute !important;
            left: 6px !important;
        }

        .badge-wrapper a[href*="720p"] {
            background: #007bff !important;
            color: white !important;
            padding: 4px 4px 4px 22px !important;
            min-width: 60px !important;
        }

        .badge-wrapper a[href*="720p"]:hover {
            background: #0056b3 !important;
            transform: scale(1.05) !important;
        }

        .badge-wrapper a[href*="720p"]::before {
            content: "🖥️ " !important;
            position: absolute !important;
            left: 6px !important;
        }

        .badge-wrapper a[href*="1080p"] {
            background: #6f42c1 !important;
            color: white !important;
            padding: 4px 4px 4px 22px !important;
            min-width: 65px !important;
        }

        .badge-wrapper a[href*="1080p"]:hover {
            background: #563d7c !important;
            transform: scale(1.05) !important;
        }

        .badge-wrapper a[href*="1080p"]::before {
            content: "🎬 " !important;
            position: absolute !important;
            left: 6px !important;
        }

        .badge-wrapper a[href*="xdcc"] {
            background: #6c757d !important;
            color: #adb5bd !important;
            font-weight: normal !important;
            opacity: 0.7 !important;
            padding: 4px 4px 4px 22px !important;
            min-width: 60px !important;
        }

        .badge-wrapper a[href*="xdcc"]:hover {
            background: #5a6268 !important;
            opacity: 0.9 !important;
            transform: scale(1.05) !important;
        }

        .badge-wrapper a[href*="xdcc"]::before {
            content: "📦 " !important;
            position: absolute !important;
            left: 6px !important;
        }

        .badge-wrapper a.nyaa-search-link {
            background: #e67e22 !important;
            color: white !important;
            padding: 4px 4px 4px 22px !important;
            min-width: 60px !important;
        }

        .badge-wrapper a.nyaa-search-link:hover {
            background: #d35400 !important;
            transform: scale(1.05) !important;
        }

        .badge-wrapper a.nyaa-search-link::before {
            content: "" !important;
            position: absolute !important;
            left: 6px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            width: 14px !important;
            height: 14px !important;
            background-image: url('https://nyaa.si/static/favicon.png') !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
        }

        .badge-wrapper a.mal-search-link {
            background: #2e51a2 !important;
            color: white !important;
            padding: 4px 4px 4px 22px !important;
            min-width: 55px !important;
        }

        .badge-wrapper a.mal-search-link:hover {
            background: #1d439b !important;
            transform: scale(1.05) !important;
        }

        .badge-wrapper a.mal-search-link::before {
            content: "" !important;
            position: absolute !important;
            left: 6px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            width: 14px !important;
            height: 14px !important;
            background-image: url('https://cdn.myanimelist.net/images/favicon.svg') !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
        }

        .watch-list-controls {
            display: flex !important;
            gap: 4px !important;
            margin-top: 8px !important;
            opacity: 0 !important;
            transition: opacity 0.2s ease !important;
        }

        .release-item:hover .watch-list-controls {
            opacity: 1 !important;
        }

        .watch-list-btn {
            padding: 3px 6px !important;
            font-size: 9px !important;
            border: none !important;
            border-radius: 3px !important;
            cursor: pointer !important;
            color: white !important;
            font-weight: bold !important;
            transition: all 0.2s ease !important;
            white-space: nowrap !important;
        }

        .watch-list-btn:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        }

        .watch-btn-watching {
            background: #27ae60 !important;
        }

        .watch-btn-watching:hover {
            background: #229954 !important;
        }

        .watch-btn-considering {
            background: #f39c12 !important;
        }

        .watch-btn-considering:hover {
            background: #e67e22 !important;
        }

        .watch-btn-plan {
            background: #9b59b6 !important;
        }

        .watch-btn-plan:hover {
            background: #8e44ad !important;
        }

        .watch-btn-not-interested {
            background: #7f8c8d !important;
        }

        .watch-btn-not-interested:hover {
            background: #5d6d7e !important;
        }

        .watch-btn-remove {
            background: #e74c3c !important;
        }

        .watch-btn-remove:hover {
            background: #c0392b !important;
        }

        .episode-thumbnail.status-watching,
        .episode-thumbnail-placeholder.status-watching {
            box-shadow: 0 0 12px #27ae60 !important;
            border: 2px solid #27ae60 !important;
        }

        .episode-thumbnail.status-considering,
        .episode-thumbnail-placeholder.status-considering {
            box-shadow: 0 0 12px #f39c12 !important;
            border: 2px solid #f39c12 !important;
        }

        .episode-thumbnail.status-plan,
        .episode-thumbnail-placeholder.status-plan {
            box-shadow: 0 0 12px #9b59b6 !important;
            border: 2px solid #9b59b6 !important;
        }

        .episode-thumbnail.status-not-interested,
        .episode-thumbnail-placeholder.status-not-interested {
            opacity: 0.3 !important;
            filter: grayscale(0.8) !important;
        }

        .episode-counter {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            padding: 10px 15px !important;
            border-radius: 25px !important;
            font-weight: bold !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
            z-index: 100000 !important;
            font-family: Arial, sans-serif !important;
        }

        .found-list {
            position: fixed !important;
            top: 70px !important;
            right: 20px !important;
            width: 450px !important;
            max-height: 600px !important;
            background: rgba(0,0,0,0.9) !important;
            color: white !important;
            padding: 15px !important;
            border-radius: 10px !important;
            font-size: 13px !important;
            overflow-y: auto !important;
            z-index: 100001 !important;
            font-family: Arial, sans-serif !important;
            border: 1px solid rgba(0, 255, 136, 0.3) !important;
        }

        .found-list h3 {
            margin: 0 0 12px 0 !important;
            color: #4ecdc4 !important;
            font-size: 14px !important;
        }

        .found-entry {
            margin-bottom: 5px !important;
            padding: 8px 10px !important;
            background: rgba(255,255,255,0.1) !important;
            border-radius: 5px !important;
            font-size: 12px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            line-height: 1.3 !important;
        }

        .found-entry:hover {
            background: rgba(0, 255, 136, 0.3) !important;
            transform: translateX(3px) !important;
            box-shadow: 0 2px 8px rgba(0, 255, 136, 0.4) !important;
        }

        .debug-toggle {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            background: rgba(0,0,0,0.8) !important;
            color: white !important;
            padding: 8px 15px !important;
            border-radius: 20px !important;
            font-size: 11px !important;
            cursor: pointer !important;
            z-index: 100002 !important;
            font-family: Arial, sans-serif !important;
            border: 1px solid rgba(255,255,255,0.3) !important;
            transition: all 0.2s ease !important;
        }

        .debug-toggle:hover {
            background: rgba(0, 255, 136, 0.2) !important;
            border-color: #00ff88 !important;
            transform: scale(1.05) !important;
        }

        .debug-toggle.debug-on {
            background: rgba(255, 71, 87, 0.8) !important;
            border-color: #ff4757 !important;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-2px) rotate(1deg); }
            50% { transform: translateY(-4px) rotate(0deg); }
            75% { transform: translateY(-2px) rotate(-1deg); }
        }
    `;

    let scanCount = 0;
    let foundEpisodes = [];
    let showsWithEp01 = new Set();
    let debugMode = localStorage.getItem('subsplease-debug-mode') === 'true';

    const colors = [
        '#ff7675', '#00b894', '#6c5ce7', '#fdcb6e', '#74b9ff', '#e17055', '#a29bfe', '#00cec9',
        '#ff6348', '#2ed573', '#5352ed', '#ffa502', '#ff6b9d', '#20bf6b', '#c44569', '#7bed9f',
        '#f0932b', '#70a1ff', '#eb4d4b', '#4b7bec', '#f8b500', '#48dbfb', '#778ca3', '#95afc0',
        '#ff9ff3', '#dda0dd', '#535c68', '#ffeaa7', '#fab1a0', '#81ecec', '#fd79a8', '#55a3ff'
    ];

    let usedColors = new Map();
    let showColors = new Map();

    function getShowColor(showName, index) {
        if (showColors.has(showName)) {
            return showColors.get(showName);
        }

        let hash = 0;
        for (let i = 0; i < showName.length; i++) {
            hash = ((hash << 5) - hash) + showName.charCodeAt(i);
        }

        let colorIndex = Math.abs(hash) % colors.length;
        let selectedColor = colors[colorIndex];

        const prevColor = usedColors.get(index - 1);
        const nextColor = usedColors.get(index + 1);

        let attempts = 0;
        while (attempts < colors.length &&
               (isSimilarColor(selectedColor, prevColor) || isSimilarColor(selectedColor, nextColor))) {
            colorIndex = (colorIndex + 7) % colors.length;
            selectedColor = colors[colorIndex];
            attempts++;
        }

        usedColors.set(index, selectedColor);
        showColors.set(showName, selectedColor);
        return selectedColor;
    }

    function getDimmedColor(baseColor, episodeNumber) {
        const hex = baseColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const dimFactor = Math.pow(0.6, episodeNumber - 1);
        const minBrightness = 0.5;
        const actualDimFactor = Math.max(dimFactor, minBrightness);

        const newR = Math.round(r * actualDimFactor);
        const newG = Math.round(g * actualDimFactor);
        const newB = Math.round(b * actualDimFactor);

        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }

    function isSimilarColor(color1, color2) {
        if (!color1 || !color2) return false;

        const colorFamilies = {
            red: ['#ff7675', '#ff6348', '#eb4d4b', '#ff6b9d', '#c44569', '#fd79a8'],
            blue: ['#74b9ff', '#70a1ff', '#4b7bec', '#48dbfb', '#55a3ff'],
            purple: ['#6c5ce7', '#a29bfe', '#5352ed', '#ff9ff3', '#dda0dd'],
            green: ['#00b894', '#00cec9', '#2ed573', '#20bf6b', '#7bed9f'],
            orange: ['#fdcb6e', '#e17055', '#ffa502', '#f0932b', '#f8b500', '#fab1a0'],
            yellow: ['#ffeaa7'],
            gray: ['#778ca3', '#95afc0', '#535c68'],
            cyan: ['#81ecec']
        };

        for (let family of Object.values(colorFamilies)) {
            if (family.includes(color1) && family.includes(color2)) {
                return true;
            }
        }
        return false;
    }

    function debugLog(...args) {
        if (debugMode) console.log(...args);
    }

    function parseEpisode(text) {
        const match = text.match(/(.+?)\s*—\s*(\d{1,3})(v(\d+))?/i);
        if (match) {
            return {
                showName: match[1].trim(),
                episodeNumber: parseInt(match[2]),
                version: match[4] ? parseInt(match[4]) : 1,
                hasVersion: !!match[4]
            };
        }
        return null;
    }

    function generateMALURL(showName) {
        const encodedShow = encodeURIComponent(showName);
        return `https://myanimelist.net/anime.php?q=${encodedShow}&cat=anime`;
    }

    function generateNyaaURL(showName, episodeNumber) {
        const encodedShow = encodeURIComponent(showName).replace(/%20/g, '+');
        const epNum = String(episodeNumber).padStart(2, '0');
        const episodePattern = `%28${epNum}%7CE${epNum}%7CS01E${epNum}%29`;
        return `https://nyaa.si/?f=0&c=1_2&q=${encodedShow}+${episodePattern}`;
    }

    const STORAGE_KEY = 'subsplease-watchlist';

    function getWatchList() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Error reading watch list:', e);
            return {};
        }
    }

    function saveWatchList(watchList) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(watchList));
        } catch (e) {
            console.error('Error saving watch list:', e);
        }
    }

    function setWatchStatus(showName, status) {
        const watchList = getWatchList();
        if (status === 'remove') {
            delete watchList[showName];
        } else {
            watchList[showName] = status;
        }
        saveWatchList(watchList);
        updateAllThumbnailGlows();
        updateWatchButtons(showName);
    }

    function updateWatchButtons(showName) {
        const containers = document.querySelectorAll('#releases-table .release-item');
        containers.forEach(container => {
            const link = container.querySelector('a');
            if (!link) return;

            const text = link.textContent || '';
            const episodeInfo = parseEpisode(text);
            if (!episodeInfo || episodeInfo.showName !== showName) return;

            const existingControls = container.querySelector('.watch-list-controls');
            if (existingControls) {
                existingControls.remove();
            }

            const badgeWrapper = container.querySelector('.badge-wrapper');
            if (!badgeWrapper) return;

            const currentStatus = getWatchStatus(episodeInfo.showName);
            const watchControls = document.createElement('div');
            watchControls.className = 'watch-list-controls';

            const watchingBtn = document.createElement('button');
            watchingBtn.className = 'watch-list-btn watch-btn-watching';
            watchingBtn.textContent = '+ Watching';
            watchingBtn.onclick = (e) => {
                e.preventDefault();
                setWatchStatus(episodeInfo.showName, 'watching');
            };

            const consideringBtn = document.createElement('button');
            consideringBtn.className = 'watch-list-btn watch-btn-considering';
            consideringBtn.textContent = '+ Considering';
            consideringBtn.onclick = (e) => {
                e.preventDefault();
                setWatchStatus(episodeInfo.showName, 'considering');
            };

            const planBtn = document.createElement('button');
            planBtn.className = 'watch-list-btn watch-btn-plan';
            planBtn.textContent = '+ Plan To Watch';
            planBtn.onclick = (e) => {
                e.preventDefault();
                setWatchStatus(episodeInfo.showName, 'plan');
            };

            const notInterestedBtn = document.createElement('button');
            notInterestedBtn.className = 'watch-list-btn watch-btn-not-interested';
            notInterestedBtn.textContent = '+ Not Interested';
            notInterestedBtn.onclick = (e) => {
                e.preventDefault();
                setWatchStatus(episodeInfo.showName, 'not-interested');
            };

            watchControls.appendChild(watchingBtn);
            watchControls.appendChild(consideringBtn);
            watchControls.appendChild(planBtn);
            watchControls.appendChild(notInterestedBtn);

            if (currentStatus) {
                const removeBtn = document.createElement('button');
                removeBtn.className = 'watch-list-btn watch-btn-remove';
                removeBtn.textContent = '- Remove';
                removeBtn.onclick = (e) => {
                    e.preventDefault();
                    setWatchStatus(episodeInfo.showName, 'remove');
                };
                watchControls.appendChild(removeBtn);
            }

            badgeWrapper.appendChild(watchControls);
        });
    }

    function getWatchStatus(showName) {
        const watchList = getWatchList();
        return watchList[showName] || null;
    }

    function updateAllThumbnailGlows() {
        const containers = document.querySelectorAll('#releases-table .release-item');
        containers.forEach(container => {
            const link = container.querySelector('a');
            if (!link) return;

            const text = link.textContent || '';
            const episodeInfo = parseEpisode(text);
            if (!episodeInfo) return;

            const status = getWatchStatus(episodeInfo.showName);
            const thumbnail = container.querySelector('.episode-thumbnail, .episode-thumbnail-placeholder');

            if (thumbnail) {
                thumbnail.classList.remove('status-watching', 'status-considering', 'status-plan', 'status-not-interested');
                if (status === 'watching') {
                    thumbnail.classList.add('status-watching');
                } else if (status === 'considering') {
                    thumbnail.classList.add('status-considering');
                } else if (status === 'plan') {
                    thumbnail.classList.add('status-plan');
                } else if (status === 'not-interested') {
                    thumbnail.classList.add('status-not-interested');
                }
            }

            if (status === 'not-interested') {
                container.classList.remove('episode-01-highlight', 'episode-02-highlight', 'episode-03-highlight', 'episode-other-highlight');
                container.classList.add('not-interested-show');
                container.style.removeProperty('background-color');
                container.style.removeProperty('box-shadow');
            } else {
                container.classList.remove('not-interested-show');
            }
        });
    }

    function manageVersions(containers) {
        const episodeMap = new Map();

        containers.forEach(container => {
            const link = container.querySelector('a');
            if (!link) return;

            const text = link.textContent || '';
            const episodeInfo = parseEpisode(text);

            if (episodeInfo) {
                const key = `${episodeInfo.showName}-${episodeInfo.episodeNumber}`;

                if (!episodeMap.has(key)) {
                    episodeMap.set(key, { containers: [], maxVersion: 0 });
                }

                const entry = episodeMap.get(key);
                entry.containers.push({ container, episodeInfo });
                entry.maxVersion = Math.max(entry.maxVersion, episodeInfo.version);
            }
        });

        episodeMap.forEach((entry) => {
            if (entry.containers.length > 1) {
                entry.containers.forEach(({ container, episodeInfo }) => {
                    if (episodeInfo.version < entry.maxVersion) {
                        container.classList.add('lower-version');
                    }
                });
            }
        });
    }

    function highlightEpisodes() {
        scanCount++;
        debugLog(`🔍 === SCAN ${scanCount} ===`);

        usedColors.clear();

        const containers = document.querySelectorAll('#releases-table .release-item');
        if (containers.length === 0) return;

        debugLog(`🔍 Found ${containers.length} containers`);

        manageVersions(containers);

        const showsWithEp01Temp = new Set();
        const episodeCountPerShow = new Map();

        containers.forEach(container => {
            const link = container.querySelector('a');
            if (!link) return;

            const text = link.textContent || '';
            if (/^\d+p$/.test(text.trim()) || text.trim() === 'XDCC' || text.trim() === 'New!' || text.length < 5) {
                return;
            }

            if (container.classList.contains('lower-version')) return;

            const episodeInfo = parseEpisode(text);
            if (episodeInfo && (episodeInfo.episodeNumber === 0 || episodeInfo.episodeNumber === 1)) {
                showsWithEp01Temp.add(episodeInfo.showName);
            }
        });

        containers.forEach(container => {
            const link = container.querySelector('a');
            if (!link) return;

            const text = link.textContent || '';
            if (/^\d+p$/.test(text.trim()) || text.trim() === 'XDCC' || text.trim() === 'New!' || text.length < 5) {
                return;
            }

            if (container.classList.contains('lower-version')) return;

            const episodeInfo = parseEpisode(text);
            if (episodeInfo && showsWithEp01Temp.has(episodeInfo.showName)) {
                const currentMax = episodeCountPerShow.get(episodeInfo.showName) || 0;
                episodeCountPerShow.set(episodeInfo.showName, Math.max(currentMax, episodeInfo.episodeNumber));
            }
        });

        let newCount = 0;
        let newEpisodes = [];
        let containerIndex = 0;

        containers.forEach(container => {
            const link = container.querySelector('a');
            if (!link) return;

            const text = link.textContent || '';

            if (/^\d+p$/.test(text.trim()) || text.trim() === 'XDCC' || text.trim() === 'New!' || text.length < 5) {
                return;
            }

            if (container.classList.contains('lower-version')) {
                return;
            }

            const previewUrl = link.getAttribute('data-preview-image');
            if (previewUrl && !container.querySelector('.episode-thumbnail') && !container.querySelector('.episode-thumbnail-placeholder')) {
                const thumbnailContainer = document.createElement('div');
                thumbnailContainer.className = 'episode-thumbnail-container';

                const isPlaceholder = previewUrl.includes('image-coming-soon-placeholder.png') ||
                                     previewUrl === 'https://subsplease.org' ||
                                     previewUrl === 'https://subsplease.org/';

                if (isPlaceholder) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'episode-thumbnail-placeholder';
                    placeholder.textContent = 'NO IMG YET';
                    thumbnailContainer.appendChild(placeholder);
                } else {
                    const thumbnail = document.createElement('img');
                    thumbnail.src = previewUrl;
                    thumbnail.className = 'episode-thumbnail';
                    thumbnail.alt = 'Episode thumbnail';
                    thumbnail.onerror = function() {
                        thumbnailContainer.style.display = 'none';
                    };

                    Array.from(link.attributes).forEach(attr => {
                        if (attr.name.startsWith('data-')) {
                            thumbnail.setAttribute(attr.name, attr.value);
                        }
                    });

                    thumbnailContainer.appendChild(thumbnail);
                }

                container.insertBefore(thumbnailContainer, container.firstChild);
                container.classList.add('has-thumbnail');
            }

            const episodeInfo = parseEpisode(text);
            const isMovieOrSpecial = !text.includes('—');

            if (episodeInfo || isMovieOrSpecial) {
                const badgeWrapper = container.querySelector('.badge-wrapper');
                if (badgeWrapper) {
                    if (!container.querySelector('.nyaa-search-link')) {
                        let nyaaURL;
                        if (episodeInfo) {
                            nyaaURL = generateNyaaURL(episodeInfo.showName, episodeInfo.episodeNumber);
                        } else {
                            const encodedTitle = encodeURIComponent(text).replace(/%20/g, '+');
                            nyaaURL = `https://nyaa.si/?f=0&c=1_2&q=${encodedTitle}`;
                        }
                        const nyaaLink = document.createElement('a');
                        nyaaLink.href = nyaaURL;
                        nyaaLink.target = '_blank';
                        nyaaLink.className = 'nyaa-search-link';
                        nyaaLink.textContent = 'NYAA';
                        nyaaLink.title = episodeInfo ?
                            `Search "${episodeInfo.showName} ${String(episodeInfo.episodeNumber).padStart(2, '0')}" on Nyaa` :
                            `Search "${text}" on Nyaa`;
                        badgeWrapper.appendChild(nyaaLink);
                    }

                    if (!container.querySelector('.mal-search-link')) {
                        const malURL = episodeInfo ? generateMALURL(episodeInfo.showName) : generateMALURL(text);
                        const malLink = document.createElement('a');
                        malLink.href = malURL;
                        malLink.target = '_blank';
                        malLink.className = 'mal-search-link';
                        malLink.textContent = 'MAL';
                        malLink.title = episodeInfo ?
                            `Search "${episodeInfo.showName}" on MyAnimeList` :
                            `Search "${text}" on MyAnimeList`;
                        badgeWrapper.appendChild(malLink);
                    }

                    if (!container.querySelector('.watch-list-controls')) {
                        const showNameForButtons = episodeInfo ? episodeInfo.showName : text;
                        const currentStatus = getWatchStatus(showNameForButtons);
                        const watchControls = document.createElement('div');
                        watchControls.className = 'watch-list-controls';

                        const watchingBtn = document.createElement('button');
                        watchingBtn.className = 'watch-list-btn watch-btn-watching';
                        watchingBtn.textContent = '+ Watching';
                        watchingBtn.onclick = (e) => {
                            e.preventDefault();
                            setWatchStatus(showNameForButtons, 'watching');
                        };

                        const consideringBtn = document.createElement('button');
                        consideringBtn.className = 'watch-list-btn watch-btn-considering';
                        consideringBtn.textContent = '+ Considering';
                        consideringBtn.onclick = (e) => {
                            e.preventDefault();
                            setWatchStatus(showNameForButtons, 'considering');
                        };

                        const planBtn = document.createElement('button');
                        planBtn.className = 'watch-list-btn watch-btn-plan';
                        planBtn.textContent = '+ Plan To Watch';
                        planBtn.onclick = (e) => {
                            e.preventDefault();
                            setWatchStatus(showNameForButtons, 'plan');
                        };

                        const notInterestedBtn = document.createElement('button');
                        notInterestedBtn.className = 'watch-list-btn watch-btn-not-interested';
                        notInterestedBtn.textContent = '+ Not Interested';
                        notInterestedBtn.onclick = (e) => {
                            e.preventDefault();
                            setWatchStatus(showNameForButtons, 'not-interested');
                        };

                        watchControls.appendChild(watchingBtn);
                        watchControls.appendChild(consideringBtn);
                        watchControls.appendChild(planBtn);
                        watchControls.appendChild(notInterestedBtn);

                        if (currentStatus) {
                            const removeBtn = document.createElement('button');
                            removeBtn.className = 'watch-list-btn watch-btn-remove';
                            removeBtn.textContent = '- Remove';
                            removeBtn.onclick = (e) => {
                                e.preventDefault();
                                setWatchStatus(showNameForButtons, 'remove');
                            };
                            watchControls.appendChild(removeBtn);
                        }

                        badgeWrapper.appendChild(watchControls);
                    }
                }
            }

            if (!episodeInfo && !isMovieOrSpecial) {
                containerIndex++;
                return;
            }

            if (episodeInfo && (episodeInfo.episodeNumber === 0 || episodeInfo.episodeNumber === 1) && !container.classList.contains('episode-01-highlight')) {
                container.classList.add('episode-01-highlight');

                if (!foundEpisodes.includes(text.trim())) {
                    newCount++;
                    newEpisodes.push(text.trim());
                }

                showsWithEp01.add(episodeInfo.showName);

                const color = getShowColor(episodeInfo.showName, containerIndex);
                container.style.setProperty('background-color', color, 'important');

                if (!container.querySelector('.new-episode-thumbnail-badge')) {
                    const thumbnailBadge = document.createElement('div');
                    thumbnailBadge.className = 'new-episode-thumbnail-badge';
                    thumbnailBadge.textContent = 'NEW';
                    container.appendChild(thumbnailBadge);
                }

                debugLog(`✅ Episode ${episodeInfo.episodeNumber === 0 ? '00' : '01'}: "${text}" (${color})`);
            } else if (isMovieOrSpecial && !episodeInfo && !container.classList.contains('episode-01-highlight')) {
                container.classList.add('episode-01-highlight');

                if (!foundEpisodes.includes(text.trim())) {
                    newCount++;
                    newEpisodes.push(text.trim());
                }

                const color = getShowColor(text, containerIndex);
                container.style.setProperty('background-color', color, 'important');

                if (!container.querySelector('.new-episode-thumbnail-badge')) {
                    const thumbnailBadge = document.createElement('div');
                    thumbnailBadge.className = 'new-episode-thumbnail-badge';
                    thumbnailBadge.textContent = 'NEW';
                    container.appendChild(thumbnailBadge);
                }

                debugLog(`🎬 Movie/Special: "${text}" (${color})`);
            } else if (episodeInfo && episodeInfo.episodeNumber > 1 && showsWithEp01Temp.has(episodeInfo.showName)) {
                const maxEpisode = episodeCountPerShow.get(episodeInfo.showName) || 1;

                if (maxEpisode <= 5) {
                    let highlightClass = '';
                    if (episodeInfo.episodeNumber === 2) highlightClass = 'episode-02-highlight';
                    else if (episodeInfo.episodeNumber === 3) highlightClass = 'episode-03-highlight';
                    else if (episodeInfo.episodeNumber >= 4) highlightClass = 'episode-other-highlight';

                    if (highlightClass && !container.classList.contains(highlightClass)) {
                        container.classList.add(highlightClass);

                        const baseColor = getShowColor(episodeInfo.showName, containerIndex);
                        const dimmedColor = getDimmedColor(baseColor, episodeInfo.episodeNumber);

                        container.style.setProperty('background-color', dimmedColor, 'important');
                        container.style.setProperty('box-shadow', `0 0 ${highlightClass.includes('02') ? '8' : highlightClass.includes('03') ? '5' : '3'}px ${dimmedColor}`, 'important');

                        debugLog(`📺 Episode ${episodeInfo.episodeNumber}: "${text}" (${dimmedColor})`);
                    }
                }
            }

            containerIndex++;
        });

        foundEpisodes = [...foundEpisodes, ...newEpisodes];
        foundEpisodes = [...new Set(foundEpisodes)];
        showsWithEp01 = new Set([...showsWithEp01, ...showsWithEp01Temp]);
        updateCounter();
        updateList();
        updateAllThumbnailGlows();

        debugLog(`🔍 Scan ${scanCount}: Found ${newCount} new episode 01s (Total: ${foundEpisodes.length})`);
    }

    function updateCounter() {
        let counter = document.querySelector('.episode-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'episode-counter';
            document.body.appendChild(counter);
        }
        counter.innerHTML = `🆕 New Shows: ${foundEpisodes.length}`;
    }

    function updateList() {
        let list = document.querySelector('.found-list');
        if (!list) {
            list = document.createElement('div');
            list.className = 'found-list';
            document.body.appendChild(list);
        }

        const unique = [...new Set(foundEpisodes)];
        const lowerCount = document.querySelectorAll('.release-item.lower-version').length;

        list.innerHTML = `
            <h3>🆕 New Show's Found</h3>
            ${lowerCount > 0 ? `<div style="color: #ffa502; font-size: 11px; margin-bottom: 8px;">⚠️ ${lowerCount} older version(s) dimmed</div>` : ''}
            ${unique.length === 0 ? '<div>No episode 01s found yet...</div>' :
              unique.map(ep => `<div class="found-entry" data-episode="${ep}">🎯 ${ep}</div>`).join('')}
        `;

        const entries = list.querySelectorAll('.found-entry');
        entries.forEach(entry => {
            entry.addEventListener('click', function() {
                const episodeName = this.getAttribute('data-episode');
                scrollToEpisode(episodeName);
            });
        });
    }

    function scrollToEpisode(episodeName) {
        const containers = document.querySelectorAll('#releases-table .release-item.episode-01-highlight, #releases-table .release-item.episode-02-highlight, #releases-table .release-item.episode-03-highlight, #releases-table .release-item.episode-other-highlight');

        for (let container of containers) {
            const link = container.querySelector('a');
            if (link && link.textContent.trim() === episodeName) {
                container.scrollIntoView({ behavior: 'smooth', block: 'center' });

                const originalBoxShadow = container.style.boxShadow;
                container.style.boxShadow = '0 0 30px #fff, 0 0 60px #00ffff, 0 0 90px #00ff88';
                container.style.transform = 'scale(1.05)';

                setTimeout(() => {
                    container.style.boxShadow = originalBoxShadow;
                    container.style.transform = 'scale(1.01)';
                }, 800);

                break;
            }
        }
    }

    function createDebugToggle() {
        let toggle = document.querySelector('.debug-toggle');
        if (!toggle) {
            toggle = document.createElement('div');
            toggle.className = 'debug-toggle';
            document.body.appendChild(toggle);

            toggle.addEventListener('click', function() {
                debugMode = !debugMode;
                localStorage.setItem('subsplease-debug-mode', debugMode.toString());
                updateDebugToggle();
            });
        }
        updateDebugToggle();
    }

    function updateDebugToggle() {
        const toggle = document.querySelector('.debug-toggle');
        if (toggle) {
            toggle.textContent = debugMode ? '🔧 Debug: ON' : '🔧 Debug: OFF';
            toggle.className = `debug-toggle ${debugMode ? 'debug-on' : ''}`;
        }
    }

    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;

        xhr.open = function(method, url) {
            if (url.includes('api/?f=latest')) {
                xhr.addEventListener('load', function() {
                    setTimeout(highlightEpisodes, 1000);
                });
            }
            return originalOpen.apply(this, arguments);
        };

        return xhr;
    };

    function init() {
        debugLog('🌟 SubsPlease New Show Tracker starting...');

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        createDebugToggle();

        setTimeout(highlightEpisodes, 1000);
        setTimeout(highlightEpisodes, 3000);
        setTimeout(updateAllThumbnailGlows, 3500);

        const observer = new MutationObserver(function(mutations) {
            let tableChanged = false;
            mutations.forEach(function(mutation) {
                if (mutation.target.id === 'releases-table' || mutation.target.closest('#releases-table')) {
                    tableChanged = true;
                }
            });
            if (tableChanged) {
                setTimeout(highlightEpisodes, 300);
            }
        });

        const table = document.querySelector('#releases-table');
        if (table) {
            observer.observe(table, { childList: true, subtree: true });
        }

        setInterval(highlightEpisodes, 10000);

        debugLog('🌟 Tracker activated!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('load', function() {
        setTimeout(highlightEpisodes, 2000);
    });

})();
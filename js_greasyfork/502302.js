// ==UserScript==
// @name        Enhanced HTML5 Video Loop Controller with Network Request Monitoring
// @namespace   EnhancedHTML5VideoLoop
// @version     7.0
// @description Adds movable and resizable loop control, file info display, save/load loop intervals, collapsible UI, hide button, block certain files, and supports multiple bookmarks to HTML5 videos. Also monitors network requests.
// @author      dagger
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @match        *://*/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502302/Enhanced%20HTML5%20Video%20Loop%20Controller%20with%20Network%20Request%20Monitoring.user.js
// @updateURL https://update.greasyfork.org/scripts/502302/Enhanced%20HTML5%20Video%20Loop%20Controller%20with%20Network%20Request%20Monitoring.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOCAL_STORAGE_KEY = 'videoLoopIntervals';
    const BLOCKED_FILES_KEY = 'blockedFiles';
    const NETWORK_REQUESTS = new Set();

    let options = {
        blockedFiles: {
            'example.jp': ['td.mp4', '.*\.exe$'],
            'example.net': ['thumb.mp4', '.*\.exe$'],
            'example.com': ['preview.mp4', '.*\.exe$'],
            'default': ['*preview*.mp4']
        },
        initialWidth: '250px',
        initialHeight: '300px'
    };

    // Load blocked files from storage
    const storedBlockedFiles = GM_getValue(BLOCKED_FILES_KEY);
    if (storedBlockedFiles) {
        options.blockedFiles = JSON.parse(storedBlockedFiles);
    }

    const style = `
        .video-loop-controller, #networkRequestDisplayContainer, #sequenceDisplayContainer {
            position: fixed;
            background: rgba(0,0,0,0.7);
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            resize: both;
            overflow: auto;
        }
        .video-loop-controller {
            bottom: 10px;
            right: 10px;
            width: ${options.initialWidth};
            height: ${options.initialHeight};
        }
        .video-loop-controller.collapsed .controller-content { display: none; }
        .video-loop-controller input[type="text"],
        .video-loop-controller button,
        .video-loop-controller select {
            font-size: 12px;
            height: 20px;
            line-height: 20px;
            background: #333;
            color: #fff;
            border: 1px solid #555;
        }
        .video-loop-controller .toggle-collapse,
        .video-loop-controller .hide-ui {
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            color: #fff;
            cursor: pointer;
        }
        .video-loop-controller .bookmark-list {
            max-height: 100px;
            overflow-y: auto;
        }
        .video-loop-controller .loop-on {
            background: #4CAF50;
            color: #fff;
            box-shadow: 0 0 5px #4CAF50;
        }
        .status-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            background: rgba(0,0,0,0.7);
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 16px;
            text-align: center;
        }
        .drag-handle {
            cursor: move;
            user-select: none;
            padding: 5px;
            background: rgba(255,255,255,0.1);
            margin-bottom: 5px;
        }
        #networkRequestDisplayContainer {
            bottom: 60px;
            right: 20px;
            width: 250px;
            height: 20px;
            white-space: nowrap;
            overflow-x: auto;
        }
        #sequenceDisplayContainer {
            bottom: 300px;
            right: 20px;
            width: 250px;
            max-height: 200px;
        }
        #toggleButton, #toggleSequenceButton {
            position: fixed;
            padding: 5px 10px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10000;
        }
        #toggleButton {
            bottom: 10px;
            right: 20px;
        }
        #toggleSequenceButton {
            bottom: 270px;
            right: 20px;
        }
        .networkRequestItem {
            display: inline-block;
            margin-right: 10px;
        }
        #bookmarkListPage {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 80%;
            background: rgba(0,0,0,0.9);
            color: #fff;
            padding: 20px;
            border-radius: 10px;
            z-index: 10001;
            overflow-y: auto;
        }
        #bookmarkListPage h2 {
            margin-top: 0;
        }
        #bookmarkListPage ul {
            list-style-type: none;
            padding: 0;
        }
        #bookmarkListPage li {
            margin-bottom: 10px;
        }
        #bookmarkListPage a {
            color: #4CAF50;
            text-decoration: none;
        }
        #bookmarkListPage a:hover {
            text-decoration: underline;
        }
        #closeBookmarkList {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: #fff;
            font-size: 20px;
            cursor: pointer;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = style;
    document.head.appendChild(styleElement);

    function formatTime(seconds) {
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    }

    function parseTimeInput(timeStr) {
        const parts = timeStr.split(':').map(part => parseInt(part, 10));
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 1 && !isNaN(parts[0])) return parts[0];
        return null;
    }

    function createController(video, index) {
        const controller = document.createElement('div');
        controller.className = 'video-loop-controller';
        controller.innerHTML = `
            <div class="drag-handle">Video Loop Controller</div>
            <button class="toggle-collapse">-</button>
            <button class="hide-ui">x</button>
            <div class="controller-content">
                <div>
                    <input type="text" id="start-time" value="00:00:00">
                    <button id="set-start">🅰</button>
                </div>
                <div>
                    <input type="text" id="end-time" value="${formatTime(video.duration || 0)}">
                    <button id="set-end">🅱</button>
                </div>
                <div>
                    <button id="toggle-loop">🔃</button>
                </div>
                <div>
                    <input type="text" id="bookmark-name">
                    <button id="save-interval">💾</button>
                </div>
                <div>
                    <select id="bookmark-list" class="bookmark-list"></select>
                    <button id="load-interval">読込</button>
                </div>
                <div id="time-display"></div>
                <div id="file-info"></div>
                <div id="network-requests" style="white-space: nowrap; overflow-x: auto;"></div>
                <button id="copy-requests">Copy Network Requests</button>
            </div>
        `;

        let startTime = 0;
        let endTime = video.duration || 0;
        let loopEnabled = false;

        const startInput = controller.querySelector('#start-time');
        const endInput = controller.querySelector('#end-time');
        const loopButton = controller.querySelector('#toggle-loop');
        const saveButton = controller.querySelector('#save-interval');
        const loadButton = controller.querySelector('#load-interval');
        const bookmarkList = controller.querySelector('#bookmark-list');
        const bookmarkNameInput = controller.querySelector('#bookmark-name');
        const timeDisplay = controller.querySelector('#time-display');
        const fileInfoDisplay = controller.querySelector('#file-info');
        const toggleCollapseButton = controller.querySelector('.toggle-collapse');
        const hideUIButton = controller.querySelector('.hide-ui');
        const copyRequestsButton = controller.querySelector('#copy-requests');
        const networkRequestsDisplay = controller.querySelector('#network-requests');

        function setInitialBookmarkName() {
            let title = document.title;
            title = title.replace(/^[A-Za-z0-9-]+\s*[-–]\s*/, '');

            const src = video.currentSrc || video.src;
            const fileName = src.split('/').pop().split('?')[0];

            const bookmarkName = `${title} - ${fileName}`;

            bookmarkNameInput.value = bookmarkName;
        }

        setInitialBookmarkName();

        function updateTimeDisplay() {
            timeDisplay.textContent = `${formatTime(startTime)} - ${formatTime(endTime)}`;
        }

        function updateFileInfo() {
            const src = video.currentSrc || video.src;
            const match = src.match(/(\d+)\.ts/);
            fileInfoDisplay.textContent = match ? `File: ${match[0]}` : `File: ${src.split('/').pop()}`;
        }

        function setTime(isStart) {
            const currentTime = video.currentTime;
            if (isStart) {
                startTime = currentTime;
                startInput.value = formatTime(startTime);
            } else {
                endTime = currentTime;
                endInput.value = formatTime(endTime);
            }
            updateTimeDisplay();
            showStatus(`${isStart ? '開始' : '終了'}時間を ${formatTime(currentTime)} に設定しました`);
        }
        function saveInterval() {
            const url = window.location.href;
            const name = bookmarkNameInput.value || `Bookmark ${bookmarkList.options.length + 1}`;
            const intervals = GM_getValue(LOCAL_STORAGE_KEY, []);
            intervals.push({ url, name, index, start: startTime, end: endTime });

            // 重複排除を実行
            const uniqueIntervals = uniqueInterval(intervals);

            GM_setValue(LOCAL_STORAGE_KEY, uniqueIntervals);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(uniqueIntervals));
            showStatus('区間を保存しました');
            loadBookmarks();
        }

 /*
  区間配列から重複を排除する関数
  @param {Array} intervals 区間配列
  @returns {Array} 重複が排除された区間配列
 */
        function uniqueInterval(intervals) {
            const seen = new Set();
            return intervals.filter(interval => {
                const key = `${interval.url}-${interval.start}-${interval.end}`;
                if (seen.has(key)) {
                    return false; // 重複している場合は除外
                }
                seen.add(key);
                return true; // 重複していない場合は含める
            });
        }
        function loadBookmarks() {
            const url = window.location.href;
            const intervals = GM_getValue(LOCAL_STORAGE_KEY, []);
            // 重複排除を実行
            const uniqueIntervals = uniqueInterval(intervals);
            bookmarkList.innerHTML = '';
            intervals.filter(interval => interval.url === url && interval.index === index).forEach(interval => {
                const option = document.createElement('option');
                option.value = JSON.stringify(interval);
                option.textContent = interval.name;
                bookmarkList.appendChild(option);
            });
        }

        function loadInterval() {
            const selected = bookmarkList.options[bookmarkList.selectedIndex];
            if (selected) {
                const interval = JSON.parse(selected.value);
                startTime = interval.start;
                endTime = interval.end;
                startInput.value = formatTime(startTime);
                endInput.value = formatTime(endTime);
                updateTimeDisplay();
                showStatus('区間を読み込みました');
                setLoopEnabled(true);
            } else {
                showStatus('保存された区間が見つかりません');
            }
        }

        function setLoopEnabled(enabled) {
            loopEnabled = enabled;
            loopButton.textContent = '🔃';
            loopButton.className = loopEnabled ? 'loop-on' : 'loop-off';
            showStatus(loopEnabled ? 'ループを有効にしました' : 'ループを無効にしました');
        }

        function showStatus(message) {
            const statusPopup = document.createElement('div');
            statusPopup.className = 'status-popup';
            statusPopup.textContent = message;
            document.body.appendChild(statusPopup);
            setTimeout(() => statusPopup.remove(), 2000);
        }

        startInput.addEventListener('input', () => {
            startTime = parseTimeInput(startInput.value) || 0;
            updateTimeDisplay();
        });

        endInput.addEventListener('input', () => {
            endTime = parseTimeInput(endInput.value) || video.duration;
            updateTimeDisplay();
        });

        controller.querySelector('#set-start').addEventListener('click', () => setTime(true));
        controller.querySelector('#set-end').addEventListener('click', () => setTime(false));
        loopButton.addEventListener('click', () => setLoopEnabled(!loopEnabled));
        saveButton.addEventListener('click', saveInterval);
        loadButton.addEventListener('click', loadInterval);
        copyRequestsButton.addEventListener('click', copyNetworkRequests);

        video.addEventListener('timeupdate', () => {
            if (loopEnabled && video.currentTime >= endTime) {
                video.currentTime = startTime;
            }
            updateFileInfo();
        });

        video.addEventListener('loadedmetadata', () => {
            endTime = video.duration;
            endInput.value = formatTime(endTime);
            updateTimeDisplay();
            updateFileInfo();
        });

        video.addEventListener('loadstart', updateFileInfo);

        updateTimeDisplay();
        updateFileInfo();
        loadBookmarks();

        toggleCollapseButton.addEventListener('click', () => {
            controller.classList.toggle('collapsed');
            toggleCollapseButton.textContent = controller.classList.contains('collapsed') ? '+' : '-';
        });

        hideUIButton.addEventListener('click', () => {
            controller.style.display = 'none';
        });

        // コントローラーを移動可能・サイズ変更可能にする
        let isDragging = false;
        let isResizing = false;
        let dragOffsetX, dragOffsetY;

        controller.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('drag-handle')) {
                isDragging = true;
                dragOffsetX = e.clientX - controller.offsetLeft;
                dragOffsetY = e.clientY - controller.offsetTop;
            } else if (e.target === controller) {
                isResizing = true;
                dragOffsetX = controller.clientWidth - e.clientX;
                dragOffsetY = controller.clientHeight - e.clientY;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                let newLeft = e.clientX - dragOffsetX;
                let newTop = e.clientY - dragOffsetY;

                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - controller.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - controller.offsetHeight));

                controller.style.left = newLeft + 'px';
                controller.style.top = newTop + 'px';
            } else if (isResizing) {
                let newWidth = e.clientX + dragOffsetX;
                let newHeight = e.clientY + dragOffsetY;

                newWidth = Math.max(200, Math.min(newWidth, window.innerWidth - controller.offsetLeft));
                newHeight = Math.max(200, Math.min(newHeight, window.innerHeight - controller.offsetTop));

                controller.style.width = newWidth + 'px';
                controller.style.height = newHeight + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            isResizing = false;
        });

        return controller;
    }

    function addControllerToVideos() {
        const videos = document.getElementsByTagName('video');
        Array.from(videos).forEach((video, index) => {
            if (video.dataset.controllerAdded) return;
            if (video.duration && video.duration < 20) return; // 20秒未満の動画はスキップ

            const src = video.currentSrc || video.src;
            if (src && !isBlockedFile(src)) {
                const controller = createController(video, index);
                document.body.appendChild(controller);
                video.dataset.controllerAdded = 'true';
            }
        });
    }

    function isBlockedFile(src) {
        const hostname = window.location.hostname;
        const blockedPatterns = options.blockedFiles[hostname] || options.blockedFiles['default'];
        return blockedPatterns.some(pattern => {
            const regex = new RegExp(pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*'));
            return regex.test(src);
        });
    }

    function exportIntervalsToCSV() {
        const intervals = GM_getValue(LOCAL_STORAGE_KEY, []);
        let csv = 'URL,INDEX,BOOKMARK_NAME,START,END\n';
        intervals.forEach(interval => {
            csv += `${interval.url},${interval.index},"${interval.name}",${interval.start},${interval.end}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "video_intervals.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    function importIntervalsFromCSV() {
        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = '200px';
        textarea.placeholder = 'Paste CSV content here...';

        const importButton = document.createElement('button');
        importButton.textContent = 'Import';
        importButton.onclick = () => {
            const csv = textarea.value;
            const lines = csv.split('\n');
            const intervals = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',');
                if (values.length === 5) {
                    intervals.push({
                        url: values[0],
                        index: parseInt(values[1]),
                        name: values[2].replace(/"/g, ''),
                        start: parseFloat(values[3]),
                        end: parseFloat(values[4])
                    });
                }
            }
            GM_setValue(LOCAL_STORAGE_KEY, intervals);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(intervals));
            alert('インターバルをインポートしました');
            importDialog.remove();
        };

        const importDialog = document.createElement('div');
        importDialog.style.position = 'fixed';
        importDialog.style.top = '50%';
        importDialog.style.left = '50%';
        importDialog.style.transform = 'translate(-50%, -50%)';
        importDialog.style.background = 'white';
        importDialog.style.padding = '20px';
        importDialog.style.border = '1px solid black';
        importDialog.style.zIndex = '10000';

        importDialog.appendChild(textarea);
        importDialog.appendChild(importButton);
        document.body.appendChild(importDialog);
    }

    function exportBlockedFiles() {
        const blob = new Blob([JSON.stringify(options.blockedFiles, null, 2)], { type: 'application/json' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "blocked_files.json");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    function importBlockedFiles() {
        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = '200px';
        textarea.placeholder = 'Paste JSON content here...';

        const importButton = document.createElement('button');
        importButton.textContent = 'Import';
        importButton.onclick = () => {
            try {
                const json = JSON.parse(textarea.value);
                options.blockedFiles = json;
                GM_setValue(BLOCKED_FILES_KEY, JSON.stringify(json));
                alert('ブロックされたファイルをインポートしました');
                importDialog.remove();
            } catch (e) {
                alert('Invalid JSON format');
            }
        };

        const importDialog = document.createElement('div');
        importDialog.style.position = 'fixed';
        importDialog.style.top = '50%';
        importDialog.style.left = '50%';
        importDialog.style.transform = 'translate(-50%, -50%)';
        importDialog.style.background = 'white';
        importDialog.style.padding = '20px';
        importDialog.style.border = '1px solid black';
        importDialog.style.zIndex = '10000';

        importDialog.appendChild(textarea);
        importDialog.appendChild(importButton);
        document.body.appendChild(importDialog);
    }

    function showBookmarkListPage() {
        const intervals = GM_getValue(LOCAL_STORAGE_KEY, []);
        const groupedIntervals = {};

        intervals.forEach(interval => {
            const domain = new URL(interval.url).hostname;
            if (!groupedIntervals[domain]) {
                groupedIntervals[domain] = [];
            }
            groupedIntervals[domain].push(interval);
        });

        const bookmarkListPage = document.createElement('div');
        bookmarkListPage.id = 'bookmarkListPage';
        bookmarkListPage.innerHTML = `
            <h2>Bookmark List</h2>
            <button id="closeBookmarkList">×</button>
            <div id="bookmarkList"></div>
        `;

        const bookmarkList = bookmarkListPage.querySelector('#bookmarkList');
        Object.keys(groupedIntervals).sort().forEach(domain => {
            const domainHeader = document.createElement('h3');
            domainHeader.textContent = domain;
            bookmarkList.appendChild(domainHeader);

            const ul = document.createElement('ul');
            groupedIntervals[domain].forEach(interval => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = interval.url;
                a.textContent = interval.name;
                a.target = '_blank';
                li.appendChild(a);
                ul.appendChild(li);
            });
            bookmarkList.appendChild(ul);
        });

        document.body.appendChild(bookmarkListPage);

        document.getElementById('closeBookmarkList').addEventListener('click', () => {
            bookmarkListPage.remove();
        });
    }

    // ネットワークリクエスト監視関連の機能
    function displayNetworkRequest(method, url) {
        NETWORK_REQUESTS.add(url);
        const controllers = document.querySelectorAll('.video-loop-controller');
        controllers.forEach(controller => {
            const networkRequestsDisplay = controller.querySelector('#network-requests');
            networkRequestsDisplay.textContent = Array.from(NETWORK_REQUESTS).join(', ');
        });
    }

    function monitorFetchRequests() {
        var originalFetch = window.fetch;
        window.fetch = function() {
            var method = arguments[1] ? arguments[1].method : 'GET';
            var url = arguments[0];
            if (method === 'GET' && isMediaRequest(url)) {
                displayNetworkRequest(method, url);
            }
            return originalFetch.apply(this, arguments);
        };
    }

    function monitorXHRRequests() {
        var originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (method === 'GET' && isMediaRequest(url)) {
                displayNetworkRequest(method, url);
            }
            originalOpen.apply(this, arguments);
        };
    }

    function isMediaRequest(url) {
        return url.match(/\.(jpeg|jpg|png|gif|mp4|webm|mp3|wav|ts)$/i);
    }

    function copyNetworkRequests() {
        const requests = Array.from(NETWORK_REQUESTS).join('\n');
        navigator.clipboard.writeText(requests).then(() => {
            showStatus('ネットワークリクエストをクリップボードにコピーしました');
        }, () => {
            showStatus('クリップボードへのコピーに失敗しました');
        });
    }

    // ブラウザストレージとスクリプトストレージの同期
    function syncStorage() {
        const localIntervals = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        const gmIntervals = GM_getValue(LOCAL_STORAGE_KEY, []);

        // マージして重複を除去
        const mergedIntervals = [...new Set([...localIntervals, ...gmIntervals])];

        // 両方に保存
        ;
        GM_setValue(LOCAL_STORAGE_KEY, mergedIntervals);
    }

    // メニューコマンドの登録
    GM_registerMenuCommand("インターバルをエクスポート", exportIntervalsToCSV);
    GM_registerMenuCommand("インターバルをインポート", importIntervalsFromCSV);
    GM_registerMenuCommand("ブロックされたファイルをエクスポート", exportBlockedFiles);
    GM_registerMenuCommand("ブロックされたファイルをインポート", importBlockedFiles);
    GM_registerMenuCommand("ブックマークリストを表示", showBookmarkListPage);

    window.addEventListener('load', function() {
        addControllerToVideos();
        syncStorage();

        // リクエストを監視
        monitorFetchRequests();
        monitorXHRRequests();
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                addControllerToVideos();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();


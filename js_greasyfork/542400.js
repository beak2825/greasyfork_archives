// ==UserScript==
// @name         bangumi 自定义追番时间表
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.1
// @description  bangumi自定义追番时间表，支持按周规划番剧观看顺序。可自主安排番剧到每周的任意日期，适合等待字幕组或喜欢按个人计划节奏来追番的用户。
// @author       goldenegg
// @match        http*://bgm.tv/*
// @match        http*://bangumi.tv/*
// @match        http*://chii.in/*
// @icon         https://bgm.tv/img/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/542400/bangumi%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%BF%BD%E7%95%AA%E6%97%B6%E9%97%B4%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542400/bangumi%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%BF%BD%E7%95%AA%E6%97%B6%E9%97%B4%E8%A1%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        :root {
            --timetable-primary: rgb(240,145,153);
            --timetable-bg: white;
            --timetable-text: #333;
            --timetable-border: #d1d5db;
            --timetable-header-bg: #eee;
            --timetable-highlight: #e2e8f0;
            --timetable-highlight-border: #3b82f6;
            --timetable-empty: #6c757d;
            --toggle-bg: #2c3e50;
            --toggle-hover: #34495e;
            --anime-name-bg: rgba(0, 0, 0, 0.7);
            --remove-bg: rgba(108, 117, 125, 0.7);
            --remove-hover: rgba(220, 53, 69, 0.9);
            --scrollbar-thumb: #ccc;
            --scrollbar-thumb-hover: #aaa;
            --scrollbar-track: transparent;
        }

        .dark-mode {
            --timetable-bg: rgb(62,62,62);
            --timetable-text: white;
            --timetable-border: #444;
            --timetable-header-bg: rgb(45,46,47);
            --timetable-highlight: rgb(85,85,85);
            --timetable-empty: #9ca3af;
            --timetable-highlight-border: #3b82f6;
            --anime-name-bg: rgba(0, 0, 0, 0.8);
            --scrollbar-thumb: #555;
            --scrollbar-thumb-hover: #777;
        }

        .timetable-container {
            position: fixed;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            transition: transform 0.2s ease-out;
            transform-origin: bottom left;
            will-change: transform;
        }

        .timetable-toggle {
            background-color: var(--toggle-bg);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            position: fixed;
            z-index: 10000;
        }

        .timetable-toggle:hover {
            background-color: var(--toggle-hover);
            transform: scale(1.1);
        }

        .timetable-toggle.transparent {
            opacity: 0.5;
        }

        .timetable-window {
            display: none;
            background-color: var(--timetable-bg);
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            width: 70vw;
            max-width: 870px;
            max-height: 75vh;
            margin-bottom: 10px;
            transition: all 0.3s ease;
            color: var(--timetable-text);
        }

        .timetable-wrapper::-webkit-scrollbar {
            width: 7px;
            height: 7px;
        }

        .timetable-wrapper::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
            border-radius: 3px;
        }

        .timetable-wrapper::-webkit-scrollbar-thumb {
            background-color: var(--scrollbar-thumb);
            border-radius: 3px;
            transition: background-color 0.2s ease;
        }

        .timetable-wrapper::-webkit-scrollbar-thumb:hover {
            background-color: var(--scrollbar-thumb-hover);
        }

        .timetable-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 7px 15px;
            background-color: var(--timetable-primary);
            border-bottom: 1px solid var(--timetable-border);
            border-radius: 8px 8px 0 0;
            cursor: move;
            user-select: none;
            margin: 0;
        }

        .timetable-title {
            font-weight: bold;
            color: white;
            font-size: 15px;
        }

        .timetable-actions {
            display: flex;
            gap: 10px;
        }

        .timetable-close, .timetable-export {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 18px;
            color: white;
            transition: color 0.2s;
        }

        .timetable-close:hover, .timetable-export:hover {
            color: #dc3545;
        }

        .timetable-wrapper {
            overflow-y: auto;
            max-height: calc(75vh - 50px);
        }

        .timetable-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        .timetable-table thead {
            position: sticky;
            top: 0;
            z-index: 10;
            background-color: var(--timetable-header-bg);
        }

        .timetable-table th,
        .timetable-table td {
            padding: 10px;
            text-align: center;
            border: 1px solid var(--timetable-border);
        }

        .timetable-table th {
            background-color: var(--timetable-header-bg);
            font-weight: 500;
            position: relative;
            border-top: none;
        }

        .timetable-table th.highlight {
            background-color: var(--timetable-highlight);
            font-weight: bold;
        }

        .timetable-table th.highlight::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: var(--timetable-highlight-border);
        }

        .timetable-table td {
            min-height: 100px;
            vertical-align: top;
            background-color: var(--timetable-bg);
        }

        .anime-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-content: flex-start;
            min-height: 150px;
        }

        .anime-item {
            position: relative;
            margin: 5px;
            display: inline-block;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            width: 100px;
        }

        .anime-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        }

        .anime-item img {
            width: 100px;
            height: 140px;
            object-fit: cover;
            display: block;
        }

        .anime-name {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: var(--anime-name-bg);
            color: white;
            font-size: 12px;
            padding: 3px 1px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: all 0.3s ease;
        }

        .anime-original-name {
            display: none;
            font-size: 10px;
            color: #ccc;
            margin-top: 2px;
        }

        .anime-item:hover .anime-name {
            height: 100%;
            white-space: normal;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 5px;
            box-sizing: border-box;
        }

        .anime-item:hover .anime-original-name {
            display: block;
            text-align: center;
        }

        .anime-remove {
            position: absolute;
            top: 3px;
            right: 3px;
            background-color: var(--remove-bg);
            color: white;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .anime-item:hover .anime-remove {
            display: flex;
        }

        .anime-remove:hover {
            background-color: var(--remove-hover);
        }

        .dragging {
            opacity: 0.5;
            transform: none;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .drop-zone {
            min-height: 20px;
            transition: background-color 0.2s;
        }

        .drop-zone.highlight {
            background-color: #e6f7ff;
        }

        .timetable-empty {
            text-align: center;
            padding: 20px;
            color: var(--timetable-empty);
            font-style: italic;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 150px;
        }

        .drag-ghost {
            position: fixed;
            pointer-events: none;
            z-index: 99999;
            opacity: 0.8;
            transform: none;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            transition: none;
        }

        .timetable-container.dragging {
            transition: none;
            cursor: grabbing;
            user-select: none;
        }

        .export-notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10000;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .export-notification.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // 通知管理
    function createNotify(msg) {
        const notify = document.createElement('div');
        notify.className = 'export-notification';
        notify.textContent = msg;
        document.body.appendChild(notify);
        return notify;
    }

    function showNotify(msg) {
        let notify = document.querySelector('.export-notification');
        if (!notify) {
            notify = createNotify(msg);
        } else {
            notify.textContent = msg;
        }
        notify.classList.add('show');
        return notify;
    }

    function hideNotify(notify) {
        if (notify) {
            setTimeout(() => {
                notify.classList.remove('show');
                setTimeout(() => {
                    if (notify && document.body.contains(notify)) {
                        document.body.removeChild(notify);
                    }
                }, 300);
            }, 2000);
        }
    }

    // 数据存储
    function initStore() {
        if (!localStorage.getItem('bangumiTimetable')) {
            localStorage.setItem('bangumiTimetable', JSON.stringify({}));
        }
        if (!localStorage.getItem('timetableWindowPosition')) {
            localStorage.setItem('timetableWindowPosition', JSON.stringify({ left: 20, bottom: 70 }));
        }
    }

    function getData() {
        return JSON.parse(localStorage.getItem('bangumiTimetable') || '{}');
    }

    function saveData(data) {
        localStorage.setItem('bangumiTimetable', JSON.stringify(data));
    }

    function savePos(pos) {
        localStorage.setItem('timetableWindowPosition', JSON.stringify(pos));
    }

    // 深色模式
    function isDark() {
        const html = document.documentElement;
        const theme = html.getAttribute('data-theme');
        return theme === 'dark' || (
            !theme &&
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
        );
    }

    function updateDark() {
        const win = document.querySelector('.timetable-window');
        if (win) {
            isDark() ? win.classList.add('dark-mode') : win.classList.remove('dark-mode');
        }
    }

    // 创建时间表窗口
    function createWin() {
        const cont = document.createElement('div');
        cont.className = 'timetable-container';

        const pos = JSON.parse(localStorage.getItem('timetableWindowPosition') || '{"left": 20, "bottom": 70}');
        cont.style.left = `${pos.left}px`;
        cont.style.bottom = `${pos.bottom}px`;

        const win = document.createElement('div');
        win.className = 'timetable-window';

        const head = document.createElement('div');
        head.className = 'timetable-header';

        const title = document.createElement('div');
        title.className = 'timetable-title';
        title.textContent = '追番时间表';

        const actions = document.createElement('div');
        actions.className = 'timetable-actions';

        const exportBtn = document.createElement('button');
        exportBtn.className = 'timetable-export';
        exportBtn.innerHTML = '⎙';
        exportBtn.title = '导出为图片';
        exportBtn.addEventListener('click', exportImg);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'timetable-close';
        closeBtn.innerHTML = '×';
        closeBtn.title = '关闭';
        closeBtn.addEventListener('click', () => {
            win.style.display = 'none';
            localStorage.setItem('timetableWindowState', 'none');
        });

        actions.appendChild(exportBtn);
        actions.appendChild(closeBtn);
        head.appendChild(title);
        head.appendChild(actions);

        const wrapper = document.createElement('div');
        wrapper.className = 'timetable-wrapper';

        const table = document.createElement('table');
        table.className = 'timetable-table';

        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');

        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const curDay = new Date().getDay();

        days.forEach((day, i) => {
            const th = document.createElement('th');
            th.textContent = day;
            if (i === curDay) th.classList.add('highlight');
            headRow.appendChild(th);
        });

        thead.appendChild(headRow);

        const tbody = document.createElement('tbody');
        const bodyRow = document.createElement('tr');

        days.forEach((_, i) => {
            const td = document.createElement('td');
            td.dataset.day = i;
            td.className = 'drop-zone';
            td.addEventListener('dragover', handleOver);
            td.addEventListener('dragleave', handleLeave);
            td.addEventListener('drop', handleDrop);

            const animeCont = document.createElement('div');
            animeCont.className = 'anime-container';

            const emptyTip = document.createElement('div');
            emptyTip.className = 'timetable-empty';
            emptyTip.textContent = '拖拽动画条目到此处';
            emptyTip.style.display = 'block';

            animeCont.appendChild(emptyTip);
            td.appendChild(animeCont);

            bodyRow.appendChild(td);
        });

        tbody.appendChild(bodyRow);
        table.appendChild(thead);
        table.appendChild(tbody);

        wrapper.appendChild(table);
        win.appendChild(head);
        win.appendChild(wrapper);

        cont.appendChild(win);
        document.body.appendChild(cont);

        makeDraggable(head, cont);
        loadData();
        updateDark();

        const winState = localStorage.getItem('timetableWindowState');
        if (winState === 'block') {
            win.style.display = 'block';
        }

        return { cont, win };
    }

    // 使元素可拖拽
    function makeDraggable(header, cont) {
        let dragging = false;
        let startX, startY;
        let initLeft, initBottom;
        let curLeft, curBottom;

        function calcPos(x, y) {
            const newLeft = initLeft + (x - startX);
            const newBottom = initBottom - (y - startY);

            const contW = cont.offsetWidth;
            const contH = cont.offsetHeight;
            const minW = 100;
            const minH = 50;
            const maxLeft = window.innerWidth - minW;
            const maxBottom = window.innerHeight - minH;

            return {
                left: Math.max(-contW + minW, Math.min(maxLeft, newLeft)),
                bottom: Math.max(-contH + minH, Math.min(maxBottom, newBottom))
            };
        }

        function applyPos(pos) {
            cont.style.left = `${pos.left}px`;
            cont.style.bottom = `${pos.bottom}px`;
            curLeft = pos.left;
            curBottom = pos.bottom;
        }

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.timetable-close, .timetable-export')) return;

            dragging = true;
            cont.classList.add('dragging');

            startX = e.clientX;
            startY = e.clientY;
            initLeft = curLeft || parseInt(cont.style.left) || 0;
            initBottom = curBottom || parseInt(cont.style.bottom) || 0;

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            applyPos(calcPos(e.clientX, e.clientY));
        });

        document.addEventListener('mouseup', () => {
            if (dragging) {
                dragging = false;
                cont.classList.remove('dragging');
                savePos({ left: curLeft, bottom: curBottom });
            }
        });

        header.addEventListener('selectstart', (e) => {
            if (dragging) e.preventDefault();
        });
    }

    // 加载数据
    function loadData() {
        const data = getData();
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

        days.forEach((_, i) => {
            const dayData = data[i] || [];
            const td = document.querySelector(`.timetable-table td[data-day="${i}"]`);
            const cont = td.querySelector('.anime-container');
            const emptyTip = td.querySelector('.timetable-empty');

            cont.innerHTML = '';
            cont.appendChild(emptyTip);

            if (dayData.length > 0) {
                emptyTip.style.display = 'none';
            } else {
                emptyTip.style.display = 'flex';
            }

            dayData.forEach((anime, idx) => addAnime(td, anime, idx));
        });
    }

    // 添加番剧
    function addAnime(td, anime, idx) {
        const cont = td.querySelector('.anime-container');

        const item = document.createElement('div');
        item.className = 'anime-item';
        item.draggable = true;
        item.dataset.id = anime.id;
        item.dataset.day = td.dataset.day;
        item.dataset.index = idx;
        item.dataset.domain = anime.domain || 'bangumi.tv';

        const img = document.createElement('img');
        img.src = anime.image;
        img.alt = anime.name;
        img.onerror = function () {
            this.src = 'https://bgm.tv/img/no_icon_subject.png';
        };

        const nameCont = document.createElement('div');
        nameCont.className = 'anime-name';

        const name = document.createElement('div');
        name.textContent = anime.name;

        const origName = document.createElement('div');
        origName.className = 'anime-original-name';
        origName.textContent = anime.originalName || '';

        nameCont.appendChild(name);
        nameCont.appendChild(origName);

        const remove = document.createElement('div');
        remove.className = 'anime-remove';
        remove.innerHTML = '×';
        remove.addEventListener('click', (e) => {
            e.stopPropagation();
            removeAnime(item);
        });

        item.appendChild(img);
        item.appendChild(nameCont);
        item.appendChild(remove);

        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const winState = document.querySelector('.timetable-window').style.display;
            localStorage.setItem('timetableWindowState', winState);

            const domain = item.dataset.domain;
            window.location.href = `https://${domain}/subject/${anime.id}`;
        });

        item.addEventListener('dragstart', handleStart);
        item.addEventListener('dragend', handleEnd);

        cont.appendChild(item);

        const emptyTip = td.querySelector('.timetable-empty');
        if (cont.children.length > 1) {
            emptyTip.style.display = 'none';
        }

        updateIndices(td);
    }

    // 更新索引
    function updateIndices(td) {
        const cont = td.querySelector('.anime-container');
        cont.querySelectorAll('.anime-item').forEach((item, idx) => {
            item.dataset.index = idx;
        });
    }

    // 移除番剧
    function removeAnime(item) {
        const day = item.dataset.day;
        const id = item.dataset.id;
        const data = getData();

        if (data[day]) {
            data[day] = data[day].filter(a => a.id !== id);
            saveData(data);
        }

        const td = item.parentElement.parentElement;
        item.remove();

        const cont = td.querySelector('.anime-container');
        if (cont.querySelectorAll('.anime-item').length === 0) {
            td.querySelector('.timetable-empty').style.display = 'flex';
        }
    }

    // 拖拽事件处理
    function handleStart(e) {
        const clone = this.cloneNode(true);
        clone.classList.add('drag-ghost');
        document.body.appendChild(clone);

        e.dataTransfer.setDragImage(clone, 50, 70);
        e.dataTransfer.setData('text/plain', JSON.stringify({
            id: this.dataset.id,
            day: this.dataset.day,
            index: this.dataset.index,
            domain: this.dataset.domain
        }));

        this.classList.add('dragging');

        setTimeout(() => clone.remove(), 0);
    }

    function handleEnd() {
        this.classList.remove('dragging');
        document.querySelectorAll('.drop-zone.highlight').forEach(el => {
            el.classList.remove('highlight');
        });
    }

    function handleOver(e) {
        e.preventDefault();
        this.classList.add('highlight');
    }

    function handleLeave() {
        this.classList.remove('highlight');
    }

    function handleDrop(e) {
        e.preventDefault();
        const dropZone = e.currentTarget;
        dropZone.classList.remove('highlight');

        const data = e.dataTransfer.getData('text/plain');
        if (!data) return;

        try {
            const dData = JSON.parse(data);
            if (dData.id && dData.day !== undefined && dData.index !== undefined) {
                const { id, day: sourceDay, index: sourceIdx, domain } = dData;
                const targetDay = parseInt(dropZone.dataset.day);

                const data = JSON.parse(JSON.stringify(getData()));
                let anime = null;

                if (data[sourceDay] && data[sourceDay].length > sourceIdx) {
                    anime = data[sourceDay][sourceIdx];
                }

                if (!anime) return;

                if (data[sourceDay]) {
                    data[sourceDay] = data[sourceDay].filter((_, i) => i !== parseInt(sourceIdx));
                }

                if (!data[targetDay]) {
                    data[targetDay] = [];
                }

                const targetIdx = getDropIdx(e, dropZone);
                anime.domain = domain;
                data[targetDay].splice(targetIdx, 0, anime);

                saveData(data);
                loadData();
            } else {
                handleUrlDrop(data, dropZone.dataset.day);
            }
        } catch (error) {
            handleUrlDrop(data, dropZone.dataset.day);
            return;
        }
    }

    // 解析番剧链接
    function getAnimeInfo(url) {
        if (!url) return null;

        const domainMatch = url.match(/^https?:\/\/([^/]+)\//);
        const domain = domainMatch ? domainMatch[1] : null;

        const idMatch = url.match(/\/subject\/(\d+)/);
        const id = idMatch ? idMatch[1] : null;

        return id ? { id, domain } : null;
    }

    // 处理URL
    function handleUrlDrop(url, day) {
        const info = getAnimeInfo(url);
        if (!info) {
            const notify = showNotify('只能解析动画条目(含subject的链接)', true);
            setTimeout(() => hideNotify(notify), 2000);
            return;
        }
        fetchData(info.id, day, info.domain);
    }

    // 获取放置位置
    function getDropIdx(e, td) {
        const cont = td.querySelector('.anime-container');
        const rect = cont.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const itemH = 140 + 10;
        return Math.min(Math.floor(y / itemH), cont.children.length);
    }

    // 请求解析数据
    function fetchData(id, day, domain) {
        const url = `https://${domain}/subject/${id}`;
        const headers = {
            'User-Agent': navigator.userAgent
        };

        const isLoggedIn = document.cookie !== '';
        if (isLoggedIn) {
            headers['Cookie'] = document.cookie;
        }

        fetch(url, {
            method: 'GET',
            headers: headers,
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error();
                }
                return res.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const nameElement = doc.querySelector('h1.nameSingle a');
                if (!nameElement) {
                    throw new Error();
                }

                const chineseName = nameElement.getAttribute('title') || '';
                const originalName = nameElement.textContent.trim() || '';

                let imageUrl = '';
                const imgElements = doc.querySelectorAll('.infobox img.cover, .infobox .cover img');
                if (imgElements.length > 0) {
                    for (let i = 0; i < imgElements.length; i++) {
                        const src = imgElements[i].getAttribute('src');
                        if (src && src.trim() !== '') {
                            imageUrl = src;
                            break;
                        }
                    }
                }

                if (!imageUrl) {
                    imageUrl = 'https://bgm.tv/img/no_icon_subject.png';
                }
                if (imageUrl.startsWith('//')) {
                    imageUrl = `https:${imageUrl}`;
                }
                const anime = {
                    id: id,
                    name: chineseName || originalName,
                    originalName: originalName,
                    image: imageUrl,
                    domain: domain
                };
                const tData = getData();

                // 移除其他日期的相同番剧
                for (const d in tData) {
                    const idx = tData[d].findIndex(a => a.id === id);
                    if (idx !== -1) {
                        tData[d].splice(idx, 1);
                    }
                }

                if (!tData[day]) {
                    tData[day] = [];
                }
                tData[day].push(anime);
                saveData(tData);
                loadData();
            })
            .catch(err => {
                const notify = showNotify(`获取番剧数据失败`);
                setTimeout(() => hideNotify(notify), 3000);
            });
    }


    // 加载Html2Canvas
    function loadHtml2Canvas(callback) {
        if (window.html2canvas) {
            callback(window.html2canvas);
            return;
        }
        const script = document.createElement('script');
        const sources = [
            'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
            'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js'
        ];

        let currentSourceIndex = 0;

        function loadSource() {
            if (currentSourceIndex >= sources.length) {
                callback(null); // 所有源都失败
                return;
            }

            script.src = sources[currentSourceIndex];
            currentSourceIndex++;

            script.onload = () => {
                if (window.html2canvas) {
                    callback(window.html2canvas);
                } else {
                    loadSource();
                }
            };
            script.onerror = loadSource;
        }
        loadSource();
        document.head.appendChild(script);
    }

    // 导出图片
    function exportImg() {
        // 先加载html2canvas
        loadHtml2Canvas(html2canvas => {
            if (!html2canvas) {
                const notify = showNotify(`导出组件加载失败，可尝试刷新页面`);
                setTimeout(() => hideNotify(notify), 3000);
                return;
            }

            const notify = showNotify('正在导出...');

            const expCont = document.createElement('div');
            expCont.style.cssText = `
            position: fixed;
            top: -9999px;
            left: -9999px;
            width: 870px;
            background-color: var(--timetable-bg);
            color: var(--timetable-text);
            box-sizing: border-box;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        `;

            const expTable = document.createElement('table');
            expTable.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        `;
            expCont.appendChild(expTable);

            const thead = document.createElement('thead');
            expTable.appendChild(thead);

            const headRow = document.createElement('tr');
            thead.appendChild(headRow);

            const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

            days.forEach(day => {
                const th = document.createElement('th');
                th.textContent = day;
                th.style.cssText = `
                padding: 10px;
                text-align: center;
                border: 1px solid var(--timetable-border);
                background-color: var(--timetable-header-bg);
                font-weight: 500;
                word-break: keep-all;
            `;
                headRow.appendChild(th);
            });

            const tbody = document.createElement('tbody');
            expTable.appendChild(tbody);

            const bodyRow = document.createElement('tr');
            tbody.appendChild(bodyRow);

            const data = getData();

            days.forEach((_, d) => {
                const td = document.createElement('td');
                td.style.cssText = `
                min-height: 150px;
                padding: 5px;
                border: 1px solid var(--timetable-border);
                vertical-align: top;
                background-color: var(--timetable-bg);
            `;
                bodyRow.appendChild(td);

                const dayData = data[d] || [];

                if (dayData.length === 0) {
                    const empty = document.createElement('div');
                    empty.textContent = '无';
                    empty.style.cssText = `
                    text-align: center;
                    padding: 20px;
                    color: var(--timetable-empty);
                    font-style: italic;
                `;
                    td.appendChild(empty);
                } else {
                    const animeCont = document.createElement('div');
                    animeCont.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                `;
                    td.appendChild(animeCont);

                    dayData.forEach(anime => {
                        const item = document.createElement('div');
                        item.style.cssText = `
                        width: 100px;
                        margin-bottom: 10px;
                        position: relative;
                    `;
                        animeCont.appendChild(item);

                        const img = document.createElement('img');
                        img.src = anime.image;
                        img.alt = anime.name;
                        img.style.cssText = `
                        width: 100px;
                        height: 140px;
                        object-fit: cover;
                        display: block;
                        border-radius: 4px;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    `;
                        img.onerror = function () {
                            this.src = 'https://bgm.tv/img/no_icon_subject.png';
                        };
                        item.appendChild(img);

                        const nameCont = document.createElement('div');
                        nameCont.style.cssText = `
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        background-color: rgba(0, 0, 0, 0.7);
                        color: white;
                        font-size: 12px;
                        padding: 3px 0;
                        text-align: center;
                        word-break: break-word;
                        white-space: normal;
                        line-height: 1.2;
                        border-radius: 0 0 4px 4px;
                    `;
                        nameCont.textContent = anime.name;
                        item.appendChild(nameCont);
                    });
                }
            });

            document.body.appendChild(expCont);
            html2canvas(expCont, {
                scale: 1.2,
                useCORS: true,
                logging: false,
                backgroundColor: null
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `追番时间表.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();

                hideNotify(notify);
                showNotify('导出成功');

                setTimeout(() => {
                    document.body.removeChild(expCont);
                }, 100);
            }).catch(err => {
                hideNotify(notify);
                showNotify('导出失败');
                document.body.removeChild(expCont);
            });
        });
    }

    // 入口按钮
    function addToggle() {
        const menu = document.querySelector('#badgeUserPanel');
        if (!menu) {
            setTimeout(addToggle, 500);
            return;
        }

        const wiki = menu.querySelector('a[href*="/wiki"]');
        if (!wiki) {
            setTimeout(addToggle, 500);
            return;
        }

        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = '追番时间表';
        link.title = '显示/隐藏追番时间表';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            toggleWin();
        });
        item.appendChild(link);

        wiki.parentElement.after(item);
    }

    // 切换窗口显示状态
    function toggleWin() {
        const win = document.querySelector('.timetable-window');
        if (win) {
            const display = win.style.display === 'none' ? 'block' : 'none';
            win.style.display = display;
            localStorage.setItem('timetableWindowState', display);
            if (display === 'block') {
                loadData();
                updateDark();
            }
        }
    }

    // 监听拖拽
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'A' && e.target.href.includes('/subject/')) {
            e.dataTransfer.setData('text/plain', e.target.href);
        }
    });

    // 初始化
    function init() {
        initStore();
        createWin();
        addToggle();
        loadHtml2Canvas((html2canvas) => {
            if (html2canvas) {
                console.log('html2canvas预加载完成');
            } else {
                console.error('html2canvas预加载失败，导出功能不可用');
            }
        });

        document.addEventListener('dragover', (e) => {
            if (e.dataTransfer.types.includes('text/uri-list') ||
                e.dataTransfer.types.includes('text/plain')) {
                e.preventDefault();
            }
        });

        document.addEventListener('drop', (e) => {
            if (!e.target.closest('.drop-zone')) {
                e.preventDefault();
            }
        });

        const html = document.documentElement;
        new MutationObserver(updateDark).observe(html, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        const winState = localStorage.getItem('timetableWindowState') || 'none';
        const win = document.querySelector('.timetable-window');
        if (win) {
            win.style.display = winState;
            updateDark();
        }
    }

    init();
})();
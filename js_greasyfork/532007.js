// ==UserScript==
// @name         Lolz Time Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Track time spent on lolz.live with detailed statistics
// @author       Yowori
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @license MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/532007/Lolz%20Time%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/532007/Lolz%20Time%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SECTION_CONFIG = {
        forums: { pattern: /\/forums\//, name: 'Разделы ' },
        threads: { pattern: /\/threads\//, name: 'Темы ' },
        members: { pattern: /\/members\//, name: 'Пользователи ' },
        account: { pattern: /\/account\//, name: 'Профиль ' },
        other: { pattern: /.*/, name: 'Другое ' }
    };

    let trackerState = {
        currentSection: null,
        currentThread: null,
        currentUser: null,
        isPageActive: true,
        lastUpdateTime: Date.now(),
        totalSeconds: 0,
        sectionSeconds: {},
        threadSeconds: {},
        userSeconds: {}
    };

    const storageKey = 'lolzTimeTracker_v4';
    const uiStateKey = 'lolzTimeTrackerUIState';
    let updateInterval;
    let statsVisible = false;
    let detailedView = 'main';
    let confirmationOpen = false;

    GM_addStyle(`
        #time-tracker-container {
            position: fixed;
            left: 10px;
            bottom: 10px;
            z-index: 9999;
            font-family: Arial, sans-serif;
        }

        #time-tracker-toggle {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
            margin-right: 8px;
        }

        #time-tracker-toggle:hover {
            background: #45a049;
            transform: translateY(-1px);
        }

        #time-tracker-reset {
            background: #f44336;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
        }

        #time-tracker-reset:hover {
            background: #d32f2f;
            transform: translateY(-1px);
        }

        #time-tracker-buttons {
            display: flex;
        }

        #time-tracker-widget {
            display: none;
            background: #272727;
            color: #fff;
            padding: 12px;
            border-radius: 6px;
            margin-top: 8px;
            width: 280px;
            backdrop-filter: blur(5px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            border: 1px solid #383838;
            max-height: 60vh;
            overflow-y: auto;
        }

        .time-tracker-header {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #4CAF50;
            border-bottom: 1px solid #444;
            padding-bottom: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .time-tracker-back-btn {
            background: none;
            border: none;
            color: #4CAF50;
            cursor: pointer;
            font-size: 14px;
        }

        .time-tracker-confirm-reset {
            background: none;
            border: none;
            color: #f44336;
            cursor: pointer;
            font-size: 14px;
            margin-left: 5px;
        }

        .time-tracker-section {
            margin: 8px 0;
            display: flex;
            justify-content: space-between;
        }

        .time-tracker-section-name {
            color: #ddd;
            cursor: pointer;
        }

        .time-tracker-section-time {
            font-weight: bold;
            color: #fff;
        }

        .time-tracker-detail-item {
            margin: 6px 0;
            padding-left: 10px;
            border-left: 2px solid #444;
        }

        .time-tracker-nav-btn {
            background: none;
            border: none;
            color: #ddd;
            cursor: pointer;
            margin: 0 5px;
            padding: 2px 5px;
        }

        .time-tracker-nav-btn:hover {
            color: #4CAF50;
        }

        .time-tracker-nav-btn.active {
            color: #4CAF50;
            border-bottom: 1px solid #4CAF50;
        }
    `);

    function init() {
        loadData();
        loadUIState();
        createUI();
        setupVisibilityListener();
        setupPageAnalyzers();
        startTracking();
        GM_registerMenuCommand("Показать статистику Lolz.live", toggleStats);
    }

    function loadUIState() {
        const savedState = GM_getValue(uiStateKey, { statsVisible: false });
        statsVisible = savedState.statsVisible;
    }

    function saveUIState() {
        GM_setValue(uiStateKey, { statsVisible: statsVisible });
    }

    function createUI() {
        const container = document.createElement('div');
        container.id = 'time-tracker-container';

        const buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'time-tracker-buttons';

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'time-tracker-toggle';
        toggleBtn.textContent = statsVisible ? '❌ Скрыть' : '📊 Статистика';
        toggleBtn.addEventListener('click', toggleStats);

        const resetBtn = document.createElement('button');
        resetBtn.id = 'time-tracker-reset';
        resetBtn.textContent = '🔄 Сбросить';
        resetBtn.addEventListener('click', confirmResetStats);

        buttonsContainer.appendChild(toggleBtn);
        buttonsContainer.appendChild(resetBtn);

        const widget = document.createElement('div');
        widget.id = 'time-tracker-widget';
        widget.style.display = statsVisible ? 'block' : 'none';

        container.appendChild(buttonsContainer);
        container.appendChild(widget);
        document.body.appendChild(container);

        updateUI();
    }

    function confirmResetStats() {
        const widget = document.getElementById('time-tracker-widget');
        if (!widget) return;

        confirmationOpen = true;
        widget.innerHTML = `
            <div class="time-tracker-header">
                <span>Сброс статистики</span>
            </div>
            <div style="margin: 10px 0;">
                Вы уверены, что хотите сбросить статистику за сегодня?
            </div>
            <div style="display: flex; justify-content: flex-end;">
                <button id="time-tracker-cancel-reset" style="background: #4CAF50; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: all 0.2s ease; margin-right: 8px;">Отмена</button>
                <button id="time-tracker-confirm-reset" style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: all 0.2s ease;">Сбросить</button>
            </div>
        `;

        document.getElementById('time-tracker-cancel-reset').addEventListener('click', () => {
            confirmationOpen = false;
            updateUI();
        });

        document.getElementById('time-tracker-confirm-reset').addEventListener('click', resetStats);
    }

    function resetStats() {
        const today = getTodayKey();
        const savedData = GM_getValue(storageKey) || {};
        savedData[today] = {
            totalSeconds: 0,
            sectionSeconds: {},
            threadSeconds: {},
            userSeconds: {}
        };
        GM_setValue(storageKey, savedData);

        trackerState.totalSeconds = 0;
        trackerState.sectionSeconds = {};
        trackerState.threadSeconds = {};
        trackerState.userSeconds = {};


        for (const section in SECTION_CONFIG) {
            trackerState.sectionSeconds[section] = 0;
        }

        confirmationOpen = false;
        updateUI();
    }


    function toggleStats() {
        statsVisible = !statsVisible;
        const widget = document.getElementById('time-tracker-widget');
        if (widget) widget.style.display = statsVisible ? 'block' : 'none';

        const toggleBtn = document.getElementById('time-tracker-toggle');
        if (toggleBtn) toggleBtn.textContent = statsVisible ? '❌ Скрыть' : '📊 Статистика';

        saveUIState();

        if (statsVisible && !confirmationOpen) {
            updateUI();
        }
    }


    function loadData() {
        const today = getTodayKey();
        const savedData = GM_getValue(storageKey) || {};
        const todayData = savedData[today] || {
            totalSeconds: 0,
            sectionSeconds: {},
            threadSeconds: {},
            userSeconds: {}
        };

        trackerState = {
            ...trackerState,
            totalSeconds: todayData.totalSeconds || 0,
            sectionSeconds: todayData.sectionSeconds || {},
            threadSeconds: todayData.threadSeconds || {},
            userSeconds: todayData.userSeconds || {}
        };


        for (const section in SECTION_CONFIG) {
            if (!trackerState.sectionSeconds[section]) {
                trackerState.sectionSeconds[section] = 0;
            }
        }
    }


    function saveData() {
        const today = getTodayKey();
        const savedData = GM_getValue(storageKey) || {};
        savedData[today] = {
            totalSeconds: trackerState.totalSeconds,
            sectionSeconds: trackerState.sectionSeconds,
            threadSeconds: trackerState.threadSeconds,
            userSeconds: trackerState.userSeconds
        };
        GM_setValue(storageKey, savedData);
    }


    function detectSection() {
        const path = window.location.pathname;
        for (const [section, config] of Object.entries(SECTION_CONFIG)) {
            if (config.pattern.test(path)) {
                return section;
            }
        }
        return 'other';
    }


    function detectThread() {
        const threadMatch = window.location.pathname.match(/\/threads\/(\d+)/);
        if (threadMatch) {
            return threadMatch[1];
        }
        return null;
    }


    function detectUser() {
        const userMatch = window.location.pathname.match(/\/members\/(\d+)/);
        if (userMatch) {
            return userMatch[1];
        }
        const prettyUrlMatch = window.location.pathname.match(/^\/([^\/]+)\/?$/);
        if (prettyUrlMatch && !['forums', 'threads', 'account', 'members'].includes(prettyUrlMatch[1])) {
            return prettyUrlMatch[1];
        }
        return null;
    }


    function setupPageAnalyzers() {
        trackerState.currentSection = detectSection();
        trackerState.currentThread = detectThread();
        trackerState.currentUser = detectUser();
    }


    function startTracking() {
        if (updateInterval) clearInterval(updateInterval);

        updateInterval = setInterval(() => {
            if (!trackerState.isPageActive) return;

            const now = Date.now();
            const elapsedSeconds = Math.floor((now - trackerState.lastUpdateTime) / 1000);

            if (elapsedSeconds > 0) {
                trackerState.lastUpdateTime = now;

                setupPageAnalyzers();

                trackerState.totalSeconds += elapsedSeconds;

                trackerState.sectionSeconds[trackerState.currentSection] =
                    (trackerState.sectionSeconds[trackerState.currentSection] || 0) + elapsedSeconds;

                if (trackerState.currentThread) {
                    trackerState.threadSeconds[trackerState.currentThread] =
                        (trackerState.threadSeconds[trackerState.currentThread] || 0) + elapsedSeconds;
                }

                if (trackerState.currentUser) {
                    trackerState.userSeconds[trackerState.currentUser] =
                        (trackerState.userSeconds[trackerState.currentUser] || 0) + elapsedSeconds;
                }

                saveData();

                if (statsVisible && !confirmationOpen) {
                    updateUI();
                }
            }
        }, 1000);
    }

    function updateUI() {
        if (confirmationOpen) return;

        const widget = document.getElementById('time-tracker-widget');
        if (!widget) return;

        let html = '';

        switch (detailedView) {
            case 'main':
                html = getMainView();
                break;
            case 'sections':
                html = getSectionsDetailView();
                break;
            case 'threads':
                html = getThreadsDetailView();
                break;
            case 'users':
                html = getUsersDetailView();
                break;
        }

        widget.innerHTML = html;
        addEventHandlers();
    }

    function getMainView() {
        let html = `<div class="time-tracker-header">
            <span>Статистика за сегодня</span>
        </div>`;

        html += `<div class="time-tracker-section">
            <span class="time-tracker-section-name">Всего:</span>
            <span class="time-tracker-section-time">${formatTime(trackerState.totalSeconds)}</span>
        </div>`;

        html += `<div style="margin: 10px 0; display: flex; justify-content: space-around;">
            <button class="time-tracker-nav-btn ${detailedView === 'threads' ? 'active' : ''}" data-view="threads">Темы</button>
            <button class="time-tracker-nav-btn ${detailedView === 'users' ? 'active' : ''}" data-view="users">Пользователи</button>
        </div>`;

        const sortedSections = Object.entries(trackerState.sectionSeconds)
            .sort((a, b) => b[1] - a[1]);

        html += `<div style="margin-top: 10px; font-weight: bold; color: #ddd;">Общая информация :</div>`;
        for (const [sectionId, seconds] of sortedSections.slice(0, 5)) {
            if (seconds > 0) {
                const sectionName = SECTION_CONFIG[sectionId].name;
                html += `<div class="time-tracker-section">
                    <span class="time-tracker-section-name">${sectionName}:</span>
                    <span class="time-tracker-section-time">${formatTime(seconds)}</span>
                </div>`;
            }
        }

        return html;
    }

    function getSectionsDetailView() {
        let html = `<div class="time-tracker-header">
            <button class="time-tracker-back-btn" data-view="main">Назад</button>
            <span>Статистика по разделам</span>
        </div>`;

        const sortedSections = Object.entries(trackerState.sectionSeconds)
            .sort((a, b) => b[1] - a[1]);

        for (const [sectionId, seconds] of sortedSections) {
            if (seconds > 0) {
                const sectionName = SECTION_CONFIG[sectionId].name;
                html += `<div class="time-tracker-section">
                    <span class="time-tracker-section-name">${sectionName}:</span>
                    <span class="time-tracker-section-time">${formatTime(seconds)}</span>
                </div>`;
            }
        }

        return html;
    }

    function getThreadsDetailView() {
        let html = `<div class="time-tracker-header">
            <button class="time-tracker-back-btn" data-view="main">Назад</button>
            <span>Темы</span>
        </div>`;

        const sortedThreads = Object.entries(trackerState.threadSeconds)
            .sort((a, b) => b[1] - a[1]);

        for (const [threadId, seconds] of sortedThreads.slice(0, 20)) {
            if (seconds > 0) {
                html += `<div class="time-tracker-section">
                    <span class="time-tracker-section-name" data-thread-id="${threadId}">Тема #${threadId}:</span>
                    <span class="time-tracker-section-time">${formatTime(seconds)}</span>
                </div>`;
            }
        }

        return html;
    }

    function getUsersDetailView() {
        let html = `<div class="time-tracker-header">
            <button class="time-tracker-back-btn" data-view="main">Назад</button>
            <span>Пользователи</span>
        </div>`;

        const sortedUsers = Object.entries(trackerState.userSeconds)
            .sort((a, b) => b[1] - a[1]);

        for (const [userId, seconds] of sortedUsers.slice(0, 20)) {
            if (seconds > 0) {
                const isNumericId = /^\d+$/.test(userId);
                const userLink = isNumericId ? `/members/${userId}/` : `/${userId}/`;

                html += `<div class="time-tracker-section">
                    <span class="time-tracker-section-name" data-user-id="${userId}" data-is-numeric="${isNumericId}">Пользователь ${isNumericId ? '#' + userId : userId}:</span>
                    <span class="time-tracker-section-time">${formatTime(seconds)}</span>
                </div>`;
            }
        }

        return html;
    }

    function addEventHandlers() {
        document.querySelectorAll('.time-tracker-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                detailedView = btn.dataset.view;
                updateUI();
            });
        });

        document.querySelectorAll('.time-tracker-back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                detailedView = btn.dataset.view;
                updateUI();
            });
        });

        document.querySelectorAll('.time-tracker-section-name[data-thread-id]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const threadId = el.dataset.threadId;
                window.location.href = `/threads/${threadId}/`;
            });
        });

        document.querySelectorAll('.time-tracker-section-name[data-user-id]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const userId = el.dataset.userId;
                const isNumeric = el.dataset.isNumeric === 'true';

                if (isNumeric) {
                    window.location.href = `/members/${userId}/`;
                } else {
                    window.location.href = `/${userId}/`;
                }
            });
        });
    }

    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (totalSeconds < 60) {
            return `${seconds} сек`;
        } else {
            return `${hours > 0 ? hours + ' ч ' : ''}${minutes} мин`;
        }
    }

    function setupVisibilityListener() {
        document.addEventListener('visibilitychange', () => {
            trackerState.isPageActive = !document.hidden;
            trackerState.lastUpdateTime = Date.now();
        });
    }

    function getTodayKey() {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
    }

    window.addEventListener('load', init);
    document.addEventListener('DOMContentLoaded', init);
})();

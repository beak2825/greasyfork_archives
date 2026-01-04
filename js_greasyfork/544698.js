// ==UserScript==
// @name         KiwiSDR Scheduled Recorder
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  KiwiSDR Scheduled Recorder, timed recorder
// @author       JerryXu09
// @license      MIT
// @match        http://*.proxy.kiwisdr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544698/KiwiSDR%20Scheduled%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/544698/KiwiSDR%20Scheduled%20Recorder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Language support
    const LANG = {
        zh: {
            title: 'KiwiSDR Scheduled Recorder',
            setRecord: '显示/隐藏菜单',
            startTime: '开始时间',
            endTime: '结束时间',
            saveWF: '保存频谱图 (仅结束前5分钟)',
            confirm: '确认',
            cancel: '取消',
            recording: '录制中...',
            scheduled: '已计划录制',
            invalidTime: '请输入有效的时间格式！',
            startAfterNow: '开始时间必须在当前时间之后！',
            endAfterStart: '结束时间必须在开始时间之后！',
            alreadyRecording: '检测到已在录音，将在指定时间停止',
            recordingStarted: '录音已开始',
            recordingStopped: '录音已停止',
            wfSaved: '频谱图已保存',
            wfButtonNotFound: '保存频谱图按钮未找到',
            recordingInterrupted: '检测到录音被中断，取消定时任务',
            timeFormat: 'YYYY-MM-DD HH:MM:SS'
        },
        en: {
            title: 'KiwiSDR Scheduled Recorder',
            setRecord: 'Show/Hide Menu',
            startTime: 'Start Time',
            endTime: 'End Time',
            saveWF: 'Save Waterfall (Last 5 min only)',
            confirm: 'Confirm',
            cancel: 'Cancel',
            recording: 'Recording...',
            scheduled: 'Scheduled',
            invalidTime: 'Please enter valid time format!',
            startAfterNow: 'Start time must be after current time!',
            endAfterStart: 'End time must be after start time!',
            alreadyRecording: 'Recording detected, will stop at specified time',
            recordingStarted: 'Recording started',
            recordingStopped: 'Recording stopped',
            wfSaved: 'Waterfall saved',
            wfButtonNotFound: 'Save waterfall button not found',
            recordingInterrupted: 'Recording interrupted, canceling scheduled task',
            timeFormat: 'YYYY-MM-DD HH:MM:SS'
        }
    };

    // Detect language from browser
    const currentLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    const t = LANG[currentLang];

    // State management
    let recordingState = {
        isRecording: false,
        startTimer: null,
        stopTimer: null,
        statusMonitor: null,
        isScheduled: false
    };

    // Get recording button
    const getRecButton = () => document.querySelector('.id-rec1');
    
    // Get save waterfall button
    const getSaveWFButton = () => document.querySelector('.id-btn-grp-56');

    // Check if currently recording by looking for spinning animation
    const isCurrentlyRecording = () => {
        const button = getRecButton();
        return button && button.classList.contains('fa-spin');
    };

    // Click button function
    const clickButton = (button) => {
        if (button) {
            button.click();
            return true;
        }
        return false;
    };

    // Format date time
    const formatDateTime = (date) => {
        const pad = (n) => n < 10 ? '0' + n : n;
        return date.getFullYear() + '-' +
               pad(date.getMonth() + 1) + '-' +
               pad(date.getDate()) + ' ' +
               pad(date.getHours()) + ':' +
               pad(date.getMinutes()) + ':' +
               pad(date.getSeconds());
    };

    // Parse time input (supports seconds)
    const parseTimeInput = (timeStr) => {
        // Try to parse the input time string
        const cleanStr = timeStr.replace(/-/g, '/');
        const date = new Date(cleanStr);
        return isNaN(date) ? null : date;
    };

    // Create draggable floating panel
    const createFloatingPanel = () => {
        // Main container
        const container = document.createElement('div');
        container.id = 'kiwi-auto-record-panel';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 280px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: white;
            overflow: hidden;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        `;

        // Header (draggable)
        const header = document.createElement('div');
        header.style.cssText = `
            background: rgba(255,255,255,0.1);
            padding: 12px 16px;
            cursor: move;
            font-weight: 600;
            text-align: center;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        `;
        header.textContent = t.title;

        // Content area
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 16px;
            display: none;
        `;

        // Toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.style.cssText = `
            width: 100%;
            padding: 10px;
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        `;
        toggleBtn.textContent = t.setRecord;
        toggleBtn.onmouseover = () => toggleBtn.style.background = 'rgba(255,255,255,0.3)';
        toggleBtn.onmouseout = () => toggleBtn.style.background = 'rgba(255,255,255,0.2)';

        // Set default times
        const now = new Date();
        const startDefault = new Date(now.getTime() + 2 * 60 * 1000); // 2 minutes later
        const stopDefault = new Date(now.getTime() + 7 * 60 * 1000);  // 7 minutes later

        // Form elements
        content.innerHTML = `
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 6px; font-size: 13px; opacity: 0.9;">${t.startTime}:</label>
                <input id="startTimeInput" type="text" value="${formatDateTime(startDefault)}" 
                       style="width: 100%; padding: 8px; border: none; border-radius: 6px; background: rgba(255,255,255,0.9); color: #333; font-size: 12px;">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 6px; font-size: 13px; opacity: 0.9;">${t.endTime}:</label>
                <input id="endTimeInput" type="text" value="${formatDateTime(stopDefault)}" 
                       style="width: 100%; padding: 8px; border: none; border-radius: 6px; background: rgba(255,255,255,0.9); color: #333; font-size: 12px;">
            </div>
            <div style="margin-bottom: 16px;">
                <label style="display: flex; align-items: center; font-size: 13px; cursor: pointer;">
                    <input id="saveWFCheckbox" type="checkbox" style="margin-right: 8px;">
                    ${t.saveWF}
                </label>
            </div>
            <div style="display: flex; gap: 8px;">
                <button id="confirmBtn" style="flex: 1; padding: 10px; background: #4CAF50; border: none; border-radius: 6px; color: white; cursor: pointer; font-weight: 500;">
                    ${t.confirm}
                </button>
                <button id="cancelBtn" style="flex: 1; padding: 10px; background: #f44336; border: none; border-radius: 6px; color: white; cursor: pointer; font-weight: 500;">
                    ${t.cancel}
                </button>
            </div>
            <div id="statusDisplay" style="margin-top: 12px; font-size: 12px; text-align: center; opacity: 0.8;"></div>
        `;

        container.appendChild(header);
        container.appendChild(toggleBtn);
        container.appendChild(content);
        document.body.appendChild(container);

        // Make draggable
        let isDragging = false;
        let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === header) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                container.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            isDragging = false;
        }

        // Toggle content visibility
        toggleBtn.addEventListener('click', () => {
            const isVisible = content.style.display !== 'none';
            content.style.display = isVisible ? 'none' : 'block';
            toggleBtn.textContent = recordingState.isScheduled ? t.scheduled : t.setRecord;
        });

        return {
            container,
            content,
            toggleBtn,
            statusDisplay: content.querySelector('#statusDisplay')
        };
    };

    // Monitor recording status
    const startStatusMonitor = () => {
        recordingState.statusMonitor = setInterval(() => {
            const wasRecording = recordingState.isRecording;
            recordingState.isRecording = isCurrentlyRecording();
            
            // Detect recording interruption
            if (wasRecording && !recordingState.isRecording && recordingState.isScheduled) {
                console.log(t.recordingInterrupted);
                clearScheduledTasks();
                updateStatus(t.recordingInterrupted);
            }
        }, 1000);
    };

    // Clear all scheduled tasks
    const clearScheduledTasks = () => {
        if (recordingState.startTimer) {
            clearTimeout(recordingState.startTimer);
            recordingState.startTimer = null;
        }
        if (recordingState.stopTimer) {
            clearTimeout(recordingState.stopTimer);
            recordingState.stopTimer = null;
        }
        if (recordingState.statusMonitor) {
            clearInterval(recordingState.statusMonitor);
            recordingState.statusMonitor = null;
        }
        recordingState.isScheduled = false;
        ui.toggleBtn.textContent = t.setRecord;
    };

    // Update status display
    const updateStatus = (message) => {
        ui.statusDisplay.textContent = message;
        console.log(message);
    };

    // Main scheduling function
    const scheduleRecording = (startTime, endTime, saveWF) => {
        const now = new Date();
        const startDelay = startTime - now;
        const stopDelay = endTime - now;
        const currentlyRecording = isCurrentlyRecording();

        clearScheduledTasks();
        recordingState.isScheduled = true;
        ui.toggleBtn.textContent = t.scheduled;

        if (currentlyRecording) {
            updateStatus(t.alreadyRecording);
            // Only schedule stop
            recordingState.stopTimer = setTimeout(() => {
                const button = getRecButton();
                if (clickButton(button)) {
                    updateStatus(t.recordingStopped);
                    recordingState.isRecording = false;
                    
                    if (saveWF) {
                        setTimeout(() => {
                            const wfButton = getSaveWFButton();
                            if (clickButton(wfButton)) {
                                updateStatus(t.wfSaved);
                            } else {
                                updateStatus(t.wfButtonNotFound);
                            }
                        }, 1000);
                    }
                }
                clearScheduledTasks();
            }, stopDelay);
        } else {
            // Schedule both start and stop
            recordingState.startTimer = setTimeout(() => {
                const button = getRecButton();
                if (clickButton(button)) {
                    updateStatus(t.recordingStarted);
                    recordingState.isRecording = true;
                    
                    recordingState.stopTimer = setTimeout(() => {
                        if (clickButton(button)) {
                            updateStatus(t.recordingStopped);
                            recordingState.isRecording = false;
                            
                            if (saveWF) {
                                setTimeout(() => {
                                    const wfButton = getSaveWFButton();
                                    if (clickButton(wfButton)) {
                                        updateStatus(t.wfSaved);
                                    } else {
                                        updateStatus(t.wfButtonNotFound);
                                    }
                                }, 1000);
                            }
                        }
                        clearScheduledTasks();
                    }, stopDelay - startDelay);
                }
            }, startDelay);
        }

        startStatusMonitor();
    };

    // Initialize UI
    const ui = createFloatingPanel();

    // Event handlers
    ui.content.querySelector('#confirmBtn').addEventListener('click', () => {
        const startTimeStr = document.getElementById('startTimeInput').value;
        const endTimeStr = document.getElementById('endTimeInput').value;
        const saveWF = document.getElementById('saveWFCheckbox').checked;

        const startTime = parseTimeInput(startTimeStr);
        const endTime = parseTimeInput(endTimeStr);
        const now = new Date();

        // Validation
        if (!startTime || !endTime) {
            alert(t.invalidTime);
            return;
        }
        if (startTime <= now) {
            alert(t.startAfterNow);
            return;
        }
        if (endTime <= startTime) {
            alert(t.endAfterStart);
            return;
        }

        scheduleRecording(startTime, endTime, saveWF);
        ui.content.style.display = 'none';
    });

    ui.content.querySelector('#cancelBtn').addEventListener('click', () => {
        ui.content.style.display = 'none';
    });

    // Initialize recording state
    recordingState.isRecording = isCurrentlyRecording();
    
    console.log(`${t.title} loaded successfully`);
})();
// ==UserScript==
// @name         Useless Things Series: Mouse and Keyboard Event Counters
// @version      4.1
// @description  Advanced tracking with WPM, scroll distance, idle time, double-clicks, combos, copy/paste/cut, backspace/delete, arrow keys, enter, undo/redo, export, import, keyboard shortcuts, tab sync, and minimalist floating button UI.
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @namespace https://greasyfork.org/users/1126616
// @downloadURL https://update.greasyfork.org/scripts/482816/Useless%20Things%20Series%3A%20Mouse%20and%20Keyboard%20Event%20Counters.user.js
// @updateURL https://update.greasyfork.org/scripts/482816/Useless%20Things%20Series%3A%20Mouse%20and%20Keyboard%20Event%20Counters.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const sessionData = {
        mouseInches: 0,
        scrollCount: 0,
        scrollPixels: 0,
        letterCount: 0,
        leftClickCount: 0,
        rightClickCount: 0,
        middleClickCount: 0,
        doubleClickCount: 0,
        keyPressCount: {},
        combosPressed: {},
        sessionStart: Date.now(),
        mouseSpeed: 0,
        maxMouseSpeed: 0,
        mouseAcceleration: 0,
        maxAcceleration: 0,
        idleTime: 0,
        lastActivityTime: Date.now(),
        totalIdleTime: 0,
        typingStartTime: null,
        wordsTyped: 0,
        autoHideDelay: 3000,
        copyCount: 0,
        pasteCount: 0,
        cutCount: 0,
        backspaceCount: 0,
        deleteCount: 0,
        arrowUpCount: 0,
        arrowDownCount: 0,
        arrowLeftCount: 0,
        arrowRightCount: 0,
        enterCount: 0,
        undoCount: 0,
        redoCount: 0
    };

    const loadSavedData = () => {
        try {
            const saved = localStorage.getItem('eventCounters');
            if (saved) {
                const data = JSON.parse(saved);
                Object.assign(sessionData, data);
            }
        } catch (e) {
            console.warn('Could not load saved data:', e);
        }
    };

    const saveData = () => {
        try {
            localStorage.setItem('eventCounters', JSON.stringify(sessionData));
            broadcastToTabs('sync', sessionData);
        } catch (e) {
            console.warn('Could not save data:', e);
        }
    };

    const broadcastToTabs = (type, data) => {
        try {
            localStorage.setItem('eventCounters_broadcast', JSON.stringify({
                type,
                data,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Could not broadcast:', e);
        }
    };

    window.addEventListener('storage', (e) => {
        if (e.key === 'eventCounters_broadcast') {
            try {
                const broadcast = JSON.parse(e.newValue);
                if (broadcast.type === 'sync') {
                    Object.assign(sessionData, broadcast.data);
                    updateCounters();
                }
            } catch (err) {
                console.warn('Error handling broadcast:', err);
            }
        }
    });

    const exportData = (format) => {
        const data = {
            ...sessionData,
            exportDate: new Date().toISOString(),
            version: '3.0'
        };
        
        let content, filename, mimeType;
        
        if (format === 'json') {
            content = JSON.stringify(data, null, 2);
            filename = `event-counters-${Date.now()}.json`;
            mimeType = 'application/json';
        } else if (format === 'csv') {
            const rows = [
                ['Metric', 'Value'],
                ['Mouse Distance (inches)', sessionData.mouseInches.toFixed(2)],
                ['Mouse Speed (in/s)', sessionData.mouseSpeed.toFixed(2)],
                ['Max Mouse Speed (in/s)', sessionData.maxMouseSpeed.toFixed(2)],
                ['Mouse Acceleration', sessionData.mouseAcceleration.toFixed(2)],
                ['Max Acceleration', sessionData.maxAcceleration.toFixed(2)],
                ['Scroll Events', sessionData.scrollCount],
                ['Scroll Distance (px)', sessionData.scrollPixels],
                ['Keys Pressed', sessionData.letterCount],
                ['Left Clicks', sessionData.leftClickCount],
                ['Right Clicks', sessionData.rightClickCount],
                ['Middle Clicks', sessionData.middleClickCount],
                ['Double Clicks', sessionData.doubleClickCount],
                ['Words Typed', sessionData.wordsTyped],
                ['WPM', calculateWPM().toFixed(1)],
                ['Copy Actions', sessionData.copyCount],
                ['Paste Actions', sessionData.pasteCount],
                ['Cut Actions', sessionData.cutCount],
                ['Backspaces', sessionData.backspaceCount],
                ['Deletes', sessionData.deleteCount],
                ['Arrow Up', sessionData.arrowUpCount],
                ['Arrow Down', sessionData.arrowDownCount],
                ['Arrow Left', sessionData.arrowLeftCount],
                ['Arrow Right', sessionData.arrowRightCount],
                ['Enter Key', sessionData.enterCount],
                ['Undo (Ctrl+Z)', sessionData.undoCount],
                ['Redo (Ctrl+Y)', sessionData.redoCount],
                ['Total Idle Time (s)', Math.floor(sessionData.totalIdleTime / 1000)],
                ['Session Duration', formatTime(Date.now() - sessionData.sessionStart)]
            ];
            content = rows.map(row => row.join(',')).join('\n');
            filename = `event-counters-${Date.now()}.csv`;
            mimeType = 'text/csv';
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const importData = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.csv';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const imported = JSON.parse(event.target.result);
                        if (confirm(`Import data from "${file.name}"?\n\nCurrent data will be replaced.`)) {
                            Object.assign(sessionData, imported);
                            saveData();
                            updateCounters();
                            showNotification('Data imported successfully!', 'success');
                        }
                    } catch (err) {
                        showNotification('Error importing data: ' + err.message, 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const showNotification = (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            z-index: 10000000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
            backdrop-filter: blur(10px);
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #2196F3, #0b7dda)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };
    
    const createStyle = () => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    };
    createStyle();

    const calculateWPM = () => {
        const sessionDuration = (Date.now() - sessionData.sessionStart) / 1000 / 60;
        if (sessionDuration === 0) return 0;
        return (sessionData.letterCount / 5) / sessionDuration;
    };

    setInterval(() => {
        const now = Date.now();
        const timeSinceActivity = now - sessionData.lastActivityTime;
        if (timeSinceActivity > 5000) {
            sessionData.totalIdleTime += 1000;
        }
    }, 1000);

    setInterval(saveData, 5000);

    loadSavedData();

    // Create floating button
    const floatingButton = document.createElement('div');
    floatingButton.id = 'event-counters-fab';
    floatingButton.textContent = 'EC';
    floatingButton.title = 'Event Counters (Click to toggle)';
    Object.assign(floatingButton.style, {
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#4CAF50',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.1)',
        zIndex: '999998',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        userSelect: 'none',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    });

    floatingButton.addEventListener('mouseenter', () => {
        floatingButton.style.transform = 'scale(1.1) rotate(5deg)';
        floatingButton.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.2)';
    });

    floatingButton.addEventListener('mouseleave', () => {
        floatingButton.style.transform = 'scale(1) rotate(0deg)';
        floatingButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.1)';
    });

    floatingButton.addEventListener('click', () => {
        if (countersDiv.style.display === 'none') {
            countersDiv.style.display = 'block';
            requestAnimationFrame(() => {
                countersDiv.style.opacity = '1';
                countersDiv.style.transform = 'scale(1)';
            });
        } else {
            countersDiv.style.opacity = '0';
            countersDiv.style.transform = 'scale(0.95)';
            setTimeout(() => countersDiv.style.display = 'none', 300);
        }
    });

    // Create panel
    const countersDiv = document.createElement('div');
    countersDiv.id = 'event-counters-panel';
    Object.assign(countersDiv.style, {
        position: 'fixed',
        right: '20px',
        bottom: '86px',
        padding: '18px',
        border: '2px solid #4CAF50',
        borderRadius: '12px',
        transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        color: '#fff',
        userSelect: 'none',
        display: 'none',
        opacity: '0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: '14px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
        backdropFilter: 'blur(16px)',
        zIndex: '999999',
        width: '320px',
        maxHeight: '70vh',
        overflowY: 'auto',
        willChange: 'transform',
        transform: 'scale(0.95)'
    });

    const initUI = () => {
        if (document.body) {
            document.body.appendChild(floatingButton);
            document.body.appendChild(countersDiv);
        } else {
            setTimeout(initUI, 100);
        }
    };
    initUI();

    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 2px solid rgba(76, 175, 80, 0.5);';
    
    const title = document.createElement('div');
    title.textContent = 'Event Counters';
    title.style.cssText = 'font-weight: bold; font-size: 18px; background: linear-gradient(135deg, #4CAF50, #8BC34A); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.title = 'Close Panel';
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: #999;
        font-size: 28px;
        line-height: 1;
        cursor: pointer;
        padding: 0;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        border-radius: 4px;
    `;
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.color = '#fff';
        closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.color = '#999';
        closeBtn.style.background = 'transparent';
    });
    closeBtn.addEventListener('click', () => {
        countersDiv.style.opacity = '0';
        countersDiv.style.transform = 'scale(0.95)';
        setTimeout(() => countersDiv.style.display = 'none', 300);
    });
    
    const headerLeft = document.createElement('div');
    headerLeft.appendChild(title);
    
    header.appendChild(headerLeft);
    header.appendChild(closeBtn);
    countersDiv.appendChild(header);
    
    const buttonGroup = document.createElement('div');
    buttonGroup.style.cssText = 'display: flex; gap: 8px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(76, 175, 80, 0.3);';
    
    const createButton = (text, title, color, hoverColor) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.title = title;
        btn.style.cssText = `
            background: ${color};
            border: none;
            color: white;
            padding: 8px 14px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        `;
        btn.addEventListener('mouseenter', () => {
            btn.style.background = hoverColor;
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = color;
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        });
        return btn;
    };
    
    const exportBtn = createButton('Export', 'Export Data (JSON/CSV)', '#2196F3', '#1976D2');
    exportBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const format = confirm('Choose export format:\n\nOK = JSON (Full Data)\nCancel = CSV (Summary)') ? 'json' : 'csv';
        exportData(format);
        showNotification('Data exported as ' + format.toUpperCase(), 'success');
    });
    
    const importBtn = createButton('Import', 'Import Data (JSON)', '#FF9800', '#F57C00');
    importBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        importData();
    });
    
    const resetBtn = createButton('Reset', 'Reset All Counters', '#f44336', '#d32f2f');
    resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Reset all counters?\n\nThis will erase all tracked data and cannot be undone!')) {
            Object.keys(sessionData).forEach(key => {
                if (key === 'keyPressCount' || key === 'combosPressed') {
                    sessionData[key] = {};
                } else if (key === 'sessionStart' || key === 'lastActivityTime') {
                    sessionData[key] = Date.now();
                } else if (key === 'autoHideDelay') {
                    sessionData[key] = 3000;
                } else {
                    sessionData[key] = 0;
                }
            });
            saveData();
            updateCounters();
            showNotification('All counters reset!', 'success');
        }
    });
    
    buttonGroup.appendChild(exportBtn);
    buttonGroup.appendChild(importBtn);
    buttonGroup.appendChild(resetBtn);
    countersDiv.appendChild(buttonGroup);

    const mouseCounter = createCounter('Mouse Distance');
    const mouseSpeedCounter = createCounter('Mouse Speed');
    const mouseAccelCounter = createCounter('Mouse Acceleration');
    const scrollCounter = createCounter('Scrolls');
    const scrollDistCounter = createCounter('Scroll Distance');
    const letterCounter = createCounter('Keys Pressed');
    const wpmCounter = createCounter('Typing Speed (WPM)');
    const leftClickCounter = createCounter('Left Clicks');
    const rightClickCounter = createCounter('Right Clicks');
    const middleClickCounter = createCounter('Middle Clicks');
    const doubleClickCounter = createCounter('Double Clicks');
    const idleTimeCounter = createCounter('Idle Time');
    const sessionTimeCounter = createCounter('Session Time');
    const topKeysCounter = createCounter('Top 5 Keys');
    const topCombosCounter = createCounter('Top 5 Combos');
    const copyPasteCutCounter = createCounter('Copy/Paste/Cut');
    const backspaceDeleteCounter = createCounter('Backspace/Delete');
    const arrowKeysCounter = createCounter('Arrow Keys');
    const enterCounter = createCounter('Enter Key');
    const undoRedoCounter = createCounter('Undo/Redo');

    [mouseCounter, mouseSpeedCounter, mouseAccelCounter, scrollCounter, scrollDistCounter,
     letterCounter, wpmCounter, leftClickCounter, rightClickCounter, middleClickCounter,
     doubleClickCounter, idleTimeCounter, sessionTimeCounter, topKeysCounter, topCombosCounter,
     copyPasteCutCounter, backspaceDeleteCounter, arrowKeysCounter, enterCounter, undoRedoCounter].forEach(counter => {
        countersDiv.appendChild(counter);
    });

    let timeout;
    let lastScrollTime = Date.now();
    let lastMouseTime = Date.now();
    let lastMouseSpeed = 0;
    let lastClickTime = 0;
    let keysPressed = new Set();

    document.addEventListener('keydown', (e) => {
        // Keyboard shortcuts
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'E') {
            e.preventDefault();
            floatingButton.click();
            return;
        }
        
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'D') {
            e.preventDefault();
            const newDelay = prompt(`Current auto-hide delay: ${sessionData.autoHideDelay}ms\n\nEnter new delay (milliseconds):`, sessionData.autoHideDelay);
            if (newDelay && !isNaN(newDelay)) {
                sessionData.autoHideDelay = parseInt(newDelay);
                saveData();
                alert(`Auto-hide delay set to ${sessionData.autoHideDelay}ms`);
            }
            return;
        }

        sessionData.lastActivityTime = Date.now();
        
        if (e.ctrlKey || e.metaKey) {
            if (e.key.toLowerCase() === 'c') {
                sessionData.copyCount++;
            } else if (e.key.toLowerCase() === 'v') {
                sessionData.pasteCount++;
            } else if (e.key.toLowerCase() === 'x') {
                sessionData.cutCount++;
            } else if (e.key.toLowerCase() === 'z') {
                if (e.shiftKey) {
                    sessionData.redoCount++;
                } else {
                    sessionData.undoCount++;
                }
            } else if (e.key.toLowerCase() === 'y') {
                sessionData.redoCount++;
            }
        }
        
        if (e.key === 'Backspace') {
            sessionData.backspaceCount++;
        } else if (e.key === 'Delete') {
            sessionData.deleteCount++;
        }
        
        if (e.key === 'ArrowUp') {
            sessionData.arrowUpCount++;
        } else if (e.key === 'ArrowDown') {
            sessionData.arrowDownCount++;
        } else if (e.key === 'ArrowLeft') {
            sessionData.arrowLeftCount++;
        } else if (e.key === 'ArrowRight') {
            sessionData.arrowRightCount++;
        }
        
        if (e.key === 'Enter') {
            sessionData.enterCount++;
        }

        sessionData.letterCount++;
        
        if (e.key === ' ') {
            sessionData.wordsTyped++;
        }
        
        const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
        sessionData.keyPressCount[key] = (sessionData.keyPressCount[key] || 0) + 1;
        
        keysPressed.add(e.key);
        const combo = Array.from(keysPressed).sort().join('+');
        if (keysPressed.size > 1) {
            sessionData.combosPressed[combo] = (sessionData.combosPressed[combo] || 0) + 1;
        }

        updateCounters();
    });

    document.addEventListener('mousemove', (e) => {
        sessionData.lastActivityTime = Date.now();
        
        clearTimeout(timeout);

        const currentTime = Date.now();
        const deltaTime = currentTime - lastMouseTime;
        
        const deltaX = e.movementX || 0;
        const deltaY = e.movementY || 0;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        sessionData.mouseInches += distance / 96;
        
        if (deltaTime > 0) {
            const speedInchesPerSec = (distance / 96) / (deltaTime / 1000);
            const acceleration = Math.abs(speedInchesPerSec - lastMouseSpeed) / (deltaTime / 1000);
            
            sessionData.mouseSpeed = speedInchesPerSec;
            sessionData.mouseAcceleration = acceleration;
            
            if (speedInchesPerSec > sessionData.maxMouseSpeed) {
                sessionData.maxMouseSpeed = speedInchesPerSec;
            }
            if (acceleration > sessionData.maxAcceleration) {
                sessionData.maxAcceleration = acceleration;
            }
            
            lastMouseSpeed = speedInchesPerSec;
        }
        
        lastMouseTime = currentTime;
        
        updateCounters();
    });

    document.addEventListener('mouseup', () => {
        // Placeholder for future use
    });

    document.addEventListener('wheel', (event) => {
        sessionData.lastActivityTime = Date.now();
        const currentTime = Date.now();
        if (currentTime - lastScrollTime > 100) {
            sessionData.scrollCount++;
            lastScrollTime = currentTime;
        }
        
        sessionData.scrollPixels += Math.abs(event.deltaY);

        updateCounters();
    }, { passive: true });

    document.addEventListener('keyup', (event) => {
        keysPressed.delete(event.key);
    });

    document.addEventListener('mousedown', (event) => {
        sessionData.lastActivityTime = Date.now();
        const currentTime = Date.now();
        
        if (currentTime - lastClickTime < 300 && event.button === 0) {
            sessionData.doubleClickCount++;
        }
        
        if (event.button === 0) {
            sessionData.leftClickCount++;
        } else if (event.button === 1) {
            sessionData.middleClickCount++;
        } else if (event.button === 2) {
            sessionData.rightClickCount++;
        }
        
        lastClickTime = currentTime;

        updateCounters();
    });

    const formatTime = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    };

    function updateCounters() {
        const sessionDuration = Date.now() - sessionData.sessionStart;
        
        mouseCounter.innerHTML = `Mouse Distance: <strong>${sessionData.mouseInches.toFixed(2)}</strong> in`;
        mouseSpeedCounter.innerHTML = `Speed: <strong>${sessionData.mouseSpeed.toFixed(1)}</strong> in/s (Max: ${sessionData.maxMouseSpeed.toFixed(1)})`;
        mouseAccelCounter.innerHTML = `Acceleration: <strong>${sessionData.mouseAcceleration.toFixed(1)}</strong> (Max: ${sessionData.maxAcceleration.toFixed(1)})`;
        scrollCounter.innerHTML = `Scrolls: <strong>${sessionData.scrollCount}</strong>`;
        scrollDistCounter.innerHTML = `Scroll Distance: <strong>${sessionData.scrollPixels.toFixed(0)}</strong> px`;
        letterCounter.innerHTML = `Keys Pressed: <strong>${sessionData.letterCount}</strong>`;
        wpmCounter.innerHTML = `Typing Speed: <strong>${calculateWPM().toFixed(1)}</strong> WPM`;
        leftClickCounter.innerHTML = `Left Clicks: <strong>${sessionData.leftClickCount}</strong>`;
        rightClickCounter.innerHTML = `Right Clicks: <strong>${sessionData.rightClickCount}</strong>`;
        middleClickCounter.innerHTML = `Middle Clicks: <strong>${sessionData.middleClickCount}</strong>`;
        doubleClickCounter.innerHTML = `Double Clicks: <strong>${sessionData.doubleClickCount}</strong>`;
        idleTimeCounter.innerHTML = `Idle Time: <strong>${formatTime(sessionData.totalIdleTime)}</strong>`;
        sessionTimeCounter.innerHTML = `Session: <strong>${formatTime(sessionDuration)}</strong>`;
        
        copyPasteCutCounter.innerHTML = `Copy/Paste/Cut: <strong>${sessionData.copyCount}</strong> / <strong>${sessionData.pasteCount}</strong> / <strong>${sessionData.cutCount}</strong>`;
        backspaceDeleteCounter.innerHTML = `Backspace/Delete: <strong>${sessionData.backspaceCount}</strong> / <strong>${sessionData.deleteCount}</strong>`;
        
        const totalArrowKeys = sessionData.arrowUpCount + sessionData.arrowDownCount + sessionData.arrowLeftCount + sessionData.arrowRightCount;
        arrowKeysCounter.innerHTML = `Arrow Keys: <strong>${totalArrowKeys}</strong> (↑${sessionData.arrowUpCount} ↓${sessionData.arrowDownCount} ←${sessionData.arrowLeftCount} →${sessionData.arrowRightCount})`;
        
        enterCounter.innerHTML = `Enter Key: <strong>${sessionData.enterCount}</strong>`;
        undoRedoCounter.innerHTML = `Undo/Redo: <strong>${sessionData.undoCount}</strong> / <strong>${sessionData.redoCount}</strong>`;

        const sortedKeys = Object.keys(sessionData.keyPressCount).sort((a, b) => {
            return sessionData.keyPressCount[b] - sessionData.keyPressCount[a];
        });

        let topKeysHTML = 'Top 5 Keys:<br><div style="margin-left: 10px; margin-top: 5px;">';
        for (let i = 0; i < Math.min(5, sortedKeys.length); i++) {
            const key = sortedKeys[i];
            const count = sessionData.keyPressCount[key];
            const barWidth = Math.min((count / sessionData.keyPressCount[sortedKeys[0]]) * 100, 100);
            topKeysHTML += `
                <div style="margin-bottom: 4px;">
                    <span style="display: inline-block; width: 60px;">${key}:</span>
                    <span style="display: inline-block; width: 40px; text-align: right; font-weight: bold;">${count}</span>
                    <div style="display: inline-block; width: 80px; height: 8px; background: #333; border-radius: 4px; margin-left: 5px; vertical-align: middle; overflow: hidden;">
                        <div style="width: ${barWidth}%; height: 100%; background: linear-gradient(90deg, #4CAF50, #8BC34A); border-radius: 4px;"></div>
                    </div>
                </div>
            `;
        }
        topKeysHTML += '</div>';
        topKeysCounter.innerHTML = topKeysHTML;

        const sortedCombos = Object.keys(sessionData.combosPressed).sort((a, b) => {
            return sessionData.combosPressed[b] - sessionData.combosPressed[a];
        });

        let topCombosHTML = 'Top 5 Combos:<br><div style="margin-left: 10px; margin-top: 5px;">';
        if (sortedCombos.length > 0) {
            for (let i = 0; i < Math.min(5, sortedCombos.length); i++) {
                const combo = sortedCombos[i];
                const count = sessionData.combosPressed[combo];
                const barWidth = Math.min((count / sessionData.combosPressed[sortedCombos[0]]) * 100, 100);
                topCombosHTML += `
                    <div style="margin-bottom: 4px;">
                        <span style="display: inline-block; width: 80px; font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${combo}">${combo}:</span>
                        <span style="display: inline-block; width: 30px; text-align: right; font-weight: bold;">${count}</span>
                        <div style="display: inline-block; width: 70px; height: 8px; background: #333; border-radius: 4px; margin-left: 5px; vertical-align: middle; overflow: hidden;">
                            <div style="width: ${barWidth}%; height: 100%; background: linear-gradient(90deg, #FF9800, #FFC107); border-radius: 4px;"></div>
                        </div>
                    </div>
                `;
            }
        } else {
            topCombosHTML += '<span style="color: #999; font-style: italic;">No combos detected yet</span>';
        }
        topCombosHTML += '</div>';
        topCombosCounter.innerHTML = topCombosHTML;
    }

    function createCounter(label) {
        const counter = document.createElement('div');
        counter.style.cssText = `
            margin-bottom: 10px;
            padding: 8px 10px;
            border-radius: 8px;
            background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.05));
            border-left: 3px solid #4CAF50;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        `;
        counter.innerHTML = `${label}: <strong>0</strong>`;
        
        counter.addEventListener('mouseenter', () => {
            counter.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(139, 195, 74, 0.1))';
            counter.style.transform = 'translateX(4px)';
            counter.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });
        
        counter.addEventListener('mouseleave', () => {
            counter.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.05))';
            counter.style.transform = 'translateX(0)';
            counter.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });
        
        return counter;
    }

    setInterval(() => {
        if (countersDiv.style.display === 'block') {
            const sessionDuration = Date.now() - sessionData.sessionStart;
            sessionTimeCounter.innerHTML = `Session: <strong>${formatTime(sessionDuration)}</strong>`;
        }
    }, 1000);

    window.addEventListener('beforeunload', saveData);

    updateCounters();

    console.log('Event Counters v4.1 loaded! Click the floating button or press Ctrl+Shift+E to toggle panel.');
})();

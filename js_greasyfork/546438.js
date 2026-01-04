// ==UserScript==
// @name WME Map Nav History
// @name:de WME Map Navigation History
// @description:de Allows navigation through the map history
// @namespace https://greasyfork.org/de/users/863740-horst-wittlich
// @version 2025.08.15
// @author hiwi234
// @include https://www.waze.com/editor*
// @include https://www.waze.com/*/editor*
// @include https://beta.waze.com/*
// @exclude https://www.waze.com/user/*editor/*
// @exclude https://www.waze.com/*/user/*editor/*
// @grant none
// @license MIT
// @description Navigate through map history using Alt + arrow keys, mouse control, clickable history sidebar, and location highlighting
// @downloadURL https://update.greasyfork.org/scripts/546438/WME%20Map%20Nav%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/546438/WME%20Map%20Nav%20History.meta.js
// ==/UserScript==

/* global W, OpenLayers */
(function() {
'use strict';

console.log('WME Nav History Ultimate: Starting...');

// Global variables - keeping Ultimate features but using Original API
let navigationHistory = [];
let currentIndex = -1;
let isInitialized = false;
let lastSaveTime = 0;
let bookmarks = [];
let workAreas = [];
let tags = [];
let sessionStartTime = Date.now();
let distanceTracker = { totalDistance: 0, sessionDistance: 0 };
let settings = {
    autoSave: true,
    trackingMode: false,
    smartNotifications: true,
    maxHistoryEntries: 100,
    saveInterval: 2000,
    sortOrder: 'newest' // 'newest' oder 'oldest'
};
let currentTab = 'history';
let searchQuery = '';
let highlightedPositions = {};

// Core utility functions
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function formatDistance(km) {
    if (km < 1) return Math.round(km * 1000) + 'm';
    return km.toFixed(2) + 'km';
}

function formatCoords(lat, lon) {
    return lat.toFixed(5) + ', ' + lon.toFixed(5);
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString();
}

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString();
}

function formatSessionTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return hours + 'h ' + (minutes % 60) + 'm';
    if (minutes > 0) return minutes + 'm ' + (seconds % 60) + 's';
    return seconds + 's';
}

function generateLocationName(lat, lon, zoom, customName = null) {
    if (customName) return customName;

    const workArea = workAreas.find(area =>
        lat >= area.bounds.south && lat <= area.bounds.north &&
        lon >= area.bounds.west && lon <= area.bounds.east
    );

    if (workArea) return workArea.name + ' - Zoom ' + zoom;
    return 'Zoom ' + zoom + ' - ' + formatCoords(lat, lon);
}

function showNotification(message, type = 'info', duration = 3000) {
    if (!settings.smartNotifications) return;

    console.log('WME Nav History: ' + message);

    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = 'position:fixed;top:20px;right:20px;padding:12px 20px;border-radius:6px;color:white;font-weight:600;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.3);opacity:0;transform:translateX(100%);transition:all 0.3s ease;background:' + ({
        info: '#4a89dc',
        success: '#5cb85c',
        warning: '#f0ad4e',
        error: '#d9534f'
    }[type] || '#4a89dc');

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
    }, duration);
}

// FIXED: Using EXACT same functions as working original
function saveCurrentPosition() {
    if (!isInitialized || !W.map) return;

    const now = Date.now();
    // Use trackingMode setting but keep Original timing logic
    if (now - lastSaveTime < (settings.trackingMode ? 1000 : settings.saveInterval)) return;

    const center = W.map.getCenter();
    const zoom = W.map.getZoom();

    const lastEntry = navigationHistory[currentIndex];
    if (lastEntry &&
        Math.abs(lastEntry.lat - center.lat) < 0.00001 &&
        Math.abs(lastEntry.lon - center.lon) < 0.00001 &&
        lastEntry.zoom === zoom) {
        return;
    }

    // Calculate distance for Ultimate features
    if (lastEntry) {
        const distance = calculateDistance(lastEntry.lat, lastEntry.lon, center.lat, center.lon);
        distanceTracker.totalDistance += distance;
        distanceTracker.sessionDistance += distance;
    }

    // Remove all entries according to the current index (for branches)
    navigationHistory = navigationHistory.slice(0, currentIndex + 1);

    const newEntry = {
        id: Date.now(),
        lat: center.lat,
        lon: center.lon,
        zoom: zoom,
        timestamp: now,
        name: generateLocationName(center.lat, center.lon, zoom),
        marked: false,
        starred: false,
        tags: [],
        notes: '',
        duration: lastEntry ? now - lastEntry.timestamp : 0
    };

    navigationHistory.push(newEntry);
    currentIndex++;
    lastSaveTime = now;

    // Limit to settings but keep original logic
    if (navigationHistory.length > settings.maxHistoryEntries) {
        const removedEntry = navigationHistory.shift();
        currentIndex--;

        // Update highlighted positions for Ultimate features
        if (removedEntry.marked && highlightedPositions[0]) {
            delete highlightedPositions[0];
        }

        const newHighlightedPositions = {};
        Object.keys(highlightedPositions).forEach(oldIndex => {
            const newIndex = parseInt(oldIndex) - 1;
            if (newIndex >= 0) {
                newHighlightedPositions[newIndex] = highlightedPositions[oldIndex];
            }
        });
        highlightedPositions = newHighlightedPositions;
    }

    updateNavigationButtons();
    updateHistoryList();
    saveToStorage();
}

// FIXED: Using EXACT same navigation as working original
function navigateToPosition(position, index) {
    if (!position || !isInitialized || !W.map) return;

    try {
        // EXACT same method as working original
        const lonlat = new OpenLayers.LonLat(position.lon, position.lat);
        W.map.setCenter(lonlat, position.zoom);

        if (typeof index !== 'undefined') {
            currentIndex = index;
            updateNavigationButtons();
            updateHistoryList();
        }

        showNotification('Navigate to: ' + position.name, 'success');
    } catch (error) {
        console.error('WME Map Nav History: Navigation error:', error);
        showNotification('Navigational error: ' + error.message, 'error');
    }
}

// FIXED: Using same key handling as original
function handleKeyDown(e) {
    if (!isInitialized) return;

    // Don't interfere with input fields
    if (document.activeElement.tagName.toLowerCase() === 'input' ||
        document.activeElement.tagName.toLowerCase() === 'textarea') {
        return;
    }

    if (e.altKey && e.keyCode === 37) { // Alt + Left
        navigateBack();
        e.preventDefault();
    }
    else if (e.altKey && e.keyCode === 39) { // Alt + Right
        navigateForward();
        e.preventDefault();
    }
    else if (e.ctrlKey && e.keyCode === 66) { // Ctrl + B
        addBookmarkCurrentPosition();
        e.preventDefault();
    }
    else if (e.ctrlKey && e.keyCode === 72) { // Ctrl + H
        switchTab('history');
        e.preventDefault();
    }
    else if (e.ctrlKey && e.shiftKey && e.keyCode === 83) { // Ctrl + Shift + S
        exportData();
        e.preventDefault();
    }
}

function navigateBack() {
    if (currentIndex > 0) {
        currentIndex--;
        navigateToPosition(navigationHistory[currentIndex]);
        updateNavigationButtons();
        updateHistoryList();
        showNotification('Back to: ' + navigationHistory[currentIndex].name, 'info');
    } else {
        showNotification('Already at the beginning of the history', 'warning');
    }
}

function navigateForward() {
    if (currentIndex < navigationHistory.length - 1) {
        currentIndex++;
        navigateToPosition(navigationHistory[currentIndex]);
        updateNavigationButtons();
        updateHistoryList();
        showNotification('Forward to: ' + navigationHistory[currentIndex].name, 'info');
    } else {
        showNotification('Already at the end of the history', 'warning');
    }
}

function updateNavigationButtons() {
    const backBtn = document.getElementById('nav-history-back');
    const forwardBtn = document.getElementById('nav-history-forward');

    if (backBtn) {
        backBtn.disabled = currentIndex <= 0;
        backBtn.style.opacity = currentIndex <= 0 ? '0.5' : '1';
    }

    if (forwardBtn) {
        forwardBtn.disabled = currentIndex >= navigationHistory.length - 1;
        forwardBtn.style.opacity = currentIndex >= navigationHistory.length - 1 ? '0.5' : '1';
    }

    // Update status display for Ultimate features
    const statusElement = document.getElementById('nav-status');
    if (statusElement) {
        if (navigationHistory.length > 0) {
            statusElement.textContent = 'Position ' + (currentIndex + 1) + ' from ' + navigationHistory.length;
        } else {
            statusElement.textContent = 'No history available';
        }
    }
}

// Position highlighting from original - FIXED
function togglePositionHighlight(index) {
    const position = navigationHistory[index];
    if (!position) return;

    if (highlightedPositions[index]) {
        delete highlightedPositions[index];
        position.marked = false;
    } else {
        highlightedPositions[index] = true;
        position.marked = true;
    }

    updateHistoryList();
    saveToStorage();
}

// FIXED: History list update using exact original logic
function updateHistoryList() {
    const historyContainer = document.getElementById('nav-history-list');
    if (!historyContainer) return;

    // Handle search and filtering
    let filteredHistory = searchQuery ?
        navigationHistory.filter(entry =>
            entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            formatCoords(entry.lat, entry.lon).includes(searchQuery)
        ) : [...navigationHistory];

    // Apply sorting
    if (settings.sortOrder === 'oldest') {
        filteredHistory.sort((a, b) => a.timestamp - b.timestamp);
    } else {
        filteredHistory.sort((a, b) => b.timestamp - a.timestamp);
    }

    if (filteredHistory.length === 0) {
        historyContainer.innerHTML = '<div class="no-history">' + (searchQuery ? 'No search results found' : 'No history available') + '</div>';
        return;
    }

    let html = '';
    filteredHistory.forEach((entry) => {
        const actualIndex = navigationHistory.indexOf(entry);
        const isCurrent = actualIndex === currentIndex;
        const isMarked = entry.marked || false;
        const time = formatTime(entry.timestamp);

        html += `
            <div class="history-item ${isCurrent ? 'current' : ''} ${isMarked ? 'marked' : ''}" data-index="${actualIndex}">
                <div class="history-item-header">
                    <span class="history-item-time">${time}</span>
                    <div class="history-item-controls">
                        ${isCurrent ? '<span class="current-marker">Currently</span>' : ''}
                        <button class="mark-button ${isMarked ? 'marked' : ''}" data-index="${actualIndex}" title="${isMarked ? 'Remove position' : 'Mark position'}">
                            ${isMarked ? '★' : '☆'}
                        </button>
                        <button class="bookmark-button" data-index="${actualIndex}" title="Save as bookmark">
                            🔖
                        </button>
                    </div>
                </div>
                <div class="history-item-location">
                    ${entry.name}
                </div>
                <div class="history-item-coords">
                    ${formatCoords(entry.lat, entry.lon)}
                </div>
                ${entry.duration ? '<div class="history-item-duration">Length of stay: ' + formatSessionTime(entry.duration) + '</div>' : ''}
            </div>
        `;
    });

    historyContainer.innerHTML = html;

    // FIXED: Event Listener - exactly like original
    historyContainer.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.classList.contains('mark-button') || e.target.classList.contains('bookmark-button')) {
                return;
            }
            const index = parseInt(this.dataset.index);
            navigateToPosition(navigationHistory[index], index);
        });
    });

    // FIXED: Marker buttons - exactly like original
    historyContainer.querySelectorAll('.mark-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.dataset.index);
            togglePositionHighlight(index);
        });
    });

    // Event Listener für Bookmark-Buttons
    historyContainer.querySelectorAll('.bookmark-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.dataset.index);
            const entry = navigationHistory[index];
            if (entry) {
                const name = prompt('Name for Bookmark:', entry.name);
                if (name) addBookmark(name, entry.lat, entry.lon, entry.zoom);
            }
        });
    });
}

// Bookmark management - Ultimate features with Original API
function addBookmark(name, lat, lon, zoom, description = '', tags = []) {
    const bookmark = {
        id: Date.now(),
        name: name || generateLocationName(lat, lon, zoom),
        lat: lat,
        lon: lon,
        zoom: zoom,
        timestamp: Date.now(),
        description: description,
        tags: tags,
        visits: 0,
        lastVisited: null
    };

    bookmarks.push(bookmark);
    saveToStorage();
    updateUI();
    showNotification('Bookmark "' + bookmark.name + '" Added', 'success');
    return bookmark;
}

function addBookmarkCurrentPosition() {
    if (!W || !W.map) return;

    try {
        const center = W.map.getCenter();
        const zoom = W.map.getZoom();

        const name = prompt('Name for Bookmark:');
        if (name) {
            const description = prompt('Description (optional):') || '';
            addBookmark(name, center.lat, center.lon, zoom, description);
        }
    } catch (error) {
        console.error('Error adding bookmark:', error);
        showNotification('Error adding bookmark: ' + error.message, 'error');
    }
}

function removeBookmark(id) {
    bookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    saveToStorage();
    updateUI();
    showNotification('Bookmarks removed', 'info');
}

function navigateToBookmark(bookmark) {
    bookmark.visits++;
    bookmark.lastVisited = Date.now();
    navigateToPosition(bookmark);
    saveToStorage();
    updateUI();
}

// Work area management
function addWorkArea() {
    if (!W || !W.map) return;

    try {
        const center = W.map.getCenter();
        const zoom = W.map.getZoom();

        const name = prompt('Name for Working area:');
        if (!name) return;

        const offset = 0.01 / Math.pow(2, zoom - 10);

        const workArea = {
            id: Date.now(),
            name: name,
            bounds: {
                north: center.lat + offset,
                south: center.lat - offset,
                east: center.lon + offset,
                west: center.lon - offset
            },
            created: Date.now(),
            visits: 0,
            color: '#' + Math.floor(Math.random()*16777215).toString(16)
        };

        workAreas.push(workArea);
        saveToStorage();
        updateUI();
        showNotification('Working area "' + name + '" Added', 'success');
    } catch (error) {
        console.error('Error adding work area:', error);
    }
}

function removeWorkArea(id) {
    workAreas = workAreas.filter(area => area.id !== id);
    saveToStorage();
    updateUI();
    showNotification('Workspace removed', 'info');
}

function navigateToWorkArea(workArea) {
    const centerLat = (workArea.bounds.north + workArea.bounds.south) / 2;
    const centerLon = (workArea.bounds.east + workArea.bounds.west) / 2;

    try {
        // EXACT same method as working original
        const lonlat = new OpenLayers.LonLat(centerLon, centerLat);
        W.map.setCenter(lonlat, 15);

        workArea.visits++;
        saveToStorage();
        updateUI();
        showNotification('Navigate to Workspace: ' + workArea.name, 'info');
    } catch (error) {
        console.error('Error navigating to work area:', error);
        showNotification('Error navigating to workspace: ' + error.message, 'error');
    }
}

// Data management - Ultimate features
function saveToStorage() {
    try {
        const data = {
            history: navigationHistory,
            currentIndex: currentIndex,
            bookmarks: bookmarks,
            workAreas: workAreas,
            tags: tags,
            distanceTracker: distanceTracker,
            settings: settings,
            highlightedPositions: highlightedPositions,
            lastSave: Date.now()
        };
        localStorage.setItem('wme-nav-history-ultimate', JSON.stringify(data));
    } catch (error) {
        console.error('WME Nav History: Storage error:', error);
    }
}

function loadFromStorage() {
    try {
        const data = localStorage.getItem('wme-nav-history-ultimate');
        if (data) {
            const parsed = JSON.parse(data);
            navigationHistory = parsed.history || [];
            currentIndex = parsed.currentIndex || -1;
            bookmarks = parsed.bookmarks || [];
            workAreas = parsed.workAreas || [];
            tags = parsed.tags || [];
            distanceTracker = parsed.distanceTracker || { totalDistance: 0, sessionDistance: 0 };
            settings = Object.assign(settings, parsed.settings || {});
            highlightedPositions = parsed.highlightedPositions || {};

            if (currentIndex >= navigationHistory.length) {
                currentIndex = navigationHistory.length - 1;
            }
        }
    } catch (error) {
        console.error('WME Nav History: Load error:', error);
    }
}

function clearHistory() {
    if (confirm('Really delete history? This action cannot be undone.')) {
        highlightedPositions = {};
        navigationHistory = [];
        currentIndex = -1;
        distanceTracker.sessionDistance = 0;
        updateNavigationButtons();
        updateHistoryList();
        saveToStorage();
        showNotification('History deleted', 'info');
    }
}

function exportData() {
    const exportData = {
        navigationHistory: navigationHistory,
        bookmarks: bookmarks,
        workAreas: workAreas,
        tags: tags,
        distanceTracker: distanceTracker,
        settings: settings,
        exportDate: new Date().toISOString(),
        version: '2025.08.13-Ultimate-Fixed-History'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'wme-nav-history-' + new Date().toISOString().split('T')[0] + '.json');
    linkElement.click();

    showNotification('Data exported: ' + navigationHistory.length + ' Positions, ' + bookmarks.length + ' Bookmark', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';

    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);

                if (!importedData || typeof importedData !== 'object') {
                    throw new Error('Invalid file structure');
                }

                const merge = confirm('Do you want to merge the data (OK) or replace it completely (Cancel)?');

                if (merge) {
                    if (importedData.navigationHistory && Array.isArray(importedData.navigationHistory)) {
                        navigationHistory = [...navigationHistory, ...importedData.navigationHistory];
                    }
                    if (importedData.bookmarks && Array.isArray(importedData.bookmarks)) {
                        bookmarks = [...bookmarks, ...importedData.bookmarks];
                    }
                    if (importedData.workAreas && Array.isArray(importedData.workAreas)) {
                        workAreas = [...workAreas, ...importedData.workAreas];
                    }
                    if (importedData.tags && Array.isArray(importedData.tags)) {
                        tags = [...new Set([...tags, ...importedData.tags])];
                    }
                    showNotification('Data successfully merged', 'success');
                } else {
                    navigationHistory = importedData.navigationHistory || [];
                    bookmarks = importedData.bookmarks || [];
                    workAreas = importedData.workAreas || [];
                    tags = importedData.tags || [];

                    if (importedData.distanceTracker) {
                        distanceTracker.totalDistance = importedData.distanceTracker.totalDistance || 0;
                    }

                    if (importedData.settings) {
                        settings = Object.assign(settings, importedData.settings);
                    }

                    showNotification('Data successfully replaced', 'success');
                }

                currentIndex = Math.max(0, navigationHistory.length - 1);

                navigationHistory = navigationHistory.filter(entry =>
                    entry && typeof entry.lat === 'number' && typeof entry.lon === 'number'
                );

                updateUI();
                saveToStorage();

                showNotification('Import Enclosed: ' + navigationHistory.length + ' Positions, ' + bookmarks.length + ' Bookmark', 'success');
            } catch (error) {
                console.error('Import error:', error);
                showNotification('Error when importing: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}

// UI Updates for Ultimate features
function updateUI() {
    updateNavigationButtons();
    updateContent();
}

function updateContent() {
    const contentArea = document.getElementById('nav-content-area');
    if (!contentArea) return;

    while (contentArea.firstChild) {
        contentArea.removeChild(contentArea.firstChild);
    }

    // Set full height for statistics and settings tabs
    if (currentTab === 'statistics' || currentTab === 'settings') {
        contentArea.classList.add('full-height');
    } else {
        contentArea.classList.remove('full-height');
    }

    switch(currentTab) {
        case 'history':
            renderHistoryContent(contentArea);
            break;
        case 'bookmarks':
            renderBookmarksContent(contentArea);
            break;
        case 'areas':
            renderWorkAreasContent(contentArea);
            break;
        case 'statistics':
            renderStatisticsContent(contentArea);
            break;
        case 'settings':
            renderSettingsContent(contentArea);
            break;
    }
}

function renderHistoryContent(container) {
    // Clear container first
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Create history list container if it doesn't exist
    let historyList = document.getElementById('nav-history-list');
    if (!historyList) {
        historyList = document.createElement('div');
        historyList.id = 'nav-history-list';
        historyList.className = 'history-list';
        historyList.style.cssText = 'max-height: 300px; overflow-y: auto;';
        container.appendChild(historyList);
    } else {
        container.appendChild(historyList);
    }

    // Update the history list content
    updateHistoryList();
}

function renderBookmarksContent(container) {
    if (bookmarks.length === 0) {
        const noBookmarks = document.createElement('div');
        noBookmarks.textContent = 'No bookmarks available';
        noBookmarks.style.cssText = 'padding:20px;text-align:center;color:#666;font-style:italic;';
        container.appendChild(noBookmarks);
        return;
    }

    bookmarks.forEach(bookmark => {
        const item = document.createElement('div');
        item.style.cssText = 'padding:12px;border-bottom:1px solid #eee;cursor:pointer;transition:background 0.2s;border-left:3px solid #28a745;';

        const header = document.createElement('div');
        header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;';

        const name = document.createElement('span');
        name.textContent = bookmark.name;
        name.style.cssText = 'font-weight:600;color:#2c3e50;';
        header.appendChild(name);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:12px;';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Bookmark "' + bookmark.name + '" Really delete?')) {
                removeBookmark(bookmark.id);
            }
        });
        header.appendChild(deleteBtn);

        item.appendChild(header);

        const details = document.createElement('div');
        details.style.cssText = 'font-size:11px;color:#666;margin-bottom:3px;';
        details.textContent = formatCoords(bookmark.lat, bookmark.lon) + ' | Visits: ' + bookmark.visits;
        item.appendChild(details);

        if (bookmark.description) {
            const description = document.createElement('div');
            description.textContent = bookmark.description;
            description.style.cssText = 'font-size:12px;color:#666;margin:5px 0;font-style:italic;';
            item.appendChild(description);
        }

        item.addEventListener('click', () => navigateToBookmark(bookmark));
        container.appendChild(item);
    });
}

function renderWorkAreasContent(container) {
    if (workAreas.length === 0) {
        const noAreas = document.createElement('div');
        noAreas.textContent = 'No workspaces defined';
        noAreas.style.cssText = 'padding:20px;text-align:center;color:#666;font-style:italic;';
        container.appendChild(noAreas);
        return;
    }

    workAreas.forEach(area => {
        const item = document.createElement('div');
        item.style.cssText = 'padding:12px;border-bottom:1px solid #eee;cursor:pointer;transition:background 0.2s;';

        const header = document.createElement('div');
        header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;';

        const nameContainer = document.createElement('div');
        nameContainer.style.cssText = 'display:flex;align-items:center;gap:8px;';

        const colorIndicator = document.createElement('span');
        colorIndicator.style.cssText = 'width:12px;height:12px;border-radius:50%;background:' + area.color;
        nameContainer.appendChild(colorIndicator);

        const name = document.createElement('span');
        name.textContent = area.name;
        name.style.cssText = 'font-weight:600;color:#2c3e50;';
        nameContainer.appendChild(name);

        header.appendChild(nameContainer);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:12px;';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Working area "' + area.name + '" Really delete?')) {
                removeWorkArea(area.id);
            }
        });
        header.appendChild(deleteBtn);

        item.appendChild(header);

        const details = document.createElement('div');
        details.style.cssText = 'font-size:11px;color:#666;';
        details.textContent = 'Besuche: ' + area.visits + ' | Erstellt: ' + formatDate(area.created);
        item.appendChild(details);

        item.addEventListener('click', () => navigateToWorkArea(area));
        container.appendChild(item);
    });
}

function renderStatisticsContent(container) {
    const sessionTime = Date.now() - sessionStartTime;
    const avgZoom = navigationHistory.length > 0 ?
        navigationHistory.reduce((sum, entry) => sum + entry.zoom, 0) / navigationHistory.length : 0;

    // Calculate marked positions count
    const markedCount = navigationHistory.filter(e => e.marked).length;

    // Get session positions (positions added this session)
    const sessionPositions = navigationHistory.filter(entry =>
        entry.timestamp >= sessionStartTime
    ).length;

    const statsGrid = document.createElement('div');
    statsGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit, minmax(120px, 1fr));gap:8px;padding:10px;width:100%;';

    const stats = [
        { value: navigationHistory.length.toString(), label: 'Positions' },
        { value: bookmarks.length.toString(), label: 'Bookmark' },
        { value: markedCount.toString(), label: 'Marked' },
        { value: sessionPositions.toString(), label: 'Session Pos.' },
        { value: formatDistance(distanceTracker.totalDistance), label: 'Total distance' },
        { value: formatDistance(distanceTracker.sessionDistance), label: 'Session Distance' },
        { value: formatSessionTime(sessionTime), label: 'Session time' },
        { value: avgZoom.toFixed(1), label: 'Ø Zoom' }
    ];

    stats.forEach(stat => {
        const statItem = document.createElement('div');
        statItem.style.cssText = 'text-align:center;padding:8px;background:#f8f9fa;border-radius:4px;border:1px solid #e9ecef;min-width:0;';

        const value = document.createElement('div');
        value.textContent = stat.value;
        value.style.cssText = 'font-size:14px;font-weight:bold;color:#4a89dc;margin-bottom:2px;word-break:break-all;';
        statItem.appendChild(value);

        const label = document.createElement('div');
        label.textContent = stat.label;
        label.style.cssText = 'font-size:9px;color:#666;text-transform:uppercase;letter-spacing:0.3px;line-height:1.1;word-break:break-word;';
        statItem.appendChild(label);

        statsGrid.appendChild(statItem);
    });

    container.appendChild(statsGrid);
}

function renderSettingsContent(container) {
    const settingsContainer = document.createElement('div');
    settingsContainer.style.cssText = 'padding:10px;';

    // Auto Save Setting
    const autoSaveContainer = document.createElement('div');
    autoSaveContainer.style.cssText = 'margin-bottom:15px;padding:12px;background:white;border-radius:6px;border:1px solid #e1e4e8;';

    const autoSaveTitle = document.createElement('h4');
    autoSaveTitle.textContent = 'Automatic saving';
    autoSaveTitle.style.cssText = 'margin:0 0 8px 0;color:#2c3e50;font-size:14px;';
    autoSaveContainer.appendChild(autoSaveTitle);

    const autoSaveLabel = document.createElement('label');
    autoSaveLabel.style.cssText = 'display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;';

    const autoSaveCheckbox = document.createElement('input');
    autoSaveCheckbox.type = 'checkbox';
    autoSaveCheckbox.checked = settings.autoSave;
    autoSaveCheckbox.addEventListener('change', () => {
        settings.autoSave = autoSaveCheckbox.checked;
        saveToStorage();
        showNotification('Automatic saving ' + (settings.autoSave ? 'Activated' : 'Deactivated'), 'info');
    });
    autoSaveLabel.appendChild(autoSaveCheckbox);

    const autoSaveText = document.createElement('span');
    autoSaveText.textContent = 'Save positions automatically';
    autoSaveLabel.appendChild(autoSaveText);

    autoSaveContainer.appendChild(autoSaveLabel);
    settingsContainer.appendChild(autoSaveContainer);

    // Tracking Mode Setting
    const trackingContainer = document.createElement('div');
    trackingContainer.style.cssText = 'margin-bottom:15px;padding:12px;background:white;border-radius:6px;border:1px solid #e1e4e8;';

    const trackingTitle = document.createElement('h4');
    trackingTitle.textContent = 'Tracking mode';
    trackingTitle.style.cssText = 'margin:0 0 8px 0;color:#2c3e50;font-size:14px;';
    trackingContainer.appendChild(trackingTitle);

    const trackingLabel = document.createElement('label');
    trackingLabel.style.cssText = 'display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;';

    const trackingCheckbox = document.createElement('input');
    trackingCheckbox.type = 'checkbox';
    trackingCheckbox.checked = settings.trackingMode;
    trackingCheckbox.addEventListener('change', () => {
        settings.trackingMode = trackingCheckbox.checked;
        saveToStorage();
        showNotification('Tracking mode ' + (settings.trackingMode ? 'aktiviert' : 'deaktiviert'), 'info');
    });
    trackingLabel.appendChild(trackingCheckbox);

    const trackingText = document.createElement('span');
    trackingText.textContent = 'More frequent position storage (1s instead of 2s)';
    trackingLabel.appendChild(trackingText);

    trackingContainer.appendChild(trackingLabel);
    settingsContainer.appendChild(trackingContainer);

    // Notifications Setting
    const notificationsContainer = document.createElement('div');
    notificationsContainer.style.cssText = 'margin-bottom:15px;padding:12px;background:white;border-radius:6px;border:1px solid #e1e4e8;';

    const notificationsTitle = document.createElement('h4');
    notificationsTitle.textContent = 'Notifications';
    notificationsTitle.style.cssText = 'margin:0 0 8px 0;color:#2c3e50;font-size:14px;';
    notificationsContainer.appendChild(notificationsTitle);

    const notificationsLabel = document.createElement('label');
    notificationsLabel.style.cssText = 'display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;';

    const notificationsCheckbox = document.createElement('input');
    notificationsCheckbox.type = 'checkbox';
    notificationsCheckbox.checked = settings.smartNotifications;
    notificationsCheckbox.addEventListener('change', () => {
        settings.smartNotifications = notificationsCheckbox.checked;
        saveToStorage();
        showNotification('Pop-up notifications ' + (settings.smartNotifications ? 'Activated' : 'Deactivated'), 'info');
    });
    notificationsLabel.appendChild(notificationsCheckbox);

    const notificationsText = document.createElement('span');
    notificationsText.textContent = 'Show pop-up messages at the top right';
    notificationsLabel.appendChild(notificationsText);

    notificationsContainer.appendChild(notificationsLabel);
    settingsContainer.appendChild(notificationsContainer);

    // Sort Order Setting
    const sortContainer = document.createElement('div');
    sortContainer.style.cssText = 'margin-bottom:15px;padding:12px;background:white;border-radius:6px;border:1px solid #e1e4e8;';

    const sortTitle = document.createElement('h4');
    sortTitle.textContent = 'History Sorting';
    sortTitle.style.cssText = 'margin:0 0 8px 0;color:#2c3e50;font-size:14px;';
    sortContainer.appendChild(sortTitle);

    const sortSelect = document.createElement('select');
    sortSelect.style.cssText = 'width:100%;padding:6px;border:1px solid #e1e4e8;border-radius:4px;font-size:12px;';
    sortSelect.innerHTML = `
        <option value="newest" ${settings.sortOrder === 'newest' ? 'selected' : ''}>Newest first</option>
        <option value="oldest" ${settings.sortOrder === 'oldest' ? 'selected' : ''}>Oldest first</option>
    `;
    sortSelect.addEventListener('change', () => {
        settings.sortOrder = sortSelect.value;
        saveToStorage();
        updateUI();
        showNotification('Sorting changed to: ' + (settings.sortOrder === 'newest' ? 'Newest first' : 'Oldest first'), 'info');
    });
    sortContainer.appendChild(sortSelect);

    settingsContainer.appendChild(sortContainer);

    // Data Management
    const dataContainer = document.createElement('div');
    dataContainer.style.cssText = 'margin-bottom:15px;padding:12px;background:white;border-radius:6px;border:1px solid #e1e4e8;';

    const dataTitle = document.createElement('h4');
    dataTitle.textContent = 'Data management';
    dataTitle.style.cssText = 'margin:0 0 10px 0;color:#2c3e50;font-size:14px;';
    dataContainer.appendChild(dataTitle);

    const buttonGrid = document.createElement('div');
    buttonGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;';

    const exportBtn = document.createElement('button');
    exportBtn.className = 'nav-history-button';
    exportBtn.innerHTML = '📤<br>Export';
    exportBtn.style.cssText = 'min-height:40px;font-size:11px;padding:6px;';
    exportBtn.addEventListener('click', exportData);
    buttonGrid.appendChild(exportBtn);

    const importBtn = document.createElement('button');
    importBtn.className = 'nav-history-button';
    importBtn.innerHTML = '📥<br>Import';
    importBtn.style.cssText = 'min-height:40px;background:linear-gradient(135deg, #28a745, #1e7e34);font-size:11px;padding:6px;';
    importBtn.addEventListener('click', importData);
    buttonGrid.appendChild(importBtn);

    dataContainer.appendChild(buttonGrid);

    const description = document.createElement('div');
    description.style.cssText = 'font-size:10px;color:#666;line-height:1.3;';
    description.innerHTML = '<strong>Export:</strong> Saves all data as JSON file<br><strong>Import:</strong> Loads stored data (merge or replace)';
    dataContainer.appendChild(description);

    settingsContainer.appendChild(dataContainer);
    container.appendChild(settingsContainer);
}

function switchTab(tabName) {
    currentTab = tabName;

    // Update tab buttons
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });

    // Update header
    const headerTitle = document.getElementById('nav-header-title');
    const headerControls = document.getElementById('nav-header-controls');

    if (headerTitle && headerControls) {
        while (headerControls.firstChild) {
            headerControls.removeChild(headerControls.firstChild);
        }

        switch(tabName) {
            case 'history':
                headerTitle.textContent = 'History';
                const clearBtn = document.createElement('button');
                clearBtn.className = 'nav-history-button clear-history-button';
                clearBtn.textContent = '🗑️ Delete';
                clearBtn.addEventListener('click', clearHistory);
                headerControls.appendChild(clearBtn);
                break;

            case 'bookmarks':
                headerTitle.textContent = 'Bookmark';
                const addBookmarkBtn = document.createElement('button');
                addBookmarkBtn.className = 'nav-history-button';
                addBookmarkBtn.style.cssText = 'padding:4px 8px;font-size:12px;';
                addBookmarkBtn.textContent = '➕ Add';
                addBookmarkBtn.addEventListener('click', addBookmarkCurrentPosition);
                headerControls.appendChild(addBookmarkBtn);
                break;

            case 'statistics':
                headerTitle.textContent = 'Statistics';
                break;

            case 'settings':
                headerTitle.textContent = 'Settings';
                break;
        }
    }

    updateUI();
}

// FIXED: Using EXACT same sidebar creation as working original
async function createSidebarTab() {
    try {
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("wme-nav-history-ultimate");
        tabLabel.innerText = 'NAV+';
        tabLabel.title = 'Ultimate Navigation History';

        await W.userscripts.waitForElementConnected(tabPane);

        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            .nav-history-button {
                padding: 8px 15px;
                cursor: pointer;
                background: #4a89dc;
                color: white;
                border: none;
                border-radius: 4px;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                min-width: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
            }

            .nav-history-button:hover {
                background: #5d9cec;
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                transform: translateY(-1px);
            }

            .nav-history-button:active {
                transform: translateY(1px);
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }

            .nav-history-button:disabled {
                background: #b5b5b5;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            .nav-history-container {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 10px 0;
                box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            }

            .clear-history-button {
                background: #dc3545;
                padding: 6px 12px;
                font-size: 12px;
                min-width: auto;
            }

            .clear-history-button:hover {
                background: #c82333;
            }

            .history-section {
                margin-top: 20px;
                background: #fff;
                border-radius: 6px;
                border: 1px solid #e1e4e8;
            }

            .history-header {
                padding: 15px;
                border-bottom: 1px solid #e1e4e8;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #f8f9fa;
                border-radius: 6px 6px 0 0;
            }

            .history-controls {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .history-list {
                max-height: 300px;
                overflow-y: auto;
            }

            .history-item {
                padding: 12px 15px;
                border-bottom: 1px solid #f0f0f0;
                cursor: pointer;
                transition: background-color 0.2s ease;
                position: relative;
            }

            .history-item:hover {
                background-color: #f8f9fa;
            }

            .history-item.current {
                background-color: #e8f4fd;
                border-left: 4px solid #4a89dc;
            }

            .history-item.marked {
                border-left: 4px solid #ffd700;
                background-color: #fffbf0;
            }

            .history-item.starred {
                border-left: 4px solid #ffd700;
                background-color: #fffbf0;
            }

            .history-item.current.marked {
                border-left: 4px solid #4a89dc;
                background: linear-gradient(to right, #e8f4fd, #fffbf0);
            }

            .history-item:last-child {
                border-bottom: none;
            }

            .history-item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            }

            .history-item-controls {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .history-item-time {
                font-size: 12px;
                color: #666;
                font-weight: 600;
            }

            .current-marker {
                font-size: 10px;
                background: #4a89dc;
                color: white;
                padding: 2px 6px;
                border-radius: 10px;
                font-weight: 600;
            }

            .mark-button, .bookmark-button {
                background: none;
                border: none;
                font-size: 16px;
                cursor: pointer;
                padding: 2px 4px;
                border-radius: 3px;
                transition: all 0.2s ease;
                color: #ccc;
            }

            .mark-button:hover, .bookmark-button:hover {
                background: rgba(0,0,0,0.1);
                color: #ffd700;
            }

            .mark-button.marked {
                color: #ffd700;
            }

            .history-item-location {
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 3px;
                font-size: 13px;
            }

            .history-item-coords {
                font-size: 11px;
                color: #7f8c8d;
                font-family: monospace;
            }

            .history-item-duration {
                font-size: 11px;
                color: #666;
                margin-top: 3px;
            }

            .no-history {
                padding: 20px;
                text-align: center;
                color: #666;
                font-style: italic;
            }

            .nav-tabs {
                display: flex;
                background: linear-gradient(135deg, #e9ecef, #dee2e6);
                border-radius: 8px;
                margin-bottom: 15px;
                overflow: hidden;
                box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
            }

            .nav-tab-btn {
                flex: 1;
                padding: 8px 4px;
                background: transparent;
                border: none;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                font-size: 9px;
                text-align: center;
                line-height: 1.1;
                color: #495057;
            }

            .nav-tab-btn:hover {
                background: rgba(74, 137, 220, 0.1);
            }

            .nav-tab-btn.active {
                background: linear-gradient(135deg, #4a89dc, #357abd);
                color: white;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
            }

            .nav-search {
                width: 100%;
                padding: 10px 15px;
                border: 2px solid #e9ecef;
                border-radius: 6px;
                font-size: 14px;
                box-sizing: border-box;
                margin-bottom: 15px;
                transition: border-color 0.3s ease, box-shadow 0.3s ease;
            }

            .nav-search:focus {
                outline: none;
                border-color: #4a89dc;
                box-shadow: 0 0 0 3px rgba(74, 137, 220, 0.1);
            }

            .nav-section {
                background: white;
                border-radius: 6px;
                border: 1px solid #e1e4e8;
                margin: 10px 0;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }

            .nav-header {
                padding: 12px 15px;
                background: linear-gradient(135deg, #f1f3f4, #e8eaed);
                border-bottom: 1px solid #e1e4e8;
                border-radius: 6px 6px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 600;
                color: #2c3e50;
            }

            .nav-content {
                max-height: 350px;
                overflow-y: auto;
                scrollbar-width: thin;
            }

            .nav-content.full-height {
                max-height: none;
                overflow-y: visible;
            }

            .nav-content::-webkit-scrollbar {
                width: 6px;
            }

            .nav-content::-webkit-scrollbar-track {
                background: #f1f1f1;
            }

            .nav-content::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 3px;
            }
        `;
        document.head.appendChild(styleSheet);

        tabPane.innerHTML = `
            <div class="nav-history-container">
                <h5 style="margin-top: 0; color: #2c3e50;">WME Navigation History</h5>
                <p style="color: #4CAF50; display: flex; align-items: center; gap: 5px; margin: 0 0 5px 0;">
                    <span style="font-size: 18px;">✓</span> Script successfully loaded
                </p>
                <div id="nav-status" style="font-size:10px;color:#666;margin:0 0 15px 0;">Initialisierung...</div>

                <input type="text" class="nav-search" placeholder="Search in History, Bookmarks..." id="nav-search-input">

                <div style="display: flex; gap: 15px; margin: 20px 0;">
                    <button id="nav-history-back" class="nav-history-button">
                        <span style="font-size: 16px;">⬅️</span> Back
                    </button>
                    <button id="nav-history-forward" class="nav-history-button">
                        Forwards <span style="font-size: 16px;">➡️</span>
                    </button>
                </div>

                <div class="nav-tabs">
                    <button class="nav-tab-btn active" data-tab="history">📍<br>History</button>
                    <button class="nav-tab-btn" data-tab="bookmarks">🔖<br>Bookmarks</button>
                    <button class="nav-tab-btn" data-tab="statistics">📊<br>Stats</button>
                    <button class="nav-tab-btn" data-tab="settings">⚙️<br>Config</button>
                </div>

                <div class="nav-section">
                    <div class="nav-header">
                        <strong id="nav-header-title">History</strong>
                        <div id="nav-header-controls" style="display:flex;gap:5px;">
                            <button class="nav-history-button clear-history-button" id="clear-history">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                    <div id="nav-content-area" class="nav-content">
                        <div id="nav-history-list" class="history-list">
                            <div class="no-history">No history available</div>
                        </div>
                    </div>
                </div>

                <div style="margin-top:15px;padding:15px;background:white;border-radius:6px;border:1px solid #e1e4e8;">
                    <strong style="color: #2c3e50;">Control:</strong>
                    <ul style="padding-left: 20px; color: #4a5568; margin: 10px 0;">
                        <li><strong>Alt + ←</strong> Previous Position</li>
                        <li><strong>Alt + →</strong> Next Position</li>
                        <li><strong>Click</strong> On history entry for direct jump</li>
                        <li><strong>★ Button</strong> Position Mark</li>
                        <li><strong>🔖 Button</strong> Save as bookmark</li>
                    </ul>

                    <strong style="color: #2c3e50;">Notes:</strong>
                    <ul style="padding-left: 20px; color: #4a5568; margin: 10px 0;">
                        <li>The history stores up to 100 positions</li>
                        <li>New positions are automatically saved when the card is moved</li>
                        <li>History is automatically saved and loaded the next time you startn</li>
                        <li>Marked positions are highlighted in the list</li>
                        <li>Highlights remain even after restart</li>
                        <li>All data can be secured via export/import</li>
                    </ul>

                    <strong style="color: #2c3e50;">Shortcuts:</strong><br>
                    <span style="font-size: 11px; color: #666;">
                        Alt+←/→ Navigation | Ctrl+B Bookmark | Ctrl+H History | Ctrl+Shift+S Export
                    </span>
                </div>
            </div>
        `;

        const backBtn = tabPane.querySelector('#nav-history-back');
        const forwardBtn = tabPane.querySelector('#nav-history-forward');
        const clearBtn = tabPane.querySelector('#clear-history');
        const searchInput = tabPane.querySelector('#nav-search-input');

        backBtn.addEventListener('click', navigateBack);
        forwardBtn.addEventListener('click', navigateForward);
        clearBtn.addEventListener('click', clearHistory);

        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            updateUI();
        });

        // Tab switching
        tabPane.querySelectorAll('.nav-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                switchTab(btn.dataset.tab);
            });
        });

        updateNavigationButtons();
        updateHistoryList();
        showNotification('Navigation History+ Ultimate activated - History repaired', 'success');

        return true;
    } catch (error) {
        console.error('WME Map Nav History: Error creating sidebar tab:', error);
        return false;
    }
}

// FIXED: Using EXACT same initialization as working original
function initializeScript() {
    if (isInitialized) return;

    try {
        loadFromStorage();

        // EXACT same event registration as working original
        W.map.events.register('moveend', null, saveCurrentPosition);
        document.addEventListener('keydown', handleKeyDown);

        createSidebarTab();

        isInitialized = true;
        saveCurrentPosition();

        console.log('WME Map Nav History Ultimate: Successfully initialized with fixed history display');
    } catch (error) {
        console.error('WME Map Nav History: Initialization error:', error);
        isInitialized = false;
    }
}

// EXACT same initialization check as working original
if (W?.userscripts?.state.isInitialized) {
    initializeScript();
} else {
    document.addEventListener("wme-initialized", initializeScript, {
        once: true,
    });
}

})();
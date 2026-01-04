// ==UserScript==
// @name         Claude Storage Data Exporter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Monitors storage for Claude chat data and exports to endpoint
// @author       nickm8
// @match        https://claude.ai/chat/*
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522475/Claude%20Storage%20Data%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/522475/Claude%20Storage%20Data%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debug logging
    const DEBUG = true;
    const log = {
        debug: (...args) => DEBUG && console.log('🔍 EXPORT:', ...args),
        error: (...args) => console.error('❌ EXPORT:', ...args),
        info: (...args) => console.log('ℹ️ EXPORT:', ...args)
    };

    // Configuration
    const CONFIG = {
        storageKey: 'captured_chat_data',
        endpoint: 'http://localhost:8000/collect',
        checkInterval: 1000
    };

    // Export functionality
    function exportData(data) {
        const requestObj = {
            method: 'POST',
            url: CONFIG.endpoint,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                type: 'chatData',
                data: data,
                timestamp: new Date().toISOString(),
                url: window.location.href
            }),
            onload: function(response) {
                log.info('Data exported successfully:', response.responseText);
                // Clear storage after successful export
                localStorage.removeItem(CONFIG.storageKey);
            },
            onerror: function(error) {
                log.error('Error exporting data:', error);
            }
        };

        if (typeof GM !== 'undefined' && GM.xmlHttpRequest) {
            GM.xmlHttpRequest(requestObj);
        }
        else if (typeof GM_xmlhttpRequest !== 'undefined') {
            GM_xmlhttpRequest(requestObj);
        }
        else {
            log.error('Neither GM.xmlHttpRequest nor GM_xmlhttpRequest is available');
        }
    }

    // Check storage and export
    function checkAndExport() {
        try {
            const data = localStorage.getItem(CONFIG.storageKey);
            if (data) {
                log.debug('Found data in storage');
                const parsedData = JSON.parse(data);
                exportData(parsedData);
            }
        } catch (error) {
            log.error('Check and export failed:', error);
        }
    }

    // Start monitoring
    setInterval(checkAndExport, CONFIG.checkInterval);

    // Initialize
    log.info('Storage export initialized');
})();
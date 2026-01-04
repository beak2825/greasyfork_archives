// ==UserScript==
// @name         Relay.app Workflow Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Downloads workflows from relay.app
// @author       Jordan Haisley jordan@b-w.pro
// @match        https://run.relay.app/workflows/*/edit
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525424/Relayapp%20Workflow%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/525424/Relayapp%20Workflow%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .download-workflow-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            padding: 10px 20px;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            z-index: 9999;
        }
        .download-workflow-btn:hover {
            background: #0052a3;
        }
        .download-workflow-btn.loading {
            background: #666;
            cursor: wait;
        }
    `;
    document.head.appendChild(style);

    // Save helper
    function saveJSON(data, filename) {
        if(!data) {
            console.error('No data');
            return;
        }

        const jsonStr = typeof data === "object" ? JSON.stringify(data, undefined, 4) : data;
        const blob = new Blob([jsonStr], {type: 'text/json'});
        const a = document.createElement('a');
        
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(a.href);
    }

    // Get template ID from URL
    function getTemplateId() {
        const match = window.location.pathname.match(/\/workflows\/([^/]+)\/edit/);
        return match ? match[1] : null;
    }

    // Create minimal tRPC client
    const trpcClient = {
        query: async (path, input) => {
            const response = await fetch(`/api/trpc/${path}?input=${encodeURIComponent(JSON.stringify({json: input}))}`, {
                headers: {
                    'accept': 'application/json'
                },
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const result = await response.json();
            return result.result.data;
        }
    };

    // Create and add button
    const button = document.createElement('button');
    button.textContent = 'Download Workflow';
    button.className = 'download-workflow-btn';
    document.body.appendChild(button);

    // Add click handler
    button.addEventListener('click', async () => {
        button.textContent = 'Downloading...';
        button.classList.add('loading');

        try {
            const templateId = getTemplateId();
            if (!templateId) {
                throw new Error('Could not find workflow ID');
            }

            const result = await trpcClient.query('flowtemplate.load', {
                id: templateId
            });
            
            saveJSON(result, `workflow_${templateId}.json`);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download workflow');
        } finally {
            button.textContent = 'Download Workflow';
            button.classList.remove('loading');
        }
    });
})();

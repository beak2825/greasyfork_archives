// ==UserScript==
// @name         Claude Chat Downloader
// @namespace    http://tampermonkey.net/
// @version      2.0 alpha
// @description  Add download button to save Claude AI conversations in TXT, MD, or JSON format
// @author       Papa Casper
// @homepage     https://papacasper.com
// @repository   https://github.com/PapaCasper
// @source       https://github.com/PapaCasper/claude-downloader
// @supportURL   https://github.com/PapaCasper/claude-downloader/issues
// @match        https://claude.ai/chat/*
// @match        https://claude.ai/chats/*
// @match        https://claude.ai/project/*
// @match        https://claude.ai/projects/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513935/Claude%20Chat%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/513935/Claude%20Chat%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_BASE_URL = 'https://claude.ai/api';

    const styles = `
        .claude-download-button {
            display: flex;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            color: var(--text-200);
            cursor: pointer;
            align-items: center;
            justify-content: space-between;
            border: 1px solid var(--border-300);
            background-color: transparent;
            transition: all 0.2s ease;
            flex: 1;
            min-width: 85px;
            margin-right: 0.5rem;
            position: relative;
        }
        .claude-download-button:last-child {
            margin-right: 0;
        }
        .claude-download-button:hover {
            background-color: var(--bg-500, rgba(39, 39, 42, 0.4));
            color: var(--text-100);
            border-color: var(--text-200);
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .claude-download-button:active {
            transform: translateY(0);
        }
        .claude-download-button svg {
            width: 1.25rem;
            height: 1.25rem;
            margin-left: 0.5rem;
        }
    `;

    // Add styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // API Request Function
    function apiRequest(method, endpoint, data = null, headers = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: `${API_BASE_URL}${endpoint}`,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                data: data ? JSON.stringify(data) : null,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error(`API request failed with status ${response.status}`));
                    }
                },
                onerror: (error) => {
                    reject(error);
                },
            });
        });
    }

    // Get Organization ID
    async function getOrganizationId() {
        const organizations = await apiRequest('GET', '/organizations');
        return organizations[0].uuid;
    }

    // Get Conversation History
    async function getConversationHistory(orgId, id) {
        const isProject = window.location.pathname.includes('/project/');
        const endpoint = isProject ? 
            `/organizations/${orgId}/projects/${id}` :
            `/organizations/${orgId}/chat_conversations/${id}`;
        return await apiRequest('GET', endpoint);
    }

    // Format conversion
    function convertToFormat(data, format) {
        const isProject = window.location.pathname.includes('/project/');
        
        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'txt') {
            const messages = isProject ? data.conversations[0].chat_messages : data.chat_messages;
            return messages.map(message => {
                const sender = message.sender === 'human' ? 'User' : 'Claude';
                return `${sender}:\n${message.text}\n\n`;
            }).join('');
        } else if (format === 'md') {
            let content = `# ${isProject ? 'Claude Project Export' : 'Claude Chat Export'}\n\n`;
            content += `*Exported on ${new Date().toLocaleString()}*\n\n---\n\n`;
            
            const messages = isProject ? data.conversations[0].chat_messages : data.chat_messages;
            messages.forEach(message => {
                const sender = message.sender === 'human' ? 'User' : 'Claude';
                const text = message.text.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
                    return `\`\`\`${lang}\n${code.trim()}\`\`\`\n`;
                });
                content += `### ${sender}\n\n${text}\n\n---\n\n`;
            });
            
            return content;
        }
    }

    // Download Function
    async function downloadChat(format) {
        try {
            const orgId = await getOrganizationId();
            const id = window.location.pathname.split('/').pop();
            const data = await getConversationHistory(orgId, id);
            
            const content = convertToFormat(data, format);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const prefix = window.location.pathname.includes('/project/') ? 'claude-project' : 'claude-chat';
            const filename = `${prefix}-${timestamp}.${format}`;

            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading conversation:', error);
            alert('Error downloading conversation. Please try again.');
        }
    }

    // Create and add download buttons
    function addDownloadButton() {
        if (document.querySelector('.claude-download-container')) return;

        // Create the buttons container with row layout
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'flex flex-row gap-2 mt-2';

        // Create format buttons
        const formats = [
            { id: 'txt', label: 'TXT', title: 'Download as plain text file' },
            { id: 'md', label: 'MD', title: 'Download as markdown file with formatting' },
            { id: 'json', label: 'JSON', title: 'Download complete conversation data' }
        ];

        formats.forEach(format => {
            const formatButton = document.createElement('button');
            formatButton.className = 'claude-download-button';
            formatButton.title = format.title;
            formatButton.innerHTML = `
                <span>${format.label}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V152a8,8,0,0,1,16,0v56H208V152a8,8,0,0,1,16,0ZM117.66,154.34a8,8,0,0,0,11.31,0l40-40a8,8,0,0,0-11.31-11.31L136,124.69V40a8,8,0,0,0-16,0v84.69L98.34,103a8,8,0,0,0-11.31,11.31Z"/>
                </svg>
            `;
            formatButton.addEventListener('click', () => downloadChat(format.id));
            buttonsContainer.appendChild(formatButton);
        });

        // Find the chat controls header and insert after it
        const chatControlsHeader = document.querySelector('.font-styrene-display.flex-1.text-lg');
        if (chatControlsHeader) {
            const headerParent = chatControlsHeader.closest('div');
            headerParent.parentNode.insertBefore(buttonsContainer, headerParent.nextSibling);
        }
    }

    // Observer setup
    const observer = new MutationObserver((mutations) => {
        const shouldAddButton = mutations.some(mutation => 
            Array.from(mutation.addedNodes).some(node => 
                node.nodeType === 1 && 
                (node.matches('.px-5.pb-4.pt-3') || node.querySelector('.px-5.pb-4.pt-3'))
            )
        );

        if (shouldAddButton) {
            addDownloadButton();
        }
    });

    function startObserver() {
        const targetNode = document.documentElement;
        if (targetNode) {
            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
            // Initial check
            addDownloadButton();
        } else {
            setTimeout(startObserver, 500);
        }
    }

    startObserver();
})();
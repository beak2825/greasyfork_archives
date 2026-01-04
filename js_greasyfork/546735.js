// ==UserScript==
// @name         SPUG AI Analyzer
// @namespace    http://tampermonkey.net/ 
// @version      1.0
// @description  Add AI analysis capabilities to SPUG pages
// @author       Lynn
// @match        https://spug.dongfangfuli.com/deploy/task*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      10.55.39.15
// @connect      127.0.0.1
// @connect      cdn.jsdelivr.net
// @connect      unpkg.com
// @require      https://unpkg.com/marked@4.3.0/marked.min.js
// @downloadURL https://update.greasyfork.org/scripts/546735/SPUG%20AI%20Analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/546735/SPUG%20AI%20Analyzer.meta.js
// ==/UserScript==

// ==UserScript==
// @name         SPUG AI Analyzer
// @namespace    http://tampermonkey.net/ 
// @version      0.2
// @description  Add AI analysis capabilities to SPUG pages
// @author       Lynn
// @match        https://spug.dongfangfuli.com/deploy/task*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      10.55.39.15
// @connect      127.0.0.1
// @connect      cdn.jsdelivr.net
// @require      https://cdn.jsdelivr.net/npm/marked/marked.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const BACKEND_URL = 'http://10.55.39.15:5005';

    // --- UI & Styling ---

    // Inject CSS for the modal
    GM_addStyle(`
        .ai-modal-backdrop {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.5); z-index: 1050;
        }
        .ai-modal {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 80vw; max-width: 1200px; height: 80vh;
            background-color: #fff; border-radius: 8px; z-index: 1051;
            display: flex; flex-direction: column; box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        }
        .ai-modal-header {
            padding: 1rem; border-bottom: 1px solid #dee2e6;
            display: flex; justify-content: space-between; align-items: center;
        }
        .ai-modal-header h5 { margin: 0; font-size: 1.25rem; }
        .ai-modal-close {
            border: none; background: transparent; font-size: 1.5rem; cursor: pointer;
        }
        .ai-modal-body { flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column; }
        .ai-modal-progress-bar-container { padding: 0.5rem 1rem; }
        .ai-modal-progress-bar {
            width: 100%; background-color: #e9ecef; border-radius: .25rem;
            height: 20px; display: flex;
        }
        .ai-modal-progress {
            background-color: #0d6efd; color: white; text-align: center;
            transition: width .6s ease; height: 100%; border-radius: .25rem;
        }
        .ai-modal-progress.indeterminate {
            background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
            background-size: 1rem 1rem;
            animation: ai-progress-bar-stripes 1s linear infinite;
        }
        @keyframes ai-progress-bar-stripes {
            from { background-position: 1rem 0; }
            to { background-position: 0 0; }
        }
        .ai-modal-tabs {
            display: flex; list-style: none; padding-left: 0; margin: 0 1rem;
            border-bottom: 1px solid #dee2e6;
        }
        .ai-modal-tab-btn {
            padding: .5rem 1rem; border: 1px solid transparent; cursor: pointer;
            border-bottom: none;
        }
        .ai-modal-tab-btn.active {
            font-weight: bold; border-color: #dee2e6 #dee2e6 #fff;
            border-top-left-radius: .25rem; border-top-right-radius: .25rem;
        }
        .ai-modal-tab-content { flex-grow: 1; padding: 1rem; overflow-y: auto; }
        .ai-modal-tab-pane { display: none; }
        .ai-modal-tab-pane.active { display: block; }
        .ai-modal-tab-pane pre {
            background-color: #f6f8fa;
            border-radius: 6px;
            font-size: 85%;
            line-height: 1.45;
            overflow: auto;
            padding: 16px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .ai-modal-tab-pane code {
            color: #d63384;
            background-color: rgba(214, 51, 132, 0.07);
            border-radius: 6px;
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
            font-size: .875em;
            margin: 0;
            padding: 0.2em 0.4em;
            word-wrap: break-word;
        }
        .ai-modal-tab-pane pre > code {
            background-color: transparent;
            border: 0;
            color: inherit;
            font-size: inherit;
            margin: 0;
            padding: 0;
            white-space: inherit;
        }
        .ai-modal.minimized {
            width: 180px;
            height: 45px;
            top: auto;
            left: auto;
            bottom: 15px;
            right: 15px;
            transform: none;
            cursor: pointer;
            border-radius: 25px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease-in-out;
        }
        .ai-modal.minimized:hover {
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        .ai-modal.minimized .ai-modal-body {
            display: none;
        }
        .ai-modal.minimized .ai-modal-header {
            border-bottom: none;
            padding: 0;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: center;
        }
        .ai-modal.minimized .ai-modal-header h5 {
            display: none;
        }
        .ai-modal.minimized .ai-modal-header::before {
            content: 'AI Analysis';
            color: #333;
            font-weight: 600;
            font-size: 1rem;
        }
        .ai-modal.minimized .ai-modal-close {
            display: none; /* Hide original buttons */
        }
        .ai-modal.minimized .restore-btn {
            display: block !important; /* Show restore button */
            position: absolute;
            right: 10px;
        }
    `);

    // Function to create the analysis modal
    function createAnalysisModal() {
        const backdrop = document.createElement('div');
        backdrop.className = 'ai-modal-backdrop';

        const modal = document.createElement('div');
        modal.className = 'ai-modal';

        // Header
        const header = document.createElement('div');
        header.className = 'ai-modal-header';
        const title = document.createElement('h5');
        title.textContent = 'AI-Powered Summary';

        const buttonGroup = document.createElement('div');

        const minimizeButton = document.createElement('button');
        minimizeButton.className = 'ai-modal-close';
        minimizeButton.innerHTML = '&#8213;'; // Em dash
        minimizeButton.title = 'Minimize';

        const closeButton = document.createElement('button');
        closeButton.className = 'ai-modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.title = 'Close';

        buttonGroup.append(minimizeButton, closeButton);
        header.append(title, buttonGroup);


        // Body
        const body = document.createElement('div');
        body.className = 'ai-modal-body';

        // Progress Bar
        const progressBarContainer = document.createElement('div');
        progressBarContainer.className = 'ai-modal-progress-bar-container';
        const progressBarOuter = document.createElement('div');
        progressBarOuter.className = 'ai-modal-progress-bar';
        const progressBar = document.createElement('div');
        progressBar.className = 'ai-modal-progress';
        progressBar.style.width = '0%';
        progressBarOuter.appendChild(progressBar);
        progressBarContainer.appendChild(progressBarOuter);

        // Tabs and Content
        const tabs = document.createElement('ul');
        tabs.className = 'ai-modal-tabs';
        const tabContent = document.createElement('div');
        tabContent.className = 'ai-modal-tab-content';
        
        const placeholder = document.createElement('div');
        placeholder.style.cssText = 'text-align: center; padding: 2rem; color: #6c757d;';
        placeholder.textContent = '正在准备分析，请稍候...';
        tabContent.appendChild(placeholder);

        body.append(progressBarContainer, tabs, tabContent);
        modal.append(header, body);
        document.body.append(backdrop, modal);

        const closeModal = () => {
            backdrop.remove();
            modal.remove();
        };

        const toggleMinimize = () => {
            const isMinimized = modal.classList.toggle('minimized');
            backdrop.style.display = isMinimized ? 'none' : 'block';
        };

        minimizeButton.onclick = toggleMinimize;

        // Restore when clicking the minimized modal itself
        modal.addEventListener('click', (e) => {
            if (modal.classList.contains('minimized')) {
                // Make sure not to trigger when clicking on a button inside it, if any
                if (e.target === modal || e.target.classList.contains('ai-modal-header')) {
                    toggleMinimize();
                }
            }
        });

        closeButton.onclick = closeModal;
        backdrop.onclick = (e) => {
            // Only close if backdrop itself is clicked, not the modal
            if (e.target === backdrop) {
                closeModal();
            }
        };

        return { modal, tabs, tabContent, progressBar, placeholder };
    }

    // --- Core Logic ---

    // Utility function to create a button
    function createButton(text, className = 'ant-btn') {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = text;
        btn.className = className;
        return btn;
    }

    // Function to extract task and sub-task IDs
    function getTaskIds() {
        const urlParts = window.location.pathname.split('/');
        const taskId = urlParts[urlParts.length - 1];
        const subTasks = [];
        const rows = document.querySelectorAll('.ant-table-tbody .ant-table-row');

        rows.forEach(row => {
            const appCell = row.querySelector('td:nth-child(2)');
            const versionCell = row.querySelector('td:nth-child(8)');

            if (appCell && versionCell) {
                let appName = appCell.textContent.trim().replace(/^灰/, '').split('\n')[0].trim();
                const testVersionLink = versionCell.querySelector('a[href*="/commit/"]');
                if (appName && testVersionLink) {
                    const href = testVersionLink.href;
                    const commitParts = href.split('/commit/');
                    if (commitParts.length > 1) {
                        const repoUrl = commitParts[0];
                        const commitHash = commitParts[1].split('#')[0].substring(0, 8);
                        subTasks.push({ app_name: appName, repo_url: repoUrl, commit_hash: commitHash });
                    }
                }
            }
        });
        console.log('Final sub-tasks:', subTasks);
        return { task_id: taskId, sub_tasks: subTasks };
    }

    function streamAnalysis(taskData, button) {
        const { modal, tabs, tabContent, progressBar, placeholder } = createAnalysisModal();
        const totalApps = taskData.sub_tasks.length;

        progressBar.textContent = '0 / ' + totalApps;
        progressBar.style.width = '0%';

        let finalSummaryContent = '';
        let finalSummaryPane = null;
        const appSummaryStates = {};

        const activateTab = (tabBtn) => {
            tabs.querySelectorAll('.ai-modal-tab-btn').forEach(btn => btn.classList.remove('active'));
            tabContent.querySelectorAll('.ai-modal-tab-pane').forEach(pane => pane.classList.remove('active'));
            tabBtn.classList.add('active');
            const targetPane = document.getElementById(tabBtn.dataset.target);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        };

        function handleStreamData(data) {
            if (placeholder && placeholder.parentNode) {
                placeholder.remove();
            }

            if (data.type === 'app_summary_started') {
                const appName = data.app_name;
                const paneId = `pane-${appName.replace(/[^a-zA-Z0-9]/g, '-')}`;
                appSummaryStates[appName] = { content: '', paneId: paneId };

                const tabBtn = document.createElement('button');
                tabBtn.className = 'ai-modal-tab-btn';
                tabBtn.textContent = appName;
                tabBtn.dataset.target = paneId;
                tabBtn.onclick = () => activateTab(tabBtn);
                tabs.appendChild(tabBtn);

                const pane = document.createElement('div');
                pane.className = 'ai-modal-tab-pane';
                pane.id = paneId;
                tabContent.appendChild(pane);

                activateTab(tabBtn);

            } else if (data.type === 'app_summary_chunk') {
                const appName = data.app_name;
                if (appSummaryStates[appName]) {
                    appSummaryStates[appName].content += data.content;
                    const pane = document.getElementById(appSummaryStates[appName].paneId);
                    if (pane) {
                        pane.innerHTML = marked.parse(appSummaryStates[appName].content);
                    }
                }
            } else if (data.type === 'progress') {
                const percent = (data.processed / data.total) * 100;
                progressBar.style.width = `${percent}%`;
                progressBar.textContent = `${data.processed} / ${data.total}`;

            } else if (data.type === 'final_summary_started') {
                const paneId = 'pane-final-summary';
                const tabBtn = document.createElement('button');
                tabBtn.className = 'ai-modal-tab-btn';
                tabBtn.textContent = 'Final Summary';
                tabBtn.dataset.target = paneId;
                tabBtn.onclick = () => activateTab(tabBtn);
                tabs.appendChild(tabBtn);

                finalSummaryPane = document.createElement('div');
                finalSummaryPane.className = 'ai-modal-tab-pane';
                finalSummaryPane.id = paneId;
                tabContent.appendChild(finalSummaryPane);
                activateTab(tabBtn);

            } else if (data.type === 'final_chunk') {
                if (finalSummaryPane) {
                    finalSummaryContent += data.content;
                    finalSummaryPane.innerHTML = marked.parse(finalSummaryContent);
                }
            }
        }

        GM_xmlhttpRequest({
            method: 'POST',
            url: `${BACKEND_URL}/summarize_all`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(taskData),
            responseType: 'stream',
            onloadstart: function(stream) {
                const reader = stream.response.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                function processStream() {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            console.log('Stream complete.');
                            button.disabled = false;
                            button.textContent = 'AI分析';
                            return;
                        }

                        buffer += decoder.decode(value, { stream: true });
                        let boundary;
                        while ((boundary = buffer.indexOf('\n\n')) !== -1) {
                            const message = buffer.substring(0, boundary);
                            buffer = buffer.substring(boundary + 2);

                            if (message.startsWith('data: ')) {
                                try {
                                    const data = JSON.parse(message.substring(6));
                                    handleStreamData(data);
                                } catch (e) {
                                    console.error('Error parsing stream JSON:', e, message);
                                }
                            }
                        }
                        processStream();
                    });
                }
                processStream();
            },
            onerror: function(error) {
                console.error('Fetch request error:', error);
                tabContent.innerHTML = `<p style="color: red;">分析失败: ${error.statusText || '无法连接到后端服务'}</p>`;
                button.disabled = false;
                button.textContent = 'AI分析';
            }
        });
    }

    // Function to show a simple error alert
    function showError(error, button) {
        console.error('AI Analysis Error:', error);
        alert('AI Analysis failed: ' + (error.message || error));
        if (button) {
            button.disabled = false;
            button.textContent = 'AI分析✨';
        }
    }

    // Main function to inject the AI analysis button
    function injectAiButton() {
        // Try to find the anchor element directly in case the page is already loaded.
        const anchor = document.querySelector('.ant-page-header-heading-extra .ant-space');
        if (anchor) {
            injectButton(anchor);
            return; // Button injected, no need for an observer.
        }
        // If the anchor isn't there yet, set up an observer to wait for it.
        const observer = new MutationObserver(function(mutations, obs) {
            const anchor = document.querySelector('.ant-page-header-heading-extra .ant-space');
            if (anchor) {
                injectButton(anchor);
                obs.disconnect(); // Stop observing once the button is injected
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function injectButton(anchorElement) {
        // Remove existing button to ensure it's fresh on navigation
        const existingBtn = document.querySelector('.ai-analyze-btn');
        if (existingBtn) {
            const spaceItem = existingBtn.closest('.ant-space-item');
            if (spaceItem) {
                spaceItem.remove();
            }
        }

        // Match the style of the "Edit" button
        const analyzeBtn = createButton('AI分析✨', 'ant-btn ant-btn-default ai-analyze-btn');

        analyzeBtn.addEventListener('click', function() {
            this.disabled = true;
            this.textContent = '分析中...';
            try {
                const taskData = getTaskIds();
                if (!taskData.sub_tasks || taskData.sub_tasks.length === 0) {
                    alert('未能提取到任何有效的应用和提交信息。');
                    this.disabled = false;
                    this.textContent = 'AI分析✨';
                    return;
                }
                streamAnalysis(taskData, this);
            } catch (error) {
                showError(error, this);
            }
        });

        // Wrap button in a space item to align correctly with other buttons
        const spaceItem = document.createElement('div');
        spaceItem.className = 'ant-space-item';
        spaceItem.appendChild(analyzeBtn);

        // Append the button to the container with the other actions
        anchorElement.appendChild(spaceItem);
        console.log('AI analyze button added to page header actions.');
    }

    let tableObserver = null;
    // Function to inject the diff links into the table
    function injectDiffLinks() {
        if (tableObserver) {
            tableObserver.disconnect();
        }
        tableObserver = new MutationObserver((mutations, obs) => {
            const taskId = window.location.pathname.split('/').pop();
            if (!taskId || !window.location.pathname.startsWith('/deploy/task/')) {
                return;
            }
            const rows = document.querySelectorAll('.ant-table-tbody .ant-table-row');
            if (rows.length === 0) return;

            rows.forEach(row => {
                const rowKey = row.getAttribute('data-row-key');
                if (!rowKey) return;

                const targetCell = row.querySelector('td:last-child > span');
                if (!targetCell) return;

                const url = `${BACKEND_URL}/diff/${taskId}/${rowKey}`;

                let link = row.querySelector('.diff-link-btn');
                if (link) {
                    if (link.href !== url) {
                        link.href = url;
                    }
                } else {
                    const divider = document.createElement('div');
                    divider.className = 'ant-divider ant-divider-vertical';
                    divider.setAttribute('role', 'separator');

                    link = document.createElement('a');
                    link.href = url;
                    link.textContent = '🔍 差异';
                    link.target = '_blank';
                    link.className = 'ant-btn ant-btn-link diff-link-btn';
                    link.style.padding = '0px';

                    targetCell.prepend(divider);
                    targetCell.prepend(link);
                }
            });
        });
        tableObserver.observe(document.body, { childList: true, subtree: true });
    }

    function runAllInjections() {
        injectAiButton();
        injectDiffLinks();
    }

    // Run the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllInjections);
    } else {
        runAllInjections();
    }

    // Set up an observer to handle SPA navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // If we are on a task page, re-run main logic.
            // A small delay helps ensure the page content is updated.
            if (window.location.pathname.startsWith('/deploy/task/')) {
                setTimeout(runAllInjections, 500);
            }
        }
    }).observe(document.body, { childList: true, subtree: true });
})();


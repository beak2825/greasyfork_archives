// ==UserScript==
// @name         GLIF AI Batch Generator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  AI-powered batch image generation for GLIF
// @author       i12bp8
// @match        https://glif.app/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/519957/GLIF%20AI%20Batch%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/519957/GLIF%20AI%20Batch%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Modern SVG Icons
    const icons = {
        close: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>`,
        generate: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>`,
        loading: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a10 10 0 0 1 10 10"/>
        </svg>`
    };

    // Inject styles
    function injectStyles() {
        const styles = `
            .ai-batch-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }

            .ai-batch-panel {
                background: white;
                border-radius: 12px;
                padding: 24px;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .ai-batch-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            .ai-batch-header h2 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 600;
            }

            .ai-close-button {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                color: #666;
                transition: color 0.2s;
            }

            .ai-close-button:hover {
                color: #000;
            }

            .ai-input-field {
                margin-bottom: 16px;
            }

            .ai-input-label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #333;
            }

            .ai-input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
            }

            .ai-input:focus {
                outline: none;
                border-color: #0066ff;
            }

            .ai-generate-button {
                width: 100%;
                padding: 12px;
                background: rgb(100 48 247);
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                height: 48px;
                transition: background-color 0.2s;
            }

            .ai-generate-button:hover {
                background: #0052cc;
            }

            .ai-generate-button:disabled {
                background: #ccc;
                cursor: not-allowed;
            }

            .progress-container {
                margin-top: 16px;
            }

            .progress-bar {
                width: 100%;
                height: 4px;
                background: #eee;
                border-radius: 2px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: #0066ff;
                transition: width 0.3s ease;
            }

            .progress-info {
                display: flex;
                justify-content: space-between;
                margin-top: 8px;
                font-size: 14px;
                color: #666;
            }

            .progress-message {
                margin-top: 8px;
                font-size: 14px;
                color: #666;
                text-align: center;
            }

            .review-container {
                margin-top: 20px;
                max-height: 60vh;
                overflow-y: auto;
                padding-right: 8px;
            }

            .review-container::-webkit-scrollbar {
                width: 8px;
            }

            .review-container::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
            }

            .review-container::-webkit-scrollbar-thumb {
                background: rgb(100 48 247);
                border-radius: 4px;
            }

            .review-item {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 12px;
                border: 1px solid #e9ecef;
            }

            .review-item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .review-item-number {
                font-weight: 600;
                color: rgb(100 48 247);
            }

            .review-field {
                margin-bottom: 8px;
            }

            .review-field-label {
                font-size: 12px;
                color: #666;
                margin-bottom: 4px;
            }

            .review-field-input {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                transition: border-color 0.2s;
            }

            .review-field-input:focus {
                outline: none;
                border-color: rgb(100 48 247);
            }

            .review-actions {
                margin-top: 20px;
                display: flex;
                gap: 12px;
            }

            .review-button {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.2s;
            }

            .review-generate {
                background: rgb(100 48 247);
                color: white;
            }

            .review-generate:hover {
                background: rgb(85 41 210);
            }

            .review-back {
                background: #f8f9fa;
                color: #666;
                border: 1px solid #ddd;
            }

            .review-back:hover {
                background: #e9ecef;
            }

            .results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
                padding: 20px;
                margin-top: 20px;
            }

            .result-card {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s;
                position: relative;
            }

            .result-card:hover {
                transform: translateY(-2px);
            }

            .result-image-container {
                position: relative;
                padding-top: 100%;
                background: #f8f9fa;
            }

            .result-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            .result-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: rgb(100 48 247);
            }

            .result-error {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #dc3545;
                text-align: center;
                padding: 20px;
            }

            .result-details {
                padding: 16px;
            }

            .result-field {
                margin-bottom: 8px;
            }

            .result-field-label {
                font-size: 12px;
                color: #666;
                margin-bottom: 2px;
            }

            .result-field-value {
                font-size: 14px;
                color: #333;
                word-break: break-word;
            }

            .generation-progress {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: white;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10000;
            }

            .generation-progress-bar {
                width: 200px;
                height: 4px;
                background: #eee;
                border-radius: 2px;
                overflow: hidden;
            }

            .generation-progress-fill {
                height: 100%;
                background: rgb(100 48 247);
                transition: width 0.3s ease;
            }

            .generation-progress-text {
                font-size: 14px;
                color: #666;
                white-space: nowrap;
            }

            .animate-spin {
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            .batch-results-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80%;
                max-width: 900px;
                max-height: 80vh;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.15);
                z-index: 10000;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .batch-results-header {
                padding: 16px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #fafafa;
            }

            .batch-results-header h2 {
                margin: 0;
                font-size: 18px;
            }

            .batch-results-header .close-button {
                background: none;
                border: none;
                padding: 8px;
                cursor: pointer;
                color: #666;
                font-size: 20px;
                line-height: 1;
            }

            .batch-results-content {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
            }

            .batch-results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 16px;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    // Get form inputs
    function getWorkflowInputs() {
        const form = document.querySelector('form');
        if (!form) return [];

        const inputs = [];
        form.querySelectorAll('textarea').forEach(textarea => {
            if (textarea.name && !textarea.name.startsWith('__') && textarea.name !== 'spellId' && textarea.name !== 'version') {
                const label = textarea.closest('label')?.querySelector('span')?.textContent?.trim() || '';
                inputs.push({
                    name: textarea.name,
                    type: 'textarea',
                    label: label,
                    value: textarea.value.trim(),
                    placeholder: textarea.getAttribute('placeholder') || label
                });
            }
        });
        return inputs;
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: ${type === 'error' ? '#ff4444' : type === 'warning' ? '#ffbb33' : '#00C851'};
            color: white;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Fetch AI batch inputs
    async function fetchAIBatchInputs(amount, content) {
        const formInputs = getWorkflowInputs();

        // Get workflow name and description
        const workflowTitle = document.querySelector('h1')?.textContent || '';
        const workflowDescription = document.querySelector('.text-gray-500')?.textContent?.trim() || '';

        // Format input fields with rich context
        const enrichedFields = formInputs.map(input => ({
            name: input.label,
            type: input.type,
            currentValue: input.value,
            placeholder: input.placeholder,
            constraints: input.type === 'number' ? {
                min: input.min,
                max: input.max,
                step: input.step
            } : null
        }));

        // Get previous successful generations if available
        const previousGenerations = Array.from(document.querySelectorAll('.workflow-result'))
            .slice(0, 3)  // Take up to 3 recent examples
            .map(result => {
                const inputs = {};
                result.querySelectorAll('.input-value').forEach(input => {
                    inputs[input.getAttribute('data-name')] = input.textContent.trim();
                });
                return inputs;
            });

        console.log('Sending enriched context:', { workflowTitle, enrichedFields, previousGenerations });

        try {
            const enrichedContext = JSON.stringify({
                workflow: {
                    title: workflowTitle,
                    description: workflowDescription
                },
                fields: enrichedFields,
                examples: previousGenerations
            });

            const payload = {
                id: "cm4b89oo000asm86fstry7u1e",
                version: "live",
                inputs: {
                    amount: amount.toString(),
                    fields: formInputs.map(input => input.name).join(' | '),
                    content: content,
                    enrichedContext: enrichedContext
                },
                glifRunIsPublic: !GM_getValue('isPrivate', false)
            };

            console.log('Debug - Request payload:', JSON.stringify(payload, null, 2));

            const response = await fetch("https://glif.app/api/run-glif", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0',
                    'Accept': '*/*',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Content-Type': 'application/json',
                    'Sec-GPC': '1',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                    'Priority': 'u=4'
                },
                referrer: `https://glif.app/@appelsiensam/glifs/${window.location.pathname.split('/').pop()}`,
                mode: 'cors',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Debug - Error response:', errorText);
                throw new Error(`API request failed: ${response.status}\nResponse: ${errorText}`);
            }

            const reader = response.body.getReader();
            let jsonData = '';
            let entries = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = new TextDecoder().decode(value);
                jsonData += chunk;

                const lines = jsonData.split('\n');
                jsonData = lines.pop() || '';

                for (const line of lines) {
                    if (!line.trim().startsWith('data: ')) continue;

                    try {
                        const data = JSON.parse(line.slice(6));
                        const text = data.graphExecutionState?.nodes?.text1?.output?.value;

                        if (text?.includes('"entries"')) {
                            try {
                                const parsed = JSON.parse(text);
                                if (parsed.entries?.length) entries = parsed.entries;
                            } catch (e) {
                                console.log('Partial JSON:', text);
                            }
                        }
                    } catch (e) {
                        console.log('Parse error:', e);
                    }
                }
            }

            return entries;
        } catch (error) {
            console.error('fetchAIBatchInputs error:', error);
            throw error;
        }
    }

    // Process batch generation with parallel processing
    async function processBatchGeneration(entries) {
        const spellId = window.location.pathname.split('/').pop();
        const isPrivate = GM_getValue('isPrivate', false);

        console.log('Starting generation with spell ID:', spellId);
        console.log('Entries to process:', entries);

        // Create results container if it doesn't exist
        let resultsContainer = document.querySelector('.batch-results-container');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.className = 'batch-results-container';
            resultsContainer.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80%;
                max-width: 900px;
                max-height: 80vh;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.15);
                z-index: 10000;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            `;

            // Add header with title and close button
            const header = document.createElement('div');
            header.style.cssText = `
                padding: 16px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #fafafa;
            `;
            header.innerHTML = `
                <h2 style="margin: 0; font-size: 18px;">Generated Images</h2>
                <button class="close-button" style="
                    background: none;
                    border: none;
                    padding: 8px;
                    cursor: pointer;
                    color: #666;
                    font-size: 20px;
                    line-height: 1;
                ">×</button>
            `;
            resultsContainer.appendChild(header);

            // Add close button functionality
            header.querySelector('.close-button').addEventListener('click', () => {
                resultsContainer.remove();
            });

            // Add overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
            `;
            document.body.appendChild(overlay);

            // Close on overlay click
            overlay.addEventListener('click', () => {
                overlay.remove();
                resultsContainer.remove();
            });

            document.body.appendChild(resultsContainer);
        }

        // Create scrollable content area
        const contentArea = document.createElement('div');
        contentArea.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 16px;
        `;
        resultsContainer.appendChild(contentArea);

        // Create results grid with improved layout
        const resultsGrid = document.createElement('div');
        resultsGrid.className = 'batch-results-grid';
        resultsGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
        `;
        contentArea.appendChild(resultsGrid);

        // Create progress indicator
        const progress = document.createElement('div');
        progress.className = 'generation-progress';
        progress.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            padding: 8px 16px;
            box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
            z-index: 10001;
        `;
        progress.innerHTML = `
            <div class="generation-progress-bar" style="
                height: 4px;
                background: #f0f0f0;
                border-radius: 2px;
                overflow: hidden;
            ">
                <div class="generation-progress-fill" style="
                    width: 0%;
                    height: 100%;
                    background: rgb(100, 48, 247);
                    transition: width 0.3s ease;
                "></div>
            </div>
            <div class="generation-progress-text" style="
                text-align: center;
                margin-top: 4px;
                font-size: 14px;
            ">Generating 0/${entries.length}</div>
        `;
        document.body.appendChild(progress);

        let completed = 0;
        const updateProgress = () => {
            completed++;
            const percentage = (completed / entries.length) * 100;
            progress.querySelector('.generation-progress-fill').style.width = `${percentage}%`;
            progress.querySelector('.generation-progress-text').textContent =
                `Generating ${completed}/${entries.length}`;
        };

        // Create result cards for each entry
        const resultCards = entries.map((entry, index) => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.style.cssText = `
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: hidden;
            `;
            card.innerHTML = `
                <div class="result-image-container" style="
                    aspect-ratio: ${entry.widthinput}/${entry.heightinput};
                    background: #f5f5f5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <div class="result-loading">${icons.loading}</div>
                </div>
                <div class="result-details" style="padding: 12px;">
                    ${Object.entries(entry).map(([key, value]) => `
                        <div class="result-field" style="margin-bottom: 8px;">
                            <div class="result-field-label" style="
                                font-size: 12px;
                                color: #666;
                                margin-bottom: 2px;
                            ">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
                            <div class="result-field-value" style="
                                font-size: 14px;
                                word-break: break-word;
                            ">${value}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            resultsGrid.appendChild(card);
            return card;
        });

        // Process all entries in parallel
        const results = await Promise.all(entries.map(async (entry, index) => {
            try {
                console.log(`Generating image ${index + 1} with inputs:`, entry);

                const requestBody = {
                    id: spellId,
                    version: "live",
                    inputs: {
                        ...entry,
                        heightinput: String(entry.heightinput),
                        widthinput: String(entry.widthinput)
                    },
                    glifRunIsPublic: !isPrivate
                };

                console.log('Request body:', requestBody);

                const response = await fetch("https://glif.app/api/run-glif", {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0',
                        'Accept': '*/*',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'Content-Type': 'application/json',
                        'Sec-GPC': '1',
                        'Sec-Fetch-Dest': 'empty',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'same-origin',
                        'Priority': 'u=4'
                    },
                    referrer: `https://glif.app/@appelsiensam/glifs/${spellId}`,
                    mode: 'cors',
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API error:', errorText);
                    throw new Error(`Generation failed: ${response.status} - ${errorText}`);
                }

                const reader = response.body.getReader();
                let imageUrl = null;
                let jsonData = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = new TextDecoder().decode(value);
                    console.log(`Chunk received for image ${index + 1}:`, chunk);

                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (!line.trim().startsWith('data: ')) continue;

                        try {
                            const data = JSON.parse(line.slice(6));

                            // Check for image URL in various locations
                            const imageValue =
                                data.graphExecutionState?.finalOutput?.value ||
                                data.graphExecutionState?.nodes?.output1?.output?.value ||
                                data.graphExecutionState?.nodes?.image?.output?.value;

                            if (imageValue) {
                                imageUrl = imageValue;
                                console.log(`Found image URL for ${index + 1}:`, imageUrl);

                                // Update card with image immediately
                                const card = resultCards[index];
                                const container = card.querySelector('.result-image-container');
                                container.innerHTML = `<img src="${imageUrl}" class="result-image" style="
                                    max-width: 100%;
                                    height: auto;
                                    display: block;
                                " alt="Generated image ${index + 1}">`;

                                break;
                            }

                            // Check if generation is complete
                            if (data.graphExecutionState?.status === 'done') {
                                console.log(`Generation complete for ${index + 1}`);
                                break;
                            }
                        } catch (e) {
                            console.log('Parse error:', e);
                        }
                    }

                    if (imageUrl) break;
                }

                updateProgress();
                return { success: true, imageUrl, entry };

            } catch (error) {
                console.error(`Error generating image ${index + 1}:`, error);

                // Update card with error
                const card = resultCards[index];
                const container = card.querySelector('.result-image-container');
                container.innerHTML = `
                    <div class="result-error" style="
                        padding: 16px;
                        color: #e53935;
                        text-align: center;
                    ">
                        <div>Generation failed</div>
                        <div style="font-size: 12px; margin-top: 4px;">${error.message}</div>
                    </div>
                `;

                updateProgress();
                return { success: false, error: error.message, entry };
            }
        }));

        // Keep progress indicator for a moment before removing
        setTimeout(() => progress.remove(), 2000);

        const successfulResults = results.filter(r => r.success);
        console.log('Generation complete. Successful results:', successfulResults);

        return results;
    }

    // Display AI batch panel
    function displayAIBatchPanel() {
        const overlay = document.createElement('div');
        overlay.className = 'ai-batch-overlay';

        const panel = document.createElement('div');
        panel.className = 'ai-batch-panel';

        const header = document.createElement('div');
        header.className = 'ai-batch-header';

        const title = document.createElement('h2');
        title.textContent = 'Batch Generator';

        const closeButton = document.createElement('button');
        closeButton.className = 'ai-close-button';
        closeButton.innerHTML = icons.close;
        closeButton.addEventListener('click', () => {
            if (!panel.dataset.generating) {
                overlay.remove();
            } else {
                showToast('Please wait for generation to complete', 'warning');
            }
        });

        header.appendChild(title);
        header.appendChild(closeButton);

        const content = document.createElement('div');
        content.className = 'ai-batch-content';

        const amountField = document.createElement('div');
        amountField.className = 'ai-input-field';

        const amountLabel = document.createElement('label');
        amountLabel.className = 'ai-input-label';
        amountLabel.textContent = 'Number of Images';

        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.className = 'ai-input';
        amountInput.min = '1';
        amountInput.max = '100';
        amountInput.value = '1';

        amountField.appendChild(amountLabel);
        amountField.appendChild(amountInput);

        const contentField = document.createElement('div');
        contentField.className = 'ai-input-field';

        const contentLabel = document.createElement('label');
        contentLabel.className = 'ai-input-label';
        contentLabel.textContent = 'Description';

        const contentInput = document.createElement('textarea');
        contentInput.className = 'ai-input';
        contentInput.rows = 4;
        contentInput.placeholder = 'Describe what you want to generate...';

        contentField.appendChild(contentLabel);
        contentField.appendChild(contentInput);

        const generateButton = document.createElement('button');
        generateButton.className = 'ai-generate-button';
        generateButton.style.cssText = `
            width: 100%;
            padding: 12px;
            background: rgb(100 48 247);
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            height: 48px;
            transition: background-color 0.2s;
        `;
        generateButton.innerHTML = `${icons.generate}<span>Generate Images</span>`;

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.style.display = 'none';
        progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <div class="progress-info">
                <span class="progress-count">0/${amountInput.value}</span>
                <span class="progress-percentage">0%</span>
            </div>
            <div class="progress-message">Starting generation...</div>
        `;

        generateButton.addEventListener('click', async () => {
            const amount = parseInt(amountInput.value);
            const content = contentInput.value;

            if (!content) {
                showToast('Please describe the content you want to generate', 'error');
                return;
            }

            if (isNaN(amount) || amount < 1 || amount > 100) {
                showToast('Please enter a valid number of images (1-100)', 'error');
                return;
            }

            generateButton.disabled = true;
            generateButton.innerHTML = `${icons.loading}<span>Generating Prompts...</span>`;

            try {
                console.log('Fetching AI batch inputs...');
                const inputs = await fetchAIBatchInputs(amount, content);
                console.log('Received inputs:', inputs);

                if (inputs && inputs.length > 0) {
                    // Show review screen instead of generating immediately
                    displayReviewScreen(inputs, panel, {
                        amount,
                        content
                    });
                } else {
                    showToast('Failed to generate image prompts', 'error');
                    generateButton.disabled = false;
                    generateButton.innerHTML = `${icons.generate}<span>Generate Images</span>`;
                }
            } catch (error) {
                console.error('Batch generation error:', error);
                showToast('Failed to generate prompts: ' + error.message, 'error');
                generateButton.disabled = false;
                generateButton.innerHTML = `${icons.generate}<span>Generate Images</span>`;
            }
        });

        content.appendChild(amountField);
        content.appendChild(contentField);
        content.appendChild(generateButton);
        content.appendChild(progressContainer);

        panel.appendChild(header);
        panel.appendChild(content);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }

    // Display review screen
    function displayReviewScreen(entries, panel, originalInputs) {
        // Clear existing content
        const content = panel.querySelector('.ai-batch-content');
        content.innerHTML = '';

        // Create review container
        const reviewContainer = document.createElement('div');
        reviewContainer.className = 'review-container';

        // Add each entry for review
        entries.forEach((entry, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';

            const header = document.createElement('div');
            header.className = 'review-item-header';
            header.innerHTML = `<span class="review-item-number">Image ${index + 1}</span>`;

            reviewItem.appendChild(header);

            // Add editable fields
            Object.entries(entry).forEach(([key, value]) => {
                const field = document.createElement('div');
                field.className = 'review-field';

                const label = document.createElement('div');
                label.className = 'review-field-label';
                label.textContent = key.charAt(0).toUpperCase() + key.slice(1);

                const input = document.createElement('input');
                input.className = 'review-field-input';
                input.type = 'text';
                input.value = value;
                input.dataset.index = index;
                input.dataset.field = key;

                // Update entries object when input changes
                input.addEventListener('input', (e) => {
                    entries[index][key] = e.target.value;
                });

                field.appendChild(label);
                field.appendChild(input);
                reviewItem.appendChild(field);
            });

            reviewContainer.appendChild(reviewItem);
        });

        // Add action buttons
        const actions = document.createElement('div');
        actions.className = 'review-actions';

        const backButton = document.createElement('button');
        backButton.className = 'review-button review-back';
        backButton.innerHTML = `<span>Back</span>`;
        backButton.addEventListener('click', () => {
            // Restore original panel content
            displayAIBatchPanel();
        });

        const generateButton = document.createElement('button');
        generateButton.className = 'review-button review-generate';
        generateButton.innerHTML = `${icons.generate}<span>Generate Images</span>`;
        generateButton.addEventListener('click', async () => {
            generateButton.disabled = true;
            generateButton.innerHTML = `${icons.loading}<span>Generating...</span>`;

            try {
                const results = await processBatchGeneration(entries);
                console.log('Generation complete:', results);

                const successCount = results.filter(r => r.success).length;
                showToast(`Successfully generated ${successCount} images`);

                if (successCount === 0) {
                    generateButton.disabled = false;
                    generateButton.innerHTML = `${icons.generate}<span>Generate Images</span>`;
                } else {
                    panel.closest('.ai-batch-overlay').remove();
                }
            } catch (error) {
                console.error('Generation error:', error);
                showToast('Failed to generate images: ' + error.message, 'error');
                generateButton.disabled = false;
                generateButton.innerHTML = `${icons.generate}<span>Generate Images</span>`;
            }
        });

        actions.appendChild(backButton);
        actions.appendChild(generateButton);

        content.appendChild(reviewContainer);
        content.appendChild(actions);
    }

    // Add the AI batch button to the page
    function addAIBatchButton() {
        const container = document.querySelector('form');
        if (!container) return;

        const button = document.createElement('button');
        button.className = 'ai-batch-button';
        button.style.cssText = `
            margin-top: 12px;
            padding: 8px 16px;
            background: rgb(100 48 247);
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            height: 48px;
            transition: background-color 0.2s;
        `;
        button.innerHTML = `${icons.generate}<span>Batch Generator</span>`;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            displayAIBatchPanel();
        });

        container.appendChild(button);
    }

    // Initialize
    function initialize() {
        injectStyles();

        // Wait for the form to be ready
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector('form')) {
                addAIBatchButton();
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Start the script
    initialize();
})();

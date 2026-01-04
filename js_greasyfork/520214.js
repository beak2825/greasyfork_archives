// ==UserScript==
// @name         Zoom Transcript to Gemini AI (Enhanced + Network VTT)
// @namespace    fiverr.com/web_coder_nsd
// @version      6.0.1
// @description  Zoom transcript extraction with Gemini AI, dynamic model switching, mermaid charts. Optimized.
// @author       noushadBug
// @match        https://fiverrzoom.zoom.us/rec/play/*
// @icon         https://fiverrzoom.zoom.us/favicon.ico
// @license      MIT
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/520214/Zoom%20Transcript%20to%20Gemini%20AI%20%28Enhanced%20%2B%20Network%20VTT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520214/Zoom%20Transcript%20to%20Gemini%20AI%20%28Enhanced%20%2B%20Network%20VTT%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let extractedConv = "";

    // Intercept VTT response
    const origOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function () {
        this.addEventListener("load", function () {
            if (this.responseURL.includes("vtt?type=transcript")) {
                parseVTT(this.responseText);
            }
        });
        origOpen.apply(this, arguments);
    };

    function parseVTT(vttText) {
        const lines = vttText.split('\n');
        let conv = "", lastSpeaker = "", currentTime = "";
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.match(/^\d\d:\d\d:\d\d\.\d\d\d -->/)) {
                currentTime = line.substring(0, 8);
                continue;
            }
            if (line && !line.startsWith("WEBVTT")) {
                const match = line.match(/^(.+?):\s(.+)/);
                if (match) {
                    const speaker = match[1].trim(), text = match[2].trim();
                    if (speaker !== lastSpeaker) {
                        conv += `${speaker} (time-${currentTime}): ${text}\n`;
                        lastSpeaker = speaker;
                    } else {
                        conv += `${text}\n`;
                    }
                }
            }
        }
        extractedConv = conv.trim();
    }

    const extractConversation = () => extractedConv || '[Transcript not loaded yet]';

    // --- Function to load and render Mermaid diagram ---
    async function loadAndRenderMermaid(mermaidCode, mermaidContainer) {
        return new Promise((resolve, reject) => {
            try {
                // remove any previously added script with the same id
                const existing = document.getElementById('mermaid-cdn-zoom');
                if (existing) existing.remove();

                const s = document.createElement('script');
                s.id = 'mermaid-cdn-zoom';
                s.src = 'https://cdn.jsdelivr.net/npm/mermaid@9.4.3/dist/mermaid.min.js';
                s.onload = () => {
                    try {
                        mermaid.initialize({ startOnLoad: false });

                        // Clear container and create diagram
                        mermaidContainer.innerHTML = '';
                        const diagramId = 'mermaid-diagram-' + Date.now();
                        const diagramContainer = document.createElement('div');
                        diagramContainer.id = diagramId;
                        mermaidContainer.appendChild(diagramContainer);

                        diagramContainer.innerHTML = `<div class="mermaid">${mermaidCode}</div>`;
                        mermaid.init(undefined, diagramContainer.querySelectorAll('.mermaid'));

                        resolve();
                    } catch (err) {
                        console.error('Mermaid rendering error:', err);
                        reject(err);
                    }
                };
                s.onerror = () => {
                    console.error('Failed to load Mermaid.js');
                    reject(new Error('Failed to load Mermaid.js'));
                };
                document.head.appendChild(s);
            } catch (err) {
                reject(err);
            }
        });
    }

    // --- Vertical Sidebar UI ---
    const styleElem = document.createElement("style");
    styleElem.innerHTML = `
      #ai-sidebar {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        background: white;
        padding: 20px 12px;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 16px;
        justify-content: center;
      }
      #ai-sidebar button {
            background: linear-gradient(135deg, #faffdd 0%, #ffffff 100%);
            border: none;
            width: 50px;
            height: 50px;
            border: 1px solid #cdc9c9;
            border-radius: 10px;
            font-size: 24px;
            cursor: pointer;
            transition: all 0.2s
        ease;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }
      #ai-sidebar button:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
      #ai-sidebar button:active {
        transform: scale(0.95);
      }
    `;
    document.head.appendChild(styleElem);

    // Create sidebar and append to body
    const sidebar = document.createElement('div');
    sidebar.id = "ai-sidebar";

    const btnThink = document.createElement('button');
    btnThink.id = "btn-think";
    btnThink.innerHTML = "💡";
    btnThink.title = "AI Think";
    sidebar.appendChild(btnThink);

    const btnCustom = document.createElement('button');
    btnCustom.id = "btn-custom";
    btnCustom.innerHTML = "✏️";
    btnCustom.title = "Custom Conversation";
    sidebar.appendChild(btnCustom);

    const btnCopy = document.createElement('button');
    btnCopy.id = "btn-copy";
    btnCopy.innerHTML = "📋";
    btnCopy.title = "Copy Transcript";
    sidebar.appendChild(btnCopy);

    // Append to body
    document.body.appendChild(sidebar);

    // Store button references globally for event listeners
    window.aiButtons = { btnThink, btnCustom, btnCopy };

    // --- Modal Popup Functions ---
    function openModal(innerHTMLContent) {
        const overlay = document.createElement('div');
        overlay.id = 'modal-overlay';
        overlay.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 11000;
            animation: fadeIn 0.2s ease-out;
        `;

        const modal = document.createElement('div');
        modal.id = 'modal-content';
        modal.style = `
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            width: 95vw;
            max-width: none;
            max-height: 90vh;
            overflow: hidden;
            position: relative;
            animation: slideUp 0.3s ease-out;
        `;

        const header = document.createElement('div');
        header.style = `
            padding: 20px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: none;
        `;

        const titleSpan = document.createElement('span');
        titleSpan.style = "font-size: 1.5rem; font-weight: 600; letter-spacing: 0.5px;";
        titleSpan.textContent = innerHTMLContent.title || "Modal";
        header.appendChild(titleSpan);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style = `
            font-size: 24px;
            color: white;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            cursor: pointer;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        `;
        closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        closeBtn.onclick = () => document.body.removeChild(overlay);
        header.appendChild(closeBtn);

        const inner = document.createElement('div');
        inner.style = `
            padding: 24px;
            overflow-y: auto;
            max-height: calc(85vh - 76px);
            background: #f8f9fa;
        `;
        inner.innerHTML = innerHTMLContent.content;

        modal.appendChild(header);
        modal.appendChild(inner);
        overlay.appendChild(modal);

        // Add CSS animations if not already present
        if (!document.getElementById('modal-animations')) {
            const style = document.createElement('style');
            style.id = 'modal-animations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(overlay);

        overlay.tabIndex = -1;
        overlay.addEventListener("keydown", e => {
            if (e.key === "Escape") {
                document.body.removeChild(overlay);
            }
        });
        overlay.focus();

        return { overlay, inner };
    }

    // --- Gemini API Functions ---
    class GeminiClient {
        constructor() {
            this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
            // Optimized model list - most reliable models only
            this.modelConfigs = [
                { name: 'gemini-2.5-flash', retries: 1 },
                { name: 'gemini-2.0-flash', retries: 1 },
                { name: 'gemini-2.5-pro', retries: 1 },
                { name: 'gemini-2.5-flash-lite', retries: 1 },
                { name: 'gemini-2.0-flash', retries: 2 },
                { name: 'gemini-2.0-flash-001', retries: 2 },
                { name: 'gemini-2.0-flash-lite', retries: 3 },
                { name: 'gemini-2.0-flash-lite-001', retries: 2},
                { name: 'gemini-2.5-flash-lite-preview-09-2025', retries: 2},
                { name: 'gemini-2.0-flash-exp', retries: 2 },
                { name: 'gemini-2.5-pro-exp', retries: 1 },
                { name: 'gemini-2.5-flash-preview-09-2025', retries: 1 },
                { name: 'gemini-flash-latest', retries: 1 },

            ];
            this.loadPerformanceData();
            this.reorderModelsByPerformance();
        }

        loadPerformanceData() {
            try {
                const data = localStorage.getItem('gemini_model_performance');
                this.performance = data ? JSON.parse(data) : {};
            } catch (e) {
                console.warn('Failed to load model performance data:', e);
                this.performance = {};
            }
        }

        savePerformanceData() {
            try {
                localStorage.setItem('gemini_model_performance', JSON.stringify(this.performance));
            } catch (e) {
                console.warn('Failed to save model performance data:', e);
            }
        }

        recordSuccess(modelName) {
            if (!this.performance[modelName]) {
                this.performance[modelName] = { successes: 0, failures: 0, lastSuccess: null };
            }
            this.performance[modelName].successes++;
            this.performance[modelName].lastSuccess = Date.now();
            this.savePerformanceData();
        }

        recordFailure(modelName) {
            if (!this.performance[modelName]) {
                this.performance[modelName] = { successes: 0, failures: 0, lastSuccess: null };
            }
            this.performance[modelName].failures++;
            this.savePerformanceData();
        }

        reorderModelsByPerformance() {
            // Sort models by success rate and recency
            this.modelConfigs.sort((a, b) => {
                const aSuccesses = this.performance[a.name]?.successes || 0;
                const aFailures = this.performance[a.name]?.failures || 0;
                const bSuccesses = this.performance[b.name]?.successes || 0;
                const bFailures = this.performance[b.name]?.failures || 0;

                const aRate = aSuccesses / Math.max(1, aSuccesses + aFailures);
                const bRate = bSuccesses / Math.max(1, bSuccesses + bFailures);

                const aRecent = this.performance[a.name]?.lastSuccess || 0;
                const bRecent = this.performance[b.name]?.lastSuccess || 0;

                // Prioritize higher success rate, then more recent success
                if (Math.abs(aRate - bRate) > 0.1) return bRate - aRate;
                return bRecent - aRecent;
            });
        }

        async sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async init() {
            let key = localStorage.getItem('gemini_api_key');
            if (!key) {
                key = prompt('Enter your Gemini API key:');
                if (!key) throw new Error('API key required');
                localStorage.setItem('gemini_api_key', key);
            }
            this.apiKey = key;
        }

        async tryModelWithRetry(modelConfig, prompt) {
            const { name: model, retries: maxRetries } = modelConfig;
            let lastError = null;

            for (let retry = 0; retry <= maxRetries; retry++) {
                try {
                    if (retry > 0) {
                        await this.sleep(Math.pow(2, retry - 1) * 1000);
                    }

                    const resp = await fetch(`${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                    });

                    // Handle specific HTTP errors
                    if (!resp.ok) {
                        const errorText = await resp.text();
                        let errorData;
                        try {
                            errorData = JSON.parse(errorText);
                        } catch (e) {
                            errorData = { message: errorText };
                        }

                        const status = resp.status;
                        const errorMsg = errorData.error?.message || errorData.message || resp.statusText;

                        if (status === 429) {
                            // Rate limit - retry with backoff
                            throw new Error(`Rate limit (429): ${errorMsg}`);
                        } else if (status === 400) {
                            // Bad request - don't retry
                            console.warn(`Bad request for ${model}: ${errorMsg}`);
                            this.recordFailure(model);
                            return null; // Skip to next model
                        } else if (status >= 500) {
                            // Server error - retry once
                            if (retry === 0) {
                                throw new Error(`Server error (${status}): ${errorMsg}`);
                            } else {
                                console.warn(`Server error persists for ${model}`);
                                this.recordFailure(model);
                                return null;
                            }
                        } else {
                            // Other errors - don't retry
                            console.warn(`HTTP ${status} for ${model}: ${errorMsg}`);
                            this.recordFailure(model);
                            return null;
                        }
                    }

                    const data = await resp.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

                    if (text) {
                        this.recordSuccess(model);
                        return text;
                    } else {
                        throw new Error('No content returned');
                    }
                } catch (err) {
                    lastError = err;
                    console.warn(`Failed ${model} (attempt ${retry + 1}/${maxRetries + 1}):`, err.message);

                    // If it's not a retryable error or we're out of retries, break
                    if (!err.message.includes('429') && !err.message.includes('Server error')) {
                        break;
                    }
                }
            }

            // All retries exhausted
            this.recordFailure(model);
            return null;
        }

        async generateContent(prompt, statusCallback = null) {
            if (!this.apiKey) await this.init();

            let modelsTried = 0;
            for (const modelConfig of this.modelConfigs) {
                modelsTried++;

                if (statusCallback) {
                    statusCallback(`Trying ${modelConfig.name} (${modelsTried}/${this.modelConfigs.length})...`);
                }

                const result = await this.tryModelWithRetry(modelConfig, prompt);

                if (result) {
                    return result;
                }
            }

            // If we get here, all models failed
            const errorMsg = `❌ All ${this.modelConfigs.length} models failed. Please check your API key and try again later.`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
    }


    const callGeminiAPI = async (action, convText, command, statusCallback = null) => {
        let prompt = "This is a transcript between Noushad Bhuiyan (me) and my client. Study every detail so I can later ask about what was agreed. Transcript:\n" + convText + "\n\n";

        if (action === 'summarizeAndExplainWithChart') {
            prompt += `Based on the transcript and these instructions: "${command}", provide a response in JSON format with the following structure:
{
  "response": "Your detailed text response here",
  "mermaid": "graph TD\\nA[Start] --> B{Choice}\\nB -->|Yes| C[Do this]\\nB -->|No| D[Do that]\\nC --> E[End]\\nD --> E"
}

IMPORTANT:
- The "response" should be your detailed analysis/explanation
- The "mermaid" should contain valid Mermaid.js syntax that visualizes the key concepts, workflow, or relationships from the analysis
- Use Mermaid.js syntax:
  * For flowcharts: "graph TD" (top-down) or "graph LR" (left-right)
  * Nodes: A[Text], B{Decision}, C((Process))
  * Connections: A --> B, B -->|Yes| C, B -->|No| D
  * Subgraphs: subgraph Title [content] end
  * Styling: classDef default fill:#3742fa,stroke:#2563eb,color:#fff
  * Example: "graph TD\\nA[Client Request] --> B{Requirements}\\nB -->|Approved| C[Development]\\nB -->|Rejected| D[Revisions]\\nC --> E[Testing]\\nD --> A\\nE --> F[Deployment]"
- Return ONLY the JSON, no additional text before or after`;
        } else if (action === 'summarizeAndExplain') {
            prompt += `Based on the transcript and these instructions: "${command}",  Provide a concise data to lookup and understand.`;
        } else if (action === 'extendedExplanation') {
            prompt += `Based on the transcript and these instructions: "${command}", provide an extended, detailed explanation covering all nuances.`;
        }

        const gemini = new GeminiClient();
        return await gemini.generateContent(prompt, statusCallback);
    };

    // --- Modal Flows ---
    const openThinkModal = () => {
        const modalContent = {
            title: "✨ AI Workspace",
            content: `
      <style>
        .notion-modal {
          --primary-gradient: linear-gradient(135deg, #3742fa 0%, #2f3542 100%);
          --bg-primary: #ffffff;
          --bg-secondary: #f8f9fa;
          --bg-tertiary: #f1f3f4;
          --text-primary: #2f3349;
          --text-secondary: #6c7293;
          --border-color: #e9ecef;
          --accent-blue: #3742fa;
          --accent-purple: #7c3aed;
          --success-green: #10b981;
          --warning-orange: #f59e0b;
          --shadow-sm: 0 2px 4px rgba(0,0,0,0.04);
          --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
          --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
          --radius-sm: 8px;
          --radius-md: 12px;
          --radius-lg: 16px;
        }

        .notion-workspace {
          display: flex;
          height: calc(90vh - 76px);
          background: var(--bg-secondary);
          position: relative;
        }

        .notion-sidebar {
          background: var(--bg-primary);
          border-right: 1px solid var(--border-color);
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          min-width: 300px;
        }

        .notion-main {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex: 0 0 400px;
          min-width: 350px;
        }

        .notion-header {
          background: var(--bg-primary);
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          flex-shrink: 0;
        }

        .notion-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .notion-input-section {
          margin-bottom: 24px;
        }

        .notion-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .notion-textarea {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          resize: vertical;
          min-height: 120px;
          transition: all 0.2s ease;
          line-height: 1.5;
        }

        .notion-textarea:focus {
          outline: none;
          border-color: var(--accent-blue);
          box-shadow: 0 0 0 3px rgba(55, 66, 250, 0.1);
        }

        .notion-button {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fda085 100%);
          background-size: 300% 300%;
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: var(--radius-md);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          margin-top: 12px;
          position: relative;
          overflow: hidden;
          animation: gradientShift 3s ease infinite;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .notion-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }

        .notion-button:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
          animation-duration: 1.5s;
        }

        .notion-button:hover:not(:disabled)::before {
          left: 100%;
        }

        .notion-button:active:not(:disabled) {
          transform: translateY(-1px) scale(1.01);
        }

        .notion-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          animation: none;
          background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .notion-status {
          margin-top: 12px;
          font-size: 12px;
          font-weight: 500;
          min-height: 18px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .notion-status.success { color: var(--success-green); }
        .notion-status.error { color: #ef4444; }
        .notion-status.loading { color: var(--text-secondary); }

        .notion-result {
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          padding: 20px;
          min-height: 300px;
          white-space: pre-wrap;
          color: var(--text-primary);
          font-size: 14px;
          line-height: 1.7;
          border: 1px solid var(--border-color);
          overflow-y: auto;
        }

        .notion-chart-container {
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          padding: 20px;
          min-height: 400px;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: auto;
        }

        .mermaid-container {
          width: 100%;
          height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mermaid {
          text-align: center;
          max-width: 100%;
          max-height: 100%;
        }

        .mermaid svg {
          max-width: 100%;
          max-height: 100%;
        }

        .notion-empty-state {
          text-align: center;
          color: var(--text-secondary);
          font-size: 14px;
          padding: 40px 20px;
        }

        .notion-icon {
          width: 16px;
          height: 16px;
          display: inline-block;
          vertical-align: middle;
        }

        .notion-resizer {
          width: 4px;
          background: var(--border-color);
          cursor: col-resize;
          transition: background 0.2s;
          position: relative;
        }

        .notion-resizer:hover {
          background: var(--accent-blue);
        }

        .notion-resizer.dragging {
          background: var(--accent-blue);
        }

        .notion-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .notion-section-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .notion-card {
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          overflow: hidden;
        }
      </style>

      <div class="notion-workspace" id="notion-workspace">
        <!-- Left Column: Input Section -->
        <div class="notion-sidebar">
          <div class="notion-section-title">
            <span>🧠</span> AI Assistant
          </div>

          <div class="notion-input-section">
            <div class="notion-label">
              <span>💭</span> What would you like to know?
            </div>
            <textarea
              id="instruction-input"
              class="notion-textarea"
              placeholder="Enter your analysis request...&#10;Examples:&#10;• Summarize key agreements and action items&#10;• Create a workflow diagram of the process&#10;• Explain technical concepts discussed&#10;• Identify next steps and deliverables&#10;&#10;The AI will generate both detailed analysis AND a visual workflow diagram"
            ></textarea>
            <button id="modal-think-btn" class="notion-button">
              <span>🚀</span>
              <span>Generate Analysis & Workflow</span>
            </button>
            <div id="modal-status" class="notion-status"></div>
          </div>

          <div class="notion-section-title" style="margin-top: 32px;">
            <span>📄</span> Analysis Results
          </div>

          <div class="notion-card">
            <div id="modal-result" class="notion-result">
              <div class="notion-empty-state">
                <div style="font-size: 48px; margin-bottom: 12px;">🤔</div>
                <div>Your analysis will appear here</div>
                <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">Enter a question above and click analyze</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resizable Divider -->
        <div class="notion-resizer" id="notion-resizer" title="Drag to resize"></div>

        <!-- Right Column: Chart Section -->
        <div class="notion-main">
          <div class="notion-header">
            <div class="notion-section-title" style="margin: 0;">
              <span>📊</span> Visual Workflow
            </div>
          </div>

          <div class="notion-content">
            <div id="mermaid-container" class="notion-chart-container">
              <div class="notion-empty-state">
                <div style="font-size: 48px; margin-bottom: 12px;">📊</div>
                <div>Visual workflow will appear here</div>
                <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">Generated automatically from your analysis</div>
              </div>
              <div id="mermaid-diagram" class="mermaid-container" style="display: none;"></div>
            </div>
          </div>
        </div>
      </div>
      `
        };

        const { inner } = openModal(modalContent);

        // Setup resizable columns for Notion-style design
        const resizer = inner.querySelector('#notion-resizer');
        const workspace = inner.querySelector('#notion-workspace');
        const sidebar = inner.querySelector('.notion-sidebar');

        let isResizing = false;

        resizer.addEventListener('mousedown', () => {
            isResizing = true;
            resizer.classList.add('dragging');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const workspaceRect = workspace.getBoundingClientRect();
            const newSidebarWidth = e.clientX - workspaceRect.left;

            // Ensure minimum and maximum widths (300px to 600px for sidebar, 350px minimum for right column)
            if (newSidebarWidth >= 300 && newSidebarWidth <= 600) {
                sidebar.style.flex = `0 0 ${newSidebarWidth}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                resizer.classList.remove('dragging');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                document.body.style.webkitUserSelect = '';
            }
        });

        const instr = inner.querySelector("#instruction-input");
        const btn = inner.querySelector("#modal-think-btn");
        const statusDiv = inner.querySelector("#modal-status");
        const resultDiv = inner.querySelector("#modal-result");
        const mermaidContainer = inner.querySelector("#mermaid-container");
        const mermaidDiagram = inner.querySelector("#mermaid-diagram");

        // Add keyboard shortcuts and enhanced interactions
        instr.addEventListener("keydown", e => {
            if (e.key === "Enter" && e.ctrlKey) {
                e.preventDefault();
                btn.click();
            }
            if (e.key === "Escape") {
                e.target.blur();
            }
        });

        btn.onclick = async () => {
            if (!instr.value.trim()) {
                // Show subtle validation feedback
                instr.focus();
                instr.style.borderColor = '#ef4444';
                setTimeout(() => {
                    instr.style.borderColor = '';
                }, 2000);
                return;
            }

            // Update button state
            btn.disabled = true;
            const originalBtnContent = btn.innerHTML;
            btn.innerHTML = '<span class="notion-spinner"></span><span>Generating Analysis & Diagram...</span>';

            // Update status with loading state
            statusDiv.className = 'notion-status loading';
            statusDiv.textContent = "🔄 Initializing AI analysis...";

            // Clear previous results with loading states
            resultDiv.innerHTML = '<div class="notion-empty-state"><div style="font-size: 32px; margin-bottom: 12px;">⚡</div><div>Analyzing conversation...</div></div>';
            mermaidContainer.innerHTML = '<div class="notion-empty-state"><div style="font-size: 32px; margin-bottom: 12px;">📊</div><div>Generating workflow diagram...</div></div><div id="mermaid-diagram" class="mermaid-container" style="display: none;"></div>';

            const conv = extractConversation();
            try {
                const res = await callGeminiAPI("summarizeAndExplainWithChart", conv, instr.value.trim(), (status) => {
                    statusDiv.className = 'notion-status loading';
                    statusDiv.innerHTML = `🔄 ${status}`;
                });

                // Parse JSON response using the proper technique
                let responseText = res;
                let mermaidCode = null;

                // Find the first { and last } to extract JSON
                const firstBrace = res.indexOf('{');
                const lastBrace = res.lastIndexOf('}');

                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                    const jsonStr = res.substring(firstBrace, lastBrace + 1);

                    // Try to parse the JSON
                    try {
                        const jsonData = JSON.parse(jsonStr);
                        console.log('Parsed JSON:', jsonData);
                        responseText = jsonData.response || res;
                        mermaidCode = jsonData.mermaid || null;
                    } catch (e) {
                        // If JSON parsing fails, treat the entire response as text
                        responseText = res;
                        mermaidCode = null;
                        console.warn('Failed to parse JSON response:', e);
                        console.log('Attempted to parse:', jsonStr.substring(0, 200) + '...');
                    }
                } else {
                    // No JSON structure found, treat as plain text
                    responseText = res;
                    mermaidCode = null;
                    console.warn('No JSON structure found in response');
                }

                // Success state
                statusDiv.className = 'notion-status success';
                statusDiv.innerHTML = '✅ Analysis complete';

                // Format and display the response
                const formattedResponse = convertMarkdownToUnicode(responseText);
                resultDiv.innerHTML = `<div style="line-height: 1.8;">${formattedResponse.replace(/\n/g, '<br>')}</div>`;

                // Render Mermaid diagram with proper implementation
                if (mermaidCode) {
                    statusDiv.innerHTML = '✅ Analysis complete • Loading Mermaid library...';

                    // Load and render Mermaid fresh each time
                    try {
                        await loadAndRenderMermaid(mermaidCode, mermaidContainer);
                        statusDiv.innerHTML = '✅ Analysis complete • Workflow diagram rendered';
                    } catch (err) {
                        console.error('Mermaid loading/rendering error:', err);
                        mermaidContainer.innerHTML = `
                            <div class="notion-empty-state">
                                <div style="font-size: 32px; margin-bottom: 12px;">⚠️</div>
                                <div>Workflow diagram rendering failed</div>
                                <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">Check the console for details</div>
                            </div>
                        `;
                    }
                } else {
                    mermaidContainer.innerHTML = `
                        <div class="notion-empty-state">
                            <div style="font-size: 32px; margin-bottom: 12px;">📝</div>
                            <div>No workflow data available</div>
                            <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">Try asking for process flow or workflow</div>
                        </div>
                    `;
                }
            } catch (err) {
                console.error('Analysis error:', err);

                // Error state
                statusDiv.className = 'notion-status error';
                statusDiv.innerHTML = '❌ Analysis failed';

                resultDiv.innerHTML = `
                    <div class="notion-empty-state">
                        <div style="font-size: 32px; margin-bottom: 12px;">💥</div>
                        <div>Something went wrong</div>
                        <div style="font-size: 14px; margin-top: 8px; color: #ef4444;">${err.message}</div>
                        <div style="font-size: 12px; margin-top: 16px; opacity: 0.7;">Please try again or check your API key</div>
                    </div>
                `;

                flowchartContainer.innerHTML = `
                    <div class="notion-empty-state">
                        <div style="font-size: 32px; margin-bottom: 12px;">🚫</div>
                        <div>Could not generate workflow diagram</div>
                        <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">Please try the analysis again</div>
                    </div>
                `;
            } finally {
                // Reset button state
                btn.disabled = false;
                btn.innerHTML = originalBtnContent;
            }
        };
    };

    const openCustomModal = () => {
        const convPrefill = extractConversation();
        const modalContent = {
            title: "✏️ Custom Conversation",
            content: `
      <div style="background: white; padding: 20px; border-radius: 8px;">
        <label style="display:block; margin-bottom:8px; font-weight: 600; color: #374151;">Conversation (editable):</label>
        <textarea id="custom-convo" style="width:100%; padding:12px; border:2px solid #e5e7eb; border-radius:8px; margin-bottom:16px; height:120px; font-size: 14px; font-family: monospace; transition: border-color 0.2s;">${convPrefill}</textarea>
        <label style="display:block; margin-bottom:8px; font-weight: 600; color: #374151;">Enter instruction:</label>
        <textarea id="custom-instruction" style="width:100%; padding:12px; border:2px solid #e5e7eb; border-radius:8px; margin-bottom:16px; height:80px; font-size: 14px; transition: border-color 0.2s;" placeholder="e.g., build a reply"></textarea>
        <button id="modal-custom-btn" style="width:100%; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:#fff; padding:12px; border:none; border-radius:8px; cursor:pointer; font-weight: 600; font-size: 15px; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">Think</button>
        <div id="modal-custom-status" style="margin-top:12px; font-size:0.875rem; color:#6b7280; min-height:20px; font-weight: 500;"></div>
        <div id="modal-custom-result" style="margin-top:16px; white-space:pre-wrap; color:#111827; background: #f9fafb; padding: 16px; border-radius: 8px; min-height: 50px; max-height: 400px; overflow-y: auto;"></div>
      </div>
      `
        };
        const { overlay, inner } = openModal(modalContent);
        const convoEl = inner.querySelector("#custom-convo"),
            instrEl = inner.querySelector("#custom-instruction"),
            btn = inner.querySelector("#modal-custom-btn"),
            statusDiv = inner.querySelector("#modal-custom-status"),
            resDiv = inner.querySelector("#modal-custom-result");

        // Add hover effects
        convoEl.addEventListener('focus', () => convoEl.style.borderColor = '#667eea');
        convoEl.addEventListener('blur', () => convoEl.style.borderColor = '#e5e7eb');
        instrEl.addEventListener('focus', () => instrEl.style.borderColor = '#667eea');
        instrEl.addEventListener('blur', () => instrEl.style.borderColor = '#e5e7eb');
        btn.addEventListener('mouseenter', () => { btn.style.transform = 'translateY(-2px)'; btn.style.boxShadow = '0 6px 12px rgba(102, 126, 234, 0.4)'; });
        btn.addEventListener('mouseleave', () => { btn.style.transform = 'translateY(0)'; btn.style.boxShadow = '0 4px 6px rgba(102, 126, 234, 0.3)'; });

        instrEl.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); btn.click(); } });
        btn.onclick = async () => {
            if (!instrEl.value.trim()) { alert("Please enter instruction."); return; }
            btn.disabled = true;
            btn.style.opacity = '0.6';
            statusDiv.textContent = "Starting...";
            resDiv.textContent = "";
            try {
                const res = await callGeminiAPI("extendedExplanation", convoEl.value.trim(), instrEl.value.trim(), (status) => {
                    statusDiv.textContent = status;
                });
                statusDiv.textContent = "✓ Complete";
                statusDiv.style.color = '#10b981';
                resDiv.textContent = convertMarkdownToUnicode(res);
            } catch (err) {
                statusDiv.textContent = "✗ Failed";
                statusDiv.style.color = '#ef4444';
                resDiv.textContent = "Error: " + err.message;
            }
            btn.disabled = false;
            btn.style.opacity = '1';
        };
    };

    // --- Attach Sidebar Button Event Listeners ---
    btnCopy.addEventListener('click', () => {
        const conv = extractConversation();
        navigator.clipboard.writeText(conv).then(() => {
            alert("Conversation copied!");
        }, () => {
            alert("Copy failed");
        });
    });

    btnThink.addEventListener('click', openThinkModal);
    btnCustom.addEventListener('click', openCustomModal);



    // --- Markdown to Unicode Conversion ---
    const convertMarkdownToUnicode = text => {
        const charMapping = { 'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭', 'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇' };
        const charMappingUnderline = { 'A': 'A͟', 'B': 'B͟', 'C': 'C͟', 'D': 'D͟', 'E': 'E͟', 'F': 'F͟', 'G': 'G͟', 'H': 'H͟', 'I': 'I͟', 'J': 'J͟', 'K': 'K͟', 'L': 'L͟', 'M': 'M͟', 'N': 'N͟', 'O': 'O͟', 'P': 'P͟', 'Q': 'Q͟', 'R': 'R͟', 'S': 'S͟', 'T': 'T͟', 'U': 'U͟', 'V': 'V͟', 'W': 'W͟', 'X': 'X͟', 'Y': 'Y͟', 'Z': 'Z͟', 'a': 'a͟', 'b': 'b͟', 'c': 'c͟', 'd': 'd͟', 'e': 'e͟', 'f': 'f͟', 'g': 'g͟', 'h': 'h͟', 'i': 'i͟', 'j': 'j͟', 'k': 'k͟', 'l': 'l͟', 'm': 'm͟', 'n': 'n͟', 'o': 'o͟', 'p': 'p͟', 'q': 'q͟', 'r': 'r͟', 's': 's͟', 't': 't͟', 'u': 'u͟', 'v': 'v͟', 'w': 'w͟', 'x': 'x͟', 'y': 'y͟', 'z': 'z͟' };
        const numberFormatting = { '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵', '0': '𝟬' };
        text = text.replace(/(\d+)\. (\*\*.*?\*\*)/g, (_, num, part) => {
            let s = "";
            for (const d of num) s += numberFormatting[d];
            return s + ". " + part;
        });
        text = text.replace(/### (.*?)(\r\n|\r|\n|$)/g, (_, header) => {
            for (const [ch, repl] of Object.entries(charMappingUnderline)) {
                header = header.replace(new RegExp(ch, 'g'), repl);
            }
            for (const [ch, repl] of Object.entries(charMapping)) {
                header = header.replace(new RegExp(ch, 'g'), repl);
            }
            return "❒ " + header + " ❱";
        });
        text = text.replace(/\*\*(.*?)\*\*/g, (_, bText) => {
            for (const [ch, repl] of Object.entries(charMapping)) {
                bText = bText.replace(new RegExp(ch, 'g'), repl);
            }
            return bText;
        });
        text = text.replace(/^   - /gm, "   ◉ ");
        text = text.replace(/^    - /gm, "    • ");
        text = text.replace(/^        - /gm, "        ‣ ");
        const negatives = [
            { o: "email", r: "e-mail" },
            { o: "emails", r: "e-mails" },
            { o: "Email", r: "E-mail" },
            { o: "Emails", r: "E-mails" },
            { o: "pay", r: "𝗉𝖺𝗒" },
            { o: "money", r: "𝗆𝗈𝗇𝖾𝗒" }
        ];
        negatives.forEach(item => {
            text = text.replace(new RegExp(item.o, 'g'), item.r);
        });
        return text;
    };

})();


// ==UserScript==
// @name         4d4y.ai
// @namespace    http://tampermonkey.net/
// @version      5.1.0
// @description  AI-powered auto-completion with page context
// @author       屋大维
// @license      MIT
// @match        *://www.4d4y.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.0.2/tesseract.min.js
// @downloadURL https://update.greasyfork.org/scripts/526951/4d4yai.user.js
// @updateURL https://update.greasyfork.org/scripts/526951/4d4yai.meta.js
// ==/UserScript==

(() => {
    // =======================
    // Config Menu
    // =======================
    // Default settings
    const defaultSettings = {
        FAST_REPLY_BTN: true,
        ATTITUDE: "",
        INCLUDE_IMG: true,
        OLLAMA_URL: "http://localhost:11434/api/generate",
        MODEL_NAME: "deepseek-r1:14b",
        DOUBLE_TAB_MODE: true,
        ENABLE_TOKEN_SAVER: true,
        LOCAL_GATE_ENABLED: true,
        LOCAL_GATE_LEVEL: 2,
        OpenAIConfig: {
            enabled: false,
            API_URL: "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
            apiKey: "",
            model: "",
            options: {}
        }
    };

    // Load stored settings or use defaults
    let settings = GM_getValue("scriptSettings", defaultSettings);

    // Available LLM models
    function getOllamaModels() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://localhost:11434/api/tags",
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.models) {
                            resolve(data.models.map(m => m.name)); // Return list of model names
                        } else {
                            resolve([]); // No models found
                        }
                    } catch (e) {
                        reject("Failed to parse response.");
                    }
                },
                onerror: function () {
                    reject("Failed to connect to Ollama.");
                }
            });
        });
    }

    let OLLAMA_MODELS = [];
    async function queryAvailableOllamaModels() {
        OLLAMA_MODELS = await getOllamaModels();
    }

    // Create settings modal
    function createSettingsModal() {
        let modal = document.createElement("div");
        modal.id = "tampermonkey-settings-modal";
        modal.style = `
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          background: white; padding: 20px; border-radius: 10px; z-index: 10000;
          box-shadow: 0px 4px 10px rgba(0,0,0,0.3); width: 400px; max-width: 90%;
          text-align: left;
          font-family: Arial, sans-serif;
          max-height: 90vh; /* Ensures the modal does not exceed the viewport height */
          overflow: auto; /* Enables scrolling if content overflows */
      `;

        modal.innerHTML = `
          <h3 style="margin-top: 0;">Script Settings</h3>

          <h4>🔧 General Settings</h4>
          <label><input type="checkbox" id="FAST_REPLY_BTN"> Fast Reply Button</label><br>
          <label>Attitude: <input type="text" id="ATTITUDE" style="width: 100%;"></label><br>
          <label><input type="checkbox" id="INCLUDE_IMG"> Include Images</label><br>

          <h4>🧠 Model & API Settings</h4>
          <label>Ollama URL: <input type="text" id="OLLAMA_URL" style="width: 100%;"></label><br>
          <label>Model:
              <select id="MODEL_NAME" style="width: 100%;">
                  ${OLLAMA_MODELS.map(model => `<option value="${model}">${model}</option>`).join("")}
              </select>
          </label><br>

          <h4>⚙️ OpenAI API Settings</h4>
          <label><input type="checkbox" id="OpenAIConfig_enabled"> Use OpenAI API</label><br>
          <label>API URL: <input type="text" id="OpenAIConfig_API_URL" style="width: 100%;"></label><br>
          <label>API Key: <input type="text" id="OpenAIConfig_apiKey" style="width: 100%;"></label><br>
          <label>Model:
              <input type="text" id="OpenAIConfig_model" style="width: 100%;" placeholder="Enter Model Name">
          </label><br>
          <label>Options (JSON): <textarea id="OpenAIConfig_options" style="width: 100%; height: 60px;"></textarea></label><br>

          <h4>🚀 Performance & UI Tweaks</h4>
          <label><input type="checkbox" id="DOUBLE_TAB_MODE"> Double Tab Mode</label><br>
          <label><input type="checkbox" id="ENABLE_TOKEN_SAVER"> Enable Token Saver</label><br>
          <label><input type="checkbox" id="LOCAL_GATE_ENABLED"> Smart Trigger</label><br>
          <label>Smart Trigger Level:
              <select id="LOCAL_GATE_LEVEL" style="width: 100%;">
                  <option value="1">Relaxed</option>
                  <option value="2">Balanced</option>
                  <option value="3">Strict</option>
              </select>
          </label><br>

          <button id="save-settings" style="width: 100%; padding: 5px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Save</button>
          <button id="reset-settings" style="width: 100%; margin-top: 5px; padding: 5px; background: #ff4d4d; color: white; border: none; border-radius: 5px; cursor: pointer;">Reset to Default</button>
          <button id="close-settings" style="width: 100%; margin-top: 5px; padding: 5px; background: #ccc; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
      `;

        document.body.appendChild(modal);

        // Load current values into the form
        Object.keys(settings).forEach(key => {
            let elem = document.getElementById(key);
            if (elem) elem.type === "checkbox" ? (elem.checked = settings[key]) : (elem.value = settings[key]);
        });

        Object.keys(settings.OpenAIConfig).forEach(key => {
            let elem = document.getElementById("OpenAIConfig_" + key);
            if (elem) elem.type === "checkbox" ? (elem.checked = settings.OpenAIConfig[key]) : (elem.value = settings.OpenAIConfig[key]);
        });

        document.getElementById("OpenAIConfig_options").value = JSON.stringify(settings.OpenAIConfig.options, null, 2);

        // Save settings
        document.getElementById("save-settings").onclick = () => {
            Object.keys(settings).forEach(key => {
                let elem = document.getElementById(key);
                if (elem) settings[key] = elem.type === "checkbox" ? elem.checked : elem.value;
            });

            Object.keys(settings.OpenAIConfig).forEach(key => {
                let elem = document.getElementById("OpenAIConfig_" + key);
                if (elem) settings.OpenAIConfig[key] = elem.type === "checkbox" ? elem.checked : elem.value;
            });

            try {
                settings.OpenAIConfig.options = JSON.parse(document.getElementById("OpenAIConfig_options").value);
            } catch (e) {
                alert("Invalid JSON format in options!");
                return;
            }

            GM_setValue("scriptSettings", settings);
            modal.remove();
            location.reload();
        };

        // Reset settings to default
        document.getElementById("reset-settings").onclick = () => {
            GM_setValue("scriptSettings", defaultSettings);
            location.reload();
        };

        document.getElementById("close-settings").onclick = () => modal.remove();
    }

    // Register context menu command
    GM_registerMenuCommand("Edit Script Settings", createSettingsModal);

    // =======================
    // MAIN
    // =======================
    let lastRequest = null;
    let statusBar = null;
    let activeElement = null;
    let suggestion = "";
    let lastInputText = "";
    let debounceTimer = null;
    let LAST_TAB_TIME = 0;
    let lastTriggerAt = 0;
    let lastTriggeredText = "";
    let lastInputAt = 0;
    let gateWorker = null;
    let gateRequestId = 0;
    let lastGatePayload = null;
    let inlineOverlay = null;
    let inlineOverlayInput = null;
    let inlineOverlaySuggestion = null;
    const SHORT_SUGGESTION_MAX_CHARS = 24;
    const DEBUG_LOG = true;
    const OCR_CACHE_KEY = "ocrCache";
    const OCR_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
    const OCR_CACHE_MAX_ENTRIES = 200;

    function debugLog(...args) {
        if (DEBUG_LOG) {
            console.log("[4d4y.ai]", ...args);
        }
    }

    function tokenSaver(input) {
        // 节省input token
        let processed = input
            .replace(/\r/g, "") // 移除回车符
            .replace(/<br\s*\/?>|<\/?p>/gi, "\n") // HTML 换行符转换为换行
            .replace(/[\u200B-\u200D\uFEFF]/g, "") // 移除零宽字符
            .replace(/[\u00A0\u3000\u202F\u2009]/g, " ") // **替换所有特殊空格**
            .replace(/\t/g, " ") // 制表符变成空格
            .replace(/[ ]{2,}/g, " ") // **合并多个空格**
            .replace(/\n{3,}/g, "\n\n") // **合并多余的换行**
            .replace(/([!?。！？,，；;:])\1{2,}/g, "$1$1") // 合并重复标点
            .trim(); // 去除首尾空白
        debugLog(`Token Saver: saved ${input.length - processed.length} tokens`);
        return processed;
    }

    function loadOCRCache() {
        return GM_getValue(OCR_CACHE_KEY, { entries: {}, order: [] });
    }

    function saveOCRCache(cache) {
        GM_setValue(OCR_CACHE_KEY, cache);
    }

    function pruneOCRCache(cache) {
        const now = Date.now();
        let changed = false;
        cache.order = cache.order.filter((key) => {
            const entry = cache.entries[key];
            if (!entry) {
                changed = true;
                return false;
            }
            if (now - entry.ts > OCR_CACHE_TTL_MS) {
                delete cache.entries[key];
                changed = true;
                return false;
            }
            return true;
        });

        while (cache.order.length > OCR_CACHE_MAX_ENTRIES) {
            const oldest = cache.order.shift();
            if (oldest && cache.entries[oldest]) {
                delete cache.entries[oldest];
                changed = true;
            }
        }

        if (changed) {
            debugLog(`OCR cache pruned. size=${cache.order.length}`);
            saveOCRCache(cache);
        }
    }

    function getOCRCache(id) {
        const cache = loadOCRCache();
        const entry = cache.entries[id];
        if (!entry) return null;
        if (Date.now() - entry.ts > OCR_CACHE_TTL_MS) {
            delete cache.entries[id];
            cache.order = cache.order.filter((key) => key !== id);
            saveOCRCache(cache);
            return null;
        }
        return entry.text;
    }

    function setOCRCache(id, text) {
        const cache = loadOCRCache();
        cache.entries[id] = { text, ts: Date.now() };
        cache.order = cache.order.filter((key) => key !== id);
        cache.order.push(id);
        pruneOCRCache(cache);
        saveOCRCache(cache);
    }

    function getTidFromUrl() {
        let match = window.location.href.match(/tid=(\d+)/);
        return match ? match[1] : null;
    }

    function getPageContext() {
        let context = { title: "", posts: [] };

        try {
            // Get thread title (Updated XPath)
            const titleNode = document.evaluate(
                "/html/body/div[4]/text()[3]",
                document,
                null,
                XPathResult.STRING_TYPE,
                null,
            );
            context.title = titleNode.stringValue.trim().replace(/^»\s*/, ""); // Remove "» " from title

            // Get posts (only direct children of #postlist)
            const postList = document.querySelector("#postlist");
            if (postList) {
                const posts = postList.children; // Only direct child divs
                for (let post of posts) {
                    if (post.tagName === "DIV") {
                        let postId = post.getAttribute("id")?.replace("post_", "") || "";
                        let poster =
                            post.querySelector(".postauthor .postinfo")?.innerText.trim() ||
                            "Unknown";
                        let contentElement = post.querySelector(
                            ".postcontent td.t_msgfont",
                        );

                        if (!contentElement) continue;

                        // 克隆 contentElement，避免修改 DOM
                        let clonedContent = contentElement.cloneNode(true);
                        clonedContent
                            .querySelectorAll('div[style="display: none;"]')
                            .forEach((div) => div.remove());
                        clonedContent
                            .querySelectorAll("span.ocr-result")
                            .forEach((span) => span.remove()); // content不包括span.ocr-result

                        // 提取 quote 内容
                        let quoteElements = Array.from(
                            clonedContent.querySelectorAll("div.quote"),
                        );
                        let quotes = quoteElements.map((quote) => quote.innerText.trim());

                        // 从克隆节点删除 quote 但不影响原始 DOM
                        quoteElements.forEach((quote) => quote.remove());

                        let content = clonedContent.innerText.trim();
                        let postTimeElement = post.querySelector(`em[id^="authorposton"]`);
                        let postTime = postTimeElement
                            ? postTimeElement.textContent.replace("发表于 ", "").trim()
                            : "未知";

                        // Extract text from all <span class="ocr-result"> elements
                        let ocrResults = Array.from(
                            post.querySelectorAll("span.ocr-result"),
                        )
                            .map((span) => span.innerText.trim())
                            .join("\n\n"); // Join all texts

                        if (content || ocrResults) {
                            context.posts.push({
                                tid: getTidFromUrl(),
                                id: postId,
                                poster,
                                content,
                                postTime,
                                quote: quotes.length > 0 ? quotes : undefined, // Only add if non-empty
                                img: ocrResults,
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error extracting page context:", error);
        }

        return context;
    }

    function createStatusBar() {
        statusBar = document.createElement("div");
        statusBar.id = "ai-status-bar";
        statusBar.innerText = "Idle";
        document.body.appendChild(statusBar);
        GM_addStyle(`
                @keyframes auroraGlow {
                    0% { box-shadow: 0 0 8px rgba(255, 0, 0, 0.6); }
                    25% { box-shadow: 0 0 8px rgba(255, 165, 0, 0.6); }
                    50% { box-shadow: 0 0 8px rgba(0, 255, 0, 0.6); }
                    75% { box-shadow: 0 0 8px rgba(0, 0, 255, 0.6); }
                    100% { box-shadow: 0 0 8px rgba(255, 0, 255, 0.6); }
                }
                #ai-status-bar {
                    position: fixed;
                    bottom: 10px;
                    right: 10px;
                    background: rgba(20, 20, 20, 0.85);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: bold;
                    z-index: 9999;
                }
                #ai-status-bar.glowing {
                    animation: auroraGlow 1.5s infinite alternate ease-in-out;
                }
            `);
    }

    function createInlineOverlay() {
        inlineOverlay = document.createElement("div");
        inlineOverlay.id = "ai-inline-overlay";
        inlineOverlayInput = document.createElement("span");
        inlineOverlayInput.id = "ai-inline-input";
        inlineOverlaySuggestion = document.createElement("span");
        inlineOverlaySuggestion.id = "ai-inline-suggestion";
        inlineOverlay.appendChild(inlineOverlayInput);
        inlineOverlay.appendChild(inlineOverlaySuggestion);
        document.body.appendChild(inlineOverlay);
        GM_addStyle(`
                #ai-inline-overlay {
                    position: absolute;
                    pointer-events: none;
                    white-space: pre-wrap;
                    overflow: hidden;
                    color: transparent;
                    z-index: 9998;
                }
                #ai-inline-input {
                    color: transparent;
                }
                #ai-inline-suggestion {
                    color: rgba(140, 140, 140, 0.9);
                }
            `);
    }

    function countWords(text) {
        return Array.from(text).filter((c) => /\S/.test(c)).length; // Count non-space characters
    }

    function getGateProfile(level) {
        switch (Number(level)) {
            case 1:
                return {
                    minChars: 4,
                    minDelta: 2,
                    idleMs: 300,
                    cooldownMs: 2500,
                    threshold: 3,
                };
            case 3:
                return {
                    minChars: 8,
                    minDelta: 6,
                    idleMs: 700,
                    cooldownMs: 6000,
                    threshold: 4,
                };
            case 2:
            default:
                return {
                    minChars: 6,
                    minDelta: 4,
                    idleMs: 500,
                    cooldownMs: 4000,
                    threshold: 4,
                };
        }
    }

    function initGateWorker() {
        if (gateWorker) return;
        if (typeof Worker === "undefined") return;
        const workerSource = `
self.onmessage = (event) => {
    const { id, text, lastTriggeredText, cursorAtEnd, now, lastTriggerAt, profile } = event.data;
    const result = { id, shouldTrigger: false, score: 0 };
    if (!cursorAtEnd) return postMessage(result);
    if (!text || text.length < profile.minChars) return postMessage(result);
    if (now - lastTriggerAt < profile.cooldownMs) return postMessage(result);
    const delta = text.length - (lastTriggeredText || "").length;
    if (delta < profile.minDelta) return postMessage(result);
    const lastChar = text.slice(-1);
    if (/[^a-zA-Z0-9\\u4e00-\\u9fa5]/.test(lastChar)) return postMessage(result);
    let score = 0;
    score += Math.min(3, Math.floor(text.length / profile.minChars));
    score += Math.min(2, Math.floor(delta / profile.minDelta));
    score += /[a-zA-Z0-9\\u4e00-\\u9fa5]/.test(lastChar) ? 1 : 0;
    result.score = score;
    result.shouldTrigger = score >= profile.threshold;
    postMessage(result);
};
        `;
        const blob = new Blob([workerSource], { type: "application/javascript" });
        gateWorker = new Worker(URL.createObjectURL(blob));
        gateWorker.onmessage = (event) => {
            const { id, shouldTrigger } = event.data;
            if (!lastGatePayload || id !== lastGatePayload.id) return;
            if (shouldTrigger) {
                lastTriggerAt = lastGatePayload.now;
                lastTriggeredText = lastGatePayload.text;
                fetchCompletion(lastGatePayload.text, "short");
            }
        };
    }

    function requestShortCompletion(text) {
        const profile = getGateProfile(settings.LOCAL_GATE_LEVEL);
        const now = Date.now();
        if (now - lastInputAt < profile.idleMs) return;
        if (!activeElement) return;

        if (!settings.LOCAL_GATE_ENABLED || !gateWorker) {
            lastTriggerAt = now;
            lastTriggeredText = text;
            fetchCompletion(text, "short");
            return;
        }

        const cursorAtEnd =
            activeElement.selectionStart === activeElement.value.length &&
            activeElement.selectionEnd === activeElement.value.length;
        const id = ++gateRequestId;
        lastGatePayload = { id, text, now };
        gateWorker.postMessage({
            id,
            text,
            lastTriggeredText,
            cursorAtEnd,
            now,
            lastTriggerAt,
            profile,
        });
    }

    function getTextFromElement(element) {
        return element.tagName === "TEXTAREA"
            ? element.value
            : element.innerText.replace(/\n/g, " "); // Remove HTML formatting
    }

    function syncOverlayToTextarea(textarea) {
        if (!inlineOverlay || !textarea) return;
        const rect = textarea.getBoundingClientRect();
        const style = window.getComputedStyle(textarea);
        inlineOverlay.style.left = rect.left + window.scrollX + "px";
        inlineOverlay.style.top = rect.top + window.scrollY + "px";
        inlineOverlay.style.width = rect.width + "px";
        inlineOverlay.style.height = rect.height + "px";
        inlineOverlay.style.fontFamily = style.fontFamily;
        inlineOverlay.style.fontSize = style.fontSize;
        inlineOverlay.style.lineHeight = style.lineHeight;
        inlineOverlay.style.letterSpacing = style.letterSpacing;
        inlineOverlay.style.padding = style.padding;
        inlineOverlay.style.borderRadius = style.borderRadius;
        inlineOverlay.style.boxSizing = style.boxSizing;
        inlineOverlay.scrollTop = textarea.scrollTop;
        inlineOverlay.scrollLeft = textarea.scrollLeft;
        inlineOverlay.style.display = "block";
    }

    function updateInlineSuggestion(inputText, inlineText) {
        if (!inlineOverlay || !activeElement) return;
        if (!inlineText) {
            clearInlineSuggestion();
            return;
        }
        inlineOverlayInput.textContent = inputText;
        inlineOverlaySuggestion.textContent = inlineText || "";
        syncOverlayToTextarea(activeElement);
    }

    function clearInlineSuggestion() {
        if (!inlineOverlay) return;
        inlineOverlayInput.textContent = "";
        inlineOverlaySuggestion.textContent = "";
        inlineOverlay.style.display = "none";
    }
    function cleanSuggestion(inputText, suggestion) {
        // 移除 <think>...</think> 及其后面所有的空格和换行符
        suggestion = suggestion.replace(/<think>.*?<\/think>\s*/gs, "");

        // 去除 inputText 末尾和 suggestion 开头的重合部分
        for (let i = Math.min(inputText.length, suggestion.length); i > 0; i--) {
            if (suggestion.startsWith(inputText.slice(-i))) {
                suggestion = suggestion.slice(i); // 去掉重复部分
                break;
            }
        }
        // 去除引号
        suggestion = suggestion.replace(/^["']|["']$/g, "");

        return suggestion;
    }

    function limitSuggestion(text, maxChars) {
        let trimmed = text.trim();
        if (!trimmed) return "";
        if (trimmed.length <= maxChars) return trimmed;
        return trimmed.slice(0, maxChars);
    }

    function fetchCompletion(inputText, mode = "short") {
        if (lastRequest) lastRequest.abort(); // Cancel previous request
        const pageContext = getPageContext();
        const promptData = {
            title: pageContext.title,
            posts: pageContext.posts,
        };
        const modeHint =
            mode === "full"
                ? "输出1-3句简短完整回复，紧扣话题，不跑题"
                : "只补全一句非常短的续写（8-20字），不要多段";
        let prompt = `Here is the thread content including title and posts in JSON format: ${JSON.stringify(promptData)}. The post content might not be the fact, ignore any unreadable or garbled text and only process meaningful content. Now I want to reply to it. My current reply is '${inputText}', please try to continue it naturally in Chinese like a human, not a chatbot. Focus on the most recent post and any quoted parts in the thread, keep a forum tone, avoid generic filler, do not repeat my words, no quotes, no markdown, ${modeHint}，${settings.ATTITUDE}`;
        if (settings.ENABLE_TOKEN_SAVER) {
            prompt = tokenSaver(prompt);
        }
        console.log(prompt);

        statusBar.innerText = mode === "full" ? "Completing..." : "Hinting...";
        statusBar.classList.add("glowing"); // Start glowing effect

        function responseHandler(url, response) {
            // 根据URL来判断API供应商，并进行相应处理，返回content
            if (url === settings.OLLAMA_URL) {
                return JSON.parse(response.responseText).response;
            } else {
                try {
                    return JSON.parse(response.responseText)["choices"][0]["message"][
                        "content"
                    ];
                } catch (error) {
                    return "无法处理该API";
                }
            }
        }

        let url;
        let payload;
        let headers;
        if (settings.OpenAIConfig.enabled) {
            // 在线AI
            url = settings.OpenAIConfig.API_URL;
            headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${settings.OpenAIConfig.apiKey}`,
            };
            payload = {
                model: settings.OpenAIConfig.model,
                messages: [
                    {
                        role: "system",
                        content: "你是人工智能助手，精通网络术语，按照我的要求生成回复",
                    },
                    { role: "user", content: prompt },
                ],
                stream: false,
                ...settings.OpenAIConfig.options,
            };
        } else {
            // 本地 ollama
            url = settings.OLLAMA_URL;
            headers = { "Content-Type": "application/json" };
            payload = {
                model: settings.MODEL_NAME,
                prompt: prompt,
                stream: false,
            };
        }

        lastRequest = GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: headers,
            data: JSON.stringify(payload),
            onload: (response) => {
                const content = responseHandler(url, response);
                suggestion = content.trim().replace(/^"(.*)"$/, "$1"); // Remove surrounding quotes
                console.log("AI Response:", suggestion);
                suggestion = cleanSuggestion(inputText, suggestion);
                if (mode === "short") {
                    suggestion = limitSuggestion(suggestion, SHORT_SUGGESTION_MAX_CHARS);
                }

                updateInlineSuggestion(inputText, suggestion);

                statusBar.innerText = "Ready";
                statusBar.classList.remove("glowing"); // Stop glowing effect
            },
            onerror: () => {
                statusBar.innerText = "Error!";
                statusBar.classList.remove("glowing"); // Stop glowing effect
            },
        });
    }

    function handleInput(event) {
        if (!activeElement) return;
        const text = getTextFromElement(activeElement);
        const wordCount = countWords(text);
        const profile = getGateProfile(settings.LOCAL_GATE_LEVEL);
        if (text !== lastInputText && suggestion) {
            suggestion = "";
            clearInlineSuggestion();
        }

        if (wordCount < 3) {
            statusBar.innerText = "Waiting for more input...";
            clearInlineSuggestion();
            lastInputText = text;
            return;
        }

        const lastChar = text.slice(-1);
        const isPunctuation = /[\s.,!?;:()，。；（）！？【】「」『』、]/.test(
            lastChar,
        );
        const isDeleteOnlyPunctuation =
            lastInputText.length > text.length &&
            !/[a-zA-Z0-9\u4e00-\u9fa5]/.test(lastInputText.replace(text, ""));

        if (isPunctuation || isDeleteOnlyPunctuation) {
            lastInputText = text;
            return;
        }

        if (debounceTimer) clearTimeout(debounceTimer);
        lastInputAt = Date.now();
        debounceTimer = setTimeout(() => requestShortCompletion(text), profile.idleMs);

        lastInputText = text;
    }

    function insertTextAtCursor(textarea, text) {
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        let before = textarea.value.substring(0, start);
        let after = textarea.value.substring(end);
        textarea.value = before + text + after;
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
    }

    function handleKeyDown(event) {
        if (event.key !== "Tab") return;

        if (settings.DOUBLE_TAB_MODE) {
            event.preventDefault();
            event.stopPropagation();
            const currentTime = new Date().getTime();

            if (suggestion) {
                if (activeElement.tagName === "TEXTAREA") {
                    insertTextAtCursor(activeElement, suggestion);
                }
                clearInlineSuggestion();
                suggestion = "";
                LAST_TAB_TIME = currentTime;
                return;
            }

            const timeSinceLastTab = currentTime - LAST_TAB_TIME;
            if (timeSinceLastTab < 300 && timeSinceLastTab > 0) {
                console.log("Double Tab detected!");
                let text = getTextFromElement(activeElement);
                if (text.length === 0) {
                    text = "根据楼上的发言，";
                }
                fetchCompletion(text, "full");
            }
            LAST_TAB_TIME = currentTime;
        } else if (suggestion) {
            event.preventDefault();
            event.stopPropagation();
            if (activeElement.tagName === "TEXTAREA") {
                insertTextAtCursor(activeElement, suggestion);
            }
            clearInlineSuggestion();
            suggestion = "";
        }
    }

    function initListeners() {
        document.addEventListener("focusin", (event) => {
            if (event.target.matches("textarea")) {
                activeElement = event.target;
                // 输入引发短补全
                activeElement.addEventListener("input", handleInput);
                activeElement.addEventListener("input", () => {
                    updateInlineSuggestion(getTextFromElement(activeElement), suggestion);
                });
                activeElement.addEventListener("scroll", () => {
                    syncOverlayToTextarea(activeElement);
                });
                // 插入补全 listener
                activeElement.addEventListener("keydown", handleKeyDown);
                lastInputText = getTextFromElement(activeElement);
                updateInlineSuggestion(lastInputText, suggestion);
            }
        });

        document.addEventListener("focusout", () => {
            clearInlineSuggestion();
            suggestion = "";
        });

        window.addEventListener("scroll", () => {
            syncOverlayToTextarea(activeElement);
        });
        window.addEventListener("resize", () => {
            syncOverlayToTextarea(activeElement);
        });
    }
    // OCR Module
    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0; // Convert to 32-bit integer
        }
        return `ocr-${Math.abs(hash)}`;
    }

    function fetchImageAsDataURL(url) {
        console.log(`Fetching image: ${url}`);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                onload: function (response) {
                    let reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(response.response);
                },
                onerror: (err) => {
                    console.error(`Failed to fetch image: ${url}`, err);
                    reject(err);
                },
            });
        });
    }

    function isValidOCR(text) {
        let cleanText = text.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "").trim();
        return cleanText.length >= 3;
    }

    function cleanOCRText(ocrText) {
        let lines = ocrText.split("\n").filter(isValidOCR);
        return lines.join("\n");
    }

    function cleanText(text) {
        let cleaned = text.replace(
            /\s*(?=[\p{Script=Han}，。！？：“”‘’；（）【】])/gu,
            "",
        );
        cleaned = cleanOCRText(cleaned);
        debugLog(`Cleaned OCR text: ${cleaned}`);
        return cleaned;
    }

    function isMeaningfulOCRText(text) {
        if (!text) return false;
        const compact = text.replace(/\s+/g, "");
        if (compact.length < 6) return false;
        const validChars = compact.match(/[a-zA-Z0-9\u4e00-\u9fa5]/g) || [];
        if (validChars.length < 6) return false;
        const uniqueChars = new Set(validChars).size;
        if (uniqueChars < 3) return false;
        const ratio = validChars.length / compact.length;
        return ratio >= 0.6;
    }

    function quickHasText(imageDataURL) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                if (img.width < 3 || img.height < 3) {
                    debugLog(
                        `Image too small to scan (${img.width}x${img.height}), skipping OCR.`,
                    );
                    resolve(false);
                    return;
                }
                const maxWidth = 220;
                const scale = Math.min(1, maxWidth / img.width);
                const width = Math.max(1, Math.floor(img.width * scale));
                const height = Math.max(1, Math.floor(img.height * scale));
                if (width < 3 || height < 3) {
                    debugLog(
                        `Image too small after scale (${width}x${height}), skipping OCR.`,
                    );
                    resolve(false);
                    return;
                }
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                const data = ctx.getImageData(0, 0, width, height).data;
                let sum = 0;
                let sumSq = 0;
                let edgeCount = 0;
                const total = width * height;
                const lum = new Array(total);
                for (let i = 0, p = 0; i < total; i++, p += 4) {
                    const value =
                        0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2];
                    lum[i] = value;
                    sum += value;
                    sumSq += value * value;
                }
                const mean = sum / total;
                const variance = sumSq / total - mean * mean;
                for (let y = 0; y < height - 1; y++) {
                    for (let x = 0; x < width - 1; x++) {
                        const idx = y * width + x;
                        const diff =
                            Math.abs(lum[idx] - lum[idx + 1]) +
                            Math.abs(lum[idx] - lum[idx + width]);
                        if (diff > 50) edgeCount++;
                    }
                }
                const edgeDensity = edgeCount / total;
                debugLog(
                    `Quick text scan: variance=${variance.toFixed(
                        1,
                    )} edge=${edgeDensity.toFixed(3)}`,
                );
                resolve(variance > 200 && edgeDensity > 0.02);
            };
            img.onerror = () => {
                debugLog("Quick text scan failed to load image, falling back to OCR.");
                resolve(true);
            };
            img.src = imageDataURL;
        });
    }

    function runOCR(imageDataURL) {
        statusBar.innerText = "Analyzing...";
        statusBar.classList.add("glowing"); // Start glowing effect
        return new Promise((resolve, reject) => {
            Tesseract.recognize(imageDataURL, "chi_sim", {
                logger: (m) => {
                    // console.log(m)
                    statusBar.innerText = `Analyzing (${(m.progress * 100).toFixed(2)}%)`;
                },
            })
                .then(({ data: { words } }) => {
                    const minConfidence = 85; // 置信度阈值，可调整
                    const filteredText = words
                        .filter((word) => word.confidence >= minConfidence)
                        .map((word) => word.text)
                        .join(" ");
                    const cleaned = cleanText(filteredText);
                    if (!cleaned) {
                        debugLog("OCR produced empty text.");
                        resolve("(No text detected)");
                        return;
                    }
                    if (!isMeaningfulOCRText(cleaned)) {
                        debugLog("OCR text not meaningful, skipping.");
                        resolve("(No text detected)");
                        return;
                    }
                    resolve(cleaned);
                })
                .catch((err) => {
                    console.error("OCR Error:", err);
                    resolve("(OCR Failed)");
                })
                .finally(() => {
                    statusBar.innerText = "Idle";
                    statusBar.classList.remove("glowing"); // Stop glowing effect
                });
        });
    }

    function processImages(callback) {
        if (!settings.INCLUDE_IMG) {
            return callback();
        }
        let images = document.querySelectorAll('img[onclick^="zoom"]');
        debugLog(`Found ${images.length} images for OCR processing.`);
        let tasks = [];

        images.forEach((img) => {
            let match = img.getAttribute("onclick").match(/zoom\(this, '([^']+)'\)/);
            if (match && match[1]) {
                let fullImageUrl = match[1];
                let spanId = hashString(fullImageUrl); // Generate unique ID
                debugLog(`Processing image: ${fullImageUrl} (ID: ${spanId})`);

                let existingSpan = document.getElementById(spanId);
                if (!existingSpan) {
                    let resultSpan = document.createElement("span");
                    resultSpan.className = "ocr-result";
                    resultSpan.id = spanId; // Assign unique ID
                    resultSpan.style.display = "none";
                    img.insertAdjacentElement("afterend", resultSpan);
                }

                let cachedText = getOCRCache(spanId);
                if (cachedText) {
                    debugLog(`OCR cache hit for #${spanId}`);
                    let resultSpan = document.getElementById(spanId);
                    if (resultSpan) {
                        resultSpan.textContent = cachedText;
                    }
                    return;
                }

                let task = fetchImageAsDataURL(fullImageUrl)
                    .then((dataURL) =>
                        quickHasText(dataURL).then((hasText) => ({
                            dataURL,
                            hasText,
                        })),
                    )
                    .then(({ dataURL, hasText }) => {
                        if (!hasText) {
                            return "(No text detected)";
                        }
                        return runOCR(dataURL);
                    })
                    .then((ocrText) => {
                        let resultSpan = document.getElementById(spanId); // Query by ID before updating
                        if (resultSpan) {
                            resultSpan.textContent = ocrText.trim()
                                ? ocrText
                                : "(No text detected)";
                            debugLog(`Inserted OCR text into #${spanId}`);
                            setOCRCache(spanId, resultSpan.textContent);
                        } else {
                            console.warn(
                                `⚠️ Could not find span #${spanId} to insert OCR text.`,
                            );
                        }
                    });

                tasks.push(task);
            }
        });

        Promise.all(tasks).then(() => {
        debugLog(`OCR completed for ${images.length} images.`);
            if (typeof callback === "function") callback();
        });
    }

    // 快速回复/快速引用，防止进入富文本模式（AI会失去上下文）

    function simpleReply(user, pid, ptid) {
        let textarea = document.querySelector("#fastpostmessage");
        if (textarea) {
            let replyText = `[b]回复 [url=https://www.4d4y.com/forum/redirect.php?goto=findpost&pid=${pid}&ptid=${ptid}]#${pid}[/url] [i]${user}[/i] [/b]\n\n`;
            textarea.value = replyText; // 直接替换，清空原内容
            textarea.focus();
        }
    }

    function simpleQuote(user, postTime, pid, ptid, content) {
        let textarea = document.querySelector("#fastpostmessage");
        if (textarea) {
            let trimmedContent =
                content.length > 200 ? content.substring(0, 200) + " ..." : content;
            let quoteText = `[quote]${trimmedContent}\n[size=2][color=#999999]${user} 发表于 ${postTime}[/color] [url=https://www.4d4y.com/forum/redirect.php?goto=findpost&pid=${pid}&ptid=${ptid}][img]https://www.4d4y.com/forum/images/common/back.gif[/img][/url][/size][/quote]\n\n`;
            insertTextAtCursor(textarea, quoteText); // 插入到光标位置，不清空
        }
    }

    function modifyReplyButtons() {
        let tid = getTidFromUrl();
        if (!tid) return;
        let context = getPageContext();
        document.querySelectorAll("a.fastreply").forEach((btn) => {
            let match = btn.href.match(/reppost=(\d+)/);
            if (match) {
                let pid = match[1];
                let post = context.posts.find((p) => p.id === pid);
                if (post) {
                    let newBtn = document.createElement("a");
                    newBtn.innerText = btn.innerText; // 保持原文本
                    newBtn.style.cursor = "pointer";
                    newBtn.style.color = btn.style.color;
                    newBtn.style.fontSize = btn.style.fontSize;
                    newBtn.style.textDecoration = btn.style.textDecoration;

                    newBtn.addEventListener("click", function (e) {
                        e.preventDefault();
                        simpleReply(post.poster, pid, tid);
                    });

                    btn.replaceWith(newBtn); // 替换原来的<a>
                }
            }
        });

        document.querySelectorAll("a.repquote").forEach((btn) => {
            let match = btn.href.match(/repquote=(\d+)/);
            if (match) {
                let pid = match[1];
                let post = context.posts.find((p) => p.id === pid);
                if (post) {
                    let newBtn = document.createElement("a");
                    newBtn.innerText = btn.innerText; // 保持原文本
                    newBtn.style.cursor = "pointer";
                    newBtn.style.color = btn.style.color;
                    newBtn.style.fontSize = btn.style.fontSize;
                    newBtn.style.textDecoration = btn.style.textDecoration;

                    newBtn.addEventListener("click", function (e) {
                        e.preventDefault();
                        simpleQuote(post.poster, post.postTime, pid, tid, post.content);
                    });

                    btn.replaceWith(newBtn); // 替换原来的<a>
                }
            }
        });
    }

    if (settings.FAST_REPLY_BTN) {
        modifyReplyButtons();
    }
    queryAvailableOllamaModels();
    createStatusBar();
    initGateWorker();
    processImages(() => {
        createInlineOverlay();
        initListeners();
        activeElement = document.querySelector("#fastpostmessage");
        // Auto mode removed; user manually triggers completion.
    });
})();

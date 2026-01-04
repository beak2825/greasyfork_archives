// ==UserScript==
// @name         4d4y.ai
// @namespace    http://tampermonkey.net/
// @version      5.0
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
        AUTO_MODE: false,
        AUTO_LEADING_WORDS: "根据楼上的回复，我已经找到以下杠精：",
        AUTO_PREFIX: "论坛杠精纠察员：\n",
        FAST_REPLY_BTN: true,
        ATTITUDE: "",
        INCLUDE_IMG: true,
        OLLAMA_URL: "http://localhost:11434/api/generate",
        MODEL_NAME: "deepseek-r1:14b",
        DOUBLE_TAB_MODE: true,
        ENABLE_TOKEN_SAVER: true,
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

          <h4>⚡ Auto Mode Settings</h4>
          <label><input type="checkbox" id="AUTO_MODE"> Enable Auto Mode</label><br>
          <label>Leading Words: <input type="text" id="AUTO_LEADING_WORDS" style="width: 100%;"></label><br>
          <label>Reply Prefix: <input type="text" id="AUTO_PREFIX" style="width: 100%;"></label><br>

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
    let suggestionBox = null;
    let statusBar = null;
    let activeElement = null;
    let suggestion = "";
    let lastInputText = "";
    let debounceTimer = null;
    let LAST_TAB_TIME = 0;

    function tokenSaver(input) {
        // 节省input token
        let processed = input
            .replace(/\r/g, "") // 移除回车符
            .replace(/<br\s*\/?>|<\/?p>/gi, "\n") // HTML 换行符转换为换行
            .replace(/[\u00A0\u3000\u202F\u2009]/g, " ") // **替换所有特殊空格**
            .replace(/\t/g, " ") // 制表符变成空格
            .replace(/[ ]{2,}/g, " ") // **合并多个空格**
            .replace(/\n{3,}/g, "\n\n") // **合并多余的换行**
            .trim(); // 去除首尾空白
        console.log(`Token Saver: saved ${input.length - processed.length} tokens`);
        return processed;
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

    function createSuggestionBox() {
        suggestionBox = document.createElement("div");
        suggestionBox.id = "ai-suggestion-box";
        document.body.appendChild(suggestionBox);
        GM_addStyle(`
                #ai-suggestion-box {
                    position: absolute;
                    background: rgba(50, 50, 50, 0.9);
                    color: #fff;
                    padding: 5px 10px;
                    font-size: 14px;
                    border-radius: 5px;
                    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.3);
                    display: none;
                }
            `);
    }

    function countWords(text) {
        return Array.from(text).filter((c) => /\S/.test(c)).length; // Count non-space characters
    }

    function getTextFromElement(element) {
        return element.tagName === "TEXTAREA"
            ? element.value
            : element.innerText.replace(/\n/g, " "); // Remove HTML formatting
    }

    function updateSuggestionBox(position) {
        if (!suggestion || !suggestionBox) return;
        suggestionBox.style.left = position.left + "px";
        suggestionBox.style.top = position.top + 20 + "px";
        suggestionBox.innerText = suggestion;
        suggestionBox.style.display = "block";
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

    function fetchCompletion(inputText) {
        if (lastRequest) lastRequest.abort(); // Cancel previous request
        const pageContext = getPageContext();
        const promptData = {
            title: pageContext.title,
            posts: pageContext.posts,
        };
        let prompt = `Here is the thread content including title and posts in JSON format: ${JSON.stringify(promptData)}. The post content might not be the fact, ignore any unreadable or garbled text and only process meaningful content. Now I want to reply to it. My current reply is '${inputText}', please try to continue it naturally in Chinese like a human, not a chatbot, just continue it, be concise, be short, no quotes, avoid markdown, do not repeat my words, ${settings.ATTITUDE}`;
        if (settings.ENABLE_TOKEN_SAVER) {
            prompt = tokenSaver(prompt);
        }
        console.log(prompt);

        statusBar.innerText = "Fetching...";
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

                if (suggestion) {
                    const cursorPosition = activeElement.selectionStart || 0;
                    const rect = activeElement.getBoundingClientRect();

                    let left = rect.left + cursorPosition * 7; // Estimate cursor X position
                    let top = rect.top + window.scrollY;

                    // Ensure `left` does not exceed the right boundary of the textarea
                    const maxLeft = rect.right; // Right edge of textarea
                    const minLeft = rect.left; // Left edge of textarea
                    left = Math.min(Math.max(left, minLeft), maxLeft);

                    // Ensure `top` stays within the viewport
                    const maxTop = window.innerHeight + window.scrollY - 50; // Avoid bottom overflow
                    top = Math.max(0, Math.min(top, maxTop));

                    updateSuggestionBox({ left, top });
                }

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

        if (wordCount < 3) {
            statusBar.innerText = "Waiting for more input...";
            suggestionBox.style.display = "none";
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
        debounceTimer = setTimeout(() => fetchCompletion(text), 1000);

        lastInputText = text;
    }

    function handleDoubleTab(event) {
        if (event.key === "Tab") {
            event.preventDefault();
            event.stopPropagation();

            const currentTime = new Date().getTime();
            const timeSinceLastTab = currentTime - LAST_TAB_TIME;
            if (timeSinceLastTab < 300 && timeSinceLastTab > 0) {
                console.log("Double Tab detected!");
                let text = getTextFromElement(activeElement);
                if (text.length === 0) {
                    text = "根据楼上的发言，";
                }
                fetchCompletion(text);
            }

            LAST_TAB_TIME = currentTime;
        }
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
        if (event.key === "Tab" && suggestion) {
            event.preventDefault();
            event.stopPropagation();

            if (activeElement.tagName === "TEXTAREA") {
                insertTextAtCursor(activeElement, suggestion);
            }

            suggestionBox.style.display = "none";
            suggestion = "";
        }
    }

    function initListeners() {
        document.addEventListener("focusin", (event) => {
            if (event.target.matches("textarea")) {
                activeElement = event.target;
                // query 激活 listener
                if (settings.DOUBLE_TAB_MODE) {
                    // 双击TAB引发query
                    activeElement.addEventListener("keydown", handleDoubleTab);
                } else {
                    // 用户输入引发query
                    activeElement.addEventListener("input", handleInput);
                }
                // 插入补全 listener
                activeElement.addEventListener("keydown", handleKeyDown);
                lastInputText = getTextFromElement(activeElement);
            }
        });

        document.addEventListener("focusout", () => {
            suggestionBox.style.display = "none";
            suggestion = "";
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
        console.log(`Cleaned OCR text: ${cleaned}`);
        return cleaned;
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
                    resolve(cleanText(filteredText));
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
        console.log(`Found ${images.length} images for OCR processing.`);
        let tasks = [];

        images.forEach((img) => {
            let match = img.getAttribute("onclick").match(/zoom\(this, '([^']+)'\)/);
            if (match && match[1]) {
                let fullImageUrl = match[1];
                let spanId = hashString(fullImageUrl); // Generate unique ID
                console.log(`Processing image: ${fullImageUrl} (ID: ${spanId})`);

                let existingSpan = document.getElementById(spanId);
                if (!existingSpan) {
                    let resultSpan = document.createElement("span");
                    resultSpan.className = "ocr-result";
                    resultSpan.id = spanId; // Assign unique ID
                    resultSpan.style.display = "none";
                    img.insertAdjacentElement("afterend", resultSpan);
                }

                let task = fetchImageAsDataURL(fullImageUrl)
                    .then((dataURL) => runOCR(dataURL))
                    .then((ocrText) => {
                        let resultSpan = document.getElementById(spanId); // Query by ID before updating
                        if (resultSpan) {
                            resultSpan.textContent = ocrText.trim()
                                ? ocrText
                                : "(No text detected)";
                            console.log(`✅ Inserted OCR text into #${spanId}`);
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
            console.log(`OCR completed for ${images.length} images.`);
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
    processImages(() => {
        createSuggestionBox();
        initListeners();
        activeElement = document.querySelector("#fastpostmessage");
        if (settings.AUTO_MODE && activeElement) {
            setTimeout(() => {
                fetchCompletion(settings.AUTO_LEADING_WORDS);
                const s = setInterval(() => {
                    if (suggestion !== "") {
                        activeElement.value = settings.AUTO_PREFIX + suggestion;
                        suggestionBox.style.display = "none";
                        suggestion = "";
                        clearInterval(s);
                    }
                }, 100);
            }, 1000);
        }
    });
})();
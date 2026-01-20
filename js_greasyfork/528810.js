// ==UserScript==
// @name         Text Explainer
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  Explain selected text using LLM
// @author       RoCry
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAxOTIgMTkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiPjxjaXJjbGUgY3g9IjExNiIgY3k9Ijc2IiByPSI1NCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjEyIi8+PHBhdGggc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMTIiIGQ9Ik04Ni41IDEyMS41IDQxIDE2N2MtNC40MTggNC40MTgtMTEuNTgyIDQuNDE4LTE2IDB2MGMtNC40MTgtNC40MTgtNC40MTgtMTEuNTgyIDAtMTZsNDQuNS00NC41TTkyIDYybDEyIDMyIDEyLTMyIDEyIDMyIDEyLTMyIi8+PC9zdmc+
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      generativelanguage.googleapis.com
// @connect      *
// @run-at       document-end
// @inject-into  content
// @require      https://update.greasyfork.org/scripts/528703/1732956/SimpleBalancer.js
// @require      https://update.greasyfork.org/scripts/528704/1732957/SmolLLM.js
// @require      https://update.greasyfork.org/scripts/528763/1732960/Text%20Explainer%20Settings.js
// @require      https://update.greasyfork.org/scripts/528822/1737952/Selection%20Context.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528810/Text%20Explainer.user.js
// @updateURL https://update.greasyfork.org/scripts/528810/Text%20Explainer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // =========================
  // Config/constants
  // =========================
  const DEFAULT_SHORTCUT = {
    key: "d",
    ctrlKey: false,
    altKey: true,
    shiftKey: false,
    metaKey: false,
  };

  const PROMPT_LIMITS = {
    longWords: 500,
    longChars: 2500,
    translateWords: 5,
    translateChars: 30,
  };

  const MAC_OPTION_KEY_MAP = {
    a: "å",
    b: "∫",
    c: "ç",
    d: "∂",
    e: "´",
    f: "ƒ",
    g: "©",
    h: "˙",
    i: "ˆ",
    j: "∆",
    k: "˚",
    l: "¬",
    m: "µ",
    n: "˜",
    o: "ø",
    p: "π",
    q: "œ",
    r: "®",
    s: "ß",
    t: "†",
    u: "¨",
    v: "√",
    w: "∑",
    x: "≈",
    y: "¥",
    z: "Ω",
  };

  const state = {
    settingsManager: null,
    config: null,
    llm: null,
    isProcessing: false,
    activeRequest: null,
    requestSeq: 0,
    abortedRequestId: null,
    floatingButton: null,
    selectionHandlers: null,
    isTouch: false,
  };

  const INLINE_CONFIG = null; // Userscripts: set object to override settings.

  // =========================
  // Core utilities
  // =========================
  function ensureDependency(name, value) {
    if (!value) {
      throw new Error(`${name} is required but not available`);
    }
  }

  function getInlineConfig() {
    const inlineConfig =
      INLINE_CONFIG || globalThis.TEXT_EXPLAINER_INLINE_CONFIG;
    if (!inlineConfig) return null;
    if (typeof inlineConfig !== "object" || Array.isArray(inlineConfig)) {
      throw new Error("INLINE_CONFIG must be a plain object");
    }
    return inlineConfig;
  }

  function ensureGMCompat() {
    if (typeof GM_addStyle !== "function") {
      if (typeof GM === "object" && typeof GM.addStyle === "function") {
        GM_addStyle = function (cssText) {
          GM.addStyle(cssText);
          return cssText;
        };
      } else {
        GM_addStyle = function (cssText) {
          if (!document.head) {
            throw new Error("document.head is not available for GM_addStyle");
          }
          const style = document.createElement("style");
          style.textContent = cssText;
          document.head.appendChild(style);
          return style;
        };
      }
    }

    if (typeof GM_getValue !== "function") {
      if (typeof localStorage === "undefined") {
        throw new Error("localStorage missing; cannot emulate GM_getValue");
      }
      GM_getValue = function (key, defaultValue) {
        const value = localStorage.getItem(`GM_${key}`);
        return value === null ? defaultValue : JSON.parse(value);
      };
    }

    if (typeof GM_setValue !== "function") {
      if (typeof localStorage === "undefined") {
        throw new Error("localStorage missing; cannot emulate GM_setValue");
      }
      GM_setValue = function (key, value) {
        localStorage.setItem(`GM_${key}`, JSON.stringify(value));
      };
    }

    if (
      typeof GM_xmlhttpRequest !== "function" &&
      typeof GM === "object" &&
      typeof GM.xmlHttpRequest === "function"
    ) {
      GM_xmlhttpRequest = GM.xmlHttpRequest;
    }
  }

  function normalizeConfig(config) {
    const shortcut = { ...DEFAULT_SHORTCUT, ...(config.shortcut || {}) };
    const floatingButton = {
      enabled: true,
      size: "medium",
      ...(config.floatingButton || {}),
    };

    return {
      ...config,
      shortcut,
      floatingButton,
    };
  }

  function mergeConfig(baseConfig, overrideConfig) {
    if (!overrideConfig) return baseConfig;
    return {
      ...baseConfig,
      ...overrideConfig,
      shortcut: {
        ...(baseConfig.shortcut || {}),
        ...(overrideConfig.shortcut || {}),
      },
      floatingButton: {
        ...(baseConfig.floatingButton || {}),
        ...(overrideConfig.floatingButton || {}),
      },
    };
  }

  function isEditableTarget(target) {
    if (!target) return false;
    if (target.isContentEditable) return true;
    const tag = target.tagName;
    if (!tag) return false;
    return ["INPUT", "TEXTAREA", "SELECT"].includes(tag);
  }

  // =========================
  // Text/prompt helpers
  // =========================
  function countWords(text) {
    const trimmed = (text || "").trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  }

  function isAsciiToken(text) {
    const stripped = (text || "").replace(/[\s\.,\-_"'!?()]/g, "");
    if (!stripped) return false;
    return /^[\x00-\x7F]+$/.test(stripped);
  }

  function buildSystemPrompt(language) {
    return `Respond in ${language} with HTML tags to improve readability.\n- Prioritize clarity and conciseness\n- Use bullet points when appropriate`;
  }

  function buildSummaryPrompt(selectedText, language) {
    return `Create a structured summary in ${language}:\n- Identify key themes and concepts\n- Extract 3-5 main points\n- Use nested <ul> lists for hierarchy\n- Keep bullets concise\n\nfor the following selected text:\n\n${selectedText}\n`;
  }

  function buildTranslationPrompt(selectedHTML, selectedText, language) {
    const content = (selectedHTML || selectedText || "").trim();
    return `Translate the following HTML content to ${language}:\n- Preserve original HTML formatting and structure\n- Maintain technical terms and names\n- Match formal/informal tone of source\n- Keep the same HTML tags and attributes\n\nOriginal HTML:\n\n${content}\n`;
  }

  function buildContextPrompt(selection) {
    const textBefore = (selection.textBefore || "").trim();
    const textAfter = (selection.textAfter || "").trim();
    const selectedText = (selection.selectedText || "").trim();
    const paragraphText = (selection.paragraphText || "").trim();

    if (!textBefore && !textAfter) {
      return paragraphText || selectedText;
    }

    return `# Context:\n## Before selected text:\n${textBefore || "None"}\n## Selected text:\n${selectedText}\n## After selected text:\n${textAfter || "None"}`;
  }

  function buildExplanationPrompt(selection, config) {
    const selectedText = (selection.selectedText || "").trim();
    const sampleSentenceLanguage = isAsciiToken(selectedText)
      ? "English"
      : config.language;
    const pinyinNote =
      config.language === "Chinese" ? " DO NOT add Pinyin for it." : "";
    const ipaNote =
      config.language === "Chinese" ? "" : " (with IPA if necessary)";
    const contextPrompt = buildContextPrompt(selection);

    return `Provide an explanation for the word: "${selectedText}${ipaNote}" in ${config.language} without commentary.${pinyinNote}

Use the context from the surrounding paragraph to inform your explanation when relevant:

${contextPrompt}

# Consider these scenarios:

## Names
If "${selectedText}" is a person's name, company name, or organization name, provide a brief description (e.g., who they are or what they do).

## Technical Terms
If "${selectedText}" is a technical term or jargon
- give a concise definition and explain.
- Some best practice of using it
- Explain how it works.
- No need example sentence for the technical term.

## Normal Words
- For any other word, explain its meaning and provide 1-2 example sentences with the word in ${sampleSentenceLanguage}.

# Format

- Output the words first, then the explanation, and then the example sentences in ${sampleSentenceLanguage} if necessary.
- No extra explanation
- Remember to using proper html format like <p> <b> <i> <a> <li> <ol> <ul> to improve readability.
`;
  }

  function buildPrompt(selection, config) {
    const selectedText = (selection.selectedText || "").trim();
    if (!selectedText) {
      throw new Error("No text selected");
    }

    const systemPrompt = buildSystemPrompt(config.language);
    const wordCount = countWords(selectedText);
    const isLongText =
      wordCount >= PROMPT_LIMITS.longWords ||
      selectedText.length >= PROMPT_LIMITS.longChars;

    if (isLongText) {
      return {
        prompt: buildSummaryPrompt(selectedText, config.language),
        systemPrompt,
      };
    }

    const isTranslation =
      wordCount >= PROMPT_LIMITS.translateWords ||
      selectedText.length >= PROMPT_LIMITS.translateChars;
    if (isTranslation) {
      return {
        prompt: buildTranslationPrompt(
          selection.selectedHTML,
          selectedText,
          config.language,
        ),
        systemPrompt,
      };
    }

    return {
      prompt: buildExplanationPrompt(selection, config),
      systemPrompt,
    };
  }

  // =========================
  // Selection helpers
  // =========================
  function getSelectionContext() {
    const getter =
      window.GetSelectionContext ||
      (window.SelectionUtils && window.SelectionUtils.GetSelectionContext);
    ensureDependency("GetSelectionContext", getter);
    return getter();
  }

  // =========================
  // Transport: GM_xmlhttpRequest to bypass CSP
  // =========================
  function canUseGMTransport() {
    return (
      typeof GM_xmlhttpRequest === "function" &&
      state.llm &&
      typeof state.llm.prepareRequestData === "function" &&
      typeof state.llm.prepareHeaders === "function" &&
      typeof state.llm.processStreamChunks === "function" &&
      state.llm.balancer &&
      typeof state.llm.balancer.choosePair === "function"
    );
  }

  function abortActiveRequest() {
    const active = state.activeRequest;
    if (!active || typeof active.abort !== "function") return false;
    state.abortedRequestId = active.id;
    try {
      active.abort();
    } catch (error) {
      console.warn("Failed to abort request:", error);
    }
    state.activeRequest = null;
    state.isProcessing = false;
    return true;
  }

  function askLLMWithGM({
    prompt,
    providerName,
    systemPrompt = "",
    model,
    apiKey,
    baseUrl,
    handler = null,
    timeout = 60000,
    requestId = null,
  }) {
    const normalizedProvider = providerName.toLowerCase();
    const trimmedKey = String(apiKey).trim();
    const trimmedBaseUrl = String(baseUrl).trim();

    let selectedKey;
    let selectedUrl;

    [selectedKey, selectedUrl] = state.llm.balancer.choosePair(
      trimmedKey,
      trimmedBaseUrl,
    );

    const { url, data } = state.llm.prepareRequestData(
      prompt,
      systemPrompt,
      model,
      normalizedProvider,
      selectedUrl,
    );
    const headers = {
      ...state.llm.prepareHeaders(normalizedProvider, selectedKey),
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
    };
    const apiKeyPreview = `${selectedKey.slice(0, 5)}...${selectedKey.slice(-4)}`;

    state.llm.logger.info(
      `[SmolLLM] GM Request: ${url} | model=${model} | provider=${normalizedProvider} | api_key=${apiKeyPreview} | prompt=${prompt.length}`,
    );

    state.llm.buffer = "";

    return new Promise((resolve, reject) => {
      let fullText = "";
      let lastIndex = 0;
      let streamingActive = false;
      let settled = false;
      const decoder = new TextDecoder();
      const isTampermonkey =
        typeof GM_info === "object" &&
        /tampermonkey/i.test(GM_info.scriptHandler || "");
      const useStreamResponse =
        isTampermonkey && typeof ReadableStream !== "undefined";

      const resolveOnce = (value) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };

      const rejectOnce = (error) => {
        if (settled) return;
        settled = true;
        reject(error);
      };

      const appendChunk = (chunk) => {
        const deltas = state.llm.processStreamChunks(chunk, normalizedProvider);
        for (const delta of deltas) {
          if (!delta) continue;
          fullText += delta;
          if (handler) handler(delta, fullText);
        }
      };

      const pumpResponseText = (text) => {
        if (!text) return;
        const chunk = text.slice(lastIndex);
        if (!chunk) return;
        lastIndex = text.length;
        appendChunk(chunk);
      };

      const startStreamReader = (stream) => {
        if (streamingActive) return;
        if (!stream || typeof stream.getReader !== "function") return;
        streamingActive = true;

        (async () => {
          const reader = stream.getReader();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) {
                appendChunk(decoder.decode(value, { stream: true }));
              }
            }
            if (state.llm.buffer) {
              appendChunk("\n");
            }
            resolveOnce(fullText);
          } catch (error) {
            rejectOnce(error);
          }
        })();
      };

      const requestOptions = {
        method: "POST",
        url,
        headers,
        data: JSON.stringify(data),
        ...(useStreamResponse ? { responseType: "stream" } : {}),
        timeout,
        onloadstart: (response) => {
          startStreamReader(response.response);
        },
        onprogress: (event) => {
          if (streamingActive) return;
          pumpResponseText(event.responseText || "");
        },
        onreadystatechange: (response) => {
          if (streamingActive) return;
          startStreamReader(response.response);
          if (response.readyState !== 3) return;
          pumpResponseText(response.responseText || "");
        },
        onload: (response) => {
          if (streamingActive) return;
          if (response.status < 200 || response.status >= 300) {
            rejectOnce(
              new Error(
                `HTTP error ${response.status}: ${response.responseText || response.statusText || "Unknown error"}`,
              ),
            );
            return;
          }

          pumpResponseText(response.responseText || "");
          if (state.llm.buffer) {
            appendChunk("\n");
          }
          resolveOnce(fullText);
        },
        onerror: () => {
          rejectOnce(new Error("Network error during GM_xmlhttpRequest"));
        },
        ontimeout: () => {
          rejectOnce(new Error(`Request timed out after ${timeout}ms`));
        },
        onabort: () => {
          rejectOnce(new Error("Request aborted"));
        },
      };

      const requestHandle = GM_xmlhttpRequest(requestOptions);
      if (requestId !== null) {
        state.activeRequest = {
          id: requestId,
          abort: () => {
            if (requestHandle && typeof requestHandle.abort === "function") {
              requestHandle.abort();
            }
          },
        };
      }
    });
  }

  // =========================
  // LLM call path
  // =========================
  async function callLLM(prompt, systemPrompt, progressCallback, requestId) {
    const apiKey = (state.config.apiKey || "").trim();
    const baseUrl = (state.config.baseUrl || "").trim();
    const model = (state.config.model || "").trim();
    const provider = (state.config.provider || "").trim();

    if (!apiKey || apiKey === "fake") {
      throw new Error(
        "Missing API key. Open settings and set a valid API key.",
      );
    }
    if (!baseUrl) {
      throw new Error(
        "Missing base URL. Open settings and set a valid API base URL.",
      );
    }
    if (!model) {
      throw new Error("Missing model. Open settings and set a valid model.");
    }
    if (!provider) {
      throw new Error(
        "Missing provider. Open settings and set a valid provider.",
      );
    }

    const request = {
      prompt,
      systemPrompt,
      model,
      apiKey,
      baseUrl,
      providerName: provider,
      handler: progressCallback,
      timeout: 60000,
    };

    if (canUseGMTransport()) {
      return askLLMWithGM({ ...request, requestId });
    }

    return state.llm.askLLM(request);
  }

  // =========================
  // UI flow
  // =========================
  async function runExplainer(selectionContext) {
    if (state.isProcessing) {
      if (!abortActiveRequest()) return;
    }
    state.isProcessing = true;

    const requestId = (state.requestSeq += 1);
    const popup = window.TextExplainerUI.openPopup({
      isTouch: state.isTouch,
      isDark: window.TextExplainerUI.isPageDarkMode(),
    });

    window.TextExplainerUI.setLoading(popup, true);

    let responseText = "";

    try {
      const { prompt, systemPrompt } = buildPrompt(
        selectionContext,
        state.config,
      );

      const fullResponse = await callLLM(
        prompt,
        systemPrompt,
        (chunk, currentFullText) => {
          responseText = currentFullText || responseText + chunk;
          window.TextExplainerUI.setLoading(popup, false);
          window.TextExplainerUI.updateContent(popup, responseText);
        },
        requestId,
      );

      if (fullResponse && fullResponse.trim()) {
        window.TextExplainerUI.setLoading(popup, false);
        window.TextExplainerUI.updateContent(popup, fullResponse);
      } else if (responseText && responseText.trim()) {
        window.TextExplainerUI.setLoading(popup, false);
        window.TextExplainerUI.updateContent(popup, responseText);
      } else {
        window.TextExplainerUI.showError(
          popup,
          "No response received from the model.",
        );
      }
    } catch (error) {
      if (state.abortedRequestId === requestId) {
        return;
      }
      window.TextExplainerUI.showError(
        popup,
        error.message || "Error processing request",
      );
      console.error("Text Explainer error:", error);
      throw error;
    } finally {
      if (state.activeRequest && state.activeRequest.id === requestId) {
        state.activeRequest = null;
      }
      if (state.abortedRequestId === requestId) {
        state.abortedRequestId = null;
      }
      state.isProcessing = false;
    }
  }

  // =========================
  // Input handlers
  // =========================
  function handleKeyPress(event) {
    if (isEditableTarget(event.target)) return;

    const shortcut = state.config.shortcut || DEFAULT_SHORTCUT;
    if (!isShortcutMatch(event, shortcut)) return;

    event.preventDefault();

    const selectionContext = getSelectionContext();
    if (!selectionContext || !selectionContext.selectedText) {
      const popup = window.TextExplainerUI.openPopup({
        isTouch: state.isTouch,
        isDark: window.TextExplainerUI.isPageDarkMode(),
      });
      window.TextExplainerUI.showError(popup, "No text selected");
      return;
    }

    runExplainer(selectionContext);
  }

  function isShortcutMatch(event, shortcutConfig) {
    if (
      event.ctrlKey !== !!shortcutConfig.ctrlKey ||
      event.altKey !== !!shortcutConfig.altKey ||
      event.shiftKey !== !!shortcutConfig.shiftKey ||
      event.metaKey !== !!shortcutConfig.metaKey
    ) {
      return false;
    }

    const key = shortcutConfig.key.toLowerCase();

    if (event.key.toLowerCase() === key) {
      return true;
    }

    if (
      key.length === 1 &&
      /^[a-z]$/.test(key) &&
      event.code === `Key${key.toUpperCase()}`
    ) {
      return true;
    }

    if (shortcutConfig.altKey && MAC_OPTION_KEY_MAP[key] === event.key) {
      return true;
    }

    return false;
  }

  // =========================
  // Touch + floating button
  // =========================
  function handleSelectionChange() {
    if (!state.isTouch || !state.floatingButton) return;
    if (state.isProcessing) return;

    const hasSelection = window.TextExplainerUI.showFloatingButton(
      state.floatingButton,
    );
    if (!hasSelection) {
      window.TextExplainerUI.hideFloatingButton(state.floatingButton);
    }
  }

  function handleTouchEnd() {
    if (!state.isTouch) return;
    setTimeout(handleSelectionChange, 100);
  }

  function removeSelectionHandlers() {
    if (!state.selectionHandlers) return;
    document.removeEventListener(
      "selectionchange",
      state.selectionHandlers.onSelectionChange,
    );
    document.removeEventListener(
      "touchend",
      state.selectionHandlers.onTouchEnd,
    );
    state.selectionHandlers = null;
  }

  function addSelectionHandlers() {
    if (state.selectionHandlers) return;
    state.selectionHandlers = {
      onSelectionChange: handleSelectionChange,
      onTouchEnd: handleTouchEnd,
    };
    document.addEventListener(
      "selectionchange",
      state.selectionHandlers.onSelectionChange,
    );
    document.addEventListener("touchend", state.selectionHandlers.onTouchEnd);
  }

  function handleFloatingButtonAction() {
    if (state.isProcessing) {
      if (!abortActiveRequest()) return;
    }

    const selectionContext = getSelectionContext();
    if (!selectionContext || !selectionContext.selectedText) {
      throw new Error("No valid selection to process");
    }

    window.TextExplainerUI.hideFloatingButton(state.floatingButton);
    window.getSelection().removeAllRanges();
    runExplainer(selectionContext);
  }

  function resetFloatingButton() {
    removeSelectionHandlers();
    if (state.floatingButton) {
      state.floatingButton.remove();
      state.floatingButton = null;
    }

    if (!state.isTouch) return;
    if (!state.config.floatingButton.enabled) return;

    state.floatingButton = window.TextExplainerUI.createFloatingButton({
      size: state.config.floatingButton.size,
      onTrigger: handleFloatingButtonAction,
      label: "💬",
    });

    addSelectionHandlers();
    handleSelectionChange();
  }

  function onSettingsChanged(updatedConfig) {
    const inlineConfig = getInlineConfig();
    state.config = normalizeConfig(mergeConfig(updatedConfig, inlineConfig));
    resetFloatingButton();
  }

  function init() {
    ensureDependency("TextExplainerSettings", window.TextExplainerSettings);
    ensureDependency("SmolLLM", window.SmolLLM);
    ensureDependency("TextExplainerUI", window.TextExplainerUI);

    const inlineConfig = getInlineConfig();
    ensureGMCompat();

    state.isTouch = window.TextExplainerUI.isTouchDevice();
    state.settingsManager = new window.TextExplainerSettings(
      inlineConfig || {},
    );
    if (inlineConfig) {
      state.settingsManager.update(inlineConfig);
    }
    state.config = normalizeConfig(state.settingsManager.getAll());
    state.llm = new window.SmolLLM();

    window.TextExplainerUI.ensureStyles();

    if (typeof GM_registerMenuCommand === "function") {
      GM_registerMenuCommand("Text Explainer Settings", () => {
        state.settingsManager.openDialog(onSettingsChanged);
      });
    } else if (!inlineConfig) {
      throw new Error(
        "GM_registerMenuCommand missing. Set INLINE_CONFIG or use Tampermonkey.",
      );
    } else {
      console.info(
        "GM_registerMenuCommand missing; edit INLINE_CONFIG to change settings.",
      );
    }

    document.addEventListener("keydown", handleKeyPress);

    resetFloatingButton();

    console.info(
      `Text Explainer initialized. Language: ${state.config.language}`,
    );
  }

  init();
})();

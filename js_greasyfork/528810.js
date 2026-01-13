// ==UserScript==
// @name         Text Explainer
// @namespace    http://tampermonkey.net/
// @version      0.3.1
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
// @require      https://update.greasyfork.org/scripts/528822/1732959/Selection%20Context.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528810/Text%20Explainer.user.js
// @updateURL https://update.greasyfork.org/scripts/528810/Text%20Explainer.meta.js
// ==/UserScript==

(function () {
  "use strict";

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
    floatingButton: null,
    selectionHandlers: null,
    isTouch: false,
  };

  function ensureDependency(name, value) {
    if (!value) {
      throw new Error(`${name} is required but not available`);
    }
  }

  function ensureGMCompat() {
    if (typeof GM_addStyle !== "function") {
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

    if (typeof GM_registerMenuCommand !== "function") {
      throw new Error("GM_registerMenuCommand is required but not available");
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

  function isEditableTarget(target) {
    if (!target) return false;
    if (target.isContentEditable) return true;
    const tag = target.tagName;
    if (!tag) return false;
    return ["INPUT", "TEXTAREA", "SELECT"].includes(tag);
  }

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

  function getSelectionContext() {
    const getter =
      window.GetSelectionContext ||
      (window.SelectionUtils && window.SelectionUtils.GetSelectionContext);
    ensureDependency("GetSelectionContext", getter);
    return getter();
  }

  async function callLLM(prompt, systemPrompt, progressCallback) {
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

    return state.llm.askLLM({
      prompt,
      systemPrompt,
      model,
      apiKey,
      baseUrl,
      providerName: provider,
      handler: progressCallback,
      timeout: 60000,
    });
  }

  async function runExplainer(selectionContext) {
    if (state.isProcessing) return;
    state.isProcessing = true;

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
      window.TextExplainerUI.showError(
        popup,
        error.message || "Error processing request",
      );
      console.error("Text Explainer error:", error);
      throw error;
    } finally {
      state.isProcessing = false;
    }
  }

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
    if (state.isProcessing) return;

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
    state.config = normalizeConfig(updatedConfig);
    resetFloatingButton();
  }

  function init() {
    ensureDependency("TextExplainerSettings", window.TextExplainerSettings);
    ensureDependency("SmolLLM", window.SmolLLM);
    ensureDependency("TextExplainerUI", window.TextExplainerUI);

    ensureGMCompat();

    state.isTouch = window.TextExplainerUI.isTouchDevice();
    state.settingsManager = new window.TextExplainerSettings();
    state.config = normalizeConfig(state.settingsManager.getAll());
    state.llm = new window.SmolLLM();

    window.TextExplainerUI.ensureStyles();

    GM_registerMenuCommand("Text Explainer Settings", () => {
      state.settingsManager.openDialog(onSettingsChanged);
    });

    document.addEventListener("keydown", handleKeyPress);

    resetFloatingButton();

    console.info(
      `Text Explainer initialized. Language: ${state.config.language}`,
    );
  }

  init();
})();

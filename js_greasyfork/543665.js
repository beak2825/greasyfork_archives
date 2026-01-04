// ==UserScript==
// @name         discord-translate
// @namespace    http://tampermonkey.net/
// @version      2025-07-01
// @description  Translation utilities for discord.
// @author       Patrick Learn
// @match        https://discord.com/channels/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543665/discord-translate.user.js
// @updateURL https://update.greasyfork.org/scripts/543665/discord-translate.meta.js
// ==/UserScript==

(async () => {
  "use strict";

  const CONFIG = {
    async load() {
      this.translationEngine = await GM_getValue("translationEngine", "llm");
      this.llmApiKey = await GM_getValue("llmApiKey", "YOUR_API_KEY");
      this.llmApiEndpoint = await GM_getValue(
        "llmApiEndpoint",
        "https://api.deepseek.com/v1/chat/completions"
      );
      this.llmModel = await GM_getValue("llmModel", "deepseek-chat");
      this.llmChannelInstructions = await GM_getValue(
        "llmChannelInstructions",
        "You are a professional translator. Translate to English. Do not use markdown. Keep it minimal. You may include some translation notes. Do not ask me questions."
      );
      this.llmInputBarInstructions = await GM_getValue(
        "llmInputBarInstructions",
        "You are a professional translator. Translate to Danish. Do not include anything extra, just write it as it should be."
      );
      this.libreTranslateEndpoint = await GM_getValue(
        "libreTranslateEndpoint",
        "https://libretranslate.com/translate"
      );
      this.libreChannelFromLang = await GM_getValue("libreChannelFromLang", "auto");
      this.libreChannelToLang = await GM_getValue("libreChannelToLang", "en");
      this.libreInputBarFromLang = await GM_getValue("libreInputBarFromLang", "auto");
      this.libreInputBarToLang = await GM_getValue("libreInputBarToLang", "da");
      this.deeplApiKey = await GM_getValue("deeplApiKey", "YOUR_API_KEY");
      this.deeplApiEndpoint = await GM_getValue(
        "deeplApiEndpoint",
        "https://api.deepl.com/v2/translate"
      );
      this.deeplChannelFromLang = await GM_getValue("deeplChannelFromLang", "auto");
      this.deeplChannelToLang = await GM_getValue("deeplChannelToLang", "EN");
      this.deeplInputBarFromLang = await GM_getValue("deeplInputBarFromLang", "auto");
      this.deeplInputBarToLang = await GM_getValue("deeplInputBarToLang", "DA");
    },
    async save(key, value) {
      await GM_setValue(key, value);
      this[key] = value;
    },
  };

  const Translator = (() => {
    const MODE = Object.freeze({ CHANNEL: 0, INPUTBAR: 1 });

    function gmRequest({ url, method = "POST", headers = {}, body }) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method,
          url,
          headers,
          data: body,
          onload: resolve,
          onerror: reject,
        });
      });
    }

    async function translateWithLLM(text, mode) {
      const url = CONFIG.llmApiEndpoint;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CONFIG.llmApiKey}`,
      };

      const instructions =
        mode === Translator.MODE.CHANNEL
          ? CONFIG.llmChannelInstructions
          : CONFIG.llmInputBarInstructions;

      const body = JSON.stringify({
        model: CONFIG.llmModel,
        messages: [
          { role: "system", content: instructions },
          { role: "user", content: text },
        ],
        temperature: 0.2,
      });

      const resp = await gmRequest({ url, headers, body });
      if (resp.status < 200 || resp.status >= 300) {
        throw new Error(`LLM HTTP ${resp.status}`);
      }

      const data = JSON.parse(resp.responseText);
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Unexpected LLM response");
      return content.trim();
    }

    async function translateWithLibre(text, mode) {
      const url = CONFIG.libreTranslateEndpoint;
      const headers = { "Content-Type": "application/json" };

      const source =
        mode === Translator.MODE.CHANNEL
          ? CONFIG.libreChannelFromLang
          : CONFIG.libreInputBarFromLang;

      const target =
        mode === Translator.MODE.CHANNEL
          ? CONFIG.libreChannelToLang
          : CONFIG.libreInputBarToLang;

      const body = JSON.stringify({
        q: text,
        source,
        target,
        format: "text",
      });

      const resp = await gmRequest({ url, headers, body });
      if (resp.status < 200 || resp.status >= 300) {
        throw new Error(`Libre HTTP ${resp.status}`);
      }

      const data = JSON.parse(resp.responseText);
      if (!data.translatedText) throw new Error("Unexpected Libre response");
      return data.translatedText.trim();
    }

    async function translateWithDeepL(text, mode) {
      const url = CONFIG.deeplApiEndpoint;

      const source =
        mode === Translator.MODE.CHANNEL
          ? CONFIG.deeplChannelFromLang
          : CONFIG.deeplInputBarFromLang;

      const target =
        mode === Translator.MODE.CHANNEL
          ? CONFIG.deeplChannelToLang
          : CONFIG.deeplInputBarToLang;

      const body = JSON.stringify({
        text: [text],
        target_lang: target,
        ...(source && source.toLowerCase() !== "auto" ? { source_lang: source } : {}),
      });

      const headers = {
        "Content-Type": "application/json",
        Authorization: `DeepL-Auth-Key ${CONFIG.deeplApiKey}`,
      };

      console.log("DeepL request payload:", JSON.parse(body));
      console.log("DeepL request headers:", headers);

      const resp = await gmRequest({ url, method: "POST", headers, body });
      if (resp.status < 200 || resp.status >= 300) {
        throw new Error(`DeepL HTTP ${resp.status}`);
      }

      const data = JSON.parse(resp.responseText);
      if (!data.translations || !data.translations[0]?.text) {
        throw new Error("Unexpected DeepL response");
      }
      return data.translations[0].text.trim();
    }

    async function translate(text, mode = Translator.MODE.INPUTBAR) {
      if (mode !== Translator.MODE.CHANNEL && mode !== Translator.MODE.INPUTBAR) {
        throw new Error(`Invalid mode: ${mode}`);
      }

      try {
        switch (CONFIG.translationEngine) {
          case "llm":
            return await translateWithLLM(text, mode);

          case "libre":
            return await translateWithLibre(text, mode);

          case "deepl":
            return await translateWithDeepL(text, mode);

          default:
            throw new Error(`Unknown engine: ${CONFIG.translationEngine}`);
        }
      } catch (err) {
        console.error("Translation failed:", err);
        alert(`Translation failed: ${err.message}`);
        throw err;
      }
    }

    return { translate, MODE };
  })();

  const UI = (() => {
    const translateSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="24" height="24" fill="currentColor" viewBox="0 0 512 512">
                <path d="M478.33,433.6l-90-218a22,22,0,0,0-40.67,0l-90,218a22,22,0,1,0,40.67,16.79L316.66,406H419.33l18.33,44.39A22,22,0,0,0,458,464a22,22,0,0,0,20.32-30.4ZM334.83,362,368,281.65,401.17,362Z"/>
                <path d="M267.84,342.92a22,22,0,0,0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73,39.65-53.68,62.11-114.75,71.27-143.49H330a22,22,0,0,0,0-44H214V70a22,22,0,0,0-44,0V90H54a22,22,0,0,0,0,44H251.25c-9.52,26.95-27.05,69.5-53.79,108.36-31.41-41.68-43.08-68.65-43.17-68.87a22,22,0,0,0-40.58,17c.58,1.38,14.55,34.23,52.86,83.93.92,1.19,1.83,2.35,2.74,3.51-39.24,44.35-77.74,71.86-93.85,80.74a22,22,0,1,0,21.07,38.63c2.16-1.18,48.6-26.89,101.63-85.59,22.52,24.08,38,35.44,38.93,36.1a22,22,0,0,0,30.75-4.9Z"/>
            </svg>
        `;

    function openConfigPanel() {
      if (document.getElementById("config-panel")) return;

      const panel = document.createElement("div");
      panel.id = "config-panel";
      panel.style.position = "fixed";
      panel.style.top = "50px";
      panel.style.right = "50px";
      panel.style.zIndex = "9999";
      panel.style.background = "#2f3136";
      panel.style.color = "#fff";
      panel.style.padding = "20px";
      panel.style.border = "1px solid #555";
      panel.style.borderRadius = "8px";
      panel.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
      panel.style.width = "400px";

      panel.innerHTML = `
                <label>Translation Engine:<br>
                <select id="cfg-translationEngine" style="width:100%">
                    <option value="llm" ${
                      CONFIG.translationEngine === "llm" ? "selected" : ""
                    }>LLM</option>
                    <option value="libre" ${
                      CONFIG.translationEngine === "libre" ? "selected" : ""
                    }>LibreTranslate</option>
                    <option value="deepl" ${
                      CONFIG.translationEngine === "deepl" ? "selected" : ""
                    }>DeepL</option>
                </select>
                </label><br><br>
                <hr style="border-color:#555;"><br>
                <div id="config-section"></div>
                <button id="cfg-save" style="margin-right:10px">Save</button>
                <button id="cfg-close">Close</button>
            `;

      document.body.appendChild(panel);

      const configSection = panel.querySelector("#config-section");

      const llmConfig = `
                <label><strong>API Configuration:</strong></label><br><br>
                <label>API Key:<br>
                    <input type="password" id="cfg-llmApiKey" value="${CONFIG.llmApiKey}" style="width:100%">
                </label><br><br>
                <label>Endpoint:<br>
                    <input type="text" id="cfg-llmApiEndpoint" value="${CONFIG.llmApiEndpoint}" style="width:100%">
                </label><br><br>
                <label>Model:<br>
                    <input type="text" id="cfg-llmModel" value="${CONFIG.llmModel}" style="width:100%">
                </label><br><br>
                <hr style="border-color:#555;"><br>
                <label><strong>Instructions:</strong></label><br><br>
                <label>Channel Instructions (Reading):<br>
                    <textarea id="cfg-llmChannelInstructions" style="width:100%" rows="2">${CONFIG.llmChannelInstructions}</textarea>
                </label><br><br>
                <label>Input Bar Instructions (Writing):<br>
                    <textarea id="cfg-llmInputBarInstructions" style="width:100%" rows="2">${CONFIG.llmInputBarInstructions}</textarea>
                </label><br><br>
            `;

      const libreConfig = `
                <label><strong>Endpoint:</strong></label><br><br>
                <label>Endpoint URL:<br>
                    <input type="text" id="cfg-libreTranslateEndpoint" value="${CONFIG.libreTranslateEndpoint}" style="width:100%">
                </label><br><br>
                <hr style="border-color:#555;"><br>
                <label><strong>Channel Translation (Reading):</strong></label><br><br>
                <label>Source Language:<br>
                    <input type="text" id="cfg-libreChannelFromLang" value="${CONFIG.libreChannelFromLang}" style="width:100%">
                </label><br><br>
                <label>Target Language:<br>
                    <input type="text" id="cfg-libreChannelToLang" value="${CONFIG.libreChannelToLang}" style="width:100%">
                </label><br><br>
                <hr style="border-color:#555;"><br>
                <label><strong>Input Bar Translation (Writing):</strong></label><br><br>
                <label>Source Language:<br>
                    <input type="text" id="cfg-libreInputBarFromLang" value="${CONFIG.libreInputBarFromLang}" style="width:100%">
                </label><br><br>
                <label>Target Language:<br>
                    <input type="text" id="cfg-libreInputBarToLang" value="${CONFIG.libreInputBarToLang}" style="width:100%">
                </label><br><br>
            `;

      const deeplConfig = `
                <label><strong>API Configuration:</strong></label><br><br>
                <label>DeepL API Key:<br>
                    <input type="password" id="cfg-deeplApiKey" value="${CONFIG.deeplApiKey}" style="width:100%">
                </label><br><br>
                <label>DeepL Endpoint:<br>
                    <input type="text" id="cfg-deeplApiEndpoint" value="${CONFIG.deeplApiEndpoint}" style="width:100%">
                </label><br><br>
                <hr style="border-color:#555;"><br>
                <label><strong>Channel Translation (Reading):</strong></label><br><br>
                <label>Source Language:<br>
                    <input type="text" id="cfg-deeplChannelFromLang" value="${CONFIG.deeplChannelFromLang}" style="width:100%">
                </label><br><br>
                <label>Target Language:<br>
                    <input type="text" id="cfg-deeplChannelToLang" value="${CONFIG.deeplChannelToLang}" style="width:100%">
                </label><br><br>
                <hr style="border-color:#555;"><br>
                <label><strong>Input Bar Translation (Writing):</strong></label><br><br>
                <label>Source Language:<br>
                    <input type="text" id="cfg-deeplInputBarFromLang" value="${CONFIG.deeplInputBarFromLang}" style="width:100%">
                </label><br><br>
                <label>Target Language:<br>
                    <input type="text" id="cfg-deeplInputBarToLang" value="${CONFIG.deeplInputBarToLang}" style="width:100%">
                </label><br><br>
            `;

      function updateConfigSection() {
        const selectedEngine = document.getElementById("cfg-translationEngine").value;
        if (selectedEngine === "llm") {
          configSection.innerHTML = llmConfig;
        } else if (selectedEngine === "libre") {
          configSection.innerHTML = libreConfig;
        } else if (selectedEngine === "deepl") {
          configSection.innerHTML = deeplConfig;
        } else {
          configSection.innerHTML = "<p>Unsupported engine selected.</p>";
        }
      }

      updateConfigSection();

      document
        .getElementById("cfg-translationEngine")
        .addEventListener("change", updateConfigSection);

      document.getElementById("cfg-save").addEventListener("click", async () => {
        const selectedEngine = document.getElementById("cfg-translationEngine").value;
        await CONFIG.save("translationEngine", selectedEngine);

        if (selectedEngine === "llm") {
          await CONFIG.save(
            "llmApiKey",
            document.getElementById("cfg-llmApiKey").value
          );
          await CONFIG.save(
            "llmApiEndpoint",
            document.getElementById("cfg-llmApiEndpoint").value
          );
          await CONFIG.save("llmModel", document.getElementById("cfg-llmModel").value);
          await CONFIG.save(
            "llmChannelInstructions",
            document.getElementById("cfg-llmChannelInstructions").value
          );
          await CONFIG.save(
            "llmInputBarInstructions",
            document.getElementById("cfg-llmInputBarInstructions").value
          );
        } else if (selectedEngine === "libre") {
          await CONFIG.save(
            "libreTranslateEndpoint",
            document.getElementById("cfg-libreTranslateEndpoint").value
          );
          await CONFIG.save(
            "libreChannelFromLang",
            document.getElementById("cfg-libreChannelFromLang").value
          );
          await CONFIG.save(
            "libreChannelToLang",
            document.getElementById("cfg-libreChannelToLang").value
          );
          await CONFIG.save(
            "libreInputBarFromLang",
            document.getElementById("cfg-libreInputBarFromLang").value
          );
          await CONFIG.save(
            "libreInputBarToLang",
            document.getElementById("cfg-libreInputBarToLang").value
          );
        } else if (selectedEngine === "deepl") {
          await CONFIG.save(
            "deeplApiKey",
            document.getElementById("cfg-deeplApiKey").value
          );
          await CONFIG.save(
            "deeplApiEndpoint",
            document.getElementById("cfg-deeplApiEndpoint").value
          );
          await CONFIG.save(
            "deeplChannelFromLang",
            document.getElementById("cfg-deeplChannelFromLang").value
          );
          await CONFIG.save(
            "deeplChannelToLang",
            document.getElementById("cfg-deeplChannelToLang").value
          );
          await CONFIG.save(
            "deeplInputBarFromLang",
            document.getElementById("cfg-deeplInputBarFromLang").value
          );
          await CONFIG.save(
            "deeplInputBarToLang",
            document.getElementById("cfg-deeplInputBarToLang").value
          );
        }

        panel.remove();
      });

      document
        .getElementById("cfg-close")
        .addEventListener("click", () => panel.remove());
    }

    function createHeaderButton() {
      const button = document.createElement("button");
      button.id = "my-custom-header-button";
      button.style.background = "transparent";
      button.style.border = "none";
      button.style.cursor = "pointer";
      button.style.padding = "4px";
      button.style.display = "flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "center";
      button.style.color = "#ffffff";
      button.innerHTML = `
                <div class="contents__201d5 button__24af7 button__74017">
                    <div class="buttonWrapper__24af7">
                        ${translateSVG}
                    </div>
                </div>
            `;
      button.addEventListener("click", () => {
        openConfigPanel();
      });
      return button;
    }

    function createMessageButton() {
      const button = document.createElement("div");
      button.classList.add("hoverBarButton_f84418", "button_f7ecac");
      button.setAttribute("aria-label", "Translate message");
      button.setAttribute("role", "button");
      button.setAttribute("tabindex", "0");
      button.innerHTML = `
                <div class="contents__201d5 button__24af7 button__74017">
                    <div class="buttonWrapper__24af7">
                        ${translateSVG}
                    </div>
                </div>
            `;
      button.addEventListener("click", async () => {
        const messageContainer = button.closest(".message__5126c");
        if (!messageContainer) {
          alert("Could not find the message container.");
          return;
        }

        const contentElements = messageContainer.querySelectorAll(
          ".messageContent_c19a55"
        );
        if (contentElements.length === 0) {
          alert("Could not find any message text.");
          return;
        }

        const contentElement = contentElements[contentElements.length - 1];
        const textToTranslate = contentElement.innerText || contentElement.textContent;
        if (!textToTranslate) {
          alert("No text found to translate.");
          return;
        }

        console.log("Translating message text:", textToTranslate);

        const originalButtonHTML = button.innerHTML;
        button.innerHTML = `<svg width="24" height="24" viewBox="0 0 100 100" fill="#9aff99" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="35" stroke="currentColor" stroke-width="10" fill="none" stroke-dasharray="164.93361431346415" stroke-dashoffset="164.93361431346415">
                        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"/>
                        <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1s" values="164.93361431346415;0" keyTimes="0;1"/>
                    </circle>
                </svg>`;

        try {
          const translated = await Translator.translate(
            textToTranslate,
            Translator.MODE.CHANNEL
          );

          if (translated) {
            const oldTranslation = messageContainer.querySelector(".my-translation");
            if (oldTranslation) oldTranslation.remove();

            const separator = document.createElement("div");
            separator.className = "my-translation-separator";
            separator.style.marginTop = "5px";
            separator.style.borderTop = "1px dashed rgba(255, 255, 255, 0.2)";
            separator.style.height = "1px";
            separator.style.width = "100%";

            const translationDiv = document.createElement("div");
            translationDiv.className = "my-translation";
            translationDiv.style.marginTop = "5px";
            translationDiv.style.opacity = "0.9";
            translationDiv.style.color = "#9aff99";
            translationDiv.innerText = translated;

            contentElement.appendChild(separator);
            contentElement.appendChild(translationDiv);
          }
        } catch (error) {
          console.error("Translation failed:", error);
        } finally {
          button.innerHTML = originalButtonHTML;
        }
      });

      return button;
    }

    function createInputBarButton() {
      const button = document.createElement("button");
      button.id = "my-custom-input-button";
      button.type = "button";
      button.setAttribute("aria-label", "Translate input");
      button.className = "button__201d5 lookBlank__201d5 colorBrand__201d5 grow__201d5";
      button.style.display = "flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "center";
      button.style.background = "transparent";
      button.style.border = "none";
      button.style.cursor = "pointer";
      button.style.padding = "4px";

      button.innerHTML = `
                <div class="contents__201d5 button__24af7 button__74017">
                    <div class="buttonWrapper__24af7">
                        ${translateSVG}
                    </div>
                </div>
            `;

      button.addEventListener("click", async () => {
        const textArea = document.querySelector(".textArea__74017");
        if (!textArea) {
          alert("No text area found.");
          return;
        }

        const currentText = textArea.value || textArea.textContent;
        if (!currentText) {
          alert("No text to translate!");
          return;
        }

        console.log("Translating input text:", currentText);

        const originalButtonHTML = button.innerHTML;
        button.innerHTML = `<svg width="24" height="24" viewBox="0 0 100 100" fill="#9aff99" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="35" stroke="#ffff" stroke-width="10" fill="none" stroke-dasharray="164.93361431346415" stroke-dashoffset="164.93361431346415">
                        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"/>
                        <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1s" values="164.93361431346415;0" keyTimes="0;1"/>
                    </circle>
                </svg>`;

        try {
          const translated = await Translator.translate(
            currentText,
            Translator.MODE.INPUTBAR
          );

          if (translated) {
            try {
              await navigator.clipboard.writeText(translated);
              const notification = document.createElement("div");
              notification.innerText = "Translation copied! Press Ctrl+V to paste.";
              notification.style.position = "fixed";
              notification.style.bottom = "20px";
              notification.style.right = "20px";
              notification.style.background = "#2f3136";
              notification.style.color = "#fff";
              notification.style.padding = "10px 15px";
              notification.style.borderRadius = "6px";
              notification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.4)";
              notification.style.zIndex = "9999";
              document.body.appendChild(notification);

              setTimeout(() => {
                notification.remove();
              }, 3000);
            } catch (error) {
              console.error("Clipboard copy failed:", error);
              alert("Failed to copy translation. Please try manually.");
            }
          }
        } catch (error) {
          console.error("Translation failed:", error);
        } finally {
          button.innerHTML = originalButtonHTML;
        }
      });

      return button;
    }

    function watchMessages() {
      const observer = new MutationObserver(() => {
        // Channel header
        const header = document.querySelector(
          'section[aria-label="Channel header"] .toolbar__9293f'
        );
        if (header && !document.getElementById("my-custom-header-button")) {
          header.appendChild(createHeaderButton());
        }

        // Message hover toolbars
        const buttonsContainers = document.querySelectorAll(
          ".buttonsInner__5126c:not(.has-translate-button)"
        );
        buttonsContainers.forEach((container) => {
          container.classList.add("has-translate-button");
          const messageButton = createMessageButton();

          const separators = container.querySelectorAll(".separator_f84418");
          const lastSeparator = separators[separators.length - 1];

          container.insertBefore(
            messageButton,
            lastSeparator ? lastSeparator.nextSibling : null
          );
        });

        // Input bar
        const inputBarButtons = document.querySelector(".buttons__74017");
        if (inputBarButtons && !document.getElementById("my-custom-input-button")) {
          const inputButton = createInputBarButton();
          if (inputBarButtons.firstChild) {
            inputBarButtons.insertBefore(inputButton, inputBarButtons.firstChild);
          } else {
            inputBarButtons.appendChild(inputButton);
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
      watchMessages();
    }

    return { init };
  })();

  await CONFIG.load();
  UI.init();
})();

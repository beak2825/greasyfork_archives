// ==UserScript==
// @name         SAP-Gen-AI-Formatter-Ext
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Format SAP GenAI Model
// @author       Anusha Lomada
// @match        https://sapit-core-playground-vole.ai-launchpad.prod.eu-central-1.aws.apps.ml.hana.ondemand.com/aic/index.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ondemand.com
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-abap.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-autohotkey.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-awk.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-batch.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-csharp.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-css-extras.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-csv.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-git.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-http.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-icon.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-ini.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-java.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-js-extras.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-powershell.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-qml.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-rest.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/4.3.0/marked.min.js
// @resource     prismCss https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/531127/SAP-Gen-AI-Formatter-Ext.user.js
// @updateURL https://update.greasyfork.org/scripts/531127/SAP-Gen-AI-Formatter-Ext.meta.js
// ==/UserScript==
// ====================== User Configuration -===========================
/* Configure your favorite AI Model */
const defaultModelName = "GPT-4o";
const defaultModelVersion = "2024-08-06 (latest)";

const defaultchatContext = 10;

// ===================Dont Modify Below ===============================

const configBtnId = "__xmlview0--settingsButton";
const configBtnSelector = `#${configBtnId}`;

const settingSaveBtnSel = "#SaveBtn";
const modelListDropdownId = "inuptField-content";
const modelListDropdownSel = `#${modelListDropdownId}`;

const defaultVersionInternal = `Version: ${defaultModelVersion}`;
const modelTileClassName = "sapFGLIWrapper"; //can be used to list of model loaded
const modelTileMinCount = 10;

const modelTileContainerId = "ModelLibraryUi--0--viewContainerPlaceholder"; // Contains all Tiles
const modelTileContainerSel = `#${modelTileContainerId}`;

const chatContextTabId = "__filter1";
const chatContextTabSel = `#${chatContextTabId}`;

// ================Markdown Formatting Section============================
// Msg Classes - Needs to be converted
const markMsgSel = ".sapMText.sapUiSelectable.sapMTextMaxWidth";

const chatBoxContainerId = "__xmlview0--Chats";
const chatBoxContainerSel = `#${chatBoxContainerId}`;

//=======================================================================

class MarkdownFormatter {
  #delay = (ms) => new Promise((res) => setTimeout(res, ms));

  async process() {
    // Wait for Body to load
    await this.#waitForDocumentBody(); // Wait for Document Body
    return this.#waitForElm(configBtnSelector) // Wait for Config Button
      .then(() => this.#loadModelSettings()) // Click the Button and Wait for Popup
      .then(() => this.#displayModelList()) // Click the Model Dropdown list
      .then(() =>
        this.#waitForTilesLoaded(modelTileClassName, modelTileMinCount)
      ) // Wait for the Model Tiles to Load
      .then(() => this.#getDefaultModelTileReference())
      .then((tileElm) => this.#selecteTheModelTile(tileElm))
      .then(() => this.#selectDefaultChatContext())
      .then(() => this.#saveDefaultModel())
      .then(() => this.#formatWithStyles()) // Format With Css styles
      .then(() => this.#observerChatBoxChanges()); // Observe Markdown DOM Changes
  }
  async #displayModelList() {
    let modelDropdown = document.querySelector(modelListDropdownSel);
    console.log(modelDropdown);
    modelDropdown.focus();
    modelDropdown.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "F4",
        keyCode: 115,
        which: 115,
        bubbles: true,
      })
    );
  }

  async #loadModelSettings() {
    await this.#waitForElm(configBtnSelector);
    await this.#delay(500); // Delay for 1 second
    await this.#clickBuggyConfigButton();
  }

  /**
   * Clicking the Config Button is buggy, so we need to keep trying until the Save Button appears
   */
  async #clickBuggyConfigButton() {
    try {
      let configBtn = sap.ui.getCore().byId(configBtnId);
      configBtn.firePress(); //Worst design or framework
    } catch (error) {
      console.log("Error in Clicking Buggy Config Button", error);
    }

    // Wait for Save Button
    let result = await this.#waitForElementWithTime(settingSaveBtnSel, 2500);
    if (!result) {
      // Retry if Save Button is not found
      await this.#clickBuggyConfigButton();
    }
  }

  async #getDefaultModelTileReference() {
    let tileContainer = document.getElementById(modelTileContainerId);
    let spans = tileContainer.querySelectorAll(
      "span.sapMText.sapUiSelectable.sapMTextMaxWidth.uiTextBold"
    );
    let resultNode = null;

    // Step 2: Loop through the spans
    for (let span of spans) {
      if (
        span.textContent.toLowerCase().includes(defaultModelName.toLowerCase())
      ) {
        // Step 2.1: Find the nearest ancestor <div> with class="sapFGLIWrapper"
        let wrapperDiv = span.closest("div.sapFGLIWrapper");

        if (wrapperDiv) {
          // Step 2.1.1: Check if any nested <bdi> contains givenVersion
          let bdiTags = wrapperDiv.querySelectorAll("bdi");

          for (let bdi of bdiTags) {
            if (
              bdi.textContent
                .toLowerCase()
                .includes(defaultVersionInternal.toLowerCase())
            ) {
              resultNode = wrapperDiv; // Step 2.1.2: Store node reference
              break;
            }
          }
        }
        // Step 2.1.3: Exit loop if node is found
        if (resultNode) {
          return resultNode;
        }
      }
    }
  }

  async #selecteTheModelTile(tileElm) {
    tileElm.focus();
    tileElm.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    tileElm.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }

  async #waitForTilesLoaded(className, count) {
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const divs = document.querySelectorAll(`div.${className}`);
        if (divs.length >= count) {
          console.log("Minimum Tile Count Found");
          observer.disconnect(); // Stop observing once condition is met
          resolve(divs); // Resolve the promise
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      // Check immediately in case divs are already present
      const existingDivs = document.querySelectorAll(`div.${className}`);
      if (existingDivs.length >= count) {
        console.log("Minimum Tile Count Found");
        observer.disconnect();
        resolve(existingDivs);
      }
    });
  }

  async #saveDefaultModel() {
    await this.#waitForElm(settingSaveBtnSel); // Wait for Config Button
    let saveBtn = document.querySelector(settingSaveBtnSel);
    saveBtn.focus();
    saveBtn.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    saveBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }

  async #selectDefaultChatContext() {
    let chatContextTab = await this.#waitForElm(chatContextTabSel); // Wait for Config Button
    let iconFilterTabBar = sap.ui.getCore().byId("configureChatsettings");
    iconFilterTabBar.setSelectedItem(iconFilterTabBar.getItems()[1]); // Select the second tab
    const liElements = document.querySelectorAll(".sapMSliderTickmarks li");
    let contextHistorySlider = sap.ui.getCore().byId("contextHistoryInput");
    contextHistorySlider.setValue(defaultchatContext); // Set the value to 10
  }

  #waitForElm(selector) {
    console.log(`Waiting for ${selector}`);
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`Found ${selector} immediately`);
        return resolve(element); // ? Stop execution here
      }
      const observer = new MutationObserver(() => {
        const foundElement = document.querySelector(selector);
        if (foundElement) {
          console.log(`Found ${selector} after mutation`);
          resolve(foundElement);
          observer.disconnect(); // ? Disconnect the observer
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  async #waitForDocumentBody() {
    let selector = "body";
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`Found ${selector} immediately`);
        return resolve(element); // ? Stop execution here
      }
      const observer = new MutationObserver(() => {
        const foundElement = document.querySelector(selector);
        if (foundElement) {
          console.log(`Found ${selector} after mutation`);
          resolve(foundElement);
          observer.disconnect(); // ? Disconnect the observer
        }
      });

      observer.observe(document, {
        childList: true,
        subtree: true,
      });
    });
  }

  async #waitForElementWithTime(selector, timeout = 3000) {
    return new Promise((resolve) => {
      let element = document.querySelector(selector);
      if (element) {
        resolve(true); // Element already exists
        return;
      }

      let observer = new MutationObserver(() => {
        element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(true); // Element found
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        resolve(false); // Timeout reached, element not found
      }, timeout);
    });
  }

  #formatAllChatBoxes3(cBoxContainer) {
    //prism.hihghlightAll(); // Highlight all code blocks
  }

  #formatAllChatBoxes2(cBoxContainer) {
    const codeBlocks = document.querySelectorAll("pre > code");
    const isNearBottom = cBoxContainer.scrollHeight - cBoxContainer.scrollTop - cBoxContainer.clientHeight < 100;
    codeBlocks.forEach((codeBlock, i) => {
      this.#enhanceCodeBlocks(codeBlock); // Enhance code blocks
    });
    Prism.highlightAll(); // Highlight all code blocks
    // Scroll to bottom only if user was already near bottom
  if (isNearBottom) {
    cBoxContainer.scrollTop = cBoxContainer.scrollHeight;
  }
  }

  /**
   * Adds a language label on the left and a copy button on the right.
   * @param {HTMLElement} block - The <code> block inside <pre>.
   */

  // Example usage in context
  #enhanceCodeBlocks(codeBlock) {
    const pre = codeBlock.parentElement;

    // Skip if already enhanced
    if (pre.classList.contains("enhanced-code-block")) return;

    // Mark as enhanced
    pre.classList.add("enhanced-code-block");

    // Create wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "code-block-wrapper";

    // Get language
    const languageClass = Array.from(codeBlock.classList).find((cls) =>
      cls.startsWith("language-")
    );
    const language = languageClass
      ? languageClass.replace("language-", "")
      : "plaintext";

    // Language label
    const label = document.createElement("div");
    label.className = "code-language-label";
    label.textContent = language;

    // Add copy button
    const copyButton = this.#createCopyButton(codeBlock, {
      buttonText: "📋 Copy",
      copiedText: "✓ Copied!",
      onCopy: (block, button) => {
        button.style.color = "#8CFA76";
        setTimeout(() => {
          button.style.color = "";
        }, 1000);
      },
    });

    // Wrap everything
    pre.parentElement.insertBefore(wrapper, pre);
    wrapper.appendChild(label);
    wrapper.appendChild(copyButton);
    wrapper.appendChild(pre);
  }

  // Create copy button for code block
  #createCopyButton(codeBlock, options = {}) {
    const defaultOptions = {
      buttonText: "📋 Copy",
      copiedText: "✓ Copied!",
      copyDuration: 2000,
      onCopy: null,
    };

    const settings = { ...defaultOptions, ...options };
    const button = document.createElement("button");
    button.className = "copy-code-button";
    button.innerHTML = settings.buttonText;

    button.addEventListener("click", () => {
      const textToCopy = codeBlock.textContent || codeBlock.innerText;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          button.textContent = settings.copiedText;
          if (typeof settings.onCopy === "function") {
            settings.onCopy(codeBlock, button);
          }
          setTimeout(() => {
            button.textContent = settings.buttonText;
          }, settings.copyDuration);
        })
        .catch((err) => {
          console.error("Failed to copy code:", err);
          button.textContent = "Copy Failed";
          setTimeout(() => {
            button.textContent = settings.buttonText;
          }, settings.copyDuration);
        });
    });

    return button;
  }

  async #observerChatBoxChanges() {
    const chatBoxContainer = await this.#waitForElm(chatBoxContainerSel);
    let timeoutId;
    const observer = new MutationObserver((mutations) => {
      // Debounce DOM changes
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.#formatAllChatBoxes2(chatBoxContainer);
        console.log("Formatted new chat box content.");
      }, 100); // wait 100ms after last change
    });
    observer.observe(chatBoxContainer, {
      childList: true,
      subtree: true,
    });
  }

  async #formatWithStyles() {
    let prismThemeCss = GM_getResourceText("prismCss");
    GM_addStyle(prismThemeCss);

    GM_addStyle(`
      .markdown-output {    
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          line-height: 1.6;
          color: #000000;
      }

      pre {
          border-radius: 8px;
          background: #1e1e1e;
          color: #ffffff;
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          font-family: "Fira Code", monospace;
          font-size: 14px;
          position: relative;
          margin-top: 15px !important;
          /* Push down to prevent overlap */
      }

      pre code {
         font-family: "Fira Code", monospace !important;
      }

      p code {
          background: #282c34;
          /* Dark background */
          color: #ffca28;
          /* Yellow text */
          padding: 2px 6px;
          border-radius: 4px;
          font-family: "Fira Code", monospace;
          font-size: 12px;
      }

      .sapMFlexBox.sapMVBox.sapMFlexBoxJustifyStart.sapMFlexBoxAlignItemsEnd.sapMFlexBoxWrapNoWrap.sapMFlexBoxAlignContentStretch.sapMFlexBoxBGTransparent.feedListItemUser.sapMFlexItem {
          background-color: #ffffff !important;
      }

      p {
          margin-block-start: 3px;
          margin-block-end: 3px;
      }

      .sapMText {
          white-space: normal; /* Changed from 'none' to a valid value */
      }

      .code-block-container {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f4f4f4;
          padding: 5px 10px;
          border-bottom: 1px solid #ddd;
      }

      .code-block-wrapper {
        position: relative;
        margin-top: 20px;
      }

      .code-block-wrapper pre {
         padding-top: 30px !important; /* Prevent language label from overlapping code */
       }
      .copy-code-button {
          position: absolute;
          top: 6px;
          right: 10px;
          background: #444;
          color: #fff;
          border: none;
          border-radius: 5px;
          padding: 4px 10px;
          font-size: 12px;
          cursor: pointer;
          z-index: 10;
        }

      .copy-code-button:hover {
          background: #666;
      }

    .code-language-label {
      position: absolute;
      top: 6px;
      left: 10px;
      font-size: 12px;
      color: #ccc;
      background: #2c2c2c;
      padding: 2px 8px;
      border-radius: 5px;
      z-index: 10;
    }
      /* Window Layout Adjustment */
      .chats {
          max-width: 70% !important;
      }
      div[id^="__bubble0-"].feedListContainerAssistant {
          width: 100%;
          max-width: 100% !important;
          padding-bottom: 5px !important;
      }

      div[id^="__bubble0-"].feedListItemAssistant {
          width: 100%;
          max-width: 100% !important; /* Adjust the width as needed */
      }

      /* Prompt Text Area */
      div#__xmlview0--promptTextArea {
          max-width: 68% !important;
      } 

      h1, h2, h3, h4, h5, h6 {
      margin: 3px; /* Change the value as needed */
      }
    `);

    let chatField = await this.#waitForElm("#__xmlview0--promptTextArea");
    if (chatField) chatField.style.maxWidth = "68% !important";
  }

  // End of Ui Elements
}

(function () {
  "use strict";
  window.addEventListener(
    "load",
    function () {
      console.log("Loaded");
      let formatter = new MarkdownFormatter();
      formatter
        .process()
        .then((result) => console.log("Formatter successful"))
        .catch((error) => alert(error.message));
    },
    false
  );
})();
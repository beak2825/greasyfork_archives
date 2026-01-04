// ==UserScript==
// @name         Answer2fill
// @name:zh      填充答案
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Automatically selects language based on user's browser settings (EN/ZH). Fills answers, submits, and navigates.
// @description:zh  根据浏览器语言自动选择界面语言 (英/中)。自动填入答案、提交并跳转到下一章节。
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/500296/Answer2fill.user.js
// @updateURL https://update.greasyfork.org/scripts/500296/Answer2fill.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- START: Internationalization (i18n) ---
  const translations = {
    en: {
      panelTitle: "Auto-Fill Panel",
      help: "Help",
      minimize: "Minimize",
      close: "Close",
      chapter: "Chapter",
      detecting: "Detecting...",
      questions: "Questions",
      fillAnswersTab: "Fill Answers",
      fillAnswersTooltip: "Enter and fill answers",
      configureTab: "Configure",
      configureTooltip: "Set up selectors",
      answerInputPlaceholder: "Paste answers here for all chapters (e.g., A,B,C)",
      fillButton: "Fill, Submit & Next",
      fillButtonTooltip: "Start filling answers and navigate",
      formatButton: "Format",
      formatButtonTooltip: "Format answers in the text box",
      saveConfigButton: "Save Configuration",
      saveConfigTooltip: "Save current selectors",
      totalQuestionsPlaceholder: "Expected Total Questions (Optional)",
      totalQuestionsTooltip: "Total questions for validation before starting.",
      questionContainerPlaceholder: "Question Container",
      questionContainerTooltip: "CSS selector for individual question containers",
      chapterElementPlaceholder: "Chapter Title Element",
      chapterElementTooltip: "CSS selector for the chapter title element",
      submitButtonPlaceholder: "Submit Button",
      submitButtonTooltip: "CSS selector for the submit button",
      nextChapterButtonPlaceholder: "Next Chapter Button",
      nextChapterButtonTooltip: "CSS selector for the next chapter button",
      helpTitle: "Auto-Fill Panel Help",
      helpFillTabTitle: "Fill Answers Tab:",
      helpFillTabDesc1: "Enter answers for all chapters in the text area.",
      helpFillTabDesc2: 'Click "Fill, Submit & Next" to start.',
      helpConfigTabTitle: "Configure Tab:",
      helpConfigTotalQuestions: "Expected Total Questions: (Optional) Enter the total number of questions to validate against the number of answers you provide.",
      helpConfigQuestionContainer: "Question Container: CSS selector for the element that contains each question.",
      helpConfigNextChapter: "Next Chapter Button: CSS selector for the button to go to the next section.",
      helpConfigSubmitButton: "Submit Button: CSS selector for the button that submits the answers.",
      helpConfigChapterElement: "Chapter Title Element: CSS selector for the element displaying the chapter name.",
      statusReady: "Ready",
      statusConfigSaved: "Configuration saved",
      statusNoQuestions: "No questions found. Check configuration.",
      statusValidationError: (provided, expected) => `Error: Provided ${provided} answers, expected ${expected}.`,
      statusFilling: (count) => `Filling ${count} answers...`,
      statusChapterFilled: "Chapter filled. Submitting...",
      statusClicking: (name) => `Clicking ${name}...`,
      statusElementNotFound: (name) => `${name} not found.`,
      statusNoAnswersLeft: "Found questions, but no answers remaining.",
      statusSkippingChapter: "No questions found in this chapter. Skipping...",
      statusNoMoreChapters: "No more chapters available. Workflow finished.",
      statusLoadingNext: "Loading next chapter...",
      togglePanelMenu: "Toggle Auto-Fill Panel",
      statusFormatSuccess: (count) => `Formatted ${count} answers.`,
      statusFormatError: "No content to format.",
    },
    zh: {
      panelTitle: "自动填充面板",
      help: "帮助",
      minimize: "最小化",
      close: "关闭",
      chapter: "章节",
      detecting: "检测中...",
      questions: "题目",
      fillAnswersTab: "填入答案",
      fillAnswersTooltip: "输入并填充答案",
      configureTab: "配置",
      configureTooltip: "设置选择器",
      answerInputPlaceholder: "在此粘贴所有章节的答案 (例如: A,B,C)",
      fillButton: "填充 & 下一章",
      fillButtonTooltip: "开始填充答案并导航",
      formatButton: "格式化",
      formatButtonTooltip: "格式化输入框中的答案",
      saveConfigButton: "保存配置",
      saveConfigTooltip: "保存当前选择器",
      totalQuestionsPlaceholder: "预期总题数 (可选)",
      totalQuestionsTooltip: "开始前用于验证答案总数。",
      questionContainerPlaceholder: "问题容器",
      questionContainerTooltip: "单个问题容器的 CSS 选择器",
      chapterElementPlaceholder: "章节标题元素",
      chapterElementTooltip: "显示章节标题的元素的 CSS 选择器",
      submitButtonPlaceholder: "提交按钮",
      submitButtonTooltip: "提交按钮的 CSS 选择器",
      nextChapterButtonPlaceholder: "下一章按钮",
      nextChapterButtonTooltip: "下一章按钮的 CSS 选择器",
      helpTitle: "自动填充面板帮助",
      helpFillTabTitle: "“填入答案”选项卡:",
      helpFillTabDesc1: "在文本区域输入所有章节的答案。",
      helpFillTabDesc2: '点击“填充, 提交 & 下一章”开始。',
      helpConfigTabTitle: "“配置”选项卡:",
      helpConfigTotalQuestions: "预期总题数: (可选) 输入问题总数，用于与您提供的答案数量进行验证。",
      helpConfigQuestionContainer: "问题容器: 包含每个问题的元素的 CSS 选择器。",
      helpConfigNextChapter: "下一章按钮: 前往下一部分的按钮的 CSS 选择器。",
      helpConfigSubmitButton: "提交答案的按钮的 CSS 选择器。",
      helpConfigChapterElement: "章节标题元素: 显示章节名称的元素的 CSS 选择器。",
      statusReady: "准备就绪",
      statusConfigSaved: "配置已保存",
      statusNoQuestions: "未找到问题，请检查配置。",
      statusValidationError: (provided, expected) => `错误: 提供了 ${provided} 个答案，预期为 ${expected} 个。`,
      statusFilling: (count) => `正在填充 ${count} 个答案...`,
      statusChapterFilled: "本章已填充，正在提交...",
      statusClicking: (name) => `正在点击 ${name}...`,
      statusElementNotFound: (name) => `未找到 ${name}。`,
      statusNoAnswersLeft: "找到问题，但没有剩余答案。",
      statusSkippingChapter: "本章未找到问题，正在跳过...",
      statusNoMoreChapters: "没有更多章节了，流程结束。",
      statusLoadingNext: "正在加载下一章...",
      togglePanelMenu: "切换自动填充面板",
      statusFormatSuccess: (count) => `已格式化 ${count} 个答案。`,
      statusFormatError: "没有内容可格式化。",
    },
  };

  function getBrowserLanguage() {
    const lang = (navigator.languages && navigator.languages[0]) ? navigator.languages[0] : navigator.language;
    return lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  }

  const i18n = translations[getBrowserLanguage()];
  // --- END: Internationalization (i18n) ---


  const GLOBAL = {
    fillAnswerDelay: 300,
    navigationDelay: 2000,
  };

  const DEFAULT_SELECTORS = {
    "hn.12348.gov.cn": {
      subjectContainer: ".neiinput",
      nextChapterButton: "a.next",
      submitButton: ".tijiao",
      chapterElement: "div.ContentTitle"
    },
  };

  let questions = [];
  const SELECTORS = JSON.parse(
    GM_getValue("domainSelectors", JSON.stringify(DEFAULT_SELECTORS))
  );
  const currentDomain = window.location.hostname;

  const styles = `
    :host {
      all: initial;
      font-family: 'MS Sans Serif', Arial, sans-serif;
      font-size: 12px;
      line-height: 1.2;
    }
    #auto-fill-container {
      position: fixed;
      top: 10px;
      right: 10px;
      background-color: #c0c0c0;
      border: 2px outset #ffffff;
      box-shadow: 2px 2px 0 #000000;
      color: #000000;
      padding: 3px;
      border-radius: 0;
      z-index: 9999999;
      width: 300px;
    }

    #bulk-input, #fill-button, .progress-bar, #subjectContainer, #save-selector {
      width: calc(100% - 4px);
      margin: 2px;
      box-sizing: border-box;
      outline: none;
    }
    .config-input {
      width: calc(100% - 4px) !important;
      margin: 2px;
      box-sizing: border-box;
      outline: none;
    }
    #bulk-input {
      height: 100px;
      resize: none;
    }
    button {
      font-family: 'MS Sans Serif', Arial, sans-serif;
      background-color: #c0c0c0;
      border: 2px outset #ffffff;
      padding: 2px 8px;
      color: #000000;
      cursor: pointer;
    }
    button:active {
      border-style: inset;
    }
    input[type="text"], input[type="number"], textarea {
      border: 2px inset #ffffff;
      background-color: #ffffff;
      padding: 2px;
      width: 100%;
    }
    .win98-tab {
      display: inline-block;
      padding: 3px 8px;
      background-color: #c0c0c0;
      border: 2px outset #ffffff;
      border-bottom: none;
      margin-right: 2px;
      cursor: pointer;
    }
    .win98-tab.active {
      background-color: #dfdfdf;
      border-style: inset;
      border-bottom: none;
    }
    #tab-content {
      border: 2px inset #ffffff;
      padding: 10px;
      background-color: #dfdfdf;
    }
    #title-bar {
      background: linear-gradient(to right, #000080, #1084d0);
      padding: 2px 4px;
      margin-bottom: 4px;
      color: #ffffff;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
    }
    .title-bar-controls {
      display: flex;
    }
    .title-bar-controls button {
      width: 16px;
      height: 14px;
      border: 1px outset #ffffff;
      background-color: #c0c0c0;
      margin-left: 2px;
      font-size: 9px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000000;
      font-weight: bold;
      padding: 0;
    }
    #status-bar {
      border-top: 2px groove #ffffff;
      padding: 2px 4px;
      font-size: 11px;
      margin-top: 4px;
    }
    .progress-bar {
      background-color: #ffffff;
      border: 1px inset #808080;
      height: 15px;
      margin-top: 5px;
    }
    .progress-bar-fill {
      width: 0%;
      height: 100%;
      background-color: #000080;
      transition: width 0.3s ease-in-out;
    }
    .tooltip {
      position: relative;
      display: inline-block;
    }
    .tooltip .tooltiptext {
      visibility: hidden;
      width: 120px;
      background-color: #ffffe1;
      color: #000;
      text-align: center;
      border: 1px solid #000;
      padding: 5px;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;
      margin-left: -60px;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .tooltip:hover .tooltiptext {
      visibility: visible;
      opacity: 1;
    }
    #help-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #c0c0c0;
      border: 2px outset #ffffff;
      box-shadow: 2px 2px 0 #000000;
      padding: 2px;
      z-index: 10000;
      display: none;
      width: 300px;
    }
    #help-dialog-title {
      background: linear-gradient(to right, #000080, #1084d0);
      color: #ffffff;
      padding: 2px 4px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #help-content {
      padding: 10px;
      max-height: 400px;
      overflow-y: auto;
    }
    #help-content h3, #help-content p, #help-content ul, #help-content li {
      margin: revert;
      padding: revert;
    }
    #fill-button, #format-button, #save-selector {
      width: calc(100% - 4px);
      margin: 2px;
    }
	#button-bar button {flex: 1;}
  `;
  function getSelectorsForCurrentDomain() {
    return SELECTORS[currentDomain] || {};
  }

  function createMainInterface() {
    const container = document.createElement("div");
    container.id = "auto-fill-wrapper";
    container.style.position = "fixed";
    container.style.top = "10px";
    container.style.right = "10px";
    container.style.zIndex = "9999999";
    document.body.appendChild(container);

    const shadow = container.attachShadow({ mode: 'open' });

    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    shadow.appendChild(styleElement);

    const mainContainer = document.createElement('div');
    mainContainer.id = 'auto-fill-container';
    mainContainer.style.display = GM_getValue("PanelVisible", true) ? "block" : "none";

    mainContainer.innerHTML = `
      <div id="title-bar">
        <span>${i18n.panelTitle}</span>
        <div class="title-bar-controls">
          <button id="help-button" class="tooltip">?<span class="tooltiptext">${i18n.help}</span></button>
          <button id="minimize-button" class="tooltip">_<span class="tooltiptext">${i18n.minimize}</span></button>
          <button id="close-button" class="tooltip">X<span class="tooltiptext">${i18n.close}</span></button>
        </div>
      </div>
      <div id="panel-content">
        <div id="info-panel" style="display: flex; justify-content: space-between; padding: 3px 5px; margin: 0 2px 4px 2px; border: 2px inset #ffffff; background-color: #dfdfdf;">
        <span id="chapter-display">${i18n.chapter}: ${i18n.detecting}</span>
        <span id="question-display">${i18n.questions}: --</span>
        </div>
        <div id="tab-buttons">
          <span id="fill-tab-button" class="win98-tab active tooltip">${i18n.fillAnswersTab}<span class="tooltiptext">${i18n.fillAnswersTooltip}</span></span>
          <span id="config-tab-button" class="win98-tab tooltip">${i18n.configureTab}<span class="tooltiptext">${i18n.configureTooltip}</span></span>
        </div>
        <div id="tab-content">
          <div id="fill-tab">
            <textarea id="bulk-input" placeholder="${i18n.answerInputPlaceholder}"></textarea>
            <div id="button-bar" style="display: flex; gap: 2px;">
                <button id="format-button" class="tooltip">${i18n.formatButton}<span class="tooltiptext">${i18n.formatButtonTooltip}</span></button>
                <button id="fill-button" class="tooltip">${i18n.fillButton}<span class="tooltiptext">${i18n.fillButtonTooltip}</span></button>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill"></div>
            </div>
          </div>
          <div id="config-tab" style="display:none;">
            <div id="selector-inputs"></div>
            <button id="save-selector" class="tooltip">${i18n.saveConfigButton}<span class="tooltiptext">${i18n.saveConfigTooltip}</span></button>
          </div>
        </div>
        <div id="status-bar">${i18n.statusReady}</div>
      </div>
    `;
    shadow.appendChild(mainContainer);

    const helpDialog = document.createElement("div");
    helpDialog.id = "help-dialog";
    helpDialog.innerHTML = `
      <div id="help-dialog-title">
        <span>${i18n.help}</span>
        <button id="close-help">X</button>
      </div>
      <div id="help-content">
        <h3>${i18n.helpTitle}</h3>
        <p><strong>${i18n.helpFillTabTitle}</strong></p>
        <ul>
          <li>${i18n.helpFillTabDesc1}</li>
          <li>${i18n.helpFillTabDesc2}</li>
        </ul>
        <p><strong>${i18n.helpConfigTabTitle}</strong></p>
        <ul>
          <li><strong>${i18n.helpConfigTotalQuestions.split(':')[0]}:</strong>${i18n.helpConfigTotalQuestions.split(':')[1]}</li>
          <li><strong>${i18n.helpConfigQuestionContainer.split(':')[0]}:</strong>${i18n.helpConfigQuestionContainer.split(':')[1]}</li>
          <li><strong>${i18n.helpConfigNextChapter.split(':')[0]}:</strong>${i18n.helpConfigNextChapter.split(':')[1]}</li>
          <li><strong>${i18n.helpConfigSubmitButton.split(':')[0]}:</strong>${i18n.helpConfigSubmitButton.split(':')[1]}</li>
          <li><strong>${i18n.helpConfigChapterElement.split(':')[0]}:</strong>${i18n.helpConfigChapterElement.split(':')[1]}</li>
        </ul>
      </div>
    `;
    shadow.appendChild(helpDialog);

    addEventListeners(shadow);

    updateConfigTab(shadow);
    return shadow;
  }

  function handleFormatClick() {
    const shadow = document.getElementById("auto-fill-wrapper").shadowRoot;
    const bulkInput = shadow.getElementById("bulk-input");
    const text = bulkInput.value;

    if (!text || text.trim() === '') {
      updateStatusBar(i18n.statusFormatError);
      return;
    }

    const answers = parseAnswers(text);
    bulkInput.value = answers.join(',');
    updateStatusBar(i18n.statusFormatSuccess(answers.length));
  }

  function handlePaste(e) {
    e.preventDefault();

    const pastedText = (e.clipboardData || window.clipboardData).getData('text');

    if (pastedText) {
      const answers = parseAnswers(pastedText);
      e.target.value = answers.join(',');
      updateStatusBar(i18n.statusFormatSuccess(answers.length));
    }
  }

  function addEventListeners(shadow) {
    const mainContainer = shadow.getElementById('auto-fill-container');
    mainContainer.addEventListener("click", handleContainerClick);
    mainContainer.addEventListener("mousedown", handleContainerMouseDown);

    shadow.getElementById("format-button").addEventListener("click", handleFormatClick);

    const bulkInput = shadow.getElementById("bulk-input");
    bulkInput.addEventListener("keydown", handleBulkInputKeydown);
    bulkInput.addEventListener("paste", handlePaste);

    shadow.getElementById("close-button").addEventListener("click", togglePanelVisibility);
    shadow.getElementById("minimize-button").addEventListener("click", minimizePanel);
    shadow.getElementById("help-button").addEventListener("click", toggleHelpDialog);
    shadow.getElementById("close-help").addEventListener("click", toggleHelpDialog);
  }

  const handleContainerClick = (e) => {
    const target = e.target;
    if (target.id === "fill-tab-button" || target.id === "config-tab-button") {
      switchTab(target.id.replace("-tab-button", ""));
    } else if (target.id === "save-selector") {
      saveSelectors();
    } else if (target.id === "fill-button") {
      fillAnswersWorkflow();
    }
  };

  const handleContainerMouseDown = (e) => {
    if (e.target.id === "title-bar") {
      let offsetX = e.clientX - e.target.getBoundingClientRect().left;
      let offsetY = e.clientY - e.target.getBoundingClientRect().top;

      function mouseMoveHandler(e) {
        const shadow = document.getElementById("auto-fill-wrapper").shadowRoot;
        const container = shadow.getElementById("auto-fill-container");
        container.style.right = "auto";
        container.style.left = `${e.clientX - offsetX}px`;
        container.style.top = `${e.clientY - offsetY}px`;
      }

      function mouseUpHandler() {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      }

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    }
  };

  const handleBulkInputKeydown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      fillAnswersWorkflow();
    } else if (e.key === "Backspace" || e.key === "Delete") {
      e.stopPropagation();
    }
  };

  function switchTab(tabName) {
    const shadow = document.getElementById("auto-fill-wrapper").shadowRoot;
    shadow.getElementById("fill-tab").style.display = tabName === "fill" ? "block" : "none";
    shadow.getElementById("config-tab").style.display = tabName === "config" ? "block" : "none";
    shadow.getElementById("fill-tab-button").classList.toggle("active", tabName === "fill");
    shadow.getElementById("config-tab-button").classList.toggle("active", tabName === "config");
  }

  function togglePanelVisibility() {
    const container = document.getElementById("auto-fill-wrapper").shadowRoot.getElementById("auto-fill-container");
    const newVisibility = container.style.display === "none";
    container.style.display = newVisibility ? "block" : "none";
    GM_setValue("PanelVisible", newVisibility);
  }

  function minimizePanel() {
    const shadow = document.getElementById("auto-fill-wrapper").shadowRoot;
    const panelContent = shadow.getElementById("panel-content");
    panelContent.style.display = panelContent.style.display === "none" ? "block" : "none";
  }

  function toggleHelpDialog() {
    const shadow = document.getElementById("auto-fill-wrapper").shadowRoot;
    const helpDialog = shadow.getElementById("help-dialog");
    helpDialog.style.display = helpDialog.style.display === "none" || helpDialog.style.display === "" ? "block" : "none";
  }

  function updateConfigTab(shadow) {
    const currentSelectors = SELECTORS[currentDomain] || DEFAULT_SELECTORS[currentDomain] || {};
    shadow.getElementById("selector-inputs").innerHTML = `
      <div class="tooltip" style="width:100%;">
        <input id="totalQuestions" class="config-input" type="number" value="${currentSelectors.totalQuestions || ""}" placeholder="${i18n.totalQuestionsPlaceholder}">
        <span class="tooltiptext">${i18n.totalQuestionsTooltip}</span>
      </div>
      <div class="tooltip" style="width:100%;">
        <input id="subjectContainer" class="config-input" type="text" value="${currentSelectors.subjectContainer || ""}" placeholder="${i18n.questionContainerPlaceholder}">
        <span class="tooltiptext">${i18n.questionContainerTooltip}</span>
      </div>
       <div class="tooltip" style="width:100%;">
        <input id="chapterElement" class="config-input" type="text" value="${currentSelectors.chapterElement || ""}" placeholder="${i18n.chapterElementPlaceholder}">
        <span class="tooltiptext">${i18n.chapterElementTooltip}</span>
      </div>
      <div class="tooltip" style="width:100%;">
        <input id="submitButton" class="config-input" type="text" value="${currentSelectors.submitButton || ""}" placeholder="${i18n.submitButtonPlaceholder}">
        <span class="tooltiptext">${i18n.submitButtonTooltip}</span>
      </div>
      <div class="tooltip" style="width:100%;">
        <input id="nextChapterButton" class="config-input" type="text" value="${currentSelectors.nextChapterButton || ""}" placeholder="${i18n.nextChapterButtonPlaceholder}">
        <span class="tooltiptext">${i18n.nextChapterButtonTooltip}</span>
      </div>
    `;
  }

  function saveSelectors() {
    const shadow = document.getElementById("auto-fill-wrapper").shadowRoot;
    if (!SELECTORS[currentDomain]) {
        SELECTORS[currentDomain] = {};
    }
    SELECTORS[currentDomain] = {
      totalQuestions: shadow.getElementById("totalQuestions").value,
      subjectContainer: shadow.getElementById("subjectContainer").value,
      nextChapterButton: shadow.getElementById("nextChapterButton").value,
      submitButton: shadow.getElementById("submitButton").value,
      chapterElement: shadow.getElementById("chapterElement").value,
    };
    GM_setValue("domainSelectors", JSON.stringify(SELECTORS));
    detectQuestions();
    switchTab("fill");
    updateStatusBar(i18n.statusConfigSaved);
  }

  function updateQuestionCount() {
    const shadow = document.getElementById("auto-fill-wrapper").shadowRoot;
    const chapterDisplay = shadow.getElementById("chapter-display");
    const questionDisplay = shadow.getElementById("question-display");
    const currentSelectors = getSelectorsForCurrentDomain();

    let chapterName = "N/A";
    if (currentSelectors.chapterElement) {
        const chapterEl = document.querySelector(currentSelectors.chapterElement);
        if (chapterEl) {
            let name = chapterEl.textContent.trim();
            if (name.length > 10) {
                name = name.substring(0, 10) + "...";
            }
            chapterName = name;
        }
    }

    if (chapterDisplay) {
        chapterDisplay.textContent = `${i18n.chapter}: ${chapterName}`;
    }

    if (questionDisplay) {
        questionDisplay.textContent = `${i18n.questions}: ${questions.length}`;
    }
  }

  function detectQuestions(isInitialCall = false) {
    const currentSelectors = getSelectorsForCurrentDomain();
    if (currentSelectors && currentSelectors.subjectContainer) {
      questions = Array.from(
        document.querySelectorAll(currentSelectors.subjectContainer)
      ).filter(
        (item) => item.querySelectorAll('input[type="radio"],input[type="checkbox"]').length > 1
      );
    }

    if (questions.length === 0) {
      const optionsGroup = new Map();
      document.querySelectorAll('input[type="radio"],input[type="checkbox"]').forEach(opt => {
        const name = opt.getAttribute("name");
        if (name) {
          if (!optionsGroup.has(name)) {
            optionsGroup.set(name, []);
          }
          optionsGroup.get(name).push(opt);
        }
      });
      questions = Array.from(optionsGroup.values());
    }
    updateQuestionCount();
    if (questions.length === 0 && isInitialCall) {
        updateStatusBar(i18n.statusNoQuestions);
        switchTab("config");
    }
  }

  function parseAnswers(input) {
      if(!input) return [];
      const text = input.toUpperCase().replace(/[^A-Z]/g, ' ').replace(/\s+/g, ' ').trim();
      const blocks = text.split(' ').filter(Boolean);
      const answers = [];
      for (const block of blocks) {
          const hasRepeat = /([A-Z])\1+/.test(block);
          if (hasRepeat) {
            answers.push(...block.split(''));
          } else {
            answers.push(block);
          }
      }
      return answers;
  }

  const fillAnswer = async (options, answer) => {
    for (const char of answer) {
      const optionIndex = char.charCodeAt(0) - 65;
      if (optionIndex >= 0 && optionIndex < options.length) {
        const option = options[optionIndex];
        if (!option.checked) {
          const clickTarget = option.style.display === "none" ? option.parentElement : option;
          clickTarget.click();
          await new Promise(resolve => setTimeout(resolve, GLOBAL.fillAnswerDelay));
        }
      }
    }
  };

  async function fillSingleChapter(answersForChapter) {
      const totalQuestions = Math.min(questions.length, answersForChapter.length);
      if (totalQuestions === 0) return;

      updateStatusBar(i18n.statusFilling(totalQuestions));

      for (let i = 0; i < totalQuestions; i++) {
          const options = Array.isArray(questions[i]) ? questions[i] : questions[i].querySelectorAll('input[type="radio"],input[type="checkbox"]');
          const answer = answersForChapter[i];
          await fillAnswer(options, answer);
          updateProgressBar((i + 1) / totalQuestions);
      }
  }

  async function clickElement(selector, description) {
      if (!selector) {
          console.log(`${description} selector not configured.`);
          return false;
      }
      const element = document.querySelector(selector);
      if (element) {
          updateStatusBar(i18n.statusClicking(description));
          element.click();
          await new Promise(resolve => setTimeout(resolve, GLOBAL.navigationDelay));
          return true;
      } else {
          updateStatusBar(i18n.statusElementNotFound(description));
          return false;
      }
  }

  async function fillAnswersWorkflow() {
    const shadow = document.getElementById("auto-fill-wrapper").shadowRoot;
    const currentSelectors = getSelectorsForCurrentDomain();
    let allAnswers = JSON.parse(GM_getValue("savedAnswers", "[]"));
    if (allAnswers.length === 0) {
        allAnswers = parseAnswers(shadow.getElementById("bulk-input").value);
        const expectedTotalStr = currentSelectors.totalQuestions || "0";
        const expectedTotal = parseInt(expectedTotalStr, 10);
        const providedTotal = allAnswers.length;
        if (expectedTotal > 0 && providedTotal !== expectedTotal) {
            updateStatusBar(i18n.statusValidationError(providedTotal, expectedTotal));
            return;
        }
    } else {
        updateStatusBar(i18n.statusReady + ` (${allAnswers.length} ${i18n.questions} ${i18n.questions})`);
    }

    GM_setValue("savedAnswers", JSON.stringify(allAnswers));

    while (true) {
        await new Promise(resolve => setTimeout(resolve, 100));
        detectQuestions();

        if (questions.length > 0) {
            const remainingAnswers = JSON.parse(GM_getValue("savedAnswers", "[]"));
            if (remainingAnswers.length === 0) {
                updateStatusBar(i18n.statusNoAnswersLeft);
                break;
            }

            const answersForThisChapter = remainingAnswers.slice(0, questions.length);

            await fillSingleChapter(answersForThisChapter);
            updateStatusBar(i18n.statusChapterFilled);

            await clickElement(currentSelectors.submitButton, i18n.submitButtonPlaceholder);
            const nextAnswers = remainingAnswers.slice(questions.length);
            GM_setValue("savedAnswers", JSON.stringify(nextAnswers));
            shadow.getElementById("bulk-input").value = nextAnswers.join(',');
        } else {
            updateStatusBar(i18n.statusSkippingChapter);
        }

        const hasNext = await clickElement(currentSelectors.nextChapterButton, i18n.nextChapterButtonPlaceholder);

        if (!hasNext) {
            updateStatusBar(i18n.statusNoMoreChapters);
            break;
        }

        updateStatusBar(i18n.statusLoadingNext);
        await new Promise(resolve => setTimeout(resolve, GLOBAL.navigationDelay + 1000));
    }

    GM_setValue("savedAnswers", "[]");
    updateProgressBar(0);
  }

  function updateProgressBar(progress) {
    const shadow = document.getElementById("auto-fill-wrapper").shadowRoot;
    const progressBarFill = shadow.querySelector('.progress-bar-fill');
    progressBarFill.style.width = `${progress * 100}%`;
  }

  function updateStatusBar(message) {
    const shadow = document.getElementById("auto-fill-wrapper").shadowRoot;
    const statusBar = shadow.getElementById('status-bar');
    statusBar.textContent = message;
  }

  function init() {
    createMainInterface();
    setTimeout(() => detectQuestions(true), 2000);
    GM_registerMenuCommand(i18n.togglePanelMenu, togglePanelVisibility);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
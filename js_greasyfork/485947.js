// ==UserScript==
// @name         Prompt-Continue
// @description  ChatGPT 自动化问题提交
// @version      1.5.3
// @author       undefined
// @license      GPL-2.0-only
// @namespace    https://greasyfork.org/zh-CN/scripts/485947-prompt-continue
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/485947/Prompt-Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/485947/Prompt-Continue.meta.js
// ==/UserScript==
(function () {
  GM_addStyle(`
    :root {
      --background-color: #fafafa;
      --text-color: #333;
      --border-color: #ccc;
      --hover-background-color: #e6e6e6;
      --button-background-color: #5865f2;
      --button-hover-background-color: #4752c4;
      --shadow-color: rgba(0,0,0,0.1);
      --textarea-border-color: #ccc;
      --button-text-color: #fff;
      --summary-background-color: #f5f5f5;
      --summary-border-color: #e8e8e8;
      --summary-box-shadow: 0px 0px 10px rgba(0,0,0,0.08);
      --input-background-color: hsla(0,0%,100%,0.8);
      --input-border-color: #ccc;
      --input-text-color: #333;
    }

    .prompt-continue-night-mode {
      --background-color: #1f1f1f;
      --text-color: #e0e0e0;
      --border-color: #3a3a3a;
      --hover-background-color: #2a2a2a;
      --button-background-color: #5865f2;
      --button-hover-background-color: #4752c4;
      --shadow-color: rgba(0, 0, 0, 0.2);
      --textarea-border-color: #555;
      --button-text-color: #fff;
      --summary-background-color: #2a2a2a;
      --summary-border-color: #444;
      --summary-box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
      --input-background-color: #242424;
      --input-border-color: #555;
      --input-text-color: #ddd;
      --textarea-background-color-night: #242424;
      --textarea-text-color-night: #ddd;
    }

    .prompt-continue-night-mode #questionInput,
        .prompt-continue-night-mode #additionalInput {
      border-color: var(--textarea-border-color);
      background-color: var(--textarea-background-color-night);
      color: var(--textarea-text-color-night);
    }

    .prompt-continue-night-mode .question-text {
      background-color: var(--textarea-background-color-night);
      color: var(--textarea-text-color-night);
    }

    .prompt-continue-night-mode #toggleSidebar svg,
        .prompt-continue-night-mode .delete-button svg {
      fill: #757575;
    }

    .prompt-continue-night-mode #sidebar svg:hover {
      color: #b3b3b3;
    }

    .prompt-continue-night-mode #settingSidebar svg:hover {
      color: #b3b3b3;
    }

    .prompt-continue-night-mode .question button {
      border: 1px solid var(--button-border-color-night);
      background-color: var(--button-background-color-night);
      color: var(--button-text-color-night);
    }

    .prompt-continue-night-mode .question button:hover {
      border-color: var(--button-hover-border-color-night);
      background-color: var(--button-hover-background-color-night);
    }

    .prompt-continue-night-mode .question button:active {
      border-color: var(--button-active-border-color-night);
      background-color: var(--button-active-background-color-night);
    }

    .prompt-continue-night-mode .original-icon svg {
      fill: #757575;
    }

    .prompt-continue-night-mode .button-container button {
      border: 1px solid #39843c;
      background-color: #45a049;
      color: white;
    }

    .prompt-continue-night-mode .button-container button:hover {
      background-color: #39843c;
      color: #ddd;
    }

    .prompt-continue-night-mode .summary-action {
      display: inline-flex;
      padding: 5px;
      border: 1px solid #39843c;
      border-radius: 4px;
      background-color: #45a049;
      color: white;
      text-decoration: none;
      align-items: center;
      justify-content: center;
    }

    .prompt-continue-night-mode .summary-action:hover {
      background-color: #39843c;
      color: #ddd;
    }

    .prompt-continue-night-mode .summary-action svg {
      fill: white;
    }

    .button-container button {
      height: 40px;
      border: 1px solid var(--border-color);
    }

    #sidebar {
      position: fixed;
      top: 45%;
      right: 0;
      z-index: 9999;
      overflow: hidden;
      padding: 20px;
      width: 270px;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      background-color: var(--background-color);
      box-shadow: 0 0 15px var(--shadow-color);
      transition: all 0.3s ease-in-out;
      transform: translateY(-50%);
    }

    #toggleSidebar {
      position: absolute;
      top: 45%;
      left: 0;
      z-index: 9999;
      display: flex;
      width: 30px;
      height: 30px;
      border: 1px solid var(--border-color);
      border-radius: 50%;
      background: var(--background-color);
      box-shadow: 0 0 15px var(--shadow-color);
      cursor: pointer;
      transition: left 0.3s, border 0.3s, background 0.3s;
      transform: translateY(-50%);
      align-items: center;
      justify-content: center;
    }

    #sidebar.collapsed #sidebarContent {
      display: none;
    }

    #sidebar.collapsed #toggleSidebar {
      left: 15px;
    }

    #sidebarWrapper {
      position: relative;
    }

    #toggleSidebar:hover {
      border-color: var(--hover-border-color);
      background: var(--hover-background-color);
    }

    #toggleSidebar svg {
      width: 20px;
      height: 20px;
      transition: all 0.3s ease-in-out;
    }

    #sidebar.collapsed {
      width: 60px;
    }

    #sidebar.collapsed #toggleSidebar {
      left: 15px;
    }

    #sidebar h2 {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-color);
      text-align: center;
      font-size: 1.4em;
      transition: color 0.3s ease, background-color 0.3s ease;
    }

    #sidebar textarea {
      margin-bottom: 10px;
      padding: 10px;
      width: 100%;
      height: 100px;
      border: 1px solid var(--textarea-border-color);
      border-radius: 5px;
      resize: none;
      transition: border-color 0.3s;
    }

    #sidebar textarea:focus {
      outline: none;
      border-color: var(--focus-border-color);
    }

    #sidebar button {
      margin-bottom: 2px;
      padding: 2px;
      width: 100%;
      border: none;
      border-radius: 5px;
      color: var(--button-text-color);
      cursor: pointer;
      transition: background-color 0.3s;
    }

    #submitQuestion,
        #exportPrompt,
        #start,
        #exportImg,
        #stepRun {
      padding: 10px 20px;
      outline: none;
      border: none;
      border-radius: 5px;
      background-color: var(--button-background-color);
      box-shadow: 0px 5px 10px var(--shadow-color);
      color: var(--button-text-color);
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    #sidebarContent .button:active {
      box-shadow: 0px 2px 5px var(--shadow-color);
      transform: translateY(3px);
    }

    #sidebarContent .button:hover {
      background-color: var(--button-hover-background-color);
    }

    #questionList {
      overflow-y: auto;
      margin-top: 8px;
      max-height: 200px;
    }

    .questionContainer {
      display: flex;
      align-items: center;
    }

    .question {
      display: flex;
      overflow: hidden;
      margin-bottom: 2px;
      padding: 5px;
      border: 1px solid var(--border-color);
      border-radius: 5px;
      background-color: var(--background-color);
      color: var(--text-color);
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: background-color 0.3s;
      justify-content: space-between;
      align-items: center;
    }

    .question:hover {
      background-color: var(--hover-background-color);
    }

    .question:before {
      margin-right: 4px;
      color: var(--text-color);
      content: "⏳";
    }

    .question.answered {
      color: #aaa;
    }

    .question.answered:before {
      content: "🎉";
    }

    .question button {
      display: flex;
      box-sizing: border-box;
      margin-left: 0px;
      border: 1px solid var(--border-color);
      background: none;
      cursor: pointer;
      transition: color 0.3s;
      justify-content: center;
      align-items: center;
    }

    .question button:hover {
      color: var(--button-hover-background-color);
    }

    .question .button-container {
      display: flex;
      margin-left: auto;
      gap: 0px;
    }

    .button-container button {
      padding: 0;
      width: 24px;
      border: 2px solid red;
    }

    .delete-button-wrapper {
      display: flex;
      height: 100%;
      align-items: center;
    }

    .question button svg {
      margin: auto;
      width: 18px;
      height: 18px;
      pointer-events: none;
    }

    .button-group {
      display: flex;
      justify-content: space-between;
    }

    .question-text {
      overflow-y: auto;
      outline: none;
      border: none;
      color: var(--text-color);
      text-overflow: ellipsis;
      flex-grow: 1;
      flex-shrink: 1;
      flex-basis: 0;
    }

    #questionSummary {
      display: flex;
      margin-top: 20px;
      padding: 10px;
      height: 90px;
      border-radius: 10px;
      background-color: var(--summary-background-color);
      box-shadow: var(--summary-box-shadow);
      transition: all 0.3s ease-in-out;
      justify-content: space-between;
    }

    .summary-item {
      display: flex;
      padding: 10px;
      width: 45%;
      border: 1px solid var(--summary-border-color);
      border-radius: 10px;
      background-color: var(--background-color);
      box-shadow: var(--summary-box-shadow);
      transition: all 0.3s ease-in-out;
      justify-content: space-between;
      align-items: flex-start;
    }

    .summary-item:hover {
      box-shadow: var(--summary-box-shadow);
      transform: scale(1.02);
    }

    .icon-count-container {
      display: flex;
      width: 50%;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
    }

    .summary-icon {
      margin-right: 10px;
      color: var(--text-color);
      font-size: 18px;
    }

    .summary-count {
      margin-right: 10px;
      color: var(--text-color);
      font-size: 18px;
    }

    .button-container {
      display: flex;
      padding: 3px;
      width: 50%;
      height: 100%;
      justify-content: flex-end;
      align-items: center;
    }

    .summary-action {
      display: flex;
      padding: 4px 4px;
      width: 100%;
      height: 100%;
      border: 1px solid var(--border-color);
      border-radius: 5px;
      background-color: transparent;
      color: var(--text-color);
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      justify-content: center;
      align-items: center;
    }

    .summary-action:hover {
      background-color: var(--hover-background-color);
    }

    .vertical-text {
      margin: 0 auto;
      color: var(--text-color);
      font-size: 20px;
      writing-mode: vertical-rl;
      text-orientation: upright;
    }

    #settingSidebar {
      position: fixed;
      top: 50%;
      right: 0;
      overflow: hidden;
      padding: 20px;
      width: 270px;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      background-color: var(--background-color);
      box-shadow: var(--shadow-color) 0 0 15px;
      transition: all 0.3s ease-in-out;
      transform: translateY(-50%);
    }

    #settingSidebar h2 {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-color);
      text-align: center;
      font-size: 1.4em;
      transition: color 0.3s ease, background-color 0.3s ease;
    }

    .input-row {
      margin-bottom: 10px;
    }

    .input-row label {
      display: block;
      margin-top: 7px;
      margin-bottom: 5px;
      color: var(--text-color);
      font-weight: bold;
    }

    .input-row input[type="text"],
        .input-row input[type="number"] {
      padding: 10px;
      width: 100%;
      border: 1px solid var(--border-color);
      border-radius: 5px;
      background-color: var(--input-background-color);
      color: var(--input-text-color);
      font-size: 14px;
      font-family: Arial, sans-serif;
      transition: border-color 0.3s;
    }

    .input-row input[type="text"]:focus,
        .input-row input[type="number"]:focus {
      outline: none;
      border-color: #007bff;
    }

    #runMode {
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }

    #runMode input[type="radio"] {
      margin-right: 10px;
    }

    #delayTime {
      margin-left: 10px;
      padding: 5px;
      width: 80px;
      width: 70px;
      border: 1px solid var(--input-border-color);
      border-radius: 5px;
      background-color: var(--input-background-color);
      color: var(--input-text-color);
      text-align: right;
      transition: border-color 0.3s;
    }

    .mode-option {
      display: flex;
      margin: 10px auto;
      margin-bottom: 10px;
      padding: 10px;
      width: 70%;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      transition: background-color 0.3s, box-shadow 0.3s;
      justify-content: center;
      align-items: center;
    }

    .mode-option.selected {
      background-color: var(--selected-background-color);
      box-shadow: 0px 0px 8px var(--shadow-color);
    }

    .mode-option:not(.selected):hover {
      background-color: var(--hover-background-color);
    }

    #delayTime {
      display: none;
      margin-left: 10px;
    }

    .mode-option.delayed.selected #delayTime {
      display: inline-block;
    }

    .mode-option input[type="number"] {
      margin-left: 10px;
      border: 1px solid var(--input-border-color);
      color: var(--input-text-color);
    }

    .clear-cache-btn {
      padding: 10px 20px;
      width: 100%;
      outline: none;
      border: none;
      border-radius: 5px;
      background-color: var(--button-background-color);
      box-shadow: 0px 5px 10px var(--shadow-color);
      color: var(--button-text-color);
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .clear-cache-btn:active {
      box-shadow: 0px 2px 5px var(--shadow-color);
      transform: translateY(3px);
    }

    .clear-cache-btn:hover {
      background-color: var(--button-hover-background-color);
    }

    .button-container1 {
      display: flex;
      width: 100%;
      height: 30px;
      justify-content: center;
      align-items: center;
    }

    #openSetting {
      color: var(--text-color);
      font-size: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    #openSetting:hover {
      color: var(--text-color-hover);
      text-shadow: 2px 2px 4px var(--shadow-color);
    }

    #openSetting:active {
      transform: scale(0.97);
    }

    #backToMainSidebar {
      color: var(--text-color);
      font-size: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    #backToMainSidebar:hover {
      color: var(--text-color-hover);
      text-shadow: 2px 2px 4px var(--shadow-color);
    }

    #backToMainSidebar:active {
      transform: scale(0.97);
    }

    .styled-select {
      display: block;
      box-sizing: border-box;
      margin: 0;
      width: 100%;
      max-width: 600px;
      border: 1px solid var(--input-border-color);
      background-color: var(--dropdown-background-color);
      color: var(--dropdown-text-color);
      font-size: 1em;
    }

    .dropdown {
      display: block;
      box-sizing: border-box;
      padding: 0.5em 0.75em;
      width: 100%;
      border-radius: 4px;
      box-shadow: 0 1px 0 1px var(--shadow-color);
    }

    .input-flex {
      display: flex;
      align-items: center;
    }

    .input-flex label {
      margin-right: 10px;
      color: var(--text-color);
    }

    .input-row {
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 5px;
      background-color: var(--input-background-color);
      box-shadow: 0 2px 5px var(--shadow-color);
    }

    .input-row label {
      margin-bottom: 5px;
      font-weight: bold;
    }

    .input-row input[type="text"],
        .input-row input[type="number"],
        .input-row select {
      border: 1px solid var(--input-border-color);
      color: var(--input-text-color);
    }

    .input-row select {
      padding: 8px;
    }

    .button-container1 button {
      padding: 10px 20px;
      outline: none;
      border: none;
      border-radius: 5px;
      background-color: var(--button-background-color);
      box-shadow: var(--shadow-color) 0px 5px 10px;
      color: var(--button-text-color);
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .button-container1 button:active {
      box-shadow: var(--shadow-color) 0px 2px 5px;
      transform: translateY(3px);
    }

    .button-container1 button:hover {
      background-color: var(--button-hover-background-color);
    }

    .dragging {
      opacity: 0.5;
    }

    #delayTime:after {
      margin-left: 5px;
      content: "秒";
    }

    .button-group {
      display: flex;
      flex-direction: row;
      gap: 5px;
    }

    .input-row textarea {
      overflow-y: auto;
      box-sizing: border-box;
      padding: 8px;
      width: 100%;
      min-height: 50px;
      border: 1px solid var(--input-border-color);
      border-radius: 5px;
      color: var(--input-text-color);
      font-size: 14px;
      resize: none;
    }

    .input-row label,
        .input-row input[type="text"],
        .input-row input[type="number"],
        .input-row select,
        .input-row textarea {
      margin-bottom: 10px;
    }

    .input-flex label,
        .input-flex input,
        .input-flex textarea {
      display: inline-block;
      vertical-align: middle;
    }

    .feedback-bar {
      display: none;
      margin-top: 8px;
      margin-bottom: 8px;
      padding: 10px;
      border-radius: 5px;
      text-align: center;
      font-size: 14px;
    }

    .feedback-bar.success {
      background-color: #a3cfec;
      color: #333333;
    }

    .feedback-bar.error {
      background-color: #f6b1b1;
      color: #333333;
    }

    .feedback-bar.normal {
      background-color: #e2e2e2;
      color: #333333;
    }

    .theme-switch-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .theme-icon {
      font-size: 1.2em;
    }

    .theme-switch {
      position: relative;
      display: inline-block;
      margin-top: 10px;
      width: 48px;
      height: 24px;
    }

    .theme-switch input {
      display: none;
    }

    .slider {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #ccc;
      cursor: pointer;
      transition: 0.4s;
    }

    .slider:before {
      position: absolute;
      bottom: 4px;
      left: 4px;
      width: 16px;
      height: 16px;
      background-color: white;
      content: "";
      transition: 0.4s;
    }

    input:checked + .slider {
      background-color: #2196f3;
    }

    input:checked + .slider:before {
      transform: translateX(24px);
    }

    .slider.round {
      border-radius: 24px;
    }

    .slider.round:before {
      border-radius: 50%;
    }

    .prompt-continue-night-mode .original-icon svg {
      fill: #757575;
    }
    `);
  const GlobalSVG = {
    deleteSVG: `<svg t="1684556652392" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2423" width="20" height="20"><path d="M202.666667 256h-42.666667a32 32 0 0 1 0-64h704a32 32 0 0 1 0 64H266.666667v565.333333a53.333333 53.333333 0 0 0 53.333333 53.333334h384a53.333333 53.333333 0 0 0 53.333333-53.333334V352a32 32 0 0 1 64 0v469.333333c0 64.8-52.533333 117.333333-117.333333 117.333334H320c-64.8 0-117.333333-52.533333-117.333333-117.333334V256z m224-106.666667a32 32 0 0 1 0-64h170.666666a32 32 0 0 1 0 64H426.666667z m-32 288a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z m170.666666 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z" fill="#000000" p-id="2424"></path></svg>`,
    deleteConfirm: `<svg t="1705597990331" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4215" width="32" height="32"><path d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m250.56-656.768l-40.96-41.152A19.008 19.008 0 0 0 707.84 320a19.008 19.008 0 0 0-13.888 6.08l-246.4 247.68L330.176 455.04a20.032 20.032 0 0 0-13.888-5.44 20.032 20.032 0 0 0-13.824 5.44l-40.96 41.216A20.288 20.288 0 0 0 256 510.208c0 5.248 1.792 9.856 5.44 13.888l172.224 173.824a17.408 17.408 0 0 0 13.568 6.08 17.408 17.408 0 0 0 13.568-6.08l301.76-302.784A20.672 20.672 0 0 0 768 380.8a18.56 18.56 0 0 0-5.44-13.632z" fill="#d81e06" p-id="4216"></path></svg>`,
    leftArrow: `<svg id="icon-expand" style="display: none;" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m10.8 12l3.9 3.9q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.212-.325T8.425 12q0-.2.063-.375T8.7 11.3l4.6-4.6q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7z"/></svg>`,
    rightArrow: `<svg id="icon-collapse"  xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375q0 .2-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7z"/></svg>`,
    setting: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M18.525 8.3q-.125 0-.262-.075T18.075 8l-.65-1.4l-1.4-.65q-.15-.05-.225-.187t-.075-.263q0-.125.075-.262t.225-.188l1.4-.65l.65-1.4q.05-.15.188-.225t.262-.075q.125 0 .263.075t.187.225l.65 1.4l1.4.65q.15.05.225.188t.075.262q0 .125-.075.263t-.225.187l-1.4.65l-.65 1.4q-.05.15-.188.225t-.262.075Zm2 7.025q-.125 0-.25-.075t-.2-.2l-.35-.75l-.75-.35q-.075-.05-.275-.45q0-.125.075-.25t.2-.2l.75-.35l.35-.75q.05-.075.45-.275q.125 0 .25.075t.2.2l.35.75l.75.35q.075.05.275.45q0 .125-.075.25t-.2.2l-.75.35l-.35.75q-.05.075-.45.275ZM8.4 22q-.375 0-.65-.25t-.325-.625l-.2-1.475q-.2-.075-.388-.2t-.312-.25l-1.375.6q-.35.175-.713.05t-.562-.475l-1.6-2.8q-.2-.325-.113-.7t.388-.6l1.175-.875v-.8l-1.175-.875q-.3-.225-.387-.6t.112-.7l1.6-2.8q.2-.35.563-.475t.712.05l1.375.6q.125-.125.313-.25t.387-.2l.2-1.475q.05-.375.325-.625T8.4 6h3.25q.375 0 .65.25t.325.625l.2 1.475q.2.075.388.2t.312.25l1.375-.6q.35-.175.712-.05t.563.475l1.6 2.8q.2.325.113.7t-.388.6l-1.175.875v.8l1.175.875q.3.225.388.6t-.113.7l-1.6 2.8q-.2.35-.563.475t-.712-.05l-1.375-.6q-.125.125-.313.25t-.387.2l-.2 1.475q-.05.375-.325.625t-.65.25H8.4Zm1.625-5q1.25 0 2.125-.875T13.025 14q0-1.25-.875-2.125T10.025 11q-1.25 0-2.125.875T7.025 14q0 1.25.875 2.125t2.125.875Zm0-2q-.425 0-.713-.288T9.025 14q0-.425.288-.713t.712-.287q.425 0 .713.288t.287.712q0 .425-.288.713t-.712.287Zm-.75 5h1.5l.2-1.8q.725-.2 1.238-.513t1.012-.837l1.65.75l.7-1.25l-1.45-1.1q.2-.575.2-1.25t-.2-1.25l1.45-1.1l-.7-1.25l-1.65.75q-.5-.525-1.012-.837T10.975 9.8l-.2-1.8h-1.5l-.2 1.8q-.725.2-1.237.513t-1.013.837l-1.65-.75l-.7 1.25l1.45 1.1q-.2.575-.213 1.25t.213 1.25l-1.45 1.1l.7 1.25l1.65-.75q.5.525 1.012.838t1.238.512l.2 1.8Zm.75-6Z"/></svg>`,
    back: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m9 14l-4-4l4-4"/><path d="M5 10h11a4 4 0 1 1 0 8h-1"/></g></svg>`,
  };
  const defaultSymbol = "+++";
  const defaultDelayTime = "500";

  /** 用户界面模块 */
  const UIManager = {
    createMainSidebar: function () {
      const sidebar = document.createElement("div");
      sidebar.id = "sidebar";
      sidebar.innerHTML = `
              <div id="toggleSidebar">
                ${GlobalSVG.leftArrow}
                ${GlobalSVG.rightArrow}
              </div>
              <section id="sidebarContent">
                <h2 style="position: relative; user-select: none;"><div>PromptNext</div><div id="openSetting" style="cursor: pointer; position: absolute; right: 0; top:0 ;">${GlobalSVG.setting}</div></h2>
                <textarea id="questionInput" placeholder="请输入您的提示词 , 可批量输入 , 默认 +++ 为拆分符号"></textarea>
                <div class="button-group">
                    <button id="submitQuestion" class="button">提交提示词</button>
                    <button id="exportPrompt" class="button"> 导出文本</button>
                </div>
                <div class="button-group">
                  <button id="stepRun" class="button">单步运行</button>
                  <button id="exportImg" class="button">导出图片</button>
                </div>
                <div class="button-group">
                  <button id="start" class="button">自动运行</button>
                </div>

                <div id="feedbackBar" class="feedback-bar" style="display: none;"></div>

                <ul id="questionList"></ul>

                <div id="questionSummary" class="question-summary">
                  <div class="summary-item">
                    <div class="icon-count-container">
                      <div class="icon-container">
                          <span class="summary-icon">🎉</span>
                      </div>
                      <div class="count-container">
                          <span class="summary-count" id="completedCount">0</span>
                      </div>
                    </div>
                    <div class="button-container">
                        <a href="#" class="summary-action" id="deleteCompleted">${GlobalSVG.deleteSVG}</a>
                    </div>
                  </div>

                  <div class="summary-item">
                    <div class="icon-count-container">
                      <div class="icon-container">
                        <span class="summary-icon">⏳</span>
                      </div>
                      <div class="count-container">
                        <span class="summary-count" id="pendingCount">0</span>
                      </div>
                    </div>
                    <div class="button-container">
                      <a href="#" class="summary-action" id="deletePending">${GlobalSVG.deleteSVG}</a>
                    </div>
                  </div>

                </div>
              </section>
            `;
      document.body.appendChild(sidebar);

      const savedTheme = localStorage.getItem("selectedTheme") || "light";
      if (savedTheme === "dark") {
        document.documentElement.classList.add("prompt-continue-night-mode");
      }
    },
    createSettingSidebar: function () {
      const settingSidebar = document.createElement("div");
      settingSidebar.id = "settingSidebar";
      settingSidebar.style.display = "none";
      settingSidebar.innerHTML = `
        <section id="sidebarContent">
            <h2 style="position: relative; user-select: none;" ><div id="backToMainSidebar" style="cursor: pointer; position: absolute; left: 0; top:0 ;">${GlobalSVG.back}</div><div>PromptNext</div></h2>
            <!-- 主题切换 -->
            <div class="input-row">
              <div class="theme-switch-wrapper">
                <span class="theme-icon sun-icon">☀️</span>
                <label class="theme-switch">
                  <input type="checkbox" id="themeSwitch" />
                  <div class="slider round"></div>
                </label>
                <span class="theme-icon moon-icon">🌙</span>
              </div>
            </div>
            <!-- 拆分符号 -->
            <div class="input-row">
              <label for="splitCharInput">Prompt 拆分符号：</label>
              <input type="text" id="splitCharInput" placeholder="留空则默认为 +++ " />
            </div>
            <!-- 输出增强 -->
            <div class="input-row">
              <label for="additionalInput">输出增强(文末自动添加)：</label>
              <textarea
                  id="additionalInput"
                  placeholder="例如，零样本提示（请一步步思考），少样本提示（提供输出案例），思维链（提供思考过程）等"
              ></textarea>
            </div>
            <!-- 运行模式 -->
            <div class="input-row">
              <div id="runMode">
                <div class="mode-option instant" id="instantOption">
                  <input
                    type="radio"
                    id="instant"
                    name="mode"
                    value="instant"
                    checked
                  />
                  <label for="instant">即时</label>
                </div>
                <div class="mode-option delayed" id="delayedOption">
                  <input type="radio" id="delayed" name="mode" value="delayed" />
                  <label for="delayed">延时</label>
                  <input type="number" id="delayTime" placeholder="432" />
                </div>
              </div>
            </div>
            <!-- 清空缓存按钮 -->
            <div class="button-container1" style="display: inline-block">
              <button class="clear-cache-btn">清空缓存</button>
            </div>
        </section>
        `;
      document.body.appendChild(settingSidebar);
      const clearCacheBtn = document.querySelector(".clear-cache-btn");
      clearCacheBtn.addEventListener("click", Utils.clearCache);
    },
    createButton: function (type, clickHandler) {
      const button = document.createElement("button");
      button.className = `${type}-button`;
      switch (type) {
        case "delete":
          button.innerHTML = GlobalSVG.deleteSVG;
          break;
      }
      if (clickHandler) {
        button.addEventListener("click", clickHandler);
      }
      return button;
    },
    showFeedback: function (message, type = "normal") {
      const feedbackBar = document.getElementById("feedbackBar");
      // 容错
      if (!feedbackBar) {
        UIManager.showFeedback("找不到反馈栏元素", "error");
        return;
      }
      feedbackBar.textContent = message;
      feedbackBar.style.display = "block";
      feedbackBar.className = `feedback-bar ${type}`;
      // 根据消息类型调整显示时间
      let displayDuration = 3000; // 默认显示时间为3秒
      if (type === "error") {
        displayDuration = 5000; // 错误消息显示时间长一些
      }
      // 定时隐藏通知栏
      setTimeout(() => {
        feedbackBar.style.display = "none";
      }, displayDuration);
    },
    createQuestionDiv: function (question, answered, uuid) {
      const div = document.createElement("div");
      div.className = "question";
      div.draggable = true;
      div.setAttribute("question-id", uuid);

      const questionContainer = document.createElement("div");
      questionContainer.style.cssText =
        "display: flex; justify-content: center;";

      const questionText = document.createElement("textarea");
      questionText.id = uuid;
      questionText.className = "question-text";
      questionText.value = question;
      questionText.readOnly = false;
      questionText.style.cssText =
        "border: none; height: 42px; resize: none; margin: auto; width: 160px;";
      questionContainer.appendChild(questionText);
      div.appendChild(questionContainer);

      const buttonContainer = document.createElement("div");
      buttonContainer.className = "button-container";
      // 创建一个新的 div 用于包裹删除按钮
      const deleteButtonWrapper = document.createElement("div");
      deleteButtonWrapper.className = "delete-button-wrapper";
      const deleteButton = this.createButton(
        "delete",
        EventHandler.handleDeleteButtonClick
      );
      deleteButtonWrapper.appendChild(deleteButton);
      buttonContainer.appendChild(deleteButtonWrapper);
      div.appendChild(buttonContainer);

      if (answered) {
        div.classList.add("answered");
      }
      div.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", this.outerHTML);
        this.classList.add("dragging");
      });
      div.addEventListener("dragend", function () {
        this.classList.remove("dragging");
      });
      return div;
    },
    addQuestionToList: function (question, answered, uuid) {
      if (question.trim() === "") {
        return null;
      }
      const questionDiv = this.createQuestionDiv(question, answered, uuid); // 确保使用this引用
      questionDiv.dataset.id = uuid;
      const questionList = document.getElementById("questionList");
      if (questionList) {
        questionList.appendChild(questionDiv);
        if (answered) {
          questionDiv.classList.add("answered");
        }
        this.updateQuestionCounts();
        return questionDiv;
      } else {
        UIManager.showFeedback("未找到问题列表元素", "error");
      }
    },
    clearInput: function () {
      const input = document.getElementById("questionInput");
      if (input) {
        input.value = "";
      } else {
        UIManager.showFeedback("Input element not found", "error");
      }
    },
    updateQuestionCounts: function () {
      const counts = DataManager.getQuestionCounts();
      document.getElementById("completedCount").textContent =
        counts.answeredCount;
      document.getElementById("pendingCount").textContent =
        counts.unansweredCount;
    },
    toggleQuestionTextWhiteSpace: function (target) {
      // 实现切换问题文本空白的逻辑
      target.style.whiteSpace =
        target.style.whiteSpace === "nowrap" ? "normal" : "nowrap";
    },
    toggleSidebar: function () {
      const sidebar = document.getElementById("sidebar");
      const collapseIcon = document.getElementById("icon-collapse");
      const expandIcon = document.getElementById("icon-expand");
      sidebar.classList.toggle("collapsed");
      const isCollapsed = sidebar.classList.contains("collapsed");
      collapseIcon.style.display = isCollapsed ? "none" : "block";
      expandIcon.style.display = isCollapsed ? "block" : "none";
      SettingsManager.saveSidebar();
    },
  };
  /** 设置模块 */
  const SettingsManager = {
    // 保存设置
    saveSettings: function () {
      try {
        this.saveThemeSetting();
        this.saveSplitCharSetting();
        this.saveAdditionalSetting();
        this.saveRunModeSetting();
        this.saveDelayTimeSetting();
        UIManager.showFeedback("设置已保存", "success");
      } catch (err) {
        UIManager.showFeedback("保存设置时出错: " + err.message, "error");
      }
    },
    saveThemeSetting: function () {
      const themeSwitch = document.getElementById("themeSwitch");
      if (!themeSwitch) {
        throw new Error("找不到主题切换开关");
      }
      const theme = themeSwitch.checked ? "dark" : "light";
      localStorage.setItem("selectedTheme", theme);
    },
    saveSidebar: function () {
      const isCollapsed = sidebar.classList.contains("collapsed");
      localStorage.setItem("sidebarCollapsed", isCollapsed);
    },
    // 加载设置
    loadSettings: function () {
      try {
        this.loadThemeSetting();
        this.loadSplitCharSetting();
        this.loadAdditionalSetting();
        this.loadRunModeSetting();
        this.loadDelayTimeSetting();
        this.loadSidebarSetting();
      } catch (err) {
        UIManager.showFeedback("加载设置时出错", "error");
      }
    },
    applyTheme: function (theme) {
      const isDark = theme === "dark";
      document.documentElement.classList[isDark ? "add" : "remove"](
        "prompt-continue-night-mode"
      );
      const themeSwitch = document.getElementById("themeSwitch");
      if (themeSwitch) {
        themeSwitch.checked = isDark;
      }
    },
    loadThemeSetting: function () {
      let windowTheme = "light";
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        windowTheme = "dark";
      }

      const savedTheme = localStorage.getItem("selectedTheme") || windowTheme;
      this.applyTheme(savedTheme);
    },
    loadSidebarSetting: function () {
      const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
      if (isCollapsed) UIManager.toggleSidebar();
    },
    bindThemeSwitch: function () {
      // 监听手动切换主题
      const themeSwitch = document.getElementById("themeSwitch");
      themeSwitch.addEventListener("change", function () {
        const newTheme = themeSwitch.checked ? "dark" : "light";
        localStorage.setItem("selectedTheme", newTheme);
        SettingsManager.applyTheme(newTheme);
      });

      // 监听电脑主题变化
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (e.matches) {
            // 用户切换到深色主题
            localStorage.setItem("selectedTheme", "dark");
            SettingsManager.applyTheme("dark");
          } else {
            // 用户切换到浅色主题
            localStorage.setItem("selectedTheme", "light");
            SettingsManager.applyTheme("light");
          }
        });
    },
    saveSplitCharSetting: function () {
      const splitCharInput = document.getElementById("splitCharInput");
      localStorage.setItem("splitChar", splitCharInput.value || defaultSymbol);
    },
    saveAdditionalSetting: function () {
      const additionalInput = document.getElementById("additionalInput");
      localStorage.setItem("additional", additionalInput.value);
    },
    saveRunModeSetting: function () {
      const runMode = document.querySelector(
        'input[name="mode"]:checked'
      ).value;
      localStorage.setItem("runMode", runMode);
    },
    saveDelayTimeSetting: function () {
      const delayTimeInput = document.getElementById("delayTime");
      localStorage.setItem(
        "delayTime",
        delayTimeInput.value || defaultDelayTime
      );
    },
    loadSplitCharSetting: function () {
      const splitCharInput = document.getElementById("splitCharInput");
      splitCharInput.value = localStorage.getItem("splitChar") || defaultSymbol;
    },
    loadAdditionalSetting: function () {
      const additionalInput = document.getElementById("additionalInput");
      additionalInput.value = localStorage.getItem("additional") || "";
    },
    loadRunModeSetting: function () {
      const runMode = localStorage.getItem("runMode") || "instant";
      document.getElementById(runMode).checked = true;
    },
    loadDelayTimeSetting: function () {
      const delayTimeInput = document.getElementById("delayTime");
      delayTimeInput.value =
        localStorage.getItem("delayTime") || defaultDelayTime;
    },
  };
  /** 数据管理模块 */
  const DataManager = {
    // 使用 Map 结构存储问题
    storedQuestions: new Map(),
    getQuestionCounts: function () {
      const questions = DataManager.storedQuestions;
      let answeredCount = 0;
      let unansweredCount = 0;
      questions.forEach((question) => {
        if (question.answered) {
          answeredCount++;
        } else {
          unansweredCount++;
        }
      });
      return { answeredCount, unansweredCount };
    },
    // 添加问题到本地存储: 默认更新后为未回答
    addQuestion: function (questionText, uuid) {
      try {
        if (!questionText) {
          throw new Error("问题内容不能为空。");
        }

        // 更新检测
        if (this.storedQuestions.has(uuid)) {
          const question = this.storedQuestions.get(uuid);
          if (question.text == questionText) return;

          // 更新状态
          const questionDiv = document.querySelector(`[question-id="${uuid}"]`);
          questionDiv.classList.remove("answered");
        }

        this.storedQuestions.set(uuid, { text: questionText, answered: false });
        this.saveQuestionsToLocalStorage();
        UIManager.showFeedback("问题更新提交成功", "success");
        UIManager.updateQuestionCounts();
      } catch (err) {
        UIManager.showFeedback("问题更新提交错误: " + err.message, "error");
      }
    },
    // 从输入获取问题
    getQuestionsFromInput: function (inputElement) {
      const splitChar = localStorage.getItem("splitChar") || defaultSymbol;
      return inputElement.value
        .split(splitChar)
        .map((question) => question.trim())
        .filter((question) => question !== "");
    },
    // 从本地存储加载问题
    loadQuestions: function () {
      // 清空现有问题列表
      document.getElementById("questionList").innerHTML = "";
      try {
        const questionsData =
          JSON.parse(localStorage.getItem("questions")) || [];
        questionsData.forEach((item) =>
          this.storedQuestions.set(item.id, {
            text: item.text,
            answered: item.answered,
          })
        );
        this.storedQuestions.forEach((value, key) => {
          UIManager.addQuestionToList(value.text, value.answered, key);
        });
        UIManager.updateQuestionCounts();
        UIManager.showFeedback("问题加载成功", "success"); // 添加成功通知
      } catch (err) {
        UIManager.showFeedback(
          "从本地存储加载问题出错: " + err.message,
          "error"
        );
      }
    },
    // 保存问题到本地存储
    saveQuestionsToLocalStorage: function () {
      try {
        const questionsData = Array.from(this.storedQuestions.entries()).map(
          ([id, data]) => ({ id, ...data })
        );
        localStorage.setItem("questions", JSON.stringify(questionsData));
      } catch (err) {
        UIManager.showFeedback(
          "保存问题到本地存储出错: " + err.message,
          "error"
        );
      }
    },
    // 更新问题状态
    updateQuestion: function (uuid, answered) {
      try {
        if (!this.storedQuestions.has(uuid)) {
          throw new Error("未找到问题。");
        }
        this.storedQuestions.get(uuid).answered = answered;
        this.saveQuestionsToLocalStorage();
        UIManager.updateQuestionCounts(); // 更新问题计数
        UIManager.showFeedback("问题状态更新成功", "success");
      } catch (err) {
        UIManager.showFeedback("更新问题状态出错: " + err.message, "error");
      }
    },
    // 删除问题
    deleteQuestion: function (uuid) {
      try {
        if (!this.storedQuestions.has(uuid)) {
          throw new Error("未找到问题。");
        }
        this.storedQuestions.delete(uuid);
        this.saveQuestionsToLocalStorage();
        UIManager.updateQuestionCounts(); // 更新问题计数
        UIManager.showFeedback("问题删除成功", "success");
      } catch (err) {
        UIManager.showFeedback("删除问题出错: " + err.message, "error");
      }
    },
    // 更新本地存储中的问题状态
    updateQuestionInLocalStorage: function (questionUUID, answered) {
      try {
        let storedQuestions = this.getQuestionsFromLocalStorage();
        let questionToUpdate = storedQuestions.find(
          (q) => q.id === questionUUID
        );
        if (!questionToUpdate) {
          throw new Error(`未找到UUID为 ${questionUUID} 的问题。`);
        }
        questionToUpdate.answered = answered;
        localStorage.setItem("questions", JSON.stringify(storedQuestions));
        UIManager.updateQuestionCounts(); // 确保在这里更新统计

        UIManager.showFeedback("问题状态已在本地存储中更新", "success");
        if (this.storedQuestions.has(questionUUID)) {
          this.storedQuestions.get(questionUUID).answered = answered;
        }
      } catch (error) {
        UIManager.showFeedback(
          "更新本地存储中的问题状态出错: " + error.message,
          "error"
        );
      }
    },
    // 从本地获取问题列表
    getQuestionsFromLocalStorage: function () {
      try {
        const storedQuestions = localStorage.getItem("questions")
          ? JSON.parse(localStorage.getItem("questions"))
          : [];

        return storedQuestions?.map((rawQuestion) => ({
          id: rawQuestion.id,
          text: rawQuestion.text,
          answered: rawQuestion.answered,
        }));
      } catch (err) {
        UIManager.showFeedback(
          "从本地存储检索问题时出错: " + err.message,
          "error"
        );
        return [];
      }
    },
    // 清空本地缓存问题列表
    removeFromLocalStorage: async function (questionUUID) {
      return new Promise((resolve, reject) => {
        let storedQuestions = localStorage.getItem("questions");
        storedQuestions = storedQuestions ? JSON.parse(storedQuestions) : [];
        storedQuestions = storedQuestions.filter((q) => q.id !== questionUUID);
        localStorage.setItem("questions", JSON.stringify(storedQuestions));
        resolve(questionUUID);
      });
    },
  };
  /** 事件处理模块 */
  const EventHandler = {
    // 处理问题提交
    handleQuestionSubmission: function () {
      try {
        const questionInput = document.getElementById("questionInput");
        if (!questionInput) {
          UIManager.showFeedback("Question input element not found", "error");
          return;
        }
        const questions = DataManager.getQuestionsFromInput(questionInput);
        if (questions.length === 0) {
          UIManager.showFeedback("没有问题输入");
          return;
        }
        questions.forEach((question) => {
          const uuid = Utils.generateUUID();
          UIManager.addQuestionToList(question, false, uuid);
          DataManager.addQuestion(question, uuid);
        });
        UIManager.clearInput();
        UIManager.updateQuestionCounts();
      } catch (error) {
        console.error("处理问题提交时出错:", error);
      }
    },
    // 处理删除事件
    handleDeleteButtonClick: function (event) {
      const deleteButton = event.target;
      const questionDiv = deleteButton.closest(".question");
      const questionUuid = questionDiv.dataset.id;
      const isReadyToDelete =
        deleteButton.getAttribute("data-ready-to-delete") === "true";
      if (!isReadyToDelete) {
        setupDeleteConfirmation(deleteButton, () =>
          revertToOriginalSVG(deleteButton)
        );
        UIManager.showFeedback("再次点击,确认删除该问题", "normal");
      } else {
        performDeletion(questionUuid, questionDiv, deleteButton);
      }
    },
    // 处理删除等待事件
    handleDeletePending: function (event) {
      const deleteButton = event.currentTarget;
      const isReadyToDelete =
        deleteButton.getAttribute("data-ready-to-delete") === "true";
      if (!isReadyToDelete) {
        setupDeleteConfirmation(deleteButton, () =>
          revertToOriginalSVG(deleteButton)
        );
        UIManager.showFeedback("点击再次确认删除未回答的问题", "normal");
      } else {
        const pendingQuestions = document.querySelectorAll(
          ".question:not(.answered)"
        );
        pendingQuestions.forEach((questionDiv) => {
          const questionUuid = questionDiv.dataset.id;
          performDeletion(questionUuid, questionDiv, deleteButton);
        });
        UIManager.updateQuestionCounts();
      }
    },
    // 处理删除完成事件
    handleDeleteCompleted: async function () {
      const completedQuestions =
        document.querySelectorAll(".question.answered");
      for (let questionDiv of completedQuestions) {
        const questionUUID = questionDiv.dataset.id;
        DataManager.deleteQuestion(questionUUID); // 更新问题状态
        questionDiv.remove(); // 从界面中移除问题
        UIManager.updateQuestionCounts(); // 更新问题计数
      }
      UIManager.showFeedback("所有已回答的问题已删除", "success");
    },
    // 处理问题更新事件
    handleQuestionUpdate: function (event) {
      if (event.target.classList.contains("question-text")) {
        // 获取失焦时输入的文本内容及对应 uuid
        const uuid = event.target.id;
        const blurredText = event.target.value;

        DataManager.addQuestion(blurredText, uuid);
      }
    },
  };
  /** 绑定事件监听器函数 */
  function bindEventHandlers() {
    // 绑定打开设置界面的事件处理
    document
      .getElementById("openSetting")
      .addEventListener("click", openSettings);
    // 绑定返回用户界面的事件处理
    document
      .getElementById("backToMainSidebar")
      .addEventListener("click", backToMainSidebar);
    // 绑定提交问题按钮的事件处理
    document
      .getElementById("submitQuestion")
      .addEventListener("click", EventHandler.handleQuestionSubmission);
    // 绑定切换侧边栏的事件
    document
      .getElementById("toggleSidebar")
      .addEventListener("click", UIManager.toggleSidebar);

    // 绑定增强输入文本区域的自动调整大小事件
    const textarea = document.getElementById("additionalInput");
    if (!textarea) {
      UIManager.showFeedback("未找到增强输入的文本区域", "error");
    }

    // 绑定切换运行模式的事件（即时或延时）
    const delayedRadio = document.getElementById("delayed");
    const delayTimeInput = document.getElementById("delayTime");
    delayedRadio.addEventListener("change", function () {
      delayTimeInput.disabled = false; // 启用延时时间输入框
    });

    // 绑定即时运行模式的事件
    const instantRadio = document.getElementById("instant");
    instantRadio.addEventListener("change", function () {
      delayTimeInput.disabled = true; // 禁用延时时间输入框
    });

    // 页面加载完成后，从本地存储加载问题列表
    window.addEventListener("load", () => DataManager.loadQuestions());

    // 事件委托监听更新问题修改
    document
      .getElementById("questionList")
      .addEventListener("blur", EventHandler.handleQuestionUpdate, true);

    // 绑定导出结果的点击事件
    document
      .getElementById("exportPrompt")
      .addEventListener("click", function () {
        if (QuestionAsker.isRunning) {
          return UIManager.showFeedback("程序正在运行中", "error");
        }
        exportData();
      });

    document.getElementById("exportImg").addEventListener("click", function () {
      if (QuestionAsker.isRunning) {
        return UIManager.showFeedback("程序正在运行中", "error");
      }
      exportData(true);
    });

    // 绑定单步运行按钮的点击事件
    document.getElementById("stepRun").addEventListener("click", function () {
      if (!QuestionAsker.hasUnansweredQuestions()) {
        UIManager.showFeedback("没有未回答的问题", "error");
        return;
      }
      if (!QuestionAsker.isRunning) {
        QuestionAsker.isRunning = true;
        QuestionAsker.isAutoRunMode = false;
        QuestionAsker.startAskingQuestions(true); // 单步运行
      } else {
        UIManager.showFeedback("正在自动运行中", "error");
      }
    });
    // 绑定自动运行按钮的点击事件
    document.getElementById("start").addEventListener("click", function () {
      if (!QuestionAsker.hasUnansweredQuestions()) {
        UIManager.showFeedback("没有未回答的问题", "error");
        return;
      }

      // 切换运行状态并更新按钮文本和样式
      QuestionAsker.isAutoRunMode = !QuestionAsker.isRunning;
      QuestionAsker.isRunning = !QuestionAsker.isRunning;
      if (QuestionAsker.isRunning) QuestionAsker.startAskingQuestions();
      QuestionAsker.updateStartButton();
    });
    // 切换运行模式
    document
      .getElementById("instantOption")
      .addEventListener("click", function (event) {
        // 防止触发两次事件（一次是块元素，一次是单选按钮）
        if (event.target.type !== "radio") {
          document.getElementById("instant").checked = true;
        }
        updateRunModeSelection("instant");
      });
    document
      .getElementById("delayedOption")
      .addEventListener("click", function (event) {
        if (event.target.type !== "radio") {
          document.getElementById("delayed").checked = true;
        }
        updateRunModeSelection("delayed");
      });
    function updateRunModeSelection(selectedMode) {
      const instantOption = document.getElementById("instantOption");
      const delayedOption = document.getElementById("delayedOption");
      if (selectedMode === "instant") {
        instantOption.classList.add("selected");
        delayedOption.classList.remove("selected");
      } else if (selectedMode === "delayed") {
        instantOption.classList.remove("selected");
        delayedOption.classList.add("selected");
      }
    }
  }
  // 提问逻辑模块
  const QuestionAsker = {
    isRunning: false,
    isAutoRunMode: false,
    startAskingQuestions: async function (isSingleStep = false) {
      try {
        if (isSingleStep) {
          this.isRunning = true;
          this.updateStartButton();
        }
        const questions = Array.from(
          document.getElementsByClassName("question")
        );
        const unansweredQuestions = questions.filter(
          (question) => !question.classList.contains("answered")
        );

        if (unansweredQuestions.length === 0) {
          // 如果没有未回答的问题，显示通知并返回
          UIManager.showFeedback("没有未回答的问题", "error");
          if (isSingleStep) {
            this.isRunning = false;
            this.updateStartButton();
          }
          return;
        }

        const runMode = localStorage.getItem("runMode") || "instant";
        const delayTimeInit = parseInt(
          localStorage.getItem("delayTime") || defaultDelayTime
        );
        const delayTime =
          Math.floor(Math.random() * 2 + 1) * 1000 + delayTimeInit;

        const additionalInput = document.getElementById("additionalInput");
        const enhancementText = additionalInput.value;

        let allAnswered = true;
        for (let i = 0; i < questions.length; i++) {
          UIManager.updateQuestionCounts();
          let allAnswered = false;
          if (!this.isRunning) {
            console.info(`isRunning的状态为：${this.isRunning}`);
            break;
          }

          const questionDiv = questions[i];
          if (questionDiv.classList.contains("answered")) {
            continue;
          }

          const questionInput = questionDiv.querySelector(
            "textarea.question-text"
          );

          const questionUUID = questionDiv.dataset.id;

          let fullText;
          if (!questionDiv.classList.contains("answered")) {
            let questionText = questionInput.value;
            fullText = enhancementText
              ? `${questionText} ${enhancementText}`
              : questionText;

            if (runMode === "instant") {
              console.info(`立即提问模式：${fullText}`);
              await Utils.delay(400);
              await this.askQuestionInstant(fullText);
            } else if (runMode === "delayed") {
              console.info(
                `在提问问题 ${fullText} 前延迟 ${delayTime / 1000} 秒`
              );
              await Utils.delay(delayTime);
              await this.askQuestionInstant(fullText);
            }

            questionDiv.classList.add("answered");
            DataManager.updateQuestionInLocalStorage(questionUUID, true);
            console.log(`问题已提交并标记为已回答: ${questionText}`);

            await Utils.delay(1000);
            UIManager.updateQuestionCounts();
          }

          if (isSingleStep) {
            // 如果是单步运行，执行一次后设置 isRunning 为 false
            this.isRunning = false;
            this.updateStartButton();
            UIManager.updateQuestionCounts(); // 确保在这里更新统计栏
            UIManager.showFeedback("单步运行完成", "success"); // 提供成功的反馈
            break; // 退出循环
          } else {
            UIManager.updateQuestionCounts(); // 更新统计栏
          }
        }

        UIManager.updateQuestionCounts();
        if (allAnswered) {
          this.isRunning = false;
          this.updateStartButton(); // 更新按钮状态
          const startButton = document.getElementById("start");
          startButton.textContent = "自动运行";
          startButton.style.backgroundColor = "#4752C4";
          console.info("问题已经回答完毕.");
        }
      } catch (err) {
        console.error(`在提问时发生错误: ${err}`);
        this.isRunning = false;
      }
    },
    hasUnansweredQuestions: function () {
      const questions = Array.from(document.getElementsByClassName("question"));
      return questions.some(
        (question) => !question.classList.contains("answered")
      );
    },

    updateStartButton: function () {
      const startButton = document.getElementById("start");
      if (this.isRunning) {
        startButton.textContent = "停止运行";
        startButton.style.backgroundColor = "red";
      } else {
        startButton.textContent = "自动运行";
        startButton.style.backgroundColor = "#4752C4";
      }
    },
    askQuestionInstant: async function (question) {
      return new Promise((resolve, reject) => {
        if (!question) {
          console.error("No question provided");
          return reject("No question provided");
        }
        try {
          const inputBox = document.querySelector("textarea");
          if (!inputBox) {
            return reject("Could not find textarea for input.");
          }
          inputBox.value = question;
          const event = new Event("input", { bubbles: true });
          inputBox.dispatchEvent(event);

          // 轮询检查是否停止运行
          const interval = setInterval(async () => {
            if (!this.isRunning) {
              clearInterval(interval);
              console.error("Stopped by user");
              return reject("Stopped by user");
            }

            const sendButton = document.querySelector(
              '[data-testid="send-button"]'
            );

            if (sendButton && !sendButton.hasAttribute("disabled")) {
              clearInterval(interval);
              sendButton.click();
              await Utils.delay(20000);
              await this.waitForResponseCompletion();
              return resolve();
            }
          }, 1000);
        } catch (err) {
          console.error(`在提问时发生错误: ${err}`);
          reject(err);
        }
      });
    },

    // 等待回答完成的函数
    waitForResponseCompletion: async function () {
      const checkIntervalTime = 2000; // 定时器间隔时间
      const maxAttempts = 30; // 最大尝试次数

      return new Promise((resolve) => {
        let attempts = 0;
        const checkInterval = setInterval(() => {
          console.info("轮询检测是否结束", attempts);
          const sendButton = document.querySelector(
            '[data-testid="send-button"]'
          );
          if (sendButton || attempts >= maxAttempts) {
            clearInterval(checkInterval);
            return resolve();
          }
          attempts++;
        }, checkIntervalTime);
      });
    },
  };
  /** 工具和辅助功能模块 */
  const Utils = {
    // 生成 UUID
    generateUUID(length = 4) {
      const dict =
        "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
      let str = "";
      let i = length;
      const len = dict.length;
      while (i--) str += dict[(Math.random() * len) | 0];
      return str;
    },
    // 延迟函数
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    // 清除本地存储中的数据
    clearCache() {
      if (typeof Storage !== "undefined") {
        if (confirm("你确定要清空所有缓存的数据吗？")) {
          try {
            localStorage.clear();
            console.info("缓存已清空!");
          } catch (e) {
            console.error("清空缓存失败，错误信息: ", e);
          }
        }
      } else {
        alert("抱歉，您的浏览器不支持 Web Storage...");
      }
    },
    // 导出数组文件
    exportArrayToTxt(arrayOfObjects, fileName = "output") {
      const splitChar = localStorage.getItem("splitChar") || defaultSymbol;

      // 将对象数组转换为文本
      const textContent = arrayOfObjects.join(`${splitChar} \n\n`); // 在对象之间添加空行

      // 创建 Blob 对象
      const blob = new Blob([textContent], { type: "text/plain" });

      // 创建下载链接
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileName;

      // 触发点击下载链接
      downloadLink.click();
    },
    exportObjToJson(obj, fileName = "DALLE") {
      const jsonData = JSON.stringify(obj);
      const blob = new Blob([jsonData], { type: "application/json" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileName;
      downloadLink.click();
    },
  };

  /** 初始化函数 */
  function init() {
    // 创建主边栏和设置边栏
    UIManager.createMainSidebar();
    UIManager.createSettingSidebar();
    // 绑定事件监听器
    bindEventHandlers();
    SettingsManager.bindThemeSwitch();

    // 加载设置
    SettingsManager.loadSettings();
    // 加载本地存储中的问题
    DataManager.loadQuestions();

    // 绑定底部删除按钮的事件处理程序
    document
      .getElementById("deleteCompleted")
      .addEventListener("click", EventHandler.handleDeleteCompleted);
    document
      .getElementById("deletePending")
      .addEventListener("click", EventHandler.handleDeletePending);
  }
  // 打开设置界面的函数
  function openSettings() {
    document.getElementById("sidebar").style.display = "none";
    document.getElementById("settingSidebar").style.display = "block";
    SettingsManager.loadSettings();
  }
  // 返回主边栏
  function backToMainSidebar() {
    SettingsManager.saveSettings();
    document.getElementById("settingSidebar").style.display = "none";
    document.getElementById("sidebar").style.display = "";
  }
  // 用于更换SVG并设置计时器的函数
  function setupDeleteConfirmation(deleteButton, revertToOriginalSVG) {
    deleteButton.innerHTML = GlobalSVG.deleteConfirm; // 使用确认删除的SVG
    deleteButton.setAttribute("data-ready-to-delete", "true");
    // 设置一个3秒的计时器，以恢复原始 SVG
    setTimeout(() => {
      if (deleteButton.getAttribute("data-ready-to-delete") === "true") {
        revertToOriginalSVG();
      }
    }, 3000);
  }
  // 用于恢复原始 SVG 的函数
  function revertToOriginalSVG(deleteButton) {
    deleteButton.innerHTML = GlobalSVG.deleteSVG; // 恢复原始SVG
    deleteButton.removeAttribute("data-ready-to-delete");
  }
  // 用于执行删除操作的函数
  function performDeletion(questionUuid, questionDiv, deleteButton) {
    DataManager.deleteQuestion(questionUuid);
    questionDiv.remove();
    UIManager.updateQuestionCounts();
    DataManager.removeFromLocalStorage(questionUuid);
    UIManager.showFeedback("问题已删除", "success");
    revertToOriginalSVG(deleteButton);
  }
  // function isDalle() {
  //   const title = document.querySelector('div[aria-haspopup="menu"]').innerText;
  //   return title.startsWith("DALL");
  // }
  // 用于导出操作的函数
  function exportData(haveImg = false) {
    if (haveImg) {
      const text = exportUserText();
      const img = exportImgs();
      const output = [];
      if (text) {
        for (let i = 0; i < text.length; i++) {
          const val = {
            prompt: text[i],
            image_urls: img[i] || "",
          };
          output.push(val);
        }
      }

      Utils.exportObjToJson({ data: output });
    } else {
      const text = exportGPTText();
      text && Utils.exportArrayToTxt(text);
    }
  }
  function exportUserText() {
    const assistants = document.querySelectorAll(
      'div[data-message-author-role="user"]'
    );

    if (assistants.length === 0)
      return UIManager.showFeedback("暂无内容!", "error");

    const data = [];
    assistants.forEach((div) => {
      const textNodes = Array.from(div.childNodes).filter(
        (node) => node.textContent.trim() !== ""
      );
      const texts = textNodes
        .map((textNode) => textNode.textContent.trim())
        .join(" \n");
      data.push(texts);
    });

    return data;
  }
  function exportGPTText() {
    const assistants = document.querySelectorAll(
      'div[data-message-author-role="assistant"] > div'
    );

    if (assistants.length === 0)
      return UIManager.showFeedback("暂无内容!", "error");

    const data = [];
    for (let index = 0; index < assistants.length; index++) {
      data.push(assistants[index].innerText.trim());
    }
    return data;
  }
  function exportImgs() {
    const assistants = document.querySelectorAll(
      'div[data-message-author-role="assistant"]'
    );

    if (assistants.length === 0)
      return UIManager.showFeedback("暂无内容!", "error");

    const data = [];
    for (const item of assistants) {
      const imgs = item.previousSibling?.childNodes;
      if (!imgs) {
        data.push([]);
        continue;
      } // 兼容无图片情况

      const imgSrc = [];
      for (const img of imgs) {
        const imgElement = img.getElementsByTagName("img")[0];
        const src = imgElement.getAttribute("src");
        imgSrc.push(src);
      }
      data.push(imgSrc);
    }

    return data;
  }

  init();
})();
// ==UserScript==
// @name         PreChatGPT - ChatGPT批量提问自动化工具
// @description  使用PreChatGPT来自动化您与ChatGPT的对话。支持批量提交问题，并逐个输入到ChatGPT进行询问，以节省时间并提高会话效率。
// @version      3.8
// @author       zizhanovo
// @namespace    https://github.com/zizhanovo/Pre-ChatGPT
// @supportURL   https://github.com/zizhanovo/Pre-ChatGPT
// @license      GPL-2.0-only
// @match        *://chatgpt.com
// @match        *://chatgpt.com/*
// @grant        GM_addStyle
// @icon         data:image/svg+xml;utf8,%3Csvg t="1706424916374" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16099" width="48" height="48"%3E%3Cpath d="M851.2 172.8C664.32-14.08 359.68-14.08 172.16 172.8c-186.88 186.88-186.88 491.52 0 679.04A483.52 483.52 0 0 0 512 992c122.88 0 245.76-46.72 339.2-140.16 90.88-90.88 140.8-211.2 140.8-339.2 0-128.64-49.92-249.6-140.8-339.84z m-90.24 588.16a352.448 352.448 0 0 1-497.92 0c-136.96-136.96-136.96-360.32 0-497.92a352.448 352.448 0 0 1 497.92 0A349.44 349.44 0 0 1 864 512c0 94.08-36.48 182.4-103.04 248.96z" fill="%23020202" p-id="16100"%3E%3C/path%3E%3Cpath d="M497.28 256c-2.56 0-4.48 1.28-5.76 3.84L348.8 555.52c-1.28 1.92-0.64 4.48 0.64 6.4 0.64 1.28 3.2 2.56 5.12 2.56h101.76l-24.32 196.48c-0.64 3.2 1.28 5.76 3.84 7.04h2.56c1.92 0 3.84-0.64 5.12-2.56l209.92-300.16c1.28-1.92 1.28-4.48 0.64-6.4a6.72 6.72 0 0 0-5.76-3.2h-89.6l115.84-189.44a5.76 5.76 0 0 0 0-6.4c-0.64-2.56-3.2-3.84-5.12-3.84H497.28z" fill="%23020202" p-id="16101"%3E%3C/path%3E%3C/svg%3E
// @downloadURL https://update.greasyfork.org/scripts/466781/PreChatGPT%20-%20ChatGPT%E6%89%B9%E9%87%8F%E6%8F%90%E9%97%AE%E8%87%AA%E5%8A%A8%E5%8C%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/466781/PreChatGPT%20-%20ChatGPT%E6%89%B9%E9%87%8F%E6%8F%90%E9%97%AE%E8%87%AA%E5%8A%A8%E5%8C%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";
  GM_addStyle(`
    :root {
      --background-color: #fafafa;
      --text-color: #333;
      --border-color: #ccc;
      --hover-background-color: #e6e6e6;
      --button-background-color: #5865f2;
      --button-hover-background-color: #4752c4;
      --shadow-color: rgba(0, 0, 0, 0.1);
      --textarea-border-color: #ccc;
      --button-text-color: white;
      --summary-background-color: #f5f5f5;
      --summary-border-color: #e8e8e8;
      --summary-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
      --input-background-color: rgba(255, 255, 255, 0.8);
      --input-border-color: #ccc;
      --input-text-color: #333;
      --start-button-background-color: #5865f2;
      --start-button-hover-background-color: #4752c4;
    }
    .my-app-night-mode {
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
      --start-button-background-color: #5865f2;
      --start-button-hover-background-color: #4752c4;
      --textarea-background-color-night: #242424;
      --textarea-text-color-night: #ddd;
    }
    .my-app-night-mode #questionInput,
    .my-app-night-mode #additionalInput {
      background-color: var(--textarea-background-color-night);
      color: var(--textarea-text-color-night);
      border-color: var(--textarea-border-color);
    }
    .my-app-night-mode .question-text[readonly] {
      background-color: var(--textarea-background-color-night);
      color: var(--textarea-text-color-night);
    }
    .my-app-night-mode #toggleSidebar svg,
    .my-app-night-mode .delete-button svg {
      fill: #757575;
    }
    .my-app-night-mode #sidebar h2:hover {
      color: #b3b3b3;
      background-color: var(--hover-background-color);
    }
    .my-app-night-mode #settingSidebar h2:hover {
      color: #b3b3b3;
      background-color: var(--hover-background-color);
    }
    .my-app-night-mode .question button {
      background-color: var(--button-background-color-night);
      border: 1px solid var(--button-border-color-night);
      color: var(--button-text-color-night);
    }
    .my-app-night-mode .question button:hover {
      background-color: var(--button-hover-background-color-night);
      border-color: var(--button-hover-border-color-night);
    }
    .my-app-night-mode .question button:active {
      background-color: var(--button-active-background-color-night);
      border-color: var(--button-active-border-color-night);
    }
    .my-app-night-mode .original-icon svg {
      fill: #757575;
    }
    .my-app-night-mode .button-container button {
      background-color: #45a049;
      color: white;
      border: 1px solid #39843c;
    }
    .my-app-night-mode .button-container button:hover {
      background-color: #39843c;
      color: #ddd;
    }
  .my-app-night-mode .summary-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #45a049;
    color: white;
    border: 1px solid #39843c;
    padding: 5px;
    border-radius: 4px;
    text-decoration: none;
  }
  .my-app-night-mode .summary-action:hover {
    background-color: #39843c;
    color: #ddd;
  }
  .my-app-night-mode .summary-action svg {
    fill: white;
  }
    .button-container button {
      height: 40px;
      border: 1px solid var(--border-color);
    }
    #sidebar {
      position: fixed;
      right: 0;
      top: 45%;
      transform: translateY(-50%);
      width: 270px;
      padding: 20px;
      background-color: var(--background-color);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      box-shadow: 0 0 15px var(--shadow-color);
      transition: all 0.3s ease-in-out;
      overflow: hidden;
      z-index: 9999;
    }
    #toggleSidebar {
      position: absolute;
      top: 45%;
      z-index: 9999;
      left: 0;
      transform: translateY(-50%);
      width: 30px;
      height: 30px;
      background: var(--background-color);
      border: 1px solid var(--border-color);
      border-radius: 50%;
      box-shadow: 0 0 15px var(--shadow-color);
      cursor: pointer;
      transition: left 0.3s, border 0.3s, background 0.3s;
      display: flex;
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
      height: 15px;
      width: 15px;
      transition: all 0.3s ease-in-out;
    }
    #sidebar.collapsed {
      width: 60px;
    }
    #sidebar.collapsed #toggleSidebar {
      left: 15px;
    }
    #sidebar h2 {
      text-align: center;
      color: var(--text-color);
      font-size: 1.4em;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 10px;
      transition: color 0.3s ease, background-color 0.3s ease;
    }
    #sidebar textarea {
      width: 100%;
      height: 100px;
      margin-bottom: 10px;
      padding: 10px;
      border: 1px solid var(--textarea-border-color);
      border-radius: 5px;
      transition: border-color 0.3s;
      resize: none;
    }
    #sidebar textarea:focus {
      border-color: var(--focus-border-color);
      outline: none;
    }
    #sidebar button {
      width: 100%;
      padding: 10px;
      margin-bottom: 2px;
      border: none;
      border-radius: 5px;
      color: var(--button-text-color);
      cursor: pointer;
      transition: background-color 0.3s;
    }
    #submitQuestion,
    #start {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      color: var(--button-text-color);
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      outline: none;
      box-shadow: 0px 5px 10px var(--shadow-color);
    }
    #submitQuestion {
      background-color: var(--button-background-color);
    }
    #submitQuestion:active {
      box-shadow: 0px 2px 5px var(--shadow-color);
      transform: translateY(3px);
    }
    #submitQuestion:hover {
      background-color: var(--button-hover-background-color);
    }
    #start {
      background-color: var(--start-button-background-color);
    }
    #start:active {
      box-shadow: 0px 2px 5px var(--shadow-color);
      transform: translateY(3px);
    }
    #start:hover {
      background-color: var(--start-button-hover-background-color);
    }
    #questionList {
      margin-top: 8px;
      max-height: 200px;
      overflow-y: auto;
    }
    .questionContainer {
      display: flex;
      align-items: center;
    }
    .question {
      margin-bottom: 2px;
      padding: 5px;
      border: 1px solid var(--border-color);
      border-radius: 5px;
      background-color: var(--background-color);
      color: var(--text-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background-color 0.3s;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .question:hover {
      background-color: var(--hover-background-color);
    }
    .question:before {
      content: "❌";
      margin-right: 4px;
      color: var(--text-color);
    }
    .question.answered {
      color: #aaa;
    }
    .question.answered:before {
      content: "✅";
    }
    .question button {
      margin-left: 0px;
      background: none;
      border: 1px solid var(--border-color);
      box-sizing: border-box;
      cursor: pointer;
      transition: color 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .question button:hover {
      color: var(--button-hover-background-color);
    }
    .question .button-container {
      margin-left: auto;
      display: flex;
      gap: 0px;
    }
    .button-container button {
      width: 24px;
      padding: 0;
      border: 2px solid red;
    }
    .delete-button-wrapper {
      display: flex;
      align-items: center;
      height: 100%;
    }
    .question button svg {
      width: 18px;
      height: 18px;
      margin: auto;
      pointer-events: none;
    }
    .button-group {
      display: flex;
      justify-content: space-between;
    }
    .question-text {
      flex-grow: 1;
      flex-shrink: 1;
      flex-basis: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border: none;
      outline: none;
      color: var(--text-color);
    }
    #questionSummary {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      padding: 10px;
      background-color: var(--summary-background-color);
      border-radius: 10px;
      box-shadow: var(--summary-box-shadow);
      transition: all 0.3s ease-in-out;
      height: 90px;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 45%;
      padding: 10px;
      background-color: var(--background-color);
      border: 1px solid var(--summary-border-color);
      border-radius: 10px;
      box-shadow: var(--summary-box-shadow);
      transition: all 0.3s ease-in-out;
    }
    .summary-item:hover {
      box-shadow: var(--summary-box-shadow);
      transform: scale(1.02);
    }
    .icon-count-container {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      width: 50%;
    }
    .summary-icon {
      font-size: 18px;
      margin-right: 10px;
      color: var(--text-color);
    }
    .summary-count {
      font-size: 18px;
      margin-right: 10px;
      color: var(--text-color);
    }
    .button-container {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 50%;
      padding: 3px;
      height: 100%;
    }
    .summary-action {
      display: flex;
      justify-content: center;
      align-items: center;
      text-decoration: none;
      border: 1px solid var(--border-color);
      color: var(--text-color);
      background-color: transparent;
      padding: 4px 4px;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      width: 100%;
      height: 100%;
    }
    .summary-action:hover {
      background-color: var(--hover-background-color);
    }
    .vertical-text {
      writing-mode: vertical-rl;
      text-orientation: upright;
      font-size: 20px;
      margin: 0 auto;
      color: var(--text-color);
    }
    #settingSidebar {
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 270px;
      padding: 20px;
      background-color: var(--background-color);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      box-shadow: var(--shadow-color) 0 0 15px;
      transition: all 0.3s ease-in-out;
      overflow: hidden;
    }
    #settingSidebar h2 {
      text-align: center;
      color: var(--text-color);
      font-size: 1.4em;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 10px;
      transition: color 0.3s ease, background-color 0.3s ease;
    }
    .input-row {
      margin-bottom: 10px;
    }
    .input-row label {
      margin-top: 7px;
      display: block;
      margin-bottom: 5px;
      color: var(--text-color);
      font-weight: bold;
    }
    .input-row input[type="text"],
    .input-row input[type="number"] {
      width: 100%;
      padding: 10px;
      border: 1px solid var(--border-color);
      border-radius: 5px;
      transition: border-color 0.3s;
      font-size: 14px;
      font-family: Arial, sans-serif;
      color: var(--input-text-color);
      background-color: var(--input-background-color);
    }
    .input-row input[type="text"]:focus,
    .input-row input[type="number"]:focus {
      border-color: #007bff;
      outline: none;
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
      width: 80px;
      margin-left: 10px;
      padding: 5px;
      border: 1px solid var(--input-border-color);
      border-radius: 5px;
      transition: border-color 0.3s;
      width: 70px;
      text-align: right;
      background-color: var(--input-background-color);
      color: var(--input-text-color);
    }
    .mode-option {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      padding: 10px;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      transition: background-color 0.3s, box-shadow 0.3s;
      width: 70%;
      margin: 10px auto;
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
      width: 100%;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      background-color: var(--button-background-color);
      color: var(--button-text-color);
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      outline: none;
      box-shadow: 0px 5px 10px var(--shadow-color);
    }
    .clear-cache-btn:active {
      box-shadow: 0px 2px 5px var(--shadow-color);
      transform: translateY(3px);
    }
    .clear-cache-btn:hover {
      background-color: var(--button-hover-background-color);
    }
    .button-container1 {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 30px;
    }
    #openSetting {
      font-size: 24px;
      color: var(--text-color);
      transition: all 0.3s ease;
      cursor: pointer;
    }
    #openSetting:hover {
      color: var(--text-color-hover);
      text-shadow: 2px 2px 4px var(--shadow-color);
    }
    #openSetting:active {
      transform: scale(0.97);
    }
    #backToMainSidebar {
      font-size: 24px;
      color: var(--text-color);
      transition: all 0.3s ease;
      cursor: pointer;
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
      font-size: 1em;
      width: 100%;
      max-width: 600px;
      box-sizing: border-box;
      margin: 0;
      background-color: var(--dropdown-background-color);
      color: var(--dropdown-text-color);
      border: 1px solid var(--input-border-color);
    }
    .dropdown {
      display: block;
      width: 100%;
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 1px 0 1px var(--shadow-color);
      padding: 0.5em 0.75em;
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
      background-color: var(--input-background-color);
      box-shadow: 0 2px 5px var(--shadow-color);
      border-radius: 5px;
      padding: 10px;
      margin-bottom: 10px;
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
      border: none;
      border-radius: 5px;
      background-color: var(--button-background-color);
      color: var(--button-text-color);
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      outline: none;
      box-shadow: var(--shadow-color) 0px 5px 10px;
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
      content: "秒";
      margin-left: 5px;
    }
    .button-group {
      display: flex;
      flex-direction: row;
      gap: 5px;
    }
    #start {
      display: block;
      margin-top: 5px;
    }
    #stepRun {
      background-color: var(--button-background-color);
      color: var(--button-text-color);
      font-size: 16px;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.3s;
    }
    #stepRun:hover {
      background-color: var(--button-hover-background-color);
    }
    #stepRun:active {
      background-color: var(--button-active-background-color);
      transform: translateY(2px);
      box-shadow: var(--shadow-color) 0px 2px 5px;
    }
    .input-row textarea {
      color: var(--input-text-color);
      font-size: 14px;
      padding: 8px;
      border-radius: 5px;
      border: 1px solid var(--input-border-color);
      width: 100%;
      box-sizing: border-box;
      resize: none;
      min-height: 50px;
      overflow-y: auto;
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
      margin-top: 8px;
      margin-bottom: 8px;
      padding: 10px;
      border-radius: 5px;
      text-align: center;
      display: none;
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
      display: inline-block;
      height: 24px;
      position: relative;
      width: 48px;
      margin-top: 10px;
    }
    .theme-switch input {
      display: none;
    }
    .slider {
      background-color: #ccc;
      bottom: 0;
      cursor: pointer;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      transition: 0.4s;
    }
    .slider:before {
      background-color: white;
      bottom: 4px;
      content: "";
      height: 16px;
      left: 4px;
      position: absolute;
      transition: 0.4s;
      width: 16px;
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
    .my-app-night-mode .original-icon svg {
      fill: #757575;
    }
    `);
  const GlobalSVG = {
    original: `<svg t="1684556652392" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2423" width="20" height="20"><path d="M202.666667 256h-42.666667a32 32 0 0 1 0-64h704a32 32 0 0 1 0 64H266.666667v565.333333a53.333333 53.333333 0 0 0 53.333333 53.333334h384a53.333333 53.333333 0 0 0 53.333333-53.333334V352a32 32 0 0 1 64 0v469.333333c0 64.8-52.533333 117.333333-117.333333 117.333334H320c-64.8 0-117.333333-52.533333-117.333333-117.333334V256z m224-106.666667a32 32 0 0 1 0-64h170.666666a32 32 0 0 1 0 64H426.666667z m-32 288a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z m170.666666 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z" fill="#000000" p-id="2424"></path></svg>`, // 原始SVG
    deleteConfirm: `<svg t="1705597990331" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4215" width="32" height="32"><path d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m250.56-656.768l-40.96-41.152A19.008 19.008 0 0 0 707.84 320a19.008 19.008 0 0 0-13.888 6.08l-246.4 247.68L330.176 455.04a20.032 20.032 0 0 0-13.888-5.44 20.032 20.032 0 0 0-13.824 5.44l-40.96 41.216A20.288 20.288 0 0 0 256 510.208c0 5.248 1.792 9.856 5.44 13.888l172.224 173.824a17.408 17.408 0 0 0 13.568 6.08 17.408 17.408 0 0 0 13.568-6.08l301.76-302.784A20.672 20.672 0 0 0 768 380.8a18.56 18.56 0 0 0-5.44-13.632z" fill="#d81e06" p-id="4216"></path></svg>`, // 确认删除的SVG
  };
  // 用户界面模块
  const UIManager = {
    createMainSidebar: function () {
      const sidebar = document.createElement("div");
      sidebar.id = "sidebar";
      sidebar.innerHTML = `
              <div id="toggleSidebar">
                <svg viewBox="0 0 24 24" id="icon-expand">
                  <path d="M10 18h4v-2h-4v2zM3 13h18v-2H3v2zm0 7h12v-2H3v2zm0-14v2h18V6H3z"/>
                </svg>
                <svg viewBox="0 0 24 24" id="icon-collapse" style="display: none;">
                  <path d="M10 20h4V4h-4v16zm0-18H6v20h4V2zm8 0h-4v20h4V2z"/>
                </svg>
              </div>
              <section id="sidebarContent">
                <h2 id="openSetting" style="cursor: pointer;">PreChat 设置</h2>
                <textarea id="questionInput" placeholder="请输入您的提示词 , 可批量输入 , 默认 + 为拆分"></textarea>
                <div class="button-group">
                <button id="submitQuestion">提交</button>
                <button id="stepRun">单步运行</button>
              </div>
              <div class="button-group">
                <button id="start">自动运行</button>
              </div>
              <div id="feedbackBar" class="feedback-bar" style="display: none;"></div>
                <ul id="questionList"></ul>
                <div id="questionSummary" class="question-summary">
                <div class="summary-item">
                    <div class="icon-count-container">
                        <div class="icon-container">
                            <span class="summary-icon">✅</span>
                        </div>
                        <div class="count-container">
                            <span class="summary-count" id="completedCount">0</span>
                        </div>
                    </div>
                    <div class="button-container">
                        <a href="#" class="summary-action" id="deleteCompleted">
                        ${GlobalSVG.original}
                        </a>
                    </div>
                </div>
                <div class="summary-item">
                    <div class="icon-count-container">
                        <div class="icon-container">
                            <span class="summary-icon">❌</span>
                        </div>
                        <div class="count-container">
                            <span class="summary-count" id="pendingCount">0</span>
                        </div>
                    </div>
                    <div class="button-container">
                        <a href="#" class="summary-action" id="deletePending">
                        ${GlobalSVG.original}
                        </a>
                    </div>
                </div>
              </div>
              </section>
            `;
      document.body.appendChild(sidebar);
      const savedTheme = localStorage.getItem("selectedTheme") || "light";
      if (savedTheme === "dark") {
        document.documentElement.classList.add("my-app-night-mode");
      }
    },
    createSettingSidebar: function () {
      const settingSidebar = document.createElement("div");
      settingSidebar.id = "settingSidebar";
      settingSidebar.style.display = "none";
      settingSidebar.innerHTML = `
          <section id="sidebarContent">
          <h2 id="backToMainSidebar" style="cursor: pointer;">PreChat 保存</h2>
          <!-- 主题切换 -->
          <div class="input-row">
            <div class="theme-switch-wrapper">
              <span class="theme-icon sun-icon">☀️</span>
              <label class="theme-switch">
                <input type="checkbox" id="themeSwitch">
                <div class="slider round"></div>
              </label>
              <span class="theme-icon moon-icon">🌙</span>
            </div>
          </div>
          <!-- 拆分符号 -->
          <div class="input-row">
            <label for="splitCharInput">拆分符号:</label>
            <input type="text" id="splitCharInput" placeholder="留空则默认为 + " />
          </div>
          <!-- 输出增强 -->
          <div class="input-row">
            <label for="additionalInput">输出增强:</label>
            <textarea id="additionalInput" placeholder="例如，零样本提示（请一步步思考），少样本提示（提供输出案例），思维链/树（提供思考过程）等"></textarea>
          </div>
          <!-- 运行模式 -->
          <div class="input-row">
          <div id="runMode">
          <div class="mode-option instant" id="instantOption">
              <input type="radio" id="instant" name="mode" value="instant" checked>
              <label for="instant">即时</label>
          </div>
          <div class="mode-option delayed" id="delayedOption">
              <input type="radio" id="delayed" name="mode" value="delayed">
              <label for="delayed">延时</label>
              <input type="number" id="delayTime" placeholder="432">
          </div>
      </div>
          </div>
          <!-- 清空缓存按钮 -->
          <div class="button-container1" style="display: inline-block;">
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
          button.innerHTML = GlobalSVG.original;
          break;
      }
      if (clickHandler) {
        button.addEventListener("click", clickHandler);
      }
      return button;
    },
    showFeedback: function (message, type = "normal") {
      const feedbackBar = document.getElementById("feedbackBar");
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

    createQuestionDiv: function (question, answered) {
      const div = document.createElement("div");
      div.className = "question";
      div.draggable = true;
      const questionContainer = document.createElement("div");
      questionContainer.style.display = "flex";
      questionContainer.style.justifyContent = "center";
      const questionText = document.createElement("textarea");
      questionText.className = "question-text";
      questionText.value = question;
      questionText.readOnly = true;
      questionText.style.border = "none";
      questionText.style.height = "42px";
      questionText.style.resize = "none";
      questionText.style.margin = "auto";
      questionText.style.width = "140px";
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
      const questionDiv = this.createQuestionDiv(question, answered); // 确保使用this引用
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
      // 清除原始输入框的内容
      const input = document.getElementById("questionInput");
      if (input) {
        input.value = "";
      } else {
        UIManager.showFeedback("Input element not found", "error");
      }

      // 清除文本区域的内容
      const textarea = document.getElementById("prompt-textarea");
      if (textarea) {
        textarea.value = "";
      } else {
        UIManager.showFeedback("Prompt textarea element not found", "error");
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
      questionText.style.whiteSpace =
        questionText.style.whiteSpace === "nowrap" ? "normal" : "nowrap";
    },
    toggleSidebar: function () {
      const sidebar = document.getElementById("sidebar");
      const collapseIcon = document.getElementById("icon-collapse");
      const expandIcon = document.getElementById("icon-expand");
      sidebar.classList.toggle("collapsed");
      if (sidebar.classList.contains("collapsed")) {
        collapseIcon.style.display = "none";
        expandIcon.style.display = "block";
      } else {
        expandIcon.style.display = "none";
        collapseIcon.style.display = "block";
      }
    },
  };
  //设置模块
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
        // 具体的错误处理逻辑
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
    // 类似地，更新其他 save 方法
    // 加载设置
    loadSettings: function () {
      try {
        this.loadThemeSetting();
        this.loadSplitCharSetting();
        this.loadAdditionalSetting();
        this.loadRunModeSetting();
        this.loadDelayTimeSetting();
      } catch (err) {
        UIManager.showFeedback("加载设置时出错", "error");
        // 可以添加一些用户友好的错误处理逻辑
      }
    },
    applyTheme: function (theme) {
      if (theme === "dark") {
        document.documentElement.classList.add("my-app-night-mode");
        const themeSwitch = document.getElementById("themeSwitch");
        if (themeSwitch) {
          themeSwitch.checked = true;
        }
        const themeSwitchText = document.getElementById("themeSwitchText");
        if (themeSwitchText) {
          themeSwitchText.textContent = "白天模式";
        }
      } else {
        document.documentElement.classList.remove("my-app-night-mode");
        const themeSwitch = document.getElementById("themeSwitch");
        if (themeSwitch) {
          themeSwitch.checked = false;
        }
        const themeSwitchText = document.getElementById("themeSwitchText");
        if (themeSwitchText) {
          themeSwitchText.textContent = "夜间模式";
        }
      }
    },
    loadThemeSetting: function () {
      const savedTheme = localStorage.getItem("selectedTheme") || "light";
      this.applyTheme(savedTheme);
    },
    bindThemeSwitch: function () {
      const themeSwitch = document.getElementById("themeSwitch");
      themeSwitch.addEventListener("change", function () {
        const newTheme = themeSwitch.checked ? "dark" : "light";
        localStorage.setItem("selectedTheme", newTheme);
        SettingsManager.applyTheme(newTheme);
      });
    },
    saveSplitCharSetting: function () {
      const splitCharInput = document.getElementById("splitCharInput");
      localStorage.setItem("splitChar", splitCharInput.value || "+");
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
      localStorage.setItem("delayTime", delayTimeInput.value || "300");
    },
    loadSplitCharSetting: function () {
      const splitCharInput = document.getElementById("splitCharInput");
      splitCharInput.value = localStorage.getItem("splitChar") || "+";
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
      delayTimeInput.value = localStorage.getItem("delayTime") || "300";
    },
    // ... 可以添加更多设置相关的函数 ...
  };
  //数据管理模块
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
    // 添加问题到本地存储
    addQuestion: function (questionText, uuid) {
      try {
        if (!questionText) {
          throw new Error("问题内容不能为空。");
        }
        this.storedQuestions.set(uuid, { text: questionText, answered: false });
        this.saveQuestionsToLocalStorage();
        UIManager.showFeedback("问题提交成功", "success");
        UIManager.updateQuestionCounts();
      } catch (err) {
        UIManager.showFeedback("问题提交错误: " + err.message, "error");
      }
    },
    // 从输入获取问题
    getQuestionsFromInput: function (inputElement) {
      const splitChar = localStorage.getItem("splitChar") || "+";
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
    getQuestionsFromLocalStorage: function () {
      try {
        let storedQuestions = localStorage.getItem("questions");
        storedQuestions = storedQuestions ? JSON.parse(storedQuestions) : [];
        storedQuestions = storedQuestions.map((rawQuestion) => ({
          id: rawQuestion.id,
          text: rawQuestion.text,
          answered: rawQuestion.answered,
        }));
        // 可以选择在这里添加一个简洁的成功通知
        // UIManager.showFeedback('本地存储中的问题已成功加载', 'success');
        return storedQuestions;
      } catch (err) {
        UIManager.showFeedback(
          "从本地存储检索问题时出错: " + err.message,
          "error"
        );
        return [];
      }
    },
    //
    removeFromLocalStorage: async function (questionUUID) {
      return new Promise((resolve, reject) => {
        let storedQuestions = localStorage.getItem("questions");
        storedQuestions = storedQuestions ? JSON.parse(storedQuestions) : [];
        storedQuestions = storedQuestions.filter((q) => q.id !== questionUUID);
        localStorage.setItem("questions", JSON.stringify(storedQuestions));
        resolve(questionUUID);
      });
    },
    // ... 其他数据处理函数 ...
  };
  // 事件处理模块
  const EventHandler = {
    // 处理问题提交
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
            DataManager.addQuestion(question, uuid); // 修改方法名
          });
          UIManager.clearInput();
          UIManager.updateQuestionCounts();
        } catch (error) {
          console.error("处理问题提交时出错:", error);
        }
      },
    // 处理问题点击事件
    handleQuestionClick: function (event) {
      if (event.target.classList.contains("question-text")) {
        UIManager.toggleQuestionTextWhiteSpace(event.target); // 使用UIManager模块切换文本空白
      }
    },
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
        UIManager.showFeedback("点击再次确认删除未回答的问题", "normal");
      } else {
        performDeletion(questionUuid, questionDiv, deleteButton);
      }
    },
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
    // ... 其他事件处理函数 ...
  };
  // 绑定事件监听器函数
  function bindEventHandlers() {
    // 绑定打开设置界面的事件处理
    document
      .getElementById("openSetting")
      .addEventListener("click", openSettings);
    document
      .getElementById("backToMainSidebar")
      .addEventListener("click", backToMainSidebar);
    // 绑定提交问题按钮的事件处理
    document
      .getElementById("submitQuestion")
      .addEventListener("click", EventHandler.handleQuestionSubmission);
    // 绑定问题列表的点击事件，用于处理问题列表中的点击操作
    document
      .getElementById("questionList")
      .addEventListener("click", EventHandler.handleQuestionClick);
    // 绑定切换侧边栏的事件
    document
      .getElementById("toggleSidebar")
      .addEventListener("click", UIManager.toggleSidebar);


    // 绑定增强输入文本区域的自动调整大小事件
    const textarea = document.getElementById("additionalInput");
    if (textarea) {
      textarea.addEventListener("input", Utils.autoResize, false);
    } else {
      UIManager.showFeedback("未找到增强输入的文本区域", "error");
    }
    // 绑定切换运行模式的事件（即时或延时）
    const delayedRadio = document.getElementById("delayed");
    const delayTimeInput = document.getElementById("delayTime");
    delayedRadio.addEventListener("change", function () {
      delayTimeInput.disabled = false; // 启用延时时间输入框
    });
    const instantRadio = document.getElementById("instant");
    instantRadio.addEventListener("change", function () {
      delayTimeInput.disabled = true; // 禁用延时时间输入框
    });
    // 页面加载完成后，从本地存储加载问题列表
    window.addEventListener("load", () => DataManager.loadQuestions());
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
      QuestionAsker.startAskingQuestions();
      QuestionAsker.updateStartButton();
    });
    document
      .getElementById("instantOption")
      .addEventListener("click", function () {
        this.classList.add("selected");
        document.getElementById("delayedOption").classList.remove("selected");
      });
    document
      .getElementById("delayedOption")
      .addEventListener("click", function () {
        this.classList.add("selected");
        document.getElementById("instantOption").classList.remove("selected");
      });
    document
      .getElementById("instantOption")
      .addEventListener("click", function (event) {
        // 防止触发两次事件（一次是块元素，一次是单选按钮）
        if (event.target.type !== "radio") {
          document.getElementById("instant").checked = true;
          this.updateRunModeSelection("instant");
        }
      });
    document
      .getElementById("delayedOption")
      .addEventListener("click", function (event) {
        if (event.target.type !== "radio") {
          document.getElementById("delayed").checked = true;
          this.updateRunModeSelection("delayed");
        }
      });

    // 绑定发送按钮的点击事件
    const sendButton = document.querySelector('[data-testid="send-button"]');

    if (sendButton) {
      sendButton.addEventListener("click", function (event) {
        event.preventDefault(); // 阻止按钮的默认行为
        console.log("发送按钮被点击");
        EventHandler.handleQuestionSubmission();
      });
    }
    
    // 绑定文本输入框的键盘事件
    const inputBox = document.querySelector("#prompt-textarea"); // 替换为实际的选择器
    if (inputBox) {
      inputBox.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault(); // 阻止默认的Enter行为
          console.log("按下了Enter键");
          EventHandler.handleQuestionSubmission();
        }
      });
    }

    // 可以在此处继续添加其他事件绑定...
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
        const questions = Array.from(document.getElementsByClassName("question"));
        const unansweredQuestions = questions.filter(
          (question) => !question.classList.contains("answered")
        );
        if (unansweredQuestions.length === 0) {
          UIManager.showFeedback("没有未回答的问题", "error");
          if (isSingleStep) {
            this.isRunning = false;
            this.updateStartButton();
          }
          return;
        }
        const runMode = localStorage.getItem("runMode");
        const delayTime = parseInt(localStorage.getItem("delayTime") || "300");
        const additionalInput = document.getElementById("additionalInput");
        const enhancementText = additionalInput.value;
        let allAnswered = true;
        for (let i = 0; i < questions.length; i++) {
          UIManager.updateQuestionCounts();
          let allAnswered = false;
          if (!this.isRunning) {
            console.log(`isRunning的状态为：${isRunning}`);
            break;
          }
          const questionDiv = questions[i];
          if (questionDiv.classList.contains("answered")) {
            continue;
          }
          const questionInput = questionDiv.querySelector("textarea.question-text");
          const questionUUID = questionDiv.dataset.id;
          if (!questionDiv.classList.contains("answered")) {
            let questionText = questionInput.value;
            const fullText = Utils.replaceEnhancementSymbol(enhancementText, questionText);
            console.log(`Question text before sending: ${fullText}`); // Debugging statement
            if (runMode === "instant") {
              console.log(`立即提问模式：${fullText}`);
              await Utils.delay(400);
              await this.askQuestionInstant(fullText);
            } else if (runMode === "delayed") {
              console.log(`在提问问题 ${fullText} 前延迟 ${delayTime} 秒`);
              await Utils.delay(delayTime);
              await this.askQuestionDelayed(fullText);
            }
            questionDiv.classList.add("answered");
            DataManager.updateQuestionInLocalStorage(questionUUID, true);
            console.log(`问题已提交并标记为已回答: ${questionText}`);
            UIManager.showFeedback("问题已提交并标记为已回答", "success");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            UIManager.updateQuestionCounts();
          }
          if (isSingleStep) {
            this.isRunning = false;
            this.updateStartButton();
            console.log("单步提问开始，问题：" + fullText);
            UIManager.updateQuestionCounts();
            UIManager.showFeedback("单步运行完成", "success");
            break;
          }
          if (!isSingleStep) {
            UIManager.updateQuestionCounts();
          }
        }
        UIManager.updateQuestionCounts();
        if (allAnswered) {
          this.isRunning = false;
          this.updateStartButton();
          startButton.textContent = "自动运行";
          startButton.style.backgroundColor = "#4752C4";
          console.log("问题已经回答完毕.");
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
        try {
          const inputBox = document.querySelector("textarea");
          if (!inputBox) {
            reject("Could not find textarea for input.");
          }
          console.log(`Setting input value: ${question}`); // Debugging statement
          inputBox.value = question;
          const event = new Event("input", { bubbles: true });
          inputBox.dispatchEvent(event);
          console.log(`Input value after event dispatch: ${inputBox.value}`); // Debugging statement
          const interval = setInterval(async () => {
            if (!this.isRunning) {
              clearInterval(interval);
              reject("Stopped by user");
              return;
            }
            const sendButton = document.querySelector('[data-testid="send-button"]');
            if (sendButton) {
              sendButton.disabled = false; // Ensure the button is enabled
              if (!sendButton.hasAttribute("disabled")) {
                clearInterval(interval);
                sendButton.click();
                await Utils.delay(5000);
                await this.waitForResponseCompletion();
                resolve();
              }
            }
          }, 1000);
        } catch (err) {
          console.error(`Error while asking question: ${err}`);
          reject(err);
        }
      });
    },

    askQuestionDelayed: function (question) {
      return new Promise((resolve, reject) => {
        try {
          if (!question) {
            console.error("No question provided");
            reject("No question provided");
            return;
          }
          const additional = localStorage.getItem("additional") || "";
          const questionToSend = `${question} ${additional}`.trim();
          const inputBox = document.querySelector("textarea");
          if (!inputBox) {
            console.error("Input box not found");
            reject("Input box not found");
            return;
          }
          inputBox.value = questionToSend;
          const event = new Event("input", { bubbles: true });
          inputBox.dispatchEvent(event);
          const sendButton = inputBox.nextElementSibling;
          if (!sendButton) {
            console.error("发送按钮没找到");
            reject("Send button not found");
            return;
          }
          const delayTime = parseInt(localStorage.getItem("delayTime"), 10);
          if (isNaN(delayTime)) {
            console.error("Invalid delayTime");
            reject("Invalid delayTime");
            return;
          }
          setTimeout(() => {
            console.log(`Question sent after delay of ${delayTime} ms`);
            sendButton.click();
            resolve();
          }, delayTime * 1000);
        } catch (error) {
          console.error(`Error in askQuestionDelayed: ${error}`);
          reject(error);
        }
      });
    },
    // 等待回答完成的函数
    waitForResponseCompletion: async function () {
      let lastChar = "";
      let consistentCount = 0;
      const endingPunctuation = [".", "！", "。", "?", "？", "!", "…"];
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          let items = document.querySelectorAll(
            'div[data-message-author-role="assistant"] div.markdown.prose.w-full'
          );
          if (items.length === 0) return;
          let lastResponse = items[items.length - 1].innerText.trim();
          if (lastResponse.length === 0) return;
          let currentLastChar = lastResponse[lastResponse.length - 1];
          if (lastChar === currentLastChar) {
            consistentCount++;
            if (
              consistentCount >= 3 &&
              endingPunctuation.includes(currentLastChar)
            ) {
              clearInterval(checkInterval);
              resolve();
            }
          } else {
            consistentCount = 0;
          }
          lastChar = currentLastChar;
        }, 100);
      });
    },
  };
  // 工具和辅助功能模块
  const Utils = {
    // 生成 UUID
    generateUUID: function () {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    // 延迟函数
    delay: function (ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    replaceEnhancementSymbol: function (enhancementText, questionText) {
      if (!enhancementText) {
        return questionText;
      }
      const bracketPatterns = [
        { regex: /\【(.*?)\】/g, placeholder: "【】" },
        { regex: /\{(.*?)\}/g, placeholder: "{}" },
        { regex: /\（(.*?)\）/g, placeholder: "（）" },
        { regex: /\((.*?)\)/g, placeholder: "()" },
        { regex: /\[(.*?)\]/g, placeholder: "[]" },
      ];
      let isMatchFound = false;
      let isPlaceholderPresent = /(\【】|\{\}|\（）|\(\)|\[\]|###)/.test(
        enhancementText
      );
      bracketPatterns.forEach((pattern) => {
        let matches;
        while ((matches = pattern.regex.exec(questionText)) !== null) {
          isMatchFound = true;
          enhancementText = enhancementText.replace(
            pattern.placeholder,
            matches[1]
          );
          pattern.placeholder = "";
        }
        enhancementText = enhancementText.replace(
          new RegExp(pattern.placeholder, "g"),
          ""
        );
      });
      if (isPlaceholderPresent) {
        enhancementText = enhancementText.replace(/###/g, questionText);
      } else if (!isMatchFound) {
        enhancementText = questionText + " " + enhancementText;
      }
      return enhancementText;
    },
    // 清除本地存储中的数据
    clearCache: function () {
      if (typeof Storage !== "undefined") {
        if (confirm("你确定要清空所有缓存的数据吗？")) {
          try {
            localStorage.clear();
            console.log("缓存已清空!");
          } catch (e) {
            console.log("清空缓存失败，错误信息: ", e);
          }
        }
      } else {
        alert("抱歉，你的浏览器不支持 Web Storage...");
      }
    },
    // 自动调整文本框大小以适应内容
    autoResize: function (element) {
      element.style.height = "auto";
      element.style.height = element.scrollHeight + "px";
    },
  };
  // 初始化函数
  function init() {
    // 创建主边栏和设置边栏
    UIManager.createMainSidebar();
    UIManager.createSettingSidebar();
    // 页面加载完成后，进行事件绑定
    window.addEventListener("load", function () {
      bindEventHandlers();
    });
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
    }, 1000);
  }
  // 用于恢复原始 SVG 的函数
  function revertToOriginalSVG(deleteButton) {
    deleteButton.innerHTML = GlobalSVG.original; // 恢复原始SVG
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
  init();
})();

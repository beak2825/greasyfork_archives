// ==UserScript==
// @name         PreChatGPT
// @description  自动化批量的提交ChatGPT的提问
// @version      2.35
// @author       zizhanovo
// @restorer     KasenRi
// @namespace    https://github.com/zizhanovo/Pre-ChatGPT
// @supportURL   https://github.com/zizhanovo/Pre-ChatGPT
// @license      GPL-2.0-only
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/482619/PreChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/482619/PreChatGPT.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 添加 CSS 样式
  GM_addStyle(`
      #sidebar {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 270px;
        padding: 20px;
        background-color: #fafafa;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease-in-out;
        overflow: hidden;
      }
  
      #toggleSidebar {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        width: 30px;
        height: 30px;
        background: #fafafa;
        border: 1px solid #ccc;
        border-radius: 50%;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
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
        position: relative; /* New wrapper */
      }
  
      #toggleSidebar:hover {
        border-color: #007BFF; /* Change border color on hover */
        background: #e6e6e6; /* Change background color on hover */
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
        left: 15px; /* Position it to the right when sidebar is collapsed */
      }
  
      #sidebar h2 {
        text-align: center;
        color: #333;
        font-size: 1.4em;
        padding-bottom: 10px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
      }
  
      #sidebar textarea {
        width: 100%;
        height: 100px;
        margin-bottom: 10px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        transition: border-color 0.3s;
        resize: none;
      }
  
      #sidebar textarea:focus {
        border-color: #007BFF;
        outline: none;
  
      }
  
      #sidebar button {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: none;
        border-radius: 5px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s;
      }
  
      #submitQuestion, #start {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        color: white;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        outline: none;
        box-shadow: 0px 5px 10px rgba(0,0,0,0.2);
      }
  
      #submitQuestion {
        background-color: #4CAF50;
      }
  
      #submitQuestion:active {
        box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
        transform: translateY(3px);
      }
  
      #submitQuestion:hover {
        background-color: #45a049;
      }
  
      #start {
        background-color: #008CBA;
        margin-bottom: 20px;
      }
  
      #start:active {
        box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
        transform: translateY(3px);
      }
  
      #start:hover {
        background-color: #007B99;
      }
  
  
  
  
  
  
      #questionList {
        max-height: 200px;
        overflow-y: auto;
      }
      .questionContainer {
        display: flex;
        align-items: center;
      }
  
      .question {
        margin-bottom: 10px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.3s;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
  
      .question:hover {
        background-color: #f0f0f0;
      }
  
      .question:before {
        content: '❓';
        margin-right: 4px;
      }
  
      .question.answered {
        color: #aaa;
      }
  
      .question.answered:before {
        content: '✅';
      }
  
      .question button {
        margin-left: 0px;
        background: none;
        border: 1px solid #000; /* 新增此行 */
        box-sizing: border-box; /* 新增此行 */
        cursor: pointer;
        transition: color 0.3s;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .question button:hover {
        color: #007BFF;
      }
  
      .question .button-container {
        margin-left: auto;
        display: flex;
        gap: 0px;
      }
      .button-container button {
        width: 24px;  /* Increase the size of the button */
        height: 24px; /* Increase the size of the button */
        padding: 0;
        border: 2px solid red; /* Use a more visible border */
      }
  
      .question button svg {
        width: 18px;
        height: 18px;
        margin: auto;
        pointer-events: none; /* Let click events pass through the SVG to the button */
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
      }
  
      #questionSummary {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.08);
        transition: all 0.3s ease-in-out;
        height: 90px; /* 添加此行并设置合适的高度 */
      }
  
      .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        width: 45%;
        padding: 10px;
        background-color: #ffffff;
        border: 1px solid #e8e8e8;
        border-radius: 10px;
        box-shadow: 0px 0px 5px rgba(0,0,0,0.05);
        transition: all 0.3s ease-in-out;
      }
  
      .summary-item:hover {
        box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
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
        color: #333333;
      }
  
      .summary-count {
        font-size: 18px;
        margin-right: 10px;
        color: #333333;
      }
  
      .button-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        padding: 3px;
        height: 100%; /* 添加此行 */
      }
  
  
      .summary-action {
        display: flex;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        border: 1px solid #e8e8e8;  /* 添加边框 */
        color: black;  /* 改变按钮文本颜色 */
        background-color: transparent;  /* 去掉背景颜色 */
        padding: 5px 8px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        width: 100%;
        height: 100%;
      }
  
      .summary-action:hover {
        background-color: #f0f0f0;  /* 修改hover状态下的背景颜色 */
      }
  
  
      .vertical-text {
        writing-mode: vertical-rl;
        text-orientation: upright;
        font-size: 20px;
        margin: 0 auto;
      }
  
  
  
  
  
  
  
      #settingSidebar {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 270px;
        padding: 20px;
        background-color: #fafafa;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease-in-out;
        overflow: hidden;
      }
  
      #settingSidebar h2 {
        text-align: center;
        color: #333;
        font-size: 1.4em;
        padding-bottom: 10px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
      }
      .input-row {
        margin-bottom: 10px;
      }
  
      .input-row label {
        display: block;
        margin-bottom: 5px;
        color: #333;
        font-weight: bold;
      }
  
  
      .input-row input[type="text"],
      .input-row input[type="number"] {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        transition: border-color 0.3s;
        font-size: 14px;
        font-family: Arial, sans-serif;
      }
  
      .input-row input[type="text"]:focus,
      .input-row input[type="number"]:focus {
        border-color: #007BFF;
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
        border: 1px solid #ccc;
        border-radius: 5px;
        transition: border-color 0.3s;
        width: 70px; /* 调整宽度为适当大小 */
        text-align: right; /* 将文本右对齐 */
      }
  
      #delayTime:disabled {
        background-color: #f0f0f0;
      }
  
      .mode-option {
        display: flex;
        align-items: center;
        background-color: #f0f0f0;
        padding: 10px;
        border-radius: 5px;
      }
  
      .mode-option input[type="number"] {
        margin-left: 10px;
      }
  
  
  
      .clear-cache-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background-color: #88c0d0;
        color: white;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        outline: none;
        box-shadow: 0px 5px 10px rgba(0,0,0,0.2);
      }
  
      .clear-cache-btn:active {
          box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
          transform: translateY(3px);
      }
  
      .clear-cache-btn:hover {
          background-color: #81a1c1;
      }
      .button-container1 {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
      }
  
      #openSetting{
        font-size: 24px; /* 调整字体大小 */
        color: #4a4a4a; /* 改变字体颜色 */
  
        transition: all 0.3s ease; /* 过渡动画 */
        cursor: pointer; /* 更改鼠标光标样式 */
      }
  
      #openSetting:hover {
          color: #3b3b3b; /* 鼠标悬停时的颜色 */
          text-shadow: 2px 2px 4px #888; /* 鼠标悬停时的阴影颜色 */
      }
  
      #openSetting:active {
          transform: scale(0.97); /* 点击时缩小比例 */
      }
      #backToMainSidebar{
        font-size: 24px; /* 调整字体大小 */
        color: #4a4a4a; /* 改变字体颜色 */
  
        transition: all 0.3s ease; /* 过渡动画 */
        cursor: pointer; /* 更改鼠标光标样式 */
      }
  
      #backToMainSidebar:hover {
          color: #3b3b3b; /* 鼠标悬停时的颜色 */
          text-shadow: 2px 2px 4px #888; /* 鼠标悬停时的阴影颜色 */
      }
  
      #backToMainSidebar:active {
          transform: scale(0.97); /* 点击时缩小比例 */
      }
  
  
      .styled-select {
        display: block;
        font-size: 1em;
        width: 100%;
        max-width: 600px;
        box-sizing: border-box;
        margin: 0;
      }
  
      .dropdown {
        display: block;
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #aaa;
        border-radius: 4px;
        box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
        background-color: #fff;
        color: #444;
        padding: .5em .75em;
      }
      .input-flex {
        display: flex;
        align-items: center;
      }
  
      .input-flex label {
        margin-right: 10px;
      }
  
      .input-row {
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
      }
  
      /* 调整边框和间距 */
      .input-row label {
        margin-bottom: 5px;
        color: #333;
        font-weight: bold;
      }
  
      /* 调整字体颜色和大小 */
      .input-row input[type="text"],
      .input-row input[type="number"],
      .input-row select {
        color: #333;
        font-size: 14px;
      }
  
      .input-row select {
        padding: 8px;
      }
  
      /* 调整按钮样式 */
      .button-container1 button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background-color: #88c0d0;
        color: white;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        outline: none;
        box-shadow: 0px 5px 10px rgba(0,0,0,0.2);
      }
  
      .button-container1 button:active {
        box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
        transform: translateY(3px);
      }
  
      .button-container1 button:hover {
        background-color: #81a1c1;
      }
      .dragging {
        opacity: 0.5;
      }
  
  
      .my-app-night-mode #sidebar,
      .my-app-night-mode #settingSidebar {
        background-color: #1f1f1f;
        border: 1px solid #444;
      }
  
      .my-app-night-mode #sidebar textarea {
        background-color: #1f1f1f;
        color: #fff;
      }
  
      .my-app-night-mode #toggleSidebar {
        background: #d3d3d3; /* 浅灰色 */
        border: 1px solid #444;
        color: #ccc;
      }
  
      .my-app-night-mode #toggleSidebar:hover {
        border-color: #7eb8ff;
        background: #bdbdbd; /* 浅灰色 */
        color: #ccc;
      }
  
      .my-app-night-mode #submitQuestion,
      .my-app-night-mode #start {
        background-color: #8CAF85;
        color: #fff;
      }
  
      .my-app-night-mode #submitQuestion:hover,
      .my-app-night-mode #start:hover {
        background-color: #7ba079;
      }
  
      .my-app-night-mode .question {
        background-color: #3f3f3f;
        color: #fff;
      }
  
      .my-app-night-mode .question:hover {
        background-color: #2f2f2f;
      }
  
      .my-app-night-mode .question.answered {
        color: #aaa;
      }
  
      .my-app-night-mode .button-container button {
        border: 2px solid #ff4444;
        color: #fff;
      }
  
      .my-app-night-mode #questionSummary {
        background-color: #3f3f3f;
        color: #fff;
      }
  
      .my-app-night-mode .summary-count {
        color: #aaa;
      }
  
      .my-app-night-mode .summary-item {
        background-color: #3f3f3f;
        border: 1px solid #444;
        color: #fff;
      }
  
      .my-app-night-mode .summary-action {
        color: #888;
      }
  
      .my-app-night-mode .summary-action svg {
        fill: #bbb;
      }
  
      .my-app-night-mode .summary-action:hover {
        background-color: #2f2f2f;
      }
  
      .my-app-night-mode #delayTime {
        background-color: #333; /* 将延迟时间输入框的背景颜色改为深灰色 */
        color: #ccc; /* 将延迟时间输入框的文字颜色改为浅灰色 */
        transition: background-color 0.3s, color 0.3s;
      }
  
      .my-app-night-mode .clear-cache-btn {
        background-color: #68a0b0;
        color: #fff;
      }
  
      .my-app-night-mode .clear-cache-btn:hover {
        background-color: #6189a1;
      }
  
      .my-app-night-mode #openSetting,
      .my-app-night-mode #backToMainSidebar {
        color: #ccc; /* 使用浅灰色作为文字颜色 */
      }
  
      .my-app-night-mode #openSetting:hover,
      .my-app-night-mode #backToMainSidebar:hover {
        color: #ddd; /* 使用浅灰色作为文字颜色 */
      }
  
      .my-app-night-mode .dropdown {
        border: 1px solid #555;
      }
  
      .my-app-night-mode input[type="text"],
      .my-app-night-mode input[type="number"],
      .my-app-night-mode select {
        background-color: #1f1f1f;
        border: 1px solid #555;
        color: #fff;
      }
      .my-app-night-mode .input-row label,
      .my-app-night-mode .input-row input[type="text"],
      .my-app-night-mode .input-row input[type="number"],
      .my-app-night-mode .input-row select {
        color: #f5f5f5; /* 设置文字颜色为浅色白色 */
      }
  
      .my-app-night-mode input[type="text"]:focus,
      .my-app-night-mode input[type="number"]:focus,
      .my-app-night-mode select:focus {
        border-color: #7eb8ff;
        outline: none;
      }
      .my-app-night-mode .input-row {
        color: gray;
        background-color: black;
      }
  
      .my-app-night-mode .button-container1 button {
        background-color: #88c0d0;
        color: #fff;
      }
  
      .my-app-night-mode .button-container1 button:active {
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
        transform: translateY(3px);
      }
  
      .my-app-night-mode .button-container1 button:hover {
        background-color: #81a1c1;
      }
  
      .my-app-night-mode .mode-option {
        background-color: #1f1f1f;
      }
  
      .my-app-night-mode .vertical-text {
        color: #fff;
      }
  
      .my-app-night-mode pre {
        background-color: #1f1f1f;
        color: #ddd;
        padding: 10px;
        border-radius: 5px;
        overflow-x: auto;
      }
  
      .my-app-night-mode #deleteCompleted,
      .my-app-night-mode #deletePending {
        background-color: lightgray;
      }
  
      .my-app-night-mode #runMode label {
        color: lightgray;
      }
      #delayTime:after {
        content: "秒";
        margin-left: 5px;
      }
      .button-group {
        display: flex;
        flex-direction: row;
        gap: 5px; /* 为按钮之间添加间隔 */
      }
      
      #start {
        display: block;
        margin-top: 5px; /* 将运行按钮移至下一行 */
      }

      #stepRun {
        background-color: #007BFF;
        color: #fff;
        font-size: 16px;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.3s; /* Add transitions */
      }
    
      #stepRun:hover {
        background-color: #0056b3; /* Change background color on hover */
      }
    
      #stepRun:active {
        background-color: #00408c; /* Change background color when clicked */
        transform: translateY(2px); /* Add a slight vertical shift when clicked */
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2); /* Add a shadow effect */
      }
  
    `);


  // 创建主侧边栏
  function createMainSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';

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
        <textarea id="questionInput" placeholder="请输入您的提示词, 默认 # 为拆分，如果发送失败请更换拆分符\nVersion：fix2.35"></textarea>
        <div class="button-group">
        <button id="submitQuestion">提交</button>
        <button id="stepRun">单步运行</button>
      </div>
      <div class="button-group">
        <button id="start">自动运行</button>
      </div>
      
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
                    <svg t="1685867554988" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2373" width="200" height="200">
                        <path d="M832 1024H192V288h64v672h512V288h64v736zM128 160h768v64H128z" fill="#2A2A3B" p-id="2374"></path>
                        <path d="M672 224H352V0h320z m-256-64h192V64h-192zM384 384h64v448h-64zM576 384h64v448h-64z" fill="#2A2A3B" p-id="2375"></path>
                    </svg>
                </a>
            </div>
        </div>
        <div class="summary-item">
            <div class="icon-count-container">
                <div class="icon-container">
                    <span class="summary-icon">❓</span>
                </div>
                <div class="count-container">
                    <span class="summary-count" id="pendingCount">0</span>
                </div>
            </div>
            <div class="button-container">
                <a href="#" class="summary-action" id="deletePending">
                    <svg t="1685867554988" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2373" width="200" height="200">
                        <path d="M832 1024H192V288h64v672h512V288h64v736zM128 160h768v64H128z" fill="#2A2A3B" p-id="2374"></path>
                        <path d="M672 224H352V0h320z m-256-64h192V64h-192zM384 384h64v448h-64zM576 384h64v448h-64z" fill="#2A2A3B" p-id="2375"></path>
                    </svg>
                </a>
            </div>
        </div>
      </div>
  
      </section>
    `;
    document.body.appendChild(sidebar);
    // Apply night mode class if the selected theme is "夜间模式"
    const savedTheme = localStorage.getItem('selectedTheme') || 'light'; // Default to light mode
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('my-app-night-mode');
    }

  }

  // 创建设置侧边栏
  function createSettingSidebar() {
    const settingSidebar = document.createElement('div');

    settingSidebar.id = 'settingSidebar';
    settingSidebar.style.display = 'none'; // 初始时隐藏设置侧边栏

    settingSidebar.innerHTML = `
      <section id="sidebarContent">
        <h2 id="backToMainSidebar" style="cursor: pointer;">PreChat 保存</h2>
        <div class="input-row">
          <label for="themeSelect">主题选择：</label>
          <select id="themeSelect" class="styled-select dropdown">
  
            <option value="light">白天模式</option>
            <option value="dark">夜间模式</option>
          </select>
         </div>
  
  
        <div class="input-row">
          <label for="splitCharInput">拆分符号:</label>
          <input type="text" id="splitCharInput" placeholder="留空则默认为 # " />
        </div>
  
        <div class="input-row">
          <label for="additionalInput">输出增强:</label>
  
          <div class="styled-select">
            <div class="input-flex">
              <label for="depthSelect">深度：</label>
              <select id="depthSelect" class="dropdown" onchange="saveDropdownSettings()">
                <option value="无">无</option>
                <option value="小学（1-6 年级）">小学（1-6 年级）</option>
                <option value="初中（7-9 年级）">初中（7-9 年级）</option>
                <option value="高中（10-12 年级）">高中（10-12 年级）</option>
                <option value="大学预科">大学预科</option>
                <option value="本科">本科</option>
                <option value="研究生">研究生</option>
                <option value="硕士">硕士</option>
                <option value="博士候选人">博士候选人</option>
                <option value="博士后">博士后</option>
                <option value="博士.D">博士.D</option>
              </select>
            </div>
  
            <div class="input-flex">
              <label for="inferenceSelect">推理：</label>
              <select id="inferenceSelect" class="dropdown" onchange="saveDropdownSettings()">
                <option value="无">无</option>
                <option value="演绎法">演绎法：大前提推结论</option>
                <option value="归纳法">归纳法：例子推规律</option>
                <option value="溯因法">溯因法：追查事物原因</option>
                <option value="类比法">类比法：相似推新情况</option>
                <option value="随意法">随意法：无规则发挥</option>
              </select>
            </div>
  
            <div class="input-flex">
              <label for="styleSelect">风格：</label>
              <select id="styleSelect" class="dropdown" onchange="saveDropdownSettings()">
                <option value="无">无</option>
                <option value="辩论">辩论</option>
                <option value="鼓励">鼓励</option>
                <option value="中立">中立</option>
                <option value="信息丰富">信息丰富</option>
                <option value="友好">友好</option>
              </select>
            </div>
  
            <input type="text" id="additionalInput" placeholder="例如，零样本提示（请一步步思考），少样本提示（提供输出案例），思维链（提供思考过程）等" />
          </div>
        </div>
  
        <div class="input-row">
        <label for="runMode">运行模式:</label>
        <div id="runMode">
          <div class="mode-option">
            <input type="radio" id="instant" name="mode" value="instant" checked>
            <label for="instant">即时</label>
          </div>
          <div class="mode-option">
            <input type="radio" id="delayed" name="mode" value="delayed">
            <label for="delayed">延时</label>
            <input type="number" id="delayTime" placeholder="432" disabled>
          </div>
        </div>
      </div>
  
  
  
      <div class="button-container1" style="display: inline-block;">
      <button class="clear-cache-btn">清空缓存</button>
    </div>
    <div class="button-container1" style="display: inline-block;">
      <button class="clear-cache-btn">
        <a href="https://fkaygdsx06.feishu.cn/docx/XcKHdDHNfoqNruxSzlIcSLUWnFd" target="_blank">使用文档</a>
      </button>
    </div>
  
      </section>
      `;

    document.body.appendChild(settingSidebar);  // 将设置侧边栏添加到 DOM 中
    // 在创建设置侧边栏的代码后添加以下代码
    document.getElementById('depthSelect').addEventListener('change', saveDropdownSettings);
    document.getElementById('inferenceSelect').addEventListener('change', saveDropdownSettings);
    document.getElementById('styleSelect').addEventListener('change', saveDropdownSettings);

    const clearCacheBtn = document.querySelector('.clear-cache-btn');
    clearCacheBtn.addEventListener('click', clearCache);

  }
  // 主侧边栏和设置侧边栏的创建代码
  createMainSidebar();
  createSettingSidebar();

  function loadDropdownSettings() {
    const depthSelect = document.getElementById('depthSelect');
    const inferenceSelect = document.getElementById('inferenceSelect');
    const styleSelect = document.getElementById('styleSelect');
    const savedTheme = localStorage.getItem('selectedTheme') || "light";
    const savedDepth = localStorage.getItem('selectedDepth') || "本科"; // 默认选择本科
    const savedInference = localStorage.getItem('selectedInference') || "演绎法"; // 默认选择演绎法
    const savedStyle = localStorage.getItem('selectedStyle') || "信息丰富"; // 默认选择信息丰富

    const themeSelect = document.getElementById('themeSelect');
    themeSelect.addEventListener('change', changeTheme);

    themeSelect.value = savedTheme;
    depthSelect.value = savedDepth;
    inferenceSelect.value = savedInference;
    styleSelect.value = savedStyle;

    // Apply the selected theme and night mode class
    applyTheme(savedTheme);
  }


  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('my-app-night-mode');
    } else {
      document.documentElement.classList.remove('my-app-night-mode');
    }
  }

  function changeTheme() {
    const themeSelect = document.getElementById('themeSelect');
    const selectedTheme = themeSelect.value;

    applyTheme(selectedTheme);

    // Save the selected theme to local storage
    localStorage.setItem('selectedTheme', selectedTheme);
  }


  function saveDropdownSettings() {
    const themeSelect = document.getElementById('themeSelect');
    const depthSelect = document.getElementById('depthSelect');
    const inferenceSelect = document.getElementById('inferenceSelect');
    const styleSelect = document.getElementById('styleSelect');

    const selectedTheme = themeSelect.value;
    const selectedDepth = depthSelect.value;
    const selectedInference = inferenceSelect.value;
    const selectedStyle = styleSelect.value;

    localStorage.setItem('selectedTheme', selectedTheme);
    localStorage.setItem('selectedDepth', selectedDepth);
    localStorage.setItem('selectedInference', selectedInference);
    localStorage.setItem('selectedStyle', selectedStyle);
  }



  document.getElementById('openSetting').addEventListener('click', function () {
    // 隐藏主侧边栏
    document.getElementById('sidebar').style.display = 'none';

    // 显示设置侧边栏
    document.getElementById('settingSidebar').style.display = '';

    // 加载下拉框设置
    loadDropdownSettings();

    // 从本地存储加载设置
    const splitChar = localStorage.getItem('splitChar');
    const additional = localStorage.getItem('additional');
    const runMode = localStorage.getItem('runMode');
    const delayTime = localStorage.getItem('delayTime');

    // 更新设置侧边栏中的字段
    document.getElementById('splitCharInput').value = splitChar || '';
    document.getElementById('additionalInput').value = additional || '';
    document.getElementById('delayTime').value = delayTime || '';

    if (runMode === 'instant') {
      document.getElementById('instant').checked = true;
    } else if (runMode === 'delayed') {
      document.getElementById('delayed').checked = true;
    }
  });

  document.getElementById('backToMainSidebar').addEventListener('click', function () {
    // 获取设置侧边栏中的字段值
    const selectedTheme = document.getElementById('themeSelect').value;
    const splitChar = document.getElementById('splitCharInput').value;
    const additional = document.getElementById('additionalInput').value;
    const runMode = document.querySelector('input[name="mode"]:checked').value;
    const delayTime = document.getElementById('delayTime').value;

    // 保存设置到本地存储
    localStorage.setItem('selectedTheme', selectedTheme);
    localStorage.setItem('splitChar', splitChar);
    localStorage.setItem('additional', additional);
    localStorage.setItem('runMode', runMode);
    localStorage.setItem('delayTime', delayTime);

    // 隐藏设置侧边栏
    document.getElementById('settingSidebar').style.display = 'none';

    // 显示主侧边栏
    document.getElementById('sidebar').style.display = '';
  });

  // Event listener for run mode radio button inputs
  const delayedRadio = document.getElementById('delayed');
  const delayTimeInput = document.getElementById('delayTime');

  delayedRadio.addEventListener('change', function () {
    delayTimeInput.disabled = false;
  });

  const instantRadio = document.getElementById('instant');
  instantRadio.addEventListener('change', function () {
    delayTimeInput.disabled = true;
  });

  function clearCache() {
    var btn = document.querySelector('.clear-cache-btn');
    if (typeof (Storage) !== "undefined") {
      if (confirm("你确定要清空所有缓存的数据吗？")) {
        try {
          localStorage.clear();
          console.log("缓存已清空!");
          btn.innerText = "缓存已清空";
          setTimeout(function () {
            btn.innerText = "清空缓存";
          }, 3000);  // 3秒后恢复原状
        } catch (e) {
          console.log("清空缓存失败，错误信息: ", e);
        }
      }
    } else {
      alert("抱歉，你的浏览器不支持 Web Storage...");
    }
  }


  // Toggle logic
  document.getElementById('toggleSidebar').addEventListener('click', function () {
    var sidebar = document.getElementById('sidebar');
    var iconExpand = document.getElementById('icon-expand');
    var iconCollapse = document.getElementById('icon-collapse');
    sidebar.classList.toggle('collapsed');
    if (sidebar.classList.contains('collapsed')) {
      iconCollapse.style.display = 'none';
      iconExpand.style.display = '';
    } else {
      iconExpand.style.display = 'none';
      iconCollapse.style.display = '';
    }
  });









  (function () {
    const questionList = document.getElementById('questionList');
    const submitQuestionButton = document.getElementById('submitQuestion');
    const questionInput = document.getElementById('questionInput');
    const startButton = document.getElementById('start');

    let isRunning = false; // 标志变量，跟踪运行
    let isAutoRunMode = true; // 标志变量，表示当前为自动运行模式
    // Event listeners
    submitQuestionButton.addEventListener('click', handleQuestionSubmission);
    questionList.addEventListener('click', handleQuestionClick);
    window.addEventListener('load', loadQuestionsFromLocalStorage);
    startButton.addEventListener('click', startAskingQuestions);

    startButton.addEventListener('click', function () {
      isAutoRunMode = true; // 设置为自动运行模式
      isRunning = !isRunning; // 切换运行状态
      console.log(isRunning)
      if (isRunning) {
        startButton.textContent = '停止运行'; // 更新按钮文本为“停止运行”
        startButton.style.backgroundColor = 'red';
        startAskingQuestions(); // 启动自动提问的逻辑
      } else {
        startButton.textContent = '自动运行'; // 更新按钮文本为“自动运行”
        startButton.style.backgroundColor = 'green';
        // 这里可以添加停止运行的逻辑
      }
    });

    document.getElementById('stepRun').addEventListener('click', function () {
      if (isRunning) {
        alert('正在自动运行中，请先停止后再点击单步运行');
      } else {
        console.log("开启单步运行")
        isRunning = true;
        isAutoRunMode = false; // 设置为单步运行模式
        startAskingQuestions(); // 以单步模式运行函数
        console.log("单步运行已完成")
      }
    });


    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }




	function handleQuestionSubmission() {
	  const questions = getQuestionsFromInput();
	  if (questions.length === 0) {
		return; // 如果没有有效问题，直接返回
	  }

	  questions.forEach(question => {
		const uuid = generateUUID();
		addQuestionToList(question, false, uuid);
		addQuestionToLocalStorage(question, uuid);
	  });

	  clearInput();
	  makeQuestionListSortable();
	  updateQuestionCounts();
	}


    function addQuestionToLocalStorage(question, uuid) {
      try {
        // Get the current list of questions from local storage
        let storedQuestions = getQuestionsFromLocalStorage();

        // Check if getQuestionsFromLocalStorage returned a valid array
        if (!Array.isArray(storedQuestions)) {
          console.error('无法从本地存储检索到问题.');
          return;
        }

        // Add the new question to the list
        storedQuestions.push({ id: uuid, text: question, answered: false });

        // Store the updated list back to local storage
        localStorage.setItem('questions', JSON.stringify(storedQuestions));

        // Update question counts
        updateQuestionCounts();

        console.log(`问题："${question}" 的ID "${uuid}" 添加到本地存储.`);
      } catch (err) {
        console.error(`将问题添加到本地存储时出错: ${err}`);
      }
    }


    function handleQuestionClick(event) {
      if (event.target.classList.contains('question-text')) {
        toggleQuestionTextWhiteSpace(event.target);
      }
    }

    // Helper functions
	function getQuestionsFromInput() {
	  const splitChar = localStorage.getItem('splitChar') || '#';
	  return questionInput.value
		.split('\n')
		.flatMap(line => line.split(splitChar))
		.map(question => question.trim()) // 去除每个问题前后的空白字符
		.filter(question => question !== ""); // 过滤掉空字符串
	}



    function addQuestionToList(question, answered, uuid) {

      if (question.trim() === "") {
        return null; // Return null if question is empty
      }
      const questionDiv = createQuestionDiv(question, answered);
      questionDiv.dataset.id = uuid;  // Store the UUID in the DOM element
      questionList.appendChild(questionDiv);
      if (answered) {
        questionDiv.classList.add('answered');
      }
      updateQuestionCounts();
      return questionDiv;
    }

    function createQuestionDiv(question, answered) {
      const div = document.createElement('div');
      div.className = 'question';
      div.draggable = true;

      const questionContainer = document.createElement('div');
      questionContainer.style.display = "flex";
      questionContainer.style.justifyContent = "center"; // Add this line to center the content vertically

      const questionText = document.createElement('textarea');
      questionText.className = 'question-text';
      questionText.value = question;
      questionText.readOnly = true;
      questionText.style.border = 'none';
      questionText.style.height = '42px';
      questionText.style.resize = 'none';
      questionText.style.margin = 'auto'; // Add this line to center the textarea vertically
      questionContainer.appendChild(questionText);
      div.appendChild(questionContainer);

      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'button-container';

      // const editButton = createButton('edit', handleEditButtonClick);
      // buttonContainer.appendChild(editButton);

      const deleteButton = createButton('delete', handleDeleteButtonClick);
      buttonContainer.appendChild(deleteButton);

      const sortButton = createButton('sort');
      buttonContainer.appendChild(sortButton);

      div.appendChild(buttonContainer);
      // Add 'answered' class if the question is answered
      if (answered) {
        div.classList.add('answered');
      }
      div.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', this.outerHTML); // 把元素的HTML设置为拖动的数据
        this.classList.add('dragging'); // 添加一个类，让元素在拖动时看起来不同
      });

      div.addEventListener('dragend', function () {
        this.classList.remove('dragging'); // 当拖动结束时移除类
      });

      return div;
    }



    // 假设你的问题列表的id是'questionList'
    const questionListDiv = document.getElementById('questionList');

    questionListDiv.addEventListener('dragover', function (e) {
      e.preventDefault(); // 允许元素被放置

      const dragging = document.querySelector('.dragging');
      const afterElement = getDragAfterElement(questionListDiv, e.clientY); // 获取在鼠标下方的元素
      if (afterElement == null) {
        questionListDiv.appendChild(dragging); // 如果没有元素在鼠标下方，就放在列表末尾
      } else {
        questionListDiv.insertBefore(dragging, afterElement); // 否则放在这个元素前面
      }
    });

    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('.question:not(.dragging)')]; // 获取所有可拖动的元素，除了正在被拖动的那个

      // 遍历元素，找到鼠标下方的元素
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }


    function createButton(type, clickHandler) {
      const button = document.createElement('button');
      button.className = `${type}-button`;

      switch (type) {
        // case 'edit':
        //   button.innerHTML = `<svg t="1684557647867" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3766" width="20" height="20"><path d="M862.709333 116.042667a32 32 0 1 1 45.248 45.248L455.445333 613.813333a32 32 0 1 1-45.258666-45.258666L862.709333 116.053333zM853.333333 448a32 32 0 0 1 64 0v352c0 64.8-52.533333 117.333333-117.333333 117.333333H224c-64.8 0-117.333333-52.533333-117.333333-117.333333V224c0-64.8 52.533333-117.333333 117.333333-117.333333h341.333333a32 32 0 0 1 0 64H224a53.333333 53.333333 0 0 0-53.333333 53.333333v576a53.333333 53.333333 0 0 0 53.333333 53.333333h576a53.333333 53.333333 0 0 0 53.333333-53.333333V448z" fill="#000000" p-id="3767"></path></svg>`; // SVG for edit button
        //   break;
        case 'delete':
          button.innerHTML = `<svg t="1684556652392" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2423" width="20" height="20"><path d="M202.666667 256h-42.666667a32 32 0 0 1 0-64h704a32 32 0 0 1 0 64H266.666667v565.333333a53.333333 53.333333 0 0 0 53.333333 53.333334h384a53.333333 53.333333 0 0 0 53.333333-53.333334V352a32 32 0 0 1 64 0v469.333333c0 64.8-52.533333 117.333333-117.333333 117.333334H320c-64.8 0-117.333333-52.533333-117.333333-117.333334V256z m224-106.666667a32 32 0 0 1 0-64h170.666666a32 32 0 0 1 0 64H426.666667z m-32 288a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z m170.666666 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z" fill="#000000" p-id="2424"></path></svg>`; // SVG for delete button
          break;
        case 'sort':
          button.innerHTML = `<svg t="1684417162772" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6670" width="24" height="24"><path d="M368 706.72l-64 64V576h-64v194.72l-64-64L130.72 752 272 893.28 413.28 752 368 706.72zM272 130.72L130.72 272 176 317.28l64-64V448h64V253.28l64 64L413.28 272 272 130.72zM480 192h416v64H480zM480 384h416v64H480zM480 576h416v64H480zM480 768h416v64H480z" fill="#333333" p-id="6671"></path></svg>`; // SVG for sort button
          break;
      }

      if (clickHandler) {
        button.addEventListener('click', clickHandler);
      }

      return button;
    }


    //   function handleEditButtonClick(event) {
    //     const questionText = event.target.parentElement.previousElementSibling;
    //     const isEditing = questionText.getAttribute('data-isEditing') === 'true';

    //     if (!isEditing) {  // If it's not in editing state
    //         questionText.setAttribute('contentEditable', 'true');
    //         questionText.style.border = '1px solid';
    //         questionText.style.backgroundColor = '#fff';
    //         questionText.focus();
    //         questionText.setAttribute('data-isEditing', 'true');
    //     } else {  // If it's in editing state
    //         questionText.setAttribute('contentEditable', 'false');
    //         questionText.style.border = 'none';
    //         questionText.style.backgroundColor = 'transparent';
    //         questionText.removeAttribute('data-isEditing');  // Remove the attribute

    //         // Update the corresponding question in localStorage
    //         const storedQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
    //         const questionToUpdate = storedQuestions.find(q => q.text === questionText.textContent);

    //         if (questionToUpdate) {
    //             questionToUpdate.text = questionText.textContent;
    //             localStorage.setItem('questions', JSON.stringify(storedQuestions));
    //         }
    //     }
    // }


    function handleDeleteButtonClick(event) {
      // Use the closest method to get the question div
      const questionDiv = event.target.closest('.question');

      const questionText = questionDiv.querySelector('input.question-text');
      const questionUuid = questionDiv.dataset.id;  // Get the UUID from the DOM element

      // Remove the question from the DOM
      questionDiv.remove();
      updateQuestionCounts();

      // Remove the question from localStorage
      let storedQuestions = getQuestionsFromLocalStorage();  // We can use this helper function here
      storedQuestions = storedQuestions.filter(q => q.id !== questionUuid);  // Use the UUID to filter the question
      localStorage.setItem('questions', JSON.stringify(storedQuestions));
      updateQuestionCounts();
    }

    function clearInput() {
      questionInput.value = '';
    }

    function makeQuestionListSortable() {
      new Sortable(questionList, {
        handle: '.sort-button',
        animation: 150
      });
    }

    function toggleQuestionTextWhiteSpace(questionText) {
      questionText.style.whiteSpace = questionText.style.whiteSpace === 'nowrap' ? 'normal' : 'nowrap';
    }

    function loadQuestionsFromLocalStorage() {
      try {
        const storedQuestions = getQuestionsFromLocalStorage();
        for (let question of storedQuestions) {
          let questionDiv = addQuestionToList(question.text, question.answered, question.id);
          if (question.answered) {
            questionDiv.classList.add('answered');
          }
        }
        updateQuestionCounts();
        console.log(`从本地存储加载了${storedQuestions.length}个问题.`);
      } catch (err) {
        console.error(`从本地存储加载问题时出现错误：${err}`);
      }
    }

    function getQuestionsFromLocalStorage() {
      try {
        let storedQuestions = localStorage.getItem('questions');
        storedQuestions = storedQuestions ? JSON.parse(storedQuestions) : [];

        // Map raw objects from local storage to question objects with custom methods
        storedQuestions = storedQuestions.map((rawQuestion) => ({
          id: rawQuestion.id,
          text: rawQuestion.text,
          answered: rawQuestion.answered
        }));


        return storedQuestions;
      } catch (err) {
        console.error(`从本地存储检索问题时出错: ${err}`);
        return []; // Return an empty array if there was an error
      }
    }


    function updateQuestionCounts() {
      const counts = getQuestionCounts();
      document.getElementById('completedCount').textContent = counts.answeredCount;
      document.getElementById('pendingCount').textContent = counts.unansweredCount;
    }

    async function startAskingQuestions() {
      try {
        const questions = Array.from(document.getElementsByClassName('question'));
        const runMode = localStorage.getItem('runMode');
        const delayTime = parseInt(localStorage.getItem('delayTime') || '300');

        let allAnswered = true; // 初始假设所有问题都已回答

        for (let i = 0; i < questions.length; i++) {

          let allAnswered = true; // 初始假设所有问题都已回答
          if (!isRunning) {
            console.log(`isRunning的状态为：${isRunning}`);
            allAnswered = false; // 如果停止，表示不是所有问题都已回答
            break; // 如果运行状态被设置为 false，则退出循环
          }

          const questionDiv = questions[i];
          if (questionDiv.classList.contains('answered')) {
            continue; // 如果已回答，跳过此问题
          } else {
            allAnswered = false; // 存在未回答的问题
          }
          const questionInput = questionDiv.querySelector('textarea.question-text');
          const questionUUID = questionDiv.dataset.id;

          if (!questionDiv.classList.contains('answered')) {
            let questionText = questionInput.value; // 保存问题文本

            // 获取下拉框的值
            const depthSelect = document.getElementById('depthSelect');
            const inferenceSelect = document.getElementById('inferenceSelect');
            const styleSelect = document.getElementById('styleSelect');

            const selectedDepth = depthSelect.value; // 获取选中的值
            const selectedInference = inferenceSelect.value; // 获取选中的值
            const selectedStyle = styleSelect.value; // 获取选中的值

            const selectedValues = [];

            // Check if the selected values are not "无", and add them to the selectedValues array
            if (selectedDepth !== "无") {
              selectedValues.push(`回答深度: ${selectedDepth}`);
            }
            if (selectedInference !== "无") {
              selectedValues.push(`推理框架: ${selectedInference}`);
            }
            if (selectedStyle !== "无") {
              selectedValues.push(`回答风格: ${selectedStyle}`);
            }

            // Join the selectedValues array with a space as a separator
            const selectedText = selectedValues.join(' ');

            // Append the selectedText to the questionText if it is not empty
            if (selectedText) {
              questionText += ` ${selectedText}`;
            }

            if (runMode === 'instant') {
              console.log(`立即提问模式：${questionText}`);
              await askQuestionInstant(questionText);
            } else if (runMode === 'delayed') {
              console.log(`在提问问题 ${questionText} 前延迟 ${delayTime} 秒`);
              await delay(delayTime);
              await askQuestionDelayed(questionText);
            }

            questionDiv.classList.add('answered');
            updateQuestionInLocalStorage(questionUUID, true);  // 更新问题状态为已回答
            console.log(`问题已提交并标记为已回答: ${questionText}`);
            await new Promise(resolve => setTimeout(resolve, 500));
            await updateQuestionCounts();
          }

          // 如果处于单步运行模式，处理一个问题后退出循环
          if (!isAutoRunMode) {
            break;
          }
        }

        await updateQuestionCounts();
        if (allAnswered) {
          // 如果所有问题都已回答
          isRunning = false;
          startButton.textContent = '自动运行'; // 更新按钮文本为“自动运行”
          startButton.style.backgroundColor = 'green';
          console.log("问题已经回答完毕.");
        }

      } catch (err) {
        console.error(`在提问时发生错误: ${err}`);
        isRunning = false; // 在发生错误时停止运行
      }
    }



    async function askQuestionInstant(question) {
	  return new Promise((resolve, reject) => {
		try {
		  const inputBox = document.querySelector('textarea');
		  if (!inputBox) {
			reject('Could not find textarea for input.');
		  }
		  inputBox.value = question;
		  const event = new Event('input', { bubbles: true });
		  inputBox.dispatchEvent(event);

		  const interval = setInterval(() => {
			if (!isRunning) {
			  clearInterval(interval);
			  reject('Stopped by user');
			  return;
			}

			const xpath = "//*[@id='__next']/div[1]/div[2]/main/div[2]/div[2]/form/div/div/div/button";
			const sendButton = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

			if (sendButton && !sendButton.hasAttribute('disable')) {
			  clearInterval(interval);
			  sendButton.click();
			  setTimeout(() => {
				  console.log("延时5秒");
				  resolve();
				}, 5000); // 5秒延时
			  resolve();
			}
		  }, 1000); // 每秒检查一次发送按钮是否可点击
		} catch (err) {
		  console.error(`在提问时发生错误: ${err}`);
		  reject(err);
		}
	  });
	}





    function askQuestionDelayed(question) {
      return new Promise((resolve, reject) => {
        try {
          if (!question) {
            console.error("No question provided");
            reject('No question provided');
            return;
          }

          const additional = localStorage.getItem('additional') || '';
          const questionToSend = `${question} ${additional}`.trim();
          const inputBox = document.querySelector('textarea');

          if (!inputBox) {
            console.error("Input box not found");
            reject('Input box not found');
            return;
          }

          inputBox.value = questionToSend;
          const event = new Event('input', { bubbles: true });
          inputBox.dispatchEvent(event);

          const sendButton = inputBox.nextElementSibling;

          if (!sendButton) {
            console.error("发送按钮没找到");
            reject('Send button not found');
            return;
          }

          const delayTime = parseInt(localStorage.getItem('delayTime'), 10);

          if (isNaN(delayTime)) {
            console.error("Invalid delayTime");
            reject('Invalid delayTime');
            return;
          }

          // Delay for delayTime (ms) then click the button and resolve
			setTimeout(() => {
			  console.log(`Question sent after delay of ${delayTime} ms`);
			  sendButton.click();

			  setTimeout(() => {
				console.log("延时5秒");
				resolve();
			  }, 5000); // 在原有延时后再延时5秒

		}, delayTime * 1000);


        } catch (error) {
          console.error(`Error in askQuestionDelayed: ${error}`);
          reject(error);
        }
      });
    }




    function updateQuestionInLocalStorage(questionUUID, answered) {
      try {
        let storedQuestions = getQuestionsFromLocalStorage();
        let questionToUpdate = storedQuestions.find(q => q.id === questionUUID);

        // Check if questionToUpdate is found
        if (!questionToUpdate) {
          console.error(`Question with UUID ${questionUUID} not found in local storage.`);
          return false;
        }

        console.log('更新内存中:', questionToUpdate);

        // Update the answered status of the question
        questionToUpdate.answered = answered;

        // Update the question list in local storage
        localStorage.setItem('questions', JSON.stringify(storedQuestions));

        console.log(`问题状态已成功更新，UUID为${questionUUID}.`);

        // Return true on successful update
        return true;
      } catch (error) {
        console.error(`Error in updateQuestionInLocalStorage: ${error}`);
        return false;
      }
    }




    function delay(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
      });
    }

    function getQuestionCounts() {
      let storedQuestions = getQuestionsFromLocalStorage();
      let answeredCount = 0;
      let unansweredCount = 0;

      for (let question of storedQuestions) {
        if (question.answered) {
          answeredCount++;
        } else {
          unansweredCount++;
        }
      }

      return {
        answeredCount,
        unansweredCount
      };
    }

    async function deleteCompletedQuestions() {
      let questions = document.querySelectorAll('.question.answered');

      for (let question of questions) {
        let questionUUID = question.dataset.id;
        question.remove();
        await removeFromLocalStorage(questionUUID)
          .then(questionUUID => console.log(`Question with UUID ${questionUUID} removed from local storage.`))
          .catch(error => console.error(`Error removing question from local storage: ${error}`));
      }

      updateQuestionCounts();
    }

    async function deletePendingQuestions() {
      let confirmation = confirm('你确定要删除所有未完成的问题吗？');

      if (confirmation) {
        let questions = document.querySelectorAll('.question:not(.answered)');

        for (let question of questions) {
          let questionUUID = question.dataset.id;
          question.remove();
          await removeFromLocalStorage(questionUUID)
            .then(questionUUID => console.log(`Question with UUID ${questionUUID} removed from local storage.`))
            .catch(error => console.error(`Error removing question from local storage: ${error}`));
        }
      }

      updateQuestionCounts();
    }
    async function removeFromLocalStorage(questionUUID) {
      return new Promise((resolve, reject) => {
        let storedQuestions = localStorage.getItem('questions');
        storedQuestions = storedQuestions ? JSON.parse(storedQuestions) : [];
        storedQuestions = storedQuestions.filter(q => q.id !== questionUUID);
        localStorage.setItem('questions', JSON.stringify(storedQuestions));
        resolve(questionUUID); // 修改此处将questionUUID传递给resolve
      });
    }

    document.getElementById('deleteCompleted').addEventListener('click', deleteCompletedQuestions);
    document.getElementById('deletePending').addEventListener('click', deletePendingQuestions);
  })();
})();


function toggleInput(radio) {
  var delayTimeInput = document.getElementById("delayTime");
  delayTimeInput.disabled = !radio.checked;
  if (radio.checked) {
    delayTimeInput.focus();
    delayTimeInput.select();
  }
}
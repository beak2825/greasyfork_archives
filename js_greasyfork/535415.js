// ==UserScript==
// @name         小红书增强助手
// @namespace    http://tampermonkey.net/
// @version      1.52
// @description  提取小红书、抖音、B站、百度、Google搜索推荐词 + 小红书笔记批量导出Excel + 小红书图片视频下载 (油猴脚本)
// @author       Jia (原作者) / 移植：guanlan11208596 / 小红书导出功能：参考俊小胖 / 下载助手：x
// @license      禁止分发
// @icon         https://picasso-static.xiaohongshu.com/fe-platform/f43dc4a8baf03678996c62d8db6ebc01a82256ff.png
// @match        https://www.xiaohongshu.com/*
// @match        https://www.douyin.com/*
// @match        https://www.bilibili.com/*
// @match        https://www.baidu.com/*
// @match        https://www.google.com.hk/*
// @match        https://www.google.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM.info
// @grant        unsafeWindow
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      open.feishu.cn
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.min.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3Bwindow.VueDemi%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.13/plugin/timezone.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.13/plugin/utc.min.js
// @require      https://cdn.jsdelivr.net/npm/streamsaver@2.0.6/StreamSaver.js
// @require      data:application/javascript,%3Bwindow.StreamSaver%3DstreamSaver%3B
// @require      https://cdn.jsdelivr.net/npm/pinia@2.2.6/dist/pinia.iife.prod.js
// @require      data:application/javascript,%3Bwindow.Pinia%3DPinia%3B
// @require      https://cdn.jsdelivr.net/npm/pinia-plugin-persistedstate@4.1.3/dist/index.global.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535415/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%A2%9E%E5%BC%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/535415/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%A2%9E%E5%BC%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局变量 ---
    // 搜索推荐词采集助手的变量
    let kwIndex = 0;
    let csvContent = "";
    let keywordList = [];
    let collectKeywordList = [];
    let collectLevel = 1; // Default, will be set by UI
    const currentDomain = window.location.hostname;
    let collectorUI; // Will be initialized by initCollectorUI
    let isCollecting = false;

    // 小红书笔记导出功能的变量
    let noteData = [];
    let noteItemNum = 0; // 当前加载笔记的数量
    let excel_title = '小红书数据';
    let likeNumLimit = 100; // 导出的数据点赞数要求
    let keywords = ''; // 过滤的关键词
    let noteExportUI; // 将在小红书页面初始化

    // --- CSS Styles (from content-styles.css) ---
    GM_addStyle(`
    .search-collector-container {
      position: fixed;
      top: 0;
      /* right: 0; Modified by initCollectorUI based on settings */
      height: 100%;
      display: flex;
      align-items: center;
      z-index: 99999; /* Increased z-index */
    }

    /* Right panel styles */
    .search-collector-sidebar {
      position: relative;
      width: 35px;
      height: 100%;
      background-color: rgba(247, 247, 247, 0.8);
      text-align: center;
      border-left: 1px solid rgba(0, 0, 0, 0.05);
    }

    .search-collector-toggle {
      position: absolute;
      top: 250px;
      right: 0;
      transform: translateY(-50%);
      padding: 12px 10px;
      background-color: #FF6464;
      color: #fff;
      border: none;
      cursor: pointer;
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
      box-shadow: -2px 2px 8px rgba(255, 100, 100, 0.3);
      font-weight: bold;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      transition: all 0.2s ease;
    }

    .search-collector-toggle:hover {
      background-color: #ff7a7a;
      box-shadow: -3px 3px 10px rgba(255, 100, 100, 0.4);
      transform: translateY(-50%) translateX(-2px);
    }

    .search-collector-popup {
      position: fixed;
      top: 0;
      /* left: 100%; Modified by initCollectorUI */
      width: 0;
      height: 100%;
      overflow-y: auto;
      background-color: #fff;
      border-left: 1px solid #eaeaea;
      transition: left 0.3s ease-in-out, right 0.3s ease-in-out; /* Added right transition */
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
      z-index: 99999; /* Increased z-index */
    }

    .search-collector-popup.active {
      /* left: calc(100% - 400px); Modified by initCollectorUI */
      width: 400px;
    }

    /* Left panel styles */
    .search-collector-sidebar-left {
      position: relative;
      width: 35px;
      height: 100%;
      background-color: rgba(247, 247, 247, 0.8);
      text-align: center;
      border-right: 1px solid rgba(0, 0, 0, 0.05);
    }

    .search-collector-toggle-left {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      padding: 12px 10px;
      background-color: #FF6464;
      color: #fff;
      border: none;
      cursor: pointer;
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
      box-shadow: 2px 2px 8px rgba(255, 100, 100, 0.3);
      font-weight: bold;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      transition: all 0.2s ease;
    }

    .search-collector-toggle-left:hover {
      background-color: #ff7a7a;
      box-shadow: 3px 3px 10px rgba(255, 100, 100, 0.4);
      transform: translateY(-50%) translateX(2px);
    }

    .search-collector-popup-left {
      position: fixed;
      top: 0;
      /* right: 100%; Modified by initCollectorUI */
      width: 0;
      height: 100%;
      overflow-y: auto;
      background-color: #fff;
      border-right: 1px solid #eaeaea;
      transition: right 0.3s ease-in-out, left 0.3s ease-in-out; /* Added left transition */
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
      z-index: 99999; /* Increased z-index */
    }

    .search-collector-popup-left.active-left {
      /* right: calc(100% - 400px); Modified by initCollectorUI */
      width: 400px;
    }

    /* Common styles */
    .search-collector-content {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .search-collector-title {
      font-weight: bold;
      margin-bottom: 15px; /* Adjusted margin */
      color: #0D0A16;
      font-size: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .search-collector-list {
      list-style: none;
      padding: 0;
      margin: 0 0 15px 0; /* Adjusted margin */
      /* max-height: calc(100vh - 280px); Adjusted dynamically */
      overflow-y: auto;
      flex-grow: 1; /* Allow list to take available space */
    }

    .search-collector-item {
      margin-bottom: 12px;
      padding: 14px;
      background-color: #f9f9f9;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      font-size: 14px;
      transition: all 0.2s;
      color: #333;
      border: 1px solid #eaeaea;
    }

    .search-collector-item:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
      transform: translateY(-2px);
      border-color: rgba(255, 100, 100, 0.3);
    }

    .search-collector-close {
      background: none;
      border: none;
      color: #666;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.2s;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .search-collector-close:hover {
      color: #FF6464;
      background-color: rgba(255, 100, 100, 0.1);
      transform: rotate(90deg);
    }

    .search-collector-inputs {
        margin-bottom: 15px;
    }

    .search-collector-inputs textarea {
        width: 100%;
        min-height: 80px;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        font-size: 14px;
        margin-bottom: 10px;
    }

    .search-collector-tip {
        font-size: 13px;
        color: #FF6464;
        margin-bottom: 10px;
        padding: 5px 10px;
        background-color: rgba(255, 100, 100, 0.1);
        border-radius: 6px;
        border-left: 3px solid #FF6464;
    }

    .search-collector-inputs .level-selector {
        margin-bottom: 10px;
        font-size: 14px;
    }
    .search-collector-inputs .level-selector label {
        margin-right: 10px;
        cursor: pointer;
        position: relative;
        z-index: 10; /* 确保较高的层级 */
        display: inline-block;
        padding: 3px 5px;
    }
     .search-collector-inputs .level-selector input {
        margin-right: 4px;
        accent-color: #FF6464;
        cursor: pointer;
        position: relative;
        z-index: 10; /* 确保较高的层级 */
    }

    .search-collector-start-button {
      margin-bottom: 15px; /* Adjusted */
      padding: 12px 16px; /* Adjusted */
      background-color: #4CAF50; /* Green for start */
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
    }
    .search-collector-start-button:hover {
      background-color: #5cb85c; /* Darker green */
      transform: translateY(-2px);
    }
    .search-collector-start-button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }

    .search-collector-format-options {
      margin-bottom: 15px; /* Adjusted */
      font-size: 14px;
    }
    .search-collector-format-options label {
      margin-right: 15px;
      cursor: pointer;
      position: relative;
      z-index: 10; /* 确保较高的层级 */
      display: inline-block;
      padding: 3px 5px;
    }
    .search-collector-format-options input {
      margin-right: 5px;
      accent-color: #FF6464;
      cursor: pointer;
      position: relative;
      z-index: 10; /* 确保较高的层级 */
    }

    .search-collector-download {
      /* margin-top: 10px; Adjusted, now less margin needed */
      padding: 12px 16px; /* Adjusted */
      background-color: #FF6464;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      box-shadow: 0 4px 8px rgba(255, 100, 100, 0.3);
    }

    .search-collector-download:hover {
      background-color: #ff7a7a;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(255, 100, 100, 0.4);
    }

    .search-collector-download:disabled {
      background-color: #7a5f5f; /* Original disabled color */
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .search-collector-status {
        font-size: 13px;
        color: #666;
        margin-top: 10px;
        text-align: center;
        min-height: 20px;
    }

    .search-collector-level {
      display: inline-block;
      padding: 4px 8px;
      background-color: #f0f0f0;
      border-radius: 30px;
      font-size: 12px;
      margin-right: 8px;
      color: #555;
      border: 1px solid #e0e0e0;
    }

    .search-collector-level-1 {
      background-color: rgba(255, 100, 100, 0.15);
      color: #FF6464;
      border-color: rgba(255, 100, 100, 0.3);
    }

    .search-collector-level-2 {
      background-color: rgba(74, 222, 128, 0.15);
      color: #4ade80;
      border-color: rgba(74, 222, 128, 0.3);
    }

    .search-collector-level-3 {
      background-color: rgba(250, 204, 21, 0.15);
      color: #facc15;
      border-color: rgba(250, 204, 21, 0.3);
    }

    .search-collector-level-4 { /* Assuming max 3 levels from popup, but CSS had 4 */
      background-color: rgba(96, 165, 250, 0.15); /* Blueish */
      color: #60a5fa;
      border-color: rgba(96, 165, 250, 0.3);
    }

    .search-collector-level-btn,
    .search-collector-format-btn {
      display: inline-block;
      padding: 5px 12px;
      margin-right: 8px;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      background-color: #f6f6f6;
      color: #666;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 13px;
    }

    .search-collector-level-btn:hover,
    .search-collector-format-btn:hover {
      background-color: #f0f0f0;
      border-color: #ccc;
    }

    .search-collector-level-btn.active,
    .search-collector-format-btn.active {
      background-color: #FF6464;
      color: white;
      border-color: #FF6464;
    }

    /* 小红书笔记导出样式 */
    .export-note {
      margin: 6px 0 12px 0;
    }
    .group-header-title {
      font-size: 16px;
      border-bottom: 1px solid #eee;
      padding: 10px 0;
      margin-bottom: 10px;
      color: rgba(51, 51, 51, 0.6);
    }
    .group-header-title a {
      float: right;
      color: #f6333b;
    }
    #itemNum {
      font-weight: bold;
      color: red;
    }
    .export-data {
      margin: 6px 0;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row-reverse;
      border: solid 1px #eee;
      border-radius: 16px;
      padding: 6px;
      line-height: 25px;
    }
    .export-button {
      text-align: center;
      padding: 6px;
      background-color: #ff2442;
      color: #ffffff;
      border-radius: 5px;
      cursor: pointer;
      border: 1px solid transparent;
    }
    .input-xhs {
      margin: 0 4px;
      padding: 2px 4px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #eee;
      width: 60px;
    }
    `);

    // --- Helper Functions (from content-script.js and popup.js) ---

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getCurrentSiteName() {
      if (currentDomain.includes("douyin")) return "抖音";
      if (currentDomain.includes("xiaohongshu")) return "小红书";
      if (currentDomain.includes("bilibili")) return "B站";
      // if (currentDomain.includes("zhihu")) return "知乎"; // Zhihu was not in manifest matches
      if (currentDomain.includes("baidu")) return "百度";
      if (currentDomain.includes("google")) return "Google";
      return "搜索推荐词";
    }

    function downloadFile(content, filename, type) {
      const blob = new Blob([content], { type: type });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up
    }

    function convertToMindmap(data) {
      let markdown = '# 搜索推荐词采集 (' + getCurrentSiteName() + ')\n\n';
      data.forEach(item => {
        const level = item[0]; // Level is already 1-based
        const keyword = item[1];
        let prefix = '';
        for (let j = 0; j < Math.min(level, 6); j++) {
          prefix += '#';
        }
        markdown += prefix + ' ' + keyword + '\n';
      });
      return markdown;
    }

    function downloadResults(format) {
      if (collectKeywordList.length === 0) {
        collectorUI.updateStatus("没有可下载的内容！", "error");
        setTimeout(() => collectorUI.updateStatus(""), 3000);
        return;
      }
      const siteName = getCurrentSiteName();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);

      if (format === 'md') {
        const markdown = convertToMindmap(collectKeywordList);
        downloadFile(markdown, `${siteName}_思维导图_${timestamp}.md`, "text/markdown;charset=utf-8");
      } else { // CSV
        // csvContent already includes header and data
        downloadFile("﻿" + csvContent, `${siteName}_关键词_${timestamp}.csv`, "text/csv;charset=utf-8");
      }
      collectorUI.updateStatus("下载完成！", "success");
      setTimeout(() => collectorUI.updateStatus(""), 3000);
    }


    function getNeetElement(type) {
      let result;
      if (type === "search") {
        if (currentDomain.includes("douyin")) {
          result = document.querySelector('header input[data-e2e="searchbar-input"], input[placeholder*="搜索"]');
        } else if (currentDomain.includes("xiaohongshu")) {
          result = document.querySelector('.search-input, .css-144esmc, input[placeholder*="搜索"]'); // Added fallbacks for XHS
        } else if (currentDomain.includes("bilibili")) {
          result = document.querySelector('.nav-search-input, .bili-search-input, #nav-searchform input');
        } else if (currentDomain.includes("baidu")) {
          result = document.querySelector('#kw');
        } else if (currentDomain.includes("google")) {
          result = document.querySelector('textarea[name="q"], input[name="q"]');
        }
      } else if (type === "recommend") {
        if (currentDomain.includes("douyin")) {
          result = document.querySelectorAll("header div[data-index]"); // Original
        } else if (currentDomain.includes("xiaohongshu")) {
           // Try multiple selectors for XHS recommendations
          result = document.querySelectorAll("div.sug-item, .recommend-item, .suggest-item, .search-suggest-item");
        } else if (currentDomain.includes("bilibili")) {
          result = document.querySelectorAll("div.suggestions div.suggest-item, .search-panel .suggest-item");
        } else if (currentDomain.includes("baidu")) {
          result = document.querySelectorAll('ul li.bdsug-overflow, #form .bdsug-overflow');
        } else if (currentDomain.includes("google")) {
          result = document.querySelectorAll('ul[role="listbox"] li[role="presentation"] div[role="option"] div[role="presentation"]:first-child span, ul[role="listbox"] li div[role="option"]');
        }
      }
      return result;
    }

    function inputDispatchEvent(input, value) {
        if (!input) return;

        // 确保value是有效的字符串
        value = value || '';

        // More robust event dispatching
        input.focus();
        input.value = value;

        const eventsToDispatch = [
            new Event('keydown', { bubbles: true, cancelable: true }),
            new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: value }),
            new Event('keyup', { bubbles: true, cancelable: true }),
            new Event('change', { bubbles: true, cancelable: true })
        ];

        eventsToDispatch.forEach(event => input.dispatchEvent(event));
        console.log("已输入关键词: " + value + " 到元素: ", input);
    }


    async function getSearchKeywords(q_str) { // Renamed q to q_str
      const searchInput = getNeetElement("search");
      if (!searchInput) {
          console.error("无法找到搜索输入框 for getSearchKeywords");
          return [];
      }

      // 检查搜索关键词是否为空
      if (!q_str || q_str.trim() === '') {
          console.log("搜索关键词为空，无法获取推荐");
          return [];
      }

      inputDispatchEvent(searchInput, q_str);
      await sleep(GM_getValue('recommendationDelay', 3000)); // Configurable delay

      const recommendElements = getNeetElement("recommend");
      const keywords = [];

      if (recommendElements && recommendElements.length > 0) {
        recommendElements.forEach(element => {
          // Attempt to get text more robustly
          let text = (element.textContent || element.innerText || "").trim();
          if (text) {
            // Clean up potential inner HTML if only textContent was desired
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = element.innerHTML;
            text = (tempDiv.textContent || tempDiv.innerText || "").trim();
            if (text && !keywords.includes(text)) { // Avoid duplicates from same batch
                 keywords.push(text);
            }
          }
        });
      }
      // Clear search input for next iteration if needed by some sites
      // inputDispatchEvent(searchInput, ""); // Optional: clear after suggestions are fetched
      return keywords;
    }

    async function search(q_str, currentLevel) { // Renamed q to q_str
        if (!isCollecting) return;

        // 检查关键词是否为空
        if (!q_str || q_str.trim() === '') {
            console.log("忽略空关键词");
            return;
        }

        collectorUI.updateTitle(`采集中 (L${currentLevel}): ${q_str} (${kwIndex + 1}/${keywordList.length} base)`);

        // Add current keyword to results (as its own recommendation at its level)
        // This was slightly different in original, here we add it *before* searching its sub-keywords
        if (!collectKeywordList.some(item => item[0] === currentLevel && item[1] === q_str)) {
             collectKeywordList.push([currentLevel, q_str]);
             csvContent += `${currentLevel},"${q_str.replace(/"/g, '""')}"\n`;
             collectorUI.addKeyword(currentLevel, q_str);
        }

        console.log(`当前层级: ${currentLevel}, 最大层级: ${collectLevel}, 继续采集: ${currentLevel < collectLevel}`);

        // 无论选择哪个层级，我们都获取当前关键词的推荐词
        // 只有在递归时才判断是否达到最大层级
        const recommended = await getSearchKeywords(q_str);
        console.log(`获取到推荐数量: ${recommended.length}`);

        if (recommended.length > 0) {
            // 按照用户期望的顺序处理关键词
            for (const recKeyword of recommended) {
                if (!isCollecting) return; // Check before each recursive call

                // Avoid re-searching a keyword if it's already a base keyword or collected at a higher/same level
                const alreadyProcessed = keywordList.includes(recKeyword) ||
                                     collectKeywordList.some(item => item[1] === recKeyword && item[0] <= currentLevel + 1);

                if (!alreadyProcessed && recKeyword.toLowerCase() !== q_str.toLowerCase()) {
                     // Add to results before diving deeper
                    if (!collectKeywordList.some(item => item[0] === currentLevel + 1 && item[1] === recKeyword)) {
                        collectKeywordList.push([currentLevel + 1, recKeyword]);
                        csvContent += `${currentLevel + 1},"${recKeyword.replace(/"/g, '""')}"\n`;
                        collectorUI.addKeyword(currentLevel + 1, recKeyword);
                    }

                    // 只有当未达到最大层级时才继续递归
                    if (currentLevel + 1 < collectLevel) {
                        // 始终采用深度优先，先完整处理这个推荐词
                        await search(recKeyword, currentLevel + 1); // 递归采集下一级
                    }
                } else if (recKeyword.toLowerCase() !== q_str.toLowerCase()) {
                     // Still add it to list if it's a direct recommendation but won't dive
                     if (!collectKeywordList.some(item => item[0] === currentLevel + 1 && item[1] === recKeyword)) {
                        collectKeywordList.push([currentLevel + 1, recKeyword]);
                        csvContent += `${currentLevel + 1},"${recKeyword.replace(/"/g, '""')}"\n`;
                        collectorUI.addKeyword(currentLevel + 1, recKeyword);
                    }
                }
                await sleep(GM_getValue('searchInterval', 500)); // Delay between processing each recommended keyword
            }
        }
    }

    async function searchByNextKeyword() {
      if (kwIndex < keywordList.length && isCollecting) {
        const keyword = keywordList[kwIndex];
        await search(keyword, 1); // Start search for this base keyword at level 1
        kwIndex++;
        if (isCollecting) { // Check again, might have been stopped
            await sleep(GM_getValue('baseKeywordInterval', 1000)); // Delay between base keywords
            searchByNextKeyword(); // Process next base keyword
        } else {
            finishCollection();
        }
      } else {
        finishCollection();
      }
    }

    function finishCollection() {
        if (!isCollecting && kwIndex === 0 && collectKeywordList.length === 0) return; // Avoid finishing if never started properly

        isCollecting = false;
        collectorUI.updateTitle(`采集完成 (共${collectKeywordList.length}个)`);
        collectorUI.setCollectingStatus(false);
        collectorUI.updateStatus("关键词采集完成！", "success");
        console.log("关键词采集完成！", collectKeywordList);
    }

    async function startCollection(keywordsInput, levelInput) {
      if (isCollecting) {
        collectorUI.updateStatus('已有采集任务正在进行中', "error");
        return false;
      }

      // 检查输入的关键词是否有效
      if (!keywordsInput || keywordsInput.trim() === '') {
        collectorUI.updateStatus('请输入至少一个关键词', "error");
        setTimeout(() => collectorUI.updateStatus(""), 3000);
        return false;
      }

      // 检查网站搜索框是否有内容
      const searchInput = getNeetElement("search");
      if (!searchInput || !searchInput.value || searchInput.value.trim() === '') {
        collectorUI.updateStatus('请先在网站搜索框输入任意字符', "error");
        setTimeout(() => collectorUI.updateStatus(""), 3000);
        return false;
      }

      isCollecting = true; // Set early to prevent re-entry
      kwIndex = 0;
      csvContent = "层级,关键词\n"; // CSV header
      keywordList = [];
      collectKeywordList = [];

      // 强制转换levelInput为数字类型，确保正确的层级设置
      const levelValue = parseInt(levelInput);
      if (isNaN(levelValue) || levelValue < 1 || levelValue > 3) {
        collectLevel = 1; // 默认为1级
        console.log("不合法的层级值，使用默认值1");
      } else {
        collectLevel = levelValue;
        console.log("设置采集层级为:", collectLevel);
      }

      const lines = keywordsInput.split('\n').filter(item => item.trim() !== '');
      for (const item of lines) {
        if (item.includes("{c}")) {
          keywordList.push(item.replace("{c}", "").trim()); // Add original without {c} if not empty
          for (let j = 97; j <= 122; j++) { // a-z
            keywordList.push(item.replace("{c}", String.fromCharCode(j)).trim());
          }
        } else {
          keywordList.push(item.trim());
        }
      }
      keywordList = [...new Set(keywordList.filter(k => k))]; // Unique, non-empty

      if (keywordList.length === 0) {
        collectorUI.updateStatus('没有可采集的关键词', "error");
        isCollecting = false; // Reset if no keywords
        return false;
      }

      collectorUI.clearResults();
      collectorUI.updateTitle("采集中...");
      collectorUI.setCollectingStatus(true);
      collectorUI.updateStatus("采集中...", "loading");

      // Save the keywords and level for next time (like popup.js did)
      GM_setValue('lastKeywords', keywordsInput);
      GM_setValue('defaultLevel', collectLevel.toString());

      await searchByNextKeyword();
      return true;
    }

    // --- UI Initialization and Management ---
    function initCollectorUI() {
      const container = document.createElement('div');
      container.className = 'search-collector-container';

      // Get settings from GM storage with defaults
      const panelPosition = GM_getValue('panelPosition', 'right');
      const defaultFormat = GM_getValue('defaultFormat', 'csv');
      const defaultLevelVal = GM_getValue('defaultLevel', '1');
      const lastKeywords = GM_getValue('lastKeywords', '');
      const autoShowResults = GM_getValue('autoShowResults', 'yes') === 'yes'; // boolean

      let sidebarClass = 'search-collector-sidebar';
      let toggleClass = 'search-collector-toggle';
      let popupClass = 'search-collector-popup';
      let activeClass = 'active';

      if (panelPosition === 'left') {
        container.style.left = '0';
        container.style.right = 'auto';
        sidebarClass = 'search-collector-sidebar-left';
        toggleClass = 'search-collector-toggle-left';
        popupClass = 'search-collector-popup-left';
        activeClass = 'active-left';
      } else { // Default to right
        container.style.right = '0';
        container.style.left = 'auto';
      }

      container.innerHTML = `
        <div class="${sidebarClass}">
          <button class="${toggleClass}">采<br>集</button>
        </div>
        <div id="collectorPopupMain" class="${popupClass}">
          <div class="search-collector-content">
            <div class="search-collector-title">
              <span>推荐词采集</span>
              <button class="search-collector-close">×</button>
            </div>

            <div class="search-collector-inputs">
              <textarea id="collector-keywords" placeholder="请输入关键词，支持换行输入多关键词\n添加{c}作为通配符可自动替换为a-z字母">${lastKeywords}</textarea>
              <div class="search-collector-tip">👉 重要：请先在网站搜索框输入任意字符，再点击开始采集</div>
              <div class="level-selector">
                <span>采集层级：</span>
                <button class="search-collector-level-btn ${defaultLevelVal === '1' ? 'active' : ''}" data-level="1">1级</button>
                <button class="search-collector-level-btn ${defaultLevelVal === '2' ? 'active' : ''}" data-level="2">2级</button>
                <button class="search-collector-level-btn ${defaultLevelVal === '3' ? 'active' : ''}" data-level="3">3级</button>
              </div>
            </div>

            <button id="collector-start" class="search-collector-start-button">开始采集</button>
            <div id="collector-status" class="search-collector-status"></div>
            <ul class="search-collector-list"></ul>

            <div class="search-collector-format-options">
              <span>导出格式：</span>
              <button class="search-collector-format-btn ${defaultFormat === 'csv' ? 'active' : ''}" data-format="csv">CSV格式</button>
              <button class="search-collector-format-btn ${defaultFormat === 'md' ? 'active' : ''}" data-format="md">思维导图格式</button>
            </div>
            <button class="search-collector-download">下载结果</button>
          </div>
        </div>
      `;
      document.body.appendChild(container);

      // Adjust popup position based on panelPosition
      const popupElement = container.querySelector(`#collectorPopupMain`);
      if (panelPosition === 'left') {
          popupElement.style.borderRight = '1px solid #eaeaea';
          popupElement.style.borderLeft = 'none';
      } else {
          popupElement.style.borderLeft = '1px solid #eaeaea';
          popupElement.style.borderRight = 'none';
      }


      const toggleButton = container.querySelector(`.${toggleClass}`);
      const closeButton = container.querySelector('.search-collector-close');
      const popup = container.querySelector(`.${popupClass}`); // Use the ID for more specific selection
      const downloadButton = container.querySelector('.search-collector-download');
      const startButton = container.querySelector('#collector-start');
      const keywordsTextarea = container.querySelector('#collector-keywords');
      const statusDiv = container.querySelector('#collector-status');
      const resultsList = container.querySelector('.search-collector-list');
      const titleSpan = container.querySelector('.search-collector-title span');


      const uiMethods = {
        showResult: function() {
          if (panelPosition === 'left') popup.style.right = 'calc(100% - 400px)';
          else popup.style.left = 'calc(100% - 400px)';
          popup.classList.add(activeClass);
          this.adjustListHeight();
        },
        hideResult: function() {
          if (panelPosition === 'left') popup.style.right = '100%';
          else popup.style.left = '100%';
          popup.classList.remove(activeClass);
        },
        addKeyword: function(level, keyword) {
          const item = document.createElement('li');
          item.className = 'search-collector-item';
          const levelClass = `search-collector-level-${Math.min(level, 4)}`; // Max style is level 4
          item.innerHTML = `<span class="search-collector-level ${levelClass}">${level}级</span> ${keyword}`;
          resultsList.appendChild(item);
          resultsList.scrollTop = resultsList.scrollHeight;
        },
        clearResults: function() {
          resultsList.innerHTML = '';
        },
        updateTitle: function(text) {
          titleSpan.textContent = text;
        },
        setCollectingStatus: function(collecting) {
          startButton.disabled = collecting;
          downloadButton.disabled = collecting;
          if (collecting) {
            startButton.textContent = '采集中...';
          } else {
            startButton.textContent = '开始采集';
          }
        },
        updateStatus: function(message, type = "") { // success, error, loading
            statusDiv.textContent = message;
            statusDiv.className = 'search-collector-status'; // Reset
            if (type) {
                statusDiv.classList.add(`status-${type}`); // Assuming CSS for .status-success, .status-error etc.
            }
        },
        adjustListHeight: function() {
            // Dynamically adjust list height
            const contentDiv = popup.querySelector('.search-collector-content');
            const titleHeight = titleSpan.offsetHeight;
            const inputsHeight = container.querySelector('.search-collector-inputs').offsetHeight;
            const startButtonHeight = startButton.offsetHeight;
            const statusHeight = statusDiv.offsetHeight;
            const formatOptionsHeight = container.querySelector('.search-collector-format-options').offsetHeight;
            const downloadButtonHeight = downloadButton.offsetHeight;
            const padding = 40; // Combined top/bottom padding of content div
            const margins = 60; // Sum of various margins between elements

            const availableHeight = contentDiv.clientHeight - titleHeight - inputsHeight - startButtonHeight - statusHeight - formatOptionsHeight - downloadButtonHeight - padding - margins;
            resultsList.style.maxHeight = Math.max(100, availableHeight) + 'px'; // Minimum height 100px
        }
      };

      toggleButton.addEventListener('click', () => {
        if (popup.classList.contains(activeClass)) {
            uiMethods.hideResult();
        } else {
            uiMethods.showResult();
        }
      });

      closeButton.addEventListener('click', () => uiMethods.hideResult());

      // 为采集层级和导出格式的标签添加点击事件
      const levelButtons = container.querySelectorAll('.level-selector button');
      levelButtons.forEach(button => {
        button.addEventListener('click', function(e) {
          // 阻止事件冒泡，避免多次触发
          e.stopPropagation();
          const level = this.getAttribute('data-level');
          if (level) {
            // 设置其他同名按钮为未选中
            document.querySelectorAll('.level-selector button').forEach(el => {
              el.classList.remove('active');
            });
            // 设置当前按钮为选中
            this.classList.add('active');
            // 保存设置到GM存储
            GM_setValue('defaultLevel', level);
          }
        });
      });

      const formatButtons = container.querySelectorAll('.search-collector-format-btn');
      formatButtons.forEach(button => {
        button.addEventListener('click', function(e) {
          // 阻止事件冒泡，避免多次触发
          e.stopPropagation();
          const format = this.getAttribute('data-format');
          if (format) {
            // 设置其他同名按钮为未选中
            document.querySelectorAll('.search-collector-format-btn').forEach(el => {
              el.classList.remove('active');
            });
            // 设置当前按钮为选中
            this.classList.add('active');
            // 保存设置到GM存储
            GM_setValue('defaultFormat', format);
          }
        });
      });

      startButton.addEventListener('click', () => {
        const keywords = keywordsTextarea.value.trim();
        const levelButton = container.querySelector('.level-selector button.active');

        // 先检查关键词
        if (!keywords) {
          uiMethods.updateStatus("请输入关键词！", "error");
          setTimeout(() => uiMethods.updateStatus(""), 3000);
          return;
        }

        // 再检查层级
        if (!levelButton) {
          uiMethods.updateStatus("请选择采集层级！", "error");
          setTimeout(() => uiMethods.updateStatus(""), 3000);
          return;
        }

        const level = levelButton.getAttribute('data-level');
        if (!level) {
          uiMethods.updateStatus("采集层级错误！", "error");
          setTimeout(() => uiMethods.updateStatus(""), 3000);
          return;
        }

        startCollection(keywords, level); // startCollection will handle UI updates for status
      });

      downloadButton.addEventListener('click', () => {
        const formatType = container.querySelector('.search-collector-format-btn.active').getAttribute('data-format');
        downloadResults(formatType);
      });

      // Click outside to close (optional, can be annoying)
      // document.addEventListener('click', (e) => {
      //   if (!container.contains(e.target) && popup.classList.contains(activeClass)) {
      //     uiMethods.hideResult();
      //   }
      // });

      // Initial call to set list height if panel is open by default
      if (popup.classList.contains(activeClass)) {
         uiMethods.adjustListHeight();
      }
      // And on window resize
      window.addEventListener('resize', () => {
          if (popup.classList.contains(activeClass)) {
              uiMethods.adjustListHeight();
          }
      });

      if (autoShowResults) { // From options
          // uiMethods.showResult(); // Let user click to open first time.
      }

      return uiMethods;
    }

    // --- 小红书笔记导出功能 ---

    // 抓取笔记数据
    function fetchNoteData() {
        var itemNumElement = document.getElementById('itemNum');

        // 获取笔记列表元素
        const listElements = document.querySelectorAll('.note-item');
        const domain = 'https://www.xiaohongshu.com';

        listElements.forEach(item => {
            const linkElement = item.querySelector('a.cover.ld.mask');
            if (linkElement) {
                const link = domain + linkElement.getAttribute('href'); // 拼接完整链接
                let title = item.querySelector('.title').textContent;
                let author = item.querySelector('.author').textContent;
                let likeCount = item.querySelector('.like-wrapper').textContent;
                let links = item.querySelector('a').getAttribute('href');

                let itemIndex = item.dataset.index ? item.dataset.index : 0;

                likeCount = convertToNumber(likeCount ? likeCount : 0);
                let itemData = [title, author, likeCount, link];
                noteData[itemIndex] = itemData;
            }
        });

        noteItemNum = noteData.length;

        if (itemNumElement) {
            itemNumElement.textContent = noteItemNum; // 更新文本内容
        }
    }

    // 过滤点赞数限制的数据
    function filterArrayByLikeNum(arr, limit) {
        var newArray = [];
        arr.forEach(function (subArray) {
            if (subArray[2] > limit) {
                newArray.push(subArray);
            }
        });
        return newArray;
    }

    // 检查字符串是否包含任何关键词
    function containsAnyKeyword(str, keywords) {
        const regexPattern = `(${keywords.join('|')})`;
        const regex = new RegExp(regexPattern, 'i'); // 'i' 表示不区分大小写
        return regex.test(str);
    }

    // 过滤指定关键词
    function filterArrayByTitle(arr, keywords) {
        var newArray = [];
        arr.forEach(function (subArray) {
            if (!containsAnyKeyword(subArray[0], keywords)) {
                newArray.push(subArray);
            }
        });
        return newArray;
    }

    // 点击导出按钮时执行的函数
    function onExportButtonClick() {
        exportArrayToExcel(noteData, excel_title);
    }

    // 导出到Excel
    function exportArrayToExcel(dataArray, fileName) {
        var newDataArray = dataArray;
        var keywordArray = [];
        var limit = parseFloat(document.getElementById("likeNumLimit").value);
        var keywords_value = document.getElementById("keywords").value;

        if (limit > 0) {
            newDataArray = filterArrayByLikeNum(dataArray, limit);
            if (keywords_value && keywords_value != '') {
                keywordArray = keywords_value.split(","); // 使用逗号作为分隔符
                newDataArray = filterArrayByTitle(newDataArray, keywordArray);
            }
        }

        newDataArray.unshift(['标题', '作者', '点赞数', '链接']);

        // 创建一个工作簿
        const workbook = XLSX.utils.book_new();
        // 将数组转换为工作表
        const worksheet = XLSX.utils.aoa_to_sheet(newDataArray);
        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        // 导出工作簿
        XLSX.writeFile(workbook, fileName + ".xlsx");
    }

    // 转换点赞数为数字
    function convertToNumber(text) {
        // 移除空格
        text = text.replace(/\s+/g, '');
        // 检测单位
        if (text.endsWith('w')) {
            // 移除单位并转换为数字
            return parseFloat(text.slice(0, -1)) * 10000;
        } else {
            // 如果没有单位，直接返回转换后的数字
            return parseFloat(text);
        }
    }

    // 初始化小红书笔记导出功能
    function initNoteExport() {
        // 获取URL中的关键词
        var url = new URL(window.location.href);
        var keyword = url.searchParams.get('keyword');
        if (keyword) {
            keyword = decodeURIComponent(keyword);
            excel_title = keyword + ' - 小红书数据';
        } else if (document.title) {
            excel_title = document.title;
        }

        // 找到目标元素并插入导出面板
        var targetElement = document.querySelector('.channel-list');
        if (!targetElement) return false; // 如果找不到目标元素，则退出

        // 创建一个新的 div 元素
        var exportDiv = document.createElement('div');
        // 设置 div 的内容
        exportDiv.innerHTML = `
            <div class="export-note">
                <div class="group-header-title">红薯笔记导出</div>
                支持导出页面上加载过的笔记列表<br>
                方便运营人员做数据分析提高工作效率<br>
                当前已加载<span id="itemNum">0</span>条数据<br>
                上下滑动鼠标可以加载更多
                <div class="group-header-title">导出设置</div>
                只导出点赞大于<input name="like-num" id="likeNumLimit" value="${likeNumLimit}" class="input-xhs" type="number"/>的数据<br>
                过滤标题中带有<input name="keywords" id="keywords" value="${keywords}" class="input-xhs" type="text"/>的内容
            </div>`;

        // 添加类名
        exportDiv.className = 'export-data';

        // 创建导出按钮
        const button = document.createElement('button');
        button.textContent = '导出excel';
        button.className = 'export-button';
        button.addEventListener('click', onExportButtonClick);

        // 添加到页面
        targetElement.appendChild(exportDiv);
        exportDiv.appendChild(button);

        // 监听鼠标滑动更新数据
        document.addEventListener('mousemove', function(event) {
            fetchNoteData();
        });

        // 页面加载完初始读取
        fetchNoteData();

        return true;
    }

    // --- Main Execution ---
     // 初始化小红书笔记采集助手（采集到飞书表格）
     setTimeout(() => {
      initFeishuCollector();
      console.log('小红书笔记采集到飞书表格功能已加载');
    }, 2500);

    function main() {
      // 加载搜索推荐词采集功能
      if (isSearchSiteSupported()) {
        collectorUI = initCollectorUI();
        console.log('搜索推荐词采集助手 (油猴版) 已加载');
      } else {
        console.log('搜索推荐词采集助手 (油猴版): 当前网站不支持');
      }

      // 如果是小红书，尝试加载笔记导出功能
      if (currentDomain.includes("xiaohongshu")) {
        // 延迟加载笔记导出功能，确保页面元素已完全加载
        setTimeout(() => {
          const initialized = initNoteExport();
          if (initialized) {
            console.log('小红书笔记导出功能已加载');
          } else {
            console.log('小红书笔记导出功能加载失败：未找到目标元素');
          }
        }, 2000);
      }
    }

    function isSearchSiteSupported() {
      return currentDomain.includes("xiaohongshu") ||
             currentDomain.includes("douyin") ||
             currentDomain.includes("bilibili") ||
             currentDomain.includes("baidu") ||
             currentDomain.includes("google");
    }

    // Delay initialization slightly to ensure page is fully interactive, especially for SPAs
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(main, 1000); // Wait 1 sec
    } else {
        window.addEventListener('load', () => setTimeout(main, 1000));
    }

})();
// --- 小红书笔记采集到飞书功能 ---
function initFeishuCollector() {
  // 创建样式
  const style = document.createElement('style');
  style.textContent = `
      .redbook-collect-panel {
          position: fixed;
          top: 80px;
          right: 20px;
          width: 300px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #333;
          overflow: hidden;
          transition: all 0.3s ease;
      }
      .redbook-collect-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(45deg, #ff2e4d, #ff4e65);
          color: white;
          padding: 12px 15px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
      }
      .redbook-collect-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
      }
      .redbook-collect-close {
          cursor: pointer;
          font-size: 18px;
      }
      .redbook-collect-body {
          padding: 15px;
      }
      .redbook-collect-form-group {
          margin-bottom: 12px;
      }
      .redbook-collect-label {
          display: block;
          margin-bottom: 5px;
          font-size: 14px;
          font-weight: 500;
      }
      .redbook-collect-input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
      }
      .redbook-collect-button {
          display: inline-block;
          padding: 8px 15px;
          background-color: #ff2e4d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          margin-top: 5px;
          transition: background-color 0.2s;
      }
      .redbook-collect-button:hover {
          background-color: #e01a3b;
      }
      .redbook-collect-secondary {
          background-color: #6c757d;
      }
      .redbook-collect-secondary:hover {
          background-color: #5a6268;
      }
      .redbook-collect-message {
          margin-top: 10px;
          padding: 8px;
          border-radius: 4px;
          font-size: 14px;
      }
      .redbook-collect-success {
          background-color: #d4edda;
          color: #155724;
      }
      .redbook-collect-error {
          background-color: #f8d7da;
          color: #721c24;
      }
      .redbook-collect-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px;
      }
      .redbook-collect-spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #ff2e4d;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          margin-right: 10px;
      }
      @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
      }
      .redbook-collect-tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 15px;
      }
      .redbook-collect-tab {
          padding: 8px 15px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
      }
      .redbook-collect-tab.active {
          border-bottom: 2px solid #ff2e4d;
          color: #ff2e4d;
      }
      .redbook-collect-panel-minimized {
          width: 50px;
          height: 50px;
          overflow: hidden;
          border-radius: 50%;
          cursor: pointer;
      }
      .redbook-collect-panel-minimized .redbook-collect-header {
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
      }
        .redbook-collect-panel-minimized .redbook-collect-body {
                    display: none;
                }
                .redbook-collect-sidebar-btn {
                    position: fixed;
                    top: 320px; /* 保持你之前调整的位置 */
                    right: 0;
                    transform: translateY(-50%);
                    background-color: rgba(255, 46, 77, 0.8); /* 设置带透明度的背景色 */
                    color: white;
                    padding: 10px 12px; /* 微调内边距 */
                    border-radius: 20px 0 0 20px; /* 左侧更圆的角 */
                    cursor: pointer;
                    z-index: 9998;
                    display: flex;
                    align-items: center;
                    box-shadow: -2px 0 5px rgba(0,0,0,0.1);
                    transition: background-color 0.3s ease, border-radius 0.3s ease, padding 0.3s ease; /* 添加过渡效果 */
                }

                .redbook-collect-sidebar-btn:hover {
                    background-color: #ff2e4d; /* 悬停时完全不透明 */
                    border-radius: 20px; /* 完全圆角（药丸形状） */
                    padding: 10px 15px; /* 轻微增加水平内边距，产生扩展感 */
                }

                .redbook-collect-sidebar-btn-icon {
                    margin-right: 5px;
                    font-size: 16px;
                }
  `;
  document.head.appendChild(style);

  // 创建浮动面板
  const createPanel = () => {
      const panel = document.createElement('div');
      panel.className = 'redbook-collect-panel';
      panel.innerHTML = `
          <div class="redbook-collect-header">
              <h3>小红书笔记采集助手</h3>
              <span class="redbook-collect-close">×</span>
          </div>
          <div class="redbook-collect-body">
              <div class="redbook-collect-tabs">
                  <div class="redbook-collect-tab active" data-tab="action">采集</div>
                  <div class="redbook-collect-tab" data-tab="config">配置</div>
              </div>

              <div id="redbook-collect-action-panel">
                  <div class="redbook-collect-btn-group">
                      <button id="redbook-collect-btn" class="redbook-collect-button">采集笔记</button>
                      <button id="redbook-collect-minimize" class="redbook-collect-button redbook-collect-secondary">最小化</button>
                  </div>
                  <div id="redbook-collect-status" class="redbook-collect-message" style="display: none;"></div>
              </div>

              <div id="redbook-collect-config-panel" style="display: none;">
                  <div class="redbook-collect-form-group">
                      <label class="redbook-collect-label">飞书表格URL</label>
                      <input type="text" id="redbook-collect-table-url" class="redbook-collect-input" placeholder="飞书多维表格URL">
                  </div>
                  <div class="redbook-collect-form-group">
                      <label class="redbook-collect-label">飞书App Token</label>
                      <input type="text" id="redbook-collect-app-token" class="redbook-collect-input" placeholder="飞书应用的App Token">
                  </div>
                  <div class="redbook-collect-form-group">
                      <label class="redbook-collect-label">飞书App Secret</label>
                      <input type="password" id="redbook-collect-app-secret" class="redbook-collect-input" placeholder="飞书应用的App Secret">
                  </div>
                  <button id="redbook-collect-save-config" class="redbook-collect-button">保存配置</button>
              </div>

              <div id="redbook-collect-loading-panel" style="display: none;">
                  <div class="redbook-collect-loading">
                      <div class="redbook-collect-spinner"></div>
                      <span id="redbook-collect-loading-text">正在处理...</span>
                  </div>
              </div>
          </div>
      `;
      document.body.appendChild(panel);

      // 绑定事件
      const closeBtn = panel.querySelector('.redbook-collect-close');
      closeBtn.addEventListener('click', () => {
          panel.remove();
      });

      const tabs = panel.querySelectorAll('.redbook-collect-tab');
      tabs.forEach(tab => {
          tab.addEventListener('click', () => {
              tabs.forEach(t => t.classList.remove('active'));
              tab.classList.add('active');

              const tabName = tab.dataset.tab;
              document.getElementById('redbook-collect-action-panel').style.display = tabName === 'action' ? 'block' : 'none';
              document.getElementById('redbook-collect-config-panel').style.display = tabName === 'config' ? 'block' : 'none';
              document.getElementById('redbook-collect-loading-panel').style.display = 'none';
          });
      });

      const minimizeBtn = document.getElementById('redbook-collect-minimize');
      minimizeBtn.addEventListener('click', () => {
          panel.classList.add('redbook-collect-panel-minimized');
      });

      panel.addEventListener('click', (e) => {
          if (panel.classList.contains('redbook-collect-panel-minimized') && e.target.closest('.redbook-collect-header')) {
              panel.classList.remove('redbook-collect-panel-minimized');
          }
      });

      // 加载保存的配置
      const tableUrlInput = document.getElementById('redbook-collect-table-url');
      const appTokenInput = document.getElementById('redbook-collect-app-token');
      const appSecretInput = document.getElementById('redbook-collect-app-secret');

      tableUrlInput.value = GM_getValue('tableUrl', '');
      appTokenInput.value = GM_getValue('appToken', '');
      appSecretInput.value = GM_getValue('appSecret', '');

      // 保存配置
      const saveConfigBtn = document.getElementById('redbook-collect-save-config');
      saveConfigBtn.addEventListener('click', () => {
          const tableUrl = tableUrlInput.value.trim();
          const appToken = appTokenInput.value.trim();
          const appSecret = appSecretInput.value.trim();

          if (!tableUrl || !appToken || !appSecret) {
              showStatus('请填写所有必要的配置信息', false);
              return;
          }

          // 解析表格URL获取app_token和table_id
          try {
              const urlParams = parseTableUrl(tableUrl);

              // 保存配置
              GM_setValue('tableUrl', tableUrl);
              GM_setValue('appToken', appToken);
              GM_setValue('appSecret', appSecret);
              GM_setValue('baseAppToken', urlParams.appToken);
              GM_setValue('tableId', urlParams.tableId);

              showStatus('配置已保存，可以开始采集笔记', true);

              // 切换到采集页面
              tabs[0].click();
          } catch (error) {
              showStatus(error.message, false);
          }
      });

      // 采集笔记按钮
      const collectBtn = document.getElementById('redbook-collect-btn');
      collectBtn.addEventListener('click', async () => {
          // 检查当前页面是否是小红书笔记详情页
          const isNotePage = document.querySelector('div[id="noteContainer"]') !== null;

          if (!isNotePage) {
              showStatus('当前页面不是小红书笔记详情页，请打开一篇笔记后再试', false);
              return;
          }

          // 获取配置信息
          const appToken = GM_getValue('appToken', '');
          const appSecret = GM_getValue('appSecret', '');
          const baseAppToken = GM_getValue('baseAppToken', '');
          const tableId = GM_getValue('tableId', '');

          if (!appToken || !appSecret || !baseAppToken || !tableId) {
              showStatus('配置信息不完整，请先完成配置', false);
              return;
          }

          try {
              showLoading('正在采集笔记数据...');
              // 提取笔记数据
              const noteData = collectNoteData();

              showLoading('正在获取飞书访问令牌...');
              // 获取飞书访问令牌
              const token = await getFeishuToken(appToken, appSecret);

              showLoading('正在提交数据到飞书...');
              // 构建请求数据
              const requestData = {
                  fields: {
                      "url": noteData.url,
                      "标题": noteData.title,
                      "作者": noteData.author,
                      "正文": noteData.content,
                      "标签": noteData.tags.tags,
                      "点赞": noteData.likes,
                      "收藏": noteData.collects,
                      "评论": noteData.comments
                  }
              };

              // 提交数据到飞书
              await submitToFeishu(baseAppToken, tableId, token, requestData);

              showStatus('数据已成功提交到飞书多维表格', true);
          } catch (error) {
              showStatus('采集失败: ' + error.message, false);
          }
      });
  };

  // 显示状态消息
  const showStatus = (message, isSuccess) => {
      const statusElement = document.getElementById('redbook-collect-status');
      statusElement.textContent = message;
      statusElement.className = 'redbook-collect-message ' + (isSuccess ? 'redbook-collect-success' : 'redbook-collect-error');
      statusElement.style.display = 'block';

      document.getElementById('redbook-collect-loading-panel').style.display = 'none';
      document.getElementById('redbook-collect-action-panel').style.display = 'block';
  };

  // 显示加载状态
  const showLoading = (loadingText) => {
      document.getElementById('redbook-collect-action-panel').style.display = 'none';
      document.getElementById('redbook-collect-config-panel').style.display = 'none';
      document.getElementById('redbook-collect-loading-panel').style.display = 'block';
      document.getElementById('redbook-collect-loading-text').textContent = loadingText || '正在处理...';
  };

  // 解析表格URL
  function parseTableUrl(url) {
      try {
          // 示例URL: https://bytesmore.feishu.cn/base/UQxWbiiaSa7oqssbIxLclGeVnrV?table=tblQqWO7UfZ3JNTB&view=vewHNkTAcq
          const urlObj = new URL(url);
          const pathParts = urlObj.pathname.split('/');
          const baseAppToken = pathParts[pathParts.length - 1];

          const params = new URLSearchParams(urlObj.search);
          const tableId = params.get('table');

          if (!baseAppToken || !tableId) {
              throw new Error('无法从URL中解析出app_token或table_id');
          }

          return {
              appToken: baseAppToken,
              tableId: tableId
          };
      } catch (error) {
          throw new Error('表格URL格式不正确，无法解析');
      }
  }

  // 提取笔记数据
  function collectNoteData() {
      // 提取页面URL
      const url = window.location.href;

      // 提取作者用户名
      const usernameElement = document.querySelector('span.username');
      const username = usernameElement ? usernameElement.textContent.trim() : '';

      // 提取标题
      const titleElement = document.querySelector('div.interaction-container div.note-scroller div.note-content div.title');
      const title = titleElement ? titleElement.textContent.trim() : '';

      // 提取正文内容
      const noteTextElement = document.querySelector('div.interaction-container div.note-scroller div.note-content div.desc span.note-text > span');
      const content = noteTextElement ? noteTextElement.textContent.trim() : '';

      // 提取标签
      const tagElements = document.querySelectorAll('a.tag');
      const tags = Array.from(tagElements).map(tag => tag.textContent.trim());

      // 提取点赞数
      const likeCountElement = document.querySelector('div.interaction-container div.interactions div.engage-bar-container div.engage-bar div.input-box div.interact-container div.left span.like-wrapper span.count');
      const likes = likeCountElement ? parseInt(likeCountElement.textContent.trim()) || 0 : 0;

      // 提取收藏数
      const collectCountElement = document.querySelector('div.interaction-container div.interactions div.engage-bar-container div.engage-bar div.input-box div.interact-container div.left span.collect-wrapper span.count');
      const collects = collectCountElement ? parseInt(collectCountElement.textContent.trim()) || 0 : 0;

      // 提取评论数
      const chatCountElement = document.querySelector('div.interaction-container div.interactions div.engage-bar-container div.engage-bar div.input-box div.interact-container div.left span.chat-wrapper span.count');
      const comments = chatCountElement ? parseInt(chatCountElement.textContent.trim()) || 0 : 0;

      return {
          url,
          author: username,
          title,
          content,
          tags,
          likes,
          collects,
          comments
      };
  }

  // 获取飞书访问令牌
  function getFeishuToken(appId, appSecret) {
      return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
              method: 'POST',
              url: 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
              headers: {
                  'Content-Type': 'application/json'
              },
              data: JSON.stringify({
                  app_id: appId,
                  app_secret: appSecret
              }),
              onload: function(response) {
                  try {
                      const data = JSON.parse(response.responseText);
                      if (data.code === 0 && data.tenant_access_token) {
                          resolve(data.tenant_access_token);
                      } else {
                          reject(new Error(data.msg || '获取飞书访问令牌失败'));
                      }
                  } catch (e) {
                      reject(new Error('解析响应失败'));
                  }
              },
              onerror: function(error) {
                  reject(new Error('网络请求失败'));
              }
          });
      });
  }

  // 提交数据到飞书
  function submitToFeishu(appToken, tableId, accessToken, data) {
      return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
              method: 'POST',
              url: `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + accessToken
              },
              data: JSON.stringify(data),
              onload: function(response) {
                  try {
                      const result = JSON.parse(response.responseText);
                      if (result.code === 0) {
                          resolve(result);
                      } else {
                          reject(new Error(result.msg || '提交数据到飞书失败'));
                      }
                  } catch (e) {
                      reject(new Error('解析响应失败'));
                  }
              },
              onerror: function(error) {
                  reject(new Error('网络请求失败'));
              }
          });
      });
  }

  // 创建悬浮按钮
  const createFloatingButton = () => {
      const button = document.createElement('div');
      button.style.cssText = `
          position: fixed;
          bottom: 120px;
          right: 20px;
          width: 50px;
          height: 50px;
          background: linear-gradient(45deg, #ff2e4d, #ff4e65);
          border-radius: 50%;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          z-index: 9999;
          font-size: 24px;
      `;
      button.innerHTML = '采集';
      button.title = '小红书笔记采集助手';
      document.body.appendChild(button);

      button.addEventListener('click', () => {
          button.style.display = 'none';
          createPanel();
      });
  };

  // 创建侧边栏悬浮按钮
  const createSidebarButton = () => {
      const button = document.createElement('div');
      button.className = 'redbook-collect-sidebar-btn';
      button.innerHTML = `
          <span class="redbook-collect-sidebar-btn-icon">📝</span>
          <span>采集笔记</span>
      `;
      button.title = '小红书笔记采集助手';
      document.body.appendChild(button);

      button.addEventListener('click', () => {
          // 检查是否已经存在面板
          const existingPanel = document.querySelector('.redbook-collect-panel');
          if (existingPanel) {
              existingPanel.remove();
          }
          createPanel();
      });
  };

       // 在小红书笔记页面创建界面
       if (window.location.hostname.includes('xiaohongshu.com')) {
        // 等待页面完全加载
        setTimeout(() => {
            // createFloatingButton(); // 移除此按钮的创建
            createSidebarButton(); // 保留此按钮的创建
        }, 1000);
    }
  }

// @icon         https://picasso-static.xiaohongshu.com/fe-platform/f43dc4a8baf03678996c62d8db6ebc01a82256ff.png
// @match        https://www.xiaohongshu.com/*
// @match        https://www.xiaohongshu.com/explore/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.min.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3Bwindow.VueDemi%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.13/plugin/timezone.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.13/plugin/utc.min.js
// @require      https://cdn.jsdelivr.net/npm/streamsaver@2.0.6/StreamSaver.js
// @require      data:application/javascript,%3Bwindow.StreamSaver%3DstreamSaver%3B
// @require      https://cdn.jsdelivr.net/npm/pinia@2.2.6/dist/pinia.iife.prod.js
// @require      data:application/javascript,%3Bwindow.Pinia%3DPinia%3B
// @require      https://cdn.jsdelivr.net/npm/pinia-plugin-persistedstate@4.1.3/dist/index.global.js
// @grant        GM.info
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/522922/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522922/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const r=document.createElement("style");r.textContent=e,document.head.append(r)})(` @charset "UTF-8";:root{--el-color-white: #ffffff;--el-color-black: #000000;--el-color-primary-rgb: 255, 46, 77;--el-color-success-rgb: 103, 194, 58;--el-color-warning-rgb: 230, 162, 60;--el-color-danger-rgb: 245, 108, 108;--el-color-error-rgb: 245, 108, 108;--el-color-info-rgb: 144, 147, 153;--el-font-size-extra-large: 20px;--el-font-size-large: 18px;--el-font-size-medium: 16px;--el-font-size-base: 14px;--el-font-size-small: 13px;--el-font-size-extra-small: 12px;--el-font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\u5FAE\u8F6F\u96C5\u9ED1", Arial, sans-serif;--el-font-weight-primary: 500;--el-font-line-height-primary: 24px;--el-index-normal: 1;--el-index-top: 1000;--el-index-popper: 2000;--el-border-radius-base: 4px;--el-border-radius-small: 2px;--el-border-radius-round: 20px;--el-border-radius-circle: 100%;--el-transition-duration: .3s;--el-transition-duration-fast: .2s;--el-transition-function-ease-in-out-bezier: cubic-bezier(.645, .045, .355, 1);--el-transition-function-fast-bezier: cubic-bezier(.23, 1, .32, 1);--el-transition-all: all var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);--el-transition-fade: opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-md-fade: transform var(--el-transition-duration) var(--el-transition-function-fast-bezier), opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);--el-transition-fade-linear: opacity var(--el-transition-duration-fast) linear;--el-transition-border: border-color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-box-shadow: box-shadow var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-transition-color: color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);--el-component-size-large: 40px;--el-component-size: 32px;--el-component-size-small: 24px}:root{color-scheme:light;--el-color-primary: #ff2e4d;--el-color-primary-light-3: rgb(255, 108.7, 130.4);--el-color-primary-light-5: rgb(255, 150.5, 166);--el-color-primary-light-7: rgb(255, 192.3, 201.6);--el-color-primary-light-8: rgb(255, 213.2, 219.4);--el-color-primary-light-9: rgb(255, 234.1, 237.2);--el-color-primary-dark-2: rgb(204, 36.8, 61.6);--el-color-success: #67c23a;--el-color-success-light-3: rgb(148.6, 212.3, 117.1);--el-color-success-light-5: rgb(179, 224.5, 156.5);--el-color-success-light-7: rgb(209.4, 236.7, 195.9);--el-color-success-light-8: rgb(224.6, 242.8, 215.6);--el-color-success-light-9: rgb(239.8, 248.9, 235.3);--el-color-success-dark-2: rgb(82.4, 155.2, 46.4);--el-color-warning: #e6a23c;--el-color-warning-light-3: rgb(237.5, 189.9, 118.5);--el-color-warning-light-5: rgb(242.5, 208.5, 157.5);--el-color-warning-light-7: rgb(247.5, 227.1, 196.5);--el-color-warning-light-8: rgb(250, 236.4, 216);--el-color-warning-light-9: rgb(252.5, 245.7, 235.5);--el-color-warning-dark-2: rgb(184, 129.6, 48);--el-color-danger: #f56c6c;--el-color-danger-light-3: rgb(248, 152.1, 152.1);--el-color-danger-light-5: rgb(250, 181.5, 181.5);--el-color-danger-light-7: rgb(252, 210.9, 210.9);--el-color-danger-light-8: rgb(253, 225.6, 225.6);--el-color-danger-light-9: rgb(254, 240.3, 240.3);--el-color-danger-dark-2: rgb(196, 86.4, 86.4);--el-color-error: #f56c6c;--el-color-error-light-3: rgb(248, 152.1, 152.1);--el-color-error-light-5: rgb(250, 181.5, 181.5);--el-color-error-light-7: rgb(252, 210.9, 210.9);--el-color-error-light-8: rgb(253, 225.6, 225.6);--el-color-error-light-9: rgb(254, 240.3, 240.3);--el-color-error-dark-2: rgb(196, 86.4, 86.4);--el-color-info: #909399;--el-color-info-light-3: rgb(177.3, 179.4, 183.6);--el-color-info-light-5: rgb(199.5, 201, 204);--el-color-info-light-7: rgb(221.7, 222.6, 224.4);--el-color-info-light-8: rgb(232.8, 233.4, 234.6);--el-color-info-light-9: rgb(243.9, 244.2, 244.8);--el-color-info-dark-2: rgb(115.2, 117.6, 122.4);--el-bg-color: #ffffff;--el-bg-color-page: #f2f3f5;--el-bg-color-overlay: #ffffff;--el-text-color-primary: #303133;--el-text-color-regular: #606266;--el-text-color-secondary: #909399;--el-text-color-placeholder: #a8abb2;--el-text-color-disabled: #c0c4cc;--el-border-color: #dcdfe6;--el-border-color-light: #e4e7ed;--el-border-color-lighter: #ebeef5;--el-border-color-extra-light: #f2f6fc;--el-border-color-dark: #d4d7de;--el-border-color-darker: #cdd0d6;--el-fill-color: #f0f2f5;--el-fill-color-light: #f5f7fa;--el-fill-color-lighter: #fafafa;--el-fill-color-extra-light: #fafcff;--el-fill-color-dark: #ebedf0;--el-fill-color-darker: #e6e8eb;--el-fill-color-blank: #ffffff;--el-box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, .04), 0px 8px 20px rgba(0, 0, 0, .08);--el-box-shadow-light: 0px 0px 12px rgba(0, 0, 0, .12);--el-box-shadow-lighter: 0px 0px 6px rgba(0, 0, 0, .12);--el-box-shadow-dark: 0px 16px 48px 16px rgba(0, 0, 0, .08), 0px 12px 32px rgba(0, 0, 0, .12), 0px 8px 16px -8px rgba(0, 0, 0, .16);--el-disabled-bg-color: var(--el-fill-color-light);--el-disabled-text-color: var(--el-text-color-placeholder);--el-disabled-border-color: var(--el-border-color-light);--el-overlay-color: rgba(0, 0, 0, .8);--el-overlay-color-light: rgba(0, 0, 0, .7);--el-overlay-color-lighter: rgba(0, 0, 0, .5);--el-mask-color: rgba(255, 255, 255, .9);--el-mask-color-extra-light: rgba(255, 255, 255, .3);--el-border-width: 1px;--el-border-style: solid;--el-border-color-hover: var(--el-text-color-disabled);--el-border: var(--el-border-width) var(--el-border-style) var(--el-border-color);--el-svg-monochrome-grey: var(--el-border-color)}.fade-in-linear-enter-active,.fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.fade-in-linear-enter-from,.fade-in-linear-leave-to{opacity:0}.el-fade-in-linear-enter-active,.el-fade-in-linear-leave-active{transition:var(--el-transition-fade-linear)}.el-fade-in-linear-enter-from,.el-fade-in-linear-leave-to{opacity:0}.el-fade-in-enter-active,.el-fade-in-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-fade-in-enter-from,.el-fade-in-leave-active{opacity:0}.el-zoom-in-center-enter-active,.el-zoom-in-center-leave-active{transition:all var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-zoom-in-center-enter-from,.el-zoom-in-center-leave-active{opacity:0;transform:scaleX(0)}.el-zoom-in-top-enter-active,.el-zoom-in-top-leave-active{opacity:1;transform:scaleY(1);transition:var(--el-transition-md-fade);transform-origin:center top}.el-zoom-in-top-enter-active[data-popper-placement^=top],.el-zoom-in-top-leave-active[data-popper-placement^=top]{transform-origin:center bottom}.el-zoom-in-top-enter-from,.el-zoom-in-top-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-bottom-enter-active,.el-zoom-in-bottom-leave-active{opacity:1;transform:scaleY(1);transition:var(--el-transition-md-fade);transform-origin:center bottom}.el-zoom-in-bottom-enter-from,.el-zoom-in-bottom-leave-active{opacity:0;transform:scaleY(0)}.el-zoom-in-left-enter-active,.el-zoom-in-left-leave-active{opacity:1;transform:scale(1);transition:var(--el-transition-md-fade);transform-origin:top left}.el-zoom-in-left-enter-from,.el-zoom-in-left-leave-active{opacity:0;transform:scale(.45)}.collapse-transition{transition:var(--el-transition-duration) height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.el-collapse-transition-leave-active,.el-collapse-transition-enter-active{transition:var(--el-transition-duration) max-height ease-in-out,var(--el-transition-duration) padding-top ease-in-out,var(--el-transition-duration) padding-bottom ease-in-out}.horizontal-collapse-transition{transition:var(--el-transition-duration) width ease-in-out,var(--el-transition-duration) padding-left ease-in-out,var(--el-transition-duration) padding-right ease-in-out}.el-list-enter-active,.el-list-leave-active{transition:all 1s}.el-list-enter-from,.el-list-leave-to{opacity:0;transform:translateY(-30px)}.el-list-leave-active{position:absolute!important}.el-opacity-transition{transition:opacity var(--el-transition-duration) cubic-bezier(.55,0,.1,1)}.el-icon-loading{animation:rotating 2s linear infinite}.el-icon--right{margin-left:5px}.el-icon--left{margin-right:5px}@keyframes rotating{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.el-icon{--color: inherit;height:1em;width:1em;line-height:1em;display:inline-flex;justify-content:center;align-items:center;position:relative;fill:currentColor;color:var(--color);font-size:inherit}.el-icon.is-loading{animation:rotating 2s linear infinite}.el-icon svg{height:1em;width:1em}.xhs-download-float-btn[data-v-833d5c5d]{-webkit-user-select:none;user-select:none;color:#fff;background-color:#ff304f80;z-index:99999;position:fixed;border-radius:0 30px 30px 0;display:inline-block;width:fit-content;transition:all ease-in-out .3s;cursor:pointer}.xhs-download-float-btn.right[data-v-833d5c5d]{border-radius:30px 0 0 30px}.xhs-download-float-btn[data-v-833d5c5d]:hover{background-color:#ff304f;border-radius:30px}.xhs-download-float-btn[data-v-833d5c5d]:active{background-color:#ff304f;border-radius:30px;transition:none}.xhs-download-float-btn .icon[data-v-833d5c5d]{padding:10px 20px;text-align:center;transform:translateY(3px)}.el-badge{--el-badge-bg-color: var(--el-color-danger);--el-badge-radius: 10px;--el-badge-font-size: 12px;--el-badge-padding: 6px;--el-badge-size: 18px;position:relative;vertical-align:middle;display:inline-block;width:fit-content}.el-badge__content{background-color:var(--el-badge-bg-color);border-radius:var(--el-badge-radius);color:var(--el-color-white);display:inline-flex;justify-content:center;align-items:center;font-size:var(--el-badge-font-size);height:var(--el-badge-size);padding:0 var(--el-badge-padding);white-space:nowrap;border:1px solid var(--el-bg-color)}.el-badge__content.is-fixed{position:absolute;top:0;right:calc(1px + var(--el-badge-size) / 2);transform:translateY(-50%) translate(100%);z-index:var(--el-index-normal)}.el-badge__content.is-fixed.is-dot{right:5px}.el-badge__content.is-dot{height:8px;width:8px;padding:0;right:0;border-radius:50%}.el-badge__content.is-hide-zero{display:none}.el-badge__content--primary{background-color:var(--el-color-primary)}.el-badge__content--success{background-color:var(--el-color-success)}.el-badge__content--warning{background-color:var(--el-color-warning)}.el-badge__content--info{background-color:var(--el-color-info)}.el-badge__content--danger{background-color:var(--el-color-danger)}.el-message{--el-message-bg-color: var(--el-color-info-light-9);--el-message-border-color: var(--el-border-color-lighter);--el-message-padding: 11px 15px;--el-message-close-size: 16px;--el-message-close-icon-color: var(--el-text-color-placeholder);--el-message-close-hover-color: var(--el-text-color-secondary)}.el-message{width:fit-content;max-width:calc(100% - 32px);box-sizing:border-box;border-radius:var(--el-border-radius-base);border-width:var(--el-border-width);border-style:var(--el-border-style);border-color:var(--el-message-border-color);position:fixed;left:50%;top:20px;transform:translate(-50%);background-color:var(--el-message-bg-color);transition:opacity var(--el-transition-duration),transform .4s,top .4s;padding:var(--el-message-padding);display:flex;align-items:center;gap:8px}.el-message.is-center{justify-content:center}.el-message.is-plain{background-color:var(--el-bg-color-overlay);border-color:var(--el-bg-color-overlay);box-shadow:var(--el-box-shadow-light)}.el-message p{margin:0}.el-message--success{--el-message-bg-color: var(--el-color-success-light-9);--el-message-border-color: var(--el-color-success-light-8);--el-message-text-color: var(--el-color-success)}.el-message--success .el-message__content{color:var(--el-message-text-color);overflow-wrap:break-word}.el-message .el-message-icon--success{color:var(--el-message-text-color)}.el-message--info{--el-message-bg-color: var(--el-color-info-light-9);--el-message-border-color: var(--el-color-info-light-8);--el-message-text-color: var(--el-color-info)}.el-message--info .el-message__content{color:var(--el-message-text-color);overflow-wrap:break-word}.el-message .el-message-icon--info{color:var(--el-message-text-color)}.el-message--warning{--el-message-bg-color: var(--el-color-warning-light-9);--el-message-border-color: var(--el-color-warning-light-8);--el-message-text-color: var(--el-color-warning)}.el-message--warning .el-message__content{color:var(--el-message-text-color);overflow-wrap:break-word}.el-message .el-message-icon--warning{color:var(--el-message-text-color)}.el-message--error{--el-message-bg-color: var(--el-color-error-light-9);--el-message-border-color: var(--el-color-error-light-8);--el-message-text-color: var(--el-color-error)}.el-message--error .el-message__content{color:var(--el-message-text-color);overflow-wrap:break-word}.el-message .el-message-icon--error{color:var(--el-message-text-color)}.el-message .el-message__badge{position:absolute;top:-8px;right:-8px}.el-message__content{padding:0;font-size:14px;line-height:1}.el-message__content:focus{outline-width:0}.el-message .el-message__closeBtn{cursor:pointer;color:var(--el-message-close-icon-color);font-size:var(--el-message-close-size)}.el-message .el-message__closeBtn:focus{outline-width:0}.el-message .el-message__closeBtn:hover{color:var(--el-message-close-hover-color)}.el-message-fade-enter-from,.el-message-fade-leave-to{opacity:0;transform:translate(-50%,-100%)}.el-drawer{--el-drawer-bg-color: var(--el-dialog-bg-color, var(--el-bg-color));--el-drawer-padding-primary: var(--el-dialog-padding-primary, 20px)}.el-drawer{position:absolute;box-sizing:border-box;background-color:var(--el-drawer-bg-color);display:flex;flex-direction:column;box-shadow:var(--el-box-shadow-dark);overflow:hidden;transition:all var(--el-transition-duration)}.el-drawer .rtl,.el-drawer .ltr,.el-drawer .ttb,.el-drawer .btt{transform:translate(0)}.el-drawer__sr-focus:focus{outline:none!important}.el-drawer__header{align-items:center;color:#72767b;display:flex;margin-bottom:32px;padding:var(--el-drawer-padding-primary);padding-bottom:0}.el-drawer__header>:first-child{flex:1}.el-drawer__title{margin:0;flex:1;line-height:inherit;font-size:16px}.el-drawer__footer{padding:var(--el-drawer-padding-primary);padding-top:10px;text-align:right}.el-drawer__close-btn{display:inline-flex;border:none;cursor:pointer;font-size:var(--el-font-size-extra-large);color:inherit;background-color:transparent;outline:none}.el-drawer__close-btn:focus i,.el-drawer__close-btn:hover i{color:var(--el-color-primary)}.el-drawer__body{flex:1;padding:var(--el-drawer-padding-primary);overflow:auto}.el-drawer__body>*{box-sizing:border-box}.el-drawer.ltr,.el-drawer.rtl{height:100%;top:0;bottom:0}.el-drawer.ttb,.el-drawer.btt{width:100%;left:0;right:0}.el-drawer.ltr{left:0}.el-drawer.rtl{right:0}.el-drawer.ttb{top:0}.el-drawer.btt{bottom:0}.el-drawer-fade-enter-active,.el-drawer-fade-leave-active{transition:all var(--el-transition-duration)}.el-drawer-fade-enter-from,.el-drawer-fade-enter-active,.el-drawer-fade-enter-to,.el-drawer-fade-leave-from,.el-drawer-fade-leave-active,.el-drawer-fade-leave-to{overflow:hidden!important}.el-drawer-fade-enter-from,.el-drawer-fade-leave-to{background-color:transparent!important}.el-drawer-fade-enter-from .rtl,.el-drawer-fade-leave-to .rtl{transform:translate(100%)}.el-drawer-fade-enter-from .ltr,.el-drawer-fade-leave-to .ltr{transform:translate(-100%)}.el-drawer-fade-enter-from .ttb,.el-drawer-fade-leave-to .ttb{transform:translateY(-100%)}.el-drawer-fade-enter-from .btt,.el-drawer-fade-leave-to .btt{transform:translateY(100%)}.el-overlay{position:fixed;top:0;right:0;bottom:0;left:0;z-index:2000;height:100%;background-color:var(--el-overlay-color-lighter);overflow:auto}.el-overlay .el-overlay-root{height:0}.el-form{--el-form-label-font-size: var(--el-font-size-base);--el-form-inline-content-width: 220px}.el-form--inline .el-form-item{display:inline-flex;vertical-align:middle;margin-right:32px}.el-form--inline.el-form--label-top{display:flex;flex-wrap:wrap}.el-form--inline.el-form--label-top .el-form-item{display:block}.el-form-item{display:flex;--font-size: 14px;margin-bottom:18px}.el-form-item .el-form-item{margin-bottom:0}.el-form-item .el-input__validateIcon{display:none}.el-form-item--large{--font-size: 14px;--el-form-label-font-size: var(--font-size);margin-bottom:22px}.el-form-item--large .el-form-item__label{height:40px;line-height:40px}.el-form-item--large .el-form-item__content{line-height:40px}.el-form-item--large .el-form-item__error{padding-top:4px}.el-form-item--default{--font-size: 14px;--el-form-label-font-size: var(--font-size);margin-bottom:18px}.el-form-item--default .el-form-item__label{height:32px;line-height:32px}.el-form-item--default .el-form-item__content{line-height:32px}.el-form-item--default .el-form-item__error{padding-top:2px}.el-form-item--small{--font-size: 12px;--el-form-label-font-size: var(--font-size);margin-bottom:18px}.el-form-item--small .el-form-item__label{height:24px;line-height:24px}.el-form-item--small .el-form-item__content{line-height:24px}.el-form-item--small .el-form-item__error{padding-top:2px}.el-form-item--label-left .el-form-item__label{justify-content:flex-start}.el-form-item--label-top{display:block}.el-form-item--label-top .el-form-item__label{display:inline-block;vertical-align:middle;height:auto;text-align:left;margin-bottom:8px;line-height:22px}.el-form-item__label-wrap{display:flex}.el-form-item__label{display:inline-flex;justify-content:flex-end;align-items:flex-start;flex:0 0 auto;font-size:var(--el-form-label-font-size);color:var(--el-text-color-regular);height:32px;line-height:32px;padding:0 12px 0 0;box-sizing:border-box}.el-form-item__content{display:flex;flex-wrap:wrap;align-items:center;flex:1;line-height:32px;position:relative;font-size:var(--font-size);min-width:0}.el-form-item__content .el-input-group{vertical-align:top}.el-form-item__error{color:var(--el-color-danger);font-size:12px;line-height:1;padding-top:2px;position:absolute;top:100%;left:0}.el-form-item__error--inline{position:relative;top:auto;left:auto;display:inline-block;margin-left:10px}.el-form-item.is-required:not(.is-no-asterisk).asterisk-left>.el-form-item__label:before,.el-form-item.is-required:not(.is-no-asterisk).asterisk-left>.el-form-item__label-wrap>.el-form-item__label:before{content:"*";color:var(--el-color-danger);margin-right:4px}.el-form-item.is-required:not(.is-no-asterisk).asterisk-right>.el-form-item__label:after,.el-form-item.is-required:not(.is-no-asterisk).asterisk-right>.el-form-item__label-wrap>.el-form-item__label:after{content:"*";color:var(--el-color-danger);margin-left:4px}.el-form-item.is-error .el-input__wrapper,.el-form-item.is-error .el-input__wrapper:hover,.el-form-item.is-error .el-input__wrapper:focus,.el-form-item.is-error .el-input__wrapper.is-focus,.el-form-item.is-error .el-textarea__inner,.el-form-item.is-error .el-textarea__inner:hover,.el-form-item.is-error .el-textarea__inner:focus,.el-form-item.is-error .el-textarea__inner.is-focus,.el-form-item.is-error .el-select__wrapper,.el-form-item.is-error .el-select__wrapper:hover,.el-form-item.is-error .el-select__wrapper:focus,.el-form-item.is-error .el-select__wrapper.is-focus{box-shadow:0 0 0 1px var(--el-color-danger) inset}.el-form-item.is-error .el-input-group__append .el-input__wrapper,.el-form-item.is-error .el-input-group__prepend .el-input__wrapper{box-shadow:0 0 0 1px transparent inset}.el-form-item.is-error .el-input-group__append .el-input__validateIcon,.el-form-item.is-error .el-input-group__prepend .el-input__validateIcon{display:none}.el-form-item.is-error .el-input__validateIcon{color:var(--el-color-danger)}.el-form-item--feedback .el-input__validateIcon{display:inline-flex}.el-switch{--el-switch-on-color: var(--el-color-primary);--el-switch-off-color: var(--el-border-color)}.el-switch{display:inline-flex;align-items:center;position:relative;font-size:14px;line-height:20px;height:32px;vertical-align:middle}.el-switch.is-disabled .el-switch__core,.el-switch.is-disabled .el-switch__label{cursor:not-allowed}.el-switch__label{transition:var(--el-transition-duration-fast);height:20px;display:inline-block;font-size:14px;font-weight:500;cursor:pointer;vertical-align:middle;color:var(--el-text-color-primary)}.el-switch__label.is-active{color:var(--el-color-primary)}.el-switch__label--left{margin-right:10px}.el-switch__label--right{margin-left:10px}.el-switch__label *{line-height:1;font-size:14px;display:inline-block}.el-switch__label .el-icon{height:inherit}.el-switch__label .el-icon svg{vertical-align:middle}.el-switch__input{position:absolute;width:0;height:0;opacity:0;margin:0}.el-switch__input:focus-visible~.el-switch__core{outline:2px solid var(--el-switch-on-color);outline-offset:1px}.el-switch__core{display:inline-flex;position:relative;align-items:center;min-width:40px;height:20px;border:1px solid var(--el-switch-border-color, var(--el-switch-off-color));outline:none;border-radius:10px;box-sizing:border-box;background:var(--el-switch-off-color);cursor:pointer;transition:border-color var(--el-transition-duration),background-color var(--el-transition-duration)}.el-switch__core .el-switch__inner{width:100%;transition:all var(--el-transition-duration);height:16px;display:flex;justify-content:center;align-items:center;overflow:hidden;padding:0 4px 0 18px}.el-switch__core .el-switch__inner .is-icon,.el-switch__core .el-switch__inner .is-text{font-size:12px;color:var(--el-color-white);-webkit-user-select:none;user-select:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.el-switch__core .el-switch__action{position:absolute;left:1px;border-radius:var(--el-border-radius-circle);transition:all var(--el-transition-duration);width:16px;height:16px;background-color:var(--el-color-white);display:flex;justify-content:center;align-items:center;color:var(--el-switch-off-color)}.el-switch.is-checked .el-switch__core{border-color:var(--el-switch-border-color, var(--el-switch-on-color));background-color:var(--el-switch-on-color)}.el-switch.is-checked .el-switch__core .el-switch__action{left:calc(100% - 17px);color:var(--el-switch-on-color)}.el-switch.is-checked .el-switch__core .el-switch__inner{padding:0 18px 0 4px}.el-switch.is-disabled{opacity:.6}.el-switch--wide .el-switch__label.el-switch__label--left span{left:10px}.el-switch--wide .el-switch__label.el-switch__label--right span{right:10px}.el-switch .label-fade-enter-from,.el-switch .label-fade-leave-active{opacity:0}.el-switch--large{font-size:14px;line-height:24px;height:40px}.el-switch--large .el-switch__label{height:24px;font-size:14px}.el-switch--large .el-switch__label *{font-size:14px}.el-switch--large .el-switch__core{min-width:50px;height:24px;border-radius:12px}.el-switch--large .el-switch__core .el-switch__inner{height:20px;padding:0 6px 0 22px}.el-switch--large .el-switch__core .el-switch__action{width:20px;height:20px}.el-switch--large.is-checked .el-switch__core .el-switch__action{left:calc(100% - 21px)}.el-switch--large.is-checked .el-switch__core .el-switch__inner{padding:0 22px 0 6px}.el-switch--small{font-size:12px;line-height:16px;height:24px}.el-switch--small .el-switch__label{height:16px;font-size:12px}.el-switch--small .el-switch__label *{font-size:12px}.el-switch--small .el-switch__core{min-width:30px;height:16px;border-radius:8px}.el-switch--small .el-switch__core .el-switch__inner{height:12px;padding:0 2px 0 14px}.el-switch--small .el-switch__core .el-switch__action{width:12px;height:12px}.el-switch--small.is-checked .el-switch__core .el-switch__action{left:calc(100% - 13px)}.el-switch--small.is-checked .el-switch__core .el-switch__inner{padding:0 14px 0 2px}.el-checkbox{--el-checkbox-font-size: 14px;--el-checkbox-font-weight: var(--el-font-weight-primary);--el-checkbox-text-color: var(--el-text-color-regular);--el-checkbox-input-height: 14px;--el-checkbox-input-width: 14px;--el-checkbox-border-radius: var(--el-border-radius-small);--el-checkbox-bg-color: var(--el-fill-color-blank);--el-checkbox-input-border: var(--el-border);--el-checkbox-disabled-border-color: var(--el-border-color);--el-checkbox-disabled-input-fill: var(--el-fill-color-light);--el-checkbox-disabled-icon-color: var(--el-text-color-placeholder);--el-checkbox-disabled-checked-input-fill: var(--el-border-color-extra-light);--el-checkbox-disabled-checked-input-border-color: var(--el-border-color);--el-checkbox-disabled-checked-icon-color: var(--el-text-color-placeholder);--el-checkbox-checked-text-color: var(--el-color-primary);--el-checkbox-checked-input-border-color: var(--el-color-primary);--el-checkbox-checked-bg-color: var(--el-color-primary);--el-checkbox-checked-icon-color: var(--el-color-white);--el-checkbox-input-border-color-hover: var(--el-color-primary)}.el-checkbox{color:var(--el-checkbox-text-color);font-weight:var(--el-checkbox-font-weight);font-size:var(--el-font-size-base);position:relative;cursor:pointer;display:inline-flex;align-items:center;white-space:nowrap;-webkit-user-select:none;user-select:none;margin-right:30px;height:var(--el-checkbox-height, 32px)}.el-checkbox.is-disabled{cursor:not-allowed}.el-checkbox.is-bordered{padding:0 15px 0 9px;border-radius:var(--el-border-radius-base);border:var(--el-border);box-sizing:border-box}.el-checkbox.is-bordered.is-checked{border-color:var(--el-color-primary)}.el-checkbox.is-bordered.is-disabled{border-color:var(--el-border-color-lighter)}.el-checkbox.is-bordered.el-checkbox--large{padding:0 19px 0 11px;border-radius:var(--el-border-radius-base)}.el-checkbox.is-bordered.el-checkbox--large .el-checkbox__label{font-size:var(--el-font-size-base)}.el-checkbox.is-bordered.el-checkbox--large .el-checkbox__inner{height:14px;width:14px}.el-checkbox.is-bordered.el-checkbox--small{padding:0 11px 0 7px;border-radius:calc(var(--el-border-radius-base) - 1px)}.el-checkbox.is-bordered.el-checkbox--small .el-checkbox__label{font-size:12px}.el-checkbox.is-bordered.el-checkbox--small .el-checkbox__inner{height:12px;width:12px}.el-checkbox.is-bordered.el-checkbox--small .el-checkbox__inner:after{height:6px;width:2px}.el-checkbox input:focus-visible+.el-checkbox__inner{outline:2px solid var(--el-checkbox-input-border-color-hover);outline-offset:1px;border-radius:var(--el-checkbox-border-radius)}.el-checkbox__input{white-space:nowrap;cursor:pointer;outline:none;display:inline-flex;position:relative}.el-checkbox__input.is-disabled .el-checkbox__inner{background-color:var(--el-checkbox-disabled-input-fill);border-color:var(--el-checkbox-disabled-border-color);cursor:not-allowed}.el-checkbox__input.is-disabled .el-checkbox__inner:after{cursor:not-allowed;border-color:var(--el-checkbox-disabled-icon-color)}.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{background-color:var(--el-checkbox-disabled-checked-input-fill);border-color:var(--el-checkbox-disabled-checked-input-border-color)}.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner:after{border-color:var(--el-checkbox-disabled-checked-icon-color)}.el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner{background-color:var(--el-checkbox-disabled-checked-input-fill);border-color:var(--el-checkbox-disabled-checked-input-border-color)}.el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner:before{background-color:var(--el-checkbox-disabled-checked-icon-color);border-color:var(--el-checkbox-disabled-checked-icon-color)}.el-checkbox__input.is-disabled+span.el-checkbox__label{color:var(--el-disabled-text-color);cursor:not-allowed}.el-checkbox__input.is-checked .el-checkbox__inner{background-color:var(--el-checkbox-checked-bg-color);border-color:var(--el-checkbox-checked-input-border-color)}.el-checkbox__input.is-checked .el-checkbox__inner:after{transform:rotate(45deg) scaleY(1);border-color:var(--el-checkbox-checked-icon-color)}.el-checkbox__input.is-checked+.el-checkbox__label{color:var(--el-checkbox-checked-text-color)}.el-checkbox__input.is-focus:not(.is-checked) .el-checkbox__original:not(:focus-visible){border-color:var(--el-checkbox-input-border-color-hover)}.el-checkbox__input.is-indeterminate .el-checkbox__inner{background-color:var(--el-checkbox-checked-bg-color);border-color:var(--el-checkbox-checked-input-border-color)}.el-checkbox__input.is-indeterminate .el-checkbox__inner:before{content:"";position:absolute;display:block;background-color:var(--el-checkbox-checked-icon-color);height:2px;transform:scale(.5);left:0;right:0;top:5px}.el-checkbox__input.is-indeterminate .el-checkbox__inner:after{display:none}.el-checkbox__inner{display:inline-block;position:relative;border:var(--el-checkbox-input-border);border-radius:var(--el-checkbox-border-radius);box-sizing:border-box;width:var(--el-checkbox-input-width);height:var(--el-checkbox-input-height);background-color:var(--el-checkbox-bg-color);z-index:var(--el-index-normal);transition:border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46),outline .25s cubic-bezier(.71,-.46,.29,1.46)}.el-checkbox__inner:hover{border-color:var(--el-checkbox-input-border-color-hover)}.el-checkbox__inner:after{box-sizing:content-box;content:"";border:1px solid transparent;border-left:0;border-top:0;height:7px;left:4px;position:absolute;top:1px;transform:rotate(45deg) scaleY(0);width:3px;transition:transform .15s ease-in .05s;transform-origin:center}.el-checkbox__original{opacity:0;outline:none;position:absolute;margin:0;width:0;height:0;z-index:-1}.el-checkbox__label{display:inline-block;padding-left:8px;line-height:1;font-size:var(--el-checkbox-font-size)}.el-checkbox.el-checkbox--large{height:40px}.el-checkbox.el-checkbox--large .el-checkbox__label{font-size:14px}.el-checkbox.el-checkbox--large .el-checkbox__inner{width:14px;height:14px}.el-checkbox.el-checkbox--small{height:24px}.el-checkbox.el-checkbox--small .el-checkbox__label{font-size:12px}.el-checkbox.el-checkbox--small .el-checkbox__inner{width:12px;height:12px}.el-checkbox.el-checkbox--small .el-checkbox__input.is-indeterminate .el-checkbox__inner:before{top:4px}.el-checkbox.el-checkbox--small .el-checkbox__inner:after{width:2px;height:6px}.el-checkbox:last-of-type{margin-right:0}.el-tag{--el-tag-font-size: 12px;--el-tag-border-radius: 4px;--el-tag-border-radius-rounded: 9999px}.el-tag{background-color:var(--el-tag-bg-color);border-color:var(--el-tag-border-color);color:var(--el-tag-text-color);display:inline-flex;justify-content:center;align-items:center;vertical-align:middle;height:24px;padding:0 9px;font-size:var(--el-tag-font-size);line-height:1;border-width:1px;border-style:solid;border-radius:var(--el-tag-border-radius);box-sizing:border-box;white-space:nowrap;--el-icon-size: 14px;--el-tag-bg-color: var(--el-color-primary-light-9);--el-tag-border-color: var(--el-color-primary-light-8);--el-tag-hover-color: var(--el-color-primary)}.el-tag.el-tag--primary{--el-tag-bg-color: var(--el-color-primary-light-9);--el-tag-border-color: var(--el-color-primary-light-8);--el-tag-hover-color: var(--el-color-primary)}.el-tag.el-tag--success{--el-tag-bg-color: var(--el-color-success-light-9);--el-tag-border-color: var(--el-color-success-light-8);--el-tag-hover-color: var(--el-color-success)}.el-tag.el-tag--warning{--el-tag-bg-color: var(--el-color-warning-light-9);--el-tag-border-color: var(--el-color-warning-light-8);--el-tag-hover-color: var(--el-color-warning)}.el-tag.el-tag--danger{--el-tag-bg-color: var(--el-color-danger-light-9);--el-tag-border-color: var(--el-color-danger-light-8);--el-tag-hover-color: var(--el-color-danger)}.el-tag.el-tag--error{--el-tag-bg-color: var(--el-color-error-light-9);--el-tag-border-color: var(--el-color-error-light-8);--el-tag-hover-color: var(--el-color-error)}.el-tag.el-tag--info{--el-tag-bg-color: var(--el-color-info-light-9);--el-tag-border-color: var(--el-color-info-light-8);--el-tag-hover-color: var(--el-color-info)}.el-tag.is-hit{border-color:var(--el-color-primary)}.el-tag.is-round{border-radius:var(--el-tag-border-radius-rounded)}.el-tag .el-tag__close{flex-shrink:0;color:var(--el-tag-text-color)}.el-tag .el-tag__close:hover{color:var(--el-color-white);background-color:var(--el-tag-hover-color)}.el-tag.el-tag--primary{--el-tag-text-color: var(--el-color-primary)}.el-tag.el-tag--success{--el-tag-text-color: var(--el-color-success)}.el-tag.el-tag--warning{--el-tag-text-color: var(--el-color-warning)}.el-tag.el-tag--danger{--el-tag-text-color: var(--el-color-danger)}.el-tag.el-tag--error{--el-tag-text-color: var(--el-color-error)}.el-tag.el-tag--info{--el-tag-text-color: var(--el-color-info)}.el-tag .el-icon{border-radius:50%;cursor:pointer;font-size:calc(var(--el-icon-size) - 2px);height:var(--el-icon-size);width:var(--el-icon-size)}.el-tag .el-tag__close{margin-left:6px}.el-tag--dark{--el-tag-text-color: var(--el-color-white);--el-tag-bg-color: var(--el-color-primary);--el-tag-border-color: var(--el-color-primary);--el-tag-hover-color: var(--el-color-primary-light-3)}.el-tag--dark.el-tag--primary{--el-tag-bg-color: var(--el-color-primary);--el-tag-border-color: var(--el-color-primary);--el-tag-hover-color: var(--el-color-primary-light-3)}.el-tag--dark.el-tag--success{--el-tag-bg-color: var(--el-color-success);--el-tag-border-color: var(--el-color-success);--el-tag-hover-color: var(--el-color-success-light-3)}.el-tag--dark.el-tag--warning{--el-tag-bg-color: var(--el-color-warning);--el-tag-border-color: var(--el-color-warning);--el-tag-hover-color: var(--el-color-warning-light-3)}.el-tag--dark.el-tag--danger{--el-tag-bg-color: var(--el-color-danger);--el-tag-border-color: var(--el-color-danger);--el-tag-hover-color: var(--el-color-danger-light-3)}.el-tag--dark.el-tag--error{--el-tag-bg-color: var(--el-color-error);--el-tag-border-color: var(--el-color-error);--el-tag-hover-color: var(--el-color-error-light-3)}.el-tag--dark.el-tag--info{--el-tag-bg-color: var(--el-color-info);--el-tag-border-color: var(--el-color-info);--el-tag-hover-color: var(--el-color-info-light-3)}.el-tag--dark.el-tag--primary,.el-tag--dark.el-tag--success,.el-tag--dark.el-tag--warning,.el-tag--dark.el-tag--danger,.el-tag--dark.el-tag--error,.el-tag--dark.el-tag--info{--el-tag-text-color: var(--el-color-white)}.el-tag--plain,.el-tag--plain.el-tag--primary{--el-tag-bg-color: var(--el-fill-color-blank);--el-tag-border-color: var(--el-color-primary-light-5);--el-tag-hover-color: var(--el-color-primary)}.el-tag--plain.el-tag--success{--el-tag-bg-color: var(--el-fill-color-blank);--el-tag-border-color: var(--el-color-success-light-5);--el-tag-hover-color: var(--el-color-success)}.el-tag--plain.el-tag--warning{--el-tag-bg-color: var(--el-fill-color-blank);--el-tag-border-color: var(--el-color-warning-light-5);--el-tag-hover-color: var(--el-color-warning)}.el-tag--plain.el-tag--danger{--el-tag-bg-color: var(--el-fill-color-blank);--el-tag-border-color: var(--el-color-danger-light-5);--el-tag-hover-color: var(--el-color-danger)}.el-tag--plain.el-tag--error{--el-tag-bg-color: var(--el-fill-color-blank);--el-tag-border-color: var(--el-color-error-light-5);--el-tag-hover-color: var(--el-color-error)}.el-tag--plain.el-tag--info{--el-tag-bg-color: var(--el-fill-color-blank);--el-tag-border-color: var(--el-color-info-light-5);--el-tag-hover-color: var(--el-color-info)}.el-tag.is-closable{padding-right:5px}.el-tag--large{padding:0 11px;height:32px;--el-icon-size: 16px}.el-tag--large .el-tag__close{margin-left:8px}.el-tag--large.is-closable{padding-right:7px}.el-tag--small{padding:0 7px;height:20px;--el-icon-size: 12px}.el-tag--small .el-tag__close{margin-left:4px}.el-tag--small.is-closable{padding-right:3px}.el-tag--small .el-icon-close{transform:scale(.8)}.el-tag.el-tag--primary.is-hit{border-color:var(--el-color-primary)}.el-tag.el-tag--success.is-hit{border-color:var(--el-color-success)}.el-tag.el-tag--warning.is-hit{border-color:var(--el-color-warning)}.el-tag.el-tag--danger.is-hit{border-color:var(--el-color-danger)}.el-tag.el-tag--error.is-hit{border-color:var(--el-color-error)}.el-tag.el-tag--info.is-hit{border-color:var(--el-color-info)}.el-select-dropdown.is-multiple .el-select-dropdown__item.is-selected:after{content:"";position:absolute;top:50%;right:20px;border-top:none;border-right:none;background-repeat:no-repeat;background-position:center;background-color:var(--el-color-primary);mask:url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;mask-size:100% 100%;-webkit-mask:url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;-webkit-mask-size:100% 100%;transform:translateY(-50%);width:12px;height:12px}.el-scrollbar{--el-scrollbar-opacity: .3;--el-scrollbar-bg-color: var(--el-text-color-secondary);--el-scrollbar-hover-opacity: .5;--el-scrollbar-hover-bg-color: var(--el-text-color-secondary)}.el-scrollbar{overflow:hidden;position:relative;height:100%}.el-scrollbar__wrap{overflow:auto;height:100%}.el-scrollbar__wrap--hidden-default{scrollbar-width:none}.el-scrollbar__wrap--hidden-default::-webkit-scrollbar{display:none}.el-scrollbar__thumb{position:relative;display:block;width:0;height:0;cursor:pointer;border-radius:inherit;background-color:var(--el-scrollbar-bg-color, var(--el-text-color-secondary));transition:var(--el-transition-duration) background-color;opacity:var(--el-scrollbar-opacity, .3)}.el-scrollbar__thumb:hover{background-color:var(--el-scrollbar-hover-bg-color, var(--el-text-color-secondary));opacity:var(--el-scrollbar-hover-opacity, .5)}.el-scrollbar__bar{position:absolute;right:2px;bottom:2px;z-index:1;border-radius:4px}.el-scrollbar__bar.is-vertical{width:6px;top:2px}.el-scrollbar__bar.is-vertical>div{width:100%}.el-scrollbar__bar.is-horizontal{height:6px;left:2px}.el-scrollbar__bar.is-horizontal>div{height:100%}.el-scrollbar-fade-enter-active{transition:opacity .34s ease-out}.el-scrollbar-fade-leave-active{transition:opacity .12s ease-out}.el-scrollbar-fade-enter-from,.el-scrollbar-fade-leave-active{opacity:0}.el-popper{--el-popper-border-radius: var(--el-popover-border-radius, 4px)}.el-popper{position:absolute;border-radius:var(--el-popper-border-radius);padding:5px 11px;z-index:2000;font-size:12px;line-height:20px;min-width:10px;overflow-wrap:break-word;visibility:visible}.el-popper.is-dark{color:var(--el-bg-color);background:var(--el-text-color-primary);border:1px solid var(--el-text-color-primary)}.el-popper.is-dark>.el-popper__arrow:before{border:1px solid var(--el-text-color-primary);background:var(--el-text-color-primary);right:0}.el-popper.is-light{background:var(--el-bg-color-overlay);border:1px solid var(--el-border-color-light)}.el-popper.is-light>.el-popper__arrow:before{border:1px solid var(--el-border-color-light);background:var(--el-bg-color-overlay);right:0}.el-popper.is-pure{padding:0}.el-popper__arrow{position:absolute;width:10px;height:10px;z-index:-1}.el-popper__arrow:before{position:absolute;width:10px;height:10px;z-index:-1;content:" ";transform:rotate(45deg);background:var(--el-text-color-primary);box-sizing:border-box}.el-popper[data-popper-placement^=top]>.el-popper__arrow{bottom:-5px}.el-popper[data-popper-placement^=top]>.el-popper__arrow:before{border-bottom-right-radius:2px}.el-popper[data-popper-placement^=bottom]>.el-popper__arrow{top:-5px}.el-popper[data-popper-placement^=bottom]>.el-popper__arrow:before{border-top-left-radius:2px}.el-popper[data-popper-placement^=left]>.el-popper__arrow{right:-5px}.el-popper[data-popper-placement^=left]>.el-popper__arrow:before{border-top-right-radius:2px}.el-popper[data-popper-placement^=right]>.el-popper__arrow{left:-5px}.el-popper[data-popper-placement^=right]>.el-popper__arrow:before{border-bottom-left-radius:2px}.el-popper[data-popper-placement^=top]>.el-popper__arrow:before{border-top-color:transparent!important;border-left-color:transparent!important}.el-popper[data-popper-placement^=bottom]>.el-popper__arrow:before{border-bottom-color:transparent!important;border-right-color:transparent!important}.el-popper[data-popper-placement^=left]>.el-popper__arrow:before{border-left-color:transparent!important;border-bottom-color:transparent!important}.el-popper[data-popper-placement^=right]>.el-popper__arrow:before{border-right-color:transparent!important;border-top-color:transparent!important}.el-select-dropdown{z-index:calc(var(--el-index-top) + 1);border-radius:var(--el-border-radius-base);box-sizing:border-box}.el-select-dropdown .el-scrollbar.is-empty .el-select-dropdown__list{padding:0}.el-select-dropdown__loading,.el-select-dropdown__empty{padding:10px 0;margin:0;text-align:center;color:var(--el-text-color-secondary);font-size:var(--el-select-font-size)}.el-select-dropdown__wrap{max-height:274px}.el-select-dropdown__list{list-style:none;padding:6px 0;margin:0;box-sizing:border-box}.el-select-dropdown__list.el-vl__window{margin:6px 0;padding:0}.el-select-dropdown__header{padding:10px;border-bottom:1px solid var(--el-border-color-light)}.el-select-dropdown__footer{padding:10px;border-top:1px solid var(--el-border-color-light)}.el-select-dropdown__item{font-size:var(--el-font-size-base);padding:0 32px 0 20px;position:relative;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--el-text-color-regular);height:34px;line-height:34px;box-sizing:border-box;cursor:pointer}.el-select-dropdown__item.is-hovering{background-color:var(--el-fill-color-light)}.el-select-dropdown__item.is-selected{color:var(--el-color-primary);font-weight:700}.el-select-dropdown__item.is-disabled{color:var(--el-text-color-placeholder);cursor:not-allowed;background-color:unset}.el-select-dropdown.is-multiple .el-select-dropdown__item.is-selected:after{content:"";position:absolute;top:50%;right:20px;border-top:none;border-right:none;background-repeat:no-repeat;background-position:center;background-color:var(--el-color-primary);mask:url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;mask-size:100% 100%;-webkit-mask:url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;-webkit-mask-size:100% 100%;transform:translateY(-50%);width:12px;height:12px}.el-select-dropdown.is-multiple .el-select-dropdown__item.is-disabled:after{background-color:var(--el-text-color-placeholder)}.el-select-group{margin:0;padding:0}.el-select-group__wrap{position:relative;list-style:none;margin:0;padding:0}.el-select-group__title{box-sizing:border-box;padding:0 20px;font-size:12px;color:var(--el-color-info);line-height:34px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.el-select-group .el-select-dropdown__item{padding-left:20px}.el-select{--el-select-border-color-hover: var(--el-border-color-hover);--el-select-disabled-color: var(--el-disabled-text-color);--el-select-disabled-border: var(--el-disabled-border-color);--el-select-font-size: var(--el-font-size-base);--el-select-close-hover-color: var(--el-text-color-secondary);--el-select-input-color: var(--el-text-color-placeholder);--el-select-multiple-input-color: var(--el-text-color-regular);--el-select-input-focus-border-color: var(--el-color-primary);--el-select-input-font-size: 14px;--el-select-width: 100%}.el-select{display:inline-block;position:relative;vertical-align:middle;width:var(--el-select-width)}.el-select__wrapper{display:flex;align-items:center;position:relative;box-sizing:border-box;cursor:pointer;text-align:left;font-size:14px;padding:4px 12px;gap:6px;min-height:32px;line-height:24px;border-radius:var(--el-border-radius-base);background-color:var(--el-fill-color-blank);transition:var(--el-transition-duration);transform:translateZ(0);box-shadow:0 0 0 1px var(--el-border-color) inset}.el-select__wrapper.is-filterable{cursor:text}.el-select__wrapper.is-focused{box-shadow:0 0 0 1px var(--el-color-primary) inset}.el-select__wrapper.is-hovering:not(.is-focused){box-shadow:0 0 0 1px var(--el-border-color-hover) inset}.el-select__wrapper.is-disabled{cursor:not-allowed;background-color:var(--el-fill-color-light);color:var(--el-text-color-placeholder);box-shadow:0 0 0 1px var(--el-select-disabled-border) inset}.el-select__wrapper.is-disabled:hover{box-shadow:0 0 0 1px var(--el-select-disabled-border) inset}.el-select__wrapper.is-disabled.is-focus{box-shadow:0 0 0 1px var(--el-input-focus-border-color) inset}.el-select__wrapper.is-disabled .el-select__selected-item{color:var(--el-select-disabled-color)}.el-select__wrapper.is-disabled .el-select__caret,.el-select__wrapper.is-disabled .el-tag{cursor:not-allowed}.el-select__prefix,.el-select__suffix{display:flex;align-items:center;flex-shrink:0;gap:6px;color:var(--el-input-icon-color, var(--el-text-color-placeholder))}.el-select__caret{color:var(--el-select-input-color);font-size:var(--el-select-input-font-size);transition:var(--el-transition-duration);transform:rotate(0);cursor:pointer}.el-select__caret.is-reverse{transform:rotate(180deg)}.el-select__selection{position:relative;display:flex;flex-wrap:wrap;align-items:center;flex:1;min-width:0;gap:6px}.el-select__selection.is-near{margin-left:-8px}.el-select__selection .el-tag{cursor:pointer;border-color:transparent}.el-select__selection .el-tag.el-tag--plain{border-color:var(--el-tag-border-color)}.el-select__selection .el-tag .el-tag__content{min-width:0}.el-select__selected-item{display:flex;flex-wrap:wrap;-webkit-user-select:none;user-select:none}.el-select__tags-text{display:block;line-height:normal;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.el-select__placeholder{position:absolute;display:block;top:50%;transform:translateY(-50%);width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--el-input-text-color, var(--el-text-color-regular))}.el-select__placeholder.is-transparent{-webkit-user-select:none;user-select:none;color:var(--el-text-color-placeholder)}.el-select__popper.el-popper{background:var(--el-bg-color-overlay);border:1px solid var(--el-border-color-light);box-shadow:var(--el-box-shadow-light)}.el-select__popper.el-popper .el-popper__arrow:before{border:1px solid var(--el-border-color-light)}.el-select__popper.el-popper[data-popper-placement^=top] .el-popper__arrow:before{border-top-color:transparent;border-left-color:transparent}.el-select__popper.el-popper[data-popper-placement^=bottom] .el-popper__arrow:before{border-bottom-color:transparent;border-right-color:transparent}.el-select__popper.el-popper[data-popper-placement^=left] .el-popper__arrow:before{border-left-color:transparent;border-bottom-color:transparent}.el-select__popper.el-popper[data-popper-placement^=right] .el-popper__arrow:before{border-right-color:transparent;border-top-color:transparent}.el-select__input-wrapper{max-width:100%}.el-select__input-wrapper.is-hidden{position:absolute;opacity:0}.el-select__input{border:none;outline:none;padding:0;color:var(--el-select-multiple-input-color);font-size:inherit;font-family:inherit;-webkit-appearance:none;-moz-appearance:none;appearance:none;height:24px;max-width:100%;background-color:transparent}.el-select__input.is-disabled{cursor:not-allowed}.el-select__input-calculator{position:absolute;left:0;top:0;max-width:100%;visibility:hidden;white-space:pre;overflow:hidden}.el-select--large .el-select__wrapper{gap:6px;padding:8px 16px;min-height:40px;line-height:24px;font-size:14px}.el-select--large .el-select__selection{gap:6px}.el-select--large .el-select__selection.is-near{margin-left:-8px}.el-select--large .el-select__prefix,.el-select--large .el-select__suffix{gap:6px}.el-select--large .el-select__input{height:24px}.el-select--small .el-select__wrapper{gap:4px;padding:2px 8px;min-height:24px;line-height:20px;font-size:12px}.el-select--small .el-select__selection{gap:4px}.el-select--small .el-select__selection.is-near{margin-left:-6px}.el-select--small .el-select__prefix,.el-select--small .el-select__suffix{gap:4px}.el-select--small .el-select__input{height:20px}.el-textarea{--el-input-text-color: var(--el-text-color-regular);--el-input-border: var(--el-border);--el-input-hover-border: var(--el-border-color-hover);--el-input-focus-border: var(--el-color-primary);--el-input-transparent-border: 0 0 0 1px transparent inset;--el-input-border-color: var(--el-border-color);--el-input-border-radius: var(--el-border-radius-base);--el-input-bg-color: var(--el-fill-color-blank);--el-input-icon-color: var(--el-text-color-placeholder);--el-input-placeholder-color: var(--el-text-color-placeholder);--el-input-hover-border-color: var(--el-border-color-hover);--el-input-clear-hover-color: var(--el-text-color-secondary);--el-input-focus-border-color: var(--el-color-primary);--el-input-width: 100%}.el-textarea{position:relative;display:inline-block;width:100%;vertical-align:bottom;font-size:var(--el-font-size-base)}.el-textarea__inner{position:relative;display:block;resize:vertical;padding:5px 11px;line-height:1.5;box-sizing:border-box;width:100%;font-size:inherit;font-family:inherit;color:var(--el-input-text-color, var(--el-text-color-regular));background-color:var(--el-input-bg-color, var(--el-fill-color-blank));background-image:none;-webkit-appearance:none;box-shadow:0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;border-radius:var(--el-input-border-radius, var(--el-border-radius-base));transition:var(--el-transition-box-shadow);border:none}.el-textarea__inner::placeholder{color:var(--el-input-placeholder-color, var(--el-text-color-placeholder))}.el-textarea__inner:hover{box-shadow:0 0 0 1px var(--el-input-hover-border-color) inset}.el-textarea__inner:focus{outline:none;box-shadow:0 0 0 1px var(--el-input-focus-border-color) inset}.el-textarea .el-input__count{color:var(--el-color-info);background:var(--el-fill-color-blank);position:absolute;font-size:12px;line-height:14px;bottom:5px;right:10px}.el-textarea.is-disabled .el-textarea__inner{box-shadow:0 0 0 1px var(--el-disabled-border-color) inset;background-color:var(--el-disabled-bg-color);color:var(--el-disabled-text-color);cursor:not-allowed}.el-textarea.is-disabled .el-textarea__inner::placeholder{color:var(--el-text-color-placeholder)}.el-textarea.is-exceed .el-textarea__inner{box-shadow:0 0 0 1px var(--el-color-danger) inset}.el-textarea.is-exceed .el-input__count{color:var(--el-color-danger)}.el-input{--el-input-text-color: var(--el-text-color-regular);--el-input-border: var(--el-border);--el-input-hover-border: var(--el-border-color-hover);--el-input-focus-border: var(--el-color-primary);--el-input-transparent-border: 0 0 0 1px transparent inset;--el-input-border-color: var(--el-border-color);--el-input-border-radius: var(--el-border-radius-base);--el-input-bg-color: var(--el-fill-color-blank);--el-input-icon-color: var(--el-text-color-placeholder);--el-input-placeholder-color: var(--el-text-color-placeholder);--el-input-hover-border-color: var(--el-border-color-hover);--el-input-clear-hover-color: var(--el-text-color-secondary);--el-input-focus-border-color: var(--el-color-primary);--el-input-width: 100%}.el-input{--el-input-height: var(--el-component-size);position:relative;font-size:var(--el-font-size-base);display:inline-flex;width:var(--el-input-width);line-height:var(--el-input-height);box-sizing:border-box;vertical-align:middle}.el-input::-webkit-scrollbar{z-index:11;width:6px}.el-input::-webkit-scrollbar:horizontal{height:6px}.el-input::-webkit-scrollbar-thumb{border-radius:5px;width:6px;background:var(--el-text-color-disabled)}.el-input::-webkit-scrollbar-corner{background:var(--el-fill-color-blank)}.el-input::-webkit-scrollbar-track{background:var(--el-fill-color-blank)}.el-input::-webkit-scrollbar-track-piece{background:var(--el-fill-color-blank);width:6px}.el-input .el-input__clear,.el-input .el-input__password{color:var(--el-input-icon-color);font-size:14px;cursor:pointer}.el-input .el-input__clear:hover,.el-input .el-input__password:hover{color:var(--el-input-clear-hover-color)}.el-input .el-input__count{height:100%;display:inline-flex;align-items:center;color:var(--el-color-info);font-size:12px}.el-input .el-input__count .el-input__count-inner{background:var(--el-fill-color-blank);line-height:initial;display:inline-block;padding-left:8px}.el-input__wrapper{display:inline-flex;flex-grow:1;align-items:center;justify-content:center;padding:1px 11px;background-color:var(--el-input-bg-color, var(--el-fill-color-blank));background-image:none;border-radius:var(--el-input-border-radius, var(--el-border-radius-base));cursor:text;transition:var(--el-transition-box-shadow);transform:translateZ(0);box-shadow:0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset}.el-input__wrapper:hover{box-shadow:0 0 0 1px var(--el-input-hover-border-color) inset}.el-input__wrapper.is-focus{box-shadow:0 0 0 1px var(--el-input-focus-border-color) inset}.el-input__inner{--el-input-inner-height: calc(var(--el-input-height, 32px) - 2px);width:100%;flex-grow:1;-webkit-appearance:none;color:var(--el-input-text-color, var(--el-text-color-regular));font-size:inherit;height:var(--el-input-inner-height);line-height:var(--el-input-inner-height);padding:0;outline:none;border:none;background:none;box-sizing:border-box}.el-input__inner:focus{outline:none}.el-input__inner::placeholder{color:var(--el-input-placeholder-color, var(--el-text-color-placeholder))}.el-input__inner[type=password]::-ms-reveal{display:none}.el-input__inner[type=number]{line-height:1}.el-input__prefix{display:inline-flex;white-space:nowrap;flex-shrink:0;flex-wrap:nowrap;height:100%;text-align:center;color:var(--el-input-icon-color, var(--el-text-color-placeholder));transition:all var(--el-transition-duration);pointer-events:none}.el-input__prefix-inner{pointer-events:all;display:inline-flex;align-items:center;justify-content:center}.el-input__prefix-inner>:last-child{margin-right:8px}.el-input__prefix-inner>:first-child,.el-input__prefix-inner>:first-child.el-input__icon{margin-left:0}.el-input__suffix{display:inline-flex;white-space:nowrap;flex-shrink:0;flex-wrap:nowrap;height:100%;text-align:center;color:var(--el-input-icon-color, var(--el-text-color-placeholder));transition:all var(--el-transition-duration);pointer-events:none}.el-input__suffix-inner{pointer-events:all;display:inline-flex;align-items:center;justify-content:center}.el-input__suffix-inner>:first-child{margin-left:8px}.el-input .el-input__icon{height:inherit;line-height:inherit;display:flex;justify-content:center;align-items:center;transition:all var(--el-transition-duration);margin-left:8px}.el-input__validateIcon{pointer-events:none}.el-input.is-active .el-input__wrapper{box-shadow:0 0 0 1px var(--el-input-focus-color, ) inset}.el-input.is-disabled{cursor:not-allowed}.el-input.is-disabled .el-input__wrapper{background-color:var(--el-disabled-bg-color);box-shadow:0 0 0 1px var(--el-disabled-border-color) inset}.el-input.is-disabled .el-input__inner{color:var(--el-disabled-text-color);-webkit-text-fill-color:var(--el-disabled-text-color);cursor:not-allowed}.el-input.is-disabled .el-input__inner::placeholder{color:var(--el-text-color-placeholder)}.el-input.is-disabled .el-input__icon{cursor:not-allowed}.el-input.is-exceed .el-input__wrapper{box-shadow:0 0 0 1px var(--el-color-danger) inset}.el-input.is-exceed .el-input__suffix .el-input__count{color:var(--el-color-danger)}.el-input--large{--el-input-height: var(--el-component-size-large);font-size:14px}.el-input--large .el-input__wrapper{padding:1px 15px}.el-input--large .el-input__inner{--el-input-inner-height: calc(var(--el-input-height, 40px) - 2px)}.el-input--small{--el-input-height: var(--el-component-size-small);font-size:12px}.el-input--small .el-input__wrapper{padding:1px 7px}.el-input--small .el-input__inner{--el-input-inner-height: calc(var(--el-input-height, 24px) - 2px)}.el-input-group{display:inline-flex;width:100%;align-items:stretch}.el-input-group__append,.el-input-group__prepend{background-color:var(--el-fill-color-light);color:var(--el-color-info);position:relative;display:inline-flex;align-items:center;justify-content:center;min-height:100%;border-radius:var(--el-input-border-radius);padding:0 20px;white-space:nowrap}.el-input-group__append:focus,.el-input-group__prepend:focus{outline:none}.el-input-group__append .el-select,.el-input-group__append .el-button,.el-input-group__prepend .el-select,.el-input-group__prepend .el-button{display:inline-block;margin:0 -20px}.el-input-group__append button.el-button,.el-input-group__append button.el-button:hover,.el-input-group__append div.el-select .el-select__wrapper,.el-input-group__append div.el-select:hover .el-select__wrapper,.el-input-group__prepend button.el-button,.el-input-group__prepend button.el-button:hover,.el-input-group__prepend div.el-select .el-select__wrapper,.el-input-group__prepend div.el-select:hover .el-select__wrapper{border-color:transparent;background-color:transparent;color:inherit}.el-input-group__append .el-button,.el-input-group__append .el-input,.el-input-group__prepend .el-button,.el-input-group__prepend .el-input{font-size:inherit}.el-input-group__prepend{border-right:0;border-top-right-radius:0;border-bottom-right-radius:0;box-shadow:1px 0 0 0 var(--el-input-border-color) inset,0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset}.el-input-group__append{border-left:0;border-top-left-radius:0;border-bottom-left-radius:0;box-shadow:0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset,-1px 0 0 0 var(--el-input-border-color) inset}.el-input-group--prepend>.el-input__wrapper{border-top-left-radius:0;border-bottom-left-radius:0}.el-input-group--prepend .el-input-group__prepend .el-select .el-select__wrapper{border-top-right-radius:0;border-bottom-right-radius:0;box-shadow:1px 0 0 0 var(--el-input-border-color) inset,0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset}.el-input-group--append>.el-input__wrapper{border-top-right-radius:0;border-bottom-right-radius:0}.el-input-group--append .el-input-group__append .el-select .el-select__wrapper{border-top-left-radius:0;border-bottom-left-radius:0;box-shadow:0 1px 0 0 var(--el-input-border-color) inset,0 -1px 0 0 var(--el-input-border-color) inset,-1px 0 0 0 var(--el-input-border-color) inset}.el-input-hidden{display:none!important}.el-divider{position:relative}.el-divider--horizontal{display:block;height:1px;width:100%;margin:24px 0;border-top:1px var(--el-border-color) var(--el-border-style)}.el-divider--vertical{display:inline-block;width:1px;height:1em;margin:0 8px;vertical-align:middle;position:relative;border-left:1px var(--el-border-color) var(--el-border-style)}.el-divider__text{position:absolute;background-color:var(--el-bg-color);padding:0 20px;font-weight:500;color:var(--el-text-color-primary);font-size:14px}.el-divider__text.is-left{left:20px;transform:translateY(-50%)}.el-divider__text.is-center{left:50%;transform:translate(-50%) translateY(-50%)}.el-divider__text.is-right{right:20px;transform:translateY(-50%)}.el-space{display:inline-flex;vertical-align:top}.el-space__item{display:flex;flex-wrap:wrap}.el-space__item>*{flex:1}.el-space--vertical{flex-direction:column}.el-button{--el-button-font-weight: var(--el-font-weight-primary);--el-button-border-color: var(--el-border-color);--el-button-bg-color: var(--el-fill-color-blank);--el-button-text-color: var(--el-text-color-regular);--el-button-disabled-text-color: var(--el-disabled-text-color);--el-button-disabled-bg-color: var(--el-fill-color-blank);--el-button-disabled-border-color: var(--el-border-color-light);--el-button-divide-border-color: rgba(255, 255, 255, .5);--el-button-hover-text-color: var(--el-color-primary);--el-button-hover-bg-color: var(--el-color-primary-light-9);--el-button-hover-border-color: var(--el-color-primary-light-7);--el-button-active-text-color: var(--el-button-hover-text-color);--el-button-active-border-color: var(--el-color-primary);--el-button-active-bg-color: var(--el-button-hover-bg-color);--el-button-outline-color: var(--el-color-primary-light-5);--el-button-hover-link-text-color: var(--el-color-info);--el-button-active-color: var(--el-text-color-primary)}.el-button{display:inline-flex;justify-content:center;align-items:center;line-height:1;height:32px;white-space:nowrap;cursor:pointer;color:var(--el-button-text-color);text-align:center;box-sizing:border-box;outline:none;transition:.1s;font-weight:var(--el-button-font-weight);-webkit-user-select:none;user-select:none;vertical-align:middle;-webkit-appearance:none;background-color:var(--el-button-bg-color);border:var(--el-border);border-color:var(--el-button-border-color)}.el-button:hover{color:var(--el-button-hover-text-color);border-color:var(--el-button-hover-border-color);background-color:var(--el-button-hover-bg-color);outline:none}.el-button:active{color:var(--el-button-active-text-color);border-color:var(--el-button-active-border-color);background-color:var(--el-button-active-bg-color);outline:none}.el-button:focus-visible{outline:2px solid var(--el-button-outline-color);outline-offset:1px;transition:outline-offset 0s,outline 0s}.el-button>span{display:inline-flex;align-items:center}.el-button+.el-button{margin-left:12px}.el-button{padding:8px 15px;font-size:var(--el-font-size-base);border-radius:var(--el-border-radius-base)}.el-button.is-round{padding:8px 15px}.el-button::-moz-focus-inner{border:0}.el-button [class*=el-icon]+span{margin-left:6px}.el-button [class*=el-icon] svg{vertical-align:bottom}.el-button.is-plain{--el-button-hover-text-color: var(--el-color-primary);--el-button-hover-bg-color: var(--el-fill-color-blank);--el-button-hover-border-color: var(--el-color-primary)}.el-button.is-active{color:var(--el-button-active-text-color);border-color:var(--el-button-active-border-color);background-color:var(--el-button-active-bg-color);outline:none}.el-button.is-disabled,.el-button.is-disabled:hover{color:var(--el-button-disabled-text-color);cursor:not-allowed;background-image:none;background-color:var(--el-button-disabled-bg-color);border-color:var(--el-button-disabled-border-color)}.el-button.is-loading{position:relative;pointer-events:none}.el-button.is-loading:before{z-index:1;pointer-events:none;content:"";position:absolute;left:-1px;top:-1px;right:-1px;bottom:-1px;border-radius:inherit;background-color:var(--el-mask-color-extra-light)}.el-button.is-round{border-radius:var(--el-border-radius-round)}.el-button.is-circle{width:32px;border-radius:50%;padding:8px}.el-button.is-text{color:var(--el-button-text-color);border:0 solid transparent;background-color:transparent}.el-button.is-text.is-disabled{color:var(--el-button-disabled-text-color);background-color:transparent!important}.el-button.is-text:not(.is-disabled):hover{background-color:var(--el-fill-color-light)}.el-button.is-text:not(.is-disabled):focus-visible{outline:2px solid var(--el-button-outline-color);outline-offset:1px;transition:outline-offset 0s,outline 0s}.el-button.is-text:not(.is-disabled):active{background-color:var(--el-fill-color)}.el-button.is-text:not(.is-disabled).is-has-bg{background-color:var(--el-fill-color-light)}.el-button.is-text:not(.is-disabled).is-has-bg:hover{background-color:var(--el-fill-color)}.el-button.is-text:not(.is-disabled).is-has-bg:active{background-color:var(--el-fill-color-dark)}.el-button__text--expand{letter-spacing:.3em;margin-right:-.3em}.el-button.is-link{border-color:transparent;color:var(--el-button-text-color);background:transparent;padding:2px;height:auto}.el-button.is-link:hover{color:var(--el-button-hover-link-text-color)}.el-button.is-link.is-disabled{color:var(--el-button-disabled-text-color);background-color:transparent!important;border-color:transparent!important}.el-button.is-link:not(.is-disabled):hover{border-color:transparent;background-color:transparent}.el-button.is-link:not(.is-disabled):active{color:var(--el-button-active-color);border-color:transparent;background-color:transparent}.el-button--text{border-color:transparent;background:transparent;color:var(--el-color-primary);padding-left:0;padding-right:0}.el-button--text.is-disabled{color:var(--el-button-disabled-text-color);background-color:transparent!important;border-color:transparent!important}.el-button--text:not(.is-disabled):hover{color:var(--el-color-primary-light-3);border-color:transparent;background-color:transparent}.el-button--text:not(.is-disabled):active{color:var(--el-color-primary-dark-2);border-color:transparent;background-color:transparent}.el-button__link--expand{letter-spacing:.3em;margin-right:-.3em}.el-button--primary{--el-button-text-color: var(--el-color-white);--el-button-bg-color: var(--el-color-primary);--el-button-border-color: var(--el-color-primary);--el-button-outline-color: var(--el-color-primary-light-5);--el-button-active-color: var(--el-color-primary-dark-2);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-link-text-color: var(--el-color-primary-light-5);--el-button-hover-bg-color: var(--el-color-primary-light-3);--el-button-hover-border-color: var(--el-color-primary-light-3);--el-button-active-bg-color: var(--el-color-primary-dark-2);--el-button-active-border-color: var(--el-color-primary-dark-2);--el-button-disabled-text-color: var(--el-color-white);--el-button-disabled-bg-color: var(--el-color-primary-light-5);--el-button-disabled-border-color: var(--el-color-primary-light-5)}.el-button--primary.is-plain,.el-button--primary.is-text,.el-button--primary.is-link{--el-button-text-color: var(--el-color-primary);--el-button-bg-color: var(--el-color-primary-light-9);--el-button-border-color: var(--el-color-primary-light-5);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-bg-color: var(--el-color-primary);--el-button-hover-border-color: var(--el-color-primary);--el-button-active-text-color: var(--el-color-white)}.el-button--primary.is-plain.is-disabled,.el-button--primary.is-plain.is-disabled:hover,.el-button--primary.is-plain.is-disabled:focus,.el-button--primary.is-plain.is-disabled:active,.el-button--primary.is-text.is-disabled,.el-button--primary.is-text.is-disabled:hover,.el-button--primary.is-text.is-disabled:focus,.el-button--primary.is-text.is-disabled:active,.el-button--primary.is-link.is-disabled,.el-button--primary.is-link.is-disabled:hover,.el-button--primary.is-link.is-disabled:focus,.el-button--primary.is-link.is-disabled:active{color:var(--el-color-primary-light-5);background-color:var(--el-color-primary-light-9);border-color:var(--el-color-primary-light-8)}.el-button--success{--el-button-text-color: var(--el-color-white);--el-button-bg-color: var(--el-color-success);--el-button-border-color: var(--el-color-success);--el-button-outline-color: var(--el-color-success-light-5);--el-button-active-color: var(--el-color-success-dark-2);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-link-text-color: var(--el-color-success-light-5);--el-button-hover-bg-color: var(--el-color-success-light-3);--el-button-hover-border-color: var(--el-color-success-light-3);--el-button-active-bg-color: var(--el-color-success-dark-2);--el-button-active-border-color: var(--el-color-success-dark-2);--el-button-disabled-text-color: var(--el-color-white);--el-button-disabled-bg-color: var(--el-color-success-light-5);--el-button-disabled-border-color: var(--el-color-success-light-5)}.el-button--success.is-plain,.el-button--success.is-text,.el-button--success.is-link{--el-button-text-color: var(--el-color-success);--el-button-bg-color: var(--el-color-success-light-9);--el-button-border-color: var(--el-color-success-light-5);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-bg-color: var(--el-color-success);--el-button-hover-border-color: var(--el-color-success);--el-button-active-text-color: var(--el-color-white)}.el-button--success.is-plain.is-disabled,.el-button--success.is-plain.is-disabled:hover,.el-button--success.is-plain.is-disabled:focus,.el-button--success.is-plain.is-disabled:active,.el-button--success.is-text.is-disabled,.el-button--success.is-text.is-disabled:hover,.el-button--success.is-text.is-disabled:focus,.el-button--success.is-text.is-disabled:active,.el-button--success.is-link.is-disabled,.el-button--success.is-link.is-disabled:hover,.el-button--success.is-link.is-disabled:focus,.el-button--success.is-link.is-disabled:active{color:var(--el-color-success-light-5);background-color:var(--el-color-success-light-9);border-color:var(--el-color-success-light-8)}.el-button--warning{--el-button-text-color: var(--el-color-white);--el-button-bg-color: var(--el-color-warning);--el-button-border-color: var(--el-color-warning);--el-button-outline-color: var(--el-color-warning-light-5);--el-button-active-color: var(--el-color-warning-dark-2);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-link-text-color: var(--el-color-warning-light-5);--el-button-hover-bg-color: var(--el-color-warning-light-3);--el-button-hover-border-color: var(--el-color-warning-light-3);--el-button-active-bg-color: var(--el-color-warning-dark-2);--el-button-active-border-color: var(--el-color-warning-dark-2);--el-button-disabled-text-color: var(--el-color-white);--el-button-disabled-bg-color: var(--el-color-warning-light-5);--el-button-disabled-border-color: var(--el-color-warning-light-5)}.el-button--warning.is-plain,.el-button--warning.is-text,.el-button--warning.is-link{--el-button-text-color: var(--el-color-warning);--el-button-bg-color: var(--el-color-warning-light-9);--el-button-border-color: var(--el-color-warning-light-5);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-bg-color: var(--el-color-warning);--el-button-hover-border-color: var(--el-color-warning);--el-button-active-text-color: var(--el-color-white)}.el-button--warning.is-plain.is-disabled,.el-button--warning.is-plain.is-disabled:hover,.el-button--warning.is-plain.is-disabled:focus,.el-button--warning.is-plain.is-disabled:active,.el-button--warning.is-text.is-disabled,.el-button--warning.is-text.is-disabled:hover,.el-button--warning.is-text.is-disabled:focus,.el-button--warning.is-text.is-disabled:active,.el-button--warning.is-link.is-disabled,.el-button--warning.is-link.is-disabled:hover,.el-button--warning.is-link.is-disabled:focus,.el-button--warning.is-link.is-disabled:active{color:var(--el-color-warning-light-5);background-color:var(--el-color-warning-light-9);border-color:var(--el-color-warning-light-8)}.el-button--danger{--el-button-text-color: var(--el-color-white);--el-button-bg-color: var(--el-color-danger);--el-button-border-color: var(--el-color-danger);--el-button-outline-color: var(--el-color-danger-light-5);--el-button-active-color: var(--el-color-danger-dark-2);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-link-text-color: var(--el-color-danger-light-5);--el-button-hover-bg-color: var(--el-color-danger-light-3);--el-button-hover-border-color: var(--el-color-danger-light-3);--el-button-active-bg-color: var(--el-color-danger-dark-2);--el-button-active-border-color: var(--el-color-danger-dark-2);--el-button-disabled-text-color: var(--el-color-white);--el-button-disabled-bg-color: var(--el-color-danger-light-5);--el-button-disabled-border-color: var(--el-color-danger-light-5)}.el-button--danger.is-plain,.el-button--danger.is-text,.el-button--danger.is-link{--el-button-text-color: var(--el-color-danger);--el-button-bg-color: var(--el-color-danger-light-9);--el-button-border-color: var(--el-color-danger-light-5);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-bg-color: var(--el-color-danger);--el-button-hover-border-color: var(--el-color-danger);--el-button-active-text-color: var(--el-color-white)}.el-button--danger.is-plain.is-disabled,.el-button--danger.is-plain.is-disabled:hover,.el-button--danger.is-plain.is-disabled:focus,.el-button--danger.is-plain.is-disabled:active,.el-button--danger.is-text.is-disabled,.el-button--danger.is-text.is-disabled:hover,.el-button--danger.is-text.is-disabled:focus,.el-button--danger.is-text.is-disabled:active,.el-button--danger.is-link.is-disabled,.el-button--danger.is-link.is-disabled:hover,.el-button--danger.is-link.is-disabled:focus,.el-button--danger.is-link.is-disabled:active{color:var(--el-color-danger-light-5);background-color:var(--el-color-danger-light-9);border-color:var(--el-color-danger-light-8)}.el-button--info{--el-button-text-color: var(--el-color-white);--el-button-bg-color: var(--el-color-info);--el-button-border-color: var(--el-color-info);--el-button-outline-color: var(--el-color-info-light-5);--el-button-active-color: var(--el-color-info-dark-2);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-link-text-color: var(--el-color-info-light-5);--el-button-hover-bg-color: var(--el-color-info-light-3);--el-button-hover-border-color: var(--el-color-info-light-3);--el-button-active-bg-color: var(--el-color-info-dark-2);--el-button-active-border-color: var(--el-color-info-dark-2);--el-button-disabled-text-color: var(--el-color-white);--el-button-disabled-bg-color: var(--el-color-info-light-5);--el-button-disabled-border-color: var(--el-color-info-light-5)}.el-button--info.is-plain,.el-button--info.is-text,.el-button--info.is-link{--el-button-text-color: var(--el-color-info);--el-button-bg-color: var(--el-color-info-light-9);--el-button-border-color: var(--el-color-info-light-5);--el-button-hover-text-color: var(--el-color-white);--el-button-hover-bg-color: var(--el-color-info);--el-button-hover-border-color: var(--el-color-info);--el-button-active-text-color: var(--el-color-white)}.el-button--info.is-plain.is-disabled,.el-button--info.is-plain.is-disabled:hover,.el-button--info.is-plain.is-disabled:focus,.el-button--info.is-plain.is-disabled:active,.el-button--info.is-text.is-disabled,.el-button--info.is-text.is-disabled:hover,.el-button--info.is-text.is-disabled:focus,.el-button--info.is-text.is-disabled:active,.el-button--info.is-link.is-disabled,.el-button--info.is-link.is-disabled:hover,.el-button--info.is-link.is-disabled:focus,.el-button--info.is-link.is-disabled:active{color:var(--el-color-info-light-5);background-color:var(--el-color-info-light-9);border-color:var(--el-color-info-light-8)}.el-button--large{--el-button-size: 40px;height:var(--el-button-size)}.el-button--large [class*=el-icon]+span{margin-left:8px}.el-button--large{padding:12px 19px;font-size:var(--el-font-size-base);border-radius:var(--el-border-radius-base)}.el-button--large.is-round{padding:12px 19px}.el-button--large.is-circle{width:var(--el-button-size);padding:12px}.el-button--small{--el-button-size: 24px;height:var(--el-button-size)}.el-button--small [class*=el-icon]+span{margin-left:4px}.el-button--small{padding:5px 11px;font-size:12px;border-radius:calc(var(--el-border-radius-base) - 1px)}.el-button--small.is-round{padding:5px 11px}.el-button--small.is-circle{width:var(--el-button-size);padding:5px}.title[data-v-eb1c182f]{font-weight:700}.el-radio-group{display:inline-flex;align-items:center;flex-wrap:wrap;font-size:0}.el-radio{--el-radio-font-size: var(--el-font-size-base);--el-radio-text-color: var(--el-text-color-regular);--el-radio-font-weight: var(--el-font-weight-primary);--el-radio-input-height: 14px;--el-radio-input-width: 14px;--el-radio-input-border-radius: var(--el-border-radius-circle);--el-radio-input-bg-color: var(--el-fill-color-blank);--el-radio-input-border: var(--el-border);--el-radio-input-border-color: var(--el-border-color);--el-radio-input-border-color-hover: var(--el-color-primary)}.el-radio{color:var(--el-radio-text-color);font-weight:var(--el-radio-font-weight);position:relative;cursor:pointer;display:inline-flex;align-items:center;white-space:nowrap;outline:none;font-size:var(--el-font-size-base);-webkit-user-select:none;user-select:none;margin-right:30px;height:32px}.el-radio.el-radio--large{height:40px}.el-radio.el-radio--small{height:24px}.el-radio.is-bordered{padding:0 15px 0 9px;border-radius:var(--el-border-radius-base);border:var(--el-border);box-sizing:border-box}.el-radio.is-bordered.is-checked{border-color:var(--el-color-primary)}.el-radio.is-bordered.is-disabled{cursor:not-allowed;border-color:var(--el-border-color-lighter)}.el-radio.is-bordered.el-radio--large{padding:0 19px 0 11px;border-radius:var(--el-border-radius-base)}.el-radio.is-bordered.el-radio--large .el-radio__label{font-size:var(--el-font-size-base)}.el-radio.is-bordered.el-radio--large .el-radio__inner{height:14px;width:14px}.el-radio.is-bordered.el-radio--small{padding:0 11px 0 7px;border-radius:var(--el-border-radius-base)}.el-radio.is-bordered.el-radio--small .el-radio__label{font-size:12px}.el-radio.is-bordered.el-radio--small .el-radio__inner{height:12px;width:12px}.el-radio:last-child{margin-right:0}.el-radio__input{white-space:nowrap;cursor:pointer;outline:none;display:inline-flex;position:relative;vertical-align:middle}.el-radio__input.is-disabled .el-radio__inner{background-color:var(--el-disabled-bg-color);border-color:var(--el-disabled-border-color);cursor:not-allowed}.el-radio__input.is-disabled .el-radio__inner:after{cursor:not-allowed;background-color:var(--el-disabled-bg-color)}.el-radio__input.is-disabled .el-radio__inner+.el-radio__label{cursor:not-allowed}.el-radio__input.is-disabled.is-checked .el-radio__inner{background-color:var(--el-disabled-bg-color);border-color:var(--el-disabled-border-color)}.el-radio__input.is-disabled.is-checked .el-radio__inner:after{background-color:var(--el-text-color-placeholder)}.el-radio__input.is-disabled+span.el-radio__label{color:var(--el-text-color-placeholder);cursor:not-allowed}.el-radio__input.is-checked .el-radio__inner{border-color:var(--el-color-primary);background:var(--el-color-primary)}.el-radio__input.is-checked .el-radio__inner:after{transform:translate(-50%,-50%) scale(1)}.el-radio__input.is-checked+.el-radio__label{color:var(--el-color-primary)}.el-radio__input.is-focus .el-radio__inner{border-color:var(--el-radio-input-border-color-hover)}.el-radio__inner{border:var(--el-radio-input-border);border-radius:var(--el-radio-input-border-radius);width:var(--el-radio-input-width);height:var(--el-radio-input-height);background-color:var(--el-radio-input-bg-color);position:relative;cursor:pointer;display:inline-block;box-sizing:border-box}.el-radio__inner:hover{border-color:var(--el-radio-input-border-color-hover)}.el-radio__inner:after{width:4px;height:4px;border-radius:var(--el-radio-input-border-radius);background-color:var(--el-color-white);content:"";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(0);transition:transform .15s ease-in}.el-radio__original{opacity:0;outline:none;position:absolute;z-index:-1;top:0;left:0;right:0;bottom:0;margin:0}.el-radio__original:focus-visible+.el-radio__inner{outline:2px solid var(--el-radio-input-border-color-hover);outline-offset:1px;border-radius:var(--el-radio-input-border-radius)}.el-radio:focus:not(:focus-visible):not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner{box-shadow:0 0 2px 2px var(--el-radio-input-border-color-hover)}.el-radio__label{font-size:var(--el-radio-font-size);padding-left:8px}.el-radio.el-radio--large .el-radio__label{font-size:14px}.el-radio.el-radio--large .el-radio__inner{width:14px;height:14px}.el-radio.el-radio--small .el-radio__label{font-size:12px}.el-radio.el-radio--small .el-radio__inner{width:12px;height:12px}.el-empty{--el-empty-padding: 40px 0;--el-empty-image-width: 160px;--el-empty-description-margin-top: 20px;--el-empty-bottom-margin-top: 20px;--el-empty-fill-color-0: var(--el-color-white);--el-empty-fill-color-1: #fcfcfd;--el-empty-fill-color-2: #f8f9fb;--el-empty-fill-color-3: #f7f8fc;--el-empty-fill-color-4: #eeeff3;--el-empty-fill-color-5: #edeef2;--el-empty-fill-color-6: #e9ebef;--el-empty-fill-color-7: #e5e7e9;--el-empty-fill-color-8: #e0e3e9;--el-empty-fill-color-9: #d5d7de;display:flex;justify-content:center;align-items:center;flex-direction:column;text-align:center;box-sizing:border-box;padding:var(--el-empty-padding)}.el-empty__image{width:var(--el-empty-image-width)}.el-empty__image img{-webkit-user-select:none;user-select:none;width:100%;height:100%;vertical-align:top;object-fit:contain}.el-empty__image svg{color:var(--el-svg-monochrome-grey);fill:currentColor;width:100%;height:100%;vertical-align:top}.el-empty__description{margin-top:var(--el-empty-description-margin-top)}.el-empty__description p{margin:0;font-size:var(--el-font-size-base);color:var(--el-text-color-secondary)}.el-empty__bottom{margin-top:var(--el-empty-bottom-margin-top)}.el-checkbox-group{font-size:0;line-height:0}.el-input-number{position:relative;display:inline-flex;width:150px;line-height:30px;vertical-align:middle}.el-input-number .el-input__wrapper{padding-left:42px;padding-right:42px}.el-input-number .el-input__inner{-webkit-appearance:none;-moz-appearance:textfield;text-align:center;line-height:1}.el-input-number .el-input__inner::-webkit-inner-spin-button,.el-input-number .el-input__inner::-webkit-outer-spin-button{margin:0;-webkit-appearance:none}.el-input-number__increase,.el-input-number__decrease{display:flex;justify-content:center;align-items:center;height:auto;position:absolute;z-index:1;top:1px;bottom:1px;width:32px;background:var(--el-fill-color-light);color:var(--el-text-color-regular);cursor:pointer;font-size:13px;-webkit-user-select:none;user-select:none}.el-input-number__increase:hover,.el-input-number__decrease:hover{color:var(--el-color-primary)}.el-input-number__increase:hover~.el-input:not(.is-disabled) .el-input__wrapper,.el-input-number__decrease:hover~.el-input:not(.is-disabled) .el-input__wrapper{box-shadow:0 0 0 1px var(--el-input-focus-border-color, var(--el-color-primary)) inset}.el-input-number__increase.is-disabled,.el-input-number__decrease.is-disabled{color:var(--el-disabled-text-color);cursor:not-allowed}.el-input-number__increase{right:1px;border-radius:0 var(--el-border-radius-base) var(--el-border-radius-base) 0;border-left:var(--el-border)}.el-input-number__decrease{left:1px;border-radius:var(--el-border-radius-base) 0 0 var(--el-border-radius-base);border-right:var(--el-border)}.el-input-number.is-disabled .el-input-number__increase,.el-input-number.is-disabled .el-input-number__decrease{border-color:var(--el-disabled-border-color);color:var(--el-disabled-border-color)}.el-input-number.is-disabled .el-input-number__increase:hover,.el-input-number.is-disabled .el-input-number__decrease:hover{color:var(--el-disabled-border-color);cursor:not-allowed}.el-input-number--large{width:180px;line-height:38px}.el-input-number--large .el-input-number__increase,.el-input-number--large .el-input-number__decrease{width:40px;font-size:14px}.el-input-number--large .el-input--large .el-input__wrapper{padding-left:47px;padding-right:47px}.el-input-number--small{width:120px;line-height:22px}.el-input-number--small .el-input-number__increase,.el-input-number--small .el-input-number__decrease{width:24px;font-size:12px}.el-input-number--small .el-input--small .el-input__wrapper{padding-left:31px;padding-right:31px}.el-input-number--small .el-input-number__increase [class*=el-icon],.el-input-number--small .el-input-number__decrease [class*=el-icon]{transform:scale(.9)}.el-input-number.is-without-controls .el-input__wrapper{padding-left:15px;padding-right:15px}.el-input-number.is-controls-right .el-input__wrapper{padding-left:15px;padding-right:42px}.el-input-number.is-controls-right .el-input-number__increase,.el-input-number.is-controls-right .el-input-number__decrease{--el-input-number-controls-height: 15px;height:var(--el-input-number-controls-height);line-height:var(--el-input-number-controls-height)}.el-input-number.is-controls-right .el-input-number__increase [class*=el-icon],.el-input-number.is-controls-right .el-input-number__decrease [class*=el-icon]{transform:scale(.8)}.el-input-number.is-controls-right .el-input-number__increase{bottom:auto;left:auto;border-radius:0 var(--el-border-radius-base) 0 0;border-bottom:var(--el-border)}.el-input-number.is-controls-right .el-input-number__decrease{right:1px;top:auto;left:auto;border-right:none;border-left:var(--el-border);border-radius:0 0 var(--el-border-radius-base) 0}.el-input-number.is-controls-right[class*=large] [class*=increase],.el-input-number.is-controls-right[class*=large] [class*=decrease]{--el-input-number-controls-height: 19px}.el-input-number.is-controls-right[class*=small] [class*=increase],.el-input-number.is-controls-right[class*=small] [class*=decrease]{--el-input-number-controls-height: 11px}.download-list[data-v-f43745eb]{display:grid;gap:10px;padding:10px;border-radius:8px;background-color:#eee}.download-list[data-v-f43745eb] .el-checkbox{position:relative;width:100%;height:100%}.download-list[data-v-f43745eb] .el-checkbox .el-checkbox__input{position:absolute;top:0;left:0}.download-list[data-v-f43745eb] .el-checkbox .el-checkbox__label{height:100%;padding:0;margin:0}.download-list .item[data-v-f43745eb]{height:100%;display:flex;justify-content:center;align-items:center;flex-direction:column;position:relative;border-radius:8px;overflow:hidden}.download-list .item .progress[data-v-f43745eb],.download-list .item .tag[data-v-f43745eb]{position:absolute;background-color:#00000080;color:#fff;padding:5px 10px}.download-list .item .tag[data-v-f43745eb]{right:0;bottom:0;border-top-left-radius:10px}.download-list .item .progress[data-v-f43745eb]{top:0;right:0;border-bottom-left-radius:10px}.download-list .item img[data-v-f43745eb]{width:100%;height:100%;object-fit:cover}.btns[data-v-f43745eb]{display:flex;justify-content:center}[data-v-f43745eb] .el-radio__label{display:flex;align-items:center}.line[data-v-f43745eb]{width:5px;background-color:#eee;position:absolute;top:0;bottom:0;left:0;cursor:w-resize}.line[data-v-f43745eb]:hover{background-color:#aaa}.line.active[data-v-f43745eb]{background-color:#aaa;cursor:w-resize}.xhs-form-item[data-v-f43745eb]{margin-bottom:0}.col[data-v-f43745eb]{width:100px}.xhs-download-container{transition:none!important}.download .el-drawer__body{padding:0 10px}.download .el-drawer__header{margin-bottom:16px}.xiaohongshu_script[data-v-963e1d2e]{position:relative}.example{display:flex;flex-direction:column;justify-content:flex-start;text-align:left;font-size:12px;color:#00000073}.example.red{color:#ff2e4d}.example a{color:#ff2e4d;text-decoration:underline}.flex-center{display:flex;align-items:center;justify-content:center}.flex-end{display:flex;align-items:center;justify-content:flex-end}.notedetail-menu{z-index:999!important}.xhs-modal-header{display:flex;justify-content:space-between;align-items:center;margin-right:20px;-webkit-user-select:none;user-select:none}.xhs-modal-header .icon{width:20px;height:20px}.xhs{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"!important} `);

(function (vue, pinia, dayjs, dayjs_plugin_utc, dayjs_plugin_timezone, StreamSaver, piniaPluginPersistedstate) {
  'use strict';

  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var require_main_001 = __commonJS({
    "main-8yvGYByF.js"(exports, module) {
      const isFocusable = (element) => {
        if (element.tabIndex > 0 || element.tabIndex === 0 && element.getAttribute("tabIndex") !== null) {
          return true;
        }
        if (element.tabIndex < 0 || element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true") {
          return false;
        }
        switch (element.nodeName) {
          case "A": {
            return !!element.href && element.rel !== "ignore";
          }
          case "INPUT": {
            return !(element.type === "hidden" || element.type === "file");
          }
          case "BUTTON":
          case "SELECT":
          case "TEXTAREA": {
            return true;
          }
          default: {
            return false;
          }
        }
      };
      const composeEventHandlers = (theirsHandler, oursHandler, { checkForDefaultPrevented = true } = {}) => {
        const handleEvent = (event) => {
          const shouldPrevent = theirsHandler == null ? void 0 : theirsHandler(event);
          if (checkForDefaultPrevented === false || !shouldPrevent) {
            return oursHandler == null ? void 0 : oursHandler(event);
          }
        };
        return handleEvent;
      };
      var __defProp$9 = Object.defineProperty;
      var __defProps$6 = Object.defineProperties;
      var __getOwnPropDescs$6 = Object.getOwnPropertyDescriptors;
      var __getOwnPropSymbols$b = Object.getOwnPropertySymbols;
      var __hasOwnProp$b = Object.prototype.hasOwnProperty;
      var __propIsEnum$b = Object.prototype.propertyIsEnumerable;
      var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues$9 = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp$b.call(b, prop))
            __defNormalProp$9(a, prop, b[prop]);
        if (__getOwnPropSymbols$b)
          for (var prop of __getOwnPropSymbols$b(b)) {
            if (__propIsEnum$b.call(b, prop))
              __defNormalProp$9(a, prop, b[prop]);
          }
        return a;
      };
      var __spreadProps$6 = (a, b) => __defProps$6(a, __getOwnPropDescs$6(b));
      function computedEager(fn2, options) {
        var _a2;
        const result = vue.shallowRef();
        vue.watchEffect(() => {
          result.value = fn2();
        }, __spreadProps$6(__spreadValues$9({}, options), {
          flush: (_a2 = void 0) != null ? _a2 : "sync"
        }));
        return vue.readonly(result);
      }
      var _a;
      const isClient = typeof window !== "undefined";
      const isString$1 = (val) => typeof val === "string";
      const noop = () => {
      };
      const isIOS = isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
      function resolveUnref(r) {
        return typeof r === "function" ? r() : vue.unref(r);
      }
      function createFilterWrapper(filter, fn2) {
        function wrapper(...args) {
          return new Promise((resolve, reject) => {
            Promise.resolve(filter(() => fn2.apply(this, args), { fn: fn2, thisArg: this, args })).then(resolve).catch(reject);
          });
        }
        return wrapper;
      }
      function debounceFilter(ms, options = {}) {
        let timer;
        let maxTimer;
        let lastRejector = noop;
        const _clearTimeout = (timer2) => {
          clearTimeout(timer2);
          lastRejector();
          lastRejector = noop;
        };
        const filter = (invoke) => {
          const duration = resolveUnref(ms);
          const maxDuration = resolveUnref(options.maxWait);
          if (timer)
            _clearTimeout(timer);
          if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
            if (maxTimer) {
              _clearTimeout(maxTimer);
              maxTimer = null;
            }
            return Promise.resolve(invoke());
          }
          return new Promise((resolve, reject) => {
            lastRejector = options.rejectOnCancel ? reject : resolve;
            if (maxDuration && !maxTimer) {
              maxTimer = setTimeout(() => {
                if (timer)
                  _clearTimeout(timer);
                maxTimer = null;
                resolve(invoke());
              }, maxDuration);
            }
            timer = setTimeout(() => {
              if (maxTimer)
                _clearTimeout(maxTimer);
              maxTimer = null;
              resolve(invoke());
            }, duration);
          });
        };
        return filter;
      }
      function identity$1(arg) {
        return arg;
      }
      function tryOnScopeDispose(fn2) {
        if (vue.getCurrentScope()) {
          vue.onScopeDispose(fn2);
          return true;
        }
        return false;
      }
      function useDebounceFn(fn2, ms = 200, options = {}) {
        return createFilterWrapper(debounceFilter(ms, options), fn2);
      }
      function refDebounced(value, ms = 200, options = {}) {
        const debounced = vue.ref(value.value);
        const updater = useDebounceFn(() => {
          debounced.value = value.value;
        }, ms, options);
        vue.watch(value, () => updater());
        return debounced;
      }
      function tryOnMounted(fn2, sync = true) {
        if (vue.getCurrentInstance())
          vue.onMounted(fn2);
        else if (sync)
          fn2();
        else
          vue.nextTick(fn2);
      }
      function useTimeoutFn(cb, interval, options = {}) {
        const {
          immediate = true
        } = options;
        const isPending = vue.ref(false);
        let timer = null;
        function clear() {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
        }
        function stop() {
          isPending.value = false;
          clear();
        }
        function start(...args) {
          clear();
          isPending.value = true;
          timer = setTimeout(() => {
            isPending.value = false;
            timer = null;
            cb(...args);
          }, resolveUnref(interval));
        }
        if (immediate) {
          isPending.value = true;
          if (isClient)
            start();
        }
        tryOnScopeDispose(stop);
        return {
          isPending: vue.readonly(isPending),
          start,
          stop
        };
      }
      function unrefElement(elRef) {
        var _a2;
        const plain = resolveUnref(elRef);
        return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
      }
      const defaultWindow = isClient ? window : void 0;
      function useEventListener(...args) {
        let target;
        let events;
        let listeners;
        let options;
        if (isString$1(args[0]) || Array.isArray(args[0])) {
          [events, listeners, options] = args;
          target = defaultWindow;
        } else {
          [target, events, listeners, options] = args;
        }
        if (!target)
          return noop;
        if (!Array.isArray(events))
          events = [events];
        if (!Array.isArray(listeners))
          listeners = [listeners];
        const cleanups = [];
        const cleanup = () => {
          cleanups.forEach((fn2) => fn2());
          cleanups.length = 0;
        };
        const register = (el, event, listener, options2) => {
          el.addEventListener(event, listener, options2);
          return () => el.removeEventListener(event, listener, options2);
        };
        const stopWatch = vue.watch(() => [unrefElement(target), resolveUnref(options)], ([el, options2]) => {
          cleanup();
          if (!el)
            return;
          cleanups.push(...events.flatMap((event) => {
            return listeners.map((listener) => register(el, event, listener, options2));
          }));
        }, { immediate: true, flush: "post" });
        const stop = () => {
          stopWatch();
          cleanup();
        };
        tryOnScopeDispose(stop);
        return stop;
      }
      let _iOSWorkaround = false;
      function onClickOutside(target, handler, options = {}) {
        const { window: window2 = defaultWindow, ignore = [], capture = true, detectIframe = false } = options;
        if (!window2)
          return;
        if (isIOS && !_iOSWorkaround) {
          _iOSWorkaround = true;
          Array.from(window2.document.body.children).forEach((el) => el.addEventListener("click", noop));
        }
        let shouldListen = true;
        const shouldIgnore = (event) => {
          return ignore.some((target2) => {
            if (typeof target2 === "string") {
              return Array.from(window2.document.querySelectorAll(target2)).some((el) => el === event.target || event.composedPath().includes(el));
            } else {
              const el = unrefElement(target2);
              return el && (event.target === el || event.composedPath().includes(el));
            }
          });
        };
        const listener = (event) => {
          const el = unrefElement(target);
          if (!el || el === event.target || event.composedPath().includes(el))
            return;
          if (event.detail === 0)
            shouldListen = !shouldIgnore(event);
          if (!shouldListen) {
            shouldListen = true;
            return;
          }
          handler(event);
        };
        const cleanup = [
          useEventListener(window2, "click", listener, { passive: true, capture }),
          useEventListener(window2, "pointerdown", (e) => {
            const el = unrefElement(target);
            if (el)
              shouldListen = !e.composedPath().includes(el) && !shouldIgnore(e);
          }, { passive: true }),
          detectIframe && useEventListener(window2, "blur", (event) => {
            var _a2;
            const el = unrefElement(target);
            if (((_a2 = window2.document.activeElement) == null ? void 0 : _a2.tagName) === "IFRAME" && !(el == null ? void 0 : el.contains(window2.document.activeElement)))
              handler(event);
          })
        ].filter(Boolean);
        const stop = () => cleanup.forEach((fn2) => fn2());
        return stop;
      }
      function useSupported(callback, sync = false) {
        const isSupported = vue.ref();
        const update = () => isSupported.value = Boolean(callback());
        update();
        tryOnMounted(update, sync);
        return isSupported;
      }
      const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
      const globalKey = "__vueuse_ssr_handlers__";
      _global[globalKey] = _global[globalKey] || {};
      var __getOwnPropSymbols$g = Object.getOwnPropertySymbols;
      var __hasOwnProp$g = Object.prototype.hasOwnProperty;
      var __propIsEnum$g = Object.prototype.propertyIsEnumerable;
      var __objRest$2 = (source, exclude) => {
        var target = {};
        for (var prop in source)
          if (__hasOwnProp$g.call(source, prop) && exclude.indexOf(prop) < 0)
            target[prop] = source[prop];
        if (source != null && __getOwnPropSymbols$g)
          for (var prop of __getOwnPropSymbols$g(source)) {
            if (exclude.indexOf(prop) < 0 && __propIsEnum$g.call(source, prop))
              target[prop] = source[prop];
          }
        return target;
      };
      function useResizeObserver(target, callback, options = {}) {
        const _a2 = options, { window: window2 = defaultWindow } = _a2, observerOptions = __objRest$2(_a2, ["window"]);
        let observer;
        const isSupported = useSupported(() => window2 && "ResizeObserver" in window2);
        const cleanup = () => {
          if (observer) {
            observer.disconnect();
            observer = void 0;
          }
        };
        const stopWatch = vue.watch(() => unrefElement(target), (el) => {
          cleanup();
          if (isSupported.value && window2 && el) {
            observer = new ResizeObserver(callback);
            observer.observe(el, observerOptions);
          }
        }, { immediate: true, flush: "post" });
        const stop = () => {
          cleanup();
          stopWatch();
        };
        tryOnScopeDispose(stop);
        return {
          isSupported,
          stop
        };
      }
      var __getOwnPropSymbols$8 = Object.getOwnPropertySymbols;
      var __hasOwnProp$8 = Object.prototype.hasOwnProperty;
      var __propIsEnum$8 = Object.prototype.propertyIsEnumerable;
      var __objRest$1 = (source, exclude) => {
        var target = {};
        for (var prop in source)
          if (__hasOwnProp$8.call(source, prop) && exclude.indexOf(prop) < 0)
            target[prop] = source[prop];
        if (source != null && __getOwnPropSymbols$8)
          for (var prop of __getOwnPropSymbols$8(source)) {
            if (exclude.indexOf(prop) < 0 && __propIsEnum$8.call(source, prop))
              target[prop] = source[prop];
          }
        return target;
      };
      function useMutationObserver(target, callback, options = {}) {
        const _a2 = options, { window: window2 = defaultWindow } = _a2, mutationOptions = __objRest$1(_a2, ["window"]);
        let observer;
        const isSupported = useSupported(() => window2 && "MutationObserver" in window2);
        const cleanup = () => {
          if (observer) {
            observer.disconnect();
            observer = void 0;
          }
        };
        const stopWatch = vue.watch(() => unrefElement(target), (el) => {
          cleanup();
          if (isSupported.value && window2 && el) {
            observer = new MutationObserver(callback);
            observer.observe(el, mutationOptions);
          }
        }, { immediate: true });
        const stop = () => {
          cleanup();
          stopWatch();
        };
        tryOnScopeDispose(stop);
        return {
          isSupported,
          stop
        };
      }
      var SwipeDirection;
      (function(SwipeDirection2) {
        SwipeDirection2["UP"] = "UP";
        SwipeDirection2["RIGHT"] = "RIGHT";
        SwipeDirection2["DOWN"] = "DOWN";
        SwipeDirection2["LEFT"] = "LEFT";
        SwipeDirection2["NONE"] = "NONE";
      })(SwipeDirection || (SwipeDirection = {}));
      var __defProp = Object.defineProperty;
      var __getOwnPropSymbols = Object.getOwnPropertySymbols;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __propIsEnum = Object.prototype.propertyIsEnumerable;
      var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp.call(b, prop))
            __defNormalProp(a, prop, b[prop]);
        if (__getOwnPropSymbols)
          for (var prop of __getOwnPropSymbols(b)) {
            if (__propIsEnum.call(b, prop))
              __defNormalProp(a, prop, b[prop]);
          }
        return a;
      };
      const _TransitionPresets = {
        easeInSine: [0.12, 0, 0.39, 0],
        easeOutSine: [0.61, 1, 0.88, 1],
        easeInOutSine: [0.37, 0, 0.63, 1],
        easeInQuad: [0.11, 0, 0.5, 0],
        easeOutQuad: [0.5, 1, 0.89, 1],
        easeInOutQuad: [0.45, 0, 0.55, 1],
        easeInCubic: [0.32, 0, 0.67, 0],
        easeOutCubic: [0.33, 1, 0.68, 1],
        easeInOutCubic: [0.65, 0, 0.35, 1],
        easeInQuart: [0.5, 0, 0.75, 0],
        easeOutQuart: [0.25, 1, 0.5, 1],
        easeInOutQuart: [0.76, 0, 0.24, 1],
        easeInQuint: [0.64, 0, 0.78, 0],
        easeOutQuint: [0.22, 1, 0.36, 1],
        easeInOutQuint: [0.83, 0, 0.17, 1],
        easeInExpo: [0.7, 0, 0.84, 0],
        easeOutExpo: [0.16, 1, 0.3, 1],
        easeInOutExpo: [0.87, 0, 0.13, 1],
        easeInCirc: [0.55, 0, 1, 0.45],
        easeOutCirc: [0, 0.55, 0.45, 1],
        easeInOutCirc: [0.85, 0, 0.15, 1],
        easeInBack: [0.36, 0, 0.66, -0.56],
        easeOutBack: [0.34, 1.56, 0.64, 1],
        easeInOutBack: [0.68, -0.6, 0.32, 1.6]
      };
      __spreadValues({
        linear: identity$1
      }, _TransitionPresets);
      const isFirefox = () => isClient && /firefox/i.test(window.navigator.userAgent);
      /**
      * @vue/shared v3.5.13
      * (c) 2018-present Yuxi (Evan) You and Vue contributors
      * @license MIT
      **/
      const NOOP = () => {
      };
      const hasOwnProperty$c = Object.prototype.hasOwnProperty;
      const hasOwn = (val, key) => hasOwnProperty$c.call(val, key);
      const isArray$1 = Array.isArray;
      const isFunction$1 = (val) => typeof val === "function";
      const isString = (val) => typeof val === "string";
      const isObject$1 = (val) => val !== null && typeof val === "object";
      const isPromise = (val) => {
        return (isObject$1(val) || isFunction$1(val)) && isFunction$1(val.then) && isFunction$1(val.catch);
      };
      const objectToString$1 = Object.prototype.toString;
      const toTypeString = (value) => objectToString$1.call(value);
      const isPlainObject = (val) => toTypeString(val) === "[object Object]";
      const cacheStringFunction = (fn2) => {
        const cache = /* @__PURE__ */ Object.create(null);
        return (str) => {
          const hit = cache[str];
          return hit || (cache[str] = fn2(str));
        };
      };
      const camelizeRE = /-(\w)/g;
      const camelize = cacheStringFunction(
        (str) => {
          return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
        }
      );
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      var Symbol$1 = root.Symbol;
      var objectProto$e = Object.prototype;
      var hasOwnProperty$b = objectProto$e.hasOwnProperty;
      var nativeObjectToString$1 = objectProto$e.toString;
      var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
      function getRawTag(value) {
        var isOwn = hasOwnProperty$b.call(value, symToStringTag$1), tag = value[symToStringTag$1];
        try {
          value[symToStringTag$1] = void 0;
          var unmasked = true;
        } catch (e) {
        }
        var result = nativeObjectToString$1.call(value);
        if (unmasked) {
          if (isOwn) {
            value[symToStringTag$1] = tag;
          } else {
            delete value[symToStringTag$1];
          }
        }
        return result;
      }
      var objectProto$d = Object.prototype;
      var nativeObjectToString = objectProto$d.toString;
      function objectToString(value) {
        return nativeObjectToString.call(value);
      }
      var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
      var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
      function baseGetTag(value) {
        if (value == null) {
          return value === void 0 ? undefinedTag : nullTag;
        }
        return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
      }
      function isObjectLike(value) {
        return value != null && typeof value == "object";
      }
      var symbolTag$3 = "[object Symbol]";
      function isSymbol(value) {
        return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$3;
      }
      function arrayMap(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length, result = Array(length);
        while (++index < length) {
          result[index] = iteratee(array[index], index, array);
        }
        return result;
      }
      var isArray = Array.isArray;
      var INFINITY$1 = 1 / 0;
      var symbolProto$2 = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto$2 ? symbolProto$2.toString : void 0;
      function baseToString(value) {
        if (typeof value == "string") {
          return value;
        }
        if (isArray(value)) {
          return arrayMap(value, baseToString) + "";
        }
        if (isSymbol(value)) {
          return symbolToString ? symbolToString.call(value) : "";
        }
        var result = value + "";
        return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
      }
      var reWhitespace = /\s/;
      function trimmedEndIndex(string2) {
        var index = string2.length;
        while (index-- && reWhitespace.test(string2.charAt(index))) {
        }
        return index;
      }
      var reTrimStart = /^\s+/;
      function baseTrim(string2) {
        return string2 ? string2.slice(0, trimmedEndIndex(string2) + 1).replace(reTrimStart, "") : string2;
      }
      function isObject(value) {
        var type = typeof value;
        return value != null && (type == "object" || type == "function");
      }
      var NAN = 0 / 0;
      var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
      var reIsBinary = /^0b[01]+$/i;
      var reIsOctal = /^0o[0-7]+$/i;
      var freeParseInt = parseInt;
      function toNumber(value) {
        if (typeof value == "number") {
          return value;
        }
        if (isSymbol(value)) {
          return NAN;
        }
        if (isObject(value)) {
          var other = typeof value.valueOf == "function" ? value.valueOf() : value;
          value = isObject(other) ? other + "" : other;
        }
        if (typeof value != "string") {
          return value === 0 ? value : +value;
        }
        value = baseTrim(value);
        var isBinary = reIsBinary.test(value);
        return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
      }
      function identity(value) {
        return value;
      }
      var asyncTag = "[object AsyncFunction]", funcTag$2 = "[object Function]", genTag$1 = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
      function isFunction(value) {
        if (!isObject(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
      }
      var coreJsData = root["__core-js_shared__"];
      var maskSrcKey = function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      }();
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }
      var funcProto$1 = Function.prototype;
      var funcToString$1 = funcProto$1.toString;
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString$1.call(func);
          } catch (e) {
          }
          try {
            return func + "";
          } catch (e) {
          }
        }
        return "";
      }
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var funcProto = Function.prototype, objectProto$c = Object.prototype;
      var funcToString = funcProto.toString;
      var hasOwnProperty$a = objectProto$c.hasOwnProperty;
      var reIsNative = RegExp(
        "^" + funcToString.call(hasOwnProperty$a).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      );
      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      function getValue$1(object, key) {
        return object == null ? void 0 : object[key];
      }
      function getNative(object, key) {
        var value = getValue$1(object, key);
        return baseIsNative(value) ? value : void 0;
      }
      var WeakMap = getNative(root, "WeakMap");
      var objectCreate = Object.create;
      var baseCreate = /* @__PURE__ */ function() {
        function object() {
        }
        return function(proto) {
          if (!isObject(proto)) {
            return {};
          }
          if (objectCreate) {
            return objectCreate(proto);
          }
          object.prototype = proto;
          var result = new object();
          object.prototype = void 0;
          return result;
        };
      }();
      function apply(func, thisArg, args) {
        switch (args.length) {
          case 0:
            return func.call(thisArg);
          case 1:
            return func.call(thisArg, args[0]);
          case 2:
            return func.call(thisArg, args[0], args[1]);
          case 3:
            return func.call(thisArg, args[0], args[1], args[2]);
        }
        return func.apply(thisArg, args);
      }
      function copyArray(source, array) {
        var index = -1, length = source.length;
        array || (array = Array(length));
        while (++index < length) {
          array[index] = source[index];
        }
        return array;
      }
      var HOT_COUNT = 800, HOT_SPAN = 16;
      var nativeNow = Date.now;
      function shortOut(func) {
        var count = 0, lastCalled = 0;
        return function() {
          var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
          lastCalled = stamp;
          if (remaining > 0) {
            if (++count >= HOT_COUNT) {
              return arguments[0];
            }
          } else {
            count = 0;
          }
          return func.apply(void 0, arguments);
        };
      }
      function constant(value) {
        return function() {
          return value;
        };
      }
      var defineProperty = function() {
        try {
          var func = getNative(Object, "defineProperty");
          func({}, "", {});
          return func;
        } catch (e) {
        }
      }();
      var baseSetToString = !defineProperty ? identity : function(func, string2) {
        return defineProperty(func, "toString", {
          "configurable": true,
          "enumerable": false,
          "value": constant(string2),
          "writable": true
        });
      };
      var setToString = shortOut(baseSetToString);
      function arrayEach(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (iteratee(array[index], index, array) === false) {
            break;
          }
        }
        return array;
      }
      function baseFindIndex(array, predicate, fromIndex, fromRight) {
        array.length;
        var index = fromIndex + 1;
        while (index--) {
          if (predicate(array[index], index, array)) {
            return index;
          }
        }
        return -1;
      }
      var MAX_SAFE_INTEGER$1 = 9007199254740991;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      function isIndex(value, length) {
        var type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER$1 : length;
        return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
      }
      function baseAssignValue(object, key, value) {
        if (key == "__proto__" && defineProperty) {
          defineProperty(object, key, {
            "configurable": true,
            "enumerable": true,
            "value": value,
            "writable": true
          });
        } else {
          object[key] = value;
        }
      }
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      var objectProto$b = Object.prototype;
      var hasOwnProperty$9 = objectProto$b.hasOwnProperty;
      function assignValue(object, key, value) {
        var objValue = object[key];
        if (!(hasOwnProperty$9.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
          baseAssignValue(object, key, value);
        }
      }
      function copyObject(source, props, object, customizer) {
        var isNew = !object;
        object || (object = {});
        var index = -1, length = props.length;
        while (++index < length) {
          var key = props[index];
          var newValue = void 0;
          if (newValue === void 0) {
            newValue = source[key];
          }
          if (isNew) {
            baseAssignValue(object, key, newValue);
          } else {
            assignValue(object, key, newValue);
          }
        }
        return object;
      }
      var nativeMax$1 = Math.max;
      function overRest(func, start, transform) {
        start = nativeMax$1(start === void 0 ? func.length - 1 : start, 0);
        return function() {
          var args = arguments, index = -1, length = nativeMax$1(args.length - start, 0), array = Array(length);
          while (++index < length) {
            array[index] = args[start + index];
          }
          index = -1;
          var otherArgs = Array(start + 1);
          while (++index < start) {
            otherArgs[index] = args[index];
          }
          otherArgs[start] = transform(array);
          return apply(func, this, otherArgs);
        };
      }
      var MAX_SAFE_INTEGER = 9007199254740991;
      function isLength(value) {
        return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
      }
      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction(value);
      }
      var objectProto$a = Object.prototype;
      function isPrototype(value) {
        var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$a;
        return value === proto;
      }
      function baseTimes(n, iteratee) {
        var index = -1, result = Array(n);
        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      }
      var argsTag$3 = "[object Arguments]";
      function baseIsArguments(value) {
        return isObjectLike(value) && baseGetTag(value) == argsTag$3;
      }
      var objectProto$9 = Object.prototype;
      var hasOwnProperty$8 = objectProto$9.hasOwnProperty;
      var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;
      var isArguments = baseIsArguments(/* @__PURE__ */ function() {
        return arguments;
      }()) ? baseIsArguments : function(value) {
        return isObjectLike(value) && hasOwnProperty$8.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
      };
      function stubFalse() {
        return false;
      }
      var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
      var Buffer$1 = moduleExports$2 ? root.Buffer : void 0;
      var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0;
      var isBuffer = nativeIsBuffer || stubFalse;
      var argsTag$2 = "[object Arguments]", arrayTag$2 = "[object Array]", boolTag$3 = "[object Boolean]", dateTag$3 = "[object Date]", errorTag$2 = "[object Error]", funcTag$1 = "[object Function]", mapTag$5 = "[object Map]", numberTag$3 = "[object Number]", objectTag$3 = "[object Object]", regexpTag$3 = "[object RegExp]", setTag$5 = "[object Set]", stringTag$3 = "[object String]", weakMapTag$2 = "[object WeakMap]";
      var arrayBufferTag$3 = "[object ArrayBuffer]", dataViewTag$4 = "[object DataView]", float32Tag$2 = "[object Float32Array]", float64Tag$2 = "[object Float64Array]", int8Tag$2 = "[object Int8Array]", int16Tag$2 = "[object Int16Array]", int32Tag$2 = "[object Int32Array]", uint8Tag$2 = "[object Uint8Array]", uint8ClampedTag$2 = "[object Uint8ClampedArray]", uint16Tag$2 = "[object Uint16Array]", uint32Tag$2 = "[object Uint32Array]";
      var typedArrayTags = {};
      typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
      typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] = typedArrayTags[arrayBufferTag$3] = typedArrayTags[boolTag$3] = typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$3] = typedArrayTags[errorTag$2] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$5] = typedArrayTags[numberTag$3] = typedArrayTags[objectTag$3] = typedArrayTags[regexpTag$3] = typedArrayTags[setTag$5] = typedArrayTags[stringTag$3] = typedArrayTags[weakMapTag$2] = false;
      function baseIsTypedArray(value) {
        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
      }
      function baseUnary(func) {
        return function(value) {
          return func(value);
        };
      }
      var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
      var freeProcess = moduleExports$1 && freeGlobal.process;
      var nodeUtil = function() {
        try {
          var types2 = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
          if (types2) {
            return types2;
          }
          return freeProcess && freeProcess.binding && freeProcess.binding("util");
        } catch (e) {
        }
      }();
      var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
      var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
      var objectProto$8 = Object.prototype;
      var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
      function arrayLikeKeys(value, inherited) {
        var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
        for (var key in value) {
          if ((inherited || hasOwnProperty$7.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
          (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
          isIndex(key, length)))) {
            result.push(key);
          }
        }
        return result;
      }
      function overArg(func, transform) {
        return function(arg) {
          return func(transform(arg));
        };
      }
      var nativeKeys = overArg(Object.keys, Object);
      var objectProto$7 = Object.prototype;
      var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys(object);
        }
        var result = [];
        for (var key in Object(object)) {
          if (hasOwnProperty$6.call(object, key) && key != "constructor") {
            result.push(key);
          }
        }
        return result;
      }
      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }
      function nativeKeysIn(object) {
        var result = [];
        if (object != null) {
          for (var key in Object(object)) {
            result.push(key);
          }
        }
        return result;
      }
      var objectProto$6 = Object.prototype;
      var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
      function baseKeysIn(object) {
        if (!isObject(object)) {
          return nativeKeysIn(object);
        }
        var isProto = isPrototype(object), result = [];
        for (var key in object) {
          if (!(key == "constructor" && (isProto || !hasOwnProperty$5.call(object, key)))) {
            result.push(key);
          }
        }
        return result;
      }
      function keysIn(object) {
        return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
      }
      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
      function isKey(value, object) {
        if (isArray(value)) {
          return false;
        }
        var type = typeof value;
        if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
          return true;
        }
        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
      }
      var nativeCreate = getNative(Object, "create");
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }
      function hashDelete(key) {
        var result = this.has(key) && delete this.__data__[key];
        this.size -= result ? 1 : 0;
        return result;
      }
      var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
      var objectProto$5 = Object.prototype;
      var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result = data[key];
          return result === HASH_UNDEFINED$2 ? void 0 : result;
        }
        return hasOwnProperty$4.call(data, key) ? data[key] : void 0;
      }
      var objectProto$4 = Object.prototype;
      var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== void 0 : hasOwnProperty$3.call(data, key);
      }
      var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
      function hashSet(key, value) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
        return this;
      }
      function Hash(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype["delete"] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function listCacheClear() {
        this.__data__ = [];
        this.size = 0;
      }
      function assocIndexOf(array, key) {
        var length = array.length;
        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
      var arrayProto = Array.prototype;
      var splice = arrayProto.splice;
      function listCacheDelete(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index, 1);
        }
        --this.size;
        return true;
      }
      function listCacheGet(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        return index < 0 ? void 0 : data[index][1];
      }
      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }
      function listCacheSet(key, value) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          ++this.size;
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }
      function ListCache(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype["delete"] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      var Map$1 = getNative(root, "Map");
      function mapCacheClear() {
        this.size = 0;
        this.__data__ = {
          "hash": new Hash(),
          "map": new (Map$1 || ListCache)(),
          "string": new Hash()
        };
      }
      function isKeyable(value) {
        var type = typeof value;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
      }
      function getMapData(map, key) {
        var data = map.__data__;
        return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
      }
      function mapCacheDelete(key) {
        var result = getMapData(this, key)["delete"](key);
        this.size -= result ? 1 : 0;
        return result;
      }
      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }
      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }
      function mapCacheSet(key, value) {
        var data = getMapData(this, key), size = data.size;
        data.set(key, value);
        this.size += data.size == size ? 0 : 1;
        return this;
      }
      function MapCache(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype["delete"] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      var FUNC_ERROR_TEXT$1 = "Expected a function";
      function memoize(func, resolver) {
        if (typeof func != "function" || resolver != null && typeof resolver != "function") {
          throw new TypeError(FUNC_ERROR_TEXT$1);
        }
        var memoized = function() {
          var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
          if (cache.has(key)) {
            return cache.get(key);
          }
          var result = func.apply(this, args);
          memoized.cache = cache.set(key, result) || cache;
          return result;
        };
        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      }
      memoize.Cache = MapCache;
      var MAX_MEMOIZE_SIZE = 500;
      function memoizeCapped(func) {
        var result = memoize(func, function(key) {
          if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear();
          }
          return key;
        });
        var cache = result.cache;
        return result;
      }
      var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = memoizeCapped(function(string2) {
        var result = [];
        if (string2.charCodeAt(0) === 46) {
          result.push("");
        }
        string2.replace(rePropName, function(match, number, quote, subString) {
          result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
        });
        return result;
      });
      function toString(value) {
        return value == null ? "" : baseToString(value);
      }
      function castPath(value, object) {
        if (isArray(value)) {
          return value;
        }
        return isKey(value, object) ? [value] : stringToPath(toString(value));
      }
      var INFINITY = 1 / 0;
      function toKey(value) {
        if (typeof value == "string" || isSymbol(value)) {
          return value;
        }
        var result = value + "";
        return result == "0" && 1 / value == -INFINITY ? "-0" : result;
      }
      function baseGet(object, path) {
        path = castPath(path, object);
        var index = 0, length = path.length;
        while (object != null && index < length) {
          object = object[toKey(path[index++])];
        }
        return index && index == length ? object : void 0;
      }
      function get(object, path, defaultValue) {
        var result = object == null ? void 0 : baseGet(object, path);
        return result === void 0 ? defaultValue : result;
      }
      function arrayPush(array, values) {
        var index = -1, length = values.length, offset = array.length;
        while (++index < length) {
          array[offset + index] = values[index];
        }
        return array;
      }
      var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : void 0;
      function isFlattenable(value) {
        return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
      }
      function baseFlatten(array, depth, predicate, isStrict, result) {
        var index = -1, length = array.length;
        predicate || (predicate = isFlattenable);
        result || (result = []);
        while (++index < length) {
          var value = array[index];
          if (predicate(value)) {
            {
              arrayPush(result, value);
            }
          } else {
            result[result.length] = value;
          }
        }
        return result;
      }
      function flatten(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array) : [];
      }
      function flatRest(func) {
        return setToString(overRest(func, void 0, flatten), func + "");
      }
      var getPrototype = overArg(Object.getPrototypeOf, Object);
      function castArray() {
        if (!arguments.length) {
          return [];
        }
        var value = arguments[0];
        return isArray(value) ? value : [value];
      }
      function stackClear() {
        this.__data__ = new ListCache();
        this.size = 0;
      }
      function stackDelete(key) {
        var data = this.__data__, result = data["delete"](key);
        this.size = data.size;
        return result;
      }
      function stackGet(key) {
        return this.__data__.get(key);
      }
      function stackHas(key) {
        return this.__data__.has(key);
      }
      var LARGE_ARRAY_SIZE = 200;
      function stackSet(key, value) {
        var data = this.__data__;
        if (data instanceof ListCache) {
          var pairs = data.__data__;
          if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([key, value]);
            this.size = ++data.size;
            return this;
          }
          data = this.__data__ = new MapCache(pairs);
        }
        data.set(key, value);
        this.size = data.size;
        return this;
      }
      function Stack(entries) {
        var data = this.__data__ = new ListCache(entries);
        this.size = data.size;
      }
      Stack.prototype.clear = stackClear;
      Stack.prototype["delete"] = stackDelete;
      Stack.prototype.get = stackGet;
      Stack.prototype.has = stackHas;
      Stack.prototype.set = stackSet;
      function baseAssign(object, source) {
        return object && copyObject(source, keys(source), object);
      }
      function baseAssignIn(object, source) {
        return object && copyObject(source, keysIn(source), object);
      }
      var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var Buffer2 = moduleExports ? root.Buffer : void 0, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
      function cloneBuffer(buffer, isDeep) {
        var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
        buffer.copy(result);
        return result;
      }
      function arrayFilter(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
        while (++index < length) {
          var value = array[index];
          if (predicate(value, index, array)) {
            result[resIndex++] = value;
          }
        }
        return result;
      }
      function stubArray() {
        return [];
      }
      var objectProto$3 = Object.prototype;
      var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;
      var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
      var getSymbols = !nativeGetSymbols$1 ? stubArray : function(object) {
        if (object == null) {
          return [];
        }
        object = Object(object);
        return arrayFilter(nativeGetSymbols$1(object), function(symbol) {
          return propertyIsEnumerable.call(object, symbol);
        });
      };
      function copySymbols(source, object) {
        return copyObject(source, getSymbols(source), object);
      }
      var nativeGetSymbols = Object.getOwnPropertySymbols;
      var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
        var result = [];
        while (object) {
          arrayPush(result, getSymbols(object));
          object = getPrototype(object);
        }
        return result;
      };
      function copySymbolsIn(source, object) {
        return copyObject(source, getSymbolsIn(source), object);
      }
      function baseGetAllKeys(object, keysFunc, symbolsFunc) {
        var result = keysFunc(object);
        return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
      }
      function getAllKeys(object) {
        return baseGetAllKeys(object, keys, getSymbols);
      }
      var DataView = getNative(root, "DataView");
      var Promise$1 = getNative(root, "Promise");
      var Set$1 = getNative(root, "Set");
      var mapTag$4 = "[object Map]", objectTag$2 = "[object Object]", promiseTag = "[object Promise]", setTag$4 = "[object Set]", weakMapTag$1 = "[object WeakMap]";
      var dataViewTag$3 = "[object DataView]";
      var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map$1), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set$1), weakMapCtorString = toSource(WeakMap);
      var getTag = baseGetTag;
      if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$3 || Map$1 && getTag(new Map$1()) != mapTag$4 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set$1 && getTag(new Set$1()) != setTag$4 || WeakMap && getTag(new WeakMap()) != weakMapTag$1) {
        getTag = function(value) {
          var result = baseGetTag(value), Ctor = result == objectTag$2 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString:
                return dataViewTag$3;
              case mapCtorString:
                return mapTag$4;
              case promiseCtorString:
                return promiseTag;
              case setCtorString:
                return setTag$4;
              case weakMapCtorString:
                return weakMapTag$1;
            }
          }
          return result;
        };
      }
      var objectProto$2 = Object.prototype;
      var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
      function initCloneArray(array) {
        var length = array.length, result = new array.constructor(length);
        if (length && typeof array[0] == "string" && hasOwnProperty$2.call(array, "index")) {
          result.index = array.index;
          result.input = array.input;
        }
        return result;
      }
      var Uint8Array$1 = root.Uint8Array;
      function cloneArrayBuffer(arrayBuffer) {
        var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
        return result;
      }
      function cloneDataView(dataView, isDeep) {
        var buffer = dataView.buffer;
        return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
      }
      var reFlags = /\w*$/;
      function cloneRegExp(regexp) {
        var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
        result.lastIndex = regexp.lastIndex;
        return result;
      }
      var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
      function cloneSymbol(symbol) {
        return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
      }
      function cloneTypedArray(typedArray, isDeep) {
        var buffer = typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
      }
      var boolTag$2 = "[object Boolean]", dateTag$2 = "[object Date]", mapTag$3 = "[object Map]", numberTag$2 = "[object Number]", regexpTag$2 = "[object RegExp]", setTag$3 = "[object Set]", stringTag$2 = "[object String]", symbolTag$2 = "[object Symbol]";
      var arrayBufferTag$2 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]", float32Tag$1 = "[object Float32Array]", float64Tag$1 = "[object Float64Array]", int8Tag$1 = "[object Int8Array]", int16Tag$1 = "[object Int16Array]", int32Tag$1 = "[object Int32Array]", uint8Tag$1 = "[object Uint8Array]", uint8ClampedTag$1 = "[object Uint8ClampedArray]", uint16Tag$1 = "[object Uint16Array]", uint32Tag$1 = "[object Uint32Array]";
      function initCloneByTag(object, tag, isDeep) {
        var Ctor = object.constructor;
        switch (tag) {
          case arrayBufferTag$2:
            return cloneArrayBuffer(object);
          case boolTag$2:
          case dateTag$2:
            return new Ctor(+object);
          case dataViewTag$2:
            return cloneDataView(object);
          case float32Tag$1:
          case float64Tag$1:
          case int8Tag$1:
          case int16Tag$1:
          case int32Tag$1:
          case uint8Tag$1:
          case uint8ClampedTag$1:
          case uint16Tag$1:
          case uint32Tag$1:
            return cloneTypedArray(object);
          case mapTag$3:
            return new Ctor();
          case numberTag$2:
          case stringTag$2:
            return new Ctor(object);
          case regexpTag$2:
            return cloneRegExp(object);
          case setTag$3:
            return new Ctor();
          case symbolTag$2:
            return cloneSymbol(object);
        }
      }
      function initCloneObject(object) {
        return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
      }
      var mapTag$2 = "[object Map]";
      function baseIsMap(value) {
        return isObjectLike(value) && getTag(value) == mapTag$2;
      }
      var nodeIsMap = nodeUtil && nodeUtil.isMap;
      var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
      var setTag$2 = "[object Set]";
      function baseIsSet(value) {
        return isObjectLike(value) && getTag(value) == setTag$2;
      }
      var nodeIsSet = nodeUtil && nodeUtil.isSet;
      var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
      var CLONE_FLAT_FLAG = 2;
      var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag$1 = "[object Map]", numberTag$1 = "[object Number]", objectTag$1 = "[object Object]", regexpTag$1 = "[object RegExp]", setTag$1 = "[object Set]", stringTag$1 = "[object String]", symbolTag$1 = "[object Symbol]", weakMapTag = "[object WeakMap]";
      var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
      var cloneableTags = {};
      cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$1] = cloneableTags[dataViewTag$1] = cloneableTags[boolTag$1] = cloneableTags[dateTag$1] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag$1] = cloneableTags[numberTag$1] = cloneableTags[objectTag$1] = cloneableTags[regexpTag$1] = cloneableTags[setTag$1] = cloneableTags[stringTag$1] = cloneableTags[symbolTag$1] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
      cloneableTags[errorTag$1] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
      function baseClone(value, bitmask, customizer, key, object, stack) {
        var result, isFlat = bitmask & CLONE_FLAT_FLAG;
        if (result !== void 0) {
          return result;
        }
        if (!isObject(value)) {
          return value;
        }
        var isArr = isArray(value);
        if (isArr) {
          result = initCloneArray(value);
          {
            return copyArray(value, result);
          }
        } else {
          var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
          if (isBuffer(value)) {
            return cloneBuffer(value);
          }
          if (tag == objectTag$1 || tag == argsTag$1 || isFunc && !object) {
            result = isFunc ? {} : initCloneObject(value);
            {
              return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
            }
          } else {
            if (!cloneableTags[tag]) {
              return object ? value : {};
            }
            result = initCloneByTag(value, tag);
          }
        }
        stack || (stack = new Stack());
        var stacked = stack.get(value);
        if (stacked) {
          return stacked;
        }
        stack.set(value, result);
        if (isSet(value)) {
          value.forEach(function(subValue) {
            result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
          });
        } else if (isMap(value)) {
          value.forEach(function(subValue, key2) {
            result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
          });
        }
        var keysFunc = getAllKeys ;
        var props = isArr ? void 0 : keysFunc(value);
        arrayEach(props || value, function(subValue, key2) {
          if (props) {
            key2 = subValue;
            subValue = value[key2];
          }
          assignValue(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
        });
        return result;
      }
      var CLONE_SYMBOLS_FLAG = 4;
      function clone(value) {
        return baseClone(value, CLONE_SYMBOLS_FLAG);
      }
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      function setCacheAdd(value) {
        this.__data__.set(value, HASH_UNDEFINED);
        return this;
      }
      function setCacheHas(value) {
        return this.__data__.has(value);
      }
      function SetCache(values) {
        var index = -1, length = values == null ? 0 : values.length;
        this.__data__ = new MapCache();
        while (++index < length) {
          this.add(values[index]);
        }
      }
      SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
      SetCache.prototype.has = setCacheHas;
      function arraySome(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (predicate(array[index], index, array)) {
            return true;
          }
        }
        return false;
      }
      function cacheHas(cache, key) {
        return cache.has(key);
      }
      var COMPARE_PARTIAL_FLAG$5 = 1, COMPARE_UNORDERED_FLAG$3 = 2;
      function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array.length, othLength = other.length;
        if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
          return false;
        }
        var arrStacked = stack.get(array);
        var othStacked = stack.get(other);
        if (arrStacked && othStacked) {
          return arrStacked == other && othStacked == array;
        }
        var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
        stack.set(array, other);
        stack.set(other, array);
        while (++index < arrLength) {
          var arrValue = array[index], othValue = other[index];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
          }
          if (compared !== void 0) {
            if (compared) {
              continue;
            }
            result = false;
            break;
          }
          if (seen) {
            if (!arraySome(other, function(othValue2, othIndex) {
              if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                return seen.push(othIndex);
              }
            })) {
              result = false;
              break;
            }
          } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
            result = false;
            break;
          }
        }
        stack["delete"](array);
        stack["delete"](other);
        return result;
      }
      function mapToArray(map) {
        var index = -1, result = Array(map.size);
        map.forEach(function(value, key) {
          result[++index] = [key, value];
        });
        return result;
      }
      function setToArray(set2) {
        var index = -1, result = Array(set2.size);
        set2.forEach(function(value) {
          result[++index] = value;
        });
        return result;
      }
      var COMPARE_PARTIAL_FLAG$4 = 1, COMPARE_UNORDERED_FLAG$2 = 2;
      var boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]";
      var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]";
      var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
      function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
        switch (tag) {
          case dataViewTag:
            if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
              return false;
            }
            object = object.buffer;
            other = other.buffer;
          case arrayBufferTag:
            if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array$1(object), new Uint8Array$1(other))) {
              return false;
            }
            return true;
          case boolTag:
          case dateTag:
          case numberTag:
            return eq(+object, +other);
          case errorTag:
            return object.name == other.name && object.message == other.message;
          case regexpTag:
          case stringTag:
            return object == other + "";
          case mapTag:
            var convert = mapToArray;
          case setTag:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
            convert || (convert = setToArray);
            if (object.size != other.size && !isPartial) {
              return false;
            }
            var stacked = stack.get(object);
            if (stacked) {
              return stacked == other;
            }
            bitmask |= COMPARE_UNORDERED_FLAG$2;
            stack.set(object, other);
            var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
            stack["delete"](object);
            return result;
          case symbolTag:
            if (symbolValueOf) {
              return symbolValueOf.call(object) == symbolValueOf.call(other);
            }
        }
        return false;
      }
      var COMPARE_PARTIAL_FLAG$3 = 1;
      var objectProto$1 = Object.prototype;
      var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
      function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
        if (objLength != othLength && !isPartial) {
          return false;
        }
        var index = objLength;
        while (index--) {
          var key = objProps[index];
          if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) {
            return false;
          }
        }
        var objStacked = stack.get(object);
        var othStacked = stack.get(other);
        if (objStacked && othStacked) {
          return objStacked == other && othStacked == object;
        }
        var result = true;
        stack.set(object, other);
        stack.set(other, object);
        var skipCtor = isPartial;
        while (++index < objLength) {
          key = objProps[index];
          var objValue = object[key], othValue = other[key];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
          }
          if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
            result = false;
            break;
          }
          skipCtor || (skipCtor = key == "constructor");
        }
        if (result && !skipCtor) {
          var objCtor = object.constructor, othCtor = other.constructor;
          if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
            result = false;
          }
        }
        stack["delete"](object);
        stack["delete"](other);
        return result;
      }
      var COMPARE_PARTIAL_FLAG$2 = 1;
      var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
      var objectProto = Object.prototype;
      var hasOwnProperty = objectProto.hasOwnProperty;
      function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
        var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
        objTag = objTag == argsTag ? objectTag : objTag;
        othTag = othTag == argsTag ? objectTag : othTag;
        var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
        if (isSameTag && isBuffer(object)) {
          if (!isBuffer(other)) {
            return false;
          }
          objIsArr = true;
          objIsObj = false;
        }
        if (isSameTag && !objIsObj) {
          stack || (stack = new Stack());
          return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
        }
        if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
          var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
          if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
            stack || (stack = new Stack());
            return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
          }
        }
        if (!isSameTag) {
          return false;
        }
        stack || (stack = new Stack());
        return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
      }
      function baseIsEqual(value, other, bitmask, customizer, stack) {
        if (value === other) {
          return true;
        }
        if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
          return value !== value && other !== other;
        }
        return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
      }
      var COMPARE_PARTIAL_FLAG$1 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
      function baseIsMatch(object, source, matchData, customizer) {
        var index = matchData.length, length = index;
        if (object == null) {
          return !length;
        }
        object = Object(object);
        while (index--) {
          var data = matchData[index];
          if (data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
            return false;
          }
        }
        while (++index < length) {
          data = matchData[index];
          var key = data[0], objValue = object[key], srcValue = data[1];
          if (data[2]) {
            if (objValue === void 0 && !(key in object)) {
              return false;
            }
          } else {
            var stack = new Stack();
            var result;
            if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) {
              return false;
            }
          }
        }
        return true;
      }
      function isStrictComparable(value) {
        return value === value && !isObject(value);
      }
      function getMatchData(object) {
        var result = keys(object), length = result.length;
        while (length--) {
          var key = result[length], value = object[key];
          result[length] = [key, value, isStrictComparable(value)];
        }
        return result;
      }
      function matchesStrictComparable(key, srcValue) {
        return function(object) {
          if (object == null) {
            return false;
          }
          return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
        };
      }
      function baseMatches(source) {
        var matchData = getMatchData(source);
        if (matchData.length == 1 && matchData[0][2]) {
          return matchesStrictComparable(matchData[0][0], matchData[0][1]);
        }
        return function(object) {
          return object === source || baseIsMatch(object, source, matchData);
        };
      }
      function baseHasIn(object, key) {
        return object != null && key in Object(object);
      }
      function hasPath(object, path, hasFunc) {
        path = castPath(path, object);
        var index = -1, length = path.length, result = false;
        while (++index < length) {
          var key = toKey(path[index]);
          if (!(result = object != null && hasFunc(object, key))) {
            break;
          }
          object = object[key];
        }
        if (result || ++index != length) {
          return result;
        }
        length = object == null ? 0 : object.length;
        return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
      }
      function hasIn(object, path) {
        return object != null && hasPath(object, path, baseHasIn);
      }
      var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
      function baseMatchesProperty(path, srcValue) {
        if (isKey(path) && isStrictComparable(srcValue)) {
          return matchesStrictComparable(toKey(path), srcValue);
        }
        return function(object) {
          var objValue = get(object, path);
          return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
        };
      }
      function baseProperty(key) {
        return function(object) {
          return object == null ? void 0 : object[key];
        };
      }
      function basePropertyDeep(path) {
        return function(object) {
          return baseGet(object, path);
        };
      }
      function property(path) {
        return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
      }
      function baseIteratee(value) {
        if (typeof value == "function") {
          return value;
        }
        if (value == null) {
          return identity;
        }
        if (typeof value == "object") {
          return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
        }
        return property(value);
      }
      var now = function() {
        return root.Date.now();
      };
      var FUNC_ERROR_TEXT = "Expected a function";
      var nativeMax = Math.max, nativeMin = Math.min;
      function debounce(func, wait, options) {
        var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
        if (typeof func != "function") {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        wait = toNumber(wait) || 0;
        if (isObject(options)) {
          leading = !!options.leading;
          maxing = "maxWait" in options;
          maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        function invokeFunc(time) {
          var args = lastArgs, thisArg = lastThis;
          lastArgs = lastThis = void 0;
          lastInvokeTime = time;
          result = func.apply(thisArg, args);
          return result;
        }
        function leadingEdge(time) {
          lastInvokeTime = time;
          timerId = setTimeout(timerExpired, wait);
          return leading ? invokeFunc(time) : result;
        }
        function remainingWait(time) {
          var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
          return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
        }
        function shouldInvoke(time) {
          var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
          return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
        }
        function timerExpired() {
          var time = now();
          if (shouldInvoke(time)) {
            return trailingEdge(time);
          }
          timerId = setTimeout(timerExpired, remainingWait(time));
        }
        function trailingEdge(time) {
          timerId = void 0;
          if (trailing && lastArgs) {
            return invokeFunc(time);
          }
          lastArgs = lastThis = void 0;
          return result;
        }
        function cancel() {
          if (timerId !== void 0) {
            clearTimeout(timerId);
          }
          lastInvokeTime = 0;
          lastArgs = lastCallTime = lastThis = timerId = void 0;
        }
        function flush() {
          return timerId === void 0 ? result : trailingEdge(now());
        }
        function debounced() {
          var time = now(), isInvoking = shouldInvoke(time);
          lastArgs = arguments;
          lastThis = this;
          lastCallTime = time;
          if (isInvoking) {
            if (timerId === void 0) {
              return leadingEdge(lastCallTime);
            }
            if (maxing) {
              clearTimeout(timerId);
              timerId = setTimeout(timerExpired, wait);
              return invokeFunc(lastCallTime);
            }
          }
          if (timerId === void 0) {
            timerId = setTimeout(timerExpired, wait);
          }
          return result;
        }
        debounced.cancel = cancel;
        debounced.flush = flush;
        return debounced;
      }
      function findLastIndex(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = length - 1;
        return baseFindIndex(array, baseIteratee(predicate), index);
      }
      function fromPairs(pairs) {
        var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
        while (++index < length) {
          var pair = pairs[index];
          result[pair[0]] = pair[1];
        }
        return result;
      }
      function isEqual(value, other) {
        return baseIsEqual(value, other);
      }
      function isNil(value) {
        return value == null;
      }
      function isUndefined$1(value) {
        return value === void 0;
      }
      function baseSet(object, path, value, customizer) {
        if (!isObject(object)) {
          return object;
        }
        path = castPath(path, object);
        var index = -1, length = path.length, lastIndex = length - 1, nested = object;
        while (nested != null && ++index < length) {
          var key = toKey(path[index]), newValue = value;
          if (key === "__proto__" || key === "constructor" || key === "prototype") {
            return object;
          }
          if (index != lastIndex) {
            var objValue = nested[key];
            newValue = void 0;
            if (newValue === void 0) {
              newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
            }
          }
          assignValue(nested, key, newValue);
          nested = nested[key];
        }
        return object;
      }
      function basePickBy(object, paths, predicate) {
        var index = -1, length = paths.length, result = {};
        while (++index < length) {
          var path = paths[index], value = baseGet(object, path);
          if (predicate(value, path)) {
            baseSet(result, castPath(path, object), value);
          }
        }
        return result;
      }
      function basePick(object, paths) {
        return basePickBy(object, paths, function(value, path) {
          return hasIn(object, path);
        });
      }
      var pick = flatRest(function(object, paths) {
        return object == null ? {} : basePick(object, paths);
      });
      function set(object, path, value) {
        return object == null ? object : baseSet(object, path, value);
      }
      const isUndefined = (val) => val === void 0;
      const isBoolean = (val) => typeof val === "boolean";
      const isNumber = (val) => typeof val === "number";
      const isElement = (e) => {
        if (typeof Element === "undefined")
          return false;
        return e instanceof Element;
      };
      const isPropAbsent = (prop) => isNil(prop);
      const isStringNumber = (val) => {
        if (!isString(val)) {
          return false;
        }
        return !Number.isNaN(Number(val));
      };
      const escapeStringRegexp = (string2 = "") => string2.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
      const keysOf = (arr) => Object.keys(arr);
      const getProp = (obj, path, defaultValue) => {
        return {
          get value() {
            return get(obj, path, defaultValue);
          },
          set value(val) {
            set(obj, path, val);
          }
        };
      };
      class ElementPlusError extends Error {
        constructor(m) {
          super(m);
          this.name = "ElementPlusError";
        }
      }
      function throwError(scope, m) {
        throw new ElementPlusError(`[${scope}] ${m}`);
      }
      function debugWarn(scope, message2) {
      }
      const classNameToArray = (cls = "") => cls.split(" ").filter((item) => !!item.trim());
      const hasClass = (el, cls) => {
        if (!el || !cls)
          return false;
        if (cls.includes(" "))
          throw new Error("className should not contain space.");
        return el.classList.contains(cls);
      };
      const addClass = (el, cls) => {
        if (!el || !cls.trim())
          return;
        el.classList.add(...classNameToArray(cls));
      };
      const removeClass = (el, cls) => {
        if (!el || !cls.trim())
          return;
        el.classList.remove(...classNameToArray(cls));
      };
      const getStyle = (element, styleName) => {
        var _a2;
        if (!isClient || !element || !styleName)
          return "";
        let key = camelize(styleName);
        if (key === "float")
          key = "cssFloat";
        try {
          const style = element.style[key];
          if (style)
            return style;
          const computed2 = (_a2 = document.defaultView) == null ? void 0 : _a2.getComputedStyle(element, "");
          return computed2 ? computed2[key] : "";
        } catch (e) {
          return element.style[key];
        }
      };
      function addUnit(value, defaultUnit = "px") {
        if (!value)
          return "";
        if (isNumber(value) || isStringNumber(value)) {
          return `${value}${defaultUnit}`;
        } else if (isString(value)) {
          return value;
        }
      }
      let scrollBarWidth;
      const getScrollBarWidth = (namespace) => {
        var _a2;
        if (!isClient)
          return 0;
        if (scrollBarWidth !== void 0)
          return scrollBarWidth;
        const outer = document.createElement("div");
        outer.className = `${namespace}-scrollbar__wrap`;
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.position = "absolute";
        outer.style.top = "-9999px";
        document.body.appendChild(outer);
        const widthNoScroll = outer.offsetWidth;
        outer.style.overflow = "scroll";
        const inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);
        const widthWithScroll = inner.offsetWidth;
        (_a2 = outer.parentNode) == null ? void 0 : _a2.removeChild(outer);
        scrollBarWidth = widthNoScroll - widthWithScroll;
        return scrollBarWidth;
      };
      function scrollIntoView(container, selected) {
        if (!isClient)
          return;
        if (!selected) {
          container.scrollTop = 0;
          return;
        }
        const offsetParents = [];
        let pointer = selected.offsetParent;
        while (pointer !== null && container !== pointer && container.contains(pointer)) {
          offsetParents.push(pointer);
          pointer = pointer.offsetParent;
        }
        const top = selected.offsetTop + offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);
        const bottom = top + selected.offsetHeight;
        const viewRectTop = container.scrollTop;
        const viewRectBottom = viewRectTop + container.clientHeight;
        if (top < viewRectTop) {
          container.scrollTop = top;
        } else if (bottom > viewRectBottom) {
          container.scrollTop = bottom - container.clientHeight;
        }
      }
      /*! Element Plus Icons Vue v2.3.1 */
      var arrow_down_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
        name: "ArrowDown",
        __name: "arrow-down",
        setup(__props) {
          return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
          }, [
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
            })
          ]));
        }
      });
      var arrow_down_default = arrow_down_vue_vue_type_script_setup_true_lang_default;
      var arrow_up_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
        name: "ArrowUp",
        __name: "arrow-up",
        setup(__props) {
          return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
          }, [
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "m488.832 344.32-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872 319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0"
            })
          ]));
        }
      });
      var arrow_up_default = arrow_up_vue_vue_type_script_setup_true_lang_default;
      var circle_check_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
        name: "CircleCheck",
        __name: "circle-check",
        setup(__props) {
          return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
          }, [
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
            }),
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "M745.344 361.344a32 32 0 0 1 45.312 45.312l-288 288a32 32 0 0 1-45.312 0l-160-160a32 32 0 1 1 45.312-45.312L480 626.752l265.344-265.408z"
            })
          ]));
        }
      });
      var circle_check_default = circle_check_vue_vue_type_script_setup_true_lang_default;
      var circle_close_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
        name: "CircleCloseFilled",
        __name: "circle-close-filled",
        setup(__props) {
          return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
          }, [
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336z"
            })
          ]));
        }
      });
      var circle_close_filled_default = circle_close_filled_vue_vue_type_script_setup_true_lang_default;
      var circle_close_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
        name: "CircleClose",
        __name: "circle-close",
        setup(__props) {
          return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
          }, [
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "m466.752 512-90.496-90.496a32 32 0 0 1 45.248-45.248L512 466.752l90.496-90.496a32 32 0 1 1 45.248 45.248L557.248 512l90.496 90.496a32 32 0 1 1-45.248 45.248L512 557.248l-90.496 90.496a32 32 0 0 1-45.248-45.248z"
            }),
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
            })
          ]));
        }
      });
      var circle_close_default = circle_close_vue_vue_type_script_setup_true_lang_default;
      var close_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
        name: "Close",
        __name: "close",
        setup(__props) {
          return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
          }, [
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
            })
          ]));
        }
      });
      var close_default = close_vue_vue_type_script_setup_true_lang_default;
      var hide_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
        name: "Hide",
        __name: "hide",
        setup(__props) {
          return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
          }, [
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "M876.8 156.8c0-9.6-3.2-16-9.6-22.4-6.4-6.4-12.8-9.6-22.4-9.6-9.6 0-16 3.2-22.4 9.6L736 220.8c-64-32-137.6-51.2-224-60.8-160 16-288 73.6-377.6 176C44.8 438.4 0 496 0 512s48 73.6 134.4 176c22.4 25.6 44.8 48 73.6 67.2l-86.4 89.6c-6.4 6.4-9.6 12.8-9.6 22.4 0 9.6 3.2 16 9.6 22.4 6.4 6.4 12.8 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6l704-710.4c3.2-6.4 6.4-12.8 6.4-22.4Zm-646.4 528c-76.8-70.4-128-128-153.6-172.8 28.8-48 80-105.6 153.6-172.8C304 272 400 230.4 512 224c64 3.2 124.8 19.2 176 44.8l-54.4 54.4C598.4 300.8 560 288 512 288c-64 0-115.2 22.4-160 64s-64 96-64 160c0 48 12.8 89.6 35.2 124.8L256 707.2c-9.6-6.4-19.2-16-25.6-22.4Zm140.8-96c-12.8-22.4-19.2-48-19.2-76.8 0-44.8 16-83.2 48-112 32-28.8 67.2-48 112-48 28.8 0 54.4 6.4 73.6 19.2zM889.599 336c-12.8-16-28.8-28.8-41.6-41.6l-48 48c73.6 67.2 124.8 124.8 150.4 169.6-28.8 48-80 105.6-153.6 172.8-73.6 67.2-172.8 108.8-284.8 115.2-51.2-3.2-99.2-12.8-140.8-28.8l-48 48c57.6 22.4 118.4 38.4 188.8 44.8 160-16 288-73.6 377.6-176C979.199 585.6 1024 528 1024 512s-48.001-73.6-134.401-176Z"
            }),
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "M511.998 672c-12.8 0-25.6-3.2-38.4-6.4l-51.2 51.2c28.8 12.8 57.6 19.2 89.6 19.2 64 0 115.2-22.4 160-64 41.6-41.6 64-96 64-160 0-32-6.4-64-19.2-89.6l-51.2 51.2c3.2 12.8 6.4 25.6 6.4 38.4 0 44.8-16 83.2-48 112-32 28.8-67.2 48-112 48Z"
            })
          ]));
        }
      });
      var hide_default = hide_vue_vue_type_script_setup_true_lang_default;
      var info_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
        name: "InfoFilled",
        __name: "info-filled",
        setup(__props) {
          return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
          }, [
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64m67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344M590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.992 12.992 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z"
            })
          ]));
        }
      });
      var info_filled_default = info_filled_vue_vue_type_script_setup_true_lang_default;
      var loading_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
        name: "Loading",
        __name: "loading",
        setup(__props) {
          return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
          }, [
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
            })
          ]));
        }
      });
      var loading_default = loading_vue_vue_type_script_setup_true_lang_default;
      var minus_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
        name: "Minus",
        __name: "minus",
        setup(__props) {
          return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
          }, [
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64"
            })
          ]));
        }
      });
      var minus_default = minus_vue_vue_type_script_setup_true_lang_default;
      var plus_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
        name: "Plus",
        __name: "plus",
        setup(__props) {
          return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
          }, [
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"
            })
          ]));
        }
      });
      var plus_default = plus_vue_vue_type_script_setup_true_lang_default;
      var success_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
        name: "SuccessFilled",
        __name: "success-filled",
        setup(__props) {
          return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
          }, [
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"
            })
          ]));
        }
      });
      var success_filled_default = success_filled_vue_vue_type_script_setup_true_lang_default;
      var view_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
        name: "View",
        __name: "view",
        setup(__props) {
          return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
          }, [
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352m0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448m0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160"
            })
          ]));
        }
      });
      var view_default = view_vue_vue_type_script_setup_true_lang_default;
      var warning_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
        name: "WarningFilled",
        __name: "warning-filled",
        setup(__props) {
          return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
          }, [
            vue.createElementVNode("path", {
              fill: "currentColor",
              d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4"
            })
          ]));
        }
      });
      var warning_filled_default = warning_filled_vue_vue_type_script_setup_true_lang_default;
      const epPropKey = "__epPropKey";
      const definePropType = (val) => val;
      const isEpProp = (val) => isObject$1(val) && !!val[epPropKey];
      const buildProp = (prop, key) => {
        if (!isObject$1(prop) || isEpProp(prop))
          return prop;
        const { values, required, default: defaultValue, type, validator } = prop;
        const _validator = values || validator ? (val) => {
          let valid = false;
          let allowedValues = [];
          if (values) {
            allowedValues = Array.from(values);
            if (hasOwn(prop, "default")) {
              allowedValues.push(defaultValue);
            }
            valid || (valid = allowedValues.includes(val));
          }
          if (validator)
            valid || (valid = validator(val));
          if (!valid && allowedValues.length > 0) {
            const allowValuesText = [...new Set(allowedValues)].map((value) => JSON.stringify(value)).join(", ");
            vue.warn(`Invalid prop: validation failed${key ? ` for prop "${key}"` : ""}. Expected one of [${allowValuesText}], got value ${JSON.stringify(val)}.`);
          }
          return valid;
        } : void 0;
        const epProp = {
          type,
          required: !!required,
          validator: _validator,
          [epPropKey]: true
        };
        if (hasOwn(prop, "default"))
          epProp.default = defaultValue;
        return epProp;
      };
      const buildProps = (props) => fromPairs(Object.entries(props).map(([key, option]) => [
        key,
        buildProp(option, key)
      ]));
      const iconPropType = definePropType([
        String,
        Object,
        Function
      ]);
      const TypeComponents = {
        Close: close_default,
        SuccessFilled: success_filled_default,
        InfoFilled: info_filled_default,
        WarningFilled: warning_filled_default,
        CircleCloseFilled: circle_close_filled_default
      };
      const TypeComponentsMap = {
        success: success_filled_default,
        warning: warning_filled_default,
        error: circle_close_filled_default,
        info: info_filled_default
      };
      const ValidateComponentsMap = {
        validating: loading_default,
        success: circle_check_default,
        error: circle_close_default
      };
      const withInstall = (main, extra) => {
        main.install = (app2) => {
          for (const comp of [main, ...Object.values(extra != null ? extra : {})]) {
            app2.component(comp.name, comp);
          }
        };
        if (extra) {
          for (const [key, comp] of Object.entries(extra)) {
            main[key] = comp;
          }
        }
        return main;
      };
      const withInstallFunction = (fn2, name) => {
        fn2.install = (app2) => {
          fn2._context = app2._context;
          app2.config.globalProperties[name] = fn2;
        };
        return fn2;
      };
      const withNoopInstall = (component) => {
        component.install = NOOP;
        return component;
      };
      const EVENT_CODE = {
        tab: "Tab",
        enter: "Enter",
        space: "Space",
        left: "ArrowLeft",
        up: "ArrowUp",
        right: "ArrowRight",
        down: "ArrowDown",
        esc: "Escape",
        delete: "Delete",
        backspace: "Backspace",
        numpadEnter: "NumpadEnter",
        pageUp: "PageUp",
        pageDown: "PageDown",
        home: "Home",
        end: "End"
      };
      const UPDATE_MODEL_EVENT = "update:modelValue";
      const CHANGE_EVENT = "change";
      const INPUT_EVENT = "input";
      const componentSizes = ["", "default", "small", "large"];
      const isValidComponentSize = (val) => ["", ...componentSizes].includes(val);
      var PatchFlags = /* @__PURE__ */ ((PatchFlags2) => {
        PatchFlags2[PatchFlags2["TEXT"] = 1] = "TEXT";
        PatchFlags2[PatchFlags2["CLASS"] = 2] = "CLASS";
        PatchFlags2[PatchFlags2["STYLE"] = 4] = "STYLE";
        PatchFlags2[PatchFlags2["PROPS"] = 8] = "PROPS";
        PatchFlags2[PatchFlags2["FULL_PROPS"] = 16] = "FULL_PROPS";
        PatchFlags2[PatchFlags2["HYDRATE_EVENTS"] = 32] = "HYDRATE_EVENTS";
        PatchFlags2[PatchFlags2["STABLE_FRAGMENT"] = 64] = "STABLE_FRAGMENT";
        PatchFlags2[PatchFlags2["KEYED_FRAGMENT"] = 128] = "KEYED_FRAGMENT";
        PatchFlags2[PatchFlags2["UNKEYED_FRAGMENT"] = 256] = "UNKEYED_FRAGMENT";
        PatchFlags2[PatchFlags2["NEED_PATCH"] = 512] = "NEED_PATCH";
        PatchFlags2[PatchFlags2["DYNAMIC_SLOTS"] = 1024] = "DYNAMIC_SLOTS";
        PatchFlags2[PatchFlags2["HOISTED"] = -1] = "HOISTED";
        PatchFlags2[PatchFlags2["BAIL"] = -2] = "BAIL";
        return PatchFlags2;
      })(PatchFlags || {});
      function isFragment(node) {
        return vue.isVNode(node) && node.type === vue.Fragment;
      }
      function isComment(node) {
        return vue.isVNode(node) && node.type === vue.Comment;
      }
      function isValidElementNode(node) {
        return vue.isVNode(node) && !isFragment(node) && !isComment(node);
      }
      const isKorean = (text) => /([\uAC00-\uD7AF\u3130-\u318F])+/gi.test(text);
      const mutable = (val) => val;
      const DEFAULT_EXCLUDE_KEYS = ["class", "style"];
      const LISTENER_PREFIX = /^on[A-Z]/;
      const useAttrs = (params = {}) => {
        const { excludeListeners = false, excludeKeys } = params;
        const allExcludeKeys = vue.computed(() => {
          return ((excludeKeys == null ? void 0 : excludeKeys.value) || []).concat(DEFAULT_EXCLUDE_KEYS);
        });
        const instance = vue.getCurrentInstance();
        if (!instance) {
          return vue.computed(() => ({}));
        }
        return vue.computed(() => {
          var _a2;
          return fromPairs(Object.entries((_a2 = instance.proxy) == null ? void 0 : _a2.$attrs).filter(([key]) => !allExcludeKeys.value.includes(key) && !(excludeListeners && LISTENER_PREFIX.test(key))));
        });
      };
      const useDeprecated = ({ from, replacement, scope, version, ref: ref2, type = "API" }, condition) => {
        vue.watch(() => vue.unref(condition), (val) => {
        }, {
          immediate: true
        });
      };
      var English = {
        name: "en",
        el: {
          breadcrumb: {
            label: "Breadcrumb"
          },
          colorpicker: {
            confirm: "OK",
            clear: "Clear",
            defaultLabel: "color picker",
            description: "current color is {color}. press enter to select a new color.",
            alphaLabel: "pick alpha value"
          },
          datepicker: {
            now: "Now",
            today: "Today",
            cancel: "Cancel",
            clear: "Clear",
            confirm: "OK",
            dateTablePrompt: "Use the arrow keys and enter to select the day of the month",
            monthTablePrompt: "Use the arrow keys and enter to select the month",
            yearTablePrompt: "Use the arrow keys and enter to select the year",
            selectedDate: "Selected date",
            selectDate: "Select date",
            selectTime: "Select time",
            startDate: "Start Date",
            startTime: "Start Time",
            endDate: "End Date",
            endTime: "End Time",
            prevYear: "Previous Year",
            nextYear: "Next Year",
            prevMonth: "Previous Month",
            nextMonth: "Next Month",
            year: "",
            month1: "January",
            month2: "February",
            month3: "March",
            month4: "April",
            month5: "May",
            month6: "June",
            month7: "July",
            month8: "August",
            month9: "September",
            month10: "October",
            month11: "November",
            month12: "December",
            week: "week",
            weeks: {
              sun: "Sun",
              mon: "Mon",
              tue: "Tue",
              wed: "Wed",
              thu: "Thu",
              fri: "Fri",
              sat: "Sat"
            },
            weeksFull: {
              sun: "Sunday",
              mon: "Monday",
              tue: "Tuesday",
              wed: "Wednesday",
              thu: "Thursday",
              fri: "Friday",
              sat: "Saturday"
            },
            months: {
              jan: "Jan",
              feb: "Feb",
              mar: "Mar",
              apr: "Apr",
              may: "May",
              jun: "Jun",
              jul: "Jul",
              aug: "Aug",
              sep: "Sep",
              oct: "Oct",
              nov: "Nov",
              dec: "Dec"
            }
          },
          inputNumber: {
            decrease: "decrease number",
            increase: "increase number"
          },
          select: {
            loading: "Loading",
            noMatch: "No matching data",
            noData: "No data",
            placeholder: "Select"
          },
          mention: {
            loading: "Loading"
          },
          dropdown: {
            toggleDropdown: "Toggle Dropdown"
          },
          cascader: {
            noMatch: "No matching data",
            loading: "Loading",
            placeholder: "Select",
            noData: "No data"
          },
          pagination: {
            goto: "Go to",
            pagesize: "/page",
            total: "Total {total}",
            pageClassifier: "",
            page: "Page",
            prev: "Go to previous page",
            next: "Go to next page",
            currentPage: "page {pager}",
            prevPages: "Previous {pager} pages",
            nextPages: "Next {pager} pages",
            deprecationWarning: "Deprecated usages detected, please refer to the el-pagination documentation for more details"
          },
          dialog: {
            close: "Close this dialog"
          },
          drawer: {
            close: "Close this dialog"
          },
          messagebox: {
            title: "Message",
            confirm: "OK",
            cancel: "Cancel",
            error: "Illegal input",
            close: "Close this dialog"
          },
          upload: {
            deleteTip: "press delete to remove",
            delete: "Delete",
            preview: "Preview",
            continue: "Continue"
          },
          slider: {
            defaultLabel: "slider between {min} and {max}",
            defaultRangeStartLabel: "pick start value",
            defaultRangeEndLabel: "pick end value"
          },
          table: {
            emptyText: "No Data",
            confirmFilter: "Confirm",
            resetFilter: "Reset",
            clearFilter: "All",
            sumText: "Sum"
          },
          tour: {
            next: "Next",
            previous: "Previous",
            finish: "Finish"
          },
          tree: {
            emptyText: "No Data"
          },
          transfer: {
            noMatch: "No matching data",
            noData: "No data",
            titles: ["List 1", "List 2"],
            filterPlaceholder: "Enter keyword",
            noCheckedFormat: "{total} items",
            hasCheckedFormat: "{checked}/{total} checked"
          },
          image: {
            error: "FAILED"
          },
          pageHeader: {
            title: "Back"
          },
          popconfirm: {
            confirmButtonText: "Yes",
            cancelButtonText: "No"
          },
          carousel: {
            leftArrow: "Carousel arrow left",
            rightArrow: "Carousel arrow right",
            indicator: "Carousel switch to index {index}"
          }
        }
      };
      const buildTranslator = (locale) => (path, option) => translate(path, option, vue.unref(locale));
      const translate = (path, option, locale) => get(locale, path, path).replace(/\{(\w+)\}/g, (_, key) => {
        var _a2;
        return `${(_a2 = option == null ? void 0 : option[key]) != null ? _a2 : `{${key}}`}`;
      });
      const buildLocaleContext = (locale) => {
        const lang = vue.computed(() => vue.unref(locale).name);
        const localeRef = vue.isRef(locale) ? locale : vue.ref(locale);
        return {
          lang,
          locale: localeRef,
          t: buildTranslator(locale)
        };
      };
      const localeContextKey = Symbol("localeContextKey");
      const useLocale = (localeOverrides) => {
        const locale = localeOverrides || vue.inject(localeContextKey, vue.ref());
        return buildLocaleContext(vue.computed(() => locale.value || English));
      };
      const defaultNamespace = "el";
      const statePrefix = "is-";
      const _bem = (namespace, block, blockSuffix, element, modifier) => {
        let cls = `${namespace}-${block}`;
        if (blockSuffix) {
          cls += `-${blockSuffix}`;
        }
        if (element) {
          cls += `__${element}`;
        }
        if (modifier) {
          cls += `--${modifier}`;
        }
        return cls;
      };
      const namespaceContextKey = Symbol("namespaceContextKey");
      const useGetDerivedNamespace = (namespaceOverrides) => {
        const derivedNamespace = namespaceOverrides || (vue.getCurrentInstance() ? vue.inject(namespaceContextKey, vue.ref(defaultNamespace)) : vue.ref(defaultNamespace));
        const namespace = vue.computed(() => {
          return vue.unref(derivedNamespace) || defaultNamespace;
        });
        return namespace;
      };
      const useNamespace = (block, namespaceOverrides) => {
        const namespace = useGetDerivedNamespace(namespaceOverrides);
        const b = (blockSuffix = "") => _bem(namespace.value, block, blockSuffix, "", "");
        const e = (element) => element ? _bem(namespace.value, block, "", element, "") : "";
        const m = (modifier) => modifier ? _bem(namespace.value, block, "", "", modifier) : "";
        const be2 = (blockSuffix, element) => blockSuffix && element ? _bem(namespace.value, block, blockSuffix, element, "") : "";
        const em = (element, modifier) => element && modifier ? _bem(namespace.value, block, "", element, modifier) : "";
        const bm = (blockSuffix, modifier) => blockSuffix && modifier ? _bem(namespace.value, block, blockSuffix, "", modifier) : "";
        const bem = (blockSuffix, element, modifier) => blockSuffix && element && modifier ? _bem(namespace.value, block, blockSuffix, element, modifier) : "";
        const is = (name, ...args) => {
          const state = args.length >= 1 ? args[0] : true;
          return name && state ? `${statePrefix}${name}` : "";
        };
        const cssVar = (object) => {
          const styles = {};
          for (const key in object) {
            if (object[key]) {
              styles[`--${namespace.value}-${key}`] = object[key];
            }
          }
          return styles;
        };
        const cssVarBlock = (object) => {
          const styles = {};
          for (const key in object) {
            if (object[key]) {
              styles[`--${namespace.value}-${block}-${key}`] = object[key];
            }
          }
          return styles;
        };
        const cssVarName = (name) => `--${namespace.value}-${name}`;
        const cssVarBlockName = (name) => `--${namespace.value}-${block}-${name}`;
        return {
          namespace,
          b,
          e,
          m,
          be: be2,
          em,
          bm,
          bem,
          is,
          cssVar,
          cssVarName,
          cssVarBlock,
          cssVarBlockName
        };
      };
      const useLockscreen = (trigger, options = {}) => {
        if (!vue.isRef(trigger)) {
          throwError("[useLockscreen]", "You need to pass a ref param to this function");
        }
        const ns = options.ns || useNamespace("popup");
        const hiddenCls = vue.computed(() => ns.bm("parent", "hidden"));
        if (!isClient || hasClass(document.body, hiddenCls.value)) {
          return;
        }
        let scrollBarWidth2 = 0;
        let withoutHiddenClass = false;
        let bodyWidth = "0";
        const cleanup = () => {
          setTimeout(() => {
            if (typeof document === "undefined")
              return;
            removeClass(document == null ? void 0 : document.body, hiddenCls.value);
            if (withoutHiddenClass && document) {
              document.body.style.width = bodyWidth;
            }
          }, 200);
        };
        vue.watch(trigger, (val) => {
          if (!val) {
            cleanup();
            return;
          }
          withoutHiddenClass = !hasClass(document.body, hiddenCls.value);
          if (withoutHiddenClass) {
            bodyWidth = document.body.style.width;
          }
          scrollBarWidth2 = getScrollBarWidth(ns.namespace.value);
          const bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
          const bodyOverflowY = getStyle(document.body, "overflowY");
          if (scrollBarWidth2 > 0 && (bodyHasOverflow || bodyOverflowY === "scroll") && withoutHiddenClass) {
            document.body.style.width = `calc(100% - ${scrollBarWidth2}px)`;
          }
          addClass(document.body, hiddenCls.value);
        });
        vue.onScopeDispose(() => cleanup());
      };
      const _prop = buildProp({
        type: definePropType(Boolean),
        default: null
      });
      const _event = buildProp({
        type: definePropType(Function)
      });
      const createModelToggleComposable = (name) => {
        const updateEventKey = `update:${name}`;
        const updateEventKeyRaw = `onUpdate:${name}`;
        const useModelToggleEmits2 = [updateEventKey];
        const useModelToggleProps2 = {
          [name]: _prop,
          [updateEventKeyRaw]: _event
        };
        const useModelToggle2 = ({
          indicator,
          toggleReason,
          shouldHideWhenRouteChanges,
          shouldProceed,
          onShow,
          onHide
        }) => {
          const instance = vue.getCurrentInstance();
          const { emit } = instance;
          const props = instance.props;
          const hasUpdateHandler = vue.computed(() => isFunction$1(props[updateEventKeyRaw]));
          const isModelBindingAbsent = vue.computed(() => props[name] === null);
          const doShow = (event) => {
            if (indicator.value === true) {
              return;
            }
            indicator.value = true;
            if (toggleReason) {
              toggleReason.value = event;
            }
            if (isFunction$1(onShow)) {
              onShow(event);
            }
          };
          const doHide = (event) => {
            if (indicator.value === false) {
              return;
            }
            indicator.value = false;
            if (toggleReason) {
              toggleReason.value = event;
            }
            if (isFunction$1(onHide)) {
              onHide(event);
            }
          };
          const show = (event) => {
            if (props.disabled === true || isFunction$1(shouldProceed) && !shouldProceed())
              return;
            const shouldEmit = hasUpdateHandler.value && isClient;
            if (shouldEmit) {
              emit(updateEventKey, true);
            }
            if (isModelBindingAbsent.value || !shouldEmit) {
              doShow(event);
            }
          };
          const hide = (event) => {
            if (props.disabled === true || !isClient)
              return;
            const shouldEmit = hasUpdateHandler.value && isClient;
            if (shouldEmit) {
              emit(updateEventKey, false);
            }
            if (isModelBindingAbsent.value || !shouldEmit) {
              doHide(event);
            }
          };
          const onChange = (val) => {
            if (!isBoolean(val))
              return;
            if (props.disabled && val) {
              if (hasUpdateHandler.value) {
                emit(updateEventKey, false);
              }
            } else if (indicator.value !== val) {
              if (val) {
                doShow();
              } else {
                doHide();
              }
            }
          };
          const toggle = () => {
            if (indicator.value) {
              hide();
            } else {
              show();
            }
          };
          vue.watch(() => props[name], onChange);
          if (shouldHideWhenRouteChanges && instance.appContext.config.globalProperties.$route !== void 0) {
            vue.watch(() => ({
              ...instance.proxy.$route
            }), () => {
              if (shouldHideWhenRouteChanges.value && indicator.value) {
                hide();
              }
            });
          }
          vue.onMounted(() => {
            onChange(props[name]);
          });
          return {
            hide,
            show,
            toggle,
            hasUpdateHandler
          };
        };
        return {
          useModelToggle: useModelToggle2,
          useModelToggleProps: useModelToggleProps2,
          useModelToggleEmits: useModelToggleEmits2
        };
      };
      const useProp = (name) => {
        const vm = vue.getCurrentInstance();
        return vue.computed(() => {
          var _a2, _b;
          return (_b = (_a2 = vm == null ? void 0 : vm.proxy) == null ? void 0 : _a2.$props) == null ? void 0 : _b[name];
        });
      };
      var E = "top", R = "bottom", W = "right", P = "left", me = "auto", G = [E, R, W, P], U = "start", J = "end", Xe = "clippingParents", je = "viewport", K = "popper", Ye = "reference", De = G.reduce(function(t, e) {
        return t.concat([e + "-" + U, e + "-" + J]);
      }, []), Ee = [].concat(G, [me]).reduce(function(t, e) {
        return t.concat([e, e + "-" + U, e + "-" + J]);
      }, []), Ge = "beforeRead", Je = "read", Ke = "afterRead", Qe = "beforeMain", Ze = "main", et = "afterMain", tt = "beforeWrite", nt = "write", rt = "afterWrite", ot = [Ge, Je, Ke, Qe, Ze, et, tt, nt, rt];
      function C(t) {
        return t ? (t.nodeName || "").toLowerCase() : null;
      }
      function H(t) {
        if (t == null) return window;
        if (t.toString() !== "[object Window]") {
          var e = t.ownerDocument;
          return e && e.defaultView || window;
        }
        return t;
      }
      function Q(t) {
        var e = H(t).Element;
        return t instanceof e || t instanceof Element;
      }
      function B(t) {
        var e = H(t).HTMLElement;
        return t instanceof e || t instanceof HTMLElement;
      }
      function Pe(t) {
        if (typeof ShadowRoot == "undefined") return false;
        var e = H(t).ShadowRoot;
        return t instanceof e || t instanceof ShadowRoot;
      }
      function Mt(t) {
        var e = t.state;
        Object.keys(e.elements).forEach(function(n) {
          var r = e.styles[n] || {}, o = e.attributes[n] || {}, i = e.elements[n];
          !B(i) || !C(i) || (Object.assign(i.style, r), Object.keys(o).forEach(function(a) {
            var s = o[a];
            s === false ? i.removeAttribute(a) : i.setAttribute(a, s === true ? "" : s);
          }));
        });
      }
      function Rt(t) {
        var e = t.state, n = { popper: { position: e.options.strategy, left: "0", top: "0", margin: "0" }, arrow: { position: "absolute" }, reference: {} };
        return Object.assign(e.elements.popper.style, n.popper), e.styles = n, e.elements.arrow && Object.assign(e.elements.arrow.style, n.arrow), function() {
          Object.keys(e.elements).forEach(function(r) {
            var o = e.elements[r], i = e.attributes[r] || {}, a = Object.keys(e.styles.hasOwnProperty(r) ? e.styles[r] : n[r]), s = a.reduce(function(f, c) {
              return f[c] = "", f;
            }, {});
            !B(o) || !C(o) || (Object.assign(o.style, s), Object.keys(i).forEach(function(f) {
              o.removeAttribute(f);
            }));
          });
        };
      }
      var Ae = { name: "applyStyles", enabled: true, phase: "write", fn: Mt, effect: Rt, requires: ["computeStyles"] };
      function q(t) {
        return t.split("-")[0];
      }
      var X = Math.max, ve = Math.min, Z = Math.round;
      function ee(t, e) {
        e === void 0 && (e = false);
        var n = t.getBoundingClientRect(), r = 1, o = 1;
        if (B(t) && e) {
          var i = t.offsetHeight, a = t.offsetWidth;
          a > 0 && (r = Z(n.width) / a || 1), i > 0 && (o = Z(n.height) / i || 1);
        }
        return { width: n.width / r, height: n.height / o, top: n.top / o, right: n.right / r, bottom: n.bottom / o, left: n.left / r, x: n.left / r, y: n.top / o };
      }
      function ke(t) {
        var e = ee(t), n = t.offsetWidth, r = t.offsetHeight;
        return Math.abs(e.width - n) <= 1 && (n = e.width), Math.abs(e.height - r) <= 1 && (r = e.height), { x: t.offsetLeft, y: t.offsetTop, width: n, height: r };
      }
      function it(t, e) {
        var n = e.getRootNode && e.getRootNode();
        if (t.contains(e)) return true;
        if (n && Pe(n)) {
          var r = e;
          do {
            if (r && t.isSameNode(r)) return true;
            r = r.parentNode || r.host;
          } while (r);
        }
        return false;
      }
      function N(t) {
        return H(t).getComputedStyle(t);
      }
      function Wt(t) {
        return ["table", "td", "th"].indexOf(C(t)) >= 0;
      }
      function I(t) {
        return ((Q(t) ? t.ownerDocument : t.document) || window.document).documentElement;
      }
      function ge(t) {
        return C(t) === "html" ? t : t.assignedSlot || t.parentNode || (Pe(t) ? t.host : null) || I(t);
      }
      function at(t) {
        return !B(t) || N(t).position === "fixed" ? null : t.offsetParent;
      }
      function Bt(t) {
        var e = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1, n = navigator.userAgent.indexOf("Trident") !== -1;
        if (n && B(t)) {
          var r = N(t);
          if (r.position === "fixed") return null;
        }
        var o = ge(t);
        for (Pe(o) && (o = o.host); B(o) && ["html", "body"].indexOf(C(o)) < 0; ) {
          var i = N(o);
          if (i.transform !== "none" || i.perspective !== "none" || i.contain === "paint" || ["transform", "perspective"].indexOf(i.willChange) !== -1 || e && i.willChange === "filter" || e && i.filter && i.filter !== "none") return o;
          o = o.parentNode;
        }
        return null;
      }
      function se(t) {
        for (var e = H(t), n = at(t); n && Wt(n) && N(n).position === "static"; ) n = at(n);
        return n && (C(n) === "html" || C(n) === "body" && N(n).position === "static") ? e : n || Bt(t) || e;
      }
      function Le(t) {
        return ["top", "bottom"].indexOf(t) >= 0 ? "x" : "y";
      }
      function fe(t, e, n) {
        return X(t, ve(e, n));
      }
      function St(t, e, n) {
        var r = fe(t, e, n);
        return r > n ? n : r;
      }
      function st() {
        return { top: 0, right: 0, bottom: 0, left: 0 };
      }
      function ft(t) {
        return Object.assign({}, st(), t);
      }
      function ct(t, e) {
        return e.reduce(function(n, r) {
          return n[r] = t, n;
        }, {});
      }
      var Tt = function(t, e) {
        return t = typeof t == "function" ? t(Object.assign({}, e.rects, { placement: e.placement })) : t, ft(typeof t != "number" ? t : ct(t, G));
      };
      function Ht(t) {
        var e, n = t.state, r = t.name, o = t.options, i = n.elements.arrow, a = n.modifiersData.popperOffsets, s = q(n.placement), f = Le(s), c = [P, W].indexOf(s) >= 0, u = c ? "height" : "width";
        if (!(!i || !a)) {
          var m = Tt(o.padding, n), v = ke(i), l = f === "y" ? E : P, h2 = f === "y" ? R : W, p = n.rects.reference[u] + n.rects.reference[f] - a[f] - n.rects.popper[u], g = a[f] - n.rects.reference[f], x = se(i), y = x ? f === "y" ? x.clientHeight || 0 : x.clientWidth || 0 : 0, $ = p / 2 - g / 2, d = m[l], b = y - v[u] - m[h2], w = y / 2 - v[u] / 2 + $, O = fe(d, w, b), j = f;
          n.modifiersData[r] = (e = {}, e[j] = O, e.centerOffset = O - w, e);
        }
      }
      function Ct(t) {
        var e = t.state, n = t.options, r = n.element, o = r === void 0 ? "[data-popper-arrow]" : r;
        o != null && (typeof o == "string" && (o = e.elements.popper.querySelector(o), !o) || !it(e.elements.popper, o) || (e.elements.arrow = o));
      }
      var pt = { name: "arrow", enabled: true, phase: "main", fn: Ht, effect: Ct, requires: ["popperOffsets"], requiresIfExists: ["preventOverflow"] };
      function te(t) {
        return t.split("-")[1];
      }
      var qt = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
      function Vt(t) {
        var e = t.x, n = t.y, r = window, o = r.devicePixelRatio || 1;
        return { x: Z(e * o) / o || 0, y: Z(n * o) / o || 0 };
      }
      function ut(t) {
        var e, n = t.popper, r = t.popperRect, o = t.placement, i = t.variation, a = t.offsets, s = t.position, f = t.gpuAcceleration, c = t.adaptive, u = t.roundOffsets, m = t.isFixed, v = a.x, l = v === void 0 ? 0 : v, h2 = a.y, p = h2 === void 0 ? 0 : h2, g = typeof u == "function" ? u({ x: l, y: p }) : { x: l, y: p };
        l = g.x, p = g.y;
        var x = a.hasOwnProperty("x"), y = a.hasOwnProperty("y"), $ = P, d = E, b = window;
        if (c) {
          var w = se(n), O = "clientHeight", j = "clientWidth";
          if (w === H(n) && (w = I(n), N(w).position !== "static" && s === "absolute" && (O = "scrollHeight", j = "scrollWidth")), w = w, o === E || (o === P || o === W) && i === J) {
            d = R;
            var A = m && w === b && b.visualViewport ? b.visualViewport.height : w[O];
            p -= A - r.height, p *= f ? 1 : -1;
          }
          if (o === P || (o === E || o === R) && i === J) {
            $ = W;
            var k = m && w === b && b.visualViewport ? b.visualViewport.width : w[j];
            l -= k - r.width, l *= f ? 1 : -1;
          }
        }
        var D = Object.assign({ position: s }, c && qt), S = u === true ? Vt({ x: l, y: p }) : { x: l, y: p };
        if (l = S.x, p = S.y, f) {
          var L;
          return Object.assign({}, D, (L = {}, L[d] = y ? "0" : "", L[$] = x ? "0" : "", L.transform = (b.devicePixelRatio || 1) <= 1 ? "translate(" + l + "px, " + p + "px)" : "translate3d(" + l + "px, " + p + "px, 0)", L));
        }
        return Object.assign({}, D, (e = {}, e[d] = y ? p + "px" : "", e[$] = x ? l + "px" : "", e.transform = "", e));
      }
      function Nt(t) {
        var e = t.state, n = t.options, r = n.gpuAcceleration, o = r === void 0 ? true : r, i = n.adaptive, a = i === void 0 ? true : i, s = n.roundOffsets, f = s === void 0 ? true : s, c = { placement: q(e.placement), variation: te(e.placement), popper: e.elements.popper, popperRect: e.rects.popper, gpuAcceleration: o, isFixed: e.options.strategy === "fixed" };
        e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, ut(Object.assign({}, c, { offsets: e.modifiersData.popperOffsets, position: e.options.strategy, adaptive: a, roundOffsets: f })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, ut(Object.assign({}, c, { offsets: e.modifiersData.arrow, position: "absolute", adaptive: false, roundOffsets: f })))), e.attributes.popper = Object.assign({}, e.attributes.popper, { "data-popper-placement": e.placement });
      }
      var Me = { name: "computeStyles", enabled: true, phase: "beforeWrite", fn: Nt, data: {} }, ye = { passive: true };
      function It(t) {
        var e = t.state, n = t.instance, r = t.options, o = r.scroll, i = o === void 0 ? true : o, a = r.resize, s = a === void 0 ? true : a, f = H(e.elements.popper), c = [].concat(e.scrollParents.reference, e.scrollParents.popper);
        return i && c.forEach(function(u) {
          u.addEventListener("scroll", n.update, ye);
        }), s && f.addEventListener("resize", n.update, ye), function() {
          i && c.forEach(function(u) {
            u.removeEventListener("scroll", n.update, ye);
          }), s && f.removeEventListener("resize", n.update, ye);
        };
      }
      var Re = { name: "eventListeners", enabled: true, phase: "write", fn: function() {
      }, effect: It, data: {} }, _t = { left: "right", right: "left", bottom: "top", top: "bottom" };
      function be(t) {
        return t.replace(/left|right|bottom|top/g, function(e) {
          return _t[e];
        });
      }
      var zt = { start: "end", end: "start" };
      function lt(t) {
        return t.replace(/start|end/g, function(e) {
          return zt[e];
        });
      }
      function We(t) {
        var e = H(t), n = e.pageXOffset, r = e.pageYOffset;
        return { scrollLeft: n, scrollTop: r };
      }
      function Be(t) {
        return ee(I(t)).left + We(t).scrollLeft;
      }
      function Ft(t) {
        var e = H(t), n = I(t), r = e.visualViewport, o = n.clientWidth, i = n.clientHeight, a = 0, s = 0;
        return r && (o = r.width, i = r.height, /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (a = r.offsetLeft, s = r.offsetTop)), { width: o, height: i, x: a + Be(t), y: s };
      }
      function Ut(t) {
        var e, n = I(t), r = We(t), o = (e = t.ownerDocument) == null ? void 0 : e.body, i = X(n.scrollWidth, n.clientWidth, o ? o.scrollWidth : 0, o ? o.clientWidth : 0), a = X(n.scrollHeight, n.clientHeight, o ? o.scrollHeight : 0, o ? o.clientHeight : 0), s = -r.scrollLeft + Be(t), f = -r.scrollTop;
        return N(o || n).direction === "rtl" && (s += X(n.clientWidth, o ? o.clientWidth : 0) - i), { width: i, height: a, x: s, y: f };
      }
      function Se(t) {
        var e = N(t), n = e.overflow, r = e.overflowX, o = e.overflowY;
        return /auto|scroll|overlay|hidden/.test(n + o + r);
      }
      function dt(t) {
        return ["html", "body", "#document"].indexOf(C(t)) >= 0 ? t.ownerDocument.body : B(t) && Se(t) ? t : dt(ge(t));
      }
      function ce(t, e) {
        var n;
        e === void 0 && (e = []);
        var r = dt(t), o = r === ((n = t.ownerDocument) == null ? void 0 : n.body), i = H(r), a = o ? [i].concat(i.visualViewport || [], Se(r) ? r : []) : r, s = e.concat(a);
        return o ? s : s.concat(ce(ge(a)));
      }
      function Te(t) {
        return Object.assign({}, t, { left: t.x, top: t.y, right: t.x + t.width, bottom: t.y + t.height });
      }
      function Xt(t) {
        var e = ee(t);
        return e.top = e.top + t.clientTop, e.left = e.left + t.clientLeft, e.bottom = e.top + t.clientHeight, e.right = e.left + t.clientWidth, e.width = t.clientWidth, e.height = t.clientHeight, e.x = e.left, e.y = e.top, e;
      }
      function ht(t, e) {
        return e === je ? Te(Ft(t)) : Q(e) ? Xt(e) : Te(Ut(I(t)));
      }
      function Yt(t) {
        var e = ce(ge(t)), n = ["absolute", "fixed"].indexOf(N(t).position) >= 0, r = n && B(t) ? se(t) : t;
        return Q(r) ? e.filter(function(o) {
          return Q(o) && it(o, r) && C(o) !== "body";
        }) : [];
      }
      function Gt(t, e, n) {
        var r = e === "clippingParents" ? Yt(t) : [].concat(e), o = [].concat(r, [n]), i = o[0], a = o.reduce(function(s, f) {
          var c = ht(t, f);
          return s.top = X(c.top, s.top), s.right = ve(c.right, s.right), s.bottom = ve(c.bottom, s.bottom), s.left = X(c.left, s.left), s;
        }, ht(t, i));
        return a.width = a.right - a.left, a.height = a.bottom - a.top, a.x = a.left, a.y = a.top, a;
      }
      function mt(t) {
        var e = t.reference, n = t.element, r = t.placement, o = r ? q(r) : null, i = r ? te(r) : null, a = e.x + e.width / 2 - n.width / 2, s = e.y + e.height / 2 - n.height / 2, f;
        switch (o) {
          case E:
            f = { x: a, y: e.y - n.height };
            break;
          case R:
            f = { x: a, y: e.y + e.height };
            break;
          case W:
            f = { x: e.x + e.width, y: s };
            break;
          case P:
            f = { x: e.x - n.width, y: s };
            break;
          default:
            f = { x: e.x, y: e.y };
        }
        var c = o ? Le(o) : null;
        if (c != null) {
          var u = c === "y" ? "height" : "width";
          switch (i) {
            case U:
              f[c] = f[c] - (e[u] / 2 - n[u] / 2);
              break;
            case J:
              f[c] = f[c] + (e[u] / 2 - n[u] / 2);
              break;
          }
        }
        return f;
      }
      function ne(t, e) {
        e === void 0 && (e = {});
        var n = e, r = n.placement, o = r === void 0 ? t.placement : r, i = n.boundary, a = i === void 0 ? Xe : i, s = n.rootBoundary, f = s === void 0 ? je : s, c = n.elementContext, u = c === void 0 ? K : c, m = n.altBoundary, v = m === void 0 ? false : m, l = n.padding, h2 = l === void 0 ? 0 : l, p = ft(typeof h2 != "number" ? h2 : ct(h2, G)), g = u === K ? Ye : K, x = t.rects.popper, y = t.elements[v ? g : u], $ = Gt(Q(y) ? y : y.contextElement || I(t.elements.popper), a, f), d = ee(t.elements.reference), b = mt({ reference: d, element: x, strategy: "absolute", placement: o }), w = Te(Object.assign({}, x, b)), O = u === K ? w : d, j = { top: $.top - O.top + p.top, bottom: O.bottom - $.bottom + p.bottom, left: $.left - O.left + p.left, right: O.right - $.right + p.right }, A = t.modifiersData.offset;
        if (u === K && A) {
          var k = A[o];
          Object.keys(j).forEach(function(D) {
            var S = [W, R].indexOf(D) >= 0 ? 1 : -1, L = [E, R].indexOf(D) >= 0 ? "y" : "x";
            j[D] += k[L] * S;
          });
        }
        return j;
      }
      function Jt(t, e) {
        e === void 0 && (e = {});
        var n = e, r = n.placement, o = n.boundary, i = n.rootBoundary, a = n.padding, s = n.flipVariations, f = n.allowedAutoPlacements, c = f === void 0 ? Ee : f, u = te(r), m = u ? s ? De : De.filter(function(h2) {
          return te(h2) === u;
        }) : G, v = m.filter(function(h2) {
          return c.indexOf(h2) >= 0;
        });
        v.length === 0 && (v = m);
        var l = v.reduce(function(h2, p) {
          return h2[p] = ne(t, { placement: p, boundary: o, rootBoundary: i, padding: a })[q(p)], h2;
        }, {});
        return Object.keys(l).sort(function(h2, p) {
          return l[h2] - l[p];
        });
      }
      function Kt(t) {
        if (q(t) === me) return [];
        var e = be(t);
        return [lt(t), e, lt(e)];
      }
      function Qt(t) {
        var e = t.state, n = t.options, r = t.name;
        if (!e.modifiersData[r]._skip) {
          for (var o = n.mainAxis, i = o === void 0 ? true : o, a = n.altAxis, s = a === void 0 ? true : a, f = n.fallbackPlacements, c = n.padding, u = n.boundary, m = n.rootBoundary, v = n.altBoundary, l = n.flipVariations, h2 = l === void 0 ? true : l, p = n.allowedAutoPlacements, g = e.options.placement, x = q(g), y = x === g, $ = f || (y || !h2 ? [be(g)] : Kt(g)), d = [g].concat($).reduce(function(z, V) {
            return z.concat(q(V) === me ? Jt(e, { placement: V, boundary: u, rootBoundary: m, padding: c, flipVariations: h2, allowedAutoPlacements: p }) : V);
          }, []), b = e.rects.reference, w = e.rects.popper, O = /* @__PURE__ */ new Map(), j = true, A = d[0], k = 0; k < d.length; k++) {
            var D = d[k], S = q(D), L = te(D) === U, re = [E, R].indexOf(S) >= 0, oe = re ? "width" : "height", M = ne(e, { placement: D, boundary: u, rootBoundary: m, altBoundary: v, padding: c }), T = re ? L ? W : P : L ? R : E;
            b[oe] > w[oe] && (T = be(T));
            var pe = be(T), _ = [];
            if (i && _.push(M[S] <= 0), s && _.push(M[T] <= 0, M[pe] <= 0), _.every(function(z) {
              return z;
            })) {
              A = D, j = false;
              break;
            }
            O.set(D, _);
          }
          if (j) for (var ue = h2 ? 3 : 1, xe = function(z) {
            var V = d.find(function(de) {
              var ae = O.get(de);
              if (ae) return ae.slice(0, z).every(function(Y) {
                return Y;
              });
            });
            if (V) return A = V, "break";
          }, ie = ue; ie > 0; ie--) {
            var le = xe(ie);
            if (le === "break") break;
          }
          e.placement !== A && (e.modifiersData[r]._skip = true, e.placement = A, e.reset = true);
        }
      }
      var vt = { name: "flip", enabled: true, phase: "main", fn: Qt, requiresIfExists: ["offset"], data: { _skip: false } };
      function gt(t, e, n) {
        return n === void 0 && (n = { x: 0, y: 0 }), { top: t.top - e.height - n.y, right: t.right - e.width + n.x, bottom: t.bottom - e.height + n.y, left: t.left - e.width - n.x };
      }
      function yt(t) {
        return [E, W, R, P].some(function(e) {
          return t[e] >= 0;
        });
      }
      function Zt(t) {
        var e = t.state, n = t.name, r = e.rects.reference, o = e.rects.popper, i = e.modifiersData.preventOverflow, a = ne(e, { elementContext: "reference" }), s = ne(e, { altBoundary: true }), f = gt(a, r), c = gt(s, o, i), u = yt(f), m = yt(c);
        e.modifiersData[n] = { referenceClippingOffsets: f, popperEscapeOffsets: c, isReferenceHidden: u, hasPopperEscaped: m }, e.attributes.popper = Object.assign({}, e.attributes.popper, { "data-popper-reference-hidden": u, "data-popper-escaped": m });
      }
      var bt = { name: "hide", enabled: true, phase: "main", requiresIfExists: ["preventOverflow"], fn: Zt };
      function en(t, e, n) {
        var r = q(t), o = [P, E].indexOf(r) >= 0 ? -1 : 1, i = typeof n == "function" ? n(Object.assign({}, e, { placement: t })) : n, a = i[0], s = i[1];
        return a = a || 0, s = (s || 0) * o, [P, W].indexOf(r) >= 0 ? { x: s, y: a } : { x: a, y: s };
      }
      function tn(t) {
        var e = t.state, n = t.options, r = t.name, o = n.offset, i = o === void 0 ? [0, 0] : o, a = Ee.reduce(function(u, m) {
          return u[m] = en(m, e.rects, i), u;
        }, {}), s = a[e.placement], f = s.x, c = s.y;
        e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += f, e.modifiersData.popperOffsets.y += c), e.modifiersData[r] = a;
      }
      var wt = { name: "offset", enabled: true, phase: "main", requires: ["popperOffsets"], fn: tn };
      function nn(t) {
        var e = t.state, n = t.name;
        e.modifiersData[n] = mt({ reference: e.rects.reference, element: e.rects.popper, strategy: "absolute", placement: e.placement });
      }
      var He = { name: "popperOffsets", enabled: true, phase: "read", fn: nn, data: {} };
      function rn(t) {
        return t === "x" ? "y" : "x";
      }
      function on(t) {
        var e = t.state, n = t.options, r = t.name, o = n.mainAxis, i = o === void 0 ? true : o, a = n.altAxis, s = a === void 0 ? false : a, f = n.boundary, c = n.rootBoundary, u = n.altBoundary, m = n.padding, v = n.tether, l = v === void 0 ? true : v, h2 = n.tetherOffset, p = h2 === void 0 ? 0 : h2, g = ne(e, { boundary: f, rootBoundary: c, padding: m, altBoundary: u }), x = q(e.placement), y = te(e.placement), $ = !y, d = Le(x), b = rn(d), w = e.modifiersData.popperOffsets, O = e.rects.reference, j = e.rects.popper, A = typeof p == "function" ? p(Object.assign({}, e.rects, { placement: e.placement })) : p, k = typeof A == "number" ? { mainAxis: A, altAxis: A } : Object.assign({ mainAxis: 0, altAxis: 0 }, A), D = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, S = { x: 0, y: 0 };
        if (w) {
          if (i) {
            var L, re = d === "y" ? E : P, oe = d === "y" ? R : W, M = d === "y" ? "height" : "width", T = w[d], pe = T + g[re], _ = T - g[oe], ue = l ? -j[M] / 2 : 0, xe = y === U ? O[M] : j[M], ie = y === U ? -j[M] : -O[M], le = e.elements.arrow, z = l && le ? ke(le) : { width: 0, height: 0 }, V = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : st(), de = V[re], ae = V[oe], Y = fe(0, O[M], z[M]), jt = $ ? O[M] / 2 - ue - Y - de - k.mainAxis : xe - Y - de - k.mainAxis, Dt = $ ? -O[M] / 2 + ue + Y + ae + k.mainAxis : ie + Y + ae + k.mainAxis, Oe = e.elements.arrow && se(e.elements.arrow), Et = Oe ? d === "y" ? Oe.clientTop || 0 : Oe.clientLeft || 0 : 0, Ce = (L = D == null ? void 0 : D[d]) != null ? L : 0, Pt = T + jt - Ce - Et, At = T + Dt - Ce, qe = fe(l ? ve(pe, Pt) : pe, T, l ? X(_, At) : _);
            w[d] = qe, S[d] = qe - T;
          }
          if (s) {
            var Ve, kt = d === "x" ? E : P, Lt = d === "x" ? R : W, F = w[b], he = b === "y" ? "height" : "width", Ne = F + g[kt], Ie = F - g[Lt], $e = [E, P].indexOf(x) !== -1, _e = (Ve = D == null ? void 0 : D[b]) != null ? Ve : 0, ze = $e ? Ne : F - O[he] - j[he] - _e + k.altAxis, Fe = $e ? F + O[he] + j[he] - _e - k.altAxis : Ie, Ue = l && $e ? St(ze, F, Fe) : fe(l ? ze : Ne, F, l ? Fe : Ie);
            w[b] = Ue, S[b] = Ue - F;
          }
          e.modifiersData[r] = S;
        }
      }
      var xt = { name: "preventOverflow", enabled: true, phase: "main", fn: on, requiresIfExists: ["offset"] };
      function an(t) {
        return { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop };
      }
      function sn(t) {
        return t === H(t) || !B(t) ? We(t) : an(t);
      }
      function fn(t) {
        var e = t.getBoundingClientRect(), n = Z(e.width) / t.offsetWidth || 1, r = Z(e.height) / t.offsetHeight || 1;
        return n !== 1 || r !== 1;
      }
      function cn(t, e, n) {
        n === void 0 && (n = false);
        var r = B(e), o = B(e) && fn(e), i = I(e), a = ee(t, o), s = { scrollLeft: 0, scrollTop: 0 }, f = { x: 0, y: 0 };
        return (r || !r && !n) && ((C(e) !== "body" || Se(i)) && (s = sn(e)), B(e) ? (f = ee(e, true), f.x += e.clientLeft, f.y += e.clientTop) : i && (f.x = Be(i))), { x: a.left + s.scrollLeft - f.x, y: a.top + s.scrollTop - f.y, width: a.width, height: a.height };
      }
      function pn(t) {
        var e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), r = [];
        t.forEach(function(i) {
          e.set(i.name, i);
        });
        function o(i) {
          n.add(i.name);
          var a = [].concat(i.requires || [], i.requiresIfExists || []);
          a.forEach(function(s) {
            if (!n.has(s)) {
              var f = e.get(s);
              f && o(f);
            }
          }), r.push(i);
        }
        return t.forEach(function(i) {
          n.has(i.name) || o(i);
        }), r;
      }
      function un(t) {
        var e = pn(t);
        return ot.reduce(function(n, r) {
          return n.concat(e.filter(function(o) {
            return o.phase === r;
          }));
        }, []);
      }
      function ln(t) {
        var e;
        return function() {
          return e || (e = new Promise(function(n) {
            Promise.resolve().then(function() {
              e = void 0, n(t());
            });
          })), e;
        };
      }
      function dn(t) {
        var e = t.reduce(function(n, r) {
          var o = n[r.name];
          return n[r.name] = o ? Object.assign({}, o, r, { options: Object.assign({}, o.options, r.options), data: Object.assign({}, o.data, r.data) }) : r, n;
        }, {});
        return Object.keys(e).map(function(n) {
          return e[n];
        });
      }
      var Ot = { placement: "bottom", modifiers: [], strategy: "absolute" };
      function $t() {
        for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
        return !e.some(function(r) {
          return !(r && typeof r.getBoundingClientRect == "function");
        });
      }
      function we(t) {
        t === void 0 && (t = {});
        var e = t, n = e.defaultModifiers, r = n === void 0 ? [] : n, o = e.defaultOptions, i = o === void 0 ? Ot : o;
        return function(a, s, f) {
          f === void 0 && (f = i);
          var c = { placement: "bottom", orderedModifiers: [], options: Object.assign({}, Ot, i), modifiersData: {}, elements: { reference: a, popper: s }, attributes: {}, styles: {} }, u = [], m = false, v = { state: c, setOptions: function(p) {
            var g = typeof p == "function" ? p(c.options) : p;
            h2(), c.options = Object.assign({}, i, c.options, g), c.scrollParents = { reference: Q(a) ? ce(a) : a.contextElement ? ce(a.contextElement) : [], popper: ce(s) };
            var x = un(dn([].concat(r, c.options.modifiers)));
            return c.orderedModifiers = x.filter(function(y) {
              return y.enabled;
            }), l(), v.update();
          }, forceUpdate: function() {
            if (!m) {
              var p = c.elements, g = p.reference, x = p.popper;
              if ($t(g, x)) {
                c.rects = { reference: cn(g, se(x), c.options.strategy === "fixed"), popper: ke(x) }, c.reset = false, c.placement = c.options.placement, c.orderedModifiers.forEach(function(j) {
                  return c.modifiersData[j.name] = Object.assign({}, j.data);
                });
                for (var y = 0; y < c.orderedModifiers.length; y++) {
                  if (c.reset === true) {
                    c.reset = false, y = -1;
                    continue;
                  }
                  var $ = c.orderedModifiers[y], d = $.fn, b = $.options, w = b === void 0 ? {} : b, O = $.name;
                  typeof d == "function" && (c = d({ state: c, options: w, name: O, instance: v }) || c);
                }
              }
            }
          }, update: ln(function() {
            return new Promise(function(p) {
              v.forceUpdate(), p(c);
            });
          }), destroy: function() {
            h2(), m = true;
          } };
          if (!$t(a, s)) return v;
          v.setOptions(f).then(function(p) {
            !m && f.onFirstUpdate && f.onFirstUpdate(p);
          });
          function l() {
            c.orderedModifiers.forEach(function(p) {
              var g = p.name, x = p.options, y = x === void 0 ? {} : x, $ = p.effect;
              if (typeof $ == "function") {
                var d = $({ state: c, name: g, instance: v, options: y }), b = function() {
                };
                u.push(d || b);
              }
            });
          }
          function h2() {
            u.forEach(function(p) {
              return p();
            }), u = [];
          }
          return v;
        };
      }
      we();
      var mn = [Re, He, Me, Ae];
      we({ defaultModifiers: mn });
      var gn = [Re, He, Me, Ae, wt, vt, xt, pt, bt], yn = we({ defaultModifiers: gn });
      const usePopper = (referenceElementRef, popperElementRef, opts = {}) => {
        const stateUpdater = {
          name: "updateState",
          enabled: true,
          phase: "write",
          fn: ({ state }) => {
            const derivedState = deriveState(state);
            Object.assign(states.value, derivedState);
          },
          requires: ["computeStyles"]
        };
        const options = vue.computed(() => {
          const { onFirstUpdate, placement, strategy, modifiers } = vue.unref(opts);
          return {
            onFirstUpdate,
            placement: placement || "bottom",
            strategy: strategy || "absolute",
            modifiers: [
              ...modifiers || [],
              stateUpdater,
              { name: "applyStyles", enabled: false }
            ]
          };
        });
        const instanceRef = vue.shallowRef();
        const states = vue.ref({
          styles: {
            popper: {
              position: vue.unref(options).strategy,
              left: "0",
              top: "0"
            },
            arrow: {
              position: "absolute"
            }
          },
          attributes: {}
        });
        const destroy = () => {
          if (!instanceRef.value)
            return;
          instanceRef.value.destroy();
          instanceRef.value = void 0;
        };
        vue.watch(options, (newOptions) => {
          const instance = vue.unref(instanceRef);
          if (instance) {
            instance.setOptions(newOptions);
          }
        }, {
          deep: true
        });
        vue.watch([referenceElementRef, popperElementRef], ([referenceElement, popperElement]) => {
          destroy();
          if (!referenceElement || !popperElement)
            return;
          instanceRef.value = yn(referenceElement, popperElement, vue.unref(options));
        });
        vue.onBeforeUnmount(() => {
          destroy();
        });
        return {
          state: vue.computed(() => {
            var _a2;
            return { ...((_a2 = vue.unref(instanceRef)) == null ? void 0 : _a2.state) || {} };
          }),
          styles: vue.computed(() => vue.unref(states).styles),
          attributes: vue.computed(() => vue.unref(states).attributes),
          update: () => {
            var _a2;
            return (_a2 = vue.unref(instanceRef)) == null ? void 0 : _a2.update();
          },
          forceUpdate: () => {
            var _a2;
            return (_a2 = vue.unref(instanceRef)) == null ? void 0 : _a2.forceUpdate();
          },
          instanceRef: vue.computed(() => vue.unref(instanceRef))
        };
      };
      function deriveState(state) {
        const elements = Object.keys(state.elements);
        const styles = fromPairs(elements.map((element) => [element, state.styles[element] || {}]));
        const attributes = fromPairs(elements.map((element) => [element, state.attributes[element]]));
        return {
          styles,
          attributes
        };
      }
      const useSameTarget = (handleClick) => {
        if (!handleClick) {
          return { onClick: NOOP, onMousedown: NOOP, onMouseup: NOOP };
        }
        let mousedownTarget = false;
        let mouseupTarget = false;
        const onClick = (e) => {
          if (mousedownTarget && mouseupTarget) {
            handleClick(e);
          }
          mousedownTarget = mouseupTarget = false;
        };
        const onMousedown = (e) => {
          mousedownTarget = e.target === e.currentTarget;
        };
        const onMouseup = (e) => {
          mouseupTarget = e.target === e.currentTarget;
        };
        return { onClick, onMousedown, onMouseup };
      };
      function useTimeout() {
        let timeoutHandle;
        const registerTimeout = (fn2, delay) => {
          cancelTimeout();
          timeoutHandle = window.setTimeout(fn2, delay);
        };
        const cancelTimeout = () => window.clearTimeout(timeoutHandle);
        tryOnScopeDispose(() => cancelTimeout());
        return {
          registerTimeout,
          cancelTimeout
        };
      }
      const defaultIdInjection = {
        prefix: Math.floor(Math.random() * 1e4),
        current: 0
      };
      const ID_INJECTION_KEY = Symbol("elIdInjection");
      const useIdInjection = () => {
        return vue.getCurrentInstance() ? vue.inject(ID_INJECTION_KEY, defaultIdInjection) : defaultIdInjection;
      };
      const useId = (deterministicId) => {
        const idInjection = useIdInjection();
        const namespace = useGetDerivedNamespace();
        const idRef = computedEager(() => vue.unref(deterministicId) || `${namespace.value}-id-${idInjection.prefix}-${idInjection.current++}`);
        return idRef;
      };
      let registeredEscapeHandlers = [];
      const cachedHandler = (event) => {
        if (event.code === EVENT_CODE.esc) {
          registeredEscapeHandlers.forEach((registeredHandler) => registeredHandler(event));
        }
      };
      const useEscapeKeydown = (handler) => {
        vue.onMounted(() => {
          if (registeredEscapeHandlers.length === 0) {
            document.addEventListener("keydown", cachedHandler);
          }
          if (isClient)
            registeredEscapeHandlers.push(handler);
        });
        vue.onBeforeUnmount(() => {
          registeredEscapeHandlers = registeredEscapeHandlers.filter((registeredHandler) => registeredHandler !== handler);
          if (registeredEscapeHandlers.length === 0) {
            if (isClient)
              document.removeEventListener("keydown", cachedHandler);
          }
        });
      };
      const usePopperContainerId = () => {
        const namespace = useGetDerivedNamespace();
        const idInjection = useIdInjection();
        const id = vue.computed(() => {
          return `${namespace.value}-popper-container-${idInjection.prefix}`;
        });
        const selector = vue.computed(() => `#${id.value}`);
        return {
          id,
          selector
        };
      };
      const createContainer = (id) => {
        const container = document.createElement("div");
        container.id = id;
        document.body.appendChild(container);
        return container;
      };
      const usePopperContainer = () => {
        const { id, selector } = usePopperContainerId();
        vue.onBeforeMount(() => {
          if (!isClient)
            return;
          if (!document.body.querySelector(selector.value)) {
            createContainer(id.value);
          }
        });
        return {
          id,
          selector
        };
      };
      const useDelayedToggleProps = buildProps({
        showAfter: {
          type: Number,
          default: 0
        },
        hideAfter: {
          type: Number,
          default: 200
        },
        autoClose: {
          type: Number,
          default: 0
        }
      });
      const useDelayedToggle = ({
        showAfter,
        hideAfter,
        autoClose,
        open,
        close
      }) => {
        const { registerTimeout } = useTimeout();
        const {
          registerTimeout: registerTimeoutForAutoClose,
          cancelTimeout: cancelTimeoutForAutoClose
        } = useTimeout();
        const onOpen = (event) => {
          registerTimeout(() => {
            open(event);
            const _autoClose = vue.unref(autoClose);
            if (isNumber(_autoClose) && _autoClose > 0) {
              registerTimeoutForAutoClose(() => {
                close(event);
              }, _autoClose);
            }
          }, vue.unref(showAfter));
        };
        const onClose = (event) => {
          cancelTimeoutForAutoClose();
          registerTimeout(() => {
            close(event);
          }, vue.unref(hideAfter));
        };
        return {
          onOpen,
          onClose
        };
      };
      const FORWARD_REF_INJECTION_KEY = Symbol("elForwardRef");
      const useForwardRef = (forwardRef) => {
        const setForwardRef = (el) => {
          forwardRef.value = el;
        };
        vue.provide(FORWARD_REF_INJECTION_KEY, {
          setForwardRef
        });
      };
      const useForwardRefDirective = (setForwardRef) => {
        return {
          mounted(el) {
            setForwardRef(el);
          },
          updated(el) {
            setForwardRef(el);
          },
          unmounted() {
            setForwardRef(null);
          }
        };
      };
      const initial = {
        current: 0
      };
      const zIndex = vue.ref(0);
      const defaultInitialZIndex = 2e3;
      const ZINDEX_INJECTION_KEY = Symbol("elZIndexContextKey");
      const zIndexContextKey = Symbol("zIndexContextKey");
      const useZIndex = (zIndexOverrides) => {
        const increasingInjection = vue.getCurrentInstance() ? vue.inject(ZINDEX_INJECTION_KEY, initial) : initial;
        const zIndexInjection = zIndexOverrides || (vue.getCurrentInstance() ? vue.inject(zIndexContextKey, void 0) : void 0);
        const initialZIndex = vue.computed(() => {
          const zIndexFromInjection = vue.unref(zIndexInjection);
          return isNumber(zIndexFromInjection) ? zIndexFromInjection : defaultInitialZIndex;
        });
        const currentZIndex = vue.computed(() => initialZIndex.value + zIndex.value);
        const nextZIndex = () => {
          increasingInjection.current++;
          zIndex.value = increasingInjection.current;
          return currentZIndex.value;
        };
        if (!isClient && !vue.inject(ZINDEX_INJECTION_KEY)) ;
        return {
          initialZIndex,
          currentZIndex,
          nextZIndex
        };
      };
      function useCursor(input) {
        let selectionInfo;
        function recordCursor() {
          if (input.value == void 0)
            return;
          const { selectionStart, selectionEnd, value } = input.value;
          if (selectionStart == null || selectionEnd == null)
            return;
          const beforeTxt = value.slice(0, Math.max(0, selectionStart));
          const afterTxt = value.slice(Math.max(0, selectionEnd));
          selectionInfo = {
            selectionStart,
            selectionEnd,
            value,
            beforeTxt,
            afterTxt
          };
        }
        function setCursor() {
          if (input.value == void 0 || selectionInfo == void 0)
            return;
          const { value } = input.value;
          const { beforeTxt, afterTxt, selectionStart } = selectionInfo;
          if (beforeTxt == void 0 || afterTxt == void 0 || selectionStart == void 0)
            return;
          let startPos = value.length;
          if (value.endsWith(afterTxt)) {
            startPos = value.length - afterTxt.length;
          } else if (value.startsWith(beforeTxt)) {
            startPos = beforeTxt.length;
          } else {
            const beforeLastChar = beforeTxt[selectionStart - 1];
            const newIndex = value.indexOf(beforeLastChar, selectionStart - 1);
            if (newIndex !== -1) {
              startPos = newIndex + 1;
            }
          }
          input.value.setSelectionRange(startPos, startPos);
        }
        return [recordCursor, setCursor];
      }
      const useSizeProp = buildProp({
        type: String,
        values: componentSizes,
        required: false
      });
      const SIZE_INJECTION_KEY = Symbol("size");
      const useGlobalSize = () => {
        const injectedSize = vue.inject(SIZE_INJECTION_KEY, {});
        return vue.computed(() => {
          return vue.unref(injectedSize.size) || "";
        });
      };
      function useFocusController(target, {
        beforeFocus,
        afterFocus,
        beforeBlur,
        afterBlur
      } = {}) {
        const instance = vue.getCurrentInstance();
        const { emit } = instance;
        const wrapperRef = vue.shallowRef();
        const isFocused = vue.ref(false);
        const handleFocus = (event) => {
          const cancelFocus = isFunction$1(beforeFocus) ? beforeFocus(event) : false;
          if (cancelFocus || isFocused.value)
            return;
          isFocused.value = true;
          emit("focus", event);
          afterFocus == null ? void 0 : afterFocus();
        };
        const handleBlur = (event) => {
          var _a2;
          const cancelBlur = isFunction$1(beforeBlur) ? beforeBlur(event) : false;
          if (cancelBlur || event.relatedTarget && ((_a2 = wrapperRef.value) == null ? void 0 : _a2.contains(event.relatedTarget)))
            return;
          isFocused.value = false;
          emit("blur", event);
          afterBlur == null ? void 0 : afterBlur();
        };
        const handleClick = () => {
          var _a2, _b;
          if (((_a2 = wrapperRef.value) == null ? void 0 : _a2.contains(document.activeElement)) && wrapperRef.value !== document.activeElement)
            return;
          (_b = target.value) == null ? void 0 : _b.focus();
        };
        vue.watch(wrapperRef, (el) => {
          if (el) {
            el.setAttribute("tabindex", "-1");
          }
        });
        useEventListener(wrapperRef, "focus", handleFocus, true);
        useEventListener(wrapperRef, "blur", handleBlur, true);
        useEventListener(wrapperRef, "click", handleClick, true);
        return {
          isFocused,
          wrapperRef,
          handleFocus,
          handleBlur
        };
      }
      function useComposition({
        afterComposition,
        emit
      }) {
        const isComposing = vue.ref(false);
        const handleCompositionStart = (event) => {
          emit == null ? void 0 : emit("compositionstart", event);
          isComposing.value = true;
        };
        const handleCompositionUpdate = (event) => {
          var _a2;
          emit == null ? void 0 : emit("compositionupdate", event);
          const text = (_a2 = event.target) == null ? void 0 : _a2.value;
          const lastCharacter = text[text.length - 1] || "";
          isComposing.value = !isKorean(lastCharacter);
        };
        const handleCompositionEnd = (event) => {
          emit == null ? void 0 : emit("compositionend", event);
          if (isComposing.value) {
            isComposing.value = false;
            vue.nextTick(() => afterComposition(event));
          }
        };
        const handleComposition = (event) => {
          event.type === "compositionend" ? handleCompositionEnd(event) : handleCompositionUpdate(event);
        };
        return {
          isComposing,
          handleComposition,
          handleCompositionStart,
          handleCompositionUpdate,
          handleCompositionEnd
        };
      }
      const emptyValuesContextKey = Symbol("emptyValuesContextKey");
      const DEFAULT_EMPTY_VALUES = ["", void 0, null];
      const DEFAULT_VALUE_ON_CLEAR = void 0;
      const useEmptyValuesProps = buildProps({
        emptyValues: Array,
        valueOnClear: {
          type: [String, Number, Boolean, Function],
          default: void 0,
          validator: (val) => isFunction$1(val) ? !val() : !val
        }
      });
      const useEmptyValues = (props, defaultValue) => {
        const config = vue.getCurrentInstance() ? vue.inject(emptyValuesContextKey, vue.ref({})) : vue.ref({});
        const emptyValues = vue.computed(() => props.emptyValues || config.value.emptyValues || DEFAULT_EMPTY_VALUES);
        const valueOnClear = vue.computed(() => {
          if (isFunction$1(props.valueOnClear)) {
            return props.valueOnClear();
          } else if (props.valueOnClear !== void 0) {
            return props.valueOnClear;
          } else if (isFunction$1(config.value.valueOnClear)) {
            return config.value.valueOnClear();
          } else if (config.value.valueOnClear !== void 0) {
            return config.value.valueOnClear;
          }
          return DEFAULT_VALUE_ON_CLEAR;
        });
        const isEmptyValue2 = (value) => {
          return emptyValues.value.includes(value);
        };
        if (!emptyValues.value.includes(valueOnClear.value)) ;
        return {
          emptyValues,
          valueOnClear,
          isEmptyValue: isEmptyValue2
        };
      };
      const ariaProps = buildProps({
        ariaLabel: String,
        ariaOrientation: {
          type: String,
          values: ["horizontal", "vertical", "undefined"]
        },
        ariaControls: String
      });
      const useAriaProps = (arias) => {
        return pick(ariaProps, arias);
      };
      const configProviderContextKey = Symbol();
      const globalConfig = vue.ref();
      function useGlobalConfig(key, defaultValue = void 0) {
        const config = vue.getCurrentInstance() ? vue.inject(configProviderContextKey, globalConfig) : globalConfig;
        if (key) {
          return vue.computed(() => {
            var _a2, _b;
            return (_b = (_a2 = config.value) == null ? void 0 : _a2[key]) != null ? _b : defaultValue;
          });
        } else {
          return config;
        }
      }
      function useGlobalComponentSettings(block, sizeFallback) {
        const config = useGlobalConfig();
        const ns = useNamespace(block, vue.computed(() => {
          var _a2;
          return ((_a2 = config.value) == null ? void 0 : _a2.namespace) || defaultNamespace;
        }));
        const locale = useLocale(vue.computed(() => {
          var _a2;
          return (_a2 = config.value) == null ? void 0 : _a2.locale;
        }));
        const zIndex2 = useZIndex(vue.computed(() => {
          var _a2;
          return ((_a2 = config.value) == null ? void 0 : _a2.zIndex) || defaultInitialZIndex;
        }));
        const size = vue.computed(() => {
          var _a2;
          return vue.unref(sizeFallback) || ((_a2 = config.value) == null ? void 0 : _a2.size) || "";
        });
        provideGlobalConfig(vue.computed(() => vue.unref(config) || {}));
        return {
          ns,
          locale,
          zIndex: zIndex2,
          size
        };
      }
      const provideGlobalConfig = (config, app2, global2 = false) => {
        var _a2;
        const inSetup = !!vue.getCurrentInstance();
        const oldConfig = inSetup ? useGlobalConfig() : void 0;
        const provideFn = (_a2 = void 0) != null ? _a2 : inSetup ? vue.provide : void 0;
        if (!provideFn) {
          return;
        }
        const context = vue.computed(() => {
          const cfg = vue.unref(config);
          if (!(oldConfig == null ? void 0 : oldConfig.value))
            return cfg;
          return mergeConfig(oldConfig.value, cfg);
        });
        provideFn(configProviderContextKey, context);
        provideFn(localeContextKey, vue.computed(() => context.value.locale));
        provideFn(namespaceContextKey, vue.computed(() => context.value.namespace));
        provideFn(zIndexContextKey, vue.computed(() => context.value.zIndex));
        provideFn(SIZE_INJECTION_KEY, {
          size: vue.computed(() => context.value.size || "")
        });
        provideFn(emptyValuesContextKey, vue.computed(() => ({
          emptyValues: context.value.emptyValues,
          valueOnClear: context.value.valueOnClear
        })));
        if (global2 || !globalConfig.value) {
          globalConfig.value = context.value;
        }
        return context;
      };
      const mergeConfig = (a, b) => {
        const keys2 = [.../* @__PURE__ */ new Set([...keysOf(a), ...keysOf(b)])];
        const obj = {};
        for (const key of keys2) {
          obj[key] = b[key] !== void 0 ? b[key] : a[key];
        }
        return obj;
      };
      const configProviderProps = buildProps({
        a11y: {
          type: Boolean,
          default: true
        },
        locale: {
          type: definePropType(Object)
        },
        size: useSizeProp,
        button: {
          type: definePropType(Object)
        },
        experimentalFeatures: {
          type: definePropType(Object)
        },
        keyboardNavigation: {
          type: Boolean,
          default: true
        },
        message: {
          type: definePropType(Object)
        },
        zIndex: Number,
        namespace: {
          type: String,
          default: "el"
        },
        ...useEmptyValuesProps
      });
      const messageConfig = {};
      const ConfigProvider = vue.defineComponent({
        name: "ElConfigProvider",
        props: configProviderProps,
        setup(props, { slots }) {
          vue.watch(() => props.message, (val) => {
            Object.assign(messageConfig, val != null ? val : {});
          }, { immediate: true, deep: true });
          const config = provideGlobalConfig(props);
          return () => vue.renderSlot(slots, "default", { config: config == null ? void 0 : config.value });
        }
      });
      const ElConfigProvider = withInstall(ConfigProvider);
      var _export_sfc$1 = (sfc, props) => {
        const target = sfc.__vccOpts || sfc;
        for (const [key, val] of props) {
          target[key] = val;
        }
        return target;
      };
      const iconProps = buildProps({
        size: {
          type: definePropType([Number, String])
        },
        color: {
          type: String
        }
      });
      const __default__$s = vue.defineComponent({
        name: "ElIcon",
        inheritAttrs: false
      });
      const _sfc_main$F = /* @__PURE__ */ vue.defineComponent({
        ...__default__$s,
        props: iconProps,
        setup(__props) {
          const props = __props;
          const ns = useNamespace("icon");
          const style = vue.computed(() => {
            const { size, color } = props;
            if (!size && !color)
              return {};
            return {
              fontSize: isUndefined(size) ? void 0 : addUnit(size),
              "--color": color
            };
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("i", vue.mergeProps({
              class: vue.unref(ns).b(),
              style: vue.unref(style)
            }, _ctx.$attrs), [
              vue.renderSlot(_ctx.$slots, "default")
            ], 16);
          };
        }
      });
      var Icon$1 = /* @__PURE__ */ _export_sfc$1(_sfc_main$F, [["__file", "icon.vue"]]);
      const ElIcon = withInstall(Icon$1);
      const formContextKey = Symbol("formContextKey");
      const formItemContextKey = Symbol("formItemContextKey");
      const useFormSize = (fallback, ignore = {}) => {
        const emptyRef = vue.ref(void 0);
        const size = ignore.prop ? emptyRef : useProp("size");
        const globalConfig2 = ignore.global ? emptyRef : useGlobalSize();
        const form = ignore.form ? { size: void 0 } : vue.inject(formContextKey, void 0);
        const formItem = ignore.formItem ? { size: void 0 } : vue.inject(formItemContextKey, void 0);
        return vue.computed(() => size.value || vue.unref(fallback) || (formItem == null ? void 0 : formItem.size) || (form == null ? void 0 : form.size) || globalConfig2.value || "");
      };
      const useFormDisabled = (fallback) => {
        const disabled = useProp("disabled");
        const form = vue.inject(formContextKey, void 0);
        return vue.computed(() => disabled.value || vue.unref(fallback) || (form == null ? void 0 : form.disabled) || false);
      };
      const useFormItem = () => {
        const form = vue.inject(formContextKey, void 0);
        const formItem = vue.inject(formItemContextKey, void 0);
        return {
          form,
          formItem
        };
      };
      const useFormItemInputId = (props, {
        formItemContext,
        disableIdGeneration,
        disableIdManagement
      }) => {
        if (!disableIdGeneration) {
          disableIdGeneration = vue.ref(false);
        }
        if (!disableIdManagement) {
          disableIdManagement = vue.ref(false);
        }
        const inputId = vue.ref();
        let idUnwatch = void 0;
        const isLabeledByFormItem = vue.computed(() => {
          var _a2;
          return !!(!(props.label || props.ariaLabel) && formItemContext && formItemContext.inputIds && ((_a2 = formItemContext.inputIds) == null ? void 0 : _a2.length) <= 1);
        });
        vue.onMounted(() => {
          idUnwatch = vue.watch([vue.toRef(props, "id"), disableIdGeneration], ([id, disableIdGeneration2]) => {
            const newId = id != null ? id : !disableIdGeneration2 ? useId().value : void 0;
            if (newId !== inputId.value) {
              if (formItemContext == null ? void 0 : formItemContext.removeInputId) {
                inputId.value && formItemContext.removeInputId(inputId.value);
                if (!(disableIdManagement == null ? void 0 : disableIdManagement.value) && !disableIdGeneration2 && newId) {
                  formItemContext.addInputId(newId);
                }
              }
              inputId.value = newId;
            }
          }, { immediate: true });
        });
        vue.onUnmounted(() => {
          idUnwatch && idUnwatch();
          if (formItemContext == null ? void 0 : formItemContext.removeInputId) {
            inputId.value && formItemContext.removeInputId(inputId.value);
          }
        });
        return {
          isLabeledByFormItem,
          inputId
        };
      };
      const formMetaProps = buildProps({
        size: {
          type: String,
          values: componentSizes
        },
        disabled: Boolean
      });
      const formProps = buildProps({
        ...formMetaProps,
        model: Object,
        rules: {
          type: definePropType(Object)
        },
        labelPosition: {
          type: String,
          values: ["left", "right", "top"],
          default: "right"
        },
        requireAsteriskPosition: {
          type: String,
          values: ["left", "right"],
          default: "left"
        },
        labelWidth: {
          type: [String, Number],
          default: ""
        },
        labelSuffix: {
          type: String,
          default: ""
        },
        inline: Boolean,
        inlineMessage: Boolean,
        statusIcon: Boolean,
        showMessage: {
          type: Boolean,
          default: true
        },
        validateOnRuleChange: {
          type: Boolean,
          default: true
        },
        hideRequiredAsterisk: Boolean,
        scrollToError: Boolean,
        scrollIntoViewOptions: {
          type: [Object, Boolean]
        }
      });
      const formEmits = {
        validate: (prop, isValid, message2) => (isArray$1(prop) || isString(prop)) && isBoolean(isValid) && isString(message2)
      };
      function useFormLabelWidth() {
        const potentialLabelWidthArr = vue.ref([]);
        const autoLabelWidth = vue.computed(() => {
          if (!potentialLabelWidthArr.value.length)
            return "0";
          const max = Math.max(...potentialLabelWidthArr.value);
          return max ? `${max}px` : "";
        });
        function getLabelWidthIndex(width) {
          const index = potentialLabelWidthArr.value.indexOf(width);
          if (index === -1 && autoLabelWidth.value === "0") ;
          return index;
        }
        function registerLabelWidth(val, oldVal) {
          if (val && oldVal) {
            const index = getLabelWidthIndex(oldVal);
            potentialLabelWidthArr.value.splice(index, 1, val);
          } else if (val) {
            potentialLabelWidthArr.value.push(val);
          }
        }
        function deregisterLabelWidth(val) {
          const index = getLabelWidthIndex(val);
          if (index > -1) {
            potentialLabelWidthArr.value.splice(index, 1);
          }
        }
        return {
          autoLabelWidth,
          registerLabelWidth,
          deregisterLabelWidth
        };
      }
      const filterFields = (fields, props) => {
        const normalized = castArray(props);
        return normalized.length > 0 ? fields.filter((field) => field.prop && normalized.includes(field.prop)) : fields;
      };
      const COMPONENT_NAME$5 = "ElForm";
      const __default__$r = vue.defineComponent({
        name: COMPONENT_NAME$5
      });
      const _sfc_main$E = /* @__PURE__ */ vue.defineComponent({
        ...__default__$r,
        props: formProps,
        emits: formEmits,
        setup(__props, { expose, emit }) {
          const props = __props;
          const fields = [];
          const formSize = useFormSize();
          const ns = useNamespace("form");
          const formClasses = vue.computed(() => {
            const { labelPosition, inline } = props;
            return [
              ns.b(),
              ns.m(formSize.value || "default"),
              {
                [ns.m(`label-${labelPosition}`)]: labelPosition,
                [ns.m("inline")]: inline
              }
            ];
          });
          const getField = (prop) => {
            return fields.find((field) => field.prop === prop);
          };
          const addField = (field) => {
            fields.push(field);
          };
          const removeField = (field) => {
            if (field.prop) {
              fields.splice(fields.indexOf(field), 1);
            }
          };
          const resetFields = (properties = []) => {
            if (!props.model) {
              return;
            }
            filterFields(fields, properties).forEach((field) => field.resetField());
          };
          const clearValidate = (props2 = []) => {
            filterFields(fields, props2).forEach((field) => field.clearValidate());
          };
          const isValidatable = vue.computed(() => {
            const hasModel = !!props.model;
            return hasModel;
          });
          const obtainValidateFields = (props2) => {
            if (fields.length === 0)
              return [];
            const filteredFields = filterFields(fields, props2);
            if (!filteredFields.length) {
              return [];
            }
            return filteredFields;
          };
          const validate = async (callback) => validateField(void 0, callback);
          const doValidateField = async (props2 = []) => {
            if (!isValidatable.value)
              return false;
            const fields2 = obtainValidateFields(props2);
            if (fields2.length === 0)
              return true;
            let validationErrors = {};
            for (const field of fields2) {
              try {
                await field.validate("");
              } catch (fields3) {
                validationErrors = {
                  ...validationErrors,
                  ...fields3
                };
              }
            }
            if (Object.keys(validationErrors).length === 0)
              return true;
            return Promise.reject(validationErrors);
          };
          const validateField = async (modelProps = [], callback) => {
            const shouldThrow = !isFunction$1(callback);
            try {
              const result = await doValidateField(modelProps);
              if (result === true) {
                await (callback == null ? void 0 : callback(result));
              }
              return result;
            } catch (e) {
              if (e instanceof Error)
                throw e;
              const invalidFields = e;
              if (props.scrollToError) {
                scrollToField(Object.keys(invalidFields)[0]);
              }
              await (callback == null ? void 0 : callback(false, invalidFields));
              return shouldThrow && Promise.reject(invalidFields);
            }
          };
          const scrollToField = (prop) => {
            var _a2;
            const field = filterFields(fields, prop)[0];
            if (field) {
              (_a2 = field.$el) == null ? void 0 : _a2.scrollIntoView(props.scrollIntoViewOptions);
            }
          };
          vue.watch(() => props.rules, () => {
            if (props.validateOnRuleChange) {
              validate().catch((err) => debugWarn());
            }
          }, { deep: true });
          vue.provide(formContextKey, vue.reactive({
            ...vue.toRefs(props),
            emit,
            resetFields,
            clearValidate,
            validateField,
            getField,
            addField,
            removeField,
            ...useFormLabelWidth()
          }));
          expose({
            validate,
            validateField,
            resetFields,
            clearValidate,
            scrollToField,
            fields
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("form", {
              class: vue.normalizeClass(vue.unref(formClasses))
            }, [
              vue.renderSlot(_ctx.$slots, "default")
            ], 2);
          };
        }
      });
      var Form = /* @__PURE__ */ _export_sfc$1(_sfc_main$E, [["__file", "form.vue"]]);
      var define_process_env_default = {};
      function _extends() {
        _extends = Object.assign ? Object.assign.bind() : function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };
        return _extends.apply(this, arguments);
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
          return o2.__proto__ || Object.getPrototypeOf(o2);
        };
        return _getPrototypeOf(o);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
          o2.__proto__ = p2;
          return o2;
        };
        return _setPrototypeOf(o, p);
      }
      function _isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === "function") return true;
        try {
          Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          }));
          return true;
        } catch (e) {
          return false;
        }
      }
      function _construct(Parent, args, Class) {
        if (_isNativeReflectConstruct()) {
          _construct = Reflect.construct.bind();
        } else {
          _construct = function _construct2(Parent2, args2, Class2) {
            var a = [null];
            a.push.apply(a, args2);
            var Constructor = Function.bind.apply(Parent2, a);
            var instance = new Constructor();
            if (Class2) _setPrototypeOf(instance, Class2.prototype);
            return instance;
          };
        }
        return _construct.apply(null, arguments);
      }
      function _isNativeFunction(fn2) {
        return Function.toString.call(fn2).indexOf("[native code]") !== -1;
      }
      function _wrapNativeSuper(Class) {
        var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
        _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
          if (Class2 === null || !_isNativeFunction(Class2)) return Class2;
          if (typeof Class2 !== "function") {
            throw new TypeError("Super expression must either be null or a function");
          }
          if (typeof _cache !== "undefined") {
            if (_cache.has(Class2)) return _cache.get(Class2);
            _cache.set(Class2, Wrapper);
          }
          function Wrapper() {
            return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
          }
          Wrapper.prototype = Object.create(Class2.prototype, {
            constructor: {
              value: Wrapper,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
          return _setPrototypeOf(Wrapper, Class2);
        };
        return _wrapNativeSuper(Class);
      }
      var formatRegExp = /%[sdj%]/g;
      var warning = function warning2() {
      };
      if (typeof process !== "undefined" && define_process_env_default && false) {
        warning = function warning3(type4, errors) {
          if (typeof console !== "undefined" && console.warn && typeof ASYNC_VALIDATOR_NO_WARNING === "undefined") {
            if (errors.every(function(e) {
              return typeof e === "string";
            })) {
              console.warn(type4, errors);
            }
          }
        };
      }
      function convertFieldsError(errors) {
        if (!errors || !errors.length) return null;
        var fields = {};
        errors.forEach(function(error) {
          var field = error.field;
          fields[field] = fields[field] || [];
          fields[field].push(error);
        });
        return fields;
      }
      function format(template) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        var i = 0;
        var len = args.length;
        if (typeof template === "function") {
          return template.apply(null, args);
        }
        if (typeof template === "string") {
          var str = template.replace(formatRegExp, function(x) {
            if (x === "%%") {
              return "%";
            }
            if (i >= len) {
              return x;
            }
            switch (x) {
              case "%s":
                return String(args[i++]);
              case "%d":
                return Number(args[i++]);
              case "%j":
                try {
                  return JSON.stringify(args[i++]);
                } catch (_) {
                  return "[Circular]";
                }
                break;
              default:
                return x;
            }
          });
          return str;
        }
        return template;
      }
      function isNativeStringType(type4) {
        return type4 === "string" || type4 === "url" || type4 === "hex" || type4 === "email" || type4 === "date" || type4 === "pattern";
      }
      function isEmptyValue(value, type4) {
        if (value === void 0 || value === null) {
          return true;
        }
        if (type4 === "array" && Array.isArray(value) && !value.length) {
          return true;
        }
        if (isNativeStringType(type4) && typeof value === "string" && !value) {
          return true;
        }
        return false;
      }
      function asyncParallelArray(arr, func, callback) {
        var results = [];
        var total = 0;
        var arrLength = arr.length;
        function count(errors) {
          results.push.apply(results, errors || []);
          total++;
          if (total === arrLength) {
            callback(results);
          }
        }
        arr.forEach(function(a) {
          func(a, count);
        });
      }
      function asyncSerialArray(arr, func, callback) {
        var index = 0;
        var arrLength = arr.length;
        function next(errors) {
          if (errors && errors.length) {
            callback(errors);
            return;
          }
          var original = index;
          index = index + 1;
          if (original < arrLength) {
            func(arr[original], next);
          } else {
            callback([]);
          }
        }
        next([]);
      }
      function flattenObjArr(objArr) {
        var ret = [];
        Object.keys(objArr).forEach(function(k) {
          ret.push.apply(ret, objArr[k] || []);
        });
        return ret;
      }
      var AsyncValidationError = /* @__PURE__ */ function(_Error) {
        _inheritsLoose(AsyncValidationError2, _Error);
        function AsyncValidationError2(errors, fields) {
          var _this;
          _this = _Error.call(this, "Async Validation Error") || this;
          _this.errors = errors;
          _this.fields = fields;
          return _this;
        }
        return AsyncValidationError2;
      }(/* @__PURE__ */ _wrapNativeSuper(Error));
      function asyncMap(objArr, option, func, callback, source) {
        if (option.first) {
          var _pending = new Promise(function(resolve, reject) {
            var next = function next2(errors) {
              callback(errors);
              return errors.length ? reject(new AsyncValidationError(errors, convertFieldsError(errors))) : resolve(source);
            };
            var flattenArr = flattenObjArr(objArr);
            asyncSerialArray(flattenArr, func, next);
          });
          _pending["catch"](function(e) {
            return e;
          });
          return _pending;
        }
        var firstFields = option.firstFields === true ? Object.keys(objArr) : option.firstFields || [];
        var objArrKeys = Object.keys(objArr);
        var objArrLength = objArrKeys.length;
        var total = 0;
        var results = [];
        var pending = new Promise(function(resolve, reject) {
          var next = function next2(errors) {
            results.push.apply(results, errors);
            total++;
            if (total === objArrLength) {
              callback(results);
              return results.length ? reject(new AsyncValidationError(results, convertFieldsError(results))) : resolve(source);
            }
          };
          if (!objArrKeys.length) {
            callback(results);
            resolve(source);
          }
          objArrKeys.forEach(function(key) {
            var arr = objArr[key];
            if (firstFields.indexOf(key) !== -1) {
              asyncSerialArray(arr, func, next);
            } else {
              asyncParallelArray(arr, func, next);
            }
          });
        });
        pending["catch"](function(e) {
          return e;
        });
        return pending;
      }
      function isErrorObj(obj) {
        return !!(obj && obj.message !== void 0);
      }
      function getValue(value, path) {
        var v = value;
        for (var i = 0; i < path.length; i++) {
          if (v == void 0) {
            return v;
          }
          v = v[path[i]];
        }
        return v;
      }
      function complementError(rule, source) {
        return function(oe) {
          var fieldValue;
          if (rule.fullFields) {
            fieldValue = getValue(source, rule.fullFields);
          } else {
            fieldValue = source[oe.field || rule.fullField];
          }
          if (isErrorObj(oe)) {
            oe.field = oe.field || rule.fullField;
            oe.fieldValue = fieldValue;
            return oe;
          }
          return {
            message: typeof oe === "function" ? oe() : oe,
            fieldValue,
            field: oe.field || rule.fullField
          };
        };
      }
      function deepMerge(target, source) {
        if (source) {
          for (var s in source) {
            if (source.hasOwnProperty(s)) {
              var value = source[s];
              if (typeof value === "object" && typeof target[s] === "object") {
                target[s] = _extends({}, target[s], value);
              } else {
                target[s] = value;
              }
            }
          }
        }
        return target;
      }
      var required$1 = function required(rule, value, source, errors, options, type4) {
        if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type4 || rule.type))) {
          errors.push(format(options.messages.required, rule.fullField));
        }
      };
      var whitespace = function whitespace2(rule, value, source, errors, options) {
        if (/^\s+$/.test(value) || value === "") {
          errors.push(format(options.messages.whitespace, rule.fullField));
        }
      };
      var urlReg;
      var getUrlRegex = function() {
        if (urlReg) {
          return urlReg;
        }
        var word = "[a-fA-F\\d:]";
        var b = function b2(options) {
          return options && options.includeBoundaries ? "(?:(?<=\\s|^)(?=" + word + ")|(?<=" + word + ")(?=\\s|$))" : "";
        };
        var v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
        var v6seg = "[a-fA-F\\d]{1,4}";
        var v6 = ("\n(?:\n(?:" + v6seg + ":){7}(?:" + v6seg + "|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8\n(?:" + v6seg + ":){6}(?:" + v4 + "|:" + v6seg + "|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4\n(?:" + v6seg + ":){5}(?::" + v4 + "|(?::" + v6seg + "){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4\n(?:" + v6seg + ":){4}(?:(?::" + v6seg + "){0,1}:" + v4 + "|(?::" + v6seg + "){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4\n(?:" + v6seg + ":){3}(?:(?::" + v6seg + "){0,2}:" + v4 + "|(?::" + v6seg + "){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4\n(?:" + v6seg + ":){2}(?:(?::" + v6seg + "){0,3}:" + v4 + "|(?::" + v6seg + "){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4\n(?:" + v6seg + ":){1}(?:(?::" + v6seg + "){0,4}:" + v4 + "|(?::" + v6seg + "){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4\n(?::(?:(?::" + v6seg + "){0,5}:" + v4 + "|(?::" + v6seg + "){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4\n)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1\n").replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
        var v46Exact = new RegExp("(?:^" + v4 + "$)|(?:^" + v6 + "$)");
        var v4exact = new RegExp("^" + v4 + "$");
        var v6exact = new RegExp("^" + v6 + "$");
        var ip = function ip2(options) {
          return options && options.exact ? v46Exact : new RegExp("(?:" + b(options) + v4 + b(options) + ")|(?:" + b(options) + v6 + b(options) + ")", "g");
        };
        ip.v4 = function(options) {
          return options && options.exact ? v4exact : new RegExp("" + b(options) + v4 + b(options), "g");
        };
        ip.v6 = function(options) {
          return options && options.exact ? v6exact : new RegExp("" + b(options) + v6 + b(options), "g");
        };
        var protocol = "(?:(?:[a-z]+:)?//)";
        var auth = "(?:\\S+(?::\\S*)?@)?";
        var ipv4 = ip.v4().source;
        var ipv6 = ip.v6().source;
        var host = "(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)";
        var domain = "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*";
        var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";
        var port = "(?::\\d{2,5})?";
        var path = '(?:[/?#][^\\s"]*)?';
        var regex = "(?:" + protocol + "|www\\.)" + auth + "(?:localhost|" + ipv4 + "|" + ipv6 + "|" + host + domain + tld + ")" + port + path;
        urlReg = new RegExp("(?:^" + regex + "$)", "i");
        return urlReg;
      };
      var pattern$2 = {
        // http://emailregex.com/
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
        // url: new RegExp(
        //   '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
        //   'i',
        // ),
        hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
      };
      var types = {
        integer: function integer(value) {
          return types.number(value) && parseInt(value, 10) === value;
        },
        "float": function float(value) {
          return types.number(value) && !types.integer(value);
        },
        array: function array(value) {
          return Array.isArray(value);
        },
        regexp: function regexp(value) {
          if (value instanceof RegExp) {
            return true;
          }
          try {
            return !!new RegExp(value);
          } catch (e) {
            return false;
          }
        },
        date: function date(value) {
          return typeof value.getTime === "function" && typeof value.getMonth === "function" && typeof value.getYear === "function" && !isNaN(value.getTime());
        },
        number: function number(value) {
          if (isNaN(value)) {
            return false;
          }
          return typeof value === "number";
        },
        object: function object(value) {
          return typeof value === "object" && !types.array(value);
        },
        method: function method(value) {
          return typeof value === "function";
        },
        email: function email(value) {
          return typeof value === "string" && value.length <= 320 && !!value.match(pattern$2.email);
        },
        url: function url(value) {
          return typeof value === "string" && value.length <= 2048 && !!value.match(getUrlRegex());
        },
        hex: function hex2(value) {
          return typeof value === "string" && !!value.match(pattern$2.hex);
        }
      };
      var type$1 = function type(rule, value, source, errors, options) {
        if (rule.required && value === void 0) {
          required$1(rule, value, source, errors, options);
          return;
        }
        var custom = ["integer", "float", "array", "regexp", "object", "method", "email", "number", "date", "url", "hex"];
        var ruleType = rule.type;
        if (custom.indexOf(ruleType) > -1) {
          if (!types[ruleType](value)) {
            errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
          }
        } else if (ruleType && typeof value !== rule.type) {
          errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
        }
      };
      var range = function range2(rule, value, source, errors, options) {
        var len = typeof rule.len === "number";
        var min = typeof rule.min === "number";
        var max = typeof rule.max === "number";
        var spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
        var val = value;
        var key = null;
        var num = typeof value === "number";
        var str = typeof value === "string";
        var arr = Array.isArray(value);
        if (num) {
          key = "number";
        } else if (str) {
          key = "string";
        } else if (arr) {
          key = "array";
        }
        if (!key) {
          return false;
        }
        if (arr) {
          val = value.length;
        }
        if (str) {
          val = value.replace(spRegexp, "_").length;
        }
        if (len) {
          if (val !== rule.len) {
            errors.push(format(options.messages[key].len, rule.fullField, rule.len));
          }
        } else if (min && !max && val < rule.min) {
          errors.push(format(options.messages[key].min, rule.fullField, rule.min));
        } else if (max && !min && val > rule.max) {
          errors.push(format(options.messages[key].max, rule.fullField, rule.max));
        } else if (min && max && (val < rule.min || val > rule.max)) {
          errors.push(format(options.messages[key].range, rule.fullField, rule.min, rule.max));
        }
      };
      var ENUM$1 = "enum";
      var enumerable$1 = function enumerable(rule, value, source, errors, options) {
        rule[ENUM$1] = Array.isArray(rule[ENUM$1]) ? rule[ENUM$1] : [];
        if (rule[ENUM$1].indexOf(value) === -1) {
          errors.push(format(options.messages[ENUM$1], rule.fullField, rule[ENUM$1].join(", ")));
        }
      };
      var pattern$1 = function pattern(rule, value, source, errors, options) {
        if (rule.pattern) {
          if (rule.pattern instanceof RegExp) {
            rule.pattern.lastIndex = 0;
            if (!rule.pattern.test(value)) {
              errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
            }
          } else if (typeof rule.pattern === "string") {
            var _pattern = new RegExp(rule.pattern);
            if (!_pattern.test(value)) {
              errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
            }
          }
        }
      };
      var rules = {
        required: required$1,
        whitespace,
        type: type$1,
        range,
        "enum": enumerable$1,
        pattern: pattern$1
      };
      var string = function string2(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value, "string") && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options, "string");
          if (!isEmptyValue(value, "string")) {
            rules.type(rule, value, source, errors, options);
            rules.range(rule, value, source, errors, options);
            rules.pattern(rule, value, source, errors, options);
            if (rule.whitespace === true) {
              rules.whitespace(rule, value, source, errors, options);
            }
          }
        }
        callback(errors);
      };
      var method2 = function method3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var number2 = function number3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (value === "") {
            value = void 0;
          }
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
            rules.range(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var _boolean = function _boolean2(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var regexp2 = function regexp3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (!isEmptyValue(value)) {
            rules.type(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var integer2 = function integer3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
            rules.range(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var floatFn = function floatFn2(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
            rules.range(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var array2 = function array3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if ((value === void 0 || value === null) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options, "array");
          if (value !== void 0 && value !== null) {
            rules.type(rule, value, source, errors, options);
            rules.range(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var object2 = function object3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var ENUM = "enum";
      var enumerable2 = function enumerable3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules[ENUM](rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var pattern2 = function pattern3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value, "string") && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (!isEmptyValue(value, "string")) {
            rules.pattern(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var date2 = function date3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value, "date") && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (!isEmptyValue(value, "date")) {
            var dateObject;
            if (value instanceof Date) {
              dateObject = value;
            } else {
              dateObject = new Date(value);
            }
            rules.type(rule, dateObject, source, errors, options);
            if (dateObject) {
              rules.range(rule, dateObject.getTime(), source, errors, options);
            }
          }
        }
        callback(errors);
      };
      var required2 = function required3(rule, value, callback, source, options) {
        var errors = [];
        var type4 = Array.isArray(value) ? "array" : typeof value;
        rules.required(rule, value, source, errors, options, type4);
        callback(errors);
      };
      var type2 = function type3(rule, value, callback, source, options) {
        var ruleType = rule.type;
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value, ruleType) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options, ruleType);
          if (!isEmptyValue(value, ruleType)) {
            rules.type(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var any = function any2(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
        }
        callback(errors);
      };
      var validators = {
        string,
        method: method2,
        number: number2,
        "boolean": _boolean,
        regexp: regexp2,
        integer: integer2,
        "float": floatFn,
        array: array2,
        object: object2,
        "enum": enumerable2,
        pattern: pattern2,
        date: date2,
        url: type2,
        hex: type2,
        email: type2,
        required: required2,
        any
      };
      function newMessages() {
        return {
          "default": "Validation error on field %s",
          required: "%s is required",
          "enum": "%s must be one of %s",
          whitespace: "%s cannot be empty",
          date: {
            format: "%s date %s is invalid for format %s",
            parse: "%s date could not be parsed, %s is invalid ",
            invalid: "%s date %s is invalid"
          },
          types: {
            string: "%s is not a %s",
            method: "%s is not a %s (function)",
            array: "%s is not an %s",
            object: "%s is not an %s",
            number: "%s is not a %s",
            date: "%s is not a %s",
            "boolean": "%s is not a %s",
            integer: "%s is not an %s",
            "float": "%s is not a %s",
            regexp: "%s is not a valid %s",
            email: "%s is not a valid %s",
            url: "%s is not a valid %s",
            hex: "%s is not a valid %s"
          },
          string: {
            len: "%s must be exactly %s characters",
            min: "%s must be at least %s characters",
            max: "%s cannot be longer than %s characters",
            range: "%s must be between %s and %s characters"
          },
          number: {
            len: "%s must equal %s",
            min: "%s cannot be less than %s",
            max: "%s cannot be greater than %s",
            range: "%s must be between %s and %s"
          },
          array: {
            len: "%s must be exactly %s in length",
            min: "%s cannot be less than %s in length",
            max: "%s cannot be greater than %s in length",
            range: "%s must be between %s and %s in length"
          },
          pattern: {
            mismatch: "%s value %s does not match pattern %s"
          },
          clone: function clone2() {
            var cloned = JSON.parse(JSON.stringify(this));
            cloned.clone = this.clone;
            return cloned;
          }
        };
      }
      var messages = newMessages();
      var Schema = /* @__PURE__ */ function() {
        function Schema2(descriptor) {
          this.rules = null;
          this._messages = messages;
          this.define(descriptor);
        }
        var _proto = Schema2.prototype;
        _proto.define = function define(rules2) {
          var _this = this;
          if (!rules2) {
            throw new Error("Cannot configure a schema with no rules");
          }
          if (typeof rules2 !== "object" || Array.isArray(rules2)) {
            throw new Error("Rules must be an object");
          }
          this.rules = {};
          Object.keys(rules2).forEach(function(name) {
            var item = rules2[name];
            _this.rules[name] = Array.isArray(item) ? item : [item];
          });
        };
        _proto.messages = function messages2(_messages) {
          if (_messages) {
            this._messages = deepMerge(newMessages(), _messages);
          }
          return this._messages;
        };
        _proto.validate = function validate(source_, o, oc) {
          var _this2 = this;
          if (o === void 0) {
            o = {};
          }
          if (oc === void 0) {
            oc = function oc2() {
            };
          }
          var source = source_;
          var options = o;
          var callback = oc;
          if (typeof options === "function") {
            callback = options;
            options = {};
          }
          if (!this.rules || Object.keys(this.rules).length === 0) {
            if (callback) {
              callback(null, source);
            }
            return Promise.resolve(source);
          }
          function complete(results) {
            var errors = [];
            var fields = {};
            function add2(e) {
              if (Array.isArray(e)) {
                var _errors;
                errors = (_errors = errors).concat.apply(_errors, e);
              } else {
                errors.push(e);
              }
            }
            for (var i = 0; i < results.length; i++) {
              add2(results[i]);
            }
            if (!errors.length) {
              callback(null, source);
            } else {
              fields = convertFieldsError(errors);
              callback(errors, fields);
            }
          }
          if (options.messages) {
            var messages$1 = this.messages();
            if (messages$1 === messages) {
              messages$1 = newMessages();
            }
            deepMerge(messages$1, options.messages);
            options.messages = messages$1;
          } else {
            options.messages = this.messages();
          }
          var series = {};
          var keys2 = options.keys || Object.keys(this.rules);
          keys2.forEach(function(z) {
            var arr = _this2.rules[z];
            var value = source[z];
            arr.forEach(function(r) {
              var rule = r;
              if (typeof rule.transform === "function") {
                if (source === source_) {
                  source = _extends({}, source);
                }
                value = source[z] = rule.transform(value);
              }
              if (typeof rule === "function") {
                rule = {
                  validator: rule
                };
              } else {
                rule = _extends({}, rule);
              }
              rule.validator = _this2.getValidationMethod(rule);
              if (!rule.validator) {
                return;
              }
              rule.field = z;
              rule.fullField = rule.fullField || z;
              rule.type = _this2.getType(rule);
              series[z] = series[z] || [];
              series[z].push({
                rule,
                value,
                source,
                field: z
              });
            });
          });
          var errorFields = {};
          return asyncMap(series, options, function(data, doIt) {
            var rule = data.rule;
            var deep = (rule.type === "object" || rule.type === "array") && (typeof rule.fields === "object" || typeof rule.defaultField === "object");
            deep = deep && (rule.required || !rule.required && data.value);
            rule.field = data.field;
            function addFullField(key, schema) {
              return _extends({}, schema, {
                fullField: rule.fullField + "." + key,
                fullFields: rule.fullFields ? [].concat(rule.fullFields, [key]) : [key]
              });
            }
            function cb(e) {
              if (e === void 0) {
                e = [];
              }
              var errorList = Array.isArray(e) ? e : [e];
              if (!options.suppressWarning && errorList.length) {
                Schema2.warning("async-validator:", errorList);
              }
              if (errorList.length && rule.message !== void 0) {
                errorList = [].concat(rule.message);
              }
              var filledErrors = errorList.map(complementError(rule, source));
              if (options.first && filledErrors.length) {
                errorFields[rule.field] = 1;
                return doIt(filledErrors);
              }
              if (!deep) {
                doIt(filledErrors);
              } else {
                if (rule.required && !data.value) {
                  if (rule.message !== void 0) {
                    filledErrors = [].concat(rule.message).map(complementError(rule, source));
                  } else if (options.error) {
                    filledErrors = [options.error(rule, format(options.messages.required, rule.field))];
                  }
                  return doIt(filledErrors);
                }
                var fieldsSchema = {};
                if (rule.defaultField) {
                  Object.keys(data.value).map(function(key) {
                    fieldsSchema[key] = rule.defaultField;
                  });
                }
                fieldsSchema = _extends({}, fieldsSchema, data.rule.fields);
                var paredFieldsSchema = {};
                Object.keys(fieldsSchema).forEach(function(field) {
                  var fieldSchema = fieldsSchema[field];
                  var fieldSchemaList = Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema];
                  paredFieldsSchema[field] = fieldSchemaList.map(addFullField.bind(null, field));
                });
                var schema = new Schema2(paredFieldsSchema);
                schema.messages(options.messages);
                if (data.rule.options) {
                  data.rule.options.messages = options.messages;
                  data.rule.options.error = options.error;
                }
                schema.validate(data.value, data.rule.options || options, function(errs) {
                  var finalErrors = [];
                  if (filledErrors && filledErrors.length) {
                    finalErrors.push.apply(finalErrors, filledErrors);
                  }
                  if (errs && errs.length) {
                    finalErrors.push.apply(finalErrors, errs);
                  }
                  doIt(finalErrors.length ? finalErrors : null);
                });
              }
            }
            var res;
            if (rule.asyncValidator) {
              res = rule.asyncValidator(rule, data.value, cb, data.source, options);
            } else if (rule.validator) {
              try {
                res = rule.validator(rule, data.value, cb, data.source, options);
              } catch (error) {
                console.error == null ? void 0 : console.error(error);
                if (!options.suppressValidatorError) {
                  setTimeout(function() {
                    throw error;
                  }, 0);
                }
                cb(error.message);
              }
              if (res === true) {
                cb();
              } else if (res === false) {
                cb(typeof rule.message === "function" ? rule.message(rule.fullField || rule.field) : rule.message || (rule.fullField || rule.field) + " fails");
              } else if (res instanceof Array) {
                cb(res);
              } else if (res instanceof Error) {
                cb(res.message);
              }
            }
            if (res && res.then) {
              res.then(function() {
                return cb();
              }, function(e) {
                return cb(e);
              });
            }
          }, function(results) {
            complete(results);
          }, source);
        };
        _proto.getType = function getType(rule) {
          if (rule.type === void 0 && rule.pattern instanceof RegExp) {
            rule.type = "pattern";
          }
          if (typeof rule.validator !== "function" && rule.type && !validators.hasOwnProperty(rule.type)) {
            throw new Error(format("Unknown rule type %s", rule.type));
          }
          return rule.type || "string";
        };
        _proto.getValidationMethod = function getValidationMethod(rule) {
          if (typeof rule.validator === "function") {
            return rule.validator;
          }
          var keys2 = Object.keys(rule);
          var messageIndex = keys2.indexOf("message");
          if (messageIndex !== -1) {
            keys2.splice(messageIndex, 1);
          }
          if (keys2.length === 1 && keys2[0] === "required") {
            return validators.required;
          }
          return validators[this.getType(rule)] || void 0;
        };
        return Schema2;
      }();
      Schema.register = function register(type4, validator) {
        if (typeof validator !== "function") {
          throw new Error("Cannot register a validator by type, validator is not a function");
        }
        validators[type4] = validator;
      };
      Schema.warning = warning;
      Schema.messages = messages;
      Schema.validators = validators;
      const formItemValidateStates = [
        "",
        "error",
        "validating",
        "success"
      ];
      const formItemProps = buildProps({
        label: String,
        labelWidth: {
          type: [String, Number],
          default: ""
        },
        labelPosition: {
          type: String,
          values: ["left", "right", "top", ""],
          default: ""
        },
        prop: {
          type: definePropType([String, Array])
        },
        required: {
          type: Boolean,
          default: void 0
        },
        rules: {
          type: definePropType([Object, Array])
        },
        error: String,
        validateStatus: {
          type: String,
          values: formItemValidateStates
        },
        for: String,
        inlineMessage: {
          type: [String, Boolean],
          default: ""
        },
        showMessage: {
          type: Boolean,
          default: true
        },
        size: {
          type: String,
          values: componentSizes
        }
      });
      const COMPONENT_NAME$4 = "ElLabelWrap";
      var FormLabelWrap = vue.defineComponent({
        name: COMPONENT_NAME$4,
        props: {
          isAutoWidth: Boolean,
          updateAll: Boolean
        },
        setup(props, {
          slots
        }) {
          const formContext = vue.inject(formContextKey, void 0);
          const formItemContext = vue.inject(formItemContextKey);
          if (!formItemContext)
            throwError(COMPONENT_NAME$4, "usage: <el-form-item><label-wrap /></el-form-item>");
          const ns = useNamespace("form");
          const el = vue.ref();
          const computedWidth = vue.ref(0);
          const getLabelWidth = () => {
            var _a2;
            if ((_a2 = el.value) == null ? void 0 : _a2.firstElementChild) {
              const width = window.getComputedStyle(el.value.firstElementChild).width;
              return Math.ceil(Number.parseFloat(width));
            } else {
              return 0;
            }
          };
          const updateLabelWidth = (action = "update") => {
            vue.nextTick(() => {
              if (slots.default && props.isAutoWidth) {
                if (action === "update") {
                  computedWidth.value = getLabelWidth();
                } else if (action === "remove") {
                  formContext == null ? void 0 : formContext.deregisterLabelWidth(computedWidth.value);
                }
              }
            });
          };
          const updateLabelWidthFn = () => updateLabelWidth("update");
          vue.onMounted(() => {
            updateLabelWidthFn();
          });
          vue.onBeforeUnmount(() => {
            updateLabelWidth("remove");
          });
          vue.onUpdated(() => updateLabelWidthFn());
          vue.watch(computedWidth, (val, oldVal) => {
            if (props.updateAll) {
              formContext == null ? void 0 : formContext.registerLabelWidth(val, oldVal);
            }
          });
          useResizeObserver(vue.computed(() => {
            var _a2, _b;
            return (_b = (_a2 = el.value) == null ? void 0 : _a2.firstElementChild) != null ? _b : null;
          }), updateLabelWidthFn);
          return () => {
            var _a2, _b;
            if (!slots)
              return null;
            const {
              isAutoWidth
            } = props;
            if (isAutoWidth) {
              const autoLabelWidth = formContext == null ? void 0 : formContext.autoLabelWidth;
              const hasLabel = formItemContext == null ? void 0 : formItemContext.hasLabel;
              const style = {};
              if (hasLabel && autoLabelWidth && autoLabelWidth !== "auto") {
                const marginWidth = Math.max(0, Number.parseInt(autoLabelWidth, 10) - computedWidth.value);
                const labelPosition = formItemContext.labelPosition || formContext.labelPosition;
                const marginPosition = labelPosition === "left" ? "marginRight" : "marginLeft";
                if (marginWidth) {
                  style[marginPosition] = `${marginWidth}px`;
                }
              }
              return vue.createVNode("div", {
                "ref": el,
                "class": [ns.be("item", "label-wrap")],
                "style": style
              }, [(_a2 = slots.default) == null ? void 0 : _a2.call(slots)]);
            } else {
              return vue.createVNode(vue.Fragment, {
                "ref": el
              }, [(_b = slots.default) == null ? void 0 : _b.call(slots)]);
            }
          };
        }
      });
      const __default__$q = vue.defineComponent({
        name: "ElFormItem"
      });
      const _sfc_main$D = /* @__PURE__ */ vue.defineComponent({
        ...__default__$q,
        props: formItemProps,
        setup(__props, { expose }) {
          const props = __props;
          const slots = vue.useSlots();
          const formContext = vue.inject(formContextKey, void 0);
          const parentFormItemContext = vue.inject(formItemContextKey, void 0);
          const _size = useFormSize(void 0, { formItem: false });
          const ns = useNamespace("form-item");
          const labelId = useId().value;
          const inputIds = vue.ref([]);
          const validateState = vue.ref("");
          const validateStateDebounced = refDebounced(validateState, 100);
          const validateMessage = vue.ref("");
          const formItemRef = vue.ref();
          let initialValue = void 0;
          let isResettingField = false;
          const labelPosition = vue.computed(() => props.labelPosition || (formContext == null ? void 0 : formContext.labelPosition));
          const labelStyle = vue.computed(() => {
            if (labelPosition.value === "top") {
              return {};
            }
            const labelWidth = addUnit(props.labelWidth || (formContext == null ? void 0 : formContext.labelWidth) || "");
            if (labelWidth)
              return { width: labelWidth };
            return {};
          });
          const contentStyle = vue.computed(() => {
            if (labelPosition.value === "top" || (formContext == null ? void 0 : formContext.inline)) {
              return {};
            }
            if (!props.label && !props.labelWidth && isNested) {
              return {};
            }
            const labelWidth = addUnit(props.labelWidth || (formContext == null ? void 0 : formContext.labelWidth) || "");
            if (!props.label && !slots.label) {
              return { marginLeft: labelWidth };
            }
            return {};
          });
          const formItemClasses = vue.computed(() => [
            ns.b(),
            ns.m(_size.value),
            ns.is("error", validateState.value === "error"),
            ns.is("validating", validateState.value === "validating"),
            ns.is("success", validateState.value === "success"),
            ns.is("required", isRequired.value || props.required),
            ns.is("no-asterisk", formContext == null ? void 0 : formContext.hideRequiredAsterisk),
            (formContext == null ? void 0 : formContext.requireAsteriskPosition) === "right" ? "asterisk-right" : "asterisk-left",
            {
              [ns.m("feedback")]: formContext == null ? void 0 : formContext.statusIcon,
              [ns.m(`label-${labelPosition.value}`)]: labelPosition.value
            }
          ]);
          const _inlineMessage = vue.computed(() => isBoolean(props.inlineMessage) ? props.inlineMessage : (formContext == null ? void 0 : formContext.inlineMessage) || false);
          const validateClasses = vue.computed(() => [
            ns.e("error"),
            { [ns.em("error", "inline")]: _inlineMessage.value }
          ]);
          const propString = vue.computed(() => {
            if (!props.prop)
              return "";
            return isString(props.prop) ? props.prop : props.prop.join(".");
          });
          const hasLabel = vue.computed(() => {
            return !!(props.label || slots.label);
          });
          const labelFor = vue.computed(() => {
            return props.for || (inputIds.value.length === 1 ? inputIds.value[0] : void 0);
          });
          const isGroup = vue.computed(() => {
            return !labelFor.value && hasLabel.value;
          });
          const isNested = !!parentFormItemContext;
          const fieldValue = vue.computed(() => {
            const model = formContext == null ? void 0 : formContext.model;
            if (!model || !props.prop) {
              return;
            }
            return getProp(model, props.prop).value;
          });
          const normalizedRules = vue.computed(() => {
            const { required } = props;
            const rules2 = [];
            if (props.rules) {
              rules2.push(...castArray(props.rules));
            }
            const formRules = formContext == null ? void 0 : formContext.rules;
            if (formRules && props.prop) {
              const _rules = getProp(formRules, props.prop).value;
              if (_rules) {
                rules2.push(...castArray(_rules));
              }
            }
            if (required !== void 0) {
              const requiredRules = rules2.map((rule, i) => [rule, i]).filter(([rule]) => Object.keys(rule).includes("required"));
              if (requiredRules.length > 0) {
                for (const [rule, i] of requiredRules) {
                  if (rule.required === required)
                    continue;
                  rules2[i] = { ...rule, required };
                }
              } else {
                rules2.push({ required });
              }
            }
            return rules2;
          });
          const validateEnabled = vue.computed(() => normalizedRules.value.length > 0);
          const getFilteredRule = (trigger) => {
            const rules2 = normalizedRules.value;
            return rules2.filter((rule) => {
              if (!rule.trigger || !trigger)
                return true;
              if (isArray$1(rule.trigger)) {
                return rule.trigger.includes(trigger);
              } else {
                return rule.trigger === trigger;
              }
            }).map(({ trigger: trigger2, ...rule }) => rule);
          };
          const isRequired = vue.computed(() => normalizedRules.value.some((rule) => rule.required));
          const shouldShowError = vue.computed(() => {
            var _a2;
            return validateStateDebounced.value === "error" && props.showMessage && ((_a2 = formContext == null ? void 0 : formContext.showMessage) != null ? _a2 : true);
          });
          const currentLabel = vue.computed(() => `${props.label || ""}${(formContext == null ? void 0 : formContext.labelSuffix) || ""}`);
          const setValidationState = (state) => {
            validateState.value = state;
          };
          const onValidationFailed = (error) => {
            var _a2, _b;
            const { errors, fields } = error;
            if (!errors || !fields) {
              console.error(error);
            }
            setValidationState("error");
            validateMessage.value = errors ? (_b = (_a2 = errors == null ? void 0 : errors[0]) == null ? void 0 : _a2.message) != null ? _b : `${props.prop} is required` : "";
            formContext == null ? void 0 : formContext.emit("validate", props.prop, false, validateMessage.value);
          };
          const onValidationSucceeded = () => {
            setValidationState("success");
            formContext == null ? void 0 : formContext.emit("validate", props.prop, true, "");
          };
          const doValidate = async (rules2) => {
            const modelName = propString.value;
            const validator = new Schema({
              [modelName]: rules2
            });
            return validator.validate({ [modelName]: fieldValue.value }, { firstFields: true }).then(() => {
              onValidationSucceeded();
              return true;
            }).catch((err) => {
              onValidationFailed(err);
              return Promise.reject(err);
            });
          };
          const validate = async (trigger, callback) => {
            if (isResettingField || !props.prop) {
              return false;
            }
            const hasCallback = isFunction$1(callback);
            if (!validateEnabled.value) {
              callback == null ? void 0 : callback(false);
              return false;
            }
            const rules2 = getFilteredRule(trigger);
            if (rules2.length === 0) {
              callback == null ? void 0 : callback(true);
              return true;
            }
            setValidationState("validating");
            return doValidate(rules2).then(() => {
              callback == null ? void 0 : callback(true);
              return true;
            }).catch((err) => {
              const { fields } = err;
              callback == null ? void 0 : callback(false, fields);
              return hasCallback ? false : Promise.reject(fields);
            });
          };
          const clearValidate = () => {
            setValidationState("");
            validateMessage.value = "";
            isResettingField = false;
          };
          const resetField = async () => {
            const model = formContext == null ? void 0 : formContext.model;
            if (!model || !props.prop)
              return;
            const computedValue = getProp(model, props.prop);
            isResettingField = true;
            computedValue.value = clone(initialValue);
            await vue.nextTick();
            clearValidate();
            isResettingField = false;
          };
          const addInputId = (id) => {
            if (!inputIds.value.includes(id)) {
              inputIds.value.push(id);
            }
          };
          const removeInputId = (id) => {
            inputIds.value = inputIds.value.filter((listId) => listId !== id);
          };
          vue.watch(() => props.error, (val) => {
            validateMessage.value = val || "";
            setValidationState(val ? "error" : "");
          }, { immediate: true });
          vue.watch(() => props.validateStatus, (val) => setValidationState(val || ""));
          const context = vue.reactive({
            ...vue.toRefs(props),
            $el: formItemRef,
            size: _size,
            validateState,
            labelId,
            inputIds,
            isGroup,
            hasLabel,
            fieldValue,
            addInputId,
            removeInputId,
            resetField,
            clearValidate,
            validate
          });
          vue.provide(formItemContextKey, context);
          vue.onMounted(() => {
            if (props.prop) {
              formContext == null ? void 0 : formContext.addField(context);
              initialValue = clone(fieldValue.value);
            }
          });
          vue.onBeforeUnmount(() => {
            formContext == null ? void 0 : formContext.removeField(context);
          });
          expose({
            size: _size,
            validateMessage,
            validateState,
            validate,
            clearValidate,
            resetField
          });
          return (_ctx, _cache) => {
            var _a2;
            return vue.openBlock(), vue.createElementBlock("div", {
              ref_key: "formItemRef",
              ref: formItemRef,
              class: vue.normalizeClass(vue.unref(formItemClasses)),
              role: vue.unref(isGroup) ? "group" : void 0,
              "aria-labelledby": vue.unref(isGroup) ? vue.unref(labelId) : void 0
            }, [
              vue.createVNode(vue.unref(FormLabelWrap), {
                "is-auto-width": vue.unref(labelStyle).width === "auto",
                "update-all": ((_a2 = vue.unref(formContext)) == null ? void 0 : _a2.labelWidth) === "auto"
              }, {
                default: vue.withCtx(() => [
                  vue.unref(hasLabel) ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(labelFor) ? "label" : "div"), {
                    key: 0,
                    id: vue.unref(labelId),
                    for: vue.unref(labelFor),
                    class: vue.normalizeClass(vue.unref(ns).e("label")),
                    style: vue.normalizeStyle(vue.unref(labelStyle))
                  }, {
                    default: vue.withCtx(() => [
                      vue.renderSlot(_ctx.$slots, "label", { label: vue.unref(currentLabel) }, () => [
                        vue.createTextVNode(vue.toDisplayString(vue.unref(currentLabel)), 1)
                      ])
                    ]),
                    _: 3
                  }, 8, ["id", "for", "class", "style"])) : vue.createCommentVNode("v-if", true)
                ]),
                _: 3
              }, 8, ["is-auto-width", "update-all"]),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(vue.unref(ns).e("content")),
                style: vue.normalizeStyle(vue.unref(contentStyle))
              }, [
                vue.renderSlot(_ctx.$slots, "default"),
                vue.createVNode(vue.TransitionGroup, {
                  name: `${vue.unref(ns).namespace.value}-zoom-in-top`
                }, {
                  default: vue.withCtx(() => [
                    vue.unref(shouldShowError) ? vue.renderSlot(_ctx.$slots, "error", {
                      key: 0,
                      error: validateMessage.value
                    }, () => [
                      vue.createElementVNode("div", {
                        class: vue.normalizeClass(vue.unref(validateClasses))
                      }, vue.toDisplayString(validateMessage.value), 3)
                    ]) : vue.createCommentVNode("v-if", true)
                  ]),
                  _: 3
                }, 8, ["name"])
              ], 6)
            ], 10, ["role", "aria-labelledby"]);
          };
        }
      });
      var FormItem = /* @__PURE__ */ _export_sfc$1(_sfc_main$D, [["__file", "form-item.vue"]]);
      const ElForm = withInstall(Form, {
        FormItem
      });
      const ElFormItem = withNoopInstall(FormItem);
      let hiddenTextarea = void 0;
      const HIDDEN_STYLE = `
  height:0 !important;
  visibility:hidden !important;
  ${isFirefox() ? "" : "overflow:hidden !important;"}
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important;
`;
      const CONTEXT_STYLE = [
        "letter-spacing",
        "line-height",
        "padding-top",
        "padding-bottom",
        "font-family",
        "font-weight",
        "font-size",
        "text-rendering",
        "text-transform",
        "width",
        "text-indent",
        "padding-left",
        "padding-right",
        "border-width",
        "box-sizing"
      ];
      function calculateNodeStyling(targetElement) {
        const style = window.getComputedStyle(targetElement);
        const boxSizing = style.getPropertyValue("box-sizing");
        const paddingSize = Number.parseFloat(style.getPropertyValue("padding-bottom")) + Number.parseFloat(style.getPropertyValue("padding-top"));
        const borderSize = Number.parseFloat(style.getPropertyValue("border-bottom-width")) + Number.parseFloat(style.getPropertyValue("border-top-width"));
        const contextStyle = CONTEXT_STYLE.map((name) => `${name}:${style.getPropertyValue(name)}`).join(";");
        return { contextStyle, paddingSize, borderSize, boxSizing };
      }
      function calcTextareaHeight(targetElement, minRows = 1, maxRows) {
        var _a2;
        if (!hiddenTextarea) {
          hiddenTextarea = document.createElement("textarea");
          document.body.appendChild(hiddenTextarea);
        }
        const { paddingSize, borderSize, boxSizing, contextStyle } = calculateNodeStyling(targetElement);
        hiddenTextarea.setAttribute("style", `${contextStyle};${HIDDEN_STYLE}`);
        hiddenTextarea.value = targetElement.value || targetElement.placeholder || "";
        let height = hiddenTextarea.scrollHeight;
        const result = {};
        if (boxSizing === "border-box") {
          height = height + borderSize;
        } else if (boxSizing === "content-box") {
          height = height - paddingSize;
        }
        hiddenTextarea.value = "";
        const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
        if (isNumber(minRows)) {
          let minHeight = singleRowHeight * minRows;
          if (boxSizing === "border-box") {
            minHeight = minHeight + paddingSize + borderSize;
          }
          height = Math.max(minHeight, height);
          result.minHeight = `${minHeight}px`;
        }
        if (isNumber(maxRows)) {
          let maxHeight = singleRowHeight * maxRows;
          if (boxSizing === "border-box") {
            maxHeight = maxHeight + paddingSize + borderSize;
          }
          height = Math.min(maxHeight, height);
        }
        result.height = `${height}px`;
        (_a2 = hiddenTextarea.parentNode) == null ? void 0 : _a2.removeChild(hiddenTextarea);
        hiddenTextarea = void 0;
        return result;
      }
      const inputProps = buildProps({
        id: {
          type: String,
          default: void 0
        },
        size: useSizeProp,
        disabled: Boolean,
        modelValue: {
          type: definePropType([
            String,
            Number,
            Object
          ]),
          default: ""
        },
        maxlength: {
          type: [String, Number]
        },
        minlength: {
          type: [String, Number]
        },
        type: {
          type: String,
          default: "text"
        },
        resize: {
          type: String,
          values: ["none", "both", "horizontal", "vertical"]
        },
        autosize: {
          type: definePropType([Boolean, Object]),
          default: false
        },
        autocomplete: {
          type: String,
          default: "off"
        },
        formatter: {
          type: Function
        },
        parser: {
          type: Function
        },
        placeholder: {
          type: String
        },
        form: {
          type: String
        },
        readonly: Boolean,
        clearable: Boolean,
        showPassword: Boolean,
        showWordLimit: Boolean,
        suffixIcon: {
          type: iconPropType
        },
        prefixIcon: {
          type: iconPropType
        },
        containerRole: {
          type: String,
          default: void 0
        },
        tabindex: {
          type: [String, Number],
          default: 0
        },
        validateEvent: {
          type: Boolean,
          default: true
        },
        inputStyle: {
          type: definePropType([Object, Array, String]),
          default: () => mutable({})
        },
        autofocus: Boolean,
        rows: {
          type: Number,
          default: 2
        },
        ...useAriaProps(["ariaLabel"])
      });
      const inputEmits = {
        [UPDATE_MODEL_EVENT]: (value) => isString(value),
        input: (value) => isString(value),
        change: (value) => isString(value),
        focus: (evt) => evt instanceof FocusEvent,
        blur: (evt) => evt instanceof FocusEvent,
        clear: () => true,
        mouseleave: (evt) => evt instanceof MouseEvent,
        mouseenter: (evt) => evt instanceof MouseEvent,
        keydown: (evt) => evt instanceof Event,
        compositionstart: (evt) => evt instanceof CompositionEvent,
        compositionupdate: (evt) => evt instanceof CompositionEvent,
        compositionend: (evt) => evt instanceof CompositionEvent
      };
      const __default__$p = vue.defineComponent({
        name: "ElInput",
        inheritAttrs: false
      });
      const _sfc_main$C = /* @__PURE__ */ vue.defineComponent({
        ...__default__$p,
        props: inputProps,
        emits: inputEmits,
        setup(__props, { expose, emit }) {
          const props = __props;
          const rawAttrs = vue.useAttrs();
          const attrs = useAttrs();
          const slots = vue.useSlots();
          const containerKls = vue.computed(() => [
            props.type === "textarea" ? nsTextarea.b() : nsInput.b(),
            nsInput.m(inputSize.value),
            nsInput.is("disabled", inputDisabled.value),
            nsInput.is("exceed", inputExceed.value),
            {
              [nsInput.b("group")]: slots.prepend || slots.append,
              [nsInput.m("prefix")]: slots.prefix || props.prefixIcon,
              [nsInput.m("suffix")]: slots.suffix || props.suffixIcon || props.clearable || props.showPassword,
              [nsInput.bm("suffix", "password-clear")]: showClear.value && showPwdVisible.value,
              [nsInput.b("hidden")]: props.type === "hidden"
            },
            rawAttrs.class
          ]);
          const wrapperKls = vue.computed(() => [
            nsInput.e("wrapper"),
            nsInput.is("focus", isFocused.value)
          ]);
          const { form: elForm, formItem: elFormItem } = useFormItem();
          const { inputId } = useFormItemInputId(props, {
            formItemContext: elFormItem
          });
          const inputSize = useFormSize();
          const inputDisabled = useFormDisabled();
          const nsInput = useNamespace("input");
          const nsTextarea = useNamespace("textarea");
          const input = vue.shallowRef();
          const textarea = vue.shallowRef();
          const hovering = vue.ref(false);
          const passwordVisible = vue.ref(false);
          const countStyle = vue.ref();
          const textareaCalcStyle = vue.shallowRef(props.inputStyle);
          const _ref = vue.computed(() => input.value || textarea.value);
          const { wrapperRef, isFocused, handleFocus, handleBlur } = useFocusController(_ref, {
            beforeFocus() {
              return inputDisabled.value;
            },
            afterBlur() {
              var _a2;
              if (props.validateEvent) {
                (_a2 = elFormItem == null ? void 0 : elFormItem.validate) == null ? void 0 : _a2.call(elFormItem, "blur").catch((err) => debugWarn());
              }
            }
          });
          const needStatusIcon = vue.computed(() => {
            var _a2;
            return (_a2 = elForm == null ? void 0 : elForm.statusIcon) != null ? _a2 : false;
          });
          const validateState = vue.computed(() => (elFormItem == null ? void 0 : elFormItem.validateState) || "");
          const validateIcon = vue.computed(() => validateState.value && ValidateComponentsMap[validateState.value]);
          const passwordIcon = vue.computed(() => passwordVisible.value ? view_default : hide_default);
          const containerStyle = vue.computed(() => [
            rawAttrs.style
          ]);
          const textareaStyle = vue.computed(() => [
            props.inputStyle,
            textareaCalcStyle.value,
            { resize: props.resize }
          ]);
          const nativeInputValue = vue.computed(() => isNil(props.modelValue) ? "" : String(props.modelValue));
          const showClear = vue.computed(() => props.clearable && !inputDisabled.value && !props.readonly && !!nativeInputValue.value && (isFocused.value || hovering.value));
          const showPwdVisible = vue.computed(() => props.showPassword && !inputDisabled.value && !!nativeInputValue.value && (!!nativeInputValue.value || isFocused.value));
          const isWordLimitVisible = vue.computed(() => props.showWordLimit && !!props.maxlength && (props.type === "text" || props.type === "textarea") && !inputDisabled.value && !props.readonly && !props.showPassword);
          const textLength = vue.computed(() => nativeInputValue.value.length);
          const inputExceed = vue.computed(() => !!isWordLimitVisible.value && textLength.value > Number(props.maxlength));
          const suffixVisible = vue.computed(() => !!slots.suffix || !!props.suffixIcon || showClear.value || props.showPassword || isWordLimitVisible.value || !!validateState.value && needStatusIcon.value);
          const [recordCursor, setCursor] = useCursor(input);
          useResizeObserver(textarea, (entries) => {
            onceInitSizeTextarea();
            if (!isWordLimitVisible.value || props.resize !== "both")
              return;
            const entry = entries[0];
            const { width } = entry.contentRect;
            countStyle.value = {
              right: `calc(100% - ${width + 15 + 6}px)`
            };
          });
          const resizeTextarea = () => {
            const { type, autosize } = props;
            if (!isClient || type !== "textarea" || !textarea.value)
              return;
            if (autosize) {
              const minRows = isObject$1(autosize) ? autosize.minRows : void 0;
              const maxRows = isObject$1(autosize) ? autosize.maxRows : void 0;
              const textareaStyle2 = calcTextareaHeight(textarea.value, minRows, maxRows);
              textareaCalcStyle.value = {
                overflowY: "hidden",
                ...textareaStyle2
              };
              vue.nextTick(() => {
                textarea.value.offsetHeight;
                textareaCalcStyle.value = textareaStyle2;
              });
            } else {
              textareaCalcStyle.value = {
                minHeight: calcTextareaHeight(textarea.value).minHeight
              };
            }
          };
          const createOnceInitResize = (resizeTextarea2) => {
            let isInit = false;
            return () => {
              var _a2;
              if (isInit || !props.autosize)
                return;
              const isElHidden = ((_a2 = textarea.value) == null ? void 0 : _a2.offsetParent) === null;
              if (!isElHidden) {
                resizeTextarea2();
                isInit = true;
              }
            };
          };
          const onceInitSizeTextarea = createOnceInitResize(resizeTextarea);
          const setNativeInputValue = () => {
            const input2 = _ref.value;
            const formatterValue = props.formatter ? props.formatter(nativeInputValue.value) : nativeInputValue.value;
            if (!input2 || input2.value === formatterValue)
              return;
            input2.value = formatterValue;
          };
          const handleInput = async (event) => {
            recordCursor();
            let { value } = event.target;
            if (props.formatter) {
              value = props.parser ? props.parser(value) : value;
            }
            if (isComposing.value)
              return;
            if (value === nativeInputValue.value) {
              setNativeInputValue();
              return;
            }
            emit(UPDATE_MODEL_EVENT, value);
            emit("input", value);
            await vue.nextTick();
            setNativeInputValue();
            setCursor();
          };
          const handleChange = (event) => {
            emit("change", event.target.value);
          };
          const {
            isComposing,
            handleCompositionStart,
            handleCompositionUpdate,
            handleCompositionEnd
          } = useComposition({ emit, afterComposition: handleInput });
          const handlePasswordVisible = () => {
            passwordVisible.value = !passwordVisible.value;
            focus();
          };
          const focus = async () => {
            var _a2;
            await vue.nextTick();
            (_a2 = _ref.value) == null ? void 0 : _a2.focus();
          };
          const blur = () => {
            var _a2;
            return (_a2 = _ref.value) == null ? void 0 : _a2.blur();
          };
          const handleMouseLeave = (evt) => {
            hovering.value = false;
            emit("mouseleave", evt);
          };
          const handleMouseEnter = (evt) => {
            hovering.value = true;
            emit("mouseenter", evt);
          };
          const handleKeydown = (evt) => {
            emit("keydown", evt);
          };
          const select = () => {
            var _a2;
            (_a2 = _ref.value) == null ? void 0 : _a2.select();
          };
          const clear = () => {
            emit(UPDATE_MODEL_EVENT, "");
            emit("change", "");
            emit("clear");
            emit("input", "");
          };
          vue.watch(() => props.modelValue, () => {
            var _a2;
            vue.nextTick(() => resizeTextarea());
            if (props.validateEvent) {
              (_a2 = elFormItem == null ? void 0 : elFormItem.validate) == null ? void 0 : _a2.call(elFormItem, "change").catch((err) => debugWarn());
            }
          });
          vue.watch(nativeInputValue, () => setNativeInputValue());
          vue.watch(() => props.type, async () => {
            await vue.nextTick();
            setNativeInputValue();
            resizeTextarea();
          });
          vue.onMounted(() => {
            if (!props.formatter && props.parser) ;
            setNativeInputValue();
            vue.nextTick(resizeTextarea);
          });
          expose({
            input,
            textarea,
            ref: _ref,
            textareaStyle,
            autosize: vue.toRef(props, "autosize"),
            isComposing,
            focus,
            blur,
            select,
            clear,
            resizeTextarea
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              class: vue.normalizeClass([
                vue.unref(containerKls),
                {
                  [vue.unref(nsInput).bm("group", "append")]: _ctx.$slots.append,
                  [vue.unref(nsInput).bm("group", "prepend")]: _ctx.$slots.prepend
                }
              ]),
              style: vue.normalizeStyle(vue.unref(containerStyle)),
              onMouseenter: handleMouseEnter,
              onMouseleave: handleMouseLeave
            }, [
              vue.createCommentVNode(" input "),
              _ctx.type !== "textarea" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                vue.createCommentVNode(" prepend slot "),
                _ctx.$slots.prepend ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  class: vue.normalizeClass(vue.unref(nsInput).be("group", "prepend"))
                }, [
                  vue.renderSlot(_ctx.$slots, "prepend")
                ], 2)) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("div", {
                  ref_key: "wrapperRef",
                  ref: wrapperRef,
                  class: vue.normalizeClass(vue.unref(wrapperKls))
                }, [
                  vue.createCommentVNode(" prefix slot "),
                  _ctx.$slots.prefix || _ctx.prefixIcon ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 0,
                    class: vue.normalizeClass(vue.unref(nsInput).e("prefix"))
                  }, [
                    vue.createElementVNode("span", {
                      class: vue.normalizeClass(vue.unref(nsInput).e("prefix-inner"))
                    }, [
                      vue.renderSlot(_ctx.$slots, "prefix"),
                      _ctx.prefixIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                        key: 0,
                        class: vue.normalizeClass(vue.unref(nsInput).e("icon"))
                      }, {
                        default: vue.withCtx(() => [
                          (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.prefixIcon)))
                        ]),
                        _: 1
                      }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
                    ], 2)
                  ], 2)) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode("input", vue.mergeProps({
                    id: vue.unref(inputId),
                    ref_key: "input",
                    ref: input,
                    class: vue.unref(nsInput).e("inner")
                  }, vue.unref(attrs), {
                    minlength: _ctx.minlength,
                    maxlength: _ctx.maxlength,
                    type: _ctx.showPassword ? passwordVisible.value ? "text" : "password" : _ctx.type,
                    disabled: vue.unref(inputDisabled),
                    readonly: _ctx.readonly,
                    autocomplete: _ctx.autocomplete,
                    tabindex: _ctx.tabindex,
                    "aria-label": _ctx.ariaLabel,
                    placeholder: _ctx.placeholder,
                    style: _ctx.inputStyle,
                    form: _ctx.form,
                    autofocus: _ctx.autofocus,
                    role: _ctx.containerRole,
                    onCompositionstart: vue.unref(handleCompositionStart),
                    onCompositionupdate: vue.unref(handleCompositionUpdate),
                    onCompositionend: vue.unref(handleCompositionEnd),
                    onInput: handleInput,
                    onChange: handleChange,
                    onKeydown: handleKeydown
                  }), null, 16, ["id", "minlength", "maxlength", "type", "disabled", "readonly", "autocomplete", "tabindex", "aria-label", "placeholder", "form", "autofocus", "role", "onCompositionstart", "onCompositionupdate", "onCompositionend"]),
                  vue.createCommentVNode(" suffix slot "),
                  vue.unref(suffixVisible) ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 1,
                    class: vue.normalizeClass(vue.unref(nsInput).e("suffix"))
                  }, [
                    vue.createElementVNode("span", {
                      class: vue.normalizeClass(vue.unref(nsInput).e("suffix-inner"))
                    }, [
                      !vue.unref(showClear) || !vue.unref(showPwdVisible) || !vue.unref(isWordLimitVisible) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                        vue.renderSlot(_ctx.$slots, "suffix"),
                        _ctx.suffixIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                          key: 0,
                          class: vue.normalizeClass(vue.unref(nsInput).e("icon"))
                        }, {
                          default: vue.withCtx(() => [
                            (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.suffixIcon)))
                          ]),
                          _: 1
                        }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
                      ], 64)) : vue.createCommentVNode("v-if", true),
                      vue.unref(showClear) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                        key: 1,
                        class: vue.normalizeClass([vue.unref(nsInput).e("icon"), vue.unref(nsInput).e("clear")]),
                        onMousedown: vue.withModifiers(vue.unref(NOOP), ["prevent"]),
                        onClick: clear
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(vue.unref(circle_close_default))
                        ]),
                        _: 1
                      }, 8, ["class", "onMousedown"])) : vue.createCommentVNode("v-if", true),
                      vue.unref(showPwdVisible) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                        key: 2,
                        class: vue.normalizeClass([vue.unref(nsInput).e("icon"), vue.unref(nsInput).e("password")]),
                        onClick: handlePasswordVisible
                      }, {
                        default: vue.withCtx(() => [
                          (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(passwordIcon))))
                        ]),
                        _: 1
                      }, 8, ["class"])) : vue.createCommentVNode("v-if", true),
                      vue.unref(isWordLimitVisible) ? (vue.openBlock(), vue.createElementBlock("span", {
                        key: 3,
                        class: vue.normalizeClass(vue.unref(nsInput).e("count"))
                      }, [
                        vue.createElementVNode("span", {
                          class: vue.normalizeClass(vue.unref(nsInput).e("count-inner"))
                        }, vue.toDisplayString(vue.unref(textLength)) + " / " + vue.toDisplayString(_ctx.maxlength), 3)
                      ], 2)) : vue.createCommentVNode("v-if", true),
                      vue.unref(validateState) && vue.unref(validateIcon) && vue.unref(needStatusIcon) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                        key: 4,
                        class: vue.normalizeClass([
                          vue.unref(nsInput).e("icon"),
                          vue.unref(nsInput).e("validateIcon"),
                          vue.unref(nsInput).is("loading", vue.unref(validateState) === "validating")
                        ])
                      }, {
                        default: vue.withCtx(() => [
                          (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(validateIcon))))
                        ]),
                        _: 1
                      }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
                    ], 2)
                  ], 2)) : vue.createCommentVNode("v-if", true)
                ], 2),
                vue.createCommentVNode(" append slot "),
                _ctx.$slots.append ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 1,
                  class: vue.normalizeClass(vue.unref(nsInput).be("group", "append"))
                }, [
                  vue.renderSlot(_ctx.$slots, "append")
                ], 2)) : vue.createCommentVNode("v-if", true)
              ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                vue.createCommentVNode(" textarea "),
                vue.createElementVNode("textarea", vue.mergeProps({
                  id: vue.unref(inputId),
                  ref_key: "textarea",
                  ref: textarea,
                  class: [vue.unref(nsTextarea).e("inner"), vue.unref(nsInput).is("focus", vue.unref(isFocused))]
                }, vue.unref(attrs), {
                  minlength: _ctx.minlength,
                  maxlength: _ctx.maxlength,
                  tabindex: _ctx.tabindex,
                  disabled: vue.unref(inputDisabled),
                  readonly: _ctx.readonly,
                  autocomplete: _ctx.autocomplete,
                  style: vue.unref(textareaStyle),
                  "aria-label": _ctx.ariaLabel,
                  placeholder: _ctx.placeholder,
                  form: _ctx.form,
                  autofocus: _ctx.autofocus,
                  rows: _ctx.rows,
                  role: _ctx.containerRole,
                  onCompositionstart: vue.unref(handleCompositionStart),
                  onCompositionupdate: vue.unref(handleCompositionUpdate),
                  onCompositionend: vue.unref(handleCompositionEnd),
                  onInput: handleInput,
                  onFocus: vue.unref(handleFocus),
                  onBlur: vue.unref(handleBlur),
                  onChange: handleChange,
                  onKeydown: handleKeydown
                }), null, 16, ["id", "minlength", "maxlength", "tabindex", "disabled", "readonly", "autocomplete", "aria-label", "placeholder", "form", "autofocus", "rows", "role", "onCompositionstart", "onCompositionupdate", "onCompositionend", "onFocus", "onBlur"]),
                vue.unref(isWordLimitVisible) ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 0,
                  style: vue.normalizeStyle(countStyle.value),
                  class: vue.normalizeClass(vue.unref(nsInput).e("count"))
                }, vue.toDisplayString(vue.unref(textLength)) + " / " + vue.toDisplayString(_ctx.maxlength), 7)) : vue.createCommentVNode("v-if", true)
              ], 64))
            ], 38);
          };
        }
      });
      var Input = /* @__PURE__ */ _export_sfc$1(_sfc_main$C, [["__file", "input.vue"]]);
      const ElInput = withInstall(Input);
      const GAP = 4;
      const BAR_MAP = {
        vertical: {
          offset: "offsetHeight",
          scroll: "scrollTop",
          scrollSize: "scrollHeight",
          size: "height",
          key: "vertical",
          axis: "Y",
          client: "clientY",
          direction: "top"
        },
        horizontal: {
          offset: "offsetWidth",
          scroll: "scrollLeft",
          scrollSize: "scrollWidth",
          size: "width",
          key: "horizontal",
          axis: "X",
          client: "clientX",
          direction: "left"
        }
      };
      const renderThumbStyle = ({
        move,
        size,
        bar
      }) => ({
        [bar.size]: size,
        transform: `translate${bar.axis}(${move}%)`
      });
      const scrollbarContextKey = Symbol("scrollbarContextKey");
      const thumbProps = buildProps({
        vertical: Boolean,
        size: String,
        move: Number,
        ratio: {
          type: Number,
          required: true
        },
        always: Boolean
      });
      const COMPONENT_NAME$3 = "Thumb";
      const _sfc_main$B = /* @__PURE__ */ vue.defineComponent({
        __name: "thumb",
        props: thumbProps,
        setup(__props) {
          const props = __props;
          const scrollbar = vue.inject(scrollbarContextKey);
          const ns = useNamespace("scrollbar");
          if (!scrollbar)
            throwError(COMPONENT_NAME$3, "can not inject scrollbar context");
          const instance = vue.ref();
          const thumb = vue.ref();
          const thumbState = vue.ref({});
          const visible = vue.ref(false);
          let cursorDown = false;
          let cursorLeave = false;
          let originalOnSelectStart = isClient ? document.onselectstart : null;
          const bar = vue.computed(() => BAR_MAP[props.vertical ? "vertical" : "horizontal"]);
          const thumbStyle = vue.computed(() => renderThumbStyle({
            size: props.size,
            move: props.move,
            bar: bar.value
          }));
          const offsetRatio = vue.computed(() => instance.value[bar.value.offset] ** 2 / scrollbar.wrapElement[bar.value.scrollSize] / props.ratio / thumb.value[bar.value.offset]);
          const clickThumbHandler = (e) => {
            var _a2;
            e.stopPropagation();
            if (e.ctrlKey || [1, 2].includes(e.button))
              return;
            (_a2 = window.getSelection()) == null ? void 0 : _a2.removeAllRanges();
            startDrag(e);
            const el = e.currentTarget;
            if (!el)
              return;
            thumbState.value[bar.value.axis] = el[bar.value.offset] - (e[bar.value.client] - el.getBoundingClientRect()[bar.value.direction]);
          };
          const clickTrackHandler = (e) => {
            if (!thumb.value || !instance.value || !scrollbar.wrapElement)
              return;
            const offset = Math.abs(e.target.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]);
            const thumbHalf = thumb.value[bar.value.offset] / 2;
            const thumbPositionPercentage = (offset - thumbHalf) * 100 * offsetRatio.value / instance.value[bar.value.offset];
            scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize] / 100;
          };
          const startDrag = (e) => {
            e.stopImmediatePropagation();
            cursorDown = true;
            document.addEventListener("mousemove", mouseMoveDocumentHandler);
            document.addEventListener("mouseup", mouseUpDocumentHandler);
            originalOnSelectStart = document.onselectstart;
            document.onselectstart = () => false;
          };
          const mouseMoveDocumentHandler = (e) => {
            if (!instance.value || !thumb.value)
              return;
            if (cursorDown === false)
              return;
            const prevPage = thumbState.value[bar.value.axis];
            if (!prevPage)
              return;
            const offset = (instance.value.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]) * -1;
            const thumbClickPosition = thumb.value[bar.value.offset] - prevPage;
            const thumbPositionPercentage = (offset - thumbClickPosition) * 100 * offsetRatio.value / instance.value[bar.value.offset];
            scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize] / 100;
          };
          const mouseUpDocumentHandler = () => {
            cursorDown = false;
            thumbState.value[bar.value.axis] = 0;
            document.removeEventListener("mousemove", mouseMoveDocumentHandler);
            document.removeEventListener("mouseup", mouseUpDocumentHandler);
            restoreOnselectstart();
            if (cursorLeave)
              visible.value = false;
          };
          const mouseMoveScrollbarHandler = () => {
            cursorLeave = false;
            visible.value = !!props.size;
          };
          const mouseLeaveScrollbarHandler = () => {
            cursorLeave = true;
            visible.value = cursorDown;
          };
          vue.onBeforeUnmount(() => {
            restoreOnselectstart();
            document.removeEventListener("mouseup", mouseUpDocumentHandler);
          });
          const restoreOnselectstart = () => {
            if (document.onselectstart !== originalOnSelectStart)
              document.onselectstart = originalOnSelectStart;
          };
          useEventListener(vue.toRef(scrollbar, "scrollbarElement"), "mousemove", mouseMoveScrollbarHandler);
          useEventListener(vue.toRef(scrollbar, "scrollbarElement"), "mouseleave", mouseLeaveScrollbarHandler);
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.Transition, {
              name: vue.unref(ns).b("fade"),
              persisted: ""
            }, {
              default: vue.withCtx(() => [
                vue.withDirectives(vue.createElementVNode("div", {
                  ref_key: "instance",
                  ref: instance,
                  class: vue.normalizeClass([vue.unref(ns).e("bar"), vue.unref(ns).is(vue.unref(bar).key)]),
                  onMousedown: clickTrackHandler
                }, [
                  vue.createElementVNode("div", {
                    ref_key: "thumb",
                    ref: thumb,
                    class: vue.normalizeClass(vue.unref(ns).e("thumb")),
                    style: vue.normalizeStyle(vue.unref(thumbStyle)),
                    onMousedown: clickThumbHandler
                  }, null, 38)
                ], 34), [
                  [vue.vShow, _ctx.always || visible.value]
                ])
              ]),
              _: 1
            }, 8, ["name"]);
          };
        }
      });
      var Thumb = /* @__PURE__ */ _export_sfc$1(_sfc_main$B, [["__file", "thumb.vue"]]);
      const barProps = buildProps({
        always: {
          type: Boolean,
          default: true
        },
        minSize: {
          type: Number,
          required: true
        }
      });
      const _sfc_main$A = /* @__PURE__ */ vue.defineComponent({
        __name: "bar",
        props: barProps,
        setup(__props, { expose }) {
          const props = __props;
          const scrollbar = vue.inject(scrollbarContextKey);
          const moveX = vue.ref(0);
          const moveY = vue.ref(0);
          const sizeWidth = vue.ref("");
          const sizeHeight = vue.ref("");
          const ratioY = vue.ref(1);
          const ratioX = vue.ref(1);
          const handleScroll = (wrap) => {
            if (wrap) {
              const offsetHeight = wrap.offsetHeight - GAP;
              const offsetWidth = wrap.offsetWidth - GAP;
              moveY.value = wrap.scrollTop * 100 / offsetHeight * ratioY.value;
              moveX.value = wrap.scrollLeft * 100 / offsetWidth * ratioX.value;
            }
          };
          const update = () => {
            const wrap = scrollbar == null ? void 0 : scrollbar.wrapElement;
            if (!wrap)
              return;
            const offsetHeight = wrap.offsetHeight - GAP;
            const offsetWidth = wrap.offsetWidth - GAP;
            const originalHeight = offsetHeight ** 2 / wrap.scrollHeight;
            const originalWidth = offsetWidth ** 2 / wrap.scrollWidth;
            const height = Math.max(originalHeight, props.minSize);
            const width = Math.max(originalWidth, props.minSize);
            ratioY.value = originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height));
            ratioX.value = originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width));
            sizeHeight.value = height + GAP < offsetHeight ? `${height}px` : "";
            sizeWidth.value = width + GAP < offsetWidth ? `${width}px` : "";
          };
          expose({
            handleScroll,
            update
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
              vue.createVNode(Thumb, {
                move: moveX.value,
                ratio: ratioX.value,
                size: sizeWidth.value,
                always: _ctx.always
              }, null, 8, ["move", "ratio", "size", "always"]),
              vue.createVNode(Thumb, {
                move: moveY.value,
                ratio: ratioY.value,
                size: sizeHeight.value,
                vertical: "",
                always: _ctx.always
              }, null, 8, ["move", "ratio", "size", "always"])
            ], 64);
          };
        }
      });
      var Bar = /* @__PURE__ */ _export_sfc$1(_sfc_main$A, [["__file", "bar.vue"]]);
      const scrollbarProps = buildProps({
        height: {
          type: [String, Number],
          default: ""
        },
        maxHeight: {
          type: [String, Number],
          default: ""
        },
        native: {
          type: Boolean,
          default: false
        },
        wrapStyle: {
          type: definePropType([String, Object, Array]),
          default: ""
        },
        wrapClass: {
          type: [String, Array],
          default: ""
        },
        viewClass: {
          type: [String, Array],
          default: ""
        },
        viewStyle: {
          type: [String, Array, Object],
          default: ""
        },
        noresize: Boolean,
        tag: {
          type: String,
          default: "div"
        },
        always: Boolean,
        minSize: {
          type: Number,
          default: 20
        },
        tabindex: {
          type: [String, Number],
          default: void 0
        },
        id: String,
        role: String,
        ...useAriaProps(["ariaLabel", "ariaOrientation"])
      });
      const scrollbarEmits = {
        scroll: ({
          scrollTop,
          scrollLeft
        }) => [scrollTop, scrollLeft].every(isNumber)
      };
      const COMPONENT_NAME$2 = "ElScrollbar";
      const __default__$o = vue.defineComponent({
        name: COMPONENT_NAME$2
      });
      const _sfc_main$z = /* @__PURE__ */ vue.defineComponent({
        ...__default__$o,
        props: scrollbarProps,
        emits: scrollbarEmits,
        setup(__props, { expose, emit }) {
          const props = __props;
          const ns = useNamespace("scrollbar");
          let stopResizeObserver = void 0;
          let stopResizeListener = void 0;
          let wrapScrollTop = 0;
          let wrapScrollLeft = 0;
          const scrollbarRef = vue.ref();
          const wrapRef = vue.ref();
          const resizeRef = vue.ref();
          const barRef = vue.ref();
          const wrapStyle = vue.computed(() => {
            const style = {};
            if (props.height)
              style.height = addUnit(props.height);
            if (props.maxHeight)
              style.maxHeight = addUnit(props.maxHeight);
            return [props.wrapStyle, style];
          });
          const wrapKls = vue.computed(() => {
            return [
              props.wrapClass,
              ns.e("wrap"),
              { [ns.em("wrap", "hidden-default")]: !props.native }
            ];
          });
          const resizeKls = vue.computed(() => {
            return [ns.e("view"), props.viewClass];
          });
          const handleScroll = () => {
            var _a2;
            if (wrapRef.value) {
              (_a2 = barRef.value) == null ? void 0 : _a2.handleScroll(wrapRef.value);
              wrapScrollTop = wrapRef.value.scrollTop;
              wrapScrollLeft = wrapRef.value.scrollLeft;
              emit("scroll", {
                scrollTop: wrapRef.value.scrollTop,
                scrollLeft: wrapRef.value.scrollLeft
              });
            }
          };
          function scrollTo(arg1, arg2) {
            if (isObject$1(arg1)) {
              wrapRef.value.scrollTo(arg1);
            } else if (isNumber(arg1) && isNumber(arg2)) {
              wrapRef.value.scrollTo(arg1, arg2);
            }
          }
          const setScrollTop = (value) => {
            if (!isNumber(value)) {
              return;
            }
            wrapRef.value.scrollTop = value;
          };
          const setScrollLeft = (value) => {
            if (!isNumber(value)) {
              return;
            }
            wrapRef.value.scrollLeft = value;
          };
          const update = () => {
            var _a2;
            (_a2 = barRef.value) == null ? void 0 : _a2.update();
          };
          vue.watch(() => props.noresize, (noresize) => {
            if (noresize) {
              stopResizeObserver == null ? void 0 : stopResizeObserver();
              stopResizeListener == null ? void 0 : stopResizeListener();
            } else {
              ({ stop: stopResizeObserver } = useResizeObserver(resizeRef, update));
              stopResizeListener = useEventListener("resize", update);
            }
          }, { immediate: true });
          vue.watch(() => [props.maxHeight, props.height], () => {
            if (!props.native)
              vue.nextTick(() => {
                var _a2;
                update();
                if (wrapRef.value) {
                  (_a2 = barRef.value) == null ? void 0 : _a2.handleScroll(wrapRef.value);
                }
              });
          });
          vue.provide(scrollbarContextKey, vue.reactive({
            scrollbarElement: scrollbarRef,
            wrapElement: wrapRef
          }));
          vue.onActivated(() => {
            if (wrapRef.value) {
              wrapRef.value.scrollTop = wrapScrollTop;
              wrapRef.value.scrollLeft = wrapScrollLeft;
            }
          });
          vue.onMounted(() => {
            if (!props.native)
              vue.nextTick(() => {
                update();
              });
          });
          vue.onUpdated(() => update());
          expose({
            wrapRef,
            update,
            scrollTo,
            setScrollTop,
            setScrollLeft,
            handleScroll
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              ref_key: "scrollbarRef",
              ref: scrollbarRef,
              class: vue.normalizeClass(vue.unref(ns).b())
            }, [
              vue.createElementVNode("div", {
                ref_key: "wrapRef",
                ref: wrapRef,
                class: vue.normalizeClass(vue.unref(wrapKls)),
                style: vue.normalizeStyle(vue.unref(wrapStyle)),
                tabindex: _ctx.tabindex,
                onScroll: handleScroll
              }, [
                (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), {
                  id: _ctx.id,
                  ref_key: "resizeRef",
                  ref: resizeRef,
                  class: vue.normalizeClass(vue.unref(resizeKls)),
                  style: vue.normalizeStyle(_ctx.viewStyle),
                  role: _ctx.role,
                  "aria-label": _ctx.ariaLabel,
                  "aria-orientation": _ctx.ariaOrientation
                }, {
                  default: vue.withCtx(() => [
                    vue.renderSlot(_ctx.$slots, "default")
                  ]),
                  _: 3
                }, 8, ["id", "class", "style", "role", "aria-label", "aria-orientation"]))
              ], 46, ["tabindex"]),
              !_ctx.native ? (vue.openBlock(), vue.createBlock(Bar, {
                key: 0,
                ref_key: "barRef",
                ref: barRef,
                always: _ctx.always,
                "min-size": _ctx.minSize
              }, null, 8, ["always", "min-size"])) : vue.createCommentVNode("v-if", true)
            ], 2);
          };
        }
      });
      var Scrollbar = /* @__PURE__ */ _export_sfc$1(_sfc_main$z, [["__file", "scrollbar.vue"]]);
      const ElScrollbar = withInstall(Scrollbar);
      const POPPER_INJECTION_KEY = Symbol("popper");
      const POPPER_CONTENT_INJECTION_KEY = Symbol("popperContent");
      const roleTypes = [
        "dialog",
        "grid",
        "group",
        "listbox",
        "menu",
        "navigation",
        "tooltip",
        "tree"
      ];
      const popperProps = buildProps({
        role: {
          type: String,
          values: roleTypes,
          default: "tooltip"
        }
      });
      const __default__$n = vue.defineComponent({
        name: "ElPopper",
        inheritAttrs: false
      });
      const _sfc_main$y = /* @__PURE__ */ vue.defineComponent({
        ...__default__$n,
        props: popperProps,
        setup(__props, { expose }) {
          const props = __props;
          const triggerRef = vue.ref();
          const popperInstanceRef = vue.ref();
          const contentRef = vue.ref();
          const referenceRef = vue.ref();
          const role = vue.computed(() => props.role);
          const popperProvides = {
            triggerRef,
            popperInstanceRef,
            contentRef,
            referenceRef,
            role
          };
          expose(popperProvides);
          vue.provide(POPPER_INJECTION_KEY, popperProvides);
          return (_ctx, _cache) => {
            return vue.renderSlot(_ctx.$slots, "default");
          };
        }
      });
      var Popper = /* @__PURE__ */ _export_sfc$1(_sfc_main$y, [["__file", "popper.vue"]]);
      const popperArrowProps = buildProps({
        arrowOffset: {
          type: Number,
          default: 5
        }
      });
      const __default__$m = vue.defineComponent({
        name: "ElPopperArrow",
        inheritAttrs: false
      });
      const _sfc_main$x = /* @__PURE__ */ vue.defineComponent({
        ...__default__$m,
        props: popperArrowProps,
        setup(__props, { expose }) {
          const props = __props;
          const ns = useNamespace("popper");
          const { arrowOffset, arrowRef, arrowStyle } = vue.inject(POPPER_CONTENT_INJECTION_KEY, void 0);
          vue.watch(() => props.arrowOffset, (val) => {
            arrowOffset.value = val;
          });
          vue.onBeforeUnmount(() => {
            arrowRef.value = void 0;
          });
          expose({
            arrowRef
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("span", {
              ref_key: "arrowRef",
              ref: arrowRef,
              class: vue.normalizeClass(vue.unref(ns).e("arrow")),
              style: vue.normalizeStyle(vue.unref(arrowStyle)),
              "data-popper-arrow": ""
            }, null, 6);
          };
        }
      });
      var ElPopperArrow = /* @__PURE__ */ _export_sfc$1(_sfc_main$x, [["__file", "arrow.vue"]]);
      const NAME = "ElOnlyChild";
      const OnlyChild = vue.defineComponent({
        name: NAME,
        setup(_, {
          slots,
          attrs
        }) {
          var _a2;
          const forwardRefInjection = vue.inject(FORWARD_REF_INJECTION_KEY);
          const forwardRefDirective = useForwardRefDirective((_a2 = forwardRefInjection == null ? void 0 : forwardRefInjection.setForwardRef) != null ? _a2 : NOOP);
          return () => {
            var _a22;
            const defaultSlot = (_a22 = slots.default) == null ? void 0 : _a22.call(slots, attrs);
            if (!defaultSlot)
              return null;
            if (defaultSlot.length > 1) {
              return null;
            }
            const firstLegitNode = findFirstLegitChild(defaultSlot);
            if (!firstLegitNode) {
              return null;
            }
            return vue.withDirectives(vue.cloneVNode(firstLegitNode, attrs), [[forwardRefDirective]]);
          };
        }
      });
      function findFirstLegitChild(node) {
        if (!node)
          return null;
        const children = node;
        for (const child of children) {
          if (isObject$1(child)) {
            switch (child.type) {
              case vue.Comment:
                continue;
              case vue.Text:
              case "svg":
                return wrapTextContent(child);
              case vue.Fragment:
                return findFirstLegitChild(child.children);
              default:
                return child;
            }
          }
          return wrapTextContent(child);
        }
        return null;
      }
      function wrapTextContent(s) {
        const ns = useNamespace("only-child");
        return vue.createVNode("span", {
          "class": ns.e("content")
        }, [s]);
      }
      const popperTriggerProps = buildProps({
        virtualRef: {
          type: definePropType(Object)
        },
        virtualTriggering: Boolean,
        onMouseenter: {
          type: definePropType(Function)
        },
        onMouseleave: {
          type: definePropType(Function)
        },
        onClick: {
          type: definePropType(Function)
        },
        onKeydown: {
          type: definePropType(Function)
        },
        onFocus: {
          type: definePropType(Function)
        },
        onBlur: {
          type: definePropType(Function)
        },
        onContextmenu: {
          type: definePropType(Function)
        },
        id: String,
        open: Boolean
      });
      const __default__$l = vue.defineComponent({
        name: "ElPopperTrigger",
        inheritAttrs: false
      });
      const _sfc_main$w = /* @__PURE__ */ vue.defineComponent({
        ...__default__$l,
        props: popperTriggerProps,
        setup(__props, { expose }) {
          const props = __props;
          const { role, triggerRef } = vue.inject(POPPER_INJECTION_KEY, void 0);
          useForwardRef(triggerRef);
          const ariaControls = vue.computed(() => {
            return ariaHaspopup.value ? props.id : void 0;
          });
          const ariaDescribedby = vue.computed(() => {
            if (role && role.value === "tooltip") {
              return props.open && props.id ? props.id : void 0;
            }
            return void 0;
          });
          const ariaHaspopup = vue.computed(() => {
            if (role && role.value !== "tooltip") {
              return role.value;
            }
            return void 0;
          });
          const ariaExpanded = vue.computed(() => {
            return ariaHaspopup.value ? `${props.open}` : void 0;
          });
          let virtualTriggerAriaStopWatch = void 0;
          const TRIGGER_ELE_EVENTS = [
            "onMouseenter",
            "onMouseleave",
            "onClick",
            "onKeydown",
            "onFocus",
            "onBlur",
            "onContextmenu"
          ];
          vue.onMounted(() => {
            vue.watch(() => props.virtualRef, (virtualEl) => {
              if (virtualEl) {
                triggerRef.value = unrefElement(virtualEl);
              }
            }, {
              immediate: true
            });
            vue.watch(triggerRef, (el, prevEl) => {
              virtualTriggerAriaStopWatch == null ? void 0 : virtualTriggerAriaStopWatch();
              virtualTriggerAriaStopWatch = void 0;
              if (isElement(el)) {
                TRIGGER_ELE_EVENTS.forEach((eventName) => {
                  var _a2;
                  const handler = props[eventName];
                  if (handler) {
                    el.addEventListener(eventName.slice(2).toLowerCase(), handler);
                    (_a2 = prevEl == null ? void 0 : prevEl.removeEventListener) == null ? void 0 : _a2.call(prevEl, eventName.slice(2).toLowerCase(), handler);
                  }
                });
                if (isFocusable(el)) {
                  virtualTriggerAriaStopWatch = vue.watch([ariaControls, ariaDescribedby, ariaHaspopup, ariaExpanded], (watches) => {
                    [
                      "aria-controls",
                      "aria-describedby",
                      "aria-haspopup",
                      "aria-expanded"
                    ].forEach((key, idx) => {
                      isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]);
                    });
                  }, { immediate: true });
                }
              }
              if (isElement(prevEl) && isFocusable(prevEl)) {
                [
                  "aria-controls",
                  "aria-describedby",
                  "aria-haspopup",
                  "aria-expanded"
                ].forEach((key) => prevEl.removeAttribute(key));
              }
            }, {
              immediate: true
            });
          });
          vue.onBeforeUnmount(() => {
            virtualTriggerAriaStopWatch == null ? void 0 : virtualTriggerAriaStopWatch();
            virtualTriggerAriaStopWatch = void 0;
            if (triggerRef.value && isElement(triggerRef.value)) {
              const el = triggerRef.value;
              TRIGGER_ELE_EVENTS.forEach((eventName) => {
                const handler = props[eventName];
                if (handler) {
                  el.removeEventListener(eventName.slice(2).toLowerCase(), handler);
                }
              });
              triggerRef.value = void 0;
            }
          });
          expose({
            triggerRef
          });
          return (_ctx, _cache) => {
            return !_ctx.virtualTriggering ? (vue.openBlock(), vue.createBlock(vue.unref(OnlyChild), vue.mergeProps({ key: 0 }, _ctx.$attrs, {
              "aria-controls": vue.unref(ariaControls),
              "aria-describedby": vue.unref(ariaDescribedby),
              "aria-expanded": vue.unref(ariaExpanded),
              "aria-haspopup": vue.unref(ariaHaspopup)
            }), {
              default: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "default")
              ]),
              _: 3
            }, 16, ["aria-controls", "aria-describedby", "aria-expanded", "aria-haspopup"])) : vue.createCommentVNode("v-if", true);
          };
        }
      });
      var ElPopperTrigger = /* @__PURE__ */ _export_sfc$1(_sfc_main$w, [["__file", "trigger.vue"]]);
      const FOCUS_AFTER_TRAPPED = "focus-trap.focus-after-trapped";
      const FOCUS_AFTER_RELEASED = "focus-trap.focus-after-released";
      const FOCUSOUT_PREVENTED = "focus-trap.focusout-prevented";
      const FOCUS_AFTER_TRAPPED_OPTS = {
        cancelable: true,
        bubbles: false
      };
      const FOCUSOUT_PREVENTED_OPTS = {
        cancelable: true,
        bubbles: false
      };
      const ON_TRAP_FOCUS_EVT = "focusAfterTrapped";
      const ON_RELEASE_FOCUS_EVT = "focusAfterReleased";
      const FOCUS_TRAP_INJECTION_KEY = Symbol("elFocusTrap");
      const focusReason = vue.ref();
      const lastUserFocusTimestamp = vue.ref(0);
      const lastAutomatedFocusTimestamp = vue.ref(0);
      let focusReasonUserCount = 0;
      const obtainAllFocusableElements = (element) => {
        const nodes = [];
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
          acceptNode: (node) => {
            const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
            if (node.disabled || node.hidden || isHiddenInput)
              return NodeFilter.FILTER_SKIP;
            return node.tabIndex >= 0 || node === document.activeElement ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
          }
        });
        while (walker.nextNode())
          nodes.push(walker.currentNode);
        return nodes;
      };
      const getVisibleElement = (elements, container) => {
        for (const element of elements) {
          if (!isHidden(element, container))
            return element;
        }
      };
      const isHidden = (element, container) => {
        if (getComputedStyle(element).visibility === "hidden")
          return true;
        while (element) {
          if (container && element === container)
            return false;
          if (getComputedStyle(element).display === "none")
            return true;
          element = element.parentElement;
        }
        return false;
      };
      const getEdges = (container) => {
        const focusable = obtainAllFocusableElements(container);
        const first = getVisibleElement(focusable, container);
        const last = getVisibleElement(focusable.reverse(), container);
        return [first, last];
      };
      const isSelectable = (element) => {
        return element instanceof HTMLInputElement && "select" in element;
      };
      const tryFocus = (element, shouldSelect) => {
        if (element && element.focus) {
          const prevFocusedElement = document.activeElement;
          element.focus({ preventScroll: true });
          lastAutomatedFocusTimestamp.value = window.performance.now();
          if (element !== prevFocusedElement && isSelectable(element) && shouldSelect) {
            element.select();
          }
        }
      };
      function removeFromStack(list, item) {
        const copy = [...list];
        const idx = list.indexOf(item);
        if (idx !== -1) {
          copy.splice(idx, 1);
        }
        return copy;
      }
      const createFocusableStack = () => {
        let stack = [];
        const push = (layer) => {
          const currentLayer = stack[0];
          if (currentLayer && layer !== currentLayer) {
            currentLayer.pause();
          }
          stack = removeFromStack(stack, layer);
          stack.unshift(layer);
        };
        const remove = (layer) => {
          var _a2, _b;
          stack = removeFromStack(stack, layer);
          (_b = (_a2 = stack[0]) == null ? void 0 : _a2.resume) == null ? void 0 : _b.call(_a2);
        };
        return {
          push,
          remove
        };
      };
      const focusFirstDescendant = (elements, shouldSelect = false) => {
        const prevFocusedElement = document.activeElement;
        for (const element of elements) {
          tryFocus(element, shouldSelect);
          if (document.activeElement !== prevFocusedElement)
            return;
        }
      };
      const focusableStack = createFocusableStack();
      const isFocusCausedByUserEvent = () => {
        return lastUserFocusTimestamp.value > lastAutomatedFocusTimestamp.value;
      };
      const notifyFocusReasonPointer = () => {
        focusReason.value = "pointer";
        lastUserFocusTimestamp.value = window.performance.now();
      };
      const notifyFocusReasonKeydown = () => {
        focusReason.value = "keyboard";
        lastUserFocusTimestamp.value = window.performance.now();
      };
      const useFocusReason = () => {
        vue.onMounted(() => {
          if (focusReasonUserCount === 0) {
            document.addEventListener("mousedown", notifyFocusReasonPointer);
            document.addEventListener("touchstart", notifyFocusReasonPointer);
            document.addEventListener("keydown", notifyFocusReasonKeydown);
          }
          focusReasonUserCount++;
        });
        vue.onBeforeUnmount(() => {
          focusReasonUserCount--;
          if (focusReasonUserCount <= 0) {
            document.removeEventListener("mousedown", notifyFocusReasonPointer);
            document.removeEventListener("touchstart", notifyFocusReasonPointer);
            document.removeEventListener("keydown", notifyFocusReasonKeydown);
          }
        });
        return {
          focusReason,
          lastUserFocusTimestamp,
          lastAutomatedFocusTimestamp
        };
      };
      const createFocusOutPreventedEvent = (detail) => {
        return new CustomEvent(FOCUSOUT_PREVENTED, {
          ...FOCUSOUT_PREVENTED_OPTS,
          detail
        });
      };
      const _sfc_main$v = vue.defineComponent({
        name: "ElFocusTrap",
        inheritAttrs: false,
        props: {
          loop: Boolean,
          trapped: Boolean,
          focusTrapEl: Object,
          focusStartEl: {
            type: [Object, String],
            default: "first"
          }
        },
        emits: [
          ON_TRAP_FOCUS_EVT,
          ON_RELEASE_FOCUS_EVT,
          "focusin",
          "focusout",
          "focusout-prevented",
          "release-requested"
        ],
        setup(props, { emit }) {
          const forwardRef = vue.ref();
          let lastFocusBeforeTrapped;
          let lastFocusAfterTrapped;
          const { focusReason: focusReason2 } = useFocusReason();
          useEscapeKeydown((event) => {
            if (props.trapped && !focusLayer.paused) {
              emit("release-requested", event);
            }
          });
          const focusLayer = {
            paused: false,
            pause() {
              this.paused = true;
            },
            resume() {
              this.paused = false;
            }
          };
          const onKeydown = (e) => {
            if (!props.loop && !props.trapped)
              return;
            if (focusLayer.paused)
              return;
            const { code, altKey, ctrlKey, metaKey, currentTarget, shiftKey } = e;
            const { loop } = props;
            const isTabbing = code === EVENT_CODE.tab && !altKey && !ctrlKey && !metaKey;
            const currentFocusingEl = document.activeElement;
            if (isTabbing && currentFocusingEl) {
              const container = currentTarget;
              const [first, last] = getEdges(container);
              const isTabbable = first && last;
              if (!isTabbable) {
                if (currentFocusingEl === container) {
                  const focusoutPreventedEvent = createFocusOutPreventedEvent({
                    focusReason: focusReason2.value
                  });
                  emit("focusout-prevented", focusoutPreventedEvent);
                  if (!focusoutPreventedEvent.defaultPrevented) {
                    e.preventDefault();
                  }
                }
              } else {
                if (!shiftKey && currentFocusingEl === last) {
                  const focusoutPreventedEvent = createFocusOutPreventedEvent({
                    focusReason: focusReason2.value
                  });
                  emit("focusout-prevented", focusoutPreventedEvent);
                  if (!focusoutPreventedEvent.defaultPrevented) {
                    e.preventDefault();
                    if (loop)
                      tryFocus(first, true);
                  }
                } else if (shiftKey && [first, container].includes(currentFocusingEl)) {
                  const focusoutPreventedEvent = createFocusOutPreventedEvent({
                    focusReason: focusReason2.value
                  });
                  emit("focusout-prevented", focusoutPreventedEvent);
                  if (!focusoutPreventedEvent.defaultPrevented) {
                    e.preventDefault();
                    if (loop)
                      tryFocus(last, true);
                  }
                }
              }
            }
          };
          vue.provide(FOCUS_TRAP_INJECTION_KEY, {
            focusTrapRef: forwardRef,
            onKeydown
          });
          vue.watch(() => props.focusTrapEl, (focusTrapEl) => {
            if (focusTrapEl) {
              forwardRef.value = focusTrapEl;
            }
          }, { immediate: true });
          vue.watch([forwardRef], ([forwardRef2], [oldForwardRef]) => {
            if (forwardRef2) {
              forwardRef2.addEventListener("keydown", onKeydown);
              forwardRef2.addEventListener("focusin", onFocusIn);
              forwardRef2.addEventListener("focusout", onFocusOut);
            }
            if (oldForwardRef) {
              oldForwardRef.removeEventListener("keydown", onKeydown);
              oldForwardRef.removeEventListener("focusin", onFocusIn);
              oldForwardRef.removeEventListener("focusout", onFocusOut);
            }
          });
          const trapOnFocus = (e) => {
            emit(ON_TRAP_FOCUS_EVT, e);
          };
          const releaseOnFocus = (e) => emit(ON_RELEASE_FOCUS_EVT, e);
          const onFocusIn = (e) => {
            const trapContainer = vue.unref(forwardRef);
            if (!trapContainer)
              return;
            const target = e.target;
            const relatedTarget = e.relatedTarget;
            const isFocusedInTrap = target && trapContainer.contains(target);
            if (!props.trapped) {
              const isPrevFocusedInTrap = relatedTarget && trapContainer.contains(relatedTarget);
              if (!isPrevFocusedInTrap) {
                lastFocusBeforeTrapped = relatedTarget;
              }
            }
            if (isFocusedInTrap)
              emit("focusin", e);
            if (focusLayer.paused)
              return;
            if (props.trapped) {
              if (isFocusedInTrap) {
                lastFocusAfterTrapped = target;
              } else {
                tryFocus(lastFocusAfterTrapped, true);
              }
            }
          };
          const onFocusOut = (e) => {
            const trapContainer = vue.unref(forwardRef);
            if (focusLayer.paused || !trapContainer)
              return;
            if (props.trapped) {
              const relatedTarget = e.relatedTarget;
              if (!isNil(relatedTarget) && !trapContainer.contains(relatedTarget)) {
                setTimeout(() => {
                  if (!focusLayer.paused && props.trapped) {
                    const focusoutPreventedEvent = createFocusOutPreventedEvent({
                      focusReason: focusReason2.value
                    });
                    emit("focusout-prevented", focusoutPreventedEvent);
                    if (!focusoutPreventedEvent.defaultPrevented) {
                      tryFocus(lastFocusAfterTrapped, true);
                    }
                  }
                }, 0);
              }
            } else {
              const target = e.target;
              const isFocusedInTrap = target && trapContainer.contains(target);
              if (!isFocusedInTrap)
                emit("focusout", e);
            }
          };
          async function startTrap() {
            await vue.nextTick();
            const trapContainer = vue.unref(forwardRef);
            if (trapContainer) {
              focusableStack.push(focusLayer);
              const prevFocusedElement = trapContainer.contains(document.activeElement) ? lastFocusBeforeTrapped : document.activeElement;
              lastFocusBeforeTrapped = prevFocusedElement;
              const isPrevFocusContained = trapContainer.contains(prevFocusedElement);
              if (!isPrevFocusContained) {
                const focusEvent = new Event(FOCUS_AFTER_TRAPPED, FOCUS_AFTER_TRAPPED_OPTS);
                trapContainer.addEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);
                trapContainer.dispatchEvent(focusEvent);
                if (!focusEvent.defaultPrevented) {
                  vue.nextTick(() => {
                    let focusStartEl = props.focusStartEl;
                    if (!isString(focusStartEl)) {
                      tryFocus(focusStartEl);
                      if (document.activeElement !== focusStartEl) {
                        focusStartEl = "first";
                      }
                    }
                    if (focusStartEl === "first") {
                      focusFirstDescendant(obtainAllFocusableElements(trapContainer), true);
                    }
                    if (document.activeElement === prevFocusedElement || focusStartEl === "container") {
                      tryFocus(trapContainer);
                    }
                  });
                }
              }
            }
          }
          function stopTrap() {
            const trapContainer = vue.unref(forwardRef);
            if (trapContainer) {
              trapContainer.removeEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);
              const releasedEvent = new CustomEvent(FOCUS_AFTER_RELEASED, {
                ...FOCUS_AFTER_TRAPPED_OPTS,
                detail: {
                  focusReason: focusReason2.value
                }
              });
              trapContainer.addEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus);
              trapContainer.dispatchEvent(releasedEvent);
              if (!releasedEvent.defaultPrevented && (focusReason2.value == "keyboard" || !isFocusCausedByUserEvent() || trapContainer.contains(document.activeElement))) {
                tryFocus(lastFocusBeforeTrapped != null ? lastFocusBeforeTrapped : document.body);
              }
              trapContainer.removeEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus);
              focusableStack.remove(focusLayer);
            }
          }
          vue.onMounted(() => {
            if (props.trapped) {
              startTrap();
            }
            vue.watch(() => props.trapped, (trapped) => {
              if (trapped) {
                startTrap();
              } else {
                stopTrap();
              }
            });
          });
          vue.onBeforeUnmount(() => {
            if (props.trapped) {
              stopTrap();
            }
            if (forwardRef.value) {
              forwardRef.value.removeEventListener("keydown", onKeydown);
              forwardRef.value.removeEventListener("focusin", onFocusIn);
              forwardRef.value.removeEventListener("focusout", onFocusOut);
              forwardRef.value = void 0;
            }
          });
          return {
            onKeydown
          };
        }
      });
      function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.renderSlot(_ctx.$slots, "default", { handleKeydown: _ctx.onKeydown });
      }
      var ElFocusTrap = /* @__PURE__ */ _export_sfc$1(_sfc_main$v, [["render", _sfc_render$4], ["__file", "focus-trap.vue"]]);
      const POSITIONING_STRATEGIES = ["fixed", "absolute"];
      const popperCoreConfigProps = buildProps({
        boundariesPadding: {
          type: Number,
          default: 0
        },
        fallbackPlacements: {
          type: definePropType(Array),
          default: void 0
        },
        gpuAcceleration: {
          type: Boolean,
          default: true
        },
        offset: {
          type: Number,
          default: 12
        },
        placement: {
          type: String,
          values: Ee,
          default: "bottom"
        },
        popperOptions: {
          type: definePropType(Object),
          default: () => ({})
        },
        strategy: {
          type: String,
          values: POSITIONING_STRATEGIES,
          default: "absolute"
        }
      });
      const popperContentProps = buildProps({
        ...popperCoreConfigProps,
        id: String,
        style: {
          type: definePropType([String, Array, Object])
        },
        className: {
          type: definePropType([String, Array, Object])
        },
        effect: {
          type: definePropType(String),
          default: "dark"
        },
        visible: Boolean,
        enterable: {
          type: Boolean,
          default: true
        },
        pure: Boolean,
        focusOnShow: {
          type: Boolean,
          default: false
        },
        trapping: {
          type: Boolean,
          default: false
        },
        popperClass: {
          type: definePropType([String, Array, Object])
        },
        popperStyle: {
          type: definePropType([String, Array, Object])
        },
        referenceEl: {
          type: definePropType(Object)
        },
        triggerTargetEl: {
          type: definePropType(Object)
        },
        stopPopperMouseEvent: {
          type: Boolean,
          default: true
        },
        virtualTriggering: Boolean,
        zIndex: Number,
        ...useAriaProps(["ariaLabel"])
      });
      const popperContentEmits = {
        mouseenter: (evt) => evt instanceof MouseEvent,
        mouseleave: (evt) => evt instanceof MouseEvent,
        focus: () => true,
        blur: () => true,
        close: () => true
      };
      const buildPopperOptions = (props, modifiers = []) => {
        const { placement, strategy, popperOptions } = props;
        const options = {
          placement,
          strategy,
          ...popperOptions,
          modifiers: [...genModifiers(props), ...modifiers]
        };
        deriveExtraModifiers(options, popperOptions == null ? void 0 : popperOptions.modifiers);
        return options;
      };
      const unwrapMeasurableEl = ($el) => {
        if (!isClient)
          return;
        return unrefElement($el);
      };
      function genModifiers(options) {
        const { offset, gpuAcceleration, fallbackPlacements } = options;
        return [
          {
            name: "offset",
            options: {
              offset: [0, offset != null ? offset : 12]
            }
          },
          {
            name: "preventOverflow",
            options: {
              padding: {
                top: 2,
                bottom: 2,
                left: 5,
                right: 5
              }
            }
          },
          {
            name: "flip",
            options: {
              padding: 5,
              fallbackPlacements
            }
          },
          {
            name: "computeStyles",
            options: {
              gpuAcceleration
            }
          }
        ];
      }
      function deriveExtraModifiers(options, modifiers) {
        if (modifiers) {
          options.modifiers = [...options.modifiers, ...modifiers != null ? modifiers : []];
        }
      }
      const DEFAULT_ARROW_OFFSET = 0;
      const usePopperContent = (props) => {
        const { popperInstanceRef, contentRef, triggerRef, role } = vue.inject(POPPER_INJECTION_KEY, void 0);
        const arrowRef = vue.ref();
        const arrowOffset = vue.ref();
        const eventListenerModifier = vue.computed(() => {
          return {
            name: "eventListeners",
            enabled: !!props.visible
          };
        });
        const arrowModifier = vue.computed(() => {
          var _a2;
          const arrowEl = vue.unref(arrowRef);
          const offset = (_a2 = vue.unref(arrowOffset)) != null ? _a2 : DEFAULT_ARROW_OFFSET;
          return {
            name: "arrow",
            enabled: !isUndefined$1(arrowEl),
            options: {
              element: arrowEl,
              padding: offset
            }
          };
        });
        const options = vue.computed(() => {
          return {
            onFirstUpdate: () => {
              update();
            },
            ...buildPopperOptions(props, [
              vue.unref(arrowModifier),
              vue.unref(eventListenerModifier)
            ])
          };
        });
        const computedReference = vue.computed(() => unwrapMeasurableEl(props.referenceEl) || vue.unref(triggerRef));
        const { attributes, state, styles, update, forceUpdate, instanceRef } = usePopper(computedReference, contentRef, options);
        vue.watch(instanceRef, (instance) => popperInstanceRef.value = instance);
        vue.onMounted(() => {
          vue.watch(() => {
            var _a2;
            return (_a2 = vue.unref(computedReference)) == null ? void 0 : _a2.getBoundingClientRect();
          }, () => {
            update();
          });
        });
        return {
          attributes,
          arrowRef,
          contentRef,
          instanceRef,
          state,
          styles,
          role,
          forceUpdate,
          update
        };
      };
      const usePopperContentDOM = (props, {
        attributes,
        styles,
        role
      }) => {
        const { nextZIndex } = useZIndex();
        const ns = useNamespace("popper");
        const contentAttrs = vue.computed(() => vue.unref(attributes).popper);
        const contentZIndex = vue.ref(isNumber(props.zIndex) ? props.zIndex : nextZIndex());
        const contentClass = vue.computed(() => [
          ns.b(),
          ns.is("pure", props.pure),
          ns.is(props.effect),
          props.popperClass
        ]);
        const contentStyle = vue.computed(() => {
          return [
            { zIndex: vue.unref(contentZIndex) },
            vue.unref(styles).popper,
            props.popperStyle || {}
          ];
        });
        const ariaModal = vue.computed(() => role.value === "dialog" ? "false" : void 0);
        const arrowStyle = vue.computed(() => vue.unref(styles).arrow || {});
        const updateZIndex = () => {
          contentZIndex.value = isNumber(props.zIndex) ? props.zIndex : nextZIndex();
        };
        return {
          ariaModal,
          arrowStyle,
          contentAttrs,
          contentClass,
          contentStyle,
          contentZIndex,
          updateZIndex
        };
      };
      const usePopperContentFocusTrap = (props, emit) => {
        const trapped = vue.ref(false);
        const focusStartRef = vue.ref();
        const onFocusAfterTrapped = () => {
          emit("focus");
        };
        const onFocusAfterReleased = (event) => {
          var _a2;
          if (((_a2 = event.detail) == null ? void 0 : _a2.focusReason) !== "pointer") {
            focusStartRef.value = "first";
            emit("blur");
          }
        };
        const onFocusInTrap = (event) => {
          if (props.visible && !trapped.value) {
            if (event.target) {
              focusStartRef.value = event.target;
            }
            trapped.value = true;
          }
        };
        const onFocusoutPrevented = (event) => {
          if (!props.trapping) {
            if (event.detail.focusReason === "pointer") {
              event.preventDefault();
            }
            trapped.value = false;
          }
        };
        const onReleaseRequested = () => {
          trapped.value = false;
          emit("close");
        };
        return {
          focusStartRef,
          trapped,
          onFocusAfterReleased,
          onFocusAfterTrapped,
          onFocusInTrap,
          onFocusoutPrevented,
          onReleaseRequested
        };
      };
      const __default__$k = vue.defineComponent({
        name: "ElPopperContent"
      });
      const _sfc_main$u = /* @__PURE__ */ vue.defineComponent({
        ...__default__$k,
        props: popperContentProps,
        emits: popperContentEmits,
        setup(__props, { expose, emit }) {
          const props = __props;
          const {
            focusStartRef,
            trapped,
            onFocusAfterReleased,
            onFocusAfterTrapped,
            onFocusInTrap,
            onFocusoutPrevented,
            onReleaseRequested
          } = usePopperContentFocusTrap(props, emit);
          const { attributes, arrowRef, contentRef, styles, instanceRef, role, update } = usePopperContent(props);
          const {
            ariaModal,
            arrowStyle,
            contentAttrs,
            contentClass,
            contentStyle,
            updateZIndex
          } = usePopperContentDOM(props, {
            styles,
            attributes,
            role
          });
          const formItemContext = vue.inject(formItemContextKey, void 0);
          const arrowOffset = vue.ref();
          vue.provide(POPPER_CONTENT_INJECTION_KEY, {
            arrowStyle,
            arrowRef,
            arrowOffset
          });
          if (formItemContext) {
            vue.provide(formItemContextKey, {
              ...formItemContext,
              addInputId: NOOP,
              removeInputId: NOOP
            });
          }
          let triggerTargetAriaStopWatch = void 0;
          const updatePopper = (shouldUpdateZIndex = true) => {
            update();
            shouldUpdateZIndex && updateZIndex();
          };
          const togglePopperAlive = () => {
            updatePopper(false);
            if (props.visible && props.focusOnShow) {
              trapped.value = true;
            } else if (props.visible === false) {
              trapped.value = false;
            }
          };
          vue.onMounted(() => {
            vue.watch(() => props.triggerTargetEl, (triggerTargetEl, prevTriggerTargetEl) => {
              triggerTargetAriaStopWatch == null ? void 0 : triggerTargetAriaStopWatch();
              triggerTargetAriaStopWatch = void 0;
              const el = vue.unref(triggerTargetEl || contentRef.value);
              const prevEl = vue.unref(prevTriggerTargetEl || contentRef.value);
              if (isElement(el)) {
                triggerTargetAriaStopWatch = vue.watch([role, () => props.ariaLabel, ariaModal, () => props.id], (watches) => {
                  ["role", "aria-label", "aria-modal", "id"].forEach((key, idx) => {
                    isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]);
                  });
                }, { immediate: true });
              }
              if (prevEl !== el && isElement(prevEl)) {
                ["role", "aria-label", "aria-modal", "id"].forEach((key) => {
                  prevEl.removeAttribute(key);
                });
              }
            }, { immediate: true });
            vue.watch(() => props.visible, togglePopperAlive, { immediate: true });
          });
          vue.onBeforeUnmount(() => {
            triggerTargetAriaStopWatch == null ? void 0 : triggerTargetAriaStopWatch();
            triggerTargetAriaStopWatch = void 0;
          });
          expose({
            popperContentRef: contentRef,
            popperInstanceRef: instanceRef,
            updatePopper,
            contentStyle
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({
              ref_key: "contentRef",
              ref: contentRef
            }, vue.unref(contentAttrs), {
              style: vue.unref(contentStyle),
              class: vue.unref(contentClass),
              tabindex: "-1",
              onMouseenter: (e) => _ctx.$emit("mouseenter", e),
              onMouseleave: (e) => _ctx.$emit("mouseleave", e)
            }), [
              vue.createVNode(vue.unref(ElFocusTrap), {
                trapped: vue.unref(trapped),
                "trap-on-focus-in": true,
                "focus-trap-el": vue.unref(contentRef),
                "focus-start-el": vue.unref(focusStartRef),
                onFocusAfterTrapped: vue.unref(onFocusAfterTrapped),
                onFocusAfterReleased: vue.unref(onFocusAfterReleased),
                onFocusin: vue.unref(onFocusInTrap),
                onFocusoutPrevented: vue.unref(onFocusoutPrevented),
                onReleaseRequested: vue.unref(onReleaseRequested)
              }, {
                default: vue.withCtx(() => [
                  vue.renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              }, 8, ["trapped", "focus-trap-el", "focus-start-el", "onFocusAfterTrapped", "onFocusAfterReleased", "onFocusin", "onFocusoutPrevented", "onReleaseRequested"])
            ], 16, ["onMouseenter", "onMouseleave"]);
          };
        }
      });
      var ElPopperContent = /* @__PURE__ */ _export_sfc$1(_sfc_main$u, [["__file", "content.vue"]]);
      const ElPopper = withInstall(Popper);
      const TOOLTIP_INJECTION_KEY = Symbol("elTooltip");
      const useTooltipContentProps = buildProps({
        ...useDelayedToggleProps,
        ...popperContentProps,
        appendTo: {
          type: definePropType([String, Object])
        },
        content: {
          type: String,
          default: ""
        },
        rawContent: Boolean,
        persistent: Boolean,
        visible: {
          type: definePropType(Boolean),
          default: null
        },
        transition: String,
        teleported: {
          type: Boolean,
          default: true
        },
        disabled: Boolean,
        ...useAriaProps(["ariaLabel"])
      });
      const useTooltipTriggerProps = buildProps({
        ...popperTriggerProps,
        disabled: Boolean,
        trigger: {
          type: definePropType([String, Array]),
          default: "hover"
        },
        triggerKeys: {
          type: definePropType(Array),
          default: () => [EVENT_CODE.enter, EVENT_CODE.numpadEnter, EVENT_CODE.space]
        }
      });
      const {
        useModelToggleProps: useTooltipModelToggleProps,
        useModelToggleEmits: useTooltipModelToggleEmits,
        useModelToggle: useTooltipModelToggle
      } = createModelToggleComposable("visible");
      const useTooltipProps = buildProps({
        ...popperProps,
        ...useTooltipModelToggleProps,
        ...useTooltipContentProps,
        ...useTooltipTriggerProps,
        ...popperArrowProps,
        showArrow: {
          type: Boolean,
          default: true
        }
      });
      const tooltipEmits = [
        ...useTooltipModelToggleEmits,
        "before-show",
        "before-hide",
        "show",
        "hide",
        "open",
        "close"
      ];
      const isTriggerType = (trigger, type) => {
        if (isArray$1(trigger)) {
          return trigger.includes(type);
        }
        return trigger === type;
      };
      const whenTrigger = (trigger, type, handler) => {
        return (e) => {
          isTriggerType(vue.unref(trigger), type) && handler(e);
        };
      };
      const __default__$j = vue.defineComponent({
        name: "ElTooltipTrigger"
      });
      const _sfc_main$t = /* @__PURE__ */ vue.defineComponent({
        ...__default__$j,
        props: useTooltipTriggerProps,
        setup(__props, { expose }) {
          const props = __props;
          const ns = useNamespace("tooltip");
          const { controlled, id, open, onOpen, onClose, onToggle } = vue.inject(TOOLTIP_INJECTION_KEY, void 0);
          const triggerRef = vue.ref(null);
          const stopWhenControlledOrDisabled = () => {
            if (vue.unref(controlled) || props.disabled) {
              return true;
            }
          };
          const trigger = vue.toRef(props, "trigger");
          const onMouseenter = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "hover", onOpen));
          const onMouseleave = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "hover", onClose));
          const onClick = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "click", (e) => {
            if (e.button === 0) {
              onToggle(e);
            }
          }));
          const onFocus = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "focus", onOpen));
          const onBlur = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "focus", onClose));
          const onContextMenu = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "contextmenu", (e) => {
            e.preventDefault();
            onToggle(e);
          }));
          const onKeydown = composeEventHandlers(stopWhenControlledOrDisabled, (e) => {
            const { code } = e;
            if (props.triggerKeys.includes(code)) {
              e.preventDefault();
              onToggle(e);
            }
          });
          expose({
            triggerRef
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.unref(ElPopperTrigger), {
              id: vue.unref(id),
              "virtual-ref": _ctx.virtualRef,
              open: vue.unref(open),
              "virtual-triggering": _ctx.virtualTriggering,
              class: vue.normalizeClass(vue.unref(ns).e("trigger")),
              onBlur: vue.unref(onBlur),
              onClick: vue.unref(onClick),
              onContextmenu: vue.unref(onContextMenu),
              onFocus: vue.unref(onFocus),
              onMouseenter: vue.unref(onMouseenter),
              onMouseleave: vue.unref(onMouseleave),
              onKeydown: vue.unref(onKeydown)
            }, {
              default: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "default")
              ]),
              _: 3
            }, 8, ["id", "virtual-ref", "open", "virtual-triggering", "class", "onBlur", "onClick", "onContextmenu", "onFocus", "onMouseenter", "onMouseleave", "onKeydown"]);
          };
        }
      });
      var ElTooltipTrigger = /* @__PURE__ */ _export_sfc$1(_sfc_main$t, [["__file", "trigger.vue"]]);
      const teleportProps = buildProps({
        to: {
          type: definePropType([String, Object]),
          required: true
        },
        disabled: Boolean
      });
      const _sfc_main$s = /* @__PURE__ */ vue.defineComponent({
        __name: "teleport",
        props: teleportProps,
        setup(__props) {
          return (_ctx, _cache) => {
            return _ctx.disabled ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : (vue.openBlock(), vue.createBlock(vue.Teleport, {
              key: 1,
              to: _ctx.to
            }, [
              vue.renderSlot(_ctx.$slots, "default")
            ], 8, ["to"]));
          };
        }
      });
      var Teleport = /* @__PURE__ */ _export_sfc$1(_sfc_main$s, [["__file", "teleport.vue"]]);
      const ElTeleport = withInstall(Teleport);
      const __default__$i = vue.defineComponent({
        name: "ElTooltipContent",
        inheritAttrs: false
      });
      const _sfc_main$r = /* @__PURE__ */ vue.defineComponent({
        ...__default__$i,
        props: useTooltipContentProps,
        setup(__props, { expose }) {
          const props = __props;
          const { selector } = usePopperContainerId();
          const ns = useNamespace("tooltip");
          const contentRef = vue.ref(null);
          let stopHandle;
          const {
            controlled,
            id,
            open,
            trigger,
            onClose,
            onOpen,
            onShow,
            onHide,
            onBeforeShow,
            onBeforeHide
          } = vue.inject(TOOLTIP_INJECTION_KEY, void 0);
          const transitionClass = vue.computed(() => {
            return props.transition || `${ns.namespace.value}-fade-in-linear`;
          });
          const persistentRef = vue.computed(() => {
            return props.persistent;
          });
          vue.onBeforeUnmount(() => {
            stopHandle == null ? void 0 : stopHandle();
          });
          const shouldRender = vue.computed(() => {
            return vue.unref(persistentRef) ? true : vue.unref(open);
          });
          const shouldShow = vue.computed(() => {
            return props.disabled ? false : vue.unref(open);
          });
          const appendTo = vue.computed(() => {
            return props.appendTo || selector.value;
          });
          const contentStyle = vue.computed(() => {
            var _a2;
            return (_a2 = props.style) != null ? _a2 : {};
          });
          const ariaHidden = vue.ref(true);
          const onTransitionLeave = () => {
            onHide();
            ariaHidden.value = true;
          };
          const stopWhenControlled = () => {
            if (vue.unref(controlled))
              return true;
          };
          const onContentEnter = composeEventHandlers(stopWhenControlled, () => {
            if (props.enterable && vue.unref(trigger) === "hover") {
              onOpen();
            }
          });
          const onContentLeave = composeEventHandlers(stopWhenControlled, () => {
            if (vue.unref(trigger) === "hover") {
              onClose();
            }
          });
          const onBeforeEnter = () => {
            var _a2, _b;
            (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
            onBeforeShow == null ? void 0 : onBeforeShow();
          };
          const onBeforeLeave = () => {
            onBeforeHide == null ? void 0 : onBeforeHide();
          };
          const onAfterShow = () => {
            onShow();
            stopHandle = onClickOutside(vue.computed(() => {
              var _a2;
              return (_a2 = contentRef.value) == null ? void 0 : _a2.popperContentRef;
            }), () => {
              if (vue.unref(controlled))
                return;
              const $trigger = vue.unref(trigger);
              if ($trigger !== "hover") {
                onClose();
              }
            });
          };
          const onBlur = () => {
            if (!props.virtualTriggering) {
              onClose();
            }
          };
          vue.watch(() => vue.unref(open), (val) => {
            if (!val) {
              stopHandle == null ? void 0 : stopHandle();
            } else {
              ariaHidden.value = false;
            }
          }, {
            flush: "post"
          });
          vue.watch(() => props.content, () => {
            var _a2, _b;
            (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
          });
          expose({
            contentRef
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.unref(ElTeleport), {
              disabled: !_ctx.teleported,
              to: vue.unref(appendTo)
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.Transition, {
                  name: vue.unref(transitionClass),
                  onAfterLeave: onTransitionLeave,
                  onBeforeEnter,
                  onAfterEnter: onAfterShow,
                  onBeforeLeave
                }, {
                  default: vue.withCtx(() => [
                    vue.unref(shouldRender) ? vue.withDirectives((vue.openBlock(), vue.createBlock(vue.unref(ElPopperContent), vue.mergeProps({
                      key: 0,
                      id: vue.unref(id),
                      ref_key: "contentRef",
                      ref: contentRef
                    }, _ctx.$attrs, {
                      "aria-label": _ctx.ariaLabel,
                      "aria-hidden": ariaHidden.value,
                      "boundaries-padding": _ctx.boundariesPadding,
                      "fallback-placements": _ctx.fallbackPlacements,
                      "gpu-acceleration": _ctx.gpuAcceleration,
                      offset: _ctx.offset,
                      placement: _ctx.placement,
                      "popper-options": _ctx.popperOptions,
                      strategy: _ctx.strategy,
                      effect: _ctx.effect,
                      enterable: _ctx.enterable,
                      pure: _ctx.pure,
                      "popper-class": _ctx.popperClass,
                      "popper-style": [_ctx.popperStyle, vue.unref(contentStyle)],
                      "reference-el": _ctx.referenceEl,
                      "trigger-target-el": _ctx.triggerTargetEl,
                      visible: vue.unref(shouldShow),
                      "z-index": _ctx.zIndex,
                      onMouseenter: vue.unref(onContentEnter),
                      onMouseleave: vue.unref(onContentLeave),
                      onBlur,
                      onClose: vue.unref(onClose)
                    }), {
                      default: vue.withCtx(() => [
                        vue.renderSlot(_ctx.$slots, "default")
                      ]),
                      _: 3
                    }, 16, ["id", "aria-label", "aria-hidden", "boundaries-padding", "fallback-placements", "gpu-acceleration", "offset", "placement", "popper-options", "strategy", "effect", "enterable", "pure", "popper-class", "popper-style", "reference-el", "trigger-target-el", "visible", "z-index", "onMouseenter", "onMouseleave", "onClose"])), [
                      [vue.vShow, vue.unref(shouldShow)]
                    ]) : vue.createCommentVNode("v-if", true)
                  ]),
                  _: 3
                }, 8, ["name"])
              ]),
              _: 3
            }, 8, ["disabled", "to"]);
          };
        }
      });
      var ElTooltipContent = /* @__PURE__ */ _export_sfc$1(_sfc_main$r, [["__file", "content.vue"]]);
      const __default__$h = vue.defineComponent({
        name: "ElTooltip"
      });
      const _sfc_main$q = /* @__PURE__ */ vue.defineComponent({
        ...__default__$h,
        props: useTooltipProps,
        emits: tooltipEmits,
        setup(__props, { expose, emit }) {
          const props = __props;
          usePopperContainer();
          const id = useId();
          const popperRef = vue.ref();
          const contentRef = vue.ref();
          const updatePopper = () => {
            var _a2;
            const popperComponent = vue.unref(popperRef);
            if (popperComponent) {
              (_a2 = popperComponent.popperInstanceRef) == null ? void 0 : _a2.update();
            }
          };
          const open = vue.ref(false);
          const toggleReason = vue.ref();
          const { show, hide, hasUpdateHandler } = useTooltipModelToggle({
            indicator: open,
            toggleReason
          });
          const { onOpen, onClose } = useDelayedToggle({
            showAfter: vue.toRef(props, "showAfter"),
            hideAfter: vue.toRef(props, "hideAfter"),
            autoClose: vue.toRef(props, "autoClose"),
            open: show,
            close: hide
          });
          const controlled = vue.computed(() => isBoolean(props.visible) && !hasUpdateHandler.value);
          vue.provide(TOOLTIP_INJECTION_KEY, {
            controlled,
            id,
            open: vue.readonly(open),
            trigger: vue.toRef(props, "trigger"),
            onOpen: (event) => {
              onOpen(event);
            },
            onClose: (event) => {
              onClose(event);
            },
            onToggle: (event) => {
              if (vue.unref(open)) {
                onClose(event);
              } else {
                onOpen(event);
              }
            },
            onShow: () => {
              emit("show", toggleReason.value);
            },
            onHide: () => {
              emit("hide", toggleReason.value);
            },
            onBeforeShow: () => {
              emit("before-show", toggleReason.value);
            },
            onBeforeHide: () => {
              emit("before-hide", toggleReason.value);
            },
            updatePopper
          });
          vue.watch(() => props.disabled, (disabled) => {
            if (disabled && open.value) {
              open.value = false;
            }
          });
          const isFocusInsideContent = (event) => {
            var _a2, _b;
            const popperContent = (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.contentRef) == null ? void 0 : _b.popperContentRef;
            const activeElement = (event == null ? void 0 : event.relatedTarget) || document.activeElement;
            return popperContent && popperContent.contains(activeElement);
          };
          vue.onDeactivated(() => open.value && hide());
          expose({
            popperRef,
            contentRef,
            isFocusInsideContent,
            updatePopper,
            onOpen,
            onClose,
            hide
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.unref(ElPopper), {
              ref_key: "popperRef",
              ref: popperRef,
              role: _ctx.role
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(ElTooltipTrigger, {
                  disabled: _ctx.disabled,
                  trigger: _ctx.trigger,
                  "trigger-keys": _ctx.triggerKeys,
                  "virtual-ref": _ctx.virtualRef,
                  "virtual-triggering": _ctx.virtualTriggering
                }, {
                  default: vue.withCtx(() => [
                    _ctx.$slots.default ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : vue.createCommentVNode("v-if", true)
                  ]),
                  _: 3
                }, 8, ["disabled", "trigger", "trigger-keys", "virtual-ref", "virtual-triggering"]),
                vue.createVNode(ElTooltipContent, {
                  ref_key: "contentRef",
                  ref: contentRef,
                  "aria-label": _ctx.ariaLabel,
                  "boundaries-padding": _ctx.boundariesPadding,
                  content: _ctx.content,
                  disabled: _ctx.disabled,
                  effect: _ctx.effect,
                  enterable: _ctx.enterable,
                  "fallback-placements": _ctx.fallbackPlacements,
                  "hide-after": _ctx.hideAfter,
                  "gpu-acceleration": _ctx.gpuAcceleration,
                  offset: _ctx.offset,
                  persistent: _ctx.persistent,
                  "popper-class": _ctx.popperClass,
                  "popper-style": _ctx.popperStyle,
                  placement: _ctx.placement,
                  "popper-options": _ctx.popperOptions,
                  pure: _ctx.pure,
                  "raw-content": _ctx.rawContent,
                  "reference-el": _ctx.referenceEl,
                  "trigger-target-el": _ctx.triggerTargetEl,
                  "show-after": _ctx.showAfter,
                  strategy: _ctx.strategy,
                  teleported: _ctx.teleported,
                  transition: _ctx.transition,
                  "virtual-triggering": _ctx.virtualTriggering,
                  "z-index": _ctx.zIndex,
                  "append-to": _ctx.appendTo
                }, {
                  default: vue.withCtx(() => [
                    vue.renderSlot(_ctx.$slots, "content", {}, () => [
                      _ctx.rawContent ? (vue.openBlock(), vue.createElementBlock("span", {
                        key: 0,
                        innerHTML: _ctx.content
                      }, null, 8, ["innerHTML"])) : (vue.openBlock(), vue.createElementBlock("span", { key: 1 }, vue.toDisplayString(_ctx.content), 1))
                    ]),
                    _ctx.showArrow ? (vue.openBlock(), vue.createBlock(vue.unref(ElPopperArrow), {
                      key: 0,
                      "arrow-offset": _ctx.arrowOffset
                    }, null, 8, ["arrow-offset"])) : vue.createCommentVNode("v-if", true)
                  ]),
                  _: 3
                }, 8, ["aria-label", "boundaries-padding", "content", "disabled", "effect", "enterable", "fallback-placements", "hide-after", "gpu-acceleration", "offset", "persistent", "popper-class", "popper-style", "placement", "popper-options", "pure", "raw-content", "reference-el", "trigger-target-el", "show-after", "strategy", "teleported", "transition", "virtual-triggering", "z-index", "append-to"])
              ]),
              _: 3
            }, 8, ["role"]);
          };
        }
      });
      var Tooltip = /* @__PURE__ */ _export_sfc$1(_sfc_main$q, [["__file", "tooltip.vue"]]);
      const ElTooltip = withInstall(Tooltip);
      const badgeProps = buildProps({
        value: {
          type: [String, Number],
          default: ""
        },
        max: {
          type: Number,
          default: 99
        },
        isDot: Boolean,
        hidden: Boolean,
        type: {
          type: String,
          values: ["primary", "success", "warning", "info", "danger"],
          default: "danger"
        },
        showZero: {
          type: Boolean,
          default: true
        },
        color: String,
        badgeStyle: {
          type: definePropType([String, Object, Array])
        },
        offset: {
          type: definePropType(Array),
          default: [0, 0]
        },
        badgeClass: {
          type: String
        }
      });
      const __default__$g = vue.defineComponent({
        name: "ElBadge"
      });
      const _sfc_main$p = /* @__PURE__ */ vue.defineComponent({
        ...__default__$g,
        props: badgeProps,
        setup(__props, { expose }) {
          const props = __props;
          const ns = useNamespace("badge");
          const content = vue.computed(() => {
            if (props.isDot)
              return "";
            if (isNumber(props.value) && isNumber(props.max)) {
              return props.max < props.value ? `${props.max}+` : `${props.value}`;
            }
            return `${props.value}`;
          });
          const style = vue.computed(() => {
            var _a2, _b, _c, _d, _e;
            return [
              {
                backgroundColor: props.color,
                marginRight: addUnit(-((_b = (_a2 = props.offset) == null ? void 0 : _a2[0]) != null ? _b : 0)),
                marginTop: addUnit((_d = (_c = props.offset) == null ? void 0 : _c[1]) != null ? _d : 0)
              },
              (_e = props.badgeStyle) != null ? _e : {}
            ];
          });
          expose({
            content
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              class: vue.normalizeClass(vue.unref(ns).b())
            }, [
              vue.renderSlot(_ctx.$slots, "default"),
              vue.createVNode(vue.Transition, {
                name: `${vue.unref(ns).namespace.value}-zoom-in-center`,
                persisted: ""
              }, {
                default: vue.withCtx(() => [
                  vue.withDirectives(vue.createElementVNode("sup", {
                    class: vue.normalizeClass([
                      vue.unref(ns).e("content"),
                      vue.unref(ns).em("content", _ctx.type),
                      vue.unref(ns).is("fixed", !!_ctx.$slots.default),
                      vue.unref(ns).is("dot", _ctx.isDot),
                      vue.unref(ns).is("hide-zero", !_ctx.showZero && props.value === 0),
                      _ctx.badgeClass
                    ]),
                    style: vue.normalizeStyle(vue.unref(style)),
                    textContent: vue.toDisplayString(vue.unref(content))
                  }, null, 14, ["textContent"]), [
                    [vue.vShow, !_ctx.hidden && (vue.unref(content) || _ctx.isDot)]
                  ])
                ]),
                _: 1
              }, 8, ["name"])
            ], 2);
          };
        }
      });
      var Badge = /* @__PURE__ */ _export_sfc$1(_sfc_main$p, [["__file", "badge.vue"]]);
      const ElBadge = withInstall(Badge);
      const buttonGroupContextKey = Symbol("buttonGroupContextKey");
      const useButton = (props, emit) => {
        useDeprecated({
          from: "type.text",
          replacement: "link",
          version: "3.0.0",
          scope: "props",
          ref: "https://element-plus.org/en-US/component/button.html#button-attributes"
        }, vue.computed(() => props.type === "text"));
        const buttonGroupContext = vue.inject(buttonGroupContextKey, void 0);
        const globalConfig2 = useGlobalConfig("button");
        const { form } = useFormItem();
        const _size = useFormSize(vue.computed(() => buttonGroupContext == null ? void 0 : buttonGroupContext.size));
        const _disabled = useFormDisabled();
        const _ref = vue.ref();
        const slots = vue.useSlots();
        const _type = vue.computed(() => props.type || (buttonGroupContext == null ? void 0 : buttonGroupContext.type) || "");
        const autoInsertSpace = vue.computed(() => {
          var _a2, _b, _c;
          return (_c = (_b = props.autoInsertSpace) != null ? _b : (_a2 = globalConfig2.value) == null ? void 0 : _a2.autoInsertSpace) != null ? _c : false;
        });
        const _props = vue.computed(() => {
          if (props.tag === "button") {
            return {
              ariaDisabled: _disabled.value || props.loading,
              disabled: _disabled.value || props.loading,
              autofocus: props.autofocus,
              type: props.nativeType
            };
          }
          return {};
        });
        const shouldAddSpace = vue.computed(() => {
          var _a2;
          const defaultSlot = (_a2 = slots.default) == null ? void 0 : _a2.call(slots);
          if (autoInsertSpace.value && (defaultSlot == null ? void 0 : defaultSlot.length) === 1) {
            const slot = defaultSlot[0];
            if ((slot == null ? void 0 : slot.type) === vue.Text) {
              const text = slot.children;
              return new RegExp("^\\p{Unified_Ideograph}{2}$", "u").test(text.trim());
            }
          }
          return false;
        });
        const handleClick = (evt) => {
          if (_disabled.value || props.loading) {
            evt.stopPropagation();
            return;
          }
          if (props.nativeType === "reset") {
            form == null ? void 0 : form.resetFields();
          }
          emit("click", evt);
        };
        return {
          _disabled,
          _size,
          _type,
          _ref,
          _props,
          shouldAddSpace,
          handleClick
        };
      };
      const buttonTypes = [
        "default",
        "primary",
        "success",
        "warning",
        "info",
        "danger",
        "text",
        ""
      ];
      const buttonNativeTypes = ["button", "submit", "reset"];
      const buttonProps = buildProps({
        size: useSizeProp,
        disabled: Boolean,
        type: {
          type: String,
          values: buttonTypes,
          default: ""
        },
        icon: {
          type: iconPropType
        },
        nativeType: {
          type: String,
          values: buttonNativeTypes,
          default: "button"
        },
        loading: Boolean,
        loadingIcon: {
          type: iconPropType,
          default: () => loading_default
        },
        plain: Boolean,
        text: Boolean,
        link: Boolean,
        bg: Boolean,
        autofocus: Boolean,
        round: Boolean,
        circle: Boolean,
        color: String,
        dark: Boolean,
        autoInsertSpace: {
          type: Boolean,
          default: void 0
        },
        tag: {
          type: definePropType([String, Object]),
          default: "button"
        }
      });
      const buttonEmits = {
        click: (evt) => evt instanceof MouseEvent
      };
      function bound01(n, max) {
        if (isOnePointZero(n)) {
          n = "100%";
        }
        var isPercent = isPercentage(n);
        n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
        if (isPercent) {
          n = parseInt(String(n * max), 10) / 100;
        }
        if (Math.abs(n - max) < 1e-6) {
          return 1;
        }
        if (max === 360) {
          n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
        } else {
          n = n % max / parseFloat(String(max));
        }
        return n;
      }
      function clamp01(val) {
        return Math.min(1, Math.max(0, val));
      }
      function isOnePointZero(n) {
        return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
      }
      function isPercentage(n) {
        return typeof n === "string" && n.indexOf("%") !== -1;
      }
      function boundAlpha(a) {
        a = parseFloat(a);
        if (isNaN(a) || a < 0 || a > 1) {
          a = 1;
        }
        return a;
      }
      function convertToPercentage(n) {
        if (n <= 1) {
          return "".concat(Number(n) * 100, "%");
        }
        return n;
      }
      function pad2(c) {
        return c.length === 1 ? "0" + c : String(c);
      }
      function rgbToRgb(r, g, b) {
        return {
          r: bound01(r, 255) * 255,
          g: bound01(g, 255) * 255,
          b: bound01(b, 255) * 255
        };
      }
      function rgbToHsl(r, g, b) {
        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h2 = 0;
        var s = 0;
        var l = (max + min) / 2;
        if (max === min) {
          s = 0;
          h2 = 0;
        } else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r:
              h2 = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h2 = (b - r) / d + 2;
              break;
            case b:
              h2 = (r - g) / d + 4;
              break;
          }
          h2 /= 6;
        }
        return { h: h2, s, l };
      }
      function hue2rgb(p, q2, t) {
        if (t < 0) {
          t += 1;
        }
        if (t > 1) {
          t -= 1;
        }
        if (t < 1 / 6) {
          return p + (q2 - p) * (6 * t);
        }
        if (t < 1 / 2) {
          return q2;
        }
        if (t < 2 / 3) {
          return p + (q2 - p) * (2 / 3 - t) * 6;
        }
        return p;
      }
      function hslToRgb(h2, s, l) {
        var r;
        var g;
        var b;
        h2 = bound01(h2, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);
        if (s === 0) {
          g = l;
          b = l;
          r = l;
        } else {
          var q2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q2;
          r = hue2rgb(p, q2, h2 + 1 / 3);
          g = hue2rgb(p, q2, h2);
          b = hue2rgb(p, q2, h2 - 1 / 3);
        }
        return { r: r * 255, g: g * 255, b: b * 255 };
      }
      function rgbToHsv(r, g, b) {
        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h2 = 0;
        var v = max;
        var d = max - min;
        var s = max === 0 ? 0 : d / max;
        if (max === min) {
          h2 = 0;
        } else {
          switch (max) {
            case r:
              h2 = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h2 = (b - r) / d + 2;
              break;
            case b:
              h2 = (r - g) / d + 4;
              break;
          }
          h2 /= 6;
        }
        return { h: h2, s, v };
      }
      function hsvToRgb(h2, s, v) {
        h2 = bound01(h2, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);
        var i = Math.floor(h2);
        var f = h2 - i;
        var p = v * (1 - s);
        var q2 = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        var mod = i % 6;
        var r = [v, q2, p, p, t, v][mod];
        var g = [t, v, v, q2, p, p][mod];
        var b = [p, p, t, v, v, q2][mod];
        return { r: r * 255, g: g * 255, b: b * 255 };
      }
      function rgbToHex(r, g, b, allow3Char) {
        var hex2 = [
          pad2(Math.round(r).toString(16)),
          pad2(Math.round(g).toString(16)),
          pad2(Math.round(b).toString(16))
        ];
        if (allow3Char && hex2[0].startsWith(hex2[0].charAt(1)) && hex2[1].startsWith(hex2[1].charAt(1)) && hex2[2].startsWith(hex2[2].charAt(1))) {
          return hex2[0].charAt(0) + hex2[1].charAt(0) + hex2[2].charAt(0);
        }
        return hex2.join("");
      }
      function rgbaToHex(r, g, b, a, allow4Char) {
        var hex2 = [
          pad2(Math.round(r).toString(16)),
          pad2(Math.round(g).toString(16)),
          pad2(Math.round(b).toString(16)),
          pad2(convertDecimalToHex(a))
        ];
        if (allow4Char && hex2[0].startsWith(hex2[0].charAt(1)) && hex2[1].startsWith(hex2[1].charAt(1)) && hex2[2].startsWith(hex2[2].charAt(1)) && hex2[3].startsWith(hex2[3].charAt(1))) {
          return hex2[0].charAt(0) + hex2[1].charAt(0) + hex2[2].charAt(0) + hex2[3].charAt(0);
        }
        return hex2.join("");
      }
      function convertDecimalToHex(d) {
        return Math.round(parseFloat(d) * 255).toString(16);
      }
      function convertHexToDecimal(h2) {
        return parseIntFromHex(h2) / 255;
      }
      function parseIntFromHex(val) {
        return parseInt(val, 16);
      }
      function numberInputToObject(color) {
        return {
          r: color >> 16,
          g: (color & 65280) >> 8,
          b: color & 255
        };
      }
      var names = {
        aliceblue: "#f0f8ff",
        antiquewhite: "#faebd7",
        aqua: "#00ffff",
        aquamarine: "#7fffd4",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        bisque: "#ffe4c4",
        black: "#000000",
        blanchedalmond: "#ffebcd",
        blue: "#0000ff",
        blueviolet: "#8a2be2",
        brown: "#a52a2a",
        burlywood: "#deb887",
        cadetblue: "#5f9ea0",
        chartreuse: "#7fff00",
        chocolate: "#d2691e",
        coral: "#ff7f50",
        cornflowerblue: "#6495ed",
        cornsilk: "#fff8dc",
        crimson: "#dc143c",
        cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgoldenrod: "#b8860b",
        darkgray: "#a9a9a9",
        darkgreen: "#006400",
        darkgrey: "#a9a9a9",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkseagreen: "#8fbc8f",
        darkslateblue: "#483d8b",
        darkslategray: "#2f4f4f",
        darkslategrey: "#2f4f4f",
        darkturquoise: "#00ced1",
        darkviolet: "#9400d3",
        deeppink: "#ff1493",
        deepskyblue: "#00bfff",
        dimgray: "#696969",
        dimgrey: "#696969",
        dodgerblue: "#1e90ff",
        firebrick: "#b22222",
        floralwhite: "#fffaf0",
        forestgreen: "#228b22",
        fuchsia: "#ff00ff",
        gainsboro: "#dcdcdc",
        ghostwhite: "#f8f8ff",
        goldenrod: "#daa520",
        gold: "#ffd700",
        gray: "#808080",
        green: "#008000",
        greenyellow: "#adff2f",
        grey: "#808080",
        honeydew: "#f0fff0",
        hotpink: "#ff69b4",
        indianred: "#cd5c5c",
        indigo: "#4b0082",
        ivory: "#fffff0",
        khaki: "#f0e68c",
        lavenderblush: "#fff0f5",
        lavender: "#e6e6fa",
        lawngreen: "#7cfc00",
        lemonchiffon: "#fffacd",
        lightblue: "#add8e6",
        lightcoral: "#f08080",
        lightcyan: "#e0ffff",
        lightgoldenrodyellow: "#fafad2",
        lightgray: "#d3d3d3",
        lightgreen: "#90ee90",
        lightgrey: "#d3d3d3",
        lightpink: "#ffb6c1",
        lightsalmon: "#ffa07a",
        lightseagreen: "#20b2aa",
        lightskyblue: "#87cefa",
        lightslategray: "#778899",
        lightslategrey: "#778899",
        lightsteelblue: "#b0c4de",
        lightyellow: "#ffffe0",
        lime: "#00ff00",
        limegreen: "#32cd32",
        linen: "#faf0e6",
        magenta: "#ff00ff",
        maroon: "#800000",
        mediumaquamarine: "#66cdaa",
        mediumblue: "#0000cd",
        mediumorchid: "#ba55d3",
        mediumpurple: "#9370db",
        mediumseagreen: "#3cb371",
        mediumslateblue: "#7b68ee",
        mediumspringgreen: "#00fa9a",
        mediumturquoise: "#48d1cc",
        mediumvioletred: "#c71585",
        midnightblue: "#191970",
        mintcream: "#f5fffa",
        mistyrose: "#ffe4e1",
        moccasin: "#ffe4b5",
        navajowhite: "#ffdead",
        navy: "#000080",
        oldlace: "#fdf5e6",
        olive: "#808000",
        olivedrab: "#6b8e23",
        orange: "#ffa500",
        orangered: "#ff4500",
        orchid: "#da70d6",
        palegoldenrod: "#eee8aa",
        palegreen: "#98fb98",
        paleturquoise: "#afeeee",
        palevioletred: "#db7093",
        papayawhip: "#ffefd5",
        peachpuff: "#ffdab9",
        peru: "#cd853f",
        pink: "#ffc0cb",
        plum: "#dda0dd",
        powderblue: "#b0e0e6",
        purple: "#800080",
        rebeccapurple: "#663399",
        red: "#ff0000",
        rosybrown: "#bc8f8f",
        royalblue: "#4169e1",
        saddlebrown: "#8b4513",
        salmon: "#fa8072",
        sandybrown: "#f4a460",
        seagreen: "#2e8b57",
        seashell: "#fff5ee",
        sienna: "#a0522d",
        silver: "#c0c0c0",
        skyblue: "#87ceeb",
        slateblue: "#6a5acd",
        slategray: "#708090",
        slategrey: "#708090",
        snow: "#fffafa",
        springgreen: "#00ff7f",
        steelblue: "#4682b4",
        tan: "#d2b48c",
        teal: "#008080",
        thistle: "#d8bfd8",
        tomato: "#ff6347",
        turquoise: "#40e0d0",
        violet: "#ee82ee",
        wheat: "#f5deb3",
        white: "#ffffff",
        whitesmoke: "#f5f5f5",
        yellow: "#ffff00",
        yellowgreen: "#9acd32"
      };
      function inputToRGB(color) {
        var rgb = { r: 0, g: 0, b: 0 };
        var a = 1;
        var s = null;
        var v = null;
        var l = null;
        var ok = false;
        var format2 = false;
        if (typeof color === "string") {
          color = stringInputToObject(color);
        }
        if (typeof color === "object") {
          if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format2 = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
          } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format2 = "hsv";
          } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format2 = "hsl";
          }
          if (Object.prototype.hasOwnProperty.call(color, "a")) {
            a = color.a;
          }
        }
        a = boundAlpha(a);
        return {
          ok,
          format: color.format || format2,
          r: Math.min(255, Math.max(rgb.r, 0)),
          g: Math.min(255, Math.max(rgb.g, 0)),
          b: Math.min(255, Math.max(rgb.b, 0)),
          a
        };
      }
      var CSS_INTEGER = "[-\\+]?\\d+%?";
      var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
      var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
      var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
      var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
      var matchers = {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
      };
      function stringInputToObject(color) {
        color = color.trim().toLowerCase();
        if (color.length === 0) {
          return false;
        }
        var named = false;
        if (names[color]) {
          color = names[color];
          named = true;
        } else if (color === "transparent") {
          return { r: 0, g: 0, b: 0, a: 0, format: "name" };
        }
        var match = matchers.rgb.exec(color);
        if (match) {
          return { r: match[1], g: match[2], b: match[3] };
        }
        match = matchers.rgba.exec(color);
        if (match) {
          return { r: match[1], g: match[2], b: match[3], a: match[4] };
        }
        match = matchers.hsl.exec(color);
        if (match) {
          return { h: match[1], s: match[2], l: match[3] };
        }
        match = matchers.hsla.exec(color);
        if (match) {
          return { h: match[1], s: match[2], l: match[3], a: match[4] };
        }
        match = matchers.hsv.exec(color);
        if (match) {
          return { h: match[1], s: match[2], v: match[3] };
        }
        match = matchers.hsva.exec(color);
        if (match) {
          return { h: match[1], s: match[2], v: match[3], a: match[4] };
        }
        match = matchers.hex8.exec(color);
        if (match) {
          return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
          };
        }
        match = matchers.hex6.exec(color);
        if (match) {
          return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
          };
        }
        match = matchers.hex4.exec(color);
        if (match) {
          return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            a: convertHexToDecimal(match[4] + match[4]),
            format: named ? "name" : "hex8"
          };
        }
        match = matchers.hex3.exec(color);
        if (match) {
          return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            format: named ? "name" : "hex"
          };
        }
        return false;
      }
      function isValidCSSUnit(color) {
        return Boolean(matchers.CSS_UNIT.exec(String(color)));
      }
      var TinyColor = (
        /** @class */
        function() {
          function TinyColor2(color, opts) {
            if (color === void 0) {
              color = "";
            }
            if (opts === void 0) {
              opts = {};
            }
            var _a2;
            if (color instanceof TinyColor2) {
              return color;
            }
            if (typeof color === "number") {
              color = numberInputToObject(color);
            }
            this.originalInput = color;
            var rgb = inputToRGB(color);
            this.originalInput = color;
            this.r = rgb.r;
            this.g = rgb.g;
            this.b = rgb.b;
            this.a = rgb.a;
            this.roundA = Math.round(100 * this.a) / 100;
            this.format = (_a2 = opts.format) !== null && _a2 !== void 0 ? _a2 : rgb.format;
            this.gradientType = opts.gradientType;
            if (this.r < 1) {
              this.r = Math.round(this.r);
            }
            if (this.g < 1) {
              this.g = Math.round(this.g);
            }
            if (this.b < 1) {
              this.b = Math.round(this.b);
            }
            this.isValid = rgb.ok;
          }
          TinyColor2.prototype.isDark = function() {
            return this.getBrightness() < 128;
          };
          TinyColor2.prototype.isLight = function() {
            return !this.isDark();
          };
          TinyColor2.prototype.getBrightness = function() {
            var rgb = this.toRgb();
            return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
          };
          TinyColor2.prototype.getLuminance = function() {
            var rgb = this.toRgb();
            var R2;
            var G2;
            var B2;
            var RsRGB = rgb.r / 255;
            var GsRGB = rgb.g / 255;
            var BsRGB = rgb.b / 255;
            if (RsRGB <= 0.03928) {
              R2 = RsRGB / 12.92;
            } else {
              R2 = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
            }
            if (GsRGB <= 0.03928) {
              G2 = GsRGB / 12.92;
            } else {
              G2 = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
            }
            if (BsRGB <= 0.03928) {
              B2 = BsRGB / 12.92;
            } else {
              B2 = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
            }
            return 0.2126 * R2 + 0.7152 * G2 + 0.0722 * B2;
          };
          TinyColor2.prototype.getAlpha = function() {
            return this.a;
          };
          TinyColor2.prototype.setAlpha = function(alpha) {
            this.a = boundAlpha(alpha);
            this.roundA = Math.round(100 * this.a) / 100;
            return this;
          };
          TinyColor2.prototype.isMonochrome = function() {
            var s = this.toHsl().s;
            return s === 0;
          };
          TinyColor2.prototype.toHsv = function() {
            var hsv = rgbToHsv(this.r, this.g, this.b);
            return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
          };
          TinyColor2.prototype.toHsvString = function() {
            var hsv = rgbToHsv(this.r, this.g, this.b);
            var h2 = Math.round(hsv.h * 360);
            var s = Math.round(hsv.s * 100);
            var v = Math.round(hsv.v * 100);
            return this.a === 1 ? "hsv(".concat(h2, ", ").concat(s, "%, ").concat(v, "%)") : "hsva(".concat(h2, ", ").concat(s, "%, ").concat(v, "%, ").concat(this.roundA, ")");
          };
          TinyColor2.prototype.toHsl = function() {
            var hsl = rgbToHsl(this.r, this.g, this.b);
            return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
          };
          TinyColor2.prototype.toHslString = function() {
            var hsl = rgbToHsl(this.r, this.g, this.b);
            var h2 = Math.round(hsl.h * 360);
            var s = Math.round(hsl.s * 100);
            var l = Math.round(hsl.l * 100);
            return this.a === 1 ? "hsl(".concat(h2, ", ").concat(s, "%, ").concat(l, "%)") : "hsla(".concat(h2, ", ").concat(s, "%, ").concat(l, "%, ").concat(this.roundA, ")");
          };
          TinyColor2.prototype.toHex = function(allow3Char) {
            if (allow3Char === void 0) {
              allow3Char = false;
            }
            return rgbToHex(this.r, this.g, this.b, allow3Char);
          };
          TinyColor2.prototype.toHexString = function(allow3Char) {
            if (allow3Char === void 0) {
              allow3Char = false;
            }
            return "#" + this.toHex(allow3Char);
          };
          TinyColor2.prototype.toHex8 = function(allow4Char) {
            if (allow4Char === void 0) {
              allow4Char = false;
            }
            return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
          };
          TinyColor2.prototype.toHex8String = function(allow4Char) {
            if (allow4Char === void 0) {
              allow4Char = false;
            }
            return "#" + this.toHex8(allow4Char);
          };
          TinyColor2.prototype.toHexShortString = function(allowShortChar) {
            if (allowShortChar === void 0) {
              allowShortChar = false;
            }
            return this.a === 1 ? this.toHexString(allowShortChar) : this.toHex8String(allowShortChar);
          };
          TinyColor2.prototype.toRgb = function() {
            return {
              r: Math.round(this.r),
              g: Math.round(this.g),
              b: Math.round(this.b),
              a: this.a
            };
          };
          TinyColor2.prototype.toRgbString = function() {
            var r = Math.round(this.r);
            var g = Math.round(this.g);
            var b = Math.round(this.b);
            return this.a === 1 ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")") : "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(this.roundA, ")");
          };
          TinyColor2.prototype.toPercentageRgb = function() {
            var fmt = function(x) {
              return "".concat(Math.round(bound01(x, 255) * 100), "%");
            };
            return {
              r: fmt(this.r),
              g: fmt(this.g),
              b: fmt(this.b),
              a: this.a
            };
          };
          TinyColor2.prototype.toPercentageRgbString = function() {
            var rnd = function(x) {
              return Math.round(bound01(x, 255) * 100);
            };
            return this.a === 1 ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)") : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
          };
          TinyColor2.prototype.toName = function() {
            if (this.a === 0) {
              return "transparent";
            }
            if (this.a < 1) {
              return false;
            }
            var hex2 = "#" + rgbToHex(this.r, this.g, this.b, false);
            for (var _i = 0, _a2 = Object.entries(names); _i < _a2.length; _i++) {
              var _b = _a2[_i], key = _b[0], value = _b[1];
              if (hex2 === value) {
                return key;
              }
            }
            return false;
          };
          TinyColor2.prototype.toString = function(format2) {
            var formatSet = Boolean(format2);
            format2 = format2 !== null && format2 !== void 0 ? format2 : this.format;
            var formattedString = false;
            var hasAlpha = this.a < 1 && this.a >= 0;
            var needsAlphaFormat = !formatSet && hasAlpha && (format2.startsWith("hex") || format2 === "name");
            if (needsAlphaFormat) {
              if (format2 === "name" && this.a === 0) {
                return this.toName();
              }
              return this.toRgbString();
            }
            if (format2 === "rgb") {
              formattedString = this.toRgbString();
            }
            if (format2 === "prgb") {
              formattedString = this.toPercentageRgbString();
            }
            if (format2 === "hex" || format2 === "hex6") {
              formattedString = this.toHexString();
            }
            if (format2 === "hex3") {
              formattedString = this.toHexString(true);
            }
            if (format2 === "hex4") {
              formattedString = this.toHex8String(true);
            }
            if (format2 === "hex8") {
              formattedString = this.toHex8String();
            }
            if (format2 === "name") {
              formattedString = this.toName();
            }
            if (format2 === "hsl") {
              formattedString = this.toHslString();
            }
            if (format2 === "hsv") {
              formattedString = this.toHsvString();
            }
            return formattedString || this.toHexString();
          };
          TinyColor2.prototype.toNumber = function() {
            return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
          };
          TinyColor2.prototype.clone = function() {
            return new TinyColor2(this.toString());
          };
          TinyColor2.prototype.lighten = function(amount) {
            if (amount === void 0) {
              amount = 10;
            }
            var hsl = this.toHsl();
            hsl.l += amount / 100;
            hsl.l = clamp01(hsl.l);
            return new TinyColor2(hsl);
          };
          TinyColor2.prototype.brighten = function(amount) {
            if (amount === void 0) {
              amount = 10;
            }
            var rgb = this.toRgb();
            rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
            rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
            rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
            return new TinyColor2(rgb);
          };
          TinyColor2.prototype.darken = function(amount) {
            if (amount === void 0) {
              amount = 10;
            }
            var hsl = this.toHsl();
            hsl.l -= amount / 100;
            hsl.l = clamp01(hsl.l);
            return new TinyColor2(hsl);
          };
          TinyColor2.prototype.tint = function(amount) {
            if (amount === void 0) {
              amount = 10;
            }
            return this.mix("white", amount);
          };
          TinyColor2.prototype.shade = function(amount) {
            if (amount === void 0) {
              amount = 10;
            }
            return this.mix("black", amount);
          };
          TinyColor2.prototype.desaturate = function(amount) {
            if (amount === void 0) {
              amount = 10;
            }
            var hsl = this.toHsl();
            hsl.s -= amount / 100;
            hsl.s = clamp01(hsl.s);
            return new TinyColor2(hsl);
          };
          TinyColor2.prototype.saturate = function(amount) {
            if (amount === void 0) {
              amount = 10;
            }
            var hsl = this.toHsl();
            hsl.s += amount / 100;
            hsl.s = clamp01(hsl.s);
            return new TinyColor2(hsl);
          };
          TinyColor2.prototype.greyscale = function() {
            return this.desaturate(100);
          };
          TinyColor2.prototype.spin = function(amount) {
            var hsl = this.toHsl();
            var hue = (hsl.h + amount) % 360;
            hsl.h = hue < 0 ? 360 + hue : hue;
            return new TinyColor2(hsl);
          };
          TinyColor2.prototype.mix = function(color, amount) {
            if (amount === void 0) {
              amount = 50;
            }
            var rgb1 = this.toRgb();
            var rgb2 = new TinyColor2(color).toRgb();
            var p = amount / 100;
            var rgba = {
              r: (rgb2.r - rgb1.r) * p + rgb1.r,
              g: (rgb2.g - rgb1.g) * p + rgb1.g,
              b: (rgb2.b - rgb1.b) * p + rgb1.b,
              a: (rgb2.a - rgb1.a) * p + rgb1.a
            };
            return new TinyColor2(rgba);
          };
          TinyColor2.prototype.analogous = function(results, slices) {
            if (results === void 0) {
              results = 6;
            }
            if (slices === void 0) {
              slices = 30;
            }
            var hsl = this.toHsl();
            var part = 360 / slices;
            var ret = [this];
            for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
              hsl.h = (hsl.h + part) % 360;
              ret.push(new TinyColor2(hsl));
            }
            return ret;
          };
          TinyColor2.prototype.complement = function() {
            var hsl = this.toHsl();
            hsl.h = (hsl.h + 180) % 360;
            return new TinyColor2(hsl);
          };
          TinyColor2.prototype.monochromatic = function(results) {
            if (results === void 0) {
              results = 6;
            }
            var hsv = this.toHsv();
            var h2 = hsv.h;
            var s = hsv.s;
            var v = hsv.v;
            var res = [];
            var modification = 1 / results;
            while (results--) {
              res.push(new TinyColor2({ h: h2, s, v }));
              v = (v + modification) % 1;
            }
            return res;
          };
          TinyColor2.prototype.splitcomplement = function() {
            var hsl = this.toHsl();
            var h2 = hsl.h;
            return [
              this,
              new TinyColor2({ h: (h2 + 72) % 360, s: hsl.s, l: hsl.l }),
              new TinyColor2({ h: (h2 + 216) % 360, s: hsl.s, l: hsl.l })
            ];
          };
          TinyColor2.prototype.onBackground = function(background) {
            var fg = this.toRgb();
            var bg = new TinyColor2(background).toRgb();
            var alpha = fg.a + bg.a * (1 - fg.a);
            return new TinyColor2({
              r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
              g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
              b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
              a: alpha
            });
          };
          TinyColor2.prototype.triad = function() {
            return this.polyad(3);
          };
          TinyColor2.prototype.tetrad = function() {
            return this.polyad(4);
          };
          TinyColor2.prototype.polyad = function(n) {
            var hsl = this.toHsl();
            var h2 = hsl.h;
            var result = [this];
            var increment = 360 / n;
            for (var i = 1; i < n; i++) {
              result.push(new TinyColor2({ h: (h2 + i * increment) % 360, s: hsl.s, l: hsl.l }));
            }
            return result;
          };
          TinyColor2.prototype.equals = function(color) {
            return this.toRgbString() === new TinyColor2(color).toRgbString();
          };
          return TinyColor2;
        }()
      );
      function darken(color, amount = 20) {
        return color.mix("#141414", amount).toString();
      }
      function useButtonCustomStyle(props) {
        const _disabled = useFormDisabled();
        const ns = useNamespace("button");
        return vue.computed(() => {
          let styles = {};
          let buttonColor = props.color;
          if (buttonColor) {
            const match = buttonColor.match(/var\((.*?)\)/);
            if (match) {
              buttonColor = window.getComputedStyle(window.document.documentElement).getPropertyValue(match[1]);
            }
            const color = new TinyColor(buttonColor);
            const activeBgColor = props.dark ? color.tint(20).toString() : darken(color, 20);
            if (props.plain) {
              styles = ns.cssVarBlock({
                "bg-color": props.dark ? darken(color, 90) : color.tint(90).toString(),
                "text-color": buttonColor,
                "border-color": props.dark ? darken(color, 50) : color.tint(50).toString(),
                "hover-text-color": `var(${ns.cssVarName("color-white")})`,
                "hover-bg-color": buttonColor,
                "hover-border-color": buttonColor,
                "active-bg-color": activeBgColor,
                "active-text-color": `var(${ns.cssVarName("color-white")})`,
                "active-border-color": activeBgColor
              });
              if (_disabled.value) {
                styles[ns.cssVarBlockName("disabled-bg-color")] = props.dark ? darken(color, 90) : color.tint(90).toString();
                styles[ns.cssVarBlockName("disabled-text-color")] = props.dark ? darken(color, 50) : color.tint(50).toString();
                styles[ns.cssVarBlockName("disabled-border-color")] = props.dark ? darken(color, 80) : color.tint(80).toString();
              }
            } else {
              const hoverBgColor = props.dark ? darken(color, 30) : color.tint(30).toString();
              const textColor = color.isDark() ? `var(${ns.cssVarName("color-white")})` : `var(${ns.cssVarName("color-black")})`;
              styles = ns.cssVarBlock({
                "bg-color": buttonColor,
                "text-color": textColor,
                "border-color": buttonColor,
                "hover-bg-color": hoverBgColor,
                "hover-text-color": textColor,
                "hover-border-color": hoverBgColor,
                "active-bg-color": activeBgColor,
                "active-border-color": activeBgColor
              });
              if (_disabled.value) {
                const disabledButtonColor = props.dark ? darken(color, 50) : color.tint(50).toString();
                styles[ns.cssVarBlockName("disabled-bg-color")] = disabledButtonColor;
                styles[ns.cssVarBlockName("disabled-text-color")] = props.dark ? "rgba(255, 255, 255, 0.5)" : `var(${ns.cssVarName("color-white")})`;
                styles[ns.cssVarBlockName("disabled-border-color")] = disabledButtonColor;
              }
            }
          }
          return styles;
        });
      }
      const __default__$f = vue.defineComponent({
        name: "ElButton"
      });
      const _sfc_main$o = /* @__PURE__ */ vue.defineComponent({
        ...__default__$f,
        props: buttonProps,
        emits: buttonEmits,
        setup(__props, { expose, emit }) {
          const props = __props;
          const buttonStyle = useButtonCustomStyle(props);
          const ns = useNamespace("button");
          const { _ref, _size, _type, _disabled, _props, shouldAddSpace, handleClick } = useButton(props, emit);
          const buttonKls = vue.computed(() => [
            ns.b(),
            ns.m(_type.value),
            ns.m(_size.value),
            ns.is("disabled", _disabled.value),
            ns.is("loading", props.loading),
            ns.is("plain", props.plain),
            ns.is("round", props.round),
            ns.is("circle", props.circle),
            ns.is("text", props.text),
            ns.is("link", props.link),
            ns.is("has-bg", props.bg)
          ]);
          expose({
            ref: _ref,
            size: _size,
            type: _type,
            disabled: _disabled,
            shouldAddSpace
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), vue.mergeProps({
              ref_key: "_ref",
              ref: _ref
            }, vue.unref(_props), {
              class: vue.unref(buttonKls),
              style: vue.unref(buttonStyle),
              onClick: vue.unref(handleClick)
            }), {
              default: vue.withCtx(() => [
                _ctx.loading ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                  _ctx.$slots.loading ? vue.renderSlot(_ctx.$slots, "loading", { key: 0 }) : (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 1,
                    class: vue.normalizeClass(vue.unref(ns).is("loading"))
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.loadingIcon)))
                    ]),
                    _: 1
                  }, 8, ["class"]))
                ], 64)) : _ctx.icon || _ctx.$slots.icon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 1 }, {
                  default: vue.withCtx(() => [
                    _ctx.icon ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.icon), { key: 0 })) : vue.renderSlot(_ctx.$slots, "icon", { key: 1 })
                  ]),
                  _: 3
                })) : vue.createCommentVNode("v-if", true),
                _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 2,
                  class: vue.normalizeClass({ [vue.unref(ns).em("text", "expand")]: vue.unref(shouldAddSpace) })
                }, [
                  vue.renderSlot(_ctx.$slots, "default")
                ], 2)) : vue.createCommentVNode("v-if", true)
              ]),
              _: 3
            }, 16, ["class", "style", "onClick"]);
          };
        }
      });
      var Button = /* @__PURE__ */ _export_sfc$1(_sfc_main$o, [["__file", "button.vue"]]);
      const buttonGroupProps = {
        size: buttonProps.size,
        type: buttonProps.type
      };
      const __default__$e = vue.defineComponent({
        name: "ElButtonGroup"
      });
      const _sfc_main$n = /* @__PURE__ */ vue.defineComponent({
        ...__default__$e,
        props: buttonGroupProps,
        setup(__props) {
          const props = __props;
          vue.provide(buttonGroupContextKey, vue.reactive({
            size: vue.toRef(props, "size"),
            type: vue.toRef(props, "type")
          }));
          const ns = useNamespace("button");
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              class: vue.normalizeClass(vue.unref(ns).b("group"))
            }, [
              vue.renderSlot(_ctx.$slots, "default")
            ], 2);
          };
        }
      });
      var ButtonGroup = /* @__PURE__ */ _export_sfc$1(_sfc_main$n, [["__file", "button-group.vue"]]);
      const ElButton = withInstall(Button, {
        ButtonGroup
      });
      withNoopInstall(ButtonGroup);
      var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
      function getDefaultExportFromCjs(x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
      }
      const nodeList = /* @__PURE__ */ new Map();
      if (isClient) {
        let startClick;
        document.addEventListener("mousedown", (e) => startClick = e);
        document.addEventListener("mouseup", (e) => {
          if (startClick) {
            for (const handlers of nodeList.values()) {
              for (const { documentHandler } of handlers) {
                documentHandler(e, startClick);
              }
            }
            startClick = void 0;
          }
        });
      }
      function createDocumentHandler(el, binding) {
        let excludes = [];
        if (isArray$1(binding.arg)) {
          excludes = binding.arg;
        } else if (isElement(binding.arg)) {
          excludes.push(binding.arg);
        }
        return function(mouseup, mousedown) {
          const popperRef = binding.instance.popperRef;
          const mouseUpTarget = mouseup.target;
          const mouseDownTarget = mousedown == null ? void 0 : mousedown.target;
          const isBound = !binding || !binding.instance;
          const isTargetExists = !mouseUpTarget || !mouseDownTarget;
          const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget);
          const isSelf = el === mouseUpTarget;
          const isTargetExcluded = excludes.length && excludes.some((item) => item == null ? void 0 : item.contains(mouseUpTarget)) || excludes.length && excludes.includes(mouseDownTarget);
          const isContainedByPopper = popperRef && (popperRef.contains(mouseUpTarget) || popperRef.contains(mouseDownTarget));
          if (isBound || isTargetExists || isContainedByEl || isSelf || isTargetExcluded || isContainedByPopper) {
            return;
          }
          binding.value(mouseup, mousedown);
        };
      }
      const ClickOutside = {
        beforeMount(el, binding) {
          if (!nodeList.has(el)) {
            nodeList.set(el, []);
          }
          nodeList.get(el).push({
            documentHandler: createDocumentHandler(el, binding),
            bindingFn: binding.value
          });
        },
        updated(el, binding) {
          if (!nodeList.has(el)) {
            nodeList.set(el, []);
          }
          const handlers = nodeList.get(el);
          const oldHandlerIndex = handlers.findIndex((item) => item.bindingFn === binding.oldValue);
          const newHandler = {
            documentHandler: createDocumentHandler(el, binding),
            bindingFn: binding.value
          };
          if (oldHandlerIndex >= 0) {
            handlers.splice(oldHandlerIndex, 1, newHandler);
          } else {
            handlers.push(newHandler);
          }
        },
        unmounted(el) {
          nodeList.delete(el);
        }
      };
      const REPEAT_INTERVAL = 100;
      const REPEAT_DELAY = 600;
      const vRepeatClick = {
        beforeMount(el, binding) {
          const value = binding.value;
          const { interval = REPEAT_INTERVAL, delay = REPEAT_DELAY } = isFunction$1(value) ? {} : value;
          let intervalId;
          let delayId;
          const handler = () => isFunction$1(value) ? value() : value.handler();
          const clear = () => {
            if (delayId) {
              clearTimeout(delayId);
              delayId = void 0;
            }
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = void 0;
            }
          };
          el.addEventListener("mousedown", (evt) => {
            if (evt.button !== 0)
              return;
            clear();
            handler();
            document.addEventListener("mouseup", () => clear(), {
              once: true
            });
            delayId = setTimeout(() => {
              intervalId = setInterval(() => {
                handler();
              }, interval);
            }, delay);
          });
        }
      };
      const checkboxProps = {
        modelValue: {
          type: [Number, String, Boolean],
          default: void 0
        },
        label: {
          type: [String, Boolean, Number, Object],
          default: void 0
        },
        value: {
          type: [String, Boolean, Number, Object],
          default: void 0
        },
        indeterminate: Boolean,
        disabled: Boolean,
        checked: Boolean,
        name: {
          type: String,
          default: void 0
        },
        trueValue: {
          type: [String, Number],
          default: void 0
        },
        falseValue: {
          type: [String, Number],
          default: void 0
        },
        trueLabel: {
          type: [String, Number],
          default: void 0
        },
        falseLabel: {
          type: [String, Number],
          default: void 0
        },
        id: {
          type: String,
          default: void 0
        },
        border: Boolean,
        size: useSizeProp,
        tabindex: [String, Number],
        validateEvent: {
          type: Boolean,
          default: true
        },
        ...useAriaProps(["ariaControls"])
      };
      const checkboxEmits = {
        [UPDATE_MODEL_EVENT]: (val) => isString(val) || isNumber(val) || isBoolean(val),
        change: (val) => isString(val) || isNumber(val) || isBoolean(val)
      };
      const checkboxGroupContextKey = Symbol("checkboxGroupContextKey");
      const useCheckboxDisabled = ({
        model,
        isChecked
      }) => {
        const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
        const isLimitDisabled = vue.computed(() => {
          var _a2, _b;
          const max = (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.max) == null ? void 0 : _a2.value;
          const min = (_b = checkboxGroup == null ? void 0 : checkboxGroup.min) == null ? void 0 : _b.value;
          return !isUndefined(max) && model.value.length >= max && !isChecked.value || !isUndefined(min) && model.value.length <= min && isChecked.value;
        });
        const isDisabled = useFormDisabled(vue.computed(() => (checkboxGroup == null ? void 0 : checkboxGroup.disabled.value) || isLimitDisabled.value));
        return {
          isDisabled,
          isLimitDisabled
        };
      };
      const useCheckboxEvent = (props, {
        model,
        isLimitExceeded,
        hasOwnLabel,
        isDisabled,
        isLabeledByFormItem
      }) => {
        const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
        const { formItem } = useFormItem();
        const { emit } = vue.getCurrentInstance();
        function getLabeledValue(value) {
          var _a2, _b, _c, _d;
          return [true, props.trueValue, props.trueLabel].includes(value) ? (_b = (_a2 = props.trueValue) != null ? _a2 : props.trueLabel) != null ? _b : true : (_d = (_c = props.falseValue) != null ? _c : props.falseLabel) != null ? _d : false;
        }
        function emitChangeEvent(checked, e) {
          emit("change", getLabeledValue(checked), e);
        }
        function handleChange(e) {
          if (isLimitExceeded.value)
            return;
          const target = e.target;
          emit("change", getLabeledValue(target.checked), e);
        }
        async function onClickRoot(e) {
          if (isLimitExceeded.value)
            return;
          if (!hasOwnLabel.value && !isDisabled.value && isLabeledByFormItem.value) {
            const eventTargets = e.composedPath();
            const hasLabel = eventTargets.some((item) => item.tagName === "LABEL");
            if (!hasLabel) {
              model.value = getLabeledValue([false, props.falseValue, props.falseLabel].includes(model.value));
              await vue.nextTick();
              emitChangeEvent(model.value, e);
            }
          }
        }
        const validateEvent = vue.computed(() => (checkboxGroup == null ? void 0 : checkboxGroup.validateEvent) || props.validateEvent);
        vue.watch(() => props.modelValue, () => {
          if (validateEvent.value) {
            formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn());
          }
        });
        return {
          handleChange,
          onClickRoot
        };
      };
      const useCheckboxModel = (props) => {
        const selfModel = vue.ref(false);
        const { emit } = vue.getCurrentInstance();
        const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
        const isGroup = vue.computed(() => isUndefined(checkboxGroup) === false);
        const isLimitExceeded = vue.ref(false);
        const model = vue.computed({
          get() {
            var _a2, _b;
            return isGroup.value ? (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.modelValue) == null ? void 0 : _a2.value : (_b = props.modelValue) != null ? _b : selfModel.value;
          },
          set(val) {
            var _a2, _b;
            if (isGroup.value && isArray$1(val)) {
              isLimitExceeded.value = ((_a2 = checkboxGroup == null ? void 0 : checkboxGroup.max) == null ? void 0 : _a2.value) !== void 0 && val.length > (checkboxGroup == null ? void 0 : checkboxGroup.max.value) && val.length > model.value.length;
              isLimitExceeded.value === false && ((_b = checkboxGroup == null ? void 0 : checkboxGroup.changeEvent) == null ? void 0 : _b.call(checkboxGroup, val));
            } else {
              emit(UPDATE_MODEL_EVENT, val);
              selfModel.value = val;
            }
          }
        });
        return {
          model,
          isGroup,
          isLimitExceeded
        };
      };
      const useCheckboxStatus = (props, slots, { model }) => {
        const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
        const isFocused = vue.ref(false);
        const actualValue = vue.computed(() => {
          if (!isPropAbsent(props.value)) {
            return props.value;
          }
          return props.label;
        });
        const isChecked = vue.computed(() => {
          const value = model.value;
          if (isBoolean(value)) {
            return value;
          } else if (isArray$1(value)) {
            if (isObject$1(actualValue.value)) {
              return value.map(vue.toRaw).some((o) => isEqual(o, actualValue.value));
            } else {
              return value.map(vue.toRaw).includes(actualValue.value);
            }
          } else if (value !== null && value !== void 0) {
            return value === props.trueValue || value === props.trueLabel;
          } else {
            return !!value;
          }
        });
        const checkboxButtonSize = useFormSize(vue.computed(() => {
          var _a2;
          return (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.size) == null ? void 0 : _a2.value;
        }), {
          prop: true
        });
        const checkboxSize = useFormSize(vue.computed(() => {
          var _a2;
          return (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.size) == null ? void 0 : _a2.value;
        }));
        const hasOwnLabel = vue.computed(() => {
          return !!slots.default || !isPropAbsent(actualValue.value);
        });
        return {
          checkboxButtonSize,
          isChecked,
          isFocused,
          checkboxSize,
          hasOwnLabel,
          actualValue
        };
      };
      const useCheckbox = (props, slots) => {
        const { formItem: elFormItem } = useFormItem();
        const { model, isGroup, isLimitExceeded } = useCheckboxModel(props);
        const {
          isFocused,
          isChecked,
          checkboxButtonSize,
          checkboxSize,
          hasOwnLabel,
          actualValue
        } = useCheckboxStatus(props, slots, { model });
        const { isDisabled } = useCheckboxDisabled({ model, isChecked });
        const { inputId, isLabeledByFormItem } = useFormItemInputId(props, {
          formItemContext: elFormItem,
          disableIdGeneration: hasOwnLabel,
          disableIdManagement: isGroup
        });
        const { handleChange, onClickRoot } = useCheckboxEvent(props, {
          model,
          isLimitExceeded,
          hasOwnLabel,
          isDisabled,
          isLabeledByFormItem
        });
        const setStoreValue = () => {
          function addToStore() {
            var _a2, _b;
            if (isArray$1(model.value) && !model.value.includes(actualValue.value)) {
              model.value.push(actualValue.value);
            } else {
              model.value = (_b = (_a2 = props.trueValue) != null ? _a2 : props.trueLabel) != null ? _b : true;
            }
          }
          props.checked && addToStore();
        };
        setStoreValue();
        useDeprecated({
          from: "label act as value",
          replacement: "value",
          version: "3.0.0",
          scope: "el-checkbox",
          ref: "https://element-plus.org/en-US/component/checkbox.html"
        }, vue.computed(() => isGroup.value && isPropAbsent(props.value)));
        useDeprecated({
          from: "true-label",
          replacement: "true-value",
          version: "3.0.0",
          scope: "el-checkbox",
          ref: "https://element-plus.org/en-US/component/checkbox.html"
        }, vue.computed(() => !!props.trueLabel));
        useDeprecated({
          from: "false-label",
          replacement: "false-value",
          version: "3.0.0",
          scope: "el-checkbox",
          ref: "https://element-plus.org/en-US/component/checkbox.html"
        }, vue.computed(() => !!props.falseLabel));
        return {
          inputId,
          isLabeledByFormItem,
          isChecked,
          isDisabled,
          isFocused,
          checkboxButtonSize,
          checkboxSize,
          hasOwnLabel,
          model,
          actualValue,
          handleChange,
          onClickRoot
        };
      };
      const __default__$d = vue.defineComponent({
        name: "ElCheckbox"
      });
      const _sfc_main$m = /* @__PURE__ */ vue.defineComponent({
        ...__default__$d,
        props: checkboxProps,
        emits: checkboxEmits,
        setup(__props) {
          const props = __props;
          const slots = vue.useSlots();
          const {
            inputId,
            isLabeledByFormItem,
            isChecked,
            isDisabled,
            isFocused,
            checkboxSize,
            hasOwnLabel,
            model,
            actualValue,
            handleChange,
            onClickRoot
          } = useCheckbox(props, slots);
          const ns = useNamespace("checkbox");
          const compKls = vue.computed(() => {
            return [
              ns.b(),
              ns.m(checkboxSize.value),
              ns.is("disabled", isDisabled.value),
              ns.is("bordered", props.border),
              ns.is("checked", isChecked.value)
            ];
          });
          const spanKls = vue.computed(() => {
            return [
              ns.e("input"),
              ns.is("disabled", isDisabled.value),
              ns.is("checked", isChecked.value),
              ns.is("indeterminate", props.indeterminate),
              ns.is("focus", isFocused.value)
            ];
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(!vue.unref(hasOwnLabel) && vue.unref(isLabeledByFormItem) ? "span" : "label"), {
              class: vue.normalizeClass(vue.unref(compKls)),
              "aria-controls": _ctx.indeterminate ? _ctx.ariaControls : null,
              onClick: vue.unref(onClickRoot)
            }, {
              default: vue.withCtx(() => {
                var _a2, _b, _c, _d;
                return [
                  vue.createElementVNode("span", {
                    class: vue.normalizeClass(vue.unref(spanKls))
                  }, [
                    _ctx.trueValue || _ctx.falseValue || _ctx.trueLabel || _ctx.falseLabel ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                      key: 0,
                      id: vue.unref(inputId),
                      "onUpdate:modelValue": ($event) => vue.isRef(model) ? model.value = $event : null,
                      class: vue.normalizeClass(vue.unref(ns).e("original")),
                      type: "checkbox",
                      indeterminate: _ctx.indeterminate,
                      name: _ctx.name,
                      tabindex: _ctx.tabindex,
                      disabled: vue.unref(isDisabled),
                      "true-value": (_b = (_a2 = _ctx.trueValue) != null ? _a2 : _ctx.trueLabel) != null ? _b : true,
                      "false-value": (_d = (_c = _ctx.falseValue) != null ? _c : _ctx.falseLabel) != null ? _d : false,
                      onChange: vue.unref(handleChange),
                      onFocus: ($event) => isFocused.value = true,
                      onBlur: ($event) => isFocused.value = false,
                      onClick: vue.withModifiers(() => {
                      }, ["stop"])
                    }, null, 42, ["id", "onUpdate:modelValue", "indeterminate", "name", "tabindex", "disabled", "true-value", "false-value", "onChange", "onFocus", "onBlur", "onClick"])), [
                      [vue.vModelCheckbox, vue.unref(model)]
                    ]) : vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                      key: 1,
                      id: vue.unref(inputId),
                      "onUpdate:modelValue": ($event) => vue.isRef(model) ? model.value = $event : null,
                      class: vue.normalizeClass(vue.unref(ns).e("original")),
                      type: "checkbox",
                      indeterminate: _ctx.indeterminate,
                      disabled: vue.unref(isDisabled),
                      value: vue.unref(actualValue),
                      name: _ctx.name,
                      tabindex: _ctx.tabindex,
                      onChange: vue.unref(handleChange),
                      onFocus: ($event) => isFocused.value = true,
                      onBlur: ($event) => isFocused.value = false,
                      onClick: vue.withModifiers(() => {
                      }, ["stop"])
                    }, null, 42, ["id", "onUpdate:modelValue", "indeterminate", "disabled", "value", "name", "tabindex", "onChange", "onFocus", "onBlur", "onClick"])), [
                      [vue.vModelCheckbox, vue.unref(model)]
                    ]),
                    vue.createElementVNode("span", {
                      class: vue.normalizeClass(vue.unref(ns).e("inner"))
                    }, null, 2)
                  ], 2),
                  vue.unref(hasOwnLabel) ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 0,
                    class: vue.normalizeClass(vue.unref(ns).e("label"))
                  }, [
                    vue.renderSlot(_ctx.$slots, "default"),
                    !_ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                      vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
                    ], 64)) : vue.createCommentVNode("v-if", true)
                  ], 2)) : vue.createCommentVNode("v-if", true)
                ];
              }),
              _: 3
            }, 8, ["class", "aria-controls", "onClick"]);
          };
        }
      });
      var Checkbox = /* @__PURE__ */ _export_sfc$1(_sfc_main$m, [["__file", "checkbox.vue"]]);
      const __default__$c = vue.defineComponent({
        name: "ElCheckboxButton"
      });
      const _sfc_main$l = /* @__PURE__ */ vue.defineComponent({
        ...__default__$c,
        props: checkboxProps,
        emits: checkboxEmits,
        setup(__props) {
          const props = __props;
          const slots = vue.useSlots();
          const {
            isFocused,
            isChecked,
            isDisabled,
            checkboxButtonSize,
            model,
            actualValue,
            handleChange
          } = useCheckbox(props, slots);
          const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
          const ns = useNamespace("checkbox");
          const activeStyle = vue.computed(() => {
            var _a2, _b, _c, _d;
            const fillValue = (_b = (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.fill) == null ? void 0 : _a2.value) != null ? _b : "";
            return {
              backgroundColor: fillValue,
              borderColor: fillValue,
              color: (_d = (_c = checkboxGroup == null ? void 0 : checkboxGroup.textColor) == null ? void 0 : _c.value) != null ? _d : "",
              boxShadow: fillValue ? `-1px 0 0 0 ${fillValue}` : void 0
            };
          });
          const labelKls = vue.computed(() => {
            return [
              ns.b("button"),
              ns.bm("button", checkboxButtonSize.value),
              ns.is("disabled", isDisabled.value),
              ns.is("checked", isChecked.value),
              ns.is("focus", isFocused.value)
            ];
          });
          return (_ctx, _cache) => {
            var _a2, _b, _c, _d;
            return vue.openBlock(), vue.createElementBlock("label", {
              class: vue.normalizeClass(vue.unref(labelKls))
            }, [
              _ctx.trueValue || _ctx.falseValue || _ctx.trueLabel || _ctx.falseLabel ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 0,
                "onUpdate:modelValue": ($event) => vue.isRef(model) ? model.value = $event : null,
                class: vue.normalizeClass(vue.unref(ns).be("button", "original")),
                type: "checkbox",
                name: _ctx.name,
                tabindex: _ctx.tabindex,
                disabled: vue.unref(isDisabled),
                "true-value": (_b = (_a2 = _ctx.trueValue) != null ? _a2 : _ctx.trueLabel) != null ? _b : true,
                "false-value": (_d = (_c = _ctx.falseValue) != null ? _c : _ctx.falseLabel) != null ? _d : false,
                onChange: vue.unref(handleChange),
                onFocus: ($event) => isFocused.value = true,
                onBlur: ($event) => isFocused.value = false,
                onClick: vue.withModifiers(() => {
                }, ["stop"])
              }, null, 42, ["onUpdate:modelValue", "name", "tabindex", "disabled", "true-value", "false-value", "onChange", "onFocus", "onBlur", "onClick"])), [
                [vue.vModelCheckbox, vue.unref(model)]
              ]) : vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 1,
                "onUpdate:modelValue": ($event) => vue.isRef(model) ? model.value = $event : null,
                class: vue.normalizeClass(vue.unref(ns).be("button", "original")),
                type: "checkbox",
                name: _ctx.name,
                tabindex: _ctx.tabindex,
                disabled: vue.unref(isDisabled),
                value: vue.unref(actualValue),
                onChange: vue.unref(handleChange),
                onFocus: ($event) => isFocused.value = true,
                onBlur: ($event) => isFocused.value = false,
                onClick: vue.withModifiers(() => {
                }, ["stop"])
              }, null, 42, ["onUpdate:modelValue", "name", "tabindex", "disabled", "value", "onChange", "onFocus", "onBlur", "onClick"])), [
                [vue.vModelCheckbox, vue.unref(model)]
              ]),
              _ctx.$slots.default || _ctx.label ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 2,
                class: vue.normalizeClass(vue.unref(ns).be("button", "inner")),
                style: vue.normalizeStyle(vue.unref(isChecked) ? vue.unref(activeStyle) : void 0)
              }, [
                vue.renderSlot(_ctx.$slots, "default", {}, () => [
                  vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
                ])
              ], 6)) : vue.createCommentVNode("v-if", true)
            ], 2);
          };
        }
      });
      var CheckboxButton = /* @__PURE__ */ _export_sfc$1(_sfc_main$l, [["__file", "checkbox-button.vue"]]);
      const checkboxGroupProps = buildProps({
        modelValue: {
          type: definePropType(Array),
          default: () => []
        },
        disabled: Boolean,
        min: Number,
        max: Number,
        size: useSizeProp,
        fill: String,
        textColor: String,
        tag: {
          type: String,
          default: "div"
        },
        validateEvent: {
          type: Boolean,
          default: true
        },
        ...useAriaProps(["ariaLabel"])
      });
      const checkboxGroupEmits = {
        [UPDATE_MODEL_EVENT]: (val) => isArray$1(val),
        change: (val) => isArray$1(val)
      };
      const __default__$b = vue.defineComponent({
        name: "ElCheckboxGroup"
      });
      const _sfc_main$k = /* @__PURE__ */ vue.defineComponent({
        ...__default__$b,
        props: checkboxGroupProps,
        emits: checkboxGroupEmits,
        setup(__props, { emit }) {
          const props = __props;
          const ns = useNamespace("checkbox");
          const { formItem } = useFormItem();
          const { inputId: groupId, isLabeledByFormItem } = useFormItemInputId(props, {
            formItemContext: formItem
          });
          const changeEvent = async (value) => {
            emit(UPDATE_MODEL_EVENT, value);
            await vue.nextTick();
            emit("change", value);
          };
          const modelValue = vue.computed({
            get() {
              return props.modelValue;
            },
            set(val) {
              changeEvent(val);
            }
          });
          vue.provide(checkboxGroupContextKey, {
            ...pick(vue.toRefs(props), [
              "size",
              "min",
              "max",
              "disabled",
              "validateEvent",
              "fill",
              "textColor"
            ]),
            modelValue,
            changeEvent
          });
          vue.watch(() => props.modelValue, () => {
            if (props.validateEvent) {
              formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn());
            }
          });
          return (_ctx, _cache) => {
            var _a2;
            return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), {
              id: vue.unref(groupId),
              class: vue.normalizeClass(vue.unref(ns).b("group")),
              role: "group",
              "aria-label": !vue.unref(isLabeledByFormItem) ? _ctx.ariaLabel || "checkbox-group" : void 0,
              "aria-labelledby": vue.unref(isLabeledByFormItem) ? (_a2 = vue.unref(formItem)) == null ? void 0 : _a2.labelId : void 0
            }, {
              default: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "default")
              ]),
              _: 3
            }, 8, ["id", "class", "aria-label", "aria-labelledby"]);
          };
        }
      });
      var CheckboxGroup = /* @__PURE__ */ _export_sfc$1(_sfc_main$k, [["__file", "checkbox-group.vue"]]);
      const ElCheckbox = withInstall(Checkbox, {
        CheckboxButton,
        CheckboxGroup
      });
      withNoopInstall(CheckboxButton);
      const ElCheckboxGroup = withNoopInstall(CheckboxGroup);
      const radioPropsBase = buildProps({
        modelValue: {
          type: [String, Number, Boolean],
          default: void 0
        },
        size: useSizeProp,
        disabled: Boolean,
        label: {
          type: [String, Number, Boolean],
          default: void 0
        },
        value: {
          type: [String, Number, Boolean],
          default: void 0
        },
        name: {
          type: String,
          default: void 0
        }
      });
      const radioProps = buildProps({
        ...radioPropsBase,
        border: Boolean
      });
      const radioEmits = {
        [UPDATE_MODEL_EVENT]: (val) => isString(val) || isNumber(val) || isBoolean(val),
        [CHANGE_EVENT]: (val) => isString(val) || isNumber(val) || isBoolean(val)
      };
      const radioGroupKey = Symbol("radioGroupKey");
      const useRadio = (props, emit) => {
        const radioRef = vue.ref();
        const radioGroup = vue.inject(radioGroupKey, void 0);
        const isGroup = vue.computed(() => !!radioGroup);
        const actualValue = vue.computed(() => {
          if (!isPropAbsent(props.value)) {
            return props.value;
          }
          return props.label;
        });
        const modelValue = vue.computed({
          get() {
            return isGroup.value ? radioGroup.modelValue : props.modelValue;
          },
          set(val) {
            if (isGroup.value) {
              radioGroup.changeEvent(val);
            } else {
              emit && emit(UPDATE_MODEL_EVENT, val);
            }
            radioRef.value.checked = props.modelValue === actualValue.value;
          }
        });
        const size = useFormSize(vue.computed(() => radioGroup == null ? void 0 : radioGroup.size));
        const disabled = useFormDisabled(vue.computed(() => radioGroup == null ? void 0 : radioGroup.disabled));
        const focus = vue.ref(false);
        const tabIndex = vue.computed(() => {
          return disabled.value || isGroup.value && modelValue.value !== actualValue.value ? -1 : 0;
        });
        useDeprecated({
          from: "label act as value",
          replacement: "value",
          version: "3.0.0",
          scope: "el-radio",
          ref: "https://element-plus.org/en-US/component/radio.html"
        }, vue.computed(() => isGroup.value && isPropAbsent(props.value)));
        return {
          radioRef,
          isGroup,
          radioGroup,
          focus,
          size,
          disabled,
          tabIndex,
          modelValue,
          actualValue
        };
      };
      const __default__$a = vue.defineComponent({
        name: "ElRadio"
      });
      const _sfc_main$j = /* @__PURE__ */ vue.defineComponent({
        ...__default__$a,
        props: radioProps,
        emits: radioEmits,
        setup(__props, { emit }) {
          const props = __props;
          const ns = useNamespace("radio");
          const { radioRef, radioGroup, focus, size, disabled, modelValue, actualValue } = useRadio(props, emit);
          function handleChange() {
            vue.nextTick(() => emit("change", modelValue.value));
          }
          return (_ctx, _cache) => {
            var _a2;
            return vue.openBlock(), vue.createElementBlock("label", {
              class: vue.normalizeClass([
                vue.unref(ns).b(),
                vue.unref(ns).is("disabled", vue.unref(disabled)),
                vue.unref(ns).is("focus", vue.unref(focus)),
                vue.unref(ns).is("bordered", _ctx.border),
                vue.unref(ns).is("checked", vue.unref(modelValue) === vue.unref(actualValue)),
                vue.unref(ns).m(vue.unref(size))
              ])
            }, [
              vue.createElementVNode("span", {
                class: vue.normalizeClass([
                  vue.unref(ns).e("input"),
                  vue.unref(ns).is("disabled", vue.unref(disabled)),
                  vue.unref(ns).is("checked", vue.unref(modelValue) === vue.unref(actualValue))
                ])
              }, [
                vue.withDirectives(vue.createElementVNode("input", {
                  ref_key: "radioRef",
                  ref: radioRef,
                  "onUpdate:modelValue": ($event) => vue.isRef(modelValue) ? modelValue.value = $event : null,
                  class: vue.normalizeClass(vue.unref(ns).e("original")),
                  value: vue.unref(actualValue),
                  name: _ctx.name || ((_a2 = vue.unref(radioGroup)) == null ? void 0 : _a2.name),
                  disabled: vue.unref(disabled),
                  checked: vue.unref(modelValue) === vue.unref(actualValue),
                  type: "radio",
                  onFocus: ($event) => focus.value = true,
                  onBlur: ($event) => focus.value = false,
                  onChange: handleChange,
                  onClick: vue.withModifiers(() => {
                  }, ["stop"])
                }, null, 42, ["onUpdate:modelValue", "value", "name", "disabled", "checked", "onFocus", "onBlur", "onClick"]), [
                  [vue.vModelRadio, vue.unref(modelValue)]
                ]),
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(vue.unref(ns).e("inner"))
                }, null, 2)
              ], 2),
              vue.createElementVNode("span", {
                class: vue.normalizeClass(vue.unref(ns).e("label")),
                onKeydown: vue.withModifiers(() => {
                }, ["stop"])
              }, [
                vue.renderSlot(_ctx.$slots, "default", {}, () => [
                  vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
                ])
              ], 42, ["onKeydown"])
            ], 2);
          };
        }
      });
      var Radio = /* @__PURE__ */ _export_sfc$1(_sfc_main$j, [["__file", "radio.vue"]]);
      const radioButtonProps = buildProps({
        ...radioPropsBase
      });
      const __default__$9 = vue.defineComponent({
        name: "ElRadioButton"
      });
      const _sfc_main$i = /* @__PURE__ */ vue.defineComponent({
        ...__default__$9,
        props: radioButtonProps,
        setup(__props) {
          const props = __props;
          const ns = useNamespace("radio");
          const { radioRef, focus, size, disabled, modelValue, radioGroup, actualValue } = useRadio(props);
          const activeStyle = vue.computed(() => {
            return {
              backgroundColor: (radioGroup == null ? void 0 : radioGroup.fill) || "",
              borderColor: (radioGroup == null ? void 0 : radioGroup.fill) || "",
              boxShadow: (radioGroup == null ? void 0 : radioGroup.fill) ? `-1px 0 0 0 ${radioGroup.fill}` : "",
              color: (radioGroup == null ? void 0 : radioGroup.textColor) || ""
            };
          });
          return (_ctx, _cache) => {
            var _a2;
            return vue.openBlock(), vue.createElementBlock("label", {
              class: vue.normalizeClass([
                vue.unref(ns).b("button"),
                vue.unref(ns).is("active", vue.unref(modelValue) === vue.unref(actualValue)),
                vue.unref(ns).is("disabled", vue.unref(disabled)),
                vue.unref(ns).is("focus", vue.unref(focus)),
                vue.unref(ns).bm("button", vue.unref(size))
              ])
            }, [
              vue.withDirectives(vue.createElementVNode("input", {
                ref_key: "radioRef",
                ref: radioRef,
                "onUpdate:modelValue": ($event) => vue.isRef(modelValue) ? modelValue.value = $event : null,
                class: vue.normalizeClass(vue.unref(ns).be("button", "original-radio")),
                value: vue.unref(actualValue),
                type: "radio",
                name: _ctx.name || ((_a2 = vue.unref(radioGroup)) == null ? void 0 : _a2.name),
                disabled: vue.unref(disabled),
                onFocus: ($event) => focus.value = true,
                onBlur: ($event) => focus.value = false,
                onClick: vue.withModifiers(() => {
                }, ["stop"])
              }, null, 42, ["onUpdate:modelValue", "value", "name", "disabled", "onFocus", "onBlur", "onClick"]), [
                [vue.vModelRadio, vue.unref(modelValue)]
              ]),
              vue.createElementVNode("span", {
                class: vue.normalizeClass(vue.unref(ns).be("button", "inner")),
                style: vue.normalizeStyle(vue.unref(modelValue) === vue.unref(actualValue) ? vue.unref(activeStyle) : {}),
                onKeydown: vue.withModifiers(() => {
                }, ["stop"])
              }, [
                vue.renderSlot(_ctx.$slots, "default", {}, () => [
                  vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
                ])
              ], 46, ["onKeydown"])
            ], 2);
          };
        }
      });
      var RadioButton = /* @__PURE__ */ _export_sfc$1(_sfc_main$i, [["__file", "radio-button.vue"]]);
      const radioGroupProps = buildProps({
        id: {
          type: String,
          default: void 0
        },
        size: useSizeProp,
        disabled: Boolean,
        modelValue: {
          type: [String, Number, Boolean],
          default: void 0
        },
        fill: {
          type: String,
          default: ""
        },
        textColor: {
          type: String,
          default: ""
        },
        name: {
          type: String,
          default: void 0
        },
        validateEvent: {
          type: Boolean,
          default: true
        },
        ...useAriaProps(["ariaLabel"])
      });
      const radioGroupEmits = radioEmits;
      const __default__$8 = vue.defineComponent({
        name: "ElRadioGroup"
      });
      const _sfc_main$h = /* @__PURE__ */ vue.defineComponent({
        ...__default__$8,
        props: radioGroupProps,
        emits: radioGroupEmits,
        setup(__props, { emit }) {
          const props = __props;
          const ns = useNamespace("radio");
          const radioId = useId();
          const radioGroupRef = vue.ref();
          const { formItem } = useFormItem();
          const { inputId: groupId, isLabeledByFormItem } = useFormItemInputId(props, {
            formItemContext: formItem
          });
          const changeEvent = (value) => {
            emit(UPDATE_MODEL_EVENT, value);
            vue.nextTick(() => emit("change", value));
          };
          vue.onMounted(() => {
            const radios = radioGroupRef.value.querySelectorAll("[type=radio]");
            const firstLabel = radios[0];
            if (!Array.from(radios).some((radio) => radio.checked) && firstLabel) {
              firstLabel.tabIndex = 0;
            }
          });
          const name = vue.computed(() => {
            return props.name || radioId.value;
          });
          vue.provide(radioGroupKey, vue.reactive({
            ...vue.toRefs(props),
            changeEvent,
            name
          }));
          vue.watch(() => props.modelValue, () => {
            if (props.validateEvent) {
              formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn());
            }
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              id: vue.unref(groupId),
              ref_key: "radioGroupRef",
              ref: radioGroupRef,
              class: vue.normalizeClass(vue.unref(ns).b("group")),
              role: "radiogroup",
              "aria-label": !vue.unref(isLabeledByFormItem) ? _ctx.ariaLabel || "radio-group" : void 0,
              "aria-labelledby": vue.unref(isLabeledByFormItem) ? vue.unref(formItem).labelId : void 0
            }, [
              vue.renderSlot(_ctx.$slots, "default")
            ], 10, ["id", "aria-label", "aria-labelledby"]);
          };
        }
      });
      var RadioGroup = /* @__PURE__ */ _export_sfc$1(_sfc_main$h, [["__file", "radio-group.vue"]]);
      const ElRadio = withInstall(Radio, {
        RadioButton,
        RadioGroup
      });
      const ElRadioGroup = withNoopInstall(RadioGroup);
      withNoopInstall(RadioButton);
      const tagProps = buildProps({
        type: {
          type: String,
          values: ["primary", "success", "info", "warning", "danger"],
          default: "primary"
        },
        closable: Boolean,
        disableTransitions: Boolean,
        hit: Boolean,
        color: String,
        size: {
          type: String,
          values: componentSizes
        },
        effect: {
          type: String,
          values: ["dark", "light", "plain"],
          default: "light"
        },
        round: Boolean
      });
      const tagEmits = {
        close: (evt) => evt instanceof MouseEvent,
        click: (evt) => evt instanceof MouseEvent
      };
      const __default__$7 = vue.defineComponent({
        name: "ElTag"
      });
      const _sfc_main$g = /* @__PURE__ */ vue.defineComponent({
        ...__default__$7,
        props: tagProps,
        emits: tagEmits,
        setup(__props, { emit }) {
          const props = __props;
          const tagSize = useFormSize();
          const ns = useNamespace("tag");
          const containerKls = vue.computed(() => {
            const { type, hit, effect, closable, round } = props;
            return [
              ns.b(),
              ns.is("closable", closable),
              ns.m(type || "primary"),
              ns.m(tagSize.value),
              ns.m(effect),
              ns.is("hit", hit),
              ns.is("round", round)
            ];
          });
          const handleClose = (event) => {
            emit("close", event);
          };
          const handleClick = (event) => {
            emit("click", event);
          };
          const handleVNodeMounted = (vnode) => {
            vnode.component.subTree.component.bum = null;
          };
          return (_ctx, _cache) => {
            return _ctx.disableTransitions ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              class: vue.normalizeClass(vue.unref(containerKls)),
              style: vue.normalizeStyle({ backgroundColor: _ctx.color }),
              onClick: handleClick
            }, [
              vue.createElementVNode("span", {
                class: vue.normalizeClass(vue.unref(ns).e("content"))
              }, [
                vue.renderSlot(_ctx.$slots, "default")
              ], 2),
              _ctx.closable ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 0,
                class: vue.normalizeClass(vue.unref(ns).e("close")),
                onClick: vue.withModifiers(handleClose, ["stop"])
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(close_default))
                ]),
                _: 1
              }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
            ], 6)) : (vue.openBlock(), vue.createBlock(vue.Transition, {
              key: 1,
              name: `${vue.unref(ns).namespace.value}-zoom-in-center`,
              appear: "",
              onVnodeMounted: handleVNodeMounted
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(vue.unref(containerKls)),
                  style: vue.normalizeStyle({ backgroundColor: _ctx.color }),
                  onClick: handleClick
                }, [
                  vue.createElementVNode("span", {
                    class: vue.normalizeClass(vue.unref(ns).e("content"))
                  }, [
                    vue.renderSlot(_ctx.$slots, "default")
                  ], 2),
                  _ctx.closable ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 0,
                    class: vue.normalizeClass(vue.unref(ns).e("close")),
                    onClick: vue.withModifiers(handleClose, ["stop"])
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(close_default))
                    ]),
                    _: 1
                  }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
                ], 6)
              ]),
              _: 3
            }, 8, ["name"]));
          };
        }
      });
      var Tag = /* @__PURE__ */ _export_sfc$1(_sfc_main$g, [["__file", "tag.vue"]]);
      const ElTag = withInstall(Tag);
      const overlayProps = buildProps({
        mask: {
          type: Boolean,
          default: true
        },
        customMaskEvent: Boolean,
        overlayClass: {
          type: definePropType([
            String,
            Array,
            Object
          ])
        },
        zIndex: {
          type: definePropType([String, Number])
        }
      });
      const overlayEmits = {
        click: (evt) => evt instanceof MouseEvent
      };
      const BLOCK = "overlay";
      var Overlay = vue.defineComponent({
        name: "ElOverlay",
        props: overlayProps,
        emits: overlayEmits,
        setup(props, { slots, emit }) {
          const ns = useNamespace(BLOCK);
          const onMaskClick = (e) => {
            emit("click", e);
          };
          const { onClick, onMousedown, onMouseup } = useSameTarget(props.customMaskEvent ? void 0 : onMaskClick);
          return () => {
            return props.mask ? vue.createVNode("div", {
              class: [ns.b(), props.overlayClass],
              style: {
                zIndex: props.zIndex
              },
              onClick,
              onMousedown,
              onMouseup
            }, [vue.renderSlot(slots, "default")], PatchFlags.STYLE | PatchFlags.CLASS | PatchFlags.PROPS, ["onClick", "onMouseup", "onMousedown"]) : vue.h("div", {
              class: props.overlayClass,
              style: {
                zIndex: props.zIndex,
                position: "fixed",
                top: "0px",
                right: "0px",
                bottom: "0px",
                left: "0px"
              }
            }, [vue.renderSlot(slots, "default")]);
          };
        }
      });
      const ElOverlay = Overlay;
      const dialogContentProps = buildProps({
        center: Boolean,
        alignCenter: Boolean,
        closeIcon: {
          type: iconPropType
        },
        draggable: Boolean,
        overflow: Boolean,
        fullscreen: Boolean,
        showClose: {
          type: Boolean,
          default: true
        },
        title: {
          type: String,
          default: ""
        },
        ariaLevel: {
          type: String,
          default: "2"
        }
      });
      const dialogProps = buildProps({
        ...dialogContentProps,
        appendToBody: Boolean,
        appendTo: {
          type: definePropType([String, Object]),
          default: "body"
        },
        beforeClose: {
          type: definePropType(Function)
        },
        destroyOnClose: Boolean,
        closeOnClickModal: {
          type: Boolean,
          default: true
        },
        closeOnPressEscape: {
          type: Boolean,
          default: true
        },
        lockScroll: {
          type: Boolean,
          default: true
        },
        modal: {
          type: Boolean,
          default: true
        },
        openDelay: {
          type: Number,
          default: 0
        },
        closeDelay: {
          type: Number,
          default: 0
        },
        top: {
          type: String
        },
        modelValue: Boolean,
        modalClass: String,
        width: {
          type: [String, Number]
        },
        zIndex: {
          type: Number
        },
        trapFocus: Boolean,
        headerAriaLevel: {
          type: String,
          default: "2"
        }
      });
      const dialogEmits = {
        open: () => true,
        opened: () => true,
        close: () => true,
        closed: () => true,
        [UPDATE_MODEL_EVENT]: (value) => isBoolean(value),
        openAutoFocus: () => true,
        closeAutoFocus: () => true
      };
      const useDialog = (props, targetRef) => {
        var _a2;
        const instance = vue.getCurrentInstance();
        const emit = instance.emit;
        const { nextZIndex } = useZIndex();
        let lastPosition = "";
        const titleId = useId();
        const bodyId = useId();
        const visible = vue.ref(false);
        const closed = vue.ref(false);
        const rendered = vue.ref(false);
        const zIndex2 = vue.ref((_a2 = props.zIndex) != null ? _a2 : nextZIndex());
        let openTimer = void 0;
        let closeTimer = void 0;
        const namespace = useGlobalConfig("namespace", defaultNamespace);
        const style = vue.computed(() => {
          const style2 = {};
          const varPrefix = `--${namespace.value}-dialog`;
          if (!props.fullscreen) {
            if (props.top) {
              style2[`${varPrefix}-margin-top`] = props.top;
            }
            if (props.width) {
              style2[`${varPrefix}-width`] = addUnit(props.width);
            }
          }
          return style2;
        });
        const overlayDialogStyle = vue.computed(() => {
          if (props.alignCenter) {
            return { display: "flex" };
          }
          return {};
        });
        function afterEnter() {
          emit("opened");
        }
        function afterLeave() {
          emit("closed");
          emit(UPDATE_MODEL_EVENT, false);
          if (props.destroyOnClose) {
            rendered.value = false;
          }
        }
        function beforeLeave() {
          emit("close");
        }
        function open() {
          closeTimer == null ? void 0 : closeTimer();
          openTimer == null ? void 0 : openTimer();
          if (props.openDelay && props.openDelay > 0) {
            ({ stop: openTimer } = useTimeoutFn(() => doOpen(), props.openDelay));
          } else {
            doOpen();
          }
        }
        function close() {
          openTimer == null ? void 0 : openTimer();
          closeTimer == null ? void 0 : closeTimer();
          if (props.closeDelay && props.closeDelay > 0) {
            ({ stop: closeTimer } = useTimeoutFn(() => doClose(), props.closeDelay));
          } else {
            doClose();
          }
        }
        function handleClose() {
          function hide(shouldCancel) {
            if (shouldCancel)
              return;
            closed.value = true;
            visible.value = false;
          }
          if (props.beforeClose) {
            props.beforeClose(hide);
          } else {
            close();
          }
        }
        function onModalClick() {
          if (props.closeOnClickModal) {
            handleClose();
          }
        }
        function doOpen() {
          if (!isClient)
            return;
          visible.value = true;
        }
        function doClose() {
          visible.value = false;
        }
        function onOpenAutoFocus() {
          emit("openAutoFocus");
        }
        function onCloseAutoFocus() {
          emit("closeAutoFocus");
        }
        function onFocusoutPrevented(event) {
          var _a22;
          if (((_a22 = event.detail) == null ? void 0 : _a22.focusReason) === "pointer") {
            event.preventDefault();
          }
        }
        if (props.lockScroll) {
          useLockscreen(visible);
        }
        function onCloseRequested() {
          if (props.closeOnPressEscape) {
            handleClose();
          }
        }
        vue.watch(() => props.modelValue, (val) => {
          if (val) {
            closed.value = false;
            open();
            rendered.value = true;
            zIndex2.value = isUndefined$1(props.zIndex) ? nextZIndex() : zIndex2.value++;
            vue.nextTick(() => {
              emit("open");
              if (targetRef.value) {
                targetRef.value.scrollTop = 0;
              }
            });
          } else {
            if (visible.value) {
              close();
            }
          }
        });
        vue.watch(() => props.fullscreen, (val) => {
          if (!targetRef.value)
            return;
          if (val) {
            lastPosition = targetRef.value.style.transform;
            targetRef.value.style.transform = "";
          } else {
            targetRef.value.style.transform = lastPosition;
          }
        });
        vue.onMounted(() => {
          if (props.modelValue) {
            visible.value = true;
            rendered.value = true;
            open();
          }
        });
        return {
          afterEnter,
          afterLeave,
          beforeLeave,
          handleClose,
          onModalClick,
          close,
          doClose,
          onOpenAutoFocus,
          onCloseAutoFocus,
          onCloseRequested,
          onFocusoutPrevented,
          titleId,
          bodyId,
          closed,
          style,
          overlayDialogStyle,
          rendered,
          visible,
          zIndex: zIndex2
        };
      };
      const dividerProps = buildProps({
        direction: {
          type: String,
          values: ["horizontal", "vertical"],
          default: "horizontal"
        },
        contentPosition: {
          type: String,
          values: ["left", "center", "right"],
          default: "center"
        },
        borderStyle: {
          type: definePropType(String),
          default: "solid"
        }
      });
      const __default__$6 = vue.defineComponent({
        name: "ElDivider"
      });
      const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
        ...__default__$6,
        props: dividerProps,
        setup(__props) {
          const props = __props;
          const ns = useNamespace("divider");
          const dividerStyle = vue.computed(() => {
            return ns.cssVar({
              "border-style": props.borderStyle
            });
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              class: vue.normalizeClass([vue.unref(ns).b(), vue.unref(ns).m(_ctx.direction)]),
              style: vue.normalizeStyle(vue.unref(dividerStyle)),
              role: "separator"
            }, [
              _ctx.$slots.default && _ctx.direction !== "vertical" ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: vue.normalizeClass([vue.unref(ns).e("text"), vue.unref(ns).is(_ctx.contentPosition)])
              }, [
                vue.renderSlot(_ctx.$slots, "default")
              ], 2)) : vue.createCommentVNode("v-if", true)
            ], 6);
          };
        }
      });
      var Divider = /* @__PURE__ */ _export_sfc$1(_sfc_main$f, [["__file", "divider.vue"]]);
      const ElDivider = withInstall(Divider);
      const drawerProps = buildProps({
        ...dialogProps,
        direction: {
          type: String,
          default: "rtl",
          values: ["ltr", "rtl", "ttb", "btt"]
        },
        size: {
          type: [String, Number],
          default: "30%"
        },
        withHeader: {
          type: Boolean,
          default: true
        },
        modalFade: {
          type: Boolean,
          default: true
        },
        headerAriaLevel: {
          type: String,
          default: "2"
        }
      });
      const drawerEmits = dialogEmits;
      const __default__$5 = vue.defineComponent({
        name: "ElDrawer",
        inheritAttrs: false
      });
      const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
        ...__default__$5,
        props: drawerProps,
        emits: drawerEmits,
        setup(__props, { expose }) {
          const props = __props;
          const slots = vue.useSlots();
          useDeprecated({
            scope: "el-drawer",
            from: "the title slot",
            replacement: "the header slot",
            version: "3.0.0",
            ref: "https://element-plus.org/en-US/component/drawer.html#slots"
          }, vue.computed(() => !!slots.title));
          const drawerRef = vue.ref();
          const focusStartRef = vue.ref();
          const ns = useNamespace("drawer");
          const { t } = useLocale();
          const {
            afterEnter,
            afterLeave,
            beforeLeave,
            visible,
            rendered,
            titleId,
            bodyId,
            zIndex: zIndex2,
            onModalClick,
            onOpenAutoFocus,
            onCloseAutoFocus,
            onFocusoutPrevented,
            onCloseRequested,
            handleClose
          } = useDialog(props, drawerRef);
          const isHorizontal = vue.computed(() => props.direction === "rtl" || props.direction === "ltr");
          const drawerSize = vue.computed(() => addUnit(props.size));
          expose({
            handleClose,
            afterEnter,
            afterLeave
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.unref(ElTeleport), {
              to: _ctx.appendTo,
              disabled: _ctx.appendTo !== "body" ? false : !_ctx.appendToBody
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.Transition, {
                  name: vue.unref(ns).b("fade"),
                  onAfterEnter: vue.unref(afterEnter),
                  onAfterLeave: vue.unref(afterLeave),
                  onBeforeLeave: vue.unref(beforeLeave),
                  persisted: ""
                }, {
                  default: vue.withCtx(() => [
                    vue.withDirectives(vue.createVNode(vue.unref(ElOverlay), {
                      mask: _ctx.modal,
                      "overlay-class": _ctx.modalClass,
                      "z-index": vue.unref(zIndex2),
                      onClick: vue.unref(onModalClick)
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(vue.unref(ElFocusTrap), {
                          loop: "",
                          trapped: vue.unref(visible),
                          "focus-trap-el": drawerRef.value,
                          "focus-start-el": focusStartRef.value,
                          onFocusAfterTrapped: vue.unref(onOpenAutoFocus),
                          onFocusAfterReleased: vue.unref(onCloseAutoFocus),
                          onFocusoutPrevented: vue.unref(onFocusoutPrevented),
                          onReleaseRequested: vue.unref(onCloseRequested)
                        }, {
                          default: vue.withCtx(() => [
                            vue.createElementVNode("div", vue.mergeProps({
                              ref_key: "drawerRef",
                              ref: drawerRef,
                              "aria-modal": "true",
                              "aria-label": _ctx.title || void 0,
                              "aria-labelledby": !_ctx.title ? vue.unref(titleId) : void 0,
                              "aria-describedby": vue.unref(bodyId)
                            }, _ctx.$attrs, {
                              class: [vue.unref(ns).b(), _ctx.direction, vue.unref(visible) && "open"],
                              style: vue.unref(isHorizontal) ? "width: " + vue.unref(drawerSize) : "height: " + vue.unref(drawerSize),
                              role: "dialog",
                              onClick: vue.withModifiers(() => {
                              }, ["stop"])
                            }), [
                              vue.createElementVNode("span", {
                                ref_key: "focusStartRef",
                                ref: focusStartRef,
                                class: vue.normalizeClass(vue.unref(ns).e("sr-focus")),
                                tabindex: "-1"
                              }, null, 2),
                              _ctx.withHeader ? (vue.openBlock(), vue.createElementBlock("header", {
                                key: 0,
                                class: vue.normalizeClass(vue.unref(ns).e("header"))
                              }, [
                                !_ctx.$slots.title ? vue.renderSlot(_ctx.$slots, "header", {
                                  key: 0,
                                  close: vue.unref(handleClose),
                                  titleId: vue.unref(titleId),
                                  titleClass: vue.unref(ns).e("title")
                                }, () => [
                                  !_ctx.$slots.title ? (vue.openBlock(), vue.createElementBlock("span", {
                                    key: 0,
                                    id: vue.unref(titleId),
                                    role: "heading",
                                    "aria-level": _ctx.headerAriaLevel,
                                    class: vue.normalizeClass(vue.unref(ns).e("title"))
                                  }, vue.toDisplayString(_ctx.title), 11, ["id", "aria-level"])) : vue.createCommentVNode("v-if", true)
                                ]) : vue.renderSlot(_ctx.$slots, "title", { key: 1 }, () => [
                                  vue.createCommentVNode(" DEPRECATED SLOT ")
                                ]),
                                _ctx.showClose ? (vue.openBlock(), vue.createElementBlock("button", {
                                  key: 2,
                                  "aria-label": vue.unref(t)("el.drawer.close"),
                                  class: vue.normalizeClass(vue.unref(ns).e("close-btn")),
                                  type: "button",
                                  onClick: vue.unref(handleClose)
                                }, [
                                  vue.createVNode(vue.unref(ElIcon), {
                                    class: vue.normalizeClass(vue.unref(ns).e("close"))
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(vue.unref(close_default))
                                    ]),
                                    _: 1
                                  }, 8, ["class"])
                                ], 10, ["aria-label", "onClick"])) : vue.createCommentVNode("v-if", true)
                              ], 2)) : vue.createCommentVNode("v-if", true),
                              vue.unref(rendered) ? (vue.openBlock(), vue.createElementBlock("div", {
                                key: 1,
                                id: vue.unref(bodyId),
                                class: vue.normalizeClass(vue.unref(ns).e("body"))
                              }, [
                                vue.renderSlot(_ctx.$slots, "default")
                              ], 10, ["id"])) : vue.createCommentVNode("v-if", true),
                              _ctx.$slots.footer ? (vue.openBlock(), vue.createElementBlock("div", {
                                key: 2,
                                class: vue.normalizeClass(vue.unref(ns).e("footer"))
                              }, [
                                vue.renderSlot(_ctx.$slots, "footer")
                              ], 2)) : vue.createCommentVNode("v-if", true)
                            ], 16, ["aria-label", "aria-labelledby", "aria-describedby", "onClick"])
                          ]),
                          _: 3
                        }, 8, ["trapped", "focus-trap-el", "focus-start-el", "onFocusAfterTrapped", "onFocusAfterReleased", "onFocusoutPrevented", "onReleaseRequested"])
                      ]),
                      _: 3
                    }, 8, ["mask", "overlay-class", "z-index", "onClick"]), [
                      [vue.vShow, vue.unref(visible)]
                    ])
                  ]),
                  _: 3
                }, 8, ["name", "onAfterEnter", "onAfterLeave", "onBeforeLeave"])
              ]),
              _: 3
            }, 8, ["to", "disabled"]);
          };
        }
      });
      var Drawer = /* @__PURE__ */ _export_sfc$1(_sfc_main$e, [["__file", "drawer.vue"]]);
      const ElDrawer = withInstall(Drawer);
      const __default__$4 = vue.defineComponent({
        name: "ImgEmpty"
      });
      const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
        ...__default__$4,
        setup(__props) {
          const ns = useNamespace("empty");
          const id = useId();
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("svg", {
              viewBox: "0 0 79 86",
              version: "1.1",
              xmlns: "http://www.w3.org/2000/svg",
              "xmlns:xlink": "http://www.w3.org/1999/xlink"
            }, [
              vue.createElementVNode("defs", null, [
                vue.createElementVNode("linearGradient", {
                  id: `linearGradient-1-${vue.unref(id)}`,
                  x1: "38.8503086%",
                  y1: "0%",
                  x2: "61.1496914%",
                  y2: "100%"
                }, [
                  vue.createElementVNode("stop", {
                    "stop-color": `var(${vue.unref(ns).cssVarBlockName("fill-color-1")})`,
                    offset: "0%"
                  }, null, 8, ["stop-color"]),
                  vue.createElementVNode("stop", {
                    "stop-color": `var(${vue.unref(ns).cssVarBlockName("fill-color-4")})`,
                    offset: "100%"
                  }, null, 8, ["stop-color"])
                ], 8, ["id"]),
                vue.createElementVNode("linearGradient", {
                  id: `linearGradient-2-${vue.unref(id)}`,
                  x1: "0%",
                  y1: "9.5%",
                  x2: "100%",
                  y2: "90.5%"
                }, [
                  vue.createElementVNode("stop", {
                    "stop-color": `var(${vue.unref(ns).cssVarBlockName("fill-color-1")})`,
                    offset: "0%"
                  }, null, 8, ["stop-color"]),
                  vue.createElementVNode("stop", {
                    "stop-color": `var(${vue.unref(ns).cssVarBlockName("fill-color-6")})`,
                    offset: "100%"
                  }, null, 8, ["stop-color"])
                ], 8, ["id"]),
                vue.createElementVNode("rect", {
                  id: `path-3-${vue.unref(id)}`,
                  x: "0",
                  y: "0",
                  width: "17",
                  height: "36"
                }, null, 8, ["id"])
              ]),
              vue.createElementVNode("g", {
                id: "Illustrations",
                stroke: "none",
                "stroke-width": "1",
                fill: "none",
                "fill-rule": "evenodd"
              }, [
                vue.createElementVNode("g", {
                  id: "B-type",
                  transform: "translate(-1268.000000, -535.000000)"
                }, [
                  vue.createElementVNode("g", {
                    id: "Group-2",
                    transform: "translate(1268.000000, 535.000000)"
                  }, [
                    vue.createElementVNode("path", {
                      id: "Oval-Copy-2",
                      d: "M39.5,86 C61.3152476,86 79,83.9106622 79,81.3333333 C79,78.7560045 57.3152476,78 35.5,78 C13.6847524,78 0,78.7560045 0,81.3333333 C0,83.9106622 17.6847524,86 39.5,86 Z",
                      fill: `var(${vue.unref(ns).cssVarBlockName("fill-color-3")})`
                    }, null, 8, ["fill"]),
                    vue.createElementVNode("polygon", {
                      id: "Rectangle-Copy-14",
                      fill: `var(${vue.unref(ns).cssVarBlockName("fill-color-7")})`,
                      transform: "translate(27.500000, 51.500000) scale(1, -1) translate(-27.500000, -51.500000) ",
                      points: "13 58 53 58 42 45 2 45"
                    }, null, 8, ["fill"]),
                    vue.createElementVNode("g", {
                      id: "Group-Copy",
                      transform: "translate(34.500000, 31.500000) scale(-1, 1) rotate(-25.000000) translate(-34.500000, -31.500000) translate(7.000000, 10.000000)"
                    }, [
                      vue.createElementVNode("polygon", {
                        id: "Rectangle-Copy-10",
                        fill: `var(${vue.unref(ns).cssVarBlockName("fill-color-7")})`,
                        transform: "translate(11.500000, 5.000000) scale(1, -1) translate(-11.500000, -5.000000) ",
                        points: "2.84078316e-14 3 18 3 23 7 5 7"
                      }, null, 8, ["fill"]),
                      vue.createElementVNode("polygon", {
                        id: "Rectangle-Copy-11",
                        fill: `var(${vue.unref(ns).cssVarBlockName("fill-color-5")})`,
                        points: "-3.69149156e-15 7 38 7 38 43 -3.69149156e-15 43"
                      }, null, 8, ["fill"]),
                      vue.createElementVNode("rect", {
                        id: "Rectangle-Copy-12",
                        fill: `url(#linearGradient-1-${vue.unref(id)})`,
                        transform: "translate(46.500000, 25.000000) scale(-1, 1) translate(-46.500000, -25.000000) ",
                        x: "38",
                        y: "7",
                        width: "17",
                        height: "36"
                      }, null, 8, ["fill"]),
                      vue.createElementVNode("polygon", {
                        id: "Rectangle-Copy-13",
                        fill: `var(${vue.unref(ns).cssVarBlockName("fill-color-2")})`,
                        transform: "translate(39.500000, 3.500000) scale(-1, 1) translate(-39.500000, -3.500000) ",
                        points: "24 7 41 7 55 -3.63806207e-12 38 -3.63806207e-12"
                      }, null, 8, ["fill"])
                    ]),
                    vue.createElementVNode("rect", {
                      id: "Rectangle-Copy-15",
                      fill: `url(#linearGradient-2-${vue.unref(id)})`,
                      x: "13",
                      y: "45",
                      width: "40",
                      height: "36"
                    }, null, 8, ["fill"]),
                    vue.createElementVNode("g", {
                      id: "Rectangle-Copy-17",
                      transform: "translate(53.000000, 45.000000)"
                    }, [
                      vue.createElementVNode("use", {
                        id: "Mask",
                        fill: `var(${vue.unref(ns).cssVarBlockName("fill-color-8")})`,
                        transform: "translate(8.500000, 18.000000) scale(-1, 1) translate(-8.500000, -18.000000) ",
                        "xlink:href": `#path-3-${vue.unref(id)}`
                      }, null, 8, ["fill", "xlink:href"]),
                      vue.createElementVNode("polygon", {
                        id: "Rectangle-Copy",
                        fill: `var(${vue.unref(ns).cssVarBlockName("fill-color-9")})`,
                        mask: `url(#mask-4-${vue.unref(id)})`,
                        transform: "translate(12.000000, 9.000000) scale(-1, 1) translate(-12.000000, -9.000000) ",
                        points: "7 0 24 0 20 18 7 16.5"
                      }, null, 8, ["fill", "mask"])
                    ]),
                    vue.createElementVNode("polygon", {
                      id: "Rectangle-Copy-18",
                      fill: `var(${vue.unref(ns).cssVarBlockName("fill-color-2")})`,
                      transform: "translate(66.000000, 51.500000) scale(-1, 1) translate(-66.000000, -51.500000) ",
                      points: "62 45 79 45 70 58 53 58"
                    }, null, 8, ["fill"])
                  ])
                ])
              ])
            ]);
          };
        }
      });
      var ImgEmpty = /* @__PURE__ */ _export_sfc$1(_sfc_main$d, [["__file", "img-empty.vue"]]);
      const emptyProps = buildProps({
        image: {
          type: String,
          default: ""
        },
        imageSize: Number,
        description: {
          type: String,
          default: ""
        }
      });
      const __default__$3 = vue.defineComponent({
        name: "ElEmpty"
      });
      const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
        ...__default__$3,
        props: emptyProps,
        setup(__props) {
          const props = __props;
          const { t } = useLocale();
          const ns = useNamespace("empty");
          const emptyDescription = vue.computed(() => props.description || t("el.table.emptyText"));
          const imageStyle = vue.computed(() => ({
            width: addUnit(props.imageSize)
          }));
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              class: vue.normalizeClass(vue.unref(ns).b())
            }, [
              vue.createElementVNode("div", {
                class: vue.normalizeClass(vue.unref(ns).e("image")),
                style: vue.normalizeStyle(vue.unref(imageStyle))
              }, [
                _ctx.image ? (vue.openBlock(), vue.createElementBlock("img", {
                  key: 0,
                  src: _ctx.image,
                  ondragstart: "return false"
                }, null, 8, ["src"])) : vue.renderSlot(_ctx.$slots, "image", { key: 1 }, () => [
                  vue.createVNode(ImgEmpty)
                ])
              ], 6),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(vue.unref(ns).e("description"))
              }, [
                _ctx.$slots.description ? vue.renderSlot(_ctx.$slots, "description", { key: 0 }) : (vue.openBlock(), vue.createElementBlock("p", { key: 1 }, vue.toDisplayString(vue.unref(emptyDescription)), 1))
              ], 2),
              _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: vue.normalizeClass(vue.unref(ns).e("bottom"))
              }, [
                vue.renderSlot(_ctx.$slots, "default")
              ], 2)) : vue.createCommentVNode("v-if", true)
            ], 2);
          };
        }
      });
      var Empty = /* @__PURE__ */ _export_sfc$1(_sfc_main$c, [["__file", "empty.vue"]]);
      const ElEmpty = withInstall(Empty);
      const inputNumberProps = buildProps({
        id: {
          type: String,
          default: void 0
        },
        step: {
          type: Number,
          default: 1
        },
        stepStrictly: Boolean,
        max: {
          type: Number,
          default: Number.POSITIVE_INFINITY
        },
        min: {
          type: Number,
          default: Number.NEGATIVE_INFINITY
        },
        modelValue: Number,
        readonly: Boolean,
        disabled: Boolean,
        size: useSizeProp,
        controls: {
          type: Boolean,
          default: true
        },
        controlsPosition: {
          type: String,
          default: "",
          values: ["", "right"]
        },
        valueOnClear: {
          type: [String, Number, null],
          validator: (val) => val === null || isNumber(val) || ["min", "max"].includes(val),
          default: null
        },
        name: String,
        placeholder: String,
        precision: {
          type: Number,
          validator: (val) => val >= 0 && val === Number.parseInt(`${val}`, 10)
        },
        validateEvent: {
          type: Boolean,
          default: true
        },
        ...useAriaProps(["ariaLabel"])
      });
      const inputNumberEmits = {
        [CHANGE_EVENT]: (cur, prev) => prev !== cur,
        blur: (e) => e instanceof FocusEvent,
        focus: (e) => e instanceof FocusEvent,
        [INPUT_EVENT]: (val) => isNumber(val) || isNil(val),
        [UPDATE_MODEL_EVENT]: (val) => isNumber(val) || isNil(val)
      };
      const __default__$2 = vue.defineComponent({
        name: "ElInputNumber"
      });
      const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
        ...__default__$2,
        props: inputNumberProps,
        emits: inputNumberEmits,
        setup(__props, { expose, emit }) {
          const props = __props;
          const { t } = useLocale();
          const ns = useNamespace("input-number");
          const input = vue.ref();
          const data = vue.reactive({
            currentValue: props.modelValue,
            userInput: null
          });
          const { formItem } = useFormItem();
          const minDisabled = vue.computed(() => isNumber(props.modelValue) && props.modelValue <= props.min);
          const maxDisabled = vue.computed(() => isNumber(props.modelValue) && props.modelValue >= props.max);
          const numPrecision = vue.computed(() => {
            const stepPrecision = getPrecision(props.step);
            if (!isUndefined(props.precision)) {
              if (stepPrecision > props.precision) ;
              return props.precision;
            } else {
              return Math.max(getPrecision(props.modelValue), stepPrecision);
            }
          });
          const controlsAtRight = vue.computed(() => {
            return props.controls && props.controlsPosition === "right";
          });
          const inputNumberSize = useFormSize();
          const inputNumberDisabled = useFormDisabled();
          const displayValue = vue.computed(() => {
            if (data.userInput !== null) {
              return data.userInput;
            }
            let currentValue = data.currentValue;
            if (isNil(currentValue))
              return "";
            if (isNumber(currentValue)) {
              if (Number.isNaN(currentValue))
                return "";
              if (!isUndefined(props.precision)) {
                currentValue = currentValue.toFixed(props.precision);
              }
            }
            return currentValue;
          });
          const toPrecision = (num, pre) => {
            if (isUndefined(pre))
              pre = numPrecision.value;
            if (pre === 0)
              return Math.round(num);
            let snum = String(num);
            const pointPos = snum.indexOf(".");
            if (pointPos === -1)
              return num;
            const nums = snum.replace(".", "").split("");
            const datum = nums[pointPos + pre];
            if (!datum)
              return num;
            const length = snum.length;
            if (snum.charAt(length - 1) === "5") {
              snum = `${snum.slice(0, Math.max(0, length - 1))}6`;
            }
            return Number.parseFloat(Number(snum).toFixed(pre));
          };
          const getPrecision = (value) => {
            if (isNil(value))
              return 0;
            const valueString = value.toString();
            const dotPosition = valueString.indexOf(".");
            let precision = 0;
            if (dotPosition !== -1) {
              precision = valueString.length - dotPosition - 1;
            }
            return precision;
          };
          const ensurePrecision = (val, coefficient = 1) => {
            if (!isNumber(val))
              return data.currentValue;
            return toPrecision(val + props.step * coefficient);
          };
          const increase = () => {
            if (props.readonly || inputNumberDisabled.value || maxDisabled.value)
              return;
            const value = Number(displayValue.value) || 0;
            const newVal = ensurePrecision(value);
            setCurrentValue(newVal);
            emit(INPUT_EVENT, data.currentValue);
            setCurrentValueToModelValue();
          };
          const decrease = () => {
            if (props.readonly || inputNumberDisabled.value || minDisabled.value)
              return;
            const value = Number(displayValue.value) || 0;
            const newVal = ensurePrecision(value, -1);
            setCurrentValue(newVal);
            emit(INPUT_EVENT, data.currentValue);
            setCurrentValueToModelValue();
          };
          const verifyValue = (value, update) => {
            const { max, min, step, precision, stepStrictly, valueOnClear } = props;
            if (max < min) {
              throwError("InputNumber", "min should not be greater than max.");
            }
            let newVal = Number(value);
            if (isNil(value) || Number.isNaN(newVal)) {
              return null;
            }
            if (value === "") {
              if (valueOnClear === null) {
                return null;
              }
              newVal = isString(valueOnClear) ? { min, max }[valueOnClear] : valueOnClear;
            }
            if (stepStrictly) {
              newVal = toPrecision(Math.round(newVal / step) * step, precision);
              if (newVal !== value) {
                update && emit(UPDATE_MODEL_EVENT, newVal);
              }
            }
            if (!isUndefined(precision)) {
              newVal = toPrecision(newVal, precision);
            }
            if (newVal > max || newVal < min) {
              newVal = newVal > max ? max : min;
              update && emit(UPDATE_MODEL_EVENT, newVal);
            }
            return newVal;
          };
          const setCurrentValue = (value, emitChange = true) => {
            var _a2;
            const oldVal = data.currentValue;
            const newVal = verifyValue(value);
            if (!emitChange) {
              emit(UPDATE_MODEL_EVENT, newVal);
              return;
            }
            if (oldVal === newVal && value)
              return;
            data.userInput = null;
            emit(UPDATE_MODEL_EVENT, newVal);
            if (oldVal !== newVal) {
              emit(CHANGE_EVENT, newVal, oldVal);
            }
            if (props.validateEvent) {
              (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "change").catch((err) => debugWarn());
            }
            data.currentValue = newVal;
          };
          const handleInput = (value) => {
            data.userInput = value;
            const newVal = value === "" ? null : Number(value);
            emit(INPUT_EVENT, newVal);
            setCurrentValue(newVal, false);
          };
          const handleInputChange = (value) => {
            const newVal = value !== "" ? Number(value) : "";
            if (isNumber(newVal) && !Number.isNaN(newVal) || value === "") {
              setCurrentValue(newVal);
            }
            setCurrentValueToModelValue();
            data.userInput = null;
          };
          const focus = () => {
            var _a2, _b;
            (_b = (_a2 = input.value) == null ? void 0 : _a2.focus) == null ? void 0 : _b.call(_a2);
          };
          const blur = () => {
            var _a2, _b;
            (_b = (_a2 = input.value) == null ? void 0 : _a2.blur) == null ? void 0 : _b.call(_a2);
          };
          const handleFocus = (event) => {
            emit("focus", event);
          };
          const handleBlur = (event) => {
            var _a2;
            data.userInput = null;
            emit("blur", event);
            if (props.validateEvent) {
              (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "blur").catch((err) => debugWarn());
            }
          };
          const setCurrentValueToModelValue = () => {
            if (data.currentValue !== props.modelValue) {
              data.currentValue = props.modelValue;
            }
          };
          const handleWheel = (e) => {
            if (document.activeElement === e.target)
              e.preventDefault();
          };
          vue.watch(() => props.modelValue, (value, oldValue) => {
            const newValue = verifyValue(value, true);
            if (data.userInput === null && newValue !== oldValue) {
              data.currentValue = newValue;
            }
          }, { immediate: true });
          vue.onMounted(() => {
            var _a2;
            const { min, max, modelValue } = props;
            const innerInput = (_a2 = input.value) == null ? void 0 : _a2.input;
            innerInput.setAttribute("role", "spinbutton");
            if (Number.isFinite(max)) {
              innerInput.setAttribute("aria-valuemax", String(max));
            } else {
              innerInput.removeAttribute("aria-valuemax");
            }
            if (Number.isFinite(min)) {
              innerInput.setAttribute("aria-valuemin", String(min));
            } else {
              innerInput.removeAttribute("aria-valuemin");
            }
            innerInput.setAttribute("aria-valuenow", data.currentValue || data.currentValue === 0 ? String(data.currentValue) : "");
            innerInput.setAttribute("aria-disabled", String(inputNumberDisabled.value));
            if (!isNumber(modelValue) && modelValue != null) {
              let val = Number(modelValue);
              if (Number.isNaN(val)) {
                val = null;
              }
              emit(UPDATE_MODEL_EVENT, val);
            }
            innerInput.addEventListener("wheel", handleWheel, { passive: false });
          });
          vue.onUpdated(() => {
            var _a2, _b;
            const innerInput = (_a2 = input.value) == null ? void 0 : _a2.input;
            innerInput == null ? void 0 : innerInput.setAttribute("aria-valuenow", `${(_b = data.currentValue) != null ? _b : ""}`);
          });
          expose({
            focus,
            blur
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              class: vue.normalizeClass([
                vue.unref(ns).b(),
                vue.unref(ns).m(vue.unref(inputNumberSize)),
                vue.unref(ns).is("disabled", vue.unref(inputNumberDisabled)),
                vue.unref(ns).is("without-controls", !_ctx.controls),
                vue.unref(ns).is("controls-right", vue.unref(controlsAtRight))
              ]),
              onDragstart: vue.withModifiers(() => {
              }, ["prevent"])
            }, [
              _ctx.controls ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                role: "button",
                "aria-label": vue.unref(t)("el.inputNumber.decrease"),
                class: vue.normalizeClass([vue.unref(ns).e("decrease"), vue.unref(ns).is("disabled", vue.unref(minDisabled))]),
                onKeydown: vue.withKeys(decrease, ["enter"])
              }, [
                vue.renderSlot(_ctx.$slots, "decrease-icon", {}, () => [
                  vue.createVNode(vue.unref(ElIcon), null, {
                    default: vue.withCtx(() => [
                      vue.unref(controlsAtRight) ? (vue.openBlock(), vue.createBlock(vue.unref(arrow_down_default), { key: 0 })) : (vue.openBlock(), vue.createBlock(vue.unref(minus_default), { key: 1 }))
                    ]),
                    _: 1
                  })
                ])
              ], 42, ["aria-label", "onKeydown"])), [
                [vue.unref(vRepeatClick), decrease]
              ]) : vue.createCommentVNode("v-if", true),
              _ctx.controls ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("span", {
                key: 1,
                role: "button",
                "aria-label": vue.unref(t)("el.inputNumber.increase"),
                class: vue.normalizeClass([vue.unref(ns).e("increase"), vue.unref(ns).is("disabled", vue.unref(maxDisabled))]),
                onKeydown: vue.withKeys(increase, ["enter"])
              }, [
                vue.renderSlot(_ctx.$slots, "increase-icon", {}, () => [
                  vue.createVNode(vue.unref(ElIcon), null, {
                    default: vue.withCtx(() => [
                      vue.unref(controlsAtRight) ? (vue.openBlock(), vue.createBlock(vue.unref(arrow_up_default), { key: 0 })) : (vue.openBlock(), vue.createBlock(vue.unref(plus_default), { key: 1 }))
                    ]),
                    _: 1
                  })
                ])
              ], 42, ["aria-label", "onKeydown"])), [
                [vue.unref(vRepeatClick), increase]
              ]) : vue.createCommentVNode("v-if", true),
              vue.createVNode(vue.unref(ElInput), {
                id: _ctx.id,
                ref_key: "input",
                ref: input,
                type: "number",
                step: _ctx.step,
                "model-value": vue.unref(displayValue),
                placeholder: _ctx.placeholder,
                readonly: _ctx.readonly,
                disabled: vue.unref(inputNumberDisabled),
                size: vue.unref(inputNumberSize),
                max: _ctx.max,
                min: _ctx.min,
                name: _ctx.name,
                "aria-label": _ctx.ariaLabel,
                "validate-event": false,
                onKeydown: [
                  vue.withKeys(vue.withModifiers(increase, ["prevent"]), ["up"]),
                  vue.withKeys(vue.withModifiers(decrease, ["prevent"]), ["down"])
                ],
                onBlur: handleBlur,
                onFocus: handleFocus,
                onInput: handleInput,
                onChange: handleInputChange
              }, vue.createSlots({
                _: 2
              }, [
                _ctx.$slots.prefix ? {
                  name: "prefix",
                  fn: vue.withCtx(() => [
                    vue.renderSlot(_ctx.$slots, "prefix")
                  ])
                } : void 0,
                _ctx.$slots.suffix ? {
                  name: "suffix",
                  fn: vue.withCtx(() => [
                    vue.renderSlot(_ctx.$slots, "suffix")
                  ])
                } : void 0
              ]), 1032, ["id", "step", "model-value", "placeholder", "readonly", "disabled", "size", "max", "min", "name", "aria-label", "onKeydown"])
            ], 42, ["onDragstart"]);
          };
        }
      });
      var InputNumber = /* @__PURE__ */ _export_sfc$1(_sfc_main$b, [["__file", "input-number.vue"]]);
      const ElInputNumber = withInstall(InputNumber);
      const selectGroupKey = Symbol("ElSelectGroup");
      const selectKey = Symbol("ElSelect");
      function useOption(props, states) {
        const select = vue.inject(selectKey);
        const selectGroup = vue.inject(selectGroupKey, { disabled: false });
        const itemSelected = vue.computed(() => {
          return contains(castArray(select.props.modelValue), props.value);
        });
        const limitReached = vue.computed(() => {
          var _a2;
          if (select.props.multiple) {
            const modelValue = castArray((_a2 = select.props.modelValue) != null ? _a2 : []);
            return !itemSelected.value && modelValue.length >= select.props.multipleLimit && select.props.multipleLimit > 0;
          } else {
            return false;
          }
        });
        const currentLabel = vue.computed(() => {
          return props.label || (isObject$1(props.value) ? "" : props.value);
        });
        const currentValue = vue.computed(() => {
          return props.value || props.label || "";
        });
        const isDisabled = vue.computed(() => {
          return props.disabled || states.groupDisabled || limitReached.value;
        });
        const instance = vue.getCurrentInstance();
        const contains = (arr = [], target) => {
          if (!isObject$1(props.value)) {
            return arr && arr.includes(target);
          } else {
            const valueKey = select.props.valueKey;
            return arr && arr.some((item) => {
              return vue.toRaw(get(item, valueKey)) === get(target, valueKey);
            });
          }
        };
        const hoverItem = () => {
          if (!props.disabled && !selectGroup.disabled) {
            select.states.hoveringIndex = select.optionsArray.indexOf(instance.proxy);
          }
        };
        const updateOption = (query) => {
          const regexp = new RegExp(escapeStringRegexp(query), "i");
          states.visible = regexp.test(currentLabel.value) || props.created;
        };
        vue.watch(() => currentLabel.value, () => {
          if (!props.created && !select.props.remote)
            select.setSelected();
        });
        vue.watch(() => props.value, (val, oldVal) => {
          const { remote, valueKey } = select.props;
          if (val !== oldVal) {
            select.onOptionDestroy(oldVal, instance.proxy);
            select.onOptionCreate(instance.proxy);
          }
          if (!props.created && !remote) {
            if (valueKey && isObject$1(val) && isObject$1(oldVal) && val[valueKey] === oldVal[valueKey]) {
              return;
            }
            select.setSelected();
          }
        });
        vue.watch(() => selectGroup.disabled, () => {
          states.groupDisabled = selectGroup.disabled;
        }, { immediate: true });
        return {
          select,
          currentLabel,
          currentValue,
          itemSelected,
          isDisabled,
          hoverItem,
          updateOption
        };
      }
      const _sfc_main$a = vue.defineComponent({
        name: "ElOption",
        componentName: "ElOption",
        props: {
          value: {
            required: true,
            type: [String, Number, Boolean, Object]
          },
          label: [String, Number],
          created: Boolean,
          disabled: Boolean
        },
        setup(props) {
          const ns = useNamespace("select");
          const id = useId();
          const containerKls = vue.computed(() => [
            ns.be("dropdown", "item"),
            ns.is("disabled", vue.unref(isDisabled)),
            ns.is("selected", vue.unref(itemSelected)),
            ns.is("hovering", vue.unref(hover))
          ]);
          const states = vue.reactive({
            index: -1,
            groupDisabled: false,
            visible: true,
            hover: false
          });
          const {
            currentLabel,
            itemSelected,
            isDisabled,
            select,
            hoverItem,
            updateOption
          } = useOption(props, states);
          const { visible, hover } = vue.toRefs(states);
          const vm = vue.getCurrentInstance().proxy;
          select.onOptionCreate(vm);
          vue.onBeforeUnmount(() => {
            const key = vm.value;
            const { selected } = select.states;
            const selectedOptions = select.props.multiple ? selected : [selected];
            const doesSelected = selectedOptions.some((item) => {
              return item.value === vm.value;
            });
            vue.nextTick(() => {
              if (select.states.cachedOptions.get(key) === vm && !doesSelected) {
                select.states.cachedOptions.delete(key);
              }
            });
            select.onOptionDestroy(key, vm);
          });
          function selectOptionClick() {
            if (!isDisabled.value) {
              select.handleOptionSelect(vm);
            }
          }
          return {
            ns,
            id,
            containerKls,
            currentLabel,
            itemSelected,
            isDisabled,
            select,
            hoverItem,
            updateOption,
            visible,
            hover,
            selectOptionClick,
            states
          };
        }
      });
      function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("li", {
          id: _ctx.id,
          class: vue.normalizeClass(_ctx.containerKls),
          role: "option",
          "aria-disabled": _ctx.isDisabled || void 0,
          "aria-selected": _ctx.itemSelected,
          onMousemove: _ctx.hoverItem,
          onClick: vue.withModifiers(_ctx.selectOptionClick, ["stop"])
        }, [
          vue.renderSlot(_ctx.$slots, "default", {}, () => [
            vue.createElementVNode("span", null, vue.toDisplayString(_ctx.currentLabel), 1)
          ])
        ], 42, ["id", "aria-disabled", "aria-selected", "onMousemove", "onClick"])), [
          [vue.vShow, _ctx.visible]
        ]);
      }
      var Option = /* @__PURE__ */ _export_sfc$1(_sfc_main$a, [["render", _sfc_render$3], ["__file", "option.vue"]]);
      const _sfc_main$9 = vue.defineComponent({
        name: "ElSelectDropdown",
        componentName: "ElSelectDropdown",
        setup() {
          const select = vue.inject(selectKey);
          const ns = useNamespace("select");
          const popperClass = vue.computed(() => select.props.popperClass);
          const isMultiple = vue.computed(() => select.props.multiple);
          const isFitInputWidth = vue.computed(() => select.props.fitInputWidth);
          const minWidth = vue.ref("");
          function updateMinWidth() {
            var _a2;
            minWidth.value = `${(_a2 = select.selectRef) == null ? void 0 : _a2.offsetWidth}px`;
          }
          vue.onMounted(() => {
            updateMinWidth();
            useResizeObserver(select.selectRef, updateMinWidth);
          });
          return {
            ns,
            minWidth,
            popperClass,
            isMultiple,
            isFitInputWidth
          };
        }
      });
      function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass([_ctx.ns.b("dropdown"), _ctx.ns.is("multiple", _ctx.isMultiple), _ctx.popperClass]),
          style: vue.normalizeStyle({ [_ctx.isFitInputWidth ? "width" : "minWidth"]: _ctx.minWidth })
        }, [
          _ctx.$slots.header ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(_ctx.ns.be("dropdown", "header"))
          }, [
            vue.renderSlot(_ctx.$slots, "header")
          ], 2)) : vue.createCommentVNode("v-if", true),
          vue.renderSlot(_ctx.$slots, "default"),
          _ctx.$slots.footer ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            class: vue.normalizeClass(_ctx.ns.be("dropdown", "footer"))
          }, [
            vue.renderSlot(_ctx.$slots, "footer")
          ], 2)) : vue.createCommentVNode("v-if", true)
        ], 6);
      }
      var ElSelectMenu = /* @__PURE__ */ _export_sfc$1(_sfc_main$9, [["render", _sfc_render$2], ["__file", "select-dropdown.vue"]]);
      const MINIMUM_INPUT_WIDTH = 11;
      const useSelect = (props, emit) => {
        const { t } = useLocale();
        const contentId = useId();
        const nsSelect = useNamespace("select");
        const nsInput = useNamespace("input");
        const states = vue.reactive({
          inputValue: "",
          options: /* @__PURE__ */ new Map(),
          cachedOptions: /* @__PURE__ */ new Map(),
          optionValues: [],
          selected: [],
          selectionWidth: 0,
          calculatorWidth: 0,
          collapseItemWidth: 0,
          selectedLabel: "",
          hoveringIndex: -1,
          previousQuery: null,
          inputHovering: false,
          menuVisibleOnFocus: false,
          isBeforeHide: false
        });
        const selectRef = vue.ref(null);
        const selectionRef = vue.ref(null);
        const tooltipRef = vue.ref(null);
        const tagTooltipRef = vue.ref(null);
        const inputRef = vue.ref(null);
        const calculatorRef = vue.ref(null);
        const prefixRef = vue.ref(null);
        const suffixRef = vue.ref(null);
        const menuRef = vue.ref(null);
        const tagMenuRef = vue.ref(null);
        const collapseItemRef = vue.ref(null);
        const scrollbarRef = vue.ref(null);
        const {
          isComposing,
          handleCompositionStart,
          handleCompositionUpdate,
          handleCompositionEnd
        } = useComposition({
          afterComposition: (e) => onInput(e)
        });
        const { wrapperRef, isFocused, handleBlur } = useFocusController(inputRef, {
          beforeFocus() {
            return selectDisabled.value;
          },
          afterFocus() {
            if (props.automaticDropdown && !expanded.value) {
              expanded.value = true;
              states.menuVisibleOnFocus = true;
            }
          },
          beforeBlur(event) {
            var _a2, _b;
            return ((_a2 = tooltipRef.value) == null ? void 0 : _a2.isFocusInsideContent(event)) || ((_b = tagTooltipRef.value) == null ? void 0 : _b.isFocusInsideContent(event));
          },
          afterBlur() {
            expanded.value = false;
            states.menuVisibleOnFocus = false;
          }
        });
        const expanded = vue.ref(false);
        const hoverOption = vue.ref();
        const { form, formItem } = useFormItem();
        const { inputId } = useFormItemInputId(props, {
          formItemContext: formItem
        });
        const { valueOnClear, isEmptyValue: isEmptyValue2 } = useEmptyValues(props);
        const selectDisabled = vue.computed(() => props.disabled || (form == null ? void 0 : form.disabled));
        const hasModelValue = vue.computed(() => {
          return isArray$1(props.modelValue) ? props.modelValue.length > 0 : !isEmptyValue2(props.modelValue);
        });
        const needStatusIcon = vue.computed(() => {
          var _a2;
          return (_a2 = form == null ? void 0 : form.statusIcon) != null ? _a2 : false;
        });
        const showClose = vue.computed(() => {
          return props.clearable && !selectDisabled.value && states.inputHovering && hasModelValue.value;
        });
        const iconComponent = vue.computed(() => props.remote && props.filterable && !props.remoteShowSuffix ? "" : props.suffixIcon);
        const iconReverse = vue.computed(() => nsSelect.is("reverse", iconComponent.value && expanded.value));
        const validateState = vue.computed(() => (formItem == null ? void 0 : formItem.validateState) || "");
        const validateIcon = vue.computed(() => ValidateComponentsMap[validateState.value]);
        const debounce$1 = vue.computed(() => props.remote ? 300 : 0);
        const emptyText = vue.computed(() => {
          if (props.loading) {
            return props.loadingText || t("el.select.loading");
          } else {
            if (props.remote && !states.inputValue && states.options.size === 0)
              return false;
            if (props.filterable && states.inputValue && states.options.size > 0 && filteredOptionsCount.value === 0) {
              return props.noMatchText || t("el.select.noMatch");
            }
            if (states.options.size === 0) {
              return props.noDataText || t("el.select.noData");
            }
          }
          return null;
        });
        const filteredOptionsCount = vue.computed(() => optionsArray.value.filter((option) => option.visible).length);
        const optionsArray = vue.computed(() => {
          const list = Array.from(states.options.values());
          const newList = [];
          states.optionValues.forEach((item) => {
            const index = list.findIndex((i) => i.value === item);
            if (index > -1) {
              newList.push(list[index]);
            }
          });
          return newList.length >= list.length ? newList : list;
        });
        const cachedOptionsArray = vue.computed(() => Array.from(states.cachedOptions.values()));
        const showNewOption = vue.computed(() => {
          const hasExistingOption = optionsArray.value.filter((option) => {
            return !option.created;
          }).some((option) => {
            return option.currentLabel === states.inputValue;
          });
          return props.filterable && props.allowCreate && states.inputValue !== "" && !hasExistingOption;
        });
        const updateOptions = () => {
          if (props.filterable && isFunction$1(props.filterMethod))
            return;
          if (props.filterable && props.remote && isFunction$1(props.remoteMethod))
            return;
          optionsArray.value.forEach((option) => {
            var _a2;
            (_a2 = option.updateOption) == null ? void 0 : _a2.call(option, states.inputValue);
          });
        };
        const selectSize = useFormSize();
        const collapseTagSize = vue.computed(() => ["small"].includes(selectSize.value) ? "small" : "default");
        const dropdownMenuVisible = vue.computed({
          get() {
            return expanded.value && emptyText.value !== false;
          },
          set(val) {
            expanded.value = val;
          }
        });
        const shouldShowPlaceholder = vue.computed(() => {
          if (props.multiple && !isUndefined(props.modelValue)) {
            return castArray(props.modelValue).length === 0 && !states.inputValue;
          }
          const value = isArray$1(props.modelValue) ? props.modelValue[0] : props.modelValue;
          return props.filterable || isUndefined(value) ? !states.inputValue : true;
        });
        const currentPlaceholder = vue.computed(() => {
          var _a2;
          const _placeholder = (_a2 = props.placeholder) != null ? _a2 : t("el.select.placeholder");
          return props.multiple || !hasModelValue.value ? _placeholder : states.selectedLabel;
        });
        const mouseEnterEventName = vue.computed(() => isIOS ? null : "mouseenter");
        vue.watch(() => props.modelValue, (val, oldVal) => {
          if (props.multiple) {
            if (props.filterable && !props.reserveKeyword) {
              states.inputValue = "";
              handleQueryChange("");
            }
          }
          setSelected();
          if (!isEqual(val, oldVal) && props.validateEvent) {
            formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn());
          }
        }, {
          flush: "post",
          deep: true
        });
        vue.watch(() => expanded.value, (val) => {
          if (val) {
            handleQueryChange(states.inputValue);
          } else {
            states.inputValue = "";
            states.previousQuery = null;
            states.isBeforeHide = true;
          }
          emit("visible-change", val);
        });
        vue.watch(() => states.options.entries(), () => {
          var _a2;
          if (!isClient)
            return;
          const inputs = ((_a2 = selectRef.value) == null ? void 0 : _a2.querySelectorAll("input")) || [];
          if (!props.filterable && !props.defaultFirstOption && !isUndefined(props.modelValue) || !Array.from(inputs).includes(document.activeElement)) {
            setSelected();
          }
          if (props.defaultFirstOption && (props.filterable || props.remote) && filteredOptionsCount.value) {
            checkDefaultFirstOption();
          }
        }, {
          flush: "post"
        });
        vue.watch(() => states.hoveringIndex, (val) => {
          if (isNumber(val) && val > -1) {
            hoverOption.value = optionsArray.value[val] || {};
          } else {
            hoverOption.value = {};
          }
          optionsArray.value.forEach((option) => {
            option.hover = hoverOption.value === option;
          });
        });
        vue.watchEffect(() => {
          if (states.isBeforeHide)
            return;
          updateOptions();
        });
        const handleQueryChange = (val) => {
          if (states.previousQuery === val || isComposing.value) {
            return;
          }
          states.previousQuery = val;
          if (props.filterable && isFunction$1(props.filterMethod)) {
            props.filterMethod(val);
          } else if (props.filterable && props.remote && isFunction$1(props.remoteMethod)) {
            props.remoteMethod(val);
          }
          if (props.defaultFirstOption && (props.filterable || props.remote) && filteredOptionsCount.value) {
            vue.nextTick(checkDefaultFirstOption);
          } else {
            vue.nextTick(updateHoveringIndex);
          }
        };
        const checkDefaultFirstOption = () => {
          const optionsInDropdown = optionsArray.value.filter((n) => n.visible && !n.disabled && !n.states.groupDisabled);
          const userCreatedOption = optionsInDropdown.find((n) => n.created);
          const firstOriginOption = optionsInDropdown[0];
          const valueList = optionsArray.value.map((item) => item.value);
          states.hoveringIndex = getValueIndex(valueList, userCreatedOption || firstOriginOption);
        };
        const setSelected = () => {
          if (!props.multiple) {
            const value = isArray$1(props.modelValue) ? props.modelValue[0] : props.modelValue;
            const option = getOption(value);
            states.selectedLabel = option.currentLabel;
            states.selected = [option];
            return;
          } else {
            states.selectedLabel = "";
          }
          const result = [];
          if (!isUndefined(props.modelValue)) {
            castArray(props.modelValue).forEach((value) => {
              result.push(getOption(value));
            });
          }
          states.selected = result;
        };
        const getOption = (value) => {
          let option;
          const isObjectValue = isPlainObject(value);
          for (let i = states.cachedOptions.size - 1; i >= 0; i--) {
            const cachedOption = cachedOptionsArray.value[i];
            const isEqualValue = isObjectValue ? get(cachedOption.value, props.valueKey) === get(value, props.valueKey) : cachedOption.value === value;
            if (isEqualValue) {
              option = {
                value,
                currentLabel: cachedOption.currentLabel,
                get isDisabled() {
                  return cachedOption.isDisabled;
                }
              };
              break;
            }
          }
          if (option)
            return option;
          const label = isObjectValue ? value.label : value != null ? value : "";
          const newOption = {
            value,
            currentLabel: label
          };
          return newOption;
        };
        const updateHoveringIndex = () => {
          states.hoveringIndex = optionsArray.value.findIndex((item) => states.selected.some((selected) => getValueKey(selected) === getValueKey(item)));
        };
        const resetSelectionWidth = () => {
          states.selectionWidth = selectionRef.value.getBoundingClientRect().width;
        };
        const resetCalculatorWidth = () => {
          states.calculatorWidth = calculatorRef.value.getBoundingClientRect().width;
        };
        const resetCollapseItemWidth = () => {
          states.collapseItemWidth = collapseItemRef.value.getBoundingClientRect().width;
        };
        const updateTooltip = () => {
          var _a2, _b;
          (_b = (_a2 = tooltipRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
        };
        const updateTagTooltip = () => {
          var _a2, _b;
          (_b = (_a2 = tagTooltipRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
        };
        const onInputChange = () => {
          if (states.inputValue.length > 0 && !expanded.value) {
            expanded.value = true;
          }
          handleQueryChange(states.inputValue);
        };
        const onInput = (event) => {
          states.inputValue = event.target.value;
          if (props.remote) {
            debouncedOnInputChange();
          } else {
            return onInputChange();
          }
        };
        const debouncedOnInputChange = debounce(() => {
          onInputChange();
        }, debounce$1.value);
        const emitChange = (val) => {
          if (!isEqual(props.modelValue, val)) {
            emit(CHANGE_EVENT, val);
          }
        };
        const getLastNotDisabledIndex = (value) => findLastIndex(value, (it2) => {
          const option = states.cachedOptions.get(it2);
          return option && !option.disabled && !option.states.groupDisabled;
        });
        const deletePrevTag = (e) => {
          if (!props.multiple)
            return;
          if (e.code === EVENT_CODE.delete)
            return;
          if (e.target.value.length <= 0) {
            const value = castArray(props.modelValue).slice();
            const lastNotDisabledIndex = getLastNotDisabledIndex(value);
            if (lastNotDisabledIndex < 0)
              return;
            const removeTagValue = value[lastNotDisabledIndex];
            value.splice(lastNotDisabledIndex, 1);
            emit(UPDATE_MODEL_EVENT, value);
            emitChange(value);
            emit("remove-tag", removeTagValue);
          }
        };
        const deleteTag = (event, tag) => {
          const index = states.selected.indexOf(tag);
          if (index > -1 && !selectDisabled.value) {
            const value = castArray(props.modelValue).slice();
            value.splice(index, 1);
            emit(UPDATE_MODEL_EVENT, value);
            emitChange(value);
            emit("remove-tag", tag.value);
          }
          event.stopPropagation();
          focus();
        };
        const deleteSelected = (event) => {
          event.stopPropagation();
          const value = props.multiple ? [] : valueOnClear.value;
          if (props.multiple) {
            for (const item of states.selected) {
              if (item.isDisabled)
                value.push(item.value);
            }
          }
          emit(UPDATE_MODEL_EVENT, value);
          emitChange(value);
          states.hoveringIndex = -1;
          expanded.value = false;
          emit("clear");
          focus();
        };
        const handleOptionSelect = (option) => {
          var _a2;
          if (props.multiple) {
            const value = castArray((_a2 = props.modelValue) != null ? _a2 : []).slice();
            const optionIndex = getValueIndex(value, option);
            if (optionIndex > -1) {
              value.splice(optionIndex, 1);
            } else if (props.multipleLimit <= 0 || value.length < props.multipleLimit) {
              value.push(option.value);
            }
            emit(UPDATE_MODEL_EVENT, value);
            emitChange(value);
            if (option.created) {
              handleQueryChange("");
            }
            if (props.filterable && !props.reserveKeyword) {
              states.inputValue = "";
            }
          } else {
            emit(UPDATE_MODEL_EVENT, option.value);
            emitChange(option.value);
            expanded.value = false;
          }
          focus();
          if (expanded.value)
            return;
          vue.nextTick(() => {
            scrollToOption(option);
          });
        };
        const getValueIndex = (arr = [], option) => {
          if (isUndefined(option))
            return -1;
          if (!isObject$1(option.value))
            return arr.indexOf(option.value);
          return arr.findIndex((item) => {
            return isEqual(get(item, props.valueKey), getValueKey(option));
          });
        };
        const scrollToOption = (option) => {
          var _a2, _b, _c, _d, _e;
          const targetOption = isArray$1(option) ? option[0] : option;
          let target = null;
          if (targetOption == null ? void 0 : targetOption.value) {
            const options = optionsArray.value.filter((item) => item.value === targetOption.value);
            if (options.length > 0) {
              target = options[0].$el;
            }
          }
          if (tooltipRef.value && target) {
            const menu = (_d = (_c = (_b = (_a2 = tooltipRef.value) == null ? void 0 : _a2.popperRef) == null ? void 0 : _b.contentRef) == null ? void 0 : _c.querySelector) == null ? void 0 : _d.call(_c, `.${nsSelect.be("dropdown", "wrap")}`);
            if (menu) {
              scrollIntoView(menu, target);
            }
          }
          (_e = scrollbarRef.value) == null ? void 0 : _e.handleScroll();
        };
        const onOptionCreate = (vm) => {
          states.options.set(vm.value, vm);
          states.cachedOptions.set(vm.value, vm);
        };
        const onOptionDestroy = (key, vm) => {
          if (states.options.get(key) === vm) {
            states.options.delete(key);
          }
        };
        const popperRef = vue.computed(() => {
          var _a2, _b;
          return (_b = (_a2 = tooltipRef.value) == null ? void 0 : _a2.popperRef) == null ? void 0 : _b.contentRef;
        });
        const handleMenuEnter = () => {
          states.isBeforeHide = false;
          vue.nextTick(() => scrollToOption(states.selected));
        };
        const focus = () => {
          var _a2;
          (_a2 = inputRef.value) == null ? void 0 : _a2.focus();
        };
        const blur = () => {
          var _a2;
          if (expanded.value) {
            expanded.value = false;
            vue.nextTick(() => {
              var _a22;
              return (_a22 = inputRef.value) == null ? void 0 : _a22.blur();
            });
            return;
          }
          (_a2 = inputRef.value) == null ? void 0 : _a2.blur();
        };
        const handleClearClick = (event) => {
          deleteSelected(event);
        };
        const handleClickOutside = (event) => {
          expanded.value = false;
          if (isFocused.value) {
            const _event2 = new FocusEvent("focus", event);
            vue.nextTick(() => handleBlur(_event2));
          }
        };
        const handleEsc = () => {
          if (states.inputValue.length > 0) {
            states.inputValue = "";
          } else {
            expanded.value = false;
          }
        };
        const toggleMenu = () => {
          if (selectDisabled.value)
            return;
          if (isIOS)
            states.inputHovering = true;
          if (states.menuVisibleOnFocus) {
            states.menuVisibleOnFocus = false;
          } else {
            expanded.value = !expanded.value;
          }
        };
        const selectOption = () => {
          if (!expanded.value) {
            toggleMenu();
          } else {
            const option = optionsArray.value[states.hoveringIndex];
            if (option && !option.disabled && !option.states.groupDisabled) {
              handleOptionSelect(option);
            }
          }
        };
        const getValueKey = (item) => {
          return isObject$1(item.value) ? get(item.value, props.valueKey) : item.value;
        };
        const optionsAllDisabled = vue.computed(() => optionsArray.value.filter((option) => option.visible).every((option) => option.disabled));
        const showTagList = vue.computed(() => {
          if (!props.multiple) {
            return [];
          }
          return props.collapseTags ? states.selected.slice(0, props.maxCollapseTags) : states.selected;
        });
        const collapseTagList = vue.computed(() => {
          if (!props.multiple) {
            return [];
          }
          return props.collapseTags ? states.selected.slice(props.maxCollapseTags) : [];
        });
        const navigateOptions = (direction) => {
          if (!expanded.value) {
            expanded.value = true;
            return;
          }
          if (states.options.size === 0 || states.filteredOptionsCount === 0 || isComposing.value)
            return;
          if (!optionsAllDisabled.value) {
            if (direction === "next") {
              states.hoveringIndex++;
              if (states.hoveringIndex === states.options.size) {
                states.hoveringIndex = 0;
              }
            } else if (direction === "prev") {
              states.hoveringIndex--;
              if (states.hoveringIndex < 0) {
                states.hoveringIndex = states.options.size - 1;
              }
            }
            const option = optionsArray.value[states.hoveringIndex];
            if (option.disabled === true || option.states.groupDisabled === true || !option.visible) {
              navigateOptions(direction);
            }
            vue.nextTick(() => scrollToOption(hoverOption.value));
          }
        };
        const getGapWidth = () => {
          if (!selectionRef.value)
            return 0;
          const style = window.getComputedStyle(selectionRef.value);
          return Number.parseFloat(style.gap || "6px");
        };
        const tagStyle = vue.computed(() => {
          const gapWidth = getGapWidth();
          const maxWidth = collapseItemRef.value && props.maxCollapseTags === 1 ? states.selectionWidth - states.collapseItemWidth - gapWidth : states.selectionWidth;
          return { maxWidth: `${maxWidth}px` };
        });
        const collapseTagStyle = vue.computed(() => {
          return { maxWidth: `${states.selectionWidth}px` };
        });
        const inputStyle = vue.computed(() => ({
          width: `${Math.max(states.calculatorWidth, MINIMUM_INPUT_WIDTH)}px`
        }));
        useResizeObserver(selectionRef, resetSelectionWidth);
        useResizeObserver(calculatorRef, resetCalculatorWidth);
        useResizeObserver(menuRef, updateTooltip);
        useResizeObserver(wrapperRef, updateTooltip);
        useResizeObserver(tagMenuRef, updateTagTooltip);
        useResizeObserver(collapseItemRef, resetCollapseItemWidth);
        vue.onMounted(() => {
          setSelected();
        });
        return {
          inputId,
          contentId,
          nsSelect,
          nsInput,
          states,
          isFocused,
          expanded,
          optionsArray,
          hoverOption,
          selectSize,
          filteredOptionsCount,
          resetCalculatorWidth,
          updateTooltip,
          updateTagTooltip,
          debouncedOnInputChange,
          onInput,
          deletePrevTag,
          deleteTag,
          deleteSelected,
          handleOptionSelect,
          scrollToOption,
          hasModelValue,
          shouldShowPlaceholder,
          currentPlaceholder,
          mouseEnterEventName,
          needStatusIcon,
          showClose,
          iconComponent,
          iconReverse,
          validateState,
          validateIcon,
          showNewOption,
          updateOptions,
          collapseTagSize,
          setSelected,
          selectDisabled,
          emptyText,
          handleCompositionStart,
          handleCompositionUpdate,
          handleCompositionEnd,
          onOptionCreate,
          onOptionDestroy,
          handleMenuEnter,
          focus,
          blur,
          handleClearClick,
          handleClickOutside,
          handleEsc,
          toggleMenu,
          selectOption,
          getValueKey,
          navigateOptions,
          dropdownMenuVisible,
          showTagList,
          collapseTagList,
          tagStyle,
          collapseTagStyle,
          inputStyle,
          popperRef,
          inputRef,
          tooltipRef,
          tagTooltipRef,
          calculatorRef,
          prefixRef,
          suffixRef,
          selectRef,
          wrapperRef,
          selectionRef,
          scrollbarRef,
          menuRef,
          tagMenuRef,
          collapseItemRef
        };
      };
      var ElOptions = vue.defineComponent({
        name: "ElOptions",
        setup(_, { slots }) {
          const select = vue.inject(selectKey);
          let cachedValueList = [];
          return () => {
            var _a2, _b;
            const children = (_a2 = slots.default) == null ? void 0 : _a2.call(slots);
            const valueList = [];
            function filterOptions(children2) {
              if (!isArray$1(children2))
                return;
              children2.forEach((item) => {
                var _a22, _b2, _c, _d;
                const name = (_a22 = (item == null ? void 0 : item.type) || {}) == null ? void 0 : _a22.name;
                if (name === "ElOptionGroup") {
                  filterOptions(!isString(item.children) && !isArray$1(item.children) && isFunction$1((_b2 = item.children) == null ? void 0 : _b2.default) ? (_c = item.children) == null ? void 0 : _c.default() : item.children);
                } else if (name === "ElOption") {
                  valueList.push((_d = item.props) == null ? void 0 : _d.value);
                } else if (isArray$1(item.children)) {
                  filterOptions(item.children);
                }
              });
            }
            if (children.length) {
              filterOptions((_b = children[0]) == null ? void 0 : _b.children);
            }
            if (!isEqual(valueList, cachedValueList)) {
              cachedValueList = valueList;
              if (select) {
                select.states.optionValues = valueList;
              }
            }
            return children;
          };
        }
      });
      const SelectProps = buildProps({
        name: String,
        id: String,
        modelValue: {
          type: [Array, String, Number, Boolean, Object],
          default: void 0
        },
        autocomplete: {
          type: String,
          default: "off"
        },
        automaticDropdown: Boolean,
        size: useSizeProp,
        effect: {
          type: definePropType(String),
          default: "light"
        },
        disabled: Boolean,
        clearable: Boolean,
        filterable: Boolean,
        allowCreate: Boolean,
        loading: Boolean,
        popperClass: {
          type: String,
          default: ""
        },
        popperOptions: {
          type: definePropType(Object),
          default: () => ({})
        },
        remote: Boolean,
        loadingText: String,
        noMatchText: String,
        noDataText: String,
        remoteMethod: Function,
        filterMethod: Function,
        multiple: Boolean,
        multipleLimit: {
          type: Number,
          default: 0
        },
        placeholder: {
          type: String
        },
        defaultFirstOption: Boolean,
        reserveKeyword: {
          type: Boolean,
          default: true
        },
        valueKey: {
          type: String,
          default: "value"
        },
        collapseTags: Boolean,
        collapseTagsTooltip: Boolean,
        maxCollapseTags: {
          type: Number,
          default: 1
        },
        teleported: useTooltipContentProps.teleported,
        persistent: {
          type: Boolean,
          default: true
        },
        clearIcon: {
          type: iconPropType,
          default: circle_close_default
        },
        fitInputWidth: Boolean,
        suffixIcon: {
          type: iconPropType,
          default: arrow_down_default
        },
        tagType: { ...tagProps.type, default: "info" },
        tagEffect: { ...tagProps.effect, default: "light" },
        validateEvent: {
          type: Boolean,
          default: true
        },
        remoteShowSuffix: Boolean,
        showArrow: {
          type: Boolean,
          default: true
        },
        offset: {
          type: Number,
          default: 12
        },
        placement: {
          type: definePropType(String),
          values: Ee,
          default: "bottom-start"
        },
        fallbackPlacements: {
          type: definePropType(Array),
          default: ["bottom-start", "top-start", "right", "left"]
        },
        appendTo: String,
        ...useEmptyValuesProps,
        ...useAriaProps(["ariaLabel"])
      });
      const COMPONENT_NAME$1 = "ElSelect";
      const _sfc_main$8 = vue.defineComponent({
        name: COMPONENT_NAME$1,
        componentName: COMPONENT_NAME$1,
        components: {
          ElSelectMenu,
          ElOption: Option,
          ElOptions,
          ElTag,
          ElScrollbar,
          ElTooltip,
          ElIcon
        },
        directives: { ClickOutside },
        props: SelectProps,
        emits: [
          UPDATE_MODEL_EVENT,
          CHANGE_EVENT,
          "remove-tag",
          "clear",
          "visible-change",
          "focus",
          "blur"
        ],
        setup(props, { emit }) {
          const modelValue = vue.computed(() => {
            const { modelValue: rawModelValue, multiple } = props;
            const fallback = multiple ? [] : void 0;
            if (isArray$1(rawModelValue)) {
              return multiple ? rawModelValue : fallback;
            }
            return multiple ? fallback : rawModelValue;
          });
          const _props = vue.reactive({
            ...vue.toRefs(props),
            modelValue
          });
          const API = useSelect(_props, emit);
          vue.provide(selectKey, vue.reactive({
            props: _props,
            states: API.states,
            optionsArray: API.optionsArray,
            handleOptionSelect: API.handleOptionSelect,
            onOptionCreate: API.onOptionCreate,
            onOptionDestroy: API.onOptionDestroy,
            selectRef: API.selectRef,
            setSelected: API.setSelected
          }));
          const selectedLabel = vue.computed(() => {
            if (!props.multiple) {
              return API.states.selectedLabel;
            }
            return API.states.selected.map((i) => i.currentLabel);
          });
          return {
            ...API,
            modelValue,
            selectedLabel
          };
        }
      });
      function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
        const _component_el_tag = vue.resolveComponent("el-tag");
        const _component_el_tooltip = vue.resolveComponent("el-tooltip");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_options = vue.resolveComponent("el-options");
        const _component_el_scrollbar = vue.resolveComponent("el-scrollbar");
        const _component_el_select_menu = vue.resolveComponent("el-select-menu");
        const _directive_click_outside = vue.resolveDirective("click-outside");
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          ref: "selectRef",
          class: vue.normalizeClass([_ctx.nsSelect.b(), _ctx.nsSelect.m(_ctx.selectSize)]),
          [vue.toHandlerKey(_ctx.mouseEnterEventName)]: ($event) => _ctx.states.inputHovering = true,
          onMouseleave: ($event) => _ctx.states.inputHovering = false
        }, [
          vue.createVNode(_component_el_tooltip, {
            ref: "tooltipRef",
            visible: _ctx.dropdownMenuVisible,
            placement: _ctx.placement,
            teleported: _ctx.teleported,
            "popper-class": [_ctx.nsSelect.e("popper"), _ctx.popperClass],
            "popper-options": _ctx.popperOptions,
            "fallback-placements": _ctx.fallbackPlacements,
            effect: _ctx.effect,
            pure: "",
            trigger: "click",
            transition: `${_ctx.nsSelect.namespace.value}-zoom-in-top`,
            "stop-popper-mouse-event": false,
            "gpu-acceleration": false,
            persistent: _ctx.persistent,
            "append-to": _ctx.appendTo,
            "show-arrow": _ctx.showArrow,
            offset: _ctx.offset,
            onBeforeShow: _ctx.handleMenuEnter,
            onHide: ($event) => _ctx.states.isBeforeHide = false
          }, {
            default: vue.withCtx(() => {
              var _a2;
              return [
                vue.createElementVNode("div", {
                  ref: "wrapperRef",
                  class: vue.normalizeClass([
                    _ctx.nsSelect.e("wrapper"),
                    _ctx.nsSelect.is("focused", _ctx.isFocused),
                    _ctx.nsSelect.is("hovering", _ctx.states.inputHovering),
                    _ctx.nsSelect.is("filterable", _ctx.filterable),
                    _ctx.nsSelect.is("disabled", _ctx.selectDisabled)
                  ]),
                  onClick: vue.withModifiers(_ctx.toggleMenu, ["prevent"])
                }, [
                  _ctx.$slots.prefix ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 0,
                    ref: "prefixRef",
                    class: vue.normalizeClass(_ctx.nsSelect.e("prefix"))
                  }, [
                    vue.renderSlot(_ctx.$slots, "prefix")
                  ], 2)) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode("div", {
                    ref: "selectionRef",
                    class: vue.normalizeClass([
                      _ctx.nsSelect.e("selection"),
                      _ctx.nsSelect.is("near", _ctx.multiple && !_ctx.$slots.prefix && !!_ctx.states.selected.length)
                    ])
                  }, [
                    _ctx.multiple ? vue.renderSlot(_ctx.$slots, "tag", { key: 0 }, () => [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.showTagList, (item) => {
                        return vue.openBlock(), vue.createElementBlock("div", {
                          key: _ctx.getValueKey(item),
                          class: vue.normalizeClass(_ctx.nsSelect.e("selected-item"))
                        }, [
                          vue.createVNode(_component_el_tag, {
                            closable: !_ctx.selectDisabled && !item.isDisabled,
                            size: _ctx.collapseTagSize,
                            type: _ctx.tagType,
                            effect: _ctx.tagEffect,
                            "disable-transitions": "",
                            style: vue.normalizeStyle(_ctx.tagStyle),
                            onClose: ($event) => _ctx.deleteTag($event, item)
                          }, {
                            default: vue.withCtx(() => [
                              vue.createElementVNode("span", {
                                class: vue.normalizeClass(_ctx.nsSelect.e("tags-text"))
                              }, [
                                vue.renderSlot(_ctx.$slots, "label", {
                                  label: item.currentLabel,
                                  value: item.value
                                }, () => [
                                  vue.createTextVNode(vue.toDisplayString(item.currentLabel), 1)
                                ])
                              ], 2)
                            ]),
                            _: 2
                          }, 1032, ["closable", "size", "type", "effect", "style", "onClose"])
                        ], 2);
                      }), 128)),
                      _ctx.collapseTags && _ctx.states.selected.length > _ctx.maxCollapseTags ? (vue.openBlock(), vue.createBlock(_component_el_tooltip, {
                        key: 0,
                        ref: "tagTooltipRef",
                        disabled: _ctx.dropdownMenuVisible || !_ctx.collapseTagsTooltip,
                        "fallback-placements": ["bottom", "top", "right", "left"],
                        effect: _ctx.effect,
                        placement: "bottom",
                        teleported: _ctx.teleported
                      }, {
                        default: vue.withCtx(() => [
                          vue.createElementVNode("div", {
                            ref: "collapseItemRef",
                            class: vue.normalizeClass(_ctx.nsSelect.e("selected-item"))
                          }, [
                            vue.createVNode(_component_el_tag, {
                              closable: false,
                              size: _ctx.collapseTagSize,
                              type: _ctx.tagType,
                              effect: _ctx.tagEffect,
                              "disable-transitions": "",
                              style: vue.normalizeStyle(_ctx.collapseTagStyle)
                            }, {
                              default: vue.withCtx(() => [
                                vue.createElementVNode("span", {
                                  class: vue.normalizeClass(_ctx.nsSelect.e("tags-text"))
                                }, " + " + vue.toDisplayString(_ctx.states.selected.length - _ctx.maxCollapseTags), 3)
                              ]),
                              _: 1
                            }, 8, ["size", "type", "effect", "style"])
                          ], 2)
                        ]),
                        content: vue.withCtx(() => [
                          vue.createElementVNode("div", {
                            ref: "tagMenuRef",
                            class: vue.normalizeClass(_ctx.nsSelect.e("selection"))
                          }, [
                            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.collapseTagList, (item) => {
                              return vue.openBlock(), vue.createElementBlock("div", {
                                key: _ctx.getValueKey(item),
                                class: vue.normalizeClass(_ctx.nsSelect.e("selected-item"))
                              }, [
                                vue.createVNode(_component_el_tag, {
                                  class: "in-tooltip",
                                  closable: !_ctx.selectDisabled && !item.isDisabled,
                                  size: _ctx.collapseTagSize,
                                  type: _ctx.tagType,
                                  effect: _ctx.tagEffect,
                                  "disable-transitions": "",
                                  onClose: ($event) => _ctx.deleteTag($event, item)
                                }, {
                                  default: vue.withCtx(() => [
                                    vue.createElementVNode("span", {
                                      class: vue.normalizeClass(_ctx.nsSelect.e("tags-text"))
                                    }, [
                                      vue.renderSlot(_ctx.$slots, "label", {
                                        label: item.currentLabel,
                                        value: item.value
                                      }, () => [
                                        vue.createTextVNode(vue.toDisplayString(item.currentLabel), 1)
                                      ])
                                    ], 2)
                                  ]),
                                  _: 2
                                }, 1032, ["closable", "size", "type", "effect", "onClose"])
                              ], 2);
                            }), 128))
                          ], 2)
                        ]),
                        _: 3
                      }, 8, ["disabled", "effect", "teleported"])) : vue.createCommentVNode("v-if", true)
                    ]) : vue.createCommentVNode("v-if", true),
                    !_ctx.selectDisabled ? (vue.openBlock(), vue.createElementBlock("div", {
                      key: 1,
                      class: vue.normalizeClass([
                        _ctx.nsSelect.e("selected-item"),
                        _ctx.nsSelect.e("input-wrapper"),
                        _ctx.nsSelect.is("hidden", !_ctx.filterable)
                      ])
                    }, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        id: _ctx.inputId,
                        ref: "inputRef",
                        "onUpdate:modelValue": ($event) => _ctx.states.inputValue = $event,
                        type: "text",
                        name: _ctx.name,
                        class: vue.normalizeClass([_ctx.nsSelect.e("input"), _ctx.nsSelect.is(_ctx.selectSize)]),
                        disabled: _ctx.selectDisabled,
                        autocomplete: _ctx.autocomplete,
                        style: vue.normalizeStyle(_ctx.inputStyle),
                        role: "combobox",
                        readonly: !_ctx.filterable,
                        spellcheck: "false",
                        "aria-activedescendant": ((_a2 = _ctx.hoverOption) == null ? void 0 : _a2.id) || "",
                        "aria-controls": _ctx.contentId,
                        "aria-expanded": _ctx.dropdownMenuVisible,
                        "aria-label": _ctx.ariaLabel,
                        "aria-autocomplete": "none",
                        "aria-haspopup": "listbox",
                        onKeydown: [
                          vue.withKeys(vue.withModifiers(($event) => _ctx.navigateOptions("next"), ["stop", "prevent"]), ["down"]),
                          vue.withKeys(vue.withModifiers(($event) => _ctx.navigateOptions("prev"), ["stop", "prevent"]), ["up"]),
                          vue.withKeys(vue.withModifiers(_ctx.handleEsc, ["stop", "prevent"]), ["esc"]),
                          vue.withKeys(vue.withModifiers(_ctx.selectOption, ["stop", "prevent"]), ["enter"]),
                          vue.withKeys(vue.withModifiers(_ctx.deletePrevTag, ["stop"]), ["delete"])
                        ],
                        onCompositionstart: _ctx.handleCompositionStart,
                        onCompositionupdate: _ctx.handleCompositionUpdate,
                        onCompositionend: _ctx.handleCompositionEnd,
                        onInput: _ctx.onInput,
                        onClick: vue.withModifiers(_ctx.toggleMenu, ["stop"])
                      }, null, 46, ["id", "onUpdate:modelValue", "name", "disabled", "autocomplete", "readonly", "aria-activedescendant", "aria-controls", "aria-expanded", "aria-label", "onKeydown", "onCompositionstart", "onCompositionupdate", "onCompositionend", "onInput", "onClick"]), [
                        [vue.vModelText, _ctx.states.inputValue]
                      ]),
                      _ctx.filterable ? (vue.openBlock(), vue.createElementBlock("span", {
                        key: 0,
                        ref: "calculatorRef",
                        "aria-hidden": "true",
                        class: vue.normalizeClass(_ctx.nsSelect.e("input-calculator")),
                        textContent: vue.toDisplayString(_ctx.states.inputValue)
                      }, null, 10, ["textContent"])) : vue.createCommentVNode("v-if", true)
                    ], 2)) : vue.createCommentVNode("v-if", true),
                    _ctx.shouldShowPlaceholder ? (vue.openBlock(), vue.createElementBlock("div", {
                      key: 2,
                      class: vue.normalizeClass([
                        _ctx.nsSelect.e("selected-item"),
                        _ctx.nsSelect.e("placeholder"),
                        _ctx.nsSelect.is("transparent", !_ctx.hasModelValue || _ctx.expanded && !_ctx.states.inputValue)
                      ])
                    }, [
                      _ctx.hasModelValue ? vue.renderSlot(_ctx.$slots, "label", {
                        key: 0,
                        label: _ctx.currentPlaceholder,
                        value: _ctx.modelValue
                      }, () => [
                        vue.createElementVNode("span", null, vue.toDisplayString(_ctx.currentPlaceholder), 1)
                      ]) : (vue.openBlock(), vue.createElementBlock("span", { key: 1 }, vue.toDisplayString(_ctx.currentPlaceholder), 1))
                    ], 2)) : vue.createCommentVNode("v-if", true)
                  ], 2),
                  vue.createElementVNode("div", {
                    ref: "suffixRef",
                    class: vue.normalizeClass(_ctx.nsSelect.e("suffix"))
                  }, [
                    _ctx.iconComponent && !_ctx.showClose ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
                      key: 0,
                      class: vue.normalizeClass([_ctx.nsSelect.e("caret"), _ctx.nsSelect.e("icon"), _ctx.iconReverse])
                    }, {
                      default: vue.withCtx(() => [
                        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.iconComponent)))
                      ]),
                      _: 1
                    }, 8, ["class"])) : vue.createCommentVNode("v-if", true),
                    _ctx.showClose && _ctx.clearIcon ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
                      key: 1,
                      class: vue.normalizeClass([
                        _ctx.nsSelect.e("caret"),
                        _ctx.nsSelect.e("icon"),
                        _ctx.nsSelect.e("clear")
                      ]),
                      onClick: _ctx.handleClearClick
                    }, {
                      default: vue.withCtx(() => [
                        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.clearIcon)))
                      ]),
                      _: 1
                    }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true),
                    _ctx.validateState && _ctx.validateIcon && _ctx.needStatusIcon ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
                      key: 2,
                      class: vue.normalizeClass([_ctx.nsInput.e("icon"), _ctx.nsInput.e("validateIcon")])
                    }, {
                      default: vue.withCtx(() => [
                        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.validateIcon)))
                      ]),
                      _: 1
                    }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
                  ], 2)
                ], 10, ["onClick"])
              ];
            }),
            content: vue.withCtx(() => [
              vue.createVNode(_component_el_select_menu, { ref: "menuRef" }, {
                default: vue.withCtx(() => [
                  _ctx.$slots.header ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 0,
                    class: vue.normalizeClass(_ctx.nsSelect.be("dropdown", "header")),
                    onClick: vue.withModifiers(() => {
                    }, ["stop"])
                  }, [
                    vue.renderSlot(_ctx.$slots, "header")
                  ], 10, ["onClick"])) : vue.createCommentVNode("v-if", true),
                  vue.withDirectives(vue.createVNode(_component_el_scrollbar, {
                    id: _ctx.contentId,
                    ref: "scrollbarRef",
                    tag: "ul",
                    "wrap-class": _ctx.nsSelect.be("dropdown", "wrap"),
                    "view-class": _ctx.nsSelect.be("dropdown", "list"),
                    class: vue.normalizeClass([_ctx.nsSelect.is("empty", _ctx.filteredOptionsCount === 0)]),
                    role: "listbox",
                    "aria-label": _ctx.ariaLabel,
                    "aria-orientation": "vertical"
                  }, {
                    default: vue.withCtx(() => [
                      _ctx.showNewOption ? (vue.openBlock(), vue.createBlock(_component_el_option, {
                        key: 0,
                        value: _ctx.states.inputValue,
                        created: true
                      }, null, 8, ["value"])) : vue.createCommentVNode("v-if", true),
                      vue.createVNode(_component_el_options, null, {
                        default: vue.withCtx(() => [
                          vue.renderSlot(_ctx.$slots, "default")
                        ]),
                        _: 3
                      })
                    ]),
                    _: 3
                  }, 8, ["id", "wrap-class", "view-class", "class", "aria-label"]), [
                    [vue.vShow, _ctx.states.options.size > 0 && !_ctx.loading]
                  ]),
                  _ctx.$slots.loading && _ctx.loading ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 1,
                    class: vue.normalizeClass(_ctx.nsSelect.be("dropdown", "loading"))
                  }, [
                    vue.renderSlot(_ctx.$slots, "loading")
                  ], 2)) : _ctx.loading || _ctx.filteredOptionsCount === 0 ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 2,
                    class: vue.normalizeClass(_ctx.nsSelect.be("dropdown", "empty"))
                  }, [
                    vue.renderSlot(_ctx.$slots, "empty", {}, () => [
                      vue.createElementVNode("span", null, vue.toDisplayString(_ctx.emptyText), 1)
                    ])
                  ], 2)) : vue.createCommentVNode("v-if", true),
                  _ctx.$slots.footer ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 3,
                    class: vue.normalizeClass(_ctx.nsSelect.be("dropdown", "footer")),
                    onClick: vue.withModifiers(() => {
                    }, ["stop"])
                  }, [
                    vue.renderSlot(_ctx.$slots, "footer")
                  ], 10, ["onClick"])) : vue.createCommentVNode("v-if", true)
                ]),
                _: 3
              }, 512)
            ]),
            _: 3
          }, 8, ["visible", "placement", "teleported", "popper-class", "popper-options", "fallback-placements", "effect", "transition", "persistent", "append-to", "show-arrow", "offset", "onBeforeShow", "onHide"])
        ], 16, ["onMouseleave"])), [
          [_directive_click_outside, _ctx.handleClickOutside, _ctx.popperRef]
        ]);
      }
      var Select = /* @__PURE__ */ _export_sfc$1(_sfc_main$8, [["render", _sfc_render$1], ["__file", "select.vue"]]);
      const _sfc_main$7 = vue.defineComponent({
        name: "ElOptionGroup",
        componentName: "ElOptionGroup",
        props: {
          label: String,
          disabled: Boolean
        },
        setup(props) {
          const ns = useNamespace("select");
          const groupRef = vue.ref(null);
          const instance = vue.getCurrentInstance();
          const children = vue.ref([]);
          vue.provide(selectGroupKey, vue.reactive({
            ...vue.toRefs(props)
          }));
          const visible = vue.computed(() => children.value.some((option) => option.visible === true));
          const isOption = (node) => {
            var _a2, _b;
            return ((_a2 = node.type) == null ? void 0 : _a2.name) === "ElOption" && !!((_b = node.component) == null ? void 0 : _b.proxy);
          };
          const flattedChildren = (node) => {
            const Nodes = castArray(node);
            const children2 = [];
            Nodes.forEach((child) => {
              var _a2, _b;
              if (isOption(child)) {
                children2.push(child.component.proxy);
              } else if ((_a2 = child.children) == null ? void 0 : _a2.length) {
                children2.push(...flattedChildren(child.children));
              } else if ((_b = child.component) == null ? void 0 : _b.subTree) {
                children2.push(...flattedChildren(child.component.subTree));
              }
            });
            return children2;
          };
          const updateChildren = () => {
            children.value = flattedChildren(instance.subTree);
          };
          vue.onMounted(() => {
            updateChildren();
          });
          useMutationObserver(groupRef, updateChildren, {
            attributes: true,
            subtree: true,
            childList: true
          });
          return {
            groupRef,
            visible,
            ns
          };
        }
      });
      function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("ul", {
          ref: "groupRef",
          class: vue.normalizeClass(_ctx.ns.be("group", "wrap"))
        }, [
          vue.createElementVNode("li", {
            class: vue.normalizeClass(_ctx.ns.be("group", "title"))
          }, vue.toDisplayString(_ctx.label), 3),
          vue.createElementVNode("li", null, [
            vue.createElementVNode("ul", {
              class: vue.normalizeClass(_ctx.ns.b("group"))
            }, [
              vue.renderSlot(_ctx.$slots, "default")
            ], 2)
          ])
        ], 2)), [
          [vue.vShow, _ctx.visible]
        ]);
      }
      var OptionGroup = /* @__PURE__ */ _export_sfc$1(_sfc_main$7, [["render", _sfc_render], ["__file", "option-group.vue"]]);
      const ElSelect = withInstall(Select, {
        Option,
        OptionGroup
      });
      const ElOption = withNoopInstall(Option);
      withNoopInstall(OptionGroup);
      const spaceItemProps = buildProps({
        prefixCls: {
          type: String
        }
      });
      const SpaceItem = vue.defineComponent({
        name: "ElSpaceItem",
        props: spaceItemProps,
        setup(props, { slots }) {
          const ns = useNamespace("space");
          const classes = vue.computed(() => `${props.prefixCls || ns.b()}__item`);
          return () => vue.h("div", { class: classes.value }, vue.renderSlot(slots, "default"));
        }
      });
      const SIZE_MAP = {
        small: 8,
        default: 12,
        large: 16
      };
      function useSpace(props) {
        const ns = useNamespace("space");
        const classes = vue.computed(() => [ns.b(), ns.m(props.direction), props.class]);
        const horizontalSize = vue.ref(0);
        const verticalSize = vue.ref(0);
        const containerStyle = vue.computed(() => {
          const wrapKls = props.wrap || props.fill ? { flexWrap: "wrap" } : {};
          const alignment = {
            alignItems: props.alignment
          };
          const gap = {
            rowGap: `${verticalSize.value}px`,
            columnGap: `${horizontalSize.value}px`
          };
          return [wrapKls, alignment, gap, props.style];
        });
        const itemStyle = vue.computed(() => {
          return props.fill ? { flexGrow: 1, minWidth: `${props.fillRatio}%` } : {};
        });
        vue.watchEffect(() => {
          const { size = "small", wrap, direction: dir, fill } = props;
          if (isArray$1(size)) {
            const [h2 = 0, v = 0] = size;
            horizontalSize.value = h2;
            verticalSize.value = v;
          } else {
            let val;
            if (isNumber(size)) {
              val = size;
            } else {
              val = SIZE_MAP[size || "small"] || SIZE_MAP.small;
            }
            if ((wrap || fill) && dir === "horizontal") {
              horizontalSize.value = verticalSize.value = val;
            } else {
              if (dir === "horizontal") {
                horizontalSize.value = val;
                verticalSize.value = 0;
              } else {
                verticalSize.value = val;
                horizontalSize.value = 0;
              }
            }
          }
        });
        return {
          classes,
          containerStyle,
          itemStyle
        };
      }
      const spaceProps = buildProps({
        direction: {
          type: String,
          values: ["horizontal", "vertical"],
          default: "horizontal"
        },
        class: {
          type: definePropType([
            String,
            Object,
            Array
          ]),
          default: ""
        },
        style: {
          type: definePropType([String, Array, Object]),
          default: ""
        },
        alignment: {
          type: definePropType(String),
          default: "center"
        },
        prefixCls: {
          type: String
        },
        spacer: {
          type: definePropType([Object, String, Number, Array]),
          default: null,
          validator: (val) => vue.isVNode(val) || isNumber(val) || isString(val)
        },
        wrap: Boolean,
        fill: Boolean,
        fillRatio: {
          type: Number,
          default: 100
        },
        size: {
          type: [String, Array, Number],
          values: componentSizes,
          validator: (val) => {
            return isNumber(val) || isArray$1(val) && val.length === 2 && val.every(isNumber);
          }
        }
      });
      const Space = vue.defineComponent({
        name: "ElSpace",
        props: spaceProps,
        setup(props, { slots }) {
          const { classes, containerStyle, itemStyle } = useSpace(props);
          function extractChildren(children, parentKey = "", extractedChildren = []) {
            const { prefixCls } = props;
            children.forEach((child, loopKey) => {
              if (isFragment(child)) {
                if (isArray$1(child.children)) {
                  child.children.forEach((nested, key) => {
                    if (isFragment(nested) && isArray$1(nested.children)) {
                      extractChildren(nested.children, `${parentKey + key}-`, extractedChildren);
                    } else {
                      extractedChildren.push(vue.createVNode(SpaceItem, {
                        style: itemStyle.value,
                        prefixCls,
                        key: `nested-${parentKey + key}`
                      }, {
                        default: () => [nested]
                      }, PatchFlags.PROPS | PatchFlags.STYLE, ["style", "prefixCls"]));
                    }
                  });
                }
              } else if (isValidElementNode(child)) {
                extractedChildren.push(vue.createVNode(SpaceItem, {
                  style: itemStyle.value,
                  prefixCls,
                  key: `LoopKey${parentKey + loopKey}`
                }, {
                  default: () => [child]
                }, PatchFlags.PROPS | PatchFlags.STYLE, ["style", "prefixCls"]));
              }
            });
            return extractedChildren;
          }
          return () => {
            var _a2;
            const { spacer, direction } = props;
            const children = vue.renderSlot(slots, "default", { key: 0 }, () => []);
            if (((_a2 = children.children) != null ? _a2 : []).length === 0)
              return null;
            if (isArray$1(children.children)) {
              let extractedChildren = extractChildren(children.children);
              if (spacer) {
                const len = extractedChildren.length - 1;
                extractedChildren = extractedChildren.reduce((acc, child, idx) => {
                  const children2 = [...acc, child];
                  if (idx !== len) {
                    children2.push(vue.createVNode("span", {
                      style: [
                        itemStyle.value,
                        direction === "vertical" ? "width: 100%" : null
                      ],
                      key: idx
                    }, [
                      vue.isVNode(spacer) ? spacer : vue.createTextVNode(spacer, PatchFlags.TEXT)
                    ], PatchFlags.STYLE));
                  }
                  return children2;
                }, []);
              }
              return vue.createVNode("div", {
                class: classes.value,
                style: containerStyle.value
              }, extractedChildren, PatchFlags.STYLE | PatchFlags.CLASS);
            }
            return children.children;
          };
        }
      });
      const ElSpace = withInstall(Space);
      const switchProps = buildProps({
        modelValue: {
          type: [Boolean, String, Number],
          default: false
        },
        disabled: Boolean,
        loading: Boolean,
        size: {
          type: String,
          validator: isValidComponentSize
        },
        width: {
          type: [String, Number],
          default: ""
        },
        inlinePrompt: Boolean,
        inactiveActionIcon: {
          type: iconPropType
        },
        activeActionIcon: {
          type: iconPropType
        },
        activeIcon: {
          type: iconPropType
        },
        inactiveIcon: {
          type: iconPropType
        },
        activeText: {
          type: String,
          default: ""
        },
        inactiveText: {
          type: String,
          default: ""
        },
        activeValue: {
          type: [Boolean, String, Number],
          default: true
        },
        inactiveValue: {
          type: [Boolean, String, Number],
          default: false
        },
        name: {
          type: String,
          default: ""
        },
        validateEvent: {
          type: Boolean,
          default: true
        },
        beforeChange: {
          type: definePropType(Function)
        },
        id: String,
        tabindex: {
          type: [String, Number]
        },
        ...useAriaProps(["ariaLabel"])
      });
      const switchEmits = {
        [UPDATE_MODEL_EVENT]: (val) => isBoolean(val) || isString(val) || isNumber(val),
        [CHANGE_EVENT]: (val) => isBoolean(val) || isString(val) || isNumber(val),
        [INPUT_EVENT]: (val) => isBoolean(val) || isString(val) || isNumber(val)
      };
      const COMPONENT_NAME = "ElSwitch";
      const __default__$1 = vue.defineComponent({
        name: COMPONENT_NAME
      });
      const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
        ...__default__$1,
        props: switchProps,
        emits: switchEmits,
        setup(__props, { expose, emit }) {
          const props = __props;
          const { formItem } = useFormItem();
          const switchSize = useFormSize();
          const ns = useNamespace("switch");
          const { inputId } = useFormItemInputId(props, {
            formItemContext: formItem
          });
          const switchDisabled = useFormDisabled(vue.computed(() => props.loading));
          const isControlled = vue.ref(props.modelValue !== false);
          const input = vue.ref();
          const core = vue.ref();
          const switchKls = vue.computed(() => [
            ns.b(),
            ns.m(switchSize.value),
            ns.is("disabled", switchDisabled.value),
            ns.is("checked", checked.value)
          ]);
          const labelLeftKls = vue.computed(() => [
            ns.e("label"),
            ns.em("label", "left"),
            ns.is("active", !checked.value)
          ]);
          const labelRightKls = vue.computed(() => [
            ns.e("label"),
            ns.em("label", "right"),
            ns.is("active", checked.value)
          ]);
          const coreStyle = vue.computed(() => ({
            width: addUnit(props.width)
          }));
          vue.watch(() => props.modelValue, () => {
            isControlled.value = true;
          });
          const actualValue = vue.computed(() => {
            return isControlled.value ? props.modelValue : false;
          });
          const checked = vue.computed(() => actualValue.value === props.activeValue);
          if (![props.activeValue, props.inactiveValue].includes(actualValue.value)) {
            emit(UPDATE_MODEL_EVENT, props.inactiveValue);
            emit(CHANGE_EVENT, props.inactiveValue);
            emit(INPUT_EVENT, props.inactiveValue);
          }
          vue.watch(checked, (val) => {
            var _a2;
            input.value.checked = val;
            if (props.validateEvent) {
              (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "change").catch((err) => debugWarn());
            }
          });
          const handleChange = () => {
            const val = checked.value ? props.inactiveValue : props.activeValue;
            emit(UPDATE_MODEL_EVENT, val);
            emit(CHANGE_EVENT, val);
            emit(INPUT_EVENT, val);
            vue.nextTick(() => {
              input.value.checked = checked.value;
            });
          };
          const switchValue = () => {
            if (switchDisabled.value)
              return;
            const { beforeChange } = props;
            if (!beforeChange) {
              handleChange();
              return;
            }
            const shouldChange = beforeChange();
            const isPromiseOrBool = [
              isPromise(shouldChange),
              isBoolean(shouldChange)
            ].includes(true);
            if (!isPromiseOrBool) {
              throwError(COMPONENT_NAME, "beforeChange must return type `Promise<boolean>` or `boolean`");
            }
            if (isPromise(shouldChange)) {
              shouldChange.then((result) => {
                if (result) {
                  handleChange();
                }
              }).catch((e) => {
              });
            } else if (shouldChange) {
              handleChange();
            }
          };
          const focus = () => {
            var _a2, _b;
            (_b = (_a2 = input.value) == null ? void 0 : _a2.focus) == null ? void 0 : _b.call(_a2);
          };
          vue.onMounted(() => {
            input.value.checked = checked.value;
          });
          expose({
            focus,
            checked
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              class: vue.normalizeClass(vue.unref(switchKls)),
              onClick: vue.withModifiers(switchValue, ["prevent"])
            }, [
              vue.createElementVNode("input", {
                id: vue.unref(inputId),
                ref_key: "input",
                ref: input,
                class: vue.normalizeClass(vue.unref(ns).e("input")),
                type: "checkbox",
                role: "switch",
                "aria-checked": vue.unref(checked),
                "aria-disabled": vue.unref(switchDisabled),
                "aria-label": _ctx.ariaLabel,
                name: _ctx.name,
                "true-value": _ctx.activeValue,
                "false-value": _ctx.inactiveValue,
                disabled: vue.unref(switchDisabled),
                tabindex: _ctx.tabindex,
                onChange: handleChange,
                onKeydown: vue.withKeys(switchValue, ["enter"])
              }, null, 42, ["id", "aria-checked", "aria-disabled", "aria-label", "name", "true-value", "false-value", "disabled", "tabindex", "onKeydown"]),
              !_ctx.inlinePrompt && (_ctx.inactiveIcon || _ctx.inactiveText) ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: vue.normalizeClass(vue.unref(labelLeftKls))
              }, [
                _ctx.inactiveIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 0 }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.inactiveIcon)))
                  ]),
                  _: 1
                })) : vue.createCommentVNode("v-if", true),
                !_ctx.inactiveIcon && _ctx.inactiveText ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 1,
                  "aria-hidden": vue.unref(checked)
                }, vue.toDisplayString(_ctx.inactiveText), 9, ["aria-hidden"])) : vue.createCommentVNode("v-if", true)
              ], 2)) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("span", {
                ref_key: "core",
                ref: core,
                class: vue.normalizeClass(vue.unref(ns).e("core")),
                style: vue.normalizeStyle(vue.unref(coreStyle))
              }, [
                _ctx.inlinePrompt ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  class: vue.normalizeClass(vue.unref(ns).e("inner"))
                }, [
                  _ctx.activeIcon || _ctx.inactiveIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 0,
                    class: vue.normalizeClass(vue.unref(ns).is("icon"))
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(checked) ? _ctx.activeIcon : _ctx.inactiveIcon)))
                    ]),
                    _: 1
                  }, 8, ["class"])) : _ctx.activeText || _ctx.inactiveText ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 1,
                    class: vue.normalizeClass(vue.unref(ns).is("text")),
                    "aria-hidden": !vue.unref(checked)
                  }, vue.toDisplayString(vue.unref(checked) ? _ctx.activeText : _ctx.inactiveText), 11, ["aria-hidden"])) : vue.createCommentVNode("v-if", true)
                ], 2)) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(vue.unref(ns).e("action"))
                }, [
                  _ctx.loading ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 0,
                    class: vue.normalizeClass(vue.unref(ns).is("loading"))
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(loading_default))
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.unref(checked) ? vue.renderSlot(_ctx.$slots, "active-action", { key: 1 }, () => [
                    _ctx.activeActionIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 0 }, {
                      default: vue.withCtx(() => [
                        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.activeActionIcon)))
                      ]),
                      _: 1
                    })) : vue.createCommentVNode("v-if", true)
                  ]) : !vue.unref(checked) ? vue.renderSlot(_ctx.$slots, "inactive-action", { key: 2 }, () => [
                    _ctx.inactiveActionIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 0 }, {
                      default: vue.withCtx(() => [
                        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.inactiveActionIcon)))
                      ]),
                      _: 1
                    })) : vue.createCommentVNode("v-if", true)
                  ]) : vue.createCommentVNode("v-if", true)
                ], 2)
              ], 6),
              !_ctx.inlinePrompt && (_ctx.activeIcon || _ctx.activeText) ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 1,
                class: vue.normalizeClass(vue.unref(labelRightKls))
              }, [
                _ctx.activeIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 0 }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.activeIcon)))
                  ]),
                  _: 1
                })) : vue.createCommentVNode("v-if", true),
                !_ctx.activeIcon && _ctx.activeText ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 1,
                  "aria-hidden": !vue.unref(checked)
                }, vue.toDisplayString(_ctx.activeText), 9, ["aria-hidden"])) : vue.createCommentVNode("v-if", true)
              ], 2)) : vue.createCommentVNode("v-if", true)
            ], 10, ["onClick"]);
          };
        }
      });
      var Switch = /* @__PURE__ */ _export_sfc$1(_sfc_main$6, [["__file", "switch.vue"]]);
      const ElSwitch = withInstall(Switch);
      const messageTypes = ["success", "info", "warning", "error"];
      const messageDefaults = mutable({
        customClass: "",
        center: false,
        dangerouslyUseHTMLString: false,
        duration: 3e3,
        icon: void 0,
        id: "",
        message: "",
        onClose: void 0,
        showClose: false,
        type: "info",
        plain: false,
        offset: 16,
        zIndex: 0,
        grouping: false,
        repeatNum: 1,
        appendTo: isClient ? document.body : void 0
      });
      const messageProps = buildProps({
        customClass: {
          type: String,
          default: messageDefaults.customClass
        },
        center: {
          type: Boolean,
          default: messageDefaults.center
        },
        dangerouslyUseHTMLString: {
          type: Boolean,
          default: messageDefaults.dangerouslyUseHTMLString
        },
        duration: {
          type: Number,
          default: messageDefaults.duration
        },
        icon: {
          type: iconPropType,
          default: messageDefaults.icon
        },
        id: {
          type: String,
          default: messageDefaults.id
        },
        message: {
          type: definePropType([
            String,
            Object,
            Function
          ]),
          default: messageDefaults.message
        },
        onClose: {
          type: definePropType(Function),
          default: messageDefaults.onClose
        },
        showClose: {
          type: Boolean,
          default: messageDefaults.showClose
        },
        type: {
          type: String,
          values: messageTypes,
          default: messageDefaults.type
        },
        plain: {
          type: Boolean,
          default: messageDefaults.plain
        },
        offset: {
          type: Number,
          default: messageDefaults.offset
        },
        zIndex: {
          type: Number,
          default: messageDefaults.zIndex
        },
        grouping: {
          type: Boolean,
          default: messageDefaults.grouping
        },
        repeatNum: {
          type: Number,
          default: messageDefaults.repeatNum
        }
      });
      const messageEmits = {
        destroy: () => true
      };
      const instances = vue.shallowReactive([]);
      const getInstance = (id) => {
        const idx = instances.findIndex((instance) => instance.id === id);
        const current = instances[idx];
        let prev;
        if (idx > 0) {
          prev = instances[idx - 1];
        }
        return { current, prev };
      };
      const getLastOffset = (id) => {
        const { prev } = getInstance(id);
        if (!prev)
          return 0;
        return prev.vm.exposed.bottom.value;
      };
      const getOffsetOrSpace = (id, offset) => {
        const idx = instances.findIndex((instance) => instance.id === id);
        return idx > 0 ? 16 : offset;
      };
      const __default__ = vue.defineComponent({
        name: "ElMessage"
      });
      const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
        ...__default__,
        props: messageProps,
        emits: messageEmits,
        setup(__props, { expose }) {
          const props = __props;
          const { Close } = TypeComponents;
          const { ns, zIndex: zIndex2 } = useGlobalComponentSettings("message");
          const { currentZIndex, nextZIndex } = zIndex2;
          const messageRef = vue.ref();
          const visible = vue.ref(false);
          const height = vue.ref(0);
          let stopTimer = void 0;
          const badgeType = vue.computed(() => props.type ? props.type === "error" ? "danger" : props.type : "info");
          const typeClass = vue.computed(() => {
            const type = props.type;
            return { [ns.bm("icon", type)]: type && TypeComponentsMap[type] };
          });
          const iconComponent = vue.computed(() => props.icon || TypeComponentsMap[props.type] || "");
          const lastOffset = vue.computed(() => getLastOffset(props.id));
          const offset = vue.computed(() => getOffsetOrSpace(props.id, props.offset) + lastOffset.value);
          const bottom = vue.computed(() => height.value + offset.value);
          const customStyle = vue.computed(() => ({
            top: `${offset.value}px`,
            zIndex: currentZIndex.value
          }));
          function startTimer() {
            if (props.duration === 0)
              return;
            ({ stop: stopTimer } = useTimeoutFn(() => {
              close();
            }, props.duration));
          }
          function clearTimer() {
            stopTimer == null ? void 0 : stopTimer();
          }
          function close() {
            visible.value = false;
          }
          function keydown({ code }) {
            if (code === EVENT_CODE.esc) {
              close();
            }
          }
          vue.onMounted(() => {
            startTimer();
            nextZIndex();
            visible.value = true;
          });
          vue.watch(() => props.repeatNum, () => {
            clearTimer();
            startTimer();
          });
          useEventListener(document, "keydown", keydown);
          useResizeObserver(messageRef, () => {
            height.value = messageRef.value.getBoundingClientRect().height;
          });
          expose({
            visible,
            bottom,
            close
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.Transition, {
              name: vue.unref(ns).b("fade"),
              onBeforeLeave: _ctx.onClose,
              onAfterLeave: ($event) => _ctx.$emit("destroy"),
              persisted: ""
            }, {
              default: vue.withCtx(() => [
                vue.withDirectives(vue.createElementVNode("div", {
                  id: _ctx.id,
                  ref_key: "messageRef",
                  ref: messageRef,
                  class: vue.normalizeClass([
                    vue.unref(ns).b(),
                    { [vue.unref(ns).m(_ctx.type)]: _ctx.type },
                    vue.unref(ns).is("center", _ctx.center),
                    vue.unref(ns).is("closable", _ctx.showClose),
                    vue.unref(ns).is("plain", _ctx.plain),
                    _ctx.customClass
                  ]),
                  style: vue.normalizeStyle(vue.unref(customStyle)),
                  role: "alert",
                  onMouseenter: clearTimer,
                  onMouseleave: startTimer
                }, [
                  _ctx.repeatNum > 1 ? (vue.openBlock(), vue.createBlock(vue.unref(ElBadge), {
                    key: 0,
                    value: _ctx.repeatNum,
                    type: vue.unref(badgeType),
                    class: vue.normalizeClass(vue.unref(ns).e("badge"))
                  }, null, 8, ["value", "type", "class"])) : vue.createCommentVNode("v-if", true),
                  vue.unref(iconComponent) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 1,
                    class: vue.normalizeClass([vue.unref(ns).e("icon"), vue.unref(typeClass)])
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(iconComponent))))
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("v-if", true),
                  vue.renderSlot(_ctx.$slots, "default", {}, () => [
                    !_ctx.dangerouslyUseHTMLString ? (vue.openBlock(), vue.createElementBlock("p", {
                      key: 0,
                      class: vue.normalizeClass(vue.unref(ns).e("content"))
                    }, vue.toDisplayString(_ctx.message), 3)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                      vue.createCommentVNode(" Caution here, message could've been compromised, never use user's input as message "),
                      vue.createElementVNode("p", {
                        class: vue.normalizeClass(vue.unref(ns).e("content")),
                        innerHTML: _ctx.message
                      }, null, 10, ["innerHTML"])
                    ], 2112))
                  ]),
                  _ctx.showClose ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 2,
                    class: vue.normalizeClass(vue.unref(ns).e("closeBtn")),
                    onClick: vue.withModifiers(close, ["stop"])
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(Close))
                    ]),
                    _: 1
                  }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
                ], 46, ["id"]), [
                  [vue.vShow, visible.value]
                ])
              ]),
              _: 3
            }, 8, ["name", "onBeforeLeave", "onAfterLeave"]);
          };
        }
      });
      var MessageConstructor = /* @__PURE__ */ _export_sfc$1(_sfc_main$5, [["__file", "message.vue"]]);
      let seed = 1;
      const normalizeOptions = (params) => {
        const options = !params || isString(params) || vue.isVNode(params) || isFunction$1(params) ? { message: params } : params;
        const normalized = {
          ...messageDefaults,
          ...options
        };
        if (!normalized.appendTo) {
          normalized.appendTo = document.body;
        } else if (isString(normalized.appendTo)) {
          let appendTo = document.querySelector(normalized.appendTo);
          if (!isElement(appendTo)) {
            appendTo = document.body;
          }
          normalized.appendTo = appendTo;
        }
        if (isBoolean(messageConfig.grouping) && !normalized.grouping) {
          normalized.grouping = messageConfig.grouping;
        }
        if (isNumber(messageConfig.duration) && normalized.duration === 3e3) {
          normalized.duration = messageConfig.duration;
        }
        if (isNumber(messageConfig.offset) && normalized.offset === 16) {
          normalized.offset = messageConfig.offset;
        }
        if (isBoolean(messageConfig.showClose) && !normalized.showClose) {
          normalized.showClose = messageConfig.showClose;
        }
        return normalized;
      };
      const closeMessage = (instance) => {
        const idx = instances.indexOf(instance);
        if (idx === -1)
          return;
        instances.splice(idx, 1);
        const { handler } = instance;
        handler.close();
      };
      const createMessage = ({ appendTo, ...options }, context) => {
        const id = `message_${seed++}`;
        const userOnClose = options.onClose;
        const container = document.createElement("div");
        const props = {
          ...options,
          id,
          onClose: () => {
            userOnClose == null ? void 0 : userOnClose();
            closeMessage(instance);
          },
          onDestroy: () => {
            vue.render(null, container);
          }
        };
        const vnode = vue.createVNode(MessageConstructor, props, isFunction$1(props.message) || vue.isVNode(props.message) ? {
          default: isFunction$1(props.message) ? props.message : () => props.message
        } : null);
        vnode.appContext = context || message._context;
        vue.render(vnode, container);
        appendTo.appendChild(container.firstElementChild);
        const vm = vnode.component;
        const handler = {
          close: () => {
            vm.exposed.visible.value = false;
          }
        };
        const instance = {
          id,
          vnode,
          vm,
          handler,
          props: vnode.component.props
        };
        return instance;
      };
      const message = (options = {}, context) => {
        if (!isClient)
          return { close: () => void 0 };
        const normalized = normalizeOptions(options);
        if (normalized.grouping && instances.length) {
          const instance2 = instances.find(({ vnode: vm }) => {
            var _a2;
            return ((_a2 = vm.props) == null ? void 0 : _a2.message) === normalized.message;
          });
          if (instance2) {
            instance2.props.repeatNum += 1;
            instance2.props.type = normalized.type;
            return instance2.handler;
          }
        }
        if (isNumber(messageConfig.max) && instances.length >= messageConfig.max) {
          return { close: () => void 0 };
        }
        const instance = createMessage(normalized, context);
        instances.push(instance);
        return instance.handler;
      };
      messageTypes.forEach((type) => {
        message[type] = (options = {}, appContext) => {
          const normalized = normalizeOptions(options);
          return message({ ...normalized, type }, appContext);
        };
      });
      function closeAll(type) {
        for (const instance of instances) {
          if (!type || type === instance.props.type) {
            instance.handler.close();
          }
        }
      }
      message.closeAll = closeAll;
      message._context = null;
      const ElMessage = withInstallFunction(message, "$message");
      var zhCn = {
        name: "zh-cn",
        el: {
          breadcrumb: {
            label: "面包屑"
          },
          colorpicker: {
            confirm: "确定",
            clear: "清空",
            defaultLabel: "颜色选择器",
            description: "当前颜色 {color}，按 Enter 键选择新颜色",
            alphaLabel: "选择透明度的值"
          },
          datepicker: {
            now: "此刻",
            today: "今天",
            cancel: "取消",
            clear: "清空",
            confirm: "确定",
            dateTablePrompt: "使用方向键与 Enter 键可选择日期",
            monthTablePrompt: "使用方向键与 Enter 键可选择月份",
            yearTablePrompt: "使用方向键与 Enter 键可选择年份",
            selectedDate: "已选日期",
            selectDate: "选择日期",
            selectTime: "选择时间",
            startDate: "开始日期",
            startTime: "开始时间",
            endDate: "结束日期",
            endTime: "结束时间",
            prevYear: "前一年",
            nextYear: "后一年",
            prevMonth: "上个月",
            nextMonth: "下个月",
            year: "年",
            month1: "1 月",
            month2: "2 月",
            month3: "3 月",
            month4: "4 月",
            month5: "5 月",
            month6: "6 月",
            month7: "7 月",
            month8: "8 月",
            month9: "9 月",
            month10: "10 月",
            month11: "11 月",
            month12: "12 月",
            weeks: {
              sun: "日",
              mon: "一",
              tue: "二",
              wed: "三",
              thu: "四",
              fri: "五",
              sat: "六"
            },
            weeksFull: {
              sun: "星期日",
              mon: "星期一",
              tue: "星期二",
              wed: "星期三",
              thu: "星期四",
              fri: "星期五",
              sat: "星期六"
            },
            months: {
              jan: "一月",
              feb: "二月",
              mar: "三月",
              apr: "四月",
              may: "五月",
              jun: "六月",
              jul: "七月",
              aug: "八月",
              sep: "九月",
              oct: "十月",
              nov: "十一月",
              dec: "十二月"
            }
          },
          inputNumber: {
            decrease: "减少数值",
            increase: "增加数值"
          },
          select: {
            loading: "加载中",
            noMatch: "无匹配数据",
            noData: "无数据",
            placeholder: "请选择"
          },
          dropdown: {
            toggleDropdown: "切换下拉选项"
          },
          mention: {
            loading: "加载中"
          },
          cascader: {
            noMatch: "无匹配数据",
            loading: "加载中",
            placeholder: "请选择",
            noData: "暂无数据"
          },
          pagination: {
            goto: "前往",
            pagesize: "条/页",
            total: "共 {total} 条",
            pageClassifier: "页",
            page: "页",
            prev: "上一页",
            next: "下一页",
            currentPage: "第 {pager} 页",
            prevPages: "向前 {pager} 页",
            nextPages: "向后 {pager} 页",
            deprecationWarning: "你使用了一些已被废弃的用法，请参考 el-pagination 的官方文档"
          },
          dialog: {
            close: "关闭此对话框"
          },
          drawer: {
            close: "关闭此对话框"
          },
          messagebox: {
            title: "提示",
            confirm: "确定",
            cancel: "取消",
            error: "输入的数据不合法!",
            close: "关闭此对话框"
          },
          upload: {
            deleteTip: "按 delete 键可删除",
            delete: "删除",
            preview: "查看图片",
            continue: "继续上传"
          },
          slider: {
            defaultLabel: "滑块介于 {min} 至 {max}",
            defaultRangeStartLabel: "选择起始值",
            defaultRangeEndLabel: "选择结束值"
          },
          table: {
            emptyText: "暂无数据",
            confirmFilter: "筛选",
            resetFilter: "重置",
            clearFilter: "全部",
            sumText: "合计"
          },
          tour: {
            next: "下一步",
            previous: "上一步",
            finish: "结束导览"
          },
          tree: {
            emptyText: "暂无数据"
          },
          transfer: {
            noMatch: "无匹配数据",
            noData: "无数据",
            titles: ["列表 1", "列表 2"],
            filterPlaceholder: "请输入搜索内容",
            noCheckedFormat: "共 {total} 项",
            hasCheckedFormat: "已选 {checked}/{total} 项"
          },
          image: {
            error: "加载失败"
          },
          pageHeader: {
            title: "返回"
          },
          popconfirm: {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          },
          carousel: {
            leftArrow: "上一张幻灯片",
            rightArrow: "下一张幻灯片",
            indicator: "幻灯片切换至索引 {index}"
          }
        }
      };
      var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
      var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
      const imageServer = [
        "https://sns-img-hw.xhscdn.net/",
        "https://sns-img-bd.xhscdn.com/",
        // 'https://sns-img-qn.xhscdn.com/',
        "https://sns-img-qc.xhscdn.com/",
        "https://ci.xiaohongshu.com/"
      ];
      const videoServer = [
        "https://sns-video-hw.xhscdn.com/",
        "https://sns-video-bd.xhscdn.com/",
        "https://sns-video-al.xhscdn.com/"
      ];
      const jpgParams = "imageView2/2/w/format/jpg";
      const keyReg = new RegExp("(?<=\\/)(spectrum\\/)?[a-z0-9A-Z\\-]+(?=!)");
      const nameRule = `$<序号>.$
[<发布者昵称>]
<标题>
(<发布时间>)
$_<宽度>x<高度>$
`;
      var downLoadType = /* @__PURE__ */ ((downLoadType2) => {
        downLoadType2[downLoadType2["default"] = 0] = "default";
        downLoadType2[downLoadType2["origin"] = 1] = "origin";
        downLoadType2[downLoadType2["jpg"] = 2] = "jpg";
        downLoadType2[downLoadType2["live"] = 3] = "live";
        return downLoadType2;
      })(downLoadType || {});
      function getDefaultSetting() {
        return {
          nameRule,
          timeFormatRule: "YYYY年MM月DD日HH时mm分ss秒",
          timezone: "Asia/Shanghai",
          jsonRpcUrl: "ws://localhost:16800/jsonrpc",
          jsonRpcToken: "",
          downloadLocation: "",
          useNameAsDir: true,
          useTitleAsDir: true,
          downLoadTypeObj: {
            video: downLoadType.default,
            normal: downLoadType.default
          },
          preferLive: true,
          openRpcDownload: false,
          downloadSize: "50%",
          col: 4,
          version: _GM.info.version
        };
      }
      const useStorageStore = pinia.defineStore("xhs-script-storage", {
        state: () => ({
          setting: getDefaultSetting(),
          floatBtnPosition: {
            left: "0px",
            top: "45%",
            isInLeft: true
          }
        }),
        actions: {
          setSetting(setting) {
            this.setting = setting;
          },
          setDownloadType(type, value) {
            this.setting.downLoadTypeObj[type] = value;
          },
          setPreferLive(e) {
            this.setting.preferLive = e;
          },
          reset() {
            this.setting = getDefaultSetting();
          },
          compatible() {
            const v = _GM.info.script.version;
            this.setting.version = v;
          }
        },
        persist: true
      });
      /**
       * @license lucide-vue-next v0.469.0 - ISC
       *
       * This source code is licensed under the ISC license.
       * See the LICENSE file in the root directory of this source tree.
       */
      const toKebabCase = (string2) => string2.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
      /**
       * @license lucide-vue-next v0.469.0 - ISC
       *
       * This source code is licensed under the ISC license.
       * See the LICENSE file in the root directory of this source tree.
       */
      var defaultAttributes = {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": 2,
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      };
      /**
       * @license lucide-vue-next v0.469.0 - ISC
       *
       * This source code is licensed under the ISC license.
       * See the LICENSE file in the root directory of this source tree.
       */
      const Icon = ({ size, strokeWidth = 2, absoluteStrokeWidth, color, iconNode, name, class: classes, ...props }, { slots }) => {
        return vue.h(
          "svg",
          {
            ...defaultAttributes,
            width: size || defaultAttributes.width,
            height: size || defaultAttributes.height,
            stroke: color || defaultAttributes.stroke,
            "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
            class: ["lucide", `lucide-${toKebabCase(name ?? "icon")}`],
            ...props
          },
          [...iconNode.map((child) => vue.h(...child)), ...slots.default ? [slots.default()] : []]
        );
      };
      /**
       * @license lucide-vue-next v0.469.0 - ISC
       *
       * This source code is licensed under the ISC license.
       * See the LICENSE file in the root directory of this source tree.
       */
      const createLucideIcon = (iconName, iconNode) => (props, { slots }) => vue.h(
        Icon,
        {
          ...props,
          iconNode,
          name: iconName
        },
        slots
      );
      /**
       * @license lucide-vue-next v0.469.0 - ISC
       *
       * This source code is licensed under the ISC license.
       * See the LICENSE file in the root directory of this source tree.
       */
      const FolderDown = createLucideIcon("FolderDownIcon", [
        [
          "path",
          {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
            key: "1kt360"
          }
        ],
        ["path", { d: "M12 10v6", key: "1bos4e" }],
        ["path", { d: "m15 13-3 3-3-3", key: "6j2sf0" }]
      ]);
      const _hoisted_1$3 = { class: "icon" };
      const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
        __name: "FloatButton",
        emits: ["click"],
        setup(__props, { emit: __emit }) {
          const emit = __emit;
          const btnRef = vue.ref();
          const storageStore = useStorageStore();
          let isDragging = false;
          let maxTop;
          let maxLeft;
          let innerTop;
          let innerLeft;
          let time = 0;
          let duration = 0;
          function initState() {
            var _a2, _b;
            maxTop = window.innerHeight - ((_a2 = btnRef.value) == null ? void 0 : _a2.clientHeight);
            maxLeft = window.innerWidth - ((_b = btnRef.value) == null ? void 0 : _b.clientWidth);
            if (storageStore.floatBtnPosition.left != "0px") {
              storageStore.floatBtnPosition.left = maxLeft + "px";
            }
          }
          function handleBtnMousedown(event) {
            var _a2, _b;
            duration = 0;
            time = Date.now();
            isDragging = true;
            innerTop = event.pageY - ((_a2 = btnRef.value) == null ? void 0 : _a2.offsetTop);
            innerLeft = event.pageX - ((_b = btnRef.value) == null ? void 0 : _b.offsetLeft);
          }
          function handleBtnMouseUp() {
            duration = Date.now() - time;
            isDragging = false;
          }
          function handleWindowMouseMove(event) {
            if (!isDragging) return;
            let top = event.pageY - innerTop;
            let left = event.pageX - innerLeft;
            if (top < 0) {
              top = 0;
            } else if (top > maxTop) {
              top = maxTop;
            }
            if (left < 0) {
              left = 0;
            } else if (left > maxLeft) {
              left = maxLeft;
            }
            setPosition(left, top);
          }
          function handleWindowMouseUp() {
            var _a2;
            const left = (_a2 = btnRef.value) == null ? void 0 : _a2.offsetLeft;
            if (left > maxLeft / 2) {
              setPosition(maxLeft);
            } else {
              setPosition(0);
            }
          }
          function setPosition(left, top) {
            if (left != void 0) {
              storageStore.floatBtnPosition.left = left + "px";
            }
            if (top != void 0) {
              storageStore.floatBtnPosition.top = top + "px";
            }
          }
          function handleBtnClick() {
            setTimeout(() => {
              if (duration <= 250) {
                emit("click");
              }
            }, 250);
          }
          vue.onMounted(() => {
            initState();
            window.onmousemove = handleWindowMouseMove;
            window.onmouseup = handleWindowMouseUp;
            window.onresize = initState;
          });
          vue.onUnmounted(() => {
            window.onmousemove = null;
            window.onmouseup = null;
            window.onresize = null;
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              ref_key: "btnRef",
              ref: btnRef,
              title: "小红书下载助手",
              class: vue.normalizeClass({
                "xhs-download-float-btn": true,
                right: vue.unref(storageStore).floatBtnPosition.left != "0px",
                active: vue.unref(isDragging)
              }),
              style: vue.normalizeStyle(vue.unref(storageStore).floatBtnPosition),
              onMousedown: handleBtnMousedown,
              onMouseup: handleBtnMouseUp,
              onClick: handleBtnClick
            }, [
              vue.createElementVNode("div", _hoisted_1$3, [
                vue.createVNode(vue.unref(FolderDown), { size: 20 })
              ])
            ], 38);
          };
        }
      });
      const _export_sfc = (sfc, props) => {
        const target = sfc.__vccOpts || sfc;
        for (const [key, val] of props) {
          target[key] = val;
        }
        return target;
      };
      const FloatButton = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-833d5c5d"]]);
      var dist = {};
      var patternTree = {};
      var toHex$1 = {};
      Object.defineProperty(toHex$1, "__esModule", { value: true });
      toHex$1.fromHex = toHex$1.toHex = void 0;
      const hex = (num) => new Number(num).toString(16).toLowerCase();
      const toHex = (num) => `0x${hex(num).length === 1 ? "0" + hex(num) : hex(num)}`;
      toHex$1.toHex = toHex;
      const fromHex = (hex2) => new Number(hex2);
      toHex$1.fromHex = fromHex;
      var tree$1 = {};
      (function(exports2) {
        Object.defineProperty(exports2, "__esModule", { value: true });
        exports2.createComplexNode = exports2.createNode = exports2.merge = void 0;
        const createMatch = (leaf) => ({
          typename: leaf.typename,
          mime: leaf.info.mime,
          extension: leaf.info.extension
        });
        const isMatchingNode = (tree2, path) => tree2 && path.length === 0;
        const head = (arr) => arr[0];
        const tail = (arr) => arr.slice(1, arr.length);
        const merge = (node, tree2) => {
          if (node.bytes.length === 0)
            return tree2;
          const currentByte = head(node.bytes);
          const path = tail(node.bytes);
          const currentTree = tree2.bytes[currentByte];
          if (isMatchingNode(currentTree, path)) {
            const matchingNode = tree2.bytes[currentByte];
            tree2.bytes[currentByte] = {
              ...matchingNode,
              matches: [
                ...matchingNode.matches ? matchingNode.matches : [],
                createMatch(node)
              ]
            };
            return tree2;
          }
          if (tree2.bytes[currentByte]) {
            tree2.bytes[currentByte] = exports2.merge(exports2.createNode(node.typename, path, node.info), tree2.bytes[currentByte]);
            return tree2;
          }
          if (!tree2.bytes[currentByte]) {
            tree2.bytes[currentByte] = {
              ...tree2.bytes[currentByte],
              ...exports2.createComplexNode(node.typename, path, node.info)
            };
          }
          return tree2;
        };
        exports2.merge = merge;
        const createNode = (typename, bytes, info) => {
          return { typename, bytes, info: info ? info : {} };
        };
        exports2.createNode = createNode;
        const createComplexNode = (typename, bytes, info) => {
          let obj = {
            bytes: {},
            matches: void 0
          };
          const currentKey = head(bytes);
          const path = tail(bytes);
          if (bytes.length === 0) {
            return {
              matches: [
                createMatch({
                  typename,
                  info: info ? { extension: info.extension, mime: info.mime } : {}
                })
              ],
              bytes: {}
            };
          }
          obj.bytes[currentKey] = exports2.createComplexNode(typename, path, info);
          return obj;
        };
        exports2.createComplexNode = createComplexNode;
      })(tree$1);
      Object.defineProperty(patternTree, "__esModule", { value: true });
      const toHex_1 = toHex$1;
      const tree_1 = tree$1;
      let tree = {
        noOffset: null,
        offset: {}
      };
      const add = (typename, signature, additionalInfo, offset) => {
        if (offset) {
          const existing = tree.offset[toHex_1.toHex(offset)];
          if (!existing) {
            tree.offset[toHex_1.toHex(offset)] = tree_1.createComplexNode(typename, signature.map((e) => e.toLowerCase()), additionalInfo);
          } else {
            const merged = tree_1.merge(tree_1.createNode(typename, signature.map((e) => e.toLowerCase()), additionalInfo), { ...existing });
            tree.offset[toHex_1.toHex(offset)] = merged;
          }
        } else {
          if (tree.noOffset === null) {
            tree.noOffset = tree_1.createComplexNode(typename, signature.map((e) => e.toLowerCase()), additionalInfo);
          } else {
            tree.noOffset = tree_1.merge(tree_1.createNode(typename, signature.map((e) => e.toLowerCase()), additionalInfo), tree.noOffset);
          }
        }
      };
      add("gif", ["0x47", "0x49", "0x46", "0x38", "0x37", "0x61"], {
        mime: "image/gif",
        extension: "gif"
      });
      add("gif", ["0x47", "0x49", "0x46", "0x38", "0x39", "0x61"], {
        mime: "image/gif",
        extension: "gif"
      });
      add("jpg", ["0xFF", "0xD8", "0xFF"], {
        mime: "image/jpeg",
        extension: "jpeg"
      });
      add("webp", [
        "0x52",
        "0x49",
        "0x46",
        "0x46",
        "?",
        "?",
        "?",
        "?",
        "0x57",
        "0x45",
        "0x42",
        "0x50"
      ], { mime: "image/webp", extension: "webp" });
      add("heif", ["0x66", "0x74", "0x79", "0x70", "0x6D", "0x69", "0x66", "0x31"], { mime: "image/heif", extension: "heif" }, 4);
      add("heif", ["0x66", "0x74", "0x79", "0x70", "0x68", "0x65", "0x69", "0x63"], { mime: "image/heif", extension: "heic" }, 4);
      add("rpm", ["0xed", "0xab", "0xee", "0xdb"]);
      add("bin", ["0x53", "0x50", "0x30", "0x31"], {
        mime: "application/octet-stream",
        extension: "bin"
      });
      add("pic", ["0x00"]);
      add("pif", ["0x00"]);
      add("sea", ["0x00"]);
      add("ytr", ["0x00"]);
      add("mp4", ["0x66", "0x74", "0x79", "0x70"], { mime: "video/mp4", extension: "mp4" }, 4);
      add("ttf", ["0x00", "0x01", "0x00", "0x00", "0x00"], {
        mime: "font/ttf",
        extension: "ttf"
      });
      add("otf", ["0x4F", "0x54", "0x54", "0x4F"], {
        mime: "font/otf",
        extension: "otf"
      });
      add("eot", ["0x50", "0x4C"], {
        mime: "application/vnd.ms-fontobject",
        extension: "eot"
      });
      add("woff", ["0x77", "0x4F", "0x46", "0x46"], {
        mime: "font/woff",
        extension: "woff"
      });
      add("woff2", ["0x77", "0x4F", "0x46", "0x32"], {
        mime: "font/woff2",
        extension: "woff2"
      });
      add("pdb", [
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00"
      ]);
      add("dba", ["0xBE", "0xBA", "0xFE", "0xCA"]);
      add("dba2", ["0x00", "0x01", "0x42", "0x44"]);
      add("tda", ["0x00", "0x01", "0x44", "0x54"]);
      add("tda2", ["0x00", "0x01", "0x00", "0x00"]);
      add("ico", ["0x00", "0x00", "0x01", "0x00"], {
        mime: "image/x-icon",
        extension: "ico"
      });
      add("3gp", ["0x66", "0x74", "0x79", "0x70", "0x33", "0x67"]);
      add("z", ["0x1F", "0x9D"]);
      add("tar.z", ["0x1F", "0xA0"]);
      add("bac", [
        "0x42",
        "0x41",
        "0x43",
        "0x4B",
        "0x4D",
        "0x49",
        "0x4B",
        "0x45",
        "0x44",
        "0x49",
        "0x53",
        "0x4B"
      ]);
      add("bz2", ["0x42", "0x5A", "0x68"], {
        mime: "application/x-bzip2",
        extension: "bz2"
      });
      add("tif", ["0x49", "0x49", "0x2A", "0x00"], {
        mime: "image/tiff",
        extension: "tif"
      });
      add("tiff", ["0x4D", "0x4D", "0x00", "0x2A"], {
        mime: "image/tiff",
        extension: "tiff"
      });
      add("cr2", [
        "0x49",
        "0x49",
        "0x2A",
        "0x00",
        "0x10",
        "0x00",
        "0x00",
        "0x00",
        "0x43",
        "0x52"
      ]);
      add("cin", ["0x80", "0x2A", "0x5F", "0xD7"]);
      add("cin1", ["0x52", "0x4E", "0x43", "0x01"]);
      add("cin2", ["0x52", "0x4E", "0x43", "0x02"]);
      add("dpx", ["0x53", "0x44", "0x50", "0x58"]);
      add("dpx2", ["0x58", "0x50", "0x44", "0x53"]);
      add("exr", ["0x76", "0x2F", "0x31", "0x01"]);
      add("bpg", ["0x42", "0x50", "0x47", "0xFB"]);
      add("ilbm", [
        "0x46",
        "0x4F",
        "0x52",
        "0x4D",
        "?",
        "?",
        "?",
        "?",
        "0x49",
        "0x4C",
        "0x42",
        "0x4D"
      ]);
      add("8svx", [
        "0x46",
        "0x4F",
        "0x52",
        "0x4D",
        "?",
        "?",
        "?",
        "?",
        "0x38",
        "0x53",
        "0x56",
        "0x58"
      ]);
      add("acbm", [
        "0x46",
        "0x4F",
        "0x52",
        "0x4D",
        "?",
        "?",
        "?",
        "?",
        "0x41",
        "0x43",
        "0x42",
        "0x4D"
      ]);
      add("anbm", [
        "0x46",
        "0x4F",
        "0x52",
        "0x4D",
        "?",
        "?",
        "?",
        "?",
        "0x41",
        "0x4E",
        "0x42",
        "0x4D"
      ]);
      add("anim", [
        "0x46",
        "0x4F",
        "0x52",
        "0x4D",
        "?",
        "?",
        "?",
        "?",
        "0x41",
        "0x4E",
        "0x49",
        "0x4D"
      ]);
      add("faxx", [
        "0x46",
        "0x4F",
        "0x52",
        "0x4D",
        "?",
        "?",
        "?",
        "?",
        "0x46",
        "0x41",
        "0x58",
        "0x58"
      ]);
      add("ftxt", [
        "0x46",
        "0x4F",
        "0x52",
        "0x4D",
        "?",
        "?",
        "?",
        "?",
        "0x46",
        "0x54",
        "0x58",
        "0x54"
      ]);
      add("smus", [
        "0x46",
        "0x4F",
        "0x52",
        "0x4D",
        "?",
        "?",
        "?",
        "?",
        "0x53",
        "0x4D",
        "0x55",
        "0x53"
      ]);
      add("cmus", [
        "0x46",
        "0x4F",
        "0x52",
        "0x4D",
        "?",
        "?",
        "?",
        "?",
        "0x43",
        "0x4D",
        "0x55",
        "0x53"
      ]);
      add("yuvn", [
        "0x46",
        "0x4F",
        "0x52",
        "0x4D",
        "?",
        "?",
        "?",
        "?",
        "0x59",
        "0x55",
        "0x56",
        "0x4E"
      ]);
      add("iff", [
        "0x46",
        "0x4F",
        "0x52",
        "0x4D",
        "?",
        "?",
        "?",
        "?",
        "0x46",
        "0x41",
        "0x4E",
        "0x54"
      ]);
      add("aiff", [
        "0x46",
        "0x4F",
        "0x52",
        "0x4D",
        "?",
        "?",
        "?",
        "?",
        "0x41",
        "0x49",
        "0x46",
        "0x46"
      ], { mime: "audio/x-aiff", extension: "aiff" });
      add("idx", ["0x49", "0x4E", "0x44", "0x58"]);
      add("lz", ["0x4C", "0x5A", "0x49", "0x50"]);
      add("exe", ["0x4D", "0x5A"]);
      add("zip", ["0x50", "0x4B", "0x03", "0x04"], {
        mime: "application/zip",
        extension: "zip"
      });
      add("zip", ["0x50", "0x4B", "0x05", "0x06"], {
        mime: "application/zip",
        extension: "zip"
      });
      add("zip", ["0x50", "0x4B", "0x07", "0x08"], {
        mime: "application/zip",
        extension: "zip"
      });
      add("jar", ["0x50", "0x4B", "0x03", "0x04"], {
        mime: "application/java-archive",
        extension: "jar"
      });
      add("jar", ["0x50", "0x4B", "0x05", "0x06"], {
        mime: "application/java-archive",
        extension: "jar"
      });
      add("jar", ["0x50", "0x4B", "0x07", "0x08"], {
        mime: "application/java-archive",
        extension: "jar"
      });
      add("odt", ["0x50", "0x4B", "0x03", "0x04"], {
        mime: "application/vnd.oasis.opendocument.text",
        extension: "odt"
      });
      add("odt", ["0x50", "0x4B", "0x05", "0x06"], {
        mime: "application/vnd.oasis.opendocument.text",
        extension: "odt"
      });
      add("odt", ["0x50", "0x4B", "0x07", "0x08"], {
        mime: "application/vnd.oasis.opendocument.text",
        extension: "odt"
      });
      add("ods", ["0x50", "0x4B", "0x03", "0x04"], {
        mime: "application/vnd.oasis.opendocument.spreadsheet",
        extension: "ods"
      });
      add("ods", ["0x50", "0x4B", "0x05", "0x06"], {
        mime: "application/vnd.oasis.opendocument.spreadsheet",
        extension: "ods"
      });
      add("ods", ["0x50", "0x4B", "0x07", "0x08"], {
        mime: "application/vnd.oasis.opendocument.spreadsheet",
        extension: "ods"
      });
      add("odp", ["0x50", "0x4B", "0x03", "0x04"], {
        mime: "application/vnd.oasis.opendocument.presentation",
        extension: "odp"
      });
      add("odp", ["0x50", "0x4B", "0x05", "0x06"], {
        mime: "application/vnd.oasis.opendocument.presentation",
        extension: "odp"
      });
      add("odp", ["0x50", "0x4B", "0x07", "0x08"], {
        mime: "application/vnd.oasis.opendocument.presentation",
        extension: "odp"
      });
      add("docx", ["0x50", "0x4B", "0x03", "0x04"], {
        mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        extension: "docx"
      });
      add("docx", ["0x50", "0x4B", "0x05", "0x06"], {
        mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        extension: "docx"
      });
      add("docx", ["0x50", "0x4B", "0x07", "0x08"], {
        mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        extension: "docx"
      });
      add("xlsx", ["0x50", "0x4B", "0x03", "0x04"], {
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        extension: "xlsx"
      });
      add("xlsx", ["0x50", "0x4B", "0x05", "0x06"], {
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        extension: "xlsx"
      });
      add("xlsx", ["0x50", "0x4B", "0x07", "0x08"], {
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        extension: "xlsx"
      });
      add("pptx", ["0x50", "0x4B", "0x03", "0x04"], {
        mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        extension: "pptx"
      });
      add("pptx", ["0x50", "0x4B", "0x05", "0x06"], {
        mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        extension: "pptx"
      });
      add("pptx", ["0x50", "0x4B", "0x07", "0x08"], {
        mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        extension: "pptx"
      });
      add("vsdx", ["0x50", "0x4B", "0x03", "0x04"], {
        mime: "application/vnd.ms-visio.drawing",
        extension: "vsdx"
      });
      add("vsdx", ["0x50", "0x4B", "0x05", "0x06"], {
        mime: "application/vnd.ms-visio.drawing",
        extension: "vsdx"
      });
      add("vsdx", ["0x50", "0x4B", "0x07", "0x08"], {
        mime: "application/vnd.ms-visio.drawing",
        extension: "vsdx"
      });
      add("apk", ["0x50", "0x4B", "0x03", "0x04"], {
        mime: "application/vnd.android.package-archive",
        extension: "apk"
      });
      add("apk", ["0x50", "0x4B", "0x05", "0x06"], {
        mime: "application/vnd.android.package-archive",
        extension: "apk"
      });
      add("apk", ["0x50", "0x4B", "0x07", "0x08"], {
        mime: "application/vnd.android.package-archive",
        extension: "apk"
      });
      add("aar", ["0x50", "0x4B", "0x03", "0x04"], {
        mime: "application/vnd.android.package-archive",
        extension: "aar"
      });
      add("aar", ["0x50", "0x4B", "0x05", "0x06"], {
        mime: "application/vnd.android.package-archive",
        extension: "aar"
      });
      add("aar", ["0x50", "0x4B", "0x07", "0x08"], {
        mime: "application/vnd.android.package-archive",
        extension: "aar"
      });
      add("rar", ["0x52", "0x61", "0x72", "0x21", "0x1A", "0x07", "0x00"], {
        mime: "application/vnd.rar",
        extension: "rar"
      });
      add("rar", ["0x52", "0x61", "0x72", "0x21", "0x1A", "0x07", "0x01", "0x00"], {
        mime: "application/vnd.rar",
        extension: "rar"
      });
      add("rar", ["0x7F", "0x45", "0x4C", "0x46"], {
        mime: "application/vnd.rar",
        extension: "rar"
      });
      add("png", ["0x89", "0x50", "0x4E", "0x47", "0x0D", "0x0A", "0x1A", "0x0A"], {
        mime: "image/png",
        extension: "png"
      });
      add("apng", ["0x89", "0x50", "0x4E", "0x47", "0x0D", "0x0A", "0x1A", "0x0A"], {
        mime: "image/apng",
        extension: "apng"
      });
      add("class", ["0xCA", "0xFE", "0xBA", "0xBE"]);
      add("class", ["0xEF", "0xBB", "0xBF"]);
      add("class", ["0xFE", "0xed", "0xFA", "0xCE"], void 0, 4096);
      add("class", ["0xFE", "0xed", "0xFA", "0xCF"], void 0, 4096);
      add("class", ["0xCE", "0xFA", "0xed", "0xFE"]);
      add("class", ["0xCF", "0xFA", "0xed", "0xFE"]);
      add("class", ["0xFF", "0xFE"]);
      add("class", ["0xFF", "0xFE"]);
      add("class", ["0xFF", "0xFE", "0x00", "0x00"]);
      add("ps", ["0x25", "0x21", "0x50", "0x53"], {
        mime: "application/postscript",
        extension: ".ps"
      });
      add("pdf", ["0x25", "0x50", "0x44", "0x46"], {
        mime: "application/pdf",
        extension: "pdf"
      });
      add("asf", [
        "0x30",
        "0x26",
        "0xB2",
        "0x75",
        "0x8E",
        "0x66",
        "0xCF",
        "0x11",
        "0xA6",
        "0xD9",
        "0x00",
        "0xAA",
        "0x00",
        "0x62",
        "0xCE",
        "0x6C"
      ]);
      add("wma", [
        "0x30",
        "0x26",
        "0xB2",
        "0x75",
        "0x8E",
        "0x66",
        "0xCF",
        "0x11",
        "0xA6",
        "0xD9",
        "0x00",
        "0xAA",
        "0x00",
        "0x62",
        "0xCE",
        "0x6C"
      ]);
      add("wmv", [
        "0x30",
        "0x26",
        "0xB2",
        "0x75",
        "0x8E",
        "0x66",
        "0xCF",
        "0x11",
        "0xA6",
        "0xD9",
        "0x00",
        "0xAA",
        "0x00",
        "0x62",
        "0xCE",
        "0x6C"
      ]);
      add("deploymentimage", [
        "0x24",
        "0x53",
        "0x44",
        "0x49",
        "0x30",
        "0x30",
        "0x30",
        "0x31"
      ]);
      add("ogv", [
        "0x4F",
        "0x67",
        "0x67",
        "0x53",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "0x80",
        "0x74",
        "0x68",
        "0x65",
        "0x6F",
        "0x72",
        "0x61"
      ], {
        mime: "video/ogg",
        extension: "ogv"
      });
      add("ogm", [
        "0x4F",
        "0x67",
        "0x67",
        "0x53",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "0x01",
        "0x76",
        "0x69",
        "0x64",
        "0x65",
        "0x6F",
        "0x00"
      ], {
        mime: "video/ogg",
        extension: "ogm"
      });
      add("oga", [
        "0x4F",
        "0x67",
        "0x67",
        "0x53",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "0x7F",
        "0x46",
        "0x4C",
        "0x41",
        "0x43"
      ], {
        mime: "audio/ogg",
        extension: "oga"
      });
      add("spx", [
        "0x4F",
        "0x67",
        "0x67",
        "0x53",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "0x53",
        "0x70",
        "0x65",
        "0x65",
        "0x78",
        "0x20",
        "0x20"
      ], {
        mime: "audio/ogg",
        extension: "spx"
      });
      add("ogg", [
        "0x4F",
        "0x67",
        "0x67",
        "0x53",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "?",
        "0x01",
        "0x76",
        "0x6F",
        "0x72",
        "0x62",
        "0x69",
        "0x73"
      ], {
        mime: "audio/ogg",
        extension: "ogg"
      });
      add("ogx", ["0x4F", "0x67", "0x67", "0x53"], {
        mime: "application/ogg",
        extension: "ogx"
      });
      add("psd", ["0x38", "0x42", "0x50", "0x53"], {
        mime: "application/x-photoshop",
        extension: "psd"
      });
      add("clip", ["0x43", "0x53", "0x46", "0x43", "0x48", "0x55", "0x4e", "0x4b"]);
      add("wav", [
        "0x52",
        "0x49",
        "0x46",
        "0x46",
        "?",
        "?",
        "?",
        "?",
        "0x57",
        "0x41",
        "0x56",
        "0x45"
      ], { mime: "audio/x-wav", extension: "wav" });
      add("avi", [
        "0x52",
        "0x49",
        "0x46",
        "0x46",
        "?",
        "?",
        "?",
        "?",
        "0x41",
        "0x56",
        "0x49",
        "0x20"
      ], { mime: "video/x-msvideo", extension: "avi" });
      add("mp3", ["0xFF", "0xFB"], { mime: "audio/mpeg", extension: "mp3" });
      add("mp3", ["0xFF", "0xF3"], { mime: "audio/mpeg", extension: "mp3" });
      add("mp3", ["0xFF", "0xF2"], { mime: "audio/mpeg", extension: "mp3" });
      add("mp3", ["0x49", "0x44", "0x33"], { mime: "audio/mpeg", extension: "mp3" });
      add("bmp", ["0x42", "0x4D"], { mime: "image/bmp", extension: "bmp" });
      add("iso", ["0x43", "0x44", "0x30", "0x30", "0x31"]);
      add("flac", ["0x66", "0x4C", "0x61", "0x43"]);
      add("mid", ["0x4D", "0x54", "0x68", "0x64"], {
        mime: "audio/midi",
        extension: "mid"
      });
      add("midi", ["0x4D", "0x54", "0x68", "0x64"], {
        mime: "audio/midi",
        extension: "midi"
      });
      add("doc", ["0xD0", "0xCF", "0x11", "0xE0", "0xA1", "0xB1", "0x1A", "0xE1"], {
        mime: "application/msword",
        extension: "doc"
      });
      add("xls", ["0xD0", "0xCF", "0x11", "0xE0", "0xA1", "0xB1", "0x1A", "0xE1"], {
        mime: "application/vnd.ms-excel",
        extension: "xls"
      });
      add("ppt", ["0xD0", "0xCF", "0x11", "0xE0", "0xA1", "0xB1", "0x1A", "0xE1"], {
        mime: "application/vnd.ms-powerpoint",
        extension: "ppt"
      });
      add("msg", ["0xD0", "0xCF", "0x11", "0xE0", "0xA1", "0xB1", "0x1A", "0xE1"]);
      add("dex", ["0x64", "0x65", "0x78", "0x0A", "0x30", "0x33", "0x35", "0x00"]);
      add("vmdk", ["0x4B", "0x44", "0x4D"]);
      add("crx", ["0x43", "0x72", "0x32", "0x34"]);
      add("fh8", ["0x41", "0x47", "0x44", "0x33"]);
      add("cwk", [
        "0x05",
        "0x07",
        "0x00",
        "0x00",
        "0x42",
        "0x4F",
        "0x42",
        "0x4F",
        "0x05",
        "0x07",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x01"
      ]);
      add("cwk", [
        "0x06",
        "0x07",
        "0xE1",
        "0x00",
        "0x42",
        "0x4F",
        "0x42",
        "0x4F",
        "0x06",
        "0x07",
        "0xE1",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x01"
      ]);
      add("toast", ["0x45", "0x52", "0x02", "0x00", "0x00", "0x00"]);
      add("toast", ["0x8B", "0x45", "0x52", "0x02", "0x00", "0x00", "0x00"]);
      add("dmg", ["0x78", "0x01", "0x73", "0x0D", "0x62", "0x62", "0x60"]);
      add("xar", ["0x78", "0x61", "0x72", "0x21"]);
      add("dat", ["0x50", "0x4D", "0x4F", "0x43", "0x43", "0x4D", "0x4F", "0x43"]);
      add("nes", ["0x4E", "0x45", "0x53", "0x1A"]);
      add("tar", ["0x75", "0x73", "0x74", "0x61", "0x72", "0x00", "0x30", "0x30"], {
        // As per Mozilla documentation available at:
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
        // or wikipedia page:
        // https://en.wikipedia.org/wiki/List_of_archive_formats
        mime: "application/x-tar",
        extension: "tar"
      }, 257);
      add("tar", ["0x75", "0x73", "0x74", "0x61", "0x72", "0x20", "0x20", "0x00"], {
        mime: "application/x-tar",
        extension: "tar"
      }, 257);
      add("tox", ["0x74", "0x6F", "0x78", "0x33"]);
      add("mlv", ["0x4D", "0x4C", "0x56", "0x49"]);
      add("windowsupdate", [
        "0x44",
        "0x43",
        "0x4D",
        "0x01",
        "0x50",
        "0x41",
        "0x33",
        "0x30"
      ]);
      add("7z", ["0x37", "0x7A", "0xBC", "0xAF", "0x27", "0x1C"], {
        mime: "application/x-7z-compressed",
        extension: "7z"
      });
      add("gz", ["0x1F", "0x8B"], { mime: "application/gzip", extension: "gz" });
      add("tar.gz", ["0x1F", "0x8B"], {
        mime: "application/gzip",
        extension: "tar.gz"
      });
      add("xz", ["0xFD", "0x37", "0x7A", "0x58", "0x5A", "0x00", "0x00"], {
        mime: "application/gzip",
        extension: "xz"
      });
      add("tar.xz", ["0xFD", "0x37", "0x7A", "0x58", "0x5A", "0x00", "0x00"], {
        mime: "application/gzip",
        extension: "tar.xz"
      });
      add("lz2", ["0x04", "0x22", "0x4D", "0x18"]);
      add("cab", ["0x4D", "0x53", "0x43", "0x46"]);
      add("mkv", ["0x1A", "0x45", "0xDF", "0xA3"], {
        mime: "video/x-matroska",
        extension: "mkv"
      });
      add("mka", ["0x1A", "0x45", "0xDF", "0xA3"], {
        mime: "audio/x-matroska",
        extension: "mka"
      });
      add("mks", ["0x1A", "0x45", "0xDF", "0xA3"], {
        mime: "video/x-matroska",
        extension: "mks"
      });
      add("mk3d", ["0x1A", "0x45", "0xDF", "0xA3"]);
      add("webm", ["0x1A", "0x45", "0xDF", "0xA3"], {
        mime: "audio/webm",
        extension: "webm"
      });
      add("dcm", ["0x44", "0x49", "0x43", "0x4D"], void 0, 128);
      add("xml", ["0x3C", "0x3f", "0x78", "0x6d", "0x6C", "0x20"], {
        mime: "application/xml",
        extension: "xml"
      });
      add("wasm", ["0x00", "0x61", "0x73", "0x6d"], {
        mime: "application/wasm",
        extension: "wasm"
      });
      add("lep", ["0xCF", "0x84", "0x01"]);
      add("swf", ["0x43", "0x57", "0x53"], {
        mime: "application/x-shockwave-flash",
        extension: "swf"
      });
      add("swf", ["0x46", "0x57", "0x53"], {
        mime: "application/x-shockwave-flash",
        extension: "swf"
      });
      add("deb", ["0x21", "0x3C", "0x61", "0x72", "0x63", "0x68", "0x3E"]);
      add("rtf", ["0x7B", "0x5C", "0x72", "0x74", "0x66", "0x31"], {
        mime: "application/rtf",
        extension: "rtf"
      });
      add("m2p", ["0x00", "0x00", "0x01", "0xBA"]);
      add("vob", ["0x00", "0x00", "0x01", "0xBA"]);
      add("mpg", ["0x00", "0x00", "0x01", "0xBA"], {
        mime: "video/mpeg",
        extension: "mpg"
      });
      add("mpeg", ["0x00", "0x00", "0x01", "0xBA"], {
        mime: "video/mpeg",
        extension: "mpeg"
      });
      add("mpeg", ["0x47"], { mime: "video/mpeg", extension: "mpeg" });
      add("mpeg", ["0x00", "0x00", "0x01", "0xB3"], {
        mime: "video/mpeg",
        extension: "mpeg"
      });
      add("mov", ["0x66", "0x72", "0x65", "0x65"], {
        mime: "video/quicktime",
        extension: "mov"
      }, 4);
      add("mov", ["0x6D", "0x64", "0x61", "0x74"], {
        mime: "video/quicktime",
        extension: "mov"
      }, 4);
      add("mov", ["0x6D", "0x6F", "0x6F", "0x76"], {
        mime: "video/quicktime",
        extension: "mov"
      }, 4);
      add("mov", ["0x77", "0x69", "0x64", "0x65"], {
        mime: "video/quicktime",
        extension: "mov"
      }, 4);
      add("mov", ["0x66", "0x74", "0x79", "0x70", "0x71", "0x74"], {
        mime: "video/quicktime",
        extension: "mov"
      }, 4);
      add("hl2demo", ["0x48", "0x4C", "0x32", "0x44", "0x45", "0x4D", "0x4F"]);
      add("txt", ["0xEF", "0xBB", "0xBF"], {
        mime: "text/plain; charset=UTF-8",
        extension: "txt"
      });
      add("txt", ["0xFF", "0xFE"], {
        mime: "text/plain; charset=UTF-16LE",
        extension: "txt"
      });
      add("txt", ["0xFE", "0xFF"], {
        mime: "text/plain; charset=UTF-16BE",
        extension: "txt"
      });
      add("txt", ["0xFF", "0xFE", "0x00", "0x00"], {
        mime: "text/plain; charset=UTF-32LE",
        extension: "txt"
      });
      add("txt", ["0x00", "0x00", "0xFE", "0xFF"], {
        mime: "text/plain; charset=UTF-32BE",
        extension: "txt"
      });
      add("SubRip", ["0x31", "0x0D", "0x0A", "0x30", "0x30", "0x3A"], {
        mime: "application/x-subrip",
        extension: "srt"
      });
      add("WebVTT", [
        "0xEF",
        "0xBB",
        "0xBF",
        "0x57",
        "0x45",
        "0x42",
        "0x56",
        "0x54",
        "0x54",
        "0x0A"
      ], {
        mime: "text/vtt",
        extension: "vtt"
      });
      add("WebVTT", [
        "0xEF",
        "0xBB",
        "0xBF",
        "0x57",
        "0x45",
        "0x42",
        "0x56",
        "0x54",
        "0x54",
        "0x0D"
      ], {
        mime: "text/vtt",
        extension: "vtt"
      });
      add("WebVTT", [
        "0xEF",
        "0xBB",
        "0xBF",
        "0x57",
        "0x45",
        "0x42",
        "0x56",
        "0x54",
        "0x54",
        "0x20"
      ], {
        mime: "text/vtt",
        extension: "vtt"
      });
      add("WebVTT", [
        "0xEF",
        "0xBB",
        "0xBF",
        "0x57",
        "0x45",
        "0x42",
        "0x56",
        "0x54",
        "0x54",
        "0x09"
      ], {
        mime: "text/vtt",
        extension: "vtt"
      });
      add("WebVTT", ["0x57", "0x45", "0x42", "0x56", "0x54", "0x54", "0x0A"], {
        mime: "text/vtt",
        extension: "vtt"
      });
      add("WebVTT", ["0x57", "0x45", "0x42", "0x56", "0x54", "0x54", "0x0D"], {
        mime: "text/vtt",
        extension: "vtt"
      });
      add("WebVTT", ["0x57", "0x45", "0x42", "0x56", "0x54", "0x54", "0x20"], {
        mime: "text/vtt",
        extension: "vtt"
      });
      add("WebVTT", ["0x57", "0x45", "0x42", "0x56", "0x54", "0x54", "0x09"], {
        mime: "text/vtt",
        extension: "vtt"
      });
      add("Json", ["0x7B"], {
        mime: "application/json",
        extension: ".json"
      });
      add("Json", ["0x5B"], {
        mime: "application/json",
        extension: ".json"
      });
      add("ELF", ["0x7F", "0x45", "0x4C", "0x46"], {
        mime: "application/x-executable",
        extension: ".elf"
      });
      add("Mach-O", ["0xFE", "0xED", "0xFA", "0xC"], {
        mime: "application/x-mach-binary",
        extension: ".o"
      });
      add("Mach-O", ["0xFE", "0xED", "0xFA", "0xCF"], {
        mime: "application/x-executable",
        extension: "elf"
      });
      add("EML", ["0x52", "0x65", "0x63", "0x65", "0x69", "0x76", "0x65", "0x64", "0x3A"], {
        mime: "message/rfc822",
        extension: ".eml"
      });
      add("SVG", ["0x3c", "0x73", "0x76", "0x67"], {
        mime: "image/svg+xml",
        extension: "svg"
      });
      patternTree.default = () => tree;
      (function(exports2) {
        var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
          return mod && mod.__esModule ? mod : { "default": mod };
        };
        Object.defineProperty(exports2, "__esModule", { value: true });
        exports2.filetypeextension = exports2.filetypemime = exports2.filetypename = exports2.filetypeinfo = void 0;
        const pattern_tree_1 = __importDefault(patternTree);
        const toHex_12 = toHex$1;
        const patternTree$1 = pattern_tree_1.default();
        const filetypeinfo2 = (bytes) => {
          let tree2 = patternTree$1;
          for (const k of Object.keys(tree2.offset)) {
            const offset = toHex_12.fromHex(k);
            const offsetExceedsFile = offset >= bytes.length;
            if (offsetExceedsFile) {
              continue;
            }
            const node = patternTree$1.offset[k];
            const guessed = walkTree(offset, bytes, node);
            if (guessed.length > 0) {
              return guessed;
            }
          }
          if (tree2.noOffset === null) {
            return [];
          }
          return walkTree(0, bytes, tree2.noOffset);
        };
        exports2.filetypeinfo = filetypeinfo2;
        const walkTree = (index, bytes, node) => {
          let step = node;
          let guessFile = [];
          while (true) {
            const currentByte = toHex_12.toHex(bytes[index]);
            if (step.bytes["?"] && !step.bytes[currentByte]) {
              step = step.bytes["?"];
            } else {
              step = step.bytes[currentByte];
            }
            if (!step) {
              return guessFile;
            }
            if (step && step.matches) {
              guessFile = step.matches.slice(0);
            }
            index += 1;
          }
        };
        exports2.default = exports2.filetypeinfo;
        const filetypename = (bytes) => exports2.filetypeinfo(bytes).map((e) => e.typename);
        exports2.filetypename = filetypename;
        const filetypemime = (bytes) => exports2.filetypeinfo(bytes).map((e) => e.mime ? e.mime : null).filter((x) => x !== null);
        exports2.filetypemime = filetypemime;
        const filetypeextension = (bytes) => exports2.filetypeinfo(bytes).map((e) => e.extension ? e.extension : null).filter((x) => x !== null);
        exports2.filetypeextension = filetypeextension;
      })(dist);
      const filetypeinfo = /* @__PURE__ */ getDefaultExportFromCjs(dist);
      const require$$0 = {
        "Pacific/Niue": "(GMT-11:00) Niue",
        "Pacific/Pago_Pago": "(GMT-11:00) Pago Pago",
        "Pacific/Honolulu": "(GMT-10:00) Hawaii Time",
        "Pacific/Rarotonga": "(GMT-10:00) Rarotonga",
        "Pacific/Tahiti": "(GMT-10:00) Tahiti",
        "Pacific/Marquesas": "(GMT-09:30) Marquesas",
        "America/Anchorage": "(GMT-09:00) Alaska Time",
        "Pacific/Gambier": "(GMT-09:00) Gambier",
        "America/Los_Angeles": "(GMT-08:00) Pacific Time",
        "America/Tijuana": "(GMT-08:00) Pacific Time - Tijuana",
        "America/Vancouver": "(GMT-08:00) Pacific Time - Vancouver",
        "America/Whitehorse": "(GMT-08:00) Pacific Time - Whitehorse",
        "Pacific/Pitcairn": "(GMT-08:00) Pitcairn",
        "America/Dawson_Creek": "(GMT-07:00) Mountain Time - Dawson Creek",
        "America/Denver": "(GMT-07:00) Mountain Time",
        "America/Edmonton": "(GMT-07:00) Mountain Time - Edmonton",
        "America/Hermosillo": "(GMT-07:00) Mountain Time - Hermosillo",
        "America/Mazatlan": "(GMT-07:00) Mountain Time - Chihuahua, Mazatlan",
        "America/Phoenix": "(GMT-07:00) Mountain Time - Arizona",
        "America/Yellowknife": "(GMT-07:00) Mountain Time - Yellowknife",
        "America/Belize": "(GMT-06:00) Belize",
        "America/Chicago": "(GMT-06:00) Central Time",
        "America/Costa_Rica": "(GMT-06:00) Costa Rica",
        "America/El_Salvador": "(GMT-06:00) El Salvador",
        "America/Guatemala": "(GMT-06:00) Guatemala",
        "America/Managua": "(GMT-06:00) Managua",
        "America/Mexico_City": "(GMT-06:00) Central Time - Mexico City",
        "America/Regina": "(GMT-06:00) Central Time - Regina",
        "America/Tegucigalpa": "(GMT-06:00) Central Time - Tegucigalpa",
        "America/Winnipeg": "(GMT-06:00) Central Time - Winnipeg",
        "Pacific/Galapagos": "(GMT-06:00) Galapagos",
        "America/Bogota": "(GMT-05:00) Bogota",
        "America/Cancun": "(GMT-05:00) America Cancun",
        "America/Cayman": "(GMT-05:00) Cayman",
        "America/Guayaquil": "(GMT-05:00) Guayaquil",
        "America/Havana": "(GMT-05:00) Havana",
        "America/Iqaluit": "(GMT-05:00) Eastern Time - Iqaluit",
        "America/Jamaica": "(GMT-05:00) Jamaica",
        "America/Lima": "(GMT-05:00) Lima",
        "America/Nassau": "(GMT-05:00) Nassau",
        "America/New_York": "(GMT-05:00) Eastern Time",
        "America/Panama": "(GMT-05:00) Panama",
        "America/Port-au-Prince": "(GMT-05:00) Port-au-Prince",
        "America/Rio_Branco": "(GMT-05:00) Rio Branco",
        "America/Toronto": "(GMT-05:00) Eastern Time - Toronto",
        "Pacific/Easter": "(GMT-05:00) Easter Island",
        "America/Caracas": "(GMT-04:00) Caracas",
        "America/Asuncion": "(GMT-03:00) Asuncion",
        "America/Barbados": "(GMT-04:00) Barbados",
        "America/Boa_Vista": "(GMT-04:00) Boa Vista",
        "America/Campo_Grande": "(GMT-03:00) Campo Grande",
        "America/Cuiaba": "(GMT-03:00) Cuiaba",
        "America/Curacao": "(GMT-04:00) Curacao",
        "America/Grand_Turk": "(GMT-04:00) Grand Turk",
        "America/Guyana": "(GMT-04:00) Guyana",
        "America/Halifax": "(GMT-04:00) Atlantic Time - Halifax",
        "America/La_Paz": "(GMT-04:00) La Paz",
        "America/Manaus": "(GMT-04:00) Manaus",
        "America/Martinique": "(GMT-04:00) Martinique",
        "America/Port_of_Spain": "(GMT-04:00) Port of Spain",
        "America/Porto_Velho": "(GMT-04:00) Porto Velho",
        "America/Puerto_Rico": "(GMT-04:00) Puerto Rico",
        "America/Santo_Domingo": "(GMT-04:00) Santo Domingo",
        "America/Thule": "(GMT-04:00) Thule",
        "Atlantic/Bermuda": "(GMT-04:00) Bermuda",
        "America/St_Johns": "(GMT-03:30) Newfoundland Time - St. Johns",
        "America/Araguaina": "(GMT-03:00) Araguaina",
        "America/Argentina/Buenos_Aires": "(GMT-03:00) Buenos Aires",
        "America/Bahia": "(GMT-03:00) Salvador",
        "America/Belem": "(GMT-03:00) Belem",
        "America/Cayenne": "(GMT-03:00) Cayenne",
        "America/Fortaleza": "(GMT-03:00) Fortaleza",
        "America/Godthab": "(GMT-03:00) Godthab",
        "America/Maceio": "(GMT-03:00) Maceio",
        "America/Miquelon": "(GMT-03:00) Miquelon",
        "America/Montevideo": "(GMT-03:00) Montevideo",
        "America/Paramaribo": "(GMT-03:00) Paramaribo",
        "America/Recife": "(GMT-03:00) Recife",
        "America/Santiago": "(GMT-03:00) Santiago",
        "America/Sao_Paulo": "(GMT-03:00) Sao Paulo",
        "Antarctica/Palmer": "(GMT-03:00) Palmer",
        "Antarctica/Rothera": "(GMT-03:00) Rothera",
        "Atlantic/Stanley": "(GMT-03:00) Stanley",
        "America/Noronha": "(GMT-02:00) Noronha",
        "Atlantic/South_Georgia": "(GMT-02:00) South Georgia",
        "America/Scoresbysund": "(GMT-01:00) Scoresbysund",
        "Atlantic/Azores": "(GMT-01:00) Azores",
        "Atlantic/Cape_Verde": "(GMT-01:00) Cape Verde",
        "Africa/Abidjan": "(GMT+00:00) Abidjan",
        "Africa/Accra": "(GMT+00:00) Accra",
        "Africa/Bissau": "(GMT+00:00) Bissau",
        "Africa/Casablanca": "(GMT+00:00) Casablanca",
        "Africa/El_Aaiun": "(GMT+00:00) El Aaiun",
        "Africa/Monrovia": "(GMT+00:00) Monrovia",
        "America/Danmarkshavn": "(GMT+00:00) Danmarkshavn",
        "Atlantic/Canary": "(GMT+00:00) Canary Islands",
        "Atlantic/Faroe": "(GMT+00:00) Faeroe",
        "Atlantic/Reykjavik": "(GMT+00:00) Reykjavik",
        "Etc/GMT": "(GMT+00:00) GMT (no daylight saving)",
        "Europe/Dublin": "(GMT+00:00) Dublin",
        "Europe/Lisbon": "(GMT+00:00) Lisbon",
        "Europe/London": "(GMT+00:00) London",
        "Africa/Algiers": "(GMT+01:00) Algiers",
        "Africa/Ceuta": "(GMT+01:00) Ceuta",
        "Africa/Lagos": "(GMT+01:00) Lagos",
        "Africa/Ndjamena": "(GMT+01:00) Ndjamena",
        "Africa/Tunis": "(GMT+01:00) Tunis",
        "Africa/Windhoek": "(GMT+02:00) Windhoek",
        "Europe/Amsterdam": "(GMT+01:00) Amsterdam",
        "Europe/Andorra": "(GMT+01:00) Andorra",
        "Europe/Belgrade": "(GMT+01:00) Central European Time - Belgrade",
        "Europe/Berlin": "(GMT+01:00) Berlin",
        "Europe/Brussels": "(GMT+01:00) Brussels",
        "Europe/Budapest": "(GMT+01:00) Budapest",
        "Europe/Copenhagen": "(GMT+01:00) Copenhagen",
        "Europe/Gibraltar": "(GMT+01:00) Gibraltar",
        "Europe/Luxembourg": "(GMT+01:00) Luxembourg",
        "Europe/Madrid": "(GMT+01:00) Madrid",
        "Europe/Malta": "(GMT+01:00) Malta",
        "Europe/Monaco": "(GMT+01:00) Monaco",
        "Europe/Oslo": "(GMT+01:00) Oslo",
        "Europe/Paris": "(GMT+01:00) Paris",
        "Europe/Prague": "(GMT+01:00) Central European Time - Prague",
        "Europe/Rome": "(GMT+01:00) Rome",
        "Europe/Stockholm": "(GMT+01:00) Stockholm",
        "Europe/Tirane": "(GMT+01:00) Tirane",
        "Europe/Vienna": "(GMT+01:00) Vienna",
        "Europe/Warsaw": "(GMT+01:00) Warsaw",
        "Europe/Zurich": "(GMT+01:00) Zurich",
        "Africa/Cairo": "(GMT+02:00) Cairo",
        "Africa/Johannesburg": "(GMT+02:00) Johannesburg",
        "Africa/Maputo": "(GMT+02:00) Maputo",
        "Africa/Tripoli": "(GMT+02:00) Tripoli",
        "Asia/Amman": "(GMT+02:00) Amman",
        "Asia/Beirut": "(GMT+02:00) Beirut",
        "Asia/Damascus": "(GMT+02:00) Damascus",
        "Asia/Gaza": "(GMT+02:00) Gaza",
        "Asia/Jerusalem": "(GMT+02:00) Jerusalem",
        "Asia/Nicosia": "(GMT+02:00) Nicosia",
        "Europe/Athens": "(GMT+02:00) Athens",
        "Europe/Bucharest": "(GMT+02:00) Bucharest",
        "Europe/Chisinau": "(GMT+02:00) Chisinau",
        "Europe/Helsinki": "(GMT+02:00) Helsinki",
        "Europe/Istanbul": "(GMT+03:00) Istanbul",
        "Europe/Kaliningrad": "(GMT+02:00) Moscow-01 - Kaliningrad",
        "Europe/Kyiv": "(GMT+02:00) Kyiv",
        "Europe/Riga": "(GMT+02:00) Riga",
        "Europe/Sofia": "(GMT+02:00) Sofia",
        "Europe/Tallinn": "(GMT+02:00) Tallinn",
        "Europe/Vilnius": "(GMT+02:00) Vilnius",
        "Africa/Khartoum": "(GMT+03:00) Khartoum",
        "Africa/Nairobi": "(GMT+03:00) Nairobi",
        "Antarctica/Syowa": "(GMT+03:00) Syowa",
        "Asia/Baghdad": "(GMT+03:00) Baghdad",
        "Asia/Qatar": "(GMT+03:00) Qatar",
        "Asia/Riyadh": "(GMT+03:00) Riyadh",
        "Europe/Minsk": "(GMT+03:00) Minsk",
        "Europe/Moscow": "(GMT+03:00) Moscow+00 - Moscow",
        "Asia/Tehran": "(GMT+03:30) Tehran",
        "Asia/Baku": "(GMT+04:00) Baku",
        "Asia/Dubai": "(GMT+04:00) Dubai",
        "Asia/Tbilisi": "(GMT+04:00) Tbilisi",
        "Asia/Yerevan": "(GMT+04:00) Yerevan",
        "Europe/Samara": "(GMT+04:00) Moscow+01 - Samara",
        "Indian/Mahe": "(GMT+04:00) Mahe",
        "Indian/Mauritius": "(GMT+04:00) Mauritius",
        "Indian/Reunion": "(GMT+04:00) Reunion",
        "Asia/Kabul": "(GMT+04:30) Kabul",
        "Antarctica/Mawson": "(GMT+05:00) Mawson",
        "Asia/Aqtau": "(GMT+05:00) Aqtau",
        "Asia/Aqtobe": "(GMT+05:00) Aqtobe",
        "Asia/Ashgabat": "(GMT+05:00) Ashgabat",
        "Asia/Dushanbe": "(GMT+05:00) Dushanbe",
        "Asia/Karachi": "(GMT+05:00) Karachi",
        "Asia/Tashkent": "(GMT+05:00) Tashkent",
        "Asia/Yekaterinburg": "(GMT+05:00) Moscow+02 - Yekaterinburg",
        "Indian/Kerguelen": "(GMT+05:00) Kerguelen",
        "Indian/Maldives": "(GMT+05:00) Maldives",
        "Asia/Calcutta": "(GMT+05:30) India Standard Time",
        "Asia/Colombo": "(GMT+05:30) Colombo",
        "Asia/Katmandu": "(GMT+05:45) Katmandu",
        "Antarctica/Vostok": "(GMT+06:00) Vostok",
        "Asia/Almaty": "(GMT+06:00) Almaty",
        "Asia/Bishkek": "(GMT+06:00) Bishkek",
        "Asia/Dhaka": "(GMT+06:00) Dhaka",
        "Asia/Omsk": "(GMT+06:00) Moscow+03 - Omsk, Novosibirsk",
        "Asia/Thimphu": "(GMT+06:00) Thimphu",
        "Indian/Chagos": "(GMT+06:00) Chagos",
        "Asia/Rangoon": "(GMT+06:30) Rangoon",
        "Indian/Cocos": "(GMT+06:30) Cocos",
        "Antarctica/Davis": "(GMT+07:00) Davis",
        "Asia/Bangkok": "(GMT+07:00) Bangkok",
        "Asia/Hovd": "(GMT+07:00) Hovd",
        "Asia/Jakarta": "(GMT+07:00) Jakarta",
        "Asia/Krasnoyarsk": "(GMT+07:00) Moscow+04 - Krasnoyarsk",
        "Asia/Saigon": "(GMT+07:00) Hanoi",
        "Asia/Ho_Chi_Minh": "(GMT+07:00) Ho Chi Minh",
        "Indian/Christmas": "(GMT+07:00) Christmas",
        "Antarctica/Casey": "(GMT+08:00) Casey",
        "Asia/Brunei": "(GMT+08:00) Brunei",
        "Asia/Choibalsan": "(GMT+08:00) Choibalsan",
        "Asia/Hong_Kong": "(GMT+08:00) Hong Kong",
        "Asia/Irkutsk": "(GMT+08:00) Moscow+05 - Irkutsk",
        "Asia/Kuala_Lumpur": "(GMT+08:00) Kuala Lumpur",
        "Asia/Macau": "(GMT+08:00) Macau",
        "Asia/Makassar": "(GMT+08:00) Makassar",
        "Asia/Manila": "(GMT+08:00) Manila",
        "Asia/Shanghai": "(GMT+08:00) China Time - Beijing",
        "Asia/Singapore": "(GMT+08:00) Singapore",
        "Asia/Taipei": "(GMT+08:00) Taipei",
        "Asia/Ulaanbaatar": "(GMT+08:00) Ulaanbaatar",
        "Australia/Perth": "(GMT+08:00) Western Time - Perth",
        "Asia/Pyongyang": "(GMT+08:30) Pyongyang",
        "Asia/Dili": "(GMT+09:00) Dili",
        "Asia/Jayapura": "(GMT+09:00) Jayapura",
        "Asia/Seoul": "(GMT+09:00) Seoul",
        "Asia/Tokyo": "(GMT+09:00) Tokyo",
        "Asia/Yakutsk": "(GMT+09:00) Moscow+06 - Yakutsk",
        "Pacific/Palau": "(GMT+09:00) Palau",
        "Australia/Adelaide": "(GMT+10:30) Central Time - Adelaide",
        "Australia/Darwin": "(GMT+09:30) Central Time - Darwin",
        "Antarctica/DumontDUrville": "(GMT+10:00) Dumont D'Urville",
        "Asia/Magadan": "(GMT+10:00) Moscow+07 - Magadan",
        "Asia/Vladivostok": "(GMT+10:00) Moscow+07 - Vladivostok",
        "Australia/Brisbane": "(GMT+10:00) Eastern Time - Brisbane",
        "Asia/Yuzhno-Sakhalinsk": "(GMT+11:00) Moscow+08 - Yuzhno-Sakhalinsk",
        "Australia/Hobart": "(GMT+11:00) Eastern Time - Hobart",
        "Australia/Sydney": "(GMT+11:00) Eastern Time - Melbourne, Sydney",
        "Pacific/Chuuk": "(GMT+10:00) Truk",
        "Pacific/Guam": "(GMT+10:00) Guam",
        "Pacific/Port_Moresby": "(GMT+10:00) Port Moresby",
        "Pacific/Efate": "(GMT+11:00) Efate",
        "Pacific/Guadalcanal": "(GMT+11:00) Guadalcanal",
        "Pacific/Kosrae": "(GMT+11:00) Kosrae",
        "Pacific/Norfolk": "(GMT+11:00) Norfolk",
        "Pacific/Noumea": "(GMT+11:00) Noumea",
        "Pacific/Pohnpei": "(GMT+11:00) Ponape",
        "Asia/Kamchatka": "(GMT+12:00) Moscow+09 - Petropavlovsk-Kamchatskiy",
        "Pacific/Auckland": "(GMT+13:00) Auckland",
        "Pacific/Fiji": "(GMT+13:00) Fiji",
        "Pacific/Funafuti": "(GMT+12:00) Funafuti",
        "Pacific/Kwajalein": "(GMT+12:00) Kwajalein",
        "Pacific/Majuro": "(GMT+12:00) Majuro",
        "Pacific/Nauru": "(GMT+12:00) Nauru",
        "Pacific/Tarawa": "(GMT+12:00) Tarawa",
        "Pacific/Wake": "(GMT+12:00) Wake",
        "Pacific/Wallis": "(GMT+12:00) Wallis",
        "Pacific/Apia": "(GMT+14:00) Apia",
        "Pacific/Enderbury": "(GMT+13:00) Enderbury",
        "Pacific/Fakaofo": "(GMT+13:00) Fakaofo",
        "Pacific/Tongatapu": "(GMT+13:00) Tongatapu",
        "Pacific/Kiritimati": "(GMT+14:00) Kiritimati"
      };
      var googleTimezonesJson = require$$0;
      const timezones = /* @__PURE__ */ getDefaultExportFromCjs(googleTimezonesJson);
      dayjs.extend(dayjs_plugin_utc);
      dayjs.extend(dayjs_plugin_timezone);
      function camelToSnake(obj) {
        function toSnakeCase(str) {
          return str.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase());
        }
        function convertKeys(obj2) {
          const converted = {};
          for (const key in obj2) {
            if (Object.prototype.hasOwnProperty.call(obj2, key)) {
              const snakeCaseKey = toSnakeCase(key);
              if (typeof obj2[key] === "object" && !Array.isArray(obj2[key])) {
                converted[snakeCaseKey] = convertKeys(obj2[key]);
              } else if (Array.isArray(obj2[key])) {
                converted[snakeCaseKey] = obj2[key].map((item) => {
                  if (typeof item === "object" && !Array.isArray(item)) {
                    return convertKeys(item);
                  } else {
                    return item;
                  }
                });
              } else {
                converted[snakeCaseKey] = obj2[key];
              }
            }
          }
          return converted;
        }
        return convertKeys(obj);
      }
      function getRandomItemFromArray(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
      }
      function formatTimeWithTimezone(timestamp, format2, timezone = "Asia/Shanghai") {
        const res = dayjs(timestamp).tz(timezone).format(format2);
        return res;
      }
      const fileNameMap = {
        index: "序号",
        title: "标题",
        nickname: "发布者昵称",
        publishTime: "发布时间",
        ipLocation: "ip归属地",
        userId: "发布者id",
        noteId: "笔记id",
        width: "宽度",
        height: "高度"
      };
      function getFileName(fileInfo, noSequence = false) {
        var _a2;
        if (!fileInfo.title) return "";
        let rule = (_a2 = fileInfo.nameRule) == null ? void 0 : _a2.replaceAll("\n", "");
        for (const key in fileNameMap) {
          const keyName = key;
          const value = fileNameMap[keyName];
          let regexp = new RegExp(`<${value}>`, "g");
          rule = rule.replaceAll(/\$.*?\$/g, (val) => {
            if (val.includes("序号")) {
              if (noSequence) val = "";
            } else if (val.includes("宽度") || val.includes("高度")) {
              if (fileInfo.width == 0) val = "";
            }
            const res = val.replaceAll("$", "");
            return res;
          });
          if (key == "publishTime") {
            rule = rule.replace(
              regexp,
              formatTimeWithTimezone(
                fileInfo[key],
                fileInfo.timeFormatRule || "YYYY年MM月DD日HH时mm分ss秒",
                fileInfo.timezone
              )
            );
          } else {
            rule = rule.replace(regexp, fileInfo[keyName] + "");
          }
        }
        return rule;
      }
      const timezoneList = Object.entries(timezones).map(([key, value]) => {
        return {
          label: value,
          value: key
        };
      });
      async function copyToClipboard(text) {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
          }
          return true;
        } catch (error) {
          console.error("Failed to copy text:", error);
          return false;
        }
      }
      const useMainStore = pinia.defineStore("main", {
        state: () => ({
          note: void 0,
          rpcSocket: void 0,
          isConnected: false
        }),
        actions: {
          setNote(note) {
            this.note = note;
          },
          initSocket() {
            var _a2;
            ElMessage.info("远程下载：初始化连接");
            const storageStore = useStorageStore();
            (_a2 = this.rpcSocket) == null ? void 0 : _a2.close();
            this.rpcSocket = new WebSocket(storageStore.setting.jsonRpcUrl);
            this.rpcSocket.onerror = (_err) => {
              this.isConnected = false;
              ElMessage.error({
                message: "远程下载：连接失败,请检查连接地址是否正确",
                duration: 8e3
              });
            };
            this.rpcSocket.onclose = (e) => {
              this.isConnected = false;
              console.log(e);
              if (e.code != 1e3) {
                ElMessage.error("远程下载：连接关闭");
              }
            };
            this.rpcSocket.onopen = () => {
              this.isConnected = true;
              ElMessage.success("远程下载：连接打开");
            };
            this.rpcSocket.onmessage = ({ data }) => {
              var _a3, _b, _c;
              data = JSON.parse(data);
              console.log("来消息啦", data);
              if (data.error) {
                ElMessage.error({
                  message: "远程下载：连接失败，请检查连接地址、连接秘钥是否正确" + JSON.stringify(data.error),
                  duration: 8e3
                });
                this.isConnected = false;
              } else if (data.method == "aria2.onDownloadStart") ;
              else if (data.method == "aria2.onDownloadComplete") {
                const gid = (_a3 = data.params[0]) == null ? void 0 : _a3.gid;
                (_b = this.rpcSocket) == null ? void 0 : _b.send(
                  JSON.stringify({
                    id: "下载成功",
                    // jsonrpc: '2.0',
                    method: "aria2.tellStatus",
                    params: [`token:${storageStore.setting.jsonRpcToken}`, gid]
                  })
                );
              } else if (data.method == "aria2.onDownloadError") {
                ElMessage.error("远程下载：下载失败，请检查下载路径是否正确");
              } else if ((data == null ? void 0 : data.result[0]) && ((_c = data == null ? void 0 : data.result[0]) == null ? void 0 : _c.message) == "Unauthorized") {
                ElMessage.error({
                  message: "远程下载：批量下载失败，请检查秘钥是否正确",
                  duration: 5e3
                });
                this.isConnected = false;
              } else if (data.id == "批量下载") {
                ElMessage.success("远程下载：已添加到下载列表");
              } else if (data.id == "连接测试") {
                ElMessage.success("远程下载：连接成功");
              } else if (data.id == "下载成功") {
                const fileName = data.result.files[0].path.split("/").pop();
                ElMessage.success({
                  message: "下载成功：" + fileName,
                  duration: 8e3
                });
              }
            };
          },
          testSocket() {
            const storageStore = useStorageStore();
            this.initSocket();
            setTimeout(() => {
              var _a2;
              const data = {
                id: "连接测试",
                // jsonrpc: '2.0',
                method: "aria2.getVersion",
                params: [`token:${storageStore.setting.jsonRpcToken}`]
              };
              (_a2 = this.rpcSocket) == null ? void 0 : _a2.send(JSON.stringify(data));
            }, 3e3);
          },
          download(list) {
            var _a2;
            if (!(list == null ? void 0 : list.length)) return;
            const storageStore = useStorageStore();
            const token = storageStore.setting.jsonRpcToken;
            const downloadLocation = storageStore.setting.downloadLocation;
            const urlList = list.map((item) => {
              return {
                methodName: "aria2.addUri",
                params: [
                  `token:${token}`,
                  [item.url],
                  {
                    dir: (downloadLocation ? downloadLocation + "/" : downloadLocation) + item.dir || "",
                    out: item.name
                  }
                ]
              };
            });
            console.log("下载列表", urlList);
            const data = {
              id: "批量下载",
              // jsonrpc: '2.0',
              method: "system.multicall",
              params: [urlList]
            };
            (_a2 = this.rpcSocket) == null ? void 0 : _a2.send(JSON.stringify(data));
          }
        },
        persist: false
      });
      function useFileName(state) {
        const fileNameExample = vue.ref("");
        const mainStore = useMainStore();
        const storageStore = useStorageStore();
        const fileName = (title, index = 1, width = 900, height = 1600, noSequence = false) => {
          const note = mainStore.note;
          const { nameRule: nameRule2, timeFormatRule, timezone } = storageStore.setting;
          return getFileName(
            {
              title,
              nickname: note == null ? void 0 : note.user.nickname,
              publishTime: note == null ? void 0 : note.time,
              userId: note == null ? void 0 : note.user.user_id,
              noteId: note == null ? void 0 : note.note_id,
              ipLocation: (note == null ? void 0 : note.ip_location) || "未知",
              index,
              height,
              width,
              nameRule: nameRule2,
              timeFormatRule,
              timezone
            },
            noSequence
          );
        };
        vue.watch(
          [
            () => state == null ? void 0 : state.title,
            () => storageStore.setting.nameRule,
            () => {
              var _a2;
              return (_a2 = mainStore.note) == null ? void 0 : _a2.title;
            },
            () => storageStore.setting.timeFormatRule
          ],
          () => {
            var _a2, _b;
            fileNameExample.value = fileName(
              state.title || ((_a2 = mainStore.note) == null ? void 0 : _a2.title) || ((_b = mainStore.note) == null ? void 0 : _b.desc.slice(20))
            );
          },
          { immediate: true }
        );
        return {
          fileNameExample,
          getFileName: fileName
        };
      }
      const _hoisted_1$2 = { class: "xhs-modal-header" };
      const _hoisted_2$1 = { class: "flex-center" };
      const _hoisted_3$1 = { class: "example red" };
      const _hoisted_4$1 = { class: "example" };
      const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
        __name: "Setting",
        props: {
          modelValue: {
            type: Boolean,
            default: false
          }
        },
        emits: ["update:modelValue"],
        setup(__props, { emit: __emit }) {
          const emit = __emit;
          const props = __props;
          const isOpenSetting = vue.computed({
            get: () => props.modelValue,
            set: (val) => {
              emit("update:modelValue", val);
            }
          });
          const storageStore = useStorageStore();
          const mainStore = useMainStore();
          const form = vue.reactive({
            nameRule: "",
            timeFormatRule: "",
            timezone: "",
            jsonRpcUrl: "",
            downloadLocation: "",
            jsonRpcToken: "",
            useNameAsDir: true,
            useTitleAsDir: true,
            openRpcDownload: false
          });
          function handleOpenRpcDownload(val) {
            if (val) {
              test();
            }
          }
          vue.watch(
            [() => form],
            ([val]) => {
              storageStore.setSetting({
                ...val,
                jsonRpcUrl: form.jsonRpcUrl.replace("http://", "")
              });
            },
            { deep: true }
          );
          const { fileNameExample } = useFileName("");
          vue.onMounted(() => {
            init();
          });
          function init() {
            Object.assign(form, JSON.parse(JSON.stringify(storageStore.setting)));
          }
          function test() {
            mainStore.testSocket();
          }
          function reset() {
            storageStore.reset();
            init();
          }
          return (_ctx, _cache) => {
            const _component_el_button = ElButton;
            const _component_el_space = ElSpace;
            const _component_el_divider = ElDivider;
            const _component_el_input = ElInput;
            const _component_el_form_item = ElFormItem;
            const _component_el_option = ElOption;
            const _component_el_select = ElSelect;
            const _component_el_checkbox = ElCheckbox;
            const _component_el_switch = ElSwitch;
            const _component_el_form = ElForm;
            const _component_el_drawer = ElDrawer;
            return vue.openBlock(), vue.createBlock(_component_el_drawer, {
              modelValue: vue.unref(isOpenSetting),
              "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => vue.isRef(isOpenSetting) ? isOpenSetting.value = $event : null),
              "destroy-on-close": "",
              class: "xhs"
            }, {
              header: vue.withCtx(() => [
                vue.createElementVNode("div", _hoisted_1$2, [
                  _cache[11] || (_cache[11] = vue.createElementVNode("div", { class: "title" }, "小红书下载助手 设置", -1)),
                  vue.createElementVNode("div", _hoisted_2$1, [
                    vue.createVNode(_component_el_space, { size: 20 }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_button, {
                          size: "small",
                          type: "warning",
                          onClick: reset
                        }, {
                          default: vue.withCtx(() => _cache[10] || (_cache[10] = [
                            vue.createTextVNode(" 重置设置 ")
                          ])),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_form, null, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_divider, null, {
                      default: vue.withCtx(() => _cache[12] || (_cache[12] = [
                        vue.createElementVNode("div", { class: "title" }, "文件命名设置", -1)
                      ])),
                      _: 1
                    }),
                    vue.createVNode(_component_el_form_item, {
                      label: "命名规则",
                      "label-width": "6rem"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_input, {
                          modelValue: vue.unref(form).nameRule,
                          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(form).nameRule = $event),
                          type: "textarea",
                          rows: 6
                        }, null, 8, ["modelValue"]),
                        vue.createElementVNode("div", _hoisted_3$1, "示例：" + vue.toDisplayString(vue.unref(fileNameExample) || "-"), 1),
                        vue.createElementVNode("div", _hoisted_4$1, " 全局变量：" + vue.toDisplayString(Object.entries(vue.unref(fileNameMap)).map(([key, label]) => label).join(",")), 1)
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_form_item, {
                      label: "时间格式",
                      "label-width": "6rem"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_input, {
                          modelValue: vue.unref(form).timeFormatRule,
                          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(form).timeFormatRule = $event)
                        }, null, 8, ["modelValue"]),
                        _cache[13] || (_cache[13] = vue.createElementVNode("div", { class: "example red" }, [
                          vue.createElementVNode("a", {
                            href: "https://dayjs.fenxianglu.cn/category/display.html#%E6%A0%BC%E5%BC%8F%E5%8C%96",
                            target: "_blank"
                          }, " 格式参考 ")
                        ], -1))
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_form_item, {
                      label: "时区",
                      "label-width": "6rem"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_select, {
                          modelValue: vue.unref(form).timezone,
                          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(form).timezone = $event)
                        }, {
                          default: vue.withCtx(() => [
                            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(timezoneList), (item) => {
                              return vue.openBlock(), vue.createBlock(_component_el_option, {
                                key: item.value,
                                label: item.label,
                                value: item.value
                              }, null, 8, ["label", "value"]);
                            }), 128))
                          ]),
                          _: 1
                        }, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_divider, null, {
                      default: vue.withCtx(() => _cache[14] || (_cache[14] = [
                        vue.createElementVNode("div", { class: "title" }, "远程下载设置", -1)
                      ])),
                      _: 1
                    }),
                    vue.createVNode(_component_el_form_item, {
                      label: "请求地址",
                      "label-width": "6rem"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_input, {
                          modelValue: vue.unref(form).jsonRpcUrl,
                          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(form).jsonRpcUrl = $event)
                        }, {
                          append: vue.withCtx(() => [
                            vue.createVNode(_component_el_button, { onClick: test }, {
                              default: vue.withCtx(() => _cache[15] || (_cache[15] = [
                                vue.createTextVNode("测试连接")
                              ])),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_form_item, {
                      label: "rpc秘钥",
                      "label-width": "6rem"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_input, {
                          modelValue: vue.unref(form).jsonRpcToken,
                          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(form).jsonRpcToken = $event)
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_form_item, {
                      label: "下载位置",
                      "label-width": "6rem"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_input, {
                          modelValue: vue.unref(form).downloadLocation,
                          "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.unref(form).downloadLocation = $event)
                        }, null, 8, ["modelValue"]),
                        _cache[16] || (_cache[16] = vue.createElementVNode("div", { class: "example" }, "示例：F:\\test", -1))
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_form_item, {
                      label: "文件分类",
                      "label-width": "6rem"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_checkbox, {
                          modelValue: vue.unref(form).useNameAsDir,
                          "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => vue.unref(form).useNameAsDir = $event)
                        }, {
                          default: vue.withCtx(() => _cache[17] || (_cache[17] = [
                            vue.createElementVNode("div", { class: "flex-center" }, "按作者昵称分类", -1)
                          ])),
                          _: 1
                        }, 8, ["modelValue"]),
                        vue.createVNode(_component_el_checkbox, {
                          modelValue: vue.unref(form).useTitleAsDir,
                          "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => vue.unref(form).useTitleAsDir = $event)
                        }, {
                          default: vue.withCtx(() => _cache[18] || (_cache[18] = [
                            vue.createElementVNode("div", { class: "flex-center" }, "按笔记标题分类", -1)
                          ])),
                          _: 1
                        }, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_form_item, {
                      label: "远程下载",
                      "label-width": "6rem"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_switch, {
                          modelValue: vue.unref(form).openRpcDownload,
                          "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => vue.unref(form).openRpcDownload = $event),
                          "active-text": "开",
                          "inactive-text": "关",
                          "inline-prompt": "",
                          onChange: handleOpenRpcDownload
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["modelValue"]);
          };
        }
      });
      const Setting = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-eb1c182f"]]);
      async function downloadLargeFile(url, fileName, onProgress) {
        var _a2;
        console.log("开始下载", fileName, url);
        try {
          const fileStream = StreamSaver.createWriteStream(fileName);
          const writer = fileStream.getWriter();
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
          }
          const contentLength = response.headers.get("Content-Length");
          const total = contentLength ? parseInt(contentLength, 10) : void 0;
          const reader = (_a2 = response.body) == null ? void 0 : _a2.getReader();
          if (!reader) {
            throw new Error("Failed to access response body");
          }
          let loaded = 0;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            await writer.write(value);
            loaded += value.length;
            if (onProgress && total !== void 0) {
              onProgress(loaded, total);
            } else if (onProgress) {
              onProgress(loaded);
            }
          }
          writer.close();
          console.log(`${fileName} downloaded successfully!`);
        } catch (error) {
          console.error("Error during download:", error);
          throw error;
        }
      }
      async function getFileExtensionFromPartialContent(url) {
        try {
          const response = await fetch(url, {
            headers: {
              Range: "bytes=0-1024"
              // 只请求前 1024 字节
            }
          });
          if (!response.ok) {
            throw new Error(`请求失败，状态码：${response.status}`);
          }
          const buffer = await response.arrayBuffer();
          const fileType = filetypeinfo(new Uint8Array(buffer));
          const sub = "." + fileType[0].extension;
          return sub;
        } catch (error) {
          throw new Error("文件名推断请求出错: ");
        }
      }
      const _hoisted_1$1 = { class: "xhs-modal-header" };
      const _hoisted_2 = { class: "title" };
      const _hoisted_3 = { class: "flex-center" };
      const _hoisted_4 = { class: "flex-center" };
      const _hoisted_5 = { class: "item" };
      const _hoisted_6 = ["src"];
      const _hoisted_7 = { class: "progress" };
      const _hoisted_8 = {
        key: 0,
        class: "tag"
      };
      const _hoisted_9 = {
        key: 1,
        class: "tag"
      };
      const _hoisted_10 = { key: 1 };
      const _hoisted_11 = { class: "example red" };
      const _hoisted_12 = { class: "btns" };
      const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
        __name: "Download",
        props: {
          modelValue: {
            type: Boolean,
            default: ""
          }
        },
        emits: ["update:modelValue", "loginClick", "settingClick", "activeClick"],
        setup(__props, { emit: __emit }) {
          const store = useMainStore();
          const storageStore = useStorageStore();
          const emit = __emit;
          const props = __props;
          const isOpenDownload = vue.computed({
            get: () => props.modelValue,
            set: (val) => {
              emit("update:modelValue", val);
            }
          });
          vue.watch(
            () => isOpenDownload.value,
            (val) => {
              if (val) {
                initState();
              }
            }
          );
          const state = vue.reactive({
            checkList: [],
            title: ""
          });
          async function initState() {
            var _a2, _b;
            state.title = ((_a2 = store.note) == null ? void 0 : _a2.title.slice(0, 80)) || ((_b = store.note) == null ? void 0 : _b.desc.slice(0, 80)) || "";
            size.value = storageStore.setting.downloadSize;
            col.value = storageStore.setting.col;
            handleCheckAllChange(true);
          }
          const col = vue.ref(4);
          const { fileNameExample, getFileName: getFileName2 } = useFileName(state);
          function handleDownloadTypeChnage(e) {
            var _a2, _b;
            storageStore.setDownloadType((_a2 = store.note) == null ? void 0 : _a2.type, e);
            (_b = store.note) == null ? void 0 : _b.image_list.forEach((item) => {
              item.progress = "0%";
            });
          }
          const checkAll = vue.computed(() => {
            if (store.note) {
              return state.checkList.length == store.note.image_list.length;
            }
          });
          const checkAllIndeterminate = vue.computed(() => {
            var _a2;
            const listLength = ((_a2 = store.note) == null ? void 0 : _a2.image_list.length) || 0;
            return state.checkList.length < listLength && state.checkList.length > 0;
          });
          function handleCheckAllChange(val) {
            var _a2;
            if (store.note) {
              if (val) {
                state.checkList = (_a2 = store.note) == null ? void 0 : _a2.image_list.map((item, index) => {
                  return index;
                });
              } else {
                state.checkList = [];
              }
            }
          }
          function getDonwloadItemList() {
            const note = store.note;
            const list = note == null ? void 0 : note.image_list.filter((_, index) => {
              return state.checkList.includes(index);
            });
            return list;
          }
          async function getDownloadUrlList(isCopy = false) {
            var _a2, _b, _c, _d, _e, _f, _g;
            const list = getDonwloadItemList();
            const note = store.note;
            const { useNameAsDir, useTitleAsDir } = storageStore.setting;
            if (!(list == null ? void 0 : list.length)) return [];
            const resList = [];
            for (let index = 0; index < list.length; index++) {
              const item = list[index];
              let sub = "";
              let dir = "";
              let url = getDownloadUrl(item);
              let name = "";
              let height = item.height;
              let width = item.width;
              if (useNameAsDir && (note == null ? void 0 : note.user.nickname)) {
                dir += (note == null ? void 0 : note.user.nickname) + "/";
              }
              if (useTitleAsDir && state.title) {
                dir += state.title + "/";
              }
              let urlDefault = "";
              if (isCopy) {
                if ((note == null ? void 0 : note.type) == "video") {
                  urlDefault = (_d = (_c = (_b = (_a2 = note.video) == null ? void 0 : _a2.media) == null ? void 0 : _b.stream) == null ? void 0 : _c.h265[0]) == null ? void 0 : _d.master_url;
                } else if (item.live_photo && storageStore.setting.preferLive) {
                  urlDefault = (_f = (_e = item.stream) == null ? void 0 : _e.h264[0]) == null ? void 0 : _f.master_url;
                } else {
                  urlDefault = item.url_default;
                }
              } else {
                try {
                  sub = await getFileExtensionFromPartialContent(url);
                } catch (error) {
                  console.log("文件名推断出错了");
                  try {
                    console.log("再次推断");
                    const urlArr = url.split("/");
                    urlArr[2] += "/notes_pre_post";
                    url = urlArr.join("/");
                    console.log(url);
                    sub = await getFileExtensionFromPartialContent(url);
                  } catch (error2) {
                    console.log("推断再次出错");
                  }
                }
                if ((note == null ? void 0 : note.type) == "video" || item.live_photo || storageStore.setting.downLoadTypeObj[(_g = store.note) == null ? void 0 : _g.type] == downLoadType.default) {
                  width = 0;
                }
                name = getFileName2(state.title, index + 1, width, height, list.length <= 1) + sub;
              }
              resList.push({
                name,
                url,
                dir,
                file: item,
                urlDefault
              });
            }
            return resList;
          }
          async function downLoad(useAria2 = false) {
            const list = await getDownloadUrlList();
            if (!useAria2) {
              list == null ? void 0 : list.forEach((item) => {
                downloadLargeFile(item.url, item.name, (loaded, total) => {
                  if (total) {
                    item.file.progress = (loaded / total * 100).toFixed(2) + "%";
                  } else {
                    item.file.progress = "已下载" + (loaded / 1024 / 1024).toFixed(2) + "M";
                  }
                });
              });
            } else if (useAria2 && (list == null ? void 0 : list.length)) {
              store.download(list);
            }
          }
          function getDownloadUrl(file) {
            var _a2, _b, _c, _d, _e, _f, _g, _h;
            if (!store.note) return;
            const note = store.note;
            const setting = storageStore.setting;
            const noteType = note.type;
            const downloadType = setting.downLoadTypeObj[noteType];
            const preferLive = setting.preferLive;
            let url = "";
            let data = null;
            if (noteType == "normal") {
              const url2 = file.url_default;
              const key = url2.match(keyReg)[0];
              data = {
                url: url2,
                originUrl: getRandomItemFromArray(imageServer) + key,
                liveUrl: (file == null ? void 0 : file.live_photo) ? (_b = (_a2 = file.stream) == null ? void 0 : _a2.h264[0]) == null ? void 0 : _b.master_url : ""
              };
            } else {
              data = {
                url: (_f = (_e = (_d = (_c = note.video) == null ? void 0 : _c.media) == null ? void 0 : _d.stream) == null ? void 0 : _e.h265[0]) == null ? void 0 : _f.master_url,
                originUrl: getRandomItemFromArray(videoServer) + ((_h = (_g = note.video) == null ? void 0 : _g.consumer) == null ? void 0 : _h.origin_video_key)
              };
            }
            if (downloadType == downLoadType.default) {
              url = data.url;
            } else if (downloadType == downLoadType.origin) {
              url = data.originUrl;
            } else if (downloadType == downLoadType.jpg) {
              url = data.originUrl + "?" + jpgParams;
            }
            if (file.live_photo && preferLive) {
              url = data.liveUrl || data.originUrl;
            }
            return url;
          }
          const isDragging = vue.ref(false);
          const size = vue.ref("50%");
          function handleMouseMove(e) {
            const x = (window.screen.availWidth - e.pageX) / window.screen.availWidth;
            let w = +(x * 100).toFixed(2);
            if (w <= 50) w = 50;
            size.value = w + "%";
          }
          function handleMouseDown() {
            isDragging.value = true;
            document.body.style.cursor = "w-resize";
            document.body.style.userSelect = "none";
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", () => {
              isDragging.value = false;
              storageStore.setting.downloadSize = size.value;
              document.body.style.cursor = "auto";
              document.body.style.userSelect = "auto";
              window.removeEventListener("mousemove", handleMouseMove);
            });
          }
          function handleColChange(val) {
            storageStore.setting.col = val;
          }
          async function copyLink() {
            const list = await getDownloadUrlList(true);
            const urlList = list == null ? void 0 : list.map((item) => {
              return item.urlDefault;
            }).join("\n");
            if (urlList) {
              try {
                await copyToClipboard(urlList);
                ElMessage.success("复制成功");
              } catch (error) {
                console.log("复制失败", error);
                ElMessage.error("复制失败");
              }
            }
          }
          return (_ctx, _cache) => {
            const _component_el_input_number = ElInputNumber;
            const _component_el_button = ElButton;
            const _component_el_space = ElSpace;
            const _component_el_checkbox = ElCheckbox;
            const _component_el_checkbox_group = ElCheckboxGroup;
            const _component_el_empty = ElEmpty;
            const _component_el_input = ElInput;
            const _component_el_form_item = ElFormItem;
            const _component_el_radio = ElRadio;
            const _component_el_radio_group = ElRadioGroup;
            const _component_el_form = ElForm;
            const _component_el_drawer = ElDrawer;
            return vue.openBlock(), vue.createBlock(_component_el_drawer, {
              modelValue: vue.unref(isOpenDownload),
              "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => vue.isRef(isOpenDownload) ? isOpenDownload.value = $event : null),
              size: vue.unref(size),
              "destroy-on-close": "",
              class: vue.normalizeClass({
                "xhs-download-container": vue.unref(isDragging),
                xhs: true,
                download: true
              })
            }, vue.createSlots({
              header: vue.withCtx(() => [
                vue.createElementVNode("div", _hoisted_1$1, [
                  vue.createElementVNode("div", _hoisted_2, "小红书下载助手 v" + vue.toDisplayString(vue.unref(_GM).info.script.version), 1),
                  vue.createElementVNode("div", _hoisted_3, [
                    vue.createVNode(_component_el_space, { size: 20 }, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("span", _hoisted_4, [
                          _cache[9] || (_cache[9] = vue.createTextVNode(" 显示列数：")),
                          vue.createVNode(_component_el_input_number, {
                            size: "small",
                            modelValue: vue.unref(col),
                            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(col) ? col.value = $event : null),
                            min: 1,
                            max: 18,
                            onChange: handleColChange,
                            class: "col"
                          }, null, 8, ["modelValue"])
                        ]),
                        vue.createVNode(_component_el_button, {
                          size: "small",
                          type: "info",
                          onClick: _cache[1] || (_cache[1] = ($event) => emit("settingClick"))
                        }, {
                          default: vue.withCtx(() => _cache[10] || (_cache[10] = [
                            vue.createTextVNode(" 设置 ")
                          ])),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              default: vue.withCtx(() => {
                var _a2;
                return [
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass({
                      line: true,
                      active: vue.unref(isDragging)
                    }),
                    onMousedown: handleMouseDown
                  }, null, 34),
                  ((_a2 = vue.unref(store).note) == null ? void 0 : _a2.image_list.length) ? (vue.openBlock(), vue.createBlock(_component_el_checkbox_group, {
                    key: 0,
                    modelValue: vue.unref(state).checkList,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(state).checkList = $event)
                  }, {
                    default: vue.withCtx(() => {
                      var _a3;
                      return [
                        vue.createElementVNode("div", {
                          class: "download-list",
                          style: vue.normalizeStyle(`grid-template-columns: repeat(${vue.unref(col)}, 1fr)`)
                        }, [
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList((_a3 = vue.unref(store).note) == null ? void 0 : _a3.image_list, (item, index) => {
                            return vue.openBlock(), vue.createBlock(_component_el_checkbox, {
                              value: index,
                              size: "large",
                              key: index
                            }, {
                              default: vue.withCtx(() => [
                                vue.createElementVNode("div", _hoisted_5, [
                                  vue.createElementVNode("img", {
                                    src: item.url_default
                                  }, null, 8, _hoisted_6),
                                  vue.createElementVNode("div", _hoisted_7, vue.toDisplayString(item.progress || "0%"), 1),
                                  item.live_photo ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8, "实况")) : vue.unref(store).note.type == "video" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9, "视频")) : vue.createCommentVNode("", true)
                                ])
                              ]),
                              _: 2
                            }, 1032, ["value"]);
                          }), 128))
                        ], 4)
                      ];
                    }),
                    _: 1
                  }, 8, ["modelValue"])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_10, [
                    vue.createVNode(_component_el_empty)
                  ]))
                ];
              }),
              _: 2
            }, [
              vue.unref(store).note ? {
                name: "footer",
                fn: vue.withCtx(() => [
                  vue.createVNode(_component_el_form, null, {
                    default: vue.withCtx(() => {
                      var _a2;
                      return [
                        vue.createVNode(_component_el_form_item, {
                          label: "标题",
                          "label-width": "6rem",
                          class: "xhs-form-item"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_el_input, {
                              modelValue: vue.unref(state).title,
                              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(state).title = $event),
                              autocomplete: "off"
                            }, null, 8, ["modelValue"]),
                            vue.createElementVNode("div", _hoisted_11, " 文件名示例： " + vue.toDisplayString(vue.unref(fileNameExample) || "-"), 1)
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_el_form_item, {
                          label: "下载类型",
                          "label-width": "6rem",
                          class: "xhs-form-item"
                        }, {
                          default: vue.withCtx(() => {
                            var _a3, _b;
                            return [
                              vue.createVNode(_component_el_radio_group, {
                                "model-value": ((_a3 = vue.unref(store).note) == null ? void 0 : _a3.type) ? vue.unref(storageStore).setting.downLoadTypeObj[(_b = vue.unref(store).note) == null ? void 0 : _b.type] : vue.unref(downLoadType).default,
                                onChange: handleDownloadTypeChnage
                              }, {
                                default: vue.withCtx(() => {
                                  var _a4;
                                  return [
                                    vue.createVNode(_component_el_radio, {
                                      value: vue.unref(downLoadType).default
                                    }, {
                                      default: vue.withCtx(() => _cache[11] || (_cache[11] = [
                                        vue.createTextVNode("普通")
                                      ])),
                                      _: 1
                                    }, 8, ["value"]),
                                    vue.createVNode(_component_el_radio, {
                                      value: vue.unref(downLoadType).origin
                                    }, {
                                      default: vue.withCtx(() => _cache[12] || (_cache[12] = [
                                        vue.createTextVNode(" 高清 ")
                                      ])),
                                      _: 1
                                    }, 8, ["value"]),
                                    ((_a4 = vue.unref(store).note) == null ? void 0 : _a4.type) == "normal" ? (vue.openBlock(), vue.createBlock(_component_el_radio, {
                                      key: 0,
                                      value: vue.unref(downLoadType).jpg,
                                      class: "xhs-form-item"
                                    }, {
                                      default: vue.withCtx(() => _cache[13] || (_cache[13] = [
                                        vue.createTextVNode(" jpg格式 ")
                                      ])),
                                      _: 1
                                    }, 8, ["value"])) : vue.createCommentVNode("", true)
                                  ];
                                }),
                                _: 1
                              }, 8, ["model-value"])
                            ];
                          }),
                          _: 1
                        }),
                        ((_a2 = vue.unref(store).note) == null ? void 0 : _a2.type) == "normal" ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                          key: 0,
                          label: "实况",
                          "label-width": "6rem",
                          class: "xhs-form-item"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_el_checkbox, {
                              "model-value": vue.unref(storageStore).setting.preferLive,
                              onChange: vue.unref(storageStore).setPreferLive
                            }, {
                              default: vue.withCtx(() => _cache[14] || (_cache[14] = [
                                vue.createElementVNode("div", { class: "flex-center" }, " 如果文件类型为实况，那么优先下载实况视频，否则按照所选的下载类型进行下载 ", -1)
                              ])),
                              _: 1
                            }, 8, ["model-value", "onChange"])
                          ]),
                          _: 1
                        })) : vue.createCommentVNode("", true)
                      ];
                    }),
                    _: 1
                  }),
                  vue.createElementVNode("div", _hoisted_12, [
                    vue.createVNode(_component_el_button, {
                      type: "default",
                      onClick: _cache[4] || (_cache[4] = ($event) => isOpenDownload.value = false)
                    }, {
                      default: vue.withCtx(() => _cache[15] || (_cache[15] = [
                        vue.createTextVNode(" 返回 ")
                      ])),
                      _: 1
                    }),
                    vue.createVNode(_component_el_checkbox, {
                      border: "",
                      onChange: handleCheckAllChange,
                      modelValue: vue.unref(checkAll),
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.isRef(checkAll) ? checkAll.value = $event : null),
                      indeterminate: vue.unref(checkAllIndeterminate),
                      style: { "margin": "0 10px" }
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(" 全选(" + vue.toDisplayString(vue.unref(state).checkList.length) + ") ", 1)
                      ]),
                      _: 1
                    }, 8, ["modelValue", "indeterminate"]),
                    vue.createVNode(_component_el_button, {
                      type: "primary",
                      onClick: _cache[6] || (_cache[6] = ($event) => downLoad()),
                      disabled: vue.unref(state).checkList.length == 0
                    }, {
                      default: vue.withCtx(() => _cache[16] || (_cache[16] = [
                        vue.createTextVNode(" 浏览器下载 ")
                      ])),
                      _: 1
                    }, 8, ["disabled"]),
                    vue.unref(storageStore).setting.openRpcDownload ? (vue.openBlock(), vue.createBlock(_component_el_button, {
                      key: 0,
                      color: "#3f85ff",
                      onClick: _cache[7] || (_cache[7] = ($event) => downLoad(true)),
                      disabled: vue.unref(state).checkList.length == 0 || !vue.unref(store).isConnected
                    }, {
                      default: vue.withCtx(() => _cache[17] || (_cache[17] = [
                        vue.createTextVNode(" aria2下载 ")
                      ])),
                      _: 1
                    }, 8, ["disabled"])) : vue.createCommentVNode("", true),
                    !vue.unref(store).isConnected && vue.unref(storageStore).setting.openRpcDownload ? (vue.openBlock(), vue.createBlock(_component_el_button, {
                      key: 1,
                      type: "info",
                      onClick: vue.unref(store).testSocket
                    }, {
                      default: vue.withCtx(() => _cache[18] || (_cache[18] = [
                        vue.createTextVNode(" 重新连接aria2 ")
                      ])),
                      _: 1
                    }, 8, ["onClick"])) : vue.createCommentVNode("", true),
                    vue.createVNode(_component_el_button, {
                      type: "warning",
                      onClick: copyLink,
                      disabled: vue.unref(state).checkList.length == 0
                    }, {
                      default: vue.withCtx(() => _cache[19] || (_cache[19] = [
                        vue.createTextVNode(" 复制下载链接 ")
                      ])),
                      _: 1
                    }, 8, ["disabled"])
                  ])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["modelValue", "size", "class"]);
          };
        }
      });
      const Download = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-f43745eb"]]);
      const _hoisted_1 = { class: "xiaohongshu_script" };
      const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
        __name: "Root",
        setup(__props) {
          const isOpenDownload = vue.ref(false);
          const isOpenSetting = vue.ref(false);
          function handleFloatBtnClick() {
            isOpenDownload.value = true;
          }
          const mainStore = useMainStore();
          const storageStore = useStorageStore();
          vue.onMounted(() => {
            initEventListener();
            if (storageStore.setting.openRpcDownload) {
              mainStore.testSocket();
            }
            storageStore.compatible();
          });
          async function initEventListener() {
            const originalXhrSend = window.XMLHttpRequest.prototype.send;
            window.XMLHttpRequest.prototype.send = function() {
              this.addEventListener("load", function() {
                var _a2, _b;
                if (this.responseURL.includes("/api/sns/web/v1/feed")) {
                  const resData = JSON.parse(this.responseText);
                  const note = (_b = (_a2 = resData.data) == null ? void 0 : _a2.items[0]) == null ? void 0 : _b.note_card;
                  store.setNote(note);
                }
              });
              return originalXhrSend.apply(this, arguments);
            };
            const { href, pathname } = window.location;
            if (href.startsWith("https://www.xiaohongshu.com/explore/")) {
              const id = pathname.split("/").at(-1);
              const note = _unsafeWindow.__INITIAL_STATE__.note.noteDetailMap[id].note;
              const res = camelToSnake(note);
              store.setNote(res);
            }
          }
          const store = useMainStore();
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
              vue.createVNode(FloatButton, { onClick: handleFloatBtnClick }),
              vue.createVNode(Download, {
                modelValue: vue.unref(isOpenDownload),
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(isOpenDownload) ? isOpenDownload.value = $event : null),
                onSettingClick: _cache[1] || (_cache[1] = ($event) => isOpenSetting.value = true)
              }, null, 8, ["modelValue"]),
              vue.createVNode(Setting, {
                modelValue: vue.unref(isOpenSetting),
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.isRef(isOpenSetting) ? isOpenSetting.value = $event : null)
              }, null, 8, ["modelValue"])
            ]);
          };
        }
      });
      const Root = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-963e1d2e"]]);
      const _sfc_main = /* @__PURE__ */ vue.defineComponent({
        __name: "App",
        setup(__props) {
          return (_ctx, _cache) => {
            const _component_el_config_provider = ElConfigProvider;
            return vue.openBlock(), vue.createBlock(_component_el_config_provider, { locale: vue.unref(zhCn) }, {
              default: vue.withCtx(() => [
                vue.createVNode(Root)
              ]),
              _: 1
            }, 8, ["locale"]);
          };
        }
      });
      const app = vue.createApp(_sfc_main);
      const pinia$1 = pinia.createPinia();
      app.use(pinia$1);
      pinia$1.use(piniaPluginPersistedstate.createPersistedState({ storage: localStorage }));
      app.mount(
        (() => {
          const app2 = document.createElement("div");
          document.body.append(app2);
          return app2;
        })()
      );
    }

  });
  require_main_001();

})(Vue, Pinia, dayjs, dayjs_plugin_utc, dayjs_plugin_timezone, StreamSaver, piniaPluginPersistedstate);
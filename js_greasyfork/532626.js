// ==UserScript==
// @name         B站硬核答题AI答题
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  bilibili会员硬核答题
// @author       BigShark667
// @match        https://www.bilibili.com/h5/senior-newbie/qa
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.slim.min.js
// @license      Apache-2.0
// @connect      api.deepseek.com
// @connect      api.gptapi.us
// @downloadURL https://update.greasyfork.org/scripts/532626/B%E7%AB%99%E7%A1%AC%E6%A0%B8%E7%AD%94%E9%A2%98AI%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/532626/B%E7%AB%99%E7%A1%AC%E6%A0%B8%E7%AD%94%E9%A2%98AI%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

"use strict";
/* eslint-disable no-underscore-dangle, @typescript-eslint/no-empty-function */
(async () => {
  // Prevent tab visibility detection
  function disableVisibilityEvents() {
    window.onblur = () => {};
    window.onfocus = () => {};
    document.onfocusin = () => {};
    document.onfocusout = () => {};
  }

  // Override visibility event listeners
  disableVisibilityEvents();
  document._addEventListener = document.addEventListener;
  document.addEventListener = (...argv) => {
    if (['visibilitychange', 'mozvisibilitychange', 'webkitvisibilitychange', 'msvisibilitychange'].includes(argv[0])) {
      return;
    }
    document._addEventListener(...argv);
  };

  document._removeEventListener = document.removeEventListener;
  document.removeEventListener = (...argv) => {
    if (['visibilitychange', 'mozvisibilitychange', 'webkitvisibilitychange', 'msvisibilitychange'].includes(argv[0])) {
      return;
    }
    document._removeEventListener(...argv);
  };

  window.onload = disableVisibilityEvents;

  // Configuration and state
  const API_CONFIG = {
    'ChatAnywhere': {
      url: 'https://api.gptapi.us/v1/chat/completions',
      model: 'gpt-4o-mini'
    },
    'DeepSeek': {
      url: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat'
    }
  };

  let config = GM_getValue('API_CONFIG') || { key: '', provider: '' };
  let prevQuestion = '';
  let isRunning = false;
  let processedQuestions = []; // 新增：历史记录数组

  // Register menu commands
  GM_registerMenuCommand('设置 ChatAnywhere API 密钥', () => {
    setupApiKey('ChatAnywhere');
  });

  GM_registerMenuCommand('设置 DeepSeek API 密钥', () => {
    setupApiKey('DeepSeek');
  });

  GM_registerMenuCommand('启动', () => {
    if (!config.key) {
      notify('错误', '请先设置 API 密钥！');
      return;
    }

    if (isRunning) {
      notify('提示', '脚本已经在运行中');
      return;
    }

    console.clear();
    notify('提示', '启动后不要点击页面！');
    isRunning = true;
    document.dispatchEvent(new Event('click'));
  });

  GM_registerMenuCommand('停止', () => {
    isRunning = false;
    notify('提示', '脚本已停止');
  });

  // Setup functions
  function setupApiKey(provider) {
    const key = prompt(`请输入 ${provider} API 密钥：`, config.provider === provider ? config.key : '');
    if (key) {
      config = { key, provider };
      GM_setValue('API_CONFIG', config);
      notify('成功', `${provider} API 密钥已设置`);
    }
  }

  function notify(title, text) {
    GM_notification({
      title: '哔哩哔哩硬核会员搜题GPT',
      text,
      timeout: 5000
    });
  }

  // Main process functions
  document.addEventListener('click', startProcess);

  async function startProcess() {
    if (!isRunning) return;

    try {
      const delayTime = getRandomDelay(5000, 10000);
      console.log(`等待 ${delayTime / 1000} 秒后开始搜索下一题`);
      await sleep(delayTime);

      const [question, elem] = extractQuestion();
      if (!question) {
        console.log('未找到问题，稍后重试');
        return setTimeout(startProcess, 5000);
      }

      if (question === prevQuestion) {
        console.log('题目未变化，稍后重试');
        return setTimeout(startProcess, 5000);
      }

      prevQuestion = question;
      console.log('识别到问题:', question);

      const answer = await askGPT(question);
      const option = parseAnswer(answer);

      if (!option) {
        console.log('无法解析答案，随机选择');
        selectRandomOption();
      } else {
        console.log(`选择答案：${option}`);
        selectOption(option, elem);
      }
    } catch (error) {
      console.error('处理出错:', error);
      notify('错误', '处理题目时出错，稍后重试');
      setTimeout(startProcess, 10000);
    }
  }

  function extractQuestion() {
    const questionDivs = $('div.senior-question').toArray();
    for (const div of questionDivs) {
      const elements = $(div).find('.senior-question__qs, .senior-question__answer');
      if (elements.length === 0) continue;

      const questionText = elements.toArray()
        .map(v => $(v).text().trim())
        .join('\n')
        .replace(/\s+/g, ' ');  // 清理多余空格

      const hash = generateHash(questionText);

      if (!processedQuestions.includes(hash)) {
        processedQuestions.push(hash);
        // 保持历史记录最多50条
        if (processedQuestions.length > 50) {
          processedQuestions.shift();
        }
        return [questionText, div];
      }
    }
    return null;
  }

  function generateHash(str) {
    // 改进的djb2哈希算法
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash * 33) ^ char;
    }
    return hash >>> 0; // 转换为无符号32位整数
  }

  async function askGPT(question, retry = 0) {
    try {
      return await callGPTAPI(`请仅给出答案\n${question}`);
    } catch (error) {
      if (retry >= 3) {
        throw new Error('API 请求失败次数过多');
      }
      console.log(`API 请求失败，${retry + 1}/3 次重试`);
      await sleep(5000);
      return askGPT(question, retry + 1);
    }
  }

  function parseAnswer(answer) {
    // First try to match a direct letter at the beginning or end
    let match = answer.match(/^\s*([A-D])[.\s:]|[.\s:]([A-D])\s*$/i);
    if (match) {
      return (match[1] || match[2]).toUpperCase();
    }

    // Then try to find any letter within the answer
    match = answer.match(/\b([A-D])[.\s:]/i);
    if (match) {
      return match[1].toUpperCase();
    }

    // Look for answer options by keyword
    const optionKeywords = {
      A: ['选A', '答案A', '答案是A', 'A选项', '选择A'],
      B: ['选B', '答案B', '答案是B', 'B选项', '选择B'],
      C: ['选C', '答案C', '答案是C', 'C选项', '选择C'],
      D: ['选D', '答案D', '答案是D', 'D选项', '选择D']
    };

    for (const [option, keywords] of Object.entries(optionKeywords)) {
      if (keywords.some(keyword => answer.includes(keyword))) {
        return option;
      }
    }

    return null;
  }

  function selectOption(option, questionDiv) {
    // const optionElement = $(questionDiv).find('span.senior-question__answer--icon:contains(${option})').parent()[0];
    const optionElement = $(questionDiv)
      .find(`span.senior-question__answer--icon:contains(${option})`)
      .closest('.senior-question__answer') // 更精确的父级选择
      .first()[0];
    if (optionElement) {
      simulateClick(optionElement);
    } else {
      console.log(`未找到选项 ${option}，随机选择`);
      selectRandomOption();
    }
  }

  function selectRandomOption() {
    const options = $('span.senior-question__answer--icon').parent().toArray();
    if (options.length > 0) {
      const randomIndex = Math.floor(Math.random() * options.length);
      simulateClick(options[randomIndex]);
    }
  }

  function simulateClick(element) {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const randomX = rect.left + Math.random() * rect.width;
    const randomY = rect.top + Math.random() * rect.height;

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: randomX,
      clientY: randomY,
    });

    element.dispatchEvent(clickEvent);
  }

  // API functions
  function callGPTAPI(question) {
    return new Promise((resolve, reject) => {
      if (!config.key || !config.provider) {
        return reject(new Error('API 配置不完整'));
      }

      const apiConfig = API_CONFIG[config.provider];
      if (!apiConfig) {
        return reject(new Error('未知的 API 提供商'));
      }

      const requestData = {
        "messages": [
          {
            "content": question,
            "role": "system"
          }
        ],
        "temperature": 0.7,
        "model": apiConfig.model,
        "stream": false,
        "response_format": {
          "type": "text"
        }
      };

      GM_xmlhttpRequest({
        method: 'POST',
        url: apiConfig.url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.key}`,
        },
        data: JSON.stringify(requestData),
        onload: function(response) {
          try {
            const data = JSON.parse(response.responseText);

            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
              console.error('API 返回数据格式错误:', data);
              return reject(new Error('API 返回数据格式错误'));
            }

            const content = data.choices[0].message.content;
            console.log('API 返回结果:', content);
            resolve(content);
          } catch (error) {
            console.error('解析 API 响应失败:', error, response.responseText);
            reject(new Error('解析 API 响应失败'));
          }
        },
        onerror: function(error) {
          console.error('API 请求失败:', error);
          reject(error);
        },
        ontimeout: function() {
          console.error('API 请求超时');
          reject(new Error('API 请求超时'));
        }
      });
    });
  }

  // Utility functions
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
})();
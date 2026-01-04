// ==UserScript==
// @name         头歌自动尝试正确答案
// @match        *://*.educoder.net/tasks/*
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically fetch answers for tasks
// @author       Owwk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495112/%E5%A4%B4%E6%AD%8C%E8%87%AA%E5%8A%A8%E5%B0%9D%E8%AF%95%E6%AD%A3%E7%A1%AE%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/495112/%E5%A4%B4%E6%AD%8C%E8%87%AA%E5%8A%A8%E5%B0%9D%E8%AF%95%E6%AD%A3%E7%A1%AE%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 定义答案的所有可能组合
  const answers = [];
  const delayMs = 1;
  const isDelay = false;

  function fillAnswers(maxChar) {
    const options = [];
    for (let i = 'A'.charCodeAt(0); i <= maxChar.charCodeAt(0); i++) {
      options.push(String.fromCharCode(i));
    }
    for (let i = 1; i <= options.length; i++) {
      combinations(options, i).forEach(c => answers.push(c.join('')));
    }
    console.info("答案组合", answers)
  }

  function combinations(arr, k) {
    const result = [];
    const combination = (start, prefix) => {
      if (prefix.length === k) {
        result.push(prefix);
        return;
      }
      for (let i = start; i < arr.length; i++) {
        combination(i + 1, prefix.concat(arr[i]));
      }
    };
    combination(0, []);
    return result;
  }

  // 每秒获取一次目标元素，超时时间为5秒
  const interval = setInterval(() => {
    const target = document.querySelector('#task-left-panel > div.task-header > span');
    if (target) {
      clearInterval(interval);
      insertButton(target);
    }
  }, 1000);

  setTimeout(() => clearInterval(interval), 5000);

  function insertButton(target) {
    const button = document.createElement('button');
    button.textContent = 'Fetch Answer';
    button.style.marginRight = '10px';
    target.parentElement.insertBefore(button, target);

    button.addEventListener('click', () => {
      const userInput = prompt('请输入fetch字符串:');
      if (userInput) {
        try {
          const { url, options } = parseFetchString(userInput);
          attemptAllCombinations(url, options);
        } catch (e) {
          alert('无效的fetch字符串');
        }
      }
    });
  }

  function parseFetchString(fetchString) {
    const urlMatch = fetchString.match(/fetch\("([^"]+)"/);
    const optionsMatch = fetchString.match(/,\s*({[\s\S]*})\s*\)\s*;/);

    if (!urlMatch || !optionsMatch) {
      throw new Error('无法解析fetch字符串');
    }

    const url = urlMatch[1];
    const options = JSON.parse(optionsMatch[1]);
    return { url, options };
  }

  async function attemptAllCombinations(url, options) {
    // 解析 options.body 获取答案数组的长度
    let bodyObj = JSON.parse(options.body);
    const answerLength = bodyObj.answer.length;

    let maxChar = 'A';
    // 解析最大Char
    bodyObj.answer.forEach((val, index) => {
      if (val > maxChar) {
        maxChar = val;
      }
    });
    fillAnswers(maxChar);

    // 初始化 correctAnswers 数组，假设所有题目都是错误的
    let correctAnswers = Array(answerLength).fill(false);
    let num = 0;

    for (let answer of answers) {
      num++;
      bodyObj = modifyRequestBody(bodyObj, answer, correctAnswers);
      const newRequestOptions = { ...options, body: JSON.stringify(bodyObj) };
      const response = await sendRequest(url, newRequestOptions);

      console.info("尝试", num, bodyObj.answer)
      // 更新 correctAnswers 数组，标记已经正确的题目
      correctAnswers = updateCorrectAnswers(correctAnswers, response);
      console.info("结果", num, correctAnswers)
      if (isAllCorrect(response)) {
        alert('找到正确答案: ' + getAnswer(response).join(', '));
        break
      }
      if (isDelay) await delay(delayMs);
    }
  }


  function updateCorrectAnswers(correctAnswers, response) {
    // 遍历 response 中的 test_sets，更新 correctAnswers
    response.test_sets.forEach((test, index) => {
      if (test.result) {
        correctAnswers[index] = true;
      }
    });

    return correctAnswers;
  }


  function modifyRequestBody(body, answer, correctAnswers) {
    const bodyObj = body;

    // 仅在对应位置没有正确答案时才修改答案数组
    for (let i = 0; i < bodyObj.answer.length; i++) {
      if (!correctAnswers[i]) {
        bodyObj.answer[i] = answer;
      }
    }

    return bodyObj
  }


  function sendRequest(url, options) {
    Object.keys(options.headers).forEach(header => {
      if (header.startsWith('x-edu-')) {
        delete options.headers[header];
      }
    });

    return fetch(url, options)
      .then(response => response.json())
      .catch(error => console.error('Error:', error));
  }


  function isAllCorrect(response) {
    return response.test_sets.every(test => test.result);
  }

  function getAnswer(response) {
    return response.test_sets.map(val => val.actual_output)
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
})();
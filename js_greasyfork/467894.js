// ==UserScript==
// @name         江西省党的基本知识竞赛
// @namespace    https://afdian.net/a/Rialll
// @version      0.3
// @description  自用自动答题
// @author       Rialll
// @match        *://*.jxeduyun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jxeduyun.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467894/%E6%B1%9F%E8%A5%BF%E7%9C%81%E5%85%9A%E7%9A%84%E5%9F%BA%E6%9C%AC%E7%9F%A5%E8%AF%86%E7%AB%9E%E8%B5%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/467894/%E6%B1%9F%E8%A5%BF%E7%9C%81%E5%85%9A%E7%9A%84%E5%9F%BA%E6%9C%AC%E7%9F%A5%E8%AF%86%E7%AB%9E%E8%B5%9B.meta.js
// ==/UserScript==



(function() {
  'use strict';

  let outputElement; // 题目内容元素的引用
  let intervalId; // setInterval 的 ID
  let lastQuestionId = null; // 上一次的题目ID

  // 获取题目计数
  const getQuestionIndex = () => {
    const questionElement = document.querySelector("#\\/question\\?stamp\\=1 > taro-view-core > taro-view-core.hydrated.question--tips > taro-view-core:nth-child(1)");
    const textContent = questionElement ? questionElement.textContent : '';
    const match = textContent.match(/\d+/);
    const questionIndex = match ? parseInt(match[0]) : 0;
    return questionIndex - 1;
  };

  // 读取题目
  const getQuestion = () => {
    const questionElement = document.querySelector(`#question--box-${getQuestionIndex()} > taro-view-core`);
    return questionElement ? questionElement.textContent : '';
  };

  // 分割题目内容
  const splitQuestion = (question) => {
    let splitContent = '';
    const match = question.match(/^\d+\.\s+(?:多选题|判断题|单选题)\s+(.+?)\s*\(\d+分\)$/); // 匹配题号、题目类型和题目内容，并提取题目内容
    if (match) {
      splitContent = match[1].trim();
    }
    return splitContent;
  };

  // 输出题目
  const outputQuestion = () => {
    const question = getQuestion();
    if (question) {
      const questionId = getQuestionIndex();
      if (questionId !== lastQuestionId) {
        lastQuestionId = questionId;

        if (!outputElement) {
          outputElement = document.createElement('div');
          outputElement.style.backgroundColor = 'yellow';
          outputElement.style.padding = '10px';
          document.body.appendChild(outputElement);
        }
        outputElement.innerText = '题目内容：' + splitQuestion(question);
        sendPostData(splitQuestion(question));
      }
    } else {
      console.log('No question found.');
    }
  };

  const sendPostData = (title) => {
    const postUrl = 'http://127.0.0.1:5000'; //请自行替换API
    const data = 'title=' + encodeURIComponent(title);

    fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
    })
      .then(response => response.text()) // 将响应转为文本格式
      .then(answer => {
        console.log('Answer received:', answer);
        // 在这里对返回的答案进行处理
        for (let i = 0; i < answer.length; i++) {
          const option = answer[i];
          console.log('选项:', option);
          const optionIndex = option.charCodeAt(0) - 65; // 将选项字符转为索引
          if (optionIndex >= 0 && optionIndex < 4) {
            const optionElement = document.querySelector(`#question--box-${getQuestionIndex()} > view > view:nth-child(${optionIndex + 1}) > i`);
            if (optionElement) {
              optionElement.click(); // 模拟点击选项
              console.log('点击选项:', option);
            }
          }
        }
      })
      .catch(error => {
        console.error('Error sending data:', error);
      });
  };

  // 启动脚本
  const startScript = () => {
    if (!intervalId) {
      outputQuestion(); // 先输出一次题目
      intervalId = setInterval(outputQuestion, 1000); // 每5秒输出一次题目
    }
  };

  // 停止脚本
  const stopScript = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  // 创建启动按钮
  const createStartButton = () => {
    const startButton = document.createElement('button');
    startButton.innerText = '启动脚本';
    startButton.style.padding = '10px';
    startButton.style.marginTop = '20px';
    startButton.style.backgroundColor = 'blue';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.cursor = 'pointer';
    startButton.addEventListener('click', startScript);
    document.body.appendChild(startButton);
  };

  // 创建停止按钮
  const createStopButton = () => {
    const stopButton = document.createElement('button');
    stopButton.innerText = '停止脚本';
    stopButton.style.padding = '10px';
    stopButton.style.backgroundColor = 'red';
    stopButton.style.color = 'white';
    stopButton.style.border = 'none';
    stopButton.style.cursor = 'pointer';
    stopButton.addEventListener('click', stopScript);
    document.body.appendChild(stopButton);
  };

  // 调用创建按钮函数
  createStartButton();
  createStopButton();
})();

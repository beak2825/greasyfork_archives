// ==UserScript==
// @name         荒野亂鬥比賽腳本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自動按讚, 自動選MVP, 自動選答案
// @author       You
// @match        https://event.supercell.com/brawlstars/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=supercell.com
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529988/%E8%8D%92%E9%87%8E%E4%BA%82%E9%AC%A5%E6%AF%94%E8%B3%BD%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/529988/%E8%8D%92%E9%87%8E%E4%BA%82%E9%AC%A5%E6%AF%94%E8%B3%BD%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==


(function () {
  'use strict';

  console.log('==========================start==========================');
  console.error = () => { };
  console.clear();

  let quizAnswers = [];
  let matchAnswers = [];
  let localeData = {};

  fetch('https://event.supercell.com/brawlstars/assets/events/cards/zh-tc.json')
    .then(response => response.json())
    .then(data => {
      localeData = data;
      console.log(data);
      console.log(data['q0851_answer_1']);

    })
    .catch(error => {
      console.log('Error fetching the JSON:', error);
    });

  setInterval(() => {
    fetch('https://event.supercell.com/brawlstars/assets/events/cards/zh-tc.json')
      .then(response => response.json())
      .then(data => {
        localeData = data;
        console.log(data);
        console.log(data['q0851_answer_1']);

      })
      .catch(error => {
        console.log('Error fetching the JSON:', error);
      });
  }, 5000);


  // 抓住它
  setInterval(() => {
    findAndClickButtonWithText(document.body, "抓住它!");
  }, 500);


  // 按讚
  setInterval(() => {
    document.querySelector('.cheer-btn-container__cheer-btn')?.click();
  }, 500);

  // 選MVP
  setInterval(() => {
    document.querySelectorAll('h3')
      .forEach(h3 => {
        if (h3.textContent.includes('的MVP')) {
          const button = h3.parentElement.querySelector("button");
          if (button) {
            button.click();
          }
        }
      });

  }, 500);

  // 自動重連
  setInterval(() => {
    const button = document.querySelector("#__layout > div > div:nth-child(5) > div > div > div > div.baseModal__scroll > div > div > button");
    if (button) {
      // button.click();
    }
  }, 1000); // Adjust the interval (in milliseconds) as needed

  const OriginalWebSocket = window.WebSocket;

  function MyWebSocket(url, protocols) {
    const ws = new OriginalWebSocket(url, protocols);

    ws.send = function (data) {
      OriginalWebSocket.prototype.send.call(this, data);
    };

    ws.addEventListener('message', function (event) {
      let jsonData = JSON.parse(event.data);
      console.log(jsonData);

      if (jsonData[0].messageType != 'global_state') {
        console.log('Received WebSocket message:', JSON.stringify(jsonData, null, 2), JSON.parse(event.data)[0]);

        let localeKey = '';
        let correctAnswer = {};

        if (jsonData[0].payload.correctAnswer?.alternative != null) {
          localeKey = jsonData[0].payload?.alternatives[jsonData[0].payload.correctAnswer?.alternative].value;
          correctAnswer = {
            [jsonData[0].payload.correctAnswer?.alternative]: `答案是 ${localeData[localeKey]}`
          };

          console.log("localeKey", localeKey);
          try {
            findAndClickButtonWithText(document.body, localeData[localeKey]);
          }
          catch {

          }
        }

        let maybeAnswer = document.querySelector("#maybe-answer")
        maybeAnswer.innerHTML = JSON.stringify({
          maybe: getHighestPercentageKey(jsonData[0].payload.answers ?? {}),
          correctAnswer,
          answers: jsonData[0].payload.answers ?? {}
        }, null, 2);

        if (jsonData[0].messageType == 'quiz') {
          quizAnswers.push(JSON.parse(event.data)[0]);

        }
        if (jsonData[0].messageType == 'match_prediction') {
          matchAnswers.push(JSON.parse(event.data)[0]);
          // document.querySelector("#maybe-answer").innerHTML = JSON.stringify({
          //   maybe: getAnswer('match'),
          //   answers: jsonData[0].payload.answers
          // });
        }
      }

    });

    return ws;
  }

  window.WebSocket = MyWebSocket;


  function getAnswer(type) {
    try {

      if (type == 'quiz') {
        return getHighestPercentageKey(quizAnswers[quizAnswers.length - 1].payload.answers)
      }
      else if (type == 'match') {
        return getHighestPercentageKey(matchAnswers[matchAnswers.length - 1].payload.answers)
      }
    } catch {
      return ''
    }
  }

  function getHighestPercentageKey(answers) {
    // 計算總和
    const totalSum = Object.values(answers).reduce((sum, value) => sum + value, 0);

    // 初始化變數來追蹤最高的百分比和對應的鍵
    let maxPercentage = 0;
    let maxKey = null;

    // 計算百分比並找出最高的百分比鍵
    for (const [key, value] of Object.entries(answers)) {
      const percentage = (value / totalSum) * 100;
      if (percentage > maxPercentage) {
        maxPercentage = percentage;
        maxKey = key;
      }
    }

    return maxKey;
  }

  function getHighestPercentage(answers) {
    // 計算總和
    const totalSum = Object.values(answers).reduce((sum, value) => sum + value, 0);

    // 初始化變數來追蹤最高的百分比和對應的鍵
    let maxPercentage = 0;
    let maxKey = null;

    // 計算百分比並找出最高的百分比鍵
    for (const [key, value] of Object.entries(answers)) {
      const percentage = (value / totalSum) * 100;
      if (percentage > maxPercentage) {
        maxPercentage = percentage;
        maxKey = key;
      }
    }

    return maxPercentage;
  }

  const checkInterval = 100; // 每100毫秒检查一次
  const intervalId = setInterval(() => {
    const element = document.querySelector('.Feed__content');
    if (element) {
      clearInterval(intervalId); // 找到元素后停止检查
      console.log('元素已找到:', element);
      // 獲取 .Feed__content 元素
      const feedContent = document.querySelector('.Feed__content');

      // 獲取 .Feed__content 中最後一個 div
      const lastDiv = feedContent.querySelector('div:last-child');

      // 創建新的 div 元素
      const newDiv = document.createElement('pre');
      newDiv.id = 'maybe-answer';

      // 插入新的 div 到最後一個 div 的後面
      feedContent.insertBefore(newDiv, lastDiv.nextSibling);

    }
  }, checkInterval);

  function findAndClickButtonWithText(root, text) {
    try {
      if (!root) return false; // 終止條件，如果節點不存在

      // 去除按鈕內文字的空白，檢查是否為 button 且包含目標文字或 class 包含 RectangleButton
      if ((root.tagName === 'BUTTON' || root.className.includes('RectangleButton')) && root.textContent.trim() === text.trim()) {
        root.click();
        return true; // 找到並按下按鈕
      }

      // 遞迴搜尋子節點
      for (let child of root.children) {
        if (findAndClickButtonWithText(child, text)) {
          return true; // 若找到，結束搜尋
        }
      }

      return false; // 若未找到，返回 false
    } catch (error) {
      console.error('An error occurred:', error);
      return false; // 發生錯誤時，返回 false
    }
  }

})();
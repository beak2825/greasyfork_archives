// ==UserScript==
// @name         华三大讲堂
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  华三大讲堂视频辅助，知了社区签到、自动答题
// @author       Zxy3953
// @match        https://learning.h3c.com/volbeacon/study/activity/*
// @match        https://zhiliao.h3c.com/*
// @icon         https://www.h3c.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483111/%E5%8D%8E%E4%B8%89%E5%A4%A7%E8%AE%B2%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/483111/%E5%8D%8E%E4%B8%89%E5%A4%A7%E8%AE%B2%E5%A0%82.meta.js
// ==/UserScript==

(function() {
  document.hasFocus = () => true;

  function setupVideo() {
    const video = document.querySelector('video');
    if (video) {
      video.muted = true;
      video.playbackRate = 2; // 默认设置为2倍速
      video.play().catch(e => console.error("自动播放失败: ", e));
      setupSpeedControls(video);
    } else {
      setTimeout(setupVideo, 1500);
    }
  }

  function setupSpeedControls(video) {
    const speeds = [1, 2, 4, 8, 16]; // 定义要切换的速率

    const mainButton = document.createElement('button');
    mainButton.textContent = '速度控制';
    mainButton.style.cssText = `
      position: fixed;
      right: 50px;
      top: 24px;
      width: 120px;
      height: 34px;
      border: none;
      border-radius: 4px;
      background: #ff4b4b;
      color: #fafafa;
      z-index: 9999;
    `;
    mainButton.addEventListener('click', () => {
      speedButtonsContainer.style.display = speedButtonsContainer.style.display === 'none' ? 'block' : 'none';
    });

    const speedButtonsContainer = document.createElement('div');
    speedButtonsContainer.style.cssText = `
      position: fixed;
      right: 50px;
      top: 66px;
      z-index: 9999;
      display: none;
      background: #fff;
      border-radius: 4px;
      padding: 16px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    `;

    speedButtonsContainer.addEventListener('mouseleave', () => {
      speedButtonsContainer.style.display = 'none';
    });

    speeds.forEach(speed => {
      const button = document.createElement('button');
      button.textContent = `${speed}x`;
      button.style.cssText = `
        width: 66px;
        height: 30px;
        border: none;
        margin: 6px;
        border-radius: 2px;
        background: #ff4b4b;
        color: #fafafa;
      `;
      button.addEventListener('mouseenter', (event) => {
        event.stopPropagation();
      });
      button.addEventListener('click', () => {
        video.playbackRate = speed;
        showNotification(`已切换到${speed}倍速`);
      });
      speedButtonsContainer.appendChild(button);
    });

    document.body.appendChild(mainButton);
    document.body.appendChild(speedButtonsContainer);
  }

  function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 24px;
      font-weight: bold;
      padding: 20px;
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;
      border-radius: 10px;
      z-index: 9999;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, duration);
  }

  async function autoFillAnswers() {
    try {
      const ridElement = document.querySelector('div.sign_in > div > form > div.question > div.question_a > div.questinon_a1');
      const ridValue = ridElement.getAttribute('rid');
      const url = `https://zhiliao.h3c.com/questions/randQuestAnswer?randnum=${ridValue}`;

      const response = await fetch(url);
      const data = await response.json();
      const answerValue = data.answer;
      const answerArray = answerValue.split(".");

      for (let i = 0; i < answerArray.length; i++) {
        const element = document.querySelector(`body > div.sign_in > div > form > div.question > div.question_a > div.question_a2 > label:nth-child(${answerArray[i]})`);
        if (element) {
          element.click();
        }
      }
      await sleep(1000);
      const checkinButton = document.querySelector('body > div.sign_in > div > form > div.checkin > div > a');
      if (checkinButton) {
        checkinButton.click();
      }
      await sleep(1000);
      const button = document.querySelector('body > div.sign_in > div > form > div.question > div.question_c > input');
      if (button) {
        button.click();
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function replaceButton() {
    const originalButton = document.querySelector('body > div.sign_in > div > form > div.question > div.question_c > input');
    if (originalButton) {
      originalButton.style.display = 'none';
      const newButton = document.createElement('input');
      newButton.setAttribute('type', 'input');
      newButton.setAttribute('class', 'new_button_class');
      newButton.setAttribute('value', '点击自动签到答题');

      newButton.style.cssText = `
        padding: 6px 15px;
        font-size: 15px;
        background-color: #6092e8;
        width: 120px;
        border: 1px solid #6092e8;
        border-radius: 3px;
        color: #fff;
        margin: 10px;
        cursor: pointer;
      `;

      newButton.addEventListener('click', autoFillAnswers);
      originalButton.parentElement.appendChild(newButton);
    }
  }

  replaceButton();
  setupVideo();
})();

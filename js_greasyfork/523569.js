// ==UserScript==
// @name         Komica 定時功能與鎖定畫面
// @namespace    http://komica.org
// @version      1.0
// @description  提供懸浮計時功能，並在超時後鎖定畫面提示休息。
// @author       Yun
// @match        https://gita.komica1.org/*
// @icon         https://i.ibb.co/bscXhHh/icon.png
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/523569/Komica%20%E5%AE%9A%E6%99%82%E5%8A%9F%E8%83%BD%E8%88%87%E9%8E%96%E5%AE%9A%E7%95%AB%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/523569/Komica%20%E5%AE%9A%E6%99%82%E5%8A%9F%E8%83%BD%E8%88%87%E9%8E%96%E5%AE%9A%E7%95%AB%E9%9D%A2.meta.js
// ==/UserScript==

  (function() {
      'use strict';

      // 插入CSS樣式
      const style = document.createElement('style');
      style.textContent = `
          @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
          }
          @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; }
          }
          .fade-in {
              animation: fadeIn 0.5s ease-in-out forwards;
          }
          .fade-out {
              animation: fadeOut 0.5s ease-in-out forwards;
          }
          .timer-button {
              width: 24px;
              height: 24px;
              background: rgba(68, 68, 68, 0.5);
              border: none;
              border-radius: 50%;
              color: #fff;
              font-size: 12px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 4px;
              transition: background 0.3s ease;
          }
          .timer-button:hover {
              background: rgba(85, 85, 85, 0.7);
          }
      `;
      document.head.appendChild(style);

      // 計時相關變數
      const TIMER_KEY = 'komica-timer-seconds';
      const WARNING_INDEX_KEY = 'komica-warning-index';
      const LOCK_STATE_KEY = 'komica-lock-state';
      const INITIAL_TIME = 600; // 10分鐘 = 600秒
      let seconds = parseInt(localStorage.getItem(TIMER_KEY), 10) || INITIAL_TIME;
      let timerInterval = null;
      let isPaused = false;

      // 插入懸浮計時器
      const container = document.createElement('div');
      Object.assign(container.style, {
          position: 'fixed',
          top: '40px',
          right: '10px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          background: 'rgba(30, 30, 30, 0.4)',
          padding: '6px 10px',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
          zIndex: '10000',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          backdropFilter: 'blur(5px)'
      });

      const timerDiv = document.createElement('div');
      timerDiv.id = 'komica-timer';
      Object.assign(timerDiv.style, {
          fontWeight: 'bold',
          marginRight: '6px'
      });

      // 更新計時器顯示
      const updateTimerDisplay = () => {
          const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
          const secs = (seconds % 60).toString().padStart(2, '0');
          timerDiv.textContent = `${minutes}:${secs}`;
      };

      // 計時器核心邏輯
      const tick = () => {
          if (seconds <= 0) {
              clearInterval(timerInterval);
              triggerSiteblock();
              return;
          }
          seconds--;
          localStorage.setItem(TIMER_KEY, seconds);
          updateTimerDisplay();
      };

      const startTimer = () => {
          if (timerInterval) clearInterval(timerInterval);
          timerInterval = setInterval(tick, 1000);
      };

      const stopTimer = () => {
          if (timerInterval) {
              clearInterval(timerInterval);
              timerInterval = null;
          }
      };

      // 重置按鈕
      const resetButton = document.createElement('button');
      resetButton.innerHTML = '⟳';
      resetButton.className = 'timer-button';
      resetButton.title = '重置你無謂的人生';

      // 播放/暫停按鈕
      const playPauseButton = document.createElement('button');
      playPauseButton.innerHTML = '⏸︎';
      playPauseButton.className = 'timer-button';
      playPauseButton.title = '暫停你的墮落時光';

      resetButton.addEventListener('click', () => {
          if (confirm('真的要重置？反正你的人生也就這樣了！')) {
              seconds = INITIAL_TIME;
              localStorage.setItem(TIMER_KEY, seconds);
              updateTimerDisplay();
              if (!isPaused) {
                  startTimer();
              }
          }
      });

      playPauseButton.addEventListener('click', () => {
          isPaused = !isPaused;
          if (isPaused) {
              playPauseButton.innerHTML = '▶︎';
              playPauseButton.title = '繼續你可悲的瀏覽';
              stopTimer();
          } else {
              playPauseButton.innerHTML = '⏸︎';
              playPauseButton.title = '暫停你的墮落時光';
              startTimer();
          }
      });

      container.appendChild(timerDiv);
      container.appendChild(playPauseButton);
      container.appendChild(resetButton);
      document.body.appendChild(container);

      // 警告訊息
      const warningMessages = [
          '哈！又在這裡浪費生命？真有你的！',
          '媽媽知道你在這邊當廢物嗎？',
          '看來你是打算繼續當個魯蛇了？',
          '這就是你的人生價值？在這裡虛度光陰？',
          '你以為躲在這裡就能逃避現實？',
          '真替你感到可悲，繼續宅下去吧！',
          '又在這裡當個失敗者了？',
          '外面的世界很可怕？還是你太廢了？',
          '這就是你的極限了？真可憐！',
          '看來你是打算一輩子當個廢物了！'
      ];

      const getNextWarning = () => {
          let currentIndex = parseInt(localStorage.getItem(WARNING_INDEX_KEY), 10) || 0;
          const warning = warningMessages[currentIndex];
          currentIndex = (currentIndex + 1) % warningMessages.length;
          localStorage.setItem(WARNING_INDEX_KEY, currentIndex);
          return warning;
      };

      // 鎖定畫面處理
      const triggerSiteblock = () => {
          localStorage.setItem(LOCK_STATE_KEY, 'locked');
          stopTimer();

          const oldOverlay = document.getElementById('komica-siteblock');
          if (oldOverlay) {
              oldOverlay.remove();
          }

          const overlay = document.createElement('div');
          overlay.id = 'komica-siteblock';
          overlay.classList.add('fade-in');

          Object.assign(overlay.style, {
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              zIndex: '10001',
              fontFamily: 'Arial, sans-serif'
          });

          const warningText = document.createElement('div');
          warningText.textContent = getNextWarning();
          Object.assign(warningText.style, {
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '20px',
              textAlign: 'center',
              padding: '0 20px'
          });

          const unlockButton = document.createElement('button');
          Object.assign(unlockButton.style, {
              padding: '12px 24px',
              fontSize: '18px',
              background: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              position: 'relative',
              overflow: 'hidden'
          });

          const progressIndicator = document.createElement('div');
          Object.assign(progressIndicator.style, {
              position: 'absolute',
              top: '0',
              left: '0',
              height: '100%',
              width: '0%',
              background: 'rgba(0, 128, 0, 0.5)',
              borderRadius: '8px',
              zIndex: '1',
              transition: 'width 0.1s linear'
          });

          const buttonText = document.createElement('span');
          buttonText.textContent = '堅持要繼續浪費生命？按住 5 秒！';
          Object.assign(buttonText.style, {
              position: 'relative',
              zIndex: '2'
          });

          unlockButton.appendChild(progressIndicator);
          unlockButton.appendChild(buttonText);

          let pressStartTime = 0;
          let isPressed = false;
          let progressInterval;

          const startUnlockProcess = () => {
              isPressed = true;
              pressStartTime = Date.now();
              progressInterval = setInterval(() => {
                  if (!isPressed) return;
                  const progress = Math.min((Date.now() - pressStartTime) / 5000 * 100, 100);
                  progressIndicator.style.width = `${progress}%`;

                  if (progress >= 100) {
                      clearInterval(progressInterval);
                      overlay.classList.add('fade-out');
                      setTimeout(() => {
                          overlay.remove();
                          localStorage.removeItem(LOCK_STATE_KEY);
                          seconds = INITIAL_TIME;
                          localStorage.setItem(TIMER_KEY, seconds);
                          updateTimerDisplay();
                          if (!isPaused) {
                              startTimer();
                          }
                      }, 500);
                  }
              }, 100);
          };

          const stopUnlockProcess = () => {
              isPressed = false;
              clearInterval(progressInterval);
              progressIndicator.style.width = '0%';
          };

          unlockButton.addEventListener('mousedown', startUnlockProcess);
          unlockButton.addEventListener('mouseup', stopUnlockProcess);
          unlockButton.addEventListener('mouseleave', stopUnlockProcess);
          unlockButton.addEventListener('touchstart', startUnlockProcess);
          unlockButton.addEventListener('touchend', stopUnlockProcess);

          overlay.appendChild(warningText);
          overlay.appendChild(unlockButton);
          document.body.appendChild(overlay);
      };

      // 初始化
      updateTimerDisplay();
      if (localStorage.getItem(LOCK_STATE_KEY) === 'locked') {
          triggerSiteblock();
      } else {
          startTimer();
      }
  })();
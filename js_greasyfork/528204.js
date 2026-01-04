// ==UserScript==
// @name         BookingRoomInMeituan
// @namespace    http://tampermonkey.net/
// @version      2025-02-27
// @description  booking a meeting room for meituan
// @author       You
// @match        https://calendar.sankuai.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528204/BookingRoomInMeituan.user.js
// @updateURL https://update.greasyfork.org/scripts/528204/BookingRoomInMeituan.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 设置目标时间常量
  const TARGET_HOUR = 9;
  const TARGET_MINUTE = 29;
  const TARGET_SECOND = 58;

  // 页面加载后延迟1000ms执行
  window.addEventListener('load', function() {
    setTimeout(function() {
      // 查找带有"完成"文本的按钮
      const completeButtons = Array.from(document.querySelectorAll('button')).filter(
        button => button.textContent.includes('完成')
      );

      if (completeButtons.length > 0) {
        const completeBtn = completeButtons[0];
        const parentElement = completeBtn.parentNode;

        // 倒计时和轮询状态变量
        let polling = false;
        let waitingForTime = false;
        let intervalId = null;
        let countdownIntervalId = null;
        let wakeLock = null; // 用于存储屏幕唤醒锁对象

        // 请求屏幕保持唤醒状态
        async function requestWakeLock() {
          try {
            if ('wakeLock' in navigator) {
              wakeLock = await navigator.wakeLock.request('screen');
              console.log('屏幕唤醒锁已激活');

              // 添加可见性变化监听，在切换标签或最小化窗口后再次获取唤醒锁
              document.addEventListener('visibilitychange', async () => {
                if (wakeLock !== null && document.visibilityState === 'visible' && (polling || waitingForTime)) {
                  wakeLock = await navigator.wakeLock.request('screen');
                  console.log('屏幕唤醒锁已重新激活');
                }
              });
            } else {
              console.log('此浏览器不支持屏幕唤醒锁API');
            }
          } catch (err) {
            console.error(`无法获取屏幕唤醒锁: ${err.message}`);
          }
        }

        // 释放屏幕唤醒锁
        function releaseWakeLock() {
          if (wakeLock !== null) {
            wakeLock.release()
              .then(() => {
                console.log('屏幕唤醒锁已释放');
                wakeLock = null;
              })
              .catch((err) => {
                console.error(`释放屏幕唤醒锁错误: ${err.message}`);
              });
          }
        }

        // 创建轮询按钮，样式与原按钮相同
        const pollButton = document.createElement('button');
        pollButton.className = completeBtn.className;
        pollButton.type = 'button';

        // 复制内部结构
        const span = document.createElement('span');
        span.className = 'mtd-button-label';
        span.textContent = '轮询';
        pollButton.appendChild(span);

        // 检查是否到达指定时间
        function isTimeToStart() {
          const now = new Date();
          return (now.getHours() > TARGET_HOUR) ||
                 (now.getHours() === TARGET_HOUR && now.getMinutes() > TARGET_MINUTE) ||
                 (now.getHours() === TARGET_HOUR && now.getMinutes() === TARGET_MINUTE && now.getSeconds() >= TARGET_SECOND);
        }

        // 计算距离目标时间还有多少秒
        function getSecondsUntilTarget() {
          const now = new Date();
          const target = new Date();

          target.setHours(TARGET_HOUR);
          target.setMinutes(TARGET_MINUTE);
          target.setSeconds(TARGET_SECOND);

          // 如果今天的目标时间已经过了，则计算到明天的目标时间
          if (now > target) {
            target.setDate(target.getDate() + 1);
          }

          return Math.floor((target - now) / 1000);
        }

        // 开始轮询函数
        function startPolling() {
          polling = true;
          waitingForTime = false;
          span.textContent = '停止';

          // 请求屏幕保持唤醒
          requestWakeLock();

          // 清除倒计时
          if (countdownIntervalId) {
            clearInterval(countdownIntervalId);
            countdownIntervalId = null;
          }

          // 每200ms点击一次"完成"按钮
          intervalId = setInterval(function() {
            completeBtn.click();
            console.log('自动点击"完成"按钮');
          }, 200);
        }

        // 停止所有轮询和倒计时
        function stopAll() {
          polling = false;
          waitingForTime = false;
          span.textContent = '轮询';

          // 释放屏幕唤醒锁
          releaseWakeLock();

          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }

          if (countdownIntervalId) {
            clearInterval(countdownIntervalId);
            countdownIntervalId = null;
          }

          console.log('停止自动点击');
        }

        // 添加点击事件
        pollButton.addEventListener('click', function() {
          // 如果正在轮询或等待时间，则停止
          if (polling || waitingForTime) {
            stopAll();
            return;
          }

          // 检查是否已经到达开始时间
          if (isTimeToStart()) {
            startPolling();
          } else {
            // 未到时间，开始倒计时
            waitingForTime = true;
            const secondsToWait = getSecondsUntilTarget();
            span.textContent = `等${secondsToWait}秒`;

            // 请求屏幕保持唤醒（在倒计时等待期间也保持屏幕亮着）
            requestWakeLock();

            // 更新倒计时显示
            countdownIntervalId = setInterval(function() {
              const secondsLeft = getSecondsUntilTarget();

              if (secondsLeft <= 0) {
                // 时间到，开始轮询
                startPolling();
              } else {
                span.textContent = `等${secondsToWait}秒`;
              }
            }, 1000);
          }
        });

        // 在原按钮后插入轮询按钮
        parentElement.insertBefore(pollButton, completeBtn.nextSibling);
        console.log('已添加轮询按钮');
      } else {
        console.log('未找到"完成"按钮');
      }
    }, 1000);
  });
})();
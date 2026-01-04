// ==UserScript==
// @name        网页加载速度测试
// @author      DeepSeek
// @version     3.1.7
// @description 测试网页加载速度
// @match       *://*/*
// @run-at      document-start
// @grant       GM_addStyle
// @namespace   https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/461511/%E7%BD%91%E9%A1%B5%E5%8A%A0%E8%BD%BD%E9%80%9F%E5%BA%A6%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/461511/%E7%BD%91%E9%A1%B5%E5%8A%A0%E8%BD%BD%E9%80%9F%E5%BA%A6%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 添加全局样式
  GM_addStyle(`
    @keyframes speedFadeIn {
      0% {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
    
    @keyframes speedFadeOut {
      0% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      100% {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
      }
    }
    
    @keyframes speedometerPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes checkmarkPop {
      0% { transform: scale(0); opacity: 0; }
      70% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    .speed-indicator {
      position: fixed;
      bottom: 25px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.98);
      padding: 14px 24px;
      border-radius: 12px;
      box-shadow: 
        0 4px 20px rgba(0, 0, 0, 0.08),
        0 2px 8px rgba(0, 0, 0, 0.04),
        0 0 0 1px rgba(0, 0, 0, 0.03);
      color: #1a1a1a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.5;
      text-align: center;
      z-index: 2147483647 !important; /* 最高悬浮层级 */
      backdrop-filter: blur(8px);
      animation: speedFadeIn 0.35s cubic-bezier(0.2, 0, 0, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      box-sizing: border-box;
      border: 1px solid rgba(0, 0, 0, 0.08);
      overflow: hidden;
      transition: all 0.2s ease;
      white-space: nowrap; /* 禁止文字折行 */
      min-width: auto; /* 自动宽度 */
      max-width: 95vw; /* 最大宽度限制 */
    }
    
    .speed-indicator:hover {
      box-shadow: 
        0 6px 24px rgba(0, 0, 0, 0.1),
        0 3px 10px rgba(0, 0, 0, 0.05),
        0 0 0 1px rgba(0, 0, 0, 0.04);
      transform: translateX(-50%) translateY(-1px);
    }
    
    .speed-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      position: relative;
      animation: speedometerPulse 2s ease-in-out infinite;
    }
    
    .speed-icon::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #007aff, #34c759);
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M11 20v-6.07A7.961 7.961 0 0 1 4 7.07V4h16v3.07c0 3.89-2.56 7.17-6.09 8.27L13 20h-2z'/%3E%3C/svg%3E");
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
    }
    
    .speed-text {
      font-size: 15px;
      font-weight: 600;
      color: #1d1d1f;
      letter-spacing: -0.2px;
      white-space: nowrap; /* 禁止文字折行 */
    }
    
    .speed-time {
      color: #007aff;
      font-weight: 700;
      margin-left: 4px;
      white-space: nowrap; /* 禁止文字折行 */
    }
    
    .speed-checkmark {
      width: 16px;
      height: 16px;
      margin-left: 8px;
      opacity: 0;
      animation: checkmarkPop 0.5s ease-out 0.3s forwards;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .speed-checkmark::before {
      content: '✓';
      color: #34c759;
      font-weight: 700;
      font-size: 12px;
    }
    
    .speed-progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      background: linear-gradient(90deg, #34c759, #007aff);
      width: 0%;
      transition: width 1.5s ease-out;
      border-radius: 0 0 12px 12px;
    }
  `);

  // 创建显示元素
  const container = document.createElement('div');
  container.className = 'speed-indicator';
  container.style.zIndex = '2147483647';
  
  const icon = document.createElement('div');
  icon.className = 'speed-icon';
  
  const textSpan = document.createElement('span');
  textSpan.className = 'speed-text';
  textSpan.textContent = '加载耗时: ';
  
  const timeSpan = document.createElement('span');
  timeSpan.className = 'speed-time';
  
  const checkmark = document.createElement('div');
  checkmark.className = 'speed-checkmark';
  
  const progressBar = document.createElement('div');
  progressBar.className = 'speed-progress-bar';
  
  textSpan.appendChild(timeSpan);
  container.appendChild(icon);
  container.appendChild(textSpan);
  container.appendChild(checkmark);
  container.appendChild(progressBar);

  const startTime = performance.now();

  // 监听页面加载完成
  window.addEventListener('load', () => {
    setTimeout(() => {
      const endTime = performance.now();
      const timeElapsed = endTime - startTime;
      
      // 格式化时间显示
      let displayTime;
      
      // 修改颜色判断条件，橙色设置为<2000ms
      if (timeElapsed < 100) {
        displayTime = `${timeElapsed.toFixed(0)} ms`;
        timeSpan.style.color = '#34c759'; // 绿色 - 极快
      } else if (timeElapsed < 1000) {
        displayTime = `${timeElapsed.toFixed(0)} ms`;
        timeSpan.style.color = '#007aff'; // 蓝色 - 快速
      } else if (timeElapsed < 2000) { // 修改为2000ms
        displayTime = `${(timeElapsed / 1000).toFixed(2)} s`;
        timeSpan.style.color = '#ff9500'; // 橙色 - 一般
      } else {
        displayTime = `${(timeElapsed / 1000).toFixed(2)} s`;
        timeSpan.style.color = '#ff3b30'; // 红色 - 较慢
      }
      
      timeSpan.textContent = displayTime;
      
      // 确保元素在最顶层
      container.style.zIndex = '2147483647';
      
      // 添加到页面
      document.body.appendChild(container);
      
      // 触发进度条动画
      setTimeout(() => {
        progressBar.style.width = '100%';
      }, 10);
      
      // 根据加载时间调整显示时长
      let displayDuration = 1800;
      if (timeElapsed < 500) displayDuration = 1200;
      else if (timeElapsed > 2000) displayDuration = 2500; // 调整为2000ms以上显示更久
      
      // 淡出消失
      setTimeout(() => {
        container.style.animation = 'speedFadeOut 0.3s ease forwards';
        setTimeout(() => {
          if (container.parentNode) {
            container.remove();
          }
        }, 300);
      }, displayDuration);
      
      // 点击快速关闭
      container.addEventListener('click', () => {
        container.style.animation = 'speedFadeOut 0.2s ease forwards';
        setTimeout(() => {
          if (container.parentNode) {
            container.remove();
          }
        }, 200);
      });
      
    }, 50);
  });
})();
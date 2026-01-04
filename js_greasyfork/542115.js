// ==UserScript==
// @name         B站清理工具
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @date         2025-07-17
// @description  B站清理工具,一键清理B站私信,点赞,回复,系统通知等功能。
// @author       zisull@qq.com
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542115/B%E7%AB%99%E6%B8%85%E7%90%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/542115/B%E7%AB%99%E6%B8%85%E7%90%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --------- 日志工具 ---------
  function log(msg) {
    const logArea = document.getElementById('bili-debug-log');
    if (logArea) {
      logArea.value += `[${new Date().toLocaleTimeString()}] ${msg}\n`;
      logArea.scrollTop = logArea.scrollHeight;
    }
  }

  // --------- 3D高级可拖动悬浮按钮 ---------
  const floatBtn = document.createElement('div');
  floatBtn.id = 'bili-float-btn';
  floatBtn.innerHTML = `
      <div class="bili-3d-btn">
        <svg width="25" height="25" viewBox="0 0 48 48">
          <defs>
            <radialGradient id="bili3d-grad" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stop-color="#fff" stop-opacity="0.98"/>
              <stop offset="40%" stop-color="#a18cd1" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#6d5b9c" stop-opacity="1"/>
            </radialGradient>
            <filter id="bili3d-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#a18cd1" flood-opacity="0.6"/>
              <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#fff" flood-opacity="0.3"/>
            </filter>
            <linearGradient id="bili-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
              <stop offset="50%" stop-color="#f0f8ff" stop-opacity="0.95"/>
              <stop offset="100%" stop-color="#e6f3ff" stop-opacity="0.9"/>
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="22" fill="url(#bili3d-grad)" filter="url(#bili3d-shadow)" stroke="#fff" stroke-width="0.5" opacity="0.95"/>
          <ellipse cx="24" cy="16" rx="10" ry="3" fill="#fff" opacity="0.4"/>
          <ellipse cx="24" cy="18" rx="6" ry="1.5" fill="#fff" opacity="0.6"/>

          <!-- 现代盾牌清理图标 -->
          <g transform="translate(24,24)">
            <!-- 主盾牌形状 -->
            <g opacity="0.95">
              <path d="M0,-12 C6,-12 10,-8 10,-2 C10,4 6,10 0,12 C-6,10 -10,4 -10,-2 C-10,-8 -6,-12 0,-12 Z" 
                    fill="url(#bili-icon-grad)" stroke="#fff" stroke-width="1" opacity="0.9"/>
              <path d="M0,-10 C5,-10 8,-7 8,-2 C8,3 5,8 0,10 C-5,8 -8,3 -8,-2 C-8,-7 -5,-10 0,-10 Z" 
                    fill="rgba(255,255,255,0.3)" opacity="0.8"/>
            </g>
            
            <!-- 中心清理符号 -->
            <g opacity="0.9">
              <!-- 垃圾桶图标 -->
              <rect x="-4" y="-2" width="8" height="6" rx="1" fill="#fff" opacity="0.8"/>
              <rect x="-3" y="-3" width="6" height="1" rx="0.5" fill="#fff" opacity="0.9"/>
              <rect x="-1" y="-4" width="2" height="1" rx="0.5" fill="#fff" opacity="0.7"/>
              
              <!-- 垃圾桶内部线条 -->
              <line x1="-2" y1="0" x2="-2" y2="2" stroke="url(#bili-icon-grad)" stroke-width="0.8" opacity="0.6"/>
              <line x1="0" y1="0" x2="0" y2="2" stroke="url(#bili-icon-grad)" stroke-width="0.8" opacity="0.6"/>
              <line x1="2" y1="0" x2="2" y2="2" stroke="url(#bili-icon-grad)" stroke-width="0.8" opacity="0.6"/>
            </g>
            
            <!-- 清理波纹效果 -->
            <g opacity="0.7">
              <circle cx="0" cy="0" r="6" fill="none" stroke="#fff" stroke-width="1" opacity="0.5">
                <animate attributeName="r" values="6;12;18" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;0.2;0" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="0" cy="0" r="6" fill="none" stroke="#fff" stroke-width="0.8" opacity="0.4">
                <animate attributeName="r" values="6;12;18" dur="2s" begin="0.7s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.4;0.15;0" dur="2s" begin="0.7s" repeatCount="indefinite"/>
              </circle>
              <circle cx="0" cy="0" r="6" fill="none" stroke="#fff" stroke-width="0.6" opacity="0.3">
                <animate attributeName="r" values="6;12;18" dur="2s" begin="1.4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.1;0" dur="2s" begin="1.4s" repeatCount="indefinite"/>
              </circle>
            </g>
            
            <!-- 飞散粒子 -->
            <g opacity="0.8">
              <!-- 粒子组1 -->
              <g>
                <circle cx="8" cy="-4" r="1" fill="#fff" opacity="0.7">
                  <animateTransform attributeName="transform" type="translate" values="0,0; 4,-2; 8,-4" dur="1.5s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.7;0.3;0" dur="1.5s" repeatCount="indefinite"/>
                  <animate attributeName="r" values="1;0.5;0.2" dur="1.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="-6" cy="6" r="0.8" fill="#fff" opacity="0.6">
                  <animateTransform attributeName="transform" type="translate" values="0,0; -3,3; -6,6" dur="1.8s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.6;0.2;0" dur="1.8s" repeatCount="indefinite"/>
                  <animate attributeName="r" values="0.8;0.4;0.1" dur="1.8s" repeatCount="indefinite"/>
                </circle>
                <circle cx="4" cy="8" r="0.6" fill="#fff" opacity="0.5">
                  <animateTransform attributeName="transform" type="translate" values="0,0; 2,4; 4,8" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.5;0.2;0" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="r" values="0.6;0.3;0.1" dur="2s" repeatCount="indefinite"/>
                </circle>
              </g>
            </g>
            
            <!-- 检查标记 -->
            <g opacity="0.9" transform="translate(6,-8)">
              <circle cx="0" cy="0" r="3" fill="rgba(76,175,80,0.9)" stroke="#fff" stroke-width="0.5"/>
              <path d="M-1,0 L0,1 L2,-1" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round"/>
              <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite"/>
            </g>
          </g>
        </svg>
        <div class="bili-3d-glow"></div>
        <div class="bili-3d-ring"></div>
      </div>
    `;
  document.body.appendChild(floatBtn);
  let dragging = false, offsetX = 0, offsetY = 0;
  floatBtn.onmousedown = function (e) {
    dragging = true;
    offsetX = e.clientX - floatBtn.offsetLeft;
    offsetY = e.clientY - floatBtn.offsetTop;
    document.body.style.userSelect = 'none';
    floatBtn.style.transition = 'none';
  };
  document.onmousemove = function (e) {
    if (dragging) {
      floatBtn.style.left = (e.clientX - offsetX) + 'px';
      floatBtn.style.top = (e.clientY - offsetY) + 'px';
    }
  };
  document.onmouseup = function () {
    if (dragging) {
      dragging = false;
      document.body.style.userSelect = '';
      // 增强的自动贴边吸附逻辑
      const winW = window.innerWidth, winH = window.innerHeight;
      let left = floatBtn.offsetLeft, top = floatBtn.offsetTop;
      const btnW = floatBtn.offsetWidth, btnH = floatBtn.offsetHeight;

      // 计算到各边的距离
      const distToLeft = left;
      const distToRight = winW - left - btnW;
      const distToTop = top;
      const distToBottom = winH - top - btnH;

      // 找到最近的边
      const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);

      // 根据最近的边进行吸附
      if (minDist === distToLeft) {
        // 吸附到左边
        left = 20;
      } else if (minDist === distToRight) {
        // 吸附到右边
        left = winW - btnW - 20;
      } else if (minDist === distToTop) {
        // 吸附到顶部
        top = 20;
        left = left < winW / 2 ? 20 : winW - btnW - 20; // 同时水平吸附
      } else {
        // 吸附到底部
        top = winH - btnH - 20;
        left = left < winW / 2 ? 20 : winW - btnW - 20; // 同时水平吸附
      }

      // 确保不超出边界，并应用贴边半隐藏效果
      let snapLeft = Math.max(20, Math.min(left, winW - btnW - 20));
      let snapTop = Math.max(20, Math.min(top, winH - btnH - 20));

      // 贴边半隐藏效果
      if (minDist === distToLeft) {
        snapLeft = -btnW / 2; // 左边半隐藏
      } else if (minDist === distToRight) {
        snapLeft = winW - btnW / 2; // 右边半隐藏
      } else if (minDist === distToTop) {
        snapTop = -btnH / 2; // 顶部半隐藏
        snapLeft = left < winW / 2 ? -btnW / 2 : winW - btnW / 2;
      } else if (minDist === distToBottom) {
        snapTop = winH - btnH / 2; // 底部半隐藏
        snapLeft = left < winW / 2 ? -btnW / 2 : winW - btnW / 2;
      }

      floatBtn.style.transition = 'left 0.3s cubic-bezier(.5,1.8,.5,1), top 0.3s cubic-bezier(.5,1.8,.5,1)';
      floatBtn.style.left = snapLeft + 'px';
      floatBtn.style.top = snapTop + 'px';

      // 拖拽结束后更新菜单位置
      if (menuVisible) {
        setTimeout(() => updateMenuPosition(), 300);
      }
    }
  };
  floatBtn.style.position = 'fixed';
  floatBtn.style.right = '20px';
  floatBtn.style.bottom = '20px';
  floatBtn.style.width = '34px';
  floatBtn.style.height = '34px';
  floatBtn.style.zIndex = '100000';
  floatBtn.style.cursor = 'grab';
  floatBtn.style.display = 'flex';
  floatBtn.style.alignItems = 'center';
  floatBtn.style.justifyContent = 'center';
  floatBtn.style.background = 'none';
  floatBtn.style.transition = 'box-shadow 0.3s, transform 0.2s';
  floatBtn.onmouseenter = () => {
    floatBtn.style.transform = 'scale(1.12) rotateZ(-5deg)';
    floatBtn.style.filter = 'brightness(1.1) saturate(1.2)';
    floatBtn.querySelector('.bili-3d-glow').style.animationDuration = '1.5s';
    floatBtn.querySelector('.bili-3d-ring').style.animationDuration = '2s';
  };
  floatBtn.onmouseleave = () => {
    floatBtn.style.transform = '';
    floatBtn.style.filter = '';
    floatBtn.querySelector('.bili-3d-glow').style.animationDuration = '3s';
    floatBtn.querySelector('.bili-3d-ring').style.animationDuration = '4s';
  };

  // --------- 动态美观悬停弹出菜单 ---------
  const menu = document.createElement('div');
  menu.id = 'bili-float-menu';
  menu.innerHTML = `
      <div class="bili-float-menu-item" data-win="clean"><span>🧹</span> 清理窗口</div>
      <div class="bili-float-menu-item" data-win="debug"><span>💻</span> 调试日志</div>
      <div class="bili-float-menu-item" data-win="author"><span>🏠</span> 作者主页</div>
      <div class="bili-float-menu-item" data-win="donate"><span>🎁</span> 赞赏作者</div>
    `;
  document.body.appendChild(menu);
  menu.style.display = 'none';

  // 菜单位置计算函数
  function updateMenuPosition() {
    // 先显示菜单以获取准确的尺寸（包括主题栏）
    const wasHidden = menu.style.display === 'none';
    if (wasHidden) {
      menu.style.display = 'block';
      menu.style.visibility = 'hidden'; // 临时隐藏但保持布局
    }

    const btnRect = floatBtn.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const centerX = winW / 2;

    // 恢复菜单状态
    if (wasHidden) {
      menu.style.display = 'none';
      menu.style.visibility = 'visible';
    }

    // 计算按钮中心点
    const btnCenterX = btnRect.left + btnRect.width / 2;

    // 判断按钮相对于屏幕中心的位置
    const isLeft = btnCenterX < centerX;

    let left, top;
    const offset = 50; // 增加菜单与按钮的间距，确保完全不重叠

    if (isLeft) {
      // 按钮在左侧，菜单显示在右侧
      left = btnRect.right + offset;
    } else {
      // 按钮在右侧，菜单显示在左侧
      left = btnRect.left - menuRect.width - offset;
    }

    // 优化的垂直定位逻辑：确保菜单完全显示且与按钮对齐（包含主题栏高度）
    const btnCenterY = btnRect.top + btnRect.height / 2;
    const centerY = winH / 2;
    const safeMargin = 20; // 增加安全边距
    const themeBarHeight = 50; // 主题栏预估高度
    const totalMenuHeight = menuRect.height + themeBarHeight; // 菜单总高度

    if (btnCenterY < centerY) {
      // 按钮在屏幕上半部分，菜单顶部与按钮顶部对齐
      top = btnRect.top;
      // 检查是否会超出底部（考虑主题栏高度）
      if (top + totalMenuHeight > winH - safeMargin) {
        top = winH - totalMenuHeight - safeMargin;
      }
    } else {
      // 按钮在屏幕下半部分，菜单底部与按钮底部对齐
      top = btnRect.bottom - totalMenuHeight;
      // 检查是否会超出顶部
      if (top < safeMargin) {
        top = safeMargin;
      }
    }

    // 水平边界检查
    left = Math.max(safeMargin, Math.min(left, winW - menuRect.width - safeMargin));

    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
    menu.style.right = 'auto';
    menu.style.bottom = 'auto';
  }

  // 点击切换菜单显示/隐藏
  let menuVisible = false;
  floatBtn.addEventListener('click', (e) => {
    // 防止拖拽时触发点击
    if (dragging) return;

    e.stopPropagation();
    menuVisible = !menuVisible;

    if (menuVisible) {
      menu.style.display = 'block';
      updateMenuPosition();
      menu.classList.add('bili-menu-animate-in');
      // 添加打开时的震动反馈
      floatBtn.style.animation = 'biliButtonPulse 0.3s ease-out';
      setTimeout(() => floatBtn.style.animation = '', 300);
    } else {
      menu.style.display = 'none';
      menu.classList.remove('bili-menu-animate-in');
    }
  });

  // 点击页面其他地方关闭菜单
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !floatBtn.contains(e.target)) {
      menuVisible = false;
      menu.style.display = 'none';
    }
  });

  // 窗口大小改变时更新菜单位置
  window.addEventListener('resize', () => {
    if (menuVisible && menu.style.display === 'block') {
      updateMenuPosition();
    }
  });

  menu.style.position = 'fixed';
  menu.style.zIndex = '100001';
  menu.style.background = 'rgba(255,255,255,0.98)';
  menu.style.borderRadius = '18px';
  menu.style.boxShadow = '0 6px 32px #a18cd144, 0 1.5px 8px #fff8';
  menu.style.padding = '12px 0';
  menu.style.minWidth = '120px';
  menu.style.fontFamily = 'Microsoft Yahei,Arial,sans-serif';
  menu.style.userSelect = 'none';
  menu.style.backdropFilter = 'blur(6px)';
  Array.from(menu.children).forEach((item, i) => {
    item.style.padding = '12px 28px';
    item.style.cursor = 'pointer';
    item.style.fontSize = '1.08rem';
    item.style.borderRadius = '12px';
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.gap = '10px';
    item.style.transition = 'background 0.18s, transform 0.18s';
    item.onmouseenter = () => {
      item.style.background = 'linear-gradient(135deg, #f3e6ff 0%, #e8d5ff 100%)';
      item.style.transform = 'translateX(4px) scale(1.06)';
      item.style.boxShadow = '0 4px 12px rgba(161, 140, 209, 0.3)';
      item.style.borderRadius = '12px';
    };
    item.onmouseleave = () => {
      item.style.background = '';
      item.style.transform = '';
      item.style.boxShadow = '';
      item.style.borderRadius = '12px';
    };
    item.style.animation = `biliMenuPop 0.3s cubic-bezier(.5,1.8,.5,1) ${i * 0.06}s both`;
  });

  // --------- 3D立体清理窗口 ---------
  const cleanWin = document.createElement('div');
  cleanWin.id = 'bili-clean-panel';

  // 添加拖拽功能变量
  let cleanWinDragging = false, cleanWinOffsetX = 0, cleanWinOffsetY = 0;
  cleanWin.innerHTML = `
      <div class="bili-clean-title bili-clean-drag-handle">B站清理工具</div>
      <div class="bili-clean-sub bili-clean-toggle">一键清理，焕然一新</div>
      <div class="bili-clean-options">
        <div class="bili-clean-row">
          <label><input type="checkbox" id="clean-reply"> 回复</label>
          <label><input type="checkbox" id="clean-like"> 赞我</label>
          <label><input type="checkbox" id="clean-at"> 艾特</label>
        </div>
        <div class="bili-clean-row">
          <label><input type="checkbox" id="clean-pm"> 私信</label>
          <label><input type="checkbox" id="clean-history"> 历史</label>
          <label><input type="checkbox" id="clean-system"> 系统</label>
        </div>
      </div>
      <button class="bili-clean-btn" id="bili-clean-start"><span class="bili-btn-glow"></span>开始清理</button>
      <div class="bili-clean-table">
        <div class="bili-clean-thead"><span>项目</span><span>状态</span><span>结果</span></div>
        <div class="bili-clean-tbody">
          <div><span>回复</span><span id="clean-status-reply"></span><span id="clean-res-reply"></span></div>
          <div><span>赞我</span><span id="clean-status-like"></span><span id="clean-res-like"></span></div>
          <div><span>艾特</span><span id="clean-status-at"></span><span id="clean-res-at"></span></div>
          <div><span>私信</span><span id="clean-status-pm"></span><span id="clean-res-pm"></span></div>
          <div><span>历史</span><span id="clean-status-history"></span><span id="clean-res-history"></span></div>
          <div><span>系统</span><span id="clean-status-system"></span><span id="clean-res-system"></span></div>
        </div>
      </div>
      <button class="bili-clean-close">关闭</button>
    `;
  document.body.appendChild(cleanWin);
  cleanWin.style.display = 'none';

  // 添加全选/反选功能
  const toggleSubtitle = cleanWin.querySelector('.bili-clean-toggle');
  toggleSubtitle.style.cursor = 'pointer';
  toggleSubtitle.style.userSelect = 'none';
  toggleSubtitle.style.transition = 'color 0.2s, transform 0.2s';

  toggleSubtitle.onclick = function () {
    const checkboxes = cleanWin.querySelectorAll('input[type="checkbox"]');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const shouldCheckAll = checkedCount < checkboxes.length;

    // 切换所有复选框状态
    checkboxes.forEach(checkbox => {
      checkbox.checked = shouldCheckAll;
    });

    // 添加点击反馈动画
    toggleSubtitle.style.transform = 'scale(0.95)';
    setTimeout(() => {
      toggleSubtitle.style.transform = '';
    }, 150);

    // 更新提示文本
    const statusText = shouldCheckAll ? '已全选' : '已取消';
    toggleSubtitle.textContent = `一键清理，焕然一新 (${statusText})`;
    setTimeout(() => {
      toggleSubtitle.textContent = '一键清理，焕然一新';
    }, 1500);
  };

  // 添加悬停效果
  toggleSubtitle.onmouseenter = () => {
    toggleSubtitle.style.color = '#fff';
    toggleSubtitle.style.transform = 'scale(1.02)';
  };
  toggleSubtitle.onmouseleave = () => {
    toggleSubtitle.style.color = '';
    toggleSubtitle.style.transform = '';
  };

  // 清理窗口拖拽功能
  const cleanWinTitle = cleanWin.querySelector('.bili-clean-drag-handle');
  cleanWinTitle.style.cursor = 'move';
  cleanWinTitle.style.userSelect = 'none';

  cleanWinTitle.onmousedown = function (e) {
    cleanWinDragging = true;
    cleanWinOffsetX = e.clientX - cleanWin.offsetLeft;
    cleanWinOffsetY = e.clientY - cleanWin.offsetTop;
    document.body.style.userSelect = 'none';
    cleanWin.style.transition = 'none';
    cleanWinTitle.style.opacity = '0.8';
  };

  document.addEventListener('mousemove', function (e) {
    if (cleanWinDragging) {
      const newLeft = e.clientX - cleanWinOffsetX;
      const newTop = e.clientY - cleanWinOffsetY;

      // 边界限制
      const maxLeft = window.innerWidth - cleanWin.offsetWidth - 10;
      const maxTop = window.innerHeight - cleanWin.offsetHeight - 10;

      cleanWin.style.left = Math.max(10, Math.min(newLeft, maxLeft)) + 'px';
      cleanWin.style.top = Math.max(10, Math.min(newTop, maxTop)) + 'px';
      cleanWin.style.right = 'auto';
      cleanWin.style.bottom = 'auto';
    }
  });

  document.addEventListener('mouseup', function () {
    if (cleanWinDragging) {
      cleanWinDragging = false;
      document.body.style.userSelect = '';
      cleanWin.style.transition = '';
      cleanWinTitle.style.opacity = '';
    }
  });

  // --------- 日志窗口（固定暗色终端风格） ---------
  const debugWin = document.createElement('div');
  debugWin.id = 'bili-debug-panel';
  debugWin.innerHTML = `<div class="bili-debug-title">调试日志</div><textarea id="bili-debug-log" readonly style="width:100%;height:150px;"></textarea><button class="bili-debug-close">关闭</button>`;
  document.body.appendChild(debugWin);
  debugWin.style.display = 'none';

  // --------- 菜单点击切换窗口 ---------
  menu.onclick = function (e) {
    if (!e.target.dataset.win) return;
    cleanWin.style.display = 'none';
    debugWin.style.display = 'none';
    if (e.target.dataset.win === 'clean') cleanWin.style.display = 'block';
    if (e.target.dataset.win === 'debug') debugWin.style.display = 'block';
    if (e.target.dataset.win === 'author') window.open('https://space.bilibili.com/210900168', '_blank');
    if (e.target.dataset.win === 'donate') donateWin.style.display = 'block';
    // 点击菜单项后关闭菜单
    menuVisible = false;
    menu.style.display = 'none';
  };
  cleanWin.querySelector('.bili-clean-close').onclick = () => {
    cleanWin.style.display = 'none';
  };
  debugWin.querySelector('.bili-debug-close').onclick = () => {
    debugWin.style.display = 'none';
  };

  // --------- 批量清理逻辑 ---------
  async function cleanType(type, statusId, resultId) {
    let succ = 0;
    let last_id = '', last_time = '', isEnd = false; // renamed is_end → isEnd
    let api, getItems, getCursor;
    if (type === 0) {
      api = (id, time) => `https://api.bilibili.com/x/msgfeed/like?id=${id}&like_time=${time}&platform=web&build=0&mobi_app=web`;
      getItems = res => res.data?.total?.items || [];
      getCursor = res => res.data?.total?.cursor || {};
    } else if (type === 1) {
      api = (id, time) => `https://api.bilibili.com/x/msgfeed/reply?id=${id}&like_time=${time}&platform=web&build=0&mobi_app=web`;
      getItems = res => res.data?.items || [];
      getCursor = res => res.data?.cursor || {};
    } else if (type === 2) {
      api = (id, time) => `https://api.bilibili.com/x/msgfeed/at?id=${id}&like_time=${time}&platform=web&build=0&mobi_app=web`;
      getItems = res => res.data?.items || [];
      getCursor = res => res.data?.cursor || {};
    } else if (type === 3) {
      // 私信删除特殊处理
      return await cleanPrivateMessages(statusId, resultId);
    } else if (type === 4) {
      // 历史记录清空特殊处理
      return await clearHistory(statusId, resultId);
    } else if (type === 5) {
      // 系统消息清空特殊处理
      return await clearSystemMessages(statusId, resultId);
    }
    let total = 0, done = 0;
    progressBarWrap.style.display = 'block';
    progressBar.style.width = '0';
    // 预估总数
    let url = api(last_id, last_time);
    let res = await fetch(url, { credentials: 'include' }).then(r => r.json()).catch(err => {
      log('请求异常: ' + err);
      return null;
    });
    if (res && res.code === 0) {
      let items = getItems(res);
      total = items.length * 10; // 粗略估算
    }
    while (!isEnd) {
      let url = api(last_id, last_time);
      log(`获取消息列表: ${url}`);
      let res = await fetch(url, { credentials: 'include' }).then(r => r.json()).catch(err => {
        log('请求异常: ' + err);
        return null;
      });
      if (!res || res.code !== 0) {
        log(`接口返回异常: ${res ? res.message : '无响应'}`);
        break;
      }
      let items = getItems(res);
      if (!items.length) {
        log('接口items为空，记录已清空或无待清理项目');
        // 如果是正常返回但无数据，说明已经清空，这也是成功状态
        document.getElementById(resultId).textContent = '记录为空';
        break;
      }
      for (let i = 0; i < items.length; i++) {
        let id = items[i].id;
        let delRes = await testDeleteMsg(id, type);
        log(`删除id=${id} 结果: ${delRes.ok ? '成功' : '失败'} ${delRes.msg}`);
        if (delRes.ok) succ++;
        document.getElementById(statusId).textContent = `${succ}`;
        animateRowStatus(statusId.replace('clean-status-', '')); // make animateRowStatus used
        done++;
        progressBar.style.width = total ? Math.min(100, Math.round(done / total * 100)) + '%' : '30%';
        await new Promise(r => setTimeout(r, 20));
      }
      let cursor = getCursor(res);
      isEnd = cursor['is_end'];
      last_id = cursor.id || '';
      last_time = cursor.time || '';
      if (isEnd) break;
    }
    progressBar.style.width = '100%';
    setTimeout(() => progressBarWrap.style.display = 'none', 800);

    // 优化结果显示逻辑
    const currentResult = document.getElementById(resultId).textContent;
    if (currentResult !== '记录为空') {
      document.getElementById(resultId).textContent = succ > 0 ? '清理完成' : '清理失败';
    }
    log(`类型${type}清理结束，成功${succ}条`);
  }

  // --------- 私信删除逻辑 ---------
  async function cleanPrivateMessages(statusId, resultId) {
    let succ = 0;
    let hasMore = true;
    while (hasMore) {
      try {
        const res = await fetch('https://api.vc.bilibili.com/session_svr/v1/session_svr/get_sessions?session_type=1', {
          credentials: 'include'
        }).then(r => r.json());

        if (!res || res.code !== 0) {
          log(`私信接口返回异常: ${res ? res.message : '无响应'}`);
          break;
        }

        const sessions = res.data?.['session_list'] || []; // bracket notation avoids unresolved warning
        if (sessions.length === 0) {
          log('私信列表为空，清理完毕');
          // 如果是第一次检查就发现为空，说明本来就没有私信，应该显示"记录为空"
          if (succ === 0) {
            document.getElementById(resultId).textContent = '记录为空';
          }
          break;
        }

        for (let i = 0; i < sessions.length; i++) {
          const talkerId = sessions[i]['talker_id']; // bracket notation avoids unresolved warning
          const delRes = await deletePrivateMessage(talkerId);
          if (delRes.ok) succ++;
          document.getElementById(statusId).textContent = `${succ}`;
          animateRowStatus(statusId.replace('clean-status-', '')); // animate row
          await new Promise(r => setTimeout(r, 20));
        }

        // 如果返回的会话数量少于预期，说明没有更多了
        if (sessions.length < 20) {
          hasMore = false;
        }

        await new Promise(r => setTimeout(r, 50));
      } catch (e) {
        log(`私信清理异常: ${e}`);
        break;
      }
    }
    // 优化结果显示逻辑
    const currentResult = document.getElementById(resultId).textContent;
    if (currentResult !== '记录为空') {
      document.getElementById(resultId).textContent = succ > 0 ? '清理完成' : '清理失败';
    }
    log(`私信清理结束，成功${succ}条`);
  }

  // --------- 历史记录清空逻辑 ---------
  async function clearHistory(statusId, resultId) {
    try {
      const csrf = document.cookie.match(/bili_jct=([0-9a-zA-Z]+);?/)?.[1] || '';
      const params = `jsonp=jsonp&csrf=${csrf}`;

      log('开始清空历史记录');
      document.getElementById(statusId).textContent = '处理中...';

      const res = await fetch('https://api.bilibili.com/x/v2/history/clear', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Referer': 'https://www.bilibili.com/',
          'User-Agent': 'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BLA-AL00 Build/HUAWEIBLA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36'
        },
        body: params
      }).then(r => r.text());

      let json;
      try {
        json = JSON.parse(res);
      } catch (e) {
        log('历史记录清空返回内容不是JSON');
        document.getElementById(statusId).textContent = '0';
        document.getElementById(resultId).textContent = '清理失败';
        return;
      }

      const success = json.code === 0;
      document.getElementById(statusId).textContent = success ? '1' : '0';
      document.getElementById(resultId).textContent = success ? '清理完成' : '清理失败';
      log(`历史记录清空结果: ${json.code} ${json.message || ''}`);
    } catch (e) {
      log(`历史记录清空异常: ${e}`);
      document.getElementById(statusId).textContent = '0';
      document.getElementById(resultId).textContent = '清理失败';
    }
  }

  // --------- 系统消息清空逻辑 ---------
  async function clearSystemMessages(statusId, resultId) {
    try {
      const csrf = document.cookie.match(/bili_jct=([0-9a-zA-Z]+);?/)?.[1] || '';
      const jsonData = JSON.stringify({
        csrf: csrf,
        type: 4,
        build: 7650400,
        mobi_app: "android"
      });

      log('开始清空系统消息');
      document.getElementById(statusId).textContent = '处理中...';

      const res = await fetch('https://message.bilibili.com/x/sys-msg/del_notify_list?build=7650400&mobi_app=android&csrf=' + csrf, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 12; BNE-AL00 Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Safari/537.36 Mobile os/android model/BNE-AL00 build/7650400 osVer/12 sdkInt/32 network/2 BiliApp/7650400 mobi_app/android channel/ss_baidusem_022 Buvid/XY35BDC3DAFB5E4325BD78AA6D5B43CC37E52 sessionID/d2c7f7c4 innerVer/7650400 c_locale/zh_CN s_locale/zh_CN disable_rcmd/0'
        },
        body: jsonData
      }).then(r => r.text());

      let json;
      try {
        json = JSON.parse(res);
      } catch (e) {
        log('系统消息清空返回内容不是JSON');
        document.getElementById(statusId).textContent = '0';
        document.getElementById(resultId).textContent = '清理失败';
        return;
      }

      const success = json.code === 0;
      document.getElementById(statusId).textContent = success ? '1' : '0';
      document.getElementById(resultId).textContent = success ? '清理完成' : '清理失败';
      log(`系统消息清空结果: ${json.code} ${json.message || ''}`);
    } catch (e) {
      log(`系统消息清空异常: ${e}`);
      document.getElementById(statusId).textContent = '0';
      document.getElementById(resultId).textContent = '清理失败';
    }
  }

  // --------- 删除私信函数 ---------
  async function deletePrivateMessage(talkerId) {
    // 安全检查：确保必要参数存在
    if (!talkerId || talkerId === '' || talkerId === undefined || talkerId === null) {
      log(`私信删除参数不完整，跳过删除操作: talkerId=${talkerId}`);
      return { ok: false, raw: '', msg: '参数不完整，跳过操作' };
    }

    const csrf = document.cookie.match(/bili_jct=([0-9a-zA-Z]+);?/)?.[1] || '';
    if (!csrf) {
      log('未找到CSRF令牌，可能未登录');
      return { ok: false, raw: '', msg: '未找到CSRF令牌' };
    }

    const params = `talker_id=${talkerId}&session_type=1&build=0&mobi_app=web&csrf_token=${csrf}&csrf=${csrf}`;
    try {
      const res = await fetch('https://api.vc.bilibili.com/session_svr/v1/session_svr/remove_session', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Referer': 'https://www.bilibili.com/',
          'User-Agent': 'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BLA-AL00 Build/HUAWEIBLA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36'
        },
        body: params
      }).then(r => r.text());
      let json;
      try {
        json = JSON.parse(res);
      } catch (e) {
        return { ok: false, raw: res, msg: '返回内容不是JSON' };
      }
      return { ok: json.code === 0, raw: res, msg: json.message || '' };
    } catch (e) {
      return { ok: false, raw: '', msg: '请求异常: ' + e };
    }
  }

  cleanWin.querySelector('#bili-clean-start').onclick = async function () {
    ['reply', 'like', 'at', 'pm', 'history', 'system'].forEach(t => {
      document.getElementById('clean-status-' + t).textContent = '0';
      document.getElementById('clean-res-' + t).textContent = '';
    });
    if (document.getElementById('clean-reply').checked) {
      document.getElementById('clean-status-reply').textContent = '0';
      await cleanType(1, 'clean-status-reply', 'clean-res-reply');
    }
    if (document.getElementById('clean-like').checked) {
      document.getElementById('clean-status-like').textContent = '0';
      await cleanType(0, 'clean-status-like', 'clean-res-like');
    }
    if (document.getElementById('clean-at').checked) {
      document.getElementById('clean-status-at').textContent = '0';
      await cleanType(2, 'clean-status-at', 'clean-res-at');
    }
    if (document.getElementById('clean-pm').checked) {
      document.getElementById('clean-status-pm').textContent = '0';
      await cleanType(3, 'clean-status-pm', 'clean-res-pm');
    }
    if (document.getElementById('clean-history').checked) {
      document.getElementById('clean-status-history').textContent = '0';
      await cleanType(4, 'clean-status-history', 'clean-res-history');
    }
    if (document.getElementById('clean-system').checked) {
      document.getElementById('clean-status-system').textContent = '0';
      await cleanType(5, 'clean-status-system', 'clean-res-system');
    }
  };

  // --------- 获取消息id和单条删除函数 ---------
  async function testDeleteMsg(id, type) {
    // 安全检查：确保必要参数存在
    if (!id || id === '' || type === undefined || type === null) {
      log(`参数不完整，跳过删除操作: id=${id}, type=${type}`);
      return { ok: false, raw: '', msg: '参数不完整，跳过操作' };
    }

    const csrf = document.cookie.match(/bili_jct=([0-9a-zA-Z]+);?/)?.[1] || '';
    if (!csrf) {
      log('未找到CSRF令牌，可能未登录');
      return { ok: false, raw: '', msg: '未找到CSRF令牌' };
    }

    const params = `tp=${type}&id=${encodeURIComponent(id)}&build=0&mobi_app=web&csrf_token=${csrf}&csrf=${csrf}`;
    try {
      const res = await fetch('https://api.bilibili.com/x/msgfeed/del', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Referer': 'https://www.bilibili.com/',
          'User-Agent': 'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BLA-AL00 Build/HUAWEIBLA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36'
        },
        body: params
      }).then(r => r.text());
      let json;
      try {
        json = JSON.parse(res);
      } catch (e) {
        return { ok: false, raw: res, msg: '返回内容不是JSON' };
      }
      return { ok: json.code === 0, raw: res, msg: json.message || '' };
    } catch (e) {
      return { ok: false, raw: '', msg: '请求异常: ' + e };
    }
  }

  // --------- 清理进度条 ---------
  const progressBarWrap = document.createElement('div');
  progressBarWrap.id = 'bili-clean-progress';
  progressBarWrap.style.height = '8px';
  progressBarWrap.style.background = '#fff3';
  progressBarWrap.style.borderRadius = '4px';
  progressBarWrap.style.overflow = 'hidden';
  progressBarWrap.style.margin = '10px 0';
  progressBarWrap.style.display = 'none';
  const progressBar = document.createElement('div');
  progressBar.id = 'bili-clean-progress-bar';
  progressBar.style.height = '100%';
  progressBar.style.width = '0';
  progressBar.style.background = 'linear-gradient(90deg,#a18cd1,#fbc2eb)';
  progressBar.style.transition = 'width 0.3s';
  progressBarWrap.appendChild(progressBar);
  cleanWin.insertBefore(progressBarWrap, cleanWin.querySelector('.bili-clean-table'));

  // --------- 样式（美化升级+缩小+终端风格日志） ---------
  const style = document.createElement('style');
  style.innerHTML = `
      @keyframes biliMenuPop {
        0% { opacity:0; transform:translateY(16px) scale(0.7); }
        100% { opacity:1; transform:translateY(0) scale(1); }
      }
      @keyframes biliButtonPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); }
      }
      .bili-3d-btn {
        position: relative;
        width: 34px; height: 34px;
        display: flex; align-items: center; justify-content: center;
        perspective: 90px;
        filter: drop-shadow(0 5px 20px #a18cd1cc) drop-shadow(0 2px 8px #fff8);
        transition: filter 0.3s, transform 0.3s;
        border-radius: 50%;
        box-shadow:
          0 0 0 2px #fff6 inset,
          0 0 0 1px #a18cd144,
          0 4px 16px #a18cd1cc,
          0 1px 5px #fff8,
          0 0 36px #a18cd133;
        background: radial-gradient(circle at 30% 30%, #fff8, #a18cd144);
        overflow: visible;
      }
      .bili-3d-btn:hover {
        filter: drop-shadow(0 8px 30px #a18cd1ee) drop-shadow(0 3px 12px #fff8);
        transform: scale(1.08) rotateZ(-3deg);
        box-shadow:
          0 0 0 3px #fff8 inset,
          0 0 0 1.5px #a18cd166,
          0 8px 30px #a18cd1ee,
          0 3px 12px #fff8,
          0 0 50px #a18cd155;
      }
      .bili-3d-glow {
        position: absolute; left: -4px; top: -4px;
        width: calc(100% + 8px); height: calc(100% + 8px);
        border-radius: 50%;
        box-shadow:
          0 0 8px 1px #a18cd188,
          0 0 17px 3px #a18cd144,
          0 0 25px 5px #a18cd122;
        pointer-events: none;
        opacity: 0.8;
        animation: biliGlow 3s infinite alternate cubic-bezier(.5,1.8,.5,1);
      }
      .bili-3d-ring {
        position: absolute; left: -3px; top: -3px;
        width: calc(100% + 6px); height: calc(100% + 6px);
        border-radius: 50%;
        border: 1px solid transparent;
        background: linear-gradient(45deg, #a18cd1, #fbc2eb, #a18cd1) border-box;
        mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
        mask-composite: subtract;
        pointer-events: none;
        opacity: 0.6;
        animation: biliRing 4s linear infinite;
      }
      @keyframes biliGlow {
        0% {
          opacity: 0.6;
          box-shadow:
            0 0 6px 1px #a18cd166,
            0 0 13px 3px #a18cd133,
            0 0 19px 4px #a18cd111;
        }
        100% {
          opacity: 1;
          box-shadow:
            0 0 13px 3px #a18cd1aa,
            0 0 25px 5px #a18cd166,
            0 0 38px 8px #a18cd133;
        }
      }
      @keyframes biliRing {
        0% { transform: rotate(0deg) scale(1); opacity: 0.6; }
        50% { transform: rotate(180deg) scale(1.05); opacity: 0.8; }
        100% { transform: rotate(360deg) scale(1); opacity: 0.6; }
      }
      #bili-float-btn { transition: box-shadow 0.2s, transform 0.2s; }
      #bili-float-menu {
        box-shadow: 0 6px 24px #a18cd144;
        animation: biliMenuPop 0.3s cubic-bezier(.5,1.8,.5,1) both;
        backdrop-filter: blur(10px) saturate(1.2);
        background: rgba(255,255,255,0.85);
        border: 1.2px solid #fff4;
        border-radius: 16px;
        min-width: 90px;
        font-size: 0.95rem;
        padding: 8px 0;
      }
      #bili-clean-panel {
        position: fixed; right: 60px; bottom: 30px; width: 320px;
        background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
        border-radius: 20px; box-shadow: 0 10px 40px #a18cd144, 0 2px 8px #fff8;
        padding: 20px 18px 14px 18px; z-index: 100002;
        font-family: 'Microsoft Yahei', 'SimSun', Arial, sans-serif; color: #fff;
        transform-style: preserve-3d;
        animation: biliPanelIn 0.5s cubic-bezier(.5,1.8,.5,1);
        backdrop-filter: blur(10px) saturate(1.2);
        border: 1.5px solid #fff4;
      }
      @keyframes biliPanelIn {
        0% { opacity:0; transform:rotateY(30deg) scale(0.7) translateY(24px); }
        100% { opacity:1; transform:rotateY(0) scale(1) translateY(0); }
      }
      .bili-clean-title { 
        font-size: 1.35rem; 
        font-weight: bold; 
        letter-spacing: 1px; 
        text-align: center; 
        text-shadow: 0 2px 8px #a18cd1cc; 
        padding: 4px 0;
        border-radius: 12px 12px 0 0;
        transition: background 0.2s, opacity 0.2s;
      }
      .bili-clean-drag-handle:hover {
        background: rgba(255,255,255,0.1);
        cursor: move;
      }
      .bili-clean-drag-handle:active {
        background: rgba(255,255,255,0.2);
        opacity: 0.8;
      }
      .bili-clean-sub { font-size: 0.95rem; margin-top: 2px; color: #f3e6ff; text-align: center; margin-bottom: 10px; }
      .bili-clean-options { margin: 10px 0 10px 0; }
      .bili-clean-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
      .bili-clean-row label { background: rgba(255,255,255,0.13); border-radius: 8px; padding: 5px 10px; font-size: 0.98rem; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow:0 1px 2px #fff2; transition: background 0.18s, box-shadow 0.18s; }
      .bili-clean-row label:hover { 
        background: #f3e6ff; 
        color: #a18cd1; 
        box-shadow: 0 2px 6px #a18cd1aa; 
        transform: translateY(-1px) scale(1.02);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .bili-clean-row input[type="checkbox"] { accent-color: #a18cd1; width: 15px; height: 15px; }
      .bili-clean-btn { width: 100%; margin: 10px 0 10px 0; padding: 10px 0; background: linear-gradient(90deg, #7f7fd5 0%, #86a8e7 50%, #91eac9 100%); border: none; border-radius: 12px; font-size: 1.05rem; font-weight: bold; color: #fff; cursor: pointer; box-shadow: 0 2px 8px #a18cd110; transition: background 0.2s, box-shadow 0.2s; position:relative; overflow:hidden; }
      .bili-btn-glow { position:absolute; left:0; top:0; width:100%; height:100%; border-radius:12px; box-shadow:0 0 16px 4px #fbc2eb88, 0 0 6px 1px #a18cd1cc; pointer-events:none; opacity:0.5; animation:biliGlow 2.2s infinite alternate cubic-bezier(.5,1.8,.5,1); z-index:0; }
      .bili-clean-btn span { z-index:1; position:relative; }
      .bili-clean-btn:hover { 
        background: linear-gradient(90deg, #91eac9 0%, #86a8e7 50%, #7f7fd5 100%); 
        box-shadow: 0 6px 18px #a18cd1cc; 
        transform: translateY(-2px) scale(1.02);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .bili-clean-table { background: rgba(255,255,255,0.13); border-radius: 10px; padding: 6px 0 0 0; margin-top: 6px; box-shadow:0 1px 4px #fff2; }
      .bili-clean-thead, .bili-clean-tbody > div { display: flex; justify-content: space-between; padding: 6px 10px; font-size: 0.98rem; }
      .bili-clean-thead { font-weight: bold; color: #e0d7ff; border-bottom: 1px solid rgba(255,255,255,0.18); }
      .bili-clean-tbody > div { border-bottom: 1px solid rgba(255,255,255,0.09); color: #fff; transition: background 0.18s; }
      .bili-clean-tbody > div:last-child { border-bottom: none; }
      .bili-clean-tbody > div[data-anim] { animation: biliRowAnim 0.5s cubic-bezier(.5,1.8,.5,1); }
      @keyframes biliRowAnim { 0%{background:#fbc2eb44;} 100%{background:transparent;} }
      .bili-clean-close { width: 100%; margin: 10px 0 0 0; padding: 7px 0; background: rgba(255,255,255,0.22); border: none; border-radius: 8px; font-size: 0.98rem; color: #fff; cursor: pointer; transition: background 0.18s; }
      .bili-clean-close:hover { 
        background: rgba(255,255,255,0.32); 
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(161, 140, 209, 0.3);
      }
      #bili-debug-panel {
        position: fixed; right: 60px; bottom: 30px; width: 340px; background: #181c20; border-radius: 10px; box-shadow: 0 8px 24px #000a, 0 2px 8px #2228; z-index: 100002; color: #e0e0e0; font-family: 'Fira Mono', 'Consolas', 'Menlo', 'monospace'; padding: 14px 14px 10px 14px; animation: biliPanelIn 0.5s cubic-bezier(.5,1.8,.5,1); border: 1.5px solid #222; }
      .bili-debug-title { font-size: 1.05rem; font-weight: bold; margin-bottom: 10px; text-align: center; color: #7fffd4; letter-spacing: 1px; }
      #bili-debug-log {
        background: #181c20;
        border-radius: 6px;
        border: 1px solid #222;
        color: #e0e0e0;
        font-size: 0.92rem;
        font-family: 'Fira Mono', 'Consolas', 'Menlo', 'monospace';
        box-shadow: 0 2px 8px #0004 inset;
        padding: 8px;
        outline: none;
        resize: none;
        line-height: 1.5;
        transition: border 0.2s;
      }
      #bili-debug-log::-webkit-scrollbar { width: 6px; background: #222; }
      #bili-debug-log::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
      .bili-debug-close {
        width: 100%; margin: 10px 0 0 0; padding: 7px 0; background: #23272e; border: none; border-radius: 8px; font-size: 0.98rem; color: #7fffd4; cursor: pointer; transition: background 0.18s, color 0.18s;
      }
      .bili-debug-close:hover { 
        background: #222; 
        color: #fff176; 
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(127, 255, 212, 0.3);
      }
      #bili-clean-progress { box-shadow: 0 2px 6px #a18cd1aa; background: rgba(255,255,255,0.22); border: 1px solid #fff4; height: 5px !important; border-radius: 3px !important; }
      #bili-clean-progress-bar { border-radius: 3px; }
      /* 主题切换动画 */
      #bili-clean-panel, #bili-float-menu {
        transition: background 0.4s, color 0.4s, box-shadow 0.4s;
      }
      /* 悬浮按钮/菜单动效增强 */
      #bili-float-btn:hover {
        box-shadow: 0 8px 25px #a18cd1cc, 0 3px 8px #fff8;
        transform: scale(1.12) rotateZ(-6deg);
      }
      @keyframes biliMenuPop {
        0% { opacity:0; transform:scale(0.7) translateY(16px);}
        80% { transform:scale(1.08) translateY(-4px);}
        100% { opacity:1; transform:scale(1) translateY(0);}
      }
      /* 菜单关闭淡出动画 */
      @keyframes biliMenuFadeOut {
        0% { opacity:1; }
        100% { opacity:0; }
      }
      /* 进度条美化 */
      #bili-clean-progress-bar {
        background: linear-gradient(90deg,#a18cd1,#fbc2eb,#a18cd1);
        background-size: 200% 100%;
        animation: biliProgressMove 1.2s linear infinite;
        box-shadow: 0 2px 8px #a18cd1aa;
      }
      @keyframes biliProgressMove {
        0% { background-position: 0 0; }
        100% { background-position: 100% 0; }
      }
      /* 进度条完成闪光 */
      #bili-clean-progress-bar.flash {
        animation: biliProgressMove 1.2s linear infinite, biliProgressFlash 0.6s;
      }
      @keyframes biliProgressFlash {
        0% { filter: brightness(1.2) drop-shadow(0 0 8px #fff8); }
        60% { filter: brightness(2.2) drop-shadow(0 0 24px #fff8); }
        100% { filter: brightness(1) drop-shadow(0 0 0 #fff0); }
      }
      /* 主题色块选中动画 */
      .bili-theme-dot.active{
        box-shadow:0 0 0 3px #fbc2eb,0 2px 8px #a18cd1cc;border:2.5px solid #f78ca2;transform:scale(1.18);transition:transform 0.18s, box-shadow 0.18s, border 0.18s;
      }
      /* 清理按钮loading动画 */
      .bili-clean-btn.loading { pointer-events:none; opacity:0.7; position:relative; }
      .bili-clean-btn .bili-btn-loading {
        display:inline-block; width:18px; height:18px; vertical-align:middle; margin-right:6px;
        border:2.5px solid #fff4; border-top:2.5px solid #a18cd1; border-radius:50%; animation: biliBtnSpin 0.8s linear infinite;
      }
      @keyframes biliBtnSpin { 100% { transform: rotate(360deg); } }
      /* 表格三列对齐优化 */
      .bili-clean-thead span, .bili-clean-tbody > div > span {
        display: inline-block;
        text-align: center;
      }
      .bili-clean-thead span:nth-child(1), .bili-clean-tbody > div > span:nth-child(1) { width: 60px; text-align: left; }
      .bili-clean-thead span:nth-child(2), .bili-clean-tbody > div > span:nth-child(2) { width: 50px; }
      .bili-clean-thead span:nth-child(3), .bili-clean-tbody > div > span:nth-child(3) { width: 80px; text-align: right; }
      /* 选项按钮对齐优化 */
      .bili-clean-row label {
        flex: 1 1 0;
        text-align: center;
        min-width: 0;
        margin: 0 4px;
        justify-content: center;
      }
      .bili-clean-row {
        gap: 0;
      }
      #bili-donate-panel {
        position: fixed; right: 50%; bottom: 50%; transform: translate(50%,50%);
        background: #fff; border-radius: 18px; box-shadow: 0 8px 32px #a18cd1aa, 0 2px 8px #fff8;
        z-index: 100003; padding: 28px 28px 18px 28px; text-align: center; min-width: 260px;
        font-family: 'Microsoft Yahei', Arial, sans-serif; color: #333;
        animation: biliPanelIn 0.5s cubic-bezier(.5,1.8,.5,1);
      }
      .bili-donate-title { font-size: 1.18rem; font-weight: bold; margin-bottom: 10px; color: #a18cd1; }
      .bili-donate-img { width: 180px; height: 180px; border-radius: 12px; box-shadow: 0 2px 16px #a18cd1aa; margin-bottom: 10px; }
      .bili-donate-tip { color: #888; font-size: 0.98rem; margin-bottom: 12px; }
      .bili-donate-close { padding: 7px 0; width: 100%; border: none; border-radius: 8px; background: #f3e6ff; color: #a18cd1; font-size: 1rem; cursor: pointer; transition: background 0.18s; }
      .bili-donate-close:hover { 
        background: #a18cd1; 
        color: #fff; 
        transform: translateY(-1px) scale(1.02);
        box-shadow: 0 4px 12px rgba(161, 140, 209, 0.4);
      }
    `;
  document.head.appendChild(style);

  // --------- 清理窗口动效输出优化 ---------
  function animateRowStatus(type) {
    const row = document.querySelector(`#clean-status-${type}`)?.parentElement;
    if (row) {
      row.setAttribute('data-anim', '1');
      setTimeout(() => row.removeAttribute('data-anim'), 600);
    }
  }

  // 在批量清理和单条清理时调用 animateRowStatus(type)
  // 例如: animateRowStatus('reply');

  // --------- ESC关闭窗口 ---------
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      [cleanWin, debugWin, donateWin].forEach(win => {
        if (win.style.display === 'block') win.style.display = 'none';
      });
    }
  });

  // --------- 主题切换 ---------
  const THEMES = {
    dark: {
      name: '酷雅黑',
      main: '#181c20',
      btn: '#23272e',
      shadow: '#000a',
      accent: '#7fffd4',
      font: '#e0e0e0',
      table: '#23272e',
      label: '#23272e',
      hover: '#23272e',
      border: '#222',
      dot: 'linear-gradient(135deg,#23272e,#7fffd4)'
    },
    pink: {
      name: '可爱粉',
      main: 'linear-gradient(135deg, #fff0f6 0%, #fbc2eb 60%, #ffb6c1 100%)',
      btn: 'linear-gradient(90deg, #ffb6c1 0%, #fbc2eb 100%)',
      shadow: '#ffb6c144',
      accent: '#ff69b4',
      font: '#333',
      table: 'rgba(255,182,193,0.10)',
      label: 'rgba(255,182,193,0.13)',
      hover: '#ffe4ec',
      border: '#ff69b4',
      dot: 'linear-gradient(135deg,#fbc2eb,#ffb6c1)'
    },
    blue: {
      name: '清新蓝',
      main: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 40%, #5b9df9 100%)',
      btn: 'linear-gradient(90deg, #5b9df9 0%, #e3f2fd 100%)',
      shadow: '#5b9df944',
      accent: '#409eff',
      font: '#222',
      table: 'rgba(91,157,249,0.10)',
      label: 'rgba(91,157,249,0.13)',
      hover: '#e3f2fd',
      border: '#409eff',
      dot: 'linear-gradient(135deg,#90caf9,#5b9df9)'
    },
    green: {
      name: '治愈绿',
      main: 'linear-gradient(135deg, #e0f7ef 0%, #6ee7b7 60%, #34d399 100%)',
      btn: 'linear-gradient(90deg, #10b981 0%, #e0f7ef 100%)',
      shadow: '#34d39944',
      accent: '#10b981',
      font: '#222',
      table: 'rgba(52,211,153,0.10)',
      label: 'rgba(52,211,153,0.13)',
      hover: '#e0f7ef',
      border: '#10b981',
      dot: 'linear-gradient(135deg,#6ee7b7,#34d399)'
    },
    high: {
      name: '高对比',
      main: 'linear-gradient(135deg, #fff 0%, #f5f6fa 100%)',
      btn: 'linear-gradient(90deg, #6366f1 0%, #e0e7ff 100%)',
      shadow: '#6366f144',
      accent: '#6366f1',
      font: '#222',
      table: 'rgba(99,102,241,0.10)',
      label: 'rgba(99,102,241,0.13)',
      hover: '#e0e7ff',
      border: '#6366f1',
      dot: 'linear-gradient(135deg,#6366f1,#e0e7ff)'
    }
  };
  let currentTheme = 'dark';
  // --------- 悬浮按钮主题发光动态样式 ---------
  let floatBtnThemeStyle = document.createElement('style');
  floatBtnThemeStyle.id = 'bili-float-btn-theme';
  document.head.appendChild(floatBtnThemeStyle);

  function applyTheme(theme) {
    const t = THEMES[theme];
    if (!t) return;
    // 动画过渡
    cleanWin.style.transition = 'background 0.4s, color 0.4s, box-shadow 0.4s';
    menu.style.transition = 'background 0.4s, color 0.4s, box-shadow 0.4s';
    // 悬浮按钮主题发光同步
    if (document.getElementById('bili-float-btn-theme')) document.getElementById('bili-float-btn-theme').remove();
    floatBtnThemeStyle = document.createElement('style');
    floatBtnThemeStyle.id = 'bili-float-btn-theme';
    floatBtnThemeStyle.innerHTML = `
        .bili-3d-btn {
          box-shadow:
            0 0 0 2px #fff6 inset,
            0 0 0 1px ${t.accent}44,
            0 4px 17px ${t.accent}cc,
            0 1px 6px #fff8,
            0 0 42px ${t.accent}33;
          background: radial-gradient(circle at 30% 30%, #fff8, ${t.accent}44);
          border: none;
          overflow: visible;
        }
        .bili-3d-btn:hover {
          filter: drop-shadow(0 8px 34px ${t.accent}ee) drop-shadow(0 3px 11px #fff8);
          box-shadow:
            0 0 0 3px #fff8 inset,
            0 0 0 1px ${t.accent}66,
            0 8px 34px ${t.accent}ee,
            0 3px 11px #fff8,
            0 0 56px ${t.accent}55;
        }
        .bili-3d-glow {
          box-shadow:
            0 0 14px 3px ${t.accent}88,
            0 0 28px 6px ${t.accent}44,
            0 0 42px 8px ${t.accent}22;
        }
        .bili-3d-ring {
          background: linear-gradient(45deg, ${t.accent}, #fbc2eb, ${t.accent}) border-box;
        }
        @keyframes biliGlow {
          0% {
            opacity: 0.6;
            box-shadow:
              0 0 11px 2px ${t.accent}66,
              0 0 21px 4px ${t.accent}33,
              0 0 32px 6px ${t.accent}11;
          }
          100% {
            opacity: 1;
            box-shadow:
              0 0 21px 4px ${t.accent}aa,
              0 0 42px 8px ${t.accent}66,
              0 0 63px 13px ${t.accent}33;
          }
        }
      `;
    document.head.appendChild(floatBtnThemeStyle);
    // SVG主色和渐变更新
    const svg = floatBtn.querySelector('svg');
    const grad = svg.querySelector('#bili3d-grad');
    if (grad) {
      grad.innerHTML = `
              <stop offset="0%" stop-color="#fff" stop-opacity="0.98"/>
              <stop offset="40%" stop-color="${t.accent}" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="${t.accent}" stop-opacity="1"/>
            `;
    }
    // 更新图标渐变
    const iconGrad = svg.querySelector('#bili-icon-grad');
    if (iconGrad) {
      iconGrad.innerHTML = `
              <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
              <stop offset="50%" stop-color="#f0f8ff" stop-opacity="0.95"/>
              <stop offset="100%" stop-color="${t.accent}44" stop-opacity="0.9"/>
            `;
    }
    // SVG整体滤镜
    svg.style.filter = `drop-shadow(0 0 12px ${t.accent}88) drop-shadow(0 0 4px #fff8)`;
    // 主面板
    if (theme === 'dark') {
      cleanWin.style.background = '#181c20';
      cleanWin.style.boxShadow = '0 8px 24px #000a, 0 2px 8px #2228';
      cleanWin.style.color = '#e0e0e0';
      cleanWin.style.borderRadius = '10px';
      cleanWin.style.border = '1.5px solid #222';
      cleanWin.style.fontFamily = "'Microsoft Yahei', Arial, sans-serif";
      cleanWin.querySelector('.bili-clean-title').style.color = '#7fffd4';
      cleanWin.querySelector('.bili-clean-title').style.letterSpacing = '1px';
      cleanWin.querySelector('.bili-clean-title').style.fontWeight = 'bold';
      cleanWin.querySelector('.bili-clean-sub').style.color = '#b2dfdb';
      cleanWin.querySelector('.bili-clean-btn').style.background = '#23272e';
      cleanWin.querySelector('.bili-clean-btn').style.color = '#7fffd4';
      cleanWin.querySelector('.bili-clean-btn').style.borderRadius = '8px';
      cleanWin.querySelector('.bili-clean-btn').style.fontWeight = 'bold';
      cleanWin.querySelector('.bili-clean-close').style.background = '#23272e';
      cleanWin.querySelector('.bili-clean-close').style.color = '#7fffd4';
      cleanWin.querySelector('.bili-clean-close').style.borderRadius = '8px';
      cleanWin.querySelector('.bili-clean-close').style.fontWeight = 'bold';
      cleanWin.querySelectorAll('.bili-clean-row label').forEach(lab => {
        lab.style.background = '#23272e';
        lab.style.color = '#e0e0e0';
        lab.style.borderRadius = '6px';
        lab.style.fontFamily = "'Microsoft Yahei', Arial, sans-serif";
      });
      cleanWin.querySelector('.bili-clean-table').style.background = '#23272e';
      cleanWin.querySelectorAll('.bili-clean-thead').forEach(th => th.style.color = '#7fffd4');
      cleanWin.querySelectorAll('.bili-clean-tbody > div').forEach(row => {
        row.style.borderBottom = '1px solid #222';
        row.style.color = '#e0e0e0';
      });
    } else {
      cleanWin.style.background = t.main;
      cleanWin.style.boxShadow = `0 12px 48px ${t.shadow}, 0 2px 12px #fff8`;
      cleanWin.style.color = t.font;
      cleanWin.style.borderRadius = '20px';
      cleanWin.style.border = '';
      cleanWin.style.fontFamily = "'Microsoft Yahei', Arial, sans-serif";
      cleanWin.querySelector('.bili-clean-title').style.color = '';
      cleanWin.querySelector('.bili-clean-title').style.letterSpacing = '';
      cleanWin.querySelector('.bili-clean-title').style.fontWeight = 'bold';
      cleanWin.querySelector('.bili-clean-sub').style.color = t.font;
      cleanWin.querySelector('.bili-clean-btn').style.background = t.btn;
      cleanWin.querySelector('.bili-clean-btn').style.color = t.font;
      cleanWin.querySelector('.bili-clean-btn').style.borderRadius = '12px';
      cleanWin.querySelector('.bili-clean-btn').style.fontWeight = 'bold';
      cleanWin.querySelector('.bili-clean-close').style.background = t.label;
      cleanWin.querySelector('.bili-clean-close').style.color = t.font;
      cleanWin.querySelector('.bili-clean-close').style.borderRadius = '8px';
      cleanWin.querySelector('.bili-clean-close').style.fontWeight = 'bold';
      cleanWin.querySelectorAll('.bili-clean-row label').forEach(lab => {
        lab.style.background = t.label;
        lab.style.color = t.font;
        lab.style.borderRadius = '8px';
        lab.style.fontFamily = "'Microsoft Yahei', Arial, sans-serif";
      });
      cleanWin.querySelector('.bili-clean-table').style.background = t.table;
      cleanWin.querySelectorAll('.bili-clean-thead').forEach(th => th.style.color = t.border);
      cleanWin.querySelectorAll('.bili-clean-tbody > div').forEach(row => {
        row.style.borderBottom = `1px solid ${t.table}`;
        row.style.color = t.font;
      });
    }
    // 菜单
    menu.style.background = t.main;
    menu.style.boxShadow = cleanWin.style.boxShadow;
    menu.style.borderRadius = cleanWin.style.borderRadius;
    menu.style.border = cleanWin.style.border;
    menu.style.opacity = '0.9';
    menu.style.fontFamily = "'Microsoft Yahei', Arial, sans-serif";
    menu.style.color = t.font;
    Array.from(menu.children).forEach(item => {
      if (item.classList && item.classList.contains('bili-float-menu-item')) {
        item.style.background = 'none';
        item.style.color = t.font;
        item.style.fontFamily = "'Microsoft Yahei', Arial, sans-serif";
        item.style.fontWeight = 'bold';
      }
    });
    // 主题高亮
    document.querySelectorAll('.bili-theme-dot').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    currentTheme = theme;
    localStorage.setItem('bili-theme', theme);
  }

  // --------- 主题切换菜单（色块按钮） ---------
  const themeBar = document.createElement('div');
  themeBar.id = 'bili-theme-bar';
  themeBar.style.display = 'flex';
  themeBar.style.justifyContent = 'space-around';
  themeBar.style.margin = '8px 0 0 0';
  themeBar.style.gap = '6px';
  themeBar.style.padding = '8px 12px 12px 12px'; // 增加底部内边距确保完全显示
  themeBar.style.borderTop = '1px solid rgba(255,255,255,0.2)';
  themeBar.style.fontSize = '0.98rem';
  themeBar.style.userSelect = 'none';
  themeBar.style.minHeight = '40px'; // 确保有足够高度
  themeBar.style.alignItems = 'center'; // 垂直居中对齐
  // 色块按钮生成
  Object.entries(THEMES).forEach(([k, v]) => {
    const dot = document.createElement('span');
    dot.className = 'bili-theme-dot';
    dot.dataset.theme = k;
    dot.title = v.name;
    dot.style.display = 'inline-block';
    dot.style.width = '26px';
    dot.style.height = '26px';
    dot.style.borderRadius = '50%';
    dot.style.margin = '0 2px';
    dot.style.background = v.dot;
    dot.style.cursor = 'pointer';
    dot.style.border = '2.5px solid #fff';
    dot.style.boxShadow = '0 2px 8px #0002';
    dot.style.transition = 'box-shadow 0.18s, border 0.18s, transform 0.18s';
    dot.onmouseenter = () => {
      if (!dot.classList.contains('active')) {
        dot.style.transform = 'scale(1.1)';
        dot.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
      }
    };
    dot.onmouseleave = () => {
      if (!dot.classList.contains('active')) {
        dot.style.transform = '';
        dot.style.boxShadow = '0 2px 8px #0002';
      }
    };
    dot.onclick = () => applyTheme(k);
    themeBar.appendChild(dot);
  });
  menu.appendChild(themeBar);
  // 主题高亮样式
  const themeStyle = document.createElement('style');
  themeStyle.innerHTML = `.bili-theme-dot.active{box-shadow:0 0 0 3px #fbc2eb,0 2px 8px #a18cd1cc;border:2.5px solid #f78ca2;transform:scale(1.12);}`;
  document.head.appendChild(themeStyle);
  // 初始化主题
  setTimeout(() => applyTheme(currentTheme), 100);

  // --------- 赞赏二维码弹窗 ---------
  // 推荐：使用图床直链（如需切换为base64或GitHub raw直链，见下方注释）
  const qrUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4QJmRXhpZgAATU0AKgAAAAgAAodpAAQAAAABAAABMuocAAcAAAEMAAAAJgAAAAAc6gAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKSCAADAAAAAQAAAADqHAAHAAABDAAAAVAAAAAAHOoAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+EB3Wh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPjxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIvPjwveDp4bXBtZXRhPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAa0BrgMBIgACEQEDEQH/xAAcAAEAAgIDAQAAAAAAAAAAAAAAAQYFBwIDBAj/2gAIAQEAAAAA3MAAAAAAAAESAAACEoSAAAESAABGMycvnXfvtamzl9dXT6wAAIkAAhLh8mfWHc+et3Zdpm4XZqrG7nQkAAiQADp0vu2Wn9r+lCXFyj5z2nelXrmywACJABA+Zt/5tjsXZXW7I+ZvojJdHyb9X+qPnbY2xEJACJABrC/5B1dicTgbo176by+SPq701LSv0tPm+bPpftUPP50AIkAGp8NvE8PL2B1dHs6vkr645ab5bijC5qTC+72ABEgCHHx8MkpsXNCa7UdodWkN6PmjdlrxPzN9W8uHgyIkAiQDo1FWrrsnVm3iE12vbD4YnM9WKzUV2wcsPW77GO17eNQ+XalvkBEgI0Ja77qv17cJxdM2N0+HK+PXO0qdqf6JquB2R4tfbOip+C5/NW8MpoXedhARIIPmD6c0huz5u+mNf9958nyr9W+gGvKRvrT/ALdpaf8ABvDw/MG/VF2FgPXW9wQkIkGt9ic/mr6C769qz6B6nax3v5Qkr2Ju/Tz6flb6cyvz/mN0YjQn0d16esmxKDYs8ESCmWHEenQnc39lkjo51rWm9KdbMHkMgasrO+Y0vuTujW+qu6xbyrGkvoHLhEgeCtXThw7a9oD6RyA0927O+V/rP5j+hdQ3Wa1uP5W+js8B18cFn+xIIkQkaH2N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" //占位
  // const qrUrl = "https://raw.githubusercontent.com/zisull/BiliCleaner-Tampermonkey/main/base64.txt";
  // const qrUrl = "YOUR_BASE64_HERE";
  const donateWin = document.createElement('div');
  donateWin.id = 'bili-donate-panel';
  donateWin.style.display = 'none';
  donateWin.innerHTML = `
      <div class=\"bili-donate-title\">赞赏作者</div>
      <img class=\"bili-donate-img\" src=\"${qrUrl}\" alt=\"收款二维码\">
      <div class=\"bili-donate-tip\">感谢支持！</div>
      <button class=\"bili-donate-close\">关闭</button>
    `;
  document.body.appendChild(donateWin);
  donateWin.querySelector('.bili-donate-close').onclick = () => {
    donateWin.style.display = 'none';
  };

})();
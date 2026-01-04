// ==UserScript==
// @name         中国开放大学自动刷课脚本（版本 4.2）
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  自动处理视频、文档、附件、测验，支持随机延迟和防检测，重置状态并重新执行自动化任务，避免重复执行
// @author       GPT
// @match        *://*.ouchn.cn/*/learning-activity/full-screen#/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532210/%E4%B8%AD%E5%9B%BD%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%EF%BC%88%E7%89%88%E6%9C%AC%2042%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/532210/%E4%B8%AD%E5%9B%BD%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%EF%BC%88%E7%89%88%E6%9C%AC%2042%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let isScriptEnabled = false; // 启用/暂停开关
  let isRunning = false;       // 是否任务正在运行
  let videoCheckInterval = null;

  // 创建控制按钮
  function createControlButton() {
    if (document.getElementById('ouchnAutoBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'ouchnAutoBtn';
    btn.textContent = '▶️ 启动';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '80px',
      right: '100px',
      zIndex: '9999',
      padding: '10px 15px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    });

    btn.addEventListener('click', () => {
      isScriptEnabled = !isScriptEnabled;
      btn.textContent = isScriptEnabled ? '⏸️ 暂停' : '▶️ 启动';
      btn.style.backgroundColor = isScriptEnabled ? '#f39c12' : '#4CAF50';
      console.log(`脚本状态：${isScriptEnabled ? '已启用' : '已暂停'}`);
      startScript();
    });

    document.body.appendChild(btn);
  }

  // 设置按钮提示文本
  function updateOuchnBtnText(text, duration = 0) {
    const btn = document.getElementById('ouchnAutoBtn');
    if (!btn) return;

    const prefix = isScriptEnabled ? '⏸️ 暂停' : '▶️ 启动';
    if (duration > 0) {
      let sec = Math.ceil(duration / 1000);
      btn.textContent = `${text} ${sec}s...`;
      const timer = setInterval(() => {
        sec--;
        if (sec > 0) {
          btn.textContent = `${text} ${sec}s...`;
        } else {
          clearInterval(timer);
          btn.textContent = `${prefix} 自动处理`;
        }
      }, 1000);
    } else {
      btn.textContent = `${prefix} ${text}`;
    }
  }

  // 获取随机延迟时间
  function getRandomDelay(min = 2000, max = 5000) {
    if (min > max) [min, max] = [max, min];
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`⏱️ 随机延迟时间：${delay} ms`);
    return delay;
  }

  // 视频处理
  function handleVideoPage() {
    if (videoCheckInterval) clearInterval(videoCheckInterval);

    const video = document.querySelector('video');
    const playBtn = document.querySelector('.mvp-fonts.mvp-fonts-play');
    if (playBtn) playBtn.click();

    videoCheckInterval = setInterval(() => {
      if (!document.querySelector('video') || !isScriptEnabled) {
        clearInterval(videoCheckInterval);
        isRunning = false;
        return;
      }

      const progress = (video.currentTime / video.duration * 100).toFixed(1);
      console.log(`📊 视频进度: ${progress}%`);
      updateOuchnBtnText(`📊 视频进度: ${progress}%`);

      if (progress >= 95) {
        console.log('✅ 视频播放完成，准备跳转');
        clearInterval(videoCheckInterval);
        goToNext();
      }
    }, 1000);
  }

  // 附件处理
  function handleAttachments() {
    const links = Array.from(document.querySelectorAll('a[reveal-modal="file-previewer"]')).filter(link => link.textContent.trim() === '查看');

    if (links.length === 0) {
      console.log('⏩ 当前页无附件，跳转下一页');
      goToNext();
      return;
    }

    console.log(`📁 当前页共 ${links.length} 个附件`);
    let i = 0;

    function next() {
      if (i >= links.length) {
        console.log('🏁 所有附件处理完成，准备跳转');
        goToNext();
        return;
      }

      const link = links[i++];
      const delayClick = getRandomDelay(2000, 5000);
      const delayClose = getRandomDelay(15000, 25000);

      setTimeout(() => {
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        console.log(`✅ 第 ${i}/${links.length} 个附件已点击`);

        updateOuchnBtnText("关闭倒计时", delayClose);

        setTimeout(() => {
          const closeBtn = [...document.querySelectorAll("#file-previewer i, .file-previewer-close")]
            .find(b => b.offsetParent !== null || b.getClientRects().length > 0);
          if (closeBtn) closeBtn.click();
          setTimeout(next, 2000);
        }, delayClose);
      }, delayClick);
    }

    next();
  }

  // 页面类型检测
  function detectPageType() {
    if (document.querySelector('.activity-material')) return 'attachment';
    if (document.querySelector('.activity-details')) return 'video';
    if (document.querySelector('.take-exam')) return 'quiz';
    if (document.querySelector('.forum-wrapper')) return 'forum';
    //if (document.querySelector('.activity-details-toggle')) return 'document';
    return 'document';
  }

  // 跳转下一节
  function goToNext() {
    updateOuchnBtnText('');
    const nextBtn = document.querySelector('.next-btn.ivu-btn');
    isRunning = false;

    if (nextBtn) {
      console.log('⏭️ 跳转下一节');
      nextBtn.click();
      setTimeout(() => startScript(), 2000);
    } else {
      isScriptEnabled = false;
      updateOuchnBtnText('没有下一节');
    }
  }

  // 主逻辑入口
  function startScript() {
    if (!isScriptEnabled || isRunning) return;
    isRunning = true;

    const pageType = detectPageType();
    console.log(`🔍 页面类型：${pageType}`);

    switch (pageType) {
      case 'video':
        handleVideoPage();
        break;
      case 'attachment':
        handleAttachments();
        break;
      case 'document':
      case 'quiz':
      case 'forum':
        const delay = getRandomDelay(3000, 7000);
        updateOuchnBtnText('执行下一节倒计时', delay);
        setTimeout(() => goToNext(), delay);
        break;
      default:
        console.warn('❓ 未识别页面，3 秒后重试');
        setTimeout(() => {
          isRunning = false;
          startScript();
        }, 3000);
    }
  }

  // 初始化入口
  window.addEventListener('load', () => {
    createControlButton();
    console.log('🚀 脚本加载完成');

    setInterval(() => {
      const sidebarMenuItems = document.querySelectorAll('.full-screen-mode-sidebar-menu-item');
      sidebarMenuItems.forEach(item => {
        if (!item.hasAttribute('data-event-bound')) {
          item.addEventListener('click', () => {
            if (!isScriptEnabled) return;
            isRunning = false;
            startScript();
          });
          item.setAttribute('data-event-bound', 'true');
        }
      });
    }, 3000);
  });

})();

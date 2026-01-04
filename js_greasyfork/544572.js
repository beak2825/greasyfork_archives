// ==UserScript==
// @name         新疆继续教育网助手（全自动）
// @namespace    https://jxjy.rst.xinjiang.gov.cn/
// @version      5.0.0
// @description  自动跳转、自动点击课程、自动播放、防中断、日志窗口、每5分钟处理弹窗
// @match        https://wwwxt.xjzcsq.com/TitlesWeb/Continue/Open?matrixId=128
// @match        https://jxjy.rst.xinjiang.gov.cn/pages/home.html
// @match        https://jxjy.rst.xinjiang.gov.cn/pages/personalCenter/index.html
// @match        https://jxjy.rst.xinjiang.gov.cn/pages/personalCenter/myCourses.html
// @match        https://jxjy.rst.xinjiang.gov.cn/pages/courseDetail.html*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544572/%E6%96%B0%E7%96%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E5%8A%A9%E6%89%8B%EF%BC%88%E5%85%A8%E8%87%AA%E5%8A%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544572/%E6%96%B0%E7%96%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E5%8A%A9%E6%89%8B%EF%BC%88%E5%85%A8%E8%87%AA%E5%8A%A8%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const logPrefix = '[助手]';
  const href = location.href;
  const isCourseListPage = href.includes('myCourses.html');
  const isCourseDetailPage = href.includes('courseDetail.html');

  // 页面跳转逻辑（针对非课程播放页）
  if (href.startsWith("https://wwwxt.xjzcsq.com/TitlesWeb/Continue/Open?matrixId=128")) {
    const interval = setInterval(() => {
      const btn = document.querySelector("span.tn-button-text");
      if (btn && btn.textContent.includes("我已知晓")) {
        console.log(`${logPrefix} 点击“我已知晓”按钮`);
        btn.click();
        clearInterval(interval);
      }
    }, 1000);
    return;
  }

  if (href === "https://jxjy.rst.xinjiang.gov.cn/pages/home.html") {
    const interval = setInterval(() => {
      const centerDiv = document.querySelector('div[style*="margin-left: 21px"] a[href="../../pages/personalCenter/index.html"]');
      if (centerDiv) {
        console.log(`${logPrefix} 点击“学习中心”`);
        centerDiv.click();
        clearInterval(interval);
      }
    }, 1000);
    return;
  }

  if (href === "https://jxjy.rst.xinjiang.gov.cn/pages/personalCenter/index.html") {
    const interval = setInterval(() => {
      const dialog = document.querySelector('#layui-layer6');
      const confirmBtn = dialog?.querySelector('.layui-layer-btn0');
      if (dialog && confirmBtn) {
        console.log(`${logPrefix} 检测到过期弹窗，点击“确定”`);
        confirmBtn.click();
        clearInterval(interval);
      } else {
        const courseTab = document.querySelector('li[data-personal-nav="myCourses"] a[href="./myCourses.html"]');
        if (courseTab) {
          console.log(`${logPrefix} 点击“我的课程”`);
          courseTab.click();
          clearInterval(interval);
        }
      }
    }, 1000);
    return;
  }

  // 以下为主逻辑（仅 myCourses.html 与 courseDetail.html 启动）
  function createLogWindow() {
    const div = document.createElement('div');
    div.id = 'logWindow';
    div.style.cssText = `
      position: fixed; top: 10px; right: 10px;
      width: 400px; max-height: 300px; overflow-y: auto;
      background: rgba(0,0,0,0.7); color: #0f0;
      font-size: 12px; padding: 10px;
      z-index: 99999; font-family: monospace;
      border-radius: 6px;
    `;
    const timerDiv = document.createElement('div');
    timerDiv.id = 'countdownDisplay';
    timerDiv.style.cssText = `
      font-size: 16px; font-weight: bold;
      color: #ff0; text-align: center;
      margin-bottom: 6px;
    `;
    timerDiv.textContent = '准备中...';
    div.appendChild(timerDiv);
    document.body.appendChild(div);
  }

  function log(msg) {
    console.log(`${logPrefix} ${msg}`);
    const div = document.getElementById('logWindow');
    if (div) {
      const p = document.createElement('div');
      p.textContent = `${logPrefix} ${msg}`;
      div.appendChild(p);
      div.scrollTop = div.scrollHeight;
    }
  }

  function unlockInteractions() {
    const events = ['contextmenu', 'selectstart', 'dragstart', 'copy', 'cut', 'paste', 'keydown', 'keypress', 'keyup', 'mousedown'];
    const elements = [document, document.documentElement, document.body];
    for (const el of elements) {
      if (!el) continue;
      for (const evt of events) el[`on${evt}`] = null;
    }
    document.addEventListener('contextmenu', e => e.stopPropagation(), true);
    document.addEventListener('keydown', e => e.stopPropagation(), true);
    document.addEventListener('mousedown', e => e.stopPropagation(), true);
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
    window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);
    window.addEventListener('blur', e => e.stopImmediatePropagation(), true);
    window.addEventListener('focus', e => e.stopImmediatePropagation(), true);
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function checkPopupAndConfirm() {
    const popup = document.querySelector('#layui-layer6');
    if (popup && popup.style.display !== 'none') {
      const confirmBtn = popup.querySelector('.layui-layer-btn0');
      if (confirmBtn) {
        log('⚠️ 检测到过期弹窗，自动点击确定');
        confirmBtn.click();
      }
    }
  }

  async function countdown(seconds) {
    const display = document.getElementById('countdownDisplay');
    for (let i = seconds; i >= 0; i--) {
      if (display) display.textContent = `⏳ 本节剩余学习时间：${formatTime(i)}`;
      if (i % 300 === 0) checkPopupAndConfirm();
      await wait(1000);
    }
    if (display) display.textContent = '✅ 本段播放完成';
  }

  function extractWaitMinutesFromNeedStudy(remainStr) {
    const parts = remainStr.split(':');
    if (parts.length !== 3) return 1;
    const [hh, mm, ss] = parts.map(Number);
    return Math.ceil((hh * 3600 + mm * 60 + ss) / 60) + 1;
  }

  function processCurrentPage() {
    const allCourses = document.getElementsByClassName('myCourseAllListTpl');
    log(`当前页共 ${allCourses.length} 门课程`);
    for (let i = 0; i < allCourses.length; i++) {
      const slider = allCourses[i].querySelector('.slider');
      const percent = slider?.textContent?.trim();
      log(`第 ${i + 1} 个课程进度：${percent}`);
      if (percent !== '100%') {
        const link = allCourses[i].querySelector('a');
        if (link) {
          log(`进入第 ${i + 1} 个未完成课程：${link.href}`);
          link.click();
          return true;
        }
      }
    }
    log('当前页没有找到未完成课程');
    return false;
  }

  function goToNextPageIfNeeded() {
    const currPageEl = document.querySelector('.layui-laypage-curr em:last-child');
    const countEl = document.querySelector('.layui-laypage-count');
    const currPage = parseInt(currPageEl?.textContent || '1');
    const totalMatch = countEl?.textContent?.match(/共\s*(\d+)\s*条/);
    const totalCourses = totalMatch ? parseInt(totalMatch[1], 10) : 0;
    const coursesPerPage = 6;
    const totalPages = Math.ceil(totalCourses / coursesPerPage);
    if (currPage >= totalPages) {
      log('已是最后一页，结束检测');
      return;
    }
    const nextBtn = document.querySelector('.layui-laypage-next');
    if (nextBtn) {
      log(`准备跳转下一页 (${currPage + 1} / ${totalPages})`);
      nextBtn.click();
      setTimeout(scanLoop, 1500);
    } else {
      log('未找到“下一页”按钮');
    }
  }

  function scanLoop() {
    const found = processCurrentPage();
    if (!found) goToNextPageIfNeeded();
  }

  async function autoLearnSequentially() {
    const videos = document.querySelectorAll('.chapter-title.isVideo');
    if (!videos.length) return log('❌ 未找到视频章节');
    log(`共找到 ${videos.length} 个视频`);
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const timeEl = video.querySelector('.chapter-title-bottom-title span');
      const durationStr = timeEl?.textContent?.match(/(\d{2}:\d{2}:\d{2})/)?.[1];
      const parent = video.closest('li');
      const needStudySpan = parent?.querySelector('span[style*="right: -16px"]');
      const remainStr = needStudySpan?.textContent?.replace('需再学 ', '').trim();
      if (!durationStr || !remainStr) {
        log(`⚠️ 第 ${i + 1} 个视频信息不全，跳过`);
        continue;
      }
      if (remainStr === '00:00:00') {
        log(`⏩ 第 ${i + 1} 个视频已完成`);
        continue;
      }
      const waitMinutes = extractWaitMinutesFromNeedStudy(remainStr);
      log(`▶️ 学习第 ${i + 1} 个视频（总时长 ${durationStr}，剩余 ${remainStr}，等待 ${waitMinutes} 分钟）`);
      video.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await wait(2000);
      const player = document.querySelector('video');
      if (!player) {
        log('⚠️ 未找到 video 标签');
        continue;
      }
      for (let retry = 0; retry < 10; retry++) {
        if (player.readyState < 3) {
          log('⏳ 视频缓冲中...');
          await wait(2000);
        } else if (player.paused) {
          log('⏯️ 尝试播放');
          player.click();
          await player.play().catch(() => {});
          await wait(1000);
          if (!player.paused && player.currentTime > 0) {
            log('✅ 视频播放成功');
            break;
          }
        } else {
          break;
        }
      }
      await countdown(waitMinutes * 60);
    }
    log('🎉 所有视频播放完毕');
    const slider = document.querySelector('.progress-bar .slider');
    const percent = slider?.textContent?.trim();
    if (percent === '100%') {
      log('🎯 当前课程已完成，跳转回课程列表');
      await wait(2000);
      location.href = 'https://jxjy.rst.xinjiang.gov.cn/pages/personalCenter/myCourses.html';
    } else {
      log(`ℹ️ 当前课程进度为 ${percent || '未知'}，不跳转`);
    }
  }

  // 入口初始化
  window.addEventListener('load', () => {
    if (isCourseListPage || isCourseDetailPage) {
      createLogWindow();
      unlockInteractions();
    }

    if (isCourseListPage) {
      const maxWait = 10000;
      const interval = 500;
      let waited = 0;
      const timer = setInterval(() => {
        const ready = document.querySelector('.myCourseAllListTpl .slider');
        if (ready || waited >= maxWait) {
          clearInterval(timer);
          scanLoop();
        }
        waited += interval;
      }, interval);
    }

    if (isCourseDetailPage) {
      setTimeout(autoLearnSequentially, 2000);
    }
  });
})();

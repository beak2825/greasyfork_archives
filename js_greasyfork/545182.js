// ==UserScript==
// @name         2025年暑期教师研修-高等教育-自动播放
// @namespace    https://github.com/yourname/userscripts
// @version      0.1.0
// @description  在国家智慧教育（高教）课程页，视频自然播完后自动播放右侧目录的下一条未完成视频；兼容 SPA 动态切换
// @author       You
// @match        https://core.teacher.vocational.smartedu.cn/p/course/vocational/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545182/2025%E5%B9%B4%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE-%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/545182/2025%E5%B9%B4%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE-%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===== 可调参数 =====
  const NEAR_END_SECONDS = 1.0; // 兜底：距离结束 <= 1s 认为到尾
  const REBIND_DELAY_MS  = 800; // 目录项点击后，等待新 <video> 出现再重绑的延时
  const START_DELAY_MS   = 500; // 页面初始加载后的启动延时

  // ===== 日志工具 =====
  const LOG_PREFIX = '[AutoNext]';
  const log  = (...a) => console.log(LOG_PREFIX, ...a);
  const warn = (...a) => console.warn(LOG_PREFIX, ...a);

  // ===== 目录与进度解析 =====
  function getSidebarRoot() {
    // 目录的容器（右侧 tab）
    return document.querySelector('.video-tab');
  }

  function getAllItems() {
    // 扁平化拿所有条目（每条是一个“视频标题”块）
    return Array.from(
      document.querySelectorAll('.video-tab .course-info .chapter .video-title')
    );
  }

  function getCurrentItem() {
    // 当前播放项通常带 .on
    return document.querySelector('.video-tab .video-title.on');
  }

  function getProgressPercentText(el) {
    // 右侧条目中显示百分比的节点通常是 span.four
    const p = el.querySelector('span.four');
    return p ? p.textContent.trim() : '';
  }

  function isFinishedItem(el) {
    const txt = getProgressPercentText(el);
    const m = txt && txt.match(/\d+/);
    const val = m ? parseInt(m[0], 10) : 0;
    return Number.isFinite(val) && val >= 100;
  }

  function findNextUnfinished() {
    const items = getAllItems();
    if (!items.length) return null;

    const cur = getCurrentItem();
    const startIdx = cur ? items.indexOf(cur) + 1 : 0;

    // 1) 从当前项之后找第一个未完成
    for (let i = startIdx; i < items.length; i++) {
      if (!isFinishedItem(items[i])) return items[i];
    }
    // 2) 兜底：从头找第一个未完成
    for (let i = 0; i < startIdx; i++) {
      if (!isFinishedItem(items[i])) return items[i];
    }
    // 全部完成
    return null;
  }

  // ===== 视频播放与事件绑定 =====
  let _autoNextBound = false;

  function getVideo() {
    return document.querySelector('#video-Player video') || document.querySelector('video');
  }

  function ensureAutoplay(video) {
    try {
      video.muted = true;      // 为规避自动播放策略，默认静音
      // video.playbackRate = 1.2; // 如需倍速可打开
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (e) {
      // 忽略
    }
  }

  function _clickNextOrStop() {
    const nextItem = findNextUnfinished();
    if (nextItem) {
      log('Go next item →', nextItem.textContent.trim());
      nextItem.click();
      // 新的 <video> 通常会被替换，稍等后重绑
      setTimeout(() => bindAutoNext(true), REBIND_DELAY_MS);
      return true;
    }
    warn('已无未完成条目，本页全部完成。');
    // 如需“跨课程跳转”，可在此处自定义，比如：
    // window.location.href = '...';
    return false;
  }

  function bindAutoNext(rebind = false) {
    const v = getVideo();
    if (!v) {
      warn('未找到 <video>，稍后重试。');
      return;
    }
    if (_autoNextBound && !rebind) return;
    _autoNextBound = true;

    ensureAutoplay(v);

    const onEnded = () => {
      log('Video ended.');
      _clickNextOrStop();
    };

    const onTimeUpdate = () => {
      if (!isFinite(v.duration) || v.duration <= 0) return;
      const left = v.duration - v.currentTime;
      if (left <= NEAR_END_SECONDS) {
        v.removeEventListener('timeupdate', onTimeUpdate);
        log('Near end (<= %ss).', NEAR_END_SECONDS);
        _clickNextOrStop();
      }
    };

    // 清理后再绑，避免重复
    v.removeEventListener('ended', onEnded);
    v.removeEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('ended', onEnded);
    v.addEventListener('timeupdate', onTimeUpdate);

    // 观察视频容器/目录区域 DOM 变化，视频被替换或目录切换时重绑
    const container = document.querySelector('#video-Player') || document.body;
    if (container && !container._autoNextMO) {
      const mo = new MutationObserver(() => {
        const nv = getVideo();
        if (nv && nv !== v) {
          _autoNextBound = false;
          bindAutoNext(true);
        }
      });
      mo.observe(container, { childList: true, subtree: true });
      container._autoNextMO = mo;
    }

    const tab = getSidebarRoot();
    if (tab && !tab._autoNextMO) {
      const mo = new MutationObserver(() => {
        const nv = getVideo();
        if (nv) {
          _autoNextBound = false;
          bindAutoNext(true);
        }
      });
      mo.observe(tab, { childList: true, subtree: true });
      tab._autoNextMO = mo;
    }

    log('Auto-next bound.');
  }

  // ===== 启动逻辑 =====
  function kickoff() {
    // 若没有“当前项”，尝试先点到第一条未完成
    const cur = getCurrentItem();
    if (!cur) {
      const next = findNextUnfinished();
      if (next) {
        log('No current item, select first unfinished →', next.textContent.trim());
        next.click();
        setTimeout(() => bindAutoNext(true), REBIND_DELAY_MS);
        return;
      } else {
        warn('目录为空或全部完成。');
      }
    }
    // 正常绑定监听
    bindAutoNext();
  }

  function init() {
    const start = () => setTimeout(kickoff, START_DELAY_MS);

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      start();
    } else {
      document.addEventListener('DOMContentLoaded', start, { once: true });
    }

    // 处理 SPA：URL 变化时重绑
    let lastHref = location.href;
    setInterval(() => {
      if (location.href !== lastHref) {
        lastHref = location.href;
        _autoNextBound = false;
        setTimeout(() => bindAutoNext(true), REBIND_DELAY_MS);
      }
    }, 1000);
  }

  init();
})();

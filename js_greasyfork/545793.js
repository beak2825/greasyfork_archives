// ==UserScript==
// @name         华医网助手（自动下一课增强版）v3.2.0
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  自动播放、跳过弹窗、精准跳转下一课（加强鲁棒性，适配多种DOM与文案）
// @author       Yik Liu (Enhanced)
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/course_ware/course_list.aspx?*
// @match        https://cme28.91huayi.com/pages/exam_result.aspx?cwid=*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545793/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%8A%A9%E6%89%8B%EF%BC%88%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%AF%BE%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89v320.user.js
// @updateURL https://update.greasyfork.org/scripts/545793/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%8A%A9%E6%89%8B%EF%BC%88%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%AF%BE%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89v320.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let examErrorCount = 0;

  const CONTACT_IMG_SIZE = 180;

  // ===== 限刷计数：每刷三节就停止 =====
  const LIMIT_KEY = 'HY_CLASS_LIMIT_COUNT';
  const LIMIT_MAX = 3;
  const Limit = {
    get() { try { return parseInt(sessionStorage.getItem(LIMIT_KEY) || '0', 10); } catch { return 0; } },
    set(v) { try { sessionStorage.setItem(LIMIT_KEY, String(v)); } catch {} },
    inc() { const n = this.get() + 1; this.set(n); updateLimitDisplay(); return n; },
    reached() { return this.get() >= LIMIT_MAX; },
    reset() { this.set(0); updateLimitDisplay(); }
  };

  // 如果是用户刷新（reload），则重置计数；正常页面跳转（navigate）不重置
  try {
    const nav = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || null;
    if (nav && nav.type === 'reload') {
      Limit.reset();
    }
  } catch {}


  function updateLimitDisplay() {
    const el = document.getElementById('h-limit');
    if (el) el.innerText = `限刷: ${Limit.get()}/${LIMIT_MAX}`;
  }

  function createStatusPanel() {
    if (document.getElementById('huayi-status')) return;
    const panel = document.createElement('div');
    panel.id = 'huayi-status';
    panel.style.cssText = `
      position: fixed; right: 10px; bottom: 10px; z-index: 999999;
      background: rgba(0,0,0,0.75); color: #fff; padding: 10px 12px;
      border-radius: 10px; font-size: 14px; max-width: 300px; line-height: 1.4;
      backdrop-filter: blur(2px);
    `;
    panel.innerHTML = `
      <div><b>华医网助手状态 (v3.2.0)</b></div>
      <div id="h-status">状态: 启动中</div>
      <div id="h-action">操作: -</div>
      <div id="h-exam">考试按钮: -</div>
      <div id="h-error">异常检测: 0 次</div>
      <div id="h-title">当前视频: -</div>
      <div id="h-limit">限刷: 0/${LIMIT_MAX}</div>
      <div style="margin-top:6px; display:flex; gap:6px;">
        <button id="h-next" style="padding:4px 8px;border-radius:6px;border:0;background:#00a0f6;color:#fff;cursor:pointer;">强制下一课</button>
        <button id="h-hide" style="padding:4px 8px;border-radius:6px;border:0;background:#666;color:#fff;cursor:pointer;">隐藏面板</button>
        <button id="h-reset" style="padding:4px 8px;border-radius:6px;border:0;background:#999;color:#fff;cursor:pointer;">清零</button>
      </div>
    `;
    document.body.appendChild(panel);
    document.getElementById('h-next').onclick = () => autoJumpToLearningVideo();
    document.getElementById('h-hide').onclick = () => panel.remove();
    document.getElementById('h-reset').onclick = () => Limit.reset();
    updateLimitDisplay();
  }

  function updateStatusPanel(status, action, exam, errors, title) {
    const set = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.innerText = text;
    };
    set('h-status', `状态: ${status}`);
    set('h-action', `操作: ${action}`);
    set('h-exam', `考试按钮: ${exam}`);
    set('h-error', `异常检测: ${errors} 次`);
    set('h-title', `当前视频: ${title}`);
  }

  function autoSkipPopup() {
    const tryClose = () => {
      try {
        document.querySelector('.pv-ask-skip')?.click();
        document.querySelector('.signBtn')?.click();
        document.querySelector("button[onclick='closeProcessbarTip()']")?.click();
        document.querySelector('button.btn_sign')?.click();
        if (document.querySelector('#floatTips')?.style.display !== 'none') {
          window.closeFloatTips?.();
        }
        document.querySelector('.el-message-box__btns .el-button--primary')?.click();
        document.querySelector('.el-dialog__footer .el-button--primary')?.click();
      } catch (e) {}
    };
    tryClose();
    setInterval(tryClose, 2000);
  }

  function autoPlayVideo() {
    const video = document.querySelector('video');
    if (!video) return;

    video.muted = true;
    video.volume = 0;

    const ensurePlay = () => {
      if (video.paused) video.play().catch(() => {});
    };

    ensurePlay();
    const playInterval = setInterval(ensurePlay, 1000);

    video.addEventListener('play', () => {
      updateStatusPanel('监控中', '播放中', '检测中', examErrorCount, document.title);
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) ensurePlay();
    });

    attachEndedFallback();
  }

  function attachEndedFallback() {
    const v = document.querySelector('video');
    if (!v) return;
    v.addEventListener(
      'ended',
      () => {
        setTimeout(autoJumpToLearningVideo, 1000);
      },
      { once: true }
    );
  }

  function toAbsoluteUrl(maybeUrl) {
    if (!maybeUrl) return '';
    if (/^https?:\/\//i.test(maybeUrl)) return maybeUrl;
    if (/^javascript:/i.test(maybeUrl)) return '';
    const a = document.createElement('a');
    a.href = maybeUrl;
    return a.href;
  }

  function extractUrlFromOnclick(onclickStr) {
    if (!onclickStr) return '';
    let m =
      onclickStr.match(/(['"])(https?:\/\/[^'"]*course_ware[^'"]*\.aspx\?[^'"]*)\1/i) ||
      onclickStr.match(/(['"])(https?:\/\/[^'"]*course_ware[^'"]*\.aspx)\1/i);
    if (m) return m[2] || m[1];

    m =
      onclickStr.match(/(course_ware[^'"]*\.aspx\?[^'"]*)/i) ||
      onclickStr.match(/(course_ware[^'"]*\.aspx)/i);
    if (m) return m[1];

    return '';
  }

  function autoJumpToLearningVideo() {
    if (Limit.reached()) {
      updateStatusPanel('已暂停', '已达到限刷上限', '-', examErrorCount, document.title);
      return;
    }
    updateStatusPanel('跳转中', '查找下一个课程...', '-', examErrorCount, document.title);

    const docs = [document];
    try {
      if (window.top && window.top !== window && window.top.document) {
        docs.push(window.top.document);
      }
    } catch (e) {}

    const itemSelectors = [
      'li.lis-inside-content',
      'li.lis_content',
      '.lis-inside-content li',
      '.lis-content li',
      'li[class*="lis"]'
    ];

    const nextableTexts = ['学习中', '继续学习', '立即学习'];
    const doneOrExamTexts = ['待考试', '已完成', '考试', '合格'];

    const currentCwid = new URLSearchParams(window.location.search).get('cwid');

    let items = [];
    for (const d of docs) {
      for (const sel of itemSelectors) {
        const found = Array.from(d.querySelectorAll(sel));
        if (found.length) {
          items = found;
          break;
        }
      }
      if (items.length) break;
    }

    if (!items.length) {
      updateStatusPanel('错误', '未找到课程列表', '-', examErrorCount, document.title);
      return;
    }

    const isNextable = (el) => {
      const btn = el.querySelector('button, a, .state_btn, .state_lis_btn, [role="button"], input[type="button"], input[type="submit"]');
      const text = (btn?.innerText || btn?.value || el.innerText || '').replace(/\s/g, '');
      if (nextableTexts.some((t) => text.includes(t))) return true;

      if (btn) {
        const cs = getComputedStyle(btn);
        const bg = cs.backgroundColor || cs.background;
        if (/rgb\s*\(\s*0\s*,\s*160\s*,\s*246\s*\)/i.test(bg)) return true;
        if (/#00a0f6/i.test(cs.background || '')) return true;
      }
      return false;
    };

    let currentIndex = -1;
    if (currentCwid) {
      currentIndex = items.findIndex((item) => {
        const cand = [
          item.querySelector('h2[onclick]'),
          item.querySelector('[onclick*="cwid="]'),
          item.querySelector('a[href*="cwid="]')
        ].filter(Boolean);
        return cand.some((el) => {
          const s = el.getAttribute('onclick') || el.getAttribute('href') || '';
          return s.includes(`cwid=${currentCwid}`);
        });
      });
    }

    const start = currentIndex !== -1 ? currentIndex + 1 : 0;

    let nextTarget = null;
    for (let i = start; i < items.length; i++) {
      const rawText = (items[i].innerText || '').replace(/\s/g, '');
      if (doneOrExamTexts.some((t) => rawText.includes(t))) continue;
      if (isNextable(items[i])) {
        nextTarget = items[i];
        break;
      }
    }

    if (!nextTarget) {
      for (let i = start; i < items.length; i++) {
        const rawText = (items[i].innerText || '').replace(/\s/g, '');
        if (/未学习|去学习|开始学习/.test(rawText)) {
          nextTarget = items[i];
          break;
        }
      }
    }

    if (!nextTarget) {
      updateStatusPanel('待命', '无更多课程可学习', '-', examErrorCount, document.title);
      return;
    }

    const urlCands = [
      nextTarget.querySelector('a[href*="course_ware_polyv.aspx"]'),
      nextTarget.querySelector('[onclick*="course_ware_polyv.aspx"]'),
      nextTarget.querySelector('a[href*="course_ware.aspx"]'),
      nextTarget.querySelector('[onclick*="course_ware.aspx"]')
    ].filter(Boolean);

    let targetUrl = '';
    for (const el of urlCands) {
      const href = el.getAttribute('href') || '';
      const onclick = el.getAttribute('onclick') || '';
      if (/course_ware.*\.aspx/i.test(href)) {
        targetUrl = href;
      } else {
        const u = extractUrlFromOnclick(onclick);
        if (u) targetUrl = u;
      }
      if (targetUrl) break;
    }

    if (targetUrl) {
      targetUrl = toAbsoluteUrl(targetUrl);
      if (targetUrl) {
        const count = Limit.inc();
        updateStatusPanel('跳转中', `第 ${count}/${LIMIT_MAX} 节，准备跳转`, '-', examErrorCount, document.title);
        location.href = targetUrl;
        return;
      }
    }

    const clickable = nextTarget.querySelector('h2[onclick], a, button, [role="button"], input[type="button"], input[type="submit"]');
    if (clickable) {
      const count = Limit.inc();
      updateStatusPanel('跳转中', `第 ${count}/${LIMIT_MAX} 节，未抓到URL，尝试点击元素`, '-', examErrorCount, document.title);
      try {
        clickable.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      } catch (e) {
        clickable.click?.();
      }
    } else {
      updateStatusPanel('错误', '找到课程但无法点击或提取URL', '-', examErrorCount, document.title);
    }
  }

  function observeStatusChange() {
    const targetNode =
      document.querySelector('.lis-content') ||
      document.querySelector('.lis-inside-content') ||
      document.body;

    if (!targetNode) return;

    const observer = new MutationObserver((mutationsList) => {
      for (const m of mutationsList) {
        if (m.type === 'characterData') {
          const btn = m.target?.parentElement;
          if (btn && /button|a/i.test(btn.tagName)) {
            const t = (btn.innerText || '').replace(/\s/g, '');
            if (t.includes('待考试') || t.includes('已完成')) {
              updateStatusPanel('监控中', '课程完成，准备跳转', '检测中', examErrorCount, document.title);
              setTimeout(autoJumpToLearningVideo, 1500);
              observer.disconnect();
              break;
            }
          }
        }
        if (m.type === 'attributes' && m.attributeName === 'style') {
          const el = m.target;
          if (el && /button|a/i.test(el.tagName)) {
            const cs = getComputedStyle(el);
            const bg = cs.backgroundColor || '';
            if (/rgb\s*\(\s*25\d\s*,\s*10\d\s*,\s*10\d\s*\)/.test(bg) || /rgb\s*\(\s*253\s*,\s*103\s*,\s*103\s*\)/.test(bg)) {
              updateStatusPanel('监控中', '状态更新，准备跳转', '检测中', examErrorCount, document.title);
              setTimeout(autoJumpToLearningVideo, 1500);
              observer.disconnect();
              break;
            }
          }
        }
      }
    });

    observer.observe(targetNode, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
  }

  function clickFirstImmediateLearn() {
    const btns = [
      ...document.querySelectorAll('input.state_lis_btn, input[type="button"], input[type="submit"]'),
      ...document.querySelectorAll('button, a[role="button"], a.el-button')
    ];

    for (const btn of btns) {
      const val = (btn.value || btn.innerText || '').trim().replace(/\s/g, '');
      if (val.includes('立即学习') || val.includes('继续学习') || val.includes('去学习')) {
        btn.click();
        return;
      }
    }
  }

  function createContactPanel() {
    if (document.getElementById('hy-contact-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'hy-contact-panel';
    panel.style.cssText = `
      position: fixed; left: 10px; bottom: 10px; z-index: 999998;
      background: rgba(255,255,255,0.92); color: #000;
      padding: 10px; border-radius: 10px; font-size: 14px;
      box-shadow: 0 0 8px rgba(0,0,0,0.2); text-align: center;
    `;
    panel.innerHTML = `
      <div style="font-weight: bold; color: red; font-size: 16px;">如果没有时间可加v：Yyyyylaj</div>
      <div style="display:flex; gap:8px; align-items:center; justify-content:center; margin-top:5px;">
        <img src="https://i.ibb.co/d0fRsHkY/20250814140655-55-266.jpg" alt="打款码1" width="180" style="border-radius:10px;" />
        <img src="https://i.ibb.co/FbmyTqhC/20250814140916-56-266.jpg" alt="打款码2" width="180" style="border-radius:10px;" />
      </div>
      <div style="margin-top:5px; font-size: 12px;">创作不易，感谢支持 ☕</div>
    `;
    document.body.appendChild(panel);
  }

  function init() {
    const url = location.href;

    createStatusPanel();
    createContactPanel();

    if (/course_ware\/course_ware_polyv\.aspx/i.test(url)) {
      setTimeout(() => {
        const originalOnPlayOver = window.s2j_onPlayOver;
        window.s2j_onPlayOver = function () {
          try {
            if (typeof originalOnPlayOver === 'function') {
              originalOnPlayOver.apply(this, arguments);
            }
          } catch (e) {}
          setTimeout(() => autoJumpToLearningVideo(), 1000);
        };

        autoSkipPopup();

        if (document.querySelector('video')) {
          autoPlayVideo();
          updateStatusPanel('运行中', '初始化完成', '检测中', examErrorCount, document.title);
        } else {
          updateStatusPanel('运行中', '未检测到视频，等待中', '检测中', examErrorCount, document.title);
        }

        observeStatusChange();
      }, 1500);
    }

    if (/course_ware\/course_list\.aspx/i.test(url)) {
      setTimeout(autoJumpToLearningVideo, 2000);
    }

    if (/\/exam_result\.aspx/i.test(url)) {
      setTimeout(clickFirstImmediateLearn, 1500);
    }
  }

  init();
})();
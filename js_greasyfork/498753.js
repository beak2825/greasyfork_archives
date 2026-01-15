// ==UserScript==
// @name            SZTU自动评教
// @namespace       https://github.com/xiaowhang/sztu-automated-course-evaluation
// @version         1.0.0
// @description     深圳技术大学自动评教——2025-2026-1
// @author          xiaowhang
// @match           https://ddpj.sztu.edu.cn/index.html*
// @match           https://ddpj-sztu-edu-cn-s.webvpn.sztu.edu.cn:8118/index.html*
// @grant           GM_openInTab
// @run-at          document-end
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/498753/SZTU%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/498753/SZTU%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==


(function () {
  'use strict';

  const STORAGE_KEY = 'auto-review-config';
  const defaultConfig = { level: 0, comment: '', reviewHref: 'answer', autoSubmit: false, autoNext: true };
  let config = loadConfig();

  function loadConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...defaultConfig, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('[全自动评教] 读取配置失败', e);
    }
    return { ...defaultConfig };
  }

  function saveConfig() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }

  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function (callback, delay) {
    if (delay >= 1000 && delay <= 5000) return originalSetTimeout(callback, 0);
    return originalSetTimeout(callback, delay);
  };

  // 模拟原生输入
  function fillInput(element, value) {
    const proto = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;

    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (setter) {
      setter.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // 获取元素文本（兼容空格/换行）
  function getText(el) {
    return el?.innerText?.trim() || '';
  }

  // UI 面板
  function createPanel() {
    const btn = document.createElement('div');
    btn.textContent = '评教配置';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '2rem',
      bottom: '1rem',
      background: '#1677ff',
      color: '#fff',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      zIndex: 99999,
      fontSize: '0.75rem',
      boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.2)',
      userSelect: 'none',
    });

    const panel = document.createElement('div');
    panel.innerHTML = `
      <div style="font-weight:600;margin-bottom:0.5rem;">评教脚本配置</div>
      <label style="display:block;margin-bottom:0.375rem;">单选等级：
        <select data-field="level" style="width:100%;">
          <option value="0" ${config.level === 0 ? 'selected' : ''}>同意</option>
          <option value="1" ${config.level === 1 ? 'selected' : ''}>大体同意</option>
          <option value="2" ${config.level === 2 ? 'selected' : ''}>基本同意</option>
          <option value="3" ${config.level === 3 ? 'selected' : ''}>不大同意</option>
          <option value="4" ${config.level === 4 ? 'selected' : ''}>不同意</option>
        </select>
      </label>
      <label style="display:block;margin-bottom:0.375rem;">建议内容：
        <textarea style="width:100%;height:3.75rem;" data-field="comment">${config.comment}</textarea>
      </label>
      <label style="display:block;margin-bottom:0.375rem;">
        <input type="checkbox" data-field="autoSubmit" ${config.autoSubmit ? 'checked' : ''}> 自动提交
      </label>
      <label style="display:block;margin-bottom:0.625rem;">
        <input type="checkbox" data-field="autoNext" ${config.autoNext ? 'checked' : ''}> 自动跳转下一项
      </label>
      <button data-action="save" style="background:#1677ff;color:#fff;border:none;padding:0.375rem 0.625rem;border-radius:0.25rem;cursor:pointer;">保存配置</button>
      <button data-action="close" style="margin-left:0.5rem;border:0.0625rem solid #ccc;padding:0.375rem 0.625rem;border-radius:0.25rem;cursor:pointer;">关闭</button>
    `;
    Object.assign(panel.style, {
      position: 'fixed',
      right: '0.75rem',
      bottom: '3.5rem',
      width: '16.25rem',
      background: '#fff',
      border: '0.0625rem solid #ddd',
      borderRadius: '0.5rem',
      padding: '0.625rem',
      boxShadow: '0 0.25rem 1rem rgba(0,0,0,0.15)',
      zIndex: 99999,
      fontSize: '0.75rem',
      lineHeight: '1.4',
      display: 'none',
    });

    btn.onclick = () => (panel.style.display = panel.style.display === 'none' ? 'block' : 'none');
    panel.addEventListener('click', e => {
      const { action } = e.target.dataset || {};
      if (action === 'save') {
        const inputs = panel.querySelectorAll('[data-field]');
        inputs.forEach(el => {
          const field = el.dataset.field;
          if (field === 'autoSubmit' || field === 'autoNext') {
            config[field] = el.checked;
          } else if (field === 'level') {
            config[field] = Math.max(0, Number(el.value) || 0);
          } else {
            config[field] = el.value || '';
          }
        });
        saveConfig();
        alert('配置已保存，页面将刷新以生效');
        location.reload();
      }
      if (action === 'close') panel.style.display = 'none';
    });

    document.body.appendChild(btn);
    document.body.appendChild(panel);
  }

  // 核心执行
  function doWork() {
    const isReviewPage = location.href.includes(config.reviewHref);

    // --- 1. 评价页自动填写 ---
    if (isReviewPage) {
      // A. 单选（Radio）
      document.querySelectorAll('.ant-radio-group').forEach(group => {
        const checked = group.querySelector('.ant-radio-wrapper-checked, .ant-radio-checked');
        if (checked) return;

        const options = group.querySelectorAll('.ant-radio-wrapper');
        const target = options[config.level];
        if (target) target.click();
      });

      // B. 多选（Checkbox）
      document.querySelectorAll('.ant-checkbox-group .ant-checkbox').forEach(checkbox => {
        if (!checkbox.classList.contains('ant-checkbox-checked')) {
          const input = checkbox.querySelector('.ant-checkbox-input');
          if (input) input.click();
        }
      });

      // C. 文本框
      document.querySelectorAll('.ant-input').forEach(input => {
        if (input.value.trim() === '') {
          fillInput(input, config.comment);
        }
      });

      // D. 提交按钮
      if (config.autoSubmit) {
        const submitBtn = Array.from(document.querySelectorAll('.ant-btn-primary')).find(btn => {
          const txt = getText(btn);
          return txt.includes('提 交') || txt.includes('确 定') || txt.includes('确定');
        });

        if (submitBtn && !submitBtn.disabled) {
          submitBtn.click();
        }
      }
    }

    // --- 2. 自动跳转（所有页面） ---
    if (config.autoNext) {
      const nextBtn = Array.from(document.querySelectorAll('.ant-btn, .ant-btn-primary')).find(btn => {
        const txt = getText(btn);
        return txt.includes('下一位教师') || txt.includes('下一门课程') || txt.includes('下一门') || txt.includes('返回列表');
      });

      if (nextBtn) {
        nextBtn.click();
      }
    }
  }

  // 观察器与初始化
  let throttle = null;

  const observer = new MutationObserver(() => {
    if (throttle) return;
    throttle = setTimeout(() => {
      doWork();
      throttle = null;
    }, 500);
  });

  function init() {
    if (document.body) {
      createPanel();
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      doWork();
    } else {
      setTimeout(init, 100);
    }
  }

  init();
})();

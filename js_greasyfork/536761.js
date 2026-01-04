// ==UserScript==
// @name         划词翻译-增强版
// @namespace    https://wobshare.us.kg
// @author       wob
// @version      2.1
// @description  ✅请先到【扩展管理】中打开【开发人员模式】才能正常使用！✨划词后朗读并在鼠标停留区域时显示翻译卡片，鼠标离开划词范围立即关闭悬浮翻译并清除划词缓存，单词、句子都能翻译,仅支持英文朗读。API接口为：iciba 和 Google 接口！不推荐在国内使用，API响应稍慢!
// @match        *://*/*
// @exclude      *://www.google.com/search*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      dict.iciba.com
// @connect      translate.googleapis.com
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/536761/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91-%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/536761/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91-%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ✅ 提前预加载语音，解决后续朗读卡顿问题
  let voiceReady = false;
  let cachedVoices = [];
  function preloadVoices() {
    cachedVoices = speechSynthesis.getVoices();
    if (cachedVoices.length) voiceReady = true;
  }
  speechSynthesis.onvoiceschanged = () => {
    cachedVoices = speechSynthesis.getVoices();
    if (cachedVoices.length) voiceReady = true;
  };
  preloadVoices();

  // ✅ 样式注入
  GM_addStyle(`
    .translate-tooltip {
      position: absolute;
      background: linear-gradient(135deg, #4A90E2, #007AFF);
      color: #fff;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 15px;
      max-width: 360px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      white-space: pre-line;
      font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial;
      pointer-events: auto;
    }
    #translate-tooltip-0 { z-index: 9999; }
    #translate-tooltip-1 { z-index: 9998; }
  `);

  let selectionBox = null;

  document.addEventListener('mouseup', () => {
    const text = window.getSelection().toString().trim();
    if (!text || text.length > 200) return;

    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();
    selectionBox = rect;

    speakViaBrowser(text);
    fetchIciba(text, rect, () => fetchGoogleWithTimeout(text, rect));

    document.addEventListener('mousemove', strictMouseLeaveCheck);
  });

  // ✅ 浏览器语音朗读
  function speakViaBrowser(text) {
    if (!voiceReady) return;
    const voice = cachedVoices.find(v => v.lang === 'en-US') || cachedVoices[0];
    if (!voice) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice;
    utter.lang = voice?.lang || 'en-US';
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  }

  // ✅ iciba 翻译
  function fetchIciba(word, rect, callback) {
    if (!/^[a-zA-Z\s]+$/.test(word)) {
      callback?.();
      return;
    }
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://dict.iciba.com/dictionary/word/suggestion?word=${encodeURIComponent(word)}&nums=1`,
      onload: res => {
        try {
          const data = JSON.parse(res.responseText);
          const defs = data.message?.[0]?.paraphrase || '无翻译结果';
          showTooltip('📘 iciba词典：\n' + defs, rect, 0, callback);
        } catch {
          showTooltip('📘 iciba解析失败', rect, 0, callback);
        }
      },
      onerror: () => showTooltip('📘 iciba请求失败', rect, 0, callback)
    });
  }

  // ✅ Google 翻译（带超时）
  function fetchGoogleWithTimeout(word, rect) {
    let responded = false;

    const timeout = setTimeout(() => {
      if (!responded) {
        responded = true;
        showTooltip('🌍 Google请求超时', rect, 1);
      }
    }, 2000);

    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(word)}`,
      onload: res => {
        if (responded) return;
        responded = true;
        clearTimeout(timeout);
        try {
          const result = JSON.parse(res.responseText);
          const translated = result[0][0][0];
          showTooltip('🌍 Google翻译：\n' + translated, rect, 1);
        } catch {
          showTooltip('🌍 Google解析失败', rect, 1);
        }
      },
      onerror: () => {
        if (!responded) {
          responded = true;
          clearTimeout(timeout);
          showTooltip('🌍 Google请求失败', rect, 1);
        }
      }
    });
  }

  // ✅ 显示卡片，支持上下动态定位
  function showTooltip(text, rect, index, callback = null) {
    const id = `translate-tooltip-${index}`;
    removeTooltip(id);

    const tip = document.createElement('div');
    tip.className = 'translate-tooltip';
    tip.id = id;
    tip.innerText = text;
    document.body.appendChild(tip);

    // 初始定位
    tip.style.left = `${rect.left + window.scrollX}px`;
    tip.style.top = `${rect.bottom + window.scrollY + 10}px`;

    // 动态定位第二个卡片
    setTimeout(() => {
      if (index === 0) {
        tip.dataset.height = tip.offsetHeight;
        callback?.();
      }
      if (index === 1) {
        const prev = document.getElementById('translate-tooltip-0');
        const prevHeight = prev ? prev.offsetHeight : 0;
        const offset = rect.bottom + window.scrollY + 10 + prevHeight + 10;
        tip.style.top = `${offset}px`;
      }
    }, 10);
  }

  // ✅ 鼠标一旦离开划词区域 → 移除卡片并清除划词缓存
  function strictMouseLeaveCheck(e) {
    if (!selectionBox) return;
    const { left, right, top, bottom } = selectionBox;
    const buffer = 5;
    const inArea =
      e.pageX >= left + window.scrollX - buffer &&
      e.pageX <= right + window.scrollX + buffer &&
      e.pageY >= top + window.scrollY - buffer &&
      e.pageY <= bottom + window.scrollY + buffer;

    if (!inArea) {
      removeTooltip('translate-tooltip-0');
      removeTooltip('translate-tooltip-1');
      document.removeEventListener('mousemove', strictMouseLeaveCheck);

      // ✅ 清除划词缓存
      selectionBox = null;
      if (window.getSelection) {
        window.getSelection().removeAllRanges(); // 取消选中高亮
      }
    }
  }

  function removeTooltip(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

})();

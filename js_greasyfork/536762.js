// ==UserScript==
// @name         划词朗读翻译（多国语言版 + 流畅朗读）
// @namespace    https://wobshare.us.kg
// @author       wob
// @version      3.1
// @description  ✅请先到【扩展管理】中打开【开发人员模式】才能正常使用！✨[只支持在国外使用，因为使用的是Google的API，国内无法响应] | 划词后朗读并在鼠标停留区域时显示翻译卡片（翻译为中文），鼠标离开划词范围立即关闭悬浮翻译并清除划词缓存，不想使用时按 "Ctrl + Space"快捷键切换关闭/开启脚本，单词、句子都能翻译。划词翻译的句子不要太长，太长的话可能无法翻译！
// @match        *://*/*
// @exclude      *://www.google.com/search*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      dict.iciba.com
// @connect      translate.googleapis.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536762/%E5%88%92%E8%AF%8D%E6%9C%97%E8%AF%BB%E7%BF%BB%E8%AF%91%EF%BC%88%E5%A4%9A%E5%9B%BD%E8%AF%AD%E8%A8%80%E7%89%88%20%2B%20%E6%B5%81%E7%95%85%E6%9C%97%E8%AF%BB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536762/%E5%88%92%E8%AF%8D%E6%9C%97%E8%AF%BB%E7%BF%BB%E8%AF%91%EF%BC%88%E5%A4%9A%E5%9B%BD%E8%AF%AD%E8%A8%80%E7%89%88%20%2B%20%E6%B5%81%E7%95%85%E6%9C%97%E8%AF%BB%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- 脚本状态控制 ---
  let scriptEnabled = true; // 脚本的启用状态，默认为开启

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

    /* 新增：提示消息样式 */
    .userscript-toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: rgba(0, 0, 0, 0.75);
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        pointer-events: none; /* 确保不影响页面交互 */
    }
    .userscript-toast.show {
        opacity: 1;
    }
  `);

  let selectionBox = null;

  // --- 主鼠标抬起事件处理函数 ---
  // 将匿名函数改为命名函数，以便后续可以添加/移除监听
  function handleMouseUp() {
    if (!scriptEnabled) return; // 如果脚本被禁用，则直接返回

    const text = window.getSelection().toString().trim();
    if (!text || text.length > 200) return; // 检查文本有效性和长度

    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();
    selectionBox = rect; // 记录选区位置

    speakViaBrowser(text); // 朗读划词内容
    // 翻译划词内容（中文），iciba优先，如果iciba不处理或失败则调用Google
    fetchIciba(text, rect, () => fetchGoogleWithTimeout(text, rect));

    document.addEventListener('mousemove', strictMouseLeaveCheck); // 添加鼠标移动监听器以检测鼠标移出
  }

  // 初始时添加 mouseup 监听器
  document.addEventListener('mouseup', handleMouseUp);

  // ✅ 浏览器语音朗读
  function speakViaBrowser(text) {
    if (!scriptEnabled) return; // 如果脚本被禁用，不执行朗读
    if (!voiceReady) return; // 检查语音是否准备好
    // 尝试查找语音，如果没有则使用以'ko'开头的语音，最后使用第一种可用语音
    const voice = cachedVoices.find(v => v.lang === 'ko-KR') || cachedVoices.find(v => v.lang.startsWith('ko')) || cachedVoices[0];
    if (!voice) return; // 如果没有可用语音，则返回
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice;
    utter.lang = voice?.lang || 'ko-KR'; // 设置朗读语言
    speechSynthesis.cancel(); // 取消当前所有朗读
    speechSynthesis.speak(utter); // 开始朗读
  }

  // ✅ iciba 翻译 (仅限英文单词)
  function fetchIciba(word, rect, callback) {
    if (!scriptEnabled) { // 如果脚本被禁用，不执行翻译请求
      callback?.(); // 仍然调用回调，以便Google翻译可以继续
      return;
    }
    // iciba 仅适用于英文单词，如果不是英文单词，直接跳过 iciba 调用 Google
    if (!/^[a-zA-Z\s]+$/.test(word)) {
      callback?.(); // 如果不是纯英文，直接调用下一个翻译服务
      return;
    }
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://dict.iciba.com/dictionary/word/suggestion?word=${encodeURIComponent(word)}&nums=1`,
      onload: res => {
        if (!scriptEnabled) return; // 回调时再次检查脚本状态
        try {
          const data = JSON.parse(res.responseText);
          const defs = data.message?.[0]?.paraphrase || '无翻译结果';
          showTooltip('📘 iciba词典：\n' + defs, rect, 0, callback); // 显示 iciba 结果并调用下一个翻译服务
        } catch {
          showTooltip('📘 iciba解析失败', rect, 0, callback);
          callback?.(); // iciba 解析失败也尝试调用下一个翻译服务
        }
      },
      onerror: () => {
        if (!scriptEnabled) return; // 回调时再次检查脚本状态
        showTooltip('📘 iciba请求失败', rect, 0, callback);
        callback?.(); // iciba 请求失败也尝试调用下一个翻译服务
      }
    });
  }

  // ✅ Google 翻译 (多语言，支持句子)
  function fetchGoogleWithTimeout(word, rect) {
    if (!scriptEnabled) return; // 如果脚本被禁用，不执行翻译请求
    let responded = false;

    const timeout = setTimeout(() => {
      if (!responded && scriptEnabled) { // 再次检查 scriptEnabled
        responded = true;
        showTooltip('🌍 Google请求超时', rect, 1);
      }
    }, 5000); // 5秒超时

    GM_xmlhttpRequest({
      method: 'GET',
      // sl=auto (自动检测源语言), tl=zh-CN (翻译成简体中文)
      url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(word)}`,
      onload: res => {
        if (responded || !scriptEnabled) return; // 回调时再次检查状态
        responded = true;
        clearTimeout(timeout); // 清除超时计时器
        try {
          const result = JSON.parse(res.responseText);
          const translated = result[0][0][0]; // 提取翻译结果
          showTooltip('🌍 Google翻译：\n' + translated, rect, 1); // 显示 Google 翻译结果
        } catch {
          showTooltip('🌍 Google解析失败', rect, 1);
        }
      },
      onerror: () => {
        if (responded || !scriptEnabled) return; // 回调时再次检查状态
        responded = true;
        clearTimeout(timeout); // 清除超时计时器
        showTooltip('🌍 Google请求失败', rect, 1);
      }
    });
  }

  // ✅ 显示卡片，支持上下动态定位
  function showTooltip(text, rect, index, callback = null) {
    if (!scriptEnabled) return; // 如果脚本被禁用，不显示卡片

    const id = `translate-tooltip-${index}`;
    removeTooltip(id); // 先移除旧的卡片（如果存在）

    const tip = document.createElement('div');
    tip.className = 'translate-tooltip';
    tip.id = id;
    tip.innerText = text;
    document.body.appendChild(tip);

    // 初始定位（基于划词区域的底部）
    tip.style.left = `${rect.left + window.scrollX}px`;
    tip.style.top = `${rect.bottom + window.scrollY + 10}px`;

    // 动态定位第二个卡片 (确保它在第一个卡片下方)
    setTimeout(() => {
      if (index === 0) {
        // 如果是第一个卡片，可能需要记录其高度以便第二个卡片定位
        // tip.dataset.height = tip.offsetHeight; // 理论上可以用来传递高度，但直接获取更可靠
        callback?.(); // 调用回调，通常是触发第二个翻译请求
      }
      if (index === 1) {
        // 获取第一个卡片的高度来定位第二个卡片
        const prev = document.getElementById('translate-tooltip-0');
        const prevHeight = prev ? prev.offsetHeight : 0;
        // 第二个卡片的位置 = 划词底部 + 10px间隔 + 第一个卡片高度 + 10px间隔
        const offset = rect.bottom + window.scrollY + 10 + prevHeight + 10;
        tip.style.top = `${offset}px`;
      }
    }, 10); // 短暂延迟确保DOM渲染完成，offsetHeight可正确获取
  }

  // ✅ 鼠标一旦离开划词区域 → 移除卡片并清除划词缓存
  function strictMouseLeaveCheck(e) {
    if (!selectionBox) return; // 如果没有选区信息，则返回

    const { left, right, top, bottom } = selectionBox;
    const buffer = 5; // 增加一个小的缓冲区域，使鼠标离开选区边缘时不会立即消失
    // 判断鼠标当前位置是否在选区范围内（包括缓冲区域）
    const inArea =
      e.pageX >= left + window.scrollX - buffer &&
      e.pageX <= right + window.scrollX + buffer &&
      e.pageY >= top + window.scrollY - buffer &&
      e.pageY <= bottom + window.scrollY + buffer;

    // 如果鼠标移出选中的区域
    if (!inArea) {
      removeTooltip('translate-tooltip-0'); // 移除第一个翻译卡片
      removeTooltip('translate-tooltip-1'); // 移除第二个翻译卡片
      document.removeEventListener('mousemove', strictMouseLeaveCheck); // 移除鼠标移动监听器

      // ✅ 清除划词缓存
      selectionBox = null; // 清空选区位置信息
      if (window.getSelection) {
        window.getSelection().removeAllRanges(); // 取消选中高亮（即清除选中的文本）
      }
    }
  }

  // 移除指定ID的翻译工具提示框
  function removeTooltip(id) {
    const el = document.getElementById(id);
    if (el) el.remove(); // 移除DOM元素
  }

  // --- 提示消息函数 ---
  function showToast(message) {
    let toast = document.querySelector('.userscript-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'userscript-toast';
      document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add('show'); // 显示提示
    setTimeout(() => {
      toast.classList.remove('show'); // 2秒后隐藏提示
    }, 2000);
  }

  // --- 脚本启用/禁用切换逻辑 ---
  function toggleScriptEnabled() {
    scriptEnabled = !scriptEnabled; // 切换状态

    if (scriptEnabled) {
      // 脚本开启时
      document.addEventListener('mouseup', handleMouseUp); // 重新添加 mouseup 监听
      showToast('划词朗读翻译 Pro 已开启');
    } else {
      // 脚本关闭时
      document.removeEventListener('mouseup', handleMouseUp); // 移除 mouseup 监听
      removeTooltip('translate-tooltip-0'); // 移除当前显示的翻译卡片
      removeTooltip('translate-tooltip-1');
      speechSynthesis.cancel(); // 停止所有正在进行的朗读
      document.removeEventListener('mousemove', strictMouseLeaveCheck); // 移除鼠标移出检测
      selectionBox = null; // 清空选区信息
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
      showToast('划词朗读翻译 Pro 已关闭');
    }
  }

  // --- 键盘事件监听器，用于检测 Ctrl + Space ---
  document.addEventListener('keydown', (e) => {
    // 检查是否按下了 Ctrl 键和空格键 (e.code === 'Space' 兼容性更好)
    if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault(); // 阻止浏览器默认的 Ctrl+Space 行为 (例如某些系统的输入法切换)
      toggleScriptEnabled(); // 切换脚本状态
    }
  });

  // 脚本加载完成后，显示初始提示
  showToast('划词朗读翻译 Pro 已开启 (Ctrl + Space 切换)');

})();
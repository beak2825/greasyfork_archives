// ==UserScript==
// @name         划词翻译 + 自动朗读
// @namespace    https://wobshare.us.kg
// @author       wob
// @version      1.2
// @description  ✅请先到【扩展管理】中打开【开发人员模式】才能正常使用！✨使用有道词典API接口翻译，实现划词翻译+朗读+鼠标移出划词范围则关闭悬浮翻译功能，不想使用该脚本时按 "Ctrl+空格"快捷键 【关闭/开启】该脚本，轻量快速稳定！仅支持英译中、单词翻译，不支持句子翻译。国内外皆可使用！
// @match        *://*/*
// @exclude      *://www.google.com/search*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      dict.youdao.com
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/536760/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91%20%2B%20%E8%87%AA%E5%8A%A8%E6%9C%97%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/536760/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91%20%2B%20%E8%87%AA%E5%8A%A8%E6%9C%97%E8%AF%BB.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- 脚本状态控制 ---
  let scriptEnabled = true; // 脚本的启用状态，默认为开启

  // --- 语音朗读相关设置 ---
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

  // 初始化时预加载语音
  preloadVoices();

  // --- 动态注入 CSS 样式 ---
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
      z-index: 9999;
    }
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

  // 用于存储选中文本的位置，显示翻译框
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

    speakViaBrowser(text); // 朗读
    fetchYoudao(text, rect); // 翻译
    document.addEventListener('mousemove', strictMouseLeaveCheck); // 添加鼠标移动监听器以检测鼠标移出
  }

  // 初始时添加 mouseup 监听器
  document.addEventListener('mouseup', handleMouseUp);

  // --- 通过浏览器的语音合成功能朗读文本 ---
  function speakViaBrowser(text) {
    if (!scriptEnabled) return; // 如果脚本被禁用，不执行朗读
    if (!voiceReady) return; // 检查语音是否准备好
    // 尝试查找美式英语（en-US）语音，如果没有则使用第一种可用语音
    const voice = cachedVoices.find(v => v.lang === 'en-US') || cachedVoices[0];
    if (!voice) return; // 如果没有可用语音，则返回
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice;
    utter.lang = voice.lang || 'en-US'; // 设置朗读语言
    speechSynthesis.cancel(); // 取消当前所有朗读
    speechSynthesis.speak(utter); // 开始朗读
  }

  // --- 向有道翻译API接口发送请求获取翻译结果 ---
  function fetchYoudao(word, rect) {
    if (!scriptEnabled) return; // 如果脚本被禁用，不执行翻译请求
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://dict.youdao.com/jsonapi?xmlVersion=5.1&jsonversion=2&q=${encodeURIComponent(word)}`,
      onload: res => {
        try {
          const data = JSON.parse(res.responseText);
          let output = '';

          const ec = data.ec; // 有道词典的解释数据
          if (ec && ec.word && ec.word[0] && ec.word[0].trs) {
            const trs = ec.word[0].trs; // 词语的翻译列表
            output = trs.map(tr => `· ${tr.tr[0].l.i[0]}`).join('\n'); // 提取翻译并格式化
          }

          if (!output) output = '无翻译结果';
          showTooltip('📘 有道词典：\n' + output, rect); // 显示翻译结果
        } catch (err) {
          showTooltip('📘 有道解析失败', rect); // 解析失败提示
        }
      },
      onerror: () => {
        showTooltip('📘 有道请求失败', rect); // 请求失败提示
      }
    });
  }

  // --- 显示翻译结果的工具提示框 ---
  function showTooltip(text, rect) {
    if (!scriptEnabled) return; // 如果脚本被禁用，不显示卡片
    removeTooltip(); // 先移除旧的卡片
    const tip = document.createElement('div');
    tip.className = 'translate-tooltip';
    tip.innerText = text;
    document.body.appendChild(tip);

    // 设置卡片位置
    tip.style.left = `${rect.left + window.scrollX}px`;
    tip.style.top = `${rect.bottom + window.scrollY + 10}px`;
  }

  // --- 检查鼠标是否离开了选中的文本区域 ---
  function strictMouseLeaveCheck(e) {
    if (!selectionBox) return; // 如果没有选区，则返回
    const { left, right, top, bottom } = selectionBox;
    const buffer = 5; // 增加一个小的缓冲区域
    // 判断鼠标是否在选区范围内（包括缓冲区域）
    const inArea =
      e.pageX >= left + window.scrollX - buffer &&
      e.pageX <= right + window.scrollX + buffer &&
      e.pageY >= top + window.scrollY - buffer &&
      e.pageY <= bottom + window.scrollY + buffer;

    // 如果鼠标移出选中的区域则移除翻译提示框
    if (!inArea) {
      removeTooltip(); // 移除翻译卡片
      document.removeEventListener('mousemove', strictMouseLeaveCheck); // 移除鼠标移动监听
      selectionBox = null; // 清空选区位置信息
      if (window.getSelection) {
        window.getSelection().removeAllRanges(); // 清空选中文本（若不想清空选中的文本，可注释此行，多行注释：Ctrl+/ 或 Ctrl+K ）
      }
    }
  }

  // --- 移除翻译工具提示框 ---
  function removeTooltip() {
    const el = document.querySelector('.translate-tooltip');
    if (el) el.remove(); // 移除翻译卡片DOM元素
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
      showToast('划词翻译 + 自动朗读 已开启');
    } else {
      // 脚本关闭时
      document.removeEventListener('mouseup', handleMouseUp); // 移除 mouseup 监听
      removeTooltip(); // 移除当前显示的翻译卡片
      speechSynthesis.cancel(); // 停止所有正在进行的朗读
      document.removeEventListener('mousemove', strictMouseLeaveCheck); // 移除鼠标移出检测
      selectionBox = null; // 清空选区信息
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
      showToast('划词翻译 + 自动朗读 已关闭');
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
  showToast('划词翻译 + 自动朗读 已开启 (Ctrl + Space 切换)');

})();
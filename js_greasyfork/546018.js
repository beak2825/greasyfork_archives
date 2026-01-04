// ==UserScript==
// @name         Lingvist 智能语言选择器
// @name:en      Lingvist Smart Language Selector
// @namespace    https://github.com/username/lingvist-smart-language-selector
// @version      1.0.0
// @description  进入 https://learn.lingvist.com/#hub 后自动选择指定语言并开始学习
// @description:en Automatically selects specified language and starts learning when entering https://learn.lingvist.com/#hub
// @author       Your Name
// @match        https://learn.lingvist.com/*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @homepage     https://github.com/username/lingvist-smart-language-selector
// @supportURL   https://greasyfork.org/en/scripts/546018-lingvist-%E6%99%BA%E8%83%BD%E8%AF%AD%E8%A8%80%E9%80%89%E6%8B%A9%E5%99%A8
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546018/Lingvist%20%E6%99%BA%E8%83%BD%E8%AF%AD%E8%A8%80%E9%80%89%E6%8B%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/546018/Lingvist%20%E6%99%BA%E8%83%BD%E8%AF%AD%E8%A8%80%E9%80%89%E6%8B%A9%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ========== 语言选项配置 ==========
  const LANGUAGE_OPTIONS = {
    'english_zh_cn': { name: '英语（用中文简体学）', title: '英语', subtitle: '用 中文（简体）学', iconValue: 'gb' },
    'french_zh_cn': { name: '法语（用中文简体学）', title: '法语', subtitle: '用中文（简体）学', iconValue: 'fr' },
    'japanese_zh_cn': { name: '日语（用中文简体学）', title: '日语', subtitle: '用中文（简体）学', iconValue: 'jp' },
    'korean_zh_cn': { name: '韩语（用中文简体学）', title: '韩语', subtitle: '用中文（简体）学', iconValue: 'kr' },
    'french_zh_tw': { name: '法语（用中文繁体学）', title: '法語', subtitle: '用 中文（繁體）學', iconValue: 'fr' },
    'french_en': { name: '法语（用英语学）', title: 'French', subtitle: 'from English', iconValue: 'fr' },
    'spanish_europe_en': { name: '西班牙语欧洲版（用英语学）', title: 'Spanish (Europe)', subtitle: 'from English', iconValue: 'es' },
    'spanish_latin_en': { name: '西班牙语拉美版（用英语学）', title: 'Spanish (Latin America)', subtitle: 'from English', iconValue: 'es-us' },
    'german': { name: '德语', title: '德语', iconValue: 'de' },
    'italian': { name: '意大利语', title: '意大利语', iconValue: 'it' },
    'russian': { name: '俄语', title: '俄语', iconValue: 'ru' },
    'portuguese_brazil': { name: '葡萄牙语（巴西）', title: '葡萄牙语（巴西）', iconValue: 'br' },
    'dutch': { name: '荷兰语', title: '荷兰语', iconValue: 'nl' },
    'swedish': { name: '瑞典语', title: '瑞典语', iconValue: 'sv' },
    'norwegian': { name: '挪威语', title: '挪威语', iconValue: 'no' },
    'danish': { name: '丹麦语', title: '丹麦语', iconValue: 'da' },
    'polish': { name: '波兰语', title: '波兰语', iconValue: 'pl' },
    'estonian': { name: '爱沙尼亚语', title: '爱沙尼亚语', iconValue: 'ee' }
  };

  const CONFIG = {
    enableDebug: true,
    startButtonText: /开始学习|继续学习|Start Learning|Continue/i
  };

  function getSelectedLanguage() {
    const savedKey = GM_getValue('selectedLanguageKey', 'english_zh_cn');
    return LANGUAGE_OPTIONS[savedKey] || LANGUAGE_OPTIONS.english_zh_cn;
  }

  function saveSelectedLanguage(languageKey) {
    GM_setValue('selectedLanguageKey', languageKey);
  }

  function getCurrentPageLanguage() {
    // 检测页面当前实际显示的语言
    const courseSelect = document.querySelector('.course-select');
    if (!courseSelect) return null;
    
    const iconValue = courseSelect.querySelector('.course-icon')?.getAttribute('data-value') || '';
    const buttonText = courseSelect.querySelector('.text')?.textContent?.trim() || '';
    
    // 根据图标和按钮文本推断当前语言
    const result = {
      iconValue,
      buttonText,
      detected: null,
      detectedKey: null
    };
    
    // 尝试匹配已知的语言配置
    for (const [key, lang] of Object.entries(LANGUAGE_OPTIONS)) {
      if (lang.iconValue === iconValue) {
        result.detected = lang;
        result.detectedKey = key;
        break;
      }
    }
    
    LOG('🔍 检测到页面当前语言:', result);
    return result;
  }

  function isCurrentLanguageMatchTarget() {
    const targetLang = getSelectedLanguage();
    const currentLang = getCurrentPageLanguage();
    
    if (!currentLang || !currentLang.detected) {
      LOG('⚠️ 无法检测当前页面语言');
      return false;
    }
    
    const isMatch = currentLang.detected.name === targetLang.name;
    LOG('🎯 语言匹配检查:', {
      target: targetLang.name,
      current: currentLang.detected.name,
      isMatch
    });
    
    return isMatch;
  }

  // ========== Tampermonkey 菜单设置 ==========
  function showLanguageSelector() {
    const currentKey = GM_getValue('selectedLanguageKey', 'english_zh_cn');
    const currentLang = LANGUAGE_OPTIONS[currentKey];
    
    const choice = prompt(
      `🌍 Lingvist 语言选择器\n\n当前选择：${currentLang.name}\n\n请输入对应的数字选择语言：\n\n` +
      Object.entries(LANGUAGE_OPTIONS).map(([key, lang], index) => 
        `${index + 1}. ${key === currentKey ? '✓ ' : '  '}${lang.name}`
      ).join('\n'),
      ''
    );
    
    if (choice) {
      const index = parseInt(choice) - 1;
      const keys = Object.keys(LANGUAGE_OPTIONS);
      if (index >= 0 && index < keys.length) {
        const selectedKey = keys[index];
        saveSelectedLanguage(selectedKey);
        alert(`✅ 已选择：${LANGUAGE_OPTIONS[selectedKey].name}\n\n刷新页面后生效。`);
      } else {
        alert('❌ 无效的选择，请输入正确的数字。');
      }
    }
  }
  
  function toggleAutoStart() {
    const current = GM_getValue('autoClickStart', true);
    const newValue = !current;
    GM_setValue('autoClickStart', newValue);
    alert(`${newValue ? '✅ 已开启' : '❌ 已关闭'}自动点击"开始学习"按钮`);
  }
  
  function showCurrentSettings() {
    const targetLang = getSelectedLanguage();
    const pageLang = getCurrentPageLanguage();
    const autoStart = GM_getValue('autoClickStart', true);
    
    let message = `📋 当前设置：\n\n目标语言：${targetLang.name}\n自动开始学习：${autoStart ? '是' : '否'}`;
    
    if (pageLang && pageLang.detected) {
      message += `\n\n🔍 页面当前语言：${pageLang.detected.name}`;
      message += `\n✅ 语言匹配：${isCurrentLanguageMatchTarget() ? '是' : '否'}`;
    } else {
      message += `\n\n⚠️ 无法检测页面当前语言`;
    }
    
    alert(message);
  }

  // ========== 核心逻辑 ==========
  const LOG = CONFIG.enableDebug ? (...args) => console.debug('[Lingvist-AutoLang]', ...args) : () => {};
  const inHub = () => {
    const hash = location.hash;
    const isHubPage = hash === '#hub' || hash.startsWith('#hub/') || hash.startsWith('#hub?');
    const hasHubContent = document.querySelector('.course-select') !== null;
    const result = isHubPage && hasHubContent;
    LOG('页面检测:', { hash, isHubPage, hasHubContent, result, url: location.href });
    return result;
  };
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function simulateClick(el) {
    if (!el) return false;
    try {
      el.scrollIntoView({ block: 'center', inline: 'nearest' });
      const rect = el.getBoundingClientRect();
      
      // 修复 MouseEvent 构造参数
      ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(type => {
        el.dispatchEvent(new MouseEvent(type, {
          bubbles: true, 
          cancelable: true,
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
        }));
      });
      
      // 额外调用原生 click
      el.click?.();
      
      LOG('✅ 点击完成:', el);
      return true;
    } catch (e) {
      LOG('simulateClick error:', e);
      // 如果模拟点击失败，尝试简单的 click
      try {
        el.click();
        LOG('✅ 备用点击成功:', el);
        return true;
      } catch (e2) {
        LOG('备用点击也失败:', e2);
        return false;
      }
    }
  }

  function findLanguageButton() {
    // 更全面的选择器列表，参考原始脚本
    const selectors = [
      '.course-select [role="button"]',
      '.course-select .text',
      '.course-select .arrow', 
      '.course-select',
      '[data-testid="course-select"]',
      '.language-selector',
      '.course-dropdown'
    ];
    
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el && el.offsetParent !== null) {
        LOG('✅ 找到语言按钮:', s, el);
        return el;
      }
    }
    
    // 如果没找到，尝试通过文本内容查找
    const allButtons = document.querySelectorAll('button, [role="button"], .clickable');
    for (const btn of allButtons) {
      const text = btn.textContent || '';
      if (text.includes('French') || text.includes('English') || text.includes('语言') || text.includes('Language')) {
        LOG('✅ 通过文本找到语言按钮:', btn);
        return btn;
      }
    }
    
    LOG('⚠️ 未找到语言按钮');
    return null;
  }

  function matchTargetLanguage(item) {
    try {
      const selectedLanguage = getSelectedLanguage();
      const title = item.querySelector('.info .title')?.textContent?.trim() || '';
      const subtitle = item.querySelector('.info .subtitle')?.textContent?.trim() || '';
      
      const titleMatch = title === selectedLanguage.title;
      let subtitleMatch = true;
      if (selectedLanguage.subtitle) {
        subtitleMatch = subtitle === selectedLanguage.subtitle;
      }
      
      const result = titleMatch && subtitleMatch;
      
      if (result) {
        LOG('✅ 精确匹配到目标语言:', { title, subtitle, target: selectedLanguage });
      }
      
      return result;
    } catch (e) {
      LOG('matchTargetLanguage error:', e);
      return false;
    }
  }

  function getClickTargets(item) {
    // 使用原始脚本的成功选择器顺序
    const candidates = [
      item.querySelector('button,[role="button"],a'),  // 最重要的！
      item.querySelector('.info .title'),
      item.querySelector('.info'),
      item.querySelector('.course-icon'),
      item.querySelector('.right .meta'),
      item.querySelector('.right'),
      item, // 兜底
    ].filter(Boolean);
    
    return Array.from(new Set(candidates));
  }

  async function clickLanguageItemRobust(item) {
    const targets = getClickTargets(item);
    
    // 优先尝试最可能成功的目标
    for (const target of targets) {
      LOG('尝试点击目标子元素:', target);
      
      // 直接点击，不等待
      target.click();
      
      // 快速检查是否成功
      await sleep(100);  // 减少等待时间
      
      const popupOpen = !!document.querySelector('.courses-list');
      const becameActive = (item.classList?.contains('active') ||
        item.closest('.course-list-item')?.classList?.contains('active'));
      
      if (!popupOpen || becameActive) {
        LOG('✅ 语言选择成功：弹窗关闭或条目为 active');
        return true;
      }
    }
    
    LOG('❌ 所有点击尝试都失败了');
    return false;
  }

  async function openAndPickAndStart() {
    if (window.lingvistAutoRunning) return;
    window.lingvistAutoRunning = true;
    
    try {
      LOG('🚀 开始自动语言切换，目标:', getSelectedLanguage().name);
      
      // 检查当前语言是否已经是目标语言
      if (isCurrentLanguageMatchTarget()) {
        LOG('✅ 当前语言已经是目标语言，跳过切换');
        
        // 直接尝试点击开始学习
        if (GM_getValue('autoClickStart', true)) {
          await sleep(1000);
          const startBtn = document.querySelector('button.button-component.filled');
          if (startBtn && CONFIG.startButtonText.test(startBtn.textContent || '')) {
            LOG('🚀 直接点击开始学习');
            simulateClick(startBtn);
          }
        }
        return;
      }

      await sleep(500);  // 减少等待时间
      
      // 查找语言按钮（减少重试次数和间隔）
      let btn = null;
      for (let i = 0; i < 5; i++) {
        btn = findLanguageButton();
        if (btn) break;
        await sleep(300);  // 减少间隔
        LOG(`查找语言按钮 ${i + 1}/5`);
      }
      
      if (!btn) {
        LOG('❌ 未找到语言按钮');
        return;
      }
      
      // 快速点击语言按钮
      LOG('🎯 点击语言按钮');
      btn.click();  // 直接使用最简单的点击方式
      
      await sleep(400);  // 减少等待时间
      
      let listRoot = document.querySelector('.courses-list');
      if (!listRoot) {
        // 如果简单点击失败，尝试一次模拟点击
        LOG('⚠️ 简单点击失败，尝试模拟点击');
        simulateClick(btn);
        await sleep(400);
        listRoot = document.querySelector('.courses-list');
      }
      
      if (!listRoot) {
        LOG('❌ 语言列表未打开');
        return;
      }
      
      LOG('✅ 语言列表已打开');
      
      const items = Array.from(listRoot.querySelectorAll('.course-list-item'));
      LOG('可用语言数量:', items.length);
      
      // 调试：显示所有语言
      items.forEach((item, index) => {
        const title = item.querySelector('.info .title')?.textContent?.trim() || '';
        const subtitle = item.querySelector('.info .subtitle')?.textContent?.trim() || '';
        LOG(`语言 ${index + 1}: "${title}" - "${subtitle}"`);
      });
      
      const target = items.find(matchTargetLanguage);
      
      if (!target) {
        LOG('❌ 未找到目标语言');
        return;
      }
      
      LOG('🎯 点击目标语言');
      
      // 尝试多种方式点击目标语言
      const clickSuccess = await clickLanguageItemRobust(target);
      if (!clickSuccess) {
        LOG('❌ 点击目标语言失败');
        return;
      }
      
      await sleep(800);  // 减少等待时间
      
      // 点击开始学习
      if (GM_getValue('autoClickStart', true)) {
        const startBtn = document.querySelector('button.button-component.filled');
        if (startBtn && CONFIG.startButtonText.test(startBtn.textContent || '')) {
          LOG('🚀 点击开始学习');
          startBtn.click();  // 使用简单点击
        }
      }
      
    } finally {
      setTimeout(() => { window.lingvistAutoRunning = false; }, 5000);
    }
  }

  // ========== 初始化 ==========
  LOG('🚀 Lingvist 脚本已加载！');
  LOG('📍 当前页面:', location.href);
  LOG('🌍 当前语言设置:', getSelectedLanguage().name);
  LOG('⚙️ 自动开始学习:', GM_getValue('autoClickStart', true) ? '开启' : '关闭');

  // 注册 Tampermonkey 菜单
  GM_registerMenuCommand('🌍 选择语言', showLanguageSelector);
  GM_registerMenuCommand('⚙️ 切换自动开始学习', toggleAutoStart);
  GM_registerMenuCommand('📋 查看当前设置', showCurrentSettings);
  
  // 检查当前是否在 hub 页面
  function checkAndRun() {
    LOG('检查当前页面:', location.href);
    if (inHub()) {
      LOG('✅ 在 hub 页面，准备执行自动切换');
      setTimeout(openAndPickAndStart, 2000);
    } else {
      LOG('❌ 不在 hub 页面，跳过执行');
    }
  }
  
  // 立即检查一次
  checkAndRun();
  
  // 使用 MutationObserver 监听页面内容变化（更可靠）
  const observer = new MutationObserver((mutations) => {
    // 检查是否有重要的 DOM 变化
    const hasSignificantChange = mutations.some(mutation => 
      mutation.type === 'childList' && 
      (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
    );
    
    if (hasSignificantChange) {
      LOG('检测到页面内容变化');
      setTimeout(checkAndRun, 1000);
    }
  });
  
  // 开始观察整个文档的变化
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  // 同时保留原有的路由监听作为备用
  const _pushState = history.pushState;
  history.pushState = function (...args) {
    const ret = _pushState.apply(this, args);
    LOG('检测到 pushState 变化');
    setTimeout(checkAndRun, 1000);
    return ret;
  };
  
  const _replaceState = history.replaceState;
  history.replaceState = function (...args) {
    const ret = _replaceState.apply(this, args);
    LOG('检测到 replaceState 变化');
    setTimeout(checkAndRun, 1000);
    return ret;
  };
  
  window.addEventListener('popstate', () => { 
    LOG('检测到 popstate 事件');
    setTimeout(checkAndRun, 1000);
  });
  
  window.addEventListener('hashchange', () => { 
    LOG('检测到 hashchange 事件');
    setTimeout(checkAndRun, 1000);
  });
})();

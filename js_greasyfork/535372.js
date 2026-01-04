// ==UserScript==
// @name          全局解除选中、复制与右键限制
// @namespace     http://tampermonkey.net/
// @version       1.4.3
// @description   精细控制网页限制解除行为 + 可配置强力解除全部限制模式 + 全部关闭模式 (Canvas增强) + 支持用户本地配置规则（本地规则优先于远程）（完结撒花）
// @author        yui酱
// @match         *://*/*
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @connect       raw.githubusercontent.com
// @connect       cdn.jsdelivr.net // 新增：允许连接 jsDelivr CDN
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/535372/%E5%85%A8%E5%B1%80%E8%A7%A3%E9%99%A4%E9%80%89%E4%B8%AD%E3%80%81%E5%A4%8D%E5%88%B6%E4%B8%8E%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/535372/%E5%85%A8%E5%B1%80%E8%A7%A3%E9%99%A4%E9%80%89%E4%B8%AD%E3%80%81%E5%A4%8D%E5%88%B6%E4%B8%8E%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 注意: 下面两行会在每次脚本运行时清除配置缓存，主要用于开发调试阶段。您想打开来玩一玩也行（
  //GM_setValue('remote_config_cache', null);
  //GM_setValue('remote_config_cache_time', 0);

  // --- 用户本地配置区域 ---
  //
  // 如果您希望自定义规则，并让这些规则优先于远程配置，请在这里定义您的 `localRules` 数组。
  // 定义并启用 (即移除下面的 `/* ... */` 注释) 后，脚本将尝试下载远程配置，
  // 然后将本地规则合并进去。如果本地和远程有相同的 `domain` 规则，本地的将覆盖远程的。
  //
  // 注意：以下示例规则是为演示用途，您可以根据您的需求修改或添加规则。
  // 请确保规则的格式符合 JSON 标准。
  //
  // 示例 (移除以下 `/*` 和 `*/` 符号来启用):
/*
  const localRules = [
    {
      "domain": "\\.example\\.com$", // 匹配 example.com 及其子域名
      "forceUnlockAll": true,         // 在这个网站强制解除所有限制
      "unlockOverlayPro": false,
      "unlockOff": false
    },
    {
      "domain": "\\.another-site\\.org$", // 匹配 another-site.org 及其子域名
      "unlockSelect": false,            // 在这个网站禁用选中
      "unlockCopy": true,
      "unlockContext": false,
      "unlockOverlay": false,
      "unlockOverlayPro": false,
      "unlockOff": false
    },
    {
      "domain": "\\.offline-tool\\.io$", // 匹配 offline-tool.io 及其子域名，完全禁用解除限制
      "unlockOff": true                 // 在这个网站禁用所有解除限制功能
    },
    // 您可以在这里添加更多规则...
    // 例如：
    // {
    //   "domain": "\\.some-forum\\.net$",
    //   "unlockCopy": true,
    //   "unlockContext": true
    // }
  ];
  */

  // 请将上面的注释符号 (/* ... */) 移除，并在其中填入您自己的规则。
  // 如果不使用本地配置，请保持这段代码注释或将 `localRules` 变量移除。
  // --- 用户本地配置区域结束 ---




  // Debounce utility function - 用于限制函数调用频率
  function debounce(func, delay) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  // 远程配置文件的URL
  // 主链接使用 GitHub Raw
  const CONFIG_URL = 'https://raw.githubusercontent.com/MT-Y-TM/Fuck_All_Web_Restrictions/main/config.json';
  // 备用链接使用 jsDelivr CDN 指向您的 GitHub 仓库
    const CONFIG_URL_CN = 'https://cdn.jsdelivr.net/gh/MT-Y-TM/Fuck_All_Web_Restrictions@main/config.json';
  // 本地缓存配置的键名
  const CACHE_KEY = 'remote_config_cache';
  // 本地缓存配置时间的键名
  const CACHE_TIME_KEY = 'remote_config_cache_time';
  // 缓存有效期（7天，单位：毫秒）
  const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

  // 获取远程配置的内部辅助函数，处理 URL 切换和回调
  // remoteCallback 现在接收 { config: parsedJson, source: 'github' | 'jsdelivr' | 'error' | 'cache' }
  function _fetchRemoteConfigInternal(primaryUrl, fallbackUrl, remoteCallback, cachedConfigText, useCnUrl) {
    const urlToFetch = useCnUrl ? fallbackUrl : primaryUrl;
    const urlName = useCnUrl ? 'jsDelivr (备用)' : 'GitHub Raw (主)'; // 更新日志名称

    console.log(`[解除限制] 尝试从 ${urlName} 获取配置文件: ${urlToFetch}`);

    GM_xmlhttpRequest({
      method: 'GET',
      url: urlToFetch,
      onload: function (response) {
        if (response.status === 200) {
          try {
            const json = JSON.parse(response.responseText);
            GM_setValue(CACHE_KEY, response.responseText); // 缓存新的配置文本
            GM_setValue(CACHE_TIME_KEY, Date.now());     // 更新缓存时间
            // console.log(`[解除限制] 配置文件从 ${urlName} 获取成功。`); // 移除这里的成功日志，由 loadConfig 统一输出
            const source = useCnUrl ? 'jsdelivr' : 'github';
            remoteCallback({ config: json, source: source }); // 成功：传递解析后的配置和来源
          } catch (e) {
            console.error(`[解除限制] 从 ${urlName} 获取的配置文件解析失败:`, e);
            if (!useCnUrl) {
              // 如果主链接失败，尝试备用链接
              _fetchRemoteConfigInternal(primaryUrl, fallbackUrl, remoteCallback, cachedConfigText, true);
            } else {
              console.error('[解除限制] 备用配置文件也解析失败。');
              // 两个 URL 都失败，尝试使用现有的缓存配置（如果可用），并标记来源为 error
              remoteCallback({ config: cachedConfigText ? JSON.parse(cachedConfigText) : null, source: 'error' });
            }
          }
        } else {
          console.error(`[解除限制] 从 ${urlName} 获取配置文件失败，状态码: ${response.status}`);
          if (!useCnUrl) {
            // 如果主链接失败，尝试备用链接
            _fetchRemoteConfigInternal(primaryUrl, fallbackUrl, remoteCallback, cachedConfigText, true);
          } else {
            console.error('[解除限制] 备用配置文件也获取失败。');
            // 两个 URL 都失败，尝试使用现有的缓存配置（如果可用），并标记来源为 error
            remoteCallback({ config: cachedConfigText ? JSON.parse(cachedConfigText) : null, source: 'error' });
          }
        }
      },
      onerror: function (error) {
        console.error(`[解除限制] 从 ${urlName} 获取配置文件网络错误:`, error);
        if (!useCnUrl) {
          // 如果主链接网络错误，尝试备用链接
          _fetchRemoteConfigInternal(primaryUrl, fallbackUrl, remoteCallback, cachedConfigText, true);
        } else {
          console.error('[解除限制] 备用配置文件也网络错误。');
          // 两个 URL 都失败，尝试使用现有的缓存配置（如果可用），并标记来源为 error
          remoteCallback({ config: cachedConfigText ? JSON.parse(cachedConfigText) : null, source: 'error' });
        }
      }
    });
  }

  // 加载配置函数：负责获取远程配置并与本地配置合并
  // callback 现在接收 config 对象
  function loadConfig(callback) {
    // 先尝试获取远程配置（或使用缓存）
    fetchRemoteConfig(function(result) { // result 是 { config: ..., source: ... }
      const { config: remoteConfig, source: remoteSource } = result; // 解构结果

      let finalConfig = remoteConfig || { rules: [] }; // 初始化最终配置，确保有 rules 数组
      let configSource = remoteSource; // 记录配置的最终来源

      // 检查 `localRules` 变量是否已定义、是数组且不为空
      // 注意：`localRules` 是用户可以在脚本顶部的“用户本地配置区域”定义的全局常量。
      if (typeof localRules !== 'undefined' && Array.isArray(localRules) && localRules.length > 0) {
        console.log('%c[解除限制] 检测到用户本地配置规则，将与远程配置合并。本地规则（domain 相同者）将覆盖远程配置。', 'color: #8A2BE2; font-weight: bold;');

        // 创建一个临时 Map 用于高效合并规则，以 `domain` 字符串作为键
        const mergedRulesMap = new Map();

        // 首先将远程规则添加到 Map 中
        if (finalConfig.rules) { // Ensure remote rules exist
          finalConfig.rules.forEach(rule => {
            // 仅将具有 'domain' 属性的有效远程规则添加到 Map 中，忽略注释对象
            if (rule && typeof rule.domain === 'string') {
               mergedRulesMap.set(rule.domain, rule);
            }
          });
        }


        // 然后遍历本地规则，添加到 Map 中。如果 `domain` 已存在，本地规则将覆盖远程规则
        localRules.forEach(localRule => {
           // 仅处理具有 'domain' 属性的有效本地规则
           if (localRule && typeof localRule.domain === 'string') {
              mergedRulesMap.set(localRule.domain, localRule);
           }
        });

        // 将合并后的 Map 转换回数组，作为最终的规则列表
        finalConfig.rules = Array.from(mergedRulesMap.values());

        // 如果使用了本地规则合并，来源就包含本地信息
        configSource = (remoteSource && remoteSource !== 'error') ? `远程 (${remoteSource}) + 本地` : '仅本地';

      } else {
        console.log('[解除限制] 未检测到用户本地配置规则。');
        // 如果没有本地规则，也需要过滤掉远程配置中的注释对象
        if (finalConfig.rules) { // 确保 rules 存在
           finalConfig.rules = finalConfig.rules.filter(rule => rule && typeof rule.domain === 'string');
        }
        // configSource 已经是远程来源或 error
      }

      // *** 在这里输出配置加载完成的日志，明确来源 ***
      const sourceMessage = configSource === 'cache' ? '本地缓存' :
                            configSource === 'github' ? '远程仓库 (主链接)' :
                            configSource === 'jsdelivr' ? '远程仓库 (备用链接)' :
                            configSource === 'error' ? '远程加载失败，使用本地缓存或空配置' : // 根据 error source 调整
                            configSource; // 处理合并来源或其他情况

      console.log(`%c[解除限制] 配置加载完成。来源: ${sourceMessage}`, 'color: #1A73E8; font-weight: bold;');


      // 将最终合并的配置传递给主脚本逻辑
      callback(finalConfig);
    });
  }

  // 获取远程配置的入口函数
  // remoteCallback 现在接收 { config: parsedJson, source: 'cache' | 'github' | 'jsdelivr' | 'error' }
  function fetchRemoteConfig(remoteCallback) {
    const now = Date.now();
    const cachedTime = GM_getValue(CACHE_TIME_KEY, 0);
    const cachedConfigText = GM_getValue(CACHE_KEY, null); // 获取缓存的文本

    // 如果存在缓存配置且未过期
    if (cachedConfigText && (now - cachedTime < CACHE_DURATION)) {
      try {
        const parsedConfig = JSON.parse(cachedConfigText);
        //console.log('[解除限制] 配置文件从本地缓存加载成功。'); // 移除这里的成功日志，由 loadConfig 统一输出
        remoteCallback({ config: parsedConfig, source: 'cache' }); // 传递解析后的缓存配置和来源
      } catch (e) {
        console.error('解析缓存配置失败:', e);
        // 如果缓存解析失败，则尝试从远程获取（从主 URL 开始）
        _fetchRemoteConfigInternal(CONFIG_URL, CONFIG_URL_CN, remoteCallback, cachedConfigText, false);
      }
    } else {
      // 否则，从远程获取配置（从主 URL 开始）
      _fetchRemoteConfigInternal(CONFIG_URL, CONFIG_URL_CN, remoteCallback, cachedConfigText, false);
    }
  }

  //控制台输出确认脚本工作状态
  function logCurrentRules(rule, hostname) {
    const COLOR_MAIN_TITLE = 'color: #1A73E8; font-weight: bold;'; // 主标题蓝色
    const COLOR_SEPARATOR = 'color: #4CAF50;';                   // 分隔符绿色
    const COLOR_LABEL_HIGHLIGHT = 'color: #FF5722; font-weight: bold;'; // 标签文字的颜色（橙色）
    const COLOR_TRUE = 'color: #28A745; font-weight: bold;';      // true 的绿色
    const COLOR_FALSE = 'color: #DC3545; font-weight: bold;';     // false 的红色

    function getBoolColor(value) {
      return value ? COLOR_TRUE : COLOR_FALSE;
    }

    console.log(
      '%c[脚本的使用规则情况]%c： %c强力解除%c：%c' + rule.forceUnlockAll +
      '%c；%c右键%c：%c' + rule.unlockContext +
      '%c；%c遮罩%c：%c' + rule.unlockOverlay +
      '%c；%c强力遮罩%c：%c' + rule.unlockOverlayPro +
      '%c；%c选中%c：%c' + rule.unlockSelect +
      '%c；%c复制%c：%c' + rule.unlockCopy +
      '%c；%c全部禁用%c：%c' + rule.unlockOff,

      COLOR_MAIN_TITLE,
      COLOR_SEPARATOR,
      COLOR_LABEL_HIGHLIGHT,
      COLOR_SEPARATOR,
      getBoolColor(rule.forceUnlockAll),

      COLOR_SEPARATOR,
      COLOR_LABEL_HIGHLIGHT,
      COLOR_SEPARATOR,
      getBoolColor(rule.unlockContext),

      COLOR_SEPARATOR,
      COLOR_LABEL_HIGHLIGHT,
      COLOR_SEPARATOR,
      getBoolColor(rule.unlockOverlay),

      COLOR_SEPARATOR,
      COLOR_LABEL_HIGHLIGHT,
      COLOR_SEPARATOR,
      getBoolColor(rule.unlockOverlayPro),

      COLOR_SEPARATOR,
      COLOR_LABEL_HIGHLIGHT,
      COLOR_SEPARATOR,
      getBoolColor(rule.unlockSelect),

      COLOR_SEPARATOR,
      COLOR_LABEL_HIGHLIGHT,
      COLOR_SEPARATOR,
      getBoolColor(rule.unlockCopy),

      COLOR_SEPARATOR,
      COLOR_LABEL_HIGHLIGHT,
      COLOR_SEPARATOR,
      getBoolColor(rule.unlockOff)
    );
  }


  // 加载配置并执行主要逻辑
  loadConfig(function (config) {
    // 默认规则
    const defaultRule = {
      unlockSelect: false,     // 是否解除选中限制
      unlockCopy: true,       // 是否解除复制/剪切限制
      unlockContext: true,    // 是否解除右键菜单限制
      unlockOverlay: true,    // 是否移除遮罩层 (常规版)
      unlockOverlayPro: false, // 是否移除遮罩层 (强力版)
      forceUnlockAll: false,   // 是否启用强力解除所有限制模式
      unlockOff: false         // 新增：是否禁用所有解除限制功能 (默认不禁用)
    };

    const hostname = location.hostname; // 当前页面的域名
    const rules = config?.rules || []; // 从合并后的配置中获取规则列表，若无则为空数组

    // 查找适用于当前站点的规则，忽略不包含 'domain' 属性的对象（即注释对象）
    const siteRule = rules.find(r => {
      // 确保 r 存在且有 domain 属性
      if (r && typeof r.domain === 'string') {
         try {
            return new RegExp(r.domain, 'i').test(hostname);
         } catch (e) {
            console.warn(`[解除限制] 无效的域名正则表达式 '${r.domain}':`, e);
            return false; // 如果正则表达式无效，则忽略此规则
         }
      }
      return false; // 忽略没有 domain 属性的对象
    });


    const rule = { ...defaultRule, ...(siteRule || {}) }; // 合并规则，站点规则优先

    const COLOR_PINK_MESSAGE = 'color: #C71585; font-weight: bold;';
    console.log(
      '%c[解除限制] 脚本已加载并应用规则 for: %c' + hostname,
      COLOR_PINK_MESSAGE,
      COLOR_PINK_MESSAGE
    );

    // --- 最高优先级：如果 unlockOff 为 true，则禁用所有解除限制功能并退出 ---
    if (rule.unlockOff) {
        // 输出用户指定的日志信息
        console.log('%c[解除限制] 本脚本已检测到该网站全局禁用模式 (unlockOff) 已启用，已关闭本脚本的运行', 'color: #FF4500; font-weight: bold;');

        // Explicitly set all other unlock flags to false as requested
        rule.unlockSelect = false;
        rule.unlockCopy = false;
        rule.unlockContext = false;
        rule.unlockOverlay = false;
        rule.unlockOverlayPro = false;
        rule.forceUnlockAll = false;
        // rule.unlockOff remains true

        // 打印最终的规则状态（所有解除功能应为 false）
        logCurrentRules(rule, hostname);
        // 使用 return 语句停止脚本的后续执行，释放资源
        return;
    }
    // --- 最高优先级逻辑结束 ---


    // --- 处理 unlockOverlay 与 unlockOverlayPro 的互斥逻辑 ---
    // 这一逻辑在 unlockOff 之后执行，因为它调整的是具体解除功能的参数
    if (rule.unlockOverlay && rule.unlockOverlayPro) {
      console.warn('%c[警告] 站点规则同时启用了“遮罩”和“强力遮罩”。“强力遮罩”将优先，常规“遮罩”将被禁用。', 'color: orange; font-weight: bold;');
      rule.unlockOverlay = false; // 强力遮罩优先，禁用常规遮罩
    }
    // --- 互斥逻辑结束 ---

    // 是否应该启用强力模式
    const shouldForce = rule.forceUnlockAll;

    // 🔒 强力解除模式 (forceUnlockAll)
    // 如果强力模式被启用，则执行强力解除，并退出脚本
    if (shouldForce) {
      [
        'copy', 'cut', 'selectstart', 'mousedown', 'mouseup',
        'mousemove', 'contextmenu', 'keydown', 'keypress',
        'keyup', 'selectionchange', 'dragstart', 'drag', 'dragend'
      ].forEach(evt => {
        document.addEventListener(evt, e => {
          e.stopImmediatePropagation();
        }, true);
        try {
          Object.defineProperty(document, `on${evt}`, { value: null, writable: true, configurable: true });
          Object.defineProperty(window, `on${evt}`, { value: null, writable: true, configurable: true });
          Object.defineProperty(document.body, `on${evt}`, { value: null, writable: true, configurable: true });
        } catch (e) { /* 对于无法重新定义的属性，静默处理错误 */ }
      });

      const forceStyle = document.createElement('style');
      forceStyle.textContent = `
        html, body, *, ::before, ::after {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
          -webkit-touch-callout: default !important;
          pointer-events: auto !important;
          cursor: auto !important; /* 强力模式下包含光标重置 */
        }
        canvas {
            pointer-events: auto !important;
            -webkit-user-select: auto !important;
            user-select: auto !important;
        }
      `;
      (document.head || document.documentElement).appendChild(forceStyle);

      // 清除所有定时器，这个操作要非常谨慎，可能影响页面正常功能
      let M_interval = setInterval(()=>{},99999); for(let i=0;i<M_interval;i++)clearInterval(i);
      let M_timeout = setTimeout(()=>{},99999); for(let i=0;i<M_timeout;i++)clearTimeout(i);

      console.log('[解除限制] 强力模式已启用 (Canvas Enhanced).');
      logCurrentRules(rule, hostname); // 打印最终应用规则状态
      return; // 强力模式启用后，不执行常规解除逻辑
    }

    // ✅ 常规解除选中限制
    if (rule.unlockSelect) {
      const selectStyle = document.createElement('style');
      selectStyle.id = 'unlock-select-style'; // 给style标签一个ID，方便调试
      selectStyle.textContent = `
        *, ::before, ::after { /* 应用于所有元素和伪元素 */
          -webkit-user-select: auto !important;
          -moz-user-select: auto !important;
          -ms-user-select: auto !important;
          user-select: auto !important;    /* 允许自动选择 */
        }
      `;
      (document.head || document.documentElement).appendChild(selectStyle);

      // 主要针对选择相关的事件
      ['selectstart', 'mousedown', 'dragstart'].forEach(evt => {
        document.addEventListener(evt, e => e.stopPropagation(), true);
        try {
          Object.defineProperty(document, `on${evt}`, { value: null, writable: true, configurable: true });
          Object.defineProperty(document.body, `on${evt}`, { value: null, writable: true, configurable: true });
        } catch (e) { /* 静默处理错误 */ }
      });
      // console.log('[解除限制] 解除选中限制已启用。'); // 可以按需开启详细日志
    }

    // ✅ 常规解除复制/剪切限制
    if (rule.unlockCopy) {
      // 主要针对复制、剪切相关的事件
      ['copy', 'cut'].forEach(evt => {
        document.addEventListener(evt, e => e.stopPropagation(), true);
        try {
          Object.defineProperty(document, `on${evt}`, { value: null, writable: true, configurable: true });
          Object.defineProperty(document.body, `on${evt}`, { value: null, writable: true, configurable: true });
        } catch (e) { /* 静默处理错误 */ }
      });
      // console.log('[解除限制] 解除复制/剪切限制已启用。'); // 可以按需开启详细日志
    }

    // ✅ 恢复右键菜单
    if (rule.unlockContext) {
      document.addEventListener('contextmenu', e => {
        e.stopImmediatePropagation();
      }, true);

      try {
        Object.defineProperty(document, 'oncontextmenu', { value: null, writable: true, configurable: true });
        Object.defineProperty(document.body, 'oncontextmenu', { value: null, writable: true, configurable: true });
        Object.defineProperty(document.documentElement, 'oncontextmenu', { value: null, writable: true, configurable: true });
      } catch (e) { /* 静默处理错误 */ }

      // 动态处理，确保新添加的元素也移除右键菜单限制
      // 原有的 MutationObserver 逻辑已优化
    }

    // ✅ 移除遮罩层 (常规版)
    if (rule.unlockOverlay) {
      // 将 removeOverlays 包裹在 debounce 中
      const debouncedRemoveOverlays = debounce(function removeOverlays() {
        // 找... // 查找 body 下的直接子元素，通常遮罩层不会在很深的嵌套中
        document.querySelectorAll('body > *').forEach(el => {
          const st = window.getComputedStyle(el);
          if (!st) return;
          // 常见遮罩层的判断条件：固定或绝对定位，高 z-index，透明或无背景色，且阻止鼠标事件
          if ((st.position === 'fixed' || st.position === 'absolute') &&
              st.zIndex !== 'auto' && parseInt(st.zIndex) > 999 && // 假定高 z-index
              st.pointerEvents === 'none' &&
              (st.backgroundColor === 'rgba(0, 0, 0, 0)' || parseFloat(st.opacity) < 0.1)) {
             // console.log('[解除限制] 移除疑似遮罩层 (常规):', el); // 可选日志
             el.remove();
          }
        });
        // 针对常见的阻止滚动的样式，尝试移除
        if (document.body.style.overflow === 'hidden') {
            document.body.style.removeProperty('overflow');
        }
        if (document.documentElement.style.overflow === 'hidden') {
            document.documentElement.style.removeProperty('overflow');
        }
      }, 100); // 100ms 防抖

      // 在页面加载后和滚动时尝试移除
      window.addEventListener('load', debouncedRemoveOverlays, true);
      window.addEventListener('scroll', debouncedRemoveOverlays, true);
      // 也可以添加一个 MutationObserver 观察 body 的子元素变化
      const overlayObserver = new MutationObserver(debouncedRemoveOverlays);
      overlayObserver.observe(document.body, { childList: true, subtree: false }); // 只观察直接子元素
    }

    // ✅ 移除遮罩层 (强力版) - unlockOverlayPro
    if (rule.unlockOverlayPro) {
        const overlayProStyle = document.createElement('style');
        overlayProStyle.id = 'unlock-overlay-pro-style'; // 方便调试
        overlayProStyle.textContent = `
            html, body, *, ::before, ::after {
                pointer-events: auto !important; /* 恢复所有元素的鼠标事件 */
                cursor: auto !important;        /* 重置光标 */
            }
            /* 尝试隐藏常见的模态框或遮罩层类名 */
            .modal-backdrop, .overlay, .dark-screen, .popup-wrapper, .dialog-container {
                display: none !important;
            }
            /* 针对一些高度/宽度都为100%的fixed/absolute元素进行隐藏 */
            div[style*="position:fixed"][style*="height:100%"][style*="width:100%"],
            div[style*="position:absolute"][style*="height:100%"][style*="width:100%"] {
                display: none !important;
            }
            body {
                overflow: auto !important; /* 确保 body 滚动条可用 */
            }
        `;
        (document.head || document.documentElement).appendChild(overlayProStyle);

        // 将 removeOverlayProElementsAggressively 包裹在 debounce中
        const debouncedRemoveOverlayProElementsAggressively = debounce(function removeOverlayProElementsAggressively() {
            document.querySelectorAll('body > *').forEach(el => {
                const st = window.getComputedStyle(el);
                if (!st) return;

                const isFixedOrAbsolute = (st.position === 'fixed' || st.position === 'absolute');
                const hasHighZIndex = st.zIndex !== 'auto' && parseInt(st.zIndex) > 10000; // 极高 z-index
                const isFullScreenLike = (st.width === '100vw' || st.width === '100%') && (st.height === '100vh' || st.height === '100%');
                const isClickBlocking = st.pointerEvents === 'none' || st.cursor === 'not-allowed';

                // 判断条件可以更复杂，例如结合背景色透明度、尺寸等
                if (isFixedOrAbsolute && hasHighZIndex && (isFullScreenLike || isClickBlocking)) {
                    // console.log('[解除限制] 强力移除疑似遮罩层 (Pro):', el); // 可选日志
                    el.remove();
                }
            });
            // 移除可能被设置的 body/html 上的阻止滚动的行内样式或类
            document.body.style.removeProperty('overflow');
            document.body.classList.remove('no-scroll', 'modal-open');
            document.documentElement.style.removeProperty('overflow');
            document.documentElement.classList.remove('no-scroll', 'modal-open');
        }, 200); // 200ms 防抖，因为这个函数更激进

        // 立即执行，并持续观察 DOM 变化
        debouncedRemoveOverlayProElementsAggressively();
        window.addEventListener('load', debouncedRemoveOverlayProElementsAggressively, true);
        // MutationObserver 观察 body 下所有子元素的增删，以应对动态生成的遮罩
        const overlayProObserver = new MutationObserver(debouncedRemoveOverlayProElementsAggressively);
        overlayProObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    }


    // 观察 DOM 变化，以便在必要时重新应用右键菜单规则
    // 对 MutationObserver 的回调进行防抖和优化
    const debouncedUnlockContextObserverCallback = debounce((mutationsList) => {
        if (!rule.unlockContext) return; // 确保规则仍然激活

        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 只处理元素节点
                        // 检查新增节点本身
                        if (node.oncontextmenu) node.oncontextmenu = null;
                        if (node.hasAttribute('oncontextmenu')) node.removeAttribute('oncontextmenu');
                        // 检查新增节点的子孙元素
                        node.querySelectorAll('*').forEach(el => {
                            if (el.oncontextmenu) el.oncontextmenu = null;
                            if (el.hasAttribute('oncontextmenu')) el.removeAttribute('oncontextmenu');
                        });
                    }
                });
            } else if (mutation.type === 'attributes' && mutation.attributeName === 'oncontextmenu') {
                // 只处理 oncontextmenu 属性变化的元素本身
                const targetElement = mutation.target;
                if (targetElement.oncontextmenu) targetElement.oncontextmenu = null;
                if (targetElement.hasAttribute('oncontextmenu')) targetElement.removeAttribute('oncontextmenu');
            }
        });
    }, 150); // 150ms 防抖

    const observer = new MutationObserver(debouncedUnlockContextObserverCallback);
    observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });

    logCurrentRules(rule, hostname); // 打印最终应用规则状态
  }); // loadConfig 回调结束
})();
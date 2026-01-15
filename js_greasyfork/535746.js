// ==UserScript==
// @name              🫧404小站 — 🛠️网页限制解除
// @name:en           🫧404小站 — 🛠️Remove web limits
// @name:zh           🫧404小站 — 🛠️网页限制解除
// @name:zh-CN        🫧404小站 — 🛠️网页限制解除
// @name:zh-TW        🫧404小站 — 🛠️網頁限制解除
// @name:ja           🫧404小站 — 🛠️ウェブの規制緩和
// @description       通杀大部分网站，可以解除禁止复制、剪切、选择文本、右键菜单的限制。
// @description:en    Pass to kill most of the site, you can lift the restrictions prohibited to copy, cut, select the text, right-click menu.
// @description:zh    通杀大部分网站，可以解除禁止复制、剪切、选择文本、右键菜单的限制。
// @description:zh-CN 通杀大部分网站，可以解除禁止复制、剪切、选择文本、右键菜单的限制。
// @description:zh-TW 通殺大部分網站，可以解除禁止復制、剪切、選擇文本、右鍵菜單的限制。
// @description:ja    サイトのほとんどを殺すために渡し、あなたは、コピー切り取り、テキスト、右クリックメニューを選択することは禁止の制限を解除することができます
// @author            yyy.
// @version           1.0.3
// @license           LGPLv3
// @match             *://*/*
// @grant             GM_registerMenuCommand
// @grant             GM_getValue
// @grant             GM_setValue
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @run-at            document-start
// @namespace https://greasyfork.org/users/1446006
// @downloadURL https://update.greasyfork.org/scripts/535746/%F0%9F%AB%A7404%E5%B0%8F%E7%AB%99%20%E2%80%94%20%F0%9F%9B%A0%EF%B8%8F%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/535746/%F0%9F%AB%A7404%E5%B0%8F%E7%AB%99%20%E2%80%94%20%F0%9F%9B%A0%EF%B8%8F%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==
(function() {
  'use strict';

  // 域名规则列表
  var rules = {
    black_rule: {
      name: "black",
      hook_eventNames: "",
      unhook_eventNames: ""
    },
    default_rule: {
      name: "default",
      hook_eventNames: "contextmenu|select|selectstart|copy|cut|dragstart",
      unhook_eventNames: "keydown|keyup",
      dom0: true,
      hook_addEventListener: true,
      hook_preventDefault: true,
      hook_set_returnValue: true,
      add_css: true
    }
  };
  // 站点模式与存储
  var MODES = { standard: 'standard', light: 'light', friendly: 'friendly', disabled: 'disabled' };
  var MODE_LABELS = { standard: '标准模式', light: '轻量模式', friendly: '友好模式', disabled: '禁用' };
  var siteModes = GM_getValue('site_modes', {});
  function getSiteMode(host) {
    return siteModes[host] || '';
  }
  function setSiteMode(host, mode) {
    siteModes[host] = mode;
    GM_setValue('site_modes', siteModes);
  }
  // 预设友好模式的常见视频网站后缀
  var FRIENDLY_SUFFIXES = [
    'bilibili.com', 'iqiyi.com', 'youku.com', 'v.qq.com', 'video.qq.com',
    'mgtv.com', 'acfun.cn', 'sohu.com', 'tv.sohu.com', 'pptv.com',
    'le.com', 'tudou.com', 'youtube.com'
  ];
  function getDefaultModeForHost(host) {
    for (var i = 0; i < FRIENDLY_SUFFIXES.length; i++) {
      var suf = FRIENDLY_SUFFIXES[i];
      if (host === suf || host.slice(-suf.length - 1) === '.' + suf || host.slice(-suf.length) === suf) {
        return MODES.friendly;
      }
    }
    return '';
  }
  // 域名列表（增加用户排除列表存储）
  var lists = {
    // 用户自定义排除列表
    // 基础黑名单（不可删除） + 用户自定义排除列表
    base_blacklist: GM_getValue('base_blacklist', [
      'youtube.com',
      'wikipedia.org',
      'mail.qq.com',
      'translate.google.com'
    ]),
    // 保留给规则匹配的黑名单（正则表达式），默认为空
    black_list: [],
    // 合并后的排除列表（仅用于显示）
    exclude_list: function() {
      return this.base_blacklist.concat(GM_getValue('exclude_list', []))
        .filter((v, i, a) => a.indexOf(v) === i);
    }
  };

  // 要处理的 event 列表
  var hook_eventNames, unhook_eventNames, eventNames;
  // 全局状态（供弹窗展示）
  var g_currentMode = 'standard';
  var g_rule = null;
  // 储存名称
  var storageName = getRandStr('qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM', parseInt(Math.random() * 12 + 8));
  // 储存被 Hook 的函数
  var EventTarget_addEventListener = EventTarget.prototype.addEventListener;
  var document_addEventListener = document.addEventListener;
  var Event_preventDefault = Event.prototype.preventDefault;
  var originalReturnValueDescriptor = Object.getOwnPropertyDescriptor(Event.prototype, 'returnValue');

  // Hook addEventListener proc
  function addEventListener(type, func, useCapture) {
    var _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
    if(hook_eventNames.indexOf(type) >= 0) {
      _addEventListener.apply(this, [type, returnTrue, useCapture]);
    } else if(this && unhook_eventNames.indexOf(type) >= 0) {
      var funcsName = storageName + type + (useCapture ? 't' : 'f');

      if(this[funcsName] === undefined) {
        this[funcsName] = [];
        _addEventListener.apply(this, [type, useCapture ? unhook_t : unhook_f, useCapture]);
      }

      this[funcsName].push(func);
    } else {
      _addEventListener.apply(this, arguments);
    }
  }

  // 清理循环
  function clearLoop() {
    var elements = getElements();

    for(var i in elements) {
      for(var j in eventNames) {
        var name = 'on' + eventNames[j];
        if(elements[i][name] !== null && elements[i][name] !== onxxx) {
          if(unhook_eventNames.indexOf(eventNames[j]) >= 0) {
            elements[i][storageName + name] = elements[i][name];
            elements[i][name] = onxxx;
          } else {
            elements[i][name] = null;
          }
        }
      }
    }
  }
  // 使用 MutationObserver 增量清理 DOM0 事件
  function cleanseElement(root) {
    if(!root) return;
    var nodes = [root];
    if(root.querySelectorAll) {
      nodes = nodes.concat(Array.prototype.slice.call(root.querySelectorAll('*')));
    }
    for(var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      for(var j in eventNames) {
        var evt = eventNames[j];
        var name = 'on' + evt;
        if(el[name] !== null && el[name] !== onxxx) {
          if(unhook_eventNames.indexOf(evt) >= 0) {
            el[storageName + name] = el[name];
            el[name] = onxxx;
          } else {
            el[name] = null;
          }
        }
      }
    }
  }

  function setupDom0Cleaner() {
    cleanseElement(document);
    try {
      var observer = new MutationObserver(function(mutations) {
        for(var i = 0; i < mutations.length; i++) {
          var m = mutations[i];
          for(var k = 0; k < m.addedNodes.length; k++) {
            var node = m.addedNodes[k];
            if(node && node.nodeType === 1) {
              cleanseElement(node);
            }
          }
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      window.addEventListener('load', function() { cleanseElement(document); }, true);
    } catch(e) {
      // 降级到原循环
      setInterval(clearLoop, 30 * 1000);
      setTimeout(clearLoop, 2500);
      window.addEventListener('load', clearLoop, true);
      clearLoop();
    }
  }

  // 轻量模式：仅在捕获阶段阻断常见拦截事件的传播
  function enableLightModeCapture() {
    var captureTypes = ['contextmenu', 'copy', 'cut', 'selectstart', 'dragstart'];
    function stopAll(e) {
      e.stopImmediatePropagation();
      e.stopPropagation();
    }
    for(var i = 0; i < captureTypes.length; i++) {
      var t = captureTypes[i];
      window.addEventListener(t, stopAll, true);
      document.addEventListener(t, stopAll, true);
    }
  }

  // 返回true的函数
  function returnTrue(e) {
    return true;
  }
  function unhook_t(e) {
    return unhook(e, this, storageName + e.type + 't');
  }
  function unhook_f(e) {
    return unhook(e, this, storageName + e.type + 'f');
  }
  function unhook(e, self, funcsName) {
    var list = self[funcsName];
    for(var i in list) {
      list[i](e);
    }

    e.returnValue = true;
    return true;
  }
  function onxxx(e) {
    var name = storageName + 'on' + e.type;
    this[name](e);

    e.returnValue = true;
    return true;
  }

  // 获取随机字符串
  function getRandStr(chs, len) {
    var str = '';

    while(len--) {
      str += chs[parseInt(Math.random() * chs.length)];
    }

    return str;
  }

  // 获取所有元素 包括document
  function getElements() {
    var elements = Array.prototype.slice.call(document.getElementsByTagName('*'));
    elements.push(document);

    return elements;
  }

  // 添加css
  function addStyle(css) {
    var style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  // 获取目标域名应该使用的规则
  function getRule(url) {
    function testUrl(list, url) {
      for(var i in list) {
        if(list[i].test(url)) {
          return true;
        }
      }

      return false;
    }

    if(testUrl(lists.black_list, url)) {
      return rules.black_rule;
    }

    return rules.default_rule;
  }

  // 初始化（始终注册菜单）
  function init() {
    // 注册菜单项
    const isExcluded = lists.exclude_list().includes(location.host);
    // 计算当前模式（即使被排除也计算，用于菜单显示）
    var host = location.hostname;
    var defaultMode = getDefaultModeForHost(host) || MODES.light;
    var currentModeForMenu = isExcluded ? MODES.disabled : (getSiteMode(host) || defaultMode);
    g_currentMode = currentModeForMenu;
    g_rule = rules.default_rule;

    GM_registerMenuCommand(`当前网站：${isExcluded ? '❌' : '✔️'}`, () => {
      const currentList = lists.exclude_list();
      const newList = isExcluded
        ? currentList.filter(h => h !== location.host)
        : [...currentList, location.host];
      GM_setValue('exclude_list', newList);
      window.location.reload();
    });

    // 状态显示弹窗
    GM_registerMenuCommand('📜 当前状态', () => {
      createPopup();
    });

    // 菜单：显示/切换模式（打开面板），始终注册，并使用中文标签
    GM_registerMenuCommand(`站点模式：${MODE_LABELS[currentModeForMenu] || currentModeForMenu}`, () => { createPopup(); });

    // 如果当前网站在排除列表中则不执行后续逻辑
    if (isExcluded) { g_currentMode = MODES.disabled; g_rule = rules.default_rule; return; }
    // 获取当前域名的规则
    var url = window.location.host + window.location.pathname;
    var rule = getRule(url);
    // host/defaultMode 已在上面计算
    var currentMode = getSiteMode(host) || defaultMode;
    g_currentMode = currentMode;
    g_rule = rule;

    // 按模式调整策略
    if (currentMode === MODES.disabled) {
      return; // 完全不影响页面
    } else if (currentMode === MODES.friendly) {
      rule.unhook_eventNames = "";
      rule.hook_addEventListener = false;
      rule.hook_preventDefault = false;
      rule.hook_set_returnValue = false;
      rule.dom0 = false;
      rule.hook_eventNames = "";
      // 仅保留 CSS 放行
    } else if (currentMode === MODES.light) {
      rule.unhook_eventNames = "";
      rule.hook_addEventListener = false;
      rule.hook_preventDefault = false;
      rule.hook_set_returnValue = false;
      rule.dom0 = false;
      enableLightModeCapture();
    }

    // 设置 event 列表
    hook_eventNames = rule.hook_eventNames.split("|").filter(Boolean);
    // TODO Allowed to return value
    unhook_eventNames = rule.unhook_eventNames.split("|").filter(Boolean);
    eventNames = hook_eventNames.concat(unhook_eventNames);

    // 调用清理 DOM0 event 方法的循环
    if(rule.dom0) {
      setupDom0Cleaner();
    }

    // hook addEventListener
    if(rule.hook_addEventListener) {
      EventTarget.prototype.addEventListener = addEventListener;
      document.addEventListener = addEventListener;
    }

    // hook preventDefault
    if(rule.hook_preventDefault) {
      Event.prototype.preventDefault = function() {
        if(eventNames.indexOf(this.type) < 0) {
          Event_preventDefault.apply(this, arguments);
        }
      };
    }

    // Hook set returnValue
    if(rule.hook_set_returnValue) {
      try {
        Object.defineProperty(Event.prototype, 'returnValue', {
          configurable: true,
          enumerable: false,
          set: function(v) {
            if(eventNames.indexOf(this.type) >= 0 && v !== true) {
              return; // 忽略将其设为 false 的尝试
            }
            if(originalReturnValueDescriptor && originalReturnValueDescriptor.set) {
              originalReturnValueDescriptor.set.call(this, v);
            }
          },
          get: function() {
            if(originalReturnValueDescriptor && originalReturnValueDescriptor.get) {
              return originalReturnValueDescriptor.get.call(this);
            }
            return true;
          }
        });
      } catch(e) {
        // 退回旧方案
        Event.prototype.__defineSetter__('returnValue', function() {
          if(this.returnValue !== true && eventNames.indexOf(this.type) >= 0) {
            this.returnValue = true;
          }
        });
      }
    }

    console.debug('url: ' + url, 'storageName：' + storageName, 'rule: ' + rule.name);

    // 添加CSS
    if(rule.add_css) {
        addStyle(`
          html, * {
            -webkit-user-select:text!important;
            -moz-user-select:text!important;
            user-select:text!important;
            -ms-user-select:text!important;
            -khtml-user-select:text!important;
          }

          /* 悬浮窗样式 - 紧凑版 + 赞赏码居中（白色背景版） */
          #rml-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 480px; /* 略微缩窄，减少留白 */
            min-height: 320px; /* 再降低最小高度，减少整体高度 */
            padding: 0;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.16);
            z-index: 9999;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            backdrop-filter: blur(10px);
            touch-action: none;
            overflow: hidden;
            color: #222222;
            transition: box-shadow 0.2s, height 0.3s ease;
          }

          #rml-popup:hover {
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), 0 12px 32px rgba(0, 0, 0, 0.4);
          }

          #rml-popup .mac-header {
            cursor: grab;
          }

          #rml-popup .mac-header:active {
            cursor: grabbing;
          }

          #rml-popup * {
            user-select: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
          }

          #rml-popup:active {
            cursor: grabbing;
          }

          .mac-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px; /* 缩紧头部内边距 */
            border-bottom: 1px solid #e0e0e0;
            background: #ffffff; /* 去掉渐变，减小色差 */
            min-height: 44px; /* 降低头部高度 */
            box-sizing: border-box;
          }

          .window-controls {
            position: absolute;
            top: 12px;
            left: 16px;
            display: flex;
            gap: 6px; /* 缩紧按钮间距 */
            z-index: 10;
          }

          .control-btn {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: transparent;
            transition: transform 0.2s, opacity 0.2s;
            padding: 0;
            line-height: 1;
          }

          .close-btn { background-color: #ff5f57; }
          .min-btn { background-color: #ffbd2e; }
          .max-btn { background-color: #28c941; }

          .control-btn:hover {
            transform: scale(1.15);
            opacity: 0.9;
          }

          #rml-popup .content-wrapper {
            padding: 12px 16px; /* 大幅缩紧内边距，减少留白 */
            max-height: calc(100vh - 70px);
            overflow-y: auto;
          }

          #rml-popup .content-wrapper::-webkit-scrollbar {
            width: 6px; /* 缩紧滚动条宽度 */
          }

          #rml-popup .content-wrapper::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
          }

          #rml-popup .content-wrapper::-webkit-scrollbar-track {
            background: #f5f5f5;
          }

          .card-title {
            font-size: 14px; /* 缩小标题字体 */
            font-weight: bold;
            margin: 0 0 6px; /* 缩紧标题下边距 */
            color: #111111;
          }

          .card-description {
            font-size: 12px; /* 缩小描述字体 */
            color: #555555;
            margin-bottom: 8px; /* 缩紧描述下边距 */
            line-height: 1.3; /* 缩小行高 */
          }

          .card-tag {
            display: inline-block;
            font-size: 10px;
            border-radius: 4px;
            background-color: #f5f5f5;
            padding: 2px 6px; /* 缩紧标签内边距 */
            margin-bottom: 6px; /* 缩紧标签下边距 */
            color: #555555;
            border: 1px solid #e0e0e0;
          }

          .code-editor {
            background-color: #f8f8f8;
            color: #222222;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", monospace;
            font-size: 11px; /* 缩小编辑器字体 */
            line-height: 1.4; /* 缩小行高 */
            border-radius: 4px;
            padding: 8px; /* 缩紧编辑器内边距 */
            overflow: auto;
            border: 1px solid #e0e0e0;
            margin-bottom: 8px; /* 缩紧编辑器下边距 */
          }

          .collapsed {
            height: 44px !important;
            min-height: 44px !important;
            overflow: hidden;
            opacity: 0.95;
          }

          .collapsed .content-wrapper {
            display: none !important;
          }

          .collapsed .mac-header {
            border-bottom: none;
            padding: 10px 16px;
          }

          /* 赞赏码样式 - 141x140原尺寸 + 居中展示 */
          .appreciation-area {
            width: 100%;
            text-align: center;
            margin-bottom: 10px; /* 缩紧赞赏码下边距 */
          }

          .appreciation-code {
            width: 141px;
            height: 140px;
            background-image: url("data:image/jpeg;base64,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");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            border: none; /* 去掉边框，保持纯净的赞赏码样式 */
            border-radius: 0;
            margin: 0 auto 3px; /* 水平居中，缩紧与文字间距 */
            display: block;
          }

          .appreciation-tip {
            font-size: 10px;
            color: #999;
            white-space: nowrap;
          }

          /* 状态面板 - 紧凑布局 */
          .status-panel {
            flex: 1;
            min-height: 260px; /* 再降低最小高度，减少垂直空白 */
          }

          /* 设置面板 - 紧凑布局 + 底部功能区域 */
          .settings-panel {
            flex: 1;
            border-left: 1px solid #e0e0e0;
            padding-left: 14px; /* 略微收紧左侧内边距 */
            min-height: 260px; /* 再降低最小高度，减少垂直空白 */
            display: flex;
            flex-direction: column;
          }

          .settings-panel-main {
            flex: 0 0 auto;
          }

          .features-footer {
            margin-top: auto;
            text-align: left;
          }

          .features-footer-title {
            font-size: 12px;
            color: #333333;
            margin-bottom: 4px;
          }

          .features-footer .code-editor {
            margin-bottom: 0;
          }
        `);
    }

  // 创建控制弹窗
  function createPopup() {
    // 创建容器并添加控制按钮
    const container = document.createElement('div');
    container.id = 'rml-popup';
    const modeLabelMap = { standard: '标准模式', light: '轻量模式', friendly: '友好模式', disabled: '禁用' };
    const modeLabel = modeLabelMap[g_currentMode] || g_currentMode || '标准模式';
    const captureList = ['contextmenu','copy','cut','selectstart','dragstart'];
    const EVENT_LABELS = {
      contextmenu: '右键菜单',
      copy: '复制',
      cut: '剪切',
      select: '文本选择',
      selectstart: '选择开始',
      dragstart: '拖拽开始',
      keydown: '按键按下',
      keyup: '按键抬起',
      mousedown: '鼠标按下',
      mouseup: '鼠标抬起'
    };
    function labelEvent(name){ return EVENT_LABELS[name] || name; }
    function mapEvents(list){ return (list && list.length) ? list.map(labelEvent).join('，') : '无'; }
    let processedEventsText = '';
    if (g_currentMode === MODES.light) {
      processedEventsText = mapEvents(captureList);
    } else if (g_currentMode === MODES.friendly) {
      processedEventsText = '无（仅 CSS 放行）';
    } else if (g_currentMode === MODES.disabled) {
      processedEventsText = '无（已禁用）';
    } else {
      processedEventsText = mapEvents(eventNames || []);
    }
    let featureList = [];
    if (g_currentMode === MODES.disabled) {
      featureList = ['已禁用'];
    } else if (g_currentMode === MODES.friendly) {
      if (g_rule && g_rule.add_css) featureList.push('CSS 放行选择');
      featureList.push('最小侵入（不 Hook 事件）');
    } else if (g_currentMode === MODES.light) {
      if (g_rule && g_rule.add_css) featureList.push('CSS 放行选择');
      featureList.push('捕获期阻断常见拦截事件');
    } else {
      // 标准模式
      if (g_rule && g_rule.add_css) featureList.push('CSS 放行选择');
      if (g_rule && g_rule.hook_addEventListener) featureList.push('Hook addEventListener');
      if (g_rule && g_rule.hook_preventDefault) featureList.push('过滤 preventDefault');
      if (g_rule && g_rule.hook_set_returnValue) featureList.push('保护 returnValue');
      if (g_rule && g_rule.dom0) featureList.push('清理内联 on* 事件');
    }
    const featuresText = featureList.join('、');
    container.innerHTML = `
      <div class="mac-header">
        <div class="window-controls">
          <span class="control-btn red close-btn"></span>
          <span class="control-btn yellow min-btn"></span>
          <span class="control-btn green max-btn"></span>
        </div>
      </div>
      <div class="content-wrapper">
        <div style="display: flex; gap: 12px; width: 100%;"> <!-- 缩紧面板间距 -->
          <!-- 左侧状态面板（赞赏码居中） -->
          <div class="status-panel">
            <!-- 赞赏码居中区域 -->
            <div class="appreciation-area">
              <div class="appreciation-code"></div>
              <div class="appreciation-tip">感谢赞赏</div>
            </div>

            <!-- 核心状态内容 -->
            <div class="status-content">
              <div class="card-title">当前状态</div>
              <div class="card-tag">运行中</div>
              <div class="card-description">
                <div style="margin-bottom: 6px;">
                  <strong style="color: #333333;">📌 当前模式：</strong>
                  <span style="color: #28c941; font-weight: 600;">${modeLabel}</span>
                </div>
                <div style="margin-bottom: 6px;">
                  <strong style="color: #333333;">✅ 已处理事件：</strong>
                  <div class="code-editor" style="height: auto; min-height: 40px; margin-top: 4px;">
                    ${processedEventsText}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧设置面板（紧凑版，功能放到底部右侧） -->
          <div class="settings-panel">
            <div class="settings-panel-main">
              <div class="card-title">站点设置</div>
              <div style="margin-bottom: 10px;">
                <div class="card-description" style="margin-bottom: 4px; font-size: 11px;">当前域名模式：</div>
                <div style="display:flex; gap:6px; align-items:center; margin-bottom: 6px;">
                  <select id="siteModeSelect" style="flex:1; padding:5px 8px; background:#ffffff; color:#333333; border:1px solid #d0d0d0; border-radius:4px; font-size: 11px; cursor: pointer;">
                    <option value="standard">标准模式</option>
                    <option value="light">轻量模式</option>
                    <option value="friendly">友好模式</option>
                    <option value="disabled">禁用</option>
                  </select>
                  <button id="saveModeBtn" style="padding:5px 8px; background:#28c941; border:none; border-radius:4px; color:#fff; cursor:pointer; font-size: 11px; font-weight: 500; white-space: nowrap;">保存</button>
                </div>
              </div>
              <div class="card-title" style="margin-top: 10px; margin-bottom: 6px;">排除设置</div>
              <div>
                <div class="card-description" style="margin-bottom: 4px; font-size: 11px;">已排除域名（每行一个）:</div>
                <textarea id="excludeDomains"
                    class="code-editor"
                    style="width: 100%;
                           height: 80px; /* 缩紧文本框高度 */
                           padding: 8px;
                           margin-bottom: 6px;
                           resize: vertical;
                           font-size: 10px;"
                    placeholder="输入要排除的域名，每行一个"
                    spellcheck="false">${lists.exclude_list().join('\n')}</textarea>
                <button id="saveExcludeList"
                    style="padding:5px 8px;
                           background: #28c941;
                           border: none;
                           border-radius: 4px;
                           color: #fff;
                           cursor: pointer;
                           font-size: 11px;
                           font-weight: 500;
                           width: 100%;">
                    保存排除列表
                </button>
              </div>
            </div>
            <div class="features-footer">
              <div class="features-footer-title">🧩 实现的功能</div>
              <div class="code-editor" style="height: auto; min-height: 36px; margin-top: 4px;">
                ${featuresText}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
     // 添加容器到文档中
    document.body.appendChild(container);

    // 初始化站点模式下拉框
    (function initModeSelect(){
      var modeSelect = container.querySelector('#siteModeSelect');
      if(modeSelect) {
        try {
          var host = location.host;
          var currentMode = getSiteMode(host) || getDefaultModeForHost(host) || MODES.light;
          modeSelect.value = currentMode;
        } catch(e) {}
      }
    })();

    // 保存站点模式
    var saveModeBtn = container.querySelector('#saveModeBtn');
    if (saveModeBtn) {
      saveModeBtn.addEventListener('click', function() {
        var modeSelect = container.querySelector('#siteModeSelect');
        var val = modeSelect ? modeSelect.value : 'standard';
        setSiteMode(location.host, val);
        window.location.reload();
      });
    }

    // 添加保存事件监听
    document.getElementById('saveExcludeList').addEventListener('click', () => {
        const domains = document.getElementById('excludeDomains').value
            .split('\n')
            .map(d => d.trim())
            .filter(d => d.length > 0);

        // 分离基础黑名单和用户自定义列表
        const baseEntries = domains.filter(d => lists.base_blacklist.includes(d));
        const customEntries = domains.filter(d => !lists.base_blacklist.includes(d));

        GM_setValue('base_blacklist', baseEntries);
        GM_setValue('exclude_list', customEntries);
        window.location.reload();
    });

    // 窗口控制功能
    let isMaximized = false;
    let originalSize = { width: '500px', height: 'auto' }; // 同步紧凑宽度

    container.querySelector('.min-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      container.classList.toggle('collapsed');
    });

    container.querySelector('.max-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isMaximized) {
        originalSize = {
          width: container.style.width || '500px',
          height: container.style.height || 'auto'
        };
        container.style.width = '95vw';
        container.style.height = '95vh';
        isMaximized = true;
      } else {
        container.style.width = originalSize.width;
        container.style.height = originalSize.height;
        isMaximized = false;
      }
    });

    container.querySelector('.close-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      container.remove();
    });

    // 优化后的拖拽功能
    let isDragging = false;
    let startX, startY, initialX, initialY;
    let hasBeenDragged = false;

    const handleMouseDown = (e) => {
      // 排除按钮、输入框、文本区域、赞赏码等元素
      if (e.target.closest('button') ||
          e.target.closest('select') ||
          e.target.closest('textarea') ||
          e.target.closest('input') ||
          e.target.closest('.window-controls') ||
          e.target.closest('.appreciation-area')) {
        return;
      }
      // 只允许通过mac-header区域拖拽
      if (e.target.closest('.mac-header')) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = container.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        container.style.transition = 'none';
        // 如果还没有拖拽过，移除transform居中
        if (!hasBeenDragged) {
          container.style.transform = 'none';
          container.style.left = `${initialX}px`;
          container.style.top = `${initialY}px`;
        }
      }
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newX = initialX + dx;
      let newY = initialY + dy;

      // 边界检测，保持在视口内
      const maxX = window.innerWidth - container.offsetWidth;
      const maxY = window.innerHeight - container.offsetHeight;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      container.style.left = `${newX}px`;
      container.style.top = `${newY}px`;
      hasBeenDragged = true;
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      container.style.transition = '';
    };

    container.querySelector('.mac-header').addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);
  }
  }

  // 确保在DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
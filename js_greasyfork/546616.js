// ==UserScript==
// @name         One Token 变量替换
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  替换 MasterGo 代码生成的结果为 oneToken 变量
// @author       燕修
// @match        https://mgdone.alibaba-inc.com/file/*
// @license MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @grant GM_setValue
// @grant GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/546616/One%20Token%20%E5%8F%98%E9%87%8F%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/546616/One%20Token%20%E5%8F%98%E9%87%8F%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new(P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      }
      catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      }
      catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
let $window;
try {
  $window = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
}
catch (e) {
  $window = window;
}
// 显示插件迁移提示
function showPluginMigrationNotice() {
  // 检查是否已显示过提示（24小时内不重复显示）
  const lastShownTime = GM_getValue('onetoken-migration-notice', '0');
  const currentTime = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  if (lastShownTime && (currentTime - parseInt(lastShownTime)) < twentyFourHours) {
    return;
  }
  // 创建提示框容器
  const noticeContainer = document.createElement('div');
  noticeContainer.id = 'onetoken-migration-notice';
  noticeContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  `;
  // 创建提示框内容
  const noticeBox = document.createElement('div');
  noticeBox.style.cssText = `
    background: white;
    padding: 32px;
    border-radius: 16px;
    max-width: 480px;
    width: 90%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    text-align: center;
    position: relative;
  `;
  noticeBox.innerHTML = `
    <div style="margin-bottom: 20px;">
      <img src="https://mdn.alipayobjects.com/huamei_ilyixz/afts/img/efrvSa-2slAAAAAAQMAAAAgADqR4AQFr/original" style="height: 64px; margin-bottom: 16px;" alt="升级图标" />
      <h2 style="margin: 0 0 8px; color: #333; font-size: 24px; font-weight: 600;">
        功能已升级到 Chrome 插件！
      </h2>
      <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.5;">
        为了提供更好的用户体验和更稳定的功能，OneToken 已经迁移到 Chrome 插件版本
      </p>
    </div>

    <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: left;">
      <h3 style="margin: 0 0 12px; color: #333; font-size: 16px; font-weight: 600;">✨ 插件版本优势：</h3>
      <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.6;">
        <li>更稳定可靠的运行环境</li>
        <li>自动更新，无需手动维护脚本</li>
        <li>更好的性能和兼容性</li>
        <li>更多实用功能持续更新</li>
      </ul>
    </div>

    <div style="display: flex; gap: 12px; margin-top: 24px;">
      <button id="install-plugin-btn" style="
        flex: 1;
        padding: 12px 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      ">
        🔗 安装 Chrome 插件
      </button>
      <button id="continue-script-btn" style="
        flex: 1;
        padding: 12px 24px;
        background: #e9ecef;
        color: #666;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      ">
        暂时继续使用脚本
      </button>
    </div>

    <p style="margin: 16px 0 0; color: #999; font-size: 12px;">
      此提示 24 小时内不会重复显示
    </p>
  `;
  // 添加悬停效果
  const installBtn = noticeBox.querySelector('#install-plugin-btn');
  const continueBtn = noticeBox.querySelector('#continue-script-btn');
  if (installBtn) {
    installBtn.addEventListener('mouseenter', () => {
      installBtn.style.transform = 'translateY(-2px)';
      installBtn.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
    });
    installBtn.addEventListener('mouseleave', () => {
      installBtn.style.transform = 'translateY(0)';
      installBtn.style.boxShadow = 'none';
    });
    installBtn.addEventListener('click', () => {
      // 打开插件安装页面
      window.open('https://chrome.google.com/u/2/webstore/devconsole/c73347d7-add2-4104-8acd-8e24f6a72019', '_blank');
      closeNotice();
    });
  }
  if (continueBtn) {
    continueBtn.addEventListener('mouseenter', () => {
      continueBtn.style.background = '#dee2e6';
    });
    continueBtn.addEventListener('mouseleave', () => {
      continueBtn.style.background = '#e9ecef';
    });
    continueBtn.addEventListener('click', () => {
      closeNotice();
    });
  }

  function closeNotice() {
    // 记录显示时间
    GM_setValue('onetoken-migration-notice', currentTime.toString());
    // 移除提示框
    noticeContainer.remove();
  }
  // 点击背景关闭
  noticeContainer.addEventListener('click', (e) => {
    if (e.target === noticeContainer) {
      closeNotice();
    }
  });
  // 添加到页面
  noticeContainer.appendChild(noticeBox);
  document.body.appendChild(noticeContainer);
}

function init() {
  const timer = setInterval(() => {
    if ($window.mg) {
      clearInterval(timer);
      console.log("[oneToken]初始化成功", $window.mg);
      main();
      // 显示插件迁移提示
      showPluginMigrationNotice();
      // 初始化URL变化监听
      setupUrlChangeListener();
    }
  }, 1000);
  return timer;
}
// URL变化监听函数
function setupUrlChangeListener() {
  let currentPath = location.pathname;
  let currentSearch = location.search;
  // 使用MutationObserver监听DOM变化，以防某些框架通过其他方式改变URL
  const observer = new MutationObserver(() => {
    if (location.pathname !== currentPath) {
      currentPath = location.pathname;
      if (currentPath.includes('/file/')) {
        console.log('[oneToken]更换设计稿,重新渲染:', currentPath);
        init();
      }
    }
    if (location.search !== currentSearch) {
      currentSearch = location.search;
      const devMode = currentSearch.includes('devMode=true');
      $window.oneToken.isDevMode = devMode;
      if (devMode) {
        handleCodeReplace();
      }
    }
  });
  // 监听document的变化
  observer.observe(document, {
    childList: true,
    subtree: true
  });
}
init();
// 防重复执行的时间戳
let lastProcessTime = 0;
const MIN_PROCESS_INTERVAL = 500; // 最小间隔500ms
// 核心代码处理逻辑
function processCodeElements() {
  var _a;
  const currentTime = Date.now();
  // 防止短时间内重复执行
  if (currentTime - lastProcessTime < MIN_PROCESS_INTERVAL) {
    return false;
  }
  lastProcessTime = currentTime;
  // 检查OneToken功能是否启用
  if (!((_a = $window.oneToken) === null || _a === void 0 ? void 0 : _a.isEnabled)) {
    return false;
  }
  // 直接查询DOM元素并检查准备状态
  const style = $window.document.querySelector('#code-block-box__style');
  const text = $window.document.querySelector('#code-block-box__typography');
  // 检测代码块DOM状态
  if (!style && !text) {
    return false;
  }
  // 处理找到的元素
  if (style) {
    parseCssFromDom(style);
  }
  if (text) {
    parseCssFromDom(text);
  }
  changeCodeBlockButton();
  return true;
}

function getPageCode(selectionLayerIds) {
  console.log("[oneToken]切换选中元素", selectionLayerIds);
  handleCodeReplace();
}
// 智能模式检测和处理
function handleCodeReplace() {
  return __awaiter(this, void 0, void 0, function* () {
    if ($window.oneToken.isDevMode) {
      yield waitForCodeBlockAndProcess();
    }
  });
}
// 等待代码块准备好并执行处理
function waitForCodeBlockAndProcess() {
  return __awaiter(this, void 0, void 0, function* () {
    yield new Promise(resolve => setTimeout(resolve, 100));
    const maxAttempts = 3;
    const checkInterval = 200;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      // 直接调用processCodeElements，它已经包含了检查逻辑
      if (processCodeElements()) {
        return;
      }
      if (attempt < maxAttempts) {
        yield new Promise(resolve => setTimeout(resolve, checkInterval));
      }
    }
  });
}

function main() {
  $window.oneToken = {
    isEnabled: true, // 默认开启
    isDevMode: location.search.includes('devMode=true'),
  };
  $window.mg.off('selectionchange', getPageCode);
  $window.mg.on('selectionchange', getPageCode);
  // 创建或更新悬浮窗
  createToggleButton();
  // 延迟初始化，确保DOM加载完成
  setTimeout(() => {
    initializeCodeBlocks();
  }, 500);
}
// 初始化代码块处理
function initializeCodeBlocks() {
  // 检查是否有代码块存在
  const blocks = $window.document.querySelectorAll('.copy-block');
  if (blocks.length > 0) {
    processCodeElements();
  }
  else {
    // 如果没有代码块，再等一会儿重试
    setTimeout(initializeCodeBlocks, 2000);
  }
}

function copyNewCode(block) {
  setTimeout(() => {
    const lines = Array.from(block.querySelectorAll('.code-line'));
    if (lines.length > 0) {
      const codeLines = lines.map((line) => {
        return line.textContent || '';
      });
      navigator.clipboard.writeText(codeLines.filter(line => line.trim()).join('\n'));
    }
  }, 300);
}

function changeCodeBlockButton() {
  const blocks = $window.document.querySelectorAll('.copy-block');
  blocks.forEach(block => {
    const originButton = block.querySelector('.copy-block__title div');
    if (originButton) {
      // 检查是否已经处理过这个按钮
      if (!originButton.hasAttribute('data-one-token-processed')) {
        originButton.setAttribute('data-one-token-processed', 'true');
        originButton.addEventListener('click', () => {
          copyNewCode(block);
        });
      }
    }
  });
}

function parseCssFromDom(dom) {
  if (!dom) {
    return [];
  }
  const codeLines = dom.querySelectorAll('.code-line');
  const structuredData = [];
  const replaceTask = [];
  codeLines.forEach((line, index) => {
    var _a;
    const isComment = line.querySelector('.comment');
    const hasProperty = line.querySelector('.token.property');
    if (isComment || !hasProperty) {
      const value = line.textContent || '';
      structuredData.push({
        type: 'comment',
        key: '',
        value: value,
        line: index,
      });
      const mappedValue = COMMENT_VAR_MAP[value];
      if (mappedValue) {
        replaceTask.push({
          mapComment: value,
          line: index + 1,
          value: mappedValue,
        });
      }
    }
    else {
      const propertyElement = hasProperty;
      const punctuationElements = line.querySelectorAll('.token.punctuation');
      if (propertyElement && punctuationElements.length > 0) {
        const property = propertyElement.textContent || '';
        let value = line.textContent || '';
        value = value.replace(property, '').trim();
        if (punctuationElements.length > 0) {
          const firstPunctuation = ((_a = punctuationElements[0]) === null || _a === void 0 ? void 0 : _a.textContent) || ':';
          const punctuationIndex = value.indexOf(firstPunctuation);
          value = value.substring(punctuationIndex + 1).trim();
        }
        structuredData.push({
          type: 'code',
          key: property,
          value: value,
          line: index,
        });
      }
    }
  });
  replaceTask.forEach((item) => {
    var _a;
    let codeLine = item.line;
    let searchAttempts = 0;
    const maxSearchAttempts = 10;
    while (structuredData[codeLine] && searchAttempts < maxSearchAttempts) {
      searchAttempts++;
      if (structuredData[codeLine].type === 'comment') {
        codeLine++;
        continue;
      }
      else {
        structuredData[codeLine].value = item.value;
        break;
      }
    }
    if (searchAttempts >= maxSearchAttempts) {
      return;
    }
    const line = codeLines[codeLine];
    if (line) {
      const propertyElement = line.querySelector('.token.property');
      const property = ((_a = propertyElement === null || propertyElement === void 0 ? void 0 : propertyElement.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
      if (property.includes('font')) {
        const fontLetterSpacing = COMMENT_VAR_MAP[`${item.mapComment}-letter-spacing`] || '';
        const font = item.value;
        replaceFont(codeLines, codeLine, font, fontLetterSpacing);
      }
      else {
        replaceLineContent(line, property, item.value);
      }
    }
  });
  return structuredData;
}

function replaceFont(codeLines, codeLine, font, fontLetterSpacing) {
  var _a;
  let lineCount = codeLine;
  let replaceCount = 0;
  const maxLines = 20;
  let processedLines = 0;
  while (codeLines[lineCount] && processedLines < maxLines) {
    processedLines++;
    const line = codeLines[lineCount];
    const propertyElement = line.querySelector('.token.property');
    const property = ((_a = propertyElement === null || propertyElement === void 0 ? void 0 : propertyElement.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
    if (property.includes('font') || property.includes('letter-spacing') || property.includes('line-height')) {
      switch (replaceCount) {
        case 0:
          replaceLineContent(line, 'font', font);
          break;
        case 1:
          replaceLineContent(line, 'letter-spacing', fontLetterSpacing);
          break;
        default:
          line.innerHTML = '';
          break;
      }
      replaceCount++;
    }
    else {
      break;
    }
    lineCount++;
  }
}
// 替换整个代码行的内容，使用简单模板
function replaceLineContent(line, property, newValue) {
  if (!line || !property || !newValue) {
    return;
  }
  const newHTML = `<span class="token property">${property}</span><span class="token punctuation">:</span> ${newValue}<span class="token punctuation">;</span>`;
  line.innerHTML = newHTML;
}
const COMMENT_VAR_MAP = {
  "/* primary/primary-背景-页面 */": "var(--color-primary-bg-page)",
  "/* primary/primary-控件填充-不可用 */": "var(--color-primary-control-fill-disabled)",
  "/* primary/primary-背景-页面深 */": "var(--color-primary-bg-page-dark)",
  "/* primary/primary-控件填充-标签 */": "var(--color-primary-control-fill-tag)",
  "/* primary/primary-控件填充-主按钮 */": "var(--color-primary-control-fill-primary)",
  "/* primary/primary-边线-控件按下.激活 */": "var(--color-primary-control-fill-border-active)",
  "/* primary/primary-控件填充-主按钮-按下.激活 */": "var(--color-primary-control-fill-primary-active)",
  "/* primary/primary-控件填充-主按钮-悬停 */": "var(--color-primary-control-fill-primary-hover)",
  "/* primary/primary-背景-页面-浅 */": "var(--color-primary-bg-page-light)",
  "/* primary/primary-控件填充-悬停 */": "var(--color-primary-control-fill-hover)",
  "/* primary/primary-背景-浅色卡片 */": "var(--color-primary-bg-card-light)",
  "/* primary/primary-控件填充-次按钮 */": "var(--color-primary-control-fill-secondary)",
  "/* primary/primary-控件填充-按下.激活 */": "var(--color-primary-control-fill-active)",
  "/* primary/primary-边线-浅 */": "var(--color-primary-border-light)",
  "/* primary/primary-背景-提示块 */": "var(--color-primary-bg-tip)",
  "/* primary/primary-控件填充-次按钮-悬停 */": "var(--color-primary-control-fill-secondary-hover)",
  "/* primary/primary-控件填充-ghost按钮-按下.激活 */": "var(--color-primary-control-fill-ghost-active)",
  "/* primary/primary-控件填充-次按钮-按下.激活 */": "var(--color-primary-control-fill-secondary-active)",
  "/* primary/primary-边线-深 */": "var(--color-primary-border-dark)",
  "/* primary/primary-文本-不可用 */": "var(--color-primary-text-disabled)",
  "/* primary/primary-文本-浅色注释 */": "var(--color-primary-text-light)",
  "/* primary/primary-文本-次要 */": "var(--color-primary-text-secondary)",
  "/* primary/primary-文本-默认 */": "var(--color-primary-text-default)",
  "/* gray/gray-背景-页面 */": "var(--color-gray-bg-page)",
  "/* gray/gray-控件填充-不可用 */": "var(--color-gray-control-fill-disabled)",
  "/* gray/gray-背景-页面深 */": "var(--color-gray-bg-page-dark)",
  "/* gray/gray-控件填充-标签 */": "var(--color-gray-control-fill-tag)",
  "/* gray/gray-控件填充-主按钮 */": "var(--color-gray-control-fill-primary)",
  "/* gray/gray-边线-控件按下.激活 */": "var(--color-gray-control-fill-border-active)",
  "/* gray/gray-控件填充-主按钮-按下.激活 */": "var(--color-gray-control-fill-primary-active)",
  "/* gray/gray-控件填充-主按钮-悬停 */": "var(--color-gray-control-fill-primary-hover)",
  "/* gray/gray-背景-页面-浅 */": "var(--color-gray-bg-page-light)",
  "/* gray/gray-控件填充-悬停 */": "var(--color-gray-control-fill-hover)",
  "/* gray/gray-背景-浅色卡片 */": "var(--color-gray-bg-card-light)",
  "/* gray/gray-控件填充-次按钮 */": "var(--color-gray-control-fill-secondary)",
  "/* gray/gray-控件填充-按下.激活 */": "var(--color-gray-control-fill-active)",
  "/* gray/gray-边线-浅 */": "var(--color-gray-border-light)",
  "/* gray/gray-背景-提示块 */": "var(--color-gray-bg-tip)",
  "/* gray/gray-控件填充-次按钮-悬停 */": "var(--color-gray-control-fill-secondary-hover)",
  "/* gray/gray-控件填充-ghost按钮-按下.激活 */": "var(--color-gray-control-fill-ghost-active)",
  "/* gray/gray-控件填充-次按钮-按下.激活 */": "var(--color-gray-control-fill-secondary-active)",
  "/* gray/gray-边线-深 */": "var(--color-gray-border-dark)",
  "/* gray/gray-文本-不可用 */": "var(--color-gray-text-disabled)",
  "/* gray/gray-文本-浅色注释 */": "var(--color-gray-text-light)",
  "/* gray/gray-文本-次要 */": "var(--color-gray-text-secondary)",
  "/* gray/gray-文本-默认 */": "var(--color-gray-text-default)",
  "/* gray/gray-文本-反色 */": "var(--color-gray-contrast)",
  "/* gray/gray-背景-白色卡片 */": "var(--color-gray-bg-card-white)",
  "/* gray/gray-背景-透明 */": "var(--color-gray-bg-transparent)",
  "/* blue/blue-背景-页面 */": "var(--color-blue-bg-page)",
  "/* blue/blue-控件填充-不可用 */": "var(--color-blue-control-fill-disabled)",
  "/* blue/blue-背景-页面深 */": "var(--color-blue-bg-page-dark)",
  "/* blue/blue-控件填充-标签 */": "var(--color-blue-control-fill-tag)",
  "/* blue/blue-控件填充-主按钮 */": "var(--color-blue-control-fill-primary)",
  "/* blue/blue-边线-控件按下.激活 */": "var(--color-blue-control-fill-border-active)",
  "/* blue/blue-控件填充-主按钮-按下.激活 */": "var(--color-blue-control-fill-primary-active)",
  "/* blue/blue-控件填充-主按钮-悬停 */": "var(--color-blue-control-fill-primary-hover)",
  "/* blue/blue-背景-页面-浅 */": "var(--color-blue-bg-page-light)",
  "/* blue/blue-控件填充-悬停 */": "var(--color-blue-control-fill-hover)",
  "/* blue/blue-背景-浅色卡片 */": "var(--color-blue-bg-card-light)",
  "/* blue/blue-控件填充-次按钮 */": "var(--color-blue-control-fill-secondary)",
  "/* blue/blue-控件填充-按下.激活 */": "var(--color-blue-control-fill-active)",
  "/* blue/blue-边线-浅 */": "var(--color-blue-border-light)",
  "/* blue/blue-背景-提示块 */": "var(--color-blue-bg-tip)",
  "/* blue/blue-控件填充-次按钮-悬停 */": "var(--color-blue-control-fill-secondary-hover)",
  "/* blue/blue-控件填充-ghost按钮-按下.激活 */": "var(--color-blue-control-fill-ghost-active)",
  "/* blue/blue-控件填充-次按钮-按下.激活 */": "var(--color-blue-control-fill-secondary-active)",
  "/* blue/blue-边线-深 */": "var(--color-blue-border-dark)",
  "/* blue/blue-文本-不可用 */": "var(--color-blue-text-disabled)",
  "/* blue/blue-文本-浅色注释 */": "var(--color-blue-text-light)",
  "/* blue/blue-文本-次要 */": "var(--color-blue-text-secondary)",
  "/* blue/blue-文本-默认 */": "var(--color-blue-text-default)",
  "/* red/red-背景-页面 */": "var(--color-red-bg-page)",
  "/* red/red-控件填充-不可用 */": "var(--color-red-control-fill-disabled)",
  "/* red/red-背景-页面深 */": "var(--color-red-bg-page-dark)",
  "/* red/red-控件填充-标签 */": "var(--color-red-control-fill-tag)",
  "/* red/red-控件填充-主按钮 */": "var(--color-red-control-fill-primary)",
  "/* red/red-边线-控件按下.激活 */": "var(--color-red-control-fill-border-active)",
  "/* red/red-控件填充-主按钮-按下.激活 */": "var(--color-red-control-fill-primary-active)",
  "/* red/red-控件填充-主按钮-悬停 */": "var(--color-red-control-fill-primary-hover)",
  "/* red/red-背景-页面-浅 */": "var(--color-red-bg-page-light)",
  "/* red/red-控件填充-悬停 */": "var(--color-red-control-fill-hover)",
  "/* red/red-背景-浅色卡片 */": "var(--color-red-bg-card-light)",
  "/* red/red-控件填充-次按钮 */": "var(--color-red-control-fill-secondary)",
  "/* red/red-控件填充-按下.激活 */": "var(--color-red-control-fill-active)",
  "/* red/red-边线-浅 */": "var(--color-red-border-light)",
  "/* red/red-背景-提示块 */": "var(--color-red-bg-tip)",
  "/* red/red-控件填充-次按钮-悬停 */": "var(--color-red-control-fill-secondary-hover)",
  "/* red/red-控件填充-ghost按钮-按下.激活 */": "var(--color-red-control-fill-ghost-active)",
  "/* red/red-控件填充-次按钮-按下.激活 */": "var(--color-red-control-fill-secondary-active)",
  "/* red/red-边线-深 */": "var(--color-red-border-dark)",
  "/* red/red-文本-不可用 */": "var(--color-red-text-disabled)",
  "/* red/red-文本-浅色注释 */": "var(--color-red-text-light)",
  "/* red/red-文本-次要 */": "var(--color-red-text-secondary)",
  "/* red/red-文本-默认 */": "var(--color-red-text-default)",
  "/* green/green-背景-页面 */": "var(--color-green-bg-page)",
  "/* green/green-控件填充-不可用 */": "var(--color-green-control-fill-disabled)",
  "/* green/green-背景-页面深 */": "var(--color-green-bg-page-dark)",
  "/* green/green-控件填充-标签 */": "var(--color-green-control-fill-tag)",
  "/* green/green-控件填充-主按钮 */": "var(--color-green-control-fill-primary)",
  "/* green/green-边线-控件按下.激活 */": "var(--color-green-control-fill-border-active)",
  "/* green/green-控件填充-主按钮-按下.激活 */": "var(--color-green-control-fill-primary-active)",
  "/* green/green-控件填充-主按钮-悬停 */": "var(--color-green-control-fill-primary-hover)",
  "/* green/green-背景-页面-浅 */": "var(--color-green-bg-page-light)",
  "/* green/green-控件填充-悬停 */": "var(--color-green-control-fill-hover)",
  "/* green/green-背景-浅色卡片 */": "var(--color-green-bg-card-light)",
  "/* green/green-控件填充-次按钮 */": "var(--color-green-control-fill-secondary)",
  "/* green/green-控件填充-按下.激活 */": "var(--color-green-control-fill-active)",
  "/* green/green-边线-浅 */": "var(--color-green-border-light)",
  "/* green/green-背景-提示块 */": "var(--color-green-bg-tip)",
  "/* green/green-控件填充-次按钮-悬停 */": "var(--color-green-control-fill-secondary-hover)",
  "/* green/green-控件填充-ghost按钮-按下.激活 */": "var(--color-green-control-fill-ghost-active)",
  "/* green/green-控件填充-次按钮-按下.激活 */": "var(--color-green-control-fill-secondary-active)",
  "/* green/green-边线-深 */": "var(--color-green-border-dark)",
  "/* green/green-文本-不可用 */": "var(--color-green-text-disabled)",
  "/* green/green-文本-浅色注释 */": "var(--color-green-text-light)",
  "/* green/green-文本-次要 */": "var(--color-green-text-secondary)",
  "/* green/green-文本-默认 */": "var(--color-green-text-default)",
  "/* orange/orange-背景-页面 */": "var(--color-orange-bg-page)",
  "/* orange/orange-控件填充-不可用 */": "var(--color-orange-control-fill-disabled)",
  "/* orange/orange-背景-页面深 */": "var(--color-orange-bg-page-dark)",
  "/* orange/orange-控件填充-标签 */": "var(--color-orange-control-fill-tag)",
  "/* orange/orange-控件填充-主按钮 */": "var(--color-orange-control-fill-primary)",
  "/* orange/orange-边线-控件按下.激活 */": "var(--color-orange-control-fill-border-active)",
  "/* orange/orange-控件填充-主按钮-按下.激活 */": "var(--color-orange-control-fill-primary-active)",
  "/* orange/orange-控件填充-主按钮-悬停 */": "var(--color-orange-control-fill-primary-hover)",
  "/* orange/orange-背景-页面-浅 */": "var(--color-orange-bg-page-light)",
  "/* orange/orange-控件填充-悬停 */": "var(--color-orange-control-fill-hover)",
  "/* orange/orange-背景-浅色卡片 */": "var(--color-orange-bg-card-light)",
  "/* orange/orange-控件填充-次按钮 */": "var(--color-orange-control-fill-secondary)",
  "/* orange/orange-控件填充-按下.激活 */": "var(--color-orange-control-fill-active)",
  "/* orange/orange-边线-浅 */": "var(--color-orange-border-light)",
  "/* orange/orange-背景-提示块 */": "var(--color-orange-bg-tip)",
  "/* orange/orange-控件填充-次按钮-悬停 */": "var(--color-orange-control-fill-secondary-hover)",
  "/* orange/orange-控件填充-ghost按钮-按下.激活 */": "var(--color-orange-control-fill-ghost-active)",
  "/* orange/orange-控件填充-次按钮-按下.激活 */": "var(--color-orange-control-fill-secondary-active)",
  "/* orange/orange-边线-深 */": "var(--color-orange-border-dark)",
  "/* orange/orange-文本-不可用 */": "var(--color-orange-text-disabled)",
  "/* orange/orange-文本-浅色注释 */": "var(--color-orange-text-light)",
  "/* orange/orange-文本-次要 */": "var(--color-orange-text-secondary)",
  "/* orange/orange-文本-默认 */": "var(--color-orange-text-default)",
  "/* yellow/yellow-背景-页面 */": "var(--color-yellow-bg-page)",
  "/* yellow/yellow-控件填充-不可用 */": "var(--color-yellow-control-fill-disabled)",
  "/* yellow/yellow-背景-页面深 */": "var(--color-yellow-bg-page-dark)",
  "/* yellow/yellow-控件填充-标签 */": "var(--color-yellow-control-fill-tag)",
  "/* yellow/yellow-控件填充-主按钮 */": "var(--color-yellow-control-fill-primary)",
  "/* yellow/yellow-边线-控件按下.激活 */": "var(--color-yellow-control-fill-border-active)",
  "/* yellow/yellow-控件填充-主按钮-按下.激活 */": "var(--color-yellow-control-fill-primary-active)",
  "/* yellow/yellow-控件填充-主按钮-悬停 */": "var(--color-yellow-control-fill-primary-hover)",
  "/* yellow/yellow-背景-页面-浅 */": "var(--color-yellow-bg-page-light)",
  "/* yellow/yellow-控件填充-悬停 */": "var(--color-yellow-control-fill-hover)",
  "/* yellow/yellow-背景-浅色卡片 */": "var(--color-yellow-bg-card-light)",
  "/* yellow/yellow-控件填充-次按钮 */": "var(--color-yellow-control-fill-secondary)",
  "/* yellow/yellow-控件填充-按下.激活 */": "var(--color-yellow-control-fill-active)",
  "/* yellow/yellow-边线-浅 */": "var(--color-yellow-border-light)",
  "/* yellow/yellow-背景-提示块 */": "var(--color-yellow-bg-tip)",
  "/* yellow/yellow-控件填充-次按钮-悬停 */": "var(--color-yellow-control-fill-secondary-hover)",
  "/* yellow/yellow-控件填充-ghost按钮-按下.激活 */": "var(--color-yellow-control-fill-ghost-active)",
  "/* yellow/yellow-控件填充-次按钮-按下.激活 */": "var(--color-yellow-control-fill-secondary-active)",
  "/* yellow/yellow-边线-深 */": "var(--color-yellow-border-dark)",
  "/* yellow/yellow-文本-不可用 */": "var(--color-yellow-text-disabled)",
  "/* yellow/yellow-文本-浅色注释 */": "var(--color-yellow-text-light)",
  "/* yellow/yellow-文本-次要 */": "var(--color-yellow-text-secondary)",
  "/* yellow/yellow-文本-默认 */": "var(--color-yellow-text-default)",
  "/* 辅0/辅0-背景-页面 */": "var(--color-sub0-bg-page)",
  "/* 辅0/辅0-控件填充-不可用 */": "var(--color-sub0-control-fill-disabled)",
  "/* 辅0/辅0-背景-页面深 */": "var(--color-sub0-bg-page-dark)",
  "/* 辅0/辅0-控件填充-标签 */": "var(--color-sub0-control-fill-tag)",
  "/* 辅0/辅0-控件填充-主按钮 */": "var(--color-sub0-control-fill-primary)",
  "/* 辅0/辅0-边线-控件按下.激活 */": "var(--color-sub0-control-fill-border-active)",
  "/* 辅0/辅0-控件填充-主按钮-按下.激活 */": "var(--color-sub0-control-fill-primary-active)",
  "/* 辅0/辅0-控件填充-主按钮-悬停 */": "var(--color-sub0-control-fill-primary-hover)",
  "/* 辅0/辅0-背景-页面-浅 */": "var(--color-sub0-bg-page-light)",
  "/* 辅0/辅0-控件填充-悬停 */": "var(--color-sub0-control-fill-hover)",
  "/* 辅0/辅0-背景-浅色卡片 */": "var(--color-sub0-bg-card-light)",
  "/* 辅0/辅0-控件填充-次按钮 */": "var(--color-sub0-control-fill-secondary)",
  "/* 辅0/辅0-控件填充-按下.激活 */": "var(--color-sub0-control-fill-active)",
  "/* 辅0/辅0-边线-浅 */": "var(--color-sub0-border-light)",
  "/* 辅0/辅0-背景-提示块 */": "var(--color-sub0-bg-tip)",
  "/* 辅0/辅0-控件填充-次按钮-悬停 */": "var(--color-sub0-control-fill-secondary-hover)",
  "/* 辅0/辅0-控件填充-ghost按钮-按下.激活 */": "var(--color-sub0-control-fill-ghost-active)",
  "/* 辅0/辅0-控件填充-次按钮-按下.激活 */": "var(--color-sub0-control-fill-secondary-active)",
  "/* 辅0/辅0-边线-深 */": "var(--color-sub0-border-dark)",
  "/* 辅0/辅0-文本-不可用 */": "var(--color-sub0-text-disabled)",
  "/* 辅0/辅0-文本-浅色注释 */": "var(--color-sub0-text-light)",
  "/* 辅0/辅0-文本-次要 */": "var(--color-sub0-text-secondary)",
  "/* 辅0/辅0-文本-默认 */": "var(--color-sub0-text-default)",
  "/* 辅1/辅1-背景-页面 */": "var(--color-sub1-bg-page)",
  "/* 辅1/辅1-控件填充-不可用 */": "var(--color-sub1-control-fill-disabled)",
  "/* 辅1/辅1-背景-页面深 */": "var(--color-sub1-bg-page-dark)",
  "/* 辅1/辅1-控件填充-标签 */": "var(--color-sub1-control-fill-tag)",
  "/* 辅1/辅1-控件填充-主按钮 */": "var(--color-sub1-control-fill-primary)",
  "/* 辅1/辅1-边线-控件按下.激活 */": "var(--color-sub1-control-fill-border-active)",
  "/* 辅1/辅1-控件填充-主按钮-按下.激活 */": "var(--color-sub1-control-fill-primary-active)",
  "/* 辅1/辅1-控件填充-主按钮-悬停 */": "var(--color-sub1-control-fill-primary-hover)",
  "/* 辅1/辅1-背景-页面-浅 */": "var(--color-sub1-bg-page-light)",
  "/* 辅1/辅1-控件填充-悬停 */": "var(--color-sub1-control-fill-hover)",
  "/* 辅1/辅1-背景-浅色卡片 */": "var(--color-sub1-bg-card-light)",
  "/* 辅1/辅1-控件填充-次按钮 */": "var(--color-sub1-control-fill-secondary)",
  "/* 辅1/辅1-控件填充-按下.激活 */": "var(--color-sub1-control-fill-active)",
  "/* 辅1/辅1-边线-浅 */": "var(--color-sub1-border-light)",
  "/* 辅1/辅1-背景-提示块 */": "var(--color-sub1-bg-tip)",
  "/* 辅1/辅1-控件填充-次按钮-悬停 */": "var(--color-sub1-control-fill-secondary-hover)",
  "/* 辅1/辅1-控件填充-ghost按钮-按下.激活 */": "var(--color-sub1-control-fill-ghost-active)",
  "/* 辅1/辅1-控件填充-次按钮-按下.激活 */": "var(--color-sub1-control-fill-secondary-active)",
  "/* 辅1/辅1-边线-深 */": "var(--color-sub1-border-dark)",
  "/* 辅1/辅1-文本-不可用 */": "var(--color-sub1-text-disabled)",
  "/* 辅1/辅1-文本-浅色注释 */": "var(--color-sub1-text-light)",
  "/* 辅1/辅1-文本-次要 */": "var(--color-sub1-text-secondary)",
  "/* 辅1/辅1-文本-默认 */": "var(--color-sub1-text-default)",
  "/* 辅2/辅2-背景-页面 */": "var(--color-sub2-bg-page)",
  "/* 辅2/辅2-控件填充-不可用 */": "var(--color-sub2-control-fill-disabled)",
  "/* 辅2/辅2-背景-页面深 */": "var(--color-sub2-bg-page-dark)",
  "/* 辅2/辅2-控件填充-标签 */": "var(--color-sub2-control-fill-tag)",
  "/* 辅2/辅2-控件填充-主按钮 */": "var(--color-sub2-control-fill-primary)",
  "/* 辅2/辅2-边线-控件按下.激活 */": "var(--color-sub2-control-fill-border-active)",
  "/* 辅2/辅2-控件填充-主按钮-按下.激活 */": "var(--color-sub2-control-fill-primary-active)",
  "/* 辅2/辅2-控件填充-主按钮-悬停 */": "var(--color-sub2-control-fill-primary-hover)",
  "/* 辅2/辅2-背景-页面-浅 */": "var(--color-sub2-bg-page-light)",
  "/* 辅2/辅2-控件填充-悬停 */": "var(--color-sub2-control-fill-hover)",
  "/* 辅2/辅2-背景-浅色卡片 */": "var(--color-sub2-bg-card-light)",
  "/* 辅2/辅2-控件填充-次按钮 */": "var(--color-sub2-control-fill-secondary)",
  "/* 辅2/辅2-控件填充-按下.激活 */": "var(--color-sub2-control-fill-active)",
  "/* 辅2/辅2-边线-浅 */": "var(--color-sub2-border-light)",
  "/* 辅2/辅2-背景-提示块 */": "var(--color-sub2-bg-tip)",
  "/* 辅2/辅2-控件填充-次按钮-悬停 */": "var(--color-sub2-control-fill-secondary-hover)",
  "/* 辅2/辅2-控件填充-ghost按钮-按下.激活 */": "var(--color-sub2-control-fill-ghost-active)",
  "/* 辅2/辅2-控件填充-次按钮-按下.激活 */": "var(--color-sub2-control-fill-secondary-active)",
  "/* 辅2/辅2-边线-深 */": "var(--color-sub2-border-dark)",
  "/* 辅2/辅2-文本-不可用 */": "var(--color-sub2-text-disabled)",
  "/* 辅2/辅2-文本-浅色注释 */": "var(--color-sub2-text-light)",
  "/* 辅2/辅2-文本-次要 */": "var(--color-sub2-text-secondary)",
  "/* 辅2/辅2-文本-默认 */": "var(--color-sub2-text-default)",
  "/* 辅3/辅3-背景-页面 */": "var(--color-sub3-bg-page)",
  "/* 辅3/辅3-控件填充-不可用 */": "var(--color-sub3-control-fill-disabled)",
  "/* 辅3/辅3-背景-页面深 */": "var(--color-sub3-bg-page-dark)",
  "/* 辅3/辅3-控件填充-标签 */": "var(--color-sub3-control-fill-tag)",
  "/* 辅3/辅3-控件填充-主按钮 */": "var(--color-sub3-control-fill-primary)",
  "/* 辅3/辅3-边线-控件按下.激活 */": "var(--color-sub3-control-fill-border-active)",
  "/* 辅3/辅3-控件填充-主按钮-按下.激活 */": "var(--color-sub3-control-fill-primary-active)",
  "/* 辅3/辅3-控件填充-主按钮-悬停 */": "var(--color-sub3-control-fill-primary-hover)",
  "/* 辅3/辅3-背景-页面-浅 */": "var(--color-sub3-bg-page-light)",
  "/* 辅3/辅3-控件填充-悬停 */": "var(--color-sub3-control-fill-hover)",
  "/* 辅3/辅3-背景-浅色卡片 */": "var(--color-sub3-bg-card-light)",
  "/* 辅3/辅3-控件填充-次按钮 */": "var(--color-sub3-control-fill-secondary)",
  "/* 辅3/辅3-控件填充-按下.激活 */": "var(--color-sub3-control-fill-active)",
  "/* 辅3/辅3-边线-浅 */": "var(--color-sub3-border-light)",
  "/* 辅3/辅3-背景-提示块 */": "var(--color-sub3-bg-tip)",
  "/* 辅3/辅3-控件填充-次按钮-悬停 */": "var(--color-sub3-control-fill-secondary-hover)",
  "/* 辅3/辅3-控件填充-ghost按钮-按下.激活 */": "var(--color-sub3-control-fill-ghost-active)",
  "/* 辅3/辅3-控件填充-次按钮-按下.激活 */": "var(--color-sub3-control-fill-secondary-active)",
  "/* 辅3/辅3-边线-深 */": "var(--color-sub3-border-dark)",
  "/* 辅3/辅3-文本-不可用 */": "var(--color-sub3-text-disabled)",
  "/* 辅3/辅3-文本-浅色注释 */": "var(--color-sub3-text-light)",
  "/* 辅3/辅3-文本-次要 */": "var(--color-sub3-text-secondary)",
  "/* 辅3/辅3-文本-默认 */": "var(--color-sub3-text-default)",
  "/* 辅4/辅4-背景-页面 */": "var(--color-sub4-bg-page)",
  "/* 辅4/辅4-控件填充-不可用 */": "var(--color-sub4-control-fill-disabled)",
  "/* 辅4/辅4-背景-页面深 */": "var(--color-sub4-bg-page-dark)",
  "/* 辅4/辅4-控件填充-标签 */": "var(--color-sub4-control-fill-tag)",
  "/* 辅4/辅4-控件填充-主按钮 */": "var(--color-sub4-control-fill-primary)",
  "/* 辅4/辅4-边线-控件按下.激活 */": "var(--color-sub4-control-fill-border-active)",
  "/* 辅4/辅4-控件填充-主按钮-按下.激活 */": "var(--color-sub4-control-fill-primary-active)",
  "/* 辅4/辅4-控件填充-主按钮-悬停 */": "var(--color-sub4-control-fill-primary-hover)",
  "/* 辅4/辅4-背景-页面-浅 */": "var(--color-sub4-bg-page-light)",
  "/* 辅4/辅4-控件填充-悬停 */": "var(--color-sub4-control-fill-hover)",
  "/* 辅4/辅4-背景-浅色卡片 */": "var(--color-sub4-bg-card-light)",
  "/* 辅4/辅4-控件填充-次按钮 */": "var(--color-sub4-control-fill-secondary)",
  "/* 辅4/辅4-控件填充-按下.激活 */": "var(--color-sub4-control-fill-active)",
  "/* 辅4/辅4-边线-浅 */": "var(--color-sub4-border-light)",
  "/* 辅4/辅4-背景-提示块 */": "var(--color-sub4-bg-tip)",
  "/* 辅4/辅4-控件填充-次按钮-悬停 */": "var(--color-sub4-control-fill-secondary-hover)",
  "/* 辅4/辅4-控件填充-ghost按钮-按下.激活 */": "var(--color-sub4-control-fill-ghost-active)",
  "/* 辅4/辅4-控件填充-次按钮-按下.激活 */": "var(--color-sub4-control-fill-secondary-active)",
  "/* 辅4/辅4-边线-深 */": "var(--color-sub4-border-dark)",
  "/* 辅4/辅4-文本-不可用 */": "var(--color-sub4-text-disabled)",
  "/* 辅4/辅4-文本-浅色注释 */": "var(--color-sub4-text-light)",
  "/* 辅4/辅4-文本-次要 */": "var(--color-sub4-text-secondary)",
  "/* 辅4/辅4-文本-默认 */": "var(--color-sub4-text-default)",
  "/* 辅5/辅5-背景-页面 */": "var(--color-sub5-bg-page)",
  "/* 辅5/辅5-控件填充-不可用 */": "var(--color-sub5-control-fill-disabled)",
  "/* 辅5/辅5-背景-页面深 */": "var(--color-sub5-bg-page-dark)",
  "/* 辅5/辅5-控件填充-标签 */": "var(--color-sub5-control-fill-tag)",
  "/* 辅5/辅5-控件填充-主按钮 */": "var(--color-sub5-control-fill-primary)",
  "/* 辅5/辅5-边线-控件按下.激活 */": "var(--color-sub5-control-fill-border-active)",
  "/* 辅5/辅5-控件填充-主按钮-按下.激活 */": "var(--color-sub5-control-fill-primary-active)",
  "/* 辅5/辅5-控件填充-主按钮-悬停 */": "var(--color-sub5-control-fill-primary-hover)",
  "/* 辅5/辅5-背景-页面-浅 */": "var(--color-sub5-bg-page-light)",
  "/* 辅5/辅5-控件填充-悬停 */": "var(--color-sub5-control-fill-hover)",
  "/* 辅5/辅5-背景-浅色卡片 */": "var(--color-sub5-bg-card-light)",
  "/* 辅5/辅5-控件填充-次按钮 */": "var(--color-sub5-control-fill-secondary)",
  "/* 辅5/辅5-控件填充-按下.激活 */": "var(--color-sub5-control-fill-active)",
  "/* 辅5/辅5-边线-浅 */": "var(--color-sub5-border-light)",
  "/* 辅5/辅5-背景-提示块 */": "var(--color-sub5-bg-tip)",
  "/* 辅5/辅5-控件填充-次按钮-悬停 */": "var(--color-sub5-control-fill-secondary-hover)",
  "/* 辅5/辅5-控件填充-ghost按钮-按下.激活 */": "var(--color-sub5-control-fill-ghost-active)",
  "/* 辅5/辅5-控件填充-次按钮-按下.激活 */": "var(--color-sub5-control-fill-secondary-active)",
  "/* 辅5/辅5-边线-深 */": "var(--color-sub5-border-dark)",
  "/* 辅5/辅5-文本-不可用 */": "var(--color-sub5-text-disabled)",
  "/* 辅5/辅5-文本-浅色注释 */": "var(--color-sub5-text-light)",
  "/* 辅5/辅5-文本-次要 */": "var(--color-sub5-text-secondary)",
  "/* 辅5/辅5-文本-默认 */": "var(--color-sub5-text-default)",
  "/* 辅6/辅6-背景-页面 */": "var(--color-sub6-bg-page)",
  "/* 辅6/辅6-控件填充-不可用 */": "var(--color-sub6-control-fill-disabled)",
  "/* 辅6/辅6-背景-页面深 */": "var(--color-sub6-bg-page-dark)",
  "/* 辅6/辅6-控件填充-标签 */": "var(--color-sub6-control-fill-tag)",
  "/* 辅6/辅6-控件填充-主按钮 */": "var(--color-sub6-control-fill-primary)",
  "/* 辅6/辅6-边线-控件按下.激活 */": "var(--color-sub6-control-fill-border-active)",
  "/* 辅6/辅6-控件填充-主按钮-按下.激活 */": "var(--color-sub6-control-fill-primary-active)",
  "/* 辅6/辅6-控件填充-主按钮-悬停 */": "var(--color-sub6-control-fill-primary-hover)",
  "/* 辅6/辅6-背景-页面-浅 */": "var(--color-sub6-bg-page-light)",
  "/* 辅6/辅6-控件填充-悬停 */": "var(--color-sub6-control-fill-hover)",
  "/* 辅6/辅6-背景-浅色卡片 */": "var(--color-sub6-bg-card-light)",
  "/* 辅6/辅6-控件填充-次按钮 */": "var(--color-sub6-control-fill-secondary)",
  "/* 辅6/辅6-控件填充-按下.激活 */": "var(--color-sub6-control-fill-active)",
  "/* 辅6/辅6-边线-浅 */": "var(--color-sub6-border-light)",
  "/* 辅6/辅6-背景-提示块 */": "var(--color-sub6-bg-tip)",
  "/* 辅6/辅6-控件填充-次按钮-悬停 */": "var(--color-sub6-control-fill-secondary-hover)",
  "/* 辅6/辅6-控件填充-ghost按钮-按下.激活 */": "var(--color-sub6-control-fill-ghost-active)",
  "/* 辅6/辅6-控件填充-次按钮-按下.激活 */": "var(--color-sub6-control-fill-secondary-active)",
  "/* 辅6/辅6-边线-深 */": "var(--color-sub6-border-dark)",
  "/* 辅6/辅6-文本-不可用 */": "var(--color-sub6-text-disabled)",
  "/* 辅6/辅6-文本-浅色注释 */": "var(--color-sub6-text-light)",
  "/* 辅6/辅6-文本-次要 */": "var(--color-sub6-text-secondary)",
  "/* 辅6/辅6-文本-默认 */": "var(--color-sub6-text-default)",
  "/* 辅7/辅7-背景-页面 */": "var(--color-sub7-bg-page)",
  "/* 辅7/辅7-控件填充-不可用 */": "var(--color-sub7-control-fill-disabled)",
  "/* 辅7/辅7-背景-页面深 */": "var(--color-sub7-bg-page-dark)",
  "/* 辅7/辅7-控件填充-标签 */": "var(--color-sub7-control-fill-tag)",
  "/* 辅7/辅7-控件填充-主按钮 */": "var(--color-sub7-control-fill-primary)",
  "/* 辅7/辅7-边线-控件按下.激活 */": "var(--color-sub7-control-fill-border-active)",
  "/* 辅7/辅7-控件填充-主按钮-按下.激活 */": "var(--color-sub7-control-fill-primary-active)",
  "/* 辅7/辅7-控件填充-主按钮-悬停 */": "var(--color-sub7-control-fill-primary-hover)",
  "/* 辅7/辅7-背景-页面-浅 */": "var(--color-sub7-bg-page-light)",
  "/* 辅7/辅7-控件填充-悬停 */": "var(--color-sub7-control-fill-hover)",
  "/* 辅7/辅7-背景-浅色卡片 */": "var(--color-sub7-bg-card-light)",
  "/* 辅7/辅7-控件填充-次按钮 */": "var(--color-sub7-control-fill-secondary)",
  "/* 辅7/辅7-控件填充-按下.激活 */": "var(--color-sub7-control-fill-active)",
  "/* 辅7/辅7-边线-浅 */": "var(--color-sub7-border-light)",
  "/* 辅7/辅7-背景-提示块 */": "var(--color-sub7-bg-tip)",
  "/* 辅7/辅7-控件填充-次按钮-悬停 */": "var(--color-sub7-control-fill-secondary-hover)",
  "/* 辅7/辅7-控件填充-ghost按钮-按下.激活 */": "var(--color-sub7-control-fill-ghost-active)",
  "/* 辅7/辅7-控件填充-次按钮-按下.激活 */": "var(--color-sub7-control-fill-secondary-active)",
  "/* 辅7/辅7-边线-深 */": "var(--color-sub7-border-dark)",
  "/* 辅7/辅7-文本-不可用 */": "var(--color-sub7-text-disabled)",
  "/* 辅7/辅7-文本-浅色注释 */": "var(--color-sub7-text-light)",
  "/* 辅7/辅7-文本-次要 */": "var(--color-sub7-text-secondary)",
  "/* 辅7/辅7-文本-默认 */": "var(--color-sub7-text-default)",
  "/* 圆角-控件-xs */": "var(--radius-control-xs)",
  "/* 圆角-控件-sm */": "var(--radius-control-sm)",
  "/* 圆角-控件-base */": "var(--radius-control-base)",
  "/* 圆角-控件-lg */": "var(--radius-control-lg)",
  "/* 圆角-卡片-lg */": "var(--radius-card-lg)",
  "/* 圆角-卡片-base */": "var(--radius-card-base)",
  "/* 圆角-弹窗-base */": "var(--radius-modal-base)",
  "/* 圆角-全圆角-base */": "var(--radius-circle-base)",
  "/* 间距-控件-xs */": "var(--padding-control-xs)",
  "/* 间距-控件-sm */": "var(--padding-control-sm)",
  "/* 间距-控件-base */": "var(--padding-control-base)",
  "/* 间距-卡片-xs */": "var(--padding-card-xs)",
  "/* 间距-卡片-sm */": "var(--padding-card-sm)",
  "/* 间距-卡片-base */": "var(--padding-card-base)",
  "/* 间距-卡片-lg */": "var(--padding-card-lg)",
  "/* 间距-卡片-xl */": "var(--padding-card-xl)",
  "/* 间距-弹窗-base */": "var(--padding-modal-base)",
  "/* 间距-页面-sm */": "var(--padding-page-sm)",
  "/* 间距-页面-base */": "var(--padding-page-base)",
  "/* 间距-组件-xs */": "var(--margin-component-xs)",
  "/* 间距-组件-sm */": "var(--margin-component-sm)",
  "/* 间距-组件-base */": "var(--margin-component-base)",
  "/* 间距-组件-lg */": "var(--margin-component-lg)",
  "/* 间距-模块-xs */": "var(--margin-module-xs)",
  "/* 间距-模块-sm */": "var(--margin-module-sm)",
  "/* 间距-模块-base */": "var(--margin-module-base)",
  "/* 间距-模块-lg */": "var(--margin-module-lg)",
  "/* 间距-布局-2xs */": "var(--margin-layout-2xs)",
  "/* 间距-布局-xs */": "var(--margin-layout-xs)",
  "/* 间距-布局-sm */": "var(--margin-layout-sm)",
  "/* 间距-布局-base */": "var(--margin-layout-base)",
  "/* 间距-布局-lg */": "var(--margin-layout-lg)",
  "/* 间距-布局-xl */": "var(--margin-layout-xl)",
  "/* 投影-描边-base */": "var(--shadow-border-base)",
  "/* 投影-描边-lg */": "var(--shadow-border-lg)",
  "/* 投影-控件-base */": "var(--shadow-control-base)",
  "/* 投影-控件-lg */": "var(--shadow-control-lg)",
  "/* 投影-卡片-base */": "var(--shadow-card-base)",
  "/* 投影-卡片-lg */": "var(--shadow-card-lg)",
  "/* 投影-气泡-base */": "var(--shadow-popover-base)",
  "/* 投影-弹窗-base */": "var(--shadow-modal-base)",
  "/* 投影-风格化-base */": "var(--shadow-stylish-base)",
  "/* 数值/数值-xs */": "var(--font-text-number-xs)",
  "/* 数值/数值-xs */-letter-spacing": "var(--letter-spacing-number-xs, normal)",
  "/* 数值/数值-sm */": "var(--font-text-number-sm)",
  "/* 数值/数值-sm */-letter-spacing": "var(--letter-spacing-number-sm, normal)",
  "/* 数值/数值-base */": "var(--font-text-number-base)",
  "/* 数值/数值-base */-letter-spacing": "var(--letter-spacing-number-base, normal)",
  "/* 数值/数值-lg */": "var(--font-text-number-lg)",
  "/* 数值/数值-lg */-letter-spacing": "var(--letter-spacing-number-lg, normal)",
  "/* 数值/数值-xl */": "var(--font-text-number-xl)",
  "/* 数值/数值-xl */-letter-spacing": "var(--letter-spacing-number-xl, normal)",
  "/* 数值/数值-2xl */": "var(--font-text-number-2xl)",
  "/* 数值/数值-2xl */-letter-spacing": "var(--letter-spacing-number-2xl, normal)",
  "/* 数值/数值-3xl */": "var(--font-text-number-3xl)",
  "/* 数值/数值-3xl */-letter-spacing": "var(--letter-spacing-number-3xl, normal)",
  "/* 数值/数值-4xl */": "var(--font-text-number-4xl)",
  "/* 数值/数值-4xl */-letter-spacing": "var(--letter-spacing-number-4xl, normal)",
  "/* 正文/正文-xs */": "var(--font-text-body-xs)",
  "/* 正文/正文-xs */-letter-spacing": "var(--letter-spacing-body-xs, normal)",
  "/* 正文/正文-sm */": "var(--font-text-body-sm)",
  "/* 正文/正文-sm */-letter-spacing": "var(--letter-spacing-body-sm, normal)",
  "/* 正文/正文-base */": "var(--font-text-body-base)",
  "/* 正文/正文-base */-letter-spacing": "var(--letter-spacing-body-base, normal)",
  "/* 正文/正文-lg */": "var(--font-text-body-lg)",
  "/* 正文/正文-lg */-letter-spacing": "var(--letter-spacing-body-lg, normal)",
  "/* 正文/正文-xl */": "var(--font-text-body-xl)",
  "/* 正文/正文-xl */-letter-spacing": "var(--letter-spacing-body-xl, normal)",
  "/* 正文/正文-xs-强调 */": "var(--font-text-body-emphasized-xs)",
  "/* 正文/正文-xs-强调 */-letter-spacing": "var(--letter-spacing-body-emphasized-xs, normal)",
  "/* 正文/正文-sm-强调 */": "var(--font-text-body-emphasized-sm)",
  "/* 正文/正文-sm-强调 */-letter-spacing": "var(--letter-spacing-body-emphasized-sm, normal)",
  "/* 正文/正文-base-强调 */": "var(--font-text-body-emphasized-base)",
  "/* 正文/正文-base-强调 */-letter-spacing": "var(--letter-spacing-body-emphasized-base, normal)",
  "/* 正文/正文-lg-强调 */": "var(--font-text-body-emphasized-lg)",
  "/* 正文/正文-lg-强调 */-letter-spacing": "var(--letter-spacing-body-emphasized-lg, normal)",
  "/* 正文/正文-xl-强调 */": "var(--font-text-body-emphasized-xl)",
  "/* 正文/正文-xl-强调 */-letter-spacing": "var(--letter-spacing-body-emphasized-xl, normal)",
  "/* 段落/段落-xs */": "var(--font-text-paragraph-xs)",
  "/* 段落/段落-xs */-letter-spacing": "var(--letter-spacing-paragraph-xs, normal)",
  "/* 段落/段落-sm */": "var(--font-text-paragraph-sm)",
  "/* 段落/段落-sm */-letter-spacing": "var(--letter-spacing-paragraph-sm, normal)",
  "/* 段落/段落-base */": "var(--font-text-paragraph-base)",
  "/* 段落/段落-base */-letter-spacing": "var(--letter-spacing-paragraph-base, normal)",
  "/* 段落/段落-lg */": "var(--font-text-paragraph-lg)",
  "/* 段落/段落-lg */-letter-spacing": "var(--letter-spacing-paragraph-lg, normal)",
  "/* 段落/段落-xl */": "var(--font-text-paragraph-xl)",
  "/* 段落/段落-xl */-letter-spacing": "var(--letter-spacing-paragraph-xl, normal)",
  "/* 段落/段落-xs-强调 */": "var(--font-text-paragraph-emphasized-xs)",
  "/* 段落/段落-xs-强调 */-letter-spacing": "var(--letter-spacing-paragraph-emphasized-xs, normal)",
  "/* 段落/段落-sm-强调 */": "var(--font-text-paragraph-emphasized-sm)",
  "/* 段落/段落-sm-强调 */-letter-spacing": "var(--letter-spacing-paragraph-emphasized-sm, normal)",
  "/* 段落/段落-base-强调 */": "var(--font-text-paragraph-emphasized-base)",
  "/* 段落/段落-base-强调 */-letter-spacing": "var(--letter-spacing-paragraph-emphasized-base, normal)",
  "/* 段落/段落-lg-强调 */": "var(--font-text-paragraph-emphasized-lg)",
  "/* 段落/段落-lg-强调 */-letter-spacing": "var(--letter-spacing-paragraph-emphasized-lg, normal)",
  "/* 段落/段落-xl-强调 */": "var(--font-text-paragraph-emphasized-xl)",
  "/* 段落/段落-xl-强调 */-letter-spacing": "var(--letter-spacing-paragraph-emphasized-xl, normal)",
  "/* 代码/代码-base */": "var(--font-text-code-base)",
  "/* 代码/代码-base */-letter-spacing": "var(--letter-spacing-code-base, normal)",
  "/* 代码/代码-lg */": "var(--font-text-code-lg)",
  "/* 代码/代码-lg */-letter-spacing": "var(--letter-spacing-code-lg, normal)",
  "/* 代码/代码-base-强调 */": "var(--font-text-code-emphasized-base)",
  "/* 代码/代码-base-强调 */-letter-spacing": "var(--letter-spacing-code-emphasized-base, normal)",
  "/* 代码/代码-lg-强调 */": "var(--font-text-code-emphasized-lg)",
  "/* 代码/代码-lg-强调 */-letter-spacing": "var(--letter-spacing-code-emphasized-lg, normal)",
  "/* 标题/H1 */": "var(--font-text-h1-base)",
  "/* 标题/H1 */-letter-spacing": "var(--letter-spacing-h1-base, normal)",
  "/* 标题/H2 */": "var(--font-text-h2-base)",
  "/* 标题/H2 */-letter-spacing": "var(--letter-spacing-h2-base, normal)",
  "/* 标题/H3 */": "var(--font-text-h3-base)",
  "/* 标题/H3 */-letter-spacing": "var(--letter-spacing-h3-base, normal)",
  "/* 标题/H4 */": "var(--font-text-h4-base)",
  "/* 标题/H4 */-letter-spacing": "var(--letter-spacing-h4-base, normal)",
  "/* 标题/H5 */": "var(--font-text-h5-base)",
  "/* 标题/H5 */-letter-spacing": "var(--letter-spacing-h5-base, normal)",
  "/* 标题/H6 */": "var(--font-text-h6-base)",
  "/* 标题/H6 */-letter-spacing": "var(--letter-spacing-h6-base, normal)",
  "/* 风格化/风格化-H1 */": "var(--font-text-stylish-h1-base)",
  "/* 风格化/风格化-H1 */-letter-spacing": "var(--letter-spacing-stylish-h1-base, normal)",
  "/* 风格化/风格化-H2 */": "var(--font-text-stylish-h2-base)",
  "/* 风格化/风格化-H2 */-letter-spacing": "var(--letter-spacing-stylish-h2-base, normal)",
  "/* 风格化/风格化-H3 */": "var(--font-text-stylish-h3-base)",
  "/* 风格化/风格化-H3 */-letter-spacing": "var(--letter-spacing-stylish-h3-base, normal)",
  "/* 风格化/风格化-H4 */": "var(--font-text-stylish-h4-base)",
  "/* 风格化/风格化-H4 */-letter-spacing": "var(--letter-spacing-stylish-h4-base, normal)",
  "/* 风格化/风格化-H5 */": "var(--font-text-stylish-h5-base)",
  "/* 风格化/风格化-H5 */-letter-spacing": "var(--letter-spacing-stylish-h5-base, normal)",
  "/* 风格化/风格化-H6 */": "var(--font-text-stylish-h6-base)",
  "/* 风格化/风格化-H6 */-letter-spacing": "var(--letter-spacing-stylish-h6-base, normal)"
};
// 创建悬浮按钮
function createToggleButton() {
  // 检查是否已存在悬浮按钮，如果存在则移除
  const existingButton = document.getElementById('one-token-toggle-button');
  if (existingButton) {
    existingButton.remove();
  }
  // 创建悬浮按钮容器
  const toggleButton = document.createElement('div');
  toggleButton.id = 'one-token-toggle-button';
  // 设置按钮样式
  toggleButton.style.cssText = `
    position: fixed;
    bottom: 18px;
    right: 60px;
    z-index: 10000;
    background: linear-gradient(0deg, rgb(147, 96, 204), rgb(39, 46, 100), rgb(78, 242, 248));
    color: white;
    padding: 3px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    box-shadow: rgba(158, 242, 248, 0.6) 0px 0px 20px, rgba(147, 96, 204, 0.4) 0px 0px 10px inset;
    transition: 0.3s;
    user-select: none;
    white-space: nowrap;
  `;
  // 设置初始文本
  updateButtonAppearance(toggleButton);
  // 添加点击事件
  toggleButton.addEventListener('click', () => {
    toggleOneTokenStatus(toggleButton);
  });
  // 添加到页面
  document.body.appendChild(toggleButton);
}
// 更新按钮外观
function updateButtonAppearance(button) {
  var _a, _b;
  const isEnabled = (_b = (_a = $window.oneToken) === null || _a === void 0 ? void 0 : _a.isEnabled) !== null && _b !== void 0 ? _b : true;
  if (isEnabled) {
    button.textContent = 'OneToken替换已开启';
    button.style.background = 'linear-gradient(0deg, #9360cc, #272e64, #4ef2f8)';
    button.style.color = 'white';
    button.style.boxShadow = '0 0 20px rgba(158, 242, 248, 0.6), inset 0 0 10px rgba(147, 96, 204, 0.4)';
  }
  else {
    button.textContent = 'OneToken替换已关闭';
    button.style.background = '#d9d9d9';
    button.style.color = '#666';
    button.style.boxShadow = 'none';
  }
}
// 切换OneToken状态
function toggleOneTokenStatus(button) {
  if ($window.oneToken) {
    $window.oneToken.isEnabled = !$window.oneToken.isEnabled;
    if ($window.oneToken.isEnabled) {
      handleCodeReplace();
    }
    updateButtonAppearance(button);
    console.log(`[oneToken]替换功能已${$window.oneToken.isEnabled ? '开启' : '关闭'}`);
  }
}

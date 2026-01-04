/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/.pnpm/css-loader@7.1.2_webpack@5.99.0/node_modules/css-loader/dist/runtime/api.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/.pnpm/css-loader@7.1.2_webpack@5.99.0/node_modules/css-loader/dist/runtime/api.js ***!
  \********************************************************************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/.pnpm/css-loader@7.1.2_webpack@5.99.0/node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/css-loader@7.1.2_webpack@5.99.0/node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \***************************************************************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/shared/copy.ts":
/*!****************************!*\
  !*** ./src/shared/copy.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BACKGROUND_COLOR_OUT: () => (/* binding */ BACKGROUND_COLOR_OUT),
/* harmony export */   BACKGROUND_COLOR_OVER: () => (/* binding */ BACKGROUND_COLOR_OVER),
/* harmony export */   SETTINGS_BACKGROUND_OUT: () => (/* binding */ SETTINGS_BACKGROUND_OUT),
/* harmony export */   SETTINGS_BACKGROUND_OVER: () => (/* binding */ SETTINGS_BACKGROUND_OVER),
/* harmony export */   addCopyButtonToAnswer: () => (/* binding */ addCopyButtonToAnswer),
/* harmony export */   applyToPlatform: () => (/* binding */ applyToPlatform),
/* harmony export */   applyToPlatforms: () => (/* binding */ applyToPlatforms),
/* harmony export */   createCopyButton: () => (/* binding */ createCopyButton),
/* harmony export */   createFlashOverlay: () => (/* binding */ createFlashOverlay),
/* harmony export */   createGlowingAnimationStyle: () => (/* binding */ createGlowingAnimationStyle),
/* harmony export */   initTurndownService: () => (/* binding */ initTurndownService),
/* harmony export */   observeDOMChanges: () => (/* binding */ observeDOMChanges),
/* harmony export */   processMarkdown: () => (/* binding */ processMarkdown),
/* harmony export */   stripMarkdown: () => (/* binding */ stripMarkdown)
/* harmony export */ });
/* harmony import */ var turndown__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! turndown */ "turndown");
/* harmony import */ var turndown__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(turndown__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var turndown_plugin_gfm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! turndown-plugin-gfm */ "turndown-plugin-gfm");
/* harmony import */ var turndown_plugin_gfm__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(turndown_plugin_gfm__WEBPACK_IMPORTED_MODULE_1__);


// 背景颜色常量
const BACKGROUND_COLOR_OUT = 'linear-gradient(135deg, rgba(25, 239, 192, 0.6), rgba(64, 128, 255, 0.4))';
const BACKGROUND_COLOR_OVER = 'linear-gradient(135deg, rgba(25, 239, 192, 0.8), rgba(64, 128, 255, 0.6))';
const SETTINGS_BACKGROUND_OUT = 'linear-gradient(135deg, rgba(64, 128, 255, 0.6), rgba(25, 239, 192, 0.4))';
const SETTINGS_BACKGROUND_OVER = 'linear-gradient(135deg, rgba(64, 128, 255, 0.8), rgba(25, 239, 192, 0.6))';
// 初始化turndown服务
function initTurndownService() {
    const turndownService = new (turndown__WEBPACK_IMPORTED_MODULE_0___default())({
        preformattedCode: true, // 是否保留预格式化代码，设为true时会保持代码块的原始格式，包括缩进和换行
        headingStyle: 'atx', // 标题样式，'atx'使用#号(如：# 标题)，'setext'使用底线(如：标题\n===)
        bulletListMarker: '-', // 无序列表的标记符号，可以是 '-', '*', 或 '+'
        emDelimiter: '*', // 斜体文本的分隔符，可以是 '_' 或 '*'
        strongDelimiter: '**', // 加粗文本的分隔符
        codeBlockStyle: 'fenced' // 代码块样式，'fenced'使用```包裹，'indented'使用缩进
    });
    turndownService.use(turndown_plugin_gfm__WEBPACK_IMPORTED_MODULE_1__.gfm);
    // 自定义代码块规则
    turndownService.addRule('codeBlock', {
        filter: function (node) {
            if (!(node instanceof HTMLElement)) {
                return false;
            }
            // 比如【百度-AI搜索】平台，pre元素下的code元素，不是子元素而是后代元素，为了使其识别为代码块，所以需要特殊处理
            const codeElement = node.querySelector('code');
            return node.nodeName === 'PRE' && codeElement !== null;
        },
        replacement: function (content, node) {
            const codeElement = node.querySelector('code');
            const code = codeElement?.textContent?.trim() || '';
            const lang = codeElement?.getAttribute('class') || '';
            const languageMatch = lang.match(/language-([\w-]+)/i);
            const language = languageMatch ? languageMatch[1] : '';
            return '\n```' + (language ? language + '\n' : '\n') + code + '\n```\n';
        }
    });
    // 自定义escape函数，避免不必要的转义
    turndownService.escape = function (text) {
        return text
            .replace(/\\([!"#$%&'()*+,\-./:;<=>?@\[\]^_`{|}~])/g, '$1') // 移除已有的转义
            .replace(/([*_`])/g, '\\$1'); // 只转义特殊Markdown字符
    };
    return turndownService;
}
// Markdown 工具函数
function stripMarkdown(text) {
    return text
        .replace(/```[\s\S]*?```/g, '$1') // 移除代码块
        .replace(/\*\*(.*?)\*\*/g, '$1') // 移除加粗
        .replace(/\*(.*?)\*/g, '$1') // 移除斜体
        .replace(/`([^`]+)`/g, '$1') // 移除行内代码
        .replace(/^#+\s+/gm, '') // 移除标题标记
        .replace(/^[-*]\s+/gm, '') // 移除无序列表标记
        .replace(/^\d+\.\s+/gm, '') // 移除有序列表标记
        .replace(/^>\s+/gm, '') // 移除引用标记
        .trim();
}
// 处理Markdown文本，根据配置决定是否去除参考文献角标和特殊span节点
function processMarkdown(markdown, removeSelectorList, config) {
    // 创建节点的深拷贝，以免修改原始节点
    const clonedMarkdown = markdown.cloneNode(true);
    // 根据配置决定是否在拷贝的节点上移除参考文献角标
    if (config.removeReferences) {
        removeSelectorList.forEach(selector => {
            clonedMarkdown.querySelectorAll(selector).forEach(node => node.remove());
        });
    }
    // 移除零宽连字符
    const treeWalker = document.createTreeWalker(clonedMarkdown, NodeFilter.SHOW_TEXT);
    let currentNode;
    while (currentNode = treeWalker.nextNode()) {
        currentNode.textContent = currentNode.textContent?.replace(/&zwnj;|\u200c/g, '') ?? '';
    }
    return clonedMarkdown;
}
// 创建复制按钮的闪光动画样式
function createGlowingAnimationStyle() {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes glowing {
      0% { box-shadow: 0 0 5px rgba(0, 255, 128, 0.8), 0 0 10px rgba(0, 0, 0, 0.8), 0 0 15px rgba(64, 128, 255, 0.6); }
      50% { box-shadow: 0 0 15px rgba(0, 255, 128, 1), 0 0 20px rgba(255, 7, 160, 0.9), 0 0 25px rgba(64, 128, 255, 0.8); }
      100% { box-shadow: 0 0 5px rgba(0, 255, 128, 0.8), 0 0 10px rgba(0, 0, 0, 0.8), 0 0 15px rgba(64, 128, 255, 0.6); }
    }
    
    @keyframes flash-animation {
      0% { opacity: 0; transform: scale(1); filter: brightness(1); background-color: rgba(255, 255, 255, 0); }
      25% { opacity: 1; transform: scale(1.02); filter: brightness(1.5); background-color: rgba(255, 255, 255, 0.95); }
      50% { opacity: 0.5; transform: scale(1.01); filter: brightness(1.2); background-color: rgba(255, 255, 255, 0.5); }
      100% { opacity: 0; transform: scale(1); filter: brightness(1); background-color: rgba(255, 255, 255, 0); }
    }
  `;
    return style;
}
// 创建复制按钮
function createCopyButton(position = 'top') {
    const button = document.createElement('button');
    button.textContent = '复制';
    button.className = 'ai-copy-button';
    button.style.position = 'absolute';
    // 根据位置设置top和bottom值
    switch (position) {
        case 'top':
            button.style.top = '10px';
            break;
        case 'middle':
            button.style.top = '50%';
            button.style.transform = 'translateY(-50%)';
            break;
        case 'bottom':
            button.style.bottom = '10px';
            break;
    }
    button.style.right = '10px';
    button.style.padding = '4px 8px';
    button.style.background = BACKGROUND_COLOR_OUT;
    button.style.color = 'white';
    button.style.border = '2px dashed #fff';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    button.style.zIndex = '1000';
    button.style.animation = 'glowing 2s infinite';
    // 添加悬停效果
    button.addEventListener('mouseover', () => {
        button.style.background = BACKGROUND_COLOR_OVER;
    });
    button.addEventListener('mouseout', () => {
        button.style.background = BACKGROUND_COLOR_OUT;
    });
    return button;
}
// 创建闪光效果遮罩层
function createFlashOverlay() {
    const flashOverlay = document.createElement('div');
    flashOverlay.style.position = 'absolute';
    flashOverlay.style.top = '0';
    flashOverlay.style.left = '0';
    flashOverlay.style.width = '100%';
    flashOverlay.style.height = '100%';
    flashOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0)';
    flashOverlay.style.animation = 'flash-animation 1s ease-in-out';
    flashOverlay.style.pointerEvents = 'none';
    flashOverlay.style.zIndex = '999';
    return flashOverlay;
}
// 为AI回答添加复制按钮
function addCopyButtonToAnswer(answerElement, platform, config, turndownService, copyToClipboard) {
    // 检查是否已经添加了复制按钮
    if (answerElement.querySelector('.ai-copy-button')) {
        return;
    }
    // 设置相对定位，以便正确放置复制按钮
    if (window.getComputedStyle(answerElement).position === 'static') {
        answerElement.style.position = 'relative';
    }
    // 创建三个不同位置的复制按钮
    const positions = ['top', 'middle', 'bottom'];
    positions.forEach(position => {
        const button = createCopyButton(position);
        answerElement.appendChild(button);
        // 为每个按钮添加点击事件
        button.addEventListener('click', async () => {
            // 让按钮获得焦点
            button.focus();
            // 查找Markdown内容
            const markdownElement = answerElement.querySelector(`[class*="${platform.markdownContentClass}"]`);
            if (!markdownElement) {
                console.error('未找到Markdown内容元素');
                return;
            }
            // 添加闪光效果
            const flashOverlay = createFlashOverlay();
            answerElement.appendChild(flashOverlay);
            // 动画结束后移除遮罩层
            flashOverlay.addEventListener('animationend', () => {
                flashOverlay.remove();
            });
            // 处理Markdown内容
            const markdownOuterHTML = processMarkdown(markdownElement, platform.removeSelectorList, config);
            // 根据用户选择的格式进行复制
            let content = '';
            if (config.copyFormat === 'markdown') {
                content = turndownService.turndown(markdownOuterHTML.outerHTML);
            }
            else {
                content = markdownOuterHTML.outerHTML;
            }
            // 复制到剪贴板
            await copyToClipboard(content);
            // 修改按钮文本提示复制成功
            const originalText = button.textContent;
            button.textContent = '✓ 已复制';
            // 一段时间后恢复按钮文本
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        });
    });
}
// 为单个平台应用复制功能
function applyToPlatform(platform, config, turndownService, copyToClipboard) {
    if (!config.enableCopy)
        return;
    const answerElements = document.querySelectorAll(platform.selector);
    if (answerElements.length === 0)
        return;
    answerElements.forEach(element => {
        addCopyButtonToAnswer(element, platform, config, turndownService, copyToClipboard);
    });
}
// 为所有平台应用复制功能
function applyToPlatforms(platforms, config, turndownService, copyToClipboard) {
    platforms.forEach(platform => {
        applyToPlatform(platform, config, turndownService, copyToClipboard);
    });
}
// 监听DOM变化，为新的回答添加复制按钮
function observeDOMChanges(platforms, config, turndownService, copyToClipboard) {
    const observer = new MutationObserver(mutations => {
        let shouldApply = false;
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldApply = true;
            }
        });
        if (shouldApply) {
            applyToPlatforms(platforms, config, turndownService, copyToClipboard);
        }
    });
    // 观察整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    return observer;
}


/***/ }),

/***/ "./src/shared/styles/common.css":
/*!**************************************!*\
  !*** ./src/shared/styles/common.css ***!
  \**************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/.pnpm/css-loader@7.1.2_webpack@5.99.0/node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/.pnpm/css-loader@7.1.2_webpack@5.99.0/node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/.pnpm/css-loader@7.1.2_webpack@5.99.0/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/.pnpm/css-loader@7.1.2_webpack@5.99.0/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@keyframes glowing {
  0% { box-shadow: 0 0 5px rgba(0, 255, 128, 0.8), 0 0 10px rgba(0, 0, 0, 0.8), 0 0 15px rgba(64, 128, 255, 0.6); }
  50% { box-shadow: 0 0 15px rgba(0, 255, 128, 1), 0 0 20px rgba(255, 7, 160, 0.9), 0 0 25px rgba(64, 128, 255, 0.8); }
  100% { box-shadow: 0 0 5px rgba(0, 255, 128, 0.8), 0 0 10px rgba(0, 0, 0, 0.8), 0 0 15px rgba(64, 128, 255, 0.6); }
}

@keyframes flash-animation {
  0% { opacity: 0; transform: scale(1); filter: brightness(1); background-color: rgba(255, 255, 255, 0); }
  25% { opacity: 1; transform: scale(1.02); filter: brightness(1.5); background-color: rgba(255, 255, 255, 0.95); }
  50% { opacity: 0.5; transform: scale(1.01); filter: brightness(1.2); background-color: rgba(255, 255, 255, 0.5); }
  100% { opacity: 0; transform: scale(1); filter: brightness(1); background-color: rgba(255, 255, 255, 0); }
}

.ai-copy-button {
  width: auto;
  position: absolute;
  right: 10px;
  padding: 4px 8px;
  background: linear-gradient(135deg, rgba(25, 239, 192, 0.6), rgba(64, 128, 255, 0.4));
  color: white;
  border: 2px dashed #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  z-index: 1000;
  animation: glowing 2s infinite;
}

.ai-copy-button:hover {
  background: linear-gradient(135deg, rgba(25, 239, 192, 0.8), rgba(64, 128, 255, 0.6));
}

.ai-copy-button.top {
  top: 10px;
}

.ai-copy-button.middle {
  top: 50%;
  transform: translateY(-50%);
}

.ai-copy-button.bottom {
  bottom: 10px;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
}

.option-container {
  margin: 16px;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 4px 16px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 8px;
  border-radius: 8px;
  cursor: pointer !important;
  transition: background-color 0.2s;
  font-size: 14px;
}

.checkbox-container:hover {
  background-color: #f5f5f5;
}

.checkbox-container input[type='checkbox'] {
  margin-right: 12px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #4285f4;
}

.radio-group {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 2px;
  background-color: #f5f5f5;
  border-radius: 20px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.radio-group input[type='radio'] {
  display: none;
}

.radio-group label {
  position: relative;
  padding: 6px 16px;
  font-size: 14px;
  color: #bdbdbd;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.3s ease;
  user-select: none;
  z-index: 1;
}

.radio-group label:hover {
  color: #4285f4;
}

.label-key {
  width: 124px;
  text-align: left;
  margin-right: 10px;
}

.radio-group input[type='radio']:checked + label {
  color: #4285f4;
}

.radio-group::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  border-radius: 16px;
  transition: all 0.3s ease;
  z-index: 0;
}

.radio-group input[type='radio']:nth-of-type(2):checked ~ .radio-group::before {
  transform: translateX(100%);
}

button {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #3367d6;
}

.privacy-notice {
  margin: 2px 0 0 14px;
  padding: 10px;
  background-color: #f8f9fa;
  border-left: 3px solid #4285f4;
  font-size: 13px;
}

.privacy-link {
  color: #4285f4;
  text-decoration: none;
  display: inline-block;
  margin-top: 5px;
}

.privacy-link:hover {
  text-decoration: underline;
}

.consent-container {
  margin-top: 12px;
  padding: 10px;
  background-color: #fff8e1;
  border-radius: 4px;
  border: 2px dashed #ffe082;
}

.consent-container .checkbox-container {
  margin-bottom: 0;
}

.disabled-notice {
  color: #d32f2f;
  font-weight: bold;
  margin: 8px 0 0 44px;
}

.platforms-info {
  margin-top: 12px;
  padding: 4px 24px;
  background-color: #e8f0fe;
  border: 2px dashed #4285f4;
  border-radius: 8px;
  font-size: 12px;
  color: #1a73e8;
  font-weight: 500;
}

.platforms-info.unsupported {
  background-color: #fce8e6;
  border-color: #ea4335;
  color: #d93025;
}

.status-message {
  display: none;
  padding: 8px;
  text-align: center;
  color: #4CAF50;
  margin-top: 10px;
  font-weight: bold;
  background-color: #f1f8e9;
  border-radius: 4px;
} `, "",{"version":3,"sources":["webpack://./src/shared/styles/common.css"],"names":[],"mappings":"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","sourcesContent":["@keyframes glowing {\r\n  0% { box-shadow: 0 0 5px rgba(0, 255, 128, 0.8), 0 0 10px rgba(0, 0, 0, 0.8), 0 0 15px rgba(64, 128, 255, 0.6); }\r\n  50% { box-shadow: 0 0 15px rgba(0, 255, 128, 1), 0 0 20px rgba(255, 7, 160, 0.9), 0 0 25px rgba(64, 128, 255, 0.8); }\r\n  100% { box-shadow: 0 0 5px rgba(0, 255, 128, 0.8), 0 0 10px rgba(0, 0, 0, 0.8), 0 0 15px rgba(64, 128, 255, 0.6); }\r\n}\r\n\r\n@keyframes flash-animation {\r\n  0% { opacity: 0; transform: scale(1); filter: brightness(1); background-color: rgba(255, 255, 255, 0); }\r\n  25% { opacity: 1; transform: scale(1.02); filter: brightness(1.5); background-color: rgba(255, 255, 255, 0.95); }\r\n  50% { opacity: 0.5; transform: scale(1.01); filter: brightness(1.2); background-color: rgba(255, 255, 255, 0.5); }\r\n  100% { opacity: 0; transform: scale(1); filter: brightness(1); background-color: rgba(255, 255, 255, 0); }\r\n}\r\n\r\n.ai-copy-button {\r\n  width: auto;\r\n  position: absolute;\r\n  right: 10px;\r\n  padding: 4px 8px;\r\n  background: linear-gradient(135deg, rgba(25, 239, 192, 0.6), rgba(64, 128, 255, 0.4));\r\n  color: white;\r\n  border: 2px dashed #fff;\r\n  border-radius: 4px;\r\n  cursor: pointer;\r\n  font-size: 16px;\r\n  z-index: 1000;\r\n  animation: glowing 2s infinite;\r\n}\r\n\r\n.ai-copy-button:hover {\r\n  background: linear-gradient(135deg, rgba(25, 239, 192, 0.8), rgba(64, 128, 255, 0.6));\r\n}\r\n\r\n.ai-copy-button.top {\r\n  top: 10px;\r\n}\r\n\r\n.ai-copy-button.middle {\r\n  top: 50%;\r\n  transform: translateY(-50%);\r\n}\r\n\r\n.ai-copy-button.bottom {\r\n  bottom: 10px;\r\n}\r\n\r\nbody {\r\n  font-family: system-ui, -apple-system, sans-serif;\r\n}\r\n\r\n.option-container {\r\n  margin: 16px;\r\n  border: 2px dashed #e0e0e0;\r\n  border-radius: 12px;\r\n  padding: 4px 16px;\r\n}\r\n\r\n.checkbox-container {\r\n  display: flex;\r\n  align-items: center;\r\n  margin-bottom: 12px;\r\n  padding: 0 8px;\r\n  border-radius: 8px;\r\n  cursor: pointer !important;\r\n  transition: background-color 0.2s;\r\n  font-size: 14px;\r\n}\r\n\r\n.checkbox-container:hover {\r\n  background-color: #f5f5f5;\r\n}\r\n\r\n.checkbox-container input[type='checkbox'] {\r\n  margin-right: 12px;\r\n  width: 20px;\r\n  height: 20px;\r\n  cursor: pointer;\r\n  accent-color: #4285f4;\r\n}\r\n\r\n.radio-group {\r\n  position: relative;\r\n  display: inline-flex;\r\n  align-items: center;\r\n  margin-left: 2px;\r\n  background-color: #f5f5f5;\r\n  border-radius: 20px;\r\n  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n.radio-group input[type='radio'] {\r\n  display: none;\r\n}\r\n\r\n.radio-group label {\r\n  position: relative;\r\n  padding: 6px 16px;\r\n  font-size: 14px;\r\n  color: #bdbdbd;\r\n  cursor: pointer;\r\n  border-radius: 16px;\r\n  transition: all 0.3s ease;\r\n  user-select: none;\r\n  z-index: 1;\r\n}\r\n\r\n.radio-group label:hover {\r\n  color: #4285f4;\r\n}\r\n\r\n.label-key {\r\n  width: 124px;\r\n  text-align: left;\r\n  margin-right: 10px;\r\n}\r\n\r\n.radio-group input[type='radio']:checked + label {\r\n  color: #4285f4;\r\n}\r\n\r\n.radio-group::before {\r\n  content: '';\r\n  position: absolute;\r\n  top: 4px;\r\n  left: 4px;\r\n  width: calc(50% - 4px);\r\n  height: calc(100% - 8px);\r\n  border-radius: 16px;\r\n  transition: all 0.3s ease;\r\n  z-index: 0;\r\n}\r\n\r\n.radio-group input[type='radio']:nth-of-type(2):checked ~ .radio-group::before {\r\n  transform: translateX(100%);\r\n}\r\n\r\nbutton {\r\n  width: 100%;\r\n  padding: 8px;\r\n  margin-top: 8px;\r\n  background-color: #4285f4;\r\n  color: white;\r\n  border: none;\r\n  border-radius: 4px;\r\n  cursor: pointer;\r\n  font-size: 16px;\r\n}\r\n\r\nbutton:hover {\r\n  background-color: #3367d6;\r\n}\r\n\r\n.privacy-notice {\r\n  margin: 2px 0 0 14px;\r\n  padding: 10px;\r\n  background-color: #f8f9fa;\r\n  border-left: 3px solid #4285f4;\r\n  font-size: 13px;\r\n}\r\n\r\n.privacy-link {\r\n  color: #4285f4;\r\n  text-decoration: none;\r\n  display: inline-block;\r\n  margin-top: 5px;\r\n}\r\n\r\n.privacy-link:hover {\r\n  text-decoration: underline;\r\n}\r\n\r\n.consent-container {\r\n  margin-top: 12px;\r\n  padding: 10px;\r\n  background-color: #fff8e1;\r\n  border-radius: 4px;\r\n  border: 2px dashed #ffe082;\r\n}\r\n\r\n.consent-container .checkbox-container {\r\n  margin-bottom: 0;\r\n}\r\n\r\n.disabled-notice {\r\n  color: #d32f2f;\r\n  font-weight: bold;\r\n  margin: 8px 0 0 44px;\r\n}\r\n\r\n.platforms-info {\r\n  margin-top: 12px;\r\n  padding: 4px 24px;\r\n  background-color: #e8f0fe;\r\n  border: 2px dashed #4285f4;\r\n  border-radius: 8px;\r\n  font-size: 12px;\r\n  color: #1a73e8;\r\n  font-weight: 500;\r\n}\r\n\r\n.platforms-info.unsupported {\r\n  background-color: #fce8e6;\r\n  border-color: #ea4335;\r\n  color: #d93025;\r\n}\r\n\r\n.status-message {\r\n  display: none;\r\n  padding: 8px;\r\n  text-align: center;\r\n  color: #4CAF50;\r\n  margin-top: 10px;\r\n  font-weight: bold;\r\n  background-color: #f1f8e9;\r\n  border-radius: 4px;\r\n} "],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/shared/styles/tampermonkey.css":
/*!********************************************!*\
  !*** ./src/shared/styles/tampermonkey.css ***!
  \********************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/.pnpm/css-loader@7.1.2_webpack@5.99.0/node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/.pnpm/css-loader@7.1.2_webpack@5.99.0/node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/.pnpm/css-loader@7.1.2_webpack@5.99.0/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/.pnpm/css-loader@7.1.2_webpack@5.99.0/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_pnpm_css_loader_7_1_2_webpack_5_99_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.tm-settings-panel {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 10000;
}

.tm-settings-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(64, 128, 255, 0.8), rgba(25, 239, 192, 0.6));
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: glowing 2s infinite;
  font-size: 20px;
}

.tm-fixed-settings-button {
  position: fixed;
  right: 20px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(64, 128, 255, 0.8), rgba(25, 239, 192, 0.6));
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: move;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: glowing 2s infinite;
  font-size: 20px;
  z-index: 10000;
  user-select: none;
  transition: transform 0.2s ease;
}

.tm-fixed-settings-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.tm-fixed-settings-button:active {
  transform: scale(0.95);
}

.tm-settings-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 80vw;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 10001;
  display: none;
}

.tm-settings-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
  text-align: center;
}

.option-container {
  margin-bottom: 16px;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 4px 16px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 8px;
  border-radius: 8px;
  cursor: pointer !important;
  transition: background-color 0.2s;
  font-size: 14px;
}

.checkbox-container:hover {
  background-color: #f5f5f5;
}

.checkbox-container input[type='checkbox'] {
  margin-right: 12px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #4285f4;
}

.radio-group {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 2px;
  background-color: #f5f5f5;
  border-radius: 20px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.radio-group input[type='radio'] {
  display: none;
}

.radio-group label {
  position: relative;
  padding: 6px 16px;
  font-size: 14px;
  color: #bdbdbd;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.3s ease;
  user-select: none;
  z-index: 1;
}

.radio-group label:hover {
  color: #4285f4;
}

.label-key {
  width: 124px;
  text-align: left;
  margin-right: 10px;
}

.radio-group input[type='radio']:checked + label {
  color: #4285f4;
}

.consent-container {
  margin-top: 12px;
  padding: 10px;
  background-color: #fff8e1;
  border-radius: 4px;
  border: 2px dashed #ffe082;
}

.consent-container .checkbox-container {
  margin-bottom: 0;
}

.disabled-notice {
  color: #d32f2f;
  font-weight: bold;
  margin: 8px 0 0 44px;
  font-size: 12px;
}

.privacy-notice {
  margin: 2px 0 0 14px;
  padding: 10px;
  background-color: #f8f9fa;
  border-left: 3px solid #4285f4;
  font-size: 13px;
}

.privacy-link {
  color: #4285f4;
  text-decoration: none;
  display: inline-block;
  margin-top: 5px;
}

.privacy-link:hover {
  text-decoration: underline;
}

.platforms-info {
  margin-top: 12px;
  padding: 4px 24px;
  background-color: #e8f0fe;
  border: 2px dashed #4285f4;
  border-radius: 8px;
  font-size: 12px;
  color: #1a73e8;
  font-weight: 500;
}

.platforms-info.unsupported {
  background-color: #fce8e6;
  border-color: #ea4335;
  color: #d93025;
}

button {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #3367d6;
}

.status-message {
  display: none;
  padding: 8px;
  text-align: center;
  color: #4CAF50;
  margin-top: 10px;
  font-weight: bold;
  background-color: #f1f8e9;
  border-radius: 4px;
}

/* 设置按钮样式 - 已不再使用，但保留以便未来可能的扩展 */
.ai-settings-button {
  position: absolute;
  padding: 4px 8px;
  background: linear-gradient(135deg, rgba(64, 128, 255, 0.6), rgba(25, 239, 192, 0.4));
  color: white;
  border: 2px dashed #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  z-index: 1000;
  animation: glowing 2s infinite;
}

.ai-settings-button:hover {
  background: linear-gradient(135deg, rgba(64, 128, 255, 0.8), rgba(25, 239, 192, 0.6));
} `, "",{"version":3,"sources":["webpack://./src/shared/styles/tampermonkey.css"],"names":[],"mappings":"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","sourcesContent":[".tm-settings-panel {\r\n  position: fixed;\r\n  right: 20px;\r\n  bottom: 20px;\r\n  z-index: 10000;\r\n}\r\n\r\n.tm-settings-icon {\r\n  width: 40px;\r\n  height: 40px;\r\n  background: linear-gradient(135deg, rgba(64, 128, 255, 0.8), rgba(25, 239, 192, 0.6));\r\n  border-radius: 50%;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  cursor: pointer;\r\n  margin-left: auto;\r\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\r\n  animation: glowing 2s infinite;\r\n  font-size: 20px;\r\n}\r\n\r\n.tm-fixed-settings-button {\r\n  position: fixed;\r\n  right: 20px;\r\n  width: 40px;\r\n  height: 40px;\r\n  background: linear-gradient(135deg, rgba(64, 128, 255, 0.8), rgba(25, 239, 192, 0.6));\r\n  border-radius: 50%;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  cursor: move;\r\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\r\n  animation: glowing 2s infinite;\r\n  font-size: 20px;\r\n  z-index: 10000;\r\n  user-select: none;\r\n  transition: transform 0.2s ease;\r\n}\r\n\r\n.tm-fixed-settings-button:hover {\r\n  transform: scale(1.1);\r\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.tm-fixed-settings-button:active {\r\n  transform: scale(0.95);\r\n}\r\n\r\n.tm-settings-content {\r\n  position: fixed;\r\n  top: 50%;\r\n  left: 50%;\r\n  transform: translate(-50%, -50%);\r\n  background: white;\r\n  border-radius: 8px;\r\n  padding: 20px;\r\n  width: 400px;\r\n  max-width: 80vw;\r\n  max-height: 80vh;\r\n  overflow-y: auto;\r\n  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);\r\n  z-index: 10001;\r\n  display: none;\r\n}\r\n\r\n.tm-settings-title {\r\n  font-size: 20px;\r\n  font-weight: bold;\r\n  margin-bottom: 16px;\r\n  color: #333;\r\n  text-align: center;\r\n}\r\n\r\n.option-container {\r\n  margin-bottom: 16px;\r\n  border: 2px dashed #e0e0e0;\r\n  border-radius: 12px;\r\n  padding: 4px 16px;\r\n}\r\n\r\n.checkbox-container {\r\n  display: flex;\r\n  align-items: center;\r\n  margin-bottom: 12px;\r\n  padding: 0 8px;\r\n  border-radius: 8px;\r\n  cursor: pointer !important;\r\n  transition: background-color 0.2s;\r\n  font-size: 14px;\r\n}\r\n\r\n.checkbox-container:hover {\r\n  background-color: #f5f5f5;\r\n}\r\n\r\n.checkbox-container input[type='checkbox'] {\r\n  margin-right: 12px;\r\n  width: 20px;\r\n  height: 20px;\r\n  cursor: pointer;\r\n  accent-color: #4285f4;\r\n}\r\n\r\n.radio-group {\r\n  position: relative;\r\n  display: inline-flex;\r\n  align-items: center;\r\n  margin-left: 2px;\r\n  background-color: #f5f5f5;\r\n  border-radius: 20px;\r\n  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n.radio-group input[type='radio'] {\r\n  display: none;\r\n}\r\n\r\n.radio-group label {\r\n  position: relative;\r\n  padding: 6px 16px;\r\n  font-size: 14px;\r\n  color: #bdbdbd;\r\n  cursor: pointer;\r\n  border-radius: 16px;\r\n  transition: all 0.3s ease;\r\n  user-select: none;\r\n  z-index: 1;\r\n}\r\n\r\n.radio-group label:hover {\r\n  color: #4285f4;\r\n}\r\n\r\n.label-key {\r\n  width: 124px;\r\n  text-align: left;\r\n  margin-right: 10px;\r\n}\r\n\r\n.radio-group input[type='radio']:checked + label {\r\n  color: #4285f4;\r\n}\r\n\r\n.consent-container {\r\n  margin-top: 12px;\r\n  padding: 10px;\r\n  background-color: #fff8e1;\r\n  border-radius: 4px;\r\n  border: 2px dashed #ffe082;\r\n}\r\n\r\n.consent-container .checkbox-container {\r\n  margin-bottom: 0;\r\n}\r\n\r\n.disabled-notice {\r\n  color: #d32f2f;\r\n  font-weight: bold;\r\n  margin: 8px 0 0 44px;\r\n  font-size: 12px;\r\n}\r\n\r\n.privacy-notice {\r\n  margin: 2px 0 0 14px;\r\n  padding: 10px;\r\n  background-color: #f8f9fa;\r\n  border-left: 3px solid #4285f4;\r\n  font-size: 13px;\r\n}\r\n\r\n.privacy-link {\r\n  color: #4285f4;\r\n  text-decoration: none;\r\n  display: inline-block;\r\n  margin-top: 5px;\r\n}\r\n\r\n.privacy-link:hover {\r\n  text-decoration: underline;\r\n}\r\n\r\n.platforms-info {\r\n  margin-top: 12px;\r\n  padding: 4px 24px;\r\n  background-color: #e8f0fe;\r\n  border: 2px dashed #4285f4;\r\n  border-radius: 8px;\r\n  font-size: 12px;\r\n  color: #1a73e8;\r\n  font-weight: 500;\r\n}\r\n\r\n.platforms-info.unsupported {\r\n  background-color: #fce8e6;\r\n  border-color: #ea4335;\r\n  color: #d93025;\r\n}\r\n\r\nbutton {\r\n  width: 100%;\r\n  padding: 8px;\r\n  margin-top: 8px;\r\n  background-color: #4285f4;\r\n  color: white;\r\n  border: none;\r\n  border-radius: 4px;\r\n  cursor: pointer;\r\n  font-size: 16px;\r\n}\r\n\r\nbutton:hover {\r\n  background-color: #3367d6;\r\n}\r\n\r\n.status-message {\r\n  display: none;\r\n  padding: 8px;\r\n  text-align: center;\r\n  color: #4CAF50;\r\n  margin-top: 10px;\r\n  font-weight: bold;\r\n  background-color: #f1f8e9;\r\n  border-radius: 4px;\r\n}\r\n\r\n/* 设置按钮样式 - 已不再使用，但保留以便未来可能的扩展 */\r\n.ai-settings-button {\r\n  position: absolute;\r\n  padding: 4px 8px;\r\n  background: linear-gradient(135deg, rgba(64, 128, 255, 0.6), rgba(25, 239, 192, 0.4));\r\n  color: white;\r\n  border: 2px dashed #fff;\r\n  border-radius: 4px;\r\n  cursor: pointer;\r\n  font-size: 16px;\r\n  z-index: 1000;\r\n  animation: glowing 2s infinite;\r\n}\r\n\r\n.ai-settings-button:hover {\r\n  background: linear-gradient(135deg, rgba(64, 128, 255, 0.8), rgba(25, 239, 192, 0.6));\r\n} "],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/shared/templates.ts":
/*!*********************************!*\
  !*** ./src/shared/templates.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSettingsPanelHTML: () => (/* binding */ createSettingsPanelHTML)
/* harmony export */ });
// 生成设置面板的HTML内容，为Chrome扩展和油猴脚本提供统一UI
function createSettingsPanelHTML(config, options = {}) {
    const { prefix = '', title = 'AI助手智能复制工具-设置', includePrivacyLink = true, privacyLinkUrl = 'privacy.html' } = options;
    // 为ID添加前缀以避免冲突
    const ids = {
        enableCopy: `${prefix}enableCopy`,
        formatMarkdown: `${prefix}formatMarkdown`,
        formatHtml: `${prefix}formatHtml`,
        removeReferences: `${prefix}removeReferences`,
        userConsent: `${prefix}user-consent`,
        consentStatus: `${prefix}consent-status`,
        saveButton: `${prefix}saveButton`,
        status: `${prefix}status`
    };
    return `
    <h2>${title}</h2>
    <div class="option-container">
      <div class="checkbox-container">
        <label for="${ids.enableCopy}" class="label-key">启用复制功能</label>
        <input type="checkbox" id="${ids.enableCopy}" ${config.enableCopy ? 'checked' : ''} />
      </div>
      <div class="checkbox-container">
        <label class="label-key">复制出的结果</label>
        <div class="radio-group">
          <input
            type="radio"
            id="${ids.formatMarkdown}"
            name="${prefix}copyFormat"
            value="markdown"
            ${config.copyFormat === 'markdown' ? 'checked' : ''}
          />
          <label for="${ids.formatMarkdown}">markdown</label>
          <input 
            type="radio" 
            id="${ids.formatHtml}" 
            name="${prefix}copyFormat" 
            value="html"
            ${config.copyFormat === 'html' ? 'checked' : ''}
          />
          <label for="${ids.formatHtml}">html格式</label>
        </div>
      </div>
      <div class="checkbox-container">
        <label for="${ids.removeReferences}" class="label-key">去除参考文献角标</label>
        <input type="checkbox" id="${ids.removeReferences}" ${config.removeReferences ? 'checked' : ''} />
      </div>
    </div>

    <div id="${prefix}consent-container" class="consent-container">
      <div class="checkbox-container">
        <input type="checkbox" id="${ids.userConsent}" ${config.userConsent ? 'checked' : ''} />
        <label for="${ids.userConsent}">
          <strong>我同意</strong>此扩展在我使用复制功能时临时处理内容
        </label>
      </div>
      <div id="${ids.consentStatus}" class="disabled-notice" style="${config.userConsent ? 'display: none;' : 'display: block;'}">
        请同意隐私政策以启用功能
      </div>
      <div class="privacy-notice">
        <strong>隐私说明：</strong>本扩展仅在您点击复制按钮时临时处理内容，所有数据处理均在本地完成，不会上传任何内容到服务器。
        ${includePrivacyLink ? `
        <a
          href="${privacyLinkUrl}"
          id="${prefix}privacy-link"
          target="blank"
          class="privacy-link"
        >查看完整隐私政策 »</a>
        ` : ''}
      </div>
    </div>
    
    <div class="platforms-info">
      支持平台：百度-AI搜索、字节-豆包、腾讯-元宝
    </div>
    <div class="platforms-info unsupported">
      无须支持平台：百度-文心一言、阿里-通义千问
    </div>
    
    <button id="${ids.saveButton}">保存设置</button>
    <div id="${ids.status}" class="status-message"></div>
  `;
}


/***/ }),

/***/ "./src/shared/types.ts":
/*!*****************************!*\
  !*** ./src/shared/types.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_CONFIG: () => (/* binding */ DEFAULT_CONFIG),
/* harmony export */   PLATFORMS: () => (/* binding */ PLATFORMS)
/* harmony export */ });
// 共享类型定义
// 导出默认配置
const DEFAULT_CONFIG = {
    removeReferences: true, // 默认去除参考文献角标
    userConsent: true, // 默认获得用户同意
    copyFormat: 'markdown',
    enableCopy: true // 默认启用复制功能
};
// 支持的AI平台配置
const PLATFORMS = [
    {
        name: '百度-AI搜索',
        selector: '[class*="cosd-markdown-content"]',
        markdownContentClass: 'marklang',
        removeSelectorList: ['span[disable-audio="true"][disable-copy="true"]', '.cosd-markdown-code-copy.cos-link']
    },
    {
        name: '字节-豆包',
        selector: '[class*="receive-message-box-content-"]',
        markdownContentClass: 'flow-markdown-body',
        removeSelectorList: ['.ref_content_circle', '.code-area [class*="header-"]', '[class*="canvas_wrapper-"]']
    },
    {
        name: '腾讯-元宝',
        selector: '[class*="hyc-content-md"]',
        markdownContentClass: 'hyc-common-markdown',
        removeSelectorList: ['.hyc-common-markdown__ref-list']
    }
];


/***/ }),

/***/ "./src/shared/ui.ts":
/*!**************************!*\
  !*** ./src/shared/ui.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTampermonkeySettingsHTML: () => (/* binding */ createTampermonkeySettingsHTML),
/* harmony export */   createTampermonkeySettingsPanel: () => (/* binding */ createTampermonkeySettingsPanel),
/* harmony export */   removeAllCopyButtons: () => (/* binding */ removeAllCopyButtons),
/* harmony export */   showStatusMessage: () => (/* binding */ showStatusMessage)
/* harmony export */ });
/* harmony import */ var _templates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./templates */ "./src/shared/templates.ts");

// 创建油猴设置面板的HTML内容
function createTampermonkeySettingsHTML(config) {
    return (0,_templates__WEBPACK_IMPORTED_MODULE_0__.createSettingsPanelHTML)(config, {
        prefix: 'tm-',
        includePrivacyLink: false // 油猴脚本中不包含隐私链接
    });
}
// 创建油猴设置面板
function createTampermonkeySettingsPanel(config, updateConfigCallback) {
    // 创建主容器
    const panelWrapper = document.createElement('div');
    panelWrapper.className = 'tm-settings-panel';
    // 创建设置图标
    const settingsIcon = document.createElement('div');
    settingsIcon.textContent = '⚙️';
    settingsIcon.className = 'tm-settings-icon';
    // 创建设置面板内容
    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'tm-settings-content';
    settingsPanel.innerHTML = createTampermonkeySettingsHTML(config);
    // 点击图标显示/隐藏设置面板
    settingsIcon.addEventListener('click', () => {
        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    });
    // 点击页面其他位置隐藏设置面板
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!panelWrapper.contains(target)) {
            settingsPanel.style.display = 'none';
        }
    });
    // 绑定设置变更事件
    settingsPanel.addEventListener('change', (e) => {
        const target = e.target;
        const newConfig = {};
        if (target.id === 'tm-remove-references') {
            newConfig.removeReferences = target.checked;
        }
        else if (target.id === 'tm-enableCopy') {
            newConfig.enableCopy = target.checked;
        }
        else if (target.id === 'tm-user-consent') {
            newConfig.userConsent = target.checked;
            const consentStatus = document.getElementById('tm-consent-status');
            if (consentStatus) {
                consentStatus.style.display = target.checked ? 'none' : 'block';
            }
        }
        else if (target.name === 'tm-copyFormat') {
            newConfig.copyFormat = target.value;
        }
        updateConfigCallback(newConfig);
    });
    // 保存按钮事件
    const saveButton = settingsPanel.querySelector('#tm-saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const statusElement = document.getElementById('tm-status');
            if (statusElement) {
                statusElement.textContent = '设置已保存';
                statusElement.style.display = 'block';
                // 2秒后隐藏提示
                setTimeout(() => {
                    statusElement.style.display = 'none';
                }, 2000);
            }
        });
    }
    // 添加到DOM
    panelWrapper.appendChild(settingsIcon);
    panelWrapper.appendChild(settingsPanel);
    return panelWrapper;
}
// 移除所有复制按钮
function removeAllCopyButtons() {
    const copyButtons = document.querySelectorAll('.ai-copy-button');
    copyButtons.forEach(button => button.remove());
}
// 显示临时状态消息
function showStatusMessage(element, message, options = {}) {
    const { duration = 2000, textColor = '#4CAF50', bgColor = '#f1f8e9' } = options;
    // 保存原始样式
    const originalDisplay = element.style.display;
    const originalText = element.textContent;
    const originalColor = element.style.color;
    const originalBgColor = element.style.backgroundColor;
    // 设置新样式并显示
    element.textContent = message;
    element.style.color = textColor;
    element.style.backgroundColor = bgColor;
    element.style.display = 'block';
    // 在指定时间后恢复
    setTimeout(() => {
        element.style.display = originalDisplay;
        element.textContent = originalText;
        element.style.color = originalColor;
        element.style.backgroundColor = originalBgColor;
    }, duration);
}


/***/ }),

/***/ "turndown":
/*!**********************************!*\
  !*** external "TurndownService" ***!
  \**********************************/
/***/ ((module) => {

module.exports = TurndownService;

/***/ }),

/***/ "turndown-plugin-gfm":
/*!************************************!*\
  !*** external "turndownPluginGfm" ***!
  \************************************/
/***/ ((module) => {

module.exports = turndownPluginGfm;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***********************************!*\
  !*** ./src/tampermonkey/index.ts ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/types */ "./src/shared/types.ts");
/* harmony import */ var _shared_copy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/copy */ "./src/shared/copy.ts");
/* harmony import */ var _shared_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/ui */ "./src/shared/ui.ts");
/* harmony import */ var _shared_templates__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/templates */ "./src/shared/templates.ts");
/* harmony import */ var _shared_styles_common_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shared/styles/common.css */ "./src/shared/styles/common.css");
/* harmony import */ var _shared_styles_tampermonkey_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shared/styles/tampermonkey.css */ "./src/shared/styles/tampermonkey.css");
// ==UserScript==
// @name         AI助手复制工具
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  为AI助手平台（通义千问、文心一言、豆包、元宝、百度）添加复制按钮，整理markdown文本并去除参考文献角标
// @author       AI助手复制工具
// @match        *://*.baidu.com/*
// @match        *://*.doubao.com/*
// @match        *://*.tencent.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.js
// @require      https://cdn.jsdelivr.net/npm/turndown-plugin-gfm@1.0.2/dist/turndown-plugin-gfm.js
// @downloadURL https://update.greasyfork.org/scripts/534533/AI%E5%8A%A9%E6%89%8B%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/534533/AI%E5%8A%A9%E6%89%8B%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==







(function () {
    'use strict';
    // 添加样式
    GM_addStyle(_shared_styles_common_css__WEBPACK_IMPORTED_MODULE_4__["default"]);
    GM_addStyle(_shared_styles_tampermonkey_css__WEBPACK_IMPORTED_MODULE_5__["default"]);
    // 添加动画样式
    document.head.appendChild((0,_shared_copy__WEBPACK_IMPORTED_MODULE_1__.createGlowingAnimationStyle)());
    // 配置
    const config = {
        removeReferences: GM_getValue('removeReferences', _shared_types__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_CONFIG.removeReferences),
        userConsent: GM_getValue('userConsent', _shared_types__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_CONFIG.userConsent),
        copyFormat: GM_getValue('copyFormat', _shared_types__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_CONFIG.copyFormat),
        enableCopy: GM_getValue('enableCopy', _shared_types__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_CONFIG.enableCopy)
    };
    // 复制到剪贴板函数 - 油猴脚本版本
    async function copyToClipboard(text) {
        GM_setClipboard(text);
    }
    // 更新配置方法
    function updateConfig(newConfig) {
        Object.assign(config, newConfig);
        // 保存到GM存储
        GM_setValue('removeReferences', config.removeReferences);
        GM_setValue('userConsent', config.userConsent);
        GM_setValue('copyFormat', config.copyFormat);
        GM_setValue('enableCopy', config.enableCopy);
        // 检查是否有用户同意
        const shouldApplyButtons = config.enableCopy && config.userConsent;
        if (shouldApplyButtons) {
            // 重新应用复制按钮
            (0,_shared_copy__WEBPACK_IMPORTED_MODULE_1__.applyToPlatforms)(_shared_types__WEBPACK_IMPORTED_MODULE_0__.PLATFORMS, config, turndownService, copyToClipboard);
        }
        else {
            // 如果用户不同意或禁用复制，移除所有复制按钮
            (0,_shared_ui__WEBPACK_IMPORTED_MODULE_2__.removeAllCopyButtons)();
        }
    }
    // 初始化 Turndown 服务
    const turndownService = (0,_shared_copy__WEBPACK_IMPORTED_MODULE_1__.initTurndownService)();
    // 创建MutationObserver实例
    let observer = null;
    // 设置面板实例
    let settingsPanel = null;
    // 设置面板位置状态
    const panelPosition = {
        top: GM_getValue('settingsPanelTop', 300),
        isDragging: false,
        dragStartY: 0,
        dragStartTop: 0,
        isPanelOpen: false,
        wasDragged: false
    };
    // 创建油猴设置面板的HTML内容
    function createTampermonkeySettingsHTML(config) {
        return (0,_shared_templates__WEBPACK_IMPORTED_MODULE_3__.createSettingsPanelHTML)(config, {
            prefix: 'tm-',
            includePrivacyLink: false // 油猴脚本中不包含隐私链接
        });
    }
    // 创建油猴设置面板
    function createTampermonkeySettingsPanel() {
        // 创建设置面板内容
        const settingsContent = document.createElement('div');
        settingsContent.className = 'tm-settings-content';
        settingsContent.innerHTML = createTampermonkeySettingsHTML(config);
        // 添加关闭按钮
        const closeButton = document.createElement('div');
        closeButton.className = 'tm-settings-close';
        closeButton.innerHTML = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '15px';
        closeButton.style.fontSize = '24px';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#999';
        closeButton.title = '关闭';
        // 定义关闭面板的函数
        const closePanel = () => {
            settingsContent.style.display = 'none';
            panelPosition.isPanelOpen = false;
        };
        // 关闭按钮点击事件
        closeButton.addEventListener('click', closePanel);
        // 绑定设置变更事件
        settingsContent.addEventListener('change', (e) => {
            const target = e.target;
            const newConfig = {};
            if (target.id === 'tm-removeReferences') {
                newConfig.removeReferences = target.checked;
            }
            else if (target.id === 'tm-enableCopy') {
                newConfig.enableCopy = target.checked;
            }
            else if (target.id === 'tm-user-consent') {
                newConfig.userConsent = target.checked;
                const consentStatus = document.getElementById('tm-consent-status');
                if (consentStatus) {
                    consentStatus.style.display = target.checked ? 'none' : 'block';
                }
            }
            else if (target.name === 'tm-copyFormat') {
                newConfig.copyFormat = target.value;
            }
            updateConfig(newConfig);
        });
        // 保存按钮事件
        const saveButton = settingsContent.querySelector('#tm-saveButton');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const statusElement = document.getElementById('tm-status');
                if (statusElement) {
                    (0,_shared_ui__WEBPACK_IMPORTED_MODULE_2__.showStatusMessage)(statusElement, '设置已保存');
                }
                // 保存后关闭设置面板
                setTimeout(() => {
                    closePanel();
                }, 1500);
            });
        }
        // 添加关闭按钮到面板内容
        settingsContent.appendChild(closeButton);
        return settingsContent;
    }
    // 创建单个设置按钮
    function createFixedSettingsButton() {
        const button = document.createElement('div');
        button.className = 'tm-fixed-settings-button';
        button.innerHTML = '⚙️';
        button.title = '设置';
        button.style.top = `${panelPosition.top}px`;
        button.style.position = 'fixed';
        button.style.right = '0';
        button.style.width = '30px';
        button.style.fontSize = '20px';
        button.style.textAlign = 'right';
        button.style.lineHeight = '30px';
        button.style.borderTopLeftRadius = '34px';
        button.style.borderBottomLeftRadius = '34px';
        button.style.cursor = 'pointer';
        button.style.background = 'linear-gradient(135deg, rgba(25, 239, 192, 0.6), rgba(64, 128, 255, 0.4))';
        // 添加点击事件，打开设置面板
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止冒泡到document
            // 如果刚刚拖动过，不触发打开面板
            if (panelPosition.wasDragged) {
                panelPosition.wasDragged = false;
                return;
            }
            openSettingsPanel();
        });
        // 添加拖动功能
        button.addEventListener('mousedown', (e) => {
            // 仅响应鼠标左键
            if (e.button !== 0)
                return;
            // 如果面板已打开，不允许拖动按钮
            if (panelPosition.isPanelOpen) {
                e.stopPropagation();
                return;
            }
            panelPosition.isDragging = true;
            panelPosition.wasDragged = false; // 重置拖动状态
            panelPosition.dragStartY = e.clientY;
            panelPosition.dragStartTop = panelPosition.top;
            e.preventDefault(); // 防止文本选择
            // 添加临时全局鼠标事件监听器
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
        return button;
    }
    // 处理鼠标移动事件
    function handleMouseMove(e) {
        if (!panelPosition.isDragging)
            return;
        const button = document.querySelector('.tm-fixed-settings-button');
        if (!button)
            return;
        // 计算新位置
        const deltaY = e.clientY - panelPosition.dragStartY;
        // 如果移动距离大于5像素，标记为已拖动
        if (Math.abs(deltaY) > 5) {
            panelPosition.wasDragged = true;
        }
        const newTop = Math.max(10, panelPosition.dragStartTop + deltaY);
        const maxTop = window.innerHeight - 50; // 防止按钮被拖到屏幕外
        panelPosition.top = Math.min(newTop, maxTop);
        button.style.top = `${panelPosition.top}px`;
        // 如果面板是打开的，同时更新面板位置
        if (panelPosition.isPanelOpen && settingsPanel) {
            const settingsContent = settingsPanel.querySelector('.tm-settings-content');
            if (settingsContent) {
                adjustPanelPosition(settingsContent);
            }
        }
    }
    // 处理鼠标松开事件
    function handleMouseUp(e) {
        if (!panelPosition.isDragging)
            return;
        panelPosition.isDragging = false;
        // 保存新位置到GM存储
        GM_setValue('settingsPanelTop', panelPosition.top);
        // 移除临时事件监听器
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        // 阻止事件冒泡，防止触发click事件
        e.preventDefault();
        e.stopPropagation();
    }
    // 调整面板位置，确保在屏幕内
    function adjustPanelPosition(panel) {
        const button = document.querySelector('.tm-fixed-settings-button');
        if (!button || !panel)
            return;
        const buttonRect = button.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        // 设置面板固定定位
        panel.style.position = 'fixed';
        // 水平位置：从按钮左侧开始，向左展开
        panel.style.right = `${buttonRect.width}px`;
        panel.style.background = '#fff';
        panel.style.padding = '20px';
        panel.style.width = '500px';
        panel.style.border = '2px dashed rgb(186 186 186)';
        panel.style.borderRadius = '10px';
        panel.style.zIndex = '999';
        // 计算垂直位置
        const buttonTop = buttonRect.top;
        const windowHeight = window.innerHeight;
        const panelHeight = panelRect.height;
        // 自动调整，优先在按钮下方显示
        if (buttonTop + panelHeight < windowHeight) {
            // 如果面板在按钮下方能完全显示
            panel.style.top = `${buttonTop}px`;
            panel.style.bottom = 'auto';
        }
        else if (buttonTop - panelHeight > 0) {
            // 如果面板在按钮上方能完全显示
            panel.style.bottom = `${windowHeight - buttonTop}px`;
            panel.style.top = 'auto';
        }
        else {
            // 都显示不全，尽量适应屏幕
            if (buttonTop < windowHeight / 2) {
                // 按钮在屏幕上半部分，面板放在下方
                panel.style.top = `${buttonTop}px`;
                panel.style.bottom = 'auto';
                panel.style.maxHeight = `${windowHeight - buttonTop - 20}px`;
                panel.style.overflowY = 'auto';
            }
            else {
                // 按钮在屏幕下半部分，面板放在上方
                panel.style.bottom = `${windowHeight - buttonTop}px`;
                panel.style.top = 'auto';
                panel.style.maxHeight = `${buttonTop - 20}px`;
                panel.style.overflowY = 'auto';
            }
        }
    }
    // 打开设置面板的方法
    function openSettingsPanel() {
        // 如果设置面板不存在，则创建
        if (!settingsPanel) {
            settingsPanel = createTampermonkeySettingsPanel();
            document.body.appendChild(settingsPanel);
            // 添加点击外部区域关闭面板
            document.addEventListener('click', (e) => {
                if (panelPosition.isPanelOpen && settingsPanel) {
                    const button = document.querySelector('.tm-fixed-settings-button');
                    // 检查点击是否在面板或按钮外部
                    if (!settingsPanel.contains(e.target) &&
                        !button.contains(e.target)) {
                        settingsPanel.style.display = 'none';
                        panelPosition.isPanelOpen = false;
                    }
                }
            });
        }
        // 显示设置面板
        if (settingsPanel) {
            settingsPanel.style.display = 'block';
            panelPosition.isPanelOpen = true;
            // 调整面板位置
            adjustPanelPosition(settingsPanel);
        }
    }
    // 初始化
    function init() {
        console.log('AI助手复制工具已加载');
        // 添加固定设置按钮
        const fixedSettingsButton = createFixedSettingsButton();
        document.body.appendChild(fixedSettingsButton);
        // 检查是否有用户同意
        const shouldApplyButtons = config.enableCopy && config.userConsent;
        if (shouldApplyButtons) {
            // 应用复制按钮
            (0,_shared_copy__WEBPACK_IMPORTED_MODULE_1__.applyToPlatforms)(_shared_types__WEBPACK_IMPORTED_MODULE_0__.PLATFORMS, config, turndownService, copyToClipboard);
            // 启动观察器
            observer = (0,_shared_copy__WEBPACK_IMPORTED_MODULE_1__.observeDOMChanges)(_shared_types__WEBPACK_IMPORTED_MODULE_0__.PLATFORMS, config, turndownService, copyToClipboard);
        }
    }
    // 页面加载完成后执行初始化操作
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    }
    else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

})();

/******/ })()
;
//# sourceMappingURL=ai-assistant-copy-tool.js.map
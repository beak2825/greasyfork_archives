// ==UserScript==
// @name         deepseek-helper-userscript
// @namespace    https://github.com/llm-sec/deepseek-helper-userscript
// @version      0.0.1
// @description  this is userscript's description
// @document     https://github.com/llm-sec/deepseek-helper-userscript
// @author       CC11001100 <CC11001100@qq.com>
// @match        https://chat.deepseek.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/526389/deepseek-helper-userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/526389/deepseek-helper-userscript.meta.js
// ==/UserScript==


//    8888888b.                              .d8888b.                    888
//    888  "Y88b                            d88P  Y88b                   888
//    888    888                            Y88b.                        888
//    888    888  .d88b.   .d88b.  88888b.   "Y888b.    .d88b.   .d88b.  888  888
//    888    888 d8P  Y8b d8P  Y8b 888 "88b     "Y88b. d8P  Y8b d8P  Y8b 888 .88P
//    888    888 88888888 88888888 888  888       "888 88888888 88888888 888888K
//    888  .d88P Y8b.     Y8b.     888 d88P Y88b  d88P Y8b.     Y8b.     888 "88b
//    8888888P"   "Y8888   "Y8888  88888P"   "Y8888P"   "Y8888   "Y8888  888  888
//                                 888
//                                 888
//                                 888
//    

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ init)
/* harmony export */ });
/* harmony import */ var _crazy_retry_crazy_retry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _logger_Logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/**
 * 应用初始化模块
 *
 * 此模块负责整合并执行应用启动时所需的各项初始化任务
 * 通过统一入口管理初始化流程，确保启动顺序和依赖关系
 */
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


/**
 * 应用主初始化函数
 *
 * @async
 * @function
 * @description 执行核心初始化流程，当前包含：
 * - 异常重试机制初始化
 *
 * @example
 * // 在应用启动入口调用
 * import init from './init/init';
 * await init();
 *
 * @returns {Promise<void>} 初始化完成Promise
 */
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        _logger_Logger__WEBPACK_IMPORTED_MODULE_1__["default"].configure({
            level: _logger_Logger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.DEBUG,
            enableColors: false
        });
        // 初始化异常重试机制
        // 配置全局请求失败时的重试策略
        yield (0,_crazy_retry_crazy_retry__WEBPACK_IMPORTED_MODULE_0__["default"])();
        // 可在此处添加其他初始化任务
        // 例如：await initLogger();
        //      await initAnalytics();
    });
}


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ runCrazyRetry)
/* harmony export */ });
/* harmony import */ var _selector_SessionElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _utils_sleep_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _ui_component_Toast__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _selector_DeepSeekToastElement__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _logger_Logger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8);
/* harmony import */ var _utils_element_fingerprint__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






// 指数退避配置参数
const RETRY_CONFIG = {
    BASE_DELAY: 1000,
    MAX_DELAY: 64 * 1000,
    BACKOFF_FACTOR: 2
};
// 新增元素级重试限制配置
const ELEMENT_RETRY_LIMIT = 128; // 每个元素最大重试次数
const elementRetryMap = new Map(); // 存储元素哈希和重试次数的映射
function runCrazyRetry() {
    return __awaiter(this, void 0, void 0, function* () {
        _logger_Logger__WEBPACK_IMPORTED_MODULE_4__["default"].info("启动智能重试功能（元素级指数退避重试限制）");
        let currentDelay = RETRY_CONFIG.BASE_DELAY;
        let lastContentHash = null;
        while (true) {
            try {
                yield (0,_utils_sleep_util__WEBPACK_IMPORTED_MODULE_1__["default"])(currentDelay);
                const session = new _selector_SessionElement__WEBPACK_IMPORTED_MODULE_0__["default"]();
                const lastAnswerElement = session.findLastAnswerElement();
                if (!lastAnswerElement) {
                    handleNoElementCase();
                    continue;
                }
                const currentHash = yield getContentHash(lastAnswerElement);
                // 检测到新内容时清理旧记录的计数器
                if (currentHash && currentHash !== lastContentHash) {
                    cleanupOldHashRecord(lastContentHash);
                    lastContentHash = currentHash;
                }
                // 检查元素重试次数
                if (currentHash && isElementOverRetryLimit(currentHash)) {
                    handleRetryLimit(currentHash);
                    continue;
                }
                if (!lastAnswerElement.isServerBusy()) {
                    handleUnchangedContent();
                    continue;
                }
                yield performRetry(lastAnswerElement);
                resetBackoff();
            }
            catch (error) {
                yield handleRetryError(error, lastContentHash);
                updateBackoff();
            }
        }
        // 内部工具函数
        function getContentHash(element) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return (0,_utils_element_fingerprint__WEBPACK_IMPORTED_MODULE_5__["default"])(element.answerElement);
                }
                catch (_a) {
                    return null;
                }
            });
        }
        function isElementOverRetryLimit(hash) {
            const count = elementRetryMap.get(hash) || 0;
            return count >= ELEMENT_RETRY_LIMIT;
        }
        function cleanupOldHashRecord(oldHash) {
            if (oldHash && elementRetryMap.has(oldHash)) {
                elementRetryMap.delete(oldHash);
                _logger_Logger__WEBPACK_IMPORTED_MODULE_4__["default"].debug(`清理旧元素记录: ${oldHash}`);
            }
        }
        function handleNoElementCase() {
            _logger_Logger__WEBPACK_IMPORTED_MODULE_4__["default"].debug("未检测到回答元素，保持退避策略");
        }
        function handleRetryLimit(hash) {
            _logger_Logger__WEBPACK_IMPORTED_MODULE_4__["default"].warn(`元素 ${hash.slice(0, 6)}... 已达重试上限（${ELEMENT_RETRY_LIMIT}次）`);
            _ui_component_Toast__WEBPACK_IMPORTED_MODULE_2__["default"].show("当前内容已达重试上限，请手动刷新", 5000);
            currentDelay = RETRY_CONFIG.MAX_DELAY; // 进入最大等待状态
        }
        function handleUnchangedContent() {
            _logger_Logger__WEBPACK_IMPORTED_MODULE_4__["default"].debug("内容未更新，维持退避策略");
        }
        function performRetry(element) {
            return __awaiter(this, void 0, void 0, function* () {
                _logger_Logger__WEBPACK_IMPORTED_MODULE_4__["default"].info(`[重试 ${elementRetryMap.get(lastContentHash) || 0 + 1}/${ELEMENT_RETRY_LIMIT}] 服务器繁忙`);
                _ui_component_Toast__WEBPACK_IMPORTED_MODULE_2__["default"].show("检测到回答失败，尝试自动刷新响应...", 3000);
                element.clickRefreshBtn();
                const toastElement = yield _selector_DeepSeekToastElement__WEBPACK_IMPORTED_MODULE_3__["default"].captureDeepSeekToast(3000);
                if (toastElement === null || toastElement === void 0 ? void 0 : toastElement.isTooFast()) {
                    throw new Error("CLICK_TOO_FAST");
                }
            });
        }
        function handleRetryError(error, hash) {
            return __awaiter(this, void 0, void 0, function* () {
                if (error.message === "CLICK_TOO_FAST") {
                    yield handleTooFastError();
                }
                else {
                    updateElementRetryCount(hash);
                    _logger_Logger__WEBPACK_IMPORTED_MODULE_4__["default"].error(`重试异常: ${error.message}`);
                }
            });
        }
        function updateElementRetryCount(hash) {
            if (hash) {
                const count = (elementRetryMap.get(hash) || 0) + 1;
                elementRetryMap.set(hash, count);
                _logger_Logger__WEBPACK_IMPORTED_MODULE_4__["default"].debug(`元素 ${hash.slice(0, 6)}... 重试计数: ${count}/${ELEMENT_RETRY_LIMIT}`);
            }
        }
        function handleTooFastError() {
            return __awaiter(this, void 0, void 0, function* () {
                const waitMinutes = 30;
                _logger_Logger__WEBPACK_IMPORTED_MODULE_4__["default"].warn(`操作频率限制，等待${waitMinutes}分钟`);
                _ui_component_Toast__WEBPACK_IMPORTED_MODULE_2__["default"].show(`操作过快，触发高等级封禁，功能临时不可用，${waitMinutes}分钟后再试`, 60 * 30 * 1000);
                yield (0,_utils_sleep_util__WEBPACK_IMPORTED_MODULE_1__["default"])(1000 * 60 * 30);
                resetBackoff();
            });
        }
        function updateBackoff() {
            currentDelay = Math.min(currentDelay * RETRY_CONFIG.BACKOFF_FACTOR, RETRY_CONFIG.MAX_DELAY);
            _logger_Logger__WEBPACK_IMPORTED_MODULE_4__["default"].debug(`退避策略更新 → 等待时长：${currentDelay}ms`);
        }
        function resetBackoff() {
            currentDelay = RETRY_CONFIG.BASE_DELAY;
            _logger_Logger__WEBPACK_IMPORTED_MODULE_4__["default"].debug("重置基础等待时间");
        }
    });
}


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SessionElement)
/* harmony export */ });
/* harmony import */ var _AnswertElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
// [file name]: Session.ts

/**
 * 会话元素管理类
 * 处理当前会话中回答元素的定位和操作
 */
class SessionElement {
    /**
     * 查找最近生成的回答元素
     * @returns 最新回答元素的封装对象，找不到返回null
     */
    findLastAnswerElement() {
        var _a, _b;
        // 通过DOM层级关系定位回答元素（依赖当前DOM结构）
        const refreshBtn = this.findLastRefreshIcon();
        const answerElement = (_b = (_a = refreshBtn === null || refreshBtn === void 0 ? void 0 : refreshBtn.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
        return answerElement ? new _AnswertElement__WEBPACK_IMPORTED_MODULE_0__["default"](answerElement) : null;
    }
    /**
     * 查找最后一个刷新按钮元素
     * @private
     * @returns 包含#重新生成子元素的按钮，找不到返回null
     */
    findLastRefreshIcon() {
        // 获取所有候选按钮元素
        const elements = document.querySelectorAll('.ds-icon-button');
        // 逆向遍历查找最新元素（从最后元素开始）
        for (let i = elements.length - 1; i >= 0; i--) {
            const element = elements[i];
            // 通过ID选择器验证按钮功能
            if (element.querySelector('#重新生成')) {
                return element;
            }
        }
        return null;
    }
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnswertElement)
/* harmony export */ });
// [file name]: AnswertElement.ts
/**
 * 回答元素封装类
 * 封装单个回答元素的DOM操作和状态判断
 */
class AnswertElement {
    /**
     * 构造函数
     * @param answerElement - 需要封装的回答元素DOM节点
     */
    constructor(answerElement) {
        this.answerElement = answerElement;
    }
    /**
     * 判断当前回答是否显示服务器繁忙状态
     * @returns 当回答内容包含"服务器繁忙，请稍后再试。"时返回true
     */
    isServerBusy() {
        var _a;
        // 通过特定class选择器定位内容区域
        const content = this.answerElement.querySelector(".ds-markdown");
        return ((_a = content === null || content === void 0 ? void 0 : content.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "服务器繁忙，请稍后再试。";
    }
    /**
     * 点击当前回答的刷新按钮
     * @returns 找到并点击按钮返回true，否则返回false
     */
    clickRefreshBtn() {
        // 在当前回答元素范围内搜索按钮（限定查找范围避免干扰其他会话）
        const buttons = this.answerElement.querySelectorAll('.ds-icon-button');
        // 逆向遍历查找最新按钮（从最后元素开始）
        for (let i = buttons.length - 1; i >= 0; i--) {
            const btn = buttons[i];
            if (btn.querySelector('#重新生成')) {
                // 执行点击操作
                btn.click();
                return true;
            }
        }
        return false;
    }
}


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sleep)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * 异步休眠函数
 * @param ms 休眠时间（毫秒）
 * @returns Promise<void>
 *
 * @example
 * // 在async函数中使用
 * async function demo() {
 *   console.log('开始');
 *   await sleep(2000); // 暂停2秒
 *   console.log('2秒后执行');
 * }
 */
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, ms));
    });
}


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Toast)
/* harmony export */ });
/**
 * 提示框工具类
 * 提供静态方法调用的提示框功能
 */
class Toast {
    /**
     * 初始化样式（惰性加载）
     */
    static ensureStylesInjected() {
        if (!Toast.styleElement) {
            const style = document.createElement('style');
            style.textContent = `
                .custom-tip {
                    position: fixed;
                    top: 100px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #4CAF50;
                    color: white;
                    padding: 15px 25px;
                    border-radius: 25px;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
                    opacity: 0;
                    animation: fadeIn 0.3s forwards;
                    z-index: 1000;
                }

                @keyframes fadeIn {
                    to { opacity: 1; }
                }

                .fade-out {
                    animation: fadeOut 0.3s forwards !important;
                }

                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            Toast.styleElement = style;
        }
    }
    /**
     * 显示提示框
     * @param text 提示文字
     * @param duration 显示持续时间（毫秒），默认3000
     */
    static show(text, duration = 3000) {
        Toast.ensureStylesInjected();
        const tip = Toast.createTipElement(text);
        Toast.setupAutoClose(tip, duration);
    }
    /**
     * 创建提示框元素
     */
    static createTipElement(text) {
        const tip = document.createElement('div');
        tip.className = 'custom-tip';
        tip.textContent = text;
        document.body.appendChild(tip);
        return tip;
    }
    /**
     * 设置自动关闭逻辑
     */
    static setupAutoClose(element, duration) {
        setTimeout(() => {
            element.classList.add('fade-out');
            element.addEventListener('animationend', () => {
                element.remove();
            }, { once: true });
        }, duration);
    }
}
// 使用示例：
// Tips.show('操作成功！');
// Tips.show('文件已上传', 5000);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeepSeekToastElement)
/* harmony export */ });
/* harmony import */ var _utils_sleep_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// [file name]: DeepSeekToastElement.ts

/**
 * Toast提示元素封装类
 * 用于操作和管理DeepSeek系统中的Toast提示组件
 */
class DeepSeekToastElement {
    /**
     * 构造函数
     * @param toastElement - 需要封装的Toast元素DOM节点
     */
    constructor(toastElement) {
        this.toastElement = toastElement;
    }
    /**
     * 捕获Toast元素（带超时的轮询方法）
     * @param timeoutMs - 最大等待时间（毫秒）
     * @returns Promise<DeepSeekToastElement | null> 成功捕获返回实例，超时返回null
     *
     * @example
     * // 等待最多3秒捕获Toast
     * const toast = await DeepSeekToastElement.captureDeepSeekToast(3000);
     * if(toast?.isTooFast()) {
     *   // 处理频率过高情况
     * }
     */
    static captureDeepSeekToast(timeoutMs) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTs = Date.now();
            while (Date.now() - startTs < timeoutMs) {
                // 通过复合选择器定位完整Toast容器
                const element = document.querySelector(".ds-toast__content");
                if (element === null || element === void 0 ? void 0 : element.parentElement) {
                    return new DeepSeekToastElement(element.parentElement);
                }
                // 每100ms轮询一次以平衡性能与响应速度
                yield (0,_utils_sleep_util__WEBPACK_IMPORTED_MODULE_0__["default"])(100);
            }
            return null;
        });
    }
    /**
     * 获取弹窗内容
     */
    getContent() {
        var _a, _b;
        return ((_b = (_a = this.toastElement.querySelector(".ds-toast__content")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "";
    }
    /**
     * 判断是否为"发送频率过快"提示
     * @returns 当Toast内容匹配预设文案时返回true
     */
    isTooFast() {
        // 精确匹配系统预设提示文案
        return this.getContent() === "你发送消息的频率过快，请稍后再发";
    }
}


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LogLevel: () => (/* binding */ LogLevel),
/* harmony export */   Logger: () => (/* binding */ Logger),
/* harmony export */   "default": () => (/* binding */ logger)
/* harmony export */ });
// Logger.ts
/**
 * 日志级别枚举
 * DEBUG < INFO < WARN < ERROR < NONE
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["NONE"] = 4] = "NONE"; // 关闭所有日志
})(LogLevel || (LogLevel = {}));
// 默认配置选项
const DEFAULT_OPTIONS = {
    level: LogLevel.DEBUG,
    enableTimestamp: true,
    enableColors: true,
};
/**
 * 浏览器环境日志记录器
 * 功能特性：
 * - 分级日志输出
 * - 颜色区分级别
 * - 动态配置
 * - 保留原始调用堆栈
 */
class Logger {
    constructor(options = {}) {
        // 各日志级别的CSS样式配置
        this.colorStyles = {
            [LogLevel.DEBUG]: 'color: #666; background-color: #f0f0f0',
            [LogLevel.INFO]: 'color: #1e88e5; background-color: #e3f2fd',
            [LogLevel.WARN]: 'color: #ffa000; background-color: #fff3e0',
            [LogLevel.ERROR]: 'color: #d32f2f; background-color: #ffebee',
            [LogLevel.NONE]: '' // NONE级别不需要样式
        };
        this.options = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
    }
    // 设置日志级别
    setLevel(level) {
        this.options.level = level;
    }
    // 动态更新配置
    configure(options) {
        this.options = Object.assign(Object.assign({}, this.options), options);
    }
    // 调试日志
    debug(...args) {
        this.log(LogLevel.DEBUG, args);
    }
    // 信息日志
    info(...args) {
        this.log(LogLevel.INFO, args);
    }
    // 警告日志
    warn(...args) {
        this.log(LogLevel.WARN, args);
    }
    // 错误日志
    error(...args) {
        this.log(LogLevel.ERROR, args);
    }
    // 获取ISO格式时间戳
    getTimestamp() {
        return new Date().toISOString();
    }
    // 获取日志级别标签
    getLabel(level) {
        const labels = {
            [LogLevel.DEBUG]: 'DEBUG',
            [LogLevel.INFO]: 'INFO',
            [LogLevel.WARN]: 'WARN',
            [LogLevel.ERROR]: 'ERROR',
            [LogLevel.NONE]: 'NONE'
        };
        return labels[level] || 'LOG';
    }
    /**
     * 核心日志方法
     * @param level 日志级别
     * @param args 日志参数
     */
    log(level, args) {
        // 过滤低于当前级别的日志
        if (level < this.options.level)
            return;
        const label = this.getLabel(level);
        const timestamp = this.options.enableTimestamp ? `${this.getTimestamp()} ` : '';
        const styles = this.options.enableColors
            ? this.colorStyles[level]
            : '';
        // 构造格式化参数，保留原始调用堆栈
        const formattedArgs = [
            `%c${timestamp}${label}:`, // 带样式的首参数
            styles, // CSS样式
            ...args // 原始日志内容
        ];
        // 根据级别调用对应的console方法
        switch (level) { // ✅ 正确变量名（小写level）
            case LogLevel.DEBUG:
                console.debug(...formattedArgs); // ✅ 正确方法名和变量名
                break;
            case LogLevel.INFO: // ✅ 正确枚举值
                console.info(...formattedArgs);
                break;
            case LogLevel.WARN:
                console.warn(...formattedArgs); // ✅ 正确方法名
                break;
            case LogLevel.ERROR:
                console.error(...formattedArgs);
                break;
            default:
                // 穷举检查确保处理所有枚举值
                console.info(...formattedArgs);
                break;
        }
    }
}
// 导出默认单例实例
const logger = new Logger();

/* 使用示例：
// 基础使用
logger.debug('User login', { username: 'alice' });
logger.info('API response', responseData);
logger.warn('Deprecation warning');
logger.error('Network error', error);

// 生产环境配置
logger.configure({
  level: LogLevel.ERROR,
  enableColors: false
});

// 自定义实例
const customLogger = new Logger({
  enableTimestamp: false,
  level: LogLevel.WARN
});
*/ 


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getElementFingerprint)
/* harmony export */ });
/**
 * 生成HTML元素的字符串指纹
 * @param element - 目标元素
 * @returns 元素的指纹哈希值
 */
function getElementFingerprint(element) {
    var _a;
    // 1. 提取核心特征
    const features = {
        tag: element.tagName.toLowerCase(),
        id: element.id,
        classes: Array.from(element.classList).sort().join(' '),
        text: ((_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim().replace(/\s+/g, ' ')) || '',
        children: element.children.length,
        attributes: getKeyAttributes(element)
    };
    // 2. 生成特征字符串
    const featureString = JSON.stringify(features);
    // 3. 计算哈希值
    return simpleHash(featureString);
}
/**
 * 获取元素的关键自定义属性
 * @param element - 目标元素
 * @returns 包含data-*属性的对象
 */
function getKeyAttributes(element) {
    const attrs = {};
    Array.from(element.attributes).forEach((attr) => {
        if (attr.name.startsWith('data-')) {
            attrs[attr.name] = attr.value;
        }
    });
    return attrs;
}
/**
 * 快速哈希函数（32位）
 * @param str - 输入字符串
 * @returns 十六进制哈希值
 */
function simpleHash(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) + hash + str.charCodeAt(i);
    }
    return (hash & 0x7fffffff).toString(16);
}
// // 使用示例
// const element = document.getElementById('app') as HTMLElement;
// if (element) {
//     console.log(getElementFingerprint(element));
//
//     // 修改内容后重新生成
//     element.textContent = 'Updated Content';
//     console.log(getElementFingerprint(element));
// }


/***/ })
/******/ 	]);
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
/******/ 			// no module.id needed
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
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _init_init__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/**
 * 应用主入口文件
 *
 * 该文件是应用的启动入口，负责调用初始化函数并启动应用。
 * 使用立即执行的异步函数来处理初始化过程中的异步操作。
 */
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// 引入初始化模块，该模块负责应用启动前的配置、服务连接等初始化工作

/**
 * 异步立即执行函数
 *
 * 使用IIFE(立即调用函数表达式)包裹异步逻辑，便于使用await语法
 * 在初始化完成后可根据需要扩展其他启动逻辑
 */
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 执行初始化流程并等待完成
        yield (0,_init_init__WEBPACK_IMPORTED_MODULE_0__["default"])();
        // 初始化完成后可添加其他启动逻辑
        // 例如：启动HTTP服务、注册定时任务等
    }
    catch (error) {
        // 捕获并处理初始化过程中出现的错误
        console.error("DeepSeek助手初始化失败:", error);
    }
}))();

})();

/******/ })()
;
//# sourceMappingURL=index.js.map
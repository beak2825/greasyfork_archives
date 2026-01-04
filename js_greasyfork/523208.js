// ==UserScript==
// @name         js-script-hook
// @namespace    https://github.com/JSREI/js-script-hook.git
// @version      0.3
// @description  用来给script类型的请求打断点
// @document     https://github.com/JSREI/js-script-hook.git
// @author       CC11001100 <CC11001100@qq.com>
// @match        *://*/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/419533/js-script-hook.user.js
// @updateURL https://update.greasyfork.org/scripts/419533/js-script-hook.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {registerMenu, show} = __webpack_require__(2);
const {getUnsafeWindow} = __webpack_require__(14);
const {DocumentHook} = __webpack_require__(15);
const {initConfig, getGlobalConfig} = __webpack_require__(5);
const {ConfigurationComponent} = __webpack_require__(3);

/**
 * 初始化整个脚本
 */
function init() {

    // 加载配置
    initConfig();

    // 增加可视化的配置
    registerMenu();

    // 为document增加hook点
    new DocumentHook(getUnsafeWindow().document).addHook();

    if (GM_getValue("js-script-hook-open-configuration")) {
        GM_setValue("js-script-hook-open-configuration", false);
        show();
    }

}

module.exports = {
    init
}


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {ConfigurationComponent} = __webpack_require__(3);
const {appendScriptHookStyleToCurrentPage} = __webpack_require__(13);
const {getGlobalConfig} = __webpack_require__(5);

function registerMenu() {
    let id = GM_registerMenuCommand(
        "Configuration",
        function () {

            if (getGlobalConfig().autoJumpProjectSiteOnConfiguraion) {
                // 重定向到项目的主页，要不然怕有样式不兼容
                GM_setValue("js-script-hook-open-configuration", true);
                if (!currentInProjectRepo()) {
                    window.location.href = "https://github.com/JSREI/js-script-hook";
                } else {
                    if (!GM_getValue("js-script-hook-open-configuration")) {
                        return;
                    }
                    GM_setValue("js-script-hook-open-configuration", false);
                    show();
                }
            } else {
                show();
            }
        }
    );
}

function show() {
    // 只在需要的时候才追加样式表，尽可能的避免样式污染
    appendScriptHookStyleToCurrentPage();
    const configurationComponent = new ConfigurationComponent();
    configurationComponent.show();
}

function currentInProjectRepo() {
    return window.location.href.toLowerCase().startsWith("https://github.com/jsrei/js-script-hook");
}

module.exports = {
    registerMenu,
    show
}



/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {GlobalOptionsComponent} = __webpack_require__(4);
const {DebuggerManagerComponent} = __webpack_require__(9);
const {getGlobalConfig} = __webpack_require__(5);
const {getLanguage} = __webpack_require__(12);

/**
 * 配置组件
 */
class ConfigurationComponent {

    constructor() {
        this.modalHTML = `
        <div id="jsrei-js-script-hook-configuration-modal-window" style="display:none !important; position:fixed !important; left:0 !important; top:0 !important; width:100% !important; height:100% !important; background-color:rgba(0,0,0,0.85) !important; z-index:2147483646 !important; overflow-y:auto !important;">
            <div class="js-script-hook-scrollable-div" style="display: flex; width: 930px !important; text-align: center !important; padding: 30px !important; margin: 10px !important; position:absolute !important; left:50% !important; top:50% !important; transform:translate(-50%, -50%) !important; background:white !important; border-radius:5px !important; box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important; max-width:80% !important; text-align:center !important; z-index:99999999999; !important">
                <button id="jsrei-js-script-hook-configuration-close-btn" style="position:absolute; right:8px; top:8px; cursor:pointer; padding:3px 6px; border:none; background-color:#f44336; color:white; border-radius:50%; font-size:10px;">×</button>
                <div id="js-script-hook-configuration-content" style="color: black;"></div>
            </div>
        </div>
    `;
    }

    /**
     * 展示配置界面
     */
    show() {

        // i18n配置语言
        let language = getLanguage(getGlobalConfig().language);

        // 将模态框添加到body元素中
        $(document.body).append($(this.modalHTML));

        // 全局配置参数
        const globalOptionsComponent = new GlobalOptionsComponent();
        $("#js-script-hook-configuration-content").append(globalOptionsComponent.render(language, getGlobalConfig()));

        // 断点参数
        const debuggerManager = new DebuggerManagerComponent();
        $("#js-script-hook-configuration-content").append(debuggerManager.render(language, getGlobalConfig().debuggers));

        // 关闭按钮事件处理
        document.getElementById("jsrei-js-script-hook-configuration-close-btn").addEventListener('click', this.closeModalWindow);
        document.getElementById("jsrei-js-script-hook-configuration-modal-window").style.display = 'flex';
    }

    /**
     * 隐藏模态框的函数
     */
    closeModalWindow() {
        const element = document.getElementById("jsrei-js-script-hook-configuration-modal-window");
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

}

module.exports = {
    ConfigurationComponent
}




/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {getGlobalConfig} = __webpack_require__(5);
const {renderSwitchComponent} = __webpack_require__(8);

/**
 * 全局配置参数
 */
class GlobalOptionsComponent {


    /**
     * 渲染模板
     *
     * @param oldConfig
     * @param language
     * @return {string}
     */
    template(oldConfig, language) {
        return `
<fieldset style="border: 1px solid #AAA !important; margin: 10px !important; padding: 10px !important; width: 800px !important; ">
    <legend style="color: #AAA !important;">${language.global_settings.title}</legend>
    <table>
        <tr>
            <td align="right">
                <!-- 问号形式的 Tips 组件 -->
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.global_settings.languageTips}
                    </div>
                </div>
                <span>${language.global_settings.language}</span>
            </td>
            <td align="left" style="padding: 10px;">
                <div class="js-script-hook-select-container">
                    <select id="js-script-hook-global-config-language">
                        <option value="english" ${oldConfig.language === 'english' ? 'selected' : ''}>English</option>
                        <option value="chinese" ${oldConfig.language === 'chinese' ? 'selected' : ''}>简体中文</option>
                    </select>
                </div>
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon" >
                    ?
                    <div class="js-script-hook-tooltip">
                    ${language.global_settings.responseDebuggerHookTypeTips}
                    </div>
                </div>
                <span>${language.global_settings.responseDebuggerHookType}</span>
            </td>
            <td align="left" style="padding: 10px;">
                <div style="display: inline-block;">
                    <div class="js-script-hook-select-container" style="width: 400px !important; ">
                        <select id="js-script-hook-global-config-hook-type">
                            <option value="use-proxy-function" >${language.global_settings.responseDebuggerHookTypeUseProxyFunction}</option>
                            <option value="use-redeclare-function">${language.global_settings.responseDebuggerHookTypeUseRedeclareFunction}</option>
                        </select>
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td align="right">
                <!-- 问号形式的 Tips 组件 -->
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.global_settings.flagPrefixTips}
                    </div>
                </div>
                <span>${language.global_settings.flagPrefix}</span> 
            </td>
            <td align="left" style="padding: 10px;">
                <div style="width: 450px">
                    <input class="js-script-hook-input" type="text" value="${oldConfig.prefix || ''}" placeholder="${language.global_settings.flagPrefixPlaceholder}" id="js-script-hook-global-config-flag-prefix"/>
                </div>
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.global_settings.isIgnoreJsSuffixRequestTips}
                    </div>
                </div>
                <span>${language.global_settings.isIgnoreJsSuffixRequest}</span>
            </td>
            <td align="left" style="padding: 10px;">
                <label class="js-script-hook-checkbox-container">
                    <input id="js-script-hook-global-config-isIgnoreJsSuffixRequest" class="js-script-hook-input" type="checkbox" ${oldConfig.isIgnoreJsSuffixRequest ? "checked='checked'" : ""}>
                    <span class="js-script-hook-custom-checkbox"></span>
                </label>
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.global_settings.isIgnoreNotJsonpRequestTips}
                    </div>
                </div>
                <span>${language.global_settings.isIgnoreNotJsonpRequest}</span>
            </td>
            <td align="left" style="padding: 10px;">
                <label class="js-script-hook-checkbox-container">
                    <input id="js-script-hook-global-config-isIgnoreNotJsonpRequest" class="js-script-hook-input" type="checkbox" ${oldConfig.isIgnoreNotJsonpRequest ? "checked='checked'" : ""}>
                    <span class="js-script-hook-custom-checkbox"></span>
                </label>
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.global_settings.autoJumpProjectSiteOnConfiguraionTips}
                    </div>
                </div>
                <span>${language.global_settings.autoJumpProjectSiteOnConfiguraion}</span>
            </td>
            <td align="left" style="padding: 10px;">
                <label class="js-script-hook-checkbox-container">
                    <input id="js-script-hook-global-config-autoJumpProjectSiteOnConfiguraion" class="js-script-hook-input" type="checkbox" ${oldConfig.autoJumpProjectSiteOnConfiguraion ? "checked='checked'" : ""}>
                    <span class="js-script-hook-custom-checkbox"></span>
                </label>
            </td>
        </tr>
    </table>
</fieldset>
        `;
    }

    /**
     *
     * 渲染全局配置
     *
     * @param language
     * @param oldConfig {Config}
     */
    render(language, oldConfig) {
        const component = $(this.template(oldConfig, language));

        if (oldConfig.hookType) {
            component.find(`#js-script-hook-global-config-hook-type`).val(oldConfig.hookType);
        }

        component.find("#js-script-hook-global-config-hook-type").change(function () {
            getGlobalConfig().hookType = $(this).val();
            getGlobalConfig().persist();
        });

        // 切换语言选择
        component.find("#js-script-hook-global-config-language").change(function () {
            getGlobalConfig().language = $(this).val();
            getGlobalConfig().persist();
        });

        // 全局标志的前缀
        component.find("#js-script-hook-global-config-flag-prefix").on("input", function () {
            getGlobalConfig().prefix = this.value;
            getGlobalConfig().persist();
        });

        // 是否忽略所有的js文件的请求
        component.find("#js-script-hook-global-config-isIgnoreJsSuffixRequest").on("change", function () {
            getGlobalConfig().isIgnoreJsSuffixRequest = $(this).is(':checked');
            getGlobalConfig().persist();
        });

        // 是否忽略所有的非jsonp的请求
        component.find("#js-script-hook-global-config-isIgnoreNotJsonpRequest").on("change", function () {
            getGlobalConfig().isIgnoreNotJsonpRequest = $(this).is(':checked');
            getGlobalConfig().persist();
        });

        // 在打开配置页面的时候自动跳转项目主页
        component.find("#js-script-hook-global-config-autoJumpProjectSiteOnConfiguraion").on("change", function () {
            getGlobalConfig().autoJumpProjectSiteOnConfiguraion = $(this).is(':checked');
            getGlobalConfig().persist();
        });

        return component;
    }

}

module.exports = {
    GlobalOptionsComponent
}


/***/ }),
/* 5 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {DebuggerTester} = __webpack_require__(6);
const {Debugger} = __webpack_require__(7);
const GM_config_name = "js-script-hook-config-name";

/**
 * 支持的相关配置
 */
class Config {

    constructor() {

        // 默认为英文的操作界面
        this.language = "english";

        // 让用户能够自己指定前缀，也许会有一些拥有感？之前ast hook好像就有个哥们喜欢这样干...
        this.prefix = "JSREI";

        this.hookType = "use-proxy-function";

        // 是否忽略.js后缀的请求
        this.isIgnoreJsSuffixRequest = false;

        // 是否忽略不是jsonp的请求
        this.isIgnoreNotJsonpRequest = false;

        // 在打开配置页面的时候自动跳转到项目主页
        this.autoJumpProjectSiteOnConfiguraion = true;

        // 所有的断点
        this.debuggers = [];
    }

    findDebuggerById(id) {
        for (let debuggerInformation of this.debuggers) {
            if (debuggerInformation.id === id) {
                return debuggerInformation;
            }
        }
        return null;
    }

    addDebugger(debuggerInformation) {
        // TODO 2024-12-22 05:06:15 断点的有效性校验
        this.debuggers.push(debuggerInformation);
    }

    removeDebuggerById(id) {
        const newDebuggers = [];
        for (let debuggerInformation of this.debuggers) {
            if (debuggerInformation.id !== id) {
                newDebuggers.push(debuggerInformation);
            }
        }
        this.debuggers = newDebuggers;
    }

    load() {
        const configJsonString = GM_getValue(GM_config_name);
        if (!configJsonString) {
            return this;
        }
        const o = JSON.parse(configJsonString);
        this.language = o.language;
        this.prefix = o.prefix;
        this.hookType = o.hookType;
        this.isIgnoreJsSuffixRequest = o.isIgnoreJsSuffixRequest;
        this.isIgnoreNotJsonpRequest = o.isIgnoreNotJsonpRequest;
        this.autoJumpProjectSiteOnConfiguraion = o.autoJumpProjectSiteOnConfiguraion;
        this.debuggers = [];
        for (let debuggerInformationObject of o.debuggers) {
            const debuggerInformation = new Debugger();
            debuggerInformation.createTime = debuggerInformationObject.createTime;
            debuggerInformation.updateTime = debuggerInformationObject.updateTime;
            debuggerInformation.id = debuggerInformationObject.id;
            debuggerInformation.enable = debuggerInformationObject.enable;
            debuggerInformation.urlPattern = debuggerInformationObject.urlPattern;
            debuggerInformation.urlPatternType = debuggerInformationObject.urlPatternType;
            debuggerInformation.enableRequestDebugger = debuggerInformationObject.enableRequestDebugger;
            debuggerInformation.enableResponseDebugger = debuggerInformationObject.enableResponseDebugger;
            debuggerInformation.callbackFunctionParamName = debuggerInformationObject.callbackFunctionParamName;
            debuggerInformation.comment = debuggerInformationObject.comment;
            this.debuggers.push(debuggerInformation);
        }
        return this;
    }

    persist() {
        const configJsonString = JSON.stringify(this);
        GM_setValue(GM_config_name, configJsonString);
    }

    /**
     * 执行测试所有断点，看看是否有条件命中啥的
     *
     * @param scriptContext {ScriptContext}
     * @return {Array<Debugger>}
     */
    testAll(scriptContext) {
        const hitDebuggers = [];
        for (let jsonpDebugger of this.debuggers) {
            if (jsonpDebugger.enable && new DebuggerTester().test(this, jsonpDebugger, scriptContext)) {
                hitDebuggers.push(jsonpDebugger);
            }
        }
        return hitDebuggers;
    }

    /**
     * 测试是否能够命中响应内容
     *
     * @param scriptContext
     * @return {*[]}
     */
    testAllForResponse(scriptContext) {
        const hitDebuggers = [];
        for (let debuggerConfig of this.debuggers) {
            if (debuggerConfig.enable && new DebuggerTester().testForResponse(this, debuggerConfig, scriptContext)) {
                hitDebuggers.push(debuggerConfig);
            }
        }
        return hitDebuggers;
    }

}

let globalConfig = new Config();

function initConfig() {
    globalConfig.load();
}

function getGlobalConfig() {
    return globalConfig;
}

module.exports = {
    Config,
    initConfig,
    getGlobalConfig
}


/***/ }),
/* 6 */
/***/ ((module) => {

/**
 * 用于测试是否命中断点的工具类，支持对请求和响应的断点测试。
 */
class DebuggerTester {

    /**
     * 测试是否命中断点。
     *
     * @param {Object} globalConfig - 全局配置对象，包含断点的全局设置。
     * @param {Object} debuggerConfig - 断点配置对象，包含断点的具体设置。
     * @param {ScriptContext} scriptContext - 脚本上下文对象，包含请求和响应的详细信息。
     * @return {boolean} - 如果命中断点则返回 true，否则返回 false。
     */
    test(globalConfig, debuggerConfig, scriptContext) {

        // 首先 URL 要能够匹配得上
        if (!this.testUrlPattern(debuggerConfig.urlPatternType, debuggerConfig.urlPattern, scriptContext.url)) {
            return false;
        }

        // 支持忽略 .js 文件请求
        if (globalConfig.isIgnoreJsSuffixRequest && scriptContext.isJsSuffixRequest()) {
            return false;
        }

        // 忽略不是 JSONP 的请求
        if (globalConfig.isIgnoreNotJsonpRequest && !scriptContext.isJsonp()) {
            return false;
        }

        // 请求断点
        if (debuggerConfig.enableRequestDebugger) {
            // 把一些相关的上下文赋值到变量方便断点命中这里的时候观察
            // _scriptContext 中存放的是与当前的 script 请求相关的一些上下文信息
            const _scriptContext = scriptContext;
            const humanReadableScriptInformation = scriptContext.toHumanReadable();
            debugger; // 断点调试
        }

        return true;
    }

    // ---------------------------------------------------------------------------------------------------------------------

    /**
     * 测试请求的 URL 是否匹配断点的 URL 模式。
     *
     * @param {string} urlPatternType - URL 匹配模式类型（例如："equals-string"、"contains-string" 等）。
     * @param {string | RegExp} urlPattern - URL 匹配模式的值。
     * @param {string} url - 要测试匹配的 URL。
     * @return {boolean} - 如果 URL 匹配模式则返回 true，否则返回 false。
     */
    testUrlPattern(urlPatternType, urlPattern, url) {

        if (!url) {
            return false;
        }

        if (!urlPattern) {
            return true;
        }

        switch (urlPatternType) {
            case "equals-string":
                return this.testUrlPatternForEquals(urlPattern, url);
            case "contains-string":
                return this.testUrlPatternForContains(urlPattern, url);
            case "match-regexp":
                return this.testUrlPatternForMatchRegexp(urlPattern, url);
            case "match-all":
                return this.testUrlPatternForMatchAll(urlPattern, url);
            default:
                return false;
        }

    }

    /**
     * 测试 URL 是否完全匹配给定的模式。
     *
     * @param {string} urlPattern - 要匹配的 URL 模式。
     * @param {string} url - 要测试的 URL。
     * @return {boolean} - 如果 URL 完全匹配模式则返回 true，否则返回 false。
     */
    testUrlPatternForEquals(urlPattern, url) {
        return url === urlPattern;
    }

    /**
     * 测试 URL 是否包含给定的关键字。
     *
     * @param {string} urlPattern - 要匹配的关键字。
     * @param {string} url - 要测试的 URL。
     * @return {boolean} - 如果 URL 包含关键字则返回 true，否则返回 false。
     */
    testUrlPatternForContains(urlPattern, url) {
        return url.indexOf(urlPattern) !== -1;
    }

    /**
     * 测试 URL 是否匹配给定的正则表达式。
     *
     * @param {string} urlPattern - 要匹配的正则表达式。
     * @param {string} url - 要测试的 URL。
     * @return {boolean} - 如果 URL 匹配正则表达式则返回 true，否则返回 false。
     */
    testUrlPatternForMatchRegexp(urlPattern, url) {
        try {
            return new RegExp(urlPattern).test(url);
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * 匹配所有 URL（始终返回 true）。
     *
     * @param {string} urlPattern - 忽略此参数。
     * @param {string} url - 忽略此参数。
     * @return {boolean} - 始终返回 true。
     */
    testUrlPatternForMatchAll(urlPattern, url) {
        return true;
    }

    // ---------------------------------------------------------------------------------------------------------------------

    /**
     * 测试响应是否命中断点。
     *
     * @param {Object} globalConfig - 全局配置对象，包含断点的全局设置。
     * @param {Object} debuggerConfig - 断点配置对象，包含断点的具体设置。
     * @param {ScriptContext} scriptContext - 脚本上下文对象，包含请求和响应的详细信息。
     * @return {boolean} - 如果命中断点则返回 true，否则返回 false。
     */
    testForResponse(globalConfig, debuggerConfig, scriptContext) {

        // 首先 URL 要能够匹配得上
        if (!this.testUrlPattern(debuggerConfig.urlPatternType, debuggerConfig.urlPattern, scriptContext.url)) {
            return false;
        }

        // 支持忽略 .js 文件请求
        if (globalConfig.isIgnoreJsSuffixRequest && scriptContext.isJsSuffixRequest()) {
            return false;
        }

        // 忽略不是 JSONP 的请求
        if (globalConfig.isIgnoreNotJsonpRequest && !scriptContext.isJsonp()) {
            return false;
        }

        // 响应断点是否开启
        return debuggerConfig.enableResponseDebugger;
    }

    /**
     * 判断是否需要将信息打印到控制台。
     *
     * @param {Object} globalConfig - 全局配置对象，包含断点的全局设置。
     * @param {ScriptContext} scriptContext - 脚本上下文对象，包含请求和响应的详细信息。
     * @return {boolean} - 如果需要打印到控制台则返回 true，否则返回 false。
     */
    isNeedPrintToConsole(globalConfig, scriptContext) {

        // 忽略 .js 文件请求
        if (globalConfig.isIgnoreJsSuffixRequest && scriptContext.isJsSuffixRequest()) {
            return false;
        }

        // 忽略不是 JSONP 的请求
        if (globalConfig.isIgnoreNotJsonpRequest && !scriptContext.isJsonp()) {
            return false;
        }

        return true;
    }

}

module.exports = {
    DebuggerTester
};

/***/ }),
/* 7 */
/***/ ((module) => {

/**
 * 表示一个 JSONP 的条件断点，用于在请求或响应处理时中断执行。
 */
class Debugger {

    /**
     * 构造函数，创建一个 Debugger 实例。
     *
     * @param {string} id - 断点的唯一标识。
     * @param {boolean} enable - 此断点是否处于启用状态。
     * @param {string} urlPatternType - URL 匹配模式类型（例如：字符串或正则表达式）。
     * @param {string | RegExp} urlPattern - 用于与 script 类型请求的 URL 做匹配，只有这个是必须指定的。
     * @param {boolean} [enableRequestDebugger=true] - 是否开启请求断点。开启后会在请求发送之前进入断点。如果不指定，默认开启。
     * @param {boolean} [enableResponseDebugger=true] - 是否开启响应断点。开启后会在响应处理之前进入断点。如果不指定，默认开启。
     * @param {string | null} [callbackFunctionParamName=null] - 传递 JSONP 回调函数名称的参数（例如："callback"）。如果不指定，会自动推测。
     * @param {string | null} [comment=null] - 断点的注释或描述信息。
     */
    constructor(
        id,
        enable,
        urlPatternType,
        urlPattern,
        enableRequestDebugger = true,
        enableResponseDebugger = true,
        callbackFunctionParamName = null,
        comment = null
    ) {
        this.createTime = new Date().getTime();
        this.updateTime = new Date().getTime();
        this.id = id;
        this.enable = enable;
        this.urlPatternType = urlPatternType;
        this.urlPattern = urlPattern;
        this.enableRequestDebugger = enableRequestDebugger;
        this.enableResponseDebugger = enableResponseDebugger;
        this.callbackFunctionParamName = callbackFunctionParamName;
        this.comment = comment;
    }

}

module.exports = {
    Debugger
};

/***/ }),
/* 8 */
/***/ ((module) => {

class SwitchComponent {

    render(id, initValue) {

        const checkboxComponent = $(this.template(id, initValue));

        checkboxComponent.find(`#${id}-span`).css("before", {
            "position": "absolute",
            "content": "",
            "height": "26px",
            "width": "26px",
            "left": "4px",
            "bottom": "4px",
            "background-color": "white",
            "-webkit-transition": ".4s",
            "transition": ".4s",
            "border-radius": "50%",
        });

        checkboxComponent.find(`#${id}`).on("change", function () {

        });

        return checkboxComponent.clone().html();
    }

    template(id, initValue) {
        return `
<div style="position: relative; display: inline-block; width: 60px; height: 34px;">
  <input type="checkbox" id="${id}" style="opacity: 0; width: 0; height: 0;">
  <span id="${id}-span" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; border-radius: 34px;"></span>
</div>
`;
    }

}

function renderSwitchComponent(id, initValue) {
    return new SwitchComponent().render(id, initValue);
}

module.exports = {
    SwitchComponent,
    renderSwitchComponent
}


/***/ }),
/* 9 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {DebuggerComponent} = __webpack_require__(10);
const {Debugger} = __webpack_require__(7);
const {randomId} = __webpack_require__(11);
const {getGlobalConfig} = __webpack_require__(5);

class DebuggerManagerComponent {

    constructor() {
        this.html = `
<div>
    <div id="js-script-hook-debugger-list"></div>
    <div id="js-script-hook-add-debugger">
        <button id="js-script-hook-add-debugger-btn" style="font-size: 100px !important; border: 1px solid black !important; display: inline-block !important; width: 800px !important; padding: 10px !important; margin: 10px !important; height: 200px !important; cursor:pointer !important;">+</button>
    </div>
</div>
        `;
    }

    /**
     *
     * @param language
     * @param debuggers {Array<Debugger>}
     */
    render(language, debuggers) {

        // 按照最后修改时间排序
        debuggers.sort((a, b) => {
            const t1 = parseInt(a.updateTime || 0);
            const t2 = parseInt(b.updateTime || 0);
            return t2 - t1;
        });

        const debuggerManager = $(this.html);

        // 渲染已经存在的断点配置信息
        for (let debuggerInformation of debuggers) {
            const debuggerComponent = new DebuggerComponent();
            debuggerManager.find("#js-script-hook-debugger-list").append(debuggerComponent.render(language, debuggerInformation));
        }

        // 增加断点配置
        debuggerManager.find("#js-script-hook-add-debugger-btn").click(() => {
            const debuggerComponent = new DebuggerComponent();
            const newDebuggerConfig = new Debugger();
            newDebuggerConfig.id = randomId();
            newDebuggerConfig.enable = true;
            newDebuggerConfig.urlPatternType = "match-all";
            newDebuggerConfig.urlPattern = "";
            newDebuggerConfig.enableRequestDebugger = true;
            newDebuggerConfig.enableResponseDebugger = true;
            newDebuggerConfig.callbackFunctionParamName = "";
            newDebuggerConfig.comment = "";
            debuggerManager.find("#js-script-hook-debugger-list").append(debuggerComponent.render(language, newDebuggerConfig));

            getGlobalConfig().addDebugger(newDebuggerConfig);
            getGlobalConfig().persist();
        });

        return debuggerManager;
    }

}

module.exports = {
    DebuggerManagerComponent
}


/***/ }),
/* 10 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {getGlobalConfig} = __webpack_require__(5);
const {DebuggerTester} = __webpack_require__(6);

/**
 * 用于表示一个断点配置
 */
class DebuggerComponent {

    /**
     * 构造初始的模板
     *
     * @param language
     * @param debuggerConfig
     * @return {string}
     */
    template(language, debuggerConfig) {
        return `
<fieldset id="${debuggerConfig.id}" style="width: 800px !important; border: 1px solid #AAA !important; margin: 10px !important; padding: 10px !important;">      
    <legend style="color: #AAA !important;">${language.debugger_config.debuggerTitle}-${debuggerConfig.id}</legend>          
    <div id="${debuggerConfig.id}-remove-btn" style="float: right !important; cursor: pointer !important;">X</div>
    <table>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.debugger_config.enableTips}
                    </div>
                </div>
                <span>${language.debugger_config.enable} </span>
            </td>
            <td align="left" style="padding: 10px;">
                <label class="js-script-hook-checkbox-container">
                    <input id="${debuggerConfig.id}-enable-checkbox" class="js-script-hook-input" type="checkbox" ${debuggerConfig.enable ? "checked='checked'" : ""}>
                    <span class="js-script-hook-custom-checkbox"></span>
                </label>
            </td>
        </tr>
        <tr>
            <td align="right" style="padding-left: 10px;">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.debugger_config.urlPatternTips}
                    </div>
                </div>
                <span>${language.debugger_config.urlPattern}</span>
            </td>
            <td align="left" style="padding: 10px;">
                <div style="border: 1px solid #CCC; padding: 10px; margin: 10px; width: 500px !important;"> 
                    <div style="display: inline-block;">
                        <div class="js-script-hook-tips-icon" >
                            ?
                            <div class="js-script-hook-tooltip">
                            ${language.debugger_config.urlPatternTypeTips}
                            </div>
                        </div>
                        <div class="js-script-hook-select-container" style="width: 400px !important; ">
                            <select id="${debuggerConfig.id}-url-pattern">
                                <option value="equals-string" >${language.debugger_config.urlPatternType_EqualsThisString}</option>
                                <option value="contains-string">${language.debugger_config.urlPatternType_ContainsThisString}</option>
                                <option value="match-regexp">${language.debugger_config.urlPatternType_MatchThisRegexp}</option>
                                <option value="match-all">${language.debugger_config.urlPatternType_MatchALL}</option>
                            </select>
                        </div>
                    </div>
                   <div>
                        <div class="js-script-hook-tips-icon" >
                            ?
                            <div class="js-script-hook-tooltip">
                            ${language.debugger_config.urlPatternTextTips}
                            </div>
                        </div>
                        <input class="js-script-hook-input" id="${debuggerConfig.id}-url-pattern-text" value="${debuggerConfig.urlPattern || ''}" type="text" placeholder="${language.debugger_config.urlPatternTextPlaceholder}" style="width: 400px !important;" />
                    </div>
                    <div>
                       <div class="js-script-hook-tips-icon">
                            ?
                            <div class="js-script-hook-tooltip">
                            ${language.debugger_config.urlPatternTestTips}
                            </div>
                        </div>
                        <button class="js-script-hook-button" id="${debuggerConfig.id}-url-pattern-test" style="cursor: pointer !important;">${language.debugger_config.urlPatternTest}</button>
                    </div>
               </div>
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.debugger_config.enableRequestDebuggerTips}
                    </div>
                </div>
                <span>${language.debugger_config.enableRequestDebugger}</span>
            </td>
            <td align="left" style="padding: 10px;">
                <label class="js-script-hook-checkbox-container">
                    <input id="${debuggerConfig.id}-enableRequestDebugger-checkbox" class="js-script-hook-input" type="checkbox" ${debuggerConfig.enableRequestDebugger ? "checked='checked'" : ""}>
                    <span class="js-script-hook-custom-checkbox"></span>
                </label>
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.debugger_config.enableResponseDebuggerTips}
                    </div>
                </div>
                <span> ${language.debugger_config.enableResponseDebugger} </span>
            </td>
            <td align="left" style="padding: 10px;">
                <label class="js-script-hook-checkbox-container">
                    <input id="${debuggerConfig.id}-enableResponseDebugger-checkbox" class="js-script-hook-input" type="checkbox" ${debuggerConfig.enableResponseDebugger ? "checked='checked'" : ""}>
                    <span class="js-script-hook-custom-checkbox"></span>
                </label>
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.debugger_config.callbackFunctionParamNameTips}
                    </div>
                </div>
                <span> ${language.debugger_config.callbackFunctionParamName} </span>
            </td>
            <td align="left" style="padding-left: 10px;">
                <input class="js-script-hook-input" type="text" id="${debuggerConfig.id}-callbackFunctionParamName-text" value="${debuggerConfig.callbackFunctionParamName || ''}" placeholder="${language.debugger_config.callbackFunctionParamNamePlaceholder}" />
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.debugger_config.commentTips}
                    </div>
                </div>
                <span> ${language.debugger_config.comment} </span>
            </td>
            <td align="left" style="padding: 10px; ">
                <textarea class="js-script-hook-textarea" id="${debuggerConfig.id}-comment-text" placeholder="${language.debugger_config.commentPlaceholder}" style="width: 500px; height: 100px;">${debuggerConfig.comment || ""}</textarea>
            </td>
        </tr>
    </table>
</fieldset>
        `;
    }

    /**
     * 渲染一条断点规则
     *
     * @param language
     * @param debuggerInformation
     * @return {*|jQuery|HTMLElement}
     */
    render(language, debuggerInformation) {
        const debuggerElt = $(this.template(language, debuggerInformation));

        // 设置匹配类型
        if (debuggerInformation.urlPatternType) {
            debuggerElt.find(`#${debuggerInformation.id}-url-pattern`).val(debuggerInformation.urlPatternType);
        }

        // 断点是否开启
        debuggerElt.find(`#${debuggerInformation.id}-enable-checkbox`).on('change', function () {
            const localDebuggerInformation = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            localDebuggerInformation.enable = $(this).is(':checked');
            localDebuggerInformation.updateTime = new Date().getTime();
            getGlobalConfig().persist();
        });

        // URL匹配类型
        debuggerElt.find(`#${debuggerInformation.id}-url-pattern`).change(function () {
            const localDebuggerInformation = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            localDebuggerInformation.urlPatternType = $(this).val();
            localDebuggerInformation.updateTime = new Date().getTime();
            getGlobalConfig().persist();
        });

        // URL匹配值
        debuggerElt.find(`#${debuggerInformation.id}-url-pattern-text`).on('input', function () {
            const localDebuggerInformation = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            localDebuggerInformation.urlPattern = this.value;
            localDebuggerInformation.updateTime = new Date().getTime();
            getGlobalConfig().persist();
        });

        // URL匹配测试
        debuggerElt.find(`#${debuggerInformation.id}-url-pattern-test`).on('click', function () {
            let urlForTest = prompt(language.debugger_config.urlPatternTestPrompt, "");
            const debuggerConfig = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            const result = new DebuggerTester().testUrlPattern(debuggerConfig.urlPatternType, debuggerConfig.urlPattern, urlForTest);
            alert(language.debugger_config.urlPatternTestResult + result);
        });

        // enableRequestDebugger
        debuggerElt.find(`#${debuggerInformation.id}-enableRequestDebugger-checkbox`).on('change', function () {
            const localDebuggerInformation = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            localDebuggerInformation.enableRequestDebugger = $(this).is(':checked');
            localDebuggerInformation.updateTime = new Date().getTime();
            getGlobalConfig().persist();
        });

        // enableResponseDebugger
        debuggerElt.find(`#${debuggerInformation.id}-enableResponseDebugger-checkbox`).on('change', function () {
            const localDebuggerInformation = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            localDebuggerInformation.enableResponseDebugger = $(this).is(':checked');
            localDebuggerInformation.updateTime = new Date().getTime();
            getGlobalConfig().persist();
        });

        // ${debuggerConfig.id}-hook-type
        debuggerElt.find(`#${debuggerInformation.id}-hook-type`).change(function () {
            const localDebuggerInformation = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            localDebuggerInformation.hookType = $(this).val();
            localDebuggerInformation.updateTime = new Date().getTime();
            getGlobalConfig().persist();
        });

        // callbackFunctionParamName
        debuggerElt.find(`#${debuggerInformation.id}-callbackFunctionParamName-text`).on('input', function () {
            const localDebuggerInformation = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            localDebuggerInformation.callbackFunctionParamName = this.value;
            localDebuggerInformation.updateTime = new Date().getTime();
            getGlobalConfig().persist();
        });

        // 注释
        debuggerElt.find(`#${debuggerInformation.id}-comment-text`).on('input', function () {
            const localDebuggerInformation = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            localDebuggerInformation.comment = this.value;
            localDebuggerInformation.updateTime = new Date().getTime();
            getGlobalConfig().persist();
        });

        // 删除按钮
        debuggerElt.find(`#${debuggerInformation.id}-remove-btn`).click(function () {
            $(`#${debuggerInformation.id}`).remove();

            getGlobalConfig().removeDebuggerById(debuggerInformation.id);
            getGlobalConfig().persist();
        });

        return debuggerElt;
    }


    // // 鼠标划过与移走
    // manifestElt.onmouseover = function () {
    //
    //     // 获取元素的边界矩形
    //     const rect = manifestElt.getBoundingClientRect();
    //
    //     // 获取页面的滚动偏移量
    //     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //     const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    //
    //     // 计算绝对位置
    //     const absoluteTop = rect.top + scrollTop;
    //     const absoluteLeft = rect.left + scrollLeft;
    //
    //     tips.style.display = 'block';
    //     tips.style.position = 'absolute';
    //     tips.style.left = `${absoluteLeft}px`;
    //     tips.style.top = `${absoluteTop - tips.offsetHeight - 20}px`;
    // };
    // manifestElt.onmouseout = function () {
    //     tips.style.display = 'none';
    // };

}

module.exports = {
    DebuggerComponent
}


/***/ }),
/* 11 */
/***/ ((module) => {

/**
 * 生成一个随机 ID，格式类似于 UUID。
 *
 * @returns {string} - 返回一个随机生成的 ID，格式为 "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"。
 */
function randomId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // 生成一个 0 到 15 的随机整数
        const r = Math.random() * 16 | 0;
        // 如果字符是 'x'，则直接使用随机数；如果是 'y'，则根据规则生成特定值
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        // 将结果转换为十六进制字符串
        return v.toString(16);
    });
}

module.exports = {
    randomId
};

/***/ }),
/* 12 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 中文菜单
const {getGlobalConfig} = __webpack_require__(5);
const chinese = {
    global_settings: {

        title: "全局设置",

        language: "界面语言：",
        languageTips: "你可以修改此配置界面的语言，修改后下次进入生效！ <br/> You can modify the language of this configuration interface, and the changes will take effect the next time you enter!",

        flagPrefix: "Hook Flag前缀：",
        flagPrefixTips: "在Hook的时候会设置一些全局唯一的标志位，你可以个性化修改为自定义的前缀",
        flagPrefixPlaceholder: "可自定义全局前缀，未设置默认为 JSREI_js_script_hook",

        responseDebuggerHookType: "响应断点Hook方式：",
        responseDebuggerHookTypeTips: "当Hook jsonp的callback函数的时候，有两种方式实现Hook：<br/><br/>一种是替换掉callback方法的引用，相当于是一个代理函数，这种需要在命中断点后再点一下跟进去callback函数的实现，这种方式兼容性比较好，绝大多数网站都可以丝滑兼容；<br/><br/>还有一种方式是直接改写callback函数的函数体，相当于是对函数的代码实现进行编辑后重新声明，这样子可以直接把断点打在callback函数体中，但此种方式可能会有一些作用域的兼容性问题，如有遇到报错，请调整为代理方式实现Hook；<br/><br/>注意，此选项修改后刷新页面后生效",
        responseDebuggerHookTypeUseProxyFunction: "使用代理函数实现Hook",
        responseDebuggerHookTypeUseRedeclareFunction: "直接修改网站callback函数体（注意可能会有兼容性问题）",

        isIgnoreJsSuffixRequest: "是否忽略.js后缀的请求：",
        isIgnoreJsSuffixRequestTips: "大多数时候.js后缀的请求都是单纯的加载JavaScript资源文件，可以选择忽略掉这类请求，当勾选的时候，控制台上也不会再打印.js请求",

        isIgnoreNotJsonpRequest: "是否忽略不是jsonp的请求：",
        isIgnoreNotJsonpRequestTips: "如果只关注jsonp类型的请求，可以选择忽略掉其它请求，当勾选的时候，控制台上也不会再打印非jsonp请求",

        autoJumpProjectSiteOnConfiguraion: "跳转到项目主页打开此界面以防样式错乱：",
        autoJumpProjectSiteOnConfiguraionTips: "油猴脚本注入的界面可能会跟网页中原有的样式发生冲突或者污染，从而导致样式错乱，跳转到经过测试的项目主页打开设置界面可以有效防止布局错乱，推荐勾选此选项",
    },
    debugger_config: {

        debuggerTitle: "断点配置",

        enable: "是否启用此断点：",
        enableTips: "是否启用此断点，仅当断点处于启用状态的时候才会生效，取消勾选可以暂时禁用断点而无需删除。",

        urlPattern: "URL匹配方式：",
        urlPatternTips: "URL匹配方式用于指定当Script的URL符合什么条件时命中此断点",

        urlPatternTypeTips: "指定以什么方式匹配Script URL：",
        urlPatternType_EqualsThisString: "Script URL需要完全匹配给定的字符串",
        urlPatternType_ContainsThisString: "Script URL包含给定的字符串",
        urlPatternType_MatchThisRegexp: "Script URL匹配给定的正则表达式",
        urlPatternType_MatchALL: "直接匹配所有Script URL",

        urlPatternTextTips: "输入关键字或者表达式",
        urlPatternTextPlaceholder: "输入关键字或者表达式",

        urlPatternTest: "测试",
        urlPatternTestTips: "你可以输入一个script url测试此断点对其命中情况",
        urlPatternTestPrompt: "请输入要测试的URL：",
        urlPatternTestResult: "测试结果：",

        enableRequestDebugger: "是否开启请求断点：",
        enableRequestDebuggerTips: "启用请求断点后，在script请求发出之前进入断点",

        enableResponseDebugger: "是否开启响应断点：",
        enableResponseDebuggerTips: "启用响应断点之后，在jsonp请求的回调函数中命中断点",

        callbackFunctionParamName: "jsonp回调函数参数名称：",
        callbackFunctionParamNameTips: "不指定的话会使用内置引擎自动推测jsonp参数名称，推测失败的话可以手动指定",
        callbackFunctionParamNamePlaceholder: "不指定的话会使用内置引擎自动推测jsonp参数名称",

        comment: "备注：",
        commentTips: "你可以输入一些备注，或者相关信息的一些上下文，以防止时间长了之后忘记。",
        commentPlaceholder: "好记性不如烂笔头",
    },
    console: {
        tableKey: "键",
        tableValue: "值",
        tableComment: "备注",
        titleRequest: "Script Hook 捕捉到请求",
        titleResponse: "Script Hook 捕捉到响应",
        time: "时间",
        requestId: "请求ID",
        isJsonpRequest: "是否是jsonp请求",
        hostname: "请求域名",
        path: "请求路径",
        param: "请求参数",
        hash: "请求#hash",
        paramName: "参数名称",
        paramValue: "参数值",
        isJsonpCallback: "是否是jsonp回调函数",
        codeLocation: "代码位置",
    }
};

// 英文菜单
const english = {
    "global_settings": {

        "title": "Global Settings",

        "language": "Interface Language:",
        "languageTips": "你可以修改此配置界面的语言，修改后下次进入生效！ <br/> You can modify the language of this configuration interface, and the changes will take effect the next time you enter!",

        "flagPrefix": "Hook Flag Prefix:",
        "flagPrefixTips": "When hooking, some globally unique flags will be set. You can customize the prefix.",
        "flagPrefixPlaceholder": "You can customize the global prefix. If not set, the default is JSREI_js_script_hook.",

        "responseDebuggerHookType": "Response Breakpoint Hook Method:",
        "responseDebuggerHookTypeTips": "When hooking the callback function of JSONP, there are two ways to implement the hook: <br/><br/> One is to replace the reference of the callback function, which acts as a proxy function. This requires stepping into the callback function implementation after hitting the breakpoint. This method has better compatibility and works smoothly on most websites. <br/><br/> The other method is to directly rewrite the function body of the callback function, which is equivalent to editing and redeclaring the function's code. This allows you to place the breakpoint directly in the callback function body, but there may be some scope compatibility issues. If you encounter errors, please switch to the proxy method. <br/><br/> Note: This option takes effect after refreshing the page.",
        "responseDebuggerHookTypeUseProxyFunction": "Use Proxy Function to Implement Hook",
        "responseDebuggerHookTypeUseRedeclareFunction": "Directly Modify the Callback Function Body (Note: There May Be Compatibility Issues)",

        "isIgnoreJsSuffixRequest": "Ignore .js Suffix Requests:",
        "isIgnoreJsSuffixRequestTips": "Most of the time, requests with a .js suffix are simply loading JavaScript resource files. You can choose to ignore such requests. When checked, .js requests will not be printed on the console.",

        "isIgnoreNotJsonpRequest": "Ignore Non-JSONP Requests:",
        "isIgnoreNotJsonpRequestTips": "If you are only concerned with JSONP-type requests, you can choose to ignore other requests. When checked, non-JSONP requests will not be printed on the console.",

        "autoJumpProjectSiteOnConfiguraion": "Jump to the Project Homepage to Open This Interface to Prevent Style Issues:",
        "autoJumpProjectSiteOnConfiguraionTips": "The interface injected by the Tampermonkey script may conflict with or pollute the original styles of the webpage, causing style issues. Jumping to the tested project homepage to open the settings interface can effectively prevent layout issues. It is recommended to check this option."
    },
    "debugger_config": {

        "debuggerTitle": "Breakpoint Configuration",

        "enable": "Enable This Breakpoint:",
        "enableTips": "Whether to enable this breakpoint. It will only take effect when the breakpoint is enabled. Unchecking it can temporarily disable the breakpoint without deleting it.",

        "urlPattern": "URL Matching Method:",
        "urlPatternTips": "The URL matching method is used to specify when the script's URL meets certain conditions to hit this breakpoint.",

        "urlPatternTypeTips": "Specify how to match the Script URL:",
        "urlPatternType_EqualsThisString": "The Script URL must exactly match the given string.",
        "urlPatternType_ContainsThisString": "The Script URL contains the given string.",
        "urlPatternType_MatchThisRegexp": "The Script URL matches the given regular expression.",
        "urlPatternType_MatchALL": "Directly match all Script URLs.",

        "urlPatternTextTips": "Enter a keyword or expression.",
        "urlPatternTextPlaceholder": "Enter a keyword or expression.",

        "urlPatternTest": "Test",
        "urlPatternTestTips": "You can enter a script URL to test whether this breakpoint hits it.",
        "urlPatternTestPrompt": "Please enter the URL to test:",
        "urlPatternTestResult": "Test Result:",

        "enableRequestDebugger": "Enable Request Breakpoint:",
        "enableRequestDebuggerTips": "After enabling the request breakpoint, the breakpoint will be triggered before the script request is sent.",

        "enableResponseDebugger": "Enable Response Breakpoint:",
        "enableResponseDebuggerTips": "After enabling the response breakpoint, the breakpoint will be triggered in the callback function of the JSONP request.",

        "callbackFunctionParamName": "JSONP Callback Function Parameter Name:",
        "callbackFunctionParamNameTips": "If not specified, the built-in engine will automatically infer the JSONP parameter name. If the inference fails, you can manually specify it.",
        "callbackFunctionParamNamePlaceholder": "If not specified, the built-in engine will automatically infer the JSONP parameter name.",

        "comment": "Comment:",
        "commentTips": "You can enter some comments or contextual information to avoid forgetting it over time.",
        "commentPlaceholder": "A good memory is not as good as a written record."
    },
    "console": {
        tableKey: "key",
        tableValue: "value",
        tableComment: "comment",
        "titleRequest": "Script Hook Captured Request",
        "titleResponse": "Script Hook Captured Response",
        "time": "Time",
        "requestId": "Request ID",
        "isJsonpRequest": "Is JSONP Request",
        "hostname": "Request Hostname",
        "path": "Request Path",
        "param": "Request Parameters",
        "hash": "Request #hash",
        "paramName": "Parameter Name",
        "paramValue": "Parameter Value",
        "isJsonpCallback": "Is JSONP Callback Function",
        "codeLocation": "Code Location"
    }
};

/**
 *
 * @return {{debugger_config: {urlPatternTest: string, urlPatternTestTips: string, enableTips: string, commentPlaceholder: string, debuggerTitle: string, enableRequestDebuggerTips: string, enableResponseDebugger: string, enableRequestDebugger: string, callbackFunctionParamName: string, urlPatternTypeTips: string, urlPatternTips: string, urlPatternType_MatchThisRegexp: string, urlPatternType_MatchALL: string, urlPatternType_EqualsThisString: string, urlPatternTextPlaceholder: string, enable: string, commentTips: string, urlPatternTextTips: string, enableResponseDebuggerTips: string, callbackFunctionParamNameTips: string, callbackFunctionParamNamePlaceholder: string, comment: string, urlPattern: string, urlPatternType_ContainsThisString: string}, global_settings: {languageTips: string, autoJumpProjectSiteOnConfiguraionTips: string, flagPrefix: string, flagPrefixTips: string, isIgnoreJsSuffixRequestTips: string, autoJumpProjectSiteOnConfiguraion: string, isIgnoreJsSuffixRequest: string, language: string, isIgnoreNotJsonpRequestTips: string, title: string, flagPrefixPlaceholder: string, isIgnoreNotJsonpRequest: string}}|{debugger_config: {urlPatternTest: string, urlPatternTestTips: string, enableTips: string, commentPlaceholder: string, enableRequestDebuggerTips: string, enableResponseDebugger: string, enableRequestDebugger: string, callbackFunctionParamName: string, urlPatternTypeTips: string, urlPatternTips: string, urlPatternType_MatchThisRegexp: string, urlPatternType_MatchALL: string, urlPatternType_EqualsThisString: string, urlPatternTextPlaceholder: string, enable: string, commentTips: string, urlPatternTextTips: string, enableResponseDebuggerTips: string, callbackFunctionParamNameTips: string, callbackFunctionParamNamePlaceholder: string, comment: string, urlPattern: string, urlPatternType_ContainsThisString: string}, global_settings: {languageTips: string, autoJumpProjectSiteOnConfiguraionTips: string, flagPrefix: string, flagPrefixTips: string, isIgnoreJsSuffixRequestTips: string, autoJumpProjectSiteOnConfiguraion: string, isIgnoreJsSuffixRequest: string, language: string, isIgnoreNotJsonpRequestTips: string, title: string, flagPrefixPlaceholder: string, isIgnoreNotJsonpRequest: string}}}
 */
function getLanguageByGlobalConfig() {
    return getLanguage(getGlobalConfig().language);
}

/**
 *
 * @param language
 * @return {{debugger_config: {urlPatternTest: string, urlPatternTestTips: string, enableTips: string, commentPlaceholder: string, debuggerTitle: string, enableRequestDebuggerTips: string, enableResponseDebugger: string, enableRequestDebugger: string, callbackFunctionParamName: string, urlPatternTypeTips: string, urlPatternTips: string, urlPatternType_MatchThisRegexp: string, urlPatternType_MatchALL: string, urlPatternType_EqualsThisString: string, urlPatternTextPlaceholder: string, enable: string, commentTips: string, urlPatternTextTips: string, enableResponseDebuggerTips: string, callbackFunctionParamNameTips: string, callbackFunctionParamNamePlaceholder: string, comment: string, urlPattern: string, urlPatternType_ContainsThisString: string}, global_settings: {languageTips: string, autoJumpProjectSiteOnConfiguraionTips: string, flagPrefix: string, flagPrefixTips: string, isIgnoreJsSuffixRequestTips: string, autoJumpProjectSiteOnConfiguraion: string, isIgnoreJsSuffixRequest: string, language: string, isIgnoreNotJsonpRequestTips: string, title: string, flagPrefixPlaceholder: string, isIgnoreNotJsonpRequest: string}}|{debugger_config: {urlPatternTest: string, urlPatternTestTips: string, enableTips: string, commentPlaceholder: string, enableRequestDebuggerTips: string, enableResponseDebugger: string, enableRequestDebugger: string, callbackFunctionParamName: string, urlPatternTypeTips: string, urlPatternTips: string, urlPatternType_MatchThisRegexp: string, urlPatternType_MatchALL: string, urlPatternType_EqualsThisString: string, urlPatternTextPlaceholder: string, enable: string, commentTips: string, urlPatternTextTips: string, enableResponseDebuggerTips: string, callbackFunctionParamNameTips: string, callbackFunctionParamNamePlaceholder: string, comment: string, urlPattern: string, urlPatternType_ContainsThisString: string}, global_settings: {languageTips: string, autoJumpProjectSiteOnConfiguraionTips: string, flagPrefix: string, flagPrefixTips: string, isIgnoreJsSuffixRequestTips: string, autoJumpProjectSiteOnConfiguraion: string, isIgnoreJsSuffixRequest: string, language: string, isIgnoreNotJsonpRequestTips: string, title: string, flagPrefixPlaceholder: string, isIgnoreNotJsonpRequest: string}}}
 */
function getLanguage(language) {
    switch (language) {
        case "chinese":
            return chinese;
        case "english":
            return english;
        default:
            return english;
    }
}

module.exports = {
    getLanguage,
    getLanguageByGlobalConfig,
    chinese,
    english
}


/***/ }),
/* 13 */
/***/ ((module) => {

// 定义要添加的 CSS 规则
const css = `

        /* ================================== 最外边的窗口 ================================== */
        
        /* 容器 div */
        .js-script-hook-scrollable-div {
            max-height: 100vh; /* 最大高度等于视口高度 */
            overflow-y: auto; /* 超出时显示垂直滚动条 */
            border: 2px solid #4CAF50;
            padding: 20px;
            box-sizing: border-box; /* 确保 padding 和 border 不增加总高度 */
        }
        
        /* ================================== 输入框 ================================== */

        /* 输入框样式 */
        .js-script-hook-input[type="text"] {
            flex: 1;
            width: 100%;
            padding: 5px;
            margin-bottom: 15px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 15px;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
            outline: none;
        }

        /* 输入框聚焦效果 */
        .js-script-hook-input[type="text"]:focus {
            border-color: #4CAF50;
            box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
        }
        
        /* ================================== 按钮 ================================== */

        /* 按钮样式 */
        .js-script-hook-button {
            background-color: #4CAF50;
            color: white;
            padding: 3px 12px;
            border: none;
            border-radius: 5px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer !important;
            transition: background-color 0.3s ease, transform 0.2s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* 按钮悬停效果 */
        .js-script-hook-button:hover {
            background-color: #45a049;
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }

        /* 按钮点击效果 */
        js-script-hook-button:active {
            background-color: #3d8b40;
            transform: translateY(0);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* 禁用按钮样式 */
        .js-script-hook-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
            opacity: 0.7;
        }
        
        
        /* ================================== 复选框 ================================== */
        
        /* 隐藏原生复选框 */
        .js-script-hook-input[type="checkbox"] {
            display: none;
        }

        /* 自定义复选框的容器 */
        .js-script-hook-checkbox-container {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            cursor: pointer;
        }

        /* 自定义复选框的外观 */
        .js-script-hook-checkbox-container .js-script-hook-custom-checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid #ccc;
            border-radius: 4px;
            margin-right: 10px;
            position: relative;
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        /* 复选框选中时的样式 */
        .js-script-hook-input[type="checkbox"]:checked + .js-script-hook-custom-checkbox {
            background-color: #4CAF50;
            border-color: #4CAF50;
        }

        /* 复选框选中时的对勾图标 */
        .js-script-hook-input[type="checkbox"]:checked + .js-script-hook-custom-checkbox::after {
            content: '';
            position: absolute;
            left: 6px;
            top: 2px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }

        /* 悬停效果 */
        .js-script-hook-checkbox-container:hover .js-script-hook-custom-checkbox {
            border-color: #4CAF50;
        }

        /* 禁用状态 */
        .js-script-hook-input[type="checkbox"]:disabled + .js-script-hook-custom-checkbox {
            background-color: #f0f0f0;
            border-color: #ccc;
            cursor: not-allowed;
        }

        .js-script-hook-input[type="checkbox"]:disabled:checked + .js-script-hook-custom-checkbox {
            background-color: #ccc;
        }
        
        /* ================================== 下拉框 ================================== */
        
        /* 下拉框容器 */
        .js-script-hook-select-container {
            position: relative;
            width: 200px;
        }

        /* 美化下拉框 */
        .js-script-hook-select-container select {
            width: 100%;
            padding: 5px;
            font-size: 15px;
            border: 2px solid #ccc;
            border-radius: 5px;
            background-color: white;
            appearance: none; /* 隐藏默认箭头 */
            -webkit-appearance: none; /* 兼容 Safari */
            -moz-appearance: none; /* 兼容 Firefox */
            cursor: pointer;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* 自定义下拉箭头 */
        .js-script-hook-select-container::after {
            content: '▼';
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            pointer-events: none; /* 防止点击箭头时触发下拉框 */
            color: #666;
            font-size: 12px;
        }

        /* 悬停效果 */
        .js-script-hook-select-container select:hover {
            border-color: #4CAF50;
        }

        /* 聚焦效果 */
        .js-script-hook-select-container select:focus {
            border-color: #4CAF50;
            box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
            outline: none;
        }

        /* 禁用状态 */
        .js-script-hook-select-container select:disabled {
            background-color: #f0f0f0;
            cursor: not-allowed;
            opacity: 0.7;
        }
        /* ================================== 问号提示 ================================== */

        /* 问号图标 */
        .js-script-hook-tips-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            background-color: #DDD;
            color: white;
            border-radius: 50%;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            position: relative;
        }
        
        /* 提示信息 */
        .js-script-hook-tips-icon .js-script-hook-tooltip {
            visibility: hidden;
            opacity: 0;
            width: 500px;
            background-color: #333;
            color: white;
            text-align: left;
            border-radius: 5px;
            padding: 10px;
            position: absolute;
            z-index: 2147483647;
            bottom: 50%; /* 提示信息垂直居中 */
            left: 125%; /* 提示信息位于问号右侧 */
            transform: translateY(50%); /* 垂直居中 */
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        /* 提示信息箭头 */
        .js-script-hook-tips-icon .js-script-hook-tooltip::after {
            content: '';
            position: absolute;
            top: 50%;
            left: -5px; /* 箭头位于提示信息的左侧 */
            margin-top: -5px; /* 垂直居中 */
            border-width: 5px;
            border-style: solid;
            border-color: transparent #333 transparent transparent; /* 箭头指向左侧 */
        }
        
        /* 鼠标悬停时显示提示信息 */
        .js-script-hook-tips-icon:hover .js-script-hook-tooltip {
            visibility: visible;
            opacity: 1;
        }
        
        /* ================================== 多行文本框 ================================== */
        
        /* 美化 Textarea */
        .js-script-hook-textarea {
            width: 100%;
            height: 150px;
            padding: 12px;
            font-size: 16px;
            border: 2px solid #ccc;
            border-radius: 8px;
            background-color: #f9f9f9;
            resize: vertical; /* 允许垂直调整大小 */
            outline: none;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* 悬停效果 */
        .js-script-hook-textarea:hover {
            border-color: #4CAF50;
        }

        /* 聚焦效果 */
        .js-script-hook-textarea:focus {
            border-color: #4CAF50;
            box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
        }

        /* 禁用状态 */
        .js-script-hook-textarea:disabled {
            background-color: #f0f0f0;
            cursor: not-allowed;
            opacity: 0.7;
        }
        
`;

/**
 * 把当前hook需要用到的样式表追加到页面中
 */
function appendScriptHookStyleToCurrentPage() {

    // 避免重复插入
    if ($("#js-script-hook-style").length > 0) {
        return;
    }

    // 创建一个 <style> 元素
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "js-script-hook-style";

    // 将 CSS 规则添加到 <style> 元素
    if (style.styleSheet) {
        // 兼容 IE8 及以下
        style.styleSheet.cssText = css;
    } else {
        // 现代浏览器
        style.appendChild(document.createTextNode(css));
    }

    // 将 <style> 元素插入到 <head> 中
    document.head.appendChild(style);
}

module.exports = {
    appendScriptHookStyleToCurrentPage
}


/***/ }),
/* 14 */
/***/ ((module) => {

/**
 * 获取 `unsafeWindow` 对象，用于在油猴脚本中访问或修改全局 `window` 对象。
 *
 * 油猴脚本默认运行在一个沙箱环境中，无法直接修改全局 `window` 对象。
 * 通过 `unsafeWindow` 可以绕过沙箱机制，直接访问或修改全局 `window` 对象。
 * 使用此方法封装 `unsafeWindow` 的调用，便于后续追踪哪些地方使用了 `unsafeWindow`。
 *
 * @see https://wiki.greasespot.net/UnsafeWindow - 油猴脚本中 `unsafeWindow` 的官方文档。
 * @returns {Window} - 返回全局的 `unsafeWindow` 对象。
 */
function getUnsafeWindow() {
    return unsafeWindow;
}

module.exports = {
    getUnsafeWindow,
};

/***/ }),
/* 15 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {ScriptHook} = __webpack_require__(16);

/**
 * 用于为document添加hook
 */
class DocumentHook {

    /**
     *
     * @param document {HTMLDocument}
     */
    constructor(document) {
        this.document = document;
        this.documentCreateHolder = document.createElement;
    }

    /**
     *
     */
    addHook() {

        const _this = this;

        this.document.createElement = function () {
            const result = _this.documentCreateHolder.apply(this, arguments);
            if (arguments.length && arguments[0].toLowerCase() === "script") {
                try {
                    new ScriptHook(result).addHook();
                } catch (e) {
                    console.error(e);
                }
            }
            return result;
        }

        this.document.createElement.toString = function () {
            return _this.documentCreateHolder.toString();
        }
    }

}

module.exports = {
    DocumentHook
}


/***/ }),
/* 16 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {ScriptContext} = __webpack_require__(17);
const {RequestContext} = __webpack_require__(18);
const {RequestAnalyzer} = __webpack_require__(21);
const {getGlobalConfig} = __webpack_require__(5);
const {RequestFormatter} = __webpack_require__(23);
const {JsonpCallbackHook} = __webpack_require__(27);
const {formatScriptSrcToUrl} = __webpack_require__(32);
const {DebuggerTester} = __webpack_require__(6);

/**
 * 用于给script添加Hook
 */
class ScriptHook {

    /**
     *
     * @param script {HTMLScriptElement}
     */
    constructor(script) {
        this.script = script;
    }

    /**
     *
     */
    addHook() {
        const _this = this;
        // 在设置src时拦截，然后就可以去追溯src是怎么来的了
        let srcHolder = null;
        Object.defineProperty(this.script, "src", {
            get: function () {
                return srcHolder;
            }, set: function (newSrc) {

                // 尽量不要影响页面原有的流程
                try {
                    const formattedScriptSrc = formatScriptSrcToUrl(newSrc);
                    // 初始化请求上下文
                    const requestContext = RequestContext.parseRequestContext(formattedScriptSrc);
                    const scriptContext = new ScriptContext(formattedScriptSrc, requestContext, null);

                    const requestAnalyzer = new RequestAnalyzer();
                    requestAnalyzer.analyze(requestContext);

                    // 在请求发送之前测试断点
                    if (new DebuggerTester().isNeedPrintToConsole(getGlobalConfig(), scriptContext)) {
                        const requestFormatter = new RequestFormatter();
                        requestFormatter.format(scriptContext)
                    }

                    const hitDebuggers = getGlobalConfig().testAll(scriptContext);
                    new JsonpCallbackHook(scriptContext, hitDebuggers).addHook();
                } catch (e) {
                    console.error(e);
                }

                // 这里认为script不会被复用，所以添加的hook在设置src的时候就会被删除掉，会有script复用的情况吗？
                delete _this.script.src;
                srcHolder = _this.script.src = newSrc;
            },
            configurable: true
        });
    }

}

module.exports = {
    ScriptHook
}


/***/ }),
/* 17 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * 封装一次 Script 请求的上下文，包含请求和响应的相关信息。
 */
const {randomId} = __webpack_require__(11);

class ScriptContext {

    /**
     * 构造函数，创建一个 ScriptContext 实例。
     *
     * @param {string} url - 请求的 URL。
     * @param {RequestContext} requestContext - 请求上下文，包含请求的详细信息。
     * @param {ResponseContext} responseContext - 响应上下文，包含响应的详细信息。
     */
    constructor(url, requestContext, responseContext) {
        // 生成唯一的请求 ID
        this.requestId = "js-script-hook-" + randomId();
        this.url = url;
        this.requestContext = requestContext;
        this.responseContext = responseContext;
    }

    /**
     * 判断此请求是否是 JSONP 请求。
     *
     * @returns {boolean} - 如果是 JSONP 请求则返回 true，否则返回 false。
     */
    isJsonp() {
        if (this.requestContext && this.requestContext.isJsonpRequest()) {
            return true;
        }
        if (this.responseContext && this.responseContext.isJsonpResponse()) {
            return true;
        }
        return false;
    }

    /**
     * 判断此请求是否是 .js 文件请求。
     *
     * @return {boolean} - 如果请求的路径以 .js 结尾则返回 true，否则返回 false。
     */
    isJsSuffixRequest() {
        return this.requestContext && this.requestContext.isJsSuffixRequest();
    }

    /**
     * 将 Script 上下文转换为方便人类阅读的格式。
     *
     * @return {string} - 返回格式化后的字符串。
     */
    toHumanReadable() {
        const msgs = [];

        if (this.requestContext) {
            msgs.push("Request Information: ");
            msgs.push(this.requestContext.toHumanReadable(4));
        }

        msgs.push("\n\n");

        if (this.responseContext) {
            msgs.push("Response Information: ");
            msgs.push(this.responseContext.toHumanReadable());
        }

        return msgs.join("\n\n");
    }

}

module.exports = {
    ScriptContext
};

/***/ }),
/* 18 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {repeat} = __webpack_require__(19);
const {Param} = __webpack_require__(20);

/**
 * 用于封装请求的上下文，包含从 URL 中解析出的各种信息。
 */
class RequestContext {

    /**
     * 构造函数，创建一个 RequestContext 实例。
     *
     * @param {string} rawUrl - 原始的 URL 地址，包含锚点部分。
     * @param {string} hostname - 主机名（例如：example.com）。
     * @param {string} host - 主机（包含端口号，例如：example.com:8080）。
     * @param {number} port - 端口号。
     * @param {string} path - URL 路径部分（例如：/path/to/resource）。
     * @param {Array<Param>} params - URL 中的查询参数列表。
     * @param {string} hash - URL 中的锚点部分（例如：#section1）。
     */
    constructor(rawUrl, hostname, host, port, path, params, hash) {
        this.rawUrl = rawUrl;
        this.hostname = hostname;
        this.host = host;
        this.port = port;
        this.path = path;
        // 避免 params 为空，初始化为空数组
        this.params = params || [];
        this.hash = hash;
    }

    /**
     * 从 URL 解析请求上下文。
     *
     * @param {string} requestUrl - 要被解析的 URL。
     * @return {RequestContext} - 返回解析好的请求上下文。
     */
    static parseRequestContext(requestUrl) {
        const url = new URL(requestUrl);

        // 解析 URL 上的参数
        const params = [];
        url.searchParams.forEach(function (value, key) {
            const param = new Param(key, value);
            params.push(param);
        });

        const port = parseInt(url.port);
        const host = url.host;
        const hostname = url.hostname;
        const path = url.pathname;
        const hash = url.hash;

        return new RequestContext(requestUrl, hostname, host, port, path, params, hash);
    }

    /**
     * 根据参数名获取参数对象。
     *
     * @param {string} paramName - 要查找的参数名。
     * @return {Param|null} - 返回找到的参数对象，如果未找到则返回 null。
     */
    getParam(paramName) {
        for (let param of this.params) {
            if (param.name === paramName) {
                return param;
            }
        }
        return null;
    }

    /**
     * 根据参数名获取参数值。
     *
     * @param {string} paramName - 要查找的参数名。
     * @return {string|null} - 返回参数的值，如果未找到则返回 null。
     */
    getParamValueByName(paramName) {
        const param = this.getParam(paramName);
        if (param) {
            return param.value;
        } else {
            return null;
        }
    }

    /**
     * 判断此请求是否是 JSONP 类型的请求。
     *
     * @return {boolean} - 如果是 JSONP 请求则返回 true，否则返回 false。
     */
    isJsonpRequest() {
        if (!this.params) {
            return false;
        }
        for (let p of this.params) {
            if (p.isJsonpCallback) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取 JSONP 请求的回调函数名称。
     *
     * @return {string|null} - 返回 JSONP 回调函数的名称，如果未找到则返回 null。
     */
    getJsonpCallbackFuncName() {
        if (!this.params) {
            return null;
        }
        for (let p of this.params) {
            if (p.isJsonpCallback) {
                return p.value;
            }
        }
        return null;
    }

    /**
     * 判断此请求是否是 .js 后缀的请求。
     *
     * @return {boolean} - 如果路径以 .js 结尾则返回 true，否则返回 false。
     */
    isJsSuffixRequest() {
        return this.path && this.path.toLowerCase().endsWith(".js");
    }

    /**
     * 将请求上下文转换为方便人类阅读的格式。
     *
     * @param {number} indent - 缩进空格数，用于格式化输出。
     * @return {string} - 返回格式化后的字符串。
     */
    toHumanReadable(indent) {
        const indentSpace = repeat(" ", indent);

        const msgs = [];
        msgs.push(`${indentSpace}hostname: ${this.hostname}`);
        msgs.push(`${indentSpace}path: ${this.path}`);

        let paramTitle = `${indentSpace}params(${this.params.length}): `;
        if (!this.params.length) {
            paramTitle += " do not have param.";
        }
        msgs.push(paramTitle);
        for (let param of this.params) {
            msgs.push(param.toHumanReadable(indent + 4));
        }

        if (this.hash) {
            msgs.push(`${indentSpace}hash: ${this.hash}`);
        }

        return msgs.join("\n");
    }
}

module.exports = {
    RequestContext
};

/***/ }),
/* 19 */
/***/ ((module) => {

/**
 * 将字符串重复指定次数并拼接成一个新字符串。
 *
 * @param {string} s - 需要重复的字符串。
 * @param {number} times - 重复的次数。
 * @return {string} - 返回重复拼接后的字符串。
 */
function repeat(s, times) {
    const msgs = [];
    for (let i = 0; i < times; i++) {
        msgs.push(s);
    }
    return msgs.join("");
}

/**
 * 将字符串填充到指定长度。如果字符串长度不足，则在末尾填充空格。
 *
 * @param {string} s - 需要填充的字符串。
 * @param {number} length - 目标长度。
 * @return {string} - 返回填充后的字符串。如果字符串长度已经大于或等于目标长度，则返回原字符串。
 */
function fillToLength(s, length) {
    if (s.length >= length) {
        return s;
    } else {
        return s + repeat(" ", length - s.length);
    }
}

module.exports = {
    repeat,
    fillToLength,
};

/***/ }),
/* 20 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {repeat} = __webpack_require__(19);

/**
 * 表示 URL 路径中的一个参数。对于 script 类型的请求来说，它只有 query string 类型的参数，因为它无法携带请求体。
 */
class Param {

    /**
     * 构造函数，创建一个 Param 实例。
     *
     * @param {string} name - 参数的名字。
     * @param {string} value - 参数的值。
     * @param {boolean} [isJsonpCallback=false] - 此参数是否是 JSONP 的回调函数名称。注意：有可能会识别不准。
     */
    constructor(name, value, isJsonpCallback) {

        // 参数名和值
        this.name = name;
        this.value = value;

        // 这个参数是否是 JSONP 的回调函数
        this.isJsonpCallback = isJsonpCallback || false;

        // 此参数是 JSONP 的 callback 参数的可能性有多大（用于评分）
        this.jsonpCallbackScore = 0;

        // 参数的加密类型
        this.encryptType = null;
    }

    /**
     * 将参数转换为适合人类阅读的格式。
     *
     * @param {number} indent - 缩进空格数，用于格式化输出。
     * @return {string} - 返回格式化后的参数字符串。
     */
    toHumanReadable(indent) {
        const indentString = repeat(" ", indent);
        if (this.isJsonpCallback) {
            return `${indentString}${this.name} = ${this.value}    <---- this param is jsonp callback function name`;
        } else {
            return `${indentString}${this.name} = ${this.value}`;
        }
    }

}

module.exports = {
    Param
};

/***/ }),
/* 21 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {getUnsafeWindow} = __webpack_require__(14);
const {ParamEncryptionAnalyzer} = __webpack_require__(22);

/**
 * 分析请求中的jsonp情况，主要是看一下是否存在jsonp参数，并将其识别出来
 */
class RequestAnalyzer {

    /**
     *
     * @param requestContext {RequestContext}
     */
    analyze(requestContext) {

        if (!requestContext.params) {
            return null;
        }

        // 自动推断出jsonp参数
        requestContext.params = this.computeParamsJsonpCallbackScore(requestContext.params);
        // 选出其中可能性最大的一个参数作为jsonp callback参数
        if (requestContext.params && requestContext.params.length && requestContext.params[0].jsonpCallbackScore > 0) {
            requestContext.params[0].isJsonpCallback = true;
        }

        // 推断参数加密方式
        const paramEncryptionAnalyzer = new ParamEncryptionAnalyzer();
        for (let param of requestContext.params) {
            param.encryptType = paramEncryptionAnalyzer.analyze(param);
        }

    }

    /**
     * 计算每个参数的jsonp callback的可能性的得分，并按照得分倒序排列返回
     *
     * @param params
     * @return {number}
     */
    computeParamsJsonpCallbackScore(params) {
        for (let param of params) {
            param.jsonpCallbackScore = this.computeParamJsonpCallbackScore(param);
        }
        params.sort((a, b) => b.jsonpCallbackScore - a.jsonpCallbackScore);
        return params;
    }

    /**
     *
     * 计算单个参数的得分
     *
     * @param param {Param}
     * @return {number}
     */
    computeParamJsonpCallbackScore(param) {

        // 是否存在对应的全局的函数类型，不存在的话肯定也不是jsonp的callback
        const unsafeWindow = getUnsafeWindow();
        if (typeof unsafeWindow[param.value] !== "function") {
            // 如果都没有对应的全局函数存在的话，则直接判定为0分
            return 0;
        }
        let jsonpScore = 100;

        // TODO 2024-12-22 01:32:28 如果是名称完全等于callback和包含callback，得到的分值是不是不应该一样？
        // 判断参数中的jsonp参数特征，参数名
        const paramName = param.name.toLowerCase();
        if (paramName.indexOf("callback") !== -1) {
            jsonpScore += 10;
        }

        // 参数值，寻找时间戳特征
        const match = new RegExp(/(\d{13}|\d{10})/).exec(param.value);
        if (match && this.isValidJsonpTimestamp(match[0])) {
            jsonpScore += 50;
        }

        return jsonpScore;
    }

    /**
     * 判断时间戳是否是合法的jsonp时间戳，它的时间范围不应该太过于离谱，应该是一个近期的时间
     *
     * @param timestampString
     * @return {boolean}
     */
    isValidJsonpTimestamp(timestampString) {
        if (!timestampString) {
            return false;
        }
        let timestamp = parseInt(timestampString);
        if (timestampString.length === 10) {
            timestamp *= 1000;
        }
        // 判断时间戳的范围是否合法，这个时间戳应该是当前时间的前后24小时浮动（考虑到时区之类的问题简单起见）
        const max = new Date().getTime() + 1000 * 60 * 60 * 24;
        const min = new Date().getTime() - 1000 * 60 * 60 * 24;
        return timestamp >= min && timestamp <= max;
    }

}

module.exports = {
    RequestAnalyzer
}




/***/ }),
/* 22 */
/***/ ((module) => {

/**
 * 参数加密分析器类，用于检测输入参数的加密类型。
 */
class ParamEncryptionAnalyzer {

    /**
     * 分析参数的加密类型。
     * @param {Param} param - 需要分析的参数对象，包含一个 `value` 属性。
     * @returns {string|null} 返回检测到的加密类型，如果无法识别则返回 `null`。
     */
    analyze(param) {
        return this.detectEncryptionType(param.value);
    }

    /**
     * 检测输入字符串的加密类型。
     * @param {string} input - 需要检测的输入字符串。
     * @returns {string|null} 返回检测到的加密类型，如果无法识别则返回 `null`。
     */
    detectEncryptionType(input) {

        // 如果输入为空，直接返回 null
        if (!input) {
            return null;
        }

        // // Base64 编码检测
        // const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
        // if (base64Regex.test(input) && input.length % 4 === 0) {
        //     return "Base64";
        // }

        // MD5 哈希检测
        const md5Regex = /^[a-f0-9]{32}$/i;
        if (md5Regex.test(input)) {
            return "MD5";
        }

        // SHA-1 哈希检测
        const sha1Regex = /^[a-f0-9]{40}$/i;
        if (sha1Regex.test(input)) {
            return "SHA-1";
        }

        // SHA-256 哈希检测
        const sha256Regex = /^[a-f0-9]{64}$/i;
        if (sha256Regex.test(input)) {
            return "SHA-256";
        }

        // SHA-512 哈希检测
        const sha512Regex = /^[a-f0-9]{128}$/i;
        if (sha512Regex.test(input)) {
            return "SHA-512";
        }

        // bcrypt 哈希检测
        const bcryptRegex = /^\$2[aby]\$\d{2}\$[.\/A-Za-z0-9]{53}$/;
        if (bcryptRegex.test(input)) {
            return "bcrypt";
        }

        // // URL 编码检测
        // const urlEncodedRegex = /%[0-9A-Fa-f]{2}/;
        // if (urlEncodedRegex.test(input)) {
        //     return "URL Encoded";
        // }
        //
        // // Hex 编码检测
        // const hexRegex = /^[0-9A-Fa-f]+$/;
        // if (hexRegex.test(input) && input.length % 2 === 0) {
        //     return "Hex Encoded";
        // }

        // // ROT13 编码检测
        // const rot13Regex = /^[A-Za-z]+$/;
        // if (rot13Regex.test(input) && input === input.replace(/[A-Za-z]/g, function (c) {
        //     return String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() < 'n' ? 13 : -13));
        // })) {
        //     return "ROT13";
        // }

        // // JWT (JSON Web Token) 检测
        // const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
        // if (jwtRegex.test(input)) {
        //     return "JWT";
        // }

        // UUID 检测
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(input)) {
            return "UUID";
        }

        // 如果以上所有加密类型都不匹配，返回 null 表示未知加密类型
        return null;
    }

}

// 导出 ParamEncryptionAnalyzer 类
module.exports = {
    ParamEncryptionAnalyzer
}

/***/ }),
/* 23 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {genFormatArray} = __webpack_require__(24);
const {repeat, fillToLength} = __webpack_require__(19);
const {getLanguage, getLanguageByGlobalConfig} = __webpack_require__(12);
const {getGlobalConfig} = __webpack_require__(5);
const {printStyledTable} = __webpack_require__(25);
const {getUserCodeLocation} = __webpack_require__(26);

/**
 * 用于第请求进行格式化
 */
class RequestFormatter {

    /**
     *
     * @param scriptContext {ScriptContext}
     */
    format(scriptContext) {

        const codeLocation = getUserCodeLocation();

        const requestContext = scriptContext.requestContext;
        const language = getLanguageByGlobalConfig();

        const data = [
            // TODO 2025-01-08 01:28:26 国际化
            [language.console.tableKey, language.console.tableValue, language.console.tableComment],
            [language.console.time, new Date().toLocaleString(), ""],
            [language.console.requestId, scriptContext.requestId, ""],
            [language.console.isJsonpRequest, scriptContext.isJsonp(), ""],
            [language.console.hostname, requestContext.hostname, ""],
            [language.console.path, requestContext.path, ""],
            [language.console.hash, requestContext.hash, ""],
            [language.console.codeLocation, codeLocation, ""],
            // [language.console.param, requestContext.params.length],
        ];

        let index = 1;
        for (let param of requestContext.params) {

            const name = `${language.console.param}(${index++}) ${param.name}`;

            let value = `${param.value}`;

            let attribute = "";
            if (param.isJsonpCallback) {
                attribute = "jsonp callback";
            } else if (param.encryptType) {
                attribute = param.encryptType;
            }

            data.push([name, value, attribute]);
        }

        // 示例样式
        const styles = {
            borderColor: '#000',
            cellBackgroundColor: '#f0f0f0',
            fontSize: '14px',
            fontColor: '#333'
        };

        // 打印表格
        const title = language.console.titleRequest;
        printStyledTable(data, styles, title);

    }

    /**
     *
     * @param language
     * @param params {Array<Param>}
     * @return {*[]}
     */
    convertParamsToTableData(language, params) {
        const tableData = [];
        for (let param of params) {
            const o = {};
            o[language.console.paramName] = param.name;
            o[language.console.paramValue] = param.value;
            o[language.console.isJsonpCallback] = param.isJsonpCallback;
            tableData.push(o);
        }
        return tableData;
    }

}

module.exports = {
    RequestFormatter
}

/***/ }),
/* 24 */
/***/ ((module) => {

/**
 * 生成一个格式化字符串数组，用于 `console.log` 的多样式输出。
 *
 * 该函数接受一个包含消息和样式的数组，生成一个格式化字符串，用于将消息和样式一一对应。
 * 例如，输入 `["Hello", "color: red", "World", "color: blue"]`，输出 `"%c%s%c%s"`。
 *
 * @param {Array<string>} messageAndStyleArray - 包含消息和样式的数组。消息和样式交替出现，例如 `["消息1", "样式1", "消息2", "样式2"]`。
 * @return {string} - 返回一个格式化字符串，例如 `"%c%s%c%s"`，用于 `console.log` 的多样式输出。
 */
function genFormatArray(messageAndStyleArray) {
    const formatArray = [];
    // 遍历数组，每两个元素（消息和样式）生成一个 "%c%s"
    for (let i = 0, end = messageAndStyleArray.length / 2; i < end; i++) {
        formatArray.push("%c%s");
    }
    // 将数组拼接成一个字符串
    return formatArray.join("");
}

module.exports = {
    genFormatArray
};

/***/ }),
/* 25 */
/***/ ((module) => {

function printStyledTable(data, styles, title = '') {
    const { borderColor, cellBackgroundColor, fontSize, fontColor, titleFontSize = '20px' } = styles;

    // 计算字符串的实际宽度（中文字符宽度为2，英文字符宽度为1）
    function getStringWidth(str) {
        let width = 0;
        for (const char of str) {
            width += /[\u4e00-\u9fa5]/.test(char) ? 2 : 1; // 判断是否为中文字符
        }
        return width;
    }

    // 计算每列的最大宽度
    let colWidths = data[0].map((_, colIndex) =>
        Math.max(...data.map(row => getStringWidth(String(row[colIndex]))))
    );

    // 计算表格的总宽度
    const totalWidth = colWidths.reduce((sum, width) => sum + width + 3, 0) - 1;

    // 定义表格的样式
    const tableStyle = `
        padding: 5px;
        font-size: ${fontSize};
        color: ${fontColor};
        background-color: ${cellBackgroundColor};
        border: 1px solid ${borderColor};
        font-family: monospace;
        white-space: pre; // 保留空格和换行
    `;

    // 定义标题的样式（背景色和边框与表格一致）
    const titleStyle = `
        font-size: ${titleFontSize};
        font-weight: bold;
        text-align: center;
        background-color: ${cellBackgroundColor};
        border: 1px solid ${borderColor};
        padding: 5px;
    `;

    // 根据实际宽度填充字符串
    function padString(str, width) {
        const strWidth = getStringWidth(str);
        if (strWidth >= width) return str; // 如果字符串宽度已经足够，直接返回
        const padding = ' '.repeat(width - strWidth); // 计算需要填充的空格
        return str + padding;
    }

    // 构建表格内容
    let tableContent = '';

    // 如果有标题，添加标题行
    if (title) {
        const titleWidth = getStringWidth(title);
        const leftPadding = Math.floor((totalWidth - titleWidth) / 2);
        const rightPadding = totalWidth - titleWidth - leftPadding;
        const paddedTitle = ' '.repeat(leftPadding) + title + ' '.repeat(rightPadding);
        tableContent += '%c' + paddedTitle + '\n';
    }

    // 表头
    tableContent += data[0]
        .map((cell, index) => padString(String(cell), colWidths[index]))
        .join(' │ ');

    // 表格内容
    for (let i = 1; i < data.length; i++) {
        tableContent += '\n' + data[i]
            .map((cell, index) => padString(String(cell), colWidths[index]))
            .join(' │ ');
    }

    // 打印表格
    if (title) {
        console.log('%c' + tableContent, titleStyle, tableStyle);
    } else {
        console.log('%c' + tableContent, tableStyle);
    }
}

module.exports = {
    printStyledTable
};

/***/ }),
/* 26 */
/***/ ((module) => {

/**
 * 获取函数的方法体代码。
 *
 * @param {Function} fn - 要提取方法体的函数。
 * @return {string} - 返回函数的方法体代码。
 * @throws {TypeError} - 如果传入的参数不是函数，则抛出 TypeError。
 */
function getFunctionBody(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError('Expected a function');
    }

    // 获取函数的完整代码
    const fullCode = fn.toString();

    // 提取方法体的代码
    const bodyStart = fullCode.indexOf('{') + 1; // 找到方法体的开始位置
    const bodyEnd = fullCode.lastIndexOf('}');   // 找到方法体的结束位置

    // 提取并返回方法体的代码
    return fullCode.slice(bodyStart, bodyEnd).trim();
}

/**
 * 获取函数的参数名。
 *
 * @param {Function} fn - 要提取参数名的函数。
 * @return {string[]} - 返回函数的参数名数组。如果没有参数，则返回空数组。
 * @throws {TypeError} - 如果传入的参数不是函数，则抛出 TypeError。
 */
function getParameterNames(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError('Expected a function');
    }

    // 将函数转换为字符串
    const fnStr = fn.toString();

    // 提取参数部分
    const paramPattern = /\(([^)]*)\)/;
    const match = fnStr.match(paramPattern);

    if (!match || !match[1]) {
        return []; // 如果没有参数，返回空数组
    }

    // 提取参数名称
    const paramNames = match[1]
        .split(',')
        .map(param => param.trim())
        .filter(param => param); // 过滤掉空字符串

    return paramNames;
}

/**
 * 生成一个随机的函数名。
 *
 * @param {number} [length=8] - 函数名的长度，默认为 8。
 * @return {string} - 返回生成的随机函数名。
 */
function generateRandomFunctionName(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const tampermonkeyChromeExtensionId = "dhdgffkkebhmkfjojejmpbldmpobfkfo";

/**
 * 获取用户代码的位置，用户代码的定义就是调用栈里从用户的代码进入到插件代码的第一行代码
 */
function getUserCodeLocation() {

    // 把调用栈一个栈帧一个栈帧的弹掉
    const stack = new Error().stack.split("\n");
    let index = stack.length - 1;
    while (index >= 0) {
        const frame = stack[index];
        if (frame.includes(tampermonkeyChromeExtensionId) && index < stack.length) {
            return stack[index + 1].trim();
        } else {
            index--;
        }
    }
    return null;
}

module.exports = {
    getFunctionBody,
    getParameterNames,
    generateRandomFunctionName,
    getUserCodeLocation,
};

/***/ }),
/* 27 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {getUnsafeWindow} = __webpack_require__(14);
const {ObjectFunctionHook, hookTypeUseDeclareFunction, hookTypeUseProxyFunction} = __webpack_require__(28);
const {ResponseContext} = __webpack_require__(29);
const {ResponseFormatter} = __webpack_require__(30);
const {getGlobalConfig} = __webpack_require__(5);
const {DebuggerTester} = __webpack_require__(6);
const {RequestFormatter} = __webpack_require__(23);

/**
 * 给JSONP的回调函数增加hook
 */
class JsonpCallbackHook {

    /**
     *
     * @param scriptContext {ScriptContext}
     * @param hitDebuggers {Array<Debugger>}
     */
    constructor(scriptContext, hitDebuggers) {
        this.scriptContext = scriptContext;
        this.hitDebuggers = hitDebuggers;
    }

    /**
     *
     */
    addHook() {

        // 如果没有指定jsonp函数的名字的话，则尝试自动抽取函数名字
        let jsonpCallbackFunctionName = this.collectJsonpCallbackFunctionNameFromHitDebuggers();
        if (!jsonpCallbackFunctionName) {
            jsonpCallbackFunctionName = this.scriptContext.requestContext.getJsonpCallbackFuncName();
        }
        if (!jsonpCallbackFunctionName) {
            return;
        }

        // 为响应体中的回调函数增加hook
        const jsonpCallbackFunction = getUnsafeWindow()[jsonpCallbackFunctionName];
        if (!jsonpCallbackFunction) {
            // TODO 2024-12-20 23:08:29 错误处理
            return;
        }
        // 跟进去这个 jsonpCallbackFunction 函数的代码位置就是jsonp的回调函数的逻辑，也是处理响应的逻辑
        const _this = this;
        const hook = new ObjectFunctionHook(getUnsafeWindow(), jsonpCallbackFunctionName);
        if (getGlobalConfig().hookType === "use-redeclare-function") {
            hook.hookType = hookTypeUseDeclareFunction;
            hook.addHook(this.callbackForDeclareFunction(_this));
        } else if (getGlobalConfig().hookType === "use-proxy-function") {
            hook.hookType = hookTypeUseProxyFunction;
            hook.callByHookCallbackFunction = true;
            hook.addHook(this.callbackForProxyFunction(_this));
        }
    }

    callbackForDeclareFunction(_this) {
        return function () {
            const responseContext = _this.scriptContext.responseContext = new ResponseContext("", arguments);

            // 只在有必要的情况下打印
            if (new DebuggerTester().isNeedPrintToConsole(getGlobalConfig(), _this.scriptContext)) {
                new ResponseFormatter().format(_this.scriptContext);
            }

            const hitDebuggers = getGlobalConfig().testAllForResponse(_this.scriptContext);
            return hitDebuggers.length;
        }
    }

    callbackForProxyFunction(_this) {
        return function () {
            const {hookFunctionHolder, args} = arguments[0];

            const responseContext = _this.scriptContext.responseContext = new ResponseContext("", args);

            // 只在有必要的情况下打印
            if (new DebuggerTester().isNeedPrintToConsole(getGlobalConfig(), _this.scriptContext)) {
                new ResponseFormatter().format(_this.scriptContext);
            }

            const hitDebuggers = getGlobalConfig().testAllForResponse(_this.scriptContext);
            const isHitDebugger = hitDebuggers.length;

            if (isHitDebugger) {
                // 把一些相关的上下文赋值到变量方便断点命中这里的时候观察
                // _scriptContext中存放的是与当前的script请求相关的一些上下文信息
                // humanReadableScriptInformation 存放的是上下文格式化后的一些可读的信息
                const humanReadableScriptInformation = _this.scriptContext.toHumanReadable()
                debugger;
            }

            // 跟进去这个函数，就是jsonp的callback函数
            hookFunctionHolder.apply(this, args);
        }
    }

    collectJsonpCallbackFunctionNameFromHitDebuggers() {
        for (let debuggerConfig of this.hitDebuggers) {
            if (debuggerConfig.callbackFunctionParamName) {
                const callbackFunctionName = this.scriptContext.requestContext.getParamValueByName(debuggerConfig.callbackFunctionParamName);
                if (callbackFunctionName) {
                    return callbackFunctionName;
                }
            }
        }
    }

}

module.exports = {
    JsonpCallbackHook
}


/***/ }),
/* 28 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {getGlobalConfig} = __webpack_require__(5);
const {getFunctionBody, getParameterNames, generateRandomFunctionName} = __webpack_require__(26);
const {getUnsafeWindow} = __webpack_require__(14);
const {getLanguage} = __webpack_require__(12);

const hookTypeUseProxyFunction = 1;
const hookTypeUseDeclareFunction = 2;

/**
 * 为全局的函数添加Hook，因为是要在新的script中调用，所以这些jsonp函数声明的都是全局作用域
 */
class ObjectFunctionHook {

    /**
     *
     * @param object
     * @param functionName
     */
    constructor(object, functionName) {

        // 被hook的对象
        this.object = object;
        // 被hook的函数名
        this.functionName = functionName;

        // hook的具体实现方式
        this.hookType = hookTypeUseDeclareFunction;
        // 是否由回调函数调用原函数
        this.callByHookCallbackFunction = false;
    }

    /**
     *
     * @param hookCallbackFunction
     */
    addHook(hookCallbackFunction) {

        // 要Hook的函数必须存在
        const functionHolder = this.object[this.functionName];
        if (!functionHolder) {
            // TODO 2024-12-20 01:04:00 统一日志
            console.log(`hook失败，函数不存在： ${this.functionName}`);
            return;
        }

        // 如果已经Hook过了则不重复hook，也就是说一次addHook只生效一次
        // TODO 2025-01-06 03:19:19 修改为读取配置中的前缀
        // const prefix = getGlobalConfig().prefix || "JSREI_js_script_hook"
        const prefix = "JSREI_js_script_hook"
        const hookDoneFlag = prefix + "_hookDoneFlag";
        if (functionHolder[hookDoneFlag]) {
            return;
        }

        if (this.hookType === hookTypeUseProxyFunction) {
            this.hookUseProxyFunction(functionHolder, hookCallbackFunction);
        } else {
            this.hookUseRedeclareFunction(functionHolder, hookCallbackFunction);
        }

        // 设置标记位，防止重复Hook
        this.object[this.functionName][hookDoneFlag] = true;
    }

    /**
     *
     * 直接修改原有函数代码的方式实现hook，注意，这种方式可能有点高危
     *
     * @param functionHolder
     * @param hookCallbackFunction
     */
    hookUseRedeclareFunction(functionHolder, hookCallbackFunction) {
        const hookCallbackFunctionGlobalName = generateRandomFunctionName(100);
        getUnsafeWindow()[hookCallbackFunctionGlobalName] = hookCallbackFunction
        let functionBodyCode = getFunctionBody(functionHolder);
        let parameterNames = getParameterNames(functionHolder);
        // TODO 2025-01-07 23:41:26 调用 hookCallbackFunction
        // TODO 2025-01-06 03:19:19 提示语也国际化，根据设置的语言选择
        // TODO 2025-01-09 02:58:29 暂不删除函数，否则第二次运行就可能报错了，暂不考虑函数溢出的问题
        const newFunctionCode = `
        
        // 这里就是jsonp的回调函数的方法体，这是插入的hook代码 
        // 判断是否命中断点 
        const isHitDebugger = ${hookCallbackFunctionGlobalName}.apply(this, arguments);
        // delete window["${hookCallbackFunctionGlobalName}"];
        if (isHitDebugger) {
            debugger; 
        }
        
        // 下面是网站自己的callback函数的逻辑 
        // 如果有作用域报错，可以考虑：
        // 1. 在配置中把hook类型切换到代理函数模式 
        // 2. 获取根据下面的代码全局搜索定位打断点，曲线救国 
        ${functionBodyCode}
        
        `;
        this.object[this.functionName] = new Function(...parameterNames, newFunctionCode);
    }

    /**
     *
     * 使用代理函数替换的方式来实现hook
     *
     * @param functionHolder
     * @param hookCallbackFunction
     */
    hookUseProxyFunction(functionHolder, hookCallbackFunction) {
        const _this = this;
        // 为函数添加Hook
        this.object[this.functionName] = function () {

            if (_this.callByHookCallbackFunction) {
                // 由hook函数自行调用被hook函数
                try {
                    hookCallbackFunction.apply(this, [{
                        "hookFunctionHolder": functionHolder,
                        "args": arguments
                    }]);
                } catch (e) {
                    console.error(e);
                }
            } else {
                // 不干扰流程，hook函数只作为观测
                try {
                    // TODO 2023-8-21 22:15:09 在函数执行的时候尝试触发各种断点
                    hookCallbackFunction.apply(this, arguments);
                } catch (e) {
                    console.error(e);
                }
                return functionHolder.apply(this, arguments);
            }
        }
    }

}

module.exports = {
    ObjectFunctionHook,
    hookTypeUseProxyFunction,
    hookTypeUseDeclareFunction,
}


/***/ }),
/* 29 */
/***/ ((module) => {

/**
 * 表示一个 Script 类型请求的响应，包含响应的 JavaScript 代码或 JSONP 回调参数。
 */
class ResponseContext {

    /**
     * 构造函数，创建一个 ResponseContext 实例。
     *
     * @param {string} responseJsCode - 脚本原始的响应代码。
     * @param {Array|null} [jsonpCallbackArguments=null] - 如果是 JSONP 类型的请求，捕捉到的响应参数。
     */
    constructor(responseJsCode, jsonpCallbackArguments = null) {
        this.responseJsCode = responseJsCode;
        this.jsonpCallbackArguments = jsonpCallbackArguments;
    }

    /**
     * 从 HTMLScriptElement 解析响应上下文。
     *
     * @param {HTMLScriptElement} script - 包含响应代码的 script 元素。
     * @return {ResponseContext} - 返回解析好的响应上下文。
     */
    static parseResponseContext(script) {
        const responseJsCode = script.text;
        return new ResponseContext(responseJsCode);
    }

    /**
     * 判断此响应是否是 JSONP 类型的响应。
     *
     * @return {boolean} - 如果是 JSONP 响应则返回 true，否则返回 false。
     */
    isJsonpResponse() {
        return !!this.jsonpCallbackArguments;
    }

    /**
     * 将响应上下文转换为方便人类阅读的格式。
     *
     * @return {string} - 返回格式化后的字符串。
     */
    toHumanReadable() {
        const msgs = [];
        if (this.isJsonpResponse()) {
            msgs.push("jsonp callback payload: ");
            msgs.push(JSON.stringify(this.jsonpCallbackArguments, null, 4));
        } else {
            msgs.push("javascript code: ");
            msgs.push(this.responseJsCode);
        }
        return msgs.join("\n");
    }

}

module.exports = {
    ResponseContext
};

/***/ }),
/* 30 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {getLanguage, chinese, getLanguageByGlobalConfig} = __webpack_require__(12);
const {fillToLength} = __webpack_require__(19);
const {genFormatArray} = __webpack_require__(24);
const {getGlobalConfig} = __webpack_require__(5);
const {highlightJSON} = __webpack_require__(31);
const {getUserCodeLocation} = __webpack_require__(26);
const {printStyledTable} = __webpack_require__(25);

/**
 * 用于对响应进行格式化
 */
class ResponseFormatter {

    /**
     *
     * @param scriptContext {ScriptContext}
     */
    format(scriptContext) {

        const codeLocation = getUserCodeLocation();

        const responseContext = scriptContext.responseContext;
        const requestContext = scriptContext.requestContext;
        const language = getLanguageByGlobalConfig();

        const data = [
            // TODO 2025-01-08 01:28:26 国际化
            [language.console.tableKey, language.console.tableValue, language.console.tableComment],
            [language.console.time, new Date().toLocaleString(), ""],
            [language.console.requestId, scriptContext.requestId, ""],
            [language.console.isJsonpRequest, scriptContext.isJsonp(), ""],
            [language.console.hostname, requestContext.hostname, ""],
            [language.console.path, requestContext.path, ""],
            [language.console.hash, requestContext.hash, ""],
            [language.console.codeLocation, codeLocation, ""],
            // [language.console.param, requestContext.params.length],
        ];
        // 示例样式
        const styles = {
            borderColor: '#000',
            cellBackgroundColor: '#f0f0f0',
            fontSize: '14px',
            fontColor: '#333'
        };

        // 打印表格
        const title = language.console.titleResponse;
        printStyledTable(data, styles, title);
        const msgs = highlightJSON(responseContext.jsonpCallbackArguments);
        // console.log(msgs);

    }

}

module.exports = {
    ResponseFormatter
}

/***/ }),
/* 31 */
/***/ ((module) => {

const styles = {
    key: 'color: green;',
    string: 'color: yellow;',
    number: 'color: blue;',
    boolean: 'color: red;',
    null: 'color: magenta;'
};

function buildString(val, strArr, styleArr) {
    if (typeof val === 'string') {
        styleArr.push(styles.string);
        strArr.push('%c"' + val + '"');
    } else if (typeof val === 'number') {
        styleArr.push(styles.number);
        strArr.push('%c' + val);
    } else if (typeof val === 'boolean') {
        styleArr.push(styles.boolean);
        strArr.push('%c' + val);
    } else if (val === null) {
        styleArr.push(styles.null);
        strArr.push('%cnull');
    } else if (Array.isArray(val)) {
        strArr.push('[');
        for (let i = 0; i < val.length; i++) {
            if (i > 0) strArr.push(', ');
            buildString(val[i], strArr, styleArr);
        }
        strArr.push(']');
    } else if (typeof val === 'object' && val !== null) {
        strArr.push('{');
        const keys = Object.keys(val);
        for (let i = 0; i < keys.length; i++) {
            if (i > 0) strArr.push(', ');
            const key = keys[i];
            styleArr.push(styles.key);
            strArr.push('%c"' + key + '"');
            strArr.push(': ');
            buildString(val[key], strArr, styleArr);
        }
        strArr.push('}');
    }
}

function highlightJSON(jsonObj) {
    const strArr = [];
    const styleArr = [];
    buildString(jsonObj, strArr, styleArr);
    return [strArr.join(''), ...styleArr];
}

module.exports = {
    highlightJSON
}

/***/ }),
/* 32 */
/***/ ((module) => {

/**
 * 获取 URL 的基础路径（包括协议、域名和路径部分，但不包括文件名）。
 *
 * @param {string} urlString - 完整的 URL 字符串，例如 "https://example.com/path/to/page.html"。
 * @return {string} - 返回 URL 的基础路径，例如 "https://example.com/path/to/"。
 */
function urlBasePath(urlString) {
    const url = new URL(urlString);
    // 获取基础路径（包括协议、域名和路径部分，但不包括文件名）
    const basePath = `${url.origin}${url.pathname.substring(0, url.pathname.lastIndexOf("/") + 1)}`;
    // console.log(basePath); // 输出: https://example.com/path/to/
    return basePath;
}

/**
 * 将 script 的 src 格式化为完整的 URL。
 *
 * 支持以下格式的 script src：
 * 1. 完整的 URL（以 "http://" 或 "https://" 开头）。
 * 2. CDN URL（以 "//" 开头）。
 * 3. 相对路径（以 "./" 开头）。
 * 4. 省略域名的路径（以 "/" 开头）。
 * 5. 其他相对路径。
 *
 * @param {string} scriptSrc - script 的 src 属性值。
 * @return {string} - 返回格式化后的完整 URL。
 */
function formatScriptSrcToUrl(scriptSrc) {

    // 强制将 scriptSrc 转换为字符串（例如，处理 TrustedScriptURL 类型）
    scriptSrc = scriptSrc + "";

    // 如果已经是完整的 URL，直接返回
    if (scriptSrc.startsWith("http://") || scriptSrc.startsWith("https://")) {
        return scriptSrc;
    }

    // 处理 CDN URL（以 "//" 开头）
    // 示例："//statics.moonshot.cn/kimi-chat/shared-K0TvIN461soURJCs7nh6uxcQiCM_.04bc3959.async.js"
    if (scriptSrc.startsWith("//")) {
        return "https:" + scriptSrc;
    }

    // 处理相对路径（以 "./" 开头）
    // 示例："./js/login/log-utils1.1.js"
    if (scriptSrc.startsWith("./")) {
        return urlBasePath(window.location.href) + scriptSrc.substring(2, scriptSrc.length);
    }

    // 处理省略域名的路径（以 "/" 开头）
    // 示例："/logos/2024/moon/december-r4/december.js"
    if (scriptSrc.startsWith("/")) {
        return window.location.origin + scriptSrc;
    }

    // 处理其他相对路径
    // 示例："static/js/chunk-19a101ae.45e69b5c.js"
    return window.location.origin + "/" + scriptSrc;
}

module.exports = {
    urlBasePath,
    formatScriptSrcToUrl,
};

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
const {init} = __webpack_require__(1);

(async () => {
    init();
})();

/******/ })()
;

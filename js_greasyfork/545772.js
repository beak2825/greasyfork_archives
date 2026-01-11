// ==UserScript==
// @name         小黑盒Pro
// @namespace    You Boy
// @version      1.3.4
// @description  为小黑盒PC网站提供可动态配置的增强功能，如夜间模式切换、Steam商店直达等。
// @author       You Boy
// @match        *://*.xiaoheihe.cn/*
// @icon         https://imgheybox.max-c.com/avatar/2024/12/31/a6472e5653708a6649e49e40aa7bb13f.jpeg?imageMogr2/thumbnail/100x100
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.addStyle
// @grant        GM.registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545772/%E5%B0%8F%E9%BB%91%E7%9B%92Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/545772/%E5%B0%8F%E9%BB%91%E7%9B%92Pro.meta.js
// ==/UserScript==

// #region ================================ 核心框架 (Core Framework) ================================

const Caliber = (() => {
  "use strict";

  // #region --- 类型定义 (Type Definitions) ---
  /**
   * @typedef {object} DomBatchProcessorInstance 高性能DOM批量处理调度器实例
   * @property {(selector: string, callback: (node: HTMLElement) => void, options?: object) => Symbol} register - 注册一个DOM处理任务，返回一个唯一的任务ID。
   * @property {(taskId: Symbol) => void} unregister - 根据任务ID注销一个DOM处理任务。
   */

  /**
   * @typedef {object} ConfigManagerInstance 配置管理器实例
   * @property {() => object} getConfig - 获取当前已加载的配置对象。
   * @property {(path: string, value: any) => Promise<void>} updateAndSave - 按路径更新配置项并自动保存。
   * @property {() => Promise<void>} save - 手动将当前配置保存到存储中。
   */

  /**
   * @typedef {object} ModuleManagerInstance 模块管理器实例
   * @property {(ModuleClass: typeof Module) => void} register - 注册一个模块类。
   * @property {() => Module[]} getAllRegisteredModules - 获取所有已注册模块的元数据，主要用于UI生成。
   */

  /**
   * @typedef {object} ModuleControlFacadeInstance 模块控制门面实例
   * @property {() => void} requestReset - 请求模块管理器对当前模块执行一次完整的“停用-启用”重置循环。
   */

  /**
   * @typedef {object} LoggerInstance 日志记录器实例
   * @property {(message: any, ...args: any[]) => void} log - 输出一条标准日志。
   * @property {(message: any, ...args: any[]) => void} warn - 输出一条警告日志。
   * @property {(message: any, ...args: any[]) => void} error - 输出一条错误日志。
   * @property {(tag: string, styleOptions?: object) => LoggerInstance} createTaggedLogger - 创建一个带有自定义标签和样式的子日志记录器。
   */

  /**
   * @typedef {object} EventBusInstance 全局事件总线实例
   * @property {(eventName: string, callback: (data: any) => void) => void} on - 订阅一个事件。
   * @property {(eventName: string, callback: (data: any) => void) => void} off - 取消订阅一个事件。
   * @property {(eventName: string, data?: any) => void} emit - 发布一个事件。
   */

  /**
   * @typedef {object} StorageAdapter 存储服务适配器
   * @property {() => Promise<object>} get - 异步获取存储的配置对象。
   * @property {(value: object) => Promise<void>} set - 异步将配置对象写入存储。
   */

  /**
   * @typedef {object} StyleAdapter 样式服务适配器
   * @property {(cssString: string, id: string) => Promise<void>} add - 注入一段CSS样式，并关联一个唯一ID。
   * @property {(id: string) => void} remove - 根据ID移除之前注入的样式。
   */

  /**
   * @typedef {string} FetchInterceptorRequestString
   *
   * 定义当一个网络请求被成功匹配时，在**发起实际请求之前**要执行的修改逻辑。
   * 这段代码在宿主页面的上下文中运行，拥有访问`window`对象的全部能力，但必须是一个无闭包依赖的纯字符串。
   *
   *  示例：为一个API请求添加或修改一个查询参数
   * .onRequest(`
   *   [可用上下文]
   *   - url: {string} 原始的、完整的请求URL字符串。
   *   - config: {object} 原始的fetch配置对象 (如 method, headers, body 等)。
   *   - urlObject: {URL} 由框架预先创建的URL实例，强烈推荐使用它来操作URL。
   *
   *   1. (推荐) 使用内置的 urlObject 来修改URL
   *   urlObject.searchParams.set('new_param', 'caliber_rocks');
   *
   *   2. (可选) 修改 fetch 配置对象
   *   config.headers = { ...config.headers, 'X-Caliber-Injected': 'true' };
   *
   *   [返回契约]
   *   必须返回一个包含 'url' 和 'config' 键的对象。
   *   - url: {string} 最终将要被请求的URL字符串。
   *   - config: {object} 最终将要被使用的fetch配置对象。
   *   return { url: urlObject.toString(), config };
   * `)
   *
   *  示例：添加或修改URL查询参数
   * > .onRequest(`
   *   [可用上下文]
   *   - url: {string} 原始的、完整的请求URL字符串。
   *   - config: {object} 原始的fetch配置对象 (如 method, headers, body 等)。
   *   - urlObject: {URL} 由框架预先创建的URL实例，强烈推荐使用它来操作URL。
   *
   *   (推荐) 使用内置的 urlObject 来修改URL的查询参数
   *   > urlObject.searchParams.set('page', '1');
   *   > urlObject.searchParams.set('limit', '50');
   *
   *   必须返回一个包含 'url' 和 'config' 键的对象。
   *   > return { url: urlObject.toString(), config };
   *
   * > `)
   *
   */

  /**
   * @typedef {object} FetchInterceptorBuilder 网络请求拦截器构建器
   * @property {(handlerString: FetchInterceptorRequestString) => FetchInterceptorBuilder} onRequest - 定义请求被拦截时要执行的逻辑。
   * @property {(callback: (responseData: any) => void) => FetchInterceptorBuilder} onResponse - 定义在沙箱中处理响应数据的回调函数。
   * @property {(id: string|string[]) => void} register - 最终确定并注册这个拦截器。
   */

  /**
   * @typedef {object} PageScopeExecutorInstance 页面作用域代码执行器服务实例
   * @property {(codeString: string) => Promise<any>} execute - 在宿主页面环境中异步执行一段JS代码，并返回其可序列化的结果。
   */

  /**
   * @callback DomWatcherCallback
   * @param {MutationRecord[]} mutations - DOM变化记录数组。
   */

  /**
   * @typedef {object} DomWatcherServiceInstance 统一DOM观察者服务实例
   * @property {(callback: DomWatcherCallback) => Symbol} subscribe - 订阅DOM变化，返回一个唯一的订阅ID。
   * @property {(id: Symbol) => void} unsubscribe - 根据订阅ID取消订阅。
   */

  /**
   * @callback ResponseCallback
   * @param {any} responseData - 从注入脚本传回的、已解析的响应数据。
   */

  /**
   * @typedef {object} FrameworkUtils 框架提供的公共工具函数集合
   * @property {(matchRule: string|RegExp|Array<string|RegExp>, hostWindow?: Window) => object|false} checkMatch - 检查给定的匹配规则是否与当前页面URL匹配。
   */

  /**
   * @typedef {object} FetchInterceptorInstance 网络请求拦截器服务实例
   * @property {(urlOrOptions: string|{url: string, method?: string, match?: string|RegExp|Array<string|RegExp>}) => FetchInterceptorBuilder} target - [推荐] 启动一个链式调用来构建拦截器。
   * @property {(options: {targetUrl: string, method?: string, handler: string}) => string} createHook - (底层) 创建一个钩子函数字符串。
   * @property {(path: string[]|string, hookFunctionString: string, awaitsResponse?: boolean) => void} addHook - (底层) 添加一个仅修改请求的钩子。
   * @property {(path: string[]|string, hookFunctionString: string, responseCallback: ResponseCallback) => void} addHookWithResponse - (底层) 添加一个带响应回调的钩子。
   * @property {(path: string[]|string) => void} removeHook - (底层/通用) 按ID移除一个已注册的拦截器。
   */

  /**
   * @typedef {object} DOMSanitizerInstance DOM净化与安全注入服务实例
   * @property {(htmlString: string) => (TrustedHTML|string)} createTrustedHTML - 创建一个受信任的HTML对象（如果Trusted Types策略可用）。
   * @property {(element: Element, htmlString: string) => void} setInnerHTML - 安全地设置一个元素的innerHTML。
   * @property {(doc: Document, codeString: string) => void} injectScript - 安全地向文档注入一段JavaScript代码。
   * @property {(doc: Document, cssString: string, id: string) => (HTMLStyleElement|null)} injectStyle - 安全地向文档注入一段CSS样式。
   */

  /**
   * @typedef {object} FrameworkServices 框架核心服务集合
   * @property {DomBatchProcessorInstance} scheduler - 高性能DOM批量处理调度器。
   * @property {FetchInterceptorInstance} interceptor - 网络请求拦截器。
   * @property {DOMSanitizerInstance} sanitizer - DOM净化与安全注入服务。
   * @property {PageScopeExecutorInstance} executor - 页面作用域代码执行器。
   * @property {DomWatcherServiceInstance} [_internal_domWatcher] - (内部服务) 统一的DOM观察者。
   * @property {FrameworkUtils} [utils] -  框架提供的公共工具函数集合。
   */

  /**
   * @typedef {object} CaliberServices 内核服务包
   * @property {LoggerInstance} logger - 日志服务实例。
   * @property {EventBusInstance} eventBus - 全局事件总线实例。
   * @property {Window} hostWindow - 宿主环境的 window 对象 (通常是 unsafeWindow)。
   * @property {Document} hostDocument - 宿主环境的 document 对象。
   * @property {StorageAdapter} storage - 存储服务适配器 (e.g., GM.getValue/setValue)。
   * @property {StyleAdapter} style - 样式服务适配器 (e.g., GM.addStyle)。
   * @property {string} APP_NAME - 当前应用的名称。
   * @property {ConfigManagerInstance} configManager - 配置管理器实例。
   * @property {ModuleManagerInstance} moduleManager - 模块管理器实例。
   * @property {ModuleControlFacadeInstance} [module] - (可选) 模块自身管理服务，仅在模块实例化时由ModuleManager动态注入。
   * @property {FrameworkServices} framework - 框架核心服务集合。
   */

  /**
   * @typedef {object} ModuleInterface 模块类的公共API与内部属性接口
   * @property {string} id - 模块的唯一标识符，用于配置和管理。
   * @property {string} name - 模块的显示名称，用于UI。
   * @property {string} description - 模块的功能描述，用于UI。
   * @property {object} defaultConfig - 模块的默认配置。
   * @property {string|RegExp|Array<string|RegExp>|null} [match=null] - (可选) 限制模块仅在匹配该规则的页面上运行。
   * @property {object} [uiGuard] - (可选) 声明式UI守护配置。提供此对象将激活框架的UI持久化守护。
   * @property {string} uiGuard.target - UI组件应该被注入的目标父容器的选择器。
   * @property {string} uiGuard.component - UI组件自身的选择器，用于检查其是否存在。
   *
   * @property {CaliberServices} _services - (底层) 内核注入的完整核心服务集合。
   * @property {object} _config - 模块在总配置对象中的专属部分。
   * @property {LoggerInstance} _logger - (快捷方式) 日志记录器。
   * @property {EventBusInstance} _eventBus - (快捷方式) 事件总线。
   * @property {Window} _hostWindow - (快捷方式) 宿主 window 对象。
   * @property {Document} _hostDocument - (快捷方式) 宿主 document 对象。
   * @property {DomBatchProcessorInstance} _scheduler - (快捷方式) 高性能DOM批量处理调度器。
   * @property {FetchInterceptorInstance} _interceptor - (快捷方式) 网络请求拦截器。
   * @property {DOMSanitizerInstance} _sanitizer - (快捷方式) DOM净化与安全注入服务。
   * @property {ModuleControlFacadeInstance} [_module] - (快捷方式) 模块自身管理服务，用于请求重置等操作。
   * @property {PageScopeExecutorInstance} _executor - (快捷方式) 页面作用域代码执行器
   * @property {FrameworkUtils} _utils - (快捷方式) 框架提供的公共工具函数集合。
   *
   * @property {(context: {params: object, query: object}) => void} onEnable - 当模块被启用时调用。会收到包含解析后URL参数的上下文对象。
   * @property {() => void} onDisable - 当模块被禁用时调用。必须在此处清理所有副作用。
   * @property {(key: string, newValue: any, oldValue: any) => void} onConfigChange - 当模块的特定配置项发生变化时调用。
   * @property {(context: {params: object, query: object}) => void} [onNavigate] - 当模块处于激活状态且发生URL导航时调用。用于响应SPA页面内部的路由变化。
   *
   * @property {(targetElement: HTMLElement) => void} [onRender] - (守护模式生命周期) 当UI需要被渲染或恢复时调用。此方法仅在模块定义了 uiGuard 时由框架调用。
   * @property {() => void} [onCleanup] - (守护模式生命周期) 当UI需要被清理时调用。此方法仅在模块定义了 uiGuard 且被禁用时由框架调用。
   */

  // #endregion

  /**
   * @class Module - 功能模块的标准化基类
   *
   * 所有功能模块都应继承此类，以确保接口统一和生命周期管理。
   * @implements {ModuleInterface}
   */
  class Module {
    id = "base-module";
    name = "Base Module";
    description = "";
    defaultConfig = {};
    match = null;
    uiGuard = null;

    _services;
    _config;
    _logger;
    _eventBus;
    _hostWindow;
    _hostDocument;
    _scheduler;
    _interceptor;
    _sanitizer;
    _executor;
    _utils;
    _module;

    /**
     * @param {CaliberServices} services - 内核注入的核心服务。
     * @param {object} moduleConfig - 该模块在总配置中的专属配置部分。
     */
    constructor(services, moduleConfig) {
      if (!services) {
        return;
      }

      this._services = services;
      this._config = moduleConfig;
      this._logger = services.logger;
      this._eventBus = services.eventBus;
      this._hostWindow = services.hostWindow;
      this._hostDocument = services.hostDocument;
      this._utils = services.framework.utils;
      this._module = services.module;

      // framework内部工具快捷方式
      this._scheduler = services.framework.scheduler;
      this._interceptor = services.framework.interceptor;
      this._sanitizer = services.framework.sanitizer;
      this._executor = services.framework.executor;
    }
    /**
     * 当模块被启用时调用。所有事件监听和DOM操作应在此处初始化。
     * @param {{params: object, query: object}} context - 包含从URL解析出的命名参数 (`params`) 和查询参数 (`query`) 的对象。
     */
    onEnable(context) {
      this._logger.warn(
        `Module '${this.id}' is missing the 'onEnable' implementation.`
      );
    }

    onDisable() {}

    /**
     * 当模块的特定配置项发生变化时调用。
     * @param {string} key - 发生变化的配置键。
     * @param {*} newValue - 新的配置值。
     * @param {*} oldValue - 旧的配置值。
     */
    onConfigChange(key, newValue, oldValue) {}

    onRender(targetElement) {}
    onCleanup() {}
    onNavigate(context) {}
  }

  /**
   * @class AppKernel - 应用程序内核
   *
   * 负责管理模块生命周期、配置、UI和所有核心服务。
   */
  class AppKernel {
    #services = {};
    #moduleManager;
    #configManager;
    #uiManager;
    #logger;
    #auditor = null;
    #uiGuardianService;

    /**
     * @param {object} injectedServices - 由 `createApp` 组装好的所有核心服务和配置。
     * @param {Window} injectedServices.hostWindow - 宿主 window 对象。
     * @param {Document} injectedServices.hostDocument - 宿主 document 对象。
     * @param {EventBusInstance} injectedServices.eventBus - 全局事件总线。
     * @param {LoggerInstance} injectedServices.logger - 主日志记录器。
     * @param {StorageAdapter} injectedServices.storage - 存储服务适配器。
     * @param {StyleAdapter} injectedServices.style - 样式服务适配器。
     * @param {FrameworkServices} injectedServices.framework - 框架内部服务集合。
     * @param {string} injectedServices.APP_NAME - 应用名称。
     * @param {string} injectedServices.SAFE_APP_NAME - 安全的应用名称。
     * @param {boolean} injectedServices.IS_DEBUG - 是否为调试模式。
     * @param {object} injectedServices.initialConfig - 框架的初始配置。
     */
    constructor(injectedServices) {
      const {
        // --- 运行时服务 ---
        hostWindow,
        hostDocument,
        eventBus,
        logger,
        storage,
        style,
        framework,
        APP_NAME,
        SAFE_APP_NAME,
        // --- 元数据/配置 ---
        IS_DEBUG,
        initialConfig,
      } = injectedServices;

      this.#logger = logger;

      // 将“运行时服务”组装到内核的 #services 对象中
      this.#services = {
        hostWindow,
        hostDocument,
        eventBus,
        logger,
        storage,
        style,
        framework,
        APP_NAME,
      };

      // 使用元数据进行初始化
      if (IS_DEBUG) {
        this.#auditor = new ModuleAuditor(
          this.#logger,
          hostWindow,
          SAFE_APP_NAME
        );
        this.#auditor?.patchScheduler(framework.scheduler);
      }

      // 实例化核心服务
      this.#uiGuardianService = new UIGuardianService(
        this.#services,
        framework._internal_domWatcher
      );
      this.#configManager = new ConfigManager(storage, logger, initialConfig);
      this.#moduleManager = new ModuleManager(
        this.#services,
        this.#auditor,
        this.#uiGuardianService
      );
      this.#uiManager = new UIManager(this.#services, this.#uiGuardianService);

      // 将新创建的管理器添加回 #services 包，以便所有模块都能访问它们
      this.#services.configManager = this.#configManager;
      this.#services.moduleManager = this.#moduleManager;

      this.#logger.log("Kernel constructed.");

      this.#services.eventBus.on(
        "command:toggle-settings-panel",
        this.#handleToggleSettingsPanel
      );
      this.#services.eventBus.on("config-updated", this.#onConfigUpdated);
    }

    #handleToggleSettingsPanel = async () => {
      const currentConfig = this.#configManager.getConfig();
      if (!currentConfig) {
        this.#logger.error(
          "Cannot toggle settings panel: config not loaded yet."
        );
        return;
      }
      const newState = !currentConfig.settingsPanel.enabled;
      await this.#configManager.updateAndSave(
        "settingsPanel.enabled",
        newState
      );

      this.#services.eventBus.emit("config-updated", {
        path: "settingsPanel.enabled",
        value: newState,
        newConfig: this.#configManager.getConfig(),
      });
    };

    #onConfigUpdated = (detail) => {
      if (detail.path === "settingsPanel.enabled") {
        this.#logger.log(
          `Settings Panel visibility changed to: ${detail.value}`
        );
        if (detail.value) {
          this.#uiManager.showPanelTrigger();
        } else {
          this.#uiManager.hidePanelTrigger();
        }
      }
    };

    /**
     * 启动应用。这是整个应用逻辑的入口点。
     */
    async run() {
      this.#logger.log("Kernel is running...");

      const moduleDefaultConfigs = this.#moduleManager.getAllDefaultConfigs();
      const finalConfig = await this.#configManager.loadAndGetConfig(
        moduleDefaultConfigs
      );
      this.#moduleManager.initializeActiveModules(finalConfig);
      this.#uiManager.init(finalConfig);

      this.#logger.log("Kernel run sequence complete.");
    }

    /**
     * 注册一个功能模块类。
     * @param {typeof Module} ModuleClass - 要注册的模块类 (注意是类本身，不是实例)。
     */
    registerModule(ModuleClass) {
      this.#moduleManager.register(ModuleClass);
    }
  }

  /**
   * @class ConfigManager - 配置管理器
   *
   * 负责加载、合并、保存配置。
   */
  class ConfigManager {
    #storage;
    #logger;
    #config;
    #initialConfig;

    constructor(storage, logger, initialConfig) {
      this.#storage = storage;
      this.#logger = logger;
      this.#initialConfig = initialConfig;
    }

    /**
     * 加载、合并配置，并返回最终结果。
     * @param {object} moduleDefaultConfigs - 所有模块的默认配置集合。
     * @returns {Promise<object>} 最终的运行时配置。
     */
    async loadAndGetConfig(moduleDefaultConfigs) {
      const userConfig = await this.#storage.get();
      const baseConfig = { ...this.#initialConfig, ...moduleDefaultConfigs };
      let mergedConfig = this.#deepMerge(baseConfig, userConfig);
      this.#config = this.#prune(mergedConfig, baseConfig);

      this.#logger.log(
        "Configuration loaded, merged, and pruned:",
        this.#config
      );
      return this.#config;
    }

    getConfig() {
      return this.#config;
    }

    /**
     * 通过路径更新配置树中的一个值，并触发保存。
     * @param {string} path - 要更新的配置路径，例如 'modules.themeSwitcher.theme'
     * @param {*} value - 新的配置值
     */
    async updateAndSave(path, value) {
      this.#set(this.#config, path, value);
      await this.save();
    }

    /**
     * 将当前配置保存到存储中。
     */
    async save() {
      await this.#storage.set(this.#config);
      this.#logger.log("Configuration saved.");
    }

    #deepMerge(target, source) {
      const output = { ...target };
      if (this.#isObject(target) && this.#isObject(source)) {
        for (const key in source) {
          const targetValue = target[key];
          const sourceValue = source[key];

          if (this.#isObject(targetValue) && this.#isObject(sourceValue)) {
            output[key] = this.#deepMerge(targetValue, sourceValue);
          } else if (
            this.#isObject(targetValue) &&
            !this.#isObject(sourceValue)
          ) {
            continue;
          } else {
            output[key] = sourceValue;
          }
        }
      }
      return output;
    }

    #isObject = (item) =>
      item && typeof item === "object" && !Array.isArray(item);

    #set = (obj, path, value) => {
      const keys = path.split(".");
      const lastKey = keys.pop();
      const finalObj = keys.reduce((o, k) => (o[k] = o[k] || {}), obj);
      finalObj[lastKey] = value;
    };

    /**
     * 以 template 为模板，递归地净化 source 对象。
     * 1. 移除所有不存在于 template 中的键。
     * 2. 检查值的类型，如果 source 中的值的类型与 template 不匹配，则强制回退到 template 的默认值。
     * 这是框架数据自愈能力的核心。
     * @param {object} source - 要被净化的对象 (例如，合并后的配置)。
     * @param {object} template - 权威的结构模板 (例如，默认基础配置)。
     * @returns {object} 净化后的新对象。
     * @private
     */
    #prune(source, template) {
      const prunedSource = {};

      for (const key in template) {
        if (source.hasOwnProperty(key)) {
          const sourceValue = source[key];
          const templateValue = template[key];

          const sourceType = typeof sourceValue;
          const templateType = typeof templateValue;

          // 核心净化逻辑：
          // 1. 如果类型匹配且都是对象，则递归净化。
          // 2. 如果类型匹配但不是对象，则接受用户的源值。
          // 3. 如果类型不匹配，则无条件地丢弃用户的源值，回退到模板的默认值。
          if (sourceType === templateType) {
            if (this.#isObject(sourceValue) && this.#isObject(templateValue)) {
              prunedSource[key] = this.#prune(sourceValue, templateValue);
            } else {
              prunedSource[key] = sourceValue; // 类型匹配，接受用户的值
            }
          } else {
            this.#logger.warn(
              `Configuration type mismatch for key '${key}'. User value (${sourceType}) discarded. Falling back to default (${templateType}).`
            );
            prunedSource[key] = templateValue; // 类型不匹配，强制回退
          }
        } else {
          // 如果用户的配置中缺少这个键，直接使用模板的默认值
          prunedSource[key] = template[key];
        }
      }
      // 遍历 source 中存在、但 template 中不存在的键，并将它们保留下来
      for (const key in source) {
        if (!template.hasOwnProperty(key)) {
          prunedSource[key] = source[key];
          // if (this.#logger) this.#logger.log(`Dynamically added key '${key}' from user config has been preserved.`);
        }
      }
      return prunedSource;
    }
  }

  /**
   * @class ModuleManager - 模块管理器
   *
   * 负责注册、实例化和管理所有模块的生命周期。
   */
  class ModuleManager {
    #services;
    #registeredModuleClasses = new Map();
    #activeModuleInstances = new Map();
    #auditor = null;
    #uiGuardian;

    constructor(services, auditor, uiGuardian) {
      this.#services = services;
      this.#auditor = auditor;
      this.#uiGuardian = uiGuardian;
      this.#services.eventBus.on("config-updated", this.#onConfigUpdated);
      this.#services.eventBus.on("navigate", this.#onNavigate);
    }

    /**
     * [公共API] 请求模块管理器重置（停用后重新启用）一个模块。
     * 这是模块自我刷新的最终、最可靠的方式。
     * @param {string} id - 要重置的模块ID。
     */
    requestModuleReset(id) {
      const currentConfig = this.#services.configManager.getConfig();
      if (!currentConfig || !this.#registeredModuleClasses.has(id)) {
        this.#services.logger.warn(
          `Module reset request for '${id}' failed: config or module class not found.`
        );
        return;
      }

      this.#services.logger.log(`Reset requested for module '${id}'.`);

      this.#disableModule(id);

      // 模块停用后，等待 300ms 确保状态完全停用
      setTimeout(() => this.#revalidateModuleState(id, currentConfig), 300);
    }

    /**
     * 注册一个模块类。
     * @param {typeof Module} ModuleClass
     */
    register(ModuleClass) {
      if (typeof ModuleClass !== "function") {
        this.#services.logger.warn(
          `Attempted to register an invalid value. Expected a class.`,
          ModuleClass
        );
        return;
      }

      const tempInstance = new ModuleClass();

      // 校验模块实例是否符合最基本的规范 (必须有 id 和 name)
      const isValidId =
        tempInstance.id &&
        typeof tempInstance.id === "string" &&
        tempInstance.id !== "base-module";
      const hasValidName =
        tempInstance.name && typeof tempInstance.name === "string";

      if (!isValidId || !hasValidName) {
        this.#services.logger.warn(
          `Attempted to register an invalid module. It must have a valid 'id' and 'name' property.`,
          tempInstance
        );
        return;
      }

      // 检查 ID 是否重复
      if (this.#registeredModuleClasses.has(tempInstance.id)) {
        this.#services.logger.warn(
          `Attempt to register module with duplicate ID: '${tempInstance.id}'. Skipping.`
        );
        return;
      }
      this.#registeredModuleClasses.set(tempInstance.id, ModuleClass);
      this.#services.logger.log(
        `Module class '${tempInstance.name} (${tempInstance.id})' registered.`
      );
    }

    /**
     * 根据最终配置，初始化所有应该被激活的模块。
     * @param {object} config - 最终的运行时配置。
     */
    initializeActiveModules(config) {
      this.#services.logger.log("Initializing active modules...");
      this.#onNavigate();
    }

    /**
     * 遍历所有已注册的模块类，收集它们的默认配置。
     * @returns {object} 一个包含所有模块默认配置的聚合对象。
     */
    getAllDefaultConfigs() {
      const modulesConfig = {};
      for (const ModuleClass of this.#registeredModuleClasses.values()) {
        const tempInstance = new ModuleClass();

        const processedDefaultConfig = {};
        for (const key in tempInstance.defaultConfig) {
          const item = tempInstance.defaultConfig[key];
          if (typeof item === "object" && item !== null && "value" in item) {
            processedDefaultConfig[key] = item.value;
          } else {
            processedDefaultConfig[key] = item;
          }
        }

        const initialEnabledState = processedDefaultConfig.enabled === true;

        delete processedDefaultConfig.enabled;

        modulesConfig[tempInstance.id] = {
          enabled: initialEnabledState,
          ...processedDefaultConfig,
        };
      }
      return { modules: modulesConfig };
    }

    /**
     * 返回所有已注册模块类的实例数组，用于UI生成。
     * @returns {Module[]}
     */
    getAllRegisteredModules() {
      const modules = [];
      for (const ModuleClass of this.#registeredModuleClasses.values()) {
        const moduleInstance = new ModuleClass();
        const clonedDefaultConfig = structuredClone(
          moduleInstance.defaultConfig
        );

        modules.push({
          id: moduleInstance.id,
          name: moduleInstance.name,
          description: moduleInstance.description,
          defaultConfig: clonedDefaultConfig,
        });
      }
      return modules;
    }

    /**
     * 当配置更新时被调用的核心响应函数
     * @param {object} detail - 包含 { path, value, newConfig } 的事件数据
     */
    #onConfigUpdated = (detail) => {
      const { path, value, newConfig } = detail;

      const enabledMatch = path.match(/^modules\.([^.]+)\.enabled$/);
      if (enabledMatch) {
        const moduleId = enabledMatch[1];
        this.#revalidateModuleState(moduleId, newConfig);
        return;
      }

      const optionMatch = path.match(/^modules\.([^.]+)\.(.+)$/);
      if (optionMatch) {
        const moduleId = optionMatch[1];
        const key = optionMatch[2];

        const moduleInstance = this.#activeModuleInstances.get(moduleId);
        if (moduleInstance) {
          const oldConfig = { ...moduleInstance._config };
          moduleInstance._config[key] = value;
          moduleInstance.onConfigChange(key, value, oldConfig[key]);
        }
      }
    };

    /**
     * 封装的启用模块的逻辑
     */
    #enableModule(id, ModuleClass, config, matchContext) {
      if (this.#activeModuleInstances.has(id)) return;

      try {
        // 创建模块专用的服务门面
        const moduleConfig = config.modules[id];
        const configManagerFacade = {
          // 只暴露与当前模块相关的配置API
          getConfig: () => moduleConfig,
          updateAndSave: async (key, value) => {
            // 自动为路径添加模块ID前缀，防止跨模块修改
            const path = `modules.${id}.${key}`;
            await this.#services.configManager.updateAndSave(path, value);

            // 触发全局事件，以保持UI同步等
            this.#services.eventBus.emit("config-updated", {
              path,
              value,
              newConfig: this.#services.configManager.getConfig(),
            });
          },
        };

        const moduleFacade = {
          requestReset: () => this.requestModuleReset(id),
        };

        const moduleServicesFacade = {
          ...this.#services, // 继承所有安全的服务
          configManager: configManagerFacade, // 覆盖为安全的门面
          moduleManager: null, // 彻底隐藏ModuleManager，模块不应该直接操作它
          module: moduleFacade,
        };

        // 使用安全的门面对象来实例化模块
        const moduleInstance = new ModuleClass(
          moduleServicesFacade,
          moduleConfig
        );

        this.#auditor?.auditStart(id);
        moduleInstance.onEnable(matchContext);
        this.#auditor?.auditEnd();

        this.#activeModuleInstances.set(id, moduleInstance);

        // 如果模块需要UI守护，则注册并触发首次渲染
        if (moduleInstance.uiGuard) {
          this.#uiGuardian.register(moduleInstance);
        }

        this.#services.logger.log(`Module '${id}' dynamically ENABLED.`);
      } catch (e) {
        this.#services.logger.error(
          `Failed to dynamically enable module '${id}'.`,
          e
        );
      }
    }

    /**
     * 封装的禁用模块的逻辑
     */
    #disableModule(id) {
      const moduleInstance = this.#activeModuleInstances.get(id);

      if (!moduleInstance) return;

      this.#activeModuleInstances.delete(id);

      try {
        if (moduleInstance.uiGuard) {
          this.#uiGuardian.unregister(moduleInstance);
        }

        this.#auditor?.auditStart(id);
        moduleInstance.onDisable();
        this.#auditor?.auditEnd();
        this.#auditor?.runChecks(id);

        this.#services.logger.log(`Module '${id}' dynamically DISABLED.`);
      } catch (e) {
        this.#services.logger.error(
          `Failed to complete full cleanup for module '${id}', but it has been successfully deactivated.`,
          e
        );
      }
    }

    /**
     * 在SPA导航时触发，重新评估所有模块的match状态。
     * @private
     */
    #onNavigate = () => {
      this.#services.logger.log(
        "Navigation detected, re-evaluating all module states..."
      );
      const currentConfig = this.#services.configManager.getConfig();
      if (!currentConfig) return;

      for (const id of this.#registeredModuleClasses.keys()) {
        this.#revalidateModuleState(id, currentConfig);
      }
    };

    /**
     * 重新评估一个模块的最终状态（启用/禁用），并执行相应操作。
     * 这是模块生命周期管理的唯一决策点。
     * @param {string} id - 模块ID
     * @param {object} config - 当前的全局配置
     * @private
     */
    #revalidateModuleState(id, config) {
      const ModuleClass = this.#registeredModuleClasses.get(id);
      if (!ModuleClass) return;

      const isEnabledInConfig = config.modules[id]?.enabled; // 用户配置
      const tempInstance = new ModuleClass();
      const matchResult = _CaliberInternals._checkMatch(
        tempInstance.match,
        this.#services.hostWindow
      );

      const shouldBeActive = isEnabledInConfig && !!matchResult;
      const isActiveNow = this.#activeModuleInstances.has(id);

      if (shouldBeActive && !isActiveNow) {
        this.#enableModule(id, ModuleClass, config, matchResult);
      } else if (!shouldBeActive && isActiveNow) {
        this.#disableModule(id);
      } else if (shouldBeActive && isActiveNow) {
        // 如果模块在导航后仍然处于活动状态，则调用 onNavigate
        const moduleInstance = this.#activeModuleInstances.get(id);
        if (moduleInstance && typeof moduleInstance.onNavigate === "function") {
          try {
            this.#auditor?.auditStart(id);
            moduleInstance.onNavigate(matchResult);
            this.#auditor?.auditEnd();
          } catch (e) {
            this.#services.logger.error(
              `Error during onNavigate for module '${id}'.`,
              e
            );
            this.#auditor?.auditEnd();
          }
        }
      }
    }
  }

  /**
   * @class UIManager - UI管理器
   *
   * 负责创建、管理和销毁UI组件，如下方的设置面板。
   */
  class UIManager {
    #appName = "CaliberApp";
    #services;
    #logger;
    #hostDocument;
    #hostWindow;
    #panelElement = null;
    #lastKnownConfig = null;
    #sanitizer;
    #uiGuardian;

    // --- UI Guardian Contract ---
    uiGuard = {
      target: "html",
      component: "settings-panel",
    };

    constructor(services, uiGuardian) {
      this.#services = services;
      this.#uiGuardian = uiGuardian;
      this.#logger = services.logger;
      this.#hostDocument = services.hostDocument;
      this.#hostWindow = services.hostWindow;
      this.#appName = services.APP_NAME || this.#appName;
      this.#sanitizer = services.framework.sanitizer;
      this.#defineSettingsPanelComponent(this.#sanitizer);
    }

    /**
     * 根据最终配置决定是否显示设置面板的触发按钮
     * @param {object} finalConfig - 从Kernel传入的最终运行时配置
     */
    init(finalConfig) {
      this.#lastKnownConfig = finalConfig;
      if (finalConfig.settingsPanel.enabled) {
        this.#uiGuardian.register(this);
      }
    }

    /**
     * [Guardian Lifecycle] 当UI需要被渲染或恢复时调用。
     */
    onRender(targetElement) {
      if (this.#hostDocument.querySelector(this.uiGuard.component)) return;

      // this.#logger.log('Guardian is rendering the settings panel trigger.');
      this.#panelElement = this.#hostDocument.createElement("settings-panel");
      const modules = this.#services.moduleManager.getAllRegisteredModules();
      this.#panelElement.setData(
        modules,
        this.#lastKnownConfig,
        this.#services.configManager,
        this.#services.eventBus,
        this.#hostWindow
      );

      targetElement.appendChild(this.#panelElement);
    }

    /**
     * [Guardian Lifecycle] 当UI需要被清理时调用。
     */
    onCleanup() {
      const panel = this.#hostDocument.querySelector(this.uiGuard.component);
      if (panel) {
        panel.remove();
      }
      this.#panelElement = null;
      // this.#logger.log('Settings panel trigger cleaned up by Guardian.');
    }

    /**
     * 定义 <settings-panel> Web Component
     */
    #defineSettingsPanelComponent(sanitizer) {
      if (customElements.get("settings-panel")) return;

      const APP_NAME = this.#appName;

      class SettingsPanel extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this._isOpen = false;
          this._modules = [];
          this._config = {};
          this._configManager = null;
          this._eventBus = null;
          this._boundOpenPanel = this.openPanel.bind(this);
          this._boundClosePanel = this.closePanel.bind(this);
          this._eventsBound = false;
        }

        // 外部数据注入接口
        setData(modules, config, configManager, eventBus, hostWindow) {
          this._modules = modules;
          this._config = config;
          this._configManager = configManager;
          this._eventBus = eventBus;
          this._hostWindow = hostWindow;
          this.render(); // 数据注入后重新渲染
        }

        connectedCallback() {
          if (!this.shadowRoot.firstChild) {
            this.render();
          }

          if (!this._eventsBound) {
            this.#addEventListeners();
            this._eventsBound = true;
          }

          this.#applyTheme();
        }

        /**
         * 当组件从DOM中移除时被调用，这是清理内存的关键。
         */
        disconnectedCallback() {
          this.#removeEventListeners();
          this._eventsBound = false;
        }

        /**
         * 集中添加所有事件监听器。
         * @private
         */
        #addEventListeners() {
          this.shadowRoot
            .querySelector(".trigger-btn")
            .addEventListener("click", this._boundOpenPanel);
          this.shadowRoot
            .querySelector(".overlay")
            .addEventListener("click", this._boundClosePanel);
          this.shadowRoot
            .querySelector(".drawer-content")
            .addEventListener("change", this.#handleInputChange);
        }

        /**
         * 集中移除所有事件监听器，防止内存泄漏。
         * @private
         */
        #removeEventListeners() {
          const triggerBtn = this.shadowRoot.querySelector(".trigger-btn");
          if (triggerBtn)
            triggerBtn.removeEventListener("click", this._boundOpenPanel);

          const overlay = this.shadowRoot.querySelector(".overlay");
          if (overlay)
            overlay.removeEventListener("click", this._boundClosePanel);

          const content = this.shadowRoot.querySelector(".drawer-content");
          if (content)
            content.removeEventListener("change", this.#handleInputChange);
        }

        /**
         * input change 事件的统一处理函数。
         * @private
         */
        #handleInputChange = (e) => {
          const target = e.target;
          if (!target.dataset.configPath) return;

          const path = target.dataset.configPath;
          let value;
          switch (target.type) {
            case "checkbox":
              value = target.checked;
              break;
            case "number":
              value = Number(target.value);
              break;
            case "text":
            case "select-one":
            case "color":
            default:
              value = target.value;
              break;
          }
          this.handleConfigChange(path, value);
        };

        openPanel = () => {
          if (this._isOpen) return;
          this.#applyTheme();
          this._isOpen = true;

          this.shadowRoot.querySelector(".drawer").classList.add("open");
          this.shadowRoot.querySelector(".overlay").classList.add("open");
          this.shadowRoot.querySelector(".trigger-btn").classList.add("hidden");
        };

        closePanel = () => {
          if (!this._isOpen) return;
          this._isOpen = false;

          this.shadowRoot.querySelector(".drawer").classList.remove("open");
          this.shadowRoot.querySelector(".overlay").classList.remove("open");
          this.shadowRoot
            .querySelector(".trigger-btn")
            .classList.remove("hidden");
        };

        handleConfigChange = async (path, value) => {
          await this._configManager.updateAndSave(path, value);

          // 通知所有模块配置已更新
          this._eventBus.emit("config-updated", {
            path,
            value,
            newConfig: this._configManager.getConfig(),
          });
        };

        /**
         * 检查系统颜色模式并为面板应用相应的主题。
         * @private
         */
        #applyTheme() {
          const drawer = this.shadowRoot.querySelector(".drawer");
          if (!drawer) return;

          const isSystemDark = this._hostWindow.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;

          if (isSystemDark) {
            drawer.dataset.theme = "dark";
          } else {
            drawer.dataset.theme = "light";
          }
        }

        render() {
          const styles = `
          :host {
              position: fixed;
              bottom: 25px;
              right: 25px;
              z-index: 9999;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          }

          /* --- 1. 触发按钮 --- */
          .trigger-btn {
              width: 42px;
              height: 42px;
              border-radius: 12px 0 0 12px;
              border: none;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.2s;
              opacity: 1;
              visibility: visible;
              background-color: rgba(255, 255, 255, 0.2);
              backdrop-filter: blur(6px);
              -webkit-backdrop-filter: blur(10px);
              box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
              position: fixed;
              right: 0;
              bottom: 50px;
          }

          .trigger-btn:hover {
              transform: scale(1.1);
              background-color: rgba(255, 255, 255, 0.3);
          }

          .trigger-btn .icon {
              font-size: 24px;
              color: #1d1d1f;
          }

          .trigger-btn.hidden {
              opacity: 0;
              visibility: hidden;
              transform: scale(0.8);
              pointer-events: none;
          }

          /* --- 2. 遮罩层 --- */
          .overlay {
              position: fixed;
              inset: 0;
              background-color: rgba(0, 0, 0, 0.45);
              opacity: 0;
              visibility: hidden;
              transition: opacity 0.3s ease, visibility 0.3s;
              cursor: pointer;
          }

          .overlay.open {
              opacity: 1;
              visibility: visible;
          }

          /* --- 3. 抽屉面板 --- */
          .drawer {
              position: fixed;
              top: 0;
              right: -100%;
              width: 360px;
              height: 100%;
              display: flex;
              flex-direction: column;
              transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s, box-shadow 0.3s;
              box-shadow: -4px 0 20px rgba(0,0,0,0.1);

              --bg-primary: #f3f4f5;
              --bg-secondary: #ffffff;
              --bg-tertiary: #f7f8f9;
              --bg-hover: #f7f8f9;
              --bg-input: #f7f8f9;
              --bg-input-focus: #ffffff;
              --bg-switch: #e5e7eb;
              --bg-switch-checked: #006ef4;

              --text-primary: #14191e;
              --text-secondary: #64696e;
              --text-tertiary: #8c9196;
              --text-placeholder: #b0b5b9;

              --border-primary: #e5e7eb;
              --border-secondary: #dadde0;
              --border-focus: #006ef4;
              --border-focus-shadow: rgba(0, 110, 244, 0.2);

              --shadow-primary: -4px 0 20px rgba(0,0,0,0.1);

              background-color: var(--bg-primary);

              --border-focus-shadow: rgba(0, 110, 244, 0.2);
              --select-arrow-svg: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2364696e' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
          }

          .drawer[data-theme="dark"] {
              --bg-primary: #1c1c1e;
              --bg-secondary: #2c2c2e;
              --bg-tertiary: #3a3a3c;
              --bg-hover: #3a3a3c;
              --bg-input: #3a3a3c;
              --bg-input-focus: #1c1c1e;
              --bg-switch: #3a3a3c;
              --bg-switch-checked: #0a84ff;

              --text-primary: #f5f5f7;
              --text-secondary: #aeaeb2;
              --text-tertiary: #8e8e93;
              --text-placeholder: #636366;

              --border-primary: #3a3a3c;
              --border-secondary: #545458;
              --border-focus: #0a84ff;
              --border-focus-shadow: rgba(10, 132, 255, 0.2);

              --shadow-primary: -4px 0 20px rgba(0,0,0,0.3);

              --border-focus-shadow: rgba(10, 132, 255, 0.2);
              --select-arrow-svg: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23aeaeb2' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
          }

          .drawer {
              box-shadow: var(--shadow-primary);
          }

          .drawer.open {
              right: 0;
          }

          .drawer-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 16px 20px;
              flex-shrink: 0;
              transition: background-color 0.3s, border-color 0.3s;
              background-color: var(--bg-secondary);
              border-bottom: 1px solid var(--border-secondary);
          }

          .drawer-header h2 {
              margin: 0;
              font-size: 16px;
              font-weight: 600;
              color: var(--text-primary);
              transition: color 0.3s;
          }

          .drawer-content {
              flex-grow: 1;
              overflow-y: auto;
              padding: 16px;
              overscroll-behavior: contain;
          }

          /* --- 4. 表单与布局 --- */
          .details-wrapper {
              border-radius: 8px;
              margin-bottom: 12px;
              overflow: hidden;
              transition: background-color 0.3s, border-color 0.3s;
              background-color: var(--bg-secondary);
              border: 1px solid var(--border-primary);
          }

          summary {
              list-style: none;
              display: block;
              cursor: pointer;
              padding: 16px 20px;
              transition: background-color 0.2s;
          }
          summary::-webkit-details-marker {
              display: none;
          }
          summary:hover {
              background-color: var(--bg-hover);
          }
          .details-wrapper[noconfig] > summary {
              cursor: default;
          }
          .details-wrapper[noconfig] > summary {
              cursor: default;
          }
          .details-wrapper[open][noconfig] > .sub-items-container,
          .sub-items-container:empty {
              display: none;
          }

          .details-wrapper[open]:not([noconfig]) > summary {
              border-bottom: 1px solid var(--border-primary);
          }

          .summary-content {
              display: flex;
              align-items: center;
              margin-bottom: 0;
          }

          .form-info {
              margin-left: 16px;
              padding-top: 0;
              flex: 1;
          }

          .form-info h4 {
              margin: 0 0 4px;
              font-size: 14px;
              font-weight: 500;
              display: flex;
              justify-content: space-between;
              align-items: center;
              transition: color 0.3s;
              color: var(--text-primary);
          }
          .form-info h4 span {
              font-size: 12px;
              margin-left: 8px;
              transition: color 0.3s;
              color: var(--text-tertiary);
          }

          .form-info p {
              margin: 0;
              font-size: 12px;
              transition: color 0.3s;
              color: var(--text-tertiary);
          }

          .sub-items-container {
              padding: 16px 20px;
          }

          .sub-item {
              --indent-unit: 12px;
              --indent-marker-color: var(--border-secondary);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              margin-bottom: 16px;
              padding-left: 0;
          }

          .sub-item[data-divider="top"],
          .sub-item[data-divider="both"] {
            border-top: 1px solid var(--border-secondary);
            margin-top: 16px;
            padding-top: 16px;
          }

          .sub-item[data-divider="bottom"],
          .sub-item[data-divider="both"] {
            border-bottom: 1px solid var(--border-secondary);
            margin-bottom: 16px;
            padding-bottom: 16px;
          }
          .sub-item[data-indent-level] {
            position: relative;
          }
          .sub-item[data-indent-level]::before {
            content: '└─';
            position: absolute;
            top: 10px;
            font-family: monospace;
            color: var(--indent-marker-color);
            font-size: 12px;
            line-height: 1;
          }

          .sub-item[data-indent-level="1"] {
            padding-left: calc(var(--indent-unit) * 1.5);
          }
          .sub-item[data-indent-level="1"]::before {
            left: 0;
          }

          .sub-item[data-indent-level="2"] {
            padding-left: calc(var(--indent-unit) * 2.5);
          }
          .sub-item[data-indent-level="2"]::before {
            left: calc(var(--indent-unit) * 0.5);
          }

          .sub-item[data-indent-level="3"] {
            padding-left: calc(var(--indent-unit) * 3.5);
          }
          .sub-item[data-indent-level="3"]::before {
            left: calc(var(--indent-unit) * 1.5);
          }

          .sub-item:last-child {
              margin-bottom: 0;
          }

          .sub-item-label {
              font-size: 14px;
              flex: 1;
              transition: color 0.3s;
              color: var(--text-secondary);
          }

          .sub-item-info {
              flex-grow: 1;
              display: flex;
              justify-content: space-between;
              align-items: center;
          }

          .sub-item-desc {
              font-size: 12px;
              margin-top: 6px;
              padding: 0;
              transition: color 0.3s;
              color: var(--text-tertiary);

              p {
                  margin: 0;
                  line-height: 1.2;
              }
          }

          /* --- 5. Switch 开关样式 --- */
          .switch {
              position: relative;
              display: inline-block;
              width: 40px;
              height: 22px;
              flex-shrink: 0;
          }
          .switch input { opacity: 0; width: 0; height: 0; }
          .slider {
              position: absolute;
              cursor: pointer;
              inset: 0;
              border-radius: 22px;
              transition: .3s;
              background-color: var(--bg-switch);
          }
          .slider:before {
              position: absolute;
              content: "";
              height: 18px;
              width: 18px;
              left: 2px;
              bottom: 2px;
              background-color: white;
              border-radius: 50%;
              box-shadow: 0 1px 2px rgba(0,0,0,0.1);
              transition: .3s;
          }
          input:checked + .slider {
              background-color: var(--bg-switch-checked);
          }
          input:checked + .slider:before {
              transform: translateX(18px);
          }

          /* --- 6. Text/Number 输入框样式 --- */
          .text-input {
              appearance: none;
              -webkit-appearance: none;
              min-height: 30px;
              width: 120px;
              padding: 6px 10px;
              border-radius: 6px;
              font-size: 14px;
              outline: none;
              text-align: right;
              box-sizing: border-box;
              transition: all 0.2s ease-in-out;
              border: 1px solid var(--border-secondary);
              background-color: var(--bg-input);
              color: var(--text-primary);
          }

          .text-input:hover {
              border-color: var(--border-primary);
              background-color: var(--bg-tertiary);
          }

          .text-input:focus {
              border-color: var(--border-focus);
              background-color: var(--bg-input-focus);
              box-shadow: 0 0 0 3px var(--border-focus-shadow);
          }

          select.text-input {
              text-align: left;
              text-align-last: left;
              padding-right: 30px; /* 为箭头留出空间 */
              background-image: var(--select-arrow-svg);
              background-repeat: no-repeat;
              background-position: right 0.7rem center;
              background-size: 0.9em 0.9em;
          }

          input[type="color"].text-input {
              width: 50px;
              min-height: 34px;
              padding: 4px;
              background-color: transparent;
          }

          input[type="color"].text-input::-webkit-color-swatch-wrapper {
              padding: 0;
          }

          input[type="color"].text-input::-webkit-color-swatch {
              border: none;
              border-radius: 4px;
          }

          input[type="color"].text-input::-moz-color-swatch {
              border: none;
              border-radius: 4px;
          }

          /* --- 7. 其他辅助样式 --- */
          .info-only { padding-bottom: 8px; margin-bottom: 0; }
          .info-text { font-size: 12px; text-align: center; width: 100%; margin: 0; transition: color 0.3s; color: var(--text-tertiary); }
          .no-sub-config-text { font-size: 12px; text-align: center; padding: 8px 0; color: var(--text-placeholder); }
          .main-divider { display: none; }
      `;

          const triggerButtonHTML = `<button class="trigger-btn">⚙️</button>`;

          const drawerHTML = `
            <div class="overlay"></div>
            <div class="drawer">
                <div class="drawer-header">
                    <h2>${APP_NAME} 设置</h2>
                </div>
                <div class="drawer-content">
                    ${this.generateFormHTML()}
                </div>
            </div>
        `;

          const fullHTML = `
            <style>${styles}</style>
            ${triggerButtonHTML}
            ${drawerHTML}
          `;
          sanitizer.setInnerHTML(this.shadowRoot, fullHTML);

          this.#syncUIWithConfig();
        }

        _generateInputPropsString(props) {
          if (!props || typeof props !== "object") {
            return "";
          }
          return Object.entries(props)
            .map(
              ([key, val]) => `${key}="${String(val).replace(/"/g, "&quot;")}"`
            )
            .join(" ");
        }

        generateFormHTML() {
          let html = "";

          html += `<div class="form-group info-only"><p class="info-text">所有设置修改后将自动保存，部分设置需刷新页面生效。</p></div>`;

          for (const module of this._modules) {
            const moduleConfig = this._config.modules[module.id];
            if (!moduleConfig) continue;

            const configKeys = Object.keys(module.defaultConfig);
            const nonEnabledConfigKeys = configKeys.filter(
              (key) => key !== "enabled"
            );
            const optionCount = nonEnabledConfigKeys.length;

            html += `<details class="details-wrapper" ${
              optionCount === 0 ? "noconfig" : ""
            }>
                     <summary>`;
            html += `<div class="form-group summary-content">
                     <label class="switch">
                       <input type="checkbox" data-config-path="modules.${
                         module.id
                       }.enabled" data-needs-reload="true">
                       <span class="slider"></span>
                     </label>
                     <div class="form-info">
                       <h4>${module.name}<span>${
              optionCount === 0 ? "" : " ⚙️"
            }</span></h4>
                       <p>${module.description}</p>
                     </div>
                   </div></summary>`;

            html += `<div class="sub-items-container">`;

            if (nonEnabledConfigKeys.length === 0) {
              html += ``;
            } else {
              for (const key of nonEnabledConfigKeys) {
                const configItem = module.defaultConfig[key];
                const value = moduleConfig[key];

                const path = `modules.${module.id}.${key}`;
                let inputHTML = "";
                let labelText, controlType, itemDescription, inputProps;

                if (
                  typeof configItem === "object" &&
                  configItem !== null &&
                  "value" in configItem
                ) {
                  labelText = configItem.label || key;
                  controlType = configItem.type || "string";
                  itemDescription = configItem.description || "";
                  inputProps = this._generateInputPropsString(
                    configItem.inputProps
                  );
                } else {
                  labelText = key;
                  controlType = typeof configItem;
                  itemDescription = "";
                  inputProps = "";
                }

                switch (controlType) {
                  case "boolean":
                    inputHTML = `<label class="switch"><input type="checkbox" data-config-path="${path}" ${
                      value ? "checked" : ""
                    }><span class="slider"></span></label>`;
                    break;
                  case "number":
                    inputHTML = `<input type="number" class="text-input" data-config-path="${path}" value="${
                      value || 0
                    }" ${inputProps}>`;
                    break;
                  case "string":
                    inputHTML = `<input type="text" class="text-input" data-config-path="${path}" value="${
                      value || ""
                    }" ${inputProps}>`;
                    break;
                  case "select":
                    inputHTML = `<select class="text-input" data-config-path="${path}" ${inputProps}>`;
                    if (
                      configItem.options &&
                      Array.isArray(configItem.options)
                    ) {
                      configItem.options.forEach((option) => {
                        const selected =
                          option.value === value ? "selected" : "";
                        inputHTML += `<option value="${
                          option.value
                        }" ${selected}>${
                          option.label || option.value
                        }</option>`;
                      });
                    }
                    inputHTML += `</select>`;
                    break;
                  case "color":
                    inputHTML = `<input type="color" class="text-input color-input" data-config-path="${path}" value="${value}" ${inputProps}>`;
                    break;
                  default:
                    html += `<div class="form-group sub-item"><span class="sub-item-label">${labelText}</span><p style="color:red;">(不支持的配置类型: ${controlType}，需确保包含label,value,type字段)</p></div>`;
                    continue; // 跳过不支持的类型
                }

                let dataAttrs = "";
                if (
                  typeof configItem.divider === "string" &&
                  configItem.divider
                ) {
                  dataAttrs += ` data-divider="${configItem.divider}"`;
                }
                if (
                  typeof configItem.indentLevel === "number" &&
                  configItem.indentLevel > 0
                ) {
                  dataAttrs += ` data-indent-level="${configItem.indentLevel}"`;
                }

                html += `
                <div class="form-group sub-item" ${dataAttrs.trim()}>
                  <div class="sub-item-info">
                    <label class="sub-item-label">${labelText}</label>
                    ${inputHTML}
                  </div>
                  ${
                    itemDescription
                      ? `<div class="sub-item-desc"><p>${itemDescription}</p></div>`
                      : ""
                  }
                </div>`;
              }
            }
            html += `</div></details><hr class="main-divider"/>`;
          }

          if (html.endsWith('<hr class="module-divider"/>')) {
            html = html.slice(0, -28);
          }
          return html;
        }

        /**
         * 遍历所有带 data-config-path 的输入框，并根据 this._config 设置其状态。
         * @private
         */
        #syncUIWithConfig() {
          this.shadowRoot
            .querySelectorAll("[data-config-path]")
            .forEach((input) => {
              const path = input.dataset.configPath;
              const keys = path.split(".");

              let value = this._config;
              for (const key of keys) {
                if (value === undefined || value === null) break;
                value = value[key];
              }

              if (value === undefined || value === null) return;

              switch (input.type) {
                case "checkbox":
                  input.checked = Boolean(value);
                  break;
                case "number":
                case "text":
                case "color":
                case "select-one":
                  input.value = value;
                  break;
              }
            });
        }
      }

      customElements.define("settings-panel", SettingsPanel);
    }
  }

  /**
   * @class DomWatcherService - (核心服务) 统一DOM观察者
   *
   * 负责全局的DOM变化监听，提供订阅机制。
   */
  class DomWatcherService {
    #observer = null;
    #subscribers = new Map();
    #isObserving = false;
    #logger;
    #hostDocument;

    /**
     * @param {LoggerInstance} logger - 用于日志输出的 logger 对象。
     * @param {Document} hostDocument - 宿主 document 对象。
     */
    constructor(logger, hostDocument) {
      this.#logger = logger.createTaggedLogger("Watcher", {
        backgroundColor: "#03A9F4",
      });
      this.#observer = new MutationObserver(this.#handleMutations);
      this.#hostDocument = hostDocument;
    }

    /**
     * MutationObserver 的唯一回调。
     * 极度轻量，只负责将原始的 mutations 数组分发给所有订阅者。
     * @param {MutationRecord[]} mutations - DOM变化记录数组。
     * @private
     */
    #handleMutations = (mutations) => {
      for (const callback of this.#subscribers.values()) {
        try {
          callback(mutations);
        } catch (e) {
          this.#logger.error("Error in a DomWatcher subscriber callback:", e);
        }
      }
    };

    /**
     * 订阅DOM变化。
     * @param {(mutations: MutationRecord[]) => void} callback - 当DOM发生变化时要执行的回调函数。
     * @returns {Symbol} 一个唯一的订阅ID，用于后续的取消订阅。
     */
    subscribe(callback) {
      const id = Symbol("watcher-subscription");
      this.#subscribers.set(id, callback);
      this.#logger.log(
        `New subscription added. Total: ${this.#subscribers.size}.`
      );

      // 如果这是第一个订阅者，则启动观察者。
      if (!this.#isObserving && this.#subscribers.size > 0) {
        this.#observer.observe(this.#hostDocument.documentElement, {
          childList: true,
          subtree: true,
          attributes: true,
          // 采用固定的、全量的监听配置。
          // 过滤职责完全交由上层订阅者处理。
        });
        this.#isObserving = true;
        this.#logger.log("Observer started due to first subscription.");
      }
      return id;
    }

    /**
     * 根据订阅ID取消订阅。
     * @param {Symbol} id - `subscribe` 方法返回的订阅ID。
     */
    unsubscribe(id) {
      if (this.#subscribers.delete(id)) {
        this.#logger.log(
          `Subscription removed. Total: ${this.#subscribers.size}.`
        );
        // 如果这是最后一个订阅者，则停止观察者以节省资源。
        if (this.#subscribers.size === 0 && this.#isObserving) {
          this.#observer.disconnect();
          this.#isObserving = false;
          this.#logger.log(
            "Observer stopped as no subscribers are left. Entering sleep mode."
          );
        }
      }
    }
  }

  /**
   * @class UIGuardianService - (核心服务) UI守护
   *
   * 负责监控和修复UI组件的状态，确保它们始终存在于预期的DOM位置。
   */
  class UIGuardianService {
    #services;
    #watcher;
    #logger;
    #registeredModules = new Set();
    #watcherSubscriptionId = null;
    #isActive = false;

    constructor(services, watcher) {
      this.#services = services;
      this.#watcher = watcher;
      this.#logger = services.logger.createTaggedLogger("Guardian", {
        backgroundColor: "#FF6F00",
      });
    }

    register(moduleInstance) {
      if (
        !moduleInstance.uiGuard ||
        typeof moduleInstance.onRender !== "function" ||
        typeof moduleInstance.onCleanup !== "function"
      ) {
        this.#logger.warn(
          "Attempted to register an invalid object for UI guarding.",
          moduleInstance
        );
        return;
      }

      this.#registeredModules.add(moduleInstance);
      this.#logger.log(
        `Module '${moduleInstance.id || "UIManager"}' registered. Total: ${
          this.#registeredModules.size
        }.`
      );

      this.#checkAndHeal(moduleInstance);

      this.#startService();
    }

    unregister(moduleInstance) {
      if (this.#registeredModules.delete(moduleInstance)) {
        this.#logger.log(
          `Module '${moduleInstance.id || "UIManager"}' unregistered. Total: ${
            this.#registeredModules.size
          }.`
        );
        try {
          moduleInstance.onCleanup();
        } catch (e) {
          this.#logger.error(
            `Error during onCleanup for '${moduleInstance.id || "UIManager"}':`,
            e
          );
        }
        if (this.#registeredModules.size === 0) {
          this.#stopService();
        }
      }
    }

    #startService() {
      if (this.#isActive) return;
      this.#isActive = true;
      this.#watcherSubscriptionId = this.#watcher.subscribe(this.#onDomChange);
      this.#logger.log("Guardian service started (Pure Watcher Mode).");
    }

    #stopService() {
      if (!this.#isActive) return;
      this.#isActive = false;
      if (this.#watcherSubscriptionId) {
        this.#watcher.unsubscribe(this.#watcherSubscriptionId);
        this.#watcherSubscriptionId = null;
      }
      this.#logger.log("Guardian service stopped and entered sleep mode.");
    }

    #onDomChange = () => {
      const rIC =
        this.#services.hostWindow.requestIdleCallback ||
        ((cb) => setTimeout(cb, 100));
      rIC(
        () => {
          if (!this.#isActive) return;

          let healingPerformed = false;
          for (const module of this.#registeredModules) {
            if (this.#checkAndHeal(module)) {
              healingPerformed = true;
            }
          }

          if (healingPerformed) {
            this.#logger.log(`Guardian performed UI health corrections.`);
          }
        },
        { timeout: 500 }
      );
    };

    #checkAndHeal(module) {
      try {
        const target = this.#services.hostDocument.querySelector(
          module.uiGuard.target
        );
        if (!target) return false;

        const componentExists = target.querySelector(module.uiGuard.component);
        if (!componentExists) {
          try {
            module.onCleanup();
          } catch (e) {
            /* pre-cleanup */
          }
          module.onRender(target);
          return true;
        }
      } catch (e) {
        this.#logger.error(
          `Error during checkAndHeal for '${module.id || "UIManager"}':`,
          e
        );
      }
      return false;
    }
  }

  /**
   * @class ModuleAuditor - (仅在Debug模式下激活) 模块审计员
   *
   * 负责监控模块的副作用（事件监听、定时器），并在模块禁用后报告任何未被清理的资源泄漏。
   */
  class ModuleAuditor {
    #logger;
    #hostWindow;
    #originalAddEventListener;
    #originalRemoveEventListener;
    #originalSetInterval;
    #originalClearInterval;
    #originalSchedulerRegister;
    #originalSchedulerUnregister;
    #activeModuleId = null;
    #trackedResources = new Map();

    constructor(logger, hostWindow, SAFE_APP_NAME) {
      this.#logger = logger.createTaggedLogger("Auditor", {
        backgroundColor: "#9C27B0",
      });
      this.#hostWindow = hostWindow;
      this.#patchGlobalApis(SAFE_APP_NAME);
      this.#logger.warn(
        "Module Auditor is active. Resource leakage will be reported."
      );
    }

    /**
     * 在 scheduler 实例创建后，由 Kernel 调用，用于代理其方法。
     * @param {DomBatchProcessorInstance} schedulerInstance
     */
    patchScheduler(schedulerInstance) {
      if (!schedulerInstance) return;

      this.#originalSchedulerRegister = schedulerInstance.register;
      this.#originalSchedulerUnregister = schedulerInstance.unregister;

      const self = this;

      schedulerInstance.register = function (selector, callback, options) {
        const taskId = self.#originalSchedulerRegister.call(
          this,
          selector,
          callback,
          options
        );
        if (self.#activeModuleId) {
          const resources = self.#initializeTracking(self.#activeModuleId);
          resources.schedulers.add(taskId);
        }
        return taskId;
      };

      schedulerInstance.unregister = function (taskId) {
        // 全局查找并删除，因为 unregister 可能在模块上下文之外被调用
        for (const resources of self.#trackedResources.values()) {
          if (resources.schedulers.has(taskId)) {
            resources.schedulers.delete(taskId);
            break;
          }
        }
        return self.#originalSchedulerUnregister.call(this, taskId);
      };

      this.#logger.log("Scheduler has been patched for auditing.");
    }

    /**
     * 在调用模块的 onEnable/onDisable 之前调用，设置审计上下文。
     * @param {string} moduleId - 正在被审计的模块ID。
     */
    auditStart(moduleId) {
      this.#activeModuleId = moduleId;
    }

    /**
     * 在调用模块的 onEnable/onDisable 之后调用，清除审计上下文。
     */
    auditEnd() {
      this.#activeModuleId = null;
    }

    /**
     * 在模块被禁用后，运行泄漏检查。
     * @param {string} moduleId - 已被禁用的模块ID。
     */
    runChecks(moduleId) {
      const resources = this.#trackedResources.get(moduleId);
      if (!resources) return;

      let leaksFound = 0;

      // 修正: 检查事件监听器泄漏
      if (resources.events.size > 0) {
        leaksFound += resources.events.size;
        resources.events.forEach((types, target) => {
          this.#logger.error(
            `LEAK DETECTED in module '${moduleId}': Event listener(s) for type(s) [${[
              ...types,
            ].join(", ")}] were NOT removed from element:`,
            target
          );
        });
      }

      // 检查定时器泄漏
      if (resources.intervals.size > 0) {
        leaksFound += resources.intervals.size;
        resources.intervals.forEach((id) => {
          this.#logger.error(
            `LEAK DETECTED in module '${moduleId}': A setInterval (ID: ${id}) was NOT cleared.`
          );
        });
      }

      // 检查调度器任务泄漏
      if (resources.schedulers.size > 0) {
        leaksFound += resources.schedulers.size;
        resources.schedulers.forEach((id) => {
          this.#logger.error(
            `LEAK DETECTED in module '${moduleId}': A scheduler task (ID: ${id.toString()}) was NOT unregistered.`
          );
        });
      }

      if (leaksFound === 0) {
        this.#logger.log(
          `Module '${moduleId}' passed audit. All tracked resources were cleaned up.`
        );
      }

      this.#trackedResources.delete(moduleId);
    }

    #initializeTracking(moduleId) {
      if (!this.#trackedResources.has(moduleId)) {
        this.#trackedResources.set(moduleId, {
          events: new Map(),
          intervals: new Set(),
          schedulers: new Set(),
        });
      }
      return this.#trackedResources.get(moduleId);
    }

    #patchGlobalApis(SAFE_APP_NAME) {
      this.#originalAddEventListener = EventTarget.prototype.addEventListener;
      this.#originalRemoveEventListener =
        EventTarget.prototype.removeEventListener;
      this.#originalSetInterval = this.#hostWindow.setInterval;
      this.#originalClearInterval = this.#hostWindow.clearInterval;

      const self = this;
      const namespace = `__CALIBER_${SAFE_APP_NAME}`;
      const responseEventName = `${namespace}_RESPONSE`;

      // --- Patch addEventListener ---
      EventTarget.prototype.addEventListener = function (
        type,
        listener,
        options
      ) {
        if (this === self.#hostWindow.document && type === responseEventName) {
          // 直接调用原始方法，不进行任何追踪
          return self.#originalAddEventListener.call(
            this,
            type,
            listener,
            options
          );
        }

        if (self.#activeModuleId) {
          const resources = self.#initializeTracking(self.#activeModuleId);
          if (!resources.events.has(this)) {
            resources.events.set(this, new Set());
          }
          resources.events.get(this).add(type);
        }
        return self.#originalAddEventListener.call(
          this,
          type,
          listener,
          options
        );
      };

      // --- Patch removeEventListener ---
      EventTarget.prototype.removeEventListener = function (
        type,
        listener,
        options
      ) {
        for (const resources of self.#trackedResources.values()) {
          if (resources.events.has(this)) {
            const types = resources.events.get(this);
            types.delete(type);
            if (types.size === 0) {
              resources.events.delete(this);
            }
            break;
          }
        }
        return self.#originalRemoveEventListener.call(
          this,
          type,
          listener,
          options
        );
      };

      // --- Patch setInterval ---
      this.#hostWindow.setInterval = function (handler, timeout) {
        const intervalId = self.#originalSetInterval.call(
          this,
          handler,
          timeout
        );
        if (self.#activeModuleId) {
          const resources = self.#initializeTracking(self.#activeModuleId);
          resources.intervals.add(intervalId);
        }
        return intervalId;
      };

      // --- Patch clearInterval ---
      this.#hostWindow.clearInterval = function (id) {
        // 全局查找并删除，因为 clearInterval 可能在模块上下文之外被调用
        for (const resources of self.#trackedResources.values()) {
          if (resources.intervals.has(id)) {
            resources.intervals.delete(id);
            break;
          }
        }
        return self.#originalClearInterval.call(this, id);
      };
    }
  }

  /**
   * @class DomBatchProcessor - 高性能DOM批量处理调度器
   */
  class DomBatchProcessor {
    #taskQueue = [];
    #registeredTasks = new Map();
    #isLoopRunning = false;
    #batchSize;
    #logger;
    #hostDocument;
    #watcher;
    #watcherSubscriptionId = null;

    /**
     * @param {number} batchSize - 在每个渲染帧中处理的最大任务数。
     * @param {LoggerInstance} logger - 用于日志输出的 logger 对象。
     * @param {Document} hostDocument - 宿主 document 对象。
     * @param {DomWatcherService} watcher - 统一的DOM观察者服务实例。
     */
    constructor(batchSize, logger, hostDocument, watcher) {
      this.#batchSize = batchSize || 20;
      this.#logger = logger;
      this.#hostDocument = hostDocument;
      this.#watcher = watcher;
    }

    /**
     * 注册一个DOM处理任务。
     * @param {string} selector - 用于匹配节点的CSS选择器。
     * @param {(node: HTMLElement) => void} callback - 匹配到节点时要执行的回调函数。
     * @param {object} [options] - (可选) 监听选项。
     * @param {boolean} [options.add=true] - 是否监听节点的添加。
     * @param {boolean} [options.attributes=false] - 是否监听节点属性的变化。
     * @param {string[]} [options.attributeFilter] - (可选) 只监听特定属性的变化。
     * @param {HTMLElement | string} [options.root] - (可选) 任务的根节点或根选择器。
     * @param {boolean} [options.processExisting=false] - (可选) 是否在注册时立即处理DOM中已存在的匹配节点。
     * @returns {Symbol} 一个唯一的任务ID，用于后续注销。
     */
    register(selector, callback, options = {}) {
      const taskId = Symbol(selector);
      this.#registeredTasks.set(taskId, {
        selector,
        callback,
        options: { add: true, ...options }, // 默认监听添加事件
      });
      this.#logger.log(
        `Task registered for selector "${selector}"`,
        options.root ? `within root "${options.root}"` : ""
      );

      if (options.processExisting) {
        const rootNode =
          (typeof options.root === "string"
            ? this.#hostDocument.querySelector(options.root)
            : options.root) || this.#hostDocument;

        // querySelectorAll 在找不到 rootNode 时会抛错，需要保护
        if (rootNode) {
          const existingNodes = rootNode.querySelectorAll(selector);
          if (existingNodes.length > 0) {
            this.#logger.log(
              `Explicitly processing ${existingNodes.length} existing node(s) for selector "${selector}".`
            );
            existingNodes.forEach((node) => {
              this.#taskQueue.push({ node, callback: callback });
            });
            this.#startLoop();
          }
        }
      }

      this.#updateSubscription();

      return taskId;
    }

    /**
     * 注销一个DOM处理任务。
     * @param {Symbol} taskId - 注册时返回的任务ID。
     */
    unregister(taskId) {
      if (this.#registeredTasks.has(taskId)) {
        const selector = this.#registeredTasks.get(taskId).selector;
        this.#registeredTasks.delete(taskId);
        this.#logger.log(`Task for selector "${selector}" unregistered.`);

        this.#updateSubscription();
      }
    }

    /**
     * 根据当前是否有任务，决定是订阅还是退订统一的DOM观察者。
     * @private
     */
    #updateSubscription() {
      const hasTasks = this.#registeredTasks.size > 0;

      if (hasTasks && !this.#watcherSubscriptionId) {
        // 有任务但尚未订阅 -> 订阅
        this.#watcherSubscriptionId = this.#watcher.subscribe(
          this.#handleMutations
        );
        this.#logger.log("Subscribed to DomWatcherService.");
      } else if (!hasTasks && this.#watcherSubscriptionId) {
        // 无任务但仍在订阅 -> 退订
        this.#watcher.unsubscribe(this.#watcherSubscriptionId);
        this.#watcherSubscriptionId = null;
        this.#logger.log("Unsubscribed from DomWatcherService.");
      }
    }

    /**
     * 从 DomWatcherService 接收原始情报的回调，负责过滤和排队任务。
     * @param {MutationRecord[]} mutations
     * @private
     */
    #handleMutations = (mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === Node.ELEMENT_NODE) {
              this.#queueMatchingTasks(addedNode, "add");
              // 同时检查新增节点下的所有子元素是否也匹配
              const descendants = addedNode.querySelectorAll("*");
              for (const descendant of descendants) {
                this.#queueMatchingTasks(descendant, "add");
              }
            }
          }
        } else if (mutation.type === "attributes") {
          if (mutation.target.nodeType === Node.ELEMENT_NODE) {
            this.#queueMatchingTasks(
              mutation.target,
              "attributes",
              mutation.attributeName
            );
          }
        }
      }

      // 只要有新任务入队，就确保 rAF 循环在运行
      if (this.#taskQueue.length > 0) {
        this.#startLoop();
      }
    };

    /**
     * 辅助函数：根据每个任务各自的 options 过滤情报，并将匹配的任务排队。
     * @private
     */
    #queueMatchingTasks(node, mutationType, attributeName = null) {
      for (const task of this.#registeredTasks.values()) {
        // --- 根节点靶向检查 ---
        if (task.options.root) {
          const rootNode =
            typeof task.options.root === "string"
              ? this.#hostDocument.querySelector(task.options.root)
              : task.options.root;

          if (!rootNode || !rootNode.contains(node)) {
            continue;
          }
        }

        // --- 核心过滤逻辑 ---

        // 1. 检查任务是否关心此类变更
        if (mutationType === "add" && !task.options.add) continue;
        if (mutationType === "attributes" && !task.options.attributes) continue;

        // 2. 对于属性变更，额外检查 attributeFilter
        if (
          mutationType === "attributes" &&
          Array.isArray(task.options.attributeFilter)
        ) {
          if (!task.options.attributeFilter.includes(attributeName)) {
            continue; // 属性名不匹配，跳过此任务
          }
        }

        // 3. 检查节点是否匹配最终的 CSS 选择器
        if (node.matches(task.selector)) {
          this.#taskQueue.push({ node, callback: task.callback });
        }
      }
    }

    /**
     * 启动 rAF 循环。
     * @private
     */
    #startLoop() {
      if (this.#isLoopRunning) return;
      this.#isLoopRunning = true;
      requestAnimationFrame(this.#processQueue);
    }

    /**
     * rAF 循环的核心，负责分批处理任务。
     * @private
     */
    #processQueue = () => {
      const batch = this.#taskQueue.splice(0, this.#batchSize);
      for (const task of batch) {
        try {
          if (this.#hostDocument.documentElement.contains(task.node)) {
            task.callback(task.node);
          }
        } catch (e) {
          this.#logger.error("Error in DomBatchProcessor task callback:", e);
        }
      }

      if (this.#taskQueue.length > 0) {
        requestAnimationFrame(this.#processQueue);
      } else {
        this.#isLoopRunning = false;
      }
    };
  }

  /**
   * @class LoggerService - 专用的、可派生的日志服务
   */
  class LoggerService {
    #isDebug;
    #baseTagStyle = `color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;`;

    constructor(isDebug) {
      this.#isDebug = Boolean(isDebug);
    }

    /**
     * (私有辅助函数) 创建一组核心的日志方法。
     * @private
     */
    #createLogMethodsFor(tag, styles) {
      return {
        log: (message, ...args) =>
          this.#isDebug &&
          console.log(`%c${tag}`, styles.log, message, ...args),
        warn: (message, ...args) =>
          this.#isDebug &&
          console.warn(`%c${tag}`, styles.warn, message, ...args),
        error: (message, ...args) =>
          console.error(`%c${tag}`, styles.error, message, ...args),
      };
    }

    /**
     * 创建一个主 logger 实例。
     */
    createMainLogger(appName) {
      const styles = {
        log: `background-color: #0057b8; ${this.#baseTagStyle}`,
        warn: `background-color: #ff9800; color: black; ${this.#baseTagStyle}`,
        error: `background-color: #f44336; ${this.#baseTagStyle}`,
      };
      const mainLogger = this.#createLogMethodsFor(appName, styles);

      mainLogger.createTaggedLogger = (tag, styleOptions = {}) => {
        const taggedStyles = {
          log: `background-color: ${
            styleOptions.backgroundColor || "#757575"
          }; color: ${styleOptions.color || "white"}; ${this.#baseTagStyle}`,
          warn: `background-color: ${
            styleOptions.backgroundColor || "#757575"
          }; color: ${styleOptions.color || "white"}; ${this.#baseTagStyle}`,
          error: `background-color: #f44336; color: white; ${
            this.#baseTagStyle
          }`, // 错误总是红色
        };
        return this.#createLogMethodsFor(tag, taggedStyles);
      };

      return mainLogger;
    }
  }

  /**
   * 框架内部工具
   */
  const _CaliberInternals = {
    /**
     * @private
     * [上下文创建器] 从应用名称派生出所有需要的上下文状态。
     * @param {string} appName - 原始的应用名称。
     * @returns {{safeAppName: string, instanceKey: string}} 包含派生状态的上下文对象。
     */
    _createAppContext: (appName) => {
      const utf8Bytes = new TextEncoder().encode(appName);
      let binaryString = "";
      utf8Bytes.forEach((byte) => {
        binaryString += String.fromCharCode(byte);
      });
      let safeAppName = btoa(binaryString);
      safeAppName = safeAppName
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
      const instanceKey = `CALIBER_INSTANCE_${safeAppName}`;
      return { safeAppName, instanceKey };
    },

    /**
     * @private
     * [预检器] 对应用配置和运行环境执行所有预检。
     * @param {object} options - createApp 接收的原始选项。
     * @param {string} instanceKey - 由 _createAppContext 生成的实例键。
     * @param {object} logger - 用于报告错误的主 logger。
     * @param {Window} hostWindow - 宿主页面的 window 对象。
     * @returns {boolean} - 所有检查通过返回 true，否则返回 false。
     */
    runPreflightChecks: (options, instanceKey, logger, hostWindow) => {
      const { appName, modules, services } = options || {};

      if (
        !options ||
        typeof options !== "object" ||
        !appName ||
        typeof appName !== "string" ||
        !Array.isArray(modules) ||
        !services ||
        !services.storage ||
        !services.command
      ) {
        logger.error("Preflight check failed: Invalid configuration object.");
        return false;
      }

      if (modules.length === 0) {
        if (options.isDebug)
          logger.log(`Preflight check skipped: No modules provided.`);
        return false;
      }

      if (hostWindow[instanceKey]) {
        logger.warn("Preflight check failed: Script instance already running.");
        return false;
      }

      return true;
    },

    /**
     * 初始化所有框架核心服务。
     * @param {object} options - createApp 接收的原始选项。
     * @param {{safeAppName: string}} context - 部分上下文，包含 safeAppName。
     * @param {LoggerInstance} logger - 主 logger。
     * @param {Window} hostWindow - 宿主页面的 window 对象。
     * @param {Document} hostDocument - 宿主页面的 document 对象。
     * @param {DOMSanitizerInstance} sanitizer - DOM净化服务实例。
     * @returns {{eventBus: EventBusInstance, framework: FrameworkServices}} - 包含事件总线和框架服务集合的对象。
     */
    initializeCoreServices: (
      options,
      context,
      logger,
      hostWindow,
      hostDocument,
      sanitizer
    ) => {
      const eventBus = _CaliberInternals.createEventBus(logger);
      const schedulerLogger = logger.createTaggedLogger("Scheduler", {
        backgroundColor: "#4CAF50",
      });
      const domWatcher = new DomWatcherService(logger, hostDocument);

      const frameworkServices = {
        scheduler: new DomBatchProcessor(
          options.framework?.domProcessorBatchSize,
          schedulerLogger,
          hostDocument,
          domWatcher
        ),
        interceptor: _CaliberInternals.createFetchInterceptor(
          logger,
          hostWindow,
          hostDocument,
          context.safeAppName,
          options.isDebug,
          sanitizer
        ),
        sanitizer: sanitizer,
        executor: _CaliberInternals.createPageScopeExecutor(
          logger,
          context.safeAppName,
          sanitizer,
          hostDocument
        ),
        utils: {
          checkMatch: (rule, win = hostWindow) =>
            _CaliberInternals._checkMatch(rule, win),
        },
        _internal_domWatcher: domWatcher,
      };

      _CaliberInternals.patchHistoryForNavigation(eventBus, hostWindow);
      return { eventBus, framework: frameworkServices };
    },

    /**
     * @private
     * 核心匹配引擎 - 检查给定的匹配规则是否与当前页面URL匹配。
     * @param {string|RegExp|Array<string|RegExp>|null|undefined} matchRule - 匹配规则。
     * @param {Window} hostWindow - 宿主 window 对象。
     * @returns {object|false} - 不匹配返回false，匹配返回 { params, query }。
     */
    _checkMatch: (matchRule, hostWindow) => {
      const currentUrl = new URL(hostWindow.location.href);

      // 处理查询参数
      const query = {};
      const searchParams = currentUrl.searchParams;
      for (const [key, value] of searchParams.entries()) {
        const existing = query[key];
        if (existing !== undefined) {
          query[key] = Array.isArray(existing)
            ? [...existing, value]
            : [existing, value];
        } else {
          query[key] = value;
        }
      }

      // 路径规范化
      const rawPathname = currentUrl.pathname;
      const pathname =
        rawPathname.endsWith("/") && rawPathname.length > 1
          ? rawPathname.slice(0, -1)
          : rawPathname;

      const href = currentUrl.href;

      // 空规则快速返回
      if (matchRule == null) {
        return { params: {}, query };
      }

      // 规则数组处理
      const rules = Array.isArray(matchRule) ? matchRule : [matchRule];

      // 核心匹配逻辑
      for (const rule of rules) {
        const result = checkRule(rule);
        if (result) return result;
      }

      return false;

      // 辅助函数保持内部作用域
      function checkRule(rule) {
        if (rule == null) return { params: {}, query };
        if (!rule) return false;

        // 正则表达式规则
        if (rule instanceof RegExp) {
          const match = rule.exec(pathname) || rule.exec(href);
          return match ? { params: match.groups || {}, query } : false;
        }

        // 字符串规则
        if (typeof rule === "string") {
          let isAbsolute = false;
          let rulePath = rule;
          let ruleProtocol = "";
          let ruleHost = "";

          try {
            const urlObj = new URL(rule);
            isAbsolute = true;
            ruleProtocol = urlObj.protocol;
            ruleHost = urlObj.host;
            rulePath = urlObj.pathname;
          } catch {}

          if (isAbsolute) {
            if (
              ruleProtocol !== currentUrl.protocol ||
              ruleHost !== currentUrl.host
            ) {
              return false;
            }
          }

          // 路径规范化
          const normalizedRule =
            rulePath.endsWith("/") && rulePath.length > 1
              ? rulePath.slice(0, -1)
              : rulePath;

          // 快速前缀匹配（无参数路径）
          if (
            pathname === normalizedRule ||
            pathname.startsWith(normalizedRule + "/")
          ) {
            return { params: {}, query };
          }

          // 参数化路径匹配
          return matchParamPath(normalizedRule);
        }

        return false;
      }

      // 参数化路径匹配
      function matchParamPath(pattern) {
        // 检查是否需要参数匹配
        const hasParams = pattern.includes(":") || pattern.includes("*");
        if (!hasParams) return false;

        // 构建正则表达式
        const parts = pattern.split("/").slice(1);
        let regexStr = "^";
        const paramNames = [];
        let hasWildcard = false;

        for (const part of parts) {
          if (hasWildcard) return false; // 通配符后不能有其他部分

          if (part.startsWith(":")) {
            const isOptional = part.endsWith("?");
            const name = isOptional ? part.slice(1, -1) : part.slice(1);
            paramNames.push(name);
            regexStr += isOptional ? "(?:/([^/]+))?" : "/([^/]+)";
          } else if (part === "*") {
            paramNames.push("_");
            regexStr += "(?:/(.*))?";
            hasWildcard = true;
          } else {
            regexStr += "/" + part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
        }
        regexStr += "$";

        const regex = new RegExp(regexStr);
        const match = regex.exec(pathname);

        if (match) {
          const params = {};
          for (let i = 0; i < paramNames.length; i++) {
            params[paramNames[i]] = match[i + 1] ?? undefined;
          }
          return { params, query };
        }

        return false;
      }
    },

    /**
     * 创建一个事件总线实例。 (工厂职责)
     * @param {object} logger - 用于错误报告的logger实例。
     */
    createEventBus: (logger) => {
      const listeners = new Map();
      const log = logger || console;

      return {
        on: (eventName, callback) => {
          if (!listeners.has(eventName)) {
            listeners.set(eventName, []);
          }
          listeners.get(eventName).push(callback);
        },
        off: (eventName, callback) => {
          if (listeners.has(eventName)) {
            const eventListeners = listeners.get(eventName);
            const index = eventListeners.indexOf(callback);
            if (index > -1) {
              eventListeners.splice(index, 1);
            }
          }
        },
        emit: (eventName, data) => {
          if (listeners.has(eventName)) {
            [...listeners.get(eventName)].forEach((callback) => {
              try {
                callback(data);
              } catch (e) {
                log.error(
                  `[EventBus] Error in callback for event "${eventName}":`,
                  e
                );
              }
            });
          }
        },
      };
    },

    /**
     * 代理 history API 以感知SPA导航。 (配置器职责)
     * @param {object} bus - 事件总线实例。
     */
    patchHistoryForNavigation: (bus, hostWindow) => {
      const history = hostWindow.history;
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = function (...args) {
        originalPushState.apply(this, args);
        bus.emit("navigate");
      };

      history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        bus.emit("navigate");
      };

      hostWindow.addEventListener("popstate", () => bus.emit("navigate"));
    },

    /**
     * @private
     * [服务工厂] 创建一个通用的DOM净化与安全注入服务。
     * 这是框架中所有CSP/Trusted-Types对抗策略的唯一来源。
     * @param {object} logger - 用于报告错误的 logger 实例。
     * @returns {object} DOMSanitizer 服务实例。
     */
    createDOMSanitizer: (logger) => {
      let _policy = undefined; // 使用闭包缓存 Trusted Types 策略

      const _getPolicy = () => {
        if (_policy === undefined) {
          _policy = null;
          if (window.trustedTypes && window.trustedTypes.createPolicy) {
            try {
              _policy = window.trustedTypes.createPolicy(
                "CaliberUniversalPolicy#html",
                {
                  createHTML: (s) => s,
                  createScript: (s) => s,
                }
              );
            } catch (e) {
              if (window.trustedTypes.defaultPolicy)
                _policy = window.trustedTypes.defaultPolicy;
            }
          }
        }
        return _policy;
      };

      const service = {
        /**
         * [核心] 创建一个TrustedHTML对象（如果策略可用）。
         * @param {string} htmlString - 要处理的HTML字符串。
         * @returns {TrustedHTML|string} 返回TrustedHTML对象或原始字符串。
         */
        createTrustedHTML(htmlString) {
          const policy = _getPolicy();
          return policy ? policy.createHTML(htmlString) : htmlString;
        },

        /**
         * [便捷方法] 安全地设置一个元素的 innerHTML。
         * @param {Element} element - 目标元素。
         * @param {string} htmlString - 要设置的HTML字符串。
         */
        setInnerHTML(element, htmlString) {
          try {
            element.innerHTML = this.createTrustedHTML(htmlString);
          } catch (e) {
            logger.error(
              "setInnerHTML failed due to CSP.",
              `Error: ${e.message}`
            );
          }
        },

        /**
         * [便捷方法] 安全地注入脚本。
         * @param {Document} doc - 目标文档。
         * @param {string} codeString - 脚本字符串。
         */
        injectScript(doc, codeString) {
          try {
            const script = doc.createElement("script");
            const policy = _getPolicy();
            if (policy) script.textContent = policy.createScript(codeString);
            else script.textContent = codeString;
            (doc.head || doc.documentElement).prepend(script);
            script.remove();
          } catch (e) {
            logger.error(
              "Script injection failed due to CSP.",
              `Error: ${e.message}`
            );
          }
        },

        /**
         * [便捷方法] 安全地注入样式。
         * @param {Document} doc - 目标文档。
         * @param {string} cssString - 样式字符串。
         * @param {string} id - 样式元素的ID。
         * @returns {HTMLStyleElement|null} 创建的元素或null。
         */
        injectStyle(doc, cssString, id) {
          try {
            const style = doc.createElement("style");
            style.dataset.caliberId = id;
            style.innerHTML = this.createTrustedHTML(cssString);
            doc.head.appendChild(style);
            return style;
          } catch (e) {
            logger.error(
              "Style injection failed due to CSP.",
              `Error: ${e.message}`
            );
            return null;
          }
        },
      };

      return service;
    },

    /**
     * 网络请求拦截器服务。
     * 创建一个通用的拦截器服务，它通过安全的脚本注入来代理原生fetch，并使用CustomEvent将响应数据传回沙箱。
     *
     * @param {object} logger - 框架的主 logger 实例。
     * @param {Window} hostWindow - 宿主页面的 window 对象。
     * @param {Document} hostDocument - 宿主页面的 Document 对象。
     * @param {string} safeAppName - 当前应用名称，用于生成唯一的命名空间。
     * @param {boolean} isDebug - 是否为调试模式，用于控制注入脚本的日志输出。
     * @param {DOMSanitizerInstance} sanitizer - DOM净化与安全注入服务实例。
     * @returns {FetchInterceptorInstance} 服务对象。
     */
    createFetchInterceptor: (
      logger,
      hostWindow,
      hostDocument,
      safeAppName,
      isDebug,
      sanitizer
    ) => {
      const namespace = `__CALIBER_${safeAppName}`;
      const patchFlag = `${namespace}_PATCHED`;
      const hooksRegistry = `${namespace}_HOOKS`;
      const responseEventName = `${namespace}_RESPONSE`;

      const responseCallbacks = new Map();
      let listenerRefCount = 0;

      // 事件处理函数
      const _handleInjectedEvent = (event) => {
        const { path, responseData } = event.detail;
        const pathKey = JSON.stringify(path);
        if (responseCallbacks.has(pathKey)) {
          try {
            responseCallbacks.get(pathKey)(responseData);
          } catch (e) {
            logger.error(
              `[FetchInterceptor] Error in response callback for path [${path.join(
                "/"
              )}]`,
              e
            );
          }
        }
      };

      // 统一处理路径验证和转换
      const _validateAndTransformPath = (path, methodName) => {
        if (typeof path === "string" && path) return [path];
        if (Array.isArray(path) && path.length > 0) return path;
        logger.error(
          `[FetchInterceptor] ${methodName} failed: path must be a non-empty array or a non-empty string.`
        );
        return null;
      };

      const service = {
        /**
         * 根据配置对象构建一个 fetch 钩子函数的字符串。
         * 这是一个便捷的“填空题”工具，用于简化 addHook 的使用。
         * @param {object} options - 钩子配置。
         * @param {string} options.targetUrl - 必须完全匹配的目标URL (origin + pathname)。
         * @param {string} [options.method='GET'] - (可选) 匹配的HTTP方法 (大小写不敏感)。
         * @param {string} options.handler - 在匹配成功后，要执行的核心逻辑的函数体字符串。
         *                                   在此字符串中，你可以使用 `urlObject` 和 `config` 这两个变量。
         *                                   它必须返回一个 `{ url: string, config: object }` 或 `undefined`。
         * @returns {string} - 一个完整的、自包含的、可注入的钩子函数字符串。
         */
        createHook({ targetUrl, method = "GET", handler }) {
          if (!targetUrl || !handler) {
            logger.error(
              `[FetchInterceptor.createHook] failed: 'targetUrl' and 'handler' are required.`
            );
            return `() => {}`;
          }
          const template = `
            (url, config) => {
                const TARGET_URL = '${targetUrl}';
                const TARGET_METHOD = '${method.toUpperCase()}';
                try {
                    if (config.method && config.method.toUpperCase() !== TARGET_METHOD) return;
                    const urlObject = new URL(url);
                    if (urlObject.origin + urlObject.pathname !== TARGET_URL) return;

                    const result = (() => { ${handler} })();
                    return result;
                } catch (e) { /* ignore errors */ }
            }`;
          return template;
        },

        /**
         * 添加一个网络请求钩子，并注册一个用于处理响应的回调。
         * @param {string[]|string} path - 钩子的唯一路径。
         * @param {string} hookFunctionString - 修改请求的钩子函数字符串。
         * @param {(responseData: any) => void} responseCallback - 接收响应数据的回调函数。
         */
        addHookWithResponse(path, hookFunctionString, responseCallback) {
          const finalPath = _validateAndTransformPath(
            path,
            "addHookWithResponse"
          );
          if (!finalPath) return;
          if (typeof responseCallback !== "function") {
            logger.error(
              "[FetchInterceptor] addHookWithResponse failed: responseCallback must be a function."
            );
            return;
          }

          const pathKey = JSON.stringify(finalPath);
          // 如果是新注册的回调，增加引用计数
          if (!responseCallbacks.has(pathKey)) {
            if (listenerRefCount === 0) {
              hostDocument.addEventListener(
                responseEventName,
                _handleInjectedEvent
              );
              if (isDebug)
                logger.log(
                  `[FetchInterceptor] Global response listener attached for event: ${responseEventName}`
                );
            }
            listenerRefCount++;
          }

          responseCallbacks.set(pathKey, responseCallback);
          this.addHook(finalPath, hookFunctionString, true);
        },

        /**
         * 添加或更新一个网络请求钩子。
         * @param {string[]|string} path - 钩子路径。
         * @param {string} hookFunctionString - 钩子函数字符串。
         * @param {boolean} [awaitsResponse=false] - (内部) 标记此钩子是否需要返回响应。
         */
        addHook(path, hookFunctionString, awaitsResponse = false) {
          const finalPath = _validateAndTransformPath(path, "addHook");
          if (!finalPath || !hookFunctionString) {
            if (!hookFunctionString)
              logger.error(
                "[FetchInterceptor] addHook failed: hookFunctionString is required."
              );
            return;
          }

          const pathJson = JSON.stringify(finalPath);
          const injectionCode = `
            (() => {
              const doLog = ${isDebug};
              if (!window['${patchFlag}']) {
                window['${patchFlag}'] = true;
                window['${hooksRegistry}'] = {};
                const originalFetch = window.fetch;
                const RESPONSE_EVENT_NAME = '${responseEventName}';

                const executeHooks = (node, url, config, currentPath = []) => {
                  let matchedPath = null;
                  if (typeof node === 'object' && node !== null) {
                    for (const key in node) {
                      if (Object.prototype.hasOwnProperty.call(node, key)) {
                        const newPath = [...currentPath, key];
                        const hookResult = executeHooks(node[key], url, config, newPath);
                        url = hookResult.url;
                        config = hookResult.config;
                        if (hookResult.matchedPath) {
                            matchedPath = hookResult.matchedPath;
                            break;
                        }
                      }
                    }
                  } else if (typeof node === 'function') {
                    try {
                      const result = node(url, config);
                      if (result && result.url && result.config) {
                        url = result.url;
                        config = result.config;
                        matchedPath = currentPath;
                      }
                    } catch (e) { if (doLog) console.error('[Caliber Hook Error]', e); }
                  }
                  return { url, config, matchedPath };
                };

                window.fetch = async function(...args) {
                  let resource = args[0], config = args[1] || {}, url = new URL(String(resource), window.location.origin).toString();

                  const { url: finalUrl, config: finalConfig, matchedPath } = executeHooks(window['${hooksRegistry}'], url, config);
                  args[0] = finalUrl;
                  args[1] = finalConfig;

                  const response = await originalFetch.apply(this, args);

                  if (matchedPath) {
                    const responseClone = response.clone();
                    responseClone.text().then(text => {
                      let responseData;
                      try {
                        responseData = JSON.parse(text);
                      } catch (e) {
                        responseData = text;
                      }

                      const event = new CustomEvent(RESPONSE_EVENT_NAME, {
                        detail: { path: matchedPath, responseData }
                      });
                      document.dispatchEvent(event);
                    }).catch(e => {
                      if (doLog) console.warn('[Caliber Interceptor] Could not read response body for hooked request.', e);
                    });
                  }

                  return response;
                };
                if (doLog) console.warn('[Caliber] Injected fetch interceptor is active.');
              }

              const setByPath = (obj, p, val) => {
                const last = p.pop();
                let node = obj;
                p.forEach(k => { node = (node[k] = (typeof node[k] === 'object' && node[k] !== null) ? node[k] : {}); });
                node[last] = val;
              };

              setByPath(window['${hooksRegistry}'], ${pathJson}, (${hookFunctionString}));
              if (${isDebug}) console.log(\`[Caliber] Hook at path [${finalPath.join(
            "/"
          )}] added/updated. Awaits response: ${awaitsResponse}\`);
            })();
          `;
          sanitizer.injectScript(hostDocument, injectionCode);
        },

        /**
         * 从注入的钩子注册表中移除一个钩子或分支。
         * @param {string[]|string} path - 要移除的钩子或分支的路径。
         */
        removeHook(path) {
          const finalPath = _validateAndTransformPath(path, "removeHook");
          if (!finalPath) return;

          const pathKey = JSON.stringify(finalPath);
          // 如果确实存在一个回调被移除，减少引用计数
          if (responseCallbacks.has(pathKey)) {
            responseCallbacks.delete(pathKey);
            listenerRefCount--;

            if (listenerRefCount === 0) {
              hostDocument.removeEventListener(
                responseEventName,
                _handleInjectedEvent
              );
              if (isDebug)
                logger.log(
                  `[FetchInterceptor] Global response listener removed as no hooks are active.`
                );
            }
            if (isDebug)
              logger.log(
                `[FetchInterceptor] Response callback for path [${finalPath.join(
                  "/"
                )}] removed.`
              );
          }

          const pathJson = JSON.stringify(finalPath);
          const removalCode = `
            (() => {
              const registry = window['${hooksRegistry}'];
              if (!registry) return;
              const path = ${pathJson};
              let parent = registry;
              for (let i = 0; i < path.length - 1; i++) {
                if (typeof parent[path[i]] === 'undefined') return;
                parent = parent[path[i]];
              }
              delete parent[path[path.length - 1]];
              if (${isDebug}) console.log(\`[Caliber] Hook or branch at path [${finalPath.join(
            "/"
          )}] removed.\`);
            })();
          `;
          sanitizer.injectScript(hostDocument, removalCode);
        },

        /**
         * 启动一个链式调用来创建和注册一个拦截器。
         * @param {string|{url: string, method?: string, match?: string|RegExp|Array<string|RegExp>}} urlOrOptions - 目标URL或一个包含URL、方法和页面匹配规则的对象。
         * @returns {object} 一个包含 .onRequest(), .onResponse(), .register() 的构建器对象。
         */
        target(urlOrOptions) {
          const builder = {
            _targetConfig: {},
            _requestHandlerStr: `(url, config) => ({ url, config })`,
            _responseCallback: null,

            _init(targetConfig) {
              this._targetConfig = targetConfig;
              return this;
            },

            /**
             * 定义请求被拦截时要执行的逻辑。
             * @param {string} handlerString - 一个将要被注入的函数体字符串。
             * @returns {builder}
             */
            onRequest(handlerString) {
              this._requestHandlerStr = handlerString;
              return this;
            },

            /**
             * 定义在沙箱中处理响应数据的回调函数。
             * @param {(responseData: any) => void} callback - 回调函数。
             * @returns {builder}
             */
            onResponse(callback) {
              this._responseCallback = callback;
              return this;
            },

            /**
             * 最终确定并注册这个拦截器。
             * @param {string|string[]} id - 拦截器的唯一ID，通常是模块的this.id。
             */
            register(id) {
              const { match } = this._targetConfig;

              const isMatched = _CaliberInternals._checkMatch(
                match,
                hostWindow
              );
              if (!isMatched) {
                if (isDebug) {
                  logger.log(
                    `[Interceptor.register] Registration for ID '${id}' skipped. Current URL "${hostWindow.location.href}" does not match the rule:`,
                    match
                  );
                }
                return;
              }

              if (!id) {
                logger.error(
                  "[Interceptor.register] An ID is required to register a hook."
                );
                return;
              }

              const isRequestModified =
                this._requestHandlerStr !==
                `(url, config) => ({ url, config })`;
              const isResponseHandled = this._responseCallback !== null;
              if (!isRequestModified && !isResponseHandled) {
                if (isDebug) {
                  logger.warn(
                    `[Interceptor.register] Registration for ID '${id}' was silently cancelled because both onRequest and onResponse were omitted.`
                  );
                }
                return;
              }

              const finalHandler = isRequestModified
                ? this._requestHandlerStr
                : `return { url, config };`;

              const fullHookString = service.createHook({
                targetUrl: this._targetConfig.url,
                method: this._targetConfig.method,
                handler: finalHandler,
              });

              if (isResponseHandled) {
                service.addHookWithResponse(
                  id,
                  fullHookString,
                  this._responseCallback
                );
              } else {
                service.addHook(id, fullHookString);
              }
            },
          };

          const targetConfig =
            typeof urlOrOptions === "string"
              ? { url: urlOrOptions, method: "GET" }
              : { method: "GET", ...urlOrOptions };

          return builder._init(targetConfig);
        },
      };
      return service;
    },

    /**
     * @private
     * [原生适配器] 基于Web标准API的默认服务实现。
     */
    _nativeBrowserAdapters: {
      storage: (storageKey) => ({
        get: () =>
          Promise.resolve(JSON.parse(localStorage.getItem(storageKey) || "{}")),
        set: (value) =>
          Promise.resolve(
            localStorage.setItem(storageKey, JSON.stringify(value))
          ),
      }),
      command: {
        register: (name, callback) => {},
      },
      style: (sanitizer, hostDocument) => ({
        _addedStyles: new Map(),
        add(cssString, id) {
          const styleElement = sanitizer.injectStyle(
            hostDocument,
            cssString,
            id
          );
          if (styleElement) {
            this._addedStyles.set(id, styleElement);
          }
        },
        remove(id) {
          if (this._addedStyles.has(id)) {
            this._addedStyles.get(id).remove();
            this._addedStyles.delete(id);
          }
        },
      }),
    },

    /**
     * @private
     * [服务工厂] 创建一个页面作用域代码执行器服务。
     * 可将任意JS代码字符串注入到宿主页面执行，并异步返回其可序列化的结果。
     * @param {object} logger - 框架的主 logger 实例。
     * @param {string} safeAppName - 应用的安全名称，用于生成唯一事件名。
     * @param {DOMSanitizerInstance} sanitizer - DOM净化与安全注入服务实例。
     * @param {Document} hostDocument - 宿主 document 对象。
     * @returns {{execute: (codeString: string) => Promise<any>}} PageScopeExecutor 服务实例。
     */
    createPageScopeExecutor: (logger, safeAppName, sanitizer, hostDocument) => {
      const namespace = `__CALIBER_PAGE_EXECUTOR_${safeAppName}`;

      return {
        async execute(codeString) {
          return new Promise((resolve, reject) => {
            const requestId = `req_${Math.random().toString(36).substr(2, 9)}`;
            const responseEventName = `${namespace}_RESPONSE_${requestId}`;

            const handleResponse = (event) => {
              const { success, data, errorMsg } = event.detail;
              hostDocument.removeEventListener(
                responseEventName,
                handleResponse
              );
              if (success) {
                resolve(data);
              } else {
                reject(
                  new Error(errorMsg || "Page-scope code execution failed.")
                );
              }
            };

            hostDocument.addEventListener(responseEventName, handleResponse, {
              once: true,
            });

            const injectionCode = `
              (async () => {
                const RESPONSE_EVENT_NAME = '${responseEventName}';
                try {
                  const result = await (${codeString});

                  document.dispatchEvent(new CustomEvent(RESPONSE_EVENT_NAME, {
                    detail: { success: true, data: result }
                  }));
                } catch (e) {
                  document.dispatchEvent(new CustomEvent(RESPONSE_EVENT_NAME, {
                    detail: { success: false, errorMsg: e.message }
                  }));
                }
              })();
            `;

            sanitizer.injectScript(hostDocument, injectionCode);
          });
        },
      };
    },
  };

  /**
   * 创建并启动一个基于 Caliber 框架的增强脚本应用。
   * 这是 Caliber 框架的唯一入口点。
   *
   * @param {object} options - 应用的配置对象。
   * @param {string} options.appName - 应用的名称。将用于日志前缀、UI标题和菜单项。
   * @param {class[]} options.modules - 一个由模块类（必须继承自 Caliber.Module）组成的数组。
   * @param {object} options.services - 一个包含所有平台相关服务实现的对象。
   * @param {object} options.services.storage - 存储服务适配器。必须实现 get() 和 set(value) 方法。
   *   @param {() => Promise<object>} options.services.storage.get - 一个异步函数，返回存储的用户配置对象。
   *   @param {(value: object) => Promise<void>} options.services.storage.set - 一个异步函数，将配置对象写入存储。
   * @param {object} options.services.command - 命令服务适配器。必须实现 register(name, callback) 方法。
   *   @param {(name: string, callback: () => void) => void} options.services.command.register - 一个函数，用于注册一个菜单命令。
   * @param {object} [options.services.hostWindow=window] - (可选) 要操作的窗口对象。默认为油猴环境的`unsafeWindow`或标准`window`。
   * @param {object} [options.services.hostDocument=document] - (可选) 要操作的文档对象。默认为`document`。
   * @param {boolean} [options.isDebug=true] - (可选) 是否开启调试模式，会影响日志的输出。默认为`false`。
   * @param {boolean} [options.settingsPanelEnabled=true] - (可选) 设置面板在首次启动时是否默认开启。默认为`true`。
   * @param {object} [options.framework] - (可选) 用于微调 Caliber 框架内部行为的配置。
   * @param {number} [options.framework.domProcessorBatchSize=20] - (可选) 设置 DomBatchProcessor 在每个渲染帧中处理的最大任务数。
   * @returns {Promise<void>}
   */
  async function createApp(options) {
    const {
      appName,
      modules,
      services,
      isDebug = false,
      settingsPanelEnabled = true,
    } = options || {};

    // 初始化基础环境
    const loggerFactory = new LoggerService(isDebug);
    const mainLogger = loggerFactory.createMainLogger(appName || "CaliberApp");
    const hostWindow =
      services.hostWindow || ("unsafeWindow" in window ? unsafeWindow : window);
    const hostDocument =
      services.hostDocument || hostWindow.document || document;

    // 创建上下文
    const context = _CaliberInternals._createAppContext(appName);

    // 执行预检
    if (
      !_CaliberInternals.runPreflightChecks(
        options,
        context.instanceKey,
        mainLogger,
        hostWindow
      )
    ) {
      return;
    }

    const sanitizer = _CaliberInternals.createDOMSanitizer(mainLogger);
    // 优先使用用户提供的，否则使用框架内置的原生适配器
    const finalServices = {
      storage:
        services.storage ||
        _CaliberInternals._nativeBrowserAdapters.storage(
          `CALIBER_STORAGE_${appName}`
        ),
      command: _CaliberInternals._nativeBrowserAdapters.command,
      style:
        services.style ||
        _CaliberInternals._nativeBrowserAdapters.style(sanitizer, hostDocument),
      ...services,
    };

    // 初始化核心服务
    const coreServices = _CaliberInternals.initializeCoreServices(
      options,
      context,
      mainLogger,
      hostWindow,
      hostDocument,
      sanitizer
    );

    // 组装依赖并运行内核
    const injectedServices = {
      hostWindow,
      hostDocument,
      eventBus: coreServices.eventBus,
      storage: finalServices.storage,
      logger: mainLogger,
      style: finalServices.style,
      framework: {
        ...coreServices.framework,
        ...options.framework,
      },
      IS_DEBUG: isDebug,
      APP_NAME: appName,
      SAFE_APP_NAME: context.safeAppName,
      initialConfig: { settingsPanel: { enabled: settingsPanelEnabled } },
    };

    const kernel = new AppKernel(injectedServices);
    hostWindow[context.instanceKey] = kernel;
    modules.forEach((ModuleClass) => kernel.registerModule(ModuleClass));
    await kernel.run();

    // 注册外部接口
    finalServices.command.register(`⚙️ ${appName} 设置`, () => {
      coreServices.eventBus.emit("command:toggle-settings-panel");
    });

    mainLogger.log("Bootstrap sequence complete. Application is alive.");
  }

  return {
    createApp,
    Module, // 暴露 Module 基类，以便应用脚本可以继承它
  };
})();

// #endregion

// #region ================================ 功能模块定义 (Feature Modules) ================================

/**
 * 日/夜间模式切换模块
 */
class ThemeSwitcherModule extends Caliber.Module {
  id = "themeSwitcher";
  name = "夜间模式";
  description = "提供日间/夜间模式切换。";
  defaultConfig = {
    enabled: true,
    themeMode: {
      label: "暗黑模式",
      type: "select",
      value: "auto",
      description: "“自动”将根据您的系统设置来切换模式。",
      options: [
        { label: "停用", value: "off" },
        { label: "启用", value: "on" },
        { label: "自动", value: "auto" },
      ],
    },
  };

  #DARK_THEME_CSS = `
    html.theme-dark {
      & {
        --color-primary-white--value: 28, 28, 30;
        --color-primary-black--value: 229, 229, 234;
        --color-font-1--value: 229, 229, 234;
        --color-font-2--value: 152, 152, 157;
        --color-font-3--value: 110, 110, 115;
        --color-font-4--value: 80, 80, 85;
        --color-background-1--value: 18, 18, 18;
        --color-background-2--value: 28, 28, 30;
        --color-background-3--value: 44, 44, 46;
        --color-border-1--value: 58, 58, 60;
        --color-border-2--value: 44, 44, 46;
        --color-font-5--value: 50, 150, 255;
        --color-border-3--value: 28, 28, 30;
        --color-background-4--value: 220, 220, 225;
        --color-background-5--value: rgba(229, 229, 234, 0.1);
        --color-background-hover: rgba(255, 255, 255, 0.08);
        --color-background-hover-1: rgb(var(--color-background-3--value));
        --color-background-hover-2: rgb(var(--color-background-2--value));
        --color-background-hover-3: rgba(255, 255, 255, 0.04);
        --color-primary-red--value: 255, 80, 95;
        --color-primary-blue--value: 20, 130, 255;
        --color-primary-green--value: 70, 200, 90;
        --color-gradient-red-1: #d94851;
        --color-gradient-red-2: #c22b42;
        --color-gradient-orange-1: #cc8100;
        --color-gradient-orange-2: #b86436;
        --color-gradient-purple-1: #c558cc;
        --color-gradient-purple-2: #a22b42;
        --color-gradient-blue-1: #4292cc;
        --color-gradient-blue-2: #1574cd;
        --color-gradient-green-1: #72a920;
        --color-gradient-green-2: #48a616;
        --color-game-price-low: #4CAF50;
        --color-game-price-new-low: #81C784;
        --color-game-price-super-low: linear-gradient(72deg, #00bfa5 24.1%, #00c853 75.9%);
        --color-platform-steam: #2e4763;
        --box-shadow-1: 0 4px 20px rgba(0, 0, 0, 0.5);
        --color-background-subtle--value: 58, 58, 60;
        --color-background-subtle: rgb(var(--color-background-subtle--value));
        --color-gradient-black-1-1: #5a5f64;
        --color-gradient-black-1-2: #8e9499;

        color-scheme: dark;
      }

      img,
      video,
      [style*="background-image"] {
        filter: brightness(0.85) contrast(1.05);
      }

      .hb-cpt__loading.circle,
      .game-detail-page-topic .page-topic-header,
      .game-detail-section-footer,
      .game-detail-section-data .game-data,
      .game-info,
      .hb-cpt-login-mask .hb-cpt-login .left-box,
      .phone-login-wrapper,
      .hb-cpt__link-game-card {
        background-color: var(--color-primary-white) !important;
      }

      .hb-website__post-btn,
      .hot-topic__look,
      .user-profile-user-head .info-box .name-box .name,
      .hb-page__user-profile .user-profile-wrapper .bbs-info .bbs-info-item .value,
      .game-detail-section-data .game-data .row-1 .game-name .name,
      .game-rank__game-card .game-info .line-1,
      .phone-login-wrapper .user-info-box .row .prefix label {
        color: var(--color-primary-black) !important;
      }

      .hb-cpt__link-game-card p,
      button.link-reply__menu-btn,
      button {
        color: var(--color-font-1) !important;
      }

      .hb-bbs-home .hb-bbs-home__splitline::after {
        border: 1px solid var(--color-border-1);
        width: calc(100% + 30px);
        background-color: var(--color-border-1);
      }

      .hb-bbs-home>.bbs-home__topic-list-wrapper.hb-bbs-home__splitline::after {
        left: 0;
        width: calc(100% - 2px);
      }

      .game-detail-section-comment,
      .game-detail-section-score,
      .game-detail-section-similar-games,
      .phone-login-wrapper .user-info-box .row .prefix label span {
        border-top-color: var(--color-border-1);
      }

      .hb-page__user-profile .user-profile-wrapper {      
        border-bottom-color: var(--color-border-1);
      }

      .game-detail-comment-item:after,
      .game-detail-section-footer:after,
      .search-result__space {
        background-color: var(--color-border-1) !important;
      }

      .hb-header-logo__image {
        filter: invert(1) brightness(2) contrast(100);
      }

      .hb-cpt__pagination--right {
        background: linear-gradient(270deg,
            var(--color-background-2) 0%,
            var(--color-background-2) 50%,
            rgba(var(--color-background-2--value), 0) 100%);
      }

      .hb-cpt__pagination--left {
        background: linear-gradient(90deg,
            var(--color-background-2) 0%,
            var(--color-background-2) 50%,
            rgba(var(--color-background-2--value), 0) 100%);
      }

      .game-detail-section-data .game-data .btn-see-all,
      .hardware-performance {
        background-color: var(--color-background-3);
      }

      .game-detail-section-data .game-data .row-3 .data-list .data-item {
        background-color: var(--color-background-3);

        &::before {
          border-color: var(--color-background-3);
        }
      }
      
      .bbs-content__game-card .hb-cpt__link-game-card {
          border:1px solid var(--color-background-3);
          &::after { content: initial; }
      }

      .game-detail-page-detail .section-title .title,
      .game-detail-section-data .game-info .game-awards .award-item .award-info .award-detail,
      .game-detail-section-data .game-info .menu-list .menu-item p,
      .com-text {
        color: var(--color-primary-black);
      }

      .game-detail-section-data .game-info .about-game,
      .game-detail-comment-item .description,
      .game-detail-section-score .publish-score-wrapper .publish-desc>p,
      .hb-header-logo__desc {
        color: var(--color-font-1);
      }

      .game-detail-section-data .game-data .row-1 .score-wrapper .comment span {
        color: var(--color-font-4);
      }

      .game-detail-section-data .game-info .hardware-performance {
        background: linear-gradient(var(--angle-gradient--value), var(--color-gradient-black-1-2), var(--color-gradient-black-1-1));
      }

      .game-detail-comment-item .description .btn-all {
        background-color: var(--color-background-3);
        color: var(--color-font-1);

        &::after {
          background: linear-gradient(270deg, var(--color-background-3), transparent);
        }
      }

      .game-detail-comment-item .tools .item,
      .hb-game-comment .game-comment__content .game-comment__content-tools .item,
      .hb-page__user-profile .post-link-wrapper .tab-list--wrapper .link-tab-list .tab-active-block {
        background-color: var(--color-background-4);
      }

      .user-profile-user-head .info-box .name-box .detail-info {
        background-color: var(--color-gradient-black-1-2);
      }

      .search-pull__default-page .search__hot-rank .hot-rank__list .hot-rank__list-item:hover,
      .game-detail-page-topic .page-topic-link-list .hb-bbs-home__splitline:after {
        background-color: var(--color-background-3);
      }

      .hb-layout__fake-frame-left--top svg,
      .hb-layout__fake-frame-left--bottom svg {
        display: none;
      }

      .game-detail-comment-item:after {
        left: 0;
        width: 100%;
      }
    }
    `;
  #mediaQuery = null;
  #themeChangeListener = null;
  #styleId = "caliber-theme-switcher-style";

  onEnable() {
    this._services.style.add(this.#DARK_THEME_CSS, this.#styleId);

    this.#mediaQuery = this._hostWindow.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    this.#themeChangeListener = this.applyTheme;
    this.#mediaQuery.addEventListener("change", this.#themeChangeListener);

    this.applyTheme();
  }

  onDisable() {
    this._services.style.remove(this.#styleId);

    if (this.#mediaQuery && this.#themeChangeListener) {
      this.#mediaQuery.removeEventListener("change", this.#themeChangeListener);
    }

    this._hostDocument.documentElement.classList.remove("theme-dark");

    this.#mediaQuery = null;
    this.#themeChangeListener = null;
  }

  applyTheme = () => {
    const isSystemDark = this.#mediaQuery.matches;
    const rootElement = this._hostDocument.documentElement;

    switch (this._config.themeMode) {
      case "on":
        rootElement.classList.add("theme-dark");
        break;
      case "off":
        rootElement.classList.remove("theme-dark");
        break;
      case "auto":
      default:
        if (isSystemDark) {
          rootElement.classList.add("theme-dark");
        } else {
          rootElement.classList.remove("theme-dark");
        }
        break;
    }
  };

  onConfigChange(key, newValue, oldValue) {
    this._logger.log(
      `Module '${this.id}' config '${key}' changed from '${oldValue}' to '${newValue}'.`
    );

    if (key === "themeMode") {
      this.applyTheme();
    }
  }
}

/**
 * 返回按钮逻辑修正模块
 */
class BackButtonFixModule extends Caliber.Module {
  id = "backButtonFix";
  name = "返回按钮修复";
  description = "修正帖子页面的返回按钮行为。";
  defaultConfig = {
    enabled: false,
  };

  #isInIframe = false;
  #boundHandleClick = this.#handlelBackButton.bind(this);

  onEnable() {
    this.#isInIframe = this._hostWindow.self !== this._hostWindow.top;
    this._hostDocument.addEventListener("click", this.#boundHandleClick, true);
  }

  onDisable() {
    this._hostDocument.removeEventListener(
      "click",
      this.#boundHandleClick,
      true
    );
  }

  #handlelBackButton(event) {
    const backButton = event.target.closest(".page-header__back-btn");
    if (!backButton) return;

    if (this.#isInIframe) {
      this.#handleIframeBackButton(event, backButton);
    } else if (this._utils.checkMatch("/app/bbs/link")) {
      this.#handleStandardBackButton(event, backButton);
    }
  }

  #handleStandardBackButton(event, backButton) {
    if (backButton.dataset.override) return;

    const originalUrl = this._hostWindow.location.href;
    event.stopImmediatePropagation();

    backButton.dataset.override = "true";
    this._hostWindow.history.back();

    const checkNavigation = () => {
      if (this._hostWindow.location.href === originalUrl) {
        this._logger.warn(
          "Navigation failed, releasing event to default handler"
        );
        backButton.dispatchEvent(new Event("click", { bubbles: true }));
      }
    };
    setTimeout(checkNavigation, 100);
  }

  /**
   * 为 (窗口模式) 场景设计的。
   */
  async #handleIframeBackButton(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    try {
      const getPreviousUrlCode = `
        (() => {
          const router = useNuxtApp().$router;
          return router.options.history.state.back || null;
        })()
      `;
      const previousUrl = await this._executor.execute(getPreviousUrlCode);

      if (previousUrl) {
        this._logger.log(
          `Found previous URL in router state: "${previousUrl}". Navigating...`
        );
        const navigateCode = `(() => { useNuxtApp().$router.push('${previousUrl}'); })()`;
        await this._executor.execute(navigateCode);
      } else {
        this._logger.warn(
          "No previous URL in router. Falling back to community home."
        );
        const fallbackNavigateCode = `(() => { useNuxtApp().$router.push('/app/bbs/home'); })()`;
        await this._executor.execute(fallbackNavigateCode);
      }
    } catch (e) {
      this._logger.error(
        "Failed to interact with Nuxt Router. Falling back to simple location change.",
        e
      );
      this._hostWindow.location.href = "https://www.xiaoheihe.cn/app/bbs/home";
    }
  }
}

/**
 * 新标签页打开帖子模块
 */
class NewTabPageModule extends Caliber.Module {
  id = "newTabPage";
  name = "新标签页打开帖子";
  description = "社区中的feeds流链接将会在新的浏览器标签页中打开。";
  defaultConfig = {
    enabled: false,
  };

  #schedulerTaskId = null;
  #rootSelector = "div.hb-cpt__scroll-list";
  #selector = "a.hb-cpt__bbs-content";

  onEnable() {
    this.#schedulerTaskId = this._scheduler.register(
      this.#selector,
      this.#processLink,
      { root: this.#rootSelector, processExisting: true }
    );
    this._logger.log(
      `Module '${this.id}' enabled. Watcher is active for existing and new links.`
    );
  }

  onDisable() {
    if (this.#schedulerTaskId) {
      this._scheduler.unregister(this.#schedulerTaskId);
      this.#schedulerTaskId = null;
    }
  }

  #processLink = (linkElement) => {
    if (!linkElement.dataset.newTabPageTarget) {
      linkElement.dataset.newTabPageTarget = true;
      linkElement.target = "_blank";
    }
  };
}

/**
 * 快速跳转到评论区模块
 */
class QuickJumpToCommentsModule extends Caliber.Module {
  id = "quickJumpToComments";
  name = "快速跳转到评论区";
  description = "在帖子顶部的操作栏中添加一个按钮，可快速跳转到评论区。";
  match = "/app/bbs/link";
  defaultConfig = {
    enabled: true,
  };

  uiGuard = {
    target: "div.page-header__other-trans .page-header--right",
    component: "#caliber-quick-jump-btn",
  };

  #commentsSelector = "div.link-comment";
  #componentTag = "quick-jump-button";

  onEnable() {
    this._logger.log(`Module '${this.id}' enabled.`);
    this.#defineButtonComponent(this._sanitizer);
  }

  onDisable() {
    this._logger.log(`Module '${this.id}' disabled.`);
  }

  onRender(targetElement) {
    const commentsSection = this._hostDocument.querySelector(
      this.#commentsSelector
    );
    if (!commentsSection) {
      this._logger.log("Comments section not found, deferring render.");
      return;
    }

    this._logger.log("Guardian triggered render for QuickJumpToComments.");

    targetElement.style.display = "flex";
    targetElement.style.alignItems = "center";
    targetElement.style.gap = "12px";

    const buttonElement = this._hostDocument.createElement(this.#componentTag);
    buttonElement.id = this.uiGuard.component.substring(1);
    buttonElement.addEventListener("jump-click", this.#handleClick);
    targetElement.prepend(buttonElement);
  }

  onCleanup() {
    const button = this._hostDocument.querySelector(this.uiGuard.component);
    if (button) {
      button.removeEventListener("jump-click", this.#handleClick);
      button.remove();
    }
  }

  #handleClick = () => {
    const targetElement = this._hostDocument.querySelector(
      this.#commentsSelector
    );
    if (targetElement) {
      this._hostWindow.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth",
      });
    }
  };

  #defineButtonComponent = (sanitizer) => {
    if (customElements.get(this.#componentTag)) return;

    class QuickJumpButton extends HTMLElement {
      _buttonElement = null;
      _clickHandler = null;

      constructor() {
        super();
        this.attachShadow({ mode: "open" });
      }

      connectedCallback() {
        const html = `
          <style>
            button {
              background: none; border: none; padding: 0; margin: 0; font: inherit;
              color: inherit; cursor: pointer; outline: inherit; padding: 4px 8px;
              border: 1px solid var(--color-border-1, #e0e0e0);
              border-radius: 4px; font-size: 12px;
              color: var(--color-font-2, #757575);
              background-color: transparent;
              transition: background-color 0.2s, color 0.2s;
              user-select: none;
            }
            button:hover {
              background-color: var(--color-background-hover, #f5f5f5);
              color: var(--color-font-1, #212121);
            }
          </style>
          <button>直达评论</button>
        `;
        sanitizer.setInnerHTML(this.shadowRoot, html);

        this._buttonElement = this.shadowRoot.querySelector("button");
        this._clickHandler = () =>
          this.dispatchEvent(
            new CustomEvent("jump-click", { bubbles: true, composed: true })
          );
        this._buttonElement.addEventListener("click", this._clickHandler);
      }

      disconnectedCallback() {
        if (this._buttonElement && this._clickHandler) {
          this._buttonElement.removeEventListener("click", this._clickHandler);
        }
      }
    }

    customElements.define(this.#componentTag, QuickJumpButton);
  };
}

/**
 * Steam商店直达模块
 */
class SteamDirectLinkModule extends Caliber.Module {
  id = "steamDirectLink";
  name = "Steam商店直达";
  description = "在PC游戏主题页，提供直达Steam商店和SteamDB页面的按钮。";
  match = "/app/topic/game/pc/:gameId";
  defaultConfig = {
    enabled: true,
  };

  uiGuard = {
    target: "div.hb-cpt__pagination > .hb-cpt__pagination-outer",
    component: "#caliber-steam-links-container",
  };

  #buttonComponentTag = "caliber-link-button";
  #originalContainerStyles = null;
  #gameId = null;

  onEnable(context) {
    this._logger.log(`Module '${this.id}' activated on a matched page.`);
    this.#gameId = context.params.gameId || null;
    this.#defineButtonComponent(this._sanitizer);
  }

  onDisable() {
    this._logger.log(`Module '${this.id}' deactivated.`);
  }

  onNavigate(context) {
    const newGameId = context.params.gameId || null;

    if (this.#gameId !== newGameId) {
      this._module.requestReset();
    }
  }

  onRender(targetElement) {
    if (!this.#gameId) return;

    this.#originalContainerStyles = targetElement.getAttribute("style");
    targetElement.style.display = "flex";
    targetElement.style.justifyContent = "space-between";
    targetElement.style.alignItems = "center";
    targetElement.style.overflow = "initial";

    const container = this._hostDocument.createElement("div");
    container.id = this.uiGuard.component.substring(1);
    container.style.display = "flex";
    container.style.gap = "8px";

    const createButton = ({ href, text, variant, iconSvg = null }) => {
      const button = this._hostDocument.createElement(this.#buttonComponentTag);
      button.setAttribute("href", href || "");
      button.setAttribute("text", text || "");
      button.setAttribute("variant", variant || "");
      if (iconSvg) {
        button.setAttribute("icon-svg", iconSvg);
      }
      return button;
    };

    const steamLink = `https://store.steampowered.com/app/${this.#gameId}`;
    const steamDBLink = `https://steamdb.info/app/${this.#gameId}`;
    const steamIconSvg = `<svg t="1755831740195" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5073" width="32" height="32"><path d="M1008 512c0 274-222.4 496-496.8 496-227.6 0-419.2-152.6-478-360.8l190.4 78.6c12.8 64.2 69.8 112.8 137.8 112.8 78.4 0 143.8-64.8 140.4-147l169-120.4c104.2 2.6 191.6-81.8 191.6-187 0-103.2-84-187-187.4-187s-187.4 84-187.4 187v2.4L369.2 558c-31-1.8-61.4 6.8-87 24.2L16 472.2C36.4 216.8 250.2 16 511.2 16 785.6 16 1008 238 1008 512zM327.4 768.6l-61-25.2a105.58 105.58 0 0 0 54.4 51.6c53.8 22.4 115.6-3.2 138-56.8 10.8-26 11-54.6 0.2-80.6-10.8-26-31-46.4-57-57.2-25.8-10.8-53.4-10.4-77.8-1.2l63 26c39.6 16.4 58.4 61.8 41.8 101.4-16.6 39.8-62 58.4-101.6 42z m347.6-259.8c-68.8 0-124.8-56-124.8-124.6s56-124.6 124.8-124.6 124.8 56 124.8 124.6-55.8 124.6-124.8 124.6z m0.2-31.2c51.8 0 93.8-42 93.8-93.6 0-51.8-42-93.6-93.8-93.6s-93.8 42-93.8 93.6c0.2 51.6 42.2 93.6 93.8 93.6z" fill="" p-id="5074"></path></svg>`;
    const steamDBIconSvg = `<svg width="30" height="30" viewBox="0 0 128 128" class="octicon octicon-steamdb" aria-hidden="true"><path fill-rule="evenodd" d="M63.9 0C30.5 0 3.1 11.9.1 27.1l35.6 6.7c2.9-.9 6.2-1.3 9.6-1.3l16.7-10c-.2-2.5 1.3-5.1 4.7-7.2 4.8-3.1 12.3-4.8 19.9-4.8 5.2-.1 10.5.7 15 2.2 11.2 3.8 13.7 11.1 5.7 16.3-5.1 3.3-13.3 5-21.4 4.8l-22 7.9c-.2 1.6-1.3 3.1-3.4 4.5-5.9 3.8-17.4 4.7-25.6 1.9-3.6-1.2-6-3-7-4.8L2.5 38.4c2.3 3.6 6 6.9 10.8 9.8C5 53 0 59 0 65.5c0 6.4 4.8 12.3 12.9 17.1C4.8 87.3 0 93.2 0 99.6 0 115.3 28.6 128 64 128c35.3 0 64-12.7 64-28.4 0-6.4-4.8-12.3-12.9-17 8.1-4.8 12.9-10.7 12.9-17.1 0-6.5-5-12.6-13.4-17.4 8.3-5.1 13.3-11.4 13.3-18.2 0-16.5-28.7-29.9-64-29.9zm22.8 14.2c-5.2.1-10.2 1.2-13.4 3.3-5.5 3.6-3.8 8.5 3.8 11.1 7.6 2.6 18.1 1.8 23.6-1.8s3.8-8.5-3.8-11c-3.1-1-6.7-1.5-10.2-1.5zm.3 1.7c7.4 0 13.3 2.8 13.3 6.2 0 3.4-5.9 6.2-13.3 6.2s-13.3-2.8-13.3-6.2c0-3.4 5.9-6.2 13.3-6.2zM45.3 34.4c-1.6.1-3.1.2-4.6.4l9.1 1.7a10.8 5 0 1 1-8.1 9.3l-8.9-1.7c1 .9 2.4 1.7 4.3 2.4 6.4 2.2 15.4 1.5 20-1.5s3.2-7.2-3.2-9.3c-2.6-.9-5.7-1.3-8.6-1.3zM109 51v9.3c0 11-20.2 19.9-45 19.9-24.9 0-45-8.9-45-19.9v-9.2c11.5 5.3 27.4 8.6 44.9 8.6 17.6 0 33.6-3.3 45.2-8.7zm0 34.6v8.8c0 11-20.2 19.9-45 19.9-24.9 0-45-8.9-45-19.9v-8.8c11.6 5.1 27.4 8.2 45 8.2s33.5-3.1 45-8.2z"></path></svg>`;

    container.appendChild(
      createButton({
        href: steamLink,
        // text: 'Steam',
        variant: "steam",
        iconSvg: steamIconSvg,
      })
    );

    container.appendChild(
      createButton({
        href: steamDBLink,
        // text: 'SteamDB',
        variant: "steamdb",
        iconSvg: steamDBIconSvg,
      })
    );

    targetElement.appendChild(container);
  }

  onCleanup() {
    const container = this._hostDocument.querySelector(this.uiGuard.component);
    if (container) {
      const parent = container.parentElement;
      container.remove();
      if (parent) {
        if (this.#originalContainerStyles) {
          parent.setAttribute("style", this.#originalContainerStyles);
        } else {
          parent.removeAttribute("style");
        }
      }
      this.#originalContainerStyles = null;
    }
  }

  #defineButtonComponent = (sanitizer) => {
    if (customElements.get(this.#buttonComponentTag)) return;

    class CaliberLinkButton extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
      }

      static get observedAttributes() {
        return ["href", "text", "variant", "icon-svg"];
      }

      connectedCallback() {
        const html = `
          <style>
            :host {
              display: inline-block;
            }

            .btn {
              position: relative;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 6px 14px;
              border-radius: 2px;
              font-size: 13px;
              font-weight: 500;
              border: none;
              color: #e0e0e0;
              background-color: #3a3a3a;
              box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
              text-decoration: none;
              user-select: none;
              transform: translateY(0);
              transition: background-color 0.1s ease, box-shadow 0.2s ease, transform 0.1s ease;
            }

            .btn:hover {
              cursor: pointer;
              background-color: #555555;
            }

            .btn:active {
              transform: translateY(1px);
              box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
            }

            .btn .icon {
              display: inline-flex;
              align-items: center;
              width: 16px;
              height: 16px;
            }

            .btn .icon svg {
              width: 100%;
              height: 100%;
              fill: currentColor;
            }

            .btn .text:empty {
              display: none;
            }

            .btn--steam {
              color: #ffffff;
              background-color: #1a9fff;
              box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.32);
            }

            .btn--steam:hover {
              background-color: #00bbff;
            }

            .btn::before, .btn::after {
                position: absolute;
                left: 50%;
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                transition: opacity 0.2s ease-out, transform 0.2s ease-out;
            }
            
            .btn::after {
                content: attr(data-tooltip);
                top: calc(100% + 8px);
                padding: 5px 10px;
                border-radius: 3px;
                font-size: 12px;
                font-weight: 400;
                color: #e0e0e0;
                background-color: #2c2c2c;
                box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);
                white-space: nowrap;
                transform: translateX(calc(-100% + 20px)) translateY(-5px);
            }
            
            .btn::before {
                content: '';
                top: calc(100% + -2px);
                border: 5px solid transparent;
                border-bottom-color: #2c2c2c;
                transform: translateX(-50%) translateY(-5px);
            }

            .btn:hover::before {
                opacity: 1;
                visibility: visible;
                transform: translateX(-50%) translateY(0);
            }
            .btn:hover::after {
                opacity: 1;
                visibility: visible;
                transform: translateX(calc(-100% + 20px)) translateY(0);
            }
          </style>
          <a href="#" target="_blank" rel="noopener noreferrer" class="btn">
            <span class="icon"></span>
            <span class="text"></span>
          </a>
        `;
        sanitizer.setInnerHTML(this.shadowRoot, html);
        this._render();
      }

      attributeChangedCallback() {
        this._render();
      }

      _render() {
        const link = this.shadowRoot.querySelector("a");
        const iconContainer = this.shadowRoot.querySelector(".icon");
        const textContainer = this.shadowRoot.querySelector(".text");

        if (!link) return;

        const href = this.getAttribute("href") || "#";
        const text = this.getAttribute("text") || "";
        const variant = this.getAttribute("variant");
        const iconSvg = this.getAttribute("icon-svg");

        link.href = href;
        link.className = `btn btn--${variant}`;
        link.dataset.tooltip = `直达${(variant || "").toLocaleUpperCase()}`;
        textContainer.textContent = text;

        if (iconSvg) {
          sanitizer.setInnerHTML(iconContainer, iconSvg);
          iconContainer.style.display = "inline-flex";
        } else {
          iconContainer.innerHTML = "";
          iconContainer.style.display = "none";
        }
      }
    }

    customElements.define(this.#buttonComponentTag, CaliberLinkButton);
  };
}

/**
 * 首页帖子动态增强模块
 */
class FeedsEnhancementModule extends Caliber.Module {
  id = "feedsEnhancement";
  name = "首页帖子动态增强";
  description =
    "为首页Feeds流中的帖子卡片动态添加其所属的游戏社区标签，发帖时间等。";
  match = "/app/bbs/home";
  defaultConfig = {
    enabled: true,
  };

  #postDataMap = new Map();
  #schedulerTaskId = null;

  #rootSelector = "div.bbs-home__content-list";
  #rootSelectorElement = null;
  #postCardSelector =
    "a.hb-cpt__bbs-content.hb-cpt__bbs-list-content.bbs-home__content-item";

  #boundHandleResponse = this.#handleResponse.bind(this);
  #boundProcessPostCard = this.#processPostCard.bind(this);

  onEnable() {
    this._logger.log(`Module '${this.id}' enabled. Interceptor deployed.`);

    this._interceptor
      .target({ url: "https://api.xiaoheihe.cn/bbs/app/feeds" })
      .onResponse(this.#boundHandleResponse)
      .register(this.id);
  }

  onDisable() {
    this._logger.log(
      `Module '${this.id}' disabled. Cleaning up all resources.`
    );
    this._interceptor.removeHook(this.id);
    if (this.#schedulerTaskId) {
      this._scheduler.unregister(this.#schedulerTaskId);
      this._schedulerTaskId = null;
    }
    this.#postDataMap.clear();
  }

  /**
   * 响应回调：处理API数据，并部署DOM改造任务。
   */
  #handleResponse(responseData) {
    if (!responseData?.result?.links) return;

    if (!this.#rootSelectorElement) {
      this.#rootSelectorElement = this._hostDocument.querySelector(
        this.#rootSelector
      );
    }

    let newPostsCached = 0;
    for (const post of responseData.result.links) {
      if (post.linkid) {
        const postId = post.linkid.toString();
        this.#postDataMap.set(postId, post);
        newPostsCached++;
      }
    }

    if (newPostsCached === 0) return;
    this._logger.log(
      `Intelligence gathered for ${newPostsCached} new posts. Starting immediate processing.`
    );

    const unprocessedCards = this.#rootSelectorElement.querySelectorAll(
      `${this.#postCardSelector}:not([data-caliber-enhanced])`
    );
    if (unprocessedCards.length > 0) {
      unprocessedCards.forEach((card) => this.#boundProcessPostCard(card));
    }
  }

  /**
   * DOM处理回调：对匹配到的帖子卡片进行改造。
   */
  #processPostCard(postCardElement) {
    if (postCardElement.dataset.caliberEnhanced) return;

    const href = postCardElement.getAttribute("href");
    const match = href?.match(/\/bbs\/link\/(\d+)/);
    const postId = match?.[1];

    if (!postId) return;

    const postData = this.#postDataMap.get(postId);
    if (!postData) return;

    if (
      !Array.isArray(postData.topics) ||
      typeof postData.create_at === "undefined"
    ) {
      this._logger.log(
        `Skipping enhancement for post ${postId}: Data structure is non-standard (likely an ad or other content type).`
      );
      postCardElement.dataset.caliberEnhanced = "true";
      return;
    }

    const topics = postData.topics;
    const createTime = postData.create_at;

    try {
      const bottomLine = postCardElement.querySelector(
        ".bbs-content__bottom-line"
      );
      if (!bottomLine) return;

      postCardElement.dataset.caliberEnhanced = "true";

      if (createTime) {
        const timeElement = document.createElement("span");
        timeElement.textContent = this.#formatTimeAgo(createTime);
        timeElement.style.fontSize = "12px";
        timeElement.style.color = "var(--color-font-3, #9e9e9e)";
        bottomLine.style.gap = "12px";
        bottomLine.prepend(timeElement);
      }

      if (topics.length > 0) {
        const primaryTopic = topics[0];
        if (
          primaryTopic &&
          primaryTopic.topic_id &&
          primaryTopic.name &&
          primaryTopic.pic_url
        ) {
          const tagButton = document.createElement("a");
          tagButton.href = `/app/topic/link/${primaryTopic.topic_id}`;
          // tagButton.target = '_blank';
          tagButton.className = "hb-cpt__content-tag big link-tags__tag-item";
          tagButton.style.backgroundColor = "var(--color-background-3)";
          tagButton.style.color = "var(--color-font-2)";
          tagButton.style.textDecoration = "none";
          tagButton.style.margin = "0";

          tagButton.addEventListener("click", (e) => e.stopPropagation());

          const tagIcon = document.createElement("img");
          tagIcon.src = primaryTopic.pic_url;
          tagIcon.alt = primaryTopic.name;
          tagIcon.className = "content-tag-icon";

          const tagName = document.createElement("span");
          tagName.className = "content-tag-text";
          tagName.textContent = primaryTopic.name;

          tagButton.appendChild(tagIcon);
          tagButton.appendChild(tagName);

          bottomLine.prepend(tagButton);
        }
      }

      // this._logger.log(`Enhanced post card for post ${postId}.`);
    } catch (e) {
      this._logger.error(`Failed to enhance post card for post ${postId}`, e);
    }
  }

  #formatTimeAgo = (unixTimestamp) => {
    const now = new Date();
    const past = new Date(unixTimestamp * 1000);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const MINUTE = 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    if (diffInSeconds < MINUTE) {
      return `${diffInSeconds}秒前`;
    }
    if (diffInSeconds < HOUR) {
      return `${Math.floor(diffInSeconds / MINUTE)}分钟前`;
    }
    if (diffInSeconds < DAY) {
      return `${Math.floor(diffInSeconds / HOUR)}小时前`;
    }
    if (diffInSeconds < DAY * 5) {
      return `${Math.floor(diffInSeconds / DAY)}天前`;
    }

    const year = past.getFullYear();
    const month = (past.getMonth() + 1).toString().padStart(2, "0");
    const day = past.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
}

/**
 * 游戏/社区主题页增强模块
 */
class TopicEnhancementModule extends Caliber.Module {
  id = "topicEnhancement";
  name = "游戏/社区页增强";
  description = "为游戏社区主题页添加网页快捷入口、修正小程序按钮行为。";
  match = ["/app/topic/link", "/app/topic/game"];
  defaultConfig = {
    enabled: true,
    enableWebviewTags: {
      label: "显示网页快捷入口",
      type: "boolean",
      value: true,
      description: "在主题页顶部添加多个直达相关网页的快捷按钮。",
    },
    enableMiniProgramFix: {
      label: "修正小程序按钮",
      type: "boolean",
      value: true,
      description: "让侧边栏的小程序按钮直接打开。",
    },
  };

  uiGuard = {
    target: "div.topic-aside__topic-indicator",
    component: ".caliber-webview-wrapper",
  };

  #webviewLinks = [];
  #miniProgramDataByName = new Map();

  #miniProgramSchedulerId = null;
  #delegatedContainer = null;

  #miniProgramContainerSelector = "div.aside-miniprogram__content";
  #miniProgramButtonSelector = "button.aside-miniprogram__item";

  onEnable() {
    this._logger.log(`Module '${this.id}' enabled. Deploying interceptor.`);
    this._interceptor
      .target({
        url: "https://api.xiaoheihe.cn/bbs/app/topic/menu",
        match: this.match,
      })
      .onResponse(this.#handleResponse.bind(this))
      .register(this.id);
  }

  onDisable() {
    this._logger.log(
      `Module '${this.id}' disabled. Cleaning up all resources.`
    );
    this._interceptor.removeHook(this.id);

    if (this.#miniProgramSchedulerId) {
      this._scheduler.unregister(this.#miniProgramSchedulerId);
      this.#miniProgramSchedulerId = null;
    }
    this.#cleanupMiniProgramFeature();
  }

  onCleanup() {
    const injectedWrapper = this._hostDocument.querySelector(
      this.uiGuard.component
    );
    if (injectedWrapper) {
      injectedWrapper.remove();
    }
  }

  onRender(targetElement) {
    if (this._config.enableWebviewTags && this.#webviewLinks.length > 0) {
      this.#injectWebviewTags(targetElement);
    }
  }

  #handleResponse(responseData) {
    const result = responseData?.result;
    if (!result) return;

    this.#webviewLinks = this._config.enableWebviewTags
      ? this.#extractWebviewLinks(result.menu || [])
      : [];

    this.#miniProgramDataByName.clear();
    if (this._config.enableMiniProgramFix) {
      (result.mini_programs || []).forEach((program) => {
        if (program.name)
          this.#miniProgramDataByName.set(program.name, program);
      });
    }
    this._logger.log(
      `Intelligence updated: ${this.#webviewLinks.length} webview links, ${
        this.#miniProgramDataByName.size
      } mini programs.`
    );

    if (
      this._config.enableMiniProgramFix &&
      this.#miniProgramDataByName.size > 0
    ) {
      if (this.#miniProgramSchedulerId)
        this._scheduler.unregister(this.#miniProgramSchedulerId);

      this.#miniProgramSchedulerId = this._scheduler.register(
        this.#miniProgramContainerSelector,
        (container) => this.#delegateMiniProgramClicks(container),
        { processExisting: true }
      );
    }
  }

  #cleanupMiniProgramFeature() {
    if (this.#delegatedContainer) {
      this.#delegatedContainer.removeEventListener(
        "click",
        this.#handleMiniProgramClick.bind(this),
        true
      );
      this.#delegatedContainer = null;
    }
  }

  // 保持不变
  #extractWebviewLinks(menuData) {
    const links = [];
    menuData.forEach((item) => {
      if (item.type === "webview" && item.url) {
        links.push({
          title: item.title,
          url: item.url,
          color: item.color,
          bg_config: item.bg_config,
        });
      }
      if (Array.isArray(item.filters)) {
        item.filters.forEach((filter) => {
          if (filter.type === "webview" && filter.url) {
            links.push({
              title: filter.title,
              url: filter.url,
              color: filter.color || "#64696E",
              bg_config: filter.bg_config,
            });
          }
        });
      }
    });
    return links;
  }

  #injectWebviewTags(container) {
    const wrapper = this._hostDocument.createElement("div");
    wrapper.className = this.uiGuard.component.substring(1);
    wrapper.style.cssText =
      "display: flex; flex-wrap: wrap; gap: 8px; margin-block: 12px;";

    this.#webviewLinks.forEach(({ title, url, color, bg_config }) => {
      const tag = this._hostDocument.createElement("a");
      tag.href = url;
      tag.target = "_blank";
      tag.rel = "noopener noreferrer";
      tag.textContent = title;

      let backgroundStyle;
      if (bg_config && bg_config.bg_color) {
        const normalizeColor = (c) => (c.startsWith("#") ? c : `#${c}`);
        const startColor = normalizeColor(bg_config.bg_color);
        const endColor = normalizeColor(color);
        backgroundStyle = `linear-gradient(90deg, ${startColor}, ${endColor})`;
      } else {
        backgroundStyle = color
          ? color.startsWith("#")
            ? color
            : `#${color}`
          : "#64696E";
      }

      tag.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 6px 14px;
        font-size: 13px;
        font-weight: 600;
        border-radius: 10px;
        text-decoration: none;
        color: rgba(255, 255, 255, 0.95);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
        background: ${backgroundStyle};
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.15);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateY(0);
        cursor: pointer;
        user-select: none;
      `;

      tag.onmouseover = () => {
        tag.style.transform = "translateY(-2px)";
        tag.style.boxShadow =
          "0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)";
        tag.style.filter = "brightness(1.1)";
      };
      tag.onmouseout = () => {
        tag.style.transform = "translateY(0)";
        tag.style.boxShadow =
          "0 2px 5px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.15)";
        tag.style.filter = "brightness(1)";
      };

      wrapper.appendChild(tag);
    });

    container.appendChild(wrapper);
  }

  #delegateMiniProgramClicks(container) {
    if (this.#delegatedContainer === container) return;
    if (this.#delegatedContainer) {
      this.#delegatedContainer.removeEventListener(
        "click",
        this.#handleMiniProgramClick.bind(this),
        true
      );
    }
    this.#delegatedContainer = container;
    this.#delegatedContainer.addEventListener(
      "click",
      this.#handleMiniProgramClick.bind(this),
      true
    );
    this._logger.log(
      "Delegated click listener to a new mini program container."
    );
  }

  #handleMiniProgramClick(event) {
    const button = event.target.closest(this.#miniProgramButtonSelector);
    if (!button) return;

    const nameElement = button.querySelector(".aside-miniprogram__item--name");
    const buttonName = nameElement?.textContent?.trim();
    if (!buttonName) return;

    const programData = this.#miniProgramDataByName.get(buttonName);
    if (!programData) return;

    const protoString = programData.proto;
    const jsonMatch = protoString.match(/(\{.*\})$/);
    if (!jsonMatch) return;

    try {
      const protoData = JSON.parse(jsonMatch[1]);
      const targetUrl = protoData.webview?.url;
      if (targetUrl) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this._hostWindow.open(targetUrl, "_blank");
      }
    } catch (e) {
      this._logger.error(
        `Failed to parse extracted JSON for "${buttonName}".`,
        e
      );
    }
  }
}

/**
 * 自定义社区导航模块
 */
class CustomMenuModule extends Caliber.Module {
  id = "customMenu";
  name = "自定义社区导航";
  description = "在侧边栏添加自定义的社区快捷入口，方便快速访问。";
  defaultConfig = {
    enabled: false,
    topicIds: {
      label: "社区Topic ID列表",
      type: "string",
      value: "",
      description: "请输入一个或多个社区的Topic ID，用英文逗号 (,) 分隔。",
    },
  };

  uiGuard = {
    target: "div.hb-websit__left-section",
    component: "caliber-custom-menu-container",
  };

  #componentContainerTag = "caliber-custom-menu-container";
  #componentItemTag = "caliber-custom-menu-item";

  async onEnable() {
    this._logger.log(`Module '${this.id}' enabled. Initializing...`);
    this.#defineComponents(this._sanitizer);
    await this.#syncAndCacheTopics();
  }

  onDisable() {
    this._logger.log(`Module '${this.id}' disabled.`);
  }

  async onConfigChange(key, newValue, oldValue) {
    if (key === "topicIds" && newValue !== oldValue) {
      this._logger.log("Topic ID list changed. Re-syncing data...");
      await this.#syncAndCacheTopics();
    }
  }

  onRender(targetElement) {
    this._logger.log("Guardian triggered render for CustomMenu.");

    const moduleConfig = this._config;
    const orderedIds = this.#parseAndSanitizeIds(moduleConfig.topicIds);
    const cachedTopics = moduleConfig.cachedTopics || {};

    if (orderedIds.length === 0) {
      return;
    }

    const menuContainer = this._hostDocument.createElement(
      this.#componentContainerTag
    );
    orderedIds.forEach((id, index) => {
      const topicData = cachedTopics[id];
      if (topicData && topicData.topic) {
        const item = this._hostDocument.createElement(this.#componentItemTag);
        item.setAttribute("data-topic", JSON.stringify(topicData.topic));
        item.setAttribute("data-bg", JSON.stringify(topicData.bg_color || {}));
        item.setAttribute("animation-delay", `${index * 80}ms`);
        menuContainer.appendChild(item);
      }
    });

    if (menuContainer.hasChildNodes()) {
      targetElement.appendChild(menuContainer);
    }
  }

  onCleanup() {
    const existingMenu = this._hostDocument.querySelector(
      this.uiGuard.component
    );
    if (existingMenu) {
      existingMenu.remove();
    }
  }

  #parseAndSanitizeIds(userInput) {
    if (!userInput || typeof userInput !== "string") {
      return [];
    }
    const isNumericString = (str) => /^\d+$/.test(str);
    return userInput
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id && isNumericString(id));
  }

  async #syncAndCacheTopics() {
    const moduleConfig = this._config;
    const targetIds = this.#parseAndSanitizeIds(moduleConfig.topicIds);
    const cachedTopics = moduleConfig.cachedTopics || {};
    const idsToFetch = targetIds.filter((id) => !cachedTopics[id]);

    if (idsToFetch.length === 0) {
      if (targetIds.length > 0)
        this._logger.log("All required topic data is already cached.");
      return;
    }

    this._logger.log(
      `Fetching data for ${idsToFetch.length} new topic(s):`,
      idsToFetch
    );
    const results = await Promise.all(
      idsToFetch.map((id) => this.#fetchTopicData(id))
    );
    const newCache = { ...cachedTopics };
    let updated = false;
    results.forEach((data, index) => {
      const id = idsToFetch[index];
      if (data) {
        newCache[id] = data;
        updated = true;
      }
    });

    if (updated) {
      await this._services.configManager.updateAndSave(
        "cachedTopics",
        newCache
      );
    }
  }

  async #fetchTopicData(topicId) {
    try {
      const remoteCode = `
        (async () => {
          return await useNuxtApp().$api('/bbs/app/topic/menu', {
            method: "GET",
            query: { topic_id: '${topicId}' },
            credentials: "include",
            deep: false
          });
        })()
      `;
      const responseData = await this._executor.execute(remoteCode);
      if (responseData?.status === "ok" && responseData?.result?.topic) {
        return responseData.result;
      }
      this._logger.warn(
        `API did not return valid data for topic ID: ${topicId}. It might be an invalid ID.`
      );
      return null;
    } catch (error) {
      this._logger.error(
        `Error executing page-scope code for topic ID ${topicId}:`,
        error
      );
      return null;
    }
  }

  #defineComponents(sanitizer) {
    if (!customElements.get(this.#componentContainerTag)) {
      class MenuContainer extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          const styles = `
            :host {
              display: flex; flex-direction: column; gap: 8px;
              margin-top: 16px; padding-top: 16px; position: relative;
            }

            .title {
              font-size: 12px; color: var(--color-font-3, #9e9e9e); text-shadow: 1px 1px 24px #ffffff;
              padding: 0 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 26px;
            }
          `;
          const html = `<style>${styles}</style><div class="title">快速导航</div><slot></slot>`;
          sanitizer.setInnerHTML(this.shadowRoot, html);
        }
      }
      customElements.define(this.#componentContainerTag, MenuContainer);
    }

    if (!customElements.get(this.#componentItemTag)) {
      class MenuItem extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          try {
            const rawTopic = this.getAttribute("data-topic");
            const rawBg = this.getAttribute("data-bg");
            if (!rawTopic || !rawBg) return;

            const topic = JSON.parse(rawTopic.replaceAll("&quot;", '"'));
            const bg = JSON.parse(rawBg.replaceAll("&quot;", '"'));
            const animationDelay = this.getAttribute("animation-delay") || "0s";
            const bgColor = {
              start: bg.start || "#736E7D",
              end: bg.end || "#1B2025",
            };

            const styles = `
              @keyframes fadeInSlideUp {
                from { opacity: 0; transform: translateY(10px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              :host { display: block; }
              .link {
                display: flex; align-items: center; padding: 8px 10px; margin: 0 4px;
                border-radius: 8px; text-decoration: none; color: #f0f0f0;
                background: linear-gradient(135deg, ${bgColor.start}, ${bgColor.end});
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative; overflow: hidden; opacity: 0;
                animation: fadeInSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                animation-delay: ${animationDelay};
              }
              .link:hover {
                transform: translateY(-2px) scale(1.02);
                box-shadow: 0 6px 20px rgba(0,0,0,0.25);
                filter: brightness(1.1);
              }
              .link::after {
                  content: ''; position: absolute; top: 50%; left: 50%;
                  width: 200%; padding-bottom: 200%; border-radius: 50%;
                  background-image: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%);
                  transform: translate(-50%, -50%) scale(0);
                  transition: transform 0.4s ease-out;
              }
              .link:hover::after { transform: translate(-50%, -50%) scale(1); }
              .icon {
                width: 28px; height: 28px; border-radius: 50%;
                margin-right: 12px; flex-shrink: 0; object-fit: cover;
                border: 2px solid rgba(255,255,255,0.3);
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
              }
              .name {
                font-weight: 500; font-size: 14px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
              }
            `;
            const html = `
              <style>${styles}</style>
              <a href="/app/topic/link/${topic.topic_id}" class="link">
                <img class="icon" src="${topic.pic_url}" alt="${topic.name}">
                <span class="name">${topic.name}</span>
              </a>
            `;
            sanitizer.setInnerHTML(this.shadowRoot, html);
          } catch (e) {
            this._logger.error(
              "[Caliber] Failed to render custom menu item:",
              e
            );
            this.shadowRoot.innerHTML = `<div style="color: red; font-size: 10px; padding: 4px;">Render Error</div>`;
          }
        }
      }
      customElements.define(this.#componentItemTag, MenuItem);
    }
  }
}

/**
 * 移动端浏览
 */
class ResponsiveBrowserModule extends Caliber.Module {
  id = "responsiveBrowser";
  name = "小黑盒移动端浏览";
  description =
    "部分链接打开的页面没有pc适配，自动切换成移动端浏览模式，方便浏览WIKI、游戏等内容。";
  match = ["/wiki", "/game", "/tools", "/activity", "/mall"];
  defaultConfig = {
    enabled: true,
  };

  #phoneWidth = "430px";
  #tabletWidth = "80vw";
  #phoneHeight = "90vh";
  #screenRadius = "30px";
  #phoneBodyColor = "#1c1c1e";
  #backgroundColor = "#f0f2f5";

  #styleId = "caliber-responsive-browser-style";
  #originalTitle = "";
  #elements = {};
  #eventHandlers = {};
  #pipWindow = null;

  #cssToInjectInIframe = `
    *::-webkit-scrollbar { width: 8px; height: 8px; }
    *::-webkit-scrollbar-track { background: transparent; }
    *::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.25); border-radius: 10px;
        border: 2px solid transparent; background-clip: content-box;
    }
    *::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.4); background-clip: content-box;
    }
    html .hb-share-header, html .hb-qrc { display: none !important; }
    body.share, html #app>.container,html #app > .static-color-header { padding-top: 0 !important; margin-top: 0 !important; }
    body.sticky.share .cpt-tag-nav.fixed { top: 0 !important; }
    html .cpt-nav { padding: 6px 0 !important; max-height: 40px !important; }
    html .cpt-nav > .logo-icon { margin-bottom: 0 !important; }
    html .cpt-nav + .header-container { padding-top: 18px !important; }
    html .cpt-nav + .header-container + .sticky-box { top: 28px !important; }
    html #app > .fixed-nav { height:auto; }
    html #app > .hb-page-nav, html #app > .hb-page-nav .base-wrapper { height:40px !important; padding-bottom: 0; }
    html #app > .rat-gold-luck .rat-gold-luck-header-title { padding-top: 40px !important; }
    html #app > .rat-gold-luck .sound-switch-container, html #app .container .page-tab-container { top: 40px !important; }
    html #app > .hb-page-nav > .nav-inner { background-color: rgb(0, 0, 0) }
  `;

  onEnable() {
    this._logger.log(
      `Module '${this.id}' activated. Taking over page rendering.`
    );

    this.#originalTitle = this._hostDocument.title || "小黑盒移动端模拟浏览";

    if (this._hostWindow.matchMedia("(prefers-color-scheme: dark)").matches) {
      this.#backgroundColor = "#444c5e";
    }

    this._hostWindow.stop();
    this._hostDocument.documentElement.innerHTML = `
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${this.#originalTitle}</title>
      </head>
      <body></body>
    `;

    this.#createDOMElements();
    this.#bindEventHandlers();
    this.#injectMainStyles();
    this._hostDocument.body.appendChild(this.#elements.mainWrapper);

    this.#elements.iframe.src = this._hostWindow.location.href;
  }

  onDisable() {
    this._hostWindow.location.reload();
  }

  #jsToInjectInIframe = `
  console.log('Started.');  
  
  const proxiedFunctions = new WeakMap();

  const NAVIGATION_RULES = [
    {
      type: 'data',
      check: (vm) => vm.cardData?.tier_list_id && vm.cardData?.heybox_info?.userid && vm.cardData?.user_tier_id,
      getUrl: (vm) => \`/tools/rank_collection/rank_maker?tier_list_id=\${vm.cardData.tier_list_id}&heybox_id=\${vm.cardData.heybox_info.userid}&user_tier_id=\${vm.cardData.user_tier_id}\`
    },
    {
      type: 'data',
      check: (vm) => vm.item?.link_id,
      getUrl: (vm) => \`/app/bbs/link/\${vm.item.link_id}\`
    },
    {
      type: 'data',
      check: (vm) => vm.archive?.link_id && vm.steam_id,
      getUrl: (vm) => \`/tools/archive_square/archive_detail?link_id=\${vm.archive.link_id}&steam_id=\${vm.steam_id}\`
    },  
    {
      type: 'data',
      check: (vm) => vm.team?.link_id && vm.team?.app_id,
      getUrl: (vm) => \`/tools/team_v3/detail?link_id=\${vm.team.link_id}&appid=\${vm.team.app_id}&auto_join=0\`
    },
    {
      type: 'data',
      check: (vm) => vm.skill?.id && vm.tree?.tree_id && vm.blockInfo?.block_id,
      getUrl: (vm) => \`/game/black_myth_wukong/skill_database/detail?skill_id=\${vm.skill.id}&tree_id=\${vm.tree.tree_id}&block_id=\${vm.blockInfo.block_id}\`
    },
    {
      type: 'method',
      methodName: 'jumpHome',
      getUrl: (args) => args[0] === 'square' ? "/tools/archive_square/home" : null
    },
    {
      type: 'dom',
      textContains: '前往修行模拟',
      selector: '.jump-label',
      getUrl: (element) => '/game/black_myth_wukong/skill_simulator'
    },
    {
      type: 'dom',
      textContains: '前往技能图鉴',
      selector: '.jump-label',
      getUrl: (element) => '/game/black_myth_wukong/skill_database/home'
    },
    {
      type: 'data',
      selector: '.face-item',
      check: (vm) => vm.face?.link_info?.link_id,
      getUrl: (vm) => \`/app/bbs/link/\${vm.face.link_info.link_id}\`
    },    
    // {
    //   type: 'dom',
    //   selector: 'div.team-item div.team-card > div.card-content',
    //   check: (vm) => vm.link_id && vm.app_id,
    //   getUrl: (vm) => \`/game/common_team_v2/detail_page?link_id=\${vm.link_id}&appid=\${vm.app_id}&auto_join=0\`
    // },
  ];

  function performNavigation(url, event) {
    if (!url) return false;
    event.preventDefault();
    event.stopPropagation();
    setTimeout(() => {
      window.location.href = url;
    }, 0);
    return true;
  }

  function processInteraction(target) {
    for (const rule of NAVIGATION_RULES) {
      if (rule.type === 'dom') {
        const hasSelector = !!rule.selector;
        const hasText = !!rule.textContains;
        if (!hasSelector && !hasText) continue;
        const matchingElement = hasSelector ? target.closest(rule.selector) : target;
        if (matchingElement) {
          const textMatch = !hasText || matchingElement.textContent.includes(rule.textContains);
          if (textMatch) {
            const url = rule.getUrl(matchingElement);
            if (performNavigation(url, event)) return;
          }
        }
      }
    }

    const vmsToProcess = [];
    let currentTarget = target;
    while (currentTarget) {
      if (currentTarget.__vue__) {
        if (!vmsToProcess.includes(currentTarget.__vue__)) {
          vmsToProcess.push(currentTarget.__vue__);
        }
      }
      currentTarget = currentTarget.parentElement;
    }

    if (vmsToProcess.length > 0) {
      const proxyVm = new Proxy({}, {
        get(target, prop) {
          for (const vm of vmsToProcess) {
            if (prop in vm) {
              return vm[prop];
            }
          }
          return undefined;
        }
      });

      for (const rule of NAVIGATION_RULES) {
        if (rule.type === 'data') {
          if (rule.selector && !target.closest(rule.selector)) continue;
          if (rule.check(proxyVm)) {
            const url = rule.getUrl(proxyVm);
            if (performNavigation(url, event)) return;
          }
        }
      }

      for (const rule of NAVIGATION_RULES) {
        if (rule.type === 'method') {
          for (const vm of vmsToProcess) {
            if (typeof vm[rule.methodName] === 'function') {
              const originalFunc = vm[rule.methodName];
              if (proxiedFunctions.has(originalFunc)) continue;
              const newFunc = function (...args) {
                const url = rule.getUrl(args);
                if (performNavigation(url, event)) return;
                return originalFunc.apply(this, args);
              };
              vm[rule.methodName] = newFunc;
              proxiedFunctions.set(originalFunc, newFunc);
            }
          }
        }
      }
    }
  }

  document.body.addEventListener('click', function (event) {
    processInteraction(event.target)
  }, true);
`;

  #injectJsInIframe(iframeDocument) {
    if (!this.#jsToInjectInIframe) return;
    this._sanitizer.injectScript(iframeDocument, this.#jsToInjectInIframe);
  }

  #createDOMElements() {
    this.#elements.mainWrapper = this._hostDocument.createElement("div");
    this.#elements.mainWrapper.id = "main-wrapper";

    this.#elements.controlsContainer = this._hostDocument.createElement("div");
    this.#elements.controlsContainer.id = "controls-container";

    this.#elements.toggleSwitch = this._hostDocument.createElement("div");
    this.#elements.toggleSwitch.id = "device-toggle-switch";
    this.#elements.toggleSwitch.title = "切换手机/平板视图";
    this.#elements.toggleSwitch.innerHTML = `
        <span class="label label-tablet">平板</span>
        <span class="label label-phone">手机</span>
        <div class="switch-thumb"></div>
    `;

    this.#elements.pipButton = this._hostDocument.createElement("div");
    this.#elements.pipButton.id = "pip-button";
    this.#elements.pipButton.title = "窗口模式";
    this.#elements.pipButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6m5 0h5v5m-6-4 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    this.#elements.phoneContainer = this._hostDocument.createElement("div");
    this.#elements.phoneContainer.id = "mobile-view-container";

    this.#elements.phoneHeader = this._hostDocument.createElement("div");
    this.#elements.phoneHeader.id = "phone-header";

    this.#elements.backButton = this._hostDocument.createElement("div");
    this.#elements.backButton.id = "back-button";
    this.#elements.backButton.title = "返回";
    this.#elements.backButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    this.#elements.phoneTitle = this._hostDocument.createElement("div");
    this.#elements.phoneTitle.id = "phone-title";
    this.#elements.phoneTitle.textContent = this.#originalTitle;

    this.#elements.iframe = this._hostDocument.createElement("iframe");
    this.#elements.iframe.id = "mobile-view-iframe";

    this.#elements.phoneHeader.appendChild(this.#elements.backButton);
    this.#elements.phoneHeader.appendChild(this.#elements.phoneTitle);
    this.#elements.phoneHeader.appendChild(
      this._hostDocument.createElement("div")
    );

    this.#elements.phoneContainer.appendChild(this.#elements.phoneHeader);
    this.#elements.phoneContainer.appendChild(this.#elements.iframe);

    this.#elements.controlsContainer.appendChild(this.#elements.toggleSwitch);
    this.#elements.controlsContainer.appendChild(this.#elements.pipButton);
    this.#elements.mainWrapper.appendChild(this.#elements.controlsContainer);
    this.#elements.mainWrapper.appendChild(this.#elements.phoneContainer);
  }

  #bindEventHandlers() {
    this.#eventHandlers.onToggleClick = () => {
      this.#elements.phoneContainer.classList.toggle("is-tablet-mode");
      this.#elements.toggleSwitch.classList.toggle("is-tablet-mode");
    };

    this.#eventHandlers.onBackClick = () => {
      this._hostWindow.history.back();
    };

    this.#eventHandlers.onPipClick = () => {
      this.#openPipWindow();
    };

    this.#eventHandlers.onIframeLoad = () => {
      try {
        const iDoc =
          this.#elements.iframe.contentDocument ||
          this.#elements.iframe.contentWindow.document;
        const styleElement = iDoc.createElement("style");
        styleElement.textContent = this.#cssToInjectInIframe;
        iDoc.head.appendChild(styleElement);
        this.#injectJsInIframe(iDoc);
        if (iDoc.title) {
          this.#elements.phoneTitle.textContent = iDoc.title;
        }
      } catch (e) {
        this._logger.error(
          "Failed to inject CSS into iframe (likely cross-origin sandbox restrictions):",
          e
        );
      }
    };

    this.#elements.toggleSwitch.addEventListener(
      "click",
      this.#eventHandlers.onToggleClick
    );
    this.#elements.backButton.addEventListener(
      "click",
      this.#eventHandlers.onBackClick
    );
    this.#elements.iframe.addEventListener(
      "load",
      this.#eventHandlers.onIframeLoad
    );
    this.#elements.pipButton.addEventListener(
      "click",
      this.#eventHandlers.onPipClick
    );
  }

  async #openPipWindow() {
    if (this.#pipWindow) {
      this.#pipWindow.focus();
      return;
    }

    let currentUrl;
    try {
      currentUrl = this.#elements.iframe.contentWindow.location.href;
    } catch (error) {
      currentUrl = this._hostWindow.location.href;
    }

    try {
      const pipWindow =
        await this._hostWindow.documentPictureInPicture.requestWindow({
          width: 430,
          height: 850,
        });

      this.#pipWindow = pipWindow;
      const iframe = pipWindow.document.createElement("iframe");
      iframe.src = currentUrl;
      iframe.style.cssText =
        "width: 100%; height: 100%; border: none; flex-grow: 1;";

      pipWindow.document.body.append(iframe);
      pipWindow.document.documentElement.style.height = "100%";
      pipWindow.document.body.style.height = "100%";
      pipWindow.document.body.style.margin = "0";
      pipWindow.document.body.style.overflow = "hidden";

      pipWindow.addEventListener("pagehide", () => {
        this._logger.log("Picture-in-Picture window closed.");
        this.#pipWindow = null;
      });
    } catch (error) {
      this._logger.error("Failed to open Picture-in-Picture window:", error);
    }
  }

  #injectMainStyles() {
    const mainCss = `
        html { overflow: hidden !important; }
        body {
            background-color: ${this.#backgroundColor} !important;
            margin: 0 !important; padding: 0 !important;
            display: flex !important; justify-content: center !important;
            align-items: center !important; height: 100vh !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        #main-wrapper {
            display: flex; flex-direction: column; align-items: center; gap: 20px;
        }
        #controls-container {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        #device-toggle-switch {
            position: relative; width: 90px; height: 34px; border-radius: 17px;
            background-color: ${this.#backgroundColor};
            box-shadow: inset 2px 2px 4px #d0d0d0, inset -2px -2px 4px #ffffff;
            cursor: pointer; user-select: none; display: flex;
            align-items: center; justify-content: space-between;
            padding: 0 14px; box-sizing: border-box;
        }
        #pip-button {
            width: 34px; height: 34px; border-radius: 50%;
            background-color: ${this.#backgroundColor};
            box-shadow: 2px 2px 4px #c8c8c8, -2px -2px 4px #ffffff;
            cursor: pointer; user-select: none;
            display: flex; align-items: center; justify-content: center;
            transition: box-shadow 0.2s ease-in-out;
        }
        #pip-button:hover {
            box-shadow: 1px 1px 2px #c8c8c8, -1px -1px 2px #ffffff;
        }
        #pip-button:active {
            box-shadow: inset 1px 1px 2px #c8c8c8, inset -1px -1px 2px #ffffff;
        }
        #pip-button svg {
            width: 18px; height: 18px; color: #555555;
        }
        .label { font-size: 12px; font-weight: 500; color: #555555; }
        .switch-thumb {
            position: absolute; top: 3px; left: 3px; width: 44px; height: 28px;
            border-radius: 14px; background: linear-gradient(145deg, #fdfdfd, #e6e6e6);
            box-shadow: 2px 2px 4px #c8c8c8, -2px -2px 4px #ffffff;
            transition: transform 0.35s cubic-bezier(0.65, 0, 0.35, 1);
        }
        #device-toggle-switch.is-tablet-mode .switch-thumb { transform: translateX(40px); }
        #mobile-view-container {
            position: relative; width: ${this.#phoneWidth}; height: ${
      this.#phoneHeight
    }; max-height: 960px;
            background: ${this.#phoneBodyColor};
            border: 3px solid #4a4a4a; border-radius: 40px;
            box-shadow: 0 15px 40px -10px rgba(0,0,0,0.6), inset 0 2px 3px rgba(255,255,255,0.1);
            padding: 12px; box-sizing: border-box; display: flex;
            flex-direction: column; gap: 10px;
            transition: width 0.4s ease-in-out;
        }
        #phone-header {
            display: flex; justify-content: space-between; align-items: center;
            height: 30px; flex-shrink: 0; color: #e0e0e0;
        }
        #back-button {
            width: 30px; height: 30px; cursor: pointer; display: flex;
            align-items: center; justify-content: center;
        }
        #back-button svg { width: 22px; height: 22px; }
        #phone-title {
            flex-grow: 1; text-align: center; white-space: nowrap;
            overflow: hidden; text-overflow: ellipsis; font-weight: 600; font-size: 15px;
        }
        #phone-header > div:last-child { width: 30px; }
        #mobile-view-container.is-tablet-mode { width: ${this.#tabletWidth}; }
        #mobile-view-iframe {
            width: 100%; height: 100%; flex-grow: 1;
            border: none; border-radius: ${this.#screenRadius};
            background: #fff;
        }
    `;
    this._services.style.add(mainCss, this.#styleId);
  }
}

/**
 * Google Analytics 拦截模块
 */
class AnalyticsBlockerModule extends Caliber.Module {
  id = "analyticsBlocker";
  name = "Google Analytics追踪拦截";
  description = "如果不想把你的访问数据发送给Google Analytics，就开启它吧。";
  defaultConfig = {
    enabled: false,
  };

  onEnable() {
    const injectionCode = `window._gaUserPrefs = { ioo: () => true };`;
    this._sanitizer.injectScript(this._hostDocument, injectionCode);
  }

  onDisable() {
    const cleanupCode = `try { delete window._gaUserPrefs; } catch (e) { window._gaUserPrefs = undefined; }`;
    this._sanitizer.injectScript(this._hostDocument, cleanupCode);
  }
}

/**
 * 窗口模式模块
 */
class ZenModeModule extends Caliber.Module {
  id = "zenMode";
  name = "窗口模式 (Beta)";
  description =
    "在右上角个人菜单中添加“窗口模式”按钮。该功能是实验性功能，可能会有问题。";
  defaultConfig = {
    enabled: false,
  };

  uiGuard = {
    target: "div.view-header__user-box div.user-box__pull-list",
    component: "#caliber-zen-mode-btn",
  };

  #pipWindow = null;

  onRender(targetElement) {
    const button = this._hostDocument.createElement("button");
    button.id = this.uiGuard.component.substring(1);
    button.textContent = "窗口模式 (Beta)";
    button.className = "user-box__btn";

    // 是否支持此实验性功能
    if ("documentPictureInPicture" in this._hostWindow) {
      button.addEventListener("click", this.#handleClick);
    }

    targetElement.prepend(button);
  }

  onCleanup() {
    const button = this._hostDocument.querySelector(this.uiGuard.component);
    if (button) {
      button.remove();
    }
  }

  #handleClick = async () => {
    if (this.#pipWindow) {
      try {
        this.#pipWindow.focus();
        return;
      } catch (e) {}
    }

    const currentUrl = this._hostWindow.location.href;
    this._logger.log("Requesting Picture-in-Picture window...");

    try {
      const pipWindow =
        await this._hostWindow.documentPictureInPicture.requestWindow({
          width: 430,
          height: 850,
        });

      this.#pipWindow = pipWindow;

      const ZEN_MODE_IFRAME_FLAG = "CALIBER_ZEN_MODE_IFRAME";
      const iframe = pipWindow.document.createElement("iframe");
      iframe.src = currentUrl;
      iframe.name = ZEN_MODE_IFRAME_FLAG;
      iframe.style.cssText =
        "width: 100%; height: 100%; border: none; flex-grow: 1;";

      pipWindow.document.body.append(iframe);
      pipWindow.document.documentElement.style.height = "100%";
      pipWindow.document.body.style.height = "100%";
      pipWindow.document.body.style.margin = "0";
      pipWindow.document.body.style.overflow = "hidden";

      pipWindow.addEventListener("pagehide", () => {
        this._logger.log("Picture-in-Picture window closed.");
        this.#pipWindow = null;
      });
    } catch (error) {
      this._logger.error("Failed to open Picture-in-Picture window:", error);
    }
  };
}

/**
 * 页面个性化模块
 */
class ThemeEnhancerModule extends Caliber.Module {
  id = "themeEnhancer";
  name = "页面个性化(Beta)";
  description =
    "为网站提供简单的个性化样式。未做适配，会有一些样式兼容性问题。应避免和夜间模式同时使用。";
  defaultConfig = {
    enabled: false,
    enableThemeOverrides: {
      label: "启用主题色彩与效果",
      type: "boolean",
      value: true,
      description: "控制下方所有颜色、透明度、磨砂玻璃效果的开关。",
    },
    primaryColor: {
      label: "主题色",
      type: "color",
      value: "#FFF",
      description:
        "选择一个您喜欢的主题色，它将影响链接、按钮等元素的颜色。浅色效果更好。",
      indentLevel: 1,
    },
    backgroundOpacity: {
      label: "背景透明度",
      type: "number",
      value: 85,
      inputProps: {
        min: 0,
        max: 100,
        step: 1,
      },
      description: "设置部分背景元素的透明度 (0-100)。值越小越透明。",
      indentLevel: 1,
    },
    frostedGlassBlur: {
      label: "磨砂玻璃模糊度",
      type: "number",
      value: 6,
      description:
        "设置磨砂玻璃效果的模糊半径。设置为 0 则禁用此效果。开启此效果可能会导致页面闪烁以及部分布局异常。",
      inputProps: {
        min: 0,
        max: 50,
        step: 1,
      },
      indentLevel: 1,
    },
    backgroundImageUrl: {
      label: "背景图片地址",
      type: "string",
      value: "",
      description:
        "输入一张在线图片的URL地址，为页面设置自定义背景，留空则不使用。建议把图片上传第三方图床使用。",
      divider: "top",
      inputProps: { placeholder: "https://example.com/image.png" },
    },
  };

  #styleId = "caliber-theme-enhancer-style";
  #themeClass = "theme-enhanced";

  onEnable() {
    this._logger.log(`Module '${this.id}' enabled. Applying initial styles.`);
    this.#applyStyles();
  }

  onDisable() {
    this._logger.log(`Module '${this.id}' disabled. Cleaning up styles.`);
    this.#cleanupStyles();
  }

  onConfigChange(key, newValue, oldValue) {
    this._logger.log(`Theme config '${key}' changed. Re-applying styles.`);
    this.#applyStyles();
  }

  #applyStyles() {
    const dynamicCss = this.#generateDynamicCss();
    if (dynamicCss) {
      this._services.style.add(dynamicCss, this.#styleId);
      this._hostDocument.documentElement.classList.add(this.#themeClass);
    } else {
      this.#cleanupStyles();
    }
  }

  #cleanupStyles() {
    this._services.style.remove(this.#styleId);
    this._hostDocument.documentElement.classList.remove(this.#themeClass);
  }

  #generateDynamicCss() {
    const {
      enableThemeOverrides,
      primaryColor,
      backgroundOpacity,
      frostedGlassBlur,
      backgroundImageUrl,
    } = this._config;

    let finalCssParts = [];

    if (enableThemeOverrides) {
      const lighterHighlightColor = this.#adjustHexColorBrightness(
        primaryColor,
        15,
        backgroundOpacity
      );
      const darkerHighlightColor = this.#adjustHexColorBrightness(
        primaryColor,
        -5,
        backgroundOpacity
      );
      const darkerHighlightColor2 = this.#adjustHexColorBrightness(
        primaryColor,
        -15,
        backgroundOpacity
      );
      const primaryColorRgba = this.#hexToRgbaValues(
        primaryColor,
        backgroundOpacity
      );
      const primaryFontColor = this.#adjustHexColorBrightness(
        primaryColor,
        -75,
        backgroundOpacity
      );

      const cssVariables = `
        --color-primary-white--value: ${primaryColorRgba};
        --color-background-1: ${darkerHighlightColor2};
        --color-border-3: ${lighterHighlightColor};
        --color-background-3: ${lighterHighlightColor};
        --color-background-2: rgba(${primaryColorRgba});
        --color-font-4: ${primaryFontColor};
        --color-primary-black :${primaryFontColor};

        .game-detail-section-data .game-info,
        .game-detail-section-data .game-data .row-3 .data-list .data-item,
        .hb-cpt__loading.circle,
        .game-detail-page-topic .page-topic-header,
        .game-detail-section-footer,
        .game-detail-section-data .game-data,
        .hb-cpt-login-mask .hb-cpt-login .left-box,
        .phone-login-wrapper,
        .hb-cpt__link-game-card{
          background-color: var(--color-background-3);
        }
        .game-detail-comment-item:after {
          background-color: ${darkerHighlightColor};
        }
        .game-detail-comment-item .tools .item,
        .hb-game-comment .game-comment__content .game-comment__content-tools .item,
        .game-detail-section-data .game-data .btn-see-all,
        .game-detail-section-data .game-info .hardware-performance {
          background-color: var(--color-background-1);
        }
        .game-detail-section-comment,
        .game-detail-section-score {
          border-top-color: ${darkerHighlightColor};
        }
        .game-detail-comment-item .description .btn-all{
            background-color: var(--color-background-1);
            color: var(--color-primary-black);
            &::after{
              background: linear-gradient(270deg, var(--color-background-1), transparent);
            }
        }
        .hb-cpt__slide-tab {
          background-color: transparent;
        }
        .game-detail-page-topic .page-topic-header {
          postion: relative;
          &::before,&::after {
            content: '';
            position: absolute;
            top: 0;
            background-color: var(--color-background-3);
            width: 16px;
            height: 100%;
          }
          &::before{ left: -16px; }
          &::after{ right: -16px; }
        }
        .hb-cpt__pagination .hb-cpt__pagination--right {
          background: linear-gradient(270deg, rgba(${primaryColorRgba}) 0, rgba(${primaryColorRgba}) 50%, #fff0);
          border-radius: 0 12px 12px 0;
        }
        .hb-cpt__pagination .hb-cpt__pagination--left {
          background: linear-gradient(90deg, rgba(${primaryColorRgba}) 0, rgba(${primaryColorRgba}) 50%, #fff0);
          border-radius: 12px 0 0 12px;
        }
      `;

      finalCssParts.push(cssVariables);

      if (frostedGlassBlur > 0) {
        const frostedGlassCss = `
          .hb-view-header,
          .search__pull-list,
          .view-header__right .view-header__user-box .user-box__pull-list .user-box__btn,
          .hb-cpt__scroll-list,
          .link-reply,
          .hb-cpt__recent-hot-topic,
          .bbs-link__related-recommend,
          .hb-view-catalog,
          .hb-cpt-page-header
          {
            backdrop-filter: blur(${frostedGlassBlur}px) saturate(2.5);
            -webkit-backdrop-filter: blur(${frostedGlassBlur}px) saturate(2.5);
          }

          .hb-cpt__scroll-list .scroll-list__button-group {
            transform: translateZ(0) translateX(calc(50vw - 200px)) translateY(100%);
          }
          @media (max-width: 640px) {
            .hb-cpt__scroll-list .scroll-list__button-group {
              display: none !important;
            }
          }
        `;
        finalCssParts.push(frostedGlassCss);
      }
    }

    if (
      backgroundImageUrl &&
      typeof backgroundImageUrl === "string" &&
      backgroundImageUrl.trim() !== ""
    ) {
      const sanitizedUrl = backgroundImageUrl.trim();
      const backgroundCss = `
        & body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          background-image: url("${sanitizedUrl}");
          background-blend-mode: screen;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          background-attachment: scroll;
        }
      `;
      finalCssParts.push(backgroundCss);
    }

    if (finalCssParts.length === 0) {
      return "";
    }

    const defaultCss = `
      .hb-bbs-home .bbs-home__topic-list-wrapper.hb-bbs-home__splitline::after{
        background-color: transparent;
      }
      .hb-layout__fake-frame-left--top svg,
      .hb-layout__fake-frame-left--bottom svg {
        display: none !important;
      }
      .game-detail-comment-item:after {
        left: 0;
        width: 100%;
      }
    `;

    finalCssParts.push(defaultCss);

    return `
      html.${this.#themeClass} {
        ${finalCssParts.join("\n")}
      }
    `;
  }

  /**
   * 将HEX颜色转换为RGBA格式字符串
   * @param {string} hexColor - HEX颜色
   * @param {number} opacity - 透明度百分比 (0-100)
   * @param {number} opacityOffset - 透明度偏移量
   * @returns {string} "R, G, B, A" 格式字符串
   */
  #hexToRgbaValues(hexColor, opacity, opacityOffset = 0) {
    const finalOpacity = Math.max(0, Math.min(100, opacity + opacityOffset));
    const alpha = (finalOpacity / 100).toFixed(2);

    let hex = hexColor.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `${r}, ${g}, ${b}, ${alpha}`;
  }

  /**
   * 调整HEX颜色的亮度并可选择添加透明度
   * @param {string} hexColor - 原始HEX颜色，支持3位或6位格式
   * @param {number} percent - 调整百分比，正数变亮，负数变暗
   * @param {number} [alpha=100] - 透明度值，0-100之间，100为完全不透明
   * @returns {string} 调整后的HEX颜色，含透明度（如果alpha<1）
   */
  #adjustHexColorBrightness(hexColor, percent, alpha = 100) {
    // 验证输入
    if (!hexColor || typeof hexColor !== "string") {
      throw new Error("hexColor必须是一个非空字符串");
    }

    // 规范化HEX颜色（去除#，扩展3位缩写）
    let hex = hexColor.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (!/^[0-9A-F]{6}$/i.test(hex)) {
      throw new Error("无效的HEX颜色格式");
    }

    // 解析RGB值
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // 转换为HSL
    const [h, s, l] = this.#rgbToHsl(r, g, b);

    // 调整亮度
    const adjustedL = Math.max(0, Math.min(1, l + (l * percent) / 100));

    // 转换回RGB
    const [r2, g2, b2] = this.#hslToRgb(h, s, adjustedL);

    // 转换为HEX
    const toHex = (value) => {
      const hex = Math.round(value).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    const hexResult = `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;

    if (alpha < 100) {
      const alphaHex = Math.round((alpha / 100) * 255)
        .toString(16)
        .padStart(2, "0");
      return hexResult + alphaHex;
    }

    return hexResult;
  }

  /**
   * 将RGB颜色转换为HSL
   */
  #rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // 无色相
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h, s, l];
  }

  /**
   * 将HSL颜色转换为RGB
   */
  #hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // 灰色
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
  }
}

/**
 * 禁止视频自动播放模块
 */
class NoAutoplayModule extends Caliber.Module {
  id = "noVideoAutoplay";
  name = "禁止视频自动播放";
  match = "/app/bbs/link";
  description = "bbs帖子中视频默认暂停播放，需要手动点击播放按钮才能开始播放。";
  defaultConfig = { enabled: false };
  _taskId = null;
  _payload = `
    (() => {
      const K = '__CALIBER_NAP__';
      if(window[K]) { window[K].on = true; return; }
      
      const s = window[K] = { on: true, raw: HTMLMediaElement.prototype.play, t: 0 };
      ['mousedown','keydown','touchstart','pointerdown','click'].forEach(e => 
        window.addEventListener(e, () => s.on && (s.t = Date.now()), true)
      );

      HTMLMediaElement.prototype.play = function() {
        if (!s.on || (Date.now() - s.t < 500) || this.dataset.ok) {
          this.dataset.ok = '1';
          return s.raw.apply(this, arguments);
        }
        this.pause();
        return Promise.reject(new DOMException('Blocked', 'NotAllowedError'));
      };
    })();
  `;

  onEnable() {
    this._sanitizer.injectScript(this._hostDocument, this._payload);
    this._taskId = this._scheduler.register(
      "video",
      (v) => {
        v.removeAttribute("autoplay");
        v.pause();
      },
      { processExisting: true, root: this._hostDocument }
    );
  }

  onDisable() {
    this._executor.execute(
      "if(window.__CALIBER_NAP__) window.__CALIBER_NAP__.on = false"
    );

    if (this._taskId) this._scheduler.unregister(this._taskId);
  }
}
// #endregion

// #region ================================ 应用启动区 (Application Bootstrap) ==========================

(function () {
  "use strict";

  const ZEN_MODE_IFRAME_FLAG = "CALIBER_ZEN_MODE_IFRAME";
  if (window.self !== window.top && window.name !== ZEN_MODE_IFRAME_FLAG) {
    return;
  }

  const tampermonkeyStorageAdapter = (storageKey) => ({
    get: () => GM.getValue(storageKey, {}),
    set: (value) => GM.setValue(storageKey, value),
  });

  const tampermonkeyCommandAdapter = {
    register: (name, callback) => GM.registerMenuCommand(name, callback),
  };

  const tampermonkeyStyleAdapter = {
    _addedStyles: new Map(),
    async add(cssString, id) {
      try {
        if (this._addedStyles.has(id)) {
          this.remove(id);
        }
        const styleElement = await GM.addStyle(cssString);
        this._addedStyles.set(id, styleElement);
      } catch (e) {
        console.error(
          `[小黑盒Pro StyleAdapter] GM.addStyle failed for id '${id}':`,
          e
        );
      }
    },
    remove(id) {
      if (this._addedStyles.has(id)) {
        const styleElement = this._addedStyles.get(id);
        if (styleElement && typeof styleElement.remove === "function") {
          styleElement.remove();
        } else {
          console.warn(
            `[小黑盒Pro StyleAdapter] Could not remove style '${id}'. The returned object may not be a standard element.`,
            styleElement
          );
        }
        this._addedStyles.delete(id);
      }
    },
  };

  const appOptions = {
    appName: "小黑盒Pro",
    isDebug: false,
    settingsPanelEnabled: true,
    modules: [
      ThemeSwitcherModule,
      BackButtonFixModule,
      NewTabPageModule,
      QuickJumpToCommentsModule,
      SteamDirectLinkModule,
      FeedsEnhancementModule,
      TopicEnhancementModule,
      NoAutoplayModule,
      CustomMenuModule,
      ResponsiveBrowserModule,
      ZenModeModule,
      ThemeEnhancerModule,
      AnalyticsBlockerModule,
    ],
    services: {
      storage: tampermonkeyStorageAdapter("HEYBOX_ENHANCER_CONFIG"),
      command: tampermonkeyCommandAdapter,
      style: tampermonkeyStyleAdapter,
    },
    framework: {
      domProcessorBatchSize: 10,
    },
  };

  // --- 启动应用 ---
  Caliber.createApp(appOptions).catch((error) => {
    console.error(
      `[${appOptions.appName}]: A fatal error occurred during bootstrap.`,
      error
    );
  });
})();

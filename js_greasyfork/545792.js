// ==UserScript==
// @name         Caliber.js Framework Library
// @namespace    You Boy
// @version      1.1.0
// @description  一个旨在帮助开发者快速构建功能强大、可维护的现代油猴脚本的框架。它提供模块化架构、自动化的UI设置面板、响应式生命周期管理、高性能DOM调度器与网络请求拦截器等核心功能，让您专注于实现创意，而非繁琐的底层细节。
// @author       You Boy
// @license      MIT
// @grant        none
// ==/UserScript==

((window) => {
  'use strict';

  if (window.Caliber) {
    console.warn('Caliber.js has already been loaded.');
    return;
  }

  const Caliber = (() => {
    'use strict';

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
     * @property {PageScopeExecutorInstance} _executor - (快捷方式) 页面作用域代码执行器
     * @property {FrameworkUtils} _utils - (快捷方式) 框架提供的公共工具函数集合。
     * 
     * @property {(context: {params: object, query: object}) => void} onEnable - 当模块被启用时调用。会收到包含解析后URL参数的上下文对象。
     * @property {() => void} onDisable - 当模块被禁用时调用。必须在此处清理所有副作用。
     * @property {(key: string, newValue: any, oldValue: any) => void} onConfigChange - 当模块的特定配置项发生变化时调用。
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
      id = 'base-module';
      name = 'Base Module';
      description = '';
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
        this._logger.warn(`Module '${this.id}' is missing the 'onEnable' implementation.`);
      }

      onDisable() { }

      /**
       * 当模块的特定配置项发生变化时调用。
       * @param {string} key - 发生变化的配置键。
       * @param {*} newValue - 新的配置值。
       * @param {*} oldValue - 旧的配置值。
       */
      onConfigChange(key, newValue, oldValue) { }

      onRender(targetElement) { }
      onCleanup() { }
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
        this.#services = { hostWindow, hostDocument, eventBus, logger, storage, style, framework, APP_NAME };

        // 使用元数据进行初始化
        if (IS_DEBUG) {
          this.#auditor = new ModuleAuditor(this.#logger, hostWindow, SAFE_APP_NAME);
          this.#auditor?.patchScheduler(framework.scheduler);
        }

        // 实例化核心服务
        this.#uiGuardianService = new UIGuardianService(this.#services, framework._internal_domWatcher);
        this.#configManager = new ConfigManager(storage, logger, initialConfig);
        this.#moduleManager = new ModuleManager(this.#services, this.#auditor, this.#uiGuardianService);
        this.#uiManager = new UIManager(this.#services, this.#uiGuardianService);

        // 将新创建的管理器添加回 #services 包，以便所有模块都能访问它们
        this.#services.configManager = this.#configManager;
        this.#services.moduleManager = this.#moduleManager;

        this.#logger.log('Kernel constructed.');

        this.#services.eventBus.on('command:toggle-settings-panel', this.#handleToggleSettingsPanel);
        this.#services.eventBus.on('config-updated', this.#onConfigUpdated);
      }

      #handleToggleSettingsPanel = async () => {
        const currentConfig = this.#configManager.getConfig();
        if (!currentConfig) {
          this.#logger.error("Cannot toggle settings panel: config not loaded yet.");
          return;
        }
        const newState = !currentConfig.settingsPanel.enabled;
        await this.#configManager.updateAndSave('settingsPanel.enabled', newState);

        this.#services.eventBus.emit('config-updated', {
          path: 'settingsPanel.enabled',
          value: newState,
          newConfig: this.#configManager.getConfig()
        });
      }

      #onConfigUpdated = (detail) => {
        if (detail.path === 'settingsPanel.enabled') {
          this.#logger.log(`Settings Panel visibility changed to: ${detail.value}`);
          if (detail.value) {
            this.#uiManager.showPanelTrigger();
          } else {
            this.#uiManager.hidePanelTrigger();
          }
        }
      }

      /**
       * 启动应用。这是整个应用逻辑的入口点。
       */
      async run() {
        this.#logger.log('Kernel is running...');

        const moduleDefaultConfigs = this.#moduleManager.getAllDefaultConfigs();
        const finalConfig = await this.#configManager.loadAndGetConfig(moduleDefaultConfigs);
        this.#moduleManager.initializeActiveModules(finalConfig);
        this.#uiManager.init(finalConfig);

        this.#logger.log('Kernel run sequence complete.');
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

        this.#logger.log('Configuration loaded, merged, and pruned:', this.#config);
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
        this.#logger.log('Configuration saved.');
      }

      #deepMerge(target, source) {
        const output = { ...target };
        if (this.#isObject(target) && this.#isObject(source)) {
          for (const key in source) {
            const targetValue = target[key];
            const sourceValue = source[key];

            if (this.#isObject(targetValue) && this.#isObject(sourceValue)) {
              output[key] = this.#deepMerge(targetValue, sourceValue);
            }
            else if (this.#isObject(targetValue) && !this.#isObject(sourceValue)) {
              continue;
            }
            else {
              output[key] = sourceValue;
            }
          }
        }
        return output;
      }

      #isObject = (item) => (item && typeof item === 'object' && !Array.isArray(item));

      #set = (obj, path, value) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const finalObj = keys.reduce((o, k) => o[k] = o[k] || {}, obj);
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
              this.#logger.warn(`Configuration type mismatch for key '${key}'. User value (${sourceType}) discarded. Falling back to default (${templateType}).`);
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
        this.#services.eventBus.on('config-updated', this.#onConfigUpdated);
        this.#services.eventBus.on('navigate', this.#onNavigate);
      }

      /**
       * 注册一个模块类。
       * @param {typeof Module} ModuleClass
       */
      register(ModuleClass) {
        if (typeof ModuleClass !== 'function') {
          this.#services.logger.warn(`Attempted to register an invalid value. Expected a class.`, ModuleClass);
          return;
        }

        const tempInstance = new ModuleClass();

        // 校验模块实例是否符合最基本的规范 (必须有 id 和 name)
        const isValidId = tempInstance.id && typeof tempInstance.id === 'string' && tempInstance.id !== 'base-module';
        const hasValidName = tempInstance.name && typeof tempInstance.name === 'string';

        if (!isValidId || !hasValidName) {
          this.#services.logger.warn(`Attempted to register an invalid module. It must have a valid 'id' and 'name' property.`, tempInstance);
          return;
        }

        // 检查 ID 是否重复
        if (this.#registeredModuleClasses.has(tempInstance.id)) {
          this.#services.logger.warn(`Attempt to register module with duplicate ID: '${tempInstance.id}'. Skipping.`);
          return;
        }
        this.#registeredModuleClasses.set(tempInstance.id, ModuleClass);
        this.#services.logger.log(`Module class '${tempInstance.name} (${tempInstance.id})' registered.`);
      }

      /**
       * 根据最终配置，初始化所有应该被激活的模块。
       * @param {object} config - 最终的运行时配置。
       */
      initializeActiveModules(config) {
        this.#services.logger.log('Initializing active modules...');
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
            if (typeof item === 'object' && item !== null && 'value' in item) {
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
          const clonedDefaultConfig = structuredClone(moduleInstance.defaultConfig);

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
      }

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
              this.#services.eventBus.emit('config-updated', {
                path,
                value,
                newConfig: this.#services.configManager.getConfig()
              });
            }
          };

          const moduleServicesFacade = {
            ...this.#services, // 继承所有安全的服务
            configManager: configManagerFacade, // 覆盖为安全的门面
            moduleManager: null, // 彻底隐藏ModuleManager，模块不应该直接操作它
          };

          // 使用安全的门面对象来实例化模块
          const moduleInstance = new ModuleClass(moduleServicesFacade, moduleConfig);

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
          this.#services.logger.error(`Failed to dynamically enable module '${id}'.`, e);
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
          this.#services.logger.error(`Failed to complete full cleanup for module '${id}', but it has been successfully deactivated.`, e);
        }
      }

      /**
       * 在SPA导航时触发，重新评估所有模块的match状态。
       * @private
       */
      #onNavigate = () => {
        this.#services.logger.log('Navigation detected, re-evaluating all module states...');
        const currentConfig = this.#services.configManager.getConfig();
        if (!currentConfig) return;

        for (const id of this.#registeredModuleClasses.keys()) {
          this.#revalidateModuleState(id, currentConfig);
        }
      }

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
        const matchResult = _CaliberInternals._checkMatch(tempInstance.match, this.#services.hostWindow);

        const shouldBeActive = isEnabledInConfig && !!matchResult;
        const isActiveNow = this.#activeModuleInstances.has(id);

        if (shouldBeActive && !isActiveNow) {
          this.#enableModule(id, ModuleClass, config, matchResult);
        } else if (!shouldBeActive && isActiveNow) {
          this.#disableModule(id);
        }
      }
    }

    /**
     * @class UIManager - UI管理器
     * 
     * 负责创建、管理和销毁UI组件，如下方的设置面板。
     */
    class UIManager {
      #appName = 'CaliberApp';
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
        target: 'html',
        component: 'settings-panel'
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
        this.#panelElement = this.#hostDocument.createElement('settings-panel');
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
        if (customElements.get('settings-panel')) return;

        const APP_NAME = this.#appName;

        class SettingsPanel extends HTMLElement {
          constructor() {
            super();
            this.attachShadow({ mode: 'open' });
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
            this.shadowRoot.querySelector('.trigger-btn').addEventListener('click', this._boundOpenPanel);
            this.shadowRoot.querySelector('.overlay').addEventListener('click', this._boundClosePanel);
            this.shadowRoot.querySelector('.drawer-content').addEventListener('change', this.#handleInputChange);
          }

          /**
           * 集中移除所有事件监听器，防止内存泄漏。
           * @private
           */
          #removeEventListeners() {
            const triggerBtn = this.shadowRoot.querySelector('.trigger-btn');
            if (triggerBtn) triggerBtn.removeEventListener('click', this._boundOpenPanel);

            const overlay = this.shadowRoot.querySelector('.overlay');
            if (overlay) overlay.removeEventListener('click', this._boundClosePanel);

            const content = this.shadowRoot.querySelector('.drawer-content');
            if (content) content.removeEventListener('change', this.#handleInputChange);
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
              case 'checkbox': value = target.checked; break;
              case 'number': value = Number(target.value); break;
              case 'text':
              case 'select-one':
              case 'color':
              default: value = target.value; break;
            }
            this.handleConfigChange(path, value);
          }

          openPanel = () => {
            if (this._isOpen) return;
            this.#applyTheme();
            this._isOpen = true;

            this.shadowRoot.querySelector('.drawer').classList.add('open');
            this.shadowRoot.querySelector('.overlay').classList.add('open');
            this.shadowRoot.querySelector('.trigger-btn').classList.add('hidden');
          }

          closePanel = () => {
            if (!this._isOpen) return;
            this._isOpen = false;

            this.shadowRoot.querySelector('.drawer').classList.remove('open');
            this.shadowRoot.querySelector('.overlay').classList.remove('open');
            this.shadowRoot.querySelector('.trigger-btn').classList.remove('hidden');
          }

          handleConfigChange = async (path, value) => {
            await this._configManager.updateAndSave(path, value);

            // 通知所有模块配置已更新
            this._eventBus.emit('config-updated', {
              path,
              value,
              newConfig: this._configManager.getConfig()
            });
          }

          /**
           * 检查系统颜色模式并为面板应用相应的主题。
           * @private
           */
          #applyTheme() {
            const drawer = this.shadowRoot.querySelector('.drawer');
            if (!drawer) return;

            const isSystemDark = this._hostWindow.matchMedia('(prefers-color-scheme: dark)').matches;

            if (isSystemDark) {
              drawer.dataset.theme = 'dark';
            } else {
              drawer.dataset.theme = 'light';
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
            if (!props || typeof props !== 'object') {
              return '';
            }
            return Object.entries(props)
              .map(([key, val]) => `${key}="${String(val).replace(/"/g, '&quot;')}"`)
              .join(' ');
          };

          generateFormHTML() {
            let html = '';

            html += `<div class="form-group info-only"><p class="info-text">所有设置修改后将自动保存，部分设置需刷新页面生效。</p></div>`;

            for (const module of this._modules) {
              const moduleConfig = this._config.modules[module.id];
              if (!moduleConfig) continue;

              const configKeys = Object.keys(module.defaultConfig);
              const nonEnabledConfigKeys = configKeys.filter(key => key !== 'enabled');
              const optionCount = nonEnabledConfigKeys.length;

              html += `<details class="details-wrapper" ${optionCount === 0 ? 'noconfig' : ''}>
                     <summary>`;
              html += `<div class="form-group summary-content">
                     <label class="switch">
                       <input type="checkbox" data-config-path="modules.${module.id}.enabled" data-needs-reload="true">
                       <span class="slider"></span>
                     </label>
                     <div class="form-info">
                       <h4>${module.name}<span>${optionCount === 0 ? "" : " ⚙️"}</span></h4>
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
                  let inputHTML = '';
                  let labelText, controlType, itemDescription, inputProps;

                  if (typeof configItem === 'object' && configItem !== null && 'value' in configItem) {
                    labelText = configItem.label || key;
                    controlType = configItem.type || 'string';
                    itemDescription = configItem.description || '';
                    inputProps = this._generateInputPropsString(configItem.inputProps);
                  } else {
                    labelText = key;
                    controlType = typeof configItem;
                    itemDescription = '';
                    inputProps = '';
                  }

                  switch (controlType) {
                    case 'boolean':
                      inputHTML = `<label class="switch"><input type="checkbox" data-config-path="${path}" ${value ? 'checked' : ''}><span class="slider"></span></label>`;
                      break;
                    case 'number':
                      inputHTML = `<input type="number" class="text-input" data-config-path="${path}" value="${value || 0}" ${inputProps}>`;
                      break;
                    case 'string':
                      inputHTML = `<input type="text" class="text-input" data-config-path="${path}" value="${value || ''}" ${inputProps}>`;
                      break;
                    case 'select':
                      inputHTML = `<select class="text-input" data-config-path="${path}" ${inputProps}>`;
                      if (configItem.options && Array.isArray(configItem.options)) {
                        configItem.options.forEach(option => {
                          const selected = (option.value === value) ? 'selected' : '';
                          inputHTML += `<option value="${option.value}" ${selected}>${option.label || option.value}</option>`;
                        });
                      }
                      inputHTML += `</select>`;
                      break;
                    case 'color':
                      inputHTML = `<input type="color" class="text-input color-input" data-config-path="${path}" value="${value}" ${inputProps}>`;
                      break;
                    default:
                      html += `<div class="form-group sub-item"><span class="sub-item-label">${labelText}</span><p style="color:red;">(不支持的配置类型: ${controlType}，需确保包含label,value,type字段)</p></div>`;
                      continue; // 跳过不支持的类型
                  }

                  let dataAttrs = '';
                  if (typeof configItem.divider === 'string' && configItem.divider) {
                    dataAttrs += ` data-divider="${configItem.divider}"`;
                  }
                  if (typeof configItem.indentLevel === 'number' && configItem.indentLevel > 0) {
                    dataAttrs += ` data-indent-level="${configItem.indentLevel}"`;
                  }

                  html += `
                <div class="form-group sub-item" ${dataAttrs.trim()}>
                  <div class="sub-item-info">
                    <label class="sub-item-label">${labelText}</label>
                    ${inputHTML}
                  </div>
                  ${itemDescription ? `<div class="sub-item-desc"><p>${itemDescription}</p></div>` : ''}
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
            this.shadowRoot.querySelectorAll('[data-config-path]').forEach(input => {
              const path = input.dataset.configPath;
              const keys = path.split('.');

              let value = this._config;
              for (const key of keys) {
                if (value === undefined || value === null) break;
                value = value[key];
              }

              if (value === undefined || value === null) return;

              switch (input.type) {
                case 'checkbox':
                  input.checked = Boolean(value);
                  break;
                case 'number':
                case 'text':
                case 'color':
                case 'select-one':
                  input.value = value;
                  break;
              }
            });
          }
        }

        customElements.define('settings-panel', SettingsPanel);
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
        this.#logger = logger.createTaggedLogger('Watcher', { backgroundColor: '#03A9F4' });
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
            this.#logger.error('Error in a DomWatcher subscriber callback:', e);
          }
        }
      };

      /**
       * 订阅DOM变化。
       * @param {(mutations: MutationRecord[]) => void} callback - 当DOM发生变化时要执行的回调函数。
       * @returns {Symbol} 一个唯一的订阅ID，用于后续的取消订阅。
       */
      subscribe(callback) {
        const id = Symbol('watcher-subscription');
        this.#subscribers.set(id, callback);
        this.#logger.log(`New subscription added. Total: ${this.#subscribers.size}.`);

        // 如果这是第一个订阅者，则启动观察者。
        if (!this.#isObserving && this.#subscribers.size > 0) {
          this.#observer.observe(this.#hostDocument.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
          });
          this.#isObserving = true;
          this.#logger.log('Observer started due to first subscription.');
        }
        return id;
      }

      /**
       * 根据订阅ID取消订阅。
       * @param {Symbol} id - `subscribe` 方法返回的订阅ID。
       */
      unsubscribe(id) {
        if (this.#subscribers.delete(id)) {
          this.#logger.log(`Subscription removed. Total: ${this.#subscribers.size}.`);
          // 如果这是最后一个订阅者，则停止观察者以节省资源。
          if (this.#subscribers.size === 0 && this.#isObserving) {
            this.#observer.disconnect();
            this.#isObserving = false;
            this.#logger.log('Observer stopped as no subscribers are left. Entering sleep mode.');
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
        this.#logger = services.logger.createTaggedLogger('Guardian', { backgroundColor: '#FF6F00' });
      }

      register(moduleInstance) {
        if (!moduleInstance.uiGuard || typeof moduleInstance.onRender !== 'function' || typeof moduleInstance.onCleanup !== 'function') {
          this.#logger.warn('Attempted to register an invalid object for UI guarding.', moduleInstance);
          return;
        }

        this.#registeredModules.add(moduleInstance);
        this.#logger.log(`Module '${moduleInstance.id || 'UIManager'}' registered. Total: ${this.#registeredModules.size}.`);

        this.#checkAndHeal(moduleInstance);

        this.#startService();
      }

      unregister(moduleInstance) {
        if (this.#registeredModules.delete(moduleInstance)) {
          this.#logger.log(`Module '${moduleInstance.id || 'UIManager'}' unregistered. Total: ${this.#registeredModules.size}.`);
          try {
            moduleInstance.onCleanup();
          } catch (e) {
            this.#logger.error(`Error during onCleanup for '${moduleInstance.id || 'UIManager'}':`, e);
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
        this.#logger.log('Guardian service started (Pure Watcher Mode).');
      }

      #stopService() {
        if (!this.#isActive) return;
        this.#isActive = false;
        if (this.#watcherSubscriptionId) {
          this.#watcher.unsubscribe(this.#watcherSubscriptionId);
          this.#watcherSubscriptionId = null;
        }
        this.#logger.log('Guardian service stopped and entered sleep mode.');
      }

      #onDomChange = () => {
        const rIC = this.#services.hostWindow.requestIdleCallback || (cb => setTimeout(cb, 100));
        rIC(() => {
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
        }, { timeout: 500 });
      }

      #checkAndHeal(module) {
        try {
          const target = this.#services.hostDocument.querySelector(module.uiGuard.target);
          if (!target) return false;

          const componentExists = target.querySelector(module.uiGuard.component);
          if (!componentExists) {
            try { module.onCleanup(); } catch (e) { /* pre-cleanup */ }
            module.onRender(target);
            return true;
          }
        } catch (e) {
          this.#logger.error(`Error during checkAndHeal for '${module.id || 'UIManager'}':`, e);
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
        this.#logger = logger.createTaggedLogger('Auditor', { backgroundColor: '#9C27B0' });
        this.#hostWindow = hostWindow;
        this.#patchGlobalApis(SAFE_APP_NAME);
        this.#logger.warn('Module Auditor is active. Resource leakage will be reported.');
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
          const taskId = self.#originalSchedulerRegister.call(this, selector, callback, options);
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

        this.#logger.log('Scheduler has been patched for auditing.');
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
            this.#logger.error(`LEAK DETECTED in module '${moduleId}': Event listener(s) for type(s) [${[...types].join(', ')}] were NOT removed from element:`, target);
          });
        }

        // 检查定时器泄漏
        if (resources.intervals.size > 0) {
          leaksFound += resources.intervals.size;
          resources.intervals.forEach((id) => {
            this.#logger.error(`LEAK DETECTED in module '${moduleId}': A setInterval (ID: ${id}) was NOT cleared.`);
          });
        }

        // 检查调度器任务泄漏
        if (resources.schedulers.size > 0) {
          leaksFound += resources.schedulers.size;
          resources.schedulers.forEach((id) => {
            this.#logger.error(`LEAK DETECTED in module '${moduleId}': A scheduler task (ID: ${id.toString()}) was NOT unregistered.`);
          });
        }

        if (leaksFound === 0) {
          this.#logger.log(`Module '${moduleId}' passed audit. All tracked resources were cleaned up.`);
        }

        this.#trackedResources.delete(moduleId);
      }

      #initializeTracking(moduleId) {
        if (!this.#trackedResources.has(moduleId)) {
          this.#trackedResources.set(moduleId, {
            events: new Map(),
            intervals: new Set(),
            schedulers: new Set()
          });
        }
        return this.#trackedResources.get(moduleId);
      }

      #patchGlobalApis(SAFE_APP_NAME) {
        this.#originalAddEventListener = EventTarget.prototype.addEventListener;
        this.#originalRemoveEventListener = EventTarget.prototype.removeEventListener;
        this.#originalSetInterval = this.#hostWindow.setInterval;
        this.#originalClearInterval = this.#hostWindow.clearInterval;

        const self = this;
        const namespace = `__CALIBER_${SAFE_APP_NAME}`;
        const responseEventName = `${namespace}_RESPONSE`;

        // --- Patch addEventListener ---
        EventTarget.prototype.addEventListener = function (type, listener, options) {
          if (this === self.#hostWindow.document && type === responseEventName) {
            // 直接调用原始方法，不进行任何追踪
            return self.#originalAddEventListener.call(this, type, listener, options);
          }

          if (self.#activeModuleId) {
            const resources = self.#initializeTracking(self.#activeModuleId);
            if (!resources.events.has(this)) {
              resources.events.set(this, new Set());
            }
            resources.events.get(this).add(type);
          }
          return self.#originalAddEventListener.call(this, type, listener, options);
        };

        // --- Patch removeEventListener ---
        EventTarget.prototype.removeEventListener = function (type, listener, options) {
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
          return self.#originalRemoveEventListener.call(this, type, listener, options);
        };

        // --- Patch setInterval ---
        this.#hostWindow.setInterval = function (handler, timeout) {
          const intervalId = self.#originalSetInterval.call(this, handler, timeout);
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
          options: { add: true, ...options } // 默认监听添加事件
        });
        this.#logger.log(`Task registered for selector "${selector}"`, options.root ? `within root "${options.root}"` : '');

        if (options.processExisting) {
          const rootNode = (typeof options.root === 'string'
            ? this.#hostDocument.querySelector(options.root)
            : options.root) || this.#hostDocument;

          // querySelectorAll 在找不到 rootNode 时会抛错，需要保护
          if (rootNode) {
            const existingNodes = rootNode.querySelectorAll(selector);
            if (existingNodes.length > 0) {
              this.#logger.log(`Explicitly processing ${existingNodes.length} existing node(s) for selector "${selector}".`);
              existingNodes.forEach(node => {
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
          this.#watcherSubscriptionId = this.#watcher.subscribe(this.#handleMutations);
          this.#logger.log('Subscribed to DomWatcherService.');
        } else if (!hasTasks && this.#watcherSubscriptionId) {
          // 无任务但仍在订阅 -> 退订
          this.#watcher.unsubscribe(this.#watcherSubscriptionId);
          this.#watcherSubscriptionId = null;
          this.#logger.log('Unsubscribed from DomWatcherService.');
        }
      }

      /**
       * 从 DomWatcherService 接收原始情报的回调，负责过滤和排队任务。
       * @param {MutationRecord[]} mutations
       * @private
       */
      #handleMutations = (mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            for (const addedNode of mutation.addedNodes) {
              if (addedNode.nodeType === Node.ELEMENT_NODE) {
                this.#queueMatchingTasks(addedNode, 'add');
                // 同时检查新增节点下的所有子元素是否也匹配
                const descendants = addedNode.querySelectorAll('*');
                for (const descendant of descendants) {
                  this.#queueMatchingTasks(descendant, 'add');
                }
              }
            }
          } else if (mutation.type === 'attributes') {
            if (mutation.target.nodeType === Node.ELEMENT_NODE) {
              this.#queueMatchingTasks(mutation.target, 'attributes', mutation.attributeName);
            }
          }
        }

        // 只要有新任务入队，就确保 rAF 循环在运行
        if (this.#taskQueue.length > 0) {
          this.#startLoop();
        }
      }

      /**
       * 辅助函数：根据每个任务各自的 options 过滤情报，并将匹配的任务排队。
       * @private
       */
      #queueMatchingTasks(node, mutationType, attributeName = null) {
        for (const task of this.#registeredTasks.values()) {
          // --- 根节点靶向检查 ---
          if (task.options.root) {
            const rootNode = typeof task.options.root === 'string'
              ? this.#hostDocument.querySelector(task.options.root)
              : task.options.root;

            if (!rootNode || !rootNode.contains(node)) {
              continue;
            }
          }

          // --- 核心过滤逻辑 ---

          // 1. 检查任务是否关心此类变更
          if (mutationType === 'add' && !task.options.add) continue;
          if (mutationType === 'attributes' && !task.options.attributes) continue;

          // 2. 对于属性变更，额外检查 attributeFilter
          if (mutationType === 'attributes' && Array.isArray(task.options.attributeFilter)) {
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
            this.#logger.error('Error in DomBatchProcessor task callback:', e);
          }
        }

        if (this.#taskQueue.length > 0) {
          requestAnimationFrame(this.#processQueue);
        } else {
          this.#isLoopRunning = false;
        }
      }
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
          log: (message, ...args) => this.#isDebug && console.log(`%c${tag}`, styles.log, message, ...args),
          warn: (message, ...args) => this.#isDebug && console.warn(`%c${tag}`, styles.warn, message, ...args),
          error: (message, ...args) => console.error(`%c${tag}`, styles.error, message, ...args),
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
            log: `background-color: ${styleOptions.backgroundColor || '#757575'}; color: ${styleOptions.color || 'white'}; ${this.#baseTagStyle}`,
            warn: `background-color: ${styleOptions.backgroundColor || '#757575'}; color: ${styleOptions.color || 'white'}; ${this.#baseTagStyle}`,
            error: `background-color: #f44336; color: white; ${this.#baseTagStyle}`, // 错误总是红色
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
        let binaryString = '';
        utf8Bytes.forEach(byte => {
          binaryString += String.fromCharCode(byte);
        });
        let safeAppName = btoa(binaryString);
        safeAppName = safeAppName.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
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

        if (!options || typeof options !== 'object' || !appName || typeof appName !== 'string' || !Array.isArray(modules) || !services || !services.storage || !services.command) {
          logger.error('Preflight check failed: Invalid configuration object.');
          return false;
        }

        if (modules.length === 0) {
          if (options.isDebug) logger.log(`Preflight check skipped: No modules provided.`);
          return false;
        }

        if (hostWindow[instanceKey]) {
          logger.warn('Preflight check failed: Script instance already running.');
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
      initializeCoreServices: (options, context, logger, hostWindow, hostDocument, sanitizer) => {
        const eventBus = _CaliberInternals.createEventBus(logger);
        const schedulerLogger = logger.createTaggedLogger('Scheduler', { backgroundColor: '#4CAF50' });
        const domWatcher = new DomWatcherService(logger, hostDocument);

        const frameworkServices = {
          scheduler: new DomBatchProcessor(options.framework?.domProcessorBatchSize, schedulerLogger, hostDocument, domWatcher),
          interceptor: _CaliberInternals.createFetchInterceptor(logger, hostWindow, hostDocument, context.safeAppName, options.isDebug, sanitizer),
          sanitizer: sanitizer,
          executor: _CaliberInternals.createPageScopeExecutor(logger, context.safeAppName, sanitizer, hostDocument),
          utils: {
            checkMatch: (rule, win = hostWindow) => _CaliberInternals._checkMatch(rule, win)
          },
          _internal_domWatcher: domWatcher
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
        const pathname = rawPathname.endsWith('/') && rawPathname.length > 1
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
            return match
              ? { params: match.groups || {}, query }
              : false;
          }

          // 字符串规则
          if (typeof rule === 'string') {
            let isAbsolute = false;
            let rulePath = rule;
            let ruleProtocol = '';
            let ruleHost = '';

            try {
              const urlObj = new URL(rule);
              isAbsolute = true;
              ruleProtocol = urlObj.protocol;
              ruleHost = urlObj.host;
              rulePath = urlObj.pathname;
            } catch { }

            if (isAbsolute) {
              if (ruleProtocol !== currentUrl.protocol || ruleHost !== currentUrl.host) {
                return false;
              }
            }

            // 路径规范化
            const normalizedRule = rulePath.endsWith('/') && rulePath.length > 1
              ? rulePath.slice(0, -1)
              : rulePath;

            // 快速前缀匹配（无参数路径）
            if (pathname === normalizedRule || pathname.startsWith(normalizedRule + '/')) {
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
          const hasParams = pattern.includes(':') || pattern.includes('*');
          if (!hasParams) return false;

          // 构建正则表达式
          const parts = pattern.split('/').slice(1);
          let regexStr = '^';
          const paramNames = [];
          let hasWildcard = false;

          for (const part of parts) {
            if (hasWildcard) return false; // 通配符后不能有其他部分

            if (part.startsWith(':')) {
              const isOptional = part.endsWith('?');
              const name = isOptional ? part.slice(1, -1) : part.slice(1);
              paramNames.push(name);
              regexStr += isOptional ? '(?:/([^/]+))?' : '/([^/]+)';
            }
            else if (part === '*') {
              paramNames.push('_');
              regexStr += '(?:/(.*))?';
              hasWildcard = true;
            }
            else {
              regexStr += '/' + part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }
          }
          regexStr += '$';

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
              [...listeners.get(eventName)].forEach(callback => {
                try {
                  callback(data);
                } catch (e) {
                  log.error(`[EventBus] Error in callback for event "${eventName}":`, e);
                }
              });
            }
          }
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
          bus.emit('navigate');
        };

        history.replaceState = function (...args) {
          originalReplaceState.apply(this, args);
          bus.emit('navigate');
        };

        hostWindow.addEventListener('popstate', () => bus.emit('navigate'));
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
                _policy = window.trustedTypes.createPolicy('CaliberUniversalPolicy#html', {
                  createHTML: s => s,
                  createScript: s => s,
                });
              } catch (e) {
                if (window.trustedTypes.defaultPolicy) _policy = window.trustedTypes.defaultPolicy;
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
              logger.error('setInnerHTML failed due to CSP.', `Error: ${e.message}`);
            }
          },

          /**
           * [便捷方法] 安全地注入脚本。
           * @param {Document} doc - 目标文档。
           * @param {string} codeString - 脚本字符串。
           */
          injectScript(doc, codeString) {
            try {
              const script = doc.createElement('script');
              const policy = _getPolicy();
              if (policy) script.textContent = policy.createScript(codeString);
              else script.textContent = codeString;
              (doc.head || doc.documentElement).prepend(script);
              script.remove();
            } catch (e) {
              logger.error('Script injection failed due to CSP.', `Error: ${e.message}`);
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
              const style = doc.createElement('style');
              style.dataset.caliberId = id;
              style.innerHTML = this.createTrustedHTML(cssString);
              doc.head.appendChild(style);
              return style;
            } catch (e) {
              logger.error('Style injection failed due to CSP.', `Error: ${e.message}`);
              return null;
            }
          }
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
      createFetchInterceptor: (logger, hostWindow, hostDocument, safeAppName, isDebug, sanitizer) => {
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
              logger.error(`[FetchInterceptor] Error in response callback for path [${path.join('/')}]`, e);
            }
          }
        };

        // 统一处理路径验证和转换
        const _validateAndTransformPath = (path, methodName) => {
          if (typeof path === 'string' && path) return [path];
          if (Array.isArray(path) && path.length > 0) return path;
          logger.error(`[FetchInterceptor] ${methodName} failed: path must be a non-empty array or a non-empty string.`);
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
          createHook({ targetUrl, method = 'GET', handler }) {
            if (!targetUrl || !handler) {
              logger.error(`[FetchInterceptor.createHook] failed: 'targetUrl' and 'handler' are required.`);
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
            const finalPath = _validateAndTransformPath(path, 'addHookWithResponse');
            if (!finalPath) return;
            if (typeof responseCallback !== 'function') {
              logger.error('[FetchInterceptor] addHookWithResponse failed: responseCallback must be a function.');
              return;
            }

            const pathKey = JSON.stringify(finalPath);
            // 如果是新注册的回调，增加引用计数
            if (!responseCallbacks.has(pathKey)) {
              if (listenerRefCount === 0) {
                hostDocument.addEventListener(responseEventName, _handleInjectedEvent);
                if (isDebug) logger.log(`[FetchInterceptor] Global response listener attached for event: ${responseEventName}`);
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
            const finalPath = _validateAndTransformPath(path, 'addHook');
            if (!finalPath || !hookFunctionString) {
              if (!hookFunctionString) logger.error('[FetchInterceptor] addHook failed: hookFunctionString is required.');
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
              if (${isDebug}) console.log(\`[Caliber] Hook at path [${finalPath.join('/')}] added/updated. Awaits response: ${awaitsResponse}\`);
            })();
          `;
            sanitizer.injectScript(hostDocument, injectionCode);
          },

          /**
           * 从注入的钩子注册表中移除一个钩子或分支。
           * @param {string[]|string} path - 要移除的钩子或分支的路径。
           */
          removeHook(path) {
            const finalPath = _validateAndTransformPath(path, 'removeHook');
            if (!finalPath) return;

            const pathKey = JSON.stringify(finalPath);
            // 如果确实存在一个回调被移除，减少引用计数
            if (responseCallbacks.has(pathKey)) {
              responseCallbacks.delete(pathKey);
              listenerRefCount--;

              if (listenerRefCount === 0) {
                hostDocument.removeEventListener(responseEventName, _handleInjectedEvent);
                if (isDebug) logger.log(`[FetchInterceptor] Global response listener removed as no hooks are active.`);
              }
              if (isDebug) logger.log(`[FetchInterceptor] Response callback for path [${finalPath.join('/')}] removed.`);
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
              if (${isDebug}) console.log(\`[Caliber] Hook or branch at path [${finalPath.join('/')}] removed.\`);
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

                const isMatched = _CaliberInternals._checkMatch(match, hostWindow);
                if (!isMatched) {
                  if (isDebug) {
                    logger.log(`[Interceptor.register] Registration for ID '${id}' skipped. Current URL "${hostWindow.location.href}" does not match the rule:`, match);
                  }
                  return;
                }

                if (!id) {
                  logger.error('[Interceptor.register] An ID is required to register a hook.');
                  return;
                }

                const isRequestModified = this._requestHandlerStr !== `(url, config) => ({ url, config })`;
                const isResponseHandled = this._responseCallback !== null;
                if (!isRequestModified && !isResponseHandled) {
                  if (isDebug) {
                    logger.warn(`[Interceptor.register] Registration for ID '${id}' was silently cancelled because both onRequest and onResponse were omitted.`);
                  }
                  return;
                }

                const finalHandler = isRequestModified ? this._requestHandlerStr : `return { url, config };`;

                const fullHookString = service.createHook({
                  targetUrl: this._targetConfig.url,
                  method: this._targetConfig.method,
                  handler: finalHandler
                });

                if (isResponseHandled) {
                  service.addHookWithResponse(id, fullHookString, this._responseCallback);
                } else {
                  service.addHook(id, fullHookString);
                }
              }
            };

            const targetConfig = typeof urlOrOptions === 'string'
              ? { url: urlOrOptions, method: 'GET' }
              : { method: 'GET', ...urlOrOptions };

            return builder._init(targetConfig);
          }
        };
        return service;
      },

      /**
       * @private
       * [原生适配器] 基于Web标准API的默认服务实现。
       */
      _nativeBrowserAdapters: {
        storage: (storageKey) => ({
          get: () => Promise.resolve(JSON.parse(localStorage.getItem(storageKey) || '{}')),
          set: (value) => Promise.resolve(localStorage.setItem(storageKey, JSON.stringify(value))),
        }),
        command: {
          register: (name, callback) => { },
        },
        style: (sanitizer, hostDocument) => ({
          _addedStyles: new Map(),
          add(cssString, id) {
            const styleElement = sanitizer.injectStyle(hostDocument, cssString, id);
            if (styleElement) {
              this._addedStyles.set(id, styleElement);
            }
          },
          remove(id) {
            if (this._addedStyles.has(id)) {
              this._addedStyles.get(id).remove();
              this._addedStyles.delete(id);
            }
          }
        })
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
                hostDocument.removeEventListener(responseEventName, handleResponse);
                if (success) {
                  resolve(data);
                } else {
                  reject(new Error(errorMsg || 'Page-scope code execution failed.'));
                }
              };

              hostDocument.addEventListener(responseEventName, handleResponse, { once: true });

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
          }
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
      const { appName, modules, services, isDebug = false, settingsPanelEnabled = true } = options || {};

      // 初始化基础环境
      const loggerFactory = new LoggerService(isDebug);
      const mainLogger = loggerFactory.createMainLogger(appName || 'CaliberApp');
      const hostWindow = (services.hostWindow || (('unsafeWindow' in window) ? unsafeWindow : window));
      const hostDocument = (services.hostDocument || hostWindow.document || document);

      // 创建上下文
      const context = _CaliberInternals._createAppContext(appName);

      // 执行预检 
      if (!_CaliberInternals.runPreflightChecks(options, context.instanceKey, mainLogger, hostWindow)) {
        return;
      }

      const sanitizer = _CaliberInternals.createDOMSanitizer(mainLogger);
      // 优先使用用户提供的，否则使用框架内置的原生适配器
      const finalServices = {
        storage: services.storage || _CaliberInternals._nativeBrowserAdapters.storage(`CALIBER_STORAGE_${appName}`),
        command: _CaliberInternals._nativeBrowserAdapters.command,
        style: services.style || _CaliberInternals._nativeBrowserAdapters.style(sanitizer, hostDocument),
        ...services
      };

      // 初始化核心服务
      const coreServices = _CaliberInternals.initializeCoreServices(options, context, mainLogger, hostWindow, hostDocument, sanitizer);

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
      modules.forEach(ModuleClass => kernel.registerModule(ModuleClass));
      await kernel.run();

      // 注册外部接口
      finalServices.command.register(`⚙️ ${appName} 设置`, () => {
        coreServices.eventBus.emit('command:toggle-settings-panel');
      });

      mainLogger.log('Bootstrap sequence complete. Application is alive.');
    }

    return {
      createApp,
      Module // 暴露 Module 基类，以便应用脚本可以继承它
    };
  })();

  // 将Caliber对象挂载到window上
  window.Caliber = Caliber;

})((typeof unsafeWindow !== 'undefined' && unsafeWindow) ? unsafeWindow : window);
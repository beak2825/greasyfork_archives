// ==UserScript==
// @name         QuickMenu
// @namespace    https://github.com/JiyuShao/greasyfork-scripts
// @version      2024-06-11
// @description  油猴菜单库，支持开关菜单，支持状态保持，支持 Iframe
// @author       Jiyu Shao <jiyu.shao@gmail.com>
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// ==/UserScript==

// 快捷生成菜单逻辑
const QuickMenu = {
  isInited: false,
  label: '',
  isUpdating: false,
  stateConfigMap: {}, // 状态数据
  storeConfigMap: {}, // 缓存数据
  init: function () {
    if (this.isInited) {
      return;
    }
    this.isInited = true;

    // 初始化 label
    if (!this.label) {
      let level = 0;
      let currentWindow = window;
      while (currentWindow.parent && currentWindow !== currentWindow.parent) {
        // 增加计数器，因为我们进入了更深层的嵌套
        level++;
        // 移动到父级窗口
        currentWindow = currentWindow.parent;
        // 可选：设置一个最大嵌套层数以避免无限循环
        if (level > 10) {
          // 这个数字可以根据实际情况调整
          console.warn('可能存在无限循环的iframe嵌套，停止计数');
          break;
        }
      }
      // 如果level大于0，我们至少在一个嵌套的iframe中
      const currentOrderMap = GM_getValue('QM_ORDER_MAP') || {};
      const currentOrder = (currentOrderMap[level] || -1) + 1;
      GM_setValue('QM_ORDER_MAP', {
        ...currentOrderMap,
        [level]: currentOrder,
      });
      this.label = `第${level}层第${currentOrder}个`;
    }

    // 添加更新监听回调，保证菜单展示正确，不需要销毁
    GM_addValueChangeListener(
      'QM_TRIGGER_UPDATE',
      (_key, _oldValue, _newValue, remote) => {
        console.log('[QuickMenu] QM_TRIGGER_UPDATE', {
          currentLabel: this.label,
          remote,
          oldValue: _oldValue,
          newValue: _newValue,
        });
        if (remote) {
          this._update({
            useStore: true, // 表示触发源是远程其他模块，需要从 store 中获取数据
            triggerCallback: true, // 需要重新执行回调刷新逻辑
            triggerRemote: false, // 不需要再次触发远程更新
          });
        }
      }
    );
  },
  // 存储菜单
  setMenuConfigStore: function () {
    Object.values(this.stateConfigMap).forEach((e) => {
      this.storeConfigMap[e.name] = {
        value: e.value,
      };
    });
    GM_setValue('QM_MENU', this.storeConfigMap);
    // 触发其他实例进行更新
    GM_setValue('QM_TRIGGER_UPDATE', `${this.label}:${Math.random()}`);
  },
  // 获取菜单配置
  getMenuConfigStore: function () {
    // 初始化 store 数据
    this.storeConfigMap = GM_getValue('QM_MENU') || {};
  },
  clearStore: function () {
    // 清空 store 数据
    GM_setValue('QM_MENU', undefined);
    this._update({
      useStore: true, // 使用 store 数据，只更新当前环境
      triggerCallback: true, // 当前环境也要执行回调
      triggerRemote: true, // 需要再次触发远程更新
    });
  },
  // 添加菜单配置
  add: function (config) {
    this.init();
    // 兼容数组配置
    if (Array.isArray(config)) {
      config.forEach((e) => this.add(e));
      for (var i in config) {
        this.add(config[i]);
      }
      return;
    }
    // 检查配置名称
    if (!config.name && typeof config === 'object') {
      alert('QM_MENU.add Config name is need.');
      return;
    }
    // 添加到状态配置数据中
    this.stateConfigMap[config.name] = {
      ...config,
      isInited: false, // 需要执行回调初始化执行的逻辑
    };

    // 执行更新的逻辑
    if (!this.isUpdating) {
      this.isUpdating = true;
      // 这里放到宏任务队列中执行，批量更新
      setTimeout(() => {
        this.isUpdating = false;
        // 更新数据 & UI
        this._update();
      }, 0);
    }
  },
  // 更新状态数据
  _updateState: function (options) {
    const { useStore = false } = options || {};
    this.getMenuConfigStore();
    Object.values(this.stateConfigMap).forEach((currentConfig) => {
      let menuDisplay = currentConfig.name;
      // 为 Toggle 定制展示名称
      if (currentConfig.type === 'toggle') {
        // 使用 store 里的缓存值，有以下两种情况：
        // 1. 当前配置还没初始化
        // 2. 由于会有多实例的情况，useStore 的话以 store 数据为准
        if (!currentConfig.isInited || useStore) {
          const currentStoreConfig = this.storeConfigMap[currentConfig.name];
          currentConfig.value =
            currentStoreConfig && currentStoreConfig.value
              ? currentStoreConfig.value
              : 'off';
        }

        // 如果没有值的话，默认为 off
        currentConfig.value = currentConfig.value ? currentConfig.value : 'off';
        menuDisplay = `${menuDisplay}[${
          currentConfig.value === 'on' ? 'x' : ' '
        }]`;
      }
    });

    console.debug(`[QuickMenu] ${this.label}: 状态已更新`, {
      options,
      stateConfigMap: this.stateConfigMap,
    });
  },
  // 更新菜单、执行初始化回调、保存 store、触发远程更新
  _commitUpdate: function (options) {
    const { triggerCallback = false, triggerRemote = true } = options || {};
    Object.values(this.stateConfigMap).forEach((currentConfig) => {
      // 判断是否可以执行菜单回调
      let runCallbackFlag = false;
      if (typeof currentConfig.shouldInitRun === 'boolean') {
        runCallbackFlag = currentConfig.shouldInitRun;
      } else if (typeof currentConfig.shouldInitRun === 'function') {
        runCallbackFlag = !!currentConfig.shouldInitRun.call(null);
      }
      // 判断是否需要注入菜单
      let updateMenuFlag = true;
      if (typeof currentConfig.shouldAddMenu === 'boolean') {
        updateMenuFlag = currentConfig.shouldAddMenu;
      } else if (typeof currentConfig.shouldAddMenu === 'function') {
        updateMenuFlag = !!currentConfig.shouldAddMenu.call(null);
      }
      // 生成菜单名称
      let menuDisplay = currentConfig.name;
      if (currentConfig.type === 'toggle') {
        // 如果没有值的话，默认为 off
        currentConfig.value = currentConfig.value ? currentConfig.value : 'off';
        menuDisplay = `${menuDisplay}[${
          currentConfig.value === 'on' ? 'x' : ' '
        }]`;
      }
      // 执行回调有两个时机
      // 1. 初始化时
      // 2. 接收到远程更新时
      if ((!currentConfig.isInited || triggerCallback) && runCallbackFlag) {
        currentConfig.isInited = true;
        currentConfig.callback &&
          currentConfig.callback.call(null, currentConfig.value);
      }
      // 有时候需要更新菜单，所以这里先卸载
      if (currentConfig.id) {
        GM_unregisterMenuCommand(currentConfig.id); // 删除菜单
        delete currentConfig.id;
      }
      if (updateMenuFlag) {
        currentConfig.id = GM_registerMenuCommand(
          menuDisplay,
          () => {
            console.debug(`[QuickMenu] ${this.label}:点击${menuDisplay}`);
            // 切换 value，并更新，实际执行时只有 toggle 的值会更新
            currentConfig.value = { on: 'off', off: 'on' }[currentConfig.value];
            // 使用最新的 value 执行用户回调
            currentConfig.callback &&
              currentConfig.callback.call(null, currentConfig.value);
            // 放到最后更新，因为用户回调有可能会影响数据，如清空 Store
            this._update();
          },
          { autoClose: false }
        );
      }
    });
    // 远程的不需要更新数据，只需要注册菜单
    if (triggerRemote) {
      this.setMenuConfigStore();
    }
    console.debug(`[QuickMenu] ${this.label}: 更新已提交`);
  },
  // 触发更新
  _update: function (options) {
    this._updateState(options);
    this._commitUpdate(options);
  },
};
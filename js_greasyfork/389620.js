// ==UserScript==

// @name              NGA Filter
// @name:zh-CN        NGA 屏蔽插件

// @description       NGA 屏蔽插件，支持用户、标记、关键字、属地、小号、流量号、低声望、匿名、提醒过滤。troll must die。
// @description:zh-CN NGA 屏蔽插件，支持用户、标记、关键字、属地、小号、流量号、低声望、匿名、提醒过滤。troll must die。

// @namespace         https://greasyfork.org/users/263018
// @version           2.8.2
// @author            snyssss
// @license           MIT

// @match             *://bbs.nga.cn/*
// @match             *://ngabbs.com/*
// @match             *://nga.178.com/*

// @require           https://update.greasyfork.org/scripts/486070/1552669/NGA%20Library.js

// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_registerMenuCommand
// @grant             unsafeWindow

// @run-at            document-start
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/389620/NGA%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/389620/NGA%20Filter.meta.js
// ==/UserScript==

(() => {
  // 声明泥潭主模块、主题模块、回复模块、提醒模块
  let commonui, topicModule, replyModule, notificationModule;

  // KEY
  const DATA_KEY = "NGAFilter";
  const PRE_FILTER_KEY = "PRE_FILTER_KEY";
  const NOTIFICATION_FILTER_KEY = "NOTIFICATION_FILTER_KEY";

  // TIPS
  const TIPS = {
    filterMode:
      "过滤顺序：用户 &gt; 标记 &gt; 关键字 &gt; 属地<br/>过滤级别：显示 &gt; 隐藏 &gt; 遮罩 &gt; 标记 &gt; 继承",
    addTags: `一次性添加多个标记用"|"隔开，不会添加重名标记`,
    keyword: `支持正则表达式。比如同类型的可以写在一条规则内用"|"隔开，"ABC|DEF"即为屏蔽带有ABC或者DEF的内容。`,
    forumOrSubset:
      "输入版面或合集的完整链接，如：<br/>https://bbs.nga.cn/thread.php?fid=xxx<br/>https://bbs.nga.cn/thread.php?stid=xxx",
    hunter: "猎巫模块需要占用额外的资源，请谨慎开启",
    filterNotification: "目前支持过滤回复提醒，暂不支持过滤短消息。",
    filterTopicPerPage:
      "泥潭每页帖子数量约为30条，本功能即为检测连续的30条帖子内相同用户的发帖数量",
    filterPostnumPerDayLimit:
      "现为不完美的解决方案，仅根据注册时间计算，无法计算近期发帖数量",
    error: "目前泥潭对查询接口增加了限制，功能可能不会立即生效",
  };

  // 主题
  const THEMES = {
    system: {
      name: "系统",
    },
    classic: {
      name: "经典",
      fontColor: "crimson",
      borderColor: "#66BAB7",
      backgroundColor: "#81C7D4",
    },
  };

  /**
   * 设置
   *
   * 暂时整体处理模块设置，后续再拆分
   */
  class Settings {
    /**
     * 缓存管理
     */
    cache;

    /**
     * 当前设置
     */
    data = null;

    /**
     * 初始化并绑定缓存管理
     * @param {Cache} cache 缓存管理
     */
    constructor(cache) {
      this.cache = cache;
    }

    /**
     * 读取设置
     */
    async load() {
      // 读取设置
      if (this.data === null) {
        // 默认配置
        const defaultData = {
          tags: {},
          users: {},
          keywords: {},
          locations: {},
          forumOrSubsets: {},
          options: {
            theme: "system",
            filterRegdateLimit: 0,
            filterPostnumLimit: 0,
            filterPostnumPerDayLimit: NaN,
            filterDeletedTopicLimit: NaN,
            filterTopicRateLimit: 100,
            filterTopicPerDayLimit: NaN,
            filterTopicPerPageLimit: NaN,
            filterReputationLimit: NaN,
            filterAnony: false,
            filterThumb: false,
            filterMode: "隐藏",
          },
        };

        // 读取数据
        const storedData = await this.cache
          .get(DATA_KEY)
          .then((values) => values || {});

        // 写入缓存
        this.data = Tools.merge({}, defaultData, storedData);

        // 写入默认模块选项
        if (Object.hasOwn(this.data, "modules") === false) {
          this.data.modules = ["user", "tag", "misc"];

          if (Object.keys(this.data.keywords).length > 0) {
            this.data.modules.push("keyword");
          }

          if (Object.keys(this.data.locations).length > 0) {
            this.data.modules.push("location");
          }
        }
      }

      // 返回设置
      return this.data;
    }

    /**
     * 写入设置
     */
    async save() {
      return this.cache.put(DATA_KEY, this.data);
    }

    /**
     * 获取模块列表
     */
    get modules() {
      return this.data.modules;
    }

    /**
     * 设置模块列表
     */
    set modules(values) {
      this.data.modules = values;
      this.save();
    }

    /**
     * 获取标签列表
     */
    get tags() {
      return this.data.tags;
    }

    /**
     * 设置标签列表
     */
    set tags(values) {
      this.data.tags = values;
      this.save();
    }

    /**
     * 获取用户列表
     */
    get users() {
      return this.data.users;
    }

    /**
     * 设置用户列表
     */
    set users(values) {
      this.data.users = values;
      this.save();
    }

    /**
     * 获取关键字列表
     */
    get keywords() {
      return this.data.keywords;
    }

    /**
     * 设置关键字列表
     */
    set keywords(values) {
      this.data.keywords = values;
      this.save();
    }

    /**
     * 获取属地列表
     */
    get locations() {
      return this.data.locations;
    }

    /**
     * 设置属地列表
     */
    set locations(values) {
      this.data.locations = values;
      this.save();
    }

    /**
     * 获取版面或合集列表
     */
    get forumOrSubsets() {
      return this.data.forumOrSubsets;
    }

    /**
     * 设置版面或合集列表
     */
    set forumOrSubsets(values) {
      this.data.forumOrSubsets = values;
      this.save();
    }

    /**
     * 获取默认过滤模式
     */
    get defaultFilterMode() {
      return this.data.options.filterMode;
    }

    /**
     * 设置默认过滤模式
     */
    set defaultFilterMode(value) {
      this.data.options.filterMode = value;
      this.save();
    }

    /**
     * 获取主题
     */
    get theme() {
      return this.data.options.theme;
    }

    /**
     * 设置主题
     */
    set theme(value) {
      this.data.options.theme = value;
      this.save();
    }

    /**
     * 获取注册时间限制
     */
    get filterRegdateLimit() {
      return this.data.options.filterRegdateLimit || 0;
    }

    /**
     * 设置注册时间限制
     */
    set filterRegdateLimit(value) {
      this.data.options.filterRegdateLimit = value;
      this.save();
    }

    /**
     * 获取发帖数量限制
     */
    get filterPostnumLimit() {
      return this.data.options.filterPostnumLimit || 0;
    }

    /**
     * 设置发帖数量限制
     */
    set filterPostnumLimit(value) {
      this.data.options.filterPostnumLimit = value;
      this.save();
    }

    /**
     * 获取日均发帖限制
     */
    get filterPostnumPerDayLimit() {
      return this.data.options.filterPostnumPerDayLimit || NaN;
    }

    /**
     * 设置日均发帖限制
     */
    set filterPostnumPerDayLimit(value) {
      this.data.options.filterPostnumPerDayLimit = value;
      this.save();
    }

    /**
     * 获取近期删帖限制
     */
    get filterDeletedTopicLimit() {
      return this.data.options.filterDeletedTopicLimit || NaN;
    }

    /**
     * 获取近期删帖限制
     */
    set filterDeletedTopicLimit(value) {
      this.data.options.filterDeletedTopicLimit = value;
      this.save();
    }

    /**
     * 获取主题比例限制
     */
    get filterTopicRateLimit() {
      return this.data.options.filterTopicRateLimit || 100;
    }

    /**
     * 设置主题比例限制
     */
    set filterTopicRateLimit(value) {
      this.data.options.filterTopicRateLimit = value;
      this.save();
    }

    /**
     * 获取每日主题数量限制
     */
    get filterTopicPerDayLimit() {
      return this.data.options.filterTopicPerDayLimit || NaN;
    }

    /**
     * 设置每日主题数量限制
     */
    set filterTopicPerDayLimit(value) {
      this.data.options.filterTopicPerDayLimit = value;
      this.save();
    }

    /**
     * 获取每页主题数量限制
     */
    get filterTopicPerPageLimit() {
      return this.data.options.filterTopicPerPageLimit || NaN;
    }

    /**
     * 设置每页主题数量限制
     */
    set filterTopicPerPageLimit(value) {
      this.data.options.filterTopicPerPageLimit = value;
      this.save();
    }

    /**
     * 获取版面声望限制
     */
    get filterReputationLimit() {
      return this.data.options.filterReputationLimit || NaN;
    }

    /**
     * 设置版面声望限制
     */
    set filterReputationLimit(value) {
      this.data.options.filterReputationLimit = value;
      this.save();
    }

    /**
     * 获取是否过滤匿名
     */
    get filterAnonymous() {
      return this.data.options.filterAnony || false;
    }

    /**
     * 设置是否过滤匿名
     */
    set filterAnonymous(value) {
      this.data.options.filterAnony = value;
      this.save();
    }

    /**
     * 获取是否过滤缩略图
     */
    get filterThumbnail() {
      return this.data.options.filterThumb || false;
    }

    /**
     * 设置是否过滤缩略图
     */
    set filterThumbnail(value) {
      this.data.options.filterThumb = value;
      this.save();
    }

    /**
     * 获取是否启用前置过滤
     */
    get preFilterEnabled() {
      return this.cache.get(PRE_FILTER_KEY).then((value) => {
        if (value === undefined) {
          return true;
        }

        return value;
      });
    }

    /**
     * 设置是否启用前置过滤
     */
    set preFilterEnabled(value) {
      this.cache.put(PRE_FILTER_KEY, value).then(() => {
        location.reload();
      });
    }

    /**
     * 获取是否启用提醒过滤
     */
    get notificationFilterEnabled() {
      return this.cache.get(NOTIFICATION_FILTER_KEY).then((value) => {
        if (value === undefined) {
          return false;
        }

        return value;
      });
    }

    /**
     * 设置是否启用提醒过滤
     */
    set notificationFilterEnabled(value) {
      this.cache.put(NOTIFICATION_FILTER_KEY, value).then(() => {
        location.reload();
      });
    }

    /**
     * 获取过滤模式列表
     *
     * 模拟成从配置中获取
     */
    get filterModes() {
      return ["继承", "标记", "遮罩", "隐藏", "显示"];
    }

    /**
     * 获取指定下标过滤模式
     * @param {Number} index 下标
     */
    getNameByMode(index) {
      const modes = this.filterModes;

      return modes[index] || "";
    }

    /**
     * 获取指定过滤模式下标
     * @param {String} name 过滤模式
     */
    getModeByName(name) {
      const modes = this.filterModes;

      return modes.indexOf(name);
    }

    /**
     * 切换过滤模式
     * @param   {String} value 过滤模式
     * @returns {String}       过滤模式
     */
    switchModeByName(value) {
      const index = this.getModeByName(value);

      const nextIndex = (index + 1) % this.filterModes.length;

      return this.filterModes[nextIndex];
    }
  }

  /**
   * UI
   */
  class UI {
    /**
     * 标签
     */
    static label = "屏蔽";

    /**
     * 设置
     */
    settings;

    /**
     * API
     */
    api;

    /**
     * 模块列表
     */
    modules = {};

    /**
     * 菜单元素
     */
    menu = null;

    /**
     * 视图元素
     */
    views = {};

    /**
     * 初始化并绑定设置、API，注册脚本菜单
     * @param {Settings} settings 设置
     * @param {API}      api      API
     */
    constructor(settings, api) {
      this.settings = settings;
      this.api = api;

      this.init();
    }

    /**
     * 初始化，创建基础视图，初始化通用设置
     */
    init() {
      const tabs = this.createTabs({
        className: "right_",
      });

      const content = this.createElement("DIV", [], {
        style: "width: 80vw;",
      });

      const container = this.createElement("DIV", [tabs, content]);

      this.views = {
        tabs,
        content,
        container,
      };

      this.initSettings();
    }

    /**
     * 初始化设置
     */
    initSettings() {
      // 创建基础视图
      const settings = this.createElement("DIV", []);

      // 添加设置项
      const add = (order, ...elements) => {
        const items = [...settings.childNodes];

        if (items.find((item) => item.order === order)) {
          return;
        }

        const item = this.createElement(
          "DIV",
          [...elements, this.createElement("BR", [])],
          {
            order,
          }
        );

        const anchor = items.find((item) => item.order > order);

        settings.insertBefore(item, anchor || null);

        return item;
      };

      // 绑定事件
      Object.assign(settings, {
        add,
      });

      // 合并视图
      Object.assign(this.views, {
        settings,
      });

      // 创建标签页
      const { tabs, content } = this.views;

      this.createTab(tabs, "设置", Number.MAX_SAFE_INTEGER, {
        onclick: () => {
          content.innerHTML = "";
          content.appendChild(settings);
        },
      });
    }

    /**
     * 弹窗确认
     * @param   {String}  message 提示信息
     * @returns {Promise}
     */
    confirm(message = "是否确认？") {
      return new Promise((resolve, reject) => {
        const result = confirm(message);

        if (result) {
          resolve();
          return;
        }

        reject();
      });
    }

    /**
     * 折叠
     * @param {String | Number} key     标识
     * @param {HTMLElement}     element 目标元素
     * @param {String}          content 内容
     */
    collapse(key, element, content) {
      key = "collapsed_" + key;

      element.innerHTML = `
        <div class="lessernuke filter-mask-collapse" onclick="[...document.getElementsByName('${key}')].forEach(item => item.style.display = '')">
          <span class="filter-mask-hint">Troll must die.</span>
          <div style="display: none;" name="${key}">
            ${content}
          </div>
        </div>`;
    }

    /**
     * 创建元素
     * @param   {String}                               tagName    标签
     * @param   {HTMLElement | HTMLElement[] | String} content    内容，元素或者 innerHTML
     * @param   {*}                                    properties 额外属性
     * @returns {HTMLElement}                                     元素
     */
    createElement(tagName, content, properties = {}) {
      const element = document.createElement(tagName);

      // 写入内容
      if (typeof content === "string") {
        element.innerHTML = content;
      } else {
        if (Array.isArray(content) === false) {
          content = [content];
        }

        content.forEach((item) => {
          if (item === null) {
            return;
          }

          if (typeof item === "string") {
            element.append(item);
            return;
          }

          element.appendChild(item);
        });
      }

      // 对 A 标签的额外处理
      if (tagName.toUpperCase() === "A") {
        if (Object.hasOwn(properties, "href") === false) {
          properties.href = "javascript: void(0);";
        }
      }

      // 附加属性
      Object.entries(properties).forEach(([key, value]) => {
        element[key] = value;
      });

      return element;
    }

    /**
     * 创建按钮
     * @param {String}   text       文字
     * @param {Function} onclick    点击事件
     * @param {*}        properties 额外属性
     */
    createButton(text, onclick, properties = {}) {
      return this.createElement("BUTTON", text, {
        ...properties,
        onclick,
      });
    }

    /**
     * 创建按钮组
     * @param {Array} buttons 按钮集合
     */
    createButtonGroup(...buttons) {
      return this.createElement("DIV", buttons, {
        className: "filter-button-group",
      });
    }

    /**
     * 创建表格
     * @param   {Array}       headers    表头集合
     * @param   {*}           properties 额外属性
     * @returns {HTMLElement}            元素和相关函数
     */
    createTable(headers, properties = {}) {
      const rows = [];

      const ths = headers.map((item, index) =>
        this.createElement("TH", item.label, {
          ...item,
          className: `c${index + 1}`,
        })
      );

      const tr =
        ths.length > 0
          ? this.createElement("TR", ths, {
              className: "block_txt_c0",
            })
          : null;

      const thead = tr !== null ? this.createElement("THEAD", tr) : null;

      const tbody = this.createElement("TBODY", []);

      const table = this.createElement("TABLE", [thead, tbody], {
        ...properties,
        className: "filter-table forumbox",
      });

      const wrapper = this.createElement("DIV", table, {
        className: "filter-table-wrapper",
      });

      const intersectionObserver = new IntersectionObserver((entries) => {
        if (entries[0].intersectionRatio <= 0) return;

        const list = rows.splice(0, 10);

        if (list.length === 0) {
          return;
        }

        intersectionObserver.disconnect();

        tbody.append(...list);

        intersectionObserver.observe(tbody.lastElementChild);
      });

      const add = (...columns) => {
        const tds = columns.map((column, index) => {
          if (ths[index]) {
            const { center, ellipsis } = ths[index];

            const properties = {};

            if (center) {
              properties.style = "text-align: center;";
            }

            if (ellipsis) {
              properties.className = "filter-text-ellipsis";
            }

            column = this.createElement("DIV", column, properties);
          }

          return this.createElement("TD", column, {
            className: `c${index + 1}`,
          });
        });

        const tr = this.createElement("TR", tds, {
          className: `row${(rows.length % 2) + 1}`,
        });

        intersectionObserver.disconnect();

        rows.push(tr);

        intersectionObserver.observe(tbody.lastElementChild || tbody);
      };

      const update = (e, ...columns) => {
        const row = e.target.closest("TR");

        if (row) {
          const tds = row.querySelectorAll("TD");

          columns.map((column, index) => {
            if (ths[index]) {
              const { center, ellipsis } = ths[index];

              const properties = {};

              if (center) {
                properties.style = "text-align: center;";
              }

              if (ellipsis) {
                properties.className = "filter-text-ellipsis";
              }

              column = this.createElement("DIV", column, properties);
            }

            if (tds[index]) {
              tds[index].innerHTML = "";
              tds[index].append(column);
            }
          });
        }
      };

      const remove = (e) => {
        const row = e.target.closest("TR");

        if (row) {
          tbody.removeChild(row);
        }
      };

      const clear = () => {
        rows.splice(0);
        intersectionObserver.disconnect();

        tbody.innerHTML = "";
      };

      Object.assign(wrapper, {
        add,
        update,
        remove,
        clear,
      });

      return wrapper;
    }

    /**
     * 创建标签组
     * @param {*} properties 额外属性
     */
    createTabs(properties = {}) {
      const tabs = this.createElement(
        "DIV",
        `<table class="stdbtn" cellspacing="0">
          <tbody>
            <tr></tr>
          </tbody>
        </table>`,
        properties
      );

      return this.createElement(
        "DIV",
        [
          tabs,
          this.createElement("DIV", [], {
            className: "clear",
          }),
        ],
        {
          style: "display: none; margin-bottom: 5px;",
        }
      );
    }

    /**
     * 创建标签
     * @param {Element} tabs       标签组
     * @param {String}  label      标签名称
     * @param {Number}  order      标签顺序，重复则跳过
     * @param {*}       properties 额外属性
     */
    createTab(tabs, label, order, properties = {}) {
      const group = tabs.querySelector("TR");

      const items = [...group.childNodes];

      if (items.find((item) => item.order === order)) {
        return;
      }

      if (items.length > 0) {
        tabs.style.removeProperty("display");
      }

      const tab = this.createElement("A", label, {
        ...properties,
        className: "nobr silver",
        onclick: () => {
          if (tab.className === "nobr") {
            return;
          }

          group.querySelectorAll("A").forEach((item) => {
            if (item === tab) {
              item.className = "nobr";
            } else {
              item.className = "nobr silver";
            }
          });

          if (properties.onclick) {
            properties.onclick();
          }
        },
      });

      const wrapper = this.createElement("TD", tab, {
        order,
      });

      const anchor = items.find((item) => item.order > order);

      group.insertBefore(wrapper, anchor || null);

      return wrapper;
    }

    /**
     * 创建对话框
     * @param {HTMLElement | null} anchor  要绑定的元素，如果为空，直接弹出
     * @param {String}             title   对话框的标题
     * @param {HTMLElement}        content 对话框的内容
     */
    createDialog(anchor, title, content) {
      let window;

      const show = () => {
        if (window === undefined) {
          window = commonui.createCommmonWindow();
        }

        window._.addContent(null);
        window._.addTitle(title);
        window._.addContent(content);
        window._.show();
      };

      if (anchor) {
        anchor.onclick = show;
      } else {
        show();
      }

      return window;
    }

    /**
     * 渲染菜单
     */
    renderMenu() {
      // 菜单尚未加载完成
      if (
        commonui.mainMenu === undefined ||
        commonui.mainMenu.dataReady === null
      ) {
        return;
      }

      // 定位右侧菜单容器
      const right = document.querySelector("#mainmenu .right");

      if (right === null) {
        return;
      }

      // 定位搜索框，如果有搜索框，放在搜索框左侧，没有放在最后
      const searchInput = right.querySelector("#menusearchinput");

      // 初始化菜单并绑定
      if (this.menu === null) {
        const menu = this.createElement("A", this.constructor.label, {
          className: "mmdefault nobr",
        });

        this.menu = menu;
      }

      // 插入菜单
      const container = this.createElement("DIV", this.menu, {
        className: "td",
      });

      if (searchInput) {
        searchInput.closest("DIV").before(container);
      } else {
        right.appendChild(container);
      }
    }

    /**
     * 渲染视图
     */
    renderView() {
      // 如果菜单还没有渲染，说明模块尚未加载完毕，跳过
      if (this.menu === null) {
        return;
      }

      // 绑定菜单点击事件.
      this.createDialog(
        this.menu,
        this.constructor.label,
        this.views.container
      );

      // 启用第一个模块
      this.views.tabs.querySelector("A").click();
    }

    /**
     * 渲染
     */
    render() {
      this.renderMenu();
      this.renderView();
    }
  }

  /**
   * 基础模块
   */
  class Module {
    /**
     * 模块名称
     */
    static name;

    /**
     * 模块标签
     */
    static label;

    /**
     * 顺序
     */
    static order;

    /**
     * 依赖模块
     */
    static depends = [];

    /**
     * 附加模块
     */
    static addons = [];

    /**
     * 设置
     */
    settings;

    /**
     * API
     */
    api;

    /**
     * UI
     */
    ui;

    /**
     * 过滤列表
     */
    data = [];

    /**
     * 依赖模块
     */
    depends = {};

    /**
     * 附加模块
     */
    addons = {};

    /**
     * 视图元素
     */
    views = {};

    /**
     * 初始化并绑定设置、API、UI、过滤列表，注册 UI
     * @param {Settings} settings 设置
     * @param {API}      api      API
     * @param {UI}       ui       UI
     */
    constructor(settings, api, ui, data) {
      this.settings = settings;
      this.api = api;
      this.ui = ui;

      this.data = data;

      this.init();
    }

    /**
     * 创建实例
     * @param   {Settings}      settings 设置
     * @param   {API}           api      API
     * @param   {UI}            ui       UI
     * @param   {Array}         data     过滤列表
     * @returns {Module | null}          成功后返回模块实例
     */
    static create(settings, api, ui, data) {
      // 读取设置里的模块列表
      const modules = settings.modules;

      // 如果不包含自己或依赖的模块，则返回空
      const index = [this, ...this.depends].findIndex(
        (module) => modules.includes(module.name) === false
      );

      if (index >= 0) {
        return null;
      }

      // 创建实例
      const instance = new this(settings, api, ui, data);

      // 返回实例
      return instance;
    }

    /**
     * 判断指定附加模块是否启用
     * @param {typeof Module} module 模块
     */
    hasAddon(module) {
      return Object.hasOwn(this.addons, module.name);
    }

    /**
     * 初始化，创建基础视图和组件
     */
    init() {
      if (this.views.container) {
        this.destroy();
      }

      const { ui } = this;

      const container = ui.createElement("DIV", []);

      this.views = {
        container,
      };

      this.initComponents();
    }

    /**
     * 初始化组件
     */
    initComponents() {}

    /**
     * 销毁
     */
    destroy() {
      Object.values(this.views).forEach((view) => {
        if (view.parentNode) {
          view.parentNode.removeChild(view);
        }
      });

      this.views = {};
    }

    /**
     * 渲染
     * @param {HTMLElement} container 容器
     */
    render(container) {
      container.innerHTML = "";
      container.appendChild(this.views.container);
    }

    /**
     * 过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filter(item, result) {}

    /**
     * 通知
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async notify(item, result) {}
  }

  /**
   * 过滤器
   */
  class Filter {
    /**
     * 设置
     */
    settings;

    /**
     * API
     */
    api;

    /**
     * UI
     */
    ui;

    /**
     * 过滤列表
     */
    data = [];

    /**
     * 模块列表
     */
    modules = {};

    /**
     * 初始化并绑定设置、API、UI
     * @param {Settings} settings 设置
     * @param {API}      api      API
     * @param {UI}       ui       UI
     */
    constructor(settings, api, ui) {
      this.settings = settings;
      this.api = api;
      this.ui = ui;
    }

    /**
     * 绑定两个模块的互相关系
     * @param {Module} moduleA 模块A
     * @param {Module} moduleB 模块B
     */
    bindModule(moduleA, moduleB) {
      const nameA = moduleA.constructor.name;
      const nameB = moduleB.constructor.name;

      // A 依赖 B
      if (moduleA.constructor.depends.findIndex((i) => i.name === nameB) >= 0) {
        moduleA.depends[nameB] = moduleB;
        moduleA.init();
      }

      // B 依赖 A
      if (moduleB.constructor.depends.findIndex((i) => i.name === nameA) >= 0) {
        moduleB.depends[nameA] = moduleA;
        moduleB.init();
      }

      // A 附加 B
      if (moduleA.constructor.addons.findIndex((i) => i.name === nameB) >= 0) {
        moduleA.addons[nameB] = moduleB;
        moduleA.init();
      }

      // B 附加 A
      if (moduleB.constructor.addons.findIndex((i) => i.name === nameA) >= 0) {
        moduleB.addons[nameA] = moduleA;
        moduleB.init();
      }
    }

    /**
     * 加载模块
     * @param {typeof Module} module 模块
     */
    initModule(module) {
      // 如果已经加载过则跳过
      if (Object.hasOwn(this.modules, module.name)) {
        return;
      }

      // 创建模块
      const instance = module.create(
        this.settings,
        this.api,
        this.ui,
        this.data
      );

      // 如果创建失败则跳过
      if (instance === null) {
        return;
      }

      // 绑定依赖模块和附加模块
      Object.values(this.modules).forEach((item) => {
        this.bindModule(item, instance);
      });

      // 合并模块
      this.modules[module.name] = instance;

      // 按照顺序重新整理模块
      this.modules = Tools.sortBy(
        Object.values(this.modules),
        (item) => item.constructor.order
      ).reduce(
        (result, item) => ({
          ...result,
          [item.constructor.name]: item,
        }),
        {}
      );
    }

    /**
     * 加载模块列表
     * @param {typeof Module[]} modules 模块列表
     */
    initModules(...modules) {
      // 根据依赖和附加模块决定初始化的顺序
      Tools.sortBy(
        modules,
        (item) => item.depends.length,
        (item) => item.addons.length
      ).forEach((module) => {
        this.initModule(module);
      });
    }

    /**
     * 添加到过滤列表
     * @param {*} item 绑定的 nFilter
     */
    pushData(item) {
      // 清除掉无效数据
      for (let i = 0; i < this.data.length; ) {
        if (document.body.contains(this.data[i].container) === false) {
          this.data.splice(i, 1);
          continue;
        }

        i += 1;
      }

      // 加入过滤列表
      if (this.data.includes(item) === false) {
        this.data.push(item);
      }
    }

    /**
     * 判断指定 UID 是否是自己
     * @param {Number} uid 用户 ID
     */
    isSelf(uid) {
      return unsafeWindow.__CURRENT_UID === uid;
    }

    /**
     * 获取过滤模式
     * @param {*} item 绑定的 nFilter
     */
    async getFilterMode(item) {
      // 获取链接参数
      const params = new URLSearchParams(location.search);

      // 跳过屏蔽（插件自定义）
      if (params.has("nofilter")) {
        return;
      }

      // 收藏
      if (params.has("favor")) {
        return;
      }

      // 只看某人
      if (params.has("authorid")) {
        return;
      }

      // 跳过自己
      if (this.isSelf(item.uid)) {
        return;
      }

      // 声明结果
      const result = {
        mode: -1,
        reason: ``,
      };

      // 根据模块依次过滤
      for (const module of Object.values(this.modules)) {
        await module.filter(item, result);
      }

      // 写入过滤模式和过滤原因
      item.filterMode = this.settings.getNameByMode(result.mode);
      item.reason = result.reason;

      // 通知各模块过滤结果
      for (const module of Object.values(this.modules)) {
        await module.notify(item, result);
      }

      // 继承模式下返回默认过滤模式
      if (item.filterMode === "继承") {
        return this.settings.defaultFilterMode;
      }

      // 返回结果
      return item.filterMode;
    }

    /**
     * 过滤主题
     * @param {*} item 主题内容，见 commonui.topicArg.data
     */
    filterTopic(item) {
      // 绑定事件
      if (item.nFilter === undefined) {
        // 主题 ID
        const tid = item[8];

        // 主题版面 ID
        const fid = item[7];

        // 主题标题
        const title = item[1];
        const subject = title.innerText;

        // 主题作者
        const author = item[2];
        const uid =
          parseInt(author.getAttribute("href").match(/uid=(\S+)/)[1], 10) || 0;
        const username = author.innerText;

        // 增加操作角标
        const action = (() => {
          const anchor = item[2].parentNode;

          const element = this.ui.createElement("DIV", "", {
            style: Object.entries({
              position: "absolute",
              right: 0,
              bottom: 0,
              padding: "6px",
              "clip-path": "polygon(100% 0, 100% 100%, 0 100%)",
            })
              .map(([key, value]) => `${key}: ${value}`)
              .join(";"),
          });

          anchor.style.position = "relative";
          anchor.appendChild(element);

          return element;
        })();

        // 主题杂项
        const topicMisc = item[16];

        // 主题容器
        const container = title.closest("tr");

        // 过滤函数
        const execute = async () => {
          // 获取过滤模式
          const filterMode = await this.getFilterMode(item.nFilter);

          // 样式处理
          (() => {
            // 还原样式
            // TODO 应该整体采用 className 来实现
            (() => {
              // 标记模式
              title.style.removeProperty("textDecoration");

              // 遮罩模式
              title.classList.remove("filter-mask");
              author.classList.remove("filter-mask");
            })();

            // 样式处理
            (() => {
              // 标记模式下，主题标记会有删除线标识
              if (filterMode === "标记") {
                title.style.textDecoration = "line-through";
                return;
              }

              // 遮罩模式下，主题和作者会有遮罩样式
              if (filterMode === "遮罩") {
                title.classList.add("filter-mask");
                author.classList.add("filter-mask");
                return;
              }

              // 隐藏模式下，容器会被隐藏
              if (filterMode === "隐藏") {
                container.style.display = "none";
                return;
              }
            })();

            // 非隐藏模式下，恢复显示
            if (filterMode !== "隐藏") {
              container.style.removeProperty("display");
            }
          })();
        };

        // 绑定事件
        item.nFilter = {
          tid,
          pid: 0,
          uid,
          fid,
          username,
          container,
          title,
          author,
          subject,
          topicMisc,
          action,
          tags: null,
          execute,
        };

        // 添加至列表
        this.pushData(item.nFilter);
      }

      // 开始过滤
      item.nFilter.execute();
    }

    /**
     * 过滤回复
     * @param {*} item 回复内容，见 commonui.postArg.data
     */
    filterReply(item) {
      // 跳过泥潭增加的额外内容
      if (Tools.getType(item) !== "object") {
        return;
      }

      // 绑定事件
      if (item.nFilter === undefined) {
        // 主题 ID
        const tid = item.tid;

        // 回复 ID
        const pid = item.pid;

        // 判断是否是楼层
        const isFloor = typeof item.i === "number";

        // 回复容器
        const container = isFloor
          ? item.uInfoC.closest("tr")
          : item.uInfoC.closest(".comment_c");

        // 回复标题
        const title = item.subjectC;
        const subject = title.innerText;

        // 回复内容
        const content = item.contentC;
        const contentBak = content.innerHTML;

        // 回复作者
        const author =
          container.querySelector(".posterInfoLine") || item.uInfoC;
        const uid = parseInt(item.pAid, 10) || 0;
        const username = author.querySelector(".author").innerText;
        const avatar = author.querySelector(".avatar");

        // 找到用户 ID，将其视为操作按钮
        const action = container.querySelector('[name="uid"]');

        // 创建一个元素，用于展示标记列表
        // 贴条和高赞不显示
        const tags = (() => {
          if (isFloor === false) {
            return null;
          }

          const element = document.createElement("div");

          element.className = "filter-tags";

          author.appendChild(element);

          return element;
        })();

        // 过滤函数
        const execute = async () => {
          // 获取过滤模式
          const filterMode = await this.getFilterMode(item.nFilter);

          // 样式处理
          (() => {
            // 还原样式
            // TODO 应该整体采用 className 来实现
            (() => {
              // 标记模式
              if (avatar) {
                avatar.style.removeProperty("display");
              }

              content.innerHTML = contentBak;

              // 遮罩模式
              const caption = container.parentNode.querySelector("CAPTION");

              if (caption) {
                container.parentNode.removeChild(caption);
                container.style.removeProperty("display");
              }
            })();

            // 样式处理
            (() => {
              // 标记模式下，隐藏头像，采用泥潭的折叠样式
              if (filterMode === "标记") {
                if (avatar) {
                  avatar.style.display = "none";
                }

                this.ui.collapse(uid, content, contentBak);
                return;
              }

              // 遮罩模式下，楼层会有遮罩样式
              if (filterMode === "遮罩") {
                const caption = document.createElement("CAPTION");

                if (isFloor) {
                  caption.className = "filter-mask filter-mask-block";
                } else {
                  caption.className = "filter-mask filter-mask-block left";
                  caption.style.width = "47%";
                }

                caption.style.textAlign = "center";
                caption.innerHTML = `<span class="filter-mask-hint">Troll must die.</span>`;
                caption.onclick = () => {
                  const caption = container.parentNode.querySelector("CAPTION");

                  if (caption) {
                    container.parentNode.removeChild(caption);
                    container.style.removeProperty("display");
                  }
                };

                container.parentNode.insertBefore(caption, container);
                container.style.display = "none";
                return;
              }

              // 隐藏模式下，容器会被隐藏
              if (filterMode === "隐藏") {
                container.style.display = "none";
                return;
              }
            })();

            // 非隐藏模式下，恢复显示
            // 楼层的遮罩模式下仍需隐藏
            if (["遮罩", "隐藏"].includes(filterMode) === false) {
              container.style.removeProperty("display");
            }
          })();

          // 过滤引用
          this.filterQuote(item);
        };

        // 绑定事件
        item.nFilter = {
          tid,
          pid,
          uid,
          fid: null,
          username,
          container,
          title,
          author,
          subject,
          content: content.innerText,
          topicMisc: "",
          action,
          tags,
          execute,
        };

        // 添加至列表
        this.pushData(item.nFilter);
      }

      // 开始过滤
      item.nFilter.execute();
    }

    /**
     * 过滤引用
     * @param {*} item 回复内容，见 commonui.postArg.data
     */
    filterQuote(item) {
      // 未绑定事件，直接跳过
      if (item.nFilter === undefined) {
        return;
      }

      // 回复内容
      const content = item.contentC;

      // 找到所有引用
      const quotes = content.querySelectorAll(".quote");

      // 处理引用
      [...quotes].map(async (quote) => {
        const { uid, username } = (() => {
          const ele = quote.querySelector("A[href^='/nuke.php']");

          if (ele) {
            const res = ele.getAttribute("href").match(/uid=(\S+)/);

            if (res) {
              return {
                uid: parseInt(res[1], 10),
                username: ele.innerText.substring(1, ele.innerText.length - 1),
              };
            }
          }

          return {
            uid: 0,
          };
        })();

        const { tid, pid } = (() => {
          const ele = quote.querySelector("[title='快速浏览这个帖子']");

          if (ele) {
            const res = ele
              .getAttribute("onclick")
              .match(/fastViewPost(.+,(\S+),(\S+|undefined),.+)/);

            if (res) {
              return {
                tid: parseInt(res[2], 10),
                pid: parseInt(res[3], 10) || 0,
              };
            }
          }

          return {};
        })();

        // 临时的 nFilter
        const nFilter = {
          tid,
          pid,
          uid,
          fid: null,
          username,
          subject: "",
          content: quote.innerText,
          topicMisc: "",
          action: null,
          tags: null,
        };

        // 获取过滤模式
        const filterMode = await this.getFilterMode(nFilter);

        (() => {
          if (filterMode === "标记") {
            this.ui.collapse(uid, quote, quote.innerHTML);
            return;
          }

          if (filterMode === "遮罩") {
            const source = document.createElement("DIV");

            source.innerHTML = quote.innerHTML;
            source.style.display = "none";

            const caption = document.createElement("CAPTION");

            caption.className = "filter-mask filter-mask-block";

            caption.style.textAlign = "center";
            caption.innerHTML = `<span class="filter-mask-hint">Troll must die.</span>`;
            caption.onclick = () => {
              quote.removeChild(caption);

              source.style.display = "";
            };

            quote.innerHTML = "";
            quote.appendChild(source);
            quote.appendChild(caption);
            return;
          }

          if (filterMode === "隐藏") {
            quote.innerHTML = "";
            return;
          }
        })();

        // 绑定引用
        item.nFilter.quotes = item.nFilter.quotes || {};
        item.nFilter.quotes[uid] = nFilter.filterMode;
      });
    }

    /**
     * 过滤提醒
     * @param {*} container 提醒容器
     * @param {*} item      提醒内容
     */
    async filterNotification(container, item) {
      // 临时的 nFilter
      const nFilter = {
        ...item,
        fid: null,
        topicMisc: "",
        action: null,
        tags: null,
      };

      // 获取过滤模式
      const filterMode = await this.getFilterMode(nFilter);

      // 样式处理
      (() => {
        // 标记模式下，容器会有删除线标识
        if (filterMode === "标记") {
          container.style.textDecoration = "line-through";
          return;
        }

        // 遮罩模式下，容器会有遮罩样式
        if (filterMode === "遮罩") {
          container.classList.add("filter-mask");
          return;
        }

        // 隐藏模式下，容器会被隐藏
        if (filterMode === "隐藏") {
          container.style.display = "none";
          return;
        }
      })();
    }
  }

  /**
   * 列表模块
   */
  class ListModule extends Module {
    /**
     * 模块名称
     */
    static name = "list";

    /**
     * 模块标签
     */
    static label = "列表";

    /**
     * 顺序
     */
    static order = 10;

    /**
     * 表格列
     * @returns {Array} 表格列集合
     */
    columns() {
      return [
        { label: "内容", ellipsis: true },
        { label: "过滤模式", center: true, width: 1 },
        { label: "原因", width: 1 },
      ];
    }

    /**
     * 表格项
     * @param   {*}     item 绑定的 nFilter
     * @returns {Array}      表格项集合
     */
    column(item) {
      const { ui } = this;
      const { tid, pid, filterMode, reason } = item;

      // 移除 BR 标签
      item.content = (item.content || "").replace(/<br>/g, "");

      // 内容
      const content = (() => {
        if (pid) {
          return ui.createElement("A", item.content, {
            href: `/read.php?pid=${pid}&nofilter`,
            title: item.content,
          });
        }

        // 如果有 TID 但没有标题，是引用，采用内容逻辑
        if (item.subject.length === 0) {
          return ui.createElement("A", item.content, {
            href: `/read.php?tid=${tid}&nofilter`,
            title: item.content,
          });
        }

        return ui.createElement("A", item.subject, {
          href: `/read.php?tid=${tid}&nofilter`,
          title: item.content,
          className: "b nobr",
        });
      })();

      // 原因
      const ellipsisReason = (() => {
        if (reason.length < 20) {
          return reason;
        }

        return ui.createElement("SPAN", item.reason.substring(0, 18) + "...", {
          title: item.reason,
        });
      })();

      return [content, filterMode, ellipsisReason];
    }

    /**
     * 初始化组件
     */
    initComponents() {
      super.initComponents();

      const { tabs, content } = this.ui.views;

      const table = this.ui.createTable(this.columns());

      const tab = this.ui.createTab(
        tabs,
        this.constructor.label,
        this.constructor.order,
        {
          onclick: () => {
            this.render(content);
          },
        }
      );

      Object.assign(this.views, {
        tab,
        table,
      });

      this.views.container.appendChild(table);
    }

    /**
     * 渲染
     * @param {HTMLElement} container 容器
     */
    render(container) {
      super.render(container);

      const { table } = this.views;

      if (table) {
        const { add, clear } = table;

        clear();

        const list = this.data.filter((item) => {
          return (item.filterMode || "显示") !== "显示";
        });

        Object.values(list).forEach((item) => {
          const column = this.column(item);

          add(...column);
        });
      }
    }

    /**
     * 通知
     * @param {*} item 绑定的 nFilter
     */
    async notify() {
      // 获取过滤后的数量
      const count = this.data.filter((item) => {
        return (item.filterMode || "显示") !== "显示";
      }).length;

      // 更新菜单文字
      const { ui } = this;
      const { menu } = ui;

      if (menu === null) {
        return;
      }

      if (count) {
        menu.innerHTML = `${ui.constructor.label} <span class="small_colored_text_btn stxt block_txt_c0 vertmod">${count}</span>`;
      } else {
        menu.innerHTML = `${ui.constructor.label}`;
      }

      // 重新渲染
      // TODO 应该给 table 增加一个判重的逻辑，这样只需要更新过滤后的内容即可
      const { tab } = this.views;

      if (tab.querySelector("A").className === "nobr") {
        this.render(ui.views.content);
      }
    }
  }

  /**
   * 用户模块
   */
  class UserModule extends Module {
    /**
     * 模块名称
     */
    static name = "user";

    /**
     * 模块标签
     */
    static label = "用户";

    /**
     * 顺序
     */
    static order = 20;

    /**
     * 获取列表
     */
    get list() {
      return this.settings.users;
    }

    /**
     * 获取用户
     * @param {Number} uid 用户 ID
     */
    get(uid) {
      // 获取列表
      const list = this.list;

      // 如果存在，则返回信息
      if (list[uid]) {
        return list[uid];
      }

      return null;
    }

    /**
     * 添加用户
     * @param {Number} uid 用户 ID
     */
    add(uid, values) {
      // 获取列表
      const list = this.list;

      // 如果已存在，则返回信息
      if (list[uid]) {
        return list[uid];
      }

      // 写入用户信息
      list[uid] = values;

      // 保存数据
      this.settings.users = list;

      // 重新过滤
      this.reFilter(uid);

      // 返回添加的用户
      return values;
    }

    /**
     * 编辑用户
     * @param {Number} uid    用户 ID
     * @param {*}      values 用户信息
     */
    update(uid, values) {
      // 获取列表
      const list = this.list;

      // 如果不存在则跳过
      if (Object.hasOwn(list, uid) === false) {
        return null;
      }

      // 获取用户
      const entity = list[uid];

      // 更新用户
      Object.assign(entity, values);

      // 保存数据
      this.settings.users = list;

      // 重新过滤
      this.reFilter(uid);

      // 返回编辑的用户
      return entity;
    }

    /**
     * 删除用户
     * @param   {Number}        uid 用户 ID
     * @returns {Object | null}     删除的用户
     */
    remove(uid) {
      // 获取列表
      const list = this.list;

      // 如果不存在则跳过
      if (Object.hasOwn(list, uid) === false) {
        return null;
      }

      // 获取用户
      const entity = list[uid];

      // 删除用户
      delete list[uid];

      // 保存数据
      this.settings.users = list;

      // 重新过滤
      this.reFilter(uid);

      // 返回删除的用户
      return entity;
    }

    /**
     * 格式化
     * @param {Number}             uid  用户 ID
     * @param {String | undefined} name 用户名称
     */
    format(uid, name) {
      if (uid <= 0) {
        return null;
      }

      const { ui } = this;

      const user = this.get(uid);

      if (user) {
        name = user.name;
      }

      const username = name ? "@" + name : "#" + uid;

      return ui.createElement("A", `[${username}]`, {
        className: "b nobr",
        href: `/nuke.php?func=ucp&uid=${uid}`,
      });
    }

    /**
     * 表格列
     * @returns {Array} 表格列集合
     */
    columns() {
      return [
        { label: "昵称" },
        { label: "过滤模式", center: true, width: 1 },
        { label: "操作", width: 1 },
      ];
    }

    /**
     * 表格项
     * @param   {*}     item 用户信息
     * @returns {Array}      表格项集合
     */
    column(item) {
      const { ui } = this;
      const { table } = this.views;
      const { id, name, filterMode } = item;

      // 昵称
      const user = this.format(id, name);

      // 切换过滤模式
      const switchMode = ui.createButton(
        filterMode || this.settings.filterModes[0],
        () => {
          const newMode = this.settings.switchModeByName(switchMode.innerText);

          this.update(id, {
            filterMode: newMode,
          });

          switchMode.innerText = newMode;
        }
      );

      // 操作
      const buttons = (() => {
        const remove = ui.createButton("删除", (e) => {
          ui.confirm().then(() => {
            this.remove(id);

            table.remove(e);
          });
        });

        return ui.createButtonGroup(remove);
      })();

      return [user, switchMode, buttons];
    }

    /**
     * 初始化组件
     */
    initComponents() {
      super.initComponents();

      const { ui } = this;
      const { tabs, content, settings } = ui.views;
      const { add } = settings;

      const table = ui.createTable(this.columns());

      const tab = ui.createTab(
        tabs,
        this.constructor.label,
        this.constructor.order,
        {
          onclick: () => {
            this.render(content);
          },
        }
      );

      const keywordFilter = (() => {
        const input = ui.createElement("INPUT", [], {
          style: "flex: 1;",
          placeholder: "输入昵称关键字进行筛选",
        });

        const button = ui.createButton("筛选", () => {
          this.render(content, input.value);
        });

        const wrapper = ui.createElement("DIV", [input, button], {
          style: "display: flex; margin-top: 10px;",
        });

        return wrapper;
      })();

      Object.assign(this.views, {
        tab,
        table,
        keywordFilter,
      });

      this.views.container.appendChild(table);
      this.views.container.appendChild(keywordFilter);

      // 删除非激活中的用户
      {
        const list = ui.createElement("DIV", [], {
          style: "white-space: normal;",
        });

        const button = ui.createButton("删除非激活中的用户", () => {
          ui.confirm().then(() => {
            list.innerHTML = "";

            const users = Object.values(this.list);

            const waitingQueue = users.map(
              ({ id }) =>
                () =>
                  this.api.getUserInfo(id).then(({ bit }) => {
                    const activeInfo = commonui.activeInfo(0, 0, bit);
                    const activeType = activeInfo[1];

                    if (["ACTIVED", "LINKED"].includes(activeType)) {
                      return;
                    }

                    list.append(this.format(id));

                    this.remove(id);
                  })
            );

            const queueLength = waitingQueue.length;

            const execute = () => {
              if (waitingQueue.length) {
                const next = waitingQueue.shift();

                button.disabled = true;
                button.innerHTML = `删除非激活中的用户 (${
                  queueLength - waitingQueue.length
                }/${queueLength})`;

                next().finally(execute);
                return;
              }

              button.disabled = false;
            };

            execute();
          });
        });

        const element = ui.createElement("DIV", [button, list]);

        add(this.constructor.order + 0, element);
      }
    }

    /**
     * 渲染
     * @param {HTMLElement} container 容器
     * @param {String}      keyword   关键字
     */
    render(container, keyword = "") {
      super.render(container);

      const { table } = this.views;

      if (table) {
        const { add, clear } = table;

        clear();

        const list = keyword
          ? Object.values(this.list).filter((item) =>
              item.name.includes(keyword)
            )
          : Object.values(this.list);

        list.forEach((item) => {
          const column = this.column(item);

          add(...column);
        });
      }
    }

    /**
     * 渲染详情
     * @param {Number}             uid      用户 ID
     * @param {String | undefined} name     用户名称
     * @param {Function}           callback 回调函数
     */
    renderDetails(uid, name, callback = () => {}) {
      const { ui, settings } = this;

      // 只允许同时存在一个详情页
      if (this.views.details) {
        if (this.views.details.parentNode) {
          this.views.details.parentNode.removeChild(this.views.details);
        }
      }

      // 获取用户信息
      const user = this.get(uid);

      if (user) {
        name = user.name;
      }

      const title =
        (user ? "编辑" : "添加") + `用户 - ${name ? name : "#" + uid}`;

      const filterMode = user ? user.filterMode : settings.filterModes[0];

      const switchMode = ui.createButton(filterMode, () => {
        const newMode = settings.switchModeByName(switchMode.innerText);

        switchMode.innerText = newMode;
      });

      const buttons = ui.createElement(
        "DIV",
        (() => {
          const remove = user
            ? ui.createButton("删除", () => {
                ui.confirm().then(() => {
                  this.remove(uid);

                  this.views.details._.hide();

                  callback("REMOVE");
                });
              })
            : null;

          const save = ui.createButton("保存", () => {
            if (user === null) {
              const entity = this.add(uid, {
                id: uid,
                name,
                tags: [],
                filterMode: switchMode.innerText,
              });

              this.views.details._.hide();

              callback("ADD", entity);
            } else {
              const entity = this.update(uid, {
                name,
                filterMode: switchMode.innerText,
              });

              this.views.details._.hide();

              callback("UPDATE", entity);
            }
          });

          return ui.createButtonGroup(remove, save);
        })(),
        {
          className: "right_",
        }
      );

      const actions = ui.createElement(
        "DIV",
        [ui.createElement("SPAN", "过滤模式："), switchMode, buttons],
        {
          style: "margin-top: 10px;",
        }
      );

      const tips = ui.createElement("DIV", TIPS.filterMode, {
        className: "silver",
        style: "margin-top: 10px;",
      });

      const content = ui.createElement("DIV", [actions, tips], {
        style: "width: 80vw",
      });

      // 创建弹出框
      this.views.details = ui.createDialog(null, title, content);
    }

    /**
     * 过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filter(item, result) {
      // 获取用户信息
      const user = this.get(item.uid);

      // 没有则跳过
      if (user === null) {
        return;
      }

      // 获取用户过滤模式
      const mode = this.settings.getModeByName(user.filterMode);

      // 不高于当前过滤模式则跳过
      if (mode <= result.mode) {
        return;
      }

      // 更新过滤模式和原因
      result.mode = mode;
      result.reason = `用户模式: ${user.filterMode}`;
    }

    /**
     * 通知
     * @param {*} item 绑定的 nFilter
     */
    async notify(item) {
      const { uid, username, action } = item;

      // 如果没有 action 组件则跳过
      if (action === null) {
        return;
      }

      // 如果是匿名，隐藏组件
      if (uid <= 0) {
        action.style.display = "none";
        return;
      }

      // 获取当前用户
      const user = this.get(uid);

      // 修改操作按钮文字
      if (action.tagName === "A") {
        action.innerText = "屏蔽";
      } else {
        action.title = "屏蔽";
      }

      // 修改操作按钮颜色
      if (user) {
        action.style.background = "#CB4042";
      } else {
        action.style.background = "#AAA";
      }

      // 绑定事件
      action.onclick = () => {
        this.renderDetails(uid, username);
      };
    }

    /**
     * 重新过滤
     * @param {Number} uid 用户 ID
     */
    reFilter(uid) {
      this.data.forEach((item) => {
        // 如果用户 ID 一致，则重新过滤
        if (item.uid === uid) {
          item.execute();
          return;
        }

        // 如果有引用，也重新过滤
        if (Object.hasOwn(item.quotes || {}, uid)) {
          item.execute();
          return;
        }
      });
    }
  }

  /**
   * 标记模块
   */
  class TagModule extends Module {
    /**
     * 模块名称
     */
    static name = "tag";

    /**
     * 模块标签
     */
    static label = "标记";

    /**
     * 顺序
     */
    static order = 30;

    /**
     * 依赖模块
     */
    static depends = [UserModule];

    /**
     * 依赖的用户模块
     * @returns {UserModule} 用户模块
     */
    get userModule() {
      return this.depends[UserModule.name];
    }

    /**
     * 获取列表
     */
    get list() {
      return this.settings.tags;
    }

    /**
     * 获取标记
     * @param {Number} id   标记 ID
     * @param {String} name 标记名称
     */
    get({ id, name }) {
      // 获取列表
      const list = this.list;

      // 通过 ID 获取标记
      if (list[id]) {
        return list[id];
      }

      // 通过名称获取标记
      if (name) {
        const tag = Object.values(list).find((item) => item.name === name);

        if (tag) {
          return tag;
        }
      }

      return null;
    }

    /**
     * 添加标记
     * @param {String} name 标记名称
     */
    add(name) {
      // 获取对应的标记
      const tag = this.get({ name });

      // 如果标记已存在，则返回标记信息，否则增加标记
      if (tag) {
        return tag;
      }

      // 获取列表
      const list = this.list;

      // ID 为最大值 + 1
      const id = Math.max(...Object.keys(list), 0) + 1;

      // 标记的颜色
      const color = Tools.generateColor(name);

      // 写入标记信息
      list[id] = {
        id,
        name,
        color,
        filterMode: this.settings.filterModes[0],
      };

      // 保存数据
      this.settings.tags = list;

      // 返回添加的标记
      return list[id];
    }

    /**
     * 编辑标记
     * @param {Number} id     标记 ID
     * @param {*}      values 标记信息
     */
    update(id, values) {
      // 获取列表
      const list = this.list;

      // 如果不存在则跳过
      if (Object.hasOwn(list, id) === false) {
        return null;
      }

      // 获取标记
      const entity = list[id];

      // 获取相关的用户
      const users = Object.values(this.userModule.list).filter((user) =>
        user.tags.includes(id)
      );

      // 更新标记
      Object.assign(entity, values);

      // 保存数据
      this.settings.tags = list;

      // 重新过滤
      this.reFilter(users);
    }

    /**
     * 删除标记
     * @param {Number} id 标记 ID
     */
    remove(id) {
      // 获取列表
      const list = this.list;

      // 如果不存在则跳过
      if (Object.hasOwn(list, id) === false) {
        return null;
      }

      // 获取标记
      const entity = list[id];

      // 获取相关的用户
      const users = Object.values(this.userModule.list).filter((user) =>
        user.tags.includes(id)
      );

      // 删除标记
      delete list[id];

      // 删除相关的用户标记
      users.forEach((user) => {
        const index = user.tags.findIndex((item) => item === id);

        if (index >= 0) {
          user.tags.splice(index, 1);
        }
      });

      // 保存数据
      this.settings.tags = list;

      // 重新过滤
      this.reFilter(users);

      // 返回删除的标记
      return entity;
    }

    /**
     * 格式化
     * @param {Number}             id   标记 ID
     * @param {String | undefined} name 标记名称
     * @param {String | undefined} name 标记颜色
     */
    format(id, name, color) {
      const { ui } = this;

      if (id >= 0) {
        const tag = this.get({ id });

        if (tag) {
          name = tag.name;
          color = tag.color;
        }
      }

      if (name && color) {
        return ui.createElement("B", name, {
          className: "block_txt nobr",
          style: `background: ${color}; color: #FFF; margin: 0.1em 0.2em;`,
        });
      }

      return "";
    }

    /**
     * 表格列
     * @returns {Array} 表格列集合
     */
    columns() {
      return [
        { label: "标记", width: 1 },
        { label: "列表" },
        { label: "过滤模式", width: 1 },
        { label: "操作", width: 1 },
      ];
    }

    /**
     * 表格项
     * @param   {*}     item 标记信息
     * @returns {Array}      表格项集合
     */
    column(item) {
      const { ui } = this;
      const { table } = this.views;
      const { id, filterMode } = item;

      // 标记
      const tag = this.format(id);

      // 用户列表
      const list = Object.values(this.userModule.list)
        .filter(({ tags }) => tags.includes(id))
        .map(({ id }) => this.userModule.format(id));

      const group = ui.createElement("DIV", list, {
        style: "white-space: normal; display: none;",
      });

      const switchButton = ui.createButton(list.length.toString(), () => {
        if (group.style.display === "none") {
          group.style.removeProperty("display");
        } else {
          group.style.display = "none";
        }
      });

      // 切换过滤模式
      const switchMode = ui.createButton(
        filterMode || this.settings.filterModes[0],
        () => {
          const newMode = this.settings.switchModeByName(switchMode.innerText);

          this.update(id, {
            filterMode: newMode,
          });

          switchMode.innerText = newMode;
        }
      );

      // 操作
      const buttons = (() => {
        const remove = ui.createButton("删除", (e) => {
          ui.confirm().then(() => {
            this.remove(id);

            table.remove(e);
          });
        });

        return ui.createButtonGroup(remove);
      })();

      return [tag, [switchButton, group], switchMode, buttons];
    }

    /**
     * 初始化组件
     */
    initComponents() {
      super.initComponents();

      const { ui } = this;
      const { tabs, content, settings } = ui.views;
      const { add } = settings;

      const table = ui.createTable(this.columns());

      const tab = ui.createTab(
        tabs,
        this.constructor.label,
        this.constructor.order,
        {
          onclick: () => {
            this.render(content);
          },
        }
      );

      Object.assign(this.views, {
        tab,
        table,
      });

      this.views.container.appendChild(table);

      // 删除没有标记的用户
      {
        const button = ui.createButton("删除没有标记的用户", () => {
          ui.confirm().then(() => {
            const users = Object.values(this.userModule.list);

            users.forEach(({ id, tags }) => {
              if (tags.length > 0) {
                return;
              }

              this.userModule.remove(id);
            });
          });
        });

        const element = ui.createElement("DIV", button);

        add(this.constructor.order + 0, element);
      }

      // 删除没有用户的标记
      {
        const button = ui.createButton("删除没有用户的标记", () => {
          ui.confirm().then(() => {
            const items = Object.values(this.list);
            const users = Object.values(this.userModule.list);

            items.forEach(({ id }) => {
              if (users.find(({ tags }) => tags.includes(id))) {
                return;
              }

              this.remove(id);
            });
          });
        });

        const element = ui.createElement("DIV", button);

        add(this.constructor.order + 1, element);
      }
    }

    /**
     * 渲染
     * @param {HTMLElement} container 容器
     */
    render(container) {
      super.render(container);

      const { table } = this.views;

      if (table) {
        const { add, clear } = table;

        clear();

        Object.values(this.list).forEach((item) => {
          const column = this.column(item);

          add(...column);
        });
      }
    }

    /**
     * 过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filter(item, result) {
      // 获取用户信息
      const user = this.userModule.get(item.uid);

      // 没有则跳过
      if (user === null) {
        return;
      }

      // 获取用户标记
      const tags = user.tags;

      // 取最高的过滤模式
      // 低于当前的过滤模式则跳过
      let max = result.mode;
      let tag = null;

      for (const id of tags) {
        const entity = this.get({ id });

        if (entity === null) {
          continue;
        }

        // 获取过滤模式
        const mode = this.settings.getModeByName(entity.filterMode);

        if (mode < max) {
          continue;
        }

        if (mode === max && result.reason.includes("用户模式") === false) {
          continue;
        }

        max = mode;
        tag = entity;
      }

      // 没有匹配的则跳过
      if (tag === null) {
        return;
      }

      // 更新过滤模式和原因
      result.mode = max;
      result.reason = `标记: ${tag.name}`;
    }

    /**
     * 通知
     * @param {*} item 绑定的 nFilter
     */
    async notify(item) {
      const { uid, tags } = item;

      // 如果没有 tags 组件则跳过
      if (tags === null) {
        return;
      }

      // 如果是匿名，隐藏组件
      if (uid <= 0) {
        tags.style.display = "none";
        return;
      }

      // 删除旧标记
      [...tags.querySelectorAll("[tid]")].forEach((item) => {
        tags.removeChild(item);
      });

      // 获取当前用户
      const user = this.userModule.get(uid);

      // 如果没有用户，则跳过
      if (user === null) {
        return;
      }

      // 格式化标记
      const items = user.tags.map((id) => {
        const item = this.format(id);

        if (item) {
          item.setAttribute("tid", id);
        }

        return item;
      });

      // 加入组件
      items.forEach((item) => {
        if (item) {
          tags.appendChild(item);
        }
      });
    }

    /**
     * 重新过滤
     * @param {Array} users 用户集合
     */
    reFilter(users) {
      users.forEach((user) => {
        this.userModule.reFilter(user.id);
      });
    }
  }

  /**
   * 关键字模块
   */
  class KeywordModule extends Module {
    /**
     * 模块名称
     */
    static name = "keyword";

    /**
     * 模块标签
     */
    static label = "关键字";

    /**
     * 顺序
     */
    static order = 40;

    /**
     * 获取列表
     */
    get list() {
      return this.settings.keywords;
    }

    /**
     * 将多个布尔值转换为二进制
     */
    boolsToBinary(...args) {
      let res = 0;

      for (let i = 0; i < args.length; i += 1) {
        if (args[i]) {
          res |= 1 << i;
        }
      }

      return res;
    }

    /**
     * 获取关键字
     * @param {Number} id 关键字 ID
     */
    get(id) {
      // 获取列表
      const list = this.list;

      // 如果存在，则返回信息
      if (list[id]) {
        return list[id];
      }

      return null;
    }

    /**
     * 添加关键字
     * @param {String} keyword     关键字
     * @param {String} filterMode  过滤模式
     * @param {Number} filterType  过滤类型，为一个二进制数，0b1 - 过滤标题，0b10 - 过滤内容，0b100 - 过滤昵称
     */
    add(keyword, filterMode, filterType) {
      // 获取列表
      const list = this.list;

      // ID 为最大值 + 1
      const id = Math.max(...Object.keys(list), 0) + 1;

      // 写入关键字信息
      list[id] = {
        id,
        keyword,
        filterMode,
        filterType,
      };

      // 保存数据
      this.settings.keywords = list;

      // 重新过滤
      this.reFilter();

      // 返回添加的关键字
      return list[id];
    }

    /**
     * 编辑关键字
     * @param {Number} id     关键字 ID
     * @param {*}      values 关键字信息
     */
    update(id, values) {
      // 获取列表
      const list = this.list;

      // 如果不存在则跳过
      if (Object.hasOwn(list, id) === false) {
        return null;
      }

      // 获取关键字
      const entity = list[id];

      // 更新关键字
      Object.assign(entity, values);

      // 保存数据
      this.settings.keywords = list;

      // 重新过滤
      this.reFilter();
    }

    /**
     * 删除关键字
     * @param {Number} id 关键字 ID
     */
    remove(id) {
      // 获取列表
      const list = this.list;

      // 如果不存在则跳过
      if (Object.hasOwn(list, id) === false) {
        return null;
      }

      // 获取关键字
      const entity = list[id];

      // 删除关键字
      delete list[id];

      // 保存数据
      this.settings.keywords = list;

      // 重新过滤
      this.reFilter();

      // 返回删除的关键字
      return entity;
    }

    /**
     * 获取帖子数据
     * @param {*} item 绑定的 nFilter
     */
    async getPostInfo(item) {
      const { tid, pid } = item;

      // 请求帖子数据
      const { subject, content, userInfo, reputation } =
        await this.api.getPostInfo(tid, pid);

      // 绑定用户信息和声望
      if (userInfo) {
        item.userInfo = userInfo;
        item.username = userInfo.username;
        item.reputation = reputation;
      }

      // 绑定标题和内容
      item.subject = subject;
      item.content = content;
    }

    /**
     * 表格列
     * @returns {Array} 表格列集合
     */
    columns() {
      return [
        { label: "关键字" },
        { label: "过滤模式", center: true, width: 1 },
        { label: "过滤标题", center: true, width: 1 },
        { label: "过滤内容", center: true, width: 1 },
        { label: "过滤昵称", center: true, width: 1 },
        { label: "操作", width: 1 },
      ];
    }

    /**
     * 表格项
     * @param   {*}     item 标记信息
     * @returns {Array}      表格项集合
     */
    column(item) {
      const { ui } = this;
      const { table } = this.views;
      const { id, keyword, filterMode } = item;

      // 兼容旧版本数据
      const filterType =
        item.filterType !== undefined
          ? item.filterType
          : item.filterLevel > 0
          ? 0b11
          : 0b01;

      // 关键字
      const input = ui.createElement("INPUT", [], {
        type: "text",
        value: keyword,
      });

      const inputWrapper = ui.createElement("DIV", input, {
        className: "filter-input-wrapper",
      });

      // 切换过滤模式
      const switchMode = ui.createButton(
        filterMode || this.settings.filterModes[0],
        () => {
          const newMode = this.settings.switchModeByName(switchMode.innerText);

          switchMode.innerText = newMode;
        }
      );

      // 过滤标题
      const switchTitle = ui.createElement("INPUT", [], {
        type: "checkbox",
        checked: filterType & 0b1,
      });

      // 过滤内容
      const switchContent = ui.createElement("INPUT", [], {
        type: "checkbox",
        checked: filterType & 0b10,
      });

      // 过滤昵称
      const switchUsername = ui.createElement("INPUT", [], {
        type: "checkbox",
        checked: filterType & 0b100,
      });

      // 操作
      const buttons = (() => {
        const save = ui.createButton("保存", () => {
          this.update(id, {
            keyword: input.value,
            filterMode: switchMode.innerText,
            filterType: this.boolsToBinary(
              switchTitle.checked,
              switchContent.checked,
              switchUsername.checked
            ),
          });
        });

        const remove = ui.createButton("删除", (e) => {
          ui.confirm().then(() => {
            this.remove(id);

            table.remove(e);
          });
        });

        return ui.createButtonGroup(save, remove);
      })();

      return [
        inputWrapper,
        switchMode,
        switchTitle,
        switchContent,
        switchUsername,
        buttons,
      ];
    }

    /**
     * 初始化组件
     */
    initComponents() {
      super.initComponents();

      const { ui } = this;
      const { tabs, content } = ui.views;

      const table = ui.createTable(this.columns());

      const tips = ui.createElement("DIV", TIPS.keyword, {
        className: "silver",
      });

      const tab = ui.createTab(
        tabs,
        this.constructor.label,
        this.constructor.order,
        {
          onclick: () => {
            this.render(content);
          },
        }
      );

      Object.assign(this.views, {
        tab,
        table,
      });

      this.views.container.appendChild(table);
      this.views.container.appendChild(tips);
    }

    /**
     * 渲染
     * @param {HTMLElement} container 容器
     */
    render(container) {
      super.render(container);

      const { table } = this.views;

      if (table) {
        const { add, clear } = table;

        clear();

        Object.values(this.list).forEach((item) => {
          const column = this.column(item);

          add(...column);
        });

        this.renderNewLine();
      }
    }

    /**
     * 渲染新行
     */
    renderNewLine() {
      const { ui } = this;
      const { table } = this.views;

      // 关键字
      const input = ui.createElement("INPUT", [], {
        type: "text",
      });

      const inputWrapper = ui.createElement("DIV", input, {
        className: "filter-input-wrapper",
      });

      // 切换过滤模式
      const switchMode = ui.createButton(this.settings.filterModes[0], () => {
        const newMode = this.settings.switchModeByName(switchMode.innerText);

        switchMode.innerText = newMode;
      });

      // 过滤标题
      const switchTitle = ui.createElement("INPUT", [], {
        type: "checkbox",
      });

      // 过滤内容
      const switchContent = ui.createElement("INPUT", [], {
        type: "checkbox",
      });

      // 过滤昵称
      const switchUsername = ui.createElement("INPUT", [], {
        type: "checkbox",
      });

      // 操作
      const buttons = (() => {
        const save = ui.createButton("添加", (e) => {
          const entity = this.add(
            input.value,
            switchMode.innerText,
            this.boolsToBinary(
              switchTitle.checked,
              switchContent.checked,
              switchUsername.checked
            )
          );

          table.update(e, ...this.column(entity));

          this.renderNewLine();
        });

        return ui.createButtonGroup(save);
      })();

      // 添加至列表
      table.add(
        inputWrapper,
        switchMode,
        switchTitle,
        switchContent,
        switchUsername,
        buttons
      );
    }

    /**
     * 过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filter(item, result) {
      // 获取列表
      const list = this.list;

      // 跳过低于当前的过滤模式
      const filtered = Object.values(list).filter(
        (item) => this.settings.getModeByName(item.filterMode) > result.mode
      );

      // 没有则跳过
      if (filtered.length === 0) {
        return;
      }

      // 根据过滤模式依次判断
      const sorted = Tools.sortBy(filtered, (item) =>
        this.settings.getModeByName(item.filterMode)
      );

      for (let i = 0; i < sorted.length; i += 1) {
        const { keyword, filterMode } = sorted[i];

        // 兼容旧版本数据
        // 过滤类型，为一个二进制数，0b1 - 过滤标题，0b10 - 过滤内容，0b100 - 过滤昵称
        const filterType =
          sorted[i].filterType !== undefined
            ? sorted[i].filterType
            : sorted[i].filterLevel > 0
            ? 0b11
            : 0b01;

        // 过滤标题
        if (filterType & 0b1) {
          const { subject } = item;

          const match = subject.match(keyword);

          if (match) {
            const mode = this.settings.getModeByName(filterMode);

            // 更新过滤模式和原因
            result.mode = mode;
            result.reason = `关键字: ${match[0]}`;
            return;
          }
        }

        // 过滤内容
        if (filterType & 0b10) {
          // 如果没有内容，则请求
          if (item.content === undefined) {
            await this.getPostInfo(item);
          }

          const { content } = item;

          if (content) {
            const match = content.match(keyword);

            if (match) {
              const mode = this.settings.getModeByName(filterMode);

              // 更新过滤模式和原因
              result.mode = mode;
              result.reason = `关键字: ${match[0]}`;
              return;
            }
          }
        }

        // 过滤昵称
        if (filterType & 0b100) {
          const { username } = item;

          if (username) {
            const match = username.match(keyword);

            if (match) {
              const mode = this.settings.getModeByName(filterMode);

              // 更新过滤模式和原因
              result.mode = mode;
              result.reason = `关键字: ${match[0]}`;
              return;
            }
          }
        }
      }
    }

    /**
     * 重新过滤
     */
    reFilter() {
      // 实际上应该根据过滤模式来筛选要过滤的部分
      this.data.forEach((item) => {
        item.execute();
      });
    }
  }

  /**
   * 属地模块
   */
  class LocationModule extends Module {
    /**
     * 模块名称
     */
    static name = "location";

    /**
     * 模块标签
     */
    static label = "属地";

    /**
     * 顺序
     */
    static order = 50;

    /**
     * 请求缓存
     */
    cache = {};

    /**
     * 获取列表
     */
    get list() {
      return this.settings.locations;
    }

    /**
     * 获取属地
     * @param {Number} id 属地 ID
     */
    get(id) {
      // 获取列表
      const list = this.list;

      // 如果存在，则返回信息
      if (list[id]) {
        return list[id];
      }

      return null;
    }

    /**
     * 添加属地
     * @param {String} keyword     关键字
     * @param {String} filterMode  过滤模式
     */
    add(keyword, filterMode) {
      // 获取列表
      const list = this.list;

      // ID 为最大值 + 1
      const id = Math.max(...Object.keys(list), 0) + 1;

      // 写入属地信息
      list[id] = {
        id,
        keyword,
        filterMode,
      };

      // 保存数据
      this.settings.locations = list;

      // 重新过滤
      this.reFilter();

      // 返回添加的属地
      return list[id];
    }

    /**
     * 编辑属地
     * @param {Number} id     属地 ID
     * @param {*}      values 属地信息
     */
    update(id, values) {
      // 获取列表
      const list = this.list;

      // 如果不存在则跳过
      if (Object.hasOwn(list, id) === false) {
        return null;
      }

      // 获取属地
      const entity = list[id];

      // 更新属地
      Object.assign(entity, values);

      // 保存数据
      this.settings.locations = list;

      // 重新过滤
      this.reFilter();
    }

    /**
     * 删除属地
     * @param {Number} id 属地 ID
     */
    remove(id) {
      // 获取列表
      const list = this.list;

      // 如果不存在则跳过
      if (Object.hasOwn(list, id) === false) {
        return null;
      }

      // 获取属地
      const entity = list[id];

      // 删除属地
      delete list[id];

      // 保存数据
      this.settings.locations = list;

      // 重新过滤
      this.reFilter();

      // 返回删除的属地
      return entity;
    }

    /**
     * 获取 IP 属地
     * @param {*} item 绑定的 nFilter
     */
    async getIpLocation(item) {
      const { uid } = item;

      // 如果是匿名直接跳过
      if (uid <= 0) {
        return null;
      }

      // 如果已有缓存，直接返回
      if (Object.hasOwn(this.cache, uid)) {
        return this.cache[uid];
      }

      // 请求属地
      const ipLocations = await this.api.getIpLocations(uid);

      // 写入缓存
      if (ipLocations.length > 0) {
        this.cache[uid] = ipLocations[0].ipLoc;
      }

      // 返回结果
      return null;
    }

    /**
     * 表格列
     * @returns {Array} 表格列集合
     */
    columns() {
      return [
        { label: "关键字" },
        { label: "过滤模式", center: true, width: 1 },
        { label: "操作", width: 1 },
      ];
    }

    /**
     * 表格项
     * @param   {*}     item 标记信息
     * @returns {Array}      表格项集合
     */
    column(item) {
      const { ui } = this;
      const { table } = this.views;
      const { id, keyword, filterMode } = item;

      // 关键字
      const input = ui.createElement("INPUT", [], {
        type: "text",
        value: keyword,
      });

      const inputWrapper = ui.createElement("DIV", input, {
        className: "filter-input-wrapper",
      });

      // 切换过滤模式
      const switchMode = ui.createButton(
        filterMode || this.settings.filterModes[0],
        () => {
          const newMode = this.settings.switchModeByName(switchMode.innerText);

          switchMode.innerText = newMode;
        }
      );

      // 操作
      const buttons = (() => {
        const save = ui.createButton("保存", () => {
          this.update(id, {
            keyword: input.value,
            filterMode: switchMode.innerText,
          });
        });

        const remove = ui.createButton("删除", (e) => {
          ui.confirm().then(() => {
            this.remove(id);

            table.remove(e);
          });
        });

        return ui.createButtonGroup(save, remove);
      })();

      return [inputWrapper, switchMode, buttons];
    }

    /**
     * 初始化组件
     */
    initComponents() {
      super.initComponents();

      const { ui } = this;
      const { tabs, content } = ui.views;

      const table = ui.createTable(this.columns());

      const tips = ui.createElement("DIV", TIPS.keyword, {
        className: "silver",
      });

      const tab = ui.createTab(
        tabs,
        this.constructor.label,
        this.constructor.order,
        {
          onclick: () => {
            this.render(content);
          },
        }
      );

      Object.assign(this.views, {
        tab,
        table,
      });

      this.views.container.appendChild(table);
      this.views.container.appendChild(tips);
    }

    /**
     * 渲染
     * @param {HTMLElement} container 容器
     */
    render(container) {
      super.render(container);

      const { table } = this.views;

      if (table) {
        const { add, clear } = table;

        clear();

        Object.values(this.list).forEach((item) => {
          const column = this.column(item);

          add(...column);
        });

        this.renderNewLine();
      }
    }

    /**
     * 渲染新行
     */
    renderNewLine() {
      const { ui } = this;
      const { table } = this.views;

      // 关键字
      const input = ui.createElement("INPUT", [], {
        type: "text",
      });

      const inputWrapper = ui.createElement("DIV", input, {
        className: "filter-input-wrapper",
      });

      // 切换过滤模式
      const switchMode = ui.createButton(this.settings.filterModes[0], () => {
        const newMode = this.settings.switchModeByName(switchMode.innerText);

        switchMode.innerText = newMode;
      });

      // 操作
      const buttons = (() => {
        const save = ui.createButton("添加", (e) => {
          const entity = this.add(input.value, switchMode.innerText);

          table.update(e, ...this.column(entity));

          this.renderNewLine();
        });

        return ui.createButtonGroup(save);
      })();

      // 添加至列表
      table.add(inputWrapper, switchMode, buttons);
    }

    /**
     * 过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filter(item, result) {
      // 获取列表
      const list = this.list;

      // 跳过低于当前的过滤模式
      const filtered = Object.values(list).filter(
        (item) => this.settings.getModeByName(item.filterMode) > result.mode
      );

      // 没有则跳过
      if (filtered.length === 0) {
        return;
      }

      // 获取当前属地
      const location = await this.getIpLocation(item);

      // 请求失败则跳过
      if (location === null) {
        return;
      }

      // 根据过滤模式依次判断
      const sorted = Tools.sortBy(filtered, (item) =>
        this.settings.getModeByName(item.filterMode)
      );

      for (let i = 0; i < sorted.length; i += 1) {
        const { keyword, filterMode } = sorted[i];

        const match = location.match(keyword);

        if (match) {
          const mode = this.settings.getModeByName(filterMode);

          // 更新过滤模式和原因
          result.mode = mode;
          result.reason = `属地: ${match[0]}`;
          return;
        }
      }
    }

    /**
     * 重新过滤
     */
    reFilter() {
      // 实际上应该根据过滤模式来筛选要过滤的部分
      this.data.forEach((item) => {
        item.execute();
      });
    }
  }

  /**
   * 版面或合集模块
   */
  class ForumOrSubsetModule extends Module {
    /**
     * 模块名称
     */
    static name = "forumOrSubset";

    /**
     * 模块标签
     */
    static label = "版面/合集";

    /**
     * 顺序
     */
    static order = 60;

    /**
     * 请求缓存
     */
    cache = {};

    /**
     * 获取列表
     */
    get list() {
      return this.settings.forumOrSubsets;
    }

    /**
     * 获取版面或合集
     * @param {Number} id ID
     */
    get(id) {
      // 获取列表
      const list = this.list;

      // 如果存在，则返回信息
      if (list[id]) {
        return list[id];
      }

      return null;
    }

    /**
     * 添加版面或合集
     * @param {Number} value       版面或合集链接
     * @param {String} filterMode  过滤模式
     */
    async add(value, filterMode) {
      // 获取链接参数
      const params = new URLSearchParams(value.split("?")[1]);

      // 获取 FID
      const fid = parseInt(params.get("fid"), 10);

      // 获取 STID
      const stid = parseInt(params.get("stid"), 10);

      // 如果 FID 或 STID 不存在，则提示错误
      if (fid === NaN && stid === NaN) {
        alert("版面或合集ID有误");
        return;
      }

      // 获取列表
      const list = this.list;

      // ID 为 FID 或者 t + STID
      const id = fid ? fid : `t${stid}`;

      // 如果版面或合集 ID 已存在，则提示错误
      if (Object.hasOwn(list, id)) {
        alert("已有相同版面或合集ID");
        return;
      }

      // 请求版面或合集信息
      const info = await (async () => {
        if (fid) {
          return await this.api.getForumInfo(fid);
        }

        if (stid) {
          const postInfo = await this.api.getPostInfo(stid);

          if (postInfo) {
            return {
              name: postInfo.subject,
            };
          }
        }

        return null;
      })();

      // 如果版面或合集不存在，则提示错误
      if (info === null || info === undefined) {
        alert("版面或合集ID有误");
        return;
      }

      // 写入版面或合集信息
      list[id] = {
        fid,
        stid,
        name: info.name,
        filterMode,
      };

      // 保存数据
      this.settings.forumOrSubsets = list;

      // 重新过滤
      this.reFilter();

      // 返回添加的版面或合集
      return list[id];
    }

    /**
     * 编辑版面或合集
     * @param {Number} id     ID
     * @param {*}      values 版面或合集信息
     */
    update(id, values) {
      // 获取列表
      const list = this.list;

      // 如果不存在则跳过
      if (Object.hasOwn(list, id) === false) {
        return null;
      }

      // 获取版面或合集
      const entity = list[id];

      // 更新版面或合集
      Object.assign(entity, values);

      // 保存数据
      this.settings.forumOrSubsets = list;

      // 重新过滤
      this.reFilter();
    }

    /**
     * 删除版面或合集
     * @param {Number} id ID
     */
    remove(id) {
      // 获取列表
      const list = this.list;

      // 如果不存在则跳过
      if (Object.hasOwn(list, id) === false) {
        return null;
      }

      // 获取版面或合集
      const entity = list[id];

      // 删除版面或合集
      delete list[id];

      // 保存数据
      this.settings.forumOrSubsets = list;

      // 重新过滤
      this.reFilter();

      // 返回删除的版面或合集
      return entity;
    }

    /**
     * 格式化版面或合集
     * @param {Number} fid  版面 ID
     * @param {Number} stid 合集 ID
     * @param {String} name 版面或合集名称
     */
    formatForumOrSubset(fid, stid, name) {
      const { ui } = this;

      return ui.createElement("A", `[${name}]`, {
        className: "b nobr",
        href: fid ? `/thread.php?fid=${fid}` : `/thread.php?stid=${stid}`,
      });
    }

    /**
     * 表格列
     * @returns {Array} 表格列集合
     */
    columns() {
      return [
        { label: "版面/合集" },
        { label: "过滤模式", center: true, width: 1 },
        { label: "操作", width: 1 },
      ];
    }

    /**
     * 表格项
     * @param   {*}     item 版面或合集信息
     * @returns {Array}      表格项集合
     */
    column(item) {
      const { ui } = this;
      const { table } = this.views;
      const { fid, stid, name, filterMode } = item;

      // ID 为 FID 或者 t + STID
      const id = fid ? fid : `t${stid}`;

      // 版面或合集
      const forum = this.formatForumOrSubset(fid, stid, name);

      // 切换过滤模式
      const switchMode = ui.createButton(filterMode || "隐藏", () => {
        const newMode = this.settings.switchModeByName(switchMode.innerText);

        switchMode.innerText = newMode;
      });

      // 操作
      const buttons = (() => {
        const save = ui.createButton("保存", () => {
          this.update(id, {
            filterMode: switchMode.innerText,
          });
        });

        const remove = ui.createButton("删除", (e) => {
          ui.confirm().then(() => {
            this.remove(id);

            table.remove(e);
          });
        });

        return ui.createButtonGroup(save, remove);
      })();

      return [forum, switchMode, buttons];
    }

    /**
     * 初始化组件
     */
    initComponents() {
      super.initComponents();

      const { ui } = this;
      const { tabs, content } = ui.views;

      const table = ui.createTable(this.columns());

      const tips = ui.createElement("DIV", TIPS.forumOrSubset, {
        className: "silver",
      });

      const tab = ui.createTab(
        tabs,
        this.constructor.label,
        this.constructor.order,
        {
          onclick: () => {
            this.render(content);
          },
        }
      );

      Object.assign(this.views, {
        tab,
        table,
      });

      this.views.container.appendChild(table);
      this.views.container.appendChild(tips);
    }

    /**
     * 渲染
     * @param {HTMLElement} container 容器
     */
    render(container) {
      super.render(container);

      const { table } = this.views;

      if (table) {
        const { add, clear } = table;

        clear();

        Object.values(this.list).forEach((item) => {
          const column = this.column(item);

          add(...column);
        });

        this.renderNewLine();
      }
    }

    /**
     * 渲染新行
     */
    renderNewLine() {
      const { ui } = this;
      const { table } = this.views;

      // 版面或合集 ID
      const forumInput = ui.createElement("INPUT", [], {
        type: "text",
      });

      const forumInputWrapper = ui.createElement("DIV", forumInput, {
        className: "filter-input-wrapper",
      });

      // 切换过滤模式
      const switchMode = ui.createButton("隐藏", () => {
        const newMode = this.settings.switchModeByName(switchMode.innerText);

        switchMode.innerText = newMode;
      });

      // 操作
      const buttons = (() => {
        const save = ui.createButton("添加", async (e) => {
          const entity = await this.add(forumInput.value, switchMode.innerText);

          if (entity) {
            table.update(e, ...this.column(entity));

            this.renderNewLine();
          }
        });

        return ui.createButtonGroup(save);
      })();

      // 添加至列表
      table.add(forumInputWrapper, switchMode, buttons);
    }

    /**
     * 过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filter(item, result) {
      // 没有版面 ID 或主题杂项则跳过
      if (item.fid === null && item.topicMisc.length === 0) {
        return;
      }

      // 获取列表
      const list = this.list;

      // 跳过低于当前的过滤模式
      const filtered = Object.values(list).filter(
        (item) => this.settings.getModeByName(item.filterMode) > result.mode
      );

      // 没有则跳过
      if (filtered.length === 0) {
        return;
      }

      // 解析主题杂项
      const { _SFID, _STID } = commonui.topicMiscVar.unpack(item.topicMisc);

      // 根据过滤模式依次判断
      const sorted = Tools.sortBy(filtered, (item) =>
        this.settings.getModeByName(item.filterMode)
      );

      for (let i = 0; i < sorted.length; i += 1) {
        const { fid, stid, name, filterMode } = sorted[i];

        if (fid) {
          if (fid === parseInt(item.fid, 10) || fid === _SFID) {
            const mode = this.settings.getModeByName(filterMode);

            // 更新过滤模式和原因
            result.mode = mode;
            result.reason = `版面: ${name}`;
            return;
          }
        }

        if (stid) {
          if (stid === parseInt(item.tid, 10) || stid === _STID) {
            const mode = this.settings.getModeByName(filterMode);

            // 更新过滤模式和原因
            result.mode = mode;
            result.reason = `合集: ${name}`;
            return;
          }
        }
      }
    }

    /**
     * 重新过滤
     */
    reFilter() {
      // 实际上应该根据过滤模式来筛选要过滤的部分
      this.data.forEach((item) => {
        item.execute();
      });
    }
  }

  /**
   * 猎巫模块
   *
   * 其实是通过 Cache 模块读取配置，而非 Settings
   */
  class HunterModule extends Module {
    /**
     * 模块名称
     */
    static name = "hunter";

    /**
     * 模块标签
     */
    static label = "猎巫";

    /**
     * 顺序
     */
    static order = 70;

    /**
     * 请求缓存
     */
    cache = {};

    /**
     * 请求队列
     */
    queue = [];

    /**
     * 获取列表
     */
    get list() {
      return this.settings.cache
        .get("WITCH_HUNT")
        .then((values) => values || []);
    }

    /**
     * 获取猎巫
     * @param {Number} fid 版面 ID
     */
    async get(fid) {
      // 获取列表
      const list = await this.list;

      // 如果存在，则返回信息
      if (list[fid]) {
        return list[fid];
      }

      return null;
    }

    /**
     * 添加猎巫
     * @param {Number} fid         版面 ID
     * @param {String} label       标签
     * @param {String} filterMode  过滤模式
     * @param {Number} filterLevel 过滤等级: 0 - 仅标记; 1 - 标记并过滤
     */
    async add(fid, label, filterMode, filterLevel) {
      // FID 只能是数字
      fid = parseInt(fid, 10);

      // 获取列表
      const list = await this.list;

      // 如果版面 ID 已存在，则提示错误
      if (Object.keys(list).includes(fid)) {
        alert("已有相同版面ID");
        return;
      }

      // 请求版面信息
      const info = await this.api.getForumInfo(fid);

      // 如果版面不存在，则提示错误
      if (info === null || info === undefined) {
        alert("版面ID有误");
        return;
      }

      // 计算标记颜色
      const color = Tools.generateColor(info.name);

      // 写入猎巫信息
      list[fid] = {
        fid,
        name: info.name,
        label,
        color,
        filterMode,
        filterLevel,
      };

      // 保存数据
      this.settings.cache.put("WITCH_HUNT", list);

      // 重新过滤
      this.reFilter(true);

      // 返回添加的猎巫
      return list[fid];
    }

    /**
     * 编辑猎巫
     * @param {Number} fid    版面 ID
     * @param {*}      values 猎巫信息
     */
    async update(fid, values) {
      // 获取列表
      const list = await this.list;

      // 如果不存在则跳过
      if (Object.hasOwn(list, fid) === false) {
        return null;
      }

      // 获取猎巫
      const entity = list[fid];

      // 更新猎巫
      Object.assign(entity, values);

      // 保存数据
      this.settings.cache.put("WITCH_HUNT", list);

      // 重新过滤，更新样式即可
      this.reFilter(false);
    }

    /**
     * 删除猎巫
     * @param {Number} fid 版面 ID
     */
    async remove(fid) {
      // 获取列表
      const list = await this.list;

      // 如果不存在则跳过
      if (Object.hasOwn(list, fid) === false) {
        return null;
      }

      // 获取猎巫
      const entity = list[fid];

      // 删除猎巫
      delete list[fid];

      // 保存数据
      this.settings.cache.put("WITCH_HUNT", list);

      // 重新过滤
      this.reFilter(true);

      // 返回删除的猎巫
      return entity;
    }

    /**
     * 格式化版面
     * @param {Number} fid  版面 ID
     * @param {String} name 版面名称
     */
    formatForum(fid, name) {
      const { ui } = this;

      return ui.createElement("A", `[${name}]`, {
        className: "b nobr",
        href: `/thread.php?fid=${fid}`,
      });
    }

    /**
     * 格式化标签
     * @param {String} name 标签名称
     * @param {String} name 标签颜色
     */
    formatLabel(name, color) {
      const { ui } = this;

      return ui.createElement("B", name, {
        className: "block_txt nobr",
        style: `background: ${color}; color: #FFF; margin: 0.1em 0.2em;`,
      });
    }

    /**
     * 表格列
     * @returns {Array} 表格列集合
     */
    columns() {
      return [
        { label: "版面", width: 200 },
        { label: "标签" },
        { label: "启用过滤", center: true, width: 1 },
        { label: "过滤模式", center: true, width: 1 },
        { label: "操作", width: 1 },
      ];
    }

    /**
     * 表格项
     * @param   {*}     item 猎巫信息
     * @returns {Array}      表格项集合
     */
    column(item) {
      const { ui } = this;
      const { table } = this.views;
      const { fid, name, label, color, filterMode, filterLevel } = item;

      // 版面
      const forum = this.formatForum(fid, name);

      // 标签
      const labelElement = this.formatLabel(label, color);

      // 启用过滤
      const switchLevel = ui.createElement("INPUT", [], {
        type: "checkbox",
        checked: filterLevel > 0,
      });

      // 切换过滤模式
      const switchMode = ui.createButton(
        filterMode || this.settings.filterModes[0],
        () => {
          const newMode = this.settings.switchModeByName(switchMode.innerText);

          switchMode.innerText = newMode;
        }
      );

      // 操作
      const buttons = (() => {
        const save = ui.createButton("保存", () => {
          this.update(fid, {
            filterMode: switchMode.innerText,
            filterLevel: switchLevel.checked ? 1 : 0,
          });
        });

        const remove = ui.createButton("删除", (e) => {
          ui.confirm().then(async () => {
            await this.remove(fid);

            table.remove(e);
          });
        });

        return ui.createButtonGroup(save, remove);
      })();

      return [forum, labelElement, switchLevel, switchMode, buttons];
    }

    /**
     * 初始化组件
     */
    initComponents() {
      super.initComponents();

      const { ui } = this;
      const { tabs, content } = ui.views;

      const table = ui.createTable(this.columns());

      const tips = ui.createElement(
        "DIV",
        [TIPS.hunter, TIPS.error].join("<br/>"),
        {
          className: "silver",
        }
      );

      const tab = ui.createTab(
        tabs,
        this.constructor.label,
        this.constructor.order,
        {
          onclick: () => {
            this.render(content);
          },
        }
      );

      Object.assign(this.views, {
        tab,
        table,
      });

      this.views.container.appendChild(table);
      this.views.container.appendChild(tips);
    }

    /**
     * 渲染
     * @param {HTMLElement} container 容器
     */
    render(container) {
      super.render(container);

      const { table } = this.views;

      if (table) {
        const { add, clear } = table;

        clear();

        this.list.then((values) => {
          Object.values(values).forEach((item) => {
            const column = this.column(item);

            add(...column);
          });

          this.renderNewLine();
        });
      }
    }

    /**
     * 渲染新行
     */
    renderNewLine() {
      const { ui } = this;
      const { table } = this.views;

      // 版面 ID
      const forumInput = ui.createElement("INPUT", [], {
        type: "text",
      });

      const forumInputWrapper = ui.createElement("DIV", forumInput, {
        className: "filter-input-wrapper",
      });

      // 标签
      const labelInput = ui.createElement("INPUT", [], {
        type: "text",
      });

      const labelInputWrapper = ui.createElement("DIV", labelInput, {
        className: "filter-input-wrapper",
      });

      // 启用过滤
      const switchLevel = ui.createElement("INPUT", [], {
        type: "checkbox",
      });

      // 切换过滤模式
      const switchMode = ui.createButton(this.settings.filterModes[0], () => {
        const newMode = this.settings.switchModeByName(switchMode.innerText);

        switchMode.innerText = newMode;
      });

      // 操作
      const buttons = (() => {
        const save = ui.createButton("添加", async (e) => {
          const entity = await this.add(
            forumInput.value,
            labelInput.value,
            switchMode.innerText,
            switchLevel.checked ? 1 : 0
          );

          if (entity) {
            table.update(e, ...this.column(entity));

            this.renderNewLine();
          }
        });

        return ui.createButtonGroup(save);
      })();

      // 添加至列表
      table.add(
        forumInputWrapper,
        labelInputWrapper,
        switchLevel,
        switchMode,
        buttons
      );
    }

    /**
     * 过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filter(item, result) {
      // 获取当前猎巫结果
      const hunter = item.hunter || [];

      // 如果没有猎巫结果，则跳过
      if (hunter.length === 0) {
        return;
      }

      // 获取列表
      const items = await this.list;

      // 筛选出匹配的猎巫
      const list = Object.values(items).filter(({ fid }) =>
        hunter.includes(fid)
      );

      // 取最高的过滤模式
      // 低于当前的过滤模式则跳过
      let max = result.mode;
      let res = null;

      for (const entity of list) {
        const { filterLevel, filterMode } = entity;

        // 仅标记
        if (filterLevel === 0) {
          continue;
        }

        // 获取过滤模式
        const mode = this.settings.getModeByName(filterMode);

        if (mode <= max) {
          continue;
        }

        max = mode;
        res = entity;
      }

      // 没有匹配的则跳过
      if (res === null) {
        return;
      }

      // 更新过滤模式和原因
      result.mode = max;
      result.reason = `猎巫: ${res.label}`;
    }

    /**
     * 通知
     * @param {*} item 绑定的 nFilter
     */
    async notify(item) {
      const { uid, tags } = item;

      // 如果没有 tags 组件则跳过
      if (tags === null) {
        return;
      }

      // 如果是匿名，隐藏组件
      if (uid <= 0) {
        tags.style.display = "none";
        return;
      }

      // 删除旧标签
      [...tags.querySelectorAll("[fid]")].forEach((item) => {
        tags.removeChild(item);
      });

      // 如果没有请求，开始请求
      if (Object.hasOwn(item, "hunter") === false) {
        this.execute(item);
        return;
      }

      // 获取当前猎巫结果
      const hunter = item.hunter;

      // 如果没有猎巫结果，则跳过
      if (hunter.length === 0) {
        return;
      }

      // 格式化标签
      const items = await Promise.all(
        hunter.map(async (fid) => {
          const item = await this.get(fid);

          if (item) {
            const element = this.formatLabel(item.label, item.color);

            element.setAttribute("fid", fid);

            return element;
          }

          return null;
        })
      );

      // 加入组件
      items.forEach((item) => {
        if (item) {
          tags.appendChild(item);
        }
      });
    }

    /**
     * 重新过滤
     * @param {Boolean} clear 是否清除缓存
     */
    reFilter(clear) {
      // 清除缓存
      if (clear) {
        this.cache = {};
      }

      // 重新过滤
      this.data.forEach((item) => {
        // 不需要清除缓存的话，只要重新加载标记
        if (clear === false) {
          item.hunter = [];
        }

        // 重新猎巫
        this.execute(item);
      });
    }

    /**
     * 猎巫
     * @param {*} item 绑定的 nFilter
     */
    async execute(item) {
      const { uid } = item;
      const { api, cache, queue, list } = this;

      // 如果是匿名，则跳过
      if (uid <= 0) {
        return;
      }

      // 初始化猎巫结果，用于标识正在猎巫
      item.hunter = item.hunter || [];

      // 获取列表
      const items = await list;

      // 没有设置且没有旧数据，直接跳过
      if (items.length === 0 && item.hunter.length === 0) {
        return;
      }

      // 重新过滤
      const reload = (newValue) => {
        const isEqual = newValue.sort().join() === item.hunter.sort().join();

        if (isEqual) {
          return;
        }

        item.hunter = newValue;
        item.execute();
      };

      // 创建任务
      const task = async () => {
        // 如果缓存里没有记录，请求数据并写入缓存
        if (Object.hasOwn(cache, uid) === false) {
          cache[uid] = [];

          await Promise.all(
            Object.keys(items).map(async (fid) => {
              // 转换为数字格式
              const id = parseInt(fid, 10);

              // 当前版面发言记录
              const result = await api.getForumPosted(id, uid);

              // 写入当前设置
              if (result) {
                cache[uid].push(id);
              }
            })
          );
        }

        // 重新过滤
        reload(cache[uid]);

        // 将当前任务移出队列
        queue.shift();

        // 如果还有任务，继续执行
        if (queue.length > 0) {
          queue[0]();
        }
      };

      // 队列里已经有任务
      const isRunning = queue.length > 0;

      // 加入队列
      queue.push(task);

      // 如果没有正在执行的任务，则立即执行
      if (isRunning === false) {
        task();
      }
    }
  }

  /**
   * 杂项模块
   */
  class MiscModule extends Module {
    /**
     * 模块名称
     */
    static name = "misc";

    /**
     * 模块标签
     */
    static label = "杂项";

    /**
     * 顺序
     */
    static order = 80;

    /**
     * 请求缓存
     */
    cache = {
      topicNums: {},
      topicRecents: {},
      topicPerPages: {},
    };

    /**
     * 获取用户信息（从页面上）
     * @param {*} item 绑定的 nFilter
     */
    getUserInfo(item) {
      const { uid } = item;

      // 如果是匿名直接跳过
      if (uid <= 0) {
        return;
      }

      // 回复页面可以直接获取到用户信息和声望
      if (commonui.userInfo) {
        // 取得用户信息
        const userInfo = commonui.userInfo.users[uid];

        // 绑定用户信息和声望
        if (userInfo) {
          item.userInfo = userInfo;
          item.username = userInfo.username;

          item.reputation = (() => {
            const reputations = commonui.userInfo.reputations;

            if (reputations) {
              for (let fid in reputations) {
                return reputations[fid][uid] || 0;
              }
            }

            return NaN;
          })();
        }
      }
    }

    /**
     * 获取帖子数据
     * @param {*} item 绑定的 nFilter
     */
    async getPostInfo(item) {
      const { tid, pid } = item;

      // 请求帖子数据
      const { subject, content, userInfo, reputation } =
        await this.api.getPostInfo(tid, pid);

      // 绑定用户信息和声望
      if (userInfo) {
        item.userInfo = userInfo;
        item.username = userInfo.username;
        item.reputation = reputation;
      }

      // 绑定标题和内容
      item.subject = subject;
      item.content = content;
    }

    /**
     * 获取主题数量
     * @param {*} item 绑定的 nFilter
     */
    async getTopicNum(item) {
      const { uid } = item;

      // 如果是匿名直接跳过
      if (uid <= 0) {
        return;
      }

      // 如果已有缓存，直接返回
      if (Object.hasOwn(this.cache.topicNums, uid)) {
        return this.cache.topicNums[uid];
      }

      // 请求数量
      const number = await this.api.getTopicNum(uid);

      // 写入缓存
      this.cache.topicNums[uid] = number;

      // 返回结果
      return number;
    }

    /**
     * 获取近期主题
     * @param {*} item 绑定的 nFilter
     */
    async getTopicRencent(item) {
      const { uid } = item;

      // 如果是匿名直接跳过
      if (uid <= 0) {
        return;
      }

      // 如果已有缓存，直接返回
      if (Object.hasOwn(this.cache.topicRecents, uid)) {
        return this.cache.topicRecents[uid];
      }

      // 请求近期主题
      const list = await this.api.getTopicRencent(uid);

      // 写入缓存
      this.cache.topicRecents[uid] = Array.isArray(list)
        ? list
        : Object.values(list);

      // 返回结果
      return this.cache.topicRecents[uid];
    }

    /**
     * 初始化组件
     */
    initComponents() {
      super.initComponents();

      const { settings, ui } = this;
      const { tabs, content } = ui.views;

      const tab = ui.createTab(
        tabs,
        this.constructor.label,
        this.constructor.order,
        {
          onclick: () => {
            this.render(content);
          },
        }
      );

      Object.assign(this.views, {
        tab,
      });

      const add = (order, ...elements) => {
        this.views.container.appendChild(
          ui.createElement("DIV", [...elements, ui.createElement("BR", [])], {
            order,
          })
        );
      };

      // 小号过滤（注册时间）
      {
        const input = ui.createElement("INPUT", [], {
          type: "text",
          value: settings.filterRegdateLimit / 86400000,
          maxLength: 4,
          style: "width: 48px;",
        });

        const button = ui.createButton("确认", () => {
          const newValue = (() => {
            const result = parseInt(input.value, 10);

            if (result > 0) {
              return result;
            }

            return 0;
          })();

          settings.filterRegdateLimit = newValue * 86400000;

          input.value = newValue;

          this.reFilter();
        });

        const element = ui.createElement("DIV", [
          "隐藏注册时间小于",
          input,
          "天的用户",
          button,
        ]);

        add(this.constructor.order + 0, element);
      }

      // 小号过滤（发帖数）
      {
        const input = ui.createElement("INPUT", [], {
          type: "text",
          value: settings.filterPostnumLimit,
          maxLength: 5,
          style: "width: 48px;",
        });

        const button = ui.createButton("确认", () => {
          const newValue = (() => {
            const result = parseInt(input.value, 10);

            if (result > 0) {
              return result;
            }

            return 0;
          })();

          settings.filterPostnumLimit = newValue;

          input.value = newValue;

          this.reFilter();
        });

        const element = ui.createElement("DIV", [
          "隐藏发帖数量小于",
          input,
          "贴的用户",
          button,
        ]);

        add(this.constructor.order + 1, element);
      }

      // 流量号过滤（日均发帖）
      {
        const input = ui.createElement("INPUT", [], {
          type: "text",
          value: settings.filterPostnumPerDayLimit || "",
          maxLength: 3,
          style: "width: 48px;",
        });

        const button = ui.createButton("确认", () => {
          const newValue = (() => {
            const result = parseInt(input.value, 10);

            if (result > 0) {
              return result;
            }

            return NaN;
          })();

          settings.filterPostnumPerDayLimit = newValue;

          input.value = newValue || "";

          this.reFilter();
        });

        const element = ui.createElement("DIV", [
          "隐藏日均发帖大于",
          input,
          "贴的用户",
          button,
        ]);

        const tips = ui.createElement("DIV", TIPS.filterPostnumPerDayLimit, {
          className: "silver",
        });

        add(
          this.constructor.order + 2,
          ui.createElement("DIV", [element, tips])
        );
      }

      // 巨魔过滤（近期删帖）
      {
        const input = ui.createElement("INPUT", [], {
          type: "text",
          value: settings.filterDeletedTopicLimit || "",
          maxLength: 3,
          style: "width: 48px;",
        });

        const button = ui.createButton("确认", () => {
          const newValue = (() => {
            const result = parseInt(input.value, 10);

            if (result > 0) {
              return result;
            }

            return NaN;
          })();

          settings.filterDeletedTopicLimit = newValue;

          input.value = newValue || "";

          this.reFilter();
        });

        const element = ui.createElement("DIV", [
          "隐藏近期删帖大于",
          input,
          "贴的用户",
          button,
        ]);

        const tips = ui.createElement("DIV", TIPS.error, {
          className: "silver",
        });

        add(
          this.constructor.order + 3,
          ui.createElement("DIV", [element, tips])
        );
      }

      // 流量号过滤（主题比例）
      {
        const input = ui.createElement("INPUT", [], {
          type: "text",
          value: settings.filterTopicRateLimit,
          maxLength: 3,
          style: "width: 48px;",
        });

        const button = ui.createButton("确认", () => {
          const newValue = (() => {
            const result = parseInt(input.value, 10);

            if (result > 0 && result <= 100) {
              return result;
            }

            return 100;
          })();

          settings.filterTopicRateLimit = newValue;

          input.value = newValue;

          this.reFilter();
        });

        const element = ui.createElement("DIV", [
          "隐藏主题比例大于",
          input,
          "%的用户",
          button,
        ]);

        const tips = ui.createElement("DIV", TIPS.error, {
          className: "silver",
        });

        add(
          this.constructor.order + 4,
          ui.createElement("DIV", [element, tips])
        );
      }

      // 流量号过滤（今日主题数量）
      {
        const input = ui.createElement("INPUT", [], {
          type: "text",
          value: settings.filterTopicPerDayLimit || "",
          maxLength: 3,
          style: "width: 48px;",
        });

        const button = ui.createButton("确认", () => {
          const newValue = (() => {
            const result = parseInt(input.value, 10);

            if (result > 0) {
              return result;
            }

            return NaN;
          })();

          settings.filterTopicPerDayLimit = newValue;

          input.value = newValue || "";

          this.reFilter();
        });

        const element = ui.createElement("DIV", [
          "隐藏今日主题大于",
          input,
          "贴的用户",
          button,
        ]);

        const tips = ui.createElement("DIV", TIPS.error, {
          className: "silver",
        });

        add(
          this.constructor.order + 5,
          ui.createElement("DIV", [element, tips])
        );
      }

      // 流量号过滤（每页主题数量）
      {
        const input = ui.createElement("INPUT", [], {
          type: "text",
          value: settings.filterTopicPerPageLimit || "",
          maxLength: 3,
          style: "width: 48px;",
        });

        const button = ui.createButton("确认", () => {
          const newValue = (() => {
            const result = parseInt(input.value, 10);

            if (result > 0) {
              return result;
            }

            return NaN;
          })();

          settings.filterTopicPerPageLimit = newValue;

          input.value = newValue || "";

          this.reFilter();
        });

        const element = ui.createElement("DIV", [
          "隐藏每页主题大于",
          input,
          "贴的用户",
          button,
        ]);

        const tips = ui.createElement("DIV", TIPS.filterTopicPerPage, {
          className: "silver",
        });

        add(
          this.constructor.order + 6,
          ui.createElement("DIV", [element, tips])
        );
      }

      // 声望过滤
      {
        const input = ui.createElement("INPUT", [], {
          type: "text",
          value: settings.filterReputationLimit || "",
          maxLength: 4,
          style: "width: 48px;",
        });

        const button = ui.createButton("确认", () => {
          const newValue = parseInt(input.value, 10);

          settings.filterReputationLimit = newValue;

          input.value = newValue || "";

          this.reFilter();
        });

        const element = ui.createElement("DIV", [
          "隐藏版面声望低于",
          input,
          "点的用户",
          button,
        ]);

        add(this.constructor.order + 7, element);
      }

      // 匿名过滤
      {
        const input = ui.createElement("INPUT", [], {
          type: "checkbox",
          checked: settings.filterAnonymous,
        });

        const label = ui.createElement("LABEL", ["隐藏匿名的用户", input], {
          style: "display: flex;",
        });

        const element = ui.createElement("DIV", label);

        input.onchange = () => {
          settings.filterAnonymous = input.checked;

          this.reFilter();
        };

        add(this.constructor.order + 8, element);
      }

      // 缩略图过滤
      {
        const items = {
          none: "禁用",
          all: "启用",
          thumbnail: "仅图片",
        };

        const select = ui.createElement(
          "SELECT",
          Object.keys(items).map((value) =>
            ui.createElement("OPTION", items[value], { value })
          ),
          {
            value: settings.filterThumbnail || "none",
          }
        );

        const label = ui.createElement(
          "LABEL",
          ["隐藏含缩略图的帖子", select],
          {
            style: "display: flex;",
          }
        );

        const element = ui.createElement("DIV", label);

        select.onchange = () => {
          settings.filterThumbnail = select.value;

          this.reFilter();
        };

        add(this.constructor.order + 9, element);
      }
    }

    /**
     * 过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filter(item, result) {
      // 获取隐藏模式下标
      const mode = this.settings.getModeByName("隐藏");

      // 如果当前模式不低于隐藏模式，则跳过
      if (result.mode >= mode) {
        return;
      }

      // 缩略图过滤
      await this.filterByThumbnail(item, result);

      // 匿名过滤
      await this.filterByAnonymous(item, result);

      // 注册时间过滤
      await this.filterByRegdate(item, result);

      // 版面声望过滤
      await this.filterByReputation(item, result);

      // 发帖数量过滤
      await this.filterByPostnum(item, result);

      // 日均发帖过滤
      await this.filterByPostnumPerDay(item, result);

      // 主题比例过滤
      await this.filterByTopicRate(item, result);

      // 今日主题数量过滤
      await this.filterByTopicPerDay(item, result);

      // 每页主题数量过滤
      await this.filterByTopicPerPage(item, result);

      // 近期删帖过滤
      await this.filterByDeletedTopic(item, result);
    }

    /**
     * 根据缩略图过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filterByThumbnail(item, result) {
      const { tid, title } = item;

      // 获取隐藏模式下标
      const mode = this.settings.getModeByName("隐藏");

      // 如果当前模式不低于隐藏模式，则跳过
      if (result.mode >= mode) {
        return;
      }

      // 找到对应数据
      const data = topicModule.data.find((item) => item[8] === tid);

      // 如果不含缩略图，则跳过
      if (data === undefined || data[20] === null) {
        return;
      }

      // 调整缩略图
      const handleThumbnail = () => {
        // 获取过滤缩略图设置
        const filterThumbnail = this.settings.filterThumbnail || "none";

        // 获取容器
        const container = title.parentNode;

        // 定位锚点
        const anchor = (() => {
          const img = container.querySelector("IMG");

          if (img) {
            return img.closest("DIV");
          }

          return null;
        })();

        // 如果没有锚点，则增加观察
        if (anchor === null) {
          const observer = new MutationObserver(handleThumbnail);

          observer.observe(container, {
            childList: true,
          });
        } else if (filterThumbnail === "none") {
          anchor.style.removeProperty("display");
        } else {
          anchor.style.display = "none";
        }

        return filterThumbnail;
      };

      // 更新过滤模式和原因
      if (handleThumbnail() === "all") {
        result.mode = mode;
        result.reason = "缩略图";
      }
    }

    /**
     * 根据匿名过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filterByAnonymous(item, result) {
      const { uid, username } = item;

      // 如果不是匿名，则跳过
      if (uid > 0) {
        return;
      }

      // 如果没有引用，则跳过
      if (username === undefined) {
        return;
      }

      // 获取隐藏模式下标
      const mode = this.settings.getModeByName("隐藏");

      // 如果当前模式不低于隐藏模式，则跳过
      if (result.mode >= mode) {
        return;
      }

      // 获取过滤匿名设置
      const filterAnonymous = this.settings.filterAnonymous;

      if (filterAnonymous) {
        // 更新过滤模式和原因
        result.mode = mode;
        result.reason = "匿名";
      }
    }

    /**
     * 根据注册时间过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filterByRegdate(item, result) {
      const { uid } = item;

      // 如果是匿名，则跳过
      if (uid <= 0) {
        return;
      }

      // 获取隐藏模式下标
      const mode = this.settings.getModeByName("隐藏");

      // 如果当前模式不低于隐藏模式，则跳过
      if (result.mode >= mode) {
        return;
      }

      // 获取注册时间限制
      const filterRegdateLimit = this.settings.filterRegdateLimit;

      // 未启用则跳过
      if (filterRegdateLimit <= 0) {
        return;
      }

      // 没有用户信息，优先从页面上获取
      if (item.userInfo === undefined) {
        this.getUserInfo(item);
      }

      // 没有再从接口获取
      if (item.userInfo === undefined) {
        await this.getPostInfo(item);
      }

      // 获取注册时间
      const { regdate } = item.userInfo || {};

      // 获取失败则跳过
      if (regdate === undefined) {
        return;
      }

      // 转换时间格式，泥潭接口只精确到秒
      const date = new Date(regdate * 1000);

      // 计算时间差
      const diff = Date.now() - date;

      // 判断是否符合条件
      if (diff > filterRegdateLimit) {
        return;
      }

      // 转换为天数
      const days = Math.floor(diff / 86400000);

      // 更新过滤模式和原因
      result.mode = mode;
      result.reason = `注册时间: ${days}天`;
    }

    /**
     * 根据发帖数量过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filterByPostnum(item, result) {
      const { uid } = item;

      // 如果是匿名，则跳过
      if (uid <= 0) {
        return;
      }

      // 获取隐藏模式下标
      const mode = this.settings.getModeByName("隐藏");

      // 如果当前模式不低于隐藏模式，则跳过
      if (result.mode >= mode) {
        return;
      }

      // 获取发帖数量限制
      const filterPostnumLimit = this.settings.filterPostnumLimit;

      // 未启用则跳过
      if (filterPostnumLimit <= 0) {
        return;
      }

      // 没有用户信息，优先从页面上获取
      if (item.userInfo === undefined) {
        this.getUserInfo(item);
      }

      // 没有再从接口获取
      if (item.userInfo === undefined) {
        await this.getPostInfo(item);
      }

      // 获取发帖数量
      const { postnum } = item.userInfo || {};

      // 获取失败则跳过
      if (postnum === undefined) {
        return;
      }

      // 判断是否符合条件
      if (postnum >= filterPostnumLimit) {
        return;
      }

      // 更新过滤模式和原因
      result.mode = mode;
      result.reason = `发帖数量: ${postnum}`;
    }

    /**
     * 根据日均发帖过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filterByPostnumPerDay(item, result) {
      const { uid } = item;

      // 如果是匿名，则跳过
      if (uid <= 0) {
        return;
      }

      // 获取隐藏模式下标
      const mode = this.settings.getModeByName("隐藏");

      // 如果当前模式不低于隐藏模式，则跳过
      if (result.mode >= mode) {
        return;
      }

      // 获取日均发帖限制
      const filterPostnumPerDayLimit = this.settings.filterPostnumPerDayLimit;

      // 未启用则跳过
      if (Number.isNaN(filterPostnumPerDayLimit)) {
        return;
      }

      // 没有用户信息，优先从页面上获取
      if (item.userInfo === undefined) {
        this.getUserInfo(item);
      }

      // 没有再从接口获取
      if (item.userInfo === undefined) {
        await this.getPostInfo(item);
      }

      // 获取发帖数量和注册时间
      const { postnum, regdate } = item.userInfo || {};

      // 获取失败则跳过
      if (postnum === undefined || regdate === undefined) {
        return;
      }

      // 转换时间格式，泥潭接口只精确到秒
      const date = new Date(regdate * 1000);

      // 计算时间差
      const diff = Date.now() - date;

      // 转换为天数，不足一天按一天计算
      const days = Math.ceil(diff / 86400000);

      // 计算日均发帖数量
      const postnumPerDay = postnum / days;

      // 判断是否符合条件
      if (postnumPerDay <= filterPostnumPerDayLimit) {
        return;
      }

      // 更新过滤模式和原因
      result.mode = mode;
      result.reason = `日均发帖: ${postnumPerDay.toFixed(1)}`;
    }

    /**
     * 根据近期删帖数量过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filterByDeletedTopic(item, result) {
      const { uid } = item;

      // 如果是匿名，则跳过
      if (uid <= 0) {
        return;
      }

      // 获取隐藏模式下标
      const mode = this.settings.getModeByName("隐藏");

      // 如果当前模式不低于隐藏模式，则跳过
      if (result.mode >= mode) {
        return;
      }

      // 获取近期删帖数量限制
      const filterDeletedTopicLimit = this.settings.filterDeletedTopicLimit;

      // 未启用则跳过
      if (Number.isNaN(filterDeletedTopicLimit)) {
        return;
      }

      // 获取主题数量
      const topicNum = await this.getTopicNum(item);

      // 获取近期主题
      const topicRencent = await this.getTopicRencent(item);

      // 尚未取得数据
      if (topicNum === 0 || topicRencent.length === 0) {
        return;
      }

      // 计算删帖数量
      const count = (() => {
        // 筛选一年内的主题，且不含删除标记
        const limit = Date.now() - 1000 * 60 * 60 * 24 * 365;
        const checked = topicRencent.filter((topic) => {
          const { type, fid, lastmodify } = topic;

          if (lastmodify * 1000 < limit) {
            return false;
          }

          if ((type & 1026) === 1026) {
            return true;
          }

          if (fid === 108) {
            return true;
          }

          return false;
        }).length;

        return checked;
      })();

      // 判断是否符合条件
      if (count <= filterDeletedTopicLimit) {
        return;
      }

      // 更新过滤模式和原因
      result.mode = mode;
      result.reason = `近期删帖: ${count}`;
    }

    /**
     * 根据主题比例过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filterByTopicRate(item, result) {
      const { uid } = item;

      // 如果是匿名，则跳过
      if (uid <= 0) {
        return;
      }

      // 获取隐藏模式下标
      const mode = this.settings.getModeByName("隐藏");

      // 如果当前模式不低于隐藏模式，则跳过
      if (result.mode >= mode) {
        return;
      }

      // 获取主题比例限制
      const filterTopicRateLimit = this.settings.filterTopicRateLimit;

      // 未启用则跳过
      if (filterTopicRateLimit <= 0 || filterTopicRateLimit >= 100) {
        return;
      }

      // 没有用户信息，优先从页面上获取
      if (item.userInfo === undefined) {
        this.getUserInfo(item);
      }

      // 没有再从接口获取
      if (item.userInfo === undefined) {
        await this.getPostInfo(item);
      }

      // 获取发帖数量
      const { postnum } = item.userInfo || {};

      // 获取失败则跳过
      if (postnum === undefined) {
        return;
      }

      // 获取主题数量
      const topicNum = await this.getTopicNum(item);

      // 计算主题比例
      const topicRate = Math.ceil((topicNum / postnum) * 100);

      // 判断是否符合条件
      if (topicRate < filterTopicRateLimit) {
        return;
      }

      // 更新过滤模式和原因
      result.mode = mode;
      result.reason = `主题比例: ${topicRate}% (${topicNum}/${postnum})`;
    }

    /**
     * 根据今日主题数量过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filterByTopicPerDay(item, result) {
      const { uid } = item;

      // 如果是匿名，则跳过
      if (uid <= 0) {
        return;
      }

      // 获取隐藏模式下标
      const mode = this.settings.getModeByName("隐藏");

      // 如果当前模式不低于隐藏模式，则跳过
      if (result.mode >= mode) {
        return;
      }

      // 获取今日主题数量限制
      const filterTopicPerDayLimit = this.settings.filterTopicPerDayLimit;

      // 未启用则跳过
      if (Number.isNaN(filterTopicPerDayLimit)) {
        return;
      }

      // 获取近期主题
      const topicRencent = await this.getTopicRencent(item);

      // 计算今日主题
      // 考虑到有删帖情况，从后往前遍历
      let checked = 0;

      for (let i = topicRencent.length - 1; i >= 0; i--) {
        const { postdate } = topicRencent[i];

        // 跳过异常帖子
        if (postdate === 0) {
          return;
        }

        // 判断发帖时间
        const date = new Date(postdate * 1000);
        const isToday = Tools.dateIsToday(date);

        // 计算今日主题数量
        if (isToday) {
          checked = i + 1;
          break;
        }
      }

      // 判断是否符合条件
      if (checked <= filterTopicPerDayLimit) {
        return;
      }

      // 更新过滤模式和原因
      result.mode = mode;
      result.reason = `今日主题: ${checked}`;
    }

    /**
     * 根据每页主题数量过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filterByTopicPerPage(item, result) {
      const { uid, tid } = item;

      // 如果是匿名，则跳过
      if (uid <= 0) {
        return;
      }

      // 获取隐藏模式下标
      const mode = this.settings.getModeByName("隐藏");

      // 如果当前模式不低于隐藏模式，则跳过
      if (result.mode >= mode) {
        return;
      }

      // 获取每页主题数量限制
      const filterTopicPerPageLimit = this.settings.filterTopicPerPageLimit;

      // 未启用则跳过
      if (Number.isNaN(filterTopicPerPageLimit)) {
        return;
      }

      // 已有标记，直接斩杀
      // 但需要判断斩杀线是否有变动
      if (Object.hasOwn(this.cache.topicPerPages, uid)) {
        if (this.cache.topicPerPages[uid] > filterTopicPerPageLimit) {
          // 重新计算数量
          const num = this.data.filter((item) => item.uid === uid).length;

          // 更新过滤模式和原因
          result.mode = mode;
          result.reason = `本页主题: ${num}`;

          return;
        }

        delete this.cache.topicPerPages[uid];
      }

      // 获取页面上所有主题
      const list = [...topicModule.data].map((item) => item.nFilter || {});

      // 预检测
      const max = list.filter((item) => item.uid === uid).length;

      // 多页的主题数量累计仍不符合，直接跳过
      if (max <= filterTopicPerPageLimit) {
        return;
      }

      // 获取当前主题下标
      const index = list.findIndex((item) => item.tid === tid);

      // 没有找到，跳过
      if (index < 0) {
        return;
      }

      // 每页主题数量
      const topicPerPage = 30;

      // 符合条件的主题下标
      let indexPrev = index;
      let indexNext = index;

      // 符合的主题
      let checked = 1;

      // 从当前主题往前和往后检测
      for (let i = 1; i < topicPerPage - (indexNext - indexPrev); i += 1) {
        const topicPrev = list[indexPrev - i];
        const topicNext = list[indexNext + i];

        if (topicPrev === undefined && topicNext === undefined) {
          break;
        }

        if (topicPrev && topicPrev.uid === uid) {
          indexPrev -= i;
          checked += 1;

          i = 0;
          continue;
        }

        if (topicNext && topicNext.uid === uid) {
          indexNext += i;
          checked += 1;

          i = 0;
          continue;
        }
      }

      // 判断是否符合条件
      if (checked <= filterTopicPerPageLimit) {
        return;
      }

      // 写入斩杀标记
      this.cache.topicPerPages[uid] = checked;

      // 重新计算相关帖子
      this.reFilter(uid);
    }

    /**
     * 根据版面声望过滤
     * @param {*} item    绑定的 nFilter
     * @param {*} result  过滤结果
     */
    async filterByReputation(item, result) {
      const { uid } = item;

      // 如果是匿名，则跳过
      if (uid <= 0) {
        return;
      }

      // 获取隐藏模式下标
      const mode = this.settings.getModeByName("隐藏");

      // 如果当前模式不低于隐藏模式，则跳过
      if (result.mode >= mode) {
        return;
      }

      // 获取版面声望限制
      const filterReputationLimit = this.settings.filterReputationLimit;

      // 未启用则跳过
      if (Number.isNaN(filterReputationLimit)) {
        return;
      }

      // 没有声望信息，优先从页面上获取
      if (item.reputation === undefined) {
        this.getUserInfo(item);
      }

      // 没有再从接口获取
      if (item.reputation === undefined) {
        await this.getPostInfo(item);
      }

      // 获取版面声望
      const reputation = item.reputation || 0;

      // 判断是否符合条件
      if (reputation >= filterReputationLimit) {
        return;
      }

      // 更新过滤模式和原因
      result.mode = mode;
      result.reason = `版面声望: ${reputation}`;
    }

    /**
     * 重新过滤
     * @param {Number} uid 用户 ID
     */
    reFilter(uid = null) {
      this.data.forEach((item) => {
        if (item.uid === uid || uid === null) {
          item.execute();
        }
      });
    }
  }

  /**
   * 设置模块
   */
  class SettingsModule extends Module {
    /**
     * 模块名称
     */
    static name = "settings";

    /**
     * 顺序
     */
    static order = 0;

    /**
     * 创建实例
     * @param   {Settings}      settings 设置
     * @param   {API}           api      API
     * @param   {UI}            ui       UI
     * @param   {Array}         data     过滤列表
     * @returns {Module | null}          成功后返回模块实例
     */
    static create(settings, api, ui, data) {
      // 读取设置里的模块列表
      const modules = settings.modules;

      // 如果不包含自己，加入列表中，因为设置模块是必须的
      if (modules.includes(this.name) === false) {
        settings.modules = [...modules, this.name];
      }

      // 创建实例
      return super.create(settings, api, ui, data);
    }

    /**
     * 初始化，增加设置
     */
    initComponents() {
      super.initComponents();

      const { settings, ui } = this;
      const { add } = ui.views.settings;

      // 前置过滤
      {
        const input = ui.createElement("INPUT", [], {
          type: "checkbox",
        });

        const label = ui.createElement("LABEL", ["前置过滤", input], {
          style: "display: flex;",
        });

        settings.preFilterEnabled.then((checked) => {
          input.checked = checked;
          input.onchange = () => {
            settings.preFilterEnabled = !checked;
          };
        });

        add(this.constructor.order + 0, label);
      }

      // 提醒过滤
      {
        const input = ui.createElement("INPUT", [], {
          type: "checkbox",
        });

        const label = ui.createElement("LABEL", ["提醒过滤", input], {
          style: "display: flex;",
        });

        const tips = ui.createElement("DIV", TIPS.filterNotification, {
          className: "silver",
        });

        settings.notificationFilterEnabled.then((checked) => {
          input.checked = checked;
          input.onchange = () => {
            settings.notificationFilterEnabled = !checked;
          };
        });

        add(this.constructor.order + 1, label, tips);
      }

      // 模块选择
      {
        const modules = [
          ListModule,
          UserModule,
          TagModule,
          KeywordModule,
          LocationModule,
          ForumOrSubsetModule,
          HunterModule,
          MiscModule,
        ];

        const items = modules.map((item) => {
          const input = ui.createElement("INPUT", [], {
            type: "checkbox",
            value: item.name,
            checked: settings.modules.includes(item.name),
            onchange: () => {
              const checked = input.checked;

              modules.map((m, index) => {
                const isDepend = checked
                  ? item.depends.find((i) => i.name === m.name)
                  : m.depends.find((i) => i.name === item.name);

                if (isDepend) {
                  const element = items[index].querySelector("INPUT");

                  if (element) {
                    element.checked = checked;
                  }
                }
              });
            },
          });

          const label = ui.createElement("LABEL", [item.label, input], {
            style: "display: flex; margin-right: 10px;",
          });

          return label;
        });

        const button = ui.createButton("确认", () => {
          const checked = group.querySelectorAll("INPUT:checked");
          const values = [...checked].map((item) => item.value);

          settings.modules = values;

          location.reload();
        });

        const group = ui.createElement("DIV", [...items, button], {
          style: "display: flex;",
        });

        const label = ui.createElement("LABEL", "启用模块");

        add(this.constructor.order + 2, label, group);
      }

      // 默认过滤模式
      {
        const modes = ["标记", "遮罩", "隐藏"].map((item) => {
          const input = ui.createElement("INPUT", [], {
            type: "radio",
            name: "defaultFilterMode",
            value: item,
            checked: settings.defaultFilterMode === item,
            onchange: () => {
              settings.defaultFilterMode = item;

              this.reFilter();
            },
          });

          const label = ui.createElement("LABEL", [item, input], {
            style: "display: flex; margin-right: 10px;",
          });

          return label;
        });

        const group = ui.createElement("DIV", modes, {
          style: "display: flex;",
        });

        const label = ui.createElement("LABEL", "默认过滤模式");

        const tips = ui.createElement("DIV", TIPS.filterMode, {
          className: "silver",
        });

        add(this.constructor.order + 3, label, group, tips);
      }

      // 主题
      {
        const themes = Object.keys(THEMES).map((item) => {
          const input = ui.createElement("INPUT", [], {
            type: "radio",
            name: "theme",
            value: item,
            checked: settings.theme === item,
            onchange: () => {
              settings.theme = item;

              handleStyle(settings);
            },
          });

          const { name } = THEMES[item];

          const label = ui.createElement("LABEL", [name, input], {
            style: "display: flex; margin-right: 10px;",
          });

          return label;
        });

        const group = ui.createElement("DIV", themes, {
          style: "display: flex;",
        });

        const label = ui.createElement("LABEL", "主题");

        add(this.constructor.order + 4, label, group);
      }
    }

    /**
     * 重新过滤
     */
    reFilter() {
      // 目前仅在修改默认过滤模式时重新过滤
      this.data.forEach((item) => {
        // 如果过滤模式是继承，则重新过滤
        if (item.filterMode === "继承") {
          item.execute();
        }

        // 如果有引用，也重新过滤
        if (Object.values(item.quotes || {}).includes("继承")) {
          item.execute();
          return;
        }
      });
    }
  }

  /**
   * 增强的列表模块，增加了用户作为附加模块
   */
  class ListEnhancedModule extends ListModule {
    /**
     * 模块名称
     */
    static name = "list";

    /**
     * 附加模块
     */
    static addons = [UserModule];

    /**
     * 附加的用户模块
     * @returns {UserModule} 用户模块
     */
    get userModule() {
      return this.addons[UserModule.name];
    }

    /**
     * 表格列
     * @returns {Array} 表格列集合
     */
    columns() {
      const hasAddon = this.hasAddon(UserModule);

      if (hasAddon === false) {
        return super.columns();
      }

      return [
        { label: "用户", width: 1 },
        { label: "内容", ellipsis: true },
        { label: "过滤模式", center: true, width: 1 },
        { label: "原因", width: 1 },
        { label: "操作", width: 1 },
      ];
    }

    /**
     * 表格项
     * @param   {*}     item 绑定的 nFilter
     * @returns {Array}      表格项集合
     */
    column(item) {
      const column = super.column(item);

      const hasAddon = this.hasAddon(UserModule);

      if (hasAddon === false) {
        return column;
      }

      const { ui } = this;
      const { table } = this.views;
      const { uid, username } = item;

      const user = this.userModule.format(uid, username);

      const buttons = (() => {
        if (uid <= 0) {
          return null;
        }

        const block = ui.createButton("屏蔽", (e) => {
          this.userModule.renderDetails(uid, username, (type) => {
            // 删除失效数据，等待重新过滤
            table.remove(e);

            // 如果是新增，不会因为用户重新过滤，需要主动触发
            if (type === "ADD") {
              this.userModule.reFilter(uid);
            }
          });
        });

        return ui.createButtonGroup(block);
      })();

      return [user, ...column, buttons];
    }
  }

  /**
   * 增强的用户模块，增加了标记作为附加模块
   */
  class UserEnhancedModule extends UserModule {
    /**
     * 模块名称
     */
    static name = "user";

    /**
     * 附加模块
     */
    static addons = [TagModule];

    /**
     * 附加的标记模块
     * @returns {TagModule} 标记模块
     */
    get tagModule() {
      return this.addons[TagModule.name];
    }

    /**
     * 表格列
     * @returns {Array} 表格列集合
     */
    columns() {
      const hasAddon = this.hasAddon(TagModule);

      if (hasAddon === false) {
        return super.columns();
      }

      return [
        { label: "昵称", width: 1 },
        { label: "标记" },
        { label: "过滤模式", center: true, width: 1 },
        { label: "操作", width: 1 },
      ];
    }

    /**
     * 表格项
     * @param   {*}     item 用户信息
     * @returns {Array}      表格项集合
     */
    column(item) {
      const column = super.column(item);

      const hasAddon = this.hasAddon(TagModule);

      if (hasAddon === false) {
        return column;
      }

      const { ui } = this;
      const { table } = this.views;
      const { id, name } = item;

      const tags = ui.createElement(
        "DIV",
        item.tags.map((id) => this.tagModule.format(id))
      );

      const newColumn = [...column];

      newColumn.splice(1, 0, tags);

      const buttons = column[column.length - 1];

      const update = ui.createButton("编辑", (e) => {
        this.renderDetails(id, name, (type, newValue) => {
          if (type === "UPDATE") {
            table.update(e, ...this.column(newValue));
          }

          if (type === "REMOVE") {
            table.remove(e);
          }
        });
      });

      buttons.insertBefore(update, buttons.firstChild);

      return newColumn;
    }

    /**
     * 渲染详情
     * @param {Number}             uid      用户 ID
     * @param {String | undefined} name     用户名称
     * @param {Function}           callback 回调函数
     */
    renderDetails(uid, name, callback = () => {}) {
      const hasAddon = this.hasAddon(TagModule);

      if (hasAddon === false) {
        return super.renderDetails(uid, name, callback);
      }

      const { ui, settings } = this;

      // 只允许同时存在一个详情页
      if (this.views.details) {
        if (this.views.details.parentNode) {
          this.views.details.parentNode.removeChild(this.views.details);
        }
      }

      // 获取用户信息
      const user = this.get(uid);

      if (user) {
        name = user.name;
      }

      // TODO 需要优化

      const title =
        (user ? "编辑" : "添加") + `用户 - ${name ? name : "#" + uid}`;

      const table = ui.createTable([]);

      {
        const size = Math.floor((screen.width * 0.8) / 200);

        const items = Object.values(this.tagModule.list).map(({ id }) => {
          const checked = user && user.tags.includes(id) ? "checked" : "";

          return `
            <td class="c1">
              <label for="s-tag-${id}" style="display: block; cursor: pointer;">
                ${this.tagModule.format(id).outerHTML}
              </label>
            </td>
            <td class="c2" width="1">
              <input id="s-tag-${id}" type="checkbox" value="${id}" ${checked}/>
            </td>
          `;
        });

        const rows = [...new Array(Math.ceil(items.length / size))].map(
          (_, index) => `
            <tr class="row${(index % 2) + 1}">
              ${items.slice(size * index, size * (index + 1)).join("")}
            </tr>
          `
        );

        table.querySelector("TBODY").innerHTML = rows.join("");
      }

      const input = ui.createElement("INPUT", [], {
        type: "text",
        placeholder: TIPS.addTags,
        style: "width: -webkit-fill-available;",
      });

      const inputWrapper = ui.createElement("DIV", input, {
        style: "margin-top: 10px;",
      });

      const filterMode = user ? user.filterMode : settings.filterModes[0];

      const switchMode = ui.createButton(filterMode, () => {
        const newMode = settings.switchModeByName(switchMode.innerText);

        switchMode.innerText = newMode;
      });

      const buttons = ui.createElement(
        "DIV",
        (() => {
          const remove = user
            ? ui.createButton("删除", () => {
                ui.confirm().then(() => {
                  this.remove(uid);

                  this.views.details._.hide();

                  callback("REMOVE");
                });
              })
            : null;

          const save = ui.createButton("保存", () => {
            const checked = [...table.querySelectorAll("INPUT:checked")].map(
              (input) => parseInt(input.value, 10)
            );

            const newTags = input.value
              .split("|")
              .filter((item) => item.length)
              .map((item) => this.tagModule.add(item))
              .filter((tag) => tag !== null)
              .map((tag) => tag.id);

            const tags = [...new Set([...checked, ...newTags])].sort();

            if (user === null) {
              const entity = this.add(uid, {
                id: uid,
                name,
                tags,
                filterMode: switchMode.innerText,
              });

              this.views.details._.hide();

              callback("ADD", entity);
            } else {
              const entity = this.update(uid, {
                name,
                tags,
                filterMode: switchMode.innerText,
              });

              this.views.details._.hide();

              callback("UPDATE", entity);
            }
          });

          return ui.createButtonGroup(remove, save);
        })(),
        {
          className: "right_",
        }
      );

      const actions = ui.createElement(
        "DIV",
        [ui.createElement("SPAN", "过滤模式："), switchMode, buttons],
        {
          style: "margin-top: 10px;",
        }
      );

      const tips = ui.createElement("DIV", TIPS.filterMode, {
        className: "silver",
        style: "margin-top: 10px;",
      });

      const content = ui.createElement(
        "DIV",
        [table, inputWrapper, actions, tips],
        {
          style: "width: 80vw",
        }
      );

      // 创建弹出框
      this.views.details = ui.createDialog(null, title, content);
    }
  }

  /**
   * 处理 topicArg 模块
   * @param {Filter} filter 过滤器
   * @param {*}      value  commonui.topicArg
   */
  const handleTopicModule = async (filter, value) => {
    // 绑定主题模块
    topicModule = value;

    if (value === undefined) {
      return;
    }

    // 是否启用前置过滤
    const preFilterEnabled = await filter.settings.preFilterEnabled;

    // 前置过滤
    // 先直接隐藏，等过滤完毕后再放出来
    const beforeGet = (...args) => {
      if (preFilterEnabled) {
        // 主题标题
        const title = document.getElementById(args[1]);

        // 主题容器
        const container = title.closest("tr");

        // 隐藏元素
        container.style.display = "none";
      }

      return args;
    };

    // 过滤
    const afterGet = (_, args) => {
      // 主题 ID
      const tid = args[8];

      // 回复 ID
      const pid = args[9];

      // 找到对应数据
      const data = topicModule.data.find(
        (item) => item[8] === tid && item[9] === pid
      );

      // 开始过滤
      if (data) {
        filter.filterTopic(data);
      }
    };

    // 如果已经有数据，则直接过滤
    Object.values(topicModule.data).forEach((item) => {
      filter.filterTopic(item);
    });

    // 拦截 add 函数，这是泥潭的主题添加事件
    Tools.interceptProperty(topicModule, "add", {
      beforeGet,
      afterGet,
    });
  };

  /**
   * 处理 postArg 模块
   * @param {Filter} filter 过滤器
   * @param {*}      value  commonui.postArg
   */
  const handleReplyModule = async (filter, value) => {
    // 绑定回复模块
    replyModule = value;

    if (value === undefined) {
      return;
    }

    // 是否启用前置过滤
    const preFilterEnabled = await filter.settings.preFilterEnabled;

    // 前置过滤
    // 先直接隐藏，等过滤完毕后再放出来
    const beforeGet = (...args) => {
      if (preFilterEnabled) {
        // 楼层号
        const index = args[0];

        // 判断是否是楼层
        const isFloor = typeof index === "number";

        // 评论额外标签
        const prefix = isFloor ? "" : "comment";

        // 用户容器
        const uInfoC = document.querySelector(`#${prefix}posterinfo${index}`);

        // 回复容器
        const container = isFloor
          ? uInfoC.closest("tr")
          : uInfoC.closest(".comment_c");

        // 隐藏元素
        container.style.display = "none";
      }

      return args;
    };

    // 过滤
    const afterGet = (_, args) => {
      // 楼层号
      const index = args[0];

      // 找到对应数据
      const data = replyModule.data[index];

      // 开始过滤
      if (data) {
        filter.filterReply(data);
      }
    };

    // 如果已经有数据，则直接过滤
    Object.values(replyModule.data).forEach((item) => {
      filter.filterReply(item);
    });

    // 拦截 proc 函数，这是泥潭的回复添加事件
    Tools.interceptProperty(replyModule, "proc", {
      beforeGet,
      afterGet,
    });
  };

  /**
   * 处理 notification 模块
   * @param {Filter} filter 过滤器
   * @param {*}      value  commonui.notification
   */
  const handleNotificationModule = async (filter, value) => {
    // 绑定提醒模块
    notificationModule = value;

    if (value === undefined) {
      return;
    }

    // 是否启用提醒过滤
    const notificationFilterEnabled = await filter.settings
      .notificationFilterEnabled;

    if (notificationFilterEnabled === false) {
      return;
    }

    // 由于过滤需要异步进行，所以要重写泥潭的提醒弹窗展示事件，在此处理需要过滤的数据，并根据结果确认是否展示弹窗
    const { openBox } = value;

    // 重写泥潭的提醒弹窗展示事件
    notificationModule.openBox = async (...args) => {
      // 回复列表，小屏幕下也作为短消息和系统提醒，参考 js_notification.js 的 createBox
      const replyList = notificationModule._tab[0];

      // 筛选出有作者的条目
      const authorList = replyList.querySelectorAll("A[href^='/nuke.php']");

      // 依次过滤
      await Promise.all(
        [...authorList].map(async (item) => {
          // 找到提醒主容器
          const container = item.closest("SPAN[class^='bg']");

          // 找到回复链接
          const reply = container.querySelector("A[href^='/read.php?pid=']");

          // 找到主题链接
          const topic = container.querySelector("A[href^='/read.php?tid=']");

          // 不符合则跳过
          if (reply === null || topic === null) {
            return;
          }

          // 获取 UID 和 昵称
          const { uid, username } = (() => {
            const res = item.getAttribute("href").match(/uid=(\S+)/);

            if (res) {
              return {
                uid: parseInt(res[1], 10),
                username: item.innerText,
              };
            }

            return {};
          })();

          // 获取 PID
          const pid = (() => {
            const res = reply.getAttribute("href").match(/pid=(\S+)/);

            if (res) {
              return parseInt(res[1], 10);
            }

            return 0;
          })();

          // 获取 TID
          const tid = (() => {
            const res = topic.getAttribute("href").match(/tid=(\S+)/);

            if (res) {
              return parseInt(res[1], 10);
            }

            return 0;
          })();

          // 过滤
          await filter.filterNotification(container, {
            tid,
            pid,
            uid,
            username,
            subject: "",
          });
        })
      );

      // 判断过滤后是否还有可见的数据
      let visible = false;

      for (const tab in notificationModule._tab) {
        const items =
          notificationModule._tab[tab].querySelectorAll("SPAN[class^='bg']");

        const filtered = [...items].filter((item) => {
          return item.style.display !== "none";
        });

        if (filtered.length > 0) {
          visible = true;
          break;
        }

        notificationModule._tab[tab].style.display = "none";
      }

      // 显示弹窗
      if (visible) {
        openBox.apply(notificationModule, args);
      }
    };
  };

  /**
   * 处理样式
   * @param {Settings} settings 设置
   */
  const handleStyle = (settings) => {
    const afterSet = (value) => {
      if (value === undefined) {
        return;
      }

      // 更新样式
      Object.assign(THEMES["system"], {
        fontColor: value.gbg3,
        borderColor: value.gbg4,
        backgroundColor: value.gbg4,
      });

      // 读取设置
      const theme = settings.theme;

      // 读取样式
      const { fontColor, borderColor, backgroundColor } = (() => {
        if (Object.hasOwn(THEMES, theme)) {
          return THEMES[theme];
        }

        return THEMES["system"];
      })();

      // 更新样式
      Tools.addStyle(
        `
        .filter-table-wrapper {
            max-height: 80vh;
            overflow-y: auto;
        }
        .filter-table {
            margin: 0;
        }
        .filter-table th,
        .filter-table td {
            position: relative;
            white-space: nowrap;
        }
        .filter-table th {
            position: sticky;
            top: 2px;
            z-index: 1;
        }
        .filter-table input:not([type]), .filter-table input[type="text"] {
            margin: 0;
            box-sizing: border-box;
            height: 100%;
            width: 100%;
        }
        .filter-input-wrapper {
            position: absolute;
            top: 6px;
            right: 6px;
            bottom: 6px;
            left: 6px;
        }
        .filter-text-ellipsis {
            display: flex;
        }
        .filter-text-ellipsis > * {
            flex: 1;
            width: 1px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .filter-button-group {
            margin: -.1em -.2em;
        }
        .filter-tags {
            margin: 2px -0.2em 0;
            text-align: left;
        }
        .filter-mask {
            margin: 1px;
            color: ${backgroundColor};
            background: ${backgroundColor};
        }
        .filter-mask:hover {
            color: ${backgroundColor};
        }
        .filter-mask * {
            background: ${backgroundColor};
        }
        .filter-mask-block {
            display: block;
            border: 1px solid ${borderColor};
            text-align: center;
        }
        .filter-mask-collapse {
            border: 1px solid ${borderColor};
            background: ${backgroundColor};
        }
        .filter-mask-hint {
            color: ${fontColor};
        }
        .filter-input-wrapper {
            position: absolute;
            top: 6px;
            right: 6px;
            bottom: 6px;
            left: 6px;
        }
      `,
        "s-filter"
      );
    };

    if (unsafeWindow.__COLOR) {
      afterSet(unsafeWindow.__COLOR);
      return;
    }

    Tools.interceptProperty(unsafeWindow, "__COLOR", {
      afterSet,
    });
  };

  /**
   * 处理 commonui 模块
   * @param {Filter} filter 过滤器
   * @param {*}      value  commonui
   */
  const handleCommonui = (filter, value) => {
    // 绑定主模块
    commonui = value;

    // 拦截 mainMenu 模块，UI 需要在 init 后加载
    Tools.interceptProperty(commonui, "mainMenu", {
      afterSet: (value) => {
        Tools.interceptProperty(value, "init", {
          afterGet: () => {
            filter.ui.render();
          },
          afterSet: () => {
            filter.ui.render();
          },
        });
      },
    });

    // 拦截 topicArg 模块，这是泥潭的主题入口
    Tools.interceptProperty(commonui, "topicArg", {
      afterSet: (value) => {
        handleTopicModule(filter, value);
      },
    });

    // 拦截 postArg 模块，这是泥潭的回复入口
    Tools.interceptProperty(commonui, "postArg", {
      afterSet: (value) => {
        handleReplyModule(filter, value);
      },
    });

    // 拦截 notification 模块，这是泥潭的提醒入口
    Tools.interceptProperty(commonui, "notification", {
      afterSet: (value) => {
        handleNotificationModule(filter, value);
      },
    });
  };

  /**
   * 注册脚本菜单
   * @param {Settings} settings 设置
   */
  const registerMenu = async (settings) => {
    const enabled = await settings.preFilterEnabled;

    GM_registerMenuCommand(`前置过滤：${enabled ? "是" : "否"}`, () => {
      settings.preFilterEnabled = !enabled;
    });
  };

  // 主函数
  (async () => {
    // 初始化缓存和 API
    const { cache, api } = initCacheAndAPI();

    // 初始化设置
    const settings = new Settings(cache);

    // 读取设置
    await settings.load();

    // 初始化 UI
    const ui = new UI(settings, api);

    // 初始化过滤器
    const filter = new Filter(settings, api, ui);

    // 加载模块
    filter.initModules(
      SettingsModule,
      ListEnhancedModule,
      UserEnhancedModule,
      TagModule,
      KeywordModule,
      LocationModule,
      ForumOrSubsetModule,
      HunterModule,
      MiscModule
    );

    // 注册脚本菜单
    registerMenu(settings);

    // 处理样式
    handleStyle(settings);

    // 处理 commonui 模块
    if (unsafeWindow.commonui) {
      handleCommonui(filter, unsafeWindow.commonui);
      return;
    }

    Tools.interceptProperty(unsafeWindow, "commonui", {
      afterSet: (value) => {
        handleCommonui(filter, value);
      },
    });
  })();
})();

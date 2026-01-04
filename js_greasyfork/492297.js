// ==UserScript==
// @name        NGA Menu Simplify
// @name:zh-CN  NGA 菜单精简
// @namespace   https://greasyfork.org/users/263018
// @version     1.0.0
// @author      snyssss
// @description NGA 菜单精简，顶部的菜单实在太多了！
// @license     MIT

// @match       *://bbs.nga.cn/*
// @match       *://ngabbs.com/*
// @match       *://nga.178.com/*

// @require     https://update.greasyfork.org/scripts/486070/1358886/NGA%20Library.js

// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       unsafeWindow

// @run-at      document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/492297/NGA%20Menu%20Simplify.user.js
// @updateURL https://update.greasyfork.org/scripts/492297/NGA%20Menu%20Simplify.meta.js
// ==/UserScript==

(() => {
  // 声明泥潭主模块
  let commonui;

  // STYLE
  GM_addStyle(`
    .s-table-wrapper {
        max-height: 80vh;
        overflow-y: auto;
    }
    .s-table {
        margin: 0;
    }
    .s-table th,
    .s-table td {
        position: relative;
        white-space: nowrap;
    }
    .s-table th {
        position: sticky;
        top: 2px;
        z-index: 1;
    }
    .s-table input:not([type]), .s-table input[type="text"] {
        margin: 0;
        box-sizing: border-box;
        height: 100%;
        width: 100%;
    }
    .s-input-wrapper {
        position: absolute;
        top: 6px;
        right: 6px;
        bottom: 6px;
        left: 6px;
    }
    .s-text-ellipsis {
        display: flex;
    }
    .s-text-ellipsis > * {
        flex: 1;
        width: 1px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .s-button-group {
        margin: -.1em -.2em;
    }
  `);

  /**
   * UI
   */
  class UI {
    /**
     * 标签
     */
    static label = "菜单精简";

    /**
     * 弹出窗
     */
    window;

    /**
     * 视图元素
     */
    views = {};

    /**
     * 初始化
     */
    constructor() {
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
        style: "width: 400px;",
      });

      const container = this.createElement("DIV", [tabs, content]);

      this.views = {
        tabs,
        content,
        container,
      };
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
     * 渲染视图
     */
    renderView() {
      // 创建或打开弹出窗
      if (this.window === undefined) {
        this.window = this.createDialog(
          this.views.anchor,
          this.constructor.label,
          this.views.container
        );
      } else {
        this.window._.show();
      }

      // 启用第一个模块
      this.views.tabs.querySelector("A").click();
    }

    /**
     * 渲染
     */
    render() {
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
     * UI
     */
    ui;

    /**
     * 视图元素
     */
    views = {};

    /**
     * 初始化并绑定UI，注册 UI
     * @param {UI} ui UI
     */
    constructor(ui) {
      this.ui = ui;

      this.init();
    }

    /**
     * 获取列表
     */
    get list() {
      return GM_getValue(this.constructor.name, []);
    }

    /**
     * 写入列表
     */
    set list(value) {
      GM_setValue(this.constructor.name, value);
    }

    /**
     * 格式化名称
     * @param   {Number} index 菜单项下标
     * @returns                格式化后的名称
     */
    formatName(index) {
      if (index === 0) {
        return "主菜单";
      }

      if (index === 7) {
        return "LOGO";
      }

      if (index === 162) {
        return "搜索";
      }

      if (commonui.mainMenuItems[index].arg) {
        const i = commonui.mainMenuItems[index].arg.indexOf("innerHTML");

        return commonui.mainMenuItems[index].arg[i + 1];
      }

      return commonui.mainMenuItems[index].innerHTML;
    }

    /**
     * 切换启用状态
     * @param {Number} index 菜单项下标
     */
    toggle(index) {
      const list = this.list;

      if (this.list.includes(index)) {
        this.list = list.filter((i) => i !== index);
      } else {
        this.list = list.concat(index);
      }

      commonui.mainMenu.init(
        unsafeWindow.__CURRENT_UNAME,
        "",
        "",
        "",
        unsafeWindow.__CURRENT_UID
      );
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
  }

  /**
   * 左侧菜单
   */
  class LeftMenu extends Module {
    /**
     * 模块名称
     */
    static name = "hisDefLeft";

    /**
     * 模块标签
     */
    static label = "左侧";

    /**
     * 顺序
     */
    static order = 10;

    /**
     * 表格列
     * @returns {Array} 表格列集合
     */
    columns() {
      return [{ label: "标题" }, { label: "是否启用", center: true, width: 1 }];
    }

    /**
     * 表格项
     * @param   {Number} index 菜单项下标
     * @returns {Array}        表格项集合
     */
    column(index) {
      const { ui, list } = this;

      // 名称
      const name = this.formatName(index);

      // 标题
      const label = ui.createElement("SPAN", name, {
        className: "nobr",
      });

      // 是否启用
      const enabled = ui.createElement("INPUT", [], {
        type: "checkbox",
        checked: list.includes(index) === false,
        onchange: () => {
          this.toggle(index);
        },
      });

      return [label, enabled];
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

        const list = commonui.mainMenuItems.hisDefLeft;

        Object.values(list).forEach((item) => {
          const entity = commonui.mainMenuItems[item];

          if (entity) {
            const column = this.column(item);

            add(...column);
          }
        });
      }
    }
  }

  /**
   * 右侧菜单
   */
  class RightMenu extends Module {
    /**
     * 模块名称
     */
    static name = "hisDef";

    /**
     * 模块标签
     */
    static label = "右侧";

    /**
     * 顺序
     */
    static order = 20;

    /**
     * 表格列
     * @returns {Array} 表格列集合
     */
    columns() {
      return [{ label: "标题" }, { label: "是否启用", center: true, width: 1 }];
    }

    /**
     * 表格项
     * @param   {Number} index 菜单项下标
     * @returns {Array}        表格项集合
     */
    column(index) {
      const { ui, list } = this;

      // 名称
      const name = this.formatName(index);

      // 标题
      const label = ui.createElement("SPAN", name, {
        className: "nobr",
      });

      // 是否启用
      const enabled = ui.createElement("INPUT", [], {
        type: "checkbox",
        checked: list.includes(index) === false,
        onchange: () => {
          this.toggle(index);
        },
      });

      return [label, enabled];
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

        const list = commonui.mainMenuItems.hisDef;

        Object.values(list).forEach((item) => {
          const entity = commonui.mainMenuItems[item];

          if (entity) {
            const column = this.column(item);

            add(...column);
          }
        });
      }
    }
  }

  /**
   * 处理 commonui 模块
   * @param {*} value commonui
   */
  const handleCommonui = (value) => {
    // 绑定主模块
    commonui = value;

    // 拦截 mainMenu 模块，处理 init 事件
    Tools.interceptProperty(commonui, "mainMenu", {
      afterSet: (mainMenu) => {
        let hisDefLeft, hisDef;

        // 拦截 init 事件，请求前缓存原始菜单并禁用，请求后恢复
        // TODO 此处需要优化，应有统一的获取缓存方式
        Tools.interceptProperty(mainMenu, "init", {
          beforeGet: (...args) => {
            const disabledHisDefLeft = GM_getValue("hisDefLeft", []);
            const disabledHisDef = GM_getValue("hisDef", []);

            hisDefLeft = [...mainMenu.data.hisDefLeft];
            hisDef = [...mainMenu.data.hisDef];

            mainMenu.data.hisDefLeft = mainMenu.data.hisDefLeft.filter(
              (item) => disabledHisDefLeft.includes(item) === false
            );

            mainMenu.data.hisDef = mainMenu.data.hisDef.filter(
              (item) => disabledHisDef.includes(item) === false
            );

            return args;
          },
          afterGet: () => {
            mainMenu.data.hisDefLeft = [...hisDefLeft];
            mainMenu.data.hisDef = [...hisDef];
          },
          afterSet: () => {
            if (mainMenu.dataReady === null) {
              return;
            }

            mainMenu.init(
              unsafeWindow.__CURRENT_UNAME,
              "",
              "",
              "",
              unsafeWindow.__CURRENT_UID
            );
          },
        });
      },
    });
  };

  /**
   * 注册脚本菜单
   */
  const registerMenu = () => {
    let ui;

    GM_registerMenuCommand(`设置`, () => {
      if (commonui && commonui.mainMenuItems) {
        if (ui === undefined) {
          ui = new UI();

          new LeftMenu(ui);
          new RightMenu(ui);
        }

        ui.render();
      }
    });
  };

  // 主函数
  (async () => {
    // 注册脚本菜单
    registerMenu();

    // 处理 commonui 模块
    if (unsafeWindow.commonui) {
      handleCommonui(unsafeWindow.commonui);
      return;
    }

    Tools.interceptProperty(unsafeWindow, "commonui", {
      afterSet: (value) => {
        handleCommonui(value);
      },
    });
  })();
})();

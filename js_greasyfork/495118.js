// ==UserScript==
// @name        NGA Account Switcher
// @name:zh-CN  NGA 账号切换
// @namespace   https://greasyfork.org/users/263018
// @version     1.0.0
// @author      snyssss
// @description 快速切换多个账号
// @license     MIT

// @match       *://bbs.nga.cn/*
// @match       *://ngabbs.com/*
// @match       *://nga.178.com/*

// @require     https://update.greasyfork.org/scripts/486070/1377381/NGA%20Library.js

// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       unsafeWindow

// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/495118/NGA%20Account%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/495118/NGA%20Account%20Switcher.meta.js
// ==/UserScript==

(() => {
  // 声明泥潭主模块
  let commonui;

  // 声明 UI
  let ui;

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
    static label = "账号切换";

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
        className: "s-button-group",
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
        className: "s-table forumbox",
      });

      const wrapper = this.createElement("DIV", table, {
        className: "s-table-wrapper",
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
              properties.className = "s-text-ellipsis";
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
                properties.className = "s-text-ellipsis";
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
      return GM_getValue(this.constructor.name, {});
    }

    /**
     * 写入列表
     */
    set list(value) {
      GM_setValue(this.constructor.name, value);
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
   * 账号列表
   */
  class AccountList extends Module {
    /**
     * 模块名称
     */
    static name = "data";

    /**
     * 模块标签
     */
    static label = "账号";

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
        { label: "昵称" },
        { label: "登录时间" },
        { label: "操作", width: 1 },
      ];
    }

    /**
     * 表格项
     * @param   {Object} item 账号信息
     * @returns {Array}       表格项集合
     */
    column(item) {
      const { ui } = this;

      const { table } = this.views;

      const { uid, username, timestamp } = item;

      // 昵称
      const name = (() => {
        const label = username ? "@" + username : "#" + uid;

        return ui.createElement("A", `[${label}]`, {
          className: "b nobr",
          href: `/nuke.php?func=ucp&uid=${uid}`,
        });
      })();

      // 登录时间
      const time = ui.createElement(
        "SPAN",
        commonui.time2dis(timestamp / 1000),
        {
          className: "nobr",
        }
      );

      // 操作
      const buttons = (() => {
        const toggle = ui.createButton("切换", (e) => {
          loadData(uid).catch((err) => {
            alert(err.message);

            removeData(uid);

            table.remove(e);
          });
        });

        const remove = ui.createButton("删除", (e) => {
          ui.confirm().then(() => {
            removeData(uid);

            table.remove(e);
          });
        });

        if (unsafeWindow.__CURRENT_UID === uid) {
          return ui.createButtonGroup(remove);
        }

        return ui.createButtonGroup(toggle, remove);
      })();

      return [name, time, buttons];
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

      const { list } = this;

      const { table } = this.views;

      if (table) {
        const { add, clear } = table;

        clear();

        Object.values(list).forEach((item) => {
          const column = this.column(item);

          add(...column);
        });
      }
    }
  }

  /**
   * 渲染 UI
   */
  const renderUI = () => {
    if (commonui && commonui.mainMenuItems) {
      if (ui === undefined) {
        ui = new UI();

        new AccountList(ui);
      }

      ui.render();
    }
  };

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
        // 加入菜单
        if (mainMenu && mainMenu.addItemOnTheFly) {
          mainMenu.addItemOnTheFly(`账号切换`, null, renderUI);
        }
      },
    });
  };

  /**
   * 注册脚本菜单
   */
  const registerMenu = () => {
    GM_registerMenuCommand(`账号切换`, renderUI);
  };

  /**
   * 拦截登录页面
   */
  const handleLogin = () => {
    if (unsafeWindow.document.title === "账号操作") {
      // 处理 __API 模块
      const handleLoginAPI = (value) => {
        if (value) {
          // 拦截 get 方法，从中取得登录成功后的信息
          Tools.interceptProperty(value, "get", {
            beforeGet: (...args) => {
              if (args[0] === "loginSuccess") {
                const { uid, username, token } = JSON.parse(args[1]);

                saveData(uid, username, token);
              }

              return args;
            },
          });
        }
      };

      if (unsafeWindow.__API) {
        handleLoginAPI(unsafeWindow.__API);
        return;
      }

      Tools.interceptProperty(unsafeWindow, "__API", {
        afterSet: (value) => {
          handleLoginAPI(value);
        },
      });
    }
  };

  /**
   * 载入数据
   * @param {String} uid 用户 ID
   */
  const loadData = async (uid) => {
    const list = GM_getValue(AccountList.name, {});
    const item = list[uid];

    if (item) {
      const { cid } = item;

      const url = `/nuke.php?__lib=login&__act=login_set_cookie_quick`;

      const form = new FormData();

      form.append("uid", uid);
      form.append("cid", cid);

      const response = await fetch(url, {
        method: "POST",
        body: form,
      });

      const result = await Tools.readForumData(response, false);

      const parser = new DOMParser();

      const doc = parser.parseFromString(result, "text/html");

      const message = doc.body.innerText.replace(/\s/g, "");

      if (message === "SUCCESS") {
        unsafeWindow.location.reload();
        return;
      }
    }

    throw new Error("登录状态失效，请重新登录");
  };

  /**
   * 保存数据
   */
  const saveData = (uid, username, cid) => {
    const list = GM_getValue(AccountList.name, {});

    list[uid] = {
      uid,
      username,
      cid,
      timestamp: new Date().getTime(),
    };

    GM_setValue(AccountList.name, list);
  };

  /**
   * 删除数据
   * @param {String} uid 用户 ID
   */
  const removeData = (uid) => {
    const list = GM_getValue(AccountList.name, {});

    delete list[uid];

    GM_setValue(AccountList.name, list);
  };

  // 主函数
  (async () => {
    // 注册脚本菜单
    registerMenu();

    // 拦截登录页面
    handleLogin();

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

// ==UserScript==
// @name              NGA UserInfo Enhance
// @name:zh-CN        NGA 用户信息增强

// @namespace         https://greasyfork.org/users/263018
// @version           2.0.10
// @author            snyssss
// @license           MIT

// @description       隐藏不需要的用户信息，或显示额外的用户信息，包括被点赞和粉丝数量，以及坛龄、离线天数、发帖数量、属地、曾用名、游戏档案、刀塔段位
// @description:zh-CN 隐藏不需要的用户信息，或显示额外的用户信息，包括被点赞和粉丝数量，以及坛龄、离线天数、发帖数量、属地、曾用名、游戏档案、刀塔段位

// @match             *://bbs.nga.cn/*
// @match             *://ngabbs.com/*
// @match             *://nga.178.com/*

// @require           https://update.greasyfork.org/scripts/486070/1414880/NGA%20Library.js

// @grant             GM_addStyle
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_registerMenuCommand
// @grant             unsafeWindow

// @run-at            document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/416741/NGA%20UserInfo%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/416741/NGA%20UserInfo%20Enhance.meta.js
// ==/UserScript==

(() => {
  // 声明泥潭主模块
  let commonui;

  // 声明缓存和 API
  let cache, api;

  // 系统标签
  const SYSTEM_LABEL_MAP = {
    头像: "",
    头衔: "",
    声望: "",
    威望: "",
    级别: "",
    注册: "",
    发帖: "泥潭默认仅版主可见，普通用户可在增强里打开",
    财富: "",
    徽章: "",
    版面: "",
    备注: "",
    签名: "",
  };

  // 自定义标签
  const CUSTOM_LABEL_MAP = {
    点赞: "需要占用额外的资源",
    粉丝: "需要占用额外的资源",
    坛龄: "",
    离线: "",
    发帖: "",
    属地: "需要占用额外的资源",
    曾用名: "需要占用额外的资源",
    游戏档案: "需要占用额外的资源，目前支持 Steam、PSN、NS、原神、深空之眼",
    刀塔段位:
      "需要占用额外的资源，需要可以访问 Opendota 和 Stratz<br/>免费接口为每天 2000 次，每分钟 60 次",
  };

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
    .s-user-enhance [s-user-enhance-visible="true"].usercol::after {
        content: ' · ';
    }
    .s-user-enhance [s-user-enhance-visible="false"] {
        display: none;
    }
    `);

  /**
   * UI
   */
  class UI {
    /**
     * 标签
     */
    static label = "用户信息增强";

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
        style: "width: 600px;",
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
     * 切换启用状态
     * @param {String} label 标签
     */
    toggle(label) {
      const list = this.list;

      if (this.list.includes(label)) {
        this.list = list.filter((i) => i !== label);
      } else {
        this.list = list.concat(label);
      }

      rerender();
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
   * 系统模块
   */
  class SystemModule extends Module {
    /**
     * 模块名称
     */
    static name = "system";

    /**
     * 模块标签
     */
    static label = "系统";

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
        { label: "标题" },
        { label: "注释" },
        { label: "是否启用", center: true, width: 1 },
      ];
    }

    /**
     * 表格项
     * @param   {String} label       标签
     * @param   {String} description 注释
     * @returns {Array}              表格项集合
     */
    column(label, description) {
      const { ui, list } = this;

      // 标题
      const labelElement = ui.createElement("SPAN", label, {
        className: "nobr",
      });

      // 注释
      const descriptionElement = ui.createElement("SPAN", description, {
        className: "nobr",
      });

      // 是否启用
      const enabled = ui.createElement("INPUT", [], {
        type: "checkbox",
        checked: list.includes(label) === false,
        onchange: () => {
          this.toggle(label);
        },
      });

      return [labelElement, descriptionElement, enabled];
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

        Object.entries(SYSTEM_LABEL_MAP).forEach(([label, description]) => {
          const column = this.column(label, description);

          add(...column);
        });
      }
    }
  }

  /**
   * 自定义模块
   */
  class CustomModule extends Module {
    /**
     * 模块名称
     */
    static name = "custom";

    /**
     * 模块标签
     */
    static label = "增强";

    /**
     * 顺序
     */
    static order = 20;

    /**
     * 表格列
     * @returns {Array} 表格列集合
     */
    columns() {
      return [
        { label: "标题" },
        { label: "注释" },
        { label: "是否启用", center: true, width: 1 },
      ];
    }

    /**
     * 表格项
     * @param   {String} label       标签
     * @param   {String} description 注释
     * @returns {Array}              表格项集合
     */
    column(label, description) {
      const { ui, list } = this;

      // 标题
      const labelElement = ui.createElement("SPAN", label, {
        className: "nobr",
      });

      // 注释
      const descriptionElement = ui.createElement("SPAN", description, {
        className: "nobr",
      });

      // 是否启用
      const enabled = ui.createElement("INPUT", [], {
        type: "checkbox",
        checked: list.includes(label),
        onchange: () => {
          this.toggle(label);
        },
      });

      return [labelElement, descriptionElement, enabled];
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

        Object.entries(CUSTOM_LABEL_MAP).forEach(([label, description]) => {
          const column = this.column(label, description);

          add(...column);
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

    // 拦截 postDisp 事件，这是泥潭的楼层渲染
    Tools.interceptProperty(commonui, "postDisp", {
      afterSet: () => {
        rerender();
      },
      afterGet: (_, args) => {
        rerender(...args);
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

          new SystemModule(ui);
          new CustomModule(ui);
        }

        ui.render();
      }
    });
  };

  /**
   * 重新渲染
   * @param {Number | undefined} index 重新渲染的楼层，为空时重新渲染全部
   */
  const rerender = (index) => {
    if (commonui === undefined || commonui.postArg === undefined) {
      return;
    }

    if (index === undefined) {
      Object.keys(commonui.postArg.data).forEach((item) => {
        rerender(item);
      });
      return;
    }

    const argid = parseInt(index, 10);

    if (Number.isNaN(argid) || argid < 0) {
      return;
    }

    // TODO 需要优化

    const system = GM_getValue("system", []);
    const custom = GM_getValue("custom", []);

    const item = commonui.postArg.data[argid];

    const lite = item.lite;

    const uid = parseInt(item.pAid, 10) || 0;

    const posterInfo = lite
      ? item.uInfoC.closest("tr").querySelector(".posterInfoLine")
      : item.uInfoC;

    const container = item.pC.closest(".postbox");

    // 主容器样式
    container.classList.add("s-user-enhance");

    // 头像
    {
      const element = posterInfo.querySelector(".avatar");

      if (element) {
        element.setAttribute(
          "s-user-enhance-visible",
          system.includes("头像") === false
        );
      }
    }

    // 头衔
    {
      const element = posterInfo.querySelector("[name='honor']");

      if (element) {
        element.setAttribute(
          "s-user-enhance-visible",
          system.includes("头衔") === false
        );
      }
    }

    // 声望进度条
    {
      const element = posterInfo.querySelector(".r_container");

      if (element) {
        element.setAttribute(
          "s-user-enhance-visible",
          system.includes("声望") === false
        );
      }
    }

    // 声望、威望、级别、注册、发帖、财富
    {
      const elements = lite
        ? posterInfo.querySelectorAll(".usercol")
        : posterInfo.querySelectorAll(".stat NOBR");

      [...elements].forEach((element) => {
        if (lite) {
          ["声望", "威望", "级别", "注册", "发帖", "财富"].forEach((label) => {
            if (element.innerText.indexOf(label) >= 0) {
              element.innerHTML = element.innerHTML.replace(" · ", "");

              element.setAttribute(
                "s-user-enhance-visible",
                system.includes(label) === false
              );
            }
          });
        } else {
          const container = element.closest("DIV");

          container.style = "float: left; min-width: 50%;";

          ["声望", "威望", "级别", "注册", "发帖", "财富"].forEach((label) => {
            if (element.innerText.indexOf(label) >= 0) {
              container.setAttribute(
                "s-user-enhance-visible",
                system.includes(label) === false
              );
            }
          });
        }
      });
    }

    // 徽章
    {
      const anchor = posterInfo.querySelector("[name='medal']");

      if (anchor) {
        const br = anchor.nextElementSibling;
        const text = (() => {
          const previous =
            anchor.previousElementSibling || anchor.previousSibling;

          if (previous.nodeName === "SPAN") {
            return previous;
          }

          const span = document.createElement("SPAN");

          span.appendChild(previous);

          insertBefore(span, anchor);

          return span;
        })();

        const visible = system.includes("徽章") === false;

        if (lite) {
          text.innerHTML = text.innerHTML.replace(" · ", "");

          anchor
            .closest(".usercol")
            .setAttribute("s-user-enhance-visible", visible);
        } else {
          [text, anchor, br].forEach((element) => {
            element.setAttribute("s-user-enhance-visible", visible);
          });
        }
      }
    }

    // 版面
    {
      const anchor = posterInfo.querySelector("[name='site']");

      if (anchor) {
        const container = anchor.closest("SPAN");
        const br = container.nextElementSibling;

        const visible = system.includes("版面") === false;

        if (lite) {
          anchor
            .closest(".usercol")
            .setAttribute("s-user-enhance-visible", visible);
        } else {
          [container, br].forEach((element) => {
            if (element) {
              element.setAttribute("s-user-enhance-visible", visible);
            }
          });
        }
      }
    }

    // 备注
    {
      const elements = [
        ...posterInfo.querySelectorAll("SPAN[title^='公开备注']"),
        ...posterInfo.querySelectorAll("SPAN[title^='版主可见']"),
      ];

      [...elements].forEach((element) => {
        const container = element.closest("SPAN");

        container.setAttribute(
          "s-user-enhance-visible",
          system.includes("备注") === false
        );
      });
    }

    // 签名
    {
      const signC = item.signC;

      if (signC) {
        signC.setAttribute(
          "s-user-enhance-visible",
          system.includes("签名") === false
        );
      }
    }

    if (uid <= 0) {
      return;
    }

    // 粉丝
    {
      const element = (() => {
        const anchor = posterInfo.querySelector(
          "[name='s-user-enhance-follows']"
        );

        if (anchor) {
          return anchor;
        }

        const span = document.createElement("SPAN");

        span.setAttribute("name", `s-user-enhance-follows`);
        span.className = "small_colored_text_btn stxt block_txt_c2 vertmod";
        span.style.cursor = "default";
        span.style.margin = "0 0 0 4px";
        span.innerHTML = `
          <span class="white">
            <span style="font-family: comm_glyphs; -webkit-font-smoothing: antialiased; line-height: 1em;">★</span>
            <span name="s-user-enhance-follows-value"></span>
          </span>`;

        const uid = posterInfo.querySelector("[name='uid']");

        insertAfter(span, uid);

        return span;
      })();

      const value = element.querySelector(
        "[name='s-user-enhance-follows-value']"
      );

      const visible = custom.includes("粉丝");

      if (visible) {
        api.getUserInfo(uid).then(({ follow_by_num }) => {
          value.innerHTML = follow_by_num || 0;

          element.setAttribute("s-user-enhance-visible", true);
        });
      }

      element.setAttribute("s-user-enhance-visible", false);
    }

    // 点赞
    {
      const element = (() => {
        const anchor = posterInfo.querySelector(
          "[name='s-user-enhance-likes']"
        );

        if (anchor) {
          return anchor;
        }

        const span = document.createElement("SPAN");

        span.setAttribute("name", `s-user-enhance-likes`);
        span.className = "small_colored_text_btn stxt block_txt_c2 vertmod";
        span.style.cursor = "default";
        span.style.margin = "0 0 0 4px";
        span.innerHTML = `
          <span class="white">
            <span style="font-family: comm_glyphs; -webkit-font-smoothing: antialiased; line-height: 1em;">⯅</span>
            <span name="s-user-enhance-likes-value"></span>
          </span>`;

        const uid = posterInfo.querySelector("[name='uid']");

        insertAfter(span, uid);

        return span;
      })();

      const value = element.querySelector(
        "[name='s-user-enhance-likes-value']"
      );

      const visible = custom.includes("点赞");

      if (visible) {
        api.getUserInfo(uid).then(({ more_info }) => {
          const likes = Object.values(more_info || {}).find(
            (item) => item.type === 8
          );

          value.innerHTML = likes ? likes.data : 0;

          element.setAttribute("s-user-enhance-visible", true);
        });
      }

      element.setAttribute("s-user-enhance-visible", false);
    }

    // 坛龄
    {
      const element = (() => {
        const anchor = posterInfo.querySelector(
          "[name='s-user-enhance-regdays']"
        );

        if (anchor) {
          return anchor;
        }

        if (lite) {
          const span = document.createElement("SPAN");

          span.setAttribute("name", `s-user-enhance-regdays`);
          span.className = "usercol nobr";
          span.innerHTML = `坛龄 <span class="userval" name="s-user-enhance-regdays-value"></span>`;

          const lastChild = [...posterInfo.querySelectorAll(".usercol")].pop();

          insertAfter(span, lastChild);

          return span;
        }

        const div = document.createElement("DIV");

        div.setAttribute("name", `s-user-enhance-regdays`);
        div.style = "float: left; min-width: 50%";
        div.innerHTML = `
          <nobr>
            <span>坛龄: <span class="userval numericl" name="s-user-enhance-regdays-value"></span></span>
          </nobr>`;

        const lastChild = posterInfo.querySelector('.stat DIV[class="clear"]');

        insertBefore(div, lastChild);

        return div;
      })();

      const value = element.querySelector(
        "[name='s-user-enhance-regdays-value']"
      );

      const visible = custom.includes("坛龄");

      if (visible) {
        const { regdate } = commonui.userInfo.users[uid];

        const { years, months, days } = Tools.dateDiff(
          new Date(regdate * 1000)
        );

        value.title = ``;
        value.innerHTML = ``;

        [
          [years, "年"],
          [months, "月"],
          [days, "天"],
        ].forEach(([item, unit]) => {
          if (item > 0) {
            value.title += `${item}${unit}`;

            if (value.innerHTML.length === 0) {
              value.innerHTML = `${item}${unit}`;
            }
          }
        });

        if (value.innerHTML.length === 0) {
          value.innerHTML = `0天`;
        }
      }

      element.setAttribute("s-user-enhance-visible", visible);
    }

    // 离线
    {
      const element = (() => {
        const anchor = posterInfo.querySelector(
          "[name='s-user-enhance-offdays']"
        );

        if (anchor) {
          return anchor;
        }

        if (lite) {
          const span = document.createElement("SPAN");

          span.setAttribute("name", `s-user-enhance-offdays`);
          span.className = "usercol nobr";
          span.innerHTML = `离线 <span class="userval" name="s-user-enhance-offdays-value"></span>`;

          const lastChild = [...posterInfo.querySelectorAll(".usercol")].pop();

          insertAfter(span, lastChild);

          return span;
        }

        const div = document.createElement("DIV");

        div.setAttribute("name", `s-user-enhance-offdays`);
        div.style = "float: left; min-width: 50%";
        div.innerHTML = `
          <nobr>
            <span>离线: <span class="userval numericl" name="s-user-enhance-offdays-value"></span></span>
          </nobr>`;

        const lastChild = posterInfo.querySelector('.stat DIV[class="clear"]');

        insertBefore(div, lastChild);

        return div;
      })();

      const value = element.querySelector(
        "[name='s-user-enhance-offdays-value']"
      );

      const visible = custom.includes("离线");

      if (visible) {
        const thisvisit = commonui.userInfo.users[uid].thisvisit;
        const postTime = item.postTime;

        const time = Math.max(thisvisit, postTime) * 1000;

        const diff = new Date() - new Date(time);

        const start = new Date(2000, 0, 1);
        const end = new Date();

        end.setTime(start.getTime() + diff);

        const { years, months, days } = Tools.dateDiff(start, end);

        value.title = ``;
        value.innerHTML = ``;

        [
          [years, "年"],
          [months, "月"],
          [days, "天"],
        ].forEach(([item, unit]) => {
          if (item > 0) {
            value.title += `${item}${unit}`;

            if (value.innerHTML.length === 0) {
              value.innerHTML = `${item}${unit}`;
            }
          }
        });
      } else {
        value.innerHTML = ``;
      }

      element.setAttribute(
        "s-user-enhance-visible",
        value.innerHTML.length > 0
      );
    }

    // 发帖
    {
      const element = (() => {
        const anchor = posterInfo.querySelector(
          "[name='s-user-enhance-postnum']"
        );

        if (anchor) {
          return anchor;
        }

        if (lite) {
          const span = document.createElement("SPAN");

          span.setAttribute("name", `s-user-enhance-postnum`);
          span.className = "usercol nobr";
          span.innerHTML = `发帖 <span class="userval" name="s-user-enhance-postnum-value"></span>`;

          const lastChild = [...posterInfo.querySelectorAll(".usercol")].pop();

          insertAfter(span, lastChild);

          return span;
        }

        const div = document.createElement("DIV");

        div.setAttribute("name", `s-user-enhance-postnum`);
        div.style = "float: left; min-width: 50%";
        div.innerHTML = `
          <nobr>
            <span>发帖: <span class="userval numericl" name="s-user-enhance-postnum-value"></span></span>
          </nobr>`;

        const lastChild = posterInfo.querySelector('.stat DIV[class="clear"]');

        insertBefore(div, lastChild);

        return div;
      })();

      const value = element.querySelector(
        "[name='s-user-enhance-postnum-value']"
      );

      const visible = custom.includes("发帖");

      if (visible) {
        const { postnum, regdate } = commonui.userInfo.users[uid];

        const days = Math.ceil((Date.now() / 1000 - regdate) / (24 * 60 * 60));

        const postnumPerDay = postnum / days;

        value.title = `日均: ${postnumPerDay.toFixed(1)}`;
        value.innerHTML = postnum;
      }

      element.setAttribute("s-user-enhance-visible", visible);
    }

    // 属地
    {
      const element = (() => {
        const anchor = posterInfo.querySelector(
          "[name='s-user-enhance-ipLoc']"
        );

        if (anchor) {
          return anchor;
        }

        if (lite) {
          const span = document.createElement("SPAN");

          span.setAttribute("name", `s-user-enhance-ipLoc`);
          span.className = "usercol nobr";
          span.innerHTML = `<span class="userval" name="s-user-enhance-ipLoc-value"></span>`;

          const lastChild = [...posterInfo.querySelectorAll(".usercol")].pop();

          insertAfter(span, lastChild);

          return span;
        }

        const div = document.createElement("DIV");

        div.setAttribute("name", `s-user-enhance-ipLoc`);
        div.style = "float: left; min-width: 50%";
        div.innerHTML = `<span name="s-user-enhance-ipLoc-value"></span>`;

        const lastChild = posterInfo.querySelector('.stat DIV[class="clear"]');

        insertBefore(div, lastChild);

        return div;
      })();

      const value = element.querySelector(
        "[name='s-user-enhance-ipLoc-value']"
      );

      const visible = custom.includes("属地");

      if (visible) {
        api.getIpLocations(uid).then((data) => {
          if (data.length) {
            value.innerHTML = `${lite ? "属地 " : "属地: "}${data
              .filter(({ ipLoc }) =>
                ipLoc.endsWith("省") === false
                  ? data.findIndex((item) => item.ipLoc === ipLoc + "省") < 0
                  : true
              )
              .map(
                ({ ipLoc, timestamp }) =>
                  `<span class="userval" title="${
                    timestamp ? commonui.time2dis(timestamp / 1000) : ""
                  }">${
                    ipLoc.endsWith("省") ? ipLoc.slice(0, -1) : ipLoc
                  }</span>`
              )
              .join(", ")}`;

            element.setAttribute("s-user-enhance-visible", true);
          }
        });
      }

      element.setAttribute("s-user-enhance-visible", false);
    }

    // 曾用名
    {
      const element = (() => {
        const anchor = posterInfo.querySelector(
          "[name='s-user-enhance-oldname']"
        );

        if (anchor) {
          return anchor;
        }

        if (lite) {
          const span = document.createElement("SPAN");

          span.setAttribute("name", `s-user-enhance-oldname`);
          span.className = "usercol nobr";
          span.innerHTML = `<span class="userval" name="s-user-enhance-oldname-value"></span>`;

          const lastChild = [...posterInfo.querySelectorAll(".usercol")].pop();

          insertAfter(span, lastChild);

          return span;
        }

        const div = document.createElement("DIV");

        div.setAttribute("name", `s-user-enhance-oldname`);
        div.style = "float: left; width: 100%";
        div.innerHTML = `<span name="s-user-enhance-oldname-value"></span>`;

        const lastChild = posterInfo.querySelector('.stat DIV[class="clear"]');

        insertBefore(div, lastChild);

        return div;
      })();

      const value = element.querySelector(
        "[name='s-user-enhance-oldname-value']"
      );

      const visible = custom.includes("曾用名");

      if (visible) {
        api.getUsernameChanged(uid).then((data) => {
          const values = Object.values(data || {});

          if (values.length) {
            value.innerHTML = `${lite ? "曾用名 " : "曾用名: "}${values
              .map(
                ({ username, time }) =>
                  `<span class="userval" title="${commonui.time2dis(
                    time
                  )}">${username}</span>`
              )
              .join(", ")}`;

            element.setAttribute("s-user-enhance-visible", true);
          }
        });
      }

      element.setAttribute("s-user-enhance-visible", false);
    }

    // 游戏档案
    {
      const element = (() => {
        const anchor = posterInfo.querySelector(
          "[name='s-user-enhance-games']"
        );

        if (anchor) {
          return anchor;
        }

        const div = document.createElement("DIV");

        div.setAttribute("name", `s-user-enhance-games`);
        div.style = "margin: 0 -2px;";
        div.innerHTML = ``;

        if (lite) {
          const lastChild = [...posterInfo.querySelectorAll(".usercol")].pop();

          insertAfter(div, lastChild);
        } else {
          const lastChild = posterInfo.querySelector(".stat").lastChild;

          insertBefore(div, lastChild);
        }

        return div;
      })();

      const visible = custom.includes("游戏档案");

      if (visible) {
        element.innerHTML = ``;

        api.getUserGameInfo(uid).then((info) => {
          // Steam
          if (info.steam) {
            const { steam_user_id, steam_user_name } = info.steam;

            const steam = (() => {
              if (steam_user_id) {
                const element = document.createElement("A");

                element.href = `https://steamcommunity.com/profiles/${steam_user_id}`;
                element.style = `
                  background-image: url(${unsafeWindow.__IMG_BASE}/misc/fid414/headline/icon03.png);
                  background-repeat: no-repeat;
                  background-position: 50% 50%;
                  background-size: contain;
                  width: 20px;
                  height: 20px;
                  display: inline-block;
                  cursor: pointer;
                  outline: none;`;
                element.title = `${steam_user_name}[${steam_user_id}]`;

                return element;
              }

              return null;
            })();

            if (steam) {
              steam.style.margin = "2px";
              element.appendChild(steam);
            }

            element.setAttribute("s-user-enhance-visible", true);
          }

          // PSN
          if (info.psn) {
            const { psn_user_id, psn_user_name } = info.psn;

            const psn = (() => {
              if (psn_user_name) {
                const element = document.createElement("A");

                element.href = `https://psnprofiles.com/${psn_user_name}`;
                element.style = `
                  background-image: url(${unsafeWindow.__IMG_BASE}/misc/fid414/headline/icon05.png);
                  background-repeat: no-repeat;
                  background-position: 50% 50%;
                  background-size: contain;
                  width: 20px;
                  height: 20px;
                  display: inline-block;
                  cursor: pointer;
                  outline: none;`;
                element.title = `${psn_user_name}[${psn_user_id}]`;

                return element;
              }

              return null;
            })();

            if (psn) {
              psn.style.margin = "2px";
              element.appendChild(psn);
            }

            element.setAttribute("s-user-enhance-visible", true);
          }

          // NS
          if (info.nintendo) {
            const { user_info } = info.nintendo;

            const nintendo = (() => {
              if (user_info) {
                const { ns_nickname, ns_friendcode } = user_info.user;

                const element = document.createElement("A");

                element.style = `
                  background-image: url(${unsafeWindow.__IMG_BASE}/misc/fid414/headline/icon01.png);
                  background-repeat: no-repeat;
                  background-position: 50% 50%;
                  background-size: contain;
                  width: 20px;
                  height: 20px;
                  display: inline-block;
                  cursor: pointer;
                  outline: none;`;
                element.title = `${ns_nickname}[${
                  ns_friendcode === "SW-XXXX-XXXX-XXXX" ? "-" : ns_friendcode
                }]`;

                return element;
              }

              return null;
            })();

            if (nintendo) {
              nintendo.style.margin = "2px";
              element.appendChild(nintendo);
            }

            element.setAttribute("s-user-enhance-visible", true);
          }

          // 刀塔
          if (info.steam) {
            const { steam_user_id } = info.steam;

            const stratz = (() => {
              if (steam_user_id && unsafeWindow.__CURRENT_GFID === 321) {
                const shortID = Number.isSafeInteger(steam_user_id)
                  ? steam_user_id
                  : Number(steam_user_id.substr(-16, 16)) - 6561197960265728;

                const element = document.createElement("A");

                element.href = `https://stratz.com/players/${shortID}`;
                element.style = `
                  background-image: url(${unsafeWindow.__IMG_BASE}/proxy/cache_attach/ficon/321u.png);
                  background-repeat: no-repeat;
                  background-position: 50% 50%;
                  background-size: contain;
                  width: 20px;
                  height: 20px;
                  display: inline-block;
                  cursor: pointer;
                  outline: none;`;
                element.title = shortID;

                return element;
              }

              return null;
            })();

            if (stratz) {
              stratz.style.margin = "2px";
              element.appendChild(stratz);
            }

            element.setAttribute("s-user-enhance-visible", true);
          }

          // 原神
          if (info.genshin) {
            const { userInfo } = info.genshin;

            const genshin = (() => {
              if (userInfo.ys_id) {
                const element = document.createElement("A");

                element.style = `
                  background-image: url(${unsafeWindow.__IMG_BASE}/proxy/cache_attach/ficon/650u.png);
                  background-repeat: no-repeat;
                  background-position: 50% 50%;
                  background-size: contain;
                  width: 20px;
                  height: 20px;
                  display: inline-block;
                  cursor: pointer;
                  outline: none;`;
                element.title = `${userInfo.nickname}[${userInfo.ys_id}]`;

                return element;
              }

              return null;
            })();

            if (genshin) {
              genshin.style.margin = "2px";
              element.appendChild(genshin);
            }

            element.setAttribute("s-user-enhance-visible", true);
          }

          // 深空之眼
          if (info.skzy) {
            const { skzy_uid, nick_name } = info.skzy;

            const skzy = (() => {
              if (skzy_uid) {
                const element = document.createElement("A");

                element.style = `
                  background-image: url(${unsafeWindow.__IMG_BASE}/proxy/cache_attach/ficon/848u.png);
                  background-repeat: no-repeat;
                  background-position: 50% 50%;
                  background-size: contain;
                  width: 20px;
                  height: 20px;
                  display: inline-block;
                  cursor: pointer;
                  outline: none;`;
                element.title = `${nick_name}[${skzy_uid}]`;

                return element;
              }

              return null;
            })();

            if (skzy) {
              skzy.style.margin = "2px";
              element.appendChild(skzy);
            }

            element.setAttribute("s-user-enhance-visible", true);
          }
        });
      }

      element.setAttribute("s-user-enhance-visible", false);
    }

    // 刀塔段位
    {
      const element = (() => {
        const anchor = posterInfo.querySelector(
          "[name='s-user-enhance-dota-rank']"
        );

        if (anchor) {
          return anchor;
        }

        const div = document.createElement("DIV");

        div.setAttribute("name", `s-user-enhance-dota-rank`);
        div.style = "margin: 2px 0";
        div.innerHTML = ``;

        if (lite) {
          return null;
        }

        const lastChild = posterInfo.querySelector(".stat");

        insertAfter(div, lastChild);

        return div;
      })();

      if (element) {
        const visible = custom.includes("刀塔段位");

        if (visible) {
          element.innerHTML = ``;

          api.getSteamInfo(uid).then(async ({ steam_user_id }) => {
            if (steam_user_id) {
              const shortID = Number.isSafeInteger(steam_user_id)
                ? steam_user_id
                : Number(steam_user_id.substr(-16, 16)) - 6561197960265728;

              // TODO 代码优化
              // 简单的缓存，同一个人每天只请求一次
              const data = (await cache.get("DotaRank")) || {};

              const info = await new Promise((resolve) => {
                if (data[shortID]) {
                  const { timestamp } = data[shortID];

                  const date = new Date(timestamp);

                  const isToday = Tools.dateIsToday(date);

                  if (isToday) {
                    resolve(data[shortID]);
                    return;
                  }

                  delete data[shortID];
                }

                fetch(`https://api.opendota.com/api/players/${shortID}`)
                  .then((res) => res.json())
                  .then((res) => {
                    if (res) {
                      data[shortID] = {
                        ...res,
                        timestamp: new Date().getTime(),
                      };

                      cache.put("DotaRank", data);

                      resolve(res);
                      return;
                    }

                    resolve(null);
                  })
                  .catch(() => {
                    resolve(null);
                  });
              });

              if (info.profile) {
                const { rank_tier, leaderboard_rank } = info;

                const medals = [
                  "先锋",
                  "卫士",
                  "中军",
                  "统帅",
                  "传奇",
                  "万古流芳",
                  "超凡入圣",
                  "冠绝一世",
                ];

                const medal = Math.floor(rank_tier / 10);

                const star = rank_tier % 10;

                element.innerHTML = `
                  <div style="
                    width: 64px;
                    height: 64px;
                    display: inline-flex;
                    -webkit-box-pack: center;
                    justify-content: center;
                    -webkit-box-align: center;
                    align-items: center;
                    position: relative;
                    font-size: 10px;
                    overflow: hidden;
                  " title="${
                    medals[medal - 1]
                      ? `${medals[medal - 1]}[${leaderboard_rank || star}]`
                      : ""
                  }">
                    <svg viewBox="0 0 256 256" style="max-width: 256px; max-height: 256px">
                      <image href="https://cdn.stratz.com/images/dota2/seasonal_rank/medal_${medal}.png" height="100%" width="100%"></image>
                      ${
                        star > 0
                          ? `<image href="https://cdn.stratz.com/images/dota2/seasonal_rank/star_${star}.png" height="100%" width="100%"></image>`
                          : ""
                      }
                    </svg>
                    ${
                      leaderboard_rank
                        ? `<div style="
                            background-color: rgba(0, 0, 0, 0.7);
                            border-radius: 4px;
                            color: rgba(255, 255, 255, 0.8);
                            padding: 0.2em 0.3em 0.3em;
                            position: absolute;
                            line-height: normal;
                            bottom: 0;
                            ">${leaderboard_rank}</div>`
                        : ""
                    }
                  </div>`;

                element.setAttribute("s-user-enhance-visible", true);
              }
            }
          });
        }

        element.setAttribute("s-user-enhance-visible", false);
      }
    }
  };

  /**
   * 插入至元素之前
   * @param {HTMLElement} element 新元素
   * @param {HTMLElement} target  目标元素
   */
  const insertBefore = (element, target) => {
    const parentNode = target.parentNode;

    parentNode.insertBefore(element, target);
  };

  /**
   * 插入至元素之后
   * @param {HTMLElement} element 新元素
   * @param {HTMLElement} target  目标元素
   */
  const insertAfter = (element, target) => {
    const parentNode = target.parentNode;

    if (parentNode.lastChild === target) {
      parentNode.appendChild(element);
      return;
    }

    parentNode.insertBefore(element, target.nextSibling);
  };

  // 主函数
  (async () => {
    // 初始化缓存和 API 并绑定
    const libs = initCacheAndAPI();

    cache = libs.cache;
    api = libs.api;

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

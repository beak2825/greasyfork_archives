// ==UserScript==
// @name         Element UI Components Dashboard (^2.0.0) / Element UI 组件看板
// @namespace    https://github.com/xianghongai/ElementUI-Components-Dashboard
// @version      0.0.3
// @description  Better view for Element UI (更方便的查看 Element UI 组件)
// @author       Nicholas Hsiang / 山茶树和葡萄树
// @icon         https://xinlu.ink/favicon.ico
// @match        https://element.eleme.cn/*
// @match        https://element.eleme.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402382/Element%20UI%20Components%20Dashboard%20%28%5E200%29%20%20Element%20UI%20%E7%BB%84%E4%BB%B6%E7%9C%8B%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/402382/Element%20UI%20Components%20Dashboard%20%28%5E200%29%20%20Element%20UI%20%E7%BB%84%E4%BB%B6%E7%9C%8B%E6%9D%BF.meta.js
// ==/UserScript==
(() => {
  "use strict";

  // #region
  const titleText = "Element UI";

  const gridSelector = ".side-nav .nav-item:nth-last-child(1) .nav-group"; // 菜单所在的 DOM Selector
  const girdIsList = true; // 如果提取的是一个 Node 数组，即一次提取所有菜单 DOM 列表，没有父层 DOM

  // 以下选择器，在生成自定义 containerEle 之后用，不参与原始站点查询
  const columnSelector = ".nav-group";
  const columnTitleSelector = ".nav-group__title";
  const menuListSelector = ".pure-menu-list";
  const menuItemSelector = ".pure-menu-list .nav-item";
  const menuItemActionSelector = ".nav-item .active";
  // #endregion

  const helpEnable = true;
  const helpSelector = '[id*="attribute"]';

  // 使用本扩展的样式风格，将会替换原站点的菜单风格
  const customStyleEnable = true; // Dark & Light
  const cloneNodeEnable = true; // 保留原 DOM 节点?

  const compactColumnEnable = false; // 紧凑模式，将会合并一些少的列
  const compactColumnLimit = 12; // 多列数据组合上限

  function initialExtraStyle() {
    var hack = document.querySelectorAll(".is-component");
    hack &&
      hack.forEach((element) => {
        element.classList.remove("is-component");
      });

    const style = `
    #app.is-component .headerWrapper { position: static; }
    .hs-dashboard__toggle { top: 10px; right: 20px; }
    .hs-dashboard__grid { justify-content: space-around; /* center | space-evenly | space-between */ }
    `;
    return style;
  }

  /* ------------------------------------------------------------------------- */

  let wrapperEle = null;
  let themeSwitchEle = null;
  let themeSwitchForm = null;

  const bodyContainer = document.querySelector("body");

  function initialDashboard() {
    initialToggle();
    initialStyle(initialExtraStyle);
    initialMenu(cloneNodeEnable);
    initialHelp();
    handleEvent();
    handleTheme(true);
    tocHandler();
  }

  let interval = null;

  function ready() {
    const originEle = document.querySelector(gridSelector);

    if (originEle) {
      clearInterval(interval);
      // Dashboard
      initialDashboard();
      // Other
    }
  }

  interval = setInterval(ready, 1000);

  // #region MENU
  /** 生成 Menu */
  function initialMenu(clone) {
    // Wrapper
    wrapperEle = document.createElement("section");
    wrapperEle.classList.add("hs-dashboard__wrapper", "hs-hide");

    if (customStyleEnable) {
      wrapperEle.setAttribute("id", "hs-dashboard");
    }

    // Header
    const headerEle = document.createElement("header");
    headerEle.classList.add("hs-dashboard__header");

    // Title → Header
    const titleEle = document.createElement("h1");
    titleEle.classList.add("hs-dashboard__title");
    titleEle.innerText = titleText || "";
    headerEle.appendChild(titleEle);

    // Theme → Header
    if (customStyleEnable) {
      const themeEle = document.createElement("div");
      themeEle.classList.add("hs-theme-switch");
      themeEle.innerHTML = initialThemeTpl();
      headerEle.appendChild(themeEle);
    }

    // Menu
    const containerEle = document.createElement("div");
    containerEle.classList.add("hs-dashboard__container");

    // 1. 先从页面上获取 DOM 生成 gird
    let gridEle = null;
    let nodeTemp = null;

    if (girdIsList) {
      gridEle = document.createElement("div");
      const gridListEle = document.querySelectorAll(gridSelector);
      gridListEle &&
        gridListEle.forEach((element) => {
          nodeTemp = clone ? element.cloneNode(true) : element;
          gridEle.appendChild(nodeTemp);
        });
    } else {
      nodeTemp = document.querySelector(gridSelector);
      gridEle = clone ? nodeTemp.cloneNode(true) : nodeTemp;
      gridEle && nodeTemp.removeAttribute("id");
    }

    gridEle.classList.add("hs-dashboard__grid"); // 追加新的样式

    // Menu → Container
    // 为了方便使用 + > ~ CSS 选择器
    containerEle.appendChild(gridEle);

    // 2. 内部元素追加新的样式
    // 2.1 column
    const columnEle = containerEle.querySelectorAll(columnSelector);
    columnEle.forEach((element) => {
      element.classList.add("hs-dashboard__column");
    });

    // 2.2 title
    const columnTitleEle = containerEle.querySelectorAll(columnTitleSelector);
    columnTitleEle.forEach((element) => {
      element.classList.add("hs-dashboard__title");
    });

    // 2.3 menu list
    const menuListEle = containerEle.querySelectorAll(menuListSelector);
    menuListEle.forEach((element) => {
      element.classList.add("hs-dashboard__list");
    });

    // 2.4 menu item
    const menuItemEle = containerEle.querySelectorAll(menuItemSelector);
    menuItemEle.forEach((element) => {
      element.classList.add("hs-dashboard__item");
    });

    // 2.5 menu item action
    if (menuItemActionSelector) {
      const actionEle = containerEle.querySelector(menuItemActionSelector);
      if (actionEle) {
        const menuItemTemp = getParents(actionEle, menuItemSelector);
        menuItemTemp.classList.add("hs-active");
      }
    }

    // 3. 开启紧凑模式显示
    if (compactColumnEnable) {
      const { columns, layout } = compactColumn(containerEle, compactColumnLimit);

      const ul = document.createElement("ul");
      ul.classList.add("hs-dashboard__grid");

      Array.isArray(layout) &&
        layout.forEach((item) => {
          const li = document.createElement("li");
          li.classList.add("hs-dashboard__column");

          if (Array.isArray(item)) {
            item.forEach((index) => {
              const columnItem = columns[index];
              const title = columnItem.querySelector(".hs-dashboard__title");
              const list = columnItem.querySelector(".hs-dashboard__list");
              title && li.appendChild(title);
              list && li.appendChild(list);
            });
          } else {
            const columnItem = columns[item];
            const title = columnItem.querySelector(".hs-dashboard__title");
            const list = columnItem.querySelector(".hs-dashboard__list");
            title && li.appendChild(title);
            list && li.appendChild(list);
          }

          ul.appendChild(li);
        });

      containerEle.removeChild(gridEle);
      containerEle.appendChild(ul);
    }

    // 4. 呈现
    // header,container → wrapper
    wrapperEle.appendChild(headerEle);
    wrapperEle.appendChild(containerEle);

    // wrapper → body
    bodyContainer.appendChild(wrapperEle);
  }

  function compactColumn(containerEle, limit) {
    // 只能按列去查，有的列里面是没有 list 的
    let columns = containerEle.querySelectorAll(".hs-dashboard__column");
    let columnCount = []; // 相邻的数相加不超过指定值，就合并到一个新数组，将组成新的 column
    let layout = []; // 计算出来的新的数据布局方式

    if (columns && columns.length) {
      columns.forEach((element) => {
        const listItem = element.querySelectorAll(".hs-dashboard__item");
        columnCount.push(listItem.length);
      });

      /**
       * DESIGN NOTES
       *
       * 相邻的数相加
       *
       * 1. 将相邻的坐标存放在 arr
       * 2. 计算 arr 中坐标的数据量是否超过指定值
       * 3. 没超过，继续往 arr 推坐标
       * 4. 原先没超过，新的一进来就超过了，说明原先的已经到了阈值，原先的可以合并了推到布局中，但新的要记录下来，参与下一轮计算
       * 5. 下一个本身已经超过了阈值，看原先是否有参与计算的，然后各自推到布局中
       */

      limit = limit || 12;

      let arr = []; // 待合并的对象
      let acc = 0; // 累加判断是否临界
      const length = columnCount.length; // 是否到最后

      columnCount.forEach((item, index) => {
        // 1. 新的值临界
        if (item > limit) {
          // 原先的是一个待合并的集合，还是只是一个单独的值
          if (arr.length > 1) {
            layout.push(arr);
          } else if (arr.length === 1) {
            layout.push(arr[0]);
          }

          layout.push(index);

          arr = [];
          // prev = [];
          acc = 0;
        } else {
          // 计算总的数据量
          acc += item;

          // 总数据量临界
          if (acc > limit) {
            if (arr.length) {
              if (arr.length > 1) {
                layout.push(arr);
              } else {
                layout.push(arr[0]);
              }
            }

            // 新的值参与下一次计算
            arr = [index];
            acc = item;
          } else {
            // 新的值没有临界
            arr.push(index);
          }
        }

        if (index === length - 1 && arr.length) {
          layout.push(arr);
        }
      });
    }

    return { columns, layout };
  }
  // #endregion MENU

  // #region Event
  /** 注册事件 */
  function handleEvent() {
    if (!wrapperEle) {
      wrapperEle = document.querySelector(".hs-dashboard__wrapper");
    }

    if (!themeSwitchEle) {
      themeSwitchEle = document.querySelector(".hs-theme-switch");
    }

    if (!themeSwitchForm) {
      themeSwitchForm = document.querySelector(".hs-theme-switch__form-control");
    }

    const toggleMenuBtn = document.querySelector('.hs-dashboard__toggle-menu');
    const toggleHelpBtn = document.querySelector('.hs-dashboard__toggle-help');

    function handler(event) {
      const targetEle = event.target;

      const itemEle = getParents(targetEle, ".hs-dashboard__item");

      const isItem = hasClass(targetEle, "hs-dashboard__item");

      const isItemWrapper = getParents(targetEle, ".hs-dashboard__column") && getParents(targetEle, ".hs-dashboard__list");

      const isToggle = getParents(targetEle, ".hs-dashboard__toggle-menu") || hasClass(targetEle, "hs-dashboard__toggle-menu");

      const isHelp = getParents(targetEle, ".hs-dashboard__toggle-help") || hasClass(targetEle, "hs-dashboard__toggle-help");

      const isTheme = getParents(targetEle, ".hs-theme-switch") || hasClass(targetEle, "hs-theme-switch");

      if (itemEle || isItem || isItemWrapper) {
        window.setTimeout(() => {
          clearStyle(wrapperEle);
        }, 300);

        handleItemClick(itemEle, isItem, targetEle);
      } else if (isToggle) {
        wrapperEle.classList.toggle("hs-hide");
        bodyContainer.classList.toggle("hs-body-overflow_hide");
      } else if (isHelp) {
        clearStyle(wrapperEle);
        handleHelp();
      } else if (isTheme) {
        handleTheme();
      }
    }

    bodyContainer.addEventListener("click", handler);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Tab' || event.code === 'Tab') {
        event.preventDefault();
        event.stopPropagation();
        toggleMenuBtn?.click();
      }
      // else if (event.key === 'Escape' || event.code === 'Escape') {
      //   toggleMenuBtn.click();
      // }
      else if (event.key === 'F1' || event.code === 'F1') {
        event.preventDefault();
        event.stopPropagation();
        toggleHelpBtn?.click();
      }
  });
  }

  /** 导航点击 */
  function handleItemClick(itemEle, isItem, targetEle) {
    let itemTemp = null;

    if (itemEle) {
      itemTemp = itemEle;
    } else if (isItem) {
      itemTemp = targetEle;
    }

    if (itemTemp) {
      const items = wrapperEle.querySelectorAll(".hs-dashboard__item");
      items.forEach((element) => {
        element.classList.remove("hs-active");
        element.querySelector("a").classList.remove("active");
      });
      itemTemp.classList.add("hs-active");
    }
  }

  /** 退出预览 */
  function clearStyle(wrapperEle) {
    wrapperEle.classList.add("hs-hide");
    bodyContainer.classList.remove("hs-body-overflow_hide");
  }
  // #endregion Event

  // #region HELP
  /** 是否启用‘页面滚动至指定位置’ */
  function initialHelp() {
    if (!helpEnable) {
      const ele = document.querySelector(".hs-dashboard__toggle-help");
      ele.classList.add("hs-hide");
    }
  }

  /** 页面滚动至指定位置 */
  function handleHelp() {
    if (!helpSelector) {
      return false;
    }

    // const helpEle = document.querySelector(helpSelector);

    // if (!helpEle) {
    //   return false;
    // }

    // const top = helpEle.getBoundingClientRect().top + window.pageYOffset;

    // window.scrollTo({
    //   top,
    //   behavior: 'smooth',
    // });

    const helpEle = document.querySelector('[id*="attribute"]');
    helpEle && helpEle.scrollIntoView({ behavior: "smooth" });
  }
  // #endregion HELP

  // #region STYLE
  /** 添加样式 */
  function initialStyle(param) {
    let tpl = initialStyleTpl();
    const headEle = document.head || document.getElementsByTagName("head")[0];
    const styleEle = document.createElement("style");

    let str = null;

    if (typeof param === "function") {
      str = param();
    } else if (typeof param === "string") {
      str = param;
    }

    if (typeof str === "string") {
      tpl += str;
    }

    styleEle.type = "text/css";

    if (styleEle.styleSheet) {
      styleEle.styleSheet.cssText = tpl;
    } else {
      styleEle.appendChild(document.createTextNode(tpl));
    }

    headEle.appendChild(styleEle);
  }

  /** 样式表 */
  function initialStyleTpl() {
    return `

    :root {
      --item-height: 36px;
      --hs-font-size-base: 15px;
      --hs-global-spacing: 1rem;
      --hs-color-primary: #1890ff;
      --hs-spacing-horizontal: var(--hs-global-spacing);

      --hs-color-white: #fff;
      --hs-color-black: #000;
      --hs-color-gray-0: var(--hs-color-white);
      --hs-color-gray-100: #f5f6f7;
      --hs-color-gray-200: #ebedf0;
      --hs-color-gray-300: #dadde1;
      --hs-color-gray-400: #ccd0d5;
      --hs-color-gray-500: #bec3c9;
      --hs-color-gray-600: #8d949e;
      --hs-color-gray-700: #606770;
      --hs-color-gray-800: #444950;
      --hs-color-gray-900: #1c1e21;
      --hs-color-gray-1000: var(--hs-color-black);
      --hs-color-emphasis-0: var(--hs-color-gray-0);
      --hs-color-emphasis-100: var(--hs-color-gray-100);
      --hs-color-emphasis-200: var(--hs-color-gray-200);
      --hs-color-emphasis-300: var(--hs-color-gray-300);
      --hs-color-emphasis-400: var(--hs-color-gray-400);
      --hs-color-emphasis-500: var(--hs-color-gray-500);
      --hs-color-emphasis-600: var(--hs-color-gray-600);
      --hs-color-emphasis-700: var(--hs-color-gray-700);
      --hs-color-emphasis-800: var(--hs-color-gray-800);
      --hs-color-emphasis-900: var(--hs-color-gray-900);
      --hs-color-emphasis-1000: var(--hs-color-gray-1000);
    }
    .hs-hide {
      display: none !important;
    }

    .hs-body-overflow_hide {
      height: 100% !important;
      overflow: hidden !important;
    }

    /* #region toggle */
    .hs-dashboard__toggle {
      position: fixed;
      z-index: 99999;
      top: 15px;
      right: 5px;
    }

    .hs-dashboard__toggle-item {
      position: relative;
      width: 28px;
      height: 28px;
      margin-top: 10px;
      margin-bottom: 10px;
      overflow: hidden;
      line-height: 1 !important;
      border-radius: 50%;
      border: 1px solid #ccc;
      text-align: center;
      color: #555;
      background-color: #fff;
      cursor: pointer;
      transition: all 0.2s;
    }

    .hs-dashboard__toggle-item:hover {
      border-color: #aaa;
      color: #111;
    }

    .hs-dashboard__toggle-icon svg{
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 9;
      transform: translate(-50%, -50%);
      font-style: normal !important;
    }
    /* #endregion toggle */

    /* #region wrapper */
    .hs-dashboard__wrapper {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 99998;
      overflow-y: auto;
      background-color: #fff;
      font-size: var(--hs-font-size-base);
    }

    .hs-dashboard__wrapper::-webkit-scrollbar {
      width: 8px;
      height: 6px;
      background: rgba(0, 0, 0, 0.1);
    }

    .hs-dashboard__wrapper::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.3);
    }

    .hs-dashboard__wrapper::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }
    /* #endregion wrapper */

    .hs-dashboard__header {
      position: relative;
      padding-top: 10px;
      text-align: center;
    }

    .hs-dashboard__header .hs-dashboard__title {
      margin: 0;
      padding-top: 10px;
      padding-bottom: 10px;
      font-size: 1em;
      font-weight: normal;
    }

    /* #region theme */
    .hs-theme-switch {
      display: flex;
      touch-action: pan-x;
      position: relative;
      background-color: #fff;
      border: 0;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      -webkit-tap-highlight-color: transparent;
      cursor: pointer;
    }

    .hs-theme-switch {
      width: 50px;
      height: 24px;
      padding: 0;
      border-radius: 30px;
      background-color: #4d4d4d;
      transition: all 0.2s ease;
    }

    .hs-dashboard__header .hs-theme-switch {
      position: absolute;
      top: 10px;
      left: 10px;
    }

    .hs-theme-switch__style {
      position: relative;
      width: 24px;
      height: 24px;
      line-height: 1;
      font-size: 20px;
      text-align: center;
    }

    .hs-theme-switch__icon svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .hs-theme-switch__thumb {
      position: absolute;
      top: 1px;
      left: 1px;
      width: 22px;
      height: 22px;
      border: 1px solid #ff7938;
      border-radius: 50%;
      background-color: #fafafa;
      box-sizing: border-box;
      transition: all 0.25s ease;
    }

    .hs-theme-switch_checked .hs-theme-switch__thumb {
      left: 27px;
      border-color: #4d4d4d;
    }

    .hs-toggle-screenreader-only {
      border: 0;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }
    /* #endregion theme */

    /* #region grid */
    .hs-dashboard__grid {
      display: flex;
      justify-content: space-around;
      margin: 0;
      padding: 0 40px;
      list-style: none;
    }

    .hs-dashboard__column {
      padding-right: 10px;
      padding-left: 10px;
    }

    .hs-dashboard__column a {
      display: block;
      padding-left: 20px !important;
      padding-right: 40px !important;
      text-decoration: none;
    }

    .hs-dashboard__container ul:not(.hs-dashboard__grid) {
      padding: 0;
    }

    .hs-dashboard__container li {
      padding-left: 0 !important;
      list-style: none;
    }

    .hs-dashboard__column .hs-dashboard__title {
      display: block;
      padding-left: var(--hs-spacing-horizontal) !important;
      padding-right: calc(var(--hs-spacing-horizontal) * 2) !important;
      text-align: left;
      margin-top: 10px !important;
    }

    .hs-dashboard__column .hs-dashboard__list {
      margin-top: 10px !important;
    }

    .hs-dashboard__column .hs-dashboard__list+.hs-dashboard__title {
      margin-top: var(--hs-global-spacing);
      padding-top: var(--hs-global-spacing);
    }

    .hs-dashboard__column .hs-dashboard__list .hs-dashboard__item {
      margin: 0 !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      height: var(--item-height);
      line-height: var(--item-height);
    }
    /* #endregion grid */

    /* #region custom */
    #hs-dashboard.hs-dashboard__wrapper {
      transition: all 0.2s ease;
    }

    #hs-dashboard .hs-dashboard__column .hs-dashboard__title {
      font-size: 14px;
      line-height: 1.5715;
      color: rgba(0, 0, 0, 0.45);
    }

    #hs-dashboard a {
      overflow: hidden;
      white-space: nowrap;
      font-size: 14px;
      text-overflow: ellipsis;
      text-decoration: none;
      color: rgba(0, 0, 0, 0.85);
      transition: color 0.3s ease;
    }

    #hs-dashboard a:hover {
      color: var(--hs-color-primary);
      text-decoration: none;
      outline: 0;
    }

    /* light */
    #hs-dashboard.hs-dashboard__wrapper_light {
      color: #161616;
      background-color: #fff;
    }

    #hs-dashboard.hs-dashboard__wrapper_light .hs-dashboard__list+.hs-dashboard__title {
      border-top: 1px solid var(--hs-color-gray-300);
    }

    /* dark */
    #hs-dashboard.hs-dashboard__wrapper_dark {
      color: #fff;
      background-color: #161616;
    }

    #hs-dashboard.hs-dashboard__wrapper_dark .hs-dashboard__list+.hs-dashboard__title {
      border-top: 1px solid var(--hs-color-gray-600);
    }

    #hs-dashboard.hs-dashboard__wrapper_dark .hs-dashboard__title {
      font-weight: bold;
      color: #fff;
    }

    #hs-dashboard.hs-dashboard__wrapper_dark a {
      color: #fff;
    }

    #hs-dashboard.hs-dashboard__wrapper_dark a:hover {
      color: var(--hs-color-primary);
    }

    #hs-dashboard .hs-dashboard__item.active,
    #hs-dashboard .hs-dashboard__item.active a,
    #hs-dashboard .hs-dashboard__item .active,
    #hs-dashboard .hs-dashboard__item.hs-active,
    #hs-dashboard .hs-dashboard__item.hs-active a {
      color: var(--hs-color-primary);
    }

    #hs-dashboard .hs-dashboard__item.hs-active {
      background-color: #e6f7ff;
    }

    #hs-dashboard .hs-dashboard__item {
      position: relative;
    }

    #hs-dashboard .hs-dashboard__item::after {
      content: ' ';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      border-right: 3px solid var(--hs-color-primary);
      transform: scaleY(0.0001);
      transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
        opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
        -webkit-transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
      opacity: 0;
    }

    #hs-dashboard .hs-dashboard__item.hs-active::after {
      transform: scaleY(1);
      opacity: 1;
      transition: transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
        opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
        -webkit-transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    /* #endregion custom */

  .hs-toc__wrapper {
      position: fixed;
      right: 68px;
      top: 24px;
      bottom: 24px;
      padding: 2px;
      z-index: 9999;
      box-sizing: border-box;
  }

  .hs-toc__list {
      padding: 10px;
      margin: 0;
      background-color: #fff;
      box-shadow: 0px 0px 2px rgb(0 0 0 / 20%);
      overflow-y: auto;
      min-width: 200px;
      max-height: 100%;
      box-sizing: border-box;
  }

  .hs-toc__list::-webkit-scrollbar {
      width: 8px;
      height: 8px;
  }

  .hs-toc__list::-webkit-scrollbar-thumb {
      /*! autoprefixer: off */
      background: rgba(183, 185, 190, 0.6);
      border-radius: 4px;
  }

  .hs-toc__list::-webkit-scrollbar-track {
      /*! autoprefixer: off */
      background: rgba(192, 192, 192, 0.2);
  }


  .hs-toc__item {
      padding: .3em 1em;
      font-size: 14px;
      list-style: none;
  }

  .hs-toc__item::marker {
      display: none;
  }

  .hs-toc__item a {
      color: #444;
      text-decoration: none;
  }


    `;
  }
  // #endregion STYLE

  // #region TOGGLE
  /** 生成 Dashboard 开关 */
  function initialToggle() {
    const tpl = initialToggleTpl();
    const ele = document.createElement("section");
    // ele.className = 'hs-dashboard__toggle';
    // ele.setAttribute("class", "hs-dashboard__toggle");
    ele.classList.add("hs-dashboard__toggle");
    ele.innerHTML = tpl;

    // toggle → body
    bodyContainer.appendChild(ele);
  }

  /** Dashboard 开关 DOM */
  function initialToggleTpl() {
    return `
        <!-- menu -->
        <div class="hs-dashboard__toggle-item hs-dashboard__toggle-menu">
          <i class="hs-dashboard__toggle-icon">
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="appstore"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zM464 544H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H212V612h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200z"
              ></path>
            </svg>
          </i>
        </div>
        <!-- api -->
        <div class="hs-dashboard__toggle-item hs-dashboard__toggle-help">
          <i class="hs-dashboard__toggle-icon">
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              class=""
              data-icon="bulb"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M632 888H392c-4.4 0-8 3.6-8 8v32c0 17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-32c0-4.4-3.6-8-8-8zM512 64c-181.1 0-328 146.9-328 328 0 121.4 66 227.4 164 284.1V792c0 17.7 14.3 32 32 32h264c17.7 0 32-14.3 32-32V676.1c98-56.7 164-162.7 164-284.1 0-181.1-146.9-328-328-328zm127.9 549.8L604 634.6V752H420V634.6l-35.9-20.8C305.4 568.3 256 484.5 256 392c0-141.4 114.6-256 256-256s256 114.6 256 256c0 92.5-49.4 176.3-128.1 221.8z"
              ></path>
            </svg>
          </i>
        </div>
          `;
  }
  // #endregion TOGGLE

  // #region THEME
  function handleTheme(isInit) {
    if (isInit) {
      const theme = localStorage.getItem("hs_dashboard_theme");

      if (theme && theme === "dark") {
        themeSwitchForm.checked = true;
      } else {
        themeSwitchForm.checked = false;
      }
    } else {
      themeSwitchForm.click();
    }

    const checked = themeSwitchForm.checked;

    if (checked) {
      localStorage.setItem("hs_dashboard_theme", "dark");
      wrapperEle.classList.add("hs-dashboard__wrapper_dark");
      wrapperEle.classList.remove("hs-dashboard__wrapper_light");
      themeSwitchEle.classList.add("hs-theme-switch_checked");
    } else {
      localStorage.setItem("hs_dashboard_theme", "light");
      wrapperEle.classList.add("hs-dashboard__wrapper_light");
      wrapperEle.classList.remove("hs-dashboard__wrapper_dark");
      themeSwitchEle.classList.remove("hs-theme-switch_checked");
    }
  }

  function initialThemeTpl() {
    return `
      <input type="checkbox" class="hs-toggle-screenreader-only hs-theme-switch__form-control" title="Dark mode" />
      <div class="hs-theme-switch__style hs-theme-switch__style_dark">
        <i class="hs-theme-switch__icon">
          <svg
            t="1588325093630"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="11008"
            width="1em"
            height="1em"
          >
            <path
              d="M483.555556 964.266667c-164.977778 0-315.733333-85.333333-398.222223-224.711111 19.911111 2.844444 39.822222 2.844444 56.888889 2.844444 275.911111 0 500.622222-224.711111 500.622222-500.622222 0-68.266667-14.222222-133.688889-39.822222-193.422222 201.955556 54.044444 347.022222 238.933333 347.022222 449.422222 0 256-210.488889 466.488889-466.488888 466.488889z"
              fill="#F7FF53"
              p-id="11009"
            ></path>
            <path
              d="M631.466667 73.955556c179.2 62.577778 301.511111 230.4 301.511111 423.822222 0 247.466667-201.955556 449.422222-449.422222 449.422222-147.911111 0-281.6-71.111111-364.088889-187.733333H142.222222c284.444444 0 517.688889-233.244444 517.688889-517.688889 0-56.888889-8.533333-113.777778-28.444444-167.822222M571.733333 22.755556C605.866667 88.177778 625.777778 162.133333 625.777778 241.777778c0 267.377778-216.177778 483.555556-483.555556 483.555555-31.288889 0-59.733333-2.844444-88.177778-8.533333 79.644444 156.444444 241.777778 264.533333 429.511112 264.533333 267.377778 0 483.555556-216.177778 483.555555-483.555555C967.111111 261.688889 796.444444 65.422222 571.733333 22.755556z"
              fill="#303133"
              p-id="11010"
            ></path>
            <path
              d="M787.911111 455.111111c-5.688889-2.844444-8.533333-8.533333-5.688889-14.222222 5.688889-17.066667-2.844444-42.666667-19.911111-48.355556-17.066667-5.688889-39.822222 8.533333-45.511111 22.755556-2.844444 5.688889-8.533333 8.533333-14.222222 5.688889-5.688889-2.844444-8.533333-8.533333-5.688889-14.222222 8.533333-25.6 42.666667-45.511111 73.955555-34.133334 28.444444 11.377778 39.822222 48.355556 31.288889 73.955556-2.844444 5.688889-8.533333 8.533333-14.222222 8.533333"
              fill="#303133"
              p-id="11011"
            ></path>
            <path
              d="M608.711111 620.088889c-14.222222 0-28.444444-2.844444-39.822222-11.377778-31.288889-22.755556-31.288889-65.422222-31.288889-68.266667 0-8.533333 8.533333-17.066667 17.066667-17.066666s17.066667 8.533333 17.066666 17.066666 2.844444 31.288889 17.066667 39.822223c11.377778 8.533333 25.6 8.533333 45.511111 0 8.533333-2.844444 19.911111 2.844444 22.755556 11.377777 2.844444 8.533333-2.844444 19.911111-11.377778 22.755556-14.222222 2.844444-25.6 5.688889-36.977778 5.688889zM571.733333 540.444444z"
              fill="#FF2929"
              p-id="11012"
            ></path>
            <path
              d="M810.666667 588.8c-5.688889 19.911111-36.977778 28.444444-68.266667 19.911111-31.288889-8.533333-54.044444-34.133333-48.355556-54.044444 5.688889-19.911111 36.977778-28.444444 68.266667-19.911111 34.133333 11.377778 54.044444 34.133333 48.355556 54.044444"
              fill="#FFA450"
              p-id="11013"
            ></path>
            <path
              d="M864.711111 270.222222c14.222222 42.666667 19.911111 91.022222 19.911111 136.533334 0 258.844444-213.333333 466.488889-477.866666 466.488888-96.711111 0-187.733333-28.444444-264.533334-76.8 82.488889 93.866667 204.8 156.444444 344.177778 156.444445C736.711111 952.888889 938.666667 756.622222 938.666667 512c0-88.177778-28.444444-173.511111-73.955556-241.777778z"
              fill="#FF7938"
              p-id="11014"
            ></path>
          </svg>
        </i>
      </div>
      <div class="hs-theme-switch__style hs-theme-switch__style_light">
        <i class="hs-theme-switch__icon">
          <svg
            t="1588324703446"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6232"
            width="1em"
            height="1em"
          >
            <path
              d="M792.35 835.94l-128.09-30.32c-17.73-4.2-36.12 3.66-45.34 19.37l-66.64 113.52c-15.83 26.97-54.67 27.4-71.1 0.79l-69.14-112.02c-9.57-15.5-28.13-22.95-45.76-18.36l-127.39 33.15c-30.26 7.88-58.03-19.29-50.83-49.72l30.32-128.09c4.2-17.73-3.66-36.12-19.37-45.34L85.49 552.28c-26.97-15.83-27.4-54.67-0.79-71.1l112.02-69.14c15.5-9.57 22.95-28.13 18.36-45.76l-33.15-127.39c-7.88-30.26 19.29-58.03 49.72-50.83l128.09 30.32c17.73 4.2 36.12-3.66 45.34-19.37l66.64-113.52c15.83-26.97 54.67-27.4 71.1-0.79l69.14 112.02c9.57 15.5 28.13 22.95 45.76 18.36l127.39-33.15c30.26-7.88 58.03 19.29 50.83 49.72l-30.32 128.09c-4.2 17.73 3.66 36.12 19.37 45.34l113.52 66.64c26.97 15.83 27.4 54.67 0.79 71.1l-112.02 69.14c-15.5 9.57-22.95 28.13-18.36 45.76l33.15 127.39c7.88 30.26-19.29 58.03-49.72 50.83z"
              fill="#FF7938"
              p-id="6233"
            ></path>
            <path
              d="M512 512m-207.66 0a207.66 207.66 0 1 0 415.32 0 207.66 207.66 0 1 0-415.32 0Z"
              fill="#F7FF53"
              p-id="6234"
            ></path>
            <path
              d="M442.78 468.74m-25.96 0a25.96 25.96 0 1 0 51.92 0 25.96 25.96 0 1 0-51.92 0Z"
              fill="#303133"
              p-id="6235"
            ></path>
            <path
              d="M581.22 468.74m-25.96 0a25.96 25.96 0 1 0 51.92 0 25.96 25.96 0 1 0-51.92 0Z"
              fill="#303133"
              p-id="6236"
            ></path>
            <path
              d="M442.78 582.02s17.31 48.31 69.22 48.31 69.22-48.31 69.22-48.31H442.78z"
              fill="#FF2929"
              p-id="6237"
            ></path>
          </svg>
        </i>
      </div>
      <div class="hs-theme-switch__thumb"></div>
    `;
  }
  // #endregion THEME

  // #region TOC
  function tocHandler() {
    function toc(tocItems) {

      document.querySelector('.hs-toc__wrapper')?.remove();

      // const tocItems = document.querySelectorAll('.content.element-doc > h3');

      const wrapper = document.createElement('aside');
      wrapper.classList.add('hs-toc__wrapper');

      const list = document.createElement('ul');
      list.classList.add('hs-toc__list');

      tocItems.forEach(tocItem => {
        const item = document.createElement('li');
        item.classList.add('hs-toc__item');
        // item.innerText = tocItem.innerText;
        item.dataset.nav = tocItem.id;

        const a = document.createElement('a');
        a.innerText = tocItem.innerText.split('\n')[1];
        a.href = `#${tocItem.id}`;
        item.dataset.nav = tocItem.id;
        item.appendChild(a);

        list.appendChild(item);
      });

      const body = document.querySelector('body');

      wrapper.appendChild(list);
      body.appendChild(wrapper);

      wrapper.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.target;
        let id = null;
        const tagName = target?.tagName?.toLowerCase();
        switch (tagName) {
          case 'a':
            id = target?.parentElement?.dataset?.nav;
            break;

          case 'li':
            id = target?.dataset?.nav;
            break;
        }

        if (id) {
          document.querySelector(`#${id}`).scrollIntoView({ behavior: "smooth", });
        }
      });
    }

    function handler(timer) {
      const tocItems = document.querySelectorAll('.content.element-doc > h3');
      if (tocItems.length > 0) {
        if (timer) {
          clearInterval(timer);
        }

        toc(tocItems);
      }
    }

    function listener(event) {
      const target = event.target;
      const tagName = target?.tagName?.toLowerCase();

      if (tagName === 'a') {
        const timer = setInterval(() => {
          handler(timer);
        }, 200);
      }
    }


    handler();

    document.querySelector('.side-nav').addEventListener('click', listener);
    document.querySelector('.hs-dashboard__container').addEventListener('click', listener);
  }
  // #endregion TOC

  // #region COMMON
  function hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
    }
  }

  function getParents(elem, selector) {
    // Element.matches() polyfill
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function (s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) { }
          return i > -1;
        };
    }

    // Get the closest matching element
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) return elem;
    }
    return null;
  }

  function queryDirectChildren(parent, selector) {
    const nodes = parent.querySelectorAll(selector);
    const filteredNodes = [].slice.call(nodes).filter((item) => item.parentNode.closest(selector) === parent.closest(selector));
    return filteredNodes;
  }
  // #endregion
})();

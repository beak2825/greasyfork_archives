// ==UserScript==
// @name         Ant Design Components Dashboard (React) (^4.0.0) / Ant Design 组件看板
// @namespace    https://github.com/xianghongai/Ant-Design-Components-Dashboard-React
// @version      0.0.7
// @description  Better view for Ant Design (React) / 更方便的查看 Ant Design (React) 组件
// @author       Nicholas Hsiang / 山茶树和葡萄树
// @icon         https://xinlu.ink/favicon.ico
// @match        https://4x.ant.design/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/402379/Ant%20Design%20Components%20Dashboard%20%28React%29%20%28%5E400%29%20%20Ant%20Design%20%E7%BB%84%E4%BB%B6%E7%9C%8B%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/402379/Ant%20Design%20Components%20Dashboard%20%28React%29%20%28%5E400%29%20%20Ant%20Design%20%E7%BB%84%E4%BB%B6%E7%9C%8B%E6%9D%BF.meta.js
// ==/UserScript==
(function () {
  "use strict";
  // NOTE: 已知问题：
  // 当离开“组件”页面进入“设计、文档、资源”时，会引发 DOMException 异常，需要刷新页面才会生效

  const bodyContainer = document.querySelector("body");

  const titleText = "Ant Design of React (4.x)";
  // 有的站点能够直接从菜单 root 操作
  // 有的则不能，因为他们在菜单切换时，是通过 Markdown 动态生态，需要插入到 root 层，不然报错
  const gridSelector = ".aside-container.menu-site";
  const columnSelector = ".ant-menu-item-group";
  const columnTitleSelector = ".ant-menu-item-group-title";

  const menuListSelector = ".ant-menu-item-group-list";
  const menuItemSelector = ".ant-menu-item-group-list .ant-menu-item";
  const helpEnable = true;
  const helpSelector = ".api-container";
  const removeSelector = gridSelector + ">li:not(.ant-menu-item-group)";

  const cloneNodeEnable = true; // 保留原 DOM 节点? 有的站点上设置 true 会造成刷新

  let interval = null;
  let timeout = null;

  let created = false;

  // #region 点击 Nav

  /** 导航菜单点击事件 */
  function handleMenuSiteNav(event) {
    const eventTarget = event.target;
    const tagName = eventTarget.tagName.toLowerCase();

    if (tagName === "a") {
      enterOrLeave(eventTarget.href);
    }
  }

  const menuSiteNavHandler = debounce(handleMenuSiteNav, 500);

  /** 导航菜单绑定事件 */
  function initialMenuSiteNavEvent() {
    var menuSite = document.querySelector("#nav");
    menuSite.addEventListener("click", menuSiteNavHandler);
  }

  // #endregion 点击 Nav

  // #region 组件页面 24 栅格
  function resetLayout(type) {
    const pageSider = document.querySelector(".main-wrapper>.ant-row>.main-menu");
    const pageContainer = document.querySelector(".main-wrapper>.ant-row>.ant-col+.ant-col");

    if (!pageSider || !pageContainer) {
      return false;
    }

    switch (type) {
      case "in":
        pageSider.classList.add("hs-hide");
        pageContainer.classList.remove("ant-col-md-18", "ant-col-lg-18", "ant-col-xl-19", "ant-col-xxl-20");
        pageContainer.classList.add("ant-col-md-24", "ant-col-lg-24", "ant-col-xl-24", "ant-col-xxl-24");
        break;
      default:
        pageSider.classList.remove("hs-hide");
        pageContainer.classList.remove("ant-col-md-24", "ant-col-lg-24", "ant-col-xl-24", "ant-col-xxl-24");
        pageContainer.classList.add("ant-col-md-18", "ant-col-lg-18", "ant-col-xl-19", "ant-col-xxl-20");
        break;
    }
  }
  // #endregion 组件页面 24 栅格

  // #region 看当前 URL 是不是组件页面
  function enterOrLeave(href = window.location.href) {
    if (href.includes("components")) {
      console.log("Ant Design Components Dashboard (React) (^4.0.0)");
      bodyContainer.classList.add("hs-page__component");
      resetLayout("in");

      if (created === false) {
        created = true;
        timeout = window.setTimeout(() => {
          initialDashboard();
        }, 500);
      }
    } else {
      bodyContainer.classList.remove("hs-page__component");
      resetLayout("off");
    }
  }
  // #endregion 看当前 URL 是不是组件页面

  // #region MENU
  /** 生成 Menu */
  function initialMenu() {
    // Wrapper
    const wrapperEle = document.createElement("section");
    wrapperEle.classList.add("hs-dashboard__wrapper", "hs-hide");

    // Header
    const headerEle = document.createElement("header");
    headerEle.classList.add("hs-dashboard__header");

    // Title
    const titleEle = document.createElement("h1");
    titleEle.classList.add("hs-dashboard__title");
    titleEle.innerText = titleText || "";

    // Title → Header
    headerEle.appendChild(titleEle);

    // Menu
    const containerEle = document.createElement("div");
    containerEle.classList.add("hs-dashboard__container");

    // 0. 移除一些不要的元素
    if (removeSelector) {
      const removeEle = document.querySelectorAll(removeSelector);
      if (removeEle) {
        removeEle.forEach((element) => {
          // element.remove();
          element.classList.add("hs-hide");
        });
      }
    }

    // 1. 先从页面上获取 DOM
    let gridEle = null;

    if (cloneNodeEnable) {
      gridEle = document.querySelector(gridSelector).cloneNode(true);
    } else {
      gridEle = document.querySelector(gridSelector);
    }

    let menuEle = document.createElement("nav");

    menuEle.setAttribute("class", gridEle.className);
    menuEle.classList.add("hs-dashboard__grid");

    let menuItemsEle = gridEle.querySelectorAll(columnSelector);

    menuItemsEle.forEach((element) => {
      menuEle.appendChild(element);
    });

    // Menu → Container
    containerEle.appendChild(menuEle);

    // 2. 内部元素追加新的样式
    // 2.1 column
    const columnEle = containerEle.querySelectorAll(columnSelector);
    columnEle.forEach((element) => {
      element.classList.add("hs-dashboard__column");
    });

    // 2.2 title
    const columnTitleEle = containerEle.querySelectorAll(columnTitleSelector);
    columnTitleEle.forEach((element) => {
      element.classList.add("hs-dashboard__item-title");
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

    // header,container → wrapper
    wrapperEle.appendChild(headerEle);
    wrapperEle.appendChild(containerEle);

    // wrapper → body
    bodyContainer.appendChild(wrapperEle);
  }
  // #endregion MENU

  // #region Event
  /** 注册事件 */
  function handleEvent() {
    const wrapperEle = document.querySelector(".hs-dashboard__wrapper");

    const toggleMenuBtn = document.querySelector('.hs-dashboard__toggle-menu');
    const toggleHelpBtn = document.querySelector('.hs-dashboard__toggle-help');

    function handler(event) {
      const targetEle = event.target;

      const isItem = getParents(targetEle, ".hs-dashboard__item") || hasClass(targetEle, "hs-dashboard__item") || (getParents(targetEle, ".hs-dashboard__column") && getParents(targetEle, ".hs-dashboard__list"));

      const isToggle = getParents(targetEle, ".hs-dashboard__toggle-menu") || hasClass(targetEle, "hs-dashboard__toggle-menu");

      const isHelp = getParents(targetEle, ".hs-dashboard__toggle-help") || hasClass(targetEle, "hs-dashboard__toggle-help");

      if (isItem) {
        clearStyle(wrapperEle);
      } else if (isToggle) {
        wrapperEle.classList.toggle("hs-hide");
        bodyContainer.classList.toggle("hs-body-overflow_hide");
      } else if (isHelp) {
        clearStyle(wrapperEle);
        handleHelp();
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

    const helpEle = document.querySelector(helpSelector);
    const top = helpEle.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }
  // #endregion HELP

  // #region STYLE
  /** 添加样式 */
  function initialStyle() {
    const tpl = initialStyleTpl();
    const headEle = document.head || document.getElementsByTagName("head")[0];
    const styleEle = document.createElement("style");

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
            top: 5px;
            right: 5px;
          }

          .hs-dashboard__toggle-item {
            width: 28px;
            height: 28px;
            margin-top: 10px;
            margin-bottom: 10px;
            overflow: hidden;
            line-height: 30px !important;
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

          .hs-dashboard__toggle-icon {
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
            font-size: 16px;
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
            padding-top: 10px;
            text-align: center;
          }

          .hs-dashboard__title {
            margin: 0;
            padding-top: 10px;
            padding-bottom: 10px;
            font-size: 1em;
            font-weight: normal;
          }

          /* #region grid */
          .hs-dashboard__grid {
            display: flex;
            justify-content: space-evenly;
            /* justify-content: space-around; */
            margin: 0;
            padding: 0;
            list-style: none;
          }

          .hs-dashboard__column {
            padding-right: 10px;
            padding-left: 10px;
          }

          .hs-dashboard__column a {
            text-decoration: none;
          }

          .hs-dashboard__column {
            list-style: none;
          }

          .hs-dashboard__column ul {
            padding: 0;
          }

          .hs-dashboard__column li {
            list-style: none;
          }

          .hs-dashboard__column .hs-dashboard__item-title {
            display: block;
            margin-top: 0 !important;
          }

          /* #endregion grid */

          /* #region custom */
          .fixed-widgets {
            z-index: 9;
          }
          body[data-theme='dark'] .hs-dashboard__wrapper,
          body[data-theme='dark'] .hs-menu-wrapper.ant-menu {
            color: rgba(255,255,255,0.65);
            background-color: #141414;
          }

          body[data-theme='dark'] .hs-dashboard__title {
            color: rgba(255,255,255,0.65);
          }

          .hs-dashboard__column .hs-dashboard__list .hs-dashboard__item,
          .hs-dashboard__column .hs-dashboard__list .ant-menu-item {
            height: 36px;
            line-height: 36px;
            margin-top: 0;
            margin-bottom: 0;
          }
          /* #endregion custom */
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

  function debounce(callback, delay) {
    var timer = null;

    return function () {
      if (timer) return;

      callback.apply(this, arguments);
      timer = setTimeout(() => (timer = null), delay);
    };
  }

  function throttle(callback, delay) {
    let isThrottled = false,
      args,
      context;

    function wrapper() {
      if (isThrottled) {
        args = arguments;
        context = this;
        return;
      }

      isThrottled = true;
      callback.apply(this, arguments);

      setTimeout(() => {
        isThrottled = false;
        if (args) {
          wrapper.apply(context, args);
          args = context = null;
        }
      }, delay);
    }

    return wrapper;
  }

  // #endregion

  function initialDashboard() {
    window.clearTimeout(timeout);
    initialToggle();
    initialStyle();
    initialMenu();
    initialHelp();
    handleEvent();
  }

  function ready() {
    const originEle = document.querySelector(gridSelector);

    if (originEle) {
      window.clearInterval(interval);
      initialMenuSiteNavEvent();
      enterOrLeave();
    }
  }

  interval = window.setInterval(ready, 1000);
})();

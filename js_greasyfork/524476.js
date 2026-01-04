// ==UserScript==
// @name         auto-signin-scripts
// @namespace    SublimeCT
// @version      0.1.1
// @author       Ryan
// @description  自动签到脚本(掘金签到/抽奖), 需要配合自动化脚本(MacOS: Script Editor / Windows: bat)使用, 开机启动(MacOS: 启动项管理 / Windows: Task Scheduler)
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @include      /^https:\/\/juejin\.cn/
// @downloadURL https://update.greasyfork.org/scripts/524476/auto-signin-scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/524476/auto-signin-scripts.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var Pages = /* @__PURE__ */ ((Pages2) => {
    Pages2[Pages2["juejin"] = 0] = "juejin";
    return Pages2;
  })(Pages || {});
  const PagesInfoMap = {
    [
      0
      /* juejin */
    ]: {
      name: "掘金签到页",
      pattern: /^https:\/\/juejin\.cn/
      // 由于掘金是 SPA, 所以只需要匹配域名即可, 如果需要匹配具体的页面, 会导致从其他页面进入签到页时, 无法触发签到逻辑
      // pattern: /^https:\/\/juejin\.cn\/user\/center\/(signin|lottery)/,
    }
  };
  function delay(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }
  async function waitFor(fn, times = 60) {
    for (let _times = times; _times--; ) {
      const result = fn();
      if (result === undefined) {
        await delay(200);
        continue;
      }
      return result;
    }
    return undefined;
  }
  async function waitForElement(selector, times) {
    return waitFor(() => document.querySelector(selector) || undefined, times);
  }
  const _Application = class _Application {
    static use(plugin) {
      _Application.modules.push(plugin);
      return this;
    }
    /** 触发 onLoad 钩子 */
    onLoad() {
      if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", () => this.emit("onLoad"));
      } else {
        this.emit("onLoad");
      }
    }
    /** 检测当前页面是否是 angular SPA 页面, 监听路由变化并触发 routeChange 钩子 */
    async listenAngularRouteChange() {
      const angular = await waitFor(() => window.angular);
      if (!angular) return;
      const appElement = document.querySelector("[ng-app]") || document.body;
      const injector = await waitFor(() => angular.element(appElement).injector());
      if (!injector) throw new Error("angular injector not found");
      const $rootScope = injector.get("$rootScope");
      $rootScope.$on("$locationChangeSuccess", (_, newUrl, oldUrl) => {
        const toRoute = { path: newUrl, name: newUrl, meta: { title: newUrl } };
        const fromRoute = { path: oldUrl, name: oldUrl, meta: { title: oldUrl } };
        this.emit("routeChange", toRoute, fromRoute);
      });
    }
    /** 检测当前页面是否是 vue SPA 页面, 监听路由变化并触发 routeChange 钩子 */
    async listenVueRouteChange() {
      const app = await waitForElement("#app,#__nuxt");
      if (!app) return;
      const appInstance = await waitFor(() => app == null ? undefined : app.__vue__);
      if (!appInstance) return;
      appInstance.$router.afterEach((to, from) => {
        this.emit("routeChange", to, from);
      });
    }
    /** 判断当前页面是否匹配当前模块 */
    matchModulePage(applicationModule) {
      return PagesInfoMap[applicationModule.page].pattern.test(location.href);
    }
    /**
     * 触发钩子函数
     * @param hook 钩子事件函数名
     */
    emit(hook, ...args) {
      for (const m of _Application.modules) {
        if (this.matchModulePage(m) && typeof m[hook] === "function") {
          m[hook](...args);
        }
      }
    }
  };
  __publicField(_Application, "modules", []);
  __publicField(_Application, "application", new _Application());
  let Application = _Application;
  function getPathname() {
    return location.hash && location.hash.substring(0, 2) === "#/" ? location.hash.substring(1) : location.pathname;
  }
  function checkRoute(route, page) {
    const isCurrentPage = PagesInfoMap[page].pattern.test(location.href);
    const pathname = getPathname();
    if (!isCurrentPage) return false;
    if (route instanceof RegExp) {
      return route.test(pathname);
    } else {
      return route === pathname;
    }
  }
  class JueJinLotteryModule {
    constructor() {
      __publicField(this, "page", Pages.juejin);
      __publicField(this, "initialized", false);
    }
    async onLoad() {
      console.log("lottery");
      if (!checkRoute("/user/center/lottery", this.page)) return this.unMounted();
      if (this.initialized) return;
      this._clickLotteryButton();
    }
    routeChange() {
      this.onLoad();
    }
    unMounted() {
    }
    async _clickLotteryButton() {
      console.warn("click lottery button");
      const signinButton = await waitForElement("#turntable-item-0");
      if (!signinButton || !signinButton.textContent) throw new Error("抽奖按钮未找到");
      console.log(signinButton, signinButton.textContent.trim());
      await delay(1e3);
      if (signinButton.textContent.trim().indexOf("免费抽奖次数") === -1) return console.log("今日已抽奖");
      signinButton.click();
      const lotteryModalSubmitButton = await waitForElement(".lottery-modal button.submit");
      if (!lotteryModalSubmitButton) throw new Error("抽奖结果弹窗未找到");
      lotteryModalSubmitButton.click();
    }
  }
  class JueJinSigninModule {
    constructor() {
      __publicField(this, "page", Pages.juejin);
      __publicField(this, "initialized", false);
    }
    async onLoad() {
      if (!checkRoute("/user/center/signin", this.page)) return this.unMounted();
      if (this.initialized) return;
      this._checkSignin();
    }
    routeChange() {
      this.onLoad();
    }
    unMounted() {
    }
    async _checkSignin() {
      const signinButton = await waitForElement("button.signin.btn");
      if (!signinButton || !signinButton.textContent || signinButton.textContent.trim() !== "立即签到") throw new Error("签到按钮未找到或已经签到");
      signinButton.click();
      console.log("signin success");
      this._toLotteryPage();
    }
    async _toLotteryPage() {
      const lotteryMenuItemButton = await waitForElement('.menu .byte-menu-item[href^="/user/center/lottery"]');
      if (!lotteryMenuItemButton) throw new Error("Missing lottery menu item");
      lotteryMenuItemButton.click();
    }
  }
  Application.use(new JueJinSigninModule()).use(new JueJinLotteryModule());
  const application = new Application();
  application.emit("onInit");
  application.onLoad();
  application.listenVueRouteChange();
  application.listenAngularRouteChange();

})();
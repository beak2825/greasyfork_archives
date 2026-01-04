// ==UserScript==
// @author          zhzLuke96
// @name            油管视频旋转
// @name:en         youtube player rotate
// @version         2.10
// @description     油管的视频旋转插件.
// @description:en  rotate youtube player.
// @namespace       https://github.com/zhzLuke96/ytp-rotate
// @match           https://www.youtube.com/*
// @grant           none
// @license         MIT
// @supportURL      https://github.com/zhzLuke96/ytp-rotate/issues
// @icon            https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/375568/%E6%B2%B9%E7%AE%A1%E8%A7%86%E9%A2%91%E6%97%8B%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/375568/%E6%B2%B9%E7%AE%A1%E8%A7%86%E9%A2%91%E6%97%8B%E8%BD%AC.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  // assets
  const assets = {
    locals: {
      zh: {
        click_rotate: "点击顺时针旋转视频90°",
        toggle_plugin: "开/关 ytp-rotate",
        rotate90: "旋转90°",
        cover_screen: "填充屏幕",
        flip_horizontal: "水平翻转",
        flip_vertical: "垂直翻转",
        PIP: "画中画",
        click_cover_screen: "点击 开/关 填充屏幕",
      },
      en: {
        click_rotate: "click to rotate video 90°",
        toggle_plugin: "on/off ytp-rotate",
        rotate90: "rotate 90°",
        cover_screen: "cover screen",
        flip_horizontal: "flip horizontal",
        flip_vertical: "flip vertical",
        PIP: "picture in picture",
        click_cover_screen: "click to on/off screen",
      },
    },
    icons: {
      rotate: `<svg style="transform: rotateX(180deg);" width="24px" height="24px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" fill="white" fill-opacity="0.01"/>
      <path d="M4 24C4 35.0457 12.9543 44 24 44L19 39" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M44 24C44 12.9543 35.0457 4 24 4L29 9" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M30 41L7 18L18 7L41 30L30 41Z" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      fullscreen: `<svg width="24px" height="24px" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg" class="si-glyph si-glyph-fullscreen"><g fill="currentColor" fill-rule="evenodd"><path class="si-glyph-fill" d="M3 5h12v8H3zM3.918 14.938H1v-2.876h1v1.98h1.918v.896ZM17 14.938h-2.938v-.896H16v-1.984h1v2.88ZM17 5.917h-1v-1.95h-1.943v-.946H17v2.896ZM2 5.938H1V3h2.938v.938H2v2Z"/></g></svg>`,
      flip_horizontal: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M2 18.114V5.886c0-1.702 0-2.553.542-2.832.543-.28 1.235.216 2.62 1.205l1.582 1.13c.616.44.924.66 1.09.982C8 6.694 8 7.073 8 7.83v8.34c0 .757 0 1.136-.166 1.459-.166.323-.474.543-1.09.983l-1.582 1.13c-1.385.988-2.077 1.483-2.62 1.204C2 20.666 2 19.816 2 18.114ZM22 18.114V5.886c0-1.702 0-2.553-.542-2.832-.543-.28-1.235.216-2.62 1.205l-1.582 1.13c-.616.44-.924.66-1.09.982C16 6.694 16 7.073 16 7.83v8.34c0 .757 0 1.136.166 1.459.166.323.474.543 1.09.983l1.581 1.13c1.386.988 2.078 1.483 2.62 1.204.543-.28.543-1.13.543-2.832Z"/><path fill="currentColor" fill-rule="evenodd" d="M12 1.25a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75Zm0 8a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 .75-.75Zm0 8a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd"/></svg>`,
      flip_vertical: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M18.114 22H5.886c-1.702 0-2.553 0-2.832-.542-.28-.543.216-1.235 1.205-2.62l1.13-1.582c.44-.616.66-.924.982-1.09C6.694 16 7.073 16 7.83 16h8.34c.757 0 1.136 0 1.459.166.323.166.543.474.983 1.09l1.13 1.581c.988 1.386 1.483 2.078 1.204 2.62-.28.543-1.13.543-2.832.543ZM18.114 2H5.886c-1.702 0-2.553 0-2.832.542-.28.543.216 1.235 1.205 2.62l1.13 1.582c.44.616.66.924.982 1.09C6.694 8 7.073 8 7.83 8h8.34c.757 0 1.136 0 1.459-.166.323-.166.543-.474.983-1.09l1.13-1.582c.988-1.385 1.483-2.077 1.204-2.62C20.666 2 19.816 2 18.114 2Z"/><path fill="currentColor" fill-rule="evenodd" d="M1.25 12a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1-.75-.75Zm8 0a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Zm8 0a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"/></svg>`,
      pip: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zm-1 2h-6v4h6v-4z"/></svg>`,
    },
  };
  const constants = {
    version: GM_info.script.version,
    user_lang:
      (
        navigator.language ||
        navigator.browserLanguage ||
        navigator.systemLanguage
      ).toLowerCase() || "",
    style_rule_name: "ytp_player_rotate_user_js",
  };

  const $ = (q) => document.querySelector(q);
  const i18n = (x) =>
    assets.locals[constants.user_lang.includes("zh") ? "zh" : "en"][x] || x;
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function $css(style_obj, important = true) {
    return (
      Object.entries(style_obj || {})
        // transform用array储存属性
        .map(([k, v]) => [k, Array.isArray(v) ? v.join(" ") : v])
        .map(([k, v]) => `${k}:${v} ${important ? "!important" : ""};`)
        .join("\n")
    );
  }

  // NOTE: 为了解决 `This document requires 'TrustedHTML' assignment.` 问题
  // 首先，检查 trustedTypes 是否可用
  let trusted_policy = null;
  if (window.trustedTypes) {
    // 如果默认策略不存在，创建一个新的默认策略
    if (!window.trustedTypes.defaultPolicy) {
      try {
        window.trustedTypes.createPolicy("default", {
          createHTML: (string, sink) => {
            return string;
          },
        });
      } catch (error) {
        console.error("Failed to create default Trusted Types policy:", error);
      }
    }

    // 如果默认策略存在但没有 createHTML 方法，尝试添加这个方法
    if (
      window.trustedTypes.defaultPolicy &&
      !window.trustedTypes.defaultPolicy.createHTML
    ) {
      try {
        Object.defineProperty(window.trustedTypes.defaultPolicy, "createHTML", {
          value: function (string, sink) {
            return string;
          },
          writable: false,
          enumerable: true,
          configurable: false,
        });
      } catch (error) {
        console.error(
          "Failed to add createHTML to default Trusted Types policy:",
          error
        );
      }
    }

    try {
      trusted_policy = window.trustedTypes.createPolicy("safe", {
        createHTML: (string, sink) => {
          return string;
        },
      });
    } catch (error) {
      console.error("Failed to create default Trusted Types policy:", error);
    }
  }

  /**
   * @param {string} string
   * @returns {string | TrustedHTML}
   */
  function trusted_html(string) {
    if (window.trustedTypes?.defaultPolicy?.createHTML) {
      try {
        return window.trustedTypes.defaultPolicy.createHTML(string);
      } catch (error) {
        // console.error("Failed to create trusted HTML:", error);
      }
      try {
        if (trusted_policy) {
          return trusted_policy.createHTML(string);
        }
      } catch (error) {
        // console.error("Failed to create trusted HTML:", error);
      }
    }
    return string;
  }

  /**
   * debounce
   *
   * @param {Function} func - The function to debounce.
   * @param {number} wait - The number of milliseconds to delay.
   * @param {boolean} [immediate=false] - Specifies whether the function should be invoked on the leading edge (`true`) or the trailing edge (`false`) of the `wait` timeout. Default is `false`.
   * @return {Function} - The debounced function.
   */
  function debounce(func, wait, immediate = false) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  async function wait_for_element(selector) {
    let retry_count = 60;
    while (retry_count > 0) {
      const element = $(selector);
      if (element && element instanceof HTMLElement) {
        return element;
      } else {
        retry_count--;
        await delay(1000);
      }
    }
    throw new Error(
      `[ytp-rotate]TIMEOUT, setup failed, can't find [${selector}]`
    );
  }

  class YtdApp {
    static EVENT_onReady = "onReady";
    static EVENT_innertubeCommand = "innertubeCommand";
    static EVENT_onOrchestrationBecameLeader = "onOrchestrationBecameLeader";
    static EVENT_onOrchestrationLostLeader = "onOrchestrationLostLeader";
    static EVENT_onOfflineOperationFailure = "onOfflineOperationFailure";
    static EVENT_SIZE_CLICKED = "SIZE_CLICKED";
    static EVENT_onFullerscreenEduClicked = "onFullerscreenEduClicked";
    static EVENT_onStateChange = "onStateChange";
    static EVENT_onPlayVideo = "onPlayVideo";
    static EVENT_onAutonavChangeRequest = "onAutonavChangeRequest";
    static EVENT_onVideoDataChange = "onVideoDataChange";
    static EVENT_onCollapseMiniplayer = "onCollapseMiniplayer";
    static EVENT_cinematicSettingsToggleChange =
      "cinematicSettingsToggleChange";
    static EVENT_onFeedbackStartRequest = "onFeedbackStartRequest";
    static EVENT_onFeedbackArticleRequest = "onFeedbackArticleRequest";
    static EVENT_onYpcContentRequest = "onYpcContentRequest";
    static EVENT_onAutonavPauseRequest = "onAutonavPauseRequest";
    static EVENT_onAdStateChange = "onAdStateChange";
    static EVENT_CONNECTION_ISSUE = "CONNECTION_ISSUE";
    static EVENT_SUBSCRIBE = "SUBSCRIBE";
    static EVENT_UNSUBSCRIBE = "UNSUBSCRIBE";
    static EVENT_onYtShowToast = "onYtShowToast";
    static EVENT_onFullscreenChange = "onFullscreenChange";
    static EVENT_onAbnormalityDetected = "onAbnormalityDetected";
    static EVENT_onAutonavCoundownStarted = "onAutonavCoundownStarted";
    static EVENT_updateEngagementPanelAction = "updateEngagementPanelAction";
    static EVENT_changeEngagementPanelVisibility =
      "changeEngagementPanelVisibility";
    static EVENT_onVideoProgress = "onVideoProgress";

    static PlayerStates = {
      [2]: "paused",
      [3]: "playing",
      [5]: "cued",
    };

    // 这个组件是全局单例，页面不关闭都存在
    $root = wait_for_element("ytd-app");

    // inner ytd-player instance
    /**
     * @type {YtdInstance}
     */
    _ytd_player_ = null;
    $player_root = null;

    $right_controls = this.wait_for_element(".ytp-right-controls");
    $left_controls = this.wait_for_element(".ytp-left-controls");
    $settings_button = this.wait_for_element(".ytp-settings-button");

    ready = new Promise(async (resolve, reject) => {
      const query_player = async () => {
        const root = await this.$root;
        this.$player_root = root.querySelector(".html5-video-player");
        if (this.$player_root) {
          resolve();
          return this.$player_root;
        }
      };
      const instance = await this.ytd_player_instance();
      if (!instance) {
        reject(new Error("can't find ytd-player instance"));
        return;
      }
      instance.addEventListener(YtdApp.EVENT_onReady, query_player);
      instance.addEventListener(YtdApp.EVENT_onPlayVideo, query_player);
      instance.addEventListener(YtdApp.EVENT_onVideoDataChange, query_player);
      instance.addEventListener(YtdApp.EVENT_onVideoProgress, query_player);

      // 不需要...
      // setTimeout(() => {
      //   reject(new Error("timeout"));
      // }, 1000 * 60);
    });

    async ytd_player_instance() {
      while (!this._ytd_player_) {
        const $player = await wait_for_element("ytd-player");
        this._ytd_player_ = $player.player_;
        await delay(1000);
      }
      return this._ytd_player_;
    }

    /**
     *
     * @returns {Promise<Number>}
     */
    async get_player_state() {
      const instance = await this.ytd_player_instance();
      return instance.getPlayerState();
    }

    /**
     *
     * @param {String} event
     */
    async wait_for_player_event(event) {
      const instance = await this.ytd_player_instance();
      return new Promise((resolve) => {
        instance.addEventListener(event, resolve);
      });
    }

    /**
     *
     * @param {String} selector
     * @returns {Promise<HTMLElement>}
     */
    async wait_for_element(selector) {
      await this.ready;
      const $player = await this.get_player_root();
      let element = $player.querySelector(selector);
      while (!element) {
        await delay(500);
        element = $player.querySelector(selector);
      }
      return element;
    }

    /**
     *
     * @returns {Promise<HTMLDivElement>}
     */
    async get_player_root() {
      if (this.$player_root) {
        return this.$player_root;
      }
      await this.ready;
      this.$player_root = document.querySelector(".html5-video-player");
      if (this.$player_root) {
        return this.$player_root;
      }
      throw new Error("can't find player element");
    }
  }
  const ytd_app = new YtdApp();

  class YtpPlayer {
    ui = new YtpPlayerUI();
    rotate_transform = new RotateTransform();
    $player = ytd_app.get_player_root();
    $video = null; // 从$player中获取

    enabled = true;

    constructor() {
      this.ready = this.setup();

      this.ready.then(() => {
        console.log("[ytp-rotate:player] ready");
        this.setup_observer();
      });
    }

    async setup_observer() {
      // ready 之后监听player元素变化
      this.observe_player_rerender();
      this.observe_player_resize();

      const debounce_update = debounce(() => this.update(), 300);

      // FIXME 没有gc
      window.addEventListener("resize", debounce_update);
      window.addEventListener("popstate", debounce_update);

      const instance = await ytd_app.ytd_player_instance();
      if (!instance) {
        console.warn("[ytp-rotate] can't find ytd-player instance");
        return;
      }
      instance.addEventListener(
        YtdApp.EVENT_onVideoDataChange,
        debounce_update
      );
    }

    async setup() {
      await this.$player;
      await this.mount_rotate_component();
      await this.mount_ui_component();
      this.enable();
    }

    // 监听player元素变化
    // NOTE: 加这个是因为油管的广告也是用player播放，并且播放完之后video元素不会复用...直接就删了...所以需要监听player的子元素变化
    // NOTE2: 其实理论上说css写在player上就行了，但是计算缩放需要针对特定的视频分辨率，所以还是写在video上比较好
    async observe_player_rerender() {
      if (window.MutationObserver === undefined) {
        // 有可能没有
        console.warn(
          `[ytp-rotate] MutationObserver not supported, can't observe player`
        );
        return;
      }
      const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            const video_elem =
              mutation.target.querySelector(".html5-main-video");
            if (!video_elem) {
              continue;
            }
            if (video_elem !== this.$video) {
              this.$video = video_elem;
              this.reset_rotate_component().catch((e) =>
                console.error("[ytp-rotate] reset_rotate_component failed", e)
              );
              // FIXME 这里最好ui也reset一下，但是现在暂时不用
              // this.reset_ui_component();
            }
          }
        }
      });
      observer.observe(await this.$player, { childList: true });
    }

    async observe_player_resize() {
      if (window.ResizeObserver === undefined) {
        console.warn(
          `[ytp-rotate] ResizeObserver not supported, can't observe player`
        );
        return;
      }
      const $player = await this.$player;
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === $player) {
            this.update();
          }
        }
      });
      observer.observe($player);
    }

    async mount_ui_component() {
      const $player = await this.$player;
      const $video = $player.querySelector(
        ".html5-video-container .html5-main-video"
      );
      if (!$video) {
        throw new Error("can't find video element");
      }
      this.$video = $video;
      this.ui.mount($video, $player);
    }

    async mount_rotate_component() {
      const $player = await this.$player;
      const $video = $player.querySelector(
        ".html5-video-container .html5-main-video"
      );
      if (!$video) {
        throw new Error("can't find video element");
      }
      this.$video = $video;
      this.rotate_transform.mount($video, $player);
    }

    // 重置旋转组件
    // NOTE 现在只有video元素变化才会调用
    async reset_rotate_component() {
      console.warn(
        `[ytp-rotate] video element changed, reset rotate component...`
      );
      this.rotate_transform.unmount();
      this.rotate_transform = new RotateTransform();

      await this.mount_rotate_component();
    }

    async reset_ui_component() {
      console.warn(`[ytp-rotate] video element changed, reset ui component...`);
      this.ui.unmount();
      this.ui = new YtpPlayerUI();

      await this.mount_ui_component();
    }

    enable() {
      this.enabled = true;
      this.ui.enable();
      this.rotate_transform.enable();

      this.update();
    }

    disable() {
      this.enabled = false;
      this.ui.disable();
      this.rotate_transform.disable();
      this.rotate_transform.reset();

      this.update();
    }

    async is_visible() {
      return (await this.$player).getBoundingClientRect().width > 0;
    }

    async update() {
      if (!this.enabled || !(await this.is_visible())) {
        return;
      }
      await this.ready;
      this.rotate_transform.update();
      this.ui.update();
      // debug
      // console.log("[ytp-rotate] update", Date.now());
    }
  }

  class YtpPlayerUI {
    key2dom = {};
    enabled = true;

    elements = [];

    buttons = [];
    menuitems = [];

    constructor() {
      // pass
    }

    mount($video, $player) {
      if (!($video instanceof HTMLVideoElement)) {
        throw new Error("$video must be a HTMLVideoElement");
      }
      if (!($player instanceof HTMLElement)) {
        throw new Error("$player must be a HTMLElement");
      }
      this.$video = $video;
      this.$player = $player;
    }

    unmount() {
      this.disable();
      for (const element of this.elements) {
        element.remove();
      }
      this.elements = [];
      this.buttons = [];
      this.menuitems = [];
      this.key2dom = {};
    }

    enable() {
      this.enabled = true;
      // for (const dom of Object.values(this.key2dom)) {
      //   dom.hidden = false;
      // }
    }

    disable() {
      this.enabled = false;

      // NOTE 因为隐藏之后menu container不会resize所以算了不隐藏了...
      // for (const [key, dom] of Object.entries(this.key2dom)) {
      //   if (key === "menu_toggle_plugin") continue;
      //   dom.hidden = true;
      // }
    }

    update() {
      for (const item of Object.values(this.menuitems)) {
        item.on_update?.();
      }
    }

    async add_button({
      html = "",
      class_name = "ytp-button",
      on_click,
      css_text = "",
      id,
      key = "",
      title = "",
      to_right = true,
    } = {}) {
      const $right_controls = await ytd_app.$right_controls;
      const $left_controls = await ytd_app.$left_controls;
      const $settings_button = await ytd_app.$settings_button;
      const $button = $settings_button.cloneNode(true);
      this.elements.push($button);

      $button.innerHTML = trusted_html(html);
      $button.classList.add(class_name);
      if (css_text) $button.style.cssText = css_text;
      if (id) $button.id = id;
      if (key) this.key2dom[key] = $button;
      if (title) {
        $button.title = title;
        $button.setAttribute("aria-label", title);
      }
      if (on_click)
        $button.addEventListener("click", async (ev) => {
          try {
            await on_click(ev);
          } catch (error) {
            console.error(error);
          }
        });
      if (to_right) {
        $right_controls.insertBefore(
          $button,
          $right_controls.firstElementChild
        );
      } else {
        $left_controls.appendChild($button);
      }
      this.buttons.push({
        $button,
        on_click,
        key,
        id,
      });
      this.button_normalize($button);

      return $button;
    }

    button_normalize($btn) {
      if (!($btn instanceof HTMLButtonElement)) {
        return;
      }
      // 移除quality-badge相关class
      for (const cls of $btn.classList) {
        if (cls.endsWith("quality-badge")) {
          $btn.classList.remove(cls);
        }
      }
      [
        "aria-controls",
        "aria-haspopup",
        "aria-expanded",
        "aria-pressed",
      ].forEach((attr) => {
        $btn.removeAttribute(attr);
      });
      ["tooltipText", "tooltipTargetId"].forEach((attr) => {
        delete $btn.dataset[attr];
      });
    }

    query_cache = {};
    // menu的query需要等待contextmenu事件再开始检测
    wait_for_menu_element(selector) {
      if (this.query_cache[selector]) {
        return this.query_cache[selector];
      }
      const dom = document.querySelector(selector);
      if (dom) {
        this.query_cache[selector] = Promise.resolve(dom);
        return Promise.resolve(dom);
      }
      return new Promise((resolve) => {
        // 因为video元素随时会销毁，所以需要监听parent上
        const target = this.$video.parentElement;
        const handler = (ev) => {
          // 如果不是右键
          if (ev.button !== 2) return;
          const domP = wait_for_element(selector);
          this.query_cache[selector] = domP;
          resolve(domP);
          target.removeEventListener("mousedown", handler);
        };
        target.addEventListener("mousedown", handler);
      });
    }

    async add_menu({
      label = "",
      content = '<div class="ytp-menuitem-toggle-checkbox"></div>',
      href = "",
      icon,
      on_click,
      key,
      on_update,
    } = {}) {
      const [$panel_menu, $panel_menu_link_tpl, $panel_menu_div_tpl] =
        await Promise.all([
          this.wait_for_menu_element(
            ".ytp-contextmenu>.ytp-panel>.ytp-panel-menu"
          ),
          this.wait_for_menu_element(
            ".ytp-contextmenu>.ytp-panel>.ytp-panel-menu>a.ytp-menuitem"
          ),
          this.wait_for_menu_element(
            ".ytp-contextmenu>.ytp-panel>.ytp-panel-menu>div.ytp-menuitem"
          ),
        ]);
      let $element = null;
      if (href) {
        $element = $panel_menu_link_tpl.cloneNode(true);
        $element.href = href;
      } else {
        $element = $panel_menu_div_tpl.cloneNode(true);
      }
      this.elements.push($element);

      const $label = $element.querySelector(".ytp-menuitem-label");
      const $content = $element.querySelector(".ytp-menuitem-content");
      const $icon = $element.querySelector(".ytp-menuitem-icon");
      const __on_update = (ev) =>
        on_update && on_update({ $element, $label, $content, $icon, ev });
      if (key) this.key2dom[key] = $element;
      if (label) $label.innerHTML = trusted_html(label);
      if (content) $content.innerHTML = trusted_html(content);
      if (on_click)
        $element.addEventListener("click", async (ev) => {
          try {
            await on_click?.(ev);
            await __on_update(ev);
          } catch (error) {
            console.error(error);
          }
        });
      if (icon) $icon.innerHTML = trusted_html(icon);
      $panel_menu.appendChild($element);

      this.menuitems.push({
        $element,
        on_click,
        key,
        on_update: __on_update,
      });
      return $element;
    }
  }

  class RotateTransform {
    status = {
      rotate: 0, // 0 1 2 3 => 0 90 180 270
      horizontal: false,
      vertical: false,
      // 类似于background-image的cover，但是会居中
      cover_screen: false,
    };

    styles = {
      transform: [],
    };
    $style = document.createElement("style");

    constructor() {
      this.enable();
    }

    isNoneEffect() {
      const { rotate, horizontal, vertical, cover_screen } = this.status;
      return (
        rotate === 0 &&
        horizontal === false &&
        vertical === false &&
        cover_screen === false
      );
    }

    mount($video, $player) {
      if (!($video instanceof HTMLVideoElement)) {
        throw new Error("$video must be a HTMLVideoElement");
      }
      if (!($player instanceof HTMLElement)) {
        throw new Error("$player must be a HTMLElement");
      }
      this.$video = $video;
      this.$player = $player;

      $video.classList.add(constants.style_rule_name);
    }

    unmount() {
      this.disable();
      this.$video.classList.remove(constants.style_rule_name);
      this.$video = null;
      this.$player = null;
    }

    updateRule(overwrite_str) {
      const cssText =
        overwrite_str === undefined ? $css(this.styles) : overwrite_str;
      this.$style.innerHTML = trusted_html(
        `.${constants.style_rule_name}{${cssText}}`
      );
    }

    /**
     * 计算缩放值K
     */
    calcScaleK() {
      const { $player, $video } = this;
      if (!$player || !$video) {
        throw new Error("can't find player or video element");
      }
      const [pw, ph] = [$player.clientWidth, $player.clientHeight];
      let [w, h] = [$video.clientWidth, $video.clientHeight];
      // 这里替换是因为旋转之后等于 wh 对调
      if (this.status.rotate % 2 == 1) {
        [w, h] = [h, w];
      }

      if (this.status.cover_screen) {
        // 适配w的面积
        const fit_w_size = pw * (pw / w) * h;
        // 适配h的面积
        const fit_h_size = ph * (ph / h) * w;
        if (fit_h_size > fit_w_size) {
          return ph / h;
        } else {
          return pw / w;
        }
      }

      // NOTE: 下面这个写的有点懵逼，忘记怎么算的了不改了，能用...
      // pw === w
      if (~~((pw * h) / w) <= h) {
        // 💥💥💥
        return pw / w;
      }
      // ph === h
      return ph / h;
    }

    update() {
      const { $player, $video } = this;
      if (!$player || !$video) {
        throw new Error("can't find player or video element");
      }
      if (this.isNoneEffect()) {
        // 清空副作用
        this.updateRule("");
        return;
      }

      const scaleK = this.calcScaleK();

      const transform_arr = [
        `rotate(${this.status.rotate * 90}deg)`,
        `scale(${scaleK})`,
      ];
      const append_transform = (text) => transform_arr.push(text);
      if (this.status.horizontal) {
        if (this.status.rotate % 2 == 1) append_transform("rotateX(180deg)");
        else append_transform("rotateY(180deg)");
      }
      if (this.status.vertical) {
        if (this.status.rotate % 2 == 1) append_transform("rotateY(180deg)");
        else append_transform("rotateX(180deg)");
      }
      this.styles.transform = transform_arr;

      this.updateRule();
    }

    enabled = true;
    enable() {
      this.enabled = true;
      document.getElementsByTagName("head")[0].appendChild(this.$style);
    }

    disable() {
      this.enabled = false;
      this.$style.remove();
    }

    rotate() {
      if (!this.enabled) return;
      this.status.rotate = (this.status.rotate + 1) % 4;
      this.update();

      return this.status.rotate;
    }

    toggle_horizontal() {
      if (!this.enabled) return;
      this.status.horizontal = !this.status.horizontal;
      this.update();
      return this.status.horizontal;
    }

    toggle_vertical() {
      if (!this.enabled) return;
      this.status.vertical = !this.status.vertical;
      this.update();
      return this.status.vertical;
    }

    toggle_cover_screen() {
      if (!this.enabled) return;
      this.status.cover_screen = !this.status.cover_screen;
      this.update();
      return this.status.cover_screen;
    }

    reset() {
      this.status.rotate = 0;
      this.status.horizontal = false;
      this.status.vertical = false;
      this.update();
      return this.status;
    }
  }

  async function main() {
    const player = new YtpPlayer();
    await player.ready;

    window.addEventListener("contextmenu", () => {
      player.ui.update();
    });

    // setup buttons
    await player.ui.add_button({
      html: assets.icons.rotate,
      on_click: () => player.rotate_transform.rotate(),
      css_text: $css(
        {
          display: "inline-flex",
          "align-items": "center",
          "justify-content": "center",
          width: "48px",
          height: "48px",
          color: "#fff",
          fill: "#fff",
          "vertical-align": "top",
        },
        false
      ),
      id: "rotate-btn",
      title: i18n("click_rotate"),
      key: "btn_rotate",
    });
    await player.ui.add_button({
      html: assets.icons.fullscreen,
      on_click: () => player.rotate_transform.toggle_cover_screen(),
      css_text: $css(
        {
          display: "inline-flex",
          "align-items": "center",
          "justify-content": "center",
          width: "48px",
          height: "48px",
          color: "#fff",
          fill: "#fff",
          "vertical-align": "top",
        },
        false
      ),
      id: "cover-screen-btn",
      title: i18n("click_cover_screen"),
      key: "btn_cover_screen",
    });

    // setup contextmenu
    await player.ui.add_menu({
      key: "menu_toggle_plugin",
      label: i18n("toggle_plugin"),
      icon: '<div style="text-align: center;font-size: 24px">🎠</div>',
      on_click: (ev) => {
        if (player.enabled) {
          player.disable();
        } else {
          player.enable();
          player.update();
        }
      },
      on_update: ({ $element }) => {
        $element.setAttribute("aria-checked", player.enabled.toString());
      },
    });

    // rotate menuitem
    await player.ui.add_menu({
      key: "menu_rotate",
      on_click: (ev) => {
        player.rotate_transform.rotate();
      },
      on_update: ({ $content }) => {
        $content.innerHTML = trusted_html(
          player.rotate_transform.status.rotate * 90 + "°"
        );
      },
      label: i18n("rotate90"),
      content: "0°",
      icon: assets.icons.rotate,
    });

    // cover_screen menuitem
    await player.ui.add_menu({
      key: "menu_cover_screen",
      on_click: (ev) => {
        player.rotate_transform.toggle_cover_screen();
      },
      on_update: ({ $element }) => {
        $element.setAttribute(
          "aria-checked",
          player.rotate_transform.status.cover_screen.toString()
        );
      },
      label: i18n("cover_screen"),
      icon: assets.icons.fullscreen,
    });

    // flip horizontal
    await player.ui.add_menu({
      key: "menu_horizontal",
      on_click(ev) {
        player.rotate_transform.toggle_horizontal();
      },
      on_update: ({ $element }) => {
        $element.setAttribute(
          "aria-checked",
          player.rotate_transform.status.horizontal.toString()
        );
      },
      label: i18n("flip_horizontal"),
      icon: assets.icons.flip_horizontal,
    });

    // flip vertical
    await player.ui.add_menu({
      key: "menu_vertical",
      on_click(ev) {
        player.rotate_transform.toggle_vertical();
      },
      on_update: ({ $element }) => {
        $element.setAttribute(
          "aria-checked",
          player.rotate_transform.status.vertical.toString()
        );
      },
      label: i18n("flip_vertical"),
      icon: assets.icons.flip_vertical,
    });

    // picture in picture
    await player.ui.add_menu({
      key: "menu_pip",
      on_click(ev) {
        if (document.pictureInPictureElement) {
          return document.exitPictureInPicture();
        } else {
          return $("video").requestPictureInPicture();
        }
      },
      on_update: ({ $element }) => {
        $element.setAttribute(
          "aria-checked",
          Boolean(document.pictureInPictureElement).toString()
        );
      },
      label: i18n("PIP"),
      icon: assets.icons.pip,
    });

    return player;
  }

  console.log(`[ytp-rotate] ${constants.version} (${constants.user_lang})`);
  main()
    .then(() => console.log(`[ytp-rotate] ready`))
    .catch((err) => {
      console.error("[ytp-rotate]", err);
    });
})();

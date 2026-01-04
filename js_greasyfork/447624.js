// ==UserScript==
// @name              HTML5 视频增强脚本
// @version           1658069002
// @description       脚本基于 Violentmonkey 开发，为 HTML5 视频，添加一些通用功能
// @author            So
// @namespace         https://github.com/Git-So/video-userscript
// @homepageURL       https://github.com/Git-So/video-userscript
// @supportURL        https://github.com/Git-So/video-userscript/issues
// @match             http://*/*
// @match             https://*/*
// @grant             GM_addStyle
// @grant             GM_openInTab
// @grant             unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/447624/HTML5%20%E8%A7%86%E9%A2%91%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/447624/HTML5%20%E8%A7%86%E9%A2%91%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function() {
  "use strict";
  GM_addStyle(`
@charset "UTF-8";
@keyframes toast-show {
  from {
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.sooo--video {
  /**
  * 动作提示
  */
  /**
  * 关灯影院模式
  */
  /**
  * 视频镜像
  */
  /**
  * 视频解析
  */
}
.sooo--video-action-toast {
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 10px 15px;
  font-size: 18px;
  color: whitesmoke;
  background-color: rgba(0, 0, 0, 0.555);
  z-index: 7777777;
}
.sooo--video-action-toast-animation {
  animation: toast-show 1.2s alternate forwards;
}
.sooo--video-movie-mode {
  z-index: 99999999 !important;
}
.sooo--video-movie-mode-parent {
  z-index: auto !important;
}
.sooo--video-movie-mode-modal {
  inset: 0;
  width: 100%;
  height: 100%;
  position: fixed !important;
  background: rgba(0, 0, 0, 0.9);
  z-index: 55555;
}
.sooo--video-mirror video {
  transform: rotateX(0deg) rotateY(180deg);
}
.sooo--video-iframe {
  inset: 0;
  width: 100%;
  height: 100%;
  position: absolute !important;
  display: block;
  z-index: 55555;
  border: 0;
}  `);
  var style = "";
  const tagName = {
    div: "DIV",
    iframe: "IFRAME"
  };
  function reanimation(func) {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      func();
    }));
  }
  function isActiveElementEditable() {
    const activeElement = document.activeElement;
    if (!activeElement)
      return false;
    if (activeElement.isContentEditable)
      return true;
    if ("value" in activeElement)
      return true;
    return false;
  }
  function between(value2, min = 0, max = 1) {
    if (value2 < min)
      return min;
    if (value2 > max)
      return max;
    return value2;
  }
  function topWindow() {
    return unsafeWindow.top;
  }
  function actionOfAllParent(el, action, level = 0) {
    let parent = el.parentElement;
    if (!parent)
      return el;
    const currWindow = parent.ownerDocument.defaultView;
    if (parent.tagName == "BODY") {
      if (currWindow == currWindow.top)
        return el;
      const iframeArr = currWindow.parent.document.querySelectorAll("iframe");
      for (const iframe of iframeArr) {
        if (currWindow != iframe.contentWindow)
          continue;
        parent = iframe;
        break;
      }
    }
    if (level < 1 && action.self)
      action.self(el);
    if (parent.tagName == tagName.iframe) {
      if (action.iframe)
        action.iframe(parent);
    } else {
      if (!action.parent(parent))
        return el;
    }
    return actionOfAllParent(parent, action, level + 1);
  }
  function actionOfAllSubWindow(action, isIncludeSelf = true, win = topWindow()) {
    const iframeArr = win.document.querySelectorAll("iframe");
    for (const iframe of iframeArr) {
      if (!iframe.contentDocument || !iframe.contentWindow)
        continue;
      actionOfAllSubWindow(action, true, iframe.contentWindow);
    }
    if (isIncludeSelf)
      action(win);
  }
  const value = [
    {
      match: `^https?://www.bilibili.com/video/`,
      player: "#bilibili-player .bpx-player-container"
    },
    {
      match: `^https?://haokan.baidu.com/v?`,
      player: "#mse .art-video-player"
    }
  ];
  class Config {
    constructor() {
      __publicField(this, "initConfig", {
        video: {
          enable: true,
          lastElement: null,
          isPirate: false
        }
      });
    }
    get window() {
      return topWindow();
    }
    get value() {
      if (!this.window.UserscriptConfig)
        this.window.UserscriptConfig = this.initConfig;
      return new Proxy(this.window.UserscriptConfig.video, {});
    }
  }
  const _Video = class {
    constructor() {
      __publicField(this, "config");
      this.config = new Config().value;
    }
    static get instance() {
      if (!_Video._instance) {
        _Video._instance = new _Video();
      }
      return this._instance;
    }
    set lastElement(el) {
      this.config.lastElement = el;
    }
    get lastElement() {
      return this.config.lastElement;
    }
    rule() {
      for (const rule of value) {
        const rg = new RegExp(rule.match);
        if (location.href.search(rg) > -1)
          return rule;
      }
      return null;
    }
    static isExistPlayer() {
      return !!_Video.instance.player();
    }
    static isNotExistPlayer() {
      return !_Video.isExistPlayer();
    }
    static isEnable() {
      return _Video.instance.config.enable;
    }
    static isDisable() {
      return !_Video.instance.config.enable;
    }
    getAllVideoElement(doc = document) {
      const videoArr = doc.querySelectorAll("video");
      let allVideo = [...videoArr];
      const iframeArr = doc.querySelectorAll("iframe");
      for (const iframe of iframeArr) {
        if (!iframe.contentDocument)
          continue;
        allVideo = [
          ...allVideo,
          ...this.getAllVideoElement(iframe.contentDocument)
        ];
      }
      return allVideo;
    }
    element() {
      var _a;
      const allMedia = this.getAllVideoElement();
      for (const media of allMedia) {
        if (!media.paused) {
          this.config.lastElement = media;
          break;
        }
      }
      if (!this.config.lastElement) {
        this.config.lastElement = (_a = allMedia[0]) != null ? _a : null;
      }
      return this.config.lastElement;
    }
    player(videoElement = this.element()) {
      const rule = this.rule();
      if (rule)
        return document.querySelector(rule.player);
      if (!videoElement)
        return null;
      return actionOfAllParent(videoElement, {
        parent: (el) => el.clientHeight == videoElement.clientHeight && el.clientWidth == videoElement.clientWidth
      });
    }
    toast(text) {
      const player = this.player();
      if (!player)
        return;
      const className = "sooo--video-action-toast";
      const animationClassName = "sooo--video-action-toast-animation";
      if (!player.querySelector(`.${className}`)) {
        const element = document.createElement("DIV");
        element.classList.add(className);
        player.append(element);
      }
      const toast = player.querySelector(`.${className}`);
      toast.classList.remove(animationClassName);
      toast.innerHTML = "";
      toast.append(text);
      reanimation(() => {
        toast.classList.add(animationClassName);
      });
    }
  };
  let Video = _Video;
  __publicField(Video, "_instance");
  class Action {
    constructor() {
      __publicField(this, "_name", "");
    }
    get name() {
      return this._name;
    }
    get video() {
      return Video.instance;
    }
    get media() {
      return this.video.element();
    }
    get player() {
      return this.video.player();
    }
    get window() {
      return topWindow();
    }
    get document() {
      return this.window.document;
    }
    safeAction(action, that = this) {
      if (!this.media)
        return;
      action.apply(that);
    }
  }
  class SwitchAction extends Action {
    get isEnable() {
      return false;
    }
    enableAction() {
    }
    enable() {
      this.safeAction(this.enableAction);
      this.video.toast(`${this.name}: \u5F00`);
    }
    disableAction() {
    }
    disable() {
      this.safeAction(this.disableAction);
      this.video.toast(`${this.name}: \u5173`);
    }
    toggle() {
      this.isEnable ? this.disable() : this.enable();
    }
  }
  class StepAction extends Action {
    constructor() {
      super(...arguments);
      __publicField(this, "step", 1);
    }
    setValue(_value, _isStep = true) {
    }
    add(step = this.step) {
      this.setValue(+step);
    }
    sub(step = this.step) {
      this.setValue(-step);
    }
  }
  class Fullscreen extends SwitchAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u89C6\u9891\u5168\u5C4F");
    }
    get isEnable() {
      return !!this.document.fullscreenElement;
    }
    enableAction() {
      var _a;
      (_a = this.player) == null ? void 0 : _a.requestFullscreen();
    }
    disableAction() {
      this.document.exitFullscreen();
    }
  }
  class PlayState extends SwitchAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u89C6\u9891\u64AD\u653E");
    }
    get isEnable() {
      var _a;
      return !((_a = this.media) == null ? void 0 : _a.paused);
    }
    enableAction() {
      var _a;
      (_a = this.media) == null ? void 0 : _a.play();
    }
    disableAction() {
      var _a;
      (_a = this.media) == null ? void 0 : _a.pause();
    }
  }
  class PictureInPicture extends SwitchAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u753B\u4E2D\u753B");
    }
    get isEnable() {
      var _a;
      return !!((_a = this.media) == null ? void 0 : _a.ownerDocument.pictureInPictureElement);
    }
    enableAction() {
      var _a;
      (_a = this.media) == null ? void 0 : _a.requestPictureInPicture();
    }
    disableAction() {
      var _a;
      if (!this.isEnable)
        return;
      (_a = this.media) == null ? void 0 : _a.ownerDocument.exitPictureInPicture();
    }
  }
  class CurrentTime extends StepAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u89C6\u9891\u8FDB\u5EA6");
      __publicField(this, "step", 10);
    }
    setValue(value2, isStep = true) {
      this.safeAction(() => {
        const currentTime = isStep ? this.media.currentTime + value2 : value2;
        this.media.currentTime = currentTime;
        this.video.toast(`${this.name}: ${value2 < 0 ? "" : "+"}${value2}\u79D2`);
      });
    }
  }
  class Volume extends StepAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u97F3\u91CF");
      __publicField(this, "step", 0.1);
    }
    setValue(value2, isStep = true) {
      this.safeAction(() => {
        const volume = isStep ? this.media.volume + value2 : value2;
        this.media.volume = between(volume, 0, 1);
        this.video.toast(`${this.name}:${this.media.volume * 100 | 0}% `);
      });
    }
  }
  class PlaybackRate extends StepAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u500D\u6570\u64AD\u653E");
      __publicField(this, "step", 1);
      __publicField(this, "playbackRate", [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 5]);
      __publicField(this, "defaultIdx", 3);
    }
    get currIdx() {
      if (!this.media)
        return this.defaultIdx;
      const idx = this.playbackRate.indexOf(this.media.playbackRate);
      return idx < 0 ? this.defaultIdx : idx;
    }
    setValue(value2, isStep = true) {
      this.safeAction(() => {
        value2 = isStep ? this.currIdx + value2 : value2;
        const idx = between(value2, 0, this.playbackRate.length - 1);
        const rate = this.playbackRate[idx];
        this.media.playbackRate = rate;
        this.video.toast(`${this.name}: ${rate}x`);
      });
    }
    restart() {
      this.setValue(this.defaultIdx, false);
    }
  }
  class MovieMode extends SwitchAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u5F71\u9662\u6A21\u5F0F");
      __publicField(this, "className", "sooo--video-movie-mode");
      __publicField(this, "parentClassName", "sooo--video-movie-mode-parent");
      __publicField(this, "modalClassName", "sooo--video-movie-mode-modal");
    }
    get isEnable() {
      var _a;
      return !!((_a = this.player) == null ? void 0 : _a.classList.contains(this.className));
    }
    enableAction() {
      const action = (el) => {
        el.classList.add(this.className);
        el.ownerDocument.body.append((() => {
          const modal = el.ownerDocument.createElement("DIV");
          modal.className = this.modalClassName;
          return modal;
        })());
      };
      actionOfAllParent(this.player, {
        parent: (el) => {
          el.classList.add(this.parentClassName);
          return true;
        },
        iframe: action,
        self: action
      });
    }
    disableAction() {
      var _a;
      (_a = this.player) == null ? void 0 : _a.classList.remove(this.className);
      actionOfAllSubWindow((win) => {
        var _a2;
        (_a2 = win.document.querySelector(`.${this.modalClassName}`)) == null ? void 0 : _a2.remove();
        win.document.querySelectorAll(`.${this.parentClassName}`).forEach((el) => {
          el.classList.remove(this.parentClassName);
        });
      });
    }
  }
  class Mirror extends SwitchAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u89C6\u9891\u955C\u50CF");
      __publicField(this, "className", "sooo--video-mirror");
    }
    get isEnable() {
      var _a;
      return !!((_a = this.player) == null ? void 0 : _a.classList.contains(this.className));
    }
    enableAction() {
      var _a;
      (_a = this.player) == null ? void 0 : _a.classList.add(this.className);
    }
    disableAction() {
      var _a;
      (_a = this.player) == null ? void 0 : _a.classList.remove(this.className);
    }
  }
  class Loop extends SwitchAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u5FAA\u73AF\u64AD\u653E");
    }
    get isEnable() {
      var _a;
      return !!((_a = this.media) == null ? void 0 : _a.loop);
    }
    enableAction() {
      this.media.loop = true;
    }
    disableAction() {
      this.media.loop = false;
    }
  }
  class Muted extends SwitchAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u89C6\u9891\u9759\u97F3");
    }
    get isEnable() {
      var _a;
      return !!((_a = this.media) == null ? void 0 : _a.muted);
    }
    enableAction() {
      this.media.muted = true;
    }
    disableAction() {
      this.media.muted = false;
    }
  }
  class Pirate extends Action {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u89C6\u9891\u89E3\u6790");
      __publicField(this, "ruleArr", [
        "https://z1.m1907.cn/?jx=",
        "https://jsap.attakids.com/?url=",
        "https://jx.bozrc.com:4433/player/?url=",
        "https://okjx.cc/?url=",
        "https://jx.blbo.cc:4433/?url=",
        "https://www.yemu.xyz/?url=",
        "https://jx.aidouer.net/?url=",
        "https://jx.xmflv.com/?url=",
        "https://jx.m3u8.tv/jiexi/?url="
      ]);
    }
    open(idx) {
      new PlayState().disable();
      GM_openInTab(this.ruleArr[between(idx, 0, this.ruleArr.length - 1)] + location.href);
    }
  }
  class ScriptState extends SwitchAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u89C6\u9891\u811A\u672C");
    }
    get isEnable() {
      return this.video.config.enable;
    }
    enableAction() {
      this.video.config.enable = true;
    }
    disableAction() {
      this.video.config.enable = false;
    }
  }
  document.addEventListener("keydown", (e) => {
    if (isActiveElementEditable() || Video.isNotExistPlayer())
      return;
    const defer = () => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
    };
    if (e.shiftKey && e.code == "KeyU") {
      new ScriptState().toggle();
    }
    if (Video.isDisable())
      return defer();
    let hasAction = true;
    switch (true) {
      case e.code == "Enter":
        new Fullscreen().toggle();
        break;
      case e.code == "Space":
        new PlayState().toggle();
        break;
      case (e.shiftKey && e.code == "KeyA"):
        new CurrentTime().sub();
        break;
      case (e.shiftKey && e.code == "KeyD"):
        new CurrentTime().add();
        break;
      case (e.shiftKey && e.code == "KeyW"):
        new Volume().add();
        break;
      case (e.shiftKey && e.code == "KeyS"):
        new Volume().sub();
        break;
      case (e.shiftKey && e.code == "KeyZ"):
        new PlaybackRate().sub();
        break;
      case (e.shiftKey && e.code == "KeyX"):
        new PlaybackRate().restart();
        break;
      case (e.shiftKey && e.code == "KeyC"):
        new PlaybackRate().add();
        break;
      case (e.ctrlKey && e.shiftKey && e.code == "BracketRight"):
        new PictureInPicture().toggle();
        break;
      case (e.shiftKey && e.code == "KeyO"):
        new MovieMode().toggle();
        break;
      case (e.shiftKey && e.code == "KeyH"):
        new Mirror().toggle();
        break;
      case (e.shiftKey && e.code == "KeyL"):
        new Loop().toggle();
        break;
      case (e.shiftKey && e.code == "KeyM"):
        new Muted().toggle();
        break;
      case (e.shiftKey && e.code == "Digit1"):
        new Pirate().open(1);
        break;
      case (e.shiftKey && e.code == "Digit2"):
        new Pirate().open(2);
        break;
      case (e.shiftKey && e.code == "Digit3"):
        new Pirate().open(3);
        break;
      case (e.shiftKey && e.code == "Digit4"):
        new Pirate().open(4);
        break;
      case (e.shiftKey && e.code == "Digit5"):
        new Pirate().open(5);
        break;
      case (e.shiftKey && e.code == "Digit6"):
        new Pirate().open(6);
        break;
      case (e.shiftKey && e.code == "Digit7"):
        new Pirate().open(7);
        break;
      case (e.shiftKey && e.code == "Digit8"):
        new Pirate().open(8);
        break;
      case (e.shiftKey && e.code == "Digit9"):
        new Pirate().open(9);
        break;
      default:
        hasAction = false;
    }
    if (!hasAction)
      return;
    defer();
  });
})();

// ==UserScript==
// @name         bilibili工具箱
// @namespace    https://github.com/marioplus/bilibili-toolkit
// @version      1.0.0
// @author       marioplus
// @description  一些自用的b站脚本
// @license      MIT
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @homepage     https://github.com/marioplus
// @match        https://*.bilibili.com/
// @match        https://*.bilibili.com/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544206/bilibili%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/544206/bilibili%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style$2 = '.adblock-tips,.bili-header__channel{display:none!important}.bili-header:after{display:block;content:"";height:5vh}.container>.recommended-swipe{display:none!important}.floor-single-card{display:none!important}.recommended-container_floor-aside .container.is-version8>*:nth-of-type(n+13){margin-top:unset!important}.recommended-container_floor-aside .container.is-version8>*:nth-of-type(n+8){margin-top:unset!important}.feed-card:has(svg.vui_icon.bili-video-card__stats--icon),.bili-feed-card:has(svg.vui_icon.bili-video-card__stats--icon){display:none!important}.feed-card:has(.bili-video-card__mask>.bili-video-card__stats>div.bili-video-card__stats--left+span.bili-video-card__stats--text),.bili-feed-card:has(.bili-video-card__mask>.bili-video-card__stats>div.bili-video-card__stats--left+span.bili-video-card__stats--text){display:none!important}.feed-card:not(:has(.bili-video-card>.bili-video-card__wrap)),.bili-feed-card:not(:has(.bili-video-card>.bili-video-card__wrap)){display:none!important}.v-popover-content:has(.login-panel-popover),.lt-row:has(.login-tip){display:none!important}\n';
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  function loadStyles(...css) {
    _GM_addStyle(css.join("\n"));
  }
  class HomeCleanPlugin {
    support() {
      return window.location.host === "www.bilibili.com";
    }
    execute() {
      loadStyles(style$2);
    }
  }
  class RedirectDynamicToVideoTabPlugin {
    support() {
      return window.location.host === "t.bilibili.com" && new URLSearchParams(window.location.search).has("spm_id_from");
    }
    execute() {
      window.location.href = "https://t.bilibili.com/?tab=video";
    }
  }
  const style$1 = "#sidebar-vm,.shop-popover{display:none!important}\n";
  class LiveRoomCleanPlugin {
    support() {
      return /https:\/\/live.bilibili.com\/\d+/.test(window.location.href);
    }
    execute() {
      loadStyles(style$1);
    }
  }
  class LiveRoomHighestLiveQuality {
    get livePlayer() {
      const player = _unsafeWindow.livePlayer;
      if (player && player.getPlayerInfo() && player.getPlayerInfo().playurl && typeof player.switchQuality === "function") {
        return player;
      }
      return void 0;
    }
    support() {
      return /https:\/\/live.bilibili.com\/\d+/.test(window.location.href);
    }
    execute() {
      let switched = false;
      const timer = setInterval(() => {
        if (this.autoSwitchToHighestQuality()) {
          switched = true;
        }
        if (switched || Date.now() - startTime > 1e3 * 60 * 5)
          clearInterval(timer);
      }, 1e3);
      const startTime = Date.now();
    }
    /**
     * 自动切换到最高画质
     */
    autoSwitchToHighestQuality() {
      if (!this.livePlayer) {
        return false;
      }
      const highestQualityNumber = this.getHighestQualityNumber();
      if (highestQualityNumber !== null && highestQualityNumber !== this.getCurrentQualityNumber()) {
        this.switchQuality(highestQualityNumber);
      }
      return true;
    }
    /**
     * 获取最高画质编号
     */
    getHighestQualityNumber() {
      return this.livePlayer.getPlayerInfo().qualityCandidates[0].qn;
    }
    /**
     * 获取当前画质编号
     */
    getCurrentQualityNumber() {
      return this.livePlayer.getPlayerInfo().quality;
    }
    /**
     * 切换画质
     * @param qn 画质编号
     */
    switchQuality(qn) {
      this.livePlayer.switchQuality(qn);
    }
  }
  const style = "#slide_ad,.activity-m-v1.act-now,.ad-report,.strip-ad{display:none!important}\n";
  class VideoCleanPlugin {
    support() {
      return /https:\/\/www.bilibili.com\/video/.test(window.location.href);
    }
    execute() {
      loadStyles(style);
    }
  }
  const plugins = [
    new HomeCleanPlugin(),
    new RedirectDynamicToVideoTabPlugin(),
    new VideoCleanPlugin(),
    new LiveRoomCleanPlugin(),
    new LiveRoomHighestLiveQuality()
  ];
  plugins.filter((plugin) => plugin.support()).forEach((plugin) => plugin.execute());

})();
// ==UserScript==
// @name         斗鱼纯净版--持续更新中...
// @namespace    http://tampermonkey.net/
// @description  斗鱼纯净版
// @version      0.3.7
// @author       tomiaa
// @match      *://www.douyu.com/directory/myFollow
// @match      *://www.douyu.com/*

// @downloadURL https://update.greasyfork.org/scripts/429845/%E6%96%97%E9%B1%BC%E7%BA%AF%E5%87%80%E7%89%88--%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/429845/%E6%96%97%E9%B1%BC%E7%BA%AF%E5%87%80%E7%89%88--%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E4%B8%AD.meta.js
// ==/UserScript==
(() => {
  const $ = (id) => document.querySelector(id);
  console.clear();
  const config = {
    "https://www.douyu.com/directory/myFollow": {
      // 我的关注
      remove: [
        /* 头部nav */
        ".Header-download-wrap", // 下载客户端
        ".Header-broadcast-wrap", // 开播
        ".DropPane-ad", // 我的关注
        ".DropMenuList-ad", // 分类
        ".Video", // 视频
        ".Game", // 游戏
        ".Search-suggestBoxContent", // 搜索

        ".layout-Banner", // banner
        ".layout-Module-extra", // 关注右上角
        ".Prompt-link",
      ],
      css: `
      /* hover头像 */
      .CloudGameLink,
      .Promotion,  /* 个人信息 hover广告 */
      .Task        /*  个人信息 任务 */
      {
        display: none;
      }
      `,
    },
    default: {
      remove: [
        /* 头部nav */
        ".Header-download-wrap", // 下载客户端
        ".Header-broadcast-wrap", // 开播
        // ".DropPane-ad", // 我的关注
        ".DropMenuList-ad", // 分类
        ".Video", // 视频
        ".Game", // 游戏
        ".Search-suggestBoxContent", // 搜索
        ".ActBase", // 右侧广告
        ".VideoEntry-tab", // 主播投稿
        ".layout-Player-rank", // 排行
        ".Title-report", // 举报
        ".Title-category", // 房间分类
        ".BarrageSuspendedBallAd", // 弹幕列表弹窗广告
        ".SysSign-Ad", // 弹幕下方广告
        ".layout-Bottom", // 底部鱼吧
        ".Title-anchorFriendWrapper", // 邻友
        ".Title-sharkWeight", // 重量
        ".Title-row-span", // 主播玩过
        ".Title-ad", // 视频右上广告
        ".Title > .Title-roomInfo > div:last-child",
        ".Title-anchorPic-bottom", // 头像下方
        ".ToolbarActivityArea", // 视频下方 任务鱼吧
        ".PlayerToolbar-signCont", // 下方通知
        ".TVGameEntry", // 视频弹出
        ".GuessGameMiniPanelB-wrapper", // 鱼丸预言
        ".recommendAppBg-2dde55", // 下载app
        // /* 活动直播间 */
        ".wm-view",
        "#js-room-activity", // 右边 广告
        ".adPicRoot_4kxGCX", // 视频左边广告
        "#js-player-toolbar", // 下方送礼物
        "#js-aside", // 左侧nav导航
        ".watermark-442a18", // 视频左下角房间号
        ".FansMedalDialog-normal", // 发弹幕徽章弹窗
        ".ActPayDialog",
        ".Title-txAuthentication",
      ],
      css: `
      /* 橙色背景 */
      #bc3{
        background-image: none !important;
      }
      /* hover头像 */
      .CloudGameLink,
      .Promotion,  /* 个人信息 hover广告 */
      .Task,       /*  个人信息 任务 */
      .Barrage-topFloaterList,
      .FansMedal, /* 粉丝牌 */
      .js-user-level, /* 等级 */
      .Barrage-icon /* 图标 */
      .Barrage-honor /* 徽章 */
      .BarrageBanner /* 礼物 */
      {
        display: none;
      }
      /* 弹幕列表 */
      .layout-Player-barrage{
        top: 0 !important;
        z-index: 999;
      }
      .wm-general{
        height: 0 !important;
      }
      #room-html5-player{
        z-index: 999;
      }
      /* 宽屏模式 */
      body.is-fullScreenPage .layout-Player-asideToggle{
        z-index: 999;
      }
      .Barrage-notice--normalBarrage :nth-child(n)
      /* 内容 */
      {
        display: none !important;
      }
      .Barrage-notice--normalBarrage .Barrage-content,
      .Barrage-notice--normalBarrage .Barrage-nickName{
        display: inline-block !important;
      }
      .ChatSend-txt::placeholder{
        color: transparent !important;
      }
      .is-fullScreenPage #js-player-title{
        z-index: -1;
      }
      #js-player-title{
        z-index: 999999;
      }
      .layout-Player-video{
        z-index: 1;
      }
      `,
    },
  };

  class BaiduClear {
    constructor(config) {
      this.config = config;
      this.domain = "";
      this.query = null;
      this.init();
    }

    init() {
      const currentHref = location.href.split("?");
      this.domain = currentHref[0];
      this.query = currentHref[1];
      if (this.domain !== "https://www.douyu.com/directory/myFollow")
        this.domain = "default";

      this.removeToHidden(this.config?.[this.domain]?.remove);
      this.addCss(this.config?.[this.domain]?.css);
      this.remove(this.config?.[this.domain]?.remove);
      this.config?.[this.domain]?.fn?.();
    }

    remove(arr = []) {
      arr
        .map((item) => $(item))
        .forEach((item) => {
          item?.remove();
        });
    }

    removeToHidden(arr = []) {
      if (!arr.length) return;
      this.addCss(
        arr.join(",") +
          `{    
        display: none !important;
      }`
      );
    }

    addCss(css = "") {
      if (!css) return;
      let style = document.createElement("style");
      style.innerHTML = css;
      document.documentElement.appendChild(style);
    }
  }
  new BaiduClear(config);
})();

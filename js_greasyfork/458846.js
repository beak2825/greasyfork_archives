// ==UserScript==
// @namespace   moe.jixun.dn-noad

// @name        一帆视频去广告
// @description 一帆视频（曾用名 "iF 视频"、"多瑙"）去广告

// @name:en        iFVOD no AD
// @description:en Remove AD on ify.tv (a.k.a. dnvod, iF VOD)

// @match       https://*.iyf.tv/*
// @match       https://*.ifsp.tv/*
// @match       https://*.ifsp1.tv/*
// @grant       none
// @version     3.1.8
// @author      Jixun Moe<https://jixun.moe/>
// @license     BSD-3-Clause
// @supportURL  https://jixun.moe/userscript/ifun-noad#comments
// @homepageURL https://jixun.moe/userscript/ifun-noad
// @compatible  Chrome   ViolentMonkey
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/458846/%E4%B8%80%E5%B8%86%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/458846/%E4%B8%80%E5%B8%86%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

//// Injection Parameter ////
const __DEBUG__ = false;
const id = "jixun: have fun :D";

// M 变量所定义的模组加载完毕后的 CHUNK ID (main-es2015.*.js)。
// 通常是用户处理模块加载完毕后就可以开始了。
const CHUNK_MAIN = 15;

const M = {
  InitUser: "T1Vy",
  PermissionManager: "xMFu",
  StoreState: "AytR",
  Utility: "3My9",
  LegacyRouteLoader: "tyNb",
  RxJS: "lJxs",
  RequestHelper: "tWDZ",
};
//// Injection Parameter ////

const s = document.createElement("style");
s.textContent = `

.cloppe {
  display: block !important;
}

.video-player {
  height: unset!important;
}

.danmu-center {
  min-height: 1005px !important;
  max-width: 300px !important;
}

vg-pause-ads,
.player-side.player-right > .ng-star-inserted,
app-gg-block, app-gg-block.d-block, .overlay-logo
{
  display: none !important;
}

`;
const addStyle = () => document.head.appendChild(s);
const defaultAvatar = "https://static.{Host}/upload/up/20170815000037.jpg";

const always = (v) => ({
  get: () => v,
  set: () => {},
});

function generateIp() {
  const invoke = (x) => x();
  const v = () => (Math.random() * 255) | 0;
  return [v, v, v, v].map(invoke).join(".");
}

const fakeGid = 9527;
const gidRegex = new RegExp(`gid=${fakeGid}(&|$)`);

(window.webpackJsonp = window.webpackJsonp || []).push([
  [
    /* iF-vod 去广告 */
  ],
  {
    [id]: function (module, exports, require) {
      addStyle();
      const idx = webpackJsonp.findIndex((x) => x[1][id]);
      webpackJsonp.splice(idx, 1);
      const fakeIp = generateIp();

      const { a: PermissionManager } = require(M.PermissionManager);
      PermissionManager.prototype.isValid = () => true;

      const { a: StoreState } = require(M.StoreState);
      Object.defineProperty(StoreState, "allVip", always(true));
      Object.defineProperty(StoreState, "hideAds", always(true));
      Object.defineProperty(StoreState, "disableNotify", always(true));

      const { a: RequestHelper } = require(M.RequestHelper);
      const { a: Utility } = require(M.Utility);
      const utils = new Utility(window.document);

      const appendUserInfo = RequestHelper.prototype.appendUserInfo;
      RequestHelper.prototype.appendUserInfo = function (url) {
        const data = appendUserInfo.call(this, url);
        for(const [k, v] of Object.entries(data)) {
          data[k] = v.replace(gidRegex, "gid=0$1");
        };
        return data;
      };

      function updateUser(user) {
        if (!user) return;
        Object.defineProperty(user, "userName", always("某用户"));
        Object.defineProperty(user, "nickName", always("某用户"));
        Object.defineProperty(user, "endDays", always(1));

        Object.defineProperty(user, "vipImage", always("jixun:normal-vip.png"));
        Object.defineProperty(user, "sex", always(9));
        Object.defineProperty(user, "nickName", always(""));
        Object.defineProperty(user, "experience", always(0));
        Object.defineProperty(user, "gold", always(0));
        Object.defineProperty(user, "nextLevel", always(99));
        Object.defineProperty(user, "gid", always(99));

        Object.defineProperty(user, "lastIP", always(fakeIp));
        Object.defineProperty(user, "from", always("地球"));
        Object.defineProperty(
          user,
          "headImage",
          always(utils.GetHost(defaultAvatar))
        );
      }

      // 过部分检测，如 2.0x 倍速
      // 但也有一些 VIP 功能不会弹窗提示而直接报错。
      function fixUser(user) {
        Object.defineProperty(user, "daysOfMembership", always(1));

        // 若 gid 为 0 或 null，设定为预先设定好的 "假" gid。
        if (!user.token.gid) {
          user.token.gid = fakeGid;
        }

        return user;
      }

      const { a: InitUser } = require(M.InitUser);
      const { fromValidateToken, fromGetAuthorizedUserInfo } =
        InitUser.prototype;

      InitUser.prototype.fromValidateToken = function (user) {
        updateUser(user);
        return fixUser(fromValidateToken.apply(this, arguments));
      };

      InitUser.prototype.fromGetAuthorizedUserInfo = function (user) {
        updateUser(user);
        return fixUser(fromGetAuthorizedUserInfo.apply(this, arguments));
      };

      if (__DEBUG__) {
        window.__require__ = require;
      }
    },
  },
  [[id, CHUNK_MAIN]],
]);

// 过广告屏蔽检测
try {
  Object.defineProperty(window, "isAdsBlocked", always(false));  
} catch (err) {
  delete window.isAdsBlocked;
}

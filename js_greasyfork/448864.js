// ==UserScript==
// @name              B 站直播间页面清理
// @version           0.1.0
// @description       bilibili 直播间页面清理、隐藏多余内容、显示已关注 UP 主的粉丝数
// @author            asadahimeka
// @namespace         https://www.nanoka.top
// @license           MIT
// @match             *://live.bilibili.com/*
// @source            https://github.com/asadahimeka/userscripts
// @supportURL        https://github.com/asadahimeka/userscripts/issues
// @run-at            document-end
// @grant             GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448864/B%20%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E9%A1%B5%E9%9D%A2%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/448864/B%20%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E9%A1%B5%E9%9D%A2%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(function() {
  "use strict";
  GM_addStyle(`
.chat-item.top3-notice,
.chat-item.gift-item,
.fans-medal-item,
.fans-medal-item-ctnr,
.rank-icon,
.title-label,
.medal-section,
.flip-view,
.m-guard-ent.gift-section.guard-ent,
.activity-gather-entry.activity-entry.s-activity-entry,
#brush-prompt,
#penury-gift-msg {
  display: none !important;
}
.chat-item.danmaku-item.chat-colorful-bubble {
  background-color: unset !important;
}
.follow-ctnr {
  position: relative !important;
  right: 0 !important;
  margin-left: 8px;
}
.chat-history-panel .chat-history-list {
  height: 100% !important;
}
.live-title .text {
  margin-top: 2px;
  line-height: 1.1 !important;
}
  `);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function formatFans(n) {
    return n < 1e4 ? n.toString() : `${(n / 1e4).toFixed(1)}\u4E07`;
  }
  function setFansNum(el, num) {
    el.innerText = formatFans(num);
    el.title = num.toString();
  }
  async function getFansCount(id) {
    const resp = await fetch(`https://api.bilibili.com/x/relation/stat?vmid=${id}`);
    const result = await resp.json();
    return result.data.follower;
  }
  function q(parent, sel, cb) {
    const el = parent.querySelector(sel);
    el && cb(el);
  }
  async function run() {
    await sleep(2e3);
    const ctnr = document.querySelector(".follow-ctnr");
    if (!ctnr)
      return;
    const vm = ctnr.__vue__;
    await vm.$nextTick();
    if (vm.curButtonType == "unFollow")
      return;
    const clone = ctnr.cloneNode(true);
    ctnr.parentNode.appendChild(clone);
    q(clone, ".follow-text", (el) => el.innerText = "FANS");
    q(clone, ".left-part", (el) => el.title = "");
    q(clone, ".right-part", (el) => {
      setFansNum(el, __STORE__.baseInfoAnchor.fansCount);
      el.addEventListener("click", async function() {
        const num = await getFansCount(BilibiliLive.ANCHOR_UID);
        setFansNum(this, num);
      });
    });
  }
  addEventListener("load", run);
})();

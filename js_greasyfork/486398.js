// ==UserScript==
// @name	     rakuten-like-auto-click
// @version      beta1.1.1
// @namespace    https://github.com/AliubYiero
// @description  自动点击 room.rakuten.co.jp 喜欢
// @author       Yiero
// @match        https://room.rakuten.co.jp/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      GPL3
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.10.4/dist/sweetalert2.all.min.js
// @downloadURL https://update.greasyfork.org/scripts/486398/rakuten-like-auto-click.user.js
// @updateURL https://update.greasyfork.org/scripts/486398/rakuten-like-auto-click.meta.js
// ==/UserScript==


var m = Object.defineProperty;
var S = (t, e, n) => e in t ? m(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var c = (t, e, n) => (S(t, typeof e != "symbol" ? e + "" : e, n), n);
const i = {
  /* 目标元素 */
  aimSelector: ".icon-like[ng-click]",
  /* 获取元素后的延时 */
  delayPerSecond: 0.3,
  /* 提示消息抬头 */
  infoHeader: "[rakuten-like-auto-click] ",
  /* 点赞点击延时 */
  likeClickDelayPerSecond: Number(localStorage.getItem("LikeClickDelayPerSecond")) || 0.6,
  /* 默认点赞点击延时 */
  defaultLikeClickDelayPerSecond: 0.6,
  /* 点击计时器id */
  clickTimer: 0
};
function f() {
  const t = prompt(`请输入点击延时, 默认为${i.defaultLikeClickDelayPerSecond}s
点击延时即每两个卡片之间点赞的间隔, 如果时间太短可能会被检测为机器人暂时封掉点赞权限, 建议最低设置不低于0.3
重新设置之后需要重新开启自动点赞才会更新时间`, localStorage.getItem("LikeClickDelayPerSecond") || String(i.defaultLikeClickDelayPerSecond));
  t && localStorage.setItem("LikeClickDelayPerSecond", t);
}
const l = (t) => {
  console.info(i.infoHeader, t), Swal.fire({
    position: "top-end",
    title: t,
    showConfirmButton: !1,
    timer: 1500,
    animation: !1,
    backdrop: !1
  });
}, a = class a {
  constructor() {
    /**
     * 当前已载入的 DOM Set
     */
    c(this, "loadedSet", /* @__PURE__ */ new Set());
    /**
     * 已经点赞的 DOM Set
     */
    c(this, "likedSet", /* @__PURE__ */ new Set());
  }
  static getInstance() {
    return this.instance;
  }
  /**
   * 返回 loadedSet 的的大小
   * */
  get loadedSetSize() {
    return this.loadedSet.size;
  }
  /**
   * 添加 DOM节点到已经载入的 DOM Set 中
   */
  addLoaded(e) {
    e.classList.contains("isLiked") || !e.classList.contains("icon-like") || this.loadedSet.add(e);
  }
  /**
   * 从已经载入的 DOM Set 中删除 DOM 节点
   */
  removeLoaded(e) {
    this.loadedSet.delete(e);
  }
  /**
   * 添加 DOM节点到已经点赞的 DOM Set 中
   */
  addLiked(e) {
    !e.classList.contains("isLiked") || !e.classList.contains("icon-like") || this.likedSet.add(e);
  }
  /**
   * 从已经点赞的 DOM Set 中删除 DOM 节点
   *
   */
  /* @ts-ignore */
  removeLiked(e) {
    this.likedSet.delete(e);
  }
  /**
   * 点击点赞, 将 载入DOM Set 移动至 点赞DOM Set
   * @return 是否已经结束. true 为当前已载入列表已经完成点赞, false 为当前已载入列表还有DOM节点
   */
  like() {
    const e = this.loadedSet.entries().next();
    if (e.done)
      return l("已经是最后一个 like 了..."), !0;
    const n = e.value[1];
    return n.click(), l(`[${this.loadedSet.size}] like...`), this.removeLoaded(n), this.addLiked(n), !1;
  }
};
c(a, "instance", new a());
let o = a;
function g() {
  const t = o.getInstance();
  l(`当前页面存在 ${t.loadedSetSize} 个未点赞的卡片...`), clearInterval(i.clickTimer), i.clickTimer = window.setInterval(() => {
    t.like() && (l("当前页面已经完全点赞完成..."), clearInterval(i.clickTimer));
  }, i.likeClickDelayPerSecond * 1e3);
}
function u() {
  const t = o.getInstance();
  l(`当前页面存在 ${t.loadedSetSize} 个未点赞的卡片...`), clearInterval(i.clickTimer), i.clickTimer = window.setInterval(e, i.likeClickDelayPerSecond * 1e3);
  function e() {
    t.like() && (l("当前页面已经完全点赞完成..."), clearInterval(i.clickTimer), l("正在载入新的页面"), window.scrollTo(0, document.documentElement.scrollHeight), setTimeout(() => {
      clearInterval(i.clickTimer), i.clickTimer = window.setInterval(e, i.likeClickDelayPerSecond * 1e3);
    }, 5 * 1e3));
  }
}
function L() {
  clearInterval(i.clickTimer);
}
const h = () => {
  const t = (n) => {
    n.forEach((k) => {
      k.addedNodes.forEach((r) => {
        if (!r.innerHTML)
          return;
        const d = r == null ? void 0 : r.querySelector(i.aimSelector);
        d && setTimeout(() => {
          o.getInstance().addLoaded(d), console.info(i.infoHeader, "已获取元素");
        }, i.delayPerSecond * 1e3);
      });
    });
  };
  new MutationObserver(t).observe(document.body, {
    subtree: !0,
    childList: !0
  });
}, C = () => (/* @__PURE__ */ new Date()).toLocaleDateString(), I = () => {
  const t = C(), e = localStorage.getItem("daily") || "";
  return localStorage.setItem("daily", t), e === t;
}, w = () => {
  JSON.parse(localStorage.getItem("OpenAutoLike") || "true") && (I() || u());
};
h();
w();
const p = [
  ["设置点击延时(单位s)", f],
  ["点赞当前页", g],
  ["点赞当前页, 并持续载入", u],
  ["停止点赞", L]
];
p.forEach((t) => {
  GM_registerMenuCommand.apply(window, t);
});
const s = () => {
  const t = JSON.parse(localStorage.getItem("OpenAutoLike") || "true");
  let e;
  t ? e = GM_registerMenuCommand("关闭每日自动点赞", () => {
    localStorage.setItem("OpenAutoLike", "false"), GM_unregisterMenuCommand(e), s();
  }) : e = GM_registerMenuCommand("开启每日自动点赞", () => {
    localStorage.setItem("OpenAutoLike", "true"), GM_unregisterMenuCommand(e), s();
  });
};
s();

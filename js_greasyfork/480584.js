// ==UserScript==
// @name          B站视频下载器(RPC)
// @namespace     https://gitee.com/ameegle/bilibili
// @version       0.0.13
// @description   使用PRC链接Motrix的方式
// @author        ameegle
// @license       ISC
// @source        https://gitee.com/ameegle/bilibili/raw/main/lib/bilibili.js
// @match         *://www.bilibili.com/festival/*
// @match         *://www.bilibili.com/video/av*
// @match         *://www.bilibili.com/video/BV*
// @match         *://www.bilibili.com/list/*
// @match         *://www.bilibili.com/bangumi/play/ep*
// @match         *://www.bilibili.com/bangumi/play/ss*
// @match         *://www.bilibili.com/cheese/play/ep*
// @match         *://www.bilibili.com/cheese/play/ss*
// @downloadURL https://update.greasyfork.org/scripts/480584/B%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8%28RPC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480584/B%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8%28RPC%29.meta.js
// ==/UserScript==
(function(){
var E = (e) => e.startsWith("on"), R = (e) => e === "children", k = (e) => !E(e) && !R(e), S = (e, t) => {
  Object.keys(e).filter(E).forEach((r) => {
    let n = r.toLowerCase().substring(2);
    t.addEventListener(n, e[r]);
  }), Object.keys(e).filter(k).forEach((r) => {
    ["innerHTML", "innerText", "textContext"].includes(r) ? t[r] = e[r] : t.setAttribute(r, e[r]);
  });
}, q = (e, t) => {
  let r = document.createElementNS("http://www.w3.org/2000/svg", e);
  return t && S(t, r), r;
}, D = (e, t) => {
  let r = document.createElement(e);
  return t && S(t, r), r;
}, I = (e, t = !1) => f(e, t), f = (e, t) => {
  if (x(e))
    return e;
  if (Array.isArray(e))
    return e.map((s) => f(s, t));
  let { type: r, props: n } = e;
  if (typeof r == "function") {
    let s = M(r, n);
    return f(s, t);
  }
  return L(r, n, t || r === "svg");
}, x = (e) => ["string", "number", "boolean"].includes(typeof e), L = (e, t, r) => {
  let n = r ? q : D, s = t.ref;
  delete t.ref;
  let i = n(e, t);
  s && (s.current = i);
  let l = t.children.map((a) => {
    if (x(a))
      return a;
    if (!a)
      return "";
    if (typeof a.type == "function") {
      let c = o(a.type, a.props);
      return f(c, r);
    }
    return Array.isArray(a) ? f(a, r) : L(a.type, a.props, r || a.type === "svg");
  }).flat(1 / 0);
  return i.append(...l), i;
}, M = (e, t) => {
  let r = e(t);
  return t.ref ? Array.isArray(r) ? (r[0].props.ref = t.ref, r) : (r.props && (r.props.ref ? t.ref = r.props.ref : r.props.ref = t.ref), r) : r;
};
function $(e) {
  return Array.isArray(e) ? e : x(e) ? [e] : e ? [e] : [];
}
var o = (e, t) => (t.children = $(t.children), { type: e, props: t, $$typeof: Symbol.for("rjsx.vnode") });
const z = "https://api.bilibili.com/pugv/player/web/playurl", H = "https://api.bilibili.com/x/player/playurl", U = "https://api.bilibili.com/pgc/player/web/playurl", N = "http://localhost:16800/jsonrpc", P = ".batch-btn{display:flex;align-items:center;color:#61666d;cursor:pointer;font-size:13px;line-height:18px}.batch-btn.festival{color:#f2dda4}.batch-btn .all-download{margin-left:4px}.batch-btn:hover{color:#00aeec}.v-download-wrap{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:99999;color:#18191c;background:#F1F2F3;display:flex;flex-direction:column;padding:6px;border-radius:6px;-webkit-user-select:none;user-select:none;touch-action:none;min-width:375px;border:1px solid #ebeef5;box-shadow:0 2px 12px}.v-download-wrap .v-head{padding:5px;display:flex;justify-content:space-between;border-bottom:1px solid #e3e5e7}.v-download-wrap .v-head .v-h-a-wrap{display:flex;justify-content:center;align-items:center}.v-download-wrap .v-head .v-h-a-wrap .v-h-action{width:.9em;height:.9em;cursor:pointer;border-radius:50%}.v-download-wrap .v-head .v-h-a-wrap .v-h-action.sort{background-color:orange}.v-download-wrap .v-head .v-h-a-wrap .v-h-action.download{background-color:#00aeec}.v-download-wrap .v-head .v-h-a-wrap .v-h-action.close{background-color:#fb7299}.v-download-wrap .v-head .v-h-a-wrap .v-h-action:hover{opacity:.6}.v-download-wrap .v-head .v-h-a-wrap .v-h-action:not(:last-child){margin-right:8px}.v-download-wrap .v-content{max-height:50vh;padding:4px 0;overflow:hidden auto}.v-download-wrap .v-content .v-c-empty{text-align:center;color:#9499a0}.v-download-wrap .v-content::-webkit-scrollbar{width:4px}.v-download-wrap .v-content::-webkit-scrollbar-thumb{border-radius:4px;background-color:#999}.v-download-wrap .v-item{display:flex;padding:5px 4px;align-items:center;border-radius:3px}.v-download-wrap .v-item:hover{color:#00aeec;background:#fff}.v-download-wrap .v-i-checkbox{cursor:pointer;outline:none;-webkit-appearance:auto;-moz-appearance:auto;appearance:auto;margin-right:4px}.v-download-wrap .v-i-label{width:375px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}.message-wrap{display:flex;flex-direction:column;position:fixed;top:16px;overflow:auto;z-index:999999;max-height:calc(100vh - 32px)}.message-wrap::-webkit-scrollbar{display:none}.message-wrap.right{right:16px}.message-wrap.left{left:16px}.message-wrap .message-item{display:flex;width:275px;padding:14px;border-radius:8px;box-sizing:border-box;background-color:#3f3f3f;box-shadow:0 0 4px #3f3f3f;margin:8px}.message-wrap .m-icon{display:flex;min-height:1em;min-width:1em;font-size:24px}.message-wrap .m-icon.success{color:#67c23a}.message-wrap .m-icon.info{color:#909399}.message-wrap .m-icon.warning{color:#e6a23c}.message-wrap .m-icon.error{color:#f56c6c}.message-wrap .m-content{margin-left:13px;font-size:16px;line-height:24px;color:#cfd3dc;word-break:break-all;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical}", p = {
  video: "/video/",
  list: "/list/",
  bangumi: "/bangumi/play/",
  cheese: "/cheese/play/",
  festival: "/festival/"
};
var v = (e, t = document.body) => {
  let r = I(e);
  return Array.isArray(r) ? t.append(...r.flat(1 / 0)) : t.append(r), { use: (n) => n() };
}, B = (e) => Object.prototype.hasOwnProperty.call(e, "$$typeof"), W = (e, ...t) => {
  for (; e.firstChild; )
    e.firstChild.remove();
  e.append(...t.map((r) => B(r) ? I(r) : r).flat(1 / 0));
}, F = (...e) => e.filter(Boolean).join(" "), b = () => Object.seal({ current: void 0 }), O = (e) => Object.seal({ value: e });
const G = () => {
  const e = b();
  return () => (e.current || v(o("div", { ref: e, class: "message-wrap right" })), e.current);
}, J = G(), K = {
  success: () => o("svg", { viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", children: o("path", { fill: "currentColor", d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z" }) }),
  warning: () => o("svg", { viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", children: o("path", { fill: "currentColor", d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256zm0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4z" }) }),
  info: () => o("svg", { viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", children: o("path", { fill: "currentColor", d: "M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64zm67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344zM590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.992 12.992 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z" }) }),
  error: () => o("svg", { viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", children: o("path", { fill: "currentColor", d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336L512 457.664z" }) })
}, m = (e, t, r) => {
  const n = K[t], s = b();
  v(o("div", { ref: s, class: "message-item", role: "alert", children: [
    o("span", { class: `m-icon ${t}`, children: o(n, {}) }),
    o("span", { class: "m-content", children: e })
  ] }), J()), s.current.scrollIntoView(), setTimeout(() => {
    s.current.remove();
  }, r);
}, h = {
  success: (e, t = 3e3) => m(e, "success", t),
  warning: (e, t = 3e3) => m(e, "warning", t),
  info: (e, t = 3e3) => m(e, "info", t),
  error: (e, t = 3e3) => m(e, "error", t)
}, Q = async (e, t) => {
  var r;
  try {
    const { data: n, result: s } = await fetch(e, {
      credentials: "include"
    }).then((l) => l.json()), i = (r = n || s) == null ? void 0 : r.durl[0].url;
    if (!i)
      throw new Error("durl is empty");
    return [i, t + ".mp4"];
  } catch {
    throw new Error("视频信息解析失败");
  }
}, X = (e) => {
  h.success("视频信息解析成功");
  const t = [
    `User-Agent: ${navigator.userAgent}`,
    `Referer: ${location.href}`
  ], r = e.map(([s, i]) => {
    const l = { out: i, header: t };
    return {
      id: window.btoa(`BParse_${Date.now()}_${Math.random()}`),
      jsonrpc: "2.0",
      method: "aria2.addUri",
      params: ["token:", [s], l]
    };
  }), n = {
    method: "POST",
    body: JSON.stringify(r)
  };
  try {
    return fetch(N, n);
  } catch {
    throw new Error("RPC请求失败, 请开启Motrix");
  }
}, Y = () => {
  var n;
  const e = Object.keys(p).find((s) => location.pathname.startsWith(p[s])) || "?";
  if (e === "cheese") {
    const s = document.querySelector("div.edu-player-quality-item.active span");
    return (s == null ? void 0 : s.textContent) || "80";
  }
  const t = e === "video" ? "li.bpx-player-ctrl-quality-menu-item.bpx-state-active" : "li.squirtle-select-item.active", r = document.querySelector(t);
  return ((n = r == null ? void 0 : r.dataset) == null ? void 0 : n.value) || "80";
}, Z = () => {
  const e = Object.keys(p).find((t) => location.pathname.startsWith(p[t])) || "?";
  return e === "cheese" ? z : e === "video" || e === "festival" ? H : U;
}, ee = (e) => {
  const t = new URLSearchParams({
    qn: Y(),
    fnver: "0",
    fnval: "0",
    fourk: "1",
    type: "mp4",
    otype: "json",
    platform: "html5",
    high_quality: "1"
  }), r = e.map(({
    aid: n,
    bvid: s,
    cid: i,
    title: l,
    ep_id: a = ""
  }) => (t.set("avid", n.toString()), t.set("bvid", s), t.set("cid", i.toString()), t.set("ep_id", a), Q([Z(), t.toString()].join("?"), l)));
  Promise.all(r).then(X).then(() => h.success("RPC请求成功, 开始下载")).catch((n) => {
    console.warn(n), h.error(n.message);
  });
};
function te({ title: e, bvid: t, aid: r, cid: n, main_title: s, ep_id: i }) {
  const l = [encodeURIComponent(e), t, r, n, i].join("::"), a = [s, e].filter(Boolean).join("-");
  return o("div", { class: "v-item", children: [
    o("input", { class: "v-i-checkbox", type: "checkbox", name: "vinfoindex", id: n, value: btoa(l) }),
    o("label", { class: "v-i-label", for: n, title: a, children: a })
  ] });
}
const A = O(!1);
function C({ desc: e }) {
  const t = Object.keys(p).find((r) => location.pathname.startsWith(p[r])) || "?";
  try {
    let r = [];
    return t === "bangumi" ? r = ne() : t === "cheese" ? r = oe() : t === "festival" ? r = se() : r = re(), e && r.reverse(), r.map((n) => o(te, { ...n }));
  } catch {
    return A.value = !0, h.error("获取视频信息失败"), [o("div", { class: "v-c-empty", children: "~~暂无内容~~" })];
  }
}
const re = () => {
  var a;
  let e = [];
  const {
    bvid: t,
    aid: r,
    title: n,
    cid: s,
    ugc_season: i,
    pages: l
  } = __INITIAL_STATE__.videoData;
  return i ? e = (a = i.sections) == null ? void 0 : a.map(({
    title: c,
    episodes: d
  }) => d == null ? void 0 : d.map(({ cid: w, title: g, bvid: _, aid: V }) => ({
    cid: w,
    title: g,
    bvid: _,
    aid: V,
    main_title: c
  }))).flat() : l ? e = l.map(({ cid: c, part: d }) => ({ cid: c, title: d, bvid: t, aid: r })) : e.push({ cid: s, title: n, bvid: t, aid: r }), e;
}, ne = () => __NEXT_DATA__.props.pageProps.dehydratedState.queries.map(({ state: t }) => t.data.seasonInfo.mediaInfo.episodes.map(({ bvid: r, aid: n, cid: s, playerEpTitle: i, ep_id: l }) => ({ aid: n, bvid: r, cid: s, title: i, ep_id: l }))).flat(), oe = () => [], se = () => __INITIAL_STATE__.sectionEpisodes;
let y = !0;
const j = b(), T = () => {
  var e;
  (e = j.current) == null || e.remove(), y = !0;
}, ae = () => {
  const e = O(!1), t = b();
  return o("div", { ref: j, class: "v-download-wrap", role: "table", children: [
    o("div", { class: "v-head", children: [
      o("span", { children: "可选视频列表" }),
      o("div", { class: "v-h-a-wrap", children: [
        o("span", { class: "v-h-action sort", title: "排序", onClick: () => {
          A.value || W(t.current, o(C, { desc: e.value = !e.value }));
        } }),
        o("span", { class: "v-h-action download", title: "下载", onClick: () => {
          if (A.value)
            return;
          const l = new FormData(t.current).getAll("vinfoindex").map((a) => {
            const [c, d, w, g, _] = atob(a.toString()).split("::");
            return {
              title: decodeURIComponent(c),
              bvid: d,
              aid: Number(w),
              cid: Number(g),
              ep_id: _
            };
          });
          if (!l.length)
            return h.warning("请选择后再操作");
          ee(l);
        } }),
        o("span", { class: "v-h-action close", title: "关闭", onClick: T })
      ] })
    ] }),
    o("form", { ref: t, class: "v-content", children: o(C, {}) })
  ] });
}, ie = () => {
  y && (y = !1, v(o(ae, {}), document.body));
}, le = ({ cclass: e }) => o("span", { title: "批量下载", class: F("batch-btn", "video-toolbar-left-item", e), onClick: ie, children: [
  o("svg", { xmlns: "http://www.w3.org/2000/svg", width: "28", height: "28", viewBox: "0 0 24 24", style: "margin-right:8px;", class: "video-toolbar-item-icon", children: o("path", { fill: "currentColor", d: "M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10s10-4.49 10-10S17.51 2 12 2zm-1 8V7c0-.55.45-1 1-1s1 .45 1 1v3h1.79c.45 0 .67.54.35.85l-2.79 2.79c-.2.2-.51.2-.71 0l-2.79-2.79a.5.5 0 0 1 .36-.85H11zm5 7H8c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1z" }) }),
  o("span", { children: "下载" })
] });
let u;
{
  let e = "";
  u = document.querySelector(".video-toolbar-left, .toolbar"), u || (u = document.querySelector(".video-toolbar-content_left"), e = "festival"), v(o("style", { type: "text/css", children: P }), document.head), y = !0;
  const t = new MutationObserver((r, n) => {
    v(o(le, { cclass: e }), u), n.disconnect(), ce();
  });
  u && t.observe(u, {
    childList: !0,
    attributes: !0,
    attributeOldValue: !0,
    characterData: !0,
    characterDataOldValue: !0,
    subtree: !0
  });
}
function ce() {
  const e = document.querySelector("#bilibili-player video"), t = new MutationObserver(() => {
    console.log("refresh..."), T();
  });
  e && t.observe(e, {
    attributes: !0
  });
}
})();

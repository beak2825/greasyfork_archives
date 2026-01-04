// ==UserScript==
// @name         harverTools
// @version      1.1.1
// @description  一个个人脚本工具集，如果能帮助到你，欢迎使用
// @author       harver
// @include      *
// @license 	 MIT
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD+04r//tOK//zTif/xyYT/yrB//5+hov/I0eH/qbTe/9zo9P/k7/z/2uXv/7yznP/ZuHj/9c2H//3Siv/+04r//tOK//3Sif/BpGz/h3xm/9Ha5f/k8P7/4u35/+Xv/P/l8P7/5O/8/+Dr+f/Hztb/XkU1/4luTf/2z4f//dKJ//zTiP/Zt3r/iYeC/9bg6v/f6/j/4u35/+bw/v/m8f//5fD+/93mzP/Z2YP/3uPi/4N2cP9bOSv/f2JG/8iqc/+TfVb/g352/9Pd4v/c5vD/0NW//9jchf/j6uf/5vD+/+Xw/f/CvYL/jHoc/8S/n/9xVUn/Wzgq/1k7Lf9LOiv/Ry0g/5SUlf+TlJ//fG9z/5F/OP+ikST/zcmi/7i4vf+5ubv/hXx3/1NVUv98f4H/cWJg/10+Lv9ZOSv/UDQo/1s6Kf9lUVj/TjUw/1o1Jv9OLhz/MjMu/4KFhf9uWVH/aEs7/2BEOP9mTET/trnI/1E5MP9bPCz/VDYq/000KP9YOCj/Wjor/1U2J/9fOy3/XT8z/77Dx/+VjpX/Xjst/2A8L/9dOS3/UzEl/1Y7Nv9RMCT/Wjww/040Kf9ELyb/UTMo/1Y3Kv9gPjD/bEg4/1Q3K/9YRD//W0dQ/1g5Kv9bOSv/Wjcq/1k4Kv9VNij/UTMn/000Kv9HMSb/RjYp/0oxJv9PMyj/VTcr/1Q2Kf9ZOiv/Vjgp/1ExJP9YOCn/Wzkq/1k2Kf9YNSf/VjMn/1EwJv9OMyj/SDEn/2tXQP9IMij/Ri0j/1IzKv9QMCX/Vzco/1U2J/9UMyX/WTUn/104Kv9dOCr/WjYo/1UxJP9YNSf/UjQn/08xJ/+cgVn/TTUq/08xJv9TMyb/Sysg/1k2KP9ZNij/WTUn/1k1J/9fOCr/Yjcq/181KP9fNin/Yjkp/1wzJv9aNSf/0a5z/6OGXP9SNCf/VDIl/1UzJf9UMiT/WjYp/14zKP92Sjz/jFpK/5hlU/9jNSf/nmlY/7yEcf93RTX/fFc9//zSiv/50Yr/e2BB/1k2KP95UD//cUg5/2M4Kv9lNyj/XTAj/246K/9rOCf/aTcn/3M6K/9yOiv/dkUy/9i1eP/90or/+daX//PMhf+BYEb/xY15/3JDMv9pOSr/azco/2w4KP9zOyr/ZzQi/3A5Jf90Oib/cj4q/8aibP/704r/9uO4//v79f/45bz/8s+M/5d0UP9nOSj/bzgn/3E4KP9zOCf/Vioc/04mGf9SKR3/glY9/9S0dv/22p//+PHd//7+/v/+/v7//f7+//r68v/36sr/0buU/5JvUv90STP/bj8r/1QwIv9kPSz/ybKE//bjuf/48t7//P78//7+/v//////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @grant        none
// @run-at document-idle
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/502009/harverTools.user.js
// @updateURL https://update.greasyfork.org/scripts/502009/harverTools.meta.js
// ==/UserScript==
"use strict";

var esModuleScript = document.createElement('script');
esModuleScript.async = true;
esModuleScript.src = 'https://cdn.jsdelivr.net/npm/es-module-shims@1.5.18/dist/es-module-shims.wasm.js';
document.head.append(esModuleScript);
const importMapScript = document.createElement('script');
importMapScript.type = 'importmap';
importMapScript.innerHTML = `{
"imports":{"vue":"https://cdn.jsdelivr.net/npm/vue@3.4.35/dist/vue.runtime.esm-browser.js","ant-design-vue":"https://cdn.jsdelivr.net/npm/ant-design-vue@4.2.3/dist/antd.esm.js"},
"scopes":{}
}`
document.head.before(importMapScript);

const aliyunel = document.createElement('link');
aliyunel.rel = 'stylesheet';
aliyunel.href = '//at.alicdn.com/t/c/font_4628072_do7sjinevcu.css';
aliyunel.type = 'text/css';
document.head.append(aliyunel);
var moduleScript = document.createElement('script');
moduleScript.async = true;
moduleScript.type = 'module';
moduleScript.defer = true;
function run(){

    console.log('【harver tools】开始执行');
    (function(){"use strict";try{if(typeof document<"u"){var r=document.createElement("style");r.appendChild(document.createTextNode('.modal[data-v-ecc145d6]{display:flex;position:relative;position:absolute;top:0;right:0;bottom:0;left:0;z-index:9999;flex-direction:column;justify-content:center;align-items:center;margin:auto;padding:.5rem;border:1px solid rgb(205 227 255 / 90%);border-radius:.5rem;width:60vw!important;height:60vh!important;background:radial-gradient(#3cddff66,#d5c9ff66 90%);box-shadow:0 .1rem .4rem rgb(var(--shadow) / 20%);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px)}.modal[data-v-ecc145d6]:after{position:absolute;left:.125rem;top:.125rem;z-index:0;border-radius:.5rem;width:calc(100% - .25rem);height:calc(100% - .25rem);background:radial-gradient(circle at 50% 50%,#fff6,#3cddff1a 90%);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);pointer-events:none;content:""}.modal[data-v-ecc145d6]:before{position:absolute;left:.25rem;top:.25rem;z-index:1;border-radius:.5rem;width:calc(100% - .5rem);height:calc(100% - .5rem);background-color:initial;pointer-events:none;content:""}.modal[data-v-ecc145d6]>*{position:relative;z-index:9;padding:1rem;border-radius:0;background-color:#fff;box-shadow:0 .1rem .4rem rgb(var(--shadow) / 20%)}.fixed[data-v-ecc145d6]{display:flex;overflow:auto;position:fixed;right:60px;bottom:100px;z-index:999999;flex-direction:column;padding:10px;border:1px solid #e3e5e7;border-radius:4px;width:400px;height:300px;background:#fff;box-shadow:0 6.4px 14.4px #00000021,0 1.2px 3.6px #0000001a;gap:10px}[data-v-ecc145d6]::-webkit-scrollbar{width:2px}[data-v-ecc145d6]::-webkit-scrollbar-thumb{background-color:#52525256}.fixed>div[data-v-ecc145d6]{padding:1px 8px;border-radius:4px;width:100%;background-color:#e3e5e7}.entry-name[data-v-ecc145d6]{line-height:22px;font-size:14px;color:#252626;word-break:break-all}.ant-tooltip-inner{flex-wrap:wrap;word-break:break-all;white-space:pre-wrap}.modal[data-v-d76df8ba]{display:flex;position:relative;position:absolute;top:0;right:0;bottom:0;left:0;z-index:9999;flex-direction:column;justify-content:center;align-items:center;margin:auto;padding:.5rem;border:1px solid rgb(205 227 255 / 90%);border-radius:.5rem;width:60vw!important;height:60vh!important;background:radial-gradient(#3cddff66,#d5c9ff66 90%);box-shadow:0 .1rem .4rem rgb(var(--shadow) / 20%);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px)}.modal[data-v-d76df8ba]:after{position:absolute;left:.125rem;top:.125rem;z-index:0;border-radius:.5rem;width:calc(100% - .25rem);height:calc(100% - .25rem);background:radial-gradient(circle at 50% 50%,#fff6,#3cddff1a 90%);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);pointer-events:none;content:""}.modal[data-v-d76df8ba]:before{position:absolute;left:.25rem;top:.25rem;z-index:1;border-radius:.5rem;width:calc(100% - .5rem);height:calc(100% - .5rem);background-color:initial;pointer-events:none;content:""}.modal[data-v-d76df8ba]>*{position:relative;z-index:9;padding:1rem;border-radius:0;background-color:#fff;box-shadow:0 .1rem .4rem rgb(var(--shadow) / 20%)}.show[data-v-7f4f6d95]{transform:translate3d(0,25%,0);transition:all .3s}.hidden[data-v-7f4f6d95]{transform:translate3d(100%,25%,0);transition:all .3s}:root{--primary: 206, 239, 253;--sub: 207, 149, 217;--grey-0: 255, 255, 255;--grey-1: 253, 253, 253;--grey-2: 247, 247, 247;--grey-3: 239, 242, 243;--grey-5: 153, 153, 153;--grey-6: 103, 110, 123;--grey-7: 51, 51, 51;--bg: var(--grey-2);--box-bg: var(--grey-1);--text-color: var(--grey-7);--text-sub-color: var(--grey-5);--shadow: var(--grey-7)}.tools_root[data-v-7f4f6d95]{display:flex;position:fixed;right:2rem;top:2rem;z-index:99999;justify-content:center;align-items:center;width:auto;height:auto}.tools_root .tools_icon[data-v-7f4f6d95]{position:relative;cursor:pointer;font-size:2rem;color:gray;transition:all .3s}.tools_root .tools_icon[data-v-7f4f6d95]:hover{color:#0ff}.tools_root .tools_box[data-v-7f4f6d95]{display:flex;position:relative;top:0;right:0;bottom:0;left:0;z-index:9999;flex-wrap:wrap;justify-content:center;align-items:center;padding:.5rem;border:1px solid rgb(205 227 255 / 90%);border-radius:.5rem;width:10rem;height:auto;background:radial-gradient(#3cddff66,#d5c9ff66 90%);box-shadow:0 .1rem .4rem rgb(var(--shadow) / 20%);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px)}.tools_root .tools_box[data-v-7f4f6d95]:after{position:absolute;left:.125rem;top:.125rem;z-index:0;border-radius:.5rem;width:calc(100% - .25rem);height:calc(100% - .25rem);background:radial-gradient(circle at 50% 50%,#fff6,#3cddff1a 90%);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);pointer-events:none;content:""}.tools_root .tools_box[data-v-7f4f6d95]:before{position:absolute;left:.25rem;top:.25rem;z-index:1;border-radius:.5rem;width:calc(100% - .5rem);height:calc(100% - .5rem);background-color:initial;pointer-events:none;content:""}.tools_root .tools_box[data-v-7f4f6d95]>*{position:relative;z-index:9;padding:.4rem;border-radius:.5rem;background-color:#fff;box-shadow:0 .1rem .4rem rgb(var(--shadow) / 20%)}.tools_root .tools_box ul[data-v-7f4f6d95]{display:flex;list-style:none;flex-wrap:wrap;justify-content:center;justify-content:flex-start;align-items:center;margin:0;width:100%;gap:.4rem}.tools_root .tools_box ul li[data-v-7f4f6d95]{display:flex;justify-content:center;justify-content:flex-start;align-items:center;padding:0 .5rem;border-radius:.5rem;width:100%;min-height:2rem;background-color:rgb(var(--grey-3));cursor:pointer;color:rgb(var(--sub));transition:all .3s}.tools_root .tools_box ul li[data-v-7f4f6d95]:hover{background-color:rgb(var(--primary));color:rgb(var(--sub))}')),document.head.appendChild(r)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}})();
var pe = Object.defineProperty;
var V = (e) => {
  throw TypeError(e);
};
var de = (e, t, n) => t in e ? pe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var h = (e, t, n) => de(e, typeof t != "symbol" ? t + "" : t, n), Q = (e, t, n) => t.has(e) || V("Cannot " + n);
var v = (e, t, n) => (Q(e, t, "read from private field"), n ? n.call(e) : t.get(e)), D = (e, t, n) => t.has(e) ? V("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), F = (e, t, n, o) => (Q(e, t, "write to private field"), o ? o.call(e, n) : t.set(e, n), n);


const ae = (e, t, n) => {
  e === "start" && !window.hw.globalCache.inChoosing ? (window.addEventListener("mousemove", t), window.hw.globalCache.inChoosing = !0) : (window.removeEventListener("mousemove", t), window.hw.globalCache.inChoosing = !1, n && n());
}, re = (e) => {
  window.hw.cacheMap.has(e) || window.hw.cacheMap.set(e, {
    node: null,
    styles: [],
    nodeLastParent: null,
    currentParent: null,
    extraInfo: {
      handleSelectFn: (t) => {
        se(t, e);
      }
    },
    beMoved: !1
  });
}, ve = (e, t, n) => {
  var o;
  re(e), ae(t, (o = window.hw.cacheMap.get(e).extraInfo) == null ? void 0 : o.handleSelectFn, n);
}, se = (e, t) => {
  if (e.target instanceof HTMLElement && window.hw.cacheMap.has(t)) {
    z(t);
    const n = e.target, o = window.hw.cacheMap.get(t), a = n.style.display;
    n.style.display = "none", o.node = n, o.nodeLastParent = n.parentElement;
    const s = Object.entries(window.hw.config.PIP.selectedStyle);
    for (const l of s)
      o.styles.push([l[0], n.style[l[0]]]), n.style[l[0]] = l[1];
    n.style.display = a;
  }
}, z = (e) => {
  const t = window.hw.cacheMap.get(e);
  if (!t) return;
  const n = t.node;
  if (!n) return;
  for (const s of t.styles)
    n.style[s[0]] = s[1];
  t.styles = [];
  const o = t.beMoved;
  if (t.beMoved = !1, !o) return;
  const a = t.nodeLastParent;
  t.nodeLastParent = null, a && (a.append(n), t.node = null);
}, Ce = (e) => {
  z(e), window.hw.cacheMap.delete(e);
}, Ie = () => (window.hw = {
  config: {
    PIP: {
      selectedStyle: {
        border: "3px #9428e1 solid"
      }
    }
  },
  cacheMap: /* @__PURE__ */ new Map(),
  globalCache: {
    inChoosing: !1,
    symbols: []
  },
  utils: {
    useSelectDOM: ve,
    disCacheDOM: Ce,
    resetDOM: z,
    handleSelectDOM: se,
    createCache: re,
    _useSelectDOM: ae
  },
  hooks: {}
}, window.hw), { Paragraph: Ee } = ge, be = H({
  name: "EntryCatchModal",
  components: {
    Form: K,
    FormItem: Z,
    Input: ee,
    Checkbox: te,
    Modal: ne,
    Select: oe,
    Text,
    Tooltip: ye,
    Paragraph: Ee
  },
  setup() {
    const e = x({
      open: !1,
      fromState: {
        types: [],
        types_input: "",
        custom: !1
      }
    }), t = N([]), n = N(), o = x([
      {
        value: "img",
        label: "图片"
      },
      {
        value: "xmlhttprequest",
        label: "网络请求(xml)"
      },
      {
        value: "fetch",
        label: "网络请求(fetch)"
      }
    ]), a = () => {
      e.open = !0;
    }, s = () => {
      n.value && n.value(), n.value && X.success("监听已销毁"), n.value = null, t.value = [];
    }, l = () => {
      e.open = !1;
    }, r = () => {
      s();
      const c = e.fromState.types_input ? e.fromState.types_input.split(",").filter(Boolean) : e.fromState.types, i = new PerformanceObserver((g) => {
        const p = g.getEntriesByType("resource").filter((P) => c.includes(P.initiatorType));
        t.value.push(...p);
      });
      i.observe({ entryTypes: ["resource"] }), X.success(`开启成功,正在监听${c.join("、")}类型的资源请求`), n.value = () => {
        i.disconnect();
      }, l();
    };
    return fe(() => {
      s();
    }), {
      closeEntryCatchDialog: l,
      supportEntryCatchTypeOptions: o,
      initEntryCatch: r,
      openEntryCatchDialog: a,
      clear: s,
      entryCatchState: e,
      entryCatchResult: t,
      obClear: n
    };
  }
}), U = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, a] of t)
    n[o] = a;
  return n;
}, Te = {
  key: 1,
  class: "fixed"
};
function ke(e, t, n, o, a, s) {
  const l = w("Checkbox"), r = w("FormItem"), c = w("Select"), i = w("Input"), g = w("Form"), C = w("Modal"), p = w("Paragraph"), P = w("Tooltip");
  return S(), A(W, null, [
    e.entryCatchState.open ? (S(), b(C, {
      key: 0,
      okText: "确认",
      cancelText: "取消",
      class: "modal",
      open: e.entryCatchState.open,
      "onUpdate:open": t[3] || (t[3] = (d) => e.entryCatchState.open = d),
      title: "资源捕获",
      onOk: e.initEntryCatch,
      onCancel: e.clear
    }, {
      default: m(() => [
        f(g, {
          model: e.entryCatchState.fromState,
          name: "pip_form",
          "label-col": { span: 8 },
          "wrapper-col": { span: 16 },
          autocomplete: "off"
        }, {
          default: m(() => [
            f(r, {
              name: "custom",
              label: "自定义类型"
            }, {
              default: m(() => [
                f(l, {
                  checked: e.entryCatchState.fromState.custom,
                  "onUpdate:checked": t[0] || (t[0] = (d) => e.entryCatchState.fromState.custom = d)
                }, null, 8, ["checked"])
              ]),
              _: 1
            }),
            e.entryCatchState.fromState.custom ? E("", !0) : (S(), b(r, {
              key: 0,
              name: "types",
              label: "预设接口类型"
            }, {
              default: m(() => [
                f(c, {
                  mode: "multiple",
                  options: e.supportEntryCatchTypeOptions,
                  value: e.entryCatchState.fromState.types,
                  "onUpdate:value": t[1] || (t[1] = (d) => e.entryCatchState.fromState.types = d),
                  placeholder: "已支持预设接口类型"
                }, null, 8, ["options", "value"])
              ]),
              _: 1
            })),
            e.entryCatchState.fromState.custom ? (S(), b(r, {
              key: 1,
              name: "types_input",
              label: "自定义类型"
            }, {
              default: m(() => [
                f(i, {
                  value: e.entryCatchState.fromState.types_input,
                  "onUpdate:value": t[2] || (t[2] = (d) => e.entryCatchState.fromState.types_input = d),
                  placeholder: "支持多个(img,fetch,etc...)，使用,分割"
                }, null, 8, ["value"])
              ]),
              _: 1
            })) : E("", !0)
          ]),
          _: 1
        }, 8, ["model"])
      ]),
      _: 1
    }, 8, ["open", "onOk", "onCancel"])) : E("", !0),
    e.obClear ? (S(), A("div", Te, [
      (S(!0), A(W, null, me(e.entryCatchResult, (d) => (S(), A("div", {
        key: d.name
      }, [
        f(P, {
          trigger: "click",
          title: JSON.stringify(d),
          overlayStyle: {
            width: "400px"
          }
        }, {
          default: m(() => [
            f(p, {
              class: "entry-name",
              copyable: { text: d.name }
            }, {
              default: m(() => [
                he("【" + j(d.initiatorType) + "】: " + j(d.name), 1)
              ]),
              _: 2
            }, 1032, ["copyable"])
          ]),
          _: 2
        }, 1032, ["title"])
      ]))), 128))
    ])) : E("", !0)
  ], 64);
}
const Be = /* @__PURE__ */ U(be, [["render", ke], ["__scopeId", "data-v-ecc145d6"]]);
var y = /* @__PURE__ */ ((e) => (e.BILIBILI = "bilibili", e.NONE = "", e))(y || {}), M = /* @__PURE__ */ ((e) => (e.PIP = "pip", e.ENTRY_CATCH = "entryCatch", e))(M || {});
const I = Symbol("pip"), Pe = (e) => {
  var t, n, o, a;
  return e ? ((t = e.querySelector(".bpx-player-video-wrap")) == null ? void 0 : t.children[0]) || ((n = e.querySelector(".bilibili-player-video")) == null ? void 0 : n.children[0]) || ((o = e.querySelector("#live-player")) == null ? void 0 : o.children[0]) || ((a = e.querySelector(".container-video")) == null ? void 0 : a.children[0]) : null;
}, Fe = (e = {}) => {
  const {
    scrolling: t = !1,
    customTarget: n = !1,
    supportTarget: o = y.NONE,
    scrollingInfo: a = "",
    target: s = "",
    customScrollingTarget: l = !1,
    supportType: r = y.NONE
  } = e;
  if (n && s) {
    window.hw.utils.createCache(I);
    const c = document.querySelector(s);
    if (!c) return alert("未找到该节点");
    const i = window.hw.cacheMap.get(I);
    i.node = c, $(I, i == null ? void 0 : i.node, {
      scrolling: t,
      scrollingInfo: a,
      customScrollingTarget: l,
      supportType: r
    });
  } else if (o)
    switch (o) {
      case y.BILIBILI: {
        window.hw.utils.createCache(I);
        const c = Pe(document) || null;
        if (!c) return alert("未找到该节点(暂不支持iframe中节点查询)");
        const i = window.hw.cacheMap.get(I);
        return i.node = c, $(I, i == null ? void 0 : i.node, {
          scrolling: t,
          scrollingInfo: a,
          customScrollingTarget: l,
          supportType: r
        });
      }
      default:
        return;
    }
  else {
    alert("请移动鼠标选择DOM(框住的区域即为想要加入画中画的区域)！选择完成之后点击鼠标左键"), window.hw.utils.useSelectDOM(I, "start");
    const c = window.hw.cacheMap.get(I), i = async () => {
      await $(I, c == null ? void 0 : c.node, {
        scrolling: t,
        scrollingInfo: a,
        customScrollingTarget: l,
        supportType: r
      }) && window.removeEventListener("click", i);
    };
    window.addEventListener("click", i);
  }
}, $ = async (e, t, n = {}) => {
  if (!t) return !1;
  switch (window.hw.utils.useSelectDOM(e, "close"), t.nodeName) {
    case "VIDEO":
      return Le(t, e, n), !0;
    default:
      return Re(t, e), !0;
  }
}, Le = async (e, t, n = {}) => {
  const o = window.hw.cacheMap.get(t);
  if (!o || !e) return;
  const {
    scrolling: a = !1,
    scrollingInfo: s = "",
    customScrollingTarget: l = !1,
    supportType: r = y.NONE
  } = n;
  Me(t, e, a), await e.requestPictureInPicture(), a && (o.extraInfo.canvasEngine = u, Ae(e, {
    scrollingInfo: s,
    customScrollingTarget: l,
    supportType: r
  })), o.extraInfo.pipWindow = null;
}, Re = async (e, t) => {
  const n = window.hw.cacheMap.get(t);
  if (!n || !e) return;
  const o = {
    initialAspectRatio: e.clientWidth / e.clientHeight,
    lockAspectRatio: !0,
    copyStyleSheets: !0
  };
  n.extraInfo.pipWindow = await window.documentPictureInPicture.requestWindow(o), [...document.styleSheets].forEach((s) => {
    try {
      const l = [...s.cssRules].map((c) => c.cssText).join(""), r = document.createElement("style");
      r.textContent = l, n.extraInfo.pipWindow.document.head.appendChild(r);
    } catch {
      const r = document.createElement("link");
      r.rel = "stylesheet", r.type = s.type, r.media = s.media, r.href = s.href, n.extraInfo.pipWindow.document.head.appendChild(r);
    }
  });
  const a = document.createElement("div");
  a.style.width = "100%", a.style.height = "100%", a.style.overflow = "auto", n.extraInfo.pipWindow.document.body.append(a), a.append(e), n.beMoved = !0, n.currentParent = a, n.extraInfo.pipWindow.addEventListener(
    "unload",
    () => {
      window.hw.utils.disCacheDOM(t), n.extraInfo.pipWindow.close();
    },
    {
      once: !0
    }
  );
}, Ae = (e, t = {}) => {
  const { scrollingInfo: n = "", customScrollingTarget: o = !1, supportType: a = y.NONE } = t;
  if (o) {
    if (!n) return;
    if (!document.querySelector(n)) return alert("未找到该弹幕根节点");
  } else
    xe(a);
}, Me = (e, t, n) => {
  if (n) {
    const o = u.video;
    if (!o) return;
    if (u.videoEl = t, o.addEventListener("play", () => {
      t && t.play();
    }), o.addEventListener("pause", () => {
      t && t.pause();
    }), t.addEventListener("play", () => {
      o.play();
    }), t.addEventListener("pause", () => {
      o.pause();
    }), o.addEventListener(
      "leavepictureinpicture",
      () => {
        u.requestAnimationFrameId && cancelAnimationFrame(u.requestAnimationFrameId), u.requestAnimationFrameId = 0, u.dispose(), window.hw.utils.disCacheDOM(e);
      },
      {
        once: !0
      }
    ), t.addEventListener(
      "enterpictureinpicture",
      () => {
        le(t), o.srcObject = u.canvas[0].captureStream(60);
      },
      { once: !0 }
    ), o.addEventListener(
      "loadedmetadata",
      () => {
        o.requestPictureInPicture(), o.play();
      },
      { once: !0 }
    ), navigator.mediaSession)
      try {
        navigator.mediaSession.setActionHandler("play", () => {
          t.play(), o.play();
        }), navigator.mediaSession.setActionHandler("pause", () => {
          t.pause(), o.pause();
        });
      } catch {
        console.warn("[哔哩哔哩画中画弹幕]", "绑定媒体功能键时发生错误");
      }
  } else
    t.addEventListener(
      "leavepictureinpicture",
      () => {
        window.hw.utils.disCacheDOM(e);
      },
      {
        once: !0
      }
    );
}, xe = (e) => {
  switch (e) {
    case y.BILIBILI: {
      const t = document.getElementsByClassName("bilibili-player-video-danmaku")[0] || document.getElementsByClassName("bpx-player-row-dm-wrap")[0] || document.getElementsByClassName("web-player-danmaku")[0] || document.getElementsByClassName("danmaku-screen")[0];
      if (!t) return alert("b站根节点未找到，请等待后续修复或填写自定义根节点");
      De(t);
      return;
    }
  }
}, De = (e) => {
  const t = new MutationObserver((n) => {
    n.forEach((o) => {
      o.type == "childList" && o.addedNodes.forEach((a) => {
        var s, l, r, c;
        if (a.nodeType === 1) {
          const i = a, g = String(i.innerText) || String(a.textContent) || "", C = i.style.color || i.style.getPropertyValue("--color"), p = i.style.opacity || i.style.getPropertyValue("--opacity") || "1";
          p != "0" && G(g.split(`
`)[0], {
            drawCtxStyle: {
              fillStyle: C || `rgba(255,255,255,${p})`
            }
          });
        } else if (a.nodeType === 3) {
          const i = a, g = String(a.textContent) || "", C = ((s = i.parentNode) == null ? void 0 : s.style.color) || ((l = i.parentNode) == null ? void 0 : l.style.getPropertyValue("--color")), p = ((r = i.parentNode) == null ? void 0 : r.style.opacity) || ((c = i.parentNode) == null ? void 0 : c.style.getPropertyValue("--opacity")) || "1";
          p != "0" && G(g.split(`
`)[0], {
            drawCtxStyle: {
              fillStyle: C || `rgba(255,255,255,${p})`
            }
          });
        }
      });
    });
  });
  return t.observe(e, { childList: !0, subtree: !0 }), u.observer = t, t;
}, G = (e, t = {}) => {
  if (!e) return;
  const { fontSize: n, drawCtxStyle: o = {} } = t;
  u.push({ text: e, fontSize: n, drawCtxStyle: o });
};
var T, k, B;
const R = class R {
  constructor() {
    D(this, T, null);
    D(this, k, null);
    h(this, "currentRenderQueue", []);
    h(this, "space", 40);
    h(this, "maxRow", 6);
    h(this, "fontSizeScale", 18);
    D(this, B, {});
    h(this, "oldTime", performance.now());
    h(this, "requestAnimationFrameId", 0);
    h(this, "observer", null);
    h(this, "renderLocks", Array.from({ length: this.maxRow }).fill(0).map((t, n) => ({
      index: n,
      lock: !1,
      offsetWidth: 0
    })));
    h(this, "renderQueue", []);
    h(this, "createCanvas", () => {
      const t = document.createElement("canvas"), n = t.getContext("2d");
      return F(this, T, [t, n]), v(this, T);
    });
    h(this, "createPIPVideo", () => (F(this, k, document.createElement("video")), v(this, k)));
    h(this, "computedCanvasInfo", (t) => {
      t && (v(this, B).width = this.canvas[0].width = t.videoWidth, v(this, B).height = this.canvas[0].height = t.videoHeight, v(this, B).speedScale = 0.3);
    });
    if (R.instance) return R.instance;
    R.instance = this;
  }
  getCanRenderRow(t) {
    for (const n of this.renderLocks)
      if (!n.lock)
        return n.lock = !0, n.offsetWidth = t, n;
    return null;
  }
  unLockRenderRow(t) {
    for (const n of this.renderLocks)
      n.lock && (n.offsetWidth -= t, n.offsetWidth < 0 && (n.offsetWidth = 0, n.lock = !1));
  }
  push(t) {
    this.renderQueue.push(t);
  }
  dispose() {
    this.observer && this.observer.disconnect(), this.observer = null, F(this, T, null), F(this, k, null), F(this, B, {});
  }
  build() {
    if (!this.renderQueue.length) return;
    const t = this.renderQueue.shift(), n = Ne(t.text, { fontSize: t.fontSize, drawCtxStyle: t.drawCtxStyle });
    this.currentRenderQueue.push({ ...n, text: t.text });
  }
  get canRender() {
    return this.renderLocks.some((t) => !t.lock);
  }
  get canvas() {
    return v(this, T) ? v(this, T) : this.createCanvas();
  }
  get video() {
    return v(this, k) ? v(this, k) : this.createPIPVideo();
  }
  set videoEl(t) {
    this.computedCanvasInfo(t);
  }
  get canvasInfo() {
    return v(this, B);
  }
  get baseFontSize() {
    return Math.floor(Math.min(this.canvas[0].width, this.canvas[0].height) / this.fontSizeScale);
  }
  setConfig(t) {
    const { space: n = this.space, maxRow: o = this.maxRow, fontSizeScale: a = this.fontSizeScale } = t;
    if (this.space = n, this.fontSizeScale = a, o !== this.maxRow) {
      if (o < this.maxRow)
        this.renderLocks = this.renderLocks.slice(0, o);
      else if (o > this.maxRow) {
        const s = Array.from({ length: o - this.maxRow }).fill(0).map((l, r) => ({
          index: this.maxRow + r,
          lock: !1,
          offsetWidth: 0
        }));
        this.renderLocks = [...this.renderLocks, ...s];
      }
      this.maxRow = o;
    }
  }
  help() {
    console.table({
      space: `弹幕之间的间距'(${this.space})`,
      maxRow: `最大弹幕行数'(${this.maxRow})`,
      fontSizeScale: `弹幕字体大小'(${this.fontSizeScale})`
    });
  }
};
T = new WeakMap(), k = new WeakMap(), B = new WeakMap(), h(R, "instance", null);
let q = R;
const u = new q(), Ne = (e, t = {}) => {
  const [n, o] = u.canvas, { fontSize: a = u.baseFontSize, drawCtxStyle: s = {} } = t;
  o.font = `${a}px SimHei,"Microsoft JhengHei",Arial,Helvetica,sans-serif`;
  const l = o.measureText(e).width, r = u.getCanRenderRow(l + u.space);
  return r ? {
    x: u.canvasInfo.width,
    y: a * r.index,
    w: l,
    h: a,
    fontSize: a,
    drawCtxStyle: {
      textBaseline: "top",
      shadowBlur: 3,
      shadowColor: "rgb(0, 0, 0)",
      font: `${a}px SimHei,"Microsoft JhengHei",Arial,Helvetica,sans-serif`,
      ...s
    }
  } : (alert("行信息丢失"), {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    fontSize: a,
    drawCtxStyle: s
  });
}, le = (e) => {
  if (!e) return;
  const t = performance.now(), n = t - u.oldTime;
  u.oldTime = t;
  const [o, a] = u.canvas;
  a.globalAlpha = 1;
  const s = u.canvasInfo.width, l = u.canvasInfo.height;
  if (a.clearRect(0, 0, s, l), a.drawImage(e, 0, 0, s, l, 0, 0, s, l), e.readyState >= 1 && !e.paused) {
    u.canRender && u.build(), u.currentRenderQueue = u.currentRenderQueue.filter((c) => !(c.x + c.w <= 0));
    const r = n * u.canvasInfo.speedScale;
    u.unLockRenderRow(r);
    for (const c of u.currentRenderQueue) {
      c.x -= r;
      const { x: i, y: g, text: C, drawCtxStyle: p } = c, P = {};
      for (const [d, O] of Object.entries(p))
        P[d] = a[d], a[d] = O;
      a.fillText(C, i, g);
      for (const [d, O] of Object.entries(P))
        a[d] = O;
    }
  }
  u.requestAnimationFrameId = requestAnimationFrame(() => le(e));
}, Oe = () => {
  var e;
  return window.hw.hooks = { ...((e = window == null ? void 0 : window.hw) == null ? void 0 : e.hooks) ?? {}, usePictureInPicture: Fe }, window.hw.globalCache.symbols.push(I), window.hw;
}, _e = H({
  name: "PipModal",
  components: {
    Form: K,
    FormItem: Z,
    Input: ee,
    Checkbox: te,
    Modal: ne,
    Select: oe
  },
  setup() {
    const e = x({
      open: !1,
      fromState: {
        scrolling: !1,
        scrollingInfo: "",
        target: "",
        customScrollingTarget: !1,
        supportType: y.NONE,
        customTarget: !1,
        supportTarget: y.NONE
      }
    }), t = () => {
      var l, r;
      const s = Oe();
      o(), (r = (l = s.hooks).usePictureInPicture) == null || r.call(l, e.fromState);
    }, n = () => {
      e.open = !0;
    }, o = () => {
      e.open = !1;
    };
    _(
      () => e.fromState.scrolling,
      (s) => {
        s || (e.fromState.scrollingInfo = "", e.fromState.supportType = y.NONE);
      }
    ), _(
      () => e.fromState.customScrollingTarget,
      () => {
        e.fromState.scrollingInfo = "", e.fromState.supportType = y.NONE;
      }
    ), _(
      () => e.fromState.customTarget,
      () => {
        e.fromState.target = "", e.fromState.supportTarget = y.NONE;
      }
    );
    const a = x([
      {
        value: y.BILIBILI,
        label: "b站"
      }
    ]);
    return {
      handlePIP: t,
      closePIPDialog: o,
      openPIPDialog: n,
      pipState: e,
      supportPIPTypeOptions: a
    };
  }
});
function $e(e, t, n, o, a, s) {
  const l = w("Checkbox"), r = w("FormItem"), c = w("Select"), i = w("Input"), g = w("Form"), C = w("Modal");
  return e.pipState.open ? (S(), b(C, {
    key: 0,
    okText: "确认",
    cancelText: "取消",
    class: "modal",
    open: e.pipState.open,
    "onUpdate:open": t[7] || (t[7] = (p) => e.pipState.open = p),
    title: "画中画启用配置",
    onOk: e.handlePIP
  }, {
    default: m(() => [
      f(g, {
        model: e.pipState.fromState,
        name: "pip_form",
        "label-col": { span: 8 },
        "wrapper-col": { span: 16 },
        autocomplete: "off"
      }, {
        default: m(() => [
          f(r, {
            name: "customTarget",
            label: "开启自定义节点"
          }, {
            default: m(() => [
              f(l, {
                checked: e.pipState.fromState.customTarget,
                "onUpdate:checked": t[0] || (t[0] = (p) => e.pipState.fromState.customTarget = p)
              }, null, 8, ["checked"])
            ]),
            _: 1
          }),
          e.pipState.fromState.customTarget ? E("", !0) : (S(), b(r, {
            key: 0,
            name: "supportTarget",
            label: "已支持网站"
          }, {
            default: m(() => [
              f(c, {
                options: e.supportPIPTypeOptions,
                value: e.pipState.fromState.supportTarget,
                "onUpdate:value": t[1] || (t[1] = (p) => e.pipState.fromState.supportTarget = p),
                placeholder: "已支持画中画预设网站"
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          })),
          e.pipState.fromState.customTarget ? (S(), b(r, {
            key: 1,
            name: "target",
            label: "画中画根节点信息"
          }, {
            default: m(() => [
              f(i, {
                value: e.pipState.fromState.target,
                "onUpdate:value": t[2] || (t[2] = (p) => e.pipState.fromState.target = p),
                placeholder: "画中画根节点信息(节点id或者类名)"
              }, null, 8, ["value"])
            ]),
            _: 1
          })) : E("", !0),
          f(r, {
            name: "scrolling",
            label: "开启画中画弹幕"
          }, {
            default: m(() => [
              f(l, {
                checked: e.pipState.fromState.scrolling,
                "onUpdate:checked": t[3] || (t[3] = (p) => e.pipState.fromState.scrolling = p)
              }, null, 8, ["checked"])
            ]),
            _: 1
          }),
          e.pipState.fromState.scrolling ? (S(), b(r, {
            key: 2,
            name: "customScrollingTarget",
            label: "自定义弹幕根节点"
          }, {
            default: m(() => [
              f(l, {
                checked: e.pipState.fromState.customScrollingTarget,
                "onUpdate:checked": t[4] || (t[4] = (p) => e.pipState.fromState.customScrollingTarget = p)
              }, null, 8, ["checked"])
            ]),
            _: 1
          })) : E("", !0),
          e.pipState.fromState.scrolling && e.pipState.fromState.customScrollingTarget ? (S(), b(r, {
            key: 3,
            name: "scrollingInfo",
            label: "弹幕根节点信息"
          }, {
            default: m(() => [
              f(i, {
                placeholder: "弹幕根节点信息(节点id或者类名)",
                value: e.pipState.fromState.scrollingInfo,
                "onUpdate:value": t[5] || (t[5] = (p) => e.pipState.fromState.scrollingInfo = p)
              }, null, 8, ["value"])
            ]),
            _: 1
          })) : E("", !0),
          e.pipState.fromState.scrolling && !e.pipState.fromState.customScrollingTarget ? (S(), b(r, {
            key: 4,
            name: "supportType",
            label: "已支持网站"
          }, {
            default: m(() => [
              f(c, {
                options: e.supportPIPTypeOptions,
                value: e.pipState.fromState.supportType,
                "onUpdate:value": t[6] || (t[6] = (p) => e.pipState.fromState.supportType = p),
                placeholder: "已支持弹幕网站"
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          })) : E("", !0)
        ]),
        _: 1
      }, 8, ["model"])
    ]),
    _: 1
  }, 8, ["open", "onOk"])) : E("", !0);
}
const We = /* @__PURE__ */ U(_e, [["render", $e], ["__scopeId", "data-v-d76df8ba"]]), qe = { class: "tools_box" }, He = /* @__PURE__ */ H({
  __name: "index",
  setup(e) {
    const t = x({
      open: !1
    }), n = N(), o = N();
    we(() => {
      Ie();
    });
    const a = () => {
      t.open = !t.open;
    }, s = (l) => {
      switch (l) {
        case M.PIP: {
          n.value.openPIPDialog();
          return;
        }
        case M.ENTRY_CATCH: {
          o.value.openEntryCatchDialog();
          return;
        }
        default:
          return;
      }
    };
    return (l, r) => (S(), A(W, null, [
      L("div", {
        class: Y(["tools_root", t.open ? "show" : "hidden"])
      }, [
        L("i", {
          class: Y(["icon", "iconfont", "tools_icon", t.open ? "icon-enter-line" : "icon-back-line"]),
          onClick: a
        }, null, 2),
        L("div", qe, [
          L("ul", null, [
            L("li", {
              onClick: r[0] || (r[0] = () => s(J(M).PIP))
            }, "画中画"),
            L("li", {
              onClick: r[1] || (r[1] = () => s(J(M).ENTRY_CATCH))
            }, "资源快速捕获")
          ])
        ])
      ], 2),
      f(Be, {
        ref_key: "entryCatchRef",
        ref: o
      }, null, 512),
      f(We, {
        ref_key: "pipModalRef",
        ref: n
      }, null, 512)
    ], 64));
  }
}), ze = /* @__PURE__ */ U(He, [["__scopeId", "data-v-7f4f6d95"]]);
console.log("start run HARVER script...");
const ie = document.createElement("div"), ce = "harver", Ue = `${ce}_${Date.now().toString().slice(0, 5)}`, ue = `${ce}_app_root_${Ue}`;
ie.id = ue;
document.body.append(ie);
const Ve = Se(ze);
Ve.mount(`#${ue}`);

}

moduleScript.innerHTML=`

import { defineComponent as H, reactive as x, ref as N, onBeforeUnmount as fe, resolveComponent as w, openBlock as S, createElementBlock as A, Fragment as W, createBlock as b, withCtx as m, createVNode as f, createCommentVNode as E, renderList as me, createTextVNode as he, toDisplayString as j, watch as _, onMounted as we, createElementVNode as L, normalizeClass as Y, unref as J, createApp as Se } from "vue";
import { Form as K, FormItem as Z, Input as ee, Checkbox as te, Modal as ne, Select as oe, Tooltip as ye, Typography as ge, message as X } from "ant-design-vue";
const run = ${run};
run();`
document.body.append(moduleScript);

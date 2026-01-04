// ==UserScript==
// @name         bili-comment-hide
// @namespace    qiyuor2/bili-comment-hide
// @version      1.1.0
// @author       qiyuor2
// @description  根据关键词隐藏 b 站评论
// @license      MIT
// @icon         https://qiyuor2.github.io/blog/favicon.ico
// @match        *://*.bilibili.com/*
// @exclude      *://api.bilibili.com/*
// @exclude      *://api.*.bilibili.com/*
// @exclude      *://*.bilibili.com/api/*
// @exclude      *://member.bilibili.com/studio/bs-editor/*
// @exclude      *://t.bilibili.com/h5/dynamic/specification
// @exclude      *://bbq.bilibili.com/*
// @exclude      *://message.bilibili.com/pages/nav/header_sync
// @exclude      *://s1.hdslb.com/bfs/seed/jinkela/short/cols/iframe.html
// @exclude      *://open-live.bilibili.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527448/bili-comment-hide.user.js
// @updateURL https://update.greasyfork.org/scripts/527448/bili-comment-hide.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(` .input[data-v-1e639cad]{box-sizing:border-box;height:100%;border-style:none;background-color:transparent;padding-left:.5rem;padding-right:.5rem;font-size:.875rem;line-height:1.25rem;--un-text-opacity:1;color:rgb(100 116 139 / var(--un-text-opacity));outline:2px solid transparent;outline-offset:2px;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.input[data-v-1e639cad]:disabled{cursor:not-allowed;--un-text-opacity:1;color:rgb(148 163 184 / var(--un-text-opacity))}.input[data-v-1e639cad]:invalid{--un-border-opacity:1;border-color:rgb(236 72 153 / var(--un-border-opacity));--un-text-opacity:1;color:rgb(236 72 153 / var(--un-text-opacity))}.input[data-v-1e639cad]:focus:invalid{--un-border-opacity:1;border-color:rgb(236 72 153 / var(--un-border-opacity))}*,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.absolute,[absolute=""]{position:absolute}.fixed,[fixed=""]{position:fixed}.relative,[relative=""]{position:relative}.after\\:absolute:after{position:absolute}[bottom~="-1px"]{bottom:-1px}[right~="-1px"]{right:-1px}[right~="-5"]{right:-1.25rem}[right~="2"]{right:.5rem}[top~="-1px"]{top:-1px}[top~="100px"]{top:100px}[left~="checked:after:4"]:checked:after{left:1rem}[right~="hover:2"]:hover{right:.5rem}.after\\:top-0:after{top:0}[left~="after:0"]:after{left:0}[z~="99999"]{z-index:99999}.m-0,[m-0=""]{margin:0}.my-2,[my-2=""]{margin-top:.5rem;margin-bottom:.5rem}.mb-1,[mb-1=""]{margin-bottom:.25rem}.mb-2,[mb-2=""]{margin-bottom:.5rem}.ml-1,[ml-1=""]{margin-left:.25rem}.ml-auto,[ml-auto=""]{margin-left:auto}.mr-\\.5,[mr-\\.5=""]{margin-right:.125rem}.mr-1,[mr-1=""]{margin-right:.25rem}.mt-30,[mt-30=""]{margin-top:7.5rem}.box-border,[box-border=""]{box-sizing:border-box}.h-12,[h-12=""],[h~="12"]{height:3rem}.h-8,[h-8=""]{height:2rem}.h-full{height:100%}[h~="4"]{height:1rem}[h~="430px"]{height:430px}[h~="600px"]{height:600px}[w~="0"]{width:0}[w~="12"]{width:3rem}[w~="290px"]{width:290px}[w~="300px"]{width:300px}[w~="3em"]{width:3em}[w~="4em"]{width:4em}[w~="8"]{width:2rem}[w~=full]{width:100%}[h~="after:4"]:after{height:1rem}[w~="after:4"]:after{width:1rem}.flex,[flex=""]{display:flex}.flex-col,[flex-col=""]{flex-direction:column}.flex-wrap,[flex-wrap=""]{flex-wrap:wrap}.cursor-pointer,[cursor-pointer=""]{cursor:pointer}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}[disabled\\:cursor-not-allowed=""]:disabled{cursor:not-allowed}.list-none,[list-none=""]{list-style-type:none}.appearance-none{-webkit-appearance:none;-moz-appearance:none;appearance:none}.items-start,[items-start=""]{align-items:flex-start}.items-center,[items-center=""],[items~=center]{align-items:center}.justify-center,[justify-center=""]{justify-content:center}.justify-between,[justify-between=""]{justify-content:space-between}.gap-1,[gap-1=""]{gap:.25rem}.gap-2,[gap-2=""]{gap:.5rem}.overflow-hidden,[overflow-hidden=""]{overflow:hidden}.overflow-y-scroll,[overflow-y-scroll=""]{overflow-y:scroll}.truncate,[truncate=""]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.border,[border=""],[border~="1"],[border~="1px"]{border-width:1px}.border-slate-200,[border-slate-200=""],[border~=slate-200]{--un-border-opacity:1;border-color:rgb(226 232 240 / var(--un-border-opacity))}.border-stone-2,[border-stone-2=""]{--un-border-opacity:1;border-color:rgb(231 229 228 / var(--un-border-opacity))}.invalid\\:border-pink-500:invalid{--un-border-opacity:1;border-color:rgb(236 72 153 / var(--un-border-opacity))}.invalid\\:focus\\:border-pink-500:focus:invalid{--un-border-opacity:1;border-color:rgb(236 72 153 / var(--un-border-opacity))}.rounded{border-radius:.25rem}.rounded-lg,[rounded-lg=""],[rounded~=lg]{border-radius:.5rem}.rounded-md,[rounded-md=""]{border-radius:.375rem}.rounded-xl,[rounded-xl=""]{border-radius:.75rem}[rounded~="after:full"]:after{border-radius:9999px}.border-none{border-style:none}.border-solid,[border-solid=""],[border~=solid]{border-style:solid}[border~=y-none]{border-top-style:none;border-bottom-style:none}[border~=l-none]{border-left-style:none}.bg-emerald-500,[bg-emerald-500=""]{--un-bg-opacity:1;background-color:rgb(16 185 129 / var(--un-bg-opacity))}.bg-stone-100,[bg-stone-100=""],[bg~=stone-100]{--un-bg-opacity:1;background-color:rgb(245 245 244 / var(--un-bg-opacity))}.bg-transparent,[bg~=transparent]{background-color:transparent}.bg-white,[bg-white=""],[bg~=white]{--un-bg-opacity:1;background-color:rgb(255 255 255 / var(--un-bg-opacity))}[bg~=slate-300]{--un-bg-opacity:1;background-color:rgb(203 213 225 / var(--un-bg-opacity))}[bg~="checked:after:emerald-500"]:checked:after{--un-bg-opacity:1;background-color:rgb(16 185 129 / var(--un-bg-opacity))}[bg~="checked:after:focus:emerald-700"]:focus:checked:after{--un-bg-opacity:1;background-color:rgb(4 120 87 / var(--un-bg-opacity))}[bg~="checked:after:hover:emerald-600"]:hover:checked:after{--un-bg-opacity:1;background-color:rgb(5 150 105 / var(--un-bg-opacity))}[bg~="checked:emerald-200"]:checked{--un-bg-opacity:1;background-color:rgb(167 243 208 / var(--un-bg-opacity))}[bg~="checked:focus:emerald-400"]:focus:checked{--un-bg-opacity:1;background-color:rgb(52 211 153 / var(--un-bg-opacity))}[bg~="checked:hover:emerald-300"]:hover:checked{--un-bg-opacity:1;background-color:rgb(110 231 183 / var(--un-bg-opacity))}.hover\\:bg-emerald-300:hover{--un-bg-opacity:1;background-color:rgb(110 231 183 / var(--un-bg-opacity))}[bg~="hover:slate-400"]:hover{--un-bg-opacity:1;background-color:rgb(148 163 184 / var(--un-bg-opacity))}[hover\\:bg-emerald-300=""]:hover{--un-bg-opacity:1;background-color:rgb(110 231 183 / var(--un-bg-opacity))}.disabled\\:bg-slate-200:disabled{--un-bg-opacity:1;background-color:rgb(226 232 240 / var(--un-bg-opacity))}[bg~="disabled:after:slate-300"]:disabled:after{--un-bg-opacity:1;background-color:rgb(203 213 225 / var(--un-bg-opacity))}[bg~="disabled:slate-200"]:disabled{--un-bg-opacity:1;background-color:rgb(226 232 240 / var(--un-bg-opacity))}[disabled\\:bg-slate-200=""]:disabled{--un-bg-opacity:1;background-color:rgb(226 232 240 / var(--un-bg-opacity))}[bg~="after:hover:slate-600"]:hover:after{--un-bg-opacity:1;background-color:rgb(71 85 105 / var(--un-bg-opacity))}[bg~="after:slate-500"]:after{--un-bg-opacity:1;background-color:rgb(100 116 139 / var(--un-bg-opacity))}.p-\\.5,[p-\\.5=""]{padding:.125rem}.p-0,[p-0=""],[p~="0"]{padding:0}[p~="5px"]{padding:5px}.px{padding-left:1rem;padding-right:1rem}.px-2,[px-2=""]{padding-left:.5rem;padding-right:.5rem}.py{padding-top:1rem;padding-bottom:1rem}[px~="8px"]{padding-left:8px;padding-right:8px}[py~="14px"]{padding-top:14px;padding-bottom:14px}.pr-1,[pr-1=""]{padding-right:.25rem}.text-sm,[text-sm=""]{font-size:.875rem;line-height:1.25rem}.text-xs,[text-xs=""]{font-size:.75rem;line-height:1rem}.text-slate-500,[text-slate-500=""]{--un-text-opacity:1;color:rgb(100 116 139 / var(--un-text-opacity))}.text-stone-400,[text-stone-400=""]{--un-text-opacity:1;color:rgb(168 162 158 / var(--un-text-opacity))}.text-stone-500{--un-text-opacity:1;color:rgb(120 113 108 / var(--un-text-opacity))}.text-white,[text-white=""]{--un-text-opacity:1;color:rgb(255 255 255 / var(--un-text-opacity))}.text-zinc-400,[text-zinc-400=""]{--un-text-opacity:1;color:rgb(161 161 170 / var(--un-text-opacity))}.text-zinc-500,[text-zinc-500=""]{--un-text-opacity:1;color:rgb(113 113 122 / var(--un-text-opacity))}.invalid\\:text-pink-500:invalid{--un-text-opacity:1;color:rgb(236 72 153 / var(--un-text-opacity))}.disabled\\:text-slate-400:disabled{--un-text-opacity:1;color:rgb(148 163 184 / var(--un-text-opacity))}[disabled\\:text-slate-400=""]:disabled{--un-text-opacity:1;color:rgb(148 163 184 / var(--un-text-opacity))}.font-bold,[font-bold=""]{font-weight:700}.tab{-moz-tab-size:4;-o-tab-size:4;tab-size:4}.shadow-gray-2{--un-shadow-opacity:1;--un-shadow-color:rgb(229 231 235 / var(--un-shadow-opacity)) }.shadow-sm,[shadow-sm=""]{--un-shadow:var(--un-shadow-inset) 0 1px 2px 0 var(--un-shadow-color, rgb(0 0 0 / .05));box-shadow:var(--un-ring-offset-shadow),var(--un-ring-shadow),var(--un-shadow)}.shadow-stone-400,[shadow-stone-400=""]{--un-shadow-opacity:1;--un-shadow-color:rgb(168 162 158 / var(--un-shadow-opacity)) }.outline{outline-style:solid}.outline-none,[outline~=none]{outline:2px solid transparent;outline-offset:2px}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}[outline~="focus:none"]:focus{outline:2px solid transparent;outline-offset:2px}.focus-visible\\:outline-none:focus-visible{outline:2px solid transparent;outline-offset:2px}[outline~="focus-visible:none"]:focus-visible{outline:2px solid transparent;outline-offset:2px}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-all,[transition-all=""],[transition~=all]{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}[transition~="300"]{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.3s}[transition~=colors]{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}[transition~="hover:all"]:hover{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}[transition~="after:all"]:after{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-200,[duration-200=""]{transition-duration:.2s}.duration-300,[duration-300=""]{transition-duration:.3s}.ease-in-out,[ease-in-out=""]{transition-timing-function:cubic-bezier(.4,0,.2,1)}.after\\:content-\\[\\'\\'\\]:after{content:""}:where(html){line-height:1.15;-webkit-text-size-adjust:100%;text-size-adjust:100%}:where(h1){font-size:2em;margin-block-end:.67em;margin-block-start:.67em}:where(dl,ol,ul) :where(dl,ol,ul){margin-block-end:0;margin-block-start:0}:where(hr){box-sizing:content-box;color:inherit;height:0}:where(abbr[title]){text-decoration:underline;text-decoration:underline dotted}:where(b,strong){font-weight:bolder}:where(code,kbd,pre,samp){font-family:monospace,monospace;font-size:1em}:where(small){font-size:80%}:where(table){border-color:currentColor;text-indent:0}:where(button,input,select){margin:0}:where(button){text-transform:none}:where(button,input:is([type=button i],[type=reset i],[type=submit i])){-webkit-appearance:button}:where(progress){vertical-align:baseline}:where(select){text-transform:none}:where(textarea){margin:0}:where(input[type=search i]){-webkit-appearance:textfield;outline-offset:-2px}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}::-webkit-input-placeholder{color:inherit;opacity:.54}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}:where(button,input:is([type=button i],[type=color i],[type=reset i],[type=submit i]))::-moz-focus-inner{border-style:none;padding:0}:where(button,input:is([type=button i],[type=color i],[type=reset i],[type=submit i]))::-moz-focusring{outline:1px dotted ButtonText}:where(:-moz-ui-invalid){box-shadow:none}:where(dialog){background-color:#fff;border:solid;color:#000;height:-moz-fit-content;height:fit-content;left:0;margin:auto;padding:1em;position:absolute;right:0;width:-moz-fit-content;width:fit-content}:where(dialog:not([open])){display:none}:where(summary){display:list-item} `);

(function (vue) {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  function useGMValue(key, initialValue) {
    const _value = vue.ref(_GM_getValue(key, initialValue));
    vue.watch(
      _value,
      (v) => {
        _GM_setValue(key, v);
      },
      { deep: true }
    );
    return vue.computed({
      set(v) {
        _value.value = v;
      },
      get() {
        return _value.value;
      }
    });
  }
  const _hoisted_1$3 = ["w", "h", "p", "right"];
  const _hoisted_2$3 = ["bg", "w"];
  const _hoisted_3$2 = {
    "text-xs": "",
    "text-stone-400": ""
  };
  const _hoisted_4$1 = { w: "300px" };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "FloatContainer",
    setup(__props) {
      const isExpand = useGMValue("isExpand", true);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          fixed: "",
          "bg-white": "",
          border: "",
          "border-solid": "",
          "border-stone-2": "",
          "shadow-sm": "",
          "shadow-stone-400": "",
          "rounded-xl": "",
          "transition-all": "",
          "duration-300": "",
          "ease-in-out": "",
          "overflow-hidden": "",
          z: "99999",
          top: "100px",
          w: vue.unref(isExpand) ? "300px" : "12",
          h: vue.unref(isExpand) ? "600px" : "12",
          p: vue.unref(isExpand) ? "5px" : "0",
          right: vue.unref(isExpand) ? "2" : "hover:2 -5"
        }, [
          vue.createElementVNode("div", {
            ref: "el",
            onClick: _cache[0] || (_cache[0] = ($event) => isExpand.value = !vue.unref(isExpand)),
            flex: "",
            "items-center": "",
            "justify-center": "",
            "h-12": "",
            "rounded-lg": "",
            "bg-stone-100": "",
            bg: vue.unref(isExpand) ? "stone-100" : "white",
            w: vue.unref(isExpand) ? "full" : "12",
            "cursor-pointer": "",
            "transition-all": "",
            "duration-300": "",
            "ease-in-out": "",
            "gap-1": ""
          }, [
            _cache[1] || (_cache[1] = vue.createElementVNode("span", null, "评论", -1)),
            vue.createElementVNode("span", _hoisted_3$2, vue.toDisplayString(vue.unref(isExpand) ? "点击这里最小化" : ""), 1)
          ], 8, _hoisted_2$3),
          vue.withDirectives(vue.createElementVNode("div", _hoisted_4$1, [
            vue.renderSlot(_ctx.$slots, "default")
          ], 512), [
            [vue.vShow, vue.unref(isExpand)]
          ])
        ], 8, _hoisted_1$3);
      };
    }
  });
  const _hoisted_1$2 = {
    relative: "",
    flex: "",
    "h-8": "",
    border: "",
    "border-slate-200": "",
    "border-solid": "",
    "rounded-md": "",
    "overflow-hidden": ""
  };
  const _hoisted_2$2 = {
    "px-2": "",
    "text-sm": "",
    "text-slate-500": "",
    flex: "",
    "items-center": "",
    bg: "transparent",
    border: "1 l-none y-none solid slate-200",
    w: "3em"
  };
  const _hoisted_3$1 = { w: "0" };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "InputWithType",
    props: {
      label: {}
    },
    emits: ["add"],
    setup(__props, { emit: __emit }) {
      const value = vue.ref("");
      const emits = __emit;
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
          vue.createElementVNode("div", _hoisted_2$2, vue.toDisplayString(_ctx.label), 1),
          vue.createElementVNode("div", _hoisted_3$1, [
            vue.withDirectives(vue.createElementVNode("input", {
              class: "input",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(value) ? value.value = $event : null)
            }, null, 512), [
              [vue.vModelText, vue.unref(value)]
            ])
          ]),
          vue.createElementVNode("button", {
            absolute: "",
            right: "-1px",
            top: "-1px",
            bottom: "-1px",
            w: "4em",
            "bg-emerald-500": "",
            "hover:bg-emerald-300": "",
            "text-white": "",
            "text-sm": "",
            "disabled:bg-slate-200": "",
            "disabled:text-slate-400": "",
            "cursor-pointer": "",
            border: "1px solid slate-200",
            "ml-auto": "",
            transition: "all hover:all 300",
            "disabled:cursor-not-allowed": "",
            "font-bold": "",
            outline: "none focus-visible:none focus:none",
            onClick: _cache[1] || (_cache[1] = ($event) => emits("add", vue.unref(value)))
          }, "添加")
        ]);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const __unplugin_components_1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-1e639cad"]]);
  const _hoisted_1$1 = {
    relative: "",
    flex: "",
    "flex-wrap": "",
    "items-center": ""
  };
  const _hoisted_2$1 = ["checked"];
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "Switch",
    props: {
      "modelValue": { type: Boolean },
      "modelModifiers": {}
    },
    emits: ["update:modelValue"],
    setup(__props) {
      const modelValue = vue.useModel(__props, "modelValue");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.createElementVNode("input", {
            checked: modelValue.value,
            onChange: _cache[0] || (_cache[0] = ($event) => modelValue.value = !modelValue.value),
            type: "checkbox",
            class: "relative appearance-none cursor-pointer shadow-sm shadow-gray-2 focus:outline-none focus-visible:outline-none after:content-[''] after:absolute after:top-0 disabled:cursor-not-allowed",
            w: "8 after:4",
            h: "4 after:4",
            left: "after:0 checked:after:4",
            rounded: "lg after:full",
            transition: "colors after:all",
            bg: "slate-300 hover:slate-400 after:slate-500  after:hover:slate-600 checked:hover:emerald-300 checked:after:hover:emerald-600 checked:focus:emerald-400 checked:after:focus:emerald-700  checked:after:emerald-500  disabled:slate-200 disabled:after:slate-300 checked:emerald-200"
          }, null, 40, _hoisted_2$1)
        ]);
      };
    }
  });
  var BlockType = /* @__PURE__ */ ((BlockType2) => {
    BlockType2["Keyword"] = "keyword";
    BlockType2["UID"] = "uid";
    return BlockType2;
  })(BlockType || {});
  function useBlockListWithType(options) {
    const lists = {};
    for (const type in options) {
      const { storageKey, defaultValue } = options[type];
      lists[type] = useGMValue(storageKey, defaultValue);
    }
    const currentType = vue.ref(
      "keyword"
      /* Keyword */
    );
    const list = vue.computed(() => lists[currentType.value].value);
    return {
      type: currentType,
      list
    };
  }
  const slice = (o, n) => Array.prototype.slice.call(o, n);
  let result = null;
  if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope) {
    result = self;
  } else if (typeof unsafeWindow !== "undefined") {
    result = unsafeWindow;
  } else if (typeof global !== "undefined") {
    result = global;
  } else if (window) {
    result = window;
  }
  const windowRef = result;
  const documentRef = result.document;
  const UPLOAD_EVENTS = ["load", "loadend", "loadstart"];
  const COMMON_EVENTS = ["progress", "abort", "error", "timeout"];
  const depricatedProp = (p) => ["returnValue", "totalSize", "position"].includes(p);
  const mergeObjects = function(src, dst) {
    for (let k in src) {
      if (depricatedProp(k)) {
        continue;
      }
      const v = src[k];
      try {
        dst[k] = v;
      } catch (error) {
      }
    }
    return dst;
  };
  const proxyEvents = function(events, src, dst) {
    const p = (event) => function(e) {
      const clone = {};
      for (let k in e) {
        if (depricatedProp(k)) {
          continue;
        }
        const val = e[k];
        clone[k] = val === src ? dst : val;
      }
      return dst.dispatchEvent(event, clone);
    };
    for (let event of Array.from(events)) {
      if (dst._has(event)) {
        src[`on${event}`] = p(event);
      }
    }
  };
  const fakeEvent = function(type) {
    if (documentRef && documentRef.createEventObject != null) {
      const msieEventObject = documentRef.createEventObject();
      msieEventObject.type = type;
      return msieEventObject;
    }
    try {
      return new Event(type);
    } catch (error) {
      return { type };
    }
  };
  const EventEmitter = function(nodeStyle) {
    let events = {};
    const listeners = (event) => events[event] || [];
    const emitter = {};
    emitter.addEventListener = function(event, callback, i) {
      events[event] = listeners(event);
      if (events[event].indexOf(callback) >= 0) {
        return;
      }
      i = i === void 0 ? events[event].length : i;
      events[event].splice(i, 0, callback);
    };
    emitter.removeEventListener = function(event, callback) {
      if (event === void 0) {
        events = {};
        return;
      }
      if (callback === void 0) {
        events[event] = [];
      }
      const i = listeners(event).indexOf(callback);
      if (i === -1) {
        return;
      }
      listeners(event).splice(i, 1);
    };
    emitter.dispatchEvent = function() {
      const args = slice(arguments);
      const event = args.shift();
      if (!nodeStyle) {
        args[0] = mergeObjects(args[0], fakeEvent(event));
        Object.defineProperty(args[0], "target", {
          writable: false,
          value: this
        });
      }
      const legacylistener = emitter[`on${event}`];
      if (legacylistener) {
        legacylistener.apply(emitter, args);
      }
      const iterable = listeners(event).concat(listeners("*"));
      for (let i = 0; i < iterable.length; i++) {
        const listener = iterable[i];
        listener.apply(emitter, args);
      }
    };
    emitter._has = (event) => !!(events[event] || emitter[`on${event}`]);
    if (nodeStyle) {
      emitter.listeners = (event) => slice(listeners(event));
      emitter.on = emitter.addEventListener;
      emitter.off = emitter.removeEventListener;
      emitter.fire = emitter.dispatchEvent;
      emitter.once = function(e, fn) {
        var fire = function() {
          emitter.off(e, fire);
          return fn.apply(null, arguments);
        };
        return emitter.on(e, fire);
      };
      emitter.destroy = () => events = {};
    }
    return emitter;
  };
  const CRLF = "\r\n";
  const objectToString = function(headersObj) {
    const entries = Object.entries(headersObj);
    const headers2 = entries.map(([name, value]) => {
      return `${name.toLowerCase()}: ${value}`;
    });
    return headers2.join(CRLF);
  };
  const stringToObject = function(headersString, dest) {
    const headers2 = headersString.split(CRLF);
    if (dest == null) {
      dest = {};
    }
    for (let header of headers2) {
      if (/([^:]+):\s*(.+)/.test(header)) {
        const name = RegExp.$1 != null ? RegExp.$1.toLowerCase() : void 0;
        const value = RegExp.$2;
        if (dest[name] == null) {
          dest[name] = value;
        }
      }
    }
    return dest;
  };
  const convert = function(headers2, dest) {
    switch (typeof headers2) {
      case "object": {
        return objectToString(headers2);
      }
      case "string": {
        return stringToObject(headers2, dest);
      }
    }
    return [];
  };
  var headers = { convert };
  const hooks = EventEmitter(true);
  const nullify = (res) => res === void 0 ? null : res;
  const Native$1 = windowRef.XMLHttpRequest;
  const Xhook$1 = function() {
    const ABORTED = -1;
    const xhr = new Native$1();
    const request = {};
    let status = null;
    let hasError = void 0;
    let transiting = void 0;
    let response = void 0;
    var currentState = 0;
    const readHead = function() {
      response.status = status || xhr.status;
      if (status !== ABORTED) {
        response.statusText = xhr.statusText;
      }
      if (status !== ABORTED) {
        const object = headers.convert(xhr.getAllResponseHeaders());
        for (let key in object) {
          const val = object[key];
          if (!response.headers[key]) {
            const name = key.toLowerCase();
            response.headers[name] = val;
          }
        }
        return;
      }
    };
    const readBody = function() {
      if (!xhr.responseType || xhr.responseType === "text") {
        response.text = xhr.responseText;
        response.data = xhr.responseText;
        try {
          response.xml = xhr.responseXML;
        } catch (error) {
        }
      } else if (xhr.responseType === "document") {
        response.xml = xhr.responseXML;
        response.data = xhr.responseXML;
      } else {
        response.data = xhr.response;
      }
      if ("responseURL" in xhr) {
        response.finalUrl = xhr.responseURL;
      }
    };
    const writeHead = function() {
      facade.status = response.status;
      facade.statusText = response.statusText;
    };
    const writeBody = function() {
      if ("text" in response) {
        facade.responseText = response.text;
      }
      if ("xml" in response) {
        facade.responseXML = response.xml;
      }
      if ("data" in response) {
        facade.response = response.data;
      }
      if ("finalUrl" in response) {
        facade.responseURL = response.finalUrl;
      }
    };
    const emitFinal = function() {
      if (!hasError) {
        facade.dispatchEvent("load", {});
      }
      facade.dispatchEvent("loadend", {});
      if (hasError) {
        facade.readyState = 0;
      }
    };
    const emitReadyState = function(n) {
      while (n > currentState && currentState < 4) {
        facade.readyState = ++currentState;
        if (currentState === 1) {
          facade.dispatchEvent("loadstart", {});
        }
        if (currentState === 2) {
          writeHead();
        }
        if (currentState === 4) {
          writeHead();
          writeBody();
        }
        facade.dispatchEvent("readystatechange", {});
        if (currentState === 4) {
          if (request.async === false) {
            emitFinal();
          } else {
            setTimeout(emitFinal, 0);
          }
        }
      }
    };
    const setReadyState = function(n) {
      if (n !== 4) {
        emitReadyState(n);
        return;
      }
      const afterHooks = hooks.listeners("after");
      var process = function() {
        if (afterHooks.length > 0) {
          const hook = afterHooks.shift();
          if (hook.length === 2) {
            hook(request, response);
            process();
          } else if (hook.length === 3 && request.async) {
            hook(request, response, process);
          } else {
            process();
          }
        } else {
          emitReadyState(4);
        }
        return;
      };
      process();
    };
    var facade = EventEmitter();
    request.xhr = facade;
    xhr.onreadystatechange = function(event) {
      try {
        if (xhr.readyState === 2) {
          readHead();
        }
      } catch (error) {
      }
      if (xhr.readyState === 4) {
        transiting = false;
        readHead();
        readBody();
      }
      setReadyState(xhr.readyState);
    };
    const hasErrorHandler = function() {
      hasError = true;
    };
    facade.addEventListener("error", hasErrorHandler);
    facade.addEventListener("timeout", hasErrorHandler);
    facade.addEventListener("abort", hasErrorHandler);
    facade.addEventListener("progress", function(event) {
      if (currentState < 3) {
        setReadyState(3);
      } else if (xhr.readyState <= 3) {
        facade.dispatchEvent("readystatechange", {});
      }
    });
    if ("withCredentials" in xhr) {
      facade.withCredentials = false;
    }
    facade.status = 0;
    for (let event of Array.from(COMMON_EVENTS.concat(UPLOAD_EVENTS))) {
      facade[`on${event}`] = null;
    }
    facade.open = function(method, url, async, user, pass) {
      currentState = 0;
      hasError = false;
      transiting = false;
      request.headers = {};
      request.headerNames = {};
      request.status = 0;
      request.method = method;
      request.url = url;
      request.async = async !== false;
      request.user = user;
      request.pass = pass;
      response = {};
      response.headers = {};
      setReadyState(1);
    };
    facade.send = function(body) {
      let k, modk;
      for (k of ["type", "timeout", "withCredentials"]) {
        modk = k === "type" ? "responseType" : k;
        if (modk in facade) {
          request[k] = facade[modk];
        }
      }
      request.body = body;
      const send = function() {
        proxyEvents(COMMON_EVENTS, xhr, facade);
        if (facade.upload) {
          proxyEvents(
            COMMON_EVENTS.concat(UPLOAD_EVENTS),
            xhr.upload,
            facade.upload
          );
        }
        transiting = true;
        xhr.open(
          request.method,
          request.url,
          request.async,
          request.user,
          request.pass
        );
        for (k of ["type", "timeout", "withCredentials"]) {
          modk = k === "type" ? "responseType" : k;
          if (k in request) {
            xhr[modk] = request[k];
          }
        }
        for (let header in request.headers) {
          const value = request.headers[header];
          if (header) {
            xhr.setRequestHeader(header, value);
          }
        }
        xhr.send(request.body);
      };
      const beforeHooks = hooks.listeners("before");
      var process = function() {
        if (!beforeHooks.length) {
          return send();
        }
        const done = function(userResponse) {
          if (typeof userResponse === "object" && (typeof userResponse.status === "number" || typeof response.status === "number")) {
            mergeObjects(userResponse, response);
            if (!("data" in userResponse)) {
              userResponse.data = userResponse.response || userResponse.text;
            }
            setReadyState(4);
            return;
          }
          process();
        };
        done.head = function(userResponse) {
          mergeObjects(userResponse, response);
          setReadyState(2);
        };
        done.progress = function(userResponse) {
          mergeObjects(userResponse, response);
          setReadyState(3);
        };
        const hook = beforeHooks.shift();
        if (hook.length === 1) {
          done(hook(request));
        } else if (hook.length === 2 && request.async) {
          hook(request, done);
        } else {
          done();
        }
        return;
      };
      process();
    };
    facade.abort = function() {
      status = ABORTED;
      if (transiting) {
        xhr.abort();
      } else {
        facade.dispatchEvent("abort", {});
      }
    };
    facade.setRequestHeader = function(header, value) {
      const lName = header != null ? header.toLowerCase() : void 0;
      const name = request.headerNames[lName] = request.headerNames[lName] || header;
      if (request.headers[name]) {
        value = request.headers[name] + ", " + value;
      }
      request.headers[name] = value;
    };
    facade.getResponseHeader = (header) => nullify(response.headers[header ? header.toLowerCase() : void 0]);
    facade.getAllResponseHeaders = () => nullify(headers.convert(response.headers));
    if (xhr.overrideMimeType) {
      facade.overrideMimeType = function() {
        xhr.overrideMimeType.apply(xhr, arguments);
      };
    }
    if (xhr.upload) {
      let up = EventEmitter();
      facade.upload = up;
      request.upload = up;
    }
    facade.UNSENT = 0;
    facade.OPENED = 1;
    facade.HEADERS_RECEIVED = 2;
    facade.LOADING = 3;
    facade.DONE = 4;
    facade.response = "";
    facade.responseText = "";
    facade.responseXML = null;
    facade.readyState = 0;
    facade.statusText = "";
    return facade;
  };
  Xhook$1.UNSENT = 0;
  Xhook$1.OPENED = 1;
  Xhook$1.HEADERS_RECEIVED = 2;
  Xhook$1.LOADING = 3;
  Xhook$1.DONE = 4;
  var XMLHttpRequest = {
    patch() {
      if (Native$1) {
        windowRef.XMLHttpRequest = Xhook$1;
      }
    },
    unpatch() {
      if (Native$1) {
        windowRef.XMLHttpRequest = Native$1;
      }
    },
    Native: Native$1,
    Xhook: Xhook$1
  };
  function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result2) {
        result2.done ? resolve(result2.value) : adopt(result2.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, [])).next());
    });
  }
  const Native = windowRef.fetch;
  function copyToObjFromRequest(req) {
    const copyedKeys = [
      "method",
      "headers",
      "body",
      "mode",
      "credentials",
      "cache",
      "redirect",
      "referrer",
      "referrerPolicy",
      "integrity",
      "keepalive",
      "signal",
      "url"
    ];
    let copyedObj = {};
    copyedKeys.forEach((key) => copyedObj[key] = req[key]);
    return copyedObj;
  }
  function covertHeaderToPlainObj(headers2) {
    if (headers2 instanceof Headers) {
      return covertTDAarryToObj([...headers2.entries()]);
    }
    if (Array.isArray(headers2)) {
      return covertTDAarryToObj(headers2);
    }
    return headers2;
  }
  function covertTDAarryToObj(input) {
    return input.reduce((prev, [key, value]) => {
      prev[key] = value;
      return prev;
    }, {});
  }
  const Xhook = function(input, init = { headers: {} }) {
    let options = Object.assign(Object.assign({}, init), { isFetch: true });
    if (input instanceof Request) {
      const requestObj = copyToObjFromRequest(input);
      const prevHeaders = Object.assign(Object.assign({}, covertHeaderToPlainObj(requestObj.headers)), covertHeaderToPlainObj(options.headers));
      options = Object.assign(Object.assign(Object.assign({}, requestObj), init), { headers: prevHeaders, acceptedRequest: true });
    } else {
      options.url = input;
    }
    const beforeHooks = hooks.listeners("before");
    const afterHooks = hooks.listeners("after");
    return new Promise(function(resolve, reject) {
      let fullfiled = resolve;
      const processAfter = function(response) {
        if (!afterHooks.length) {
          return fullfiled(response);
        }
        const hook = afterHooks.shift();
        if (hook.length === 2) {
          hook(options, response);
          return processAfter(response);
        } else if (hook.length === 3) {
          return hook(options, response, processAfter);
        } else {
          return processAfter(response);
        }
      };
      const done = function(userResponse) {
        if (userResponse !== void 0) {
          const response = new Response(userResponse.body || userResponse.text, userResponse);
          resolve(response);
          processAfter(response);
          return;
        }
        processBefore();
      };
      const processBefore = function() {
        if (!beforeHooks.length) {
          send();
          return;
        }
        const hook = beforeHooks.shift();
        if (hook.length === 1) {
          return done(hook(options));
        } else if (hook.length === 2) {
          return hook(options, done);
        }
      };
      const send = () => __awaiter(this, void 0, void 0, function* () {
        const { url, isFetch, acceptedRequest } = options, restInit = __rest(options, ["url", "isFetch", "acceptedRequest"]);
        if (input instanceof Request && restInit.body instanceof ReadableStream) {
          restInit.body = yield new Response(restInit.body).text();
        }
        return Native(url, restInit).then((response) => processAfter(response)).catch(function(err) {
          fullfiled = reject;
          processAfter(err);
          return reject(err);
        });
      });
      processBefore();
    });
  };
  var fetch = {
    patch() {
      if (Native) {
        windowRef.fetch = Xhook;
      }
    },
    unpatch() {
      if (Native) {
        windowRef.fetch = Native;
      }
    },
    Native,
    Xhook
  };
  const xhook = hooks;
  xhook.EventEmitter = EventEmitter;
  xhook.before = function(handler, i) {
    if (handler.length < 1 || handler.length > 2) {
      throw "invalid hook";
    }
    return xhook.on("before", handler, i);
  };
  xhook.after = function(handler, i) {
    if (handler.length < 2 || handler.length > 3) {
      throw "invalid hook";
    }
    return xhook.on("after", handler, i);
  };
  xhook.enable = function() {
    XMLHttpRequest.patch();
    fetch.patch();
  };
  xhook.disable = function() {
    XMLHttpRequest.unpatch();
    fetch.unpatch();
  };
  xhook.XMLHttpRequest = XMLHttpRequest.Native;
  xhook.fetch = fetch.Native;
  xhook.headers = headers.convert;
  xhook.enable();
  function matchURL(url, rule) {
    return url.includes(rule.url);
  }
  function useRequestHook(options) {
    xhook.after((request, response) => {
      const rules = vue.toValue((options == null ? void 0 : options.rules) ?? []);
      for (const rule of rules) {
        if (matchURL(request.url, rule)) {
          Object.defineProperty(response, "data", {
            set(v) {
              this._data = rule.response(v);
            },
            get() {
              return this._data;
            }
          });
        }
      }
    });
    console.log("[bili-comment-hide] options?.immediate ", options == null ? void 0 : options.immediate);
    (options == null ? void 0 : options.immediate) ? xhook.enable() : xhook.disable();
    return { enable: xhook.enable, disable: xhook.disable };
  }
  const _hoisted_1 = {
    class: "main",
    "box-border": "",
    w: "290px",
    px: "8px",
    py: "14px"
  };
  const _hoisted_2 = {
    flex: "",
    items: "center",
    "mb-2": ""
  };
  const _hoisted_3 = {
    flex: "",
    "flex-col": ""
  };
  const _hoisted_4 = {
    "my-2": "",
    flex: "",
    "items-start": "",
    "gap-2": ""
  };
  const _hoisted_5 = ["onClick"];
  const _hoisted_6 = {
    key: 0,
    "p-0": "",
    "m-0": "",
    "overflow-y-scroll": "",
    h: "430px"
  };
  const _hoisted_7 = {
    truncate: "",
    "mr-.5": ""
  };
  const _hoisted_8 = ["onClick"];
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const tabs = {
        [BlockType.Keyword]: { name: "关键词", value: BlockType.Keyword },
        [BlockType.UID]: { name: "UID", value: BlockType.UID }
      };
      const isChecked = useGMValue("isChecked", true);
      const { type, list } = useBlockListWithType({
        [BlockType.Keyword]: { storageKey: "keywords", defaultValue: [] },
        [BlockType.UID]: { storageKey: "uids", defaultValue: [] }
      });
      function filterByKeyword(replies, keywords) {
        return replies.filter((item) => keywords.every((keyword) => item.content.message.indexOf(keyword) === -1));
      }
      function filterByUID(replies, uids) {
        return replies.filter((item) => uids.every((uid) => item.mid_str !== uid));
      }
      const filterMap = {
        [BlockType.Keyword]: filterByKeyword,
        [BlockType.UID]: filterByUID
      };
      const requestHook = useRequestHook({
        rules: [
          {
            url: "x/v2/reply/wbi/main",
            response: (originResponse) => {
              var _a;
              if ((_a = originResponse == null ? void 0 : originResponse.data) == null ? void 0 : _a.replies) {
                const repliesFilter = filterMap[type.value];
                const replies = repliesFilter(originResponse.data.replies.slice(), list.value);
                originResponse.data.replies = replies;
              }
              return originResponse;
            }
          },
          {
            url: "x/v2/reply/reply",
            response: (originResponse) => {
              var _a;
              if ((_a = originResponse == null ? void 0 : originResponse.data) == null ? void 0 : _a.replies) {
                const repliesFilter = filterMap[type.value];
                const replies = repliesFilter(originResponse.data.replies.slice(), list.value);
                originResponse.data.replies = replies;
              }
              return originResponse;
            }
          }
        ],
        immediate: isChecked.value
      });
      vue.watch(isChecked, (value) => {
        value ? requestHook.enable() : requestHook.disable();
      });
      function addItem(value) {
        if (value) {
          list.value.push(value);
        }
      }
      function remove(value) {
        const index = list.value.indexOf(value);
        if (index > -1) {
          list.value.splice(index, 1);
        }
      }
      return (_ctx, _cache) => {
        const _component_Switch = _sfc_main$1;
        const _component_InputWithType = __unplugin_components_1;
        const _component_FloatContainer = _sfc_main$3;
        return vue.openBlock(), vue.createBlock(_component_FloatContainer, null, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1, [
              vue.createElementVNode("div", _hoisted_2, [
                _cache[1] || (_cache[1] = vue.createElementVNode("span", { "mr-1": "" }, "激活隐藏", -1)),
                vue.createVNode(_component_Switch, {
                  modelValue: vue.unref(isChecked),
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(isChecked) ? isChecked.value = $event : null)
                }, null, 8, ["modelValue"]),
                _cache[2] || (_cache[2] = vue.createElementVNode("span", {
                  "ml-1": "",
                  "text-xs": "",
                  "text-zinc-400": ""
                }, "切换后需要刷新页面", -1))
              ]),
              vue.createElementVNode("div", _hoisted_3, [
                vue.createVNode(_component_InputWithType, {
                  "mb-1": "",
                  onAdd: addItem,
                  label: tabs[vue.unref(type)].name
                }, null, 8, ["label"]),
                vue.createElementVNode("div", _hoisted_4, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(Object.values(tabs), (tab) => {
                    return vue.openBlock(), vue.createElementBlock("div", {
                      key: tab.value,
                      class: vue.normalizeClass({ "text-stone-500": vue.unref(type) !== tab.value }),
                      "cursor-pointer": "",
                      onClick: ($event) => type.value = tab.value,
                      "transition-all": "",
                      "duration-200": ""
                    }, [
                      vue.createElementVNode("span", null, vue.toDisplayString(tab.name) + "列表", 1)
                    ], 10, _hoisted_5);
                  }), 128))
                ]),
                vue.unref(list).length > 0 ? (vue.openBlock(), vue.createElementBlock("ul", _hoisted_6, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(list), (item) => {
                    return vue.openBlock(), vue.createElementBlock("li", {
                      key: item,
                      "text-sm": "",
                      "text-zinc-500": "",
                      "list-none": "",
                      "mb-1": "",
                      flex: "",
                      "items-center": "",
                      "justify-between": "",
                      "pr-1": ""
                    }, [
                      vue.createElementVNode("span", _hoisted_7, vue.toDisplayString(item), 1),
                      vue.createElementVNode("span", {
                        "cursor-pointer": "",
                        "p-.5": "",
                        onClick: ($event) => remove(item)
                      }, "✕", 8, _hoisted_8)
                    ]);
                  }), 128))
                ])) : vue.createCommentVNode("", true),
                _cache[3] || (_cache[3] = vue.createElementVNode("div", {
                  "text-sm": "",
                  "text-zinc-500": "",
                  flex: "",
                  "justify-center": "",
                  "items-center": "",
                  "mt-30": ""
                }, "这里是空的", -1))
              ])
            ])
          ]),
          _: 1
        });
      };
    }
  });
  vue.createApp(_sfc_main).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue);
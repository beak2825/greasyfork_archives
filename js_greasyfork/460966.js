// ==UserScript==
// @name         QingFlow 开发调试工具
// @namespace    npm/vite-plugin-monkey
// @version      1.0.1
// @author       JayClock
// @description  QingFlow 开发调试工具(不上架，内部使用)
// @icon         https://vitejs.dev/logo.svg
// @match        http://localhost:4200/*
// @match        https://develop-test.oalite.com/*
// @match        https://develop-pc.oalite.com/*
// @match        https://develop.oalite.com/*
// @match        https://alpha.oalite.com/*
// @match        https://qingflow.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.global.prod.js
// @require      https://unpkg.com/vue-demi@latest/lib/index.iife.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.2.32/dist/index.full.min.js
// @require      https://cdn.jsdelivr.net/npm/@element-plus/icons-vue@2.0.10/dist/global.iife.min.js
// @resource     ElementPlus  https://cdn.jsdelivr.net/npm/element-plus@2.2.32/dist/index.css
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/460966/QingFlow%20%E5%BC%80%E5%8F%91%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/460966/QingFlow%20%E5%BC%80%E5%8F%91%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(e=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.innerText=e,document.head.appendChild(t)})(".flow-node-id[data-v-d52b3cd4]{display:flex;align-items:center;position:absolute;top:0;left:50%;transform:translate(-50%,-100%);width:max-content}.container[data-v-ee462da9]{position:fixed;bottom:100px;right:100px;cursor:pointer}");

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(vue, iconsVue, ElementPlus2) {
  "use strict";
  const style = "";
  class CallBacks {
    constructor() {
      __publicField(this, "_callbacks", []);
    }
    add(callback) {
      this._callbacks.push(callback);
    }
    get value() {
      return this._callbacks;
    }
  }
  const callbacks = new CallBacks();
  const _withScopeId = (n) => (vue.pushScopeId("data-v-d52b3cd4"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, null, -1));
  const _hoisted_2 = [
    _hoisted_1$1
  ];
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "FlowPlugin",
    setup(__props) {
      const showFlowNodeId = vue.ref(true);
      const flowNodeId = vue.ref();
      const auditNodeIdEl = vue.ref([]);
      const handleSwitchChange = (val) => {
        auditNodeIdEl.value.forEach((el) => {
          val ? el.style.display = "block" : el.style.display = "none";
        });
      };
      vue.onMounted(() => {
        const fun = (url, data) => {
          if (url.includes("auditNodes")) {
            const interval = setInterval(() => {
              Object.keys(data).forEach((key) => {
                const el = document.getElementById(key);
                if (el && data) {
                  clearInterval(interval);
                  const idEl = flowNodeId.value.cloneNode(true);
                  idEl.classList.add("flow-node-id");
                  idEl.addEventListener("click", (e) => {
                    e.stopPropagation();
                    console.log(key, data[key]);
                  });
                  const span = idEl.children[0];
                  span.textContent = key;
                  auditNodeIdEl.value.push(idEl);
                  el.appendChild(idEl);
                }
              });
            }, 200);
          }
        };
        callbacks.add(fun);
      });
      return (_ctx, _cache) => {
        const _component_el_switch = vue.resolveComponent("el-switch");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_switch, {
            modelValue: showFlowNodeId.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => showFlowNodeId.value = $event),
            change: handleSwitchChange(showFlowNodeId.value),
            "active-text": "显示节点ID",
            "inactive-text": "隐藏节点ID"
          }, null, 8, ["modelValue", "change"]),
          vue.createElementVNode("template", null, [
            vue.createElementVNode("div", {
              ref_key: "flowNodeId",
              ref: flowNodeId,
              class: "flow-node-id",
              title: "点击在控制台查看节点信息"
            }, _hoisted_2, 512)
          ])
        ], 64);
      };
    }
  });
  const FlowPlugin_vue_vue_type_style_index_0_scoped_d52b3cd4_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const FlowPlugin = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-d52b3cd4"]]);
  const _hoisted_1 = { class: "container" };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "Controller",
    setup(__props) {
      vue.onMounted(() => {
        const xhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
          var _a;
          let num = 0;
          const url = arguments[1];
          if (url.includes("socket.io")) {
            xhrOpen.apply(this, arguments);
            return;
          }
          const xhr = this;
          const getter = (_a = Object.getOwnPropertyDescriptor(
            XMLHttpRequest.prototype,
            "response"
          )) == null ? void 0 : _a.get;
          Object.defineProperty(xhr, "response", {
            get: () => {
              const res = getter == null ? void 0 : getter.apply(xhr);
              if (num === 0) {
                num += 1;
                callbacks.value.forEach((fun) => {
                  if (res) {
                    fun(url, JSON.parse(res).data);
                  }
                });
              }
              return res;
            }
          });
          xhrOpen.apply(this, arguments);
        };
      });
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_popover = vue.resolveComponent("el-popover");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createVNode(_component_el_popover, {
            placement: "top",
            width: "auto",
            trigger: "click"
          }, {
            reference: vue.withCtx(() => [
              vue.createVNode(_component_el_button, {
                icon: vue.unref(iconsVue.Setting),
                circle: "",
                type: "primary"
              }, null, 8, ["icon"])
            ]),
            default: vue.withCtx(() => [
              vue.createVNode(FlowPlugin)
            ]),
            _: 1
          })
        ]);
      };
    }
  });
  const Controller_vue_vue_type_style_index_0_scoped_ee462da9_lang = "";
  const Controller = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-ee462da9"]]);
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(Controller);
      };
    }
  });
  const cssLoader = (e) => {
    const t = GM_getResourceText(e), o = document.createElement("style");
    return o.innerText = t, document.head.append(o), t;
  };
  cssLoader("ElementPlus");
  const app = vue.createApp(_sfc_main);
  app.use(ElementPlus2);
  app.mount(
    (() => {
      const app2 = document.createElement("div");
      document.body.append(app2);
      return app2;
    })()
  );
})(Vue, ElementPlusIconsVue, ElementPlus);

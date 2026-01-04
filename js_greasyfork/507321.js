// ==UserScript==
// @name         allen-env-switch
// @namespace    allen/allen-env-switch
// @version      0.0.6
// @author       yulei@addcn.com
// @description  Switch Web Environment
// @license      MIT
// @include      *
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.3/dist/vue.global.prod.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/507321/allen-env-switch.user.js
// @updateURL https://update.greasyfork.org/scripts/507321/allen-env-switch.meta.js
// ==/UserScript==

(r=>{if(typeof GM_addStyle=="function"){GM_addStyle(r);return}const n=document.createElement("style");n.textContent=r,document.head.append(n)})(" dialog::backdrop{background:#0009}.hue[data-v-0b9826d7]{background:linear-gradient(45deg,#5fddcc,#ff004d);animation:hueRotate-0b9826d7 2s infinite alternate}@keyframes hueRotate-0b9826d7{0%{filter:hue-rotate(0deg)}to{filter:hue-rotate(360deg)}}*,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.visible{visibility:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.left-0{left:0}.right-30px{right:30px}.top-0{top:0}.top-18px{top:18px}.z-9999{z-index:9999}.grid{display:grid}.mb-2{margin-bottom:.5rem}.mb-6{margin-bottom:1.5rem}.mt-20px{margin-top:20px}.block{display:block}.h-60px{height:60px}.h-80\\%{height:80%}.h2{height:.5rem}.w-80\\%{width:80%}.w-full{width:100%}.inline-flex{display:inline-flex}.cursor-pointer{cursor:pointer}.place-items-center{place-items:center}.items-center{align-items:center}.border{border-width:1px}.border-b-2px{border-bottom-width:2px}.border-gray-300{--un-border-opacity:1;border-color:rgb(209 213 219 / var(--un-border-opacity))}.dark .dark\\:border-gray-600{--un-border-opacity:1;border-color:rgb(75 85 99 / var(--un-border-opacity))}.dark .dark\\:focus\\:border-blue-500:focus{--un-border-opacity:1;border-color:rgb(59 130 246 / var(--un-border-opacity))}.focus\\:border-blue-500:focus{--un-border-opacity:1;border-color:rgb(59 130 246 / var(--un-border-opacity))}.b-b-\\#eee{--un-border-opacity:1;--un-border-bottom-opacity:var(--un-border-opacity);border-bottom-color:rgb(238 238 238 / var(--un-border-bottom-opacity))}.rounded-10px{border-radius:10px}.rounded-lg{border-radius:.5rem}.border-none{border-style:none}.b-b-solid{border-bottom-style:solid}.bg-\\#fff{--un-bg-opacity:1;background-color:rgb(255 255 255 / var(--un-bg-opacity))}.bg-blue-700{--un-bg-opacity:1;background-color:rgb(29 78 216 / var(--un-bg-opacity))}.bg-gray-50{--un-bg-opacity:1;background-color:rgb(249 250 251 / var(--un-bg-opacity))}.dark .dark\\:bg-gray-700{--un-bg-opacity:1;background-color:rgb(55 65 81 / var(--un-bg-opacity))}.hover\\:bg-blue-800:hover{--un-bg-opacity:1;background-color:rgb(30 64 175 / var(--un-bg-opacity))}.p-2\\.5{padding:.625rem}.px-5{padding-left:1.25rem;padding-right:1.25rem}.py-2\\.5{padding-top:.625rem;padding-bottom:.625rem}.pb-10px{padding-bottom:10px}.text-center{text-align:center}.text-16px{font-size:16px}.text-22px{font-size:22px}.dark .dark\\:text-white,.text-\\#fff,.text-white{--un-text-opacity:1;color:rgb(255 255 255 / var(--un-text-opacity))}.text-gray-900{--un-text-opacity:1;color:rgb(17 24 39 / var(--un-text-opacity))}.color-\\#333{--un-text-opacity:1;color:rgb(51 51 51 / var(--un-text-opacity))}.font-medium{font-weight:500}.leading-24px{line-height:24px}.not-italic{font-style:normal}.outline-none{outline:2px solid transparent;outline-offset:2px}.focus\\:ring-4:focus{--un-ring-width:4px;--un-ring-offset-shadow:var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color);--un-ring-shadow:var(--un-ring-inset) 0 0 0 calc(var(--un-ring-width) + var(--un-ring-offset-width)) var(--un-ring-color);box-shadow:var(--un-ring-offset-shadow),var(--un-ring-shadow),var(--un-shadow)}.dark .dark\\:focus\\:ring-blue-500:focus{--un-ring-opacity:1;--un-ring-color:rgb(59 130 246 / var(--un-ring-opacity)) }.dark .dark\\:focus\\:ring-blue-900:focus{--un-ring-opacity:1;--un-ring-color:rgb(30 58 138 / var(--un-ring-opacity)) }.focus\\:ring-blue-200:focus{--un-ring-opacity:1;--un-ring-color:rgb(191 219 254 / var(--un-ring-opacity)) }.focus\\:ring-blue-500:focus{--un-ring-opacity:1;--un-ring-color:rgb(59 130 246 / var(--un-ring-opacity)) }.filter{filter:var(--un-blur) var(--un-brightness) var(--un-contrast) var(--un-drop-shadow) var(--un-grayscale) var(--un-hue-rotate) var(--un-invert) var(--un-saturate) var(--un-sepia)}.dark .dark\\:placeholder-gray-400::placeholder{--un-placeholder-opacity:1;color:rgb(156 163 175 / var(--un-placeholder-opacity))}@media (min-width: 768px){.md\\:h-45px{height:45px}.md\\:text-22px{font-size:22px}.md\\:leading-45px{line-height:45px}} ");

(function (vue) {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_log = /* @__PURE__ */ (() => typeof GM_log != "undefined" ? GM_log : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const _hoisted_1$1 = { class: "mb-6 mt-20px" };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "Settings",
    emits: ["close"],
    setup(__props, { emit: __emit }) {
      const emits = __emit;
      const domain = vue.ref(_GM_getValue("domain", ""));
      const configs = vue.ref(_GM_getValue("configs", ""));
      const dialog = vue.ref(null);
      async function save() {
        await _GM_setValue("domain", domain.value);
        await _GM_setValue("configs", configs.value);
        _unsafeWindow.alert("Saved!");
        close();
      }
      vue.onMounted(() => {
        var _a;
        const clientWidth = document.documentElement.clientWidth;
        if (clientWidth < 640) {
          _unsafeWindow.alert("Please use a larger screen to view the settings.");
          emits("close");
        } else {
          (_a = dialog.value) == null ? void 0 : _a.showModal();
        }
      });
      vue.onUnmounted(() => {
        var _a;
        (_a = dialog.value) == null ? void 0 : _a.close();
      });
      function close() {
        var _a;
        (_a = dialog.value) == null ? void 0 : _a.close();
        emits("close");
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("dialog", {
          ref_key: "dialog",
          ref: dialog,
          class: "bg-#fff w-80% h-80% border-none outline-none rounded-10px relative"
        }, [
          _cache[4] || (_cache[4] = vue.createElementVNode("h2", { class: "border-b-2px b-b-#eee b-b-solid pb-10px" }, " Switch Settings ", -1)),
          vue.createElementVNode("i", {
            class: "absolute right-30px top-18px cursor-pointer text-22px color-#333 not-italic",
            title: "关闭",
            onClick: close
          }, "ⓧ"),
          vue.createElementVNode("div", null, [
            vue.createElementVNode("div", _hoisted_1$1, [
              _cache[2] || (_cache[2] = vue.createElementVNode("label", {
                for: "domain",
                class: "block mb-2 font-medium text-gray-900 dark:text-white text-16px"
              }, "domian", -1)),
              vue.withDirectives(vue.createElementVNode("input", {
                id: "domain",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => domain.value = $event),
                type: "input",
                class: "bg-gray-50 border border-gray-300 text-gray-900 text-16px rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                placeholder: ".google.com",
                required: ""
              }, null, 512), [
                [vue.vModelText, domain.value]
              ])
            ]),
            _cache[3] || (_cache[3] = vue.createElementVNode("label", {
              for: "configs",
              class: "block mb-2 text-16px font-medium text-gray-900 dark:text-white"
            }, "Configs", -1)),
            vue.withDirectives(vue.createElementVNode("textarea", {
              id: "configs",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => configs.value = $event),
              rows: "14",
              class: "block p-2.5 w-full text-16px text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
              placeholder: "Write your configs here..."
            }, null, 512), [
              [vue.vModelText, configs.value]
            ]),
            vue.createElementVNode("button", {
              type: "button",
              class: "inline-flex items-center px-5 py-2.5 text-16px font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800 mt-20px cursor-pointer",
              onClick: save
            }, " Save ")
          ])
        ], 512);
      };
    }
  });
  const _hoisted_1 = {
    key: 0,
    class: "grid place-items-center w-full text-center fixed top-0 left-0 z-9999 text-16px h-60px leading-24px text-#fff md:h-45px md:leading-45px md:text-22px hue"
  };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "Home",
    setup(__props) {
      const gm_domain = _GM_getValue("domain", "");
      const gm_configs = _GM_getValue("configs", "");
      if (!gm_configs) {
        _GM_log("Please set the configuration first");
      }
      const domain = vue.ref(gm_domain);
      const configs = vue.ref(gm_configs ? JSON.parse(gm_configs) : []);
      const url = vue.ref("");
      const _window = _unsafeWindow;
      function shortcut(code = "Digit1", callback) {
        document.addEventListener("keydown", (event) => {
          if (event.code === code && event.altKey) {
            event.preventDefault();
            callback();
          }
        });
      }
      shortcut("Digit1", () => {
        handle("dev");
      });
      shortcut("Digit2", () => {
        handle("debug");
      });
      shortcut("Digit3", () => {
        handle("online");
      });
      const envMap = {
        dev: ".dev",
        debug: ".debug",
        online: ""
      };
      function handle(action) {
        const hostname = _window.location.hostname;
        const pathname = _window.location.pathname;
        const search = _window.location.search;
        const hosts = configs.value.filter((item2) => hostname.includes(item2.subdomain));
        const item = hosts.find((item2) => item2.action === action);
        const _protocol = (item == null ? void 0 : item.protocol) ? item == null ? void 0 : item.protocol : "https:";
        const _port = (item == null ? void 0 : item.port) ? `:${item.port}` : "";
        const _prefix = (item == null ? void 0 : item.prefix) ? item.prefix : "";
        if (item) {
          url.value = `${_protocol}//${_prefix}${item.subdomain}${item.env}${domain.value}${_port}${pathname}${search}`;
        } else if (hostname.includes(domain.value)) {
          const _env = envMap[action];
          const _subdomain = hostname.split(".")[0];
          url.value = `https://${_subdomain}${_env}${domain.value}${pathname}${search}`;
        }
        if (url.value) {
          if (url.value === _window.location.href) {
            _GM_log("The current environment is the same as the target environment");
            url.value = "";
            return;
          }
          _window.location.href = url.value;
        } else {
          _GM_log("No configuration found");
        }
      }
      const visible = vue.ref(false);
      _GM_registerMenuCommand("Settings", () => {
        visible.value = true;
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          url.value ? (vue.openBlock(), vue.createElementBlock("section", _hoisted_1, [
            vue.createElementVNode("div", null, "Switch: " + vue.toDisplayString(url.value), 1)
          ])) : vue.createCommentVNode("", true),
          visible.value ? (vue.openBlock(), vue.createBlock(_sfc_main$2, {
            key: 1,
            onClose: _cache[0] || (_cache[0] = ($event) => visible.value = false)
          })) : vue.createCommentVNode("", true)
        ], 64);
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
  const Home = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-0b9826d7"]]);
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(Home);
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
// ==UserScript==
// @name              【修复版】Javlibrary - 首页一站式影片预览
// @version           1.0.2
// @description       在 Javlibrary 首页就能直接预览影片。会缓存影片相关信息，下次可直接使用。可搜索番号或前缀。支持轻量的 torrentkitty 磁力搜索展示。
// @author            FBin001
// @namespace         FBin001-Javlibrary
// @icon              https://www.javlibrary.com/img/logo-icon.png
// @include           http*://www.javlibrary.com/cn/*
// @include           http*://www.javlibrary.com/cn/?__cf_chl_jschl_tk__*
// @require           https://unpkg.com/rectangle-transform@0.4.0/lib/rectangle-transform.min.js
// @require           https://cdn.bootcss.com/vue/2.6.10/vue.runtime.min.js
// @grant             GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/491627/%E3%80%90%E4%BF%AE%E5%A4%8D%E7%89%88%E3%80%91Javlibrary%20-%20%E9%A6%96%E9%A1%B5%E4%B8%80%E7%AB%99%E5%BC%8F%E5%BD%B1%E7%89%87%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/491627/%E3%80%90%E4%BF%AE%E5%A4%8D%E7%89%88%E3%80%91Javlibrary%20-%20%E9%A6%96%E9%A1%B5%E4%B8%80%E7%AB%99%E5%BC%8F%E5%BD%B1%E7%89%87%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function (RTListener, Vue) {
  "use strict";

  function __$styleInject(css) {
    if (!css) return;

    if (typeof window == "undefined") return;
    var style = document.createElement("style");
    style.setAttribute("media", "screen");

    style.innerHTML = css;
    document.head.appendChild(style);
    return css;
  }

  RTListener =
    RTListener && Object.prototype.hasOwnProperty.call(RTListener, "default")
      ? RTListener["default"]
      : RTListener;
  Vue =
    Vue && Object.prototype.hasOwnProperty.call(Vue, "default")
      ? Vue["default"]
      : Vue;

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script = {
    props: {
      zIndex: {
        default: 1,
      },
    },
    data() {
      return {
        show: true,
      };
    },
    mounted() {
      this.show = this.optionShow;
    },
    computed: {
      optionShow() {
        return this.$root.options.showApp;
      },
    },
  };

  function normalizeComponent(
    template,
    style,
    script,
    scopeId,
    isFunctionalTemplate,
    moduleIdentifier /* server only */,
    shadowMode,
    createInjector,
    createInjectorSSR,
    createInjectorShadow
  ) {
    if (typeof shadowMode !== "boolean") {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === "function" ? script.options : script;
    // render functions
    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true;
      // functional template
      if (isFunctionalTemplate) {
        options.functional = true;
      }
    }
    // scopedId
    if (scopeId) {
      options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
      // server build
      hook = function (context) {
        // 2.3 injection
        context =
          context || // cached call
          (this.$vnode && this.$vnode.ssrContext) || // stateful
          (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
        // 2.2 with runInNewContext: true
        if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
          context = __VUE_SSR_CONTEXT__;
        }
        // inject component styles
        if (style) {
          style.call(this, createInjectorSSR(context));
        }
        // register component module identifier for async chunk inference
        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      };
      // used by ssr in case component is cached and beforeCreate
      // never gets called
      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode
        ? function (context) {
            style.call(
              this,
              createInjectorShadow(context, this.$root.$options.shadowRoot)
            );
          }
        : function (context) {
            style.call(this, createInjector(context));
          };
    }
    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        const originalRender = options.render;
        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        const existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
    return script;
  }

  const isOldIE =
    typeof navigator !== "undefined" &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
    return (id, style) => addStyle(id, style);
  }
  let HEAD;
  const styles = {};
  function addStyle(id, css) {
    const group = isOldIE ? css.media || "default" : id;
    const style =
      styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
      style.ids.add(id);
      let code = css.source;
      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += "\n/*# sourceURL=" + css.map.sources[0] + " */";
        // http://stackoverflow.com/a/26603875
        code +=
          "\n/*# sourceMappingURL=data:application/json;base64," +
          btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
          " */";
      }
      if (!style.element) {
        style.element = document.createElement("style");
        style.element.type = "text/css";
        if (css.media) style.element.setAttribute("media", css.media);
        if (HEAD === undefined) {
          HEAD = document.head || document.getElementsByTagName("head")[0];
        }
        HEAD.appendChild(style.element);
      }
      if ("styleSheet" in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles
          .filter(Boolean)
          .join("\n");
      } else {
        const index = style.ids.size - 1;
        const textNode = document.createTextNode(code);
        const nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);
        else style.element.appendChild(textNode);
      }
    }
  }

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "ti-container", style: { zIndex: _vm.zIndex } },
      [
        _c(
          "div",
          {
            staticClass: "toggle",
            class: _vm.show ? "to-hide" : "to-show",
            on: {
              click: function ($event) {
                _vm.show = !_vm.show;
              },
            },
          },
          [_c("i", { staticClass: "ti-toggle" })]
        ),
        _vm._v(" "),
        _vm.show
          ? _c("div", { staticClass: "main" }, [_vm._t("default")], 2)
          : _vm._e(),
      ]
    );
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return;
    inject("data-v-4a206468_0", {
      source:
        ".ti-container[data-v-4a206468] {\n  position: fixed;\n  left: 0;\n  top: 0;\n}\n.ti-container .toggle[data-v-4a206468] {\n  position: absolute;\n  left: -20px;\n  top: -20px;\n  width: 40px;\n  height: 40px;\n  border-bottom-right-radius: 20px;\n  background-color: #ee4dba;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 10;\n}\n.ti-container .toggle.to-show[data-v-4a206468] {\n  animation: 1.5s A-data-v-4a206468 infinite;\n}\n.ti-container .toggle .ti-toggle[data-v-4a206468] {\n  font-size: 13px;\n  width: 1em;\n  height: 1em;\n  border: 2px solid #fff;\n  display: inline-block;\n  transition: 0.5s all;\n  border-right: 0;\n  border-bottom: 0;\n}\n.ti-container .toggle.to-show .ti-toggle[data-v-4a206468] {\n  transform: rotate(180deg);\n}\n@keyframes A-data-v-4a206468 {\n50% {\n    transform: scale(1.4, 1.4);\n}\n}\n.ti-container .toggle[data-v-4a206468]:hover {\n  left: 0;\n  top: 0;\n}\n.ti-container .main[data-v-4a206468] {\n  background-color: #000000cb;\n}\n",
      map: {
        version: 3,
        sources: [
          "container.vue",
          "D:\\p\\_tampermonkey\\javlib-preview-userscript\\src\\components\\container.vue",
        ],
        names: [],
        mappings:
          "AAAA;EACE,eAAe;EACf,OAAO;EACP,MAAM;AACR;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,UAAU;EACV,WAAW;EACX,YAAY;EACZ,gCAAgC;EAChC,yBAAyB;EACzB,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,WAAW;AACb;AACA;EACE,0CAA0B;AAC5B;AACA;EACE,eAAe;EACf,UAAU;EACV,WAAW;EACX,sBAAsB;EACtB,qBAAqB;EACrB,oBAAoB;EACpB,eAAe;EACf,gBAAgB;AAClB;AACA;EACE,yBAAyB;AAC3B;AACA;ACCA;IACA,0BAAA;AACA;AACA;AACA;EACA,OAAA;EACA,MAAA;AACA;AACA;EACA,2BAAA;AACA",
        file: "container.vue",
        sourcesContent: [
          ".ti-container {\n  position: fixed;\n  left: 0;\n  top: 0;\n}\n.ti-container .toggle {\n  position: absolute;\n  left: -20px;\n  top: -20px;\n  width: 40px;\n  height: 40px;\n  border-bottom-right-radius: 20px;\n  background-color: #ee4dba;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 10;\n}\n.ti-container .toggle.to-show {\n  animation: 1.5s A infinite;\n}\n.ti-container .toggle .ti-toggle {\n  font-size: 13px;\n  width: 1em;\n  height: 1em;\n  border: 2px solid #fff;\n  display: inline-block;\n  transition: 0.5s all;\n  border-right: 0;\n  border-bottom: 0;\n}\n.ti-container .toggle.to-show .ti-toggle {\n  transform: rotate(180deg);\n}\n@keyframes A {\n  50% {\n    transform: scale(1.4, 1.4);\n  }\n}\n.ti-container .toggle:hover {\n  left: 0;\n  top: 0;\n}\n.ti-container .main {\n  background-color: #000000cb;\n}\n",
          '<template>\r\n  <div class="ti-container" :style="{zIndex}">\r\n    <div class="toggle"  :class="show ? \'to-hide\' : \'to-show\'" @click="show = !show">\r\n      <i class="ti-toggle"></i>\r\n    </div>\r\n    <div class="main" v-if="show">\r\n      <slot></slot>\r\n    </div>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nexport default {\r\n  props: {\r\n    zIndex: {\r\n      default: 1\r\n    }\r\n  },\r\n  data () {\r\n    return {\r\n      show: true\r\n    }\r\n  },\r\n  mounted () {\r\n    this.show = this.optionShow\r\n  },\r\n  computed: {\r\n    optionShow () {\r\n      return this.$root.options.showApp\r\n    }\r\n  }\r\n}\r\n</script>\r\n\r\n<style scoped lang="less">\r\n.ti-container\r\n{\r\n  position: fixed;\r\n  left: 0;\r\n  top: 0;\r\n}\r\n.ti-container .toggle\r\n{\r\n  @size: 40px;\r\n  @half: @size / 2;\r\n  position: absolute;\r\n  left: -@half;\r\n  top: -@half;\r\n  width: @size;\r\n  height: @size;    \r\n  border-bottom-right-radius: @half;\r\n  background-color: #ee4dba;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  z-index: 10;\r\n  &.to-show {\r\n    animation: 1.5s A infinite;\r\n  }\r\n\r\n  .ti-toggle {\r\n    font-size: 13px;\r\n    width: 1em;\r\n    height: 1em;\r\n    border: 2px solid #fff;\r\n    display: inline-block;\r\n    transition: .5s all;\r\n    border-right: 0;\r\n    border-bottom: 0;\r\n  }\r\n  &.to-show .ti-toggle {\r\n    transform: rotate(180deg);\r\n  }\r\n}\r\n\r\n@keyframes A {\r\n  50% {\r\n    transform: scale(1.4, 1.4);\r\n  }\r\n}\r\n\r\n.ti-container .toggle:hover\r\n{\r\n  left: 0;\r\n  top: 0;\r\n}\r\n.ti-container .main\r\n{\r\n  background-color: #000000cb;\r\n}\r\n\r\n</style>\r\n',
        ],
      },
      media: undefined,
    });
  };
  /* scoped */
  const __vue_scope_id__ = "data-v-4a206468";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */

  /* style inject shadow dom */

  const __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

  //
  var script$1 = {
    props: {
      src: {
        default: "",
      },
    },
    data() {
      return {
        bounding: {
          left: window.screen.availWidth - 838,
          top: window.screen.availHeight - 550,
          width: 838,
          height: 550,
        },
      };
    },
    computed: {
      styles() {
        return Object.keys(this.bounding).reduce((s, k) => {
          s[k] = this.bounding[k] + "px";
          return s;
        }, {});
      },
    },
    methods: {
      onload(ev) {
        console.log("load");
        const doc = ev.target.contentDocument;
        const devStyle = doc.createElement("style");
        devStyle.innerHTML = `
        /*# .vue */
        #video_jacket_img {
          width: 100%;
          height: 100%;
        }
        #leftmenu, #toplogo, #topmenu {
          display: none;
        }
        #rightcolumn {
          margin: 0px 10px 10px 0px;
        }
      `;
        doc.head.appendChild(devStyle);
      },
      transform(ev, control) {
        RTListener(
          ev,
          {
            control,
            target: this.bounding,
            animationFrameUpdate: true,
          },
          ({ target }) => {
            this.bounding = target;
          }
        );
      },
    },
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.src,
            expression: "src",
          },
        ],
        staticClass: "tm-jav-window",
        style: _vm.styles,
      },
      [
        _c(
          "div",
          {
            staticClass: "tm-jav-window--header",
            on: {
              mousedown: function ($event) {
                return _vm.transform($event, "xy");
              },
            },
          },
          [
            _c("span", [_vm._v("可拖拽，右下可缩放")]),
            _vm._v(" "),
            _c("i", {
              staticClass: "tm-jav--close",
              on: {
                click: function ($event) {
                  return _vm.$emit("close");
                },
              },
            }),
          ]
        ),
        _vm._v(" "),
        _vm.src
          ? _c("iframe", {
              ref: "iframe",
              attrs: { src: _vm.src, frameborder: "0" },
              on: { load: _vm.onload },
            })
          : _vm._e(),
        _vm._v(" "),
        _c("i", {
          staticClass: "tm-jav-window--resize",
          on: {
            mousedown: function ($event) {
              return _vm.transform($event, "rb");
            },
          },
        }),
      ]
    );
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return;
    inject("data-v-69547121_0", {
      source:
        ".tm-jav-window[data-v-69547121] {\n  position: fixed;\n  z-index: 100;\n  background: #fff;\n  box-shadow: 0px -2px 9px 4px rgba(0, 0, 0, 0.35);\n}\n.tm-jav-window iframe[data-v-69547121] {\n  width: 100%;\n  height: 100%;\n}\n.tm-jav-window--header[data-v-69547121] {\n  position: relative;\n  height: 20px;\n  background-color: #ddd;\n  cursor: move;\n  padding-left: 10px;\n  color: #888;\n}\n.tm-jav-window--header .tm-jav--close[data-v-69547121] {\n  position: absolute;\n  right: 10px;\n  font-size: 18px;\n  background: transparent;\n  cursor: pointer;\n}\n.tm-jav-window--resize[data-v-69547121] {\n  position: absolute;\n  right: 0;\n  bottom: -20px;\n  border: 8px solid #888;\n  cursor: nw-resize;\n  border-top-color: transparent;\n  border-left-color: transparent;\n}\n.tm-jav-window--resize[data-v-69547121]:hover {\n  border-right-color: #ccc;\n  border-bottom-color: #ccc;\n}\n",
      map: {
        version: 3,
        sources: ["window.vue"],
        names: [],
        mappings:
          "AAAA;EACE,eAAe;EACf,YAAY;EACZ,gBAAgB;EAChB,gDAAgD;AAClD;AACA;EACE,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,YAAY;EACZ,sBAAsB;EACtB,YAAY;EACZ,kBAAkB;EAClB,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,eAAe;EACf,uBAAuB;EACvB,eAAe;AACjB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,aAAa;EACb,sBAAsB;EACtB,iBAAiB;EACjB,6BAA6B;EAC7B,8BAA8B;AAChC;AACA;EACE,wBAAwB;EACxB,yBAAyB;AAC3B",
        file: "window.vue",
        sourcesContent: [
          ".tm-jav-window {\n  position: fixed;\n  z-index: 100;\n  background: #fff;\n  box-shadow: 0px -2px 9px 4px rgba(0, 0, 0, 0.35);\n}\n.tm-jav-window iframe {\n  width: 100%;\n  height: 100%;\n}\n.tm-jav-window--header {\n  position: relative;\n  height: 20px;\n  background-color: #ddd;\n  cursor: move;\n  padding-left: 10px;\n  color: #888;\n}\n.tm-jav-window--header .tm-jav--close {\n  position: absolute;\n  right: 10px;\n  font-size: 18px;\n  background: transparent;\n  cursor: pointer;\n}\n.tm-jav-window--resize {\n  position: absolute;\n  right: 0;\n  bottom: -20px;\n  border: 8px solid #888;\n  cursor: nw-resize;\n  border-top-color: transparent;\n  border-left-color: transparent;\n}\n.tm-jav-window--resize:hover {\n  border-right-color: #ccc;\n  border-bottom-color: #ccc;\n}\n",
        ],
      },
      media: undefined,
    });
  };
  /* scoped */
  const __vue_scope_id__$1 = "data-v-69547121";
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */

  /* style inject shadow dom */

  const __vue_component__$1 = normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    createInjector,
    undefined,
    undefined
  );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$2 = {
    props: {
      video: {
        type: Object,
        default: null,
      },
    },
    methods: {
      showPreview() {
        this.$emit("show-preview");
      },
    },
  };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "tm-jav-item" }, [
      _c("div", { staticClass: "tm-jav-item--inner" }, [
        _c("img", {
          staticClass: "tm-jav-item--cover",
          attrs: { src: _vm.video.image, alt: _vm.video.title, width: "100%" },
        }),
        _vm._v(" "),
        _c("div", { staticClass: "play-btn", on: { click: _vm.showPreview } }),
        _vm._v(" "),
        _c("div", { staticClass: "tm-jav-item--info" }, [
          _c("span", { staticClass: "tm-jav-item--avid" }, [
            _vm._v(_vm._s(_vm.video.avid)),
          ]),
          _vm._v(" "),
          _c(
            "a",
            {
              staticClass: "tm-jav-item--title",
              attrs: {
                target: "_blank",
                href: _vm.video.href,
                title: _vm.video.title,
              },
            },
            [_vm._v(_vm._s(_vm.video.title))]
          ),
        ]),
      ]),
    ]);
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return;
    inject("data-v-54e5faad_0", {
      source:
        ".tm-jav-item[data-v-54e5faad] {\n  min-height: 200px;\n  min-width: 147px;\n  padding: 8px;\n  display: inline-block;\n  overflow: hidden;\n  position: relative;\n}\n.tm-jav-item--cover[data-v-54e5faad] {\n  max-height: 200px;\n  max-height: 300px;\n  object-fit: cover;\n}\n.tm-jav-item--inner[data-v-54e5faad] {\n  width: 100%;\n  height: 100%;\n  position: relative;\n}\n.tm-jav-item--info[data-v-54e5faad] {\n  color: #fff;\n  text-shadow: 1px 1px 2px black;\n  transition: all 0.5s;\n  position: absolute;\n  z-index: 1;\n  left: 0;\n  top: 70%;\n  height: 30%;\n  display: block;\n  background-color: rgba(32, 32, 32, 0.3);\n  width: 100%;\n  overflow: hidden;\n}\n.tm-jav-item--title[data-v-54e5faad] {\n  color: #fff;\n}\n.tm-jav-item .play-btn[data-v-54e5faad] {\n  transition: all 0.5s;\n  position: absolute;\n  bottom: 30%;\n  left: 0px;\n  width: 1em;\n  height: 1em;\n  border-radius: 1em;\n  font-size: 30px;\n  cursor: pointer;\n  z-index: 2;\n  background-color: rgba(32, 32, 32, 0.3);\n}\n.tm-jav-item .play-btn[data-v-54e5faad]::before {\n  content: '';\n  position: absolute;\n  left: 0.1em;\n  top: 0.1em;\n  width: 0.8em;\n  height: 0.8em;\n  border-radius: 0.8em;\n  border-width: 2px;\n  border-style: solid;\n  border-color: white;\n  border-image: initial;\n  box-sizing: border-box;\n}\n.tm-jav-item .play-btn[data-v-54e5faad]::after {\n  border-width: 0.3em 0 0.3em 0.4em;\n  top: 0.2em;\n  left: 0.35em;\n  content: \"\";\n  position: absolute;\n  border-style: solid;\n  border-color: transparent white;\n  border-image: initial;\n}\n.tm-jav-item .play-btn[data-v-54e5faad]:hover::before {\n  border-color: #ffa04c;\n}\n.tm-jav-item .play-btn[data-v-54e5faad]:hover::after {\n  border-color: transparent #ffa04c;\n}\n.tm-jav-item:hover .play-btn[data-v-54e5faad] {\n  bottom: 4px;\n}\n.tm-jav-item:hover .tm-jav-item[data-v-54e5faad] {\n  box-shadow: rgba(45, 45, 45, 0.05) 0px 2px 2px 0px rgba(42, 42, 42, 0.05) 0px 8px 8px 0px, rgba(32, 32, 32, 0.05) 0px 16px 16px 0px, rgba(49, 49, 49, 0.05) 0px 32px 32px 0px, rgba(35, 35, 35, 0.05) 0px 64px 64px 0px;\n}\n.tm-jav-item:hover .tm-jav-item--inner[data-v-54e5faad] {\n  transform: scale(1.08);\n  transform-origin: center center;\n}\n.tm-jav-item:hover .tm-jav-item--cover[data-v-54e5faad] {\n  filter: blur(2px);\n}\n.tm-jav-item:hover .tm-jav-item--info[data-v-54e5faad] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n}\n",
      map: {
        version: 3,
        sources: [
          "item.vue",
          "D:\\p\\_tampermonkey\\javlib-preview-userscript\\src\\components\\item.vue",
        ],
        names: [],
        mappings:
          "AAAA;EACE,iBAAiB;EACjB,gBAAgB;EAChB,YAAY;EACZ,qBAAqB;EACrB,gBAAgB;EAChB,kBAAkB;AACpB;AACA;EACE,iBAAiB;EACjB,iBAAiB;EACjB,iBAAiB;AACnB;AACA;EACE,WAAW;EACX,YAAY;EACZ,kBAAkB;AACpB;AACA;EACE,WAAW;EACX,8BAA8B;EAC9B,oBAAoB;EACpB,kBAAkB;EAClB,UAAU;EACV,OAAO;EACP,QAAQ;EACR,WAAW;EACX,cAAc;EACd,uCAAuC;EACvC,WAAW;ECCb,gBAAA;AACA;AACA;EACA,WAAA;AACA;AACA;EACA,oBAAA;EDCE,kBAAkB;ECCpB,WAAA;EACA,SAAA;EACA,UAAA;EACA,WAAA;EACA,kBAAA;EDCE,eAAe;ECCjB,eAAA;EACA,UAAA;EACA,uCAAA;AACA;AACA;EDCE,WAAW;ECCb,kBAAA;EACA,WAAA;EACA,UAAA;EACA,YAAA;EACA,aAAA;EACA,oBAAA;EACA,iBAAA;EACA,mBAAA;EACA,mBAAA;EACA,qBAAA;EACA,sBAAA;AACA;AACA;EACA,iCAAA;EDCE,UAAU;ECCZ,YAAA;EACA,WAAA;EACA,kBAAA;EACA,mBAAA;EACA,+BAAA;EACA,qBAAA;AACA;AACA;EACA,qBAAA;AACA;AACA;EACA,iCAAA;AACA;AACA;EACA,WAAA;ADCA;ACCA;EACA,uNAAA;AACA;AACA;EACA,sBAAA;EACA,+BAAA;AACA;AACA;EACA,iBAAA;AACA;AACA;EACA,kBAAA;EACA,MAAA;EACA,OAAA;EACA,YAAA;AACA",
        file: "item.vue",
        sourcesContent: [
          ".tm-jav-item {\n  min-height: 200px;\n  min-width: 147px;\n  padding: 8px;\n  display: inline-block;\n  overflow: hidden;\n  position: relative;\n}\n.tm-jav-item--cover {\n  max-height: 200px;\n  max-height: 300px;\n  object-fit: cover;\n}\n.tm-jav-item--inner {\n  width: 100%;\n  height: 100%;\n  position: relative;\n}\n.tm-jav-item--info {\n  color: #fff;\n  text-shadow: 1px 1px 2px black;\n  transition: all 0.5s;\n  position: absolute;\n  z-index: 1;\n  left: 0;\n  top: 70%;\n  height: 30%;\n  display: block;\n  background-color: rgba(32, 32, 32, 0.3);\n  width: 100%;\n  overflow: hidden;\n}\n.tm-jav-item--title {\n  color: #fff;\n}\n.tm-jav-item .play-btn {\n  transition: all 0.5s;\n  position: absolute;\n  bottom: 30%;\n  left: 0px;\n  width: 1em;\n  height: 1em;\n  border-radius: 1em;\n  font-size: 30px;\n  cursor: pointer;\n  z-index: 2;\n  background-color: rgba(32, 32, 32, 0.3);\n}\n.tm-jav-item .play-btn::before {\n  content: '';\n  position: absolute;\n  left: 0.1em;\n  top: 0.1em;\n  width: 0.8em;\n  height: 0.8em;\n  border-radius: 0.8em;\n  border-width: 2px;\n  border-style: solid;\n  border-color: white;\n  border-image: initial;\n  box-sizing: border-box;\n}\n.tm-jav-item .play-btn::after {\n  border-width: 0.3em 0 0.3em 0.4em;\n  top: 0.2em;\n  left: 0.35em;\n  content: \"\";\n  position: absolute;\n  border-style: solid;\n  border-color: transparent white;\n  border-image: initial;\n}\n.tm-jav-item .play-btn:hover::before {\n  border-color: #ffa04c;\n}\n.tm-jav-item .play-btn:hover::after {\n  border-color: transparent #ffa04c;\n}\n.tm-jav-item:hover .play-btn {\n  bottom: 4px;\n}\n.tm-jav-item:hover .tm-jav-item {\n  box-shadow: rgba(45, 45, 45, 0.05) 0px 2px 2px 0px rgba(42, 42, 42, 0.05) 0px 8px 8px 0px, rgba(32, 32, 32, 0.05) 0px 16px 16px 0px, rgba(49, 49, 49, 0.05) 0px 32px 32px 0px, rgba(35, 35, 35, 0.05) 0px 64px 64px 0px;\n}\n.tm-jav-item:hover .tm-jav-item--inner {\n  transform: scale(1.08);\n  transform-origin: center center;\n}\n.tm-jav-item:hover .tm-jav-item--cover {\n  filter: blur(2px);\n}\n.tm-jav-item:hover .tm-jav-item--info {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n}\n",
          '<template>\r\n  <div class="tm-jav-item">\r\n    <div class="tm-jav-item--inner">\r\n      <img class="tm-jav-item--cover" :src="video.image" :alt="video.title" width="100%">\r\n      <div class="play-btn" @click="showPreview"></div>\r\n      <div class="tm-jav-item--info">\r\n        <span class="tm-jav-item--avid">{{video.avid}}</span>\r\n        <a class="tm-jav-item--title" target="_blank" :href="video.href" :title="video.title">{{video.title}}</a>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nexport default {\r\n  props: {\r\n    video: {\r\n      type: Object,\r\n      default: null\r\n    }\r\n  },\r\n  methods: {\r\n    showPreview () {\r\n      this.$emit(\'show-preview\')\r\n    }\r\n  }\r\n}\r\n</script>\r\n\r\n<style scoped lang="less">\r\n.tm-jav-item {\r\n  min-height: 200px;\r\n  min-width: 147px;\r\n  padding: 8px;\r\n  display: inline-block;\r\n  overflow: hidden;\r\n  position: relative;\r\n\r\n  &--cover {\r\n    max-height: 200px;\r\n    max-height: 300px;\r\n    object-fit: cover;\r\n  }\r\n\r\n  &--inner {\r\n    width: 100%;\r\n    height: 100%;\r\n    position: relative;\r\n  }\r\n\r\n  &--info {\r\n    color: #fff;\r\n    text-shadow: 1px 1px 2px black;\r\n    transition: all 0.5s;\r\n    position: absolute;\r\n    z-index: 1;\r\n    left: 0;\r\n    top: 70%;\r\n    height: 30%;\r\n    display: block;\r\n    background-color: rgba(32, 32, 32, 0.3);\r\n    width: 100%;\r\n    overflow: hidden;\r\n  }\r\n\r\n  &--title {\r\n    color: #fff;\r\n  }\r\n  .play-btn {\r\n    transition: all 0.5s;\r\n    position: absolute;\r\n    bottom: 30%;\r\n    left: 0px;\r\n    width: 1em;\r\n    height: 1em;\r\n    border-radius: 1em;\r\n    font-size: 30px;\r\n    cursor: pointer;\r\n    z-index: 2;\r\n    background-color: rgba(32, 32, 32, 0.3);\r\n\r\n    &::before {\r\n      content: \'\';\r\n      position: absolute;\r\n      left: 0.1em;\r\n      top: 0.1em;\r\n      width: 0.8em;\r\n      height: .8em;\r\n      border-radius: 0.8em;\r\n      border-width: 2px;\r\n      border-style: solid;\r\n      border-color: white;\r\n      border-image: initial;\r\n      box-sizing: border-box;\r\n    }\r\n    &::after {\r\n      border-width: .3em 0 .3em .4em;\r\n      top: .2em;\r\n      left: .35em;\r\n      content: "";\r\n      position: absolute;\r\n      border-style: solid;\r\n      border-color: transparent white;\r\n      border-image: initial;\r\n    }\r\n    &:hover{\r\n      &::before {\r\n        border-color: #ffa04c;\r\n      }\r\n      &::after {\r\n        border-color: transparent #ffa04c;\r\n      }\r\n    }\r\n  }\r\n\r\n  &:hover .play-btn {\r\n    bottom: 4px;\r\n  }\r\n\r\n  &:hover & {\r\n    box-shadow: rgba(45, 45, 45, 0.05) 0px 2px 2px 0px\r\n    rgba(42, 42, 42, 0.05) 0px 8px 8px 0px, \r\n    rgba(32, 32, 32, 0.05) 0px 16px 16px 0px,\r\n    rgba(49, 49, 49, 0.05) 0px 32px 32px 0px,\r\n    rgba(35, 35, 35, 0.05) 0px 64px 64px 0px;\r\n\r\n    &--inner {\r\n      transform: scale(1.08);\r\n      transform-origin: center center;\r\n    }\r\n    &--cover {\r\n      filter: blur(2px);\r\n    }\r\n    &--info { \r\n      position: absolute;\r\n      top: 0;\r\n      left: 0;\r\n      height: 100%;\r\n    }\r\n  }\r\n\r\n}\r\n</style>',
        ],
      },
      media: undefined,
    });
  };
  /* scoped */
  const __vue_scope_id__$2 = "data-v-54e5faad";
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */

  /* style inject shadow dom */

  const __vue_component__$2 = normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    false,
    createInjector,
    undefined,
    undefined
  );

  /**
   * 确保 ref 元素已经挂载
   *
   * @param {Vue} vm
   * @param {string} ref
   * @param {number} timeout
   */

  function throttle(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }

  function remove(arr, item) {
    if (arr.length) {
      const index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1);
      }
    }
  }

  function createLRUCache(LRUStore) {
    return function LRUCache(key, content = null) {
      const { keys, cache, max } = LRUStore;
      function pushKey() {
        remove(keys, key);
        keys.push(key);
      }
      if (content) {
        cache[key] = content;
        pushKey();
        if (max && keys.length > parseInt(max)) {
          const first = keys[0];
          cache[first] = null;
          remove(keys, first);
        }
      } else {
        pushKey();
        return cache[key];
      }
    };
  }

  function similarity(s1, s2, split = false) {
    function editDistance(s1, s2) {
      s1 = s1.toLowerCase();
      s2 = s2.toLowerCase();

      const costs = new Array();
      for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
          if (i === 0) {
            costs[j] = j;
          } else {
            if (j > 0) {
              var newValue = costs[j - 1];
              if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
                newValue =
                  Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
              }
              costs[j - 1] = lastValue;
              lastValue = newValue;
            }
          }
        }
        if (i > 0) {
          costs[s2.length] = lastValue;
        }
      }
      return costs[s2.length];
    }

    function doSplitMode(s1, s2) {
      let split1 = s1.split(" ");
      let split2 = s2.split(" ");
      let sum = 0;
      let max = 0;
      let temp = 0;
      for (let i = 0; i < split1.length; i++) {
        max = 0;
        for (let j = 0; j < split2.length; j++) {
          temp = genSimilarity(split1[i], split2[j]);
          if (max < temp) {
            max = temp;
          }
        }
        sum += max / split1.length;
      }
      return sum;
    }
    function genSimilarity(s1, s2) {
      let longer = s1;
      let shorter = s2;
      if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
      }
      const longerLength = longer.length;
      if (longerLength == 0) {
        return 1.0;
      }
      return (
        (longerLength - editDistance(longer, shorter)) /
        parseFloat(longerLength)
      );
    }

    if (split) {
      return doSplitMode(s1, s2);
    } else {
      return genSimilarity(s1, s2);
    }
  }

  function toMap(arr, key = "id") {
    return arr.reduce((r, c) => {
      if (c[key]) {
        r[c[key]] = c;
      }
      return r;
    }, {});
  }

  function isPlainObject(val) {
    return Object.prototype.toString.call(val) === "[object Object]";
  }

  function parseHtml(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc;
  }

  function fix503(src) {
    let iframe = document.createElement("iframe");
    const timeout = 6000;
    const now = Date.now();
    return new Promise(function (resolve, reject) {
      function remove() {
        if (iframe) {
          document.body.removeChild(iframe);
          iframe = null;
        }
      }
      iframe.onload = (e) => {
        requestAnimationFrame(function check() {
          if (
            Date.now() - now > timeout ||
            (iframe && iframe.contentWindow.document.querySelector("#toplogo"))
          ) {
            remove();
            console.log("iframe:loaded");
            resolve(true);
          } else {
            requestAnimationFrame(check);
          }
        });
      };
      iframe.onerror = (e) => {
        remove();
        console.log("iframe:onerror", e);
        reject(false);
      };
      setTimeout(iframe.onerror, timeout, "timeout");
      iframe.style =
        "width:600px;height:400px;position:fixed;left: -999999999px;top: 0;z-index: 100";
      document.body.insertBefore(iframe, document.body.firstChild);
      iframe.src = src;
    });
  }

  function get(url, options = {}) {
    return new Promise(function (resolve, reject) {
      GM_xmlhttpRequest({
        url,
        method: "GET",
        ...options,
        onload: (e) => {
          if (e.status === 200) {
            resolve(e);
          } else {
            console.log("reject", e.status);
            reject(e);
          }
        },
        onerror: (e) => {
          reject(e);
        },
      });
    }).catch((e) => {
      if (e.status === 503) {
        return fix503(url).then(() => get(url, options));
      }
      return Promise.reject(e);
    });
  }

  function getHTML(url, options = { parse: true }) {
    const { parse } = options;
    let request = get(url, { responseType: "text" }).then(
      (r) => r.responseText,
      (e) => Promise.reject(e)
    );

    if (parse) {
      return request.then(
        (html) => {
          return parseHtml(html);
        },
        (e) => {
          return Promise.reject(e);
        }
      );
    }

    return request;
  }

  function post(url, data = {}, options = {}) {
    return new Promise(function (resolve, reject) {
      GM_xmlhttpRequest({
        url,
        method: "POST",
        data,
        responseType: "json",
        ...options,
        onload: (e) => {
          if (e.status === 200) {
            resolve(e);
          } else {
            reject(e);
          }
        },
        onerror: (e) => {
          reject(e);
        },
      });
    });
  }

  var Http = {
    install(Vue) {
      Vue.prototype.$getHTML = getHTML;
      Vue.prototype.$get = get;
    },
  };

  const map = {
    star: {
      url: "/ajax/ajax_favoriteadd_star.php",
      type: 4,
    },
  };

  function addFav(id, _type) {
    const { url, type } = map[_type];
    return post(url, { id, type }).then((res) => {
      console.log(res.response);
      if (res.response.ERROR === -1) {
        return Promise.reject("already fav");
      }
      return res.response;
    });
  }

  function fillListUrl(id, type) {
    const fChar = type[0];
    const url = `vl_${type}.php?${fChar}=${id}`;
    return url;
  }

  const ListCacheStore = {
    keys: [],
    cache: {},
    max: 10,
  };

  const ListLRUCache = createLRUCache(ListCacheStore);

  const logVue = new Vue({
    data: {
      logs: [],
    },
  });
  function log(task) {
    let startTime = Date.now();
    function getPassTime() {
      const currTime = Date.now();
      const pass = currTime - startTime;
      return pass;
    }

    const logTask = {
      name: task,
      logs: [],
      finished: false,
      status: "",
    };
    logVue.logs.push(logTask);
    logVue.$emit("log-task", logTask);

    function logStep(status, msg, name) {
      logTask.logs.push({ name, msg, status, after: getPassTime() });
      console.log(`[${name}][${status}]:${msg}`);
    }

    return {
      msg(msg) {
        logStep("default", msg);
      },
      success(...args) {
        logStep("success", ...args);
      },
      fail(...args) {
        logStep("fail", ...args);
      },
      end(status) {
        logTask.finished = true;
        logTask.status = status;
        logStep(
          "finished",
          "任务" + (status === "success" ? "成功" : "失败"),
          task
        );
      },
    };
  }

  function parseStep(step) {
    const fns = [];
    const objs = [];
    const strs = [];
    for (const item of step) {
      if (typeof item === "function" || item instanceof Promise) {
        fns.push(item);
      }
      if (typeof item === "string") {
        strs.push(item);
      }
      if (isPlainObject(item)) {
        objs.push(item);
      }
    }
    const [exec] = fns;
    const [options] = objs;
    const [name = "操作", resolve = "next", reject = "exit"] = strs;

    return {
      name,
      exec,
      options,
      resolve,
      reject,
    };
  }

  async function runTask(taskName, ...steps) {
    const logTask = log(taskName);
    let finishedStatus = "fail";
    let result;
    if (isPlainObject(steps[0])) {
      result = steps[0];
      steps.shift();
    }
    // console.group(taskName);
    // console.log('output->runTask',taskName, steps);
    while (steps.length) {
      const step = steps.shift();
      const { name, exec, resolve, reject } = parseStep(step);

      try {
        logTask.msg(`开始执行步骤: ${name} ${exec?.constructor}`,);
        // console.log('output->while',name, exec?.constructor);
        const promise =
          exec instanceof Promise
            ? exec
            : isPlainObject(exec)
            ? Promise.resolve(exec)
            : exec(result, logTask);
        result = await promise;
        // console.log('output->while-result',name, result);
        // logTask.success(name+"--执行成功！",result);
        if (resolve === "pass") {
          logTask.end("success");
          return Promise.resolve(result);
        }
        // next
        finishedStatus = "success";
      } catch (e) {
        logTask.fail(e.status || e.message || "执行失败! ", name);
        if (reject === "exit") {
          logTask.end("fail");
          return Promise.reject(e);
        }
        result = e;
        finishedStatus = "fail";
        // next
      }
    }
    console.groupEnd();
    logTask.end(finishedStatus);
    return finishedStatus === "success"
      ? Promise.resolve(result)
      : Promise.reject(result);
  }

  function queryVideoList(href) {
    function firstStep() {
      const requestPromise =
        location.pathname === href ? Promise.resolve(document) : getHTML(href);
      return requestPromise;
    }

    return runTask(
      "查询列表信息",
      ["加载 HTML", firstStep],
      ["解析切页信息", parseNextPage],
      ["解析列表信息", parseList]
    ).catch((e) => {
      return Promise.reject(e);
    });
  }

  function genDefaultPages() {
    return {
      show: false,
      inLast: false,
      length: 0,
      curr: 1,
      list: [],
      last: 0,
      next: 0,
    };
  }

  function parseNextPage(doc) {
    const pageSelector = doc.querySelector(".page_selector");
    let defaultPages = genDefaultPages();
    if (pageSelector && pageSelector.children) {
      defaultPages = [...pageSelector.children].reduce((pages, page) => {
        const { className, innerHTML: p } = page;
        if (/^page(\scurrent|$)/.test(className)) {
          pages.list.push(p);
          if (className === "page current") {
            pages.curr = p;
          }
          pages.length++;
        }
        if (className === "page last") {
          pages.last = page.href && page.href.replace(/.*?page=/, "");
        }
        if (className === "page next") {
          pages.next = page.href && page.href.replace(/.*?page=/, "");
        }
        return pages;
      }, defaultPages);
    }
    defaultPages.inLast = defaultPages.curr === defaultPages.last;
    return { doc, pages: defaultPages };
  }

  const videoReg =
    /<div class="video".*?<a\shref="(.*?)".*?<div\sclass="id">(.*?)<.*?src="(.*?)".*?class="title.*?>(.*?)<\/div/;
  function parseList(payload) {
    const { doc } = payload;
    const list = [...doc.querySelectorAll(".video")].map((vEl) => {
      let video = vEl.outerHTML.match(videoReg);
      if (!video) {
        const aTag = vEl.querySelector(".post-headline")
        if (aTag) {
          video = [
            '',
            aTag.href,
            aTag.querySelector(".id").innerText,
            aTag.querySelector("img").src,
            aTag.querySelector(".post_title").innerText.replace(/[\n]/g,"")
          ]
        }
      }
      // console.log("output->parseList-video", video);
      const [, href, avid, image, title] = video;
      const [prefix, number] = avid.split("-");
      const id = href.replace("./?v=javli", "");
      return {
        id,
        href,
        avid,
        image,
        title,
        prefix,
        number,
        infos: null,
        favorite: null,
        previewId: null,
        loaded: { preview: false, detail: false },
        images: null,
        error: "",
      };
    });
    return { ...payload, list };
  }

  const VERSION = 2;
  const DB_NAME = "tm-jav";
  const TABLE_DEF = [
    [
      /** empty version 0 */
    ],
    [
      // version 1
      { name: "genres", key: "id", cols: ["name", "type"] },
    ],
    [
      // version 2
      { name: "genres", key: "id", cols: ["name", "type"] },
      { name: "stars", key: "id", cols: ["name"] },
      { name: "templates", key: "prefix", cols: ["template"] },
      {
        name: "details",
        key: "id",
        cols: [
          "genres",
          "stars",
          "date",
          "duration",
          "director",
          "maker",
          "label",
          "score",
          "subscribed",
          "watched",
          "owned",
          "updatedTime",
        ],
      },
      { name: "previews", key: "id", cols: ["previewId", "previewCode"] }, // 0: none match, 1: google match, 2: snapshot match, 4: add zero match, 8: remove zero match
    ],
  ];

  var config = {
    VERSION,
    DB_NAME,
    TABLE_DEF,
  };

  function DB() {
    this.errorCode = "";
    this.db = null;
  }

  const proto = DB.prototype;

  proto.setup = function (dbName, version, ...tableDefs) {
    this.dbName = dbName;
    const request = window.indexedDB.open(dbName, version);
    return new Promise((resolve, reject) => {
      request.onerror = (ev) => {
        this.errorCode = ev.errorCode;
        reject(this);
      };

      request.onsuccess = (ev) => {
        this.db = ev.target.result;
        resolve(this);
      };

      request.onupgradeneeded = (ev) => {
        this.db = ev.target.result;
        this._defTable(tableDefs).then(
          () => {
            resolve(this);
          },
          (ev) => {
            this.errorCode = ev.errorCode;
            reject(this);
          }
        );
      };
    });
  };

  proto.transaction = function (tables, mode = "readonly") {
    const transaction = this.db.transaction(tables, mode);
    const gTable = (table) => new Table(table, this.db, transaction);

    return function runTransaction(handler) {
      return handler(gTable);
    };
  };

  proto._defTable = function (tables) {
    const existTables = [...this.db.objectStoreNames].reduce((r, c) => {
      r[c] = true;
      return r;
    }, {});
    const allTableTransaction = [];
    for (const table of tables) {
      const { name, key: keyPath, indexes } = table;
      if (existTables[name]) {
        continue;
      }
      const objectStore = this.db.createObjectStore(name, { keyPath });

      for (const index of indexes || []) {
        objectStore.createIndex(index, index, { unique: false });
      }

      allTableTransaction.push(
        new Promise((resolve, reject) => {
          objectStore.transaction.onsuccess = resolve;
          objectStore.transaction.onerror = reject;
        })
      );
    }
    return Promise.all(allTableTransaction);
  };

  proto._removeTable = function (name, existTables) {
    if (!existTables[name]) {
      return;
    }

    this.db.deleteObjectStore(name);
  };

  proto.table = function (name) {
    return new Table(name, this.db);
  };

  // ------------ Table ------------

  function Table(name, db, transaction = null) {
    this.name = name;
    this.db = db;
    this._transaction = transaction;
  }

  Table.prototype.get = function (id) {
    return this._asyncExec(id ? "get" : "getAll", id);
  };

  Table.prototype.getAll = function () {
    return this.get();
  };

  Table.prototype.add = function (records) {
    return this._batchExec(records, "add");
  };

  Table.prototype.put = function (records) {
    return this._batchExec(records, "put");
  };

  Table.prototype.delete = function (records) {
    return this._batchExec(records, "delete");
  };

  Table.prototype._batchExec = function (records, method = "add") {
    if (!Array.isArray(records)) {
      records = [records];
    }
    const allRecord = [];
    for (let record of records) {
      allRecord.push(this._asyncExec(method, record));
    }
    return Promise.all(allRecord);
  };

  Table.prototype._transactionFn = function (method) {
    let objectStore;
    if (this._transaction) {
      objectStore = this._transaction.objectStore(this.name);
    } else {
      const mode = method.startsWith("get") ? "readonly" : "readwrite";
      objectStore = this.db.transaction(this.name, mode).objectStore(this.name);
    }
    return objectStore[method].bind(objectStore);
  };

  Table.prototype._asyncExec = function (method, ...args) {
    return new Promise((resolve, reject) => {
      const requestFn = this._transactionFn(method);

      if (typeof requestFn !== "function") {
        reject(`method ${method} is Illegal invocation`);
      } else {
        const request = requestFn(...args);
        request.onsuccess = function (event) {
          resolve(event.target.result);
        };
        request.onerror = function (event) {
          reject(event);
        };
      }
    });
  };

  let dbInstance = null;
  async function getDBInstance() {
    if (dbInstance) {
      return dbInstance;
    }
    const { VERSION, DB_NAME, TABLE_DEF } = config;
    const table = TABLE_DEF[VERSION];

    dbInstance = new DB();
    try {
      await dbInstance.setup(DB_NAME, VERSION, ...table);
      return dbInstance;
    } catch (e) {
      console.error(e);
    }
  }

  function avDetailResolution(video, htmlDom) {
    const firstArg = htmlDom
      ? { htmlDom }
      : video instanceof Document
      ? { htmlDom: video }
      : ["加载 HTML", loadHTML(video.href)];
    return runTask(
      "解析 AV 相关信息",
      firstArg,
      ["解析基本信息", parseAvInfo],
      ["解析投票信息", parseFavorite],
      ["解析图片预览信息", parseImagePreview]
    ).catch((e) => {
      return Promise.reject(e);
    });
  }

  function loadHTML(href) {
    return getHTML(href).then((htmlDom) => {
      return { htmlDom };
    });
  }

  function parseFavorite(payload) {
    const el = payload.htmlDom.querySelector("#video_favorite_edit");

    if (!el) {
      return payload;
    }
    const subscribed = (el.querySelector("#subscribed a") || {}).textContent; // 我想要
    const watched = (el.querySelector("#watched a") || {}).textContent; // 我看过
    const owned = (el.querySelector("#owned a") || {}).textContent; // 我拥有
    return { ...payload, favorite: { subscribed, watched, owned } };
  }

  function parseAvInfo(payload) {
    const el = payload.htmlDom.querySelector("#video_info");
    // console.log('output->parseAvInfo',el);
    if (!el) {
      return payload;
    }
    const dateEl = el.querySelector("#video_date .text") || {};
    const date = dateEl.textContent || "";

    const durationEl = el.querySelector("#video_length .text") || {};
    const duration = durationEl.textContent || ""; // 分钟

    const director = genObjInfo(el, "director");
    const maker = genObjInfo(el, "maker");
    const label = genObjInfo(el, "label");

    const scoreEl = el.querySelector("#video_review .text .score") || {};
    const score = scoreEl.textContent || "";

    const genres = genObjInfo(el, "genre", true);
    const stars = genObjInfo(el, "star", true, "cast");

    return {
      ...payload,
      infos: { date, duration, director, maker, label, score, genres, stars },
    };
  }

  function genObjInfo(wrapper, type, array = false, idSlt = "") {
    const fChar = type[0];
    const pageReg = new RegExp(`.*vl_${type}\\.php\\?${fChar}=`);
    if (!idSlt) {
      idSlt = type + (array ? "s" : "");
    }
    const selector = `#video_${idSlt} .text a`;
    const els = wrapper.querySelectorAll(selector);
    const result = [...els].map((el) => {
      return {
        id: el.href.replace(pageReg, ""),
        name: el.textContent,
      };
    });

    return !array && result.length === 1 ? result[0] : result;
  }

  function parseImagePreview(payload) {
    const el = payload.htmlDom.querySelectorAll(".previewthumbs > img");
    if (!el || !el.length) {
      payload = { ...payload, images: null };
    }
    const result = el[0] && el[0].src.match(/\/([^\/]+?)-(\d+)\.(.*)$/);
    if (result) {
      payload = {
        ...payload,
        images: { previewId: result[1], ext: result[3], count: el.length },
      };
    }
    return payload;
  }

  function parseBaseInfo(dom) {
    if (!dom instanceof Document) {
      return dom;
    }
    const avid = dom.querySelector("#video_id tr td.text").innerText;
    const imgSrc = dom.querySelector("#video_jacket img").src;
    const image = imgSrc.replace(/https?:/, "").replace("pl", "ps");
    const [prefix, number] = avid.split("-");
    const aLink = dom.querySelector("#video_title h3 a");
    const title = aLink.innerText;
    const href = aLink.href;
    const id = href.replace("./?v=javli", "");

    return {
      id,
      href,
      avid,
      image,
      title,
      prefix,
      number,
      infos: null,
      favorite: null,
      previewId: null,
      loaded: { preview: false, detail: false },
      images: null,
      error: "",
    };
  }

  const PREVIEW_CODE = {
    NONE: 0,
    TEMPLATE: 1,
    TEMPLATE_ZERO: 2,
    GOOGLE: 3,
    GOOGLE_ZERO: 4,
    SNAPSHOT: 5,
    SNAPSHOT_ZERO: 6,
    INFO_IMAGE: 7,
  };

  const urlPrefix = location.protocol + "//cc3001.dmm.co.jp/litevideo/freepv/";

  const urlPostfix = ["_mhb_w", "_dmb_w", "_dm_w", "_sm_w"];
  function genSources(previewId) {
    previewId = previewId.replace(/(((\w)\w\w).*)/, "$3/$2/$1/$1");
    return urlPostfix.map((pf) => urlPrefix + previewId + pf + ".mp4");
  }

  function getCid(str) {
    return str.replace(/([\s\S]+cid=)(\w+)(\/)/, "$2");
  }
  function getGoogleSearchUrl(avid) {
    const url = `https://www.google.com.hk/search?hl=zh-CN&q=site:https://www.dmm.co.jp+${avid}`;
    return url;
  }

  function prepareGoogleSearch(video) {
    const { avid } = video;
    const searchUrl = getGoogleSearchUrl(avid);
    return getHTML(searchUrl).then((dom) => {
      return { dom, searchUrl, video };
    });
  }

  function getSimilarity(s1, s2) {
    const front = s1.slice(0, 15) === s2.slice(0, 15);
    if (front) {
      return 1;
    }
    let titleSimilarity = similarity(s1, s2);
    if (titleSimilarity < 0.5) {
      titleSimilarity = similarity(s1, s2, true /* split mode */);
    }

    return titleSimilarity;
  }
  function parseGoogleResult(payload, log) {
    const { dom, searchUrl, video } = payload;
    const searched = dom.querySelector("#search");
    let snapshotLink = null;
    if (!searched || !searched.children.length) {
      return Promise.reject(
        new Error(`not found 'Element #search' in result of '${searchUrl}'`)
      );
    }

    let firstALinks = searched.querySelectorAll("#rso .g .r > a:first-child");
    if (!firstALinks.length) {
      // 确保能匹配到
      firstALinks = searched.querySelectorAll(
        '#rso .g a[href^="https://www.dmm"]:first-child'
      );
    }
    const avTitle = video.title.replace(video.avid, "");
    log.msg(`开始匹配标题 '${avTitle}', URL: '${searchUrl}'`);
    let previewId = null;
    for (const firstALink of [...firstALinks]) {
      const link = firstALink.pathname;
      const titleEl = firstALink.querySelector("h3");
      const resultTitle = (titleEl ? titleEl.innerText : "")
        .replace("アダルトDVD・ブルーレイ", "")
        .replace(video.avid, "");
      // console.log("-----------------------------------------");
      // // console.log("output->    video", video);
      // console.log("output->    avTitle", avTitle);
      // console.log("output->resultTitle", resultTitle);
      // // console.log("output->    avTitle", avTitle.slice(0, 25));
      // // console.log("output->resultTitle", resultTitle.slice(0, 25));
      // console.log("-----------------------------------------");
      const titleSimilarity = getSimilarity(
        avTitle.slice(0, 25),
        resultTitle.slice(0, 25)
      );
      if (titleSimilarity < 0.5) {
        log.msg(`标题【不】匹配: '${resultTitle}', 相似度: ${titleSimilarity}`);
        continue;
      }
      log.msg(`标题【匹配】: '${resultTitle}', 相似度: ${titleSimilarity}`);
      /**
       * 2023年12月Google下架了快照功能
       * 此处报错--注释解决
       */
      // snapshotLink = firstALink.nextElementSibling.querySelector(
      //   ".action-menu-item.ab_dropdownitem a"
      // );
      // snapshotLink = snapshotLink && snapshotLink.href;
      previewId = getCid(link);
      break;
    }
    if (previewId) {
      return { previewId, video, snapshotLink };
    }
    return Promise.reject(new Error(`解析失败, URL: '${searchUrl}'`));
  }

  function genPreloadTest(previewCode, video) {
    // console.log('output->genPreloadTest',JSON.stringify(video));
    function genZeroId(prevId) {
      let nextId = "";
      const reg = new RegExp(`.*${video.prefix}(0+?)${video.number}`, "i");
      const zero = prevId.replace(reg, (m, m1) => m1);
      if (zero !== prevId) {
        nextId = prevId.replace(zero, "");
      } else {
        const addZero = `00000${video.number}`.slice(-5);
        nextId = prevId.replace(video.number, addZero);
      }
      return nextId;
    }
    return function preloadTest(payload, log) {
    // console.log('output->preloadTest',JSON.stringify(payload));
      let { previewId } = payload || {};
      if (!previewId) {
        return Promise.reject({
          ...payload,
          error: new Error(`EMPTY previewId`),
        });
      }
      if (
        [
          PREVIEW_CODE.GOOGLE_ZERO,
          PREVIEW_CODE.SNAPSHOT_ZERO,
          // for kum prefix
          PREVIEW_CODE.INFO_IMAGE,
        ].includes(previewCode)
      ) {
        previewId = genZeroId(previewId);
      }
      const path = previewId.replace(/(((\w)\w\w).*)/, "$3/$2/$1/$1");
      const url = urlPrefix + path + "_sm_w.mp4";
      log.msg(`尝试加载 url ... : ${url}`);
      return get(url).then(
        () => {
          return { previewId, previewCode };
        },
        (error) => {
          return Promise.reject({ ...payload, error });
        }
      );
    };
  }

  function parseFromSnapshot(payload) {
    const { snapshotLink } = payload;
    return getHTML(snapshotLink).then((dom) => {
      const link = dom.body.querySelector(
        ".area-edition .edition:not(.limited)"
      );
      const previewId = link ? getCid(link.pathname) : "";
      return { ...payload, previewId };
    });
  }

  function preivewResolution(video, infoPromise) {
    if (video.previewId) {
      return Promise.resolve(video.previewId);
    }

    let templateStep = [];
    if (video.template) {
      templateStep = [
        { previewId: video.template },
        [
          "测试TEMPLATE预览ID",
          genPreloadTest(PREVIEW_CODE.TEMPLATE, video),
          "pass",
          "next",
        ],
        [
          "测试TEMPLATE_ZERO预览ID",
          genPreloadTest(PREVIEW_CODE.TEMPLATE_ZERO, video),
          "pass",
          "next",
        ],
      ];
    }

    const infoStep = [
      ["from information1", infoPromise, "next", "next"],
      ["from information2", (video) => Promise.resolve(video.images)],
      [
        "测试information image ID",
        genPreloadTest(PREVIEW_CODE.INFO_IMAGE, video),
        "pass",
        "next",
      ],
    ];

    return runTask(
      "解析预览ID",
      ...templateStep,
      ...infoStep,
      ["谷歌搜索", prepareGoogleSearch(video)],
      ["解析HTML", parseGoogleResult],
      [
        "测试GOOGLE预览ID",
        genPreloadTest(PREVIEW_CODE.GOOGLE, video),
        "pass",
        "next",
      ],
      [
        "测试GOOGLE_ZERO预览ID",
        genPreloadTest(PREVIEW_CODE.GOOGLE_ZERO, video),
        "pass",
        "next",
      ]
      // ["快照查找", parseFromSnapshot],
      // [
      //   "测试SNAPSHOT预览ID",
      //   genPreloadTest(PREVIEW_CODE.SNAPSHOT, video),
      //   "pass",
      //   "next",
      // ],
      // [
      //   "测试SNAPSHOT_ZERO预览ID",
      //   genPreloadTest(PREVIEW_CODE.SNAPSHOT_ZERO, video),
      //   "pass",
      //   "next",
      // ]
    ).catch((e) => {
      return Promise.reject(e);
    });
  }

  class Model {
    constructor(name, keyPath = "id") {
      this.name = name;
      this.init = false;
      this.keyPath = keyPath;
      this.dataIdMap = {};
    }

    async put(datas) {
      if (!Array.isArray(datas)) {
        datas = [datas];
      }
      datas = datas.map((d) => {
        const keyValue = d[this.keyPath];
        if (keyValue && this.dataIdMap[keyValue]) {
          d = { ...this.dataIdMap[keyValue], ...d };
        }
        return d;
      });
      const idb = await getDBInstance();
      await idb.table(this.name).put(datas);

      for (const data of datas) {
        this.dataIdMap[data[this.keyPath]] = data;
      }
    }

    async getAll() {
      const idb = await getDBInstance();
      let datas = await idb.table(this.name).get();

      if (datas && datas.length) {
        this.dataIdMap = toMap(datas, this.keyPath);
      } else {
        datas = await this.getFromRemote();
        await this.put(datas);
      }

      this.init = true;
      return this.processData(datas);
    }

    async getFromRemote() {
      return [];
    }

    processData(d) {
      return d;
    }

    async getMap() {
      if (!this.init) {
        await this.getAll();
      }
      return this.dataIdMap;
    }
  }

  class StarsModel extends Model {
    constructor() {
      super("stars");
    }
  }

  var starsModel = new StarsModel();

  const Config = {
    NAME: "genres",
    URL: "genres.php",
  };

  function parseGenres(dom) {
    const nodes = [...dom.querySelectorAll(".textbox")];
    return nodes.reduce((list, node) => {
      const type = node.firstElementChild.innerText;
      const genres = [...node.querySelectorAll(".genreitem a")].map((a) => {
        return {
          id: a.href.replace(location.origin + "/cn/vl_genre.php?g=", ""),
          name: a.innerText,
          type,
        };
      });
      list = list.concat(genres);
      return list;
    }, []);
  }

  class GenresModel extends Model {
    constructor() {
      super("genres");
    }

    async getFromRemote() {
      return getHTML(Config.URL).then((dom) => {
        const genres = parseGenres(dom.body);
        return genres;
      });
    }

    processData(genres) {
      const treeObj = genres.reduce((tree, genre) => {
        const { id, name, type = "TM-JAV-NEW" } = genre;
        if (!tree[type]) {
          tree[type] = { type, genres: [] };
        }
        tree[type].genres.push({ id, name });
        return tree;
      }, {});

      return Object.keys(treeObj).map((k) => treeObj[k]);
    }
  }

  var genresModel = new GenresModel();

  class TemplatesModel extends Model {
    constructor() {
      super("templates", "prefix");
    }
  }

  var templatesModel = new TemplatesModel();

  const Details = {
    NAME: "details",
  };

  async function getVideoDetail(video, dom) {
    const idb = await getDBInstance();
    let details = await idb.table(Details.NAME).get(video.id);
    console.log('output-> getVideoDetail',dom);

    if (!details || !details.images) {
      const { infos, favorite, images } = await avDetailResolution(video, dom);
      starsModel.put(infos.stars);
      genresModel.put(infos.genres);
      const genres = infos.genres.map((g) => g.id);
      const stars = infos.stars.map((s) => s.id);
      const putData = {
        ...infos,
        ...favorite,
        genres,
        stars,
        id: video.id,
        images,
      };
      await idb.table(Details.NAME).put(putData);
      details = { infos, favorite, images };
    } else {
      const genresMap = await genresModel.getMap();
      const genres = details.genres.map((g) => genresMap[g]);
      const starsMap = await starsModel.getMap();
      const stars = details.stars.map((s) => starsMap[s]);
      const favorite = genObjectFromKeys(details, [
        "score",
        "subscribed",
        "watched",
        "owned",
        "updatedTime",
      ]);
      const infos = {
        stars,
        genres,
        ...genObjectFromKeys(details, [
          "date",
          "duration",
          "director",
          "maker",
          "label",
        ]),
      };
      details = { infos, favorite, images: details.images };
    }
    return details;
  }

  function genObjectFromKeys(obj, keys) {
    return keys.reduce((result, k) => {
      result[k] = obj[k];
      return result;
    }, {});
  }

  const Previews = {
    NAME: "previews",
  };
  async function getVideoPreview(video, infoPromise, force = false) {
    const idb = await getDBInstance();
    let preview = await idb.table(Previews.NAME).get(video.id);
    console.log('output-> getVideoPreview',force,JSON.stringify(video), preview );

    if (force && preview) {
      preview.previewId = undefined;
    }
    if (preview && preview.previewId) {
      return preview.previewId;
    }

    if (!force) {
      const templatesMap = await templatesModel.getMap();
      const template =
        (templatesMap[video.prefix] && templatesMap[video.prefix].template) ||
        "";
      video.template = template.replace("{}", video.number);
    }
    console.log('output-> preivewResolution',JSON.stringify(video), infoPromise);
    const payload = await preivewResolution(video, infoPromise);
    const { previewCode, previewId } = payload;
    if (previewId) {
      const newTemplate = previewId.replace(video.number, "{}");
      templatesModel.put({ prefix: video.prefix, template: newTemplate });
      await idb
        .table(Previews.NAME)
        .put({ id: video.id, previewCode, previewId });
    }

    return previewId;
  }

  //
  var script$3 = {
    components: {
      TmItem: __vue_component__$2,
    },
    data() {
      return {
        list: [],
        loading: false,
        fillError: false,
        ddos: {
          status: false,
          currTime: 5,
          maxTime: 5,
          timer: null,
        },
        pages: genDefaultPages(),
      };
    },
    props: {
      tab: {
        default: null,
      },
    },
    computed: {
      hasNext() {
        return (
          this.tab &&
          this.tab.next !== false &&
          !this.pages.show &&
          this.pages.next
        );
      },
    },
    watch: {
      tab: {
        immediate: true,
        handler(val, old) {
          if (old) {
            this.cacheTab(old);
          }
          if (val) {
            this.onTabChange(val, old);
          }
        },
      },
    },
    methods: {
      inDDoS() {
        if (this.ddos.timer) {
          return true;
        }
        this.ddos.status = document.title === "Just a moment...";
        if (this.ddos.status) {
          this.ddos.currTime = this.ddos.maxTime;

          this.ddos.timer = setInterval(() => {
            this.ddos.currTime--;
            if (!this.ddos.currTime) {
              clearInterval(this.ddos.timer);
              this.ddos.timer = null;
              location.reload();
            }
          }, 1000);
        }
        return this.ddos.status; // cf_clearance
      },
      switchLoadMode() {
        const status = !this.pages.show;
        if (status) {
          const url = this.genPageUrl(this.pages.curr);
          this.getContent(url, status);
        } else {
          this.pages.curr = 1;
          this.getContent(this.tab.href);
        }

        this.pages.show = status;
      },
      onTabChange(tab, old) {
        const cached = ListLRUCache(tab.href);
        if (cached && cached.list.length) {
          this.list = cached.list;
          this.pages = cached.pages;
        } else if (!this.inDDoS()) {
          this.getContent(tab.href);
          this.pages.curr = 1;
        }

        if (this.$refs["scroll-wrapper"]) {
          this.$refs["scroll-wrapper"].scrollTop = cached
            ? cached.scrollTop
            : 0;
        }
      },
      cacheTab(tab) {
        if (!this.list.length) {
          return;
        }
        const scroll = this.$refs["scroll-wrapper"];
        ListLRUCache(tab.href, {
          list: this.list,
          pages: this.pages,
          scrollTop: scroll && scroll.scrollTop,
        });
      },
      getContent(href, pageStatus = false) {
        this.loading = true;
        this.list = [];
        queryVideoList(href)
          .then(
            ({ list, pages }) => {
              this.list = list;
              this.pages = pages;
              this.pages.show = pageStatus;
              this.fillList();
            },
            () => {
              this.list = [];
            }
          )
          .finally(() => {
            this.loading = false;
          });
      },
      genPageUrl(page = 0) {
        if (!page) {
          page = ++this.pages.curr;
        }
        const hasQ = /\?/.test(this.tab.href);
        const url = this.tab.href + `${hasQ ? "&" : "?"}page=${page}`;
        return url;
      },
      toPage(p) {
        const url = this.genPageUrl(p);
        this.getContent(url, true);
      },
      queryNext() {
        const url = this.genPageUrl();
        return queryVideoList(url)
          .then(({ list, pages }) => {
            this.pages = pages;
            this.list = this.list.concat(list);
            this.fillList();
          })
          .finally(() => {
            this.loading = false;
          });
      },
      fillList() {
        if (!this.hasNext) {
          return;
        }
        this.$nextTick().then(() => {
          if (!this.fillError && this.isScrollEnd()) {
            this.queryNext().catch(() => {
              this.fillError = true;
            });
          }
        });
      },
      showPreview(video) {
        const i = getVideoDetail(video);
        i.then(({ infos, favorite, images }) => {
          video.infos = infos;
          video.favorite = favorite;
          video.images = images;
          video.loaded.detail = true;
          this.$emit("select", video);
          return video;
        }).catch((e) => {
          console.log("加载失败:", e);
          video.loaded.detail = false;
        });
        video.error = "";
        const s = getVideoPreview(video, i)
          .then((previewId) => {
            if (previewId) {
              video.previewId = previewId;
              video.loaded.preview = true;
              this.$emit("select", video);
            } else {
              video.error = "加载失败，请查看日志";
            }
          })
          .catch((e) => {
            console.log("加载失败:", e);
            video.error = "加载失败，请查看日志";
          });

        this.$emit("select", video);
        Promise.all([s, i]).then(() => {
          console.log(video);
        });
      },
      isScrollEnd() {
        const t = this.$refs["scroll-wrapper"];
        if (!t) {
          return false;
        }
        return t.scrollHeight - t.clientHeight - 20 < t.scrollTop;
      },
      onScroll: throttle(function (e) {
        if (!this.hasNext || e.deltaY < 0) {
          return false;
        }

        if (this.isScrollEnd() && !this.loading) {
          this.loading = true;
          this.queryNext();
        }
      }, 16),
    },
  };

  /* script */
  const __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$3 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "tm-jav-list" }, [
      _vm.ddos.status
        ? _c("div", { staticClass: "tm-jav-list--ddos" }, [
            _vm._m(0),
            _vm._v(" "),
            _c("h1", [_vm._v(_vm._s(_vm.ddos.currTime) + "秒 ... ")]),
            _vm._v(" "),
            _c("h1", [_vm._v("javlibrary.com 正在进行 DDoS 防护")]),
            _vm._v(" "),
            _c("h4", [
              _vm._v(
                "此为自运行程序，最长不超过5秒，你的浏览器会自动加载 javlibrary.com 内容"
              ),
            ]),
            _vm._v(" "),
            _c("h4", [_vm._v("如果没有跳转，请自行刷新")]),
          ])
        : _c(
            "div",
            {
              ref: "scroll-wrapper",
              staticClass: "tm-jav-list--wrapper",
              on: {
                scroll: function ($event) {
                  $event.stopPropagation();
                },
                mousewheel: _vm.onScroll,
              },
            },
            [
              _c(
                "div",
                { staticClass: "tm-jav-list--scroll" },
                _vm._l(_vm.list, function (video) {
                  return _c("tm-item", {
                    key: video.href,
                    attrs: { video: video },
                    on: {
                      "show-preview": function ($event) {
                        return _vm.showPreview(video);
                      },
                    },
                  });
                }),
                1
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.loading,
                      expression: "loading",
                    },
                  ],
                  staticClass: "tm-jav-list--loading",
                  class: { "tm-jav-list--loading-pages": _vm.pages.show },
                },
                [_vm._m(1)]
              ),
            ]
          ),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.pages.length,
              expression: "pages.length",
            },
          ],
          staticClass: "tm-jav-list--switch",
        },
        [
          _c("span", { staticClass: "tm-jav-list--switch-default" }, [
            _vm._v(
              "当前为" + _vm._s(_vm.pages.show ? "切页" : "滚动") + "模式"
            ),
          ]),
          _vm._v(" "),
          _c(
            "span",
            {
              staticClass: "tm-jav-list--switch-hover",
              on: { click: _vm.switchLoadMode },
            },
            [
              _vm._v(
                "点击切换为" + _vm._s(_vm.pages.show ? "滚动" : "切页") + "模式"
              ),
            ]
          ),
        ]
      ),
      _vm._v(" "),
      _vm.pages.length && _vm.pages.show
        ? _c(
            "div",
            { staticClass: "tm-jav-list--pages" },
            [
              _vm.pages.list[0] != 1
                ? _c(
                    "i",
                    {
                      staticClass: "tm-jav--tag",
                      on: {
                        click: function ($event) {
                          return _vm.toPage(1);
                        },
                      },
                    },
                    [_vm._v("第一页")]
                  )
                : _vm._e(),
              _vm._v(" "),
              _vm._l(_vm.pages.list, function (p) {
                return _c(
                  "i",
                  {
                    staticClass: "tm-jav--tag",
                    class: { "tm-jav--current": p == _vm.pages.curr },
                    on: {
                      click: function ($event) {
                        return _vm.toPage(p);
                      },
                    },
                  },
                  [_vm._v(_vm._s(p))]
                );
              }),
              _vm._v(" "),
              _vm.pages.last
                ? _c(
                    "i",
                    {
                      staticClass: "tm-jav--tag",
                      on: {
                        click: function ($event) {
                          return _vm.toPage(_vm.pages.last);
                        },
                      },
                    },
                    [_vm._v("最后一页")]
                  )
                : _vm._e(),
            ],
            2
          )
        : _vm._e(),
    ]);
  };
  var __vue_staticRenderFns__$3 = [
    function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "tm-jav--loading-wrapper" }, [
        _c("i", { staticClass: "tm-jav--loading" }),
      ]);
    },
    function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "tm-jav--loading-wrapper" }, [
        _c("div", { staticClass: "tm-jav--loading" }),
      ]);
    },
  ];
  __vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = function (inject) {
    if (!inject) return;
    inject("data-v-7ee52296_0", {
      source:
        ".tm-jav-list[data-v-7ee52296] {\n  background-color: #ffc4ec;\n  border-radius: 4px;\n  padding: 15px 4px;\n  height: 100%;\n  font-size: 12px;\n  position: relative;\n}\n.tm-jav-list--switch[data-v-7ee52296] {\n  display: inline-block;\n  position: absolute;\n  right: 30px;\n  top: 0px;\n  height: 20px;\n  background-color: rgba(0, 0, 0, 0.3);\n  color: #fff;\n  padding: 2px;\n}\n.tm-jav-list--switch-default[data-v-7ee52296] {\n  display: inline-block;\n}\n.tm-jav-list--switch-hover[data-v-7ee52296] {\n  display: none;\n}\n.tm-jav-list--switch:hover .tm-jav-list--switch-hover[data-v-7ee52296] {\n  display: inline-block;\n  cursor: pointer;\n}\n.tm-jav-list--switch:hover .tm-jav-list--switch-default[data-v-7ee52296] {\n  display: none;\n}\n.tm-jav-list--pages[data-v-7ee52296] {\n  position: absolute;\n  left: 0;\n  top: 0;\n}\n.tm-jav-list--ddos[data-v-7ee52296] {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n}\n.tm-jav-list--wrapper[data-v-7ee52296] {\n  padding: 0 4px;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n.tm-jav-list--wrapper[data-v-7ee52296]:hover {\n  overflow: auto;\n  padding-right: 0;\n}\n.tm-jav-list--scroll[data-v-7ee52296] {\n  display: flex;\n  flex-wrap: wrap;\n  align-content: flex-start;\n}\n.tm-jav-list--scroll[data-v-7ee52296]::after {\n  content: '';\n  flex: 9999999;\n}\n.tm-jav-list--scroll .tm-jav-item[data-v-7ee52296] {\n  flex-grow: 1;\n}\n.tm-jav-list--loading-pages[data-v-7ee52296] {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  z-index: 5;\n  background-color: rgba(0, 0, 0, 0.1);\n}\n",
      map: {
        version: 3,
        sources: ["list.vue"],
        names: [],
        mappings:
          "AAAA;EACE,yBAAyB;EACzB,kBAAkB;EAClB,iBAAiB;EACjB,YAAY;EACZ,eAAe;EACf,kBAAkB;AACpB;AACA;EACE,qBAAqB;EACrB,kBAAkB;EAClB,WAAW;EACX,QAAQ;EACR,YAAY;EACZ,oCAAoC;EACpC,WAAW;EACX,YAAY;AACd;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;AACf;AACA;EACE,qBAAqB;EACrB,eAAe;AACjB;AACA;EACE,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;AACR;AACA;EACE,WAAW;EACX,YAAY;EACZ,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,sBAAsB;AACxB;AACA;EACE,cAAc;EACd,WAAW;EACX,YAAY;EACZ,gBAAgB;AAClB;AACA;EACE,cAAc;EACd,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,eAAe;EACf,yBAAyB;AAC3B;AACA;EACE,WAAW;EACX,aAAa;AACf;AACA;EACE,YAAY;AACd;AACA;EACE,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,UAAU;EACV,oCAAoC;AACtC",
        file: "list.vue",
        sourcesContent: [
          ".tm-jav-list {\n  background-color: #ffc4ec;\n  border-radius: 4px;\n  padding: 15px 4px;\n  height: 100%;\n  font-size: 12px;\n  position: relative;\n}\n.tm-jav-list--switch {\n  display: inline-block;\n  position: absolute;\n  right: 30px;\n  top: 0px;\n  height: 20px;\n  background-color: rgba(0, 0, 0, 0.3);\n  color: #fff;\n  padding: 2px;\n}\n.tm-jav-list--switch-default {\n  display: inline-block;\n}\n.tm-jav-list--switch-hover {\n  display: none;\n}\n.tm-jav-list--switch:hover .tm-jav-list--switch-hover {\n  display: inline-block;\n  cursor: pointer;\n}\n.tm-jav-list--switch:hover .tm-jav-list--switch-default {\n  display: none;\n}\n.tm-jav-list--pages {\n  position: absolute;\n  left: 0;\n  top: 0;\n}\n.tm-jav-list--ddos {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n}\n.tm-jav-list--wrapper {\n  padding: 0 4px;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n.tm-jav-list--wrapper:hover {\n  overflow: auto;\n  padding-right: 0;\n}\n.tm-jav-list--scroll {\n  display: flex;\n  flex-wrap: wrap;\n  align-content: flex-start;\n}\n.tm-jav-list--scroll::after {\n  content: '';\n  flex: 9999999;\n}\n.tm-jav-list--scroll .tm-jav-item {\n  flex-grow: 1;\n}\n.tm-jav-list--loading-pages {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  z-index: 5;\n  background-color: rgba(0, 0, 0, 0.1);\n}\n",
        ],
      },
      media: undefined,
    });
  };
  /* scoped */
  const __vue_scope_id__$3 = "data-v-7ee52296";
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject SSR */

  /* style inject shadow dom */

  const __vue_component__$3 = normalizeComponent(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    false,
    createInjector,
    undefined,
    undefined
  );

  function torrentkittyDetail(path) {
    path = path.replace(/^\//, "");
    const href = "https://www.torrentkitty.tv/search/" + path;
    return getHTML(href).then((doc) => {
      const detail = doc.querySelector(".detailSummary");
      const innerText = (detail && detail.innerText) || "";

      const size = innerText.match(/Content Size:\s+(.*)?\n/);
      // const count = innerText.match(/Number of Files:\s+(.*)?\n/)
      const created = innerText.match(/Created On:\s+(.*)?\n/);

      const torrentDetail = [
        ...(doc.querySelectorAll("#torrentDetail tbody td.name") || []),
      ];
      const files = torrentDetail.map((td) => td.innerText);
      return { size, files, created };
    });
  }

  const parserFn = {
    torrentkitty(doc) {
      const actionList = [...(doc.querySelectorAll("tr td.action") || [])];
      return actionList
        .filter((td) => td.children.length)
        .map((td) => {
          const detail = td.children[0];
          const open = td.children[1];
          return {
            magnet: open.href,
            title: open.title,
            detail: null,
            detailUrl: detail.href,
            detailParser: torrentkittyDetail,
          };
        });
    },
  };

  function getTorrentList(avid, engine = "torrentkitty") {
    const href = "https://cili.site/search?q=" + avid;
    const parser = parserFn[engine];

    return runTask(
      "查询Torrent信息",
      ["加载 HTML", getHTML(href)],
      ["解析Torrent信息", parser]
    ).catch((e) => {
      window.open(href);
      return Promise.reject(e);
    });
  }

  //
  function g(o, k) {
    return (o && o[k]) || "";
  }
  var script$4 = {
    props: {
      video: {
        type: Object,
        default: null,
        largeImage: true,
      },
    },
    data() {
      return {
        showImages: false,
        torrents: [],
        showTorrent: false,
      };
    },
    computed: {
      inDDos: {
        cache: false,
        get() {
          return document.title === "Just a moment...";
        },
      },
      autoplay() {
        return !this.inDDos && this.$root.options.autoplay;
      },
      muted() {
        return this.$root.options.muted;
      },
      images() {
        const imgs = (this.video && this.video.images) || {};
        const count = imgs.count || 0;
        const id = imgs.previewId;
        return Array(count)
          .fill(1)
          .map(
            (v, i) => `//pics.dmm.co.jp/digital/video/${id}/${id}-${i + 1}.jpg`
          );
      },
      sources() {
        return !this.video || !this.video.previewId
          ? []
          : genSources(this.video.previewId);
      },
      loading() {
        return !this.video || !this.video.loaded.preview;
      },
      loadingDetail() {
        return !this.video || !this.video.loaded.detail;
      },
      infos() {
        return g(this.video, "infos");
      },
      favorite() {
        return g(this.video, "favorite");
      },
      title() {
        return g(this.video, "title");
      },
      image() {
        // const id = (this.avid || '').replace('-', '').toLowerCase()
        // return `//pics.dmm.co.jp/mono/movie/adult/${id}/${id}p${this.largeImage ? 'l' : 's'}.jpg`
        return g(this.video, "image").replace("ps", "pl");
      },
      avid() {
        return g(this.video, "avid");
      },
    },
    methods: {
      onVideoError(e) {
        console.log(e);
      },
      favStar(id) {
        addFav(id, "star");
      },
      showAvList(target, type) {
        this.$root.pushTab({
          href: fillListUrl(target.id, type),
          name: target.name,
        });
      },
      searchSamePrefix() {
        const { prefix } = this.video;
        this.$root.pushTab({
          href: `vl_searchbyid.php?keyword=${prefix}`,
          name: prefix.toUpperCase(),
        });
      },
      loadTorrent() {
        // this.showTorrent = !this.showTorrent;
        // if (!this.showTorrent) {
        //     return
        // }
        // getTorrentList(this.avid).then((d) => {
        //     this.torrents = d;
        // }, e => {
        //     console.error(e);
        //     this.showTorrent = false;
        // });
        const href = "https://cili.site/search?q=" + this.avid;
        window.open(href);
      },
      reloadVideo() {
        console.log(this.video);
        const video = JSON.parse(JSON.stringify(this.video));
        if (!video) {
          return;
        }
        video.previewId = undefined;
        video.template = undefined;
        getVideoPreview(video, Promise.resolve({}), true /** force */)
          .then((previewId) => {
            if (previewId) {
              video.previewId = previewId;
              video.loaded.preview = true;
              this.$emit("select", video);
            } else {
              video.error = "加载失败，请查看日志";
            }
          })
          .catch((e) => {
            console.log("加载失败:", e);
            video.error = "加载失败，请查看日志";
          });
      },
    },
  };

  /* script */
  const __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$4 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "tm-jav-preview" }, [
      _vm.images.length
        ? _c(
            "span",
            {
              staticClass: "tm-jav-preview--images-trigger",
              on: {
                click: function ($event) {
                  _vm.showImages = !_vm.showImages;
                },
              },
            },
            [_vm._v("图")]
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.showImages
        ? _c(
            "div",
            { staticClass: "tm-jav-preview--images" },
            _vm._l(_vm.images, function (src) {
              return _c("img", { key: src, attrs: { src: src, alt: "" } });
            }),
            0
          )
        : _vm._e(),
      _vm._v(" "),
      _c("div", { staticClass: "tm-jav-player" }, [
        _c(
          "video",
          {
            key: _vm.avid,
            ref: "video",
            attrs: { controls: "", autoplay: _vm.autoplay, preload: "true" },
            domProps: { muted: _vm.muted },
          },
          _vm._l(_vm.sources, function (source, index) {
            return _c("source", {
              key: source,
              attrs: { src: source },
              on: {
                error: function ($event) {
                  return _vm.onVideoError($event, index);
                },
              },
            });
          }),
          0
        ),
        _vm._v(" "),
        _vm.video && _vm.video.error
          ? _c("div", { staticClass: "tm-jav--loading-wrapper" }, [
              _vm._v("\n        " + _vm._s(_vm.video.error) + "\n      "),
            ])
          : _vm.loading
          ? _c("div", { staticClass: "tm-jav--loading-wrapper" }, [
              _c("i", { staticClass: "tm-jav--loading" }),
            ])
          : _vm._e(),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "tm-jav-information" }, [
        _c(
          "div",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.loadingDetail,
                expression: "loadingDetail",
              },
            ],
            staticClass: "tm-jav--loading-wrapper",
          },
          [_c("i", { staticClass: "tm-jav--loading" })]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "tm-jav--torrent" }, [
          _c(
            "span",
            {
              staticClass: "tm-jav--torrent-btn",
              on: { click: _vm.loadTorrent },
            },
            [_vm._v("磁力搜索")]
          ),
          _vm._v(" "),
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.showTorrent,
                  expression: "showTorrent",
                },
              ],
              staticClass: "tm-jav--torrent-list",
            },
            [
              _c(
                "span",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: !_vm.torrents.length,
                      expression: "!torrents.length",
                    },
                  ],
                },
                [_vm._v("搜索中...")]
              ),
              _vm._v(" "),
              _vm._l(_vm.torrents, function (t) {
                return _c("div", { staticClass: "tm-jav--torrent-item" }, [
                  _c(
                    "a",
                    {
                      staticClass: "tm-jav--torrent-item-title",
                      attrs: { href: t.magnet },
                    },
                    [_vm._v(_vm._s(t.title))]
                  ),
                ]);
              }),
            ],
            2
          ),
        ]),
        _vm._v(" "),
        _c("i", {
          staticClass: "tm-jav--close",
          on: {
            click: function ($event) {
              return _vm.$emit("close");
            },
          },
        }),
        _vm._v(" "),
        _c("div", { staticClass: "tm-jav-information--cover" }, [
          _vm.image
            ? _c("img", { attrs: { src: _vm.image, alt: "cover" } })
            : _vm._e(),
        ]),
        _vm._v(" "),
        _vm.infos
          ? _c("div", { staticClass: "tm-jav-infos" }, [
              _c("div", { staticClass: "tm-jav-infos--row" }, [
                _c(
                  "span",
                  {
                    staticClass: "tm-jav--tag",
                    on: { click: _vm.searchSamePrefix },
                  },
                  [_vm._v(_vm._s(_vm.avid))]
                ),
                _vm._v(" "),
                _c(
                  "a",
                  {
                    staticClass: "tm-jav-infos--title",
                    attrs: {
                      target: "_blank",
                      href: _vm.video && _vm.video.href,
                    },
                  },
                  [_vm._v(_vm._s(_vm.title))]
                ),
              ]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "tm-jav-infos--row" },
                _vm._l(_vm.infos.stars, function (star) {
                  return _c(
                    "span",
                    {
                      staticClass: "tm-jav--tag",
                      on: {
                        click: function ($event) {
                          return _vm.showAvList(star, "star");
                        },
                      },
                    },
                    [_c("span", [_vm._v(_vm._s(star.name))])]
                  );
                }),
                0
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "tm-jav-infos--row" },
                _vm._l(_vm.infos.genres, function (genre) {
                  return _c(
                    "span",
                    {
                      staticClass: "tm-jav--tag",
                      on: {
                        click: function ($event) {
                          return _vm.showAvList(genre, "genre");
                        },
                      },
                    },
                    [_vm._v(_vm._s(genre.name))]
                  );
                }),
                0
              ),
              _vm._v(" "),
              _c("div", { staticClass: "tm-jav-infos--row" }, [
                _c("span", { staticClass: "tm-jav--tag" }, [
                  _vm._v(_vm._s(_vm.infos.date)),
                ]),
                _vm._v(" "),
                _c(
                  "span",
                  { staticClass: "tm-jav--tag", attrs: { title: "评分" } },
                  [_vm._v(_vm._s(_vm.favorite.score || "--") + "分")]
                ),
                _vm._v(" "),
                _c(
                  "span",
                  { staticClass: "tm-jav--tag", attrs: { title: "想看的" } },
                  [_vm._v(_vm._s(_vm.favorite.subscribed))]
                ),
                _vm._v(" "),
                _c(
                  "span",
                  { staticClass: "tm-jav--tag", attrs: { title: "看过的" } },
                  [_vm._v(_vm._s(_vm.favorite.watched))]
                ),
                _vm._v(" "),
                _c(
                  "span",
                  { staticClass: "tm-jav--tag", attrs: { title: "拥有的" } },
                  [_vm._v(_vm._s(_vm.favorite.owned))]
                ),
                _vm._v(" "),
                _c(
                  "span",
                  { staticClass: "tm-jav--tag", attrs: { title: "导演" } },
                  [_vm._v(_vm._s(_vm.infos.director.name || "--"))]
                ),
                _vm._v(" "),
                _c(
                  "span",
                  { staticClass: "tm-jav--tag", attrs: { title: "制作商" } },
                  [_vm._v(_vm._s(_vm.infos.maker.name || "--"))]
                ),
                _vm._v(" "),
                _c(
                  "span",
                  { staticClass: "tm-jav--tag", attrs: { title: "发行商" } },
                  [_vm._v(_vm._s(_vm.infos.label.name || "--"))]
                ),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "tm-jav-infos--row" }, [
                _c(
                  "span",
                  {
                    staticClass: "tm-jav--torrent-btn",
                    on: { click: _vm.reloadVideo },
                  },
                  [_vm._v("刷新信息")]
                ),
              ]),
            ])
          : _vm._e(),
      ]),
    ]);
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = function (inject) {
    if (!inject) return;
    inject("data-v-7ac117aa_0", {
      source:
        ".tm-jav-preview[data-v-7ac117aa] {\n  overflow: scroll;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  margin-right: 10px;\n  padding-right: 10px;\n  position: relative;\n  padding: 0 10px;\n}\n.tm-jav-preview--images-trigger[data-v-7ac117aa] {\n  z-index: 10;\n  position: absolute;\n  left: 0px;\n  top: 0;\n  padding: 3px 4px;\n  border-radius: 50%;\n  cursor: pointer;\n  color: #fff;\n  background-color: #ee4dba;\n}\n.tm-jav-preview--images[data-v-7ac117aa] {\n  z-index: 10;\n  position: absolute;\n  right: 0px;\n  top: 30px;\n}\n.tm-jav-preview .tm-jav--torrent[data-v-7ac117aa] {\n  position: absolute;\n  right: 40px;\n  top: 10px;\n  z-index: 4;\n  display: inline-block;\n}\n.tm-jav-preview .tm-jav--torrent-btn[data-v-7ac117aa] {\n  padding: 4px;\n  border-radius: 4px;\n  background-color: #000;\n  color: #fff;\n  cursor: pointer;\n}\n.tm-jav-preview .tm-jav--torrent-list[data-v-7ac117aa] {\n  position: absolute;\n  right: 0;\n  bottom: 24px;\n  background-color: #fff;\n  padding: 10px;\n  border-radius: 10px;\n  width: 250px;\n}\n.tm-jav-preview .tm-jav--close[data-v-7ac117aa] {\n  position: absolute;\n  right: 3px;\n  top: 3px;\n  z-index: 4;\n  font-size: 30px;\n  background-color: #ee4dba;\n}\n.tm-jav-preview .tm-jav-player[data-v-7ac117aa] {\n  width: 100%;\n  position: relative;\n}\n.tm-jav-preview .tm-jav-player video[data-v-7ac117aa] {\n  width: 100%;\n}\n.tm-jav-preview .tm-jav-information[data-v-7ac117aa] {\n  padding: 10px;\n  flex: 1;\n  display: flex;\n  position: relative;\n}\n.tm-jav-preview .tm-jav-information--cover[data-v-7ac117aa] {\n  width: 225px;\n}\n.tm-jav-preview .tm-jav-information--cover img[data-v-7ac117aa] {\n  width: 225px;\n  margin-right: 10px;\n  transition: transform 0.5s;\n  transform-origin: bottom left;\n  z-index: 5;\n}\n.tm-jav-preview .tm-jav-information--cover img[data-v-7ac117aa]:hover {\n  position: relative;\n  bottom: 0;\n  left: 0;\n  transform-origin: bottom left;\n  transform: scale(3);\n}\n.tm-jav-preview .tm-jav-information .tm-jav-infos[data-v-7ac117aa] {\n  flex: 1;\n  position: relative;\n}\n.tm-jav-preview .tm-jav-information .tm-jav-infos--row[data-v-7ac117aa] {\n  margin-bottom: 4px;\n  border-bottom: 1px solid rgba(119, 119, 119, 0.3);\n  padding-bottom: 4px;\n}\n.tm-jav-preview .tm-jav-information .tm-jav-infos--title[data-v-7ac117aa] {\n  color: rgba(0, 0, 0, 0.65);\n}\n",
      map: {
        version: 3,
        sources: ["preview.vue"],
        names: [],
        mappings:
          "AAAA;EACE,cAAc;EACd,aAAa;EACb,sBAAsB;EACtB,WAAW;EACX,kBAAkB;EAClB,mBAAmB;EACnB,kBAAkB;EAClB,eAAe;AACjB;AACA;EACE,WAAW;EACX,kBAAkB;EAClB,SAAS;EACT,MAAM;EACN,gBAAgB;EAChB,kBAAkB;EAClB,eAAe;EACf,WAAW;EACX,yBAAyB;AAC3B;AACA;EACE,WAAW;EACX,kBAAkB;EAClB,UAAU;EACV,SAAS;AACX;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,SAAS;EACT,UAAU;EACV,qBAAqB;AACvB;AACA;EACE,YAAY;EACZ,kBAAkB;EAClB,sBAAsB;EACtB,WAAW;EACX,eAAe;AACjB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,YAAY;EACZ,sBAAsB;EACtB,aAAa;EACb,mBAAmB;EACnB,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,QAAQ;EACR,UAAU;EACV,eAAe;EACf,yBAAyB;AAC3B;AACA;EACE,WAAW;EACX,kBAAkB;AACpB;AACA;EACE,WAAW;AACb;AACA;EACE,aAAa;EACb,OAAO;EACP,aAAa;EACb,kBAAkB;AACpB;AACA;EACE,YAAY;AACd;AACA;EACE,YAAY;EACZ,kBAAkB;EAClB,0BAA0B;EAC1B,6BAA6B;EAC7B,UAAU;AACZ;AACA;EACE,kBAAkB;EAClB,SAAS;EACT,OAAO;EACP,6BAA6B;EAC7B,mBAAmB;AACrB;AACA;EACE,OAAO;EACP,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,iDAAiD;EACjD,mBAAmB;AACrB;AACA;EACE,0BAA0B;AAC5B",
        file: "preview.vue",
        sourcesContent: [
          ".tm-jav-preview {\n  overflow: auto;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  margin-right: 10px;\n  padding-right: 10px;\n  position: relative;\n  padding: 0 10px;\n}\n.tm-jav-preview--images-trigger {\n  z-index: 10;\n  position: absolute;\n  left: 0px;\n  top: 0;\n  padding: 3px 4px;\n  border-radius: 50%;\n  cursor: pointer;\n  color: #fff;\n  background-color: #ee4dba;\n}\n.tm-jav-preview--images {\n  z-index: 10;\n  position: absolute;\n  right: 0px;\n  top: 30px;\n}\n.tm-jav-preview .tm-jav--torrent {\n  position: absolute;\n  right: 40px;\n  top: 10px;\n  z-index: 4;\n  display: inline-block;\n}\n.tm-jav-preview .tm-jav--torrent-btn {\n  padding: 4px;\n  border-radius: 4px;\n  background-color: #000;\n  color: #fff;\n  cursor: pointer;\n}\n.tm-jav-preview .tm-jav--torrent-list {\n  position: absolute;\n  right: 0;\n  bottom: 24px;\n  background-color: #fff;\n  padding: 10px;\n  border-radius: 10px;\n  width: 250px;\n}\n.tm-jav-preview .tm-jav--close {\n  position: absolute;\n  right: 3px;\n  top: 3px;\n  z-index: 4;\n  font-size: 30px;\n  background-color: #ee4dba;\n}\n.tm-jav-preview .tm-jav-player {\n  width: 100%;\n  position: relative;\n}\n.tm-jav-preview .tm-jav-player video {\n  width: 100%;\n}\n.tm-jav-preview .tm-jav-information {\n  padding: 10px;\n  flex: 1;\n  display: flex;\n  position: relative;\n}\n.tm-jav-preview .tm-jav-information--cover {\n  width: 225px;\n}\n.tm-jav-preview .tm-jav-information--cover img {\n  width: 225px;\n  margin-right: 10px;\n  transition: transform 0.5s;\n  transform-origin: bottom left;\n  z-index: 5;\n}\n.tm-jav-preview .tm-jav-information--cover img:hover {\n  position: relative;\n  bottom: 0;\n  left: 0;\n  transform-origin: bottom left;\n  transform: scale(3);\n}\n.tm-jav-preview .tm-jav-information .tm-jav-infos {\n  flex: 1;\n  position: relative;\n}\n.tm-jav-preview .tm-jav-information .tm-jav-infos--row {\n  margin-bottom: 4px;\n  border-bottom: 1px solid rgba(119, 119, 119, 0.3);\n  padding-bottom: 4px;\n}\n.tm-jav-preview .tm-jav-information .tm-jav-infos--title {\n  color: rgba(0, 0, 0, 0.65);\n}\n",
        ],
      },
      media: undefined,
    });
  };
  /* scoped */
  const __vue_scope_id__$4 = "data-v-7ac117aa";
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject SSR */

  /* style inject shadow dom */

  const __vue_component__$4 = normalizeComponent(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    false,
    createInjector,
    undefined,
    undefined
  );

  //
  var script$5 = {
    data() {
      return {
        value: "",
      };
    },
    methods: {
      doSearch() {
        if (this.value) {
          const url = `${location.origin}/cn/vl_searchbyid.php?keyword=${this.value}`;
          this.$get(url).then((res) => {
            const html = parseHtml(res.responseText);
            if (res.finalUrl === url) {
              this.toTab(html, this.value);
            } else {
              this.parseDetail(html, res.finalUrl);
            }
          });
        }
      },
      toTab(html, name) {
        this.$root.pushTab({
          href: `vl_searchbyid.php?keyword=${name}`,
          name,
        });
      },
      parseDetail(dom) {
        const video = parseBaseInfo(dom);
        const i = getVideoDetail(video, dom);
        i.then(({ infos, favorite, images }) => {
          video.infos = infos;
          video.favorite = favorite;
          video.images = images;
          video.loaded.detail = true;
          this.$emit("select", video);
          return video;
        }).catch((e) => {
          console.log("加载失败:", e);
          video.loaded.detail = false;
        });
        video.error = "";
        const s = getVideoPreview(video, i)
          .then((previewId) => {
            if (previewId) {
              video.previewId = previewId;
              video.loaded.preview = true;
              this.$emit("select", video);
            } else {
              video.error = "加载失败，请查看日志";
            }
          })
          .catch((e) => {
            console.log("加载失败:", e);
            video.error = "加载失败，请查看日志";
          });

        this.$emit("select", video);
        Promise.all([s, i]).then(() => {
          console.log(video);
        });
      },
    },
  };

  /* script */
  const __vue_script__$5 = script$5;

  /* template */
  var __vue_render__$5 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "tm-jav-search" }, [
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.value,
            expression: "value",
          },
        ],
        attrs: { type: "text" },
        domProps: { value: _vm.value },
        on: {
          keyup: function ($event) {
            if (
              !$event.type.indexOf("key") &&
              _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
            ) {
              return null;
            }
            return _vm.doSearch($event);
          },
          input: function ($event) {
            if ($event.target.composing) {
              return;
            }
            _vm.value = $event.target.value;
          },
        },
      }),
      _vm._v(" "),
      _c("button", { on: { click: _vm.doSearch } }, [_vm._v("搜索")]),
    ]);
  };
  var __vue_staticRenderFns__$5 = [];
  __vue_render__$5._withStripped = true;

  /* style */
  const __vue_inject_styles__$5 = function (inject) {
    if (!inject) return;
    inject("data-v-1ae02dbc_0", {
      source: "\n.tm-jav-search {\r\n  display: inline-block;\n}\r\n",
      map: {
        version: 3,
        sources: [
          "D:\\p\\_tampermonkey\\javlib-preview-userscript\\src\\components\\search.vue",
        ],
        names: [],
        mappings: ";AA4EA;EACA,qBAAA;AACA",
        file: "search.vue",
        sourcesContent: [
          "<template>\r\n  <div class=\"tm-jav-search\">\r\n    <input type=\"text\" v-model=\"value\" @keyup.enter=\"doSearch\">\r\n    <button @click=\"doSearch\">搜索</button>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nimport { parseHtml } from '@/utils/functions'\r\nimport { getVideoDetail, getVideoPreview } from '@/api/videos'\r\nimport { parseBaseInfo } from '@/utils/av-info-resolution'\r\nexport default {\r\n  data () {\r\n    return {\r\n      value: ''\r\n    }\r\n  },\r\n  methods: {\r\n    doSearch () {\r\n      if (this.value) {\r\n        const url = `${location.origin}/cn/vl_searchbyid.php?keyword=${this.value}`\r\n        this.$get(url).then((res) => {\r\n          const html = parseHtml(res.responseText)\r\n          if (res.finalUrl === url) {\r\n            this.toTab(html, this.value)\r\n          } else {\r\n            this.parseDetail(html, res.finalUrl)\r\n          }\r\n        })\r\n        \r\n      }\r\n    },\r\n    toTab (html, name) {\r\n      this.$root.pushTab({\r\n        href: `vl_searchbyid.php?keyword=${name}`,\r\n        name,\r\n      })\r\n    },\r\n    parseDetail (dom) {\r\n      const video = parseBaseInfo(dom)\r\n      const i = getVideoDetail(video, dom)\r\n      i.then(({infos, favorite, images}) => {\r\n        video.infos = infos \r\n        video.favorite = favorite\r\n        video.images = images\r\n        video.loaded.detail = true\r\n        this.$emit('select', video)\r\n        return video\r\n      }).catch((e) => {\r\n        console.log('加载失败:', e)\r\n        video.loaded.detail = false\r\n      })\r\n      video.error = ''\r\n      const s = getVideoPreview(video, i).then((previewId) => {\r\n        if (previewId) {\r\n          video.previewId = previewId\r\n          video.loaded.preview = true\r\n          this.$emit('select', video)\r\n        } else {\r\n          video.error = '加载失败，请查看日志'\r\n        }\r\n      }).catch((e) => {\r\n        console.log('加载失败:', e)\r\n        video.error = '加载失败，请查看日志'\r\n      })\r\n      \r\n      this.$emit('select', video)\r\n      Promise.all([s, i]).then(() => {\r\n        console.log(video)\r\n      })\r\n    },\r\n  },\r\n}\r\n</script>\r\n\r\n<style>\r\n.tm-jav-search {\r\n  display: inline-block;\r\n}\r\n</style>",
        ],
      },
      media: undefined,
    });
  };
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject SSR */

  /* style inject shadow dom */

  const __vue_component__$5 = normalizeComponent(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    false,
    createInjector,
    undefined,
    undefined
  );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$6 = {
    data() {
      return {
        scrollLeft: 0,
      };
    },
    props: {
      tabs: {
        default() {
          return [];
        },
      },
      currIndex: {
        default: 0,
      },
    },
    methods: {
      scroll(e) {
        this.scrollLeft += e.deltaY / 10;
        this.$el.scrollLeft = this.scrollLeft;
      },
    },
  };

  /* script */
  const __vue_script__$6 = script$6;

  /* template */
  var __vue_render__$6 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "tm-jav-tabs", on: { mousewheel: _vm.scroll } },
      _vm._l(_vm.tabs, function (tab, index) {
        return _c(
          "div",
          {
            key: tab.href,
            staticClass: "tm-jav-tabs--item",
            class: { curr: _vm.currIndex === index },
          },
          [
            _c(
              "span",
              {
                staticClass: "tm-jav-tabs--name",
                on: {
                  click: function ($event) {
                    return _vm.$emit("active", index);
                  },
                },
              },
              [_vm._v(_vm._s(tab.name))]
            ),
            _vm._v(" "),
            !tab.fixed
              ? _c("span", {
                  staticClass: "tm-jav--close",
                  on: {
                    click: function ($event) {
                      return _vm.$emit("remove", index);
                    },
                  },
                })
              : _vm._e(),
          ]
        );
      }),
      0
    );
  };
  var __vue_staticRenderFns__$6 = [];
  __vue_render__$6._withStripped = true;

  /* style */
  const __vue_inject_styles__$6 = function (inject) {
    if (!inject) return;
    inject("data-v-e9386a3a_0", {
      source:
        ".tm-jav-tabs {\n  width: 100%;\n  height: 20px;\n  background-color: #fff;\n  overflow-x: auto;\n  white-space: nowrap;\n  overflow-y: hidden;\n}\n.tm-jav-tabs::-webkit-scrollbar {\n  display: none;\n}\n.tm-jav-tabs--item {\n  display: inline-block;\n  align-items: center;\n  height: 20px;\n  min-width: 70px;\n  color: #fff;\n  background-color: #f282ce;\n  padding: 0 4px;\n  margin-right: 1px;\n  line-height: 20px;\n  cursor: pointer;\n}\n.tm-jav-tabs--item:hover {\n  background-color: #ff91dc;\n}\n.tm-jav-tabs--item.curr {\n  background-color: #ffc4ec;\n  color: #ff60cc;\n}\n.tm-jav-tabs--name {\n  text-overflow: ellipsis;\n  overflow: hidden;\n  width: 50px;\n  display: inline-block;\n  white-space: nowrap;\n}\n.tm-jav-tabs--window {\n  width: 16px;\n  height: 16px;\n  background: aquamarine;\n}\n.tm-jav-tabs .tm-jav--close {\n  font-size: 14px;\n  background-color: transparent;\n  top: -7px;\n}\n",
      map: {
        version: 3,
        sources: [
          "tabs.vue",
          "D:\\p\\_tampermonkey\\javlib-preview-userscript\\src\\components\\tabs.vue",
        ],
        names: [],
        mappings:
          "AAAA;EACE,WAAW;EACX,YAAY;EACZ,sBAAsB;EACtB,gBAAgB;EAChB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,aAAa;AACf;AACA;EACE,qBAAqB;EACrB,mBAAmB;EACnB,YAAY;EACZ,eAAe;EACf,WAAW;EACX,yBAAyB;EACzB,cAAc;EACd,iBAAiB;EACjB,iBAAiB;EACjB,eAAe;AACjB;AACA;EACE,yBAAyB;AAC3B;AACA;EACE,yBAAyB;EACzB,cAAc;AAChB;AACA;EACE,uBAAuB;EACvB,gBAAgB;EAChB,WAAW;EACX,qBAAqB;ECCvB,mBAAA;AACA;AACA;EACA,WAAA;EACA,YAAA;EACA,sBAAA;AACA;ADCA;ECCA,eAAA;EACA,6BAAA;EACA,SAAA;AACA",
        file: "tabs.vue",
        sourcesContent: [
          ".tm-jav-tabs {\n  width: 100%;\n  height: 20px;\n  background-color: #fff;\n  overflow-x: auto;\n  white-space: nowrap;\n  overflow-y: hidden;\n}\n.tm-jav-tabs::-webkit-scrollbar {\n  display: none;\n}\n.tm-jav-tabs--item {\n  display: inline-block;\n  align-items: center;\n  height: 20px;\n  min-width: 70px;\n  color: #fff;\n  background-color: #f282ce;\n  padding: 0 4px;\n  margin-right: 1px;\n  line-height: 20px;\n  cursor: pointer;\n}\n.tm-jav-tabs--item:hover {\n  background-color: #ff91dc;\n}\n.tm-jav-tabs--item.curr {\n  background-color: #ffc4ec;\n  color: #ff60cc;\n}\n.tm-jav-tabs--name {\n  text-overflow: ellipsis;\n  overflow: hidden;\n  width: 50px;\n  display: inline-block;\n  white-space: nowrap;\n}\n.tm-jav-tabs--window {\n  width: 16px;\n  height: 16px;\n  background: aquamarine;\n}\n.tm-jav-tabs .tm-jav--close {\n  font-size: 14px;\n  background-color: transparent;\n  top: -7px;\n}\n",
          '<template>\r\n  <div class="tm-jav-tabs" @mousewheel="scroll">\r\n    <div class="tm-jav-tabs--item" :class="{curr: currIndex === index}" v-for="(tab, index) in tabs" :key="tab.href">\r\n      <span class="tm-jav-tabs--name" @click="$emit(\'active\', index)">{{tab.name}}</span>\r\n      <!-- <span class="tm-jav-tabs--window" @click="$emit(\'float-tab\', tab)"></span> -->\r\n      <span class="tm-jav--close" v-if="!tab.fixed" @click="$emit(\'remove\', index)"></span>\r\n    </div>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nexport default {\r\n  data () {\r\n    return {\r\n      scrollLeft: 0\r\n    }\r\n  },\r\n  props: {\r\n    tabs: {\r\n      default () {return []}\r\n    },\r\n    currIndex: {\r\n      default: 0\r\n    }\r\n  },\r\n  methods: {\r\n    scroll (e) {\r\n      this.scrollLeft += e.deltaY / 10\r\n      this.$el.scrollLeft = this.scrollLeft\r\n    }\r\n  }\r\n}\r\n</script>\r\n\r\n<style lang="less">\r\n.tm-jav-tabs {\r\n  width: 100%;\r\n  height: 20px;\r\n  background-color: #fff;\r\n  overflow-x: auto;\r\n  white-space: nowrap;\r\n  overflow-y: hidden;\r\n\r\n  &::-webkit-scrollbar {\r\n    display: none;\r\n  }\r\n  &--item {\r\n    display: inline-block;\r\n    align-items: center;\r\n    height: 20px;\r\n    min-width: 70px;\r\n    color: #fff;\r\n    background-color: #f282ce;\r\n    padding: 0 4px;\r\n    margin-right: 1px;\r\n    line-height: 20px;\r\n    cursor: pointer;\r\n\r\n    &:hover {\r\n      background-color: darken(#ffc4ec, 10%);\r\n    }   \r\n    &.curr {\r\n      background-color: #ffc4ec;\r\n      color: #ff60cc;\r\n    }\r\n  }\r\n\r\n  &--name {\r\n    text-overflow: ellipsis;\r\n    overflow: hidden;\r\n    width: 50px;\r\n    display: inline-block;\r\n    white-space: nowrap;\r\n  }\r\n\r\n  &--window {\r\n    width: 16px;\r\n    height: 16px;\r\n    background: aquamarine;\r\n  }\r\n\r\n  .tm-jav--close {\r\n    font-size: 14px;\r\n    background-color: transparent;\r\n    top: -7px;\r\n  }\r\n}\r\n</style>',
        ],
      },
      media: undefined,
    });
  };
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* style inject SSR */

  /* style inject shadow dom */

  const __vue_component__$6 = normalizeComponent(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    false,
    createInjector,
    undefined,
    undefined
  );

  //
  var script$7 = {
    data() {
      return {
        logs: [],
      };
    },
    mounted() {
      this.logs = [...logVue.logs];
      logVue.$on("log-task", this.pushLog);
    },
    beforeDestroy() {
      logVue.$off("log-task", this.pushLog);
    },
    methods: {
      pushLog(taskLog) {
        this.logs.unshift(taskLog);
      },
    },
  };

  /* script */
  const __vue_script__$7 = script$7;

  /* template */
  var __vue_render__$7 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "tm-jav-log" },
      [
        _c("h4", [_vm._v("解析日志")]),
        _vm._v(" "),
        _vm._l(_vm.logs, function (task) {
          return _c("div", { staticClass: "tm-jav-log--task" }, [
            _c("h4", [_vm._v(_vm._s(task.name))]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "tm-jav-log--content" },
              _vm._l(task.logs, function (log) {
                return _c("p", { staticClass: "tm-jav-log--row" }, [
                  _c("span", { staticClass: "tm-jav-log--time" }, [
                    _vm._v(_vm._s(log.after) + "ms"),
                  ]),
                  _vm._v(" "),
                  _c(
                    "span",
                    {
                      class: [
                        "tm-jav--status",
                        "tm-jav--status-" + log.status,
                        "tm-jav--task-" + task.status,
                      ],
                    },
                    [_vm._v(_vm._s(log.status))]
                  ),
                  _vm._v(" "),
                  _c("span", { staticClass: "tm-jav-log--name" }, [
                    _vm._v(_vm._s(log.name)),
                  ]),
                  _vm._v(" "),
                  _c("span", { staticClass: "tm-jav-log--msg" }, [
                    _vm._v(_vm._s(log.msg)),
                  ]),
                ]);
              }),
              0
            ),
            _vm._v(" "),
            !task.finished
              ? _c("span", { staticClass: "tm-jav--loading" })
              : _vm._e(),
          ]);
        }),
      ],
      2
    );
  };
  var __vue_staticRenderFns__$7 = [];
  __vue_render__$7._withStripped = true;

  /* style */
  const __vue_inject_styles__$7 = function (inject) {
    if (!inject) return;
    inject("data-v-a7903d74_0", {
      source:
        ".tm-jav-log[data-v-a7903d74] {\n  width: 100%;\n  height: 28px;\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  background: #fff;\n  z-index: 20;\n  padding: 10px;\n  box-shadow: 0px -1px 6px 3px rgba(142, 142, 142, 0.71);\n  transition: height 0.5s;\n  overflow: hidden;\n}\n.tm-jav-log .tm-jav--loading[data-v-a7903d74] {\n  margin: 10px 90px;\n}\n.tm-jav-log h4[data-v-a7903d74] {\n  margin-top: 0;\n}\n.tm-jav-log[data-v-a7903d74]:hover {\n  overflow: auto;\n  overflow-x: hidden;\n  height: 30vh;\n}\n.tm-jav-log--task[data-v-a7903d74] {\n  margin-top: 4px;\n}\n.tm-jav-log--row[data-v-a7903d74] {\n  text-align: left;\n  margin: 0 0 4px;\n}\n.tm-jav-log--row > span[data-v-a7903d74] {\n  margin-right: 4px;\n}\n.tm-jav-log--time[data-v-a7903d74] {\n  width: 60px;\n  text-align: right;\n  display: inline-block;\n}\n.tm-jav--status[data-v-a7903d74] {\n  display: inline-block;\n  padding: 2px;\n  border-radius: 4px;\n  color: #fff;\n  line-height: 1;\n  text-align: center;\n  width: 60px;\n  background-color: #ccc;\n}\n.tm-jav--status-success[data-v-a7903d74] {\n  background-color: #0dba42;\n}\n.tm-jav--status-fail[data-v-a7903d74] {\n  background-color: #ff6666;\n}\n.tm-jav--status-finished[data-v-a7903d74] {\n  background-color: #2dceff;\n}\n.tm-jav--status-finished.tm-jav--task-success[data-v-a7903d74] {\n  background-color: #0dba42;\n}\n.tm-jav--status-finished.tm-jav--task-fail[data-v-a7903d74] {\n  background-color: #ff6666;\n}\n",
      map: {
        version: 3,
        sources: [
          "log.vue",
          "D:\\p\\_tampermonkey\\javlib-preview-userscript\\src\\components\\log.vue",
        ],
        names: [],
        mappings:
          "AAAA;EACE,WAAW;EACX,YAAY;EACZ,eAAe;EACf,SAAS;EACT,OAAO;EACP,gBAAgB;EAChB,WAAW;EACX,aAAa;EACb,sDAAsD;EACtD,uBAAuB;EACvB,gBAAgB;AAClB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,aAAa;AACf;AACA;EACE,cAAc;EACd,kBAAkB;EAClB,YAAY;AACd;AACA;EACE,eAAe;AACjB;AACA;EACE,gBAAgB;EAChB,eAAe;AACjB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,WAAW;EACX,iBAAiB;EACjB,qBAAqB;AACvB;AACA;EACE,qBAAqB;EACrB,YAAY;ECCd,kBAAA;EACA,WAAA;EACA,cAAA;EACA,kBAAA;EACA,WAAA;EACA,sBAAA;AACA;AACA;EACA,yBAAA;AACA;AACA;EACA,yBAAA;ADCA;ACCA;EACA,yBAAA;AACA;ADCA;ECCA,yBAAA;AACA;AACA;EACA,yBAAA;AACA",
        file: "log.vue",
        sourcesContent: [
          ".tm-jav-log {\n  width: 100%;\n  height: 28px;\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  background: #fff;\n  z-index: 20;\n  padding: 10px;\n  box-shadow: 0px -1px 6px 3px rgba(142, 142, 142, 0.71);\n  transition: height 0.5s;\n  overflow: hidden;\n}\n.tm-jav-log .tm-jav--loading {\n  margin: 10px 90px;\n}\n.tm-jav-log h4 {\n  margin-top: 0;\n}\n.tm-jav-log:hover {\n  overflow: auto;\n  overflow-x: hidden;\n  height: 30vh;\n}\n.tm-jav-log--task {\n  margin-top: 4px;\n}\n.tm-jav-log--row {\n  text-align: left;\n  margin: 0 0 4px;\n}\n.tm-jav-log--row > span {\n  margin-right: 4px;\n}\n.tm-jav-log--time {\n  width: 60px;\n  text-align: right;\n  display: inline-block;\n}\n.tm-jav--status {\n  display: inline-block;\n  padding: 2px;\n  border-radius: 4px;\n  color: #fff;\n  line-height: 1;\n  text-align: center;\n  width: 60px;\n  background-color: #ccc;\n}\n.tm-jav--status-success {\n  background-color: #0dba42;\n}\n.tm-jav--status-fail {\n  background-color: #ff6666;\n}\n.tm-jav--status-finished {\n  background-color: #2dceff;\n}\n.tm-jav--status-finished.tm-jav--task-success {\n  background-color: #0dba42;\n}\n.tm-jav--status-finished.tm-jav--task-fail {\n  background-color: #ff6666;\n}\n",
          '<template>\r\n  <div class="tm-jav-log">\r\n    <h4>解析日志</h4>\r\n    <div class="tm-jav-log--task" v-for="task in logs">\r\n      <h4>{{task.name}}</h4>\r\n      <div class="tm-jav-log--content">\r\n        <p class="tm-jav-log--row" v-for="log in task.logs">\r\n          <span class="tm-jav-log--time">{{log.after}}ms</span>\r\n          <span :class="[\'tm-jav--status\', \'tm-jav--status-\' + log.status, \'tm-jav--task-\' + task.status]">{{log.status}}</span>\r\n          <span class="tm-jav-log--name">{{log.name}}</span>\r\n          <span class="tm-jav-log--msg">{{log.msg}}</span>\r\n        </p>\r\n      </div>\r\n      <span class="tm-jav--loading" v-if="!task.finished"></span>\r\n    </div>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nimport { logVue } from \'@/utils/log\' \r\nexport default {\r\n  data () {\r\n    return {\r\n      logs: []\r\n    }\r\n  },\r\n  mounted () {\r\n    this.logs = [...logVue.logs]\r\n    logVue.$on(\'log-task\', this.pushLog)\r\n  },\r\n  beforeDestroy () {\r\n    logVue.$off(\'log-task\', this.pushLog)\r\n  },\r\n  methods: {\r\n    pushLog (taskLog) {\r\n      this.logs.unshift(taskLog)\r\n    }\r\n  }\r\n}\r\n</script>\r\n\r\n<style scoped lang="less">\r\n.tm-jav-log {\r\n  width: 100%;\r\n  height: 28px;\r\n  position: fixed;\r\n  bottom: 0;\r\n  left: 0;\r\n  background: #fff;\r\n  z-index: 20;\r\n  padding: 10px;\r\n  box-shadow: 0px -1px 6px 3px rgba(142, 142, 142, 0.71);\r\n  transition: height .5s;\r\n  overflow: hidden;\r\n\r\n  .tm-jav--loading {\r\n    margin: 10px 90px;\r\n  }\r\n\r\n  h4 {\r\n    margin-top: 0;\r\n  }\r\n  &:hover {\r\n    overflow: auto;\r\n    overflow-x: hidden;\r\n    height: 30vh;\r\n  }\r\n\r\n  &--task {\r\n    margin-top: 4px;\r\n  }\r\n\r\n  &--row {\r\n    text-align: left;\r\n    margin: 0 0 4px;\r\n    & > span {\r\n      margin-right: 4px;\r\n    }\r\n  }\r\n\r\n  &--time {\r\n    width: 60px;\r\n    text-align: right;\r\n    display: inline-block;\r\n  }\r\n}\r\n.tm-jav--status {\r\n  display: inline-block;\r\n  padding: 2px;\r\n  border-radius: 4px;\r\n  color: #fff;\r\n  line-height: 1;\r\n  text-align: center;\r\n  width: 60px;\r\n  background-color: #ccc;\r\n  \r\n  &-success {\r\n    background-color: #0dba42;\r\n  }\r\n  &-fail {\r\n    background-color: #ff6666\r\n  }\r\n  &-finished {\r\n    background-color: rgb(45, 206, 255);\r\n    &.tm-jav--task-success {\r\n      background-color: #0dba42;\r\n    }\r\n    &.tm-jav--task-fail {\r\n      background-color: #ff6666\r\n    }\r\n  }\r\n}\r\n</style>',
        ],
      },
      media: undefined,
    });
  };
  /* scoped */
  const __vue_scope_id__$7 = "data-v-a7903d74";
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* style inject SSR */

  /* style inject shadow dom */

  const __vue_component__$7 = normalizeComponent(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    false,
    createInjector,
    undefined,
    undefined
  );

  //
  var script$8 = {
    data() {
      return {
        genres: [],
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        genresModel.getAll().then((result) => {
          this.genres = result;
        });
      },
      showGenre({ id, name }) {
        this.$root.pushTab({
          href: "vl_genre.php?g=" + id,
          name,
        });
      },
    },
  };

  /* script */
  const __vue_script__$8 = script$8;

  /* template */
  var __vue_render__$8 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "tm-jav-genres" },
      _vm._l(_vm.genres, function (category) {
        return _c("div", { staticClass: "tm-jav-genres--category" }, [
          _c("h3", { staticClass: "tm-jav-genres--category-name" }, [
            _vm._v(_vm._s(category.type)),
          ]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "tm-jav-genres--list" },
            _vm._l(category.genres, function (genre) {
              return _c(
                "div",
                {
                  staticClass: "tm-jav-genres--item",
                  on: {
                    click: function ($event) {
                      return _vm.showGenre(genre);
                    },
                  },
                },
                [_vm._v("\n        " + _vm._s(genre.name) + "\n      ")]
              );
            }),
            0
          ),
        ]);
      }),
      0
    );
  };
  var __vue_staticRenderFns__$8 = [];
  __vue_render__$8._withStripped = true;

  /* style */
  const __vue_inject_styles__$8 = function (inject) {
    if (!inject) return;
    inject("data-v-7c4ad8de_0", {
      source:
        ".tm-jav-genres[data-v-7c4ad8de] {\n  position: fixed;\n  right: 0;\n  width: 300px;\n  height: 100vh;\n  transition: transform 0.5s;\n  background-color: #fff;\n  z-index: 50;\n  box-shadow: -2px 0px 10px 1px #6b6b6b78;\n  overflow: hidden;\n  font-size: 14px;\n  transform: translateX(290px);\n}\n.tm-jav-genres[data-v-7c4ad8de]:hover {\n  transform: translateX(0);\n  overflow: auto;\n}\n.tm-jav-genres--category[data-v-7c4ad8de] {\n  border-top: 1px solid #333;\n  margin-top: 20px;\n}\n.tm-jav-genres--category-name[data-v-7c4ad8de] {\n  background-color: #fff;\n  display: inline-block;\n  margin: -10px 12px 0px;\n  height: 20px;\n  padding: 0 10px;\n  overflow: hidden;\n}\n.tm-jav-genres--list[data-v-7c4ad8de] {\n  padding: 0 12px;\n  display: flex;\n  flex-wrap: wrap;\n}\n.tm-jav-genres--item[data-v-7c4ad8de] {\n  margin: 0 4px;\n  padding: 2px;\n  white-space: nowrap;\n  cursor: pointer;\n  border-radius: 2px;\n}\n.tm-jav-genres--item[data-v-7c4ad8de]:hover {\n  background-color: #b1b1b1ab;\n}\n",
      map: {
        version: 3,
        sources: [
          "genres.vue",
          "D:\\p\\_tampermonkey\\javlib-preview-userscript\\src\\components\\genres.vue",
        ],
        names: [],
        mappings:
          "AAAA;EACE,eAAe;EACf,QAAQ;EACR,YAAY;EACZ,aAAa;EACb,0BAA0B;EAC1B,sBAAsB;EACtB,WAAW;EACX,uCAAuC;EACvC,gBAAgB;EAChB,eAAe;EACf,4BAA4B;AAC9B;AACA;EACE,wBAAwB;EACxB,cAAc;AAChB;AACA;EACE,0BAA0B;EAC1B,gBAAgB;AAClB;AACA;EACE,sBAAsB;EACtB,qBAAqB;EACrB,sBAAsB;EACtB,YAAY;EACZ,eAAe;EACf,gBAAgB;AAClB;AACA;EACE,eAAe;EACf,aAAa;EACb,eAAe;AACjB;AACA;EACE,aAAa;EACb,YAAY;EACZ,mBAAmB;EACnB,eAAe;EACf,kBAAkB;AACpB;ACCA;EACA,2BAAA;AACA",
        file: "genres.vue",
        sourcesContent: [
          ".tm-jav-genres {\n  position: fixed;\n  right: 0;\n  width: 300px;\n  height: 100vh;\n  transition: transform 0.5s;\n  background-color: #fff;\n  z-index: 50;\n  box-shadow: -2px 0px 10px 1px #6b6b6b78;\n  overflow: hidden;\n  font-size: 14px;\n  transform: translateX(290px);\n}\n.tm-jav-genres:hover {\n  transform: translateX(0);\n  overflow: auto;\n}\n.tm-jav-genres--category {\n  border-top: 1px solid #333;\n  margin-top: 20px;\n}\n.tm-jav-genres--category-name {\n  background-color: #fff;\n  display: inline-block;\n  margin: -10px 12px 0px;\n  height: 20px;\n  padding: 0 10px;\n  overflow: hidden;\n}\n.tm-jav-genres--list {\n  padding: 0 12px;\n  display: flex;\n  flex-wrap: wrap;\n}\n.tm-jav-genres--item {\n  margin: 0 4px;\n  padding: 2px;\n  white-space: nowrap;\n  cursor: pointer;\n  border-radius: 2px;\n}\n.tm-jav-genres--item:hover {\n  background-color: #b1b1b1ab;\n}\n",
          '<template>\r\n  <div class="tm-jav-genres">\r\n    <div class="tm-jav-genres--category" v-for="category in genres">\r\n      <h3 class="tm-jav-genres--category-name">{{category.type}}</h3>\r\n      <div class="tm-jav-genres--list">\r\n        <div class="tm-jav-genres--item" v-for="genre in category.genres" @click="showGenre(genre)">\r\n          {{genre.name}}\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nimport genresModel from \'@/api/genres\'\r\nexport default {\r\n  data () {\r\n    return {\r\n      genres: []\r\n    }\r\n  },\r\n  mounted () {\r\n    this.init()\r\n  },\r\n  methods: {\r\n    init () {\r\n      genresModel.getAll().then((result) => {\r\n        this.genres = result\r\n      })\r\n    },\r\n    showGenre ({id, name}) {\r\n      this.$root.pushTab({\r\n        href: \'vl_genre.php?g=\' + id,\r\n        name,\r\n      })\r\n    }\r\n  }\r\n}\r\n</script>\r\n\r\n<style scoped lang="less">\r\n.tm-jav-genres {\r\n  position: fixed;\r\n  right: 0;\r\n  width: 300px;\r\n  height: 100vh;\r\n  transition: transform .5s;\r\n  background-color: #fff;\r\n  z-index: 50;\r\n  box-shadow: -2px 0px 10px 1px #6b6b6b78;\r\n  overflow: hidden;\r\n  font-size: 14px;\r\n  transform: translateX(290px);\r\n  &:hover {\r\n    transform: translateX(0);\r\n    overflow: auto;\r\n  }\r\n  \r\n  &--category {\r\n    border-top: 1px solid #333;\r\n    margin-top: 20px;\r\n    &-name {\r\n      background-color: #fff;\r\n      display: inline-block;\r\n      margin: -10px 12px 0px;\r\n      height: 20px;\r\n      padding: 0 10px;\r\n      overflow: hidden;\r\n    }\r\n  }\r\n  &--list {\r\n    padding: 0 12px;\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n  }\r\n  &--item {\r\n    margin: 0 4px;\r\n    padding: 2px;\r\n    white-space: nowrap;\r\n    cursor: pointer;\r\n    border-radius: 2px;\r\n\r\n    &:hover {\r\n      background-color: #b1b1b1ab;\r\n    }\r\n  }\r\n}\r\n</style>',
        ],
      },
      media: undefined,
    });
  };
  /* scoped */
  const __vue_scope_id__$8 = "data-v-7c4ad8de";
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = false;
  /* style inject SSR */

  /* style inject shadow dom */

  const __vue_component__$8 = normalizeComponent(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    false,
    createInjector,
    undefined,
    undefined
  );

  const STORAGE_KEY = "tm-jav-prev-status";

  var prevStatus = {
    set(value, key = STORAGE_KEY) {
      if (typeof value !== "string") {
        value = JSON.stringify(value);
      }
      localStorage.setItem(key, value);
    },
    get(key = STORAGE_KEY) {
      const value = localStorage.getItem(key);
      return JSON.parse(value);
    },
  };

  //

  var script$9 = {
    name: "tm-app",
    components: {
      TmContainer: __vue_component__,
      TmWindow: __vue_component__$1,
      TmPreview: __vue_component__$4,
      TmSearch: __vue_component__$5,
      TmList: __vue_component__$3,
      TmTabs: __vue_component__$6,
      TmLog: __vue_component__$7,
      TmGenres: __vue_component__$8,
    },
    data() {
      return {
        currVideo: null,
        currWindowSrc: "",
        tabIndex: 0,
        tabs: [
          { name: "最热门", href: "/cn/", next: false, fixed: true },
          { name: "新发行", href: "vl_newrelease.php", fixed: true },
          { name: "新加入", href: "vl_newentries.php", fixed: true },
          { name: "最想要", href: "vl_mostwanted.php", fixed: true },
          { name: "高评价", href: "vl_bestrated.php", fixed: true },
        ],
        options: {
          autoplay: true,
          muted: false,
          loadPrevStatus: true,
          useWindow: true,
          showApp: true,
        },
      };
    },
    created() {
      this.init();
      window.addEventListener("beforeunload", this.onClose);
    },
    beforeDestroy() {
      window.removeEventListener("beforeunload", this.onClose);
    },
    computed: {
      currTab() {
        return this.tabs[this.tabIndex] || null;
      },
    },
    methods: {
      removeTab(index) {
        const tab = this.tabs[index];
        if (tab.fixed) {
          return;
        }

        this.tabs.splice(index, 1);

        if (index === this.tabIndex) {
          const prevIndex = ListCacheStore.keys.length - 2;
          if (prevIndex > -1) {
            index = this.tabs.findIndex(
              (tab) => tab.href === ListCacheStore.keys[prevIndex]
            );
          }

          this.tabIndex = Math.max(index, 0);
        } else if (this.tabIndex >= this.tabs.length) {
          this.tabIndex = this.tabs.length - 1;
        }
      },
      pushTab(tab) {
        try {
          const { name, href } = tab;
          const index = this.tabs.findIndex((tab) => tab.href === href);
          if (index > -1) {
            this.tabIndex = index;
          } else {
            const len = this.tabs.push({ name, href });
            this.tabIndex = len - 1;
          }
        } catch (e) {
          console.error(e);
        }
      },
      onClose() {
        prevStatus.set(this._data);
      },
      init() {
        const prev = prevStatus.get();
        if (!prev) {
          return;
        }
        const loadPrevStatus = prev.options && prev.options.loadPrevStatus;
        prev.options && (this.options = { ...this.options, ...prev.options });
        if (prev && loadPrevStatus !== false) {
          for (let key in prev) {
            if (key !== "options") {
              this[key] = prev[key];
            }
          }
        }
      },
      handleGlobalClick(ev) {
        if (!this.options.useWindow) {
          return;
        }
        // A tm-jav-infos--title A tm-jav-item--title
        const target = ev.target;
        if (target.tagName === "A" && target.className.endsWith("--title")) {
          ev.preventDefault();
          ev.stopPropagation();
          this.currWindowSrc = target.href;
        }
      },
    },
  };

  /* script */
  const __vue_script__$9 = script$9;

  /* template */
  var __vue_render__$9 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("tm-container", [
      _c(
        "div",
        { staticClass: "tm-jav", on: { click: _vm.handleGlobalClick } },
        [
          _c(
            "header",
            { staticClass: "tm-jav-header" },
            [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.options.showApp,
                    expression: "options.showApp",
                  },
                ],
                attrs: { type: "checkbox" },
                domProps: {
                  checked: Array.isArray(_vm.options.showApp)
                    ? _vm._i(_vm.options.showApp, null) > -1
                    : _vm.options.showApp,
                },
                on: {
                  change: function ($event) {
                    var $$a = _vm.options.showApp,
                      $$el = $event.target,
                      $$c = $$el.checked ? true : false;
                    if (Array.isArray($$a)) {
                      var $$v = null,
                        $$i = _vm._i($$a, $$v);
                      if ($$el.checked) {
                        $$i < 0 &&
                          _vm.$set(_vm.options, "showApp", $$a.concat([$$v]));
                      } else {
                        $$i > -1 &&
                          _vm.$set(
                            _vm.options,
                            "showApp",
                            $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                          );
                      }
                    } else {
                      _vm.$set(_vm.options, "showApp", $$c);
                    }
                  },
                },
              }),
              _vm._v(" 进入网站自动加载本脚本\r\n      "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.options.autoplay,
                    expression: "options.autoplay",
                  },
                ],
                attrs: { type: "checkbox" },
                domProps: {
                  checked: Array.isArray(_vm.options.autoplay)
                    ? _vm._i(_vm.options.autoplay, null) > -1
                    : _vm.options.autoplay,
                },
                on: {
                  change: function ($event) {
                    var $$a = _vm.options.autoplay,
                      $$el = $event.target,
                      $$c = $$el.checked ? true : false;
                    if (Array.isArray($$a)) {
                      var $$v = null,
                        $$i = _vm._i($$a, $$v);
                      if ($$el.checked) {
                        $$i < 0 &&
                          _vm.$set(_vm.options, "autoplay", $$a.concat([$$v]));
                      } else {
                        $$i > -1 &&
                          _vm.$set(
                            _vm.options,
                            "autoplay",
                            $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                          );
                      }
                    } else {
                      _vm.$set(_vm.options, "autoplay", $$c);
                    }
                  },
                },
              }),
              _vm._v(" 自动播放\r\n      "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.options.muted,
                    expression: "options.muted",
                  },
                ],
                attrs: { type: "checkbox" },
                domProps: {
                  checked: Array.isArray(_vm.options.muted)
                    ? _vm._i(_vm.options.muted, null) > -1
                    : _vm.options.muted,
                },
                on: {
                  change: function ($event) {
                    var $$a = _vm.options.muted,
                      $$el = $event.target,
                      $$c = $$el.checked ? true : false;
                    if (Array.isArray($$a)) {
                      var $$v = null,
                        $$i = _vm._i($$a, $$v);
                      if ($$el.checked) {
                        $$i < 0 &&
                          _vm.$set(_vm.options, "muted", $$a.concat([$$v]));
                      } else {
                        $$i > -1 &&
                          _vm.$set(
                            _vm.options,
                            "muted",
                            $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                          );
                      }
                    } else {
                      _vm.$set(_vm.options, "muted", $$c);
                    }
                  },
                },
              }),
              _vm._v(" 静音播放\r\n      "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.options.loadPrevStatus,
                    expression: "options.loadPrevStatus",
                  },
                ],
                attrs: { type: "checkbox" },
                domProps: {
                  checked: Array.isArray(_vm.options.loadPrevStatus)
                    ? _vm._i(_vm.options.loadPrevStatus, null) > -1
                    : _vm.options.loadPrevStatus,
                },
                on: {
                  change: function ($event) {
                    var $$a = _vm.options.loadPrevStatus,
                      $$el = $event.target,
                      $$c = $$el.checked ? true : false;
                    if (Array.isArray($$a)) {
                      var $$v = null,
                        $$i = _vm._i($$a, $$v);
                      if ($$el.checked) {
                        $$i < 0 &&
                          _vm.$set(
                            _vm.options,
                            "loadPrevStatus",
                            $$a.concat([$$v])
                          );
                      } else {
                        $$i > -1 &&
                          _vm.$set(
                            _vm.options,
                            "loadPrevStatus",
                            $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                          );
                      }
                    } else {
                      _vm.$set(_vm.options, "loadPrevStatus", $$c);
                    }
                  },
                },
              }),
              _vm._v(" 自动加载上一次浏览状态\r\n      "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.options.useWindow,
                    expression: "options.useWindow",
                  },
                ],
                attrs: { type: "checkbox" },
                domProps: {
                  checked: Array.isArray(_vm.options.useWindow)
                    ? _vm._i(_vm.options.useWindow, null) > -1
                    : _vm.options.useWindow,
                },
                on: {
                  change: function ($event) {
                    var $$a = _vm.options.useWindow,
                      $$el = $event.target,
                      $$c = $$el.checked ? true : false;
                    if (Array.isArray($$a)) {
                      var $$v = null,
                        $$i = _vm._i($$a, $$v);
                      if ($$el.checked) {
                        $$i < 0 &&
                          _vm.$set(_vm.options, "useWindow", $$a.concat([$$v]));
                      } else {
                        $$i > -1 &&
                          _vm.$set(
                            _vm.options,
                            "useWindow",
                            $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                          );
                      }
                    } else {
                      _vm.$set(_vm.options, "useWindow", $$c);
                    }
                  },
                },
              }),
              _vm._v(" 点击标题在小窗口打开\r\n      "),
              _c("tm-search", {
                on: {
                  select: function (v) {
                    return (_vm.currVideo = v);
                  },
                },
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "tm-jav-body" },
            [
              _c("tm-preview", {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.currVideo,
                    expression: "currVideo",
                  },
                ],
                staticStyle: { flex: "1" },
                attrs: { video: _vm.currVideo },
                on: {
                  select: function (v) {
                    return (_vm.currVideo = v);
                  },
                  close: function ($event) {
                    _vm.currVideo = null;
                  },
                },
              }),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass: "tm-jav-main-list",
                  style: { width: _vm.currVideo ? "35%" : "100%" },
                },
                [
                  _c("tm-tabs", {
                    attrs: { currIndex: _vm.tabIndex, tabs: _vm.tabs },
                    on: {
                      active: function (index) {
                        return (_vm.tabIndex = index);
                      },
                      remove: _vm.removeTab,
                    },
                  }),
                  _vm._v(" "),
                  _c("tm-list", {
                    attrs: { tab: _vm.currTab },
                    on: {
                      select: function (v) {
                        return (_vm.currVideo = v);
                      },
                    },
                  }),
                ],
                1
              ),
            ],
            1
          ),
          _vm._v(" "),
          _c("footer", { staticClass: "tm-jav-footer" }, [_c("tm-log")], 1),
          _vm._v(" "),
          _c("tm-genres"),
          _vm._v(" "),
          _c("tm-window", {
            attrs: { src: _vm.currWindowSrc },
            on: {
              close: function ($event) {
                _vm.currWindowSrc = "";
              },
            },
          }),
        ],
        1
      ),
    ]);
  };
  var __vue_staticRenderFns__$9 = [];
  __vue_render__$9._withStripped = true;

  /* style */
  const __vue_inject_styles__$9 = function (inject) {
    if (!inject) return;
    inject("data-v-f562a808_0", {
      source:
        "\n.tm-jav[data-v-f562a808]\r\n{\r\n  font-size: 12px;\r\n  background-color: #f5f5f5;\r\n  width: 100vw;\r\n  height: 100vh;\r\n  min-width: 1200px;\r\n  overflow-x: auto;\r\n  display: flex;\r\n  flex-direction: column;\n}\n.tm-jav-header[data-v-f562a808], .tm-jav-footer[data-v-f562a808] {\r\n  height: 28px;\r\n  padding: 0 16px;\n}\n.tm-jav-body[data-v-f562a808] {\r\n  flex: 1;\r\n  overflow: hidden;\r\n  display: flex;\r\n  margin: 0 16px;\r\n  width: 100%;\n}\n.tm-jav-main-list[data-v-f562a808] {\r\n  width: 35vw;\n}\r\n",
      map: {
        version: 3,
        sources: [
          "D:\\p\\_tampermonkey\\javlib-preview-userscript\\src\\app.vue",
        ],
        names: [],
        mappings:
          ";AA4JA;;EAEA,eAAA;EACA,yBAAA;EACA,YAAA;EACA,aAAA;EACA,iBAAA;EACA,gBAAA;EACA,aAAA;EACA,sBAAA;AACA;AACA;EACA,YAAA;EACA,eAAA;AACA;AACA;EACA,OAAA;EACA,gBAAA;EACA,aAAA;EACA,cAAA;EACA,WAAA;AACA;AACA;EACA,WAAA;AACA",
        file: "app.vue",
        sourcesContent: [
          '<template>\r\n<tm-container>\r\n  <div class="tm-jav" @click="handleGlobalClick">\r\n    <header class="tm-jav-header">\r\n      <input type="checkbox" v-model="options.showApp"> 进入网站自动加载本脚本\r\n      <input type="checkbox" v-model="options.autoplay"> 自动播放\r\n      <input type="checkbox" v-model="options.muted"> 静音播放\r\n      <input type="checkbox" v-model="options.loadPrevStatus"> 自动加载上一次浏览状态\r\n      <input type="checkbox" v-model="options.useWindow"> 点击标题在小窗口打开\r\n      <tm-search @select="(v) => currVideo = v"></tm-search>\r\n    </header>\r\n    <div class="tm-jav-body">\r\n      <tm-preview style="flex: 1" :video="currVideo" v-show="currVideo" @select="(v) => currVideo = v" @close="currVideo = null"></tm-preview>\r\n      <div class="tm-jav-main-list" :style="{width: currVideo ? \'35%\' : \'100%\'}">\r\n        <tm-tabs \r\n        :currIndex="tabIndex" :tabs="tabs"\r\n        @active="(index) => tabIndex = index"\r\n        @remove="removeTab"\r\n        ></tm-tabs>\r\n        <tm-list :tab="currTab" @select="(v) => currVideo = v"></tm-list>\r\n      </div>\r\n    </div>\r\n    <footer class="tm-jav-footer">\r\n      <tm-log></tm-log>\r\n    </footer>\r\n    <tm-genres></tm-genres>\r\n    <tm-window :src="currWindowSrc" @close="currWindowSrc = \'\'"></tm-window>\r\n  </div>\r\n</tm-container>\r\n</template>\r\n\r\n<script>\r\nimport TmContainer from \'@/components/container.vue\'\r\nimport TmWindow from \'@/components/window.vue\'\r\nimport TmList from \'@/components/list.vue\'\r\nimport TmPreview from \'@/components/preview.vue\'\r\nimport TmSearch from \'@/components/search.vue\'\r\nimport TmTabs from \'@/components/tabs.vue\'\r\nimport TmLog from \'@/components/log.vue\'\r\nimport TmGenres from \'@/components/genres.vue\'\r\nimport prevStatus from \'@/utils/prev-status\'\r\nimport { ListCacheStore } from \'@/utils/javlibrary\'\r\n\r\nexport default {\r\n  name: \'tm-app\',\r\n  components: {\r\n    TmContainer,\r\n    TmWindow,\r\n    TmPreview,\r\n    TmSearch,\r\n    TmList,\r\n    TmTabs,\r\n    TmLog,\r\n    TmGenres,\r\n  },\r\n  data () {\r\n    return {\r\n      currVideo: null,\r\n      currWindowSrc: \'\',\r\n      tabIndex: 0,\r\n      tabs: [\r\n        {name: \'最热门\', href: \'/cn/\', next: false, fixed: true},\r\n        {name: \'新发行\', href: \'vl_newrelease.php\', fixed: true},\r\n        {name: \'新加入\', href: \'vl_newentries.php\', fixed: true},\r\n        {name: \'最想要\', href: \'vl_mostwanted.php\', fixed: true},\r\n        {name: \'高评价\', href: \'vl_bestrated.php\', fixed: true},\r\n      ],\r\n      options: {\r\n        autoplay: true,\r\n        muted: false,\r\n        loadPrevStatus: true,\r\n        useWindow: true,\r\n        showApp: true\r\n      }\r\n    }\r\n  },\r\n  created () {\r\n    this.init()\r\n    window.addEventListener(\'beforeunload\', this.onClose)\r\n  },\r\n  beforeDestroy () {\r\n    window.removeEventListener(\'beforeunload\', this.onClose)\r\n  },\r\n  computed: {\r\n    currTab () {\r\n      return this.tabs[this.tabIndex] || null\r\n    }\r\n  },\r\n  methods: {\r\n    removeTab (index) {\r\n      const tab = this.tabs[index]\r\n      if (tab.fixed) { return }\r\n\r\n      this.tabs.splice(index, 1)\r\n\r\n      if (index === this.tabIndex) {\r\n        const prevIndex = ListCacheStore.keys.length - 2\r\n        if (prevIndex > -1) {\r\n          index = this.tabs.findIndex(tab => tab.href === ListCacheStore.keys[prevIndex])\r\n        }\r\n        \r\n        this.tabIndex = Math.max(index, 0)\r\n      } else if (this.tabIndex >= this.tabs.length) {\r\n        this.tabIndex = this.tabs.length - 1\r\n      }\r\n    },\r\n    pushTab (tab) {\r\n      try {\r\n        const {name, href} = tab\r\n        const index = this.tabs.findIndex((tab) => tab.href === href)\r\n        if (index > -1) {\r\n          this.tabIndex = index\r\n        } else {\r\n          const len = this.tabs.push({name, href})\r\n          this.tabIndex = len - 1\r\n        }\r\n      } catch (e) {\r\n        console.error(e)\r\n      }\r\n    },\r\n    onClose () {\r\n      prevStatus.set(this._data)\r\n    },\r\n    init () {\r\n      const prev = prevStatus.get()\r\n      if (!prev) {\r\n        return\r\n      }\r\n      const loadPrevStatus = prev.options && prev.options.loadPrevStatus\r\n      prev.options && (this.options = {...this.options, ...prev.options})\r\n      if (prev && loadPrevStatus !== false) {\r\n        for (let key in prev) {\r\n          if (key !== \'options\') {\r\n            this[key] = prev[key]\r\n          }\r\n        }\r\n      }\r\n    },\r\n    handleGlobalClick (ev) {\r\n      if (!this.options.useWindow) {\r\n        return\r\n      }\r\n      // A tm-jav-infos--title A tm-jav-item--title\r\n      const target = ev.target\r\n      if (target.tagName === \'A\' && target.className.endsWith(\'--title\')) {\r\n        ev.preventDefault()\r\n        ev.stopPropagation()\r\n        this.currWindowSrc = target.href\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\n</script>\r\n\r\n<style scoped>\r\n.tm-jav\r\n{\r\n  font-size: 12px;\r\n  background-color: #f5f5f5;\r\n  width: 100vw;\r\n  height: 100vh;\r\n  min-width: 1200px;\r\n  overflow-x: auto;\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n.tm-jav-header, .tm-jav-footer {\r\n  height: 28px;\r\n  padding: 0 16px;\r\n}\r\n.tm-jav-body {\r\n  flex: 1;\r\n  overflow: hidden;\r\n  display: flex;\r\n  margin: 0 16px;\r\n  width: 100%;\r\n}\r\n.tm-jav-main-list {\r\n  width: 35vw;\r\n}\r\n</style>\r\n',
        ],
      },
      media: undefined,
    });
  };
  /* scoped */
  const __vue_scope_id__$9 = "data-v-f562a808";
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = false;
  /* style inject SSR */

  /* style inject shadow dom */

  const __vue_component__$9 = normalizeComponent(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
    __vue_inject_styles__$9,
    __vue_script__$9,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
    false,
    createInjector,
    undefined,
    undefined
  );

  __$styleInject(
    "/* .vue */\n* {\n  box-sizing: border-box;\n}\n#adultwarningmask {\n  display: none;\n}\nbody::-webkit-scrollbar {\n  display: none;\n}\n::-webkit-scrollbar-thumb {\n  height: 56px;\n  background: #ff60cc;\n}\n::-webkit-scrollbar {\n  width: 4px;\n}\n.tm-jav--close {\n  position: relative;\n  width: 1em;\n  height: 1em;\n  opacity: 0.7;\n  font-size: 20px;\n  display: inline-block;\n  background-color: rgba(0, 0, 0, 0.5);\n  border-radius: 50%;\n  vertical-align: middle;\n}\n.tm-jav--close:hover {\n  opacity: 1;\n}\n.tm-jav--close:before,\n.tm-jav--close:after {\n  position: absolute;\n  left: calc(0.5em - 1px);\n  content: ' ';\n  height: 1em;\n  width: 2px;\n  background-color: #fff;\n}\n.tm-jav--close:before {\n  transform: rotate(45deg);\n}\n.tm-jav--close:after {\n  transform: rotate(-45deg);\n}\n.tm-jav--loading-wrapper {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  z-index: 4;\n  color: #fff;\n  transform: translate(-50%, -50%);\n}\n.tm-jav--loading {\n  font-size: 10px;\n  width: 1em;\n  height: 1em;\n  display: inline-block;\n  margin: 10px 15px;\n  position: relative;\n  left: -9999px;\n  border-radius: 5px;\n  background-color: #f282ce;\n  color: #f282ce;\n  box-shadow: 9999px 0 0 -5px #f282ce;\n  animation: dotPulse 1.5s infinite linear;\n  animation-delay: 0.25s;\n}\n.tm-jav--loading::before,\n.tm-jav--loading::after {\n  content: '';\n  display: inline-block;\n  position: absolute;\n  top: 0;\n  width: 10px;\n  height: 10px;\n  border-radius: 5px;\n  background-color: #f282ce;\n  color: #f282ce;\n}\n.tm-jav--loading::before {\n  box-shadow: 9984px 0 0 -5px #f282ce;\n  animation: dotPulseBefore 1.5s infinite linear;\n  animation-delay: 0s;\n}\n.tm-jav--loading::after {\n  box-shadow: 10014px 0 0 -5px #f282ce;\n  animation: dotPulseAfter 1.5s infinite linear;\n  animation-delay: 0.5s;\n}\n@keyframes dotPulseBefore {\n  0% {\n    box-shadow: 9984px 0 0 -5px #f282ce;\n  }\n  30% {\n    box-shadow: 9984px 0 0 2px #f282ce;\n  }\n  60%,\n  100% {\n    box-shadow: 9984px 0 0 -5px #f282ce;\n  }\n}\n@keyframes dotPulse {\n  0% {\n    box-shadow: 9999px 0 0 -5px #f282ce;\n  }\n  30% {\n    box-shadow: 9999px 0 0 2px #f282ce;\n  }\n  60%,\n  100% {\n    box-shadow: 9999px 0 0 -5px #f282ce;\n  }\n}\n@keyframes dotPulseAfter {\n  0% {\n    box-shadow: 10014px 0 0 -5px #f282ce;\n  }\n  30% {\n    box-shadow: 10014px 0 0 2px #f282ce;\n  }\n  60%,\n  100% {\n    box-shadow: 10014px 0 0 -5px #f282ce;\n  }\n}\n.tm-jav--tag {\n  margin: 0;\n  padding: 0;\n  color: rgba(0, 0, 0, 0.65);\n  font-size: 14px;\n  font-variant: tabular-nums;\n  line-height: 1.5;\n  list-style: none;\n  font-feature-settings: 'tnum';\n  display: inline-block;\n  height: auto;\n  margin-right: 4px;\n  padding: 0 7px;\n  font-size: 12px;\n  line-height: 20px;\n  white-space: nowrap;\n  background: #fafafa;\n  border: 1px solid #d9d9d9;\n  border-radius: 4px;\n  cursor: default;\n  opacity: 1;\n  transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);\n}\n.tm-jav--tag.tm-jav--current {\n  background-color: rgba(0, 0, 0, 0.65);\n  color: #fff;\n}\n.tm-jav--heart {\n  font-size: 8px;\n  background-color: red;\n  display: inline-block;\n  height: 1em;\n  width: 1em;\n  position: relative;\n  top: 0;\n  transform: rotate(-45deg);\n}\n.tm-jav--heart:before,\n.tm-jav--heart:after {\n  content: \"\";\n  background-color: red;\n  border-radius: 50%;\n  height: 1em;\n  position: absolute;\n  width: 1em;\n}\n.tm-jav--heart:before {\n  top: -0.5em;\n  left: 0;\n}\n.tm-jav--heart:after {\n  left: 0.5em;\n  top: 0;\n}\n"
  );

  Vue.use(Http);

  const container = (parent) => {
    const appContainer = document.createElement("div");
    parent.insertBefore(appContainer, parent.firstChild);
    return appContainer;
  };

  const vuefactory = (option, parent = document.body) => {
    const vm = new Vue({
      ...option,
      el: container(parent),
    });

    if (!window.__TAMPERMONKEY_VUE__) window.__TAMPERMONKEY_VUE__ = [];
    window.__TAMPERMONKEY_VUE__.push(vm);
  };

  vuefactory(__vue_component__$9);
})(RectangleTransform, Vue);
//# sourceMappingURL=javlib-preview-userscript.user.js.map

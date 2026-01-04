// ==UserScript==
// @name         学习通任务一览 Chaoxing Assignment
// @namespace    https://github.com/lcandy2/user.js/tree/main/websites/chaoxing.com/chaoxing-assignment
// @version      1.3
// @author       甜檸Cirtron (lcandy2)
// @description  支持作业、考试列表快速查看 | 电脑端快速查看，绝不错过任何作业与考试 | 【💡操作简单】学习通任务一览，无需任何配置，安装即可使用。【📅功能专注】专为查看作业和考试列表设计，增加提醒功能，确保不错过任何重要任务。【⏱️快速查看】在电脑端快速显示所有待办的作业和即将到来的考试，帮助及时安排学习计划，有效管理时间。【🚀提升体验】这一功能填补了原版学习通的空白，为学术生活带来了极大的便利和效率。
// @license      AGPL-3.0-or-later
// @copyright    lcandy2 All Rights Reserved
// @homepage     https://greasyfork.org/scripts/495345
// @homepageURL  https://greasyfork.org/scripts/495345
// @source       https://github.com/lcandy2/user.js/tree/main/websites/chaoxing.com/chaoxing-assignment
// @match        *://mooc1-api.chaoxing.com/work/stu-work*
// @match        *://i.chaoxing.com/base*
// @match        *://i.mooc.chaoxing.com/space/index*
// @match        *://i.mooc.chaoxing.com/settings*
// @match        *://mooc1-api.chaoxing.com/exam-ans/exam/phone/examcode*
// @require      https://registry.npmmirror.com/vue/3.4.27/files/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://registry.npmmirror.com/vuetify/3.6.6/files/dist/vuetify.min.js
// @require      data:application/javascript,%3B
// @resource     VuetifyStyle                                                   https://registry.npmmirror.com/vuetify/3.6.6/files/dist/vuetify.min.css
// @resource     material-design-icons-iconfont/dist/material-design-icons.css  https://fonts.googlefonts.cn/css?family=Material+Icons
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/495345/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BB%BB%E5%8A%A1%E4%B8%80%E8%A7%88%20Chaoxing%20Assignment.user.js
// @updateURL https://update.greasyfork.org/scripts/495345/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BB%BB%E5%8A%A1%E4%B8%80%E8%A7%88%20Chaoxing%20Assignment.meta.js
// ==/UserScript==

(function (vuetify, vue) {
  'use strict';

  const wrapElements = () => {
    const wrapper = document.createElement("body");
    wrapper.id = "chaoxing-assignment-wrapper";
    while (document.body.firstChild) {
      wrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(wrapper);
    wrapper.style.display = "none";
  };
  const removeStyles = () => {
    removeHtmlStyle();
    const styles = document.querySelectorAll("link[rel=stylesheet]");
    styles.forEach((style) => {
      var _a;
      if ((_a = style.getAttribute("href")) == null ? void 0 : _a.includes("chaoxing")) {
        style.remove();
      }
    });
  };
  const removeHtmlStyle = () => {
    const html = document.querySelector("html");
    html == null ? void 0 : html.removeAttribute("style");
  };
  const keepRemoveHtmlStyle = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          removeHtmlStyle();
        }
      });
    });
    const html = document.querySelector("html");
    html && observer.observe(html, { attributes: true });
  };
  const removeScripts = () => {
    const scripts = document.querySelectorAll("script");
    scripts.forEach((script) => {
      var _a;
      if ((_a = script.getAttribute("src")) == null ? void 0 : _a.includes("chaoxing")) {
        script.remove();
      }
    });
  };
  const urlDetection = () => {
    const url = window.location.href;
    const hash = window.location.hash;
    if (hash.includes("chaoxing-assignment")) {
      if (url.includes("mooc1-api.chaoxing.com/work/stu-work")) {
        return "homework";
      }
      if (url.includes("mooc1-api.chaoxing.com/exam-ans/exam/phone/examcode")) {
        return "exam";
      }
    }
    if (url.includes("i.chaoxing.com/base")) {
      return "home";
    }
    if (url.includes("i.mooc.chaoxing.com/space/index") || url.includes("i.mooc.chaoxing.com/settings")) {
      return "legacyHome";
    }
  };
  const addMenuItem = () => {
    const menubarElement = document.querySelector('div.menubar[role="menubar"]');
    if (menubarElement) {
      const menuItemElement = document.createElement("a");
      menuItemElement.setAttribute("role", "menuitem");
      menuItemElement.setAttribute("focus_element", "0");
      menuItemElement.setAttribute("tabindex", "-1");
      menuItemElement.id = "first1000001";
      menuItemElement.setAttribute("imgname", "icon-home");
      menuItemElement.setAttribute(
        "onclick",
        `setUrl('1000001','https://mooc1-api.chaoxing.com/work/stu-work#chaoxing-assignment',this,'0','全部作业')`
      );
      menuItemElement.setAttribute(
        "dataurl",
        "https://mooc1-api.chaoxing.com/work/stu-work#chaoxing-assignment"
      );
      const iconElement = document.createElement("span");
      iconElement.className = "icon-space icon-bj";
      menuItemElement.appendChild(iconElement);
      const titleElement = document.createElement("h5");
      titleElement.title = "全部作业";
      const boldElement = document.createElement("b");
      boldElement.textContent = "全部作业";
      titleElement.appendChild(boldElement);
      menuItemElement.appendChild(titleElement);
      const arrowElement = document.createElement("span");
      arrowElement.className = "arrow icon-uniE900";
      menuItemElement.appendChild(arrowElement);
      menubarElement.prepend(menuItemElement);
    }
  };
  const addMenuItemExam = () => {
    const menubarElement = document.querySelector('div.menubar[role="menubar"]');
    if (menubarElement) {
      const menuItemElement = document.createElement("a");
      menuItemElement.setAttribute("role", "menuitem");
      menuItemElement.setAttribute("focus_element", "0");
      menuItemElement.setAttribute("tabindex", "-1");
      menuItemElement.id = "first1000002";
      menuItemElement.setAttribute("imgname", "icon-home");
      menuItemElement.setAttribute(
        "onclick",
        `setUrl('1000002','https://mooc1-api.chaoxing.com/exam-ans/exam/phone/examcode#chaoxing-assignment',this,'0','全部考试')`
      );
      menuItemElement.setAttribute(
        "dataurl",
        "https://mooc1-api.chaoxing.com/exam-ans/exam/phone/examcode#chaoxing-assignment"
      );
      const iconElement = document.createElement("span");
      iconElement.className = "icon-space icon-cj";
      menuItemElement.appendChild(iconElement);
      const titleElement = document.createElement("h5");
      titleElement.title = "全部考试";
      const boldElement = document.createElement("b");
      boldElement.textContent = "全部考试";
      titleElement.appendChild(boldElement);
      menuItemElement.appendChild(titleElement);
      const arrowElement = document.createElement("span");
      arrowElement.className = "arrow icon-uniE900";
      menuItemElement.appendChild(arrowElement);
      menubarElement.prepend(menuItemElement);
    }
  };
  const addMenuItemLegacy = () => {
    const funclistulElement = document.querySelector("ul.funclistul");
    if (funclistulElement) {
      const liElement = document.createElement("li");
      liElement.id = "li_chaoxing-assignment-task";
      const spanElement = document.createElement("span");
      liElement.appendChild(spanElement);
      const aElement = document.createElement("a");
      aElement.id = "chaoxing-assignment-task";
      aElement.href = "javascript:switchM('chaoxing-assignment-task','https://mooc1-api.chaoxing.com/work/stu-work#chaoxing-assignment')";
      aElement.target = "_top";
      aElement.title = "全部作业";
      const bIconElement = document.createElement("b");
      bIconElement.className = "liticons znewyun zne_bj_icon";
      aElement.appendChild(bIconElement);
      const emTitleElement = document.createElement("em");
      emTitleElement.setAttribute("style", "font-weight: bolder;");
      emTitleElement.textContent = "全部作业";
      aElement.appendChild(emTitleElement);
      liElement.appendChild(aElement);
      funclistulElement.prepend(liElement);
    }
  };
  const addMenuItemExamLegacy = () => {
    const funclistulElement = document.querySelector("ul.funclistul");
    if (funclistulElement) {
      const liElement = document.createElement("li");
      liElement.id = "li_chaoxing-assignment-exam";
      const spanElement = document.createElement("span");
      liElement.appendChild(spanElement);
      const aElement = document.createElement("a");
      aElement.id = "chaoxing-assignment-exam";
      aElement.href = "javascript:switchM('chaoxing-assignment-exam','https://mooc1-api.chaoxing.com/exam-ans/exam/phone/examcode#chaoxing-assignment')";
      aElement.target = "_top";
      aElement.title = "全部考试";
      const bIconElement = document.createElement("b");
      bIconElement.className = "liticons znewyun zne_jc_icon";
      aElement.appendChild(bIconElement);
      const emTitleElement = document.createElement("em");
      emTitleElement.setAttribute("style", "font-weight: bolder;");
      emTitleElement.textContent = "全部考试";
      aElement.appendChild(emTitleElement);
      liElement.appendChild(aElement);
      funclistulElement.prepend(liElement);
    }
  };
  function extractTasks() {
    const taskElements = document.querySelectorAll(
      "#chaoxing-assignment-wrapper ul.nav > li"
    );
    const tasks = Array.from(taskElements).map((task) => {
      var _a, _b, _c;
      const optionElement = task.querySelector('div[role="option"]');
      let title = "";
      let status = "";
      let uncommitted = false;
      let course = "";
      let leftTime = "";
      if (optionElement) {
        title = ((_a = optionElement.querySelector("p")) == null ? void 0 : _a.textContent) || "";
        const statusElement = optionElement.querySelector("span:nth-of-type(1)");
        status = (statusElement == null ? void 0 : statusElement.textContent) || "";
        uncommitted = (statusElement == null ? void 0 : statusElement.className.includes("status")) || false;
        course = ((_b = optionElement.querySelector("span:nth-of-type(2)")) == null ? void 0 : _b.textContent) || "";
        leftTime = ((_c = optionElement.querySelector(".fr")) == null ? void 0 : _c.textContent) || "";
      }
      const raw = task.getAttribute("data") || "";
      let workId = "";
      let courseId = "";
      let clazzId = "";
      if (raw) {
        const rawUrl = new URL(raw);
        const searchParams = rawUrl.searchParams;
        workId = searchParams.get("taskrefId") || "";
        courseId = searchParams.get("courseId") || "";
        clazzId = searchParams.get("clazzId") || "";
      }
      return {
        title,
        status,
        uncommitted,
        course,
        leftTime,
        workId,
        courseId,
        clazzId,
        raw
      };
    });
    return tasks;
  }
  function extractExams() {
    const examElements = document.querySelectorAll(
      "#chaoxing-assignment-wrapper ul.ks_list > li"
    );
    const exams = Array.from(examElements).map((exam) => {
      var _a, _b, _c, _d;
      const dlElement = exam.querySelector("dl");
      const imgElement = exam.querySelector("div.ks_pic > img");
      let title = "";
      let timeLeft = "";
      let status = "";
      let expired = false;
      let examId = "";
      let courseId = "";
      let classId = "";
      if (dlElement) {
        title = ((_a = dlElement.querySelector("dt")) == null ? void 0 : _a.textContent) || "";
        timeLeft = ((_b = dlElement.querySelector("dd")) == null ? void 0 : _b.textContent) || "";
      }
      if (imgElement) {
        expired = ((_c = imgElement.getAttribute("src")) == null ? void 0 : _c.includes("ks_02")) || false;
      }
      status = ((_d = exam.querySelector("span.ks_state")) == null ? void 0 : _d.textContent) || "";
      const raw = exam.getAttribute("data") || "";
      if (raw) {
        const rawWithHost = window.location.protocol + "//" + window.location.host + raw;
        const rawUrl = new URL(rawWithHost);
        const searchParams = rawUrl.searchParams;
        examId = searchParams.get("taskrefId") || "";
        courseId = searchParams.get("courseId") || "";
        classId = searchParams.get("classId") || "";
      }
      const finished = status.includes("已完成") || status.includes("待批阅");
      return {
        title,
        status,
        timeLeft,
        expired,
        finished,
        examId,
        courseId,
        classId,
        raw
      };
    });
    return exams;
  }
  const API_VISIT_COURSE = "https://mooc1.chaoxing.com/visit/stucoursemiddle?ismooc2=1";
  const API_OPEN_EXAM = "https://mooc1-api.chaoxing.com/exam-ans/exam/test/examcode/examnotes";
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("VuetifyStyle");
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "tasks-list",
    setup(__props) {
      const extractedData = extractTasks();
      const headers = [
        { key: "title", title: "作业名称" },
        { key: "course", title: "课程" },
        { key: "leftTime", title: "剩余时间" },
        { key: "status", title: "状态" },
        { key: "action", title: "", sortable: false }
      ];
      const search = vue.ref("");
      const getCourseLinkHref = (item) => {
        const courseId = item.courseId;
        const clazzId = item.clazzId;
        const requestUrl = new URL(API_VISIT_COURSE);
        requestUrl.searchParams.append("courseid", courseId);
        requestUrl.searchParams.append("clazzid", clazzId);
        requestUrl.searchParams.append("pageHeader", "8");
        return requestUrl.href;
      };
      return (_ctx, _cache) => {
        const _component_v_text_field = vue.resolveComponent("v-text-field");
        const _component_v_btn = vue.resolveComponent("v-btn");
        const _component_v_data_table = vue.resolveComponent("v-data-table");
        const _component_v_card = vue.resolveComponent("v-card");
        return vue.openBlock(), vue.createBlock(_component_v_card, {
          title: "作业列表",
          variant: "flat"
        }, {
          text: vue.withCtx(() => [
            vue.createVNode(_component_v_text_field, {
              modelValue: search.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => search.value = $event),
              label: "搜索",
              "prepend-inner-icon": "search",
              variant: "outlined",
              "hide-details": "",
              "single-line": ""
            }, null, 8, ["modelValue"])
          ]),
          default: vue.withCtx(() => [
            vue.createVNode(_component_v_data_table, {
              items: vue.unref(extractedData),
              search: search.value,
              hover: "",
              headers,
              sticky: "",
              "items-per-page": "-1",
              "hide-default-footer": ""
            }, {
              "item.action": vue.withCtx(({ item }) => [
                vue.createVNode(_component_v_btn, {
                  variant: item.uncommitted ? "tonal" : "plain",
                  color: "primary",
                  href: getCourseLinkHref(item),
                  target: "_blank"
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(item.uncommitted ? "立即完成" : "查看详情"), 1)
                  ]),
                  _: 2
                }, 1032, ["variant", "href"])
              ]),
              _: 1
            }, 8, ["items", "search"])
          ]),
          _: 1
        });
      };
    }
  });
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(_sfc_main$2);
      };
    }
  });
  cssLoader("material-design-icons-iconfont/dist/material-design-icons.css");
  function isObject(obj) {
    return obj !== null && typeof obj === "object" && !Array.isArray(obj);
  }
  function pick(obj, paths) {
    const found = {};
    const keys = new Set(Object.keys(obj));
    for (const path of paths) {
      if (keys.has(path)) {
        found[path] = obj[path];
      }
    }
    return found;
  }
  function mergeDeep() {
    let source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let target = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let arrayFn = arguments.length > 2 ? arguments[2] : void 0;
    const out = {};
    for (const key in source) {
      out[key] = source[key];
    }
    for (const key in target) {
      const sourceProperty = source[key];
      const targetProperty = target[key];
      if (isObject(sourceProperty) && isObject(targetProperty)) {
        out[key] = mergeDeep(sourceProperty, targetProperty, arrayFn);
        continue;
      }
      if (Array.isArray(sourceProperty) && Array.isArray(targetProperty) && arrayFn) {
        out[key] = arrayFn(sourceProperty, targetProperty);
        continue;
      }
      out[key] = targetProperty;
    }
    return out;
  }
  function toKebabCase() {
    let str = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    if (toKebabCase.cache.has(str))
      return toKebabCase.cache.get(str);
    const kebab = str.replace(/[^a-z]/gi, "-").replace(/\B([A-Z])/g, "-$1").toLowerCase();
    toKebabCase.cache.set(str, kebab);
    return kebab;
  }
  toKebabCase.cache = /* @__PURE__ */ new Map();
  function consoleWarn(message) {
    vue.warn(`Vuetify: ${message}`);
  }
  function propsFactory(props, source) {
    return (defaults) => {
      return Object.keys(props).reduce((obj, prop) => {
        const isObjectDefinition = typeof props[prop] === "object" && props[prop] != null && !Array.isArray(props[prop]);
        const definition = isObjectDefinition ? props[prop] : {
          type: props[prop]
        };
        if (defaults && prop in defaults) {
          obj[prop] = {
            ...definition,
            default: defaults[prop]
          };
        } else {
          obj[prop] = definition;
        }
        if (source && !obj[prop].source) {
          obj[prop].source = source;
        }
        return obj;
      }, {});
    };
  }
  const DefaultsSymbol = Symbol.for("vuetify:defaults");
  function injectDefaults() {
    const defaults = vue.inject(DefaultsSymbol);
    if (!defaults)
      throw new Error("[Vuetify] Could not find defaults instance");
    return defaults;
  }
  function propIsDefined(vnode, prop) {
    var _a, _b;
    return typeof ((_a = vnode.props) == null ? void 0 : _a[prop]) !== "undefined" || typeof ((_b = vnode.props) == null ? void 0 : _b[toKebabCase(prop)]) !== "undefined";
  }
  function internalUseDefaults() {
    let props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let name = arguments.length > 1 ? arguments[1] : void 0;
    let defaults = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : injectDefaults();
    const vm = getCurrentInstance("useDefaults");
    name = name ?? vm.type.name ?? vm.type.__name;
    if (!name) {
      throw new Error("[Vuetify] Could not determine component name");
    }
    const componentDefaults = vue.computed(() => {
      var _a;
      return (_a = defaults.value) == null ? void 0 : _a[props._as ?? name];
    });
    const _props = new Proxy(props, {
      get(target, prop) {
        var _a, _b, _c, _d;
        const propValue = Reflect.get(target, prop);
        if (prop === "class" || prop === "style") {
          return [(_a = componentDefaults.value) == null ? void 0 : _a[prop], propValue].filter((v) => v != null);
        } else if (typeof prop === "string" && !propIsDefined(vm.vnode, prop)) {
          return ((_b = componentDefaults.value) == null ? void 0 : _b[prop]) ?? ((_d = (_c = defaults.value) == null ? void 0 : _c.global) == null ? void 0 : _d[prop]) ?? propValue;
        }
        return propValue;
      }
    });
    const _subcomponentDefaults = vue.shallowRef();
    vue.watchEffect(() => {
      if (componentDefaults.value) {
        const subComponents = Object.entries(componentDefaults.value).filter((_ref) => {
          let [key] = _ref;
          return key.startsWith(key[0].toUpperCase());
        });
        _subcomponentDefaults.value = subComponents.length ? Object.fromEntries(subComponents) : void 0;
      } else {
        _subcomponentDefaults.value = void 0;
      }
    });
    function provideSubDefaults() {
      const injected = injectSelf(DefaultsSymbol, vm);
      vue.provide(DefaultsSymbol, vue.computed(() => {
        return _subcomponentDefaults.value ? mergeDeep((injected == null ? void 0 : injected.value) ?? {}, _subcomponentDefaults.value) : injected == null ? void 0 : injected.value;
      }));
    }
    return {
      props: _props,
      provideSubDefaults
    };
  }
  function defineComponent(options) {
    options._setup = options._setup ?? options.setup;
    if (!options.name) {
      consoleWarn("The component is missing an explicit name, unable to generate default prop value");
      return options;
    }
    if (options._setup) {
      options.props = propsFactory(options.props ?? {}, options.name)();
      const propKeys = Object.keys(options.props).filter((key) => key !== "class" && key !== "style");
      options.filterProps = function filterProps(props) {
        return pick(props, propKeys);
      };
      options.props._as = String;
      options.setup = function setup(props, ctx) {
        const defaults = injectDefaults();
        if (!defaults.value)
          return options._setup(props, ctx);
        const {
          props: _props,
          provideSubDefaults
        } = internalUseDefaults(props, props._as ?? options.name, defaults);
        const setupBindings = options._setup(_props, ctx);
        provideSubDefaults();
        return setupBindings;
      };
    }
    return options;
  }
  function genericComponent() {
    let exposeDefaults = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
    return (options) => (exposeDefaults ? defineComponent : vue.defineComponent)(options);
  }
  function getCurrentInstance(name, message) {
    const vm = vue.getCurrentInstance();
    if (!vm) {
      throw new Error(`[Vuetify] ${name} ${"must be called from inside a setup function"}`);
    }
    return vm;
  }
  function injectSelf(key) {
    let vm = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstance("injectSelf");
    const {
      provides
    } = vm;
    if (provides && key in provides) {
      return provides[key];
    }
    return void 0;
  }
  const IconValue = [String, Function, Object, Array];
  const makeIconProps = propsFactory({
    icon: {
      type: IconValue
    },
    // Could not remove this and use makeTagProps, types complained because it is not required
    tag: {
      type: String,
      required: true
    }
  }, "icon");
  genericComponent()({
    name: "VComponentIcon",
    props: makeIconProps(),
    setup(props, _ref) {
      let {
        slots
      } = _ref;
      return () => {
        const Icon = props.icon;
        return vue.createVNode(props.tag, null, {
          default: () => {
            var _a;
            return [props.icon ? vue.createVNode(Icon, null, null) : (_a = slots.default) == null ? void 0 : _a.call(slots)];
          }
        });
      };
    }
  });
  defineComponent({
    name: "VSvgIcon",
    inheritAttrs: false,
    props: makeIconProps(),
    setup(props, _ref2) {
      let {
        attrs
      } = _ref2;
      return () => {
        return vue.createVNode(props.tag, vue.mergeProps(attrs, {
          "style": null
        }), {
          default: () => [vue.createVNode("svg", {
            "class": "v-icon__svg",
            "xmlns": "http://www.w3.org/2000/svg",
            "viewBox": "0 0 24 24",
            "role": "img",
            "aria-hidden": "true"
          }, [Array.isArray(props.icon) ? props.icon.map((path) => Array.isArray(path) ? vue.createVNode("path", {
            "d": path[0],
            "fill-opacity": path[1]
          }, null) : vue.createVNode("path", {
            "d": path
          }, null)) : vue.createVNode("path", {
            "d": props.icon
          }, null)])]
        });
      };
    }
  });
  const VLigatureIcon = defineComponent({
    name: "VLigatureIcon",
    props: makeIconProps(),
    setup(props) {
      return () => {
        return vue.createVNode(props.tag, null, {
          default: () => [props.icon]
        });
      };
    }
  });
  defineComponent({
    name: "VClassIcon",
    props: makeIconProps(),
    setup(props) {
      return () => {
        return vue.createVNode(props.tag, {
          "class": props.icon
        }, null);
      };
    }
  });
  const aliases = {
    collapse: "keyboard_arrow_up",
    complete: "check",
    cancel: "cancel",
    close: "close",
    delete: "cancel",
    // delete (e.g. v-chip close)
    clear: "cancel",
    success: "check_circle",
    info: "info",
    warning: "priority_high",
    error: "warning",
    prev: "chevron_left",
    next: "chevron_right",
    checkboxOn: "check_box",
    checkboxOff: "check_box_outline_blank",
    checkboxIndeterminate: "indeterminate_check_box",
    delimiter: "fiber_manual_record",
    // for carousel
    sortAsc: "arrow_upward",
    sortDesc: "arrow_downward",
    expand: "keyboard_arrow_down",
    menu: "menu",
    subgroup: "arrow_drop_down",
    dropdown: "arrow_drop_down",
    radioOn: "radio_button_checked",
    radioOff: "radio_button_unchecked",
    edit: "edit",
    ratingEmpty: "star_border",
    ratingFull: "star",
    ratingHalf: "star_half",
    loading: "cached",
    first: "first_page",
    last: "last_page",
    unfold: "unfold_more",
    file: "attach_file",
    plus: "add",
    minus: "remove",
    calendar: "event",
    treeviewCollapse: "arrow_drop_down",
    treeviewExpand: "arrow_right",
    eyeDropper: "colorize"
  };
  const md = {
    // Not using mergeProps here, functional components merge props by default (?)
    component: (props) => vue.h(VLigatureIcon, {
      ...props,
      class: "material-icons"
    })
  };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "exams-list",
    setup(__props) {
      const extractedData = extractExams();
      const headers = [
        { key: "title", title: "考试名称" },
        { key: "timeLeft", title: "剩余时间" },
        { key: "status", title: "状态" },
        { key: "action", title: "", sortable: false }
      ];
      const search = vue.ref("");
      const getCourseLinkHref = (item) => {
        const courseId = item.courseId;
        const classId = item.classId;
        const examId = item.examId;
        const requestUrl = new URL(API_OPEN_EXAM);
        requestUrl.searchParams.append("courseId", courseId);
        requestUrl.searchParams.append("classId", classId);
        requestUrl.searchParams.append("examId", examId);
        return requestUrl.href;
      };
      return (_ctx, _cache) => {
        const _component_v_text_field = vue.resolveComponent("v-text-field");
        const _component_v_btn = vue.resolveComponent("v-btn");
        const _component_v_data_table = vue.resolveComponent("v-data-table");
        const _component_v_card = vue.resolveComponent("v-card");
        return vue.openBlock(), vue.createBlock(_component_v_card, {
          title: "考试列表",
          variant: "flat"
        }, {
          text: vue.withCtx(() => [
            vue.createVNode(_component_v_text_field, {
              modelValue: search.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => search.value = $event),
              label: "搜索",
              "prepend-inner-icon": "search",
              variant: "outlined",
              "hide-details": "",
              "single-line": ""
            }, null, 8, ["modelValue"])
          ]),
          default: vue.withCtx(() => [
            vue.createVNode(_component_v_data_table, {
              items: vue.unref(extractedData),
              search: search.value,
              hover: "",
              headers,
              sticky: "",
              "items-per-page": "-1",
              "hide-default-footer": ""
            }, {
              "item.action": vue.withCtx(({ item }) => [
                vue.createVNode(_component_v_btn, {
                  variant: item.finished || item.expired ? "plain" : "tonal",
                  color: "primary",
                  href: getCourseLinkHref(item),
                  target: "_blank"
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(item.finished || item.expired ? "查看详情" : "前往考试"), 1)
                  ]),
                  _: 2
                }, 1032, ["variant", "href"])
              ]),
              _: 1
            }, 8, ["items", "search"])
          ]),
          _: 1
        });
      };
    }
  });
  const appendApp = () => {
    const vuetify$1 = vuetify.createVuetify({
      // components,
      // directives,
      icons: {
        defaultSet: "md",
        aliases,
        sets: {
          md
        }
      }
    });
    let app = _sfc_main$1;
    const urlDetect2 = urlDetection();
    if (urlDetect2 === "homework") {
      app = _sfc_main$2;
    }
    if (urlDetect2 === "exam") {
      app = _sfc_main;
    }
    vue.createApp(app).use(vuetify$1).mount(
      (() => {
        const app2 = document.createElement("div");
        document.body.append(app2);
        return app2;
      })()
    );
  };
  const urlDetect = urlDetection();
  if (urlDetect === "homework") {
    wrapElements();
    removeStyles();
    removeScripts();
    appendApp();
  }
  if (urlDetect === "exam") {
    wrapElements();
    removeStyles();
    removeScripts();
    keepRemoveHtmlStyle();
    appendApp();
  }
  if (urlDetect === "home") {
    addMenuItemExam();
    addMenuItem();
  }
  if (urlDetect === "legacyHome") {
    addMenuItemExamLegacy();
    addMenuItemLegacy();
  }

})(Vuetify, Vue);
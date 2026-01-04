// ==UserScript==
// @name         接口模拟
// @namespace    qiyuor2/mock
// @version      1.1.1
// @author       qiyuor2
// @description  接口响应修改
// @license      MIT
// @match        ://*/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.15/dist/vue.global.prod.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/488511/%E6%8E%A5%E5%8F%A3%E6%A8%A1%E6%8B%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/488511/%E6%8E%A5%E5%8F%A3%E6%A8%A1%E6%8B%9F.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const o=document.createElement("style");o.textContent=e,document.head.append(o)})(' .edit[data-v-8e873d24]{padding:.8em .7em}input[type=text][data-v-8e873d24],textarea[data-v-8e873d24]{box-sizing:border-box;margin:0 0 1em;background-color:#fff;border-color:#6b7280;font-size:1em;line-height:1.5em;display:block;width:100%;border-radius:.375em;border-width:0px;padding:.5em .875em;box-shadow:inset 0 0 #fff,inset 0 0 0 1px #d1d5db,0 1px 2px #0000000d,0 0 #0000}textarea[data-v-8e873d24]{resize:none}.button[data-v-8e873d24]{flex:1;margin-bottom:1em}.checkbox[data-v-8e873d24]{padding-left:.2em;display:flex;align-items:center;gap:.25em;margin-bottom:1em}.rule-item[data-v-53e6e7f3]{box-sizing:border-box;padding:4px 18px;height:50px;display:grid;grid-template-areas:"name . enable" "url contains enable";cursor:pointer;background-color:#fff;transition:background-color .3s}.rule-item[data-v-53e6e7f3]:hover{background-color:#f8fafc;transition:background-color .3s}.name[data-v-53e6e7f3]{grid-area:name;font-size:1em;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-right:1em;color:#000c}.url[data-v-53e6e7f3]{grid-area:url;font-size:.9em;font-weight:500;color:#00000080;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.contains[data-v-53e6e7f3]{grid-area:contains;color:#00000080;font-size:.9em}.enable[data-v-53e6e7f3]{grid-area:enable;display:flex;align-items:center;justify-content:flex-end;margin-left:1em;font-size:.8em}.rule-item--record[data-v-53e6e7f3]{display:block;height:unset}.rule-item--record .url[data-v-53e6e7f3]{width:100%;word-break:break-all;white-space:normal;overflow:visible;text-overflow:clip}.rule-item--record .enable[data-v-53e6e7f3],.rule-item--record .name[data-v-53e6e7f3]{display:none}.rules[data-v-12479193]{height:100%;padding:.8em 0;overflow-y:auto}.margin[data-v-12479193]{margin:0 .7em .7em}.list[data-v-12479193]{margin-top:1em}.empty[data-v-12479193]{text-align:center;color:#00000080}.entry[data-v-6b8bc4f1]{writing-mode:vertical-rl;position:fixed;background-color:#fff;z-index:1999;border-radius:999px;-webkit-user-select:none;user-select:none;cursor:pointer;box-shadow:0 1px 3px #0000001a,0 1px 2px -1px #0000001a;padding:10px 4px;font-size:14px;letter-spacing:2px;border:1px solid #efefef;transition:box-shadow .3s ease}.entry[data-v-6b8bc4f1]:hover{box-shadow:0 4px 6px -1px #0000001a,0 2px 4px -2px #0000001a;transition:box-shadow .3s ease}.floating[data-v-bd804120]{position:fixed;top:60px;bottom:60px;left:24px;right:24px;max-width:400px;background:#fff;box-shadow:0 10px 15px -3px #0000001a,0 4px 6px -4px #0000001a;z-index:999;border:1px solid #efefef;border-radius:.6em}#uss-mock-app{font-size:16px}.code-text-style{font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace}.button{text-align:center;padding:.3em .45em;border:1px solid #efefef;border-radius:.125rem;cursor:pointer}.button--green{background-color:#22c55e;border-color:#22c55e;color:#fff}.button--red{background-color:#ef4444;border-color:#ef4444;color:#fff}.button--gray{background-color:#f3f4f6;border-color:#f3f4f6;color:#6b7280}.buttons{display:flex;gap:1em}.buttons .button{flex:1} ');

(function (vue) {
  'use strict';

  function tryOnScopeDispose(fn) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn);
      return true;
    }
    return false;
  }
  function createGlobalState(stateFactory) {
    let initialized = false;
    let state;
    const scope = vue.effectScope(true);
    return (...args) => {
      if (!initialized) {
        state = scope.run(() => stateFactory(...args));
        initialized = true;
      }
      return state;
    };
  }
  function toValue(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }
  const isClient = typeof window !== "undefined" && typeof document !== "undefined";
  typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
  const toString = Object.prototype.toString;
  const isObject = (val) => toString.call(val) === "[object Object]";
  const noop = () => {
  };
  function toRefs(objectRef, options = {}) {
    if (!vue.isRef(objectRef))
      return vue.toRefs(objectRef);
    const result2 = Array.isArray(objectRef.value) ? Array.from({ length: objectRef.value.length }) : {};
    for (const key in objectRef.value) {
      result2[key] = vue.customRef(() => ({
        get() {
          return objectRef.value[key];
        },
        set(v) {
          var _a;
          const replaceRef = (_a = toValue(options.replaceRef)) != null ? _a : true;
          if (replaceRef) {
            if (Array.isArray(objectRef.value)) {
              const copy = [...objectRef.value];
              copy[key] = v;
              objectRef.value = copy;
            } else {
              const newObject = { ...objectRef.value, [key]: v };
              Object.setPrototypeOf(newObject, Object.getPrototypeOf(objectRef.value));
              objectRef.value = newObject;
            }
          } else {
            objectRef.value[key] = v;
          }
        }
      }));
    }
    return result2;
  }
  function useToggle(initialValue = false, options = {}) {
    const {
      truthyValue = true,
      falsyValue = false
    } = options;
    const valueIsRef = vue.isRef(initialValue);
    const _value = vue.ref(initialValue);
    function toggle(value) {
      if (arguments.length) {
        _value.value = value;
        return _value.value;
      } else {
        const truthy = toValue(truthyValue);
        _value.value = _value.value === truthy ? toValue(falsyValue) : truthy;
        return _value.value;
      }
    }
    if (valueIsRef)
      return toggle;
    else
      return [_value, toggle];
  }
  function unrefElement(elRef) {
    var _a;
    const plain = toValue(elRef);
    return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
  }
  const defaultWindow = isClient ? window : void 0;
  function useEventListener(...args) {
    let target;
    let events2;
    let listeners;
    let options;
    if (typeof args[0] === "string" || Array.isArray(args[0])) {
      [events2, listeners, options] = args;
      target = defaultWindow;
    } else {
      [target, events2, listeners, options] = args;
    }
    if (!target)
      return noop;
    if (!Array.isArray(events2))
      events2 = [events2];
    if (!Array.isArray(listeners))
      listeners = [listeners];
    const cleanups = [];
    const cleanup = () => {
      cleanups.forEach((fn) => fn());
      cleanups.length = 0;
    };
    const register = (el, event, listener, options2) => {
      el.addEventListener(event, listener, options2);
      return () => el.removeEventListener(event, listener, options2);
    };
    const stopWatch = vue.watch(
      () => [unrefElement(target), toValue(options)],
      ([el, options2]) => {
        cleanup();
        if (!el)
          return;
        const optionsClone = isObject(options2) ? { ...options2 } : options2;
        cleanups.push(
          ...events2.flatMap((event) => {
            return listeners.map((listener) => register(el, event, listener, optionsClone));
          })
        );
      },
      { immediate: true, flush: "post" }
    );
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose(stop);
    return stop;
  }
  function useDraggable(target, options = {}) {
    var _a, _b;
    const {
      pointerTypes,
      preventDefault: preventDefault2,
      stopPropagation,
      exact,
      onMove,
      onEnd,
      onStart,
      initialValue,
      axis = "both",
      draggingElement = defaultWindow,
      containerElement,
      handle: draggingHandle = target
    } = options;
    const position = vue.ref(
      (_a = toValue(initialValue)) != null ? _a : { x: 0, y: 0 }
    );
    const pressedDelta = vue.ref();
    const filterEvent = (e) => {
      if (pointerTypes)
        return pointerTypes.includes(e.pointerType);
      return true;
    };
    const handleEvent = (e) => {
      if (toValue(preventDefault2))
        e.preventDefault();
      if (toValue(stopPropagation))
        e.stopPropagation();
    };
    const start = (e) => {
      var _a2;
      if (!filterEvent(e))
        return;
      if (toValue(exact) && e.target !== toValue(target))
        return;
      const container = toValue(containerElement);
      const containerRect = (_a2 = container == null ? void 0 : container.getBoundingClientRect) == null ? void 0 : _a2.call(container);
      const targetRect = toValue(target).getBoundingClientRect();
      const pos = {
        x: e.clientX - (container ? targetRect.left - containerRect.left + container.scrollLeft : targetRect.left),
        y: e.clientY - (container ? targetRect.top - containerRect.top + container.scrollTop : targetRect.top)
      };
      if ((onStart == null ? void 0 : onStart(pos, e)) === false)
        return;
      pressedDelta.value = pos;
      handleEvent(e);
    };
    const move = (e) => {
      var _a2;
      if (!filterEvent(e))
        return;
      if (!pressedDelta.value)
        return;
      const container = toValue(containerElement);
      const containerRect = (_a2 = container == null ? void 0 : container.getBoundingClientRect) == null ? void 0 : _a2.call(container);
      const targetRect = toValue(target).getBoundingClientRect();
      let { x, y } = position.value;
      if (axis === "x" || axis === "both") {
        x = e.clientX - pressedDelta.value.x;
        if (container)
          x = Math.min(Math.max(0, x), containerRect.width + container.scrollLeft - targetRect.width);
      }
      if (axis === "y" || axis === "both") {
        y = e.clientY - pressedDelta.value.y;
        if (container)
          y = Math.min(Math.max(0, y), containerRect.height + container.scrollTop - targetRect.height);
      }
      position.value = {
        x,
        y
      };
      onMove == null ? void 0 : onMove(position.value, e);
      handleEvent(e);
    };
    const end = (e) => {
      if (!filterEvent(e))
        return;
      if (!pressedDelta.value)
        return;
      pressedDelta.value = void 0;
      onEnd == null ? void 0 : onEnd(position.value, e);
      handleEvent(e);
    };
    if (isClient) {
      const config = { capture: (_b = options.capture) != null ? _b : true };
      useEventListener(draggingHandle, "pointerdown", start, config);
      useEventListener(draggingElement, "pointermove", move, config);
      useEventListener(draggingElement, "pointerup", end, config);
    }
    return {
      ...toRefs(position),
      position,
      isDragging: vue.computed(() => !!pressedDelta.value),
      style: vue.computed(
        () => `left:${position.value.x}px;top:${position.value.y}px;`
      )
    };
  }
  const UseMouseBuiltinExtractors = {
    page: (event) => [event.pageX, event.pageY],
    client: (event) => [event.clientX, event.clientY],
    screen: (event) => [event.screenX, event.screenY],
    movement: (event) => event instanceof Touch ? null : [event.movementX, event.movementY]
  };
  function useMouse(options = {}) {
    const {
      type = "page",
      touch = true,
      resetOnTouchEnds = false,
      initialValue = { x: 0, y: 0 },
      window: window2 = defaultWindow,
      target = window2,
      scroll = true,
      eventFilter
    } = options;
    let _prevMouseEvent = null;
    const x = vue.ref(initialValue.x);
    const y = vue.ref(initialValue.y);
    const sourceType = vue.ref(null);
    const extractor = typeof type === "function" ? type : UseMouseBuiltinExtractors[type];
    const mouseHandler = (event) => {
      const result2 = extractor(event);
      _prevMouseEvent = event;
      if (result2) {
        [x.value, y.value] = result2;
        sourceType.value = "mouse";
      }
    };
    const touchHandler = (event) => {
      if (event.touches.length > 0) {
        const result2 = extractor(event.touches[0]);
        if (result2) {
          [x.value, y.value] = result2;
          sourceType.value = "touch";
        }
      }
    };
    const scrollHandler = () => {
      if (!_prevMouseEvent || !window2)
        return;
      const pos = extractor(_prevMouseEvent);
      if (_prevMouseEvent instanceof MouseEvent && pos) {
        x.value = pos[0] + window2.scrollX;
        y.value = pos[1] + window2.scrollY;
      }
    };
    const reset = () => {
      x.value = initialValue.x;
      y.value = initialValue.y;
    };
    const mouseHandlerWrapper = eventFilter ? (event) => eventFilter(() => mouseHandler(event), {}) : (event) => mouseHandler(event);
    const touchHandlerWrapper = eventFilter ? (event) => eventFilter(() => touchHandler(event), {}) : (event) => touchHandler(event);
    const scrollHandlerWrapper = eventFilter ? () => eventFilter(() => scrollHandler(), {}) : () => scrollHandler();
    if (target) {
      const listenerOptions = { passive: true };
      useEventListener(target, ["mousemove", "dragover"], mouseHandlerWrapper, listenerOptions);
      if (touch && type !== "movement") {
        useEventListener(target, ["touchstart", "touchmove"], touchHandlerWrapper, listenerOptions);
        if (resetOnTouchEnds)
          useEventListener(target, "touchend", reset, listenerOptions);
      }
      if (scroll && type === "page")
        useEventListener(window2, "scroll", scrollHandlerWrapper, { passive: true });
    }
    return {
      x,
      y,
      sourceType
    };
  }
  function useMouseInElement(target, options = {}) {
    const {
      handleOutside = true,
      window: window2 = defaultWindow
    } = options;
    const type = options.type || "page";
    const { x, y, sourceType } = useMouse(options);
    const targetRef = vue.ref(target != null ? target : window2 == null ? void 0 : window2.document.body);
    const elementX = vue.ref(0);
    const elementY = vue.ref(0);
    const elementPositionX = vue.ref(0);
    const elementPositionY = vue.ref(0);
    const elementHeight = vue.ref(0);
    const elementWidth = vue.ref(0);
    const isOutside = vue.ref(true);
    let stop = () => {
    };
    if (window2) {
      stop = vue.watch(
        [targetRef, x, y],
        () => {
          const el = unrefElement(targetRef);
          if (!el)
            return;
          const {
            left,
            top,
            width,
            height
          } = el.getBoundingClientRect();
          elementPositionX.value = left + (type === "page" ? window2.pageXOffset : 0);
          elementPositionY.value = top + (type === "page" ? window2.pageYOffset : 0);
          elementHeight.value = height;
          elementWidth.value = width;
          const elX = x.value - elementPositionX.value;
          const elY = y.value - elementPositionY.value;
          isOutside.value = width === 0 || height === 0 || elX < 0 || elY < 0 || elX > width || elY > height;
          if (handleOutside || !isOutside.value) {
            elementX.value = elX;
            elementY.value = elY;
          }
        },
        { immediate: true }
      );
      useEventListener(document, "mouseleave", () => {
        isOutside.value = true;
      });
    }
    return {
      x,
      y,
      sourceType,
      elementX,
      elementY,
      elementPositionX,
      elementPositionY,
      elementHeight,
      elementWidth,
      isOutside,
      stop
    };
  }
  const Pages$1 = {
    Rules: "page-rules",
    Edit: "page-edit"
  };
  const usePageStore = createGlobalState(() => {
    const current = vue.ref(Pages$1.Rules);
    function to(name) {
      current.value = name;
    }
    return { current, to };
  });
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  function useGMStorage(key, defaultValue) {
    const value = vue.ref(_GM_getValue(key, defaultValue));
    vue.watch(value, (newValue) => {
      _GM_setValue(key, newValue);
    });
    return value;
  }
  const useRuleStore = createGlobalState(() => {
    const rules2 = useGMStorage("@uss/mock/rules", []);
    function get(url) {
      return rules2.value.find((rule) => rule.url === url);
    }
    function set(arg1, rule) {
      const copyRules = rules2.value.slice();
      if (typeof arg1 === "number") {
        copyRules[arg1] = { ...copyRules[arg1], ...rule };
        rules2.value = copyRules;
        return;
      }
      const index = copyRules.findIndex((r) => r.url === arg1);
      if (index === -1) {
        return;
      }
      copyRules[index] = { ...copyRules[index], ...rule };
      rules2.value = copyRules;
    }
    function add(rule) {
      rules2.value.push(rule);
      return rules2.value.length - 1;
    }
    function remove(arg1) {
      if (typeof arg1 === "number") {
        rules2.value.splice(arg1, 1);
        return;
      }
      for (let i = 0; i < rules2.value.length; i++) {
        if (rules2.value[i].url === arg1) {
          rules2.value.splice(i, 1);
          return;
        }
      }
    }
    const current = vue.ref(-1);
    const record = /* @__PURE__ */ new Map();
    return { rules: rules2, add, remove, get, set, current, record };
  });
  const _withScopeId = (n) => (vue.pushScopeId("data-v-8e873d24"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$3 = { class: "edit" };
  const _hoisted_2$2 = { class: "checkbox" };
  const _hoisted_3$2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("label", { for: "contains" }, "包含模式", -1));
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "edit",
    setup(__props) {
      const router = usePageStore();
      const ruleStore2 = useRuleStore();
      const rule = vue.computed(() => ruleStore2.rules.value[ruleStore2.current.value]);
      const responseText = vue.ref(JSON.stringify(rule.value.response, null, 2));
      const isContains = vue.ref(rule.value.contains);
      function save() {
        try {
          console.log(responseText.value);
          const parsed = JSON.parse(responseText.value);
          ruleStore2.set(ruleStore2.current.value, { response: parsed, contains: isContains.value });
          router.to(Pages$1.Rules);
        } catch (error) {
          alert("JSON 格式错误");
        }
      }
      function back() {
        if (rule.value.name === "") {
          ruleStore2.remove(ruleStore2.current.value);
        }
        router.to(Pages$1.Rules);
      }
      function remove() {
        ruleStore2.remove(ruleStore2.current.value);
        router.to(Pages$1.Rules);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
          vue.createElementVNode("div", { class: "buttons" }, [
            vue.createElementVNode("div", {
              class: "button button--red",
              onClick: remove
            }, "删除"),
            vue.createElementVNode("div", {
              class: "button",
              onClick: back
            }, "返回")
          ]),
          vue.createElementVNode("div", {
            class: "button button--green",
            onClick: save
          }, "保存"),
          vue.withDirectives(vue.createElementVNode("input", {
            type: "text",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => rule.value.name = $event),
            placeholder: "名称"
          }, null, 512), [
            [vue.vModelText, rule.value.name]
          ]),
          vue.withDirectives(vue.createElementVNode("input", {
            type: "text",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => rule.value.url = $event),
            placeholder: "URL"
          }, null, 512), [
            [vue.vModelText, rule.value.url]
          ]),
          vue.createElementVNode("div", _hoisted_2$2, [
            _hoisted_3$2,
            vue.withDirectives(vue.createElementVNode("input", {
              type: "checkbox",
              name: "contains",
              id: "contains",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => isContains.value = $event)
            }, null, 512), [
              [vue.vModelCheckbox, isContains.value]
            ])
          ]),
          vue.withDirectives(vue.createElementVNode("textarea", {
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => responseText.value = $event),
            rows: "15"
          }, null, 512), [
            [vue.vModelText, responseText.value]
          ])
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
  const edit = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-8e873d24"]]);
  const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: edit
  }, Symbol.toStringTag, { value: "Module" }));
  const _hoisted_1$2 = { class: "name" };
  const _hoisted_2$1 = { class: "url" };
  const _hoisted_3$1 = { class: "enable" };
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "RuleItem",
    props: {
      index: {},
      name: {},
      url: {},
      enable: { type: Boolean },
      contains: { type: Boolean },
      type: { default: "normal" }
    },
    setup(__props) {
      const props = __props;
      const ruleStore2 = useRuleStore();
      function toggle() {
        ruleStore2.set(props.index, { enable: !props.enable });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(["rule-item", `rule-item--${_ctx.type}`])
        }, [
          vue.createElementVNode("div", _hoisted_1$2, vue.toDisplayString(_ctx.name), 1),
          vue.createElementVNode("div", _hoisted_2$1, vue.toDisplayString(_ctx.url.toString()), 1),
          vue.createElementVNode("div", _hoisted_3$1, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["button", _ctx.enable ? "button--green" : "button--gray"]),
              onClick: vue.withModifiers(toggle, ["stop"])
            }, vue.toDisplayString(_ctx.enable ? "已开启" : "禁用中"), 3)
          ])
        ], 2);
      };
    }
  });
  const RuleItem = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-53e6e7f3"]]);
  const _hoisted_1$1 = { class: "rules" };
  const _hoisted_2 = { class: "margin buttons" };
  const _hoisted_3 = {
    key: 0,
    class: "record"
  };
  const _hoisted_4 = { class: "list" };
  const _hoisted_5 = {
    key: 1,
    class: "list"
  };
  const _hoisted_6 = {
    key: 2,
    class: "empty"
  };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "rules",
    setup(__props) {
      const ruleStore2 = useRuleStore();
      const router = usePageStore();
      function toEdit(index) {
        ruleStore2.current.value = index;
        router.to(Pages$1.Edit);
      }
      function add() {
        ruleStore2.current.value = ruleStore2.add({ name: "", url: "", response: {}, contains: true, enable: true });
        router.to(Pages$1.Edit);
      }
      function showAll() {
        console.log(ruleStore2.rules.value);
      }
      const [recordVisible, toggleRecord] = useToggle(false);
      function addRecord(url, response) {
        ruleStore2.current.value = ruleStore2.add({ name: "", url, response, contains: true, enable: true });
        router.to(Pages$1.Edit);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.createElementVNode("div", {
            class: "margin button",
            onClick: add
          }, "添加新规则"),
          vue.createElementVNode("div", _hoisted_2, [
            vue.createElementVNode("div", {
              class: "button",
              onClick: showAll
            }, "控制台输出所有规则"),
            vue.createElementVNode("div", {
              class: "button",
              onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(toggleRecord)())
            }, vue.toDisplayString(vue.unref(recordVisible) ? "隐藏请求记录" : "查看请求记录"), 1)
          ]),
          vue.unref(recordVisible) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, [
            vue.createElementVNode("div", _hoisted_4, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(ruleStore2).record.values(), (rule, i) => {
                return vue.openBlock(), vue.createBlock(RuleItem, {
                  key: i,
                  index: i,
                  name: rule.name,
                  url: rule.url,
                  contains: rule.contains,
                  enable: rule.enable,
                  onClick: ($event) => addRecord(rule.url, rule.response),
                  style: { "margin-bottom": "0.5em" },
                  type: "record"
                }, null, 8, ["index", "name", "url", "contains", "enable", "onClick"]);
              }), 128))
            ])
          ])) : vue.createCommentVNode("", true),
          vue.unref(ruleStore2).rules.value.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(ruleStore2).rules.value, (rule, i) => {
              return vue.openBlock(), vue.createBlock(RuleItem, {
                key: i,
                index: i,
                name: rule.name,
                url: rule.url,
                contains: rule.contains,
                enable: rule.enable,
                onClick: ($event) => toEdit(i),
                style: { "margin-bottom": "0.5em" }
              }, null, 8, ["index", "name", "url", "contains", "enable", "onClick"]);
            }), 128))
          ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, "啥都没"))
        ]);
      };
    }
  });
  const rules = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-12479193"]]);
  const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: rules
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "DraggableButton",
    setup(__props) {
      const entry = vue.ref(null);
      const halfHeight = document.documentElement.clientHeight / 2;
      const { x, style } = useDraggable(entry, { initialValue: { x: 8, y: halfHeight - 50 }, axis: "y" });
      const { isOutside } = useMouseInElement(entry);
      function xTo(target, duration = 240) {
        const start = x.value;
        const range = target - start;
        const startTime = performance.now();
        let progress = 0;
        function step() {
          progress = (performance.now() - startTime) / duration;
          if (progress < 1) {
            x.value = start + range * progress;
            requestAnimationFrame(step);
          } else {
            x.value = target;
          }
        }
        step();
      }
      let timer;
      vue.watch(
        isOutside,
        (value) => {
          if (value) {
            timer = setTimeout(() => {
              xTo(value ? -24 : 8);
            }, 5e3);
          } else {
            clearTimeout(timer);
            if (x.value !== 8) {
              xTo(8);
            }
          }
        },
        { immediate: true }
      );
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "entry",
          ref: entry,
          class: "entry",
          style: vue.normalizeStyle(vue.unref(style))
        }, [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ], 4);
      };
    }
  });
  const DraggableButton = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-6b8bc4f1"]]);
  const _sfc_main$1 = {};
  const _hoisted_1 = { class: "floating" };
  function _sfc_render(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ]);
  }
  const FloatingPage = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-bd804120"]]);
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const [visible, toggle] = useToggle(false);
      const router = usePageStore();
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(DraggableButton, {
            onClick: _cache[0] || (_cache[0] = () => vue.unref(toggle)())
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("接口代理")
            ]),
            _: 1
          }),
          vue.unref(visible) ? (vue.openBlock(), vue.createBlock(FloatingPage, { key: 0 }, {
            default: vue.withCtx(() => [
              (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(router).current.value)))
            ]),
            _: 1
          })) : vue.createCommentVNode("", true)
        ], 64);
      };
    }
  });
  const slice = (o, n) => Array.prototype.slice.call(o, n);
  let result = null;
  if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope) {
    result = self;
  } else if (typeof global !== "undefined") {
    result = global;
  } else if (unsafeWindow) {
    result = unsafeWindow;
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
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
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
      step((generator = generator.apply(thisArg, _arguments || [])).next());
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
    if (typeof rule.url === "string") {
      return rule.contains ? url.includes(rule.url) : url === rule.url;
    }
    return rule.url.test(url);
  }
  function useRequestHook(options) {
    const record = vue.toValue((options == null ? void 0 : options.record) ?? /* @__PURE__ */ new Map());
    xhook.after((request, response) => {
      var _a;
      const rules2 = vue.toValue((options == null ? void 0 : options.rules) ?? []);
      for (const rule of rules2) {
        if (!rule.enable) {
          continue;
        }
        if (matchURL(request.url, rule)) {
          response.data = rule.response;
          return;
        }
      }
      if ((_a = response.headers["content-type"]) == null ? void 0 : _a.includes("application/json")) {
        record.set(request.url, {
          name: "",
          url: request.url,
          response: response.data
        });
      }
    });
    if (options == null ? void 0 : options.immediate) {
      xhook.enable();
    }
    return { enable: xhook.enable, disable: xhook.disable };
  }
  const pages = /* @__PURE__ */ Object.assign({ "./pages/edit.vue": __vite_glob_0_0, "./pages/rules.vue": __vite_glob_0_1 });
  const Pages = {
    install(app) {
      Object.keys(pages).forEach((path) => {
        var _a;
        const name = (_a = path.match(/\.\/pages\/(.*)\.vue$/)) == null ? void 0 : _a[1];
        app.component(`page-${name}`, pages[path]["default"]);
      });
    }
  };
  const ruleStore = useRuleStore();
  useRequestHook({
    rules: ruleStore.rules,
    record: ruleStore.record,
    immediate: true
  });
  addEventListener("DOMContentLoaded", () => {
    vue.createApp(_sfc_main).use(Pages).mount(
      (() => {
        console.log("App mounted");
        const app = document.createElement("div");
        app.id = "uss-mock-app";
        document.body.append(app);
        return app;
      })()
    );
  });

})(Vue);
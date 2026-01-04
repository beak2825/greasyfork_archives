// ==UserScript==
// @name            RPGEN - Big ears
// @name:ja         RPGEN - 地獄耳
// @description     A user script that gives brave people big ears to hear the direction of every person.
// @description:ja  勇者にあらゆる人の方向を聞き取る地獄耳を与えるユーザースクリプト。コワイ！
// @version         1.1.0
// @icon            https://www.google.com/s2/favicons?sz=64&domain=rpgen.site
// @match           https://rpgen.site/dq/?*
// @namespace       https://github.com/sqrtox/userscript-rpgen-big-ears
// @author          sqrtox
// @license         MIT
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/514927/RPGEN%20-%20Big%20ears.user.js
// @updateURL https://update.greasyfork.org/scripts/514927/RPGEN%20-%20Big%20ears.meta.js
// ==/UserScript==

// NOTE: This file was built by esbuild

(async () => {
  "use strict";

  // src/shape.ts
  var Point = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    radian(p) {
      return Math.atan2(p.y - this.y, p.x - this.x);
    }
    distance(p) {
      const dx = p.x - this.x;
      const dy = p.y - this.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  };
  var Size = class {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }
  };
  var Rect = class {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
    isHit(r) {
      return (
        this.x <= r.x + r.width &&
        r.x <= this.x + this.width &&
        this.y <= r.y + r.height &&
        r.y <= this.y + this.height
      );
    }
    intersect({ x, y }) {
      const minX = this.x;
      const minY = this.y;
      const maxX = minX + this.width;
      const maxY = minY + this.height;
      if (minX < x && x < maxX && minY < y && y < maxY) {
        return;
      }
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;
      const m = (midY - y) / (midX - x);
      if (x <= midX) {
        const minXy = m * (minX - x) + y;
        if (minY <= minXy && minXy <= maxY) {
          return new Point(minX, minXy);
        }
      }
      if (x >= midX) {
        const maxXy = m * (maxX - x) + y;
        if (minY <= maxXy && maxXy <= maxY) {
          return new Point(maxX, maxXy);
        }
      }
      if (y <= midY) {
        const minYx = (minY - y) / m + x;
        if (minX <= minYx && minYx <= maxX) {
          return new Point(minYx, minY);
        }
      }
      if (y >= midY) {
        const maxYx = (maxY - y) / m + x;
        if (minX <= maxYx && maxYx <= maxX) {
          return new Point(maxYx, maxY);
        }
      }
      if (x === midX && y === midY) {
        return new Point(x, y);
      }
    }
  };

  // src/canvas.ts
  var drawArrow = (ctx, center, size, radian, fillStyle) => {
    const sqrt3 = Math.sqrt(3);
    const sideLength = (sqrt3 / 2) * size;
    const height = (sqrt3 / 2) * sideLength;
    const cosRad = Math.cos(radian);
    const sinRad = Math.sin(radian);
    const rotatePoint = (x, y) => {
      const dx = x - center.x;
      const dy = y - center.y;
      return new Point(
        center.x + dx * cosRad - dy * sinRad,
        center.y + dx * sinRad + dy * cosRad,
      );
    };
    const pointA = rotatePoint(center.x, center.y - (2 / 3) * height);
    const pointB = rotatePoint(
      center.x - sideLength / 2,
      center.y + (1 / 3) * height,
    );
    const pointC = new Point(center.x, center.y);
    const pointD = rotatePoint(
      center.x + sideLength / 2,
      center.y + (1 / 3) * height,
    );
    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.lineTo(pointC.x, pointC.y);
    ctx.lineTo(pointD.x, pointD.y);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
  };

  // src/css.ts
  var resetCss = {
    width: 0,
    height: 0,
    margin: 0,
    padding: 0,
    boxShadow: "none",
    top: 0,
    left: 0,
    position: "fixed",
    zIndex: 99999,
  };

  // node_modules/goober/src/core/to-hash.js
  var toHash = (str) => {
    let i = 0,
      out = 11;
    while (i < str.length) out = (101 * out + str.charCodeAt(i++)) >>> 0;
    return "go" + out;
  };

  // node_modules/goober/src/core/get-sheet.js
  var GOOBER_ID = "_goober";
  var ssr = {
    data: "",
  };
  var getSheet = (target) => {
    if (typeof window === "object") {
      return (
        (target ? target.querySelector("#" + GOOBER_ID) : window[GOOBER_ID]) ||
        Object.assign(
          (target || document.head).appendChild(
            document.createElement("style"),
          ),
          {
            innerHTML: " ",
            id: GOOBER_ID,
          },
        )
      ).firstChild;
    }
    return target || ssr;
  };

  // node_modules/goober/src/core/update.js
  var update = (css3, sheet, append, cssToReplace) => {
    cssToReplace
      ? (sheet.data = sheet.data.replace(cssToReplace, css3))
      : sheet.data.indexOf(css3) === -1 &&
        (sheet.data = append ? css3 + sheet.data : sheet.data + css3);
  };

  // node_modules/goober/src/core/astish.js
  var newRule =
    /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g;
  var ruleClean = /\/\*[^]*?\*\/|  +/g;
  var ruleNewline = /\n+/g;
  var empty = " ";
  var astish = (val) => {
    let tree = [{}];
    let block, left;
    while ((block = newRule.exec(val.replace(ruleClean, "")))) {
      if (block[4]) {
        tree.shift();
      } else if (block[3]) {
        left = block[3].replace(ruleNewline, empty).trim();
        tree.unshift((tree[0][left] = tree[0][left] || {}));
      } else {
        tree[0][block[1]] = block[2].replace(ruleNewline, empty).trim();
      }
    }
    return tree[0];
  };

  // node_modules/goober/src/core/parse.js
  var parse = (obj, selector) => {
    let outer = "";
    let blocks = "";
    let current = "";
    for (let key in obj) {
      let val = obj[key];
      if (key[0] == "@") {
        if (key[1] == "i") {
          outer = key + " " + val + ";";
        } else if (key[1] == "f") {
          blocks += parse(val, key);
        } else {
          blocks += key + "{" + parse(val, key[1] == "k" ? "" : selector) + "}";
        }
      } else if (typeof val == "object") {
        blocks += parse(
          val,
          selector
            ? // Go over the selector and replace the matching multiple selectors if any
              selector.replace(/([^,])+/g, (sel) => {
                return key.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g, (k) => {
                  if (/&/.test(k)) return k.replace(/&/g, sel);
                  return sel ? sel + " " + k : k;
                });
              })
            : key,
        );
      } else if (val != void 0) {
        key = /^--/.test(key)
          ? key
          : key.replace(/[A-Z]/g, "-$&").toLowerCase();
        current += parse.p
          ? // We have a prefixer and we need to run this through that
            parse.p(key, val)
          : // Nope no prefixer just append it
            key + ":" + val + ";";
      }
    }
    return (
      outer +
      (selector && current ? selector + "{" + current + "}" : current) +
      blocks
    );
  };

  // node_modules/goober/src/core/hash.js
  var cache = {};
  var stringify = (data) => {
    if (typeof data == "object") {
      let out = "";
      for (let p in data) out += p + stringify(data[p]);
      return out;
    } else {
      return data;
    }
  };
  var hash = (compiled, sheet, global, append, keyframes2) => {
    let stringifiedCompiled = stringify(compiled);
    let className =
      cache[stringifiedCompiled] ||
      (cache[stringifiedCompiled] = toHash(stringifiedCompiled));
    if (!cache[className]) {
      let ast = stringifiedCompiled !== compiled ? compiled : astish(compiled);
      cache[className] = parse(
        // For keyframes
        keyframes2 ? { ["@keyframes " + className]: ast } : ast,
        global ? "" : "." + className,
      );
    }
    let cssToReplace = global && cache.g ? cache.g : null;
    if (global) cache.g = cache[className];
    update(cache[className], sheet, append, cssToReplace);
    return className;
  };

  // node_modules/goober/src/core/compile.js
  var compile = (str, defs, data) => {
    return str.reduce((out, next, i) => {
      let tail = defs[i];
      if (tail && tail.call) {
        let res = tail(data);
        let className = res && res.props && res.props.className;
        let end = className || (/^go/.test(res) && res);
        if (end) {
          tail = "." + end;
        } else if (res && typeof res == "object") {
          tail = res.props ? "" : parse(res, "");
        } else {
          tail = res === false ? "" : res;
        }
      }
      return out + next + (tail == null ? "" : tail);
    }, "");
  };

  // node_modules/goober/src/css.js
  function css(val) {
    let ctx = this || {};
    let _val = val.call ? val(ctx.p) : val;
    return hash(
      _val.unshift
        ? _val.raw
          ? // Tagged templates
            compile(_val, [].slice.call(arguments, 1), ctx.p)
          : // Regular arrays
            _val.reduce(
              (o, i) => Object.assign(o, i && i.call ? i(ctx.p) : i),
              {},
            )
        : _val,
      getSheet(ctx.target),
      ctx.g,
      ctx.o,
      ctx.k,
    );
  }
  var glob = css.bind({ g: 1 });
  var keyframes = css.bind({ k: 1 });

  // src/libs/goober.ts
  var root = document.createElement("div");
  root.classList.add(css.call(document.head, resetCss));
  document.body.append(root);
  var shadowRoot = root.attachShadow({ mode: "open" });
  var css2 = css.bind({
    target: shadowRoot,
  });

  // src/rpgen/render.ts
  var onFrameChanged = (callback) => {
    let prevFrame;
    const frame = () => {
      const isFrameChanged = prevFrame !== dq.frames;
      if (isFrameChanged) {
        try {
          callback();
        } catch {}
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  // src/rpgen/tile.ts
  var getTileScale = () => clip_s / dq.scaleMultiplier;
  var getTileSize = () => {
    const tileScale = getTileScale();
    return new Size(dq.CHIP_SIZE_X * tileScale, dq.CHIP_SIZE_Y * tileScale);
  };

  // src/greasemonkey.ts
  var createStore = async (name, initialState) => {
    let state3 = await GM.getValue(name).then((s) =>
      // TODO: deep merge
      typeof s === "string"
        ? { ...initialState, ...JSON.parse(s) }
        : initialState,
    );
    return {
      get: () => state3,
      set: async (update3) => {
        const newState = {
          ...state3,
          ...update3,
        };
        await GM.setValue(name, JSON.stringify(newState));
        state3 = newState;
      },
      initialState,
    };
  };

  // src/stores/settings.ts
  var settingsStore = await createStore("settings", {
    enabled: true,
    arrowSize: 10,
    arrowMargin: 10,
    arrowDistance: true,
    disabledOnCameraMoving: false,
    npcArrowColor: "#0000ff",
    playerArrowColor: "#ff0000",
    uniquePlayerColor: false,
    debug: {
      enabled: false,
    },
  });

  // node_modules/vanjs-core/src/van.js
  var protoOf = Object.getPrototypeOf;
  var changedStates;
  var derivedStates;
  var curDeps;
  var curNewDerives;
  var alwaysConnectedDom = { isConnected: 1 };
  var gcCycleInMs = 1e3;
  var statesToGc;
  var propSetterCache = {};
  var objProto = protoOf(alwaysConnectedDom);
  var funcProto = protoOf(protoOf);
  var _undefined;
  var addAndScheduleOnFirst = (set, s, f, waitMs) =>
    (set ?? (setTimeout(f, waitMs), /* @__PURE__ */ new Set())).add(s);
  var runAndCaptureDeps = (f, deps, arg) => {
    let prevDeps = curDeps;
    curDeps = deps;
    try {
      return f(arg);
    } catch (e) {
      console.error(e);
      return arg;
    } finally {
      curDeps = prevDeps;
    }
  };
  var keepConnected = (l) => l.filter((b) => b._dom?.isConnected);
  var addStatesToGc = (d) =>
    (statesToGc = addAndScheduleOnFirst(
      statesToGc,
      d,
      () => {
        for (let s of statesToGc)
          (s._bindings = keepConnected(s._bindings)),
            (s._listeners = keepConnected(s._listeners));
        statesToGc = _undefined;
      },
      gcCycleInMs,
    ));
  var stateProto = {
    get val() {
      curDeps?._getters?.add(this);
      return this.rawVal;
    },
    get oldVal() {
      curDeps?._getters?.add(this);
      return this._oldVal;
    },
    set val(v) {
      curDeps?._setters?.add(this);
      if (v !== this.rawVal) {
        this.rawVal = v;
        this._bindings.length + this._listeners.length
          ? (derivedStates?.add(this),
            (changedStates = addAndScheduleOnFirst(
              changedStates,
              this,
              updateDoms,
            )))
          : (this._oldVal = v);
      }
    },
  };
  var state = (initVal) => ({
    __proto__: stateProto,
    rawVal: initVal,
    _oldVal: initVal,
    _bindings: [],
    _listeners: [],
  });
  var bind = (f, dom) => {
    let deps = {
        _getters: /* @__PURE__ */ new Set(),
        _setters: /* @__PURE__ */ new Set(),
      },
      binding = { f },
      prevNewDerives = curNewDerives;
    curNewDerives = [];
    let newDom = runAndCaptureDeps(f, deps, dom);
    newDom = (newDom ?? document).nodeType ? newDom : new Text(newDom);
    for (let d of deps._getters)
      deps._setters.has(d) || (addStatesToGc(d), d._bindings.push(binding));
    for (let l of curNewDerives) l._dom = newDom;
    curNewDerives = prevNewDerives;
    return (binding._dom = newDom);
  };
  var derive = (f, s = state(), dom) => {
    let deps = {
        _getters: /* @__PURE__ */ new Set(),
        _setters: /* @__PURE__ */ new Set(),
      },
      listener = { f, s };
    listener._dom = dom ?? curNewDerives?.push(listener) ?? alwaysConnectedDom;
    s.val = runAndCaptureDeps(f, deps, s.rawVal);
    for (let d of deps._getters)
      deps._setters.has(d) || (addStatesToGc(d), d._listeners.push(listener));
    return s;
  };
  var add = (dom, ...children) => {
    for (let c of children.flat(Infinity)) {
      let protoOfC = protoOf(c ?? 0);
      let child =
        protoOfC === stateProto
          ? bind(() => c.val)
          : protoOfC === funcProto
            ? bind(c)
            : c;
      child != _undefined && dom.append(child);
    }
    return dom;
  };
  var tag = (ns, name, ...args) => {
    let [props, ...children] =
      protoOf(args[0] ?? 0) === objProto ? args : [{}, ...args];
    let dom = ns
      ? document.createElementNS(ns, name)
      : document.createElement(name);
    for (let [k, v] of Object.entries(props)) {
      let getPropDescriptor = (proto) =>
        proto
          ? (Object.getOwnPropertyDescriptor(proto, k) ??
            getPropDescriptor(protoOf(proto)))
          : _undefined;
      let cacheKey = name + "," + k;
      let propSetter = (propSetterCache[cacheKey] ??=
        getPropDescriptor(protoOf(dom))?.set ?? 0);
      let setter = k.startsWith("on")
        ? (v2, oldV) => {
            let event = k.slice(2);
            dom.removeEventListener(event, oldV);
            dom.addEventListener(event, v2);
          }
        : propSetter
          ? propSetter.bind(dom)
          : dom.setAttribute.bind(dom, k);
      let protoOfV = protoOf(v ?? 0);
      k.startsWith("on") ||
        (protoOfV === funcProto && ((v = derive(v)), (protoOfV = stateProto)));
      protoOfV === stateProto
        ? bind(() => (setter(v.val, v._oldVal), dom))
        : setter(v);
    }
    return add(dom, children);
  };
  var handler = (ns) => ({ get: (_, name) => tag.bind(_undefined, ns, name) });
  var update2 = (dom, newDom) =>
    newDom ? newDom !== dom && dom.replaceWith(newDom) : dom.remove();
  var updateDoms = () => {
    let iter = 0,
      derivedStatesArray = [...changedStates].filter(
        (s) => s.rawVal !== s._oldVal,
      );
    do {
      derivedStates = /* @__PURE__ */ new Set();
      for (let l of new Set(
        derivedStatesArray.flatMap(
          (s) => (s._listeners = keepConnected(s._listeners)),
        ),
      ))
        derive(l.f, l.s, l._dom), (l._dom = _undefined);
    } while (++iter < 100 && (derivedStatesArray = [...derivedStates]).length);
    let changedStatesArray = [...changedStates].filter(
      (s) => s.rawVal !== s._oldVal,
    );
    changedStates = _undefined;
    for (let b of new Set(
      changedStatesArray.flatMap(
        (s) => (s._bindings = keepConnected(s._bindings)),
      ),
    ))
      update2(b._dom, bind(b.f, b._dom)), (b._dom = _undefined);
    for (let s of changedStatesArray) s._oldVal = s.rawVal;
  };
  var van_default = {
    tags: new Proxy((ns) => new Proxy(tag, handler(ns)), handler()),
    hydrate: (dom, f) => update2(dom, bind(f, dom)),
    add,
    state,
    derive,
  };

  // src/components/label.ts
  var { label } = van_default.tags;
  var Label = (label_, control) => {
    return label(
      {
        class: css2({
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          gap: "0.5rem",
        }),
      },
      label_,
      control,
    );
  };

  // src/components/switch.ts
  var { label: label2, span, input } = van_default.tags;
  var Switch = ({ label: label_, checked, onChange }) => {
    return Label(
      span(label_),
      input({
        type: "checkbox",
        checked,
        onchange: (event) => onChange(event.target.checked),
      }),
    );
  };

  // node_modules/vanjs-ext/src/van-x.js
  var { fromEntries, entries, keys, hasOwn, getPrototypeOf } = Object;
  var {
    get: refGet,
    set: refSet,
    deleteProperty: refDelete,
    ownKeys: refOwnKeys,
  } = Reflect;
  var { state: state2, derive: derive2, add: add2 } = van_default;
  var _undefined2;
  var replacing;
  var statesSym = Symbol();
  var isCalcFunc = Symbol();
  var bindingsSym = Symbol();
  var keysGenSym = Symbol();
  var keyToChildSym = Symbol();
  var noreactiveSym = Symbol();
  var isObject = (x) =>
    x instanceof Object && !(x instanceof Function) && !x[noreactiveSym];
  var toState = (v) => {
    if (v?.[isCalcFunc]) {
      let s = state2();
      derive2(() => {
        let newV = v();
        isObject(s.rawVal) && isObject(newV)
          ? replace(s.rawVal, newV)
          : (s.val = reactive(newV));
      });
      return s;
    } else return state2(reactive(v));
  };
  var buildStates = (srcObj) => {
    let states = Array.isArray(srcObj)
      ? []
      : { __proto__: getPrototypeOf(srcObj) };
    for (let [k, v] of entries(srcObj)) states[k] = toState(v);
    states[bindingsSym] = [];
    states[keysGenSym] = state2(1);
    return states;
  };
  var reactiveHandler = {
    get: (states, name, proxy) =>
      name === statesSym
        ? states
        : hasOwn(states, name)
          ? Array.isArray(states) && name === "length"
            ? (states[keysGenSym].val, states.length)
            : states[name].val
          : refGet(states, name, proxy),
    set: (states, name, v, proxy) =>
      hasOwn(states, name)
        ? Array.isArray(states) && name === "length"
          ? (v !== states.length && ++states[keysGenSym].val,
            (states.length = v),
            1)
          : ((states[name].val = reactive(v)), 1)
        : name in states
          ? refSet(states, name, v, proxy)
          : refSet(states, name, toState(v)) &&
            (++states[keysGenSym].val,
            filterBindings(states).forEach(
              addToContainer.bind(
                _undefined2,
                proxy,
                name,
                states[name],
                replacing,
              ),
            ),
            1),
    deleteProperty: (states, name) => (
      refDelete(states, name) && onDelete(states, name),
      ++states[keysGenSym].val
    ),
    ownKeys: (states) => (states[keysGenSym].val, refOwnKeys(states)),
  };
  var reactive = (srcObj) =>
    !isObject(srcObj) || srcObj[statesSym]
      ? srcObj
      : new Proxy(buildStates(srcObj), reactiveHandler);
  var stateProto2 = getPrototypeOf(state2());
  var filterBindings = (states) =>
    (states[bindingsSym] = states[bindingsSym].filter(
      (b) => b._containerDom.isConnected,
    ));
  var addToContainer = (items, k, v, skipReorder, { _containerDom, f }) => {
    let isArray = Array.isArray(items),
      typedK = isArray ? Number(k) : k;
    add2(
      _containerDom,
      () =>
        (_containerDom[keyToChildSym][k] = f(v, () => delete items[k], typedK)),
    );
    isArray &&
      !skipReorder &&
      typedK !== items.length - 1 &&
      _containerDom.insertBefore(
        _containerDom.lastChild,
        _containerDom[keyToChildSym][
          keys(items).find((key) => Number(key) > typedK)
        ],
      );
  };
  var onDelete = (states, k) => {
    for (let b of filterBindings(states)) {
      let keyToChild = b._containerDom[keyToChildSym];
      keyToChild[k]?.remove();
      delete keyToChild[k];
    }
  };
  var replaceInternal = (obj, replacement) => {
    for (let [k, v] of entries(replacement)) {
      let existingV = obj[k];
      isObject(existingV) && isObject(v)
        ? replaceInternal(existingV, v)
        : (obj[k] = v);
    }
    for (let k in obj) hasOwn(replacement, k) || delete obj[k];
    let newKeys = keys(replacement),
      isArray = Array.isArray(obj);
    if (isArray || keys(obj).some((k, i) => k !== newKeys[i])) {
      let states = obj[statesSym];
      if (isArray) obj.length = replacement.length;
      else {
        ++states[keysGenSym].val;
        let statesCopy = { ...states };
        for (let k of newKeys) delete states[k];
        for (let k of newKeys) states[k] = statesCopy[k];
      }
      for (let { _containerDom } of filterBindings(states)) {
        let { firstChild: dom, [keyToChildSym]: keyToChild } = _containerDom;
        for (let k of newKeys)
          dom === keyToChild[k]
            ? (dom = dom.nextSibling)
            : _containerDom.insertBefore(keyToChild[k], dom);
      }
    }
    return obj;
  };
  var replace = (obj, replacement) => {
    replacing = 1;
    try {
      return replaceInternal(
        obj,
        replacement instanceof Function
          ? Array.isArray(obj)
            ? replacement(obj.filter((_) => 1))
            : fromEntries(replacement(entries(obj)))
          : replacement,
      );
    } finally {
      replacing = _undefined2;
    }
  };

  // src/components/settings-window.ts
  var {
    div,
    span: span2,
    input: input2,
    button,
    section,
    h1,
  } = van_default.tags;
  var WIDTH = 600;
  var HEIGHT = 400;
  var menuCommandRegistered = false;
  var SettingsWindow = () => {
    const open = van_default.state(false);
    const settings = reactive(settingsStore.get());
    van_default.derive(() => {
      settingsStore.set(settings);
    });
    if (!menuCommandRegistered) {
      menuCommandRegistered = true;
      GM.registerMenuCommand("Settings", () => {
        open.val = !open.val;
      });
    }
    return div(
      {
        class: () =>
          css2({
            ...resetCss,
            alignItems: "flex-start",
            padding: "1rem",
            display: open.val ? "flex" : "none",
            flexDirection: "column",
            gap: "1rem",
            width: `${WIDTH}px`,
            height: `${HEIGHT}px`,
            top: `calc(calc(100svh - ${HEIGHT}px) / 2)`,
            left: `calc(calc(100svw - ${WIDTH}px) / 2)`,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(5px)",
            color: "#fff",
          }),
      },
      div(
        {
          class: css2({
            width: "100%",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
          }),
        },
        div("設定"),
        div(
          {
            class: css2({
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }),
          },
          button(
            {
              onclick: () => {
                open.val = false;
              },
            },
            "閉じる",
          ),
          button(
            {
              onclick: async () => {
                const confirm = window.confirm(
                  "本当に設定をすべて初期化しますか？",
                );
                if (!confirm) {
                  return;
                }
                Object.assign(settings, settingsStore.initialState);
              },
            },
            "設定を初期化",
          ),
        ),
      ),
      div(
        {
          class: css2({
            width: "100%",
            overflow: "auto",
            flex: 1,
          }),
        },
        section(
          h1("全般"),
          div(
            {
              class: css2({
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                alignItems: "flex-start",
              }),
            },
            Switch({
              label: "人の方向を表示",
              checked: () => settings.enabled,
              onChange: (checked) => {
                settings.enabled = checked;
              },
            }),
            Switch({
              label: "カメラの移動時に方向を表示しない",
              checked: () => settings.disabledOnCameraMoving,
              onChange: (checked) => {
                settings.disabledOnCameraMoving = checked;
              },
            }),
          ),
        ),
        section(
          h1("矢印の外観"),
          div(
            {
              class: css2({
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                alignItems: "flex-start",
              }),
            },
            Switch({
              label: "距離に応じて矢印を大きさを変える",
              checked: () => settings.arrowDistance,
              onChange: (checked) => {
                settings.arrowDistance = checked;
              },
            }),
            Label(
              span2("矢印の大きさ"),
              input2({
                type: "range",
                value: () => settings.arrowSize,
                min: 10,
                max: 15,
                step: 1,
                onchange: (event) => {
                  settings.arrowSize = Number(event.target.value);
                },
              }),
            ),
            Label(
              span2("画面端と矢印の距離"),
              input2({
                type: "range",
                value: () => settings.arrowMargin,
                min: 0,
                max: 20,
                step: 1,
                onchange: (event) => {
                  settings.arrowMargin = Number(event.target.value);
                },
              }),
            ),
            Label(
              span2("NPCの矢印色"),
              input2({
                type: "color",
                value: () => settings.npcArrowColor,
                onchange: (event) => {
                  settings.npcArrowColor = event.target.value;
                },
              }),
            ),
            Label(
              span2(
                {
                  class: () =>
                    css2({
                      opacity: settings.uniquePlayerColor ? 0.5 : void 0,
                    }),
                },
                "プレイヤーの矢印色",
              ),
              input2({
                type: "color",
                disabled: () => settings.uniquePlayerColor,
                value: () => settings.playerArrowColor,
                onchange: (event) => {
                  settings.playerArrowColor = event.target.value;
                },
              }),
            ),
            Switch({
              label: "プレイヤーごとに矢印の色を変える",
              checked: () => settings.uniquePlayerColor,
              onChange: (checked) => {
                settings.uniquePlayerColor = checked;
              },
            }),
          ),
        ),
        section(
          h1("デバッグ"),
          div(
            {
              class: css2({
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                alignItems: "flex-start",
              }),
            },
            Switch({
              label: "デバッグモードを有効化",
              checked: () => settings.debug.enabled,
              onChange: (checked) => {
                settings.debug.enabled = checked;
              },
            }),
          ),
        ),
      ),
    );
  };

  // src/index.ts
  var CAMERA_MARGIN = 5;
  var DEBUG_OVERLAY_ARC_SIZE = 10;
  var CLOSE_RANGE = 300;
  var ARROW_SIZE_MIN_SCALE = 0.7;
  var uniqueColors = /* @__PURE__ */ new WeakMap();
  var main = () => {
    let ctx;
    let rendering = false;
    onFrameChanged(() => {
      const settings = settingsStore.get();
      const debugEnabled = settings.debug.enabled;
      const canvasLoaded = typeof canvas !== "undefined" && canvas !== null;
      const enabled =
        settings.enabled &&
        !(settings.disabledOnCameraMoving && dq.bCameraEnable);
      if (!canvasLoaded || !enabled || rendering) {
        return;
      }
      ctx ??= canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      rendering = true;
      const cvW = canvas.width;
      const cvH = canvas.height;
      const cvCenter = new Point(cvW / 2, cvH / 2);
      const tileScale = getTileScale();
      const tileSize = getTileSize();
      const offset = new Point(dq.getOffsetX(), dq.getOffsetY());
      const maxArrowSize = settings.arrowSize * tileScale;
      const arrowTrackRect = (() => {
        const padding = maxArrowSize / 2;
        const spacing = padding + settings.arrowMargin;
        return new Rect(spacing, spacing, cvW - spacing * 2, cvH - spacing * 2);
      })();
      const cameraRect = (() => {
        const spacing = CAMERA_MARGIN * tileScale;
        return new Rect(spacing, spacing, cvW - spacing * 2, cvH - spacing * 2);
      })();
      if (debugEnabled) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, cvCenter.y);
        ctx.lineTo(cvW, cvCenter.y);
        ctx.moveTo(cvCenter.x, 0);
        ctx.lineTo(cvCenter.x, cvH);
        ctx.strokeStyle = "#0f0";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.strokeStyle = "#f0f";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          arrowTrackRect.x,
          arrowTrackRect.y,
          arrowTrackRect.width,
          arrowTrackRect.height,
        );
        ctx.restore();
        ctx.save();
        ctx.strokeStyle = "#ff0";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          cameraRect.x,
          cameraRect.y,
          cameraRect.width,
          cameraRect.height,
        );
        ctx.restore();
      }
      for (const human of humans) {
        const invalidGraphic = Number.isNaN(human.graphicId);
        if (!human.isEnable || human.isChild || invalidGraphic) {
          continue;
        }
        const isPlayer = human.children !== void 0;
        let color;
        if (isPlayer) {
          if (settings.uniquePlayerColor) {
            const uniqueColor =
              uniqueColors.get(human) ??
              `#${((Math.random() * 16777215) << 0).toString(16).padStart(6, "0")}`;
            if (!uniqueColors.has(human)) {
              uniqueColors.set(human, uniqueColor);
            }
            color = uniqueColor;
          } else {
            color = settings.playerArrowColor;
          }
        } else {
          color = settings.npcArrowColor;
        }
        const humanRect = new Rect(
          (human.x - offset.x) * tileScale,
          (human.y - offset.y) * tileScale,
          tileSize.width,
          tileSize.height,
        );
        const humanCenter = new Point(
          humanRect.x + humanRect.width / 2,
          humanRect.y + humanRect.height / 2,
        );
        if (debugEnabled) {
          ctx.save();
          ctx.strokeStyle = color;
          ctx.strokeRect(
            humanRect.x,
            humanRect.y,
            humanRect.width,
            humanRect.height,
          );
          ctx.beginPath();
          ctx.moveTo(cvCenter.x, cvCenter.y);
          ctx.lineTo(humanCenter.x, humanCenter.y);
          ctx.stroke();
          ctx.restore();
        }
        if (humanRect.isHit(cameraRect)) {
          continue;
        }
        const arrowTrackIntersection = arrowTrackRect.intersect(humanCenter);
        if (!arrowTrackIntersection) {
          continue;
        }
        const radian = cvCenter.radian(humanCenter);
        const humanIntersection =
          humanRect.intersect(arrowTrackIntersection) ?? humanCenter;
        const distance = arrowTrackIntersection.distance(humanIntersection);
        let arrowSizeScale = 1;
        if (settings.arrowDistance) {
          if (distance >= CLOSE_RANGE) {
            arrowSizeScale = ARROW_SIZE_MIN_SCALE;
          } else if (distance <= 0) {
            arrowSizeScale = 1;
          } else {
            arrowSizeScale =
              ARROW_SIZE_MIN_SCALE +
              ((1 - ARROW_SIZE_MIN_SCALE) * (CLOSE_RANGE - distance)) /
                CLOSE_RANGE;
          }
        }
        if (debugEnabled) {
          const arcSize = DEBUG_OVERLAY_ARC_SIZE * tileScale;
          ctx.save();
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(
            humanIntersection.x,
            humanIntersection.y,
            arcSize / 2,
            0,
            Math.PI * 2,
          );
          ctx.arc(
            arrowTrackIntersection.x,
            arrowTrackIntersection.y,
            arcSize / 2,
            0,
            Math.PI * 2,
          );
          ctx.fill();
          ctx.restore();
        }
        drawArrow(
          ctx,
          arrowTrackIntersection,
          maxArrowSize * arrowSizeScale,
          (90 * Math.PI) / 180 + radian,
          color,
        );
      }
      rendering = false;
    });
  };
  var searchParams = new URLSearchParams(location.search);
  var inMapPage = searchParams.has("map");
  van_default.add(shadowRoot, SettingsWindow);
  if (inMapPage) {
    main();
    GM.registerMenuCommand("Toggle Guidance", () => {
      const settings = settingsStore.get();
      settingsStore.set({
        enabled: !settings.enabled,
      });
    });
  }
})();

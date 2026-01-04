// ==UserScript==
// @name         create-form-table-config
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @author       monkey
// @description  适用与mockplus生成form和table配置
// @icon         https://vitejs.dev/logo.svg
// @match        https://rp.mockplus.cn/*
// @downloadURL https://update.greasyfork.org/scripts/460372/create-form-table-config.user.js
// @updateURL https://update.greasyfork.org/scripts/460372/create-form-table-config.meta.js
// ==/UserScript==

(d=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.innerText=d,document.head.appendChild(e)})(" .index-module_list_PXrsw{display:flex;align-items:center;justify-content:space-between;border:1px solid #ebebeb;border-radius:6px;padding:8px 12px;margin:10px 0}.index-module_list_PXrsw .index-module_listLeft_aIkaU{display:flex;align-items:center}.index-module_list_PXrsw .index-module_listLeft_aIkaU .index-module_label_kSU2W{margin-right:8px;width:50px;font-size:12px;text-align:right}.index-module_list_PXrsw .index-module_listLeft_aIkaU .index-module_select_XuPns{width:100px;margin-right:5px}.index-module_list_PXrsw .index-module_btn_jhmhN{justify-content:flex-end}.index-module_box_zWG0q{position:fixed;top:0;right:0;height:100%;width:300px;padding:15px;background:#fff;box-shadow:0 0 10px #d3d3d3}.index-module_box_zWG0q .index-module_title_xRCE1{margin:10px 0;font-weight:700}.index-module_box_zWG0q .index-module_titleContent_ucgeD{padding-left:10px}.index-module_box_zWG0q .index-module_content_u6Ai2{border-radius:10px;margin-top:10px;height:400px;overflow:auto}.index-module_box_zWG0q .index-module_content_u6Ai2::-webkit-scrollbar{width:5px;height:8px}.index-module_box_zWG0q .index-module_content_u6Ai2::-webkit-scrollbar-track{background:#f0f0f0;border-radius:20px}.index-module_box_zWG0q .index-module_content_u6Ai2::-webkit-scrollbar-thumb{background-color:#05a2c2;border-radius:20px;background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.4) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.4) 50%,rgba(255,255,255,.4) 75%,transparent 75%,transparent)}.index-module_box_zWG0q .index-module_placeholder_Ph2i8{color:#c2c2c2}.index-module_box_zWG0q .index-module_buttons_VMgCa{text-align:center;margin-top:20px;padding-top:20px;border-top:1px solid #f0f0f0}.index-module_box_zWG0q .index-module_buttons_VMgCa>*{margin:0 5px}:root,.index-module_hope-t-dFOaUu_6Zog5{--hope-sizes-4: 15px}.index-module_start_os-oO{position:fixed;right:15px;bottom:15px}div,p,body{box-sizing:border-box;margin:0;font-size:14px} ");

(function() {
  "use strict";
  const sharedConfig = {};
  function setHydrateContext(context) {
    sharedConfig.context = context;
  }
  const equalFn = (a2, b2) => a2 === b2;
  const $PROXY = Symbol("solid-proxy");
  const $TRACK = Symbol("solid-track");
  const $DEVCOMP = Symbol("solid-dev-component");
  const signalOptions = {
    equals: equalFn
  };
  let runEffects = runQueue;
  const STALE = 1;
  const PENDING = 2;
  const UNOWNED = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var Owner = null;
  let Transition$1 = null;
  let Listener = null;
  let Updates = null;
  let Effects = null;
  let ExecCount = 0;
  function createRoot(fn, detachedOwner) {
    const listener = Listener, owner = Owner, unowned = fn.length === 0, root = unowned ? UNOWNED : {
      owned: null,
      cleanups: null,
      context: null,
      owner: detachedOwner === void 0 ? owner : detachedOwner
    }, updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
    Owner = root;
    Listener = null;
    try {
      return runUpdates(updateFn, true);
    } finally {
      Listener = listener;
      Owner = owner;
    }
  }
  function createSignal(value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const s2 = {
      value,
      observers: null,
      observerSlots: null,
      comparator: options.equals || void 0
    };
    const setter = (value2) => {
      if (typeof value2 === "function") {
        value2 = value2(s2.value);
      }
      return writeSignal(s2, value2);
    };
    return [readSignal.bind(s2), setter];
  }
  function createComputed(fn, value, options) {
    const c2 = createComputation(fn, value, true, STALE);
    updateComputation(c2);
  }
  function createRenderEffect(fn, value, options) {
    const c2 = createComputation(fn, value, false, STALE);
    updateComputation(c2);
  }
  function createEffect(fn, value, options) {
    runEffects = runUserEffects;
    const c2 = createComputation(fn, value, false, STALE);
    c2.user = true;
    Effects ? Effects.push(c2) : updateComputation(c2);
  }
  function createMemo(fn, value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const c2 = createComputation(fn, value, true, 0);
    c2.observers = null;
    c2.observerSlots = null;
    c2.comparator = options.equals || void 0;
    updateComputation(c2);
    return readSignal.bind(c2);
  }
  function batch(fn) {
    return runUpdates(fn, false);
  }
  function untrack(fn) {
    if (Listener === null)
      return fn();
    const listener = Listener;
    Listener = null;
    try {
      return fn();
    } finally {
      Listener = listener;
    }
  }
  function on(deps, fn, options) {
    const isArray2 = Array.isArray(deps);
    let prevInput;
    let defer = options && options.defer;
    return (prevValue) => {
      let input;
      if (isArray2) {
        input = Array(deps.length);
        for (let i2 = 0; i2 < deps.length; i2++)
          input[i2] = deps[i2]();
      } else
        input = deps();
      if (defer) {
        defer = false;
        return void 0;
      }
      const result = untrack(() => fn(input, prevInput, prevValue));
      prevInput = input;
      return result;
    };
  }
  function onMount(fn) {
    createEffect(() => untrack(fn));
  }
  function onCleanup(fn) {
    if (Owner === null)
      ;
    else if (Owner.cleanups === null)
      Owner.cleanups = [fn];
    else
      Owner.cleanups.push(fn);
    return fn;
  }
  function getListener() {
    return Listener;
  }
  function createContext(defaultValue, options) {
    const id = Symbol("context");
    return {
      id,
      Provider: createProvider(id),
      defaultValue
    };
  }
  function useContext(context) {
    let ctx;
    return (ctx = lookup(Owner, context.id)) !== void 0 ? ctx : context.defaultValue;
  }
  function children(fn) {
    const children2 = createMemo(fn);
    const memo = createMemo(() => resolveChildren(children2()));
    memo.toArray = () => {
      const c2 = memo();
      return Array.isArray(c2) ? c2 : c2 != null ? [c2] : [];
    };
    return memo;
  }
  function readSignal() {
    const runningTransition = Transition$1;
    if (this.sources && (this.state || runningTransition)) {
      if (this.state === STALE || runningTransition)
        updateComputation(this);
      else {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(this), false);
        Updates = updates;
      }
    }
    if (Listener) {
      const sSlot = this.observers ? this.observers.length : 0;
      if (!Listener.sources) {
        Listener.sources = [this];
        Listener.sourceSlots = [sSlot];
      } else {
        Listener.sources.push(this);
        Listener.sourceSlots.push(sSlot);
      }
      if (!this.observers) {
        this.observers = [Listener];
        this.observerSlots = [Listener.sources.length - 1];
      } else {
        this.observers.push(Listener);
        this.observerSlots.push(Listener.sources.length - 1);
      }
    }
    return this.value;
  }
  function writeSignal(node, value, isComp) {
    let current = node.value;
    if (!node.comparator || !node.comparator(current, value)) {
      node.value = value;
      if (node.observers && node.observers.length) {
        runUpdates(() => {
          for (let i2 = 0; i2 < node.observers.length; i2 += 1) {
            const o2 = node.observers[i2];
            const TransitionRunning = Transition$1 && Transition$1.running;
            if (TransitionRunning && Transition$1.disposed.has(o2))
              ;
            if (TransitionRunning && !o2.tState || !TransitionRunning && !o2.state) {
              if (o2.pure)
                Updates.push(o2);
              else
                Effects.push(o2);
              if (o2.observers)
                markDownstream(o2);
            }
            if (TransitionRunning)
              ;
            else
              o2.state = STALE;
          }
          if (Updates.length > 1e6) {
            Updates = [];
            if (false)
              ;
            throw new Error();
          }
        }, false);
      }
    }
    return value;
  }
  function updateComputation(node) {
    if (!node.fn)
      return;
    cleanNode(node);
    const owner = Owner, listener = Listener, time = ExecCount;
    Listener = Owner = node;
    runComputation(node, node.value, time);
    Listener = listener;
    Owner = owner;
  }
  function runComputation(node, value, time) {
    let nextValue;
    try {
      nextValue = node.fn(value);
    } catch (err) {
      if (node.pure) {
        {
          node.state = STALE;
          node.owned && node.owned.forEach(cleanNode);
          node.owned = null;
        }
      }
      node.updatedAt = time + 1;
      return handleError(err);
    }
    if (!node.updatedAt || node.updatedAt <= time) {
      if (node.updatedAt != null && "observers" in node) {
        writeSignal(node, nextValue);
      } else
        node.value = nextValue;
      node.updatedAt = time;
    }
  }
  function createComputation(fn, init, pure, state = STALE, options) {
    const c2 = {
      fn,
      state,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: init,
      owner: Owner,
      context: null,
      pure
    };
    if (Owner === null)
      ;
    else if (Owner !== UNOWNED) {
      {
        if (!Owner.owned)
          Owner.owned = [c2];
        else
          Owner.owned.push(c2);
      }
    }
    return c2;
  }
  function runTop(node) {
    const runningTransition = Transition$1;
    if (node.state === 0 || runningTransition)
      return;
    if (node.state === PENDING || runningTransition)
      return lookUpstream(node);
    if (node.suspense && untrack(node.suspense.inFallback))
      return node.suspense.effects.push(node);
    const ancestors = [node];
    while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
      if (node.state || runningTransition)
        ancestors.push(node);
    }
    for (let i2 = ancestors.length - 1; i2 >= 0; i2--) {
      node = ancestors[i2];
      if (node.state === STALE || runningTransition) {
        updateComputation(node);
      } else if (node.state === PENDING || runningTransition) {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(node, ancestors[0]), false);
        Updates = updates;
      }
    }
  }
  function runUpdates(fn, init) {
    if (Updates)
      return fn();
    let wait = false;
    if (!init)
      Updates = [];
    if (Effects)
      wait = true;
    else
      Effects = [];
    ExecCount++;
    try {
      const res = fn();
      completeUpdates(wait);
      return res;
    } catch (err) {
      if (!wait)
        Effects = null;
      Updates = null;
      handleError(err);
    }
  }
  function completeUpdates(wait) {
    if (Updates) {
      runQueue(Updates);
      Updates = null;
    }
    if (wait)
      return;
    const e2 = Effects;
    Effects = null;
    if (e2.length)
      runUpdates(() => runEffects(e2), false);
  }
  function runQueue(queue) {
    for (let i2 = 0; i2 < queue.length; i2++)
      runTop(queue[i2]);
  }
  function runUserEffects(queue) {
    let i2, userLength = 0;
    for (i2 = 0; i2 < queue.length; i2++) {
      const e2 = queue[i2];
      if (!e2.user)
        runTop(e2);
      else
        queue[userLength++] = e2;
    }
    if (sharedConfig.context)
      setHydrateContext();
    for (i2 = 0; i2 < userLength; i2++)
      runTop(queue[i2]);
  }
  function lookUpstream(node, ignore) {
    const runningTransition = Transition$1;
    node.state = 0;
    for (let i2 = 0; i2 < node.sources.length; i2 += 1) {
      const source = node.sources[i2];
      if (source.sources) {
        if (source.state === STALE || runningTransition) {
          if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount))
            runTop(source);
        } else if (source.state === PENDING || runningTransition)
          lookUpstream(source, ignore);
      }
    }
  }
  function markDownstream(node) {
    const runningTransition = Transition$1;
    for (let i2 = 0; i2 < node.observers.length; i2 += 1) {
      const o2 = node.observers[i2];
      if (!o2.state || runningTransition) {
        o2.state = PENDING;
        if (o2.pure)
          Updates.push(o2);
        else
          Effects.push(o2);
        o2.observers && markDownstream(o2);
      }
    }
  }
  function cleanNode(node) {
    let i2;
    if (node.sources) {
      while (node.sources.length) {
        const source = node.sources.pop(), index2 = node.sourceSlots.pop(), obs = source.observers;
        if (obs && obs.length) {
          const n2 = obs.pop(), s2 = source.observerSlots.pop();
          if (index2 < obs.length) {
            n2.sourceSlots[s2] = index2;
            obs[index2] = n2;
            source.observerSlots[index2] = s2;
          }
        }
      }
    }
    if (node.owned) {
      for (i2 = 0; i2 < node.owned.length; i2++)
        cleanNode(node.owned[i2]);
      node.owned = null;
    }
    if (node.cleanups) {
      for (i2 = 0; i2 < node.cleanups.length; i2++)
        node.cleanups[i2]();
      node.cleanups = null;
    }
    node.state = 0;
    node.context = null;
  }
  function castError(err) {
    if (err instanceof Error || typeof err === "string")
      return err;
    return new Error("Unknown error");
  }
  function handleError(err) {
    err = castError(err);
    throw err;
  }
  function lookup(owner, key) {
    return owner ? owner.context && owner.context[key] !== void 0 ? owner.context[key] : lookup(owner.owner, key) : void 0;
  }
  function resolveChildren(children2) {
    if (typeof children2 === "function" && !children2.length)
      return resolveChildren(children2());
    if (Array.isArray(children2)) {
      const results = [];
      for (let i2 = 0; i2 < children2.length; i2++) {
        const result = resolveChildren(children2[i2]);
        Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
      }
      return results;
    }
    return children2;
  }
  function createProvider(id, options) {
    return function provider(props) {
      let res;
      createRenderEffect(() => res = untrack(() => {
        Owner.context = {
          [id]: props.value
        };
        return children(() => props.children);
      }), void 0);
      return res;
    };
  }
  const FALLBACK = Symbol("fallback");
  function dispose(d2) {
    for (let i2 = 0; i2 < d2.length; i2++)
      d2[i2]();
  }
  function mapArray(list2, mapFn, options = {}) {
    let items = [], mapped = [], disposers = [], len = 0, indexes = mapFn.length > 1 ? [] : null;
    onCleanup(() => dispose(disposers));
    return () => {
      let newItems = list2() || [], i2, j2;
      newItems[$TRACK];
      return untrack(() => {
        let newLen = newItems.length, newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start2, end, newEnd, item;
        if (newLen === 0) {
          if (len !== 0) {
            dispose(disposers);
            disposers = [];
            items = [];
            mapped = [];
            len = 0;
            indexes && (indexes = []);
          }
          if (options.fallback) {
            items = [FALLBACK];
            mapped[0] = createRoot((disposer) => {
              disposers[0] = disposer;
              return options.fallback();
            });
            len = 1;
          }
        } else if (len === 0) {
          mapped = new Array(newLen);
          for (j2 = 0; j2 < newLen; j2++) {
            items[j2] = newItems[j2];
            mapped[j2] = createRoot(mapper);
          }
          len = newLen;
        } else {
          temp = new Array(newLen);
          tempdisposers = new Array(newLen);
          indexes && (tempIndexes = new Array(newLen));
          for (start2 = 0, end = Math.min(len, newLen); start2 < end && items[start2] === newItems[start2]; start2++)
            ;
          for (end = len - 1, newEnd = newLen - 1; end >= start2 && newEnd >= start2 && items[end] === newItems[newEnd]; end--, newEnd--) {
            temp[newEnd] = mapped[end];
            tempdisposers[newEnd] = disposers[end];
            indexes && (tempIndexes[newEnd] = indexes[end]);
          }
          newIndices = /* @__PURE__ */ new Map();
          newIndicesNext = new Array(newEnd + 1);
          for (j2 = newEnd; j2 >= start2; j2--) {
            item = newItems[j2];
            i2 = newIndices.get(item);
            newIndicesNext[j2] = i2 === void 0 ? -1 : i2;
            newIndices.set(item, j2);
          }
          for (i2 = start2; i2 <= end; i2++) {
            item = items[i2];
            j2 = newIndices.get(item);
            if (j2 !== void 0 && j2 !== -1) {
              temp[j2] = mapped[i2];
              tempdisposers[j2] = disposers[i2];
              indexes && (tempIndexes[j2] = indexes[i2]);
              j2 = newIndicesNext[j2];
              newIndices.set(item, j2);
            } else
              disposers[i2]();
          }
          for (j2 = start2; j2 < newLen; j2++) {
            if (j2 in temp) {
              mapped[j2] = temp[j2];
              disposers[j2] = tempdisposers[j2];
              if (indexes) {
                indexes[j2] = tempIndexes[j2];
                indexes[j2](j2);
              }
            } else
              mapped[j2] = createRoot(mapper);
          }
          mapped = mapped.slice(0, len = newLen);
          items = newItems.slice(0);
        }
        return mapped;
      });
      function mapper(disposer) {
        disposers[j2] = disposer;
        if (indexes) {
          const [s2, set] = createSignal(j2);
          indexes[j2] = set;
          return mapFn(newItems[j2], s2);
        }
        return mapFn(newItems[j2]);
      }
    };
  }
  function createComponent(Comp, props) {
    return untrack(() => Comp(props || {}));
  }
  function trueFn() {
    return true;
  }
  const propTraps = {
    get(_, property, receiver) {
      if (property === $PROXY)
        return receiver;
      return _.get(property);
    },
    has(_, property) {
      if (property === $PROXY)
        return true;
      return _.has(property);
    },
    set: trueFn,
    deleteProperty: trueFn,
    getOwnPropertyDescriptor(_, property) {
      return {
        configurable: true,
        enumerable: true,
        get() {
          return _.get(property);
        },
        set: trueFn,
        deleteProperty: trueFn
      };
    },
    ownKeys(_) {
      return _.keys();
    }
  };
  function resolveSource(s2) {
    return !(s2 = typeof s2 === "function" ? s2() : s2) ? {} : s2;
  }
  function mergeProps(...sources) {
    let proxy = false;
    for (let i2 = 0; i2 < sources.length; i2++) {
      const s2 = sources[i2];
      proxy = proxy || !!s2 && $PROXY in s2;
      sources[i2] = typeof s2 === "function" ? (proxy = true, createMemo(s2)) : s2;
    }
    if (proxy) {
      return new Proxy({
        get(property) {
          for (let i2 = sources.length - 1; i2 >= 0; i2--) {
            const v2 = resolveSource(sources[i2])[property];
            if (v2 !== void 0)
              return v2;
          }
        },
        has(property) {
          for (let i2 = sources.length - 1; i2 >= 0; i2--) {
            if (property in resolveSource(sources[i2]))
              return true;
          }
          return false;
        },
        keys() {
          const keys = [];
          for (let i2 = 0; i2 < sources.length; i2++)
            keys.push(...Object.keys(resolveSource(sources[i2])));
          return [...new Set(keys)];
        }
      }, propTraps);
    }
    const target = {};
    for (let i2 = sources.length - 1; i2 >= 0; i2--) {
      if (sources[i2]) {
        const descriptors = Object.getOwnPropertyDescriptors(sources[i2]);
        for (const key in descriptors) {
          if (key in target)
            continue;
          Object.defineProperty(target, key, {
            enumerable: true,
            get() {
              for (let i3 = sources.length - 1; i3 >= 0; i3--) {
                const v2 = (sources[i3] || {})[key];
                if (v2 !== void 0)
                  return v2;
              }
            }
          });
        }
      }
    }
    return target;
  }
  function splitProps(props, ...keys) {
    const blocked = new Set(keys.flat());
    if ($PROXY in props) {
      const res = keys.map((k2) => {
        return new Proxy({
          get(property) {
            return k2.includes(property) ? props[property] : void 0;
          },
          has(property) {
            return k2.includes(property) && property in props;
          },
          keys() {
            return k2.filter((property) => property in props);
          }
        }, propTraps);
      });
      res.push(new Proxy({
        get(property) {
          return blocked.has(property) ? void 0 : props[property];
        },
        has(property) {
          return blocked.has(property) ? false : property in props;
        },
        keys() {
          return Object.keys(props).filter((k2) => !blocked.has(k2));
        }
      }, propTraps));
      return res;
    }
    const descriptors = Object.getOwnPropertyDescriptors(props);
    keys.push(Object.keys(descriptors).filter((k2) => !blocked.has(k2)));
    return keys.map((k2) => {
      const clone = {};
      for (let i2 = 0; i2 < k2.length; i2++) {
        const key = k2[i2];
        if (!(key in props))
          continue;
        Object.defineProperty(clone, key, descriptors[key] ? descriptors[key] : {
          get() {
            return props[key];
          },
          set() {
            return true;
          },
          enumerable: true
        });
      }
      return clone;
    });
  }
  let counter = 0;
  function createUniqueId() {
    const ctx = sharedConfig.context;
    return ctx ? `${ctx.id}${ctx.count++}` : `cl-${counter++}`;
  }
  function For(props) {
    const fallback = "fallback" in props && {
      fallback: () => props.fallback
    };
    return createMemo(mapArray(() => props.each, props.children, fallback || void 0));
  }
  function Show(props) {
    let strictEqual = false;
    const keyed = props.keyed;
    const condition = createMemo(() => props.when, void 0, {
      equals: (a2, b2) => strictEqual ? a2 === b2 : !a2 === !b2
    });
    return createMemo(() => {
      const c2 = condition();
      if (c2) {
        const child = props.children;
        const fn = typeof child === "function" && child.length > 0;
        strictEqual = keyed || fn;
        return fn ? untrack(() => child(c2)) : child;
      }
      return props.fallback;
    }, void 0, void 0);
  }
  const booleans = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"];
  const Properties = /* @__PURE__ */ new Set(["className", "value", "readOnly", "formNoValidate", "isMap", "noModule", "playsInline", ...booleans]);
  const ChildProperties = /* @__PURE__ */ new Set(["innerHTML", "textContent", "innerText", "children"]);
  const Aliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
    className: "class",
    htmlFor: "for"
  });
  const PropAliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
    class: "className",
    formnovalidate: "formNoValidate",
    ismap: "isMap",
    nomodule: "noModule",
    playsinline: "playsInline",
    readonly: "readOnly"
  });
  const DelegatedEvents = /* @__PURE__ */ new Set(["beforeinput", "click", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"]);
  const SVGElements = /* @__PURE__ */ new Set([
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animate",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "circle",
    "clipPath",
    "color-profile",
    "cursor",
    "defs",
    "desc",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "font",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "foreignObject",
    "g",
    "glyph",
    "glyphRef",
    "hkern",
    "image",
    "line",
    "linearGradient",
    "marker",
    "mask",
    "metadata",
    "missing-glyph",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "set",
    "stop",
    "svg",
    "switch",
    "symbol",
    "text",
    "textPath",
    "tref",
    "tspan",
    "use",
    "view",
    "vkern"
  ]);
  const SVGNamespace = {
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace"
  };
  function reconcileArrays(parentNode, a2, b2) {
    let bLength = b2.length, aEnd = a2.length, bEnd = bLength, aStart = 0, bStart = 0, after = a2[aEnd - 1].nextSibling, map = null;
    while (aStart < aEnd || bStart < bEnd) {
      if (a2[aStart] === b2[bStart]) {
        aStart++;
        bStart++;
        continue;
      }
      while (a2[aEnd - 1] === b2[bEnd - 1]) {
        aEnd--;
        bEnd--;
      }
      if (aEnd === aStart) {
        const node = bEnd < bLength ? bStart ? b2[bStart - 1].nextSibling : b2[bEnd - bStart] : after;
        while (bStart < bEnd)
          parentNode.insertBefore(b2[bStart++], node);
      } else if (bEnd === bStart) {
        while (aStart < aEnd) {
          if (!map || !map.has(a2[aStart]))
            a2[aStart].remove();
          aStart++;
        }
      } else if (a2[aStart] === b2[bEnd - 1] && b2[bStart] === a2[aEnd - 1]) {
        const node = a2[--aEnd].nextSibling;
        parentNode.insertBefore(b2[bStart++], a2[aStart++].nextSibling);
        parentNode.insertBefore(b2[--bEnd], node);
        a2[aEnd] = b2[bEnd];
      } else {
        if (!map) {
          map = /* @__PURE__ */ new Map();
          let i2 = bStart;
          while (i2 < bEnd)
            map.set(b2[i2], i2++);
        }
        const index2 = map.get(a2[aStart]);
        if (index2 != null) {
          if (bStart < index2 && index2 < bEnd) {
            let i2 = aStart, sequence = 1, t2;
            while (++i2 < aEnd && i2 < bEnd) {
              if ((t2 = map.get(a2[i2])) == null || t2 !== index2 + sequence)
                break;
              sequence++;
            }
            if (sequence > index2 - bStart) {
              const node = a2[aStart];
              while (bStart < index2)
                parentNode.insertBefore(b2[bStart++], node);
            } else
              parentNode.replaceChild(b2[bStart++], a2[aStart++]);
          } else
            aStart++;
        } else
          a2[aStart++].remove();
      }
    }
  }
  const $$EVENTS = "_$DX_DELEGATE";
  function render(code, element, init, options = {}) {
    let disposer;
    createRoot((dispose2) => {
      disposer = dispose2;
      element === document ? code() : insert(element, code(), element.firstChild ? null : void 0, init);
    }, options.owner);
    return () => {
      disposer();
      element.textContent = "";
    };
  }
  function template(html, check, isSVG) {
    const t2 = document.createElement("template");
    t2.innerHTML = html;
    if (check && t2.innerHTML.split("<").length - 1 !== check)
      throw `The browser resolved template HTML does not match JSX input:
${t2.innerHTML}

${html}. Is your HTML properly formed?`;
    let node = t2.content.firstChild;
    if (isSVG)
      node = node.firstChild;
    return node;
  }
  function delegateEvents(eventNames, document2 = window.document) {
    const e2 = document2[$$EVENTS] || (document2[$$EVENTS] = /* @__PURE__ */ new Set());
    for (let i2 = 0, l2 = eventNames.length; i2 < l2; i2++) {
      const name = eventNames[i2];
      if (!e2.has(name)) {
        e2.add(name);
        document2.addEventListener(name, eventHandler);
      }
    }
  }
  function setAttribute(node, name, value) {
    if (value == null)
      node.removeAttribute(name);
    else
      node.setAttribute(name, value);
  }
  function setAttributeNS(node, namespace, name, value) {
    if (value == null)
      node.removeAttributeNS(namespace, name);
    else
      node.setAttributeNS(namespace, name, value);
  }
  function className(node, value) {
    if (value == null)
      node.removeAttribute("class");
    else
      node.className = value;
  }
  function addEventListener(node, name, handler, delegate) {
    if (delegate) {
      if (Array.isArray(handler)) {
        node[`$$${name}`] = handler[0];
        node[`$$${name}Data`] = handler[1];
      } else
        node[`$$${name}`] = handler;
    } else if (Array.isArray(handler)) {
      const handlerFn = handler[0];
      node.addEventListener(name, handler[0] = (e2) => handlerFn.call(node, handler[1], e2));
    } else
      node.addEventListener(name, handler);
  }
  function classList(node, value, prev = {}) {
    const classKeys = Object.keys(value || {}), prevKeys = Object.keys(prev);
    let i2, len;
    for (i2 = 0, len = prevKeys.length; i2 < len; i2++) {
      const key = prevKeys[i2];
      if (!key || key === "undefined" || value[key])
        continue;
      toggleClassKey(node, key, false);
      delete prev[key];
    }
    for (i2 = 0, len = classKeys.length; i2 < len; i2++) {
      const key = classKeys[i2], classValue = !!value[key];
      if (!key || key === "undefined" || prev[key] === classValue || !classValue)
        continue;
      toggleClassKey(node, key, true);
      prev[key] = classValue;
    }
    return prev;
  }
  function style(node, value, prev) {
    if (!value)
      return prev ? setAttribute(node, "style") : value;
    const nodeStyle = node.style;
    if (typeof value === "string")
      return nodeStyle.cssText = value;
    typeof prev === "string" && (nodeStyle.cssText = prev = void 0);
    prev || (prev = {});
    value || (value = {});
    let v2, s2;
    for (s2 in prev) {
      value[s2] == null && nodeStyle.removeProperty(s2);
      delete prev[s2];
    }
    for (s2 in value) {
      v2 = value[s2];
      if (v2 !== prev[s2]) {
        nodeStyle.setProperty(s2, v2);
        prev[s2] = v2;
      }
    }
    return prev;
  }
  function spread(node, props = {}, isSVG, skipChildren) {
    const prevProps = {};
    if (!skipChildren) {
      createRenderEffect(() => prevProps.children = insertExpression(node, props.children, prevProps.children));
    }
    createRenderEffect(() => props.ref && props.ref(node));
    createRenderEffect(() => assign(node, props, isSVG, true, prevProps, true));
    return prevProps;
  }
  function insert(parent, accessor, marker, initial) {
    if (marker !== void 0 && !initial)
      initial = [];
    if (typeof accessor !== "function")
      return insertExpression(parent, accessor, initial, marker);
    createRenderEffect((current) => insertExpression(parent, accessor(), current, marker), initial);
  }
  function assign(node, props, isSVG, skipChildren, prevProps = {}, skipRef = false) {
    props || (props = {});
    for (const prop in prevProps) {
      if (!(prop in props)) {
        if (prop === "children")
          continue;
        prevProps[prop] = assignProp(node, prop, null, prevProps[prop], isSVG, skipRef);
      }
    }
    for (const prop in props) {
      if (prop === "children") {
        if (!skipChildren)
          insertExpression(node, props.children);
        continue;
      }
      const value = props[prop];
      prevProps[prop] = assignProp(node, prop, value, prevProps[prop], isSVG, skipRef);
    }
  }
  function getNextElement(template2) {
    let node, key;
    if (!sharedConfig.context || !(node = sharedConfig.registry.get(key = getHydrationKey()))) {
      if (sharedConfig.context)
        console.warn("Unable to find DOM nodes for hydration key:", key);
      if (!template2)
        throw new Error("Unrecoverable Hydration Mismatch. No template for key: " + key);
      return template2.cloneNode(true);
    }
    if (sharedConfig.completed)
      sharedConfig.completed.add(node);
    sharedConfig.registry.delete(key);
    return node;
  }
  function toPropertyName(name) {
    return name.toLowerCase().replace(/-([a-z])/g, (_, w2) => w2.toUpperCase());
  }
  function toggleClassKey(node, key, value) {
    const classNames2 = key.trim().split(/\s+/);
    for (let i2 = 0, nameLen = classNames2.length; i2 < nameLen; i2++)
      node.classList.toggle(classNames2[i2], value);
  }
  function assignProp(node, prop, value, prev, isSVG, skipRef) {
    let isCE, isProp, isChildProp;
    if (prop === "style")
      return style(node, value, prev);
    if (prop === "classList")
      return classList(node, value, prev);
    if (value === prev)
      return prev;
    if (prop === "ref") {
      if (!skipRef)
        value(node);
    } else if (prop.slice(0, 3) === "on:") {
      const e2 = prop.slice(3);
      prev && node.removeEventListener(e2, prev);
      value && node.addEventListener(e2, value);
    } else if (prop.slice(0, 10) === "oncapture:") {
      const e2 = prop.slice(10);
      prev && node.removeEventListener(e2, prev, true);
      value && node.addEventListener(e2, value, true);
    } else if (prop.slice(0, 2) === "on") {
      const name = prop.slice(2).toLowerCase();
      const delegate = DelegatedEvents.has(name);
      if (!delegate && prev) {
        const h2 = Array.isArray(prev) ? prev[0] : prev;
        node.removeEventListener(name, h2);
      }
      if (delegate || value) {
        addEventListener(node, name, value, delegate);
        delegate && delegateEvents([name]);
      }
    } else if ((isChildProp = ChildProperties.has(prop)) || !isSVG && (PropAliases[prop] || (isProp = Properties.has(prop))) || (isCE = node.nodeName.includes("-"))) {
      if (prop === "class" || prop === "className")
        className(node, value);
      else if (isCE && !isProp && !isChildProp)
        node[toPropertyName(prop)] = value;
      else
        node[PropAliases[prop] || prop] = value;
    } else {
      const ns = isSVG && prop.indexOf(":") > -1 && SVGNamespace[prop.split(":")[0]];
      if (ns)
        setAttributeNS(node, ns, prop, value);
      else
        setAttribute(node, Aliases[prop] || prop, value);
    }
    return value;
  }
  function eventHandler(e2) {
    const key = `$$${e2.type}`;
    let node = e2.composedPath && e2.composedPath()[0] || e2.target;
    if (e2.target !== node) {
      Object.defineProperty(e2, "target", {
        configurable: true,
        value: node
      });
    }
    Object.defineProperty(e2, "currentTarget", {
      configurable: true,
      get() {
        return node || document;
      }
    });
    if (sharedConfig.registry && !sharedConfig.done) {
      sharedConfig.done = true;
      document.querySelectorAll("[id^=pl-]").forEach((elem) => {
        while (elem && elem.nodeType !== 8 && elem.nodeValue !== "pl-" + e2) {
          let x2 = elem.nextSibling;
          elem.remove();
          elem = x2;
        }
        elem && elem.remove();
      });
    }
    while (node) {
      const handler = node[key];
      if (handler && !node.disabled) {
        const data = node[`${key}Data`];
        data !== void 0 ? handler.call(node, data, e2) : handler.call(node, e2);
        if (e2.cancelBubble)
          return;
      }
      node = node._$host || node.parentNode || node.host;
    }
  }
  function insertExpression(parent, value, current, marker, unwrapArray) {
    if (sharedConfig.context && !current)
      current = [...parent.childNodes];
    while (typeof current === "function")
      current = current();
    if (value === current)
      return current;
    const t2 = typeof value, multi = marker !== void 0;
    parent = multi && current[0] && current[0].parentNode || parent;
    if (t2 === "string" || t2 === "number") {
      if (sharedConfig.context)
        return current;
      if (t2 === "number")
        value = value.toString();
      if (multi) {
        let node = current[0];
        if (node && node.nodeType === 3) {
          node.data = value;
        } else
          node = document.createTextNode(value);
        current = cleanChildren(parent, current, marker, node);
      } else {
        if (current !== "" && typeof current === "string") {
          current = parent.firstChild.data = value;
        } else
          current = parent.textContent = value;
      }
    } else if (value == null || t2 === "boolean") {
      if (sharedConfig.context)
        return current;
      current = cleanChildren(parent, current, marker);
    } else if (t2 === "function") {
      createRenderEffect(() => {
        let v2 = value();
        while (typeof v2 === "function")
          v2 = v2();
        current = insertExpression(parent, v2, current, marker);
      });
      return () => current;
    } else if (Array.isArray(value)) {
      const array = [];
      const currentArray = current && Array.isArray(current);
      if (normalizeIncomingArray(array, value, current, unwrapArray)) {
        createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
        return () => current;
      }
      if (sharedConfig.context) {
        if (!array.length)
          return current;
        for (let i2 = 0; i2 < array.length; i2++) {
          if (array[i2].parentNode)
            return current = array;
        }
      }
      if (array.length === 0) {
        current = cleanChildren(parent, current, marker);
        if (multi)
          return current;
      } else if (currentArray) {
        if (current.length === 0) {
          appendNodes(parent, array, marker);
        } else
          reconcileArrays(parent, current, array);
      } else {
        current && cleanChildren(parent);
        appendNodes(parent, array);
      }
      current = array;
    } else if (value instanceof Node) {
      if (sharedConfig.context && value.parentNode)
        return current = multi ? [value] : value;
      if (Array.isArray(current)) {
        if (multi)
          return current = cleanChildren(parent, current, marker, value);
        cleanChildren(parent, current, null, value);
      } else if (current == null || current === "" || !parent.firstChild) {
        parent.appendChild(value);
      } else
        parent.replaceChild(value, parent.firstChild);
      current = value;
    } else
      console.warn(`Unrecognized value. Skipped inserting`, value);
    return current;
  }
  function normalizeIncomingArray(normalized, array, current, unwrap2) {
    let dynamic = false;
    for (let i2 = 0, len = array.length; i2 < len; i2++) {
      let item = array[i2], prev = current && current[i2];
      if (item instanceof Node) {
        normalized.push(item);
      } else if (item == null || item === true || item === false)
        ;
      else if (Array.isArray(item)) {
        dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
      } else if (typeof item === "function") {
        if (unwrap2) {
          while (typeof item === "function")
            item = item();
          dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
        } else {
          normalized.push(item);
          dynamic = true;
        }
      } else {
        const value = String(item);
        if (prev && prev.nodeType === 3 && prev.data === value) {
          normalized.push(prev);
        } else
          normalized.push(document.createTextNode(value));
      }
    }
    return dynamic;
  }
  function appendNodes(parent, array, marker = null) {
    for (let i2 = 0, len = array.length; i2 < len; i2++)
      parent.insertBefore(array[i2], marker);
  }
  function cleanChildren(parent, current, marker, replacement) {
    if (marker === void 0)
      return parent.textContent = "";
    const node = replacement || document.createTextNode("");
    if (current.length) {
      let inserted = false;
      for (let i2 = current.length - 1; i2 >= 0; i2--) {
        const el = current[i2];
        if (node !== el) {
          const isParent = el.parentNode === parent;
          if (!inserted && !i2)
            isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);
          else
            isParent && el.remove();
        } else
          inserted = true;
      }
    } else
      parent.insertBefore(node, marker);
    return [node];
  }
  function getHydrationKey() {
    const hydrate = sharedConfig.context;
    return `${hydrate.id}${hydrate.count++}`;
  }
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  function createElement(tagName, isSVG = false) {
    return isSVG ? document.createElementNS(SVG_NAMESPACE, tagName) : document.createElement(tagName);
  }
  function Portal(props) {
    const {
      useShadow
    } = props, marker = document.createTextNode(""), mount = () => props.mount || document.body, content2 = createMemo(renderPortal());
    function renderPortal() {
      if (sharedConfig.context) {
        const [s2, set] = createSignal(false);
        onMount(() => set(true));
        return () => s2() && props.children;
      } else
        return () => props.children;
    }
    createRenderEffect(() => {
      const el = mount();
      if (el instanceof HTMLHeadElement) {
        const [clean, setClean] = createSignal(false);
        const cleanup = () => setClean(true);
        createRoot((dispose2) => insert(el, () => !clean() ? content2() : dispose2(), null));
        onCleanup(() => {
          if (sharedConfig.context)
            queueMicrotask(cleanup);
          else
            cleanup();
        });
      } else {
        const container = createElement(props.isSVG ? "g" : "div", props.isSVG), renderRoot = useShadow && container.attachShadow ? container.attachShadow({
          mode: "open"
        }) : container;
        Object.defineProperty(container, "_$host", {
          get() {
            return marker.parentNode;
          },
          configurable: true
        });
        insert(renderRoot, content2);
        el.appendChild(container);
        props.ref && props.ref(container);
        onCleanup(() => el.removeChild(container));
      }
    });
    return marker;
  }
  function Dynamic(props) {
    const [p2, others] = splitProps(props, ["component"]);
    const cached = createMemo(() => p2.component);
    return createMemo(() => {
      const component = cached();
      switch (typeof component) {
        case "function":
          Object.assign(component, {
            [$DEVCOMP]: true
          });
          return untrack(() => component(others));
        case "string":
          const isSvg = SVGElements.has(component);
          const el = sharedConfig.context ? getNextElement() : createElement(component, isSvg);
          spread(el, others, isSvg);
          return el;
      }
    });
  }
  const $RAW = Symbol("store-raw"), $NODE = Symbol("store-node"), $NAME = Symbol("store-name");
  function wrap$1(value, name) {
    let p2 = value[$PROXY];
    if (!p2) {
      Object.defineProperty(value, $PROXY, {
        value: p2 = new Proxy(value, proxyTraps$1)
      });
      if (!Array.isArray(value)) {
        const keys = Object.keys(value), desc = Object.getOwnPropertyDescriptors(value);
        for (let i2 = 0, l2 = keys.length; i2 < l2; i2++) {
          const prop = keys[i2];
          if (desc[prop].get) {
            Object.defineProperty(value, prop, {
              enumerable: desc[prop].enumerable,
              get: desc[prop].get.bind(p2)
            });
          }
        }
      }
    }
    return p2;
  }
  function isWrappable(obj) {
    let proto;
    return obj != null && typeof obj === "object" && (obj[$PROXY] || !(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype || Array.isArray(obj));
  }
  function unwrap(item, set = /* @__PURE__ */ new Set()) {
    let result, unwrapped, v2, prop;
    if (result = item != null && item[$RAW])
      return result;
    if (!isWrappable(item) || set.has(item))
      return item;
    if (Array.isArray(item)) {
      if (Object.isFrozen(item))
        item = item.slice(0);
      else
        set.add(item);
      for (let i2 = 0, l2 = item.length; i2 < l2; i2++) {
        v2 = item[i2];
        if ((unwrapped = unwrap(v2, set)) !== v2)
          item[i2] = unwrapped;
      }
    } else {
      if (Object.isFrozen(item))
        item = Object.assign({}, item);
      else
        set.add(item);
      const keys = Object.keys(item), desc = Object.getOwnPropertyDescriptors(item);
      for (let i2 = 0, l2 = keys.length; i2 < l2; i2++) {
        prop = keys[i2];
        if (desc[prop].get)
          continue;
        v2 = item[prop];
        if ((unwrapped = unwrap(v2, set)) !== v2)
          item[prop] = unwrapped;
      }
    }
    return item;
  }
  function getDataNodes(target) {
    let nodes = target[$NODE];
    if (!nodes)
      Object.defineProperty(target, $NODE, {
        value: nodes = {}
      });
    return nodes;
  }
  function getDataNode(nodes, property, value) {
    return nodes[property] || (nodes[property] = createDataNode(value));
  }
  function proxyDescriptor$1(target, property) {
    const desc = Reflect.getOwnPropertyDescriptor(target, property);
    if (!desc || desc.get || !desc.configurable || property === $PROXY || property === $NODE || property === $NAME)
      return desc;
    delete desc.value;
    delete desc.writable;
    desc.get = () => target[$PROXY][property];
    return desc;
  }
  function trackSelf(target) {
    if (getListener()) {
      const nodes = getDataNodes(target);
      (nodes._ || (nodes._ = createDataNode()))();
    }
  }
  function ownKeys(target) {
    trackSelf(target);
    return Reflect.ownKeys(target);
  }
  function createDataNode(value) {
    const [s2, set] = createSignal(value, {
      equals: false,
      internal: true
    });
    s2.$ = set;
    return s2;
  }
  const proxyTraps$1 = {
    get(target, property, receiver) {
      if (property === $RAW)
        return target;
      if (property === $PROXY)
        return receiver;
      if (property === $TRACK) {
        trackSelf(target);
        return receiver;
      }
      const nodes = getDataNodes(target);
      const tracked = nodes.hasOwnProperty(property);
      let value = tracked ? nodes[property]() : target[property];
      if (property === $NODE || property === "__proto__")
        return value;
      if (!tracked) {
        const desc = Object.getOwnPropertyDescriptor(target, property);
        if (getListener() && (typeof value !== "function" || target.hasOwnProperty(property)) && !(desc && desc.get))
          value = getDataNode(nodes, property, value)();
      }
      return isWrappable(value) ? wrap$1(value) : value;
    },
    has(target, property) {
      if (property === $RAW || property === $PROXY || property === $TRACK || property === $NODE || property === "__proto__")
        return true;
      this.get(target, property, target);
      return property in target;
    },
    set() {
      return true;
    },
    deleteProperty() {
      return true;
    },
    ownKeys,
    getOwnPropertyDescriptor: proxyDescriptor$1
  };
  function setProperty(state, property, value, deleting = false) {
    if (!deleting && state[property] === value)
      return;
    const prev = state[property], len = state.length;
    if (value === void 0)
      delete state[property];
    else
      state[property] = value;
    let nodes = getDataNodes(state), node;
    if (node = getDataNode(nodes, property, prev))
      node.$(() => value);
    if (Array.isArray(state) && state.length !== len)
      (node = getDataNode(nodes, "length", len)) && node.$(state.length);
    (node = nodes._) && node.$();
  }
  function mergeStoreNode(state, value) {
    const keys = Object.keys(value);
    for (let i2 = 0; i2 < keys.length; i2 += 1) {
      const key = keys[i2];
      setProperty(state, key, value[key]);
    }
  }
  function updateArray(current, next) {
    if (typeof next === "function")
      next = next(current);
    next = unwrap(next);
    if (Array.isArray(next)) {
      if (current === next)
        return;
      let i2 = 0, len = next.length;
      for (; i2 < len; i2++) {
        const value = next[i2];
        if (current[i2] !== value)
          setProperty(current, i2, value);
      }
      setProperty(current, "length", len);
    } else
      mergeStoreNode(current, next);
  }
  function updatePath(current, path, traversed = []) {
    let part, prev = current;
    if (path.length > 1) {
      part = path.shift();
      const partType = typeof part, isArray2 = Array.isArray(current);
      if (Array.isArray(part)) {
        for (let i2 = 0; i2 < part.length; i2++) {
          updatePath(current, [part[i2]].concat(path), traversed);
        }
        return;
      } else if (isArray2 && partType === "function") {
        for (let i2 = 0; i2 < current.length; i2++) {
          if (part(current[i2], i2))
            updatePath(current, [i2].concat(path), traversed);
        }
        return;
      } else if (isArray2 && partType === "object") {
        const {
          from = 0,
          to = current.length - 1,
          by = 1
        } = part;
        for (let i2 = from; i2 <= to; i2 += by) {
          updatePath(current, [i2].concat(path), traversed);
        }
        return;
      } else if (path.length > 1) {
        updatePath(current[part], path, [part].concat(traversed));
        return;
      }
      prev = current[part];
      traversed = [part].concat(traversed);
    }
    let value = path[0];
    if (typeof value === "function") {
      value = value(prev, traversed);
      if (value === prev)
        return;
    }
    if (part === void 0 && value == void 0)
      return;
    value = unwrap(value);
    if (part === void 0 || isWrappable(prev) && isWrappable(value) && !Array.isArray(value)) {
      mergeStoreNode(prev, value);
    } else
      setProperty(current, part, value);
  }
  function createStore(...[store, options]) {
    const unwrappedStore = unwrap(store || {});
    const isArray2 = Array.isArray(unwrappedStore);
    const wrappedStore = wrap$1(unwrappedStore);
    function setStore(...args) {
      batch(() => {
        isArray2 && args.length === 1 ? updateArray(unwrappedStore, args[0]) : updatePath(unwrappedStore, args);
      });
    }
    return [wrappedStore, setStore];
  }
  var t$1 = "colors", n$2 = "sizes", r$2 = "space", i$2 = { gap: r$2, gridGap: r$2, columnGap: r$2, gridColumnGap: r$2, rowGap: r$2, gridRowGap: r$2, inset: r$2, insetBlock: r$2, insetBlockEnd: r$2, insetBlockStart: r$2, insetInline: r$2, insetInlineEnd: r$2, insetInlineStart: r$2, margin: r$2, marginTop: r$2, marginRight: r$2, marginBottom: r$2, marginLeft: r$2, marginBlock: r$2, marginBlockEnd: r$2, marginBlockStart: r$2, marginInline: r$2, marginInlineEnd: r$2, marginInlineStart: r$2, padding: r$2, paddingTop: r$2, paddingRight: r$2, paddingBottom: r$2, paddingLeft: r$2, paddingBlock: r$2, paddingBlockEnd: r$2, paddingBlockStart: r$2, paddingInline: r$2, paddingInlineEnd: r$2, paddingInlineStart: r$2, top: r$2, right: r$2, bottom: r$2, left: r$2, scrollMargin: r$2, scrollMarginTop: r$2, scrollMarginRight: r$2, scrollMarginBottom: r$2, scrollMarginLeft: r$2, scrollMarginX: r$2, scrollMarginY: r$2, scrollMarginBlock: r$2, scrollMarginBlockEnd: r$2, scrollMarginBlockStart: r$2, scrollMarginInline: r$2, scrollMarginInlineEnd: r$2, scrollMarginInlineStart: r$2, scrollPadding: r$2, scrollPaddingTop: r$2, scrollPaddingRight: r$2, scrollPaddingBottom: r$2, scrollPaddingLeft: r$2, scrollPaddingX: r$2, scrollPaddingY: r$2, scrollPaddingBlock: r$2, scrollPaddingBlockEnd: r$2, scrollPaddingBlockStart: r$2, scrollPaddingInline: r$2, scrollPaddingInlineEnd: r$2, scrollPaddingInlineStart: r$2, fontSize: "fontSizes", background: t$1, backgroundColor: t$1, backgroundImage: t$1, borderImage: t$1, border: t$1, borderBlock: t$1, borderBlockEnd: t$1, borderBlockStart: t$1, borderBottom: t$1, borderBottomColor: t$1, borderColor: t$1, borderInline: t$1, borderInlineEnd: t$1, borderInlineStart: t$1, borderLeft: t$1, borderLeftColor: t$1, borderRight: t$1, borderRightColor: t$1, borderTop: t$1, borderTopColor: t$1, caretColor: t$1, color: t$1, columnRuleColor: t$1, fill: t$1, outline: t$1, outlineColor: t$1, stroke: t$1, textDecorationColor: t$1, fontFamily: "fonts", fontWeight: "fontWeights", lineHeight: "lineHeights", letterSpacing: "letterSpacings", blockSize: n$2, minBlockSize: n$2, maxBlockSize: n$2, inlineSize: n$2, minInlineSize: n$2, maxInlineSize: n$2, width: n$2, minWidth: n$2, maxWidth: n$2, height: n$2, minHeight: n$2, maxHeight: n$2, flexBasis: n$2, gridTemplateColumns: n$2, gridTemplateRows: n$2, borderWidth: "borderWidths", borderTopWidth: "borderWidths", borderRightWidth: "borderWidths", borderBottomWidth: "borderWidths", borderLeftWidth: "borderWidths", borderStyle: "borderStyles", borderTopStyle: "borderStyles", borderRightStyle: "borderStyles", borderBottomStyle: "borderStyles", borderLeftStyle: "borderStyles", borderRadius: "radii", borderTopLeftRadius: "radii", borderTopRightRadius: "radii", borderBottomRightRadius: "radii", borderBottomLeftRadius: "radii", boxShadow: "shadows", textShadow: "shadows", transition: "transitions", zIndex: "zIndices" }, o$2 = (e2, t2) => "function" == typeof t2 ? { "()": Function.prototype.toString.call(t2) } : t2, l$2 = () => {
    const e2 = /* @__PURE__ */ Object.create(null);
    return (t2, n2, ...r2) => {
      const i2 = ((e3) => JSON.stringify(e3, o$2))(t2);
      return i2 in e2 ? e2[i2] : e2[i2] = n2(t2, ...r2);
    };
  }, s$2 = Symbol.for("sxs.internal"), a$2 = (e2, t2) => Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)), c$2 = (e2) => {
    for (const t2 in e2)
      return true;
    return false;
  }, { hasOwnProperty: d$2 } = Object.prototype, g$2 = (e2) => e2.includes("-") ? e2 : e2.replace(/[A-Z]/g, (e3) => "-" + e3.toLowerCase()), p$2 = /\s+(?![^()]*\))/, u$2 = (e2) => (t2) => e2(..."string" == typeof t2 ? String(t2).split(p$2) : [t2]), h$2 = { appearance: (e2) => ({ WebkitAppearance: e2, appearance: e2 }), backfaceVisibility: (e2) => ({ WebkitBackfaceVisibility: e2, backfaceVisibility: e2 }), backdropFilter: (e2) => ({ WebkitBackdropFilter: e2, backdropFilter: e2 }), backgroundClip: (e2) => ({ WebkitBackgroundClip: e2, backgroundClip: e2 }), boxDecorationBreak: (e2) => ({ WebkitBoxDecorationBreak: e2, boxDecorationBreak: e2 }), clipPath: (e2) => ({ WebkitClipPath: e2, clipPath: e2 }), content: (e2) => ({ content: e2.includes('"') || e2.includes("'") || /^([A-Za-z]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)$/.test(e2) ? e2 : `"${e2}"` }), hyphens: (e2) => ({ WebkitHyphens: e2, hyphens: e2 }), maskImage: (e2) => ({ WebkitMaskImage: e2, maskImage: e2 }), maskSize: (e2) => ({ WebkitMaskSize: e2, maskSize: e2 }), tabSize: (e2) => ({ MozTabSize: e2, tabSize: e2 }), textSizeAdjust: (e2) => ({ WebkitTextSizeAdjust: e2, textSizeAdjust: e2 }), userSelect: (e2) => ({ WebkitUserSelect: e2, userSelect: e2 }), marginBlock: u$2((e2, t2) => ({ marginBlockStart: e2, marginBlockEnd: t2 || e2 })), marginInline: u$2((e2, t2) => ({ marginInlineStart: e2, marginInlineEnd: t2 || e2 })), maxSize: u$2((e2, t2) => ({ maxBlockSize: e2, maxInlineSize: t2 || e2 })), minSize: u$2((e2, t2) => ({ minBlockSize: e2, minInlineSize: t2 || e2 })), paddingBlock: u$2((e2, t2) => ({ paddingBlockStart: e2, paddingBlockEnd: t2 || e2 })), paddingInline: u$2((e2, t2) => ({ paddingInlineStart: e2, paddingInlineEnd: t2 || e2 })) }, f$2 = /([\d.]+)([^]*)/, m$1 = (e2, t2) => e2.length ? e2.reduce((e3, n2) => (e3.push(...t2.map((e4) => e4.includes("&") ? e4.replace(/&/g, /[ +>|~]/.test(n2) && /&.*&/.test(e4) ? `:is(${n2})` : n2) : n2 + " " + e4)), e3), []) : t2, b$2 = (e2, t2) => e2 in S$1 && "string" == typeof t2 ? t2.replace(/^((?:[^]*[^\w-])?)(fit-content|stretch)((?:[^\w-][^]*)?)$/, (t3, n2, r2, i2) => n2 + ("stretch" === r2 ? `-moz-available${i2};${g$2(e2)}:${n2}-webkit-fill-available` : `-moz-fit-content${i2};${g$2(e2)}:${n2}fit-content`) + i2) : String(t2), S$1 = { blockSize: 1, height: 1, inlineSize: 1, maxBlockSize: 1, maxHeight: 1, maxInlineSize: 1, maxWidth: 1, minBlockSize: 1, minHeight: 1, minInlineSize: 1, minWidth: 1, width: 1 }, k$1 = (e2) => e2 ? e2 + "-" : "", y$2 = (e2, t2, n2) => e2.replace(/([+-])?((?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)?(\$|--)([$\w-]+)/g, (e3, r2, i2, o2, l2) => "$" == o2 == !!i2 ? e3 : (r2 || "--" == o2 ? "calc(" : "") + "var(--" + ("$" === o2 ? k$1(t2) + (l2.includes("$") ? "" : k$1(n2)) + l2.replace(/\$/g, "-") : l2) + ")" + (r2 || "--" == o2 ? "*" + (r2 || "") + (i2 || "1") + ")" : "")), B = /\s*,\s*(?![^()]*\))/, $ = Object.prototype.toString, x$2 = (e2, t2, n2, r2, i2) => {
    let o2, l2, s2;
    const a2 = (e3, t3, n3) => {
      let c2, d2;
      const p2 = (e4) => {
        for (c2 in e4) {
          const x2 = 64 === c2.charCodeAt(0), z2 = x2 && Array.isArray(e4[c2]) ? e4[c2] : [e4[c2]];
          for (d2 of z2) {
            const e5 = /[A-Z]/.test(S2 = c2) ? S2 : S2.replace(/-[^]/g, (e6) => e6[1].toUpperCase()), z3 = "object" == typeof d2 && d2 && d2.toString === $ && (!r2.utils[e5] || !t3.length);
            if (e5 in r2.utils && !z3) {
              const t4 = r2.utils[e5];
              if (t4 !== l2) {
                l2 = t4, p2(t4(d2)), l2 = null;
                continue;
              }
            } else if (e5 in h$2) {
              const t4 = h$2[e5];
              if (t4 !== s2) {
                s2 = t4, p2(t4(d2)), s2 = null;
                continue;
              }
            }
            if (x2 && (u2 = c2.slice(1) in r2.media ? "@media " + r2.media[c2.slice(1)] : c2, c2 = u2.replace(/\(\s*([\w-]+)\s*(=|<|<=|>|>=)\s*([\w-]+)\s*(?:(<|<=|>|>=)\s*([\w-]+)\s*)?\)/g, (e6, t4, n4, r3, i3, o3) => {
              const l3 = f$2.test(t4), s3 = 0.0625 * (l3 ? -1 : 1), [a3, c3] = l3 ? [r3, t4] : [t4, r3];
              return "(" + ("=" === n4[0] ? "" : ">" === n4[0] === l3 ? "max-" : "min-") + a3 + ":" + ("=" !== n4[0] && 1 === n4.length ? c3.replace(f$2, (e7, t5, r4) => Number(t5) + s3 * (">" === n4 ? 1 : -1) + r4) : c3) + (i3 ? ") and (" + (">" === i3[0] ? "min-" : "max-") + a3 + ":" + (1 === i3.length ? o3.replace(f$2, (e7, t5, n5) => Number(t5) + s3 * (">" === i3 ? -1 : 1) + n5) : o3) : "") + ")";
            })), z3) {
              const e6 = x2 ? n3.concat(c2) : [...n3], r3 = x2 ? [...t3] : m$1(t3, c2.split(B));
              void 0 !== o2 && i2(I(...o2)), o2 = void 0, a2(d2, r3, e6);
            } else
              void 0 === o2 && (o2 = [[], t3, n3]), c2 = x2 || 36 !== c2.charCodeAt(0) ? c2 : `--${k$1(r2.prefix)}${c2.slice(1).replace(/\$/g, "-")}`, d2 = z3 ? d2 : "number" == typeof d2 ? d2 && e5 in R$1 ? String(d2) + "px" : String(d2) : y$2(b$2(e5, null == d2 ? "" : d2), r2.prefix, r2.themeMap[e5]), o2[0].push(`${x2 ? `${c2} ` : `${g$2(c2)}:`}${d2}`);
          }
        }
        var u2, S2;
      };
      p2(e3), void 0 !== o2 && i2(I(...o2)), o2 = void 0;
    };
    a2(e2, t2, n2);
  }, I = (e2, t2, n2) => `${n2.map((e3) => `${e3}{`).join("")}${t2.length ? `${t2.join(",")}{` : ""}${e2.join(";")}${t2.length ? "}" : ""}${Array(n2.length ? n2.length + 1 : 0).join("}")}`, R$1 = { animationDelay: 1, animationDuration: 1, backgroundSize: 1, blockSize: 1, border: 1, borderBlock: 1, borderBlockEnd: 1, borderBlockEndWidth: 1, borderBlockStart: 1, borderBlockStartWidth: 1, borderBlockWidth: 1, borderBottom: 1, borderBottomLeftRadius: 1, borderBottomRightRadius: 1, borderBottomWidth: 1, borderEndEndRadius: 1, borderEndStartRadius: 1, borderInlineEnd: 1, borderInlineEndWidth: 1, borderInlineStart: 1, borderInlineStartWidth: 1, borderInlineWidth: 1, borderLeft: 1, borderLeftWidth: 1, borderRadius: 1, borderRight: 1, borderRightWidth: 1, borderSpacing: 1, borderStartEndRadius: 1, borderStartStartRadius: 1, borderTop: 1, borderTopLeftRadius: 1, borderTopRightRadius: 1, borderTopWidth: 1, borderWidth: 1, bottom: 1, columnGap: 1, columnRule: 1, columnRuleWidth: 1, columnWidth: 1, containIntrinsicSize: 1, flexBasis: 1, fontSize: 1, gap: 1, gridAutoColumns: 1, gridAutoRows: 1, gridTemplateColumns: 1, gridTemplateRows: 1, height: 1, inlineSize: 1, inset: 1, insetBlock: 1, insetBlockEnd: 1, insetBlockStart: 1, insetInline: 1, insetInlineEnd: 1, insetInlineStart: 1, left: 1, letterSpacing: 1, margin: 1, marginBlock: 1, marginBlockEnd: 1, marginBlockStart: 1, marginBottom: 1, marginInline: 1, marginInlineEnd: 1, marginInlineStart: 1, marginLeft: 1, marginRight: 1, marginTop: 1, maxBlockSize: 1, maxHeight: 1, maxInlineSize: 1, maxWidth: 1, minBlockSize: 1, minHeight: 1, minInlineSize: 1, minWidth: 1, offsetDistance: 1, offsetRotate: 1, outline: 1, outlineOffset: 1, outlineWidth: 1, overflowClipMargin: 1, padding: 1, paddingBlock: 1, paddingBlockEnd: 1, paddingBlockStart: 1, paddingBottom: 1, paddingInline: 1, paddingInlineEnd: 1, paddingInlineStart: 1, paddingLeft: 1, paddingRight: 1, paddingTop: 1, perspective: 1, right: 1, rowGap: 1, scrollMargin: 1, scrollMarginBlock: 1, scrollMarginBlockEnd: 1, scrollMarginBlockStart: 1, scrollMarginBottom: 1, scrollMarginInline: 1, scrollMarginInlineEnd: 1, scrollMarginInlineStart: 1, scrollMarginLeft: 1, scrollMarginRight: 1, scrollMarginTop: 1, scrollPadding: 1, scrollPaddingBlock: 1, scrollPaddingBlockEnd: 1, scrollPaddingBlockStart: 1, scrollPaddingBottom: 1, scrollPaddingInline: 1, scrollPaddingInlineEnd: 1, scrollPaddingInlineStart: 1, scrollPaddingLeft: 1, scrollPaddingRight: 1, scrollPaddingTop: 1, shapeMargin: 1, textDecoration: 1, textDecorationThickness: 1, textIndent: 1, textUnderlineOffset: 1, top: 1, transitionDelay: 1, transitionDuration: 1, verticalAlign: 1, width: 1, wordSpacing: 1 }, z = (e2) => String.fromCharCode(e2 + (e2 > 25 ? 39 : 97)), W$1 = (e2) => ((e3) => {
    let t2, n2 = "";
    for (t2 = Math.abs(e3); t2 > 52; t2 = t2 / 52 | 0)
      n2 = z(t2 % 52) + n2;
    return z(t2 % 52) + n2;
  })(((e3, t2) => {
    let n2 = t2.length;
    for (; n2; )
      e3 = 33 * e3 ^ t2.charCodeAt(--n2);
    return e3;
  })(5381, JSON.stringify(e2)) >>> 0), j = ["themed", "global", "styled", "onevar", "resonevar", "allvar", "inline"], E$1 = (e2) => {
    if (e2.href && !e2.href.startsWith(location.origin))
      return false;
    try {
      return !!e2.cssRules;
    } catch (e3) {
      return false;
    }
  }, T$2 = (e2) => {
    let t2;
    const n2 = () => {
      const { cssRules: e3 } = t2.sheet;
      return [].map.call(e3, (n3, r3) => {
        const { cssText: i2 } = n3;
        let o2 = "";
        if (i2.startsWith("--sxs"))
          return "";
        if (e3[r3 - 1] && (o2 = e3[r3 - 1].cssText).startsWith("--sxs")) {
          if (!n3.cssRules.length)
            return "";
          for (const e4 in t2.rules)
            if (t2.rules[e4].group === n3)
              return `--sxs{--sxs:${[...t2.rules[e4].cache].join(" ")}}${i2}`;
          return n3.cssRules.length ? `${o2}${i2}` : "";
        }
        return i2;
      }).join("");
    }, r2 = () => {
      if (t2) {
        const { rules: e3, sheet: n3 } = t2;
        if (!n3.deleteRule) {
          for (; 3 === Object(Object(n3.cssRules)[0]).type; )
            n3.cssRules.splice(0, 1);
          n3.cssRules = [];
        }
        for (const t3 in e3)
          delete e3[t3];
      }
      const i2 = Object(e2).styleSheets || [];
      for (const e3 of i2)
        if (E$1(e3)) {
          for (let i3 = 0, o3 = e3.cssRules; o3[i3]; ++i3) {
            const l3 = Object(o3[i3]);
            if (1 !== l3.type)
              continue;
            const s2 = Object(o3[i3 + 1]);
            if (4 !== s2.type)
              continue;
            ++i3;
            const { cssText: a2 } = l3;
            if (!a2.startsWith("--sxs"))
              continue;
            const c2 = a2.slice(14, -3).trim().split(/\s+/), d2 = j[c2[0]];
            d2 && (t2 || (t2 = { sheet: e3, reset: r2, rules: {}, toString: n2 }), t2.rules[d2] = { group: s2, index: i3, cache: new Set(c2) });
          }
          if (t2)
            break;
        }
      if (!t2) {
        const i3 = (e3, t3) => ({ type: t3, cssRules: [], insertRule(e4, t4) {
          this.cssRules.splice(t4, 0, i3(e4, { import: 3, undefined: 1 }[(e4.toLowerCase().match(/^@([a-z]+)/) || [])[1]] || 4));
        }, get cssText() {
          return "@media{}" === e3 ? `@media{${[].map.call(this.cssRules, (e4) => e4.cssText).join("")}}` : e3;
        } });
        t2 = { sheet: e2 ? (e2.head || e2).appendChild(document.createElement("style")).sheet : i3("", "text/css"), rules: {}, reset: r2, toString: n2 };
      }
      const { sheet: o2, rules: l2 } = t2;
      for (let e3 = j.length - 1; e3 >= 0; --e3) {
        const t3 = j[e3];
        if (!l2[t3]) {
          const n3 = j[e3 + 1], r3 = l2[n3] ? l2[n3].index : o2.cssRules.length;
          o2.insertRule("@media{}", r3), o2.insertRule(`--sxs{--sxs:${e3}}`, r3), l2[t3] = { group: o2.cssRules[r3 + 1], index: r3, cache: /* @__PURE__ */ new Set([e3]) };
        }
        v$1(l2[t3]);
      }
    };
    return r2(), t2;
  }, v$1 = (e2) => {
    const t2 = e2.group;
    let n2 = t2.cssRules.length;
    e2.apply = (e3) => {
      try {
        t2.insertRule(e3, n2), ++n2;
      } catch (e4) {
      }
    };
  }, M = Symbol(), w$1 = l$2(), C$1 = (e2, t2) => w$1(e2, () => (...n2) => {
    let r2 = { type: null, composers: /* @__PURE__ */ new Set() };
    for (const t3 of n2)
      if (null != t3)
        if (t3[s$2]) {
          null == r2.type && (r2.type = t3[s$2].type);
          for (const e3 of t3[s$2].composers)
            r2.composers.add(e3);
        } else
          t3.constructor !== Object || t3.$$typeof ? null == r2.type && (r2.type = t3) : r2.composers.add(P(t3, e2));
    return null == r2.type && (r2.type = "span"), r2.composers.size || r2.composers.add(["PJLV", {}, [], [], {}, []]), L$1(e2, r2, t2);
  }), P = ({ variants: e2, compoundVariants: t2, defaultVariants: n2, ...r2 }, i2) => {
    const o2 = `${k$1(i2.prefix)}c-${W$1(r2)}`, l2 = [], s2 = [], a2 = /* @__PURE__ */ Object.create(null), g2 = [];
    for (const e3 in n2)
      a2[e3] = String(n2[e3]);
    if ("object" == typeof e2 && e2)
      for (const t3 in e2) {
        p2 = a2, u2 = t3, d$2.call(p2, u2) || (a2[t3] = "undefined");
        const n3 = e2[t3];
        for (const e3 in n3) {
          const r3 = { [t3]: String(e3) };
          "undefined" === String(e3) && g2.push(t3);
          const i3 = n3[e3], o3 = [r3, i3, !c$2(i3)];
          l2.push(o3);
        }
      }
    var p2, u2;
    if ("object" == typeof t2 && t2)
      for (const e3 of t2) {
        let { css: t3, ...n3 } = e3;
        t3 = "object" == typeof t3 && t3 || {};
        for (const e4 in n3)
          n3[e4] = String(n3[e4]);
        const r3 = [n3, t3, !c$2(t3)];
        s2.push(r3);
      }
    return [o2, r2, l2, s2, a2, g2];
  }, L$1 = (e2, t2, n2) => {
    const [r2, i2, o2, l2] = O$1(t2.composers), c2 = "function" == typeof t2.type || t2.type.$$typeof ? ((e3) => {
      function t3() {
        for (let n3 = 0; n3 < t3[M].length; n3++) {
          const [r3, i3] = t3[M][n3];
          e3.rules[r3].apply(i3);
        }
        return t3[M] = [], null;
      }
      return t3[M] = [], t3.rules = {}, j.forEach((e4) => t3.rules[e4] = { apply: (n3) => t3[M].push([e4, n3]) }), t3;
    })(n2) : null, d2 = (c2 || n2).rules, g2 = `.${r2}${i2.length > 1 ? `:where(.${i2.slice(1).join(".")})` : ""}`, p2 = (s2) => {
      s2 = "object" == typeof s2 && s2 || D$2;
      const { css: a2, ...p3 } = s2, u2 = {};
      for (const e3 in o2)
        if (delete p3[e3], e3 in s2) {
          let t3 = s2[e3];
          "object" == typeof t3 && t3 ? u2[e3] = { "@initial": o2[e3], ...t3 } : (t3 = String(t3), u2[e3] = "undefined" !== t3 || l2.has(e3) ? t3 : o2[e3]);
        } else
          u2[e3] = o2[e3];
      const h2 = /* @__PURE__ */ new Set([...i2]);
      for (const [r3, i3, o3, l3] of t2.composers) {
        n2.rules.styled.cache.has(r3) || (n2.rules.styled.cache.add(r3), x$2(i3, [`.${r3}`], [], e2, (e3) => {
          d2.styled.apply(e3);
        }));
        const t3 = A(o3, u2, e2.media), s3 = A(l3, u2, e2.media, true);
        for (const i4 of t3)
          if (void 0 !== i4)
            for (const [t4, o4, l4] of i4) {
              const i5 = `${r3}-${W$1(o4)}-${t4}`;
              h2.add(i5);
              const s4 = (l4 ? n2.rules.resonevar : n2.rules.onevar).cache, a3 = l4 ? d2.resonevar : d2.onevar;
              s4.has(i5) || (s4.add(i5), x$2(o4, [`.${i5}`], [], e2, (e3) => {
                a3.apply(e3);
              }));
            }
        for (const t4 of s3)
          if (void 0 !== t4)
            for (const [i4, o4] of t4) {
              const t5 = `${r3}-${W$1(o4)}-${i4}`;
              h2.add(t5), n2.rules.allvar.cache.has(t5) || (n2.rules.allvar.cache.add(t5), x$2(o4, [`.${t5}`], [], e2, (e3) => {
                d2.allvar.apply(e3);
              }));
            }
      }
      if ("object" == typeof a2 && a2) {
        const t3 = `${r2}-i${W$1(a2)}-css`;
        h2.add(t3), n2.rules.inline.cache.has(t3) || (n2.rules.inline.cache.add(t3), x$2(a2, [`.${t3}`], [], e2, (e3) => {
          d2.inline.apply(e3);
        }));
      }
      for (const e3 of String(s2.className || "").trim().split(/\s+/))
        e3 && h2.add(e3);
      const f2 = p3.className = [...h2].join(" ");
      return { type: t2.type, className: f2, selector: g2, props: p3, toString: () => f2, deferredInjector: c2 };
    };
    return a$2(p2, { className: r2, selector: g2, [s$2]: t2, toString: () => (n2.rules.styled.cache.has(r2) || p2(), r2) });
  }, O$1 = (e2) => {
    let t2 = "";
    const n2 = [], r2 = {}, i2 = [];
    for (const [o2, , , , l2, s2] of e2) {
      "" === t2 && (t2 = o2), n2.push(o2), i2.push(...s2);
      for (const e3 in l2) {
        const t3 = l2[e3];
        (void 0 === r2[e3] || "undefined" !== t3 || s2.includes(t3)) && (r2[e3] = t3);
      }
    }
    return [t2, n2, r2, new Set(i2)];
  }, A = (e2, t2, n2, r2) => {
    const i2 = [];
    e:
      for (let [o2, l2, s2] of e2) {
        if (s2)
          continue;
        let e3, a2 = 0, c2 = false;
        for (e3 in o2) {
          const r3 = o2[e3];
          let i3 = t2[e3];
          if (i3 !== r3) {
            if ("object" != typeof i3 || !i3)
              continue e;
            {
              let e4, t3, o3 = 0;
              for (const l3 in i3) {
                if (r3 === String(i3[l3])) {
                  if ("@initial" !== l3) {
                    const e5 = l3.slice(1);
                    (t3 = t3 || []).push(e5 in n2 ? n2[e5] : l3.replace(/^@media ?/, "")), c2 = true;
                  }
                  a2 += o3, e4 = true;
                }
                ++o3;
              }
              if (t3 && t3.length && (l2 = { ["@media " + t3.join(", ")]: l2 }), !e4)
                continue e;
            }
          }
        }
        (i2[a2] = i2[a2] || []).push([r2 ? "cv" : `${e3}-${o2[e3]}`, l2, c2]);
      }
    return i2;
  }, D$2 = {}, H$1 = l$2(), N$1 = (e2, t2) => H$1(e2, () => (...n2) => {
    const r2 = () => {
      for (let r3 of n2) {
        r3 = "object" == typeof r3 && r3 || {};
        let n3 = W$1(r3);
        if (!t2.rules.global.cache.has(n3)) {
          if (t2.rules.global.cache.add(n3), "@import" in r3) {
            let e3 = [].indexOf.call(t2.sheet.cssRules, t2.rules.themed.group) - 1;
            for (let n4 of [].concat(r3["@import"]))
              n4 = n4.includes('"') || n4.includes("'") ? n4 : `"${n4}"`, t2.sheet.insertRule(`@import ${n4};`, e3++);
            delete r3["@import"];
          }
          x$2(r3, [], [], e2, (e3) => {
            t2.rules.global.apply(e3);
          });
        }
      }
      return "";
    };
    return a$2(r2, { toString: r2 });
  }), V = l$2(), G = (e2, t2) => V(e2, () => (n2) => {
    const r2 = `${k$1(e2.prefix)}k-${W$1(n2)}`, i2 = () => {
      if (!t2.rules.global.cache.has(r2)) {
        t2.rules.global.cache.add(r2);
        const i3 = [];
        x$2(n2, [], [], e2, (e3) => i3.push(e3));
        const o2 = `@keyframes ${r2}{${i3.join("")}}`;
        t2.rules.global.apply(o2);
      }
      return r2;
    };
    return a$2(i2, { get name() {
      return i2();
    }, toString: i2 });
  }), F = class {
    constructor(e2, t2, n2, r2) {
      this.token = null == e2 ? "" : String(e2), this.value = null == t2 ? "" : String(t2), this.scale = null == n2 ? "" : String(n2), this.prefix = null == r2 ? "" : String(r2);
    }
    get computedValue() {
      return "var(" + this.variable + ")";
    }
    get variable() {
      return "--" + k$1(this.prefix) + k$1(this.scale) + this.token;
    }
    toString() {
      return this.computedValue;
    }
  }, J = l$2(), U = (e2, t2) => J(e2, () => (n2, r2) => {
    r2 = "object" == typeof n2 && n2 || Object(r2);
    const i2 = `.${n2 = (n2 = "string" == typeof n2 ? n2 : "") || `${k$1(e2.prefix)}t-${W$1(r2)}`}`, o2 = {}, l2 = [];
    for (const t3 in r2) {
      o2[t3] = {};
      for (const n3 in r2[t3]) {
        const i3 = `--${k$1(e2.prefix)}${t3}-${n3}`, s3 = y$2(String(r2[t3][n3]), e2.prefix, t3);
        o2[t3][n3] = new F(n3, s3, t3, e2.prefix), l2.push(`${i3}:${s3}`);
      }
    }
    const s2 = () => {
      if (l2.length && !t2.rules.themed.cache.has(n2)) {
        t2.rules.themed.cache.add(n2);
        const i3 = `${r2 === e2.theme ? ":root," : ""}.${n2}{${l2.join(";")}}`;
        t2.rules.themed.apply(i3);
      }
      return n2;
    };
    return { ...o2, get className() {
      return s2();
    }, selector: i2, toString: s2 };
  }), Z = l$2(), X = (e2) => {
    let t2 = false;
    const n2 = Z(e2, (e3) => {
      t2 = true;
      const n3 = "prefix" in (e3 = "object" == typeof e3 && e3 || {}) ? String(e3.prefix) : "", r2 = "object" == typeof e3.media && e3.media || {}, o2 = "object" == typeof e3.root ? e3.root || null : globalThis.document || null, l2 = "object" == typeof e3.theme && e3.theme || {}, s2 = { prefix: n3, media: r2, theme: l2, themeMap: "object" == typeof e3.themeMap && e3.themeMap || { ...i$2 }, utils: "object" == typeof e3.utils && e3.utils || {} }, a2 = T$2(o2), c2 = { css: C$1(s2, a2), globalCss: N$1(s2, a2), keyframes: G(s2, a2), createTheme: U(s2, a2), reset() {
        a2.reset(), c2.theme.toString();
      }, theme: {}, sheet: a2, config: s2, prefix: n3, getCssText: a2.toString, toString: a2.toString };
      return String(c2.theme = c2.createTheme(l2)), c2;
    });
    return t2 || n2.reset(), n2;
  };
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var lodash_mergeExports = {};
  var lodash_merge = {
    get exports() {
      return lodash_mergeExports;
    },
    set exports(v2) {
      lodash_mergeExports = v2;
    }
  };
  (function(module, exports) {
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var HOT_COUNT = 800, HOT_SPAN = 16;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = freeExports && true && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e2) {
      }
    }();
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    function baseTimes(n2, iteratee) {
      var index2 = -1, result = Array(n2);
      while (++index2 < n2) {
        result[index2] = iteratee(index2);
      }
      return result;
    }
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var nativeObjectToString = objectProto.toString;
    var objectCtorString = funcToString.call(Object);
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Buffer = moduleExports ? root.Buffer : void 0, Symbol2 = root.Symbol, Uint8Array = root.Uint8Array, allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0, getPrototype = overArg(Object.getPrototypeOf, Object), objectCreate = Object.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    var defineProperty = function() {
      try {
        var func = getNative(Object, "defineProperty");
        func({}, "", {});
        return func;
      } catch (e2) {
      }
    }();
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0, nativeMax = Math.max, nativeNow = Date.now;
    var Map2 = getNative(root, "Map"), nativeCreate = getNative(Object, "create");
    var baseCreate = function() {
      function object() {
      }
      return function(proto) {
        if (!isObject2(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object();
        object.prototype = void 0;
        return result;
      };
    }();
    function Hash(entries) {
      var index2 = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index2 < length) {
        var entry = entries[index2];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index2 = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index2 < length) {
        var entry = entries[index2];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }
    function listCacheDelete(key) {
      var data = this.__data__, index2 = assocIndexOf(data, key);
      if (index2 < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index2 == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index2, 1);
      }
      --this.size;
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index2 = assocIndexOf(data, key);
      return index2 < 0 ? void 0 : data[index2][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index2 = assocIndexOf(data, key);
      if (index2 < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index2][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index2 = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index2 < length) {
        var entry = entries[index2];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      var result = getMapData(this, key)["delete"](key);
      this.size -= result ? 1 : 0;
      return result;
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      var data = getMapData(this, key), size2 = data.size;
      data.set(key, value);
      this.size += data.size == size2 ? 0 : 1;
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function Stack2(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }
    function stackClear() {
      this.__data__ = new ListCache();
      this.size = 0;
    }
    function stackDelete(key) {
      var data = this.__data__, result = data["delete"](key);
      this.size = data.size;
      return result;
    }
    function stackGet(key) {
      return this.__data__.get(key);
    }
    function stackHas(key) {
      return this.__data__.has(key);
    }
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }
    Stack2.prototype.clear = stackClear;
    Stack2.prototype["delete"] = stackDelete;
    Stack2.prototype.get = stackGet;
    Stack2.prototype.has = stackHas;
    Stack2.prototype.set = stackSet;
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray2(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
        isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    function assignMergeValue(object, key, value) {
      if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseAssignValue(object, key, value) {
      if (key == "__proto__" && defineProperty) {
        defineProperty(object, key, {
          "configurable": true,
          "enumerable": true,
          "value": value,
          "writable": true
        });
      } else {
        object[key] = value;
      }
    }
    var baseFor = createBaseFor();
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }
    function baseIsNative(value) {
      if (!isObject2(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction2(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseIsTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }
    function baseKeysIn(object) {
      if (!isObject2(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object), result = [];
      for (var key in object) {
        if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack || (stack = new Stack2());
        if (isObject2(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        } else {
          var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
          if (newValue === void 0) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
      var isCommon = newValue === void 0;
      if (isCommon) {
        var isArr = isArray2(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray2(objValue)) {
            newValue = objValue;
          } else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          } else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          } else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          } else {
            newValue = [];
          }
        } else if (isPlainObject2(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          } else if (!isObject2(objValue) || isFunction2(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        } else {
          isCommon = false;
        }
      }
      if (isCommon) {
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack["delete"](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }
    function baseRest(func, start2) {
      return setToString(overRest(func, start2, identity), func + "");
    }
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, "toString", {
        "configurable": true,
        "enumerable": false,
        "value": constant(string),
        "writable": true
      });
    };
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
      buffer.copy(result);
      return result;
    }
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }
    function copyArray(source, array) {
      var index2 = -1, length = source.length;
      array || (array = Array(length));
      while (++index2 < length) {
        array[index2] = source[index2];
      }
      return array;
    }
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});
      var index2 = -1, length = props.length;
      while (++index2 < length) {
        var key = props[index2];
        var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
        if (newValue === void 0) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index2 = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
        customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? void 0 : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index2 < length) {
          var source = sources[index2];
          if (source) {
            assigner(object, source, index2, customizer);
          }
        }
        return object;
      });
    }
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index2 = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
        while (length--) {
          var key = props[fromRight ? length : ++index2];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      try {
        value[symToStringTag] = void 0;
        var unmasked = true;
      } catch (e2) {
      }
      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    function initCloneObject(object) {
      return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
    }
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isIterateeCall(value, index2, object) {
      if (!isObject2(object)) {
        return false;
      }
      var type = typeof index2;
      if (type == "number" ? isArrayLike(object) && isIndex(index2, object.length) : type == "string" && index2 in object) {
        return eq(object[index2], value);
      }
      return false;
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    function overRest(func, start2, transform) {
      start2 = nativeMax(start2 === void 0 ? func.length - 1 : start2, 0);
      return function() {
        var args = arguments, index2 = -1, length = nativeMax(args.length - start2, 0), array = Array(length);
        while (++index2 < length) {
          array[index2] = args[start2 + index2];
        }
        index2 = -1;
        var otherArgs = Array(start2 + 1);
        while (++index2 < start2) {
          otherArgs[index2] = args[index2];
        }
        otherArgs[start2] = transform(array);
        return apply(func, this, otherArgs);
      };
    }
    function safeGet(object, key) {
      if (key === "constructor" && typeof object[key] === "function") {
        return;
      }
      if (key == "__proto__") {
        return;
      }
      return object[key];
    }
    var setToString = shortOut(baseSetToString);
    function shortOut(func) {
      var count = 0, lastCalled = 0;
      return function() {
        var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(void 0, arguments);
      };
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e2) {
        }
        try {
          return func + "";
        } catch (e2) {
        }
      }
      return "";
    }
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    var isArguments = baseIsArguments(function() {
      return arguments;
    }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    var isArray2 = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction2(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    var isBuffer = nativeIsBuffer || stubFalse;
    function isFunction2(value) {
      if (!isObject2(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject2(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }
    function isPlainObject2(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    }
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }
    var merge2 = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });
    function constant(value) {
      return function() {
        return value;
      };
    }
    function identity(value) {
      return value;
    }
    function stubFalse() {
      return false;
    }
    module.exports = merge2;
  })(lodash_merge, lodash_mergeExports);
  const merge = lodash_mergeExports;
  function nextFrame(fn) {
    requestAnimationFrame(() => {
      requestAnimationFrame(fn);
    });
  }
  const Transition = (props) => {
    let el;
    let first = true;
    const [s1, set1] = createSignal();
    const [s2, set2] = createSignal();
    const resolved = children(() => props.children);
    const {
      onBeforeEnter,
      onEnter,
      onAfterEnter,
      onBeforeExit,
      onExit,
      onAfterExit
    } = props;
    const classnames = createMemo(() => {
      const name = props.name || "s";
      return {
        enterActiveClass: props.enterActiveClass || name + "-enter-active",
        enterClass: props.enterClass || name + "-enter",
        enterToClass: props.enterToClass || name + "-enter-to",
        exitActiveClass: props.exitActiveClass || name + "-exit-active",
        exitClass: props.exitClass || name + "-exit",
        exitToClass: props.exitToClass || name + "-exit-to"
      };
    });
    function enterTransition(el2, prev) {
      if (!first || props.appear) {
        let endTransition = function(e2) {
          if (el2 && (!e2 || e2.target === el2)) {
            el2.removeEventListener("transitionend", endTransition);
            el2.removeEventListener("animationend", endTransition);
            el2.classList.remove(...enterActiveClasses);
            el2.classList.remove(...enterToClasses);
            batch(() => {
              s1() !== el2 && set1(el2);
              s2() === el2 && set2(void 0);
            });
            onAfterEnter && onAfterEnter(el2);
            if (props.mode === "inout")
              exitTransition(el2, prev);
          }
        };
        const enterClasses = classnames().enterClass.split(" ");
        const enterActiveClasses = classnames().enterActiveClass.split(" ");
        const enterToClasses = classnames().enterToClass.split(" ");
        onBeforeEnter && onBeforeEnter(el2);
        el2.classList.add(...enterClasses);
        el2.classList.add(...enterActiveClasses);
        nextFrame(() => {
          el2.classList.remove(...enterClasses);
          el2.classList.add(...enterToClasses);
          onEnter && onEnter(el2, () => endTransition());
          if (!onEnter || onEnter.length < 2) {
            el2.addEventListener("transitionend", endTransition);
            el2.addEventListener("animationend", endTransition);
          }
        });
      }
      prev && !props.mode ? set2(el2) : set1(el2);
    }
    function exitTransition(el2, prev) {
      const exitClasses = classnames().exitClass.split(" ");
      const exitActiveClasses = classnames().exitActiveClass.split(" ");
      const exitToClasses = classnames().exitToClass.split(" ");
      if (!prev.parentNode)
        return endTransition();
      onBeforeExit && onBeforeExit(prev);
      prev.classList.add(...exitClasses);
      prev.classList.add(...exitActiveClasses);
      nextFrame(() => {
        prev.classList.remove(...exitClasses);
        prev.classList.add(...exitToClasses);
      });
      onExit && onExit(prev, () => endTransition());
      if (!onExit || onExit.length < 2) {
        prev.addEventListener("transitionend", endTransition);
        prev.addEventListener("animationend", endTransition);
      }
      function endTransition(e2) {
        if (!e2 || e2.target === prev) {
          prev.removeEventListener("transitionend", endTransition);
          prev.removeEventListener("animationend", endTransition);
          prev.classList.remove(...exitActiveClasses);
          prev.classList.remove(...exitToClasses);
          s1() === prev && set1(void 0);
          onAfterExit && onAfterExit(prev);
          if (props.mode === "outin")
            enterTransition(el2, prev);
        }
      }
    }
    createComputed((prev) => {
      el = resolved();
      while (typeof el === "function")
        el = el();
      return untrack(() => {
        if (el && el !== prev) {
          if (props.mode !== "outin")
            enterTransition(el, prev);
          else if (first)
            set1(el);
        }
        if (prev && prev !== el && props.mode !== "inout")
          exitTransition(el, prev);
        first = false;
        return el;
      });
    });
    return [s1, s2];
  };
  var scrollLockExports = {};
  var scrollLock = {
    get exports() {
      return scrollLockExports;
    },
    set exports(v2) {
      scrollLockExports = v2;
    }
  };
  (function(module, exports) {
    (function webpackUniversalModuleDefinition(root, factory2) {
      module.exports = factory2();
    })(commonjsGlobal, function() {
      return (
        /******/
        function(modules) {
          var installedModules = {};
          function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) {
              return installedModules[moduleId].exports;
            }
            var module2 = installedModules[moduleId] = {
              /******/
              i: moduleId,
              /******/
              l: false,
              /******/
              exports: {}
              /******/
            };
            modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
            module2.l = true;
            return module2.exports;
          }
          __webpack_require__.m = modules;
          __webpack_require__.c = installedModules;
          __webpack_require__.d = function(exports2, name, getter) {
            if (!__webpack_require__.o(exports2, name)) {
              Object.defineProperty(exports2, name, { enumerable: true, get: getter });
            }
          };
          __webpack_require__.r = function(exports2) {
            if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
              Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
            }
            Object.defineProperty(exports2, "__esModule", { value: true });
          };
          __webpack_require__.t = function(value, mode) {
            if (mode & 1)
              value = __webpack_require__(value);
            if (mode & 8)
              return value;
            if (mode & 4 && typeof value === "object" && value && value.__esModule)
              return value;
            var ns = /* @__PURE__ */ Object.create(null);
            __webpack_require__.r(ns);
            Object.defineProperty(ns, "default", { enumerable: true, value });
            if (mode & 2 && typeof value != "string")
              for (var key in value)
                __webpack_require__.d(ns, key, function(key2) {
                  return value[key2];
                }.bind(null, key));
            return ns;
          };
          __webpack_require__.n = function(module2) {
            var getter = module2 && module2.__esModule ? (
              /******/
              function getDefault() {
                return module2["default"];
              }
            ) : (
              /******/
              function getModuleExports() {
                return module2;
              }
            );
            __webpack_require__.d(getter, "a", getter);
            return getter;
          };
          __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
          };
          __webpack_require__.p = "";
          return __webpack_require__(__webpack_require__.s = 0);
        }([
          /* 0 */
          /***/
          function(module2, __webpack_exports__, __webpack_require__) {
            __webpack_require__.r(__webpack_exports__);
            var argumentAsArray = function argumentAsArray2(argument) {
              return Array.isArray(argument) ? argument : [argument];
            };
            var isElement2 = function isElement3(target) {
              return target instanceof Node;
            };
            var isElementList = function isElementList2(nodeList) {
              return nodeList instanceof NodeList;
            };
            var eachNode = function eachNode2(nodeList, callback) {
              if (nodeList && callback) {
                nodeList = isElementList(nodeList) ? nodeList : [nodeList];
                for (var i2 = 0; i2 < nodeList.length; i2++) {
                  if (callback(nodeList[i2], i2, nodeList.length) === true) {
                    break;
                  }
                }
              }
            };
            var throwError = function throwError2(message) {
              return console.error("[scroll-lock] ".concat(message));
            };
            var arrayAsSelector = function arrayAsSelector2(array) {
              if (Array.isArray(array)) {
                var selector = array.join(", ");
                return selector;
              }
            };
            var nodeListAsArray = function nodeListAsArray2(nodeList) {
              var nodes = [];
              eachNode(nodeList, function(node) {
                return nodes.push(node);
              });
              return nodes;
            };
            var findParentBySelector = function findParentBySelector2($el, selector) {
              var self2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
              var $root = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : document;
              if (self2 && nodeListAsArray($root.querySelectorAll(selector)).indexOf($el) !== -1) {
                return $el;
              }
              while (($el = $el.parentElement) && nodeListAsArray($root.querySelectorAll(selector)).indexOf($el) === -1) {
              }
              return $el;
            };
            var elementHasSelector = function elementHasSelector2($el, selector) {
              var $root = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : document;
              var has = nodeListAsArray($root.querySelectorAll(selector)).indexOf($el) !== -1;
              return has;
            };
            var elementHasOverflowHidden = function elementHasOverflowHidden2($el) {
              if ($el) {
                var computedStyle = getComputedStyle($el);
                var overflowIsHidden = computedStyle.overflow === "hidden";
                return overflowIsHidden;
              }
            };
            var elementScrollTopOnStart = function elementScrollTopOnStart2($el) {
              if ($el) {
                if (elementHasOverflowHidden($el)) {
                  return true;
                }
                var scrollTop = $el.scrollTop;
                return scrollTop <= 0;
              }
            };
            var elementScrollTopOnEnd = function elementScrollTopOnEnd2($el) {
              if ($el) {
                if (elementHasOverflowHidden($el)) {
                  return true;
                }
                var scrollTop = $el.scrollTop;
                var scrollHeight = $el.scrollHeight;
                var scrollTopWithHeight = scrollTop + $el.offsetHeight;
                return scrollTopWithHeight >= scrollHeight;
              }
            };
            var elementScrollLeftOnStart = function elementScrollLeftOnStart2($el) {
              if ($el) {
                if (elementHasOverflowHidden($el)) {
                  return true;
                }
                var scrollLeft = $el.scrollLeft;
                return scrollLeft <= 0;
              }
            };
            var elementScrollLeftOnEnd = function elementScrollLeftOnEnd2($el) {
              if ($el) {
                if (elementHasOverflowHidden($el)) {
                  return true;
                }
                var scrollLeft = $el.scrollLeft;
                var scrollWidth = $el.scrollWidth;
                var scrollLeftWithWidth = scrollLeft + $el.offsetWidth;
                return scrollLeftWithWidth >= scrollWidth;
              }
            };
            var elementIsScrollableField = function elementIsScrollableField2($el) {
              var selector = 'textarea, [contenteditable="true"]';
              return elementHasSelector($el, selector);
            };
            var elementIsInputRange = function elementIsInputRange2($el) {
              var selector = 'input[type="range"]';
              return elementHasSelector($el, selector);
            };
            __webpack_require__.d(__webpack_exports__, "disablePageScroll", function() {
              return disablePageScroll;
            });
            __webpack_require__.d(__webpack_exports__, "enablePageScroll", function() {
              return enablePageScroll;
            });
            __webpack_require__.d(__webpack_exports__, "getScrollState", function() {
              return getScrollState;
            });
            __webpack_require__.d(__webpack_exports__, "clearQueueScrollLocks", function() {
              return clearQueueScrollLocks;
            });
            __webpack_require__.d(__webpack_exports__, "getTargetScrollBarWidth", function() {
              return scroll_lock_getTargetScrollBarWidth;
            });
            __webpack_require__.d(__webpack_exports__, "getCurrentTargetScrollBarWidth", function() {
              return scroll_lock_getCurrentTargetScrollBarWidth;
            });
            __webpack_require__.d(__webpack_exports__, "getPageScrollBarWidth", function() {
              return getPageScrollBarWidth;
            });
            __webpack_require__.d(__webpack_exports__, "getCurrentPageScrollBarWidth", function() {
              return getCurrentPageScrollBarWidth;
            });
            __webpack_require__.d(__webpack_exports__, "addScrollableTarget", function() {
              return scroll_lock_addScrollableTarget;
            });
            __webpack_require__.d(__webpack_exports__, "removeScrollableTarget", function() {
              return scroll_lock_removeScrollableTarget;
            });
            __webpack_require__.d(__webpack_exports__, "addScrollableSelector", function() {
              return scroll_lock_addScrollableSelector;
            });
            __webpack_require__.d(__webpack_exports__, "removeScrollableSelector", function() {
              return scroll_lock_removeScrollableSelector;
            });
            __webpack_require__.d(__webpack_exports__, "addLockableTarget", function() {
              return scroll_lock_addLockableTarget;
            });
            __webpack_require__.d(__webpack_exports__, "addLockableSelector", function() {
              return scroll_lock_addLockableSelector;
            });
            __webpack_require__.d(__webpack_exports__, "setFillGapMethod", function() {
              return scroll_lock_setFillGapMethod;
            });
            __webpack_require__.d(__webpack_exports__, "addFillGapTarget", function() {
              return scroll_lock_addFillGapTarget;
            });
            __webpack_require__.d(__webpack_exports__, "removeFillGapTarget", function() {
              return scroll_lock_removeFillGapTarget;
            });
            __webpack_require__.d(__webpack_exports__, "addFillGapSelector", function() {
              return scroll_lock_addFillGapSelector;
            });
            __webpack_require__.d(__webpack_exports__, "removeFillGapSelector", function() {
              return scroll_lock_removeFillGapSelector;
            });
            __webpack_require__.d(__webpack_exports__, "refillGaps", function() {
              return refillGaps;
            });
            function _objectSpread(target) {
              for (var i2 = 1; i2 < arguments.length; i2++) {
                var source = arguments[i2] != null ? arguments[i2] : {};
                var ownKeys2 = Object.keys(source);
                if (typeof Object.getOwnPropertySymbols === "function") {
                  ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                  }));
                }
                ownKeys2.forEach(function(key) {
                  _defineProperty(target, key, source[key]);
                });
              }
              return target;
            }
            function _defineProperty(obj, key, value) {
              if (key in obj) {
                Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
              } else {
                obj[key] = value;
              }
              return obj;
            }
            var FILL_GAP_AVAILABLE_METHODS = ["padding", "margin", "width", "max-width", "none"];
            var TOUCH_DIRECTION_DETECT_OFFSET = 3;
            var state = {
              scroll: true,
              queue: 0,
              scrollableSelectors: ["[data-scroll-lock-scrollable]"],
              lockableSelectors: ["body", "[data-scroll-lock-lockable]"],
              fillGapSelectors: ["body", "[data-scroll-lock-fill-gap]", "[data-scroll-lock-lockable]"],
              fillGapMethod: FILL_GAP_AVAILABLE_METHODS[0],
              //
              startTouchY: 0,
              startTouchX: 0
            };
            var disablePageScroll = function disablePageScroll2(target) {
              if (state.queue <= 0) {
                state.scroll = false;
                scroll_lock_hideLockableOverflow();
                fillGaps();
              }
              scroll_lock_addScrollableTarget(target);
              state.queue++;
            };
            var enablePageScroll = function enablePageScroll2(target) {
              state.queue > 0 && state.queue--;
              if (state.queue <= 0) {
                state.scroll = true;
                scroll_lock_showLockableOverflow();
                unfillGaps();
              }
              scroll_lock_removeScrollableTarget(target);
            };
            var getScrollState = function getScrollState2() {
              return state.scroll;
            };
            var clearQueueScrollLocks = function clearQueueScrollLocks2() {
              state.queue = 0;
            };
            var scroll_lock_getTargetScrollBarWidth = function getTargetScrollBarWidth($target) {
              var onlyExists = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
              if (isElement2($target)) {
                var currentOverflowYProperty = $target.style.overflowY;
                if (onlyExists) {
                  if (!getScrollState()) {
                    $target.style.overflowY = $target.getAttribute("data-scroll-lock-saved-overflow-y-property");
                  }
                } else {
                  $target.style.overflowY = "scroll";
                }
                var width = scroll_lock_getCurrentTargetScrollBarWidth($target);
                $target.style.overflowY = currentOverflowYProperty;
                return width;
              } else {
                return 0;
              }
            };
            var scroll_lock_getCurrentTargetScrollBarWidth = function getCurrentTargetScrollBarWidth($target) {
              if (isElement2($target)) {
                if ($target === document.body) {
                  var documentWidth = document.documentElement.clientWidth;
                  var windowWidth = window.innerWidth;
                  var currentWidth = windowWidth - documentWidth;
                  return currentWidth;
                } else {
                  var borderLeftWidthCurrentProperty = $target.style.borderLeftWidth;
                  var borderRightWidthCurrentProperty = $target.style.borderRightWidth;
                  $target.style.borderLeftWidth = "0px";
                  $target.style.borderRightWidth = "0px";
                  var _currentWidth = $target.offsetWidth - $target.clientWidth;
                  $target.style.borderLeftWidth = borderLeftWidthCurrentProperty;
                  $target.style.borderRightWidth = borderRightWidthCurrentProperty;
                  return _currentWidth;
                }
              } else {
                return 0;
              }
            };
            var getPageScrollBarWidth = function getPageScrollBarWidth2() {
              var onlyExists = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
              return scroll_lock_getTargetScrollBarWidth(document.body, onlyExists);
            };
            var getCurrentPageScrollBarWidth = function getCurrentPageScrollBarWidth2() {
              return scroll_lock_getCurrentTargetScrollBarWidth(document.body);
            };
            var scroll_lock_addScrollableTarget = function addScrollableTarget(target) {
              if (target) {
                var targets = argumentAsArray(target);
                targets.map(function($targets) {
                  eachNode($targets, function($target) {
                    if (isElement2($target)) {
                      $target.setAttribute("data-scroll-lock-scrollable", "");
                    } else {
                      throwError('"'.concat($target, '" is not a Element.'));
                    }
                  });
                });
              }
            };
            var scroll_lock_removeScrollableTarget = function removeScrollableTarget(target) {
              if (target) {
                var targets = argumentAsArray(target);
                targets.map(function($targets) {
                  eachNode($targets, function($target) {
                    if (isElement2($target)) {
                      $target.removeAttribute("data-scroll-lock-scrollable");
                    } else {
                      throwError('"'.concat($target, '" is not a Element.'));
                    }
                  });
                });
              }
            };
            var scroll_lock_addScrollableSelector = function addScrollableSelector(selector) {
              if (selector) {
                var selectors = argumentAsArray(selector);
                selectors.map(function(selector2) {
                  state.scrollableSelectors.push(selector2);
                });
              }
            };
            var scroll_lock_removeScrollableSelector = function removeScrollableSelector(selector) {
              if (selector) {
                var selectors = argumentAsArray(selector);
                selectors.map(function(selector2) {
                  state.scrollableSelectors = state.scrollableSelectors.filter(function(sSelector) {
                    return sSelector !== selector2;
                  });
                });
              }
            };
            var scroll_lock_addLockableTarget = function addLockableTarget(target) {
              if (target) {
                var targets = argumentAsArray(target);
                targets.map(function($targets) {
                  eachNode($targets, function($target) {
                    if (isElement2($target)) {
                      $target.setAttribute("data-scroll-lock-lockable", "");
                    } else {
                      throwError('"'.concat($target, '" is not a Element.'));
                    }
                  });
                });
                if (!getScrollState()) {
                  scroll_lock_hideLockableOverflow();
                }
              }
            };
            var scroll_lock_addLockableSelector = function addLockableSelector(selector) {
              if (selector) {
                var selectors = argumentAsArray(selector);
                selectors.map(function(selector2) {
                  state.lockableSelectors.push(selector2);
                });
                if (!getScrollState()) {
                  scroll_lock_hideLockableOverflow();
                }
                scroll_lock_addFillGapSelector(selector);
              }
            };
            var scroll_lock_setFillGapMethod = function setFillGapMethod(method) {
              if (method) {
                if (FILL_GAP_AVAILABLE_METHODS.indexOf(method) !== -1) {
                  state.fillGapMethod = method;
                  refillGaps();
                } else {
                  var methods = FILL_GAP_AVAILABLE_METHODS.join(", ");
                  throwError('"'.concat(method, '" method is not available!\nAvailable fill gap methods: ').concat(methods, "."));
                }
              }
            };
            var scroll_lock_addFillGapTarget = function addFillGapTarget(target) {
              if (target) {
                var targets = argumentAsArray(target);
                targets.map(function($targets) {
                  eachNode($targets, function($target) {
                    if (isElement2($target)) {
                      $target.setAttribute("data-scroll-lock-fill-gap", "");
                      if (!state.scroll) {
                        scroll_lock_fillGapTarget($target);
                      }
                    } else {
                      throwError('"'.concat($target, '" is not a Element.'));
                    }
                  });
                });
              }
            };
            var scroll_lock_removeFillGapTarget = function removeFillGapTarget(target) {
              if (target) {
                var targets = argumentAsArray(target);
                targets.map(function($targets) {
                  eachNode($targets, function($target) {
                    if (isElement2($target)) {
                      $target.removeAttribute("data-scroll-lock-fill-gap");
                      if (!state.scroll) {
                        scroll_lock_unfillGapTarget($target);
                      }
                    } else {
                      throwError('"'.concat($target, '" is not a Element.'));
                    }
                  });
                });
              }
            };
            var scroll_lock_addFillGapSelector = function addFillGapSelector(selector) {
              if (selector) {
                var selectors = argumentAsArray(selector);
                selectors.map(function(selector2) {
                  if (state.fillGapSelectors.indexOf(selector2) === -1) {
                    state.fillGapSelectors.push(selector2);
                    if (!state.scroll) {
                      scroll_lock_fillGapSelector(selector2);
                    }
                  }
                });
              }
            };
            var scroll_lock_removeFillGapSelector = function removeFillGapSelector(selector) {
              if (selector) {
                var selectors = argumentAsArray(selector);
                selectors.map(function(selector2) {
                  state.fillGapSelectors = state.fillGapSelectors.filter(function(fSelector) {
                    return fSelector !== selector2;
                  });
                  if (!state.scroll) {
                    scroll_lock_unfillGapSelector(selector2);
                  }
                });
              }
            };
            var refillGaps = function refillGaps2() {
              if (!state.scroll) {
                fillGaps();
              }
            };
            var scroll_lock_hideLockableOverflow = function hideLockableOverflow() {
              var selector = arrayAsSelector(state.lockableSelectors);
              scroll_lock_hideLockableOverflowSelector(selector);
            };
            var scroll_lock_showLockableOverflow = function showLockableOverflow() {
              var selector = arrayAsSelector(state.lockableSelectors);
              scroll_lock_showLockableOverflowSelector(selector);
            };
            var scroll_lock_hideLockableOverflowSelector = function hideLockableOverflowSelector(selector) {
              var $targets = document.querySelectorAll(selector);
              eachNode($targets, function($target) {
                scroll_lock_hideLockableOverflowTarget($target);
              });
            };
            var scroll_lock_showLockableOverflowSelector = function showLockableOverflowSelector(selector) {
              var $targets = document.querySelectorAll(selector);
              eachNode($targets, function($target) {
                scroll_lock_showLockableOverflowTarget($target);
              });
            };
            var scroll_lock_hideLockableOverflowTarget = function hideLockableOverflowTarget($target) {
              if (isElement2($target) && $target.getAttribute("data-scroll-lock-locked") !== "true") {
                var computedStyle = window.getComputedStyle($target);
                $target.setAttribute("data-scroll-lock-saved-overflow-y-property", computedStyle.overflowY);
                $target.setAttribute("data-scroll-lock-saved-inline-overflow-property", $target.style.overflow);
                $target.setAttribute("data-scroll-lock-saved-inline-overflow-y-property", $target.style.overflowY);
                $target.style.overflow = "hidden";
                $target.setAttribute("data-scroll-lock-locked", "true");
              }
            };
            var scroll_lock_showLockableOverflowTarget = function showLockableOverflowTarget($target) {
              if (isElement2($target) && $target.getAttribute("data-scroll-lock-locked") === "true") {
                $target.style.overflow = $target.getAttribute("data-scroll-lock-saved-inline-overflow-property");
                $target.style.overflowY = $target.getAttribute("data-scroll-lock-saved-inline-overflow-y-property");
                $target.removeAttribute("data-scroll-lock-saved-overflow-property");
                $target.removeAttribute("data-scroll-lock-saved-inline-overflow-property");
                $target.removeAttribute("data-scroll-lock-saved-inline-overflow-y-property");
                $target.removeAttribute("data-scroll-lock-locked");
              }
            };
            var fillGaps = function fillGaps2() {
              state.fillGapSelectors.map(function(selector) {
                scroll_lock_fillGapSelector(selector);
              });
            };
            var unfillGaps = function unfillGaps2() {
              state.fillGapSelectors.map(function(selector) {
                scroll_lock_unfillGapSelector(selector);
              });
            };
            var scroll_lock_fillGapSelector = function fillGapSelector(selector) {
              var $targets = document.querySelectorAll(selector);
              var isLockable = state.lockableSelectors.indexOf(selector) !== -1;
              eachNode($targets, function($target) {
                scroll_lock_fillGapTarget($target, isLockable);
              });
            };
            var scroll_lock_fillGapTarget = function fillGapTarget($target) {
              var isLockable = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
              if (isElement2($target)) {
                var scrollBarWidth;
                if ($target.getAttribute("data-scroll-lock-lockable") === "" || isLockable) {
                  scrollBarWidth = scroll_lock_getTargetScrollBarWidth($target, true);
                } else {
                  var $lockableParent = findParentBySelector($target, arrayAsSelector(state.lockableSelectors));
                  scrollBarWidth = scroll_lock_getTargetScrollBarWidth($lockableParent, true);
                }
                if ($target.getAttribute("data-scroll-lock-filled-gap") === "true") {
                  scroll_lock_unfillGapTarget($target);
                }
                var computedStyle = window.getComputedStyle($target);
                $target.setAttribute("data-scroll-lock-filled-gap", "true");
                $target.setAttribute("data-scroll-lock-current-fill-gap-method", state.fillGapMethod);
                if (state.fillGapMethod === "margin") {
                  var currentMargin = parseFloat(computedStyle.marginRight);
                  $target.style.marginRight = "".concat(currentMargin + scrollBarWidth, "px");
                } else if (state.fillGapMethod === "width") {
                  $target.style.width = "calc(100% - ".concat(scrollBarWidth, "px)");
                } else if (state.fillGapMethod === "max-width") {
                  $target.style.maxWidth = "calc(100% - ".concat(scrollBarWidth, "px)");
                } else if (state.fillGapMethod === "padding") {
                  var currentPadding = parseFloat(computedStyle.paddingRight);
                  $target.style.paddingRight = "".concat(currentPadding + scrollBarWidth, "px");
                }
              }
            };
            var scroll_lock_unfillGapSelector = function unfillGapSelector(selector) {
              var $targets = document.querySelectorAll(selector);
              eachNode($targets, function($target) {
                scroll_lock_unfillGapTarget($target);
              });
            };
            var scroll_lock_unfillGapTarget = function unfillGapTarget($target) {
              if (isElement2($target)) {
                if ($target.getAttribute("data-scroll-lock-filled-gap") === "true") {
                  var currentFillGapMethod = $target.getAttribute("data-scroll-lock-current-fill-gap-method");
                  $target.removeAttribute("data-scroll-lock-filled-gap");
                  $target.removeAttribute("data-scroll-lock-current-fill-gap-method");
                  if (currentFillGapMethod === "margin") {
                    $target.style.marginRight = "";
                  } else if (currentFillGapMethod === "width") {
                    $target.style.width = "";
                  } else if (currentFillGapMethod === "max-width") {
                    $target.style.maxWidth = "";
                  } else if (currentFillGapMethod === "padding") {
                    $target.style.paddingRight = "";
                  }
                }
              }
            };
            var onResize = function onResize2(e2) {
              refillGaps();
            };
            var onTouchStart = function onTouchStart2(e2) {
              if (!state.scroll) {
                state.startTouchY = e2.touches[0].clientY;
                state.startTouchX = e2.touches[0].clientX;
              }
            };
            var scroll_lock_onTouchMove = function onTouchMove(e2) {
              if (!state.scroll) {
                var startTouchY = state.startTouchY, startTouchX = state.startTouchX;
                var currentClientY = e2.touches[0].clientY;
                var currentClientX = e2.touches[0].clientX;
                if (e2.touches.length < 2) {
                  var selector = arrayAsSelector(state.scrollableSelectors);
                  var direction = {
                    up: startTouchY < currentClientY,
                    down: startTouchY > currentClientY,
                    left: startTouchX < currentClientX,
                    right: startTouchX > currentClientX
                  };
                  var directionWithOffset = {
                    up: startTouchY + TOUCH_DIRECTION_DETECT_OFFSET < currentClientY,
                    down: startTouchY - TOUCH_DIRECTION_DETECT_OFFSET > currentClientY,
                    left: startTouchX + TOUCH_DIRECTION_DETECT_OFFSET < currentClientX,
                    right: startTouchX - TOUCH_DIRECTION_DETECT_OFFSET > currentClientX
                  };
                  var handle = function handle2($el) {
                    var skip = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                    if ($el) {
                      var parentScrollableEl = findParentBySelector($el, selector, false);
                      if (elementIsInputRange($el)) {
                        return false;
                      }
                      if (skip || elementIsScrollableField($el) && findParentBySelector($el, selector) || elementHasSelector($el, selector)) {
                        var prevent = false;
                        if (elementScrollLeftOnStart($el) && elementScrollLeftOnEnd($el)) {
                          if (direction.up && elementScrollTopOnStart($el) || direction.down && elementScrollTopOnEnd($el)) {
                            prevent = true;
                          }
                        } else if (elementScrollTopOnStart($el) && elementScrollTopOnEnd($el)) {
                          if (direction.left && elementScrollLeftOnStart($el) || direction.right && elementScrollLeftOnEnd($el)) {
                            prevent = true;
                          }
                        } else if (directionWithOffset.up && elementScrollTopOnStart($el) || directionWithOffset.down && elementScrollTopOnEnd($el) || directionWithOffset.left && elementScrollLeftOnStart($el) || directionWithOffset.right && elementScrollLeftOnEnd($el)) {
                          prevent = true;
                        }
                        if (prevent) {
                          if (parentScrollableEl) {
                            handle2(parentScrollableEl, true);
                          } else {
                            if (e2.cancelable) {
                              e2.preventDefault();
                            }
                          }
                        }
                      } else {
                        handle2(parentScrollableEl);
                      }
                    } else {
                      if (e2.cancelable) {
                        e2.preventDefault();
                      }
                    }
                  };
                  handle(e2.target);
                }
              }
            };
            var onTouchEnd = function onTouchEnd2(e2) {
              if (!state.scroll) {
                state.startTouchY = 0;
                state.startTouchX = 0;
              }
            };
            if (typeof window !== "undefined") {
              window.addEventListener("resize", onResize);
            }
            if (typeof document !== "undefined") {
              document.addEventListener("touchstart", onTouchStart);
              document.addEventListener("touchmove", scroll_lock_onTouchMove, {
                passive: false
              });
              document.addEventListener("touchend", onTouchEnd);
            }
            var deprecatedMethods = {
              hide: function hide(target) {
                throwError('"hide" is deprecated! Use "disablePageScroll" instead. \n https://github.com/FL3NKEY/scroll-lock#disablepagescrollscrollabletarget');
                disablePageScroll(target);
              },
              show: function show(target) {
                throwError('"show" is deprecated! Use "enablePageScroll" instead. \n https://github.com/FL3NKEY/scroll-lock#enablepagescrollscrollabletarget');
                enablePageScroll(target);
              },
              toggle: function toggle(target) {
                throwError('"toggle" is deprecated! Do not use it.');
                if (getScrollState()) {
                  disablePageScroll();
                } else {
                  enablePageScroll(target);
                }
              },
              getState: function getState() {
                throwError('"getState" is deprecated! Use "getScrollState" instead. \n https://github.com/FL3NKEY/scroll-lock#getscrollstate');
                return getScrollState();
              },
              getWidth: function getWidth() {
                throwError('"getWidth" is deprecated! Use "getPageScrollBarWidth" instead. \n https://github.com/FL3NKEY/scroll-lock#getpagescrollbarwidth');
                return getPageScrollBarWidth();
              },
              getCurrentWidth: function getCurrentWidth() {
                throwError('"getCurrentWidth" is deprecated! Use "getCurrentPageScrollBarWidth" instead. \n https://github.com/FL3NKEY/scroll-lock#getcurrentpagescrollbarwidth');
                return getCurrentPageScrollBarWidth();
              },
              setScrollableTargets: function setScrollableTargets(target) {
                throwError('"setScrollableTargets" is deprecated! Use "addScrollableTarget" instead. \n https://github.com/FL3NKEY/scroll-lock#addscrollabletargetscrollabletarget');
                scroll_lock_addScrollableTarget(target);
              },
              setFillGapSelectors: function setFillGapSelectors(selector) {
                throwError('"setFillGapSelectors" is deprecated! Use "addFillGapSelector" instead. \n https://github.com/FL3NKEY/scroll-lock#addfillgapselectorfillgapselector');
                scroll_lock_addFillGapSelector(selector);
              },
              setFillGapTargets: function setFillGapTargets(target) {
                throwError('"setFillGapTargets" is deprecated! Use "addFillGapTarget" instead. \n https://github.com/FL3NKEY/scroll-lock#addfillgaptargetfillgaptarget');
                scroll_lock_addFillGapTarget(target);
              },
              clearQueue: function clearQueue() {
                throwError('"clearQueue" is deprecated! Use "clearQueueScrollLocks" instead. \n https://github.com/FL3NKEY/scroll-lock#clearqueuescrolllocks');
                clearQueueScrollLocks();
              }
            };
            var scrollLock2 = _objectSpread({
              disablePageScroll,
              enablePageScroll,
              getScrollState,
              clearQueueScrollLocks,
              getTargetScrollBarWidth: scroll_lock_getTargetScrollBarWidth,
              getCurrentTargetScrollBarWidth: scroll_lock_getCurrentTargetScrollBarWidth,
              getPageScrollBarWidth,
              getCurrentPageScrollBarWidth,
              addScrollableSelector: scroll_lock_addScrollableSelector,
              removeScrollableSelector: scroll_lock_removeScrollableSelector,
              addScrollableTarget: scroll_lock_addScrollableTarget,
              removeScrollableTarget: scroll_lock_removeScrollableTarget,
              addLockableSelector: scroll_lock_addLockableSelector,
              addLockableTarget: scroll_lock_addLockableTarget,
              addFillGapSelector: scroll_lock_addFillGapSelector,
              removeFillGapSelector: scroll_lock_removeFillGapSelector,
              addFillGapTarget: scroll_lock_addFillGapTarget,
              removeFillGapTarget: scroll_lock_removeFillGapTarget,
              setFillGapMethod: scroll_lock_setFillGapMethod,
              refillGaps,
              _state: state
            }, deprecatedMethods);
            __webpack_exports__["default"] = scrollLock2;
          }
          /******/
        ])["default"]
      );
    });
  })(scrollLock);
  function t(t2) {
    return t2.split("-")[0];
  }
  function e(t2) {
    return t2.split("-")[1];
  }
  function n$1(e2) {
    return ["top", "bottom"].includes(t(e2)) ? "x" : "y";
  }
  function r$1(t2) {
    return "y" === t2 ? "height" : "width";
  }
  function i$1(i2, o2, a2) {
    let { reference: l2, floating: s2 } = i2;
    const c2 = l2.x + l2.width / 2 - s2.width / 2, f2 = l2.y + l2.height / 2 - s2.height / 2, u2 = n$1(o2), m2 = r$1(u2), g2 = l2[m2] / 2 - s2[m2] / 2, d2 = "x" === u2;
    let p2;
    switch (t(o2)) {
      case "top":
        p2 = { x: c2, y: l2.y - s2.height };
        break;
      case "bottom":
        p2 = { x: c2, y: l2.y + l2.height };
        break;
      case "right":
        p2 = { x: l2.x + l2.width, y: f2 };
        break;
      case "left":
        p2 = { x: l2.x - s2.width, y: f2 };
        break;
      default:
        p2 = { x: l2.x, y: l2.y };
    }
    switch (e(o2)) {
      case "start":
        p2[u2] -= g2 * (a2 && d2 ? -1 : 1);
        break;
      case "end":
        p2[u2] += g2 * (a2 && d2 ? -1 : 1);
    }
    return p2;
  }
  const o$1 = async (t2, e2, n2) => {
    const { placement: r2 = "bottom", strategy: o2 = "absolute", middleware: a2 = [], platform: l2 } = n2, s2 = await (null == l2.isRTL ? void 0 : l2.isRTL(e2));
    let c2 = await l2.getElementRects({ reference: t2, floating: e2, strategy: o2 }), { x: f2, y: u2 } = i$1(c2, r2, s2), m2 = r2, g2 = {};
    for (let n3 = 0; n3 < a2.length; n3++) {
      const { name: d2, fn: p2 } = a2[n3], { x: h2, y: y2, data: x2, reset: w2 } = await p2({ x: f2, y: u2, initialPlacement: r2, placement: m2, strategy: o2, middlewareData: g2, rects: c2, platform: l2, elements: { reference: t2, floating: e2 } });
      f2 = null != h2 ? h2 : f2, u2 = null != y2 ? y2 : u2, g2 = { ...g2, [d2]: { ...g2[d2], ...x2 } }, w2 && ("object" == typeof w2 && (w2.placement && (m2 = w2.placement), w2.rects && (c2 = true === w2.rects ? await l2.getElementRects({ reference: t2, floating: e2, strategy: o2 }) : w2.rects), { x: f2, y: u2 } = i$1(c2, m2, s2)), n3 = -1);
    }
    return { x: f2, y: u2, placement: m2, strategy: o2, middlewareData: g2 };
  };
  function a$1(t2) {
    return "number" != typeof t2 ? function(t3) {
      return { top: 0, right: 0, bottom: 0, left: 0, ...t3 };
    }(t2) : { top: t2, right: t2, bottom: t2, left: t2 };
  }
  function l$1(t2) {
    return { ...t2, top: t2.y, left: t2.x, right: t2.x + t2.width, bottom: t2.y + t2.height };
  }
  async function s$1(t2, e2) {
    var n2;
    void 0 === e2 && (e2 = {});
    const { x: r2, y: i2, platform: o2, rects: s2, elements: c2, strategy: f2 } = t2, { boundary: u2 = "clippingAncestors", rootBoundary: m2 = "viewport", elementContext: g2 = "floating", altBoundary: d2 = false, padding: p2 = 0 } = e2, h2 = a$1(p2), y2 = c2[d2 ? "floating" === g2 ? "reference" : "floating" : g2], x2 = l$1(await o2.getClippingRect({ element: null == (n2 = await (null == o2.isElement ? void 0 : o2.isElement(y2))) || n2 ? y2 : y2.contextElement || await (null == o2.getDocumentElement ? void 0 : o2.getDocumentElement(c2.floating)), boundary: u2, rootBoundary: m2, strategy: f2 })), w2 = l$1(o2.convertOffsetParentRelativeRectToViewportRelativeRect ? await o2.convertOffsetParentRelativeRectToViewportRelativeRect({ rect: "floating" === g2 ? { ...s2.floating, x: r2, y: i2 } : s2.reference, offsetParent: await (null == o2.getOffsetParent ? void 0 : o2.getOffsetParent(c2.floating)), strategy: f2 }) : s2[g2]);
    return { top: x2.top - w2.top + h2.top, bottom: w2.bottom - x2.bottom + h2.bottom, left: x2.left - w2.left + h2.left, right: w2.right - x2.right + h2.right };
  }
  const c$1 = Math.min, f$1 = Math.max;
  function u$1(t2, e2, n2) {
    return f$1(t2, c$1(e2, n2));
  }
  const g$1 = { left: "right", right: "left", bottom: "top", top: "bottom" };
  function d$1(t2) {
    return t2.replace(/left|right|bottom|top/g, (t3) => g$1[t3]);
  }
  function p$1(t2, i2, o2) {
    void 0 === o2 && (o2 = false);
    const a2 = e(t2), l2 = n$1(t2), s2 = r$1(l2);
    let c2 = "x" === l2 ? a2 === (o2 ? "end" : "start") ? "right" : "left" : "start" === a2 ? "bottom" : "top";
    return i2.reference[s2] > i2.floating[s2] && (c2 = d$1(c2)), { main: c2, cross: d$1(c2) };
  }
  const h$1 = { start: "end", end: "start" };
  function y$1(t2) {
    return t2.replace(/start|end/g, (t3) => h$1[t3]);
  }
  const x$1 = ["top", "right", "bottom", "left"];
  x$1.reduce((t2, e2) => t2.concat(e2, e2 + "-start", e2 + "-end"), []);
  const b$1 = function(e2) {
    return void 0 === e2 && (e2 = {}), { name: "flip", options: e2, async fn(n2) {
      var r2;
      const { placement: i2, middlewareData: o2, rects: a2, initialPlacement: l2, platform: c2, elements: f2 } = n2, { mainAxis: u2 = true, crossAxis: m2 = true, fallbackPlacements: g2, fallbackStrategy: h2 = "bestFit", flipAlignment: x2 = true, ...w2 } = e2, v2 = t(i2), b2 = g2 || (v2 === l2 || !x2 ? [d$1(l2)] : function(t2) {
        const e3 = d$1(t2);
        return [y$1(t2), e3, y$1(e3)];
      }(l2)), R2 = [l2, ...b2], A2 = await s$1(n2, w2), P2 = [];
      let T2 = (null == (r2 = o2.flip) ? void 0 : r2.overflows) || [];
      if (u2 && P2.push(A2[v2]), m2) {
        const { main: t2, cross: e3 } = p$1(i2, a2, await (null == c2.isRTL ? void 0 : c2.isRTL(f2.floating)));
        P2.push(A2[t2], A2[e3]);
      }
      if (T2 = [...T2, { placement: i2, overflows: P2 }], !P2.every((t2) => t2 <= 0)) {
        var O2, D2;
        const t2 = (null != (O2 = null == (D2 = o2.flip) ? void 0 : D2.index) ? O2 : 0) + 1, e3 = R2[t2];
        if (e3)
          return { data: { index: t2, overflows: T2 }, reset: { placement: e3 } };
        let n3 = "bottom";
        switch (h2) {
          case "bestFit": {
            var L2;
            const t3 = null == (L2 = T2.map((t4) => [t4, t4.overflows.filter((t5) => t5 > 0).reduce((t5, e4) => t5 + e4, 0)]).sort((t4, e4) => t4[1] - e4[1])[0]) ? void 0 : L2[0].placement;
            t3 && (n3 = t3);
            break;
          }
          case "initialPlacement":
            n3 = l2;
        }
        if (i2 !== n3)
          return { reset: { placement: n3 } };
      }
      return {};
    } };
  };
  const T$1 = function(r2) {
    return void 0 === r2 && (r2 = 0), { name: "offset", options: r2, async fn(i2) {
      const { x: o2, y: a2, placement: l2, rects: s2, platform: c2, elements: f2 } = i2, u2 = function(r3, i3, o3, a3) {
        void 0 === a3 && (a3 = false);
        const l3 = t(r3), s3 = e(r3), c3 = "x" === n$1(r3), f3 = ["left", "top"].includes(l3) ? -1 : 1, u3 = a3 && c3 ? -1 : 1, m2 = "function" == typeof o3 ? o3({ ...i3, placement: r3 }) : o3;
        let { mainAxis: g2, crossAxis: d2, alignmentAxis: p2 } = "number" == typeof m2 ? { mainAxis: m2, crossAxis: 0, alignmentAxis: null } : { mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...m2 };
        return s3 && "number" == typeof p2 && (d2 = "end" === s3 ? -1 * p2 : p2), c3 ? { x: d2 * u3, y: g2 * f3 } : { x: g2 * f3, y: d2 * u3 };
      }(l2, s2, r2, await (null == c2.isRTL ? void 0 : c2.isRTL(f2.floating)));
      return { x: o2 + u2.x, y: a2 + u2.y, data: u2 };
    } };
  };
  function O(t2) {
    return "x" === t2 ? "y" : "x";
  }
  const D$1 = function(e2) {
    return void 0 === e2 && (e2 = {}), { name: "shift", options: e2, async fn(r2) {
      const { x: i2, y: o2, placement: a2 } = r2, { mainAxis: l2 = true, crossAxis: c2 = false, limiter: f2 = { fn: (t2) => {
        let { x: e3, y: n2 } = t2;
        return { x: e3, y: n2 };
      } }, ...m2 } = e2, g2 = { x: i2, y: o2 }, d2 = await s$1(r2, m2), p2 = n$1(t(a2)), h2 = O(p2);
      let y2 = g2[p2], x2 = g2[h2];
      if (l2) {
        const t2 = "y" === p2 ? "bottom" : "right";
        y2 = u$1(y2 + d2["y" === p2 ? "top" : "left"], y2, y2 - d2[t2]);
      }
      if (c2) {
        const t2 = "y" === h2 ? "bottom" : "right";
        x2 = u$1(x2 + d2["y" === h2 ? "top" : "left"], x2, x2 - d2[t2]);
      }
      const w2 = f2.fn({ ...r2, [p2]: y2, [h2]: x2 });
      return { ...w2, data: { x: w2.x - i2, y: w2.y - o2 } };
    } };
  }, k = function(n2) {
    return void 0 === n2 && (n2 = {}), { name: "size", options: n2, async fn(r2) {
      const { placement: i2, rects: o2, platform: a2, elements: l2 } = r2, { apply: c2, ...u2 } = n2, m2 = await s$1(r2, u2), g2 = t(i2), d2 = e(i2);
      let p2, h2;
      "top" === g2 || "bottom" === g2 ? (p2 = g2, h2 = d2 === (await (null == a2.isRTL ? void 0 : a2.isRTL(l2.floating)) ? "start" : "end") ? "left" : "right") : (h2 = g2, p2 = "end" === d2 ? "top" : "bottom");
      const y2 = f$1(m2.left, 0), x2 = f$1(m2.right, 0), w2 = f$1(m2.top, 0), v2 = f$1(m2.bottom, 0), b2 = { height: o2.floating.height - (["left", "right"].includes(i2) ? 2 * (0 !== w2 || 0 !== v2 ? w2 + v2 : f$1(m2.top, m2.bottom)) : m2[p2]), width: o2.floating.width - (["top", "bottom"].includes(i2) ? 2 * (0 !== y2 || 0 !== x2 ? y2 + x2 : f$1(m2.left, m2.right)) : m2[h2]) }, R2 = await a2.getDimensions(l2.floating);
      null == c2 || c2({ ...b2, ...o2 });
      const A2 = await a2.getDimensions(l2.floating);
      return R2.width !== A2.width || R2.height !== A2.height ? { reset: { rects: true } } : {};
    } };
  };
  function n(t2) {
    return t2 && t2.document && t2.location && t2.alert && t2.setInterval;
  }
  function o(t2) {
    if (null == t2)
      return window;
    if (!n(t2)) {
      const e2 = t2.ownerDocument;
      return e2 && e2.defaultView || window;
    }
    return t2;
  }
  function i(t2) {
    return o(t2).getComputedStyle(t2);
  }
  function r(t2) {
    return n(t2) ? "" : t2 ? (t2.nodeName || "").toLowerCase() : "";
  }
  function l(t2) {
    return t2 instanceof o(t2).HTMLElement;
  }
  function c(t2) {
    return t2 instanceof o(t2).Element;
  }
  function f(t2) {
    return t2 instanceof o(t2).ShadowRoot || t2 instanceof ShadowRoot;
  }
  function s(t2) {
    const { overflow: e2, overflowX: n2, overflowY: o2 } = i(t2);
    return /auto|scroll|overlay|hidden/.test(e2 + o2 + n2);
  }
  function u(t2) {
    return ["table", "td", "th"].includes(r(t2));
  }
  function d(t2) {
    const e2 = navigator.userAgent.toLowerCase().includes("firefox"), n2 = i(t2);
    return "none" !== n2.transform || "none" !== n2.perspective || "paint" === n2.contain || ["transform", "perspective"].includes(n2.willChange) || e2 && "filter" === n2.willChange || e2 && !!n2.filter && "none" !== n2.filter;
  }
  function h() {
    return !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }
  const a = Math.min, g = Math.max, p = Math.round;
  function m(t2, e2, n2) {
    var i2, r2, f2, s2;
    void 0 === e2 && (e2 = false), void 0 === n2 && (n2 = false);
    const u2 = t2.getBoundingClientRect();
    let d2 = 1, a2 = 1;
    e2 && l(t2) && (d2 = t2.offsetWidth > 0 && p(u2.width) / t2.offsetWidth || 1, a2 = t2.offsetHeight > 0 && p(u2.height) / t2.offsetHeight || 1);
    const g2 = c(t2) ? o(t2) : window, m2 = !h() && n2, w2 = (u2.left + (m2 && null != (i2 = null == (r2 = g2.visualViewport) ? void 0 : r2.offsetLeft) ? i2 : 0)) / d2, v2 = (u2.top + (m2 && null != (f2 = null == (s2 = g2.visualViewport) ? void 0 : s2.offsetTop) ? f2 : 0)) / a2, y2 = u2.width / d2, x2 = u2.height / a2;
    return { width: y2, height: x2, top: v2, right: w2 + y2, bottom: v2 + x2, left: w2, x: w2, y: v2 };
  }
  function w(t2) {
    return (e2 = t2, (e2 instanceof o(e2).Node ? t2.ownerDocument : t2.document) || window.document).documentElement;
    var e2;
  }
  function v(t2) {
    return c(t2) ? { scrollLeft: t2.scrollLeft, scrollTop: t2.scrollTop } : { scrollLeft: t2.pageXOffset, scrollTop: t2.pageYOffset };
  }
  function y(t2) {
    return m(w(t2)).left + v(t2).scrollLeft;
  }
  function x(t2, e2, n2) {
    const o2 = l(e2), i2 = w(e2), c2 = m(t2, o2 && function(t3) {
      const e3 = m(t3);
      return p(e3.width) !== t3.offsetWidth || p(e3.height) !== t3.offsetHeight;
    }(e2), "fixed" === n2);
    let f2 = { scrollLeft: 0, scrollTop: 0 };
    const u2 = { x: 0, y: 0 };
    if (o2 || !o2 && "fixed" !== n2)
      if (("body" !== r(e2) || s(i2)) && (f2 = v(e2)), l(e2)) {
        const t3 = m(e2, true);
        u2.x = t3.x + e2.clientLeft, u2.y = t3.y + e2.clientTop;
      } else
        i2 && (u2.x = y(i2));
    return { x: c2.left + f2.scrollLeft - u2.x, y: c2.top + f2.scrollTop - u2.y, width: c2.width, height: c2.height };
  }
  function L(t2) {
    return "html" === r(t2) ? t2 : t2.assignedSlot || t2.parentNode || (f(t2) ? t2.host : null) || w(t2);
  }
  function b(t2) {
    return l(t2) && "fixed" !== getComputedStyle(t2).position ? t2.offsetParent : null;
  }
  function R(t2) {
    const e2 = o(t2);
    let n2 = b(t2);
    for (; n2 && u(n2) && "static" === getComputedStyle(n2).position; )
      n2 = b(n2);
    return n2 && ("html" === r(n2) || "body" === r(n2) && "static" === getComputedStyle(n2).position && !d(n2)) ? e2 : n2 || function(t3) {
      let e3 = L(t3);
      for (f(e3) && (e3 = e3.host); l(e3) && !["html", "body"].includes(r(e3)); ) {
        if (d(e3))
          return e3;
        e3 = e3.parentNode;
      }
      return null;
    }(t2) || e2;
  }
  function T(t2) {
    if (l(t2))
      return { width: t2.offsetWidth, height: t2.offsetHeight };
    const e2 = m(t2);
    return { width: e2.width, height: e2.height };
  }
  function W(t2) {
    const e2 = L(t2);
    return ["html", "body", "#document"].includes(r(e2)) ? t2.ownerDocument.body : l(e2) && s(e2) ? e2 : W(e2);
  }
  function C(t2, e2) {
    var n2;
    void 0 === e2 && (e2 = []);
    const i2 = W(t2), r2 = i2 === (null == (n2 = t2.ownerDocument) ? void 0 : n2.body), l2 = o(i2), c2 = r2 ? [l2].concat(l2.visualViewport || [], s(i2) ? i2 : []) : i2, f2 = e2.concat(c2);
    return r2 ? f2 : f2.concat(C(c2));
  }
  function E(e2, n2, r2) {
    return "viewport" === n2 ? l$1(function(t2, e3) {
      const n3 = o(t2), i2 = w(t2), r3 = n3.visualViewport;
      let l2 = i2.clientWidth, c2 = i2.clientHeight, f2 = 0, s2 = 0;
      if (r3) {
        l2 = r3.width, c2 = r3.height;
        const t3 = h();
        (t3 || !t3 && "fixed" === e3) && (f2 = r3.offsetLeft, s2 = r3.offsetTop);
      }
      return { width: l2, height: c2, x: f2, y: s2 };
    }(e2, r2)) : c(n2) ? function(t2, e3) {
      const n3 = m(t2, false, "fixed" === e3), o2 = n3.top + t2.clientTop, i2 = n3.left + t2.clientLeft;
      return { top: o2, left: i2, x: i2, y: o2, right: i2 + t2.clientWidth, bottom: o2 + t2.clientHeight, width: t2.clientWidth, height: t2.clientHeight };
    }(n2, r2) : l$1(function(t2) {
      var e3;
      const n3 = w(t2), o2 = v(t2), r3 = null == (e3 = t2.ownerDocument) ? void 0 : e3.body, l2 = g(n3.scrollWidth, n3.clientWidth, r3 ? r3.scrollWidth : 0, r3 ? r3.clientWidth : 0), c2 = g(n3.scrollHeight, n3.clientHeight, r3 ? r3.scrollHeight : 0, r3 ? r3.clientHeight : 0);
      let f2 = -o2.scrollLeft + y(t2);
      const s2 = -o2.scrollTop;
      return "rtl" === i(r3 || n3).direction && (f2 += g(n3.clientWidth, r3 ? r3.clientWidth : 0) - l2), { width: l2, height: c2, x: f2, y: s2 };
    }(w(e2)));
  }
  function H(t2) {
    const e2 = C(t2), n2 = ["absolute", "fixed"].includes(i(t2).position) && l(t2) ? R(t2) : t2;
    return c(n2) ? e2.filter((t3) => c(t3) && function(t4, e3) {
      const n3 = null == e3 || null == e3.getRootNode ? void 0 : e3.getRootNode();
      if (null != t4 && t4.contains(e3))
        return true;
      if (n3 && f(n3)) {
        let n4 = e3;
        do {
          if (n4 && t4 === n4)
            return true;
          n4 = n4.parentNode || n4.host;
        } while (n4);
      }
      return false;
    }(t3, n2) && "body" !== r(t3)) : [];
  }
  const S = { getClippingRect: function(t2) {
    let { element: e2, boundary: n2, rootBoundary: o2, strategy: i2 } = t2;
    const r2 = [..."clippingAncestors" === n2 ? H(e2) : [].concat(n2), o2], l2 = r2[0], c2 = r2.reduce((t3, n3) => {
      const o3 = E(e2, n3, i2);
      return t3.top = g(o3.top, t3.top), t3.right = a(o3.right, t3.right), t3.bottom = a(o3.bottom, t3.bottom), t3.left = g(o3.left, t3.left), t3;
    }, E(e2, l2, i2));
    return { width: c2.right - c2.left, height: c2.bottom - c2.top, x: c2.left, y: c2.top };
  }, convertOffsetParentRelativeRectToViewportRelativeRect: function(t2) {
    let { rect: e2, offsetParent: n2, strategy: o2 } = t2;
    const i2 = l(n2), c2 = w(n2);
    if (n2 === c2)
      return e2;
    let f2 = { scrollLeft: 0, scrollTop: 0 };
    const u2 = { x: 0, y: 0 };
    if ((i2 || !i2 && "fixed" !== o2) && (("body" !== r(n2) || s(c2)) && (f2 = v(n2)), l(n2))) {
      const t3 = m(n2, true);
      u2.x = t3.x + n2.clientLeft, u2.y = t3.y + n2.clientTop;
    }
    return { ...e2, x: e2.x - f2.scrollLeft + u2.x, y: e2.y - f2.scrollTop + u2.y };
  }, isElement: c, getDimensions: T, getOffsetParent: R, getDocumentElement: w, getElementRects: (t2) => {
    let { reference: e2, floating: n2, strategy: o2 } = t2;
    return { reference: x(e2, R(n2), o2), floating: { ...T(n2), x: 0, y: 0 } };
  }, getClientRects: (t2) => Array.from(t2.getClientRects()), isRTL: (t2) => "rtl" === i(t2).direction };
  function D(t2, e2, n2, o2) {
    void 0 === o2 && (o2 = {});
    const { ancestorScroll: i2 = true, ancestorResize: r2 = true, elementResize: l2 = true, animationFrame: f2 = false } = o2;
    let s2 = false;
    const u2 = i2 && !f2, d2 = r2 && !f2, h2 = l2 && !f2, a2 = u2 || d2 ? [...c(t2) ? C(t2) : [], ...C(e2)] : [];
    a2.forEach((t3) => {
      u2 && t3.addEventListener("scroll", n2, { passive: true }), d2 && t3.addEventListener("resize", n2);
    });
    let g2, p2 = null;
    h2 && (p2 = new ResizeObserver(n2), c(t2) && p2.observe(t2), p2.observe(e2));
    let w2 = f2 ? m(t2) : null;
    return f2 && function e3() {
      if (s2)
        return;
      const o3 = m(t2);
      !w2 || o3.x === w2.x && o3.y === w2.y && o3.width === w2.width && o3.height === w2.height || n2();
      w2 = o3, g2 = requestAnimationFrame(e3);
    }(), () => {
      var t3;
      s2 = true, a2.forEach((t4) => {
        u2 && t4.removeEventListener("scroll", n2), d2 && t4.removeEventListener("resize", n2);
      }), null == (t3 = p2) || t3.disconnect(), p2 = null, f2 && cancelAnimationFrame(g2);
    };
  }
  const N = (t2, n2, o2) => o$1(t2, n2, { platform: S, ...o2 });
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a2, b2) => {
    for (var prop in b2 || (b2 = {}))
      if (__hasOwnProp.call(b2, prop))
        __defNormalProp(a2, prop, b2[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b2)) {
        if (__propIsEnum.call(b2, prop))
          __defNormalProp(a2, prop, b2[prop]);
      }
    return a2;
  };
  var __spreadProps = (a2, b2) => __defProps(a2, __getOwnPropDescs(b2));
  function isArray(value) {
    return Array.isArray(value);
  }
  function isObject(value) {
    const type = typeof value;
    return value != null && (type === "object" || type === "function") && !isArray(value);
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  function isString(value) {
    return Object.prototype.toString.call(value) === "[object String]";
  }
  function callHandler(handler, event) {
    if (handler) {
      if (isFunction(handler)) {
        handler(event);
      } else {
        handler[0](handler[1], event);
      }
    }
    return event == null ? void 0 : event.defaultPrevented;
  }
  function chainHandlers(...fns) {
    return function(event) {
      fns.some((fn) => {
        return callHandler(fn, event);
      });
    };
  }
  const hasLocalStorageSupport = () => typeof Storage !== "undefined";
  const COLOR_MODE_STORAGE_KEY = "hope-ui-color-mode";
  const colorModeClassNames = {
    light: "hope-ui-light",
    dark: "hope-ui-dark"
  };
  function getColorModeFromLocalStorage() {
    if (!hasLocalStorageSupport()) {
      return null;
    }
    try {
      return localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }
  function saveColorModeToLocalStorage(value) {
    if (!hasLocalStorageSupport()) {
      return;
    }
    try {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, value);
    } catch (error) {
    }
  }
  function getDefaultColorMode(fallbackValue) {
    const persistedPreference = getColorModeFromLocalStorage();
    if (persistedPreference) {
      return persistedPreference;
    } else if (fallbackValue === "system") {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return isSystemDark ? "dark" : "light";
    } else {
      return fallbackValue;
    }
  }
  function getColorModeClassName(isDark) {
    return isDark ? colorModeClassNames.dark : colorModeClassNames.light;
  }
  function syncBodyColorModeClassName(isDark) {
    const body = document.body;
    body.classList.add(getColorModeClassName(isDark));
    body.classList.remove(isDark ? colorModeClassNames.light : colorModeClassNames.dark);
  }
  const space = {
    px: "1px",
    "0_5": "0.125rem",
    "1": "0.25rem",
    "1_5": "0.375rem",
    "2": "0.5rem",
    "2_5": "0.625rem",
    "3": "0.75rem",
    "3_5": "0.875rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "7": "1.75rem",
    "8": "2rem",
    "9": "2.25rem",
    "10": "2.5rem",
    "12": "3rem",
    "14": "3.5rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem",
    "28": "7rem",
    "32": "8rem",
    "36": "9rem",
    "40": "10rem",
    "44": "11rem",
    "48": "12rem",
    "52": "13rem",
    "56": "14rem",
    "60": "15rem",
    "64": "16rem",
    "72": "18rem",
    "80": "20rem",
    "96": "24rem"
  };
  const sizes = __spreadProps(__spreadValues({}, space), {
    prose: "65ch",
    max: "max-content",
    min: "min-content",
    full: "100%",
    screenW: "100vw",
    screenH: "100vh",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem",
    "8xl": "90rem",
    containerSm: "640px",
    containerMd: "768px",
    containerLg: "1024px",
    containerXl: "1280px",
    container2xl: "1536px"
  });
  const baseMedia = {
    sm: `(min-width: ${sizes.containerSm})`,
    md: `(min-width: ${sizes.containerMd})`,
    lg: `(min-width: ${sizes.containerLg})`,
    xl: `(min-width: ${sizes.containerXl})`,
    "2xl": `(min-width: ${sizes.container2xl})`,
    "reduce-motion": "(prefers-reduced-motion: reduce)",
    light: "(prefers-color-scheme: light)",
    dark: "(prefers-color-scheme: dark)"
  };
  const background = {
    bg: (value) => ({ background: value }),
    bgColor: (value) => ({ backgroundColor: value })
  };
  const border = {
    borderX: (value) => ({
      borderLeft: value,
      borderRight: value
    }),
    borderY: (value) => ({
      borderTop: value,
      borderBottom: value
    })
  };
  const display = {
    d: (value) => ({ display: value })
  };
  const margin = {
    m: (value) => ({ margin: value }),
    mt: (value) => ({ marginTop: value }),
    mr: (value) => ({ marginRight: value }),
    marginStart: (value) => ({ marginInlineStart: value }),
    ms: (value) => ({ marginInlineStart: value }),
    mb: (value) => ({ marginBottom: value }),
    ml: (value) => ({ marginLeft: value }),
    marginEnd: (value) => ({ marginInlineEnd: value }),
    me: (value) => ({ marginInlineEnd: value }),
    mx: (value) => ({
      marginInlineStart: value,
      marginInlineEnd: value
    }),
    my: (value) => ({ marginTop: value, marginBottom: value }),
    spaceX: (value) => ({
      "& > * + *": {
        marginLeft: value
      }
    }),
    spaceY: (value) => ({
      "& > * + *": {
        marginTop: value
      }
    })
  };
  const padding = {
    p: (value) => ({ padding: value }),
    pt: (value) => ({ paddingTop: value }),
    pr: (value) => ({ paddingRight: value }),
    paddingStart: (value) => ({ paddingInlineStart: value }),
    ps: (value) => ({ paddingInlineStart: value }),
    pb: (value) => ({ paddingBottom: value }),
    pl: (value) => ({ paddingLeft: value }),
    pe: (value) => ({ paddingInlineEnd: value }),
    paddingEnd: (value) => ({ paddingInlineEnd: value }),
    px: (value) => ({
      paddingInlineStart: value,
      paddingInlineEnd: value
    }),
    py: (value) => ({ paddingTop: value, paddingBottom: value })
  };
  const position = {
    pos: (value) => ({ position: value })
  };
  function createGroupSelector(...selectors) {
    return selectors.map((item) => `[role=group]${item} &, [data-group]${item} &, .group${item} &`).join(", ");
  }
  function createPeerSelector(...selectors) {
    return selectors.map((item) => `[data-peer]${item} ~ &, .peer${item} ~ &`).join(", ");
  }
  const pseudoSelectors = {
    _hover: (value) => ({
      "&:hover, &[data-hover]": value
    }),
    _active: (value) => ({
      "&:active, &[data-active]": value
    }),
    _focus: (value) => ({
      "&:focus, &[data-focus]": value
    }),
    _highlighted: (value) => ({
      "&[data-highlighted]": value
    }),
    _focusWithin: (value) => ({
      "&:focus-within": value
    }),
    _focusVisible: (value) => ({
      "&:focus-visible": value
    }),
    _disabled: (value) => ({
      "&[disabled], &[aria-disabled=true], &[data-disabled]": value
    }),
    _readOnly: (value) => ({
      "&[aria-readonly=true], &[readonly], &[data-readonly]": value
    }),
    _before: (value) => ({
      "&::before": value
    }),
    _after: (value) => ({
      "&::after": value
    }),
    _empty: (value) => ({
      "&:empty": value
    }),
    _expanded: (value) => ({
      "&[aria-expanded=true], &[data-expanded]": value
    }),
    _checked: (value) => ({
      "&[aria-checked=true], &[data-checked]": value
    }),
    _grabbed: (value) => ({
      "&[aria-grabbed=true], &[data-grabbed]": value
    }),
    _pressed: (value) => ({
      "&[aria-pressed=true], &[data-pressed]": value
    }),
    _invalid: (value) => ({
      "&[aria-invalid=true], &[data-invalid]": value
    }),
    _valid: (value) => ({
      "&[data-valid], &[data-state=valid]": value
    }),
    _loading: (value) => ({
      "&[data-loading], &[aria-busy=true]": value
    }),
    _selected: (value) => ({
      "&[aria-selected=true], &[data-selected]": value
    }),
    _hidden: (value) => ({
      "&[hidden], &[data-hidden]": value
    }),
    _even: (value) => ({
      "&:nth-of-type(even)": value
    }),
    _odd: (value) => ({
      "&:nth-of-type(odd)": value
    }),
    _first: (value) => ({
      "&:first-of-type": value
    }),
    _last: (value) => ({
      "&:last-of-type": value
    }),
    _notFirst: (value) => ({
      "&:not(:first-of-type)": value
    }),
    _notLast: (value) => ({
      "&:not(:last-of-type)": value
    }),
    _visited: (value) => ({
      "&:visited": value
    }),
    _activeLink: (value) => ({
      "&[aria-current=page]": value
    }),
    _activeStep: (value) => ({
      "&[aria-current=step]": value
    }),
    _indeterminate: (value) => ({
      "&:indeterminate, &[aria-checked=mixed], &[data-indeterminate]": value
    }),
    _groupHover: (value) => ({
      [createGroupSelector(":hover", "[data-hover]")]: value
    }),
    _peerHover: (value) => ({
      [createPeerSelector(":hover", "[data-hover]")]: value
    }),
    _groupFocus: (value) => ({
      [createGroupSelector(":focus", "[data-focus]")]: value
    }),
    _peerFocus: (value) => ({
      [createPeerSelector(":focus", "[data-focus]")]: value
    }),
    _groupFocusVisible: (value) => ({
      [createGroupSelector(":focus-visible")]: value
    }),
    _peerFocusVisible: (value) => ({
      [createPeerSelector(":focus-visible")]: value
    }),
    _groupActive: (value) => ({
      [createGroupSelector(":active", "[data-active]")]: value
    }),
    _peerActive: (value) => ({
      [createPeerSelector(":active", "[data-active]")]: value
    }),
    _groupSelected: (value) => ({
      [createGroupSelector("[aria-selected=true]", "[data-selected]")]: value
    }),
    _peerSelected: (value) => ({
      [createPeerSelector("[aria-selected=true]", "[data-selected]")]: value
    }),
    _groupDisabled: (value) => ({
      [createGroupSelector(":disabled", "[data-disabled]")]: value
    }),
    _peerDisabled: (value) => ({
      [createPeerSelector(":disabled", "[data-disabled]")]: value
    }),
    _groupInvalid: (value) => ({
      [createGroupSelector(":invalid", "[data-invalid]")]: value
    }),
    _peerInvalid: (value) => ({
      [createPeerSelector(":invalid", "[data-invalid]")]: value
    }),
    _groupChecked: (value) => ({
      [createGroupSelector(":checked", "[data-checked]")]: value
    }),
    _peerChecked: (value) => ({
      [createPeerSelector(":checked", "[data-checked]")]: value
    }),
    _groupFocusWithin: (value) => ({
      [createGroupSelector(":focus-within")]: value
    }),
    _peerFocusWithin: (value) => ({
      [createPeerSelector(":focus-within")]: value
    }),
    _peerPlaceholderShown: (value) => ({
      [createPeerSelector(":placeholder-shown")]: value
    }),
    _placeholder: (value) => ({
      "&::placeholder": value
    }),
    _placeholderShown: (value) => ({
      "&:placeholder-shown": value
    }),
    _fullScreen: (value) => ({
      "&:fullscreen": value
    }),
    _selection: (value) => ({
      "&::selection": value
    }),
    _mediaDark: (value) => ({
      "@media (prefers-color-scheme: dark)": value
    }),
    _mediaReduceMotion: (value) => ({
      "@media (prefers-reduced-motion: reduce)": value
    }),
    _dark: (value) => ({
      ".hope-ui-dark &": value
    }),
    _light: (value) => ({
      ".hope-ui-light &": value
    })
  };
  const radii$1 = {
    borderTopRadius: (value) => ({
      borderTopLeftRadius: value,
      borderTopRightRadius: value
    }),
    borderRightRadius: (value) => ({
      borderTopRightRadius: value,
      borderBottomRightRadius: value
    }),
    borderStartRadius: (value) => ({
      borderStartStartRadius: value,
      borderEndStartRadius: value
    }),
    borderBottomRadius: (value) => ({
      borderBottomLeftRadius: value,
      borderBottomRightRadius: value
    }),
    borderLeftRadius: (value) => ({
      borderTopLeftRadius: value,
      borderBottomLeftRadius: value
    }),
    borderEndRadius: (value) => ({
      borderStartEndRadius: value,
      borderEndEndRadius: value
    }),
    rounded: (value) => ({
      borderRadius: value
    }),
    roundedTop: (value) => ({
      borderTopLeftRadius: value,
      borderTopRightRadius: value
    }),
    roundedRight: (value) => ({
      borderTopRightRadius: value,
      borderBottomRightRadius: value
    }),
    roundedStart: (value) => ({
      borderStartStartRadius: value,
      borderEndStartRadius: value
    }),
    roundedBottom: (value) => ({
      borderBottomLeftRadius: value,
      borderBottomRightRadius: value
    }),
    roundedLeft: (value) => ({
      borderTopLeftRadius: value,
      borderBottomLeftRadius: value
    }),
    roundedEnd: (value) => ({
      borderStartEndRadius: value,
      borderEndEndRadius: value
    })
  };
  const shadow = {
    shadow: (value) => ({ boxShadow: value })
  };
  const size = {
    w: (value) => ({ width: value }),
    minW: (value) => ({ minWidth: value }),
    maxW: (value) => ({ maxWidth: value }),
    h: (value) => ({ height: value }),
    minH: (value) => ({ minHeight: value }),
    maxH: (value) => ({ maxHeight: value }),
    boxSize: (value) => ({ width: value, height: value })
  };
  const typography = {
    noOfLines: (value) => ({
      overflow: "hidden",
      display: "-webkit-box",
      "-webkit-box-orient": "vertical",
      "-webkit-line-clamp": value
    })
  };
  const utils = __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, background), border), display), position), pseudoSelectors), radii$1), margin), padding), shadow), size), typography);
  const blackAlpha = {
    blackAlpha1: "#00000003",
    blackAlpha2: "#00000007",
    blackAlpha3: "#0000000c",
    blackAlpha4: "#00000012",
    blackAlpha5: "#00000017",
    blackAlpha6: "#0000001d",
    blackAlpha7: "#00000024",
    blackAlpha8: "#00000038",
    blackAlpha9: "#00000070",
    blackAlpha10: "#0000007a",
    blackAlpha11: "#00000090",
    blackAlpha12: "#000000e8"
  };
  const whiteAlpha = {
    whiteAlpha1: "#ffffff00",
    whiteAlpha2: "#ffffff03",
    whiteAlpha3: "#ffffff09",
    whiteAlpha4: "#ffffff0e",
    whiteAlpha5: "#ffffff16",
    whiteAlpha6: "#ffffff20",
    whiteAlpha7: "#ffffff2d",
    whiteAlpha8: "#ffffff3f",
    whiteAlpha9: "#ffffff62",
    whiteAlpha10: "#ffffff72",
    whiteAlpha11: "#ffffff97",
    whiteAlpha12: "#ffffffeb"
  };
  const commonColors = __spreadValues(__spreadValues({}, blackAlpha), whiteAlpha);
  const primary = {
    primary1: "#fafdfe",
    primary2: "#f2fcfd",
    primary3: "#e7f9fb",
    primary4: "#d8f3f6",
    primary5: "#c4eaef",
    primary6: "#aadee6",
    primary7: "#84cdda",
    primary8: "#3db9cf",
    primary9: "#05a2c2",
    primary10: "#0894b3",
    primary11: "#0c7792",
    primary12: "#04313c"
  };
  const accent = {
    accent1: "#fdfcfe",
    accent2: "#fbfaff",
    accent3: "#f5f2ff",
    accent4: "#ede9fe",
    accent5: "#e4defc",
    accent6: "#d7cff9",
    accent7: "#c4b8f3",
    accent8: "#aa99ec",
    accent9: "#6e56cf",
    accent10: "#644fc1",
    accent11: "#5746af",
    accent12: "#20134b"
  };
  const neutral = {
    neutral1: "#fbfcfd",
    neutral2: "#f8f9fa",
    neutral3: "#f1f3f5",
    neutral4: "#eceef0",
    neutral5: "#e6e8eb",
    neutral6: "#dfe3e6",
    neutral7: "#d7dbdf",
    neutral8: "#c1c8cd",
    neutral9: "#889096",
    neutral10: "#7e868c",
    neutral11: "#687076",
    neutral12: "#11181c"
  };
  const success = {
    success1: "#fbfefc",
    success2: "#f2fcf5",
    success3: "#e9f9ee",
    success4: "#ddf3e4",
    success5: "#ccebd7",
    success6: "#b4dfc4",
    success7: "#92ceac",
    success8: "#5bb98c",
    success9: "#30a46c",
    success10: "#299764",
    success11: "#18794e",
    success12: "#153226"
  };
  const info = {
    info1: "#fbfdff",
    info2: "#f5faff",
    info3: "#edf6ff",
    info4: "#e1f0ff",
    info5: "#cee7fe",
    info6: "#b7d9f8",
    info7: "#96c7f2",
    info8: "#5eb0ef",
    info9: "#0091ff",
    info10: "#0081f1",
    info11: "#006adc",
    info12: "#00254d"
  };
  const warning = {
    warning1: "#fefdfb",
    warning2: "#fff9ed",
    warning3: "#fff4d5",
    warning4: "#ffecbc",
    warning5: "#ffe3a2",
    warning6: "#ffd386",
    warning7: "#f3ba63",
    warning8: "#ee9d2b",
    warning9: "#ffb224",
    warning10: "#ffa01c",
    warning11: "#ad5700",
    warning12: "#4e2009"
  };
  const danger = {
    danger1: "#fffcfc",
    danger2: "#fff8f8",
    danger3: "#ffefef",
    danger4: "#ffe5e5",
    danger5: "#fdd8d8",
    danger6: "#f9c6c6",
    danger7: "#f3aeaf",
    danger8: "#eb9091",
    danger9: "#e5484d",
    danger10: "#dc3d43",
    danger11: "#cd2b31",
    danger12: "#381316"
  };
  const semanticColors = {
    loContrast: "white",
    background: "$loContrast",
    focusRing: "#96c7f2",
    closeButtonHoverBackground: "$blackAlpha4",
    closeButtonActiveBackground: "$blackAlpha5",
    progressStripe: "$whiteAlpha6"
  };
  const lightColors = __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, primary), accent), neutral), success), info), warning), danger), semanticColors);
  const primaryDark = {
    primary1: "#07191d",
    primary2: "#061e24",
    primary3: "#072830",
    primary4: "#07303b",
    primary5: "#073844",
    primary6: "#064150",
    primary7: "#045063",
    primary8: "#00647d",
    primary9: "#05a2c2",
    primary10: "#00b1cc",
    primary11: "#00c2d7",
    primary12: "#e1f8fa"
  };
  const accentDark = {
    accent1: "#17151f",
    accent2: "#1c172b",
    accent3: "#251e40",
    accent4: "#2c2250",
    accent5: "#32275f",
    accent6: "#392c72",
    accent7: "#443592",
    accent8: "#5842c3",
    accent9: "#6e56cf",
    accent10: "#7c66dc",
    accent11: "#9e8cfc",
    accent12: "#f1eefe"
  };
  const neutralDark = {
    neutral1: "#151718",
    neutral2: "#1a1d1e",
    neutral3: "#202425",
    neutral4: "#26292b",
    neutral5: "#2b2f31",
    neutral6: "#313538",
    neutral7: "#3a3f42",
    neutral8: "#4c5155",
    neutral9: "#697177",
    neutral10: "#787f85",
    neutral11: "#9ba1a6",
    neutral12: "#ecedee"
  };
  const successDark = {
    success1: "#0d1912",
    success2: "#0c1f17",
    success3: "#0f291e",
    success4: "#113123",
    success5: "#133929",
    success6: "#164430",
    success7: "#1b543a",
    success8: "#236e4a",
    success9: "#30a46c",
    success10: "#3cb179",
    success11: "#4cc38a",
    success12: "#e5fbeb"
  };
  const infoDark = {
    info1: "#0f1720",
    info2: "#0f1b2d",
    info3: "#10243e",
    info4: "#102a4c",
    info5: "#0f3058",
    info6: "#0d3868",
    info7: "#0a4481",
    info8: "#0954a5",
    info9: "#0091ff",
    info10: "#369eff",
    info11: "#52a9ff",
    info12: "#eaf6ff"
  };
  const warningDark = {
    warning1: "#1f1300",
    warning2: "#271700",
    warning3: "#341c00",
    warning4: "#3f2200",
    warning5: "#4a2900",
    warning6: "#573300",
    warning7: "#693f05",
    warning8: "#824e00",
    warning9: "#ffb224",
    warning10: "#ffcb47",
    warning11: "#f1a10d",
    warning12: "#fef3dd"
  };
  const dangerDark = {
    danger1: "#1f1315",
    danger2: "#291415",
    danger3: "#3c181a",
    danger4: "#481a1d",
    danger5: "#541b1f",
    danger6: "#671e22",
    danger7: "#822025",
    danger8: "#aa2429",
    danger9: "#e5484d",
    danger10: "#f2555a",
    danger11: "#ff6369",
    danger12: "#feecee"
  };
  const semanticDarkColors = {
    loContrast: "$neutral1",
    background: "$loContrast",
    focusRing: "#0a4481",
    closeButtonHoverBackground: "$whiteAlpha4",
    closeButtonActiveBackground: "$whiteAlpha5",
    progressStripe: "$blackAlpha6"
  };
  const darkColors = __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, primaryDark), accentDark), neutralDark), successDark), infoDark), warningDark), dangerDark), semanticDarkColors);
  const radii = {
    none: "0",
    xs: "0.125rem",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px"
  };
  const shadows = {
    none: "0 0 #0000",
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.09), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.09), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.09), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.09), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.24)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.06)",
    outline: "0 0 0 3px $colors$focusRing"
  };
  const darkShadows = {
    lg: "rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px"
  };
  const fonts = {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol","Noto Color Emoji"',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  };
  const fontSizes = {
    "2xs": "0.625rem",
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem"
  };
  const fontWeights = {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900
  };
  const lineHeights = {
    normal: "normal",
    none: 1,
    shorter: 1.25,
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    taller: 2,
    "3": ".75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "7": "1.75rem",
    "8": "2rem",
    "9": "2.25rem",
    "10": "2.5rem"
  };
  const letterSpacings = {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em"
  };
  const zIndices = {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    sticky: 1e3,
    banner: 1100,
    overlay: 1200,
    modal: 1300,
    dropdown: 1400,
    popover: 1500,
    tooltip: 1600,
    skipLink: 1700,
    notification: 1800
  };
  const baseThemeTokens = {
    colors: __spreadValues(__spreadValues({}, commonColors), lightColors),
    space,
    sizes,
    fonts,
    fontSizes,
    fontWeights,
    letterSpacings,
    lineHeights,
    radii,
    shadows,
    zIndices
  };
  const baseDarkThemeTokens = {
    colors: darkColors,
    shadows: darkShadows
  };
  const {
    theme: baseTheme,
    css,
    globalCss,
    config,
    createTheme,
    getCssText,
    keyframes
  } = X({
    prefix: "hope",
    themeMap: __spreadProps(__spreadValues({}, i$2), {
      borderWidth: "sizes",
      borderTopWidth: "sizes",
      borderRightWidth: "sizes",
      borderBottomWidth: "sizes",
      borderLeftWidth: "sizes",
      strokeWidth: "sizes"
    }),
    theme: baseThemeTokens,
    media: baseMedia,
    utils
  });
  const modalTransitionName = {
    fade: "hope-modal-fade-transition",
    fadeInBottom: "hope-modal-fade-in-bottom-transition",
    scale: "hope-modal-scale-transition"
  };
  const modalTransitionStyles = globalCss({
    [`.${modalTransitionName.fade}-enter, .${modalTransitionName.fade}-exit-to`]: {
      opacity: 0
    },
    [`.${modalTransitionName.fade}-enter-to, .${modalTransitionName.fade}-exit`]: {
      opacity: 1
    },
    [`.${modalTransitionName.fade}-enter-active`]: {
      transition: "opacity 300ms ease-out"
    },
    [`.${modalTransitionName.fade}-exit-active`]: {
      transition: "opacity 200ms ease-in"
    },
    [`.${modalTransitionName.fadeInBottom}-enter, .${modalTransitionName.fadeInBottom}-exit-to`]: {
      opacity: 0,
      transform: "translateY(16px)"
    },
    [`.${modalTransitionName.fadeInBottom}-enter-to, .${modalTransitionName.fadeInBottom}-exit`]: {
      opacity: 1,
      transform: "translateY(0)"
    },
    [`.${modalTransitionName.fadeInBottom}-enter-active`]: {
      transitionProperty: "opacity, transform",
      transitionDuration: "300ms",
      transitionTimingFunction: "ease-out"
    },
    [`.${modalTransitionName.fadeInBottom}-exit-active`]: {
      transitionProperty: "opacity, transform",
      transitionDuration: "200ms",
      transitionTimingFunction: "ease-in"
    },
    [`.${modalTransitionName.scale}-enter, .${modalTransitionName.scale}-exit-to`]: {
      opacity: 0,
      transform: "scale(0.95)"
    },
    [`.${modalTransitionName.scale}-enter-to, .${modalTransitionName.scale}-exit`]: {
      opacity: 1,
      transform: "scale(1)"
    },
    [`.${modalTransitionName.scale}-enter-active`]: {
      transitionProperty: "opacity, transform",
      transitionDuration: "300ms",
      transitionTimingFunction: "ease-out"
    },
    [`.${modalTransitionName.scale}-exit-active`]: {
      transitionProperty: "opacity, transform",
      transitionDuration: "200ms",
      transitionTimingFunction: "ease-in"
    }
  });
  css({
    zIndex: "$overlay",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "hsl(0 0% 0% / 65%)"
  });
  const baseModalContainerStyles = css({
    zIndex: "$modal",
    position: "fixed",
    top: 0,
    left: 0,
    display: "flex",
    width: "100vw",
    height: "100vh",
    "@supports(height: -webkit-fill-available)": {
      height: "-webkit-fill-available"
    },
    outline: "none",
    "&:focus": {
      outline: "none"
    }
  });
  css(baseModalContainerStyles, {
    justifyContent: "center",
    variants: {
      centered: {
        true: {
          alignItems: "center"
        },
        false: {
          alignItems: "flex-start"
        }
      },
      scrollBehavior: {
        inside: {
          overflow: "hidden"
        },
        outside: {
          overflow: "auto"
        }
      }
    }
  });
  const baseDialogStyles = css({
    zIndex: "$modal",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    outline: "none",
    boxShadow: "$lg",
    backgroundColor: "$loContrast",
    color: "inherit",
    "&:focus": {
      outline: "none"
    }
  });
  css(baseDialogStyles, {
    justifyContent: "center",
    my: "3.75rem",
    borderRadius: "$sm",
    variants: {
      size: {
        xs: {
          maxWidth: "$xs"
        },
        sm: {
          maxWidth: "$sm"
        },
        md: {
          maxWidth: "$md"
        },
        lg: {
          maxWidth: "$lg"
        },
        xl: {
          maxWidth: "$xl"
        },
        "2xl": {
          maxWidth: "$2xl"
        },
        "3xl": {
          maxWidth: "$3xl"
        },
        "4xl": {
          maxWidth: "$4xl"
        },
        "5xl": {
          maxWidth: "$5xl"
        },
        "6xl": {
          maxWidth: "$6xl"
        },
        "7xl": {
          maxWidth: "$7xl"
        },
        "8xl": {
          maxWidth: "$8xl"
        },
        full: {
          maxWidth: "100vw",
          minHeight: "100vh",
          "@supports(min-height: -webkit-fill-available)": {
            minHeight: "-webkit-fill-available"
          },
          my: 0,
          borderRadius: "$none"
        }
      },
      scrollBehavior: {
        inside: {
          maxHeight: "calc(100% - 7.5rem)"
        },
        outside: {
          maxHeight: "none"
        }
      }
    }
  });
  css({
    flex: 0,
    pt: "$5",
    px: "$5",
    pb: "$3",
    fontSize: "$lg",
    fontWeight: "$medium"
  });
  css({
    flex: 1,
    px: "$5",
    py: "$2",
    variants: {
      scrollBehavior: {
        inside: {
          overflow: "auto"
        },
        outside: {
          overflow: void 0
        }
      }
    }
  });
  css({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    pt: "$3",
    px: "$5",
    pb: "$5"
  });
  css({
    position: "absolute",
    top: "$4",
    insetInlineEnd: "$4"
  });
  const drawerTransitionName = {
    fade: "hope-drawer-fade-transition",
    slideInTop: "hope-drawer-slide-in-top-transition",
    slideInRight: "hope-drawer-slide-in-right-transition",
    slideInBottom: "hope-drawer-slide-in-bottom-transition",
    slideInLeft: "hope-drawer-slide-in-left-transition"
  };
  const drawerTransitionStyles = globalCss({
    [`.${drawerTransitionName.fade}-enter, .${drawerTransitionName.fade}-exit-to`]: {
      opacity: 0
    },
    [`.${drawerTransitionName.fade}-enter-to, .${drawerTransitionName.fade}-exit`]: {
      opacity: 1
    },
    [`.${drawerTransitionName.fade}-enter-active, .${drawerTransitionName.fade}-exit-active`]: {
      transition: "opacity 500ms ease-in-out"
    },
    [`.${drawerTransitionName.slideInTop}-enter-active, .${drawerTransitionName.slideInTop}-exit-active,
    .${drawerTransitionName.slideInRight}-enter-active, .${drawerTransitionName.slideInRight}-exit-active,
    .${drawerTransitionName.slideInBottom}-enter-active, .${drawerTransitionName.slideInBottom}-exit-active,
    .${drawerTransitionName.slideInLeft}-enter-active, .${drawerTransitionName.slideInLeft}-exit-active`]: {
      transition: "transform 500ms ease-in-out"
    },
    [`.${drawerTransitionName.slideInTop}-enter, .${drawerTransitionName.slideInTop}-exit-to`]: {
      transform: "translateY(-100%)"
    },
    [`.${drawerTransitionName.slideInTop}-enter-to, .${drawerTransitionName.slideInTop}-exit`]: {
      transform: "translateY(0)"
    },
    [`.${drawerTransitionName.slideInRight}-enter, .${drawerTransitionName.slideInRight}-exit-to`]: {
      transform: "translateX(100%)"
    },
    [`.${drawerTransitionName.slideInRight}-enter-to, .${drawerTransitionName.slideInRight}-exit`]: {
      transform: "translateX(0)"
    },
    [`.${drawerTransitionName.slideInBottom}-enter, .${drawerTransitionName.slideInBottom}-exit-to`]: {
      transform: "translateY(100%)"
    },
    [`.${drawerTransitionName.slideInBottom}-enter-to, .${drawerTransitionName.slideInBottom}-exit`]: {
      transform: "translateY(0)"
    },
    [`.${drawerTransitionName.slideInLeft}-enter, .${drawerTransitionName.slideInLeft}-exit-to`]: {
      transform: "translateX(-100%)"
    },
    [`.${drawerTransitionName.slideInLeft}-enter-to, .${drawerTransitionName.slideInLeft}-exit`]: {
      transform: "translateX(0)"
    }
  });
  css(baseModalContainerStyles, {
    overflow: "hidden",
    variants: {
      placement: {
        top: {
          alignItems: "flex-start",
          justifyContent: "stretch"
        },
        right: {
          alignItems: "stretch",
          justifyContent: "flex-end"
        },
        bottom: {
          alignItems: "flex-end",
          justifyContent: "stretch"
        },
        left: {
          alignItems: "stretch",
          justifyContent: "flex-start"
        }
      }
    }
  });
  css(baseDialogStyles, {
    maxHeight: "100vh",
    variants: {
      size: {
        xs: {
          maxWidth: "$xs"
        },
        sm: {
          maxWidth: "$md"
        },
        md: {
          maxWidth: "$lg"
        },
        lg: {
          maxWidth: "$2xl"
        },
        xl: {
          maxWidth: "$4xl"
        },
        full: {
          maxWidth: "100vw",
          height: "100vh"
        }
      },
      placement: {
        top: {},
        right: {},
        bottom: {},
        left: {}
      },
      fullHeight: {
        true: {
          height: "100vh"
        },
        false: {}
      }
    },
    compoundVariants: [
      { placement: "top", size: "xs", css: { maxWidth: "100vw" } },
      { placement: "top", size: "sm", css: { maxWidth: "100vw" } },
      { placement: "top", size: "md", css: { maxWidth: "100vw" } },
      { placement: "top", size: "lg", css: { maxWidth: "100vw" } },
      { placement: "top", size: "xl", css: { maxWidth: "100vw" } },
      { placement: "bottom", size: "xs", css: { maxWidth: "100vw" } },
      { placement: "bottom", size: "sm", css: { maxWidth: "100vw" } },
      { placement: "bottom", size: "md", css: { maxWidth: "100vw" } },
      { placement: "bottom", size: "lg", css: { maxWidth: "100vw" } },
      { placement: "bottom", size: "xl", css: { maxWidth: "100vw" } }
    ]
  });
  const menuTransitionName = {
    scaleTopLeft: "hope-menu-scale-top-left-transition",
    scaleTopRight: "hope-menu-scale-top-right-transition",
    scaleBottomLeft: "hope-menu-scale-bottom-left-transition",
    scaleBottomRight: "hope-menu-scale-bottom-right-transition"
  };
  function createMenuScaleTransition(name, transformOrigin) {
    return {
      [`.${name}-enter, .${name}-exit-to`]: {
        opacity: 0,
        transform: "scale(0.8)"
      },
      [`.${name}-enter-to, .${name}-exit`]: {
        opacity: 1,
        transform: "scale(1)"
      },
      [`.${name}-enter-active`]: {
        transformOrigin,
        transitionProperty: "opacity, transform",
        transitionDuration: "200ms",
        transitionTimingFunction: "ease-out"
      },
      [`.${name}-exit-active`]: {
        transformOrigin,
        transitionProperty: "opacity, transform",
        transitionDuration: "100ms",
        transitionTimingFunction: "ease-in"
      }
    };
  }
  const menuTransitionStyles = globalCss(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, createMenuScaleTransition(menuTransitionName.scaleTopLeft, "top left")), createMenuScaleTransition(menuTransitionName.scaleTopRight, "top right")), createMenuScaleTransition(menuTransitionName.scaleBottomLeft, "bottom left")), createMenuScaleTransition(menuTransitionName.scaleBottomRight, "bottom right")));
  css({
    appearance: "none",
    display: "inline-flex",
    alignItems: "center",
    outline: "none"
  });
  css({
    zIndex: "$dropdown",
    position: "absolute",
    left: 0,
    top: "100%",
    display: "flex",
    flexDirection: "column",
    minWidth: "$56",
    overflowY: "auto",
    outline: "none",
    margin: 0,
    boxShadow: "$md",
    border: "1px solid $colors$neutral7",
    borderRadius: "$sm",
    backgroundColor: "$loContrast",
    px: 0,
    py: "$1",
    "&:focus": {
      outline: "none"
    }
  });
  css({});
  css({
    display: "flex",
    alignItems: "center",
    mx: "$1",
    py: "$2",
    px: "$3",
    color: "$neutral11",
    fontSize: "$xs",
    fontWeight: "$medium",
    lineHeight: "$4"
  });
  function createColorVariant$1(config2) {
    return {
      color: config2.color,
      [`&[data-active]`]: {
        backgroundColor: config2.bgColorActive
      }
    };
  }
  css({
    position: "relative",
    display: "flex",
    alignItems: "center",
    mx: "$1",
    borderRadius: "$sm",
    py: "$2",
    px: "$3",
    fontSize: "$base",
    fontWeight: "$normal",
    lineHeight: "$6",
    cursor: "pointer",
    userSelect: "none",
    transition: "color 250ms, background-color 250ms",
    "&[data-disabled]": {
      color: "$neutral8",
      cursor: "not-allowed"
    },
    variants: {
      colorScheme: {
        primary: createColorVariant$1({ color: "$primary11", bgColorActive: "$primary3" }),
        accent: createColorVariant$1({ color: "$accent11", bgColorActive: "$accent3" }),
        neutral: createColorVariant$1({ color: "$neutral12", bgColorActive: "$neutral4" }),
        success: createColorVariant$1({ color: "$success11", bgColorActive: "$success3" }),
        info: createColorVariant$1({ color: "$info11", bgColorActive: "$info3" }),
        warning: createColorVariant$1({ color: "$warning11", bgColorActive: "$warning3" }),
        danger: createColorVariant$1({ color: "$danger11", bgColorActive: "$danger3" })
      }
    },
    defaultVariants: {
      colorScheme: "neutral"
    }
  });
  css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  });
  css({
    flexGrow: 1
  });
  css({
    flexShrink: 0,
    color: "$neutral11",
    fontSize: "$sm",
    lineHeight: "$none"
  });
  const spin = keyframes({
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" }
  });
  keyframes({
    from: { opacity: 0 },
    to: { opacity: 1 }
  });
  const notificationTransitionName = {
    slideInTop: "hope-notification-slide-in-top-transition",
    slideInRight: "hope-notification-slide-in-right-transition",
    slideInBottom: "hope-notification-slide-in-bottom-transition",
    slideInLeft: "hope-notification-slide-in-left-transition"
  };
  function createNotificationSlideTransition(config2) {
    return {
      [`.${config2.name}-enter, .${config2.name}-exit-to`]: {
        opacity: 0,
        transform: config2.enterTransform
      },
      [`.${config2.name}-enter-to, .${config2.name}-exit`]: {
        opacity: 1,
        transform: config2.leaveTransform
      },
      [`.${config2.name}-enter-active`]: {
        transitionProperty: "opacity, transform",
        transitionTimingFunction: "cubic-bezier(.51,.3,0,1.21)",
        transitionDuration: "300ms"
      },
      [`.${config2.name}-exit-active`]: {
        transitionProperty: "opacity, transform",
        transitionTimingFunction: "ease-in",
        transitionDuration: "200ms"
      }
    };
  }
  const notificationTransitionStyles = globalCss(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, createNotificationSlideTransition({
    name: notificationTransitionName.slideInTop,
    enterTransform: "translateY(-100%)",
    leaveTransform: "translateY(0)"
  })), createNotificationSlideTransition({
    name: notificationTransitionName.slideInRight,
    enterTransform: "translateX(100%)",
    leaveTransform: "translateX(0)"
  })), createNotificationSlideTransition({
    name: notificationTransitionName.slideInBottom,
    enterTransform: "translateY(100%)",
    leaveTransform: "translateY(0)"
  })), createNotificationSlideTransition({
    name: notificationTransitionName.slideInLeft,
    enterTransform: "translateX(-100%)",
    leaveTransform: "translateX(0)"
  })));
  css({
    position: "fixed",
    zIndex: "$notification",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "$4",
    width: "calc(100% - 32px)",
    maxWidth: "$md",
    variants: {
      placement: {
        "top-start": {
          top: "$4",
          left: "$4"
        },
        top: {
          top: "$4",
          left: "50%",
          transform: "translateX(-50%)"
        },
        "top-end": {
          top: "$4",
          right: "$4"
        },
        "bottom-start": {
          bottom: "$4",
          left: "$4"
        },
        bottom: {
          bottom: "$4",
          left: "50%",
          transform: "translateX(-50%)"
        },
        "bottom-end": {
          bottom: "$4",
          right: "$4"
        }
      }
    },
    defaultVariants: {
      placement: "top-end"
    }
  });
  css({
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "$md",
    borderRadius: "$sm",
    border: "1px solid $colors$neutral5",
    boxShadow: "$lg",
    backgroundColor: "$loContrast",
    padding: "$3",
    fontSize: "$sm",
    lineHeight: "$5",
    variants: {
      status: {
        success: {},
        info: {},
        warning: {},
        danger: {}
      }
    }
  });
  css({
    animation: `1s linear infinite ${spin}`
  });
  css({
    flexShrink: 0,
    variants: {
      status: {
        success: { color: "$success9" },
        info: { color: "$info9" },
        warning: { color: "$warning9" },
        danger: { color: "$danger9" }
      }
    }
  });
  css({
    fontWeight: "$medium"
  });
  css({
    display: "inline-block",
    color: "$neutral11"
  });
  const popoverTransitionName = {
    scale: "hope-popover-scale-transition"
  };
  const popoverTransitionStyles = globalCss({
    [`.${popoverTransitionName.scale}-enter, .${popoverTransitionName.scale}-exit-to`]: {
      opacity: 0,
      transform: "scale(0.95)"
    },
    [`.${popoverTransitionName.scale}-enter-to, .${popoverTransitionName.scale}-exit`]: {
      opacity: 1,
      transform: "scale(1)"
    },
    [`.${popoverTransitionName.scale}-enter-active`]: {
      transitionProperty: "opacity, transform",
      transitionDuration: "300ms",
      transitionTimingFunction: "ease"
    },
    [`.${popoverTransitionName.scale}-exit-active`]: {
      transitionProperty: "opacity, transform",
      transitionDuration: "200ms",
      transitionTimingFunction: "ease-in-out"
    }
  });
  css({
    zIndex: "$popover",
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    maxWidth: "$xs",
    outline: "none",
    boxShadow: "$md",
    border: "1px solid $colors$neutral7",
    borderRadius: "$sm",
    backgroundColor: "$loContrast",
    color: "inherit",
    "&:focus": {
      outline: "none"
    }
  });
  css({
    display: "flex",
    alignItems: "center",
    flex: 0,
    borderColor: "inherit",
    borderBottomWidth: "1px",
    px: "$3",
    py: "$2",
    fontSize: "$base",
    fontWeight: "$medium"
  });
  css({
    flex: 1,
    px: "$3",
    py: "$2"
  });
  css({
    display: "flex",
    alignItems: "center",
    borderColor: "inherit",
    borderTopWidth: "1px",
    px: "$3",
    py: "$2"
  });
  css({
    position: "absolute",
    top: "$2",
    insetInlineEnd: "$2"
  });
  css({
    zIndex: "$popover",
    position: "absolute",
    boxSize: "8px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "inherit",
    backgroundColor: "inherit",
    transform: "rotate(45deg)",
    variants: {
      popoverPlacement: {
        left: {
          borderLeft: 0,
          borderBottom: 0
        },
        top: {
          borderLeft: 0,
          borderTop: 0
        },
        right: {
          borderTop: 0,
          borderRight: 0
        },
        bottom: {
          borderRight: 0,
          borderBottom: 0
        }
      }
    }
  });
  function createInputSizeVariant(config2) {
    return {
      minHeight: config2.minHeight,
      fontSize: config2.fontSize,
      lineHeight: config2.lineHeight
    };
  }
  const inputSizes = {
    xs: createInputSizeVariant({ fontSize: "$xs", lineHeight: "$4", minHeight: "$6" }),
    sm: createInputSizeVariant({ fontSize: "$sm", lineHeight: "$5", minHeight: "$8" }),
    md: createInputSizeVariant({ fontSize: "$base", lineHeight: "$6", minHeight: "$10" }),
    lg: createInputSizeVariant({ fontSize: "$lg", lineHeight: "$7", minHeight: "$12" })
  };
  const commonOutlineAndFilledStyles = {
    "&:disabled": {
      opacity: 0.4,
      cursor: "not-allowed"
    },
    "&:focus": {
      boxShadow: "0 0 0 3px $colors$primary5",
      borderColor: "$primary8"
    },
    "&[aria-invalid=true]": {
      borderColor: "$danger8"
    },
    "&[aria-invalid=true]:focus": {
      boxShadow: "0 0 0 3px $colors$danger5"
    }
  };
  const baseInputResetStyles = css({
    appearance: "none",
    position: "relative",
    width: "100%",
    minWidth: 0,
    outline: "none",
    borderRadius: "$sm",
    backgroundColor: "transparent",
    padding: 0,
    color: "$neutral12",
    fontSize: "$base",
    lineHeight: "$base",
    transition: "color 250ms, border-color 250ms, background-color 250ms, box-shadow 250ms",
    "&[readonly]": {
      boxShadow: "none !important",
      userSelect: "all",
      cursor: "default"
    },
    "&::placeholder": {
      color: "$neutral9",
      opacity: 1
    },
    variants: {
      variant: {
        outline: __spreadValues({
          border: "1px solid $neutral7",
          backgroundColor: "transparent",
          "&:hover": {
            borderColor: "$neutral8"
          }
        }, commonOutlineAndFilledStyles),
        filled: __spreadValues({
          border: "1px solid transparent",
          backgroundColor: "$neutral3",
          "&:hover, &:focus": {
            backgroundColor: "$neutral4"
          }
        }, commonOutlineAndFilledStyles),
        unstyled: {
          border: "1px solid transparent",
          backgroundColor: "transparent"
        }
      },
      size: __spreadValues({}, inputSizes)
    }
  });
  function createVariantAndSizeCompoundVariant(config2) {
    return [
      {
        variant: config2.variant,
        size: config2.size,
        css: { px: config2.paddingX }
      },
      {
        withLeftElement: true,
        variant: config2.variant,
        size: config2.size,
        css: { paddingInlineStart: config2.paddingWithElement }
      },
      {
        withRightElement: true,
        variant: config2.variant,
        size: config2.size,
        css: { paddingInlineEnd: config2.paddingWithElement }
      }
    ];
  }
  css(baseInputResetStyles, {
    variants: {
      withLeftElement: {
        true: {}
      },
      withRightElement: {
        true: {}
      },
      withLeftAddon: {
        true: {
          borderLeftRadius: 0
        }
      },
      withRightAddon: {
        true: {
          borderRightRadius: 0
        }
      }
    },
    compoundVariants: [
      ...createVariantAndSizeCompoundVariant({
        variant: "outline",
        size: "xs",
        paddingX: "$2",
        paddingWithElement: "$6"
      }),
      ...createVariantAndSizeCompoundVariant({
        variant: "outline",
        size: "sm",
        paddingX: "$2_5",
        paddingWithElement: "$8"
      }),
      ...createVariantAndSizeCompoundVariant({
        variant: "outline",
        size: "md",
        paddingX: "$3",
        paddingWithElement: "$10"
      }),
      ...createVariantAndSizeCompoundVariant({
        variant: "outline",
        size: "lg",
        paddingX: "$4",
        paddingWithElement: "$12"
      }),
      ...createVariantAndSizeCompoundVariant({
        variant: "filled",
        size: "xs",
        paddingX: "$2",
        paddingWithElement: "$6"
      }),
      ...createVariantAndSizeCompoundVariant({
        variant: "filled",
        size: "sm",
        paddingX: "$2_5",
        paddingWithElement: "$8"
      }),
      ...createVariantAndSizeCompoundVariant({
        variant: "filled",
        size: "md",
        paddingX: "$3",
        paddingWithElement: "$10"
      }),
      ...createVariantAndSizeCompoundVariant({
        variant: "filled",
        size: "lg",
        paddingX: "$4",
        paddingWithElement: "$12"
      }),
      ...createVariantAndSizeCompoundVariant({
        variant: "unstyled",
        size: "xs",
        paddingX: 0,
        paddingWithElement: "$6"
      }),
      ...createVariantAndSizeCompoundVariant({
        variant: "unstyled",
        size: "sm",
        paddingX: 0,
        paddingWithElement: "$8"
      }),
      ...createVariantAndSizeCompoundVariant({
        variant: "unstyled",
        size: "md",
        paddingX: 0,
        paddingWithElement: "$10"
      }),
      ...createVariantAndSizeCompoundVariant({
        variant: "unstyled",
        size: "lg",
        paddingX: 0,
        paddingWithElement: "$12"
      })
    ]
  });
  css({
    position: "relative",
    display: "flex",
    width: "100%"
  });
  css({
    position: "absolute",
    top: "0",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    variants: {
      placement: {
        left: { insetInlineStart: "0" },
        right: { insetInlineEnd: "0" }
      },
      size: {
        xs: __spreadProps(__spreadValues({}, inputSizes.xs), {
          width: inputSizes.xs.minHeight
        }),
        sm: __spreadProps(__spreadValues({}, inputSizes.sm), {
          width: inputSizes.sm.minHeight
        }),
        md: __spreadProps(__spreadValues({}, inputSizes.md), {
          width: inputSizes.md.minHeight
        }),
        lg: __spreadProps(__spreadValues({}, inputSizes.lg), {
          width: inputSizes.lg.minHeight
        })
      }
    }
  });
  function createInputAddonVariantAndSizeCompoundVariant(config2) {
    return {
      variant: config2.variant,
      size: config2.size,
      css: { px: config2.paddingX }
    };
  }
  css({
    display: "flex",
    alignItems: "center",
    flex: "0 0 auto",
    width: "auto",
    whiteSpace: "nowrap",
    variants: {
      placement: {
        left: {
          marginEnd: "-1px"
        },
        right: {
          marginStart: "-1px"
        }
      },
      variant: {
        outline: {
          borderRadius: "$sm",
          border: "1px solid $neutral7",
          backgroundColor: "$neutral3",
          color: "$neutral12"
        },
        filled: {
          borderRadius: "$sm",
          border: "1px solid transparent",
          backgroundColor: "$neutral3",
          color: "$neutral12"
        },
        unstyled: {
          border: "1px solid transparent",
          backgroundColor: "transparent"
        }
      },
      size: __spreadValues({}, inputSizes)
    },
    compoundVariants: [
      {
        variant: "outline",
        placement: "left",
        css: {
          borderRightRadius: 0,
          borderInlineEndColor: "transparent"
        }
      },
      {
        variant: "outline",
        placement: "right",
        css: {
          borderLeftRadius: 0,
          borderInlineStartColor: "transparent"
        }
      },
      {
        variant: "filled",
        placement: "left",
        css: {
          borderStartEndRadius: 0,
          borderEndEndRadius: 0,
          borderInlineEndColor: "transparent"
        }
      },
      {
        variant: "filled",
        placement: "right",
        css: {
          borderStartStartRadius: 0,
          borderEndStartRadius: 0,
          borderInlineStartColor: "transparent"
        }
      },
      createInputAddonVariantAndSizeCompoundVariant({
        variant: "outline",
        size: "xs",
        paddingX: "$2"
      }),
      createInputAddonVariantAndSizeCompoundVariant({
        variant: "outline",
        size: "sm",
        paddingX: "$2_5"
      }),
      createInputAddonVariantAndSizeCompoundVariant({
        variant: "outline",
        size: "md",
        paddingX: "$3"
      }),
      createInputAddonVariantAndSizeCompoundVariant({
        variant: "outline",
        size: "lg",
        paddingX: "$4"
      }),
      createInputAddonVariantAndSizeCompoundVariant({
        variant: "filled",
        size: "xs",
        paddingX: "$2"
      }),
      createInputAddonVariantAndSizeCompoundVariant({
        variant: "filled",
        size: "sm",
        paddingX: "$2_5"
      }),
      createInputAddonVariantAndSizeCompoundVariant({
        variant: "filled",
        size: "md",
        paddingX: "$3"
      }),
      createInputAddonVariantAndSizeCompoundVariant({
        variant: "filled",
        size: "lg",
        paddingX: "$4"
      }),
      createInputAddonVariantAndSizeCompoundVariant({
        variant: "unstyled",
        size: "xs",
        paddingX: 0
      }),
      createInputAddonVariantAndSizeCompoundVariant({
        variant: "unstyled",
        size: "sm",
        paddingX: 0
      }),
      createInputAddonVariantAndSizeCompoundVariant({
        variant: "unstyled",
        size: "md",
        paddingX: 0
      }),
      createInputAddonVariantAndSizeCompoundVariant({
        variant: "unstyled",
        size: "lg",
        paddingX: 0
      })
    ]
  });
  const selectTransitionName = {
    fadeInTop: "hope-select-fade-in-top-transition"
  };
  const selectTransitionStyles = globalCss({
    [`.${selectTransitionName.fadeInTop}-enter, .${selectTransitionName.fadeInTop}-exit-to`]: {
      opacity: 0,
      transform: "translateY(-16px)"
    },
    [`.${selectTransitionName.fadeInTop}-enter-to, .${selectTransitionName.fadeInTop}-exit`]: {
      opacity: 1,
      transform: "translateY(0)"
    },
    [`.${selectTransitionName.fadeInTop}-enter-active`]: {
      transitionProperty: "opacity, transform",
      transitionDuration: "200ms",
      transitionTimingFunction: "ease-out"
    },
    [`.${selectTransitionName.fadeInTop}-exit-active`]: {
      transitionProperty: "opacity, transform",
      transitionDuration: "100ms",
      transitionTimingFunction: "ease-in"
    }
  });
  function createVariantAndSizeCompoundVariants$1(variant, paddingStart, paddingEnd) {
    return Object.entries({
      xs: {
        start: paddingStart != null ? paddingStart : "$2",
        end: paddingEnd != null ? paddingEnd : "$1"
      },
      sm: {
        start: paddingStart != null ? paddingStart : "$2_5",
        end: paddingEnd != null ? paddingEnd : "$1_5"
      },
      md: {
        start: paddingStart != null ? paddingStart : "$3",
        end: paddingEnd != null ? paddingEnd : "$2"
      },
      lg: {
        start: paddingStart != null ? paddingStart : "$4",
        end: paddingEnd != null ? paddingEnd : "$3"
      }
    }).map(([key, value]) => ({
      variant,
      size: key,
      css: {
        paddingInlineStart: value.start,
        paddingInlineEnd: value.end
      }
    }));
  }
  const selectTriggerStyles = css(baseInputResetStyles, {
    appearance: "none",
    display: "inline-flex",
    alignItems: "center",
    outline: "none",
    cursor: "pointer",
    "&:focus": {
      outline: "none"
    },
    compoundVariants: [
      ...createVariantAndSizeCompoundVariants$1("outline"),
      ...createVariantAndSizeCompoundVariants$1("filled"),
      ...createVariantAndSizeCompoundVariants$1("unstyled", 0, 0)
    ]
  });
  const selectSingleValueStyles = css({
    flexGrow: 1,
    flexShrink: 1,
    textAlign: "start",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  });
  const selectMultiValueStyles = css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    flexGrow: 1,
    flexShrink: 1,
    variants: {
      size: {
        xs: {
          gap: "$0_5",
          py: "$0_5"
        },
        sm: {
          gap: "$1",
          py: "$1"
        },
        md: {
          gap: "$1_5",
          py: "$1_5"
        },
        lg: {
          gap: "$2",
          py: "$2"
        }
      }
    }
  });
  const selectTagStyles = css({
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "$0_5",
    borderRadius: "$sm",
    py: 0,
    pl: "$2",
    lineHeight: "$none",
    variants: {
      variant: {
        subtle: {
          backgroundColor: "$neutral4",
          color: "$neutral12"
        },
        outline: {
          border: "1px solid $colors$neutral7",
          backgroundColor: "$loContrast",
          color: "$neutral12"
        }
      },
      size: {
        xs: {
          height: "$4",
          fontSize: "$2xs"
        },
        sm: {
          height: "$5",
          fontSize: "$xs"
        },
        md: {
          height: "$6",
          fontSize: "$sm"
        },
        lg: {
          height: "$7",
          fontSize: "$base"
        }
      }
    }
  });
  const selectTagCloseButtonStyles = css({
    appearance: "none",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    outline: "none",
    borderRightRadius: "$sm",
    backgroundColor: "transparent",
    px: "$1",
    color: "inherit",
    lineHeight: "$none",
    textDecoration: "none",
    cursor: "pointer",
    userSelect: "none",
    transition: "color 250ms, background-color 250ms, box-shadow 250ms",
    "&:hover": {
      backgroundColor: "$neutral7"
    },
    "&:focus": {
      outline: "none",
      boxShadow: "$outline"
    }
  });
  const selectPlaceholderStyles = css(selectSingleValueStyles, {
    color: "$neutral9",
    opacity: 1
  });
  const selectIconStyles = css({
    flexGrow: 0,
    flexShrink: 0,
    marginInlineStart: "auto",
    color: "$neutral11",
    fontSize: "1.25em",
    pointerEvents: "none",
    transition: "transform 250ms",
    transformOrigin: "center",
    variants: {
      opened: {
        true: {
          transform: "rotate(-180deg)"
        }
      }
    }
  });
  const selectContentStyles = css({
    zIndex: "$dropdown",
    position: "absolute",
    left: 0,
    top: "100%",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    overflow: "hidden",
    margin: 0,
    boxShadow: "$md",
    border: "1px solid $colors$neutral7",
    borderRadius: "$sm",
    backgroundColor: "$loContrast",
    padding: 0
  });
  const selectListboxStyles = css({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    maxHeight: "$60",
    width: "100%",
    overflowY: "auto",
    margin: 0,
    padding: "$1",
    listStyle: "none"
  });
  css({});
  css({
    display: "flex",
    alignItems: "center",
    py: "$2",
    px: "$3",
    color: "$neutral11",
    fontSize: "$xs",
    lineHeight: "$4"
  });
  const selectOptionStyles = css({
    position: "relative",
    display: "flex",
    alignItems: "center",
    borderRadius: "$sm",
    color: "$neutral12",
    fontSize: "$base",
    fontWeight: "$normal",
    lineHeight: "$6",
    cursor: "pointer",
    userSelect: "none",
    "&[data-disabled]": {
      color: "$neutral8",
      cursor: "not-allowed"
    },
    [`&[data-active]`]: {
      backgroundColor: "$neutral4"
    }
  });
  const selectOptionTextStyles = css({
    display: "inline-flex",
    alignItems: "center",
    py: "$2",
    paddingInlineStart: "$3",
    paddingInlineEnd: "$6"
  });
  const selectOptionIndicatorStyles = css({
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    paddingInlineEnd: "$3",
    color: "$primary10",
    pointerEvents: "none"
  });
  const tooltipTransitionName = {
    scale: "hope-tooltip-scale-transition"
  };
  const tooltipTransitionStyles = globalCss({
    [`.${tooltipTransitionName.scale}-enter, .${tooltipTransitionName.scale}-exit-to`]: {
      opacity: 0,
      transform: "scale(0.90)"
    },
    [`.${tooltipTransitionName.scale}-enter-to, .${tooltipTransitionName.scale}-exit`]: {
      opacity: 1,
      transform: "scale(1)"
    },
    [`.${tooltipTransitionName.scale}-enter-active`]: {
      transitionProperty: "opacity, transform",
      transitionDuration: "200ms",
      transitionTimingFunction: "ease"
    },
    [`.${tooltipTransitionName.scale}-exit-active`]: {
      transitionProperty: "opacity, transform",
      transitionDuration: "150ms",
      transitionTimingFunction: "ease-in-out"
    }
  });
  css({
    zIndex: "$tooltip",
    position: "absolute",
    maxWidth: "$96",
    boxShadow: "$md",
    borderRadius: "$sm",
    backgroundColor: "$neutral12",
    px: "$2",
    py: "$1",
    color: "$neutral1",
    fontSize: "$sm",
    fontWeight: "$normal",
    lineHeight: "$4"
  });
  css({
    zIndex: "$tooltip",
    position: "absolute",
    boxSize: "8px",
    backgroundColor: "inherit",
    transform: "rotate(45deg)"
  });
  const globalResetStyles = globalCss({
    "*, ::before, ::after": {
      boxSizing: "border-box",
      borderWidth: "0",
      borderStyle: "solid"
    },
    "*": {
      margin: 0
    },
    "html, body": {
      height: "100%"
    },
    html: {
      fontFamily: "$sans",
      lineHeight: "$base",
      fontSize: "16px"
    },
    body: {
      backgroundColor: "$background",
      color: "$neutral12",
      fontFamily: "inherit",
      lineHeight: "inherit",
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale"
    },
    "h1, h2, h3, h4, h5, h6": {
      fontSize: "inherit",
      fontWeight: "inherit"
    },
    "p, h1, h2, h3, h4, h5, h6": {
      overflowWrap: "break-word"
    },
    "img, picture, video, canvas, svg": {
      display: "block",
      maxWidth: "100%"
    },
    "button, input, textarea, select, optgroup": {
      fontFamily: "inherit",
      fontSize: "100%"
    },
    "button:focus": {
      outline: "5px auto -webkit-focus-ring-color"
    },
    fieldset: {
      margin: 0,
      padding: 0
    },
    "ol, ul": {
      margin: 0,
      padding: 0
    },
    a: {
      backgroundColor: "transparent",
      color: "inherit",
      textDecoration: "inherit"
    }
  });
  function mergeStyleObject(sourceStyleObject, destStyleObject, destResponsiveStyleObject) {
    Object.entries(sourceStyleObject).forEach(([key, value]) => {
      if (isObject(value)) {
        if (key in destResponsiveStyleObject) {
          const atMediaRule = key;
          destResponsiveStyleObject[atMediaRule] = __spreadValues(__spreadValues({}, destResponsiveStyleObject[atMediaRule]), value);
        } else {
          destStyleObject[key] = __spreadValues(__spreadValues({}, destStyleObject[key]), value);
        }
      } else {
        destStyleObject[key] = value;
      }
    });
  }
  function toCssObject(props, baseStyles) {
    const destStyleObject = {};
    const destResponsiveStyleObject = {
      "@sm": {},
      "@md": {},
      "@lg": {},
      "@xl": {},
      "@2xl": {},
      "@reduce-motion": {},
      "@light": {},
      "@dark": {}
    };
    baseStyles == null ? void 0 : baseStyles.forEach((styles2) => styles2 && mergeStyleObject(styles2, destStyleObject, destResponsiveStyleObject));
    Object.entries(props).forEach(([prop, value]) => {
      if (value === null || value === void 0) {
        return;
      }
      if (prop === "css") {
        return;
      }
      if (prop.startsWith("_")) {
        destStyleObject[prop] = value;
      } else if (isObject(value)) {
        Object.keys(value).forEach((key) => {
          if (key === "@initial") {
            destStyleObject[prop] = value[key];
          } else if (key in destResponsiveStyleObject) {
            const atMediaRule = key;
            destResponsiveStyleObject[atMediaRule] = __spreadProps(__spreadValues({}, destResponsiveStyleObject[atMediaRule]), {
              [prop]: value[atMediaRule]
            });
          }
        });
      } else {
        destStyleObject[prop] = value;
      }
    });
    props.css && mergeStyleObject(props.css, destStyleObject, destResponsiveStyleObject);
    return __spreadValues(__spreadValues({}, destStyleObject), destResponsiveStyleObject);
  }
  function extendBaseTheme(type, themeConfig) {
    const isDark = type === "dark";
    const className2 = isDark ? colorModeClassNames.dark : colorModeClassNames.light;
    const finalConfig = isDark ? merge({}, baseDarkThemeTokens, themeConfig) : themeConfig;
    const customTheme = createTheme(className2, finalConfig);
    return merge({}, baseTheme, customTheme);
  }
  const visuallyHiddenStyles = css({
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: "0"
  });
  const HopeContext = createContext();
  function applyGlobalTransitionStyles() {
    drawerTransitionStyles();
    menuTransitionStyles();
    modalTransitionStyles();
    notificationTransitionStyles();
    popoverTransitionStyles();
    selectTransitionStyles();
    tooltipTransitionStyles();
  }
  function HopeProvider(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const defaultProps = {
      enableCssReset: true
    };
    props = mergeProps(defaultProps, props);
    const lightTheme = extendBaseTheme("light", (_b = (_a = props.config) == null ? void 0 : _a.lightTheme) != null ? _b : {});
    const darkTheme = extendBaseTheme("dark", (_d = (_c = props.config) == null ? void 0 : _c.darkTheme) != null ? _d : {});
    const defaultColorMode = getDefaultColorMode((_f = (_e = props.config) == null ? void 0 : _e.initialColorMode) != null ? _f : "light");
    const defaultTheme = defaultColorMode === "dark" ? darkTheme : lightTheme;
    const [colorMode, rawSetColorMode] = createSignal(defaultColorMode);
    const [theme, setTheme] = createSignal(defaultTheme);
    const isDarkMode = () => colorMode() === "dark";
    const setColorMode = (value) => {
      rawSetColorMode(value);
      saveColorModeToLocalStorage(value);
    };
    const toggleColorMode = () => {
      setColorMode(isDarkMode() ? "light" : "dark");
    };
    const context = {
      components: (_h = (_g = props.config) == null ? void 0 : _g.components) != null ? _h : {},
      theme,
      colorMode,
      setColorMode,
      toggleColorMode
    };
    createEffect(() => {
      setTheme(isDarkMode() ? darkTheme : lightTheme);
      syncBodyColorModeClassName(isDarkMode());
    });
    if (props.enableCssReset) {
      globalResetStyles();
    }
    applyGlobalTransitionStyles();
    return createComponent(HopeContext.Provider, {
      value: context,
      get children() {
        return props.children;
      }
    });
  }
  function useStyleConfig() {
    const context = useContext(HopeContext);
    if (!context) {
      throw new Error("[Hope UI]: useStyleConfig must be used within a HopeProvider");
    }
    return context.components;
  }
  function createClassSelector(className2) {
    return `.${className2}`;
  }
  function classNames(...classNames2) {
    return classNames2.filter(Boolean).join(" ");
  }
  const borderPropNames = {
    border: true,
    borderWidth: true,
    borderStyle: true,
    borderColor: true,
    borderTop: true,
    borderTopWidth: true,
    borderTopStyle: true,
    borderTopColor: true,
    borderRight: true,
    borderRightWidth: true,
    borderRightStyle: true,
    borderRightColor: true,
    borderBottom: true,
    borderBottomWidth: true,
    borderBottomStyle: true,
    borderBottomColor: true,
    borderLeft: true,
    borderLeftWidth: true,
    borderLeftStyle: true,
    borderLeftColor: true,
    borderX: true,
    borderY: true
  };
  const colorPropNames = {
    color: true,
    background: true,
    bg: true,
    backgroundColor: true,
    bgColor: true,
    opacity: true
  };
  const cssPropName = { css: true };
  const flexboxPropNames = {
    alignItems: true,
    alignContent: true,
    alignSelf: true,
    justifyItems: true,
    justifyContent: true,
    justifySelf: true,
    flexDirection: true,
    flexWrap: true,
    flex: true,
    flexGrow: true,
    flexShrink: true,
    flexBasis: true,
    order: true
  };
  const gridLayoutPropNames = {
    gridTemplate: true,
    gridTemplateColumns: true,
    gridTemplateRows: true,
    gridTemplateAreas: true,
    gridArea: true,
    gridRow: true,
    gridRowStart: true,
    gridRowEnd: true,
    gridColumn: true,
    gridColumnStart: true,
    gridColumnEnd: true,
    gridAutoFlow: true,
    gridAutoColumns: true,
    gridAutoRows: true,
    placeItems: true,
    placeContent: true,
    placeSelf: true,
    gap: true,
    rowGap: true,
    columnGap: true
  };
  const interactivityPropNames = {
    appearance: true,
    userSelect: true,
    pointerEvents: true,
    resize: true,
    cursor: true,
    outline: true,
    outlineOffset: true,
    outlineColor: true
  };
  const layoutPropNames = {
    display: true,
    d: true,
    verticalAlign: true,
    overflow: true,
    overflowX: true,
    overflowY: true,
    objectFit: true,
    objectPosition: true
  };
  const marginPropNames = {
    margin: true,
    m: true,
    marginTop: true,
    mt: true,
    marginRight: true,
    mr: true,
    marginStart: true,
    ms: true,
    marginBottom: true,
    mb: true,
    marginLeft: true,
    ml: true,
    marginEnd: true,
    me: true,
    mx: true,
    my: true
  };
  const paddingPropNames = {
    padding: true,
    p: true,
    paddingTop: true,
    pt: true,
    paddingRight: true,
    pr: true,
    paddingStart: true,
    ps: true,
    paddingBottom: true,
    pb: true,
    paddingLeft: true,
    pl: true,
    paddingEnd: true,
    pe: true,
    px: true,
    py: true
  };
  const positionPropNames = {
    position: true,
    pos: true,
    zIndex: true,
    top: true,
    right: true,
    bottom: true,
    left: true
  };
  const pseudoSelectorPropNames = {
    _hover: true,
    _active: true,
    _focus: true,
    _highlighted: true,
    _focusWithin: true,
    _focusVisible: true,
    _disabled: true,
    _readOnly: true,
    _before: true,
    _after: true,
    _empty: true,
    _expanded: true,
    _checked: true,
    _grabbed: true,
    _pressed: true,
    _invalid: true,
    _valid: true,
    _loading: true,
    _selected: true,
    _hidden: true,
    _even: true,
    _odd: true,
    _first: true,
    _last: true,
    _notFirst: true,
    _notLast: true,
    _visited: true,
    _activeLink: true,
    _activeStep: true,
    _indeterminate: true,
    _groupHover: true,
    _peerHover: true,
    _groupFocus: true,
    _peerFocus: true,
    _groupFocusVisible: true,
    _peerFocusVisible: true,
    _groupActive: true,
    _peerActive: true,
    _groupSelected: true,
    _peerSelected: true,
    _groupDisabled: true,
    _peerDisabled: true,
    _groupInvalid: true,
    _peerInvalid: true,
    _groupChecked: true,
    _peerChecked: true,
    _groupFocusWithin: true,
    _peerFocusWithin: true,
    _peerPlaceholderShown: true,
    _placeholder: true,
    _placeholderShown: true,
    _fullScreen: true,
    _selection: true,
    _mediaDark: true,
    _mediaReduceMotion: true,
    _dark: true,
    _light: true
  };
  const radiiPropNames = {
    borderRadius: true,
    borderTopRightRadius: true,
    borderTopLeftRadius: true,
    borderBottomRightRadius: true,
    borderBottomLeftRadius: true,
    borderTopRadius: true,
    borderRightRadius: true,
    borderStartRadius: true,
    borderBottomRadius: true,
    borderLeftRadius: true,
    borderEndRadius: true,
    rounded: true,
    roundedTop: true,
    roundedRight: true,
    roundedStart: true,
    roundedBottom: true,
    roundedLeft: true,
    roundedEnd: true
  };
  const shadowPropNames = {
    textShadow: true,
    boxShadow: true,
    shadow: true
  };
  const sizePropNames = {
    width: true,
    w: true,
    minWidth: true,
    minW: true,
    maxWidth: true,
    maxW: true,
    height: true,
    h: true,
    minHeight: true,
    minH: true,
    maxHeight: true,
    maxH: true,
    boxSize: true
  };
  const transformPropNames = {
    transform: true,
    transformOrigin: true,
    clipPath: true
  };
  const transitionPropNames = {
    transition: true,
    transitionProperty: true,
    transitionTimingFunction: true,
    transitionDuration: true,
    transitionDelay: true,
    animation: true,
    willChange: true
  };
  const typographyPropNames = {
    fontFamily: true,
    fontSize: true,
    fontWeight: true,
    lineHeight: true,
    letterSpacing: true,
    textAlign: true,
    fontStyle: true,
    textTransform: true,
    textDecoration: true,
    noOfLines: true
  };
  const stylePropNames = __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, borderPropNames), colorPropNames), flexboxPropNames), gridLayoutPropNames), interactivityPropNames), layoutPropNames), marginPropNames), paddingPropNames), positionPropNames), radiiPropNames), shadowPropNames), sizePropNames), transformPropNames), transitionPropNames), typographyPropNames), pseudoSelectorPropNames), cssPropName);
  const styledSystemStyles = css({});
  function createStyledSystemClass(props, baseStyles) {
    return styledSystemStyles({ css: toCssObject(props, baseStyles) });
  }
  function getUsedStylePropNames(props) {
    return Object.keys(props).filter((key) => key in stylePropNames);
  }
  const styled = (component, styleOptions) => {
    const hopeComponent = (props) => {
      const usedStylePropNames = getUsedStylePropNames(props);
      const propsWithDefault = mergeProps({
        as: component
      }, props);
      const [local, styleProps, others] = splitProps(propsWithDefault, ["as", "class", "className", "__baseStyle"], usedStylePropNames);
      const __baseStyles = createMemo(() => {
        const factoryBaseStyle = isFunction(styleOptions == null ? void 0 : styleOptions.baseStyle) ? styleOptions == null ? void 0 : styleOptions.baseStyle(props) : styleOptions == null ? void 0 : styleOptions.baseStyle;
        return [factoryBaseStyle, local.__baseStyle];
      });
      const classes = () => {
        return classNames(styleOptions == null ? void 0 : styleOptions.baseClass, local.class, local.className, createStyledSystemClass(styleProps, __baseStyles()));
      };
      return createComponent(Dynamic, mergeProps({
        get component() {
          var _a;
          return (_a = local.as) != null ? _a : "div";
        },
        get ["class"]() {
          return classes();
        }
      }, others));
    };
    hopeComponent.toString = () => (styleOptions == null ? void 0 : styleOptions.baseClass) ? createClassSelector(styleOptions.baseClass) : "";
    return hopeComponent;
  };
  function factory() {
    const cache = /* @__PURE__ */ new Map();
    return new Proxy(styled, {
      apply(target, thisArg, argArray) {
        return styled(...argArray);
      },
      get(_, element) {
        if (!cache.has(element)) {
          cache.set(element, styled(element));
        }
        return cache.get(element);
      }
    });
  }
  const hope = factory();
  const Box = hope.div;
  css({
    borderTopWidth: "1px",
    borderColor: "$neutral7",
    overflowAnchor: "none",
    "&:last-of-type": {
      borderBottomWidth: "1px"
    }
  });
  css({
    appearance: "none",
    display: "flex",
    alignItems: "center",
    width: "100%",
    outline: "none",
    backgroundColor: "transparent",
    px: "$4",
    py: "$2",
    color: "inherit",
    fontSize: "$base",
    lineHeight: "$6",
    cursor: "pointer",
    transition: "background-color 250ms",
    "&:disabled": {
      opacity: 0.4,
      cursor: "not-allowed"
    },
    "&:hover": {
      backgroundColor: "$neutral4"
    },
    "&:focus": {
      outline: "none",
      boxShadow: "$outline"
    }
  });
  css({
    flexGrow: 0,
    flexShrink: 0,
    fontSize: "1.25em",
    pointerEvents: "none",
    transition: "transform 250ms",
    transformOrigin: "center",
    variants: {
      expanded: {
        true: {
          transform: "rotate(-180deg)"
        }
      },
      disabled: {
        true: {
          opacity: 0.4
        }
      }
    }
  });
  css({
    pt: "$2",
    px: "$4",
    pb: "$4"
  });
  function isElement(el) {
    return el != null && typeof el == "object" && "nodeType" in el && el.nodeType === Node.ELEMENT_NODE;
  }
  function getOwnerDocument(node) {
    var _a;
    return isElement(node) ? (_a = node.ownerDocument) != null ? _a : document : document;
  }
  function isValidEvent(event, element) {
    const target = event.target;
    if (event.button > 0) {
      return false;
    }
    if (target) {
      const doc = getOwnerDocument(target);
      if (!doc.body.contains(target))
        return false;
    }
    return !(element == null ? void 0 : element.contains(target));
  }
  function getActiveElement(node) {
    const doc = getOwnerDocument(node);
    return doc == null ? void 0 : doc.activeElement;
  }
  function contains(parent, child) {
    if (!parent) {
      return false;
    }
    return parent === child || parent.contains(child);
  }
  function getRelatedTarget(event) {
    var _a, _b;
    const target = (_a = event.target) != null ? _a : event.currentTarget;
    const activeElement = getActiveElement(target);
    return (_b = event.relatedTarget) != null ? _b : activeElement;
  }
  function isScrollable(element) {
    return element && element.clientHeight < element.scrollHeight;
  }
  function maintainScrollVisibility(activeElement, scrollParent) {
    const { offsetHeight, offsetTop } = activeElement;
    const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;
    const isAbove = offsetTop < scrollTop;
    const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;
    if (isAbove) {
      scrollParent.scrollTo(0, offsetTop);
    } else if (isBelow) {
      scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
    }
  }
  function isChildrenFunction(props) {
    const childrenProp = Object.getOwnPropertyDescriptor(props, "children");
    if (childrenProp == null) {
      return false;
    }
    return isFunction(childrenProp.value);
  }
  const iconStyles = css({
    display: "inline-block",
    flexShrink: 0,
    boxSize: "1em",
    color: "currentColor",
    lineHeight: "1em",
    verticalAlign: "middle"
  });
  const _tmpl$$i = /* @__PURE__ */ template(`<svg><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`, 4, true);
  const fallbackIcon = {
    viewBox: "0 0 24 24",
    path: () => _tmpl$$i.cloneNode(true)
  };
  const hopeIconClass = "hope-icon";
  function Icon(props) {
    const defaultProps = {
      viewBox: fallbackIcon.viewBox
    };
    const propsWithDefault = mergeProps(defaultProps, props);
    const [local, others] = splitProps(propsWithDefault, ["as", "class", "children", "viewBox"]);
    const classes = () => classNames(local.class, hopeIconClass, iconStyles());
    const shouldRenderComponent = () => local.as && !isString(local.as);
    return createComponent(Show, {
      get when() {
        return shouldRenderComponent();
      },
      get fallback() {
        return createComponent(hope.svg, mergeProps({
          get ["class"]() {
            return classes();
          },
          get viewBox() {
            return local.viewBox;
          }
        }, others, {
          get children() {
            return createComponent(Show, {
              get when() {
                return local.children;
              },
              get fallback() {
                return fallbackIcon.path;
              },
              get children() {
                return local.children;
              }
            });
          }
        }));
      },
      get children() {
        return createComponent(Box, mergeProps({
          get as() {
            return local.as;
          },
          get ["class"]() {
            return classes();
          }
        }, others));
      }
    });
  }
  Icon.toString = () => createClassSelector(hopeIconClass);
  function createIcon(options) {
    const {
      viewBox = "0 0 24 24",
      defaultProps = {}
    } = options;
    const IconComponent = (props) => {
      return createComponent(Icon, mergeProps({
        viewBox
      }, defaultProps, props, {
        get children() {
          return options.path;
        }
      }));
    };
    IconComponent.toString = () => createClassSelector(hopeIconClass);
    return IconComponent;
  }
  const _tmpl$$h = /* @__PURE__ */ template(`<svg><path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`, 4, true);
  createIcon({
    viewBox: "0 0 15 15",
    path: () => _tmpl$$h.cloneNode(true)
  });
  css({
    overflow: "hidden"
  });
  const alertIconStyles = css({
    flexShrink: 0
  });
  css({
    fontWeight: "$semibold"
  });
  css({
    display: "inline-block"
  });
  css({
    position: "relative",
    display: "flex",
    alignItems: "center",
    borderRadius: "$sm",
    px: "$4",
    py: "$3",
    fontSize: "$base",
    lineHeight: "$6",
    variants: {
      variant: {
        solid: {},
        subtle: {},
        "left-accent": {
          borderLeftStyle: "solid",
          borderLeftWidth: "$sizes$1"
        },
        "top-accent": {
          borderTopStyle: "solid",
          borderTopWidth: "$sizes$1"
        }
      },
      status: {
        success: {},
        info: {},
        warning: {},
        danger: {}
      }
    },
    compoundVariants: [
      {
        variant: "solid",
        status: "success",
        css: {
          backgroundColor: "$success9",
          color: "white"
        }
      },
      {
        variant: "solid",
        status: "info",
        css: {
          backgroundColor: "$info9",
          color: "white"
        }
      },
      {
        variant: "solid",
        status: "warning",
        css: {
          backgroundColor: "$warning9",
          color: "$blackAlpha12"
        }
      },
      {
        variant: "solid",
        status: "danger",
        css: {
          backgroundColor: "$danger9",
          color: "white"
        }
      },
      {
        variant: "subtle",
        status: "success",
        css: {
          backgroundColor: "$success3",
          color: "$success11",
          [`& .${alertIconStyles}`]: {
            color: "$success9"
          }
        }
      },
      {
        variant: "subtle",
        status: "info",
        css: {
          backgroundColor: "$info3",
          color: "$info11",
          [`& .${alertIconStyles}`]: {
            color: "$info9"
          }
        }
      },
      {
        variant: "subtle",
        status: "warning",
        css: {
          backgroundColor: "$warning3",
          color: "$warning11",
          [`& .${alertIconStyles}`]: {
            color: "$warning9"
          }
        }
      },
      {
        variant: "subtle",
        status: "danger",
        css: {
          backgroundColor: "$danger3",
          color: "$danger11",
          [`& .${alertIconStyles}`]: {
            color: "$danger9"
          }
        }
      },
      {
        variant: "left-accent",
        status: "success",
        css: {
          borderLeftColor: "$success9",
          backgroundColor: "$success3",
          color: "$success11",
          [`& .${alertIconStyles}`]: {
            color: "$success9"
          }
        }
      },
      {
        variant: "left-accent",
        status: "info",
        css: {
          borderLeftColor: "$info9",
          backgroundColor: "$info3",
          color: "$info11",
          [`& .${alertIconStyles}`]: {
            color: "$info9"
          }
        }
      },
      {
        variant: "left-accent",
        status: "warning",
        css: {
          borderLeftColor: "$warning9",
          backgroundColor: "$warning3",
          color: "$warning11",
          [`& .${alertIconStyles}`]: {
            color: "$warning9"
          }
        }
      },
      {
        variant: "left-accent",
        status: "danger",
        css: {
          borderLeftColor: "$danger9",
          backgroundColor: "$danger3",
          color: "$danger11",
          [`& .${alertIconStyles}`]: {
            color: "$danger9"
          }
        }
      },
      {
        variant: "top-accent",
        status: "success",
        css: {
          borderTopColor: "$success9",
          backgroundColor: "$success3",
          color: "$success11",
          [`& .${alertIconStyles}`]: {
            color: "$success9"
          }
        }
      },
      {
        variant: "top-accent",
        status: "info",
        css: {
          borderTopColor: "$info9",
          backgroundColor: "$info3",
          color: "$info11",
          [`& .${alertIconStyles}`]: {
            color: "$info9"
          }
        }
      },
      {
        variant: "top-accent",
        status: "warning",
        css: {
          borderTopColor: "$warning9",
          backgroundColor: "$warning3",
          color: "$warning11",
          [`& .${alertIconStyles}`]: {
            color: "$warning9"
          }
        }
      },
      {
        variant: "top-accent",
        status: "danger",
        css: {
          borderTopColor: "$danger9",
          backgroundColor: "$danger3",
          color: "$danger11",
          [`& .${alertIconStyles}`]: {
            color: "$danger9"
          }
        }
      }
    ]
  });
  const _tmpl$$g = /* @__PURE__ */ template(`<svg><path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm-2 19.59l-5-5L10.59 15L14 18.41L21.41 11l1.596 1.586Z"></path></svg>`, 4, true), _tmpl$2$3 = /* @__PURE__ */ template(`<svg><path fill="none" d="m14 21.591l-5-5L10.591 15L14 18.409L21.41 11l1.595 1.585L14 21.591z"></path></svg>`, 4, true);
  createIcon({
    viewBox: "0 0 32 32",
    path: () => [_tmpl$$g.cloneNode(true), _tmpl$2$3.cloneNode(true)]
  });
  const _tmpl$$f = /* @__PURE__ */ template(`<svg><path fill="currentColor" d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14s14-6.3 14-14S23.7 2 16 2zm-1.1 6h2.2v11h-2.2V8zM16 25c-.8 0-1.5-.7-1.5-1.5S15.2 22 16 22s1.5.7 1.5 1.5S16.8 25 16 25z"></path></svg>`, 4, true);
  createIcon({
    viewBox: "0 0 32 32",
    path: () => _tmpl$$f.cloneNode(true)
  });
  const _tmpl$$e = /* @__PURE__ */ template(`<svg><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M29.4898 29.8706C29.3402 29.9548 29.1713 29.9991 28.9996 29.9993H2.99961C2.82787 29.9991 2.65905 29.9548 2.5094 29.8706C2.35976 29.7864 2.23433 29.665 2.14521 29.5182C2.05608 29.3713 2.00626 29.2041 2.00055 29.0325C1.99485 28.8608 2.03344 28.6907 2.1126 28.5382L15.1126 3.53821C15.1971 3.37598 15.3245 3.23999 15.4808 3.14514C15.6372 3.05017 15.8167 3 15.9996 3C16.1825 3 16.362 3.05017 16.5184 3.14514C16.6748 3.23999 16.8021 3.37598 16.8866 3.53821L29.8866 28.5382C29.9658 28.6907 30.0044 28.8608 29.9986 29.0325C29.9929 29.2041 29.9431 29.3713 29.854 29.5182C29.7649 29.665 29.6395 29.7864 29.4898 29.8706ZM16.0016 6.16919V6.17029H15.9976V6.16919H16.0016ZM15.9996 25.9993C15.7029 25.9993 15.4129 25.9113 15.1662 25.7465C14.9196 25.5817 14.7273 25.3474 14.6138 25.0734C14.5996 25.0391 14.5867 25.0044 14.5752 24.9694C14.4942 24.724 14.4778 24.4613 14.5284 24.2067C14.5863 23.9156 14.7292 23.6484 14.9389 23.4386C14.9652 23.4124 14.9923 23.3872 15.0202 23.3632C15.2159 23.1945 15.4524 23.0787 15.707 23.0281C15.7433 23.0209 15.7799 23.015 15.8165 23.0105C16.0723 22.979 16.3326 23.014 16.572 23.1129L16.5736 23.1135C16.8477 23.2271 17.082 23.4193 17.2468 23.6659C17.2674 23.6968 17.2868 23.7283 17.305 23.7604C17.4322 23.9852 17.4996 24.2397 17.4996 24.4993C17.4996 24.8971 17.3416 25.2787 17.0603 25.5599C16.7789 25.8413 16.3974 25.9993 15.9996 25.9993ZM17.1246 20.9993H14.8746V11.9993H17.1246V20.9993Z"></path></svg>`, 4, true);
  createIcon({
    viewBox: "0 0 32 32",
    path: () => _tmpl$$e.cloneNode(true)
  });
  const _tmpl$$d = /* @__PURE__ */ template(`<svg><path fill="none" d="M16 8a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 16 8Zm4 13.875h-2.875v-8H13v2.25h1.875v5.75H12v2.25h8Z"></path></svg>`, 4, true), _tmpl$2$2 = /* @__PURE__ */ template(`<svg><path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm0 6a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 16 8Zm4 16.125h-8v-2.25h2.875v-5.75H13v-2.25h4.125v8H20Z"></path></svg>`, 4, true);
  createIcon({
    viewBox: "0 0 32 32",
    path: () => [_tmpl$$d.cloneNode(true), _tmpl$2$2.cloneNode(true)]
  });
  css({
    position: "relative",
    outline: "none",
    backgroundColor: "transparent",
    textDecoration: "none",
    cursor: "pointer",
    transition: "text-decoration 250ms",
    "&:hover": {
      textDecoration: "underline"
    },
    "&:focus": {
      boxShadow: "$outline"
    }
  });
  css({
    position: "relative",
    "&::before": {
      height: 0,
      content: "''",
      display: "block"
    },
    "& > *:not(style)": {
      overflow: "hidden",
      position: "absolute",
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%"
    },
    "& > img, & > video": {
      objectFit: "cover"
    }
  });
  const hopeIconButtonClass = "hope-icon-button";
  const buttonIconStyles = css({
    display: "inline-flex",
    alignSelf: "center",
    flexShrink: 0
  });
  const buttonLoaderStyles = css({
    position: "absolute",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    fontSize: "1em",
    lineHeight: "$normal",
    variants: {
      withLoadingText: {
        true: {
          position: "relative"
        }
      }
    }
  });
  const buttonIconSpinnerStyles = css({
    fontSize: "1.3em",
    animation: `1s linear infinite ${spin}`
  });
  function createSizeVariant$1(config2) {
    return {
      height: config2.height,
      py: 0,
      px: config2.paddingX,
      fontSize: config2.fontSize,
      [`&.${hopeIconButtonClass}`]: {
        width: config2.height,
        padding: "0"
      }
    };
  }
  function createCompactSizeCompoundVariant(config2) {
    return {
      height: config2.height,
      py: 0,
      px: config2.paddingX,
      [`&.${hopeIconButtonClass}`]: {
        width: config2.height,
        padding: "0"
      }
    };
  }
  function createSolidCompoundVariant(config2) {
    return {
      backgroundColor: config2.bgColor,
      color: config2.color,
      "&:hover": {
        backgroundColor: config2.bgColorHover
      }
    };
  }
  function createSubtleCompoundVariant(config2) {
    return {
      backgroundColor: config2.bgColor,
      color: config2.color,
      "&:hover": {
        backgroundColor: config2.bgColorHover
      },
      "&:active": {
        backgroundColor: config2.bgColorActive
      }
    };
  }
  function createOutlineCompoundVariant(config2) {
    return {
      borderColor: config2.borderColor,
      color: config2.color,
      "&:hover": {
        borderColor: config2.borderColorHover,
        backgroundColor: config2.bgColorHover
      },
      "&:active": {
        backgroundColor: config2.bgColorActive
      }
    };
  }
  function createGhostCompoundVariant(config2) {
    return {
      color: config2.color,
      "&:hover": {
        backgroundColor: config2.bgColorHover
      },
      "&:active": {
        backgroundColor: config2.bgColorActive
      }
    };
  }
  const buttonStyles = css({
    appearance: "none",
    position: "relative",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    outline: "none",
    borderRadius: "$sm",
    padding: "0",
    fontWeight: "$medium",
    lineHeight: "$none",
    textDecoration: "none",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    transition: "color 250ms, background-color 250ms, box-shadow 250ms",
    "&:focus": {
      outline: "none",
      boxShadow: "$outline"
    },
    "&:disabled, &:hover:disabled": {
      color: "$neutral7",
      cursor: "not-allowed"
    },
    variants: {
      variant: {
        solid: {
          border: "1px solid transparent",
          "&:disabled, &:hover:disabled": {
            backgroundColor: "$neutral3"
          }
        },
        subtle: {
          border: "1px solid transparent",
          "&:disabled, &:hover:disabled": {
            backgroundColor: "$neutral3"
          }
        },
        outline: {
          borderStyle: "solid",
          borderWidth: "1px",
          backgroundColor: "transparent",
          "&:disabled, &:hover:disabled": {
            borderColor: "$neutral3"
          }
        },
        dashed: {
          borderStyle: "dashed",
          borderWidth: "1px",
          backgroundColor: "transparent",
          "&:disabled, &:hover:disabled": {
            borderColor: "$neutral3"
          }
        },
        ghost: {
          border: "1px solid transparent",
          backgroundColor: "transparent"
        }
      },
      colorScheme: {
        primary: {},
        accent: {},
        neutral: {},
        success: {},
        info: {},
        warning: {},
        danger: {}
      },
      size: {
        xs: createSizeVariant$1({
          height: "$6",
          paddingX: "$2",
          fontSize: "$xs",
          spacing: "$1"
        }),
        sm: createSizeVariant$1({
          height: "$8",
          paddingX: "$3",
          fontSize: "$sm",
          spacing: "$1_5"
        }),
        md: createSizeVariant$1({
          height: "$10",
          paddingX: "$4",
          fontSize: "$base",
          spacing: "$1_5"
        }),
        lg: createSizeVariant$1({
          height: "$12",
          paddingX: "$6",
          fontSize: "$lg",
          spacing: "$2"
        }),
        xl: createSizeVariant$1({
          height: "$16",
          paddingX: "$10",
          fontSize: "$xl",
          spacing: "$2"
        })
      },
      compact: {
        true: {},
        false: {}
      },
      fullWidth: {
        true: {
          display: "flex",
          width: "100%"
        },
        false: {
          display: "inline-flex",
          width: "auto"
        }
      },
      loading: {
        true: {
          opacity: "0.75",
          cursor: "default",
          pointerEvents: "none"
        },
        false: {}
      }
    },
    compoundVariants: [
      {
        variant: "solid",
        colorScheme: "primary",
        css: createSolidCompoundVariant({
          color: "white",
          bgColor: "$primary9",
          bgColorHover: "$primary10"
        })
      },
      {
        variant: "solid",
        colorScheme: "accent",
        css: createSolidCompoundVariant({
          color: "white",
          bgColor: "$accent9",
          bgColorHover: "$accent10"
        })
      },
      {
        variant: "solid",
        colorScheme: "neutral",
        css: createSolidCompoundVariant({
          color: "white",
          bgColor: "$neutral9",
          bgColorHover: "$neutral10"
        })
      },
      {
        variant: "solid",
        colorScheme: "success",
        css: createSolidCompoundVariant({
          color: "white",
          bgColor: "$success9",
          bgColorHover: "$success10"
        })
      },
      {
        variant: "solid",
        colorScheme: "info",
        css: createSolidCompoundVariant({
          color: "white",
          bgColor: "$info9",
          bgColorHover: "$info10"
        })
      },
      {
        variant: "solid",
        colorScheme: "warning",
        css: createSolidCompoundVariant({
          color: "$blackAlpha12",
          bgColor: "$warning9",
          bgColorHover: "$warning10"
        })
      },
      {
        variant: "solid",
        colorScheme: "danger",
        css: createSolidCompoundVariant({
          color: "white",
          bgColor: "$danger9",
          bgColorHover: "$danger10"
        })
      },
      {
        variant: "subtle",
        colorScheme: "primary",
        css: createSubtleCompoundVariant({
          color: "$primary11",
          bgColor: "$primary4",
          bgColorHover: "$primary5",
          bgColorActive: "$primary6"
        })
      },
      {
        variant: "subtle",
        colorScheme: "accent",
        css: createSubtleCompoundVariant({
          color: "$accent11",
          bgColor: "$accent4",
          bgColorHover: "$accent5",
          bgColorActive: "$accent6"
        })
      },
      {
        variant: "subtle",
        colorScheme: "neutral",
        css: createSubtleCompoundVariant({
          color: "$neutral12",
          bgColor: "$neutral4",
          bgColorHover: "$neutral5",
          bgColorActive: "$neutral6"
        })
      },
      {
        variant: "subtle",
        colorScheme: "success",
        css: createSubtleCompoundVariant({
          color: "$success11",
          bgColor: "$success4",
          bgColorHover: "$success5",
          bgColorActive: "$success6"
        })
      },
      {
        variant: "subtle",
        colorScheme: "info",
        css: createSubtleCompoundVariant({
          color: "$info11",
          bgColor: "$info4",
          bgColorHover: "$info5",
          bgColorActive: "$info6"
        })
      },
      {
        variant: "subtle",
        colorScheme: "warning",
        css: createSubtleCompoundVariant({
          color: "$warning11",
          bgColor: "$warning4",
          bgColorHover: "$warning5",
          bgColorActive: "$warning6"
        })
      },
      {
        variant: "subtle",
        colorScheme: "danger",
        css: createSubtleCompoundVariant({
          color: "$danger11",
          bgColor: "$danger4",
          bgColorHover: "$danger5",
          bgColorActive: "$danger6"
        })
      },
      {
        variant: "outline",
        colorScheme: "primary",
        css: createOutlineCompoundVariant({
          color: "$primary11",
          borderColor: "$primary7",
          borderColorHover: "$primary8",
          bgColorHover: "$primary4",
          bgColorActive: "$primary5"
        })
      },
      {
        variant: "outline",
        colorScheme: "accent",
        css: createOutlineCompoundVariant({
          color: "$accent11",
          borderColor: "$accent7",
          borderColorHover: "$accent8",
          bgColorHover: "$accent4",
          bgColorActive: "$accent5"
        })
      },
      {
        variant: "outline",
        colorScheme: "neutral",
        css: createOutlineCompoundVariant({
          color: "$neutral12",
          borderColor: "$neutral7",
          borderColorHover: "$neutral8",
          bgColorHover: "$neutral4",
          bgColorActive: "$neutral5"
        })
      },
      {
        variant: "outline",
        colorScheme: "success",
        css: createOutlineCompoundVariant({
          color: "$success11",
          borderColor: "$success7",
          borderColorHover: "$success8",
          bgColorHover: "$success4",
          bgColorActive: "$success5"
        })
      },
      {
        variant: "outline",
        colorScheme: "info",
        css: createOutlineCompoundVariant({
          color: "$info11",
          borderColor: "$info7",
          borderColorHover: "$info8",
          bgColorHover: "$info4",
          bgColorActive: "$info5"
        })
      },
      {
        variant: "outline",
        colorScheme: "warning",
        css: createOutlineCompoundVariant({
          color: "$warning11",
          borderColor: "$warning7",
          borderColorHover: "$warning8",
          bgColorHover: "$warning4",
          bgColorActive: "$warning5"
        })
      },
      {
        variant: "outline",
        colorScheme: "danger",
        css: createOutlineCompoundVariant({
          color: "$danger11",
          borderColor: "$danger7",
          borderColorHover: "$danger8",
          bgColorHover: "$danger4",
          bgColorActive: "$danger5"
        })
      },
      {
        variant: "dashed",
        colorScheme: "primary",
        css: createOutlineCompoundVariant({
          color: "$primary11",
          borderColor: "$primary7",
          borderColorHover: "$primary8",
          bgColorHover: "$primary4",
          bgColorActive: "$primary5"
        })
      },
      {
        variant: "dashed",
        colorScheme: "accent",
        css: createOutlineCompoundVariant({
          color: "$accent11",
          borderColor: "$accent7",
          borderColorHover: "$accent8",
          bgColorHover: "$accent4",
          bgColorActive: "$accent5"
        })
      },
      {
        variant: "dashed",
        colorScheme: "neutral",
        css: createOutlineCompoundVariant({
          color: "$neutral12",
          borderColor: "$neutral7",
          borderColorHover: "$neutral8",
          bgColorHover: "$neutral4",
          bgColorActive: "$neutral5"
        })
      },
      {
        variant: "dashed",
        colorScheme: "success",
        css: createOutlineCompoundVariant({
          color: "$success11",
          borderColor: "$success7",
          borderColorHover: "$success8",
          bgColorHover: "$success4",
          bgColorActive: "$success5"
        })
      },
      {
        variant: "dashed",
        colorScheme: "info",
        css: createOutlineCompoundVariant({
          color: "$info11",
          borderColor: "$info7",
          borderColorHover: "$info8",
          bgColorHover: "$info4",
          bgColorActive: "$info5"
        })
      },
      {
        variant: "dashed",
        colorScheme: "warning",
        css: createOutlineCompoundVariant({
          color: "$warning11",
          borderColor: "$warning7",
          borderColorHover: "$warning8",
          bgColorHover: "$warning4",
          bgColorActive: "$warning5"
        })
      },
      {
        variant: "dashed",
        colorScheme: "danger",
        css: createOutlineCompoundVariant({
          color: "$danger11",
          borderColor: "$danger7",
          borderColorHover: "$danger8",
          bgColorHover: "$danger4",
          bgColorActive: "$danger5"
        })
      },
      {
        variant: "ghost",
        colorScheme: "primary",
        css: createGhostCompoundVariant({
          color: "$primary11",
          bgColorHover: "$primary4",
          bgColorActive: "$primary5"
        })
      },
      {
        variant: "ghost",
        colorScheme: "accent",
        css: createGhostCompoundVariant({
          color: "$accent11",
          bgColorHover: "$accent4",
          bgColorActive: "$accent5"
        })
      },
      {
        variant: "ghost",
        colorScheme: "neutral",
        css: createGhostCompoundVariant({
          color: "$neutral12",
          bgColorHover: "$neutral4",
          bgColorActive: "$neutral5"
        })
      },
      {
        variant: "ghost",
        colorScheme: "success",
        css: createGhostCompoundVariant({
          color: "$success11",
          bgColorHover: "$success4",
          bgColorActive: "$success5"
        })
      },
      {
        variant: "ghost",
        colorScheme: "info",
        css: createGhostCompoundVariant({
          color: "$info11",
          bgColorHover: "$info4",
          bgColorActive: "$info5"
        })
      },
      {
        variant: "ghost",
        colorScheme: "warning",
        css: createGhostCompoundVariant({
          color: "$warning11",
          bgColorHover: "$warning4",
          bgColorActive: "$warning5"
        })
      },
      {
        variant: "ghost",
        colorScheme: "danger",
        css: createGhostCompoundVariant({
          color: "$danger11",
          bgColorHover: "$danger4",
          bgColorActive: "$danger5"
        })
      },
      {
        size: "xs",
        compact: "true",
        css: createCompactSizeCompoundVariant({ height: "$5", paddingX: "$1" })
      },
      {
        size: "sm",
        compact: "true",
        css: createCompactSizeCompoundVariant({ height: "$6", paddingX: "$1_5" })
      },
      {
        size: "md",
        compact: "true",
        css: createCompactSizeCompoundVariant({ height: "$7", paddingX: "$2" })
      },
      {
        size: "lg",
        compact: "true",
        css: createCompactSizeCompoundVariant({ height: "$8", paddingX: "$2_5" })
      },
      {
        size: "xl",
        compact: "true",
        css: createCompactSizeCompoundVariant({ height: "$10", paddingX: "$3_5" })
      }
    ]
  });
  css({
    display: "inline-flex",
    [`& .${buttonStyles}:focus`]: {
      zIndex: 1
    }
  });
  const ButtonGroupContext = createContext();
  function useButtonGroupContext() {
    return useContext(ButtonGroupContext);
  }
  const hopeButtonIconClass = "hope-button__icon";
  function ButtonIcon(props) {
    const [local, others] = splitProps(props, ["class", "children"]);
    const classes = () => classNames(local.class, hopeButtonIconClass, buttonIconStyles());
    return createComponent(hope.span, mergeProps({
      get ["class"]() {
        return classes();
      }
    }, others, {
      get children() {
        return local.children;
      }
    }));
  }
  ButtonIcon.toString = () => createClassSelector(hopeButtonIconClass);
  const _tmpl$$c = /* @__PURE__ */ template(`<svg><g fill="none"><path opacity=".2" fill-rule="evenodd" clip-rule="evenodd" d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14zm0 3c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10z" fill="currentColor"></path><path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7H2z" fill="currentColor"></path></g></svg>`, 8, true);
  const IconSpinner = createIcon({
    path: () => _tmpl$$c.cloneNode(true)
  });
  const hopeButtonLoaderClass = "hope-button__loader";
  function ButtonLoader(props) {
    const defaultProps = {
      spacing: "0.5rem",
      children: createComponent(IconSpinner, {
        get ["class"]() {
          return buttonIconSpinnerStyles();
        }
      })
    };
    const propsWithDefault = mergeProps(defaultProps, props);
    const [local, others] = splitProps(propsWithDefault, ["class", "children", "withLoadingText", "placement", "spacing"]);
    const marginProp = () => local.placement === "start" ? "marginEnd" : "marginStart";
    const loaderStyles = () => ({
      [marginProp()]: local.withLoadingText ? local.spacing : 0
    });
    const classes = () => {
      return classNames(local.class, hopeButtonLoaderClass, buttonLoaderStyles({
        withLoadingText: local.withLoadingText
      }));
    };
    return createComponent(hope.div, mergeProps({
      get ["class"]() {
        return classes();
      }
    }, loaderStyles, others, {
      get children() {
        return local.children;
      }
    }));
  }
  ButtonLoader.toString = () => createClassSelector(hopeButtonLoaderClass);
  const hopeButtonClass = "hope-button";
  function Button(props) {
    var _a, _b, _c;
    const theme = useStyleConfig().Button;
    const buttonGroupContext = useButtonGroupContext();
    const defaultProps = {
      loaderPlacement: (_c = (_b = (_a = theme == null ? void 0 : theme.defaultProps) == null ? void 0 : _a.root) == null ? void 0 : _b.loaderPlacement) != null ? _c : "start",
      iconSpacing: "0.5rem",
      type: "button",
      role: "button"
    };
    const propsWithDefault = mergeProps(defaultProps, props);
    const [local, contentProps, others] = splitProps(propsWithDefault, ["class", "disabled", "loadingText", "loader", "loaderPlacement", "variant", "colorScheme", "size", "loading", "compact", "fullWidth"], ["children", "iconSpacing", "leftIcon", "rightIcon"]);
    const disabled = () => {
      var _a2;
      return (_a2 = local.disabled) != null ? _a2 : buttonGroupContext == null ? void 0 : buttonGroupContext.state.disabled;
    };
    const classes = () => {
      var _a2, _b2, _c2, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
      return classNames(local.class, hopeButtonClass, buttonStyles({
        variant: (_e = (_d = (_a2 = local.variant) != null ? _a2 : buttonGroupContext == null ? void 0 : buttonGroupContext.state.variant) != null ? _d : (_c2 = (_b2 = theme == null ? void 0 : theme.defaultProps) == null ? void 0 : _b2.root) == null ? void 0 : _c2.variant) != null ? _e : "solid",
        colorScheme: (_j = (_i = (_f = local.colorScheme) != null ? _f : buttonGroupContext == null ? void 0 : buttonGroupContext.state.colorScheme) != null ? _i : (_h = (_g = theme == null ? void 0 : theme.defaultProps) == null ? void 0 : _g.root) == null ? void 0 : _h.colorScheme) != null ? _j : "primary",
        size: (_o = (_n = (_k = local.size) != null ? _k : buttonGroupContext == null ? void 0 : buttonGroupContext.state.size) != null ? _n : (_m = (_l = theme == null ? void 0 : theme.defaultProps) == null ? void 0 : _l.root) == null ? void 0 : _m.size) != null ? _o : "md",
        loading: local.loading,
        compact: local.compact,
        fullWidth: local.fullWidth
      }));
    };
    return createComponent(hope.button, mergeProps({
      get ["class"]() {
        return classes();
      },
      get disabled() {
        return disabled();
      },
      get __baseStyle() {
        var _a2;
        return (_a2 = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a2.root;
      }
    }, others, {
      get children() {
        return [createComponent(Show, {
          get when() {
            return local.loading && local.loaderPlacement === "start";
          },
          get children() {
            return createComponent(ButtonLoader, {
              "class": "hope-button__loader--start",
              get withLoadingText() {
                return !!local.loadingText;
              },
              placement: "start",
              get spacing() {
                return contentProps.iconSpacing;
              },
              get children() {
                return local.loader;
              }
            });
          }
        }), createComponent(Show, {
          get when() {
            return local.loading;
          },
          get fallback() {
            return createComponent(ButtonContent, contentProps);
          },
          get children() {
            return createComponent(Show, {
              get when() {
                return local.loadingText;
              },
              get fallback() {
                return createComponent(hope.span, {
                  opacity: 0,
                  get children() {
                    return createComponent(ButtonContent, contentProps);
                  }
                });
              },
              get children() {
                return local.loadingText;
              }
            });
          }
        }), createComponent(Show, {
          get when() {
            return local.loading && local.loaderPlacement === "end";
          },
          get children() {
            return createComponent(ButtonLoader, {
              "class": "hope-button__loader--end",
              get withLoadingText() {
                return !!local.loadingText;
              },
              placement: "end",
              get spacing() {
                return contentProps.iconSpacing;
              },
              get children() {
                return local.loader;
              }
            });
          }
        })];
      }
    }));
  }
  Button.toString = () => createClassSelector(hopeButtonClass);
  function ButtonContent(props) {
    return [createComponent(Show, {
      get when() {
        return props.leftIcon;
      },
      get children() {
        return createComponent(ButtonIcon, {
          get marginEnd() {
            return props.iconSpacing;
          },
          get children() {
            return props.leftIcon;
          }
        });
      }
    }), createMemo(() => props.children), createComponent(Show, {
      get when() {
        return props.rightIcon;
      },
      get children() {
        return createComponent(ButtonIcon, {
          get marginStart() {
            return props.iconSpacing;
          },
          get children() {
            return props.rightIcon;
          }
        });
      }
    })];
  }
  function createSizeVariant(size2) {
    return {
      boxSize: size2,
      fontSize: `calc(${size2} / 2.5)`,
      lineHeight: size2
    };
  }
  const avatarStyles = css({
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: "$full",
    borderColor: "$loContrast",
    backgroundColor: "$neutral8",
    color: "$neutral12",
    fontWeight: "$medium",
    textAlign: "center",
    textTransform: "uppercase",
    verticalAlign: "top",
    variants: {
      size: {
        "2xs": createSizeVariant("$sizes$4"),
        xs: createSizeVariant("$sizes$6"),
        sm: createSizeVariant("$sizes$8"),
        md: createSizeVariant("$sizes$12"),
        lg: createSizeVariant("$sizes$16"),
        xl: createSizeVariant("$sizes$24"),
        "2xl": createSizeVariant("$sizes$32"),
        full: {
          boxSize: "$full",
          fontSize: "calc($sizes$full / 2.5)"
        }
      },
      withBorder: {
        true: {}
      }
    },
    compoundVariants: [
      {
        withBorder: true,
        size: "2xs",
        css: { borderWidth: "1px" }
      },
      {
        withBorder: true,
        size: "xs",
        css: { borderWidth: "1px" }
      },
      {
        withBorder: true,
        size: "sm",
        css: { borderWidth: "2px" }
      },
      {
        withBorder: true,
        size: "md",
        css: { borderWidth: "2px" }
      },
      {
        withBorder: true,
        size: "lg",
        css: { borderWidth: "3px" }
      },
      {
        withBorder: true,
        size: "xl",
        css: { borderWidth: "4px" }
      },
      {
        withBorder: true,
        size: "2xl",
        css: { borderWidth: "5px" }
      },
      {
        withBorder: true,
        size: "full",
        css: { borderWidth: "2px" }
      }
    ]
  });
  css(avatarStyles);
  css({
    boxSize: "$full",
    borderRadius: "$full",
    objectFit: "cover"
  });
  css({
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "$full",
    borderWidth: "0.2em",
    borderStyle: "solid",
    borderColor: "$loContrast",
    variants: {
      placement: {
        "top-start": {
          insetInlineStart: "0",
          top: "0",
          transform: "translate(-25%, -25%)"
        },
        "top-end": {
          insetInlineEnd: "0",
          top: "0",
          transform: "translate(25%, -25%)"
        },
        "bottom-start": {
          insetInlineStart: "0",
          bottom: "0",
          transform: "translate(-25%, 25%)"
        },
        "bottom-end": {
          insetInlineEnd: "0",
          bottom: "0",
          transform: "translate(25%, 25%)"
        }
      }
    }
  });
  css({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    [`& .${avatarStyles}:first-child`]: {
      marginStart: "0"
    }
  });
  css({
    display: "inline-block",
    borderRadius: "$sm",
    py: "$0_5",
    px: "$1",
    fontSize: "$xs",
    fontWeight: "$bold",
    lineHeight: "$none",
    letterSpacing: "$wide",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    variants: {
      variant: {
        solid: {
          border: "1px solid transparent",
          color: "white"
        },
        subtle: {
          border: "1px solid transparent"
        },
        outline: {
          borderStyle: "solid",
          borderWidth: "1px",
          backgroundColor: "transparent"
        }
      },
      colorScheme: {
        primary: {},
        accent: {},
        neutral: {},
        success: {},
        info: {},
        warning: {},
        danger: {}
      }
    },
    compoundVariants: [
      {
        variant: "solid",
        colorScheme: "primary",
        css: {
          color: "white",
          bgColor: "$primary9"
        }
      },
      {
        variant: "solid",
        colorScheme: "accent",
        css: {
          color: "white",
          bgColor: "$accent9"
        }
      },
      {
        variant: "solid",
        colorScheme: "neutral",
        css: {
          color: "white",
          bgColor: "$neutral9"
        }
      },
      {
        variant: "solid",
        colorScheme: "success",
        css: {
          color: "white",
          bgColor: "$success9"
        }
      },
      {
        variant: "solid",
        colorScheme: "info",
        css: {
          color: "white",
          bgColor: "$info9"
        }
      },
      {
        variant: "solid",
        colorScheme: "warning",
        css: {
          color: "$blackAlpha12",
          bgColor: "$warning9"
        }
      },
      {
        variant: "solid",
        colorScheme: "danger",
        css: {
          color: "white",
          bgColor: "$danger9"
        }
      },
      {
        variant: "subtle",
        colorScheme: "primary",
        css: {
          color: "$primary11",
          bgColor: "$primary4"
        }
      },
      {
        variant: "subtle",
        colorScheme: "accent",
        css: {
          color: "$accent11",
          bgColor: "$accent4"
        }
      },
      {
        variant: "subtle",
        colorScheme: "neutral",
        css: {
          color: "$neutral12",
          bgColor: "$neutral4"
        }
      },
      {
        variant: "subtle",
        colorScheme: "success",
        css: {
          color: "$success11",
          bgColor: "$success4"
        }
      },
      {
        variant: "subtle",
        colorScheme: "info",
        css: {
          color: "$info11",
          bgColor: "$info4"
        }
      },
      {
        variant: "subtle",
        colorScheme: "warning",
        css: {
          color: "$warning11",
          bgColor: "$warning4"
        }
      },
      {
        variant: "subtle",
        colorScheme: "danger",
        css: {
          color: "$danger11",
          bgColor: "$danger4"
        }
      },
      {
        variant: "outline",
        colorScheme: "primary",
        css: {
          color: "$primary11",
          borderColor: "$primary7"
        }
      },
      {
        variant: "outline",
        colorScheme: "accent",
        css: {
          color: "$accent11",
          borderColor: "$accent7"
        }
      },
      {
        variant: "outline",
        colorScheme: "neutral",
        css: {
          color: "$neutral12",
          borderColor: "$neutral7"
        }
      },
      {
        variant: "outline",
        colorScheme: "success",
        css: {
          color: "$success11",
          borderColor: "$success7"
        }
      },
      {
        variant: "outline",
        colorScheme: "info",
        css: {
          color: "$info11",
          borderColor: "$info7"
        }
      },
      {
        variant: "outline",
        colorScheme: "warning",
        css: {
          color: "$warning11",
          borderColor: "$warning7"
        }
      },
      {
        variant: "outline",
        colorScheme: "danger",
        css: {
          color: "$danger11",
          borderColor: "$danger7"
        }
      }
    ]
  });
  css({
    display: "block",
    fontSize: "$base",
    lineHeight: "$6"
  });
  css({
    display: "flex",
    alignItems: "center",
    margin: 0,
    padding: 0,
    listStyle: "none"
  });
  css({
    display: "inline-flex",
    alignItems: "center"
  });
  css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  });
  css({
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    outline: "none",
    backgroundColor: "transparent",
    color: "$neutral11",
    textDecoration: "none",
    cursor: "pointer",
    transition: "color 250ms, text-decoration 250ms",
    "&:focus": {
      boxShadow: "$outline"
    },
    variants: {
      currentPage: {
        true: {
          color: "$neutral12",
          cursor: "default"
        },
        false: {
          "&:hover": {
            color: "$primary11"
          }
        }
      }
    }
  });
  css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  });
  function createColorVariant(config2) {
    return {
      color: config2.color,
      "&[data-disabled]": {
        color: "$neutral10"
      },
      "&[data-focus]": {
        boxShadow: `0 0 0 3px $colors${config2.boxShadowColorFocus}`,
        borderColor: config2.borderColorFocus
      }
    };
  }
  const toggleWrapperStyles = css({
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: "$2",
    cursor: "pointer",
    userSelect: "none",
    "&[data-disabled]": {
      opacity: "0.5",
      cursor: "not-allowed"
    },
    variants: {
      size: {
        sm: {
          fontSize: "$sm",
          lineHeight: "$5"
        },
        md: {
          fontSize: "$base",
          lineHeight: "$6"
        },
        lg: {
          fontSize: "$lg",
          lineHeight: "$7"
        }
      }
    }
  });
  const toggleControlLabelStyles = css({
    cursor: "pointer",
    userSelect: "none",
    "&[data-disabled]": {
      opacity: "0.5",
      cursor: "not-allowed"
    }
  });
  const toggleControlStyles = css({
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    height: "100%",
    outline: "none",
    padding: 0,
    verticalAlign: "middle",
    cursor: "pointer",
    userSelect: "none",
    transition: "border-color 250ms, box-shadow 250ms",
    "&[data-disabled]": {
      opacity: "0.5",
      cursor: "not-allowed"
    },
    "&[data-invalid]": {
      borderColor: "$danger8",
      color: "$danger9"
    },
    "&[data-focus][data-invalid]": {
      boxShadow: "0 0 0 3px $colors$danger5",
      borderColor: "$danger8"
    },
    "&[data-checked], &[data-focus][data-checked]": {
      borderColor: "transparent",
      backgroundColor: "currentColor"
    },
    variants: {
      variant: {
        outline: {
          border: "1px solid $colors$neutral8",
          backgroundColor: "transparent"
        },
        filled: {
          border: "1px solid transparent",
          backgroundColor: "$neutral7"
        }
      },
      colorScheme: {
        primary: createColorVariant({
          color: "$primary9",
          boxShadowColorFocus: "$primary5",
          borderColorFocus: "$primary8"
        }),
        accent: createColorVariant({
          color: "$accent9",
          boxShadowColorFocus: "$accent5",
          borderColorFocus: "$accent8"
        }),
        neutral: createColorVariant({
          color: "$neutral9",
          boxShadowColorFocus: "$neutral5",
          borderColorFocus: "$neutral8"
        }),
        success: createColorVariant({
          color: "$success9",
          boxShadowColorFocus: "$success5",
          borderColorFocus: "$success8"
        }),
        info: createColorVariant({
          color: "$info9",
          boxShadowColorFocus: "$info5",
          borderColorFocus: "$info8"
        }),
        warning: createColorVariant({
          color: "$warning9",
          boxShadowColorFocus: "$warning5",
          borderColorFocus: "$warning8"
        }),
        danger: createColorVariant({
          color: "$danger9",
          boxShadowColorFocus: "$danger5",
          borderColorFocus: "$danger8"
        })
      },
      size: {
        sm: {
          boxSize: "$3"
        },
        md: {
          boxSize: "$4"
        },
        lg: {
          boxSize: "$5"
        }
      }
    }
  });
  css(toggleWrapperStyles, {
    variants: {
      labelPlacement: {
        start: {
          flexDirection: "row-reverse"
        },
        end: {
          flexDirection: "row"
        }
      }
    }
  });
  css(toggleControlLabelStyles);
  css(toggleControlStyles, {
    borderRadius: "$sm",
    "& svg": {
      color: "$loContrast"
    },
    "&[data-indeterminate], &[data-focus][data-indeterminate]": {
      borderColor: "transparent",
      backgroundColor: "currentColor"
    }
  });
  css({
    position: "relative",
    width: "$full"
  });
  css({
    display: "inline-block",
    marginBottom: "$1",
    color: "$neutral12",
    fontWeight: "$medium",
    fontSize: "$sm",
    lineHeight: "$5",
    textAlign: "start",
    opacity: 1,
    "&[data-disabled]": {
      opacity: 0.4,
      cursor: "not-allowed"
    }
  });
  css({
    marginInlineStart: "$1",
    color: "$danger9",
    fontSize: "$base"
  });
  css({
    display: "inline-block",
    marginTop: "$1",
    color: "$neutral11",
    fontWeight: "$normal",
    fontSize: "$sm",
    lineHeight: "$5",
    textAlign: "start",
    opacity: 1,
    "&[data-disabled]": {
      opacity: 0.4,
      cursor: "not-allowed"
    }
  });
  css({
    display: "inline-block",
    marginTop: "$1",
    color: "$danger9",
    fontWeight: "$normal",
    fontSize: "$sm",
    lineHeight: "$5",
    textAlign: "start",
    opacity: 1,
    "&[data-disabled]": {
      opacity: 0.4,
      cursor: "not-allowed"
    }
  });
  const FormControlContext = createContext();
  function useFormControlContext() {
    return useContext(FormControlContext);
  }
  function useFormControl(props) {
    const formControl = useFormControlContext();
    const focusHandler = createMemo(() => {
      return chainHandlers(formControl == null ? void 0 : formControl.onFocus, props.onFocus);
    });
    const blurHandler = createMemo(() => {
      return chainHandlers(formControl == null ? void 0 : formControl.onBlur, props.onBlur);
    });
    const [state] = createStore({
      get id() {
        var _a;
        return (_a = props.id) != null ? _a : formControl == null ? void 0 : formControl.state.id;
      },
      get required() {
        var _a;
        return (_a = props.required) != null ? _a : formControl == null ? void 0 : formControl.state.required;
      },
      get disabled() {
        var _a;
        return (_a = props.disabled) != null ? _a : formControl == null ? void 0 : formControl.state.disabled;
      },
      get invalid() {
        var _a;
        return (_a = props.invalid) != null ? _a : formControl == null ? void 0 : formControl.state.invalid;
      },
      get readOnly() {
        var _a;
        return (_a = props.readOnly) != null ? _a : formControl == null ? void 0 : formControl.state.readOnly;
      },
      get ["aria-required"]() {
        return this.required ? true : void 0;
      },
      get ["aria-disabled"]() {
        return this.disabled ? true : void 0;
      },
      get ["aria-invalid"]() {
        return this.invalid ? true : void 0;
      },
      get ["aria-readonly"]() {
        return this.readOnly ? true : void 0;
      },
      get ["aria-describedby"]() {
        const labelIds = props["aria-describedby"] ? [props["aria-describedby"]] : [];
        if ((formControl == null ? void 0 : formControl.state.hasErrorMessage) && (formControl == null ? void 0 : formControl.state.invalid)) {
          labelIds.push(formControl.state.errorMessageId);
        }
        if (formControl == null ? void 0 : formControl.state.hasHelperText) {
          labelIds.push(formControl.state.helperTextId);
        }
        return labelIds.join(" ") || void 0;
      },
      get onFocus() {
        return focusHandler;
      },
      get onBlur() {
        return blurHandler;
      }
    });
    return state;
  }
  const _tmpl$$9 = /* @__PURE__ */ template(`<svg><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" stroke="currentColor" stroke-width="1" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`, 4, true), _tmpl$2$4 = /* @__PURE__ */ template(`<svg><path d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z" fill="currentColor" stroke="currentColor" stroke-width="1" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`, 4, true);
  createIcon({
    viewBox: "0 0 15 15",
    path: () => _tmpl$$9.cloneNode(true)
  });
  createIcon({
    viewBox: "0 0 15 15",
    path: () => _tmpl$2$4.cloneNode(true)
  });
  const growAndShrink = keyframes({
    "0%": {
      strokeDasharray: "1, 400",
      strokeDashoffset: "0"
    },
    "50%": {
      strokeDasharray: "400, 400",
      strokeDashoffset: "-100"
    },
    "100%": {
      strokeDasharray: "400, 400",
      strokeDashoffset: "-260"
    }
  });
  css({
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    verticalAlign: "middle"
  });
  css({
    fill: "transparent",
    stroke: "currentColor"
  });
  css({
    position: "absolute",
    top: 0,
    left: 0,
    variants: {
      spin: {
        true: {
          animation: `${spin} 2s linear infinite`
        }
      }
    }
  });
  css({
    fill: "transparent",
    stroke: "currentColor",
    opacity: 1,
    variants: {
      hidden: {
        true: {
          opacity: 0
        }
      },
      withRoundCaps: {
        true: { strokeLinecap: "round" }
      },
      indeterminate: {
        true: {
          animation: `${growAndShrink} 2s linear infinite`
        },
        false: {
          strokeDashoffset: 66,
          transitionProperty: "stroke-dasharray, stroke, opacity",
          transitionDuration: "600ms",
          transitionTimingFunction: "ease"
        }
      }
    }
  });
  css({
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    color: "$neutral12",
    fontSize: "$xs",
    lineHeight: "$none",
    fontWeight: "$bold",
    textAlign: "center",
    transform: "translate(-50%, -50%)"
  });
  const _tmpl$$8 = /* @__PURE__ */ template(`<svg><path fill="currentColor" d="M2.64 1.27L7.5 6.13l4.84-4.84A.92.92 0 0 1 13 1a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l4.89 4.89A.9.9 0 0 1 14 13a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-4.85 4.85A.92.92 0 0 1 2 14a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L1.27 2.61A.9.9 0 0 1 1 2a1 1 0 0 1 1-1c.24.003.47.1.64.27z"></path></svg>`, 4, true);
  createIcon({
    viewBox: "0 0 15 15",
    path: () => _tmpl$$8.cloneNode(true)
  });
  css({
    appearance: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    outline: "none",
    borderWidth: 0,
    borderRadius: "$sm",
    backgroundColor: "transparent",
    padding: 0,
    color: "currentColor",
    cursor: "pointer",
    userSelect: "none",
    transition: "color 250ms, background-color 250ms",
    "&:disbaled": {
      opacity: "0.5",
      cursor: "not-allowed",
      boxShadow: "none"
    },
    "&:hover": {
      backgroundColor: "$closeButtonHoverBackground"
    },
    "&:active": {
      backgroundColor: "$closeButtonActiveBackground"
    },
    "&:focus": {
      outline: "none",
      boxShadow: "$outline"
    },
    variants: {
      size: {
        sm: {
          boxSize: "24px",
          fontSize: "10px"
        },
        md: {
          boxSize: "32px",
          fontSize: "12px"
        },
        lg: {
          boxSize: "40px",
          fontSize: "16px"
        }
      }
    }
  });
  css({
    width: "100%",
    "@sm": { maxWidth: "$containerSm" },
    "@md": { maxWidth: "$containerMd" },
    "@lg": { maxWidth: "$containerLg" },
    "@xl": { maxWidth: "$containerXl" },
    "@2xl": { maxWidth: "$container2xl" },
    variants: {
      centered: {
        true: {
          mx: "auto"
        }
      },
      centerContent: {
        true: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }
      }
    }
  });
  css({
    border: 0,
    borderColor: "currentColor",
    variants: {
      variant: {
        solid: {
          borderStyle: "solid"
        },
        dashed: {
          borderStyle: "dashed"
        },
        dotted: {
          borderStyle: "dotted"
        }
      },
      orientation: {
        vertical: {
          height: "100%"
        },
        horizontal: {
          width: "100%"
        }
      }
    }
  });
  const textStyles = css({
    variants: {
      size: {
        xs: {
          fontSize: "$xs",
          lineHeight: "$4"
        },
        sm: {
          fontSize: "$sm",
          lineHeight: "$5"
        },
        base: {
          fontSize: "$base",
          lineHeight: "$6"
        },
        lg: {
          fontSize: "$lg",
          lineHeight: "$7"
        },
        xl: {
          fontSize: "$xl",
          lineHeight: "$7"
        },
        "2xl": {
          fontSize: "$2xl",
          lineHeight: "$8"
        },
        "3xl": {
          fontSize: "$3xl",
          lineHeight: "$9"
        },
        "4xl": {
          fontSize: "$4xl",
          lineHeight: "$10"
        },
        "5xl": {
          fontSize: "$5xl",
          lineHeight: "$none"
        },
        "6xl": {
          fontSize: "$6xl",
          lineHeight: "$none"
        },
        "7xl": {
          fontSize: "$7xl",
          lineHeight: "$none"
        },
        "8xl": {
          fontSize: "$8xl",
          lineHeight: "$none"
        },
        "9xl": {
          fontSize: "$9xl",
          lineHeight: "$none"
        }
      }
    }
  });
  css(textStyles, {
    fontWeight: "$semibold"
  });
  css({
    borderRadius: "$md",
    borderColor: "$neutral7",
    borderWidth: "1px",
    borderBottomWidth: "3px",
    backgroundColor: "$neutral2",
    px: "0.4em",
    fontFamily: "$mono",
    fontSize: "0.8em",
    fontWeight: "$bold",
    lineHeight: "$normal",
    whiteSpace: "nowrap"
  });
  css({
    listStyleType: "none"
  });
  css({
    marginEnd: "0.5rem"
  });
  function useClickOutside(props) {
    const [state, setState] = createStore({
      isPointerDown: false,
      ignoreEmulatedMouseEvents: false
    });
    const onPointerDown = (e2) => {
      if (isValidEvent(e2, props.element())) {
        setState("isPointerDown", true);
      }
    };
    const onMouseUp = (event) => {
      if (state.ignoreEmulatedMouseEvents) {
        setState("ignoreEmulatedMouseEvents", false);
        return;
      }
      if (state.isPointerDown && props.handler && isValidEvent(event, props.element())) {
        setState("isPointerDown", false);
        props.handler(event);
      }
    };
    const onTouchEnd = (event) => {
      setState("ignoreEmulatedMouseEvents", true);
      if (props.handler && state.isPointerDown && isValidEvent(event, props.element())) {
        setState("isPointerDown", false);
        props.handler(event);
      }
    };
    onMount(() => {
      const doc = getOwnerDocument(props.element());
      doc.addEventListener("mousedown", onPointerDown, true);
      doc.addEventListener("mouseup", onMouseUp, true);
      doc.addEventListener("touchstart", onPointerDown, true);
      doc.addEventListener("touchend", onTouchEnd, true);
    });
    onCleanup(() => {
      const doc = getOwnerDocument(props.element());
      doc.removeEventListener("mousedown", onPointerDown, true);
      doc.removeEventListener("mouseup", onMouseUp, true);
      doc.removeEventListener("touchstart", onPointerDown, true);
      doc.removeEventListener("touchend", onTouchEnd, true);
    });
  }
  function ClickOutside(props) {
    const resolvedChildren = children(() => props.children);
    useClickOutside({
      element: () => resolvedChildren(),
      handler: (event) => props.onClickOutside(event)
    });
    return resolvedChildren;
  }
  const stackStyles = css({
    display: "flex"
  });
  const hopeStackClass = "hope-stack";
  function Stack(props) {
    const [local, others] = splitProps(props, ["class", "direction", "wrap", "spacing"]);
    const classes = () => classNames(local.class, hopeStackClass, stackStyles());
    return createComponent(Box, mergeProps({
      get ["class"]() {
        return classes();
      },
      get flexDirection() {
        return local.direction;
      },
      get flexWrap() {
        return local.wrap;
      },
      get gap() {
        return local.spacing;
      }
    }, others));
  }
  Stack.toString = () => createClassSelector(hopeStackClass);
  function HStack(props) {
    const [local, others] = splitProps(props, ["spacing"]);
    return createComponent(Stack, mergeProps({
      direction: "row",
      alignItems: "center",
      get columnGap() {
        return local.spacing;
      }
    }, others));
  }
  HStack.toString = () => createClassSelector(hopeStackClass);
  const indeterminateProgress = keyframes({
    "0%": { left: "-40%" },
    "100%": { left: "100%" }
  });
  const stripe = keyframes({
    from: { backgroundPosition: "1rem 0" },
    to: { backgroundPosition: "0 0" }
  });
  css({
    position: "relative",
    overflow: "hidden",
    variants: {
      size: {
        xs: {
          height: "$1",
          fontSize: "4px"
        },
        sm: {
          height: "$2",
          fontSize: "6px"
        },
        md: {
          height: "$3",
          fontSize: "8px"
        },
        lg: {
          height: "$4",
          fontSize: "10px"
        }
      }
    }
  });
  css({
    position: "relative",
    height: "100%",
    transition: "width 600ms ease",
    variants: {
      striped: {
        true: {}
      },
      animated: {
        true: {}
      },
      indeterminate: {
        true: {
          position: "absolute",
          willChange: "left",
          minWidth: "50%",
          animation: `${indeterminateProgress} 1200ms ease infinite normal none running`
        }
      }
    },
    compoundVariants: [
      {
        indeterminate: false,
        striped: true,
        css: {
          backgroundImage: "linear-gradient(45deg, $colors$progressStripe 25%, transparent 25%, transparent 50%, $colors$progressStripe 50%,  $colors$progressStripe 75%, transparent 75%, transparent)",
          backgroundSize: "1rem 1rem"
        }
      },
      {
        indeterminate: false,
        striped: true,
        animated: true,
        css: {
          animation: `${stripe} 750ms linear infinite`
        }
      }
    ]
  });
  css({
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    color: "$neutral12",
    lineHeight: "$none",
    fontWeight: "$bold",
    textAlign: "center",
    transform: "translate(-50%, -50%)"
  });
  const radioWrapperStyles = css(toggleWrapperStyles, {
    variants: {
      labelPlacement: {
        start: {
          flexDirection: "row-reverse"
        },
        end: {
          flexDirection: "row"
        }
      }
    }
  });
  const radioLabelStyles = css(toggleControlLabelStyles);
  const radioControlStyles = css(toggleControlStyles, {
    borderRadius: "$full",
    "&[data-checked]::before": {
      content: "",
      display: "inline-block",
      position: "relative",
      boxSize: "calc(50% + 1px)",
      borderRadius: "$full",
      backgroundColor: "$loContrast"
    }
  });
  const hopeRadioGroupClass = "hope-radio-group";
  function RadioGroup(props) {
    const defaultRadioName = `hope-radio-group-${createUniqueId()}--radio`;
    const theme = useStyleConfig().Radio;
    const [state, setState] = createStore({
      _value: props.defaultValue,
      get isControlled() {
        return props.value !== void 0;
      },
      get value() {
        return this.isControlled ? props.value : this._value;
      },
      get name() {
        var _a;
        return (_a = props.name) != null ? _a : defaultRadioName;
      },
      get required() {
        return props.required;
      },
      get disabled() {
        return props.disabled;
      },
      get invalid() {
        return props.invalid;
      },
      get readOnly() {
        return props.readOnly;
      },
      get variant() {
        var _a, _b, _c;
        return (_c = props.variant) != null ? _c : (_b = (_a = theme == null ? void 0 : theme.defaultProps) == null ? void 0 : _a.group) == null ? void 0 : _b.variant;
      },
      get colorScheme() {
        var _a, _b, _c;
        return (_c = props.colorScheme) != null ? _c : (_b = (_a = theme == null ? void 0 : theme.defaultProps) == null ? void 0 : _a.group) == null ? void 0 : _b.colorScheme;
      },
      get size() {
        var _a, _b, _c;
        return (_c = props.size) != null ? _c : (_b = (_a = theme == null ? void 0 : theme.defaultProps) == null ? void 0 : _a.group) == null ? void 0 : _b.size;
      }
    });
    const [local, _, others] = splitProps(props, ["class", "onChange"], ["value", "defaultValue", "name", "required", "disabled", "readOnly", "invalid"]);
    const onChange = (event) => {
      var _a;
      const value = event.target.value;
      setState("_value", value);
      (_a = local.onChange) == null ? void 0 : _a.call(local, String(value));
    };
    const classes = () => classNames(local.class, hopeRadioGroupClass);
    const context = {
      state,
      onChange
    };
    return createComponent(RadioGroupContext.Provider, {
      value: context,
      get children() {
        return createComponent(Box, mergeProps({
          role: "radiogroup",
          get ["class"]() {
            return classes();
          },
          get __baseStyle() {
            var _a;
            return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.group;
          }
        }, others));
      }
    });
  }
  RadioGroup.toString = () => createClassSelector(hopeRadioGroupClass);
  const RadioGroupContext = createContext();
  function useRadioGroupContext() {
    return useContext(RadioGroupContext);
  }
  const _tmpl$$6 = /* @__PURE__ */ template(`<input type="radio">`, 1);
  const hopeRadioClass = "hope-radio";
  const hopeRadioInputClass = "hope-radio__input";
  const hopeRadioControlClass = "hope-radio__control";
  const hopeRadioLabelClass = "hope-radio__label";
  function Radio(props) {
    const defaultId = `hope-radio-${createUniqueId()}`;
    const theme = useStyleConfig().Radio;
    const formControlContext = useFormControlContext();
    const radioGroupContext = useRadioGroupContext();
    const formControlProps = useFormControl(props);
    const [state, setState] = createStore({
      _checked: !!props.defaultChecked,
      isFocused: false,
      get isControlled() {
        return props.checked !== void 0;
      },
      get checked() {
        if (radioGroupContext) {
          const radioGroupValue = radioGroupContext.state.value;
          return radioGroupValue != null ? String(props.value) === String(radioGroupValue) : false;
        }
        return this.isControlled ? !!props.checked : this._checked;
      },
      get variant() {
        var _a, _b, _c, _d, _e, _f;
        return (_f = (_e = (_b = props.variant) != null ? _b : (_a = radioGroupContext == null ? void 0 : radioGroupContext.state) == null ? void 0 : _a.variant) != null ? _e : (_d = (_c = theme == null ? void 0 : theme.defaultProps) == null ? void 0 : _c.root) == null ? void 0 : _d.variant) != null ? _f : "outline";
      },
      get colorScheme() {
        var _a, _b, _c, _d, _e, _f;
        return (_f = (_e = (_b = props.colorScheme) != null ? _b : (_a = radioGroupContext == null ? void 0 : radioGroupContext.state) == null ? void 0 : _a.colorScheme) != null ? _e : (_d = (_c = theme == null ? void 0 : theme.defaultProps) == null ? void 0 : _c.root) == null ? void 0 : _d.colorScheme) != null ? _f : "primary";
      },
      get size() {
        var _a, _b, _c, _d, _e, _f;
        return (_f = (_e = (_b = props.size) != null ? _b : (_a = radioGroupContext == null ? void 0 : radioGroupContext.state) == null ? void 0 : _a.size) != null ? _e : (_d = (_c = theme == null ? void 0 : theme.defaultProps) == null ? void 0 : _c.root) == null ? void 0 : _d.size) != null ? _f : "md";
      },
      get labelPlacement() {
        var _a, _b, _c, _d, _e, _f;
        return (_f = (_e = (_b = props.labelPlacement) != null ? _b : (_a = radioGroupContext == null ? void 0 : radioGroupContext.state) == null ? void 0 : _a.labelPlacement) != null ? _e : (_d = (_c = theme == null ? void 0 : theme.defaultProps) == null ? void 0 : _c.root) == null ? void 0 : _d.labelPlacement) != null ? _f : "end";
      },
      get id() {
        var _a;
        if (formControlContext && !radioGroupContext) {
          return formControlProps.id;
        }
        return (_a = props.id) != null ? _a : defaultId;
      },
      get name() {
        var _a;
        return (_a = props.name) != null ? _a : radioGroupContext == null ? void 0 : radioGroupContext.state.name;
      },
      get value() {
        return props.value;
      },
      get required() {
        var _a;
        return (_a = formControlProps.required) != null ? _a : radioGroupContext == null ? void 0 : radioGroupContext.state.required;
      },
      get disabled() {
        var _a;
        return (_a = formControlProps.disabled) != null ? _a : radioGroupContext == null ? void 0 : radioGroupContext.state.disabled;
      },
      get invalid() {
        var _a;
        return (_a = formControlProps.invalid) != null ? _a : radioGroupContext == null ? void 0 : radioGroupContext.state.invalid;
      },
      get readOnly() {
        var _a;
        return (_a = formControlProps.readOnly) != null ? _a : radioGroupContext == null ? void 0 : radioGroupContext.state.readOnly;
      },
      get ["aria-required"]() {
        return this.required ? true : void 0;
      },
      get ["aria-disabled"]() {
        return this.disabled ? true : void 0;
      },
      get ["aria-invalid"]() {
        return this.invalid ? true : void 0;
      },
      get ["aria-readonly"]() {
        return this.readOnly ? true : void 0;
      },
      get ["aria-label"]() {
        return props["aria-label"];
      },
      get ["aria-labelledby"]() {
        return props["aria-labelledby"];
      },
      get ["aria-describedby"]() {
        return props["aria-describedby"];
      },
      get ["data-focus"]() {
        return this.isFocused ? "" : void 0;
      },
      get ["data-checked"]() {
        return this.checked ? "" : void 0;
      },
      get ["data-required"]() {
        return this.required ? "" : void 0;
      },
      get ["data-disabled"]() {
        return this.disabled ? "" : void 0;
      },
      get ["data-invalid"]() {
        return this.invalid ? "" : void 0;
      },
      get ["data-readonly"]() {
        return this.readOnly ? "" : void 0;
      }
    });
    const [local, _, others] = splitProps(props, ["class", "children", "ref", "tabIndex", "onChange"], ["variant", "colorScheme", "size", "labelPlacement", "id", "name", "value", "checked", "defaultChecked", "required", "disabled", "invalid", "readOnly", "onFocus", "onBlur"]);
    const onChange = (event) => {
      if (state.readOnly || state.disabled) {
        event.preventDefault();
        return;
      }
      if (!state.isControlled) {
        const target = event.target;
        setState("_checked", target.checked);
      }
      chainHandlers(radioGroupContext == null ? void 0 : radioGroupContext.onChange, local.onChange)(event);
    };
    const onFocus = (event) => {
      setState("isFocused", true);
      callHandler(formControlProps.onFocus, event);
    };
    const onBlur = (event) => {
      setState("isFocused", false);
      callHandler(formControlProps.onBlur, event);
    };
    const wrapperClasses = () => {
      return classNames(local.class, hopeRadioClass, radioWrapperStyles({
        size: state.size,
        labelPlacement: state.labelPlacement
      }));
    };
    const inputClasses = () => classNames(hopeRadioInputClass, visuallyHiddenStyles());
    const controlClasses = () => {
      return classNames(hopeRadioControlClass, radioControlStyles({
        variant: state.variant,
        colorScheme: state.colorScheme,
        size: state.size
      }));
    };
    const labelClasses = () => {
      return classNames(hopeRadioLabelClass, radioLabelStyles());
    };
    const context = {
      state,
      onChange,
      onFocus,
      onBlur
    };
    return createComponent(RadioContext.Provider, {
      value: context,
      get children() {
        return createComponent(hope.label, mergeProps({
          get ["class"]() {
            return wrapperClasses();
          },
          get __baseStyle() {
            var _a;
            return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.root;
          },
          get ["for"]() {
            return state.id;
          },
          "data-group": true,
          get ["data-focus"]() {
            return state["data-focus"];
          },
          get ["data-checked"]() {
            return state["data-checked"];
          },
          get ["data-required"]() {
            return state["data-required"];
          },
          get ["data-disabled"]() {
            return state["data-disabled"];
          },
          get ["data-invalid"]() {
            return state["data-invalid"];
          },
          get ["data-readonly"]() {
            return state["data-readonly"];
          }
        }, others, {
          get children() {
            return [(() => {
              const _el$ = _tmpl$$6.cloneNode(true);
              _el$.addEventListener("blur", onBlur);
              _el$.addEventListener("focus", onFocus);
              _el$.addEventListener("change", onChange);
              const _ref$ = local.ref;
              typeof _ref$ === "function" ? _ref$(_el$) : local.ref = _el$;
              createRenderEffect((_p$) => {
                const _v$ = inputClasses(), _v$2 = local.tabIndex, _v$3 = state.value, _v$4 = state.id, _v$5 = state.name, _v$6 = state.checked, _v$7 = state.required, _v$8 = state.disabled, _v$9 = state.readOnly, _v$10 = state["aria-required"], _v$11 = state["aria-disabled"], _v$12 = state["aria-invalid"], _v$13 = state["aria-readonly"], _v$14 = state["aria-label"], _v$15 = state["aria-labelledby"], _v$16 = state["aria-describedby"];
                _v$ !== _p$._v$ && (_el$.className = _p$._v$ = _v$);
                _v$2 !== _p$._v$2 && setAttribute(_el$, "tabindex", _p$._v$2 = _v$2);
                _v$3 !== _p$._v$3 && (_el$.value = _p$._v$3 = _v$3);
                _v$4 !== _p$._v$4 && setAttribute(_el$, "id", _p$._v$4 = _v$4);
                _v$5 !== _p$._v$5 && setAttribute(_el$, "name", _p$._v$5 = _v$5);
                _v$6 !== _p$._v$6 && (_el$.checked = _p$._v$6 = _v$6);
                _v$7 !== _p$._v$7 && (_el$.required = _p$._v$7 = _v$7);
                _v$8 !== _p$._v$8 && (_el$.disabled = _p$._v$8 = _v$8);
                _v$9 !== _p$._v$9 && (_el$.readOnly = _p$._v$9 = _v$9);
                _v$10 !== _p$._v$10 && setAttribute(_el$, "aria-required", _p$._v$10 = _v$10);
                _v$11 !== _p$._v$11 && setAttribute(_el$, "aria-disabled", _p$._v$11 = _v$11);
                _v$12 !== _p$._v$12 && setAttribute(_el$, "aria-invalid", _p$._v$12 = _v$12);
                _v$13 !== _p$._v$13 && setAttribute(_el$, "aria-readonly", _p$._v$13 = _v$13);
                _v$14 !== _p$._v$14 && setAttribute(_el$, "aria-label", _p$._v$14 = _v$14);
                _v$15 !== _p$._v$15 && setAttribute(_el$, "aria-labelledby", _p$._v$15 = _v$15);
                _v$16 !== _p$._v$16 && setAttribute(_el$, "aria-describedby", _p$._v$16 = _v$16);
                return _p$;
              }, {
                _v$: void 0,
                _v$2: void 0,
                _v$3: void 0,
                _v$4: void 0,
                _v$5: void 0,
                _v$6: void 0,
                _v$7: void 0,
                _v$8: void 0,
                _v$9: void 0,
                _v$10: void 0,
                _v$11: void 0,
                _v$12: void 0,
                _v$13: void 0,
                _v$14: void 0,
                _v$15: void 0,
                _v$16: void 0
              });
              return _el$;
            })(), createComponent(hope.span, mergeProps({
              "aria-hidden": true,
              get ["class"]() {
                return controlClasses();
              },
              get __baseStyle() {
                var _a;
                return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.control;
              },
              get ["data-focus"]() {
                return state["data-focus"];
              },
              get ["data-checked"]() {
                return state["data-checked"];
              },
              get ["data-required"]() {
                return state["data-required"];
              },
              get ["data-disabled"]() {
                return state["data-disabled"];
              },
              get ["data-invalid"]() {
                return state["data-invalid"];
              },
              get ["data-readonly"]() {
                return state["data-readonly"];
              }
            }, others)), createComponent(hope.span, {
              get ["class"]() {
                return labelClasses();
              },
              get __baseStyle() {
                var _a;
                return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.label;
              },
              get ["data-focus"]() {
                return state["data-focus"];
              },
              get ["data-checked"]() {
                return state["data-checked"];
              },
              get ["data-required"]() {
                return state["data-required"];
              },
              get ["data-disabled"]() {
                return state["data-disabled"];
              },
              get ["data-invalid"]() {
                return state["data-invalid"];
              },
              get ["data-readonly"]() {
                return state["data-readonly"];
              },
              get children() {
                return createComponent(Show, {
                  get when() {
                    return isChildrenFunction(local);
                  },
                  get fallback() {
                    return local.children;
                  },
                  get children() {
                    var _a;
                    return (_a = local.children) == null ? void 0 : _a.call(local, {
                      checked: state.checked
                    });
                  }
                });
              }
            })];
          }
        }));
      }
    });
  }
  Radio.toString = () => createClassSelector(hopeRadioClass);
  const RadioContext = createContext();
  var SelectActions = /* @__PURE__ */ ((SelectActions2) => {
    SelectActions2[SelectActions2["Close"] = 0] = "Close";
    SelectActions2[SelectActions2["SelectAndClose"] = 1] = "SelectAndClose";
    SelectActions2[SelectActions2["First"] = 2] = "First";
    SelectActions2[SelectActions2["Last"] = 3] = "Last";
    SelectActions2[SelectActions2["Next"] = 4] = "Next";
    SelectActions2[SelectActions2["Open"] = 5] = "Open";
    SelectActions2[SelectActions2["Previous"] = 6] = "Previous";
    SelectActions2[SelectActions2["Select"] = 7] = "Select";
    SelectActions2[SelectActions2["Type"] = 8] = "Type";
    return SelectActions2;
  })(SelectActions || {});
  function filterOptions(options = [], filter, exclude = []) {
    return options.filter((option) => {
      if (option.disabled) {
        return false;
      }
      const matches = option.textValue.toLowerCase().indexOf(filter.toLowerCase()) === 0;
      return matches && exclude.indexOf(option.textValue) < 0;
    });
  }
  function getIndexByLetter(options, filter, startIndex = 0) {
    const orderedOptions = [...options.slice(startIndex), ...options.slice(0, startIndex)];
    const firstMatch = filterOptions(orderedOptions, filter)[0];
    const allSameLetter = (array) => array.every((letter) => letter === array[0]);
    if (firstMatch) {
      return options.indexOf(firstMatch);
    } else if (allSameLetter(filter.split(""))) {
      const matches = filterOptions(orderedOptions, filter[0]);
      return options.indexOf(matches[0]);
    } else {
      return -1;
    }
  }
  function getActionFromKey(event, menuOpen) {
    const { key, altKey, ctrlKey, metaKey } = event;
    const openKeys = ["ArrowDown", "ArrowUp", "Enter", " "];
    if (!menuOpen && openKeys.includes(key)) {
      return 5;
    }
    if (key === "Home" || key === "PageUp") {
      return 2;
    }
    if (key === "End" || key === "PageDown") {
      return 3;
    }
    if (key === "Backspace" || key === "Clear" || key.length === 1 && key !== " " && !altKey && !ctrlKey && !metaKey) {
      return 8;
    }
    if (menuOpen) {
      if (key === "ArrowUp" && altKey) {
        return 1;
      } else if (key === "ArrowDown" && !altKey) {
        return 4;
      } else if (key === "ArrowUp") {
        return 6;
      } else if (key === "Escape") {
        return 0;
      } else if (key === "Enter" || key === " ") {
        return 1;
      }
    }
  }
  function calculateActiveIndex(currentIndex, maxIndex, action) {
    switch (action) {
      case 2:
        return 0;
      case 3:
        return maxIndex;
      case 6:
        return Math.max(0, currentIndex - 1);
      case 4:
        return Math.min(maxIndex, currentIndex + 1);
      default:
        return currentIndex;
    }
  }
  function getUpdatedIndex(params) {
    const { currentIndex, maxIndex, initialAction, isOptionDisabled } = params;
    let nextIndex = calculateActiveIndex(currentIndex, maxIndex, initialAction);
    while (isOptionDisabled(nextIndex)) {
      let nextAction = initialAction;
      const isNextIndexFirst = nextIndex === 0;
      const isNextIndexLast = nextIndex === maxIndex;
      if (initialAction === 2) {
        nextAction = 4;
      }
      if (initialAction === 3) {
        nextAction = 6;
      }
      if (initialAction === 6 && isNextIndexFirst) {
        nextIndex = currentIndex;
        break;
      }
      if (initialAction === 4 && isNextIndexLast) {
        nextIndex = currentIndex;
        break;
      }
      nextIndex = calculateActiveIndex(nextIndex, maxIndex, nextAction);
    }
    return nextIndex;
  }
  function isOptionEqual(a2, b2) {
    return String(a2.value) === String(b2.value);
  }
  function Select(props) {
    const defaultBaseId = `hope-select-${createUniqueId()}`;
    const theme = useStyleConfig().Select;
    const formControlProps = useFormControl(props);
    const [initialized, setInitialized] = createSignal(false);
    const [_options, _setOptions] = createSignal([]);
    const [state, setState] = createStore({
      get isControlled() {
        return props.value !== void 0;
      },
      get value() {
        var _a;
        if (this.isControlled) {
          return props.value;
        }
        if (this.multiple) {
          return this.selectedOptions.map((option) => option.value);
        }
        return (_a = this.selectedOptions[0].value) != null ? _a : void 0;
      },
      get multiple() {
        return props.multiple;
      },
      get baseId() {
        var _a, _b;
        return (_b = (_a = props.id) != null ? _a : formControlProps.id) != null ? _b : defaultBaseId;
      },
      get triggerId() {
        return `${this.baseId}-trigger`;
      },
      get listboxId() {
        return `${this.baseId}-listbox`;
      },
      get labelIdPrefix() {
        return `${this.baseId}-label`;
      },
      get optionIdPrefix() {
        return `${this.baseId}-option`;
      },
      get disabled() {
        var _a;
        return (_a = props.disabled) != null ? _a : formControlProps.disabled;
      },
      get invalid() {
        var _a;
        return (_a = props.invalid) != null ? _a : formControlProps.invalid;
      },
      get variant() {
        var _a, _b, _c, _d;
        return (_d = (_c = props.variant) != null ? _c : (_b = (_a = theme == null ? void 0 : theme.defaultProps) == null ? void 0 : _a.root) == null ? void 0 : _b.variant) != null ? _d : "outline";
      },
      get size() {
        var _a, _b, _c, _d;
        return (_d = (_c = props.size) != null ? _c : (_b = (_a = theme == null ? void 0 : theme.defaultProps) == null ? void 0 : _a.root) == null ? void 0 : _b.size) != null ? _d : "md";
      },
      get motionPreset() {
        var _a, _b, _c, _d;
        return (_d = (_c = props.motionPreset) != null ? _c : (_b = (_a = theme == null ? void 0 : theme.defaultProps) == null ? void 0 : _a.root) == null ? void 0 : _b.motionPreset) != null ? _d : "fade-in-top";
      },
      get activeDescendantId() {
        return this.opened ? `${this.optionIdPrefix}-${this.activeIndex}` : void 0;
      },
      get hasSelectedOptions() {
        return this.selectedOptions.length > 0;
      },
      get options() {
        return _options();
      },
      selectedOptions: [],
      opened: false,
      activeIndex: 0,
      ignoreBlur: false,
      searchString: "",
      searchTimeoutId: void 0
    });
    let triggerRef;
    let contentRef;
    let listboxRef;
    let cleanupContentAutoUpdate;
    const updateContentPosition = async () => {
      var _a, _b, _c, _d;
      if (!triggerRef || !contentRef) {
        return;
      }
      const {
        x: x2,
        y: y2
      } = await N(triggerRef, contentRef, {
        placement: "bottom",
        middleware: [T$1((_d = (_c = props.offset) != null ? _c : (_b = (_a = theme == null ? void 0 : theme.defaultProps) == null ? void 0 : _a.root) == null ? void 0 : _b.offset) != null ? _d : 5), b$1(), D$1(), k({
          apply({
            reference
          }) {
            if (!contentRef) {
              return;
            }
            Object.assign(contentRef.style, {
              width: `${reference.width}px`
            });
          }
        })]
      });
      if (!contentRef) {
        return;
      }
      Object.assign(contentRef.style, {
        left: `${Math.round(x2)}px`,
        top: `${Math.round(y2)}px`
      });
    };
    const getSearchString = (char) => {
      if (state.searchTimeoutId) {
        window.clearTimeout(state.searchTimeoutId);
      }
      const searchTimeoutId = window.setTimeout(() => {
        setState("searchString", "");
      }, 500);
      setState("searchTimeoutId", searchTimeoutId);
      setState("searchString", (searchString) => searchString += char);
      return state.searchString;
    };
    const focusTrigger = () => {
      triggerRef == null ? void 0 : triggerRef.focus();
    };
    const getDefaultSelectedValues = () => {
      if (state.isControlled) {
        if (props.value == null) {
          return [];
        }
        return isArray(props.value) ? props.value : [props.value];
      } else {
        if (props.defaultValue == null) {
          return [];
        }
        return isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue];
      }
    };
    const initSelectedOptions = () => {
      if (initialized()) {
        return;
      }
      const selectedOptions = getDefaultSelectedValues().map((value) => state.options.find((option) => option.value === value)).filter(Boolean);
      setState("selectedOptions", (prev) => [...prev, ...selectedOptions]);
      setInitialized(true);
    };
    const onOptionChange = (index2) => {
      setState("activeIndex", index2);
    };
    const isOptionSelected = (option) => {
      if (state.selectedOptions.length <= 0) {
        return false;
      }
      if (state.multiple) {
        return !!state.selectedOptions.find((selectedOption) => isOptionEqual(option, selectedOption));
      } else {
        return isOptionEqual(option, state.selectedOptions[0]);
      }
    };
    const removeFromSelectedOptions = (selectedOption) => {
      setState("selectedOptions", (prev) => prev.filter((option) => !isOptionEqual(selectedOption, option)));
    };
    const setSelectedOptions = (index2) => {
      const newSelectedOption = state.options[index2];
      if (state.multiple) {
        if (isOptionSelected(newSelectedOption)) {
          removeFromSelectedOptions(newSelectedOption);
        } else {
          setState("selectedOptions", (prev) => [...prev, newSelectedOption]);
        }
      } else {
        setState("selectedOptions", [newSelectedOption]);
      }
    };
    const getSelectedValue = () => {
      var _a;
      if (state.multiple) {
        return state.selectedOptions.map((item) => item.value);
      } else {
        return (_a = state.selectedOptions[0].value) != null ? _a : void 0;
      }
    };
    const selectOption = (index2) => {
      var _a;
      onOptionChange(index2);
      setSelectedOptions(index2);
      (_a = props.onChange) == null ? void 0 : _a.call(props, getSelectedValue());
    };
    const unselectOption = (selectedOption) => {
      var _a;
      removeFromSelectedOptions(selectedOption);
      (_a = props.onChange) == null ? void 0 : _a.call(props, getSelectedValue());
      focusTrigger();
    };
    const isOptionDisabledCallback = (index2) => {
      return state.options[index2].disabled;
    };
    const onTriggerBlur = (event) => {
      if (contains(triggerRef, getRelatedTarget(event))) {
        return;
      }
      if (state.ignoreBlur) {
        setState("ignoreBlur", false);
        return;
      }
      if (state.opened) {
        updateOpeningState(false, false);
      }
    };
    const onTriggerClick = () => {
      if (formControlProps.readOnly) {
        return;
      }
      updateOpeningState(!state.opened, false);
    };
    const onTriggerKeyDown = (event) => {
      if (formControlProps.readOnly) {
        return;
      }
      const {
        key
      } = event;
      if (state.hasSelectedOptions && state.multiple && key === "Backspace") {
        unselectOption(state.selectedOptions[state.selectedOptions.length - 1]);
        return;
      }
      const max = state.options.length - 1;
      const action = getActionFromKey(event, state.opened);
      switch (action) {
        case SelectActions.Last:
        case SelectActions.First:
          updateOpeningState(true);
        case SelectActions.Next:
        case SelectActions.Previous:
          event.preventDefault();
          return onOptionChange(getUpdatedIndex({
            currentIndex: state.activeIndex,
            maxIndex: max,
            initialAction: action,
            isOptionDisabled: isOptionDisabledCallback
          }));
        case SelectActions.SelectAndClose:
          event.preventDefault();
          selectOption(state.activeIndex);
          return state.multiple ? void 0 : updateOpeningState(false);
        case SelectActions.Close:
          event.preventDefault();
          return updateOpeningState(false);
        case SelectActions.Type:
          return onTriggerType(key);
        case SelectActions.Open:
          event.preventDefault();
          return updateOpeningState(true);
      }
    };
    const onTriggerType = (letter) => {
      if (formControlProps.readOnly) {
        return;
      }
      updateOpeningState(true);
      const searchString = getSearchString(letter);
      const searchIndex = getIndexByLetter(state.options, searchString, state.activeIndex + 1);
      if (searchIndex >= 0) {
        onOptionChange(searchIndex);
      } else {
        window.clearTimeout(state.searchTimeoutId);
        setState("searchString", "");
      }
    };
    const onOptionClick = (index2) => {
      if (state.options[index2].disabled) {
        focusTrigger();
        return;
      }
      selectOption(index2);
      if (state.multiple) {
        focusTrigger();
      } else {
        updateOpeningState(false);
      }
    };
    const onOptionMouseMove = (index2) => {
      if (state.activeIndex === index2) {
        return;
      }
      onOptionChange(index2);
    };
    const onOptionMouseDown = () => {
      setState("ignoreBlur", true);
    };
    const setDefaultActiveOption = () => {
      if (state.selectedOptions.length > 0) {
        setState("activeIndex", state.options.findIndex((option) => isOptionSelected(option)));
      } else {
        setState("activeIndex", 0);
      }
    };
    const scheduleContentPositionAutoUpdate = () => {
      if (state.opened) {
        updateContentPosition();
        if (triggerRef && contentRef) {
          cleanupContentAutoUpdate = D(triggerRef, contentRef, updateContentPosition);
        }
      } else {
        cleanupContentAutoUpdate == null ? void 0 : cleanupContentAutoUpdate();
      }
    };
    const updateOpeningState = (opened, callFocus = true) => {
      if (state.opened === opened) {
        return;
      }
      setState("opened", opened);
      setDefaultActiveOption();
      scheduleContentPositionAutoUpdate();
      callFocus && focusTrigger();
    };
    const onListboxMouseLeave = () => {
      onOptionChange(-1);
    };
    const onContentClickOutside = (target) => {
      if (contains(triggerRef, target)) {
        return;
      }
      updateOpeningState(false, false);
    };
    const isOptionActiveDescendant = (index2) => {
      return index2 === state.activeIndex;
    };
    const assignTriggerRef = (el) => {
      triggerRef = el;
    };
    const assignContentRef = (el) => {
      contentRef = el;
    };
    const assignListboxRef = (el) => {
      listboxRef = el;
    };
    const scrollToOption = (optionRef) => {
      if (!listboxRef) {
        return;
      }
      if (isScrollable(listboxRef)) {
        maintainScrollVisibility(optionRef, listboxRef);
      }
    };
    const registerOption = (optionData) => {
      const index2 = state.options.findIndex((option) => isOptionEqual(option, optionData));
      if (index2 != -1) {
        return index2;
      }
      const updatedOptions = _setOptions((prev) => [...prev, optionData]);
      return updatedOptions.length - 1;
    };
    createEffect(on(() => state.options, () => initSelectedOptions(), {
      defer: true
    }));
    createEffect(on(() => props.value, () => {
      if (!state.isControlled) {
        return;
      }
      const controlledValues = isArray(props.value) ? props.value : [props.value];
      const selectedOptions = controlledValues.map((value) => state.options.find((option) => option.value === value)).filter(Boolean);
      setState("selectedOptions", selectedOptions);
    }, {
      defer: true
    }));
    createEffect(on(() => state.opened, (newValue) => {
      if (!newValue) {
        return;
      }
      setTimeout(() => {
        const firstSelectedOption = listboxRef == null ? void 0 : listboxRef.querySelector("[role='option'][aria-selected='true']");
        if (firstSelectedOption) {
          scrollToOption(firstSelectedOption);
        }
      }, 0);
    }));
    const context = {
      state,
      isOptionSelected,
      unselectOption,
      isOptionActiveDescendant,
      formControlProps,
      assignTriggerRef,
      assignContentRef,
      assignListboxRef,
      registerOption,
      scrollToOption,
      onContentClickOutside,
      onTriggerBlur,
      onTriggerClick,
      onTriggerKeyDown,
      onOptionClick,
      onOptionMouseMove,
      onOptionMouseDown,
      onListboxMouseLeave
    };
    return createComponent(SelectContext.Provider, {
      value: context,
      get children() {
        return props.children;
      }
    });
  }
  const SelectContext = createContext();
  function useSelectContext() {
    const context = useContext(SelectContext);
    if (!context) {
      throw new Error("[Hope UI]: useSelectContext must be used within a `<Select />` component");
    }
    return context;
  }
  const hopeSelectContentClass = "hope-select__content";
  function SelectContent(props) {
    const theme = useStyleConfig().Select;
    const selectContext = useSelectContext();
    const [local, others] = splitProps(props, ["ref", "class", "children"]);
    const [isPortalMounted, setIsPortalMounted] = createSignal(false);
    createEffect(on(() => selectContext.state.opened, () => {
      if (selectContext.state.opened) {
        setIsPortalMounted(true);
      } else {
        selectContext.state.motionPreset === "none" && setIsPortalMounted(false);
      }
    }));
    const unmountPortal = () => setIsPortalMounted(false);
    const classes = () => classNames(local.class, hopeSelectContentClass, selectContentStyles());
    const resolvedChildren = children(() => local.children);
    const assignContentRef = (el) => {
      selectContext.assignContentRef(el);
      if (isFunction(local.ref)) {
        local.ref(el);
      } else {
        local.ref = el;
      }
    };
    const onClickOutside = (event) => {
      selectContext.onContentClickOutside(event.target);
    };
    const transitionName = () => {
      switch (selectContext.state.motionPreset) {
        case "fade-in-top":
          return selectTransitionName.fadeInTop;
        case "none":
          return "hope-none";
      }
    };
    return createComponent(Show, {
      get when() {
        return isPortalMounted();
      },
      get children() {
        return createComponent(Portal, {
          get children() {
            return createComponent(Transition, {
              get name() {
                return transitionName();
              },
              appear: true,
              onAfterExit: unmountPortal,
              get children() {
                return createComponent(Show, {
                  get when() {
                    return selectContext.state.opened;
                  },
                  get children() {
                    return createComponent(ClickOutside, {
                      onClickOutside,
                      get children() {
                        return createComponent(Box, mergeProps({
                          ref: assignContentRef,
                          get ["class"]() {
                            return classes();
                          },
                          get __baseStyle() {
                            var _a;
                            return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.content;
                          }
                        }, others, {
                          get children() {
                            return resolvedChildren();
                          }
                        }));
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
  SelectContent.toString = () => createClassSelector(hopeSelectContentClass);
  const _tmpl$$5 = /* @__PURE__ */ template(`<svg><path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`, 4, true);
  const IconSelector = createIcon({
    viewBox: "0 0 15 15",
    path: () => _tmpl$$5.cloneNode(true)
  });
  const hopeSelectIconClass = "hope-select__icon";
  function SelectIcon(props) {
    const theme = useStyleConfig().Select;
    const selectContext = useSelectContext();
    const [local, others] = splitProps(props, ["class", "rotateOnOpen"]);
    const classes = () => {
      return classNames(local.class, hopeSelectIconClass, selectIconStyles(local.rotateOnOpen ? {
        opened: selectContext.state.opened
      } : void 0));
    };
    return createComponent(IconSelector, mergeProps({
      "aria-hidden": true,
      get ["class"]() {
        return classes();
      },
      get __baseStyle() {
        var _a;
        return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.icon;
      }
    }, others));
  }
  SelectIcon.toString = () => createClassSelector(hopeSelectIconClass);
  const hopeSelectListboxClass = "hope-select__listbox";
  function SelectListbox(props) {
    const theme = useStyleConfig().Select;
    const selectContext = useSelectContext();
    const [local, others] = splitProps(props, ["ref", "class"]);
    const classes = () => classNames(local.class, hopeSelectListboxClass, selectListboxStyles());
    const assignListboxRef = (el) => {
      selectContext.assignListboxRef(el);
      if (isFunction(local.ref)) {
        local.ref(el);
      } else {
        local.ref = el;
      }
    };
    const onMouseDown = (event) => {
      event.preventDefault();
    };
    return createComponent(Box, mergeProps({
      ref: assignListboxRef,
      role: "listbox",
      tabindex: "-1",
      get id() {
        return selectContext.state.listboxId;
      },
      get ["class"]() {
        return classes();
      },
      get __baseStyle() {
        var _a;
        return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.listbox;
      },
      get onMouseLeave() {
        return selectContext.onListboxMouseLeave;
      },
      onMouseDown
    }, others));
  }
  SelectListbox.toString = () => createClassSelector(hopeSelectListboxClass);
  const SelectOptionContext = createContext();
  const hopeSelectOptionClass = "hope-select__option";
  function SelectOption(props) {
    const theme = useStyleConfig().Select;
    const selectContext = useSelectContext();
    const [index2, setIndex] = createSignal(-1);
    let optionRef;
    const [local, others] = splitProps(props, ["ref", "class", "value", "textValue", "disabled"]);
    const optionData = () => {
      var _a, _b;
      return {
        value: local.value,
        textValue: (_b = (_a = local.textValue) != null ? _a : optionRef == null ? void 0 : optionRef.textContent) != null ? _b : String(local.value),
        disabled: !!local.disabled
      };
    };
    const id = () => `${selectContext.state.optionIdPrefix}-${index2()}`;
    const isSelected = () => selectContext.isOptionSelected(optionData());
    const isActiveDescendant = () => selectContext.isOptionActiveDescendant(index2());
    const classes = () => {
      return classNames(local.class, hopeSelectOptionClass, selectOptionStyles());
    };
    const assignOptionRef = (el) => {
      optionRef = el;
      if (isFunction(local.ref)) {
        local.ref(el);
      } else {
        local.ref = el;
      }
    };
    const onOptionClick = (event) => {
      event.stopPropagation();
      selectContext.onOptionClick(index2());
    };
    const onOptionMouseMove = (event) => {
      if (local.disabled) {
        selectContext.onOptionMouseMove(-1);
      }
      if (isActiveDescendant() || local.disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      selectContext.onOptionMouseMove(index2());
    };
    const context = {
      selected: isSelected
    };
    onMount(() => {
      setIndex(selectContext.registerOption(optionData()));
    });
    createEffect(() => {
      if (isActiveDescendant() && optionRef) {
        selectContext.scrollToOption(optionRef);
      }
    });
    return createComponent(SelectOptionContext.Provider, {
      value: context,
      get children() {
        return createComponent(Box, mergeProps({
          ref: assignOptionRef,
          role: "option",
          get id() {
            return id();
          },
          get ["aria-selected"]() {
            return isSelected();
          },
          get ["data-active"]() {
            return isActiveDescendant() ? "" : void 0;
          },
          get ["data-disabled"]() {
            return local.disabled ? "" : void 0;
          },
          "data-group": true,
          get ["class"]() {
            return classes();
          },
          get __baseStyle() {
            var _a;
            return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.option;
          },
          onClick: onOptionClick,
          onMouseMove: onOptionMouseMove,
          get onMouseDown() {
            return selectContext.onOptionMouseDown;
          }
        }, others));
      }
    });
  }
  SelectOption.toString = () => createClassSelector(hopeSelectOptionClass);
  function useSelectOptionContext() {
    const context = useContext(SelectOptionContext);
    if (!context) {
      throw new Error("[Hope UI]: useSelectOptionContext must be used within a `<Select.Option />` component");
    }
    return context;
  }
  const _tmpl$$4 = /* @__PURE__ */ template(`<svg><g fill="none"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></g></svg>`, 6, true);
  const IconCheck = createIcon({
    viewBox: "0 0 15 15",
    path: () => _tmpl$$4.cloneNode(true)
  });
  const hopeSelectOptionIndicatorClass = "hope-select__option-indicator";
  function SelectOptionIndicator(props) {
    const theme = useStyleConfig().Select;
    const selectOptionContext = useSelectOptionContext();
    const [local, others] = splitProps(props, ["class", "children"]);
    const classes = () => classNames(local.class, hopeSelectOptionIndicatorClass, selectOptionIndicatorStyles());
    return createComponent(Show, {
      get when() {
        return selectOptionContext.selected();
      },
      get children() {
        return createComponent(hope.span, mergeProps({
          get ["class"]() {
            return classes();
          },
          get __baseStyle() {
            var _a;
            return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.optionIndicator;
          }
        }, others, {
          get children() {
            return createComponent(Show, {
              get when() {
                return local.children;
              },
              get fallback() {
                return createComponent(IconCheck, {
                  "aria-hidden": "true",
                  boxSize: "$5"
                });
              },
              get children() {
                return local.children;
              }
            });
          }
        }));
      }
    });
  }
  SelectOptionIndicator.toString = () => createClassSelector(hopeSelectOptionIndicatorClass);
  const hopeSelectOptionTextClass = "hope-select__option-text";
  function SelectOptionText(props) {
    const theme = useStyleConfig().Select;
    const [local, others] = splitProps(props, ["class"]);
    const classes = () => classNames(local.class, hopeSelectOptionTextClass, selectOptionTextStyles());
    return createComponent(hope.span, mergeProps({
      get ["class"]() {
        return classes();
      },
      get __baseStyle() {
        var _a;
        return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.optionText;
      }
    }, others));
  }
  SelectOptionText.toString = () => createClassSelector(hopeSelectOptionTextClass);
  const hopeSelectPlaceholderClass = "hope-select__placeholder";
  function SelectPlaceholder(props) {
    const theme = useStyleConfig().Select;
    const selectContext = useSelectContext();
    const [local, others] = splitProps(props, ["class"]);
    const classes = () => classNames(local.class, hopeSelectPlaceholderClass, selectPlaceholderStyles());
    return createComponent(Show, {
      get when() {
        return !selectContext.state.hasSelectedOptions;
      },
      get children() {
        return createComponent(hope.span, mergeProps({
          get ["class"]() {
            return classes();
          },
          get __baseStyle() {
            var _a;
            return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.placeholder;
          }
        }, others));
      }
    });
  }
  SelectPlaceholder.toString = () => createClassSelector(hopeSelectPlaceholderClass);
  const hopeSelectTagClass = "hope-select__tag";
  function SelectTag(props) {
    const theme = useStyleConfig().Select;
    const selectContext = useSelectContext();
    const [local, others] = splitProps(props, ["class", "size", "variant"]);
    const classes = () => {
      var _a, _b, _c;
      return classNames(local.class, hopeSelectTagClass, selectTagStyles({
        size: (_b = (_a = local.size) != null ? _a : selectContext.state.size) != null ? _b : "md",
        variant: ((_c = local.variant) != null ? _c : selectContext.state.variant === "filled") ? "outline" : "subtle"
      }));
    };
    return createComponent(hope.span, mergeProps({
      get ["class"]() {
        return classes();
      },
      get __baseStyle() {
        var _a;
        return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.tag;
      }
    }, others));
  }
  SelectTag.toString = () => createClassSelector(hopeSelectTagClass);
  const _tmpl$$3 = /* @__PURE__ */ template(`<svg><g fill="none"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></g></svg>`, 6, true);
  const IconCloseSmall = createIcon({
    viewBox: "0 0 15 15",
    path: () => _tmpl$$3.cloneNode(true)
  });
  const hopeSelectTagCloseButtonClass = "hope-select__tag-close-button";
  function SelectTagCloseButton(props) {
    const theme = useStyleConfig().Select;
    const [local, others] = splitProps(props, ["class", "children"]);
    const classes = () => classNames(local.class, hopeSelectTagCloseButtonClass, selectTagCloseButtonStyles());
    return createComponent(hope.button, mergeProps({
      role: "button",
      type: "button",
      "aria-label": "Delete",
      tabIndex: "-1",
      get ["class"]() {
        return classes();
      },
      get __baseStyle() {
        var _a;
        return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.tagCloseButton;
      }
    }, others, {
      get children() {
        return createComponent(Show, {
          get when() {
            return local.children;
          },
          get fallback() {
            return createComponent(IconCloseSmall, {});
          },
          get children() {
            return local.children;
          }
        });
      }
    }));
  }
  SelectTagCloseButton.toString = () => createClassSelector(hopeSelectTagCloseButtonClass);
  const hopeSelectTriggerClass = "hope-select__trigger";
  function SelectTrigger(props) {
    const theme = useStyleConfig().Select;
    const selectContext = useSelectContext();
    const [local, others] = splitProps(props, ["ref", "class", "onClick", "onKeyDown", "onFocus", "onBlur"]);
    const classes = () => {
      return classNames(local.class, hopeSelectTriggerClass, selectTriggerStyles({
        variant: selectContext.state.variant,
        size: selectContext.state.size
      }));
    };
    const assignTriggerRef = (el) => {
      selectContext.assignTriggerRef(el);
      if (isFunction(local.ref)) {
        local.ref(el);
      } else {
        local.ref = el;
      }
    };
    const onClick = (event) => {
      chainHandlers(selectContext.onTriggerClick, local.onClick)(event);
    };
    const onKeyDown = (event) => {
      chainHandlers(selectContext.onTriggerKeyDown, local.onKeyDown)(event);
    };
    const onFocus = (event) => {
      chainHandlers(selectContext.formControlProps.onFocus, local.onFocus)(event);
    };
    const onBlur = (event) => {
      chainHandlers(selectContext.onTriggerBlur, selectContext.formControlProps.onBlur, local.onBlur)(event);
    };
    return createComponent(hope.button, mergeProps({
      ref: assignTriggerRef,
      get id() {
        return selectContext.state.triggerId;
      },
      get disabled() {
        return selectContext.state.disabled;
      },
      role: "combobox",
      type: "button",
      tabindex: "0",
      "aria-haspopup": "listbox",
      get ["aria-activedescendant"]() {
        return selectContext.state.activeDescendantId;
      },
      get ["aria-controls"]() {
        return selectContext.state.listboxId;
      },
      get ["aria-expanded"]() {
        return selectContext.state.opened;
      },
      get ["aria-required"]() {
        return selectContext.formControlProps["aria-required"];
      },
      get ["aria-invalid"]() {
        return selectContext.formControlProps["aria-invalid"];
      },
      get ["aria-readonly"]() {
        return selectContext.formControlProps["aria-readonly"];
      },
      get ["aria-describedby"]() {
        return selectContext.formControlProps["aria-describedby"];
      },
      get ["class"]() {
        return classes();
      },
      get __baseStyle() {
        var _a;
        return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.trigger;
      },
      onClick,
      onKeyDown,
      onFocus,
      onBlur
    }, others));
  }
  SelectTrigger.toString = () => createClassSelector(hopeSelectTriggerClass);
  const _tmpl$$2 = /* @__PURE__ */ template(`<span></span>`, 2);
  const hopeSelectValueClass = "hope-select__value";
  function SelectValue(props) {
    const theme = useStyleConfig().Select;
    const selectContext = useSelectContext();
    const [local, others] = splitProps(props, ["class", "children"]);
    const singleValueClasses = () => classNames(local.class, hopeSelectValueClass, selectSingleValueStyles());
    const multiValueClasses = () => {
      return classNames(local.class, hopeSelectValueClass, selectMultiValueStyles({
        size: selectContext.state.size
      }));
    };
    const onTagCloseButtonClick = (event, option) => {
      event.preventDefault();
      event.stopPropagation();
      selectContext.unselectOption(option);
    };
    const resolvedChildren = children(() => {
      var _a;
      if (isChildrenFunction(local)) {
        return (_a = local.children) == null ? void 0 : _a.call(local, {
          selectedOptions: selectContext.state.selectedOptions
        });
      }
      return local.children;
    });
    return createComponent(Show, {
      get when() {
        return selectContext.state.hasSelectedOptions;
      },
      get children() {
        return createComponent(Show, {
          get when() {
            return !resolvedChildren();
          },
          get fallback() {
            return resolvedChildren();
          },
          get children() {
            return createComponent(Show, {
              get when() {
                return selectContext.state.multiple;
              },
              get fallback() {
                return createComponent(Box, mergeProps({
                  get ["class"]() {
                    return singleValueClasses();
                  },
                  get __baseStyle() {
                    var _a;
                    return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.singleValue;
                  }
                }, others, {
                  get children() {
                    return selectContext.state.selectedOptions[0].textValue;
                  }
                }));
              },
              get children() {
                return createComponent(Box, mergeProps({
                  get ["class"]() {
                    return multiValueClasses();
                  },
                  get __baseStyle() {
                    var _a;
                    return (_a = theme == null ? void 0 : theme.baseStyle) == null ? void 0 : _a.multiValue;
                  }
                }, others, {
                  get children() {
                    return createComponent(For, {
                      get each() {
                        return selectContext.state.selectedOptions;
                      },
                      children: (option) => createComponent(SelectTag, {
                        get children() {
                          return [(() => {
                            const _el$ = _tmpl$$2.cloneNode(true);
                            insert(_el$, () => option.textValue);
                            return _el$;
                          })(), createComponent(SelectTagCloseButton, {
                            onClick: (e2) => onTagCloseButtonClick(e2, option)
                          })];
                        }
                      })
                    });
                  }
                }));
              }
            });
          }
        });
      }
    });
  }
  SelectValue.toString = () => createClassSelector(hopeSelectValueClass);
  const skeletonColorFade = keyframes({
    from: {
      borderColor: "$$startColor",
      background: "$$startColor"
    },
    to: {
      borderColor: "$$endColor",
      background: "$$endColor"
    }
  });
  css({
    $$startColor: "$colors$neutral2",
    $$endColor: "$colors$neutral8",
    opacity: "0.7",
    borderRadius: "2px",
    borderColor: "$$startColor",
    boxShadow: "$none",
    background: "$$endColor",
    backgroundClip: "padding-box",
    color: "transparent",
    cursor: "default",
    pointerEvents: "none",
    userSelect: "none",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationDirection: "alternate",
    animationName: `${skeletonColorFade()}`,
    "&::before, &::after, *": {
      visibility: "hidden"
    }
  });
  css({
    flex: 1,
    justifySelf: "stretch",
    alignSelf: "stretch"
  });
  css({
    display: "inline-block",
    borderColor: "currentColor",
    borderStyle: "solid",
    borderRadius: "$full",
    borderWidth: "2px",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    animationName: `${spin}`,
    animationDuration: "0.45s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    variants: {
      size: {
        xs: {
          boxSize: "0.75rem"
        },
        sm: {
          boxSize: "1rem"
        },
        md: {
          boxSize: "1.5rem"
        },
        lg: {
          boxSize: "2rem"
        },
        xl: {
          boxSize: "3rem"
        }
      }
    }
  });
  css(toggleWrapperStyles, {
    variants: {
      labelPlacement: {
        start: {
          flexDirection: "row"
        },
        end: {
          flexDirection: "row-reverse"
        }
      }
    }
  });
  css(toggleControlLabelStyles);
  css(toggleControlStyles, {
    borderRadius: "$full",
    transition: "background-color 250ms, border-color 250ms, box-shadow 250ms",
    "&::before": {
      content: "''",
      position: "absolute",
      top: "2px",
      left: "2px",
      zIndex: "1",
      borderRadius: "$full",
      boxShadow: "$sm",
      transition: "250ms"
    },
    variants: {
      variant: {
        outline: {
          "&::before": {
            backgroundColor: "$neutral7"
          },
          "&[data-checked]::before": {
            backgroundColor: "$loContrast"
          }
        },
        filled: {
          "&::before": {
            backgroundColor: "$loContrast"
          }
        }
      },
      size: {
        sm: {
          height: "16px",
          width: "26px",
          "&::before": {
            boxSize: "10px"
          },
          "&[data-checked]::before": {
            transform: "translateX(10px)"
          }
        },
        md: {
          columnGap: "2px",
          height: "20px",
          width: "34px",
          "&::before": {
            boxSize: "14px"
          },
          "&[data-checked]::before": {
            transform: "translateX(14px)"
          }
        },
        lg: {
          columnGap: "4px",
          height: "28px",
          width: "50px",
          "&::before": {
            boxSize: "22px"
          },
          "&[data-checked]::before": {
            transform: "translateX(22px)"
          }
        }
      }
    }
  });
  css({
    width: "100%",
    borderCollapse: "collapse",
    fontVariantNumeric: "lining-nums tabular-nums"
  });
  css({
    px: "$6",
    py: "$4",
    color: "$neutral11",
    fontSize: "$sm",
    fontWeight: "$medium",
    lineHeight: "$5",
    textAlign: "center",
    variants: {
      dense: {
        true: {
          px: "$4",
          py: "$3",
          fontSize: "$xs",
          lineHeight: "$4"
        }
      },
      placement: {
        top: {
          captionSide: "top"
        },
        bottom: {
          captionSide: "bottom"
        }
      }
    }
  });
  function createStripedStyles(stripedRow) {
    return {
      "& td": {
        borderBottomWidth: 0
      },
      "& tr:last-of-type td": {
        borderBottomWidth: "1px"
      },
      [`& tr:nth-of-type(${stripedRow}) td`]: {
        backgroundColor: "$neutral3"
      }
    };
  }
  css({
    variants: {
      striped: {
        odd: createStripedStyles("odd"),
        even: createStripedStyles("even")
      },
      highlightOnHover: {
        true: {
          "& tr:hover td": {
            backgroundColor: "$neutral4"
          }
        }
      }
    },
    compoundVariants: [
      {
        striped: "odd",
        highlightOnHover: true,
        css: {
          "& tr:nth-of-type(odd):hover td": {
            backgroundColor: "$neutral4"
          }
        }
      },
      {
        striped: "even",
        highlightOnHover: true,
        css: {
          "& tr:nth-of-type(even):hover td": {
            backgroundColor: "$neutral4"
          }
        }
      }
    ]
  });
  css({
    "& tr:last-of-type th": {
      borderBottomWidth: 0
    }
  });
  css({
    borderBottom: "1px solid $colors$neutral6",
    px: "$6",
    py: "$3",
    fontSize: "$xs",
    fontWeight: "$semibold",
    lineHeight: "$4",
    letterSpacing: "$wider",
    textAlign: "start",
    textTransform: "uppercase",
    variants: {
      dense: {
        true: {
          px: "$4",
          py: "$1_5"
        }
      },
      numeric: {
        true: {
          textAlign: "end"
        }
      }
    }
  });
  css({
    borderBottom: "1px solid $colors$neutral6",
    px: "$6",
    py: "$4",
    fontSize: "$base",
    lineHeight: "$6",
    textAlign: "start",
    transition: "background-color 250ms",
    variants: {
      dense: {
        true: {
          px: "$4",
          py: "$2",
          fontSize: "$sm",
          lineHeight: "$5"
        }
      },
      numeric: {
        true: {
          textAlign: "end"
        }
      }
    }
  });
  css({
    variants: {
      orientation: {
        horizontal: {
          display: "block"
        },
        vertical: {
          display: "flex"
        }
      }
    }
  });
  css({
    display: "flex",
    color: "$neutral11",
    fontWeight: "$normal",
    variants: {
      variant: {
        underline: {
          borderWidth: 0,
          borderStyle: "solid",
          borderColor: "$neutral7"
        },
        outline: {
          borderStyle: "solid",
          borderColor: "$neutral7"
        },
        cards: {
          borderStyle: "solid",
          borderColor: "$neutral7"
        },
        pills: {
          gap: "$1_5"
        }
      },
      alignment: {
        start: {
          justifyContent: "flex-start"
        },
        end: {
          justifyContent: "flex-end"
        },
        center: {
          justifyContent: "center"
        },
        apart: {
          justifyContent: "space-between"
        }
      },
      orientation: {
        horizontal: {
          flexDirection: "row"
        },
        vertical: {
          flexDirection: "column"
        }
      }
    },
    compoundVariants: [
      {
        variant: "underline",
        orientation: "horizontal",
        css: {
          borderBottomWidth: "1px"
        }
      },
      {
        variant: "underline",
        orientation: "vertical",
        css: {
          borderInlineEndWidth: "1px"
        }
      },
      {
        variant: "outline",
        orientation: "horizontal",
        css: {
          mb: "-1px",
          borderBottomWidth: "1px"
        }
      },
      {
        variant: "outline",
        orientation: "vertical",
        css: {
          marginInlineEnd: "-1px",
          borderInlineEndWidth: "1px"
        }
      },
      {
        variant: "cards",
        orientation: "horizontal",
        css: {
          mb: "-1px",
          borderBottomWidth: "1px"
        }
      },
      {
        variant: "cards",
        orientation: "vertical",
        css: {
          marginInlineEnd: "-1px",
          borderInlineEndWidth: "1px"
        }
      }
    ]
  });
  function createSelectedColorVariant(color) {
    return {
      "&[aria-selected='true']": {
        color
      }
    };
  }
  function createPillsAndColorVariant(config2) {
    return {
      "&[aria-selected='true']": {
        color: config2.color,
        backgroundColor: config2.bgColor
      },
      "&[aria-selected='true']:hover": {
        backgroundColor: config2.bgColorHover
      }
    };
  }
  css({
    appearance: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
    border: "$none",
    backgroundColor: "transparent",
    px: "$4",
    color: "inherit",
    fontWeight: "inherit",
    cursor: "pointer",
    transitionProperty: "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
    transitionDuration: "250ms",
    "&:focus": {
      zIndex: 1,
      outline: "none",
      boxShadow: "$outline"
    },
    "&:disabled": {
      opacity: 0.4,
      cursor: "not-allowed"
    },
    variants: {
      variant: {
        underline: {
          borderWidth: 0,
          borderStyle: "solid",
          borderColor: "transparent",
          "&[aria-selected='true']": {
            borderColor: "currentColor"
          },
          "&:active": {
            backgroundColor: "$neutral4"
          }
        },
        outline: {
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "transparent",
          "&[aria-selected='true']": {
            borderColor: "inherit"
          }
        },
        cards: {
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "inherit",
          backgroundColor: "$neutral3",
          "&[aria-selected='true']": {
            borderColor: "inherit",
            backgroundColor: "$loContrast"
          }
        },
        pills: {
          borderRadius: "$sm",
          "&:hover": {
            backgroundColor: "$neutral3"
          },
          "&:hover:disabled": {
            backgroundColor: "transparent"
          }
        }
      },
      colorScheme: {
        primary: {},
        accent: {},
        neutral: {},
        success: {},
        info: {},
        warning: {},
        danger: {}
      },
      size: {
        sm: {
          py: "$1",
          fontSize: "$sm"
        },
        md: {
          py: "$2",
          fontSize: "$base"
        },
        lg: {
          py: "$3",
          fontSize: "$lg"
        }
      },
      orientation: {
        horizontal: {},
        vertical: {}
      },
      fitted: {
        true: {
          flex: 1
        }
      }
    },
    compoundVariants: [
      {
        variant: "underline",
        colorScheme: "primary",
        css: createSelectedColorVariant("$primary11")
      },
      {
        variant: "underline",
        colorScheme: "accent",
        css: createSelectedColorVariant("$accent11")
      },
      {
        variant: "underline",
        colorScheme: "neutral",
        css: createSelectedColorVariant("$neutral12")
      },
      {
        variant: "underline",
        colorScheme: "success",
        css: createSelectedColorVariant("$success11")
      },
      {
        variant: "underline",
        colorScheme: "info",
        css: createSelectedColorVariant("$info11")
      },
      {
        variant: "underline",
        colorScheme: "warning",
        css: createSelectedColorVariant("$warning11")
      },
      {
        variant: "underline",
        colorScheme: "danger",
        css: createSelectedColorVariant("$danger11")
      },
      {
        variant: "outline",
        colorScheme: "primary",
        css: createSelectedColorVariant("$primary11")
      },
      {
        variant: "outline",
        colorScheme: "accent",
        css: createSelectedColorVariant("$accent11")
      },
      {
        variant: "outline",
        colorScheme: "neutral",
        css: createSelectedColorVariant("$neutral12")
      },
      {
        variant: "outline",
        colorScheme: "success",
        css: createSelectedColorVariant("$success11")
      },
      {
        variant: "outline",
        colorScheme: "info",
        css: createSelectedColorVariant("$info11")
      },
      {
        variant: "outline",
        colorScheme: "warning",
        css: createSelectedColorVariant("$warning11")
      },
      {
        variant: "outline",
        colorScheme: "danger",
        css: createSelectedColorVariant("$danger11")
      },
      {
        variant: "cards",
        colorScheme: "primary",
        css: createSelectedColorVariant("$primary11")
      },
      {
        variant: "cards",
        colorScheme: "accent",
        css: createSelectedColorVariant("$accent11")
      },
      {
        variant: "cards",
        colorScheme: "neutral",
        css: createSelectedColorVariant("$neutral12")
      },
      {
        variant: "cards",
        colorScheme: "success",
        css: createSelectedColorVariant("$success11")
      },
      {
        variant: "cards",
        colorScheme: "info",
        css: createSelectedColorVariant("$info11")
      },
      {
        variant: "cards",
        colorScheme: "warning",
        css: createSelectedColorVariant("$warning11")
      },
      {
        variant: "cards",
        colorScheme: "danger",
        css: createSelectedColorVariant("$danger11")
      },
      {
        variant: "pills",
        colorScheme: "primary",
        css: createPillsAndColorVariant({
          color: "$primary11",
          bgColor: "$primary3",
          bgColorHover: "$primary4"
        })
      },
      {
        variant: "pills",
        colorScheme: "accent",
        css: createPillsAndColorVariant({
          color: "$accent11",
          bgColor: "$accent3",
          bgColorHover: "$accent4"
        })
      },
      {
        variant: "pills",
        colorScheme: "neutral",
        css: createPillsAndColorVariant({
          color: "$neutral12",
          bgColor: "$neutral3",
          bgColorHover: "$neutral4"
        })
      },
      {
        variant: "pills",
        colorScheme: "success",
        css: createPillsAndColorVariant({
          color: "$success11",
          bgColor: "$success3",
          bgColorHover: "$success4"
        })
      },
      {
        variant: "pills",
        colorScheme: "info",
        css: createPillsAndColorVariant({
          color: "$info11",
          bgColor: "$info3",
          bgColorHover: "$info4"
        })
      },
      {
        variant: "pills",
        colorScheme: "warning",
        css: createPillsAndColorVariant({
          color: "$warning11",
          bgColor: "$warning3",
          bgColorHover: "$warning4"
        })
      },
      {
        variant: "pills",
        colorScheme: "danger",
        css: createPillsAndColorVariant({
          color: "$danger11",
          bgColor: "$danger3",
          bgColorHover: "$danger4"
        })
      },
      {
        variant: "underline",
        orientation: "horizontal",
        css: {
          borderBottomWidth: "2px",
          marginBottom: "-1px"
        }
      },
      {
        variant: "underline",
        orientation: "vertical",
        css: {
          borderInlineEndWidth: "2px",
          marginInlineEnd: "-1px"
        }
      },
      {
        variant: "outline",
        orientation: "horizontal",
        css: {
          mb: "-1px",
          borderTopRadius: "$sm",
          "&[aria-selected='true']": {
            borderBottomColor: "$loContrast"
          }
        }
      },
      {
        variant: "outline",
        orientation: "vertical",
        css: {
          marginInlineEnd: "-1px",
          borderStartRadius: "$radii$sm",
          "&[aria-selected='true']": {
            borderInlineEndColor: "$colors$loContrast"
          }
        }
      },
      {
        variant: "cards",
        orientation: "horizontal",
        css: {
          mb: "-1px",
          borderBottomWidth: "1px",
          "&:not(:last-of-type)": {
            marginInlineEnd: "-1px"
          },
          "&[aria-selected='true']": {
            borderTopColor: "currentColor",
            borderBottomColor: "transparent"
          }
        }
      },
      {
        variant: "cards",
        orientation: "vertical",
        css: {
          marginInlineEnd: "-1px",
          borderInlineEndWidth: "1px",
          "&:not(:last-of-type)": {
            mb: "-1px"
          },
          "&[aria-selected='true']": {
            borderInlineStartColor: "currentColor",
            borderInlineEndColor: "transparent"
          }
        }
      }
    ]
  });
  css({
    outline: "none",
    padding: "$4"
  });
  css({
    marginInlineStart: "$2"
  });
  css({
    marginInlineEnd: "$2"
  });
  css({
    noOfLines: 1
  });
  const tagCloseButtonStyles = css({
    appearance: "none",
    position: "relative",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    outline: "none",
    border: "1px solid transparent",
    borderRadius: "$full",
    backgroundColor: "transparent",
    padding: "0",
    lineHeight: "$none",
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
    userSelect: "none",
    transition: "color 250ms, background-color 250ms, opacity 250ms, box-shadow 250ms",
    "&:focus": {
      outline: "none",
      boxShadow: "$outline"
    },
    "&:disabled": {
      border: "1px solid transparent",
      backgroundColor: "transparent",
      color: "$neutral3",
      cursor: "not-allowed"
    },
    variants: {
      size: {
        sm: {
          marginInlineStart: "0.35rem",
          marginInlineEnd: "-3px"
        },
        md: {
          marginInlineStart: "$1_5",
          marginInlineEnd: "calc(0.15rem * -1)"
        },
        lg: {
          marginInlineStart: "$1_5",
          marginInlineEnd: "calc($1 * -1)"
        }
      }
    }
  });
  function createTagSizeVariant(config2) {
    return {
      height: config2.height,
      py: 0,
      px: config2.paddingX,
      fontSize: config2.fontSize,
      lineHeight: config2.lineHeight,
      [`& .${tagCloseButtonStyles}`]: {
        boxSize: config2.closeButtonSize
      }
    };
  }
  function createTagSolidCompoundVariant(config2) {
    return {
      backgroundColor: config2.bgColor,
      color: config2.color,
      [`& .${tagCloseButtonStyles}:not(:disabled):hover`]: {
        backgroundColor: config2.closeButtonBgColorHover
      }
    };
  }
  function createTagSubtleCompoundVariant(config2) {
    return {
      backgroundColor: config2.bgColor,
      color: config2.color,
      [`& .${tagCloseButtonStyles}:not(:disabled):hover`]: {
        backgroundColor: config2.closeButtonBgColorHover
      }
    };
  }
  function createTagOutlineCompoundVariant(config2) {
    return {
      borderColor: config2.borderColor,
      color: config2.color,
      [`& .${tagCloseButtonStyles}:not(:disabled):hover`]: {
        backgroundColor: config2.closeButtonBgColorHover
      }
    };
  }
  function createTagDotAndSizeCompoundVariant(size2) {
    return {
      "&::before,  &::after": {
        boxSize: size2
      },
      "&::before": {
        marginRight: size2
      },
      "&::after": {
        marginLeft: size2
      }
    };
  }
  css({
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "$full",
    fontWeight: "$medium",
    lineHeight: "$none",
    variants: {
      variant: {
        solid: {
          border: "1px solid transparent",
          color: "white"
        },
        subtle: {
          border: "1px solid transparent"
        },
        outline: {
          borderStyle: "solid",
          borderWidth: "1px",
          backgroundColor: "transparent"
        },
        dot: {
          border: "1px solid $neutral7",
          backgroundColor: "transparent",
          color: "$neutral12",
          "&::before,  &::after": {
            content: "''",
            borderRadius: "$full"
          },
          "&::before": {
            display: "block"
          },
          "&::after": {
            display: "none"
          },
          [`& .${tagCloseButtonStyles}:not(:disabled):hover`]: {
            backgroundColor: "$neutral4"
          },
          [`& .${tagCloseButtonStyles}:not(:disabled):active`]: {
            backgroundColor: "$neutral5"
          }
        }
      },
      colorScheme: {
        primary: {},
        accent: {},
        neutral: {},
        success: {},
        info: {},
        warning: {},
        danger: {}
      },
      size: {
        sm: createTagSizeVariant({
          height: "$5",
          paddingX: "$2",
          fontSize: "$xs",
          lineHeight: "$4",
          closeButtonSize: "$4"
        }),
        md: createTagSizeVariant({
          height: "$6",
          paddingX: "$2",
          fontSize: "$sm",
          lineHeight: "$5",
          closeButtonSize: "$5"
        }),
        lg: createTagSizeVariant({
          height: "$8",
          paddingX: "$3",
          fontSize: "$base",
          lineHeight: "$6",
          closeButtonSize: "$6"
        })
      },
      dotPlacement: {
        start: {},
        end: {}
      }
    },
    compoundVariants: [
      {
        variant: "solid",
        colorScheme: "primary",
        css: createTagSolidCompoundVariant({
          color: "white",
          bgColor: "$primary9",
          closeButtonBgColorHover: "$primary10"
        })
      },
      {
        variant: "solid",
        colorScheme: "accent",
        css: createTagSolidCompoundVariant({
          color: "white",
          bgColor: "$accent9",
          closeButtonBgColorHover: "$accent10"
        })
      },
      {
        variant: "solid",
        colorScheme: "neutral",
        css: createTagSolidCompoundVariant({
          color: "white",
          bgColor: "$neutral9",
          closeButtonBgColorHover: "$neutral11"
        })
      },
      {
        variant: "solid",
        colorScheme: "success",
        css: createTagSolidCompoundVariant({
          color: "white",
          bgColor: "$success9",
          closeButtonBgColorHover: "$success10"
        })
      },
      {
        variant: "solid",
        colorScheme: "info",
        css: createTagSolidCompoundVariant({
          color: "white",
          bgColor: "$info9",
          closeButtonBgColorHover: "$info10"
        })
      },
      {
        variant: "solid",
        colorScheme: "warning",
        css: createTagSolidCompoundVariant({
          color: "$blackAlpha12",
          bgColor: "$warning9",
          closeButtonBgColorHover: "$warning10"
        })
      },
      {
        variant: "solid",
        colorScheme: "danger",
        css: createTagSolidCompoundVariant({
          color: "white",
          bgColor: "$danger9",
          closeButtonBgColorHover: "$danger10"
        })
      },
      {
        variant: "subtle",
        colorScheme: "primary",
        css: createTagSubtleCompoundVariant({
          color: "$primary11",
          bgColor: "$primary4",
          closeButtonBgColorHover: "$primary6"
        })
      },
      {
        variant: "subtle",
        colorScheme: "accent",
        css: createTagSubtleCompoundVariant({
          color: "$accent11",
          bgColor: "$accent4",
          closeButtonBgColorHover: "$accent6"
        })
      },
      {
        variant: "subtle",
        colorScheme: "neutral",
        css: createTagSubtleCompoundVariant({
          color: "$neutral12",
          bgColor: "$neutral4",
          closeButtonBgColorHover: "$neutral7"
        })
      },
      {
        variant: "subtle",
        colorScheme: "success",
        css: createTagSubtleCompoundVariant({
          color: "$success11",
          bgColor: "$success4",
          closeButtonBgColorHover: "$success6"
        })
      },
      {
        variant: "subtle",
        colorScheme: "info",
        css: createTagSubtleCompoundVariant({
          color: "$info11",
          bgColor: "$info4",
          closeButtonBgColorHover: "$info6"
        })
      },
      {
        variant: "subtle",
        colorScheme: "warning",
        css: createTagSubtleCompoundVariant({
          color: "$warning11",
          bgColor: "$warning4",
          closeButtonBgColorHover: "$warning6"
        })
      },
      {
        variant: "subtle",
        colorScheme: "danger",
        css: createTagSubtleCompoundVariant({
          color: "$danger11",
          bgColor: "$danger4",
          closeButtonBgColorHover: "$danger6"
        })
      },
      {
        variant: "outline",
        colorScheme: "primary",
        css: createTagOutlineCompoundVariant({
          color: "$primary11",
          borderColor: "$primary7",
          closeButtonBgColorHover: "$primary4"
        })
      },
      {
        variant: "outline",
        colorScheme: "accent",
        css: createTagOutlineCompoundVariant({
          color: "$accent11",
          borderColor: "$accent7",
          closeButtonBgColorHover: "$accent4"
        })
      },
      {
        variant: "outline",
        colorScheme: "neutral",
        css: createTagOutlineCompoundVariant({
          color: "$neutral12",
          borderColor: "$neutral7",
          closeButtonBgColorHover: "$neutral4"
        })
      },
      {
        variant: "outline",
        colorScheme: "success",
        css: createTagOutlineCompoundVariant({
          color: "$success11",
          borderColor: "$success7",
          closeButtonBgColorHover: "$success4"
        })
      },
      {
        variant: "outline",
        colorScheme: "info",
        css: createTagOutlineCompoundVariant({
          color: "$info11",
          borderColor: "$info7",
          closeButtonBgColorHover: "$info4"
        })
      },
      {
        variant: "outline",
        colorScheme: "warning",
        css: createTagOutlineCompoundVariant({
          color: "$warning11",
          borderColor: "$warning7",
          closeButtonBgColorHover: "$warning4"
        })
      },
      {
        variant: "outline",
        colorScheme: "danger",
        css: createTagOutlineCompoundVariant({
          color: "$danger11",
          borderColor: "$danger7",
          closeButtonBgColorHover: "$danger4"
        })
      },
      {
        variant: "dot",
        colorScheme: "primary",
        css: {
          "&::before, &::after": {
            backgroundColor: "$primary9"
          }
        }
      },
      {
        variant: "dot",
        colorScheme: "accent",
        css: {
          "&::before, &::after": {
            backgroundColor: "$accent9"
          }
        }
      },
      {
        variant: "dot",
        colorScheme: "neutral",
        css: {
          "&::before, &::after": {
            backgroundColor: "$neutral9"
          }
        }
      },
      {
        variant: "dot",
        colorScheme: "success",
        css: {
          "&::before, &::after": {
            backgroundColor: "$success9"
          }
        }
      },
      {
        variant: "dot",
        colorScheme: "info",
        css: {
          "&::before, &::after": {
            backgroundColor: "$info9"
          }
        }
      },
      {
        variant: "dot",
        colorScheme: "warning",
        css: {
          "&::before, &::after": {
            backgroundColor: "$warning9"
          }
        }
      },
      {
        variant: "dot",
        colorScheme: "danger",
        css: {
          "&::before, &::after": {
            backgroundColor: "$danger9"
          }
        }
      },
      {
        variant: "dot",
        size: "sm",
        css: createTagDotAndSizeCompoundVariant("$1_5")
      },
      {
        variant: "dot",
        size: "md",
        css: createTagDotAndSizeCompoundVariant("$2")
      },
      {
        variant: "dot",
        size: "lg",
        css: createTagDotAndSizeCompoundVariant("$2_5")
      },
      {
        variant: "dot",
        dotPlacement: "start",
        css: {
          "&::before": {
            display: "block"
          },
          "&::after": {
            display: "none"
          }
        }
      },
      {
        variant: "dot",
        dotPlacement: "end",
        css: {
          "&::before": {
            display: "none"
          },
          "&::after": {
            display: "block"
          }
        }
      }
    ]
  });
  function createVariantAndSizeCompoundVariants(variant, paddingX) {
    return Object.entries({
      xs: paddingX != null ? paddingX : "$2",
      sm: paddingX != null ? paddingX : "$2_5",
      md: paddingX != null ? paddingX : "$3",
      lg: paddingX != null ? paddingX : "$4"
    }).map(([key, value]) => ({
      variant,
      size: key,
      css: { px: value }
    }));
  }
  css(baseInputResetStyles, {
    minHeight: "80px",
    py: "$2",
    compoundVariants: [
      ...createVariantAndSizeCompoundVariants("outline"),
      ...createVariantAndSizeCompoundVariants("filled"),
      ...createVariantAndSizeCompoundVariants("unstyled", 0)
    ]
  });
  class Subscribable {
    constructor() {
      this.listeners = [];
      this.subscribe = this.subscribe.bind(this);
    }
    subscribe(listener) {
      this.listeners.push(listener);
      this.onSubscribe();
      return () => {
        this.listeners = this.listeners.filter((x2) => x2 !== listener);
        this.onUnsubscribe();
      };
    }
    hasListeners() {
      return this.listeners.length > 0;
    }
    onSubscribe() {
    }
    onUnsubscribe() {
    }
  }
  const isServer = typeof window === "undefined" || "Deno" in window;
  function noop() {
    return void 0;
  }
  function functionalUpdate(updater, input) {
    return typeof updater === "function" ? updater(input) : updater;
  }
  function isValidTimeout(value) {
    return typeof value === "number" && value >= 0 && value !== Infinity;
  }
  function timeUntilStale(updatedAt, staleTime) {
    return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
  }
  function parseQueryArgs(arg1, arg2, arg3) {
    if (!isQueryKey(arg1)) {
      return arg1;
    }
    if (typeof arg2 === "function") {
      return {
        ...arg3,
        queryKey: arg1,
        queryFn: arg2
      };
    }
    return {
      ...arg2,
      queryKey: arg1
    };
  }
  function parseFilterArgs(arg1, arg2, arg3) {
    return isQueryKey(arg1) ? [{
      ...arg2,
      queryKey: arg1
    }, arg3] : [arg1 || {}, arg2];
  }
  function matchQuery(filters, query) {
    const {
      type = "all",
      exact,
      fetchStatus,
      predicate,
      queryKey,
      stale
    } = filters;
    if (isQueryKey(queryKey)) {
      if (exact) {
        if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
          return false;
        }
      } else if (!partialMatchKey(query.queryKey, queryKey)) {
        return false;
      }
    }
    if (type !== "all") {
      const isActive = query.isActive();
      if (type === "active" && !isActive) {
        return false;
      }
      if (type === "inactive" && isActive) {
        return false;
      }
    }
    if (typeof stale === "boolean" && query.isStale() !== stale) {
      return false;
    }
    if (typeof fetchStatus !== "undefined" && fetchStatus !== query.state.fetchStatus) {
      return false;
    }
    if (predicate && !predicate(query)) {
      return false;
    }
    return true;
  }
  function matchMutation(filters, mutation) {
    const {
      exact,
      fetching,
      predicate,
      mutationKey
    } = filters;
    if (isQueryKey(mutationKey)) {
      if (!mutation.options.mutationKey) {
        return false;
      }
      if (exact) {
        if (hashQueryKey(mutation.options.mutationKey) !== hashQueryKey(mutationKey)) {
          return false;
        }
      } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
        return false;
      }
    }
    if (typeof fetching === "boolean" && mutation.state.status === "loading" !== fetching) {
      return false;
    }
    if (predicate && !predicate(mutation)) {
      return false;
    }
    return true;
  }
  function hashQueryKeyByOptions(queryKey, options) {
    const hashFn = (options == null ? void 0 : options.queryKeyHashFn) || hashQueryKey;
    return hashFn(queryKey);
  }
  function hashQueryKey(queryKey) {
    return JSON.stringify(queryKey, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
      result[key] = val[key];
      return result;
    }, {}) : val);
  }
  function partialMatchKey(a2, b2) {
    return partialDeepEqual(a2, b2);
  }
  function partialDeepEqual(a2, b2) {
    if (a2 === b2) {
      return true;
    }
    if (typeof a2 !== typeof b2) {
      return false;
    }
    if (a2 && b2 && typeof a2 === "object" && typeof b2 === "object") {
      return !Object.keys(b2).some((key) => !partialDeepEqual(a2[key], b2[key]));
    }
    return false;
  }
  function replaceEqualDeep(a2, b2) {
    if (a2 === b2) {
      return a2;
    }
    const array = isPlainArray(a2) && isPlainArray(b2);
    if (array || isPlainObject(a2) && isPlainObject(b2)) {
      const aSize = array ? a2.length : Object.keys(a2).length;
      const bItems = array ? b2 : Object.keys(b2);
      const bSize = bItems.length;
      const copy = array ? [] : {};
      let equalItems = 0;
      for (let i2 = 0; i2 < bSize; i2++) {
        const key = array ? i2 : bItems[i2];
        copy[key] = replaceEqualDeep(a2[key], b2[key]);
        if (copy[key] === a2[key]) {
          equalItems++;
        }
      }
      return aSize === bSize && equalItems === aSize ? a2 : copy;
    }
    return b2;
  }
  function isPlainArray(value) {
    return Array.isArray(value) && value.length === Object.keys(value).length;
  }
  function isPlainObject(o2) {
    if (!hasObjectPrototype(o2)) {
      return false;
    }
    const ctor = o2.constructor;
    if (typeof ctor === "undefined") {
      return true;
    }
    const prot = ctor.prototype;
    if (!hasObjectPrototype(prot)) {
      return false;
    }
    if (!prot.hasOwnProperty("isPrototypeOf")) {
      return false;
    }
    return true;
  }
  function hasObjectPrototype(o2) {
    return Object.prototype.toString.call(o2) === "[object Object]";
  }
  function isQueryKey(value) {
    return Array.isArray(value);
  }
  function sleep(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }
  function scheduleMicrotask(callback) {
    sleep(0).then(callback);
  }
  function getAbortController() {
    if (typeof AbortController === "function") {
      return new AbortController();
    }
    return;
  }
  function replaceData(prevData, data, options) {
    if (options.isDataEqual != null && options.isDataEqual(prevData, data)) {
      return prevData;
    } else if (typeof options.structuralSharing === "function") {
      return options.structuralSharing(prevData, data);
    } else if (options.structuralSharing !== false) {
      return replaceEqualDeep(prevData, data);
    }
    return data;
  }
  class FocusManager extends Subscribable {
    constructor() {
      super();
      this.setup = (onFocus) => {
        if (!isServer && window.addEventListener) {
          const listener = () => onFocus();
          window.addEventListener("visibilitychange", listener, false);
          window.addEventListener("focus", listener, false);
          return () => {
            window.removeEventListener("visibilitychange", listener);
            window.removeEventListener("focus", listener);
          };
        }
        return;
      };
    }
    onSubscribe() {
      if (!this.cleanup) {
        this.setEventListener(this.setup);
      }
    }
    onUnsubscribe() {
      if (!this.hasListeners()) {
        var _this$cleanup;
        (_this$cleanup = this.cleanup) == null ? void 0 : _this$cleanup.call(this);
        this.cleanup = void 0;
      }
    }
    setEventListener(setup) {
      var _this$cleanup2;
      this.setup = setup;
      (_this$cleanup2 = this.cleanup) == null ? void 0 : _this$cleanup2.call(this);
      this.cleanup = setup((focused) => {
        if (typeof focused === "boolean") {
          this.setFocused(focused);
        } else {
          this.onFocus();
        }
      });
    }
    setFocused(focused) {
      this.focused = focused;
      if (focused) {
        this.onFocus();
      }
    }
    onFocus() {
      this.listeners.forEach((listener) => {
        listener();
      });
    }
    isFocused() {
      if (typeof this.focused === "boolean") {
        return this.focused;
      }
      if (typeof document === "undefined") {
        return true;
      }
      return [void 0, "visible", "prerender"].includes(document.visibilityState);
    }
  }
  const focusManager = new FocusManager();
  class OnlineManager extends Subscribable {
    constructor() {
      super();
      this.setup = (onOnline) => {
        if (!isServer && window.addEventListener) {
          const listener = () => onOnline();
          window.addEventListener("online", listener, false);
          window.addEventListener("offline", listener, false);
          return () => {
            window.removeEventListener("online", listener);
            window.removeEventListener("offline", listener);
          };
        }
        return;
      };
    }
    onSubscribe() {
      if (!this.cleanup) {
        this.setEventListener(this.setup);
      }
    }
    onUnsubscribe() {
      if (!this.hasListeners()) {
        var _this$cleanup;
        (_this$cleanup = this.cleanup) == null ? void 0 : _this$cleanup.call(this);
        this.cleanup = void 0;
      }
    }
    setEventListener(setup) {
      var _this$cleanup2;
      this.setup = setup;
      (_this$cleanup2 = this.cleanup) == null ? void 0 : _this$cleanup2.call(this);
      this.cleanup = setup((online) => {
        if (typeof online === "boolean") {
          this.setOnline(online);
        } else {
          this.onOnline();
        }
      });
    }
    setOnline(online) {
      this.online = online;
      if (online) {
        this.onOnline();
      }
    }
    onOnline() {
      this.listeners.forEach((listener) => {
        listener();
      });
    }
    isOnline() {
      if (typeof this.online === "boolean") {
        return this.online;
      }
      if (typeof navigator === "undefined" || typeof navigator.onLine === "undefined") {
        return true;
      }
      return navigator.onLine;
    }
  }
  const onlineManager = new OnlineManager();
  function defaultRetryDelay(failureCount) {
    return Math.min(1e3 * 2 ** failureCount, 3e4);
  }
  function canFetch(networkMode) {
    return (networkMode != null ? networkMode : "online") === "online" ? onlineManager.isOnline() : true;
  }
  class CancelledError {
    constructor(options) {
      this.revert = options == null ? void 0 : options.revert;
      this.silent = options == null ? void 0 : options.silent;
    }
  }
  function isCancelledError(value) {
    return value instanceof CancelledError;
  }
  function createRetryer(config2) {
    let isRetryCancelled = false;
    let failureCount = 0;
    let isResolved = false;
    let continueFn;
    let promiseResolve;
    let promiseReject;
    const promise = new Promise((outerResolve, outerReject) => {
      promiseResolve = outerResolve;
      promiseReject = outerReject;
    });
    const cancel = (cancelOptions) => {
      if (!isResolved) {
        reject(new CancelledError(cancelOptions));
        config2.abort == null ? void 0 : config2.abort();
      }
    };
    const cancelRetry = () => {
      isRetryCancelled = true;
    };
    const continueRetry = () => {
      isRetryCancelled = false;
    };
    const shouldPause = () => !focusManager.isFocused() || config2.networkMode !== "always" && !onlineManager.isOnline();
    const resolve = (value) => {
      if (!isResolved) {
        isResolved = true;
        config2.onSuccess == null ? void 0 : config2.onSuccess(value);
        continueFn == null ? void 0 : continueFn();
        promiseResolve(value);
      }
    };
    const reject = (value) => {
      if (!isResolved) {
        isResolved = true;
        config2.onError == null ? void 0 : config2.onError(value);
        continueFn == null ? void 0 : continueFn();
        promiseReject(value);
      }
    };
    const pause = () => {
      return new Promise((continueResolve) => {
        continueFn = (value) => {
          const canContinue = isResolved || !shouldPause();
          if (canContinue) {
            continueResolve(value);
          }
          return canContinue;
        };
        config2.onPause == null ? void 0 : config2.onPause();
      }).then(() => {
        continueFn = void 0;
        if (!isResolved) {
          config2.onContinue == null ? void 0 : config2.onContinue();
        }
      });
    };
    const run = () => {
      if (isResolved) {
        return;
      }
      let promiseOrValue;
      try {
        promiseOrValue = config2.fn();
      } catch (error) {
        promiseOrValue = Promise.reject(error);
      }
      Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
        var _config$retry, _config$retryDelay;
        if (isResolved) {
          return;
        }
        const retry = (_config$retry = config2.retry) != null ? _config$retry : 3;
        const retryDelay = (_config$retryDelay = config2.retryDelay) != null ? _config$retryDelay : defaultRetryDelay;
        const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
        const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
        if (isRetryCancelled || !shouldRetry) {
          reject(error);
          return;
        }
        failureCount++;
        config2.onFail == null ? void 0 : config2.onFail(failureCount, error);
        sleep(delay).then(() => {
          if (shouldPause()) {
            return pause();
          }
          return;
        }).then(() => {
          if (isRetryCancelled) {
            reject(error);
          } else {
            run();
          }
        });
      });
    };
    if (canFetch(config2.networkMode)) {
      run();
    } else {
      pause().then(run);
    }
    return {
      promise,
      cancel,
      continue: () => {
        const didContinue = continueFn == null ? void 0 : continueFn();
        return didContinue ? promise : Promise.resolve();
      },
      cancelRetry,
      continueRetry
    };
  }
  const defaultLogger = console;
  function createNotifyManager() {
    let queue = [];
    let transactions = 0;
    let notifyFn = (callback) => {
      callback();
    };
    let batchNotifyFn = (callback) => {
      callback();
    };
    const batch2 = (callback) => {
      let result;
      transactions++;
      try {
        result = callback();
      } finally {
        transactions--;
        if (!transactions) {
          flush();
        }
      }
      return result;
    };
    const schedule = (callback) => {
      if (transactions) {
        queue.push(callback);
      } else {
        scheduleMicrotask(() => {
          notifyFn(callback);
        });
      }
    };
    const batchCalls = (callback) => {
      return (...args) => {
        schedule(() => {
          callback(...args);
        });
      };
    };
    const flush = () => {
      const originalQueue = queue;
      queue = [];
      if (originalQueue.length) {
        scheduleMicrotask(() => {
          batchNotifyFn(() => {
            originalQueue.forEach((callback) => {
              notifyFn(callback);
            });
          });
        });
      }
    };
    const setNotifyFunction = (fn) => {
      notifyFn = fn;
    };
    const setBatchNotifyFunction = (fn) => {
      batchNotifyFn = fn;
    };
    return {
      batch: batch2,
      batchCalls,
      schedule,
      setNotifyFunction,
      setBatchNotifyFunction
    };
  }
  const notifyManager = createNotifyManager();
  class Removable {
    destroy() {
      this.clearGcTimeout();
    }
    scheduleGc() {
      this.clearGcTimeout();
      if (isValidTimeout(this.cacheTime)) {
        this.gcTimeout = setTimeout(() => {
          this.optionalRemove();
        }, this.cacheTime);
      }
    }
    updateCacheTime(newCacheTime) {
      this.cacheTime = Math.max(this.cacheTime || 0, newCacheTime != null ? newCacheTime : isServer ? Infinity : 5 * 60 * 1e3);
    }
    clearGcTimeout() {
      if (this.gcTimeout) {
        clearTimeout(this.gcTimeout);
        this.gcTimeout = void 0;
      }
    }
  }
  class Query extends Removable {
    constructor(config2) {
      super();
      this.abortSignalConsumed = false;
      this.defaultOptions = config2.defaultOptions;
      this.setOptions(config2.options);
      this.observers = [];
      this.cache = config2.cache;
      this.logger = config2.logger || defaultLogger;
      this.queryKey = config2.queryKey;
      this.queryHash = config2.queryHash;
      this.initialState = config2.state || getDefaultState$1(this.options);
      this.state = this.initialState;
      this.scheduleGc();
    }
    get meta() {
      return this.options.meta;
    }
    setOptions(options) {
      this.options = {
        ...this.defaultOptions,
        ...options
      };
      this.updateCacheTime(this.options.cacheTime);
    }
    optionalRemove() {
      if (!this.observers.length && this.state.fetchStatus === "idle") {
        this.cache.remove(this);
      }
    }
    setData(newData, options) {
      const data = replaceData(this.state.data, newData, this.options);
      this.dispatch({
        data,
        type: "success",
        dataUpdatedAt: options == null ? void 0 : options.updatedAt,
        manual: options == null ? void 0 : options.manual
      });
      return data;
    }
    setState(state, setStateOptions) {
      this.dispatch({
        type: "setState",
        state,
        setStateOptions
      });
    }
    cancel(options) {
      var _this$retryer;
      const promise = this.promise;
      (_this$retryer = this.retryer) == null ? void 0 : _this$retryer.cancel(options);
      return promise ? promise.then(noop).catch(noop) : Promise.resolve();
    }
    destroy() {
      super.destroy();
      this.cancel({
        silent: true
      });
    }
    reset() {
      this.destroy();
      this.setState(this.initialState);
    }
    isActive() {
      return this.observers.some((observer) => observer.options.enabled !== false);
    }
    isDisabled() {
      return this.getObserversCount() > 0 && !this.isActive();
    }
    isStale() {
      return this.state.isInvalidated || !this.state.dataUpdatedAt || this.observers.some((observer) => observer.getCurrentResult().isStale);
    }
    isStaleByTime(staleTime = 0) {
      return this.state.isInvalidated || !this.state.dataUpdatedAt || !timeUntilStale(this.state.dataUpdatedAt, staleTime);
    }
    onFocus() {
      var _this$retryer2;
      const observer = this.observers.find((x2) => x2.shouldFetchOnWindowFocus());
      if (observer) {
        observer.refetch({
          cancelRefetch: false
        });
      }
      (_this$retryer2 = this.retryer) == null ? void 0 : _this$retryer2.continue();
    }
    onOnline() {
      var _this$retryer3;
      const observer = this.observers.find((x2) => x2.shouldFetchOnReconnect());
      if (observer) {
        observer.refetch({
          cancelRefetch: false
        });
      }
      (_this$retryer3 = this.retryer) == null ? void 0 : _this$retryer3.continue();
    }
    addObserver(observer) {
      if (this.observers.indexOf(observer) === -1) {
        this.observers.push(observer);
        this.clearGcTimeout();
        this.cache.notify({
          type: "observerAdded",
          query: this,
          observer
        });
      }
    }
    removeObserver(observer) {
      if (this.observers.indexOf(observer) !== -1) {
        this.observers = this.observers.filter((x2) => x2 !== observer);
        if (!this.observers.length) {
          if (this.retryer) {
            if (this.abortSignalConsumed) {
              this.retryer.cancel({
                revert: true
              });
            } else {
              this.retryer.cancelRetry();
            }
          }
          this.scheduleGc();
        }
        this.cache.notify({
          type: "observerRemoved",
          query: this,
          observer
        });
      }
    }
    getObserversCount() {
      return this.observers.length;
    }
    invalidate() {
      if (!this.state.isInvalidated) {
        this.dispatch({
          type: "invalidate"
        });
      }
    }
    fetch(options, fetchOptions) {
      var _this$options$behavio, _context$fetchOptions;
      if (this.state.fetchStatus !== "idle") {
        if (this.state.dataUpdatedAt && fetchOptions != null && fetchOptions.cancelRefetch) {
          this.cancel({
            silent: true
          });
        } else if (this.promise) {
          var _this$retryer4;
          (_this$retryer4 = this.retryer) == null ? void 0 : _this$retryer4.continueRetry();
          return this.promise;
        }
      }
      if (options) {
        this.setOptions(options);
      }
      if (!this.options.queryFn) {
        const observer = this.observers.find((x2) => x2.options.queryFn);
        if (observer) {
          this.setOptions(observer.options);
        }
      }
      if (!Array.isArray(this.options.queryKey))
        ;
      const abortController = getAbortController();
      const queryFnContext = {
        queryKey: this.queryKey,
        pageParam: void 0,
        meta: this.meta
      };
      const addSignalProperty = (object) => {
        Object.defineProperty(object, "signal", {
          enumerable: true,
          get: () => {
            if (abortController) {
              this.abortSignalConsumed = true;
              return abortController.signal;
            }
            return void 0;
          }
        });
      };
      addSignalProperty(queryFnContext);
      const fetchFn = () => {
        if (!this.options.queryFn) {
          return Promise.reject("Missing queryFn");
        }
        this.abortSignalConsumed = false;
        return this.options.queryFn(queryFnContext);
      };
      const context = {
        fetchOptions,
        options: this.options,
        queryKey: this.queryKey,
        state: this.state,
        fetchFn
      };
      addSignalProperty(context);
      (_this$options$behavio = this.options.behavior) == null ? void 0 : _this$options$behavio.onFetch(context);
      this.revertState = this.state;
      if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== ((_context$fetchOptions = context.fetchOptions) == null ? void 0 : _context$fetchOptions.meta)) {
        var _context$fetchOptions2;
        this.dispatch({
          type: "fetch",
          meta: (_context$fetchOptions2 = context.fetchOptions) == null ? void 0 : _context$fetchOptions2.meta
        });
      }
      const onError = (error) => {
        if (!(isCancelledError(error) && error.silent)) {
          this.dispatch({
            type: "error",
            error
          });
        }
        if (!isCancelledError(error)) {
          var _this$cache$config$on, _this$cache$config, _this$cache$config$on2, _this$cache$config2;
          (_this$cache$config$on = (_this$cache$config = this.cache.config).onError) == null ? void 0 : _this$cache$config$on.call(_this$cache$config, error, this);
          (_this$cache$config$on2 = (_this$cache$config2 = this.cache.config).onSettled) == null ? void 0 : _this$cache$config$on2.call(_this$cache$config2, this.state.data, error, this);
        }
        if (!this.isFetchingOptimistic) {
          this.scheduleGc();
        }
        this.isFetchingOptimistic = false;
      };
      this.retryer = createRetryer({
        fn: context.fetchFn,
        abort: abortController == null ? void 0 : abortController.abort.bind(abortController),
        onSuccess: (data) => {
          var _this$cache$config$on3, _this$cache$config3, _this$cache$config$on4, _this$cache$config4;
          if (typeof data === "undefined") {
            onError(new Error("undefined"));
            return;
          }
          this.setData(data);
          (_this$cache$config$on3 = (_this$cache$config3 = this.cache.config).onSuccess) == null ? void 0 : _this$cache$config$on3.call(_this$cache$config3, data, this);
          (_this$cache$config$on4 = (_this$cache$config4 = this.cache.config).onSettled) == null ? void 0 : _this$cache$config$on4.call(_this$cache$config4, data, this.state.error, this);
          if (!this.isFetchingOptimistic) {
            this.scheduleGc();
          }
          this.isFetchingOptimistic = false;
        },
        onError,
        onFail: (failureCount, error) => {
          this.dispatch({
            type: "failed",
            failureCount,
            error
          });
        },
        onPause: () => {
          this.dispatch({
            type: "pause"
          });
        },
        onContinue: () => {
          this.dispatch({
            type: "continue"
          });
        },
        retry: context.options.retry,
        retryDelay: context.options.retryDelay,
        networkMode: context.options.networkMode
      });
      this.promise = this.retryer.promise;
      return this.promise;
    }
    dispatch(action) {
      const reducer = (state) => {
        var _action$meta, _action$dataUpdatedAt;
        switch (action.type) {
          case "failed":
            return {
              ...state,
              fetchFailureCount: action.failureCount,
              fetchFailureReason: action.error
            };
          case "pause":
            return {
              ...state,
              fetchStatus: "paused"
            };
          case "continue":
            return {
              ...state,
              fetchStatus: "fetching"
            };
          case "fetch":
            return {
              ...state,
              fetchFailureCount: 0,
              fetchFailureReason: null,
              fetchMeta: (_action$meta = action.meta) != null ? _action$meta : null,
              fetchStatus: canFetch(this.options.networkMode) ? "fetching" : "paused",
              ...!state.dataUpdatedAt && {
                error: null,
                status: "loading"
              }
            };
          case "success":
            return {
              ...state,
              data: action.data,
              dataUpdateCount: state.dataUpdateCount + 1,
              dataUpdatedAt: (_action$dataUpdatedAt = action.dataUpdatedAt) != null ? _action$dataUpdatedAt : Date.now(),
              error: null,
              isInvalidated: false,
              status: "success",
              ...!action.manual && {
                fetchStatus: "idle",
                fetchFailureCount: 0,
                fetchFailureReason: null
              }
            };
          case "error":
            const error = action.error;
            if (isCancelledError(error) && error.revert && this.revertState) {
              return {
                ...this.revertState
              };
            }
            return {
              ...state,
              error,
              errorUpdateCount: state.errorUpdateCount + 1,
              errorUpdatedAt: Date.now(),
              fetchFailureCount: state.fetchFailureCount + 1,
              fetchFailureReason: error,
              fetchStatus: "idle",
              status: "error"
            };
          case "invalidate":
            return {
              ...state,
              isInvalidated: true
            };
          case "setState":
            return {
              ...state,
              ...action.state
            };
        }
      };
      this.state = reducer(this.state);
      notifyManager.batch(() => {
        this.observers.forEach((observer) => {
          observer.onQueryUpdate(action);
        });
        this.cache.notify({
          query: this,
          type: "updated",
          action
        });
      });
    }
  }
  function getDefaultState$1(options) {
    const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
    const hasData = typeof data !== "undefined";
    const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
    return {
      data,
      dataUpdateCount: 0,
      dataUpdatedAt: hasData ? initialDataUpdatedAt != null ? initialDataUpdatedAt : Date.now() : 0,
      error: null,
      errorUpdateCount: 0,
      errorUpdatedAt: 0,
      fetchFailureCount: 0,
      fetchFailureReason: null,
      fetchMeta: null,
      isInvalidated: false,
      status: hasData ? "success" : "loading",
      fetchStatus: "idle"
    };
  }
  class QueryCache extends Subscribable {
    constructor(config2) {
      super();
      this.config = config2 || {};
      this.queries = [];
      this.queriesMap = {};
    }
    build(client, options, state) {
      var _options$queryHash;
      const queryKey = options.queryKey;
      const queryHash = (_options$queryHash = options.queryHash) != null ? _options$queryHash : hashQueryKeyByOptions(queryKey, options);
      let query = this.get(queryHash);
      if (!query) {
        query = new Query({
          cache: this,
          logger: client.getLogger(),
          queryKey,
          queryHash,
          options: client.defaultQueryOptions(options),
          state,
          defaultOptions: client.getQueryDefaults(queryKey)
        });
        this.add(query);
      }
      return query;
    }
    add(query) {
      if (!this.queriesMap[query.queryHash]) {
        this.queriesMap[query.queryHash] = query;
        this.queries.push(query);
        this.notify({
          type: "added",
          query
        });
      }
    }
    remove(query) {
      const queryInMap = this.queriesMap[query.queryHash];
      if (queryInMap) {
        query.destroy();
        this.queries = this.queries.filter((x2) => x2 !== query);
        if (queryInMap === query) {
          delete this.queriesMap[query.queryHash];
        }
        this.notify({
          type: "removed",
          query
        });
      }
    }
    clear() {
      notifyManager.batch(() => {
        this.queries.forEach((query) => {
          this.remove(query);
        });
      });
    }
    get(queryHash) {
      return this.queriesMap[queryHash];
    }
    getAll() {
      return this.queries;
    }
    find(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);
      if (typeof filters.exact === "undefined") {
        filters.exact = true;
      }
      return this.queries.find((query) => matchQuery(filters, query));
    }
    findAll(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);
      return Object.keys(filters).length > 0 ? this.queries.filter((query) => matchQuery(filters, query)) : this.queries;
    }
    notify(event) {
      notifyManager.batch(() => {
        this.listeners.forEach((listener) => {
          listener(event);
        });
      });
    }
    onFocus() {
      notifyManager.batch(() => {
        this.queries.forEach((query) => {
          query.onFocus();
        });
      });
    }
    onOnline() {
      notifyManager.batch(() => {
        this.queries.forEach((query) => {
          query.onOnline();
        });
      });
    }
  }
  class Mutation extends Removable {
    constructor(config2) {
      super();
      this.defaultOptions = config2.defaultOptions;
      this.mutationId = config2.mutationId;
      this.mutationCache = config2.mutationCache;
      this.logger = config2.logger || defaultLogger;
      this.observers = [];
      this.state = config2.state || getDefaultState();
      this.setOptions(config2.options);
      this.scheduleGc();
    }
    setOptions(options) {
      this.options = {
        ...this.defaultOptions,
        ...options
      };
      this.updateCacheTime(this.options.cacheTime);
    }
    get meta() {
      return this.options.meta;
    }
    setState(state) {
      this.dispatch({
        type: "setState",
        state
      });
    }
    addObserver(observer) {
      if (this.observers.indexOf(observer) === -1) {
        this.observers.push(observer);
        this.clearGcTimeout();
        this.mutationCache.notify({
          type: "observerAdded",
          mutation: this,
          observer
        });
      }
    }
    removeObserver(observer) {
      this.observers = this.observers.filter((x2) => x2 !== observer);
      this.scheduleGc();
      this.mutationCache.notify({
        type: "observerRemoved",
        mutation: this,
        observer
      });
    }
    optionalRemove() {
      if (!this.observers.length) {
        if (this.state.status === "loading") {
          this.scheduleGc();
        } else {
          this.mutationCache.remove(this);
        }
      }
    }
    continue() {
      var _this$retryer$continu, _this$retryer;
      return (_this$retryer$continu = (_this$retryer = this.retryer) == null ? void 0 : _this$retryer.continue()) != null ? _this$retryer$continu : this.execute();
    }
    async execute() {
      const executeMutation = () => {
        var _this$options$retry;
        this.retryer = createRetryer({
          fn: () => {
            if (!this.options.mutationFn) {
              return Promise.reject("No mutationFn found");
            }
            return this.options.mutationFn(this.state.variables);
          },
          onFail: (failureCount, error) => {
            this.dispatch({
              type: "failed",
              failureCount,
              error
            });
          },
          onPause: () => {
            this.dispatch({
              type: "pause"
            });
          },
          onContinue: () => {
            this.dispatch({
              type: "continue"
            });
          },
          retry: (_this$options$retry = this.options.retry) != null ? _this$options$retry : 0,
          retryDelay: this.options.retryDelay,
          networkMode: this.options.networkMode
        });
        return this.retryer.promise;
      };
      const restored = this.state.status === "loading";
      try {
        var _this$mutationCache$c3, _this$mutationCache$c4, _this$options$onSucce, _this$options2, _this$mutationCache$c5, _this$mutationCache$c6, _this$options$onSettl, _this$options3;
        if (!restored) {
          var _this$mutationCache$c, _this$mutationCache$c2, _this$options$onMutat, _this$options;
          this.dispatch({
            type: "loading",
            variables: this.options.variables
          });
          await ((_this$mutationCache$c = (_this$mutationCache$c2 = this.mutationCache.config).onMutate) == null ? void 0 : _this$mutationCache$c.call(_this$mutationCache$c2, this.state.variables, this));
          const context = await ((_this$options$onMutat = (_this$options = this.options).onMutate) == null ? void 0 : _this$options$onMutat.call(_this$options, this.state.variables));
          if (context !== this.state.context) {
            this.dispatch({
              type: "loading",
              context,
              variables: this.state.variables
            });
          }
        }
        const data = await executeMutation();
        await ((_this$mutationCache$c3 = (_this$mutationCache$c4 = this.mutationCache.config).onSuccess) == null ? void 0 : _this$mutationCache$c3.call(_this$mutationCache$c4, data, this.state.variables, this.state.context, this));
        await ((_this$options$onSucce = (_this$options2 = this.options).onSuccess) == null ? void 0 : _this$options$onSucce.call(_this$options2, data, this.state.variables, this.state.context));
        await ((_this$mutationCache$c5 = (_this$mutationCache$c6 = this.mutationCache.config).onSettled) == null ? void 0 : _this$mutationCache$c5.call(_this$mutationCache$c6, data, null, this.state.variables, this.state.context, this));
        await ((_this$options$onSettl = (_this$options3 = this.options).onSettled) == null ? void 0 : _this$options$onSettl.call(_this$options3, data, null, this.state.variables, this.state.context));
        this.dispatch({
          type: "success",
          data
        });
        return data;
      } catch (error) {
        try {
          var _this$mutationCache$c7, _this$mutationCache$c8, _this$options$onError, _this$options4, _this$mutationCache$c9, _this$mutationCache$c10, _this$options$onSettl2, _this$options5;
          await ((_this$mutationCache$c7 = (_this$mutationCache$c8 = this.mutationCache.config).onError) == null ? void 0 : _this$mutationCache$c7.call(_this$mutationCache$c8, error, this.state.variables, this.state.context, this));
          if (false)
            ;
          await ((_this$options$onError = (_this$options4 = this.options).onError) == null ? void 0 : _this$options$onError.call(_this$options4, error, this.state.variables, this.state.context));
          await ((_this$mutationCache$c9 = (_this$mutationCache$c10 = this.mutationCache.config).onSettled) == null ? void 0 : _this$mutationCache$c9.call(_this$mutationCache$c10, void 0, error, this.state.variables, this.state.context, this));
          await ((_this$options$onSettl2 = (_this$options5 = this.options).onSettled) == null ? void 0 : _this$options$onSettl2.call(_this$options5, void 0, error, this.state.variables, this.state.context));
          throw error;
        } finally {
          this.dispatch({
            type: "error",
            error
          });
        }
      }
    }
    dispatch(action) {
      const reducer = (state) => {
        switch (action.type) {
          case "failed":
            return {
              ...state,
              failureCount: action.failureCount,
              failureReason: action.error
            };
          case "pause":
            return {
              ...state,
              isPaused: true
            };
          case "continue":
            return {
              ...state,
              isPaused: false
            };
          case "loading":
            return {
              ...state,
              context: action.context,
              data: void 0,
              failureCount: 0,
              failureReason: null,
              error: null,
              isPaused: !canFetch(this.options.networkMode),
              status: "loading",
              variables: action.variables
            };
          case "success":
            return {
              ...state,
              data: action.data,
              failureCount: 0,
              failureReason: null,
              error: null,
              status: "success",
              isPaused: false
            };
          case "error":
            return {
              ...state,
              data: void 0,
              error: action.error,
              failureCount: state.failureCount + 1,
              failureReason: action.error,
              isPaused: false,
              status: "error"
            };
          case "setState":
            return {
              ...state,
              ...action.state
            };
        }
      };
      this.state = reducer(this.state);
      notifyManager.batch(() => {
        this.observers.forEach((observer) => {
          observer.onMutationUpdate(action);
        });
        this.mutationCache.notify({
          mutation: this,
          type: "updated",
          action
        });
      });
    }
  }
  function getDefaultState() {
    return {
      context: void 0,
      data: void 0,
      error: null,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      status: "idle",
      variables: void 0
    };
  }
  class MutationCache extends Subscribable {
    constructor(config2) {
      super();
      this.config = config2 || {};
      this.mutations = [];
      this.mutationId = 0;
    }
    build(client, options, state) {
      const mutation = new Mutation({
        mutationCache: this,
        logger: client.getLogger(),
        mutationId: ++this.mutationId,
        options: client.defaultMutationOptions(options),
        state,
        defaultOptions: options.mutationKey ? client.getMutationDefaults(options.mutationKey) : void 0
      });
      this.add(mutation);
      return mutation;
    }
    add(mutation) {
      this.mutations.push(mutation);
      this.notify({
        type: "added",
        mutation
      });
    }
    remove(mutation) {
      this.mutations = this.mutations.filter((x2) => x2 !== mutation);
      this.notify({
        type: "removed",
        mutation
      });
    }
    clear() {
      notifyManager.batch(() => {
        this.mutations.forEach((mutation) => {
          this.remove(mutation);
        });
      });
    }
    getAll() {
      return this.mutations;
    }
    find(filters) {
      if (typeof filters.exact === "undefined") {
        filters.exact = true;
      }
      return this.mutations.find((mutation) => matchMutation(filters, mutation));
    }
    findAll(filters) {
      return this.mutations.filter((mutation) => matchMutation(filters, mutation));
    }
    notify(event) {
      notifyManager.batch(() => {
        this.listeners.forEach((listener) => {
          listener(event);
        });
      });
    }
    resumePausedMutations() {
      var _this$resuming;
      this.resuming = ((_this$resuming = this.resuming) != null ? _this$resuming : Promise.resolve()).then(() => {
        const pausedMutations = this.mutations.filter((x2) => x2.state.isPaused);
        return notifyManager.batch(() => pausedMutations.reduce((promise, mutation) => promise.then(() => mutation.continue().catch(noop)), Promise.resolve()));
      }).then(() => {
        this.resuming = void 0;
      });
      return this.resuming;
    }
  }
  function infiniteQueryBehavior() {
    return {
      onFetch: (context) => {
        context.fetchFn = () => {
          var _context$fetchOptions, _context$fetchOptions2, _context$fetchOptions3, _context$fetchOptions4, _context$state$data, _context$state$data2;
          const refetchPage = (_context$fetchOptions = context.fetchOptions) == null ? void 0 : (_context$fetchOptions2 = _context$fetchOptions.meta) == null ? void 0 : _context$fetchOptions2.refetchPage;
          const fetchMore = (_context$fetchOptions3 = context.fetchOptions) == null ? void 0 : (_context$fetchOptions4 = _context$fetchOptions3.meta) == null ? void 0 : _context$fetchOptions4.fetchMore;
          const pageParam = fetchMore == null ? void 0 : fetchMore.pageParam;
          const isFetchingNextPage = (fetchMore == null ? void 0 : fetchMore.direction) === "forward";
          const isFetchingPreviousPage = (fetchMore == null ? void 0 : fetchMore.direction) === "backward";
          const oldPages = ((_context$state$data = context.state.data) == null ? void 0 : _context$state$data.pages) || [];
          const oldPageParams = ((_context$state$data2 = context.state.data) == null ? void 0 : _context$state$data2.pageParams) || [];
          let newPageParams = oldPageParams;
          let cancelled = false;
          const addSignalProperty = (object) => {
            Object.defineProperty(object, "signal", {
              enumerable: true,
              get: () => {
                var _context$signal;
                if ((_context$signal = context.signal) != null && _context$signal.aborted) {
                  cancelled = true;
                } else {
                  var _context$signal2;
                  (_context$signal2 = context.signal) == null ? void 0 : _context$signal2.addEventListener("abort", () => {
                    cancelled = true;
                  });
                }
                return context.signal;
              }
            });
          };
          const queryFn = context.options.queryFn || (() => Promise.reject("Missing queryFn"));
          const buildNewPages = (pages, param, page, previous) => {
            newPageParams = previous ? [param, ...newPageParams] : [...newPageParams, param];
            return previous ? [page, ...pages] : [...pages, page];
          };
          const fetchPage = (pages, manual, param, previous) => {
            if (cancelled) {
              return Promise.reject("Cancelled");
            }
            if (typeof param === "undefined" && !manual && pages.length) {
              return Promise.resolve(pages);
            }
            const queryFnContext = {
              queryKey: context.queryKey,
              pageParam: param,
              meta: context.options.meta
            };
            addSignalProperty(queryFnContext);
            const queryFnResult = queryFn(queryFnContext);
            const promise2 = Promise.resolve(queryFnResult).then((page) => buildNewPages(pages, param, page, previous));
            return promise2;
          };
          let promise;
          if (!oldPages.length) {
            promise = fetchPage([]);
          } else if (isFetchingNextPage) {
            const manual = typeof pageParam !== "undefined";
            const param = manual ? pageParam : getNextPageParam(context.options, oldPages);
            promise = fetchPage(oldPages, manual, param);
          } else if (isFetchingPreviousPage) {
            const manual = typeof pageParam !== "undefined";
            const param = manual ? pageParam : getPreviousPageParam(context.options, oldPages);
            promise = fetchPage(oldPages, manual, param, true);
          } else {
            newPageParams = [];
            const manual = typeof context.options.getNextPageParam === "undefined";
            const shouldFetchFirstPage = refetchPage && oldPages[0] ? refetchPage(oldPages[0], 0, oldPages) : true;
            promise = shouldFetchFirstPage ? fetchPage([], manual, oldPageParams[0]) : Promise.resolve(buildNewPages([], oldPageParams[0], oldPages[0]));
            for (let i2 = 1; i2 < oldPages.length; i2++) {
              promise = promise.then((pages) => {
                const shouldFetchNextPage = refetchPage && oldPages[i2] ? refetchPage(oldPages[i2], i2, oldPages) : true;
                if (shouldFetchNextPage) {
                  const param = manual ? oldPageParams[i2] : getNextPageParam(context.options, pages);
                  return fetchPage(pages, manual, param);
                }
                return Promise.resolve(buildNewPages(pages, oldPageParams[i2], oldPages[i2]));
              });
            }
          }
          const finalPromise = promise.then((pages) => ({
            pages,
            pageParams: newPageParams
          }));
          return finalPromise;
        };
      }
    };
  }
  function getNextPageParam(options, pages) {
    return options.getNextPageParam == null ? void 0 : options.getNextPageParam(pages[pages.length - 1], pages);
  }
  function getPreviousPageParam(options, pages) {
    return options.getPreviousPageParam == null ? void 0 : options.getPreviousPageParam(pages[0], pages);
  }
  class QueryClient {
    constructor(config2 = {}) {
      this.queryCache = config2.queryCache || new QueryCache();
      this.mutationCache = config2.mutationCache || new MutationCache();
      this.logger = config2.logger || defaultLogger;
      this.defaultOptions = config2.defaultOptions || {};
      this.queryDefaults = [];
      this.mutationDefaults = [];
      this.mountCount = 0;
    }
    mount() {
      this.mountCount++;
      if (this.mountCount !== 1)
        return;
      this.unsubscribeFocus = focusManager.subscribe(() => {
        if (focusManager.isFocused()) {
          this.resumePausedMutations();
          this.queryCache.onFocus();
        }
      });
      this.unsubscribeOnline = onlineManager.subscribe(() => {
        if (onlineManager.isOnline()) {
          this.resumePausedMutations();
          this.queryCache.onOnline();
        }
      });
    }
    unmount() {
      var _this$unsubscribeFocu, _this$unsubscribeOnli;
      this.mountCount--;
      if (this.mountCount !== 0)
        return;
      (_this$unsubscribeFocu = this.unsubscribeFocus) == null ? void 0 : _this$unsubscribeFocu.call(this);
      this.unsubscribeFocus = void 0;
      (_this$unsubscribeOnli = this.unsubscribeOnline) == null ? void 0 : _this$unsubscribeOnli.call(this);
      this.unsubscribeOnline = void 0;
    }
    isFetching(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);
      filters.fetchStatus = "fetching";
      return this.queryCache.findAll(filters).length;
    }
    isMutating(filters) {
      return this.mutationCache.findAll({
        ...filters,
        fetching: true
      }).length;
    }
    getQueryData(queryKey, filters) {
      var _this$queryCache$find;
      return (_this$queryCache$find = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find.state.data;
    }
    ensureQueryData(arg1, arg2, arg3) {
      const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
      const cachedData = this.getQueryData(parsedOptions.queryKey);
      return cachedData ? Promise.resolve(cachedData) : this.fetchQuery(parsedOptions);
    }
    getQueriesData(queryKeyOrFilters) {
      return this.getQueryCache().findAll(queryKeyOrFilters).map(({
        queryKey,
        state
      }) => {
        const data = state.data;
        return [queryKey, data];
      });
    }
    setQueryData(queryKey, updater, options) {
      const query = this.queryCache.find(queryKey);
      const prevData = query == null ? void 0 : query.state.data;
      const data = functionalUpdate(updater, prevData);
      if (typeof data === "undefined") {
        return void 0;
      }
      const parsedOptions = parseQueryArgs(queryKey);
      const defaultedOptions = this.defaultQueryOptions(parsedOptions);
      return this.queryCache.build(this, defaultedOptions).setData(data, {
        ...options,
        manual: true
      });
    }
    setQueriesData(queryKeyOrFilters, updater, options) {
      return notifyManager.batch(() => this.getQueryCache().findAll(queryKeyOrFilters).map(({
        queryKey
      }) => [queryKey, this.setQueryData(queryKey, updater, options)]));
    }
    getQueryState(queryKey, filters) {
      var _this$queryCache$find2;
      return (_this$queryCache$find2 = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find2.state;
    }
    removeQueries(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);
      const queryCache = this.queryCache;
      notifyManager.batch(() => {
        queryCache.findAll(filters).forEach((query) => {
          queryCache.remove(query);
        });
      });
    }
    resetQueries(arg1, arg2, arg3) {
      const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
      const queryCache = this.queryCache;
      const refetchFilters = {
        type: "active",
        ...filters
      };
      return notifyManager.batch(() => {
        queryCache.findAll(filters).forEach((query) => {
          query.reset();
        });
        return this.refetchQueries(refetchFilters, options);
      });
    }
    cancelQueries(arg1, arg2, arg3) {
      const [filters, cancelOptions = {}] = parseFilterArgs(arg1, arg2, arg3);
      if (typeof cancelOptions.revert === "undefined") {
        cancelOptions.revert = true;
      }
      const promises = notifyManager.batch(() => this.queryCache.findAll(filters).map((query) => query.cancel(cancelOptions)));
      return Promise.all(promises).then(noop).catch(noop);
    }
    invalidateQueries(arg1, arg2, arg3) {
      const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
      return notifyManager.batch(() => {
        var _ref, _filters$refetchType;
        this.queryCache.findAll(filters).forEach((query) => {
          query.invalidate();
        });
        if (filters.refetchType === "none") {
          return Promise.resolve();
        }
        const refetchFilters = {
          ...filters,
          type: (_ref = (_filters$refetchType = filters.refetchType) != null ? _filters$refetchType : filters.type) != null ? _ref : "active"
        };
        return this.refetchQueries(refetchFilters, options);
      });
    }
    refetchQueries(arg1, arg2, arg3) {
      const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
      const promises = notifyManager.batch(() => this.queryCache.findAll(filters).filter((query) => !query.isDisabled()).map((query) => {
        var _options$cancelRefetc;
        return query.fetch(void 0, {
          ...options,
          cancelRefetch: (_options$cancelRefetc = options == null ? void 0 : options.cancelRefetch) != null ? _options$cancelRefetc : true,
          meta: {
            refetchPage: filters.refetchPage
          }
        });
      }));
      let promise = Promise.all(promises).then(noop);
      if (!(options != null && options.throwOnError)) {
        promise = promise.catch(noop);
      }
      return promise;
    }
    fetchQuery(arg1, arg2, arg3) {
      const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
      const defaultedOptions = this.defaultQueryOptions(parsedOptions);
      if (typeof defaultedOptions.retry === "undefined") {
        defaultedOptions.retry = false;
      }
      const query = this.queryCache.build(this, defaultedOptions);
      return query.isStaleByTime(defaultedOptions.staleTime) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
    }
    prefetchQuery(arg1, arg2, arg3) {
      return this.fetchQuery(arg1, arg2, arg3).then(noop).catch(noop);
    }
    fetchInfiniteQuery(arg1, arg2, arg3) {
      const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
      parsedOptions.behavior = infiniteQueryBehavior();
      return this.fetchQuery(parsedOptions);
    }
    prefetchInfiniteQuery(arg1, arg2, arg3) {
      return this.fetchInfiniteQuery(arg1, arg2, arg3).then(noop).catch(noop);
    }
    resumePausedMutations() {
      return this.mutationCache.resumePausedMutations();
    }
    getQueryCache() {
      return this.queryCache;
    }
    getMutationCache() {
      return this.mutationCache;
    }
    getLogger() {
      return this.logger;
    }
    getDefaultOptions() {
      return this.defaultOptions;
    }
    setDefaultOptions(options) {
      this.defaultOptions = options;
    }
    setQueryDefaults(queryKey, options) {
      const result = this.queryDefaults.find((x2) => hashQueryKey(queryKey) === hashQueryKey(x2.queryKey));
      if (result) {
        result.defaultOptions = options;
      } else {
        this.queryDefaults.push({
          queryKey,
          defaultOptions: options
        });
      }
    }
    getQueryDefaults(queryKey) {
      if (!queryKey) {
        return void 0;
      }
      const firstMatchingDefaults = this.queryDefaults.find((x2) => partialMatchKey(queryKey, x2.queryKey));
      return firstMatchingDefaults == null ? void 0 : firstMatchingDefaults.defaultOptions;
    }
    setMutationDefaults(mutationKey, options) {
      const result = this.mutationDefaults.find((x2) => hashQueryKey(mutationKey) === hashQueryKey(x2.mutationKey));
      if (result) {
        result.defaultOptions = options;
      } else {
        this.mutationDefaults.push({
          mutationKey,
          defaultOptions: options
        });
      }
    }
    getMutationDefaults(mutationKey) {
      if (!mutationKey) {
        return void 0;
      }
      const firstMatchingDefaults = this.mutationDefaults.find((x2) => partialMatchKey(mutationKey, x2.mutationKey));
      return firstMatchingDefaults == null ? void 0 : firstMatchingDefaults.defaultOptions;
    }
    defaultQueryOptions(options) {
      if (options != null && options._defaulted) {
        return options;
      }
      const defaultedOptions = {
        ...this.defaultOptions.queries,
        ...this.getQueryDefaults(options == null ? void 0 : options.queryKey),
        ...options,
        _defaulted: true
      };
      if (!defaultedOptions.queryHash && defaultedOptions.queryKey) {
        defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
      }
      if (typeof defaultedOptions.refetchOnReconnect === "undefined") {
        defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
      }
      if (typeof defaultedOptions.useErrorBoundary === "undefined") {
        defaultedOptions.useErrorBoundary = !!defaultedOptions.suspense;
      }
      return defaultedOptions;
    }
    defaultMutationOptions(options) {
      if (options != null && options._defaulted) {
        return options;
      }
      return {
        ...this.defaultOptions.mutations,
        ...this.getMutationDefaults(options == null ? void 0 : options.mutationKey),
        ...options,
        _defaulted: true
      };
    }
    clear() {
      this.queryCache.clear();
      this.mutationCache.clear();
    }
  }
  const defaultContext = createContext(void 0);
  const QueryClientSharingContext = createContext(false);
  function getQueryClientContext(context, contextSharing) {
    if (context) {
      return context;
    }
    if (contextSharing && typeof window !== "undefined") {
      if (!window.SolidQueryClientContext) {
        window.SolidQueryClientContext = defaultContext;
      }
      return window.SolidQueryClientContext;
    }
    return defaultContext;
  }
  const QueryClientProvider = (props) => {
    const mergedProps = mergeProps({
      contextSharing: false
    }, props);
    onMount(() => {
      mergedProps.client.mount();
    });
    onCleanup(() => mergedProps.client.unmount());
    const QueryClientContext = getQueryClientContext(mergedProps.context, mergedProps.contextSharing);
    return createComponent(QueryClientSharingContext.Provider, {
      get value() {
        return !mergedProps.context && mergedProps.contextSharing;
      },
      get children() {
        return createComponent(QueryClientContext.Provider, {
          get value() {
            return mergedProps.client;
          },
          get children() {
            return mergedProps.children;
          }
        });
      }
    });
  };
  const list = "index-module_list_PXrsw";
  const listLeft = "index-module_listLeft_aIkaU";
  const label = "index-module_label_kSU2W";
  const select = "index-module_select_XuPns";
  const btn = "index-module_btn_jhmhN";
  const styles$1 = {
    list,
    listLeft,
    label,
    select,
    btn
  };
  var typeEnum = /* @__PURE__ */ ((typeEnum2) => {
    typeEnum2["form"] = "form";
    typeEnum2["table"] = "table";
    return typeEnum2;
  })(typeEnum || {});
  const _tmpl$$1 = /* @__PURE__ */ template(`<div><div><p></p></div></div>`, 6), _tmpl$2$1 = /* @__PURE__ */ template(`<div></div>`, 2);
  const selectList = ["Input", "Select", "DatePicker", "RangePicker", "Textarea", "StationSelect", "GroupFormItem", "StationSelectModal", "RadioGroup", "CheckboxGroup", "Checkbox", "Cascader", "Slider", "Switch", "Transfer"];
  function List({
    data,
    onDelete,
    type,
    selectValue,
    selectOnchange
  }) {
    return (() => {
      const _el$ = _tmpl$$1.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
      insert(_el$3, () => data == null ? void 0 : data.label);
      insert(_el$2, (() => {
        const _c$ = createMemo(() => type === typeEnum.form);
        return () => _c$() && (() => {
          const _el$4 = _tmpl$2$1.cloneNode(true);
          insert(_el$4, createComponent(Select, {
            value: selectValue,
            onChange: (e2) => selectOnchange == null ? void 0 : selectOnchange(e2),
            get children() {
              return [createComponent(SelectTrigger, {
                get children() {
                  return [createComponent(SelectPlaceholder, {
                    children: "请选择"
                  }), createComponent(SelectValue, {}), createComponent(SelectIcon, {})];
                }
              }), createComponent(SelectContent, {
                get children() {
                  return createComponent(SelectListbox, {
                    get children() {
                      return selectList == null ? void 0 : selectList.map((item) => createComponent(SelectOption, {
                        value: item,
                        get children() {
                          return [createComponent(SelectOptionText, {
                            children: item
                          }), createComponent(SelectOptionIndicator, {})];
                        }
                      }));
                    }
                  });
                }
              })];
            }
          }));
          createRenderEffect(() => _el$4.className = styles$1.select);
          return _el$4;
        })();
      })(), null);
      insert(_el$, createComponent(Button, {
        get className() {
          return styles$1.btn;
        },
        colorScheme: "danger",
        onClick: () => onDelete == null ? void 0 : onDelete(data),
        children: "删除"
      }), null);
      createRenderEffect((_p$) => {
        const _v$ = styles$1.list, _v$2 = styles$1.listLeft, _v$3 = styles$1.label;
        _v$ !== _p$._v$ && (_el$.className = _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && (_el$2.className = _p$._v$2 = _v$2);
        _v$3 !== _p$._v$3 && (_el$3.className = _p$._v$3 = _v$3);
        return _p$;
      }, {
        _v$: void 0,
        _v$2: void 0,
        _v$3: void 0
      });
      return _el$;
    })();
  }
  const transformTextMapToOpts = (textMap) => {
    return Array.from(textMap).map(([value, label2]) => ({
      label: label2,
      value
    }));
  };
  const TYPE_ENUM_MAP = /* @__PURE__ */ new Map([
    [typeEnum.form, "form配置"],
    [typeEnum.table, "table配置"]
  ]);
  const box = "index-module_box_zWG0q";
  const title = "index-module_title_xRCE1";
  const titleContent = "index-module_titleContent_ucgeD";
  const content = "index-module_content_u6Ai2";
  const placeholder = "index-module_placeholder_Ph2i8";
  const buttons = "index-module_buttons_VMgCa";
  const start = "index-module_start_os-oO";
  const styles = {
    box,
    title,
    titleContent,
    content,
    placeholder,
    buttons,
    "hope-t-dFOaUu": "index-module_hope-t-dFOaUu_6Zog5",
    start
  };
  const _tmpl$ = /* @__PURE__ */ template(`<div></div>`, 2), _tmpl$2 = /* @__PURE__ */ template(`<div><p>生成模板</p><p>模板内容</p><div><p>请点击页面选择</p><div></div></div><div></div></div>`, 14);
  function Index() {
    const [visible, setVisible] = createSignal(false);
    const [radioValue, setRadioValue] = createSignal("form");
    const [list2, setList] = createSignal([]);
    const nodeHandle = (el) => {
      let newList = list2();
      newList.push({
        name: "",
        component: "",
        label: el.innerText,
        props: {
          placeholder: ""
        }
      });
      setList([...newList]);
    };
    const clickAllDom = () => {
      const allDom = document.body.querySelectorAll("#app *");
      allDom.forEach((el) => {
        el.addEventListener("click", (e2) => {
          var _a;
          const node = (_a = el.childNodes) == null ? void 0 : _a[0];
          if (!el.className.includes("mocker_") && node.nodeType === 3) {
            nodeHandle(el);
          }
          e2.stopPropagation();
          el.removeEventListener("click", () => {
          });
        });
      });
    };
    const onDelete = (index2) => {
      var _a;
      let newList = (_a = list2()) == null ? void 0 : _a.filter((c2, i2) => i2 !== index2);
      setList([...newList]);
    };
    const copy = (text) => {
      const el = document.createElement("input");
      el.setAttribute("value", text);
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      alert("复制成功");
    };
    const createCode = () => {
      let newList = list2();
      if (radioValue() === typeEnum.table) {
        newList = newList == null ? void 0 : newList.map((item) => ({
          title: item.label,
          dataIndex: "a",
          align: "center"
        }));
      }
      copy(JSON.stringify(newList));
    };
    const reset = () => {
      setList([]);
      setRadioValue("form");
    };
    const onStart = () => {
      setVisible(true);
      clickAllDom();
    };
    const listDom = createMemo(() => {
      var _a;
      const configType = radioValue();
      return (_a = list2()) == null ? void 0 : _a.map((item, index2) => createComponent(List, {
        get selectValue() {
          return item.component;
        },
        selectOnchange: (e2) => {
          let newList = list2();
          newList[index2].component = e2;
          setList([...newList]);
        },
        key: index2,
        data: item,
        onDelete: () => onDelete(index2),
        type: configType
      }));
    }, [list2, radioValue]);
    return (() => {
      const _el$ = _tmpl$.cloneNode(true);
      insert(_el$, (() => {
        const _c$ = createMemo(() => !!visible());
        return () => _c$() ? (() => {
          const _el$2 = _tmpl$2.cloneNode(true), _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling, _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling, _el$8 = _el$5.nextSibling;
          insert(_el$2, createComponent(RadioGroup, {
            get value() {
              return radioValue();
            },
            onChange: (e2) => setRadioValue(e2),
            get className() {
              return styles.titleContent;
            },
            get children() {
              return createComponent(HStack, {
                spacing: "$6",
                get children() {
                  var _a;
                  return (_a = transformTextMapToOpts(TYPE_ENUM_MAP)) == null ? void 0 : _a.map((c2) => createComponent(Radio, {
                    get key() {
                      return c2.value;
                    },
                    get value() {
                      return c2.value;
                    },
                    get children() {
                      return c2.label;
                    }
                  }));
                }
              });
            }
          }), _el$4);
          insert(_el$7, listDom);
          insert(_el$8, createComponent(Button, {
            onClick: createCode,
            children: "生成代码"
          }), null);
          insert(_el$8, createComponent(Button, {
            variant: "outline",
            onClick: reset,
            children: "清空内容"
          }), null);
          createRenderEffect((_p$) => {
            const _v$ = styles.box, _v$2 = styles.title, _v$3 = styles.title, _v$4 = styles.titleContent, _v$5 = styles.placeholder, _v$6 = styles.content, _v$7 = styles.buttons;
            _v$ !== _p$._v$ && (_el$2.className = _p$._v$ = _v$);
            _v$2 !== _p$._v$2 && (_el$3.className = _p$._v$2 = _v$2);
            _v$3 !== _p$._v$3 && (_el$4.className = _p$._v$3 = _v$3);
            _v$4 !== _p$._v$4 && (_el$5.className = _p$._v$4 = _v$4);
            _v$5 !== _p$._v$5 && (_el$6.className = _p$._v$5 = _v$5);
            _v$6 !== _p$._v$6 && (_el$7.className = _p$._v$6 = _v$6);
            _v$7 !== _p$._v$7 && (_el$8.className = _p$._v$7 = _v$7);
            return _p$;
          }, {
            _v$: void 0,
            _v$2: void 0,
            _v$3: void 0,
            _v$4: void 0,
            _v$5: void 0,
            _v$6: void 0,
            _v$7: void 0
          });
          return _el$2;
        })() : (() => {
          const _el$9 = _tmpl$.cloneNode(true);
          _el$9.$$click = onStart;
          insert(_el$9, createComponent(Button, {
            children: "点击分析原型"
          }));
          createRenderEffect(() => _el$9.className = styles.start);
          return _el$9;
        })();
      })());
      createRenderEffect(() => _el$.className = styles.warp);
      return _el$;
    })();
  }
  delegateEvents(["click"]);
  const index = "";
  let queryClient = new QueryClient();
  render(() => createComponent(HopeProvider, {
    enableCssReset: false,
    get children() {
      return createComponent(QueryClientProvider, {
        client: queryClient,
        get children() {
          return createComponent(Index, {});
        }
      });
    }
  }), (() => {
    let app = document.createElement("div");
    app.id = "my-solid-root";
    document.body.appendChild(app);
    return app;
  })());
})();

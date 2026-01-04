// ==UserScript==
// @name         Internet Roadtrip - Thermometer
// @description  Display a thermometer widget with the temperature, time, and humidity of the current location of the neal.fun/internet-roadtrip vehicle
// @namespace    me.netux.site/user-scripts/internet-roadtrip/thermometer
// @icon         https://cloudy.netux.site/neal_internet_roadtrip/Thermometer%20logo.png
// @match        https://neal.fun/*
// @author       Netux
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2.2.1
// @grant        GM.deleteValue
// @grant        GM.getValue
// @grant        GM.info
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_fetch
// @version      2.2.0
// @downloadURL https://update.greasyfork.org/scripts/543741/Internet%20Roadtrip%20-%20Thermometer.user.js
// @updateURL https://update.greasyfork.org/scripts/543741/Internet%20Roadtrip%20-%20Thermometer.meta.js
// ==/UserScript==

(async function (IRF, dom) {
'use strict';

const IS_DEV = false;
const equalFn = (a, b) => a === b;
const $PROXY = Symbol("solid-proxy");
const SUPPORTS_PROXY = typeof Proxy === "function";
const $TRACK = Symbol("solid-track");
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
let Transition = null;
let ExternalSourceConfig = null;
let Listener = null;
let Updates = null;
let Effects = null;
let ExecCount = 0;
function createRoot(fn, detachedOwner) {
  const listener = Listener,
    owner = Owner,
    unowned = fn.length === 0,
    current = detachedOwner === undefined ? owner : detachedOwner,
    root = unowned ? UNOWNED : {
      owned: null,
      cleanups: null,
      context: current ? current.context : null,
      owner: current
    },
    updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
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
  const s = {
    value,
    observers: null,
    observerSlots: null,
    comparator: options.equals || undefined
  };
  const setter = value => {
    if (typeof value === "function") {
      value = value(s.value);
    }
    return writeSignal(s, value);
  };
  return [readSignal.bind(s), setter];
}
function createRenderEffect(fn, value, options) {
  const c = createComputation(fn, value, false, STALE);
  updateComputation(c);
}
function createEffect(fn, value, options) {
  runEffects = runUserEffects;
  const c = createComputation(fn, value, false, STALE);
  if (!options || !options.render) c.user = true;
  Effects ? Effects.push(c) : updateComputation(c);
}
function createMemo(fn, value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const c = createComputation(fn, value, true, 0);
  c.observers = null;
  c.observerSlots = null;
  c.comparator = options.equals || undefined;
  updateComputation(c);
  return readSignal.bind(c);
}
function untrack(fn) {
  if (Listener === null) return fn();
  const listener = Listener;
  Listener = null;
  try {
    if (ExternalSourceConfig) ;
    return fn();
  } finally {
    Listener = listener;
  }
}
function onMount(fn) {
  createEffect(() => untrack(fn));
}
function onCleanup(fn) {
  if (Owner === null) ;else if (Owner.cleanups === null) Owner.cleanups = [fn];else Owner.cleanups.push(fn);
  return fn;
}
function getOwner() {
  return Owner;
}
function runWithOwner(o, fn) {
  const prev = Owner;
  const prevListener = Listener;
  Owner = o;
  Listener = null;
  try {
    return runUpdates(fn, true);
  } catch (err) {
    handleError(err);
  } finally {
    Owner = prev;
    Listener = prevListener;
  }
}
const [transPending, setTransPending] = /*@__PURE__*/createSignal(false);
function createContext(defaultValue, options) {
  const id = Symbol("context");
  return {
    id,
    Provider: createProvider(id),
    defaultValue
  };
}
function useContext(context) {
  let value;
  return Owner && Owner.context && (value = Owner.context[context.id]) !== undefined ? value : context.defaultValue;
}
function children(fn) {
  const children = createMemo(fn);
  const memo = createMemo(() => resolveChildren(children()));
  memo.toArray = () => {
    const c = memo();
    return Array.isArray(c) ? c : c != null ? [c] : [];
  };
  return memo;
}
function readSignal() {
  if (this.sources && (this.state)) {
    if ((this.state) === STALE) updateComputation(this);else {
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
        for (let i = 0; i < node.observers.length; i += 1) {
          const o = node.observers[i];
          const TransitionRunning = Transition && Transition.running;
          if (TransitionRunning && Transition.disposed.has(o)) ;
          if (TransitionRunning ? !o.tState : !o.state) {
            if (o.pure) Updates.push(o);else Effects.push(o);
            if (o.observers) markDownstream(o);
          }
          if (!TransitionRunning) o.state = STALE;
        }
        if (Updates.length > 10e5) {
          Updates = [];
          if (IS_DEV) ;
          throw new Error();
        }
      }, false);
    }
  }
  return value;
}
function updateComputation(node) {
  if (!node.fn) return;
  cleanNode(node);
  const time = ExecCount;
  runComputation(node, node.value, time);
}
function runComputation(node, value, time) {
  let nextValue;
  const owner = Owner,
    listener = Listener;
  Listener = Owner = node;
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
  } finally {
    Listener = listener;
    Owner = owner;
  }
  if (!node.updatedAt || node.updatedAt <= time) {
    if (node.updatedAt != null && "observers" in node) {
      writeSignal(node, nextValue);
    } else node.value = nextValue;
    node.updatedAt = time;
  }
}
function createComputation(fn, init, pure, state = STALE, options) {
  const c = {
    fn,
    state: state,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner,
    context: Owner ? Owner.context : null,
    pure
  };
  if (Owner === null) ;else if (Owner !== UNOWNED) {
    {
      if (!Owner.owned) Owner.owned = [c];else Owner.owned.push(c);
    }
  }
  return c;
}
function runTop(node) {
  if ((node.state) === 0) return;
  if ((node.state) === PENDING) return lookUpstream(node);
  if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
  const ancestors = [node];
  while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
    if (node.state) ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    node = ancestors[i];
    if ((node.state) === STALE) {
      updateComputation(node);
    } else if ((node.state) === PENDING) {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(node, ancestors[0]), false);
      Updates = updates;
    }
  }
}
function runUpdates(fn, init) {
  if (Updates) return fn();
  let wait = false;
  if (!init) Updates = [];
  if (Effects) wait = true;else Effects = [];
  ExecCount++;
  try {
    const res = fn();
    completeUpdates(wait);
    return res;
  } catch (err) {
    if (!wait) Effects = null;
    Updates = null;
    handleError(err);
  }
}
function completeUpdates(wait) {
  if (Updates) {
    runQueue(Updates);
    Updates = null;
  }
  if (wait) return;
  const e = Effects;
  Effects = null;
  if (e.length) runUpdates(() => runEffects(e), false);
}
function runQueue(queue) {
  for (let i = 0; i < queue.length; i++) runTop(queue[i]);
}
function runUserEffects(queue) {
  let i,
    userLength = 0;
  for (i = 0; i < queue.length; i++) {
    const e = queue[i];
    if (!e.user) runTop(e);else queue[userLength++] = e;
  }
  for (i = 0; i < userLength; i++) runTop(queue[i]);
}
function lookUpstream(node, ignore) {
  node.state = 0;
  for (let i = 0; i < node.sources.length; i += 1) {
    const source = node.sources[i];
    if (source.sources) {
      const state = source.state;
      if (state === STALE) {
        if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount)) runTop(source);
      } else if (state === PENDING) lookUpstream(source, ignore);
    }
  }
}
function markDownstream(node) {
  for (let i = 0; i < node.observers.length; i += 1) {
    const o = node.observers[i];
    if (!o.state) {
      o.state = PENDING;
      if (o.pure) Updates.push(o);else Effects.push(o);
      o.observers && markDownstream(o);
    }
  }
}
function cleanNode(node) {
  let i;
  if (node.sources) {
    while (node.sources.length) {
      const source = node.sources.pop(),
        index = node.sourceSlots.pop(),
        obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(),
          s = source.observerSlots.pop();
        if (index < obs.length) {
          n.sourceSlots[s] = index;
          obs[index] = n;
          source.observerSlots[index] = s;
        }
      }
    }
  }
  if (node.tOwned) {
    for (i = node.tOwned.length - 1; i >= 0; i--) cleanNode(node.tOwned[i]);
    delete node.tOwned;
  }
  if (node.owned) {
    for (i = node.owned.length - 1; i >= 0; i--) cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (i = node.cleanups.length - 1; i >= 0; i--) node.cleanups[i]();
    node.cleanups = null;
  }
  node.state = 0;
}
function castError(err) {
  if (err instanceof Error) return err;
  return new Error(typeof err === "string" ? err : "Unknown error", {
    cause: err
  });
}
function handleError(err, owner = Owner) {
  const error = castError(err);
  throw error;
}
function resolveChildren(children) {
  if (typeof children === "function" && !children.length) return resolveChildren(children());
  if (Array.isArray(children)) {
    const results = [];
    for (let i = 0; i < children.length; i++) {
      const result = resolveChildren(children[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children;
}
function createProvider(id, options) {
  return function provider(props) {
    let res;
    createRenderEffect(() => res = untrack(() => {
      Owner.context = {
        ...Owner.context,
        [id]: props.value
      };
      return children(() => props.children);
    }), undefined);
    return res;
  };
}

const FALLBACK = Symbol("fallback");
function dispose(d) {
  for (let i = 0; i < d.length; i++) d[i]();
}
function mapArray(list, mapFn, options = {}) {
  let items = [],
    mapped = [],
    disposers = [],
    len = 0,
    indexes = mapFn.length > 1 ? [] : null;
  onCleanup(() => dispose(disposers));
  return () => {
    let newItems = list() || [],
      newLen = newItems.length,
      i,
      j;
    newItems[$TRACK];
    return untrack(() => {
      let newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start, end, newEnd, item;
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
          mapped[0] = createRoot(disposer => {
            disposers[0] = disposer;
            return options.fallback();
          });
          len = 1;
        }
      }
      else if (len === 0) {
        mapped = new Array(newLen);
        for (j = 0; j < newLen; j++) {
          items[j] = newItems[j];
          mapped[j] = createRoot(mapper);
        }
        len = newLen;
      } else {
        temp = new Array(newLen);
        tempdisposers = new Array(newLen);
        indexes && (tempIndexes = new Array(newLen));
        for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++);
        for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
          temp[newEnd] = mapped[end];
          tempdisposers[newEnd] = disposers[end];
          indexes && (tempIndexes[newEnd] = indexes[end]);
        }
        newIndices = new Map();
        newIndicesNext = new Array(newEnd + 1);
        for (j = newEnd; j >= start; j--) {
          item = newItems[j];
          i = newIndices.get(item);
          newIndicesNext[j] = i === undefined ? -1 : i;
          newIndices.set(item, j);
        }
        for (i = start; i <= end; i++) {
          item = items[i];
          j = newIndices.get(item);
          if (j !== undefined && j !== -1) {
            temp[j] = mapped[i];
            tempdisposers[j] = disposers[i];
            indexes && (tempIndexes[j] = indexes[i]);
            j = newIndicesNext[j];
            newIndices.set(item, j);
          } else disposers[i]();
        }
        for (j = start; j < newLen; j++) {
          if (j in temp) {
            mapped[j] = temp[j];
            disposers[j] = tempdisposers[j];
            if (indexes) {
              indexes[j] = tempIndexes[j];
              indexes[j](j);
            }
          } else mapped[j] = createRoot(mapper);
        }
        mapped = mapped.slice(0, len = newLen);
        items = newItems.slice(0);
      }
      return mapped;
    });
    function mapper(disposer) {
      disposers[j] = disposer;
      if (indexes) {
        const [s, set] = createSignal(j);
        indexes[j] = set;
        return mapFn(newItems[j], s);
      }
      return mapFn(newItems[j]);
    }
  };
}
function indexArray(list, mapFn, options = {}) {
  let items = [],
    mapped = [],
    disposers = [],
    signals = [],
    len = 0,
    i;
  onCleanup(() => dispose(disposers));
  return () => {
    const newItems = list() || [],
      newLen = newItems.length;
    newItems[$TRACK];
    return untrack(() => {
      if (newLen === 0) {
        if (len !== 0) {
          dispose(disposers);
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
          signals = [];
        }
        if (options.fallback) {
          items = [FALLBACK];
          mapped[0] = createRoot(disposer => {
            disposers[0] = disposer;
            return options.fallback();
          });
          len = 1;
        }
        return mapped;
      }
      if (items[0] === FALLBACK) {
        disposers[0]();
        disposers = [];
        items = [];
        mapped = [];
        len = 0;
      }
      for (i = 0; i < newLen; i++) {
        if (i < items.length && items[i] !== newItems[i]) {
          signals[i](() => newItems[i]);
        } else if (i >= items.length) {
          mapped[i] = createRoot(mapper);
        }
      }
      for (; i < items.length; i++) {
        disposers[i]();
      }
      len = signals.length = disposers.length = newLen;
      items = newItems.slice(0);
      return mapped = mapped.slice(0, len);
    });
    function mapper(disposer) {
      disposers[i] = disposer;
      const [s, set] = createSignal(newItems[i]);
      signals[i] = set;
      return mapFn(s, i);
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
    if (property === $PROXY) return receiver;
    return _.get(property);
  },
  has(_, property) {
    if (property === $PROXY) return true;
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
function resolveSource(s) {
  return !(s = typeof s === "function" ? s() : s) ? {} : s;
}
function resolveSources() {
  for (let i = 0, length = this.length; i < length; ++i) {
    const v = this[i]();
    if (v !== undefined) return v;
  }
}
function mergeProps(...sources) {
  let proxy = false;
  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    proxy = proxy || !!s && $PROXY in s;
    sources[i] = typeof s === "function" ? (proxy = true, createMemo(s)) : s;
  }
  if (SUPPORTS_PROXY && proxy) {
    return new Proxy({
      get(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          const v = resolveSource(sources[i])[property];
          if (v !== undefined) return v;
        }
      },
      has(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          if (property in resolveSource(sources[i])) return true;
        }
        return false;
      },
      keys() {
        const keys = [];
        for (let i = 0; i < sources.length; i++) keys.push(...Object.keys(resolveSource(sources[i])));
        return [...new Set(keys)];
      }
    }, propTraps);
  }
  const sourcesMap = {};
  const defined = Object.create(null);
  for (let i = sources.length - 1; i >= 0; i--) {
    const source = sources[i];
    if (!source) continue;
    const sourceKeys = Object.getOwnPropertyNames(source);
    for (let i = sourceKeys.length - 1; i >= 0; i--) {
      const key = sourceKeys[i];
      if (key === "__proto__" || key === "constructor") continue;
      const desc = Object.getOwnPropertyDescriptor(source, key);
      if (!defined[key]) {
        defined[key] = desc.get ? {
          enumerable: true,
          configurable: true,
          get: resolveSources.bind(sourcesMap[key] = [desc.get.bind(source)])
        } : desc.value !== undefined ? desc : undefined;
      } else {
        const sources = sourcesMap[key];
        if (sources) {
          if (desc.get) sources.push(desc.get.bind(source));else if (desc.value !== undefined) sources.push(() => desc.value);
        }
      }
    }
  }
  const target = {};
  const definedKeys = Object.keys(defined);
  for (let i = definedKeys.length - 1; i >= 0; i--) {
    const key = definedKeys[i],
      desc = defined[key];
    if (desc && desc.get) Object.defineProperty(target, key, desc);else target[key] = desc ? desc.value : undefined;
  }
  return target;
}
function splitProps(props, ...keys) {
  if (SUPPORTS_PROXY && $PROXY in props) {
    const blocked = new Set(keys.length > 1 ? keys.flat() : keys[0]);
    const res = keys.map(k => {
      return new Proxy({
        get(property) {
          return k.includes(property) ? props[property] : undefined;
        },
        has(property) {
          return k.includes(property) && property in props;
        },
        keys() {
          return k.filter(property => property in props);
        }
      }, propTraps);
    });
    res.push(new Proxy({
      get(property) {
        return blocked.has(property) ? undefined : props[property];
      },
      has(property) {
        return blocked.has(property) ? false : property in props;
      },
      keys() {
        return Object.keys(props).filter(k => !blocked.has(k));
      }
    }, propTraps));
    return res;
  }
  const otherObject = {};
  const objects = keys.map(() => ({}));
  for (const propName of Object.getOwnPropertyNames(props)) {
    const desc = Object.getOwnPropertyDescriptor(props, propName);
    const isDefaultDesc = !desc.get && !desc.set && desc.enumerable && desc.writable && desc.configurable;
    let blocked = false;
    let objectIndex = 0;
    for (const k of keys) {
      if (k.includes(propName)) {
        blocked = true;
        isDefaultDesc ? objects[objectIndex][propName] = desc.value : Object.defineProperty(objects[objectIndex], propName, desc);
      }
      ++objectIndex;
    }
    if (!blocked) {
      isDefaultDesc ? otherObject[propName] = desc.value : Object.defineProperty(otherObject, propName, desc);
    }
  }
  return [...objects, otherObject];
}

const narrowedError = name => `Stale read from <${name}>.`;
function For(props) {
  const fallback = "fallback" in props && {
    fallback: () => props.fallback
  };
  return createMemo(mapArray(() => props.each, props.children, fallback || undefined));
}
function Index(props) {
  const fallback = "fallback" in props && {
    fallback: () => props.fallback
  };
  return createMemo(indexArray(() => props.each, props.children, fallback || undefined));
}
function Show(props) {
  const keyed = props.keyed;
  const conditionValue = createMemo(() => props.when, undefined, undefined);
  const condition = keyed ? conditionValue : createMemo(conditionValue, undefined, {
    equals: (a, b) => !a === !b
  });
  return createMemo(() => {
    const c = condition();
    if (c) {
      const child = props.children;
      const fn = typeof child === "function" && child.length > 0;
      return fn ? untrack(() => child(keyed ? c : () => {
        if (!untrack(condition)) throw narrowedError("Show");
        return conditionValue();
      })) : child;
    }
    return props.fallback;
  }, undefined, undefined);
}

const booleans = ["allowfullscreen", "async", "alpha",
"autofocus",
"autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden",
"indeterminate", "inert",
"ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless",
"selected", "adauctionheaders",
"browsingtopics",
"credentialless",
"defaultchecked", "defaultmuted", "defaultselected", "defer", "disablepictureinpicture", "disableremoteplayback", "preservespitch",
"shadowrootclonable", "shadowrootcustomelementregistry",
"shadowrootdelegatesfocus", "shadowrootserializable",
"sharedstoragewritable"
];
const Properties = /*#__PURE__*/new Set([
"className", "value",
"readOnly", "noValidate", "formNoValidate", "isMap", "noModule", "playsInline", "adAuctionHeaders",
"allowFullscreen", "browsingTopics",
"defaultChecked", "defaultMuted", "defaultSelected", "disablePictureInPicture", "disableRemotePlayback", "preservesPitch", "shadowRootClonable", "shadowRootCustomElementRegistry",
"shadowRootDelegatesFocus", "shadowRootSerializable",
"sharedStorageWritable",
...booleans]);
const ChildProperties = /*#__PURE__*/new Set(["innerHTML", "textContent", "innerText", "children"]);
const Aliases = /*#__PURE__*/Object.assign(Object.create(null), {
  className: "class",
  htmlFor: "for"
});
const PropAliases = /*#__PURE__*/Object.assign(Object.create(null), {
  class: "className",
  novalidate: {
    $: "noValidate",
    FORM: 1
  },
  formnovalidate: {
    $: "formNoValidate",
    BUTTON: 1,
    INPUT: 1
  },
  ismap: {
    $: "isMap",
    IMG: 1
  },
  nomodule: {
    $: "noModule",
    SCRIPT: 1
  },
  playsinline: {
    $: "playsInline",
    VIDEO: 1
  },
  readonly: {
    $: "readOnly",
    INPUT: 1,
    TEXTAREA: 1
  },
  adauctionheaders: {
    $: "adAuctionHeaders",
    IFRAME: 1
  },
  allowfullscreen: {
    $: "allowFullscreen",
    IFRAME: 1
  },
  browsingtopics: {
    $: "browsingTopics",
    IMG: 1
  },
  defaultchecked: {
    $: "defaultChecked",
    INPUT: 1
  },
  defaultmuted: {
    $: "defaultMuted",
    AUDIO: 1,
    VIDEO: 1
  },
  defaultselected: {
    $: "defaultSelected",
    OPTION: 1
  },
  disablepictureinpicture: {
    $: "disablePictureInPicture",
    VIDEO: 1
  },
  disableremoteplayback: {
    $: "disableRemotePlayback",
    AUDIO: 1,
    VIDEO: 1
  },
  preservespitch: {
    $: "preservesPitch",
    AUDIO: 1,
    VIDEO: 1
  },
  shadowrootclonable: {
    $: "shadowRootClonable",
    TEMPLATE: 1
  },
  shadowrootdelegatesfocus: {
    $: "shadowRootDelegatesFocus",
    TEMPLATE: 1
  },
  shadowrootserializable: {
    $: "shadowRootSerializable",
    TEMPLATE: 1
  },
  sharedstoragewritable: {
    $: "sharedStorageWritable",
    IFRAME: 1,
    IMG: 1
  }
});
function getPropAlias(prop, tagName) {
  const a = PropAliases[prop];
  return typeof a === "object" ? a[tagName] ? a["$"] : undefined : a;
}
const DelegatedEvents = /*#__PURE__*/new Set(["beforeinput", "click", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"]);
const SVGElements = /*#__PURE__*/new Set([
"altGlyph", "altGlyphDef", "altGlyphItem", "animate", "animateColor", "animateMotion", "animateTransform", "circle", "clipPath", "color-profile", "cursor", "defs", "desc", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "font", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignObject", "g", "glyph", "glyphRef", "hkern", "image", "line", "linearGradient", "marker", "mask", "metadata", "missing-glyph", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect",
"set", "stop",
"svg", "switch", "symbol", "text", "textPath",
"tref", "tspan", "use", "view", "vkern"]);
const SVGNamespace = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
};

const memo = fn => createMemo(() => fn());

function reconcileArrays(parentNode, a, b) {
  let bLength = b.length,
    aEnd = a.length,
    bEnd = bLength,
    aStart = 0,
    bStart = 0,
    after = a[aEnd - 1].nextSibling,
    map = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
      continue;
    }
    while (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
      while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a[aStart])) a[aStart].remove();
        aStart++;
      }
    } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      const node = a[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node);
      a[aEnd] = b[bEnd];
    } else {
      if (!map) {
        map = new Map();
        let i = bStart;
        while (i < bEnd) map.set(b[i], i++);
      }
      const index = map.get(a[aStart]);
      if (index != null) {
        if (bStart < index && index < bEnd) {
          let i = aStart,
            sequence = 1,
            t;
          while (++i < aEnd && i < bEnd) {
            if ((t = map.get(a[i])) == null || t !== index + sequence) break;
            sequence++;
          }
          if (sequence > index - bStart) {
            const node = a[aStart];
            while (bStart < index) parentNode.insertBefore(b[bStart++], node);
          } else parentNode.replaceChild(b[bStart++], a[aStart++]);
        } else aStart++;
      } else a[aStart++].remove();
    }
  }
}

const $$EVENTS = "_$DX_DELEGATE";
function render(code, element, init, options = {}) {
  let disposer;
  createRoot(dispose => {
    disposer = dispose;
    element === document ? code() : insert(element, code(), element.firstChild ? null : undefined, init);
  }, options.owner);
  return () => {
    disposer();
    element.textContent = "";
  };
}
function template(html, isImportNode, isSVG, isMathML) {
  let node;
  const create = () => {
    const t = document.createElement("template");
    t.innerHTML = html;
    return t.content.firstChild;
  };
  const fn = () => (node || (node = create())).cloneNode(true);
  fn.cloneNode = fn;
  return fn;
}
function delegateEvents(eventNames, document = window.document) {
  const e = document[$$EVENTS] || (document[$$EVENTS] = new Set());
  for (let i = 0, l = eventNames.length; i < l; i++) {
    const name = eventNames[i];
    if (!e.has(name)) {
      e.add(name);
      document.addEventListener(name, eventHandler);
    }
  }
}
function setAttribute(node, name, value) {
  if (value == null) node.removeAttribute(name);else node.setAttribute(name, value);
}
function setAttributeNS(node, namespace, name, value) {
  if (value == null) node.removeAttributeNS(namespace, name);else node.setAttributeNS(namespace, name, value);
}
function setBoolAttribute(node, name, value) {
  value ? node.setAttribute(name, "") : node.removeAttribute(name);
}
function className(node, value) {
  if (value == null) node.removeAttribute("class");else node.className = value;
}
function addEventListener(node, name, handler, delegate) {
  if (delegate) {
    if (Array.isArray(handler)) {
      node[`$$${name}`] = handler[0];
      node[`$$${name}Data`] = handler[1];
    } else node[`$$${name}`] = handler;
  } else if (Array.isArray(handler)) {
    const handlerFn = handler[0];
    node.addEventListener(name, handler[0] = e => handlerFn.call(node, handler[1], e));
  } else node.addEventListener(name, handler, typeof handler !== "function" && handler);
}
function classList(node, value, prev = {}) {
  const classKeys = Object.keys(value || {}),
    prevKeys = Object.keys(prev);
  let i, len;
  for (i = 0, len = prevKeys.length; i < len; i++) {
    const key = prevKeys[i];
    if (!key || key === "undefined" || value[key]) continue;
    toggleClassKey(node, key, false);
    delete prev[key];
  }
  for (i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i],
      classValue = !!value[key];
    if (!key || key === "undefined" || prev[key] === classValue || !classValue) continue;
    toggleClassKey(node, key, true);
    prev[key] = classValue;
  }
  return prev;
}
function style(node, value, prev) {
  if (!value) return prev ? setAttribute(node, "style") : value;
  const nodeStyle = node.style;
  if (typeof value === "string") return nodeStyle.cssText = value;
  typeof prev === "string" && (nodeStyle.cssText = prev = undefined);
  prev || (prev = {});
  value || (value = {});
  let v, s;
  for (s in prev) {
    value[s] == null && nodeStyle.removeProperty(s);
    delete prev[s];
  }
  for (s in value) {
    v = value[s];
    if (v !== prev[s]) {
      nodeStyle.setProperty(s, v);
      prev[s] = v;
    }
  }
  return prev;
}
function setStyleProperty(node, name, value) {
  value != null ? node.style.setProperty(name, value) : node.style.removeProperty(name);
}
function spread(node, props = {}, isSVG, skipChildren) {
  const prevProps = {};
  if (!skipChildren) {
    createRenderEffect(() => prevProps.children = insertExpression(node, props.children, prevProps.children));
  }
  createRenderEffect(() => typeof props.ref === "function" && use(props.ref, node));
  createRenderEffect(() => assign(node, props, isSVG, true, prevProps, true));
  return prevProps;
}
function use(fn, element, arg) {
  return untrack(() => fn(element, arg));
}
function insert(parent, accessor, marker, initial) {
  if (marker !== undefined && !initial) initial = [];
  if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
  createRenderEffect(current => insertExpression(parent, accessor(), current, marker), initial);
}
function assign(node, props, isSVG, skipChildren, prevProps = {}, skipRef = false) {
  props || (props = {});
  for (const prop in prevProps) {
    if (!(prop in props)) {
      if (prop === "children") continue;
      prevProps[prop] = assignProp(node, prop, null, prevProps[prop], isSVG, skipRef, props);
    }
  }
  for (const prop in props) {
    if (prop === "children") {
      continue;
    }
    const value = props[prop];
    prevProps[prop] = assignProp(node, prop, value, prevProps[prop], isSVG, skipRef, props);
  }
}
function toPropertyName(name) {
  return name.toLowerCase().replace(/-([a-z])/g, (_, w) => w.toUpperCase());
}
function toggleClassKey(node, key, value) {
  const classNames = key.trim().split(/\s+/);
  for (let i = 0, nameLen = classNames.length; i < nameLen; i++) node.classList.toggle(classNames[i], value);
}
function assignProp(node, prop, value, prev, isSVG, skipRef, props) {
  let isCE, isProp, isChildProp, propAlias, forceProp;
  if (prop === "style") return style(node, value, prev);
  if (prop === "classList") return classList(node, value, prev);
  if (value === prev) return prev;
  if (prop === "ref") {
    if (!skipRef) value(node);
  } else if (prop.slice(0, 3) === "on:") {
    const e = prop.slice(3);
    prev && node.removeEventListener(e, prev, typeof prev !== "function" && prev);
    value && node.addEventListener(e, value, typeof value !== "function" && value);
  } else if (prop.slice(0, 10) === "oncapture:") {
    const e = prop.slice(10);
    prev && node.removeEventListener(e, prev, true);
    value && node.addEventListener(e, value, true);
  } else if (prop.slice(0, 2) === "on") {
    const name = prop.slice(2).toLowerCase();
    const delegate = DelegatedEvents.has(name);
    if (!delegate && prev) {
      const h = Array.isArray(prev) ? prev[0] : prev;
      node.removeEventListener(name, h);
    }
    if (delegate || value) {
      addEventListener(node, name, value, delegate);
      delegate && delegateEvents([name]);
    }
  } else if (prop.slice(0, 5) === "attr:") {
    setAttribute(node, prop.slice(5), value);
  } else if (prop.slice(0, 5) === "bool:") {
    setBoolAttribute(node, prop.slice(5), value);
  } else if ((forceProp = prop.slice(0, 5) === "prop:") || (isChildProp = ChildProperties.has(prop)) || !isSVG && ((propAlias = getPropAlias(prop, node.tagName)) || (isProp = Properties.has(prop))) || (isCE = node.nodeName.includes("-") || "is" in props)) {
    if (forceProp) {
      prop = prop.slice(5);
      isProp = true;
    }
    if (prop === "class" || prop === "className") className(node, value);else if (isCE && !isProp && !isChildProp) node[toPropertyName(prop)] = value;else node[propAlias || prop] = value;
  } else {
    const ns = isSVG && prop.indexOf(":") > -1 && SVGNamespace[prop.split(":")[0]];
    if (ns) setAttributeNS(node, ns, prop, value);else setAttribute(node, Aliases[prop] || prop, value);
  }
  return value;
}
function eventHandler(e) {
  let node = e.target;
  const key = `$$${e.type}`;
  const oriTarget = e.target;
  const oriCurrentTarget = e.currentTarget;
  const retarget = value => Object.defineProperty(e, "target", {
    configurable: true,
    value
  });
  const handleNode = () => {
    const handler = node[key];
    if (handler && !node.disabled) {
      const data = node[`${key}Data`];
      data !== undefined ? handler.call(node, data, e) : handler.call(node, e);
      if (e.cancelBubble) return;
    }
    node.host && typeof node.host !== "string" && !node.host._$host && node.contains(e.target) && retarget(node.host);
    return true;
  };
  const walkUpTree = () => {
    while (handleNode() && (node = node._$host || node.parentNode || node.host));
  };
  Object.defineProperty(e, "currentTarget", {
    configurable: true,
    get() {
      return node || document;
    }
  });
  if (e.composedPath) {
    const path = e.composedPath();
    retarget(path[0]);
    for (let i = 0; i < path.length - 2; i++) {
      node = path[i];
      if (!handleNode()) break;
      if (node._$host) {
        node = node._$host;
        walkUpTree();
        break;
      }
      if (node.parentNode === oriCurrentTarget) {
        break;
      }
    }
  }
  else walkUpTree();
  retarget(oriTarget);
}
function insertExpression(parent, value, current, marker, unwrapArray) {
  while (typeof current === "function") current = current();
  if (value === current) return current;
  const t = typeof value,
    multi = marker !== undefined;
  parent = multi && current[0] && current[0].parentNode || parent;
  if (t === "string" || t === "number") {
    if (t === "number") {
      value = value.toString();
      if (value === current) return current;
    }
    if (multi) {
      let node = current[0];
      if (node && node.nodeType === 3) {
        node.data !== value && (node.data = value);
      } else node = document.createTextNode(value);
      current = cleanChildren(parent, current, marker, node);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else current = parent.textContent = value;
    }
  } else if (value == null || t === "boolean") {
    current = cleanChildren(parent, current, marker);
  } else if (t === "function") {
    createRenderEffect(() => {
      let v = value();
      while (typeof v === "function") v = v();
      current = insertExpression(parent, v, current, marker);
    });
    return () => current;
  } else if (Array.isArray(value)) {
    const array = [];
    const currentArray = current && Array.isArray(current);
    if (normalizeIncomingArray(array, value, current, unwrapArray)) {
      createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
      return () => current;
    }
    if (array.length === 0) {
      current = cleanChildren(parent, current, marker);
      if (multi) return current;
    } else if (currentArray) {
      if (current.length === 0) {
        appendNodes(parent, array, marker);
      } else reconcileArrays(parent, current, array);
    } else {
      current && cleanChildren(parent);
      appendNodes(parent, array);
    }
    current = array;
  } else if (value.nodeType) {
    if (Array.isArray(current)) {
      if (multi) return current = cleanChildren(parent, current, marker, value);
      cleanChildren(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else parent.replaceChild(value, parent.firstChild);
    current = value;
  } else ;
  return current;
}
function normalizeIncomingArray(normalized, array, current, unwrap) {
  let dynamic = false;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i],
      prev = current && current[normalized.length],
      t;
    if (item == null || item === true || item === false) ; else if ((t = typeof item) === "object" && item.nodeType) {
      normalized.push(item);
    } else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
    } else if (t === "function") {
      if (unwrap) {
        while (typeof item === "function") item = item();
        dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else {
      const value = String(item);
      if (prev && prev.nodeType === 3 && prev.data === value) normalized.push(prev);else normalized.push(document.createTextNode(value));
    }
  }
  return dynamic;
}
function appendNodes(parent, array, marker = null) {
  for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren(parent, current, marker, replacement) {
  if (marker === undefined) return parent.textContent = "";
  const node = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i = current.length - 1; i >= 0; i--) {
      const el = current[i];
      if (node !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i) isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);else isParent && el.remove();
      } else inserted = true;
    }
  } else parent.insertBefore(node, marker);
  return [node];
}
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
function createElement(tagName, isSVG = false, is = undefined) {
  return isSVG ? document.createElementNS(SVG_NAMESPACE, tagName) : document.createElement(tagName, {
    is
  });
}
function Portal(props) {
  const {
      useShadow
    } = props,
    marker = document.createTextNode(""),
    mount = () => props.mount || document.body,
    owner = getOwner();
  let content;
  createEffect(() => {
    content || (content = runWithOwner(owner, () => createMemo(() => props.children)));
    const el = mount();
    if (el instanceof HTMLHeadElement) {
      const [clean, setClean] = createSignal(false);
      const cleanup = () => setClean(true);
      createRoot(dispose => insert(el, () => !clean() ? content() : dispose(), null));
      onCleanup(cleanup);
    } else {
      const container = createElement(props.isSVG ? "g" : "div", props.isSVG),
        renderRoot = useShadow && container.attachShadow ? container.attachShadow({
          mode: "open"
        }) : container;
      Object.defineProperty(container, "_$host", {
        get() {
          return marker.parentNode;
        },
        configurable: true
      });
      insert(renderRoot, content);
      el.appendChild(container);
      props.ref && props.ref(container);
      onCleanup(() => el.removeChild(container));
    }
  }, undefined, {
    render: true
  });
  return marker;
}
function createDynamic(component, props) {
  const cached = createMemo(component);
  return createMemo(() => {
    const component = cached();
    switch (typeof component) {
      case "function":
        return untrack(() => component(props));
      case "string":
        const isSvg = SVGElements.has(component);
        const el = createElement(component, isSvg, props.is);
        spread(el, props, isSvg);
        return el;
    }
  });
}
function Dynamic(props) {
  const [, others] = splitProps(props, ["component"]);
  return createDynamic(() => props.component, others);
}

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

const [widgetPanel, setWidgetPanel] = createSignal(null);
const [tickForecastInterval, setTickForecastInterval] = createSignal(null);
const [irfTab, setIrfTab] = createSignal(null);
const [loading, setLoading] = createSignal(false);
const [forecast, setForecast] = createSignal(null);
const [error, setError] = createSignal(null);
function setForecastLoading() {
  setLoading(true);
}
function setForecastLoadSuccess(forecast) {
  setLoading(false);
  setForecast(forecast);
  setError(null);
}
function setForecastLoadFailure(error) {
  setLoading(false);
  setError(error);
}

const zeroOne = (value, min, max) => (value - min) / (max - min);
function GM_fetch(details) {
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest(_extends({}, details, {
      onload: response => resolve(response),
      onerror: err => reject(err)
    }));
  });
}
const waitForCoordinatesToBeSetAtLeastOnce = IRF.vdom.container.then(containerVDOM => {
  return new Promise(resolve => {
    containerVDOM.state.changeStop = new Proxy(containerVDOM.state.changeStop, {
      apply(ogChangeStop, thisArg, args) {
        const returnedValue = ogChangeStop.apply(thisArg, args);
        resolve();
        return returnedValue;
      }
    });
  });
});
const offsetTimezone = (date, utcOffsetSeconds) => {
  const localUtcOffsetUtcSeconds = -date.getTimezoneOffset() * 60;
  const result = new Date(date);
  result.setSeconds(result.getSeconds() - localUtcOffsetUtcSeconds + utcOffsetSeconds);
  return result;
};
const isTrulyInternetRoadtrip = () => IRF.isInternetRoadtrip &&
// has hooked into IRT
location.pathname.startsWith('/internet-roadtrip'); // is on the IRT page

const waitFor = async (checkFn, {
  intervalMs = 1000
} = {}) => {
  const immediateSuccess = await checkFn();
  if (immediateSuccess) {
    return;
  }
  return await new Promise(resolve => {
    const interval = setInterval(async () => {
      if (await checkFn()) {
        clearInterval(interval);
        resolve();
      }
    }, intervalMs);
  });
};

const MOD_NAME = 'Thermometer';
const MOD_DOM_SAFE_PREFIX = 'thermometer-';
const MOD_LOG_PREFIX = `[${MOD_NAME}]`;
const RAD_TO_DEG = 180 / Math.PI;
const IS_MOBILE_MEDIA_QUERY = 'screen and (max-width: 900px)';
const TEMPERATURE_UNITS = {
  celsius: {
    label: 'Celsius',
    unit: '°C',
    fromCelsius: celsius => celsius,
    toCelsius: celsius => celsius
  },
  fahrenheit: {
    label: 'Fahrenheit',
    unit: '°F',
    fromCelsius: celsius => celsius * 1.8 + 32,
    toCelsius: fahrenheit => (fahrenheit - 32) / 1.8
  },
  felsius: {
    label: 'Felsius (xkcd #1923)',
    unit: '°Є',
    fromCelsius: celsius => 7 * celsius / 5 + 16,
    toCelsius: felsius => 5 * (felsius - 16) / 7
  },
  kelvin: {
    label: 'Kelvin',
    unit: 'K',
    fromCelsius: celsius => celsius + 273,
    toCelsius: kelvin => kelvin - 273
  }
};

async function fetchForecast([latitude, longitude]) {
  const forecastApiUrl = `https://api.open-meteo.com/v1/forecast?${[`latitude=${latitude}`, `longitude=${longitude}`, `current=${['temperature_2m', 'relative_humidity_2m'].join(',')}`, `temperature_unit=celsius`, `timezone=auto`].join('&')}`;
  const {
    status,
    response: forecastStr
  } = await GM_fetch({
    url: forecastApiUrl,
    headers: {
      'content-type': 'application/json'
    },
    timeout: 10000
  });
  if (status !== 200) {
    throw new Error(`Got a ${status} status code when requesting forecast information`);
  }
  if (forecastStr == null) {
    throw new Error(`For some reason the forecast information was nullish`);
  }
  let forecast;
  try {
    forecast = JSON.parse(forecastStr);
  } catch (error) {
    throw new Error(`Could not parse forecast JSON: ${error.toString()}`);
  }
  return forecast;
}

/**
 * Solid's `onCleanup` that doesn't warn in development if used outside of a component.
 */
const tryOnCleanup = onCleanup;
/**
 * A hydratable version of the {@link createSignal}. It will use the serverValue on the server and the update function on the client. If initialized during hydration it will use serverValue as the initial value and update it once hydration is complete.
 *
 * @param serverValue initial value of the state on the server
 * @param update called once on the client or on hydration to initialize the value
 * @param options {@link SignalOptions}
 * @returns
 * ```ts
 * [state: Accessor<T>, setState: Setter<T>]
 * ```
 * @see {@link createSignal}
 */
function createHydratableSignal(serverValue, update, options) {
    return createSignal(update(), options);
}

function makeEventListener(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    return tryOnCleanup(target.removeEventListener.bind(target, type, handler, options));
}
// // /* TypeCheck */
// const mouseHandler = (e: MouseEvent) => {};
// const touchHandler = (e: TouchEvent) => {};
// const el = document.createElement("div");
// // dom events
// createEventListener(window as Window | undefined, "mousemove", mouseHandler);
// createEventListener(document, "touchstart", touchHandler);
// createEventListener(el, "mousemove", mouseHandler);
// createEventListener(() => el, "touchstart", touchHandler);
// const mouseSignal = createEventSignal(window, "mousemove");
// const touchSignal = createEventSignal(() => document, "touchstart");
// // custom events
// createEventListener<{ test: MouseEvent }>(window, "test", mouseHandler);
// createEventListener<{ test: Event; custom: MouseEvent }, "custom">(
//   () => el,
//   "custom",
//   mouseHandler
// );
// createEventListener<{ test: Event }>(new EventTarget(), "test", () => console.log("test"));
// const testSignal = createEventSignal<{ test: MouseEvent }>(window, "test");
// const customSignal = createEventSignal<{ test: Event; custom: MouseEvent }, "custom">(
//   () => document,
//   "custom"
// );
// // directive
// eventListener(el, () => ["mousemove", mouseHandler, { passive: true }]);
// eventListener(el, () => ["custom", e => {}]);

/**
 * Creates a reactive root that is shared across every instance it was used in. Singleton root gets created when the returned function gets first called, and disposed when last reactive context listening to it gets disposed. Only to be recreated again when a new listener appears.
 * @param factory function where you initialize your reactive primitives
 * @returns function, registering reactive owner as one of the listeners, returns the value {@link factory} returned.
 * @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/rootless#createSingletonRoot
 * @example
 * const useState = createSingletonRoot(() => {
 *    return createMemo(() => {...})
 * });
 *
 * // later in a component:
 * const state = useState();
 * state()
 *
 * // in another component
 * // previously created primitive would get reused
 * const state = useState();
 * ...
 */
function createSingletonRoot(factory, detachedOwner = getOwner()) {
    let listeners = 0, value, disposeRoot;
    return () => {
        listeners++;
        onCleanup(() => {
            listeners--;
            queueMicrotask(() => {
                if (!listeners && disposeRoot) {
                    disposeRoot();
                    disposeRoot = value = undefined;
                }
            });
        });
        if (!disposeRoot) {
            createRoot(dispose => (value = factory((disposeRoot = dispose))), detachedOwner);
        }
        return value;
    };
}
/**
 * @warning Experimental API - there might be a better way so solve singletons with SSR and hydration.
 *
 * A hydratable version of {@link createSingletonRoot}.
 * It will create a singleton root, unless it's running in SSR or during hydration.
 * Then it will deopt to a calling the {@link factory} function with a regular root.
 * @param factory function where you initialize your reactive primitives
 * @returns
 * ```ts
 * // function that returns the value returned by factory
 * () => T
 * ```
 */
function createHydratableSingletonRoot(factory) {
    const owner = getOwner();
    const singleton = createSingletonRoot(factory, owner);
    return () => (singleton());
}

/**
 * Creates a very simple and straightforward media query monitor.
 *
 * @param query Media query to listen for
 * @param fallbackState Server fallback state *(Defaults to `false`)*
 * @returns Boolean value if media query is met or not
 *
 * @example
 * ```ts
 * const isSmall = createMediaQuery("(max-width: 767px)");
 * console.log(isSmall());
 * ```
 */
function createMediaQuery(query, serverFallback = false) {
    const mql = window.matchMedia(query);
    const [state, setState] = createHydratableSignal(serverFallback, () => mql.matches);
    const update = () => setState(mql.matches);
    makeEventListener(mql, "change", update);
    return state;
}
/**
 * Provides a signal indicating if the user has requested dark color theme. The setting is being watched with a [Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme).
 *
 * @param serverFallback value that should be returned on the server — defaults to `false`
 *
 * @returns a boolean signal
 * @example
 * const prefersDark = usePrefersDark();
 * createEffect(() => {
 *    prefersDark() // => boolean
 * });
 */
function createPrefersDark(serverFallback) {
    return createMediaQuery("(prefers-color-scheme: dark)", serverFallback);
}
/**
 * Provides a signal indicating if the user has requested dark color theme. The setting is being watched with a [Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme).
 *
 * This is a [singleton root primitive](https://github.com/solidjs-community/solid-primitives/tree/main/packages/rootless#createSingletonRoot) except if during hydration.
 *
 * @returns a boolean signal
 * @example
 * const prefersDark = usePrefersDark();
 * createEffect(() => {
 *    prefersDark() // => boolean
 * });
 */
/*#__PURE__*/ createHydratableSingletonRoot(createPrefersDark.bind(void 0, false));

/* #region Widget Position */

const makeWidgetPositionSetting = ({
  x,
  y
}) => {
  const result = {};
  if (x < window.innerWidth / 2) {
    result.left = x;
  } else {
    result.right = window.innerWidth - x;
  }
  if (y < window.innerHeight / 2) {
    result.top = y;
  } else {
    result.bottom = window.innerHeight - y;
  }
  return result;
};
const getDefaultWidgetPosition = () => ({
  left: Math.round(window.innerWidth / 2),
  top: Math.round(window.innerHeight / 2)
});
/* #endregion Widget Position */

/* #region Default Temperature Gradient */
const DEFAULT_TEMPERATURE_GRADIENT = [{
  temperatureCelsius: -20,
  color: '#f5f5f5'
}, {
  temperatureCelsius: -10,
  color: '#82cdff'
}, {
  temperatureCelsius: 0,
  color: '#0c9eff'
}, {
  temperatureCelsius: 15,
  color: '#043add'
}, {
  temperatureCelsius: 18.5,
  color: '#c0c23d'
}, {
  temperatureCelsius: 22.5,
  color: '#ffd86d'
}, {
  temperatureCelsius: 27.5,
  color: '#ffa538'
}, {
  temperatureCelsius: 32.5,
  color: '#c92626'
}, {
  temperatureCelsius: 40,
  color: '#6a0b39'
}];
const {
  min: DEFAULT_TEMPERATURE_GRADIENT_MIN_TEMPERATURE,
  max: DEFAULT_TEMPERATURE_GRADIENT_MAX_TEMPERATURE
} = DEFAULT_TEMPERATURE_GRADIENT.reduce(({
  min: previousMin,
  max: previousMax
}, {
  temperatureCelsius
}) => ({
  min: Math.min(temperatureCelsius, previousMin),
  max: Math.max(temperatureCelsius, previousMax)
}), {
  min: 0,
  max: 0
});
const getDefaultTemperatureGradientSettings = () => ({
  temperatureGradient: DEFAULT_TEMPERATURE_GRADIENT.map(({
    temperatureCelsius,
    color
  }) => ({
    percent: zeroOne(temperatureCelsius, DEFAULT_TEMPERATURE_GRADIENT_MIN_TEMPERATURE, DEFAULT_TEMPERATURE_GRADIENT_MAX_TEMPERATURE),
    color
  })),
  temperatureGradientMinCelsius: DEFAULT_TEMPERATURE_GRADIENT_MIN_TEMPERATURE,
  temperatureGradientMaxCelsius: DEFAULT_TEMPERATURE_GRADIENT_MAX_TEMPERATURE
});
/* #endregion Default Temperature Gradient */

const [settings, setSettings] = createSignal(_extends({
  widgetPosition: undefined,
  widgetMobilePosition: undefined,
  showClock: true,
  time24Hours: true,
  timeIncludeSeconds: false,
  showTemperature: true,
  temperatureUnit: 'celsius'
}, getDefaultTemperatureGradientSettings(), {
  showRelativeHumidity: true
}));

// Load
{
  const newSettings = _extends({}, settings());
  for (const key in settings()) {
    newSettings[key] = await( GM.getValue(key, newSettings[key]));
  }

  // Migration from <2.0.0, when the widget was refered to as an overlay
  {
    const noValue = Symbol();
    const hasWidgetPositionValue = (await( GM.getValue('widgetPosition', noValue))) === noValue;
    const oldOverlayPositionValue = await( GM.getValue('overlayPosition', noValue));
    if (!hasWidgetPositionValue && oldOverlayPositionValue !== noValue) {
      newSettings.widgetPosition = makeWidgetPositionSetting({
        x: oldOverlayPositionValue.x,
        y: oldOverlayPositionValue.y
      });
      await( GM.deleteValue('overlayPosition'));
    }
  }

  // Migration from <2.1.0, when the widget position was stored as a percentage
  {
    if (newSettings.widgetPosition != null && typeof newSettings.widgetPosition === 'object' && !('left' in newSettings.widgetPosition || 'right' in newSettings.widgetPosition) && !('top' in newSettings.widgetPosition || 'bottom' in newSettings.widgetPosition)) {
      const unknownWidgetPosition = newSettings.widgetPosition;
      if ('x' in unknownWidgetPosition && typeof unknownWidgetPosition.x === 'number' && 'y' in unknownWidgetPosition && typeof unknownWidgetPosition.y === 'number') {
        newSettings.widgetPosition = makeWidgetPositionSetting({
          x: unknownWidgetPosition.x * window.innerWidth,
          y: unknownWidgetPosition.y * window.innerHeight
        });
      } else {
        console.warn(MOD_LOG_PREFIX, 'Corrupt widget position setting detected. Resetting...');
        newSettings.widgetPosition = undefined;
      }
    }
  }
  setSettings(newSettings);
}

// Save
async function saveSettings(change) {
  if (typeof change === 'function') {
    setSettings(change);
  } else if (typeof change === 'object') {
    setSettings(prevSettings => _extends({}, prevSettings, change));
  }
  const currentSettings = settings();
  for (const key in currentSettings) {
    await GM.setValue(key, currentSettings[key]);
  }
}
const isMobile = createMediaQuery(IS_MOBILE_MEDIA_QUERY);
const resolvedWidgetPositionSetting = createMemo(() => {
  let anchor;
  if (isMobile()) {
    var _ref, _settings$widgetMobil;
    anchor = (_ref = (_settings$widgetMobil = settings().widgetMobilePosition) != null ? _settings$widgetMobil : settings().widgetPosition) != null ? _ref : getDefaultWidgetPosition();
  } else {
    var _ref2, _settings$widgetPosit;
    anchor = (_ref2 = (_settings$widgetPosit = settings().widgetPosition) != null ? _settings$widgetPosit : settings().widgetMobilePosition) != null ? _ref2 : getDefaultWidgetPosition();
  }
  return {
    x: 'left' in anchor ? anchor.left : window.innerWidth - anchor.right,
    y: 'top' in anchor ? anchor.top : window.innerHeight - anchor.bottom
  };
});
const resolvedWidgetPositionKey = () => isMobile() ? 'widgetMobilePosition' : 'widgetPosition';

/*
 * This whole file is heavily based on https://github.com/violentmonkey/vm-ui/blob/00592622a01e48a4ac27a743254d82b1ebcd6d02/src/util/movable.ts
 * with the following modifications:
 * - Make Movable an EventTarget
 *   - Add move-start, moving, and move-end events to Movable
 *   - Replaces the old onMoved callback in MovableOptions
 * - Add handler elements system to Movable
 * - Add methods to retrieve and set position of the Movable
 * - Add support for touch events
 */

class Movable extends EventTarget {
  constructor(el, options) {
    super();
    this.el = null;
    this.options = null;
    this.dragging = null;
    this.isTouchEvent = e => e.type.startsWith('touch');
    this.getEventPointerPosition = e => {
      if (this.isTouchEvent(e)) {
        const {
          clientX,
          clientY
        } = e.touches[this.touchIdentifier];
        return {
          clientX,
          clientY
        };
      } else {
        const {
          clientX,
          clientY
        } = e;
        return {
          clientX,
          clientY
        };
      }
    };
    this.onMouseDown = e => {
      if (this.isTouchEvent(e)) {
        var _e$changedTouches;
        this.touchIdentifier = (_e$changedTouches = e.changedTouches) == null || (_e$changedTouches = _e$changedTouches[0]) == null ? void 0 : _e$changedTouches.identifier;
      }
      const {
        handlerElements = []
      } = this.options;
      if (handlerElements.length > 0 && !handlerElements.some(handlerEl => e.target === handlerEl || handlerEl.contains(e.target))) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const {
        x,
        y
      } = this.el.getBoundingClientRect();
      const {
        clientX,
        clientY
      } = this.getEventPointerPosition(e);
      this.dragging = {
        x: clientX - x,
        y: clientY - y
      };
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('touchmove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
      document.addEventListener('touchend', this.onMouseUp);
      this.dispatchEvent(new Event('move-start'));
    };
    this.onMouseMove = e => {
      if (this.isTouchEvent(e) && this.touchIdentifier != null && !Array.from(e.changedTouches).some(touch => this.touchIdentifier === touch.identifier)) return;
      if (!this.dragging) return;
      const {
        x,
        y
      } = this.dragging;
      const {
        clientX,
        clientY
      } = this.getEventPointerPosition(e);
      this.setPosition(clientX - x, clientY - y);
    };
    this.onMouseUp = e => {
      if (this.isTouchEvent(e) && this.touchIdentifier != null && !Array.from(e.changedTouches).some(touch => this.touchIdentifier === touch.identifier)) return;
      this.dragging = null;
      this.touchIdentifier = null;
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('touchmove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
      document.removeEventListener('touchend', this.onMouseUp);
      this.dispatchEvent(new Event('move-end'));
    };
    this.el = el;
    this.setOptions(options);
  }
  setOptions(options) {
    this.options = _extends({}, Movable.defaultOptions, options);
  }
  applyOptions(newOptions) {
    this.options = _extends({}, this.options, newOptions);
  }
  enable() {
    this.el.addEventListener('mousedown', this.onMouseDown);
    this.el.addEventListener('touchstart', this.onMouseDown);
  }
  disable() {
    this.dragging = undefined;
    this.el.removeEventListener('mousedown', this.onMouseDown);
    this.el.removeEventListener('touchstart', this.onMouseDown);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('touchmove', this.onMouseUp);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('touchend', this.onMouseUp);
  }
  setPosition(x, y) {
    const {
      origin
    } = this.options;
    const {
      offsetWidth: width,
      offsetHeight: height
    } = this.el;
    const {
      clientWidth,
      clientHeight
    } = document.documentElement;
    const left = Math.max(0, Math.min(x, clientWidth - width));
    const top = Math.max(0, Math.min(y, clientHeight - height));
    const position = {
      top: 'auto',
      left: 'auto',
      right: 'auto',
      bottom: 'auto'
    };
    if (origin.x === 'start' || origin.x === 'auto' && left + left + width < clientWidth) {
      position.left = `${left}px`;
    } else {
      position.right = `${clientWidth - left - width}px`;
    }
    if (origin.y === 'start' || origin.y === 'auto' && top + top + height < clientHeight) {
      position.top = `${top}px`;
    } else {
      position.bottom = `${clientHeight - top - height}px`;
    }
    Object.assign(this.el.style, position);
    this.dispatchEvent(new Event('moving'));
  }
  getPosition() {
    const {
      left,
      top
    } = this.el.getBoundingClientRect();
    return {
      left,
      top
    };
  }
}
Movable.defaultOptions = {
  origin: {
    x: 'auto',
    y: 'auto'
  }
};

const shadowRootContext = createContext(null);
var ShadowRooted = props => {
  props = mergeProps({
    hostTag: 'div'
  }, props);
  let hostEl;
  const [shadowRoot, setShadowRoot] = createSignal(null);
  onMount(() => {
    setShadowRoot(hostEl.attachShadow({
      mode: 'open'
    }));
  });
  return [createComponent(Dynamic, {
    get component() {
      return props.hostTag;
    },
    style: {
      display: 'contents'
    },
    ref(r$) {
      var _ref$ = hostEl;
      typeof _ref$ === "function" ? _ref$(r$) : hostEl = r$;
    }
  }), createComponent(shadowRootContext.Provider, {
    value: shadowRoot,
    get children() {
      return createComponent(Show, {
        get when() {
          return (shadowRoot == null ? void 0 : shadowRoot()) != null;
        },
        get children() {
          return createComponent(Portal, {
            get mount() {
              return shadowRoot();
            },
            get children() {
              return props.children;
            }
          });
        }
      });
    }
  })];
};

/*
 * Based on VM UI's VM.getPanel() https://github.com/violentmonkey/vm-ui/blob/00592622a01e48a4ac27a743254d82b1ebcd6d02/src/panel/index.tsx#L71
 */
function makePanel(options) {
  var _options$zIndex;
  const hostEl = dom.hm(`${MOD_DOM_SAFE_PREFIX}host`, {});
  const shadowRoot = hostEl.attachShadow({
    mode: 'open'
  });
  shadowRoot.append(dom.hm('style', {}, `
      ${MOD_DOM_SAFE_PREFIX}wrapper {
        position: fixed;
        z-index: ${(_options$zIndex = options.zIndex) != null ? _options$zIndex : Number.MAX_SAFE_INTEGER - 1};
        pointer-events: none;

        & > * {
          pointer-events: initial;
        }
      }
      `));
  const wrapperEl = dom.hm(`${MOD_DOM_SAFE_PREFIX}wrapper`, {});
  wrapperEl.style.pointerEvents = 'none';
  shadowRoot.append(wrapperEl);
  const movable = new Movable(wrapperEl);
  const panel = {
    hostEl,
    wrapperEl,
    movable,
    show() {
      document.body.append(hostEl);
    },
    hide() {
      hostEl.remove();
    }
  };
  render(() => {
    return createComponent(shadowRootContext.Provider, {
      value: () => shadowRoot,
      get children() {
        return createComponent(options.element, {
          panel: panel
        });
      }
    });
  }, panel.wrapperEl);
  return panel;
}

var styles$6 = {"container":"thermometer-ThermometerWidget-container","graphic":"thermometer-ThermometerWidget-graphic","is-being-grabbed":"thermometer-ThermometerWidget-is-being-grabbed","info":"thermometer-ThermometerWidget-info","error":"thermometer-ThermometerWidget-error","is-info-on-the-right":"thermometer-ThermometerWidget-is-info-on-the-right"};
var stylesheet$9=".thermometer-ThermometerWidget-container {\n  /* Theme: transparent */\n  background-color: transparent;\n  border: none;\n  box-shadow: none;\n\n  /* Fix for loading indicator making the container super big */\n  width: fit-content;\n  height: fit-content;\n\n  padding: 0;\n  display: flex;\n  flex-direction: row;\n}\n\n  .thermometer-ThermometerWidget-container > * {\n    pointer-events: initial;\n  }\n\n  .thermometer-ThermometerWidget-container .thermometer-ThermometerWidget-graphic {\n    cursor: grab;\n  }\n\n  .thermometer-ThermometerWidget-is-being-grabbed .thermometer-ThermometerWidget-container .thermometer-ThermometerWidget-graphic {\n      cursor: grabbing;\n    }\n\n  .thermometer-ThermometerWidget-container .thermometer-ThermometerWidget-info {\n    min-width: 8ch;\n    margin-block: 0.5rem;\n    font-family: 'Roboto', sans-serif;\n    color: white;\n    text-shadow:\n      0px 1px 2px black,\n      0px -1px 2px black,\n      1px 0px 2px black,\n      -1px 0px 2px black;\n    text-align: right;\n  }\n\n  .thermometer-ThermometerWidget-container .thermometer-ThermometerWidget-info :is(p, h1, h2, h3, h4, h5, h6) {\n      margin: 0;\n    }\n\n  .thermometer-ThermometerWidget-container .thermometer-ThermometerWidget-error {\n    color: #ff4141;\n  }\n\n  .thermometer-ThermometerWidget-container.thermometer-ThermometerWidget-is-info-on-the-right {\n    flex-direction: row-reverse;\n  }\n\n  .thermometer-ThermometerWidget-container.thermometer-ThermometerWidget-is-info-on-the-right .thermometer-ThermometerWidget-info {\n      text-align: left;\n    }\n";

const temperatureGradientCanvasCtx = document.createElement('canvas').getContext('2d', {
  willReadFrequently: true
});
const temperatureGradientCanvas = temperatureGradientCanvasCtx.canvas;
const [temperatureGradientHasRedrawn, setTemperatureGradientHasRedrawn] = createSignal(false);
const pingTemperatureGradientHasRedrawn = () => {
  // Abusing Solid's signal system since 2025
  setTemperatureGradientHasRedrawn(true);
  setTemperatureGradientHasRedrawn(false);
};
const [temperatureGradientArray, setTemperatureGradientArray] = createSignal(null);
createEffect(() => {
  if (temperatureGradientArray()) {
    pingTemperatureGradientHasRedrawn();
  }
});
function redrawTemperatureCanvas() {
  const canvasWidth = Math.abs(settings().temperatureGradientMaxCelsius - settings().temperatureGradientMinCelsius);
  temperatureGradientCanvasCtx.canvas.width = canvasWidth;
  temperatureGradientCanvasCtx.canvas.height = 1;
  const temperatureCanvasGradient = temperatureGradientCanvasCtx.createLinearGradient(0, 0, temperatureGradientCanvasCtx.canvas.width, 0);
  for (const {
    percent,
    color
  } of settings().temperatureGradient) {
    temperatureCanvasGradient.addColorStop(percent, color);
  }
  temperatureGradientCanvasCtx.fillStyle = temperatureCanvasGradient;
  temperatureGradientCanvasCtx.fillRect(0, 0, temperatureGradientCanvasCtx.canvas.width, temperatureGradientCanvasCtx.canvas.height);
}
createEffect(() => {
  var _settings;
  if (((_settings = settings()) == null ? void 0 : _settings.temperatureGradient) != null) {
    redrawTemperatureCanvas();
    setTemperatureGradientArray(temperatureGradientCanvasCtx.getImageData(0, 0, temperatureGradientCanvasCtx.canvas.width, 1).data);
  }
});
function sampleTemperatureGradient(temperatureCelsius) {
  const percent = zeroOne(temperatureCelsius, settings().temperatureGradientMinCelsius, settings().temperatureGradientMaxCelsius);
  const clampedPercent = Math.max(0, Math.min(percent, 1));
  const x = Math.floor(clampedPercent * (temperatureGradientCanvasCtx.canvas.width - 1));
  const i = x * 4;
  const rgb = temperatureGradientArray().slice(i, i + 3);
  return '#' + [...rgb].map(c => c.toString(16).padStart(2, '0')).join('');
}
const temperatureAtGradient = x => settings().temperatureGradientMinCelsius + x * (settings().temperatureGradientMaxCelsius - settings().temperatureGradientMinCelsius);

const existingStyleSheetsPerRealm = new Map();
const useRealm = () => {
  const closestShadowRoot = useContext(shadowRootContext);
  return () => closestShadowRoot == null ? document : closestShadowRoot();
};
var SingleInstanceStyle = props => {
  const mountRealm = useRealm();
  const mount = () => {
    const realm = mountRealm();
    if (realm instanceof Document) {
      return realm.head;
    } else if (realm instanceof ShadowRoot) {
      return realm;
    } else {
      throw new Error('Could not determine mount point for SingleInstanceStylesheet');
    }
  };
  const injectIfFirst = () => {
    if (!existingStyleSheetsPerRealm.has(mountRealm())) {
      existingStyleSheetsPerRealm.set(mountRealm(), new Map());
    }
    const realmExistingStyleSheets = existingStyleSheetsPerRealm.get(mountRealm());
    if (!realmExistingStyleSheets.has(props.key)) {
      const [usageCount, setUsageCount] = createSignal(0);
      realmExistingStyleSheets.set(props.key, {
        styleEl: dom.hm('style', {
          'data-single-instance-style-key': props.key
        }, props.children),
        usageCount,
        setUsageCount
      });
    }
    const instance = realmExistingStyleSheets.get(props.key);
    instance.setUsageCount(count => count + 1);
    if (!instance.styleEl.isConnected) {
      mount().append(instance.styleEl);
    }
  };
  const cleanUpForThisInstance = () => {
    const realmExistingStyleSheets = existingStyleSheetsPerRealm.get(mountRealm());
    if (!realmExistingStyleSheets) {
      return;
    }
    const instance = realmExistingStyleSheets.get(props.key);
    if (!instance) {
      return;
    }
    instance.setUsageCount(count => count - 1);
    if (instance.usageCount() <= 0 && instance.styleEl.isConnected) {
      instance.styleEl.remove();
      realmExistingStyleSheets.delete(props.key);
    }
  };
  createEffect(() => {
    if (mountRealm() == null) {
      return;
    }
    injectIfFirst();
  });
  onCleanup(cleanUpForThisInstance);
  return null;
};

var styles$5 = {"graphic":"thermometer-ThermometerGraphic-graphic","fill":"thermometer-ThermometerGraphic-fill","bottom-fill":"thermometer-ThermometerGraphic-bottom-fill","is-busy":"thermometer-ThermometerGraphic-is-busy"};
var stylesheet$8=".thermometer-ThermometerGraphic-graphic {\n  padding: 0.5rem;\n  align-self: center;\n}\n\n  .thermometer-ThermometerGraphic-graphic .thermometer-ThermometerGraphic-fill,\n  .thermometer-ThermometerGraphic-graphic .thermometer-ThermometerGraphic-bottom-fill {\n    transition:\n      height 1s linear,\n      color 1s linear;\n  }\n\n  .thermometer-ThermometerGraphic-is-busy .thermometer-ThermometerGraphic-graphic {\n    animation: 1s linear infinite alternate thermometer-ThermometerGraphic-busy;\n  }\n\n  .thermometer-ThermometerGraphic-is-busy .thermometer-ThermometerGraphic-graphic .thermometer-ThermometerGraphic-fill,\n    .thermometer-ThermometerGraphic-is-busy .thermometer-ThermometerGraphic-graphic .thermometer-ThermometerGraphic-bottom-fill {\n      transition: none;\n    }\n\n@keyframes thermometer-ThermometerGraphic-busy {\n  0% {\n    color: lightgray;\n  }\n  100% {\n    color: darkgray;\n  }\n}\n";

var _tmpl$$6 = /*#__PURE__*/template(`<svg width=22 height=100 viewBox="0 0 22 100"xmlns=http://www.w3.org/2000/svg><rect id=background width=9.67380575 height=84.6300375 x=5.841754249999994 y=1.9680687500000005 rx=4.5632865016684 style="fill:rgb(206 251 250 / 50%);fill-opacity:1;opacity:1;stroke:none;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:1;stroke-width:2"></rect><rect id=fill width=9.67380575 x=5.841754249999994 y=14 rx=4.5632865016684 style=fill:currentcolor;fill-opacity:1;opacity:1;stroke:none;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:1;stroke-width:2;rotate:180deg;transform-origin:center></rect><g><ellipse id=bottom-fill cx=10.81210005114999 cy=89.515713524548 rx=9.596004408359999 ry=9.3861523188054 style=opacity:1;fill:currentcolor;fill-opacity:1;stroke-width:2.98623;stroke-linecap:round;stroke-linejoin:round></ellipse><path id=shimmer d="M 3.68829 88.8769 C 3.68829 88.8769 3.94517 91.2262 5.70701 93.1668 C 7.46886 95.1075 9.59383 95.4109 9.59383 95.4109"style=fill:none;opacity:0.75;stroke:#ffffff;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:miter;stroke-opacity:1;stroke-width:1.5></path></g><path id=outline d="M 10.6362 1.09869 C 7.89534 1.09869 5.69054 3.76255 5.69055 7.07108 L 5.69055 80.5387 C 2.8139 82.2685 0.910186 85.417 0.910186 89.0143 C 0.910186 94.4748 5.34273 98.9026 10.8115 98.9026 C 16.2803 98.9026 20.7148 94.4748 20.7148 89.0143 C 20.7148 85.2876 18.6337 82.0426 15.5838 80.3576 L 15.5838 7.07108 C 15.5838 3.76255 13.377 1.09869 10.6362 1.09869 Z"style=display:inline;fill:none;stroke:#000000;stroke-dasharray:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:2>`);
var ThermometerGraphic = props => {
  const GRAPHIC_MAX_HEIGHT = 84.6300375;
  const [mainProps, restProps] = splitProps(props, ['busy', 'fillPercent', 'color']);
  return [createComponent(SingleInstanceStyle, {
    key: "ThermometerGraphic",
    children: stylesheet$8
  }), (() => {
    var _el$ = _tmpl$$6(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.nextSibling,
      _el$4 = _el$3.nextSibling,
      _el$5 = _el$4.firstChild;
    spread(_el$, mergeProps({
      get style() {
        return {
          color: !mainProps.busy ? mainProps.color : null
        };
      }
    }, restProps, {
      get classList() {
        var _restProps$class$spli, _restProps$class;
        return _extends({}, Object.fromEntries((_restProps$class$spli = (_restProps$class = restProps['class']) == null ? void 0 : _restProps$class.split(' ').map(cls => [cls, true])) != null ? _restProps$class$spli : []), {
          [styles$5['graphic']]: true,
          [styles$5['is-busy']]: mainProps.busy
        });
      }
    }), true, true);
    createRenderEffect(_p$ => {
      var _v$ = styles$5['fill'],
        _v$2 = mainProps.fillPercent * GRAPHIC_MAX_HEIGHT,
        _v$3 = styles$5['bottom-fill'];
      _v$ !== _p$.e && setAttribute(_el$3, "class", _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$3, "height", _p$.t = _v$2);
      _v$3 !== _p$.a && setAttribute(_el$5, "class", _p$.a = _v$3);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined
    });
    return _el$;
  })()];
};

function _classPrivateFieldBase(e, t) {
  if (!{}.hasOwnProperty.call(e, t)) throw new TypeError("attempted to use private field on non-instance");
  return e;
}

var id = 0;
function _classPrivateFieldKey(e) {
  return "__private_" + id++ + "_" + e;
}

var _interval = /*#__PURE__*/_classPrivateFieldKey("interval");
var _mousePositionInsidePet = /*#__PURE__*/_classPrivateFieldKey("mousePositionInsidePet");
var _lastMousePositionInsidePet = /*#__PURE__*/_classPrivateFieldKey("lastMousePositionInsidePet");
var _lastAngle = /*#__PURE__*/_classPrivateFieldKey("lastAngle");
var _scratchCounter = /*#__PURE__*/_classPrivateFieldKey("scratchCounter");
var _samplesBeingPet = /*#__PURE__*/_classPrivateFieldKey("samplesBeingPet");
var _lastEventDispatchWasPettingStart = /*#__PURE__*/_classPrivateFieldKey("lastEventDispatchWasPettingStart");
var _handlePetElMouseMove = /*#__PURE__*/_classPrivateFieldKey("handlePetElMouseMove");
var _handlePetElMouseLeave = /*#__PURE__*/_classPrivateFieldKey("handlePetElMouseLeave");
var _sample = /*#__PURE__*/_classPrivateFieldKey("sample");
class Pet extends EventTarget {
  constructor(petEl, options) {
    super();
    Object.defineProperty(this, _sample, {
      value: _sample2
    });
    Object.defineProperty(this, _interval, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _mousePositionInsidePet, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _lastMousePositionInsidePet, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _lastAngle, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _scratchCounter, {
      writable: true,
      value: 0
    });
    Object.defineProperty(this, _samplesBeingPet, {
      writable: true,
      value: 0
    });
    Object.defineProperty(this, _lastEventDispatchWasPettingStart, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _handlePetElMouseMove, {
      writable: true,
      value: event => {
        const {
          clientX,
          clientY
        } = event;
        _classPrivateFieldBase(this, _mousePositionInsidePet)[_mousePositionInsidePet] = {
          x: clientX,
          y: clientY
        };
      }
    });
    Object.defineProperty(this, _handlePetElMouseLeave, {
      writable: true,
      value: _event => {
        _classPrivateFieldBase(this, _mousePositionInsidePet)[_mousePositionInsidePet] = null;
      }
    });
    this.petEl = petEl;
    this.options = options;
    this.start();
  }
  start() {
    _classPrivateFieldBase(this, _interval)[_interval] = setInterval(_classPrivateFieldBase(this, _sample)[_sample].bind(this), this.options.sampleRate);
    _classPrivateFieldBase(this, _mousePositionInsidePet)[_mousePositionInsidePet] = null;
    this.petEl.addEventListener('mousemove', _classPrivateFieldBase(this, _handlePetElMouseMove)[_handlePetElMouseMove].bind(this));
    this.petEl.addEventListener('mouseleave', _classPrivateFieldBase(this, _handlePetElMouseLeave)[_handlePetElMouseLeave].bind(this));
  }
  stop() {
    clearInterval(_classPrivateFieldBase(this, _interval)[_interval]);
    _classPrivateFieldBase(this, _interval)[_interval] = null;
    this.petEl.removeEventListener('mousemove', _classPrivateFieldBase(this, _handlePetElMouseMove)[_handlePetElMouseMove]);
    this.petEl.removeEventListener('mouseleave', _classPrivateFieldBase(this, _handlePetElMouseLeave)[_handlePetElMouseLeave]);
  }
}
function _sample2() {
  if (_classPrivateFieldBase(this, _lastMousePositionInsidePet)[_lastMousePositionInsidePet] != null && _classPrivateFieldBase(this, _mousePositionInsidePet)[_mousePositionInsidePet] != null) {
    const normalizedX = _classPrivateFieldBase(this, _mousePositionInsidePet)[_mousePositionInsidePet].x - _classPrivateFieldBase(this, _lastMousePositionInsidePet)[_lastMousePositionInsidePet].x;
    const normalizedY = _classPrivateFieldBase(this, _mousePositionInsidePet)[_mousePositionInsidePet].y - _classPrivateFieldBase(this, _lastMousePositionInsidePet)[_lastMousePositionInsidePet].y;
    const angle = Math.atan2(normalizedX, normalizedY) * RAD_TO_DEG;
    if (_classPrivateFieldBase(this, _lastAngle)[_lastAngle] != null) {
      const anglesDistance = (_classPrivateFieldBase(this, _lastAngle)[_lastAngle] - angle + 180) % 360 - 180;
      const absAnglesDistance = Math.abs(anglesDistance);

      // console.debug(MOD_LOG_PREFIX, 'absAnglesDistance:', absAnglesDistance);

      if (absAnglesDistance > this.options.angleMin + 180 && absAnglesDistance < this.options.angleMax + 180) {
        _classPrivateFieldBase(this, _scratchCounter)[_scratchCounter] = Math.min(_classPrivateFieldBase(this, _scratchCounter)[_scratchCounter] + 1, this.options.max);
      }
      const isBeingPet = _classPrivateFieldBase(this, _scratchCounter)[_scratchCounter] > this.options.threshold;
      if (isBeingPet) {
        _classPrivateFieldBase(this, _samplesBeingPet)[_samplesBeingPet] = Math.min(_classPrivateFieldBase(this, _samplesBeingPet)[_samplesBeingPet] + 1, this.options.activation);
      } else {
        _classPrivateFieldBase(this, _samplesBeingPet)[_samplesBeingPet] = Math.max(0, _classPrivateFieldBase(this, _samplesBeingPet)[_samplesBeingPet] - 1);
      }

      // console.debug(MOD_LOG_PREFIX, 'isBeingPet:', isBeingPet);
      // console.debug(MOD_LOG_PREFIX, 'samplesBeingPet:', this.#samplesBeingPet);

      if (isBeingPet && _classPrivateFieldBase(this, _samplesBeingPet)[_samplesBeingPet] >= this.options.activation) {
        if (!_classPrivateFieldBase(this, _lastEventDispatchWasPettingStart)[_lastEventDispatchWasPettingStart]) {
          this.dispatchEvent(new Event('petting-start'));
          _classPrivateFieldBase(this, _lastEventDispatchWasPettingStart)[_lastEventDispatchWasPettingStart] = true;
        }
      } else {
        if (_classPrivateFieldBase(this, _lastEventDispatchWasPettingStart)[_lastEventDispatchWasPettingStart]) {
          this.dispatchEvent(new Event('petting-end'));
          _classPrivateFieldBase(this, _lastEventDispatchWasPettingStart)[_lastEventDispatchWasPettingStart] = false;
        }
      }
    }
    _classPrivateFieldBase(this, _lastAngle)[_lastAngle] = angle;
  } else {
    _classPrivateFieldBase(this, _lastAngle)[_lastAngle] = null;
    _classPrivateFieldBase(this, _samplesBeingPet)[_samplesBeingPet] = Math.max(0, _classPrivateFieldBase(this, _samplesBeingPet)[_samplesBeingPet] - 0.75);
    if (_classPrivateFieldBase(this, _samplesBeingPet)[_samplesBeingPet] === 0 && _classPrivateFieldBase(this, _lastEventDispatchWasPettingStart)[_lastEventDispatchWasPettingStart]) {
      this.dispatchEvent(new Event('petting-end'));
      _classPrivateFieldBase(this, _lastEventDispatchWasPettingStart)[_lastEventDispatchWasPettingStart] = false;
    }
  }
  _classPrivateFieldBase(this, _lastMousePositionInsidePet)[_lastMousePositionInsidePet] = _classPrivateFieldBase(this, _mousePositionInsidePet)[_mousePositionInsidePet];
  _classPrivateFieldBase(this, _scratchCounter)[_scratchCounter] = Math.max(0, _classPrivateFieldBase(this, _scratchCounter)[_scratchCounter] - this.options.neglect);
}

var styles$4 = {"petting-heart":"thermometer-heart-petting-heart"};
var stylesheet$7="@keyframes thermometer-heart-petting-heart-movement {\n  0% {\n    translate: 0 0;\n    rotate: 0deg;\n  }\n  25% {\n    translate: -10% 0;\n    rotate: 25deg;\n  }\n  50% {\n    translate: 0% 0;\n    rotate: 0deg;\n  }\n  75% {\n    translate: 10% 0;\n    rotate: -25deg;\n  }\n}\n\n/* Based on https://css-tricks.com/hearts-in-html-and-css/#aa-css-shape */\n.thermometer-heart-petting-heart {\n  --size: 10px;\n\n  position: fixed;\n  background-color: red;\n  margin: 0 calc(var(--size)/3);\n  width: var(--size);\n  aspect-ratio: 1;\n  display: inline-block;\n  transform: translate(-50%, -50%) rotate(-45deg);\n  animation: thermometer-heart-petting-heart-movement 2s linear infinite;\n  z-index: 0;\n}\n.thermometer-heart-petting-heart::before,\n  .thermometer-heart-petting-heart::after {\n    content: '';\n    position: absolute;\n    width: var(--size);\n    aspect-ratio: 1;\n    border-radius: 50%;\n    background-color: red;\n  }\n.thermometer-heart-petting-heart::before {\n    top: calc(var(--size)/-2);\n    left: 0;\n  }\n.thermometer-heart-petting-heart::after {\n    left: calc(var(--size)/2);\n    top: 0;\n  }\n";

class Heart {
  constructor({
    initialPosX,
    initialPosY,
    velocityX,
    velocityY,
    maxLifetime
  }) {
    this.el = document.createElement('div');
    this.el.classList.add(styles$4['petting-heart']);
    document.body.append(this.el);
    this.maxLifetime = maxLifetime;
    this.lifetime = this.maxLifetime;
    this.x = initialPosX;
    this.y = initialPosY;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.lastUpdateTimestamp = Date.now();
    this.update();
  }
  update() {
    this.lifetime -= Date.now() - this.lastUpdateTimestamp;
    if (this.lifetime <= 0) {
      this.el.remove();
      return;
    }
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.el.style.left = `${this.x}px`;
    this.el.style.top = `${this.y}px`;
    this.el.style.scale = (this.lifetime / this.maxLifetime).toString(10);
    this.el.style.opacity = (1.5 * this.lifetime / this.maxLifetime).toString(10);
    this.lastUpdateTimestamp = Date.now();
    requestAnimationFrame(this.update.bind(this));
  }
}
GM_addStyle(stylesheet$7);

var _tmpl$$5 = /*#__PURE__*/template(`<div><h2>:(</h2><p>Contact @netux about this`),
  _tmpl$2$2 = /*#__PURE__*/template(`<p>`),
  _tmpl$3$2 = /*#__PURE__*/template(`<p>T: `),
  _tmpl$4$2 = /*#__PURE__*/template(`<p>H: <!>%`),
  _tmpl$5$1 = /*#__PURE__*/template(`<div><div>`);
const CLOCK_EMOJIS_MAP = new Map();
{
  const firstOClockEmojiCodePoint = '🕐'.codePointAt(0); // one-oclock
  const lastOClockEmojiCodePoint = '🕛'.codePointAt(0); // twelve-oclock
  for (let i = 0; i <= lastOClockEmojiCodePoint - firstOClockEmojiCodePoint; i++) {
    CLOCK_EMOJIS_MAP.set((i + 1) % 12, String.fromCodePoint(firstOClockEmojiCodePoint + i));
  }
  const firstThirtyEmojiCodePoint = '🕜'.codePointAt(0);
  const lastThirtyEmojiCodePoint = '🕧'.codePointAt(0);
  for (let i = 0; i <= lastThirtyEmojiCodePoint - firstThirtyEmojiCodePoint; i++) {
    CLOCK_EMOJIS_MAP.set((i + 1.5) % 12, String.fromCodePoint(firstThirtyEmojiCodePoint + i));
  }
}
const useCurrentDate = updateEveryMs => {
  const [date, setDate] = createSignal(new Date());
  const updateInterval = setInterval(() => setDate(new Date()), updateEveryMs);
  onCleanup(() => {
    clearInterval(updateInterval);
  });
  return date;
};
const ForecastZoneDateClock = props => {
  const currentDate = useCurrentDate(1000);
  const forecastZoneDate = createMemo(() => offsetTimezone(currentDate(), props.forecast.utc_offset_seconds));
  const forecastZoneDateEmoji = () => {
    const decimalHour = forecastZoneDate().getHours() % 12 + (forecastZoneDate().getMinutes() >= 30 ? 0.5 : 0);
    return CLOCK_EMOJIS_MAP.get(decimalHour) || '⏰';
  };
  const prettyForecastZoneDate = createMemo(() => {
    const date = forecastZoneDate();
    const pad = n => n.toString().padStart(2, '0');
    if (settings().time24Hours) {
      return `${pad(date.getHours())}:${pad(date.getMinutes())}${settings().timeIncludeSeconds ? `:${pad(date.getSeconds())}` : ''}`;
    } else {
      return `${pad(date.getHours() % 12)}:${pad(date.getMinutes())}${settings().timeIncludeSeconds ? `:${pad(date.getSeconds())}` : ''} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
    }
  });
  return [memo(forecastZoneDateEmoji), " ", memo(prettyForecastZoneDate)];
};
var Thermometer = ({
  panel
}) => {
  let graphicEl;
  const [isBeingGrabbed, setIsBeingGrabbed] = createSignal(false);
  const [isInfoOnTheRight, setIsInfoOnTheRight] = createSignal(false);
  const onPanelMoving = () => {
    const {
      left,
      width
    } = panel.wrapperEl.getBoundingClientRect();
    setIsInfoOnTheRight(left + width / 2 < window.innerWidth / 2);
  };
  const onPanelMoveStart = () => {
    setIsBeingGrabbed(true);
  };
  const onPanelMoveEnd = async () => {
    setIsBeingGrabbed(false);
    const {
      left,
      top
    } = panel.movable.getPosition();
    await saveSettings(prevSettings => {
      return _extends({}, prevSettings, {
        [resolvedWidgetPositionKey()]: makeWidgetPositionSetting({
          x: left,
          y: top
        })
      });
    });
  };
  const setupPet = () => {
    const pet = new Pet(graphicEl, {
      sampleRate: 100,
      max: 10,
      threshold: 2.5,
      activation: 3,
      neglect: 0.5,
      angleMin: -20,
      angleMax: 20
    });
    let spawnHeartsInterval = null;
    pet.addEventListener('petting-start', () => {
      let spawnNextHeartGoingRight = false;
      spawnHeartsInterval = setInterval(() => {
        const boundingBox = pet.petEl.getBoundingClientRect();
        new Heart({
          initialPosX: boundingBox.left + boundingBox.width * (spawnNextHeartGoingRight ? 2 / 3 : 1 / 3),
          initialPosY: boundingBox.top + boundingBox.height / 3,
          velocityX: 0.25 * (spawnNextHeartGoingRight ? 1 : -1),
          velocityY: -0.5,
          maxLifetime: 5000
        });
        spawnNextHeartGoingRight = !spawnNextHeartGoingRight;
      }, 500);
    });
    pet.addEventListener('petting-end', () => {
      clearInterval(spawnHeartsInterval);
      spawnHeartsInterval = null;
    });
  };
  onMount(() => {
    panel.movable.addEventListener('move-start', onPanelMoveStart);
    panel.movable.addEventListener('moving', onPanelMoving);
    panel.movable.addEventListener('move-end', onPanelMoveEnd);
    panel.movable.applyOptions({
      handlerElements: [graphicEl]
    });
    panel.movable.enable();
    setupPet();
  });
  onCleanup(() => {
    panel.movable.disable();
    panel.movable.removeEventListener('move-start', onPanelMoveStart);
    panel.movable.removeEventListener('moving', onPanelMoving);
    panel.movable.removeEventListener('move-end', onPanelMoveEnd);
  });
  createEffect(prevWidgetPosition => {
    const newWidgetPosition = resolvedWidgetPositionSetting();
    if (newWidgetPosition.x !== prevWidgetPosition.x || newWidgetPosition.y !== prevWidgetPosition.y) {
      panel.movable.setPosition(Math.round(newWidgetPosition.x), Math.round(newWidgetPosition.y));
    }
    return newWidgetPosition;
  }, resolvedWidgetPositionSetting());
  const userTemperatureUnit = createMemo(() => TEMPERATURE_UNITS[settings().temperatureUnit]);
  const graphicFillPercent = createMemo(prev => {
    const forecast$1 = forecast();
    if (!forecast$1) {
      return prev;
    }
    const temperatureGradientLength = Math.abs(settings().temperatureGradientMaxCelsius - settings().temperatureGradientMinCelsius);
    return forecast$1.current.temperature_2m / temperatureGradientLength;
  }, 0);
  const currentTemperatureCelsius = createMemo(previousTemperatureCelsius => {
    const forecast$1 = forecast();
    if (!forecast$1) {
      // Preserve previous temperature
      return previousTemperatureCelsius;
    }
    return forecast$1.current.temperature_2m;
  }, null);
  const graphicColor = createMemo(() => {
    if (!(currentTemperatureCelsius() || temperatureGradientHasRedrawn())) {
      return null;
    }
    return sampleTemperatureGradient(currentTemperatureCelsius());
  });
  return (() => {
    var _el$ = _tmpl$5$1(),
      _el$2 = _el$.firstChild;
    insert(_el$, createComponent(SingleInstanceStyle, {
      key: "ThermometerWidget",
      children: stylesheet$9
    }), _el$2);
    insert(_el$2, createComponent(Show, {
      get when() {
        return error();
      },
      get children() {
        var _el$3 = _tmpl$$5();
        createRenderEffect(() => className(_el$3, styles$6['error']));
        return _el$3;
      }
    }), null);
    insert(_el$2, createComponent(Show, {
      get when() {
        return memo(() => !!!loading())() && forecast() != null;
      },
      get children() {
        return [createComponent(Show, {
          get when() {
            return settings().showClock;
          },
          get children() {
            var _el$4 = _tmpl$2$2();
            insert(_el$4, createComponent(ForecastZoneDateClock, {
              get forecast() {
                return forecast();
              }
            }));
            return _el$4;
          }
        }), createComponent(Show, {
          get when() {
            return settings().showTemperature;
          },
          get children() {
            var _el$5 = _tmpl$3$2();
              _el$5.firstChild;
            insert(_el$5, () => userTemperatureUnit().fromCelsius(forecast().current.temperature_2m), null);
            insert(_el$5, () => userTemperatureUnit().unit, null);
            return _el$5;
          }
        }), createComponent(Show, {
          get when() {
            return settings().showRelativeHumidity;
          },
          get children() {
            var _el$8 = _tmpl$4$2(),
              _el$9 = _el$8.firstChild,
              _el$1 = _el$9.nextSibling;
              _el$1.nextSibling;
            insert(_el$8, () => forecast().current.relative_humidity_2m, _el$1);
            return _el$8;
          }
        })];
      }
    }), null);
    insert(_el$, createComponent(ThermometerGraphic, {
      get busy() {
        return loading();
      },
      get fillPercent() {
        return graphicFillPercent();
      },
      get color() {
        return graphicColor();
      },
      get ["class"]() {
        return styles$6['graphic'];
      },
      ref(r$) {
        var _ref$ = graphicEl;
        typeof _ref$ === "function" ? _ref$(r$) : graphicEl = r$;
      }
    }), null);
    createRenderEffect(_p$ => {
      var _v$ = {
          [styles$6['container']]: true,
          [styles$6['is-info-on-the-right']]: isInfoOnTheRight(),
          [styles$6['is-being-grabbed']]: isBeingGrabbed()
        },
        _v$2 = styles$6['info'];
      _p$.e = classList(_el$, _v$, _p$.e);
      _v$2 !== _p$.t && className(_el$2, _p$.t = _v$2);
      return _p$;
    }, {
      e: undefined,
      t: undefined
    });
    return _el$;
  })();
};

var irfTabStyles = {"tab-content":"thermometer-irf-tab-tab-content"};
var stylesheet$6=".thermometer-irf-tab-tab-content *,\n  .thermometer-irf-tab-tab-content *::before,\n  .thermometer-irf-tab-tab-content *::after {\n    box-sizing: border-box;\n  }\n";

var styles$3 = {"field-group":"thermometer-SettingsFieldGroup-field-group","field-group__label-container":"thermometer-SettingsFieldGroup-field-group__label-container","field-group__input-container":"thermometer-SettingsFieldGroup-field-group__input-container"};
var stylesheet$5=".thermometer-SettingsFieldGroup-field-group {\n  margin-block: 1rem;\n  gap: 0.25rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n  .thermometer-SettingsFieldGroup-field-group label > small {\n    color: lightgray;\n    display: block;\n  }\n\n  .thermometer-SettingsFieldGroup-field-group .thermometer-SettingsFieldGroup-field-group__label-container,\n  .thermometer-SettingsFieldGroup-field-group .thermometer-SettingsFieldGroup-field-group__input-container {\n    width: 100%;\n    display: flex;\n    flex-direction: row;\n    flex-wrap: nowrap;\n    align-items: center;\n    gap: 1ch;\n  }\n\n  .thermometer-SettingsFieldGroup-field-group .thermometer-SettingsFieldGroup-field-group__input-container {\n    justify-content: end;\n    white-space: nowrap;\n  }\n";

var _tmpl$$4 = /*#__PURE__*/template(`<div><div><label></label></div><div>`);
var SettingsFieldGroup = props => {
  return [createComponent(SingleInstanceStyle, {
    key: "SettingsFieldGroup",
    children: stylesheet$5
  }), (() => {
    var _el$ = _tmpl$$4(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.firstChild,
      _el$4 = _el$2.nextSibling;
    insert(_el$3, () => props.label);
    insert(_el$4, () => props.children);
    createRenderEffect(_p$ => {
      var _v$ = styles$3['field-group'],
        _v$2 = styles$3['field-group__label-container'],
        _v$3 = props.id,
        _v$4 = styles$3['field-group__input-container'];
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && className(_el$2, _p$.t = _v$2);
      _v$3 !== _p$.a && setAttribute(_el$3, "for", _p$.a = _v$3);
      _v$4 !== _p$.o && className(_el$4, _p$.o = _v$4);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined
    });
    return _el$;
  })()];
};

var styles$2 = {"gradient-field-group":"thermometer-SettingsGradientFieldGroup-gradient-field-group","label":"thermometer-SettingsGradientFieldGroup-label","gradient-range":"thermometer-SettingsGradientFieldGroup-gradient-range","gradient-range__input-container":"thermometer-SettingsGradientFieldGroup-gradient-range__input-container","gradient-container":"thermometer-SettingsGradientFieldGroup-gradient-container","stops-container":"thermometer-SettingsGradientFieldGroup-stops-container"};
var stylesheet$4=".thermometer-SettingsGradientFieldGroup-gradient-field-group {\n  position: relative;\n  margin-block: 1rem;\n  gap: 0.25rem;\n  display: flex;\n  justify-content: space-between;\n  flex-direction: column;\n}\n\n  .thermometer-SettingsGradientFieldGroup-gradient-field-group .thermometer-SettingsGradientFieldGroup-label {\n    width: 100%;\n    display: flex;\n    flex-direction: row;\n    flex-wrap: nowrap;\n    align-items: center;\n    gap: 1ch;\n  }\n\n  .thermometer-SettingsGradientFieldGroup-gradient-field-group canvas {\n    width: 100%;\n    height: 20px;\n  }\n\n  .thermometer-SettingsGradientFieldGroup-gradient-field-group .thermometer-SettingsGradientFieldGroup-gradient-range {\n    --inputs-size: 8ch;\n    --inputs-size-padding: 3ch;\n    --inputs-full-size: calc(var(--inputs-size) + var(--inputs-size-padding));\n\n    display: flex;\n    justify-content: space-between;\n\n    background:\n      /* Dotted line */\n      repeating-linear-gradient(to right, #b9b9b973 0 3px, transparent 6px 9px),\n      \n        linear-gradient(\n          to right,\n          black 0%,\n          black var(--inputs-full-size),\n          transparent calc(var(--inputs-full-size) + 10%),\n          transparent calc(90% - var(--inputs-full-size)),\n          black calc(100% - var(--inputs-full-size)),\n          black 100%\n        );\n    background-size: auto 3px;\n    background-blend-mode: multiply;\n    background-repeat: repeat-x;\n    background-position: center;\n  }\n\n  .thermometer-SettingsGradientFieldGroup-gradient-field-group .thermometer-SettingsGradientFieldGroup-gradient-range .thermometer-SettingsGradientFieldGroup-gradient-range__input-container {\n      display: flex;\n      align-items: center;\n      gap: 0.5ch;\n    }\n\n  .thermometer-SettingsGradientFieldGroup-gradient-field-group .thermometer-SettingsGradientFieldGroup-gradient-range .thermometer-SettingsGradientFieldGroup-gradient-range__input-container input {\n        width: var(--inputs-size);\n        text-align: right;\n\n        -moz-appearance: textfield;\n        appearance: textfield;\n      }\n\n  .thermometer-SettingsGradientFieldGroup-gradient-field-group .thermometer-SettingsGradientFieldGroup-gradient-range .thermometer-SettingsGradientFieldGroup-gradient-range__input-container input::-webkit-inner-spin-button,\n        .thermometer-SettingsGradientFieldGroup-gradient-field-group .thermometer-SettingsGradientFieldGroup-gradient-range .thermometer-SettingsGradientFieldGroup-gradient-range__input-container input::-webkit-inner-spin-button {\n          display: none;\n        }\n\n  .thermometer-SettingsGradientFieldGroup-gradient-field-group .thermometer-SettingsGradientFieldGroup-gradient-container {\n    position: relative;\n    padding-top: 0.33rem;\n    margin-inline: 0.5rem;\n    cursor: pointer;\n  }\n\n  .thermometer-SettingsGradientFieldGroup-gradient-field-group .thermometer-SettingsGradientFieldGroup-stops-container {\n    --stop-height: 0.85rem;\n    --stop-tip-height: 7px;\n    --stop-border-size: 2px;\n\n    position: relative;\n    min-height: calc(var(--stop-tip-height) + var(--stop-height) + var(--stop-border-size)*2);\n  }\n";

var styles$1 = {"gradient-marker":"thermometer-GradientMarker-gradient-marker","gradient-marker--current":"thermometer-GradientMarker-gradient-marker--current","gradient-marker--cursor":"thermometer-GradientMarker-gradient-marker--cursor"};
var stylesheet$3=".thermometer-GradientMarker-gradient-marker {\n  --marker-color: pink;\n\n  position: absolute;\n  top: 0;\n  translate: -50% -133%;\n  text-align: center;\n  white-space: nowrap;\n  font-size: 75%;\n  text-shadow: 0 0 3px black;\n  pointer-events: none;\n}\n\n  .thermometer-GradientMarker-gradient-marker.thermometer-GradientMarker-gradient-marker--current {\n    --marker-color: gray;\n  }\n\n  .thermometer-GradientMarker-gradient-marker.thermometer-GradientMarker-gradient-marker--cursor {\n    --marker-color: red;\n  }\n\n  .thermometer-GradientMarker-gradient-marker::after {\n    content: '';\n    position: absolute;\n    translate: -50% 100%;\n    left: 50%;\n    bottom: 0;\n    width: 1rem;\n    height: 0.5rem;\n    background-color: var(--marker-color);\n    clip-path: polygon(50% 100%, 0 0, 100% 0);\n  }\n";

var _tmpl$$3 = /*#__PURE__*/template(`<span>`);
let GradientMarkerType = /*#__PURE__*/function (GradientMarkerType) {
  GradientMarkerType["CURRENT"] = "current";
  GradientMarkerType["CURSOR"] = "cursor";
  return GradientMarkerType;
}({});
var GradientMarker = props => {
  const temperaturePercent = () => zeroOne(props.temperatureCelsius, settings().temperatureGradientMinCelsius, settings().temperatureGradientMaxCelsius);
  const prettyTemperatureValue = value => {
    switch (props.type) {
      case GradientMarkerType.CURSOR:
        {
          // Round to closest multiple of 0.5
          return (Math.round(value * 2) / 2).toFixed(1);
        }
      default:
        {
          return Math.round(value).toFixed(0);
        }
    }
  };
  const userTemperatureUnit = () => TEMPERATURE_UNITS[settings().temperatureUnit];
  return [createComponent(SingleInstanceStyle, {
    key: "GradientMarker",
    children: stylesheet$3
  }), (() => {
    var _el$ = _tmpl$$3();
    insert(_el$, () => prettyTemperatureValue(userTemperatureUnit().fromCelsius(props.temperatureCelsius)), null);
    insert(_el$, () => userTemperatureUnit().unit, null);
    createRenderEffect(_p$ => {
      var _v$ = {
          [styles$1['gradient-marker']]: true,
          [styles$1[`gradient-marker--${props.type}`]]: true
        },
        _v$2 = `${temperaturePercent() * 100}%`;
      _p$.e = classList(_el$, _v$, _p$.e);
      _v$2 !== _p$.t && setStyleProperty(_el$, "left", _p$.t = _v$2);
      return _p$;
    }, {
      e: undefined,
      t: undefined
    });
    return _el$;
  })()];
};

var styles = {"gradient-stop":"thermometer-GradientColorStop-gradient-stop"};
var stylesheet$2=".thermometer-GradientColorStop-gradient-stop {\n  position: absolute;\n  background-color: transparent;\n  translate: -50% 0;\n  height: var(--stop-height);\n  aspect-ratio: 0.9;\n  display: inline-block;\n  border-radius: 4px 4px 2px 2px;\n  border: var(--stop-border-size) solid white;\n  margin-top: var(--stop-tip-height);\n  cursor: grab;\n}\n\n  .thermometer-GradientColorStop-gradient-stop::before {\n    content: '';\n    background-color: white;\n    width: var(--stop-tip-height);\n    aspect-ratio: 1;\n    position: absolute;\n    top: 0;\n    left: 50%;\n    translate: -50% -100%;\n    clip-path: polygon(50% 0, 100% 100%, 0 100%);\n  }\n\n  .thermometer-GradientColorStop-gradient-stop input[type='color'] {\n    pointer-events: none;\n    width: 1px;\n    aspect-ratio: 1;\n    opacity: 0.01;\n  }\n";

var _tmpl$$2 = /*#__PURE__*/template(`<div><input type=color>`);
var GradientColorStop = props => {
  let stopEl;
  let colorInputEl;
  let draggingState = null;
  const onMouseDown = event => {
    event.preventDefault();
    if (event.button !== 0 /* left click */) {
      return;
    }
    draggingState = {
      startPos: {
        x: event.clientX,
        y: event.clientY
      }
    };
  };
  const onDocumentMouseUp = event => {
    if (draggingState == null) {
      return;
    }
    event.preventDefault();
    if (Math.abs(draggingState.startPos.x - event.clientX) + Math.abs(draggingState.startPos.y - event.clientY) < 5) {
      colorInputEl.click();
    }
    draggingState = null;
  };
  const onDocumentMouseMove = event => {
    if (draggingState == null) {
      return;
    }
    event.preventDefault();
    const gradientStopBoundingBox = stopEl.parentElement.getBoundingClientRect();
    const percent = (event.clientX - gradientStopBoundingBox.left) / gradientStopBoundingBox.width;
    const clampedPercent = Math.max(0, Math.min(percent, 1));
    props.onMove(clampedPercent);
  };
  const onContextMenu = event => {
    event.preventDefault();
    props.onDelete();
  };
  const onColorInputChange = event => {
    event.preventDefault();
    props.onChange(colorInputEl.value);
  };
  onMount(() => {
    document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('mousemove', onDocumentMouseMove);
  });
  onCleanup(() => {
    document.removeEventListener('mouseup', onDocumentMouseUp);
    document.removeEventListener('mousemove', onDocumentMouseMove);
  });
  return [createComponent(SingleInstanceStyle, {
    key: "GradientColorStop",
    children: stylesheet$2
  }), (() => {
    var _el$ = _tmpl$$2(),
      _el$2 = _el$.firstChild;
    var _ref$ = stopEl;
    typeof _ref$ === "function" ? use(_ref$, _el$) : stopEl = _el$;
    addEventListener(_el$, "contextmenu", onContextMenu);
    addEventListener(_el$, "mousedown", onMouseDown);
    var _ref$2 = colorInputEl;
    typeof _ref$2 === "function" ? use(_ref$2, _el$2) : colorInputEl = _el$2;
    addEventListener(_el$2, "input", onColorInputChange);
    createRenderEffect(_p$ => {
      var _v$ = styles['gradient-stop'],
        _v$2 = `${props.percent * 100}%`,
        _v$3 = props.color,
        _v$4 = Math.round(props.percent * 100);
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && setStyleProperty(_el$, "left", _p$.t = _v$2);
      _v$3 !== _p$.a && setStyleProperty(_el$, "background-color", _p$.a = _v$3);
      _v$4 !== _p$.o && setStyleProperty(_el$, "z-index", _p$.o = _v$4);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined
    });
    createRenderEffect(() => _el$2.value = props.color);
    return _el$;
  })()];
};

var _tmpl$$1 = /*#__PURE__*/template(`<div><input type=number>`),
  _tmpl$2$1 = /*#__PURE__*/template(`<div>`),
  _tmpl$3$1 = /*#__PURE__*/template(`<div><div>`),
  _tmpl$4$1 = /*#__PURE__*/template(`<div><div><label>Temperature Gradient</label><button><img src=https://www.svgrepo.com/show/511181/undo.svg>`);
const GradientRangeInput = props => {
  const userTemperatureUnit = () => TEMPERATURE_UNITS[settings().temperatureUnit];
  const onChange = event => {
    const numberValue = parseFloat(event.currentTarget.value);
    if (Number.isNaN(numberValue)) {
      return;
    }
    props.onChange(userTemperatureUnit().toCelsius(numberValue));
  };
  return (() => {
    var _el$ = _tmpl$$1(),
      _el$2 = _el$.firstChild;
    addEventListener(_el$2, "change", onChange);
    insert(_el$, () => userTemperatureUnit().unit, null);
    createRenderEffect(_p$ => {
      var _v$ = styles$2['gradient-range__input-container'],
        _v$2 = props.id;
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$2, "id", _p$.t = _v$2);
      return _p$;
    }, {
      e: undefined,
      t: undefined
    });
    createRenderEffect(() => _el$2.value = userTemperatureUnit().fromCelsius(props.valueCelsius));
    return _el$;
  })();
};
const GradientRange = () => {
  const onChangeMin = newMinTemperatureCelsius => saveSettings(previousSettings => _extends({}, previousSettings, {
    temperatureGradientMinCelsius: Math.min(newMinTemperatureCelsius, previousSettings.temperatureGradientMaxCelsius),
    temperatureGradientMaxCelsius: Math.max(newMinTemperatureCelsius, previousSettings.temperatureGradientMaxCelsius)
  }));
  const onChangeMax = newMaxTemperatureCelsius => saveSettings(previousSettings => _extends({}, previousSettings, {
    temperatureGradientMinCelsius: Math.min(previousSettings.temperatureGradientMinCelsius, newMaxTemperatureCelsius),
    temperatureGradientMaxCelsius: Math.max(previousSettings.temperatureGradientMinCelsius, newMaxTemperatureCelsius)
  }));
  return (() => {
    var _el$3 = _tmpl$2$1();
    insert(_el$3, createComponent(GradientRangeInput, {
      id: `${MOD_DOM_SAFE_PREFIX}gradient-temperature-min`,
      get valueCelsius() {
        return settings().temperatureGradientMinCelsius;
      },
      onChange: onChangeMin
    }), null);
    insert(_el$3, createComponent(GradientRangeInput, {
      id: `${MOD_DOM_SAFE_PREFIX}gradient-temperature-max`,
      get valueCelsius() {
        return settings().temperatureGradientMaxCelsius;
      },
      onChange: onChangeMax
    }), null);
    createRenderEffect(() => className(_el$3, styles$2['gradient-range']));
    return _el$3;
  })();
};
const GradientContainer = () => {
  const [hoveringTemperature, setHoveringTemperature] = createSignal(null);
  const onGradientContainerMouseMove = event => {
    const {
      left: containerClientX,
      width: containerWidth
    } = event.currentTarget.getBoundingClientRect();
    const containerOffsetX = event.clientX - containerClientX;
    const percent = containerOffsetX / containerWidth;
    setHoveringTemperature(temperatureAtGradient(percent));
  };
  const onGradientContainerMouseLeave = () => {
    setHoveringTemperature(null);
  };
  const onGradientContainerDoubleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    const percent = event.offsetX / event.currentTarget.clientWidth;
    const color = sampleTemperatureGradient(temperatureAtGradient(percent));
    const newStop = {
      percent,
      color
    };
    saveSettings(previousSettings => _extends({}, previousSettings, {
      temperatureGradient: previousSettings.temperatureGradient.concat(newStop)
    }));
  };
  return (() => {
    var _el$4 = _tmpl$3$1(),
      _el$5 = _el$4.firstChild;
    addEventListener(_el$4, "dblclick", onGradientContainerDoubleClick);
    addEventListener(_el$4, "mouseleave", onGradientContainerMouseLeave);
    addEventListener(_el$4, "mousemove", {
      handleEvent: onGradientContainerMouseMove,
      capture: true
    });
    insert(_el$4, createComponent(Show, {
      get when() {
        return forecast();
      },
      get children() {
        return createComponent(GradientMarker, {
          get type() {
            return GradientMarkerType.CURRENT;
          },
          get temperatureCelsius() {
            return forecast().current.temperature_2m;
          }
        });
      }
    }), _el$5);
    insert(_el$4, createComponent(Show, {
      get when() {
        return hoveringTemperature();
      },
      get children() {
        return createComponent(GradientMarker, {
          get type() {
            return GradientMarkerType.CURSOR;
          },
          get temperatureCelsius() {
            return hoveringTemperature();
          }
        });
      }
    }), _el$5);
    insert(_el$4, temperatureGradientCanvas, _el$5);
    insert(_el$5, createComponent(Index, {
      get each() {
        return settings().temperatureGradient;
      },
      children: (stop, index) => {
        const onMove = newPercent => {
          saveSettings(previousSettings => _extends({}, previousSettings, {
            temperatureGradient: previousSettings.temperatureGradient.with(index, _extends({}, stop(), {
              percent: newPercent
            }))
          }));
        };
        const onColorChange = newColor => {
          saveSettings(previousSettings => _extends({}, previousSettings, {
            temperatureGradient: previousSettings.temperatureGradient.with(index, _extends({}, stop(), {
              color: newColor
            }))
          }));
        };
        const onDelete = () => {
          saveSettings(previousSettings => _extends({}, previousSettings, {
            temperatureGradient: previousSettings.temperatureGradient.toSpliced(index, 1)
          }));
        };
        return createComponent(GradientColorStop, {
          get color() {
            return stop().color;
          },
          get percent() {
            return stop().percent;
          },
          onMove: onMove,
          onChange: onColorChange,
          onDelete: onDelete
        });
      }
    }));
    createRenderEffect(_p$ => {
      var _v$3 = styles$2['gradient-container'],
        _v$4 = styles$2['stops-container'];
      _v$3 !== _p$.e && className(_el$4, _p$.e = _v$3);
      _v$4 !== _p$.t && className(_el$5, _p$.t = _v$4);
      return _p$;
    }, {
      e: undefined,
      t: undefined
    });
    return _el$4;
  })();
};
var SettingsGradientFieldGroup = () => {
  const id = `${MOD_DOM_SAFE_PREFIX}temperature-gradient`;
  const onResetButtonClick = () => {
    if (!confirm(['This will reset the thermometer gradient range and color stops to their default values.', 'Are you sure you want to continue?'].join('\n'))) {
      return;
    }
    saveSettings(previousSettings => _extends({}, previousSettings, getDefaultTemperatureGradientSettings()));
  };
  return (() => {
    var _el$6 = _tmpl$4$1(),
      _el$7 = _el$6.firstChild,
      _el$8 = _el$7.firstChild,
      _el$9 = _el$8.nextSibling;
    insert(_el$6, createComponent(SingleInstanceStyle, {
      key: "SettingsGradientFieldGroup",
      children: stylesheet$4
    }), _el$7);
    setAttribute(_el$8, "for", id);
    addEventListener(_el$9, "click", onResetButtonClick);
    insert(_el$6, createComponent(GradientRange, {}), null);
    insert(_el$6, createComponent(GradientContainer, {}), null);
    createRenderEffect(_p$ => {
      var _v$5 = styles$2['gradient-field-group'],
        _v$6 = styles$2['label'];
      _v$5 !== _p$.e && className(_el$6, _p$.e = _v$5);
      _v$6 !== _p$.t && className(_el$7, _p$.t = _v$6);
      return _p$;
    }, {
      e: undefined,
      t: undefined
    });
    return _el$6;
  })();
};

var irfPanelDesignStyles = {"toggle":"thermometer-irf-panel-design-toggle"};
var stylesheet$1="/*\n * Copied from <https://raw.githubusercontent.com/Mikarific/InternetRoadtripFramework/c8fbacda2f65d7ff76b9ad94d155ad2c20829abd/src/lib/panel.module.css>.\n * We cannot use IRF.ui.panel.styles.* because those classes are not accessible from inside the shadow root we create for our settings panel.\n *\n * TODO(netux): Consider a better solution for IRF 0.5.0-beta?\n */\n\n.thermometer-irf-panel-design-toggle {\n  --toggle-offset: -1.5rem;\n  width: 3rem;\n  height: 1.5rem;\n  margin: 0;\n  box-shadow:\n    inset var(--toggle-offset) 0 0 2px #000,\n    inset 0 0 0 2px #000;\n  transition-property: box-shadow;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  -webkit-appearance: none;\n  appearance: none;\n  border: 1px solid #848e95;\n  border-radius: 9999px;\n  background: #848e95;\n  cursor: pointer;\n}\n.thermometer-irf-panel-design-toggle:checked {\n  --toggle-offset: 1.5rem;\n  background: #fff;\n  border-color: #fff;\n}\n.thermometer-irf-panel-design-toggle:disabled {\n  cursor: not-allowed;\n  opacity: 0.3;\n}\n\n.thermometer-irf-panel-design-slider {\n  width: 100%;\n  height: 1.5rem;\n  margin: 0;\n  border-radius: 0.75rem;\n  background-color: #0000;\n  border: none;\n  overflow: hidden;\n  appearance: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  cursor: pointer;\n  vertical-align: middle;\n}\n\n.thermometer-irf-panel-design-slider:focus {\n  outline: none;\n}\n.thermometer-irf-panel-design-slider:focus-visible {\n  outline-offset: 2px;\n  outline: 2px solid;\n}\n.thermometer-irf-panel-design-slider::-webkit-slider-runnable-track {\n  background-color: #41474b;\n  border-radius: 0.5rem;\n  width: 100%;\n  height: 0.75rem;\n}\n@media (forced-colors: active) {\n  .thermometer-irf-panel-design-slider::-webkit-slider-runnable-track {\n    border: 1px solid;\n  }\n  .thermometer-irf-panel-design-slider::-moz-range-track {\n    border: 1px solid;\n  }\n}\n.thermometer-irf-panel-design-slider::-webkit-slider-thumb {\n  box-sizing: border-box;\n  border-radius: 0.75rem;\n  height: 1.5rem;\n  width: 1.5rem;\n  border: 0.25rem solid;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  color: #fff;\n  box-shadow:\n    0 0 0 2rem #000 inset,\n    -100.75rem 0 0 100rem;\n  background-color: #fff;\n  position: relative;\n  top: 50%;\n  transform: translateY(-50%);\n}\n.thermometer-irf-panel-design-slider::-moz-range-track {\n  background-color: #41474b;\n  border-radius: 0.5rem;\n  width: 100%;\n  height: 0.75rem;\n}\n.thermometer-irf-panel-design-slider::-moz-range-thumb {\n  box-sizing: border-box;\n  border-radius: 0.75rem;\n  height: 1.5rem;\n  width: 1.5rem;\n  border: 0.25rem solid;\n  color: #fff;\n  box-shadow:\n    0 0 0 2rem #000 inset,\n    -100.75rem 0 0 100rem;\n  background-color: #fff;\n  position: relative;\n  top: 50%;\n}\n.thermometer-irf-panel-design-slider:disabled {\n  cursor: not-allowed;\n  opacity: 0.3;\n}\n";

var stylesheet="input:is(:not([type]), [type='text'], [type='number']),\nselect {\n  --padding-inline: 0.5rem;\n  --border-radius: 0.8rem;\n  --border-color: #848e95;\n\n  width: calc(100% - var(--padding-inline)*2);\n  min-height: 1.5rem;\n  margin: 0;\n  padding-inline: var(--padding-inline);\n  color: white;\n  background: transparent;\n  border: 1px solid var(--border-color);\n  font-size: 100%;\n  border-radius: var(--border-radius);\n}\n\noption {\n  background-color: black;\n}\n\n@supports (appearance: base-select) {\n  select,\n  ::picker(select) {\n    appearance: base-select;\n    font-size: 0.9rem;\n  }\n\n  select::picker-icon {\n    scale: 0.9;\n    margin-right: 0.125rem;\n  }\n\n  select:open {\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0;\n    border-bottom-color: transparent;\n  }\n\n  ::picker(select) {\n    margin-top: -1px;\n    border: none;\n    background-color: black;\n    border-bottom-left-radius: var(--border-radius);\n    border-bottom-right-radius: var(--border-radius);\n    border: 1px solid var(--border-color);\n    border-top-color: transparent;\n  }\n\n  option {\n    color: white;\n    background-color: black;\n  }\n\n    option::checkmark {\n      display: none;\n    }\n\n    option:checked {\n      background-color: rgb(255 255 255 / 10%);\n    }\n\n    option:hover {\n      background-color: rgb(255 255 255 / 20%);\n    }\n}\n\nbutton {\n  padding: 0.25rem;\n  margin-left: 0.125rem;\n  gap: 0.25rem;\n  cursor: pointer;\n  border: none;\n  font-size: 0.9rem;\n  align-items: center;\n  justify-content: center;\n  background-color: white;\n  display: inline-flex;\n}\n\nbutton:hover {\n    background-color: #d3d3d3;\n  }\n\nbutton > img {\n    width: 1rem;\n    aspect-ratio: 1;\n  }\n";

var _tmpl$ = /*#__PURE__*/template(`<select>`),
  _tmpl$2 = /*#__PURE__*/template(`<option>`),
  _tmpl$3 = /*#__PURE__*/template(`<input type=checkbox>`),
  _tmpl$4 = /*#__PURE__*/template(`<h2>Clock`),
  _tmpl$5 = /*#__PURE__*/template(`<h2>Temperature`),
  _tmpl$6 = /*#__PURE__*/template(`<h2>Relative Humidity`),
  _tmpl$7 = /*#__PURE__*/template(`<button>Reset widget position`);
const SettingsTemperatureUnitFieldGroup = () => {
  const label = 'Temperature Unit';
  const id = `${MOD_DOM_SAFE_PREFIX}temperature-unit`;
  const onChange = async event => {
    await saveSettings({
      temperatureUnit: event.currentTarget.value
    });
  };
  return createComponent(SettingsFieldGroup, {
    id: id,
    label: label,
    get children() {
      var _el$ = _tmpl$();
      addEventListener(_el$, "change", onChange);
      setAttribute(_el$, "id", id);
      insert(_el$, createComponent(For, {
        get each() {
          return Object.entries(TEMPERATURE_UNITS);
        },
        children: ([value, {
          label
        }]) => (() => {
          var _el$2 = _tmpl$2();
          _el$2.value = value;
          insert(_el$2, label);
          return _el$2;
        })()
      }));
      createRenderEffect(() => _el$.value = settings().temperatureUnit);
      return _el$;
    }
  });
};
const SettingsToggleFieldGroup = function (props) {
  props = mergeProps({
    inverted: false,
    disabled: false
  }, props);
  const onChange = async event => {
    const checked = event.currentTarget.checked;
    await saveSettings({
      [props.field]: props.inverted ? !checked : checked
    });
  };
  return createComponent(SettingsFieldGroup, {
    get id() {
      return props.id;
    },
    get label() {
      return props.label;
    },
    get children() {
      var _el$3 = _tmpl$3();
      addEventListener(_el$3, "change", onChange);
      createRenderEffect(_p$ => {
        var _v$ = props.id,
          _v$2 = irfPanelDesignStyles['toggle'],
          _v$3 = props.disabled;
        _v$ !== _p$.e && setAttribute(_el$3, "id", _p$.e = _v$);
        _v$2 !== _p$.t && className(_el$3, _p$.t = _v$2);
        _v$3 !== _p$.a && (_el$3.disabled = _p$.a = _v$3);
        return _p$;
      }, {
        e: undefined,
        t: undefined,
        a: undefined
      });
      createRenderEffect(() => _el$3.checked = props.inverted ? !settings()[props.field] : settings()[props.field]);
      return _el$3;
    }
  });
};
var SettingsTab = () => {
  return [createComponent(SingleInstanceStyle, {
    key: "SettingsTab",
    children: stylesheet
  }), createComponent(SingleInstanceStyle, {
    key: "IRFTabExported",
    children: stylesheet$1
  }), _tmpl$4(), createComponent(SettingsToggleFieldGroup, {
    id: `${MOD_DOM_SAFE_PREFIX}show-clock`,
    label: "Show Clock",
    field: "showClock"
  }), createComponent(SettingsToggleFieldGroup, {
    id: `${MOD_DOM_SAFE_PREFIX}time-24-hour`,
    label: "Use AM/PM",
    field: "time24Hours",
    inverted: true,
    get disabled() {
      return !settings().showClock;
    }
  }), createComponent(SettingsToggleFieldGroup, {
    id: `${MOD_DOM_SAFE_PREFIX}time-include-seconds`,
    label: "Show Seconds",
    field: "timeIncludeSeconds",
    get disabled() {
      return !settings().showClock;
    }
  }), _tmpl$5(), createComponent(SettingsToggleFieldGroup, {
    id: `${MOD_DOM_SAFE_PREFIX}show-temperature`,
    label: "Show Temperature",
    field: "showTemperature"
  }), createComponent(SettingsTemperatureUnitFieldGroup, {}), createComponent(SettingsGradientFieldGroup, {}), _tmpl$6(), createComponent(SettingsToggleFieldGroup, {
    id: `${MOD_DOM_SAFE_PREFIX}show-relative-humidity`,
    label: "Show Relative Humidity",
    field: "showRelativeHumidity"
  }), (() => {
    var _el$7 = _tmpl$7();
    addEventListener(_el$7, "click", async () => {
      await saveSettings({
        widgetPosition: undefined,
        widgetMobilePosition: undefined,
        [resolvedWidgetPositionKey()]: getDefaultWidgetPosition()
      });
    });
    return _el$7;
  })()];
};

function createWidget() {
  const panel = makePanel({
    element: Thermometer,
    zIndex: 200
  });
  setWidgetPanel(panel);
  panel.show();
  panel.movable.setPosition(resolvedWidgetPositionSetting().x, resolvedWidgetPositionSetting().y);
}
function createIrfTab() {
  const irfTab = IRF.ui.panel.createTabFor(_extends({}, GM.info, {
    script: _extends({}, GM.info.script, {
      name: MOD_NAME,
      icon: null // prevent slowing down presence of IRF button while downloading our custom icon
    })
  }), {
    tabName: MOD_NAME,
    className: irfTabStyles['tab-content'],
    style: stylesheet$6
  });
  setIrfTab(irfTab);
  render(
  // <ShadowRooted> is a workaround for IRF not having per-tab stylesheet isolation.
  // TODO(netux): remove <ShadowRooted> for IRF v0.5.0-beta
  () => createComponent(ShadowRooted, {
    get children() {
      return createComponent(SettingsTab, {});
    }
  }), irfTab.container);
}
async function tickForecast() {
  const containerVDOM = await IRF.vdom.container;
  setForecastLoading();
  let forecast;
  try {
    forecast = await fetchForecast([containerVDOM.state.currentCoords.lat, containerVDOM.state.currentCoords.lng]);
  } catch (error) {
    setForecastLoadFailure(error);
    console.error(MOD_LOG_PREFIX, 'Could not fetch forecast', error);
    return;
  }
  console.debug(MOD_LOG_PREFIX, 'New forecast received:', forecast);
  setForecastLoadSuccess(forecast);
}
function boot() {
  if (widgetPanel() == null) {
    createWidget();
  }
  if (irfTab() == null) {
    createIrfTab();
  }
  waitForCoordinatesToBeSetAtLeastOnce.then(() => {
    setTickForecastInterval(setInterval(tickForecast, 15 * 60000 /* every 15 minutes */));
    tickForecast();
  });
  waitFor(() => !isTrulyInternetRoadtrip()).then(shut);
}
function shut() {
  var _widgetPanel;
  (_widgetPanel = widgetPanel()) == null || _widgetPanel.hide();
  if (tickForecastInterval() != null) {
    clearInterval(tickForecastInterval());
    setTickForecastInterval(null);
  }
  waitFor(isTrulyInternetRoadtrip).then(boot);
}
waitFor(isTrulyInternetRoadtrip).then(boot);

})(IRF, VM);

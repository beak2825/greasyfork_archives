// ==UserScript==
// @name          延河课堂视频下载
// @namespace     xioneko
// @version       1.0.2
// @description   一个开箱即用的延河课堂视频下载脚本，用户界面友好，傻瓜式操作
// @license       MIT
// @match         https://www.yanhekt.cn/course/*
// @icon          https://www.yanhekt.cn/yhkt.ico
// @supportURL    https://github.com/xioneko/yanhekt-downloader/issues
// @homepageURL   https://github.com/xioneko/yanhekt-downloader#readme
// @inject-into   content
// @unwrap        true
// @noframes      true
// @downloadURL https://update.greasyfork.org/scripts/496320/%E5%BB%B6%E6%B2%B3%E8%AF%BE%E5%A0%82%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/496320/%E5%BB%B6%E6%B2%B3%E8%AF%BE%E5%A0%82%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
  const style = document.createElement("style");
  document.head.appendChild(style);
  style.textContent = `
#--unocss-layer-start--__ALL__-- {
  start: __ALL__;
}
*,
:before,
:after {
  --un-rotate:0;
  --un-rotate-x:0;
  --un-rotate-y:0;
  --un-rotate-z:0;
  --un-scale-x:1;
  --un-scale-y:1;
  --un-scale-z:1;
  --un-skew-x:0;
  --un-skew-y:0;
  --un-translate-x:0;
  --un-translate-y:0;
  --un-translate-z:0;
  --un-pan-x: ;
  --un-pan-y: ;
  --un-pinch-zoom: ;
  --un-scroll-snap-strictness:proximity;
  --un-ordinal: ;
  --un-slashed-zero: ;
  --un-numeric-figure: ;
  --un-numeric-spacing: ;
  --un-numeric-fraction: ;
  --un-border-spacing-x:0;
  --un-border-spacing-y:0;
  --un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);
  --un-ring-shadow:0 0 rgb(0 0 0 / 0);
  --un-shadow-inset: ;
  --un-shadow:0 0 rgb(0 0 0 / 0);
  --un-ring-inset: ;
  --un-ring-offset-width:0px;
  --un-ring-offset-color:#fff;
  --un-ring-width:0px;
  --un-ring-color:rgb(147 197 253 / .5);
  --un-blur: ;
  --un-brightness: ;
  --un-contrast: ;
  --un-drop-shadow: ;
  --un-grayscale: ;
  --un-hue-rotate: ;
  --un-invert: ;
  --un-saturate: ;
  --un-sepia: ;
  --un-backdrop-blur: ;
  --un-backdrop-brightness: ;
  --un-backdrop-contrast: ;
  --un-backdrop-grayscale: ;
  --un-backdrop-hue-rotate: ;
  --un-backdrop-invert: ;
  --un-backdrop-opacity: ;
  --un-backdrop-saturate: ;
  --un-backdrop-sepia: ;
}
::backdrop {
  --un-rotate:0;
  --un-rotate-x:0;
  --un-rotate-y:0;
  --un-rotate-z:0;
  --un-scale-x:1;
  --un-scale-y:1;
  --un-scale-z:1;
  --un-skew-x:0;
  --un-skew-y:0;
  --un-translate-x:0;
  --un-translate-y:0;
  --un-translate-z:0;
  --un-pan-x: ;
  --un-pan-y: ;
  --un-pinch-zoom: ;
  --un-scroll-snap-strictness:proximity;
  --un-ordinal: ;
  --un-slashed-zero: ;
  --un-numeric-figure: ;
  --un-numeric-spacing: ;
  --un-numeric-fraction: ;
  --un-border-spacing-x:0;
  --un-border-spacing-y:0;
  --un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);
  --un-ring-shadow:0 0 rgb(0 0 0 / 0);
  --un-shadow-inset: ;
  --un-shadow:0 0 rgb(0 0 0 / 0);
  --un-ring-inset: ;
  --un-ring-offset-width:0px;
  --un-ring-offset-color:#fff;
  --un-ring-width:0px;
  --un-ring-color:rgb(147 197 253 / .5);
  --un-blur: ;
  --un-brightness: ;
  --un-contrast: ;
  --un-drop-shadow: ;
  --un-grayscale: ;
  --un-hue-rotate: ;
  --un-invert: ;
  --un-saturate: ;
  --un-sepia: ;
  --un-backdrop-blur: ;
  --un-backdrop-brightness: ;
  --un-backdrop-contrast: ;
  --un-backdrop-grayscale: ;
  --un-backdrop-hue-rotate: ;
  --un-backdrop-invert: ;
  --un-backdrop-opacity: ;
  --un-backdrop-saturate: ;
  --un-backdrop-sepia: ;
}
.visible {
  visibility: visible;
}
.absolute {
  position: absolute;
}
.fixed {
  position: fixed;
}
.relative {
  position: relative;
}
.bottom-\\[24px\\] {
  bottom: 24px;
}
.bottom-0 {
  bottom: 0;
}
.left-0 {
  left: 0;
}
.right-\\[10px\\] {
  right: 10px;
}
.right-\\[24px\\] {
  right: 24px;
}
.top-\\[10px\\] {
  top: 10px;
}
.top-0 {
  top: 0;
}
.z-24 {
  z-index: 24;
}
.mb-\\[16px\\] {
  margin-bottom: 16px;
}
.mt-\\[4px\\] {
  margin-top: 4px;
}
.hidden\\! {
  display: none !important;
}
.h-\\[20px\\] {
  height: 20px;
}
.h-\\[3px\\] {
  height: 3px;
}
.h-\\[64px\\] {
  height: 64px;
}
.h-3\\/5 {
  height: 60%;
}
.h-full {
  height: 100%;
}
.h4 {
  height: 1rem;
}
.w-\\[288px\\] {
  width: 288px;
}
.w-full {
  width: 100%;
}
.flex {
  display: flex;
}
.inline-flex {
  display: inline-flex;
}
.flex-1 {
  flex: 1 1 0%;
}
.flex-shrink-0 {
  flex-shrink: 0;
}
.flex-basis-\\[72px\\] {
  flex-basis: 72px;
}
.flex-row {
  flex-direction: row;
}
.flex-col {
  flex-direction: column;
}
.flex-col-reverse {
  flex-direction: column-reverse;
}
.scale-90 {
  --un-scale-x:.9;
  --un-scale-y:.9;
  transform: translate(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotate(var(--un-rotate-z)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));
}
.cursor-pointer {
  cursor: pointer;
}
.select-none {
  -webkit-user-select: none;
  user-select: none;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.gap-\\[12px\\] {
  gap: 12px;
}
.gap-\\[16px\\] {
  gap: 16px;
}
.gap-\\[6px\\] {
  gap: 6px;
}
.overflow-hidden {
  overflow: hidden;
}
.text-ellipsis {
  text-overflow: ellipsis;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.break-keep {
  word-break: keep-all;
}
.rounded-\\[2px\\] {
  border-radius: 2px;
}
.rounded-\\[6px\\] {
  border-radius: 6px;
}
.border-none {
  border-style: none;
}
.bg-black {
  --un-bg-opacity:1;
  background-color: rgb(0 0 0 / var(--un-bg-opacity));
}
.bg-transparent {
  background-color: transparent;
}
.bg-white {
  --un-bg-opacity:1;
  background-color: rgb(255 255 255 / var(--un-bg-opacity));
}
.bg-opacity-50 {
  --un-bg-opacity:.5;
}
.p-0 {
  padding: 0;
}
.px {
  padding-left: 1rem;
  padding-right: 1rem;
}
.px-\\[12px\\] {
  padding-left: 12px;
  padding-right: 12px;
}
.px-\\[15px\\] {
  padding-left: 15px;
  padding-right: 15px;
}
.py-\\[16px\\] {
  padding-top: 16px;
  padding-bottom: 16px;
}
.py-\\[20px\\] {
  padding-top: 20px;
  padding-bottom: 20px;
}
.text-right {
  text-align: right;
}
.text-\\[0\\.8em\\] {
  font-size: .8em;
}
.text-\\[0\\.9em\\] {
  font-size: .9em;
}
.text-\\[1\\.2em\\] {
  font-size: 1.2em;
}
.text-\\[\\#0f86ff\\] {
  --un-text-opacity:1;
  color: rgb(15 134 255 / var(--un-text-opacity));
}
.text-\\[\\#333\\] {
  --un-text-opacity:1;
  color: rgb(51 51 51 / var(--un-text-opacity));
}
.text-\\[\\#666\\] {
  --un-text-opacity:1;
  color: rgb(102 102 102 / var(--un-text-opacity));
}
.opacity-0 {
  opacity: 0;
}
.opacity-75 {
  opacity: .75;
}
.shadow-md {
  --un-shadow:var(--un-shadow-inset) 0 4px 6px -1px var(--un-shadow-color, rgb(0 0 0 / .1)),var(--un-shadow-inset) 0 2px 4px -2px var(--un-shadow-color, rgb(0 0 0 / .1));
  box-shadow:
    var(--un-ring-offset-shadow),
    var(--un-ring-shadow),
    var(--un-shadow);
}
.hover\\:brightness-110:hover {
  --un-brightness:brightness(1.1);
  filter: var(--un-blur) var(--un-brightness) var(--un-contrast) var(--un-drop-shadow) var(--un-grayscale) var(--un-hue-rotate) var(--un-invert) var(--un-saturate) var(--un-sepia);
}
.active\\:brightness-90:active {
  --un-brightness:brightness(.9);
  filter: var(--un-blur) var(--un-brightness) var(--un-contrast) var(--un-drop-shadow) var(--un-grayscale) var(--un-hue-rotate) var(--un-invert) var(--un-saturate) var(--un-sepia);
}
.transition {
  transition-property:
    color,
    background-color,
    border-color,
    outline-color,
    text-decoration-color,
    fill,
    stroke,
    opacity,
    box-shadow,
    transform,
    filter,
    backdrop-filter;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  transition-duration: .15s;
}
.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  transition-duration: .15s;
}
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  transition-duration: .15s;
}
.duration-300 {
  transition-duration: .3s;
}
.ease-out {
  transition-timing-function: cubic-bezier(0, 0, .2, 1);
}
@media (min-width: 768px) {
  .md\\:inline\\! {
    display: inline !important;
  }
}
#--unocss-layer-end--__ALL__-- {
  end: __ALL__;
}
`;
})()
var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj)), __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value), __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
(function() {
  "use strict";
  var _worker, _resolves, _rejects, _logEventCallbacks, _progressEventCallbacks, _registerHandlers, _send;
  var _documentCurrentScript = typeof document < "u" ? document.currentScript : null;
  const sharedConfig = {
    context: void 0,
    registry: void 0,
    getContextId() {
      return getContextId(this.context.count);
    },
    getNextContextId() {
      return getContextId(this.context.count++);
    }
  };
  function getContextId(count) {
    const num = String(count), len = num.length - 1;
    return sharedConfig.context.id + (len ? String.fromCharCode(96 + len) : "") + num;
  }
  const equalFn = (a, b) => a === b, $PROXY = Symbol("solid-proxy"), $TRACK = Symbol("solid-track"), signalOptions = {
    equals: equalFn
  };
  let runEffects = runQueue;
  const STALE = 1, PENDING = 2, UNOWNED = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var Owner = null;
  let Transition = null, ExternalSourceConfig = null, Listener = null, Updates = null, Effects = null, ExecCount = 0;
  function createRoot(fn, detachedOwner) {
    const listener = Listener, owner = Owner, unowned = fn.length === 0, current = detachedOwner === void 0 ? owner : detachedOwner, root2 = unowned ? UNOWNED : {
      owned: null,
      cleanups: null,
      context: current ? current.context : null,
      owner: current
    }, updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root2)));
    Owner = root2, Listener = null;
    try {
      return runUpdates(updateFn, !0);
    } finally {
      Listener = listener, Owner = owner;
    }
  }
  function createSignal(value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const s = {
      value,
      observers: null,
      observerSlots: null,
      comparator: options.equals || void 0
    }, setter = (value2) => (typeof value2 == "function" && (value2 = value2(s.value)), writeSignal(s, value2));
    return [readSignal.bind(s), setter];
  }
  function createRenderEffect(fn, value, options) {
    const c = createComputation(fn, value, !1, STALE);
    updateComputation(c);
  }
  function createEffect(fn, value, options) {
    runEffects = runUserEffects;
    const c = createComputation(fn, value, !1, STALE);
    (!options || !options.render) && (c.user = !0), Effects ? Effects.push(c) : updateComputation(c);
  }
  function createMemo(fn, value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const c = createComputation(fn, value, !0, 0);
    return c.observers = null, c.observerSlots = null, c.comparator = options.equals || void 0, updateComputation(c), readSignal.bind(c);
  }
  function batch(fn) {
    return runUpdates(fn, !1);
  }
  function untrack(fn) {
    if (Listener === null) return fn();
    const listener = Listener;
    Listener = null;
    try {
      return fn();
    } finally {
      Listener = listener;
    }
  }
  function onMount(fn) {
    createEffect(() => untrack(fn));
  }
  function onCleanup(fn) {
    return Owner === null || (Owner.cleanups === null ? Owner.cleanups = [fn] : Owner.cleanups.push(fn)), fn;
  }
  function getListener() {
    return Listener;
  }
  function getOwner() {
    return Owner;
  }
  function runWithOwner(o, fn) {
    const prev = Owner, prevListener = Listener;
    Owner = o, Listener = null;
    try {
      return runUpdates(fn, !0);
    } catch (err) {
      handleError(err);
    } finally {
      Owner = prev, Listener = prevListener;
    }
  }
  function startTransition(fn) {
    const l = Listener, o = Owner;
    return Promise.resolve().then(() => {
      Listener = l, Owner = o;
      let t;
      return runUpdates(fn, !1), Listener = Owner = null, t ? t.done : void 0;
    });
  }
  const [transPending, setTransPending] = /* @__PURE__ */ createSignal(!1);
  function useTransition() {
    return [transPending, startTransition];
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
    let value;
    return Owner && Owner.context && (value = Owner.context[context.id]) !== void 0 ? value : context.defaultValue;
  }
  function children(fn) {
    const children2 = createMemo(fn), memo = createMemo(() => resolveChildren(children2()));
    return memo.toArray = () => {
      const c = memo();
      return Array.isArray(c) ? c : c != null ? [c] : [];
    }, memo;
  }
  function readSignal() {
    if (this.sources && this.state)
      if (this.state === STALE) updateComputation(this);
      else {
        const updates = Updates;
        Updates = null, runUpdates(() => lookUpstream(this), !1), Updates = updates;
      }
    if (Listener) {
      const sSlot = this.observers ? this.observers.length : 0;
      Listener.sources ? (Listener.sources.push(this), Listener.sourceSlots.push(sSlot)) : (Listener.sources = [this], Listener.sourceSlots = [sSlot]), this.observers ? (this.observers.push(Listener), this.observerSlots.push(Listener.sources.length - 1)) : (this.observers = [Listener], this.observerSlots = [Listener.sources.length - 1]);
    }
    return this.value;
  }
  function writeSignal(node, value, isComp) {
    let current = node.value;
    return (!node.comparator || !node.comparator(current, value)) && (node.value = value, node.observers && node.observers.length && runUpdates(() => {
      for (let i = 0; i < node.observers.length; i += 1) {
        const o = node.observers[i], TransitionRunning = Transition && Transition.running;
        TransitionRunning && Transition.disposed.has(o), (TransitionRunning ? !o.tState : !o.state) && (o.pure ? Updates.push(o) : Effects.push(o), o.observers && markDownstream(o)), TransitionRunning || (o.state = STALE);
      }
      if (Updates.length > 1e6)
        throw Updates = [], new Error();
    }, !1)), value;
  }
  function updateComputation(node) {
    if (!node.fn) return;
    cleanNode(node);
    const time = ExecCount;
    runComputation(node, node.value, time);
  }
  function runComputation(node, value, time) {
    let nextValue;
    const owner = Owner, listener = Listener;
    Listener = Owner = node;
    try {
      nextValue = node.fn(value);
    } catch (err) {
      return node.pure && (node.state = STALE, node.owned && node.owned.forEach(cleanNode), node.owned = null), node.updatedAt = time + 1, handleError(err);
    } finally {
      Listener = listener, Owner = owner;
    }
    (!node.updatedAt || node.updatedAt <= time) && (node.updatedAt != null && "observers" in node ? writeSignal(node, nextValue) : node.value = nextValue, node.updatedAt = time);
  }
  function createComputation(fn, init, pure, state = STALE, options) {
    const c = {
      fn,
      state,
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
    return Owner === null || Owner !== UNOWNED && (Owner.owned ? Owner.owned.push(c) : Owner.owned = [c]), c;
  }
  function runTop(node) {
    if (node.state === 0) return;
    if (node.state === PENDING) return lookUpstream(node);
    if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
    const ancestors = [node];
    for (; (node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount); )
      node.state && ancestors.push(node);
    for (let i = ancestors.length - 1; i >= 0; i--)
      if (node = ancestors[i], node.state === STALE)
        updateComputation(node);
      else if (node.state === PENDING) {
        const updates = Updates;
        Updates = null, runUpdates(() => lookUpstream(node, ancestors[0]), !1), Updates = updates;
      }
  }
  function runUpdates(fn, init) {
    if (Updates) return fn();
    let wait = !1;
    init || (Updates = []), Effects ? wait = !0 : Effects = [], ExecCount++;
    try {
      const res = fn();
      return completeUpdates(wait), res;
    } catch (err) {
      wait || (Effects = null), Updates = null, handleError(err);
    }
  }
  function completeUpdates(wait) {
    if (Updates && (runQueue(Updates), Updates = null), wait) return;
    const e = Effects;
    Effects = null, e.length && runUpdates(() => runEffects(e), !1);
  }
  function runQueue(queue) {
    for (let i = 0; i < queue.length; i++) runTop(queue[i]);
  }
  function runUserEffects(queue) {
    let i, userLength = 0;
    for (i = 0; i < queue.length; i++) {
      const e = queue[i];
      e.user ? queue[userLength++] = e : runTop(e);
    }
    for (i = 0; i < userLength; i++) runTop(queue[i]);
  }
  function lookUpstream(node, ignore) {
    node.state = 0;
    for (let i = 0; i < node.sources.length; i += 1) {
      const source = node.sources[i];
      if (source.sources) {
        const state = source.state;
        state === STALE ? source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount) && runTop(source) : state === PENDING && lookUpstream(source, ignore);
      }
    }
  }
  function markDownstream(node) {
    for (let i = 0; i < node.observers.length; i += 1) {
      const o = node.observers[i];
      o.state || (o.state = PENDING, o.pure ? Updates.push(o) : Effects.push(o), o.observers && markDownstream(o));
    }
  }
  function cleanNode(node) {
    let i;
    if (node.sources)
      for (; node.sources.length; ) {
        const source = node.sources.pop(), index = node.sourceSlots.pop(), obs = source.observers;
        if (obs && obs.length) {
          const n = obs.pop(), s = source.observerSlots.pop();
          index < obs.length && (n.sourceSlots[s] = index, obs[index] = n, source.observerSlots[index] = s);
        }
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
    return err instanceof Error ? err : new Error(typeof err == "string" ? err : "Unknown error", {
      cause: err
    });
  }
  function handleError(err, owner = Owner) {
    throw castError(err);
  }
  function resolveChildren(children2) {
    if (typeof children2 == "function" && !children2.length) return resolveChildren(children2());
    if (Array.isArray(children2)) {
      const results = [];
      for (let i = 0; i < children2.length; i++) {
        const result = resolveChildren(children2[i]);
        Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
      }
      return results;
    }
    return children2;
  }
  function createProvider(id, options) {
    return function(props) {
      let res;
      return createRenderEffect(() => res = untrack(() => (Owner.context = {
        ...Owner.context,
        [id]: props.value
      }, children(() => props.children))), void 0), res;
    };
  }
  const FALLBACK = Symbol("fallback");
  function dispose(d) {
    for (let i = 0; i < d.length; i++) d[i]();
  }
  function mapArray(list, mapFn, options = {}) {
    let items = [], mapped = [], disposers = [], len = 0, indexes = mapFn.length > 1 ? [] : null;
    return onCleanup(() => dispose(disposers)), () => {
      let newItems = list() || [], newLen = newItems.length, i, j2;
      return newItems[$TRACK], untrack(() => {
        let newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start, end, newEnd, item;
        if (newLen === 0)
          len !== 0 && (dispose(disposers), disposers = [], items = [], mapped = [], len = 0, indexes && (indexes = [])), options.fallback && (items = [FALLBACK], mapped[0] = createRoot((disposer) => (disposers[0] = disposer, options.fallback())), len = 1);
        else if (len === 0) {
          for (mapped = new Array(newLen), j2 = 0; j2 < newLen; j2++)
            items[j2] = newItems[j2], mapped[j2] = createRoot(mapper);
          len = newLen;
        } else {
          for (temp = new Array(newLen), tempdisposers = new Array(newLen), indexes && (tempIndexes = new Array(newLen)), start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++) ;
          for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--)
            temp[newEnd] = mapped[end], tempdisposers[newEnd] = disposers[end], indexes && (tempIndexes[newEnd] = indexes[end]);
          for (newIndices = /* @__PURE__ */ new Map(), newIndicesNext = new Array(newEnd + 1), j2 = newEnd; j2 >= start; j2--)
            item = newItems[j2], i = newIndices.get(item), newIndicesNext[j2] = i === void 0 ? -1 : i, newIndices.set(item, j2);
          for (i = start; i <= end; i++)
            item = items[i], j2 = newIndices.get(item), j2 !== void 0 && j2 !== -1 ? (temp[j2] = mapped[i], tempdisposers[j2] = disposers[i], indexes && (tempIndexes[j2] = indexes[i]), j2 = newIndicesNext[j2], newIndices.set(item, j2)) : disposers[i]();
          for (j2 = start; j2 < newLen; j2++)
            j2 in temp ? (mapped[j2] = temp[j2], disposers[j2] = tempdisposers[j2], indexes && (indexes[j2] = tempIndexes[j2], indexes[j2](j2))) : mapped[j2] = createRoot(mapper);
          mapped = mapped.slice(0, len = newLen), items = newItems.slice(0);
        }
        return mapped;
      });
      function mapper(disposer) {
        if (disposers[j2] = disposer, indexes) {
          const [s, set] = createSignal(j2);
          return indexes[j2] = set, mapFn(newItems[j2], s);
        }
        return mapFn(newItems[j2]);
      }
    };
  }
  let hydrationEnabled = !1;
  function createComponent(Comp, props) {
    return untrack(() => Comp(props || {}));
  }
  const narrowedError = (name) => `Stale read from <${name}>.`;
  function For(props) {
    const fallback = "fallback" in props && {
      fallback: () => props.fallback
    };
    return createMemo(mapArray(() => props.each, props.children, fallback || void 0));
  }
  function Show(props) {
    const keyed = props.keyed, condition = createMemo(() => props.when, void 0, {
      equals: (a, b) => keyed ? a === b : !a == !b
    });
    return createMemo(() => {
      const c = condition();
      if (c) {
        const child = props.children;
        return typeof child == "function" && child.length > 0 ? untrack(() => child(keyed ? c : () => {
          if (!untrack(condition)) throw narrowedError("Show");
          return props.when;
        })) : child;
      }
      return props.fallback;
    }, void 0, void 0);
  }
  function Switch(props) {
    let keyed = !1;
    const equals = (a, b) => (keyed ? a[1] === b[1] : !a[1] == !b[1]) && a[2] === b[2], conditions = children(() => props.children), evalConditions = createMemo(() => {
      let conds = conditions();
      Array.isArray(conds) || (conds = [conds]);
      for (let i = 0; i < conds.length; i++) {
        const c = conds[i].when;
        if (c)
          return keyed = !!conds[i].keyed, [i, c, conds[i]];
      }
      return [-1];
    }, void 0, {
      equals
    });
    return createMemo(() => {
      const [index, when, cond] = evalConditions();
      if (index < 0) return props.fallback;
      const c = cond.children;
      return typeof c == "function" && c.length > 0 ? untrack(() => c(keyed ? when : () => {
        if (untrack(evalConditions)[0] !== index) throw narrowedError("Match");
        return cond.when;
      })) : c;
    }, void 0, void 0);
  }
  function Match(props) {
    return props;
  }
  function reconcileArrays(parentNode, a, b) {
    let bLength = b.length, aEnd = a.length, bEnd = bLength, aStart = 0, bStart = 0, after = a[aEnd - 1].nextSibling, map = null;
    for (; aStart < aEnd || bStart < bEnd; ) {
      if (a[aStart] === b[bStart]) {
        aStart++, bStart++;
        continue;
      }
      for (; a[aEnd - 1] === b[bEnd - 1]; )
        aEnd--, bEnd--;
      if (aEnd === aStart) {
        const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
        for (; bStart < bEnd; ) parentNode.insertBefore(b[bStart++], node);
      } else if (bEnd === bStart)
        for (; aStart < aEnd; )
          (!map || !map.has(a[aStart])) && a[aStart].remove(), aStart++;
      else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
        const node = a[--aEnd].nextSibling;
        parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling), parentNode.insertBefore(b[--bEnd], node), a[aEnd] = b[bEnd];
      } else {
        if (!map) {
          map = /* @__PURE__ */ new Map();
          let i = bStart;
          for (; i < bEnd; ) map.set(b[i], i++);
        }
        const index = map.get(a[aStart]);
        if (index != null)
          if (bStart < index && index < bEnd) {
            let i = aStart, sequence = 1, t;
            for (; ++i < aEnd && i < bEnd && !((t = map.get(a[i])) == null || t !== index + sequence); )
              sequence++;
            if (sequence > index - bStart) {
              const node = a[aStart];
              for (; bStart < index; ) parentNode.insertBefore(b[bStart++], node);
            } else parentNode.replaceChild(b[bStart++], a[aStart++]);
          } else aStart++;
        else a[aStart++].remove();
      }
    }
  }
  const $$EVENTS = "_$DX_DELEGATE";
  function render(code, element, init, options = {}) {
    let disposer;
    return createRoot((dispose2) => {
      disposer = dispose2, element === document ? code() : insert(element, code(), element.firstChild ? null : void 0, init);
    }, options.owner), () => {
      disposer(), element.textContent = "";
    };
  }
  function template(html, isCE, isSVG) {
    let node;
    const create = () => {
      const t = document.createElement("template");
      return t.innerHTML = html, t.content.firstChild;
    }, fn = () => (node || (node = create())).cloneNode(!0);
    return fn.cloneNode = fn, fn;
  }
  function delegateEvents(eventNames, document2 = window.document) {
    const e = document2[$$EVENTS] || (document2[$$EVENTS] = /* @__PURE__ */ new Set());
    for (let i = 0, l = eventNames.length; i < l; i++) {
      const name = eventNames[i];
      e.has(name) || (e.add(name), document2.addEventListener(name, eventHandler));
    }
  }
  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
  }
  function className(node, value) {
    value == null ? node.removeAttribute("class") : node.className = value;
  }
  function use(fn, element, arg) {
    return untrack(() => fn(element, arg));
  }
  function insert(parent, accessor, marker, initial) {
    if (marker !== void 0 && !initial && (initial = []), typeof accessor != "function") return insertExpression(parent, accessor, initial, marker);
    createRenderEffect((current) => insertExpression(parent, accessor(), current, marker), initial);
  }
  function eventHandler(e) {
    const key = `$$${e.type}`;
    let node = e.composedPath && e.composedPath()[0] || e.target;
    for (e.target !== node && Object.defineProperty(e, "target", {
      configurable: !0,
      value: node
    }), Object.defineProperty(e, "currentTarget", {
      configurable: !0,
      get() {
        return node || document;
      }
    }); node; ) {
      const handler = node[key];
      if (handler && !node.disabled) {
        const data = node[`${key}Data`];
        if (data !== void 0 ? handler.call(node, data, e) : handler.call(node, e), e.cancelBubble) return;
      }
      node = node._$host || node.parentNode || node.host;
    }
  }
  function insertExpression(parent, value, current, marker, unwrapArray) {
    for (; typeof current == "function"; ) current = current();
    if (value === current) return current;
    const t = typeof value, multi = marker !== void 0;
    if (parent = multi && current[0] && current[0].parentNode || parent, t === "string" || t === "number") {
      if (t === "number" && (value = value.toString(), value === current))
        return current;
      if (multi) {
        let node = current[0];
        node && node.nodeType === 3 ? node.data !== value && (node.data = value) : node = document.createTextNode(value), current = cleanChildren(parent, current, marker, node);
      } else
        current !== "" && typeof current == "string" ? current = parent.firstChild.data = value : current = parent.textContent = value;
    } else if (value == null || t === "boolean")
      current = cleanChildren(parent, current, marker);
    else {
      if (t === "function")
        return createRenderEffect(() => {
          let v = value();
          for (; typeof v == "function"; ) v = v();
          current = insertExpression(parent, v, current, marker);
        }), () => current;
      if (Array.isArray(value)) {
        const array = [], currentArray = current && Array.isArray(current);
        if (normalizeIncomingArray(array, value, current, unwrapArray))
          return createRenderEffect(() => current = insertExpression(parent, array, current, marker, !0)), () => current;
        if (array.length === 0) {
          if (current = cleanChildren(parent, current, marker), multi) return current;
        } else currentArray ? current.length === 0 ? appendNodes(parent, array, marker) : reconcileArrays(parent, current, array) : (current && cleanChildren(parent), appendNodes(parent, array));
        current = array;
      } else if (value.nodeType) {
        if (Array.isArray(current)) {
          if (multi) return current = cleanChildren(parent, current, marker, value);
          cleanChildren(parent, current, null, value);
        } else current == null || current === "" || !parent.firstChild ? parent.appendChild(value) : parent.replaceChild(value, parent.firstChild);
        current = value;
      }
    }
    return current;
  }
  function normalizeIncomingArray(normalized, array, current, unwrap2) {
    let dynamic = !1;
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i], prev = current && current[normalized.length], t;
      if (!(item == null || item === !0 || item === !1)) if ((t = typeof item) == "object" && item.nodeType)
        normalized.push(item);
      else if (Array.isArray(item))
        dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
      else if (t === "function")
        if (unwrap2) {
          for (; typeof item == "function"; ) item = item();
          dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
        } else
          normalized.push(item), dynamic = !0;
      else {
        const value = String(item);
        prev && prev.nodeType === 3 && prev.data === value ? normalized.push(prev) : normalized.push(document.createTextNode(value));
      }
    }
    return dynamic;
  }
  function appendNodes(parent, array, marker = null) {
    for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
  }
  function cleanChildren(parent, current, marker, replacement) {
    if (marker === void 0) return parent.textContent = "";
    const node = replacement || document.createTextNode("");
    if (current.length) {
      let inserted = !1;
      for (let i = current.length - 1; i >= 0; i--) {
        const el = current[i];
        if (node !== el) {
          const isParent = el.parentNode === parent;
          !inserted && !i ? isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker) : isParent && el.remove();
        } else inserted = !0;
      }
    } else parent.insertBefore(node, marker);
    return [node];
  }
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  function createElement(tagName, isSVG = !1) {
    return isSVG ? document.createElementNS(SVG_NAMESPACE, tagName) : document.createElement(tagName);
  }
  function Portal(props) {
    const {
      useShadow
    } = props, marker = document.createTextNode(""), mount = () => props.mount || document.body, owner = getOwner();
    let content, hydrating = !!sharedConfig.context;
    return createEffect(() => {
      content || (content = runWithOwner(owner, () => createMemo(() => props.children)));
      const el = mount();
      if (el instanceof HTMLHeadElement) {
        const [clean, setClean] = createSignal(!1), cleanup = () => setClean(!0);
        createRoot((dispose2) => insert(el, () => clean() ? dispose2() : content(), null)), onCleanup(cleanup);
      } else {
        const container = createElement(props.isSVG ? "g" : "div", props.isSVG), renderRoot = useShadow && container.attachShadow ? container.attachShadow({
          mode: "open"
        }) : container;
        Object.defineProperty(container, "_$host", {
          get() {
            return marker.parentNode;
          },
          configurable: !0
        }), insert(renderRoot, content), el.appendChild(container), props.ref && props.ref(container), onCleanup(() => el.removeChild(container));
      }
    }, void 0, {
      render: !hydrating
    }), marker;
  }
  const $RAW = Symbol("store-raw"), $NODE = Symbol("store-node"), $HAS = Symbol("store-has"), $SELF = Symbol("store-self");
  function wrap$1(value) {
    let p = value[$PROXY];
    if (!p && (Object.defineProperty(value, $PROXY, {
      value: p = new Proxy(value, proxyTraps$1)
    }), !Array.isArray(value))) {
      const keys = Object.keys(value), desc = Object.getOwnPropertyDescriptors(value);
      for (let i = 0, l = keys.length; i < l; i++) {
        const prop = keys[i];
        desc[prop].get && Object.defineProperty(value, prop, {
          enumerable: desc[prop].enumerable,
          get: desc[prop].get.bind(p)
        });
      }
    }
    return p;
  }
  function isWrappable(obj) {
    let proto;
    return obj != null && typeof obj == "object" && (obj[$PROXY] || !(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype || Array.isArray(obj));
  }
  function unwrap(item, set = /* @__PURE__ */ new Set()) {
    let result, unwrapped, v, prop;
    if (result = item != null && item[$RAW]) return result;
    if (!isWrappable(item) || set.has(item)) return item;
    if (Array.isArray(item)) {
      Object.isFrozen(item) ? item = item.slice(0) : set.add(item);
      for (let i = 0, l = item.length; i < l; i++)
        v = item[i], (unwrapped = unwrap(v, set)) !== v && (item[i] = unwrapped);
    } else {
      Object.isFrozen(item) ? item = Object.assign({}, item) : set.add(item);
      const keys = Object.keys(item), desc = Object.getOwnPropertyDescriptors(item);
      for (let i = 0, l = keys.length; i < l; i++)
        prop = keys[i], !desc[prop].get && (v = item[prop], (unwrapped = unwrap(v, set)) !== v && (item[prop] = unwrapped));
    }
    return item;
  }
  function getNodes(target, symbol) {
    let nodes = target[symbol];
    return nodes || Object.defineProperty(target, symbol, {
      value: nodes = /* @__PURE__ */ Object.create(null)
    }), nodes;
  }
  function getNode(nodes, property, value) {
    if (nodes[property]) return nodes[property];
    const [s, set] = createSignal(value, {
      equals: !1,
      internal: !0
    });
    return s.$ = set, nodes[property] = s;
  }
  function proxyDescriptor$1(target, property) {
    const desc = Reflect.getOwnPropertyDescriptor(target, property);
    return !desc || desc.get || !desc.configurable || property === $PROXY || property === $NODE || (delete desc.value, delete desc.writable, desc.get = () => target[$PROXY][property]), desc;
  }
  function trackSelf(target) {
    getListener() && getNode(getNodes(target, $NODE), $SELF)();
  }
  function ownKeys(target) {
    return trackSelf(target), Reflect.ownKeys(target);
  }
  const proxyTraps$1 = {
    get(target, property, receiver) {
      if (property === $RAW) return target;
      if (property === $PROXY) return receiver;
      if (property === $TRACK)
        return trackSelf(target), receiver;
      const nodes = getNodes(target, $NODE), tracked = nodes[property];
      let value = tracked ? tracked() : target[property];
      if (property === $NODE || property === $HAS || property === "__proto__") return value;
      if (!tracked) {
        const desc = Object.getOwnPropertyDescriptor(target, property);
        getListener() && (typeof value != "function" || target.hasOwnProperty(property)) && !(desc && desc.get) && (value = getNode(nodes, property, value)());
      }
      return isWrappable(value) ? wrap$1(value) : value;
    },
    has(target, property) {
      return property === $RAW || property === $PROXY || property === $TRACK || property === $NODE || property === $HAS || property === "__proto__" ? !0 : (getListener() && getNode(getNodes(target, $HAS), property)(), property in target);
    },
    set() {
      return !0;
    },
    deleteProperty() {
      return !0;
    },
    ownKeys,
    getOwnPropertyDescriptor: proxyDescriptor$1
  };
  function setProperty(state, property, value, deleting = !1) {
    if (!deleting && state[property] === value) return;
    const prev = state[property], len = state.length;
    value === void 0 ? (delete state[property], state[$HAS] && state[$HAS][property] && prev !== void 0 && state[$HAS][property].$()) : (state[property] = value, state[$HAS] && state[$HAS][property] && prev === void 0 && state[$HAS][property].$());
    let nodes = getNodes(state, $NODE), node;
    if ((node = getNode(nodes, property, prev)) && node.$(() => value), Array.isArray(state) && state.length !== len) {
      for (let i = state.length; i < len; i++) (node = nodes[i]) && node.$();
      (node = getNode(nodes, "length", len)) && node.$(state.length);
    }
    (node = nodes[$SELF]) && node.$();
  }
  function mergeStoreNode(state, value) {
    const keys = Object.keys(value);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      setProperty(state, key, value[key]);
    }
  }
  function updateArray(current, next) {
    if (typeof next == "function" && (next = next(current)), next = unwrap(next), Array.isArray(next)) {
      if (current === next) return;
      let i = 0, len = next.length;
      for (; i < len; i++) {
        const value = next[i];
        current[i] !== value && setProperty(current, i, value);
      }
      setProperty(current, "length", len);
    } else mergeStoreNode(current, next);
  }
  function updatePath(current, path, traversed = []) {
    let part, prev = current;
    if (path.length > 1) {
      part = path.shift();
      const partType = typeof part, isArray = Array.isArray(current);
      if (Array.isArray(part)) {
        for (let i = 0; i < part.length; i++)
          updatePath(current, [part[i]].concat(path), traversed);
        return;
      } else if (isArray && partType === "function") {
        for (let i = 0; i < current.length; i++)
          part(current[i], i) && updatePath(current, [i].concat(path), traversed);
        return;
      } else if (isArray && partType === "object") {
        const {
          from = 0,
          to = current.length - 1,
          by = 1
        } = part;
        for (let i = from; i <= to; i += by)
          updatePath(current, [i].concat(path), traversed);
        return;
      } else if (path.length > 1) {
        updatePath(current[part], path, [part].concat(traversed));
        return;
      }
      prev = current[part], traversed = [part].concat(traversed);
    }
    let value = path[0];
    typeof value == "function" && (value = value(prev, traversed), value === prev) || part === void 0 && value == null || (value = unwrap(value), part === void 0 || isWrappable(prev) && isWrappable(value) && !Array.isArray(value) ? mergeStoreNode(prev, value) : setProperty(current, part, value));
  }
  function createStore(...[store, options]) {
    const unwrappedStore = unwrap(store || {}), isArray = Array.isArray(unwrappedStore), wrappedStore = wrap$1(unwrappedStore);
    function setStore(...args) {
      batch(() => {
        isArray && args.length === 1 ? updateArray(unwrappedStore, args[0]) : updatePath(unwrappedStore, args);
      });
    }
    return [wrappedStore, setStore];
  }
  const producers = /* @__PURE__ */ new WeakMap(), setterTraps = {
    get(target, property) {
      if (property === $RAW) return target;
      const value = target[property];
      let proxy;
      return isWrappable(value) ? producers.get(value) || (producers.set(value, proxy = new Proxy(value, setterTraps)), proxy) : value;
    },
    set(target, property, value) {
      return setProperty(target, property, unwrap(value)), !0;
    },
    deleteProperty(target, property) {
      return setProperty(target, property, void 0, !0), !0;
    }
  };
  function produce(fn) {
    return (state) => {
      if (isWrappable(state)) {
        let proxy;
        (proxy = producers.get(state)) || producers.set(state, proxy = new Proxy(state, setterTraps)), fn(proxy);
      }
      return state;
    };
  }
  const downloadSVG = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1em'%20height='1em'%20viewBox='0%200%2024%2024'%3e%3cpath%20fill='%23ffffff'%20d='m12%2016l-5-5l1.4-1.45l2.6%202.6V4h2v8.15l2.6-2.6L17%2011zm-6%204q-.825%200-1.412-.587T4%2018v-3h2v3h12v-3h2v3q0%20.825-.587%201.413T18%2020z'%20/%3e%3c/svg%3e";
  var _tmpl$$2 = /* @__PURE__ */ template("<div>"), _tmpl$2$2 = /* @__PURE__ */ template('<button type=button class="ant-btn ant-btn-round ant-btn-primary inline-flex items-center gap-[6px]"><img width=14 alt=download><span class="hidden! md:inline!">');
  const DownloadButtons = (props) => {
    const [courseNodes, setCourseNodes] = createSignal([]);
    return onMount(async () => {
      const courseListEl = await getCourseListElAsync();
      setCourseNodes(Array.from(courseListEl.children)), listenItemsMutation(courseListEl, (mutations) => {
        setCourseNodes((prev) => {
          const removed = [];
          for (const {
            addedNodes,
            removedNodes
          } of mutations)
            prev.push(...Array.from(addedNodes)), removed.push(...Array.from(removedNodes));
          return prev.filter((node) => !removed.includes(node));
        });
      });
    }), (() => {
      var _el$ = _tmpl$$2();
      return insert(_el$, createComponent(For, {
        get each() {
          return courseNodes();
        },
        children: (node) => createComponent(Portal, {
          mount: node,
          get children() {
            return createComponent(DownloadButton, {
              onClick: () => {
                var _a;
                const title = (_a = node.querySelector("h4 > span:nth-child(1)")) == null ? void 0 : _a.textContent;
                title && props.onClick(title);
              },
              children: "下载"
            });
          }
        })
      })), _el$;
    })();
  }, DownloadButton = (props) => (() => {
    var _el$2 = _tmpl$2$2(), _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling;
    return _el$2.$$click = (ev) => {
      var _a;
      return (_a = props.onClick) == null ? void 0 : _a.call(props, ev);
    }, setAttribute(_el$3, "src", downloadSVG), insert(_el$4, () => props.children), _el$2;
  })();
  function getCourseListElAsync() {
    return new Promise((resolve) => {
      const _2 = setInterval(() => {
        const elem = document.querySelector(".course-detail .ant-list-items");
        elem && (clearInterval(_2), resolve(elem));
      }, 500);
    });
  }
  let observer;
  function listenItemsMutation(courseListEl, onChange) {
    observer = new MutationObserver((mutations) => {
      onChange(mutations);
    }), observer.observe(courseListEl, {
      childList: !0
    });
  }
  delegateEvents(["click"]);
  const closeSVG = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1em'%20height='1em'%20viewBox='0%200%2024%2024'%3e%3cpath%20fill='none'%20stroke='%23aaa'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='1.5'%20d='m7%207l10%2010M7%2017L17%207'/%3e%3c/svg%3e";
  var _tmpl$$1 = /* @__PURE__ */ template('<span class="overflow-hidden text-ellipsis whitespace-nowrap">'), _tmpl$2$1 = /* @__PURE__ */ template('<div class="fixed top-0 z-24 h-full w-full flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-out"><div class="relative w-[288px] flex flex-col items-center gap-[16px] rounded-[6px] bg-white px-[15px] py-[20px] transition-transform duration-300 ease-out"><img alt=close class="absolute right-[10px] top-[10px] h-[20px] cursor-pointer hover:brightness-110"><div class="text-[1.2em] text-[#0f86ff]">创建下载任务</div><form class="w-full flex flex-col items-center"><button class="ant-btn ant-btn-primary ant-btn-background-ghost mt-[4px]"type=submit>创建'), _tmpl$3$1 = /* @__PURE__ */ template("<div>"), _tmpl$4$1 = /* @__PURE__ */ template('<div class="mb-[16px] w-full flex flex-row items-center gap-[12px]"><label class="flex-shrink-0 flex-basis-[72px] text-right text-[#666]"><span class=select-none>:</span></label><div class="flex gap-[12px] overflow-hidden">'), _tmpl$5$1 = /* @__PURE__ */ template('<div class="ant-radio-group ant-radio-group-outline">'), _tmpl$6 = /* @__PURE__ */ template("<label class=ant-radio-wrapper><span class=ant-radio><input type=radio class=ant-radio-input><span class=ant-radio-inner></span></span><span>");
  const TaskCreatePanel = (props) => {
    const [fade, setFade] = createSignal(!0), [scale, setScale] = createSignal(!0);
    return createComponent(AnimatedVisibility, {
      get visible() {
        return props.visible;
      },
      onEnter: () => {
        setFade(!1), setScale(!1);
      },
      onExit: () => {
        setFade(!0), setScale(!0);
      },
      get children() {
        var _el$ = _tmpl$2$1(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling, _el$8 = _el$5.firstChild;
        return _el$.$$click = () => {
          props.onClose();
        }, _el$2.$$click = (ev) => {
          ev.stopPropagation();
        }, _el$3.$$click = () => {
          props.onClose();
        }, setAttribute(_el$3, "src", closeSVG), _el$5.addEventListener("submit", (ev) => {
          ev.preventDefault();
          const formData = new FormData(ev.currentTarget), path = window.location.pathname, courseId = path.substring(path.lastIndexOf("/") + 1);
          props.onCreate({
            courseName: props.uiState.courseName,
            courseId,
            videoType: formData.get("type"),
            courseTitle: props.uiState.title,
            autoTranscode: formData.get("autoTranscode") === "on"
          });
        }), insert(_el$5, createComponent(FormItem, {
          label: "课程名称",
          get children() {
            var _el$6 = _tmpl$$1();
            return insert(_el$6, () => props.uiState.courseName), _el$6;
          }
        }), _el$8), insert(_el$5, createComponent(FormItem, {
          label: "课程节次",
          get children() {
            var _el$7 = _tmpl$$1();
            return insert(_el$7, () => props.uiState.title), _el$7;
          }
        }), _el$8), insert(_el$5, createComponent(FormItem, {
          label: "录像类型",
          get children() {
            return createComponent(RadioButtonGroup, {
              name: "type",
              get children() {
                return [createComponent(RadioButton, {
                  label: "投影",
                  value: "vga",
                  checked: !0
                }), createComponent(RadioButton, {
                  label: "教室",
                  value: "main"
                })];
              }
            });
          }
        }), _el$8), insert(_el$5, createComponent(FormItem, {
          label: "自动转码",
          get children() {
            return createComponent(RadioButtonGroup, {
              name: "autoTranscode",
              get children() {
                return [createComponent(RadioButton, {
                  label: "是",
                  value: "on"
                }), createComponent(RadioButton, {
                  label: "否",
                  value: "off",
                  checked: !0
                })];
              }
            });
          }
        }), _el$8), createRenderEffect((_p$) => {
          var _v$ = !!fade(), _v$2 = !!scale();
          return _v$ !== _p$.e && _el$.classList.toggle("opacity-0", _p$.e = _v$), _v$2 !== _p$.t && _el$2.classList.toggle("scale-90", _p$.t = _v$2), _p$;
        }, {
          e: void 0,
          t: void 0
        }), _el$;
      }
    });
  }, AnimatedVisibility = (props) => {
    const [visible, setVisible] = createSignal(!1);
    return createEffect(() => {
      var _a;
      props.visible ? (setVisible(!0), setTimeout(() => {
        batch(() => {
          var _a2;
          (_a2 = props.onEnter) == null || _a2.call(props);
        });
      })) : (_a = props.onExit) == null || _a.call(props);
    }), createComponent(Show, {
      get when() {
        return visible();
      },
      get children() {
        var _el$9 = _tmpl$3$1();
        return _el$9.addEventListener("transitionend", () => {
          props.visible || setVisible(!1);
        }), insert(_el$9, () => props.children), _el$9;
      }
    });
  }, FormItem = (props) => (() => {
    var _el$10 = _tmpl$4$1(), _el$11 = _el$10.firstChild, _el$12 = _el$11.firstChild, _el$13 = _el$11.nextSibling;
    return insert(_el$11, () => props.label, _el$12), insert(_el$13, () => props.children), _el$10;
  })(), RadioGroupContext = createContext(), RadioButtonGroup = (props) => {
    const [value, setValue] = createSignal(), radioRefs = [], forwardRef = (ref) => {
      radioRefs.push(ref);
    }, listenChange = (ev) => {
      const target = ev.target;
      target.checked && setValue(target.value);
    };
    return onMount(() => {
      radioRefs.forEach((radio) => {
        radio.name = props.name, radio.checked && setValue(radio.value), radio.addEventListener("change", listenChange);
      });
    }), onCleanup(() => {
      radioRefs.forEach((radio) => {
        radio.removeEventListener("change", listenChange);
      });
    }), createComponent(RadioGroupContext.Provider, {
      value: {
        value,
        forwardRef
      },
      get children() {
        var _el$14 = _tmpl$5$1();
        return insert(_el$14, () => props.children), _el$14;
      }
    });
  }, RadioButton = (props) => {
    const {
      value,
      forwardRef
    } = useContext(RadioGroupContext);
    return (() => {
      var _el$15 = _tmpl$6(), _el$16 = _el$15.firstChild, _el$17 = _el$16.firstChild, _el$18 = _el$16.nextSibling;
      return use(forwardRef, _el$17), insert(_el$18, () => props.label), createRenderEffect((_p$) => {
        var _v$3 = (value == null ? void 0 : value()) === props.value, _v$4 = (value == null ? void 0 : value()) === props.value;
        return _v$3 !== _p$.e && _el$15.classList.toggle("ant-radio-wrapper-checked", _p$.e = _v$3), _v$4 !== _p$.t && _el$16.classList.toggle("ant-radio-checked", _p$.t = _v$4), _p$;
      }, {
        e: void 0,
        t: void 0
      }), createRenderEffect(() => _el$17.checked = props.checked ?? !1), createRenderEffect(() => _el$17.value = props.value), _el$15;
    })();
  };
  delegateEvents(["click"]);
  let encrypt;
  const encrypt$1 = () => (encrypt || (encrypt = new O()), encrypt);
  function O() {
    function e(e2, t, n, r) {
      return T(n - 281, t);
    }
    this[e(0, 396, 521)].apply(this, arguments);
  }
  (function(e, t) {
    function n(e2, t2, n2, r2) {
      return T(n2 - -824, r2);
    }
    var r = e();
    function a(e2, t2, n2, r2) {
      return T(e2 - 498, n2);
    }
    for (; ; )
      try {
        if (parseInt(a(768, 0, 686)) / 1 * (parseInt(n(0, 0, -499, -489)) / 2) + parseInt(n(0, 0, -453, -364)) / 3 * (parseInt(n(0, 0, -507, -632)) / 4) + parseInt(a(735, 0, 625)) / 5 + -parseInt(a(675, 0, 657)) / 6 + parseInt(n(0, 0, -497, -590)) / 7 * (parseInt(n(0, 0, -424, -507)) / 8) + -parseInt(n(0, 0, -433, -567)) / 9 + -parseInt(n(0, 0, -438, -415)) / 10 === 210640)
          break;
        r.push(r.shift());
      } catch {
        r.push(r.shift());
      }
  })(j), O[N(149, 270, 240, 274)] = {
    init: function(e) {
      return this;
    },
    k: function() {
      var e = {};
      function t(e2, t2, n2, r) {
        return N(e2 - 114, t2 - 293, e2 - 654, r);
      }
      function n(e2, t2, n2, r) {
        return N(e2 - 430, t2 - 134, e2 - 491, t2);
      }
      return e[t(892, 978, 0, 979)] = t(887, 1007, 0, 1006) + "d9d7ba4913" + n(802, 687), e[n(729, 820)];
    },
    v: function() {
      return "v1";
    },
    t: function() {
      var e, t, n, r = {
        VorJs: function(e2, t2) {
          return e2(t2);
        },
        vhxlc: function(e2, t2) {
          return e2 / t2;
        }
      };
      return r.VorJs(
        parseInt,
        r[e = 492, t = 495, n = 440, N(e - 487, t - 311, n - 170, t)](
          Date.now(),
          1e3
        )
      );
    },
    s: function(e) {
      function t(e2, t2, n2, r) {
        return N(e2 - 438, t2 - 441, t2 - -22, e2);
      }
      var n = {
        sQFEp: function(e2, t2) {
          return e2(t2);
        },
        MEEsj: function(e2, t2) {
          return e2 + t2;
        }
      };
      return n[t(367, 288)](
        C,
        n[t(277, 184)](n.MEEsj(this.k() + "_", this.v()), "_") + e
      );
    },
    d: function(e, t) {
      var n = {
        cKCOs: function(e2, t2) {
          return e2 + t2;
        },
        Fnncq: function(e2, t2) {
          return e2 + t2;
        }
      }, r = n;
      function a(e2, t2, n2, r2) {
        return N(e2 - 411, t2 - 345, n2 - -326, r2);
      }
      return C(
        r[a(-5, -85, -7, -94)](
          r.cKCOs(
            r[a(-131, -196, -82, 15)](
              r[a(-186, -26, -82, 7)](this.k(), "_"),
              e
            ),
            "_"
          ),
          t
        )
      );
    },
    p: function(e) {
      var t = {
        hNlHL: function(e2) {
          return e2();
        },
        bhuXF: function(e2, t2) {
          return e2 > t2;
        },
        WWRQy: function(e2, t2) {
          return e2 + t2;
        },
        KCVih: function(e2, t2) {
          return e2 + t2;
        },
        XFdLj: function(e2, t2) {
          return e2 + t2;
        },
        oBPsm: function(e2, t2) {
          return e2(t2);
        }
      }, n = t[o(1129, 1029)](S);
      function r(e2, t2, n2, r2) {
        return N(e2 - 354, t2 - 459, t2 - -978, e2);
      }
      var a = e[r(-678, -568) + "f"]("/");
      function o(e2, t2, n2, r2) {
        return N(e2 - 437, t2 - 419, e2 - 748, t2);
      }
      if (t[r(-892, -761)](a, -1)) {
        var i = e[r(-714, -764)](0, a), l = e[r(-760, -764)](a, e[r(-517, -609)]);
        return t[r(-623, -758)](
          t[r(-874, -757)](
            t[o(1071, 1147)](i, "/"),
            t[r(-530, -538)](
              C,
              t[r(-822, -758)](t[r(-714, -758)](this.k(), "_"), n)
            )
          ),
          l
        );
      }
      return e;
    }
    // auth: function (e) {
    //   var t,
    //     n,
    //     r,
    //     a = {
    //       ILTPY: function (e, t) {
    //         return e(t)
    //       },
    //       LwGkx: function (e, t) {
    //         return e + t
    //       },
    //     }
    //   function o(e, t, n, r) {
    //     return N(e - 119, t - 42, e - 35, t)
    //   }
    //   return a.ILTPY(
    //     C,
    //     a[o(459, 361)](
    //       a[o(459, 479)](
    //         window[o(315, 421)][
    //           ((t = 635), (n = 605), (r = 737), N(t - 298, n - 72, n - 219, r))
    //         ],
    //         "_",
    //       ),
    //       e,
    //     ),
    //   )
    // },
    // tid: function () {
    //   var e = {
    //     LWvwV: function (e, t) {
    //       return e + t
    //     },
    //     IiZyj: t(720, 641, 598, 552),
    //     AkiOK: function (e, t) {
    //       return e(t)
    //     },
    //     CnKof: function (e, t) {
    //       return e + t
    //     },
    //     NAMiK: function (e, t) {
    //       return e + t
    //     },
    //     DkJIC: function (e, t) {
    //       return e + t
    //     },
    //   }
    //   function t(e, t, n, r) {
    //     return N(e - 267, t - 38, n - 170, r)
    //   }
    //   var n = e[t(479, 634, 602, 635)](
    //     e[r(-328, -508, -329, -377)],
    //     ((Math[t(565, 389, 522, 618)]() * Math.pow(36, 4)) << 0).toString(36),
    //   )[t(549, 361, 458, 423)](-4)
    //   function r(e, t, n, r) {
    //     return N(e - 302, t - 257, r - -828, e)
    //   }
    //   return (
    //     (n = e[t(561, 365, 437, 300)](C, n)[t(496, 445, 554, 659) + "e"]()),
    //     (n = e.LWvwV(
    //       e[r(-418, -433, 0, -501)](
    //         e[t(550, 519, 602, 558)](
    //           e[t(459, 567, 578, 456)](
    //             e[t(434, 377, 446, 522)](n.substr(0, 8) + "-", n.substr(8, 4)) +
    //               "-",
    //             n[t(475, 494, 595, 712)](12, 4),
    //           ) + "-",
    //           n.substr(16, 4),
    //         ),
    //         "-",
    //       ),
    //       n[r(-494, -277, 0, -403)](20, 12),
    //     ))
    //   )
    // },
  };
  function j() {
    var e = [
      "ouJPk",
      "uCdbS",
      "split",
      "MJUan",
      "Lefgq",
      "MWNVz",
      "cWpRB",
      "WpXot",
      "oZewB",
      "SonJC",
      "vjKoJ",
      "zyFjL",
      "JIfHK",
      "random",
      "nNxMA",
      "RGcoq",
      "nXrzL",
      "MIYyr",
      "txZcs",
      "UOoqO",
      "qQAco",
      "YAiXJ",
      "yz01234567",
      "300",
      "0|16|27|19",
      "143752hxGNSp",
      "CTxhH",
      "IEzHi",
      "Kyeqk",
      "bmfrc",
      "length",
      "upFHX",
      "pugpv",
      "2xbtqvS",
      "UBVni",
      "23982bkOnqq",
      "UVWXYZabcd",
      "GmFGj",
      "mXqHh",
      "WKuWO",
      "cMams",
      "NNLwk",
      "hNlHL",
      "cvgbv",
      "sVxdg",
      "toUpperCas",
      "kgZaj",
      "host",
      "XeYpO",
      "lfcbH",
      "RBqth",
      "NcGhs",
      "DZRYS",
      "hfyFc",
      "aTpeg",
      "YCybw",
      "66|53|32|4",
      "WLQBk",
      "DLdQB",
      "log",
      "NEyYW",
      "nivsL",
      "wOFdj",
      "Cgmee",
      "MgZds",
      "MxRBs",
      "|18|67|46|",
      "ZgEFE",
      "CHPVX",
      "NAMiK",
      "NHahm",
      "lastIndexO",
      "xtUyZ",
      "coplX",
      "|62|52|14|",
      "aXDhH",
      "YelVH",
      "100",
      "elCar",
      "6pUEHKM",
      "Owujd",
      "AaPlF",
      "fGsXh",
      "qEYXt",
      "abcdef",
      "LwGkx",
      "substr",
      "LRnts",
      "RvQQp",
      "0000",
      "maxTouchPo",
      "sfugu",
      "OstGt",
      "LWvwV",
      "100980Wzqrhj",
      "IINyp",
      "bEmUw",
      "MbKHD",
      "aasSt",
      "3780990adGHPA",
      "MfcUK",
      "oBPsm",
      "RQIec",
      "IeZtJ",
      "eIPtP",
      "yqoAq",
      "23|41|64|3",
      "lkcBa",
      "832sSbRKu",
      "UuVZz",
      "xZozQ",
      "gmFqx",
      "IiZyj",
      "|44|5",
      "GohRl",
      "WWgKa",
      "IGMdJ",
      "Aohnl",
      "toLowerCas",
      "60|7|55|54",
      "onlRJ",
      "d24fb0d696",
      "OvjND",
      "yjUBp",
      "charCodeAt",
      "SHexJ",
      "oGpea",
      "uQTGX",
      "dBBZp",
      "bmHok",
      "GUgka",
      "nEzCg",
      "wlaPi",
      "userAgent",
      "yJMKt",
      "ints",
      "TYXjR",
      "zYzNV",
      "sXRMk",
      "0123456789",
      "PmDuE",
      "abc",
      "GmHHW",
      "jBUZj",
      "MEEsj",
      "tUvdI",
      "qVwGN",
      "xBOIF",
      "hMMTI",
      "YjKCG",
      "match",
      "gBYDU",
      "substring",
      "vgaPt",
      "fromCharCo",
      "bhuXF",
      "gYWMx",
      "yrEIS",
      "WWRQy",
      "KCVih",
      "nZLRt",
      "djwdX",
      "700890kJyfzl",
      "AiAOb",
      "XDIPB",
      "afByA",
      "cZiKv",
      "ckKFi",
      "concat",
      "IiDIl",
      "VQSFS",
      "1138b69dfef641",
      "cfbWt",
      "eZPSv",
      "400",
      "UKQBo",
      "xwKVs",
      "ABCDEF",
      "prototype",
      "mLuTp",
      "OxZlF",
      "zvUtv",
      "Fnncq",
      "XZhmB",
      "ntXoN",
      "kXCrV",
      "UEKVr",
      "68|28|15|5",
      "YVtyo",
      "INujQ",
      "kZBWy",
      "0|1|20|59|",
      "mjDUY",
      "BrKRP",
      "rwXXb",
      "wAFlY",
      "XqGDf",
      "Zkllg",
      "24|6|58|71",
      "0|4|1|2|3",
      "|29|11|39|",
      "YKgfZ",
      "WeDEI",
      "XJTdj",
      "kvmlu",
      "AkiOK",
      "XSikN",
      "17|49|57|2",
      "vhxlc",
      "SjWqm",
      "ccoMs",
      "vnmIy",
      "TrXxd",
      "PEDaX",
      "DkJIC",
      "HebKa",
      "zrZrq",
      "zoVkC",
      "location",
      "AJlcC",
      "ZvQfx",
      "FaPmv",
      "1611420OpeJVD",
      "vzWnH",
      "VxxpR",
      "init",
      "slice",
      "mbSpn",
      "YgEix",
      "ZMIgF",
      "2|0|1|3|4",
      "QMSgx",
      "cbUgg",
      "MWVth",
      "opqrstuvwx",
      "EOkLo",
      "Ehbav",
      "NnNaU",
      "200",
      "WJklG",
      "NiuUE",
      "meIKR",
      "TFdWI",
      "AiZgp",
      "VeyYt",
      "YWfOJ",
      "OJujA",
      "BAlav",
      "sQFEp",
      "7d2d4875",
      "aYvzf",
      "NKgrY",
      "iDJwz",
      "QXReC",
      "iKDRD",
      "7199jtZvSq",
      "LLrqX",
      "cKCOs",
      "tojFA",
      "hHVOW",
      "soFoK",
      "XFdLj",
      "BVCuj",
      "NBGYC",
      "SbKXj",
      "CnKof",
      "wBFph",
      "charAt",
      "QiHHD",
      "IAEks",
      "DWWmL",
      "nmaEM",
      "zlmhX",
      "napou",
      "XzwRL",
      "xJejT",
      "ABCDEFGHIJ"
    ];
    return (j = function() {
      return e;
    })();
  }
  function S() {
    var e = {};
    e[d(-338, -361, -343, -279)] = function(e2, t2) {
      return e2 < t2;
    }, e.Cgmee = function(e2, t2) {
      return e2 & t2;
    }, e[l(305, 282, 431)] = function(e2, t2) {
      return e2 >>> t2;
    }, e[l(184, 119, 76)] = function(e2, t2) {
      return e2 & t2;
    }, e.BrKRP = l(265, 341, 143), e.YKgfZ = l(149, 205, 171), e[l(43, 104, -87)] = d(-441, -339, -357, -298), e[l(299, 194, 208)] = d(-370, -459, -483, -602), e[l(152, 213, 241)] = "xkhis", e.MxRBs = l(208, 229, 152), e[d(-355, -362, -428, -480)] = l(207, 236, 72);
    var t = e, n = t[l(104, 156, 200)], r = t[d(-555, -447, -456, -528)], a = (t.wlaPi, t[l(299, 211, 377)]), o = navigator[d(-386, -636, -524, -567)], i = o.match(/OS ((\d+_?){2,3})\s/);
    if (i && i[1]) return r;
    function l(e2, t2, n2, r2) {
      return N(e2 - 479, t2 - 466, e2 - -151, n2);
    }
    var c = o[l(61, 128, 187)](/DingTalk/g);
    if (c && c[0]) {
      if (t[d(-505, -339, -416, -281)] === t[d(-305, -439, -416, -390)]) return r;
      for (var s = "", u = 0; t[d(-213, -451, -343, -231)](u, _0x55da93[d(-283, -343, -350, -298)]); u++)
        s += _0x191a57[l(65, 183, 186) + "de"](
          t[l(251, 344, 148)](
            t[l(305, 437, 371)](_0x42ad6d[d(-351, -152, -256, -389)](u), 8),
            255
          ),
          t.napou(_0x7139b8[d(-226, -250, -256, -277)](u), 255)
        );
      return s;
    }
    function d(e2, t2, n2, r2) {
      return N(e2 - 184, t2 - 6, n2 - -719, r2);
    }
    if (navigator[l(44, 171, 85)].match(/Android/i) || navigator[l(44, -54, 93)][l(61, 61, 160)](/HarmonyOS/i)) {
      if (t[d(-438, -299, -315, -345)] !== t[l(140, 53, 6)]) return a;
      _0x7d6454 = 0;
    }
    return navigator[l(278, 142, 221) + l(46, 177, 29)] && navigator[l(278, 203, 393) + l(46, -33, 75)] > 2 ? r : n;
  }
  function N(e, t, n, r) {
    return T(n - 47, r);
  }
  function C(e) {
    var t = {
      SjWqm: function(e2, t2) {
        return e2(t2);
      }
    };
    function n(e2, t2, n2, r) {
      return N(0, 0, e2 - 498, t2);
    }
    return t[n(769, 860)](_, t[n(769, 890)](A, I(e)));
  }
  function A(e) {
    var t, n, r, a;
    return M(
      {
        DZRYS: function(e2, t2, n2) {
          return e2(t2, n2);
        }
      }[r = 882, a = 749, N(0, 0, r - 491, a)](
        P,
        F(e),
        8 * e[t = 590, n = 611, N(0, 0, t - 221, n)]
      )
    );
  }
  function _(e) {
    var t = {};
    function n(e2, t2, n2, r2) {
      return N(0, 0, n2 - -601, t2);
    }
    function r(e2, t2, n2, r2) {
      return N(0, 0, n2 - -1003, e2);
    }
    t[n(-258, -494, -355)] = "0123456789" + n(-330, -256, -362), t[r(-559, -817, -685)] = r(-854, -762, -802) + n(-121, -196, -178), t[n(-263, -432, -303)] = function(e2, t2) {
      return e2 < t2;
    }, t[n(0, -149, -167)] = function(e2, t2) {
      return e2 + t2;
    }, t.aXDhH = function(e2, t2) {
      return e2 & t2;
    };
    for (var a, o = t, i = o[r(-823, 0, -685)], l = "", c = 0; o[r(-835, 0, -705)](c, e.length); c++)
      a = e[n(0, -69, -138)](c), l += o.IINyp(
        i[r(-617, 0, -674)](o[r(-484, 0, -589)](a >>> 4, 15)),
        i[n(0, -148, -272)](o[r(-683, 0, -589)](a, 15))
      );
    return l;
  }
  function I(e) {
    var t = {};
    function n(e2, t2, n2, r2) {
      return N(0, 0, r2 - 934, t2);
    }
    function r(e2, t2, n2, r2) {
      return N(0, 0, e2 - 516, n2);
    }
    t.QiHHD = n(1233, 1123, 1335, 1226), t[r(975, 1043, 995)] = function(e2, t2) {
      return e2 < t2;
    }, t[r(724, 726, 755)] = function(e2, t2) {
      return e2 + t2;
    }, t[n(0, 1210, 0, 1276)] = function(e2, t2) {
      return e2 <= t2;
    }, t[n(0, 1344, 0, 1239)] = function(e2, t2) {
      return e2 & t2;
    }, t.kvmlu = function(e2, t2) {
      return e2 <= t2;
    }, t[n(0, 1287, 0, 1168)] = function(e2, t2) {
      return e2 >>> t2;
    }, t[r(810, 0, 713)] = function(e2, t2) {
      return e2 | t2;
    }, t[r(977, 0, 1066)] = function(e2, t2) {
      return e2 | t2;
    }, t.MIYyr = function(e2, t2) {
      return e2 & t2;
    }, t[r(850, 0, 720)] = function(e2, t2) {
      return e2 >>> t2;
    }, t[n(0, 1300, 0, 1267)] = function(e2, t2) {
      return e2 & t2;
    }, t[r(744, 0, 840)] = function(e2, t2) {
      return e2 | t2;
    }, t[n(0, 1142, 0, 1265)] = function(e2, t2) {
      return e2 >>> t2;
    }, t.UBVni = function(e2, t2) {
      return e2 | t2;
    };
    for (var a = t, o = a[n(0, 1221, 0, 1264)][n(0, 1240, 0, 1275)]("|"), i = 0; ; ) {
      switch (o[i++]) {
        case "0":
          var l = -1;
          continue;
        case "1":
          var c, s;
          continue;
        case "2":
          var u = "";
          continue;
        case "3":
          for (; a[n(0, 1308, 0, 1393)](++l, e[r(885, 0, 938)]); )
            c = e[n(0, 1461, 0, 1397)](l), s = a[r(975, 0, 1061)](a[r(724, 0, 695)](l, 1), e.length) ? e[r(979, 0, 944)](l + 1) : 0, a.MJUan(55296, c) && a[n(0, 1202, 0, 1276)](c, 56319) && a.MJUan(56320, s) && s <= 57343 && (c = a[r(724, 0, 621)](
              65536 + ((1023 & c) << 10),
              a[n(0, 1369, 0, 1239)](s, 1023)
            ), l++), a[r(858, 0, 748)](c, 127) ? u += String[n(0, 1052, 0, 1150) + "de"](c) : a[r(782, 0, 668)](c, 2047) ? u += String[n(0, 1141, 0, 1150) + "de"](
              192 | a[r(821, 0, 780)](a[n(0, 1142, 0, 1168)](c, 6), 31),
              a[n(0, 1158, 0, 1228)](128, a.AiZgp(c, 63))
            ) : a[n(0, 1293, 0, 1276)](c, 65535) ? u += String[n(0, 1151, 0, 1150) + "de"](
              224 | c >>> 12 & 15,
              a[r(977, 0, 1100)](
                128,
                a[n(0, 1271, 0, 1290)](a.zlmhX(c, 6), 63)
              ),
              128 | a[r(849, 0, 961)](c, 63)
            ) : a[r(782, 0, 812)](c, 2097151) && (u += String[r(732, 0, 772) + "de"](
              a[n(0, 1319, 0, 1228)](240, c >>> 18 & 7),
              a.cZiKv(
                128,
                a[r(849, 0, 824)](a[r(847, 0, 768)](c, 12), 63)
              ),
              a[r(889, 0, 915)](
                128,
                a[r(872, 0, 865)](a.cfbWt(c, 6), 63)
              ),
              128 | a[n(0, 1128, 0, 1267)](c, 63)
            ));
          continue;
        case "4":
          return u;
      }
      break;
    }
  }
  function T(e, t) {
    var n = j();
    return (T = function(e2, t2) {
      return n[e2 -= 140];
    })(e, t);
  }
  function F(e) {
    var t = {
      PEDaX: function(e2, t2) {
        return e2(t2);
      },
      uQTGX: function(e2, t2) {
        return e2 >> t2;
      },
      yJMKt: function(e2, t2) {
        return e2 << t2;
      },
      kaqop: function(e2, t2) {
        return e2 & t2;
      },
      MbKHD: function(e2, t2) {
        return e2 / t2;
      },
      coplX: function(e2, t2) {
        return e2 % t2;
      }
    };
    function n(e2, t2, n2, r2) {
      return N(0, 0, t2 - -752, e2);
    }
    var r = t[n(-419, -477)](Array, t[n(-513, -563)](e.length, 2));
    function a(e2, t2, n2, r2) {
      return N(0, 0, e2 - -666, t2);
    }
    for (var o = 0; o < r[n(-518, -383)]; o++) r[o] = 0;
    for (o = 0; o < 8 * e[n(-420, -383)]; o += 8)
      r[t[a(-477, -492)](o, 5)] |= t[a(-470, -356)](
        t.kaqop(e.charCodeAt(t[n(-402, -316)](o, 8)), 255),
        t[n(-363, -340)](o, 32)
      );
    return r;
  }
  function M(e) {
    function t(e2, t2, n2, r2) {
      return N(0, 0, e2 - -59, n2);
    }
    var n = {};
    n[i(-574, -537, -436, -532)] = function(e2, t2) {
      return e2 < t2;
    }, n[i(-506, -581, -589, -499)] = function(e2, t2) {
      return e2 & t2;
    }, n[t(288, 0, 274)] = function(e2, t2) {
      return e2 % t2;
    };
    for (var r = n, a = "", o = 0; r[i(-382, -347, -436, -434)](o, 32 * e.length); o += 8)
      a += String[i(-539, -568, -650, -724) + "de"](
        r.HebKa(e[o >> 5] >>> r[t(288, 0, 249)](o, 32), 255)
      );
    function i(e2, t2, n2, r2) {
      return N(0, 0, n2 - -866, r2);
    }
    return a;
  }
  function P(e, t) {
    var n = {
      mnYfQ: function(e2, t2) {
        return e2(t2);
      },
      YelVH: function(e2, t2) {
        return e2(t2);
      },
      HWkWO: function(e2, t2) {
        return e2(t2);
      },
      elCar: function(e2, t2) {
        return e2 >> t2;
      },
      NBGYC: function(e2, t2) {
        return e2 << t2;
      },
      ckKFi: function(e2, t2) {
        return e2 + t2;
      },
      GmHHW: function(e2, t2) {
        return e2 < t2;
      },
      FaPmv: function(e2, t2) {
        return e2 === t2;
      },
      TYXjR: "KEwbk",
      WeDEI: function(e2, t2) {
        return e2 + t2;
      },
      YgEix: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      BAlav: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      jBUZj: function(e2, t2) {
        return e2 + t2;
      },
      IiDIl: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      hMMTI: function(e2, t2, n2) {
        return e2(t2, n2);
      },
      SHexJ: function(e2, t2) {
        return e2 + t2;
      },
      xtUyZ: function(e2, t2) {
        return e2 + t2;
      },
      kZBWy: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      NiuUE: function(e2, t2) {
        return e2 + t2;
      },
      aasSt: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      iDJwz: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      IGMdJ: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      cvgbv: function(e2, t2) {
        return e2 + t2;
      },
      vzWnH: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      nXrzL: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      tUvdI: function(e2, t2) {
        return e2 + t2;
      },
      WKuWO: function(e2, t2) {
        return e2 + t2;
      },
      NHahm: function(e2, t2) {
        return e2 + t2;
      },
      pugpv: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      upFHX: function(e2, t2) {
        return e2 + t2;
      },
      YjKCG: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      QzsYO: function(e2, t2) {
        return e2 + t2;
      },
      zoVkC: function(e2, t2) {
        return e2 + t2;
      },
      bmfrc: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      DWWmL: function(e2, t2) {
        return e2 + t2;
      },
      JIfHK: function(e2, t2) {
        return e2 + t2;
      },
      WWgKa: function(e2, t2) {
        return e2 + t2;
      },
      aYvzf: function(e2, t2) {
        return e2 + t2;
      },
      MgZds: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      VQSFS: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      aBeBy: function(e2, t2) {
        return e2 + t2;
      },
      gzqpN: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      YWfOJ: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      cMams: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      GohRl: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      xBOIF: function(e2, t2) {
        return e2 + t2;
      },
      AJlcC: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      RGcoq: function(e2, t2) {
        return e2 + t2;
      },
      aTpeg: function(e2, t2) {
        return e2 + t2;
      },
      vjKoJ: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      sVxdg: function(e2, t2) {
        return e2 + t2;
      },
      bEmUw: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      sXRMk: function(e2, t2) {
        return e2 + t2;
      },
      CYEuG: function(e2, t2) {
        return e2 + t2;
      },
      StqdP: function(e2, t2) {
        return e2 + t2;
      },
      ccoMs: function(e2, t2) {
        return e2 + t2;
      },
      irWMh: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      vCEku: function(e2, t2) {
        return e2 + t2;
      },
      dYXbP: function(e2, t2) {
        return e2 + t2;
      },
      UKQBo: function(e2, t2) {
        return e2 + t2;
      },
      ajttE: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      umRkF: function(e2, t2) {
        return e2 + t2;
      },
      rwXXb: function(e2, t2, n2, r2, a2, o2, i2, l2) {
        return e2(t2, n2, r2, a2, o2, i2, l2);
      },
      tojFA: function(e2, t2, n2, r2, a2) {
        return e2(t2, n2, r2, a2);
      }
    };
    function r(e2, t2, n2, r2) {
      return N(0, 0, e2 - 89, r2);
    }
    e[n[m(692, 655)](t, 5)] |= n.NBGYC(128, t % 32), e[n.ckKFi(n[r(414, 0, 0, 490)](t + 64 >>> 9, 4), 14)] = t;
    for (var a = 1732584193, o = -271733879, i = -1732584194, l = 271733878, c = 0; n[r(293, 0, 0, 408)](c, e[r(458, 0, 0, 510)]); c += 16) {
      if (!n[m(558, 687)](n.TYXjR, n[m(473, 601)]))
        return n.mnYfQ(
          _0x31a2cc,
          n[m(690, 686)](_0x398ca7, n.HWkWO(_0x3f4daf, _0x156b6a))
        );
      for (var s = (m(535, 577) + r(351, 0, 0, 412) + m(524, 476) + m(528, 558) + m(720, 708) + "8|36|43|45|13|31|37|" + r(358, 0, 0, 264) + r(494, 0, 0, 509) + "8|30|25|26|48|56|9|7" + m(638, 602) + "|34|63|10|" + m(733, 858) + "|69|0|61|35|42|12|4|51|21|22|3" + r(502, 0, 0, 452) + m(670, 533) + "0|47|65|33" + m(727, 814))[r(430, 0, 0, 324)]("|"), u = 0; ; ) {
        switch (s[u++]) {
          case "0":
            i = B(i, l, a, o, e[n[r(353, 0, 0, 483)](c, 15)], 16, 530742520);
            continue;
          case "1":
            o = n.YgEix(V, o, i, l, a, e[n.ckKFi(c, 7)], 22, -45705983);
            continue;
          case "2":
            o = n[m(565, 698)](D, o, i, l, a, e[c + 4], 20, -405537848);
            continue;
          case "3":
            o = n[m(584, 638)](
              z,
              o,
              i,
              l,
              a,
              e[n[m(480, 593)](c, 1)],
              21,
              -2054922799
            );
            continue;
          case "4":
            o = n.IiDIl(z, o, i, l, a, e[c + 5], 21, -57434055);
            continue;
          case "5":
            l = n[r(299, 0, 0, 383)](G, l, f);
            continue;
          case "6":
            var d = o;
            continue;
          case "7":
            i = n[r(320, 0, 0, 217)](
              B,
              i,
              l,
              a,
              o,
              e[n[r(276, 0, 0, 399)](c, 3)],
              16,
              -722521979
            );
            continue;
          case "8":
            o = n.IiDIl(
              D,
              o,
              i,
              l,
              a,
              e[n[r(500, 0, 0, 446)](c, 8)],
              20,
              1163531501
            );
            continue;
          case "9":
            l = n[r(341, 0, 0, 367)](
              B,
              l,
              a,
              o,
              i,
              e[n[r(391, 0, 0, 312)](c, 8)],
              11,
              -2022574463
            );
            continue;
          case "10":
            a = n.aasSt(B, a, o, i, l, e[c + 13], 4, 681279174);
            continue;
          case "11":
            l = n[m(589, 492)](
              V,
              l,
              a,
              o,
              i,
              e[n[r(318, 0, 0, 242)](c, 1)],
              12,
              -389564586
            );
            continue;
          case "12":
            i = z(i, l, a, o, e[n[m(577, 556)](c, 14)], 15, -1416354905);
            continue;
          case "13":
            l = n[m(730, 859)](
              D,
              l,
              a,
              o,
              i,
              e[n[m(657, 786)](c, 6)],
              9,
              -1069501632
            );
            continue;
          case "14":
            i = n[m(560, 569)](
              z,
              i,
              l,
              a,
              o,
              e[n.xtUyZ(c, 6)],
              15,
              -1560198380
            );
            continue;
          case "15":
            l = n[m(560, 649)](V, l, a, o, i, e[c + 5], 12, 1200080426);
            continue;
          case "16":
            o = n[m(589, 610)](
              B,
              o,
              i,
              l,
              a,
              e[n[m(539, 529)](c, 14)],
              23,
              -35309556
            );
            continue;
          case "17":
            a = n[m(630, 683)](
              D,
              a,
              o,
              i,
              l,
              e[n[r(296, 0, 0, 220)](c, 5)],
              5,
              -701558691
            );
            continue;
          case "18":
            a = D(a, o, i, l, e[n[r(467, 0, 0, 539)](c, 9)], 5, 568446438);
            continue;
          case "19":
            l = B(l, a, o, i, e[n[r(471, 0, 0, 417)](c, 4)], 11, 1272893353);
            continue;
          case "20":
            a = V(a, o, i, l, e[n[r(498, 0, 0, 454)](c, 8)], 7, 1770035416);
            continue;
          case "21":
            l = n[m(506, 494)](
              z,
              l,
              a,
              o,
              i,
              e[n[m(480, 548)](c, 3)],
              10,
              -1894986606
            );
            continue;
          case "22":
            i = n[m(646, 729)](
              z,
              i,
              l,
              a,
              o,
              e[n[m(645, 639)](c, 10)],
              15,
              -1051523
            );
            continue;
          case "23":
            i = n[r(300, 0, 0, 344)](V, i, l, a, o, e[n.QzsYO(c, 10)], 17, -42063);
            continue;
          case "24":
            var h = a;
            continue;
          case "25":
            l = D(l, a, o, i, e[n[r(368, 0, 0, 447)](c, 2)], 9, -51403784);
            continue;
          case "26":
            i = n.vzWnH(
              D,
              i,
              l,
              a,
              o,
              e[n[m(686, 653)](c, 7)],
              14,
              1735328473
            );
            continue;
          case "27":
            a = n[r(457, 0, 0, 518)](
              B,
              a,
              o,
              i,
              l,
              e[n[r(421, 0, 0, 341)](c, 1)],
              4,
              -1530992060
            );
            continue;
          case "28":
            a = n.pugpv(V, a, o, i, l, e[n.QzsYO(c, 4)], 7, -176418897);
            continue;
          case "29":
            a = n.IGMdJ(
              V,
              a,
              o,
              i,
              l,
              e[n[m(626, 633)](c, 0)],
              7,
              -680876936
            );
            continue;
          case "30":
            a = n.IiDIl(D, a, o, i, l, e[c + 13], 5, -1444681467);
            continue;
          case "31":
            i = n.BAlav(
              D,
              i,
              l,
              a,
              o,
              e[n[m(729, 797)](c, 11)],
              14,
              643717713
            );
            continue;
          case "32":
            l = n[m(589, 623)](
              z,
              l,
              a,
              o,
              i,
              e[n[r(401, 0, 0, 301)](c, 11)],
              10,
              -1120210379
            );
            continue;
          case "33":
            o = n.hMMTI(G, o, d);
            continue;
          case "34":
            i = n.IGMdJ(B, i, l, a, o, e[c + 7], 16, -155497632);
            continue;
          case "35":
            a = n[m(678, 809)](
              z,
              a,
              o,
              i,
              l,
              e[n[m(684, 787)](c, 0)],
              6,
              -198630844
            );
            continue;
          case "36":
            i = n[m(507, 430)](
              V,
              i,
              l,
              a,
              o,
              e[n.aBeBy(c, 14)],
              17,
              -1502002290
            );
            continue;
          case "37":
            o = n.gzqpN(
              D,
              o,
              i,
              l,
              a,
              e[n[m(480, 501)](c, 0)],
              20,
              -373897302
            );
            continue;
          case "38":
            l = n[m(560, 544)](
              V,
              l,
              a,
              o,
              i,
              e[n.NHahm(c, 13)],
              12,
              -40341101
            );
            continue;
          case "39":
            i = n[m(730, 678)](V, i, l, a, o, e[c + 2], 17, 606105819);
            continue;
          case "40":
            i = n[m(582, 696)](
              z,
              i,
              l,
              a,
              o,
              e[n[m(587, 686)](c, 2)],
              15,
              718787259
            );
            continue;
          case "41":
            o = n[r(468, 0, 0, 340)](
              V,
              o,
              i,
              l,
              a,
              e[n[m(729, 649)](c, 11)],
              22,
              -1990404162
            );
            continue;
          case "42":
            l = n[m(486, 495)](
              z,
              l,
              a,
              o,
              i,
              e[n.cvgbv(c, 7)],
              10,
              1126891415
            );
            continue;
          case "43":
            o = n[r(320, 0, 0, 198)](V, o, i, l, a, e[c + 15], 22, 1236535329);
            continue;
          case "44":
            i = n[r(299, 0, 0, 214)](G, i, p);
            continue;
          case "45":
            a = n[m(728, 751)](
              D,
              a,
              o,
              i,
              l,
              e[n[m(484, 562)](c, 1)],
              5,
              -165796510
            );
            continue;
          case "46":
            i = n[r(370, 0, 0, 365)](
              D,
              i,
              l,
              a,
              o,
              e[n[r(443, 0, 0, 434)](c, 3)],
              14,
              -187363961
            );
            continue;
          case "47":
            o = n[m(678, 810)](
              z,
              o,
              i,
              l,
              a,
              e[n[r(482, 0, 0, 380)](c, 9)],
              21,
              -343485551
            );
            continue;
          case "48":
            o = n[r(438, 0, 0, 431)](
              D,
              o,
              i,
              l,
              a,
              e[n[m(658, 625)](c, 12)],
              20,
              -1926607734
            );
            continue;
          case "49":
            l = n[m(710, 783)](
              D,
              l,
              a,
              o,
              i,
              e[n[r(289, 0, 0, 281)](c, 10)],
              9,
              38016083
            );
            continue;
          case "50":
            i = V(i, l, a, o, e[c + 6], 17, -1473231341);
            continue;
          case "51":
            a = n[m(624, 528)](
              z,
              a,
              o,
              i,
              l,
              e[n[r(500, 0, 0, 426)](c, 12)],
              6,
              1700485571
            );
            continue;
          case "52":
            l = n[m(654, 728)](
              z,
              l,
              a,
              o,
              i,
              e[n[m(657, 597)](c, 15)],
              10,
              -30611744
            );
            continue;
          case "53":
            a = n.AJlcC(z, a, o, i, l, e[n.aBeBy(c, 4)], 6, -145523070);
            continue;
          case "54":
            a = B(a, o, i, l, e[n.CYEuG(c, 9)], 4, -640364487);
            continue;
          case "55":
            o = B(o, i, l, a, e[c + 6], 23, 76029189);
            continue;
          case "56":
            a = n.iDJwz(B, a, o, i, l, e[n.StqdP(c, 5)], 4, -378558);
            continue;
          case "57":
            i = n[m(730, 606)](
              D,
              i,
              l,
              a,
              o,
              e[n[m(547, 604)](c, 15)],
              14,
              -660478335
            );
            continue;
          case "58":
            var p = i;
            continue;
          case "59":
            l = n.irWMh(
              V,
              l,
              a,
              o,
              i,
              e[n[m(480, 608)](c, 9)],
              12,
              -1958414417
            );
            continue;
          case "60":
            l = n[r(526, 0, 0, 612)](B, l, a, o, i, e[c + 0], 11, -358537222);
            continue;
          case "61":
            o = n[r(321, 0, 0, 293)](
              B,
              o,
              i,
              l,
              a,
              e[n[r(298, 0, 0, 186)](c, 2)],
              23,
              -995338651
            );
            continue;
          case "62":
            a = n.bmfrc(z, a, o, i, l, e[c + 8], 6, 1873313359);
            continue;
          case "63":
            o = B(o, i, l, a, e[n.vCEku(c, 10)], 23, -1094730640);
            continue;
          case "64":
            a = n[r(492, 0, 0, 613)](V, a, o, i, l, e[c + 12], 7, 1804603682);
            continue;
          case "65":
            a = G(a, h);
            continue;
          case "66":
            o = n[r(468, 0, 0, 484)](
              z,
              o,
              i,
              l,
              a,
              e[n.dYXbP(c, 13)],
              21,
              1309151649
            );
            continue;
          case "67":
            l = D(l, a, o, i, e[n[r(326, 0, 0, 369)](c, 14)], 9, -1019803690);
            continue;
          case "68":
            o = n.ajttE(V, o, i, l, a, e[n.umRkF(c, 3)], 22, -1044525330);
            continue;
          case "69":
            l = n[m(565, 492)](
              B,
              l,
              a,
              o,
              i,
              e[n[m(587, 631)](c, 12)],
              11,
              -421815835
            );
            continue;
          case "70":
            i = n[m(531, 551)](B, i, l, a, o, e[c + 11], 16, 1839030562);
            continue;
          case "71":
            var f = l;
            continue;
        }
        break;
      }
    }
    function m(e2, t2, n2, r2) {
      return N(0, 0, e2 - 275, t2);
    }
    return n[m(595, 459)](Array, a, o, i, l);
  }
  function R(e, t, n, r, a, o) {
    var i, l, c = {
      RvQQp: function(e2, t2, n2) {
        return e2(t2, n2);
      },
      QzywO: function(e2, t2, n2) {
        return e2(t2, n2);
      }
    };
    return c.RvQQp(
      G,
      function(e2, t2) {
        var n2 = {};
        function r2(e3, t3, n3, r3) {
          return N(0, 0, t3 - 931, r3);
        }
        n2[r2(0, 1124, 0, 1258)] = function(e3, t3) {
          return e3 | t3;
        }, n2[r2(0, 1337, 0, 1360)] = function(e3, t3) {
          return e3 << t3;
        }, n2[o2(-598, -461, -530, -327)] = function(e3, t3) {
          return e3 >>> t3;
        }, n2[o2(-584, -537, -532, -507)] = function(e3, t3) {
          return e3 - t3;
        };
        var a2 = n2;
        function o2(e3, t3, n3, r3) {
          return N(0, 0, t3 - -785, r3);
        }
        return a2[o2(0, -592, 0, -455)](
          a2.ZgEFE(e2, t2),
          a2[r2(0, 1255, 0, 1269)](e2, a2[r2(0, 1179, 0, 1235)](32, t2))
        );
      }(
        c[i = -493, l = -554, N(0, 0, l - -981, i)](
          G,
          c.QzywO(G, t, e),
          c.RvQQp(G, r, o)
        ),
        a
      ),
      n
    );
  }
  function V(e, t, n, r, a, o, i) {
    function l(e2, t2, n2, r2) {
      return N(0, 0, t2 - -819, e2);
    }
    var c = {};
    function s(e2, t2, n2, r2) {
      return N(0, 0, e2 - 776, r2);
    }
    c[s(1080, 1116, 1061, 970)] = function(e2, t2) {
      return e2 | t2;
    }, c[l(-350, -377)] = function(e2, t2) {
      return e2 & t2;
    };
    var u = c;
    return R(
      u.TFdWI(u[l(-360, -377)](t, n), u[s(1218, 0, 0, 1315)](~t, r)),
      e,
      t,
      a,
      o,
      i
    );
  }
  function D(e, t, n, r, a, o, i) {
    var l, c, s = {};
    function u(e2, t2, n2, r2) {
      return N(0, 0, e2 - 376, t2);
    }
    s[l = 654, c = 781, N(0, 0, l - 376, c)] = function(e2, t2) {
      return e2 | t2;
    }, s[u(635, 501)] = function(e2, t2) {
      return e2 & t2;
    };
    var d = s;
    return R(d[u(654, 639)](d[u(635, 701)](t, r), d.Zkllg(n, ~r)), e, t, a, o, i);
  }
  function B(e, t, n, r, a, o, i) {
    var l, c, s = {};
    return s[l = 566, c = 508, N(0, 0, l - 209, c)] = function(e2, t2) {
      return e2 ^ t2;
    }, R(s.txZcs(t, n) ^ r, e, t, a, o, i);
  }
  function z(e, t, n, r, a, o, i) {
    function l(e2, t2, n2, r2) {
      return N(0, 0, t2 - -108, e2);
    }
    var c, s, u = {
      vnmIy: function(e2, t2, n2, r2, a2, o2, i2) {
        return e2(t2, n2, r2, a2, o2, i2);
      },
      kgZaj: function(e2, t2) {
        return e2 ^ t2;
      },
      XDIPB: function(e2, t2) {
        return e2 | t2;
      }
    };
    return u[l(98, 165)](
      R,
      u[c = 313, s = 366, N(0, 0, s - -19, c)](n, u[l(65, 118)](t, ~r)),
      e,
      t,
      a,
      o,
      i
    );
  }
  function G(e, t) {
    var n = {};
    function r(e2, t2, n2, r2) {
      return N(0, 0, r2 - 387, n2);
    }
    n[i(277, 228, 467, 335)] = function(e2, t2) {
      return e2 + t2;
    }, n.yjUBp = function(e2, t2) {
      return e2 & t2;
    }, n[r(709, 817, 670, 680)] = function(e2, t2) {
      return e2 + t2;
    }, n.ygBgo = function(e2, t2) {
      return e2 >> t2;
    }, n.MWNVz = function(e2, t2) {
      return e2 >> t2;
    }, n[r(0, 0, 585, 589)] = function(e2, t2) {
      return e2 | t2;
    }, n.gBYDU = function(e2, t2) {
      return e2 << t2;
    };
    var a = n, o = a[i(426, 260, 300, 335)](
      a[r(0, 0, 752, 849)](e, 65535),
      a[r(0, 0, 900, 849)](t, 65535)
    );
    function i(e2, t2, n2, r2) {
      return N(0, 0, r2 - 67, e2);
    }
    var l = a[r(0, 0, 717, 655)](
      a[i(470, 0, 0, 360)](a.ygBgo(e, 16), t >> 16),
      a[i(304, 0, 0, 411)](o, 16)
    );
    return a[r(0, 0, 484, 589)](a[r(0, 0, 623, 600)](l, 16), a.yjUBp(o, 65535));
  }
  async function encryptUrlWithAuth(rawUrl, refreshToken = !1) {
    const url = encrypt$1().p(rawUrl), params = await createAuthParams(refreshToken);
    return `${url}?${params}`;
    async function createAuthParams(refreshToken2) {
      (!AuthParams.token || refreshToken2) && await AuthParams.refreshToken();
      const timestamp = encrypt$1().t();
      return "Xvideo_Token=" + AuthParams.token + "&Xclient_Timestamp=" + timestamp + "&Xclient_Signature=" + encrypt$1().s(timestamp) + "&Xclient_Version=" + encrypt$1().v() + "&Platform=yhkt_user";
    }
  }
  var AuthParams;
  ((AuthParams2) => {
    AuthParams2.refreshToken = throttle(async () => {
      AuthParams2.token = await getVideoToken();
    }, 1e3);
  })(AuthParams || (AuthParams = {}));
  async function getVideoToken() {
    return (await (await fetch(
      "https://cbiz.yanhekt.cn/v1/auth/video/token?id=0",
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Xdomain-Client": "web_user",
          "xclient-timestamp": encrypt$1().t(),
          "xclient-signature": encrypt$1().s(),
          "xclient-version": encrypt$1().v()
        }
      }
    )).json()).data.token;
  }
  function getAuthToken() {
    const token = JSON.parse(localStorage.auth ?? "{}").token;
    if (!token) throw new Error("获取身份认证信息失败");
    return token;
  }
  function throttle(func, wait) {
    let result;
    return () => (result !== void 0 || (result = func(), setTimeout(() => result = void 0, wait)), result);
  }
  async function fetchCourseVideos(courseId) {
    const res = await fetch(
      `https://cbiz.yanhekt.cn/v2/course/session/list?course_id=${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Xdomain-Client": "web_user",
          "xclient-timestamp": encrypt$1().t(),
          "xclient-signature": encrypt$1().s(),
          "xclient-version": encrypt$1().v()
        }
      }
    ), { data: courses } = await res.json();
    return courses;
  }
  function downloadVideo(m3u8Url, onProgress) {
    const controller = new AbortController();
    return [
      (async () => {
        const m3u8 = await encryptUrlWithAuth(m3u8Url).then((url) => fetch(url, { signal: controller.signal })).then((r) => r.text()), baseUrl = m3u8Url.substring(0, m3u8Url.lastIndexOf("/")), tsUrls = parseTsUrls(m3u8, baseUrl);
        let progress = 0;
        onProgress(0);
        const blobs = [];
        for (const urlGroup of chunk(tsUrls, 16)) {
          const results = await Promise.all(
            urlGroup.map(async (rawUrl) => {
              let retries = 3, tsUrl = await encryptUrlWithAuth(rawUrl);
              for (; ; )
                try {
                  const res = await fetch(tsUrl, {
                    signal: controller.signal
                  }).then((res2) => res2.blob());
                  return onProgress(++progress / tsUrls.length), res;
                } catch (err) {
                  if (err instanceof DOMException && err.name === "AbortError" || retries-- === 0) throw err;
                  rawUrl.substring(rawUrl.lastIndexOf("/")), tsUrl = await encryptUrlWithAuth(rawUrl, !0);
                }
            })
          );
          blobs.push(...results);
        }
        return new Blob(blobs, { type: "video/mp2t" });
      })(),
      () => {
        controller.abort();
      }
    ];
  }
  function parseTsUrls(m3u8, baseUrl) {
    return m3u8.split(`
`).filter((line) => line.endsWith("ts")).map((line) => `${baseUrl}/${line}`);
  }
  function chunk(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size)
      result.push(arr.slice(i, i + size));
    return result;
  }
  var FFMessageType;
  (function(FFMessageType2) {
    FFMessageType2.LOAD = "LOAD", FFMessageType2.EXEC = "EXEC", FFMessageType2.WRITE_FILE = "WRITE_FILE", FFMessageType2.READ_FILE = "READ_FILE", FFMessageType2.DELETE_FILE = "DELETE_FILE", FFMessageType2.RENAME = "RENAME", FFMessageType2.CREATE_DIR = "CREATE_DIR", FFMessageType2.LIST_DIR = "LIST_DIR", FFMessageType2.DELETE_DIR = "DELETE_DIR", FFMessageType2.ERROR = "ERROR", FFMessageType2.DOWNLOAD = "DOWNLOAD", FFMessageType2.PROGRESS = "PROGRESS", FFMessageType2.LOG = "LOG", FFMessageType2.MOUNT = "MOUNT", FFMessageType2.UNMOUNT = "UNMOUNT";
  })(FFMessageType || (FFMessageType = {}));
  const getMessageID = /* @__PURE__ */ (() => {
    let messageID = 0;
    return () => messageID++;
  })(), ERROR_NOT_LOADED = new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first"), ERROR_TERMINATED = new Error("called FFmpeg.terminate()"), encodedJs = "KGZ1bmN0aW9uKCkgewogICJ1c2Ugc3RyaWN0IjsKICBjb25zdCBDT1JFX1VSTCA9ICJodHRwczovL3VucGtnLmNvbS9AZmZtcGVnL2NvcmVAMC4xMi42L2Rpc3QvdW1kL2ZmbXBlZy1jb3JlLmpzIjsKICB2YXIgRkZNZXNzYWdlVHlwZTsKICAoZnVuY3Rpb24oRkZNZXNzYWdlVHlwZTIpIHsKICAgIEZGTWVzc2FnZVR5cGUyLkxPQUQgPSAiTE9BRCIsIEZGTWVzc2FnZVR5cGUyLkVYRUMgPSAiRVhFQyIsIEZGTWVzc2FnZVR5cGUyLldSSVRFX0ZJTEUgPSAiV1JJVEVfRklMRSIsIEZGTWVzc2FnZVR5cGUyLlJFQURfRklMRSA9ICJSRUFEX0ZJTEUiLCBGRk1lc3NhZ2VUeXBlMi5ERUxFVEVfRklMRSA9ICJERUxFVEVfRklMRSIsIEZGTWVzc2FnZVR5cGUyLlJFTkFNRSA9ICJSRU5BTUUiLCBGRk1lc3NhZ2VUeXBlMi5DUkVBVEVfRElSID0gIkNSRUFURV9ESVIiLCBGRk1lc3NhZ2VUeXBlMi5MSVNUX0RJUiA9ICJMSVNUX0RJUiIsIEZGTWVzc2FnZVR5cGUyLkRFTEVURV9ESVIgPSAiREVMRVRFX0RJUiIsIEZGTWVzc2FnZVR5cGUyLkVSUk9SID0gIkVSUk9SIiwgRkZNZXNzYWdlVHlwZTIuRE9XTkxPQUQgPSAiRE9XTkxPQUQiLCBGRk1lc3NhZ2VUeXBlMi5QUk9HUkVTUyA9ICJQUk9HUkVTUyIsIEZGTWVzc2FnZVR5cGUyLkxPRyA9ICJMT0ciLCBGRk1lc3NhZ2VUeXBlMi5NT1VOVCA9ICJNT1VOVCIsIEZGTWVzc2FnZVR5cGUyLlVOTU9VTlQgPSAiVU5NT1VOVCI7CiAgfSkoRkZNZXNzYWdlVHlwZSB8fCAoRkZNZXNzYWdlVHlwZSA9IHt9KSk7CiAgY29uc3QgRVJST1JfVU5LTk9XTl9NRVNTQUdFX1RZUEUgPSBuZXcgRXJyb3IoInVua25vd24gbWVzc2FnZSB0eXBlIiksIEVSUk9SX05PVF9MT0FERUQgPSBuZXcgRXJyb3IoImZmbXBlZyBpcyBub3QgbG9hZGVkLCBjYWxsIGBhd2FpdCBmZm1wZWcubG9hZCgpYCBmaXJzdCIpLCBFUlJPUl9JTVBPUlRfRkFJTFVSRSA9IG5ldyBFcnJvcigiZmFpbGVkIHRvIGltcG9ydCBmZm1wZWctY29yZS5qcyIpOwogIGxldCBmZm1wZWc7CiAgY29uc3QgbG9hZCA9IGFzeW5jICh7IGNvcmVVUkw6IF9jb3JlVVJMLCB3YXNtVVJMOiBfd2FzbVVSTCwgd29ya2VyVVJMOiBfd29ya2VyVVJMIH0pID0+IHsKICAgIGNvbnN0IGZpcnN0ID0gIWZmbXBlZzsKICAgIHRyeSB7CiAgICAgIF9jb3JlVVJMIHx8IChfY29yZVVSTCA9IENPUkVfVVJMKSwgaW1wb3J0U2NyaXB0cyhfY29yZVVSTCk7CiAgICB9IGNhdGNoIHsKICAgICAgaWYgKF9jb3JlVVJMIHx8IChfY29yZVVSTCA9IENPUkVfVVJMLnJlcGxhY2UoIi91bWQvIiwgIi9lc20vIikpLCBzZWxmLmNyZWF0ZUZGbXBlZ0NvcmUgPSAoYXdhaXQgaW1wb3J0KAogICAgICAgIC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8KICAgICAgICAvKiBAdml0ZS1pZ25vcmUgKi8KICAgICAgICBfY29yZVVSTAogICAgICApKS5kZWZhdWx0LCAhc2VsZi5jcmVhdGVGRm1wZWdDb3JlKQogICAgICAgIHRocm93IEVSUk9SX0lNUE9SVF9GQUlMVVJFOwogICAgfQogICAgY29uc3QgY29yZVVSTCA9IF9jb3JlVVJMLCB3YXNtVVJMID0gX3dhc21VUkwgfHwgX2NvcmVVUkwucmVwbGFjZSgvLmpzJC9nLCAiLndhc20iKSwgd29ya2VyVVJMID0gX3dvcmtlclVSTCB8fCBfY29yZVVSTC5yZXBsYWNlKC8uanMkL2csICIud29ya2VyLmpzIik7CiAgICByZXR1cm4gZmZtcGVnID0gYXdhaXQgc2VsZi5jcmVhdGVGRm1wZWdDb3JlKHsKICAgICAgLy8gRml4IGBPdmVybG9hZCByZXNvbHV0aW9uIGZhaWxlZC5gIHdoZW4gdXNpbmcgbXVsdGktdGhyZWFkZWQgZmZtcGVnLWNvcmUuCiAgICAgIC8vIEVuY29kZWQgd2FzbVVSTCBhbmQgd29ya2VyVVJMIGluIHRoZSBVUkwgYXMgYSBoYWNrIHRvIGZpeCBsb2NhdGVGaWxlIGlzc3VlLgogICAgICBtYWluU2NyaXB0VXJsT3JCbG9iOiBgJHtjb3JlVVJMfSMke2J0b2EoSlNPTi5zdHJpbmdpZnkoeyB3YXNtVVJMLCB3b3JrZXJVUkwgfSkpfWAKICAgIH0pLCBmZm1wZWcuc2V0TG9nZ2VyKChkYXRhKSA9PiBzZWxmLnBvc3RNZXNzYWdlKHsgdHlwZTogRkZNZXNzYWdlVHlwZS5MT0csIGRhdGEgfSkpLCBmZm1wZWcuc2V0UHJvZ3Jlc3MoKGRhdGEpID0+IHNlbGYucG9zdE1lc3NhZ2UoewogICAgICB0eXBlOiBGRk1lc3NhZ2VUeXBlLlBST0dSRVNTLAogICAgICBkYXRhCiAgICB9KSksIGZpcnN0OwogIH0sIGV4ZWMgPSAoeyBhcmdzLCB0aW1lb3V0ID0gLTEgfSkgPT4gewogICAgZmZtcGVnLnNldFRpbWVvdXQodGltZW91dCksIGZmbXBlZy5leGVjKC4uLmFyZ3MpOwogICAgY29uc3QgcmV0ID0gZmZtcGVnLnJldDsKICAgIHJldHVybiBmZm1wZWcucmVzZXQoKSwgcmV0OwogIH0sIHdyaXRlRmlsZSA9ICh7IHBhdGgsIGRhdGEgfSkgPT4gKGZmbXBlZy5GUy53cml0ZUZpbGUocGF0aCwgZGF0YSksICEwKSwgcmVhZEZpbGUgPSAoeyBwYXRoLCBlbmNvZGluZyB9KSA9PiBmZm1wZWcuRlMucmVhZEZpbGUocGF0aCwgeyBlbmNvZGluZyB9KSwgZGVsZXRlRmlsZSA9ICh7IHBhdGggfSkgPT4gKGZmbXBlZy5GUy51bmxpbmsocGF0aCksICEwKSwgcmVuYW1lID0gKHsgb2xkUGF0aCwgbmV3UGF0aCB9KSA9PiAoZmZtcGVnLkZTLnJlbmFtZShvbGRQYXRoLCBuZXdQYXRoKSwgITApLCBjcmVhdGVEaXIgPSAoeyBwYXRoIH0pID0+IChmZm1wZWcuRlMubWtkaXIocGF0aCksICEwKSwgbGlzdERpciA9ICh7IHBhdGggfSkgPT4gewogICAgY29uc3QgbmFtZXMgPSBmZm1wZWcuRlMucmVhZGRpcihwYXRoKSwgbm9kZXMgPSBbXTsKICAgIGZvciAoY29uc3QgbmFtZSBvZiBuYW1lcykgewogICAgICBjb25zdCBzdGF0ID0gZmZtcGVnLkZTLnN0YXQoYCR7cGF0aH0vJHtuYW1lfWApLCBpc0RpciA9IGZmbXBlZy5GUy5pc0RpcihzdGF0Lm1vZGUpOwogICAgICBub2Rlcy5wdXNoKHsgbmFtZSwgaXNEaXIgfSk7CiAgICB9CiAgICByZXR1cm4gbm9kZXM7CiAgfSwgZGVsZXRlRGlyID0gKHsgcGF0aCB9KSA9PiAoZmZtcGVnLkZTLnJtZGlyKHBhdGgpLCAhMCksIG1vdW50ID0gKHsgZnNUeXBlLCBvcHRpb25zLCBtb3VudFBvaW50IH0pID0+IHsKICAgIGNvbnN0IHN0ciA9IGZzVHlwZSwgZnMgPSBmZm1wZWcuRlMuZmlsZXN5c3RlbXNbc3RyXTsKICAgIHJldHVybiBmcyA/IChmZm1wZWcuRlMubW91bnQoZnMsIG9wdGlvbnMsIG1vdW50UG9pbnQpLCAhMCkgOiAhMTsKICB9LCB1bm1vdW50ID0gKHsgbW91bnRQb2ludCB9KSA9PiAoZmZtcGVnLkZTLnVubW91bnQobW91bnRQb2ludCksICEwKTsKICBzZWxmLm9ubWVzc2FnZSA9IGFzeW5jICh7IGRhdGE6IHsgaWQsIHR5cGUsIGRhdGE6IF9kYXRhIH0gfSkgPT4gewogICAgY29uc3QgdHJhbnMgPSBbXTsKICAgIGxldCBkYXRhOwogICAgdHJ5IHsKICAgICAgaWYgKHR5cGUgIT09IEZGTWVzc2FnZVR5cGUuTE9BRCAmJiAhZmZtcGVnKQogICAgICAgIHRocm93IEVSUk9SX05PVF9MT0FERUQ7CiAgICAgIHN3aXRjaCAodHlwZSkgewogICAgICAgIGNhc2UgRkZNZXNzYWdlVHlwZS5MT0FEOgogICAgICAgICAgZGF0YSA9IGF3YWl0IGxvYWQoX2RhdGEpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSBGRk1lc3NhZ2VUeXBlLkVYRUM6CiAgICAgICAgICBkYXRhID0gZXhlYyhfZGF0YSk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlIEZGTWVzc2FnZVR5cGUuV1JJVEVfRklMRToKICAgICAgICAgIGRhdGEgPSB3cml0ZUZpbGUoX2RhdGEpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSBGRk1lc3NhZ2VUeXBlLlJFQURfRklMRToKICAgICAgICAgIGRhdGEgPSByZWFkRmlsZShfZGF0YSk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlIEZGTWVzc2FnZVR5cGUuREVMRVRFX0ZJTEU6CiAgICAgICAgICBkYXRhID0gZGVsZXRlRmlsZShfZGF0YSk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlIEZGTWVzc2FnZVR5cGUuUkVOQU1FOgogICAgICAgICAgZGF0YSA9IHJlbmFtZShfZGF0YSk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlIEZGTWVzc2FnZVR5cGUuQ1JFQVRFX0RJUjoKICAgICAgICAgIGRhdGEgPSBjcmVhdGVEaXIoX2RhdGEpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSBGRk1lc3NhZ2VUeXBlLkxJU1RfRElSOgogICAgICAgICAgZGF0YSA9IGxpc3REaXIoX2RhdGEpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSBGRk1lc3NhZ2VUeXBlLkRFTEVURV9ESVI6CiAgICAgICAgICBkYXRhID0gZGVsZXRlRGlyKF9kYXRhKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgRkZNZXNzYWdlVHlwZS5NT1VOVDoKICAgICAgICAgIGRhdGEgPSBtb3VudChfZGF0YSk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlIEZGTWVzc2FnZVR5cGUuVU5NT1VOVDoKICAgICAgICAgIGRhdGEgPSB1bm1vdW50KF9kYXRhKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGRlZmF1bHQ6CiAgICAgICAgICB0aHJvdyBFUlJPUl9VTktOT1dOX01FU1NBR0VfVFlQRTsKICAgICAgfQogICAgfSBjYXRjaCAoZSkgewogICAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgICBpZCwKICAgICAgICB0eXBlOiBGRk1lc3NhZ2VUeXBlLkVSUk9SLAogICAgICAgIGRhdGE6IGUudG9TdHJpbmcoKQogICAgICB9KTsKICAgICAgcmV0dXJuOwogICAgfQogICAgZGF0YSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkgJiYgdHJhbnMucHVzaChkYXRhLmJ1ZmZlciksIHNlbGYucG9zdE1lc3NhZ2UoeyBpZCwgdHlwZSwgZGF0YSB9LCB0cmFucyk7CiAgfTsKfSkoKTsK", decodeBase64 = (base64) => Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)), blob = typeof self < "u" && self.Blob && new Blob([decodeBase64(encodedJs)], { type: "text/javascript;charset=utf-8" });
  function WorkerWrapper(options) {
    let objURL;
    try {
      if (objURL = blob && (self.URL || self.webkitURL).createObjectURL(blob), !objURL) throw "";
      const worker = new Worker(objURL, {
        name: options == null ? void 0 : options.name
      });
      return worker.addEventListener("error", () => {
        (self.URL || self.webkitURL).revokeObjectURL(objURL);
      }), worker;
    } catch {
      return new Worker(
        "data:text/javascript;base64," + encodedJs,
        {
          name: options == null ? void 0 : options.name
        }
      );
    } finally {
      objURL && (self.URL || self.webkitURL).revokeObjectURL(objURL);
    }
  }
  class FFmpeg {
    constructor() {
      __privateAdd(this, _worker, null);
      /**
       * #resolves and #rejects tracks Promise resolves and rejects to
       * be called when we receive message from web worker.
       */
      __privateAdd(this, _resolves, {});
      __privateAdd(this, _rejects, {});
      __privateAdd(this, _logEventCallbacks, []);
      __privateAdd(this, _progressEventCallbacks, []);
      __publicField(this, "loaded", !1);
      /**
       * register worker message event handlers.
       */
      __privateAdd(this, _registerHandlers, () => {
        __privateGet(this, _worker) && (__privateGet(this, _worker).onmessage = ({ data: { id, type, data } }) => {
          switch (type) {
            case FFMessageType.LOAD:
              this.loaded = !0, __privateGet(this, _resolves)[id](data);
              break;
            case FFMessageType.MOUNT:
            case FFMessageType.UNMOUNT:
            case FFMessageType.EXEC:
            case FFMessageType.WRITE_FILE:
            case FFMessageType.READ_FILE:
            case FFMessageType.DELETE_FILE:
            case FFMessageType.RENAME:
            case FFMessageType.CREATE_DIR:
            case FFMessageType.LIST_DIR:
            case FFMessageType.DELETE_DIR:
              __privateGet(this, _resolves)[id](data);
              break;
            case FFMessageType.LOG:
              __privateGet(this, _logEventCallbacks).forEach((f) => f(data));
              break;
            case FFMessageType.PROGRESS:
              __privateGet(this, _progressEventCallbacks).forEach((f) => f(data));
              break;
            case FFMessageType.ERROR:
              __privateGet(this, _rejects)[id](data);
              break;
          }
          delete __privateGet(this, _resolves)[id], delete __privateGet(this, _rejects)[id];
        });
      });
      /**
       * Generic function to send messages to web worker.
       */
      __privateAdd(this, _send, ({ type, data }, trans = [], signal) => __privateGet(this, _worker) ? new Promise((resolve, reject) => {
        const id = getMessageID();
        __privateGet(this, _worker) && __privateGet(this, _worker).postMessage({ id, type, data }, trans), __privateGet(this, _resolves)[id] = resolve, __privateGet(this, _rejects)[id] = reject, signal == null || signal.addEventListener("abort", () => {
          reject(new DOMException(`Message # ${id} was aborted`, "AbortError"));
        }, { once: !0 });
      }) : Promise.reject(ERROR_NOT_LOADED));
      /**
       * Loads ffmpeg-core inside web worker. It is required to call this method first
       * as it initializes WebAssembly and other essential variables.
       *
       * @category FFmpeg
       * @returns `true` if ffmpeg core is loaded for the first time.
       */
      __publicField(this, "load", ({ classWorkerURL, ...config } = {}, { signal } = {}) => (__privateGet(this, _worker) || (__privateSet(this, _worker, classWorkerURL ? new Worker(new URL(classWorkerURL, _documentCurrentScript && _documentCurrentScript.src || new URL("yanhekt-downloader.user.js", document.baseURI).href), {
        type: "module"
      }) : (
        // We need to duplicated the code here to enable webpack
        // to bundle worekr.js here.
        new WorkerWrapper()
      )), __privateGet(this, _registerHandlers).call(this)), __privateGet(this, _send).call(this, {
        type: FFMessageType.LOAD,
        data: config
      }, void 0, signal)));
      /**
       * Execute ffmpeg command.
       *
       * @remarks
       * To avoid common I/O issues, ["-nostdin", "-y"] are prepended to the args
       * by default.
       *
       * @example
       * ```ts
       * const ffmpeg = new FFmpeg();
       * await ffmpeg.load();
       * await ffmpeg.writeFile("video.avi", ...);
       * // ffmpeg -i video.avi video.mp4
       * await ffmpeg.exec(["-i", "video.avi", "video.mp4"]);
       * const data = ffmpeg.readFile("video.mp4");
       * ```
       *
       * @returns `0` if no error, `!= 0` if timeout (1) or error.
       * @category FFmpeg
       */
      __publicField(this, "exec", (args, timeout = -1, { signal } = {}) => __privateGet(this, _send).call(this, {
        type: FFMessageType.EXEC,
        data: { args, timeout }
      }, void 0, signal));
      /**
       * Terminate all ongoing API calls and terminate web worker.
       * `FFmpeg.load()` must be called again before calling any other APIs.
       *
       * @category FFmpeg
       */
      __publicField(this, "terminate", () => {
        const ids = Object.keys(__privateGet(this, _rejects));
        for (const id of ids)
          __privateGet(this, _rejects)[id](ERROR_TERMINATED), delete __privateGet(this, _rejects)[id], delete __privateGet(this, _resolves)[id];
        __privateGet(this, _worker) && (__privateGet(this, _worker).terminate(), __privateSet(this, _worker, null), this.loaded = !1);
      });
      /**
       * Write data to ffmpeg.wasm.
       *
       * @example
       * ```ts
       * const ffmpeg = new FFmpeg();
       * await ffmpeg.load();
       * await ffmpeg.writeFile("video.avi", await fetchFile("../video.avi"));
       * await ffmpeg.writeFile("text.txt", "hello world");
       * ```
       *
       * @category File System
       */
      __publicField(this, "writeFile", (path, data, { signal } = {}) => {
        const trans = [];
        return data instanceof Uint8Array && trans.push(data.buffer), __privateGet(this, _send).call(this, {
          type: FFMessageType.WRITE_FILE,
          data: { path, data }
        }, trans, signal);
      });
      __publicField(this, "mount", (fsType, options, mountPoint) => {
        const trans = [];
        return __privateGet(this, _send).call(this, {
          type: FFMessageType.MOUNT,
          data: { fsType, options, mountPoint }
        }, trans);
      });
      __publicField(this, "unmount", (mountPoint) => {
        const trans = [];
        return __privateGet(this, _send).call(this, {
          type: FFMessageType.UNMOUNT,
          data: { mountPoint }
        }, trans);
      });
      /**
       * Read data from ffmpeg.wasm.
       *
       * @example
       * ```ts
       * const ffmpeg = new FFmpeg();
       * await ffmpeg.load();
       * const data = await ffmpeg.readFile("video.mp4");
       * ```
       *
       * @category File System
       */
      __publicField(this, "readFile", (path, encoding = "binary", { signal } = {}) => __privateGet(this, _send).call(this, {
        type: FFMessageType.READ_FILE,
        data: { path, encoding }
      }, void 0, signal));
      /**
       * Delete a file.
       *
       * @category File System
       */
      __publicField(this, "deleteFile", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
        type: FFMessageType.DELETE_FILE,
        data: { path }
      }, void 0, signal));
      /**
       * Rename a file or directory.
       *
       * @category File System
       */
      __publicField(this, "rename", (oldPath, newPath, { signal } = {}) => __privateGet(this, _send).call(this, {
        type: FFMessageType.RENAME,
        data: { oldPath, newPath }
      }, void 0, signal));
      /**
       * Create a directory.
       *
       * @category File System
       */
      __publicField(this, "createDir", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
        type: FFMessageType.CREATE_DIR,
        data: { path }
      }, void 0, signal));
      /**
       * List directory contents.
       *
       * @category File System
       */
      __publicField(this, "listDir", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
        type: FFMessageType.LIST_DIR,
        data: { path }
      }, void 0, signal));
      /**
       * Delete an empty directory.
       *
       * @category File System
       */
      __publicField(this, "deleteDir", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
        type: FFMessageType.DELETE_DIR,
        data: { path }
      }, void 0, signal));
    }
    on(event, callback) {
      event === "log" ? __privateGet(this, _logEventCallbacks).push(callback) : event === "progress" && __privateGet(this, _progressEventCallbacks).push(callback);
    }
    off(event, callback) {
      event === "log" ? __privateSet(this, _logEventCallbacks, __privateGet(this, _logEventCallbacks).filter((f) => f !== callback)) : event === "progress" && __privateSet(this, _progressEventCallbacks, __privateGet(this, _progressEventCallbacks).filter((f) => f !== callback));
    }
  }
  _worker = new WeakMap(), _resolves = new WeakMap(), _rejects = new WeakMap(), _logEventCallbacks = new WeakMap(), _progressEventCallbacks = new WeakMap(), _registerHandlers = new WeakMap(), _send = new WeakMap();
  const ERROR_RESPONSE_BODY_READER = new Error("failed to get response body reader"), ERROR_INCOMPLETED_DOWNLOAD = new Error("failed to complete download"), HeaderContentLength = "Content-Length", readFromBlobOrFile = (blob2) => new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const { result } = fileReader;
      result instanceof ArrayBuffer ? resolve(new Uint8Array(result)) : resolve(new Uint8Array());
    }, fileReader.onerror = (event) => {
      var _a, _b;
      reject(Error(`File could not be read! Code=${((_b = (_a = event == null ? void 0 : event.target) == null ? void 0 : _a.error) == null ? void 0 : _b.code) || -1}`));
    }, fileReader.readAsArrayBuffer(blob2);
  }), fetchFile = async (file) => {
    let data;
    if (typeof file == "string")
      /data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(file) ? data = atob(file.split(",")[1]).split("").map((c) => c.charCodeAt(0)) : data = await (await fetch(file)).arrayBuffer();
    else if (file instanceof URL)
      data = await (await fetch(file)).arrayBuffer();
    else if (file instanceof File || file instanceof Blob)
      data = await readFromBlobOrFile(file);
    else
      return new Uint8Array();
    return new Uint8Array(data);
  }, downloadWithProgress = async (url, cb) => {
    var _a;
    const resp = await fetch(url);
    let buf;
    try {
      const total = parseInt(resp.headers.get(HeaderContentLength) || "-1"), reader = (_a = resp.body) == null ? void 0 : _a.getReader();
      if (!reader)
        throw ERROR_RESPONSE_BODY_READER;
      const chunks = [];
      let received = 0;
      for (; ; ) {
        const { done, value } = await reader.read(), delta = value ? value.length : 0;
        if (done) {
          if (total != -1 && total !== received)
            throw ERROR_INCOMPLETED_DOWNLOAD;
          cb && cb({ url, total, received, delta, done });
          break;
        }
        chunks.push(value), received += delta, cb && cb({ url, total, received, delta, done });
      }
      const data = new Uint8Array(received);
      let position = 0;
      for (const chunk2 of chunks)
        data.set(chunk2, position), position += chunk2.length;
      buf = data.buffer;
    } catch {
      buf = await resp.arrayBuffer();
    }
    return buf;
  }, toBlobURL = async (url, mimeType, progress = !1, cb) => {
    const buf = progress ? await downloadWithProgress(url, cb) : await (await fetch(url)).arrayBuffer(), blob2 = new Blob([buf], { type: mimeType });
    return URL.createObjectURL(blob2);
  }, CDN_BASE = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd", ffmpeg = new FFmpeg(), resolveQueue = [];
  let isTaskRunning = !1;
  async function enqueue(task) {
    var _a;
    isTaskRunning && await new Promise((resolve) => resolveQueue.push(resolve)), isTaskRunning = !0;
    try {
      return await task();
    } finally {
      (_a = resolveQueue.shift()) == null || _a(), isTaskRunning = !1;
    }
  }
  function convertTsToMp4(tsFile, onLog, onProgress) {
    const controller = new AbortController(), logCallback = ({ message }) => onLog(message), progressCallback = ({ progress }) => onProgress(progress);
    return [
      enqueue(async () => {
        ffmpeg.loaded || await ffmpeg.load({
          coreURL: await toBlobURL(`${CDN_BASE}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${CDN_BASE}/ffmpeg-core.wasm`, "application/wasm")
        }), ffmpeg.on("log", logCallback), ffmpeg.on("progress", progressCallback), await ffmpeg.writeFile("input.ts", await fetchFile(tsFile)), await ffmpeg.exec(
          ["-i", "input.ts", "-c", "copy", "output.mp4"],
          void 0,
          { signal: controller.signal }
        ), ffmpeg.off("log", logCallback), ffmpeg.off("progress", progressCallback);
        const data = await ffmpeg.readFile("output.mp4");
        return await ffmpeg.deleteFile("input.ts"), await ffmpeg.deleteFile("output.mp4"), new Blob([data], { type: "video/mp4" });
      }),
      () => {
        controller.abort();
      }
    ];
  }
  const downloadingSVG = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1em'%20height='1em'%20viewBox='0%200%2024%2024'%3e%3cpath%20fill='none'%20stroke='%23aaa'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='1.3'%20d='M12%2012v6m0%200l3-2m-3%202l-3-2m4-13H8.2c-1.12%200-1.68%200-2.108.218a1.999%201.999%200%200%200-.874.874C5%204.52%205%205.08%205%206.2v11.6c0%201.12%200%201.68.218%202.108a2%202%200%200%200%20.874.874c.427.218.987.218%202.105.218h7.606c1.118%200%201.677%200%202.104-.218c.377-.192.683-.498.875-.874c.218-.428.218-.986.218-2.104V9m-6-6c.286.003.466.014.639.055c.204.05.399.13.578.24c.202.124.375.297.72.643l3.126%203.125c.346.346.518.518.642.72c.11.18.19.374.24.578c.04.173.051.354.054.639M13%203v2.8c0%201.12%200%201.68.218%202.108a2%202%200%200%200%20.874.874c.427.218.987.218%202.105.218h2.802m0%200H19'%20/%3e%3c/svg%3e", errorSVG = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1em'%20height='1em'%20viewBox='0%200%20256%20256'%3e%3cg%20fill='none'%20stroke='%23c4c4c4'%20stroke-linecap='round'%3e%3cpath%20stroke-width='15.99'%20d='M%2032,48%20V%20207.9236'/%3e%3cpath%20stroke-linejoin='round'%20stroke-width='15.99'%20d='M%20224,96%20V%20208'/%3e%3cpath%20stroke-linejoin='round'%20stroke-width='15.99'%20d='m%2064,16%20h%2080'/%3e%3cpath%20stroke-width='15.99'%20d='M%2064,240%20H%20192'/%3e%3cpath%20stroke-linejoin='round'%20stroke-width='15.99'%20d='m%20224,208%20c%200.0874,15.98169%20-16,32%20-32,32'/%3e%3cpath%20stroke-linejoin='round'%20stroke-width='15.99'%20d='m%20-32,208%20c%20-10e-7,16%20-16,32%20-32,32'%20transform='scale(-1%201)'/%3e%3cpath%20stroke-linejoin='round'%20stroke-width='15.99'%20d='M%20-32,-47.976784%20C%20-32,-32%20-48,-16.356322%20-63.999997,-16.000002'%20transform='scale(-1)'/%3e%3cpath%20stroke-linejoin='round'%20stroke-width='15.99'%20d='M%20223.91257,96.071779%20144,16'/%3e%3cpath%20stroke-linejoin='round'%20stroke-width='15.99'%20d='m%20-144,64%20c%20-0.0492,15.912926%20-16.06452,31.999995%20-32,32'%20transform='scale(-1%201)'/%3e%3cpath%20stroke-linejoin='round'%20stroke-width='15.99'%20d='M%20144,64%20V%2016'/%3e%3cpath%20stroke-linejoin='round'%20stroke-width='15.99'%20d='m%20176,96%20h%2048'/%3e%3cpath%20stroke-linejoin='round'%20stroke-width='16'%20d='m%2064,208%2048,-64'/%3e%3cpath%20stroke-linejoin='round'%20stroke-width='16'%20d='m%2064,144%2048,64'/%3e%3c/g%3e%3c/svg%3e", processingSVG = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1em'%20height='1em'%20viewBox='0%200%2024%2024'%3e%3cpath%20fill='%23aaa'%20d='M12%2019H4.616q-.691%200-1.153-.462T3%2017.384V6.616q0-.691.463-1.153T4.615%205h14.77q.69%200%201.152.463T21%206.616V11h-1V6.616q0-.27-.173-.443T19.385%206H4.615q-.269%200-.442.173T4%206.616v10.769q0%20.269.173.442t.443.173H12zm-2-3.423V8.423L15.577%2012zm7.85%205.23l-.108-.865q-.569-.125-.937-.349t-.701-.558l-.796.353l-.577-.854l.708-.576q-.185-.542-.185-1.035t.185-1.034l-.708-.577l.577-.854l.796.354q.333-.335.7-.559q.369-.224.938-.35l.108-.864h1l.108.865q.569.125.937.352t.701.567l.796-.365l.577.865l-.707.577q.184.53.184%201.029t-.184%201.029l.707.577l-.577.854l-.796-.354q-.332.334-.7.558t-.938.35l-.108.865zm.5-1.73q.883%200%201.518-.636q.636-.635.636-1.518t-.636-1.518t-1.518-.636t-1.518.636q-.636.635-.636%201.518t.636%201.518t1.518.636'/%3e%3c/svg%3e", waitingSVG = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1em'%20height='1em'%20viewBox='0%200%2024%2024'%3e%3cg%20fill='none'%20stroke='%23aaa'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='1.3'%3e%3cpath%20d='M16%2022h2a2%202%200%200%200%202-2V7l-5-5H6a2%202%200%200%200-2%202v3'/%3e%3cpath%20d='M14%202v4a2%202%200%200%200%202%202h4'/%3e%3ccircle%20cx='8'%20cy='16'%20r='6'/%3e%3cpath%20d='M9.5%2017.5L8%2016.25V14'/%3e%3c/g%3e%3c/svg%3e", finishedSVG = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1em'%20height='1em'%20viewBox='0%200%2048%2048'%3e%3cg%20fill='none'%20stroke='%23aaa'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='2.4'%3e%3cpath%20d='M40%2023v-9L31%204H10a2%202%200%200%200-2%202v36a2%202%200%200%200%202%202h12'/%3e%3cpath%20d='m26%2038l6%205l9-11M30%204v10h10'/%3e%3c/g%3e%3c/svg%3e", cloudDownloadSVG = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1em'%20height='1em'%20viewBox='0%200%2024%2024'%3e%3cpath%20fill='%23aaa'%20d='M11%204a4%204%200%200%200-3.999%204.102a1%201%200%200%201-.75.992A3.002%203.002%200%200%200%207%2015h1a1%201%200%201%201%200%202H7a5%205%200%200%201-1.97-9.596a6%206%200%200%201%2011.169-2.4A6%206%200%200%201%2016%2017a1%201%200%201%201%200-2a4%204%200%201%200-.328-7.987a1%201%200%200%201-.999-.6A4.001%204.001%200%200%200%2011%204m1%206a1%201%200%200%201%201%201v7.586l.293-.293a1%201%200%200%201%201.414%201.414l-2%202a1%201%200%200%201-1.414%200l-2-2a1%201%200%201%201%201.414-1.414l.293.293V11a1%201%200%200%201%201-1'/%3e%3c/svg%3e", cancelSVG = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1em'%20height='1em'%20viewBox='0%200%2024%2024'%3e%3cpath%20fill='%23aaa'%20d='M12%202C6.47%202%202%206.47%202%2012s4.47%2010%2010%2010s10-4.47%2010-10S17.53%202%2012%202m0%2018c-4.41%200-8-3.59-8-8s3.59-8%208-8s8%203.59%208%208s-3.59%208-8%208m3.59-13L12%2010.59L8.41%207L7%208.41L10.59%2012L7%2015.59L8.41%2017L12%2013.41L15.59%2017L17%2015.59L13.41%2012L17%208.41z'%20/%3e%3c/svg%3e", retrySVG = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1em'%20height='1em'%20viewBox='0%200%2024%2024'%3e%3cpath%20fill='%23aaa'%20d='M12.793%202.293a1%201%200%200%201%201.414%200l3%203a1%201%200%200%201%200%201.414l-3%203a1%201%200%200%201-1.414-1.414L14.086%207H12.5C8.952%207%206%209.952%206%2013.5S8.952%2020%2012.5%2020s6.5-2.952%206.5-6.5a1%201%200%201%201%202%200c0%204.652-3.848%208.5-8.5%208.5S4%2018.152%204%2013.5S7.848%205%2012.5%205h1.586l-1.293-1.293a1%201%200%200%201%200-1.414'/%3e%3c/svg%3e";
  var noop = () => {
  };
  function createListTransition(source, options) {
    const initSource = untrack(source), { onChange } = options;
    let prevSet = new Set(options.appear ? void 0 : initSource);
    const exiting = /* @__PURE__ */ new WeakSet(), [toRemove, setToRemove] = createSignal([], { equals: !1 }), [isTransitionPending] = useTransition(), finishRemoved = options.exitMethod === "remove" ? noop : (els) => {
      setToRemove((p) => (p.push.apply(p, els), p));
      for (const el of els)
        exiting.delete(el);
    }, handleRemoved = options.exitMethod === "remove" ? noop : options.exitMethod === "keep-index" ? (els, el, i) => els.splice(i, 0, el) : (els, el) => els.push(el);
    return createMemo(
      (prev) => {
        const elsToRemove = toRemove(), sourceList = source();
        if (sourceList[$TRACK], untrack(isTransitionPending))
          return isTransitionPending(), prev;
        if (elsToRemove.length) {
          const next = prev.filter((e) => !elsToRemove.includes(e));
          return elsToRemove.length = 0, onChange({ list: next, added: [], removed: [], unchanged: next, finishRemoved }), next;
        }
        return untrack(() => {
          const nextSet = new Set(sourceList), next = sourceList.slice(), added = [], removed = [], unchanged = [];
          for (const el of sourceList)
            (prevSet.has(el) ? unchanged : added).push(el);
          let nothingChanged = !added.length;
          for (let i = 0; i < prev.length; i++) {
            const el = prev[i];
            nextSet.has(el) || (exiting.has(el) || (removed.push(el), exiting.add(el)), handleRemoved(next, el, i)), nothingChanged && el !== next[i] && (nothingChanged = !1);
          }
          return !removed.length && nothingChanged ? prev : (onChange({ list: next, added, removed, unchanged, finishRemoved }), prevSet = nextSet, next);
        });
      },
      options.appear ? [] : initSource.slice()
    );
  }
  var defaultElementPredicate = (item) => item instanceof Element;
  function getResolvedElements(value, predicate) {
    if (predicate(value))
      return value;
    if (typeof value == "function" && !value.length)
      return getResolvedElements(value(), predicate);
    if (Array.isArray(value)) {
      const results = [];
      for (const item of value) {
        const result = getResolvedElements(item, predicate);
        result && (Array.isArray(result) ? results.push.apply(results, result) : results.push(result));
      }
      return results.length ? results : null;
    }
    return null;
  }
  function resolveElements(fn, predicate = defaultElementPredicate, serverPredicate = defaultElementPredicate) {
    const children2 = createMemo(fn), memo = createMemo(
      () => getResolvedElements(children2(), predicate)
    );
    return memo.toArray = () => {
      const value = memo();
      return Array.isArray(value) ? value : value ? [value] : [];
    }, memo;
  }
  var _tmpl$ = /* @__PURE__ */ template('<div class="fixed bottom-[24px] right-[24px] flex flex-col-reverse">'), _tmpl$2 = /* @__PURE__ */ template("<div class=snackbar>"), _tmpl$3 = /* @__PURE__ */ template('<img alt=""class=h-full>'), _tmpl$4 = /* @__PURE__ */ template('<div class="relative h-[64px] w-[288px] flex items-center justify-between gap-[12px] overflow-hidden rounded-[6px] bg-white px-[12px] py-[16px] shadow-md"><img alt=""class="h-full transition-opacity duration-300"><div class="flex flex-1 flex-col justify-between overflow-hidden"><div class="w-full overflow-hidden text-ellipsis break-keep text-[0.9em] text-[#333]"></div><div class="select-none text-[0.8em] opacity-75"></div></div><div class="h-full flex items-center"></div><div class="absolute bottom-0 left-0 h-[3px] rounded-[2px]">'), _tmpl$5 = /* @__PURE__ */ template("<button type=button>");
  let courseVideos;
  const FlexColumnGap = 12, TaskSnackbarHost = (props) => (() => {
    var _el$ = _tmpl$();
    return _el$.style.setProperty("gap", "12px"), insert(_el$, createComponent(TransitionGroup, {
      get children() {
        return createComponent(For, {
          get each() {
            return props.tasks;
          },
          children: (task, index) => createComponent(TaskSnackbar, {
            task,
            onComplete: () => {
              props.onComplete(index());
            },
            onRetry: () => {
              props.onRetry(index());
            }
          })
        });
      }
    })), _el$;
  })(), TransitionGroup = (props) => {
    const transition = createListTransition(
      /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call,
      @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
      resolveElements(() => props.children).toArray,
      /* eslint-enable */
      {
        exitMethod: "keep-index",
        onChange({
          added,
          removed,
          finishRemoved
        }) {
          added.forEach((el) => {
            el.style.opacity = "0", el.style.transform = "translateY(-24px)", setTimeout(() => {
              el.style.transition = "all 0.4s ease-out", el.style.opacity = "1", el.style.transform = "none";
            });
          }), removed.forEach((el) => {
            el.style.transition = "all 0.3s ease-out", el.style.opacity = "0", el.style.transform = "translateX(-24px)", el.style.marginTop = `-${el.clientHeight + FlexColumnGap}px`, el.addEventListener("transitionend", () => {
              finishRemoved([el]);
            }, {
              once: !0
            });
          });
        }
      }
    );
    return createMemo(transition);
  }, TaskSnackbar = (props) => {
    const [state, setState] = createSignal({
      status: "waiting",
      type: "download"
    });
    let abortDownload, abortTranscoding;
    const cancel = () => {
      abortDownload == null || abortDownload(), abortTranscoding == null || abortTranscoding(), props.onComplete();
    };
    return async function() {
      try {
        const url = await resolveVideoUrl(), tsBlob = await startDownloading(url);
        let resultBlob = tsBlob;
        props.task.autoTranscode && (resultBlob = await startTranscoding(tsBlob)), setState({
          status: "finished",
          blobUrl: URL.createObjectURL(resultBlob)
        });
      } catch {
      }
      async function resolveVideoUrl() {
        if (!courseVideos)
          try {
            courseVideos = await fetchCourseVideos(props.task.courseId);
          } catch {
            setState({
              status: "error",
              type: "download",
              message: "获取课程视频地址失败"
            });
          }
        const {
          videos: [videoDetail]
        } = courseVideos.find((course) => course.title === props.task.courseTitle), {
          vga: vgaUrl,
          main: mainUrl,
          format
        } = videoDetail;
        if (format !== "m3u8")
          throw setState({
            status: "error",
            type: "download",
            message: "不支持下载当前课程视频"
          }), new Error("不支持的视频格式");
        return props.task.videoType === "vga" ? vgaUrl : mainUrl;
      }
      async function startDownloading(url) {
        try {
          const [tsBlob, cancel2] = downloadVideo(url, (progress) => {
            setState({
              status: "downloading",
              progress
            });
          });
          return abortDownload = cancel2, await tsBlob;
        } catch (error) {
          throw error instanceof DOMException && error.name === "AbortError" ? setState({
            status: "error",
            type: "cancelled",
            message: "下载已取消"
          }) : setState({
            status: "error",
            type: "download",
            message: "下载错误"
          }), error;
        }
      }
      async function startTranscoding(tsBlob) {
        setState({
          status: "waiting",
          type: "transcode"
        });
        try {
          const [mp4Blob, cancel2] = convertTsToMp4(tsBlob, console.debug, (progress) => {
            setState({
              status: "transcoding",
              progress
            });
          });
          return abortTranscoding = cancel2, await mp4Blob;
        } catch (error) {
          throw error instanceof DOMException && error.name === "AbortError" ? setState({
            status: "error",
            type: "cancelled",
            message: "转码已取消"
          }) : setState({
            status: "error",
            type: "transcode",
            message: "转码错误"
          }), error;
        }
      }
    }(), (() => {
      var _el$2 = _tmpl$2();
      return insert(_el$2, createComponent(Switch, {
        get children() {
          return [createComponent(Match, {
            get when() {
              return state().status == "waiting";
            },
            get children() {
              return createComponent(SnackbarScaffold, {
                iconUrl: waitingSVG,
                get title() {
                  return props.task.courseTitle;
                },
                get description() {
                  return `等待${state().type === "download" ? "下载" : "转码"}...`;
                },
                color: "gray",
                progress: 0,
                actionIconUrl: cancelSVG,
                onActionClick: cancel
              });
            }
          }), createComponent(Match, {
            get when() {
              return state().status == "downloading";
            },
            get children() {
              return createComponent(SnackbarScaffold, {
                iconUrl: downloadingSVG,
                get title() {
                  return props.task.courseTitle;
                },
                description: "下载中...",
                color: "#699AE4",
                get progress() {
                  return state().progress;
                },
                actionIconUrl: cancelSVG,
                onActionClick: cancel
              });
            }
          }), createComponent(Match, {
            get when() {
              return state().status == "finished";
            },
            get children() {
              return createComponent(SnackbarScaffold, {
                iconUrl: finishedSVG,
                get title() {
                  return props.task.courseTitle;
                },
                description: "已完成",
                color: "#69E48B",
                progress: 1,
                actionIconUrl: cloudDownloadSVG,
                onActionClick: () => {
                  const blobUrl = state().blobUrl, a = document.createElement("a");
                  a.href = blobUrl, a.download = `[${props.task.courseName}] ${props.task.courseTitle} [${props.task.videoType === "main" ? "教室" : "投影"}]${props.task.autoTranscode ? ".mp4" : ".ts"}`, a.click(), onCleanup(() => {
                    URL.revokeObjectURL(blobUrl);
                  });
                }
              });
            }
          }), createComponent(Match, {
            get when() {
              return state().status == "transcoding";
            },
            get children() {
              return createComponent(SnackbarScaffold, {
                iconUrl: processingSVG,
                get title() {
                  return props.task.courseTitle;
                },
                description: "转码中...",
                color: "#69E4DD",
                get progress() {
                  return state().progress;
                },
                actionIconUrl: cancelSVG,
                onActionClick: cancel
              });
            }
          }), createComponent(Match, {
            get when() {
              return state().status == "error";
            },
            get children() {
              return createComponent(SnackbarScaffold, {
                iconUrl: errorSVG,
                get title() {
                  return props.task.courseTitle;
                },
                get description() {
                  return state().message;
                },
                color: "#E46969",
                progress: 1,
                actionIconUrl: retrySVG,
                get onActionClick() {
                  return props.onRetry;
                }
              });
            }
          })];
        }
      })), _el$2;
    })();
  }, SnackbarScaffold = (props) => {
    const [fade, setFade] = createSignal(!0);
    return onMount(() => {
      setTimeout(() => {
        setFade(!1);
      });
    }), (() => {
      var _el$3 = _tmpl$4(), _el$4 = _el$3.firstChild, _el$5 = _el$4.nextSibling, _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling, _el$8 = _el$5.nextSibling, _el$10 = _el$8.nextSibling;
      return insert(_el$6, () => props.title), insert(_el$7, () => props.description), insert(_el$8, createComponent(ActionButton, {
        get onClick() {
          return props.onActionClick;
        },
        class: "h-3/5 cursor-pointer border-none bg-transparent p-0 active:brightness-90 hover:brightness-110",
        get children() {
          var _el$9 = _tmpl$3();
          return createRenderEffect(() => setAttribute(_el$9, "src", props.actionIconUrl)), _el$9;
        }
      })), createRenderEffect((_p$) => {
        var _v$ = !!fade(), _v$2 = props.iconUrl, _v$3 = `${props.progress * 100}%`, _v$4 = props.color;
        return _v$ !== _p$.e && _el$4.classList.toggle("opacity-0", _p$.e = _v$), _v$2 !== _p$.t && setAttribute(_el$4, "src", _p$.t = _v$2), _v$3 !== _p$.a && ((_p$.a = _v$3) != null ? _el$10.style.setProperty("width", _v$3) : _el$10.style.removeProperty("width")), _v$4 !== _p$.o && ((_p$.o = _v$4) != null ? _el$10.style.setProperty("background", _v$4) : _el$10.style.removeProperty("background")), _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), _el$3;
    })();
  }, ActionButton = (props) => (() => {
    var _el$11 = _tmpl$5();
    return _el$11.$$click = () => {
      props.onClick();
    }, insert(_el$11, () => props.children), createRenderEffect(() => className(_el$11, props.class)), _el$11;
  })();
  delegateEvents(["click"]);
  const App = () => {
    const [panelState, setPanelState] = createSignal(), [panelVisible, setPanelVisible] = createSignal(!1), [tasks, setTasks] = createStore([]), addTask = (task) => {
      setTasks(tasks.length, task);
    }, deleteTask = (index) => {
      setTasks(produce((tasks2) => {
        tasks2.splice(index, 1);
      }));
    }, restartTask = (index) => {
      const task = unwrap(tasks)[index];
      deleteTask(index), addTask(task);
    }, showPanel = (panelState2) => {
      batch(() => {
        setPanelState(panelState2), setPanelVisible(!0);
      });
    };
    return [createComponent(DownloadButtons, {
      onClick: (courseTitle) => {
        var _a, _b;
        const fullName = ((_b = (_a = document.querySelector(".course-intro-title")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) ?? "未知课程", courseName = fullName.substring(0, fullName.indexOf("("));
        showPanel({
          courseName,
          title: courseTitle
        });
      }
    }), createComponent(TaskCreatePanel, {
      get visible() {
        return panelVisible();
      },
      get uiState() {
        return panelState();
      },
      onClose: () => {
        setPanelVisible(!1);
      },
      onCreate: (task) => {
        setPanelVisible(!1), addTask(task);
      }
    }), createComponent(TaskSnackbarHost, {
      tasks,
      onComplete: deleteTask,
      onRetry: restartTask
    })];
  }, root = document.createElement("div");
  document.body.appendChild(root), render(() => createComponent(App, {}), root);
})();

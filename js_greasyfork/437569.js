// ==UserScript==
// @name              Cotrans Manga/Image Translator (Regular Edition)
// @name:zh-CN        Cotrans 漫画/图片翻译器 (常规版)
// @namespace         https://cotrans.touhou.ai/userscript/#regular
// @version           0.8.0-bata.17
// @description       (WIP) Translate texts in images on Pixiv, Twitter, Misskey, Calckey
// @description:zh-CN (WIP) 一键翻译图片内文字，支持 Pixiv, Twitter, Misskey, Calckey
// @author            QiroNT
// @license           GPL-3.0
// @contributionURL   https://ko-fi.com/voilelabs
// @supportURL        https://discord.gg/975FRV8ca6
// @source            https://cotrans.touhou.ai/
// @include https://www.pixiv.net/*
// @match https://www.pixiv.net/*
// @include https://twitter.com/*
// @match https://twitter.com/*
// @include https://misskey.io/*
// @match https://misskey.io/*
// @include https://calckey.social/*
// @match https://calckey.social/*
// @include https://*
// @match https://*
// @connect pixiv.net
// @connect pximg.net
// @connect twitter.com
// @connect twimg.com
// @connect misskey.io
// @connect misskeyusercontent.com
// @connect s3.arkjp.net
// @connect nfs.pub
// @connect calckey.social
// @connect backblazeb2.com
// @connect dvd.moe
// @connect api.cotrans.touhou.ai
// @connect r2.cotrans.touhou.ai
// @connect cotrans-r2.moe.ci
// @connect *
// @grant GM.xmlHttpRequest
// @grant GM_xmlhttpRequest
// @grant GM.setValue
// @grant GM_setValue
// @grant GM.getValue
// @grant GM_getValue
// @grant GM.deleteValue
// @grant GM_deleteValue
// @grant GM.addValueChangeListener
// @grant GM_addValueChangeListener
// @grant GM.removeValueChangeListener
// @grant GM_removeValueChangeListener
// @grant window.onurlchange
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/437569/Cotrans%20MangaImage%20Translator%20%28Regular%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437569/Cotrans%20MangaImage%20Translator%20%28Regular%20Edition%29.meta.js
// ==/UserScript==

/* eslint-disable no-undef, unused-imports/no-unused-vars */
const VERSION = '0.8.0-bata.17'
const EDITION = 'regular'
let GMP
{
  // polyfill functions
  const GMPFunctionMap = {
    xmlHttpRequest: typeof GM_xmlhttpRequest !== 'undefined' ? GM_xmlhttpRequest : undefined,
    setValue: typeof GM_setValue !== 'undefined' ? GM_setValue : undefined,
    getValue: typeof GM_getValue !== 'undefined' ? GM_getValue : undefined,
    deleteValue: typeof GM_deleteValue !== 'undefined' ? GM_deleteValue : undefined,
    addValueChangeListener: typeof GM_addValueChangeListener !== 'undefined' ? GM_addValueChangeListener : undefined,
    removeValueChangeListener: typeof GM_removeValueChangeListener !== 'undefined' ? GM_removeValueChangeListener : undefined,
  }
  const xmlHttpRequest = GM.xmlHttpRequest.bind(GM) || GMPFunctionMap.xmlHttpRequest
  GMP = new Proxy(GM, {
    get(target, prop) {
      if (prop === 'xmlHttpRequest') {
        return (context) => {
          return new Promise((resolve, reject) => {
            xmlHttpRequest({
              ...context,
              onload(event) {
                context.onload?.()
                resolve(event)
              },
              onerror(event) {
                context.onerror?.()
                reject(event)
              },
            })
          })
        }
      }
      if (prop in target) {
        const v = target[prop]
        return typeof v === 'function' ? v.bind(target) : v
      }
      if (prop in GMPFunctionMap && typeof GMPFunctionMap[prop] === 'function')
        return GMPFunctionMap[prop]

      console.error(`[Cotrans Manga Translator] GM.${prop} isn't supported in your userscript engine and it's required by this script. This may lead to unexpected behavior.`)
    },
  })
}

(function () {
  'use strict';

  const equalFn = (a, b) => a === b;
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
  let Transition = null;
  let Listener = null;
  let Updates = null;
  let Effects = null;
  let ExecCount = 0;
  function createRoot(fn, detachedOwner) {
    const listener = Listener,
      owner = Owner,
      unowned = fn.length === 0,
      root = unowned ? UNOWNED : {
        owned: null,
        cleanups: null,
        context: null,
        owner: detachedOwner === undefined ? owner : detachedOwner
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
  function batch(fn) {
    return runUpdates(fn, false);
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
  function on(deps, fn, options) {
    const isArray = Array.isArray(deps);
    let prevInput;
    let defer = options && options.defer;
    return prevValue => {
      let input;
      if (isArray) {
        input = Array(deps.length);
        for (let i = 0; i < deps.length; i++) input[i] = deps[i]();
      } else input = deps();
      if (defer) {
        defer = false;
        return undefined;
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
    if (Owner === null) ;else if (Owner.cleanups === null) Owner.cleanups = [fn];else Owner.cleanups.push(fn);
    return fn;
  }
  function getListener() {
    return Listener;
  }
  function getOwner() {
    return Owner;
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
            if (false) ;
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
    const owner = Owner,
      listener = Listener,
      time = ExecCount;
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
      context: null,
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
    if (node.owned) {
      for (i = node.owned.length - 1; i >= 0; i--) cleanNode(node.owned[i]);
      node.owned = null;
    }
    if (node.cleanups) {
      for (i = node.cleanups.length - 1; i >= 0; i--) node.cleanups[i]();
      node.cleanups = null;
    }
    node.state = 0;
    node.context = null;
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
        i,
        j;
      newItems[$TRACK];
      return untrack(() => {
        let newLen = newItems.length,
          newIndices,
          newIndicesNext,
          temp,
          tempdisposers,
          tempIndexes,
          start,
          end,
          newEnd,
          item;
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
        } else if (len === 0) {
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
  function splitProps(props, ...keys) {
    if ($PROXY in props) {
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
  function Show(props) {
    const keyed = props.keyed;
    const condition = createMemo(() => props.when, undefined, {
      equals: (a, b) => keyed ? a === b : !a === !b
    });
    return createMemo(() => {
      const c = condition();
      if (c) {
        const child = props.children;
        const fn = typeof child === "function" && child.length > 0;
        return fn ? untrack(() => child(keyed ? c : () => {
          if (!untrack(condition)) throw narrowedError("Show");
          return props.when;
        })) : child;
      }
      return props.fallback;
    }, undefined, undefined);
  }
  function Switch(props) {
    let keyed = false;
    const equals = (a, b) => a[0] === b[0] && (keyed ? a[1] === b[1] : !a[1] === !b[1]) && a[2] === b[2];
    const conditions = children(() => props.children),
      evalConditions = createMemo(() => {
        let conds = conditions();
        if (!Array.isArray(conds)) conds = [conds];
        for (let i = 0; i < conds.length; i++) {
          const c = conds[i].when;
          if (c) {
            keyed = !!conds[i].keyed;
            return [i, c, conds[i]];
          }
        }
        return [-1];
      }, undefined, {
        equals
      });
    return createMemo(() => {
      const [index, when, cond] = evalConditions();
      if (index < 0) return props.fallback;
      const c = cond.children;
      const fn = typeof c === "function" && c.length > 0;
      return fn ? untrack(() => c(keyed ? when : () => {
        if (untrack(evalConditions)[0] !== index) throw narrowedError("Match");
        return cond.when;
      })) : c;
    }, undefined, undefined);
  }
  function Match(props) {
    return props;
  }

  const booleans = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"];
  const Properties = /*#__PURE__*/new Set(["className", "value", "readOnly", "formNoValidate", "isMap", "noModule", "playsInline", ...booleans]);
  const ChildProperties = /*#__PURE__*/new Set(["innerHTML", "textContent", "innerText", "children"]);
  const Aliases = /*#__PURE__*/Object.assign(Object.create(null), {
    className: "class",
    htmlFor: "for"
  });
  const PropAliases = /*#__PURE__*/Object.assign(Object.create(null), {
    class: "className",
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
    }
  });
  function getPropAlias(prop, tagName) {
    const a = PropAliases[prop];
    return typeof a === "object" ? a[tagName] ? a["$"] : undefined : a;
  }
  const DelegatedEvents = /*#__PURE__*/new Set(["beforeinput", "click", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"]);
  const SVGElements = /*#__PURE__*/new Set(["altGlyph", "altGlyphDef", "altGlyphItem", "animate", "animateColor", "animateMotion", "animateTransform", "circle", "clipPath", "color-profile", "cursor", "defs", "desc", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "font", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignObject", "g", "glyph", "glyphRef", "hkern", "image", "line", "linearGradient", "marker", "mask", "metadata", "missing-glyph", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "set", "stop", "svg", "switch", "symbol", "text", "textPath", "tref", "tspan", "use", "view", "vkern"]);
  const SVGNamespace = {
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace"
  };
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
  function template(html, isCE, isSVG) {
    let node;
    const create = () => {
      const t = document.createElement("template");
      t.innerHTML = html;
      return isSVG ? t.content.firstChild.firstChild : t.content.firstChild;
    };
    const fn = isCE ? () => untrack(() => document.importNode(node || (node = create()), true)) : () => (node || (node = create())).cloneNode(true);
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
    } else node.addEventListener(name, handler);
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
    if (marker !== undefined && !initial) initial = [];
    if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
    createRenderEffect(current => insertExpression(parent, accessor(), current, marker), initial);
  }
  function assign(node, props, isSVG, skipChildren, prevProps = {}, skipRef = false) {
    props || (props = {});
    for (const prop in prevProps) {
      if (!(prop in props)) {
        if (prop === "children") continue;
        prevProps[prop] = assignProp(node, prop, null, prevProps[prop], isSVG, skipRef);
      }
    }
    for (const prop in props) {
      if (prop === "children") {
        if (!skipChildren) insertExpression(node, props.children);
        continue;
      }
      const value = props[prop];
      prevProps[prop] = assignProp(node, prop, value, prevProps[prop], isSVG, skipRef);
    }
  }
  function toPropertyName(name) {
    return name.toLowerCase().replace(/-([a-z])/g, (_, w) => w.toUpperCase());
  }
  function toggleClassKey(node, key, value) {
    const classNames = key.trim().split(/\s+/);
    for (let i = 0, nameLen = classNames.length; i < nameLen; i++) node.classList.toggle(classNames[i], value);
  }
  function assignProp(node, prop, value, prev, isSVG, skipRef) {
    let isCE, isProp, isChildProp, propAlias, forceProp;
    if (prop === "style") return style(node, value, prev);
    if (prop === "classList") return classList(node, value, prev);
    if (value === prev) return prev;
    if (prop === "ref") {
      if (!skipRef) value(node);
    } else if (prop.slice(0, 3) === "on:") {
      const e = prop.slice(3);
      prev && node.removeEventListener(e, prev);
      value && node.addEventListener(e, value);
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
    } else if ((forceProp = prop.slice(0, 5) === "prop:") || (isChildProp = ChildProperties.has(prop)) || !isSVG && ((propAlias = getPropAlias(prop, node.tagName)) || (isProp = Properties.has(prop))) || (isCE = node.nodeName.includes("-"))) {
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
    const key = `$$${e.type}`;
    let node = e.composedPath && e.composedPath()[0] || e.target;
    if (e.target !== node) {
      Object.defineProperty(e, "target", {
        configurable: true,
        value: node
      });
    }
    Object.defineProperty(e, "currentTarget", {
      configurable: true,
      get() {
        return node || document;
      }
    });
    while (node) {
      const handler = node[key];
      if (handler && !node.disabled) {
        const data = node[`${key}Data`];
        data !== undefined ? handler.call(node, data, e) : handler.call(node, e);
        if (e.cancelBubble) return;
      }
      node = node._$host || node.parentNode || node.host;
    }
  }
  function insertExpression(parent, value, current, marker, unwrapArray) {
    while (typeof current === "function") current = current();
    if (value === current) return current;
    const t = typeof value,
      multi = marker !== undefined;
    parent = multi && current[0] && current[0].parentNode || parent;
    if (t === "string" || t === "number") {
      if (t === "number") value = value.toString();
      if (multi) {
        let node = current[0];
        if (node && node.nodeType === 3) {
          node.data = value;
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
    } else console.warn(`Unrecognized value. Skipped inserting`, value);
    return current;
  }
  function normalizeIncomingArray(normalized, array, current, unwrap) {
    let dynamic = false;
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i],
        prev = current && current[i],
        t;
      if (item == null || item === true || item === false) ;else if ((t = typeof item) === "object" && item.nodeType) {
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
  function createElement(tagName, isSVG = false) {
    return isSVG ? document.createElementNS(SVG_NAMESPACE, tagName) : document.createElement(tagName);
  }
  function Dynamic(props) {
    const [p, others] = splitProps(props, ["component"]);
    const cached = createMemo(() => p.component);
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
          const el = createElement(component, isSvg);
          spread(el, others, isSvg);
          return el;
      }
    });
  }

  var throttle = (callback, wait) => {
    let isThrottled = false,
      timeoutId,
      lastArgs;
    const throttled = (...args) => {
      lastArgs = args;
      if (isThrottled) return;
      isThrottled = true;
      timeoutId = setTimeout(() => {
        callback(...lastArgs);
        isThrottled = false;
      }, wait);
    };
    const clear = () => {
      clearTimeout(timeoutId);
      isThrottled = false;
    };
    if (getOwner()) onCleanup(clear);
    return Object.assign(throttled, {
      clear
    });
  };

  var access = v => typeof v === "function" && !v.length ? v() : v;
  var asArray$1 = value => Array.isArray(value) ? value : value ? [value] : [];
  var tryOnCleanup = onCleanup;

  function createGMSignal(key, initialValue) {
    const [signal, setSignal] = createSignal(initialValue);
    let listener;
    Promise.resolve().then(() => GMP.addValueChangeListener?.(key, (name, oldValue, newValue, remote) => {
      if (name === key && (remote === void 0 || remote === true)) read(newValue);
    })).then(l => listener = l);
    let effectPaused = false;
    createEffect(on(signal, () => {
      if (effectPaused) return;
      if (signal() == null) {
        GMP.deleteValue(key);
        effectPaused = true;
        setSignal(() => initialValue);
        effectPaused = false;
      } else {
        GMP.setValue(key, signal());
      }
    }, {
      defer: true
    }));
    async function read(newValue) {
      effectPaused = true;
      const rawValue = newValue ?? (await GMP.getValue(key));
      if (rawValue == null) setSignal(() => initialValue);else setSignal(() => rawValue);
      effectPaused = false;
    }
    const [isReady, setIsReady] = createSignal(false);
    signal.isReady = isReady;
    signal.ready = read().then(() => {
      setIsReady(true);
    });
    onCleanup(() => {
      if (listener) GMP.removeValueChangeListener?.(listener);
    });
    return [signal, setSignal];
  }
  const [detectionResolution, setDetectionResolution] = createGMSignal("detectionResolution", "M");
  const [textDetector, setTextDetector] = createGMSignal("textDetector", "default");
  const [translatorService, setTranslatorService] = createGMSignal("translator", "gpt3.5");
  const [renderTextOrientation, setRenderTextOrientation] = createGMSignal("renderTextOrientation", "auto");
  const [targetLang, setTargetLang] = createGMSignal("targetLang", "");
  const [scriptLang, setScriptLang] = createGMSignal("scriptLanguage", "");
  const [keepInstances, setKeepInstances] = createGMSignal("keepInstances", "until-reload");
  const storageReady = Promise.all([detectionResolution.ready, textDetector.ready, translatorService.ready, renderTextOrientation.ready, targetLang.ready, scriptLang.ready, keepInstances.ready]);

  var data$1 = { common:{ source:{ "download-image":"正在拉取原图",
        "download-image-progress":"正在拉取原图({progress})",
        "download-image-error":"拉取原图出错" },
      client:{ submit:"正在提交翻译",
        "submit-progress":"正在提交翻译({progress})",
        "submit-final":"等待图片转存",
        "submit-error":"提交翻译出错",
        "download-image":"正在下载图片",
        "download-image-progress":"正在下载图片({progress})",
        "download-image-error":"下载图片出错",
        resize:"正在缩放图片",
        merging:"正在合并图层" },
      status:{ "default":"未知状态",
        pending:"正在等待",
        "pending-pos":"正在等待，列队还有 {pos} 张图片",
        downloading:"正在传输图片",
        preparing:"等待空闲窗口",
        colorizing:"正在上色",
        upscaling:"正在放大图片",
        downscaling:"正在缩小图片",
        detection:"正在检测文本",
        ocr:"正在识别文本",
        textline_merge:"正在整合文本",
        "mask-generation":"正在生成文本掩码",
        inpainting:"正在修补图片",
        translating:"正在翻译文本",
        rendering:"正在渲染文本",
        finished:"正在整理结果",
        saved:"保存结果",
        saving:"正在保存结果",
        uploading:"正在传输结果",
        error:"翻译出错",
        "error-download":"传输图片失败",
        "error-upload":"传输结果失败",
        "error-lang":"你选择的翻译服务不支持你选择的语言",
        "error-translating":"翻译服务没有返回任何文本",
        "skip-no-regions":"图片中没有检测到文本区域",
        "skip-no-text":"图片中没有检测到文本",
        "error-with-id":"翻译出错 (ID: {id})" },
      control:{ translate:"翻译",
        batch:"翻译全部 ({count})",
        reset:"还原" },
      batch:{ progress:"翻译中 ({count}/{total})",
        finish:"翻译完成",
        error:"翻译完成(有失败)" } },
    settings:{ title:"Cotrans 图片翻译器设置",
      "inline-options-title":"设置当前翻译",
      "detection-resolution":"文本扫描清晰度",
      "text-detector":"文本扫描器",
      "text-detector-options":{ "default":"默认" },
      translator:"翻译服务",
      "render-text-orientation":"渲染字体方向",
      "render-text-orientation-options":{ auto:"跟随原文本",
        horizontal:"仅限水平",
        vertical:"仅限垂直" },
      "target-language":"翻译语言",
      "target-language-options":{ auto:"跟随网页语言" },
      "script-language":"用户脚本语言",
      "script-language-options":{ auto:"跟随网页语言" },
      reset:"重置所有设置",
      "detection-resolution-desc":"设置检测图片文本所用的清晰度，小文字适合使用更高的清晰度。",
      "text-detector-desc":"设置使用的文本扫描器。",
      "translator-desc":"设置翻译图片所用的翻译服务。",
      "render-text-orientation-desc":"设置嵌字的文本方向。",
      "target-language-desc":"设置图片翻译后的语言。",
      "script-language-desc":"设置此用户脚本的语言。",
      "translator-options":{ none:"None (删除文字)" },
      "keep-instances-options":{ "until-reload":"直到页面刷新",
        "until-navigate":"直到下次跳转" },
      "keep-instances":"保留翻译进度",
      "keep-instances-desc":"设置翻译进度的保留时间。 翻译进度即图片的翻译状态和翻译结果。 保留更多的翻译进度会占用更多的内存。",
      "force-retry":"强制重试 (忽略缓存)" },
    sponsor:{ text:"制作不易，请考虑赞助我们！" } };
  data$1.common;
  data$1.settings;
  data$1.sponsor;

  var data = { common:{ source:{ "download-image":"Downloading original image",
        "download-image-progress":"Downloading original image ({progress})",
        "download-image-error":"Error during original image download" },
      client:{ submit:"Submitting translation",
        "submit-progress":"Submitting translation ({progress})",
        "submit-final":"Waiting for image transpile",
        "submit-error":"Error during translation submission",
        "download-image":"Downloading translated image",
        "download-image-progress":"Downloading translated image ({progress})",
        "download-image-error":"Error during translated image download",
        resize:"Resizing image",
        merging:"Merging layers" },
      status:{ "default":"Unknown status",
        pending:"Pending",
        "pending-pos":"Pending, {pos} in queue",
        downloading:"Transferring image",
        preparing:"Waiting for idle window",
        colorizing:"Colorizing",
        upscaling:"Upscaling",
        downscaling:"Downscaling",
        detection:"Detecting text",
        ocr:"Scanning text",
        textline_merge:"Merging text lines",
        "mask-generation":"Generating mask",
        inpainting:"Inpainting",
        translating:"Translating",
        rendering:"Rendering",
        finished:"Finishing",
        saved:"Saved",
        saving:"Saving result",
        uploading:"Transferring result",
        error:"Error during translation",
        "error-download":"Image transfer failed",
        "error-upload":"Result transfer failed",
        "error-lang":"The target language is not supported by the chosen translator",
        "error-translating":"Did not get any text back from the text translation service",
        "skip-no-regions":"No text regions detected in the image",
        "skip-no-text":"No text detected in the image",
        "error-with-id":"Error during translation (ID: {id})" },
      control:{ translate:"Translate",
        batch:"Translate all ({count})",
        reset:"Reset" },
      batch:{ progress:"Translating ({count}/{total} finished)",
        finish:"Translation finished",
        error:"Translation finished with errors" } },
    settings:{ "detection-resolution":"Text detection resolution",
      "render-text-orientation":"Render text orientation",
      "render-text-orientation-options":{ auto:"Follow source",
        horizontal:"Horizontal only",
        vertical:"Vertical only" },
      reset:"Reset Settings",
      "target-language":"Translate target language",
      "target-language-options":{ auto:"Follow website" },
      "text-detector":"Text detector",
      "text-detector-options":{ "default":"Default" },
      title:"Cotrans Manga Translator Settings",
      translator:"Translator",
      "script-language":"Userscript language",
      "script-language-options":{ auto:"Follow website language" },
      "inline-options-title":"Current Settings",
      "detection-resolution-desc":"The resolution used to scan texts on an image, higher value are better suited for smaller texts.",
      "script-language-desc":"Language of this userscript.",
      "render-text-orientation-desc":"Overwrite the orientation of texts rendered in the translated image.",
      "target-language-desc":"The language that images are translated to.",
      "text-detector-desc":"The detector used to scan texts in an image.",
      "translator-desc":"The translate service used to translate texts.",
      "translator-options":{ none:"None (remove texts)" },
      "keep-instances-options":{ "until-reload":"Until page reload",
        "until-navigate":"Until next navigation" },
      "keep-instances":"Keep translation instances",
      "keep-instances-desc":"How long before a translation instance is disposed. A translation instance includes the translation state of an image, that is, whether the image is translated or not, and the translation result. Keeping more translation instances will result in more memory consumption.",
      "force-retry":"Force retry (ignore cache)" },
    sponsor:{ text:"If you find this script helpful, please consider supporting us!" } };
  data.common;
  data.settings;
  data.sponsor;

  const messages = {
    "zh-CN": data$1,
    "en-US": data
  };
  function tryMatchLang(lang2) {
    if (lang2.startsWith("zh")) return "zh-CN";
    if (lang2.startsWith("en")) return "en-US";
    return "en-US";
  }
  const [realLang, setRealLang] = createSignal(navigator.language);
  const lang = createMemo(() => scriptLang() || tryMatchLang(realLang()));
  function t$1(key_, props = {}) {
    return createMemo(() => {
      const key = access(key_);
      const segments = key.split(".");
      const msg = segments.reduce((obj, k) => obj[k], messages[lang()]) ?? segments.reduce((obj, k) => obj[k], messages["zh-CN"]);
      if (!msg) return key;
      return msg.replace(/\{([^}]+)\}/g, (_, k) => String(access(access(props)[k])) ?? "");
    });
  }
  let langEL;
  let langObserver;
  function changeLangEl(el) {
    if (langEL === el) return;
    if (langObserver) langObserver.disconnect();
    langObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "lang") {
          const target = mutation.target;
          if (target.lang) setRealLang(target.lang);
          break;
        }
      }
    });
    langObserver.observe(el, {
      attributes: true
    });
    langEL = el;
    setRealLang(el.lang);
  }
  function BCP47ToISO639(code) {
    try {
      const lo = new Intl.Locale(code);
      switch (lo.language) {
        case "zh":
          {
            switch (lo.script) {
              case "Hans":
                return "CHS";
              case "Hant":
                return "CHT";
            }
            switch (lo.region) {
              case "CN":
                return "CHS";
              case "HK":
              case "TW":
                return "CHT";
            }
            return "CHS";
          }
        case "ja":
          return "JPN";
        case "en":
          return "ENG";
        case "ko":
          return "KOR";
        case "vi":
          return "VIE";
        case "cs":
          return "CSY";
        case "nl":
          return "NLD";
        case "fr":
          return "FRA";
        case "de":
          return "DEU";
        case "hu":
          return "HUN";
        case "it":
          return "ITA";
        case "pl":
          return "PLK";
        case "pt":
          return "PTB";
        case "ro":
          return "ROM";
        case "ru":
          return "RUS";
        case "es":
          return "ESP";
        case "tr":
          return "TRK";
        case "uk":
          return "UKR";
      }
      return "ENG";
    } catch (e) {
      return "ENG";
    }
  }

  DelegatedEvents.clear();
  function createScopedInstance(cb) {
    return createRoot(dispose => {
      const instance = cb();
      return {
        ...instance,
        dispose
      };
    });
  }
  let currentURL;
  let translator$3;
  let settingsInjector$2;
  async function start(translators, settingsInjectors) {
    await storageReady;
    async function onUpdate() {
      await new Promise(resolve => (queueMicrotask ?? setTimeout)(resolve));
      if (currentURL !== location.href) {
        currentURL = location.href;
        changeLangEl(document.documentElement);
        if (translator$3?.canKeep?.(currentURL)) {
          translator$3.onURLChange?.(currentURL);
        } else {
          translator$3?.dispose();
          translator$3 = void 0;
          const url = new URL(location.href);
          const matched = translators.find(t => t.match(url));
          if (matched) translator$3 = createScopedInstance(matched.mount);
        }
        if (settingsInjector$2?.canKeep?.(currentURL)) {
          settingsInjector$2.onURLChange?.(currentURL);
        } else {
          settingsInjector$2?.dispose();
          settingsInjector$2 = void 0;
          const url = new URL(location.href);
          const matched = settingsInjectors.find(t => t.match(url));
          if (matched) settingsInjector$2 = createScopedInstance(matched.mount);
        }
      }
    }
    if (window.onurlchange === null) {
      window.addEventListener("urlchange", onUpdate);
      const pushState = history.pushState;
      window.history.pushState = function () {
        pushState.apply(this, arguments);
        if (typeof arguments[2] === "string" && arguments[2].startsWith("#")) onUpdate();
      };
    } else {
      const installObserver = new MutationObserver(throttle(onUpdate, 200));
      installObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
    onUpdate();
  }

  // src/index.ts
  var triggerOptions = {
    equals: false
  };
  var triggerCacheOptions = triggerOptions;
  var TriggerCache = class {
    #map;
    constructor(mapConstructor = Map) {
      this.#map = new mapConstructor();
    }
    dirty(key) {
      this.#map.get(key)?.$$();
    }
    track(key) {
      if (!getListener()) return;
      let trigger = this.#map.get(key);
      if (!trigger) {
        const [$, $$] = createSignal(void 0, triggerCacheOptions);
        this.#map.set(key, trigger = {
          $,
          $$,
          n: 1
        });
      } else trigger.n++;
      onCleanup(() => {
        if (trigger.n-- === 1) queueMicrotask(() => trigger.n === 0 && this.#map.delete(key));
      });
      trigger.$();
    }
  };

  // src/index.ts
  var $KEYS = Symbol("track-keys");
  var ReactiveMap = class extends Map {
    #keyTriggers = new TriggerCache();
    #valueTriggers = new TriggerCache();
    constructor(initial) {
      super();
      if (initial) for (const v of initial) super.set(v[0], v[1]);
    }
    // reads
    has(key) {
      this.#keyTriggers.track(key);
      return super.has(key);
    }
    get(key) {
      this.#valueTriggers.track(key);
      return super.get(key);
    }
    get size() {
      this.#keyTriggers.track($KEYS);
      return super.size;
    }
    keys() {
      this.#keyTriggers.track($KEYS);
      return super.keys();
    }
    values() {
      this.#keyTriggers.track($KEYS);
      for (const v of super.keys()) this.#valueTriggers.track(v);
      return super.values();
    }
    entries() {
      this.#keyTriggers.track($KEYS);
      for (const v of super.keys()) this.#valueTriggers.track(v);
      return super.entries();
    }
    // writes
    set(key, value) {
      batch(() => {
        if (super.has(key)) {
          if (super.get(key) === value) return;
        } else {
          this.#keyTriggers.dirty(key);
          this.#keyTriggers.dirty($KEYS);
        }
        this.#valueTriggers.dirty(key);
        super.set(key, value);
      });
      return this;
    }
    delete(key) {
      const r = super.delete(key);
      if (r) {
        batch(() => {
          this.#keyTriggers.dirty(key);
          this.#keyTriggers.dirty($KEYS);
          this.#valueTriggers.dirty(key);
        });
      }
      return r;
    }
    clear() {
      if (super.size) {
        batch(() => {
          for (const v of super.keys()) {
            this.#keyTriggers.dirty(v);
            this.#valueTriggers.dirty(v);
          }
          super.clear();
          this.#keyTriggers.dirty($KEYS);
        });
      }
    }
    // callback
    forEach(callbackfn) {
      this.#keyTriggers.track($KEYS);
      super.forEach((value, key) => callbackfn(value, key, this));
    }
    [Symbol.iterator]() {
      return this.entries();
    }
  };

  // src/index.ts
  function createMutationObserver(initial, b, c) {
    let defaultOptions, callback;
    const isSupported = typeof window !== "undefined" && "MutationObserver" in window;
    if (typeof b === "function") {
      defaultOptions = {};
      callback = b;
    } else {
      defaultOptions = b;
      callback = c;
    }
    const instance = isSupported ? new MutationObserver(callback) : void 0;
    const add = (el, options) => instance?.observe(el, access(options) ?? defaultOptions);
    const start = () => {
      asArray$1(access(initial)).forEach(item => {
        item instanceof Node ? add(item, defaultOptions) : add(item[0], item[1]);
      });
    };
    const stop = () => instance?.disconnect();
    onMount(start);
    onCleanup(stop);
    return [add, {
      start,
      stop,
      instance,
      isSupported
    }];
  }

  function toClassName(rule) {
    return [...rule.v, (rule.i ? '!' : '') + rule.n].join(':');
  }
  function format(rules, seperator = ',') {
    return rules.map(toClassName).join(seperator);
  }
  /**
   * @internal
   */
  let escape = 'undefined' != typeof CSS && CSS.escape || (
  // Simplified: escaping only special characters
  // Needed for NodeJS and Edge <79 (https://caniuse.com/mdn-api_css_escape)
  className => className.
  // Simplifed escape testing only for chars that we know happen to be in tailwind directives
  replace(/[!"'`*+.,;:\\/<=>?@#$%&^|~()[\]{}]/g, '\\$&').
  // If the character is the first character and is in the range [0-9] (2xl, ...)
  // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
  replace(/^\d/, '\\3$& '));
  // Based on https://stackoverflow.com/a/52171480
  /**
   * @group Configuration
   * @param value
   * @returns
   */
  function hash(value) {
    // eslint-disable-next-line no-var
    for (var h = 9, index = value.length; index--;) h = Math.imul(h ^ value.charCodeAt(index), 0x5f356495);
    return '#' + ((h ^ h >>> 9) >>> 0).toString(36);
  }
  /**
   * @internal
   * @param screen
   * @param prefix
   * @returns
   */
  function mql(screen, prefix = '@media ') {
    return prefix + asArray(screen).map(screen => {
      return 'string' == typeof screen && (screen = {
        min: screen
      }), screen.raw || Object.keys(screen).map(feature => `(${feature}-width:${screen[feature]})`).join(' and ');
    }).join(',');
  }
  /**
   * @internal
   * @param value
   * @returns
   */
  function asArray(value = []) {
    return Array.isArray(value) ? value : null == value ? [] : [value];
  }
  /**
   * @internal
   * @param value
   * @returns
   */
  function identity(value) {
    return value;
  }
  /**
   * @internal
   */
  function noop() {}
  // no-op
  // Based on https://github.com/kripod/otion
  // License MIT
  // export const enum Shifts {
  //   darkMode = 30,
  //   layer = 27,
  //   screens = 26,
  //   responsive = 22,
  //   atRules = 18,
  //   variants = 0,
  // }
  let Layer = {
    /**
    * 1. `default` (public)
    */
    d: /* efaults */0,
    /* Shifts.layer */ /**
                       * 2. `base` (public) — for things like reset rules or default styles applied to plain HTML elements.
                       */b: /* ase */134217728,
    /* Shifts.layer */ /**
                       * 3. `components` (public, used by `style()`) — is for class-based styles that you want to be able to override with utilities.
                       */c: /* omponents */268435456,
    /* Shifts.layer */ // reserved for style():
    // - props: 0b011
    // - when: 0b100
    /**
    * 6. `aliases` (public, used by `apply()`) — `~(...)`
    */a: /* liases */671088640,
    /* Shifts.layer */ /**
                       * 6. `utilities` (public) — for small, single-purpose classes
                       */u: /* tilities */805306368,
    /* Shifts.layer */ /**
                       * 7. `overrides` (public, used by `css()`)
                       */o: /* verrides */939524096
  };
  /*
  To set a bit: n |= mask;
  To clear a bit: n &= ~mask;
  To test if a bit is set: (n & mask)

  Bit shifts for the primary bits:

  | bits | trait                                                   | shift |
  | ---- | ------------------------------------------------------- | ----- |
  | 1    | dark mode                                               | 30    |
  | 3    | layer: preflight, global, components, utilities, css    | 27    |
  | 1    | screens: is this a responsive variation of a rule       | 26    |
  | 4    | responsive based on min-width, max-width or width       | 22    |
  | 4    | at-rules                                                | 18    |
  | 18   | pseudo and group variants                               | 0     |

  Layer: 0 - 7: 3 bits
    - defaults: 0 << 27
    - base: 1 << 27
    - components: 2 << 27
    - variants: 3 << 27
    - joints: 4 << 27
    - aliases: 5 << 27
    - utilities: 6 << 27
    - overrides: 7 << 27

  These are calculated by serialize and added afterwards:

  | bits | trait                               |
  | ---- | ----------------------------------- |
  | 4    | number of selectors (descending)    |
  | 4    | number of declarations (descending) |
  | 4    | greatest precedence of properties   |

  These are added by shifting the primary bits using multiplication as js only
  supports bit shift up to 32 bits.
  */ // Colon and dash count of string (ascending)
  function seperatorPrecedence(string) {
    return string.match(/[-=:;]/g)?.length || 0;
  }
  function atRulePrecedence(css) {
    // 0 - 15: 4 bits (max 144rem or 2304px)
    // rem -> bit
    // <20 ->  0 (<320px)
    //  20 ->  1 (320px)
    //  24 ->  2 (384px)
    //  28 ->  3 (448px)
    //  32 ->  4 (512px)
    //  36 ->  5 (576px)
    //  42 ->  6 (672px)
    //  48 ->  7 (768px)
    //  56 ->  8 (896px)
    //  64 ->  9 (1024px)
    //  72 -> 10 (1152px)
    //  80 -> 11 (1280px)
    //  96 -> 12 (1536px)
    // 112 -> 13 (1792px)
    // 128 -> 14 (2048px)
    // 144 -> 15 (2304px)
    // https://www.dcode.fr/function-equation-finder
    return Math.min(/(?:^|width[^\d]+)(\d+(?:.\d+)?)(p)?/.test(css) ? Math.max(0, 29.63 * (+RegExp.$1 / (RegExp.$2 ? 15 : 1)) ** 0.137 - 43) : 0, 15) << 22 | /* Shifts.responsive */Math.min(seperatorPrecedence(css), 15) << 18;
  }
  /* Shifts.atRules */ // Pesudo variant presedence
  // Chars 3 - 8: Uniquely identifies a pseudo selector
  // represented as a bit set for each relevant value
  // 18 bits: one for each variant plus one for unknown variants
  //
  // ':group-*' variants are normalized to their native pseudo class (':group-hover' -> ':hover')
  // as they already have a higher selector presedence due to the add '.group' ('.group:hover .group-hover:...')
  // Sources:
  // - https://bitsofco.de/when-do-the-hover-focus-and-active-pseudo-classes-apply/#orderofstyleshoverthenfocusthenactive
  // - https://developer.mozilla.org/docs/Web/CSS/:active#Active_links
  // - https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js#L931
  let PRECEDENCES_BY_PSEUDO_CLASS = [/* fi */'rst-c', /* hild: 0 */ /* la */'st-ch', /* ild: 1 */ // even and odd use: nth-child
  /* nt */'h-chi', /* ld: 2 */ /* an */'y-lin', /* k: 3 */ /* li */'nk', /* : 4 */ /* vi */'sited', /* : 5 */ /* ch */'ecked', /* : 6 */ /* em */'pty', /* : 7 */ /* re */'ad-on', /* ly: 8 */ /* fo */'cus-w', /* ithin : 9 */ /* ho */'ver', /* : 10 */ /* fo */'cus', /* : 11 */ /* fo */'cus-v', /* isible : 12 */ /* ac */'tive', /* : 13 */ /* di */'sable', /* d : 14 */ /* op */'tiona', /* l: 15 */ /* re */'quire'];
  /** The name to use for `&` expansion in selectors. Maybe empty for at-rules like `@import`, `@font-face`, `@media`, ... */ /** The calculated precedence taking all variants into account. */ /** The rulesets (selectors and at-rules). expanded variants `@media ...`, `@supports ...`, `&:focus`, `.dark &` */ /** Is this rule `!important` eg something like `!underline` or `!bg-red-500` or `!red-500` */
  function convert({
    n: name,
    i: important,
    v: variants = []
  }, context, precedence, conditions) {
    name && (name = toClassName({
      n: name,
      i: important,
      v: variants
    }));
    conditions = [...asArray(conditions)];
    for (let variant of variants) {
      let screen = context.theme('screens', variant);
      for (let condition of asArray(screen && mql(screen) || context.v(variant))) {
        var /* d: 16 */selector;
        conditions.push(condition);
        precedence |= screen ? 67108864 | /* Shifts.screens */atRulePrecedence(condition) : 'dark' == variant ? 1073741824 : /* Shifts.darkMode */'@' == condition[0] ? atRulePrecedence(condition) : (selector = condition,
        // use first found pseudo-class
        1 << ~(/:([a-z-]+)/.test(selector) && ~PRECEDENCES_BY_PSEUDO_CLASS.indexOf(RegExp.$1.slice(2, 7)) || -18));
      }
    }
    return {
      n: name,
      p: precedence,
      r: conditions,
      i: important
    };
  }
  let registry = new Map();
  function stringify$1(rule) {
    if (rule.d) {
      let groups = [],
        selector = replaceEach(
        // merge all conditions into a selector string
        rule.r.reduce((selector, condition) => {
          return '@' == condition[0] ? (groups.push(condition), selector) :
          // Go over the selector and replace the matching multiple selectors if any
          condition ? replaceEach(selector, selectorPart => replaceEach(condition,
          // If the current condition has a nested selector replace it
          conditionPart => {
            let mergeMatch = /(:merge\(.+?\))(:[a-z-]+|\\[.+])/.exec(conditionPart);
            if (mergeMatch) {
              let selectorIndex = selectorPart.indexOf(mergeMatch[1]);
              return ~selectorIndex ?
              // [':merge(.group):hover .rule', ':merge(.group):focus &'] -> ':merge(.group):focus:hover .rule'
              // ':merge(.group)' + ':focus' + ':hover .rule'
              selectorPart.slice(0, selectorIndex) + mergeMatch[0] + selectorPart.slice(selectorIndex + mergeMatch[1].length) :
              // [':merge(.peer):focus~&', ':merge(.group):hover &'] -> ':merge(.peer):focus~:merge(.group):hover &'
              replaceReference(selectorPart, conditionPart);
            }
            // Return the current selector with the key matching multiple selectors if any
            return replaceReference(conditionPart, selectorPart);
          })) : selector;
        }, '&'),
        // replace '&' with rule name or an empty string
        selectorPart => replaceReference(selectorPart, rule.n ? '.' + escape(rule.n) : ''));
      return selector && groups.push(selector.replace(/:merge\((.+?)\)/g, '$1')), groups.reduceRight((body, grouping) => grouping + '{' + body + '}', rule.d);
    }
  }
  function replaceEach(selector, iteratee) {
    return selector.replace(/ *((?:\(.+?\)|\[.+?\]|[^,])+) *(,|$)/g, (_, selectorPart, comma) => iteratee(selectorPart) + comma);
  }
  function replaceReference(selector, reference) {
    return selector.replace(/&/g, reference);
  }
  let collator = new Intl.Collator('en', {
    numeric: true
  });
  /** The calculated precedence taking all variants into account. */ /* The precedence of the properties within {@link d}. */ /** The name to use for `&` expansion in selectors. Maybe empty for at-rules like `@import`, `@font-face`, `@media`, ... */ /**
                                                                                                                                                                                                                                                          * Find the array index of where to add an element to keep it sorted.
                                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                                          * @returns The insertion index
                                                                                                                                                                                                                                                          */
  function sortedInsertionIndex(array, element) {
    // Find position using binary search
    // eslint-disable-next-line no-var
    for (var low = 0, high = array.length; low < high;) {
      let pivot = high + low >> 1;
      0 >= compareTwindRules(array[pivot], element) ? low = pivot + 1 : high = pivot;
    }
    return high;
  }
  function compareTwindRules(a, b) {
    // base and overrides (css) layers are kept in order they are declared
    let layer = a.p & Layer.o;
    return layer == (b.p & Layer.o) && (layer == Layer.b || layer == Layer.o) ? 0 : a.p - b.p || a.o - b.o || collator.compare(byModifier(a.n), byModifier(b.n)) || collator.compare(byName(a.n), byName(b.n));
  }
  function byModifier(s) {
    return (s || '').split(/:/).pop().split('/').pop() || '\x00';
  }
  function byName(s) {
    return (s || '').replace(/\W/g, c => String.fromCharCode(127 + c.charCodeAt(0))) + '\x00';
  }
  function parseColorComponent(chars, factor) {
    return Math.round(parseInt(chars, 16) * factor);
  }
  /**
   * @internal
   * @param color
   * @param options
   * @returns
   */
  function toColorValue(color, options = {}) {
    if ('function' == typeof color) return color(options);
    let {
        opacityValue = '1',
        opacityVariable
      } = options,
      opacity = opacityVariable ? `var(${opacityVariable})` : opacityValue;
    if (color.includes('<alpha-value>')) return color.replace('<alpha-value>', opacity);
    // rgb hex: #0123 and #001122
    if ('#' == color[0] && (4 == color.length || 7 == color.length)) {
      let size = (color.length - 1) / 3,
        factor = [17, 1, 0.062272][size - 1];
      return `rgba(${[parseColorComponent(color.substr(1, size), factor), parseColorComponent(color.substr(1 + size, size), factor), parseColorComponent(color.substr(1 + 2 * size, size), factor), opacity]})`;
    }
    return '1' == opacity ? color : '0' == opacity ? '#0000' :
    // convert rgb and hsl to alpha variant
    color.replace(/^(rgb|hsl)(\([^)]+)\)$/, `$1a$2,${opacity})`);
  }
  function serialize(style, rule, context, precedence, conditions = []) {
    return function serialize$(style, {
      n: name,
      p: precedence,
      r: conditions = [],
      i: important
    }, context) {
      let rules = [],
        // The generated declaration block eg body of the css rule
        declarations = '',
        // This ensures that 'border-top-width' has a higher precedence than 'border-top'
        maxPropertyPrecedence = 0,
        // More specific utilities have less declarations and a higher precedence
        numberOfDeclarations = 0;
      for (let key in style || {}) {
        var layer,
          // https://github.com/kripod/otion/blob/main/packages/otion/src/propertyMatchers.ts
          // "+1": [
          // 	/* ^border-.*(w|c|sty) */
          // 	"border-.*(width,color,style)",
          // 	/* ^[tlbr].{2,4}m?$ */
          // 	"top",
          // 	"left",
          // 	"bottom",
          // 	"right",
          // 	/* ^c.{7}$ */
          // 	"continue",
          // 	/* ^c.{8}$ */
          // 	"container",
          // ],
          // "-1": [
          // 	/* ^[fl].{5}l */
          // 	"flex-flow",
          // 	"line-clamp",
          // 	/* ^g.{8}$ */
          // 	"grid-area",
          // 	/* ^pl */
          // 	"place-content",
          // 	"place-items",
          // 	"place-self",
          // ],
          // group: 1 => +1
          // group: 2 => -1
          // 0 - 15 => 4 bits
          // Ignore vendor prefixed and custom properties
          property;
        let value = style[key];
        if ('@' == key[0]) {
          // at rules: https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
          if (!value) continue;
          // @apply ...;
          if ('a' == key[1]) {
            rules.push(...translateWith(name, precedence, parse('' + value), context, precedence, conditions, important, true));
            continue;
          }
          // @layer <layer>
          if ('l' == key[1]) {
            for (let css of asArray(value)) rules.push(...serialize$(css, {
              n: name,
              p: (layer = Layer[key[7]],
              // Set layer (first reset, than set)
              precedence & ~Layer.o | layer),
              r: 'd' == key[7] ? [] : conditions,
              i: important
            }, context));
            continue;
          }
          // @import
          if ('i' == key[1]) {
            rules.push(...asArray(value).map(value => ({
              // before all layers
              p: -1,
              o: 0,
              r: [],
              d: key + ' ' + value
            })));
            continue;
          }
          // @keyframes
          if ('k' == key[1]) {
            // Use defaults layer
            rules.push({
              p: Layer.d,
              o: 0,
              r: [key],
              d: serialize$(value, {
                p: Layer.d
              }, context).map(stringify$1).join('')
            });
            continue;
          }
          // @font-face
          // TODO @font-feature-values
          if ('f' == key[1]) {
            // Use defaults layer
            rules.push(...asArray(value).map(value => ({
              p: Layer.d,
              o: 0,
              r: [key],
              d: serialize$(value, {
                p: Layer.d
              }, context).map(stringify$1).join('')
            })));
            continue;
          }
        }
        // -> All other are handled below; same as selector
        // @media
        // @supports
        // selector
        if ('object' != typeof value || Array.isArray(value)) {
          if ('label' == key && value) name = value + hash(JSON.stringify([precedence, important, style]));else if (value || 0 === value) {
            // property -> hyphenate
            key = key.replace(/[A-Z]/g, _ => '-' + _.toLowerCase());
            // Update precedence
            numberOfDeclarations += 1;
            maxPropertyPrecedence = Math.max(maxPropertyPrecedence, '-' == (property = key)[0] ? 0 : seperatorPrecedence(property) + (/^(?:(border-(?!w|c|sty)|[tlbr].{2,4}m?$|c.{7,8}$)|([fl].{5}l|g.{8}$|pl))/.test(property) ? +!!RegExp.$1 || /* +1 */-!!RegExp.$2 : /* -1 */0) + 1);
            declarations += (declarations ? ';' : '') + asArray(value).map(value => context.s(key,
            // support theme(...) function in values
            // calc(100vh - theme('spacing.12'))
            resolveThemeFunction('' + value, context.theme) + (important ? ' !important' : ''))).join(';');
          }
        } else
          // at-rule or non-global selector
          if ('@' == key[0] || key.includes('&')) {
            let rulePrecedence = precedence;
            if ('@' == key[0]) {
              // Handle `@media screen(sm)` and `@media (screen(sm) or ...)`
              key = key.replace(/\bscreen\(([^)]+)\)/g, (_, screenKey) => {
                let screen = context.theme('screens', screenKey);
                return screen ? (rulePrecedence |= 67108864, /* Shifts.screens */mql(screen, '')) : _;
              });
              rulePrecedence |= atRulePrecedence(key);
            }
            rules.push(...serialize$(value, {
              n: name,
              p: rulePrecedence,
              r: [...conditions, key],
              i: important
            }, context));
          } else
            // global selector
            rules.push(...serialize$(value, {
              p: precedence,
              r: [...conditions, key]
            }, context));
      }
      return (
        // PERF: prevent unshift using `rules = [{}]` above and then `rules[0] = {...}`
        rules.unshift({
          n: name,
          p: precedence,
          o:
          // number of declarations (descending)
          Math.max(0, 15 - numberOfDeclarations) +
          // greatest precedence of properties
          // if there is no property precedence this is most likely a custom property only declaration
          // these have the highest precedence
          1.5 * Math.min(maxPropertyPrecedence || 15, 15),
          r: conditions,
          // stringified declarations
          d: declarations
        }), rules.sort(compareTwindRules)
      );
    }(style, convert(rule, context, precedence, conditions), context);
  }
  function resolveThemeFunction(value, theme) {
    // support theme(...) function in values
    // calc(100vh - theme('spacing.12'))
    // theme('borderColor.DEFAULT', 'currentColor')
    // PERF: check for theme before running the regexp
    // if (value.includes('theme')) {
    return value.replace(/theme\((["'`])?(.+?)\1(?:\s*,\s*(["'`])?(.+?)\3)?\)/g, (_, __, key, ___, defaultValue = '') => {
      let value = theme(key, defaultValue);
      return 'function' == typeof value && /color|fill|stroke/i.test(key) ? toColorValue(value) : '' + asArray(value).filter(v => Object(v) !== v);
    });
  }
  // }
  // return value
  function merge(rules, name) {
    let current;
    // merge:
    // - same conditions
    // - replace name with hash of name + condititions + declarations
    // - precedence:
    //   - combine bits or use max precendence
    //   - set layer bit to merged
    let result = [];
    for (let rule of rules)
    // only merge rules with declarations and names (eg no global rules)
    if (rule.d && rule.n) {
      if (current?.p == rule.p && '' + current.r == '' + rule.r) {
        current.c = [current.c, rule.c].filter(Boolean).join(' ');
        current.d = current.d + ';' + rule.d;
      } else
        // only set name for named rules eg not for global or className propagation rules
        result.push(current = {
          ...rule,
          n: rule.n && name
        });
    } else result.push({
      ...rule,
      n: rule.n && name
    });
    return result;
  }
  function translate(rules, context, precedence = Layer.u, conditions, important) {
    // Sorted by precedence
    let result = [];
    for (let rule of rules) for (let cssRule of function (rule, context, precedence, conditions, important) {
      rule = {
        ...rule,
        i: rule.i || important
      };
      let resolved = function (rule, context) {
        let factory = registry.get(rule.n);
        return factory ? factory(rule, context) : context.r(rule.n, 'dark' == rule.v[0]);
      }(rule, context);
      return resolved ?
      // a list of class names
      'string' == typeof resolved ? (({
        r: conditions,
        p: precedence
      } = convert(rule, context, precedence, conditions)), merge(translate(parse(resolved), context, precedence, conditions, rule.i), rule.n)) : Array.isArray(resolved) ? resolved.map(rule => {
        var /* Shifts.layer */ /*
                               To have a predictable styling the styles must be ordered.
                               This order is represented by a precedence number. The lower values
                               are inserted before higher values. Meaning higher precedence styles
                               overwrite lower precedence styles.
                               Each rule has some traits that are put into a bit set which form
                               the precedence:
                               | bits | trait                                                |
                               | ---- | ---------------------------------------------------- |
                               | 1    | dark mode                                            |
                               | 2    | layer: preflight, global, components, utilities, css |
                               | 1    | screens: is this a responsive variation of a rule    |
                               | 5    | responsive based on min-width                        |
                               | 4    | at-rules                                             |
                               | 18   | pseudo and group variants                            |
                               | 4    | number of declarations (descending)                  |
                               | 4    | greatest precedence of properties                    |
                               **Dark Mode: 1 bit**
                               Flag for dark mode rules.
                               **Layer: 3 bits**
                               - defaults = 0: The preflight styles and any base styles registered by plugins.
                               - base = 1: The global styles registered by plugins.
                               - components = 2
                               - variants = 3
                               - compounds = 4
                               - aliases = 5
                               - utilities = 6: Utility classes and any utility classes registered by plugins.
                               - css = 7: Styles generated by css
                               **Screens: 1 bit**
                               Flag for screen variants. They may not always have a `min-width` to be detected by _Responsive_ below.
                               **Responsive: 4 bits**
                               Based on extracted `min-width` value:
                               - 576px -> 3
                               - 1536px -> 10
                               - 36rem -> 3
                               - 96rem -> 9
                               **At-Rules: 4 bits**
                               Based on the count of special chars (`-:,`) within the at-rule.
                               **Pseudo and group variants: 18 bits**
                               Ensures predictable order of pseudo classes.
                               - https://bitsofco.de/when-do-the-hover-focus-and-active-pseudo-classes-apply/#orderofstyleshoverthenfocusthenactive
                               - https://developer.mozilla.org/docs/Web/CSS/:active#Active_links
                               - https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js#L718
                               **Number of declarations (descending): 4 bits**
                               Allows single declaration styles to overwrite styles from multi declaration styles.
                               **Greatest precedence of properties: 4 bits**
                               Ensure shorthand properties are inserted before longhand properties; eg longhand override shorthand
                               */precedence1, layer;
        return {
          o: 0,
          ...rule,
          r: [...asArray(conditions), ...asArray(rule.r)],
          p: (precedence1 = precedence, layer = rule.p ?? precedence, precedence1 & ~Layer.o | layer)
        };
      }) : serialize(resolved, rule, context, precedence, conditions) :
      // propagate className as is
      [{
        c: toClassName(rule),
        p: 0,
        o: 0,
        r: []
      }];
    }(rule, context, precedence, conditions, important)) result.splice(sortedInsertionIndex(result, cssRule), 0, cssRule);
    return result;
  }
  function translateWith(name, layer, rules, context, precedence, conditions, important, useOrderOfRules) {
    return merge((useOrderOfRules ? rules.flatMap(rule => translate([rule], context, precedence, conditions, important)) : translate(rules, context, precedence, conditions, important)).map(rule => {
      return (
        // do not move defaults
        // move only rules with a name unless they are in the base layer
        rule.p & Layer.o && (rule.n || layer == Layer.b) ? {
          ...rule,
          p: rule.p & ~Layer.o | layer,
          o: 0
        } : rule
      );
    }), name);
  }
  function define(className, layer, rules, useOrderOfRules) {
    var factory;
    return factory = (rule, context) => {
      let {
        n: name,
        p: precedence,
        r: conditions,
        i: important
      } = convert(rule, context, layer);
      return rules && translateWith(name, layer, rules, context, precedence, conditions, important, useOrderOfRules);
    }, registry.set(className, factory), className;
  }
  /**
     * The utility name including `-` if set, but without `!` and variants
     */ /**
        * All variants without trailing colon: `hover`, `after:`, `[...]`
        */ /**
           * Something like `!underline` or `!bg-red-500` or `!red-500`
           */
  function createRule(active, current, loc) {
    if ('(' != active[active.length - 1]) {
      let variants = [],
        important = false,
        negated = false,
        name = '';
      for (let value of active) if (!('(' == value || /[~@]$/.test(value))) {
        if ('!' == value[0]) {
          value = value.slice(1);
          important = !important;
        }
        if (value.endsWith(':')) {
          variants['dark:' == value ? 'unshift' : 'push'](value.slice(0, -1));
          continue;
        }
        if ('-' == value[0]) {
          value = value.slice(1);
          negated = !negated;
        }
        value.endsWith('-') && (value = value.slice(0, -1));
        value && '&' != value && (name += (name && '-') + value);
      }
      if (name) {
        negated && (name = '-' + name);
        current[0].push({
          n: name,
          v: variants.filter(uniq),
          i: important
        });
      }
    }
  }
  function uniq(value, index, values) {
    return values.indexOf(value) == index;
  }
  let cache = new Map();
  /**
   * @internal
   * @param token
   * @returns
   */
  function parse(token) {
    let parsed = cache.get(token);
    if (!parsed) {
      // Stack of active groupings (`(`), variants, or nested (`~` or `@`)
      let active = [],
        // Stack of current rule list to put new rules in
        // the first `0` element is the current list
        current = [[]],
        startIndex = 0,
        skip = 0,
        comment = null,
        position = 0,
        // eslint-disable-next-line no-inner-declarations
        commit = (isRule, endOffset = 0) => {
          if (startIndex != position) {
            active.push(token.slice(startIndex, position + endOffset));
            isRule && createRule(active, current);
          }
          startIndex = position + 1;
        };
      for (; position < token.length; position++) {
        let char = token[position];
        if (skip) '\\' != token[position - 1] && (skip += +('[' == char) || -(']' == char));else if ('[' == char)
          // start to skip
          skip += 1;else if (comment) {
          if ('\\' != token[position - 1] && comment.test(token.slice(position))) {
            comment = null;
            startIndex = position + RegExp.lastMatch.length;
          }
        } else if ('/' == char && '\\' != token[position - 1] && ('*' == token[position + 1] || '/' == token[position + 1]))
          // multiline or single line comment
          comment = '*' == token[position + 1] ? /^\*\// : /^[\r\n]/;else if ('(' == char) {
          // hover:(...) or utilitity-(...)
          commit();
          active.push(char);
        } else if (':' == char) ':' != token[position + 1] && commit(false, 1);else if (/[\s,)]/.test(char)) {
          // whitespace, comma or closing brace
          commit(true);
          let lastGroup = active.lastIndexOf('(');
          if (')' == char) {
            // Close nested block
            let nested = active[lastGroup - 1];
            if (/[~@]$/.test(nested)) {
              let rules = current.shift();
              active.length = lastGroup;
              // remove variants that are already applied through active
              createRule([...active, '#'], current);
              let {
                v
              } = current[0].pop();
              for (let rule of rules)
              // if a rule has dark we need to splice after the first entry eg dark
              rule.v.splice(+('dark' == rule.v[0]) - +('dark' == v[0]), v.length);
              createRule([...active, define(
              // named nested
              nested.length > 1 ? nested.slice(0, -1) + hash(JSON.stringify([nested, rules])) : nested + '(' + format(rules) + ')', Layer.a, rules, /@$/.test(nested))], current);
            }
            lastGroup = active.lastIndexOf('(', lastGroup - 1);
          }
          active.length = lastGroup + 1;
        } else /[~@]/.test(char) && '(' == token[position + 1] &&
        // start nested block
        // ~(...) or button~(...)
        // @(...) or button@(...)
        current.unshift([]);
      }
      // Consume remaining stack
      commit(true);
      cache.set(token, parsed = current[0]);
    }
    return parsed;
  }
  /** The found theme value */ // indirection wrapper to remove autocomplete functions from production bundles
  /**
   * @group Configuration
   * @param pattern
   */ /**
      * @group Configuration
      * @param pattern
      * @param resolver
      */ /**
         * @group Configuration
         * @param pattern
         * @param resolve
         */ // eslint-disable-next-line @typescript-eslint/ban-types
  /**
   * @group Configuration
   * @param pattern
   * @param resolve
   * @param convert
   */
  function match(pattern,
  // eslint-disable-next-line @typescript-eslint/ban-types
  resolve, convert) {
    return [pattern, fromMatch(resolve, convert)];
  }
  /**
   * @group Configuration
   * @internal
   * @deprecated Use {@link match} instead.
   */ /**
      * @group Configuration
      * @internal
      * @deprecated Use {@link match} instead.
      */ /**
         * @group Configuration
         * @internal
         * @deprecated Use {@link match} instead.
         */ /**
            * @group Configuration
            * @internal
            * @deprecated Use {@link match} instead.
            */
  function fromMatch(resolve, convert) {
    return 'function' == typeof resolve ? resolve : 'string' == typeof resolve && /^[\w-]+$/.test(resolve) ?
    // a CSS property alias
    (match, context) => ({
      [resolve]: convert ? convert(match, context) : maybeNegate(match, 1)
    }) : match =>
    // CSSObject, shortcut or apply
    resolve || {
      [match[1]]: maybeNegate(match, 2)
    };
  }
  function maybeNegate(match, offset, value = match.slice(offset).find(Boolean) || match.$$ || match.input) {
    return '-' == match.input[0] ? `calc(${value} * -1)` : value;
  }
  /**
   * @group Configuration
   * @param pattern
   * @param section
   * @param resolve
   * @param convert
   * @returns
   */
  function matchTheme(pattern, /** Theme section to use (default: `$1` — The first matched group) */section, /** The css property (default: value of {@link section}) */resolve, convert) {
    return [pattern, fromTheme(section, resolve, convert)];
  }
  /**
   * @group Configuration
   * @internal
   * @deprecated Use {@link matchTheme} instead.
   * @param section
   * @param resolve
   * @param convert
   * @returns
   */
  function fromTheme( /** Theme section to use (default: `$1` — The first matched group) */section, /** The css property (default: value of {@link section}) */resolve, convert) {
    let factory = 'string' == typeof resolve ? (match, context) => ({
      [resolve]: convert ? convert(match, context) : match._
    }) : resolve || (({
      1: $1,
      _
    }, context, section) => ({
      [$1 || section]: _
    }));
    return (match, context) => {
      let themeSection = camelize(section || match[1]),
        value = context.theme(themeSection, match.$$) ?? arbitrary(match.$$, themeSection, context);
      if (null != value) return match._ = maybeNegate(match, 0, value), factory(match, context, themeSection);
    };
  }
  /** Theme section to use (default: `$0.replace('-', 'Color')` — The matched string with `Color` appended) */ /** The css property (default: value of {@link section}) */ /** `--tw-${$0}opacity` -> '--tw-text-opacity' */ /** `section.replace('Color', 'Opacity')` -> 'textOpacity' */ /**
                                                                                                                                                                                                                                                                                           * @group Configuration
                                                                                                                                                                                                                                                                                           * @param pattern
                                                                                                                                                                                                                                                                                           * @param options
                                                                                                                                                                                                                                                                                           * @param resolve
                                                                                                                                                                                                                                                                                           * @returns
                                                                                                                                                                                                                                                                                           */
  function matchColor(pattern, options = {}, resolve) {
    return [pattern, colorFromTheme(options, resolve)];
  }
  /**
   * @group Configuration
   * @internal
   * @deprecated Use {@link matchColor} instead.
   * @param options
   * @param resolve
   * @returns
   */
  function colorFromTheme(options = {}, resolve) {
    return (match, context) => {
      // text- -> textColor
      // ring-offset(?:-|$) -> ringOffsetColor
      let {
          section = camelize(match[0]).replace('-', '') + 'Color'
        } = options,
        // extract color and opacity
        // rose-500                  -> ['rose-500']
        // [hsl(0_100%_/_50%)]       -> ['[hsl(0_100%_/_50%)]']
        // indigo-500/100            -> ['indigo-500', '100']
        // [hsl(0_100%_/_50%)]/[.25] -> ['[hsl(0_100%_/_50%)]', '[.25]']
        [colorMatch, opacityMatch] = parseValue(match.$$);
      if (!colorMatch) return;
      let colorValue = context.theme(section, colorMatch) || arbitrary(colorMatch, section, context);
      if (!colorValue || 'object' == typeof colorValue) return;
      let {
          // text- -> --tw-text-opacity
          // ring-offset(?:-|$) -> --tw-ring-offset-opacity
          // TODO move this default into preset-tailwind?
          opacityVariable = `--tw-${match[0].replace(/-$/, '')}-opacity`,
          opacitySection = section.replace('Color', 'Opacity'),
          property = section,
          selector
        } = options,
        opacityValue = context.theme(opacitySection, opacityMatch || 'DEFAULT') || opacityMatch && arbitrary(opacityMatch, opacitySection, context),
        // if (typeof color != 'string') {
        //   console.warn(`Invalid color ${colorMatch} (from ${match.input}):`, color)
        //   return
        // }
        create = resolve || (({
          _
        }) => {
          let properties = toCSS(property, _);
          return selector ? {
            [selector]: properties
          } : properties;
        });
      match._ = {
        value: toColorValue(colorValue, {
          opacityVariable: opacityVariable || void 0,
          opacityValue: opacityValue || void 0
        }),
        color: options => toColorValue(colorValue, options),
        opacityVariable: opacityVariable || void 0,
        opacityValue: opacityValue || void 0
      };
      let properties = create(match, context);
      // auto support dark mode colors
      if (!match.dark) {
        let darkColorValue = context.d(section, colorMatch, colorValue);
        if (darkColorValue && darkColorValue !== colorValue) {
          match._ = {
            value: toColorValue(darkColorValue, {
              opacityVariable: opacityVariable || void 0,
              opacityValue: opacityValue || '1'
            }),
            color: options => toColorValue(darkColorValue, options),
            opacityVariable: opacityVariable || void 0,
            opacityValue: opacityValue || void 0
          };
          properties = {
            '&': properties,
            [context.v('dark')]: create(match, context)
          };
        }
      }
      return properties;
    };
  }
  /**
   * @internal
   * @param input
   */
  function parseValue(input) {
    // extract color and opacity
    // rose-500                  -> ['rose-500']
    // [hsl(0_100%_/_50%)]       -> ['[hsl(0_100%_/_50%)]']
    // indigo-500/100            -> ['indigo-500', '100']
    // [hsl(0_100%_/_50%)]/[.25] -> ['[hsl(0_100%_/_50%)]', '[.25]']
    return (input.match(/^(\[[^\]]+]|[^/]+?)(?:\/(.+))?$/) || []).slice(1);
  }
  /**
   * @internal
   * @param property
   * @param value
   * @returns
   */
  function toCSS(property, value) {
    let properties = {};
    if ('string' == typeof value) properties[property] = value;else {
      value.opacityVariable && value.value.includes(value.opacityVariable) && (properties[value.opacityVariable] = value.opacityValue || '1');
      properties[property] = value.value;
    }
    return properties;
  }
  /**
   * @internal
   * @param value
   * @param section
   * @param context
   * @returns
   */
  function arbitrary(value, section, context) {
    if ('[' == value[0] && ']' == value.slice(-1)) {
      value = normalize(resolveThemeFunction(value.slice(1, -1), context.theme));
      if (!section) return value;
      if (
      // Respect type hints from the user on ambiguous arbitrary values - https://tailwindcss.com/docs/adding-custom-styles#resolving-ambiguities
      !(
      // If this is a color section and the value is a hex color, color function or color name
      /color|fill|stroke/i.test(section) && !(/^color:/.test(value) || /^(#|((hsl|rgb)a?|hwb|lab|lch|color)\(|[a-z]+$)/.test(value)) ||
      // url(, [a-z]-gradient(, image(, cross-fade(, image-set(
      /image/i.test(section) && !(/^image:/.test(value) || /^[a-z-]+\(/.test(value)) ||
      // font-*
      // - fontWeight (type: ['lookup', 'number', 'any'])
      // - fontFamily (type: ['lookup', 'generic-name', 'family-name'])
      /weight/i.test(section) && !(/^(number|any):/.test(value) || /^\d+$/.test(value)) ||
      // bg-*
      // - backgroundPosition (type: ['lookup', ['position', { preferOnConflict: true }]])
      // - backgroundSize (type: ['lookup', 'length', 'percentage', 'size'])
      /position/i.test(section) && /^(length|size):/.test(value)))
        // remove arbitrary type prefix — we do not need it but user may use it
        // https://github.com/tailwindlabs/tailwindcss/blob/master/src/util/dataTypes.js
        // url, number, percentage, length, line-width, shadow, color, image, gradient, position, family-name, lookup, any, generic-name, absolute-size, relative-size
        return value.replace(/^[a-z-]+:/, '');
    }
  }
  function camelize(value) {
    return value.replace(/-./g, x => x[1].toUpperCase());
  }
  /**
   * @internal
   * @param value
   * @returns
   */
  function normalize(value) {
    return (
      // Keep raw strings if it starts with `url(`
      value.includes('url(') ? value.replace(/(.*?)(url\(.*?\))(.*?)/g, (_, before = '', url, after = '') => normalize(before) + url + normalize(after)) : value.
      // Convert `_` to ` `, except for escaped underscores `\_`
      replace(/(^|[^\\])_+/g, (fullMatch, characterBefore) => characterBefore + ' '.repeat(fullMatch.length - characterBefore.length)).replace(/\\_/g, '_').
      // Add spaces around operators inside math functions like calc() that do not follow an operator
      // or '('.
      replace(/(calc|min|max|clamp)\(.+\)/g, match => match.replace(/(-?\d*\.?\d(?!\b-.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g, '$1 $2 '))
    );
  }
  /**
   * @group Configuration
   * @param param0
   * @returns
   */
  function defineConfig({
    presets = [],
    ...userConfig
  }) {
    // most user config values go first to have precendence over preset config
    // only `preflight` and `theme` are applied as last preset to override all presets
    let config = {
      darkMode: void 0,
      darkColor: void 0,
      preflight: false !== userConfig.preflight && [],
      theme: {},
      variants: asArray(userConfig.variants),
      rules: asArray(userConfig.rules),
      ignorelist: asArray(userConfig.ignorelist),
      hash: void 0,
      stringify: (property, value) => property + ':' + value,
      finalize: []
    };
    for (let preset of asArray([...presets, {
      darkMode: userConfig.darkMode,
      darkColor: userConfig.darkColor,
      preflight: false !== userConfig.preflight && asArray(userConfig.preflight),
      theme: userConfig.theme,
      hash: userConfig.hash,
      stringify: userConfig.stringify,
      finalize: userConfig.finalize
    }])) {
      let {
        preflight,
        darkMode = config.darkMode,
        darkColor = config.darkColor,
        theme,
        variants,
        rules,
        ignorelist,
        hash = config.hash,
        stringify = config.stringify,
        finalize
      } = 'function' == typeof preset ? preset(config) : preset;
      config = {
        // values defined by user or previous presets take precedence
        preflight: false !== config.preflight && false !== preflight && [...config.preflight, ...asArray(preflight)],
        darkMode,
        darkColor,
        theme: {
          ...config.theme,
          ...theme,
          extend: {
            ...config.theme.extend,
            ...theme?.extend
          }
        },
        variants: [...config.variants, ...asArray(variants)],
        rules: [...config.rules, ...asArray(rules)],
        ignorelist: [...config.ignorelist, ...asArray(ignorelist)],
        hash,
        stringify,
        finalize: [...config.finalize, ...asArray(finalize)]
      };
    }
    return config;
  }
  function find(value, list, cache, getResolver, context, isDark) {
    for (let item of list) {
      let resolver = cache.get(item);
      resolver || cache.set(item, resolver = getResolver(item));
      let resolved = resolver(value, context, isDark);
      if (resolved) return resolved;
    }
  }
  function getVariantResolver(variant) {
    var resolve;
    return createResolve(variant[0], 'function' == typeof (resolve = variant[1]) ? resolve : () => resolve);
  }
  function getRuleResolver(rule) {
    var resolve, convert;
    return Array.isArray(rule) ? createResolve(rule[0], fromMatch(rule[1], rule[2])) : createResolve(rule, fromMatch(resolve, convert));
  }
  function createResolve(patterns, resolve) {
    return createRegExpExecutor(patterns, (value, condition, context, isDark) => {
      let match = condition.exec(value);
      if (match) return (
        // MATCH.$_ = value
        match.$$ = value.slice(match[0].length), match.dark = isDark, resolve(match, context)
      );
    });
  }
  function createRegExpExecutor(patterns, run) {
    let conditions = asArray(patterns).map(toCondition);
    return (value, context, isDark) => {
      for (let condition of conditions) {
        let result = run(value, condition, context, isDark);
        if (result) return result;
      }
    };
  }
  function toCondition(value) {
    // "visible" -> /^visible$/
    // "(float)-(left|right|none)" -> /^(float)-(left|right|none)$/
    // "auto-rows-" -> /^auto-rows-/
    // "gap(-|$)" -> /^gap(-|$)/
    return 'string' == typeof value ? RegExp('^' + value + (value.includes('$') || '-' == value.slice(-1) ? '' : '$')) : value;
  }
  /**
   * @group Runtime
   * @param config
   * @param sheet
   */
  function twind(userConfig, sheet) {
    let config = defineConfig(userConfig),
      context = function ({
        theme,
        darkMode,
        darkColor = noop,
        variants,
        rules,
        hash: hash$1,
        stringify,
        ignorelist,
        finalize
      }) {
        // Used to cache resolved rule values
        let variantCache = new Map(),
          // lazy created resolve functions
          variantResolvers = new Map(),
          // Used to cache resolved rule values
          ruleCache = new Map(),
          // lazy created resolve functions
          ruleResolvers = new Map(),
          ignored = createRegExpExecutor(ignorelist, (value, condition) => condition.test(value));
        // add dark as last variant to allow user to override it
        // we can modify variants as it has been passed through defineConfig which already made a copy
        variants.push(['dark', Array.isArray(darkMode) || 'class' == darkMode ? `${asArray(darkMode)[1] || '.dark'} &` : 'string' == typeof darkMode && 'media' != darkMode ? darkMode :
        // a custom selector
        '@media (prefers-color-scheme:dark)']);
        let h = 'function' == typeof hash$1 ? value => hash$1(value, hash) : hash$1 ? hash : identity;
        h !== identity && finalize.push(rule => ({
          ...rule,
          n: rule.n && h(rule.n),
          d: rule.d?.replace(/--(tw(?:-[\w-]+)?)\b/g, (_, property) => '--' + h(property).replace('#', ''))
        }));
        let ctx = {
          theme: function ({
            extend = {},
            ...base
          }) {
            let resolved = {},
              resolveContext = {
                get colors() {
                  return theme('colors');
                },
                theme,
                // Stub implementation as negated values are automatically infered and do _not_ need to be in the theme
                negative() {
                  return {};
                },
                breakpoints(screens) {
                  let breakpoints = {};
                  for (let key in screens) 'string' == typeof screens[key] && (breakpoints['screen-' + key] = screens[key]);
                  return breakpoints;
                }
              };
            return theme;
            function theme(sectionKey, key, defaultValue, opacityValue) {
              if (sectionKey) {
                ({
                  1: sectionKey,
                  2: opacityValue
                } =
                // eslint-disable-next-line no-sparse-arrays
                /^(\S+?)(?:\s*\/\s*([^/]+))?$/.exec(sectionKey) || [, sectionKey]);
                if (/[.[]/.test(sectionKey)) {
                  let path = [];
                  // dotted deep access: colors.gray.500 or spacing[2.5]
                  sectionKey.replace(/\[([^\]]+)\]|([^.[]+)/g, (_, $1, $2 = $1) => path.push($2));
                  sectionKey = path.shift();
                  defaultValue = key;
                  key = path.join('-');
                }
                let section = resolved[sectionKey] ||
                // two-step deref to allow extend section to reference base section
                Object.assign(Object.assign(
                // Make sure to not get into recursive calls
                resolved[sectionKey] = {}, deref(base, sectionKey)), deref(extend, sectionKey));
                if (null == key) return section;
                key || (key = 'DEFAULT');
                let value = section[key] ?? key.split('-').reduce((obj, prop) => obj?.[prop], section) ?? defaultValue;
                return opacityValue ? toColorValue(value, {
                  opacityValue: resolveThemeFunction(opacityValue, theme)
                }) : value;
              }
              // Collect the whole theme
              let result = {};
              for (let section1 of [...Object.keys(base), ...Object.keys(extend)]) result[section1] = theme(section1);
              return result;
            }
            function deref(source, section) {
              let value = source[section];
              return ('function' == typeof value && (value = value(resolveContext)), value && /color|fill|stroke/i.test(section)) ? function flattenColorPalette(colors, path = []) {
                let flattend = {};
                for (let key in colors) {
                  let value = colors[key],
                    keyPath = [...path, key];
                  flattend[keyPath.join('-')] = value;
                  if ('DEFAULT' == key) {
                    keyPath = path;
                    flattend[path.join('-')] = value;
                  }
                  'object' == typeof value && Object.assign(flattend, flattenColorPalette(value, keyPath));
                }
                return flattend;
              }(value) : value;
            }
          }(theme),
          e: escape,
          h,
          s(property, value) {
            return stringify(property, value, ctx);
          },
          d(section, key, color) {
            return darkColor(section, key, ctx, color);
          },
          v(value) {
            return variantCache.has(value) || variantCache.set(value, find(value, variants, variantResolvers, getVariantResolver, ctx) || '&:' + value), variantCache.get(value);
          },
          r(className, isDark) {
            let key = JSON.stringify([className, isDark]);
            return ruleCache.has(key) || ruleCache.set(key, !ignored(className, ctx) && find(className, rules, ruleResolvers, getRuleResolver, ctx, isDark)), ruleCache.get(key);
          },
          f(rule) {
            return finalize.reduce((rule, p) => p(rule, ctx), rule);
          }
        };
        return ctx;
      }(config),
      // Map of tokens to generated className
      cache = new Map(),
      // An array of precedence by index within the sheet
      // always sorted
      sortedPrecedences = [],
      // Cache for already inserted css rules
      // to prevent double insertions
      insertedRules = new Set();
    sheet.resume(className => cache.set(className, className), (cssText, rule) => {
      sheet.insert(cssText, sortedPrecedences.length, rule);
      sortedPrecedences.push(rule);
      insertedRules.add(cssText);
    });
    function insert(rule) {
      let finalRule = context.f(rule),
        cssText = stringify$1(finalRule);
      // If not already inserted
      if (cssText && !insertedRules.has(cssText)) {
        // Mark rule as inserted
        insertedRules.add(cssText);
        // Find the correct position
        let index = sortedInsertionIndex(sortedPrecedences, rule);
        // Insert
        sheet.insert(cssText, index, rule);
        // Update sorted index
        sortedPrecedences.splice(index, 0, rule);
      }
      return finalRule.n;
    }
    return Object.defineProperties(function tw(tokens) {
      if (!cache.size) for (let preflight of asArray(config.preflight)) {
        'function' == typeof preflight && (preflight = preflight(context));
        preflight && ('string' == typeof preflight ? translateWith('', Layer.b, parse(preflight), context, Layer.b, [], false, true) : serialize(preflight, {}, context, Layer.b)).forEach(insert);
      }
      tokens = '' + tokens;
      let className = cache.get(tokens);
      if (!className) {
        let classNames = new Set();
        for (let rule of translate(parse(tokens), context)) classNames.add(rule.c).add(insert(rule));
        className = [...classNames].filter(Boolean).join(' ');
        // Remember the generated class name
        cache.set(tokens, className).set(className, className);
      }
      return className;
    }, Object.getOwnPropertyDescriptors({
      get target() {
        return sheet.target;
      },
      theme: context.theme,
      config,
      snapshot() {
        let restoreSheet = sheet.snapshot(),
          insertedRules$ = new Set(insertedRules),
          cache$ = new Map(cache),
          sortedPrecedences$ = [...sortedPrecedences];
        return () => {
          restoreSheet();
          insertedRules = insertedRules$;
          cache = cache$;
          sortedPrecedences = sortedPrecedences$;
        };
      },
      clear() {
        sheet.clear();
        insertedRules = new Set();
        cache = new Map();
        sortedPrecedences = [];
      },
      destroy() {
        this.clear();
        sheet.destroy();
      }
    }));
  }
  /**
   * Simplified MutationRecord which allows us to pass an
   * ArrayLike (compatible with Array and NodeList) `addedNodes` and
   * omit other properties we are not interested in.
   */
  function getStyleElement(selector) {
    let style = document.querySelector(selector || 'style[data-twind=""]');
    if (!style || 'STYLE' != style.tagName) {
      style = document.createElement('style');
      document.head.prepend(style);
    }
    return style.dataset.twind = 'claimed', style;
  }
  /**
   * @group Sheets
   * @param element
   * @returns
   */
  function dom(element) {
    let target = element && 'string' != typeof element ? element : getStyleElement(element);
    return {
      target,
      snapshot() {
        // collect current rules
        let rules = Array.from(target.childNodes, node => node.textContent);
        return () => {
          // remove all existing rules
          this.clear();
          // add all snapshot rules back
          // eslint-disable-next-line @typescript-eslint/unbound-method
          rules.forEach(this.insert);
        };
      },
      clear() {
        target.textContent = '';
      },
      destroy() {
        target.remove();
      },
      insert(cssText, index) {
        target.insertBefore(document.createTextNode(cssText), target.childNodes[index] || null);
      },
      resume: noop
    };
  }

  var i=new Map([["align-self","-ms-grid-row-align"],["color-adjust","-webkit-print-color-adjust"],["column-gap","grid-column-gap"],["forced-color-adjust","-ms-high-contrast-adjust"],["gap","grid-gap"],["grid-template-columns","-ms-grid-columns"],["grid-template-rows","-ms-grid-rows"],["justify-self","-ms-grid-column-align"],["margin-inline-end","-webkit-margin-end"],["margin-inline-start","-webkit-margin-start"],["mask-border","-webkit-mask-box-image"],["mask-border-outset","-webkit-mask-box-image-outset"],["mask-border-slice","-webkit-mask-box-image-slice"],["mask-border-source","-webkit-mask-box-image-source"],["mask-border-repeat","-webkit-mask-box-image-repeat"],["mask-border-width","-webkit-mask-box-image-width"],["overflow-wrap","word-wrap"],["padding-inline-end","-webkit-padding-end"],["padding-inline-start","-webkit-padding-start"],["print-color-adjust","color-adjust"],["row-gap","grid-row-gap"],["scroll-margin-bottom","scroll-snap-margin-bottom"],["scroll-margin-left","scroll-snap-margin-left"],["scroll-margin-right","scroll-snap-margin-right"],["scroll-margin-top","scroll-snap-margin-top"],["scroll-margin","scroll-snap-margin"],["text-combine-upright","-ms-text-combine-horizontal"]]);function r(r){return i.get(r)}function a(i){var r=/^(?:(text-(?:decoration$|e|or|si)|back(?:ground-cl|d|f)|box-d|mask(?:$|-[ispro]|-cl)|pr|hyphena|flex-d)|(tab-|column(?!-s)|text-align-l)|(ap)|u|hy)/i.exec(i);return r?r[1]?1:r[2]?2:r[3]?3:5:0}function t(i,r){var a=/^(?:(pos)|(cli)|(background-i)|(flex(?:$|-b)|(?:max-|min-)?(?:block-s|inl|he|widt))|dis)/i.exec(i);return a?a[1]?/^sti/i.test(r)?1:0:a[2]?/^pat/i.test(r)?1:0:a[3]?/^image-/i.test(r)?1:0:a[4]?"-"===r[3]?2:0:/^(?:inline-)?grid$/i.test(r)?4:0:0}

  let CSSPrefixFlags = [['-webkit-', 1],
  // 0b001
  ['-moz-', 2],
  // 0b010
  ['-ms-', 4]];
  // 0b100
  function presetAutoprefix() {
    return ({
      stringify
    }) => ({
      stringify(property, value, context) {
        let cssText = '',
          // Resolve aliases, e.g. `gap` -> `grid-gap`
          propertyAlias = r(property);
        propertyAlias && (cssText += stringify(propertyAlias, value, context) + ';');
        // Prefix properties, e.g. `backdrop-filter` -> `-webkit-backdrop-filter`
        let propertyFlags = a(property),
          valueFlags = t(property, value);
        for (let prefix of CSSPrefixFlags) {
          propertyFlags & prefix[1] && (cssText += stringify(prefix[0] + property, value, context) + ';');
          valueFlags & prefix[1] && (cssText += stringify(property, prefix[0] + value, context) + ';');
        }
        /* Include the standardized declaration last */ /* https://css-tricks.com/ordering-css3-properties/ */
        return cssText + stringify(property, value, context);
      }
    });
  }

  /**
   * @module @twind/preset-tailwind/baseTheme
   */ /**
      * @experimental
      */let theme = {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    columns: {
      auto: 'auto',
      // Handled by plugin,
      // 1: '1',
      // 2: '2',
      // 3: '3',
      // 4: '4',
      // 5: '5',
      // 6: '6',
      // 7: '7',
      // 8: '8',
      // 9: '9',
      // 10: '10',
      // 11: '11',
      // 12: '12',
      '3xs': '16rem',
      '2xs': '18rem',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem'
    },
    spacing: {
      px: '1px',
      0: '0px',
      ... /* #__PURE__ */linear(4, 'rem', 4, 0.5, 0.5),
      // 0.5: '0.125rem',
      // 1: '0.25rem',
      // 1.5: '0.375rem',
      // 2: '0.5rem',
      // 2.5: '0.625rem',
      // 3: '0.75rem',
      // 3.5: '0.875rem',
      // 4: '1rem',
      ... /* #__PURE__ */linear(12, 'rem', 4, 5),
      // 5: '1.25rem',
      // 6: '1.5rem',
      // 7: '1.75rem',
      // 8: '2rem',
      // 9: '2.25rem',
      // 10: '2.5rem',
      // 11: '2.75rem',
      // 12: '3rem',
      14: '3.5rem',
      ... /* #__PURE__ */linear(64, 'rem', 4, 16, 4),
      // 16: '4rem',
      // 20: '5rem',
      // 24: '6rem',
      // 28: '7rem',
      // 32: '8rem',
      // 36: '9rem',
      // 40: '10rem',
      // 44: '11rem',
      // 48: '12rem',
      // 52: '13rem',
      // 56: '14rem',
      // 60: '15rem',
      // 64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem'
    },
    durations: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms'
    },
    animation: {
      none: 'none',
      spin: 'spin 1s linear infinite',
      ping: 'ping 1s cubic-bezier(0,0,0.2,1) infinite',
      pulse: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
      bounce: 'bounce 1s infinite'
    },
    aspectRatio: {
      auto: 'auto',
      square: '1/1',
      video: '16/9'
    },
    backdropBlur: /* #__PURE__ */alias('blur'),
    backdropBrightness: /* #__PURE__ */alias('brightness'),
    backdropContrast: /* #__PURE__ */alias('contrast'),
    backdropGrayscale: /* #__PURE__ */alias('grayscale'),
    backdropHueRotate: /* #__PURE__ */alias('hueRotate'),
    backdropInvert: /* #__PURE__ */alias('invert'),
    backdropOpacity: /* #__PURE__ */alias('opacity'),
    backdropSaturate: /* #__PURE__ */alias('saturate'),
    backdropSepia: /* #__PURE__ */alias('sepia'),
    backgroundColor: /* #__PURE__ */alias('colors'),
    backgroundImage: {
      none: 'none'
    },
    // These are built-in
    // 'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
    // 'gradient-to-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
    // 'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
    // 'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
    // 'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
    // 'gradient-to-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
    // 'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
    // 'gradient-to-tl': 'linear-gradient(to top left, var(--tw-gradient-stops))',
    backgroundOpacity: /* #__PURE__ */alias('opacity'),
    // backgroundPosition: {
    //   // The following are already handled by the plugin:
    //   // center, right, left, bottom, top
    //   // 'bottom-10px-right-20px' -> bottom 10px right 20px
    // },
    backgroundSize: {
      auto: 'auto',
      cover: 'cover',
      contain: 'contain'
    },
    blur: {
      none: 'none',
      0: '0',
      sm: '4px',
      DEFAULT: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      '2xl': '40px',
      '3xl': '64px'
    },
    brightness: {
      ... /* #__PURE__ */linear(200, '', 100, 0, 50),
      // 0: '0',
      // 50: '.5',
      // 150: '1.5',
      // 200: '2',
      ... /* #__PURE__ */linear(110, '', 100, 90, 5),
      // 90: '.9',
      // 95: '.95',
      // 100: '1',
      // 105: '1.05',
      // 110: '1.1',
      75: '0.75',
      125: '1.25'
    },
    borderColor: ({
      theme
    }) => ({
      DEFAULT: theme('colors.gray.200', 'currentColor'),
      ...theme('colors')
    }),
    borderOpacity: /* #__PURE__ */alias('opacity'),
    borderRadius: {
      none: '0px',
      sm: '0.125rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      '1/2': '50%',
      full: '9999px'
    },
    borderSpacing: /* #__PURE__ */alias('spacing'),
    borderWidth: {
      DEFAULT: '1px',
      ... /* #__PURE__ */exponential(8, 'px')
    },
    // 0: '0px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',
    boxShadow: {
      sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
      DEFAULT: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
      md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
      lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
      xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
      '2xl': '0 25px 50px -12px rgba(0,0,0,0.25)',
      inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.05)',
      none: '0 0 #0000'
    },
    boxShadowColor: alias('colors'),
    // container: {},
    // cursor: {
    //   // Default values are handled by plugin
    // },
    caretColor: /* #__PURE__ */alias('colors'),
    accentColor: ({
      theme
    }) => ({
      auto: 'auto',
      ...theme('colors')
    }),
    contrast: {
      ... /* #__PURE__ */linear(200, '', 100, 0, 50),
      // 0: '0',
      // 50: '.5',
      // 150: '1.5',
      // 200: '2',
      75: '0.75',
      125: '1.25'
    },
    content: {
      none: 'none'
    },
    divideColor: /* #__PURE__ */alias('borderColor'),
    divideOpacity: /* #__PURE__ */alias('borderOpacity'),
    divideWidth: /* #__PURE__ */alias('borderWidth'),
    dropShadow: {
      sm: '0 1px 1px rgba(0,0,0,0.05)',
      DEFAULT: ['0 1px 2px rgba(0,0,0,0.1)', '0 1px 1px rgba(0,0,0,0.06)'],
      md: ['0 4px 3px rgba(0,0,0,0.07)', '0 2px 2px rgba(0,0,0,0.06)'],
      lg: ['0 10px 8px rgba(0,0,0,0.04)', '0 4px 3px rgba(0,0,0,0.1)'],
      xl: ['0 20px 13px rgba(0,0,0,0.03)', '0 8px 5px rgba(0,0,0,0.08)'],
      '2xl': '0 25px 25px rgba(0,0,0,0.15)',
      none: '0 0 #0000'
    },
    fill: ({
      theme
    }) => ({
      ...theme('colors'),
      none: 'none'
    }),
    grayscale: {
      DEFAULT: '100%',
      0: '0'
    },
    hueRotate: {
      0: '0deg',
      15: '15deg',
      30: '30deg',
      60: '60deg',
      90: '90deg',
      180: '180deg'
    },
    invert: {
      DEFAULT: '100%',
      0: '0'
    },
    flex: {
      1: '1 1 0%',
      auto: '1 1 auto',
      initial: '0 1 auto',
      none: 'none'
    },
    flexBasis: ({
      theme
    }) => ({
      ...theme('spacing'),
      ...ratios(2, 6),
      // '1/2': '50%',
      // '1/3': '33.333333%',
      // '2/3': '66.666667%',
      // '1/4': '25%',
      // '2/4': '50%',
      // '3/4': '75%',
      // '1/5': '20%',
      // '2/5': '40%',
      // '3/5': '60%',
      // '4/5': '80%',
      // '1/6': '16.666667%',
      // '2/6': '33.333333%',
      // '3/6': '50%',
      // '4/6': '66.666667%',
      // '5/6': '83.333333%',
      ...ratios(12, 12),
      // '1/12': '8.333333%',
      // '2/12': '16.666667%',
      // '3/12': '25%',
      // '4/12': '33.333333%',
      // '5/12': '41.666667%',
      // '6/12': '50%',
      // '7/12': '58.333333%',
      // '8/12': '66.666667%',
      // '9/12': '75%',
      // '10/12': '83.333333%',
      // '11/12': '91.666667%',
      auto: 'auto',
      full: '100%'
    }),
    flexGrow: {
      DEFAULT: 1,
      0: 0
    },
    flexShrink: {
      DEFAULT: 1,
      0: 0
    },
    fontFamily: {
      sans: 'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'.split(','),
      serif: 'ui-serif,Georgia,Cambria,"Times New Roman",Times,serif'.split(','),
      mono: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'.split(',')
    },
    fontSize: {
      xs: ['0.75rem', '1rem'],
      sm: ['0.875rem', '1.25rem'],
      base: ['1rem', '1.5rem'],
      lg: ['1.125rem', '1.75rem'],
      xl: ['1.25rem', '1.75rem'],
      '2xl': ['1.5rem', '2rem'],
      '3xl': ['1.875rem', '2.25rem'],
      '4xl': ['2.25rem', '2.5rem'],
      '5xl': ['3rem', '1'],
      '6xl': ['3.75rem', '1'],
      '7xl': ['4.5rem', '1'],
      '8xl': ['6rem', '1'],
      '9xl': ['8rem', '1']
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    },
    gap: /* #__PURE__ */alias('spacing'),
    gradientColorStops: /* #__PURE__ */alias('colors'),
    gridAutoColumns: {
      auto: 'auto',
      min: 'min-content',
      max: 'max-content',
      fr: 'minmax(0,1fr)'
    },
    gridAutoRows: {
      auto: 'auto',
      min: 'min-content',
      max: 'max-content',
      fr: 'minmax(0,1fr)'
    },
    gridColumn: {
      // span-X is handled by the plugin: span-1 -> span 1 / span 1
      auto: 'auto',
      'span-full': '1 / -1'
    },
    // gridColumnEnd: {
    //   // Defaults handled by plugin
    // },
    // gridColumnStart: {
    //   // Defaults handled by plugin
    // },
    gridRow: {
      // span-X is handled by the plugin: span-1 -> span 1 / span 1
      auto: 'auto',
      'span-full': '1 / -1'
    },
    // gridRowStart: {
    //   // Defaults handled by plugin
    // },
    // gridRowEnd: {
    //   // Defaults handled by plugin
    // },
    gridTemplateColumns: {
      // numbers are handled by the plugin: 1 -> repeat(1, minmax(0, 1fr))
      none: 'none'
    },
    gridTemplateRows: {
      // numbers are handled by the plugin: 1 -> repeat(1, minmax(0, 1fr))
      none: 'none'
    },
    height: ({
      theme
    }) => ({
      ...theme('spacing'),
      ...ratios(2, 6),
      // '1/2': '50%',
      // '1/3': '33.333333%',
      // '2/3': '66.666667%',
      // '1/4': '25%',
      // '2/4': '50%',
      // '3/4': '75%',
      // '1/5': '20%',
      // '2/5': '40%',
      // '3/5': '60%',
      // '4/5': '80%',
      // '1/6': '16.666667%',
      // '2/6': '33.333333%',
      // '3/6': '50%',
      // '4/6': '66.666667%',
      // '5/6': '83.333333%',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
      auto: 'auto',
      full: '100%',
      screen: '100vh'
    }),
    inset: ({
      theme
    }) => ({
      ...theme('spacing'),
      ...ratios(2, 4),
      // '1/2': '50%',
      // '1/3': '33.333333%',
      // '2/3': '66.666667%',
      // '1/4': '25%',
      // '2/4': '50%',
      // '3/4': '75%',
      auto: 'auto',
      full: '100%'
    }),
    keyframes: {
      spin: {
        from: {
          transform: 'rotate(0deg)'
        },
        to: {
          transform: 'rotate(360deg)'
        }
      },
      ping: {
        '0%': {
          transform: 'scale(1)',
          opacity: '1'
        },
        '75%,100%': {
          transform: 'scale(2)',
          opacity: '0'
        }
      },
      pulse: {
        '0%,100%': {
          opacity: '1'
        },
        '50%': {
          opacity: '.5'
        }
      },
      bounce: {
        '0%, 100%': {
          transform: 'translateY(-25%)',
          animationTimingFunction: 'cubic-bezier(0.8,0,1,1)'
        },
        '50%': {
          transform: 'none',
          animationTimingFunction: 'cubic-bezier(0,0,0.2,1)'
        }
      }
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    },
    lineHeight: {
      ... /* #__PURE__ */linear(10, 'rem', 4, 3),
      // 3: '.75rem',
      // 4: '1rem',
      // 5: '1.25rem',
      // 6: '1.5rem',
      // 7: '1.75rem',
      // 8: '2rem',
      // 9: '2.25rem',
      // 10: '2.5rem',
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    },
    // listStyleType: {
    //   // Defaults handled by plugin
    // },
    margin: ({
      theme
    }) => ({
      auto: 'auto',
      ...theme('spacing')
    }),
    maxHeight: ({
      theme
    }) => ({
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
      screen: '100vh',
      ...theme('spacing')
    }),
    maxWidth: ({
      theme,
      breakpoints
    }) => ({
      ...breakpoints(theme('screens')),
      none: 'none',
      0: '0rem',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
      prose: '65ch'
    }),
    minHeight: {
      0: '0px',
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
      screen: '100vh'
    },
    minWidth: {
      0: '0px',
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content'
    },
    // objectPosition: {
    //   // The plugins joins all arguments by default
    // },
    opacity: {
      ... /* #__PURE__ */linear(100, '', 100, 0, 10),
      // 0: '0',
      // 10: '0.1',
      // 20: '0.2',
      // 30: '0.3',
      // 40: '0.4',
      // 60: '0.6',
      // 70: '0.7',
      // 80: '0.8',
      // 90: '0.9',
      // 100: '1',
      5: '0.05',
      25: '0.25',
      75: '0.75',
      95: '0.95'
    },
    order: {
      // Handled by plugin
      // 1: '1',
      // 2: '2',
      // 3: '3',
      // 4: '4',
      // 5: '5',
      // 6: '6',
      // 7: '7',
      // 8: '8',
      // 9: '9',
      // 10: '10',
      // 11: '11',
      // 12: '12',
      first: '-9999',
      last: '9999',
      none: '0'
    },
    padding: /* #__PURE__ */alias('spacing'),
    placeholderColor: /* #__PURE__ */alias('colors'),
    placeholderOpacity: /* #__PURE__ */alias('opacity'),
    outlineColor: /* #__PURE__ */alias('colors'),
    outlineOffset: /* #__PURE__ */exponential(8, 'px'),
    // 0: '0px',
    // 1: '1px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',,
    outlineWidth: /* #__PURE__ */exponential(8, 'px'),
    // 0: '0px',
    // 1: '1px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',,
    ringColor: ({
      theme
    }) => ({
      ...theme('colors'),
      DEFAULT: '#3b82f6'
    }),
    ringOffsetColor: /* #__PURE__ */alias('colors'),
    ringOffsetWidth: /* #__PURE__ */exponential(8, 'px'),
    // 0: '0px',
    // 1: '1px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',,
    ringOpacity: ({
      theme
    }) => ({
      ...theme('opacity'),
      DEFAULT: '0.5'
    }),
    ringWidth: {
      DEFAULT: '3px',
      ... /* #__PURE__ */exponential(8, 'px')
    },
    // 0: '0px',
    // 1: '1px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',
    rotate: {
      ... /* #__PURE__ */exponential(2, 'deg'),
      // 0: '0deg',
      // 1: '1deg',
      // 2: '2deg',
      ... /* #__PURE__ */exponential(12, 'deg', 3),
      // 3: '3deg',
      // 6: '6deg',
      // 12: '12deg',
      ... /* #__PURE__ */exponential(180, 'deg', 45)
    },
    // 45: '45deg',
    // 90: '90deg',
    // 180: '180deg',
    saturate: /* #__PURE__ */linear(200, '', 100, 0, 50),
    // 0: '0',
    // 50: '.5',
    // 100: '1',
    // 150: '1.5',
    // 200: '2',
    scale: {
      ... /* #__PURE__ */linear(150, '', 100, 0, 50),
      // 0: '0',
      // 50: '.5',
      // 150: '1.5',
      ... /* #__PURE__ */linear(110, '', 100, 90, 5),
      // 90: '.9',
      // 95: '.95',
      // 100: '1',
      // 105: '1.05',
      // 110: '1.1',
      75: '0.75',
      125: '1.25'
    },
    scrollMargin: /* #__PURE__ */alias('spacing'),
    scrollPadding: /* #__PURE__ */alias('spacing'),
    sepia: {
      0: '0',
      DEFAULT: '100%'
    },
    skew: {
      ... /* #__PURE__ */exponential(2, 'deg'),
      // 0: '0deg',
      // 1: '1deg',
      // 2: '2deg',
      ... /* #__PURE__ */exponential(12, 'deg', 3)
    },
    // 3: '3deg',
    // 6: '6deg',
    // 12: '12deg',
    space: /* #__PURE__ */alias('spacing'),
    stroke: ({
      theme
    }) => ({
      ...theme('colors'),
      none: 'none'
    }),
    strokeWidth: /* #__PURE__ */linear(2),
    // 0: '0',
    // 1: '1',
    // 2: '2',,
    textColor: /* #__PURE__ */alias('colors'),
    textDecorationColor: /* #__PURE__ */alias('colors'),
    textDecorationThickness: {
      'from-font': 'from-font',
      auto: 'auto',
      ... /* #__PURE__ */exponential(8, 'px')
    },
    // 0: '0px',
    // 1: '1px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',
    textUnderlineOffset: {
      auto: 'auto',
      ... /* #__PURE__ */exponential(8, 'px')
    },
    // 0: '0px',
    // 1: '1px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',
    textIndent: /* #__PURE__ */alias('spacing'),
    textOpacity: /* #__PURE__ */alias('opacity'),
    // transformOrigin: {
    //   // The following are already handled by the plugin:
    //   // center, right, left, bottom, top
    //   // 'bottom-10px-right-20px' -> bottom 10px right 20px
    // },
    transitionDuration: ({
      theme
    }) => ({
      ...theme('durations'),
      DEFAULT: '150ms'
    }),
    transitionDelay: /* #__PURE__ */alias('durations'),
    transitionProperty: {
      none: 'none',
      all: 'all',
      DEFAULT: 'color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter',
      colors: 'color,background-color,border-color,text-decoration-color,fill,stroke',
      opacity: 'opacity',
      shadow: 'box-shadow',
      transform: 'transform'
    },
    transitionTimingFunction: {
      DEFAULT: 'cubic-bezier(0.4,0,0.2,1)',
      linear: 'linear',
      in: 'cubic-bezier(0.4,0,1,1)',
      out: 'cubic-bezier(0,0,0.2,1)',
      'in-out': 'cubic-bezier(0.4,0,0.2,1)'
    },
    translate: ({
      theme
    }) => ({
      ...theme('spacing'),
      ...ratios(2, 4),
      // '1/2': '50%',
      // '1/3': '33.333333%',
      // '2/3': '66.666667%',
      // '1/4': '25%',
      // '2/4': '50%',
      // '3/4': '75%',
      full: '100%'
    }),
    width: ({
      theme
    }) => ({
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
      screen: '100vw',
      ...theme('flexBasis')
    }),
    willChange: {
      scroll: 'scroll-position'
    },
    // other options handled by rules
    // auto: 'auto',
    // contents: 'contents',
    // transform: 'transform',
    zIndex: {
      ... /* #__PURE__ */linear(50, '', 1, 0, 10),
      // 0: '0',
      // 10: '10',
      // 20: '20',
      // 30: '30',
      // 40: '40',
      // 50: '50',
      auto: 'auto'
    }
  };
  // '1/2': '50%',
  // '1/3': '33.333333%',
  // '2/3': '66.666667%',
  // '1/4': '25%',
  // '2/4': '50%',
  // '3/4': '75%',
  // '1/5': '20%',
  // '2/5': '40%',
  // '3/5': '60%',
  // '4/5': '80%',
  // '1/6': '16.666667%',
  // '2/6': '33.333333%',
  // '3/6': '50%',
  // '4/6': '66.666667%',
  // '5/6': '83.333333%',
  function ratios(start, end) {
    let result = {};
    do
    // XXX: using var to avoid strange bug when generating cjs where `= 1` is removed
    // eslint-disable-next-line no-var
    for (var dividend = 1; dividend < start; dividend++) result[`${dividend}/${start}`] = Number((dividend / start * 100).toFixed(6)) + '%'; while (++start <= end);
    return result;
  }
  // 0: '0px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',
  function exponential(stop, unit, start = 0) {
    let result = {};
    for (; start <= stop; start = 2 * start || 1) result[start] = start + unit;
    return result;
  }
  // 3: '.75rem',
  // 4: '1rem',
  // 5: '1.25rem',
  // 6: '1.5rem',
  // 7: '1.75rem',
  // 8: '2rem',
  // 9: '2.25rem',
  // 10: '2.5rem',
  function linear(stop, unit = '', divideBy = 1, start = 0, step = 1, result = {})
  // eslint-disable-next-line max-params
  {
    for (; start <= stop; start += step) result[start] = start / divideBy + unit;
    return result;
  }
  function alias(section) {
    return ({
      theme
    }) => theme(section);
  }

  let preflight = {
    /*
    1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
    2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
    */
    '*,::before,::after': {
      boxSizing: 'border-box',
      /* 1 */borderWidth: '0',
      /* 2 */borderStyle: 'solid',
      /* 2 */borderColor: 'theme(borderColor.DEFAULT, currentColor)'
    },
    /* 2 */'::before,::after': {
      '--tw-content': "''"
    },
    /*
    1. Use a consistent sensible line-height in all browsers.
    2. Prevent adjustments of font size after orientation changes in iOS.
    3. Use a more readable tab size.
    4. Use the user's configured `sans` font-family by default.
    5. Use the user's configured `sans` font-feature-settings by default.
    */
    html: {
      lineHeight: 1.5,
      /* 1 */WebkitTextSizeAdjust: '100%',
      /* 2 */MozTabSize: '4',
      /* 3 */tabSize: 4,
      /* 3 */fontFamily: `theme(fontFamily.sans, ${theme.fontFamily.sans})`,
      /* 4 */fontFeatureSettings: 'theme(fontFamily.sans[1].fontFeatureSettings, normal)'
    },
    /* 5 */ /*
            1. Remove the margin in all browsers.
            2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.
            */body: {
      margin: '0',
      /* 1 */lineHeight: 'inherit'
    },
    /* 2 */ /*
            1. Add the correct height in Firefox.
            2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
            3. Ensure horizontal rules are visible by default.
            */hr: {
      height: '0',
      /* 1 */color: 'inherit',
      /* 2 */borderTopWidth: '1px'
    },
    /* 3 */ /*
            Add the correct text decoration in Chrome, Edge, and Safari.
            */'abbr:where([title])': {
      textDecoration: 'underline dotted'
    },
    /*
    Remove the default font size and weight for headings.
    */
    'h1,h2,h3,h4,h5,h6': {
      fontSize: 'inherit',
      fontWeight: 'inherit'
    },
    /*
    Reset links to optimize for opt-in styling instead of opt-out.
    */
    a: {
      color: 'inherit',
      textDecoration: 'inherit'
    },
    /*
    Add the correct font weight in Edge and Safari.
    */
    'b,strong': {
      fontWeight: 'bolder'
    },
    /*
    1. Use the user's configured `mono` font family by default.
    2. Use the user's configured `mono` font-feature-settings by default.
    3. Correct the odd `em` font sizing in all browsers.
    */
    'code,kbd,samp,pre': {
      fontFamily: `theme(fontFamily.mono, ${theme.fontFamily.mono})`,
      fontFeatureSettings: 'theme(fontFamily.mono[1].fontFeatureSettings, normal)',
      fontSize: '1em'
    },
    /*
    Add the correct font size in all browsers.
    */
    small: {
      fontSize: '80%'
    },
    /*
    Prevent `sub` and `sup` elements from affecting the line height in all browsers.
    */
    'sub,sup': {
      fontSize: '75%',
      lineHeight: 0,
      position: 'relative',
      verticalAlign: 'baseline'
    },
    sub: {
      bottom: '-0.25em'
    },
    sup: {
      top: '-0.5em'
    },
    /*
    1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
    2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
    3. Remove gaps between table borders by default.
    */
    table: {
      textIndent: '0',
      /* 1 */borderColor: 'inherit',
      /* 2 */borderCollapse: 'collapse'
    },
    /* 3 */ /*
            1. Change the font styles in all browsers.
            2. Remove the margin in Firefox and Safari.
            3. Remove default padding in all browsers.
            */'button,input,optgroup,select,textarea': {
      fontFamily: 'inherit',
      /* 1 */fontSize: '100%',
      /* 1 */lineHeight: 'inherit',
      /* 1 */color: 'inherit',
      /* 1 */margin: '0',
      /* 2 */padding: '0'
    },
    /* 3 */ /*
            Remove the inheritance of text transform in Edge and Firefox.
            */'button,select': {
      textTransform: 'none'
    },
    /*
    1. Correct the inability to style clickable types in iOS and Safari.
    2. Remove default button styles.
    */
    "button,[type='button'],[type='reset'],[type='submit']": {
      WebkitAppearance: 'button',
      /* 1 */backgroundColor: 'transparent',
      /* 2 */backgroundImage: 'none'
    },
    /* 4 */ /*
            Use the modern Firefox focus style for all focusable elements.
            */':-moz-focusring': {
      outline: 'auto'
    },
    /*
    Remove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
    */
    ':-moz-ui-invalid': {
      boxShadow: 'none'
    },
    /*
    Add the correct vertical alignment in Chrome and Firefox.
    */
    progress: {
      verticalAlign: 'baseline'
    },
    /*
    Correct the cursor style of increment and decrement buttons in Safari.
    */
    '::-webkit-inner-spin-button,::-webkit-outer-spin-button': {
      height: 'auto'
    },
    /*
    1. Correct the odd appearance in Chrome and Safari.
    2. Correct the outline style in Safari.
    */
    "[type='search']": {
      WebkitAppearance: 'textfield',
      /* 1 */outlineOffset: '-2px'
    },
    /* 2 */ /*
            Remove the inner padding in Chrome and Safari on macOS.
            */'::-webkit-search-decoration': {
      WebkitAppearance: 'none'
    },
    /*
    1. Correct the inability to style clickable types in iOS and Safari.
    2. Change font properties to `inherit` in Safari.
    */
    '::-webkit-file-upload-button': {
      WebkitAppearance: 'button',
      /* 1 */font: 'inherit'
    },
    /* 2 */ /*
            Add the correct display in Chrome and Safari.
            */summary: {
      display: 'list-item'
    },
    /*
    Removes the default spacing and border for appropriate elements.
    */
    'blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre': {
      margin: '0'
    },
    fieldset: {
      margin: '0',
      padding: '0'
    },
    legend: {
      padding: '0'
    },
    'ol,ul,menu': {
      listStyle: 'none',
      margin: '0',
      padding: '0'
    },
    /*
    Prevent resizing textareas horizontally by default.
    */
    textarea: {
      resize: 'vertical'
    },
    /*
    1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
    2. Set the default placeholder color to the user's configured gray 400 color.
    */
    'input::placeholder,textarea::placeholder': {
      opacity: 1,
      /* 1 */color: 'theme(colors.gray.400, #9ca3af)'
    },
    /* 2 */ /*
            Set the default cursor for buttons.
            */'button,[role="button"]': {
      cursor: 'pointer'
    },
    /*
    Make sure disabled buttons don't get the pointer cursor.
    */
    ':disabled': {
      cursor: 'default'
    },
    /*
    1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)
    2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
      This can trigger a poorly considered lint error in some tools but is included by design.
    */
    'img,svg,video,canvas,audio,iframe,embed,object': {
      display: 'block',
      /* 1 */verticalAlign: 'middle'
    },
    /* 2 */ /*
            Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
            */'img,video': {
      maxWidth: '100%',
      height: 'auto'
    },
    /* Make elements with the HTML hidden attribute stay hidden by default */'[hidden]': {
      display: 'none'
    }
  };

  // indirection wrapper to remove autocomplete functions from production bundles
  let rules = [/* arbitrary properties: [paint-order:markers] */match('\\[([-\\w]+):(.+)]', ({
    1: $1,
    2: $2
  }, context) => ({
    '@layer overrides': {
      '&': {
        [$1]: arbitrary(`[${$2}]`, '', context)
      }
    }
  })), /* Styling based on parent and peer state */match('(group|peer)([~/][^-[]+)?', ({
    input
  }, {
    h
  }) => [{
    c: h(input)
  }]), /* LAYOUT */matchTheme('aspect-', 'aspectRatio'), match('container', (_, {
    theme
  }) => {
    let {
        screens = theme('screens'),
        center,
        padding
      } = theme('container'),
      rules = {
        width: '100%',
        marginRight: center && 'auto',
        marginLeft: center && 'auto',
        ...paddingFor('xs')
      };
    for (let screen in screens) {
      let value = screens[screen];
      'string' == typeof value && (rules[mql(value)] = {
        '&': {
          maxWidth: value,
          ...paddingFor(screen)
        }
      });
    }
    return rules;
    function paddingFor(screen) {
      let value = padding && ('string' == typeof padding ? padding : padding[screen] || padding.DEFAULT);
      if (value) return {
        paddingRight: value,
        paddingLeft: value
      };
    }
  }),
  // Content
  matchTheme('content-', 'content', ({
    _
  }) => ({
    '--tw-content': _,
    content: 'var(--tw-content)'
  })),
  // Box Decoration Break
  match('(?:box-)?decoration-(slice|clone)', 'boxDecorationBreak'),
  // Box Sizing
  match('box-(border|content)', 'boxSizing', ({
    1: $1
  }) => $1 + '-box'),
  // Display
  match('hidden', {
    display: 'none'
  }),
  // Table Layout
  match('table-(auto|fixed)', 'tableLayout'), match(['(block|flex|table|grid|inline|contents|flow-root|list-item)', '(inline-(block|flex|table|grid))', '(table-(caption|cell|column|row|(column|row|footer|header)-group))'], 'display'),
  // Floats
  '(float)-(left|right|none)',
  // Clear
  '(clear)-(left|right|none|both)',
  // Overflow
  '(overflow(?:-[xy])?)-(auto|hidden|clip|visible|scroll)',
  // Isolation
  '(isolation)-(auto)',
  // Isolation
  match('isolate', 'isolation'),
  // Object Fit
  match('object-(contain|cover|fill|none|scale-down)', 'objectFit'),
  // Object Position
  matchTheme('object-', 'objectPosition'), match('object-(top|bottom|center|(left|right)(-(top|bottom))?)', 'objectPosition', spacify),
  // Overscroll Behavior
  match('overscroll(-[xy])?-(auto|contain|none)', ({
    1: $1 = '',
    2: $2
  }) => ({
    ['overscroll-behavior' + $1]: $2
  })),
  // Position
  match('(static|fixed|absolute|relative|sticky)', 'position'),
  // Top / Right / Bottom / Left
  matchTheme('-?inset(-[xy])?(?:$|-)', 'inset', ({
    1: $1,
    _
  }) => ({
    top: '-x' != $1 && _,
    right: '-y' != $1 && _,
    bottom: '-x' != $1 && _,
    left: '-y' != $1 && _
  })), matchTheme('-?(top|bottom|left|right)(?:$|-)', 'inset'),
  // Visibility
  match('(visible|collapse)', 'visibility'), match('invisible', {
    visibility: 'hidden'
  }),
  // Z-Index
  matchTheme('-?z-', 'zIndex'), /* FLEXBOX */ // Flex Direction
  match('flex-((row|col)(-reverse)?)', 'flexDirection', columnify), match('flex-(wrap|wrap-reverse|nowrap)', 'flexWrap'), matchTheme('(flex-(?:grow|shrink))(?:$|-)'), /*, 'flex-grow' | flex-shrink */matchTheme('(flex)-'), /*, 'flex' */matchTheme('grow(?:$|-)', 'flexGrow'), matchTheme('shrink(?:$|-)', 'flexShrink'), matchTheme('basis-', 'flexBasis'), matchTheme('-?(order)-'), /*, 'order' */'-?(order)-(\\d+)', /* GRID */ // Grid Template Columns
  matchTheme('grid-cols-', 'gridTemplateColumns'), match('grid-cols-(\\d+)', 'gridTemplateColumns', gridTemplate),
  // Grid Column Start / End
  matchTheme('col-', 'gridColumn'), match('col-(span)-(\\d+)', 'gridColumn', span), matchTheme('col-start-', 'gridColumnStart'), match('col-start-(auto|\\d+)', 'gridColumnStart'), matchTheme('col-end-', 'gridColumnEnd'), match('col-end-(auto|\\d+)', 'gridColumnEnd'),
  // Grid Template Rows
  matchTheme('grid-rows-', 'gridTemplateRows'), match('grid-rows-(\\d+)', 'gridTemplateRows', gridTemplate),
  // Grid Row Start / End
  matchTheme('row-', 'gridRow'), match('row-(span)-(\\d+)', 'gridRow', span), matchTheme('row-start-', 'gridRowStart'), match('row-start-(auto|\\d+)', 'gridRowStart'), matchTheme('row-end-', 'gridRowEnd'), match('row-end-(auto|\\d+)', 'gridRowEnd'),
  // Grid Auto Flow
  match('grid-flow-((row|col)(-dense)?)', 'gridAutoFlow', match => spacify(columnify(match))), match('grid-flow-(dense)', 'gridAutoFlow'),
  // Grid Auto Columns
  matchTheme('auto-cols-', 'gridAutoColumns'),
  // Grid Auto Rows
  matchTheme('auto-rows-', 'gridAutoRows'),
  // Gap
  matchTheme('gap-x(?:$|-)', 'gap', 'columnGap'), matchTheme('gap-y(?:$|-)', 'gap', 'rowGap'), matchTheme('gap(?:$|-)', 'gap'), /* BOX ALIGNMENT */ // Justify Items
  // Justify Self
  '(justify-(?:items|self))-',
  // Justify Content
  match('justify-', 'justifyContent', convertContentValue),
  // Align Content
  // Align Items
  // Align Self
  match('(content|items|self)-', match => ({
    ['align-' + match[1]]: convertContentValue(match)
  })),
  // Place Content
  // Place Items
  // Place Self
  match('(place-(content|items|self))-', ({
    1: $1,
    $$
  }) => ({
    [$1]: ('wun'.includes($$[3]) ? 'space-' : '') + $$
  })), /* SPACING */ // Padding
  matchTheme('p([xytrbl])?(?:$|-)', 'padding', edge('padding')),
  // Margin
  matchTheme('-?m([xytrbl])?(?:$|-)', 'margin', edge('margin')),
  // Space Between
  matchTheme('-?space-(x|y)(?:$|-)', 'space', ({
    1: $1,
    _
  }) => ({
    '&>:not([hidden])~:not([hidden])': {
      [`--tw-space-${$1}-reverse`]: '0',
      ['margin-' + {
        y: 'top',
        x: 'left'
      }[$1]]: `calc(${_} * calc(1 - var(--tw-space-${$1}-reverse)))`,
      ['margin-' + {
        y: 'bottom',
        x: 'right'
      }[$1]]: `calc(${_} * var(--tw-space-${$1}-reverse))`
    }
  })), match('space-(x|y)-reverse', ({
    1: $1
  }) => ({
    '&>:not([hidden])~:not([hidden])': {
      [`--tw-space-${$1}-reverse`]: '1'
    }
  })), /* SIZING */ // Width
  matchTheme('w-', 'width'),
  // Min-Width
  matchTheme('min-w-', 'minWidth'),
  // Max-Width
  matchTheme('max-w-', 'maxWidth'),
  // Height
  matchTheme('h-', 'height'),
  // Min-Height
  matchTheme('min-h-', 'minHeight'),
  // Max-Height
  matchTheme('max-h-', 'maxHeight'), /* TYPOGRAPHY */ // Font Weight
  matchTheme('font-', 'fontWeight'),
  // Font Family
  matchTheme('font-', 'fontFamily', ({
    _
  }) => {
    return 'string' == typeof (_ = asArray(_))[1] ? {
      fontFamily: join(_)
    } : {
      fontFamily: join(_[0]),
      ..._[1]
    };
  }),
  // Font Smoothing
  match('antialiased', {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  }), match('subpixel-antialiased', {
    WebkitFontSmoothing: 'auto',
    MozOsxFontSmoothing: 'auto'
  }),
  // Font Style
  match('italic', 'fontStyle'), match('not-italic', {
    fontStyle: 'normal'
  }),
  // Font Variant Numeric
  match('(ordinal|slashed-zero|(normal|lining|oldstyle|proportional|tabular)-nums|(diagonal|stacked)-fractions)', ({
    1: $1,
    2: $2 = '',
    3: $3
  }) =>
  // normal-nums
  'normal' == $2 ? {
    fontVariantNumeric: 'normal'
  } : {
    ['--tw-' + ($3 ?
    // diagonal-fractions, stacked-fractions
    'numeric-fraction' : 'pt'.includes($2[0]) ?
    // proportional-nums, tabular-nums
    'numeric-spacing' : $2 ?
    // lining-nums, oldstyle-nums
    'numeric-figure' :
    // ordinal, slashed-zero
    $1)]: $1,
    fontVariantNumeric: 'var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)',
    ...asDefaults({
      '--tw-ordinal': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-slashed-zero': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-numeric-figure': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-numeric-spacing': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-numeric-fraction': 'var(--tw-empty,/*!*/ /*!*/)'
    })
  }),
  // Letter Spacing
  matchTheme('tracking-', 'letterSpacing'),
  // Line Height
  matchTheme('leading-', 'lineHeight'),
  // List Style Position
  match('list-(inside|outside)', 'listStylePosition'),
  // List Style Type
  matchTheme('list-', 'listStyleType'), match('list-', 'listStyleType'),
  // Placeholder Opacity
  matchTheme('placeholder-opacity-', 'placeholderOpacity', ({
    _
  }) => ({
    '&::placeholder': {
      '--tw-placeholder-opacity': _
    }
  })),
  // Placeholder Color
  matchColor('placeholder-', {
    property: 'color',
    selector: '&::placeholder'
  }),
  // Text Alignment
  match('text-(left|center|right|justify|start|end)', 'textAlign'), match('text-(ellipsis|clip)', 'textOverflow'),
  // Text Opacity
  matchTheme('text-opacity-', 'textOpacity', '--tw-text-opacity'),
  // Text Color
  matchColor('text-', {
    property: 'color'
  }),
  // Font Size
  matchTheme('text-', 'fontSize', ({
    _
  }) => 'string' == typeof _ ? {
    fontSize: _
  } : {
    fontSize: _[0],
    ...('string' == typeof _[1] ? {
      lineHeight: _[1]
    } : _[1])
  }),
  // Text Indent
  matchTheme('indent-', 'textIndent'),
  // Text Decoration
  match('(overline|underline|line-through)', 'textDecorationLine'), match('no-underline', {
    textDecorationLine: 'none'
  }),
  // Text Underline offset
  matchTheme('underline-offset-', 'textUnderlineOffset'),
  // Text Decoration Color
  matchColor('decoration-', {
    section: 'textDecorationColor',
    opacityVariable: false,
    opacitySection: 'opacity'
  }),
  // Text Decoration Thickness
  matchTheme('decoration-', 'textDecorationThickness'),
  // Text Decoration Style
  match('decoration-', 'textDecorationStyle'),
  // Text Transform
  match('(uppercase|lowercase|capitalize)', 'textTransform'), match('normal-case', {
    textTransform: 'none'
  }),
  // Text Overflow
  match('truncate', {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }),
  // Vertical Alignment
  match('align-', 'verticalAlign'),
  // Whitespace
  match('whitespace-', 'whiteSpace'),
  // Word Break
  match('break-normal', {
    wordBreak: 'normal',
    overflowWrap: 'normal'
  }), match('break-words', {
    overflowWrap: 'break-word'
  }), match('break-all', {
    wordBreak: 'break-all'
  }), match('break-keep', {
    wordBreak: 'keep-all'
  }),
  // Caret Color
  matchColor('caret-', {
    // section: 'caretColor',
    opacityVariable: false,
    opacitySection: 'opacity'
  }),
  // Accent Color
  matchColor('accent-', {
    // section: 'accentColor',
    opacityVariable: false,
    opacitySection: 'opacity'
  }),
  // Gradient Color Stops
  match('bg-gradient-to-([trbl]|[tb][rl])', 'backgroundImage', ({
    1: $1
  }) => `linear-gradient(to ${position($1, ' ')},var(--tw-gradient-stops))`), matchColor('from-', {
    section: 'gradientColorStops',
    opacityVariable: false,
    opacitySection: 'opacity'
  }, ({
    _
  }) => ({
    '--tw-gradient-from': _.value,
    '--tw-gradient-to': _.color({
      opacityValue: '0'
    }),
    '--tw-gradient-stops': "var(--tw-gradient-from),var(--tw-gradient-to)"
  })), matchColor('via-', {
    section: 'gradientColorStops',
    opacityVariable: false,
    opacitySection: 'opacity'
  }, ({
    _
  }) => ({
    '--tw-gradient-to': _.color({
      opacityValue: '0'
    }),
    '--tw-gradient-stops': `var(--tw-gradient-from),${_.value},var(--tw-gradient-to)`
  })), matchColor('to-', {
    section: 'gradientColorStops',
    property: '--tw-gradient-to',
    opacityVariable: false,
    opacitySection: 'opacity'
  }), /* BACKGROUNDS */ // Background Attachment
  match('bg-(fixed|local|scroll)', 'backgroundAttachment'),
  // Background Origin
  match('bg-origin-(border|padding|content)', 'backgroundOrigin', ({
    1: $1
  }) => $1 + '-box'),
  // Background Repeat
  match(['bg-(no-repeat|repeat(-[xy])?)', 'bg-repeat-(round|space)'], 'backgroundRepeat'),
  // Background Blend Mode
  match('bg-blend-', 'backgroundBlendMode'),
  // Background Clip
  match('bg-clip-(border|padding|content|text)', 'backgroundClip', ({
    1: $1
  }) => $1 + ('text' == $1 ? '' : '-box')),
  // Background Opacity
  matchTheme('bg-opacity-', 'backgroundOpacity', '--tw-bg-opacity'),
  // Background Color
  // bg-${backgroundColor}/${backgroundOpacity}
  matchColor('bg-', {
    section: 'backgroundColor'
  }),
  // Background Image
  // supported arbitrary types are: length, color, angle, list
  matchTheme('bg-', 'backgroundImage'),
  // Background Position
  matchTheme('bg-', 'backgroundPosition'), match('bg-(top|bottom|center|(left|right)(-(top|bottom))?)', 'backgroundPosition', spacify),
  // Background Size
  matchTheme('bg-', 'backgroundSize'), /* BORDERS */ // Border Radius
  matchTheme('rounded(?:$|-)', 'borderRadius'), matchTheme('rounded-([trbl]|[tb][rl])(?:$|-)', 'borderRadius', ({
    1: $1,
    _
  }) => {
    let corners = {
      t: ['tl', 'tr'],
      r: ['tr', 'br'],
      b: ['bl', 'br'],
      l: ['bl', 'tl']
    }[$1] || [$1, $1];
    return {
      [`border-${position(corners[0])}-radius`]: _,
      [`border-${position(corners[1])}-radius`]: _
    };
  }),
  // Border Collapse
  match('border-(collapse|separate)', 'borderCollapse'),
  // Border Opacity
  matchTheme('border-opacity(?:$|-)', 'borderOpacity', '--tw-border-opacity'),
  // Border Style
  match('border-(solid|dashed|dotted|double|none)', 'borderStyle'),
  // Border Spacing
  matchTheme('border-spacing(-[xy])?(?:$|-)', 'borderSpacing', ({
    1: $1,
    _
  }) => ({
    ...asDefaults({
      '--tw-border-spacing-x': '0',
      '--tw-border-spacing-y': '0'
    }),
    ['--tw-border-spacing' + ($1 || '-x')]: _,
    ['--tw-border-spacing' + ($1 || '-y')]: _,
    'border-spacing': 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)'
  })),
  // Border Color
  matchColor('border-([xytrbl])-', {
    section: 'borderColor'
  }, edge('border', 'Color')), matchColor('border-'),
  // Border Width
  matchTheme('border-([xytrbl])(?:$|-)', 'borderWidth', edge('border', 'Width')), matchTheme('border(?:$|-)', 'borderWidth'),
  // Divide Opacity
  matchTheme('divide-opacity(?:$|-)', 'divideOpacity', ({
    _
  }) => ({
    '&>:not([hidden])~:not([hidden])': {
      '--tw-divide-opacity': _
    }
  })),
  // Divide Style
  match('divide-(solid|dashed|dotted|double|none)', ({
    1: $1
  }) => ({
    '&>:not([hidden])~:not([hidden])': {
      borderStyle: $1
    }
  })),
  // Divide Width
  match('divide-([xy]-reverse)', ({
    1: $1
  }) => ({
    '&>:not([hidden])~:not([hidden])': {
      ['--tw-divide-' + $1]: '1'
    }
  })), matchTheme('divide-([xy])(?:$|-)', 'divideWidth', ({
    1: $1,
    _
  }) => {
    let edges = {
      x: 'lr',
      y: 'tb'
    }[$1];
    return {
      '&>:not([hidden])~:not([hidden])': {
        [`--tw-divide-${$1}-reverse`]: '0',
        [`border-${position(edges[0])}Width`]: `calc(${_} * calc(1 - var(--tw-divide-${$1}-reverse)))`,
        [`border-${position(edges[1])}Width`]: `calc(${_} * var(--tw-divide-${$1}-reverse))`
      }
    };
  }),
  // Divide Color
  matchColor('divide-', {
    // section: $0.replace('-', 'Color') -> 'divideColor'
    property: 'borderColor',
    // opacityVariable: '--tw-border-opacity',
    // opacitySection: section.replace('Color', 'Opacity') -> 'divideOpacity'
    selector: '&>:not([hidden])~:not([hidden])'
  }),
  // Ring Offset Opacity
  matchTheme('ring-opacity(?:$|-)', 'ringOpacity', '--tw-ring-opacity'),
  // Ring Offset Color
  matchColor('ring-offset-', {
    // section: 'ringOffsetColor',
    property: '--tw-ring-offset-color',
    opacityVariable: false
  }),
  // opacitySection: section.replace('Color', 'Opacity') -> 'ringOffsetOpacity'
  // Ring Offset Width
  matchTheme('ring-offset(?:$|-)', 'ringOffsetWidth', '--tw-ring-offset-width'),
  // Ring Inset
  match('ring-inset', {
    '--tw-ring-inset': 'inset'
  }),
  // Ring Color
  matchColor('ring-', {
    // section: 'ringColor',
    property: '--tw-ring-color'
  }),
  // opacityVariable: '--tw-ring-opacity',
  // opacitySection: section.replace('Color', 'Opacity') -> 'ringOpacity'
  // Ring Width
  matchTheme('ring(?:$|-)', 'ringWidth', ({
    _
  }, {
    theme
  }) => ({
    ...asDefaults({
      '--tw-ring-offset-shadow': '0 0 #0000',
      '--tw-ring-shadow': '0 0 #0000',
      '--tw-shadow': '0 0 #0000',
      '--tw-shadow-colored': '0 0 #0000',
      // Within own declaration to have the defaults above to be merged with defaults from shadow
      '&': {
        '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-ring-offset-width': theme('ringOffsetWidth', '', '0px'),
        '--tw-ring-offset-color': toColorValue(theme('ringOffsetColor', '', '#fff')),
        '--tw-ring-color': toColorValue(theme('ringColor', '', '#93c5fd'), {
          opacityVariable: '--tw-ring-opacity'
        }),
        '--tw-ring-opacity': theme('ringOpacity', '', '0.5')
      }
    }),
    '--tw-ring-offset-shadow': "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
    '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${_} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
    boxShadow: "var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)"
  })), /* EFFECTS */ // Box Shadow Color
  matchColor('shadow-', {
    section: 'boxShadowColor',
    opacityVariable: false,
    opacitySection: 'opacity'
  }, ({
    _
  }) => ({
    '--tw-shadow-color': _.value,
    '--tw-shadow': 'var(--tw-shadow-colored)'
  })),
  // Box Shadow
  matchTheme('shadow(?:$|-)', 'boxShadow', ({
    _
  }) => ({
    ...asDefaults({
      '--tw-ring-offset-shadow': '0 0 #0000',
      '--tw-ring-shadow': '0 0 #0000',
      '--tw-shadow': '0 0 #0000',
      '--tw-shadow-colored': '0 0 #0000'
    }),
    '--tw-shadow': join(_),
    // replace all colors with reference to --tw-shadow-colored
    // this matches colors after non-comma char (keyword, offset) before comma or the end
    '--tw-shadow-colored': join(_).replace(/([^,]\s+)(?:#[a-f\d]+|(?:(?:hsl|rgb)a?|hwb|lab|lch|color|var)\(.+?\)|[a-z]+)(,|$)/g, '$1var(--tw-shadow-color)$2'),
    boxShadow: "var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)"
  })),
  // Opacity
  matchTheme('(opacity)-'), /*, 'opacity' */ // Mix Blend Mode
  match('mix-blend-', 'mixBlendMode'), /* FILTERS */...filter(), ...filter('backdrop-'), /* TRANSITIONS AND ANIMATION */ // Transition Property
  matchTheme('transition(?:$|-)', 'transitionProperty', (match, {
    theme
  }) => ({
    transitionProperty: join(match),
    transitionTimingFunction: 'none' == match._ ? void 0 : join(theme('transitionTimingFunction', '')),
    transitionDuration: 'none' == match._ ? void 0 : join(theme('transitionDuration', ''))
  })),
  // Transition Duration
  matchTheme('duration(?:$|-)', 'transitionDuration', 'transitionDuration', join),
  // Transition Timing Function
  matchTheme('ease(?:$|-)', 'transitionTimingFunction', 'transitionTimingFunction', join),
  // Transition Delay
  matchTheme('delay(?:$|-)', 'transitionDelay', 'transitionDelay', join), matchTheme('animate(?:$|-)', 'animation', (match, {
    theme,
    h,
    e
  }) => {
    let animation = join(match),
      // Try to auto inject keyframes
      parts = animation.split(' '),
      keyframeValues = theme('keyframes', parts[0]);
    return keyframeValues ? {
      ['@keyframes ' + (parts[0] = e(h(parts[0])))]: keyframeValues,
      animation: parts.join(' ')
    } : {
      animation
    };
  }), /* TRANSFORMS */ // Transform
  '(transform)-(none)', match('transform', tranformDefaults), match('transform-(cpu|gpu)', ({
    1: $1
  }) => ({
    '--tw-transform': transformValue('gpu' == $1)
  })),
  // Scale
  matchTheme('scale(-[xy])?-', 'scale', ({
    1: $1,
    _
  }) => ({
    ['--tw-scale' + ($1 || '-x')]: _,
    ['--tw-scale' + ($1 || '-y')]: _,
    ...tranformDefaults()
  })),
  // Rotate
  matchTheme('-?(rotate)-', 'rotate', transform),
  // Translate
  matchTheme('-?(translate-[xy])-', 'translate', transform),
  // Skew
  matchTheme('-?(skew-[xy])-', 'skew', transform),
  // Transform Origin
  match('origin-(center|((top|bottom)(-(left|right))?)|left|right)', 'transformOrigin', spacify), /* INTERACTIVITY */ // Appearance
  '(appearance)-',
  // Columns
  matchTheme('(columns)-'), /*, 'columns' */'(columns)-(\\d+)',
  // Break Before, After and Inside
  '(break-(?:before|after|inside))-',
  // Cursor
  matchTheme('(cursor)-'), /*, 'cursor' */'(cursor)-',
  // Scroll Snap Type
  match('snap-(none)', 'scroll-snap-type'), match('snap-(x|y|both)', ({
    1: $1
  }) => ({
    ...asDefaults({
      '--tw-scroll-snap-strictness': 'proximity'
    }),
    'scroll-snap-type': $1 + ' var(--tw-scroll-snap-strictness)'
  })), match('snap-(mandatory|proximity)', '--tw-scroll-snap-strictness'),
  // Scroll Snap Align
  match('snap-(?:(start|end|center)|align-(none))', 'scroll-snap-align'),
  // Scroll Snap Stop
  match('snap-(normal|always)', 'scroll-snap-stop'), match('scroll-(auto|smooth)', 'scroll-behavior'),
  // Scroll Margin
  // Padding
  matchTheme('scroll-p([xytrbl])?(?:$|-)', 'padding', edge('scroll-padding')),
  // Margin
  matchTheme('-?scroll-m([xytrbl])?(?:$|-)', 'scroll-margin', edge('scroll-margin')),
  // Touch Action
  match('touch-(auto|none|manipulation)', 'touch-action'), match('touch-(pinch-zoom|pan-(?:(x|left|right)|(y|up|down)))', ({
    1: $1,
    2: $2,
    3: $3
  }) => ({
    ...asDefaults({
      '--tw-pan-x': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-pan-y': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-pinch-zoom': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-touch-action': 'var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)'
    }),
    // x, left, right -> pan-x
    // y, up, down -> pan-y
    // -> pinch-zoom
    [`--tw-${$2 ? 'pan-x' : $3 ? 'pan-y' : $1}`]: $1,
    'touch-action': 'var(--tw-touch-action)'
  })),
  // Outline Style
  match('outline-none', {
    outline: '2px solid transparent',
    'outline-offset': '2px'
  }), match('outline', {
    outlineStyle: 'solid'
  }), match('outline-(dashed|dotted|double)', 'outlineStyle'),
  // Outline Offset
  matchTheme('-?(outline-offset)-'), /*, 'outlineOffset'*/ // Outline Color
  matchColor('outline-', {
    opacityVariable: false,
    opacitySection: 'opacity'
  }),
  // Outline Width
  matchTheme('outline-', 'outlineWidth'),
  // Pointer Events
  '(pointer-events)-',
  // Will Change
  matchTheme('(will-change)-'), /*, 'willChange' */'(will-change)-',
  // Resize
  ['resize(?:-(none|x|y))?', 'resize', ({
    1: $1
  }) => ({
    x: 'horizontal',
    y: 'vertical'
  })[$1] || $1 || 'both'],
  // User Select
  match('select-(none|text|all|auto)', 'userSelect'), /* SVG */ // Fill, Stroke
  matchColor('fill-', {
    section: 'fill',
    opacityVariable: false,
    opacitySection: 'opacity'
  }), matchColor('stroke-', {
    section: 'stroke',
    opacityVariable: false,
    opacitySection: 'opacity'
  }),
  // Stroke Width
  matchTheme('stroke-', 'strokeWidth'), /* ACCESSIBILITY */ // Screen Readers
  match('sr-only', {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    clip: 'rect(0,0,0,0)',
    borderWidth: '0'
  }), match('not-sr-only', {
    position: 'static',
    width: 'auto',
    height: 'auto',
    padding: '0',
    margin: '0',
    overflow: 'visible',
    whiteSpace: 'normal',
    clip: 'auto'
  })];
  function spacify(value) {
    return ('string' == typeof value ? value : value[1]).replace(/-/g, ' ').trim();
  }
  function columnify(value) {
    return ('string' == typeof value ? value : value[1]).replace('col', 'column');
  }
  function position(shorthand, separator = '-') {
    let longhand = [];
    for (let short of shorthand) longhand.push({
      t: 'top',
      r: 'right',
      b: 'bottom',
      l: 'left'
    }[short]);
    return longhand.join(separator);
  }
  function join(value) {
    return value && '' + (value._ || value);
  }
  function convertContentValue({
    $$
  }) {
    return ({
      // /* aut*/ o: '',
      /* sta*/
      r: /*t*/'flex-',
      /* end*/'': 'flex-',
      // /* cen*/ t /*er*/: '',
      /* bet*/
      w: /*een*/'space-',
      /* aro*/u: /*nd*/'space-',
      /* eve*/n: /*ly*/'space-'
    }[$$[3] || ''] || '') + $$;
  }
  function edge(propertyPrefix, propertySuffix = '') {
    return ({
      1: $1,
      _
    }) => {
      let edges = {
        x: 'lr',
        y: 'tb'
      }[$1] || $1 + $1;
      return edges ? {
        ...toCSS(propertyPrefix + '-' + position(edges[0]) + propertySuffix, _),
        ...toCSS(propertyPrefix + '-' + position(edges[1]) + propertySuffix, _)
      } : toCSS(propertyPrefix + propertySuffix, _);
    };
  }
  function filter(prefix = '') {
    let filters = ['blur', 'brightness', 'contrast', 'grayscale', 'hue-rotate', 'invert', prefix && 'opacity', 'saturate', 'sepia', !prefix && 'drop-shadow'].filter(Boolean),
      defaults = {};
    // first create properties defaults
    for (let key of filters) defaults[`--tw-${prefix}${key}`] = 'var(--tw-empty,/*!*/ /*!*/)';
    return defaults = {
      // move defaults
      ...asDefaults(defaults),
      // add default filter which allows standalone usage
      [`${prefix}filter`]: filters.map(key => `var(--tw-${prefix}${key})`).join(' ')
    }, [`(${prefix}filter)-(none)`, match(`${prefix}filter`, defaults), ...filters.map(key => matchTheme(
    // hue-rotate can be negated
    `${'h' == key[0] ? '-?' : ''}(${prefix}${key})(?:$|-)`, key, ({
      1: $1,
      _
    }) => ({
      [`--tw-${$1}`]: asArray(_).map(value => `${key}(${value})`).join(' '),
      ...defaults
    })))];
  }
  function transform({
    1: $1,
    _
  }) {
    return {
      ['--tw-' + $1]: _,
      ...tranformDefaults()
    };
  }
  function tranformDefaults() {
    return {
      ...asDefaults({
        '--tw-translate-x': '0',
        '--tw-translate-y': '0',
        '--tw-rotate': '0',
        '--tw-skew-x': '0',
        '--tw-skew-y': '0',
        '--tw-scale-x': '1',
        '--tw-scale-y': '1',
        '--tw-transform': transformValue()
      }),
      transform: 'var(--tw-transform)'
    };
  }
  function transformValue(gpu) {
    return [gpu ?
    // -gpu
    'translate3d(var(--tw-translate-x),var(--tw-translate-y),0)' : 'translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y))', 'rotate(var(--tw-rotate))', 'skewX(var(--tw-skew-x))', 'skewY(var(--tw-skew-y))', 'scaleX(var(--tw-scale-x))', 'scaleY(var(--tw-scale-y))'].join(' ');
  }
  function span({
    1: $1,
    2: $2
  }) {
    return `${$1} ${$2} / ${$1} ${$2}`;
  }
  function gridTemplate({
    1: $1
  }) {
    return `repeat(${$1},minmax(0,1fr))`;
  }
  function asDefaults(props) {
    return {
      '@layer defaults': {
        '*,::before,::after': props,
        '::backdrop': props
      }
    };
  }

  // indirection wrapper to remove autocomplete functions from production bundles
  let variants = [['sticky', '@supports ((position: -webkit-sticky) or (position:sticky))'], ['motion-reduce', '@media (prefers-reduced-motion:reduce)'], ['motion-safe', '@media (prefers-reduced-motion:no-preference)'], ['print', '@media print'], ['(portrait|landscape)', ({
    1: $1
  }) => `@media (orientation:${$1})`], ['contrast-(more|less)', ({
    1: $1
  }) => `@media (prefers-contrast:${$1})`], ['(first-(letter|line)|placeholder|backdrop|before|after)', ({
    1: $1
  }) => `&::${$1}`], ['(marker|selection)', ({
    1: $1
  }) => `& *::${$1},&::${$1}`], ['file', '&::file-selector-button'], ['(first|last|only)', ({
    1: $1
  }) => `&:${$1}-child`], ['even', '&:nth-child(2n)'], ['odd', '&:nth-child(odd)'], ['open', '&[open]'],
  // All other pseudo classes are already supported by twind
  ['(aria|data)-', ({
    1: $1,
    /* aria or data */$$
  }, /* everything after the dash */context) => $$ && `&[${$1}-${// aria-asc or data-checked -> from theme
context.theme($1, $$) ||
// aria-[...] or data-[...]
arbitrary($$, '', context) ||
// default handling
`${$$}="true"`}]`], /* Styling based on parent and peer state */ // Groups classes like: group-focus and group-hover
  // these need to add a marker selector with the pseudo class
  // => '.group:focus .group-focus:selector'
  ['((group|peer)(~[^-[]+)?)(-\\[(.+)]|[-[].+?)(\\/.+)?', ({
    2: type,
    3: name = '',
    4: $4,
    5: $5 = '',
    6: label = name
  }, {
    e,
    h,
    v
  }) => {
    let selector = normalize($5) || ('[' == $4[0] ? $4 : v($4.slice(1)));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return `${(selector.includes('&') ? selector : '&' + selector).replace(/&/g, `:merge(.${e(h(type + label))})`)}${'p' == type[0] ? '~' : ' '}&`;
  }],
  // direction variants
  ['(ltr|rtl)', ({
    1: $1
  }) => `[dir="${$1}"] &`], ['supports-', ({
    $$
  }, /* everything after the dash */context) => {
    $$ && ($$ = context.theme('supports', $$) || arbitrary($$, '', context));
    if ($$) return $$.includes(':') || ($$ += ':var(--tw)'), /^\w*\s*\(/.test($$) || ($$ = `(${$$})`),
    // Chrome has a bug where `(condtion1)or(condition2)` is not valid
    // But `(condition1) or (condition2)` is supported.
    `@supports ${$$.replace(/\b(and|or|not)\b/g, ' $1 ').trim()}`;
  }], ['max-', ({
    $$
  }, context) => {
    $$ && ($$ = context.theme('screens', $$) || arbitrary($$, '', context));
    if ('string' == typeof $$) return `@media not all and (min-width:${$$})`;
  }], ['min-', ({
    $$
  }, context) => {
    return $$ && ($$ = arbitrary($$, '', context)), $$ && `@media (min-width:${$$})`;
  }],
  // Arbitrary variants
  [/^\[(.+)]$/, ({
    1: $1
  }) => /[&@]/.test($1) && normalize($1).replace(/[}]+$/, '').split('{')]];

  /** Allows to disable to tailwind preflight (default: `false` eg include the tailwind preflight ) */ /**
                                                                                                       * @experimental
                                                                                                       */
  function presetTailwindBase({
    colors,
    disablePreflight
  } = {}) {
    return {
      // allow other preflight to run
      preflight: disablePreflight ? void 0 : preflight,
      theme: {
        ...theme,
        colors: {
          inherit: 'inherit',
          current: 'currentColor',
          transparent: 'transparent',
          black: '#000',
          white: '#fff',
          ...colors
        }
      },
      variants,
      rules,
      finalize(rule) {
        return (
          // automatically add `content: ''` to before and after so you don’t have to specify it unless you want a different value
          // ignore global, preflight, and auto added rules
          rule.n &&
          // only if there are declarations
          rule.d &&
          // and it has a ::before or ::after selector
          rule.r.some(r => /^&::(before|after)$/.test(r)) &&
          // there is no content property yet
          !/(^|;)content:/.test(rule.d) ? {
            ...rule,
            d: 'content:var(--tw-content);' + rule.d
          } : rule
        );
      }
    };
  }

  // Source from https://github.com/tailwindlabs/tailwindcss/blob/master/src/public/colors.js
  /**
   * @module @twind/preset-tailwind/colors
   */let slate = {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    gray = {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },
    zinc = {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b'
    },
    neutral = {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717'
    },
    stone = {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917'
    },
    red = {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d'
    },
    orange = {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12'
    },
    amber = {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f'
    },
    yellow = {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12'
    },
    lime = {
      50: '#f7fee7',
      100: '#ecfccb',
      200: '#d9f99d',
      300: '#bef264',
      400: '#a3e635',
      500: '#84cc16',
      600: '#65a30d',
      700: '#4d7c0f',
      800: '#3f6212',
      900: '#365314'
    },
    green = {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d'
    },
    emerald = {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b'
    },
    teal = {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a'
    },
    cyan = {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63'
    },
    sky = {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e'
    },
    blue = {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    },
    indigo = {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81'
    },
    violet = {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95'
    },
    purple = {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87'
    },
    fuchsia = {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75'
    },
    pink = {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843'
    },
    rose = {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#f43f5e',
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337'
    },
    // get lightBlue() {
    //   warn({ version: 'v2.2', from: 'lightBlue', to: 'sky' })
    //   return this.sky
    // }
    // get warmGray() {
    //   warn({ version: 'v3.0', from: 'warmGray', to: 'stone' })
    //   return this.stone
    // }
    // get trueGray() {
    //   warn({ version: 'v3.0', from: 'trueGray', to: 'neutral' })
    //   return this.neutral
    // }
    // get coolGray() {
    //   warn({ version: 'v3.0', from: 'coolGray', to: 'gray' })
    //   return this.gray
    // }
    // get blueGray() {
    //   warn({ version: 'v3.0', from: 'blueGray', to: 'slate' })
    //   return this.slate
    // }
    colors = {
      __proto__: null,
      slate,
      gray,
      zinc,
      neutral,
      stone,
      red,
      orange,
      amber,
      yellow,
      lime,
      green,
      emerald,
      teal,
      cyan,
      sky,
      blue,
      indigo,
      violet,
      purple,
      fuchsia,
      pink,
      rose
    };

  /** Allows to disable to tailwind preflight (default: `false` eg include the tailwind preflight ) */
  function presetTailwind({
    disablePreflight
  } = {}) {
    return presetTailwindBase({
      colors,
      disablePreflight
    });
  }

  const tw = twind({
    preflight: false,
    hash: (className, defaultHash) => {
      return `tw-${defaultHash(className).slice(1)}`;
    },
    presets: [presetAutoprefix(), presetTailwind({
      disablePreflight: true
    })]
  }, dom());

  const _tmpl$$c = /*#__PURE__*/template(`<div><div> edition, v</div><div></div><div></div><div><button>`),
    _tmpl$2$3 = /*#__PURE__*/template(`<a target="_blank" rel="noopener noreferrer">`),
    _tmpl$3$3 = /*#__PURE__*/template(`<div>`),
    _tmpl$4$3 = /*#__PURE__*/template(`<div><div></div><div><select>`),
    _tmpl$5$3 = /*#__PURE__*/template(`<option>`);
  const detectResOptionsMap = {
    S: () => "1024px",
    M: () => "1536px",
    L: () => "2048px",
    X: () => "2560px"
  };
  const detectResOptions = Object.keys(detectResOptionsMap);
  const renderTextDirOptionsMap = {
    auto: t$1("settings.render-text-orientation-options.auto"),
    h: t$1("settings.render-text-orientation-options.horizontal"),
    v: t$1("settings.render-text-orientation-options.vertical")
  };
  const renderTextDirOptions = Object.keys(renderTextDirOptionsMap);
  const textDetectorOptionsMap = {
    default: t$1("settings.text-detector-options.default"),
    ctd: () => "Comic Text Detector"
  };
  const textDetectorOptions = Object.keys(textDetectorOptionsMap);
  const translatorOptionsMap = {
    "gpt3.5": () => "GPT-3.5",
    "youdao": () => "Youdao",
    "baidu": () => "Baidu",
    "google": () => "Google",
    "deepl": () => "DeepL",
    "papago": () => "Papago",
    "offline": () => "Sugoi / NLLB",
    "none": t$1("settings.translator-options.none")
  };
  const translatorOptions = Object.keys(translatorOptionsMap);
  const targetLangOptionsMap = {
    "": t$1("settings.target-language-options.auto"),
    "CHS": () => "简体中文",
    "CHT": () => "繁體中文",
    "JPN": () => "日本語",
    "ENG": () => "English",
    "KOR": () => "한국어",
    "VIN": () => "Tiếng Việt",
    "CSY": () => "čeština",
    "NLD": () => "Nederlands",
    "FRA": () => "français",
    "DEU": () => "Deutsch",
    "HUN": () => "magyar nyelv",
    "ITA": () => "italiano",
    "PLK": () => "polski",
    "PTB": () => "português",
    "ROM": () => "limba română",
    "RUS": () => "русский язык",
    "UKR": () => "українська мова",
    "ESP": () => "español",
    "TRK": () => "Türk dili"
  };
  const scriptLangOptionsMap = {
    "": t$1("settings.script-language-options.auto"),
    "zh-CN": () => "简体中文",
    "en-US": () => "English"
  };
  const keepInstancesOptionsMap = {
    "until-reload": t$1("settings.keep-instances-options.until-reload"),
    "until-navigate": t$1("settings.keep-instances-options.until-navigate")
  };
  const Settings = props => {
    const itemOrientation = () => props.itemOrientation ?? "vertical";
    const textStyle = () => props.textStyle ?? {};
    return (() => {
      const _el$ = _tmpl$$c(),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.firstChild,
        _el$4 = _el$2.nextSibling,
        _el$5 = _el$4.nextSibling,
        _el$6 = _el$5.nextSibling,
        _el$7 = _el$6.firstChild;
      insert(_el$2, EDITION, _el$3);
      insert(_el$2, VERSION, null);
      insert(_el$4, t$1("sponsor.text"));
      insert(_el$5, createComponent(For, {
        each: [["ko-fi", "https://ko-fi.com/voilelabs"], ["Patreon", "https://patreon.com/voilelabs"], ["爱发电", "https://afdian.net/@voilelabs"]],
        children: ([name, url]) => [" ", (() => {
          const _el$8 = _tmpl$2$3();
          setAttribute(_el$8, "href", url);
          insert(_el$8, name);
          createRenderEffect(() => className(_el$8, tw("no-underline text-blue-600")));
          return _el$8;
        })()]
      }));
      insert(_el$, createComponent(For, {
        get each() {
          return [[t$1("settings.detection-resolution"), detectionResolution, setDetectionResolution, detectResOptionsMap, t$1("settings.detection-resolution-desc")], [t$1("settings.text-detector"), textDetector, setTextDetector, textDetectorOptionsMap, t$1("settings.text-detector-desc")], [t$1("settings.translator"), translatorService, setTranslatorService, translatorOptionsMap, t$1("settings.translator-desc")], [t$1("settings.render-text-orientation"), renderTextOrientation, setRenderTextOrientation, renderTextDirOptionsMap, t$1("settings.render-text-orientation-desc")], [t$1("settings.target-language"), targetLang, setTargetLang, targetLangOptionsMap, t$1("settings.target-language-desc")], [t$1("settings.script-language"), scriptLang, setScriptLang, scriptLangOptionsMap, t$1("settings.script-language-desc")], [t$1("settings.keep-instances"), keepInstances, setKeepInstances, keepInstancesOptionsMap, t$1("settings.keep-instances-desc")]];
        },
        children: ([title, opt, setOpt, optMap, desc]) => (() => {
          const _el$9 = _tmpl$4$3(),
            _el$10 = _el$9.firstChild,
            _el$11 = _el$10.nextSibling,
            _el$12 = _el$11.firstChild;
          insert(_el$10, title);
          _el$12.addEventListener("change", e => setOpt(e.target.value));
          insert(_el$12, () => Object.entries(optMap).map(([value, label]) => (() => {
            const _el$14 = _tmpl$5$3();
            _el$14.value = value;
            insert(_el$14, label);
            return _el$14;
          })()));
          insert(_el$11, createComponent(Show, {
            get when() {
              return desc();
            },
            get children() {
              const _el$13 = _tmpl$3$3();
              insert(_el$13, desc);
              createRenderEffect(() => className(_el$13, tw("text-sm")));
              return _el$13;
            }
          }), null);
          createRenderEffect(_p$ => {
            const _v$ = itemOrientation() === "horizontal" ? tw("flex items-center") : "",
              _v$2 = textStyle();
            _v$ !== _p$._v$ && className(_el$9, _p$._v$ = _v$);
            _p$._v$2 = style(_el$10, _v$2, _p$._v$2);
            return _p$;
          }, {
            _v$: undefined,
            _v$2: undefined
          });
          createRenderEffect(() => _el$12.value = opt());
          return _el$9;
        })()
      }), _el$6);
      _el$7.addEventListener("click", e => {
        e.stopPropagation();
        e.preventDefault();
        setDetectionResolution(null);
        setTextDetector(null);
        setTranslatorService(null);
        setRenderTextOrientation(null);
        setTargetLang(null);
        setScriptLang(null);
      });
      insert(_el$7, t$1("settings.reset"));
      createRenderEffect(() => className(_el$, tw("flex flex-col gap-2")));
      return _el$;
    })();
  };

  function formatSize(bytes) {
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0B";
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / k ** i).toFixed(2)}${sizes[i]}`;
  }
  function formatProgress(loaded, total) {
    return `${formatSize(loaded)}/${formatSize(total)}`;
  }
  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  async function resizeToSubmit(blob, suffix) {
    const blobUrl = URL.createObjectURL(blob);
    const img = await new Promise((resolve, reject) => {
      const img2 = new Image();
      img2.onload = () => resolve(img2);
      img2.onerror = err => reject(err);
      img2.src = blobUrl;
    });
    URL.revokeObjectURL(blobUrl);
    const w = img.width;
    const h = img.height;
    if (w <= 4096 && h <= 4096) return {
      blob,
      suffix
    };
    const scale = Math.min(4096 / w, 4096 / h);
    const width = Math.floor(w * scale);
    const height = Math.floor(h * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);
    const newBlob = await new Promise((resolve, reject) => {
      canvas.toBlob(blob2 => {
        if (blob2) resolve(blob2);else reject(new Error("Canvas toBlob failed"));
      }, "image/png");
    });
    return {
      blob: newBlob,
      suffix: "png"
    };
  }
  async function submitTranslate(blob, suffix, listeners = {}, optionsOverwrite) {
    const {
      onProgress,
      onFinal
    } = listeners;
    const formData = new FormData();
    formData.append("file", blob, `image.${suffix}`);
    formData.append("target_language", targetLang() || BCP47ToISO639(realLang()));
    formData.append("detector", optionsOverwrite?.textDetector ?? textDetector());
    formData.append("direction", optionsOverwrite?.renderTextOrientation ?? renderTextOrientation());
    formData.append("translator", optionsOverwrite?.translator ?? translatorService());
    formData.append("size", optionsOverwrite?.detectionResolution ?? detectionResolution());
    formData.append("retry", optionsOverwrite?.forceRetry ? "true" : "false");
    const result = await GMP.xmlHttpRequest({
      method: "POST",
      url: "https://api.cotrans.touhou.ai/task/upload/v1",
      // @ts-expect-error FormData is supported
      data: formData,
      upload: {
        onprogress: onProgress || onFinal ? e => {
          if (e.lengthComputable) {
            if (e.loaded >= e.total - 16) {
              onFinal?.();
            } else {
              const p = formatProgress(e.loaded, e.total);
              onProgress?.(p);
            }
          }
        } : void 0
      }
    });
    return JSON.parse(result.responseText);
  }
  function getStatusText(msg) {
    if (msg.type === "pending") return t$1("common.status.pending-pos", {
      pos: msg.pos
    });
    if (msg.type === "status") return t$1(`common.status.${msg.status}`);
    return t$1("common.status.default");
  }
  function pullTranslationStatus(id, cb) {
    const ws = new WebSocket(`wss://api.cotrans.touhou.ai/task/${id}/event/v1`);
    return new Promise((resolve, reject) => {
      ws.onmessage = e => {
        const msg = JSON.parse(e.data);
        if (msg.type === "result") resolve(msg.result);else if (msg.type === "error") reject(t$1("common.status.error-with-id", {
          id: msg.error_id
        }));else cb(getStatusText(msg));
      };
    });
  }
  async function pullTranslationStatusPolling(id, cb) {
    while (true) {
      const res = await GMP.xmlHttpRequest({
        method: "GET",
        url: `https://api.cotrans.touhou.ai/task/${id}/status/v1`
      });
      const msg = JSON.parse(res.responseText);
      if (msg.type === "result") return msg.result;else if (msg.type === "error") throw t$1("common.status.error-with-id", {
        id: msg.error_id
      });else cb(getStatusText(msg));
      await new Promise(resolve => setTimeout(resolve, 1e3));
    }
  }
  async function downloadBlob(url, listeners = {}) {
    const {
      onProgress
    } = listeners;
    const res = await GMP.xmlHttpRequest({
      method: "GET",
      responseType: "blob",
      url,
      onprogress: onProgress ? e => {
        if (e.lengthComputable) {
          const p = formatProgress(e.loaded, e.total);
          onProgress(p);
        }
      } : void 0
    });
    return res.response;
  }

  const _tmpl$$b = /*#__PURE__*/template(`<svg viewBox="0 0 32 32" width="1.2em" height="1.2em"><path fill="currentColor" d="M27.85 29H30l-6-15h-2.35l-6 15h2.15l1.6-4h6.85zm-7.65-6l2.62-6.56L25.45 23zM18 7V5h-7V2H9v3H2v2h10.74a14.71 14.71 0 0 1-3.19 6.18A13.5 13.5 0 0 1 7.26 9h-2.1a16.47 16.47 0 0 0 3 5.58A16.84 16.84 0 0 1 3 18l.75 1.86A18.47 18.47 0 0 0 9.53 16a16.92 16.92 0 0 0 5.76 3.84L16 18a14.48 14.48 0 0 1-5.12-3.37A17.64 17.64 0 0 0 14.8 7z">`);
  const IconCarbonTranslate = ((props = {}) => (() => {
    const _el$ = _tmpl$$b();
    spread(_el$, props, true, true);
    return _el$;
  })());

  const _tmpl$$a = /*#__PURE__*/template(`<svg viewBox="0 0 32 32" width="1.2em" height="1.2em"><path fill="currentColor" d="M18 28A12 12 0 1 0 6 16v6.2l-3.6-3.6L1 20l6 6l6-6l-1.4-1.4L8 22.2V16a10 10 0 1 1 10 10Z">`);
  const IconCarbonReset = ((props = {}) => (() => {
    const _el$ = _tmpl$$a();
    spread(_el$, props, true, true);
    return _el$;
  })());

  const _tmpl$$9 = /*#__PURE__*/template(`<svg viewBox="0 0 32 32" width="1.2em" height="1.2em"><path fill="currentColor" d="M22 16L12 26l-1.4-1.4l8.6-8.6l-8.6-8.6L12 6z">`);
  const IconCarbonChevronRight = ((props = {}) => (() => {
    const _el$ = _tmpl$$9();
    spread(_el$, props, true, true);
    return _el$;
  })());

  const _tmpl$$8 = /*#__PURE__*/template(`<svg viewBox="0 0 32 32" width="1.2em" height="1.2em"><path fill="currentColor" d="M10 16L20 6l1.4 1.4l-8.6 8.6l8.6 8.6L20 26z">`);
  const IconCarbonChevronLeft = ((props = {}) => (() => {
    const _el$ = _tmpl$$8();
    spread(_el$, props, true, true);
    return _el$;
  })());

  const _tmpl$$7 = /*#__PURE__*/template(`<svg viewBox="0 0 32 32" width="1.2em" height="1.2em"><path fill="currentColor" d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z">`);
  const IconCarbonChevronDown = ((props = {}) => (() => {
    const _el$ = _tmpl$$7();
    spread(_el$, props, true, true);
    return _el$;
  })());

  const _tmpl$$6 = /*#__PURE__*/template(`<div>`),
    _tmpl$2$2 = /*#__PURE__*/template(`<div><div>`),
    _tmpl$3$2 = /*#__PURE__*/template(`<div><label><input type="checkbox">`),
    _tmpl$4$2 = /*#__PURE__*/template(`<div><div><div><div></div></div></div><div>`),
    _tmpl$5$2 = /*#__PURE__*/template(`<div><div></div><div><select>`),
    _tmpl$6 = /*#__PURE__*/template(`<option>`),
    _tmpl$7 = /*#__PURE__*/template(`<div data-transall="true">`);
  function mount$4() {
    const images = /* @__PURE__ */new Set();
    const instances = new ReactiveMap();
    const translatedMap = /* @__PURE__ */new Map();
    const translateEnabledMap = /* @__PURE__ */new Map();
    function findImageNodes(node) {
      return Array.from(node.querySelectorAll("img")).filter(node2 => node2.hasAttribute("srcset") || node2.hasAttribute("data-trans") || node2.parentElement?.classList.contains("sc-1pkrz0g-1") || node2.parentElement?.classList.contains("gtm-expand-full-size-illust"));
    }
    function rescanImages() {
      const imageNodes = findImageNodes(document.body);
      const removedImages = new Set(images);
      for (const node of imageNodes) {
        removedImages.delete(node);
        if (images.has(node)) continue;
        try {
          instances.set(node, createRoot(dispose => {
            const instance = createInstance(node);
            return {
              ...instance,
              dispose
            };
          }));
          images.add(node);
        } catch (e) {}
      }
      for (const node of removedImages) {
        if (!instances.has(node)) continue;
        const instance = instances.get(node);
        instance.dispose();
        instances.delete(node);
        images.delete(node);
      }
    }
    function createInstance(imageNode) {
      const src = imageNode.getAttribute("src");
      const srcset = imageNode.getAttribute("srcset");
      const parent = imageNode.parentElement;
      if (!parent) throw new Error("no parent");
      const originalSrc = parent.getAttribute("href") || src;
      const originalSrcSuffix = originalSrc.split(".").pop();
      let originalImage;
      let translatedImage = translatedMap.get(originalSrc);
      const [translateMounted, setTranslateMounted] = createSignal(false);
      let buttonDisabled = false;
      const [processing, setProcessing] = createSignal(false);
      const [translated, setTranslated] = createSignal(false);
      const [transStatus, setTransStatus] = createSignal(() => void 0);
      parent.style.position = "relative";
      const container = document.createElement("div");
      parent.appendChild(container);
      onCleanup(() => {
        container.remove();
      });
      const disposeButton = render(() => {
        const status = createMemo(() => transStatus()());
        const [advancedMenuOpen, setAdvancedMenuOpen] = createSignal(false);
        const [advDetectRes, setAdvDetectRes] = createSignal(detectionResolution());
        const [advRenderTextDir, setAdvRenderTextDir] = createSignal(renderTextOrientation());
        const [advTextDetector, setAdvTextDetector] = createSignal(textDetector());
        const [advTranslator, setAdvTranslator] = createSignal(translatorService());
        const [forceRetry, setForceRetry] = createSignal(false);
        const [mouseInside, setMouseInside] = createSignal(false);
        let mouseInsideTimeout;
        const fullOpacity = createMemo(() => mouseInside() || advancedMenuOpen() || processing());
        return (() => {
          const _el$ = _tmpl$4$2(),
            _el$2 = _el$.firstChild,
            _el$3 = _el$2.firstChild,
            _el$4 = _el$3.firstChild,
            _el$5 = _el$2.nextSibling;
          _el$.addEventListener("mouseout", () => {
            if (!mouseInsideTimeout) {
              mouseInsideTimeout = window.setTimeout(() => {
                setMouseInside(false);
                mouseInsideTimeout = void 0;
              }, 400);
            }
          });
          _el$.addEventListener("mouseover", () => {
            if (mouseInsideTimeout) {
              window.clearTimeout(mouseInsideTimeout);
              mouseInsideTimeout = void 0;
            }
            setMouseInside(true);
          });
          _el$.addEventListener("click", e => {
            e.stopPropagation();
            e.preventDefault();
          });
          insert(_el$3, createComponent(Dynamic, {
            get component() {
              return translated() ? IconCarbonReset : IconCarbonTranslate;
            },
            get ["class"]() {
              return tw("w-6 h-6 p-2 align-middle cursor-pointer");
            },
            onClick: e => {
              e.stopPropagation();
              e.preventDefault();
              if (advancedMenuOpen()) return;
              toggle();
            },
            onContextMenu: e => {
              e.stopPropagation();
              e.preventDefault();
              if (translateMounted()) setAdvancedMenuOpen(false);else setAdvancedMenuOpen(v => !v);
            }
          }), _el$4);
          insert(_el$5, createComponent(Show, {
            get when() {
              return !translateMounted();
            },
            get children() {
              const _el$6 = _tmpl$$6();
              insert(_el$6, createComponent(Switch, {
                get children() {
                  return [createComponent(Match, {
                    get when() {
                      return status();
                    },
                    get children() {
                      const _el$7 = _tmpl$$6();
                      insert(_el$7, status);
                      createRenderEffect(() => className(_el$7, tw("px-1")));
                      return _el$7;
                    }
                  }), createComponent(Match, {
                    get when() {
                      return advancedMenuOpen();
                    },
                    get children() {
                      return [(() => {
                        const _el$8 = _tmpl$2$2(),
                          _el$9 = _el$8.firstChild;
                        _el$8.addEventListener("click", e => {
                          e.stopPropagation();
                          e.preventDefault();
                          setAdvancedMenuOpen(false);
                        });
                        insert(_el$8, createComponent(IconCarbonChevronLeft, {
                          get ["class"]() {
                            return tw("align-middle cursor-pointer");
                          }
                        }), _el$9);
                        insert(_el$9, t$1("settings.inline-options-title"));
                        createRenderEffect(() => className(_el$8, tw("flex items-center py-1")));
                        return _el$8;
                      })(), (() => {
                        const _el$10 = _tmpl$3$2(),
                          _el$11 = _el$10.firstChild,
                          _el$12 = _el$11.firstChild;
                        insert(_el$10, createComponent(For, {
                          get each() {
                            return [[t$1("settings.detection-resolution"), advDetectRes, setAdvDetectRes, detectResOptions, detectResOptionsMap], [t$1("settings.text-detector"), advTextDetector, setAdvTextDetector, textDetectorOptions, textDetectorOptionsMap], [t$1("settings.translator"), advTranslator, setAdvTranslator, translatorOptions, translatorOptionsMap], [t$1("settings.render-text-orientation"), advRenderTextDir, setAdvRenderTextDir, renderTextDirOptions, renderTextDirOptionsMap]];
                          },
                          children: ([title, opt, setOpt, opts, optMap]) => (() => {
                            const _el$14 = _tmpl$5$2(),
                              _el$15 = _el$14.firstChild,
                              _el$16 = _el$15.nextSibling,
                              _el$17 = _el$16.firstChild;
                            insert(_el$15, title);
                            _el$17.addEventListener("change", e => {
                              setOpt(e.target.value);
                            });
                            insert(_el$17, createComponent(For, {
                              each: opts,
                              children: opt2 => (() => {
                                const _el$18 = _tmpl$6();
                                _el$18.value = opt2;
                                insert(_el$18, () =>
                                // @ts-expect-error optMap are incompatible with each other
                                optMap[opt2]());
                                return _el$18;
                              })()
                            }));
                            insert(_el$16, createComponent(IconCarbonChevronDown, {
                              get ["class"]() {
                                return tw("absolute top-1 right-1 pointer-events-none");
                              }
                            }), null);
                            createRenderEffect(_p$ => {
                              const _v$9 = tw("relative px-1"),
                                _v$10 = tw("w-full py-1 appearance-none text-black border-x-0 border-t-0 border-b border-solid border-gray-600 bg-transparent");
                              _v$9 !== _p$._v$9 && className(_el$16, _p$._v$9 = _v$9);
                              _v$10 !== _p$._v$10 && className(_el$17, _p$._v$10 = _v$10);
                              return _p$;
                            }, {
                              _v$9: undefined,
                              _v$10: undefined
                            });
                            createRenderEffect(() => _el$17.value = opt());
                            return _el$14;
                          })()
                        }), _el$11);
                        _el$11.addEventListener("click", e => {
                          e.stopImmediatePropagation();
                        });
                        _el$12.addEventListener("change", e => {
                          setForceRetry(e.target.checked);
                        });
                        _el$12.checked = forceRetry();
                        insert(_el$11, t$1("settings.force-retry"), null);
                        createRenderEffect(_p$ => {
                          const _v$ = tw("flex flex-col w-48 gap-2 mx-2"),
                            _v$2 = tw("flex items-center cursor-pointer");
                          _v$ !== _p$._v$ && className(_el$10, _p$._v$ = _v$);
                          _v$2 !== _p$._v$2 && className(_el$11, _p$._v$2 = _v$2);
                          return _p$;
                        }, {
                          _v$: undefined,
                          _v$2: undefined
                        });
                        return _el$10;
                      })(), (() => {
                        const _el$13 = _tmpl$$6();
                        _el$13.addEventListener("click", e => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (buttonDisabled) return;
                          if (translateMounted()) return;
                          enable({
                            detectionResolution: advDetectRes(),
                            renderTextOrientation: advRenderTextDir(),
                            textDetector: advTextDetector(),
                            translator: advTranslator(),
                            forceRetry: forceRetry()
                          });
                          setAdvancedMenuOpen(false);
                        });
                        insert(_el$13, t$1("common.control.translate"));
                        createRenderEffect(() => className(_el$13, tw("w-full mt-2 mb-1 py-1 border border-solid border-gray-600 rounded-full text-center cursor-pointer")));
                        return _el$13;
                      })()];
                    }
                  }), createComponent(Match, {
                    when: true,
                    get children() {
                      return createComponent(IconCarbonChevronRight, {
                        get ["class"]() {
                          return tw("py-1 align-middle cursor-pointer");
                        },
                        onClick: e => {
                          e.stopPropagation();
                          e.preventDefault();
                          setAdvancedMenuOpen(true);
                        }
                      });
                    }
                  })];
                }
              }));
              createRenderEffect(() => className(_el$6, tw("flex flex-col text-base px-1 border-1 border-solid border-gray-300 rounded-2xl bg-white cursor-default")));
              return _el$6;
            }
          }));
          createRenderEffect(_p$ => {
            const _v$3 = tw("absolute z-1 flex top-1 left-2 transition-opacity duration-80"),
              _v$4 = {
                [tw("opacity-100")]: fullOpacity(),
                [tw("opacity-30")]: !fullOpacity()
              },
              _v$5 = tw("relative rounded-full bg-white"),
              _v$6 = tw("absolute inset-0 border-1 border-solid rounded-full pointer-events-none"),
              _v$7 = {
                [tw("border-x-gray-300 border-b-gray-300 border-t-gray-600 animate-spin")]: processing(),
                [tw("border-gray-300")]: !processing()
              },
              _v$8 = tw("-ml-2 mt-1.5");
            _v$3 !== _p$._v$3 && className(_el$, _p$._v$3 = _v$3);
            _p$._v$4 = classList(_el$, _v$4, _p$._v$4);
            _v$5 !== _p$._v$5 && className(_el$3, _p$._v$5 = _v$5);
            _v$6 !== _p$._v$6 && className(_el$4, _p$._v$6 = _v$6);
            _p$._v$7 = classList(_el$4, _v$7, _p$._v$7);
            _v$8 !== _p$._v$8 && className(_el$5, _p$._v$8 = _v$8);
            return _p$;
          }, {
            _v$3: undefined,
            _v$4: undefined,
            _v$5: undefined,
            _v$6: undefined,
            _v$7: undefined,
            _v$8: undefined
          });
          return _el$;
        })();
      }, container);
      onCleanup(disposeButton);
      async function getTranslatedImage(optionsOverwrite) {
        if (!optionsOverwrite && translatedImage) return translatedImage;
        buttonDisabled = true;
        const text = transStatus();
        setProcessing(true);
        const setStatus = t2 => setTransStatus(() => t2);
        setStatus(t$1("common.source.download-image"));
        if (!originalImage) {
          const result = await GMP.xmlHttpRequest({
            method: "GET",
            responseType: "blob",
            url: originalSrc,
            headers: {
              referer: "https://www.pixiv.net/"
            },
            overrideMimeType: "text/plain; charset=x-user-defined",
            onprogress(e) {
              if (e.lengthComputable) {
                setStatus(t$1("common.source.download-image-progress", {
                  progress: formatProgress(e.loaded, e.total)
                }));
              }
            }
          }).catch(e => {
            setStatus(t$1("common.source.download-image-error"));
            throw e;
          });
          originalImage = result.response;
        }
        setStatus(t$1("common.client.resize"));
        await new Promise(resolve => queueMicrotask(resolve));
        const {
          blob: resizedImage,
          suffix: resizedSuffix
        } = await resizeToSubmit(originalImage, originalSrcSuffix);
        setStatus(t$1("common.client.submit"));
        const task = await submitTranslate(resizedImage, resizedSuffix, {
          onProgress(progress) {
            setStatus(t$1("common.client.submit-progress", {
              progress
            }));
          },
          onFinal() {
            setStatus(t$1("common.client.submit-final"));
          }
        }, optionsOverwrite).catch(e => {
          setStatus(t$1("common.client.submit-error"));
          throw e;
        });
        let maskUrl = task.result?.translation_mask;
        if (!maskUrl) {
          setStatus(t$1("common.status.pending"));
          const res = await pullTranslationStatus(task.id, setStatus).catch(e => {
            setStatus(e);
            throw e;
          });
          maskUrl = res.translation_mask;
        }
        setStatus(t$1("common.client.download-image"));
        const mask = await downloadBlob(maskUrl, {
          onProgress(progress) {
            setStatus(t$1("common.client.download-image-progress", {
              progress
            }));
          }
        }).catch(e => {
          setStatus(t$1("common.client.download-image-error"));
          throw e;
        });
        const maskUri = URL.createObjectURL(mask);
        setStatus(t$1("common.client.merging"));
        const canvas = document.createElement("canvas");
        const canvasCtx = canvas.getContext("2d");
        const img = new Image();
        img.src = URL.createObjectURL(resizedImage);
        await new Promise(resolve => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            canvasCtx.drawImage(img, 0, 0);
            resolve(null);
          };
        });
        const img2 = new Image();
        img2.src = maskUri;
        img2.crossOrigin = "anonymous";
        await new Promise(resolve => {
          img2.onload = () => {
            canvasCtx.drawImage(img2, 0, 0);
            resolve(null);
          };
        });
        const translated2 = await new Promise(resolve => {
          canvas.toBlob(blob => {
            resolve(blob);
          }, "image/png");
        });
        const translatedUri = URL.createObjectURL(translated2);
        translatedImage = translatedUri;
        translatedMap.set(originalSrc, translatedUri);
        setStatus(text);
        setProcessing(false);
        buttonDisabled = false;
        return translatedUri;
      }
      async function enable(optionsOverwrite) {
        try {
          const translated2 = await getTranslatedImage(optionsOverwrite);
          imageNode.setAttribute("data-trans", src);
          imageNode.setAttribute("src", translated2);
          imageNode.removeAttribute("srcset");
          setTranslateMounted(true);
          setTranslated(true);
        } catch (e) {
          buttonDisabled = false;
          setTranslateMounted(false);
          throw e;
        }
      }
      function disable() {
        imageNode.setAttribute("src", src);
        if (srcset) imageNode.setAttribute("srcset", srcset);
        imageNode.removeAttribute("data-trans");
        setTranslateMounted(false);
        setTranslated(false);
      }
      function toggle() {
        if (buttonDisabled) return;
        if (!translateMounted()) {
          translateEnabledMap.set(originalSrc, true);
          enable();
        } else {
          translateEnabledMap.delete(originalSrc);
          disable();
        }
      }
      if (translateEnabledMap.get(originalSrc)) enable();
      onCleanup(() => {
        if (translateMounted()) disable();
      });
      return {
        imageNode,
        async enable() {
          translateEnabledMap.set(originalSrc, true);
          return await enable();
        },
        disable() {
          translateEnabledMap.delete(originalSrc);
          return disable();
        },
        isEnabled: createMemo(() => processing() || translateMounted())
      };
    }
    const TranslateAll = () => {
      const [started, setStarted] = createSignal(false);
      const [total, setTotal] = createSignal(0);
      const [finished, setFinished] = createSignal(0);
      const [erred, setErred] = createSignal(false);
      return (() => {
        const _el$19 = _tmpl$7();
        _el$19.addEventListener("click", e => {
          e.stopPropagation();
          e.preventDefault();
          if (started()) return;
          setStarted(true);
          setTotal(instances.size);
          const inc = () => {
            setFinished(finished() + 1);
          };
          const err = () => {
            setErred(true);
            inc();
          };
          for (const instance of instances.values()) {
            if (instance.isEnabled()) inc();else instance.enable().then(inc).catch(err);
          }
        });
        insert(_el$19, createComponent(Switch, {
          get children() {
            return [createComponent(Match, {
              get when() {
                return !started();
              },
              get children() {
                return t$1("common.control.batch", {
                  count: instances.size
                })();
              }
            }), createComponent(Match, {
              get when() {
                return finished() !== total();
              },
              get children() {
                return t$1("common.batch.progress", {
                  count: finished(),
                  total: total()
                })();
              }
            }), createComponent(Match, {
              get when() {
                return finished() === total();
              },
              get children() {
                return createComponent(Show, {
                  get when() {
                    return !erred();
                  },
                  get fallback() {
                    return t$1("common.batch.error")();
                  },
                  get children() {
                    return t$1("common.batch.finish")();
                  }
                });
              }
            })];
          }
        }));
        createRenderEffect(() => className(_el$19, tw("inline-block mr-3 p-0 h-8 text-inherit leading-8 font-bold cursor-pointer")));
        return _el$19;
      })();
    };
    let disposeTransAll;
    function refreshTransAll() {
      if (document.querySelector(".sc-emr523-2")) return;
      const section = document.querySelector(".sc-181ts2x-0");
      if (section) {
        if (section.querySelector("[data-transall]")) return;
        const container = document.createElement("div");
        section.appendChild(container);
        const dispose = render(() => createComponent(TranslateAll, {}), container);
        disposeTransAll = () => {
          dispose();
          container.remove();
        };
      } else {
        if (disposeTransAll) {
          disposeTransAll();
          disposeTransAll = void 0;
        }
      }
    }
    onCleanup(() => {
      disposeTransAll?.();
    });
    let disposeMangaViewerTransAll;
    function refreshManagaViewerTransAll() {
      const mangaViewer = document.querySelector(".gtm-manga-viewer-change-direction")?.parentElement?.parentElement;
      if (mangaViewer) {
        if (disposeMangaViewerTransAll) return;
        const container = document.createElement("div");
        mangaViewer.prepend(container);
        const dispose = render(() => createComponent(TranslateAll, {}), container);
        disposeMangaViewerTransAll = () => {
          dispose();
          container.remove();
        };
      } else {
        if (disposeMangaViewerTransAll) {
          disposeMangaViewerTransAll();
          disposeMangaViewerTransAll = void 0;
        }
      }
    }
    onCleanup(() => {
      disposeMangaViewerTransAll?.();
    });
    createMutationObserver(document.body, {
      childList: true,
      subtree: true
    }, throttle(() => {
      rescanImages();
      refreshTransAll();
      refreshManagaViewerTransAll();
    }, 200));
    rescanImages();
    refreshTransAll();
    onCleanup(() => {
      images.clear();
      instances.forEach(instance => instance.dispose());
      instances.clear();
    });
    return {};
  }
  const translator$2 = {
    match(url) {
      return url.hostname.endsWith("pixiv.net") && url.pathname.match(/\/artworks\//);
    },
    mount: mount$4
  };

  const _tmpl$$5 = /*#__PURE__*/template(`<div><h2></h2><div>`);
  function mount$3() {
    const wrapper = document.getElementById("wrapper");
    if (!wrapper) return {};
    const adFooter = wrapper.querySelector(".ad-footer");
    if (!adFooter) return {};
    const settingsContainer = document.createElement("div");
    onCleanup(() => {
      settingsContainer.remove();
    });
    const disposeSettings = render(() => (() => {
      const _el$ = _tmpl$$5(),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.nextSibling;
      insert(_el$2, t$1("settings.title"));
      insert(_el$3, createComponent(Settings, {
        itemOrientation: "horizontal",
        textStyle: {
          "width": "185px",
          "font-weight": "bold"
        }
      }));
      createRenderEffect(_p$ => {
        const _v$ = tw("mb-2.5 pt-2.5 px-5 pb-4 bg-white border border-solid border-[#d6dee5]"),
          _v$2 = tw("text-lg font-bold"),
          _v$3 = tw("w-[665px] my-2.5 mx-auto");
        _v$ !== _p$._v$ && className(_el$, _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && className(_el$2, _p$._v$2 = _v$2);
        _v$3 !== _p$._v$3 && className(_el$3, _p$._v$3 = _v$3);
        return _p$;
      }, {
        _v$: undefined,
        _v$2: undefined,
        _v$3: undefined
      });
      return _el$;
    })(), settingsContainer);
    onCleanup(disposeSettings);
    wrapper.insertBefore(settingsContainer, adFooter);
    return {};
  }
  const settingsInjector$1 = {
    match(url) {
      return url.hostname.endsWith("pixiv.net") && url.pathname.match(/\/setting_user\.php/);
    },
    mount: mount$3
  };

  const $RAW = Symbol("store-raw"),
    $NODE = Symbol("store-node");
  function wrap$1(value) {
    let p = value[$PROXY];
    if (!p) {
      Object.defineProperty(value, $PROXY, {
        value: p = new Proxy(value, proxyTraps$1)
      });
      if (!Array.isArray(value)) {
        const keys = Object.keys(value),
          desc = Object.getOwnPropertyDescriptors(value);
        for (let i = 0, l = keys.length; i < l; i++) {
          const prop = keys[i];
          if (desc[prop].get) {
            Object.defineProperty(value, prop, {
              enumerable: desc[prop].enumerable,
              get: desc[prop].get.bind(p)
            });
          }
        }
      }
    }
    return p;
  }
  function isWrappable(obj) {
    let proto;
    return obj != null && typeof obj === "object" && (obj[$PROXY] || !(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype || Array.isArray(obj));
  }
  function unwrap(item, set = new Set()) {
    let result, unwrapped, v, prop;
    if (result = item != null && item[$RAW]) return result;
    if (!isWrappable(item) || set.has(item)) return item;
    if (Array.isArray(item)) {
      if (Object.isFrozen(item)) item = item.slice(0);else set.add(item);
      for (let i = 0, l = item.length; i < l; i++) {
        v = item[i];
        if ((unwrapped = unwrap(v, set)) !== v) item[i] = unwrapped;
      }
    } else {
      if (Object.isFrozen(item)) item = Object.assign({}, item);else set.add(item);
      const keys = Object.keys(item),
        desc = Object.getOwnPropertyDescriptors(item);
      for (let i = 0, l = keys.length; i < l; i++) {
        prop = keys[i];
        if (desc[prop].get) continue;
        v = item[prop];
        if ((unwrapped = unwrap(v, set)) !== v) item[prop] = unwrapped;
      }
    }
    return item;
  }
  function getDataNodes(target) {
    let nodes = target[$NODE];
    if (!nodes) Object.defineProperty(target, $NODE, {
      value: nodes = Object.create(null)
    });
    return nodes;
  }
  function getDataNode(nodes, property, value) {
    return nodes[property] || (nodes[property] = createDataNode(value));
  }
  function proxyDescriptor$1(target, property) {
    const desc = Reflect.getOwnPropertyDescriptor(target, property);
    if (!desc || desc.get || !desc.configurable || property === $PROXY || property === $NODE) return desc;
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
    const [s, set] = createSignal(value, {
      equals: false,
      internal: true
    });
    s.$ = set;
    return s;
  }
  const proxyTraps$1 = {
    get(target, property, receiver) {
      if (property === $RAW) return target;
      if (property === $PROXY) return receiver;
      if (property === $TRACK) {
        trackSelf(target);
        return receiver;
      }
      const nodes = getDataNodes(target);
      const tracked = nodes[property];
      let value = tracked ? tracked() : target[property];
      if (property === $NODE || property === "__proto__") return value;
      if (!tracked) {
        const desc = Object.getOwnPropertyDescriptor(target, property);
        if (getListener() && (typeof value !== "function" || target.hasOwnProperty(property)) && !(desc && desc.get)) value = getDataNode(nodes, property, value)();
      }
      return isWrappable(value) ? wrap$1(value) : value;
    },
    has(target, property) {
      if (property === $RAW || property === $PROXY || property === $TRACK || property === $NODE || property === "__proto__") return true;
      this.get(target, property, target);
      return property in target;
    },
    set() {
      return true;
    },
    deleteProperty() {
      return true;
    },
    ownKeys: ownKeys,
    getOwnPropertyDescriptor: proxyDescriptor$1
  };
  function setProperty(state, property, value, deleting = false) {
    if (!deleting && state[property] === value) return;
    const prev = state[property],
      len = state.length;
    if (value === undefined) delete state[property];else state[property] = value;
    let nodes = getDataNodes(state),
      node;
    if (node = getDataNode(nodes, property, prev)) node.$(() => value);
    if (Array.isArray(state) && state.length !== len) {
      for (let i = state.length; i < len; i++) (node = nodes[i]) && node.$();
      (node = getDataNode(nodes, "length", len)) && node.$(state.length);
    }
    (node = nodes._) && node.$();
  }
  function mergeStoreNode(state, value) {
    const keys = Object.keys(value);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      setProperty(state, key, value[key]);
    }
  }
  function updateArray(current, next) {
    if (typeof next === "function") next = next(current);
    next = unwrap(next);
    if (Array.isArray(next)) {
      if (current === next) return;
      let i = 0,
        len = next.length;
      for (; i < len; i++) {
        const value = next[i];
        if (current[i] !== value) setProperty(current, i, value);
      }
      setProperty(current, "length", len);
    } else mergeStoreNode(current, next);
  }
  function updatePath(current, path, traversed = []) {
    let part,
      prev = current;
    if (path.length > 1) {
      part = path.shift();
      const partType = typeof part,
        isArray = Array.isArray(current);
      if (Array.isArray(part)) {
        for (let i = 0; i < part.length; i++) {
          updatePath(current, [part[i]].concat(path), traversed);
        }
        return;
      } else if (isArray && partType === "function") {
        for (let i = 0; i < current.length; i++) {
          if (part(current[i], i)) updatePath(current, [i].concat(path), traversed);
        }
        return;
      } else if (isArray && partType === "object") {
        const {
          from = 0,
          to = current.length - 1,
          by = 1
        } = part;
        for (let i = from; i <= to; i += by) {
          updatePath(current, [i].concat(path), traversed);
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
      if (value === prev) return;
    }
    if (part === undefined && value == undefined) return;
    value = unwrap(value);
    if (part === undefined || isWrappable(prev) && isWrappable(value) && !Array.isArray(value)) {
      mergeStoreNode(prev, value);
    } else setProperty(current, part, value);
  }
  function createStore(...[store, options]) {
    const unwrappedStore = unwrap(store || {});
    const isArray = Array.isArray(unwrappedStore);
    const wrappedStore = wrap$1(unwrappedStore);
    function setStore(...args) {
      batch(() => {
        isArray && args.length === 1 ? updateArray(unwrappedStore, args[0]) : updatePath(unwrappedStore, args);
      });
    }
    return [wrappedStore, setStore];
  }

  const _tmpl$$4 = /*#__PURE__*/template(`<div>`),
    _tmpl$2$1 = /*#__PURE__*/template(`<div><div>`),
    _tmpl$3$1 = /*#__PURE__*/template(`<div><label><input type="checkbox">`),
    _tmpl$4$1 = /*#__PURE__*/template(`<div><div></div><div><select>`),
    _tmpl$5$1 = /*#__PURE__*/template(`<option>`);
  function mount$2() {
    const mountAuthorId = location.pathname.split("/", 2)[1];
    const [statusId, setStatusId] = createSignal(location.pathname.match(/\/status\/(\d+)/)?.[1]);
    const [translatedMap, setTranslatedMap] = createStore({});
    const [translateStatusMap, setTranslateStatusMap] = createStore({});
    const [translateEnabledMap, setTranslateEnabledMap] = createStore({});
    const originalImageMap = {};
    const [layers, setLayers] = createSignal(null);
    let dialog;
    const createDialog = () => {
      const [active, setActive] = createSignal(0);
      const buttonParent = dialog.querySelector('[aria-labelledby="modal-header"][role="dialog"]').firstElementChild.firstElementChild;
      const getImages = () => {
        try {
          const cont = buttonParent.firstElementChild;
          assert(cont.nodeName === "DIV");
          const ul = cont.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.firstElementChild;
          assert(ul.nodeName === "UL");
          const images2 = [];
          let li = ul.firstElementChild;
          do {
            const img = li.firstElementChild.firstElementChild.firstElementChild.firstElementChild.lastElementChild;
            assert(img.nodeName === "IMG");
            images2.push(img);
          } while (li = li.nextElementSibling);
          return images2;
        } catch (e) {
          return [].slice.call(buttonParent.firstElementChild.querySelectorAll("img"));
        }
      };
      const [images, setImages] = createSignal(getImages(), {
        equals: (a, b) => a.length === b.length && a.every((img, i) => img === b[i])
      });
      const currentImg = createMemo(() => {
        const img = images()[active()];
        if (!img) return void 0;
        return img.getAttribute("data-transurl") || img.src;
      });
      createEffect(() => {
        for (const img of images()) {
          const div = img.previousSibling;
          if (img.hasAttribute("data-transurl")) {
            const transurl = img.getAttribute("data-transurl");
            if (!translateEnabledMap[transurl]) {
              if (div) div.style.backgroundImage = `url("${transurl}")`;
              img.src = transurl;
              img.removeAttribute("data-transurl");
            }
          } else if (translateEnabledMap[img.src] && translatedMap[img.src]) {
            const ori = img.src;
            img.setAttribute("data-transurl", ori);
            img.src = translatedMap[ori];
            if (div) div.style.backgroundImage = `url("${translatedMap[ori]}")`;
          }
        }
      });
      const getTranslatedImage = async (url, optionsOverwrite) => {
        if (!optionsOverwrite && translatedMap[url]) return translatedMap[url];
        const setStatus = t2 => setTranslateStatusMap(url, () => t2);
        setStatus(t$1("common.source.download-image"));
        if (!originalImageMap[url]) {
          const result = await GMP.xmlHttpRequest({
            method: "GET",
            responseType: "blob",
            url,
            headers: {
              referer: "https://twitter.com/"
            },
            overrideMimeType: "text/plain; charset=x-user-defined",
            onprogress(e) {
              if (e.lengthComputable) {
                setStatus(t$1("common.source.download-image-progress", {
                  progress: formatProgress(e.loaded, e.total)
                }));
              }
            }
          }).catch(e => {
            setStatus(t$1("common.source.download-image-error"));
            throw e;
          });
          originalImageMap[url] = result.response;
        }
        const originalImage = originalImageMap[url];
        const originalSrcSuffix = new URL(url).searchParams.get("format") || url.split(".")[1] || "jpg";
        setStatus(t$1("common.client.resize"));
        await new Promise(resolve => queueMicrotask(resolve));
        const {
          blob: resizedImage,
          suffix: resizedSuffix
        } = await resizeToSubmit(originalImage, originalSrcSuffix);
        setStatus(t$1("common.client.submit"));
        const task = await submitTranslate(resizedImage, resizedSuffix, {
          onProgress(progress) {
            setStatus(t$1("common.client.submit-progress", {
              progress
            }));
          },
          onFinal() {
            setStatus(t$1("common.client.submit-final"));
          }
        }, optionsOverwrite).catch(e => {
          setStatus(t$1("common.client.submit-error"));
          throw e;
        });
        let maskUrl = task.result?.translation_mask;
        if (!maskUrl) {
          setStatus(t$1("common.status.pending"));
          const res = await pullTranslationStatusPolling(task.id, setStatus).catch(e => {
            setStatus(e);
            throw e;
          });
          maskUrl = res.translation_mask;
        }
        setStatus(t$1("common.client.download-image"));
        const mask = await downloadBlob(maskUrl, {
          onProgress(progress) {
            t$1("common.client.download-image-progress", {
              progress
            });
          }
        }).catch(e => {
          setStatus(t$1("common.client.download-image-error"));
          throw e;
        });
        const maskUri = URL.createObjectURL(mask);
        setStatus(t$1("common.client.merging"));
        const canvas = document.createElement("canvas");
        const canvasCtx = canvas.getContext("2d");
        const img = new Image();
        img.src = URL.createObjectURL(resizedImage);
        await new Promise(resolve => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            canvasCtx.drawImage(img, 0, 0);
            resolve(null);
          };
        });
        const img2 = new Image();
        img2.src = maskUri;
        img2.crossOrigin = "anonymous";
        await new Promise(resolve => {
          img2.onload = () => {
            canvasCtx.drawImage(img2, 0, 0);
            resolve(null);
          };
        });
        const translated = await new Promise(resolve => {
          canvas.toBlob(blob => {
            resolve(blob);
          }, "image/png");
        });
        const translatedUri = URL.createObjectURL(translated);
        setTranslatedMap(url, translatedUri);
        setStatus(() => "");
        return translatedUri;
      };
      const enable = async (url, optionsOverwrite) => {
        await getTranslatedImage(url, optionsOverwrite);
        setTranslateEnabledMap(url, true);
      };
      const disable = url => {
        setTranslateEnabledMap(url, false);
      };
      const isEnabled = createMemo(() => {
        const img = currentImg();
        return img ? !!translateEnabledMap[img] : false;
      });
      const transStatus = createMemo(() => {
        const img = currentImg();
        return img ? translateStatusMap[img]?.() : "";
      });
      const isProcessing = createMemo(() => !!transStatus());
      const [advancedMenuOpen, setAdvancedMenuOpen] = createSignal(false);
      const referenceEl = buttonParent.children[2];
      const container = referenceEl.cloneNode(true);
      container.style.top = "48px";
      createEffect(() => {
        container.style.display = currentImg() ? "flex" : "none";
        container.style.alignItems = advancedMenuOpen() ? "start" : "center";
      });
      container.style.flexDirection = "row";
      container.style.flexWrap = "nowrap";
      const child = container.firstChild;
      const referenceChild = referenceEl.firstChild;
      const [backgroundColor, setBackgroundColor] = createSignal(referenceChild.style.backgroundColor);
      buttonParent.appendChild(container);
      const submitTranslateTest = () => {
        const img = currentImg();
        return img && !translateStatusMap[img]?.();
      };
      container.onclick = e => {
        e.stopPropagation();
        if (advancedMenuOpen()) return;
        if (!submitTranslateTest()) return;
        if (isEnabled()) disable(currentImg());else enable(currentImg());
      };
      container.oncontextmenu = e => {
        e.preventDefault();
        e.stopPropagation();
        if (isEnabled()) setAdvancedMenuOpen(false);else setAdvancedMenuOpen(v => !v);
      };
      const spinnerContainer = container.firstChild;
      const disposeProcessingSpinner = render(() => createComponent(Show, {
        get when() {
          return isProcessing();
        },
        get children() {
          const _el$ = _tmpl$$4();
          createRenderEffect(() => className(_el$, tw("absolute inset-0 border-1 border-solid border-x-transparent border-b-transparent border-t-gray-400 rounded-full animate-spin")));
          return _el$;
        }
      }), spinnerContainer);
      onCleanup(disposeProcessingSpinner);
      const svg = container.querySelector("svg");
      const svgParent = svg.parentElement;
      const buttonIconContainer = document.createElement("div");
      svgParent.insertBefore(buttonIconContainer, svg);
      svg.remove();
      const disposeButtonIcon = render(() => createComponent(Dynamic, {
        get component() {
          return isEnabled() ? IconCarbonReset : IconCarbonTranslate;
        },
        get ["class"]() {
          return tw("w-5 h-5 mt-1");
        }
      }), buttonIconContainer);
      onCleanup(disposeButtonIcon);
      const buttonStatusContainer = document.createElement("div");
      container.insertBefore(buttonStatusContainer, container.firstChild);
      const disposeButtonStatus = render(() => {
        const status = createMemo(() => transStatus());
        const [advDetectRes, setAdvDetectRes] = createSignal(detectionResolution());
        const [advRenderTextDir, setAdvRenderTextDir] = createSignal(renderTextOrientation());
        const [advTextDetector, setAdvTextDetector] = createSignal(textDetector());
        const [advTranslator, setAdvTranslator] = createSignal(translatorService());
        const [forceRetry, setForceRetry] = createSignal(false);
        createEffect(prev => {
          const img = currentImg();
          if (prev !== img) {
            setAdvDetectRes(detectionResolution());
            setAdvRenderTextDir(renderTextOrientation());
          }
          return img;
        });
        return (() => {
          const _el$2 = _tmpl$$4();
          insert(_el$2, createComponent(Switch, {
            get children() {
              return [createComponent(Match, {
                get when() {
                  return status();
                },
                get children() {
                  const _el$3 = _tmpl$$4();
                  insert(_el$3, status);
                  createRenderEffect(() => className(_el$3, tw("px-2 py-1")));
                  return _el$3;
                }
              }), createComponent(Match, {
                get when() {
                  return createMemo(() => !!currentImg())() && !translateEnabledMap[currentImg()];
                },
                get children() {
                  return createComponent(Show, {
                    get when() {
                      return advancedMenuOpen();
                    },
                    get fallback() {
                      return createComponent(IconCarbonChevronLeft, {
                        get ["class"]() {
                          return tw("py-1 align-middle cursor-pointer");
                        },
                        onClick: e => {
                          e.stopPropagation();
                          setAdvancedMenuOpen(true);
                        }
                      });
                    },
                    get children() {
                      return [(() => {
                        const _el$4 = _tmpl$2$1(),
                          _el$5 = _el$4.firstChild;
                        _el$4.addEventListener("click", e => {
                          e.stopPropagation();
                          setAdvancedMenuOpen(false);
                        });
                        insert(_el$5, t$1("settings.inline-options-title"));
                        insert(_el$4, createComponent(IconCarbonChevronRight, {
                          get ["class"]() {
                            return tw("align-middle cursor-pointer");
                          }
                        }), null);
                        createRenderEffect(_p$ => {
                          const _v$ = tw("flex justify-between items-center pl-2 py-1"),
                            _v$2 = tw("text-lg");
                          _v$ !== _p$._v$ && className(_el$4, _p$._v$ = _v$);
                          _v$2 !== _p$._v$2 && className(_el$5, _p$._v$2 = _v$2);
                          return _p$;
                        }, {
                          _v$: undefined,
                          _v$2: undefined
                        });
                        return _el$4;
                      })(), (() => {
                        const _el$6 = _tmpl$3$1(),
                          _el$7 = _el$6.firstChild,
                          _el$8 = _el$7.firstChild;
                        insert(_el$6, createComponent(For, {
                          get each() {
                            return [[t$1("settings.detection-resolution"), advDetectRes, setAdvDetectRes, detectResOptions, detectResOptionsMap], [t$1("settings.text-detector"), advTextDetector, setAdvTextDetector, textDetectorOptions, textDetectorOptionsMap], [t$1("settings.translator"), advTranslator, setAdvTranslator, translatorOptions, translatorOptionsMap], [t$1("settings.render-text-orientation"), advRenderTextDir, setAdvRenderTextDir, renderTextDirOptions, renderTextDirOptionsMap]];
                          },
                          children: ([title, opt, setOpt, opts, optMap]) => (() => {
                            const _el$10 = _tmpl$4$1(),
                              _el$11 = _el$10.firstChild,
                              _el$12 = _el$11.nextSibling,
                              _el$13 = _el$12.firstChild;
                            insert(_el$11, title);
                            _el$13.addEventListener("change", e => {
                              setOpt(e.target.value);
                            });
                            insert(_el$13, createComponent(For, {
                              each: opts,
                              children: opt2 => (() => {
                                const _el$14 = _tmpl$5$1();
                                _el$14.value = opt2;
                                insert(_el$14, () =>
                                // @ts-expect-error optMap are incompatible with each other
                                optMap[opt2]());
                                return _el$14;
                              })()
                            }));
                            insert(_el$12, createComponent(IconCarbonChevronDown, {
                              get ["class"]() {
                                return tw("absolute top-1 right-1 pointer-events-none");
                              }
                            }), null);
                            createRenderEffect(_p$ => {
                              const _v$7 = tw("relative px-1"),
                                _v$8 = tw("w-full py-1 appearance-none text-white border-x-0 border-t-0 border-b border-solid border-gray-300 bg-transparent");
                              _v$7 !== _p$._v$7 && className(_el$12, _p$._v$7 = _v$7);
                              _v$8 !== _p$._v$8 && className(_el$13, _p$._v$8 = _v$8);
                              return _p$;
                            }, {
                              _v$7: undefined,
                              _v$8: undefined
                            });
                            createRenderEffect(() => _el$13.value = opt());
                            return _el$10;
                          })()
                        }), _el$7);
                        _el$8.addEventListener("change", e => {
                          setForceRetry(e.target.checked);
                        });
                        _el$8.checked = forceRetry();
                        insert(_el$7, t$1("settings.force-retry"), null);
                        createRenderEffect(_p$ => {
                          const _v$3 = tw("flex flex-col w-48 gap-2 ml-2"),
                            _v$4 = tw("flex items-center cursor-pointer");
                          _v$3 !== _p$._v$3 && className(_el$6, _p$._v$3 = _v$3);
                          _v$4 !== _p$._v$4 && className(_el$7, _p$._v$4 = _v$4);
                          return _p$;
                        }, {
                          _v$3: undefined,
                          _v$4: undefined
                        });
                        return _el$6;
                      })(), (() => {
                        const _el$9 = _tmpl$$4();
                        _el$9.addEventListener("click", e => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (!submitTranslateTest()) return;
                          if (translateEnabledMap[currentImg()]) return;
                          enable(currentImg(), {
                            detectionResolution: advDetectRes(),
                            renderTextOrientation: advRenderTextDir(),
                            textDetector: advTextDetector(),
                            translator: advTranslator(),
                            forceRetry: forceRetry()
                          });
                          setAdvancedMenuOpen(false);
                        });
                        insert(_el$9, t$1("common.control.translate"));
                        createRenderEffect(() => className(_el$9, tw("w-full mt-2 mb-1 py-1 border border-solid border-white rounded-full text-center cursor-pointer")));
                        return _el$9;
                      })()];
                    }
                  });
                }
              })];
            }
          }));
          createRenderEffect(_p$ => {
            const _v$5 = tw("flex flex-col -mr-3 pl-1 pr-2 text-white rounded-2xl cursor-default"),
              _v$6 = backgroundColor();
            _v$5 !== _p$._v$5 && className(_el$2, _p$._v$5 = _v$5);
            _v$6 !== _p$._v$6 && ((_p$._v$6 = _v$6) != null ? _el$2.style.setProperty("background-color", _v$6) : _el$2.style.removeProperty("background-color"));
            return _p$;
          }, {
            _v$5: undefined,
            _v$6: undefined
          });
          return _el$2;
        })();
      }, buttonStatusContainer);
      onCleanup(disposeButtonStatus);
      onCleanup(() => {
        container.remove();
        for (const img of images()) {
          if (img.hasAttribute("data-transurl")) {
            const transurl = img.getAttribute("data-transurl");
            img.src = transurl;
            img.removeAttribute("data-transurl");
          }
        }
        setImages([]);
      });
      return {
        setActive,
        update() {
          if (referenceChild.style.backgroundColor) setBackgroundColor(child.style.backgroundColor = referenceChild.style.backgroundColor);
          setImages(getImages());
        }
      };
    };
    let dialogInstance;
    const rescanLayers = () => {
      const [newDialog] = Array.from(layers().children).filter(el => el.querySelector('[aria-labelledby="modal-header"][role="dialog"]')?.firstChild?.firstChild?.childNodes[2]);
      if (newDialog !== dialog || !newDialog) {
        dialogInstance?.dispose();
        dialogInstance = void 0;
        dialog = newDialog;
        if (!dialog) return;
        dialogInstance = createRoot(dispose => {
          const dialog2 = createDialog();
          return {
            ...dialog2,
            dispose
          };
        });
      }
      const newIndex = Number(location.pathname.match(/\/status\/\d+\/photo\/(\d+)/)?.[1]) - 1;
      dialogInstance.setActive(newIndex);
      dialogInstance.update();
    };
    onCleanup(() => {
      dialogInstance?.dispose();
    });
    let stopLayersObserver;
    const onLayersUpdate = () => {
      stopLayersObserver?.();
      const [, {
        stop
      }] = createMutationObserver(() => layers(), {
        childList: true,
        subtree: true
      }, throttle(() => rescanLayers(), 200));
      stopLayersObserver = stop;
      rescanLayers();
    };
    createEffect(prev => {
      const id = statusId();
      if (!id) stopLayersObserver?.();
      if (id && id !== prev) {
        const layers2 = document.getElementById("layers");
        setLayers(layers2);
        if (layers2) {
          onLayersUpdate();
        } else {
          const [, {
            stop
          }] = createMutationObserver(document.body, {
            childList: true,
            subtree: true
          }, throttle(() => {
            const layers3 = document.getElementById("layers");
            setLayers(layers3);
            if (layers3) {
              onLayersUpdate();
              stop();
            }
          }, 200));
        }
      }
      return id;
    });
    return {
      canKeep(url) {
        switch (keepInstances()) {
          case "until-reload":
            return url.startsWith("https://twitter.com/");
          case "until-navigate":
            return url.startsWith(`https://twitter.com/${mountAuthorId}`);
          default:
            return false;
        }
      },
      onURLChange(url) {
        setStatusId(url.match(/\/status\/(\d+)/)?.[1]);
      }
    };
  }
  const translator$1 = {
    // https://twitter.com/<user>/status/<id>
    match(url) {
      return url.hostname.endsWith("twitter.com") && url.pathname.match(/\/status\//);
    },
    mount: mount$2
  };

  const _tmpl$$3 = /*#__PURE__*/template(`<div><div><h2>`);
  function mount$1() {
    let settingsTab;
    let disposeText;
    const checkTab = () => {
      const tablist = document.querySelector('[role="tablist"]') || document.querySelector('[data-testid="loggedOutPrivacySection"]');
      if (!tablist) {
        if (disposeText) {
          disposeText();
          disposeText = void 0;
        }
        return;
      }
      if (tablist.querySelector(`div[data-imgtrans-settings-${EDITION}]`)) return;
      const inactiveRefrenceEl = Array.from(tablist.children).find(el => el.children.length < 2 && el.querySelector("a"));
      if (!inactiveRefrenceEl) return;
      settingsTab = inactiveRefrenceEl.cloneNode(true);
      settingsTab.setAttribute(`data-imgtrans-settings-${EDITION}`, "true");
      const textEl = settingsTab.querySelector("span");
      if (textEl) {
        while (textEl.firstChild) textEl.removeChild(textEl.firstChild);
        disposeText = render(() => t$1("settings.title")(), textEl);
        onCleanup(disposeText);
      }
      const linkEl = settingsTab.querySelector("a");
      if (linkEl) linkEl.href = `/settings/__imgtrans_${EDITION}`;
      tablist.appendChild(settingsTab);
    };
    let disposeSettings;
    const checkSettings = () => {
      const section = document.querySelector('[data-testid="error-detail"]')?.parentElement?.parentElement;
      if (!section?.querySelector(`[data-imgtrans-settings-${EDITION}-section]`)) {
        if (disposeSettings) {
          disposeSettings();
          disposeSettings = void 0;
        }
        if (!section) return;
      }
      const title = `${t$1("settings.title")()} / Twitter`;
      if (document.title !== title) document.title = title;
      if (disposeSettings) return;
      const errorPage = section.firstChild;
      errorPage.style.display = "none";
      const settingsContainer = document.createElement("div");
      settingsContainer.setAttribute(`data-imgtrans-settings-${EDITION}-section`, "true");
      section.appendChild(settingsContainer);
      const disposeSettingsApp = render(() => {
        onCleanup(() => {
          errorPage.style.display = "";
        });
        return (// r-37j5jr: twitter font
          (() => {
            const _el$ = _tmpl$$3(),
              _el$2 = _el$.firstChild,
              _el$3 = _el$2.firstChild;
            insert(_el$3, t$1("settings.title"));
            insert(_el$, createComponent(Settings, {}), null);
            createRenderEffect(_p$ => {
              const _v$ = `${tw("px-4")} r-37j5jr`,
                _v$2 = tw("flex items-center h-14"),
                _v$3 = tw("text-xl leading-6");
              _v$ !== _p$._v$ && className(_el$, _p$._v$ = _v$);
              _v$2 !== _p$._v$2 && className(_el$2, _p$._v$2 = _v$2);
              _v$3 !== _p$._v$3 && className(_el$3, _p$._v$3 = _v$3);
              return _p$;
            }, {
              _v$: undefined,
              _v$2: undefined,
              _v$3: undefined
            });
            return _el$;
          })()
        );
      }, settingsContainer);
      disposeSettings = () => {
        disposeSettingsApp();
        settingsContainer.remove();
      };
      onCleanup(disposeSettings);
    };
    createMutationObserver(document.body, {
      childList: true,
      subtree: true
    }, throttle(() => {
      if (!location.pathname.startsWith("/settings")) return;
      if (location.pathname === "/settings/profile") return;
      checkTab();
      if (location.pathname.match(`/settings/__imgtrans_${EDITION}`)) {
        if (settingsTab && settingsTab.children.length < 2) {
          settingsTab.style.backgroundColor = "#F7F9F9";
          const activeIndicator = document.createElement("div");
          activeIndicator.className = tw("absolute z-10 inset-0 border-y-0 border-l-0 border-r-2 border-solid border-[#1D9Bf0] pointer-events-none");
          settingsTab.appendChild(activeIndicator);
        }
        checkSettings();
      } else {
        if (settingsTab && settingsTab.children.length > 1) {
          settingsTab.style.backgroundColor = "";
          settingsTab.removeChild(settingsTab.lastChild);
        }
        if (disposeSettings) {
          disposeSettings();
          disposeSettings = void 0;
        }
      }
    }, 200));
    return {
      canKeep(url) {
        return url.includes("twitter.com") && url.includes("/settings");
      }
    };
  }
  const settingsInjector = {
    match(url) {
      return url.hostname.endsWith("twitter.com") && (url.pathname === "/settings" || url.pathname.match(/^\/settings\//)) && url.pathname !== "/settings/profile";
    },
    mount: mount$1
  };

  // src/eventListener.ts
  function makeEventListener(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    return tryOnCleanup(target.removeEventListener.bind(target, type, handler, options));
  }

  const _tmpl$$2 = /*#__PURE__*/template(`<svg viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M3.08 5.62a6.342 6.342 0 0 1 4.456-.33h.003c.638.188 1.153.484 1.547.881c.394.398.624.852.755 1.29c.202.678.18 1.422.168 1.838a5.73 5.73 0 0 0-.005.201v5.503a1 1 0 0 1-1.96.282a8.566 8.566 0 0 1-.08.039c-.964.462-2.397.92-3.877.507c-1.632-.457-2.453-1.81-2.572-3.136c-.114-1.28.41-2.736 1.682-3.448c1.529-.855 3.116-.839 4.262-.64a8.2 8.2 0 0 1 .555.116a2.45 2.45 0 0 0-.09-.689a1.046 1.046 0 0 0-.258-.454c-.121-.122-.325-.263-.69-.37a4.342 4.342 0 0 0-3.048.222a1 1 0 1 1-.848-1.811Zm4.037 4.957c-.884-.153-1.956-.137-2.943.416c-.424.237-.729.83-.667 1.523c.058.647.421 1.193 1.119 1.389c.79.22 1.681-.005 2.473-.385c.367-.176.68-.37.905-.523V10.8a6.321 6.321 0 0 0-.887-.222Zm9.186-3.53a1 1 0 0 1 .65 1.256a7.374 7.374 0 0 0-.155.584a17.546 17.546 0 0 0 1.964-.358a1 1 0 1 1 .476 1.942a20.18 20.18 0 0 1-2.842.473c-.064.338-.119.66-.166.964a5.988 5.988 0 0 1 1.796-.138A1 1 0 0 1 20 12c0 .11-.003.218-.006.326a4.752 4.752 0 0 1 2.103 2.164a4.436 4.436 0 0 1 .17 3.465c-.435 1.182-1.38 2.22-2.82 2.94a1 1 0 1 1-.895-1.79c1.06-.53 1.606-1.209 1.84-1.842a2.437 2.437 0 0 0-.1-1.91a2.723 2.723 0 0 0-.657-.864a8.405 8.405 0 0 1-2.735 4.06l.041.114a1 1 0 0 1-1.746.931a5.325 5.325 0 0 1-.988.32c-.795.17-1.824.148-2.5-.589c-.939-1.026-.863-2.6-.239-3.882c.495-1.017 1.374-1.984 2.638-2.7c.054-.523.133-1.086.239-1.698a19.88 19.88 0 0 1-1.417-.047a1 1 0 0 1 .143-1.995c.531.037 1.087.05 1.652.037c.088-.445.2-.954.324-1.343a1 1 0 0 1 1.256-.65Zm-2.278 8.233c-.344.34-.593.698-.758 1.038c-.424.87-.257 1.451-.095 1.645l.003.001c.027.012.186.085.615-.006c.203-.043.431-.118.674-.227a9.571 9.571 0 0 1-.341-1.478a10.843 10.843 0 0 1-.098-.973Zm2.172 1.205a6.363 6.363 0 0 0 1.568-2.73l-1.651.265a6.47 6.47 0 0 0-.1.036a10.39 10.39 0 0 0 .087 1.905c.028.187.06.361.096.524Z">`);
  const IconFluentTranslate24Filled = ((props = {}) => (() => {
    const _el$ = _tmpl$$2();
    spread(_el$, props, true, true);
    return _el$;
  })());

  const _tmpl$$1 = /*#__PURE__*/template(`<svg viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M7.207 2.543a1 1 0 0 1 0 1.414L5.414 5.75h7.836a8 8 0 1 1-8 8a1 1 0 1 1 2 0a6 6 0 1 0 6-6H5.414l1.793 1.793a1 1 0 0 1-1.414 1.414l-3.5-3.5a1 1 0 0 1 0-1.414l3.5-3.5a1 1 0 0 1 1.414 0Z">`);
  const IconFluentArrowReset24Filled = ((props = {}) => (() => {
    const _el$ = _tmpl$$1();
    spread(_el$, props, true, true);
    return _el$;
  })());

  const _tmpl$ = /*#__PURE__*/template(`<div>`),
    _tmpl$2 = /*#__PURE__*/template(`<div><div>`),
    _tmpl$3 = /*#__PURE__*/template(`<div><label><input type="checkbox">`),
    _tmpl$4 = /*#__PURE__*/template(`<div><div></div><div><select>`),
    _tmpl$5 = /*#__PURE__*/template(`<option>`);
  function mount() {
    const appName = document.querySelector("meta[name~=application-name][content]")?.content;
    const isCalckey = appName === "Calckey";
    const origUrl = new URL(location.href);
    const [translatedMap, setTranslatedMap] = createStore({});
    const [translateStatusMap, setTranslateStatusMap] = createStore({});
    const [translateEnabledMap, setTranslateEnabledMap] = createStore({});
    const originalImageMap = {};
    const [pswp, setPswp] = createSignal(null);
    const updatePswp = () => setPswp(Array.from(document.body.children).find(el => el.classList.contains("pswp")));
    updatePswp();
    if (isCalckey) {
      createMutationObserver(document.body, {
        childList: true
      }, updatePswp);
    }
    const createDialog = () => {
      const [image, setImage] = createSignal(null);
      const [currentImg, setCurrentImage] = createSignal();
      const firstButton = createMemo(() => pswp().querySelector(".pswp__button"));
      const getImage = () => {
        return pswp().querySelector('[aria-hidden="false"] img.pswp__img');
      };
      const updateImage = () => {
        const img = getImage();
        setImage(img);
        setCurrentImage(img ? img.getAttribute("data-transurl") || img.src : void 0);
      };
      updateImage();
      const getActiveContainer = () => pswp().lastElementChild.firstElementChild.firstElementChild.nextElementSibling.firstElementChild;
      const [activeContainer, setActiveContainer] = createSignal(getActiveContainer());
      pswp()?.querySelectorAll(".pswp__button--arrow--prev, .pswp__button--arrow--next").forEach(el => makeEventListener(el, "click", () => {
        setActiveContainer(getActiveContainer());
        updateImage();
      }));
      try {
        createMutationObserver(activeContainer, {
          childList: true
        }, updateImage);
      } catch (e) {}
      createEffect(() => {
        const img = image();
        if (!img) return;
        if (img.hasAttribute("data-transurl")) {
          const transurl = img.getAttribute("data-transurl");
          if (!translateEnabledMap[transurl]) {
            img.src = transurl;
            img.removeAttribute("data-transurl");
          }
        } else if (translateEnabledMap[img.src] && translatedMap[img.src]) {
          const ori = img.src;
          img.setAttribute("data-transurl", ori);
          img.src = translatedMap[ori];
        }
      });
      const getTranslatedImage = async (url, optionsOverwrite) => {
        if (!optionsOverwrite && translatedMap[url]) return translatedMap[url];
        const setStatus = t2 => setTranslateStatusMap(url, () => t2);
        setStatus(t$1("common.source.download-image"));
        if (!originalImageMap[url]) {
          const result = await GMP.xmlHttpRequest({
            method: "GET",
            responseType: "blob",
            url,
            headers: {
              referer: `https://${origUrl.hostname}/`
            },
            overrideMimeType: "text/plain; charset=x-user-defined",
            onprogress(e) {
              if (e.lengthComputable) {
                setStatus(t$1("common.source.download-image-progress", {
                  progress: formatProgress(e.loaded, e.total)
                }));
              }
            }
          }).catch(e => {
            setStatus(t$1("common.source.download-image-error"));
            throw e;
          });
          originalImageMap[url] = result.response;
        }
        const originalImage = originalImageMap[url];
        const originalSrcSuffix = new URL(url).searchParams.get("format") || url.split(".")[1] || "jpg";
        setStatus(t$1("common.client.resize"));
        await new Promise(resolve => queueMicrotask(resolve));
        const {
          blob: resizedImage,
          suffix: resizedSuffix
        } = await resizeToSubmit(originalImage, originalSrcSuffix);
        setStatus(t$1("common.client.submit"));
        const task = await submitTranslate(resizedImage, resizedSuffix, {
          onProgress(progress) {
            setStatus(t$1("common.client.submit-progress", {
              progress
            }));
          },
          onFinal() {
            setStatus(t$1("common.client.submit-final"));
          }
        }, optionsOverwrite).catch(e => {
          setStatus(t$1("common.client.submit-error"));
          throw e;
        });
        let maskUrl = task.result?.translation_mask;
        if (!maskUrl) {
          setStatus(t$1("common.status.pending"));
          const res = await pullTranslationStatusPolling(task.id, setStatus).catch(e => {
            setStatus(e);
            throw e;
          });
          maskUrl = res.translation_mask;
        }
        setStatus(t$1("common.client.download-image"));
        const mask = await downloadBlob(maskUrl, {
          onProgress(progress) {
            t$1("common.client.download-image-progress", {
              progress
            });
          }
        }).catch(e => {
          setStatus(t$1("common.client.download-image-error"));
          throw e;
        });
        const maskUri = URL.createObjectURL(mask);
        setStatus(t$1("common.client.merging"));
        const canvas = document.createElement("canvas");
        const canvasCtx = canvas.getContext("2d");
        const img = new Image();
        img.src = URL.createObjectURL(resizedImage);
        await new Promise(resolve => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            canvasCtx.drawImage(img, 0, 0);
            resolve(null);
          };
        });
        const img2 = new Image();
        img2.src = maskUri;
        img2.crossOrigin = "anonymous";
        await new Promise(resolve => {
          img2.onload = () => {
            canvasCtx.drawImage(img2, 0, 0);
            resolve(null);
          };
        });
        const translated = await new Promise(resolve => {
          canvas.toBlob(blob => {
            resolve(blob);
          }, "image/png");
        });
        const translatedUri = URL.createObjectURL(translated);
        setTranslatedMap(url, translatedUri);
        setStatus(() => "");
        return translatedUri;
      };
      const enable = async (url, optionsOverwrite) => {
        await getTranslatedImage(url, optionsOverwrite);
        setTranslateEnabledMap(url, true);
      };
      const disable = url => {
        setTranslateEnabledMap(url, false);
      };
      const isEnabled = createMemo(() => {
        const img = currentImg();
        return img ? !!translateEnabledMap[img] : false;
      });
      const transStatus = createMemo(() => {
        const img = currentImg();
        return img ? translateStatusMap[img]?.() : "";
      });
      const isProcessing = createMemo(() => !!transStatus());
      const [advancedMenuOpen, setAdvancedMenuOpen] = createSignal(false);
      const container = firstButton().cloneNode(true);
      container.style.display = "flex";
      container.style.justifyContent = "center";
      container.style.alignItems = "center";
      container.style.flexDirection = "row";
      container.style.flexWrap = "nowrap";
      container.style.overflow = "visible";
      container.removeAttribute("title");
      container.removeAttribute("aria-label");
      firstButton().parentElement.insertBefore(container, firstButton());
      const submitTranslateTest = () => {
        const img = currentImg();
        return img && !translateStatusMap[img]?.();
      };
      container.onclick = e => {
        e.stopPropagation();
        if (advancedMenuOpen()) return;
        if (!submitTranslateTest()) return;
        if (isEnabled()) disable(currentImg());else enable(currentImg());
      };
      container.oncontextmenu = e => {
        e.preventDefault();
        e.stopPropagation();
        if (isEnabled()) setAdvancedMenuOpen(false);else setAdvancedMenuOpen(v => !v);
      };
      container.onpointerdown = e => {
        e.stopPropagation();
      };
      const spinnerContainer = container.appendChild(document.createElement("div"));
      const disposeProcessingSpinner = render(() => createComponent(Show, {
        get when() {
          return isProcessing();
        },
        get children() {
          const _el$ = _tmpl$();
          createRenderEffect(() => className(_el$, tw("absolute top-1 -left-px w-7 h-7 m-4 border-1 border-solid border-x-transparent border-b-transparent border-t-white rounded-full animate-spin")));
          return _el$;
        }
      }), spinnerContainer);
      onCleanup(disposeProcessingSpinner);
      const buttonIconContainer = document.createElement("div");
      container.firstElementChild.remove();
      container.appendChild(buttonIconContainer);
      const disposeButtonIcon = render(() => createComponent(Dynamic, {
        get component() {
          return isEnabled() ? IconFluentArrowReset24Filled : IconFluentTranslate24Filled;
        },
        get ["class"]() {
          return tw("text-white stroke-black w-6 h-6 mx-1 mb-1 mt-1.5");
        },
        style: {
          "stroke-width": "0.5px"
        }
      }), buttonIconContainer);
      onCleanup(disposeButtonIcon);
      const buttonStatusContainer = document.createElement("div");
      container.insertBefore(buttonStatusContainer, container.firstChild);
      const disposeButtonStatus = render(() => {
        const status = createMemo(() => transStatus());
        const [advDetectRes, setAdvDetectRes] = createSignal(detectionResolution());
        const [advRenderTextDir, setAdvRenderTextDir] = createSignal(renderTextOrientation());
        const [advTextDetector, setAdvTextDetector] = createSignal(textDetector());
        const [advTranslator, setAdvTranslator] = createSignal(translatorService());
        const [forceRetry, setForceRetry] = createSignal(false);
        createEffect(prev => {
          const img = currentImg();
          if (prev !== img) {
            setAdvDetectRes(detectionResolution());
            setAdvRenderTextDir(renderTextOrientation());
          }
          return img;
        });
        return (() => {
          const _el$2 = _tmpl$();
          insert(_el$2, createComponent(Switch, {
            get children() {
              return [createComponent(Match, {
                get when() {
                  return status();
                },
                get children() {
                  const _el$3 = _tmpl$();
                  insert(_el$3, status);
                  createRenderEffect(() => className(_el$3, tw("mt-1.5 mr-2 px-2 py-1 rounded-2xl whitespace-nowrap bg-gray-500/70")));
                  return _el$3;
                }
              }), createComponent(Match, {
                get when() {
                  return createMemo(() => !!currentImg())() && !translateEnabledMap[currentImg()];
                },
                get children() {
                  return createComponent(Show, {
                    get when() {
                      return advancedMenuOpen();
                    },
                    get fallback() {
                      return createComponent(IconCarbonChevronLeft, {
                        get ["class"]() {
                          return tw("mt-2 w-5 h-5 align-middle cursor-pointer");
                        },
                        onClick: e => {
                          e.stopPropagation();
                          setAdvancedMenuOpen(true);
                        }
                      });
                    },
                    get children() {
                      return [(() => {
                        const _el$4 = _tmpl$2(),
                          _el$5 = _el$4.firstChild;
                        _el$4.addEventListener("click", e => {
                          e.stopPropagation();
                          setAdvancedMenuOpen(false);
                        });
                        insert(_el$5, t$1("settings.inline-options-title"));
                        insert(_el$4, createComponent(IconCarbonChevronRight, {
                          get ["class"]() {
                            return tw("align-middle cursor-pointer");
                          }
                        }), null);
                        createRenderEffect(_p$ => {
                          const _v$ = tw("flex justify-between items-center pl-2 py-1"),
                            _v$2 = tw("text-lg");
                          _v$ !== _p$._v$ && className(_el$4, _p$._v$ = _v$);
                          _v$2 !== _p$._v$2 && className(_el$5, _p$._v$2 = _v$2);
                          return _p$;
                        }, {
                          _v$: undefined,
                          _v$2: undefined
                        });
                        return _el$4;
                      })(), (() => {
                        const _el$6 = _tmpl$3(),
                          _el$7 = _el$6.firstChild,
                          _el$8 = _el$7.firstChild;
                        insert(_el$6, createComponent(For, {
                          get each() {
                            return [[t$1("settings.detection-resolution"), advDetectRes, setAdvDetectRes, detectResOptions, detectResOptionsMap], [t$1("settings.text-detector"), advTextDetector, setAdvTextDetector, textDetectorOptions, textDetectorOptionsMap], [t$1("settings.translator"), advTranslator, setAdvTranslator, translatorOptions, translatorOptionsMap], [t$1("settings.render-text-orientation"), advRenderTextDir, setAdvRenderTextDir, renderTextDirOptions, renderTextDirOptionsMap]];
                          },
                          children: ([title, opt, setOpt, opts, optMap]) => (() => {
                            const _el$10 = _tmpl$4(),
                              _el$11 = _el$10.firstChild,
                              _el$12 = _el$11.nextSibling,
                              _el$13 = _el$12.firstChild;
                            insert(_el$11, title);
                            _el$13.addEventListener("change", e => {
                              setOpt(e.target.value);
                            });
                            insert(_el$13, createComponent(For, {
                              each: opts,
                              children: opt2 => (() => {
                                const _el$14 = _tmpl$5();
                                _el$14.value = opt2;
                                insert(_el$14, () =>
                                // @ts-expect-error optMap are incompatible with each other
                                optMap[opt2]());
                                return _el$14;
                              })()
                            }));
                            insert(_el$12, createComponent(IconCarbonChevronDown, {
                              get ["class"]() {
                                return tw("absolute top-1 right-1 pointer-events-none");
                              }
                            }), null);
                            createRenderEffect(_p$ => {
                              const _v$7 = tw("relative px-1"),
                                _v$8 = tw("w-full py-1 appearance-none text-white border-x-0 border-t-0 border-b border-solid border-gray-300 bg-transparent");
                              _v$7 !== _p$._v$7 && className(_el$12, _p$._v$7 = _v$7);
                              _v$8 !== _p$._v$8 && className(_el$13, _p$._v$8 = _v$8);
                              return _p$;
                            }, {
                              _v$7: undefined,
                              _v$8: undefined
                            });
                            createRenderEffect(() => _el$13.value = opt());
                            return _el$10;
                          })()
                        }), _el$7);
                        _el$8.addEventListener("change", e => {
                          setForceRetry(e.target.checked);
                        });
                        _el$8.checked = forceRetry();
                        insert(_el$7, t$1("settings.force-retry"), null);
                        createRenderEffect(_p$ => {
                          const _v$3 = tw("flex flex-col w-[14rem] gap-2 ml-2"),
                            _v$4 = tw("flex items-center cursor-pointer");
                          _v$3 !== _p$._v$3 && className(_el$6, _p$._v$3 = _v$3);
                          _v$4 !== _p$._v$4 && className(_el$7, _p$._v$4 = _v$4);
                          return _p$;
                        }, {
                          _v$3: undefined,
                          _v$4: undefined
                        });
                        return _el$6;
                      })(), (() => {
                        const _el$9 = _tmpl$();
                        _el$9.addEventListener("click", e => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (!submitTranslateTest()) return;
                          if (translateEnabledMap[currentImg()]) return;
                          enable(currentImg(), {
                            detectionResolution: advDetectRes(),
                            renderTextOrientation: advRenderTextDir(),
                            textDetector: advTextDetector(),
                            translator: advTranslator(),
                            forceRetry: forceRetry()
                          });
                          setAdvancedMenuOpen(false);
                        });
                        insert(_el$9, t$1("common.control.translate"));
                        createRenderEffect(() => className(_el$9, tw("w-full mt-2 mb-1 py-1 border border-solid border-white rounded-full text-center cursor-pointer")));
                        return _el$9;
                      })()];
                    }
                  });
                }
              })];
            }
          }));
          createRenderEffect(_p$ => {
            const _v$5 = tw("absolute top-3.5 right-12 flex flex-col -mr-3 px-1 text-white rounded-2xl cursor-default pointer-events-initial"),
              _v$6 = {
                [tw("bg-gray-500/70")]: advancedMenuOpen()
              };
            _v$5 !== _p$._v$5 && className(_el$2, _p$._v$5 = _v$5);
            _p$._v$6 = classList(_el$2, _v$6, _p$._v$6);
            return _p$;
          }, {
            _v$5: undefined,
            _v$6: undefined
          });
          return _el$2;
        })();
      }, buttonStatusContainer);
      onCleanup(disposeButtonStatus);
      onCleanup(() => {
        container.remove();
        const img = image();
        if (img?.hasAttribute("data-transurl")) {
          const transurl = img.getAttribute("data-transurl");
          img.src = transurl;
          img.removeAttribute("data-transurl");
        }
        setImage(null);
      });
    };
    let disposeDialog;
    createEffect(prev => {
      if (pswp() !== prev || !pswp()) {
        disposeDialog?.();
        disposeDialog = void 0;
        if (!pswp()) return null;
        disposeDialog = createRoot(dispose => {
          createDialog();
          return dispose;
        });
      }
      return pswp();
    }, null);
    onCleanup(() => {
      disposeDialog?.();
    });
    return {
      canKeep(url) {
        const parsed = new URL(url);
        switch (keepInstances()) {
          case "until-reload":
            return origUrl.hostname === parsed.hostname;
          case "until-navigate":
            return pswp();
          default:
            return false;
        }
      },
      onURLChange(url) {
        const parsed = new URL(url);
        if (parsed.hash === "#pswp" || isCalckey) updatePswp();else setPswp(null);
      }
    };
  }
  const translator = {
    // https://misskey.io/<slug>#pswp
    match(url) {
      const appName = document.querySelector("meta[name~=application-name][content]")?.content;
      return appName === "Misskey" && new URL(url).hash === "#pswp" || appName === "Calckey";
    },
    mount
  };

  start([translator$2, translator$1, translator], [settingsInjector$1, settingsInjector]);

})();

/*
                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The GNU General Public License is a free, copyleft license for
software and other kinds of works.

  The licenses for most software and other practical works are designed
to take away your freedom to share and change the works.  By contrast,
the GNU General Public License is intended to guarantee your freedom to
share and change all versions of a program--to make sure it remains free
software for all its users.  We, the Free Software Foundation, use the
GNU General Public License for most of our software; it applies also to
any other work released this way by its authors.  You can apply it to
your programs, too.

  When we speak of free software, we are referring to freedom, not
price.  Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
them if you wish), that you receive source code or can get it if you
want it, that you can change the software or use pieces of it in new
free programs, and that you know you can do these things.

  To protect your rights, we need to prevent others from denying you
these rights or asking you to surrender the rights.  Therefore, you have
certain responsibilities if you distribute copies of the software, or if
you modify it: responsibilities to respect the freedom of others.

  For example, if you distribute copies of such a program, whether
gratis or for a fee, you must pass on to the recipients the same
freedoms that you received.  You must make sure that they, too, receive
or can get the source code.  And you must show them these terms so they
know their rights.

  Developers that use the GNU GPL protect your rights with two steps:
(1) assert copyright on the software, and (2) offer you this License
giving you legal permission to copy, distribute and/or modify it.

  For the developers' and authors' protection, the GPL clearly explains
that there is no warranty for this free software.  For both users' and
authors' sake, the GPL requires that modified versions be marked as
changed, so that their problems will not be attributed erroneously to
authors of previous versions.

  Some devices are designed to deny users access to install or run
modified versions of the software inside them, although the manufacturer
can do so.  This is fundamentally incompatible with the aim of
protecting users' freedom to change the software.  The systematic
pattern of such abuse occurs in the area of products for individuals to
use, which is precisely where it is most unacceptable.  Therefore, we
have designed this version of the GPL to prohibit the practice for those
products.  If such problems arise substantially in other domains, we
stand ready to extend this provision to those domains in future versions
of the GPL, as needed to protect the freedom of users.

  Finally, every program is threatened constantly by software patents.
States should not allow patents to restrict development and use of
software on general-purpose computers, but in those that do, we wish to
avoid the special danger that patents applied to a free program could
make it effectively proprietary.  To prevent this, the GPL assures that
patents cannot be used to render the program non-free.

  The precise terms and conditions for copying, distribution and
modification follow.

                       TERMS AND CONDITIONS

  0. Definitions.

  "This License" refers to version 3 of the GNU General Public License.

  "Copyright" also means copyright-like laws that apply to other kinds of
works, such as semiconductor masks.

  "The Program" refers to any copyrightable work licensed under this
License.  Each licensee is addressed as "you".  "Licensees" and
"recipients" may be individuals or organizations.

  To "modify" a work means to copy from or adapt all or part of the work
in a fashion requiring copyright permission, other than the making of an
exact copy.  The resulting work is called a "modified version" of the
earlier work or a work "based on" the earlier work.

  A "covered work" means either the unmodified Program or a work based
on the Program.

  To "propagate" a work means to do anything with it that, without
permission, would make you directly or secondarily liable for
infringement under applicable copyright law, except executing it on a
computer or modifying a private copy.  Propagation includes copying,
distribution (with or without modification), making available to the
public, and in some countries other activities as well.

  To "convey" a work means any kind of propagation that enables other
parties to make or receive copies.  Mere interaction with a user through
a computer network, with no transfer of a copy, is not conveying.

  An interactive user interface displays "Appropriate Legal Notices"
to the extent that it includes a convenient and prominently visible
feature that (1) displays an appropriate copyright notice, and (2)
tells the user that there is no warranty for the work (except to the
extent that warranties are provided), that licensees may convey the
work under this License, and how to view a copy of this License.  If
the interface presents a list of user commands or options, such as a
menu, a prominent item in the list meets this criterion.

  1. Source Code.

  The "source code" for a work means the preferred form of the work
for making modifications to it.  "Object code" means any non-source
form of a work.

  A "Standard Interface" means an interface that either is an official
standard defined by a recognized standards body, or, in the case of
interfaces specified for a particular programming language, one that
is widely used among developers working in that language.

  The "System Libraries" of an executable work include anything, other
than the work as a whole, that (a) is included in the normal form of
packaging a Major Component, but which is not part of that Major
Component, and (b) serves only to enable use of the work with that
Major Component, or to implement a Standard Interface for which an
implementation is available to the public in source code form.  A
"Major Component", in this context, means a major essential component
(kernel, window system, and so on) of the specific operating system
(if any) on which the executable work runs, or a compiler used to
produce the work, or an object code interpreter used to run it.

  The "Corresponding Source" for a work in object code form means all
the source code needed to generate, install, and (for an executable
work) run the object code and to modify the work, including scripts to
control those activities.  However, it does not include the work's
System Libraries, or general-purpose tools or generally available free
programs which are used unmodified in performing those activities but
which are not part of the work.  For example, Corresponding Source
includes interface definition files associated with source files for
the work, and the source code for shared libraries and dynamically
linked subprograms that the work is specifically designed to require,
such as by intimate data communication or control flow between those
subprograms and other parts of the work.

  The Corresponding Source need not include anything that users
can regenerate automatically from other parts of the Corresponding
Source.

  The Corresponding Source for a work in source code form is that
same work.

  2. Basic Permissions.

  All rights granted under this License are granted for the term of
copyright on the Program, and are irrevocable provided the stated
conditions are met.  This License explicitly affirms your unlimited
permission to run the unmodified Program.  The output from running a
covered work is covered by this License only if the output, given its
content, constitutes a covered work.  This License acknowledges your
rights of fair use or other equivalent, as provided by copyright law.

  You may make, run and propagate covered works that you do not
convey, without conditions so long as your license otherwise remains
in force.  You may convey covered works to others for the sole purpose
of having them make modifications exclusively for you, or provide you
with facilities for running those works, provided that you comply with
the terms of this License in conveying all material for which you do
not control copyright.  Those thus making or running the covered works
for you must do so exclusively on your behalf, under your direction
and control, on terms that prohibit them from making any copies of
your copyrighted material outside their relationship with you.

  Conveying under any other circumstances is permitted solely under
the conditions stated below.  Sublicensing is not allowed; section 10
makes it unnecessary.

  3. Protecting Users' Legal Rights From Anti-Circumvention Law.

  No covered work shall be deemed part of an effective technological
measure under any applicable law fulfilling obligations under article
11 of the WIPO copyright treaty adopted on 20 December 1996, or
similar laws prohibiting or restricting circumvention of such
measures.

  When you convey a covered work, you waive any legal power to forbid
circumvention of technological measures to the extent such circumvention
is effected by exercising rights under this License with respect to
the covered work, and you disclaim any intention to limit operation or
modification of the work as a means of enforcing, against the work's
users, your or third parties' legal rights to forbid circumvention of
technological measures.

  4. Conveying Verbatim Copies.

  You may convey verbatim copies of the Program's source code as you
receive it, in any medium, provided that you conspicuously and
appropriately publish on each copy an appropriate copyright notice;
keep intact all notices stating that this License and any
non-permissive terms added in accord with section 7 apply to the code;
keep intact all notices of the absence of any warranty; and give all
recipients a copy of this License along with the Program.

  You may charge any price or no price for each copy that you convey,
and you may offer support or warranty protection for a fee.

  5. Conveying Modified Source Versions.

  You may convey a work based on the Program, or the modifications to
produce it from the Program, in the form of source code under the
terms of section 4, provided that you also meet all of these conditions:

    a) The work must carry prominent notices stating that you modified
    it, and giving a relevant date.

    b) The work must carry prominent notices stating that it is
    released under this License and any conditions added under section
    7.  This requirement modifies the requirement in section 4 to
    "keep intact all notices".

    c) You must license the entire work, as a whole, under this
    License to anyone who comes into possession of a copy.  This
    License will therefore apply, along with any applicable section 7
    additional terms, to the whole of the work, and all its parts,
    regardless of how they are packaged.  This License gives no
    permission to license the work in any other way, but it does not
    invalidate such permission if you have separately received it.

    d) If the work has interactive user interfaces, each must display
    Appropriate Legal Notices; however, if the Program has interactive
    interfaces that do not display Appropriate Legal Notices, your
    work need not make them do so.

  A compilation of a covered work with other separate and independent
works, which are not by their nature extensions of the covered work,
and which are not combined with it such as to form a larger program,
in or on a volume of a storage or distribution medium, is called an
"aggregate" if the compilation and its resulting copyright are not
used to limit the access or legal rights of the compilation's users
beyond what the individual works permit.  Inclusion of a covered work
in an aggregate does not cause this License to apply to the other
parts of the aggregate.

  6. Conveying Non-Source Forms.

  You may convey a covered work in object code form under the terms
of sections 4 and 5, provided that you also convey the
machine-readable Corresponding Source under the terms of this License,
in one of these ways:

    a) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by the
    Corresponding Source fixed on a durable physical medium
    customarily used for software interchange.

    b) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by a
    written offer, valid for at least three years and valid for as
    long as you offer spare parts or customer support for that product
    model, to give anyone who possesses the object code either (1) a
    copy of the Corresponding Source for all the software in the
    product that is covered by this License, on a durable physical
    medium customarily used for software interchange, for a price no
    more than your reasonable cost of physically performing this
    conveying of source, or (2) access to copy the
    Corresponding Source from a network server at no charge.

    c) Convey individual copies of the object code with a copy of the
    written offer to provide the Corresponding Source.  This
    alternative is allowed only occasionally and noncommercially, and
    only if you received the object code with such an offer, in accord
    with subsection 6b.

    d) Convey the object code by offering access from a designated
    place (gratis or for a charge), and offer equivalent access to the
    Corresponding Source in the same way through the same place at no
    further charge.  You need not require recipients to copy the
    Corresponding Source along with the object code.  If the place to
    copy the object code is a network server, the Corresponding Source
    may be on a different server (operated by you or a third party)
    that supports equivalent copying facilities, provided you maintain
    clear directions next to the object code saying where to find the
    Corresponding Source.  Regardless of what server hosts the
    Corresponding Source, you remain obligated to ensure that it is
    available for as long as needed to satisfy these requirements.

    e) Convey the object code using peer-to-peer transmission, provided
    you inform other peers where the object code and Corresponding
    Source of the work are being offered to the general public at no
    charge under subsection 6d.

  A separable portion of the object code, whose source code is excluded
from the Corresponding Source as a System Library, need not be
included in conveying the object code work.

  A "User Product" is either (1) a "consumer product", which means any
tangible personal property which is normally used for personal, family,
or household purposes, or (2) anything designed or sold for incorporation
into a dwelling.  In determining whether a product is a consumer product,
doubtful cases shall be resolved in favor of coverage.  For a particular
product received by a particular user, "normally used" refers to a
typical or common use of that class of product, regardless of the status
of the particular user or of the way in which the particular user
actually uses, or expects or is expected to use, the product.  A product
is a consumer product regardless of whether the product has substantial
commercial, industrial or non-consumer uses, unless such uses represent
the only significant mode of use of the product.

  "Installation Information" for a User Product means any methods,
procedures, authorization keys, or other information required to install
and execute modified versions of a covered work in that User Product from
a modified version of its Corresponding Source.  The information must
suffice to ensure that the continued functioning of the modified object
code is in no case prevented or interfered with solely because
modification has been made.

  If you convey an object code work under this section in, or with, or
specifically for use in, a User Product, and the conveying occurs as
part of a transaction in which the right of possession and use of the
User Product is transferred to the recipient in perpetuity or for a
fixed term (regardless of how the transaction is characterized), the
Corresponding Source conveyed under this section must be accompanied
by the Installation Information.  But this requirement does not apply
if neither you nor any third party retains the ability to install
modified object code on the User Product (for example, the work has
been installed in ROM).

  The requirement to provide Installation Information does not include a
requirement to continue to provide support service, warranty, or updates
for a work that has been modified or installed by the recipient, or for
the User Product in which it has been modified or installed.  Access to a
network may be denied when the modification itself materially and
adversely affects the operation of the network or violates the rules and
protocols for communication across the network.

  Corresponding Source conveyed, and Installation Information provided,
in accord with this section must be in a format that is publicly
documented (and with an implementation available to the public in
source code form), and must require no special password or key for
unpacking, reading or copying.

  7. Additional Terms.

  "Additional permissions" are terms that supplement the terms of this
License by making exceptions from one or more of its conditions.
Additional permissions that are applicable to the entire Program shall
be treated as though they were included in this License, to the extent
that they are valid under applicable law.  If additional permissions
apply only to part of the Program, that part may be used separately
under those permissions, but the entire Program remains governed by
this License without regard to the additional permissions.

  When you convey a copy of a covered work, you may at your option
remove any additional permissions from that copy, or from any part of
it.  (Additional permissions may be written to require their own
removal in certain cases when you modify the work.)  You may place
additional permissions on material, added by you to a covered work,
for which you have or can give appropriate copyright permission.

  Notwithstanding any other provision of this License, for material you
add to a covered work, you may (if authorized by the copyright holders of
that material) supplement the terms of this License with terms:

    a) Disclaiming warranty or limiting liability differently from the
    terms of sections 15 and 16 of this License; or

    b) Requiring preservation of specified reasonable legal notices or
    author attributions in that material or in the Appropriate Legal
    Notices displayed by works containing it; or

    c) Prohibiting misrepresentation of the origin of that material, or
    requiring that modified versions of such material be marked in
    reasonable ways as different from the original version; or

    d) Limiting the use for publicity purposes of names of licensors or
    authors of the material; or

    e) Declining to grant rights under trademark law for use of some
    trade names, trademarks, or service marks; or

    f) Requiring indemnification of licensors and authors of that
    material by anyone who conveys the material (or modified versions of
    it) with contractual assumptions of liability to the recipient, for
    any liability that these contractual assumptions directly impose on
    those licensors and authors.

  All other non-permissive additional terms are considered "further
restrictions" within the meaning of section 10.  If the Program as you
received it, or any part of it, contains a notice stating that it is
governed by this License along with a term that is a further
restriction, you may remove that term.  If a license document contains
a further restriction but permits relicensing or conveying under this
License, you may add to a covered work material governed by the terms
of that license document, provided that the further restriction does
not survive such relicensing or conveying.

  If you add terms to a covered work in accord with this section, you
must place, in the relevant source files, a statement of the
additional terms that apply to those files, or a notice indicating
where to find the applicable terms.

  Additional terms, permissive or non-permissive, may be stated in the
form of a separately written license, or stated as exceptions;
the above requirements apply either way.

  8. Termination.

  You may not propagate or modify a covered work except as expressly
provided under this License.  Any attempt otherwise to propagate or
modify it is void, and will automatically terminate your rights under
this License (including any patent licenses granted under the third
paragraph of section 11).

  However, if you cease all violation of this License, then your
license from a particular copyright holder is reinstated (a)
provisionally, unless and until the copyright holder explicitly and
finally terminates your license, and (b) permanently, if the copyright
holder fails to notify you of the violation by some reasonable means
prior to 60 days after the cessation.

  Moreover, your license from a particular copyright holder is
reinstated permanently if the copyright holder notifies you of the
violation by some reasonable means, this is the first time you have
received notice of violation of this License (for any work) from that
copyright holder, and you cure the violation prior to 30 days after
your receipt of the notice.

  Termination of your rights under this section does not terminate the
licenses of parties who have received copies or rights from you under
this License.  If your rights have been terminated and not permanently
reinstated, you do not qualify to receive new licenses for the same
material under section 10.

  9. Acceptance Not Required for Having Copies.

  You are not required to accept this License in order to receive or
run a copy of the Program.  Ancillary propagation of a covered work
occurring solely as a consequence of using peer-to-peer transmission
to receive a copy likewise does not require acceptance.  However,
nothing other than this License grants you permission to propagate or
modify any covered work.  These actions infringe copyright if you do
not accept this License.  Therefore, by modifying or propagating a
covered work, you indicate your acceptance of this License to do so.

  10. Automatic Licensing of Downstream Recipients.

  Each time you convey a covered work, the recipient automatically
receives a license from the original licensors, to run, modify and
propagate that work, subject to this License.  You are not responsible
for enforcing compliance by third parties with this License.

  An "entity transaction" is a transaction transferring control of an
organization, or substantially all assets of one, or subdividing an
organization, or merging organizations.  If propagation of a covered
work results from an entity transaction, each party to that
transaction who receives a copy of the work also receives whatever
licenses to the work the party's predecessor in interest had or could
give under the previous paragraph, plus a right to possession of the
Corresponding Source of the work from the predecessor in interest, if
the predecessor has it or can get it with reasonable efforts.

  You may not impose any further restrictions on the exercise of the
rights granted or affirmed under this License.  For example, you may
not impose a license fee, royalty, or other charge for exercise of
rights granted under this License, and you may not initiate litigation
(including a cross-claim or counterclaim in a lawsuit) alleging that
any patent claim is infringed by making, using, selling, offering for
sale, or importing the Program or any portion of it.

  11. Patents.

  A "contributor" is a copyright holder who authorizes use under this
License of the Program or a work on which the Program is based.  The
work thus licensed is called the contributor's "contributor version".

  A contributor's "essential patent claims" are all patent claims
owned or controlled by the contributor, whether already acquired or
hereafter acquired, that would be infringed by some manner, permitted
by this License, of making, using, or selling its contributor version,
but do not include claims that would be infringed only as a
consequence of further modification of the contributor version.  For
purposes of this definition, "control" includes the right to grant
patent sublicenses in a manner consistent with the requirements of
this License.

  Each contributor grants you a non-exclusive, worldwide, royalty-free
patent license under the contributor's essential patent claims, to
make, use, sell, offer for sale, import and otherwise run, modify and
propagate the contents of its contributor version.

  In the following three paragraphs, a "patent license" is any express
agreement or commitment, however denominated, not to enforce a patent
(such as an express permission to practice a patent or covenant not to
sue for patent infringement).  To "grant" such a patent license to a
party means to make such an agreement or commitment not to enforce a
patent against the party.

  If you convey a covered work, knowingly relying on a patent license,
and the Corresponding Source of the work is not available for anyone
to copy, free of charge and under the terms of this License, through a
publicly available network server or other readily accessible means,
then you must either (1) cause the Corresponding Source to be so
available, or (2) arrange to deprive yourself of the benefit of the
patent license for this particular work, or (3) arrange, in a manner
consistent with the requirements of this License, to extend the patent
license to downstream recipients.  "Knowingly relying" means you have
actual knowledge that, but for the patent license, your conveying the
covered work in a country, or your recipient's use of the covered work
in a country, would infringe one or more identifiable patents in that
country that you have reason to believe are valid.

  If, pursuant to or in connection with a single transaction or
arrangement, you convey, or propagate by procuring conveyance of, a
covered work, and grant a patent license to some of the parties
receiving the covered work authorizing them to use, propagate, modify
or convey a specific copy of the covered work, then the patent license
you grant is automatically extended to all recipients of the covered
work and works based on it.

  A patent license is "discriminatory" if it does not include within
the scope of its coverage, prohibits the exercise of, or is
conditioned on the non-exercise of one or more of the rights that are
specifically granted under this License.  You may not convey a covered
work if you are a party to an arrangement with a third party that is
in the business of distributing software, under which you make payment
to the third party based on the extent of your activity of conveying
the work, and under which the third party grants, to any of the
parties who would receive the covered work from you, a discriminatory
patent license (a) in connection with copies of the covered work
conveyed by you (or copies made from those copies), or (b) primarily
for and in connection with specific products or compilations that
contain the covered work, unless you entered into that arrangement,
or that patent license was granted, prior to 28 March 2007.

  Nothing in this License shall be construed as excluding or limiting
any implied license or other defenses to infringement that may
otherwise be available to you under applicable patent law.

  12. No Surrender of Others' Freedom.

  If conditions are imposed on you (whether by court order, agreement or
otherwise) that contradict the conditions of this License, they do not
excuse you from the conditions of this License.  If you cannot convey a
covered work so as to satisfy simultaneously your obligations under this
License and any other pertinent obligations, then as a consequence you may
not convey it at all.  For example, if you agree to terms that obligate you
to collect a royalty for further conveying from those to whom you convey
the Program, the only way you could satisfy both those terms and this
License would be to refrain entirely from conveying the Program.

  13. Use with the GNU Affero General Public License.

  Notwithstanding any other provision of this License, you have
permission to link or combine any covered work with a work licensed
under version 3 of the GNU Affero General Public License into a single
combined work, and to convey the resulting work.  The terms of this
License will continue to apply to the part which is the covered work,
but the special requirements of the GNU Affero General Public License,
section 13, concerning interaction through a network will apply to the
combination as such.

  14. Revised Versions of this License.

  The Free Software Foundation may publish revised and/or new versions of
the GNU General Public License from time to time.  Such new versions will
be similar in spirit to the present version, but may differ in detail to
address new problems or concerns.

  Each version is given a distinguishing version number.  If the
Program specifies that a certain numbered version of the GNU General
Public License "or any later version" applies to it, you have the
option of following the terms and conditions either of that numbered
version or of any later version published by the Free Software
Foundation.  If the Program does not specify a version number of the
GNU General Public License, you may choose any version ever published
by the Free Software Foundation.

  If the Program specifies that a proxy can decide which future
versions of the GNU General Public License can be used, that proxy's
public statement of acceptance of a version permanently authorizes you
to choose that version for the Program.

  Later license versions may give you additional or different
permissions.  However, no additional obligations are imposed on any
author or copyright holder as a result of your choosing to follow a
later version.

  15. Disclaimer of Warranty.

  THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
APPLICABLE LAW.  EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT
HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY
OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM
IS WITH YOU.  SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF
ALL NECESSARY SERVICING, REPAIR OR CORRECTION.

  16. Limitation of Liability.

  IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING
WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MODIFIES AND/OR CONVEYS
THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY
GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE
USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED TO LOSS OF
DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD
PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER PROGRAMS),
EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF
SUCH DAMAGES.

  17. Interpretation of Sections 15 and 16.

  If the disclaimer of warranty and limitation of liability provided
above cannot be given local legal effect according to their terms,
reviewing courts shall apply local law that most closely approximates
an absolute waiver of all civil liability in connection with the
Program, unless a warranty or assumption of liability accompanies a
copy of the Program in return for a fee.

                     END OF TERMS AND CONDITIONS

            How to Apply These Terms to Your New Programs

  If you develop a new program, and you want it to be of the greatest
possible use to the public, the best way to achieve this is to make it
free software which everyone can redistribute and change under these terms.

  To do so, attach the following notices to the program.  It is safest
to attach them to the start of each source file to most effectively
state the exclusion of warranty; and each file should have at least
the "copyright" line and a pointer to where the full notice is found.

    <one line to give the program's name and a brief idea of what it does.>
    Copyright (C) <year>  <name of author>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

Also add information on how to contact you by electronic and paper mail.

  If the program does terminal interaction, make it output a short
notice like this when it starts in an interactive mode:

    <program>  Copyright (C) <year>  <name of author>
    This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.

The hypothetical commands `show w' and `show c' should show the appropriate
parts of the General Public License.  Of course, your program's commands
might be different; for a GUI interface, you would use an "about box".

  You should also get your employer (if you work as a programmer) or school,
if any, to sign a "copyright disclaimer" for the program, if necessary.
For more information on this, and how to apply and follow the GNU GPL, see
<https://www.gnu.org/licenses/>.

  The GNU General Public License does not permit incorporating your program
into proprietary programs.  If your program is a subroutine library, you
may consider it more useful to permit linking proprietary applications with
the library.  If this is what you want to do, use the GNU Lesser General
Public License instead of this License.  But first, please read
<https://www.gnu.org/licenses/why-not-lgpl.html>.
*/

/*
MIT License

Copyright (c) 2021 Solid Primitives Working Group

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
MIT License

Copyright (c) 2022 [these people](https://github.com/tw-in-js/twind/graphs/contributors)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
MIT License

Copyright (c) 2016-2023 Ryan Carniato

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
Copyright (c) 2017-2018 Fredrik Nicol

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
The MIT License (MIT)

Copyright (c) 2020-2022 Kristóf Poduszló

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
MIT License Copyright (c) 2023 Alexis Munsayac <alexis.munsayac@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice (including the next paragraph) shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
